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
```
