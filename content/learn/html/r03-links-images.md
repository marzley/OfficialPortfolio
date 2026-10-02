---
slug: links-images
title: "Links and images: connecting pages and showing pictures"
after: KEEP
---
# Links and images: connecting pages and showing pictures

The "HyperText" in HTML means **links**: the ability to jump from one page to another anywhere in the world. Links are what made separate documents into a **web**. Images make pages human: product photos, logos, team pictures and maps. This unit covers both in full detail, from the first `<a>` tag to professional habits that make pages fast, accessible and trusted.

:::note What you will learn
- What links are, why they matter and the anatomy of the `<a>` element
- Linking to other websites, your own pages, sections of a page, email, phone calls, WhatsApp and downloads
- Opening links in new tabs safely
- Writing link text that works for everyone
- What images are made of, image formats and file sizes
- The `<img>` element: `src`, `alt`, `width` and `height`
- Writing excellent `alt` text
- Making images clickable and avoiding common mistakes
:::

## Part 1: Links

### What is a link?

A **link** (hyperlink) is clickable content that takes the user to another place: another website, another page on your site, a section of the same page, or an action like starting a phone call.

:::define Hyperlink
A connection from one web resource to another, written in HTML with the **anchor** element `<a>` and its `href` (hypertext reference) attribute.
:::

### Why links matter

- **Navigation:** menus, buttons like "Contact us" and "Buy now" are links.
- **The web itself:** without links, every website would be an island.
- **SEO:** Google discovers pages by following links, and links from other trusted sites help your site rank.
- **Business actions:** "Call now", "Chat on WhatsApp" and "Email us" links turn visitors into customers with one tap.

### Who uses them and where

Every website, every web app and most emails use links: navigation menus, footers, blog posts, online shops (product pages), government portals ("Apply here"), and marketing emails ("Shop the sale").

### The anatomy of a link

```
<a href="https://kra.go.ke">Visit the KRA website</a>
 │   │                       │
 │   │                       └ link text: what users see and click
 │   └ href: where the link goes (the destination)
 └ a = anchor element
```

```try-html
<p><a href="https://marzleytechsolutions.co.ke">Visit Marzley Tech</a></p>
<p><a href="https://www.ecitizen.go.ke">Go to eCitizen</a></p>
```

### Types of link destinations

| Type | Example `href` | What happens |
|---|---|---|
| **Absolute URL** (another website) | `https://kra.go.ke` | Opens that website |
| **Relative URL** (your own site) | `about.html`, `services/web.html` | Opens a page on your site (next units explain paths fully) |
| **Fragment** (same page section) | `#prices` | Scrolls to the element with `id="prices"` |
| **Email** | `mailto:info@example.co.ke` | Opens the email app |
| **Phone** | `tel:+254712345678` | Starts a call on phones |
| **SMS** | `sms:+254712345678` | Opens the messages app |
| **WhatsApp** | `https://wa.me/254712345678` | Opens a WhatsApp chat |
| **File** | `price-list.pdf` | Opens or downloads the file |

```try-html
<p><a href="mailto:hello@example.co.ke?subject=Website%20quote">Email us for a quote</a></p>
<p><a href="tel:+254712345678">Call 0712 345 678</a></p>
<p><a href="https://wa.me/254712345678?text=Hello%2C%20I%20need%20a%20website">Chat on WhatsApp</a></p>
<p><a href="sms:+254712345678">Send an SMS</a></p>
```

:::kenya Phone numbers in links
Use the **international format** in `tel:` and WhatsApp links: `+254` (or `254` for wa.me) followed by the number **without the first 0**. So `0712 345 678` becomes `tel:+254712345678` and `https://wa.me/254712345678`. Spaces aren't allowed in the `href`, but you can show spaces in the link text.
:::

Notice `%20` and `%2C` in the examples: spaces and commas in URLs are written as **URL-encoded** characters (`%20` = space, `%2C` = comma).

### Links to a section of the same page

