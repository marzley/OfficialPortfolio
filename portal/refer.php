<?php
// Someone signed up for the referral programme on the website: remember their code, name and
// M-Pesa number, so rewards can be matched when a referred client pays.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$reply = function (int $code, array $d) { http_response_code($code); echo json_encode($d); exit; };
if ($_SERVER['REQUEST_METHOD'] !== 'POST') $reply(405, ['ok' => false]);
$cfg = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__, 2) . '/portal-config.php', dirname(__DIR__) . '/portal-config.php'], 'is_readable');
if (!$cfg) $reply(200, ['ok' => false]);
require __DIR__ . '/lib.php';
if (!rate_ok('refer', 10, 3600)) $reply(429, ['ok' => false]);
$name = mb_substr(trim(preg_replace('/\s+/u', ' ', (string)($_POST['name'] ?? ''))), 0, 120);
$phone = trim((string)($_POST['phone'] ?? ''));
$code = referral_code($phone);
if ($name === '' || !$code) $reply(400, ['ok' => false]);
try {
    if (!q('SELECT id FROM referrers WHERE code = ?', [$code])->fetch()) {
        q('INSERT INTO referrers (code, name, phone, created_at) VALUES (?, ?, ?, ?)', [$code, $name, '0' . substr((string)normalise_phone($phone), 3), now()]);
        audit('referrer_joined', "$name ($code)", 'website');
    }
} catch (Throwable $e) {
    report_error('referral sign-up', $e->getMessage());
    $reply(500, ['ok' => false]);
}
$reply(200, ['ok' => true, 'code' => $code]);
