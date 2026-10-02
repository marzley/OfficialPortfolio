---
slug: seo-accessibility
title: "SEO and accessibility in HTML: be found on Google and usable by everyone"
after: KEEP
---
# SEO and accessibility in HTML: be found on Google and usable by everyone

A beautiful website is useless if nobody finds it, or if some visitors can't use it. **SEO** (Search Engine Optimisation) helps your pages appear when people search on Google. **Accessibility** makes sure everyone, including people with disabilities, slow phones or poor connections, can use your site. Both start with good HTML, and they overlap a lot: what helps a blind user understand your page usually helps Google understand it too.

:::note What you will learn
- How search engines find, read and rank pages, and what HTML controls
- The `<head>` tags that matter: title, meta description, canonical, robots, Open Graph
- Writing titles and descriptions that get clicks
- Structured data (JSON-LD) for businesses and articles
- What accessibility is, who benefits and the laws and guidelines (WCAG)
- An HTML accessibility checklist you can apply to any page
- Free tools to test SEO and accessibility
:::

## Part 1: SEO

### How Google works, in three steps

1. **Crawling:** Google's robot (Googlebot) visits pages by following links and reading sitemaps.
2. **Indexing:** it reads the HTML: title, headings, text, links, images and structured data, and stores what each page is about.
3. **Ranking:** when someone searches, Google picks the most relevant, trustworthy and useful pages, using hundreds of signals (content quality, links from other sites, page speed, mobile-friendliness, location for local searches, and more).

HTML can't guarantee first place, but bad HTML can stop a page from being found or understood at all. Nobody can honestly promise "number one on Google"; good HTML, useful content, real reviews and links from other sites over time is what works.

:::define SEO
Improving a website so that search engines can find, understand and recommend its pages for relevant searches, bringing free ("organic") visitors.
:::

### Why SEO matters for Kenyan businesses

Most people now search before buying: "bakery near me", "best hospital in Eldoret", "website developer Nairobi". A business that appears on the first page gets calls and WhatsApp messages without paying for every click. That's why businesses pay for SEO services, and why SEO skills earn money for freelancers.

### The head tags that matter

```
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fresh Juice Delivery in Nairobi | Juicy Ke</title>
  <meta name="description" content="Order fresh juice in Nairobi, delivered in 45 minutes. Pay with M-Pesa. 20+ flavours, no added sugar.">
  <link rel="canonical" href="https://juicy.co.ke/">
  <meta property="og:title" content="Juicy Ke: fresh juice delivered in Nairobi">
  <meta property="og:description" content="Delivered in 45 minutes. Pay with M-Pesa.">
  <meta property="og:image" content="https://juicy.co.ke/share.jpg">
  <meta property="og:url" content="https://juicy.co.ke/">
  <meta name="twitter:card" content="summary_large_image">
</head>
```

| Tag | What it does |
|---|---|
| `<title>` | The clickable blue headline in Google and the browser tab. The most important on-page SEO tag. |
| `meta description` | The grey text under the title in results (Google may rewrite it). Doesn't directly raise rankings but strongly affects clicks. |
| `canonical` | Tells Google the main address of the page, so duplicates (with `?utm=...` etc.) don't compete. |
| `og:*` (Open Graph) | Controls the preview card when the link is shared on WhatsApp, Facebook, LinkedIn and X. |
| `viewport` | Mobile-friendliness: Google ranks mainly by the mobile version of pages. |
| `lang` on `<html>` | Language of the page. |

### Writing great titles

- **Unique** for every page.
- **About 50–60 characters** so it isn't cut off.
- **Main keyword first**, then the brand: `Website Design in Nakuru | Marzley Tech`.
- **Match what people search** ("plumber in Thika", not "Hydraulic solutions provider").
- Don't stuff keywords: `Plumber Thika plumber best plumber Thika cheap plumber` looks spammy and hurts trust.

### Writing great descriptions

- **About 150–160 characters**, unique per page.
- Say **what**, **where** and **why choose you**, plus a call to action: "Same-day phone screen repairs in Kisumu. 3-month warranty, original parts. Call or WhatsApp 0712 345 678."

:::think Two pages on your site have the same title: "Home | Juma Electronics". What problems does this cause?
Google can't tell which page answers which search, so they compete with each other, and users see identical results without knowing which to click. Each page should have a unique, descriptive title, e.g. "Laptop Repairs in Kisumu | Juma Electronics" and "Buy Refurbished Laptops in Kisumu | Juma Electronics".
:::

