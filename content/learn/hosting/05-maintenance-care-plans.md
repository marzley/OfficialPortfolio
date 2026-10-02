---
slug: website-maintenance
title: "Website maintenance and care plans: updates, monitoring, security, reports and earning monthly income"
after: deploy-node-python-apps
---
# Website maintenance and care plans: updates, monitoring, security, reports and earning monthly income

A website isn't finished at launch. Software needs updates, plugins get vulnerabilities, certificates renew, backups must be checked, content goes out of date, forms break silently, and traffic and speed change. Many small business sites in Kenya get hacked or quietly stop working because nobody looks after them. **Website maintenance** fixes this, and for freelancers and agencies, **care plans** (monthly maintenance packages) turn one-off projects into steady recurring income.

:::note What you will learn
- What website maintenance includes, and why sites decay
- A maintenance schedule: daily, weekly, monthly, quarterly, yearly tasks
- Updating safely with staging and backups
- Monitoring uptime, security, speed and SEO
- Checking forms, payments and email
- Monthly client reports
- Designing and pricing care plans
- Contracts, scope and handling extra requests
- Tools that make maintenance efficient
:::

## Why websites decay

| Issue | What happens if ignored |
|---|---|
| Outdated WordPress core, plugins, themes, PHP | Hacks, broken features, compatibility errors |
| Expired domain or hosting | Site and email go offline |
| Broken contact forms or email deliverability | Lost leads without anyone noticing |
| Failed backups | Nothing to restore after a disaster |
| Growing images, database clutter | Slower site, worse Google rankings |
| Old content (prices, staff, opening hours) | Confused or lost customers |
| Broken links and 404s | Poor experience, SEO losses |

## A maintenance schedule

| Frequency | Tasks |
|---|---|
| **Continuous (automated)** | Uptime monitoring, daily backups, security scanning, SSL auto-renewal |
| **Weekly** | Apply updates (on staging first for important sites), check backups completed, review security alerts, check forms send email |
| **Monthly** | Speed test, broken-link check, review Search Console for errors, test a restore (or quarterly), clean spam comments and old revisions, review user accounts, send a client report |
| **Quarterly** | Full restore test, review plugins (remove unused), PHP version review, content review with the client, accessibility spot checks |
| **Yearly** | Renew domain/hosting (confirm auto-renew), review hosting plan, design/content refresh ideas, legal pages review (privacy policy) |

## Updating safely

1. **Back up** files and database (and confirm the backup exists).
2. Update on a **staging** copy first (many hosts and managed WordPress plans offer one-click staging).
3. Read changelogs for major updates (e.g. WooCommerce, page builders).
4. Update in order: WordPress core → theme → plugins; or framework/dependencies for custom apps.
5. **Test** key pages and functions: home, contact form, checkout/M-Pesa payment, login, search.
6. Apply to live; test again.
7. Keep a **maintenance log**: date, what was updated, issues found.

For custom PHP/Laravel/Node apps: update dependencies (`composer update`, `npm update`), run tests, deploy through CI, and keep the server OS patched.

## Monitoring

| What | Tools (examples) | Alert on |
|---|---|---|
| **Uptime** | UptimeRobot, Better Stack, Uptime Kuma (self-hosted) | Site down, slow responses, SSL expiry |
| **Security** | Wordfence/Sucuri (WordPress), server malware scans, Cloudflare | Malware, file changes, brute-force spikes |
| **Speed** | PageSpeed Insights, GTmetrix | Core Web Vitals getting worse |
| **SEO health** | Google Search Console | Indexing errors, manual actions, security issues |
| **Traffic** | Google Analytics or privacy-friendly alternatives | Sudden drops |
| **Domain/SSL expiry** | Registrar reminders, monitoring tools | 30 days before expiry |

## Test what matters to the business

Automated monitoring says "the home page loads", not "customers can pay". Monthly (or weekly for shops):
- Submit the **contact form** and confirm the email arrives (inbox, not spam).
- Make a small **test order** and **M-Pesa payment** (or sandbox) and confirm the order/callback is recorded.
- Test **logins**, password resets and booking flows.
- Check the **WhatsApp/click-to-call** buttons work on mobile.

## Monthly client reports

A short report shows value and keeps clients renewing:

