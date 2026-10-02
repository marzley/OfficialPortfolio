---
slug: tables-advanced
title: "Advanced tables: colspan, rowspan, timetables, reports and accessible data"
after: lists-tables
---
# Advanced tables: colspan, rowspan, timetables, reports and accessible data

Real tables are rarely simple grids. A school timetable has a lunch break across all columns; a results sheet groups subjects under "Sciences" and "Languages"; a sales report has sub-totals. This unit teaches you to build complex tables correctly with **`colspan`**, **`rowspan`**, column groups and accessible headers, and to make them work on phones.

:::note What you will learn
- Merging cells across columns (`colspan`) and rows (`rowspan`)
- Planning complex tables on paper first
- Multi-level headers and `scope="colgroup"`
- `<colgroup>` and `<col>` for column styling
- `headers` and `id` for very complex tables
- Responsive tables for phones and print-friendly reports
:::

## Who builds complex tables?

School systems (timetables, mark sheets, report cards), hospitals (duty rosters), businesses (sales and stock reports), SACCOs (loan schedules), transport (bus and flight schedules) and government reports. If you build systems for clients, you'll build these often.

## `colspan`: a cell across several columns

`colspan="n"` makes a cell stretch across **n columns**.

```try-html
<table border="1" cellpadding="6">
  <caption>Grade 9 timetable (Monday)</caption>
  <tr><th scope="col">Time</th><th scope="col">Lesson</th><th scope="col">Teacher</th></tr>
  <tr><td>8:00</td><td>Mathematics</td><td>Mr Otieno</td></tr>
  <tr><td>8:40</td><td>English</td><td>Mrs Wambui</td></tr>
  <tr><td>10:00</td><td colspan="2"><strong>Break</strong></td></tr>
  <tr><td>10:30</td><td>Integrated Science</td><td>Ms Chebet</td></tr>
  <tr><td>12:40</td><td colspan="2"><strong>Lunch</strong></td></tr>
</table>
```

The "Break" row has only **2** cells, but the second covers 2 columns, so the row still adds up to 3 columns.

## `rowspan`: a cell down several rows

`rowspan="n"` makes a cell stretch **down n rows**. The rows below then have **one fewer cell** in that position.

```try-html
<table border="1" cellpadding="6">
  <caption>Clinic duty roster</caption>
  <tr><th scope="col">Day</th><th scope="col">Shift</th><th scope="col">Nurse on duty</th></tr>
  <tr><th scope="row" rowspan="2">Monday</th><td>Day</td><td>Nurse Akinyi</td></tr>
  <tr><td>Night</td><td>Nurse Mutua</td></tr>
  <tr><th scope="row" rowspan="2">Tuesday</th><td>Day</td><td>Nurse Wairimu</td></tr>
  <tr><td>Night</td><td>Nurse Kiprono</td></tr>
</table>
```

## The counting rule

The most common error with spans is rows that don't add up. Every row must cover the **same number of columns**:

- Count each normal cell as 1 and each `colspan="n"` cell as n.
- Remember cells from rows **above** that reach down with `rowspan` and occupy a slot.

:::tip Plan on paper first
Draw the table as a grid on paper (or in Excel), shade merged cells, then write the HTML row by row. Five minutes of planning saves an hour of confusing misaligned cells.
:::

## Multi-level headers

A results table where subject groups sit above subject names:

```try-html
<table border="1" cellpadding="6">
  <caption>Term 2 results</caption>
  <thead>
    <tr>
      <th scope="col" rowspan="2">Student</th>
      <th scope="colgroup" colspan="2">Sciences</th>
      <th scope="colgroup" colspan="2">Languages</th>
      <th scope="col" rowspan="2">Average</th>
    </tr>
    <tr>
      <th scope="col">Maths</th><th scope="col">Biology</th>
      <th scope="col">English</th><th scope="col">Kiswahili</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Amina</th><td>78</td><td>84</td><td>71</td><td>80</td><td>78.3</td></tr>
    <tr><th scope="row">Brian</th><td>65</td><td>72</td><td>88</td><td>79</td><td>76.0</td></tr>
  </tbody>
</table>
```

- `scope="colgroup"` says the header labels a **group** of columns.
- "Student" and "Average" use `rowspan="2"` to fill both header rows.

:::think In the results table, how many column slots does the first header row cover, and does it match the body rows?
Student (1) + Sciences (2) + Languages (2) + Average (1) = 6 slots. Each body row has 1 `<th>` + 5 `<td>` = 6. The second header row has 4 cells, plus Student and Average reaching down with rowspan = 6. Everything matches.
:::

## `<colgroup>` and `<col>`: styling whole columns

`<col>` elements (inside `<colgroup>`, right after `<caption>`) let you style entire columns, for example highlighting the "Total" column, without adding classes to every cell.

