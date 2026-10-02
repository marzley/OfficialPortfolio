---
slug: basics
title: "Excel and Google Sheets basics: the interface, data entry, formatting and working efficiently"
after: KEEP
---
# Excel and Google Sheets basics: the interface, data entry, formatting and working efficiently

Excel is the computer skill employers in Kenya ask for most often, from banks, SACCOs and NGOs to supermarkets, schools and county offices. It's used for records, budgets, reports, payroll, stock, marks, data analysis and dashboards. This first unit builds a solid foundation: the interface, entering and editing data efficiently, formatting numbers properly, managing sheets, and keyboard shortcuts that make you fast. Everything works in Google Sheets too (differences are noted).

:::note What you will learn
- Why Excel matters and who uses it
- The interface: ribbon, Name Box, formula bar, sheets, status bar
- Entering, editing and filling data quickly (AutoFill, Flash Fill)
- Data types: text, numbers, dates, and why "numbers stored as text" break formulas
- Number formats: currency, comma, percentage, dates, custom formats
- Rows, columns, sheets: inserting, deleting, hiding, freezing
- Navigation and selection shortcuts
- Good spreadsheet design habits
:::

## Why Excel?

- **Universal:** almost every organisation uses spreadsheets.
- **Powerful:** from simple totals to analysing hundreds of thousands of rows.
- **Valuable on a CV:** "Advanced Excel" (formulas, lookups, pivot tables, charts) is a frequent requirement for accounting, admin, data, HR, procurement, M&E and sales roles.
- **Freelance demand:** data cleaning, dashboards and spreadsheet automation are common paid jobs online.

| Who | Uses Excel for |
|---|---|
| Accountants, bookkeepers | Ledgers, reconciliations (bank and M-Pesa), financial statements |
| Shop and business owners | Sales, stock, expenses, profit |
| Teachers and school admins | Marks, rankings, fee balances, timetables |
| HR officers | Staff records, leave, payroll calculations |
| NGOs and researchers | Survey data, M&E indicators, reports |
| Chama officials | Contributions, loans, interest, dividends |
| Analysts | Dashboards, forecasts, pivot tables |

## The interface

| Part | Purpose |
|---|---|
| **Ribbon** | Tabs: Home (formatting), Insert (charts, tables), Page Layout, Formulas, Data (sort, filter, validation), Review, View |
| **Name Box** | Shows the selected cell address (e.g. `C5`); type an address and press Enter to jump there |
| **Formula bar** | Shows/edits the cell's real content (formula or value) |
| **Grid** | Columns A, B, C... (up to XFD: 16,384 columns) and rows 1, 2, 3... (over 1 million rows) |
| **Sheet tabs** | Worksheets at the bottom: rename, colour, move, add (+) |
| **Status bar** | Shows **Sum, Average, Count** of selected cells instantly |

:::tip Quick totals without formulas
Select a range of numbers and look at the **status bar**: Excel shows the Sum, Average and Count immediately. Right-click the status bar to add Min and Max.
:::

## Entering and editing data

| Action | How |
|---|---|
| Confirm and move down / right | `Enter` / `Tab` |
| Edit a cell | Double-click, `F2`, or the formula bar |
| Cancel editing | `Esc` |
| New line inside a cell | `Alt+Enter` |
| Fill the same value into many cells | Select cells, type, press `Ctrl+Enter` |
| Copy cell above | `Ctrl+D` (fill down); `Ctrl+R` fills right |
| Undo / redo | `Ctrl+Z` / `Ctrl+Y` |
| Today's date / current time | `Ctrl+;` / `Ctrl+Shift+;` |

### AutoFill

Drag the **fill handle** (small square at the bottom-right of the selection) to continue patterns:
- `Mon` → Tue, Wed...; `January` → February...; `Term 1` → Term 2...
- `1, 2` (select both) → 3, 4, 5...; `5, 10` → 15, 20...
- Formulas copy with adjusted references.
- **Double-click** the fill handle to fill down as far as the adjacent column has data.

### Flash Fill (Excel)

Excel learns a pattern from your example (`Ctrl+E`):

