# Architecture
Chosen stack (per your brief): PHP 8.3 + mysqli, server-rendered views, vanilla JS. No framework; ~40 small classes under `Akiba\` (PSR-4-style autoloader in `src/bootstrap.php`). MariaDB/MySQL InnoDB.

**Multi-tenancy:** every group-owned row carries `group_id`. Every `/g/{gid}/…` route calls `Access::require($gid, $perm)`, which loads the *caller's own active membership* in that group; non-members get 404 (existence hidden), members lacking the permission get 403. Ids in URLs/forms (membership, obligation, payment…) are always re-scoped with `AND group_id=?` (`Access::memberInGroup`). Platform admins have **no** implicit access to group finances (admin pages show counts/health only).

**Layers:** Controllers (thin) → Services (all money logic) → `Db` wrapper (prepared statements only, nested transactions, deadlock retry). Money is `BIGINT` minor units (cents); there is no float arithmetic on money (`Money::parse` is string based).

**Core engines**
- `ScheduleEngine` — pure date maths (daily, weekly, biweekly, monthly incl. month-end clamping, every-N-days, one-time).
- `ContributionEngine` — generates one obligation per member per due date (`UNIQUE(plan,member,kind,period_key)` + `INSERT … ON DUPLICATE KEY`), so reruns/retries/parallel workers never duplicate. Balances are `SUM` over obligation rows.
- `AllocationService` — oldest-due-first allocation under a row lock on the member; credits, reversals, waivers.
- `Ledger` — double-entry journals; DB triggers make journals/entries/audit log immutable; corrections are reversing journals.
- `PaymentService` — requests, idempotency, callbacks, verification, reconciliation, C2B parking, reversals (dual control).
- `Notifications`/`ReminderService`/`PenaltyService` — queue with dedupe keys, retries with backoff, per-attempt delivery log.
- `bin/worker.php` — cron job (every minute): generate obligations → penalties → reminders → poll open payments → deliver notifications. Guarded by `GET_LOCK`; every step idempotent. Nothing depends on a browser being open.

**Time:** DB datetimes are UTC; due dates are group-local calendar dates (default Africa/Nairobi). "Today" always comes from `Clock::today($group->timezone)`; `Clock` can be frozen in tests.
