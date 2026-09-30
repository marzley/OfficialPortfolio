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