| Full name | First name |
|---|---|
| Wanjiku Kamau | **Wanjiku** (type this one) |
| Brian Otieno | → Ctrl+E fills "Brian" |
| Amina Hassan | → "Amina" |

Great for splitting names, extracting codes, combining columns or reformatting phone numbers. (Google Sheets offers "Smart Fill" suggestions.)

## Data types

| Type | Default alignment | Example |
|---|---|---|
| **Text** | Left | `Unga 2kg`, `0712345678` (as text) |
| **Number** | Right | `180`, `0.16`, `1250.5` |
| **Date/time** | Right | `02/10/2026`, `14:30` (stored as numbers behind the scenes) |
| **Boolean** | Centre | `TRUE`, `FALSE` |
| **Error** | Centre | `#DIV/0!`, `#N/A` |

### Numbers stored as text (a very common problem)

Data copied from websites, systems or CSV files often contains numbers stored as **text**: they align left, show a small green triangle, and `SUM` ignores them.

Fixes:
- Select → click the warning icon → **Convert to Number**.
- **Data → Text to Columns → Finish** (converts a whole column).
- Multiply by 1 or use `=VALUE(A2)`.
- Remove spaces or "KSh" text with Find & Replace (`Ctrl+H`).

### Dates are numbers

Excel stores dates as serial numbers (days since 1 January 1900), which is why you can subtract them (`=B2-A2` gives days between dates). If a date shows as a number like `46297`, apply a date format. Make sure dates are recognised as dates (right-aligned) and use your regional format consistently (day/month/year in Kenya).

## Number formatting

Formatting changes how a value **looks**, not the value itself. **Home → Number** group, or `Ctrl+1` (Format Cells).

| Format | Shows | Shortcut |
|---|---|---|
| General | As typed | `Ctrl+Shift+~` |
| Number with comma | 1,250.00 | `Ctrl+Shift+!` |
| Currency/Accounting | KSh 1,250.00 (choose the KES symbol) | |
| Percentage | 16% | `Ctrl+Shift+%` |
| Short/long date | 02/10/2026 / Friday, 2 October 2026 | `Ctrl+Shift+#` |
| Text | Keeps leading zeros (phone numbers, IDs) | |

### Custom formats

Format Cells → **Custom**:
- `"KSh "#,##0` → KSh 12,500
- `#,##0.00;[Red]-#,##0.00` → negatives in red
- `0000` → 0045 (fixed digits for codes)
- `dd-mmm-yyyy` → 02-Oct-2026

:::warning Don't type units into numbers
Typing `KSh 180` or `180/-` makes the cell **text** and breaks formulas. Type `180` and use a currency or custom format.
:::

## Formatting for readability

- **Bold header row** with fill colour; **wrap text** for long headers.
- **AutoFit** columns: double-click the boundary between column letters (or select all and double-click).
- **Borders** for printed tables.
- **Alignment:** text left, numbers right, headers centred.
- **Cell styles** (Home → Cell Styles) for consistent headings, totals, inputs.
- **Format as Table** (`Ctrl+T`): instant banded rows, filters and structured references (covered in the Tables lesson).

## Rows, columns and sheets

| Task | How |
|---|---|
| Select a column/row | Click its letter/number; `Ctrl+Space` / `Shift+Space` |
| Insert row/column | Right-click header → Insert; `Ctrl+Shift++` |
| Delete row/column | Right-click → Delete; `Ctrl+-` |
| Hide/unhide | Right-click → Hide / Unhide |
| Resize | Drag the boundary, or AutoFit |
| Freeze headers | View → Freeze Panes → Freeze Top Row (or freeze at a selected cell for rows and columns) |
| New sheet | `+` beside the tabs; `Shift+F11` |
| Rename sheet | Double-click the tab |
| Move/copy sheet | Drag the tab (hold `Ctrl` to copy), or right-click → Move or Copy |
| Switch sheets | `Ctrl+PgUp` / `Ctrl+PgDn` |

## Navigation and selection shortcuts

