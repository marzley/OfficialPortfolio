---
slug: seo-basics
title: "SEO: how Google ranks websites, technical SEO, on-page SEO, content, backlinks and local SEO in Kenya"
after: KEEP
---
# SEO: how Google ranks websites, technical SEO, on-page SEO, content, backlinks and local SEO in Kenya

**SEO (search engine optimisation)** is the work of making your website appear higher in Google (and Bing) when people search for what you offer: "plumber in Kilimani", "best laptops for students Kenya", "how to register a business name in Kenya". Visitors from search are valuable because they're **actively looking**; unlike ads, you don't pay per click. SEO takes time (often months) and there are no guaranteed #1 rankings, but steady, honest work brings compounding results. This unit explains how search engines work and the main areas of SEO, with practical steps for Kenyan businesses and websites.

:::note What you will learn
- How Google crawls, indexes and ranks pages
- Search intent and why it matters
- The pillars: technical SEO, on-page SEO, content, off-page (links), local SEO
- Titles, meta descriptions, headings, URLs, images and internal links
- Sitemaps, robots.txt, canonical tags, structured data
- Speed, mobile-friendliness and Core Web Vitals
- E-E-A-T and helpful content
- Backlinks: earning them, avoiding spam
- Google Search Console and measuring results
- Mistakes and scams to avoid
:::

## How search engines work

1. **Crawling**: Googlebot discovers pages by following links and reading sitemaps.
2. **Indexing**: Google analyses each page (text, images, structure) and stores it in its index. Pages not indexed can't rank.
3. **Ranking**: For each search, Google's algorithms choose and order the most relevant, helpful, trustworthy results, using hundreds of signals: relevance to the query, content quality, usability (mobile, speed, HTTPS), links from other sites, location (for local searches) and more.

Increasingly, results include **AI overviews**, maps, images, videos and "People also ask" boxes, so useful, clearly structured content matters even more.

## Search intent

Every search has a purpose:

| Intent | Example search | What to create |
|---|---|---|
| **Informational** | "how to start poultry farming in Kenya" | Guides, how-tos, videos |
| **Commercial investigation** | "best web hosting Kenya" | Comparisons, reviews |
| **Transactional** | "buy solar panel 300W Nairobi" | Product/service pages with prices and clear buying steps |
| **Navigational** | "KRA iTax login" | The official page |
| **Local** | "dentist near me", "salon in Westlands" | Google Business Profile, location pages |

Match the page type to the intent: a long guide won't rank for "buy" searches, and a product page won't rank for "how to".

## Pillar 1: Technical SEO

Make sure Google can crawl, index and understand your site:

| Item | What to do |
|---|---|
| **HTTPS** | Secure the whole site |
| **Mobile-friendly** | Responsive design; most Kenyan users browse on phones |
| **Speed / Core Web Vitals** | Fast loading (LCP), stable layout (CLS), responsive interactions (INP) |
| **XML sitemap** | `sitemap.xml` listing important pages, submitted in Search Console |
| **robots.txt** | Don't accidentally block important pages or CSS/JS |
| **Clean URLs** | `/services/website-design` not `/page.php?id=17&x=2` |
| **Canonical tags** | `<link rel="canonical">` tells Google the main version of duplicate pages |
| **No broken links** | Fix 404s; use 301 redirects when pages move |
| **Structured data** | Schema.org markup (LocalBusiness, Product, Article, FAQ) helps rich results |
| **One version of the site** | Redirect http→https and www/non-www to one |

## Pillar 2: On-page SEO

Each important page should target one main topic/keyword (the keyword research lesson shows how to find them).

| Element | Best practice | Example |
|---|---|---|
| **Title tag** | Unique, ~50–60 characters, main keyword near the start, brand at the end | `Website Design in Nairobi – Fast, Mobile-Friendly Sites | Marzley` |
| **Meta description** | ~150–160 characters, a persuasive summary (not a ranking factor, but affects clicks) | "Professional websites for Kenyan businesses with M-Pesa payments, SEO and support. Get a free quote today." |
| **H1 heading** | One per page, describes the topic | `Website design for Nairobi businesses` |
| **Subheadings (H2, H3)** | Organise content; include related terms naturally | "How much does a website cost in Kenya?" |
| **URL** | Short, readable, hyphens | `/website-design-nairobi` |
| **Content** | Answers the searcher's questions completely; natural use of keywords and synonyms | — |
| **Images** | Compressed, descriptive file names, **alt text** | `alt="Responsive website on a phone for a Nakuru hotel"` |
| **Internal links** | Link related pages with descriptive anchor text | "see our **website maintenance plans**" |
| **Calls to action** | Phone, WhatsApp, quote form | — |

