---
slug: display-overflow
title: display, visibility and overflow
after: box-model
---
# display, visibility and overflow

The `display` property decides **how a box behaves** in the layout. It's the switch that turns on Flexbox and Grid, hides things, and fixes "why won't my width work?" problems.

## The main display values

| Value | Behaviour |
|---|---|
| `block` | New line, full width, width/height work |
| `inline` | Sits in the text line; **width, height and top/bottom margins are ignored** |
| `inline-block` | Sits in the line **and** width/height/padding work |
| `flex` | Children are laid out in a row or column (Flexbox lesson) |
| `grid` | Children are placed on a grid (Grid lesson) |
| `none` | Removed completely, takes no space |

```try-html
<style>
  body { font-family: sans-serif; }
  span { background: #ffb800; padding: 6px; margin: 6px; }
  .w { width: 140px; height: 50px; }
  .ib { display: inline-block; }
  .b { display: block; }
</style>
<p>Inline: <span class="w">width ignored</span> text continues</p>
<p>Inline-block: <span class="w ib">width works</span> text continues</p>
<p>Block: <span class="w b">full new line</span> text continues</p>
```

## Hiding things

| Method | Takes space? | Screen readers? |
|---|---|---|
| `display: none` | No | Hidden |
| `visibility: hidden` | **Yes**, leaves a gap | Hidden |
| `opacity: 0` | Yes | Still read out |
| `hidden` attribute in HTML | No | Hidden |

```try-html
<style>
  .row div { display: inline-block; width: 70px; padding: 10px; background: #0b1b35; color: #fff; margin: 2px; text-align: center; }
  .gone { display: none; }
  .invisible { visibility: hidden; }
</style>
<div class="row"><div>1</div><div class="gone">2</div><div>3</div></div>
<div class="row"><div>1</div><div class="invisible">2</div><div>3</div></div>
<p>Row 1 uses display:none (no gap). Row 2 uses visibility:hidden (gap stays).</p>
```

## Overflow: when content is too big

When content doesn't fit in a box with a fixed size, `overflow` decides what happens:

| Value | Result |
|---|---|
| `visible` (default) | Spills out of the box |
| `hidden` | Cut off |
| `scroll` | Always shows scrollbars |
| `auto` | Scrollbars only when needed |

```try-html
<style>
  .box { width: 220px; height: 70px; border: 2px solid #0b1b35; margin: 10px 0; font-family: sans-serif; }
  .hidden { overflow: hidden; }
  .auto { overflow: auto; }
  .table-wrap { overflow-x: auto; max-width: 260px; border: 1px solid #ccc; }
  table { border-collapse: collapse; }
  td { border: 1px solid #ccc; padding: 6px 14px; white-space: nowrap; }
</style>
<div class="box">Visible: this long text does not fit in the box so it spills out below the border and over other things.</div>
<br><br>
<div class="box hidden">Hidden: this long text does not fit in the box so the extra is cut off and nobody can see it.</div>
<div class="box auto">Auto: this long text does not fit in the box, so a scrollbar appears only because it is needed here.</div>
<div class="table-wrap"><table><tr><td>Name</td><td>Phone</td><td>Town</td><td>Balance</td><td>Status</td></tr></table></div>
```

> Tip: wrap wide tables in a div with `overflow-x: auto`. On phones they scroll sideways instead of breaking the whole page.

## A common bug: the page scrolls sideways on phones

Usually one element is wider than the screen: a big image, a long word or a `width: 500px` box. Fixes:

```css
img, video { max-width: 100%; height: auto; }
.long-links { overflow-wrap: anywhere; }
.box { width: min(100%, 500px); }
```

```quiz
Q: Which display value ignores width and height?
A: inline
Q: Which display value sits in the line but lets width and height work?
A: inline-block
Q: Which hides an element and leaves no gap: display none or visibility hidden?
A: display none | display: none | none
Q: Which overflow value shows scrollbars only when needed?
A: auto
Q: What overflow-x value lets a wide table scroll on phones?
A: auto | scroll
```
=== exercise ===
Make `.menu a` links **inline-block** with **padding: 10px**.
=== starter ===
<style>
  .menu a {
    background: #0b1b35; color: #fff;
    
  }
</style>
<nav class="menu"><a href="#">Home</a> <a href="#">Shop</a></nav>
=== must_contain ===
display: inline-block
padding: 10px
