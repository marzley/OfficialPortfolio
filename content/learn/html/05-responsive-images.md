---
slug: responsive-images
title: Images done right: sizes, formats, figure and lazy loading
after: links-images
---
# Images done right: sizes, formats, figure and lazy loading

Images make a site feel real, but they are also the **number one reason sites are slow** in Kenya, where many visitors browse on mobile data. This lesson shows how to use images that look sharp and load fast.

## The basic image, done properly

```html
<img src="shop.jpg" alt="Inside our shop in Nyeri, with shelves of groceries"
     width="800" height="533" loading="lazy">
```

| Attribute | Why it matters |
|---|---|
| `src` | The file to show |
| `alt` | Text for blind users, and shown if the image fails. Describe what matters. |
| `width` / `height` | Lets the browser reserve space, so the page doesn't jump while loading |
| `loading="lazy"` | Loads the image only when the user scrolls near it |

> Tip: for pure decoration (a background swirl), use an empty alt: `alt=""`. Screen readers will skip it.

## Choose the right format

| Format | Best for | Notes |
|---|---|---|
| **JPG** | Photos | Small files, no transparency |
| **PNG** | Logos, screenshots, transparency | Can be big for photos |
| **WebP** | Almost everything | 25–35% smaller than JPG/PNG, supported by all modern browsers |
| **SVG** | Logos and icons | Code-based, sharp at any size, tiny |
| **GIF** | Simple animations | Usually better as a short video |

## Resize before you upload

A phone photo is often 4000 px wide and 4 MB. A web page rarely needs more than 1200–1600 px. Resize and compress first (Squoosh.app is free), and aim for **under 200 KB** per photo.

## figure and figcaption

When an image has a caption, group them:

```try-html
<figure>
  <img src="https://picsum.photos/id/1043/600/360" alt="Green hills and a winding road" width="600" height="360" style="max-width:100%;height:auto">
  <figcaption>Photo: the road to our farm in Kericho.</figcaption>
</figure>
```

## Images that fit any screen

Add this CSS once and images will never overflow a phone screen:

```try-html
<style>
  img { max-width: 100%; height: auto; }
</style>
<img src="https://picsum.photos/id/1015/1400/700" alt="A river between mountains" width="1400" height="700">
<p>Resize the window: the image shrinks to fit.</p>
```

## srcset: send smaller files to phones

With `srcset` you list the same image in several sizes and let the browser pick:

```html
<img src="team-800.jpg"
     srcset="team-480.jpg 480w, team-800.jpg 800w, team-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 800px"
     alt="Our team outside the office" width="800" height="533">
```

- `480w` means "this file is 480 pixels wide".
- `sizes` tells the browser how wide the image will be shown. On a phone (up to 600px) it fills the screen (`100vw`); otherwise it shows at 800px.

A phone then downloads the 480px file instead of the 1600px one, saving data and time.

## picture: different formats or crops

```html
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Students in a computer lab" width="1200" height="600">
</picture>
```

Browsers that support WebP use it; older ones fall back to the JPG.

## Checklist

1. Resize and compress every image.
2. Always write a useful `alt`.
3. Set `width` and `height`.
4. Use `loading="lazy"` for images below the first screen.
5. Prefer WebP; use SVG for logos and icons.

## Why images need care

Images are usually the **heaviest** part of a web page. A single unoptimised phone photo can be 4 to 8 MB, more than the rest of the site combined. In Kenya, many visitors browse on mobile data bundles and mid-range phones, so heavy images mean slow pages, wasted data and lost customers. Images also affect SEO (Google Images, Core Web Vitals) and accessibility (alt text). Getting images right is one of the quickest wins for any website.

## Writing good alt text

| Image | Good alt | Bad alt |
|---|---|---|
| Product photo | `alt="Red Safaricom Neon Ray phone, front and back"` | `alt="image1"` |
| Team photo | `alt="Our five-person team outside the Nakuru office"` | `alt="photo"` |
| Logo linking home | `alt="Duka Digital home"` | `alt="logo.png"` |
| Chart | `alt="Bar chart: sales rose from 120 in January to 310 in June"` | `alt="chart"` |
| Decorative swirl | `alt=""` (empty, so screen readers skip it) | Missing alt attribute |
| Icon next to text "Call us" | `alt=""` (the text already says it) | `alt="phone icon"` |

Ask: "If the image didn't load, what words would replace it?" Don't start with "Image of"; screen readers already announce it's an image.

## Width and height prevent layout shift

```html
<img src="/img/shop-front.webp" alt="Our shop on Kenyatta Avenue, Nakuru"
     width="1200" height="800" loading="lazy" decoding="async">
```

When `width` and `height` are set, the browser reserves the right space before the image loads, so text doesn't jump down (measured by Google as **Cumulative Layout Shift**). With CSS `max-width: 100%; height: auto;` the image still resizes responsively, keeping the same proportions.

## Lazy loading and priority

| Image | Setting | Why |
|---|---|---|
| Hero/banner at the top | `fetchpriority="high"`, no lazy loading | It's the largest visible element; load it first |
| Images further down | `loading="lazy"` | Only download when the user scrolls near them |
| Small icons in the header | Default | Tiny and visible immediately |

Never lazy-load the main hero image: it delays the **Largest Contentful Paint**, one of Google's speed measurements.

## srcset with sizes, explained

