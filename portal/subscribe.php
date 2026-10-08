<?php
// Mailing list: sign up (POST email, name) → subscribed straight away, with a welcome email; unsubscribe (?u=token).
// Old confirmation links (?c=token) from before still work.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
$cfg = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__, 2) . '/portal-config.php', dirname(__DIR__) . '/portal-config.php'], 'is_readable');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    $reply = function (int $code, array $d) { http_response_code($code); echo json_encode($d); exit; };
    if (!$cfg) $reply(503, ['ok' => false]);
    require __DIR__ . '/lib.php';
    if (trim((string)($_POST['_gotcha'] ?? '')) !== '') $reply(200, ['ok' => true]);
    if (!rate_ok('subscribe', 5, 3600)) $reply(429, ['ok' => false, 'error' => 'Please try again later.']);
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) $reply(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
    $name = mb_substr(trim((string)($_POST['name'] ?? '')), 0, 120);
    $row = q('SELECT * FROM subscribers WHERE email = ?', [$email])->fetch();
    if ($row && $row['status'] === 'subscribed') $reply(200, ['ok' => true, 'already' => true]);
    // No confirmation step: they're subscribed straight away. The welcome email has a one-click unsubscribe link.
    if ($row) { $token = $row['token']; q("UPDATE subscribers SET status = 'subscribed', confirmed_at = COALESCE(confirmed_at, ?), name = CASE WHEN ? <> '' THEN ? ELSE name END WHERE id = ?", [now(), $name, $name, $row['id']]); }
    else { $token = bin2hex(random_bytes(24)); q("INSERT INTO subscribers (email, name, source, status, token, created_at, confirmed_at) VALUES (?, ?, 'website', 'subscribed', ?, ?, ?)", [$email, $name, $token, now(), now()]); }
    send_mail($email, 'Welcome: tips and offers from Marzley Tech', "Hello" . ($name ? " $name" : '') . ",\n\nThanks for subscribing. You'll get practical website and M-Pesa tips, new courses and offers from Marzley Tech Solutions, at most twice a month.\n\n" .
        "Didn't sign up, or changed your mind? Unsubscribe with one click: " . portal_url() . "subscribe.php?u=$token\n\nMarzley Tech Solutions · +254 745 789 590", false);
    $reply(200, ['ok' => true]);
}
if (!$cfg) { http_response_code(404); exit; }
require __DIR__ . '/lib.php';
$c = preg_replace('/[^a-f0-9]/', '', (string)($_GET['c'] ?? ''));
$u = preg_replace('/[^a-f0-9]/', '', (string)($_GET['u'] ?? ''));
if (strlen($c) === 48 && ($row = q('SELECT id, email FROM subscribers WHERE token = ?', [$c])->fetch())) {
    q("UPDATE subscribers SET status = 'subscribed', confirmed_at = COALESCE(confirmed_at, ?) WHERE id = ?", [now(), $row['id']]);
    page_message('Subscribed', 'fa-envelope-circle-check', 'You’re subscribed. Thank you!', '<p>We’ll send practical tips, new courses and offers, at most twice a month. Every email has a one-click unsubscribe link.</p><p><a class="btn btn-solid" href="../">Back to the website</a></p>');
}
if (strlen($u) === 48 && ($row = q('SELECT id FROM subscribers WHERE token = ?', [$u])->fetch())) {
    q("UPDATE subscribers SET status = 'unsubscribed' WHERE id = ?", [$row['id']]);
    page_message('Unsubscribed', 'fa-envelope', 'You’ve been unsubscribed', '<p>You won’t get any more newsletter emails from us. Invoices and messages about your own project still come as usual.</p><p><a class="btn btn-ghost" href="../">Back to the website</a></p>');
}
http_response_code(404);
page_message('Link not found', 'fa-link-slash', 'This link doesn’t work', '<p>Please use the full link from your email.</p>');
