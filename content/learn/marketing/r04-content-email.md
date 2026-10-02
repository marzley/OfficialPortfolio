---
slug: content-email
title: "Content and email marketing: blogs, copywriting (AIDA, PAS), lead magnets, newsletters, automation and consent"
after: KEEP
---
# Content and email marketing: blogs, copywriting (AIDA, PAS), lead magnets, newsletters, automation and consent

**Content marketing** attracts customers by publishing useful information (articles, guides, videos, podcasts) that answers their questions and builds trust before they buy. **Email marketing** turns that attention into an audience you **own**: social media reach can drop overnight, but your email list stays yours. Together they bring steady leads at low cost and work for almost any business: a training institute, a SACCO, an online shop, a consultant or a software company.

:::note What you will learn
- Why content marketing works and how it connects to SEO
- Planning content around the customer journey
- Formats: blog posts, guides, videos, case studies, podcasts
- Copywriting formulas: AIDA, PAS, features vs benefits
- Writing headlines and calls to action
- Building an email list with lead magnets
- Choosing an email platform
- Newsletters, welcome sequences and automation
- Subject lines, design and deliverability
- Consent, unsubscribe and Kenya's Data Protection Act
- Metrics: open, click, conversion and list health
:::

## Why content marketing works

- People research before buying: they search, watch reviews and compare.
- Helpful content brings **search traffic** for months or years (see the SEO lessons).
- It shows **expertise** and builds trust, so prices are less of an objection.
- It gives you material for social media, emails and sales conversations.

## The customer journey

| Stage | Customer thinks | Content |
|---|---|---|
| **Awareness** | "I have a problem" | Educational guides, tips, videos ("Why your phone battery drains fast") |
| **Consideration** | "What are my options?" | Comparisons, buying guides, case studies, webinars ("Solar vs generator for a small shop") |
| **Decision** | "Who should I buy from?" | Pricing pages, testimonials, demos, FAQs, guarantees |
| **Loyalty** | "How do I get the most from this?" | Onboarding emails, tutorials, exclusive offers |

Plan content for every stage, not just "buy now" posts.

## Content formats

| Format | Strength |
|---|---|
| **Blog posts and guides** | Rank in Google; reusable; easy to share |
| **How-to videos** | Very popular; YouTube is the second-biggest search engine |
| **Case studies** | Real results convince buyers ("How a Kisumu school cut fee arrears by 40%") |
| **Checklists and templates** | Great lead magnets |
| **Webinars and lives** | Direct engagement, Q&A |
| **Podcasts** | Deep relationships with listeners |
| **Infographics** | Shareable visual summaries |

**Repurpose**: one guide becomes 5 social posts, a short video, an email and a carousel.

## Copywriting basics

### Features vs benefits

| Feature (what it is) | Benefit (what it does for the customer) |
|---|---|
| 300W solar panel | Run lights, TV and phone charging even during blackouts |
| Online booking system | Clients book while you sleep; fewer missed calls |
| 24/7 support | Problems fixed fast, so you don't lose sales |

Customers buy benefits. Mention features as proof.

### AIDA

1. **Attention**: a headline or opening that stops the scroll.
2. **Interest**: relevant facts or a story.
3. **Desire**: benefits, proof, how life improves.
4. **Action**: a clear next step.

### PAS

1. **Problem**: "Customers keep asking 'how much?' on WhatsApp and you lose sales at night."
2. **Agitate**: "Every unanswered message is a buyer going to a competitor."
3. **Solve**: "Our WhatsApp catalogue and auto-replies answer instantly, 24/7. Set up in a day."

### Headlines and calls to action

- Specific and useful: "7 Ways to Cut Your KPLC Bill This Month" beats "Energy Tips".
- Numbers, questions, "how to", local relevance ("in Kenya", "in Nairobi").
- One clear CTA per piece: "Download the free checklist", "Book a free consultation", "Order on WhatsApp".

```try-python
headline = "How to Start a Profitable Poultry Farm in Kenya with KSh 50,000"
checks = {
    "has a number": any(ch.isdigit() for ch in headline),
    "says 'how to' or a question": headline.lower().startswith("how to") or headline.endswith("?"),
    "mentions a place": any(w in headline for w in ["Kenya", "Nairobi", "Mombasa", "Kisumu"]),
    "length under 70": len(headline) <= 70,
}
for check, ok in checks.items():
    print(("✓" if ok else "✗"), check)
```

## Building an email list

People join a list when they get something valuable:

| Lead magnet | Example |
|---|---|
| Checklist | "Website launch checklist for small businesses" |
| Guide/e-book | "The complete guide to registering a business in Kenya" |
| Template | "Free Excel budget planner" |
| Mini-course | "5-day email course: Excel for office jobs" |
| Discount | "10% off your first order" |
| Webinar/training | "Free class: earn online as a virtual assistant" |

