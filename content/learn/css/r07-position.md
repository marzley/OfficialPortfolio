---
slug: position
title: "Positioning and z-index: relative, absolute, fixed, sticky and stacking"
after: KEEP
---
# Positioning and z-index: relative, absolute, fixed, sticky and stacking

Normal layout places elements one after another (blocks down the page, inline items along lines, flex and grid items in their tracks). Sometimes you need to **break out of that flow**: a "SALE" badge on a product photo's corner, a header that stays at the top while scrolling, a floating WhatsApp button, a dropdown menu, a modal popup. That's what the `position` property does. This unit explains every position value, the offset properties, stacking with `z-index`, and the common traps.

:::note What you will learn
- Normal flow and why positioning is an exception
- `static`, `relative`, `absolute`, `fixed` and `sticky`
- Offsets: `top`, `right`, `bottom`, `left` and `inset`
- The containing block ("absolute is relative to what?")
- `z-index` and stacking contexts
- Real patterns: badges, floating buttons, sticky headers, overlays, tooltips
:::

## Normal flow first

By default every element is `position: static`: it sits where the normal flow puts it, and `top`/`left` etc. do nothing. Use positioning only when flow, Flexbox and Grid can't do the job; overusing absolute positioning creates layouts that break on different screen sizes.

## The five position values

| Value | Stays in flow? | Positioned relative to | Typical use |
|---|---|---|---|
| `static` | Yes | (not positioned) | Default |
| `relative` | Yes (space kept) | Its own normal position | Small nudges; **anchor for absolute children** |
| `absolute` | **No** (space removed) | Nearest **positioned** ancestor | Badges, icons on images, dropdowns, tooltips |
| `fixed` | **No** | The **viewport** (browser window) | Floating buttons, fixed headers, cookie bars |
| `sticky` | Yes until it sticks | Its scroll container | Sticky headers, table headers, sidebars |

### `relative`

The element stays in its place in the flow, but `top`/`left` nudge it visually. More importantly, a relatively positioned element becomes the **reference point** for absolutely positioned children.

### `absolute`

