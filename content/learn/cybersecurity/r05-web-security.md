---
slug: web-security
title: "Web application security (OWASP Top 10): how websites get hacked and how developers prevent it"
after: KEEP
---
# Web application security (OWASP Top 10): how websites get hacked and how developers prevent it

Websites and web apps are attacked constantly: automated bots probe every site on the internet for known weaknesses, outdated WordPress plugins, exposed admin panels and leaked passwords. A hacked site can leak customer data (and trigger Data Protection Act obligations), get defaced, start hosting phishing pages, send spam, redirect visitors to scams, or be blacklisted by Google. Most of these attacks exploit a small set of well-known mistakes, documented by **OWASP** (the Open Worldwide Application Security Project) in its **Top 10** list.

This unit explains each major risk with simple examples and the specific fixes developers use, plus how to secure WordPress sites and servers.

:::note What you will learn
- Why websites are targeted, and who attacks them
- The OWASP Top 10 risk categories
- Broken access control and IDOR
- Injection (SQL injection, command injection) and XSS
- Cryptographic failures and HTTPS
- Security misconfiguration and vulnerable components
- Authentication failures
- Insecure design, integrity failures, logging and SSRF
- Security headers and a secure development checklist
- Securing WordPress
- Testing your own site safely
:::

## The OWASP Top 10 (2021 edition) at a glance

| # | Risk | In one sentence |
|---|---|---|
| A01 | **Broken Access Control** | Users can see or do things they shouldn't |
| A02 | **Cryptographic Failures** | Sensitive data not encrypted or poorly protected |
| A03 | **Injection** | Untrusted input runs as code (SQL injection, XSS, command injection) |
| A04 | **Insecure Design** | Security wasn't planned into the features |
| A05 | **Security Misconfiguration** | Default settings, debug mode, open storage, verbose errors |
| A06 | **Vulnerable and Outdated Components** | Old plugins, libraries, frameworks with known holes |
| A07 | **Identification and Authentication Failures** | Weak logins, no brute-force protection, bad session handling |
| A08 | **Software and Data Integrity Failures** | Trusting unverified updates, plugins or data |
| A09 | **Security Logging and Monitoring Failures** | Attacks happen and nobody notices |
| A10 | **Server-Side Request Forgery (SSRF)** | The server is tricked into fetching internal URLs |

OWASP updates the list every few years; the core lessons stay the same.

## A01: Broken access control

**Example (IDOR: insecure direct object reference)**: a logged-in parent views `fees.php?student=1042`, changes it to `1043`, and sees another family's fee statement.

**Fixes**:
- Check **on the server**, for every request, that the user is allowed to access *that* record: `SELECT ... WHERE id = ? AND parent_id = ?`.
- Deny by default; check roles for admin pages (not just hiding the menu link).
- Don't rely on hidden form fields or JavaScript to enforce permissions.

## A02: Cryptographic failures

**Examples**: a site without HTTPS sends passwords in plain text over café Wi-Fi; passwords stored as plain text or MD5; ID numbers stored unencrypted in backups left in a public folder.

