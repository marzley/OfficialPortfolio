---
slug: headings-paragraphs
title: "Headings, paragraphs and text structure: the outline of every page"
after: KEEP
---
# Headings, paragraphs and text structure: the outline of every page

Open any good website and, before reading a single sentence, you can see its **outline**: a big main title, section titles, smaller sub-titles and blocks of text. That outline is built with **headings** and **paragraphs**, the two most used elements in HTML. This unit explains them completely: what they are, why they matter for readers, Google and blind users, and how to use them like a professional.

:::note What you will learn
- The six heading levels (`<h1>` to `<h6>`) and what each is for
- Why heading order matters for SEO and accessibility
- Paragraphs, line breaks and horizontal rules
- Formatting words inside text (bold, italic, highlight, small print, subscript and superscript)
- How to plan the heading outline of a real page
- The mistakes beginners make and how to avoid them
:::

## What are headings?

**Headings** are titles for the page and its sections. HTML has **six levels**:

```try-html
<h1>Heading level 1: the page's main title</h1>
<h2>Heading level 2: a main section</h2>
<h3>Heading level 3: a sub-section of an h2</h3>
<h4>Heading level 4: a sub-section of an h3</h4>
<h5>Heading level 5: rarely needed</h5>
<h6>Heading level 6: very rarely needed</h6>
```

Browsers show lower numbers bigger and bolder by default. But the **size isn't the point**: the number tells the browser how **important** the heading is and where it sits in the outline. Size is changed with CSS.

:::define Heading
An element (`<h1>`–`<h6>`) that gives a title to the page or to the section that follows it. The number is its **level** in the page outline: 1 is the top level.
:::

## Why headings matter so much

### 1. Readers scan, they don't read

Research on how people read online consistently shows that most visitors **scan** a page first, jumping between headings to find what they need. Good headings let a customer find "Prices" or "Location" in two seconds. Without headings, a page is a wall of text and people leave.

### 2. Google uses headings to understand your page

Search engines read your headings to learn what each section is about. A plumber's page with `<h1>Plumber in Thika: Repairs and Installations</h1>` and sections like `<h2>Our services</h2>` and `<h2>Areas we cover</h2>` tells Google clearly what the business offers and where.

### 3. Screen reader users navigate by headings

