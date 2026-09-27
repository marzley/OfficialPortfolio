<?php
// M-Pesa (Safaricom Daraja) STK push callback.
// Safaricom POSTs the result of each payment here. We log it outside the public
// web folder and always answer "Accepted" so Safaricom does not keep retrying.
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ResultCode' => 1, 'ResultDesc' => 'Method not allowed']);
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
    @file_put_contents($store . '/' . $id . '.json', json_encode([
        'result_code' => $entry['result_code'],
        'result_desc' => $entry['result_desc'],
        'amount'      => $entry['amount'],
        'receipt'     => $entry['receipt'],
        'time'        => $entry['time'],
    ]));
}

echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
