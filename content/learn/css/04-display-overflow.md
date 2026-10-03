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

## Why display and overflow matter

Every element has a display type that decides how it sits on the page: on its own line, inside text, as a flex row or as a grid. Many layout bugs ("my width doesn't work", "the page scrolls sideways on phones", "the dropdown is cut off") are really display or overflow problems. Understanding them saves hours of trial and error.

## The full list you'll use

| Value | Behaviour | Typical use |
|---|---|---|
| `block` | New line, full width, width/height work | Sections, paragraphs, divs |
| `inline` | Sits in text, width/height ignored, vertical padding doesn't push lines | Links, `<strong>`, `<span>` |
| `inline-block` | Sits in text, but width/height/padding work | Badges, buttons in text |
| `flex` | Children in a row or column with alignment control | Navbars, cards in a row, centring |
| `inline-flex` | Flex container that sits inline | Icon + text buttons |
| `grid` | Two-dimensional rows and columns | Page layouts, galleries |
| `none` | Removed completely | Hidden menus, tabs |
| `contents` | The element's box disappears; children act as its parent's children | Advanced layout cases |
| `flow-root` | Block that contains floated children | Fixing float layouts |

## Accessible hiding: three different needs

```css
/* 1. Hidden from everyone (visually and screen readers) */
.hidden { display: none; }

/* 2. Visible only to screen readers (e.g. "Open menu" label for an icon button) */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

/* 3. Hidden visually but keeps its space (rarely what you want) */
.invisible { visibility: hidden; }
```

The HTML `hidden` attribute (`<div hidden>`) works like `display: none` and is handy when toggling with JavaScript: `panel.hidden = !panel.hidden`.

## Toggling content with JavaScript and display

```try-html
<style>
  .faq button { width: 100%; text-align: left; padding: 12px; font: 600 15px system-ui; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 8px; cursor: pointer; }
  .faq .answer { padding: 10px 12px; font: 14px/1.5 system-ui; }
</style>
<div class="faq">
  <button aria-expanded="false" aria-controls="a1">How long does a website take? ▾</button>
  <div class="answer" id="a1" hidden>A simple business site usually takes one to three weeks, depending on content.</div>
</div>
<script>
  const btn = document.querySelector(".faq button");
  const ans = document.getElementById("a1");
  btn.addEventListener("click", () => {
    ans.hidden = !ans.hidden;
    btn.setAttribute("aria-expanded", String(!ans.hidden));
  });
</script>
```

`aria-expanded` tells screen reader users whether the section is open. The native `<details>`/`<summary>` elements do this with no JavaScript at all.

## Overflow and text

```try-html
<style>
  .box { width: 220px; border: 1px solid #cbd5e1; padding: 8px; margin: 8px 0; font: 14px system-ui; }
  .ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .breakword { overflow-wrap: anywhere; }
  .scrollx { overflow-x: auto; white-space: nowrap; }
  .scrolly { max-height: 70px; overflow-y: auto; }
</style>
<div class="box ellipsis">A very long product name that will be cut off with three dots at the end</div>
<div class="box breakword">https://www.example.co.ke/a/very/long/link/without/any/spaces/that/would/overflow</div>
<div class="box scrollx">Swipe → Nairobi · Mombasa · Kisumu · Nakuru · Eldoret · Thika · Malindi · Nyeri</div>
<div class="box scrolly">Terms line 1<br>Terms line 2<br>Terms line 3<br>Terms line 4<br>Terms line 5<br>Terms line 6</div>
```

Long links and email addresses are the most common cause of sideways scrolling on phones; `overflow-wrap: anywhere` fixes them.

## overflow: hidden vs clip

`overflow: hidden` still lets the box scroll with JavaScript and creates a new formatting context; `overflow: clip` simply cuts content and does not create a scroll container, which means `position: sticky` children keep working. When a sticky header "stops sticking", check whether a parent has `overflow: hidden`.

## Horizontal scroll carousels with scroll snap

```try-html
<style>
  .carousel { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 8px; }
  .carousel > div { flex: 0 0 75%; scroll-snap-align: start; height: 120px; border-radius: 12px; background: #1d4ed8; color: #fff; display: grid; place-items: center; font: 600 18px system-ui; }
  .carousel > div:nth-child(even) { background: #0b1b35; }
</style>
<div class="carousel">
  <div>Web design</div><div>Hosting</div><div>SEO</div><div>Branding</div>
</div>
```

Swipe on a phone (or scroll sideways): each card snaps into place. No JavaScript needed.

## Finding the element that causes sideways scroll

1. Open DevTools and switch to a phone size.
2. Paste in the Console:

```javascript
document.querySelectorAll("*").forEach(el => {
  if (el.offsetWidth > document.documentElement.clientWidth) console.log(el);
});
```

3. Fix the culprit (usually a fixed width, `100vw`, a long word, a wide table or an image without `max-width: 100%`).
4. Avoid hiding the problem with `body { overflow-x: hidden }`, which can break `position: sticky`.

## Common mistakes

| Mistake | Fix |
|---|---|
| Setting width on an inline `<a>` | `display: inline-block` or `block` |
| `display: none` on content that screen readers need | Use `.sr-only` |
| Images wider than the screen | `img { max-width: 100%; height: auto; }` |
| Fixed-height boxes with growing text | `min-height` or `overflow-y: auto` |
| Wide tables on phones | Wrap in a div with `overflow-x: auto` |

## Practice

1. Build an FAQ with three questions using `<details>` and `<summary>`, then style the open state.
2. Make an icon-only menu button with a screen-reader-only label.
3. Create a snapping horizontal list of testimonials.
4. Make product names in a card grid end with an ellipsis after one line.

:::think A sticky header stopped sticking after you added `overflow: hidden` to a wrapper to fix sideways scrolling. Why?
`position: sticky` sticks relative to its nearest scrolling ancestor. `overflow: hidden` makes the wrapper a scroll container, so the header sticks inside that wrapper (which doesn't scroll) instead of the page. Fix the element causing the overflow, or use `overflow: clip`, which doesn't create a scroll container.
:::

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
Q: Which HTML attribute hides an element like display none and is easy to toggle in JavaScript?
A: hidden
Q: Which property makes horizontal scrolling lists snap card by card?
A: scroll-snap-type | scroll snap
Q: Which class name is commonly used for text visible only to screen readers?
A: sr-only | .sr-only | visually-hidden
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
