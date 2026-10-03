---
slug: mpesa-in-apps
title: Taking M-Pesa payments in your app (the safe way)
after: data-offline-security
---
# Taking M-Pesa payments in your app (the safe way)

In Kenya, an app that sells something almost always needs **M-Pesa**. Safaricom's **Daraja API** lets your system send an **STK push**: a PIN prompt appears on the customer's phone, they enter their PIN, and your system gets confirmation automatically. This lesson explains the full flow and the security rules. (The code for the backend is in **APIs & backends → M-Pesa Daraja**.)

## The golden rule

> **The app never talks to Daraja directly. Your server does.**

Daraja needs a **consumer key, consumer secret and passkey**. If they're inside your app, anyone can extract them and misuse your till. The app talks to **your backend**; the backend talks to Safaricom.

## The STK push flow

```
1. Customer taps "Pay KSh 1,240" in the app
2. App → your server:  POST /api/pay  { order_id: 1042, phone: "0712345678" }
3. Server: checks the order and amount FROM ITS OWN DATABASE (never trusts the app's amount)
4. Server → Daraja: get an access token, then send the STK push request
5. Daraja → customer's phone: PIN prompt "Pay KSh 1,240 to Duka Connect?"
6. Customer enters PIN
7. Daraja → your server's CALLBACK URL: result (success + M-Pesa receipt, or failure/cancel)
8. Server: marks order 1042 as paid, saves the receipt (e.g. SGH4XXXXXX)
9. App: asks the server for the order status (or gets a push notification) → shows "Paid ✓"
```

## Why the server checks the amount

If the app sends "amount: 1240", a tampered app could send "amount: 1". The server must look up order 1042, compute the amount itself, and only then request the payment. **Never trust money values from the app.**

## The callback: the step beginners get wrong

Safaricom sends the result to a **callback URL** on your server (it must be public HTTPS). Rules:

- **Don't mark an order paid when the STK push is sent**; only when the callback says the payment succeeded.
- The callback can arrive **late or not at all**. Also check the status with Daraja's **STK query** if no callback arrives within a minute or two, and run a scheduled job to settle stragglers.
- **Make it idempotent**: if the same callback arrives twice, don't record the payment twice (check the receipt number is unique).
- **Verify** the result matches the request you made (checkout request ID, amount, phone).
- Log every callback for troubleshooting.

## What the user sees

| Moment | App shows |
|---|---|
| After tapping Pay | "Check your phone and enter your M-Pesa PIN" with a spinner |
| Success | "Payment received. Receipt SGH4XXXXXX" |
| Cancelled | "Payment cancelled. Try again?" |
| Insufficient funds / timeout | A clear message and a retry button |
| No answer after ~2 minutes | "We're still checking your payment" (and keep checking on the server) |

## Other payment options

