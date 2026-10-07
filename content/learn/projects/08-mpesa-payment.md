---
slug: mpesa-payment-system
title: "Project 7: M-Pesa payment system (Daraja STK push, callbacks, status checks, receipts)"
after: rest-api
---
# Project 7: M-Pesa payment system (Daraja STK push)

"Can it take M-Pesa?" is the first question many Kenyan clients ask. In this project you build a complete, secure payment flow: the customer enters their phone number, gets the M-Pesa PIN prompt (**STK push**), pays, and your system confirms the payment automatically and records the receipt. You'll use the **Safaricom Daraja sandbox**, so no real money moves while you learn.

The same flow powers school fees portals, event tickets, online shops, booking deposits, SACCO contributions and paid downloads.

**You'll practise:** calling an external API with OAuth, building signed requests, receiving webhooks (callbacks), idempotency, verifying payments, and keeping secrets safe.

**Lessons you need:** [M-Pesa Daraja API](./?track=apis-backend&lesson=mpesa-daraja-api), [M-Pesa integration in PHP](./?track=php&lesson=mpesa-integration), [MySQL with PDO](./?track=php&lesson=mysql-pdo), [JSON and fetch](./?track=javascript&lesson=json-fetch). App developers: [M-Pesa in apps](./?track=app-dev-basics&lesson=mpesa-in-apps).

## Step 1: Understand the flow

```text
 Browser                Your server                    Safaricom Daraja           Customer's phone
    │  phone + order ─────▶│                                │                            │
    │                      │── 1. get OAuth token ─────────▶│                            │
    │                      │── 2. STK push request ────────▶│── PIN prompt ─────────────▶│
    │◀── "check your phone"│◀─ CheckoutRequestID ───────────│                            │
    │                      │                                │◀── customer enters PIN ────│
    │                      │◀─ 3. callback (result) ────────│                            │
    │── 4. poll status ───▶│  (marks order paid)            │                            │
    │◀── "Paid! Receipt…" ─│                                │                            │
```

Key facts:
- The browser **never** talks to Daraja. Your consumer key, secret and passkey stay on your server.
- The callback can arrive late, twice, or not at all (for example if your server was briefly down). So you also **query the status** yourself as a backup.
- Never mark an order paid because the browser says so. Only the callback or your own status query decides.

## Step 2: Get sandbox credentials

1. Create an account on the **Safaricom Developer portal** (developer.safaricom.co.ke).
2. Create an app with the M-Pesa Express (Lipa Na M-Pesa Online) product. You get a **consumer key** and **consumer secret**.
3. The sandbox test credentials page gives a test **shortcode** (174379 at the time of writing) and its **passkey**.
4. Your callback URL must be public **HTTPS**. While developing locally, a tunnelling tool (such as ngrok or Cloudflare Tunnel) gives your laptop a temporary public URL, or deploy to your hosting.

Store everything in a config file **outside** your public web folder and out of Git:

```php
<?php
// /home/youruser/mpesa-config.php  (NOT inside public_html, NOT in Git)
return [
    'env'             => 'sandbox',                 // later: 'production'
    'consumer_key'    => 'xxxx',
    'consumer_secret' => 'xxxx',
    'shortcode'       => '174379',
    'passkey'         => 'xxxx',
    'callback_url'    => 'https://yourdomain.co.ke/mpesa/callback.php',
];
```

## Step 3: The database

```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_ref VARCHAR(40) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  amount INT NOT NULL,
  checkout_id VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  result_code INT NULL,
  result_desc VARCHAR(255) NULL,
  receipt VARCHAR(20) NULL UNIQUE,
  paid_amount INT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL
);
```

`receipt UNIQUE` means one M-Pesa receipt can never be used to pay for two orders.

## Step 4: Helpers you can run right now

Phone numbers arrive in every format: `0712…`, `712…`, `+254712…`, `254 712 …`. Daraja wants `2547XXXXXXXX` or `2541XXXXXXXX`. The request also needs a **timestamp** and a **password** built from your shortcode, passkey and timestamp:

