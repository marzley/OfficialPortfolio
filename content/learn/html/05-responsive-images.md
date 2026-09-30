---
slug: responsive-images
title: Images done right: sizes, formats, figure and lazy loading
after: links-images
---
# Images done right: sizes, formats, figure and lazy loading

Images make a site feel real, but they are also the **number one reason sites are slow** in Kenya, where many visitors browse on mobile data. This lesson shows how to use images that look sharp and load fast.

## The basic image, done properly

```html
<img src="shop.jpg" alt="Inside our shop in Nyeri, with shelves of groceries"
     width="800" height="533" loading="lazy">
```

| Attribute | Why it matters |
|---|---|
| `src` | The file to show |
| `alt` | Text for blind users, and shown if the image fails. Describe what matters. |
| `width` / `height` | Lets the browser reserve space, so the page doesn't jump while loading |
| `loading="lazy"` | Loads the image only when the user scrolls near it |

> Tip: for pure decoration (a background swirl), use an empty alt: `alt=""`. Screen readers will skip it.

## Choose the right format

| Format | Best for | Notes |
|---|---|---|
| **JPG** | Photos | Small files, no transparency |
| **PNG** | Logos, screenshots, transparency | Can be big for photos |
| **WebP** | Almost everything | 25–35% smaller than JPG/PNG, supported by all modern browsers |
| **SVG** | Logos and icons | Code-based, sharp at any size, tiny |
| **GIF** | Simple animations | Usually better as a short video |

## Resize before you upload

A phone photo is often 4000 px wide and 4 MB. A web page rarely needs more than 1200–1600 px. Resize and compress first (Squoosh.app is free), and aim for **under 200 KB** per photo.

## figure and figcaption

When an image has a caption, group them:

```try-html
<figure>
  <img src="https://picsum.photos/id/1043/600/360" alt="Green hills and a winding road" width="600" height="360" style="max-width:100%;height:auto">
  <figcaption>Photo: the road to our farm in Kericho.</figcaption>
</figure>
```

## Images that fit any screen

Add this CSS once and images will never overflow a phone screen:

```try-html
<style>
  img { max-width: 100%; height: auto; }
</style>
<img src="https://picsum.photos/id/1015/1400/700" alt="A river between mountains" width="1400" height="700">
<p>Resize the window: the image shrinks to fit.</p>
```

## srcset: send smaller files to phones

With `srcset` you list the same image in several sizes and let the browser pick:

```html
<img src="team-800.jpg"
     srcset="team-480.jpg 480w, team-800.jpg 800w, team-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 800px"
     alt="Our team outside the office" width="800" height="533">
```

- `480w` means "this file is 480 pixels wide".
- `sizes` tells the browser how wide the image will be shown. On a phone (up to 600px) it fills the screen (`100vw`); otherwise it shows at 800px.

A phone then downloads the 480px file instead of the 1600px one, saving data and time.

## picture: different formats or crops

```html
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Students in a computer lab" width="1200" height="600">
</picture>
```

Browsers that support WebP use it; older ones fall back to the JPG.

## Checklist

1. Resize and compress every image.
2. Always write a useful `alt`.
3. Set `width` and `height`.
4. Use `loading="lazy"` for images below the first screen.
5. Prefer WebP; use SVG for logos and icons.

```quiz
Q: Which attribute describes an image for blind users?
A: alt
Q: Which attribute value makes images load only when the user scrolls near them?
A: lazy | loading="lazy"
Q: Which image format is best for logos and icons that must be sharp at any size?
A: svg
Q: Which element groups an image with its caption?
A: figure
Q: Which attribute lists several sizes of the same image?
A: srcset
```
=== exercise ===
Add an image with `src="shop.webp"`, a useful `alt`, `width="800"`, `height="533"` and lazy loading.
=== starter ===
<!-- your image here -->
=== must_contain ===
src="shop.webp"
alt="
loading="lazy"
width="800"
