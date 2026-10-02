---
slug: semantic
title: "Semantic HTML: header, nav, main, section, article, aside and footer"
after: KEEP
---
# Semantic HTML: header, nav, main, section, article, aside and footer

Two pages can look identical on screen but be completely different underneath. One is a pile of anonymous boxes (`<div>` after `<div>`); the other clearly says "this is the header, this is the navigation, this is the main content, this is an article, this is the footer". The second is **semantic HTML**, and it's what professional developers write. It helps Google, screen readers, other developers and future you.

:::note What you will learn
- What "semantic" means and why it matters for SEO, accessibility and teamwork
- The page landmark elements: `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`
- Content sections: `<section>` and `<article>`, and how to choose between them
- Other meaningful elements: `<figure>`, `<time>`, `<address>`, `<details>`
- When a plain `<div>` or `<span>` is still the right choice
- How to structure complete real-world pages
:::

## What does "semantic" mean?

**Semantic** means "relating to meaning". A semantic element describes **what its content is**, not how it looks.

| Non-semantic | Semantic |
|---|---|
| `<div class="top">` | `<header>` |
| `<div class="menu">` | `<nav>` |
| `<div class="content">` | `<main>` |
| `<div class="post">` | `<article>` |
| `<div class="bottom">` | `<footer>` |

:::define Semantic HTML
Using the HTML element whose meaning matches the content, for example `<nav>` for navigation links and `<article>` for a blog post, instead of generic `<div>`s with class names.
:::

Before HTML5 (2014), pages were built almost entirely from `<div>`s. HTML5 added these semantic elements based on the class names developers used most often ("header", "nav", "footer").

## Why semantic HTML matters

1. **Accessibility.** Screen readers turn semantic elements into **landmarks**. A blind user can press a key to jump straight to the navigation or the main content, instead of listening to the whole header on every page. `<main>` also makes "skip to content" links work well.
2. **SEO.** Search engines use structure to find the main content of a page and to understand articles, dates and navigation.
3. **Readable code.** Anyone opening your file instantly understands its structure; teams work faster and make fewer mistakes.
4. **Reader modes and other tools.** Browser reader views, translation tools, voice assistants and smart displays all work better with semantic markup.
5. **Free behaviour.** Some semantic elements come with built-in behaviour, like `<details>` (open/close) and `<button>` (keyboard support).

:::kenya
Government and large organisations increasingly require accessible websites. People with visual impairments in Kenya use screen readers like NVDA (free) and TalkBack on Android. Semantic HTML is one of the cheapest ways to make sure they can use your site.
:::

## The landmark elements

### `<header>`

