---
slug: ssl-email-backups
title: "SSL certificates, business email and backups: HTTPS step by step, professional email setup and a backup strategy"
after: KEEP
---
# SSL certificates, business email and backups: HTTPS step by step, professional email setup and a backup strategy

Three things separate an amateur website from a professional one: **HTTPS** (the padlock), **business email** on your own domain (`info@yourbusiness.co.ke` instead of `yourbusiness2026@gmail.com`), and **backups** that actually work when disaster strikes. Clients expect all three, browsers warn visitors away from sites without HTTPS, and lost websites without backups are painful and expensive to rebuild. This unit walks through each in practical detail.

:::note What you will learn
- What SSL/TLS certificates do and why HTTPS matters for trust, security and SEO
- Free certificates (Let's Encrypt/AutoSSL) vs paid certificates
- Installing and forcing HTTPS, fixing mixed content, renewals
- Business email options: host email, Google Workspace, Microsoft 365, Zoho
- Creating accounts, using webmail and setting up phones/Outlook (IMAP/SMTP)
- Email deliverability: SPF, DKIM, DMARC, and sending from websites
- Backup strategy: what, how often, where; 3-2-1
- cPanel backups, WordPress backup plugins, automated off-site backups
- Testing restores and disaster recovery
:::

---

## Part 1: SSL/TLS and HTTPS

### What a certificate does

An **SSL/TLS certificate** lets browsers and servers create an **encrypted** connection (HTTPS) and proves the site really belongs to that domain. Without it:
- Passwords, form data and payment details travel readable by anyone on the network (e.g. public Wi-Fi).
- Browsers show **"Not secure"** warnings, scaring customers away.
- Modern features (geolocation, service workers, many payment integrations, M-Pesa callbacks) require HTTPS.
- Google uses HTTPS as a ranking signal.

(The cybersecurity lesson on encryption and HTTPS explains the cryptography.)

### Types of certificates

| Type | Verifies | Use |
|---|---|---|
| **DV** (Domain Validated) | You control the domain | Almost all websites; free from Let's Encrypt |
| **OV** (Organisation Validated) | The organisation exists | Some corporate sites |
| **EV** (Extended Validation) | Stricter organisation checks | Banks, large enterprises (browsers no longer show special green bars) |
| **Wildcard** | `*.yourdomain.co.ke` (all subdomains) | Many subdomains |

For nearly every small business site, a **free DV certificate** is all you need; encryption strength is the same.

### Installing HTTPS on cPanel

1. Make sure the domain's DNS points to the hosting server.
2. cPanel → **SSL/TLS Status** → select domains → **Run AutoSSL**. Certificates (Let's Encrypt or Sectigo) are issued in minutes and **renew automatically**.
3. Turn on **Force HTTPS Redirect** (Domains page) or add the `.htaccess` redirect.
4. In WordPress: Settings → General → set both URLs to `https://`.
5. Visit the site and check the padlock.

On a VPS, use **Certbot** (`sudo certbot --nginx -d yourdomain.co.ke -d www.yourdomain.co.ke`), covered in the Linux web server project.

### Mixed content

If an HTTPS page loads images, scripts or CSS over `http://`, browsers block them or show warnings. Fix by updating links to `https://` (or relative URLs), using search-and-replace in the database for WordPress, and checking the browser console (F12) for "Mixed Content" messages.

### HSTS and checks

After HTTPS works everywhere, add the **HSTS** header to make browsers always use HTTPS. Test configuration with **SSL Labs** (aim for an A grade). Monitor certificate expiry (AutoSSL/Certbot renewals usually just work, but failed DNS or blocked validation can stop renewals).

---

## Part 2: Business email

### Options

| Option | Pros | Cons | Best for |
|---|---|---|---|
| **Hosting (cPanel) email** | Included with hosting; cheap | Basic webmail; storage limits; deliverability depends on host | Small businesses on a budget |
| **Google Workspace** | Gmail interface, excellent spam filtering, Drive, Meet, Calendar | Monthly per-user cost | Teams who like Google tools |
| **Microsoft 365** | Outlook, Teams, Office apps, OneDrive | Monthly per-user cost | Teams using Word/Excel/Outlook |
| **Zoho Mail** and others | Free/low-cost tiers | Fewer integrations | Very small budgets |

### Setting up cPanel email

1. cPanel → **Email Accounts** → Create: `info@yourbusiness.co.ke`, a strong password, storage quota.
2. Read mail in **Webmail** (Roundcube) or connect apps.
3. Common addresses: `info@`, `sales@`, `support@`, `accounts@`, and personal ones (`wanjiku@`). Use **forwarders** to send copies to someone, and **autoresponders** for out-of-office messages.

### Connecting phones and Outlook (IMAP/SMTP)

Use the settings shown in cPanel → Email Accounts → **Connect Devices**. Typical values:

| Setting | Incoming (IMAP) | Outgoing (SMTP) |
|---|---|---|
| Server | `mail.yourbusiness.co.ke` (or the host's server name) | Same |
| Port | 993 (SSL/TLS) | 465 (SSL/TLS) or 587 (STARTTLS) |
| Username | Full email address | Full email address |
| Authentication | Password | Password (SMTP authentication required) |

Use **IMAP** (not POP3) so mail syncs across phone, laptop and webmail.

### Deliverability: landing in the inbox

- **SPF**, **DKIM** and **DMARC** records (cPanel → **Email Deliverability** checks and fixes them; Google/Microsoft give you their own values).
- Send website form emails via **authenticated SMTP** (PHPMailer or a WordPress SMTP plugin), from an address on your domain, with the visitor's email as **Reply-To**, not as From.
- Avoid mass marketing from your normal mailbox; use an email marketing service for newsletters.
- Keep mailbox passwords strong; compromised accounts sending spam get the whole domain/server blacklisted.

---

## Part 3: Backups

### What to back up

| Item | Why |
|---|---|
| Website files | Code, themes, plugins, uploads (images, documents) |
| Databases | Products, orders, users, posts: usually the most valuable part |
| Email | Important correspondence (often needs a separate solution) |
| Configuration | `.htaccess`, config files (stored securely, as they contain secrets) |
| DNS records | A copy of your zone so you can rebuild quickly |

### How often

Match backup frequency to how much data you can afford to lose:
- Brochure site that rarely changes: weekly + before every change.
- Blog or business site: daily.
- Online shop or booking system: daily at least, ideally more often for the database.

### The 3-2-1 rule

**3** copies, on **2** different types of storage, **1** off-site. The host's own backups are one copy, but don't rely only on them: if the account is suspended, the host has an outage, or the backups were stored on the same server, you can lose everything.

### Backup methods

| Method | How |
|---|---|
| **Host's automatic backups** | Check how many days they keep and how to restore (JetBackup in many cPanels) |
| **cPanel Backup** | Download a full account backup or separate home directory/database backups |
| **WordPress plugins** | UpdraftPlus and similar: scheduled backups to Google Drive, Dropbox, S3 |
| **Scripts + cron** | Dump the database and archive files, then copy off-server (VPS/advanced) |
| **Git** | Code in a repository (not a backup of uploads/databases on its own) |

### Testing restores

A backup is only useful if you can restore it. Every month or quarter:
1. Restore to a **staging** subdomain or local XAMPP.
2. Check pages, logins, images and recent orders.
3. Note how long it took (your realistic recovery time).

### Disaster recovery plan (one page)

- Where backups are and who has access.
- Steps to restore the site and database.
- How to point DNS to a new host if the current one fails.
- Contacts: host support, developer, registrar.

```try-python
# How much data could you lose? Recovery Point Objective (RPO) by backup schedule
schedules = {"weekly": 7 * 24, "daily": 24, "every 6 hours": 6, "hourly": 1}
orders_per_hour = 4
for name, hours in schedules.items():
    print(f"{name:14} backups -> up to {hours} hours of data lost (~{hours * orders_per_hour} orders)")
```

:::think A client's WooCommerce shop was hacked and the host's backups only go back 3 days, all infected. What should have been in place, and what can you do now?
Daily off-site backups kept for 30+ days (3-2-1), with restore tests, plus updates and security hardening. Now: take the site offline or into maintenance mode, export orders/customers from the database, clean or rebuild from a known-clean copy (fresh WordPress, reinstall plugins from official sources, restore uploads after scanning), change all passwords and keys, update everything, and set up proper backups and monitoring going forward.
:::

## Summary

- HTTPS encrypts traffic and builds trust; free DV certificates via AutoSSL/Let's Encrypt suit almost all sites; force HTTPS, fix mixed content, add HSTS.
- Business email comes from your host, Google Workspace, Microsoft 365 or Zoho; use IMAP/SMTP with SSL ports 993/465/587.
- Deliverability needs SPF, DKIM, DMARC and authenticated SMTP from websites.
- Back up files, databases, email and configs on a schedule that matches data value; follow 3-2-1.
- Test restores regularly and keep a one-page disaster recovery plan.

```quiz
Q: Which free certificate authority provides most DV certificates?
A: Let's Encrypt | letsencrypt
Q: What is it called when an HTTPS page loads some files over http? (two words)
A: mixed content
Q: Which email protocol syncs mail across devices: IMAP or POP3?
A: IMAP
Q: Which port is used for IMAP over SSL/TLS?
A: 993
Q: In the 3-2-1 rule, how many copies should be off-site?
A: 1 | one
Q: What is the only way to know a backup works?
A: test a restore | restore it | testing restores | test restore
```
