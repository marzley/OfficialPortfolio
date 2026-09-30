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
```
