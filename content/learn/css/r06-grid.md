---
slug: grid
title: "CSS Grid layout: rows and columns, areas, auto-fit galleries and full page layouts"
after: KEEP
---
# CSS Grid layout: rows and columns, areas, auto-fit galleries and full page layouts

**CSS Grid** is the most powerful layout system in CSS. Where Flexbox arranges items in one direction, Grid controls **rows and columns at the same time**: whole page layouts, photo galleries, dashboards, pricing tables, magazine-style designs and forms in columns. This unit takes you from your first grid to responsive layouts that need almost no media queries.

:::note What you will learn
- Grid containers, items, lines, tracks, cells and areas
- `grid-template-columns` and `-rows` with px, %, `fr`, `repeat()` and `minmax()`
- `gap`, placing items by line numbers and spanning
- Named template areas for page layouts
- `auto-fit` / `auto-fill` responsive grids
- Alignment in Grid, implicit rows, and Grid vs Flexbox
:::

## What is Grid?

:::define CSS Grid
A two-dimensional layout system: you define **columns and rows** on a container, and place its children into the resulting cells or areas.
:::

## Vocabulary

| Term | Meaning |
|---|---|
| **Grid container** | The element with `display: grid` |
| **Grid items** | Its direct children |
| **Grid lines** | The dividing lines, numbered from 1 (columns left→right, rows top→bottom) |
| **Track** | A column or a row |
| **Cell** | One square where a row and column meet |
| **Area** | A rectangle of one or more cells |
| **Gap** | Space between tracks |

```
      line1   line2   line3   line4
 line1 ┌───────┬───────┬───────┐
       │ cell  │       │       │   ← row track 1
 line2 ├───────┼───────┼───────┤
       │       │       │       │   ← row track 2
 line3 └───────┴───────┴───────┘
          col 1   col 2   col 3
```

## Your first grid

```try-html
<style>
  .gallery { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .gallery div { background: #e0f2fe; padding: 24px; text-align: center; border-radius: 8px; font-family: sans-serif; }
</style>
<div class="gallery">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
</div>
```

Three equal columns; items fill the cells left to right, adding rows automatically.

## Sizing tracks

### The `fr` unit

`fr` means a **fraction of the free space**. `1fr 2fr` = the second column is twice the first. Unlike `%`, `fr` accounts for gaps automatically.

### Mixing units

```
grid-template-columns: 250px 1fr;          /* fixed sidebar + flexible content */
grid-template-columns: 1fr 3fr 1fr;        /* narrow, wide, narrow */
grid-template-columns: 200px auto 200px;   /* auto = size to content */
```

### `repeat()`

```
grid-template-columns: repeat(4, 1fr);         /* 4 equal columns */
grid-template-columns: repeat(3, 100px 1fr);   /* pattern repeated 3 times */
```

### `minmax()`

Sets a track's minimum and maximum: `minmax(200px, 1fr)` means "at least 200px, otherwise share the space".

### Rows

```
grid-template-rows: 80px 1fr 60px;   /* header, content, footer heights */
grid-auto-rows: minmax(120px, auto); /* size of rows created automatically */
```

## The magic responsive grid: `auto-fit` + `minmax`

```try-html
<style>
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
  .cards div { background: #fff7e0; border: 1px solid #f59e0b; padding: 18px; border-radius: 10px; font-family: sans-serif; }
</style>
<div class="cards">
  <div>Business websites</div><div>Online shops</div><div>School systems</div>
  <div>Hospital systems</div><div>M-Pesa integration</div><div>Hosting</div>
</div>
<p>Change the preview width: columns appear and disappear automatically.</p>
```

`repeat(auto-fit, minmax(160px, 1fr))` means "fit as many columns of at least 160px as possible, and stretch them to fill the row". One line replaces several media queries.

- `auto-fit` collapses empty tracks so items stretch to fill the row.
- `auto-fill` keeps empty tracks, so items keep their size even when there are few of them.

## Placing items with line numbers

```
.item {
  grid-column: 1 / 3;     /* from line 1 to line 3 = spans 2 columns */
  grid-row: 1 / 2;
}
.wide { grid-column: span 2; }      /* span 2 columns from wherever it lands */
.full { grid-column: 1 / -1; }      /* -1 = the last line: full width */
```

```try-html
<style>
  .bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 90px; gap: 8px; font-family: sans-serif; }
  .bento div { background: #0b1b35; color: #fff; border-radius: 10px; padding: 10px; }
  .big { grid-column: span 2; grid-row: span 2; background: #f59e0b !important; color: #0b1b35 !important; }
  .wide { grid-column: span 2; }
  .full { grid-column: 1 / -1; background: #059669 !important; }
</style>
<div class="bento">
  <div class="big">Featured product (2×2)</div>
  <div>Item</div><div>Item</div>
  <div class="wide">Wide item</div>
  <div class="full">Full-width banner (1 / -1)</div>
</div>
```

## Named template areas: page layouts made readable

Draw your layout with words:

```try-html
<style>
  .page {
    display: grid;
    grid-template-columns: 180px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
    gap: 8px; min-height: 280px; font-family: sans-serif;
  }
  .page > * { padding: 12px; border-radius: 8px; }
  header { grid-area: header; background: #0b1b35; color: #fff; }
  aside  { grid-area: sidebar; background: #e0f2fe; }
  main   { grid-area: main; background: #f1f5f9; }
  footer { grid-area: footer; background: #cbd5e1; }
  @media (max-width: 520px) {
    .page { grid-template-columns: 1fr; grid-template-areas: "header" "main" "sidebar" "footer"; }
  }
</style>
<div class="page">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Main content</main>
  <footer>Footer</footer>
</div>
```

