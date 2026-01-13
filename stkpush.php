<?php
header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}
// CONFIG
$consumerKey    = "bIMElZm58IevlA8fU560lYyXRta3pblC2aBGyoGdAMFIaAXm";
$consumerSecret = "MXi9gOMaccGJYJ68evZbARlxt0i6xkUJpKqI2tRXTiNcDensdXBBTfvlYvYWjlCV";
$shortcode      = "9410588";        // Go Live Shortcode (updated to Safaricom value)
$tillNumber     = "6095737";        // Till Number (PartyB) - use if you want a till
$passkey        = "e926ebb4d8b79c5dfb5de5385ffeb5bba92f81c6b3345254f981da5ca33697ae";
$callbackUrl    = "https://pixel.gatangatvc.ac.ke/callback.php"; // Update to your callback URL
$logFile        = __DIR__ . '/stk_request.log';

// INPUT
$rawPhone = $_POST['phone'] ?? '';
$amount   = isset($_POST['amount']) ? (int)$_POST['amount'] : 0;
if ($amount <= 0) $amount = 1;

////////////////////////////////////////////////////////////
// CHANGED: Try to detect logged-in user and override phone
// - Uses session username if present
// - Attempts a DB lookup in `users` table for columns phone/msisdn/mobile
// - Safe fallbacks and non-fatal logging to $logFile
////////////////////////////////////////////////////////////
session_start(); // ensure session is available

$username = $_SESSION['username'] ?? null;
if ($username) {
    // Prefer an existing config.php for DB credentials if present.
    if (file_exists(__DIR__ . '/config.php')) {
        // config.php may define $db_host, $db_user, $db_pass, $db_name
        include __DIR__ . '/config.php';
    }

    // sensible defaults if config.php not present
    $db_host = $db_host ?? 'localhost';
    $db_user = $db_user ?? 'root';
    $db_pass = $db_pass ?? '';
    $db_name = $db_name ?? ''; // leave blank if unknown

    // Only attempt DB if a database name is available; avoid noisy failures.
    if ($db_name !== '') {
        $mysqli = @new mysqli($db_host, $db_user, $db_pass, $db_name);
        if ($mysqli && !$mysqli->connect_errno) {
            // Try to pick common phone column names; return first match.
            $stmt = $mysqli->prepare("SELECT COALESCE(phone, msisdn, mobile, '') AS phone FROM users WHERE username = ? LIMIT 1");
            if ($stmt) {
                $stmt->bind_param('s', $username);
                $stmt->execute();
                $stmt->bind_result($dbPhone);
                if ($stmt->fetch() && !empty($dbPhone)) {
                    // Override incoming phone with the user's stored phone
                    $rawPhone = $dbPhone;
                    file_put_contents($logFile, date('c') . " - override raw_phone from db for user:$username phone:$dbPhone\n", FILE_APPEND);
                }
                $stmt->close();
            } else {
                file_put_contents($logFile, date('c') . " - db_prepare_failed for user:$username\n", FILE_APPEND);
            }
            $mysqli->close();
        } else {
            file_put_contents($logFile, date('c') . " - db_connect_error for user:$username: " . ($mysqli->connect_error ?? 'unknown') . "\n", FILE_APPEND);
        }
    } else {
        file_put_contents($logFile, date('c') . " - db_lookup_skipped: no db_name configured for user:$username\n", FILE_APPEND);
    }
}
function normalizePhone($input) {
    $s = preg_replace('/[^0-9+]/', '', trim((string)$input));
    if ($s === '') return null;
    if ($s[0] === '+') $s = substr($s, 1);
    if (preg_match('/^2547\d{8}$/', $s)) return $s;
    if (preg_match('/^2541\d{8}$/', $s)) return $s;
    if (preg_match('/^07\d{8}$/', $s)) return '254' . substr($s, 1);
    if (preg_match('/^7\d{8}$/', $s)) return '254' . $s;
    if (preg_match('/^[0-9]{9,}$/', $s)) {
        $last9 = substr($s, -9);
        if (preg_match('/^7\d{8}$/', $last9)) return '254' . $last9;
    }
    return null;
}