```
Website care report – September 2026 – yourbusiness.co.ke
Uptime: 99.98% (one 6-minute host outage on 12 Sept)
Updates: WordPress 6.x, 7 plugins, 1 theme – all tested
Security: 0 malware found; 1,214 malicious login attempts blocked
Backups: 30 daily backups stored off-site; restore test passed on 28 Sept
Speed: mobile PageSpeed 82 → 88 after image optimisation
SEO: 3,450 Google impressions (+12%), 210 clicks; 2 broken links fixed
Forms: contact form and booking tested weekly – working
Content updates done: new price list, 2 blog posts uploaded
Recommendations: add Google reviews section; renew domain before 14 Jan (auto-renew on)
```

## Designing care plans

| Plan | Typical inclusions | Suits |
|---|---|---|
| **Basic** | Daily backups, weekly updates, uptime + security monitoring, monthly report | Brochure sites |
| **Standard** | Basic + up to 1 hour of content changes/month, speed optimisation, form/payment testing | Active small businesses |
| **Premium** | Standard + 3–5 hours of changes, priority support, SEO monitoring, quarterly strategy call | Shops, booking systems, organisations |

Pricing approach: estimate your monthly time per site, tool costs (backups storage, monitoring, premium plugins), and the value of reduced risk to the client. Prices vary widely; in Kenya, small business care plans are commonly priced in the low thousands to tens of thousands of shillings per month depending on scope and site complexity. Offer an annual payment option with a discount.

```try-python
# Simple care plan profitability check
sites = 12
fee = 4500            # KSh per site per month
tools = 6000          # monthly tool costs for all sites
hours_per_site = 1.5
hourly_value = 1500   # what your time is worth per hour
revenue = sites * fee
time_cost = sites * hours_per_site * hourly_value
profit = revenue - tools - time_cost
print(f"Revenue KSh {revenue:,}; tools KSh {tools:,}; time value KSh {time_cost:,.0f}")
print(f"Profit after valuing your time: KSh {profit:,.0f} per month")
```

## Contracts and scope

- Write what's **included** (updates, backups, monitoring, X hours of changes) and what's **not** (new features, redesigns, content writing beyond the allowance, fixing problems caused by others).
- Response times: e.g. "site down: within 2 hours during business hours; other requests within 2 working days".
- Payment terms: monthly in advance (M-Pesa/bank), what happens if unpaid (pause service).
- Ownership: the client owns the domain, hosting and content; you hand over access if the contract ends.
- Extra work: quoted separately or charged at an hourly rate.

## Tools that save time

| Need | Tools |
|---|---|
| Manage many WordPress sites | MainWP (self-hosted), ManageWP, WP Umbrella |
| Backups | Host backups + UpdraftPlus/BlogVault to cloud storage |
| Monitoring | UptimeRobot, Better Stack, Uptime Kuma |
| Security | Wordfence, Sucuri, Cloudflare |
| Speed | Caching plugins, image optimisers, Cloudflare CDN |
| Tasks and logs | Trello/Notion/Google Sheets checklist per site |
| Reports | Templates in Google Docs/Looker Studio, or built into management tools |

:::think A client paid for a website last year and never paid for maintenance. Now the site shows a "Deceptive site ahead" warning in Chrome. What probably happened, and how would you pitch a care plan after fixing it?
Outdated plugins were likely exploited and the site now hosts phishing or malware, so Google blacklisted it. After cleaning it (restore/rebuild, update everything, change passwords, request review in Search Console), explain the cost of this incident (lost customers, cleanup fees) versus a monthly care plan with updates, backups, monitoring and reports that would have prevented or quickly fixed it.
:::

## Summary

- Websites decay without maintenance: updates, expiries, broken forms, failed backups, slow pages, old content.
- Follow a schedule: continuous automation, weekly updates and checks, monthly speed/SEO/report tasks, quarterly restore tests, yearly renewals.
- Update safely with backups and staging, then test business-critical functions like forms and payments.
- Monitor uptime, security, speed, SEO and expiry; send short monthly reports.
- Sell care plans with clear scope, response times, payment terms and client ownership: steady monthly income.

```quiz
Q: What should you always do before updating a website?
A: back up | backup | take a backup | make a backup
Q: Where should important updates be tested first?
A: staging | a staging site | staging copy
Q: Name a free uptime monitoring tool.
A: UptimeRobot | uptime kuma | better stack | uptimerobot
Q: Which Google tool shows indexing errors and security issues for your site?
A: Search Console | google search console
Q: Who should own the domain and hosting: the client or the developer?
A: client | the client
```