On small screens, the media query simply redraws the areas as one column with the sidebar under the main content. A `.` in the template means an empty cell.

:::think In the layout above, why does the media query put "main" before "sidebar" on phones?
On a phone, people came for the main content, so it should appear first; the sidebar (related links, extras) can come after. Grid lets you change the visual order per screen size. Make sure the HTML order also makes sense for screen readers and keyboard users (here, main comes before aside in the HTML too, which is ideal).
:::

## Alignment in Grid

| Property (on container) | Aligns |
|---|---|
| `justify-items` | Items horizontally **inside their cells** |
| `align-items` | Items vertically inside their cells |
| `place-items: center` | Both at once (easy centring) |
| `justify-content` / `align-content` | The whole grid within the container (when tracks are smaller than the container) |

On items: `justify-self`, `align-self`, `place-self`.

```try-html
<style>
  .center { display: grid; place-items: center; height: 160px; background: #0b1b35; }
  .center p { background: #fff; padding: 12px 20px; border-radius: 10px; margin: 0; font-family: sans-serif; }
</style>
<div class="center"><p>Centred with two lines of CSS</p></div>
```

## Implicit grid

If you place more items than your defined rows, Grid creates **implicit** rows automatically. Control their size with `grid-auto-rows`, and the fill direction with `grid-auto-flow` (`row`, `column`, or `dense` to fill gaps, which can change visual order).

## Real-world uses

| Layout | Grid approach |
|---|---|
| Product/photo gallery | `repeat(auto-fit, minmax(200px, 1fr))` |
| Page layout | `grid-template-areas` with a mobile override |
| Dashboard | Areas for stats, charts and tables; spans for big widgets |
| Form in two columns | `grid-template-columns: 1fr 1fr`; full-width fields with `grid-column: 1 / -1` |
| Pricing table | 3 equal columns that stack on phones |

### A two-column form

```try-html
<style>
  form.g { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; max-width: 460px; font-family: sans-serif; }
  form.g label { display: grid; gap: 4px; font-size: 14px; }
  form.g .full { grid-column: 1 / -1; }
  form.g input, form.g textarea { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font: inherit; }
  @media (max-width: 420px) { form.g { grid-template-columns: 1fr; } }
</style>
<form class="g">
  <label>First name <input></label>
  <label>Last name <input></label>
  <label>Phone <input type="tel"></label>
  <label>Email <input type="email"></label>
  <label class="full">Message <textarea rows="3"></textarea></label>
</form>
```

## Grid vs Flexbox

| | Grid | Flexbox |
|---|---|---|
| Dimensions | Two (rows and columns) | One (row or column) |
| Thinking | Layout first: define tracks, place items | Content first: items size themselves |
| Best for | Page layouts, galleries, dashboards, forms | Navbars, button groups, centring, components |

They work together: a Grid page layout whose header uses Flexbox for the menu.

## Common mistakes

| Mistake | Fix |
|---|---|
| Using `%` columns plus gap (overflow) | Use `fr`, which accounts for gaps |
| Forgetting `display: grid` on the container | Add it to the parent |
| Fixed column counts that break on phones | `auto-fit` + `minmax`, or a media query |
| Images stretching cells | `img { max-width: 100%; height: auto; }` or `object-fit` |
| Confusing `auto-fit` and `auto-fill` | `auto-fit` stretches items; `auto-fill` keeps empty columns |
| Visual order very different from HTML order | Keep HTML order logical for accessibility |

## Practice tasks

1. Build a 3-column gallery, then make it responsive with `auto-fit`/`minmax`.
2. Create a page layout with named areas (header, nav, main, aside, footer) that becomes one column under 600px.
3. Build a "bento" grid with one 2×2 featured item and a full-width banner.
4. Make a two-column contact form with a full-width message field.
5. Centre a card on a section using `place-items: center`.

## Summary

- `display: grid` creates a two-dimensional layout; define tracks with `grid-template-columns`/`-rows`.
- Use `fr`, `repeat()`, `minmax()` and `gap`; `repeat(auto-fit, minmax(Xpx, 1fr))` makes responsive grids without media queries.
- Place and span items with line numbers (`1 / -1`, `span 2`) or named `grid-template-areas`.
- Align with `justify-items`, `align-items` and `place-items`.
- Grid for layouts; Flexbox for components; both together for real sites.

```quiz
Q: Which property and value make an element a grid container? Write as property: value.
A: display: grid | display:grid
Q: Which unit means a fraction of the free space?
A: fr
Q: Write the function used to repeat column sizes.
A: repeat | repeat()
Q: Which function sets a minimum and maximum track size?
A: minmax | minmax()
Q: In grid-column: 1 / -1, what does -1 refer to?
A: the last line | last line | last
Q: Which property defines named areas like "header header"?
A: grid-template-areas
Q: Which single property centres items both ways in Grid? Write property: value.
A: place-items: center | place-items:center | place-items
Q: Is Grid one-dimensional or two-dimensional?
A: two-dimensional | two | 2
```
=== exercise ===
Make `.gallery` a grid with **3 columns** using `grid-template-columns`.
=== starter ===
<style>
  .gallery {
    
  }
  .gallery div { background: #e0f2fe; padding: 20px; }
</style>
<div class="gallery"><div>1</div><div>2</div><div>3</div><div>4</div></div>
=== expected ===

=== must_contain ===
display
grid
grid-template-columns
