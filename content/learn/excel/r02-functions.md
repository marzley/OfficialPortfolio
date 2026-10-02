---
slug: functions
title: "Essential functions: SUM, AVERAGE, COUNT, MIN, MAX, ROUND, IF, COUNTIF and SUMIF"
after: KEEP
---
# Essential functions: SUM, AVERAGE, COUNT, MIN, MAX, ROUND, IF, COUNTIF and SUMIF

Functions are what make spreadsheets powerful. Instead of adding 200 numbers by hand, you write `=SUM(B2:B201)`. Instead of checking each student's result, `=IF(C2>=50,"Pass","Fail")` decides for you. This unit teaches the essential functions every Excel user needs, how function syntax works, and practical examples from shops, schools, chamas and offices.

:::note What you will learn
- How functions work: name, brackets, arguments, ranges
- Inserting functions (typing, AutoSum, Insert Function)
- SUM, AVERAGE, MEDIAN, MIN, MAX, LARGE, SMALL
- COUNT, COUNTA, COUNTBLANK
- ROUND, ROUNDUP, ROUNDDOWN, INT
- IF basics and nested IF
- COUNTIF, SUMIF, AVERAGEIF and their -IFS versions
- RANK and percentage calculations
- Common errors and how to read them
:::

## How functions work

```
=SUM(B2:B10)
 │   │
 │   └ argument: the range B2 to B10
 └ function name
```

- Start with `=`, then the function name, then **arguments** in brackets.
- Separate arguments with **commas** (some regional settings use semicolons `;`).
- A **range** like `B2:B10` means "B2 through B10"; `B2:D10` is a rectangle.
- Non-adjacent ranges: `=SUM(B2:B10, D2:D10)`.

### Ways to insert functions

1. **Type** it: Excel suggests functions as you type and shows a tooltip with the arguments.
2. **AutoSum** (Home → Σ, or `Alt+=`): inserts SUM; its dropdown has Average, Count, Max, Min.
3. **Insert Function** (`fx` button or `Shift+F3`): search for a function and fill arguments in a dialog with explanations.

## Totals and averages

| Function | Does | Example |
|---|---|---|
| `SUM` | Adds numbers | `=SUM(D2:D31)` monthly sales |
| `AVERAGE` | Mean | `=AVERAGE(C2:C41)` class average |
| `MEDIAN` | Middle value (less affected by extremes) | `=MEDIAN(E2:E100)` typical salary |
| `MIN` / `MAX` | Smallest / largest | `=MAX(D2:D31)` best day |
| `LARGE(range, k)` | k-th largest | `=LARGE(C2:C41, 3)` third-highest mark |
| `SMALL(range, k)` | k-th smallest | `=SMALL(D2:D31, 1)` same as MIN |

Example: daily sales in `B2:B8`.

| | A | B |
|---|---|---|
| 1 | Day | Sales (KSh) |
| 2 | Mon | 12,400 |
| 3 | Tue | 9,850 |
| 4 | Wed | 15,200 |
| 5 | Thu | 11,000 |
| 6 | Fri | 18,600 |
| 7 | Sat | 22,300 |
| 8 | Sun | 7,500 |
| 10 | Total | `=SUM(B2:B8)` → 96,850 |
| 11 | Average | `=AVERAGE(B2:B8)` → 13,835.71 |
| 12 | Best day | `=MAX(B2:B8)` → 22,300 |
| 13 | Worst day | `=MIN(B2:B8)` → 7,500 |

:::tip AVERAGE ignores blanks but counts zeros
An empty cell is skipped by `AVERAGE`; a cell containing 0 is included. If a day had no sales recorded, decide whether to leave it blank (not included) or enter 0 (included and lowers the average).
:::

## Counting

| Function | Counts | Example |
|---|---|---|
| `COUNT` | Cells containing **numbers** | `=COUNT(C2:C41)` students with marks entered |
| `COUNTA` | **Non-empty** cells (any type) | `=COUNTA(A2:A41)` number of students listed |
| `COUNTBLANK` | Empty cells | `=COUNTBLANK(C2:C41)` missing marks |

