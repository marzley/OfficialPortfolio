<?php
// Shared code for the client portal. Loaded by api.php only.
if (!defined('MARZLEY_PORTAL')) {
    http_response_code(404);
    exit;
}

const SCHEMA_VERSION = 2;
const PROJECT_STATUSES = ['planning', 'design', 'build', 'review', 'live', 'on_hold'];
const INVOICE_STATUSES = ['unpaid', 'paid', 'cancelled'];

/** The site folder (public_html) and the private folder above it. */
function site_root(): string { return dirname(__DIR__); }
function private_dir(): string {
    $up = dirname(site_root());
    return is_writable($up) ? $up : site_root();
}

/** Settings from portal-config.php, kept one folder above public_html. */
function config(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    foreach (array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(site_root()) . '/portal-config.php', site_root() . '/portal-config.php']) as $file) {
        if (is_readable($file)) { $cfg = include $file; break; }
    }
    if (!is_array($cfg)) fail(503, 'The client portal is not set up yet.');
    $cfg += [
        'admin_emails' => [], 'google_client_id' => '', 'storage_dir' => private_dir() . '/portal-files', 'dev_login' => false,
        'environment' => 'production',          // 'staging' adds a banner, "[STAGING]" email subjects and uses the M-Pesa sandbox
        'admin_idle_minutes' => 30, 'client_idle_minutes' => 240,
        'backup_dir' => private_dir() . '/portal-backups', 'backup_keep_days' => 14,
        'smtp' => null, 'sms' => null,
        'business_name' => 'Marzley Tech Solutions', 'kra_pin' => '', 'etims' => false,
    ];
    $cfg['admin_emails'] = array_map('strtolower', $cfg['admin_emails']);
    // All dates in the portal (activity log, invoices, reminders) are Kenya time
    date_default_timezone_set($cfg['timezone'] ?? 'Africa/Nairobi');
    return $cfg;
}

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $cfg = config();
    try {
        $pdo = new PDO($cfg['db_dsn'], $cfg['db_user'] ?? null, $cfg['db_pass'] ?? null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        report_error('portal database', $e->getMessage());
        fail(503, 'The client portal database is not available right now.');
    }
    migrate($pdo);
    return $pdo;
}

function q(string $sql, array $args = []): PDOStatement {
    $st = db()->prepare($sql);
    $st->execute($args);
    return $st;
}

function now(): string { return date('Y-m-d H:i:s'); }

function out($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $code, string $message): void {
    // Scripts that must never stop half way (M-Pesa callback, cron jobs) get an exception instead
    if (defined('MARZLEY_NO_EXIT')) throw new RuntimeException($message, $code);
    out(['error' => $message], $code);
}

function is_staging(): bool { return (config()['environment'] ?? '') === 'staging'; }

// ---------- database upgrades ----------

/** Create any tables added after the first install. Safe to run many times. */
function migrate(PDO $pdo): void {
    try {
        $v = (int)($pdo->query("SELECT v FROM settings WHERE k = 'schema_version'")->fetchColumn() ?: 0);
    } catch (PDOException $e) {
        $v = 0;
    }
    if ($v >= SCHEMA_VERSION) return;
    $sqlite = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
    $id = $sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT UNSIGNED AUTO_INCREMENT PRIMARY KEY';
    $uint = $sqlite ? 'INTEGER' : 'INT UNSIGNED';
    $end = $sqlite ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';
    $tables = [
        "CREATE TABLE IF NOT EXISTS settings (k VARCHAR(190) NOT NULL PRIMARY KEY, v TEXT NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS audit_log (id $id, actor VARCHAR(190) NOT NULL, action VARCHAR(60) NOT NULL, detail VARCHAR(500) NOT NULL DEFAULT '', ip VARCHAR(45) NOT NULL DEFAULT '', created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS recurring_invoices (id $id, client_id $uint NOT NULL, project_id $uint NULL, description VARCHAR(300) NOT NULL, amount $uint NOT NULL, day_of_month $uint NOT NULL DEFAULT 1, due_days $uint NOT NULL DEFAULT 7, next_date DATE NOT NULL, active $uint NOT NULL DEFAULT 1, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS reminders (id $id, kind VARCHAR(30) NOT NULL, ref_id $uint NOT NULL, stage VARCHAR(30) NOT NULL, sent_at DATETIME NOT NULL, UNIQUE (kind, ref_id, stage))$end",
    ];
    foreach ($tables as $sql) $pdo->exec($sql);
    try { $pdo->exec('CREATE INDEX audit_created ON audit_log (created_at)'); } catch (PDOException $e) { /* already there */ }
    $pdo->prepare($sqlite ? 'INSERT OR REPLACE INTO settings (k, v) VALUES (?, ?)' : 'REPLACE INTO settings (k, v) VALUES (?, ?)')
        ->execute(['schema_version', (string)SCHEMA_VERSION]);
}

