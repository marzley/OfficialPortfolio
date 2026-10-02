---
slug: mobile-first
title: "Mobile-first and responsive design: why it matters in Kenya, viewport, breakpoints, flexible layouts, images and testing"
after: KEEP
---
# Mobile-first and responsive design: why it matters in Kenya, viewport, breakpoints, flexible layouts, images and testing

In Kenya, most people browse the internet on **smartphones**, often on mobile data, sometimes on older or budget devices. If a website is hard to use on a phone (tiny text, buttons too close together, sideways scrolling, slow-loading images), most visitors leave. **Responsive design** makes one website adapt to any screen size; **mobile-first** means designing and coding for the smallest screen first, then enhancing for larger screens. This unit explains both, with the CSS techniques and testing methods professionals use.

:::note What you will learn
- Why mobile-first matters for users, business and Google
- The viewport meta tag
- Mobile-first CSS with min-width media queries
- Choosing breakpoints based on content
- Flexible layouts: %, fr, minmax, clamp, max-width
- Responsive navigation patterns
- Responsive images: srcset, sizes, picture, lazy loading
- Touch-friendly design and mobile UX details
- Performance on mobile data
- Testing on real devices and browser tools
:::

## Why mobile-first?

| Reason | Detail |
|---|---|
| **Users** | Most Kenyan internet users are on phones; many sites get the majority of traffic from mobile |
| **Google** | Mobile-first indexing: Google mainly uses the mobile version of a page for ranking |
| **Focus** | Small screens force you to prioritise what matters most |
| **Performance** | Starting lean (small images, less code) helps users on slower connections and cheaper data bundles |
| **Business** | Easy tap-to-call, WhatsApp and M-Pesa flows convert mobile visitors |

## The viewport meta tag

Without this, phones display a zoomed-out desktop page:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Put it in every page's `<head>`. Don't disable zooming (`user-scalable=no`): people with low vision need it.

## Mobile-first CSS

Write base styles for phones, then add `min-width` media queries for larger screens:

```try-html
<style>
  .menu { display: flex; flex-direction: column; gap: 8px; font-family: system-ui; }
  .menu a { background: #0b1b35; color: #fff; padding: 12px; border-radius: 8px; text-decoration: none; text-align: center; }
  .cards { display: grid; gap: 12px; margin-top: 12px; font-family: system-ui; }
  .cards div { background: #f1f5f9; padding: 16px; border-radius: 10px; }

  @media (min-width: 600px) {
    .menu { flex-direction: row; }
    .cards { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 900px) {
    .cards { grid-template-columns: repeat(4, 1fr); }
  }
</style>
<nav class="menu"><a href="#">Home</a><a href="#">Services</a><a href="#">Contact</a></nav>
<div class="cards"><div>Websites</div><div>M-Pesa</div><div>SEO</div><div>Training</div></div>
```

Resize the preview: one column on phones, two on tablets, four on wide screens.

Desktop-first (`max-width` queries that undo desktop styles) tends to send phones more CSS than they need and leads to more overrides.

## Breakpoints

Common starting points (not rules):

| Breakpoint | Typical devices |
|---|---|
| Base (no query) | Phones |
| `min-width: 600px` | Large phones / small tablets |
| `min-width: 900px` | Tablets landscape / small laptops |
| `min-width: 1200px` | Desktops |

Better: add a breakpoint **where your content starts to look bad**, not for specific devices (there are thousands of screen sizes). Also consider **container queries** (`@container`) to style components based on their container's width, useful for reusable cards.

## Flexible layouts

| Technique | Example | Effect |
|---|---|---|
| Percentages / fr | `grid-template-columns: 2fr 1fr` | Columns share space proportionally |
| `max-width` | `img { max-width: 100%; height: auto; }` | Images never overflow |
| `minmax()` + `auto-fit` | `repeat(auto-fit, minmax(220px, 1fr))` | Cards wrap automatically |
| `clamp()` | `font-size: clamp(1.8rem, 5vw, 3rem)` | Fluid type |
| Container width | `width: min(100% - 32px, 1120px)` | Side margins on phones, max width on desktop |
| Flex wrap | `flex-wrap: wrap` | Items move to the next line |

Avoid fixed widths like `width: 960px` for containers, a classic cause of horizontal scrolling on phones.

## Responsive navigation

| Pattern | Notes |
|---|---|
| **Hamburger menu** | Common; label it "Menu" for clarity; make it keyboard and screen-reader accessible |
| **Bottom navigation bar** | Great for app-like sites with 3–5 key sections |
| **Priority+** | Show the most important links, put the rest under "More" |
| **Sticky CTA bar** | "Call", "WhatsApp" buttons fixed at the bottom on phones |

