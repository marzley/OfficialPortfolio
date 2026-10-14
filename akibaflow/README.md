# AkibaFlow — *Akiba Yako, Maendeleo Yako.*

Group savings & contributions platform (PHP 8.3, mysqli/MariaDB-MySQL, vanilla HTML/CSS/JS). Lives in `/akibaflow`; the portfolio site at the repo root is untouched.

**Status:** working application + tested core — **not production-ready** (see `docs/IMPLEMENTATION_STATUS.md`).

## Quick start (development)
```bash
cd akibaflow
cp .env.example .env            # fill DB_* ; APP_ENV=development enables the sandbox payment simulator
php bin/migrate.php             # create schema   (--fresh drops everything; refused in production)
php bin/seed.php                # clearly-labelled TEST data (password Passw0rd-Demo1)
php -S 127.0.0.1:8080 -t public public/router.php
php bin/worker.php              # run once, or every minute from cron
php tests/run.php               # full test suite (uses DB `akibaflow_test`, see docs/TESTING.md)
```
Demo logins: `chair@`, `treasurer@`, `amina@`, `brian@`, `cecilia@`, `daniel@akibaflow.test`, `admin@akibaflow.test` (platform admin).

## Layout
`public/` web root · `src/Core` infrastructure · `src/Services` business logic (schedule, contribution, allocation, ledger, payments, notifications, reports) · `src/Payments` drivers · `src/Http` controllers · `views/` · `migrations/` · `bin/` CLI (migrate, seed, worker, backup) · `tests/` · `docs/`

Docs: ARCHITECTURE · DATABASE_SCHEMA · API_DOCUMENTATION · CONTRIBUTION_RULES · PAYMENT_INTEGRATION · SECURITY · DEPLOYMENT · BACKUP_AND_RECOVERY · TESTING · IMPLEMENTATION_STATUS · ENVIRONMENT_VARIABLES (all under `docs/`).
