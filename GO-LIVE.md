# Go-live checklist

The code for everything below is built in. These are the steps only you can do, because they
happen in cPanel, Safaricom, Google or DNS. Do them in this order. Tick each box as you go.

---

## 1. M-Pesa: new keys and a real test (must do)

- [ ] **Rotate the Daraja keys.** Old keys are in this repository's git history.
      https://developer.safaricom.co.ke → *My Apps* → your Go Live app → regenerate the consumer
      key and secret. Ask Safaricom (M-PESA business support) for a new passkey if needed.
- [ ] Copy `mpesa-config.example.php` to `mpesa-config.php` and fill it in.
- [ ] Make up a long random **callback secret** (40 letters and numbers, e.g. from
      https://www.random.org/strings/) and put the same value in `callback_secret` and at the end
      of `callback_url`:
      `https://marzleytechsolutions.co.ke/callback.php?key=YOUR_SECRET`.
      Payment results sent to any other address are refused.
- [ ] Upload `mpesa-config.php` **one folder above `public_html`** (e.g. `/home/USERNAME/`).
- [ ] **Test with KSh 1**: in the portal, create an invoice of KSh 1 for yourself, pay it with the
      M-Pesa button, and check that:
      the invoice turns **Paid** with the M-Pesa code, you get the "Invoice paid" email, and
      *Activity & system* shows "Invoice paid". Then delete the test invoice.

How payments are protected: an invoice is only marked paid when the payment result came to the
secret address, the amount covers the invoice, the M-Pesa code has not been used before, and a
direct check with Safaricom (STK Push Query) confirms it. Anything else is refused, logged, and
emailed to you. If a client closes the page after paying, the invoice is still marked paid.

## 2. Portal settings file

- [ ] Copy `portal-config.example.php` to `portal-config.php`, fill in the database, admin emails,
      `storage_dir` and `backup_dir` (both outside `public_html`), and upload it next to
      `mpesa-config.php`.
- [ ] The portal adds its new tables by itself the first time it opens (activity log, monthly
      invoices, reminders, settings). Nothing to import if you already imported `schema.sql`.

## 3. Scheduled jobs (backups, reminders, monthly invoices)

cPanel → **Cron Jobs** → add these two (replace `USERNAME`; check the PHP path under
*Select PHP Version*, it is often `/usr/local/bin/php`):

```
30 2 * * *   /usr/local/bin/php /home/USERNAME/public_html/portal/cron.php backup
0  7 * * *   /usr/local/bin/php /home/USERNAME/public_html/portal/cron.php daily
```

- [ ] Set **Cron Email** at the top of that page to your email, so you hear about failures.
- [ ] The next morning, open the portal → **Activity & system**: both "Daily jobs" and "Nightly
      backup" should be green.

What they do:
- **backup** (02:30): saves the database (`portal-db-DATE.sql.gz`) and uploaded files
  (`portal-files-DATE.tar.gz`) to `backup_dir`, keeps 14 days, emails you if it fails.
  To restore: phpMyAdmin → your database → Import the `.sql.gz` file.
  Also download one backup to your computer or Google Drive once a week.
- **daily** (07:00): creates monthly care-plan invoices, sends payment reminders (3 days before,
  on the due date, then 3, 7 and 14 days late), nudges clients about approvals waiting 3+ days,
  finishes any M-Pesa payment that was not marked paid, and emails you one morning summary
  (overdue invoices, support requests waiting more than a day).

## 4. Uptime alerts (5 minutes, free)

- [ ] Sign up at https://uptimerobot.com → *Add New Monitor* → HTTP(s):
  - Monitor 1: `https://marzleytechsolutions.co.ke/` (the website)
  - Monitor 2: `https://marzleytechsolutions.co.ke/portal/up.php` (answers **OK** when the
    database works and the daily jobs and backups are running)
- [ ] Add your email and the UptimeRobot app for phone alerts.

Errors inside the portal, the payment callback and the scheduled jobs are also emailed to the
admin emails automatically (at most one email per hour).

## 5. Email that doesn't land in spam

- [ ] cPanel → **Email Accounts** → create `portal@marzleytechsolutions.co.ke`.
- [ ] Click *Connect Devices* and copy the **outgoing server** (usually
      `mail.marzleytechsolutions.co.ke`, port 465) into the `smtp` settings in
      `portal-config.php` with that mailbox's password.
- [ ] cPanel → **Email Deliverability**: click *Repair* / *Install the suggested record* for
      **SPF** and **DKIM** until both show valid.
- [ ] Add a **DMARC** record (cPanel → *Zone Editor* → Add record → TXT):
      name `_dmarc`, value `v=DMARC1; p=quarantine; rua=mailto:marzleytechsolutionltd@gmail.com`
- [ ] Test: https://www.mail-tester.com, send a portal email (e.g. post a project update to a test
      client using that address) and aim for 9/10 or more.

## 6. A test (staging) site

Try changes here first, never on the live site.
- [ ] cPanel → **Domains** → create `staging.marzleytechsolutions.co.ke` with its own folder
      (e.g. `/home/USERNAME/staging`). Run AutoSSL for it.
