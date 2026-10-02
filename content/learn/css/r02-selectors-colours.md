---
slug: selectors-colours
title: "Selectors and colours: targeting exactly the right elements and colouring them well"
after: KEEP
---
# Selectors and colours: targeting exactly the right elements and colouring them well

Every CSS rule starts with a **selector**: the part that says *which* elements to style. Choosing the right selector is the difference between a stylesheet that's clean and predictable and one where changing a button breaks the footer. Colour is the first thing most people style, and it carries meaning, brand and accessibility. This unit covers both in depth.

:::note What you will learn
- Element, class, ID and universal selectors
- Grouping, descendant, child and sibling selectors
- Attribute selectors and a preview of pseudo-classes
- Naming classes well
- Colour formats: names, HEX, RGB, HSL, transparency
- Colour on text, backgrounds and borders
- Choosing colour palettes and checking contrast for accessibility
:::

## Part 1: Selectors

### Why selectors matter

A stylesheet for a real site has hundreds of rules. Good selectors:
- style exactly what you intend and nothing else,
- are easy to read and reuse,
- don't create specificity battles that force `!important`.

### The basic selectors

| Selector | Example | Selects |
|---|---|---|
| **Element (type)** | `p` | Every `<p>` |
| **Class** | `.price` | Every element with `class="price"` |
| **ID** | `#main-header` | The one element with `id="main-header"` |
| **Universal** | `*` | Every element |

```try-html
<style>
  p { color: #334155; }               /* all paragraphs */
  .price { color: #dc2626; font-weight: bold; }   /* anything with class="price" */
  #promo { background: #fef3c7; padding: 8px; }   /* the element with id="promo" */
</style>
<p>Fresh mandazi every morning.</p>
<p class="price">KSh 20 each</p>
<p id="promo">Buy 10, get 2 free this week!</p>
```

### Classes: your main tool

- An element can have **several classes**: `class="btn btn-primary large"`.
- A class can be used on **many elements**.
- Classes describe purpose, so they're the most reusable selector.

```try-html
<style>
  .btn { display: inline-block; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: bold; }
  .btn-primary { background: #0b1b35; color: #fff; }
  .btn-whatsapp { background: #25d366; color: #fff; }
</style>
<a class="btn btn-primary" href="#">Get a quote</a>
<a class="btn btn-whatsapp" href="#">Chat on WhatsApp</a>
```

Notice the pattern: a base class (`.btn`) for shared styles plus modifier classes (`.btn-primary`, `.btn-whatsapp`) for differences.

### IDs: use sparingly in CSS

An `id` must be **unique** on the page. IDs are perfect for links (`#contact`), labels (`for="email"`) and JavaScript, but in CSS they're so specific that they're hard to override, so most developers style with classes instead.

### Naming classes well

| Weak name | Better name | Why |
|---|---|---|
| `.red-text` | `.error-message` | If the design changes to orange, the name is still true |
| `.big` | `.section-title` | Describes purpose |
| `.box1`, `.box2` | `.service-card` | Meaningful and reusable |
| `.leftColumn` | `.sidebar` | Lowercase with hyphens is the CSS convention |

Many teams use naming systems like **BEM** (Block__Element--Modifier): `.card`, `.card__title`, `.card--featured`.

### Grouping selectors

Apply the same styles to several selectors with commas:

```
h1, h2, h3 { font-family: Georgia, serif; color: #0b1b35; }
```

### Combinators: selecting by relationship

| Combinator | Example | Selects |
|---|---|---|
| **Descendant** (space) | `nav a` | Every `<a>` anywhere inside `<nav>` |
| **Child** `>` | `ul > li` | `<li>` that are direct children of `<ul>` |
| **Adjacent sibling** `+` | `h2 + p` | The first `<p>` right after an `<h2>` |
| **General sibling** `~` | `h2 ~ p` | All `<p>` after an `<h2>` with the same parent |

```try-html
<style>
  nav a { color: #2563eb; margin-right: 12px; text-decoration: none; }
  footer a { color: #64748b; }
  h2 + p { font-size: 18px; font-weight: 600; }   /* the intro paragraph after each h2 */
  .menu > li { display: inline; margin-right: 10px; }  /* only top-level items */
</style>
<nav><a href="#">Home</a><a href="#">Services</a></nav>
<h2>Our services</h2>
<p>This intro paragraph is bigger because it follows the h2.</p>
<p>This normal paragraph isn't.</p>
<ul class="menu">
  <li>Websites
    <ul><li>Business sites (nested, not inline)</li></ul>
  </li>
  <li>Apps</li>
</ul>
<footer><a href="#">Privacy policy</a></footer>
```

