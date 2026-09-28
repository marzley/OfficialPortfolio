<?php
// Shared code for the client portal. Loaded by api.php only.
if (!defined('MARZLEY_PORTAL')) {
    http_response_code(404);
    exit;
}

const SCHEMA_VERSION = 5;
const STAFF_PERMS = ['projects' => 'Projects & files', 'clients' => 'People', 'support' => 'Support', 'courses' => 'Courses', 'money' => 'Invoices, payments & quotes', 'leads' => 'Leads'];
const PROJECT_STATUSES = ['planning', 'design', 'build', 'review', 'live', 'on_hold'];
const INVOICE_STATUSES = ['unpaid', 'paid', 'cancelled'];

/** The site folder (public_html) and the private folder above it. */
function site_root(): string { return dirname(__DIR__); }
function private_dir(): string {
    if ($env = getenv('PORTAL_PRIVATE_DIR')) return $env;   // tests
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
        // v5: learning hub (free tutorials and notes, paid videos)
        "CREATE TABLE IF NOT EXISTS learners (id $id, email VARCHAR(190) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL DEFAULT '', phone VARCHAR(30) NOT NULL DEFAULT '', created_at DATETIME NOT NULL, last_seen DATETIME NULL)$end",
        "CREATE TABLE IF NOT EXISTS learn_codes (id $id, email VARCHAR(190) NOT NULL, code_hash VARCHAR(64) NOT NULL, attempts $uint NOT NULL DEFAULT 0, expires_at DATETIME NOT NULL, used_at DATETIME NULL, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS learn_tracks (id $id, slug VARCHAR(60) NOT NULL UNIQUE, title VARCHAR(120) NOT NULL, lang VARCHAR(20) NOT NULL, summary VARCHAR(500) NOT NULL DEFAULT '', position $uint NOT NULL DEFAULT 0, published $uint NOT NULL DEFAULT 1)$end",
        "CREATE TABLE IF NOT EXISTS learn_lessons (id $id, track_id $uint NOT NULL, slug VARCHAR(80) NOT NULL, title VARCHAR(160) NOT NULL, position $uint NOT NULL DEFAULT 0, body TEXT NOT NULL, exercise TEXT NOT NULL, starter TEXT NOT NULL, expected TEXT NOT NULL, must_contain VARCHAR(500) NOT NULL DEFAULT '', published $uint NOT NULL DEFAULT 1, updated_at DATETIME NOT NULL, UNIQUE (track_id, slug))$end",
        "CREATE TABLE IF NOT EXISTS learn_notes (id $id, title VARCHAR(160) NOT NULL, summary VARCHAR(500) NOT NULL DEFAULT '', track_id $uint NULL, stored_name VARCHAR(80) NOT NULL, original_name VARCHAR(200) NOT NULL, size $uint NOT NULL DEFAULT 0, pages $uint NOT NULL DEFAULT 0, downloads $uint NOT NULL DEFAULT 0, published $uint NOT NULL DEFAULT 1, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS learn_videos (id $id, title VARCHAR(160) NOT NULL, summary TEXT NOT NULL, track_id $uint NULL, stored_name VARCHAR(80) NOT NULL, poster_name VARCHAR(80) NULL, mime VARCHAR(40) NOT NULL, size $uint NOT NULL DEFAULT 0, duration $uint NOT NULL DEFAULT 0, price $uint NOT NULL DEFAULT 50, views $uint NOT NULL DEFAULT 0, published $uint NOT NULL DEFAULT 1, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS learn_unlocks (id $id, video_id $uint NOT NULL, learner_id $uint NOT NULL, amount $uint NOT NULL DEFAULT 0, receipt VARCHAR(30) NOT NULL DEFAULT '', created_at DATETIME NOT NULL, UNIQUE (video_id, learner_id))$end",
        "CREATE TABLE IF NOT EXISTS learn_payments (id $id, checkout_id VARCHAR(100) NOT NULL UNIQUE, video_id $uint NOT NULL, learner_id $uint NOT NULL, amount $uint NOT NULL, phone VARCHAR(30) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'pending', receipt VARCHAR(30) NULL, paid_amount $uint NULL, created_at DATETIME NOT NULL, paid_at DATETIME NULL)$end",
        "CREATE TABLE IF NOT EXISTS learn_comments (id $id, video_id $uint NOT NULL, learner_id $uint NOT NULL, body TEXT NOT NULL, hidden $uint NOT NULL DEFAULT 0, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS learn_likes (id $id, video_id $uint NOT NULL, learner_id $uint NOT NULL, created_at DATETIME NOT NULL, UNIQUE (video_id, learner_id))$end",
        "CREATE TABLE IF NOT EXISTS learn_progress (id $id, learner_id $uint NOT NULL, lesson_id $uint NOT NULL, created_at DATETIME NOT NULL, UNIQUE (learner_id, lesson_id))$end",
        "CREATE TABLE IF NOT EXISTS learn_uploads (id $id, token VARCHAR(64) NOT NULL UNIQUE, kind VARCHAR(10) NOT NULL, name VARCHAR(200) NOT NULL, size $uint NOT NULL, received $uint NOT NULL DEFAULT 0, meta TEXT NOT NULL, created_by VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL)$end",
        // v4
        "CREATE TABLE IF NOT EXISTS site_payments (id $id, checkout_id VARCHAR(100) NOT NULL UNIQUE, purpose VARCHAR(20) NOT NULL, plan VARCHAR(60) NOT NULL DEFAULT '', amount $uint NOT NULL, phone VARCHAR(30) NOT NULL, name VARCHAR(120) NOT NULL DEFAULT '', referred_by VARCHAR(20) NOT NULL DEFAULT '', status VARCHAR(20) NOT NULL DEFAULT 'pending', receipt VARCHAR(30) NULL, paid_amount $uint NULL, invoice_id $uint NULL, created_at DATETIME NOT NULL, paid_at DATETIME NULL)$end",
        "CREATE TABLE IF NOT EXISTS referrers (id $id, code VARCHAR(20) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL, phone VARCHAR(30) NOT NULL, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS referrals (id $id, code VARCHAR(20) NOT NULL, referrer_name VARCHAR(120) NOT NULL, referrer_phone VARCHAR(30) NOT NULL, client_id $uint NULL, lead_id $uint NULL, site_payment_id $uint NULL, referred_name VARCHAR(120) NOT NULL, referred_phone VARCHAR(30) NOT NULL DEFAULT '', amount $uint NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'due', note VARCHAR(300) NOT NULL DEFAULT '', created_at DATETIME NOT NULL, paid_at DATETIME NULL)$end",
        "CREATE TABLE IF NOT EXISTS chat_questions (id $id, question VARCHAR(300) NOT NULL, times $uint NOT NULL DEFAULT 1, first_at DATETIME NOT NULL, last_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS login_codes (id $id, client_id $uint NOT NULL, code_hash VARCHAR(64) NOT NULL, attempts $uint NOT NULL DEFAULT 0, expires_at DATETIME NOT NULL, used_at DATETIME NULL, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS subscribers (id $id, email VARCHAR(190) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL DEFAULT '', source VARCHAR(40) NOT NULL DEFAULT '', status VARCHAR(20) NOT NULL DEFAULT 'pending', token VARCHAR(64) NOT NULL UNIQUE, created_at DATETIME NOT NULL, confirmed_at DATETIME NULL)$end",
        "CREATE TABLE IF NOT EXISTS campaigns (id $id, subject VARCHAR(200) NOT NULL, body TEXT NOT NULL, audience VARCHAR(60) NOT NULL, created_by VARCHAR(190) NOT NULL, total $uint NOT NULL DEFAULT 0, sent $uint NOT NULL DEFAULT 0, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS campaign_queue (id $id, campaign_id $uint NOT NULL, email VARCHAR(190) NOT NULL, name VARCHAR(120) NOT NULL DEFAULT '', sent_at DATETIME NULL)$end",
        // v3
        "CREATE TABLE IF NOT EXISTS payments (id $id, invoice_id $uint NOT NULL, amount $uint NOT NULL, method VARCHAR(20) NOT NULL, reference VARCHAR(60) NOT NULL DEFAULT '', status VARCHAR(20) NOT NULL DEFAULT 'confirmed', note VARCHAR(500) NOT NULL DEFAULT '', proof_file VARCHAR(80) NULL, checkout_id VARCHAR(100) NULL, created_by VARCHAR(190) NOT NULL DEFAULT '', created_at DATETIME NOT NULL, decided_at DATETIME NULL)$end",
        "CREATE TABLE IF NOT EXISTS leads (id $id, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL DEFAULT '', phone VARCHAR(30) NOT NULL DEFAULT '', source VARCHAR(60) NOT NULL DEFAULT '', message TEXT NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'new', value $uint NOT NULL DEFAULT 0, notes TEXT NOT NULL, client_id $uint NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS quotes (id $id, token VARCHAR(64) NOT NULL UNIQUE, lead_id $uint NULL, client_name VARCHAR(120) NOT NULL, client_email VARCHAR(190) NOT NULL, client_phone VARCHAR(30) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL, items TEXT NOT NULL, total $uint NOT NULL, deposit_percent $uint NOT NULL DEFAULT 50, valid_until DATE NULL, notes TEXT NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'draft', accepted_name VARCHAR(120) NULL, accepted_at DATETIME NULL, accepted_ip VARCHAR(45) NULL, client_id $uint NULL, project_id $uint NULL, created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS domains (id $id, client_id $uint NOT NULL, name VARCHAR(190) NOT NULL, kind VARCHAR(20) NOT NULL DEFAULT 'domain', expires_on DATE NOT NULL, renew_price $uint NOT NULL DEFAULT 0, auto_invoice $uint NOT NULL DEFAULT 1, monitor_url VARCHAR(300) NOT NULL DEFAULT '', last_status VARCHAR(10) NOT NULL DEFAULT '', down_since DATETIME NULL, notes VARCHAR(500) NOT NULL DEFAULT '', created_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS site_checks (id $id, domain_id $uint NOT NULL, ok $uint NOT NULL, ms $uint NOT NULL DEFAULT 0, code $uint NOT NULL DEFAULT 0, checked_at DATETIME NOT NULL)$end",
        "CREATE TABLE IF NOT EXISTS feedback (id $id, project_id $uint NOT NULL, client_id $uint NOT NULL, token VARCHAR(64) NOT NULL UNIQUE, rating $uint NULL, comment TEXT NULL, created_at DATETIME NOT NULL, submitted_at DATETIME NULL)$end",
        "CREATE TABLE IF NOT EXISTS staff (id $id, email VARCHAR(190) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL, perms VARCHAR(200) NOT NULL DEFAULT '', created_at DATETIME NOT NULL)$end",
    ];
    foreach ($tables as $sql) $pdo->exec($sql);
    $columns = [
        ['invoices', 'amount_paid', "$uint NOT NULL DEFAULT 0"],
        ['invoice_payments', 'amount', "$uint NULL"],
        ['invoice_payments', 'method', "VARCHAR(20) NOT NULL DEFAULT 'mpesa'"],
        ['approvals', 'bill_amount', "$uint NULL"],
        ['approvals', 'invoice_id', "$uint NULL"],
        ['files', 'uploaded_by', "VARCHAR(10) NOT NULL DEFAULT 'admin'"],
        ['leads', 'referred_by', "VARCHAR(20) NOT NULL DEFAULT ''"],
        ['feedback', 'publish_ok', "$uint NOT NULL DEFAULT 0"],
        ['feedback', 'published', "$uint NOT NULL DEFAULT 0"],
    ];
    foreach ($columns as [$table, $col, $def]) {
        try { $pdo->exec("ALTER TABLE $table ADD COLUMN $col $def"); } catch (PDOException $e) { /* already there */ }
    }
    foreach (['CREATE INDEX audit_created ON audit_log (created_at)', 'CREATE INDEX payments_invoice ON payments (invoice_id)', 'CREATE INDEX payments_ref ON payments (reference)', 'CREATE UNIQUE INDEX payments_checkout ON payments (checkout_id)', 'CREATE INDEX queue_pending ON campaign_queue (sent_at)', 'CREATE UNIQUE INDEX referral_once ON referrals (code, referred_phone, client_id)',
              'CREATE INDEX checks_domain ON site_checks (domain_id, checked_at)', 'CREATE INDEX learn_comments_video ON learn_comments (video_id)', 'CREATE INDEX learn_codes_email ON learn_codes (email)'] as $sql) {
        try { $pdo->exec($sql); } catch (PDOException $e) { /* already there */ }
    }
    if ($v < 3) {
        // Invoices paid before part payments existed count as paid in full
        $pdo->exec("UPDATE invoices SET amount_paid = amount WHERE status = 'paid' AND amount_paid = 0");
        $pdo->exec("INSERT INTO payments (invoice_id, amount, method, reference, status, created_by, created_at, decided_at)
            SELECT id, amount, CASE WHEN mpesa_receipt IS NULL OR mpesa_receipt = '' THEN 'manual' ELSE 'mpesa' END, COALESCE(mpesa_receipt, ''), 'confirmed', 'system', COALESCE(paid_at, created_at), COALESCE(paid_at, created_at)
            FROM invoices WHERE status = 'paid' AND id NOT IN (SELECT invoice_id FROM payments)");
    }
    if ($v < 5) learn_seed($pdo);
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

/** Owners (admin_emails in the config) can do everything, including team and security settings. */
function require_admin(): array {
    $u = require_user();
    if ($u['role'] !== 'admin') fail(403, 'Only the business owner can do that.');
    return $u;
}

/** True for owners and staff: people who work at Marzley Tech, not clients. */
function is_team(?array $u): bool { return $u && in_array($u['role'], ['admin', 'staff'], true); }

function can(?array $u, string $perm): bool {
    if (!$u) return false;
    if ($u['role'] === 'admin') return true;
    return $u['role'] === 'staff' && in_array($perm, $u['perms'] ?? [], true);
}

/** Owners, or staff who have been given this area. */
function require_perm(string $perm): array {
    $u = require_user();
    if (!can($u, $perm)) fail(403, $u['role'] === 'client' ? 'Only Marzley Tech staff can do that.' : 'You don’t have access to this area. Ask the owner.');
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
    $staff = in_array($email, config()['admin_emails'], true) ? null : q('SELECT name, perms FROM staff WHERE email = ?', [$email])->fetch();
    if (in_array($email, config()['admin_emails'], true)) {
        $user = ['email' => $email, 'name' => $name, 'role' => 'admin', 'client_id' => null];
    } elseif ($staff) {
        $user = ['email' => $email, 'name' => $staff['name'] ?: $name, 'role' => 'staff', 'client_id' => null,
                 'perms' => array_values(array_intersect(explode(',', $staff['perms']), array_keys(STAFF_PERMS)))];
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
    if (!empty($c['base'])) return rtrim($c['base'], '/');   // tests
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

// ---------- invoices and payments ----------

/** Next invoice number in an unbroken yearly series, e.g. MT-2026-0001 (as KRA and accountants expect). */
function next_invoice_number(): string {
    $pdo = db();
    $own = !$pdo->inTransaction();
    if ($own) $pdo->beginTransaction();
    try {
        $year = date('Y');
        $key = "invoice_seq:$year";
        // The UPDATE locks the counter row until commit, so two invoices can never get the same number
        if (q('UPDATE settings SET v = v + 1 WHERE k = ?', [$key])->rowCount() === 0) {
            try { q('INSERT INTO settings (k, v) VALUES (?, ?)', [$key, '1']); }
            catch (PDOException $e) { q('UPDATE settings SET v = v + 1 WHERE k = ?', [$key]); }
        }
        $n = (int)q('SELECT v FROM settings WHERE k = ?', [$key])->fetch()['v'];
        if ($own) $pdo->commit();
    } catch (Throwable $e) {
        if ($own && $pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
    $prefix = preg_replace('/[^A-Z0-9]/', '', strtoupper((string)(config()['invoice_prefix'] ?? 'MT'))) ?: 'MT';
    return sprintf('%s-%s-%04d', $prefix, $year, $n);
}

/** Create an invoice and email/SMS the client. Returns [id, number]. */
function create_invoice(int $clientId, ?int $projectId, string $desc, int $amount, ?string $due, string $status = 'unpaid', bool $notify = true): array {
    $number = next_invoice_number();
    q('INSERT INTO invoices (client_id, project_id, number, description, amount, amount_paid, status, due_date, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [$clientId, $projectId, $number, $desc, $amount, $status === 'paid' ? $amount : 0, $status, $due, $status === 'paid' ? now() : null, now()]);
    $id = (int)db()->lastInsertId();
    if ($status === 'paid') q("INSERT INTO payments (invoice_id, amount, method, reference, status, created_by, created_at, decided_at) VALUES (?, ?, 'manual', '', 'confirmed', ?, ?, ?)", [$id, $amount, current_user()['email'] ?? 'system', now(), now()]);
    if ($notify && $status === 'unpaid') {
        notify_client($clientId, "New invoice $number", "You have a new invoice: $desc, KSh " . number_format($amount) . ($due ? ", due $due" : '') . '. You can pay it by M-Pesa or card in the portal.',
            "Marzley Tech: invoice $number for KSh " . number_format($amount) . ($due ? " due $due" : '') . '. Pay at ' . portal_url());
    }
    return [$id, $number];
}

function invoice_balance(array $inv): int { return max(0, (int)$inv['amount'] - (int)($inv['amount_paid'] ?? 0)); }

/** True if this payment reference (M-Pesa code, card reference, bank ref) was already used. */
function reference_used(string $reference, ?int $exceptPaymentId = null): bool {
    if ($reference === '') return false;
    if (q("SELECT id FROM payments WHERE reference = ? AND status <> 'rejected' AND id <> ?", [$reference, $exceptPaymentId ?? 0])->fetch()) return true;
    return (bool)q('SELECT id FROM invoices WHERE mpesa_receipt = ?', [$reference])->fetch() && $exceptPaymentId === null;
}

/**
 * Record money received against an invoice (part or full). When the total paid reaches the
 * invoice amount it is marked paid. Sends the client a receipt. Returns the payment id.
 */
function apply_payment(int $invoiceId, int $amount, string $method, string $reference, string $by, ?string $checkoutId = null, ?int $existingPaymentId = null): int {
    $pdo = db();
    $own = !$pdo->inTransaction();
    if ($own) $pdo->beginTransaction();
    $inv = q('SELECT * FROM invoices WHERE id = ?', [$invoiceId])->fetch();
    if ($existingPaymentId) {
        // Only one "Confirm" can win, even if the button is pressed twice at once
        if (q("UPDATE payments SET status = 'confirmed', decided_at = ? WHERE id = ? AND status = 'pending'", [now(), $existingPaymentId])->rowCount() === 0) {
            if ($own) $pdo->rollBack();
            return 0;
        }
        $pid = $existingPaymentId;
    } else {
        try {
            q("INSERT INTO payments (invoice_id, amount, method, reference, status, checkout_id, created_by, created_at, decided_at) VALUES (?, ?, ?, ?, 'confirmed', ?, ?, ?, ?)",
                [$invoiceId, $amount, $method, $reference, $checkoutId, $by, now(), now()]);
        } catch (PDOException $e) {
            // The same payment arrived twice at once (callback and status check): the first one counts
            if ($own) $pdo->rollBack();
            if ($checkoutId !== null && q('SELECT id FROM payments WHERE checkout_id = ?', [$checkoutId])->fetch()) return 0;
            throw $e;
        }
        $pid = (int)$pdo->lastInsertId();
    }
    q('UPDATE invoices SET amount_paid = amount_paid + ? WHERE id = ?', [$amount, $invoiceId]);
    $paidNow = q("UPDATE invoices SET status = 'paid', paid_at = ?, mpesa_receipt = ? WHERE id = ? AND status = 'unpaid' AND amount_paid >= amount", [now(), $reference ?: null, $invoiceId])->rowCount() > 0;
    if ($own) $pdo->commit();
    try { referral_check_client((int)$inv['client_id']); } catch (Throwable $e) { error_log('referral check: ' . $e->getMessage()); }
    $label = ['mpesa' => 'M-Pesa', 'card' => 'card', 'bank' => 'bank transfer', 'till' => 'M-Pesa (till)', 'manual' => 'payment'][$method] ?? $method;
    $balance = max(0, (int)$inv['amount'] - (int)$inv['amount_paid'] - $amount);
    audit($paidNow ? 'invoice_paid' : 'part_payment', "{$inv['number']} KSh $amount by $label" . ($reference ? " $reference" : '') . ($paidNow ? '' : ", balance KSh $balance"), $by);
    notify_admins(($paidNow ? "Invoice {$inv['number']} paid" : "Part payment on {$inv['number']}"),
        "KSh " . number_format($amount) . " received by $label for invoice {$inv['number']}" . ($reference ? " (ref $reference)" : '') . '.' . ($paidNow ? ' The invoice is now fully paid.' : ' Balance: KSh ' . number_format($balance) . '.'));
    notify_client((int)$inv['client_id'], $paidNow ? "Payment received: {$inv['number']}" : "Part payment received: {$inv['number']}",
        "Thank you! We received KSh " . number_format($amount) . " by $label for {$inv['description']}" . ($reference ? " (ref $reference)" : '') . '.' .
        ($paidNow ? ' Your invoice is now fully paid and your receipt is in the portal.' : ' Balance remaining: KSh ' . number_format($balance) . '.'),
        "Marzley Tech: received KSh " . number_format($amount) . " for {$inv['number']}" . ($reference ? " ref $reference" : '') . '.' . ($paidNow ? ' Fully paid. Thank you!' : ' Balance KSh ' . number_format($balance) . '.'));
    return $pid;
}

/**
 * Settle an M-Pesa request after checking everything: the request is one we sent for this
 * invoice, Safaricom confirms it, the amount covers what was requested, and the receipt
 * number has not been used before. Returns 'paid', 'failed', 'pending' or 'mismatch'. Safe to call more than once.
 */
function settle_payment(string $checkoutId, array $r): string {
    $pay = q('SELECT ip.invoice_id, ip.amount AS requested, i.* FROM invoice_payments ip JOIN invoices i ON i.id = ip.invoice_id WHERE ip.checkout_id = ?', [$checkoutId])->fetch();
    if (!$pay) return 'mismatch';
    if (q('SELECT id FROM payments WHERE checkout_id = ?', [$checkoutId])->fetch()) return 'paid';
    if ((int)($r['result_code'] ?? -1) !== 0) return 'failed';
    $expected = (int)($pay['requested'] ?: $pay['amount']);
    $amount = (int)($r['amount'] ?? 0);
    $receipt = strtoupper(preg_replace('/[^A-Z0-9]/i', '', (string)($r['receipt'] ?? '')));
    if ($amount < $expected || $receipt === '') {
        audit('payment_rejected', "{$pay['number']}: amount $amount, receipt '$receipt'", 'M-Pesa');
        report_error('M-Pesa payment check', "Invoice {$pay['number']}: paid amount $amount is less than the KSh $expected requested, or no receipt. Not recorded.");
        return 'mismatch';
    }
    if (reference_used($receipt)) {
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
    if ($pay['status'] !== 'unpaid') return 'paid';
    apply_payment((int)$pay['invoice_id'], $expected, 'mpesa', $receipt, 'M-Pesa', $checkoutId);
    return 'paid';
}

// ---------- referrals ----------

/** Who owns a referral code: a registered referrer or a client (codes come from their phone). */
function find_referrer(string $code): ?array {
    $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $code));
    if ($code === '') return null;
    $r = q('SELECT name, phone FROM referrers WHERE code = ?', [$code])->fetch();
    if ($r) return $r + ['code' => $code];
    foreach (q("SELECT name, phone FROM clients WHERE phone <> ''")->fetchAll() as $c) {
        if (referral_code($c['phone']) === $code) return $c + ['code' => $code];
    }
    return null;
}

/**
 * Someone who came through a referral link has paid: the referrer's reward is now due.
 * Once per referred person. Self-referrals are ignored.
 */
function referral_due(string $code, string $referredName, string $referredPhone, ?int $clientId, ?int $leadId, ?int $sitePaymentId = null): void {
    $ref = find_referrer($code);
    if (!$ref) return;
    $a = normalise_phone($ref['phone']);
    if ($a && $a === normalise_phone($referredPhone)) return;           // self-referral
    $key = normalise_phone($referredPhone) ?: '';
    $dupe = $clientId ? q('SELECT id FROM referrals WHERE code = ? AND client_id = ?', [$ref['code'], $clientId])->fetch()
                      : q('SELECT id FROM referrals WHERE code = ? AND referred_phone = ?', [$ref['code'], $key])->fetch();
    if ($dupe) return;
    $amount = (int)(config()['referral_reward'] ?? 2000);
    q('INSERT INTO referrals (code, referrer_name, referrer_phone, client_id, lead_id, site_payment_id, referred_name, referred_phone, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [$ref['code'], $ref['name'], $ref['phone'], $clientId, $leadId, $sitePaymentId, $referredName, $key, $amount, 'due', now()]);
    audit('referral_due', "{$ref['name']} ({$ref['code']}) referred $referredName", 'system');
    notify_admins("Referral reward due: KSh " . number_format($amount) . " to {$ref['name']}",
        "$referredName, referred by {$ref['name']} ({$ref['phone']}, code {$ref['code']}), has paid. Send KSh " . number_format($amount) .
        " to {$ref['name']} by M-Pesa, then mark it paid in the portal (Growth → Referrals).");
}

/** After any payment by a client: if they came through a referral, the reward is due. */
function referral_check_client(int $clientId): void {
    $lead = q("SELECT id, name, phone, referred_by FROM leads WHERE client_id = ? AND referred_by <> '' ORDER BY id LIMIT 1", [$clientId])->fetch();
    if (!$lead) return;
    $c = q('SELECT name, phone FROM clients WHERE id = ?', [$clientId])->fetch();
    referral_due($lead['referred_by'], $c['name'] ?? $lead['name'], $c['phone'] ?: $lead['phone'], $clientId, (int)$lead['id']);
}

// ---------- payments made on the public website (deposit, care plan, demo) ----------

/** Record an M-Pesa prompt sent from the website, so the payment can be matched and announced. */
function record_site_payment(string $checkoutId, string $purpose, int $amount, string $phone, string $name, string $plan, string $referredBy): void {
    q('INSERT INTO site_payments (checkout_id, purpose, plan, amount, phone, name, referred_by, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [$checkoutId, $purpose, mb_substr($plan, 0, 60), $amount, $phone, mb_substr($name, 0, 120), strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $referredBy), 0, 20)), 'pending', now()]);
}

/**
 * A website payment result arrived: check it like invoice payments (amount, receipt not reused,
 * Safaricom confirms), then tell the team and put it on the Leads board. Returns the new status.
 */
function settle_site_payment(string $checkoutId, array $r): string {
    $sp = q('SELECT * FROM site_payments WHERE checkout_id = ?', [$checkoutId])->fetch();
    if (!$sp) return 'mismatch';
    if ($sp['status'] !== 'pending') return $sp['status'];
    if ((int)($r['result_code'] ?? -1) !== 0) { q("UPDATE site_payments SET status = 'failed' WHERE id = ?", [$sp['id']]); return 'failed'; }
    $amount = (int)($r['amount'] ?? 0);
    $receipt = strtoupper(preg_replace('/[^A-Z0-9]/i', '', (string)($r['receipt'] ?? '')));
    if ($amount < (int)$sp['amount'] || $receipt === '' || reference_used($receipt) || q('SELECT id FROM site_payments WHERE receipt = ?', [$receipt])->fetch()) {
        audit('payment_rejected', "Website {$sp['purpose']}: amount $amount, receipt '$receipt'", 'M-Pesa');
        return 'mismatch';
    }
    if (empty(mpesa_config()['skip_confirm'])) {
        $code = stk_query($checkoutId);
        if ($code === null) return 'pending';
        if ($code !== '0') { q("UPDATE site_payments SET status = 'failed' WHERE id = ?", [$sp['id']]); return 'failed'; }
    }
    if (!q("UPDATE site_payments SET status = 'paid', receipt = ?, paid_amount = ?, paid_at = ? WHERE id = ? AND status = 'pending'", [$receipt, $amount, now(), $sp['id']])->rowCount()) return 'paid';
    if ($sp['purpose'] === 'demo') { audit('demo_paid', "KSh $amount M-Pesa $receipt", 'M-Pesa'); return 'paid'; }

    $what = $sp['purpose'] === 'care' ? 'Care plan' . ($sp['plan'] ? " ({$sp['plan']})" : '') : 'Project deposit';
    $who = $sp['name'] ?: 'Someone';
    audit('website_payment', "$what KSh $amount from $who {$sp['phone']} M-Pesa $receipt", 'M-Pesa');
    // On the Leads board: add to their lead (same phone) or start a new one
    $phone = $sp['phone'];
    $variants = array_values(array_unique(array_filter([$phone, normalise_phone($phone), '0' . substr((string)normalise_phone($phone), 3)])));
    $marks = implode(',', array_fill(0, count($variants), '?'));
    $lead = q("SELECT id, message FROM leads WHERE phone IN ($marks) ORDER BY id DESC LIMIT 1", $variants)->fetch();
    $note = "$what paid on the website: KSh " . number_format($amount) . ", M-Pesa $receipt, " . date('j M Y H:i');
    if ($lead) q("UPDATE leads SET message = ?, status = CASE WHEN status IN ('new', 'contacted', 'quoted') THEN 'won' ELSE status END, value = CASE WHEN value = 0 THEN ? ELSE value END, updated_at = ? WHERE id = ?",
        [mb_substr($lead['message'] . "\n\n" . $note, 0, 12000), $amount, now(), $lead['id']]);
    else q('INSERT INTO leads (name, email, phone, source, message, status, value, notes, referred_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [$who, '', $phone, 'Website payment', $note, 'won', $amount, '', $sp['referred_by'], now(), now()]);
    $subject = "Payment received: KSh " . number_format($amount) . " from $who";
    notify_admins($subject, "$what paid on the website.\n\nName: $who\nPhone: $phone\nAmount: KSh " . number_format($amount) . "\nM-Pesa code: $receipt\n\n" .
        "It's on the Leads board (marked Won). To attach it to a client's account, open Invoices → Website payments.");
    if (!empty(config()['sms_alert_phone'])) send_sms(config()['sms_alert_phone'], "Marzley: $subject ($phone) ref $receipt");
    if ($sp['referred_by'] !== '') referral_due($sp['referred_by'], $who, $phone, null, $lead ? (int)$lead['id'] : null, (int)$sp['id']);
    return 'paid';
}

// ---------- mailing list ----------

function unsubscribe_link(string $email): string {
    $row = q('SELECT token FROM subscribers WHERE email = ?', [$email])->fetch();
    if (!$row) {
        $token = bin2hex(random_bytes(24));
        q("INSERT INTO subscribers (email, name, source, status, token, created_at) VALUES (?, '', 'client', 'subscribed', ?, ?)", [$email, $token, now()]);
    } else $token = $row['token'];
    return portal_url() . 'subscribe.php?u=' . $token;
}

/** Send up to $max queued newsletter emails. Returns how many were sent. */
function send_campaign_queue(int $max): int {
    $sent = 0;
    foreach (q('SELECT q.*, c.subject, c.body FROM campaign_queue q JOIN campaigns c ON c.id = q.campaign_id WHERE q.sent_at IS NULL ORDER BY q.id LIMIT ' . max(1, $max))->fetchAll() as $item) {
        $status = q('SELECT status FROM subscribers WHERE email = ?', [$item['email']])->fetch()['status'] ?? '';
        if ($status !== 'unsubscribed') {
            $hello = $item['name'] !== '' ? "Hello {$item['name']},\n\n" : "Hello,\n\n";
            send_mail($item['email'], $item['subject'], $hello . $item['body'] . "\n\n—\nMarzley Tech Solutions · +254 745 789 590 · marzleytechsolutions.co.ke\n" .
                "You get these emails because you subscribed or work with us. Unsubscribe: " . unsubscribe_link($item['email']), false);
            $sent++;
        }
        q('UPDATE campaign_queue SET sent_at = ? WHERE id = ?', [now(), $item['id']]);
        q('UPDATE campaigns SET sent = sent + 1 WHERE id = ?', [$item['campaign_id']]);
    }
    return $sent;
}

// ---------- card payments (Paystack) ----------

function paystack(): ?array {
    $p = config()['paystack'] ?? null;
    return !empty($p['secret_key']) ? $p + ['base' => 'https://api.paystack.co'] : null;
}

function paystack_call(string $method, string $path, ?array $body = null): ?array {
    $p = paystack();
    if (!$p) return null;
    $ch = curl_init(rtrim($p['base'], '/') . $path);
    $opts = [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30, CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $p['secret_key'], 'Content-Type: application/json']];
    if ($method === 'POST') { $opts[CURLOPT_POST] = true; $opts[CURLOPT_POSTFIELDS] = json_encode($body ?? []); }
    curl_setopt_array($ch, $opts);
    $res = json_decode((string)curl_exec($ch), true);
    curl_close($ch);
    return is_array($res) ? $res : null;
}

/** Verify a card payment with Paystack and record it. Returns 'paid', 'pending', 'failed' or 'mismatch'. */
function settle_card(string $reference): string {
    $pay = q("SELECT ip.invoice_id, ip.amount AS requested, i.* FROM invoice_payments ip JOIN invoices i ON i.id = ip.invoice_id WHERE ip.checkout_id = ? AND ip.method = 'card'", [$reference])->fetch();
    if (!$pay) return 'mismatch';
    if (q('SELECT id FROM payments WHERE checkout_id = ?', [$reference])->fetch()) return 'paid';
    $res = paystack_call('GET', '/transaction/verify/' . rawurlencode($reference));
    if (!$res) return 'pending';
    $d = $res['data'] ?? [];
    if (($d['status'] ?? '') !== 'success') return ($d['status'] ?? '') === 'abandoned' || ($d['status'] ?? '') === 'failed' ? 'failed' : 'pending';
    $expected = (int)($pay['requested'] ?: $pay['amount']);
    if (($d['reference'] ?? '') !== $reference || strtoupper($d['currency'] ?? '') !== 'KES' || (int)($d['amount'] ?? 0) < $expected * 100) {
        audit('payment_rejected', "{$pay['number']}: card $reference amount/currency mismatch", 'Paystack');
        report_error('Card payment check', "Invoice {$pay['number']}: Paystack reference $reference does not match the amount or currency. Not recorded.");
        return 'mismatch';
    }
    if ($pay['status'] !== 'unpaid') return 'paid';
    apply_payment((int)$pay['invoice_id'], $expected, 'card', $reference, 'Paystack', $reference);
    return 'paid';
}

// ---------- off-site backups (any S3-compatible storage: Backblaze B2, Cloudflare R2, Wasabi, AWS) ----------

/** AWS Signature Version 4 Authorization header for S3 (signs host, x-amz-content-sha256 and x-amz-date). */
function s3_authorization(string $keyId, string $secret, string $region, string $method, string $host, string $path, string $query, string $payloadHash, string $amzDate): string {
    $date = substr($amzDate, 0, 8);
    $headers = ['host' => $host, 'x-amz-content-sha256' => $payloadHash, 'x-amz-date' => $amzDate];
    $canonHeaders = '';
    foreach ($headers as $k => $v) $canonHeaders .= "$k:" . trim($v) . "\n";
    $signed = implode(';', array_keys($headers));
    $canon = "$method\n$path\n$query\n$canonHeaders\n$signed\n$payloadHash";
    $scope = "$date/$region/s3/aws4_request";
    $toSign = "AWS4-HMAC-SHA256\n$amzDate\n$scope\n" . hash('sha256', $canon);
    $k = hash_hmac('sha256', 'aws4_request', hash_hmac('sha256', 's3', hash_hmac('sha256', $region, hash_hmac('sha256', $date, 'AWS4' . $secret, true), true), true), true);
    return "AWS4-HMAC-SHA256 Credential=$keyId/$scope,SignedHeaders=$signed,Signature=" . hash_hmac('sha256', $toSign, $k);
}

/** Upload a file to S3-compatible storage (path-style URL). Throws on failure. */
function s3_put(array $c, string $key, string $file): void {
    $u = parse_url($c['endpoint']);
    $host = $u['host'] . (isset($u['port']) ? ':' . $u['port'] : '');
    $path = '/' . rawurlencode($c['bucket']) . '/' . implode('/', array_map('rawurlencode', explode('/', $key)));
    $hash = hash_file('sha256', $file);
    $amz = gmdate('Ymd\THis\Z');
    $auth = s3_authorization($c['key'], $c['secret'], $c['region'] ?? 'us-east-1', 'PUT', $host, $path, '', $hash, $amz);
    $fh = fopen($file, 'rb');
    $ch = curl_init(($u['scheme'] ?? 'https') . "://$host$path");
    curl_setopt_array($ch, [
        CURLOPT_PUT => true, CURLOPT_INFILE => $fh, CURLOPT_INFILESIZE => filesize($file), CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 600,
        CURLOPT_HTTPHEADER => ["Authorization: $auth", "x-amz-content-sha256: $hash", "x-amz-date: $amz", 'Content-Type: application/octet-stream'],
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    fclose($fh);
    if ($code < 200 || $code >= 300) throw new RuntimeException("Off-site upload of $key failed: HTTP $code $err " . substr((string)$res, 0, 300));
}

// ---------- shared steps used by several screens ----------

/**
 * Add a client (or find them by email), create their project and send the deposit invoice.
 * Used by Quick start and by accepted online quotes. Returns [clientId, projectId, invoiceNumber|null, deposit].
 */
function setup_client_project(string $name, string $email, string $phone, string $title, int $total, int $pct, int $dueDays, string $summary = ''): array {
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $client = q('SELECT id FROM clients WHERE email = ?', [$email])->fetch();
        if ($client) {
            $clientId = (int)$client['id'];
            if ($phone !== '') q("UPDATE clients SET phone = ? WHERE id = ? AND phone = ''", [$phone, $clientId]);
        } else {
            q('INSERT INTO clients (name, email, phone, created_at) VALUES (?, ?, ?, ?)', [$name, $email, $phone, now()]);
            $clientId = (int)$pdo->lastInsertId();
        }
        q('INSERT INTO projects (client_id, title, status, progress, due_date, summary, created_at, updated_at) VALUES (?, ?, ?, 0, NULL, ?, ?, ?)',
            [$clientId, $title, 'planning', $summary !== '' ? $summary : 'Total agreed: KSh ' . number_format($total) . '.', now(), now()]);
        $projectId = (int)$pdo->lastInsertId();
        $deposit = (int)round($total * $pct / 100);
        $number = null;
        if ($deposit > 0) [, $number] = create_invoice($clientId, $projectId, "Deposit ($pct%) for $title", $deposit, date('Y-m-d', strtotime("+$dueDays days")), 'unpaid', false);
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
    notify_client($clientId, 'Welcome to your Marzley Tech client portal',
        "Your project “{$title}” is set up. Sign in with this Google account to follow progress, approve designs and see invoices." .
        ($number ? "\n\nYour deposit invoice $number is KSh " . number_format($deposit) . ". You can pay it by M-Pesa or card in the portal." : ''),
        'Marzley Tech: your project "' . mb_substr($title, 0, 50) . '" is set up.' . ($number ? ' Deposit KSh ' . number_format($deposit) . '.' : '') . ' Portal: ' . portal_url());
    return [$clientId, $projectId, $number, $deposit];
}

/** Ask the client for a rating when their project goes live (once per project). */
function request_feedback(int $projectId): void {
    $p = q('SELECT id, client_id, title FROM projects WHERE id = ?', [$projectId])->fetch();
    if (!$p || q('SELECT id FROM feedback WHERE project_id = ?', [$projectId])->fetch()) return;
    $token = bin2hex(random_bytes(24));
    q('INSERT INTO feedback (project_id, client_id, token, created_at) VALUES (?, ?, ?, ?)', [$projectId, $p['client_id'], $token, now()]);
    $link = portal_url() . 'feedback.php?t=' . $token;
    notify_client((int)$p['client_id'], "“{$p['title']}” is live! How did we do?",
        "Your project “{$p['title']}” is now live. Congratulations!\n\nWould you take 30 seconds to rate working with us? It really helps.\n$link",
        "Marzley Tech: {$p['title']} is live! Rate us in 30 seconds: $link");
}

/** Public site settings (data/site.json), e.g. the Google review link. */
function site_json(): array {
    $d = json_decode((string)@file_get_contents(site_root() . '/data/site.json'), true);
    return is_array($d) ? $d : [];
}

/** Simple per-visitor rate limit for public forms. Returns false when over the limit. */
function rate_ok(string $bucket, int $max, int $seconds): bool {
    $dir = private_dir() . '/portal_ratelimit';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    $file = $dir . '/' . hash('sha256', $bucket . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'x'));
    $hits = array_filter(explode("\n", (string)@file_get_contents($file)), fn($t) => (int)$t > time() - $seconds);
    if (count($hits) >= $max) return false;
    $hits[] = time();
    @file_put_contents($file, implode("\n", $hits), LOCK_EX);
    return true;
}

/** Save an uploaded file outside public_html. Returns [storedName, cleanOriginalName, size]. */
function store_upload(array $up): array {
    if (($up['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) fail(400, 'The upload did not work. Files can be up to 20 MB.');
    if ($up['size'] > 20 * 1024 * 1024) fail(400, 'Files can be up to 20 MB.');
    $ext = strtolower(pathinfo($up['name'], PATHINFO_EXTENSION));
    $allowed = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'zip', 'docx', 'xlsx', 'pptx', 'txt', 'csv'];
    if (!in_array($ext, $allowed, true)) fail(400, 'That file type is not allowed. Use PDF, images, ZIP or Office files.');
    $dir = config()['storage_dir'];
    if (!is_dir($dir) && !@mkdir($dir, 0750, true)) fail(500, 'The file folder could not be created.');
    $stored = bin2hex(random_bytes(16)) . '.' . $ext;
    if (!move_uploaded_file($up['tmp_name'], $dir . '/' . $stored)) fail(500, 'The file could not be saved.');
    $name = mb_substr(preg_replace('/[^\p{L}\p{N} ._()-]/u', '_', $up['name']), 0, 180);
    return [$stored, $name, (int)$up['size']];
}

// ---------- simple public pages (quote, feedback) ----------

function h(?string $v): string { return htmlspecialchars((string)$v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

function page_open(string $title): void {
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    header('Referrer-Policy: no-referrer');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />',
        '<title>', h($title), ' | Marzley Tech Solutions</title><meta name="robots" content="noindex, nofollow" /><meta name="theme-color" content="#0b1b35" />',
        '<link rel="icon" href="../favicon.ico" sizes="any" /><link rel="stylesheet" href="../vendor/fontawesome/css/all.min.css" />',
        '<link rel="stylesheet" href="../css/home.min.css" /><link rel="stylesheet" href="portal.css" /><script src="../js/theme-init.js"></script></head>',
        '<body class="portal-body public-page"><header class="portal-top"><div class="wrap"><a class="brand" href="../"><img src="../img/brand/logo-96.webp" alt="" width="40" height="40" />',
        '<span>Marzley<span class="accent">Tech</span></span></a></div></header><main id="main" class="wrap portal-main public-main">';
}

function page_close(): void {
    echo '</main><footer class="public-foot wrap"><p>Marzley Tech Solutions · <a href="tel:+254745789590">+254 745 789 590</a> · ',
        '<a href="https://wa.me/254745789590" target="_blank" rel="noopener noreferrer">WhatsApp</a> · <a href="../privacy">Privacy</a> · <a href="../terms">Terms</a></p></footer>',
        '<script src="../js/print-button.js" defer></script></body></html>';
    exit;
}

function page_message(string $title, string $icon, string $heading, string $html): void {
    page_open($title);
    echo '<section class="public-card public-center"><span class="public-icon"><i class="fa-solid ', h($icon), '" aria-hidden="true"></i></span><h1>', h($heading), '</h1>', $html, '</section>';
    page_close();
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

// ---------- learning hub (free tutorials and notes, videos unlocked with M-Pesa) ----------

/** Fill the tutorials the first time the hub runs, from data/learn-seed.json. They can be edited in the portal afterwards. */
function learn_seed(PDO $pdo): void {
    if ((int)$pdo->query('SELECT COUNT(*) FROM learn_tracks')->fetchColumn() > 0) return;
    $seed = json_decode((string)@file_get_contents(site_root() . '/data/learn-seed.json'), true);
    if (!is_array($seed['tracks'] ?? null)) return;
    $track = $pdo->prepare('INSERT INTO learn_tracks (slug, title, lang, summary, position, published) VALUES (?, ?, ?, ?, ?, 1)');
    $lesson = $pdo->prepare('INSERT INTO learn_lessons (track_id, slug, title, position, body, exercise, starter, expected, must_contain, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)');
    foreach ($seed['tracks'] as $i => $t) {
        $track->execute([$t['slug'], $t['title'], $t['lang'], $t['summary'] ?? '', $i + 1]);
        $tid = (int)$pdo->lastInsertId();
        foreach ($t['lessons'] as $j => $l) {
            $lesson->execute([$tid, $l['slug'], $l['title'], $j + 1, $l['body'], $l['exercise'] ?? '', $l['starter'] ?? '', $l['expected'] ?? '', $l['must_contain'] ?? '', date('Y-m-d H:i:s')]);
        }
    }
}

/** Private folder for hub videos, posters and notes. */
function learn_dir(string $sub = ''): string {
    $dir = config()['storage_dir'] . '/learn' . ($sub !== '' ? "/$sub" : '');
    if (!is_dir($dir) && !@mkdir($dir, 0750, true)) fail(500, 'The learning hub folder could not be created.');
    return $dir;
}

/**
 * The signed-in learner: ['id', 'email', 'name'] or null. Anyone signed in to the client portal
 * (owner, staff or client) is a learner too, with the same email.
 */
function learner(): ?array {
    if (!empty($_SESSION['learner'])) return $_SESSION['learner'];
    $u = current_user();
    if (!$u) return null;
    return $_SESSION['learner'] = learner_for($u['email'], $u['name'] ?? '');
}

function learner_for(string $email, string $name): array {
    $email = strtolower(trim($email));
    $row = q('SELECT id, email, name FROM learners WHERE email = ?', [$email])->fetch();
    if (!$row) {
        q('INSERT INTO learners (email, name, created_at) VALUES (?, ?, ?)', [$email, mb_substr($name, 0, 120), now()]);
        $row = q('SELECT id, email, name FROM learners WHERE email = ?', [$email])->fetch();
    }
    return ['id' => (int)$row['id'], 'email' => $row['email'], 'name' => $row['name'] ?: $name];
}

/** Owners and staff with the Courses area see every video without paying. */
function learn_is_editor(): bool { return can(current_user(), 'courses'); }

function learn_unlocked(int $videoId, ?array $l): bool {
    if (learn_is_editor()) return true;
    if (!$l) return false;
    return (bool)q('SELECT id FROM learn_unlocks WHERE video_id = ? AND learner_id = ?', [$videoId, $l['id']])->fetch();
}

/**
 * A video unlock payment result arrived: same checks as other payments (full amount, receipt
 * not used before, Safaricom confirms), then the learner can watch. Returns the status.
 */
function settle_learn_payment(string $checkoutId, array $r): string {
    $lp = q('SELECT * FROM learn_payments WHERE checkout_id = ?', [$checkoutId])->fetch();
    if (!$lp) return 'mismatch';
    if ($lp['status'] !== 'pending') return $lp['status'];
    if ((int)($r['result_code'] ?? -1) !== 0) { q("UPDATE learn_payments SET status = 'failed' WHERE id = ?", [$lp['id']]); return 'failed'; }
    $amount = (int)($r['amount'] ?? 0);
    $receipt = strtoupper(preg_replace('/[^A-Z0-9]/i', '', (string)($r['receipt'] ?? '')));
    if ($amount < (int)$lp['amount'] || $receipt === '' || reference_used($receipt)
        || q('SELECT id FROM site_payments WHERE receipt = ?', [$receipt])->fetch() || q('SELECT id FROM learn_payments WHERE receipt = ?', [$receipt])->fetch()) {
        audit('payment_rejected', "Video unlock: amount $amount, receipt '$receipt'", 'M-Pesa');
        q("UPDATE learn_payments SET status = 'failed' WHERE id = ?", [$lp['id']]);   // so the learner is told, and can try again
        return 'mismatch';
    }
    if (empty(mpesa_config()['skip_confirm'])) {
        $code = stk_query($checkoutId);
        if ($code === null) return 'pending';
        if ($code !== '0') { q("UPDATE learn_payments SET status = 'failed' WHERE id = ?", [$lp['id']]); return 'failed'; }
    }
    if (!q("UPDATE learn_payments SET status = 'paid', receipt = ?, paid_amount = ?, paid_at = ? WHERE id = ? AND status = 'pending'", [$receipt, $amount, now(), $lp['id']])->rowCount()) return 'paid';
    if (!q('SELECT id FROM learn_unlocks WHERE video_id = ? AND learner_id = ?', [$lp['video_id'], $lp['learner_id']])->fetch()) {
        q('INSERT INTO learn_unlocks (video_id, learner_id, amount, receipt, created_at) VALUES (?, ?, ?, ?, ?)', [$lp['video_id'], $lp['learner_id'], $amount, $receipt, now()]);
    }
    audit('video_unlocked', "Video {$lp['video_id']} KSh $amount M-Pesa $receipt", 'M-Pesa');
    return 'paid';
}