```try-php
<?php
function normalise_phone(string $raw): ?string {
    $d = preg_replace('/\D/', '', $raw);          // keep digits only
    if (preg_match('/^0([17]\d{8})$/', $d, $m)) return '254' . $m[1];
    if (preg_match('/^([17]\d{8})$/', $d, $m)) return '254' . $m[1];
    if (preg_match('/^254([17]\d{8})$/', $d, $m)) return '254' . $m[1];
    return null;                                  // not a valid Kenyan mobile number
}

function stk_password(string $shortcode, string $passkey, string $timestamp): string {
    return base64_encode($shortcode . $passkey . $timestamp);
}

foreach (['0712 345 678', '+254 712-345-678', '712345678', '0110123456', '12345'] as $p) {
    echo str_pad($p, 18), ' => ', normalise_phone($p) ?? 'invalid', "\n";
}

$timestamp = '20261007143000';                    // in the real app: date('YmdHis') in Kenyan time
echo "\nTimestamp: $timestamp\n";
echo 'Password:  ', stk_password('174379', 'example-passkey', $timestamp), "\n";
```

Set PHP's timezone to Kenya so timestamps are right: `date_default_timezone_set('Africa/Nairobi');`.

## Step 5: Get a token and send the STK push

```php
<?php
// mpesa.php: functions used by the other files
date_default_timezone_set('Africa/Nairobi');
$cfg = require '/home/youruser/mpesa-config.php';

function daraja_base(array $cfg): string {
    return $cfg['env'] === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
}

function daraja_token(array $cfg): string {
    $ch = curl_init(daraja_base($cfg) . '/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt_array($ch, [
        CURLOPT_USERPWD => $cfg['consumer_key'] . ':' . $cfg['consumer_secret'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
    ]);
    $res = json_decode(curl_exec($ch) ?: '', true);
    curl_close($ch);
    if (empty($res['access_token'])) throw new RuntimeException('Could not get M-Pesa token');
    return $res['access_token'];          // valid for about an hour: cache it in production
}

function daraja_post(array $cfg, string $path, array $body): array {
    $ch = curl_init(daraja_base($cfg) . $path);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . daraja_token($cfg), 'Content-Type: application/json'],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    $res = json_decode(curl_exec($ch) ?: '', true) ?: [];
    curl_close($ch);
    return $res;
}

function stk_push(array $cfg, string $phone, int $amount, string $ref, string $desc): array {
    $ts = date('YmdHis');
    return daraja_post($cfg, '/mpesa/stkpush/v1/processrequest', [
        'BusinessShortCode' => $cfg['shortcode'],
        'Password' => base64_encode($cfg['shortcode'] . $cfg['passkey'] . $ts),
        'Timestamp' => $ts,
        'TransactionType' => 'CustomerPayBillOnline',   // a till number uses CustomerBuyGoodsOnline
        'Amount' => $amount,
        'PartyA' => $phone,
        'PartyB' => $cfg['shortcode'],
        'PhoneNumber' => $phone,
        'CallBackURL' => $cfg['callback_url'],
        'AccountReference' => substr($ref, 0, 12),
        'TransactionDesc' => substr($desc, 0, 13),
    ]);
}
```

The "pay" endpoint the browser calls:

```php
<?php
// pay.php
require 'db.php'; require 'mpesa.php';
header('Content-Type: application/json');
$phone = normalise_phone($_POST['phone'] ?? '');
$order = find_order($pdo, $_POST['order'] ?? '');          // your own function
if (!$phone || !$order) { http_response_code(422); exit(json_encode(['error' => 'Check the phone number and order'])); }

$amount = (int)$order['total'];                              // the amount comes from YOUR database, never from the browser
$res = stk_push($cfg, $phone, $amount, $order['ref'], 'Order ' . $order['ref']);
if (($res['ResponseCode'] ?? '') !== '0') { http_response_code(502); exit(json_encode(['error' => 'M-Pesa is busy. Please try again.'])); }

$pdo->prepare('INSERT INTO payments (order_ref, phone, amount, checkout_id, created_at) VALUES (?, ?, ?, ?, NOW())')
    ->execute([$order['ref'], $phone, $amount, $res['CheckoutRequestID']]);
echo json_encode(['checkout' => $res['CheckoutRequestID']]);
```

