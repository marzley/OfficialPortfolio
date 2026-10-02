---
slug: responsive
title: "Responsive design: one website for phones, tablets and computers"
after: KEEP
---
# Responsive design: one website for phones, tablets and computers

Most people in Kenya reach the internet through smartphones, and screens range from small budget Androids to large desktop monitors and TVs. A **responsive** website adapts its layout to fit any screen, so customers can read, tap and buy comfortably without zooming. Google also ranks sites primarily using their mobile version. This unit teaches responsive design properly: the viewport, fluid layouts, media queries, mobile-first CSS, responsive images and typography, and how to test.

:::note What you will learn
- What responsive design is and why it's essential
- The viewport meta tag
- Fluid layouts with %, `max-width`, Flexbox and Grid
- Media queries: syntax, breakpoints and features
- Mobile-first vs desktop-first
- Responsive images, typography (`clamp()`) and touch targets
- Testing on real devices and DevTools
:::

## What is responsive design?

:::define Responsive web design
Building one website whose layout, images and text **adapt** to the screen size and device, using flexible layouts, flexible images and CSS media queries. The term was coined by Ethan Marcotte in 2010.
:::

Before responsive design, companies often built a separate "m." mobile site (like `m.example.com`), meaning two sites to maintain. Responsive design replaced that with one site that works everywhere.

## Why it matters

- **Most visitors are on phones.** In Kenya, mobile devices account for the large majority of web traffic.
- **Google uses mobile-first indexing**: it mainly uses the mobile version of your site to rank it.
- **Business results:** if customers can't read prices or tap the WhatsApp button on their phones, they leave.
- **Accessibility:** responsive sites also work when users zoom in or increase text size.
- **One codebase:** cheaper to build and maintain than separate sites.

## Step 1: The viewport meta tag

Without this tag, phones pretend to be a ~980px-wide desktop and shrink the whole page, making text tiny:

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- `width=device-width`: the page width equals the device's width.
- `initial-scale=1`: no zoom on load.
- Never add `user-scalable=no` or `maximum-scale=1`: users must be able to zoom (accessibility).

## Step 2: Fluid layouts

Avoid fixed widths like `width: 960px` for page layouts. Use:

- **Percentages and `max-width`**: `width: 100%; max-width: 1100px;`
- **Flexbox with wrapping** and **Grid with `auto-fit`**: layouts that rearrange themselves
- **Relative units**: `rem` for text and spacing, `%`, `vw`/`vh`, `fr` in Grid

```try-html
<style>
  .container { width: 100%; max-width: 900px; margin: 0 auto; padding: 0 16px; box-sizing: border-box; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
  .grid div { background: #e0f2fe; padding: 16px; border-radius: 10px; font-family: sans-serif; }
</style>
<div class="container">
  <div class="grid">
    <div>Websites</div><div>Apps</div><div>Hosting</div><div>SEO</div>
  </div>
</div>
<p>This grid needs no media queries: it fits as many 180px+ columns as space allows.</p>
```

## Step 3: Media queries

A **media query** applies CSS only when a condition is true, usually a screen width.

```
@media (max-width: 600px) {
  /* rules here apply only on screens 600px wide or less */
  h1 { font-size: 28px; }
}

@media (min-width: 768px) {
  /* rules for screens 768px and wider */
  .menu { display: flex; }
}
```

```try-html
<style>
  .box { padding: 20px; color: #fff; font-family: sans-serif; background: #0b1b35; }
  @media (max-width: 500px) {
    .box { background: #059669; }
    .box::after { content: " (small screen styles active)"; }
  }
</style>
<div class="box">Resize the preview narrower than 500px to change my colour</div>
```

### Media query features

| Feature | Example | Use |
|---|---|---|
| `min-width` / `max-width` | `(min-width: 768px)` | Layout changes by screen width |
| Range syntax | `(width >= 768px)` | Newer, readable (supported by modern browsers) |
| `orientation` | `(orientation: landscape)` | Landscape vs portrait |
| `prefers-color-scheme` | `(prefers-color-scheme: dark)` | Dark mode |
| `prefers-reduced-motion` | `(prefers-reduced-motion: reduce)` | Reduce animation for users who ask |
| `hover` / `pointer` | `(hover: hover)` | Hover effects only where a mouse exists |
| `print` | `@media print { ... }` | Styles for printing |

### Choosing breakpoints

A **breakpoint** is the width where the layout changes. Don't design for specific phone models; add breakpoints **where your content starts to look wrong**. Common starting points:

| Breakpoint | Typical devices |
|---|---|
| up to ~600px | Phones |
| ~600–900px | Large phones, small tablets |
| ~900–1200px | Tablets, small laptops |
| 1200px+ | Laptops and desktops |

## Mobile-first vs desktop-first

**Mobile-first**: write base styles for phones, then add `min-width` media queries for larger screens.

```
/* Base: phones */
.services { display: grid; gap: 16px; }

/* Tablets and up */
@media (min-width: 700px) {
  .services { grid-template-columns: 1fr 1fr; }
}

/* Desktops */
@media (min-width: 1100px) {
  .services { grid-template-columns: repeat(4, 1fr); }
}
```

Why mobile-first is recommended:
- Phones (the majority) get the simplest CSS.
- It forces you to prioritise content.
- Adding layout for bigger screens is usually easier than squeezing a desktop design down.

**Desktop-first** uses `max-width` queries to adjust downwards; it works but often leads to more overrides.

:::think A designer gives you a desktop design with a 4-column services section. What would you show on phones, and how would you write the CSS mobile-first?
On phones, the four services stack in **one column** (maybe two short columns for small items). Mobile-first: base CSS = one column; `@media (min-width: 700px)` = two columns; `@media (min-width: 1100px)` = four columns. Or use `repeat(auto-fit, minmax(220px, 1fr))` and let Grid decide.
:::

