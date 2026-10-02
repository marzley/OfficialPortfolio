---
slug: flexbox
title: "Flexbox layout: rows, columns, alignment, wrapping and real layouts"
after: KEEP
---
# Flexbox layout: rows, columns, alignment, wrapping and real layouts

Before Flexbox, putting items side by side, spacing them evenly or centring something vertically took confusing hacks (floats, tables, negative margins). **Flexbox** (the Flexible Box Layout) made these everyday layouts simple. Navigation bars, button groups, card rows, footers, centring a login box, a header with a logo on the left and a menu on the right: all Flexbox. This unit explains every important Flexbox property with live examples you can change.

:::note What you will learn
- What Flexbox is, when to use it, and when Grid is better
- Flex containers and flex items; the main axis and cross axis
- `flex-direction`, `justify-content`, `align-items`, `gap`, `flex-wrap`
- Item properties: `flex-grow`, `flex-shrink`, `flex-basis`, `flex`, `order`, `align-self`
- Real patterns: navbar, centring, cards that wrap, sticky footer, media object
- Common mistakes and debugging
:::

## What is Flexbox?

:::define Flexbox
A one-dimensional CSS layout system for arranging items in a **row or a column**, distributing space between them and aligning them, even when their sizes are unknown or change.
:::

"One-dimensional" means Flexbox thinks about **one direction at a time** (a row *or* a column). For two-dimensional layouts (rows *and* columns together, like a full page grid), **CSS Grid** is usually better. Many layouts use both: Grid for the page, Flexbox inside components.

### Who uses it and where

Every modern website uses Flexbox: menus on eCitizen and bank websites, product card rows on Jumia, app-like interfaces, buttons with icons. It's supported by all modern browsers.

## Container and items

Flexbox has two roles:
- The **flex container**: the parent, where you write `display: flex`.
- The **flex items**: its **direct children**, which get arranged.

```try-html
<style>
  .row { display: flex; gap: 10px; background: #f1f5f9; padding: 10px; }
  .row div { background: #0b1b35; color: #fff; padding: 14px; border-radius: 8px; }
</style>
<div class="row">
  <div>Tea</div>
  <div>Coffee</div>
  <div>Juice</div>
</div>
```

Just `display: flex` puts the children in a row. Only **direct children** become flex items; grandchildren aren't affected (unless their parent is also a flex container).

## The two axes

- **Main axis:** the direction items flow (left→right for a row).
- **Cross axis:** perpendicular to it (top→bottom for a row).

`flex-direction` sets the main axis:

| Value | Main axis |
|---|---|
| `row` (default) | Horizontal, left to right |
| `row-reverse` | Horizontal, right to left |
| `column` | Vertical, top to bottom |
| `column-reverse` | Vertical, bottom to top |

**Key rule:** `justify-content` aligns along the **main** axis; `align-items` aligns along the **cross** axis. When you change `flex-direction` to `column`, they swap visual directions.

## `justify-content`: spacing along the main axis

```try-html
<style>
  .demo { display: flex; background: #f1f5f9; padding: 8px; margin-bottom: 8px; border: 1px dashed #94a3b8; }
  .demo span { background: #f59e0b; padding: 8px 14px; border-radius: 6px; }
</style>
<p><code>flex-start</code></p><div class="demo" style="justify-content: flex-start"><span>A</span><span>B</span><span>C</span></div>
<p><code>center</code></p><div class="demo" style="justify-content: center"><span>A</span><span>B</span><span>C</span></div>
<p><code>flex-end</code></p><div class="demo" style="justify-content: flex-end"><span>A</span><span>B</span><span>C</span></div>
<p><code>space-between</code></p><div class="demo" style="justify-content: space-between"><span>A</span><span>B</span><span>C</span></div>
<p><code>space-around</code></p><div class="demo" style="justify-content: space-around"><span>A</span><span>B</span><span>C</span></div>
<p><code>space-evenly</code></p><div class="demo" style="justify-content: space-evenly"><span>A</span><span>B</span><span>C</span></div>
```

| Value | Effect |
|---|---|
| `flex-start` | Packed at the start |
| `center` | Centred |
| `flex-end` | Packed at the end |
| `space-between` | First at start, last at end, equal gaps between |
| `space-around` | Equal space around each item (half-size at edges) |
| `space-evenly` | Exactly equal gaps everywhere |

## `align-items`: alignment on the cross axis

