---
slug: deploy-php-hosting
title: "Deploying a PHP and MySQL site to cPanel hosting: upload, database, config, HTTPS, emails, backups and going live"
after: project-booking-system
---
# Deploying a PHP and MySQL site to cPanel hosting: upload, database, config, HTTPS, emails, backups and going live

Your PHP site works on your laptop. Now the client wants it live at `www.theirbusiness.co.ke`. Most Kenyan small-business sites run on **shared hosting with cPanel**, so knowing how to deploy there (safely and repeatably) is a core freelance skill. This unit walks through a complete deployment: preparing your files, creating the database, keeping secrets outside the public folder, setting PHP options, HTTPS, email, cron jobs, backups and a go-live checklist.

:::note What you will learn
- Choosing hosting and pointing the domain
- The cPanel folder layout and why some files must stay outside public_html
- Preparing your project for production
- Uploading with File Manager, FTP/SFTP or Git
- Creating the MySQL database and importing data
- Config files, environment settings and PHP version
- HTTPS with free SSL and forcing redirects
- Email accounts and SMTP
- Cron jobs, logs, backups and security hardening
- A go-live checklist and handing over to the client
:::

## Step 1: Hosting and domain

1. Choose a reputable host (local Kenyan hosts are often convenient for `.co.ke` domains and M-Pesa billing; international hosts are fine too). Check: current PHP versions, MySQL, free SSL, daily backups, SSH access, support quality.
2. Register or transfer the domain (for `.co.ke`, through a KENIC-accredited registrar).
3. Point the domain's **name servers** to the host (or set A records to the server's IP). DNS changes can take minutes to hours.

## Step 2: Understand the folder layout

```
/home/clientacct/
├── public_html/        ← the website's public root: anything here can be requested by URL
├── config/             ← create this: secrets and settings (NOT web-accessible)
├── logs/               ← error logs
├── backups/
└── mail/, tmp/, etc.
```

**Only files visitors should load go in public_html**: `index.php`, CSS, JS, images, and PHP pages. Keep database credentials, M-Pesa keys, SMTP passwords, Composer's `vendor/` (optionally), and private uploads **outside** it. If PHP ever fails and serves source code as text, secrets outside public_html stay safe.

## Step 3: Prepare the project for production

- Move secrets into a config file that lives outside public_html; reference it with a path like `require __DIR__ . '/../config/app.php';`.
- Turn off error display in production; log instead:

```php
<?php
// at the start of your bootstrap file in production
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../logs/php-errors.log');
error_reporting(E_ALL);
```

- Remove test files, `phpinfo()` pages, database dumps and `.git` folders from what you upload.
- Run `composer install --no-dev --optimize-autoloader` for production dependencies.
- Make sure all links and paths are relative or use the real domain.

## Step 4: Upload the files

| Method | When |
|---|---|
| **cPanel File Manager** | Small sites: upload a ZIP, then Extract |
| **FTP/SFTP** (FileZilla, WinSCP) | Regular updates; use SFTP or FTPS, not plain FTP |
| **Git Version Control** (in many cPanels) or SSH + `git pull` | Professional, repeatable deploys |
| **rsync over SSH** | Fast syncs of only changed files |

After uploading, set permissions: folders **755**, files **644**, config files **600** or **640** (see the Linux permissions lesson).

## Step 5: Create the database

1. cPanel → **MySQL Databases** (or "Manage My Databases").
2. Create a database (it gets a prefix, e.g. `clientacct_shop`).
3. Create a user with a strong generated password.
4. Add the user to the database with only the needed privileges (SELECT, INSERT, UPDATE, DELETE; add CREATE/ALTER only if your app runs migrations).
5. Open **phpMyAdmin** → select the database → **Import** your `.sql` file (exported from your local phpMyAdmin or with `mysqldump`).

Update your config file:

```php
<?php
// /home/clientacct/config/app.php
return [
    'db_dsn'  => 'mysql:host=localhost;dbname=clientacct_shop;charset=utf8mb4',
    'db_user' => 'clientacct_shopapp',
    'db_pass' => '(the generated password)',
    'base_url' => 'https://www.clientbusiness.co.ke',
];
```

## Step 6: PHP version and settings

- cPanel → **MultiPHP Manager** (or "Select PHP Version"): choose a currently supported PHP version that your code works with.
- **MultiPHP INI Editor**: set `upload_max_filesize`, `post_max_size`, `memory_limit`, `max_execution_time` as your app needs; keep `display_errors` Off.
- Enable required extensions (pdo_mysql, mbstring, curl, gd/intl if used).

## Step 7: HTTPS

