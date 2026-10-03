---
slug: pseudo-classes-elements
title: Pseudo-classes and pseudo-elements (:hover, ::before)
after: display-overflow
---
# Pseudo-classes and pseudo-elements

A **pseudo-class** styles an element in a certain **state** (hovered, focused, the first one...). A **pseudo-element** styles a **part** of an element, or adds decorative content. Pseudo-classes use one colon `:`, pseudo-elements use two `::`.

## Interaction states

```try-html
<style>
  body { font-family: system-ui, sans-serif; }
  .btn { display: inline-block; padding: 10px 18px; border-radius: 10px; background: #0b1b35; color: #fff; text-decoration: none; transition: background .2s, transform .2s; }
  .btn:hover { background: #1e3a8a; transform: translateY(-2px); }
  .btn:active { transform: translateY(1px); }
  .btn:focus-visible { outline: 3px solid #ffb800; outline-offset: 3px; }
  input { padding: 8px; border: 2px solid #cbd5e1; border-radius: 8px; }
  input:focus { border-color: #2563eb; outline: none; }
  a.link:visited { color: purple; }
  button:disabled { opacity: .5; cursor: not-allowed; }
</style>
<p><a class="btn" href="#">Hover, click and Tab to me</a></p>
<p><input placeholder="Click into me"></p>
<p><button disabled>Disabled button</button></p>
```

| Pseudo-class | When it applies |
|---|---|
| `:hover` | Mouse is over it |
| `:active` | Being clicked/pressed |
| `:focus` | Selected (clicked into, or reached with Tab) |
| `:focus-visible` | Focused **by keyboard**: show a clear outline for accessibility |
| `:visited` | A link already visited |
| `:disabled` / `:checked` | Form states |

> Tip: never remove focus outlines without replacing them. Keyboard users need to see where they are. `:focus-visible` lets you show them only for keyboard users.

## Position among siblings

```try-html
<style>
  li { padding: 6px; font-family: sans-serif; }
  li:first-child { font-weight: bold; }
  li:last-child { color: #b91c1c; }
  li:nth-child(even) { background: #f1f5f9; }
  li:not(:last-child) { border-bottom: 1px solid #e2e8f0; }
</style>
<ul>
  <li>Nairobi (first)</li><li>Mombasa</li><li>Kisumu</li><li>Nakuru</li><li>Eldoret (last)</li>
</ul>
```

- `:nth-child(2)` the 2nd; `:nth-child(odd)` / `(even)`; `:nth-child(3n)` every 3rd.
- `:not(...)` everything except.

## Form validation states

```css
input:invalid { border-color: #dc2626; }
input:valid { border-color: #16a34a; }
input:required { background: #fffbeb; }
```

## Pseudo-elements: ::before and ::after

They insert decorative content before or after an element's content. They need a `content` property (even an empty one).

```try-html
<style>
  body { font-family: system-ui, sans-serif; }
  .req::after { content: " *"; color: #dc2626; }
  .price::before { content: "KSh "; color: #64748b; }
  .check li { list-style: none; }
  .check li::before { content: "✓ "; color: #16a34a; font-weight: bold; }
  h2.line::after { content: ""; display: block; width: 60px; height: 4px; background: #ffb800; border-radius: 4px; margin-top: 6px; }
  p::first-letter { font-size: 2em; font-weight: 800; color: #0b1b35; }
  ::selection { background: #ffb800; color: #0b1b35; }
</style>
<label class="req">Phone number</label>
<p class="price">2,500</p>
<ul class="check"><li>Free delivery</li><li>Pay on delivery</li></ul>
<h2 class="line">Our services</h2>
<p>Once upon a time in Nyeri, a young developer built her first website. (Select this text too.)</p>
```

| Pseudo-element | Styles |
|---|---|
| `::before` / `::after` | Added content before/after |
| `::first-letter` | The first letter (drop caps) |
| `::first-line` | The first line |
| `::placeholder` | Placeholder text in inputs |
| `::selection` | Text the user highlights |

> Content added with `::before` is decoration. Screen readers may not read it, so never put important information there.

## Why pseudo-classes and pseudo-elements matter

They let CSS react to **state** (hovered, focused, checked, invalid, first, last) and add decorative pieces (icons, quotes, badges) without extra HTML or JavaScript. That keeps HTML clean and makes interfaces feel responsive: buttons that respond to taps, form fields that turn red when wrong, striped tables that are easy to read, and keyboard focus that's visible for accessibility.

## Modern selectors: :is(), :where(), :not() and :has()

```try-html
<style>
  body { font: 14px system-ui; }
  :is(h2, h3):hover { color: #1d4ed8; }                      /* shorter than h2:hover, h3:hover */
  li:not(:last-child) { border-bottom: 1px solid #e2e8f0; }   /* dividers between items only */
  li { padding: 6px 0; list-style: none; }
  .card:has(img) { display: grid; grid-template-columns: 80px 1fr; gap: 10px; }
  .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; margin: 8px 0; }
  .card img { width: 80px; height: 60px; object-fit: cover; border-radius: 6px; }
  label:has(input:checked) { background: #dcfce7; border-color: #16a34a; }
  label { display: block; border: 2px solid #e2e8f0; border-radius: 8px; padding: 8px; margin: 6px 0; cursor: pointer; }
</style>
<h3>Hover this heading</h3>
<ul><li>Item one</li><li>Item two</li><li>Item three (no line below)</li></ul>
<div class="card"><img src="https://picsum.photos/160/120" alt=""><div>Card with an image becomes a two-column layout</div></div>
<div class="card"><div>Card without an image stays simple</div></div>
<label><input type="radio" name="plan"> Basic plan</label>
<label><input type="radio" name="plan"> Business plan</label>
```