function setting(string $k, ?string $default = null): ?string {
    $r = q('SELECT v FROM settings WHERE k = ?', [$k])->fetch();
    return $r ? $r['v'] : $default;
}

function set_setting(string $k, string $v): void {
    q('DELETE FROM settings WHERE k = ?', [$k]);
    q('INSERT INTO settings (k, v) VALUES (?, ?)', [$k, $v]);
}

// ---------- activity log ----------

/** Record who did what. Never fails the request. */
function audit(string $action, string $detail = '', ?string $actor = null): void {
    try {
        $actor = $actor ?? (current_user()['email'] ?? 'system');
        q('INSERT INTO audit_log (actor, action, detail, ip, created_at) VALUES (?, ?, ?, ?, ?)',
            [mb_substr($actor, 0, 190), mb_substr($action, 0, 60), mb_substr($detail, 0, 500), substr((string)($_SERVER['REMOTE_ADDR'] ?? 'cli'), 0, 45), now()]);
    } catch (Throwable $e) {
        error_log('portal audit: ' . $e->getMessage());
    }
}

// ---------- error alerts ----------

/** Log a server error and email the admins, at most once an hour. */
function report_error(string $where, string $message): void {
    error_log("marzley $where: $message");
    $stamp = private_dir() . '/.last-error-alert';
    if (is_file($stamp) && time() - (int)@filemtime($stamp) < 3600) return;
    @touch($stamp);
    try {
        foreach (config()['admin_emails'] as $email) {
            send_mail($email, 'Website error: ' . $where, "Something went wrong on the website.\n\nWhere: $where\nWhen: " . date('Y-m-d H:i:s') .
                "\nError: $message\n\nCheck the error log in cPanel > Metrics > Errors. You will get at most one of these emails per hour.", false);
        }
    } catch (Throwable $e) { /* never loop */ }
}

function install_error_alerts(string $where): void {
    set_exception_handler(function (Throwable $e) use ($where) {
        report_error($where, get_class($e) . ': ' . $e->getMessage() . ' in ' . basename($e->getFile()) . ':' . $e->getLine());
        if (PHP_SAPI !== 'cli' && !headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Something went wrong on our side. We have been alerted. Please try again shortly.']);
        }
    });
    register_shutdown_function(function () use ($where) {
        $e = error_get_last();
        if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
            report_error($where, $e['message'] . ' in ' . basename($e['file']) . ':' . $e['line']);
        }
    });
}

// ---------- sessions and sign-in ----------

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('marzley_portal');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/portal/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
    // Sign out after a period of inactivity: 30 minutes for staff, 4 hours for clients (see config)
    $u = $_SESSION['user'] ?? null;
    $idle = 60 * (int)(($u['role'] ?? '') === 'admin' ? config()['admin_idle_minutes'] : config()['client_idle_minutes']);
    $expired = isset($_SESSION['seen']) && time() - $_SESSION['seen'] > $idle;
    // "Sign out everywhere" raises this person's session number; older sessions stop working
    $why = $expired ? 'idle' : null;
    if ($u && !$expired && (int)($_SESSION['epoch'] ?? 0) !== session_epoch($u['email'])) { $expired = true; $why = 'everywhere'; }
    if ($expired) {
        $_SESSION = $u ? ['expired' => $why] : [];
        session_regenerate_id(true);
    }
    $_SESSION['seen'] = time();
}

