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
