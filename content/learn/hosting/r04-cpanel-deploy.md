---
slug: cpanel-deploy
title: "Uploading a website with cPanel: File Manager, FTP/SFTP, databases, PHP settings, redirects and a launch checklist"
after: KEEP
---
# Uploading a website with cPanel: File Manager, FTP/SFTP, databases, PHP settings, redirects and a launch checklist

**cPanel** is the control panel used by most shared hosting companies in Kenya and worldwide. From one dashboard you upload website files, create databases and email accounts, install SSL, set up redirects, schedule cron jobs and take backups. Whether your site is plain HTML, a PHP app or WordPress, knowing cPanel well means you can launch and maintain client websites confidently. This unit is a hands-on tour from first login to a live, working website.

:::note What you will learn
- Logging in and finding your way around cPanel
- The folder structure: public_html, addon domains and subdomains
- Uploading with File Manager (ZIP upload and extract)
- Uploading with FTP/SFTP clients (FileZilla, WinSCP)
- File permissions
- Creating MySQL databases and users, phpMyAdmin imports
- PHP version and settings
- Domains, subdomains and redirects
- Softaculous one-click installs
- Error pages, logs and troubleshooting
- A launch checklist
:::

## Logging in

Your host sends a welcome email with the cPanel URL (often `https://yourdomain.co.ke/cpanel`, `https://yourdomain.co.ke:2083` or a link in the client area), a username and password. Change the password, enable **two-factor authentication** (Security → Two-Factor Authentication), and never share the login in plain WhatsApp messages.

The dashboard groups tools into sections: **Files**, **Databases**, **Domains**, **Email**, **Metrics**, **Security**, **Software**, **Advanced**. Use the search box at the top to find any tool quickly.

## The folder structure

```
/home/username/
├── public_html/              ← main domain's website (yourdomain.co.ke)
│   ├── index.html or index.php
│   └── ...
├── shop.yourdomain.co.ke/    ← a subdomain's folder (location chosen when created)
├── otherdomain.co.ke/        ← an addon domain's folder
├── mail/                     ← email storage (don't edit)
├── logs/
└── (create) config/          ← private config files, outside public_html
```

- The **home page** must be named `index.html` or `index.php` in lowercase.
- Anything inside `public_html` can be reached by URL; keep secrets outside it.

## Uploading with File Manager

Best for first uploads and small sites:
1. On your computer, put the site's files (not the outer folder) into a **ZIP**.
2. cPanel → **File Manager** → open `public_html`.
3. Delete any placeholder files (e.g. a default `index.html` or `cgi-bin` can stay).
4. Click **Upload**, choose the ZIP, wait for 100%.
5. Back in File Manager, right-click the ZIP → **Extract** into `public_html`.
6. Check the files are directly in `public_html` (not in `public_html/mysite/`), then delete the ZIP.
7. Visit your domain to test.

File Manager can also edit files (right-click → Edit), create folders, change permissions and compress/extract.

## Uploading with FTP/SFTP

For regular updates, use a client like **FileZilla** or **WinSCP**:

| Setting | Value |
|---|---|
| Host | Your domain or server hostname from the host |
| Protocol | **SFTP** (port 22, if SSH is enabled) or FTP with explicit TLS (FTPS, port 21) |
| Username/password | cPanel credentials or an FTP account created in cPanel → FTP Accounts |

Create separate FTP accounts limited to specific folders for designers or contractors, and delete them when the job ends. Avoid plain unencrypted FTP: passwords travel in clear text.

Drag files from the left (your computer) to the right (`public_html`). Only changed files need uploading.

## File permissions

| Item | Permission |
|---|---|
| Folders | **755** |
| Files | **644** |
| Config files with passwords | **600** or **640** |

Never use **777**. In File Manager: right-click → Change Permissions. (See the Linux permissions lesson for what the numbers mean.)

## Databases

