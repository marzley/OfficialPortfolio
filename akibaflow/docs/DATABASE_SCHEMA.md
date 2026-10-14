# Database schema (`migrations/001_schema.sql`)
Applied by `php bin/migrate.php` (tracked in `schema_migrations`; statements separated by `;;` so trigger bodies stay intact).

| Area | Tables |
|---|---|
| Identity | users, user_tokens (verify/reset, hashed), user_sessions (revocable), auth_events (throttling), notification_preferences |
| Groups | groups, group_settings, group_memberships (role+status, unique member_code), group_invitations |
| Contributions | contribution_plans, contribution_plan_versions (effective-dated terms), contribution_plan_members (eligibility intervals = joins/exits/pauses), contribution_obligations (contribution & penalty rows), contribution_waivers, contribution_reminders |
| Payments | payment_requests (idempotency key), payment_attempts, payment_provider_events (raw callbacks, de-duplicated), payment_transactions, payment_allocations, payment_reversals, member_credit_entries, payment_reconciliation_runs |
| Accounting | financial_accounts, ledger_journals, ledger_entries |
| Operations | group_expenses, expense_approvals, savings_goals(+allocations), announcements |
| Notifications | notifications (inbox), notification_jobs (queue), notification_deliveries |
| Platform | audit_logs, platform_settings, scheduled_job_logs, integration_logs, backup_runs, sandbox_stk (dev simulator) |

**Key constraints:** `uq_obligation(plan,member,kind,period_key)`; `uq_txn_ref(group,provider,provider_ref)` (a provider receipt can be posted once); `uq_pr_idem(user,idempotency_key)`; `uq_event(provider,type,key)`; `uq_reminder(obligation,type)`; `uq_job_dedupe(dedupe_key,channel)`; `uq_exa(expense,approver)`; CHECKs on `paid+waived<=original`, positive amounts, one-sided ledger lines.
**Immutability triggers:** no UPDATE/DELETE on ledger_entries, ledger_journals, audit_logs; no DELETE on payment_transactions.
Financial history is never soft-deleted or removed. Group "closure" keeps all rows.

Chart of accounts per group: 1000 Group Funds, 2000 Member Credits (liability), 3000 Member Contributions, 4000 Penalty Income, 5000 Group Expenses.
