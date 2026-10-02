---
slug: lists-tables
title: "Lists and tables: organising information clearly"
after: KEEP
---
# Lists and tables: organising information clearly

Much of the information people look for online is naturally a **list** (steps to pay, features of a package, ingredients) or a **table** (prices, timetables, results, comparisons). HTML has dedicated elements for both. Using them correctly makes your content easier to scan, easier for Google to understand (lists and tables often appear directly in search results) and fully usable by screen reader users.

:::note What you will learn
- The three kinds of lists: unordered, ordered and description lists
- Ordered list options: `start`, `reversed` and `type`
- Nested lists (lists inside lists) for menus and outlines
- What tables are for, and what they are **not** for
- Table parts: rows, header cells, data cells, caption, `thead`, `tbody`, `tfoot`
- Making tables accessible with `scope`
- Common mistakes with lists and tables
:::

## Part 1: Lists

### Why lists?

- **Scanning:** readers absorb a list of 5 short points far faster than the same information in a paragraph.
- **Order:** numbered steps make instructions easy to follow ("Step 3 of 5").
- **Accessibility:** screen readers announce "list, 5 items", so users know how much is coming and can skip it.
- **SEO:** Google often shows lists from pages as "featured snippets" (e.g. "How to register a business name in Kenya" steps).
- **Navigation menus** are lists of links under the hood.

### Unordered lists: `<ul>`

Use when the **order doesn't matter**: features, shopping lists, services. Each item is an `<li>` (list item). Browsers show bullets.

```try-html
<h3>Our web design package includes</h3>
<ul>
  <li>Up to 5 pages</li>
  <li>Mobile-friendly design</li>
  <li>Contact form and WhatsApp button</li>
  <li>Google Maps location</li>
  <li>Free SSL certificate (HTTPS)</li>
</ul>
```

### Ordered lists: `<ol>`

Use when **order matters**: steps, rankings, instructions. Browsers number the items automatically, so you never renumber by hand when adding a step.

```try-html
<h3>How to pay with M-Pesa Buy Goods</h3>
<ol>
  <li>Open M-Pesa on your phone</li>
  <li>Choose Lipa na M-Pesa</li>
  <li>Choose Buy Goods and Services</li>
  <li>Enter the till number</li>
  <li>Enter the amount and your PIN</li>
  <li>Confirm and wait for the SMS</li>
</ol>
```

#### Ordered list attributes

| Attribute | Example | Effect |
|---|---|---|
| `start` | `<ol start="4">` | Starts counting at 4 (continuing an earlier list) |
| `reversed` | `<ol reversed>` | Counts down (top 10 countdowns) |
| `type` | `<ol type="A">` | Numbering style: `1`, `A`, `a`, `I`, `i` |
| `value` (on `<li>`) | `<li value="10">` | Sets that item's number |

```try-html
<h3>Top 3 most visited parks (countdown)</h3>
<ol reversed>
  <li>Nairobi National Park</li>
  <li>Amboseli</li>
  <li>Maasai Mara</li>
</ol>

<h3>Exam instructions (Section B)</h3>
<ol type="a">
  <li>Answer all questions</li>
  <li>Show your working</li>
</ol>

<h3>Steps continued</h3>
<ol start="4">
  <li>Upload your documents</li>
  <li>Pay the fee</li>
</ol>
```

Usually it's better to choose numbering styles with CSS (`list-style-type`), but `type` is useful when the numbering is part of the meaning, like legal documents ("clause b").

### Description lists: `<dl>`, `<dt>`, `<dd>`

A **description list** pairs **terms** with **descriptions**: glossaries, FAQs, product specifications, metadata.

- `<dl>`: the description list
- `<dt>`: a description term (the name)
- `<dd>`: the description details

```try-html
<h3>Laptop specifications</h3>
<dl>
  <dt>Processor</dt>
  <dd>Intel Core i5, 11th generation</dd>
  <dt>Memory (RAM)</dt>
  <dd>8 GB</dd>
  <dt>Storage</dt>
  <dd>256 GB SSD</dd>
  <dt>Price</dt>
  <dd>KSh 54,999</dd>
</dl>

<h3>ICT glossary</h3>
<dl>
  <dt>Bandwidth</dt>
  <dd>How much data a connection can carry per second.</dd>
  <dt>Domain name</dt>
  <dd>The human-friendly address of a website, like marzleytechsolutions.co.ke.</dd>
</dl>
```