1. cPanel → **SSL/TLS Status** → run **AutoSSL** (free Let's Encrypt or Sectigo certificates on most hosts).
2. Force HTTPS with `.htaccess` in public_html (Apache/LiteSpeed hosts):

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

3. Choose one main address (with or without `www`) and redirect the other, for SEO and consistent cookies.
4. Update any hard-coded `http://` links; M-Pesa callbacks must use the HTTPS URL.

## Step 8: Protect sensitive files

In `.htaccess`:

```
# Block access to hidden files like .env and .git
RewriteRule (^|/)\. - [F]
# Stop directory listings
Options -Indexes
```

Also: an `uploads` folder shouldn't run PHP. Add an `.htaccess` inside it:

```
<FilesMatch "\.(php|phtml|phar)$">
  Require all denied
</FilesMatch>
```

## Step 9: Email

- Create addresses in cPanel → **Email Accounts** (e.g. `info@`, `noreply@`), or use Google Workspace/Microsoft 365 by setting their MX records.
- Send website emails through **SMTP** (PHPMailer) with an account's credentials stored in the config file.
- Check that **SPF**, **DKIM** and **DMARC** are set (cPanel → Email Deliverability) so messages don't go to spam.

## Step 10: Cron jobs

cPanel → **Cron Jobs** runs scripts on a schedule: sending reminders, checking pending M-Pesa payments, cleaning old sessions, nightly reports.

```
*/10 * * * *  /usr/local/bin/php /home/clientacct/app/cron/check-payments.php >/dev/null 2>&1
0 2 * * *     /usr/local/bin/php /home/clientacct/app/cron/nightly-report.php
```

Keep cron scripts outside public_html so nobody can trigger them by URL. Your host's PHP path may differ; their documentation or support will confirm it.

## Step 11: Backups and monitoring

- Use the host's backups, but also keep your own: cPanel **Backup** (download full or database backups), or a scheduled script that exports the database and copies it off the server.
- Keep the code in Git so you can redeploy anywhere.
- Set up free **uptime monitoring** to alert you if the site goes down.
- Watch `logs/php-errors.log` after launch.

## Go-live checklist

| ✓ | Check |
|---|---|
| | Domain resolves; HTTPS works with a padlock; http and non-www redirect correctly |
| | All pages, forms and links work; no PHP warnings or notices visible |
| | Database connection uses a least-privilege user; secrets outside public_html |
| | display_errors Off; errors logged |
| | Contact forms deliver email (test inbox and spam folder) |
| | M-Pesa (if any) switched to production credentials and tested with a small real payment |
| | Admin passwords strong; default/test accounts removed |
| | File permissions 644/755, config 600/640; uploads can't run PHP |
| | Backups configured and a restore tested |
| | Google Search Console set up, sitemap submitted, analytics added (with privacy notice) |
| | Mobile and speed checked (PageSpeed Insights) |

## Handing over to the client

Give the client (in a secure way, not in plain WhatsApp messages):
- Hosting, domain registrar and cPanel logins (in their name and email: the client should own their accounts).
- Admin panel login and a short user guide or video.
- What's included in support/maintenance (updates, backups, fixes) and your rates for changes.
- Renewal dates for domain and hosting.

:::think After uploading a site, the home page shows "SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'". What happened, and what else is wrong with this situation?
The site is still using the local XAMPP credentials (root with no password) instead of the hosting database user, so update the config with the cPanel database name, user and password. Also, the raw database error is displayed to visitors, which means display_errors is on in production: turn it off and log errors instead.
:::

## Summary

- Point the domain to the host; keep only public files in public_html and secrets in a config folder outside it.
- Prepare for production: secrets in config, display_errors off, logs on, no test files, composer install --no-dev.
- Upload via File Manager, SFTP, Git or rsync; set permissions; create the database and least-privilege user; import data.
- Choose the PHP version, enable HTTPS with AutoSSL and redirects, protect hidden files and uploads.
- Configure SMTP email with SPF/DKIM/DMARC, cron jobs outside public_html, backups and monitoring; follow a go-live checklist and hand over accounts to the client.

```quiz
Q: Which cPanel folder is the website's public root?
A: public_html
Q: Should database passwords be stored inside public_html? (yes/no)
A: no
Q: Which cPanel feature issues free SSL certificates automatically?
A: AutoSSL
Q: What permission number should normal files usually have?
A: 644
Q: Which three email DNS records help messages avoid spam? (list them)
A: SPF, DKIM, DMARC | spf dkim dmarc | SPF DKIM DMARC
Q: Should display_errors be on or off on a live site?
A: off
```
