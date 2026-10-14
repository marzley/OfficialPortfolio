# Deployment
Requirements: PHP ≥ 8.1 with mysqli, curl, mbstring, intl-free; MySQL 8 / MariaDB 10.5+; web server with docroot = `akibaflow/public` (Apache `.htaccess` included; for nginx use `try_files $uri /index.php`); HTTPS.
1. Upload code; `cp .env.example .env` and fill (see ENVIRONMENT_VARIABLES.md). `chmod 600 .env`; keep `.env`, `storage/` outside the web root or denied.
2. Create DB + user; `php bin/migrate.php`. (Do **not** run `bin/seed.php` in production — it refuses.)
3. Create the first admin: register in the UI, then `UPDATE users SET is_super_admin=1 WHERE email='you@…';`.
4. Cron: `* * * * * php /path/akibaflow/bin/worker.php` and daily `php bin/backup.php && php bin/backup.php --verify`; copy `storage/backups/*` off-server.
5. Set `APP_ENV=production`, `APP_URL=https://…`, M-PESA vars, `MAIL_DRIVER=mail` (or relay), then Admin → Integrations → Test.
6. Check Admin → Overview health (worker last run, backups, ledger).
Upgrades: add `migrations/00N_*.sql`, run `migrate.php` (it never drops anything without `--fresh`, which is blocked in production).