function expired_message(): ?string {
    $why = $_SESSION['expired'] ?? null;
    if ($why === 'idle') return 'For your security you were signed out after a period of inactivity. Please sign in again.';
    if ($why === 'everywhere') return 'You were signed out on all devices. Please sign in again.';
    return null;
}

function session_epoch(string $email): int { return (int)setting('epoch:' . strtolower($email), '0'); }

/** The signed-in person: ['email', 'name', 'role' => 'admin'|'client', 'client_id'] or null. */
function current_user(): ?array { return $_SESSION['user'] ?? null; }

function require_user(): array {
    $u = current_user();
    if (!$u) fail(401, expired_message() ?? 'Please sign in.');
    return $u;
}

function require_admin(): array {
    $u = require_user();
    if ($u['role'] !== 'admin') fail(403, 'Only Marzley Tech staff can do that.');
    return $u;
}

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function check_csrf(): void {
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$sent || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $sent)) fail(403, 'Your session expired. Please reload the page.');
}

/** Check a Google sign-in token with Google and return its verified claims. */
function verify_google_token(string $token): array {
    $cfg = config();
    if (!$cfg['google_client_id']) fail(503, 'Google sign-in is not configured.');
    $ch = curl_init('https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($token));
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15]);
    $raw = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $claims = $raw ? json_decode($raw, true) : null;
    if ($status !== 200 || !is_array($claims)) fail(401, 'Google sign-in could not be verified. Please try again.');
    $issuerOk = in_array($claims['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true);
    $verified = ($claims['email_verified'] ?? '') === 'true' || ($claims['email_verified'] ?? false) === true;
    if (($claims['aud'] ?? '') !== $cfg['google_client_id'] || !$issuerOk || (int)($claims['exp'] ?? 0) < time() || !$verified || empty($claims['email'])) {
        fail(401, 'Google sign-in could not be verified. Please try again.');
    }
    return $claims;
}

/** Turn a verified email into a portal user, or refuse if they are not a client. */
function sign_in(string $email, string $name): array {
    $email = strtolower(trim($email));
    if (in_array($email, config()['admin_emails'], true)) {
        $user = ['email' => $email, 'name' => $name, 'role' => 'admin', 'client_id' => null];
    } else {
        $client = q('SELECT id, name FROM clients WHERE email = ?', [$email])->fetch();
        if (!$client) fail(403, 'This Google account is not linked to a Marzley Tech project yet. Contact us on WhatsApp +254 745 789 590 to get access.');
        $user = ['email' => $email, 'name' => $client['name'] ?: $name, 'role' => 'client', 'client_id' => (int)$client['id']];
    }
    session_regenerate_id(true);
    $_SESSION['user'] = $user;
    $_SESSION['epoch'] = session_epoch($email);
    unset($_SESSION['csrf'], $_SESSION['expired']);
    audit('sign_in', $user['role'], $email);
    return $user;
}

// ---------- input helpers ----------

function body(): array {
    $data = json_decode(file_get_contents('php://input') ?: '[]', true);
    return is_array($data) ? $data : [];
}

function str_in(array $d, string $key, int $max, bool $required = true): string {
    $v = trim((string)($d[$key] ?? ''));
    if ($required && $v === '') fail(400, "Please fill in $key.");
    if (mb_strlen($v) > $max) fail(400, "$key is too long.");
    return $v;
}

function int_in(array $d, string $key, int $min, int $max): int {
    if (!isset($d[$key]) || !is_numeric($d[$key])) fail(400, "Please enter a number for $key.");
    $v = (int)$d[$key];
    if ($v < $min || $v > $max) fail(400, "$key must be between $min and $max.");
    return $v;
}

function date_in(array $d, string $key): ?string {
    $v = trim((string)($d[$key] ?? ''));
    if ($v === '') return null;
    $dt = DateTime::createFromFormat('Y-m-d', $v);
    if (!$dt || $dt->format('Y-m-d') !== $v) fail(400, "$key must be a date.");
    return $v;
}

function normalise_phone(string $raw): ?string {
    $d = preg_replace('/\D/', '', $raw);
    if (preg_match('/^0([17]\d{8})$/', $d, $m)) return '254' . $m[1];
    if (preg_match('/^254[17]\d{8}$/', $d)) return $d;
    if (preg_match('/^([17]\d{8})$/', $d, $m)) return '254' . $m[1];
    return null;
}

// ---------- M-Pesa ----------

function mpesa_config(): ?array {
    foreach (array_filter([getenv('MPESA_CONFIG') ?: ($_SERVER['MPESA_CONFIG'] ?? null), dirname(site_root()) . '/mpesa-config.php', site_root() . '/mpesa-config.php']) as $file) {
        if (is_readable($file)) {
            $c = include $file;
            if (is_array($c) && !empty($c['consumer_key']) && !empty($c['passkey']) && !empty($c['callback_url'])) return $c;
        }
    }
    return null;
}

/** Daraja address: the sandbox for testing ('environment' => 'sandbox' in mpesa-config.php), live otherwise. */
function mpesa_base(array $c): string {
    return ($c['environment'] ?? 'live') === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke';
}

function mpesa_token(array $c): ?string {
    $ch = curl_init(mpesa_base($c) . '/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30, CURLOPT_USERPWD => $c['consumer_key'] . ':' . $c['consumer_secret']]);
    $token = json_decode((string)curl_exec($ch), true)['access_token'] ?? null;
    curl_close($ch);
    return $token ?: null;
}

/** Send an STK push. Returns the CheckoutRequestID. */
function stk_push(string $msisdn, int $amount, string $reference, string $desc): string {
    $c = mpesa_config();
    if (!$c) fail(503, 'Online payment is not available right now. You can pay to Till 6095737 and send us the M-Pesa message.');
    $token = mpesa_token($c);
    if (!$token) fail(502, 'M-Pesa is not responding. Please try again shortly.');
    $ts = date('YmdHis');
    $payload = [
        'BusinessShortCode' => $c['shortcode'],
        'Password' => base64_encode($c['shortcode'] . $c['passkey'] . $ts),
        'Timestamp' => $ts,
        'TransactionType' => 'CustomerBuyGoodsOnline',
        'Amount' => $amount,
        'PartyA' => $msisdn,
        'PartyB' => $c['till_number'],
        'PhoneNumber' => $msisdn,
        'CallBackURL' => $c['callback_url'],
        'AccountReference' => substr(preg_replace('/[^A-Za-z0-9-]/', '', $reference), 0, 12),
        'TransactionDesc' => substr($desc, 0, 13),
    ];
    $ch = curl_init(mpesa_base($c) . '/mpesa/stkpush/v1/processrequest');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30, CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json'],
    ]);
    $res = json_decode((string)curl_exec($ch), true);
    curl_close($ch);
    if (($res['ResponseCode'] ?? '') !== '0' || empty($res['CheckoutRequestID'])) {
        fail(502, $res['errorMessage'] ?? $res['CustomerMessage'] ?? 'M-Pesa could not send the prompt. Please try again.');
    }
    return $res['CheckoutRequestID'];
}