| Shortcut | Does |
|---|---|
| `Ctrl+Arrow` | Jump to the edge of the data |
| `Ctrl+Shift+Arrow` | Select to the edge of the data |
| `Ctrl+Home` / `Ctrl+End` | Go to A1 / the last used cell |
| `Ctrl+A` | Select the current data region (press again for the whole sheet) |
| `Ctrl+G` or `F5` | Go To (a cell or named range) |
| `Ctrl+F` / `Ctrl+H` | Find / Replace |
| `Ctrl+1` | Format Cells |
| `Alt` | Shows key tips for every ribbon command |

Using these daily is what makes people "fast in Excel".

## Good spreadsheet design habits

1. **One table per sheet** (or clearly separated), starting at A1, with **one header row**.
2. **One record per row, one type of data per column** (don't mix dates and text in a column).
3. **No blank rows or columns** inside data; no merged cells in data tables (they break sorting and filtering).
4. **Inputs separate from calculations:** put rates (VAT 16%, commission 5%) in labelled cells and reference them.
5. **Consistent formats** (dates, currency).
6. **Name sheets clearly** ("Sales Jan 2026", "Summary").
7. **Document assumptions** with notes or a "Read me" sheet.
8. **Save versions** and back up (OneDrive/Google Drive).

:::think A colleague's sales sheet has the title in merged cells across A1:F1, blank rows between each week, and prices typed like "KSh 1,500". Why will sorting, filtering and SUM give problems, and how would you fix it?
Merged cells and blank rows stop Excel from recognising the table as one continuous range, so sorting/filtering break or miss rows. Prices typed with "KSh" are text, so SUM ignores them. Fix: put the title above (or remove the merge), delete blank rows, make one header row, convert prices to real numbers (Find & Replace "KSh " with nothing, then Convert to Number) and apply a currency format.
:::

## Excel vs Google Sheets: quick differences

| Feature | Excel | Google Sheets |
|---|---|---|
| Works offline | Yes | Limited (offline mode) |
| Collaboration | Via OneDrive/SharePoint | Excellent, real-time, free |
| Saving | Manual/AutoSave | Automatic |
| Advanced features | Power Query, Power Pivot, more chart types | Simpler, some unique functions (`GOOGLEFINANCE`, `IMPORTRANGE`, `QUERY`) |
| Cost | Paid (Microsoft 365) | Free |

## Practice tasks

1. Create a sheet of 15 products with columns: Code, Product, Category, Price, Stock. Format prices as KSh with commas.
2. Use AutoFill to create a list of 12 months and a numbered list 1–50.
3. Use Flash Fill to split 10 full names into first and last names.
4. Paste numbers stored as text (e.g. from a website) and convert them to real numbers.
5. Freeze the header row, rename the sheet, and practise `Ctrl+Arrow` navigation.

## Summary

- Excel is essential for records, analysis and reports across Kenyan workplaces; Google Sheets is a free, collaborative alternative.
- Know the interface: ribbon, Name Box, formula bar, sheet tabs, status bar (quick Sum/Average/Count).
- Enter data quickly with Enter/Tab, `Ctrl+Enter`, AutoFill and Flash Fill (`Ctrl+E`).
- Understand data types; fix numbers stored as text; dates are numbers.
- Format numbers (comma, currency, percentage, dates, custom) without typing units.
- Manage rows, columns and sheets; freeze panes; use navigation shortcuts.
- Design clean tables: one header row, no blank rows or merged cells, inputs separate from calculations.

```quiz
Q: Which shortcut opens the Format Cells dialog?
A: Ctrl+1 | ctrl 1
Q: Which shortcut triggers Flash Fill in Excel?
A: Ctrl+E | ctrl e
Q: Which shortcut adds a new line inside a cell?
A: Alt+Enter | alt enter
Q: Where can you see the sum of selected cells without a formula? (two words)
A: status bar
Q: Numbers stored as text align to which side by default?
A: left
Q: Which shortcut enters today's date? Write like Ctrl+;.
A: Ctrl+; | ctrl ;
Q: Which View option keeps the header row visible when scrolling? (two words)
A: Freeze Panes | freeze top row
Q: Should you merge cells inside a data table you want to sort? (yes or no)
A: no
```
