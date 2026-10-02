---
slug: introduction
title: "CSS introduction: what it is, why we need it, who uses it and how it works"
after: KEEP
---
# CSS introduction: what it is, why we need it, who uses it and how it works

HTML gives a page its structure; **CSS** makes it look good and work on every screen. Colours, fonts, spacing, layouts, mobile menus, dark mode and animations are all CSS. A website without CSS looks like a plain document from the 1990s: black text, blue links, everything stacked down the left side. This first unit explains what CSS is, why it exists, who uses it, and exactly how it works, from your first rule to how browsers decide which style wins.

:::note What you will learn
- What CSS is and the problem it solved
- Why CSS matters for business, users and developers
- Who uses CSS and where it's used
- The anatomy of a CSS rule: selector, property, value
- Three ways to add CSS (inline, internal, external) and which to use
- How browsers apply CSS: the cascade, specificity and inheritance (introduction)
- Comments, formatting and debugging with DevTools
:::

## What is CSS?

**CSS** stands for **Cascading Style Sheets**.

- **Style** = how things look: colour, size, spacing, position.
- **Sheet** = a list of style rules (usually a separate `.css` file).
- **Cascading** = when several rules apply to the same element, CSS has a system for deciding which one wins, like water flowing down steps where later and more specific rules take priority.

:::define CSS
The language that describes the **presentation** of HTML documents: colours, fonts, spacing, layout, responsiveness and animation. HTML says *what* something is; CSS says *how it looks*.
:::

### The problem CSS solved

In the early web (1990s), styling was done inside HTML with tags like `<font color="red" size="5">` and layout tables. Every page repeated the same styling code, so changing a site's colour meant editing hundreds of pages. **Håkon Wium Lie** proposed CSS in 1994; the W3C published **CSS level 1 in 1996**. CSS separated **content** (HTML) from **presentation** (CSS): one stylesheet could style an entire website.

Today CSS is developed as separate **modules** (Flexbox, Grid, Colors, Animations...), each improving independently, so there's no single "CSS4"; browsers add features continuously.

:::think A school website has 200 pages. The head teacher wants all headings changed from blue to green. How long does it take with CSS vs with styling inside every HTML page?
With an external CSS file, you change **one line** (e.g. `h1, h2 { color: green; }`) and all 200 pages update instantly. With styles inside each page, you'd edit 200 files and probably miss some. This "change once, update everywhere" power is the main reason CSS exists.
:::

## Why do we need CSS?

1. **Professional appearance and trust.** Visitors judge a business by its website within seconds. Clean design makes people trust the business enough to call or buy.
2. **Mobile-friendly design.** Most Kenyans browse on phones. CSS **media queries** and flexible layouts make one site work on a small phone, a tablet and a big monitor.
3. **Readability and accessibility.** Good font sizes, line spacing, contrast and focus outlines make content readable for everyone, including people with low vision.
4. **Branding.** Company colours and fonts applied consistently across every page.
5. **Maintenance.** One stylesheet controls the whole site; changes are quick and consistent.
6. **Performance.** CSS replaces heavy images for shapes, gradients, shadows and icons, making pages lighter.
7. **User experience.** Hover effects, smooth transitions, sticky headers, dark mode and clear layouts help users find what they need.

## Who uses CSS?

