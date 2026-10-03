---
slug: attributes-classes-ids
title: Attributes, classes and IDs
after: text-formatting
---
# Attributes, classes and IDs

An **attribute** gives extra information about an element. It always goes inside the **opening tag**, as `name="value"`:

```html
<a href="https://marzleytechsolutions.co.ke" title="Our website">Visit us</a>
```

Here `href` and `title` are attributes of the `<a>` element.

## Rules for writing attributes

- Put them in the opening tag only, separated by spaces.
- Use lowercase names and wrap values in double quotes: `class="card"`.
- An element can have many attributes, but each name only once.
- Some attributes are **boolean**: writing the name is enough, e.g. `<input required>` or `<button disabled>`.

## Global attributes (work on almost any element)

| Attribute | What it does | Example |
|---|---|---|
| `id` | A unique name for one element on the page | `id="contact"` |
| `class` | A group name; many elements can share it | `class="card featured"` |
| `title` | Extra info shown when you hover | `title="Opens in a new tab"` |
| `lang` | The language of the content | `lang="sw"` |
| `hidden` | Hides the element | `<p hidden>` |
| `style` | Inline CSS (use sparingly) | `style="color:red"` |
| `data-*` | Your own data for JavaScript | `data-price="1500"` |

## id: one element, one name

An `id` must be **unique** on the page. It is used for:

1. Jump links: `<a href="#pricing">` scrolls to the element with `id="pricing"`.
2. Connecting a `<label>` to an input (`for="email"`).
3. Selecting one element in CSS (`#pricing`) or JavaScript (`getElementById`).

```try-html
<nav>
  <a href="#about">About</a> |
  <a href="#contact">Contact</a>
</nav>
<h2 id="about">About us</h2>
<p>We build websites and systems in Kenya.</p>
<p style="height:300px">(scroll space)</p>
<h2 id="contact">Contact</h2>
<p>Call 0745 789 590.</p>
```

## class: a reusable label

A `class` is a label you can put on many elements, and an element can have several classes separated by spaces. CSS then styles everything with that class at once.

```try-html
<style>
  .card { border: 1px solid #ccc; border-radius: 10px; padding: 12px; margin: 8px 0; }
  .featured { border-color: #ffb800; background: #fff8e1; }
  .price { font-weight: bold; color: #0b1b35; }
</style>
<div class="card">
  <h3>Landing page</h3>
  <p class="price">KSh 15,000</p>
</div>
<div class="card featured">
  <h3>Small business</h3>
  <p class="price">KSh 25,000</p>
</div>
```

| | `id` | `class` |
|---|---|---|
| How many times per page | Once | As many as you like |
| Per element | One id | Many classes |
| CSS selector | `#name` | `.name` |
| Best for | Links, labels, JavaScript | Styling groups |

## data-* attributes

You can invent attributes that start with `data-` to store information for JavaScript. The browser ignores them visually.

```try-html
<button data-product="Airtime" data-price="100">Buy</button>
<p id="out"></p>
<script>
  const btn = document.querySelector("button");
  btn.addEventListener("click", () => {
    document.getElementById("out").textContent =
      "You chose " + btn.dataset.product + " for KSh " + btn.dataset.price;
  });
</script>
```

## Naming tips

- Use meaningful names: `class="price-tag"`, not `class="red-text"` (the colour may change later).
- Use lowercase words joined with hyphens: `main-menu`, `hero-title`.
- IDs cannot start with a number and should not contain spaces.

## Why attributes matter

Attributes give elements extra information: where a link goes, what an image shows, which CSS styles apply, what JavaScript should do, and how assistive technology should describe a control. Most of what makes a page work (links, images, forms, styling hooks, accessibility) depends on attributes, so writing them correctly is a core skill.

## Boolean attributes

Some attributes are either present or absent; their value doesn't matter:

```try-html
<input type="text" placeholder="Disabled field" disabled>
<input type="checkbox" checked> Subscribe to newsletter
<input type="text" placeholder="Read only" value="Order #1024" readonly>
<details open><summary>Open by default</summary><p>Visible content</p></details>
<video controls muted width="200"></video>
```

Writing `disabled="false"` still disables the field, because the attribute is present. To enable it, remove the attribute entirely (in JavaScript: `input.disabled = false`).

## Accessibility attributes (ARIA basics)

ARIA attributes describe controls for screen readers when HTML alone can't:

```try-html
<button aria-label="Close menu">✕</button>
<button aria-expanded="false" aria-controls="menu">Menu</button>
<nav id="menu" hidden>...</nav>
<input id="phone" aria-describedby="phone-help">
<small id="phone-help">We'll send the M-Pesa prompt to this number.</small>
<div role="alert">Payment failed. Please try again.</div>
<span aria-hidden="true">★★★★☆</span><span class="sr-only">Rated 4 out of 5</span>
```

| Attribute | Purpose |
|---|---|
| `aria-label` | Gives a name to a control with no visible text (icon buttons) |
| `aria-describedby` | Links extra help text to a field |
| `aria-expanded` | Says whether a menu or section is open |
| `aria-hidden="true"` | Hides decorative content from screen readers |
| `role` | Describes what an element is (`alert`, `dialog`, `tablist`) |

The first rule of ARIA: **use a native element if one exists**. A real `<button>` is better than `<div role="button">`, because it already works with the keyboard.

## id for links and labels

IDs connect things on a page:

```try-html
<nav>
  <a href="#services">Services</a> · <a href="#pricing">Pricing</a> · <a href="#contact">Contact</a>
</nav>
<h2 id="services">Services</h2><p>Web design, hosting, SEO.</p>
<h2 id="pricing">Pricing</h2><p>From KSh 15,000.</p>
<h2 id="contact">Contact</h2>
<label for="email">Email</label> <input id="email" type="email">
```

`for="email"` on the label matches `id="email"` on the input, so clicking the label focuses the field and screen readers read the label. Links to `#pricing` jump to that section, and you can share `page.html#pricing` to send someone straight there.

## Combining classes: a component approach

```try-html
<style>
  .btn { display: inline-block; padding: 10px 16px; border-radius: 8px; font: 600 14px system-ui; text-decoration: none; margin: 4px; }
  .btn-primary { background: #0b1b35; color: #fff; }
  .btn-outline { border: 2px solid #0b1b35; color: #0b1b35; }
  .btn-small { padding: 6px 10px; font-size: 12px; }
  .is-disabled { opacity: .5; pointer-events: none; }
</style>
<a class="btn btn-primary" href="#">Get a quote</a>
<a class="btn btn-outline" href="#">View work</a>
<a class="btn btn-primary btn-small" href="#">Small</a>
<a class="btn btn-primary is-disabled" href="#" aria-disabled="true">Disabled</a>
```

One base class (`btn`) plus modifier classes (`btn-primary`, `btn-small`) and state classes (`is-disabled`) is how frameworks like Bootstrap work.

## data-* attributes with JavaScript

```try-html
<style>
  .product { border: 1px solid #e2e8f0; padding: 8px; margin: 6px 0; border-radius: 8px; font: 14px system-ui; }
  .product[data-stock="0"] { opacity: .5; }
  .product[data-stock="0"]::after { content: " (sold out)"; color: #dc2626; }
</style>
<div class="product" data-id="101" data-price="180" data-stock="12">Unga 2kg <button>Add</button></div>
<div class="product" data-id="102" data-price="210" data-stock="0">Sugar 1kg <button disabled>Add</button></div>
<p id="cart">Cart: KSh 0</p>
<script>
  let total = 0;
  document.querySelectorAll(".product button").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product");
      total += Number(card.dataset.price);              // data-price -> dataset.price
      document.getElementById("cart").textContent = `Cart: KSh ${total} (last added #${card.dataset.id})`;
    });
  });
</script>
```

CSS can select by data attributes (`[data-stock="0"]`), and JavaScript reads them with `element.dataset`. A name like `data-product-id` becomes `dataset.productId`.

## Other useful attributes

| Attribute | Example | Effect |
|---|---|---|
| `title` | `<abbr title="Kenya Revenue Authority">` | Tooltip on hover (not reliable on phones; don't put essential info here) |
| `lang` | `<p lang="sw">` | Language for pronunciation, translation, spell-check |
| `dir` | `dir="rtl"` | Right-to-left text |
| `tabindex` | `tabindex="0"` | Makes a custom element keyboard-focusable (avoid positive numbers) |
| `contenteditable` | `<div contenteditable>` | User can edit the text |
| `translate="no"` | Brand names | Stops automatic translation |
| `inert` | `<main inert>` | Disables interaction behind a modal |
| `spellcheck="false"` | Code fields | Turns off red underlines |

## Attribute selectors in CSS

```css
a[href^="https://"] { }          /* starts with: external links */
a[href$=".pdf"]::after { content: " (PDF)"; }   /* ends with */
a[href*="whatsapp"] { color: #16a34a; }          /* contains */
input[type="email"] { }
[lang="sw"] { font-style: italic; }
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Same id used twice | Make IDs unique; use classes for repeated items |
| `class="btn" class="primary"` (two class attributes) | `class="btn primary"` |
| Spaces in IDs (`id="contact form"`) | `id="contact-form"` |
| Unquoted values with spaces | Always quote attribute values |
| Using `title` instead of a visible label | Use `<label>` or `aria-label` |
| `<div onclick>` instead of a button | Use `<button>` |

## Practice

1. Build a one-page site with a nav that jumps to three sections using IDs.
2. Create a button system with one base class and three modifiers.
3. Make product cards with `data-price` and a script that totals the cart.
4. Make an icon-only "search" button accessible with `aria-label`.
5. Style all PDF links with a "(PDF)" label using an attribute selector.

:::think A developer writes `<div class="button" onclick="pay()">Pay</div>`. What accessibility problems does this create, and what's the fix?
A div is not focusable with the Tab key, doesn't respond to Enter or Space, and isn't announced as a button by screen readers, so keyboard and screen reader users can't pay. Use `<button type="button" onclick="pay()">Pay</button>` (or add the listener in JavaScript), which provides all of this behaviour automatically.
:::

```quiz
Q: Where do attributes go: the opening tag or the closing tag?
A: opening tag | opening | the opening tag
Q: Which attribute must be unique on the page?
A: id
Q: In CSS, is `.price` a class selector or an id selector?
A: class | class selector
Q: What prefix do you use for your own custom attributes?
A: data- | data
Q: Can one element have more than one class? (yes or no)
A: yes
Q: Which attribute gives an accessible name to an icon-only button?
A: aria-label
Q: In JavaScript, which property reads data-* attributes?
A: dataset | element.dataset
Q: Does disabled="false" enable a field? (yes or no)
A: no
Q: Which label attribute connects it to an input's id?
A: for
```
=== exercise ===
Make a `<div>` with **two classes**, `card` and `featured`, that contains a heading `<h3>` with the text **Premium**.
=== starter ===
<div>
  
</div>
=== must_contain ===
class="card featured"
<h3>
Premium