Keep the most important actions (Call, WhatsApp, Book, Cart) visible without opening a menu.

## Responsive images

Images are usually the heaviest part of a page. Serve smaller images to phones:

```html
<img
  src="hero-800.webp"
  srcset="hero-480.webp 480w, hero-800.webp 800w, hero-1600.webp 1600w"
  sizes="(min-width: 900px) 50vw, 100vw"
  width="1600" height="900"
  alt="Technician installing solar panels on a roof in Machakos"
  loading="lazy">
```

- `srcset` lists sizes; the browser picks the best for the screen and pixel density.
- `sizes` says how wide the image displays.
- `width`/`height` reserve space to prevent layout shifts (CLS).
- `loading="lazy"` delays off-screen images (don't lazy-load the main hero image at the top).
- Use modern formats (**WebP**, AVIF) and compress images (Squoosh, TinyPNG).
- `<picture>` can switch to a different crop for phones (art direction).

## Touch-friendly design and mobile UX

- Body text at least **16px**; inputs 16px+ (prevents iOS zoom).
- Touch targets around **44–48px** with spacing.
- Put key actions within easy thumb reach (lower part of the screen).
- Use `tel:` and WhatsApp links:

```html
<a href="tel:+254712345678">Call us</a>
<a href="https://wa.me/254712345678?text=Hi%2C%20I%27d%20like%20a%20quote">WhatsApp us</a>
```

- Avoid hover-only interactions (there's no hover on touchscreens).
- Avoid intrusive pop-ups that cover content on phones (bad for users and SEO).
- Use appropriate input types and autocomplete in forms.
- Make tables responsive (horizontal scroll inside a wrapper, or stack rows as cards on phones).

## Performance on mobile data

- Keep pages light: compress images, limit fonts, remove unused scripts and plugins.
- Measure with **PageSpeed Insights** (Core Web Vitals) and test on a slow 4G profile in DevTools.
- Use caching and a CDN.
- Remember many users watch their data bundles: a 10 MB homepage costs them money.

## Testing

1. **Browser DevTools device mode** (Chrome/Edge: F12 → device toolbar): test common widths (360px, 390px, 414px, 768px, 1024px, 1440px).
2. **Real phones**: at least one Android budget phone and one iPhone if possible; test outdoors (brightness) and on mobile data.
3. Check: no horizontal scrolling, readable text, tappable buttons, menus working, forms usable, images sharp but light.
4. Rotate to landscape.
5. Use Google's tools (PageSpeed Insights, Lighthouse) and Search Console's page experience reports.

:::think A Nairobi restaurant's site looks great on the owner's laptop, but on phones the menu table forces sideways scrolling, the 6 MB hero photo loads slowly, and the phone number isn't clickable. What would you fix?
Add the viewport meta tag if missing; make the menu responsive (stacked cards or a scrollable wrapper); compress and resize the hero with srcset/WebP and width/height attributes; use a mobile-first layout with min-width breakpoints; make the phone a `tel:` link and add a WhatsApp button (perhaps a sticky bottom bar); then test on real phones and PageSpeed Insights.
:::

## Summary

- Most Kenyan users browse on phones and Google indexes mobile-first, so design for small screens first.
- Always include the viewport meta tag; write base styles for phones and add min-width media queries.
- Set breakpoints where content breaks; use flexible units (fr, %, minmax, clamp, max-width) and container queries.
- Use responsive navigation, responsive images (srcset, sizes, WebP, lazy loading), and touch-friendly, tap-to-call/WhatsApp design.
- Keep pages light for mobile data and test on DevTools and real devices.

```quiz
Q: Which meta tag makes pages fit phone screens? (name attribute value)
A: viewport
Q: In mobile-first CSS, which media query feature do you mainly use: min-width or max-width?
A: min-width
Q: Which img attribute lists different image sizes for the browser to choose from?
A: srcset
Q: Which attribute value delays loading off-screen images?
A: lazy | loading="lazy"
Q: Which link prefix makes a phone number tappable to call?
A: tel: | tel
```

=== exercise ===
Write a media query for screens **at least 600px wide** that sets `.menu` to `flex-direction: row`.
=== starter ===
<style>
  .menu { display: flex; flex-direction: column; }
  
</style>
<nav class="menu"><a href="#">Home</a><a href="#">Shop</a></nav>
=== expected ===

=== must_contain ===
@media
min-width
600px
flex-direction
row
