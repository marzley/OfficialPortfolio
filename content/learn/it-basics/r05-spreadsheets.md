---
slug: spreadsheets
title: "Spreadsheets for beginners: Excel and Google Sheets from your first cell to useful formulas"
after: KEEP
---
# Spreadsheets for beginners: Excel and Google Sheets from your first cell to useful formulas

Spreadsheets are among the most valuable computer skills you can have. Shops track stock and sales, schools compute marks and fees balances, chamas record contributions, NGOs analyse surveys, and accountants build budgets, all in **Excel** or **Google Sheets**. Employers in Kenya regularly list Excel as a required skill. This beginner unit takes you from "what is a cell?" to building a simple, correct sales or budget sheet. The **Excel & Google Sheets** subject goes much deeper.

:::note What you will learn
- What spreadsheets are for, and Excel vs Google Sheets
- Workbooks, sheets, rows, columns, cells and ranges
- Entering and formatting data (numbers, currency, dates)
- Formulas, operators and the order of operations
- Essential functions: SUM, AVERAGE, MIN, MAX, COUNT, ROUND
- AutoFill and relative references
- Sorting, filtering, freezing panes and simple charts
- Saving, printing and sharing
:::

## What is a spreadsheet?

:::define Spreadsheet
A grid of rows and columns where each box (a **cell**) holds a value or a **formula**. Formulas calculate automatically and update instantly when the data changes.
:::

Why not just use a calculator or paper? Because a spreadsheet **remembers** the calculation: change one price and every total, average and chart updates instantly. It also sorts, filters, summarises and charts data.

| Program | Notes |
|---|---|
| **Microsoft Excel** | The office standard, most powerful, works offline |
| **Google Sheets** | Free, online, autosaves, great for sharing and collaborating |
| **LibreOffice Calc** | Free, offline |
| **Phone apps** | Excel and Sheets apps for quick edits |

## The parts

| Term | Meaning | Example |
|---|---|---|
| **Workbook** | The whole file | `Shop-Sales-2026.xlsx` |
| **Worksheet (sheet)** | One page/tab in the workbook | "January", "February" |
| **Column** | Vertical, labelled with letters | A, B, C ... |
| **Row** | Horizontal, labelled with numbers | 1, 2, 3 ... |
| **Cell** | Where a row and column meet; has an **address** | `B3` = column B, row 3 |
| **Range** | A rectangle of cells | `B2:B10` (B2 down to B10) |
| **Formula bar** | Shows the real content (formula) of the selected cell | `=B2*C2` |
| **Name box** | Shows the selected cell's address | `D2` |

## Entering data

- Click a cell and type; press **Enter** (moves down) or **Tab** (moves right).
- Edit: double-click the cell or press **F2**, or edit in the formula bar.
- **Text** aligns left, **numbers** align right by default: if a number aligns left, it may have been stored as text (a common import problem).
- Don't type units into number cells: type `180`, not `KSh 180` or `180/-`. Use **number formatting** to show currency.
- Enter dates in a clear format (e.g. `2026-10-02` or `02/10/2026` depending on your regional settings) so they're recognised as dates.

### One table, one header row

A good data table has **one header row** with clear column names, one record per row, and no empty rows in the middle:

| Date | Product | Qty | Price | Total |
|---|---|---|---|---|
| 2026-10-01 | Unga 2kg | 3 | 180 | |
| 2026-10-01 | Sugar 1kg | 2 | 150 | |

## Formatting

| Format | How (Excel: Home tab; Sheets: Format menu/toolbar) |
|---|---|
| Bold headers, fill colour | Font group |
| Number format: currency, comma style, decimals | Number group (e.g. "Comma Style" or Format → Number) |
| Percentages | `%` button (0.16 shows as 16%) |
| Dates | Number format → Short Date / Long Date |
| Column width | Double-click the boundary between column letters to **AutoFit** |
| Wrap text | Long text in a cell wraps onto several lines |
| Borders | Borders button for printing |

## Formulas

Every formula starts with **`=`**.

```
=B2*C2        multiply the values in B2 and C2
=D2+D3        add two cells
=D2-500       subtract a number
=D2/2         divide
=D2^2         power
=(B2+C2)*0.16 brackets first
```

| Operator | Meaning |
|---|---|
| `+` `-` `*` `/` | Add, subtract, multiply, divide |
| `^` | Power |
| `&` | Join text: `=A2&" "&B2` |
| `=` `<>` `>` `<` `>=` `<=` | Comparisons (used in IF) |

Order of operations: brackets, powers, multiply/divide, then add/subtract (BODMAS/PEMDAS).

:::tip Use cell references, not typed numbers
Write `=C2*D2`, not `=3*180`. If the quantity changes, a referenced formula updates automatically; a typed number doesn't. Put rates like VAT (16%) in their own labelled cell and reference it.
:::

## Essential functions

A **function** is a ready-made formula: `=FUNCTION(arguments)`.

| Function | Does | Example |
|---|---|---|
| `SUM` | Adds | `=SUM(E2:E20)` |
| `AVERAGE` | Mean | `=AVERAGE(C2:C41)` |
| `MIN` / `MAX` | Smallest / largest | `=MAX(E2:E20)` |
| `COUNT` | Counts cells with numbers | `=COUNT(C2:C41)` |
| `COUNTA` | Counts non-empty cells | `=COUNTA(A2:A41)` |
| `ROUND` | Rounds | `=ROUND(F2, 0)` |
| `IF` | Chooses based on a condition | `=IF(C2>=50,"Pass","Fail")` |
| `TODAY` | Today's date | `=TODAY()` |