| Who | How |
|---|---|
| **Front-end developers** | Write CSS for websites and web apps every day |
| **Web designers / UI designers** | Turn designs into CSS, or work in tools that generate CSS (Figma's dev mode shows CSS) |
| **WordPress and Shopify developers** | Customise themes with CSS |
| **Email developers** | Style HTML emails (with special limitations) |
| **App developers** | React Native and Flutter use CSS-like styling ideas; hybrid apps use real CSS |
| **Digital marketers** | Tweak landing pages and email templates |
| **Content managers and bloggers** | Small style edits in website builders ("Additional CSS") |

:::career
CSS is required for jobs like **front-end developer**, **web designer**, **WordPress developer** and **UI developer**. Freelancers on Upwork and Fiverr frequently get paid for "fix my website on mobile", "make my site look like this design" and "customise my WordPress theme": all CSS work.
:::

## Where is CSS used?

- Every styled website and web app (Google, Jumia, eCitizen, banks, school portals)
- WordPress themes, Shopify themes, website builders
- HTML emails and newsletters
- Desktop apps built with web technology (VS Code, Slack, Teams)
- E-books (EPUB uses CSS), printed documents and PDFs generated from HTML (invoices, reports)
- Smart TV interfaces and kiosks built with web technology

## The anatomy of a CSS rule

```
h1 {
  color: navy;
  font-size: 32px;
}
│     │       │
│     │       └ value
│     └ property
└ selector
```

| Part | Meaning |
|---|---|
| **Selector** | *Which* elements to style (`h1`, `.price`, `#header`) |
| **Declaration block** | Everything inside `{ }` |
| **Declaration** | One `property: value;` pair |
| **Property** | *What* to change (`color`, `font-size`, `margin`) |
| **Value** | *How* to change it (`navy`, `32px`, `10px auto`) |

Rules:
- Each declaration ends with a **semicolon** `;`.
- Property and value are separated by a **colon** `:`.
- CSS ignores extra spaces and line breaks, so format it neatly.
- Property names are lowercase with hyphens: `background-color`, `font-family`.

```try-html
<style>
  h1 {
    color: navy;
    font-size: 32px;
  }
  p {
    color: #475569;
    line-height: 1.6;
  }
</style>
<h1>Karibu to our bakery</h1>
<p>Fresh bread, cakes and mandazi baked every morning in Nyeri.</p>
```

Run it, then change `navy` to `darkgreen` and `32px` to `48px`.

## Three ways to add CSS

### 1. Inline styles (avoid for most work)

The `style` attribute on one element:

```try-html
<p style="color: crimson; font-weight: bold;">Offer ends Friday!</p>
```

Only affects that element, mixes style into HTML, is hard to maintain and very hard to override. Use only for quick tests or values generated by JavaScript.

### 2. Internal stylesheet

A `<style>` element in the page's `<head>` (the practice editor here uses this):

```
<head>
  <style>
    body { font-family: Arial, sans-serif; }
  </style>
</head>
```

Fine for single-page projects and examples; doesn't share styles across pages.

### 3. External stylesheet (best for real websites)

A separate file, e.g. `css/style.css`, linked from every page's `<head>`:

```
<link rel="stylesheet" href="css/style.css">
```

```
/* css/style.css */
body { font-family: Arial, sans-serif; margin: 0; }
h1 { color: navy; }
```

Benefits: one file styles the whole site, the browser **caches** it (downloads once, then reuses it on every page, so pages load faster), and HTML stays clean.

| Method | Where | Scope | Use for |
|---|---|---|---|
| Inline | `style=""` attribute | One element | Rare exceptions |
| Internal | `<style>` in `<head>` | One page | Single pages, demos |
| External | `.css` file + `<link>` | Whole site | Real websites |

## How the browser applies CSS

1. The browser reads the HTML and builds the **DOM** (a tree of elements).
2. It reads all CSS (browser defaults, your stylesheets, inline styles) and builds the **CSSOM**.
3. For each element, it works out every property's final value: which rules match, which wins.
4. It calculates **layout** (sizes and positions), then **paints** pixels.

### Browser default styles

Before your CSS, every browser applies a **user agent stylesheet**: headings are bold and big, links are blue and underlined, `<body>` has an 8px margin, lists have bullets. Your CSS overrides these. Many developers start with a small "reset" (e.g. `body { margin: 0; }`, `* { box-sizing: border-box; }`).

### The cascade in one minute

When two rules set the same property on the same element, the browser decides by:

1. **Importance** (`!important`, rarely used) and origin.
2. **Specificity**: more specific selectors win (`#id` > `.class` > `element`).
3. **Order**: if equally specific, the **later** rule wins.

```try-html
<style>
  p { color: blue; }
  p { color: green; }          /* same specificity, later: wins */
  .note { color: purple; }     /* class is more specific than p: wins */
</style>
<p>I'm green (the later rule wins).</p>
<p class="note">I'm purple (the class selector is more specific).</p>
```

You'll study this deeply in **The cascade, specificity and inheritance**.

### Inheritance

Some properties (mostly text ones: `color`, `font-family`, `font-size`, `line-height`) are **inherited** by children. Set the font once on `body`, and everything inside uses it. Box properties (`margin`, `padding`, `border`, `background`) are **not** inherited.

```try-html
<style>
  body { font-family: Georgia, serif; color: #1e293b; }
  .card { border: 2px solid #f59e0b; padding: 12px; }
</style>
<div class="card">
  <h2>Inherited font</h2>
  <p>This text uses Georgia because body set it. The border did not pass to the paragraph.</p>
</div>
```

## CSS comments

```
/* This is a CSS comment. The browser ignores it. */
/* ===== Header styles ===== */
header { background: #0b1b35; }
```

Comments can span lines; there are no `//` comments in CSS.

## Debugging CSS with DevTools

Press **F12** (or right-click → **Inspect**) in Chrome/Edge/Firefox:

- Click any element to see **every CSS rule** applied, in order, with overridden values crossed out.
- Edit values live to experiment (changes disappear on reload).
- The **Computed** tab shows final values; the box model diagram shows margin, border, padding and size.
- Toggle the **device toolbar** (phone icon) to test mobile sizes.

This is the single most useful CSS skill: when something looks wrong, inspect it.

## Common beginner mistakes

| Mistake | Example | Fix |
|---|---|---|
| Missing semicolon | `color: red font-size: 20px;` | `color: red; font-size: 20px;` |
| Missing brace | `p { color: red;` | Close with `}` |
| Wrong property name | `font-colour: red;` | `color: red;` (American spelling) |
| Space in value units | `font-size: 20 px;` | `font-size: 20px;` |
| Class without dot | `price { ... }` | `.price { ... }` |
| Wrong path to CSS file | `href="style.css"` when it's in `css/` | `href="css/style.css"` |
| Expecting box properties to inherit | Border on parent only | Style children directly |

:::tip When CSS "doesn't work"
1. Check the file is linked (DevTools → Sources/Network: did `style.css` load, or 404?).
2. Check for typos and missing semicolons/braces above the rule.
3. Inspect the element: is your rule there but crossed out? Then a more specific or later rule wins.
4. Hard-refresh (`Ctrl+Shift+R`) to bypass the browser cache.
:::

## Practice tasks

1. Style a page: set the body font to `Arial, sans-serif`, headings to your favourite colour, paragraphs to grey with `line-height: 1.6`.
2. Create an external `style.css` on your computer, link it to two HTML pages, and change one colour to see both pages update.
3. Write three rules targeting the same paragraph and predict which wins; then test.
4. Use DevTools on a big website: find the font family and main colour used for headings.
5. Remove all CSS from a page (DevTools → disable stylesheet, or view it with styles off) and notice what the browser defaults look like.

## Summary

- **CSS** (Cascading Style Sheets) controls presentation: colours, fonts, spacing, layout, responsiveness and animation.
- It separated content (HTML) from presentation, so one stylesheet can style a whole site.
- A rule = **selector** + `{ property: value; }`.
- Add CSS inline (avoid), internally (`<style>`, single pages) or externally (`<link>` to a `.css` file, best).
- The **cascade** picks winners by importance, specificity and order; text properties **inherit**.
- Use **DevTools** to inspect and debug styles.

```quiz
Q: What does CSS stand for?
A: Cascading Style Sheets | cascading style sheets
Q: In "h1 { color: navy; }", what is h1 called?
A: selector | the selector
Q: In "color: navy", what is navy called?
A: value | the value
Q: Which way of adding CSS is best for a whole website: inline, internal or external?
A: external
Q: Which HTML element links an external stylesheet?
A: link | <link>
Q: If two rules have the same specificity, which wins: the earlier or the later?
A: later | the later | the later one
Q: Is the border property inherited by child elements? (yes or no)
A: no
Q: Which key opens browser DevTools on most computers?
A: F12
```
=== exercise ===
Make every `<p>` on the page **green** using a `<style>` rule.
=== starter ===
<style>
  
</style>
<p>Karibu!</p>
=== expected ===

=== must_contain ===
p
color
green
