---
slug: conditional-formatting-validation
title: Conditional formatting, data validation and protecting sheets
after: charts-pivots
---
# Conditional formatting, data validation and protecting sheets

Three tools that turn a spreadsheet into a reliable business tool: **conditional formatting** highlights what matters, **data validation** stops wrong entries, and **protection** stops accidents.

## Conditional formatting (Home → Conditional Formatting)

| Rule | Example use |
|---|---|
| **Highlight Cells Rules** → Greater Than / Less Than | Balances above 0 in red |
| Text that **Contains** | Any row marked "Overdue" |
| **Duplicate Values** | Repeated M-Pesa codes or admission numbers |
| **Top/Bottom Rules** | Top 10 students, bottom 10% sales |
| **Data Bars** | Bars inside cells showing size |
| **Color Scales** | Green (high) → red (low) marks |
| **Icon Sets** | ✓ ! ✗ traffic lights |

### Highlight a whole row with a formula

To colour the **entire row** of students who owe fees (balance in column D):

1. Select the data rows, e.g. `A2:E41`.
2. Conditional Formatting → **New Rule → Use a formula**.
3. Formula: `=$D2>0` (dollar before D locks the column; the row stays relative).
4. Choose a light red fill → OK.

More formula ideas:

```
=$E2="Not paid"                     status text
=$C2<TODAY()                        past-due dates
=AND($B2>=80, $F2="Form 4")         top Form 4 students
=MOD(ROW(),2)=0                     stripe every other row
```

Manage or delete rules in **Conditional Formatting → Manage Rules**.

## Data validation (Data → Data Validation)

Stop mistakes **at entry** instead of cleaning them later.

| Allow | Setting | Example |
|---|---|---|
| **List** | Source: `Paid,Partial,Not paid` or a range | A drop-down for Status |
| **Whole number** | between 0 and 100 | Marks |
| **Decimal** | greater than 0 | Prices |
| **Date** | between two dates | Dates in this term only |
| **Text length** | equal to 10 | Phone numbers |
| **Custom** | formula `=COUNTIF($A:$A,A2)=1` | No duplicate admission numbers |

Use the **Input Message** tab to show a hint when the cell is selected ("Enter 10 digits, e.g. 0712345678"), and the **Error Alert** tab for a clear message.

> Drop-down lists from a range: put the choices on a sheet named `Lists`, make them an Excel Table, and use it as the source. Adding a new choice updates every drop-down.

## Protecting sheets and workbooks

- **Unlock input cells first**: select cells people should edit → Ctrl + 1 → Protection → untick **Locked**.
- **Review → Protect Sheet**: everything else (formulas, headers) is now locked. Add a password if needed.
- **Review → Protect Workbook**: stops adding, deleting or renaming sheets.
- **File → Info → Protect Workbook → Encrypt with Password**: needed to open the file at all.

> Sheet protection prevents accidents, not determined attackers. For confidential data (salaries, IDs), use file encryption and share carefully.

## Putting it all together: a fee collection sheet

1. A Table with Student, Form, Fee, Paid, Balance (`=[@Fee]-[@Paid]`), Status (`=IF([@Balance]<=0,"Cleared","Owing")`).
2. **Data validation**: Form as a drop-down (Form 1–4), Paid as a decimal ≥ 0.
3. **Conditional formatting**: rows with Balance > 0 in light red; data bars on Paid.
4. Unlock only the Paid column, then **Protect Sheet** so formulas can't be overwritten.
5. A summary area with `COUNTIF`, `SUMIFS` and a chart of collections by form.

That's a tool a school bursar could use tomorrow.

```quiz
Q: Which feature changes a cell's colour automatically based on its value? (two words)
A: conditional formatting
Q: Which Data Validation "Allow" option creates a drop-down?
A: List
Q: In a formula rule =$D2>0, why is there a $ before D?
A: to lock the column | lock the column | locks the column
Q: Before protecting a sheet, which setting must you untick for input cells?
A: Locked
Q: Which rule type quickly finds repeated M-Pesa codes? (two words)
A: Duplicate Values | duplicates
```
