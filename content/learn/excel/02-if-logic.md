---
slug: if-logic-functions
title: IF, AND, OR, IFS and counting with conditions
after: functions
---
# IF, AND, OR, IFS and counting with conditions

Logical functions let a spreadsheet **make decisions**: pass or fail, paid or owing, in stock or reorder. They're behind most school mark sheets, fee trackers and stock sheets.

## IF

```
=IF(condition, value_if_true, value_if_false)
```

| Mark (B2) | Formula | Result |
|---|---|---|
| 67 | `=IF(B2>=50, "Pass", "Fail")` | Pass |
| 41 | `=IF(B2>=50, "Pass", "Fail")` | Fail |

Comparison operators: `=`, `<>` (not equal), `>`, `<`, `>=`, `<=`. Text in formulas goes in double quotes.

More examples:

```
=IF(D2>0, "Owing", "Cleared")                 fee balance status
=IF(C2<10, "Reorder", "")                     stock alert (blank if fine)
=IF(B2>=100000, B2*5%, 0)                     commission only above a target
```

## Several conditions: AND, OR, NOT

```
=IF(AND(B2>=50, C2>=50), "Promoted", "Repeat")        both subjects passed
=IF(OR(D2="Paid", E2="Scholarship"), "Allowed", "See bursar")
=IF(NOT(F2="Suspended"), "Active", "Suspended")
```

## Grading: nested IF vs IFS

Nested IF (works in every version):

```
=IF(B2>=80,"A",IF(B2>=65,"B",IF(B2>=50,"C",IF(B2>=40,"D","E"))))
```

**IFS** (Excel 2019/365 and Google Sheets) is easier to read:

```
=IFS(B2>=80,"A", B2>=65,"B", B2>=50,"C", B2>=40,"D", TRUE,"E")
```

Checks run in order; `TRUE` at the end acts as "everything else".

> Even cleaner for many bands: put the grade table in cells and use `XLOOKUP` or `VLOOKUP` with approximate match (see the Lookups lesson). Changing a cut-off then means editing one cell, not every formula.

## Counting and adding with conditions

| Function | Example | Answers |
|---|---|---|
| `COUNTIF(range, criteria)` | `=COUNTIF(C2:C41, "Pass")` | How many passed? |
| `COUNTIF` with numbers | `=COUNTIF(B2:B41, ">=80")` | How many scored 80+? |
| `SUMIF(range, criteria, sum_range)` | `=SUMIF(A2:A100, "Nairobi", D2:D100)` | Total sales in Nairobi |
| `AVERAGEIF` | `=AVERAGEIF(E2:E41, "Form 2", B2:B41)` | Form 2 mean |
| `COUNTIFS` (many conditions) | `=COUNTIFS(E2:E41,"Form 2", B2:B41,">=50")` | Form 2 students who passed |
| `SUMIFS` | `=SUMIFS(D:D, A:A,"Nairobi", B:B,"M-Pesa")` | Nairobi M-Pesa sales |
| `COUNTA` / `COUNTBLANK` | `=COUNTBLANK(D2:D41)` | How many haven't paid? |

Criteria with a cell: `=COUNTIF(B2:B41, ">="&H1)` uses the value in H1.

## Handling errors: IFERROR

```
=IFERROR(C2/B2, 0)                    0 instead of #DIV/0!
=IFERROR(XLOOKUP(A2, IDs, Names), "Not found")
```

Use it carefully: hiding errors can also hide real mistakes.

## Worked example: a fee tracker

| | A | B | C | D | E |
|---|---|---|---|---|---|
| 1 | Student | Fee | Paid | Balance | Status |
| 2 | Amina | 15000 | 15000 | `=B2-C2` | `=IF(D2<=0,"Cleared",IF(C2=0,"Not paid","Partial"))` |
| 3 | Brian | 15000 | 8000 | 7000 | Partial |
| 4 | Chebet | 15000 | 0 | 15000 | Not paid |

Summary cells:

```
Cleared students:   =COUNTIF(E2:E41,"Cleared")
Total collected:    =SUM(C2:C41)
Total outstanding:  =SUMIF(D2:D41,">0")
Collection rate:    =SUM(C2:C41)/SUM(B2:B41)    (format as %)
```

Add **conditional formatting** (a later lesson) to colour "Not paid" red.

```quiz
Q: What does =IF(B2>=50,"Pass","Fail") return when B2 is 49?
A: Fail
Q: Which function checks that two conditions are both true?
A: AND | AND()
Q: Which function counts cells that meet one condition?
A: COUNTIF | COUNTIF()
Q: Which function adds values that meet several conditions?
A: SUMIFS | SUMIFS()
Q: Which operator means "not equal" in Excel formulas?
A: <>
```