## Rounding

| Function | Does | Example (A2 = 1234.567) |
|---|---|---|
| `ROUND(x, n)` | Rounds normally to n decimals | `=ROUND(A2, 2)` → 1234.57; `=ROUND(A2, 0)` → 1235; `=ROUND(A2, -2)` → 1200 |
| `ROUNDUP(x, n)` | Always up | `=ROUNDUP(A2, 0)` → 1235 |
| `ROUNDDOWN(x, n)` | Always down | `=ROUNDDOWN(A2, 0)` → 1234 |
| `INT(x)` | Down to the whole number | `=INT(A2)` → 1234 |
| `MROUND(x, m)` | To the nearest multiple | `=MROUND(1237, 5)` → 1235 |

Formatting a cell to show 2 decimals only changes the **display**; `ROUND` changes the **value** (important for totals that must match receipts).

Example: number of buses needed for 130 people with 33 seats: `=ROUNDUP(130/33, 0)` → 4.

## IF: making decisions

```
=IF(logical_test, value_if_true, value_if_false)
=IF(C2>=50, "Pass", "Fail")
```

Comparison operators: `=`, `<>` (not equal), `>`, `<`, `>=`, `<=`. Text must be in **double quotes**.

| Example | Meaning |
|---|---|
| `=IF(B2>=2000, 0, 150)` | Free delivery for orders of KSh 2,000+, otherwise 150 |
| `=IF(D2="", "Missing", "OK")` | Flag empty cells |
| `=IF(E2>F2, "Over budget", "Within budget")` | Compare actual and budget |
| `=IF(C2>=50, C2*0.1, 0)` | Bonus 10% only if sales ≥ 50 units |

### Nested IF (several outcomes)

Grades from marks in `C2`:

```
=IF(C2>=80,"A",IF(C2>=65,"B",IF(C2>=50,"C",IF(C2>=40,"D","E"))))
```

Excel checks in order; put the **highest threshold first**. Newer Excel and Google Sheets have **IFS**, which is easier to read:

```
=IFS(C2>=80,"A", C2>=65,"B", C2>=50,"C", C2>=40,"D", TRUE,"E")
```

(The IF/AND/OR lesson goes deeper.)

## Conditional counting and summing

### COUNTIF and SUMIF

| Function | Syntax | Example |
|---|---|---|
| `COUNTIF` | `=COUNTIF(range, criteria)` | `=COUNTIF(C2:C41, ">=50")` students who passed |
| `SUMIF` | `=SUMIF(range, criteria, sum_range)` | `=SUMIF(B2:B100, "Unga", D2:D100)` total Unga sales |
| `AVERAGEIF` | `=AVERAGEIF(range, criteria, avg_range)` | `=AVERAGEIF(B2:B41, "Grade 9A", C2:C41)` 9A's average |

Criteria examples: `"Unga"` (exact text), `">=50"`, `"<>Paid"` (not "Paid"), `"*kg*"` (contains "kg", `*` is a wildcard), or a cell reference like `F2` or `">="&F2`.

### COUNTIFS and SUMIFS (several conditions)

```
=COUNTIFS(B2:B100, "Thika", D2:D100, ">10000")
    → number of Thika sales above KSh 10,000

=SUMIFS(E2:E100, B2:B100, "Thika", C2:C100, "Unga")
    → total Unga sales in Thika
```

Note: in `SUMIFS` the **sum range comes first**; in `SUMIF` it comes last.

### Example: a chama contributions summary

| | A | B | C |
|---|---|---|---|
| 1 | Member | Month | Amount |
| 2 | Achieng | Jan | 2,000 |
| 3 | Brian | Jan | 2,000 |
| 4 | Achieng | Feb | 2,000 |
| 5 | Chebet | Jan | 1,000 |
| 6 | Brian | Feb | 0 |

