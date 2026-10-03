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

## Why the right text elements matter

HTML text elements are not about looks (CSS handles that); they describe **meaning**. Search engines use that meaning to understand what's important on the page, screen readers change their voice or announce elements like quotes and code, and translation tools treat code and abbreviations correctly. Bloggers, journalists, documentation writers, teachers making online notes and every web developer use these elements daily.

## Visual vs semantic elements

| Looks like | Semantic choice | Meaning | Avoid for meaning |
|---|---|---|---|
| Bold | `<strong>` | Important, serious, urgent | `<b>` (only stylistic: keywords, product names) |
| Italic | `<em>` | Stress that changes the meaning of a sentence | `<i>` (only for terms, foreign words, thoughts) |
| Highlighted | `<mark>` | Relevant to the current context (search hits) | `<span style="background:yellow">` |
| Small | `<small>` | Side comments, legal fine print | Using it just to shrink headings |
| Struck through | `<s>` / `<del>` | No longer accurate / removed from a document | |
| Underlined | `<u>` | Rarely: misspellings or annotations | Underlining for emphasis (looks like a link) |

```try-html
<p><strong>Warning:</strong> do not share your M-Pesa PIN with anyone.</p>
<p>I <em>said</em> deliver on Friday, not Thursday.</p>
<p>The Kiswahili word <i lang="sw">karibu</i> means welcome.</p>
<p>Search results for "hosting": affordable <mark>hosting</mark> plans for small businesses.</p>
<p><small>Prices include 16% VAT. Terms apply.</small></p>
```

Note `lang="sw"` on the Kiswahili word: screen readers can switch pronunciation for that word.

## Abbreviations, definitions and time

```try-html
<p>Register your business on <abbr title="Kenya Revenue Authority">KRA</abbr> iTax before you apply.</p>
<p><dfn>SEO</dfn> (search engine optimisation) is the practice of helping pages appear in search results.</p>
<p>The workshop starts on <time datetime="2026-11-14T09:00">14 November at 9 am</time>.</p>
<p>Opening hours: <time datetime="08:00">8:00</time> to <time datetime="18:00">6:00 pm</time>.</p>
```

`<time datetime="...">` gives machines (search engines, calendars) an exact date while people see a friendly version.

## Addresses and contact details

```try-html
<address>
  <strong>Marzley Tech Solutions</strong><br>
  Nairobi, Kenya<br>
  Phone: <a href="tel:+254700000000">+254 700 000 000</a><br>
  Email: <a href="mailto:info@example.co.ke">info@example.co.ke</a>
</address>
```

`<address>` is for contact information of the page or article author/owner, not for any postal address. `tel:` links let phone users tap to call (the numbers here are examples).

## Showing code and keyboard input

```try-html
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save, or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> to open DevTools.</p>
<p>The command <code>git status</code> shows changed files. Output: <samp>nothing to commit, working tree clean</samp></p>
<p>The area of a circle is <var>A</var> = π<var>r</var><sup>2</sup>.</p>
<pre><code>&lt;h1&gt;Hello Kenya&lt;/h1&gt;
&lt;p&gt;My first page&lt;/p&gt;</code></pre>
```

| Element | Meaning |
|---|---|
| `<code>` | A piece of computer code |
| `<kbd>` | Keys the user presses |
| `<samp>` | Output from a program |
| `<var>` | A variable in maths or programming |
| `<pre>` | Preformatted text: spaces and line breaks are kept |

Inside `<pre>`, you still must write `&lt;` for `<` when showing HTML code.

## Bidirectional text and word breaks

```try-html
<p>Long words can break nicely here: super<wbr>cali<wbr>fragilistic<wbr>expialidocious<wbr>words.</p>
<p>Customer name in Arabic: <bdi>محمد</bdi>, paid 2,000.</p>
<p>Ruby annotation: <ruby>漢<rt>kan</rt>字<rt>ji</rt></ruby></p>
```

`<wbr>` suggests where a long word or URL may break on narrow screens. `<bdi>` keeps right-to-left names from scrambling the surrounding text order.

## Headings: structure, not size

Headings (`<h1>` to `<h6>`) form an outline of the page, like a table of contents:

```html
<h1>Web design services in Nakuru</h1>       <!-- one per page: the main topic -->
  <h2>Our packages</h2>
    <h3>Starter website</h3>
    <h3>Business website</h3>
  <h2>Frequently asked questions</h2>
    <h3>How long does it take?</h3>
```

- Use exactly one `<h1>` describing the page.
- Don't skip levels (h2 → h4) just to get a smaller font; change the size with CSS.
- Screen reader users jump between headings to scan a page, and search engines use headings to understand topics.

## Writing for the web

| Tip | Why |
|---|---|
| Short paragraphs (2 to 4 sentences) | Easier to read on phones |
| Descriptive headings every few paragraphs | People scan before they read |
| Lists for steps and features | Faster to understand than long sentences |
| Bold only key phrases | Too much bold means nothing stands out |
| Plain language | Reaches more people, including non-native speakers |

## Practice

1. Write a short article about your town with one `h1`, two `h2` sections and correct use of `strong`, `em` and `abbr`.
2. Mark up an event announcement with `<time datetime>` for the date and start time.
3. Create a "keyboard shortcuts" list for MS Word using `<kbd>`.
4. Show a three-line HTML snippet on a page using `<pre><code>` and entities.
5. Add a contact block with `<address>`, a `tel:` link and a `mailto:` link.

:::think Why should you not use `<h4>` for a sub-heading just because `<h3>` looks too big?
Heading levels describe the document outline. Skipping from h2 to h4 tells screen readers and search engines there's a missing level, which confuses navigation and structure. Use the correct level (h3) and change its appearance with CSS.
:::

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
Q: Which element gives a date a machine-readable value through its datetime attribute?
A: time | <time>
Q: Which element shows keys the user should press?
A: kbd | <kbd>
Q: Which element wraps the contact details of the page owner or author?
A: address | <address>
Q: How many h1 elements should a typical page have?
A: 1 | one
```
=== exercise ===
Write a paragraph that says **Old price: KSh 3,000 New price: KSh 2,500** where the old price is inside `<del>` and the new price is inside `<strong>`.
=== starter ===
<p>Old price:  New price: </p>
=== must_contain ===
<del>
<strong>
2,500
