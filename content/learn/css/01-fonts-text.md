---
slug: fonts-text
title: Fonts and text styling
after: selectors-colours
---
# Fonts and text styling

Most of a website is text, so good typography is the fastest way to make a page look professional. This lesson covers every text property you'll use daily.

## font-family and font stacks

`font-family` lists fonts in order of preference. The browser uses the first one it has.

```css
body { font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif; }
code { font-family: "Fira Code", Consolas, monospace; }
```

Always end with a **generic family**: `sans-serif`, `serif` or `monospace`. The fastest choice is the **system font stack**, which uses the phone's own font and downloads nothing:

```css
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
```

## Size, weight, style and line height

```try-html
<style>
  body { font-family: system-ui, sans-serif; }
  h1 { font-size: 2rem; font-weight: 800; line-height: 1.2; }
  p { font-size: 1.05rem; line-height: 1.6; max-width: 60ch; }
  .light { font-weight: 300; }
  .italic { font-style: italic; }
</style>
<h1>Fresh mangoes from Makueni</h1>
<p>Sweet, juicy and picked this week. We deliver across Nairobi every Tuesday and Friday. Order on WhatsApp and pay with M-Pesa when the fruit arrives.</p>
<p class="light">A light weight (300).</p>
<p class="italic">An italic style.</p>
```

| Property | Common values | Tip |
|---|---|---|
| `font-size` | `16px`, `1rem`, `1.25rem` | Use `rem` so text respects the user's settings |
| `font-weight` | `400` normal, `600` semibold, `700` bold | Only use weights the font has |
| `font-style` | `normal`, `italic` | |
| `line-height` | `1.5`, `1.6` (no unit) | 1.5–1.7 for body text is easiest to read |
| `max-width` on text | `60ch` | 50–75 characters per line reads best |

## Alignment, decoration and case

```try-html
<style>
  .center { text-align: center; }
  .upper { text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.8rem; color: #955a06; font-weight: 700; }
  a { color: #2563eb; text-decoration: underline; text-underline-offset: 3px; }
  .no-line { text-decoration: none; }
  .strike { text-decoration: line-through; color: #64748b; }
  .indent { text-indent: 2em; }
</style>
<p class="upper">Our services</p>
<h2 class="center">Websites that bring customers</h2>
<p><a href="#">A normal underlined link</a> and <a class="no-line" href="#">one without a line</a>.</p>
<p>Was <span class="strike">KSh 30,000</span>, now KSh 25,000.</p>
<p class="indent">This paragraph starts with an indent, like a book.</p>
```

## Web fonts (Google Fonts)

To use a font the visitor may not have, load it. From fonts.google.com you get a line like:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

then:

```css
body { font-family: "Poppins", sans-serif; }
```

Tips for speed:

- Load only the weights you use (e.g. 400 and 700).
- Keep `display=swap` so text shows immediately in a backup font.
- One font family is usually enough; two at most (one for headings, one for body).

## Text shadow and overflow

```try-html
<style>
  .hero { background: #0b1b35; color: #fff; padding: 20px; font-size: 1.8rem; text-shadow: 0 2px 8px rgba(0,0,0,.5); }
  .cut { width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border: 1px solid #ccc; padding: 6px; }
</style>
<div class="hero">Technology for real solutions</div>
<p class="cut">This very long product name will be cut with three dots at the end</p>
```

## A good typography starter

```css
html { font-size: 100%; }             /* respect the user's setting (usually 16px) */
body { font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b; }
h1, h2, h3 { line-height: 1.2; color: #0b1b35; }
h1 { font-size: clamp(1.8rem, 5vw, 3rem); }
p { max-width: 65ch; }
```

`clamp(min, preferred, max)` makes the heading grow with the screen but never smaller than `1.8rem` or larger than `3rem`.

```quiz
Q: Which generic font family should end a font stack for normal text: serif, sans-serif or monospace?
A: sans-serif | sans serif
Q: Which property sets the space between lines of text?
A: line-height
Q: What font-weight number is normal text?
A: 400
Q: Which property makes text uppercase without retyping it?
A: text-transform
Q: Which CSS function sets a size with a minimum, a preferred value and a maximum?
A: clamp | clamp()
```
=== exercise ===
Style the paragraph: give `p` a `line-height` of **1.6** and a `font-family` that ends with **sans-serif**.
=== starter ===
<style>
  p {
    
  }
</style>
<p>Karibu! We build websites for small businesses in Kenya.</p>
=== must_contain ===
line-height: 1.6
sans-serif