:::think Why might "div a" be a bad selector in a large site?
It matches **every link inside any div**, which on most sites is nearly every link: menus, footers, buttons, articles. Styling it would affect far more than intended. A class like `.article a` or `.card-link` targets exactly what you mean.
:::

### Attribute selectors

Select elements by attributes:

| Selector | Selects |
|---|---|
| `[type="email"]` | Elements whose `type` is exactly `email` |
| `a[href^="https"]` | Links whose `href` **starts with** `https` |
| `a[href$=".pdf"]` | Links ending in `.pdf` |
| `a[href*="wa.me"]` | Links **containing** `wa.me` |
| `[disabled]` | Elements that have the attribute at all |

```try-html
<style>
  input[type="email"] { border: 2px solid #2563eb; }
  a[href$=".pdf"]::after { content: " (PDF)"; color: #64748b; }
  a[href*="wa.me"] { color: #128c7e; font-weight: bold; }
</style>
<p><input type="email" placeholder="Email"> <input type="text" placeholder="Name"></p>
<p><a href="price-list.pdf">Download price list</a></p>
<p><a href="https://wa.me/254700000000">WhatsApp us</a></p>
```

### Pseudo-classes (preview)

Pseudo-classes select elements in a **state** or **position**: `a:hover` (mouse over), `input:focus` (being typed in), `li:first-child`, `tr:nth-child(even)`. The dedicated unit covers them fully.

```try-html
<style>
  a:hover { color: #f59e0b; }
  tr:nth-child(even) { background: #f1f5f9; }
</style>
<p><a href="#">Hover over me</a></p>
<table><tr><td>Row 1</td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr><tr><td>Row 4</td></tr></table>
```

## Part 2: Colours

### Where colour is used

| Property | Colours |
|---|---|
| `color` | Text |
| `background-color` (or `background`) | Backgrounds |
| `border-color` (or in `border`) | Borders |
| `outline-color`, `box-shadow`, `text-shadow` | Outlines and shadows |
| `accent-color` | Checkboxes, radios, range sliders |

### Colour formats

| Format | Example | Notes |
|---|---|---|
| **Named** | `red`, `navy`, `tomato` | About 140 names; good for quick tests |
| **HEX** | `#0b1b35`, `#fff` | Most common; `#RRGGBB` in hexadecimal; 3-digit shorthand when pairs repeat |
| **RGB** | `rgb(11 27 53)` or `rgb(11, 27, 53)` | Red, green, blue from 0–255 |
| **RGB with alpha** | `rgb(0 0 0 / 50%)` | Transparency (older syntax: `rgba(0,0,0,0.5)`) |
| **HSL** | `hsl(220 65% 13%)` | Hue (0–360° on the colour wheel), saturation, lightness: easy to make lighter/darker shades |
| **HEX with alpha** | `#0b1b3580` | Last two digits = transparency |

```try-html
<style>
  .swatch { display: inline-block; width: 90px; height: 60px; margin: 4px; color: #fff; font: 12px sans-serif; padding: 4px; vertical-align: top; }
</style>
<div class="swatch" style="background: navy">navy</div>
<div class="swatch" style="background: #0b1b35">#0b1b35</div>
<div class="swatch" style="background: rgb(37 99 235)">rgb(37 99 235)</div>
<div class="swatch" style="background: hsl(142 70% 35%)">hsl(142 70% 35%)</div>
<div class="swatch" style="background: hsl(142 70% 55%)">lighter (55%)</div>
<div class="swatch" style="background: rgb(220 38 38 / 50%); color:#000">50% transparent</div>
```

### Understanding HEX

`#RRGGBB`: each pair is a number from `00` (none) to `FF` (255, full) for red, green and blue.
- `#000000` = black (no light), `#FFFFFF` = white (all light)
- `#FF0000` = pure red, `#00FF00` = green, `#0000FF` = blue
- `#FFB800` = lots of red, some green, no blue = amber/yellow

### Why HSL is handy

With HSL you can create a whole palette from one hue by changing lightness: `hsl(220 65% 20%)` (dark navy), `hsl(220 65% 50%)` (medium blue), `hsl(220 65% 95%)` (very light blue background).