```html
<img
  src="/img/team-800.webp"
  srcset="/img/team-400.webp 400w, /img/team-800.webp 800w, /img/team-1600.webp 1600w"
  sizes="(min-width: 1000px) 50vw, 100vw"
  width="1600" height="1067"
  alt="Our team at work">
```

- `srcset` lists the available files and their real widths (`w`).
- `sizes` tells the browser how wide the image will display: here half the screen on large screens, full width otherwise.
- The browser picks the smallest file that looks sharp, considering screen density. A phone 400px wide with a 2× screen downloads the 800w file, not the 1600w one.

## picture for art direction and formats

```html
<picture>
  <source media="(max-width: 600px)" srcset="/img/hero-mobile.webp">   <!-- a tall crop for phones -->
  <source type="image/avif" srcset="/img/hero.avif">
  <source type="image/webp" srcset="/img/hero.webp">
  <img src="/img/hero.jpg" alt="Customer paying with M-Pesa at a shop counter" width="1600" height="700">
</picture>
```

The browser uses the first `<source>` that matches; the `<img>` is the fallback and carries the alt text.

## How to optimise images: a practical workflow

1. **Resize** to the largest size it will be displayed (for most content images, 1200 to 1600px wide is plenty).
2. **Choose the format**: WebP or AVIF for photos, SVG for logos and icons, PNG only when you need sharp transparency that SVG can't do.
3. **Compress**: free tools such as Squoosh (squoosh.app) or TinyPNG, or export at about 75 to 85% quality.
4. **Name files descriptively**: `web-design-nakuru-homepage.webp`, not `IMG_20260912.jpg` (helps SEO).
5. **Create 2 or 3 sizes** for `srcset` on large images.
6. **Check** with PageSpeed Insights or Lighthouse: it flags oversized and unoptimised images.

As a rough target, aim for content photos under about 150 to 200 KB and hero images under about 300 KB.

## SVG: images made of code

```try-html
<svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Green tick in a circle">
  <circle cx="60" cy="60" r="54" fill="#16a34a"/>
  <path d="M35 62 l17 17 l34 -36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<svg width="60" height="60" viewBox="0 0 120 120" aria-hidden="true">
  <circle cx="60" cy="60" r="54" fill="#16a34a"/>
  <path d="M35 62 l17 17 l34 -36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

SVGs stay sharp at any size, are usually tiny, and can be coloured with CSS. Only use SVG files from trusted sources: they can contain scripts.

## Images and copyright

- Don't copy images from Google search results: most are copyrighted.
- Use your own photos, the client's photos, or free libraries with clear licences (Unsplash, Pexels, Pixabay), and check each licence.
- Photos of real Kenyan businesses, staff and products build more trust than generic stock images.
- Get permission before publishing photos of people, especially children.

## Background vs content images

Use `<img>` for anything meaningful (it gets alt text, lazy loading and srcset). Use CSS `background-image` for decoration. If a hero has important text, put the text in HTML, never inside the image: text in images can't be read by search engines or screen readers, and it doesn't resize well on phones.

## Common mistakes

| Mistake | Fix |
|---|---|
| Uploading 5 MB camera photos | Resize and compress first |
| No width/height attributes | Add them to stop layout shift |
| Lazy-loading the hero image | Load it eagerly with `fetchpriority="high"` |
| Text baked into banner images | Real HTML text over the image |
| Same alt text on every image | Describe each image's purpose |
| Missing alt on decorative images | `alt=""` |

## Practice

1. Take a phone photo, resize it to 1200px wide, export as WebP, and compare the file sizes.
2. Write alt text for five images on a real business website you know.
3. Build a responsive gallery with `srcset`, `sizes`, lazy loading and width/height.
4. Use `<picture>` to show a square crop on phones and a wide crop on desktops.
5. Run PageSpeed Insights on a site and list the image issues it reports.

:::think A product page loads slowly on phones. The hero image is 3,800px wide and 2.4 MB, and every product image has `loading="lazy"`, including the first one at the top. What would you change?
Resize the hero to about 1600px (with smaller srcset versions for phones), convert to WebP/AVIF and compress it to a few hundred KB. Remove `loading="lazy"` from images visible on first load (the hero and first product) and add `fetchpriority="high"` to the hero, keeping lazy loading for images further down. Add width/height to prevent layout shift.
:::

```quiz
Q: Which attribute describes an image for blind users?
A: alt
Q: Which attribute value makes images load only when the user scrolls near them?
A: lazy | loading="lazy"
Q: Which image format is best for logos and icons that must be sharp at any size?
A: svg
Q: Which element groups an image with its caption?
A: figure
Q: Which attribute lists several sizes of the same image?
A: srcset
Q: What alt value should a purely decorative image have?
A: empty | "" | alt="" | nothing
Q: Which attribute tells the browser how wide an image will be displayed, used with srcset?
A: sizes
Q: Should the main hero image use loading="lazy"? (yes or no)
A: no
Q: Which free tool from Google measures page speed and image problems? (two words)
A: PageSpeed Insights | Lighthouse | pagespeed
```
=== exercise ===
Add an image with `src="shop.webp"`, a useful `alt`, `width="800"`, `height="533"` and lazy loading.
=== starter ===
<!-- your image here -->
=== must_contain ===
src="shop.webp"
alt="
loading="lazy"
width="800"