- Achieng's total: `=SUMIF(A2:A6, "Achieng", C2:C6)` → 4,000
- January total: `=SUMIF(B2:B6, "Jan", C2:C6)` → 5,000
- Number of missed contributions: `=COUNTIF(C2:C6, 0)` → 1

## RANK and percentages

- **Rank** a student among the class: `=RANK.EQ(C2, $C$2:$C$41, 0)` (0 = highest gets rank 1). The `$` signs keep the range fixed when copying (absolute reference).
- **Percentage of total:** `=B2/$B$10` formatted as %.
- **Percentage change:** `=(New-Old)/Old`, e.g. `=(C2-B2)/B2` formatted as % (sales growth).
- **Add VAT 16%:** `=B2*1.16`; VAT included in a price: `=B2*16/116`.

## Combining functions

Functions can go inside other functions:

```
=ROUND(AVERAGE(C2:C41), 1)                  average rounded to 1 decimal
=IF(SUM(D2:D8)>=100000, "Target met", "Below target")
=COUNTIF(C2:C41, ">="&AVERAGE(C2:C41))      students above the class average
```

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `#NAME?` | Misspelled function or text without quotes | Check spelling; put text in "quotes" |
| `#VALUE!` | Wrong type (text where a number is needed) | Clean data; convert text to numbers |
| `#DIV/0!` | Division by zero or blank | Check data; `=IFERROR(A2/B2, 0)` |
| `#REF!` | Reference to deleted cells | Fix the formula |
| `#N/A` | Value not found (lookups) | Check lookup values (see the lookups lesson) |
| `#NUM!` | Impossible number (e.g. LARGE k bigger than count) | Check arguments |
| Circular reference warning | A formula refers to its own cell | Point the formula to other cells |

Use **Formulas → Evaluate Formula** to step through a complex formula, and **Trace Precedents** to see which cells feed a formula.

:::think A teacher writes =AVERAGE(C2:C41) but some students who were absent have "ABS" typed in their mark cells. What happens, and is that what the teacher wants?
`AVERAGE` ignores text, so "ABS" cells are skipped: the average is of students who sat the exam, which is usually correct. But `COUNT` won't count them either, so use `COUNTA` for the number of students and `COUNTIF(C2:C41,"ABS")` to count absentees. Be careful not to type 0 for absent students unless you want them to lower the average.
:::

## Practice tasks

1. Enter a week's sales and calculate total, average, highest, lowest and median.
2. Enter 15 students' marks: calculate grade with nested IF (or IFS), class rank with RANK.EQ, and pass count with COUNTIF.
3. Create a chama table and use SUMIF to get each member's total and COUNTIF for missed months.
4. Use SUMIFS to total sales of one product in one branch.
5. Calculate 16% VAT on prices and round to whole shillings.

## Summary

- Functions: `=NAME(arguments)`; insert by typing, AutoSum (`Alt+=`) or Insert Function (`Shift+F3`).
- Totals and stats: SUM, AVERAGE, MEDIAN, MIN, MAX, LARGE, SMALL; counting: COUNT, COUNTA, COUNTBLANK.
- Rounding changes values: ROUND, ROUNDUP, ROUNDDOWN, INT, MROUND.
- IF chooses outcomes; nested IF or IFS for several grades.
- COUNTIF/SUMIF/AVERAGEIF and the -IFS versions handle conditions (wildcards `*`, operators in quotes).
- RANK.EQ, percentages and combining functions; read errors and use Evaluate Formula.

```quiz
Q: Which shortcut inserts AutoSum? Write like Alt+=.
A: Alt+= | alt =
Q: Which function counts non-empty cells?
A: COUNTA
Q: Which function counts only cells containing numbers?
A: COUNT
Q: What does =ROUNDUP(130/33, 0) give?
A: 4
Q: Which function totals values that meet one condition?
A: SUMIF
Q: In SUMIFS, does the sum range come first or last?
A: first
Q: Which wildcard character means "any number of characters" in COUNTIF criteria?
A: * | asterisk
Q: Which error appears when a function name is misspelled?
A: #NAME? | NAME
```
