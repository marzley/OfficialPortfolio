---
slug: head-meta
title: The head: title, meta tags, favicon and links
after: attributes-classes-ids
---
# The head: title, meta tags, favicon and links

Everything in `<body>` is what people see. Everything in `<head>` is information **about** the page, for the browser, for Google and for WhatsApp or Facebook when someone shares your link. A good head is the difference between a page that looks professional in search results and one that doesn't.

## A complete, modern head

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mama Njeri's Bakery | Fresh cakes in Thika</title>
  <meta name="description" content="Birthday and wedding cakes baked fresh in Thika. Order on WhatsApp and pay with M-Pesa.">
  <link rel="icon" href="favicon.png">
  <link rel="stylesheet" href="styles.css">
  <link rel="canonical" href="https://example.co.ke/">

  <meta property="og:title" content="Mama Njeri's Bakery">
  <meta property="og:description" content="Fresh cakes in Thika. Order on WhatsApp.">
  <meta property="og:image" content="https://example.co.ke/share.jpg">
</head>
<body>
  ...
</body>
</html>
```

Let's go through it line by line.

## charset and viewport (never skip these)

- `<meta charset="utf-8">` lets the page show every character correctly: Kiswahili, ©, €, emoji. Put it first.
- `<meta name="viewport" ...>` tells phones to use the real screen width. **Without it, your site looks tiny on phones** and Google marks it as not mobile friendly.

## title

The `<title>` shows on the browser tab, in bookmarks and as the **blue link in Google results**. Good titles:

- are unique for every page,
- are about 50–60 characters,
- put the most important words first: `Plumber in Nakuru | Otieno Plumbing` beats `Home`.

## meta description

The **description** is the grey text under your link in Google. It doesn't directly change your ranking, but a clear one gets more clicks. Aim for 120–160 characters and include what you offer and where.

## favicon

The small icon on the tab. Use a square PNG (at least 48×48) or an `.ico` file:

```html
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```

## Linking CSS and JavaScript

```html
<link rel="stylesheet" href="styles.css">
<script src="app.js" defer></script>
```

`defer` means "download now, run after the page is read", so your page appears faster.

## Share previews (Open Graph)

When a link is shared on WhatsApp, Facebook or LinkedIn, these tags decide the title, text and picture in the preview card:

| Tag | Purpose |
|---|---|
| `og:title` | Title in the preview |
| `og:description` | Short text |
| `og:image` | The picture (use a full `https://` address, 1200×630 px works well) |
| `og:url` | The page address |

## Try it: see what the head changes

Run this, then look at the result's title. Change the title text and run again.

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Kenyan Café</title>
  <style>body { font-family: sans-serif; }</style>
</head>
<body>
  <h1>Karibu to My Kenyan Café ☕</h1>
  <p>The title in the head is: <strong id="t"></strong></p>
  <script>document.getElementById("t").textContent = document.title;</script>
</body>
</html>
```

## The lang attribute

`<html lang="en">` tells browsers and screen readers the page language. For a Kiswahili page use `lang="sw"`. It helps pronunciation for screen readers and helps Google show the right page to the right people.

## Checklist for every page

1. `<!DOCTYPE html>` and `<html lang="...">`
2. `charset` then `viewport`
3. A unique `<title>` and `description`
4. Favicon
5. Share tags (`og:`) for pages people will share

## Why the head matters

Visitors never see the `<head>`, but it controls things that decide whether your site succeeds: how it looks in Google results, how links appear when shared on WhatsApp, Facebook or LinkedIn, whether it displays correctly on phones, how fast it loads, and the icon on the browser tab or phone home screen. Business owners judge a site partly by these details ("why does my link show no picture on WhatsApp?"), so web designers must get them right on every page.

## Search engine tags in detail

```html
<title>Web Design in Nakuru | Affordable Business Websites | Duka Digital</title>
<meta name="description" content="Mobile-friendly websites for Nakuru businesses from KSh 15,000. M-Pesa payments, hosting and SEO included. Get a free quote today.">
<link rel="canonical" href="https://www.example.co.ke/web-design-nakuru/">
<meta name="robots" content="index, follow">
```

| Tag | Purpose | Tips |
|---|---|---|
| `<title>` | Blue link in search results, browser tab text | About 50 to 60 characters; main keyword first; unique per page |
| `meta description` | The grey snippet under the link (Google may rewrite it) | About 150 characters; a reason to click; unique per page |
| `canonical` | Tells search engines the preferred URL when the same content has several URLs | Use the full https URL |
| `robots` | `noindex` keeps a page out of search results | Use for login, thank-you and admin pages |

There's no "keywords" meta tag that helps: Google ignores it. Write titles and descriptions for **people**; a clear, honest snippet earns more clicks.

## Social share previews in full

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Web Design in Nakuru | Duka Digital">
<meta property="og:description" content="Mobile-friendly websites with M-Pesa payments.">
<meta property="og:image" content="https://www.example.co.ke/img/og-web-design.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://www.example.co.ke/web-design-nakuru/">
<meta property="og:site_name" content="Duka Digital">
<meta name="twitter:card" content="summary_large_image">
```