/**
 * Ask Safaricom directly whether a payment went through (STK Push Query).
 * Returns the ResultCode as a string ('0' = paid), or null if Safaricom could not be reached.
 * Used to double-check every "paid" message before an invoice is marked paid.
 */
function stk_query(string $checkoutId): ?string {
    $c = mpesa_config();
    if (!$c) return null;
    $token = mpesa_token($c);
    if (!$token) return null;
    $ts = date('YmdHis');
    $ch = curl_init(mpesa_base($c) . '/mpesa/stkpushquery/v1/query');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30, CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'BusinessShortCode' => $c['shortcode'],
            'Password' => base64_encode($c['shortcode'] . $c['passkey'] . $ts),
            'Timestamp' => $ts,
            'CheckoutRequestID' => $checkoutId,
        ]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json'],
    ]);
    $res = json_decode((string)curl_exec($ch), true);
    curl_close($ch);
    return isset($res['ResultCode']) ? (string)$res['ResultCode'] : null;
}

/**
 * Mark the invoice for this M-Pesa request as paid, after checking everything:
 * the request is one we sent for this invoice, Safaricom confirms it, the amount
 * covers the invoice, and the receipt number has not been used before.
 * Returns 'paid', 'failed', 'pending' or 'mismatch'. Safe to call more than once.
 */
