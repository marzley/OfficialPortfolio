---
slug: block-inline-divs
title: Block vs inline elements, div and span
after: lists-tables
---
# Block vs inline elements, div and span

Every HTML element is displayed in one of two basic ways. Understanding this explains most "why is my layout doing that?" questions.

## Block elements

A **block** element starts on a new line and stretches the full width available.

Examples: `<h1>`–`<h6>`, `<p>`, `<div>`, `<ul>`, `<ol>`, `<li>`, `<table>`, `<form>`, `<header>`, `<section>`, `<footer>`.

## Inline elements

An **inline** element sits inside a line of text and is only as wide as its content.

Examples: `<a>`, `<strong>`, `<em>`, `<span>`, `<img>`, `<code>`, `<label>`, `<input>`, `<button>`.

```try-html
<style>
  p, div { background: #e0f2fe; margin: 6px 0; }
  span, a, strong { background: #fde68a; }
</style>
<p>This paragraph is a block.</p>
<div>This div is a block too.</div>
<p>Inline elements like <strong>strong</strong>, <a href="#">links</a> and <span>spans</span> stay in the line.</p>
```

The blue boxes stretch across; the yellow ones only wrap their words.

## div: a box for grouping

`<div>` has **no meaning** of its own. It is a plain block container used to group things so you can style or position them together.

## span: a hook inside text

`<span>` is the inline version: no meaning, just a way to target part of a sentence.

```try-html
<style>
  .product { border: 1px solid #ddd; border-radius: 8px; padding: 10px; width: 220px; }
  .ksh { color: #15803d; font-weight: bold; }
</style>
<div class="product">
  <h3>Unga 2kg</h3>
  <p>Price: <span class="ksh">KSh 180</span></p>
</div>
```

## Nesting rules

- Block elements can contain inline elements and (usually) other blocks.
- Inline elements should contain only text and other inline elements. Don't put a `<div>` inside a `<span>`.
- `<p>` cannot contain other blocks like `<div>` or `<ul>`. The browser will close the paragraph early.

## Prefer meaningful elements

Before reaching for `<div>`, ask if a meaningful element fits better:

| Instead of | Use |
|---|---|
| `<div class="header">` | `<header>` |
| `<div class="nav">` | `<nav>` |
| `<div class="article">` | `<article>` |
| `<div class="footer">` | `<footer>` |

You'll learn these in the *Semantic HTML* lesson. Use `<div>` when nothing else fits, for example a wrapper for layout.

## CSS can change the display

Later, in CSS, you can switch any element's behaviour with `display: block`, `display: inline`, `display: inline-block`, `display: flex` or `display: grid`. HTML decides the meaning; CSS decides the look.

```quiz
Q: Does a block element start on a new line? (yes or no)
A: yes
Q: Which element is a meaningless inline container for part of a text?
A: span
Q: Which element is a meaningless block container used for grouping?
A: div
Q: Is <a> a block or inline element?
A: inline
Q: Should you put a div inside a p? (yes or no)
A: no
```
=== exercise ===
Make a `<div>` with the class **product** containing a paragraph where the price **KSh 180** is wrapped in a `<span>`.
=== starter ===
<div class="product">
  <p>Price: </p>
</div>
=== must_contain ===
class="product"
<span
KSh 180
