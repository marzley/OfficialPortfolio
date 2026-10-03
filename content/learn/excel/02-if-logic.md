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

## Why logical functions matter

Logic turns a spreadsheet from a list of numbers into a tool that **makes decisions**: pass or fail, paid or owing, in stock or reorder, on time or late, bonus or no bonus. Teachers grade with IF, accountants flag overdue invoices, shopkeepers decide when to restock, HR checks eligibility for allowances. Combined with counting functions, logic answers questions like "how many students passed Maths?" or "how much did the Nakuru branch sell in March?"

## Comparison operators

| Operator | Meaning | Example |
|---|---|---|
| `=` | Equal to | `B2="Paid"` |
| `<>` | Not equal to | `B2<>"Paid"` |
| `>` / `<` | Greater / less than | `C2>1000` |
| `>=` / `<=` | At least / at most | `D2>=50` |

Text comparisons ignore case (`"paid"` equals `"Paid"`), but extra spaces matter: `"Paid "` with a trailing space is not equal to `"Paid"`. Clean data with TRIM first.

## IF with calculations

IF can return calculations, not just words:

```
=IF(B2>=10000, B2*0.05, 0)                 5% bonus only on sales of 10,000 or more
=IF(C2="Yes", B2*0.16, 0)                  VAT only when the item is VATable
=IF(D2="", "", D2-C2)                      leave blank until a date is entered
=IF(E2<=TODAY(), "Overdue", "Due in " & E2-TODAY() & " days")
```

The third formula is a common trick: it prevents ugly results (like negative numbers) in rows that haven't been filled yet.

## Real example: stock reorder alerts

| | A | B | C | D |
|---|---|---|---|---|
| 1 | Item | In stock | Reorder level | Action |
| 2 | Unga 2kg | 8 | 20 | `=IF(B2<=C2,"REORDER","OK")` |
| 3 | Sugar 1kg | 45 | 15 | |
| 4 | Soap | 0 | 10 | |

A better version distinguishes out of stock:

```
=IF(B2=0, "OUT OF STOCK", IF(B2<=C2, "Reorder", "OK"))
```

Add conditional formatting to colour "OUT OF STOCK" red and "Reorder" orange, and the sheet becomes a dashboard.

## AND/OR in real decisions

```
=IF(AND(B2>=50, C2>=50), "Promoted", "Repeat")              passed both subjects
=IF(OR(D2="Teacher", D2="Nurse"), "Eligible", "Not eligible")  either job qualifies
=IF(AND(E2>=18, E2<=35, F2="Kenyan"), "Youth fund eligible", "No")
=IF(NOT(G2="Paid"), "Send reminder", "")
```

Example eligibility rules here are illustrations; always use the actual rules of the programme you're working with.

## SWITCH: matching exact values

When you compare one cell to many fixed values, SWITCH is cleaner than nested IFs:

```
=SWITCH(B2, "NBO", "Nairobi", "MSA", "Mombasa", "KSM", "Kisumu", "Unknown branch")
=SWITCH(WEEKDAY(A2,2), 6, "Weekend", 7, "Weekend", "Weekday")
```

## Counting and summing with conditions: more examples

Suppose a sales table has Branch in column B, Product in C, Amount in D and Date in E:

```
=COUNTIF(B:B, "Nakuru")                               number of Nakuru sales
=COUNTIF(D:D, ">5000")                                sales above 5,000
=COUNTIF(C:C, "*unga*")                               product name contains "unga" (* is a wildcard)
=SUMIF(B:B, "Nakuru", D:D)                            total Nakuru sales
=SUMIFS(D:D, B:B, "Nakuru", C:C, "Sugar")             Nakuru sugar sales
=SUMIFS(D:D, E:E, ">="&DATE(2026,3,1), E:E, "<"&DATE(2026,4,1))   March sales
=AVERAGEIFS(D:D, B:B, "Thika")                        average Thika sale
=COUNTIFS(B:B, H2, C:C, I2)                           criteria taken from cells H2 and I2
=MAXIFS(D:D, B:B, "Eldoret")                          largest Eldoret sale
```

Notice `">="&DATE(...)`: comparison operators go inside quotes and are joined to values with `&`. Using cells for criteria (H2, I2) makes a flexible report where the user just types a branch name.

## A branch summary report

| | G | H | I |
|---|---|---|---|
| 1 | Branch | Sales count | Total (KSh) |
| 2 | Nakuru | `=COUNTIF($B:$B,G2)` | `=SUMIF($B:$B,G2,$D:$D)` |
| 3 | Thika | | |
| 4 | Eldoret | | |
| 5 | Total | `=SUM(H2:H4)` | `=SUM(I2:I4)` |

Fill the formulas down. Check: the total of the summary must equal `=SUM(D:D)`. Cross-checking totals catches missing branches and typos in branch names.

## Error handling beyond IFERROR

```
=IFERROR(B2/C2, 0)                        any error becomes 0
=IFNA(XLOOKUP(A2, Codes, Names), "Not found")   only #N/A is replaced
=IF(C2=0, "-", B2/C2)                     prevent the error in the first place
```

Use IFERROR carefully: it hides **every** error, including real mistakes like a misspelled range name. Prefer IFNA for lookups, or check the cause directly.

## Common mistakes

| Mistake | Fix |
|---|---|
| Text without quotes: `=IF(B2=Paid, ...)` | `=IF(B2="Paid", ...)` |
| Numbers in quotes: `=IF(B2>"50", ...)` | `=IF(B2>50, ...)` |
| Grades in the wrong order: checking `>=50` before `>=80` | Check the highest band first |
| `=COUNTIF(B:B, >5000)` | Put the condition in quotes: `">5000"` |
| Hidden spaces in "Paid " | `TRIM` the data or use data validation drop-downs |

## Practice

1. Build a fee tracker with Paid, Balance and a Status column showing "Cleared", "Partial" or "Not paid".
2. Make a branch summary with COUNTIF and SUMIF where the branch names are typed in cells.
3. Use SUMIFS to total sales for one product in one month.
4. Create a stock sheet that shows "OUT OF STOCK", "Reorder" or "OK".
5. Write a formula that gives a 5% bonus to staff who sold over 100,000 AND had zero complaints.

:::think A grading formula `=IF(B2>=50,"C",IF(B2>=65,"B",IF(B2>=80,"A","E")))` gives every passing student a C. Why?
IF stops at the first true condition. Any mark of 50 or more (including 85) is caught by `B2>=50` first and returns "C", so the B and A checks never run. Check from the highest band down: `=IF(B2>=80,"A",IF(B2>=65,"B",IF(B2>=50,"C","E")))`, or use IFS in the same order.
:::

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
Q: Which wildcard character matches any number of characters in COUNTIF?
A: * | asterisk
Q: Which function returns the largest value that meets conditions?
A: MAXIFS
Q: Which function replaces only #N/A errors?
A: IFNA
Q: Which function matches one value against a list of exact options without nesting IFs?
A: SWITCH
```
