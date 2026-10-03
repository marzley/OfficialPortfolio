---
slug: backgrounds-borders-shadows
title: Backgrounds, borders, rounded corners and shadows
after: units-sizing
---
# Backgrounds, borders, rounded corners and shadows

These four properties turn plain boxes into buttons, cards and banners.

## Backgrounds

```try-html
<style>
  .box { padding: 18px; margin: 10px 0; color: #fff; border-radius: 10px; font-family: sans-serif; }
  .solid { background-color: #0b1b35; }
  .gradient { background: linear-gradient(135deg, #0b1b35, #2563eb); }
  .radial { background: radial-gradient(circle at top left, #ffb800, #b45309); }
  .photo {
    background-image: linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("https://picsum.photos/id/1018/900/400");
    background-size: cover;
    background-position: center;
    min-height: 120px;
  }
</style>
<div class="box solid">Solid colour</div>
<div class="box gradient">Linear gradient</div>
<div class="box radial">Radial gradient</div>
<div class="box photo">Photo with a dark overlay so white text stays readable</div>
```

| Property | What it does |
|---|---|
| `background-color` | A flat colour |
| `background-image` | `url(...)` or a gradient |
| `background-size` | `cover` fills the box (may crop), `contain` shows it all |
| `background-position` | `center`, `top`, `50% 20%` |
| `background-repeat` | `no-repeat`, `repeat` |
| `background` | Shorthand for all of the above |

> Tip: a dark gradient layered over a photo (like `.photo` above) is the professional way to keep text readable on busy pictures.

## Borders

```css
border: 2px solid #0b1b35;        /* width style colour */
border-bottom: 3px dashed #ffb800;
border-left: 4px solid #16a34a;   /* great for "note" boxes */
```

Styles: `solid`, `dashed`, `dotted`, `double`, `none`.

## Rounded corners

```try-html
<style>
  .r { display: inline-block; width: 90px; height: 90px; margin: 6px; background: #ffb800; text-align: center; line-height: 90px; font-family: sans-serif; }
  .r1 { border-radius: 8px; }
  .r2 { border-radius: 24px; }
  .r3 { border-radius: 50%; }
  .r4 { border-radius: 24px 0 24px 0; }
  .pill { display: inline-block; padding: 6px 16px; border-radius: 999px; background: #0b1b35; color: #fff; font-family: sans-serif; }
</style>
<div class="r r1">8px</div><div class="r r2">24px</div><div class="r r3">50%</div><div class="r r4">mixed</div>
<p><span class="pill">A pill badge</span></p>
```

`border-radius: 50%` on a square makes a circle: perfect for profile photos.

## Shadows

`box-shadow: x y blur spread colour;`

```try-html
<style>
  body { background: #f1f5f9; font-family: sans-serif; padding: 10px; }
  .card { background: #fff; border-radius: 14px; padding: 16px; margin: 14px 0; }
  .s1 { box-shadow: 0 1px 3px rgba(0,0,0,.12); }
  .s2 { box-shadow: 0 10px 30px rgba(15,23,42,.15); }
  .s3 { box-shadow: 0 0 0 3px #ffb800; }               /* a "ring" */
  .s4 { box-shadow: inset 0 2px 6px rgba(0,0,0,.2); }  /* pressed-in */
</style>
<div class="card s1">Subtle shadow</div>
<div class="card s2">Soft, floating shadow</div>
<div class="card s3">Ring (no blur, 3px spread)</div>
<div class="card s4">Inset shadow</div>
```

Soft, low-opacity shadows look modern; dark hard shadows look dated.

## Putting it together: a product card

