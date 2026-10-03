---
slug: transforms-filters
title: Transforms, filters and object-fit
after: position
---
# Transforms, filters and object-fit

Transforms move, rotate and scale elements **without affecting the layout** around them, which makes them perfect for hover effects and animations. Filters change how things look (blur, grayscale). `object-fit` crops images neatly.

## transform

```try-html
<style>
  body { font-family: sans-serif; }
  .t { display: inline-block; width: 80px; height: 80px; margin: 20px; background: #ffb800; text-align: center; line-height: 80px; font-weight: bold; }
  .move { transform: translate(20px, 10px); }
  .rotate { transform: rotate(15deg); }
  .scale { transform: scale(1.3); }
  .skew { transform: skew(-10deg); }
  .combo { transform: translateY(-10px) rotate(-8deg) scale(.9); }
</style>
<div class="t move">move</div>
<div class="t rotate">rotate</div>
<div class="t scale">scale</div>
<div class="t skew">skew</div>
<div class="t combo">combo</div>
```

| Function | Example | Effect |
|---|---|---|
| `translate(x, y)` | `translate(0, -4px)` | Moves it |
| `rotate(angle)` | `rotate(45deg)` | Turns it |
| `scale(n)` | `scale(1.05)` | Grows (above 1) or shrinks (below 1) |
| `skew(angle)` | `skew(10deg)` | Slants it |

`transform-origin` changes the pivot point: `transform-origin: top left;`.

## Smooth hover effects (with transition)

```try-html
<style>
  body { font-family: system-ui, sans-serif; background: #f1f5f9; }
  .card { width: 200px; padding: 16px; background: #fff; border-radius: 14px; box-shadow: 0 2px 6px rgba(0,0,0,.08); transition: transform .25s ease, box-shadow .25s ease; }
  .card:hover { transform: translateY(-6px); box-shadow: 0 16px 30px rgba(0,0,0,.15); }
  .icon { display: inline-block; transition: transform .3s; }
  .card:hover .icon { transform: rotate(360deg); }
</style>
<div class="card"><span class="icon">⚙️</span> Hover this card</div>
```

> Animate `transform` and `opacity` rather than `width`, `top` or `margin`. The browser can animate transforms smoothly without re-doing the layout, so they stay fast on cheap phones.

## filter

```try-html
<style>
  img { width: 150px; margin: 4px; border-radius: 8px; }
  .gray { filter: grayscale(100%); }
  .blur { filter: blur(3px); }
  .bright { filter: brightness(1.3) contrast(1.1); }
  .hover-color { filter: grayscale(100%); transition: filter .3s; }
  .hover-color:hover { filter: none; }
</style>
<img src="https://picsum.photos/id/1025/300/200" alt="A dog">
<img class="gray" src="https://picsum.photos/id/1025/300/200" alt="A dog in grayscale">
<img class="blur" src="https://picsum.photos/id/1025/300/200" alt="A blurred dog">
<img class="bright" src="https://picsum.photos/id/1025/300/200" alt="A brighter dog">
<img class="hover-color" src="https://picsum.photos/id/1025/300/200" alt="Hover to add colour">
```

`backdrop-filter: blur(8px)` blurs whatever is **behind** a semi-transparent box: the "frosted glass" effect used on menus.

## object-fit: crop images to a box

When images have different shapes but your cards need the same shape:

```try-html
<style>
  .thumbs img { width: 140px; height: 140px; border: 2px solid #0b1b35; margin: 4px; }
  .cover { object-fit: cover; }
  .contain { object-fit: contain; background: #f1f5f9; }
</style>
<div class="thumbs">
  <img src="https://picsum.photos/id/1011/500/250" alt="Stretched (default)">
  <img class="cover" src="https://picsum.photos/id/1011/500/250" alt="Cropped with cover">
  <img class="contain" src="https://picsum.photos/id/1011/500/250" alt="Fitted with contain">
</div>
<p>Default stretches, <code>cover</code> crops, <code>contain</code> fits inside.</p>
```

