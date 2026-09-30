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
```