function settle_payment(string $checkoutId, array $r): string {
    $pay = q('SELECT ip.invoice_id, i.* FROM invoice_payments ip JOIN invoices i ON i.id = ip.invoice_id WHERE ip.checkout_id = ?', [$checkoutId])->fetch();
    if (!$pay) return 'mismatch';
    if ($pay['status'] === 'paid') return 'paid';
    if ((int)($r['result_code'] ?? -1) !== 0) return 'failed';
    $amount = (int)($r['amount'] ?? 0);
    $receipt = strtoupper(preg_replace('/[^A-Z0-9]/i', '', (string)($r['receipt'] ?? '')));
    if ($amount < (int)$pay['amount'] || $receipt === '') {
        audit('payment_rejected', "{$pay['number']}: amount $amount, receipt '$receipt'", 'M-Pesa');
        report_error('M-Pesa payment check', "Invoice {$pay['number']}: paid amount $amount is less than KSh {$pay['amount']} or no receipt. Not marked paid.");
        return 'mismatch';
    }
    if (q('SELECT id FROM invoices WHERE mpesa_receipt = ? AND id <> ?', [$receipt, $pay['invoice_id']])->fetch()) {
        audit('payment_rejected', "{$pay['number']}: receipt $receipt already used", 'M-Pesa');
        return 'mismatch';
    }
    // Confirm with Safaricom unless the config says not to (only for local testing)
    if (empty(mpesa_config()['skip_confirm'])) {
        $code = stk_query($checkoutId);
        if ($code === null) return 'pending';          // try again on the next check
        if ($code !== '0') {
            audit('payment_rejected', "{$pay['number']}: Safaricom query says $code", 'M-Pesa');
            return 'failed';
        }
    }
    $changed = q("UPDATE invoices SET status = 'paid', paid_at = ?, mpesa_receipt = ? WHERE id = ? AND status = 'unpaid'", [now(), $receipt, $pay['invoice_id']])->rowCount();
    if ($changed) {
        audit('invoice_paid', "{$pay['number']} KSh {$pay['amount']} M-Pesa $receipt", 'M-Pesa');
        notify_admins("Invoice {$pay['number']} paid", "Invoice {$pay['number']} (KSh " . number_format((int)$pay['amount']) . ") was paid by M-Pesa. Receipt: $receipt.");
        notify_client((int)$pay['client_id'], "Payment received: {$pay['number']}", "Thank you! We received KSh " . number_format((int)$pay['amount']) . " for {$pay['description']}. M-Pesa receipt: $receipt. Your receipt is in the portal.",
            "Marzley Tech: we received KSh " . number_format((int)$pay['amount']) . " for {$pay['number']}. M-Pesa ref $receipt. Thank you!");
    }
    return 'paid';
}

/** The result callback.php saved for a payment, or null while it is pending. */
function mpesa_result(string $checkoutId): ?array {
    if (!preg_match('/^[A-Za-z0-9_-]{1,100}$/', $checkoutId)) return null;
    $file = private_dir() . '/mpesa_results/' . $checkoutId . '.json';
    if (!is_readable($file)) return null;
    $r = json_decode((string)file_get_contents($file), true);
    return is_array($r) ? $r : null;
}

// ---------- alerts ----------