**Fixes**:
- **HTTPS everywhere** (free certificates from Let's Encrypt) with HSTS.
- Hash passwords with bcrypt/Argon2 (`password_hash`).
- Encrypt sensitive data at rest where appropriate; don't collect data you don't need.
- Keep secrets (API keys, M-Pesa passkeys) in server config outside the web root, never in code repositories or JavaScript.

## A03: Injection

### SQL injection

```php
// Vulnerable
$sql = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";
```

An attacker submits `' OR '1'='1` or worse, reading or deleting the database.

**Fix**: **prepared statements/parameterised queries** in every language, plus least-privilege database users.

```try-python
import sqlite3
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE users (email TEXT, role TEXT)")
db.executemany("INSERT INTO users VALUES (?, ?)", [("admin@shop.ke", "admin"), ("amina@mail.com", "customer")])

attack = "x' OR '1'='1"
print("Vulnerable:", db.execute("SELECT * FROM users WHERE email = '" + attack + "'").fetchall())
print("Parameterised:", db.execute("SELECT * FROM users WHERE email = ?", (attack,)).fetchall())
```

### Cross-site scripting (XSS)

User input containing `<script>` is shown to other users and runs in their browsers (stealing sessions, defacing, redirecting).

**Fixes**: escape output (`htmlspecialchars` in PHP; frameworks like React and Laravel Blade escape by default), validate input, and add a **Content Security Policy** header.

### Command injection

Passing user input to system commands (`exec("ping " . $_GET['host'])`) lets attackers run their own commands (`8.8.8.8; rm -rf ...`). **Fix**: avoid shell commands with user input; if unavoidable, strict allow-lists and safe APIs (`escapeshellarg`).

## A04: Insecure design

Security problems built into the logic: a password reset that only asks for a phone number; unlimited OTP attempts; marking an order paid because the browser says so; no rate limits on an SMS-sending endpoint (attackers use it to send thousands of SMS at your cost). **Fix**: threat-model features ("how could this be abused?") before building; verify payments server-side (see the M-Pesa lesson); add limits.

## A05: Security misconfiguration

**Examples**: debug mode on in production showing stack traces and passwords; directory listing enabled; default admin accounts; `phpinfo()` pages left online; database backup files (`backup.sql`) in public_html; publicly readable cloud storage buckets; admin panels exposed with no IP restriction.

**Fixes**: production settings (errors logged not displayed), remove test files, disable directory listing, change defaults, restrict admin areas, review cloud permissions, and use a hardening checklist for each deployment.

## A06: Vulnerable and outdated components

Most hacked WordPress sites are compromised through **outdated plugins or themes**. Libraries and frameworks (jQuery, Laravel packages, npm modules) also get vulnerabilities.

**Fixes**: keep everything updated, remove unused plugins/themes, use reputable components only (never "nulled" premium plugins, which often contain backdoors), and monitor advisories (`composer audit`, `npm audit`, GitHub Dependabot).

## A07: Authentication failures

**Examples**: no limit on login attempts; weak password rules (or silly complexity rules but no length); session IDs not regenerated after login; "remember me" storing the password in a cookie; no MFA for admins.

**Fixes**: rate limiting and lockouts, length-based password rules and breach checks, secure session handling (HttpOnly, Secure, SameSite cookies; regenerate on login), MFA for admin and sensitive accounts (see the PHP sessions lesson).

## A08: Software and data integrity failures

Trusting code or data without verification: installing plugins from random sites, auto-updating from an unsigned source, loading JavaScript from an untrusted CDN, or unserialising user-supplied data. **Fixes**: official sources, integrity checks (Subresource Integrity for CDN scripts), signed updates, and never deserialising untrusted input.

## A09: Logging and monitoring failures

Many breaches go unnoticed for months. **Fixes**: log logins (success and failure), admin actions, payment events and errors (without logging passwords or full card numbers); alert on suspicious patterns; review logs; uptime and file-change monitoring.

## A10: Server-side request forgery (SSRF)

A feature that fetches a URL supplied by the user ("import image from URL") can be abused to make the server request internal addresses like `http://127.0.0.1/admin` or cloud metadata services. **Fixes**: allow-list domains, block private/internal IP ranges, and don't return raw responses.

## Security headers

Add these HTTP headers (in your web server config or app):

| Header | Purpose |
|---|---|
| `Strict-Transport-Security` | Forces HTTPS for future visits (HSTS) |
| `Content-Security-Policy` | Restricts where scripts, styles and images can load from (strong XSS defence) |
| `X-Content-Type-Options: nosniff` | Stops browsers guessing file types |
| `X-Frame-Options` / CSP `frame-ancestors` | Stops your site being framed (clickjacking) |
| `Referrer-Policy` | Limits URL information sent to other sites |
| `Permissions-Policy` | Disables browser features you don't use (camera, mic) |

Check your site's headers with free online scanners such as securityheaders.com and Mozilla Observatory.

## Securing WordPress

1. Update core, themes and plugins promptly (enable automatic updates for minor releases and trusted plugins).
2. Delete unused plugins and themes; never use nulled ones.
3. Strong unique admin passwords, **2FA**, and don't use "admin" as a username.
4. Limit login attempts; consider renaming or restricting `/wp-admin` by IP.
5. Use a reputable security plugin and a **web application firewall** (via plugin or a service like Cloudflare).
6. Daily off-site **backups** and a tested restore.
7. Correct file permissions; disable file editing in the dashboard (`define('DISALLOW_FILE_EDIT', true);` in wp-config.php).
8. HTTPS with redirects; keep PHP on a supported version.

## Testing your own site safely

- Only test sites **you own or have written permission to test**: unauthorised testing is a crime under Kenya's Computer Misuse and Cybercrimes Act.
- Use free tools on your own sites: **OWASP ZAP** (automated scanner and proxy), browser developer tools, header scanners, WPScan for WordPress.
- Learn on legal practice platforms: **PortSwigger Web Security Academy** (free labs), OWASP Juice Shop, DVWA, TryHackMe.

## Secure development checklist

| ✓ | Practice |
|---|---|
| | Validate input on the server; escape output for its context |
| | Prepared statements for all database queries |
| | Access checks on every request and every record |
| | Passwords hashed with bcrypt/Argon2; MFA for admins |
| | Secure session cookies; CSRF tokens on state-changing forms |
| | HTTPS + security headers |
| | Secrets outside code and web root; least-privilege accounts |
| | Dependencies updated and audited |
| | Errors logged, not displayed; important events logged and monitored |
| | Backups, tested restores, and an incident plan |

:::think A school portal lets parents download receipts at receipt.php?id=500. A parent notices that changing the number shows other families' receipts, including phone numbers. Which OWASP risk is this, what's the fix, and does the school have legal obligations?
Broken access control (IDOR, OWASP A01). Fix: on the server, only return a receipt if it belongs to the logged-in parent (`WHERE id = ? AND parent_id = ?`), and consider non-guessable IDs as an extra layer. It's also a personal data breach, so under Kenya's Data Protection Act the school should assess it, fix it, and report it to the ODPC (and possibly notify affected parents) as required.
:::

## Summary

- Websites are scanned and attacked automatically; most hacks exploit well-known mistakes in the OWASP Top 10.
- Key fixes: server-side access checks, HTTPS and proper hashing, prepared statements and output escaping, secure configuration, updated components, strong authentication with MFA.
- Design securely (verify payments server-side, rate limits), verify integrity, log and monitor, and block SSRF.
- Add security headers; secure WordPress with updates, 2FA, backups and a WAF.
- Test only with permission, using OWASP ZAP and legal practice labs.

```quiz
Q: What list of the ten most critical web risks is published by OWASP?
A: OWASP Top 10 | top 10 | owasp top ten
Q: Changing an ID in the URL shows another user's data. Which risk is this?
A: broken access control | access control | idor
Q: What stops SQL injection?
A: prepared statements | parameterized queries | prepared statement | parameterised queries
Q: Which header forces browsers to use HTTPS on future visits? (abbreviation)
A: HSTS | Strict-Transport-Security
Q: What is the most common way WordPress sites get hacked?
A: outdated plugins | plugins | outdated plugins or themes | old plugins
Q: Which free OWASP tool scans your own web apps for vulnerabilities?
A: ZAP | OWASP ZAP
```

**Learn more:** [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [PortSwigger Web Security Academy (free labs)](https://portswigger.net/web-security)
