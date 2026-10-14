# Implementation status (honest)
Legend: ✅ implemented & tested · 🟡 implemented, partially tested/limited · ❌ not implemented

## Delivered
| Area | Status |
|---|---|
| Auth: register, login/logout, verify email, reset, change password, sessions list/revoke, throttling | ✅ (email delivery depends on MAIL_DRIVER) |
| Multi-group, group switcher, roles & permission matrix, isolation | ✅ |
| Group create/settings, invites, approve/reject/suspend/remove, roles | ✅ (archive/close group UI ❌; admin can suspend) |
| Contribution plans: daily/weekly/biweekly/monthly/every-N/one-time/special, grace, effective-dated versions, optional plans, member selection, pauses | ✅ (pause UI ❌ — service tested; custom holiday rules ❌) |
| Obligation generation, arrears, status, calendar, history, statements | ✅ |
| Allocation (oldest-first), partial, advance/credit policies, reversals, waivers, optional fixed late fees | ✅ |
| Ledger (double-entry, immutable), reconciliation integrity checks | ✅ |
| M-PESA STK flow, callbacks, verification, idempotency, reconciliation desk, C2B parking | ✅ with sandbox simulator · 🟡 Daraja client untested live |
| Notifications: in-app, email queue, SMS client, reminders (due/overdue/upcoming/digest), preferences, retry/backoff, admin failed-job retry | ✅ in-app/queue · 🟡 email via mail() / SMS untested live · ❌ WhatsApp, push |
| Member & group dashboards (real data), SVG chart, filters/search/sort/pagination, CSV exports, print-to-PDF | ✅ |
| Expenses (propose/approve/dual approval/pay/reverse), savings goals, announcements, audit trail | ✅ (supporting documents upload ❌) |
| Platform admin: overview/health, users, groups, integrations (masked), jobs, backups | ✅ |
| Backup + verify + restore drill (dev) | ✅ scripts · ❌ off-site shipping |
| Docs (12 files) | ✅ |

## Not built (out of scope for this delivery)
Loans module, investments module, subscriptions/invoicing, WhatsApp/push, MFA & Google sign-in, native .xlsx / server PDF, logo & document uploads, per-group merchant accounts, background report queue (reports run inline, capped), group archive/close workflow & custom group-visibility settings, holiday calendars, multi-currency conversion, API tokens, i18n (UI English only).

## Known limitations / risks
- After a payment reversal other payments are not re-allocated.
- Obligation generation uses a per-member high-water mark; backdated enrolment needs `generate(..., full:true)` (the worker does not do this).
- Suspended members stop accruing new obligations; existing dues remain.
- `payment_transactions.status` and `payment_requests` are updated in place (amounts never are); only ledger/audit are trigger-immutable.
- Sandbox simulator is a stand-in; real M-PESA behaviour (timeouts, delayed callbacks, reversals via Safaricom) needs live sandbox testing.
- Lending/penalties/holding member funds need Kenyan legal & regulatory review before use.
- Accessibility was designed-in (labels, focus, contrast, aria-live, 44px targets) but not audited with tooling.
## Production-readiness verdict
**Not ready.** Remaining: live Daraja sandbox + go-live, real email/SMS provider, HTTPS deployment, pen-test, load test, restore drill on prod infra, DPA compliance, legal review, and the missing modules above if required.