### On-page HTML that helps SEO

- **One clear `<h1>`** with the main topic; logical `<h2>`/`<h3>`.
- **Useful text content.** Google reads text; a page that is only images says almost nothing.
- **Descriptive link text** ("our web hosting plans").
- **`alt` text** on images (helps Google Images).
- **Semantic structure** (`<main>`, `<article>`, `<nav>`).
- **Fast pages:** small images, `loading="lazy"`, little unnecessary code.
- **Clean URLs:** `/services/web-design`, not `/page.php?id=37`.
- **Internal links** between related pages.

### Structured data (JSON-LD)

Structured data describes your content in a format machines understand, using the **schema.org** vocabulary. It can make Google show extra details (stars on reviews, events, FAQs, business information). It goes in a `<script type="application/ld+json">` tag:

```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Juicy Ke",
  "telephone": "+254712345678",
  "url": "https://juicy.co.ke",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Ngong Road",
    "addressLocality": "Nairobi",
    "addressCountry": "KE"
  },
  "openingHours": "Mo-Sa 08:00-20:00"
}
</script>
```

Only describe what's really on the page and true. Test with Google's **Rich Results Test**.

### Sitemaps and robots

- **sitemap.xml** lists your pages so Google finds them all. Submit it in **Google Search Console** (free), which also shows which searches bring visitors and any problems.
- **robots.txt** tells crawlers what not to crawl.
- `<meta name="robots" content="noindex">` keeps a page (e.g. a thank-you page or admin area) out of search results.

## Part 2: Accessibility

### What is web accessibility?

:::define Accessibility (a11y)
Designing and building websites so that **people with disabilities can perceive, understand, navigate and interact** with them. ("a11y" is short for "accessibility": a, 11 letters, y.)
:::

### Who benefits?

- **Blind and low-vision users** (screen readers, screen magnifiers, high contrast).
- **Deaf and hard-of-hearing users** (captions, transcripts).
- **People with motor disabilities** who use only a keyboard, switches or voice control.
- **People with cognitive or learning disabilities** (clear language, consistent layout).
- **Everyone in temporary or situational limits:** a broken arm, bright sunlight on a phone screen, a noisy matatu, a slow network, an old phone, older people with weaker sight.

The World Health Organization estimates that about 1.3 billion people, roughly 1 in 6 people worldwide, live with a significant disability. Accessible design is a big audience, not a small extra.

### Laws and guidelines

- **WCAG** (Web Content Accessibility Guidelines) from the W3C is the international standard, organised around four principles: **Perceivable, Operable, Understandable, Robust (POUR)**. Most organisations aim for level **AA**.
- **Kenya:** the Constitution (Article 54) protects the rights of persons with disabilities, and the **Persons with Disabilities Act** supports access to information. Government and large organisations increasingly ask for accessible websites; international clients often require WCAG AA.

### How screen readers use HTML

A screen reader (NVDA and JAWS on Windows, VoiceOver on Apple devices, TalkBack on Android) reads the page aloud and lets users jump by **headings**, **landmarks**, **links** and **form fields**. It depends completely on the HTML: it reads `alt` text for images, labels for inputs, and the names of buttons and links.

### The HTML accessibility checklist

1. **`lang`** on `<html>`: `<html lang="en">`.
2. **Unique, descriptive `<title>`** on every page.
3. **Headings in order:** one `<h1>`, then `<h2>`, `<h3>` without skipping.
4. **Landmarks:** `<header>`, `<nav>`, `<main>`, `<footer>`.
5. **`alt` text** on meaningful images; `alt=""` on decorative ones.
6. **Labels** on every form field; group radios/checkboxes with `<fieldset>`/`<legend>`.
7. **Links that make sense alone**; buttons for actions, links for navigation.
8. **Keyboard access:** everything usable with Tab, Enter and Space; visible focus outlines (never remove them without a replacement).
9. **Colour contrast:** text at least **4.5:1** against its background (3:1 for large text).
10. **Don't use colour alone** to show meaning (add text or icons to red error fields).
11. **Captions and transcripts** for media.
12. **Clear error messages** connected to their fields.
13. **Zoom:** never block zooming in the viewport tag (`user-scalable=no` is bad).
14. **Tables:** `<th>`, `scope` and `<caption>` for data tables.

