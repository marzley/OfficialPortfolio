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

## Why images and icons make or break a design

Visitors judge a website within seconds, mostly by its visuals. Real, high-quality images build trust ("this business is real"); clear icons help people scan and understand services quickly. Poor choices (blurry photos, random clip art, inconsistent icons, slow-loading images) make even good businesses look unprofessional. Web designers spend much of their time choosing, preparing and placing visuals.

## Art direction: a consistent visual style

Decide on a style before collecting images:

| Decision | Options |
|---|---|
| Photo style | Bright and airy, warm and natural, bold and high-contrast |
| Subjects | Real staff and customers, products in use, local places |
| Colour treatment | Natural, or a consistent filter/tint matching brand colours |
| Composition | Space for text overlays, consistent angles |
| Illustration style | Flat, outlined, 3D, hand-drawn (pick one) |
| Icon style | Outline or filled, same stroke width and corner style |

A one-page **mood board** (Figma, Canva, Pinterest) with examples helps the client agree on the direction.

## Planning a photoshoot for a client

Real photos usually outperform stock photos for local businesses. A simple shoot plan:

1. **Shot list**: storefront, team portrait, each team member, workspace, products (several angles), service in action, happy customers (with consent).
2. **Timing**: soft morning or late-afternoon light; clean and tidy the space.
3. **Orientation**: shoot both landscape (desktop heroes) and portrait/square (mobile, social media).
4. **Space for text**: some photos with empty areas for headlines.
5. **Consent**: written permission from people photographed, especially customers and children.

## Image sizes and crops for responsive design

| Placement | Typical aspect ratio | Notes |
|---|---|---|
| Desktop hero | 16:9 or wider | Subject positioned so it still works when cropped on mobile |
| Mobile hero | 4:5 or 1:1 | Use `<picture>` for a different crop if needed |
| Cards/thumbnails | 4:3, 3:2 or 1:1 | Keep consistent across a grid |
| Team photos | 1:1 or 4:5 | Same background and framing for everyone |
| Blog featured images | 16:9 or 1.91:1 | Also used for social sharing previews |

Use CSS `aspect-ratio` and `object-fit: cover` to keep grids tidy even when uploaded photos differ.

## Icons: choosing and using them well

- Use one icon set throughout (e.g. Lucide, Heroicons, Phosphor, Material Symbols, Font Awesome; check each licence).
- Pair icons with text labels; icons alone are often misunderstood.
- Keep sizes consistent (e.g. 24px in navigation, 32–48px in feature sections).
- Use inline SVG or an SVG sprite so icons are sharp, small and colourable with CSS (`fill: currentColor`).
- Mark decorative icons `aria-hidden="true"`; give meaningful icon-only buttons an `aria-label`.

```html
<button class="icon-btn" aria-label="Open menu">
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 6h18M3 12h18M3 18h18"/>
  </svg>
</button>
```

## Illustrations and graphics

Illustrations explain abstract ideas (how a service works, a process) and give a brand personality. Keep them consistent in style and colour, use SVG where possible for sharpness and small size, and make sure illustrated people reflect your audience. Free sources include unDraw and similar libraries (check licences); custom illustrations make a brand more distinctive.

## Image SEO

- Descriptive file names: `web-design-agency-nakuru-team.webp`.
- Helpful alt text describing the image's content and purpose.
- Images near relevant text and headings.
- Structured data for products, recipes and articles where relevant.
- An image sitemap or including images in your sitemap for image-heavy sites.

## Performance checklist for visuals

1. Resize and compress every image before upload (WebP/AVIF).
2. Use `srcset`/`sizes` for responsive images.
3. Lazy-load images below the fold; prioritise the hero.
4. Set width/height (or aspect-ratio) to prevent layout shift.
5. Prefer SVG for icons and simple graphics.
6. Avoid heavy GIFs; use short MP4/WebM videos or CSS animations instead.
7. Use a CDN for image-heavy sites.

## Copyright and licensing in detail

| Source | Can you use it? |
|---|---|
| Google Images search results | Usually copyrighted: don't use without permission |
| Free stock sites (Unsplash, Pexels, Pixabay) | Generally yes under their licences; check restrictions (e.g. not reselling as-is) |
| Paid stock (Shutterstock, Adobe Stock) | Yes, according to the licence purchased |
| Client's own photos | Yes, if they own them or have permission |
| AI-generated images | Check the tool's terms; avoid imitating real people, logos or artists' styles too closely |
| Photos of people | Need consent for commercial use (model release), especially identifiable individuals |

Keep a simple record of where each image came from and its licence.

## Practice

1. Create a mood board for a local restaurant's website with photo, colour and icon style examples.
2. Write a shot list for a photoshoot at a small business.
3. Replace generic stock photos on a practice site with real or better-matched images, optimised as WebP.
4. Build a features section with consistent SVG icons and labels.
5. Audit a website's images: file sizes, alt text, licences and consistency.

:::think A website uses a stock photo of smiling models in an office for a small family-run hardware shop in Kitale. Why might real photos work better, even if they're less polished?
Customers can tell stock photos are generic, which reduces trust. Real photos of the actual shop, staff and products show the business exists, help customers recognise the shop when they visit, and make the brand feel local and authentic. Well-lit, honest photos usually build more confidence and enquiries than polished but unrelated images.
:::

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
Q: What is a collection of example images used to agree on a visual style called? (two words)
A: mood board | moodboard
Q: Which CSS value lets SVG icons take the text colour? (fill: ...)
A: currentColor | currentcolor
Q: What permission document is needed to use photos of identifiable people commercially? (two words)
A: model release | consent form | release form
```