**Critical:** the amount comes from your database. If you accept `amount` from the browser, anyone can edit it to pay KSh 1 for a KSh 10,000 order.

## Step 6: Handle the callback

Daraja POSTs JSON to your callback URL. This parser runs here with a sample callback; change `ResultCode` to `1032` (the customer cancelled) and run it again:

```try-php
<?php
$raw = '{"Body":{"stkCallback":{"MerchantRequestID":"29115-34620561-1","CheckoutRequestID":"ws_CO_07102026143012345",
"ResultCode":0,"ResultDesc":"The service request is processed successfully.","CallbackMetadata":{"Item":[
{"Name":"Amount","Value":1500},{"Name":"MpesaReceiptNumber","Value":"TJ7AB1CD2E"},
{"Name":"TransactionDate","Value":20261007143045},{"Name":"PhoneNumber","Value":254712345678}]}}}}';

function parse_stk_callback(string $raw): ?array {
    $cb = json_decode($raw, true)['Body']['stkCallback'] ?? null;
    if (!$cb || !isset($cb['CheckoutRequestID'], $cb['ResultCode'])) return null;
    $meta = [];
    foreach ($cb['CallbackMetadata']['Item'] ?? [] as $item) {
        if (isset($item['Name'], $item['Value'])) $meta[$item['Name']] = $item['Value'];
    }
    return [
        'checkout' => $cb['CheckoutRequestID'],
        'code'     => (int)$cb['ResultCode'],
        'desc'     => $cb['ResultDesc'] ?? '',
        'amount'   => isset($meta['Amount']) ? (int)$meta['Amount'] : null,
        'receipt'  => $meta['MpesaReceiptNumber'] ?? null,
    ];
}

$r = parse_stk_callback($raw);
print_r($r);
echo $r['code'] === 0 ? "Paid with receipt {$r['receipt']}\n" : "Not paid: {$r['desc']}\n";
```

The callback file then updates the database **carefully**:

```php
<?php
// callback.php
require 'db.php'; require 'mpesa.php';
$r = parse_stk_callback(file_get_contents('php://input'));
header('Content-Type: application/json');
echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);   // always acknowledge quickly
if (!$r) exit;

$stmt = $pdo->prepare('SELECT * FROM payments WHERE checkout_id = ?');
$stmt->execute([$r['checkout']]);
$pay = $stmt->fetch();
if (!$pay || $pay['status'] !== 'pending') exit;                      // unknown, or already handled (duplicate callback)

if ($r['code'] === 0 && $r['amount'] !== null && $r['amount'] >= $pay['amount'] && $r['receipt']) {
    $pdo->prepare("UPDATE payments SET status = 'paid', receipt = ?, paid_amount = ?, result_code = 0, updated_at = NOW()
                   WHERE id = ? AND status = 'pending'")->execute([$r['receipt'], $r['amount'], $pay['id']]);
    mark_order_paid($pdo, $pay['order_ref']);                         // your own function
} else {
    $pdo->prepare("UPDATE payments SET status = 'failed', result_code = ?, result_desc = ?, updated_at = NOW()
                   WHERE id = ? AND status = 'pending'")->execute([$r['code'], $r['desc'], $pay['id']]);
}
```

What makes this safe:
- **Idempotent**: a second identical callback does nothing because the payment is no longer `pending`.
- **Amount check**: paid at least what was expected.
- **Receipt is UNIQUE**: one receipt can't settle two orders.
- For extra assurance, call the **STK query** API (next step) before marking paid, so a forged request to your callback URL can't fake a payment. Keep the callback URL hard to guess too (e.g. `/mpesa/cb-8f3k2.php`).

## Step 7: Status polling and the STK query backup

The browser polls your server every 3 seconds: "is checkout X paid yet?" Your server answers from the database. If it's still pending after about 15–20 seconds, the server asks Daraja directly:

