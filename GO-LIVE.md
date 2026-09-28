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

cPanel → **Cron Jobs** → add these three (replace `USERNAME`; check the PHP path under
*Select PHP Version*, it is often `/usr/local/bin/php`):

```
30 2 * * *   /usr/local/bin/php /home/USERNAME/public_html/portal/cron.php backup
0  7 * * *   /usr/local/bin/php /home/USERNAME/public_html/portal/cron.php daily
5  * * * *   /usr/local/bin/php /home/USERNAME/public_html/portal/cron.php monitor
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

- **monitor** (every hour): checks each client website you entered under *Domains & hosting* →
  *Website to monitor*, emails you when one is down twice in a row and when it's back, and
  records uptime for the monthly care reports.

### Off-site backups (strongly recommended)
Backups on the same server are lost if the server is lost. Copy them off-site every night:
- [ ] Sign up at https://www.backblaze.com/cloud-storage (the first 10 GB are free; after that
      it costs a few shillings a month for a small portal).
- [ ] *Buckets* → **Create a Bucket**, name it e.g. `marzley-backups`, set it to **Private**.
      Note the **Endpoint** shown on the bucket (e.g. `s3.us-west-004.backblazeb2.com`).
- [ ] *Application Keys* → **Add a New Application Key**, allow access **only to that bucket**,
      Read and Write. Copy the keyID and applicationKey (shown once).
- [ ] Fill in `offsite_backup` in `portal-config.php` (endpoint with `https://`, region = the
      middle part of the endpoint, e.g. `us-west-004`, bucket, key, secret).
- [ ] Next morning, *Activity & system* shows "Off-site copy" in green, and the files appear in
      the bucket. Optional: in the bucket's *Lifecycle Settings*, keep only the last 30 days.

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

## 7b. Card payments (Paystack, optional)

- [ ] Log in to https://dashboard.paystack.com (the account the website already uses).
- [ ] *Settings → API Keys & Webhooks*: copy the **Live Secret Key** into `portal-config.php`:
      `'paystack' => ['secret_key' => 'sk_live_…'],`
- [ ] On the same page set **Live Webhook URL** to
      `https://marzleytechsolutions.co.ke/portal/paystack.php`
- [ ] Test with a small real card payment on a test invoice, then refund it from Paystack.
Clients then see **Pay by card** next to Pay with M-Pesa. A card payment is only recorded after
the portal asks Paystack directly and the amount and currency (KES) match.

## 7c. Website chat

The chat answers on its own from `data/knowledge.json` (about 70 topics, English and Kiswahili):
prices, packages, timelines, M-Pesa, hosting, care plans, systems, training, portal, contacts…
To change an answer or add a topic, edit that file (each entry has a title, keywords, the answer
and up to two links) and upload it. No rebuild needed.

**Call me back** now saves the request on the Leads board and emails you immediately (it works
even before the portal is set up), with Formspree and WhatsApp as backups. Add
`'sms_alert_phone' => '07…'` in `portal-config.php` to also get an SMS (needs SMS set up).

**Optional: AI answers for anything else (Claude).**
- [ ] Create an account at https://platform.claude.com, add a payment method, and under
      *Settings → Limits* set a monthly spend limit you're comfortable with.
- [ ] *Settings → API keys* → **Create key**. Put it in `portal-config.php`:
      `'chat' => ['api_key' => 'sk-ant-…'],`