### Nested lists

A list can go **inside an `<li>`** to make sub-items. This is how multi-level menus and outlines are built.

```try-html
<h3>Course outline</h3>
<ol>
  <li>Web basics
    <ul>
      <li>How the web works</li>
      <li>HTML introduction</li>
    </ul>
  </li>
  <li>Styling
    <ul>
      <li>CSS colours and fonts</li>
      <li>Flexbox and Grid</li>
    </ul>
  </li>
  <li>Final project</li>
</ol>
```

:::warning The nesting rule
The inner list goes **inside** the `<li>`, before its closing `</li>`. Putting `<ul>` directly inside another `<ul>` (between `<li>`s) is invalid HTML.
:::

### What can go in a list item?

An `<li>` can contain text, links, images, paragraphs, even headings. Only `<li>` elements may be **direct children** of `<ul>` and `<ol>`.

```try-html
<ul>
  <li><a href="#home">Home</a></li>
  <li><a href="#services">Services</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>
```

That's the basis of almost every website navigation menu; CSS turns it into a horizontal bar.

:::think Your page lists the 47 counties of Kenya in alphabetical order. Should you use <ul> or <ol>?
Alphabetical order is just a sorting choice; the counties have no ranking, so `<ul>` is usually right. Use `<ol>` only if the numbers mean something, for example county codes (Mombasa 001, Kwale 002…) where the number itself matters. Ask: "would the meaning change if I reordered the items?" If yes, `<ol>`.
:::

## Part 2: Tables

### What is a table for?

A **table** shows **data** in rows and columns, where it makes sense to compare across both directions: price lists, timetables, exam results, opening hours, comparisons of packages, sales reports.

:::define Tabular data
Information that has two dimensions: each row is one item (a student, a product, a day) and each column is one property (name, price, time). If it would fit naturally in an Excel sheet, it's tabular data.
:::

### What tables are NOT for

In the early 2000s, developers used tables to arrange whole page layouts (sidebar in one cell, content in another). **Don't.** Layout tables confuse screen readers, break on phones and are hard to maintain. Layout is CSS's job (Flexbox and Grid).

### The basic parts

| Element | Meaning |
|---|---|
| `<table>` | The whole table |
| `<tr>` | A table row |
| `<th>` | A header cell (column or row title); bold and centred by default |
| `<td>` | A data cell |
| `<caption>` | The table's title (first thing inside `<table>`) |

```try-html
<table border="1" cellpadding="6">
  <caption>Website packages (2026)</caption>
  <tr>
    <th>Package</th>
    <th>Pages</th>
    <th>Price (KSh)</th>
  </tr>
  <tr>
    <td>Starter website</td>
    <td>Up to 5</td>
    <td>15,000</td>
  </tr>
  <tr>
    <td>Business website</td>
    <td>Up to 12</td>
    <td>35,000</td>
  </tr>
  <tr>
    <td>Online shop</td>
    <td>Unlimited products</td>
    <td>40,000</td>
  </tr>
</table>
```

> `border` and `cellpadding` are old attributes used here only so you can see the cells. In real projects, style tables with CSS (`border`, `padding`, `border-collapse`).

Every row should have the **same number of cells** (unless cells span several columns, covered in the advanced tables unit).

### Table sections: `<thead>`, `<tbody>`, `<tfoot>`

Group rows into a header, body and footer. This helps screen readers, lets browsers repeat the header on each printed page, and makes styling easier.

```try-html
<table border="1" cellpadding="6">
  <caption>Juma's shop: sales this week</caption>
  <thead>
    <tr><th>Day</th><th>Items sold</th><th>Total (KSh)</th></tr>
  </thead>
  <tbody>
    <tr><td>Monday</td><td>34</td><td>12,400</td></tr>
    <tr><td>Tuesday</td><td>28</td><td>9,850</td></tr>
    <tr><td>Wednesday</td><td>41</td><td>15,200</td></tr>
  </tbody>
  <tfoot>
    <tr><th>Total</th><td>103</td><td>37,450</td></tr>
  </tfoot>
</table>
```

### Header cells for rows, and `scope`

Header cells can label **columns** or **rows**. The `scope` attribute tells screen readers which:

- `scope="col"`: this header labels the column below it
- `scope="row"`: this header labels the row to its right

```try-html
<table border="1" cellpadding="6">
  <caption>Clinic opening hours</caption>
  <thead>
    <tr><th scope="col">Day</th><th scope="col">Opens</th><th scope="col">Closes</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Monday to Friday</th><td>8:00</td><td>18:00</td></tr>
    <tr><th scope="row">Saturday</th><td>9:00</td><td>14:00</td></tr>
    <tr><th scope="row">Sunday</th><td colspan="2">Closed</td></tr>
  </tbody>
</table>
```

With `scope`, a screen reader on the "14:00" cell says something like "Saturday, Closes, 14:00", so a blind user understands the cell without seeing the whole grid.

`colspan="2"` (in the Sunday row) makes one cell stretch across two columns. You'll master `colspan` and `rowspan` in the advanced tables unit.

### Tables on phones

Wide tables can overflow small screens. Simple fixes (with CSS, later): wrap the table in a container that scrolls sideways, keep columns few, and shorten headers. Always test tables on a phone.

:::think A school wants a table showing 40 students with 12 subject scores each. What problems might phone users face, and what could help?
The table would be about 13 columns wide, far wider than a phone screen. Users would have to scroll sideways and lose track of which row they're on. Helpful options: let the table scroll horizontally inside a box with the student name column kept visible (sticky), split it into smaller tables (per class or subject group), provide a download (Excel/PDF) for detailed analysis, or show one student per card on phones.
:::

## Lists vs tables vs paragraphs: choosing

| Your content | Use |
|---|---|
| Steps to follow in order | `<ol>` |
| Features, benefits, items with no order | `<ul>` |
| Terms with definitions, specs, FAQs | `<dl>` |
| Data with rows and columns to compare | `<table>` |
| A flowing explanation or story | `<p>` paragraphs |

## Common mistakes

| Mistake | Fix |
|---|---|
| Typing numbers or dashes manually instead of using `<ol>`/`<ul>` | Use list elements; the browser numbers and bullets |
| Text directly inside `<ul>` without `<li>` | Every item goes in an `<li>` |
| Nested `<ul>` placed between `<li>`s | Put it inside the parent `<li>` |
| Tables for page layout | Use CSS Flexbox/Grid |
| No `<th>` header cells | Use `<th>` for column/row titles |
| Rows with different numbers of cells | Keep cells equal (or use `colspan`) |
| No caption on important tables | Add `<caption>` |
| Using `<br>` to make "rows" of data | Use a real table |

## Practice tasks

1. Write the steps to send money with M-Pesa as an `<ol>`.
2. Make a nested list of your school subjects grouped into Sciences, Languages and Humanities.
3. Create a description list glossary with five computer terms.
4. Build a weekly timetable table (Monday–Friday, three periods) with a caption, `<thead>`, `<tbody>` and `scope` attributes.
5. Make a price table for a salon with a `<tfoot>` row noting "Prices include VAT".

## Summary

- `<ul>` for unordered items, `<ol>` for ordered steps, `<dl>` with `<dt>`/`<dd>` for term–description pairs; items in `<ul>`/`<ol>` are `<li>`.
- `<ol>` supports `start`, `reversed` and `type`; nested lists go inside an `<li>`.
- Tables are for **tabular data only**, never for page layout.
- Use `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>` and `<td>`; add `scope="col"` or `scope="row"` to header cells.
- Test lists and tables on phones.

```quiz
Q: Which element makes a numbered list?
A: ol | <ol>
Q: Which element is every item in a ul or ol?
A: li | <li>
Q: Which ol attribute makes the list count down?
A: reversed
Q: In a description list, which element holds the term?
A: dt | <dt>
Q: Which element is a table row?
A: tr | <tr>
Q: Which element is a header cell in a table?
A: th | <th>
Q: Which element gives a table its title?
A: caption | <caption>
Q: What scope value marks a header that labels a row?
A: row
Q: Should tables be used for page layout? (yes or no)
A: no
```
=== exercise ===
Make an ordered list (`<ol>`) with three items: **Nairobi**, **Mombasa** and **Kisumu**.
=== starter ===

=== expected ===

=== must_contain ===
<ol>
<li>Nairobi</li>
<li>Mombasa</li>
<li>Kisumu</li>