- [ ] Create a second database (e.g. `USERNAME_staging`), import `portal/schema.sql`.
- [ ] The staging site must not use the live settings files (both sites sit under
      `/home/USERNAME`). Make a folder `/home/USERNAME/staging-config/`, put the staging
      `portal-config.php` and `mpesa-config.php` there, and add these lines at the top of the
      staging site's `.htaccess`:
      ```
      SetEnv PORTAL_CONFIG /home/USERNAME/staging-config/portal-config.php
      SetEnv MPESA_CONFIG /home/USERNAME/staging-config/mpesa-config.php
      Header always set X-Robots-Tag "noindex, nofollow"
      ```
- [ ] In the staging `portal-config.php`: `'environment' => 'staging'` (shows a striped
      "Staging site" bar, adds [STAGING] to email subjects, [TEST] to SMS).
- [ ] In the staging `mpesa-config.php`: `'environment' => 'sandbox'` with your Daraja
      **sandbox** app keys, shortcode 174379 and the sandbox passkey. No real money moves.
- [ ] Add `https://staging.marzleytechsolutions.co.ke` to the Google OAuth client's
      *Authorized JavaScript origins*.

## 7. SMS alerts (optional, recommended)

- [ ] Sign up at https://account.africastalking.com, create an app, top up (about KSh 0.80 per
      SMS), and create an API key.
- [ ] Optional: apply for a sender ID such as `MARZLEYTECH` (takes a few days).
- [ ] In `portal-config.php`:
      `'sms' => ['username' => 'YOUR_USERNAME', 'api_key' => 'YOUR_KEY', 'sender_id' => ''],`
Clients then also get an SMS for: new invoices, payment received, project updates, reminders and
approval nudges. Their phone number must be saved in *People*.

## 8. Legal and tax

- [ ] Read `/privacy` and `/terms` (linked in every page footer) and correct anything that does
      not match how you work, especially **refunds**, **care plan notice** and **the 30-day fix
      period**. They are in `content/sections.html` (search for `id="privacy"` and `id="terms"`).
      Then run `python3 tools/build_pages.py`.
- [ ] **Register with the ODPC** as a data controller/processor if required:
      https://www.odpc.go.ke → *Registration*. Small businesses under the turnover and staff
      thresholds may be exempt; check the current rules on that page.
- [ ] Put your **KRA PIN** in `portal-config.php` (`'kra_pin' => 'P0...'`). It then prints on
      every invoice and receipt.
- [ ] If you are registered for **eTIMS**, set `'etims' => true` and issue the eTIMS invoice for
      each payment from the KRA eTIMS app or portal. Use **Invoices → Download payments (CSV)**
      each month for your accountant and KRA returns.

## 9. Google

- [ ] **Search Console** (https://search.google.com/search-console): add the domain property,
      verify with the DNS TXT record (cPanel → Zone Editor), submit `sitemap.xml`, then use
      *URL inspection → Request indexing* on the homepage, /work, /services, /pricing, /about,
      /contact, /training and /blog. Sitelinks (the extra links under your result) appear by
      themselves once Google trusts the site, usually a few weeks after indexing.
- [ ] **Bing Webmaster Tools** (https://www.bing.com/webmasters): *Import from Google Search
      Console* (one click), which also covers DuckDuckGo and Yahoo.
- [ ] **Google Business Profile** (https://business.google.com): claim "Marzley Tech Solutions",
      add photos, hours (24/7), services and the website link. Then *Ask for reviews* → copy the
      link into `data/site.json` → `googleReviewUrl`, and your Maps profile link into
      `googleProfileUrl`. A "Leave a Google review" prompt then shows under testimonials.
      Six ready-made posts are in `content/google-business-posts.md`.
- [ ] Optional: create a Google Analytics 4 property and put its `G-...` ID in `data/site.json`
      → `analyticsId`. Visitors are asked for consent before it loads.

## 10. Your real content

Send these (or add them yourself) so every placeholder is replaced:
- [ ] Supreme HMS screenshot → `img/projects/Supreme hms.png`
- [ ] Testimonials: Dr. Mwangi's photo, the name for the "Student" quote, quotes from Sir Dennis
      and Mr Macharia
- [ ] Confirm care plan prices, the KSh 2,000 referral reward and the deposit amounts
- [ ] Project years and technologies for each project
- [ ] YouTube testimonial IDs → `data/videos.json`; certificates → `data/certifications.json`;
      student projects → `data/showcase.json`
- [ ] The Android app → `download/Marzley.apk`

---

## Everyday use of the new admin features

- **Quick start** (People tab, or Overview → Quick start): when a client accepts a quote, enter
  their name, Google email, phone, project and agreed total. It creates the client and project
  and sends the deposit invoice in one step.
- **Monthly invoices** (bottom of the Invoices tab): for care plans and hosting. Set the amount
  and the day of the month; invoices and reminders then go out by themselves. Pause or delete
  any time.
- **Search and filters** at the top of Projects, People, Invoices, Support and the Activity log.
- **CSV downloads**: invoices and payments (Invoices tab), clients and the activity log
  (Activity & system).
- **Activity & system**: who did what and when, the health of backups, daily jobs, email, SMS
  and M-Pesa, and **Sign out everywhere** if you lose a phone or used a shared computer.
- For safety, admins are signed out after 30 minutes without activity and clients after 4 hours
  (change `admin_idle_minutes` / `client_idle_minutes` in `portal-config.php`).
