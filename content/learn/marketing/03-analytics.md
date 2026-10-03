---
slug: measure-results-analytics
title: Measure your results: Google Analytics and Search Console
after: ads-analytics
---
# Measure your results: Google Analytics and Search Console

Marketing without measurement is guessing. Two free Google tools tell you who visits your website, where they came from, what they did and what they searched for.

## Google Search Console: how you appear in Google

**What it shows:** the searches that showed your site, how many people clicked, your average position, which pages are indexed, and errors Google found.

**Set it up:**

1. Go to search.google.com/search-console and add your domain.
2. Verify ownership (a DNS TXT record at your domain registrar is the best method).
3. Submit your **sitemap** (`https://yourdomain.co.ke/sitemap.xml`).

**Key reports:**

| Report | Use it to |
|---|---|
| **Performance** | See queries, clicks, impressions, CTR and position |
| **Pages (Indexing)** | See which pages are in Google and why others aren't |
| **URL Inspection** | Check one page and **request indexing** after updating it |
| **Core Web Vitals** | Find slow pages on mobile |
| **Links** | Which sites link to you |

| Term | Meaning |
|---|---|
| Impressions | Times your site appeared in results |
| Clicks | Times someone clicked through |
| CTR | Clicks ÷ impressions (e.g. 30 ÷ 1,000 = 3%) |
| Position | Average ranking (1 = top) |

## Google Analytics 4 (GA4): what visitors do

**Set it up:** create a property at analytics.google.com, then add the tag to every page (or use a WordPress plugin / Google Tag Manager). Respect privacy: tell visitors in your privacy notice and use a consent banner where needed.

**The reports that matter for a small business:**

| Question | Where in GA4 |
|---|---|
| How many people visit? | Reports → Home / Engagement |
| Where do they come from? (Google, Facebook, WhatsApp, direct) | Reports → Acquisition → Traffic acquisition |
| Which pages are popular? | Engagement → Pages and screens |
| Phones or computers? | Tech → Tech details |
| Which towns/countries? | User attributes → Demographic details |
| Did they contact us? | Key events (conversions) |

## Track what really matters: key events

Visits are nice; **enquiries and sales** pay the bills. Mark actions as **key events**:

- Clicks on the **WhatsApp** button or **phone** link
- Contact **form submissions**
- **Payments** completed
- Quote downloads

Then you can answer: "Which source brings customers, not just visitors?"

## Track campaigns with UTM links

Add tags to links you share so GA4 knows exactly where visitors came from:

```
https://yourdomain.co.ke/offer?utm_source=whatsapp&utm_medium=status&utm_campaign=december_offer
```

| Parameter | Example |
|---|---|
| `utm_source` | whatsapp, facebook, newsletter, flyer |
| `utm_medium` | status, post, email, qr |
| `utm_campaign` | december_offer, back_to_school |

Use Google's free "Campaign URL Builder" to make them, and a QR code for flyers.

## A simple monthly review (30 minutes)

1. **Search Console**: top 10 queries and pages. Any page with many impressions but low CTR? Rewrite its title and description.
2. **GA4 Acquisition**: which channel grew or fell?
3. **Key events**: how many enquiries, and from which source?
4. Pick **one improvement** for next month (e.g. "add prices to the services page", "post 3 WhatsApp statuses a day").
5. Write the numbers in a simple sheet to see trends over time.

## Why analytics matter

Without data, marketing is guesswork: you don't know which posts bring customers, which pages people leave, or whether your website brings enquiries at all. Analytics show what's working so you can spend time and money wisely. Digital marketers, SEO specialists, business owners and web developers use Google Search Console and Google Analytics 4 to measure results and report to clients and managers.

## Setting up the tools correctly

**Google Search Console**

1. Add a property (Domain property via DNS TXT record covers all versions: http/https, www/non-www).
2. Submit your XML sitemap (Sitemaps → enter `sitemap.xml`).
3. Check **Pages** (indexing) for errors, and **Core Web Vitals** for speed problems.
4. Use **URL Inspection** to test a page and request indexing after major updates.

**Google Analytics 4**

1. Create a GA4 property and a web data stream.
2. Add the tag (gtag.js) or use Google Tag Manager, or a plugin for WordPress.
3. Turn on Enhanced measurement (page views, scrolls, outbound clicks, file downloads, site search).
4. Mark important events as **key events** (form submissions, WhatsApp clicks, purchases).
5. Link Search Console to GA4 for combined reports.
6. Add a cookie/consent notice and privacy policy explaining analytics use.

## Reading Search Console performance

| Metric | Meaning | Action |
|---|---|---|
| Impressions | How often your pages appeared in results | Growing impressions = growing visibility |
| Clicks | How often people clicked | The visitors you actually got |
| CTR | Clicks ÷ impressions | Low CTR? Improve titles and meta descriptions |
| Average position | Typical ranking position | Positions 8–20 are opportunities to improve content |