- The share image should be **1200 × 630 pixels**, under about 300 KB, with large readable text.
- Use **absolute URLs** (starting with `https://`); relative paths often fail in previews.
- WhatsApp and Facebook cache previews. After changing them, use Facebook's Sharing Debugger to refresh, and test by sharing in a WhatsApp chat with yourself.

## Icons for every device

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">   <!-- 180 × 180 -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0b1b35">
```

`theme-color` colours the browser's address bar on Android. The manifest file lets visitors "install" the site to their home screen as a Progressive Web App.

## Performance hints

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/fonts/inter-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/img/hero.webp" as="image" fetchpriority="high">
<link rel="stylesheet" href="/css/styles.css">
<script src="/js/app.js" defer></script>
<script src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" async></script>
```

| Hint | Meaning |
|---|---|
| `preconnect` | Open the connection to another server early |
| `preload` | Download a critical file (hero image, main font) immediately |
| `defer` | Download in parallel, run after the HTML is parsed, in order |
| `async` | Download in parallel, run as soon as ready (order not guaranteed): good for analytics |
| `type="module"` | ES modules; deferred automatically |

Put CSS in the head (so the page doesn't flash unstyled) and scripts with `defer`, so they don't block the page from appearing.

## Structured data (rich results)

Structured data in JSON-LD tells search engines facts about your business, products, articles, FAQs or events:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Duka Digital",
  "url": "https://www.example.co.ke/",
  "telephone": "+254700000000",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nakuru",
    "addressCountry": "KE"
  },
  "openingHours": "Mo-Sa 08:00-18:00"
}
</script>
```

Test it with Google's Rich Results Test. Only describe what's truly on the page; misleading structured data can be ignored or penalised.

## Security and privacy-related head tags

```html
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' https:">
```

A Content-Security-Policy restricts where scripts, images and styles may load from, which reduces the damage from cross-site scripting. It is usually best set as a server header (for example in `.htaccess`) rather than a meta tag.

## Multilingual pages

```html
<html lang="en">
<link rel="alternate" hreflang="en" href="https://www.example.co.ke/en/">
<link rel="alternate" hreflang="sw" href="https://www.example.co.ke/sw/">
<link rel="alternate" hreflang="x-default" href="https://www.example.co.ke/">
```

`hreflang` tells search engines which language version to show to which users.

## A head template you can reuse

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page topic | Brand</title>
  <meta name="description" content="One or two sentences that make people want to click.">
  <link rel="canonical" href="https://www.example.co.ke/page/">
  <meta property="og:title" content="Page topic | Brand">
  <meta property="og:description" content="Short description for social shares.">
  <meta property="og:image" content="https://www.example.co.ke/img/og-page.jpg">
  <meta property="og:url" content="https://www.example.co.ke/page/">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#0b1b35">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/app.js" defer></script>
</head>
```

## Common mistakes

| Mistake | Effect | Fix |
|---|---|---|
| Same title on every page ("Home") | Pages compete with each other; poor click rates | Unique, descriptive titles |
| Missing viewport tag | Tiny desktop layout on phones | Always include it |
| Relative og:image URL | No image in WhatsApp previews | Absolute https URL |
| Scripts in the head without defer | Slow, blank page while loading | `defer` |
| `noindex` left on after launch | Site never appears in Google | Remove it when going live |

## Practice

1. Write unique titles and descriptions for a business's Home, Services, About and Contact pages.
2. Add complete Open Graph tags to a page and test the preview by sharing the link to yourself.
3. Add LocalBusiness structured data for a shop in your town and validate it.
4. Audit a real website's head with View Source (Ctrl+U) and list what's missing.

:::think A client complains their website link shows no picture and the wrong text when shared on WhatsApp, even after you added og tags. What could be wrong?
Common causes: the og:image URL is relative instead of absolute https, the image is too big or blocked, the tags are added by JavaScript (crawlers read the raw HTML), or WhatsApp/Facebook cached the old preview. Use absolute URLs in the HTML itself, a properly sized image (1200×630), and refresh the cache with Facebook's Sharing Debugger.
:::

```quiz
Q: Which meta tag makes a page display properly on phones? (one word, the name value)
A: viewport
Q: Which element's text becomes the blue link in Google results?
A: title
Q: About how many characters should a meta description be? Give a number between 120 and 160.
A: 120 | 130 | 140 | 150 | 155 | 160 | 150-160 | 120-160
Q: Which attribute on script makes it run after the page has been read?
A: defer
Q: Which prefix do share-preview tags like og:image use? (two letters)
A: og
Q: Which link tag tells search engines the preferred URL for a page?
A: canonical | rel=canonical | rel="canonical"
Q: What size in pixels is recommended for an og:image? (width x height)
A: 1200x630 | 1200 x 630 | 1200×630
Q: Which script attribute is best for independent scripts like analytics that can run in any order?
A: async
Q: What format is recommended for structured data? (abbreviation)
A: JSON-LD | json-ld
```
=== exercise ===
Complete the head: add a `<title>` with the text **Otieno Plumbing** and a viewport meta tag.
=== starter ===
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  
</head>
<body>
  <h1>Otieno Plumbing</h1>
</body>
</html>
=== must_contain ===
<title>Otieno Plumbing</title>
name="viewport"