/** Send a plain-text email, if mail_from is set in the config. Never fails the request. */
function send_mail(string $to, string $subject, string $text, bool $footer = true): bool {
    $cfg = config();
    $from = $cfg['mail_from'] ?? '';
    if (!$from || !filter_var($to, FILTER_VALIDATE_EMAIL)) return false;
    if (is_staging()) $subject = '[STAGING] ' . $subject;
    $subject = '=?UTF-8?B?' . base64_encode(str_replace(["\r", "\n"], ' ', $subject)) . '?=';
    if ($footer) $text .= "\n\nOpen your client portal: " . portal_url() . "\n\nMarzley Tech Solutions · +254 745 789 590";
    $domain = substr(strrchr($from, '@'), 1) ?: 'localhost';
    $headers = "From: Marzley Tech Solutions <$from>\r\nReply-To: $from\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n" .
        'Message-ID: <' . bin2hex(random_bytes(12)) . "@$domain>\r\nDate: " . date('r') . "\r\n";
    if (!empty($cfg['smtp']['host'])) {
        try {
            smtp_send($cfg['smtp'], $from, $to, "To: <$to>\r\nSubject: $subject\r\n$headers", $text);
            return true;
        } catch (Throwable $e) {
            error_log('portal smtp: ' . $e->getMessage() . ' (falling back to mail())');
        }
    }
    return @mail($to, $subject, $text, rtrim($headers));
}

/**
 * Minimal SMTP client: port 465 (SSL) or 587 (STARTTLS), with a login.
 * Mail sent this way is signed by your mail server (DKIM), so it rarely lands in spam.
 */
function smtp_send(array $s, string $from, string $to, string $headers, string $body): void {
    $secure = $s['secure'] ?? ((int)($s['port'] ?? 465) === 465 ? 'ssl' : 'tls');
    $port = (int)($s['port'] ?? ($secure === 'ssl' ? 465 : 587));
    $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $s['host'] . ':' . $port;
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true]]);
    $fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) throw new RuntimeException("connect $remote: $errstr");
    stream_set_timeout($fp, 20);
    $read = function () use ($fp) {
        $all = '';
        while (($line = fgets($fp, 1024)) !== false) { $all .= $line; if (strlen($line) < 4 || $line[3] === ' ') break; }
        return $all;
    };
    $cmd = function (?string $line, array $ok) use ($fp, $read) {
        if ($line !== null) fwrite($fp, $line . "\r\n");
        $res = $read();
        if (!in_array((int)substr($res, 0, 3), $ok, true)) throw new RuntimeException('SMTP ' . ($line === null ? 'greeting' : strtok($line, ' ')) . ': ' . trim($res));
        return $res;
    };
    $host = gethostname() ?: 'localhost';
    $cmd(null, [220]);
    $cmd("EHLO $host", [250]);
    if ($secure === 'tls') {
        $cmd('STARTTLS', [220]);
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) throw new RuntimeException('STARTTLS failed');
        $cmd("EHLO $host", [250]);
    }
    if (!empty($s['user'])) {
        $cmd('AUTH LOGIN', [334]);
        $cmd(base64_encode($s['user']), [334]);
        $cmd(base64_encode((string)($s['pass'] ?? '')), [235]);
    }
    $cmd("MAIL FROM:<$from>", [250]);
    $cmd("RCPT TO:<$to>", [250, 251]);
    $cmd('DATA', [354]);
    $body = preg_replace('/^\./m', '..', str_replace(["\r\n", "\r"], "\n", $body));
    fwrite($fp, $headers . "\r\n" . str_replace("\n", "\r\n", $body) . "\r\n.\r\n");
    $cmd(null, [250]);
    fwrite($fp, "QUIT\r\n");
    fclose($fp);
}

/**
 * Send an SMS through Africa's Talking, if 'sms' is set in the config.
 * Kenyan numbers only. Never fails the request.
 */