Introductory content: usually the logo, site name and main navigation. A page has a site header, and articles or sections can have their own header too (e.g. an article's title and date).

### `<nav>`

A block of **major navigation links**: the main menu, breadcrumbs, a table of contents, pagination. Not every group of links needs `<nav>` (social icons in the footer usually don't).

### `<main>`

The **main, unique content** of the page: what makes this page different from others. Rules: **only one visible `<main>` per page**, and it shouldn't be inside `<header>`, `<nav>`, `<aside>` or `<footer>`.

### `<aside>`

Content **related but secondary** to the main content: a sidebar, related posts, an advert, a "Did you know?" box, a glossary.

### `<footer>`

Closing information: contacts, copyright, privacy policy links, social links, opening hours. Articles can have their own footer too (author, tags).

```try-html
<header>
  <p><strong>Kamau Hardware</strong> · Ruiru</p>
  <nav aria-label="Main">
    <a href="#products">Products</a> |
    <a href="#delivery">Delivery</a> |
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <h1>Building materials delivered in Ruiru and Juja</h1>
  <p>Cement, iron sheets, paint and plumbing supplies at fair prices.</p>
</main>

<aside>
  <h2>This week's offer</h2>
  <p>Bamburi cement 50kg: KSh 780 per bag for orders of 20+ bags.</p>
</aside>

<footer>
  <p>Kamau Hardware, Eastern Bypass, Ruiru · Open Mon–Sat 7am–7pm</p>
  <p><small>© 2026 Kamau Hardware</small></p>
</footer>
```

## `<section>` vs `<article>`

These two cause the most confusion.

### `<article>`: complete on its own

Use `<article>` for content that would **make sense by itself** if you copied it to another website or shared it: a blog post, a news story, a product card, a forum post, a comment, a review.

Test: *Could this be shared or syndicated on its own and still make sense?* If yes, it's an article.

### `<section>`: a themed part of something bigger

Use `<section>` for a **thematic group** of content with its own heading: "Our services", "Prices", "Testimonials", "Contact". A section usually **should have a heading**.

```try-html
<main>
  <h1>Marzley Tech blog</h1>

  <section>
    <h2>Latest posts</h2>

    <article>
      <h3>How much does a website cost in Kenya?</h3>
      <p>Prices depend on pages, features and who maintains the site…</p>
      <p><a href="#">Read more about website costs</a></p>
    </article>

    <article>
      <h3>5 ways to get more customers on Google</h3>
      <p>Start with a Google Business Profile and real reviews…</p>
      <p><a href="#">Read more about local SEO</a></p>
    </article>
  </section>

  <section>
    <h2>Popular topics</h2>
    <p>Web design, hosting, SEO, M-Pesa integration.</p>
  </section>
</main>
```

Sections can contain articles, and articles can contain sections (a long article split into parts).

:::think An online shop shows 12 product cards, each with a photo, name, price and "Add to cart" button. Should each card be a <section>, an <article> or a <div>?
`<article>` is a good fit: each product card is a self-contained item that makes sense on its own (it could appear in search results or be shared). The group of 12 cards would sit inside a `<section>` with a heading like "Featured products".
:::

## `<div>` and `<span>`: still useful

Semantic elements don't make `<div>` wrong. Use:

- `<div>` (block) when you need a container **only for styling or layout** and no semantic element fits (e.g. a wrapper for a grid of cards).
- `<span>` (inline) to style part of a text with no special meaning.

Rule: **choose the semantic element if one fits; otherwise use `<div>`/`<span>`.**

## More meaningful elements

### `<figure>` and `<figcaption>`

Self-contained media (images, charts, code, diagrams) with an optional caption:

```try-html
<figure>
  <img src="https://picsum.photos/320/180" alt="Map showing delivery zones in Nairobi" width="320" height="180">
  <figcaption>Our delivery zones: free delivery inside Zone A.</figcaption>
</figure>
```

### `<time>`

A date or time, with a machine-readable `datetime` attribute (format `YYYY-MM-DD`, optional time) so browsers, Google and calendars understand it:

```try-html
<p>Published <time datetime="2026-10-02">2 October 2026</time></p>
<p>The webinar starts at <time datetime="2026-10-10T14:00+03:00">2pm on 10 October</time>.</p>
```

### `<address>`

**Contact information** for the page or article's owner (not every address on the page):

```try-html
<footer>
  <address>
    Marzley Tech Solutions<br>
    Nairobi, Kenya<br>
    <a href="tel:+254745789590">0745 789 590</a> ·
    <a href="mailto:info@example.co.ke">info@example.co.ke</a>
  </address>
</footer>
```

### `<details>` and `<summary>`

A built-in open/close widget, perfect for FAQs, with no JavaScript:

```try-html
<h2>Frequently asked questions</h2>
<details>
  <summary>How long does a website take?</summary>
  <p>A simple business website usually takes 1–3 weeks, depending on how fast we receive your content.</p>
</details>
<details>
  <summary>Can I pay in instalments?</summary>
  <p>Yes: a deposit to start and the balance before launch.</p>
</details>
```

### `<mark>`, `<abbr>`, `<cite>`, `<code>`

```try-html
<p>The <abbr title="Kenya Revenue Authority">KRA</abbr> deadline is 30 June.</p>
<p>Type <code>ipconfig</code> to see your IP address.</p>
<p>My favourite book is <cite>The River Between</cite> by Ngũgĩ wa Thiong'o.</p>
```

## A complete semantic page layout

```
<body>
  <header>            logo + <nav> main menu
  <main>
    <h1>              page title
    <section>         e.g. services (with <article> cards)
    <section>         e.g. testimonials
    <section>         e.g. contact form
  </main>
  <aside>             optional sidebar
  <footer>            <address>, links, copyright
</body>
```

```try-html
<header>
  <a href="#"><strong>Achieng Tutors</strong></a>
  <nav aria-label="Main"><a href="#subjects">Subjects</a> · <a href="#fees">Fees</a> · <a href="#book">Book</a></nav>
</header>
<main>
  <h1>Home tuition in Kisumu for Grade 7–12</h1>
  <section id="subjects">
    <h2>Subjects we teach</h2>
    <article><h3>Mathematics</h3><p>CBC and 8-4-4 syllabus, exam practice.</p></article>
    <article><h3>Sciences</h3><p>Biology, Chemistry and Physics with practicals.</p></article>
  </section>
  <section id="fees">
    <h2>Fees</h2>
    <p>KSh 800 per hour; discounts for weekly bookings.</p>
  </section>
  <section id="book">
    <h2>Book a lesson</h2>
    <p><a href="https://wa.me/254700000000">Book on WhatsApp</a></p>
  </section>
</main>
<footer>
  <address>Milimani, Kisumu · <a href="tel:+254700000000">0700 000 000</a></address>
  <p><small>© 2026 Achieng Tutors</small></p>
</footer>
```

## Labelling repeated landmarks

If a page has two `<nav>`s (main menu and footer menu), label them so screen reader users can tell them apart: `<nav aria-label="Main">` and `<nav aria-label="Footer">`.

## Common mistakes

| Mistake | Fix |
|---|---|
| Everything in `<div>`s | Use landmarks and sections where they fit |
| Several `<main>` elements | Only one per page |
| `<section>` without a heading, used just for styling | Use `<div>` for pure styling wrappers |
| Using `<article>` for every box | Only for self-contained content |
| Every group of links in `<nav>` | Only major navigation blocks |
| `<address>` for every postal address | Only for the owner's contact info |
| Choosing elements for their default look | Choose by meaning; style with CSS |

## Practice tasks

1. Take a page you built earlier and replace generic `<div>`s with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` and `<footer>`.
2. Build a news home page with three `<article>` stories, each with `<time>`.
3. Add an FAQ with three `<details>` items.
4. Mark up your contact details in an `<address>` in the footer.
5. Use your browser's developer tools (Inspect) on a big website. Which semantic elements do you find?

## Summary

- Semantic HTML uses elements that describe their content's meaning.
- Landmarks: `<header>`, `<nav>`, `<main>` (one per page), `<aside>`, `<footer>`.
- `<article>` = self-contained content; `<section>` = a themed group with a heading.
- `<div>`/`<span>` are for styling when nothing semantic fits.
- Useful extras: `<figure>`/`<figcaption>`, `<time datetime>`, `<address>`, `<details>`/`<summary>`, `<abbr>`, `<code>`, `<cite>`.
- Benefits: accessibility (landmarks), SEO, readable code, and built-in behaviour.

```quiz
Q: Which element holds the main, unique content of a page?
A: main | <main>
Q: How many visible main elements should a page have?
A: 1 | one
Q: Which element is for self-contained content like a blog post?
A: article | <article>
Q: Which element groups major navigation links?
A: nav | <nav>
Q: Which element is for related but secondary content like a sidebar?
A: aside | <aside>
Q: Which element gives a date a machine-readable datetime attribute?
A: time | <time>
Q: Which element makes an open/close FAQ item without JavaScript (the outer element)?
A: details | <details>
Q: Which generic block element is used when no semantic element fits?
A: div | <div>
```
=== exercise ===
Wrap a heading **Welcome** in a `<header>`, and a paragraph in a `<footer>`.
=== starter ===

=== expected ===

=== must_contain ===
<header>
<footer>
Welcome
