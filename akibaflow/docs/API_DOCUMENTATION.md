# API
Session-cookie authenticated JSON endpoints (browser use). POST requires header `X-CSRF-Token` (value of `<meta name="csrf">`). Errors: `{"error": "..."}` with 401/403/404/422/503. Names differ from the brief's illustrative list; scoping is by `{gid}` and always re-checked against the caller's membership.

| Method & path | Permission | Returns |
|---|---|---|
| GET `/api/g/{gid}/me/outstanding-balance` | member | balance object (outstanding, overdue, credit, next due…) + payable options |
| GET `/api/g/{gid}/me/contribution-calendar?month=YYYY-MM` | member | per-date obligations with status |
| POST `/api/g/{gid}/payments/initiate` `{option: today\|clear_all\|advance\|custom, custom_amount?, phone, idempotency_key}` | member | `{ref,status,amount_minor,replayed}` (amount always server-computed except `custom`, which is bounded) |
| GET `/api/g/{gid}/payments/{ref}` | owner only | status, result_desc, receipt_url |
| GET `/api/g/{gid}/charts/collections?by=day\|month` | reports.view | verified collections series |
| POST `/callbacks/mpesa/stk/{secret}` | provider | Daraja STK callback → `{"ResultCode":0}` |
| POST `/callbacks/mpesa/c2b/{secret}` | provider | Paybill confirmation |

HTML routes (auth, groups, plans, members, payments, reconciliation, expenses, reports + CSV `?format=csv`, audit, settings, admin) are listed in `public/index.php`. Auth: register/login/logout/forgot/reset/verify are form posts (no JSON auth API). Pagination is server-side (`?page=`) on history/audit; reports cap at 2000 rows. Not implemented: token/API-key access for third parties, OpenAPI file.