function send_sms(string $phone, string $text): bool {
    $s = config()['sms'] ?? null;
    $to = normalise_phone($phone);
    if (empty($s['username']) || empty($s['api_key']) || !$to) return false;
    if (is_staging()) $text = '[TEST] ' . $text;
    $url = $s['username'] === 'sandbox' ? 'https://api.sandbox.africastalking.com/version1/messaging' : 'https://api.africastalking.com/version1/messaging';
    $fields = ['username' => $s['username'], 'to' => '+' . $to, 'message' => mb_substr($text, 0, 459)];
    if (!empty($s['sender_id'])) $fields['from'] = $s['sender_id'];
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20, CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($fields),
        CURLOPT_HTTPHEADER => ['apiKey: ' . $s['api_key'], 'Accept: application/json'],
    ]);
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code < 200 || $code >= 300) { error_log("portal sms: HTTP $code " . substr((string)$raw, 0, 200)); return false; }
    return true;
}

function portal_url(): string { return rtrim(config()['site_url'] ?? 'https://marzleytechsolutions.co.ke', '/') . '/portal/'; }

/** Email a client, and also text them when an SMS version is given and SMS is set up. */
function notify_client(int $clientId, string $subject, string $text, ?string $sms = null): void {
    $c = q('SELECT name, email, phone FROM clients WHERE id = ?', [$clientId])->fetch();
    if (!$c) return;
    send_mail($c['email'], $subject, "Hello {$c['name']},\n\n$text");
    if ($sms !== null && $c['phone'] !== '') send_sms($c['phone'], $sms);
}

function notify_admins(string $subject, string $text): void {
    foreach (config()['admin_emails'] as $email) send_mail($email, $subject, $text);
}

function client_of_project(int $projectId): ?array {
    $r = q('SELECT p.title, c.id AS client_id, c.name FROM projects p JOIN clients c ON c.id = p.client_id WHERE p.id = ?', [$projectId])->fetch();
    return $r ?: null;
}

// ---------- referral and certificate codes ----------

/** Same formula as js/home.js: FNV-1a hash of the phone in 2547XXXXXXXX form. */
function referral_code(string $phone): ?string {
    $msisdn = normalise_phone($phone);
    if (!$msisdn) return null;
    $h = 0x811c9dc5;
    for ($i = 0; $i < strlen($msisdn); $i++) {
        $h ^= ord($msisdn[$i]);
        $h = ($h * 16777619) & 0xFFFFFFFF;
    }
    return 'MT' . strtoupper(base_convert((string)$h, 10, 36));
}

function new_certificate_code(): string {
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $code = '';
    for ($i = 0; $i < 10; $i++) $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    return 'MTC-' . substr($code, 0, 5) . '-' . substr($code, 5);
}

/** Issue a certificate once a student has completed every lesson of a course. */
function maybe_issue_certificate(int $clientId, int $courseId): ?string {
    $total = (int)q('SELECT COUNT(*) AS n FROM lessons WHERE course_id = ?', [$courseId])->fetch()['n'];
    if ($total === 0) return null;
    $done = (int)q('SELECT COUNT(*) AS n FROM lesson_progress lp JOIN lessons l ON l.id = lp.lesson_id WHERE lp.client_id = ? AND l.course_id = ?', [$clientId, $courseId])->fetch()['n'];
    if ($done < $total) return null;
    return issue_certificate($clientId, $courseId);
}

function issue_certificate(int $clientId, int $courseId): string {
    $existing = q('SELECT code FROM certificates WHERE client_id = ? AND course_id = ?', [$clientId, $courseId])->fetch();
    if ($existing) return $existing['code'];
    $code = new_certificate_code();
    q('INSERT INTO certificates (client_id, course_id, code, issued_at) VALUES (?, ?, ?, ?)', [$clientId, $courseId, $code, now()]);
    $course = q('SELECT title FROM courses WHERE id = ?', [$courseId])->fetch();
    notify_client($clientId, 'Your certificate is ready', "Congratulations on completing {$course['title']}! Download your certificate in the portal. Certificate code: $code");
    return $code;
}