```try-html
<style>
  body { background: #f1f5f9; font-family: system-ui, sans-serif; }
  .product { width: 240px; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(15,23,42,.12); }
  .product img { width: 100%; display: block; }
  .product .body { padding: 14px; }
  .badge { background: #dcfce7; color: #166534; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
  .buy { display: block; text-align: center; margin-top: 10px; padding: 10px; border-radius: 10px; background: #15803d; color: #fff; text-decoration: none; font-weight: 700; }
</style>
<div class="product">
  <img src="https://picsum.photos/id/292/480/300" alt="Fresh vegetables" width="480" height="300">
  <div class="body">
    <span class="badge">In stock</span>
    <h3>Sukuma wiki bundle</h3>
    <p>KSh 50 per bunch</p>
    <a class="buy" href="#">Order on WhatsApp</a>
  </div>
</div>
```

## Where you use these properties

Backgrounds, borders, corners and shadows create the visual personality of a site: hero banners, buttons, cards, pricing tables, badges and profile pictures. Used well, they create **depth and hierarchy** (what's important, what's clickable). Used badly, they make a site look dated or cluttered. These properties are also cheap: a gradient or shadow in CSS loads instantly, unlike an image.

## Gradients in depth

```try-html
<style>
  .g { height: 70px; border-radius: 12px; margin: 8px 0; color: #fff; font: 600 14px system-ui; display: grid; place-items: center; }
  .linear { background: linear-gradient(135deg, #0b1b35, #1d4ed8); }
  .stops  { background: linear-gradient(90deg, #16a34a 0 33%, #000 33% 66%, #dc2626 66%); }
  .radial { background: radial-gradient(circle at 30% 30%, #fbbf24, #b45309); }
  .conic  { background: conic-gradient(#0b1b35 0 70%, #e2e8f0 0); width: 70px; border-radius: 50%; color: #0b1b35; }
  .overlay { background: linear-gradient(rgba(11,27,53,.75), rgba(11,27,53,.75)), url("https://picsum.photos/600/200") center/cover; }
</style>
<div class="g linear">Linear gradient (135deg)</div>
<div class="g stops">Hard colour stops</div>
<div class="g radial">Radial gradient</div>
<div class="g conic"></div>
<div class="g overlay">Dark overlay on a photo keeps text readable</div>
```

The conic gradient makes a simple "70% complete" pie chart with no images. The overlay technique is essential: white text directly on a busy photo often fails contrast checks.

## Multiple backgrounds and background shorthand

```css
.hero {
  background:
    url("/img/pattern.svg") repeat top left / 40px,      /* top layer */
    linear-gradient(#0b1b35, #13284d);                    /* bottom layer */
}
/* shorthand order: image position / size repeat attachment colour */
.banner { background: url(banner.webp) center / cover no-repeat #0b1b35; }
```

Always include a background **colour** as a fallback in case the image fails to load (common on slow connections).

## Background images vs `<img>`

| Use `<img>` when... | Use `background-image` when... |
|---|---|
| The image is content (product photo, team photo) | The image is decoration (patterns, textures) |
| It needs alt text for screen readers and SEO | It has no meaning to convey |
| It should be printed and lazy-loaded | It's part of the design only |

Search engines index `<img>` with alt text; background images are mostly ignored.

## Border tricks

```try-html
<style>
  .row { display: flex; gap: 12px; flex-wrap: wrap; font: 14px system-ui; }
  .row > div { padding: 14px; background: #fff; }
  .accent { border-left: 5px solid #f59e0b; background: #fffbeb !important; }
  .dashed { border: 2px dashed #94a3b8; border-radius: 10px; }
  .outline { outline: 3px solid #1d4ed8; outline-offset: 4px; }
  .pill { border-radius: 999px; background: #dcfce7 !important; color: #166534; font-weight: 600; }
  .gradient-border { border: 3px solid transparent; border-radius: 12px; background: linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #f59e0b, #1d4ed8) border-box !important; }
</style>
<div class="row">
  <div class="accent">Callout with an accent border</div>
  <div class="dashed">Upload area (dashed)</div>
  <div class="outline">Outline with offset</div>
  <div class="pill">Pill badge</div>
  <div class="gradient-border">Gradient border</div>
</div>
```

