# Going live on marzleytechsolutions.co.ke

**Start with `GO-LIVE.md`**: the step-by-step checklist for payments, backups, scheduled jobs,
uptime alerts, email, staging, SMS, legal pages and Google. This file covers building and uploading.

## Before uploading
1. **Rotate the M-Pesa (Daraja) credentials.** Older versions of `stkpush.php` in this
   repository's git history contain the live consumer key, secret and passkey. Generate new
   ones in the Safaricom Daraja portal and stop using the old ones.
2. Upload your private `mpesa-config.php` **one folder above `public_html`** (for example
   `/home/USERNAME/mpesa-config.php`). Never put it inside `public_html` and never commit it;
   `.gitignore` already excludes it. The callback URL in it must be
   `https://marzleytechsolutions.co.ke/callback.php` (handled by `callback.php`, which logs each
   payment result to `mpesa_callbacks.log` outside the public folder).
3. Add `img/projects/Supreme hms.png` (the Supreme HMS screenshot). Until it exists, that
   project hides itself on the homepage.

## Building after edits
Run `python3 tools/build_pages.py` after changing `index.html`, `css/home.css`, `js/home.js` or
anything in `content/`. It rebuilds every page, the sitemap, and the minified
`css/home.min.css` and `js/home.min.js` the pages load. Install esbuild (`npm i -g esbuild`) so
those are minified; without it they are plain copies, which still work.
To refresh the share images after adding pages: `npm i -D playwright`, then
`node tools/make_og_images.js`, then run the build again.

## Security policy
`.htaccess` sends a Content-Security-Policy: pages may only load scripts from this site, Google
sign-in, Paystack and Google Analytics, and connect to Formspree. If you add another outside
service (a chat widget, a map, a new form service), add its address to that line or it will be
blocked. Don't put `<script>` code directly inside pages; put it in a file in `js/`.

## Editing pages
`work.html`, `about.html`, `services.html`, `process.html`, `pricing.html` and `contact.html`
are built from the sections of `index.html`. After editing `index.html`, run
`python3 tools/build_pages.py` and upload the homepage and those six files together.

## Offline page
`sw.js` shows `offline.html`, or a saved copy of a page the visitor already opened, when the
connection is down or a page takes more than 10 seconds. If you change `offline.html` or
`sw.js`, change `VERSION` at the top of `sw.js` (for example `marzley-v2`) so visitors get
the new copy.

## Settings you can change without code
- `data/stats.json`: the numbers in the homepage hero.
- `data/site.json`: `analyticsId` (your Google Analytics ID, starting `G-`) turns on analytics
  with a cookie banner; `googleReviewUrl` and `googleProfileUrl` show a "Leave a Google review"
  prompt under the testimonials. Leave them empty to keep these off.

- `data/site.json` `banner`: a short offer shown at the top of every page, e.g.
  `{"text": "Back-to-school offer: 20% off college websites", "link": "pricing", "until": "2026-12-31"}`.
- `data/videos.json`: YouTube IDs of client video testimonials (shown under What people say).
- `data/certifications.json`: your real certificates (shown in About).
- `data/showcase.json`: student projects (shown on the Training page).
- Care plan prices are in `content/sections.html` (search for "Care plans"); the referral
  reward (KSh 2,000) is on the Referrals page and in the portal.

## Blog, case studies and pages
- New blog post: add a file to `content/blog/` (copy an existing one: the comment at the top
  holds the title, description, date and tag), then run `python3 tools/build_pages.py`.
- Case studies live in `content/case-studies/`, the Kiswahili page in `content/kiswahili.html`,
  and the deposit, booking and training sections in `content/sections.html`.
- `content/` and `tools/` do not need uploading. `content/google-business-posts.md` has six
  ready-to-paste Google Business Profile posts.

## Client portal (/portal)
1. cPanel > MySQL Databases: create a database and user, and give the user all privileges.
2. cPanel > phpMyAdmin: open the database, Import `portal/schema.sql`.
3. Copy `portal-config.example.php` to `portal-config.php`, fill in the database details, your
   cPanel username in `storage_dir`, and the admin Google emails. Upload it ONE FOLDER ABOVE
   `public_html`, next to `mpesa-config.php`.
4. Google Cloud Console > your OAuth client: under Authorized JavaScript origins add
   `https://marzleytechsolutions.co.ke`.
5. For email alerts, create an email account such as portal@marzleytechsolutions.co.ke in
   cPanel > Email Accounts and put it in `mail_from`.
6. Open https://marzleytechsolutions.co.ke/portal/ and sign in with an admin email. Add each
   client with the Google email they use; they can then sign in and see only their own projects,
   updates, files and invoices, and pay invoices by M-Pesa.
7. Staff can also: request approvals, answer support requests, create courses with lessons,
   enrol students (add them under People first) and issue certificates. Anyone can check a
   certificate at /portal/verify.php.

The portal and website check need PHP 8 or newer (cPanel > Select PHP Version).

## Upload
Upload the whole folder into `public_html`, including the hidden `.htaccess` file.

## After uploading
1. In cPanel, make sure SSL is active (**SSL/TLS Status → Run AutoSSL**). `.htaccess`
   redirects every visit to `https://marzleytechsolutions.co.ke`.
2. Open these and check they load:
   - https://marzleytechsolutions.co.ke/
   - https://marzleytechsolutions.co.ke/robots.txt
   - https://marzleytechsolutions.co.ke/sitemap.xml
   - https://marzleytechsolutions.co.ke/some-missing-page (should show the “page not found” page)
   - https://marzleytechsolutions.co.ke/about (and /work, /services, /process, /pricing, /contact, /privacy, /terms)
   - https://marzleytechsolutions.co.ke/about.html (should redirect to /about)
3. **Google Search Console** (https://search.google.com/search-console): add the domain,
   verify it with the DNS TXT record Google gives you, then submit `sitemap.xml`.
4. **Google Business Profile** (https://business.google.com): create or claim
   "Marzley Tech Solutions" so you appear in Maps and local searches.
5. Test the share preview by pasting the link into WhatsApp, or use
   https://www.opengraph.xyz.
6. Send a test message through the contact form and confirm it arrives from Formspree.
