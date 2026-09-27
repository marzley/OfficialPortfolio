<?php
// Shared code for the client portal. Loaded by api.php only.
if (!defined('MARZLEY_PORTAL')) {
    http_response_code(404);
    exit;
}

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
    foreach (array_filter([getenv('PORTAL_CONFIG') ?: null, dirname(site_root()) . '/portal-config.php', site_root() . '/portal-config.php']) as $file) {
        if (is_readable($file)) { $cfg = include $file; break; }
    }
    if (!is_array($cfg)) fail(503, 'The client portal is not set up yet.');
    $cfg += ['admin_emails' => [], 'google_client_id' => '', 'storage_dir' => private_dir() . '/portal-files', 'dev_login' => false];
    $cfg['admin_emails'] = array_map('strtolower', $cfg['admin_emails']);
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
        error_log('portal db: ' . $e->getMessage());
        fail(503, 'The client portal database is not available right now.');
    }
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

function fail(int $code, string $message): void { out(['error' => $message], $code); }

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
    // Sign out after 8 hours of inactivity
    if (isset($_SESSION['seen']) && time() - $_SESSION['seen'] > 8 * 3600) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['seen'] = time();
}

/** The signed-in person: ['email', 'name', 'role' => 'admin'|'client', 'client_id'] or null. */
function current_user(): ?array { return $_SESSION['user'] ?? null; }

function require_user(): array {
    $u = current_user();
    if (!$u) fail(401, 'Please sign in.');
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
    unset($_SESSION['csrf']);
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
    foreach (array_filter([getenv('MPESA_CONFIG') ?: null, dirname(site_root()) . '/mpesa-config.php', site_root() . '/mpesa-config.php']) as $file) {
        if (is_readable($file)) {
            $c = include $file;
            if (is_array($c) && !empty($c['consumer_key']) && !empty($c['passkey']) && !empty($c['callback_url'])) return $c;
        }
    }
    return null;
}

/** Send an STK push. Returns the CheckoutRequestID. */
function stk_push(string $msisdn, int $amount, string $reference, string $desc): string {
    $c = mpesa_config();
    if (!$c) fail(503, 'Online payment is not available right now. You can pay to Till 6095737 and send us the M-Pesa message.');
    $ch = curl_init('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30, CURLOPT_USERPWD => $c['consumer_key'] . ':' . $c['consumer_secret']]);
    $token = json_decode((string)curl_exec($ch), true)['access_token'] ?? null;
    curl_close($ch);
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
    $ch = curl_init('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
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

/** The result callback.php saved for a payment, or null while it is pending. */
function mpesa_result(string $checkoutId): ?array {
    if (!preg_match('/^[A-Za-z0-9_-]{1,100}$/', $checkoutId)) return null;
    $file = private_dir() . '/mpesa_results/' . $checkoutId . '.json';
    if (!is_readable($file)) return null;
    $r = json_decode((string)file_get_contents($file), true);
    return is_array($r) ? $r : null;
}

// ---------- alerts ----------

/** Send a plain-text email alert, if mail_from is set in the config. Never fails the request. */
function send_mail(string $to, string $subject, string $text): void {
    $from = config()['mail_from'] ?? '';
    if (!$from || !filter_var($to, FILTER_VALIDATE_EMAIL)) return;
    $subject = '=?UTF-8?B?' . base64_encode(str_replace(["\r", "\n"], ' ', $subject)) . '?=';
    $headers = "From: Marzley Tech Solutions <$from>\r\nReply-To: $from\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    $text .= "\n\nOpen your client portal: " . portal_url() . "\n\nMarzley Tech Solutions · +254 745 789 590";
    @mail($to, $subject, $text, $headers);
}

function portal_url(): string { return rtrim(config()['site_url'] ?? 'https://marzleytechsolutions.co.ke', '/') . '/portal/'; }

function notify_client(int $clientId, string $subject, string $text): void {
    $c = q('SELECT name, email FROM clients WHERE id = ?', [$clientId])->fetch();
    if ($c) send_mail($c['email'], $subject, "Hello {$c['name']},\n\n$text");
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
