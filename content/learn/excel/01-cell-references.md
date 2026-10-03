---
slug: formulas-cell-references
title: Formulas and cell references: relative, absolute and mixed
after: basics
---
# Formulas and cell references: relative, absolute and mixed

The real power of a spreadsheet is that one formula can be copied down hundreds of rows. To do that correctly you must understand **cell references**, the most important concept in Excel and Google Sheets.

## Formulas recap

Every formula starts with `=`:

| Formula | Result |
|---|---|
| `=B2*C2` | Multiply two cells |
| `=SUM(D2:D10)` | Add a range |
| `=D11*16%` | 16% of a cell |
| `=(B2+C2)/2` | Brackets control the order |

Order of operations: brackets, then `^` (power), then `*` and `/`, then `+` and `-`.

## Relative references (the default)

In this price list, D2 has `=B2*C2`:

| | A | B | C | D |
|---|---|---|---|---|
| 1 | Item | Price | Qty | Total |
| 2 | Unga | 180 | 3 | `=B2*C2` → 540 |
| 3 | Sugar | 160 | 2 | `=B3*C3` → 320 |
| 4 | Oil | 350 | 1 | `=B4*C4` → 350 |

When you copy D2 down (drag the **fill handle**, the small square at the cell's corner, or double-click it), Excel **adjusts** the references: row 3 gets `=B3*C3`. That's a **relative** reference: it means "the cell two to the left, on my row".

## Absolute references: $ locks a cell

Now add VAT using a rate stored in one cell, **F1 = 16%**. In E2 you type `=D2*F1` and copy down... row 3 becomes `=D3*F2`, which is empty. Wrong!

Lock the rate with dollar signs: `=D2*$F$1`. Now every row uses F1.

| | D | E (VAT) | | F |
|---|---|---|---|---|
| 1 | Total | VAT | | **16%** |
| 2 | 540 | `=D2*$F$1` → 86.40 | | |
| 3 | 320 | `=D3*$F$1` → 51.20 | | |

> Shortcut: after typing a reference, press **F4** to cycle through `F1` → `$F$1` → `F$1` → `$F1`.

## Mixed references

| Reference | Column | Row | Use when |
|---|---|---|---|
| `B2` | changes | changes | Normal row-by-row formulas |
| `$B$2` | fixed | fixed | One constant cell (rate, target) |
| `$B2` | fixed | changes | Always read column B, any row |
| `B$2` | changes | fixed | Always read row 2, any column |

Classic example: a **multiplication table** or a **price grid**. In B2, `=$A2*B$1` copied across and down multiplies each row header by each column header.

## Referencing other sheets

```
=Prices!B2                (cell B2 on the sheet called Prices)
=SUM('Term 1'!C2:C40)     (quote sheet names that contain spaces)
```

## Named ranges: easier to read

Select F1, type a name like `VAT` in the **Name Box** (left of the formula bar) and press Enter. Now write `=D2*VAT`: clear, and automatically absolute.

## Common errors and what they mean

| Error | Meaning | Usual fix |
|---|---|---|
| `#DIV/0!` | Dividing by zero or an empty cell | `=IFERROR(A2/B2, 0)` or check B2 |
| `#VALUE!` | Text where a number is expected | Remove spaces/letters from numbers |
| `#REF!` | A referenced cell was deleted | Undo, or fix the formula |
| `#NAME?` | Misspelled function or name | Check spelling: `=SUM`, not `=SUMM` |
| `#N/A` | Lookup value not found | See the Lookups lesson |
| `######` | Column too narrow | Widen the column |

Show all formulas at once with **Ctrl + `** (the key left of 1), great for checking a sheet.

## Practice

Build a fee sheet: columns Name, Fee, Paid, Balance (`=B2-C2`), and a **% paid** column `=C2/B2` formatted as a percentage. Add a cell with a late-payment penalty rate and a Penalty column that uses it with an absolute reference.

## Why cell references matter

The power of a spreadsheet is that you write a formula once and copy it to hundreds of rows. Cell references decide what happens when you copy: whether the formula follows along (relative) or keeps pointing at one fixed cell (absolute), such as a VAT rate, commission percentage or exchange rate. Almost every spreadsheet error in offices, SACCOs, schools and shops comes from a wrong reference, and fixing it is a skill employers test in interviews.

| Who | Typical use |
|---|---|
| Accountants and bookkeepers | VAT, withholding tax and totals across many rows |
| Sales teams | Commission = sales × a fixed rate in one cell |
| Teachers | Marks out of different totals converted to percentages |
| Shop owners | Price lists with a markup percentage that changes occasionally |
| HR/payroll | NSSF, SHIF and PAYE rates kept in a settings sheet |

## Worked example: a price list with a markup

| | A | B | C | D |
|---|---|---|---|---|
| 1 | Markup | 25% | | |
| 2 | Item | Cost | Selling price | Profit |
| 3 | Unga 2kg | 150 | `=B3*(1+$B$1)` | `=C3-B3` |
| 4 | Sugar 1kg | 170 | `=B4*(1+$B$1)` | `=C4-B4` |
| 5 | Cooking oil 1L | 300 | `=B5*(1+$B$1)` | `=C5-B5` |

Type the formula in C3 once and drag the fill handle down. `B3` changes to B4, B5 (relative), but `$B$1` stays fixed. Change the markup in B1 to 30% and every selling price updates instantly. This is the habit that separates a spreadsheet from a calculator: **put changeable values in their own cells and reference them**.

## Building a multiplication or pricing grid with mixed references

A grid where rows are quantities and columns are prices uses one formula for the whole table:

| | A | B | C | D |
|---|---|---|---|---|
| 1 | Qty \ Price | 50 | 100 | 250 |
| 2 | 1 | `=$A2*B$1` | | |
| 3 | 5 | | | |
| 4 | 10 | | | |

Enter `=$A2*B$1` in B2 and fill right and down. `$A` keeps reading the quantity column; `$1` keeps reading the price row. One formula fills all 9 cells correctly.

## Settings sheets: a professional pattern

Keep rates and constants on a separate sheet called **Settings**:

```
Settings!B1   VAT rate          16%
Settings!B2   Commission rate   5%
Settings!B3   USD to KES rate   (update when it changes)
```

Then formulas read them:

```
=C2*Settings!$B$1          VAT for the row
=D2*Settings!$B$2          commission
='Sales Data'!B5           a sheet name with spaces needs single quotes
```

Better still, **name** the cells (Formulas → Define Name, or type in the Name Box left of the formula bar): `=C2*VAT_Rate` reads like English and never needs `$` signs, because names are always absolute.

## References to whole columns and ranges

| Reference | Means |
|---|---|
| `B2:B100` | Cells B2 to B100 |
| `B:B` | The entire column B (handy for totals that grow) |
| `2:2` | The entire row 2 |
| `B2:D10` | A rectangle of cells |
| `Sales[Amount]` | A column in an Excel Table (structured reference) |

```
=SUM(B:B)                  total of a whole column (don't put the total inside column B!)
=SUM(Sales[Amount])        Table column: grows automatically as rows are added
=AVERAGE(B2:B31)           average of 30 days
```

Putting `=SUM(B:B)` inside column B creates a **circular reference** (the formula includes itself), and Excel warns you.

## 3D references: the same cell across sheets

If you have one sheet per month (Jan, Feb, Mar) with the same layout:

```
=SUM(Jan:Mar!B10)          adds B10 from every sheet between Jan and Mar
```

This is how a quarterly summary is built from monthly sheets without retyping.

## Tracing and checking formulas

| Tool | Where | Use |
|---|---|---|
| Show Formulas | Ctrl + ` (the grave-accent key above Tab) | See every formula instead of results |
| Trace Precedents | Formulas → Formula Auditing | Arrows show which cells feed this formula |
| Trace Dependents | Same group | Arrows show which formulas use this cell |
| Evaluate Formula | Same group | Step through a formula calculation |
| F2 | On a cell | Edit mode; referenced cells are coloured |

Before sending a spreadsheet to a manager or client, press Ctrl + ` and scan for formulas that point to the wrong place or hard-typed numbers where a formula should be.

## Avoid hard-coded numbers

| Bad | Better |
|---|---|
| `=B2*0.16` | `=B2*VAT_Rate` |
| `=B2*1.25` | `=B2*(1+$B$1)` |
| `=SUM(B2:B31)/30` | `=AVERAGE(B2:B31)` or `=SUM(...)/COUNT(...)` |

Hard-coded numbers hide inside formulas. When the rate changes, someone has to find and fix every formula, and usually misses some.

## Common reference errors in real work

| Symptom | Likely cause | Fix |
|---|---|---|
| Copied formula gives 0 or wrong values further down | Rate cell not locked | Use `$B$1` or a name |
| `#REF!` after deleting a column | Formula pointed to the deleted cells | Undo, or rewrite the reference |
| Totals don't include new rows | Range stops at a fixed row | Use a Table or extend the range |
| Circular reference warning | Formula includes its own cell | Move the total outside the range |
| Numbers stored as text (left aligned, green triangle) | Imported data | Convert with the warning menu or `=VALUE()` |

## Practice

1. Build a price list with a markup cell and selling prices that update when the markup changes.
2. Make a 10 × 10 multiplication table using a single formula with mixed references.
3. Create a Settings sheet with VAT and commission rates, name them, and use the names in a sales sheet.
4. Make three monthly sheets with the same layout and a summary using a 3D reference.

:::think A commission sheet uses `=B2*E1` in C2, where E1 holds 5%. After copying down, C3 shows 0. Why, and what's the fix?
When copied down, `E1` became `E2`, which is empty, so the result is 0 (and E3, E4 and so on further down). Lock the rate with `$E$1`, or give E1 a name like `Commission_Rate` and use `=B2*Commission_Rate`.
:::

```quiz
Q: What symbol locks a column or row in a cell reference?
A: $ | dollar sign
Q: Which key cycles through $F$1, F$1 and $F1 after typing a reference?
A: F4
Q: You copy =B2*C2 down one row. What does it become?
A: =B3*C3 | B3*C3
Q: Which error appears when dividing by zero?
A: #DIV/0! | DIV/0
Q: Which reference always reads column B but lets the row change: $B2 or B$2?
A: $B2
Q: Which shortcut shows formulas instead of results in every cell?
A: Ctrl + ` | Ctrl+` | ctrl + grave
Q: What is it called when a formula refers to its own cell? (two words)
A: circular reference
Q: Do named ranges need $ signs to stay fixed when copied? (yes or no)
A: no
```