```try-html
<style>
  .tall { display: flex; height: 110px; background: #f1f5f9; margin-bottom: 8px; gap: 6px; padding: 6px; border: 1px dashed #94a3b8; }
  .tall span { background: #2563eb; color: #fff; padding: 8px; }
  .tall span:nth-child(2) { font-size: 26px; }
</style>
<p><code>stretch</code> (default: items fill the height)</p><div class="tall" style="align-items: stretch"><span>A</span><span>B</span><span>C</span></div>
<p><code>center</code></p><div class="tall" style="align-items: center"><span>A</span><span>B</span><span>C</span></div>
<p><code>flex-start</code></p><div class="tall" style="align-items: flex-start"><span>A</span><span>B</span><span>C</span></div>
<p><code>baseline</code> (text lines up)</p><div class="tall" style="align-items: baseline"><span>A</span><span>B</span><span>C</span></div>
```

## Perfect centring (the famous one)

Centring something both horizontally and vertically used to be hard. With Flexbox:

```try-html
<style>
  .screen { display: flex; justify-content: center; align-items: center; height: 220px; background: #0b1b35; }
  .login { background: #fff; padding: 20px 28px; border-radius: 12px; font-family: sans-serif; }
</style>
<div class="screen">
  <div class="login">Centred login box</div>
</div>
```

## `gap`: space between items

`gap: 16px;` adds space **between** items (not at the outer edges), cleaner than margins. You can set `row-gap` and `column-gap` separately.

## `flex-wrap`: let items move to the next line

By default, flex items try to fit on **one line** and shrink. `flex-wrap: wrap` lets them wrap onto new lines, essential for responsive card layouts.

```try-html
<style>
  .cards { display: flex; flex-wrap: wrap; gap: 12px; }
  .card { flex: 1 1 160px; background: #fff7e0; border: 1px solid #f59e0b; border-radius: 10px; padding: 14px; font-family: sans-serif; }
</style>
<div class="cards">
  <div class="card">Websites</div>
  <div class="card">Mobile apps</div>
  <div class="card">Hosting</div>
  <div class="card">SEO</div>
  <div class="card">M-Pesa integration</div>
</div>
<p>Make the preview narrower (or imagine a phone): cards wrap onto new lines.</p>
```

`flex-flow: row wrap;` is a shorthand for direction + wrap.

## Item properties

### `flex-grow`: take extra space

How much of the **leftover** space an item takes, relative to others. `flex-grow: 1` on all items = equal share. `flex-grow: 2` on one item = twice the share of extra space.

### `flex-shrink`: give up space when tight

Default `1` (items shrink equally). `flex-shrink: 0` stops an item shrinking (e.g. a logo or avatar).

### `flex-basis`: starting size

The item's ideal size before growing/shrinking (`200px`, `30%`, or `auto` = use its content/width).

### `flex` shorthand

`flex: grow shrink basis`:

| Shorthand | Meaning | Typical use |
|---|---|---|
| `flex: 1` | `1 1 0%`: grow and shrink equally from zero | Equal-width columns |
| `flex: 1 1 200px` | Start at 200px, grow and shrink | Responsive cards |
| `flex: 0 0 250px` | Exactly 250px, no grow/shrink | Fixed sidebar |
| `flex: auto` | `1 1 auto`: grow from content size | Flexible content areas |
| `flex: none` | `0 0 auto`: fixed at content size | Icons, buttons |

```try-html
<style>
  .layout { display: flex; gap: 10px; font-family: sans-serif; }
  .side { flex: 0 0 140px; background: #e0f2fe; padding: 10px; }
  .main { flex: 1; background: #f1f5f9; padding: 10px; }
</style>
<div class="layout">
  <aside class="side">Sidebar: fixed 140px</aside>
  <main class="main">Main content: takes all remaining space</main>
</div>
```

### `order`

Changes visual order without changing HTML (`order: -1` moves first). Use carefully: screen readers and keyboard focus still follow the HTML order, so don't create confusing mismatches.

### `align-self`

Overrides `align-items` for one item (e.g. one item at the bottom).

### Pushing an item with `margin-left: auto`

In a flex row, `margin-left: auto` on an item pushes it (and everything after it) to the far right. A favourite trick for headers.

## Real-world patterns

### 1. Navigation bar

```try-html
<style>
  .nav { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: #0b1b35; font-family: sans-serif; }
  .nav a { color: #fff; text-decoration: none; }
  .logo { font-weight: 800; color: #ffb800 !important; }
  .nav .cta { margin-left: auto; background: #ffb800; color: #0b1b35; padding: 8px 14px; border-radius: 8px; font-weight: bold; }
</style>
<nav class="nav">
  <a class="logo" href="#">Juma Electronics</a>
  <a href="#">Phones</a>
  <a href="#">Laptops</a>
  <a class="cta" href="#">WhatsApp us</a>
</nav>
```

