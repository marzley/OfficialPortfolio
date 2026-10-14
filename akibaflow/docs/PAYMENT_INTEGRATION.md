# Payments
**Drivers:** `PAYMENT_DRIVER=sandbox` (development only; refuses to load when `APP_ENV=production`) or `mpesa` (Daraja STK Push).

## Flow
1. Member picks an option → server computes the amount → `payment_requests` row (idempotency key; one live prompt per member) → driver `initiate`.
2. Timeout/ambiguity ⇒ status **unknown** (never "failed") and is queried later; a definite provider rejection ⇒ failed.
3. Callback (`POST /callbacks/mpesa/stk/{MPESA_CALLBACK_SECRET}`): secret path + optional IP allowlist → payload validated → stored in `payment_provider_events` (duplicates counted, not re-processed) → matched to the request by CheckoutRequestID.
4. Success is credited **only if** ResultCode=0, a receipt number is present, the amount equals the requested amount, **and** an independent STK Query confirms success (`MPESA_VERIFY_WITH_QUERY=true`, default). Otherwise the request becomes *unknown* with a reason (UNVERIFIED / AMOUNT_MISMATCH / NO_RECEIPT) and appears on the treasurer's reconciliation page. Nothing is credited.
5. Crediting is one DB transaction: lock request → insert transaction (unique on provider receipt) → allocate → ledger → mark succeeded. Concurrent/duplicate callbacks produce exactly one transaction (tested with forked processes).
6. STK Query returns no receipt number, so a "success per query but no callback" is parked for reconciliation rather than credited (crediting would double-pay when the callback later arrives). The treasurer records the statement's receipt code; the unique key blocks a later duplicate.
7. **Paybill (C2B):** `POST /callbacks/mpesa/c2b/{secret}` matches `BillRefNumber` to a member code and parks the payment for treasurer approval (no verification API exists). `MPESA_C2B_AUTOPOST=true` auto-posts — only enable with IP allowlisting.

## Going live — what YOU must obtain
- Safaricom Daraja developer account → consumer key/secret, shortcode (Paybill/Till), **Lipa na M-PESA passkey**; production go-live approval from Safaricom.
- Public HTTPS `APP_URL` reachable by Safaricom; register the C2B URLs if using Paybill.
- Set `MPESA_*` in the server environment, run **Admin → Integrations → Test connection**, then test in the Daraja sandbox before switching `MPESA_ENV=production`.
- **Not verified here:** the Daraja client has been tested only with a mocked transport (request bodies, passwords, timeout→unknown, pending/failed parsing). It has **not** been run against Safaricom's sandbox (no credentials/network in the build environment).
- **Limitation:** one platform-wide shortcode collects for all groups (money separation is by ledger only). Per-group merchant accounts are not implemented, and holding customer funds for groups may carry regulatory implications (CBK/payment-service-provider rules) — get advice before production.
- SMS: Africa's Talking client is implemented but untested live. Email: `MAIL_DRIVER=log` writes `storage/mail/outbox.log` and **does not transmit**; `mail` uses the server MTA (configure SPF/DKIM or use SMTP relay).
