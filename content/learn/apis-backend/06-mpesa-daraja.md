---
slug: mpesa-daraja-api
title: "M-Pesa Daraja API: STK push and callbacks step by step"
after: auth-passwords-tokens
---
# M-Pesa Daraja API: STK push and callbacks step by step

Safaricom's **Daraja API** lets your backend request M-Pesa payments. The most used feature is **Lipa na M-Pesa Online (STK push)**: your server asks Safaricom to show a PIN prompt on the customer's phone, and Safaricom tells your server the result through a **callback**.

> The overall flow and safety rules are in **App development fundamentals → M-Pesa in apps**. This lesson is the backend side. Always build and test in the **sandbox** first (developer.safaricom.co.ke).

## What you need

| Item | Where from |
|---|---|
| **Consumer key and secret** | Your app on the Daraja portal |
| **Shortcode** | Your Paybill or Till (sandbox: the test shortcode Daraja gives you) |
| **Passkey** | Daraja (sandbox passkey) or Safaricom when going live |
| **Callback URL** | A public **HTTPS** URL on your server |

Keep all of them on the **server**, in a config file outside `public_html` or in environment variables.

## Step 1: get an access token

Daraja uses OAuth: send your key and secret (Basic auth) and receive a token valid for about an hour.

```php
<?php
function daraja_token(array $cfg): string {
    $ch = curl_init($cfg['base'] . '/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => ['Authorization: Basic ' . base64_encode($cfg['key'] . ':' . $cfg['secret'])],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
    ]);
    $res = json_decode((string)curl_exec($ch), true);
    curl_close($ch);
    if (empty($res['access_token'])) throw new RuntimeException('Could not get a Daraja token');
    return $res['access_token'];      // cache it for ~55 minutes instead of asking every time
}
```

`base` is `https://sandbox.safaricom.co.ke` for testing and `https://api.safaricom.co.ke` in production.

## Step 2: the password and timestamp

The STK push needs a **timestamp** (`YYYYMMDDHHmmss`, Kenyan time) and a **password** = base64(shortcode + passkey + timestamp). You can run this:

```try-php
<?php
date_default_timezone_set('Africa/Nairobi');

$shortcode = '174379';                                   // the sandbox test shortcode
$passkey = 'your-passkey-from-daraja';                   // placeholder: never publish a real passkey
$timestamp = date('YmdHis');
$password = base64_encode($shortcode . $passkey . $timestamp);

echo "Timestamp: $timestamp\n";
echo "Password:  $password\n";
echo "Decoded:   ", base64_decode($password), "\n";       // shortcode + passkey + timestamp
```

## Step 3: normalise the phone number

```try-javascript
// Daraja wants 2547XXXXXXXX or 2541XXXXXXXX
function toMsisdn(input) {
  const d = String(input).replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(d)) return "254" + d.slice(1);
  if (/^254[17]\d{8}$/.test(d)) return d;
  if (/^[17]\d{8}$/.test(d)) return "254" + d;
  return null;
}

for (const p of ["0712 345 678", "+254 712-345-678", "712345678", "0112345678", "12345"]) {
  console.log(p.padEnd(18), "->", toMsisdn(p));
}
```

## Step 4: send the STK push

```php
<?php
function stk_push(array $cfg, string $phone, int $amount, string $orderRef): array {
    date_default_timezone_set('Africa/Nairobi');
    $timestamp = date('YmdHis');
    $body = [
        'BusinessShortCode' => $cfg['shortcode'],
        'Password' => base64_encode($cfg['shortcode'] . $cfg['passkey'] . $timestamp),
        'Timestamp' => $timestamp,
        'TransactionType' => 'CustomerPayBillOnline',     // 'CustomerBuyGoodsOnline' for a Till
        'Amount' => $amount,                              // whole shillings, computed by YOUR server
        'PartyA' => $phone,                               // 2547XXXXXXXX
        'PartyB' => $cfg['shortcode'],                    // for a Till: the till number
        'PhoneNumber' => $phone,
        'CallBackURL' => $cfg['callback_url'],
        'AccountReference' => $orderRef,                  // e.g. "ORDER1042" (shown to the customer)
        'TransactionDesc' => 'Payment for ' . $orderRef,
    ];
    $ch = curl_init($cfg['base'] . '/mpesa/stkpush/v1/processrequest');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . daraja_token($cfg), 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    $res = json_decode((string)curl_exec($ch), true) ?: [];
    curl_close($ch);
    return $res;     // on success: ResponseCode "0" and a CheckoutRequestID: save it with the order
}
```

