---
slug: landing-page-anatomy
title: "Anatomy of a landing page that sells: every section explained, copywriting, trust, speed and testing"
after: KEEP
---
# Anatomy of a landing page that sells: every section explained, copywriting, trust, speed and testing

A **landing page** is a page built for **one goal**: get a quote request, a booking, a sign-up, a WhatsApp message or a sale. It's where ads, social media posts and email campaigns send people. Good landing pages often convert several times better than sending visitors to a general home page, because every element supports the same decision. This unit dissects a high-converting landing page section by section, shows how to write each part, and how to measure and improve results.

:::note What you will learn
- Landing pages vs home pages
- The hero section: headline, subheadline, CTA, image
- Problem and solution, benefits and features
- Social proof: testimonials, reviews, logos, numbers
- Offer, pricing and guarantees
- How it works, FAQs and objection handling
- Final CTA, contact options and footer
- Message match with ads
- Mobile, speed and tracking
- A/B testing and conversion rate optimisation
:::

## Landing page vs home page

| Home page | Landing page |
|---|---|
| Many goals and links (services, about, blog, contact) | One goal, minimal navigation |
| For all visitors | For a specific audience/campaign |
| General message | Specific offer matching the ad |

## The sections (top to bottom)

### 1. Hero (above the fold)

The first screen must answer in a few seconds: **What is this? Is it for me? What do I do next?**