$phone = normalizePhone($rawPhone);
file_put_contents($logFile, date('c') . " - received raw_phone:$rawPhone normalized:" . ($phone ?? 'invalid') . " amount:$amount\n", FILE_APPEND);

if (!$phone) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid phone number', 'raw' => $rawPhone]);
    exit;
}

// GENERATE ACCESS TOKEN
$tokenUrl = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
$ch = curl_init($tokenUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $consumerKey . ':' . $consumerSecret);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$rawToken = curl_exec($ch);
$errNo = curl_errno($ch);
$err = curl_error($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
file_put_contents($logFile, date('c') . " - token_http:$httpStatus curl_errno:$errNo curl_error:$err raw_len:" . strlen($rawToken) . "\n", FILE_APPEND);

if ($rawToken === false || $errNo !== 0) {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to fetch access token', 'curl_error' => $err]);
    exit;
}
$tokenData = json_decode($rawToken, true);
if (json_last_error() !== JSON_ERROR_NONE || empty($tokenData['access_token'])) {
    file_put_contents($logFile, date('c') . " - token_raw:" . $rawToken . "\n", FILE_APPEND);
    http_response_code(502);
    echo json_encode(['error' => 'Invalid token response', 'http_status' => $httpStatus]);
    exit;
}
$accessToken = $tokenData['access_token'];

// BUILD STK PAYLOAD (use BusinessShortCode key as required by API)
$timestamp = date('YmdHis');
$password  = base64_encode($shortcode . $passkey . $timestamp);

$stkPayload = [
    'BusinessShortCode' => $shortcode,
    'Password' => $password,
    'Timestamp' => $timestamp,
    'TransactionType' => 'CustomerBuyGoodsOnline',
    'Amount' => (int)$amount,
    'PartyA' => $phone,
    'PartyB' => $tillNumber, // use till number as PartyB per Safaricom
    'PhoneNumber' => $phone,
    'CallBackURL' => $callbackUrl,
    'AccountReference' => 'Payment',
    'TransactionDesc' => 'STK Push'
];

$dataString = json_encode($stkPayload);
file_put_contents($logFile, date('c') . " - stk_request:" . $dataString . "\n", FILE_APPEND);

$stkCurl = curl_init('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
curl_setopt($stkCurl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($stkCurl, CURLOPT_POST, true);
curl_setopt($stkCurl, CURLOPT_POSTFIELDS, $dataString);
curl_setopt($stkCurl, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $accessToken,
    'Content-Type: application/json'
]);
curl_setopt($stkCurl, CURLOPT_TIMEOUT, 30);

$rawStk = curl_exec($stkCurl);
$stkErrNo = curl_errno($stkCurl);
$stkErr = curl_error($stkCurl);
$stkHttp = curl_getinfo($stkCurl, CURLINFO_HTTP_CODE);
curl_close($stkCurl);

file_put_contents($logFile, date('c') . " - stk_http:$stkHttp curl_errno:$stkErrNo curl_error:$stkErr raw_len:" . strlen($rawStk) . "\n", FILE_APPEND);

if ($rawStk === false || $stkErrNo !== 0) {
    http_response_code(502);
    echo json_encode(['error' => 'STK request failed', 'curl_error' => $stkErr]);
    exit;
}

$respObj = json_decode($rawStk, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    file_put_contents($logFile, date('c') . " - stk_raw_response:" . $rawStk . "\n", FILE_APPEND);
    http_response_code(502);
    echo json_encode(['error' => 'Invalid STK response', 'http_status' => $stkHttp]);
    exit;
}

// Log and return success response
file_put_contents($logFile, date('c') . " - stk_response:" . json_encode($respObj) . "\n", FILE_APPEND);
http_response_code(200);
echo json_encode($respObj);
exit;