### 2. Media object (image beside text)

```try-html
<style>
  .media { display: flex; gap: 12px; align-items: flex-start; font-family: sans-serif; max-width: 420px; }
  .media img { flex: none; border-radius: 50%; }
  .media h4 { margin: 0 0 4px; }
  .media p { margin: 0; color: #475569; }
</style>
<div class="media">
  <img src="https://picsum.photos/64/64" alt="" width="64" height="64">
  <div><h4>Wanjiku M.</h4><p>"They built our school website in two weeks and trained our staff to update it."</p></div>
</div>
```

### 3. Sticky footer (footer at the bottom even on short pages)

```
body { min-height: 100vh; display: flex; flex-direction: column; margin: 0; }
main { flex: 1; }      /* main grows, pushing the footer down */
```

### 4. Equal-height cards with buttons at the bottom

```
.card { display: flex; flex-direction: column; }
.card .btn { margin-top: auto; }   /* pushes the button to the bottom of each card */
```

:::think A row has three items with flex: 1, but one item contains a very long unbroken URL and it stays much wider. Why?
Flex items have an automatic minimum size based on their content (`min-width: auto`), so they won't shrink smaller than their longest unbreakable word. Fix: `min-width: 0` on the item and/or `overflow-wrap: anywhere` on the text, so it can shrink and wrap.
:::

## Flexbox vs Grid: choosing

| Use Flexbox when... | Use Grid when... |
|---|---|
| Arranging items in one row or column | Arranging in rows **and** columns |
| Content size should drive the layout | The layout should drive content placement |
| Navbars, toolbars, button groups, centring | Page layouts, galleries, dashboards, forms in columns |

## Common mistakes

| Mistake | Fix |
|---|---|
| `display: flex` on the children instead of the parent | Put it on the container |
| Using `justify-content` to align vertically in a row | That's `align-items` (cross axis) |
| Items squashing instead of wrapping | `flex-wrap: wrap` + a `flex-basis` |
| Margins for spacing everywhere | Use `gap` |
| Long words overflowing | `min-width: 0` and `overflow-wrap: anywhere` |
| Reordering with `order` for important content | Change the HTML order instead |

## Practice tasks

1. Build a header with a logo on the left, three links in the middle-left and a button pushed right.
2. Centre a "Coming soon" box on a 300px-tall dark section.
3. Make a row of 6 service cards that wraps responsively with `flex: 1 1 200px` and `gap`.
4. Build a two-column layout: fixed 240px sidebar + flexible main.
5. Make three cards of different text lengths with buttons aligned at the bottom.

## Summary

- `display: flex` on a parent makes its direct children flex items in a row (or column with `flex-direction`).
- `justify-content` = main axis; `align-items` = cross axis; `gap` = spacing between items; `flex-wrap: wrap` = responsive wrapping.
- Items: `flex-grow`, `flex-shrink`, `flex-basis` and the `flex` shorthand (`flex: 1`, `flex: 0 0 250px`), plus `order`, `align-self` and `margin-left: auto`.
- Patterns: navbar, perfect centring, wrapping cards, sidebar layouts, sticky footer, equal-height cards.
- Flexbox is one-dimensional; use Grid for two-dimensional layouts.

```quiz
Q: Which property and value turn an element into a flex container? Write as property: value.
A: display: flex | display:flex
Q: Which property aligns items along the main axis?
A: justify-content
Q: Which property aligns items along the cross axis?
A: align-items
Q: Which value of justify-content puts equal gaps between items with none at the edges?
A: space-between
Q: Which property lets flex items move onto a new line?
A: flex-wrap
Q: What does flex: 0 0 250px mean in plain words? (one word: the item is ... at 250px)
A: fixed | fixed width | fixed size
Q: Which margin value pushes a flex item to the far right? Write as property: value.
A: margin-left: auto | margin-left:auto
Q: Is Flexbox one-dimensional or two-dimensional?
A: one-dimensional | one | 1
```
=== exercise ===
Make `.menu` a flex container with a **gap** between the items.
=== starter ===
<style>
  .menu {
    
  }
</style>
<div class="menu"><span>Tea</span><span>Coffee</span><span>Juice</span></div>
=== expected ===

=== must_contain ===
display
flex
gap