| Option | Use |
|---|---|
| **Till (Buy Goods) / Paybill** | The money goes straight to the business's own number |
| **C2B validation/confirmation** | When customers pay to your Paybill from the M-Pesa menu, your server is notified |
| **B2C** | Your business sends money to customers (refunds, payouts, salaries) |
| **Paystack, Flutterwave, Pesapal** | Cards and M-Pesa through one provider, useful for international customers |
| **Google Play Billing** | Required for selling **digital goods** inside Android apps distributed on Google Play (check Google's current policy) |

## Testing

Daraja has a **sandbox** with test credentials: build and test the whole flow there first. When going live, Safaricom reviews your application and links your production Paybill/Till. Make a few real small payments (KSh 1 to 10) before launch.

## Checklist before launch

- [ ] Secrets only on the server, in environment variables or a config file outside the public folder
- [ ] Amount computed by the server
- [ ] Callback URL is public HTTPS and logs everything
- [ ] Duplicate callbacks can't double-credit
- [ ] STK query / scheduled job settles missed callbacks
- [ ] Clear messages for every outcome
- [ ] Receipts stored and shown to the customer

Marzley Tech Solutions integrates M-Pesa into websites, apps and systems. Read [how to add M-Pesa payments to your website](../how-to-add-mpesa-payments-to-your-website).

## Why M-Pesa integration is a valuable skill

M-Pesa is how most Kenyans pay for goods and services, so businesses want apps and websites that accept it smoothly: shops, schools, SACCOs, landlords, event organisers, delivery services and subscription businesses. Developers who can integrate payments securely and reliably are in high demand. Payment code must be correct, because mistakes cost real money and customer trust.

## Ways to accept M-Pesa

| Option | How it works | Good for |
|---|---|---|
| STK Push (Lipa na M-Pesa Online) | Your server asks Safaricom to send a PIN prompt to the customer's phone | Apps and websites with a checkout |
| Customer pays Till/Paybill manually + C2B confirmation | Customer pays from their phone menu; your server receives confirmation | Simple shops, recurring payments with account numbers |
| Payment aggregators / gateways | A third party provides one API for M-Pesa, cards and other methods | Faster integration, multiple payment methods |
| B2C (business to customer) | Business sends money to customers (refunds, payouts, salaries) | Requires extra approval and strong controls |

Integrations use Safaricom's Daraja API (sandbox for testing, then production approval for live credentials) or a licensed payment provider.

## Designing the orders and payments tables

```text
orders
  id, customer_id, total_amount, status (pending | awaiting_payment | paid | failed | cancelled),
  created_at

payments
  id, order_id, phone, amount, checkout_request_id (UNIQUE), mpesa_receipt (UNIQUE, nullable),
  status (initiated | success | failed | timeout), result_code, result_desc, raw_callback, created_at
```

- `checkout_request_id` links the STK request to its callback.
- `mpesa_receipt` is UNIQUE, so the same payment can never be recorded twice.
- Storing the raw callback (securely) helps investigate disputes.

## The full payment lifecycle

1. App sends `order_id` and phone number to **your server** (never the amount alone).
2. Server loads the order, calculates the amount from the database, and creates a `payments` row (`initiated`).
3. Server requests an STK push with its credentials and a **callback URL** on your server (HTTPS).
4. The customer sees the prompt and enters their PIN (or cancels).
5. Safaricom calls your callback with the result.
6. The callback handler: finds the payment by `checkout_request_id`, checks the result code and amount, records the receipt, marks the order `paid` (in a transaction), and ignores duplicates.
7. The app polls your server (or receives a push notification) and shows success or failure.
8. If no callback arrives within a timeout, the server can **query the transaction status** and update accordingly.

## Callback handler essentials (pseudo-code)

```text
receive POST /mpesa/callback
log raw body (no secrets) with timestamp
parse JSON safely
find payment by CheckoutRequestID → if not found: log and return OK
if payment already final (success/failed): return OK            # idempotency
if ResultCode == 0:
    read Amount, MpesaReceiptNumber, PhoneNumber from metadata
    verify Amount == expected order amount
    in one DB transaction: payment.status = success, store receipt (unique), order.status = paid
    queue receipt SMS/email (don't block the response)
else:
    payment.status = failed, store ResultDesc
return the acknowledgement Safaricom expects, quickly
```

## Common result scenarios to handle

| Scenario | What the user should see |
|---|---|
| Success | "Payment received. Receipt QJK..." |
| Cancelled by user | "You cancelled the payment. Try again?" |
| Wrong PIN / insufficient funds | "Payment didn't go through. Check your balance and try again." |
| Phone unreachable / no response | "We didn't get a response. Make sure your phone is on and try again." |
| Timeout with no callback | "We're confirming your payment..." then status query; never charge twice |

Use the result codes from the official documentation rather than guessing their meanings.

## Reconciliation: matching money to records

Even with callbacks, reconcile regularly:

- Download the M-Pesa statement (business portal) daily or weekly.
- Match receipts to `payments.mpesa_receipt`.
- Investigate statement entries with no matching order (e.g. manual Paybill payments with wrong account numbers) and orders marked paid with no statement entry.
- Keep an audit log of manual adjustments (who, when, why).

## Security and compliance

- Consumer key, secret and passkey live only on the server (environment variables or a secret manager), never in the app or Git.
- The callback URL must be HTTPS; consider allow-listing the provider's IP addresses if documented, and verify by querying status for high-value payments.
- Validate phone numbers and amounts; set sensible limits.
- Protect admin dashboards that can refund or mark orders paid with strong authentication and audit logs.
- Personal data (phone numbers, names) falls under the Data Protection Act; restrict access and retention.

## Testing payments

1. Use the Daraja **sandbox** with test credentials and test numbers from the documentation.
2. Expose your local server for callbacks with a tunnelling tool (e.g. ngrok or Cloudflare Tunnel) during development.
3. Test success, cancellation, timeout, duplicate callbacks and server restarts mid-payment.
4. Before going live, test small real transactions in production with your own phone.
5. Monitor logs closely for the first days after launch.

## Practice

1. Design the `orders` and `payments` tables with the right unique constraints.
2. Write pseudo-code for an idempotent callback handler.
3. List user-facing messages for five payment outcomes.
4. Plan a weekly reconciliation process for a small shop.
5. Set up a sandbox project and trigger a test STK push from a small server script (keeping credentials in environment variables).

:::think A customer complains they paid but the app still shows "awaiting payment". The M-Pesa SMS shows a receipt. What could have happened, and how would you investigate?
Possibly the callback didn't reach your server (wrong URL, server down, HTTPS issue), arrived but failed to process (an error in the handler, amount mismatch), or the order lookup failed. Check server logs and the payments table for the CheckoutRequestID, query the transaction status via the API, confirm the receipt in the business statement, then update the order (with an audit log) and fix the root cause.
:::

```quiz
Q: Should an app call the Daraja API directly with the consumer secret? (yes or no)
A: no
Q: What is the PIN prompt that appears on the customer's phone called?
A: STK push | STK | an STK push
Q: Who should calculate the amount to charge: the app or the server?
A: the server | server
Q: Safaricom sends the payment result to which URL on your server?
A: the callback URL | callback URL | callback
Q: Making sure a duplicate callback can't record a payment twice is called making it ...?
A: idempotent
Q: Which M-Pesa API sends money from a business to customers?
A: B2C
Q: Which column should be UNIQUE to stop recording the same M-Pesa payment twice? (the receipt...)
A: mpesa_receipt | receipt | receipt number
Q: What should the server do if the same callback arrives twice?
A: ignore it | ignore | nothing | return OK
Q: What is matching statement entries to your payment records called?
A: reconciliation
```
