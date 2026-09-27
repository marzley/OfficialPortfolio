<?php
// Receives a copy of every website enquiry (contact, booking, call-back, training forms) and
// saves it on the Leads board in the portal. Formspree still emails you as before.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
require __DIR__ . '/lib.php';
install_error_alerts('website lead form');

$done = function (int $code) { http_response_code($code); header('Cache-Control: no-store'); exit; };
if ($_SERVER['REQUEST_METHOD'] !== 'POST') $done(405);
if (trim((string)($_POST['_gotcha'] ?? '')) !== '') $done(204);   // spam bots fill the hidden field
if (!rate_ok('lead', 10, 3600)) $done(429);

$get = function (array $keys, int $max) {
    foreach ($keys as $k) {
        $v = trim((string)($_POST[$k] ?? ''));
        if ($v !== '') return mb_substr(preg_replace('/\s+/u', ' ', $v), 0, $max);
    }
    return '';
};
$name = $get(['name', 'Name', 'full_name'], 120);
$email = strtolower($get(['email', '_replyto', 'Email'], 190));
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $email = '';
$phone = $get(['phone', 'Phone', 'tel'], 30);
$source = $get(['form', '_source', '_subject'], 60) ?: 'Website';
if ($name === '' || ($email === '' && strlen(preg_replace('/\D/', '', $phone)) < 9)) $done(400);

// Everything else they typed becomes the message, one line per field
$skip = ['name', 'Name', 'full_name', 'email', '_replyto', 'Email', 'phone', 'Phone', 'tel', '_gotcha', 'form', '_source', '_subject', '_next'];
$lines = [];
foreach ($_POST as $k => $v) {
    if (in_array($k, $skip, true) || is_array($v)) continue;
    $v = trim((string)$v);
    if ($v === '') continue;
    $label = ucfirst(str_replace(['_', '-'], ' ', mb_substr((string)$k, 0, 40)));
    $lines[] = ($k === 'message' ? '' : "$label: ") . mb_substr($v, 0, 2000);
}
$message = mb_substr(implode("\n", $lines), 0, 6000);

try {
    // Same person again within a day: add to their lead instead of making a new one
    $existing = q("SELECT id, message FROM leads WHERE status = 'new' AND created_at > ? AND ((email <> '' AND email = ?) OR (phone <> '' AND phone = ?))",
        [date('Y-m-d H:i:s', time() - 86400), $email, $phone])->fetch();
    if ($existing) {
        q('UPDATE leads SET message = ?, updated_at = ? WHERE id = ?', [mb_substr($existing['message'] . "\n\n— $source —\n" . $message, 0, 12000), now(), $existing['id']]);
    } else {
        q('INSERT INTO leads (name, email, phone, source, message, status, value, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)',
            [$name, $email, $phone, $source, $message, 'new', '', now(), now()]);
        audit('lead_received', "$source: $name", 'website');
    }
} catch (Throwable $e) {
    report_error('website lead form', $e->getMessage());
    $done(500);
}
$done(204);