### Buttons vs links

| Use | Element |
|---|---|
| Goes to another page or section | `<a href="...">` |
| Does something on this page (open a menu, submit, add to cart) | `<button>` |

A `<div onclick="...">` "button" can't be reached with the keyboard and isn't announced as a button. Use real `<button>` elements.

```try-html
<html lang="en">
<body>
  <a href="#main">Skip to main content</a>
  <header><nav aria-label="Main"><a href="#">Home</a> · <a href="#">Shop</a></nav></header>
  <main id="main">
    <h1>Order school uniforms online</h1>
    <img src="https://picsum.photos/300/160" alt="Green school sweater with a white collar" width="300" height="160">
    <form>
      <label for="size">Size</label>
      <select id="size" name="size"><option>Age 6–8</option><option>Age 9–11</option></select>
      <button type="submit">Add to cart</button>
    </form>
    <p><a href="#">Download the uniform price list (PDF, 120 KB)</a></p>
  </main>
</body>
</html>
```

### A little ARIA (and the first rule of ARIA)

**ARIA** attributes add accessibility information when HTML alone can't (e.g. `aria-label="Main"` on a `<nav>`, `aria-expanded` on a menu button). The **first rule of ARIA**: if a native HTML element does the job (`<button>`, `<nav>`, `<label>`), use it instead of ARIA. Wrong ARIA is worse than none.

## Testing tools (all free)

| Tool | Checks |
|---|---|
| **Google Search Console** | Indexing, search queries, mobile usability, sitemaps |
| **PageSpeed Insights / Lighthouse** (in Chrome DevTools) | Speed, SEO basics, accessibility basics |
| **Rich Results Test** | Structured data |
| **W3C Validator** | HTML errors |
| **WAVE** (wave.webaim.org) | Accessibility problems shown on the page |
| **Keyboard test** | Unplug the mouse: can you use everything with Tab? |
| **Screen reader test** | NVDA (Windows, free), VoiceOver (Mac/iPhone), TalkBack (Android) |

## Common mistakes

| Mistake | Fix |
|---|---|
| Same title on every page | Unique titles with keyword + brand |
| No meta description | Write one per page |
| Text inside images only | Real HTML text |
| Missing `alt` | Add descriptive `alt` |
| Low-contrast grey text | Darken it (4.5:1) |
| Removing focus outlines | Style them instead |
| `user-scalable=no` | Allow zoom |
| `<div>` buttons | `<button>` |
| Keyword stuffing | Write naturally for humans |

## Practice tasks

1. Write the `<head>` for a bakery in Eldoret: title, description, canonical, Open Graph tags.
2. Write LocalBusiness JSON-LD for the same bakery.
3. Run Lighthouse on a page you built (Chrome DevTools → Lighthouse) and fix two issues.
4. Test a page using only your keyboard and list any problems.
5. Run WAVE on a big Kenyan website and note three accessibility issues.

## Summary

- Google crawls, indexes and ranks pages; HTML controls titles, descriptions, structure, text, links and structured data.
- Write unique, descriptive titles (about 50–60 characters) and descriptions (about 150–160).
- Use canonical URLs, Open Graph tags, sitemaps, Search Console and JSON-LD.
- Accessibility serves people with disabilities and everyone in difficult situations; follow WCAG (POUR, level AA).
- Use `lang`, headings, landmarks, `alt`, labels, real buttons, keyboard access, contrast and captions.
- Test with Lighthouse, WAVE, the validator, the keyboard and a screen reader.

```quiz
Q: What does SEO stand for?
A: Search Engine Optimisation | search engine optimization | Search Engine Optimization
Q: Which head tag is the clickable headline in Google results?
A: title | <title>
Q: Which link rel value tells Google the main address of a page?
A: canonical
Q: Which tags control the preview when a link is shared on WhatsApp? Write the prefix.
A: og | og: | Open Graph
Q: What vocabulary does structured data use? Write the website name.
A: schema.org | schema
Q: What minimum contrast ratio should normal text have? Write it like 4.5:1.
A: 4.5:1 | 4.5
Q: What do the letters POUR stand for? Write the first word.
A: Perceivable
Q: For an action like "Add to cart", should you use a link or a button?
A: button | <button>
Q: Which free Google tool shows which searches bring visitors to your site?
A: Search Console | Google Search Console
```
