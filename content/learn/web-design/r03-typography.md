---
slug: typography
title: "Typography: choosing fonts, pairing, type scales, line length and height, readable text and web font performance"
after: KEEP
---
# Typography: choosing fonts, pairing, type scales, line length and height, readable text and web font performance

Most of a website is **text**: headings, paragraphs, prices, buttons, forms. **Typography** is the craft of making that text readable, clear and attractive. Good typography makes visitors stay and understand; poor typography (tiny grey text, five clashing fonts, lines running the full width of a laptop screen) makes them leave. This unit covers how to choose and pair fonts, set sizes with a type scale, control line length and spacing, and load web fonts without slowing down your site.

:::note What you will learn
- Font categories: serif, sans-serif, display, monospace
- Choosing fonts for brand and readability
- Font pairing rules
- Font size, type scales and responsive sizes with clamp()
- Line height, line length and letter spacing
- Font weight and styles for hierarchy
- Alignment and readability rules
- Web fonts: Google Fonts, self-hosting, performance and font-display
- Typography for different languages and numbers
:::

## Font categories

| Category | Look | Best for | Examples |
|---|---|---|---|
| **Sans-serif** | No small strokes (serifs) at letter ends; clean | Body text and UI on screens | Inter, Roboto, Open Sans, Poppins, Lato, system fonts |
| **Serif** | Small strokes at letter ends; traditional | Headings with elegance; long reading (books, news) | Merriweather, Playfair Display, Lora, Georgia |
| **Display** | Decorative, strong personality | Large headings, logos only | Bebas Neue, Lobster |
| **Monospace** | Every letter the same width | Code, numbers in tables | JetBrains Mono, Fira Code |
| **Handwriting/script** | Personal, decorative | Very sparing accents (invitations) | Pacifico, Dancing Script |

```try-html
<div style="display:grid;gap:10px;font-size:20px">
  <p style="font-family:system-ui,sans-serif;margin:0">Sans-serif: Fresh cakes delivered in Nairobi</p>
  <p style="font-family:Georgia,serif;margin:0">Serif: Fresh cakes delivered in Nairobi</p>
  <p style="font-family:Impact,sans-serif;margin:0;letter-spacing:.03em">Display: FRESH CAKES DELIVERED</p>
  <p style="font-family:ui-monospace,monospace;margin:0">Monospace: KSh 2,500.00</p>
</div>
```

## Choosing fonts

1. **Readability first**: body text needs clear letter shapes, open spaces inside letters (counters), and distinct characters (`Il1`, `O0`).
2. **Match the brand personality**: modern and friendly (rounded sans), professional (neutral sans), luxury (elegant serif), playful (rounded or display for headings).
3. **Check language support**: accents and characters you need.
4. **Check weights available**: at least regular (400), medium/semibold (500–600) and bold (700).
5. **System font stack**: using the device's built-in fonts is fastest and looks native:

```css
font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

## Font pairing

- Use **1–2 fonts** (3 maximum). One family with several weights can be enough.
- Classic pairings: a **serif heading + sans-serif body**, or a strong sans heading + neutral sans body.
- Pair fonts that **contrast** clearly (not two similar sans-serifs that look like a mistake).
- Keep display fonts for large headings only.

Examples: Playfair Display + Inter; Poppins + Open Sans; Merriweather + Source Sans 3; Montserrat + Lato.

## Size and type scales

- Body text on the web: **16–18px** minimum (phones are read at arm's length, often outdoors).
- Small print: not below about 13–14px.
- Use a **type scale**: sizes multiplied by a ratio (e.g. 1.25) so headings feel related.

```try-javascript
const base = 16, ratio = 1.25;
const names = ["small", "body", "h4", "h3", "h2", "h1"];
names.forEach((name, i) => {
  const size = base * ratio ** (i - 1);
  console.log(name.padEnd(6), Math.round(size * 10) / 10 + "px");
});
```

### Responsive sizes with clamp()

`clamp(min, preferred, max)` lets headings grow smoothly between phone and desktop:

```css
h1 { font-size: clamp(1.8rem, 1.2rem + 3vw, 3.2rem); }
body { font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); }
```

Use **rem** units (relative to the root font size) so text respects users who enlarge their browser's default font.

## Line height, line length and letter spacing

| Property | Guideline |
|---|---|
| **Line height** (`line-height`) | 1.5–1.7 for body text; 1.1–1.3 for large headings |
| **Line length** (`max-width`) | About **45–75 characters** per line; `max-width: 65ch` is a handy rule |
| **Paragraph spacing** | Space between paragraphs (e.g. `margin-bottom: 1em`) instead of blank lines |
| **Letter spacing** | Leave body text default; slight positive spacing for small uppercase labels; slight negative for very large headings |

```try-html
<style>
  .bad { font: 14px system-ui; line-height: 1.1; color: #9ca3af; }
  .good { font: 17px system-ui; line-height: 1.6; color: #334155; max-width: 60ch; }
</style>
<p class="bad">Bad: small, cramped, light grey text that runs very wide becomes tiring to read. Visitors skim, miss important details, and often leave without contacting you, especially on phones in bright light.</p>
<p class="good">Good: comfortable size, generous line height, strong contrast and a limited line length make reading easy. Visitors understand your offer and are more likely to call, WhatsApp or buy.</p>
```

## Weight, style and hierarchy

- Use **weight** (400 regular, 600 semibold, 700 bold) and **size** to show hierarchy.
- Avoid using many weights at once; 2–3 is enough.
- Italics for occasional emphasis; avoid long italic passages.
- ALL CAPS only for short labels or buttons, with a little letter spacing; long all-caps text is hard to read and feels like shouting.
- Don't underline text that isn't a link.

## Alignment and readability

- **Left-align** body text (for left-to-right languages). Centred text suits short headings and hero text, not paragraphs.
- Avoid fully **justified** text on the web: it creates uneven gaps ("rivers").
- Break long text with **subheadings, lists, short paragraphs and images**: people scan web pages.
- Make links obvious (colour + underline in body text).

## Numbers and prices

- Use **tabular numbers** in tables so digits line up: `font-variant-numeric: tabular-nums;`.
- Format money consistently: "KSh 2,500" (with thousands separators).
- Make prices prominent with size/weight, not with flashing colours.

## Web fonts and performance

Custom fonts add download time. Best practices:
1. Use **few families and weights** (each weight is a separate file).
2. Prefer **WOFF2** files.
3. **Self-host** fonts (download from Google Fonts and serve from your server) or use Google Fonts with `preconnect`.
4. Use `font-display: swap` so text shows immediately in a fallback font while the custom font loads.
5. Preload the most important font file.
6. Consider **variable fonts**: one file containing many weights.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
body { font-family: "Inter", system-ui, sans-serif; }
```

Always include fallback fonts in the stack.

## Typography checklist

| ✓ | Check |
|---|---|
| | Body text 16–18px, line height ~1.6, contrast 4.5:1+ |
| | Lines about 45–75 characters (`max-width: 65ch`) |
| | 1–2 font families, consistent type scale |
| | Clear heading hierarchy (one H1, then H2/H3) |
| | Left-aligned paragraphs, short and scannable |
| | Fonts load fast (WOFF2, swap, few weights) |
| | Readable on a phone in sunlight |

:::think A designer uses a decorative script font for all body text at 13px, centred, in light grey, with lines spanning the full width of a 1440px screen. List the problems and fixes.
Script fonts are hard to read in body text; 13px is too small; light grey fails contrast; centred long paragraphs are hard to follow; full-width lines are far too long. Fix: a readable sans/serif at 16–18px, dark text with good contrast, left alignment, `max-width` around 65ch, line height ~1.6, and the script font (if kept) only for a short decorative heading.
:::

## Summary

- Sans-serif suits screens and UI; serif adds elegance; display and script fonts are for big headings only.
- Choose readable fonts that match the brand; pair 1–2 fonts with clear contrast.
- Body text 16–18px; build sizes with a type scale; use rem and clamp() for responsive text.
- Line height ~1.5–1.7, line length 45–75 characters, left-aligned scannable paragraphs.
- Load web fonts efficiently: WOFF2, few weights, font-display: swap, self-hosting and fallbacks.

```quiz
Q: What is a comfortable line height for body text? (a number like 1.6)
A: 1.6 | 1.5 | 1.5-1.7 | 1.7
Q: What is a good maximum line length in characters? (e.g. 65ch)
A: 65ch | 65 | 60ch | 75 | 45-75
Q: What is the minimum recommended body font size in pixels?
A: 16 | 16px
Q: Which font-display value shows fallback text while the custom font loads?
A: swap
Q: Which font category has small strokes at the ends of letters?
A: serif
Q: Which CSS function sets a size with a minimum, preferred and maximum value?
A: clamp | clamp()
```

=== exercise ===
Style the paragraph so it has a `font-size` of **17px**, a `line-height` of **1.6** and a `max-width` of **60ch**.
=== starter ===
<style>
  p {  }
</style>
<p>Readable text makes people stay longer on your website.</p>
=== expected ===

=== must_contain ===
font-size
17px
line-height
1.6
max-width
60ch