`outline` doesn't take up space or change layout, which is why browsers use it for focus rings. Never remove focus outlines without providing a visible replacement.

## Layered, realistic shadows

Real shadows are soft and come from one light direction. Layering two or three shadows looks more natural than one heavy shadow:

```try-html
<style>
  body { background: #f1f5f9; font: 14px system-ui; }
  .cards { display: flex; gap: 20px; flex-wrap: wrap; padding: 16px; }
  .c { width: 150px; height: 90px; background: #fff; border-radius: 12px; display: grid; place-items: center; }
  .heavy { box-shadow: 0 0 20px #000; }
  .soft { box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.08); }
  .lifted { box-shadow: 0 2px 4px rgba(15,23,42,.06), 0 12px 32px rgba(15,23,42,.14); transform: translateY(-2px); }
  .glow { box-shadow: 0 0 0 4px rgba(29,78,216,.25); }
</style>
<div class="cards">
  <div class="c heavy">Too heavy</div>
  <div class="c soft">Soft (resting)</div>
  <div class="c lifted">Lifted (hover)</div>
  <div class="c glow">Focus ring</div>
</div>
```

Use stronger shadows for elements that are "higher" (dropdowns, modals) and lighter ones for cards resting on the page.

## Design consistency with variables

```css
:root {
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-1: 0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.08);
  --shadow-2: 0 2px 4px rgba(15,23,42,.06), 0 12px 32px rgba(15,23,42,.14);
  --border: 1px solid #e2e8f0;
}
.card { border: var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-1); }
.card:hover { box-shadow: var(--shadow-2); }
.modal { border-radius: var(--radius-lg); box-shadow: var(--shadow-2); }
```

A small set of radii and shadows used everywhere is what makes professional sites feel consistent.

## Dark mode considerations

Shadows are almost invisible on dark backgrounds. In dark mode, show depth with lighter surface colours and subtle borders instead:

```css
@media (prefers-color-scheme: dark) {
  .card { background: #1e293b; border: 1px solid #334155; box-shadow: none; }
}
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Text on photos without an overlay | Add a dark gradient overlay or text background |
| Background image with no colour fallback | Add a background-color |
| Very dark, large shadows | Use low-opacity, layered shadows |
| Different border radius on every component | Use 2 or 3 radius variables |
| `outline: none` on buttons and links | Keep a visible `:focus-visible` style |

## Practice

1. Make a hero section with a photo, a dark overlay gradient and white heading text.
2. Build three pricing cards with consistent radius and shadow variables, the middle one "lifted".
3. Create a circular progress indicator showing 65% with a conic gradient.
4. Design an "upload your CV" box with a dashed border that turns solid blue on hover.

:::think Why is it better to put a semi-transparent gradient over a hero photo than to choose a photo that "looks dark enough"?
Photos change: a client replaces the image, or different screen sizes crop different areas, so a light patch may end up behind the text. An overlay guarantees enough contrast for the text regardless of which part of the image shows, keeping it readable and accessible.
:::

```quiz
Q: Which background-size value fills the whole box, cropping if needed?
A: cover
Q: What border-radius turns a square image into a circle?
A: 50% | 50
Q: Which property adds a shadow to a box?
A: box-shadow
Q: Which keyword makes a box-shadow appear inside the element?
A: inset
Q: What is the order of the border shorthand: width style colour, or colour style width?
A: width style colour | width style color
Q: Which gradient type can draw a simple pie chart?
A: conic | conic-gradient
Q: Which property draws a ring that doesn't affect layout and is used for focus styles?
A: outline
Q: Should content images like product photos use img or background-image?
A: img | <img>
```
=== exercise ===
Give `.card` a **border-radius of 12px** and a **box-shadow**.
=== starter ===
<style>
  .card {
    background: #fff;
    padding: 16px;
    
  }
</style>
<div class="card">My card</div>
=== must_contain ===
border-radius: 12px
box-shadow
