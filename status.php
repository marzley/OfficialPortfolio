<?php
// Returns the outcome of an M-Pesa STK push, as reported to callback.php.
// Only non-personal fields are returned (no phone numbers).
header('Content-Type: application/json');
header('Cache-Control: no-store');

$id = preg_replace('/[^A-Za-z0-9_-]/', '', (string)($_GET['id'] ?? ''));
if ($id === '' || strlen($id) > 100) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing payment reference.']);
    exit;
}

$baseDir = is_writable(dirname(__DIR__)) ? dirname(__DIR__) : __DIR__;
$file = $baseDir . '/mpesa_results/' . $id . '.json';
if (!is_readable($file)) {
    echo json_encode(['status' => 'pending']);
    exit;
}

$r = json_decode((string)file_get_contents($file), true) ?: [];
$code = isset($r['result_code']) ? (int)$r['result_code'] : -1;
echo json_encode([
    'status'  => $code === 0 ? 'paid' : 'failed',
    'code'    => $code,
    'message' => $r['result_desc'] ?? '',
    'amount'  => $r['amount'] ?? null,
    'receipt' => $r['receipt'] ?? null,
]);
