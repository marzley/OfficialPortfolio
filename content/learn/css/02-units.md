---
slug: units-sizing
title: CSS units: px, %, em, rem, vw, vh and ch
after: fonts-text
---
# CSS units: px, %, em, rem, vw, vh and ch

Every size in CSS needs a **unit**. Picking the right one is what makes a layout work on a small phone *and* a big monitor.

## Absolute: px

`px` is a fixed size. `16px` is roughly the normal text size. Good for borders (`1px`), shadows and small details.

## Relative to the parent: %

`width: 50%` means half the width of the **parent** element.

## Relative to fonts: em and rem

| Unit | Relative to | Example |
|---|---|---|
| `em` | The element's **own** font size | `padding: 0.5em` grows with the text |
| `rem` | The **root** (`<html>`) font size, usually 16px | `1.5rem` = 24px |

Use `rem` for font sizes and spacing across the site. Use `em` when something should scale with its own text, like button padding.

## Relative to the screen: vw and vh

- `1vw` = 1% of the viewport (screen) **width**.
- `1vh` = 1% of the viewport **height**. `min-height: 100vh` fills the screen.
- On phones the address bar changes the height; `100dvh` (dynamic viewport height) fixes this in modern browsers.

## Relative to characters: ch

`1ch` is the width of the "0" character. `max-width: 65ch` keeps lines readable.

## See them side by side

```try-html
<style>
  body { font-family: system-ui, sans-serif; }
  .bar { background: #ffb800; margin: 6px 0; padding: 4px; white-space: nowrap; }
  .px  { width: 200px; }
  .pct { width: 50%; }
  .rem { width: 15rem; }
  .vw  { width: 40vw; }
  .ch  { width: 20ch; }
  .btn { font-size: 14px; padding: 0.6em 1.2em; background: #0b1b35; color: #fff; border: 0; border-radius: 0.5em; }
  .btn.big { font-size: 22px; }
</style>
<div class="bar px">200px (fixed)</div>
<div class="bar pct">50% of the parent</div>
<div class="bar rem">15rem (15 × 16px = 240px)</div>
<div class="bar vw">40vw (40% of the screen)</div>
<div class="bar ch">20ch (20 characters)</div>
<p><button class="btn">Small</button> <button class="btn big">Big</button></p>
<p>Both buttons use <code>padding: 0.6em 1.2em</code>, so the padding grows with the text.</p>
```

Resize the preview window: the `%` and `vw` bars change, `px` stays the same.

## Useful sizing functions

```css
width: min(100%, 720px);            /* never wider than 720px, never wider than the parent */
font-size: clamp(1rem, 2.5vw, 1.5rem);
height: calc(100vh - 64px);         /* full screen minus a 64px header */
```

## Which unit when?

| Job | Best unit |
|---|---|
| Font sizes | `rem` (or `clamp()` with `rem` and `vw`) |
| Spacing (margin, padding, gap) | `rem` |
| Button padding | `em` |
| Borders | `px` |
| Layout widths | `%`, `fr` (grid), `min()` |
| Full-screen sections | `vh` / `dvh` |
| Text column width | `ch` |

```quiz
Q: Which unit is relative to the root html font size?
A: rem
Q: If the root font size is 16px, how many pixels is 2rem?
A: 32 | 32px
Q: Which unit equals 1% of the screen width?
A: vw
Q: Which unit is good for a readable text width, based on characters?
A: ch
Q: Which CSS function can subtract a header height from 100vh?
A: calc | calc()
```
=== exercise ===
Make the `.box` **50%** wide with padding of **1rem**.
=== starter ===
<style>
  .box {
    background: #ffb800;
    
  }
</style>
<div class="box">Half width</div>
=== must_contain ===
width: 50%
padding: 1rem