Put sign-up forms on your website (homepage, end of blog posts, pop-up with care), social bios, WhatsApp Status, and at physical events (with consent).

## Email platforms

Mailchimp, Brevo (formerly Sendinblue), MailerLite, Kit (ConvertKit) and others offer free tiers for small lists, with sign-up forms, templates, automation and reports. Don't send bulk marketing from your personal Gmail/Outlook: it hurts deliverability and lacks unsubscribe handling.

## Types of emails

| Type | Purpose |
|---|---|
| **Welcome sequence** (automated) | 3–5 emails after sign-up: deliver the lead magnet, introduce yourself, share best content, make an offer |
| **Newsletter** | Regular value: tips, news, offers (weekly/monthly) |
| **Promotional** | Launches, sales, events |
| **Transactional** | Order confirmations, receipts, password resets (usually sent by your website system) |
| **Re-engagement** | Win back inactive subscribers or clean them from the list |
| **Abandoned cart** (e-commerce) | Remind shoppers who left items in the cart |

Example welcome sequence:
1. Day 0: "Here's your free checklist" + what to expect.
2. Day 2: Your story and why you can help.
3. Day 4: Your most useful guide or a case study.
4. Day 6: Answer common objections (price, time, trust).
5. Day 8: An offer with a deadline.

## Subject lines, design and deliverability

- Subject lines: clear, specific, curiosity without clickbait; personalise when natural; keep to roughly 30–50 characters for phones.
- **Preheader** text: the preview line after the subject; use it.
- Design: mobile-first, one column, short paragraphs, one main button.
- Deliverability: authenticate your sending domain (**SPF, DKIM, DMARC**), send to people who opted in, remove bounces and long-inactive contacts, avoid spammy phrases and all-caps.

## Consent and the law

- Under Kenya's **Data Protection Act, 2019**, use personal data (like email addresses and phone numbers) lawfully, with **consent** for marketing, and only for the purposes you stated.
- Never buy email lists or add people without permission.
- Every marketing email must include a working **unsubscribe link** and your business identity/contact details.
- Keep subscriber data secure; honour requests to access, correct or delete data.
- Bulk SMS marketing also needs opt-in and an opt-out option (check the Communications Authority's current rules and your SMS provider's requirements).

## Metrics

| Metric | Meaning | Note |
|---|---|---|
| **Open rate** | % who opened | Less reliable now because some email apps pre-load emails (privacy features) |
| **Click-through rate (CTR)** | % who clicked a link | Better measure of interest |
| **Conversion rate** | % who did the goal (bought, booked) | The real measure |
| **Unsubscribe rate** | % who left | Spikes mean content/frequency mismatch |
| **Bounce rate** | Emails that couldn't be delivered | Clean your list |
| **Revenue per email/subscriber** | Value of the list | For e-commerce |

Test one thing at a time (A/B test subject lines, send times, CTAs) and keep what works.

:::think A training college has 2,000 past students' emails in a spreadsheet, collected for admissions. The marketing team wants to send them weekly promotions for new courses. What should they consider first?
Under the Data Protection Act, they need a lawful basis: the emails were collected for admissions, so they should seek consent (e.g. a one-time email asking people to opt in) or rely on clearly stated earlier consent. Use a proper email platform with unsubscribe links, send valuable content (not only promotions), authenticate the domain, and remove people who don't opt in or who unsubscribe.
:::

## Summary

- Content marketing attracts and educates customers across the journey (awareness, consideration, decision, loyalty) and powers SEO and social media.
- Write benefit-focused copy with AIDA or PAS, specific headlines and one clear call to action; repurpose content.
- Build an owned email list with lead magnets and sign-up forms; use an email marketing platform.
- Send welcome sequences, newsletters, promotions, re-engagement and abandoned-cart emails; design for mobile and authenticate your domain.
- Get consent, include unsubscribe links, protect data under the Data Protection Act, and track clicks, conversions and list health.

```quiz
Q: What does AIDA stand for? (four words)
A: attention interest desire action | attention, interest, desire, action
Q: What must every marketing email include so people can stop receiving them?
A: unsubscribe link | unsubscribe | an unsubscribe link
Q: Which Kenyan law requires consent to use people's personal data? (year)
A: 2019 | data protection act 2019
Q: What do you call a free resource offered in exchange for an email address? (two words)
A: lead magnet
Q: What does PAS stand for in copywriting? (three words)
A: problem agitate solve | problem, agitate, solve
Q: Should you buy email lists? (yes/no)
A: no
```