```php
function stk_query(array $cfg, string $checkoutId): array {
    $ts = date('YmdHis');
    return daraja_post($cfg, '/mpesa/stkpushquery/v1/query', [
        'BusinessShortCode' => $cfg['shortcode'],
        'Password' => base64_encode($cfg['shortcode'] . $cfg['passkey'] . $ts),
        'Timestamp' => $ts,
        'CheckoutRequestID' => $checkoutId,
    ]);
    // ResultCode "0" = paid; other codes = failed or cancelled; an error saying it's still processing = keep waiting
}
```

Common result codes: **0** success, **1032** cancelled by the user, **1037** the phone couldn't be reached (timeout), **2001** wrong PIN, **1** insufficient balance. Show the customer a friendly message for each, with a **Try again** button.

Also run a **cron job** every few minutes that checks old pending payments with `stk_query`, in case both the callback and the customer's browser disappeared.

## Step 8: The front-end

```javascript
async function pay(order, phone) {
  const form = new URLSearchParams({ order, phone });
  const res = await fetch("pay.php", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) return show(data.error);
  show("Check your phone and enter your M-Pesa PIN…");
  for (let i = 0; i < 40; i++) {                      // about 2 minutes
    await new Promise((r) => setTimeout(r, 3000));
    const s = await (await fetch("status.php?checkout=" + encodeURIComponent(data.checkout))).json();
    if (s.status === "paid") return show("Paid! M-Pesa receipt " + s.receipt);
    if (s.status === "failed") return show(s.message + " You can try again.");
  }
  show("We haven't received confirmation yet. If you paid, tap Check again or contact us with your M-Pesa code.");
}
```

`status.php` must only reveal payments that belong to this visitor (store the checkout ID in their session when they start), so nobody can look up other people's payments.

Good payment UX: show the amount and the phone number clearly, disable the button while waiting, offer **Check now** and **Cancel**, and give a way to recover ("Already paid? Enter your M-Pesa code").

## Step 9: Test every path in the sandbox

| Test | Expected |
|---|---|
| Pay successfully | Order marked paid; receipt saved |
| Cancel the prompt | Status failed (1032); friendly message; can retry |
| Ignore the prompt | Timeout handled; message after polling ends |
| Same callback sent twice | Second one ignored |
| Edit the amount in the browser's DevTools | No effect: the server uses the database amount |
| Fake callback with a used receipt | Rejected |
| Callback URL down, then back up | Cron or status query settles the payment |

## Step 10: Going live

1. Get a real Paybill or Till number for the business (through Safaricom), then apply to **go live** on the Daraja portal. Safaricom will give production credentials and a production passkey.
2. Switch `env` to `production` and update credentials **in the server config file only**.
3. Test with a small real amount (e.g. KSh 1–10) before announcing it.
4. Reconcile: compare your `payments` table with the M-Pesa statement regularly.

:::warning Never do these
- Never put the consumer secret or passkey in JavaScript, a mobile app or a public GitHub repository.
- Never trust the amount, the phone number's payment status or "success" from the browser.
- Never ask customers for their M-Pesa PIN. The STK prompt is the only place they enter it.
:::

## Stretch goals

- C2B (customers pay to your Paybill manually, and your server receives confirmation) and B2C (paying out, e.g. refunds).
- Send an SMS or email receipt.
- An admin page: payments today, failed payments, export to CSV.
- Wrap it into a reusable PHP class or a small Composer package for future clients.

## Summary

- The server talks to Daraja; the browser only talks to your server.
- STK push → callback → database; status queries and cron as backup.
- Amount from your database, idempotent callbacks, unique receipts.
- Secrets live in a config file outside the web folder and out of Git.

```quiz
Q: What is the M-Pesa PIN prompt sent to a customer's phone called? (two words, or its abbreviation)
A: STK push | STK | stk push prompt
Q: Which result code means the customer cancelled the prompt?
A: 1032
Q: Where should the payment amount come from: the browser or your database?
A: database | your database | the database
Q: What is the PHP timezone for Kenya? (Region/City)
A: Africa/Nairobi
Q: Which column constraint stops one M-Pesa receipt from paying two orders?
A: UNIQUE | unique key | a unique key
```
