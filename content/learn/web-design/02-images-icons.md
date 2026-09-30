---
slug: images-icons-illustrations
title: Choosing images, icons and illustrations
after: spacing-layout
---
# Choosing images, icons and illustrations

Visuals decide whether a site feels trustworthy and local, or generic. A few rules make a big difference.

## Real photos beat stock photos

Customers trust what looks real: **your** team, **your** shop, **your** products, **your** happy customers. Generic stock photos of smiling people in suits feel fake, especially when the business is a Kenyan salon or garage.

Tips for taking your own photos with a phone:

- Use **daylight** from a window; avoid harsh midday sun and flash.
- **Clean the lens** and the background.
- Hold the phone **level**; use the grid lines and the rule of thirds.
- For products: plain background, several angles, and one photo "in use".
- Take **many** photos and choose the best few.

When you do need stock images, use free sites with clear licences: Unsplash, Pexels, Pixabay, and search for African/Kenyan context. Credit the photographer when asked.

## Image roles on a page

| Role | Example | Tip |
|---|---|---|
| **Hero** | Big image at the top | Shows the product or outcome; text on it needs a dark overlay |
| **Product** | Cake, phone, service photo | Consistent size and background |
| **People** | Team, customers | Builds trust; get permission |
| **Decorative** | Background shapes | Use sparingly; `alt=""` |
| **Proof** | Before/after, certificates, logos of clients | Very persuasive |

## Icons

Icons make scanning faster, but only when their meaning is obvious.

- Use **one icon set** throughout (e.g. Font Awesome, Lucide, Material Symbols, Phosphor) for a consistent style.
- Pair icons with **labels**. A heart might mean "favourite" or "health".
- Keep them simple and the same size.
- Use SVG icons: they're sharp at any size and tiny in file size.

```try-html
<style>
  .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; font-family: system-ui, sans-serif; }
  .f { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
  .f svg { width: 28px; height: 28px; stroke: #0b1b35; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .f h3 { margin: 8px 0 4px; font-size: 16px; }
  .f p { margin: 0; color: #64748b; font-size: 14px; }
</style>
<div class="features">
  <div class="f">
    <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
    <h3>Free delivery</h3><p>Within Juja and Thika</p>
  </div>
  <div class="f">
    <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
    <h3>Pay with M-Pesa</h3><p>Till number on delivery</p>
  </div>
  <div class="f">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    <h3>Ready in 24 hours</h3><p>Order today, enjoy tomorrow</p>
  </div>
</div>
```

## Illustrations

Illustrations explain abstract ideas (security, cloud, "how it works" steps) and give a brand personality. Keep one consistent style. Free sources: unDraw (you can set your brand colour), Storyset, Humaaans.

## Consistency checklist

- Same **aspect ratio** for images in a grid (use `object-fit: cover`).
- Same **corner radius** and shadow style.
- A limited **colour treatment** (e.g. all photos warm and bright).
- One **icon style** (outline or filled, not both).

## Performance and accessibility

- Compress and resize every image (WebP, under ~200 KB).
- Write meaningful `alt` text for informative images; `alt=""` for decoration.
- Never put important text **inside** an image: it can't be read by screen readers, translated, or found by Google, and it's blurry on phones.

## Copyright

"Found it on Google" is not permission. Use your own images, properly licensed stock, or images you have written permission to use. Businesses have received takedown demands for using copyrighted photos.

```quiz
Q: Which builds more trust for a local business: real photos or generic stock photos?
A: real photos | real
Q: What should icons usually be paired with so their meaning is clear?
A: labels | text | a label
Q: Which image format keeps icons sharp at any size?
A: SVG
Q: Should important text be placed inside images? (yes or no)
A: no
Q: Name a free stock photo site.
A: Unsplash | Pexels | Pixabay
```
