---
slug: mpesa-integration
title: "M-Pesa STK push with PHP: Daraja setup, access tokens, STK push, callbacks, verification and going live"
after: KEEP
---
# M-Pesa STK push with PHP: Daraja setup, access tokens, STK push, callbacks, verification and going live

In Kenya, customers expect to pay with **M-Pesa**. Safaricom's **Daraja API** lets your website send an **STK push** (the pop-up that asks the customer to enter their M-Pesa PIN) directly to their phone, then tells your server whether they paid. Adding M-Pesa checkout to shops, school fee portals, booking sites, SACCO systems and event ticketing is one of the most in-demand skills for Kenyan web developers, and clients pay well for it.

This unit walks through the whole integration in PHP, from sandbox testing to going live, with the security rules that protect your client's money.

:::warning Keep secrets secret
Your consumer key, consumer secret and passkey are like bank passwords. Store them in a config file **outside public_html**, never in JavaScript, never in Git, never in screenshots or WhatsApp messages. Only your server talks to Daraja.
:::

:::note What you will learn
- How STK push works end to end
- Creating a Daraja app and using the sandbox
- Getting an OAuth access token
- Building the STK push password and timestamp
- Sending the STK push request
- Receiving and verifying the callback
- Querying transaction status
- Database design for payments
- The user experience while waiting
- Going live with a real Paybill or Till
- Common errors and how to fix them
:::

## How STK push works

```
Customer        Your website/server            Safaricom Daraja          Customer's phone
   | "Pay"  -->  | 1. get access token  ----->  |                           |
   |             | 2. STK push request  ----->  | 3. sends PIN prompt --->  |
   |             | <--- CheckoutRequestID ----  |                           |
   | "Check your phone..."                      |     4. customer enters PIN |
   |             | <--- 5. callback (result) -- |                           |
   |             | 6. verify, mark order paid   |                           |
   | "Paid!" <-- |                              |                           |
```

1. Your server requests an **access token** using your app's consumer key and secret.
2. It sends an **STK push** request: amount, phone, your shortcode, a password, a callback URL and a reference.
3. Safaricom sends the PIN prompt to the customer's phone and immediately returns a **CheckoutRequestID**.
4. The customer enters their PIN (or cancels, or ignores it).
5. Safaricom calls your **callback URL** with the result.
6. Your server verifies the result and marks the order paid.

## Step 1: Create a Daraja app (sandbox)

1. Sign up at the Daraja portal (developer.safaricom.co.ke).
2. Create an app and enable the **M-Pesa Express (STK push)** API (product names in the portal may change; look for "M-Pesa Express" or "Lipa Na M-Pesa Online").
3. Note your **Consumer Key** and **Consumer Secret**.
4. The sandbox provides a **test shortcode** (commonly 174379) and a test **passkey**, shown in the portal's test credentials/simulator page.
5. Use the **sandbox** base URL `https://sandbox.safaricom.co.ke` until everything works.

## Step 2: Configuration (outside public_html)

```php
<?php
// /home/youraccount/config/mpesa.php
return [
    'env'             => 'sandbox',   // 'production' when live
    'consumer_key'    => 'xxxx',
    'consumer_secret' => 'xxxx',
    'shortcode'       => '174379',    // your Paybill or the Till's store number when live
    'passkey'         => 'xxxx',
    'callback_url'    => 'https://www.example.co.ke/mpesa/callback.php?key=LONG-RANDOM-SECRET',
];
```

## Step 3: Get an access token

```php
<?php
function mpesa_base(array $c): string {
    return $c['env'] === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
}

function mpesa_token(array $c): string {
    $ch = curl_init(mpesa_base($c) . '/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => $c['consumer_key'] . ':' . $c['consumer_secret'],
        CURLOPT_TIMEOUT => 30,
    ]);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    if (empty($res['access_token'])) {
        throw new RuntimeException('Could not get M-Pesa token');
    }
    return $res['access_token'];      // valid for about an hour: cache it to avoid extra calls
}
```

## Step 4: The password and timestamp

The STK password is **base64(shortcode + passkey + timestamp)**, with the timestamp in `YmdHis` format (Kenyan time):

```try-php
<?php
date_default_timezone_set('Africa/Nairobi');
$shortcode = '174379';
$passkey = 'example-passkey-from-the-portal';
$timestamp = date('YmdHis');                 // e.g. 20260915143005
$password = base64_encode($shortcode . $passkey . $timestamp);
echo "Timestamp: $timestamp\n";
echo "Password:  $password\n";

// Phone must be in 2547XXXXXXXX / 2541XXXXXXXX format
function mpesa_phone(string $p): ?string {
    $d = preg_replace('/\D/', '', $p);
    if (preg_match('/^0([17]\d{8})$/', $d, $m)) return '254' . $m[1];
    if (preg_match('/^254[17]\d{8}$/', $d)) return $d;
    if (preg_match('/^[17]\d{8}$/', $d)) return '254' . $d;
    return null;
}
foreach (['0712 345 678', '+254 110 123 456', '0812345678'] as $p) {
    echo $p, ' -> ', mpesa_phone($p) ?? 'invalid', "\n";
}
```

