---
slug: practical-projects
title: "Practical Excel projects: budget, school marks, chama records, stock and invoices"
after: KEEP
---
# Practical Excel projects: budget, school marks, chama records, stock and invoices

The best way to master Excel is to build real things. This unit walks you through five complete projects used every day in Kenyan homes, schools, groups and businesses. Each project lists the sheet layout, the exact formulas, and checks to make sure it works. Build them yourself, then adapt them for your own life or for clients (these are exactly the kinds of spreadsheets freelancers get paid to create).

:::note Projects in this unit
1. Personal or family monthly budget
2. School marks sheet with grades, ranks and analysis
3. Chama contributions and loans register
4. Shop stock and sales tracker
5. Invoice that calculates itself
:::

Skills used: formulas, SUM, AVERAGE, IF/IFS, COUNTIF/SUMIF, XLOOKUP/VLOOKUP, absolute references, data validation, conditional formatting, tables and charts.

---

## Project 1: Monthly budget

**Goal:** plan income and expenses, compare with actual spending, and see the balance.

### Layout (sheet "Budget")

| | A | B | C | D | E |
|---|---|---|---|---|---|
| 1 | **Category** | **Type** | **Planned (KSh)** | **Actual (KSh)** | **Difference** |
| 2 | Salary | Income | 45,000 | 45,000 | `=D2-C2` |
| 3 | Side hustle | Income | 8,000 | 6,500 | `=D3-C3` |
| 4 | Rent | Expense | 12,000 | 12,000 | `=C4-D4` |
| 5 | Food | Expense | 10,000 | 11,800 | `=C5-D5` |
| 6 | Transport | Expense | 5,000 | 4,200 | `=C6-D6` |
| 7 | Electricity & water | Expense | 2,500 | 2,900 | `=C7-D7` |
| 8 | Data & airtime | Expense | 2,000 | 2,300 | `=C8-D8` |
| 9 | School fees savings | Expense | 6,000 | 6,000 | `=C9-D9` |
| 10 | Savings (MMF/SACCO) | Expense | 8,000 | 5,000 | `=C10-D10` |
| 11 | Emergency & other | Expense | 3,000 | 4,100 | `=C11-D11` |

(For income, a positive difference is good; for expenses, positive means you spent less than planned.)

### Summary formulas

| Label | Formula |
|---|---|
| Total income (planned) | `=SUMIF(B2:B11,"Income",C2:C11)` → 53,000 |
| Total income (actual) | `=SUMIF(B2:B11,"Income",D2:D11)` → 51,500 |
| Total expenses (planned) | `=SUMIF(B2:B11,"Expense",C2:C11)` → 48,500 |
| Total expenses (actual) | `=SUMIF(B2:B11,"Expense",D2:D11)` → 48,300 |
| Balance (actual) | `=actual income - actual expenses` → 3,200 |
| Savings rate | `=D10/actual income` (format %) |

### Improvements

- **Data validation** on column B: Data → Data Validation → List → `Income,Expense`, so entries are consistent.
- **Conditional formatting** on column E: red if negative (overspent), green if positive.
- A **bar chart** of planned vs actual expenses.
- One sheet per month (copy the sheet), plus a yearly summary using `=SUM(Jan:Dec!D5)` (3D reference across sheets).

---

## Project 2: School marks sheet

**Goal:** compute totals, averages, grades, ranks and subject analysis for a class.

### Layout

| | A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Adm No | Name | Maths | English | Kiswahili | Science | Total | Average | Grade |
| 2 | 4501 | Amina | 78 | 65 | 72 | 81 | `=SUM(C2:F2)` | `=AVERAGE(C2:F2)` | see below |

**Grade** using a band table (sheet "Grades", A2:B6: 0 E, 40 D, 50 C, 65 B, 80 A):

```
=VLOOKUP(H2, Grades!$A$2:$B$6, 2, TRUE)
```

or with IFS:

```
=IFS(H2>=80,"A",H2>=65,"B",H2>=50,"C",H2>=40,"D",TRUE,"E")
```

**Rank:** column J: `=RANK.EQ(G2, $G$2:$G$41, 0)`

**Remarks:** column K: `=IF(H2>=50,"Good work","Needs improvement")`

### Subject analysis (below the table)

| Measure | Maths formula (copy across) |
|---|---|
| Mean | `=AVERAGE(C2:C41)` |
| Highest | `=MAX(C2:C41)` |
| Lowest | `=MIN(C2:C41)` |
| Number passed (≥50) | `=COUNTIF(C2:C41,">=50")` |
| Pass rate | `=COUNTIF(C2:C41,">=50")/COUNT(C2:C41)` (format %) |
| Number of A's | `=COUNTIF($I$2:$I$41,"A")` (grade distribution) |

### Improvements

- Data validation: marks must be whole numbers between 0 and 100.
- Conditional formatting: highlight marks below 40 in red, top 5 averages in green (Top/Bottom rules).
- Sort by rank; freeze the header row and name column.
- A column chart of subject means.

---

## Project 3: Chama contributions and loans register

**Goal:** track monthly contributions, fines, loans and balances transparently.

### Sheet "Contributions"

| | A | B | C | D | ... | M | N | O |
|---|---|---|---|---|---|---|---|---|
| 1 | Member | Jan | Feb | Mar | ... | Dec | Total | Arrears |
| 2 | Achieng | 2,000 | 2,000 | 0 | | | `=SUM(B2:M2)` | `=COUNTIF(B2:M2,0)*$Q$1` |

Where `Q1` holds the monthly contribution amount (e.g. 2,000), so arrears = missed months × amount (use `COUNTBLANK` instead if unpaid months are left empty, but be consistent).

- Group total for a month: `=SUM(B2:B21)`.
- Members fully paid this month: `=COUNTIF(B2:B21,$Q$1)`.

