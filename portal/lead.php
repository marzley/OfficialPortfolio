<?php
// Receives every website enquiry (contact, booking, training and chat call-back forms).
// - Saves it on the Leads board in the client portal (when the portal is set up)
// - Emails you straight away, so a call-back request is never missed
// Works even before the portal is set up: it then just emails the business address.
// Answers JSON {"ok": true} when the enquiry was saved or emailed.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$reply = function (int $code, array $data) { http_response_code($code); echo json_encode($data); exit; };
if ($_SERVER['REQUEST_METHOD'] !== 'POST') $reply(405, ['ok' => false]);
if (trim((string)($_POST['_gotcha'] ?? '')) !== '') $reply(200, ['ok' => true]);   // spam bots fill the hidden field

const BUSINESS_EMAIL = 'marzleytechsolutionltd@gmail.com';

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
$source = $get(['_source', 'form', '_subject'], 60) ?: 'Website';
if ($name === '' || ($email === '' && strlen(preg_replace('/\D/', '', $phone)) < 9)) $reply(400, ['ok' => false, 'error' => 'Please enter your name and a phone number or email.']);

// Everything else they typed becomes the message, one line per field
$referredBy = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', (string)($_POST['referred_by'] ?? '')), 0, 20));
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
$isCallback = stripos($source, 'call') !== false;
$subject = ($isCallback ? 'CALL BACK: ' : 'New enquiry: ') . "$name" . ($phone ? " ($phone)" : '');
$body = ($isCallback ? "Please call $name back on $phone.\n\n" : '') .
    "Name: $name\nPhone: " . ($phone ?: '-') . "\nEmail: " . ($email ?: '-') . "\nFrom: $source\n\n$message\n";

$portalConfig = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__, 2) . '/portal-config.php', dirname(__DIR__) . '/portal-config.php'], 'is_readable');

if (!$portalConfig) {
    // Portal not set up yet: email the business directly
    $from = 'no-reply@' . preg_replace('/^www\./', '', (string)($_SERVER['HTTP_HOST'] ?? 'marzleytechsolutions.co.ke'));
    $sent = @mail(BUSINESS_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body,
        "From: Marzley Tech website <$from>\r\n" . ($email ? "Reply-To: $email\r\n" : '') . "Content-Type: text/plain; charset=UTF-8");
    $reply($sent ? 200 : 502, ['ok' => $sent]);
}

define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
require __DIR__ . '/lib.php';
install_error_alerts('website lead form');
if (!rate_ok('lead', 10, 3600)) $reply(429, ['ok' => false, 'error' => 'Too many requests. Please WhatsApp us instead.']);

$saved = false;
try {
    // Same person again within a day: add to their lead instead of making a new one
    $existing = q("SELECT id, message FROM leads WHERE status = 'new' AND created_at > ? AND ((email <> '' AND email = ?) OR (phone <> '' AND phone = ?))",
        [date('Y-m-d H:i:s', time() - 86400), $email, $phone])->fetch();
    if ($existing) {
        q("UPDATE leads SET message = ?, referred_by = CASE WHEN referred_by = '' THEN ? ELSE referred_by END, updated_at = ? WHERE id = ?", [mb_substr($existing['message'] . "\n\n— $source —\n" . $message, 0, 12000), $referredBy, now(), $existing['id']]);
    } else {
        q('INSERT INTO leads (name, email, phone, source, message, status, value, notes, referred_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)',
            [$name, $email, $phone, $source, $message, 'new', '', $referredBy, now(), now()]);
        audit('lead_received', "$source: $name", 'website');
    }
    $saved = true;
} catch (Throwable $e) {
    report_error('website lead form', $e->getMessage());
}

// Tell the team now (the morning summary also lists new leads)
$mailed = false;
foreach (config()['admin_emails'] ?: [BUSINESS_EMAIL] as $to) $mailed = send_mail($to, $subject, $body . "\nOpen the Leads board: " . portal_url(), false) || $mailed;
if ($isCallback && !empty(config()['sms_alert_phone'])) send_sms(config()['sms_alert_phone'], "Call back $name on $phone (website)");
$reply($saved || $mailed ? 200 : 502, ['ok' => $saved || $mailed]);
