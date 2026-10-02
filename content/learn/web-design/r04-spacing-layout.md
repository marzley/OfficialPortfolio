---
slug: spacing-layout
title: "Spacing, grids and layout: spacing scales, the box model, grids, Flexbox and CSS Grid layouts, and common page patterns"
after: KEEP
---
# Spacing, grids and layout: spacing scales, the box model, grids, Flexbox and CSS Grid layouts, and common page patterns

Two websites can use the same colours and fonts, yet one looks polished and the other messy. The difference is usually **spacing and layout**: consistent gaps, aligned edges, sensible grouping and a clear structure that adapts from phone to desktop. This unit teaches the spacing systems and grids designers use, how they translate into CSS (box model, Flexbox, Grid), and the common layout patterns you'll build for real clients.

:::note What you will learn
- Why consistent spacing matters
- Spacing scales (4px/8px systems)
- The CSS box model: margin, border, padding, content
- Layout grids: columns, gutters, margins
- Flexbox for rows and alignment
- CSS Grid for page layouts and card grids
- Containers and max-width
- Common patterns: header, hero, cards, sidebar, footer, split sections
- Responsive layout tips
:::

## Why spacing matters

- **Grouping**: space shows what belongs together (proximity principle).
- **Rhythm**: consistent gaps make pages feel calm and professional.
- **Readability**: breathing room around text and buttons improves scanning and tapping.
- **Speed**: a spacing system means fewer decisions while designing and coding.

## Spacing scales

Pick a base unit (commonly **4px or 8px**) and use multiples only:

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | 4px | Icon to text |
| `--space-2` | 8px | Tight groups (label to input) |
| `--space-3` | 12px | Inside small components |
| `--space-4` | 16px | Card padding on phones, paragraph spacing |
| `--space-6` | 24px | Between components |
| `--space-8` | 32px | Card padding on desktop |
| `--space-12` | 48px | Between sections on phones |
| `--space-16` | 64px | Between sections on desktop |

Rule of thumb: **space inside a group < space between groups < space between sections**.

## The box model

Every element is a box:

```
margin (outside space)
  border
    padding (inside space)
      content
```

```try-html
<style>
  .box { margin: 16px; border: 3px solid #0b1b35; padding: 20px; background: #fef3c7; font-family: system-ui; }
  .box span { background: #fff; }
  * { box-sizing: border-box; }
</style>
<div class="box"><span>Content</span> sits inside padding (yellow), inside the border (navy), with margin outside.</div>
```

Always set `box-sizing: border-box` so `width` includes padding and border (much easier layouts).

## Layout grids

Designers use **column grids**:
- **Columns**: 12 on desktop (divides into halves, thirds, quarters), 8 on tablets, 4 on phones.
- **Gutters**: gaps between columns (e.g. 16–24px).
- **Margins**: space at the screen edges (e.g. 16px on phones).
- **Container**: content max-width (e.g. 1100–1280px) centred on large screens, so lines don't stretch across huge monitors.

## Flexbox: one-dimensional layouts

Use Flexbox for **rows or columns** of items: navigation bars, button groups, cards in a row, aligning icon + text.

```try-html
<style>
  .nav { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 16px; background: #0b1b35; font-family: system-ui; border-radius: 10px; }
  .nav a { color: #fff; text-decoration: none; }
  .nav .links { display: flex; gap: 16px; flex-wrap: wrap; }
  .nav .cta { background: #ffb800; color: #0b1b35; padding: 8px 14px; border-radius: 999px; font-weight: 700; }
</style>
<nav class="nav">
  <a href="#"><strong>Marzley</strong></a>
  <div class="links"><a href="#">Services</a><a href="#">Work</a><a href="#">Learn</a></div>
  <a class="cta" href="#">Get a quote</a>
</nav>
```

Key properties: `display:flex`, `justify-content` (main axis), `align-items` (cross axis), `gap`, `flex-wrap`, `flex: 1` (grow to fill).

## CSS Grid: two-dimensional layouts

Use Grid for **rows and columns together**: card grids, page layouts, galleries.

A responsive card grid with no media queries:

