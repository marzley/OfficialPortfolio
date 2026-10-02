---
slug: ads-analytics
title: "Online ads and analytics: Google Ads, Meta and TikTok ads, budgets, targeting, tracking, ROI and optimisation"
after: KEEP
---
# Online ads and analytics: Google Ads, Meta and TikTok ads, budgets, targeting, tracking, ROI and optimisation

Organic SEO and social media take time. **Paid ads** put your business in front of the right people today: someone searching "emergency plumber Kileleshwa", a mother in Mombasa interested in baby products, a student looking for laptop deals before university opens. But ads can also burn money quickly if you don't target, track and optimise carefully. This unit teaches how the main ad platforms work, how to plan budgets, write ads, track results with **analytics**, and calculate whether ads are actually profitable.

:::note What you will learn
- When to use ads (and when not to)
- Search ads vs social/display ads
- Google Ads: keywords, match types, ad copy, extensions, Quality Score, local campaigns
- Meta (Facebook/Instagram) ads: objectives, audiences, creatives, Click-to-WhatsApp
- TikTok and YouTube ads in brief
- Budgets, bidding and testing
- Landing pages that convert
- Tracking: UTM tags, conversion tracking, pixels, Google Analytics
- Key metrics: CPC, CTR, CPA, ROAS, conversion rate
- Optimising campaigns and avoiding common mistakes
:::

## When to use ads

| Ads make sense when... | Fix first if... |
|---|---|
| You have a clear offer and know your profit margin | Your website/WhatsApp can't handle enquiries well |
| You need results quickly (launch, season, event) | You don't know who your customer is |
| You want to test demand for a product | The product has poor reviews or stock problems |
| Organic channels are working and you want to scale | You can't track results at all |

## Search ads vs social ads

| | Search ads (Google, Bing) | Social ads (Meta, TikTok, LinkedIn) |
|---|---|---|
| Who sees them | People **searching** for something now | People who **match a profile** while scrolling |
| Intent | High: actively looking | Lower: interrupting; creates demand |
| Strength | Capture existing demand | Discovery, awareness, impulse buys, retargeting |
| Example | "buy office chairs Nairobi" | A video of ergonomic chairs shown to office workers aged 25–45 in Nairobi |

## Google Ads

### How it works

Advertisers bid on **keywords**. When someone searches, Google runs an auction considering your **bid** and your ad's **quality** (relevance, expected click-through rate, landing page experience). You pay when someone clicks (**cost per click, CPC**).

### Keywords and match types

| Match type | Syntax | Shows for |
|---|---|---|
| **Broad** | `office chairs` | Related searches, including ones without those words (needs care and good conversion data) |
| **Phrase** | `"office chairs"` | Searches including the meaning of the phrase ("buy office chairs in Nairobi") |
| **Exact** | `[office chairs]` | Searches with the same meaning as the keyword |
| **Negative** | `-free`, `-jobs`, `-second hand` | Excludes searches you don't want |

**Negative keywords** save money: a furniture seller doesn't want clicks from "office chair repair jobs" or "free office chairs".

### Writing search ads

Responsive search ads combine several headlines and descriptions:

```
Headline 1: Office Chairs in Nairobi
Headline 2: Ergonomic Chairs from KSh 8,500
Headline 3: Free Delivery Within Nairobi
Description: Comfortable, durable office chairs with 1-year warranty. Pay via M-Pesa on delivery.
Description: Visit our Westlands showroom or order on WhatsApp today.
```

Add **assets/extensions**: sitelinks (Shop Chairs, Desks, Contact), call buttons, location (linked to Google Business Profile), callouts ("M-Pesa accepted", "1-year warranty").

### Campaign types

- **Search**: text ads on results pages.
- **Performance Max**: Google's automated campaign across Search, YouTube, Display, Maps and Gmail (needs good conversion tracking).
- **Display**: banner ads on websites (awareness, retargeting).
- **YouTube video ads**.
- **Shopping** (for e-commerce product feeds, where available).

Use **location targeting** (your delivery area), **ad schedules** (when you can answer calls) and a **daily budget** cap.

## Meta (Facebook and Instagram) ads

### Objectives

Choose the objective matching your goal: **Awareness**, **Traffic**, **Engagement** (including messages), **Leads** (instant forms), **App promotion**, **Sales**. In Kenya, **Click-to-WhatsApp** ads (Engagement/Messages) are very popular: the ad opens a WhatsApp chat with your business.

### Audiences

| Audience | Example |
|---|---|
| **Core (demographic/interest)** | Women 22–40 in Nairobi interested in beauty and fashion |
| **Custom** | Website visitors (via the Meta pixel), customer lists (with consent), people who engaged with your page/videos |
| **Lookalike** | People similar to your best customers |

Broad targeting with strong creatives often works well because Meta's algorithm finds buyers, but sensible location and age limits still matter for local businesses.

### Creatives

The ad's image or video is the biggest factor in performance:
- Vertical video for Reels/Stories, square for feeds.
- Hook in the first seconds; show the product in use and the price; real customers and testimonials.
- Clear call to action button: "Send WhatsApp message", "Shop now", "Learn more".
- Test several creatives at once; turn off losers, keep winners.

**Boost post** is a simple option but gives less control than Ads Manager.

## TikTok and YouTube ads

