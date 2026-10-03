---
slug: website-speed
title: Make your website fast: Core Web Vitals and speed fixes
after: ssl-email-backups
---
# Make your website fast

A slow website loses customers: many people leave if a page takes more than about 3 seconds. In Kenya, where many visitors browse on mobile data and mid-range phones, speed matters even more. Google also uses page experience signals in rankings.

## Measure first

- **PageSpeed Insights** (pagespeed.web.dev): scores for mobile and desktop with specific fixes.
- Our **free website check** on marzleytechsolutions.co.ke.
- Chrome **DevTools → Lighthouse** and the **Network** tab (see which files are big).

## Core Web Vitals (Google's key measures)

| Metric | Measures | Good |
|---|---|---|
| **LCP** (Largest Contentful Paint) | How fast the main content (hero image, heading) appears | ≤ 2.5 s |
| **INP** (Interaction to Next Paint) | How quickly the page responds to taps and clicks | ≤ 200 ms |
| **CLS** (Cumulative Layout Shift) | How much the page jumps around while loading | ≤ 0.1 |

## The biggest wins, in order

### 1. Images (usually 50–80% of page weight)

- Resize to the size shown (a 400px card doesn't need a 4000px photo).
- Convert to **WebP**; compress (Squoosh.app, or a plugin on WordPress).
- `loading="lazy"` for images below the first screen.
- Always set `width` and `height` (prevents layout shift = better CLS).
- Use `srcset` so phones get smaller files (see *Images done right* in the HTML tutorial).

### 2. Less JavaScript

- Remove unused libraries and plugins (sliders, animation libraries, extra chat widgets).
- Load scripts with `defer`.
- Every third-party script (ads, trackers, widgets) costs time. Keep only what earns its place.

### 3. Caching

- **Browser caching**: tell browsers to keep static files (CSS, JS, images) for a long time.
- **Page caching** on the server (LiteSpeed Cache, WP Super Cache) for WordPress.
- A **CDN** (e.g. Cloudflare's free plan) serves files from locations near your visitors.

Apache example (`.htaccess`):

```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

> When you cache files for a long time, change the file name or add a version (`style.css?v=2`) when you update them, so visitors get the new version.

### 4. Compression

Enable **Gzip or Brotli** so text files (HTML, CSS, JS) are sent compressed, often 70% smaller. Most cPanel hosts have it under *Optimize Website*.

### 5. Fonts

- Use the system font stack, or one web font with only the weights you need.
- `font-display: swap` so text shows immediately.
- Self-host fonts or preload the main one.

### 6. The server

- A good host with fast disks (NVMe/SSD) and servers near your audience.
- Current **PHP 8.x** (much faster than PHP 7).
- Database indexes on columns you search (see SQL lessons).

## A quick checklist

| ✓ | Item |
|---|---|
| | Images resized, WebP, lazy-loaded, with width/height |
| | CSS and JS minified; scripts deferred |
| | Unused plugins and scripts removed |
| | Caching and compression on |
| | HTTPS with HTTP/2 or HTTP/3 |
| | Mobile score above 80 in PageSpeed Insights |

## A typical example

Imagine a shop's homepage that is 6.8 MB and takes 9 seconds on 4G. After resizing and converting 12 product photos to WebP, removing an unused slider plugin and turning on caching, it could drop to under 1 MB and load in about 2 seconds. Fewer visitors give up, so more of them become enquiries.

## Why speed matters

Many visitors in Kenya browse on mobile data and mid-range phones. A slow site wastes their data, frustrates them and loses customers: people commonly leave pages that take too long to load. Google uses page experience signals, including Core Web Vitals, as part of how it ranks pages, and faster sites usually convert better (more enquiries, more sales). Speed optimisation is a valuable service web developers can offer existing businesses.

## The tools and what they tell you

| Tool | What it shows |
|---|---|
| PageSpeed Insights | Lab scores plus real-user data (Core Web Vitals) from Chrome users, if available |
| Lighthouse (Chrome DevTools) | Detailed lab audit with suggestions |
| DevTools Network tab | Every file, its size and load time; simulate slow 3G/4G |
| DevTools Performance tab | What the browser spends time on (scripts, layout, painting) |
| WebPageTest | Detailed tests from different locations and devices |
| Google Search Console → Core Web Vitals | Which URLs are slow for real users |

Lab tests are useful for debugging; real-user data reflects what actual visitors experience.

## Core Web Vitals in practice

| Metric | Measures | Common causes of poor scores | Fixes |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | When the main content (often the hero image) appears | Huge hero images, slow server, render-blocking CSS/JS, lazy-loaded hero | Compress/resize hero, preload it, `fetchpriority="high"`, faster hosting, caching |
| **INP** (Interaction to Next Paint) | How quickly the page responds to taps and clicks | Heavy JavaScript, long tasks, too many third-party scripts | Remove unused JS, split code, defer non-essential scripts |
| **CLS** (Cumulative Layout Shift) | How much content jumps around | Images without dimensions, ads/embeds without reserved space, late-loading fonts | width/height on images, reserve space, `font-display: swap` with similar fallback |

## Server and caching

- **Hosting quality** matters: a slow server delays everything (check Time To First Byte in DevTools).
- **Page caching** saves generated pages so PHP/WordPress doesn't rebuild them for every visitor.
- **Browser caching**: long cache lifetimes for images, CSS and JS with versioned file names.
- **Compression**: gzip or Brotli for text files (usually enabled by hosts; check the `content-encoding` response header).
- **HTTP/2 or HTTP/3**: modern protocols load many files efficiently (most hosts and CDNs support them).
- **CDN**: serves files from servers close to visitors; Cloudflare's free plan is popular.

```apache
# .htaccess example for Apache/LiteSpeed: cache static files for a year
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

Only use very long caching for files whose names change when updated (e.g. `styles.4f3a.css`), or visitors may see old versions.

## Images: the biggest win on most sites

1. Resize to the largest display size (e.g. 1600px for full-width heroes, 800px for cards).
2. Convert to WebP or AVIF; compress to a sensible quality.
3. Use `srcset` and `sizes` so phones download smaller versions.
4. `loading="lazy"` for images below the fold; never for the hero.
5. Always set `width` and `height`.

## CSS, JavaScript and fonts

- Remove unused CSS and JS (Coverage tab in DevTools shows unused code).
- Minify files; combine sensibly (with HTTP/2, many small files are fine).
- `defer` scripts; load analytics and chat widgets after the main content.
- Self-host fonts, load only needed weights, use `woff2` and `font-display: swap`; consider system fonts.
- Limit third-party scripts (chat widgets, multiple analytics tags, social embeds): each adds weight and can slow interaction.

## Video and embeds

A YouTube embed loads a lot of data even if nobody presses play. Use a **lightweight facade**: show a thumbnail image with a play button and load the real player only on click (lite-youtube style components or a small script).

## A speed optimisation workflow for clients

1. **Baseline**: record PageSpeed scores (mobile), LCP/INP/CLS and page weight for key pages.
2. **Quick wins**: images, caching, compression, removing unused plugins/scripts.
3. **Deeper fixes**: theme/code improvements, hosting upgrade, CDN.
4. **Re-test** and compare with the baseline.
5. **Report** to the client in plain language: "Home page now loads in about half the time on mobile; page size reduced from 6.2 MB to 1.1 MB."
6. **Monitor** monthly in Search Console.

## Practice

1. Run PageSpeed Insights on a local business website and list the top three issues.
2. In DevTools, throttle to "Slow 4G", reload a page and note the total size and load time.
3. Compress and convert a site's images to WebP and measure the difference.
4. Add caching headers to a test site and confirm them in the Network tab.
5. Replace a YouTube embed with a click-to-load facade.

:::think A WordPress home page scores 35 on mobile. The hero is a 4 MB PNG slider with five images, and there are 3 analytics scripts and a chat widget. Where would you start?
Replace the slider with a single optimised hero image (WebP, resized, preloaded, not lazy-loaded) because it likely dominates LCP and page weight. Then remove duplicate analytics scripts, delay the chat widget until after load or interaction, enable page caching and compression, and re-test. Sliders are heavy and rarely improve conversions.
:::

```quiz
Q: What does LCP stand for? (three words)
A: Largest Contentful Paint
Q: What is a good LCP time, in seconds or less?
A: 2.5 | 2.5s | 2.5 seconds
Q: Which image format is usually smallest for photos on the web?
A: WebP
Q: Which script attribute stops JavaScript from blocking the page while it loads?
A: defer | async
Q: Setting width and height on images improves which Core Web Vital? (three letters)
A: CLS
Q: Which Core Web Vital measures how quickly a page responds to taps and clicks? (abbreviation)
A: INP
Q: Which free service is popular as a CDN in front of websites?
A: Cloudflare
Q: Which DevTools tab shows unused CSS and JavaScript?
A: Coverage
Q: Which compression formats reduce text file sizes on the server? (name one)
A: gzip | Brotli
```
