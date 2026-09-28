<?php
// Stand-ins for Paystack, M-Pesa (Daraja), the Claude API and S3 storage, so payments and off-site backups can be tested offline.
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

// Safaricom Daraja stand-in: token, STK push (records the request) and STK query
if ($path === '/oauth/v1/generate') { echo json_encode(['access_token' => 'fake-token', 'expires_in' => '3599']); return; }
if ($path === '/mpesa/stkpush/v1/processrequest') {
    $b = json_decode(file_get_contents('php://input'), true);
    $id = 'ws_CO_' . bin2hex(random_bytes(6));
    file_put_contents("$dir/stk-last.json", json_encode(['id' => $id, 'body' => $b]));
    echo json_encode(['MerchantRequestID' => 'm-' . $id, 'CheckoutRequestID' => $id, 'ResponseCode' => '0', 'CustomerMessage' => 'Success. Request accepted for processing']);
    return;
}
if ($path === '/mpesa/stkpushquery/v1/query') { echo json_encode(['ResultCode' => '0', 'ResultDesc' => 'The service request is processed successfully.']); return; }

// Claude Messages API stand-in: records the request, answers with a canned reply
if (str_starts_with($path, '/v1/messages')) {
    $raw = file_get_contents('php://input');
    file_put_contents("$dir/claude-last.json", json_encode(['headers' => ['x-api-key' => $_SERVER['HTTP_X_API_KEY'] ?? '', 'anthropic-beta' => $_SERVER['HTTP_ANTHROPIC_BETA'] ?? '',
        'anthropic-version' => $_SERVER['HTTP_ANTHROPIC_VERSION'] ?? ''], 'path' => $_SERVER['REQUEST_URI'], 'body' => json_decode($raw, true)]));
    if (($_SERVER['HTTP_X_API_KEY'] ?? '') !== 'sk-ant-test') { http_response_code(401); echo '{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}'; return; }
    $mode = @file_get_contents("$dir/claude-mode") ?: 'ok';
    if ($mode === 'overloaded') { http_response_code(529); echo '{"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}}'; return; }
    $text = "**We** build websites from KSh 15,000, and online shops from KSh 40,000.\nLINK: See packages & prices | pricing\nLINK: Evil site | https://evil.example/";
    echo json_encode(['id' => 'msg_test', 'type' => 'message', 'role' => 'assistant', 'model' => 'claude-opus-5', 'container' => null, 'context_management' => null,
        'content' => [['type' => 'text', 'text' => $text, 'citations' => null]], 'stop_reason' => $mode === 'refusal' ? 'refusal' : 'end_turn', 'stop_sequence' => null, 'stop_details' => null,
        'usage' => ['input_tokens' => 20, 'output_tokens' => 12, 'cache_creation_input_tokens' => 0, 'cache_read_input_tokens' => 0, 'cache_creation' => null, 'server_tool_use' => null, 'service_tier' => 'standard']]);
    return;
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
