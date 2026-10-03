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

## Why sorting, filtering and Tables matter

Once a sheet has more than a screenful of rows, you need ways to find answers fast: "Which customers owe more than KSh 10,000?", "Show only March sales from Nakuru", "Who are the top 10 students?" Sorting and filtering answer these in seconds without changing the data. Excel Tables add automatic formatting, formulas that fill themselves, totals and ranges that grow, and they are the foundation for PivotTables, charts and Power Query.

## Multi-level sorting

Use **Data → Sort** (not the quick A→Z buttons) to sort by several columns:

| Level | Column | Order |
|---|---|---|
| Sort by | Class | A to Z |
| Then by | Mean mark | Largest to smallest |
| Then by | Name | A to Z |

Result: students grouped by class, best first within each class, ties alphabetical.

Other sort options:

- **Custom lists**: sort by Mon, Tue, Wed... or Jan, Feb, Mar instead of alphabetically (Order → Custom List).
- **Sort by colour**: bring red-highlighted rows to the top.
- **Sort left to right**: Options → Sort left to right, for data arranged in rows.

Always select one cell inside the data (or the whole data) before sorting. Sorting only one selected column scrambles your rows: the names no longer match their marks. If that happens, press **Ctrl + Z** immediately.

## Advanced filtering

| Filter type | Example |
|---|---|
| Text filters | Contains "unga", Begins with "Nai", Does not equal "Cancelled" |
| Number filters | Greater than 5000, Between 1000 and 5000, Top 10, Above average |
| Date filters | This month, Last quarter, Between two dates, Year to date |
| Filter by colour | Only rows highlighted yellow |
| Search box | Type part of a value to tick matching items |

Filters on several columns combine with AND: Branch = Nakuru **and** Month = March. After filtering, the row numbers turn blue and the status bar shows "12 of 340 records found".

## Copying and summarising filtered data

- Copying visible filtered rows and pasting elsewhere only pastes the visible rows.
- `SUM` adds hidden rows too; `SUBTOTAL(109, D2:D500)` and `AGGREGATE(9, 5, D2:D500)` add only visible ones.
- The status bar (bottom right) shows Sum, Average and Count of selected visible cells: a quick check without formulas.

## Excel Tables in depth

After **Ctrl + T**, rename the table (Table Design → Table Name), for example `Sales`. Benefits:

| Feature | What it does |
|---|---|
| Auto-expand | New rows typed below become part of the table, including formatting and formulas |
| Calculated columns | Type a formula once; it fills the whole column automatically |
| Structured references | `=[@Qty]*[@Price]` instead of `=C2*D2` |
| Total Row | Table Design → Total Row: pick Sum, Average or Count per column (uses SUBTOTAL) |
| Slicers | Big filter buttons (Table Design → Insert Slicer), great for dashboards |
| Banded rows | Easier reading, applied automatically |
| Growing ranges | Charts, PivotTables and formulas using the table include new rows automatically |

Structured reference examples:

```
=[@Qty]*[@Price]                     this row's Qty × Price (inside the table)
=SUM(Sales[Amount])                  whole Amount column
=SUMIFS(Sales[Amount], Sales[Branch], "Nakuru")
=COUNTROWS(Sales)                    (Power Pivot/DAX); in normal Excel: =ROWS(Sales)
```

These formulas read like sentences and never need range adjustments.

## Dynamic array functions: live sorted and filtered results

In Excel 365 and Google Sheets, formulas can return whole lists that update automatically:

```
=SORT(Sales, 4, -1)                              whole table sorted by the 4th column, largest first
=SORTBY(Sales[Name], Sales[Amount], -1)          names sorted by amount
=FILTER(Sales, Sales[Branch]="Nakuru")           only Nakuru rows
=FILTER(Sales, (Sales[Branch]="Nakuru")*(Sales[Amount]>5000), "None")   AND: multiply conditions
=FILTER(Sales, (Sales[Branch]="Nakuru")+(Sales[Branch]="Thika"))        OR: add conditions
=UNIQUE(Sales[Branch])                           list of branches without duplicates
=TAKE(SORT(Sales, 4, -1), 10)                    top 10 rows
=COUNTA(UNIQUE(Sales[Customer]))                 number of distinct customers
```

The results "spill" into the cells below. If something blocks the spill area, you see `#SPILL!`; clear those cells.

## Building a simple search box

1. In H1 type "Search branch:", and in I1 let the user type a branch name.
2. In H3: `=FILTER(Sales, ISNUMBER(SEARCH(I1, Sales[Branch])), "No matches")`.
3. Typing "nak" shows all Nakuru rows instantly.

Combine with a Data Validation drop-down (`=UNIQUE(Sales[Branch])` as the source) for a no-typing filter.

## Freeze panes, grouping and views

| Feature | Where | Use |
|---|---|---|
| Freeze Top Row | View → Freeze Panes | Headers stay visible while scrolling |
| Freeze Panes (custom) | Select B2 → Freeze Panes | Freeze the top row and first column together |
| Group rows/columns | Data → Group | Collapse detail with + / − buttons |
| Split | View → Split | Compare two distant parts of a sheet |
| Custom Views / Sheet Views | View | Save filter set-ups (Sheet Views lets colleagues filter without disturbing each other in shared files) |

## Good data habits that make all this work

1. One header row; every column has a unique name.
2. No blank rows or columns inside the data.
3. One type of data per column (don't mix dates and text).
4. No merged cells in data areas (they break sorting and filtering).
5. One record per row; store totals in a separate summary area.
6. Keep raw data on its own sheet; put reports and charts on other sheets.

## Common mistakes

| Mistake | Fix |
|---|---|
| Sorting one column only | Select the whole table, or use a Table |
| Blank row splits the data, so the filter stops halfway | Remove blank rows |
| `SUM` includes filtered-out rows | `SUBTOTAL(109, ...)` or the Table Total Row |
| Merged header cells | Use "Center Across Selection" instead |
| `#SPILL!` | Clear cells below/right of the dynamic formula |

## Practice

1. Convert a sales list to a Table named `Sales`, add a calculated `Amount = Qty × Price` column and a Total Row.
2. Add slicers for Branch and Product and test them.
3. Use FILTER to show sales over 5,000 in Nakuru, and UNIQUE to list all customers.
4. Sort students by class, then by mean (highest first), then by name.
5. Build a search box that filters a customer list as you type part of a name.

:::think You sort a student list by the Mark column only and now every student has the wrong mark. What happened, and how do you prevent it?
Only the Mark column was selected, so Excel sorted that column alone, separating marks from names. Undo with Ctrl + Z straight away. Prevent it by clicking a single cell in the data (so Excel selects the whole region) or, better, converting the data to a Table, which always sorts complete rows.
:::

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
Q: Which Table feature adds large clickable filter buttons for dashboards?
A: slicers | slicer
Q: In a FILTER formula, which operator combines conditions as AND: * or +?
A: * | multiply | asterisk
Q: Which error appears when a dynamic array formula is blocked by other cells?
A: #SPILL! | SPILL | #SPILL
Q: Which function returns the first N rows of a sorted list, e.g. a top 10?
A: TAKE
```
