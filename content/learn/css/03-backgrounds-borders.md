---
slug: backgrounds-borders-shadows
title: Backgrounds, borders, rounded corners and shadows
after: units-sizing
---
# Backgrounds, borders, rounded corners and shadows

These four properties turn plain boxes into buttons, cards and banners.

## Backgrounds

```try-html
<style>
  .box { padding: 18px; margin: 10px 0; color: #fff; border-radius: 10px; font-family: sans-serif; }
  .solid { background-color: #0b1b35; }
  .gradient { background: linear-gradient(135deg, #0b1b35, #2563eb); }
  .radial { background: radial-gradient(circle at top left, #ffb800, #b45309); }
  .photo {
    background-image: linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("https://picsum.photos/id/1018/900/400");
    background-size: cover;
    background-position: center;
    min-height: 120px;
  }
</style>
<div class="box solid">Solid colour</div>
<div class="box gradient">Linear gradient</div>
<div class="box radial">Radial gradient</div>
<div class="box photo">Photo with a dark overlay so white text stays readable</div>
```

| Property | What it does |
|---|---|
| `background-color` | A flat colour |
| `background-image` | `url(...)` or a gradient |
| `background-size` | `cover` fills the box (may crop), `contain` shows it all |
| `background-position` | `center`, `top`, `50% 20%` |
| `background-repeat` | `no-repeat`, `repeat` |
| `background` | Shorthand for all of the above |

> Tip: a dark gradient layered over a photo (like `.photo` above) is the professional way to keep text readable on busy pictures.

## Borders

```css
border: 2px solid #0b1b35;        /* width style colour */
border-bottom: 3px dashed #ffb800;
border-left: 4px solid #16a34a;   /* great for "note" boxes */
```

Styles: `solid`, `dashed`, `dotted`, `double`, `none`.

## Rounded corners

```try-html
<style>
  .r { display: inline-block; width: 90px; height: 90px; margin: 6px; background: #ffb800; text-align: center; line-height: 90px; font-family: sans-serif; }
  .r1 { border-radius: 8px; }
  .r2 { border-radius: 24px; }
  .r3 { border-radius: 50%; }
  .r4 { border-radius: 24px 0 24px 0; }
  .pill { display: inline-block; padding: 6px 16px; border-radius: 999px; background: #0b1b35; color: #fff; font-family: sans-serif; }
</style>
<div class="r r1">8px</div><div class="r r2">24px</div><div class="r r3">50%</div><div class="r r4">mixed</div>
<p><span class="pill">A pill badge</span></p>
```

`border-radius: 50%` on a square makes a circle: perfect for profile photos.

## Shadows

`box-shadow: x y blur spread colour;`

```try-html
<style>
  body { background: #f1f5f9; font-family: sans-serif; padding: 10px; }
  .card { background: #fff; border-radius: 14px; padding: 16px; margin: 14px 0; }
  .s1 { box-shadow: 0 1px 3px rgba(0,0,0,.12); }
  .s2 { box-shadow: 0 10px 30px rgba(15,23,42,.15); }
  .s3 { box-shadow: 0 0 0 3px #ffb800; }               /* a "ring" */
  .s4 { box-shadow: inset 0 2px 6px rgba(0,0,0,.2); }  /* pressed-in */
</style>
<div class="card s1">Subtle shadow</div>
<div class="card s2">Soft, floating shadow</div>
<div class="card s3">Ring (no blur, 3px spread)</div>
<div class="card s4">Inset shadow</div>
```

Soft, low-opacity shadows look modern; dark hard shadows look dated.

## Putting it together: a product card

```try-html
<style>
  body { background: #f1f5f9; font-family: system-ui, sans-serif; }
  .product { width: 240px; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(15,23,42,.12); }
  .product img { width: 100%; display: block; }
  .product .body { padding: 14px; }
  .badge { background: #dcfce7; color: #166534; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
  .buy { display: block; text-align: center; margin-top: 10px; padding: 10px; border-radius: 10px; background: #15803d; color: #fff; text-decoration: none; font-weight: 700; }
</style>
<div class="product">
  <img src="https://picsum.photos/id/292/480/300" alt="Fresh vegetables" width="480" height="300">
  <div class="body">
    <span class="badge">In stock</span>
    <h3>Sukuma wiki bundle</h3>
    <p>KSh 50 per bunch</p>
    <a class="buy" href="#">Order on WhatsApp</a>
  </div>
</div>
```

```quiz
Q: Which background-size value fills the whole box, cropping if needed?
A: cover
Q: What border-radius turns a square image into a circle?
A: 50% | 50
Q: Which property adds a shadow to a box?
A: box-shadow
Q: Which keyword makes a box-shadow appear inside the element?
A: inset
Q: What is the order of the border shorthand: width style colour, or colour style width?
A: width style colour | width style color
```
=== exercise ===
Give `.card` a **border-radius of 12px** and a **box-shadow**.
=== starter ===
<style>
  .card {
    background: #fff;
    padding: 16px;
    
  }
</style>
<div class="card">My card</div>
=== must_contain ===
border-radius: 12px
box-shadow