Filter by **page** to see which queries each page ranks for, and by **country** and **device** (most Kenyan traffic is mobile).

## Key GA4 reports

| Report | Answers |
|---|---|
| Reports → Acquisition → Traffic acquisition | Where visitors come from (Organic Search, Direct, Social, Referral, Paid) |
| Reports → Engagement → Pages and screens | Most viewed pages, engagement time |
| Reports → Engagement → Events / Key events | How many enquiries, clicks, purchases |
| Reports → Tech | Devices, browsers, screen sizes |
| Explore | Custom analysis: funnels, paths, segments |

**Engagement rate** (sessions with meaningful interaction) replaced bounce rate as a main measure in GA4.

## Tracking WhatsApp and phone clicks

Many Kenyan businesses get enquiries by WhatsApp and phone rather than forms. Track clicks on `wa.me` and `tel:` links:

```html
<a href="https://wa.me/254700000000?text=Hi" onclick="gtag('event','whatsapp_click',{location:'header'})">Chat on WhatsApp</a>
<a href="tel:+254700000000" onclick="gtag('event','phone_click',{location:'contact_page'})">Call us</a>
```

Then mark `whatsapp_click` and `phone_click` as key events. (GA4's enhanced measurement also records outbound clicks, but named events are clearer for reports.)

## UTM links in practice

Tag links you share so GA4 knows exactly which campaign brought visitors:

```
https://example.co.ke/offer?utm_source=whatsapp&utm_medium=status&utm_campaign=december_sale
https://example.co.ke/offer?utm_source=facebook&utm_medium=paid&utm_campaign=december_sale
https://example.co.ke/offer?utm_source=flyer&utm_medium=qr&utm_campaign=december_sale
```

Keep naming consistent (lowercase, underscores). A shared spreadsheet of UTM links prevents messy reports. Free UTM builder tools create these links for you.

## Measuring offline and social results

- Ask new customers "How did you hear about us?" and record answers in a sheet.
- Use unique discount codes per channel ("IG10", "FLYER10").
- Use QR codes with UTM links on printed materials.
- Check each platform's own insights (Facebook/Instagram Insights, TikTok analytics, WhatsApp Business catalogue views).

## Building a simple monthly report

| Section | Example |
|---|---|
| Headline numbers | Visitors 3,200 (+18%), enquiries 64 (+10), conversion rate 2.0% |
| Top channels | Organic search 45%, WhatsApp/social 30%, direct 20% |
| Top pages | Services page, Price list, Blog: "How much does a website cost in Kenya?" |
| Search highlights | "web design Nakuru" moved from position 14 to 7 |
| What we did | Published 4 articles, improved 3 page titles, ran a December Status campaign |
| Next month | Improve contact page CTR, create a page for Naivasha |

Looker Studio (free) can turn GA4 and Search Console data into an automatic dashboard to share with clients.

## Privacy and ethics

- Explain analytics in your privacy policy and respect consent requirements.
- Don't send personal data (names, phone numbers, emails) into GA4 event parameters.
- Look at trends and groups, not individuals.

## Practice

1. Set up Search Console for a site you control and submit its sitemap.
2. Install GA4 and create key events for a form submission and WhatsApp clicks.
3. Create three UTM links for the same offer on different channels.
4. Find a page with high impressions but low CTR and rewrite its title and description.
5. Build a one-page monthly report using the template above.

:::think A business reports "our website had 10,000 visitors last month" as success, but enquiries didn't increase. What would you investigate?
Check where visitors came from and whether they matched the target audience (e.g. irrelevant blog traffic or bots), which pages they landed on, and whether key events (forms, WhatsApp, calls) were tracked correctly. Look at the conversion path: are calls to action clear, is the contact page working on mobile, is pricing information missing? Success should be measured by enquiries and sales, not visits alone.
:::

```quiz
Q: Which tool shows the Google searches your site appeared for? (two words)
A: Search Console | Google Search Console
Q: What does CTR stand for? (three words)
A: click-through rate | click through rate
Q: If a page had 2000 impressions and 60 clicks, what is the CTR in percent?
A: 3 | 3%
Q: What are important actions like form submissions called in GA4? (two words)
A: key events | conversions | key event
Q: Which UTM parameter says where the traffic came from, like whatsapp?
A: utm_source | source
Q: Which GA4 measure replaced bounce rate as a main engagement metric? (two words)
A: engagement rate
Q: Which free Google tool builds dashboards from GA4 and Search Console data? (two words)
A: Looker Studio | Data Studio
Q: Which Search Console tool tests a single page and can request indexing? (two words)
A: URL Inspection
Q: Should personal data like phone numbers be sent into GA4 events? (yes or no)
A: no
```