## Step 5: Send the STK push

```php
<?php
function mpesa_stk_push(array $c, string $phone, int $amount, string $reference, string $description): array {
    date_default_timezone_set('Africa/Nairobi');
    $timestamp = date('YmdHis');
    $body = [
        'BusinessShortCode' => $c['shortcode'],
        'Password'          => base64_encode($c['shortcode'] . $c['passkey'] . $timestamp),
        'Timestamp'         => $timestamp,
        'TransactionType'   => 'CustomerPayBillOnline',   // 'CustomerBuyGoodsOnline' for Till numbers
        'Amount'            => $amount,                    // whole shillings
        'PartyA'            => $phone,                     // customer 2547...
        'PartyB'            => $c['shortcode'],
        'PhoneNumber'       => $phone,
        'CallBackURL'       => $c['callback_url'],
        'AccountReference'  => substr($reference, 0, 12),  // shown to the customer, e.g. order number
        'TransactionDesc'   => substr($description, 0, 13),
    ];
    $ch = curl_init(mpesa_base($c) . '/mpesa/stkpush/v1/processrequest');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . mpesa_token($c), 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_TIMEOUT => 30,
    ]);
    $res = json_decode(curl_exec($ch), true) ?: [];
    curl_close($ch);
    return $res;   // success has ResponseCode "0", MerchantRequestID and CheckoutRequestID
}
```

Before sending, **create the order and payment record** in your database with status `pending`, the amount, phone and order ID. After a successful response, save the **CheckoutRequestID** against it.

## Step 6: Payment table design

```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  phone VARCHAR(12) NOT NULL,
  amount INT NOT NULL,
  checkout_request_id VARCHAR(64) UNIQUE,
  status ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  mpesa_receipt VARCHAR(20) UNIQUE NULL,
  result_code INT NULL,
  result_desc VARCHAR(255) NULL,
  raw_callback JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

The UNIQUE receipt column stops the same M-Pesa receipt being used twice.

## Step 7: Receive the callback

Safaricom POSTs JSON to your callback URL. A successful payment looks like this (simplified):

```json
{"Body": {"stkCallback": {
  "MerchantRequestID": "29115-34620561-1",
  "CheckoutRequestID": "ws_CO_191220191020363925",
  "ResultCode": 0,
  "ResultDesc": "The service request is processed successfully.",
  "CallbackMetadata": {"Item": [
    {"Name": "Amount", "Value": 1500},
    {"Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV"},
    {"Name": "TransactionDate", "Value": 20191219102115},
    {"Name": "PhoneNumber", "Value": 254712345678}
  ]}}}}
```

A non-zero `ResultCode` means it failed (e.g. 1032 = cancelled by the user, 1 = insufficient balance, 1037 = the phone couldn't be reached).

Parse it safely:

```try-php
<?php
$raw = '{"Body":{"stkCallback":{"MerchantRequestID":"29115-34620561-1","CheckoutRequestID":"ws_CO_191220191020363925","ResultCode":0,"ResultDesc":"The service request is processed successfully.","CallbackMetadata":{"Item":[{"Name":"Amount","Value":1500},{"Name":"MpesaReceiptNumber","Value":"NLJ7RT61SV"},{"Name":"TransactionDate","Value":20191219102115},{"Name":"PhoneNumber","Value":254712345678}]}}}}';

$data = json_decode($raw, true);
$cb = $data['Body']['stkCallback'] ?? null;
if (!$cb) { exit("Bad callback\n"); }

$meta = [];
foreach ($cb['CallbackMetadata']['Item'] ?? [] as $item) {
    $meta[$item['Name']] = $item['Value'] ?? null;
}
echo "Checkout: {$cb['CheckoutRequestID']}\n";
echo "Result:   {$cb['ResultCode']} ({$cb['ResultDesc']})\n";
echo "Receipt:  " . ($meta['MpesaReceiptNumber'] ?? '-') . "\n";
echo "Amount:   " . ($meta['Amount'] ?? '-') . "\n";
```

The callback handler (`callback.php`):

```php
<?php
require __DIR__ . '/../../config/bootstrap.php';   // loads db() and $mpesaConfig from outside public_html

// 1. Reject requests without our secret key in the URL
parse_str(parse_url($mpesaConfig['callback_url'], PHP_URL_QUERY), $q);
if (!hash_equals($q['key'], $_GET['key'] ?? '')) {
    http_response_code(403);
    exit;
}

$raw = file_get_contents('php://input');
$cb = json_decode($raw, true)['Body']['stkCallback'] ?? null;
if (!$cb) { http_response_code(400); exit; }

$meta = [];
foreach ($cb['CallbackMetadata']['Item'] ?? [] as $i) { $meta[$i['Name']] = $i['Value'] ?? null; }

$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM payments WHERE checkout_request_id = ?');
$stmt->execute([$cb['CheckoutRequestID']]);
$payment = $stmt->fetch();