Add `object-position: top;` to choose which part stays visible (useful for faces).

## aspect-ratio

```css
.video-box { aspect-ratio: 16 / 9; width: 100%; }
.avatar { aspect-ratio: 1; width: 80px; border-radius: 50%; object-fit: cover; }
```

## Where transforms, filters and object-fit are used

These properties power the small details that make modern sites feel polished: cards that lift on hover, icons that rotate when a menu opens, product photos that fill neat equal boxes, greyed-out "sold out" items, frosted-glass headers and smooth animations. Because transforms and opacity are handled by the graphics card, they animate smoothly even on budget phones, unlike changing `width`, `top` or `margin`.

## Transform order matters

Transforms are applied in the order you write them (right to left in terms of the coordinate system), so swapping them changes the result:

```try-html
<style>
  .stage { display: flex; gap: 60px; padding: 30px; font: 12px system-ui; }
  .b { width: 70px; height: 70px; background: #1d4ed8; color: #fff; display: grid; place-items: center; }
  .one { transform: translateX(60px) rotate(45deg); }
  .two { transform: rotate(45deg) translateX(60px); background: #f59e0b; }
</style>
<div class="stage">
  <div class="b one">move, then rotate</div>
  <div class="b two">rotate, then move</div>
</div>
```

The second box moves along its rotated direction, ending up diagonally away. Individual properties (`translate`, `rotate`, `scale`) also exist and can be animated separately: `.icon { rotate: 180deg; }`.

## transform-origin

```try-html
<style>
  .row { display: flex; gap: 40px; padding: 30px; }
  .door { width: 60px; height: 90px; background: #0b1b35; transition: transform .5s; }
  .row:hover .left { transform: rotateY(60deg); }
  .left { transform-origin: left center; }
  .center { transform-origin: center; }
  .row:hover .center { transform: rotate(20deg); }
  .row { perspective: 400px; }
</style>
<div class="row">
  <div class="door left"></div>
  <div class="door center"></div>
</div>
```

Hover the area: the first "door" swings from its left edge in 3D, the second spins around its centre. `perspective` on the parent gives the 3D depth.

## Animation performance

| Animate these | Avoid animating these |
|---|---|
| `transform` (translate, scale, rotate) | `width`, `height` |
| `opacity` | `top`, `left`, `margin`, `padding` |
| `filter` (moderately) | `box-shadow` on many elements |

Changing layout properties forces the browser to recalculate the positions of everything around them on every frame, causing jank. To move something, use `translate`; to grow it, use `scale`.

## Respecting reduced motion

Some people get dizzy or sick from motion. Respect their system setting:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Keyframe animations

```try-html
<style>
  body { font: 14px system-ui; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: .8; } }
  @keyframes slide-up { from { transform: translateY(16px); opacity: 0; } to { transform: none; opacity: 1; } }
  .spinner { width: 28px; height: 28px; border: 4px solid #e2e8f0; border-top-color: #1d4ed8; border-radius: 50%; animation: spin .8s linear infinite; }
  .cta { display: inline-block; margin: 16px 0; padding: 10px 18px; background: #f59e0b; border-radius: 999px; font-weight: 700; animation: pulse 2s ease-in-out infinite; }
  .note { animation: slide-up .6s ease-out both; background: #ecfdf5; padding: 10px; border-radius: 8px; }
</style>
<div class="spinner" role="status" aria-label="Loading"></div>
<div class="cta">Get a free quote</div>
<div class="note">Message sent successfully.</div>
```

Keep attention-grabbing animations (like the pulse) rare: one per page at most, or they become annoying.

## More filters and backdrop-filter