Give the target element an `id`, then link to `#` plus that id. Long pages (FAQs, documentation, this lesson's contents list) use this.

```try-html
<p><a href="#prices">Jump to prices</a> · <a href="#contact">Jump to contact</a></p>

<h2 id="services">Services</h2>
<p>Websites, apps, hosting and SEO.</p>
<p style="height:300px">(Long content here…)</p>

<h2 id="prices">Prices</h2>
<p>Websites from KSh 15,000.</p>
<p style="height:300px">(More content…)</p>

<h2 id="contact">Contact</h2>
<p>Call 0712 345 678.</p>
<p><a href="#">Back to top</a></p>
```

An `id` must be **unique** on the page and shouldn't contain spaces.

### Opening links in a new tab

`target="_blank"` opens the link in a new tab:

```try-html
<p><a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Open Google Maps (new tab)</a></p>
```

- Add `rel="noopener noreferrer"` with `target="_blank"` for external sites. `noopener` stops the new page from controlling your page through JavaScript (a security issue called "tabnabbing"); modern browsers now apply it by default, but adding it is still best practice for older browsers.
- **Use new tabs sparingly.** Users can open new tabs themselves. Good uses: PDFs, help pages in the middle of a form, external maps. Tell users: "(opens in a new tab)".

### Download links

The `download` attribute suggests the browser saves the file instead of opening it (works for files on your own site):

```
<a href="files/marzley-price-list.pdf" download>Download our price list (PDF, 240 KB)</a>
```

Always say the file type and size, especially for users on mobile data.

### The `title` attribute

`title` shows a small tooltip on hover with a mouse. It doesn't work on touch screens and screen readers handle it inconsistently, so **never put important information only in `title`**.

### Writing good link text

Link text should make sense **on its own**. Screen reader users often list all links on a page; a list of "click here, click here, read more" is useless.

| Bad | Good |
|---|---|
| Click [here] for our prices | See [our website prices] |
| [Read more] | [Read more about our hosting plans] |
| Visit [https://www.ecitizen.go.ke/...] | Apply on [eCitizen] |

:::think Why is "click here" bad even for sighted users on phones?
On phones people don't "click", they tap; and "here" gives no information about where the link goes, so users must read the whole sentence around it. Descriptive link text ("Download the KCSE timetable") tells everyone, including Google, exactly what they'll get.
:::

### What can be inside a link?

Almost anything: text, images, or a whole card with a heading and paragraph. But you can't put a link inside another link, or a button inside a link.

```try-html
<a href="https://marzleytechsolutions.co.ke/work" style="display:block;border:1px solid #ccc;padding:12px;border-radius:10px;text-decoration:none;color:inherit">
  <h3>Our portfolio</h3>
  <p>See websites and systems we've built for Kenyan businesses.</p>
</a>
```

### Link states (preview of CSS)

Browsers style links by state: blue underlined (unvisited), purple (visited), and you can style `:hover` (mouse over) and `:focus` (keyboard). Keep links visually obvious; users expect underlined or clearly coloured links.

## Part 2: Images

### What is a digital image?

A digital photo is a grid of tiny coloured squares called **pixels**. A photo that is 1200 pixels wide and 800 tall has 960,000 pixels. More pixels mean more detail and a **bigger file**. Big files are slow and expensive on mobile data, so web images must be the right size.

### Why images matter

- People decide whether to trust a business in seconds; real photos of products, staff and work help.
- Online shops depend on product photos.
- Images explain things words can't: maps, diagrams, screenshots.
- But images are usually the **heaviest** part of a page. A page full of 5 MB phone photos can cost a visitor more data than they want to spend and load slowly.

### Image formats

| Format | Best for | Notes |
|---|---|---|
| **JPG / JPEG** | Photos | Small files; no transparency |
| **PNG** | Logos, screenshots, images needing transparency | Larger for photos |
| **WebP** | Photos and graphics on the web | Usually 25–35% smaller than JPG at similar quality; supported by all modern browsers |
| **AVIF** | Photos | Even smaller; supported by modern browsers |
| **SVG** | Logos, icons, simple illustrations | Vector: sharp at any size, tiny files |
| **GIF** | Simple animations | Large files; prefer short videos |

:::tip Rule of thumb
Resize photos to the size they'll be shown (often 800–1600 px wide), convert to **WebP** or compressed **JPG**, and aim for **under 200 KB** per photo. Free tools: Squoosh (squoosh.app), TinyPNG, or exporting from Canva at a smaller size.
:::

### The `<img>` element

```
<img src="images/shop-front.webp" alt="Juma's Electronics shop front on Kenyatta Avenue" width="800" height="600">
```

| Attribute | Purpose |
|---|---|
| `src` | The image file's location (relative path or full URL). **Required.** |
| `alt` | Alternative text describing the image. **Required** (use `alt=""` for decorative images). |
| `width`, `height` | The image's size in pixels. Lets the browser reserve space so the page doesn't jump while loading. |
| `loading="lazy"` | Loads the image only when the user scrolls near it (saves data). |

`<img>` is a **void** element: no closing tag.

```try-html
<img src="https://picsum.photos/320/180" alt="A random landscape photo" width="320" height="180">
<p>Photos should be small (WebP or JPG) so pages load fast on mobile data.</p>
```

### Writing excellent `alt` text

`alt` text is read aloud by screen readers, shown when an image fails to load (common on slow networks), and used by Google Images to understand the picture.

How to write it:

1. **Describe the purpose and content**, briefly: what would you say if reading the page to someone on the phone?
2. **Be specific:** "Red Toyota Vitz 2014, front view" beats "car".
3. **Don't start with "image of" or "picture of"**; screen readers already say "image".
4. **Usually under about 125 characters.**
5. **Decorative images** (background swirls, dividers) get an **empty** `alt=""` so screen readers skip them.
6. **Images of text** must have that text in the `alt`.
7. **Linked images:** describe where the link goes, e.g. `alt="Marzley Tech home"` for a logo link.

| Image | Bad alt | Good alt |
|---|---|---|
| Logo linking home | `alt="logo"` | `alt="Marzley Tech home"` |
| Product photo | `alt="shoe"` | `alt="Black leather school shoes, size 38"` |
| Team photo | `alt="photo"` | `alt="Our three technicians outside the Thika workshop"` |
| Poster with text | `alt="poster"` | `alt="Back to school sale: 20% off laptops until 15 January"` |
| Decorative wave | `alt="wave"` | `alt=""` |

:::think A photo shows a chart of monthly sales. Is "Sales chart" good alt text?
Not really. It says what it is but not what it shows. Better: "Bar chart: sales grew from KSh 120,000 in January to KSh 310,000 in June". For complex charts, also explain the key point in the page text or a table so everyone gets the information.
:::

### Width, height and layout shift

When the browser doesn't know an image's size, it shows the text first, then **pushes everything down** when the image arrives. You've probably tapped the wrong button because of this. Setting `width` and `height` (the real image size) lets the browser reserve the space. Google measures this as **Cumulative Layout Shift (CLS)**, part of its page experience signals. CSS can still make the image responsive (`max-width: 100%; height: auto;`).

### Images from other websites (hotlinking)

You can set `src` to a full URL from another site, but:

- The image may disappear or change at any time.
- You use the other site's bandwidth without permission.
- **Copyright:** most images online are owned by someone. Use your own photos, images you've paid for, or free-licence sites (Unsplash, Pexels, Pixabay) and follow their terms.

### Clickable images

Put the `<img>` inside an `<a>`:

```try-html
<a href="https://marzleytechsolutions.co.ke">
  <img src="https://picsum.photos/200/80" alt="Marzley Tech home page" width="200" height="80">
</a>
```

### Captions (preview)

`<figure>` and `<figcaption>` group an image with a visible caption. You'll use them in the responsive images unit:

```try-html
<figure>
  <img src="https://picsum.photos/300/180" alt="Mount Kenya at sunrise" width="300" height="180">
  <figcaption>Mount Kenya from Nanyuki, early morning.</figcaption>
</figure>
```

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Missing `alt` | Screen readers read the file name ("IMG_2034 dot jpg") | Always add `alt` |
| `alt="image"` | Gives no information | Describe the content and purpose |
| Huge phone photos (4–8 MB) | Slow pages, wasted data | Resize and compress first |
| Spaces or capitals in file names | Broken images on servers | `shop-front.webp` |
| Wrong path | Broken image icon | Check the folder and spelling (next unit) |
| "Click here" link text | Unclear and inaccessible | Describe the destination |
| `target="_blank"` everywhere | Confusing; breaks the back button | Use only when needed |
| Phone links with 07... and spaces | May fail | `tel:+2547...` |

## Practice tasks

1. Create a "Contact us" section with links to call, SMS, email (with a subject) and WhatsApp (with a pre-filled message).
2. Make a long page with three sections and a mini menu at the top that jumps to each section, plus "Back to top" links.
3. Add three images with excellent `alt` text: a product, a team photo and a decorative divider.
4. Make a clickable logo image that links to a home page.
5. Take a photo with your phone, check its file size, then compress it with Squoosh to under 200 KB. Compare the quality.

## Summary

- Links use `<a href="...">`; the link text should describe the destination.
- `href` can be an absolute URL, a relative path, a `#fragment`, `mailto:`, `tel:`, `sms:` or a WhatsApp link.
- `target="_blank"` opens a new tab; use it sparingly and with `rel="noopener noreferrer"` for external sites.
- Images use `<img src alt width height>`; it's a void element.
- `alt` describes the image's content and purpose; decorative images get `alt=""`.
- Choose the right format (WebP/JPG for photos, SVG for logos), resize and compress images, and respect copyright.

```quiz
Q: Which element creates a link?
A: a | <a> | anchor
Q: Which attribute holds a link's destination?
A: href
Q: Which href prefix starts a phone call?
A: tel: | tel
Q: Which attribute value opens a link in a new tab?
A: _blank | target="_blank"
Q: Which image attribute is read aloud by screen readers?
A: alt
Q: What alt value should a purely decorative image have? Write it with the quotes removed (empty).
A: empty | "" | alt="" | nothing
Q: Which image format is a vector format that stays sharp at any size?
A: SVG
Q: To link to the element with id="prices" on the same page, what href do you use?
A: #prices
Q: Which two attributes stop the page jumping while images load? Write them joined with "and".
A: width and height | height and width
```
=== exercise ===
Add a link with the text **Our work** that goes to `https://marzleytechsolutions.co.ke/work`.
=== starter ===
<p>See what we've built:</p>
=== expected ===

=== must_contain ===
<a
href="https://marzleytechsolutions.co.ke/work"
Our work