## Responsive navigation

On small screens, a horizontal menu with many links won't fit. Common solutions:
- A **hamburger menu** (☰) that opens the links (needs a little JavaScript or the `<details>` element).
- A **bottom navigation bar** for app-like sites (this learning hub uses one on phones).
- **Fewer links**: move less important ones to the footer.

```try-html
<style>
  .nav { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding: 10px; background: #0b1b35; font-family: sans-serif; }
  .nav a { color: #fff; text-decoration: none; }
  .nav .brand { font-weight: 800; color: #ffb800; margin-right: auto; }
  @media (max-width: 480px) {
    .nav { flex-direction: column; align-items: flex-start; }
    .nav .brand { margin-right: 0; }
  }
</style>
<nav class="nav"><a class="brand" href="#">Mama Njeri Salon</a><a href="#">Services</a><a href="#">Prices</a><a href="#">Book</a></nav>
```

## Responsive images

```
img { max-width: 100%; height: auto; }
```

This one rule stops images overflowing. For performance, serve smaller files to phones using `srcset` and `sizes` (see the **Images done right** HTML unit) and modern formats (WebP, AVIF). `object-fit: cover` crops images neatly inside fixed-ratio boxes; `aspect-ratio: 16 / 9` reserves space for videos and images.

## Responsive typography

### Use `rem`

`rem` is relative to the root font size (usually 16px). If a user increases their phone's text size, `rem`-based text scales with it.

### Fluid sizes with `clamp()`

`clamp(minimum, preferred, maximum)` smoothly scales between sizes:

```
h1 { font-size: clamp(1.75rem, 4vw + 1rem, 3.25rem); }
```

On phones the heading is about 28px; it grows with the screen up to 52px on large screens, with no media queries needed.

### Readable line length

Long lines are tiring to read. Keep text to roughly **45–75 characters** per line: `max-width: 65ch;` on paragraphs.

## Touch-friendly design

- **Tap targets** at least about **44×44px** (Apple's guideline; WCAG 2.2 sets a minimum of 24×24px with spacing). Small links squeezed together cause mistaps.
- **Space between buttons.**
- **Don't rely on hover**: phones don't have hover. Show important information without it.
- **Readable base font size**: at least 16px on phones (smaller text in inputs also makes iPhones zoom in).
- Put key actions (Call, WhatsApp, Buy) where thumbs reach easily.

## Testing responsive designs

1. **DevTools device mode** (Ctrl+Shift+M in Chrome): test many widths, and drag the width slowly to find where layouts break.
2. **Real phones**: at least one cheap Android and, if possible, an iPhone. Emulators don't show everything (touch, performance, real fonts).
3. **Slow network test**: DevTools → Network → "Slow 4G" to see how it feels on weak connections.
4. **Rotate** to landscape; **zoom** to 200%; increase the phone's text size.
5. **Lighthouse** in DevTools checks mobile performance and basic accessibility.

## Common mistakes

| Mistake | Fix |
|---|---|
| Missing viewport meta tag | Add it to every page |
| Fixed widths (`width: 1000px`) | `max-width` + fluid units |
| Images overflowing | `max-width: 100%; height: auto;` |
| Tiny text and buttons on phones | 16px+ text, 44px tap targets |
| Disabling zoom | Never use `user-scalable=no` |
| Too many breakpoints for specific phones | Breakpoints where content breaks |
| Horizontal scrolling on phones | Find the overflowing element in DevTools (often a wide image, table or long word) |
| Testing only on your laptop | Test on real phones |

## Practice tasks

1. Take a desktop-only page and make it responsive using the viewport tag, `max-width` containers and fluid images.
2. Build a services section mobile-first: 1 column → 2 columns at 700px → 4 at 1100px.
3. Make a heading scale with `clamp()`, then test at 360px and 1440px widths.
4. Create a navigation bar that stacks on small screens.
5. Test a real website on your phone and list three responsive problems you notice.

## Summary

- Responsive design makes one site adapt to every screen with fluid layouts, flexible images and media queries.
- Always include `<meta name="viewport" content="width=device-width, initial-scale=1">` and never disable zoom.
- Use `max-width`, `%`, `rem`, Flexbox wrapping and Grid `auto-fit`/`minmax` for fluid layouts.
- Media queries apply CSS conditionally (`min-width`, `max-width`, `prefers-color-scheme`, `prefers-reduced-motion`).
- Mobile-first: base styles for phones, `min-width` queries for larger screens; set breakpoints where content breaks.
- Make images (`max-width: 100%`), typography (`rem`, `clamp()`, `65ch`) and touch targets (about 44px) responsive; test on real devices.

```quiz
Q: Which meta tag makes pages fit phone screens? Write its name value.
A: viewport
Q: Which CSS rule applies styles only when a condition like screen width is true? Write it with the @.
A: @media | media query
Q: In mobile-first CSS, do you mostly use min-width or max-width media queries?
A: min-width
Q: Which function sets a fluid font size with a minimum and maximum?
A: clamp | clamp()
Q: Roughly how many pixels should a comfortable tap target be (one side)?
A: 44 | 44px
Q: Which media feature detects a user's dark mode preference?
A: prefers-color-scheme
Q: Should you disable zoom with user-scalable=no? (yes or no)
A: no
Q: What max-width keeps lines of text readable, in ch units? Write like 65ch.
A: 65ch | 65
```
=== exercise ===
Write a media query for screens up to **600px** wide that makes `h1` smaller.
=== starter ===
<style>
  h1 { font-size: 48px; }
  
</style>
<h1>Hello</h1>
=== expected ===

=== must_contain ===
@media
max-width
600px
