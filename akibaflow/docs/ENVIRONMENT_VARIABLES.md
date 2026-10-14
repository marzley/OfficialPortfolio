# Environment variables (see `.env.example`; placeholders only)
| Var | Purpose |
|---|---|
| APP_ENV | `production` disables sandbox simulator & `migrate --fresh`/seed, enables HSTS + Secure cookies |
| APP_URL | public base URL (links in emails, M-PESA callback URL) |
| DB_HOST/PORT/NAME/USER/PASS | database |
| DEFAULT_TIMEZONE/CURRENCY | reserved defaults (groups choose their own at creation; UI default Africa/Nairobi, KES) |
| PAYMENT_DRIVER | `sandbox` (dev) or `mpesa` |
| MPESA_ENV, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_TXN_TYPE | Daraja credentials |
| MPESA_CALLBACK_SECRET | ≥12 random chars, path secret for callbacks |
| MPESA_CALLBACK_IP_ALLOWLIST | optional comma-separated source IPs |
| MPESA_VERIFY_WITH_QUERY | keep `true` |
| MPESA_C2B_AUTOPOST | `true` to auto-post Paybill confirmations (default false) |
| MAIL_DRIVER / MAIL_FROM | `log` (not sent) or `mail` |
| SMS_DRIVER, AT_USERNAME, AT_API_KEY, AT_SENDER_ID | Africa's Talking SMS |
(`APP_KEY` appears in the example file but is not used by the current code.)
