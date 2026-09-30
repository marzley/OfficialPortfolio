---
slug: sort-filter-tables
title: Sorting, filtering and Excel Tables
after: text-date-functions
---
# Sorting, filtering and Excel Tables

Once a sheet has hundreds of rows (a class list, a sales log, a member register) you need to find, order and summarise data quickly. Sorting, filtering and **Tables** do it without formulas.

## Set up data the right way first

- **One header row**, one record per row, one type of data per column.
- **No blank rows or columns** inside the data.
- No merged cells in the data area.
- Consistent values: "Nairobi" everywhere, not "Nbi", "nairobi", "NRB".

Get this right and every tool below just works.

## Sorting

- Click any cell in the column → **Data → Sort A→Z** or **Z→A**.
- Several levels: **Data → Sort** → e.g. sort by *Form*, then by *Mark* (largest to smallest).
- Sort by colour or by a custom list (e.g. Mon, Tue, Wed...).

> Always sort with a cell inside the data selected (not a whole single column), so Excel sorts **whole rows** together. Sorting just one column would mix up whose marks belong to whom.

## Filtering

**Data → Filter** (Ctrl + Shift + L) adds drop-down arrows to the headers.

| Filter type | Example |
|---|---|
| Choose values | Show only "Nakuru" and "Eldoret" |
| Number filters | Balance **greater than** 0; **Top 10** |
| Text filters | Name **begins with** "K"; **contains** "Hassan" |
| Date filters | **This month**, **Between** two dates |
| By colour | Rows highlighted red |

The status bar shows how many records match. Clear filters with **Data → Clear**.

> `SUBTOTAL(109, D2:D500)` sums only the **visible** (filtered) rows, unlike `SUM`.

## Excel Tables (Ctrl + T): the upgrade everyone should use

Select any cell in your data and press **Ctrl + T** (Insert → Table). You get:

| Benefit | What it means |
|---|---|
| Banded rows and filters | Instantly readable |
| **Grows automatically** | New rows join the table; charts and formulas update |
| **Formulas fill down** | Type once, the whole column fills |
| **Structured references** | `=[@Price]*[@Qty]` instead of `=B2*C2` |
| **Total row** | Table Design → Total Row: pick Sum, Average, Count per column |
| Slicers | Big filter buttons (Table Design → Insert Slicer) |

Name your table (Table Design → Table Name, e.g. `Sales`) and use it in formulas anywhere:

```
=SUM(Sales[Amount])
=SUMIFS(Sales[Amount], Sales[Town], "Nairobi")
=COUNTIFS(Sales[Method], "M-Pesa")
```

These formulas stay correct as the table grows: no more fixing `D2:D500` ranges.

## Freeze panes and other navigation helpers

- **View → Freeze Panes → Freeze Top Row**: the headers stay visible while scrolling.
- **Ctrl + Arrow**: jump to the end of the data. **Ctrl + Shift + Arrow**: select to the end.
- **Ctrl + Home**: back to A1.
- **Ctrl + F**: find; **Ctrl + H**: find and replace (great for fixing "Nbi" → "Nairobi").

## Modern dynamic functions (Excel 365 / Google Sheets)

```
=SORT(A2:D100, 4, -1)                         sort by column 4, descending
=FILTER(A2:D100, D2:D100>0, "None")           rows with a balance
=UNIQUE(C2:C100)                              list of distinct towns
=SORT(UNIQUE(C2:C100))                        sorted distinct towns
```

The results "spill" into neighbouring cells and update when the data changes.

## Practice

Download or type a small sales log (Date, Customer, Town, Method, Amount). Convert it to a Table named `Sales`, add a Total row, sort by Amount, filter to M-Pesa payments in Nairobi, and freeze the header row.

```quiz
Q: Which shortcut turns a range into an Excel Table?
A: Ctrl + T | ctrl+t
Q: Which shortcut turns filters on or off?
A: Ctrl + Shift + L | ctrl+shift+l
Q: Which function sums only visible, filtered rows?
A: SUBTOTAL | SUBTOTAL()
Q: Which View option keeps the header row visible while scrolling? (two words)
A: Freeze Panes | freeze top row
Q: Which dynamic function returns only the rows that meet a condition?
A: FILTER | FILTER()
```
