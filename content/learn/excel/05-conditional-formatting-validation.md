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

## Why formatting rules, validation and protection matter

A spreadsheet shared with a team gets typed into by many people, and mistakes multiply: a phone number typed into the amount column, "Nrb" instead of "Nairobi", a deleted formula, a fee balance that nobody notices is overdue. **Conditional formatting** makes problems visible instantly, **data validation** stops bad data being entered, and **protection** prevents accidental damage to formulas. Together they turn a fragile sheet into a reliable tool that schools, SACCOs, chamas, shops and offices can trust.

## Conditional formatting types and when to use them

| Rule type | Example use |
|---|---|
| Highlight Cells: Greater Than / Less Than | Balances above KSh 10,000 in red |
| Highlight Cells: Text that Contains | Rows containing "Pending" |
| Highlight Cells: A Date Occurring | Due dates in the next 7 days |
| Duplicate Values | Repeated M-Pesa codes or ID numbers |
| Top/Bottom Rules | Top 10 sellers, bottom 10% marks |
| Data Bars | Bar inside each cell showing size (sales comparison) |
| Colour Scales | Heat map: low marks red, high marks green |
| Icon Sets | Arrows or traffic lights for targets |
| Use a formula | Anything custom, including whole rows |

Use colour **meaningfully and sparingly**: if half the sheet is highlighted, nothing stands out. Add a short legend ("Red = overdue") and don't rely on colour alone for colour-blind users; combine with a status column.

## Formula rules: powerful examples

Select the data rows (for example A2:F200) and use **New Rule → Use a formula**. Write the formula for the **first row**; Excel applies it to every row:

```
=$F2="Overdue"                       whole row red when Status is Overdue
=$E2<TODAY()                         due date passed
=AND($E2>=TODAY(), $E2<=TODAY()+7)   due within the next week
=$D2>$C2                             spent more than the budget
=MOD(ROW(),2)=0                      shade every other row
=COUNTIF($B$2:$B$200,$B2)>1          duplicate customer in column B
=ISBLANK($C2)                        required field is empty
=$B2=$I$1                            highlight rows matching a search value typed in I1
```

The `$` before the column letter keeps the rule checking the same column as it moves across the row, while the row number changes for each row.

**Manage Rules** (Home → Conditional Formatting → Manage Rules) shows all rules, their order and their ranges. Rules higher in the list win; tick "Stop If True" to prevent lower rules applying.

## Data validation options in depth

| Allow | Example | Use |
|---|---|---|
| Whole number | Between 0 and 100 | Exam marks |
| Decimal | Greater than 0 | Amounts |
| List | `Paid,Partial,Unpaid` or `=Branches` | Drop-downs prevent spelling variations |
| Date | Between 1/1/2026 and 31/12/2026 | Dates within a financial year |
| Time | Between 08:00 and 18:00 | Opening hours |
| Text length | Equal to 10 | Phone numbers like 0712345678 |
| Custom | `=COUNTIF($B:$B,B2)=1` | No duplicate entries |

Useful custom validation formulas:

```
=COUNTIF($B:$B,B2)=1                    unique values only (e.g. admission numbers)
=AND(LEN(C2)=10, LEFT(C2,2)="07")       phone starting 07 with 10 digits (format column as Text)
=ISNUMBER(SEARCH("@",D2))               email must contain @
=E2<=TODAY()                            date can't be in the future
=F2<=G2                                 amount paid can't exceed the amount due
```

Use the **Input Message** tab to show a hint when the cell is selected ("Enter the 10-digit number, e.g. 0712345678") and the **Error Alert** tab for a clear message. Style "Stop" blocks entry; "Warning" and "Information" allow overriding.

Validation doesn't check data that is **pasted** over it or that existed before. Use **Data → Data Validation → Circle Invalid Data** to find existing problems.

## Dependent drop-downs

A second drop-down that changes based on the first (County → Sub-county):

1. Put sub-counties in columns with the county as header (Nairobi | Mombasa | Kisumu...).
2. Name each column range with the county name (Formulas → Create from Selection → Top row).
3. First drop-down: List with source `=Counties`.
4. Second drop-down: List with source `=INDIRECT(A2)`.

In Excel 365 you can instead use `=FILTER(SubCounties[Name], SubCounties[County]=A2)` in a helper area as the list source.

## Protection levels explained

| Level | How | Protects against |
|---|---|---|
| Lock formula cells | Unlock input cells (Format Cells → Protection → untick Locked), then Review → Protect Sheet | Accidentally typing over formulas |
| Allow some actions | Protect Sheet options: allow sorting, filtering, formatting | Keeps the sheet usable while protected |
| Allow Edit Ranges | Review → Allow Edit Ranges | Different people editing different areas |
| Protect Workbook structure | Review → Protect Workbook | Deleting, renaming or adding sheets |
| Encrypt with password | File → Info → Protect Workbook → Encrypt with Password | Anyone opening the file without the password |
| Mark as Final / Read-only recommended | File → Info | Discourages editing (not security) |

Important: sheet protection is about **preventing accidents**, not real security; it can be bypassed. For confidential data (salaries, medical records, ID numbers), use file encryption, store files in access-controlled locations (OneDrive/SharePoint/Google Drive permissions), and share only with people who need it, in line with Kenya's Data Protection Act. Keep passwords in a password manager: a lost encryption password usually means the file is lost.

## Building a professional input form sheet

1. Put inputs on the left in a clearly shaded colour (light yellow is a common convention for "type here").
2. Add data validation and input messages to every input cell.
3. Put calculated results in a different colour, locked.
4. Add conditional formatting for warnings (red when over budget).
5. Unlock input cells, protect the sheet (allow sorting and filtering if needed).
6. Test it as a user would: try typing wrong data, pasting, and deleting.

## Common mistakes

| Mistake | Fix |
|---|---|
| Formatting rule applied to a single cell, not copied correctly | Set "Applies to" to the whole range in Manage Rules |
| Formula rule without `$` before the column | `=$F2="Overdue"` |
| Validation removed by copy-paste | Paste values only (Ctrl+Alt+V), or protect the sheet |
| Protecting before unlocking input cells | Unlock inputs first, then protect |
| Forgetting the protection password | Store it in a password manager |

## Practice

1. Make a fee register where overdue rows turn red and fully paid rows turn green, based on a Status column.
2. Add a drop-down for Payment Method (M-Pesa, Bank, Cash) and validation that amounts are greater than 0.
3. Prevent duplicate admission numbers with custom validation.
4. Create County → Sub-county dependent drop-downs for three counties.
5. Lock all formulas, protect the sheet, and test that inputs still work.

:::think Data validation on the Amount column only allows numbers, but you still find text like "1,500/=" in some cells. How did it get there, and how do you find and prevent it?
Validation only checks values typed into a cell; values pasted over the cell (or entered before validation was added) bypass it, and pasting can even remove the rule. Use Circle Invalid Data to find them, clean them, and protect the sheet so only the input cells are editable, or train users to paste values only.
:::

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
Q: Which Data Validation tool marks existing entries that break the rules? (three words)
A: Circle Invalid Data
Q: Which function is used as the list source for a dependent drop-down based on named ranges?
A: INDIRECT
Q: Is sheet protection strong security for confidential data? (yes or no)
A: no
Q: Which conditional formatting type shows a coloured bar inside each cell? (two words)
A: data bars | data bar
```