The element is removed from the flow (others behave as if it isn't there) and placed using offsets relative to its **containing block**: the nearest ancestor with a `position` other than `static`. If none exists, it's relative to the page (initial containing block).

```try-html
<style>
  .product { position: relative; width: 220px; font-family: sans-serif; }
  .product img { display: block; width: 100%; height: auto; border-radius: 10px; }
  .badge { position: absolute; top: 10px; left: 10px; background: #dc2626; color: #fff; padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: bold; }
  .fav { position: absolute; top: 10px; right: 10px; background: #fff; border-radius: 50%; width: 32px; height: 32px; display: grid; place-items: center; }
</style>
<div class="product">
  <img src="https://picsum.photos/220/160" alt="Bluetooth speaker" width="220" height="160">
  <span class="badge">-20%</span>
  <span class="fav" aria-label="Save">♡</span>
  <p>Bluetooth speaker: KSh 3,200</p>
</div>
```

The `.product` has `position: relative`, so the badge's `top: 10px; left: 10px` are measured from the product's corner. Remove `position: relative` from `.product` and the badges jump to the page corner.

:::define Containing block
For an absolutely positioned element, the box its offsets are measured from: the padding box of its nearest ancestor whose `position` isn't `static`. The pattern "**parent relative, child absolute**" is one of the most used in CSS.
:::

### `fixed`

Positioned relative to the **viewport**; it stays in the same place on screen when scrolling. Classic example: a floating WhatsApp button.

```try-html
<style>
  .wa { position: fixed; right: 16px; bottom: 16px; background: #25d366; color: #fff; padding: 12px 16px; border-radius: 999px; font: bold 14px sans-serif; text-decoration: none; box-shadow: 0 6px 20px rgba(0,0,0,.25); }
</style>
<p style="height: 600px; font-family: sans-serif">Scroll this preview: the WhatsApp button stays in the corner.</p>
<a class="wa" href="https://wa.me/254700000000">WhatsApp us</a>
```

Note: a `transform`, `filter` or `perspective` on an ancestor makes `fixed` behave like `absolute` relative to that ancestor, a common surprise.

### `sticky`

A hybrid: the element scrolls normally until it reaches an offset (e.g. `top: 0`), then sticks there while its parent is still visible.

```try-html
<style>
  .wrap { height: 220px; overflow: auto; border: 1px solid #cbd5e1; font-family: sans-serif; }
  .bar { position: sticky; top: 0; background: #0b1b35; color: #fff; padding: 10px; }
  .wrap p { padding: 0 10px; }
</style>
<div class="wrap">
  <div class="bar">Sticky header: scroll inside this box</div>
  <p>Line 1</p><p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p><p>Line 8</p><p>Line 9</p><p>Line 10</p>
</div>
```

Sticky needs an offset (`top`, etc.) and won't work if an ancestor has `overflow: hidden` (or `auto`) in a way that becomes the scroll container unintentionally. It's great for table headers (`th { position: sticky; top: 0; }`) and side navigation (this hub's lesson contents box uses it).

## Offsets and `inset`

`top`, `right`, `bottom`, `left` move positioned elements. `inset` is shorthand:

```
inset: 0;                 /* top/right/bottom/left all 0: fills the containing block */
inset: 10px 20px;         /* top/bottom 10, left/right 20 */
```

`position: absolute; inset: 0;` is the standard way to make an overlay cover its parent completely.

## Stacking and `z-index`

When elements overlap, which is on top? By default, later elements in the HTML paint over earlier ones, and positioned elements paint over non-positioned ones. `z-index` changes the order: **higher numbers are closer to you**.

```try-html
<style>
  .stack { position: relative; height: 140px; font-family: sans-serif; }
  .stack div { position: absolute; width: 120px; height: 80px; padding: 8px; color: #fff; border-radius: 8px; }
  .one { background: #2563eb; top: 0; left: 0; z-index: 3; }
  .two { background: #dc2626; top: 25px; left: 50px; z-index: 2; }
  .three { background: #059669; top: 50px; left: 100px; z-index: 1; }
</style>
<div class="stack"><div class="one">z-index 3</div><div class="two">z-index 2</div><div class="three">z-index 1</div></div>
```

Rules:
- `z-index` works on positioned elements (and on flex/grid items).
- Use a small, planned scale (e.g. dropdowns 10, sticky header 100, modal 1000, toast 1100) instead of random `z-index: 99999`.

### Stacking contexts (why z-index "doesn't work")

Some properties create a **stacking context**: a group whose children are stacked only **within** it. Examples: a positioned element with a `z-index`, `opacity` less than 1, `transform`, `filter`, `position: fixed/sticky`. A child with `z-index: 9999` inside a parent context with a low z-index **cannot** rise above an element outside that parent.

:::think A dropdown menu inside the header (z-index: 10) is hidden behind a hero image section (z-index: 20), even though the dropdown has z-index: 9999. Why?
The header forms a stacking context with z-index 10. Everything inside it, including the dropdown, is stacked as part of that group at level 10, which is below the hero's 20. Fix by raising the header's z-index above the hero (or removing the hero's z-index), not by increasing the dropdown's number.
:::

## Common patterns

### Full overlay on an image (text over a photo)

```try-html
<style>
  .hero { position: relative; max-width: 420px; font-family: sans-serif; color: #fff; }
  .hero img { display: block; width: 100%; height: auto; border-radius: 12px; }
  .hero .shade { position: absolute; inset: 0; background: linear-gradient(transparent, rgba(0,0,0,.7)); border-radius: 12px; }
  .hero h2 { position: absolute; left: 16px; bottom: 8px; margin: 0; }
</style>
<div class="hero">
  <img src="https://picsum.photos/420/240" alt="Safari landscape" width="420" height="240">
  <div class="shade"></div>
  <h2>Weekend safari deals</h2>
</div>
```

### Modal (popup) overlay

```
.overlay { position: fixed; inset: 0; background: rgb(0 0 0 / 50%); display: grid; place-items: center; z-index: 1000; }
.modal { background: #fff; padding: 24px; border-radius: 12px; max-width: 90vw; }
```

(Modern HTML also has `<dialog>` with built-in modal behaviour and accessibility.)

### Tooltip

```try-html
<style>
  .tip { position: relative; border-bottom: 1px dotted; cursor: help; font-family: sans-serif; }
  .tip span { position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: #0b1b35; color: #fff; padding: 6px 10px; border-radius: 6px; white-space: nowrap; font-size: 13px; opacity: 0; pointer-events: none; transition: opacity .2s; }
  .tip:hover span, .tip:focus span { opacity: 1; }
</style>
<p style="margin-top:50px; font-family: sans-serif">Pay via <span class="tip" tabindex="0">Paybill<span>Business number: 123456</span></span> for faster processing.</p>
```

## Accessibility and responsiveness notes

- Fixed elements cover content: make sure floating buttons don't hide important text or form buttons on small phones (add bottom padding to the page).
- Sticky headers should be short on mobile; very tall sticky headers eat the screen.
- Tooltips should work with keyboard focus, not just hover.
- Don't use absolute positioning for main page layout; use Flexbox/Grid.

## Common mistakes

| Mistake | Fix |
|---|---|
| Absolute child jumps to the page corner | Add `position: relative` to the parent |
| `top`/`left` doing nothing | The element is `static`; set a position |
| Sticky not sticking | Add `top: 0`; check ancestors' `overflow` |
| `z-index` "not working" | Element not positioned, or trapped in a stacking context |
| `z-index: 999999` everywhere | Use a planned scale |
| Fixed button covering content | Add page padding; test on small phones |

## Practice tasks

1. Put a "NEW" badge on the top-right corner of a product card.
2. Add a floating "Call us" button that stays at the bottom-left on scroll.
3. Make a table with a sticky header row inside a scrollable box.
4. Create a dark overlay with centred text over an image using `inset: 0`.
5. Recreate the stacking context problem, then fix it.

## Summary

- `position: static` is the default; `relative` nudges and anchors; `absolute` leaves the flow and is placed relative to the nearest positioned ancestor; `fixed` sticks to the viewport; `sticky` scrolls then sticks.
- Offsets: `top`, `right`, `bottom`, `left`, `inset`.
- "Parent relative, child absolute" is the core pattern.
- `z-index` orders overlapping elements; stacking contexts limit it; use a planned scale.
- Use positioning for overlays, badges, floating buttons, sticky headers and tooltips, not for main layout.

```quiz
Q: What is the default position value?
A: static
Q: An absolute element is positioned relative to its nearest ... ancestor. (one word)
A: positioned
Q: Which position value keeps an element on screen while scrolling, relative to the viewport?
A: fixed
Q: Which position value scrolls normally, then sticks at an offset?
A: sticky
Q: Which shorthand sets top, right, bottom and left at once?
A: inset
Q: Does a higher z-index bring an element forward or send it back?
A: forward | to the front | front
Q: What should the parent of an absolutely positioned badge usually have? Write property: value.
A: position: relative | position:relative
```
=== exercise ===
Make `.card` a positioning anchor (`position: relative`) and place `.badge` in its top-right corner with `position: absolute`, `top` and `right`.
=== starter ===
<style>
  .card { width: 200px; height: 120px; background: #e0f2fe; }
  .badge { background: red; color: white; padding: 4px 8px; }
</style>
<div class="card"><span class="badge">NEW</span></div>
=== expected ===

=== must_contain ===
position
relative
absolute
top
right
