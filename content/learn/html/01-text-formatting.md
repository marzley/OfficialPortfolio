---
slug: text-formatting
title: Text formatting, quotes and special characters
after: headings-paragraphs
---
# Text formatting, quotes and special characters

Headings and paragraphs give a page its shape. Inside that text you often need to **stress** a word, show a price change, quote someone or print a symbol like `©` or `<`. HTML has a small set of elements for this, and each one has a *meaning*, not just a look.

## Strong and emphasis

| Element | Meaning | Looks like (by default) |
|---|---|---|
| `<strong>` | Very important text | **bold** |
| `<em>` | Stress, the way you would say it louder | *italic* |
| `<b>` | Draw attention, no extra importance (product names, keywords) | **bold** |
| `<i>` | A different voice: foreign words, technical terms, thoughts | *italic* |
| `<mark>` | Highlighted, like a highlighter pen | yellow background |
| `<small>` | Side comments, fine print | smaller text |

Screen readers can change their voice for `<strong>` and `<em>`, so use them when the meaning matters. If you only want a look (bold headings in a card, for example), use CSS instead.

```try-html
<p><strong>Warning:</strong> the office closes at 5 pm on Fridays.</p>
<p>I <em>really</em> need the report today.</p>
<p>We sell <b>Marzley Duka</b>, a shop system for small businesses.</p>
<p>The word <i lang="sw">karibu</i> means "welcome".</p>
<p>Search results: learn <mark>HTML</mark> in Kenya.</p>
<p><small>Prices include 16% VAT.</small></p>
```

## Changes, subscripts and superscripts

```try-html
<p>Price: <del>KSh 2,500</del> <ins>KSh 1,999</ins></p>
<p>Water is H<sub>2</sub>O.</p>
<p>The area is 25 m<sup>2</sup>. This is the 1<sup>st</sup> edition.</p>
```

- `<del>` shows text that was removed (crossed out), `<ins>` shows text that was added (underlined).
- `<sub>` sits below the line, `<sup>` sits above it.

## Quotes, citations and code

```try-html
<blockquote cite="https://en.wikipedia.org/wiki/Wangari_Maathai">
  <p>It's the little things citizens do. That's what will make the difference.</p>
</blockquote>
<p>— <cite>Wangari Maathai</cite></p>

<p>As the saying goes, <q>haraka haraka haina baraka</q>.</p>

<p>Use the <code>print()</code> function to show text in Python.</p>
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>

<pre>
Name      Marks
Amina     78
Otieno    84
</pre>
```

- `<blockquote>` is a long quote on its own; browsers indent it.
- `<q>` is a short quote inside a sentence; the browser adds the quote marks.
- `<cite>` is the title of a work or the name of the source.
- `<code>` is a piece of computer code, `<kbd>` is a key the user presses.
- `<pre>` keeps spaces and line breaks exactly as you typed them.

## Line breaks and horizontal rules

`<br>` starts a new line inside the same paragraph. It is perfect for addresses and poems, but **not** for making space between paragraphs (use CSS margins for that).

`<hr>` is a thematic break: a change of topic. Browsers draw it as a line.

```try-html
<p>Marzley Tech Solutions<br>P.O. Box 123<br>Nairobi, Kenya</p>
<hr>
<p>A new topic starts here.</p>
```

## Special characters (entities)

Some characters mean something to HTML itself. To show `<` on the page you write an **entity**: an `&`, a name and a `;`.

| You want | Write |
|---|---|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| © | `&copy;` |
| ™ | `&trade;` |
| a space that never breaks | `&nbsp;` |
| € | `&euro;` |

```try-html
<p>In HTML, a paragraph starts with &lt;p&gt; and ends with &lt;/p&gt;.</p>
<p>Tom &amp; Jerry</p>
<p>&copy; 2026 Marzley Tech Solutions</p>
<p>KSh&nbsp;15,000 (the number never wraps away from "KSh")</p>
```

> Tip: with `<meta charset="utf-8">` in your page you can type most symbols directly (©, €, ✓, emoji). You only *must* use entities for `<`, `>` and `&`.

## Common mistakes

- Using `<br><br>` to make space. Use separate paragraphs and CSS margins.
- Using `<b>` for everything. Ask: is this *important* (`<strong>`) or just styled (CSS)?
- Forgetting to close tags: `<strong>Hello` makes the rest of the page bold.
- Nesting in the wrong order: `<strong><em>Hi</strong></em>` is wrong; close the last one you opened first: `<strong><em>Hi</em></strong>`.

```quiz
Q: Which element marks text as very important? Type the tag name without < >.
A: strong
Q: Which element shows a short quote inside a sentence and adds quote marks for you?
A: q
Q: What entity do you write to show the < character?
A: &lt;
Q: Which element keeps spaces and line breaks exactly as typed?
A: pre
Q: Which element shows text that was removed, like an old price?
A: del
H: Its opposite is `ins`.
```
=== exercise ===
Write a paragraph that says **Old price: KSh 3,000 New price: KSh 2,500** where the old price is inside `<del>` and the new price is inside `<strong>`.
=== starter ===
<p>Old price:  New price: </p>
=== must_contain ===
<del>
<strong>
2,500
