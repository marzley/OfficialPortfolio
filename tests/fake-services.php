<?php
// Stand-ins for Paystack and S3 storage, so payments and off-site backups can be tested offline.
// State lives in FAKE_DIR. POST /_control sets how Paystack answers the next verify.
$dir = getenv('FAKE_DIR');
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$state = json_decode((string)@file_get_contents("$dir/paystack.json"), true) ?: ['tx' => [], 'override' => null];
$save = function () use ($dir, &$state) { file_put_contents("$dir/paystack.json", json_encode($state)); };
header('Content-Type: application/json');

if ($path === '/_control') { $state['override'] = json_decode(file_get_contents('php://input'), true); $save(); echo '{}'; return; }

if (str_starts_with($path, '/paystack/')) {
    if (($_SERVER['HTTP_AUTHORIZATION'] ?? '') !== 'Bearer sk_test_fake') { http_response_code(401); echo '{"status":false}'; return; }
    if ($path === '/paystack/transaction/initialize') {
        $b = json_decode(file_get_contents('php://input'), true);
        $state['tx'][$b['reference']] = $b; $save();
        echo json_encode(['status' => true, 'data' => ['authorization_url' => 'https://checkout.paystack.com/fake-' . $b['reference'], 'reference' => $b['reference']]]);
        return;
    }
    if (preg_match('#^/paystack/transaction/verify/(.+)$#', $path, $m)) {
        $ref = rawurldecode($m[1]);
        $tx = $state['tx'][$ref] ?? null;
        if (!$tx) { http_response_code(404); echo '{"status":false}'; return; }
        $o = $state['override'] ?? [];
        echo json_encode(['status' => true, 'data' => ['status' => $o['status'] ?? 'success', 'reference' => $ref,
            'amount' => $o['amount'] ?? $tx['amount'], 'currency' => $o['currency'] ?? $tx['currency']]]);
        return;
    }
}

// S3: PUT /bucket/key with a valid Signature V4
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    define('MARZLEY_PORTAL', true);
    require __DIR__ . '/../portal/lib.php';
    $body = file_get_contents('php://input');
    $hash = hash('sha256', $body);
    $expect = s3_authorization('TESTKEY', 'TESTSECRET', 'us-east-1', 'PUT', $_SERVER['HTTP_HOST'], $path, '', $hash, $_SERVER['HTTP_X_AMZ_DATE'] ?? '');
    if (($_SERVER['HTTP_X_AMZ_CONTENT_SHA256'] ?? '') !== $hash || ($_SERVER['HTTP_AUTHORIZATION'] ?? '') !== $expect) { http_response_code(403); echo 'SignatureDoesNotMatch'; return; }
    @mkdir("$dir/s3" . dirname($path), 0777, true);
    file_put_contents("$dir/s3$path", $body);
    http_response_code(200);
    return;
}
http_response_code(404);
echo '{}';
