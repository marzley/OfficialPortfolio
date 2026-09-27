<?php
// M-Pesa (Safaricom Daraja) STK push callback.
// Safaricom POSTs the result of each payment here. We log it outside the public
// web folder and always answer "Accepted" so Safaricom does not keep retrying.
// A "paid" message here is never trusted on its own: portal invoices are only marked
// paid after the amount, the receipt and a direct query to Safaricom all check out.
header('Content-Type: application/json');

/** mpesa-config.php, kept one folder above public_html. */
function callback_mpesa_config(): array {
    foreach (array_filter([getenv('MPESA_CONFIG') ?: ($_SERVER['MPESA_CONFIG'] ?? null), dirname(__DIR__) . '/mpesa-config.php', __DIR__ . '/mpesa-config.php']) as $file) {
        if (is_readable($file)) { $c = include $file; if (is_array($c)) return $c; }
    }
    return [];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ResultCode' => 1, 'ResultDesc' => 'Method not allowed']);
    exit;
}

// If a secret is set, only requests to callback.php?key=SECRET are accepted (the key is in the
// callback_url we give Safaricom, so nobody else knows the full address).
$secret = (string)(callback_mpesa_config()['callback_secret'] ?? '');
if ($secret !== '' && !hash_equals($secret, (string)($_GET['key'] ?? ''))) {
    http_response_code(403);
    echo json_encode(['ResultCode' => 1, 'ResultDesc' => 'Forbidden']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
$cb   = $data['Body']['stkCallback'] ?? null;

$logDir  = is_writable(dirname(__DIR__)) ? dirname(__DIR__) : __DIR__;
$logFile = $logDir . '/mpesa_callbacks.log';

if (!is_array($cb)) {
    file_put_contents($logFile, date('c') . " - invalid_callback len:" . strlen($raw) . "\n", FILE_APPEND);
    echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    exit;
}

// Pull the useful fields out of CallbackMetadata (only present when payment succeeded)
$meta = [];
foreach (($cb['CallbackMetadata']['Item'] ?? []) as $item) {
    if (isset($item['Name'])) {
        $meta[$item['Name']] = $item['Value'] ?? null;
    }
}

$entry = [
    'time'              => date('c'),
    'merchant_request'  => $cb['MerchantRequestID'] ?? null,
    'checkout_request'  => $cb['CheckoutRequestID'] ?? null,
    'result_code'       => $cb['ResultCode'] ?? null,     // 0 = paid
    'result_desc'       => $cb['ResultDesc'] ?? null,
    'amount'            => $meta['Amount'] ?? null,
    'receipt'           => $meta['MpesaReceiptNumber'] ?? null,
    'transaction_date'  => $meta['TransactionDate'] ?? null,
    'phone'             => $meta['PhoneNumber'] ?? null,
];
file_put_contents($logFile, json_encode($entry) . "\n", FILE_APPEND);

// Save the result so status.php can tell the website whether this payment went through
$id = preg_replace('/[^A-Za-z0-9_-]/', '', (string)($entry['checkout_request'] ?? ''));
if ($id !== '') {
    $store = $logDir . '/mpesa_results';
    if (!is_dir($store)) {
        @mkdir($store, 0750, true);
    }
    // The first result for a payment wins: a repeated or forged message cannot replace it
    $resultFile = $store . '/' . $id . '.json';
    if (!is_file($resultFile)) @file_put_contents($resultFile, json_encode([
        'result_code' => $entry['result_code'],
        'result_desc' => $entry['result_desc'],
        'amount'      => $entry['amount'],
        'receipt'     => $entry['receipt'],
        'time'        => $entry['time'],
    ]));
}

echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);

// Answer Safaricom first, then mark the portal invoice paid (if this payment was for one)
if ($id !== '' && (int)$entry['result_code'] === 0) {
    if (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
    else { @ob_end_flush(); flush(); }
    $portalConfig = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__) . '/portal-config.php', __DIR__ . '/portal-config.php'], 'is_readable');
    if ($portalConfig) {
        define('MARZLEY_PORTAL', true);
        define('MARZLEY_NO_EXIT', true);
        require __DIR__ . '/portal/lib.php';
        try {
            settle_payment($id, json_decode((string)file_get_contents($store . '/' . $id . '.json'), true) ?: []);
        } catch (Throwable $e) {
            report_error('M-Pesa callback', $e->getMessage());
        }
    }
}