### Sheet "Loans"

| | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| 1 | Member | Date issued | Principal | Rate (monthly) | Months | Total repayable | Repaid so far |
| 2 | Brian | 2026-03-01 | 20,000 | 1.5% | 6 | `=C2*(1+D2*E2)` (flat interest example) | |

- Balance: `=F2-G2`.
- Monthly instalment (flat): `=F2/E2`.
- Status: `=IF(G2>=F2,"Cleared","Active")`.
- Due date: `=EDATE(B2,E2)`.
- Overdue flag: `=IF(AND(TODAY()>EDATE(B2,E2), G2<F2),"OVERDUE","")`.

(Interest rules vary by chama; follow your group's constitution. Reducing-balance loans use `PMT`: `=PMT(rate, months, -principal)`.)

### Improvements

- Protect formula cells (Review → Protect Sheet) so only amounts can be edited.
- Share as view-only (Google Sheets) with members for transparency.
- A summary sheet: total savings, loans outstanding, interest earned.

---

## Project 4: Shop stock and sales tracker

**Goal:** know stock levels, reorder alerts and sales value.

### Sheet "Products" (as an Excel Table named Products)

| Code | Product | Cost price | Selling price | Opening stock | Reorder level |
|---|---|---|---|---|---|
| P001 | Unga 2kg | 150 | 180 | 50 | 15 |

### Sheet "Movements"

| Date | Code | Type | Qty |
|---|---|---|---|
| 2026-10-01 | P001 | Sale | 3 |
| 2026-10-01 | P001 | Purchase | 24 |

Data validation: Code from the Products list; Type from `Sale,Purchase`.

### Stock calculations (back on Products, extra columns)

- Purchased: `=SUMIFS(Movements[Qty], Movements[Code], [@Code], Movements[Type], "Purchase")`
- Sold: `=SUMIFS(Movements[Qty], Movements[Code], [@Code], Movements[Type], "Sale")`
- Current stock: `=[@[Opening stock]] + [@Purchased] - [@Sold]`
- Reorder?: `=IF([@[Current stock]]<=[@[Reorder level]], "REORDER", "")`
- Stock value at cost: `=[@[Current stock]]*[@[Cost price]]`
- Profit per unit: `=[@[Selling price]]-[@[Cost price]]`; margin: `=profit/selling price`

(`[@Code]` is Excel Table "structured reference" syntax meaning "Code in this row".)

### Improvements

- Conditional formatting: highlight REORDER rows in red.
- A pivot table of sales quantity by product and month.
- Sales value: add the selling price to Movements with XLOOKUP and multiply by quantity.

---

## Project 5: An invoice that calculates itself

### Layout (sheet "Invoice")

- Business details at the top (name, address, phone, KRA PIN, M-Pesa till/paybill).
- Client details, **invoice number**, **date** (`=TODAY()` or typed), **due date** (`=date+14`).
- Items table:

| Code | Description | Qty | Unit price | Amount |
|---|---|---|---|---|
| (typed) | `=IFERROR(XLOOKUP(A12,Products!A:A,Products!B:B),"")` | (typed) | `=IFERROR(XLOOKUP(A12,Products!A:A,Products!D:D),"")` | `=IF(C12="","",C12*D12)` |

- **Subtotal:** `=SUM(E12:E25)`
- **VAT (16%)** if VAT-registered: `=ROUND(subtotal*16%,0)` (or show VAT included); otherwise remove
- **Total:** `=subtotal+VAT`
- Payment instructions and thank-you note at the bottom.

### Improvements

- Set the **print area** and **Fit to 1 page**, then export to **PDF** for sending.
- Keep an "Invoice register" sheet listing invoice numbers, clients, amounts, paid/unpaid status and dates; use COUNTIF/SUMIF for unpaid totals.
- Note: VAT-registered businesses in Kenya must follow KRA's electronic tax invoice requirements (eTIMS); this spreadsheet is a learning project and quote/proforma tool, not a substitute for compliant systems.

:::think Why does Project 4 record every stock movement in a separate sheet instead of just changing the stock number on the Products sheet?
A movements log keeps a full history (who, when, how many), so you can calculate sales by period, find mistakes and audit stock. Overwriting a single stock number loses that history and makes errors impossible to trace. This "log + calculate" pattern is how real inventory systems work.
:::

## Checklist for every project

- [ ] Inputs separate from formulas; rates and settings in labelled cells
- [ ] Absolute references (`$`) where needed; formulas copied correctly
- [ ] Data validation for lists and number ranges
- [ ] Conditional formatting for warnings
- [ ] Totals cross-checked (e.g. sum of rows = sum of columns)
- [ ] Formula cells protected; file backed up
- [ ] Clear titles, frozen headers, print settings

## Summary

- Real projects combine formulas, functions, lookups, validation, conditional formatting, tables and charts.
- Budget: SUMIF by type, differences, conditional formatting, charts.
- Marks: totals, averages, band-table grades, RANK.EQ, COUNTIF analysis.
- Chama: contributions grid, arrears, loans with EDATE, PMT and status flags, protected sheets.
- Stock: products table + movements log + SUMIFS, reorder alerts, stock value.
- Invoice: XLOOKUP from a product list, totals, VAT, print to PDF, invoice register.

```quiz
Q: Which function totals only rows of type "Expense"?
A: SUMIF
Q: Which function gives a date a number of months after another date?
A: EDATE
Q: Which function calculates a loan instalment on a reducing balance?
A: PMT
Q: Which Excel feature restricts entries to a list like Income or Expense? (two words)
A: data validation
Q: Which feature colours overspent amounts red automatically? (two words)
A: conditional formatting
Q: Why keep a separate stock movements log? (one word: to keep ...)
A: history | records | audit
```
