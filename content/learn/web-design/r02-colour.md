---
slug: colour
title: "Colour in web design: colour theory, palettes, the 60-30-10 rule, contrast, accessibility, dark mode and CSS variables"
after: KEEP
---
# Colour in web design: colour theory, palettes, the 60-30-10 rule, contrast, accessibility, dark mode and CSS variables

Colour is often the first thing people notice. It sets the mood (calm, energetic, luxurious, trustworthy), builds brand recognition (think Safaricom green or a bank's signature colour), guides attention to buttons and warnings, and affects readability. Poor colour choices make sites look amateur, tire the eyes and exclude people with colour vision deficiency. This unit teaches practical colour theory and the rules professional designers use, with live examples.

:::note What you will learn
- Colour basics: hue, saturation, lightness; HEX, RGB and HSL
- The colour wheel and harmonies (complementary, analogous, triadic, monochromatic)
- Colour psychology and cultural meaning
- Building a web palette: brand, accent, neutrals, status
- The 60-30-10 rule
- Contrast and WCAG requirements
- Designing for colour blindness
- Dark mode
- Organising colours with CSS variables
- Tools for palettes and contrast checking
:::

## Colour basics

| Term | Meaning |
|---|---|
| **Hue** | The colour family (red, blue, green) |
| **Saturation** | Intensity: vivid vs greyish |
| **Lightness / value** | How light or dark |
| **Tint / shade** | Colour mixed with white / black |

Colour formats in CSS:

| Format | Example | Notes |
|---|---|---|
| HEX | `#0b1b35` | Most common in design tools |
| RGB | `rgb(11 27 53)` | Red, green, blue (0–255) |
| HSL | `hsl(217 66% 13%)` | Hue (0–360°), saturation, lightness: easiest for making lighter/darker variants |
| With transparency | `rgb(11 27 53 / 50%)` | Overlays and shadows |

```try-html
<div style="font-family:system-ui;display:flex;gap:8px;flex-wrap:wrap">
  <div style="background:hsl(217 66% 13%);color:#fff;padding:14px;border-radius:8px">hsl 13%</div>
  <div style="background:hsl(217 66% 30%);color:#fff;padding:14px;border-radius:8px">30%</div>
  <div style="background:hsl(217 66% 50%);color:#fff;padding:14px;border-radius:8px">50%</div>
  <div style="background:hsl(217 66% 75%);padding:14px;border-radius:8px">75%</div>
  <div style="background:hsl(217 66% 95%);padding:14px;border-radius:8px">95%</div>
</div>
```

Changing only the lightness in HSL creates a consistent family of shades from one brand colour.

## Colour harmonies

| Harmony | Description | Feel |
|---|---|---|
| **Monochromatic** | Shades of one hue | Calm, elegant, safe |
| **Analogous** | Neighbours on the wheel (blue, teal, green) | Harmonious, natural |
| **Complementary** | Opposites (blue and orange) | High contrast, energetic: great for a CTA accent |
| **Triadic** | Three evenly spaced hues | Vibrant, playful; use carefully |

A practical approach for most business sites: **one brand colour + one complementary accent + neutrals**.

## Colour psychology (with caution)

| Colour | Common associations | Often used by |
|---|---|---|
| Blue | Trust, calm, professionalism | Banks, tech, health |
| Green | Growth, nature, money, health | Agriculture, finance, eco brands |
| Red | Energy, urgency, passion, danger | Food, sales, alerts |
| Orange/amber | Friendly, energetic, affordable | CTAs, youth brands |
| Yellow | Optimism, attention | Highlights (hard to read as text) |
| Purple | Luxury, creativity | Beauty, premium brands |
| Black | Luxury, sophistication | Fashion, premium |
| White/neutral | Clean, simple | Most backgrounds |

Associations vary by culture and context; test with your actual audience. Consistency with your brand matters more than "perfect" psychology.

## Building a web palette

| Role | Use | Example |
|---|---|---|
| **Primary / brand** | Header, key sections, links | Navy `#0b1b35` |
| **Accent** | Main buttons and highlights only | Amber `#ffb800` |
| **Neutrals** | Text (dark grey), backgrounds (white/off-white), borders (light grey) | `#0f172a`, `#475569`, `#f8fafc`, `#e2e8f0` |
| **Status** | Success, warning, error, info | Green, orange, red, blue |

Create lighter and darker shades of each for hover states, backgrounds and borders.

### The 60-30-10 rule

About **60%** neutral/dominant (backgrounds), **30%** secondary (brand areas, cards, headers), **10%** accent (buttons, key highlights). Keeping the accent rare preserves its power to draw attention.

## Contrast and accessibility

Text must stand out from its background. The **WCAG** (Web Content Accessibility Guidelines) AA level requires:

| Content | Minimum contrast ratio |
|---|---|
| Normal text | **4.5 : 1** |
| Large text (about 24px+, or 19px+ bold) | **3 : 1** |
| UI components and graphics (button borders, icons) | **3 : 1** |

Light grey text on white is the most common failure, and outdoors in bright sunlight on a phone it becomes unreadable.

```try-html
<div style="font-family:system-ui">
  <p style="color:#bbb;background:#fff;padding:10px">Light grey on white: hard to read (fails)</p>
  <p style="color:#475569;background:#fff;padding:10px">Slate grey on white: easy to read (passes)</p>
  <p style="color:#0b1b35;background:#ffb800;padding:10px;font-weight:700">Navy on amber: strong and readable</p>
  <p style="color:#fff;background:#ffb800;padding:10px;font-weight:700">White on amber: too weak (fails)</p>
</div>
```

You can calculate contrast yourself; this is the formula WCAG uses:

```try-javascript
function luminance(hex) {
  const rgb = hex.match(/\w\w/g).map(h => parseInt(h, 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
}
for (const [fg, bg] of [["#bbbbbb", "#ffffff"], ["#475569", "#ffffff"], ["#0b1b35", "#ffb800"], ["#ffffff", "#ffb800"]]) {
  const r = contrast(fg, bg);
  console.log(fg, "on", bg, "=", r + ":1", r >= 4.5 ? "passes" : "fails for normal text");
}
```

## Designing for colour blindness

About 1 in 12 men and 1 in 200 women have some colour vision deficiency (most commonly red–green). Rules:
- **Never use colour alone** to convey meaning. Add icons, text or patterns: "✓ Paid" in green, "✗ Failed: insufficient balance" in red.
- Underline links in body text, or make them clearly distinct beyond colour.
- In charts, use labels and patterns, not just red vs green.
- Test with simulators (browser dev tools can emulate colour vision deficiencies).

## Dark mode

Many users prefer dark interfaces, especially at night. Tips:
- Don't just invert colours: use dark greys (e.g. `#0f172a`) rather than pure black, and off-white text rather than pure white to reduce glare.
- Reduce saturation of bright colours, which vibrate on dark backgrounds.
- Check contrast again in dark mode.
- Respect the user's system setting with `prefers-color-scheme`.

## Organising colours with CSS variables

```try-html
<style>
  :root {
    --brand: #0b1b35;
    --accent: #ffb800;
    --text: #0f172a;
    --muted: #475569;
    --bg: #ffffff;
    --card: #f8fafc;
  }
  @media (prefers-color-scheme: dark) {
    :root { --text: #e2e8f0; --muted: #94a3b8; --bg: #0b1220; --card: #111a2e; }
  }
  .demo { background: var(--bg); color: var(--text); font-family: system-ui; padding: 18px; border-radius: 12px; }
  .demo .card { background: var(--card); padding: 16px; border-radius: 10px; }
  .demo h3 { color: var(--accent); margin: 0 0 6px; }
  .demo p { color: var(--muted); }
  .demo a { background: var(--accent); color: var(--brand); padding: 10px 16px; border-radius: 999px; text-decoration: none; font-weight: 700; }
</style>
<div class="demo"><div class="card"><h3>Grow your business online</h3><p>Colours come from variables, so a whole theme changes in one place.</p><a href="#">Get a quote</a></div></div>
```

Change one variable and the whole site updates, which is how design systems and themes work.

## Tools

| Need | Tools |
|---|---|
| Generate palettes | coolors.co, Adobe Color, Realtime Colors (preview on a website layout) |
| Check contrast | WebAIM Contrast Checker, browser DevTools (Accessibility panel) |
| Extract colours from a logo/photo | Adobe Color, Figma eyedropper |
| Inspiration | Dribbble, Behance, Mobbin (app screens) |

:::think A client wants their website in bright yellow text on a white background with red buttons and green buttons mixed randomly. How would you explain the problems and propose a better palette?
Yellow on white fails contrast (unreadable, inaccessible), and random red/green buttons confuse users, break consistency and fail for colour-blind visitors. Propose: their brand colour for headers, one accent colour reserved for primary buttons, neutral dark text on light backgrounds (4.5:1 contrast), status colours only for success/errors with icons and text, following 60-30-10, stored as CSS variables.
:::

## Summary

- Colours have hue, saturation and lightness; HSL makes shade families easy.
- Use harmonies (often brand + complementary accent + neutrals) and a structured palette with status colours.
- Follow 60-30-10 and keep the accent rare.
- Meet WCAG contrast (4.5:1 normal text, 3:1 large text/UI) and never rely on colour alone.
- Design dark mode thoughtfully and organise colours in CSS variables; use palette and contrast tools.

```quiz
Q: In the 60-30-10 rule, what percentage is the accent colour?
A: 10 | 10%
Q: What minimum contrast ratio does WCAG ask for normal text? (write it like 4.5:1)
A: 4.5:1 | 4.5 : 1 | 4.5
Q: Should colour be the only way to show an error? (yes or no)
A: no
Q: Which colours sit opposite each other on the colour wheel? (one word)
A: complementary
Q: Which CSS media feature detects a user's dark mode preference?
A: prefers-color-scheme
Q: In HSL, which value do you change to make lighter or darker shades?
A: lightness | l
```

=== exercise ===
Create CSS variables `--brand` and `--accent` in `:root` and use them for a heading's `color` and a link's `background`.
=== starter ===
<style>
  :root {  }
</style>
<h1>My shop</h1>
<a href="#">Buy</a>
=== expected ===

=== must_contain ===
--brand
--accent
var(--brand)
var(--accent)
