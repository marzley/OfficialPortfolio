<?php
// Mailing list: sign up (POST email, name) → confirmation email → confirm (?c=token); unsubscribe (?u=token).
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
    if ($row) { $token = $row['token']; q("UPDATE subscribers SET status = 'pending', name = CASE WHEN ? <> '' THEN ? ELSE name END WHERE id = ?", [$name, $name, $row['id']]); }
    else { $token = bin2hex(random_bytes(24)); q("INSERT INTO subscribers (email, name, source, status, token, created_at) VALUES (?, ?, 'website', 'pending', ?, ?)", [$email, $name, $token, now()]); }
    send_mail($email, 'Please confirm: tips and offers from Marzley Tech', "Hello" . ($name ? " $name" : '') . ",\n\nPlease confirm you'd like occasional emails from Marzley Tech Solutions: practical website and M-Pesa tips, new courses and offers. At most two a month.\n\nConfirm: " .
        portal_url() . "subscribe.php?c=$token\n\nIf you didn't ask for this, ignore this email and you won't hear from us.\n\nMarzley Tech Solutions · +254 745 789 590", false);
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
