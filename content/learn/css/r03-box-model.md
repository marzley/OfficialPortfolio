---
slug: box-model
title: "The box model: content, padding, border, margin and box-sizing"
after: KEEP
---
# The box model: content, padding, border, margin and box-sizing

Here's the most important idea in CSS layout: **every element is a rectangular box**. Headings, paragraphs, images, buttons, even a single link: all boxes. How big each box is and how much space surrounds it is controlled by the **box model**. When layouts break ("why is this wider than I said?", "why is there a gap here?"), the answer is almost always in the box model. Master it and CSS becomes predictable.

:::note What you will learn
- The four layers of every box: content, padding, border, margin
- Setting width and height, and why widths "grow"
- `box-sizing: border-box` and why everyone uses it
- Margin shorthand, centring with `margin: auto`, and collapsing margins
- Block vs inline boxes and how the box model differs
- `min-`/`max-` sizes for responsive boxes
- Seeing the box model in DevTools
:::

## The four layers

From inside to outside:

```
┌─────────────────────────────── margin (transparent space outside) ─┐
│  ┌─────────────────────────── border (the edge line) ───────────┐  │
│  │  ┌─────────────────────── padding (space inside the border) ┐│  │
│  │  │                                                          ││  │
│  │  │                 content (text, image)                    ││  │
│  │  │                                                          ││  │
│  │  └──────────────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

| Layer | What it is | Has background colour? |
|---|---|---|
| **Content** | The text or image itself; sized by `width`/`height` | Yes |
| **Padding** | Space between content and border (breathing room inside) | Yes (the element's background) |
| **Border** | A line around the padding | Its own colour |
| **Margin** | Space outside the border, pushing other elements away | No (always transparent) |

:::define Box model
The CSS rule that every element is a rectangle made of content, padding, border and margin, which together decide how much space the element takes and how far it sits from its neighbours.
:::

Think of a framed photo on a wall: the photo is the **content**, the white mat around it is **padding**, the wooden frame is the **border**, and the gap between this frame and the next one is the **margin**.

```try-html
<style>
  .box {
    width: 220px;
    padding: 20px;
    border: 6px solid #0b1b35;
    margin: 30px;
    background: #fef3c7;   /* fills content + padding */
  }
