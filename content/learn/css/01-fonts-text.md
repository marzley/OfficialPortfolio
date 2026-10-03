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

## Why typography matters

About 90% of most websites is text. Good typography makes a site feel trustworthy, readable on cheap phones in sunlight, and accessible to older visitors and people with low vision. Bad typography (tiny grey text, long lines, too many fonts) makes visitors leave even when the content is good. Designers, front-end developers, bloggers and anyone building a business site use these properties daily.

## Readability rules that work

| Rule | Value | Why |
|---|---|---|
| Body text size | 16px to 18px (`1rem` to `1.125rem`) | Smaller is hard to read on phones |
| Line height | 1.5 to 1.7 for paragraphs; 1.1 to 1.3 for headings | Gives the eye room to find the next line |
| Line length | 45 to 75 characters (`max-width: 65ch`) | Long lines are tiring; short lines feel choppy |
| Contrast | At least 4.5:1 for body text | Required for accessibility (WCAG AA) |
| Fonts per site | One or two families | More looks messy and loads slowly |
| Paragraph spacing | `margin-bottom: 1em` or more | Separates ideas clearly |

## Fluid type with clamp()

`clamp(min, preferred, max)` lets headings grow smoothly with the screen without media queries:

```try-html
<style>
  body { font-family: system-ui, sans-serif; margin: 16px; }
  h1 { font-size: clamp(1.6rem, 1rem + 3vw, 3rem); line-height: 1.15; margin: 0 0 .4em; }
  h2 { font-size: clamp(1.25rem, 1rem + 1.5vw, 2rem); line-height: 1.2; }
  p  { font-size: clamp(1rem, .95rem + .25vw, 1.125rem); line-height: 1.65; max-width: 65ch; color: #1f2937; }
</style>
<h1>Websites that bring customers</h1>
<h2>Fast, mobile-friendly and easy to update</h2>
<p>Resize the preview: the heading grows on wide screens and shrinks on phones, but never below 1.6rem or above 3rem. The paragraph keeps a comfortable line length thanks to max-width in ch units.</p>
```

## A type scale

Pick sizes from a consistent scale (each step about 1.25× the last) instead of random numbers:

```try-html
<style>
  :root { --step-0: 1rem; --step-1: 1.25rem; --step-2: 1.563rem; --step-3: 1.953rem; --step-4: 2.441rem; }
  body { font-family: Georgia, serif; margin: 16px; }
  .s4 { font-size: var(--step-4); } .s3 { font-size: var(--step-3); } .s2 { font-size: var(--step-2); }
  .s1 { font-size: var(--step-1); } .s0 { font-size: var(--step-0); }
  div { margin: 4px 0; }
</style>
<div class="s4">Step 4: page title</div>
<div class="s3">Step 3: section heading</div>
<div class="s2">Step 2: card title</div>
<div class="s1">Step 1: lead paragraph</div>
<div class="s0">Step 0: body text</div>
```

Storing sizes in CSS variables means one change updates the whole site.

## Loading web fonts quickly

Fonts are files that must download. Slow font loading causes invisible text or a jump in layout.

- Use only the weights you need (for example 400 and 700), not all nine.
- Add `font-display: swap` so text shows immediately in a fallback font.
- Self-host fonts (download the `.woff2` files) for speed and privacy, or preconnect to the font server.
- Choose a fallback font with similar size to reduce layout shift.
- Consider **system fonts** (`system-ui`): zero download, and they look native on every device.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-400.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-700.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}
body { font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
```

## Pairing fonts

| Pairing | Feel | Good for |
|---|---|---|
| One sans-serif in two weights | Clean, modern | Tech companies, apps, most business sites |
| Serif headings + sans-serif body | Classic and friendly | Law firms, schools, blogs, hotels |
| Sans-serif headings + serif body | Editorial | Magazines, long articles |
| Monospace for code only | Technical | Documentation, tutorials |

Avoid decorative or script fonts for body text; use them only for a logo or a short heading, if at all.

## More text properties

```try-html
<style>
  body { font-family: system-ui, sans-serif; margin: 16px; }
  .spaced { letter-spacing: .12em; text-transform: uppercase; font-size: .8rem; font-weight: 700; color: #6b7280; }
  .indent { text-indent: 2em; }
  .clamp { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 320px; }
  .balance { text-wrap: balance; max-width: 360px; font-size: 1.4rem; font-weight: 700; }
  .nums { font-variant-numeric: tabular-nums; }
  a { color: #1d4ed8; text-underline-offset: 3px; text-decoration-thickness: 2px; }
</style>
<p class="spaced">Our services</p>
<p class="balance">Website design, hosting and digital marketing for growing businesses</p>
<p class="clamp">This product description is long and will be cut after exactly two lines with an ellipsis, which keeps product cards in a grid the same height no matter how much text the seller typed.</p>
<p class="indent">Text indent pushes the first line in, like a printed book.</p>
<p class="nums">KSh 1,111.00<br>KSh 9,999.00</p>
<p>A <a href="#">well-styled link</a> with offset underline.</p>
```

`tabular-nums` makes every digit the same width so prices line up in tables.

## Accessibility checklist for text

- Never set body text below 16px, and let users zoom (don't block zoom in the viewport meta tag).
- Use `rem` for font sizes so the user's browser setting is respected.
- Don't use colour alone to show meaning (add underline to links in paragraphs).
- Avoid long passages in all capitals or italics; they are harder to read.
- Check contrast with DevTools or an online contrast checker.

## Common mistakes

| Mistake | Fix |
|---|---|
| Light grey text on white (`#aaa` on `#fff`) | Use a darker grey like `#374151` |
| Full-width paragraphs on desktop | `max-width: 65ch` |
| Loading 6 font weights | Load 2 or 3 |
| `font-size` in px everywhere | `rem` for text so zoom settings work |
| Justified text on narrow screens | Left-align; justify causes big gaps |

## Practice

1. Style an article page with a type scale of 5 steps in CSS variables.
2. Make a hero heading fluid with `clamp()` from 1.8rem to 3.5rem.
3. Create a pricing table where numbers line up using `tabular-nums`.
4. Build product cards whose descriptions are clamped to 3 lines.

:::think Why is `font-size: 1rem` better than `font-size: 16px` for body text, even though they look the same by default?
Users with low vision often raise their browser's default font size. `rem` scales with that setting, so text grows as they expect; `px` ignores it in many browsers, keeping text small. Using rem respects the user's choice and improves accessibility.
:::

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
Q: Which max-width keeps paragraphs at a readable length using character units? (e.g. 65...)
A: 65ch | ch
Q: Which @font-face setting shows fallback text immediately while the font loads?
A: font-display: swap | swap | font-display
Q: What minimum contrast ratio is recommended for body text (WCAG AA)?
A: 4.5:1 | 4.5
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