Save the **CheckoutRequestID** against the order with status `pending`. **Don't** mark the order paid yet.

## Step 5: handle the callback

Safaricom POSTs JSON to your callback URL. A successful payment looks like this (shortened):

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_011020261430123456",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 1240 },
          { "Name": "MpesaReceiptNumber", "Value": "SJ12ABC3DE" },
          { "Name": "TransactionDate", "Value": 20261001143045 },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}
```

A non-zero `ResultCode` means failure (for example `1032` = cancelled by the user, `1` = insufficient balance). Parse it safely:

```try-php
<?php
$raw = '{"Body":{"stkCallback":{"CheckoutRequestID":"ws_CO_011020261430123456","ResultCode":0,"ResultDesc":"OK",
  "CallbackMetadata":{"Item":[{"Name":"Amount","Value":1240},{"Name":"MpesaReceiptNumber","Value":"SJ12ABC3DE"},{"Name":"PhoneNumber","Value":254712345678}]}}}}';

$cb = json_decode($raw, true)['Body']['stkCallback'] ?? null;
if (!$cb) { echo "Not an STK callback\n"; exit; }

$meta = [];
foreach ($cb['CallbackMetadata']['Item'] ?? [] as $item) {
    $meta[$item['Name']] = $item['Value'] ?? null;
}

$checkout = $cb['CheckoutRequestID'];
if ((int)$cb['ResultCode'] === 0) {
    echo "PAID: checkout $checkout, KSh {$meta['Amount']}, receipt {$meta['MpesaReceiptNumber']}\n";
    // 1. find the pending order by CheckoutRequestID
    // 2. check the amount matches what you requested
    // 3. if this receipt is already recorded, stop (duplicate callback)
    // 4. mark the order paid, save the receipt, notify the customer
} else {
    echo "NOT PAID ({$cb['ResultCode']}): {$cb['ResultDesc']}\n";
}
```

Callback rules:

- **Respond quickly** with a success JSON (`{"ResultCode":0,"ResultDesc":"Accepted"}`) and do slow work after.
- **Idempotent**: store receipts with a UNIQUE constraint so a repeated callback can't double-credit.
- **Verify** the CheckoutRequestID belongs to a pending order and the **amount matches**.
- **Log** every raw callback.
- Callbacks can be **late or missing**: use the **STK Push Query** endpoint (`/mpesa/stkpushquery/v1/query`) for orders still pending after a couple of minutes, and a scheduled job (cron) to settle the rest.

## Going live

1. Build and test fully in the sandbox (success, cancel, wrong PIN, timeout).
2. Apply on the Daraja portal to go live with your Paybill/Till; Safaricom gives production credentials and the passkey.
3. Switch `base` to production, update credentials (in your private config only).
4. Test with a few real KSh 1 to 10 payments before launch.

Other Daraja APIs: **C2B** (notifications when customers pay your Paybill from the M-Pesa menu), **B2C** (pay customers: refunds, salaries), **Transaction Status** and **Account Balance**.

```quiz
Q: What is the sandbox base URL host for Daraja? Write the domain.
A: sandbox.safaricom.co.ke | https://sandbox.safaricom.co.ke
Q: The STK password is base64 of shortcode + passkey + ...?
A: timestamp | the timestamp
Q: In what format is the timestamp? Write the pattern.
A: YYYYMMDDHHmmss | YmdHis | yyyymmddhhmmss
Q: Which ResultCode means the payment succeeded?
A: 0 | zero
Q: Which ID links the callback to the order you saved?
A: CheckoutRequestID
Q: Which endpoint checks a pending payment when no callback arrives?
A: STK Push Query | stkpushquery | STK query
```
