---
slug: lookups
title: "Lookups: VLOOKUP, HLOOKUP, XLOOKUP, INDEX/MATCH and IFERROR explained with examples"
after: KEEP
---
# Lookups: VLOOKUP, HLOOKUP, XLOOKUP, INDEX/MATCH and IFERROR explained with examples

Lookup functions find information in a table automatically: the price of a product from its code, a student's name from an admission number, a customer's phone from their account number, a tax band from an income, or a grade from marks. They're among the most requested Excel skills in job interviews and adverts ("must know VLOOKUP and pivot tables"). This unit explains every major lookup method, when to use each, and how to fix the errors they commonly produce.

:::note What you will learn
- What lookups are and where they're used
- VLOOKUP: exact match, step by step, and its limitations
- Approximate match for bands (tax, commission, grades)
- HLOOKUP for horizontal tables
- XLOOKUP: the modern replacement
- INDEX and MATCH: the flexible classic
- IFERROR/IFNA for friendly results
- Fixing #N/A and other lookup problems
- Lookups across sheets
:::

## Why lookups?

Imagine a sales sheet where you type a product code and want the product name and price to appear automatically from a price list. Without lookups, you'd search manually every time and make mistakes. With lookups, the spreadsheet finds them instantly, and updates if the price list changes.

**Price list (sheet "Products", A1:C6):**

| | A | B | C |
|---|---|---|---|
| 1 | Code | Product | Price |
| 2 | P001 | Unga 2kg | 180 |
| 3 | P002 | Sugar 1kg | 150 |
| 4 | P003 | Milk 500ml | 60 |
| 5 | P004 | Cooking oil 1L | 320 |
| 6 | P005 | Bread 400g | 65 |

## VLOOKUP