Blind users can press a key (often `H`) to jump from heading to heading, or open a list of all headings, like a table of contents. Surveys of screen reader users (such as WebAIM's) show that navigating by headings is the most common way they find information. If your "headings" are just bold paragraphs, they can't do this.

### 4. It keeps your own work organised

A clear outline makes pages easier to write, design and update later.

## The rules of using headings

1. **One `<h1>` per page**, describing what the whole page is about. It's usually the page's main title.
2. **Don't skip levels going down.** After an `<h2>`, the next sub-level is `<h3>`, not `<h4>`. You may jump back up (from `<h4>` to `<h2>`) when a new main section starts.
3. **Choose the level by meaning, not by size.** Want a small-looking heading? Use the correct level and make it smaller with CSS.
4. **Never use headings just to make text big or bold.** Use CSS for size, or `<strong>` for important words.
5. **Keep headings short and descriptive.** "Opening hours" beats "Information".

### Planning an outline

Before writing HTML, plan the outline like a table of contents. Here's one for a restaurant website's home page:

```
h1  Mama Oliech Kitchen: Kenyan food in Kilimani
  h2  Today's specials
  h2  Our menu
    h3  Breakfast
    h3  Lunch
    h3  Drinks
  h2  Order on WhatsApp or call
  h2  Find us
    h3  Opening hours
    h3  Map and directions
```

And in HTML:

```try-html
<h1>Mama Oliech Kitchen: Kenyan food in Kilimani</h1>

<h2>Today's specials</h2>
<p>Fish with ugali and sukuma wiki, KSh 650.</p>

<h2>Our menu</h2>
<h3>Breakfast</h3>
<p>Chai, mandazi, eggs and sausages.</p>
<h3>Lunch</h3>
<p>Pilau, beef stew, chapati and beans.</p>
<h3>Drinks</h3>
<p>Fresh juice, tea and soda.</p>

<h2>Order on WhatsApp or call</h2>
<p>0712 345 678</p>

<h2>Find us</h2>
<h3>Opening hours</h3>
<p>Monday to Saturday, 7am to 9pm.</p>
<h3>Map and directions</h3>
<p>Next to the Total petrol station on Argwings Kodhek Road.</p>
```

:::think A designer wants the "Opening hours" heading to look tiny and grey. Should you change it from <h3> to <h6>?
No. "Opening hours" is a sub-section of "Find us", so its correct level is `<h3>`. Keep `<h3>` and use CSS (for example `font-size` and `color`) to make it look tiny and grey. Changing the level would break the outline for Google and screen readers.
:::

## Paragraphs

The **paragraph** element `<p>` holds a block of text. Browsers add space above and below each paragraph automatically.

```try-html
<p>Marzley Tech builds websites, apps and systems for businesses across Kenya.</p>
<p>We also train students in coding and ICT skills, online and in class.</p>
```

### Paragraph rules

- One idea per paragraph. Short paragraphs (2–4 sentences) are easier to read on phones.
- Don't use empty paragraphs (`<p></p>`) to create space. Use CSS margins.
- A paragraph **cannot** contain block elements like headings, lists or other paragraphs. The browser will close the paragraph early if you try.

### Whitespace collapses

The browser ignores extra spaces and line breaks in your code:

```try-html
<p>This     text     has
many    spaces   and
line breaks in the code,  but  shows   normally.</p>
```

This is good: you can format your code neatly. When you really need a line break inside text, use `<br>`.

## Line breaks: `<br>`

`<br>` forces a new line **inside** a block of text. It's a void element (no closing tag). Use it where line breaks are part of the content: addresses, poems, song lyrics.

```try-html
<p>
  Marzley Tech Solutions<br>
  Moi Avenue, Nairobi<br>
  P.O. Box 12345-00100
</p>

<p>
  Twinkle twinkle little star,<br>
  How I wonder what you are.
</p>
```

:::warning Don't use <br> for spacing
`<br><br><br>` to push content down is a common beginner habit. It makes pages hard to maintain and behaves differently on phones. Use separate paragraphs or CSS `margin` instead.
:::

## Horizontal rule: `<hr>`

`<hr>` marks a **thematic break**: a change of topic within a section, like a scene change in a story. Browsers draw it as a line.

```try-html
<p>That's everything about our web design packages.</p>
<hr>
<p>Now let's talk about hosting and domains.</p>
```

## Formatting words inside text

HTML has elements that give **meaning** to words inside a paragraph:

| Element | Meaning | Default look |
|---|---|---|
| `<strong>` | Strong importance, seriousness or urgency | Bold |
| `<em>` | Emphasis that changes the meaning of a sentence (stress) | Italic |
| `<b>` | Draws attention without extra importance (keywords, product names) | Bold |
| `<i>` | Different voice: foreign words, technical terms, thoughts | Italic |
| `<mark>` | Highlighted / relevant text (e.g. search matches) | Yellow background |
| `<small>` | Side comments and small print (terms, copyright) | Smaller text |
| `<sub>` | Subscript | Lowered small text |
| `<sup>` | Superscript | Raised small text |
| `<del>` / `<ins>` | Deleted / inserted text | Strikethrough / underline |

```try-html
<p><strong>Warning:</strong> never share your M-Pesa PIN with anyone.</p>
<p>I <em>said</em> the meeting is on Monday, not Tuesday.</p>
<p>Our <b>Starter Website</b> package includes five pages.</p>
<p>The word <i lang="sw">harambee</i> means "all pull together".</p>
<p>Search results for <mark>laptop</mark> in Nairobi.</p>
<p><small>Prices include 16% VAT. Terms apply.</small></p>
<p>Water is H<sub>2</sub>O and 10<sup>3</sup> = 1,000.</p>
<p>Price: <del>KSh 25,000</del> <ins>KSh 19,999</ins></p>
```

### `<strong>` vs `<b>`, `<em>` vs `<i>`

They look the same but **mean** different things. Screen readers may change their voice for `<strong>` and `<em>`, and Google treats `<strong>` text as important.

- Use `<strong>` when the words are **important**: warnings, key facts.
- Use `<em>` when you would **stress** the word when speaking.
- Use `<b>` and `<i>` for style conventions without extra importance.

:::think Which is correct for "Do NOT unplug the computer while it updates": <b> or <strong>?
`<strong>`. It's a serious warning, so it has strong importance. `<b>` would only make it look bold without telling browsers and screen readers that it's important.
:::

## Quotes and preformatted text (preview)

You'll study these in depth in the text formatting unit:

```try-html
<blockquote>
  <p>Education is the most powerful weapon which you can use to change the world.</p>
</blockquote>
<p>Nelson Mandela said <q>it always seems impossible until it's done</q>.</p>
<pre>
Name      Price
Unga      KSh 180
Sugar     KSh 150
</pre>
```

`<pre>` (preformatted) is the one element that **keeps** your spaces and line breaks exactly.

## Writing good content for the web

HTML structure only helps if the words are good:

- **Front-load headings:** put the key word first ("Prices for websites", not "Here you can find our prices").
- **Use plain language.** Many visitors read in a second language; short sentences help everyone.
- **One topic per section**, introduced by a heading.
- **Put important information first**: phone number, price, location.
- **Use lists** for steps and features (next units).

## Common mistakes

| Mistake | Why it's wrong | Fix |
|---|---|---|
| Several `<h1>`s for styling | Confuses the page's main topic | One `<h1>`; style others with CSS |
| `<h4>` straight after `<h2>` | Skipped levels break the outline | Use `<h3>` |
| `<p><strong>Services</strong></p>` as a section title | Looks like a heading but isn't one | `<h2>Services</h2>` |
| `<br><br>` for spacing | Hard to maintain, unpredictable | Paragraphs and CSS margins |
| Headings inside paragraphs | Invalid; the browser breaks the paragraph | Close the `<p>` first |
| Empty headings | Screen readers announce "heading" with nothing | Remove them |

## Practice tasks

1. Plan an outline (just headings) for a school website home page: news, admissions, academics (with sub-sections), contacts.
2. Turn your outline into HTML with a short paragraph under each heading.
3. Add a warning paragraph using `<strong>` and a price change using `<del>` and `<ins>`.
4. Write your favourite chemical formula or maths power using `<sub>` or `<sup>`.
5. View the source of a news website and find its `<h1>`. Does it have only one?

## Summary

- Headings `<h1>`–`<h6>` create the page outline; the number is the level of importance, not the size.
- Use **one `<h1>`**, don't skip levels going down, and choose levels by meaning.
- Headings help readers scan, help Google understand the page, and let screen reader users navigate.
- `<p>` holds paragraphs; whitespace collapses; `<br>` is for line breaks within content; `<hr>` is a thematic break.
- `<strong>`, `<em>`, `<b>`, `<i>`, `<mark>`, `<small>`, `<sub>`, `<sup>`, `<del>` and `<ins>` give meaning to words.

```quiz
Q: How many heading levels does HTML have?
A: 6 | six
Q: How many <h1> elements should a page normally have?
A: 1 | one
Q: After an <h2>, which heading level should a sub-section use?
A: h3 | <h3>
Q: Which element forces a line break inside a paragraph?
A: br | <br>
Q: Which element marks text as having strong importance?
A: strong | <strong>
Q: Which element keeps spaces and line breaks exactly as typed?
A: pre | <pre>
Q: Which element is used for small print like terms and copyright?
A: small | <small>
Q: To write the 2 in H2O lowered, which element do you use?
A: sub | <sub>
```
=== exercise ===
Write an `<h2>` that says **Our services** followed by a paragraph that contains the word **websites** in bold (use `<strong>`).
=== starter ===
<h1>Marzley Tech</h1>
=== expected ===

=== must_contain ===
<h2>
Our services
<strong>websites</strong>
