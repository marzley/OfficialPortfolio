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

## Why block and inline matter

Every element has a default way of sitting on the page. Knowing which elements stack (block) and which flow inside text (inline) explains many beginner surprises: why `width` does nothing on a link, why two `div`s won't sit side by side, why a `span` doesn't push text below it, or why a validator complains about a `div` inside a `p`. It also helps you choose the right element, which matters for accessibility and SEO.

## The common elements by type

| Block (start on a new line, full width) | Inline (flow inside text) | Inline-block by default |
|---|---|---|
| `div`, `p`, `h1`–`h6`, `ul`, `ol`, `li` | `a`, `span`, `strong`, `em`, `code` | `button`, `input`, `select`, `textarea` |
| `section`, `article`, `header`, `footer`, `nav`, `main`, `aside` | `abbr`, `time`, `small`, `mark`, `sub`, `sup` | `img` (inline but has width/height) |
| `form`, `table`, `blockquote`, `pre`, `figure`, `hr` | `label`, `q`, `kbd`, `br` | |

## See the difference

```try-html
<style>
  body { font: 15px system-ui; }
  .demo div { background: #dbeafe; border: 1px solid #1d4ed8; margin: 4px 0; }
  .demo span { background: #fef3c7; border: 1px solid #b45309; }
  .w { width: 200px; height: 40px; padding: 10px; }
</style>
<div class="demo">
  <div>Block one</div>
  <div class="w">Block with width 200px and height 40px: works</div>
  <p>Some text with <span>an inline span</span> and <span class="w">a span with width (ignored)</span> continuing on the same line.</p>
</div>
```

Inline elements ignore `width` and `height`, and their vertical padding overlaps neighbouring lines instead of pushing them away.

## Inline elements and whitespace gaps

Inline and inline-block elements are separated by the spaces and line breaks in your HTML, which can create mysterious gaps:

```try-html
<style>
  .row span { display: inline-block; width: 30%; background: #1d4ed8; color: #fff; padding: 8px 0; text-align: center; font: 14px system-ui; }
  .flex { display: flex; gap: 8px; margin-top: 10px; }
  .flex span { flex: 1; background: #16a34a; color: #fff; padding: 8px; text-align: center; font: 14px system-ui; }
</style>
<div class="row">
  <span>One</span>
  <span>Two</span>
  <span>Three</span>
</div>
<div class="flex"><span>One</span><span>Two</span><span>Three</span></div>
```

The first row has small gaps from the whitespace in the HTML. Flexbox (second row) ignores that whitespace and uses an exact `gap`, which is why modern layouts use flex or grid instead of inline-block.

## Images are inline: the bottom gap bug

Images sit on the text baseline, leaving a small gap below them inside containers:

```css
img { display: block; max-width: 100%; height: auto; }   /* removes the gap, makes images responsive */
```

This line is in almost every CSS reset.

## Content models: what can go inside what

HTML has rules about nesting, called content models:

| Allowed | Not allowed |
|---|---|
| `<a>` around a whole card (block content) in HTML5 | `<a>` inside another `<a>` |
| `<p>` containing inline elements | `<p>` containing `div`, `ul`, `h2` or another `p` |
| `<li>` directly inside `<ul>` / `<ol>` | `<div>` directly inside `<ul>` |
| `<button>` containing text and icons | Links or other buttons inside a `<button>` |
| `<label>` wrapping an `<input>` | Two inputs inside one label |

When rules are broken, browsers try to "fix" the structure, often in surprising ways. For example, `<p><div>Hi</div></p>` becomes an empty paragraph, a div, and another empty paragraph, which can break your CSS.

## A clickable card (block link)

```try-html
<style>
  .card { display: block; max-width: 280px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-decoration: none; color: #0b1b35; font: 14px system-ui; }
  .card:hover, .card:focus-visible { border-color: #1d4ed8; box-shadow: 0 6px 16px rgba(0,0,0,.08); }
  .card h3 { margin: 0 0 6px; }
</style>
<a class="card" href="#hosting">
  <h3>Website hosting</h3>
  <p>Fast, secure hosting with daily backups and free SSL.</p>
  <span>Learn more →</span>
</a>
```

The whole card is one link, which is easy to tap on phones. Keep the content short, because screen readers read everything inside the link.

## Semantic alternatives to div and span

Before reaching for a `div`, ask whether a meaningful element fits:

| Instead of | Use when... |
|---|---|
| `<div class="header">` | `<header>`: introductory content or site header |
| `<div class="nav">` | `<nav>`: major navigation links |
| `<div class="main">` | `<main>`: the page's main content (once per page) |
| `<div class="post">` | `<article>`: a self-contained item (blog post, product, comment) |
| `<div class="sidebar">` | `<aside>`: related but secondary content |
| `<div class="footer">` | `<footer>`: closing info, contact, copyright |
| `<span class="date">` | `<time datetime="...">` |
| `<span class="bold">` | `<strong>` (if it's important) |
| `<div onclick>` | `<button>` |

Meaningful elements give screen reader users "landmarks" to jump between and help search engines understand page structure.

## Validating your HTML

Paste your code into the W3C Markup Validator (validator.w3.org) to find nesting errors, missing closing tags and duplicate IDs. Fixing these prevents strange layout bugs and accessibility problems.

## Practice

1. Build a page with header, nav, main (two articles), aside and footer instead of generic divs.
2. Make three inline-block boxes, observe the whitespace gaps, then rebuild with flexbox.
3. Write deliberately invalid HTML (a `div` in a `p`, an `li` outside a list), run it through the validator and fix every error.
4. Create a grid of clickable service cards using block links.

:::think Your CSS rule `.intro div { color: red; }` doesn't apply to a div you placed inside `<p class="intro">`. Why?
A `<p>` can't contain a `<div>`. The browser closes the paragraph automatically before the div, so the div is no longer inside `.intro` in the actual DOM. Use a `<div class="intro">` wrapper, or replace the inner div with an inline element like `<span>`.
:::

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
Q: Does width apply to an inline element like span by default? (yes or no)
A: no
Q: Which display value on images removes the small gap below them?
A: block | display: block
Q: Which free online tool checks HTML for nesting errors? (the W3C ...)
A: validator | W3C validator | markup validator
Q: Which element should replace <div class="nav">?
A: nav | <nav>
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
