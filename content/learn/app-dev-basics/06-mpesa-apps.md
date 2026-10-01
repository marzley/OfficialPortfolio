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
```
