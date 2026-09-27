<?php
// Card payments (Paystack).
// GET  paystack.php?reference=…  the client comes back here after paying; we verify and return them to the portal.
// POST paystack.php              Paystack's webhook (set it in Paystack > Settings > API Keys & Webhooks).
// Either way, the payment is only recorded after asking Paystack directly and checking the amount and currency.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
require __DIR__ . '/lib.php';
install_error_alerts('card payments');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = (string)file_get_contents('php://input');
    $p = paystack();
    $sig = (string)($_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] ?? '');
    if (!$p || $sig === '' || !hash_equals(hash_hmac('sha512', $raw, $p['secret_key']), $sig)) {
        http_response_code(401);
        exit;
    }
    $event = json_decode($raw, true);
    http_response_code(200);
    if (($event['event'] ?? '') === 'charge.success' && !empty($event['data']['reference'])) {
        try { settle_card((string)$event['data']['reference']); }
        catch (Throwable $e) { report_error('Paystack webhook', $e->getMessage()); }
    }
    exit;
}

$ref = preg_replace('/[^A-Za-z0-9_-]/', '', (string)($_GET['reference'] ?? $_GET['trxref'] ?? ''));
$result = $ref !== '' ? settle_card($ref) : 'mismatch';
header('Location: ./?card=' . rawurlencode($result), true, 303);