- [ ] Make sure the `phpvendor/` folder from the zip is uploaded (it holds the official Anthropic
      PHP library; the web can't open it).
- [ ] Ask the chat something unusual, e.g. "what is SSL and does my blog need it?"

How it behaves: common questions are still answered instantly from the knowledge base (free);
only questions it isn't sure about go to Claude, together with the knowledge base so answers stay
true to your prices and policies. It replies in the visitor's language, never invents prices, and
suggests WhatsApp or a call back when it doesn't know. Limits: 20 AI answers per visitor per hour
and 400 per day in total (change `per_visitor_hour` / `daily_limit`). It uses Claude Opus 5 at low
effort; you can set `'model' => 'claude-sonnet-5'` for a cheaper model. If the key stops working
you get an email, and the chat falls back to its own answers.

## 7d. Learning hub (marzleytechsolutions.co.ke/learn/)

Free for everyone: 26 starter lessons (HTML, CSS, JavaScript, Python, SQL) with a live code editor,
self-checking exercises, a Practice editor, and your PDF notes. Videos are unlocked per person
with M-Pesa (KSh 50 by default; you set the price for each video).

- [ ] Upload the whole zip, including `learn/` and `vendor/` (Python alone is about 14 MB).
      The `.htaccess` files inside `learn/`, `vendor/pyodide/` and `vendor/sqljs/` must be there:
      they let learners' code run in a locked-down box that can't touch the site or anyone's account.
- [ ] Open the portal once as the owner: the database adds the learning hub tables and lessons by itself.
- [ ] In Google Cloud (the same sign-in client as the portal) nothing extra is needed; learners can
      also sign up with a 6-digit email code.
- [ ] Portal → **Learning hub** → upload a short test video and a PDF. Open the hub in a private window,
      sign up, pay KSh 50 with your own phone, and check the video plays and you can comment.
- [ ] Hosting disk: videos are stored privately in `portal-files/learn/` (outside public_html).
      Check your plan's disk space; 10 videos of 15 minutes at 720p are roughly 2–3 GB.

**Uploading videos.** Export MP4 (H.264, 720p is plenty for screen recordings) from your editor or phone.
Uploads go in 8 MB pieces, so the hosting upload limit doesn't matter, and a dropped connection
carries on where it stopped. Keep the tab open until it says "Video uploaded". A preview picture is
taken from the video; change it with **Picture**.

**Good to know.**
- Only people who paid (and you and staff with the Courses area) can stream a video. Downloading is
  switched off in the player and links don't work for anyone else.
- Every video shows the viewer's email, M-Pesa number and learner number, faintly tiled and drifting
  across the picture (also in full screen). No website can block screen recording, but any recording
  that gets shared shows who it came from. If someone removes the watermark with browser tools, the
  video stops. For hard blocking (a black screen when recording) use a DRM video host such as VdoCipher.
- If you hide a paid-for video, the people who bought it keep access. Paid videos can't be deleted.
- Comments are seen only by people who unlocked the video, with first name and initial. Hide or
  delete any comment from **Learning hub → Comments**.
- Lessons are written in simple Markdown in **Learning hub → Tutorials**. A code block that starts
  with ```` ```try-python ```` (or try-html, try-css, try-javascript, try-sql) gets a Run button.
- If a lot of people start watching (hundreds a day), move videos to a video host such as
  Bunny Stream (about $1 per 100 GB delivered) so your hosting isn’t slowed down.

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

**New in this round**
- **Leads** (Sales → Leads): every enquiry from the website's contact, booking, training and
  call-back forms lands here automatically (you still get the Formspree email too). Move each one
  along New → Contacted → Quoted → Won or Lost, keep private notes, WhatsApp or call in one tap.
- **Quotes**: build an itemised quote (from a lead or from scratch), then **Send** (email, and SMS
  if set up) or **Copy link** / **WhatsApp**. The client opens a private page, reads it, types their
  name and ticks the terms to accept. That creates their portal account, project and deposit
  invoice automatically and marks the lead Won. You get an email.
- **Invoice numbers** now run MT-2026-0001, MT-2026-0002 … with a new series each year. Older
  invoices keep their old numbers. Change the prefix with `invoice_prefix` in the config.
- **Part payments**: clients choose how much to pay by M-Pesa (up to KSh 150,000 per payment);
  invoices show the balance and stay open until fully paid. Reminders mention the balance.
- **"I've already paid"**: clients report a till or bank payment with the code and an optional
  slip. It appears at the top of Invoices under *Payments to confirm*: check your statement,
  then **Confirm** (receipt goes out) or **Reject** with a reason (the client is told).
- **Record payment** on any invoice for cash, bank or payments you received another way.
- **Stage payments**: when you *Request approval* on a project you can enter a stage amount.
  When the client approves, the invoice for that stage is created and sent.
- **Domains & hosting**: add each client's domain, hosting and SSL with the expiry date and
  renewal price. Clients and you get reminders 30 and 7 days before; with "send the renewal
  invoice" ticked, the invoice goes out at 30 days. **Renewed +1 year** moves the date on.
- **Care report**: in Domains & hosting, *Care report* makes a one-page monthly PDF for a client
  (uptime, work done, support, payments). Clients can open theirs from their portal too.
- **After-launch feedback**: when you set a project to *Live*, the client is asked for a 1–5 star
  rating. 4–5 stars are sent to your Google review link (set `googleReviewUrl` in
  `data/site.json` first!); 1–3 stars come privately to you with "Needs attention".
- **Client uploads**: clients can send logos, photos and documents on each project card.
- **Team** (Activity & system → Team, owners only): add staff with their own Google sign-in and
  only the areas they need (Projects, People, Support, Courses, Invoices & quotes, Leads).
  Changes and removals sign them out at once. Staff never see the activity log or team settings.
- **Kiswahili**: clients can switch the portal to Kiswahili with the button at the top. Please
  have a native speaker read it once and send corrections.
- **"Built by" link for client sites**: `content/built-by-snippet.html` has a text link and a small
  badge to put in client website footers (ask the client first). Each one helps your Google
  ranking.
- **Content**: two new blog posts are live, and `content/google-business-posts.md` now has ten
  ready-to-paste Google Business posts. Post one or two a week.

**New in round 4**
- **Website payments are announced.** Deposits and care plans paid with the M-Pesa forms on the
  website now email you straight away (and SMS if `sms_alert_phone` is set), appear on the Leads
  board as Won, and are listed under *Invoices → Website payments*. Choose the client and press
  **Attach** to give them a receipt and keep the payment in their account. The KSh 1 demo
  payments are recorded quietly (no email).
- **Referrals are tracked.** People who sign up on the Referrals page, and every client (whose
  portal link uses the same code), are recognised. When someone who came through their link pays
  (a website deposit, or any invoice), *Growth → Referrals* shows the reward as due and you get an
  email. Send it by M-Pesa and press **Mark paid**. Self-referrals are ignored. Change the amount
  with `referral_reward` in `portal-config.php`.
- **Reviews on the website.** The after-launch rating page now has a "you may show my comment"
  box. In *Growth → Reviews for the website*, tick **Show on website** and the review appears in
  the testimonials, marked "Verified client". Only 4–5 star reviews with the client's permission
  can be shown.
- **Mailing list.** A "Tips & offers by email" box is in every page footer. People confirm by
  email before they're added. Write and send newsletters in *Growth → Mailing list* (to
  subscribers, and optionally clients and students). Every email has a one-click unsubscribe;
  large sends finish within the hour through the `monitor` cron job. Use **Send me a test** first.
- **Chat questions.** Questions the chat couldn't answer are listed in *Growth* (names, numbers
  and emails removed). Add answers for common ones to `data/knowledge.json`, then press **Done**.
- **Sign in with a code.** Clients without a Google account can sign in with a 6-digit code sent
  to the email or phone number saved in *People* (by SMS if SMS is set up, otherwise email). Codes
  work once, for 10 minutes, with 5 tries. Staff and owners still sign in with Google.
- **Google Analytics events** (only for visitors who accept cookies): `whatsapp_click`,
  `call_click`, `email_click`, `portal_click`, `chat_open`, `chat_question`, `chat_unanswered`,
  `generate_lead`, `quote_sent`, `deposit_paid`, `care_plan_paid`, `demo_payment`,
  `referral_signup`, `sign_up`. In GA4 go to *Admin → Events* and mark `generate_lead`,
  `deposit_paid` and `whatsapp_click` as **key events** so they show as conversions.

**Automated tests**: `sh tests/run.sh` checks 119 things in the portal (payments, permissions,
quotes, backups…) against a throwaway database. GitHub runs it on every push once the push works
(`.github/workflows/tests.yml`). The `tests/` folder is not needed on the server.



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