if ($payment && $payment['status'] === 'pending') {          // ignore unknown or already-processed
    if ((int)$cb['ResultCode'] === 0 && (int)($meta['Amount'] ?? 0) === (int)$payment['amount']) {
        $pdo->prepare('UPDATE payments SET status = "paid", mpesa_receipt = ?, result_code = 0, result_desc = ?, raw_callback = ? WHERE id = ?')
            ->execute([$meta['MpesaReceiptNumber'], $cb['ResultDesc'], $raw, $payment['id']]);
        $pdo->prepare('UPDATE orders SET status = "paid" WHERE id = ?')->execute([$payment['order_id']]);
    } else {
        $pdo->prepare('UPDATE payments SET status = "failed", result_code = ?, result_desc = ?, raw_callback = ? WHERE id = ?')
            ->execute([$cb['ResultCode'], $cb['ResultDesc'], $raw, $payment['id']]);
    }
}

header('Content-Type: application/json');
echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
```

Verification rules:
- Accept only callbacks with your **secret** in the URL (and over HTTPS).
- Match the **CheckoutRequestID** to a pending payment you created.
- Check the **amount** matches what you expected.
- Process each payment **once** (status check + UNIQUE receipt).
- Never mark an order paid because the **browser** says so.

## Step 8: Query the status (if no callback arrives)

Callbacks can be delayed or lost (your server was down, network issues). Use the **STK Push Query** endpoint (`/mpesa/stkpushquery/v1/query`) with the shortcode, password, timestamp and CheckoutRequestID to ask Safaricom for the result, e.g. when the customer clicks "I've paid" or from a scheduled job checking payments still pending after a few minutes.

## Step 9: The customer's experience

1. After clicking "Pay with M-Pesa", show: "Check your phone and enter your M-Pesa PIN to pay KSh 1,500."
2. Poll your own server every few seconds (JavaScript `fetch('/payment-status.php?id=...')`) which reads the payment status from **your database**.
3. Show success ("Payment received. Receipt NLJ7RT61SV") or a clear failure message with a **Try again** button.
4. Offer a fallback: "Or pay to Paybill 123456, account ORDER-1042, then enter the M-Pesa code", which staff or an automatic C2B confirmation can verify.

## Step 10: Going live

1. The business needs a **Paybill** or **Till (Buy Goods)** number registered with Safaricom, in the business's name.
2. Apply to **go live** in the Daraja portal; Safaricom verifies the business and the shortcode administrator.
3. You receive **production credentials** and the live **passkey**.
4. Switch `env` to production, update shortcode/passkey/keys, use a real HTTPS callback URL.
5. For **Till numbers**, use `CustomerBuyGoodsOnline`; the shortcode in the password is the store number and `PartyB` is the till number (check Safaricom's current documentation for your setup).
6. Test with a small real payment (e.g. KSh 1–10), then refund or account for it.

## Common errors

| Problem | Likely cause |
|---|---|
| `Invalid Access Token` | Expired token, or sandbox token used on production (or vice versa) |
| `Bad Request - Invalid PhoneNumber` | Phone not in 2547/2541 format |
| `Bad Request - Invalid Timestamp` / wrong password | Timestamp format wrong, or password built with a different timestamp |
| Prompt never arrives | Wrong phone, phone off, SIM toolkit issue; check status query |
| Callback never received | Callback URL not public HTTPS, blocked by firewall/hosting, redirect (e.g. http→https), or an error in your script (check logs) |
| Paid twice / duplicate updates | No idempotency check: use status + UNIQUE receipt |

Log every request and callback (without secrets) so you can investigate disputes.

:::think A developer's checkout page shows "Payment successful" as soon as the STK push request returns ResponseCode 0. What's wrong?
ResponseCode 0 only means Safaricom **accepted the request** and sent the prompt; the customer hasn't paid yet (they may cancel or have insufficient funds). The order must be marked paid only after a verified callback (ResultCode 0, matching amount and CheckoutRequestID) or a status query confirms it.
:::

## Summary

- STK push: token → push request (CheckoutRequestID) → customer enters PIN → callback → verify → mark paid.
- Test in the Daraja sandbox; keep keys and passkey in a config file outside public_html.
- Password = base64(shortcode + passkey + timestamp); phones in 2547/2541 format.
- Save a pending payment first; verify callbacks by secret, CheckoutRequestID, amount and single processing.
- Use status queries as a backup, give customers clear waiting/fallback screens, and go live with a real Paybill/Till.

```quiz
Q: What is Safaricom's developer API platform called?
A: Daraja | daraja api
Q: Should you trust the browser to tell you a payment succeeded? (yes/no)
A: no
Q: In which environment should you test first?
A: sandbox | the sandbox
Q: The STK password is base64 of shortcode + passkey + what?
A: timestamp | the timestamp
Q: Which ResultCode in the callback means success?
A: 0 | zero
Q: Which ID returned by the STK push request links it to the callback?
A: CheckoutRequestID | checkout request id
```

**Learn more:** [Safaricom Daraja developer portal](https://developer.safaricom.co.ke/) · [PHP manual: cURL](https://www.php.net/manual/en/book.curl.php)
