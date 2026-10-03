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

## Why units matter

Units decide how your layout reacts to different screens and user settings. A site built only in fixed pixels looks fine on the designer's laptop but breaks on a small phone or when a visitor increases their text size. Choosing the right unit for each job is what makes a layout **responsive** and **accessible** without endless media queries.

## em vs rem in practice

`em` is relative to the element's own font size (or its parent's, for font-size itself), so it compounds when nested. `rem` always refers to the root, so it's predictable:

```try-html
<style>
  html { font-size: 16px; }
  .em-box { font-size: 1.2em; border-left: 4px solid #f59e0b; padding-left: .5em; margin: 4px 0; }
  .rem-box { font-size: 1.2rem; border-left: 4px solid #3b82f6; padding-left: .5rem; margin: 4px 0; }
</style>
<div class="em-box">em level 1
  <div class="em-box">em level 2 (bigger)
    <div class="em-box">em level 3 (bigger again)</div>
  </div>
</div>
<div class="rem-box">rem level 1
  <div class="rem-box">rem level 2 (same)
    <div class="rem-box">rem level 3 (same)</div>
  </div>
</div>
```

A good rule: **rem for font sizes**, **em for spacing that should grow with the text of that component** (button padding, icon size next to text).

## Buttons that scale with their text

```try-html
<style>
  .btn { font: 600 1rem system-ui; padding: .6em 1.2em; border-radius: .5em; border: 0; background: #0b1b35; color: #fff; margin: 4px; }
  .small { font-size: .8rem; }
  .large { font-size: 1.3rem; }
</style>
<button class="btn small">Small</button>
<button class="btn">Normal</button>
<button class="btn large">Large</button>
```

Because padding and radius use `em`, changing only `font-size` resizes the whole button proportionally.

## The mobile 100vh problem and new viewport units

On phones, `100vh` can be taller than the visible area because the browser's address bar appears and disappears. Newer units fix this:

| Unit | Meaning |
|---|---|
| `svh` | Small viewport height (address bar shown) |
| `lvh` | Large viewport height (address bar hidden) |
| `dvh` | Dynamic: updates as the bar shows and hides |

```css
.hero {
  min-height: 100vh;      /* fallback for older browsers */
  min-height: 100svh;     /* fits the visible screen on phones */
}
```

Use `min-height` rather than `height` so content can still grow if it doesn't fit.

## min(), max() and clamp() together

```try-html
<style>
  .wrap { width: min(100% - 32px, 960px); margin-inline: auto; background: #e0f2fe; padding: 12px; }
  .card { padding: clamp(12px, 3vw, 32px); background: #fff; border-radius: 12px; }
  .side { width: max(200px, 25%); background: #fef3c7; padding: 8px; margin-top: 8px; }
</style>
<div class="wrap">
  <div class="card">The container is 960px wide on desktop and keeps a 16px gap each side on phones, with no media query. The padding grows with the screen from 12px to 32px.</div>
  <div class="side">At least 200px, or 25% when that's bigger.</div>
</div>
```

`width: min(100% - 32px, 960px)` is a popular one-line responsive container.

## Container query units

When a component should respond to its **container's** size rather than the whole screen, use container queries and `cqi` (1% of the container's inline size):

```try-html
<style>
  .holder { container-type: inline-size; border: 1px dashed #94a3b8; margin: 8px 0; padding: 8px; }
  .holder h3 { font-size: clamp(1rem, 6cqi, 2rem); margin: 0; }
  .narrow { width: 220px; }
</style>
<div class="holder"><h3>Wide container heading</h3></div>
<div class="holder narrow"><h3>Narrow container heading</h3></div>
```

The same card can sit in a wide main column or a narrow sidebar and size its text appropriately.

## Unitless line-height

```css
p { line-height: 1.6; }      /* good: 1.6 × each element's own font size */
p { line-height: 1.6em; }    /* risky: children inherit a fixed computed value */
```

Unitless values scale correctly for nested elements with different font sizes.

## Other units you'll meet

| Unit | Meaning | Use |
|---|---|---|
| `fr` | Fraction of free space (Grid only) | `grid-template-columns: 1fr 2fr` |
| `deg`, `turn` | Angles | `rotate(45deg)`, `rotate(.5turn)` |
| `s`, `ms` | Time | `transition: .3s` |
| `lh` | Current line height | Spacing that matches lines of text |
| `pt`, `cm`, `mm` | Print units | Print stylesheets only |

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `width: 100vw` on a full-width section | Causes horizontal scroll (includes the scrollbar) | `width: 100%` |
| Fixed `height` on text boxes | Text overflows when it wraps or zooms | `min-height` or no height |
| Font sizes in `vw` only | Too tiny on phones, huge on TVs, ignores zoom | `clamp(1rem, ..., 2rem)` |
| Nested `em` font sizes | Text keeps growing or shrinking | `rem` for font sizes |

## Practice

1. Build a container that's 1100px max, with 20px side gaps on phones, using `min()`.
2. Make a button set (small, normal, large) that only changes `font-size`.
3. Create a hero that fills the visible phone screen with `svh` and a fallback.
4. Make a card heading that adapts to its container with `cqi`.

:::think A section uses `width: 100vw` and the page scrolls sideways on Windows laptops but not on phones. Why?
On desktop, `100vw` includes the width of the vertical scrollbar, so the section is wider than the visible area by the scrollbar's width. Phones usually have overlay scrollbars that take no space. Use `width: 100%` (or no width on a block element) instead.
:::

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
Q: Which unit is 1% of a container's inline size in container queries?
A: cqi
Q: Which viewport height unit updates as the mobile address bar shows and hides?
A: dvh
Q: Should line-height usually be unitless? (yes or no)
A: yes
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
