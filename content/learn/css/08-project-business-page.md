---
slug: project-business-page
title: Project: a complete responsive business page
---
# Project: a complete responsive business page

Time to put the whole CSS course together. You'll style a one-page site for a Kenyan business, mobile first, with a sticky menu, a hero, a service grid, pricing cards, a contact section and dark mode support.

## The plan

1. **Design tokens**: colours and spacing in CSS variables.
2. **Base styles**: fonts, links, images.
3. **Layout helpers**: a centred `.wrap`.
4. **Sections**: header, hero, services (grid), pricing (flex), contact, footer.
5. **Responsive**: phone first, then a media query for bigger screens.
6. **Dark mode**: `prefers-color-scheme`.

## The complete page

Run it, resize the preview, and then change the business, colours and prices to make it your own.

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kamau Auto Garage | Nakuru</title>
<style>
  :root {
    --brand: #0b1b35; --accent: #ffb800; --bg: #ffffff; --soft: #f1f5f9; --text: #1e293b; --muted: #64748b;
    --radius: 14px; --space: 1rem;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #0b1220; --soft: #111c31; --text: #e2e8f0; --muted: #94a3b8; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; color: var(--text); background: var(--bg); }
  img { max-width: 100%; height: auto; display: block; }
  a { color: inherit; }
  .wrap { width: min(100% - 2rem, 1000px); margin-inline: auto; }

  header { position: sticky; top: 0; z-index: 10; background: var(--brand); color: #fff; }
  header .wrap { display: flex; align-items: center; justify-content: space-between; padding-block: .75rem; gap: 1rem; }
  .logo { font-weight: 800; font-size: 1.2rem; }
  .logo span { color: var(--accent); }
  nav a { text-decoration: none; margin-left: 1rem; opacity: .9; }
  nav a:hover { opacity: 1; text-decoration: underline; }

  .hero { background: linear-gradient(rgba(11,27,53,.7), rgba(11,27,53,.7)), url("https://picsum.photos/id/1071/1400/700") center / cover; color: #fff; padding-block: 4rem; }
  .hero h1 { font-size: clamp(1.8rem, 6vw, 3rem); line-height: 1.15; margin: 0 0 .5rem; }
  .btn { display: inline-block; padding: .75rem 1.25rem; border-radius: 999px; background: var(--accent); color: var(--brand); font-weight: 800; text-decoration: none; transition: transform .2s; }
  .btn:hover { transform: translateY(-2px); }

  section { padding-block: 3rem; }
  h2 { font-size: clamp(1.4rem, 4vw, 2rem); margin-top: 0; }
  .grid { display: grid; gap: var(--space); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .card { background: var(--soft); border-radius: var(--radius); padding: 1.25rem; }
  .card h3 { margin-top: 0; }

  .prices { display: flex; flex-wrap: wrap; gap: var(--space); }
  .price { flex: 1 1 220px; border: 2px solid var(--soft); border-radius: var(--radius); padding: 1.25rem; }
  .price.best { border-color: var(--accent); }
  .price strong { font-size: 1.6rem; display: block; }

  .contact { background: var(--soft); }
  footer { text-align: center; padding: 1.5rem; color: var(--muted); }

  @media (max-width: 560px) {
    nav a:not(:last-child) { display: none; }
  }
</style>
</head>
<body>
<header>
  <div class="wrap">
    <div class="logo">Kamau<span>Auto</span></div>
    <nav><a href="#services">Services</a><a href="#prices">Prices</a><a href="#contact">Contact</a></nav>
  </div>
</header>
<div class="hero">
  <div class="wrap">
    <h1>Honest car repairs in Nakuru</h1>
    <p>Service, brakes, tyres and diagnostics. Same-day for most jobs.</p>
    <a class="btn" href="#contact">Book a service</a>
  </div>
</div>
<section id="services">
  <div class="wrap">
    <h2>Services</h2>
    <div class="grid">
      <div class="card"><h3>🛢️ Full service</h3><p>Oil, filters and a 30-point check.</p></div>
      <div class="card"><h3>🛞 Tyres</h3><p>Fitting, balancing and alignment.</p></div>
      <div class="card"><h3>🛑 Brakes</h3><p>Pads, discs and brake fluid.</p></div>
      <div class="card"><h3>💻 Diagnostics</h3><p>Computer check for warning lights.</p></div>
    </div>
  </div>
</section>
<section id="prices">
  <div class="wrap">
    <h2>Prices</h2>
    <div class="prices">
      <div class="price"><h3>Basic</h3><strong>KSh 3,500</strong><p>Oil and filter change.</p></div>
      <div class="price best"><h3>Full service</h3><strong>KSh 7,500</strong><p>Most popular.</p></div>
      <div class="price"><h3>Diagnostics</h3><strong>KSh 2,000</strong><p>Free if we do the repair.</p></div>
    </div>
  </div>
</section>
<section id="contact" class="contact">
  <div class="wrap">
    <h2>Contact</h2>
    <p>Kenyatta Avenue, Nakuru · Open Mon–Sat, 8am–6pm</p>
    <a class="btn" href="https://wa.me/254700000000">WhatsApp us</a>
  </div>
</section>
<footer>&copy; 2026 Kamau Auto Garage</footer>
</body>
</html>
```

## What each part teaches

| Technique | Where |
|---|---|
| CSS variables (design tokens) | `:root { --brand... }` |
| Dark mode | `@media (prefers-color-scheme: dark)` |
| Centred container | `.wrap { width: min(100% - 2rem, 1000px) }` |
| Sticky header | `position: sticky; top: 0` |
| Flexbox | Header and pricing cards |
| Responsive grid without media queries | `repeat(auto-fit, minmax(200px, 1fr))` |
| Fluid headings | `clamp()` |
| Photo with overlay | `.hero` background |
| Hover animation | `.btn:hover` transform |

## Challenge

1. Change `--brand` and `--accent` to a new colour scheme.
2. Add a "Testimonials" section using the `.grid` and `.card` classes.
3. Add a map link and opening hours table in Contact.
4. Check it on your phone and fix anything that feels cramped.

```quiz
Q: Which at-rule detects a user's dark mode setting? Write the feature name.
A: prefers-color-scheme
Q: Which position value keeps the header at the top while scrolling?
A: sticky
Q: Which grid pattern makes columns wrap automatically? Write the repeat keyword used.
A: auto-fit | auto-fill
Q: Where are the CSS variables defined in this page? (a selector)
A: :root | root
```
=== exercise ===
Define a CSS variable `--brand` on `:root` and use it with `var(--brand)` as the header background.
=== starter ===
<style>
  :root {
    
  }
  header { color: #fff; padding: 12px; }
</style>
<header>My Business</header>
=== must_contain ===
--brand
var(--brand)