```
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

| Argument | Meaning | Example |
|---|---|---|
| `lookup_value` | What you're looking for | `A2` (the code typed on the sales sheet) |
| `table_array` | The table to search; the **first column** must contain the lookup values | `Products!$A$2:$C$6` |
| `col_index_num` | Which column of the table to return (1 = first) | `3` for Price |
| `range_lookup` | `FALSE` (or 0) = **exact match**; `TRUE` = approximate | `FALSE` |

Get the price of the code in A2:

```
=VLOOKUP(A2, Products!$A$2:$C$6, 3, FALSE)
```

Get the product name:

```
=VLOOKUP(A2, Products!$A$2:$C$6, 2, FALSE)
```

### Step by step

1. Click the cell where the result should appear.
2. Type `=VLOOKUP(`.
3. Click the cell with the code (A2), type a comma.
4. Select the table (A2:C6 on the Products sheet), press **F4** to make it absolute (`$A$2:$C$6`), comma.
5. Type the column number (3), comma.
6. Type `FALSE`, close the bracket, press Enter.
7. Copy the formula down: the `$` keeps the table fixed while `A2` changes to A3, A4...

:::warning Always use FALSE for exact matches
If you leave out the fourth argument, VLOOKUP uses **approximate match** (TRUE), which can return wrong results silently for codes and names. For codes, IDs, names and anything that must match exactly, use `FALSE`.
:::

### VLOOKUP limitations

- The lookup column must be the **first** column of the table; it can't look to the left.
- The column number is hard-coded: inserting a column in the table breaks it (returns the wrong column).
- It returns only the first match.

XLOOKUP and INDEX/MATCH solve these.

## Approximate match: bands and brackets

Approximate match (`TRUE`) is perfect for **bands**: commission rates, grades, shipping costs, discount tiers. The table must be **sorted ascending** by the first column, and each row gives the **lower limit** of its band.

**Commission table (F2:G5):**

| Sales from | Rate |
|---|---|
| 0 | 0% |
| 50,000 | 2% |
| 100,000 | 5% |
| 250,000 | 8% |

```
=VLOOKUP(B2, $F$2:$G$5, 2, TRUE)
```

Sales of 120,000 → finds the largest value ≤ 120,000 (100,000) → returns 5%.

Grades the same way:

| Marks from | Grade |
|---|---|
| 0 | E |
| 40 | D |
| 50 | C |
| 65 | B |
| 80 | A |

`=VLOOKUP(C2, $J$2:$K$6, 2, TRUE)` is often neater than a long nested IF.

## HLOOKUP

The same as VLOOKUP for tables arranged **horizontally** (lookup values in the first **row**):

```
=HLOOKUP("Mar", $B$1:$M$3, 2, FALSE)    → value in row 2 under "Mar"
```

## XLOOKUP (Excel 2021, Microsoft 365, and Google Sheets)

```
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
```

Price of the code in A2:

```
=XLOOKUP(A2, Products!$A$2:$A$6, Products!$C$2:$C$6, "Not found")
```

Advantages:
- **Exact match by default** (safer).
- Lookup and return columns are separate, so it can look **left** and doesn't break when columns are inserted.
- Built-in **if_not_found** message.
- Can search from the last match (`search_mode` -1) and return several columns at once.

Approximate (bands): `match_mode` -1 means "exact or next smaller":

```
=XLOOKUP(B2, $F$2:$F$5, $G$2:$G$5, , -1)
```

If you have Excel 365 or Google Sheets, **prefer XLOOKUP**. Learn VLOOKUP too, because many existing files and employers still use it.

## INDEX and MATCH

Before XLOOKUP, professionals combined two functions:

- `MATCH(lookup_value, lookup_array, 0)` returns the **position** of a value in a list (0 = exact).
- `INDEX(array, row_num)` returns the value at a position.

```
=INDEX(Products!$C$2:$C$6, MATCH(A2, Products!$A$2:$A$6, 0))
```

"Find the position of the code in the Code column, then return the Price at that position." It can look left, doesn't break when columns move, and works in all Excel versions.

Two-way lookup (row and column), e.g. a price for a product (row) and a branch (column):

```
=INDEX($B$2:$E$10, MATCH(H2, $A$2:$A$10, 0), MATCH(H3, $B$1:$E$1, 0))
```

## IFERROR and IFNA: friendly results

When a lookup doesn't find a value, it shows `#N/A`. Wrap it:

```
=IFERROR(VLOOKUP(A2, Products!$A$2:$C$6, 3, FALSE), "Code not found")
=IFNA(VLOOKUP(A2, Products!$A$2:$C$6, 3, FALSE), 0)
```

`IFNA` catches only #N/A (not-found), so other real errors still show; `IFERROR` catches all errors. Don't hide errors you should fix.

## Fixing #N/A and lookup problems

| Problem | Cause | Fix |
|---|---|---|
| `#N/A` but the value looks present | Extra spaces (`"P001 "`) | `=TRIM()` the data, or Find & Replace spaces |
| `#N/A` with numbers | One side is a number, the other is text (`1001` vs `"1001"`) | Convert both to the same type |
| Wrong results | Approximate match used by mistake | Use `FALSE` / XLOOKUP's default exact match |
| Results shift when copied | Table not absolute | Lock with `$` (F4) |
| Wrong column after inserting a column | Hard-coded column number in VLOOKUP | Use XLOOKUP or INDEX/MATCH |
| Approximate match wrong | Table not sorted ascending | Sort the band table by the first column |
| `#REF!` | Column number larger than the table width | Check `col_index_num` |

:::think A VLOOKUP for admission number 4521 returns #N/A, even though you can see 4521 in the student list. What would you check?
Check whether one of them is stored as text and the other as a number (a green triangle or left alignment reveals text), and whether there are hidden spaces. Also confirm the lookup range covers that row, uses FALSE for exact match, and is locked with $ if the formula was copied.
:::

## Lookups across sheets and files

- Click into another sheet while building the formula; Excel writes `Products!$A$2:$C$6`.
- Sheet names with spaces appear in quotes: `'Price List'!$A$2:$C$6`.
- Turning the price list into an **Excel Table** (`Ctrl+T`) and naming it lets you write `=XLOOKUP(A2, Products[Code], Products[Price])`, which grows automatically when you add products.
- Lookups to other workbooks work but break if files move; prefer keeping related data in one workbook.

## A complete example: an invoice that fills itself

| | A | B | C | D | E |
|---|---|---|---|---|---|
| 1 | Code | Product | Price | Qty | Amount |
| 2 | P004 | `=XLOOKUP(A2,Products!A:A,Products!B:B,"?")` → Cooking oil 1L | `=XLOOKUP(A2,Products!A:A,Products!C:C,0)` → 320 | 2 | `=C2*D2` → 640 |
| 3 | P001 | → Unga 2kg | → 180 | 3 | → 540 |
| 8 | | | | Total | `=SUM(E2:E7)` → 1,180 |

Type a code and quantity; name, price and amount fill in automatically.

## Practice tasks

1. Create the Products price list and a sales sheet that fills product names and prices with VLOOKUP (exact match).
2. Rebuild the same with XLOOKUP and with INDEX/MATCH.
3. Create a commission band table and calculate each salesperson's rate with approximate match.
4. Replace a nested IF grading formula with a VLOOKUP band table.
5. Create a deliberate #N/A (a code with a trailing space) and fix it with TRIM; then add IFNA.

## Summary

- Lookups return information from tables automatically.
- `VLOOKUP(value, table, col, FALSE)` for exact matches; the lookup column must be first; lock the table with `$`.
- Approximate match (`TRUE` or XLOOKUP match_mode -1) suits sorted band tables (commission, grades, tax).
- HLOOKUP works across rows.
- XLOOKUP is the modern, safer, more flexible choice; INDEX/MATCH works everywhere and can look left.
- Use IFERROR/IFNA for friendly messages; fix #N/A by checking spaces, text vs numbers, exact match and ranges.

```quiz
Q: What should the fourth argument of VLOOKUP be for an exact match?
A: FALSE | false | 0
Q: In VLOOKUP, which column of the table must contain the lookup values?
A: first | the first | 1
Q: Which key locks a range with dollar signs?
A: F4
Q: Which modern function can look left and has an if-not-found argument?
A: XLOOKUP
Q: Which function returns the position of a value in a list?
A: MATCH
Q: Which error appears when a lookup value isn't found?
A: #N/A | N/A
Q: For approximate match, how must the band table be sorted?
A: ascending | smallest to largest
Q: Which function removes extra spaces that break lookups?
A: TRIM
```