- **Headline**: the main benefit or outcome. "Get a professional website for your business in 7 days."
- **Subheadline**: who it's for and how. "Mobile-friendly websites with M-Pesa payments and WhatsApp chat, built for Kenyan small businesses."
- **Primary CTA button**: "Get a free quote".
- **Supporting visual**: real product/work in use (a phone showing a client's site), not generic stock.
- **Trust snippet**: "Rated 4.9★ by 120+ clients", "Replies within 1 hour".

### 2. Problem

Show you understand the visitor's pain: "Customers can't find you on Google? Your Facebook page isn't bringing sales? Competitors look more professional?"

### 3. Solution and benefits

Present your offer as the solution and focus on **benefits** (outcomes), backed by features:

| Benefit | Feature (proof) |
|---|---|
| Get found on Google | SEO setup and Google Business Profile |
| Get paid instantly | M-Pesa STK push checkout |
| Never miss enquiries | WhatsApp button and contact forms to your phone |

Use 3–6 benefit cards with icons.

### 4. Social proof

People trust other customers more than your claims:
- Testimonials with **names, photos, business and specific results** ("Bookings doubled in two months – Achieng, salon owner, Kisumu").
- Google review ratings and counts.
- Client logos, case studies, before/after screenshots.
- Numbers: "300+ websites built", "10 years experience".

Only use real testimonials, with permission.

### 5. How it works

Reduce uncertainty with 3–4 simple steps:
1. Tell us about your business (5-minute form)
2. Get a design preview in 3 days
3. Review and request changes
4. Go live and start getting customers

### 6. Offer and pricing

- Show prices or "from" prices where possible (Kenyan buyers appreciate transparency).
- Packages with a **recommended** option highlighted.
- What's included, delivery time, payment options (M-Pesa, instalments, deposit).
- Optional urgency only if genuine ("5 slots left this month" must be true).

### 7. Risk reversal

Guarantees reduce fear: "Free revisions until you're happy", "Money-back if we miss the deadline", "Cancel anytime".

### 8. FAQs and objections

Answer what stops people buying: price, time, process, support, ownership, payment safety. FAQs also help SEO.

### 9. Final CTA

Repeat the main call to action with a short summary: "Ready to grow your business online? Get your free quote today." Add alternatives: WhatsApp button, phone number.

### 10. Minimal footer

Contact details, privacy policy, terms; avoid many navigation links that lead away.

## A complete example

```try-html
<style>
  .lp { font-family: system-ui; color: #0f172a; line-height: 1.6; max-width: 760px; }
  .hero { background: #0b1b35; color: #fff; padding: 28px; border-radius: 16px; }
  .hero h1 { margin: 0 0 8px; font-size: clamp(24px, 5vw, 36px); line-height: 1.15; }
  .hero p { color: #cbd5e1; margin: 0 0 18px; }
  .cta { display: inline-block; background: #ffb800; color: #0b1b35; font-weight: 800; padding: 12px 22px; border-radius: 999px; text-decoration: none; }
  .trust { font-size: 14px; color: #fde68a; margin-top: 10px; }
  .benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 18px 0; }
  .benefits div { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
  blockquote { margin: 0; padding: 14px; border-left: 4px solid #ffb800; background: #fffbeb; border-radius: 8px; }
</style>
<div class="lp">
  <section class="hero">
    <h1>Get a professional website for your business in 7 days</h1>
    <p>Mobile-friendly websites with M-Pesa payments and WhatsApp chat, built for Kenyan small businesses.</p>
    <a class="cta" href="#">Get a free quote</a>
    <p class="trust">★★★★★ 4.9 from 120+ clients · Replies within 1 hour</p>
  </section>
  <section class="benefits">
    <div><strong>Get found on Google</strong><br>SEO and Google Business Profile setup.</div>
    <div><strong>Get paid instantly</strong><br>M-Pesa checkout built in.</div>
    <div><strong>Never miss a lead</strong><br>WhatsApp chat on every page.</div>
  </section>
  <blockquote>"Our bookings doubled in two months." – Achieng, salon owner, Kisumu</blockquote>
  <p style="margin-top:18px"><a class="cta" href="#">Start my website</a></p>
</div>
```

## Message match

The landing page must match the ad or post that brought the visitor: same offer, wording, price and visuals. If an ad says "Websites from KSh 25,000" and the page doesn't mention that price, visitors feel misled and leave.

## Mobile, speed and tracking

- Design for phones first: short sections, large buttons, sticky WhatsApp/Call bar.
- Load in under about 2–3 seconds on 4G: compress images, minimal scripts.
- Track conversions: form submissions, WhatsApp clicks, calls (GA4 events, ad platform pixels), and use UTM tags on links pointing to the page.

## A/B testing and optimisation

**Conversion rate** = conversions ÷ visitors × 100.

Test one change at a time (headline, hero image, CTA text, form length, price display) and compare results with enough traffic to be meaningful:

```try-javascript
const a = { visitors: 1200, conversions: 36 };   // original headline
const b = { visitors: 1180, conversions: 59 };   // new headline
const rate = v => (v.conversions / v.visitors * 100).toFixed(2);
console.log("A:", rate(a) + "%", "B:", rate(b) + "%");
const lift = ((b.conversions / b.visitors) / (a.conversions / a.visitors) - 1) * 100;
console.log("Lift of B over A:", lift.toFixed(0) + "%");
```

With small numbers (e.g. 5 vs 8 conversions), differences may just be chance: gather more data before deciding. Tools: Google Optimize was retired, but A/B testing is available in platforms like VWO, Optimizely, or by splitting ad traffic between two page versions.

Other improvement ideas: heatmaps and session recordings (e.g. Microsoft Clarity, free) to see where people click and drop off.

:::think A landing page for a driving school has a slider with 5 rotating images, a full site menu, no prices, testimonials without names, and the "Enrol now" button only at the bottom. How would you redesign it?
Replace the slider with one clear hero: headline (e.g. "Get your driving licence in 6 weeks in Nakuru"), subheadline, "Enrol now"/"WhatsApp us" button and a real photo. Remove the full menu, add prices/packages with what's included and payment options, real named testimonials with photos and pass rates, a "How it works" section, FAQs, and repeat the CTA after key sections plus a sticky mobile WhatsApp button. Track enrolments and test headlines.
:::

## Summary

- A landing page has one goal and matches the campaign that sends visitors to it.
- Structure: hero (headline, subheadline, CTA, visual, trust), problem, solution/benefits, social proof, how it works, offer/pricing, guarantees, FAQs, final CTA, minimal footer.
- Focus on benefits backed by features, real testimonials and transparent prices.
- Design mobile-first, load fast and track conversions with events and UTM tags.
- Improve with A/B tests, one change at a time, and enough traffic before deciding.

```quiz
Q: How many main goals should a landing page have?
A: 1 | one
Q: What is the first section at the top of a landing page called?
A: hero | hero section
Q: 2,000 visitors and 60 enquiries. What is the conversion rate (%)?
A: 3 | 3%
Q: What do you call a guarantee that reduces the buyer's fear? (two words)
A: risk reversal
Q: Should a landing page include the full website navigation menu? (yes/no)
A: no
```

=== exercise ===
Build a hero section: an `<h1>`, a paragraph and a link with the text **Get a free quote**.
=== starter ===
<section class="hero">
  
</section>
=== expected ===

=== must_contain ===
<h1
<p
<a
Get a free quote
