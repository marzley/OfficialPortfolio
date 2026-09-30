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