## Colour and design

### Building a palette

A simple, professional palette:

| Role | Example use | Example |
|---|---|---|
| **Primary (brand)** | Header, main buttons | Navy `#0b1b35` |
| **Accent** | Highlights, calls to action | Amber `#ffb800` |
| **Neutral dark** | Body text | `#1e293b` |
| **Neutral light** | Backgrounds, borders | `#f1f5f9`, `#e2e8f0` |
| **Status** | Success, warning, error | Green, amber, red |

Tips:
- Use **one or two brand colours** plus neutrals; too many colours look messy.
- Use the accent colour sparingly so it draws attention to important actions ("Pay now", "Book").
- Pure black text on pure white can be harsh; very dark grey/navy is softer.
- Tools: **Coolors**, **Adobe Color**, Canva's palette generator; take colours from the client's logo.

### Colour meaning

Colours carry associations (which vary by culture): green often suggests money, growth and agriculture (also M-Pesa's brand), red suggests urgency or danger, blue suggests trust (banks, tech). Use status colours consistently: red for errors, green for success.

### Accessibility: contrast

Text must have enough **contrast** against its background. WCAG (the international accessibility guidelines) requires a contrast ratio of at least **4.5:1** for normal text and **3:1** for large text (about 24px, or 19px bold) at level AA.

```try-html
<p style="background:#fff; color:#cbd5e1; padding:8px">Light grey on white: hard to read (fails contrast).</p>
<p style="background:#fff; color:#475569; padding:8px">Slate grey on white: passes.</p>
<p style="background:#ffb800; color:#fff; padding:8px">White on amber: fails.</p>
<p style="background:#ffb800; color:#0b1b35; padding:8px">Navy on amber: passes.</p>
```

Check contrast with tools: Chrome DevTools (shows the ratio when you inspect a text colour), WebAIM Contrast Checker, or Figma plugins.

### Never use colour alone

About 1 in 12 men and 1 in 200 women have some form of colour vision deficiency (most commonly red-green). Don't show meaning with colour only:
- Error fields: red border **plus** an error message and icon.
- Charts: colours **plus** labels or patterns.
- Links in text: colour **plus** underline.

## Common mistakes

| Mistake | Fix |
|---|---|
| Styling with IDs everywhere | Use classes; keep IDs for links/JS |
| Over-broad selectors (`div a`) | Use specific classes |
| Class names describing looks (`.blue-btn`) | Name by purpose (`.btn-primary`) |
| Forgetting the `.` or `#` | `.price`, `#promo` |
| Low-contrast text | Check 4.5:1 |
| Meaning by colour only | Add text/icons/underlines |
| Ten different brand colours | One or two brand colours + neutrals |

## Practice tasks

1. Create a button system: `.btn` plus three modifiers (primary, secondary, danger).
2. Style only links inside `<nav>` and only paragraphs directly after `<h2>`.
3. Use attribute selectors to add "(PDF)" after PDF links and style WhatsApp links green.
4. Build a 5-colour palette for a Kenyan business in HEX and HSL, and test text contrast.
5. Make a "zebra" table with `tr:nth-child(even)`.

## Summary

- Selectors: element, `.class`, `#id`, `*`; grouping with commas; combinators (space, `>`, `+`, `~`); attribute selectors (`[attr]`, `^=`, `$=`, `*=`); pseudo-classes for states.
- Prefer classes named by purpose; use IDs sparingly in CSS.
- Colour formats: names, HEX, RGB, HSL, with alpha for transparency.
- Build small palettes (brand + accent + neutrals + status), check **4.5:1** contrast, and never rely on colour alone.

```quiz
Q: Which character starts a class selector?
A: . | dot | a dot | full stop
Q: Which character starts an ID selector?
A: # | hash
Q: Which combinator selects only direct children?
A: > | greater than
Q: Which attribute selector operator means "ends with"?
A: $= | $
Q: What colour is #FFFFFF?
A: white
Q: In HSL, what does the L stand for?
A: lightness
Q: What minimum contrast ratio does normal text need at WCAG AA? Write like 4.5:1.
A: 4.5:1 | 4.5
Q: Which selector matches every element?
A: * | asterisk | universal
```
=== exercise ===
Give the paragraph with `class="price"` a **red** colour using a class selector.
=== starter ===
<style>
  
</style>
<p class="price">KSh 900</p>
=== expected ===

=== must_contain ===
.price
color