```try-html
<style>
  .gallery { display: flex; gap: 10px; flex-wrap: wrap; font: 12px system-ui; }
  .gallery figure { margin: 0; text-align: center; }
  .gallery img { width: 110px; height: 80px; object-fit: cover; border-radius: 8px; display: block; }
  .soldout img { filter: grayscale(1) opacity(.6); }
  .warm img { filter: sepia(.4) saturate(1.3); }
  .bright img { filter: brightness(1.2) contrast(1.1); }
  .shadow img { filter: drop-shadow(0 6px 8px rgba(0,0,0,.35)); }
  .glass { position: relative; margin-top: 12px; height: 110px; border-radius: 12px; background: url("https://picsum.photos/500/220") center/cover; overflow: hidden; }
  .glass div { position: absolute; inset: auto 10px 10px 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,.25); backdrop-filter: blur(10px); color: #fff; font: 600 14px system-ui; }
</style>
<div class="gallery">
  <figure class="soldout"><img src="https://picsum.photos/id/1080/220/160" alt="Sold out item"><figcaption>Sold out</figcaption></figure>
  <figure class="warm"><img src="https://picsum.photos/id/1080/220/160" alt="Warm filter"><figcaption>Warm</figcaption></figure>
  <figure class="bright"><img src="https://picsum.photos/id/1080/220/160" alt="Bright filter"><figcaption>Bright</figcaption></figure>
  <figure class="shadow"><img src="https://picsum.photos/id/1080/220/160" alt="Drop shadow"><figcaption>Drop shadow</figcaption></figure>
</div>
<div class="glass"><div>Frosted glass caption with backdrop-filter</div></div>
```

`drop-shadow` follows the actual shape of transparent PNGs and SVGs, unlike `box-shadow`, which is always a rectangle.

## object-fit and object-position for real product grids

Sellers upload photos of all shapes. `object-fit: cover` crops them into equal boxes; `object-position` chooses which part stays visible:

```css
.product img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: center 30%;   /* keep slightly above centre: faces, product tops */
}
.logo img {
  height: 48px;
  width: 120px;
  object-fit: contain;           /* never crop logos */
}
```

Use `cover` for photos, `contain` for logos and diagrams that must not be cut.

## Common mistakes

| Mistake | Fix |
|---|---|
| Animating `left` or `width` | Use `transform: translate()` / `scale()` |
| `transition: all` | List specific properties: `transition: transform .2s, opacity .2s` |
| Hover-only effects hiding information | Make sure content is visible without hover |
| `object-fit` not working | The image needs a set width *and* height (or aspect-ratio) |
| Heavy blur filters on many elements | Use sparingly; blur is expensive on weak phones |

## Practice

1. Make a card that lifts 4px and scales to 1.02 on hover, with a 200ms transition on transform only.
2. Build a hamburger icon whose three bars turn into an ✕ using transforms.
3. Create a loading spinner and a "skeleton" shimmer effect with keyframes.
4. Make a product grid where all images are 1:1 squares, cropped neatly with `object-fit`.
5. Add a reduced-motion media query that disables your animations.

:::think A card's hover effect changes `margin-top` from 0 to -4px and it looks jerky on a cheap phone. How do you make it smooth?
Changing margin triggers layout recalculation for the card and everything around it on every frame. Use `transform: translateY(-4px)` instead, which the GPU handles without re-laying out the page, and transition only `transform`.
:::

```quiz
Q: Which transform function moves an element?
A: translate | translate()
Q: What scale value makes an element 10% bigger?
A: 1.1
Q: Which two properties are fastest to animate? Name one of them.
A: transform | opacity
Q: Which filter makes an image black and white?
A: grayscale | grayscale(100%)
Q: Which object-fit value fills the box and crops the extra?
A: cover
Q: Which media feature detects users who prefer less animation?
A: prefers-reduced-motion
Q: Which property sets the point an element rotates or scales around?
A: transform-origin
Q: Which filter follows the real shape of a transparent image when adding a shadow?
A: drop-shadow | drop-shadow()
Q: Which object-fit value should logos usually use so they are never cropped?
A: contain
```
=== exercise ===
Make `.card:hover` move up using `transform: translateY(-6px)`.
=== starter ===
<style>
  .card { padding: 16px; background: #ffb800; transition: transform .25s; }
  
</style>
<div class="card">Hover me</div>
=== must_contain ===
.card:hover
translateY(-6px)