For PHP apps and WordPress:
1. **Manage My Databases / MySQL Databases** → create a database (gets a prefix, e.g. `username_shop`).
2. Create a **user** with a strong generated password.
3. **Add the user to the database**; grant needed privileges (ALL for WordPress installs; a narrower set for custom apps where possible).
4. **phpMyAdmin** → select the database → **Import** a `.sql` file exported from your local site (XAMPP's phpMyAdmin → Export).
5. Update your app's config with the database name, user, password and host (`localhost` on most cPanel hosts).

For WordPress moves, also update the site URL (search-replace tools/plugins handle serialized data correctly).

## PHP version and settings

- **MultiPHP Manager** or **Select PHP Version**: choose a supported PHP version per domain.
- **MultiPHP INI Editor** or PHP Options: `upload_max_filesize`, `post_max_size`, `memory_limit`, `max_execution_time`, `display_errors` (Off in production).
- Enable needed extensions (e.g. `pdo_mysql`, `mbstring`, `curl`, `gd`, `intl`, `zip`).

## Domains, subdomains and redirects

- **Domains** (newer cPanel) or **Addon Domains**: host another domain on the same account, each with its own folder.
- **Subdomains**: `shop.yourdomain.co.ke` with its own folder.
- **Redirects**: send old pages or domains to new ones (301 permanent redirects preserve SEO).
- **Force HTTPS**: newer cPanel has a "Force HTTPS Redirect" toggle per domain; otherwise use `.htaccess`:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Choose one canonical version (`www` or non-www) and redirect the other.

## Softaculous one-click installs

**Softaculous** (in Software) installs WordPress, Joomla, Moodle, OpenCart and hundreds of apps in minutes, creating the database automatically. Choose HTTPS, set a non-obvious admin username, strong password, and enable automatic updates/backups options it offers.

## Error pages, logs and metrics

- **Errors** (Metrics → Errors): recent web server errors; essential when you see a blank page or 500 error.
- **error_log** files appear in folders where PHP errors happened: read them.
- **Error Pages**: customise 404 and other pages (or let your app handle them).
- **Visitors/Awstats/Bandwidth**: basic traffic statistics.
- **Resource Usage** (on CloudLinux hosts): shows whether you're hitting CPU/memory limits.

## Common problems

| Symptom | Likely cause | Fix |
|---|---|---|
| Default host page shows instead of your site | Files in the wrong folder or old index file | Move files into `public_html`; remove placeholder `index.html` |
| "Index of /" file list | No index file | Name the home page `index.html`/`index.php`; add `Options -Indexes` |
| 403 Forbidden | Wrong permissions or ownership | Folders 755, files 644 |
| 500 Internal Server Error | `.htaccess` mistake, PHP error, wrong PHP version | Check Errors/error_log; rename .htaccess to test; switch PHP version |
| Database connection error | Wrong DB name/user/password (remember prefixes) | Correct the config |
| CSS/images missing | Wrong paths or letter case (`Logo.png` ≠ `logo.png` on Linux) | Fix paths and case |
| Changes not showing | Browser or server cache, CDN | Hard refresh; purge cache |

## Launch checklist

| ✓ | Item |
|---|---|
| | Files in the right folder; home page loads; no placeholder page |
| | HTTPS active (AutoSSL), HTTP→HTTPS and www/non-www redirects working |
| | Forms send email (test inbox and spam) |
| | Database connected; no visible PHP errors |
| | Permissions 644/755; secrets outside public_html |
| | Correct PHP version; display_errors Off |
| | Backups configured; a test backup downloaded |
| | cPanel and admin accounts use strong passwords and 2FA |
| | Google Search Console verified and sitemap submitted |
| | Client has their own logins and a short handover guide |

:::think After extracting a ZIP, your site shows only at yourdomain.co.ke/mysite/ instead of yourdomain.co.ke. Why, and how do you fix it?
The ZIP contained an outer folder, so files ended up in public_html/mysite/. Move the contents of `mysite` up into `public_html` (File Manager → select all → Move), then delete the empty folder. Next time, zip the files themselves, not the folder.
:::

## Summary

- cPanel manages files, databases, domains, email, SSL, PHP settings, cron and backups; secure it with a strong password and 2FA.
- Websites live in public_html (index.html/index.php); keep secrets outside it.
- Upload via File Manager (ZIP + extract) or SFTP/FTPS clients; set permissions 755/644, never 777.
- Create databases and users (with prefixes), import via phpMyAdmin, update configs; choose PHP versions and settings.
- Use redirects, Softaculous, error logs and a launch checklist to go live confidently.

```quiz
Q: Which folder holds the main domain's website files in cPanel?
A: public_html
Q: What must the home page file be named? (one of two)
A: index.html | index.php
Q: Which permission number should folders usually have?
A: 755
Q: Which cPanel tool imports a .sql database file?
A: phpMyAdmin | phpmyadmin
Q: Which encrypted protocol should you use instead of plain FTP?
A: SFTP | sftp | ftps
Q: Which cPanel tool installs WordPress in one click?
A: Softaculous
```