```try-html
<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; font-family: system-ui; }
  .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #fff; }
  .card h4 { margin: 0 0 6px; color: #0b1b35; }
  .card p { margin: 0; color: #475569; font-size: 14px; }
</style>
<div class="grid">
  <div class="card"><h4>Websites</h4><p>Fast, mobile-first sites.</p></div>
  <div class="card"><h4>M-Pesa</h4><p>STK push checkout.</p></div>
  <div class="card"><h4>SEO</h4><p>Get found on Google.</p></div>
  <div class="card"><h4>Training</h4><p>Learn digital skills.</p></div>
</div>
```

`repeat(auto-fit, minmax(180px, 1fr))` fits as many columns as possible, each at least 180px wide; resize the preview to see cards wrap.

A page layout with named areas:

```try-html
<style>
  .page { display: grid; gap: 12px; font-family: system-ui;
          grid-template-areas: "header" "main" "sidebar" "footer"; }
  @media (min-width: 700px) {
    .page { grid-template-columns: 1fr 240px; grid-template-areas: "header header" "main sidebar" "footer footer"; }
  }
  .page > * { padding: 14px; border-radius: 10px; background: #f1f5f9; }
  header { grid-area: header; background: #0b1b35 !important; color: #fff; }
  main { grid-area: main; min-height: 120px; }
  aside { grid-area: sidebar; }
  footer { grid-area: footer; }
</style>
<div class="page"><header>Header</header><main>Main content</main><aside>Sidebar</aside><footer>Footer</footer></div>
```

| Use Flexbox for | Use Grid for |
|---|---|
| Navigation bars, toolbars | Overall page layout |
| Aligning items in a row | Card and image grids |
| Centring one thing | Complex sections with rows and columns |

They work together: a Grid of cards, with Flexbox inside each card.

## Containers

```css
.container {
  width: min(100% - 32px, 1120px);   /* 16px side margins on phones, max 1120px wide */
  margin-inline: auto;               /* centre it */
}
```

Full-width coloured sections can still keep their content inside a container.

## Common page patterns

| Pattern | Description |
|---|---|
| **Header/navbar** | Logo left, links, CTA right; collapses to a menu button on phones |
| **Hero** | Big headline, short text, CTA, image or illustration |
| **Feature/service cards** | 3–4 cards in a grid with icon, title, text |
| **Split section** | Text one side, image the other; stacks on phones |
| **Testimonials** | Quotes with names and photos |
| **Pricing table** | Plans side by side with a highlighted recommended plan |
| **FAQ** | Accordion questions |
| **CTA band** | Full-width section with one action |
| **Footer** | Contact details, links, social icons, legal pages |

## Responsive layout tips

- Design **mobile first**: single column, then add columns as space grows (next lessons).
- Use `gap` instead of margins between flex/grid items.
- Avoid fixed widths in pixels for content; use `%`, `fr`, `minmax()`, `max-width`.
- Check for horizontal scrolling on phones (a common bug from wide images or fixed widths).
- Increase section spacing on larger screens.

:::think A services page has cards with different padding (10px, 25px, 18px), random gaps between sections, and text touching the screen edges on phones. How would you fix it systematically?
Adopt an 8px spacing scale as CSS variables; give all cards the same padding (e.g. 16px phones, 24–32px desktop); use consistent section spacing (e.g. 48px/64px); put content in a container with 16px side margins on phones; lay out cards with CSS Grid and `gap`; and set `box-sizing: border-box`.
:::

## Summary

- Consistent spacing groups content and creates calm rhythm; use a 4/8px spacing scale.
- The box model: content, padding, border, margin; use box-sizing: border-box.
- Grids use columns, gutters, margins and a max-width container.
- Flexbox handles one-dimensional rows/columns; CSS Grid handles two-dimensional layouts, including auto-fit card grids and named areas.
- Build common patterns (header, hero, cards, split sections, footer) mobile-first with flexible units.

```quiz
Q: What base unit do many spacing systems use? (a number in px)
A: 8 | 8px | 4 | 4px
Q: Which box-sizing value makes width include padding and border?
A: border-box
Q: Which CSS layout system is best for two-dimensional layouts?
A: Grid | CSS Grid
Q: Which property adds space between flex or grid items?
A: gap
Q: How many columns does a typical desktop design grid have?
A: 12
```