</style>
<div class="box">Content area. The yellow covers content and padding; the margin outside is transparent.</div>
<div class="box">Second box: notice the margin space between the boxes.</div>
```

Open DevTools (F12), select a box, and look at the box model diagram in the **Computed** tab: you'll see 220 × auto content, 20 padding, 6 border, 30 margin.

## Padding, border and margin properties

Each can be set per side:

```
padding-top: 10px;   padding-right: 20px;   padding-bottom: 10px;   padding-left: 20px;
margin-top: ...      border-left: ...
```

### Shorthand (clockwise from the top: Top, Right, Bottom, Left)

| Shorthand | Means |
|---|---|
| `padding: 20px;` | All four sides 20px |
| `padding: 10px 20px;` | Top/bottom 10px, left/right 20px |
| `padding: 10px 20px 30px;` | Top 10, left/right 20, bottom 30 |
| `padding: 10px 20px 30px 40px;` | Top 10, right 20, bottom 30, left 40 |

Remember **TRBL**: "TRouBLe", top–right–bottom–left, clockwise like a clock.

### Border shorthand

```
border: 2px solid #e2e8f0;      /* width style colour */
border-bottom: 3px dashed red;
border-radius: 12px;            /* rounded corners (not part of the box size) */
```

Border styles: `solid`, `dashed`, `dotted`, `double`, `none`.

```try-html
<style>
  .card { padding: 16px 20px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 16px; }
  .alert { padding: 12px; border-left: 5px solid #dc2626; background: #fef2f2; }
  .tag { padding: 4px 10px; border: 2px dashed #2563eb; border-radius: 999px; }
</style>
<div class="card">A card with padding 16px top/bottom and 20px left/right.</div>
<div class="alert">Your M-Pesa payment failed. Try again.</div>
<p><span class="tag">New</span></p>
```

## Width, height and the "growing box" problem

By default (`box-sizing: content-box`), `width` sets **only the content**. Padding and border are **added on top**:

```
width: 300px + padding 20px × 2 + border 5px × 2 = 350px total
```

This surprises everyone at first: you say 300px, it takes 350px, and your two "50% columns" don't fit side by side.

### The fix: `box-sizing: border-box`

With `border-box`, `width` includes padding and border. You say 300px; it **is** 300px, and the content shrinks to make room.

```try-html
<style>
  .a, .b { width: 300px; padding: 20px; border: 5px solid #0b1b35; margin-bottom: 10px; background: #e0f2fe; }
  .b { box-sizing: border-box; }
</style>
<div class="a">content-box: 300 + 40 + 10 = 350px wide</div>
<div class="b">border-box: exactly 300px wide</div>
```

Almost every professional stylesheet starts with:

```
*, *::before, *::after {
  box-sizing: border-box;
}
```

:::think Two divs are each set to width: 50% with padding: 20px, but the second one drops below the first. Why, and what's the fix?
With the default `content-box`, each box is 50% **plus** 40px padding (plus any border), so together they exceed 100% and the second wraps to the next line. Adding `box-sizing: border-box` makes each box exactly 50% including padding, so they fit side by side. (In modern layouts you'd also often use Flexbox or Grid with `gap`.)
:::

### Height

Usually let height be **automatic** (it grows to fit the content). Fixed heights cause text to overflow when content is longer than expected (or when users enlarge text). Use `min-height` if you need a minimum.

### `min-width`, `max-width`, `min-height`, `max-height`

These make boxes responsive:

```
.container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 16px; }
img { max-width: 100%; height: auto; }     /* images never overflow their container */
.hero { min-height: 60vh; }
```

`max-width` is one of the most useful properties in CSS: full width on phones, capped on big screens.

## Margins in depth

### Centring a block with `margin: auto`

A block with a set width (or max-width) and `margin-left`/`margin-right` set to `auto` is centred horizontally:

```try-html
<style>
  .page { max-width: 420px; margin: 0 auto; padding: 16px; background: #f1f5f9; border: 1px solid #cbd5e1; }
</style>
<div class="page">This box is centred: margin 0 top/bottom, auto left/right.</div>
```

(Vertical centring is easier with Flexbox or Grid, coming soon.)

### Negative margins

Margins can be negative (pulling elements closer or overlapping). Useful occasionally; use with care.

### Collapsing margins

When two **vertical** margins of block elements meet, they don't add up: the **larger one wins**. A paragraph with `margin-bottom: 20px` followed by one with `margin-top: 30px` are 30px apart, not 50px.

```try-html
<style>
  .p1 { margin-bottom: 20px; background: #fde68a; }
  .p2 { margin-top: 30px; background: #bfdbfe; }
</style>
<p class="p1">margin-bottom: 20px</p>
<p class="p2">margin-top: 30px: the gap is 30px, not 50px (margins collapse)</p>
```

Margins don't collapse horizontally, or inside Flexbox/Grid containers. Many developers avoid surprises by using margins in **one direction only** (e.g. only `margin-bottom`) or using `gap` in flex/grid layouts.

## Block vs inline boxes

| | Block (e.g. `div`, `p`, `h1`, `section`) | Inline (e.g. `span`, `a`, `strong`) |
|---|---|---|
| Starts on a new line | Yes | No, flows within text |
| Width | Fills the available width by default | Only as wide as its content |
| `width`/`height` | Respected | **Ignored** |
| Vertical margin/padding | Push other elements | Padding shows but doesn't push lines apart; vertical margins ignored |

`display: inline-block` is a mix: flows inline but respects width, height and all padding/margins. Buttons and badges often use it.

```try-html
<style>
  span.inline { background: #fde68a; padding: 10px; width: 200px; }        /* width ignored */
  span.ib { display: inline-block; background: #bbf7d0; padding: 10px; width: 160px; margin: 6px 0; }
</style>
<p>Text with an <span class="inline">inline span</span> inside: vertical padding overlaps lines.</p>
<p>Text with an <span class="ib">inline-block span</span> that respects width and margins.</p>
```

The **Block vs inline elements** unit goes deeper.

## Outline vs border

`outline` draws a line **outside** the border and **doesn't take up space** (doesn't change layout). Browsers use it for **focus** rings on keyboard navigation. Never remove focus outlines (`outline: none`) without providing a visible replacement; keyboard users need them.

## Practical spacing system

Professional designs use a consistent **spacing scale** rather than random numbers, e.g. 4, 8, 12, 16, 24, 32, 48, 64px. With CSS variables (later): `--space-2: 8px; --space-4: 16px;`. Consistent spacing makes layouts look calm and intentional.

## Common mistakes

| Mistake | Fix |
|---|---|
| Boxes wider than expected | `box-sizing: border-box` on everything |
| Fixed heights cutting off text | Let height be auto or use `min-height` |
| Images overflowing on phones | `max-width: 100%; height: auto;` |
| Expecting margins of 20 + 30 = 50 | Vertical margins collapse (larger wins) |
| Setting width on inline elements | Use `inline-block` or `block` |
| `outline: none` with no replacement | Keep or restyle focus outlines |
| Random spacing values | Use a spacing scale |

## Practice tasks

1. Build a card: 300px wide (border-box), 20px padding, 1px border, 12px radius, 24px margin below. Check its exact size in DevTools.
2. Make two side-by-side boxes at 50% each with padding, first without and then with `border-box`.
3. Centre a 600px-max container with `margin: 0 auto`.
4. Demonstrate margin collapsing with two paragraphs and measure the gap in DevTools.
5. Create a badge using `display: inline-block` with padding and rounded corners.

## Summary

- Every element is a box: **content → padding → border → margin**.
- Shorthands go clockwise: top, right, bottom, left (TRBL).
- Default `content-box` adds padding and border to `width`; `box-sizing: border-box` keeps widths exact (use it everywhere).
- Prefer automatic heights and `max-width` for responsive boxes; centre blocks with `margin: 0 auto`.
- Vertical margins collapse; inline elements ignore width/height; `inline-block` respects them.
- Inspect boxes in DevTools to understand any layout.

```quiz
Q: Which layer of the box model is always transparent?
A: margin
Q: Which layer sits between the content and the border?
A: padding
Q: Which box-sizing value makes width include padding and border?
A: border-box
Q: In "padding: 10px 20px", how much padding is on the left?
A: 20px | 20
Q: Two vertical margins of 20px and 30px meet. What is the gap?
A: 30px | 30
Q: Which value of margin-left and margin-right centres a block with a set width?
A: auto
Q: Do inline elements like span respect width? (yes or no)
A: no
Q: Which property prevents images overflowing their container? Write property: value.
A: max-width: 100% | max-width:100% | max-width
```
=== exercise ===
Give `.box` a padding of **20px** and a **2px solid** border.
=== starter ===
<style>
  .box {
    
  }
</style>
<div class="box">Box</div>
=== expected ===

=== must_contain ===
padding
20px
border
2px solid