**AutoSum** (Σ button, or `Alt+=` in Excel) inserts a SUM for the cells above automatically.

## AutoFill and relative references

Write a formula once, then copy it down:

1. In `E2` type `=C2*D2` and press Enter.
2. Select `E2`, then drag the small square at the bottom-right corner (the **fill handle**) down to `E10`, or double-click it.
3. Excel adjusts the references automatically: `E3` becomes `=C3*D3`, `E4` becomes `=C4*D4`. These are **relative references**.

AutoFill also continues patterns: type `January` and drag to get February, March...; type `1` and `2`, select both and drag for 3, 4, 5...

When a formula should always point to the **same cell** (like a VAT rate in `H1`), use an **absolute reference** with dollar signs: `=E2*$H$1` (press **F4** to add them). The Excel subject's cell references lesson explains this fully.

## A complete mini example: a shop's daily sales

| | A | B | C | D | E |
|---|---|---|---|---|---|
| 1 | Product | Qty | Price | Total | |
| 2 | Unga 2kg | 3 | 180 | `=B2*C2` → 540 | |
| 3 | Sugar 1kg | 2 | 150 | `=B3*C3` → 300 | |
| 4 | Milk 500ml | 6 | 60 | `=B4*C4` → 360 | |
| 5 | Bread | 4 | 65 | `=B5*C5` → 260 | |
| 6 | **Total** | `=SUM(B2:B5)` → 15 | | `=SUM(D2:D5)` → 1,460 | |
| 7 | Average sale | | | `=AVERAGE(D2:D5)` → 365 | |
| 8 | Biggest sale | | | `=MAX(D2:D5)` → 540 | |

Change the quantity of Unga to 5 and watch the total, average and biggest sale update.

## Sorting and filtering

- **Sort:** click inside the table → Data → Sort (by Total, largest to smallest, for example). Make sure the whole table is selected so rows stay together.
- **Filter:** Data → **Filter** adds drop-down arrows to the headers; show only "Unga" rows, or totals above 500.
- **Freeze panes:** View → Freeze Panes → **Freeze Top Row**, so headers stay visible when scrolling long lists.

## A simple chart

1. Select the product names and totals (hold `Ctrl` to select non-adjacent columns).
2. Insert → **Recommended Charts** (Excel) or Insert → Chart (Sheets).
3. Choose a **column/bar chart** for comparing products, a **line chart** for trends over time, a **pie chart** only for parts of a whole with few categories.
4. Add a clear chart title.

## Common errors

| Error | Meaning | Fix |
|---|---|---|
| `#####` | Column too narrow | Widen the column |
| `#DIV/0!` | Dividing by zero/empty cell | Check the data or use `IFERROR` |
| `#VALUE!` | Wrong type (text in maths) | Make sure numbers are numbers |
| `#NAME?` | Misspelled function name | Check spelling (`=SUMM` → `=SUM`) |
| `#REF!` | Reference to a deleted cell | Fix the formula |
| A number stored as text | Left-aligned, green triangle | Convert to number (warning menu) |

## Saving, printing and sharing

- Save as `.xlsx` (Excel). Google Sheets saves automatically; download as `.xlsx` or PDF when needed.
- **Print:** set the **print area**, use Page Layout → **Fit to 1 page wide**, landscape for wide tables, and check Print Preview. Turn on gridlines or borders for readability.
- **Share:** Google Sheets → Share (viewer, commenter or editor); Excel via OneDrive. Be careful sharing sheets with personal data (phone numbers, fees balances).

:::kenya Spreadsheets in everyday Kenyan work
- **Chama records:** members, monthly contributions, fines, loans and balances.
- **School:** marks, averages, ranking, fee balances.
- **Shops:** stock in/out, daily sales, M-Pesa reconciliation.
- **Farm records:** expenses, harvest, sales per season.
These are great practice projects, and the Excel subject has full guides.
:::

:::think Why should you avoid typing "KSh 180" into price cells?
"KSh 180" is **text**, so formulas like `=B2*C2` give `#VALUE!` errors or treat it as zero. Type just `180` and apply a number/currency format to display "KSh 180" while keeping it a real number.
:::

## Practice tasks

1. Create a weekly budget: categories (food, transport, rent, data, savings), planned vs actual, and totals with SUM.
2. Build the shop sales table above and add a 16% VAT column using a referenced VAT cell.
3. Enter 10 students' marks and compute average, highest, lowest and Pass/Fail with IF.
4. Sort the students by average and filter to show only those who passed.
5. Make a column chart of sales by product.

## Summary

- Spreadsheets organise data in cells (addresses like `B3`) and calculate automatically with formulas.
- Keep tables clean: one header row, one record per row, numbers without units.
- Formulas start with `=`; use cell references; know `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `ROUND`, `IF`.
- AutoFill copies formulas with relative references; use `$` (F4) for fixed cells.
- Sort, filter, freeze headers, make simple charts, and fix common errors.
- Save, print neatly and share carefully.

```quiz
Q: What symbol must every formula start with?
A: = | equals
Q: What is the address of the cell in column C, row 5?
A: C5
Q: Which function adds a range of numbers?
A: SUM
Q: What error appears when a column is too narrow to show a number? (symbols)
A: ##### | #####
Q: Which key adds dollar signs to make a reference absolute in Excel?
A: F4
Q: What error appears when dividing by zero?
A: #DIV/0! | DIV/0
Q: Which chart type is best for showing a trend over time?
A: line | line chart
```