`:has()` is often called the "parent selector": it styles an element based on what it contains, something that used to need JavaScript. `:where()` works like `:is()` but adds **zero specificity**, which is ideal for base styles that are easy to override.

## Styling forms by state

```try-html
<style>
  form { font: 14px system-ui; max-width: 300px; }
  input { display: block; width: 100%; padding: 8px; margin: 4px 0 12px; border: 2px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
  input:focus-visible { outline: 3px solid #93c5fd; border-color: #1d4ed8; }
  input:user-invalid { border-color: #dc2626; background: #fef2f2; }
  input:valid:not(:placeholder-shown) { border-color: #16a34a; }
  input:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
  input::placeholder { color: #94a3b8; font-style: italic; }
  input:required + small::before { content: "* "; color: #dc2626; }
</style>
<form>
  Email <input type="email" required placeholder="you@example.co.ke"><small>Required</small><br>
  Phone <input pattern="0[17][0-9]{8}" placeholder="0712345678"><br>
  Account <input value="Locked field" disabled>
</form>
```

`:user-invalid` only applies after the user has interacted with the field, so the form doesn't show red errors before they've even typed. `:placeholder-shown` lets you avoid styling empty fields as valid.

## Useful pseudo-elements

| Pseudo-element | Targets | Example use |
|---|---|---|
| `::before` / `::after` | Generated content before/after the element's content | Icons, quotes, badges, decorative lines |
| `::placeholder` | Input placeholder text | Lighter colour |
| `::selection` | Text the user highlights | Brand-coloured selection |
| `::marker` | List bullets and numbers | Coloured bullets |
| `::first-letter` | First letter of a block | Magazine-style drop caps |
| `::first-line` | First line of a block | Emphasised intro line |
| `::file-selector-button` | The button of a file input | Styled upload button |
| `::backdrop` | Background behind a `<dialog>` | Dimmed overlay |

```try-html
<style>
  body { font: 15px/1.6 system-ui; }
  ::selection { background: #fde68a; color: #0b1b35; }
  ul.ticks { list-style: none; padding: 0; }
  ul.ticks li::before { content: "✔"; color: #16a34a; font-weight: 700; margin-right: 8px; }
  ol li::marker { color: #1d4ed8; font-weight: 700; }
  .lead::first-letter { font-size: 2.6em; float: left; line-height: 1; margin-right: 6px; color: #b45309; font-family: Georgia, serif; }
  input[type=file]::file-selector-button { border: 0; background: #0b1b35; color: #fff; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
  .new { position: relative; display: inline-block; padding: 8px 14px; background: #f1f5f9; border-radius: 8px; }
  .new::after { content: "NEW"; position: absolute; top: -8px; right: -10px; background: #dc2626; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 999px; }
</style>
<ul class="ticks"><li>Free SSL certificate</li><li>Daily backups</li><li>Mobile-friendly design</li></ul>
<ol><li>Choose a plan</li><li>Pay with M-Pesa</li></ol>
<p class="lead">Once upon a time, a small shop in Nyeri started selling online and doubled its customers within a year.</p>
<input type="file"><br><br>
<span class="new">Online courses</span>
```

Select some text above to see the custom selection colour.

## Accessibility notes

- Content in `::before`/`::after` may be read by some screen readers and can't be selected or copied. Don't put important information there (like prices); use it for decoration.
- Always style `:focus-visible` clearly. Keyboard users and many people with motor disabilities rely on it.
- `:hover` doesn't exist on touch screens in the same way; never hide essential actions behind hover only.

## Common mistakes

| Mistake | Fix |
|---|---|
| `::before` shows nothing | Add `content: ""` |
| Hover styles stuck on phones after a tap | Wrap in `@media (hover: hover) { ... }` |
| `a:hover` before `a:visited` in the wrong order | Use the LVHA order: `:link`, `:visited`, `:hover`, `:active` |
| Error styles showing on page load | Use `:user-invalid` or add a class after submit |
| Removing focus outlines | Replace with a visible `:focus-visible` style |

## Practice

1. Make a pricing table where the row under the mouse is highlighted and every other row is striped.
2. Style a checklist with custom ✔ icons using `::before`.
3. Create selectable plan cards that highlight when their radio button is checked using `:has()`.
4. Add a "Popular" ribbon to one card with `::after`.

:::think Why use `@media (hover: hover)` around hover effects on a site visited mostly from phones?
Touch devices emulate hover on tap, so hover styles can get "stuck" after tapping until the user taps elsewhere, which looks like a bug. Limiting hover effects to devices that truly support hovering (mouse or trackpad) avoids this while keeping the effect on desktops.
:::

```quiz
Q: Which pseudo-class applies when the mouse is over an element?
A: :hover | hover
Q: Which pseudo-class shows focus only for keyboard users?
A: :focus-visible | focus-visible
Q: Which selector targets every even list item? Write it as li:...
A: li:nth-child(even) | li:nth-child(2n) | :nth-child(even)
Q: Which property is required for ::before to show anything?
A: content
Q: How many colons do pseudo-elements like ::after use?
A: 2 | two
Q: Which pseudo-class styles an element based on what it contains?
A: :has | has | :has()
Q: Which pseudo-class works like :is() but adds zero specificity?
A: :where | where | :where()
Q: Which pseudo-element styles the bullets or numbers of a list?
A: ::marker | marker
```
=== exercise ===
Make `.btn:hover` change the **background** to `#1e3a8a`.
=== starter ===
<style>
  .btn { background: #0b1b35; color: #fff; padding: 10px 16px; }
  
</style>
<button class="btn">Hover me</button>
=== must_contain ===
.btn:hover
background
#1e3a8a