- **TikTok Ads Manager**: in-feed video ads that look like native TikToks; Spark Ads boost organic posts (yours or creators'). Great for younger audiences and products that demo well.
- **YouTube**: skippable in-stream ads (pay when viewed for 30 s or interacted), in-feed ads, Shorts ads; good for tutorials, brand stories and remarketing.

## Budgets and testing

- Start small (e.g. a few hundred to a few thousand shillings a day depending on goals) and give campaigns **at least several days** to learn before judging.
- Test one variable at a time: creative, audience, headline or offer.
- Scale budgets gradually on winning ads (e.g. 20–30% increases).
- Know your numbers first: if your profit per sale is KSh 1,000, you can't pay KSh 1,500 per sale.

```try-python
spend = 15000          # KSh
impressions = 120000
clicks = 1800
sales = 30
revenue = 135000
profit_margin = 0.35   # 35% gross margin

ctr = clicks / impressions * 100
cpc = spend / clicks
conv_rate = sales / clicks * 100
cpa = spend / sales
roas = revenue / spend
profit = revenue * profit_margin - spend

print(f"CTR {ctr:.2f}% | CPC KSh {cpc:.1f} | Conversion rate {conv_rate:.2f}%")
print(f"CPA KSh {cpa:.0f} | ROAS {roas:.1f}x | Profit after ads KSh {profit:,.0f}")
print("Break-even ROAS for this margin:", round(1 / profit_margin, 2))
```

ROAS of 9x with a 35% margin is profitable; the break-even ROAS here is about 2.9x.

## Landing pages that convert

Sending ad clicks to a cluttered home page wastes money. A good landing page:
- Matches the ad's promise (same product, price and offer).
- Loads fast on mobile.
- Has one clear goal: WhatsApp button, call button, order form or booking.
- Shows price, benefits, photos/video, reviews, delivery and payment info (M-Pesa), guarantee.
- Removes distractions (minimal navigation).

## Tracking and analytics

### UTM parameters

Add tags to links so analytics shows where visits came from:

```
https://shop.example.co.ke/office-chairs?utm_source=facebook&utm_medium=paid_social&utm_campaign=sept_chairs&utm_content=video_a
```

| Tag | Meaning |
|---|---|
| `utm_source` | Platform: google, facebook, tiktok, newsletter |
| `utm_medium` | Type: cpc, paid_social, email, organic_social |
| `utm_campaign` | Campaign name |
| `utm_content` | Which ad/creative |

### Conversion tracking

- **Google Ads conversion tracking** and **Google Analytics 4** (GA4) events: form submissions, WhatsApp clicks, calls, purchases.
- **Meta Pixel** and Conversions API; **TikTok Pixel**.
- For WhatsApp and phone sales, ask "How did you hear about us?", use unique offer codes, and record leads in a simple sheet or CRM.
- Follow privacy laws: show a cookie/privacy notice and don't upload customer data without consent.

## Key metrics

| Metric | Formula | Tells you |
|---|---|---|
| **CTR** | Clicks ÷ impressions | Is the ad attractive and relevant? |
| **CPC** | Spend ÷ clicks | Cost of traffic |
| **Conversion rate** | Conversions ÷ clicks | Is the landing page/offer convincing? |
| **CPA / CPL** | Spend ÷ conversions (or leads) | Cost to win a customer/lead |
| **ROAS** | Revenue ÷ ad spend | Revenue per shilling spent |
| **CPM** | Cost per 1,000 impressions | Cost of reach |

Diagnose: low CTR → improve creative/targeting; high CTR but low conversions → fix the landing page, offer or follow-up speed; good CPA → scale.

## Common mistakes

| Mistake | Fix |
|---|---|
| No conversion tracking | Set up before spending |
| Targeting all of Kenya when you deliver only in Nairobi | Set locations correctly |
| No negative keywords | Review search terms weekly and add negatives |
| One ad creative | Test 3–5 |
| Judging after one day | Give campaigns time to learn |
| Slow replies to WhatsApp leads | Reply within minutes; leads go cold fast |
| Copying competitors' prices without knowing margins | Calculate break-even CPA/ROAS |

:::think A clinic spends KSh 20,000 on Facebook ads and gets 400 WhatsApp messages but only 6 bookings. Where is the problem likely, and what would you change?
The ad attracts attention (cheap messages), so the problem is likely after the click: slow or unclear replies, no prices or booking steps, the wrong audience (people outside the area or just curious), or an offer that attracts low-intent clicks. Improve response speed with saved replies and a booking link, qualify leads (location, service), refine targeting, adjust the ad to state the price/location clearly, and track bookings per ad.
:::

## Summary

- Use ads when you have a clear offer, known margins, good follow-up and tracking.
- Search ads capture active demand (keywords, match types, negatives, extensions); social ads create demand with strong creatives and audiences.
- Meta Click-to-WhatsApp, TikTok and YouTube ads suit many Kenyan businesses; test creatives and scale winners gradually.
- Send traffic to fast, focused landing pages; track with UTM tags, pixels, GA4 and lead records.
- Measure CTR, CPC, conversion rate, CPA and ROAS against break-even numbers; optimise weekly and avoid common mistakes.

```quiz
Q: Which ad platform shows ads when people are actively searching?
A: Google Ads | google
Q: You spent KSh 2,000 and got 4 sales. What is the cost per acquisition (KSh)?
A: 500
Q: 1,000 people saw an ad and 20 clicked. What is the CTR (%)?
A: 2 | 2%
Q: What are the tags added to links to track where clicks came from? (4 letters)
A: UTM | utm parameters
Q: Revenue KSh 50,000 from KSh 10,000 ad spend. What is the ROAS?
A: 5 | 5x
Q: Which keyword type stops your ad showing for unwanted searches?
A: negative | negative keywords | negative keyword
```