```try-python
def audit(title, description, h1_count, has_alt_text):
    issues = []
    if not 30 <= len(title) <= 60:
        issues.append(f"Title length {len(title)} (aim for about 30–60)")
    if not 70 <= len(description) <= 160:
        issues.append(f"Description length {len(description)} (aim for about 70–160)")
    if h1_count != 1:
        issues.append(f"{h1_count} H1 headings (use exactly one)")
    if not has_alt_text:
        issues.append("Images missing alt text")
    return issues or ["Basic on-page checks passed"]

print(audit("Home", "Welcome", 0, False))
print(audit("Website Design in Nairobi – Mobile-Friendly Sites | Marzley",
            "Professional websites for Kenyan businesses with M-Pesa payments, SEO and support. Get a free quote today.",
            1, True))
```

## Pillar 3: Content

Google's guidance is to create **helpful, reliable, people-first content**. In practice:
- Answer real questions customers ask (pricing, process, comparisons, local information).
- Show **experience**: real photos, case studies, prices, local details, your own data.
- Keep it accurate and updated (dates, prices, laws).
- Cover topics thoroughly; group related articles into **topic clusters** linked to a main "pillar" page.
- Avoid thin, copied or mass-produced AI text with no added value.

### E-E-A-T

Google's quality raters look for **Experience, Expertise, Authoritativeness and Trustworthiness**, especially for "Your Money or Your Life" topics (health, finance, legal, safety). Show author names and credentials, contact details, physical address, reviews, clear policies and sources.

## Pillar 4: Off-page SEO (backlinks and mentions)

**Backlinks** (links from other sites to yours) act like votes of confidence, especially from relevant, reputable sites.

Ways to earn them honestly:
- Get listed in reputable Kenyan business directories and industry associations.
- Partners, suppliers and clients linking to you ("website by...", case studies).
- Local press, blogs and podcasts: share stories, data or expert comments.
- Create genuinely useful resources (guides, calculators, templates) others want to cite.
- Sponsor or participate in community events with online coverage.

Avoid **buying links** or joining link schemes: Google can ignore or penalise them.

## Pillar 5: Local SEO

For businesses serving a location ("near me" searches and map results):
- A complete, verified **Google Business Profile** (next lessons) with the right category, hours, photos and posts.
- Consistent **NAP** (Name, Address, Phone) across your website, profile and directories.
- **Reviews**: ask happy customers; reply to all reviews.
- Location pages for each area you genuinely serve (with unique content, not copy-paste).
- LocalBusiness structured data on your site.

## Measure with Google Search Console

Free and essential:
- **Performance**: queries people used, impressions, clicks, average position, click-through rate.
- **Indexing**: which pages are indexed and why others aren't.
- **Sitemaps**: submit and monitor.
- **Core Web Vitals and HTTPS** reports.
- **Manual actions and security issues** alerts.

Also use Google Analytics (traffic and conversions) and track enquiries/sales that came from organic search.

## How long does SEO take?

New sites often take **3–6+ months** to gain meaningful traffic; competitive keywords take longer. Local SEO for a Google Business Profile can show results sooner. Anyone promising "#1 on Google in a week" or "guaranteed rankings" is misleading you.

## Mistakes to avoid

| Mistake | Better |
|---|---|
| Keyword stuffing ("cheap website design Nairobi cheap website") | Write naturally for people |
| Same title on every page | Unique titles and descriptions |
| Copying content from other sites | Original, experience-based content |
| Blocking the site from Google (a leftover "noindex" or robots.txt from development) | Check after launch |
| Slow, heavy images | Compress and resize |
| Buying backlinks or fake reviews | Earn them honestly |
| Ignoring mobile users | Mobile-first design |

:::think A new Nairobi bakery website has a home page titled "Home", no text except a big slider, images 4 MB each, and no Google Business Profile. List the top five SEO fixes in priority order.
1) Create and verify a Google Business Profile with photos, hours and category, and start collecting reviews. 2) Write unique titles and descriptions (e.g. "Custom Birthday Cakes in Nairobi – Fresh Daily | Bakery Name"). 3) Add real text content: products, prices, ordering and delivery areas, with one H1 and helpful headings. 4) Compress and resize images and add alt text to speed up the mobile site. 5) Submit a sitemap in Search Console and add LocalBusiness structured data plus consistent NAP.
:::

## Summary

- Google crawls, indexes and ranks pages by relevance, quality, usability, links and location; match pages to search intent.
- Technical SEO: HTTPS, mobile, speed, sitemap, robots.txt, clean URLs, canonicals, redirects, structured data.
- On-page: unique titles and descriptions, one H1, clear headings, readable URLs, alt text, internal links, calls to action.
- Helpful, experience-rich content with E-E-A-T; earn genuine backlinks; build local SEO with Google Business Profile, NAP and reviews.
- Measure in Search Console and Analytics; expect months, avoid guarantees and spam tactics.

```quiz
Q: What does SEO stand for?
A: search engine optimisation | search engine optimization
Q: Links from other websites to yours are called?
A: backlinks
Q: Which file lists your pages for search engines?
A: sitemap.xml | sitemap
Q: Which HTML tag's text appears as the blue headline in Google results?
A: title | <title>
Q: What does the first E in E-E-A-T stand for?
A: Experience
Q: What does NAP stand for in local SEO? (three words)
A: name address phone | name, address, phone
```