```try-html
<table border="1" cellpadding="6">
  <caption>Weekly sales (KSh)</caption>
  <colgroup>
    <col>
    <col span="3">
    <col style="background:#fff7e0">
  </colgroup>
  <tr><th scope="col">Product</th><th scope="col">Mon</th><th scope="col">Tue</th><th scope="col">Wed</th><th scope="col">Total</th></tr>
  <tr><th scope="row">Bread</th><td>3,600</td><td>4,100</td><td>3,900</td><td>11,600</td></tr>
  <tr><th scope="row">Milk</th><td>2,200</td><td>2,500</td><td>2,350</td><td>7,050</td></tr>
</table>
```

Only a few CSS properties work on `<col>` (mainly `background`, `width`, `border`, `visibility`).

## `headers` and `id`: for very complex tables

When `scope` isn't enough (headers in irregular places), give each header an `id` and list them in each data cell's `headers` attribute:

```
<th id="q1">Q1</th> <th id="nbi">Nairobi</th>
<td headers="nbi q1">1.2M</td>
```

Screen readers then read "Nairobi, Q1, 1.2M". Usually it's better to **simplify the table** (split it) than to rely on complex `headers` markup.

## Numbers in tables

- **Right-align numbers** (with CSS) so digits line up.
- Use the **same number of decimals** in a column.
- Put **units in the header** ("Price (KSh)") instead of every cell.
- Use **thousands separators**: 1,250,000.

## Tables on phones

Options (most need CSS, which you'll learn soon):

1. **Horizontal scroll container**: wrap the table in `<div class="table-wrap">` with `overflow-x: auto`. Simple and keeps the table intact. (This learning hub does it.)
2. **Sticky first column** so the row labels stay visible while scrolling sideways.
3. **Stacked cards**: each row becomes a card on small screens (CSS + a `data-label` attribute per cell).
4. **Fewer columns**: hide less important columns on phones, or link to the full table.

```try-html
<div style="overflow-x:auto;max-width:280px;border:1px dashed #999">
  <table border="1" cellpadding="6" style="min-width:520px">
    <caption>Loan repayment schedule</caption>
    <tr><th scope="col">Month</th><th scope="col">Opening balance</th><th scope="col">Payment</th><th scope="col">Interest</th><th scope="col">Closing balance</th></tr>
    <tr><td>1</td><td>100,000</td><td>9,000</td><td>1,500</td><td>92,500</td></tr>
    <tr><td>2</td><td>92,500</td><td>9,000</td><td>1,388</td><td>84,888</td></tr>
  </table>
</div>
<p>(Scroll the table sideways inside the box.)</p>
```

## Printing reports

Long tables often get printed (report cards, invoices). With `<thead>`, browsers can repeat the header row on every printed page, and CSS print styles can avoid breaking rows across pages (`tr { break-inside: avoid; }`).

## Common mistakes

| Mistake | Fix |
|---|---|
| Rows with different column totals | Count spans; plan on paper |
| Forgetting that `rowspan` takes a slot in rows below | Remove one cell from those rows |
| Merged cells used for visual layout | Tables are for data only |
| No header cells in complex tables | `<th>` with `scope` (or `headers`/`id`) |
| Tables too wide for phones | Scroll container, fewer columns or cards |
| Numbers left-aligned with mixed decimals | Right-align, consistent decimals, units in headers |

## Practice tasks

1. Build your school's full Monday timetable with break and lunch rows using `colspan`.
2. Build a two-week duty roster with `rowspan` for each day.
3. Build a results table with grouped headers (Sciences, Languages, Humanities) using `scope="colgroup"`.
4. Build a sales table with a highlighted Total column using `<colgroup>`.
5. Wrap your widest table in a scrolling container and test it on your phone.

## Summary

- `colspan` merges across columns; `rowspan` merges down rows (and removes a cell from rows below).
- Every row must add up to the same number of column slots; plan on paper first.
- Use `scope="col"`, `"row"` and `"colgroup"`; use `headers`/`id` only for truly irregular tables.
- `<colgroup>`/`<col>` style whole columns.
- Format numbers clearly, and make wide tables scroll or reflow on phones.

```quiz
Q: Which attribute merges a cell across several columns?
A: colspan
Q: Which attribute merges a cell down several rows?
A: rowspan
Q: A row has 2 normal cells and one cell with colspan="3". How many column slots does it cover?
A: 5 | five
Q: Which scope value labels a group of columns?
A: colgroup
Q: Which element inside colgroup styles a whole column?
A: col | <col>
Q: Should numbers in a column be aligned left or right?
A: right
Q: Which CSS property makes a wide table scroll sideways inside its container? Write the property name.
A: overflow-x | overflow
```
