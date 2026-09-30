---
slug: head-meta
title: The head: title, meta tags, favicon and links
after: attributes-classes-ids
---
# The head: title, meta tags, favicon and links

Everything in `<body>` is what people see. Everything in `<head>` is information **about** the page, for the browser, for Google and for WhatsApp or Facebook when someone shares your link. A good head is the difference between a page that looks professional in search results and one that doesn't.

## A complete, modern head

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mama Njeri's Bakery | Fresh cakes in Thika</title>
  <meta name="description" content="Birthday and wedding cakes baked fresh in Thika. Order on WhatsApp and pay with M-Pesa.">
  <link rel="icon" href="favicon.png">
  <link rel="stylesheet" href="styles.css">
  <link rel="canonical" href="https://example.co.ke/">

  <meta property="og:title" content="Mama Njeri's Bakery">
  <meta property="og:description" content="Fresh cakes in Thika. Order on WhatsApp.">
  <meta property="og:image" content="https://example.co.ke/share.jpg">
</head>
<body>
  ...
</body>
</html>
```

Let's go through it line by line.

## charset and viewport (never skip these)

- `<meta charset="utf-8">` lets the page show every character correctly: Kiswahili, ©, €, emoji. Put it first.
- `<meta name="viewport" ...>` tells phones to use the real screen width. **Without it, your site looks tiny on phones** and Google marks it as not mobile friendly.

## title

The `<title>` shows on the browser tab, in bookmarks and as the **blue link in Google results**. Good titles:

- are unique for every page,
- are about 50–60 characters,
- put the most important words first: `Plumber in Nakuru | Otieno Plumbing` beats `Home`.

## meta description

The **description** is the grey text under your link in Google. It doesn't directly change your ranking, but a clear one gets more clicks. Aim for 120–160 characters and include what you offer and where.

## favicon

The small icon on the tab. Use a square PNG (at least 48×48) or an `.ico` file:

```html
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```

## Linking CSS and JavaScript

```html
<link rel="stylesheet" href="styles.css">
<script src="app.js" defer></script>
```

`defer` means "download now, run after the page is read", so your page appears faster.

## Share previews (Open Graph)

When a link is shared on WhatsApp, Facebook or LinkedIn, these tags decide the title, text and picture in the preview card:

| Tag | Purpose |
|---|---|
| `og:title` | Title in the preview |
| `og:description` | Short text |
| `og:image` | The picture (use a full `https://` address, 1200×630 px works well) |
| `og:url` | The page address |

## Try it: see what the head changes

Run this, then look at the result's title. Change the title text and run again.

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Kenyan Café</title>
  <style>body { font-family: sans-serif; }</style>
</head>
<body>
  <h1>Karibu to My Kenyan Café ☕</h1>
  <p>The title in the head is: <strong id="t"></strong></p>
  <script>document.getElementById("t").textContent = document.title;</script>
</body>
</html>
```

## The lang attribute

`<html lang="en">` tells browsers and screen readers the page language. For a Kiswahili page use `lang="sw"`. It helps pronunciation for screen readers and helps Google show the right page to the right people.

## Checklist for every page

1. `<!DOCTYPE html>` and `<html lang="...">`
2. `charset` then `viewport`
3. A unique `<title>` and `description`
4. Favicon
5. Share tags (`og:`) for pages people will share

```quiz
Q: Which meta tag makes a page display properly on phones? (one word, the name value)
A: viewport
Q: Which element's text becomes the blue link in Google results?
A: title
Q: About how many characters should a meta description be? Give a number between 120 and 160.
A: 120 | 130 | 140 | 150 | 155 | 160 | 150-160 | 120-160
Q: Which attribute on script makes it run after the page has been read?
A: defer
Q: Which prefix do share-preview tags like og:image use? (two letters)
A: og
```
=== exercise ===
Complete the head: add a `<title>` with the text **Otieno Plumbing** and a viewport meta tag.
=== starter ===
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  
</head>
<body>
  <h1>Otieno Plumbing</h1>
</body>
</html>
=== must_contain ===
<title>Otieno Plumbing</title>
name="viewport"
