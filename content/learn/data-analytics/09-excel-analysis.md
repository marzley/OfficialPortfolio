---
slug: excel-for-analysis
title: "Excel and Google Sheets for analysis: PivotTables, lookups, conditional formatting and charts"
after: data-cleaning
---
# Excel and Google Sheets for analysis: PivotTables, lookups, conditional formatting and charts

Excel is still the most-used analysis tool in Kenyan offices, from SACCOs to supermarkets to county governments. Master these features and you can answer most business questions in minutes.

:::note Basics first
If you're new to spreadsheets, start with the [Excel & Google Sheets](./?track=excel) subject. This lesson focuses on analysis.
:::

## 1. Format your data as a table

Select your data and press **Ctrl + T** (Format as Table). Benefits: filters on every column, formulas fill down automatically, and charts and PivotTables grow when you add rows.

**Golden rules for analysis-ready data:** one header row, one record per row, one type of value per column, no merged cells, no blank rows in the middle.

## 2. PivotTables: summaries in seconds

A PivotTable groups and totals data without formulas.

**Example:** sales data with columns Date, Branch, Product, Quantity, Amount.

1. Click inside the data → **Insert > PivotTable**.
2. Drag **Branch** to Rows.
3. Drag **Amount** to Values (it sums automatically).
4. Drag **Product** to Columns for a branch-by-product grid.
5. Drag **Date** to Rows and group by Months for trends.

| Question | PivotTable setup |
|---|---|
| Sales by branch | Rows: Branch; Values: Sum of Amount |
| Best products | Rows: Product; Values: Sum of Amount; sort descending |
| Monthly trend | Rows: Date (grouped by month); Values: Sum of Amount |
| Average order size | Values: Average of Amount |
| Number of orders | Values: Count of Amount |
| Share of total | Values: Show Values As > % of Grand Total |

Add **Slicers** (PivotTable Analyze > Insert Slicer) for clickable filters by branch or month.

## 3. Lookups: combining tables

**XLOOKUP** finds a value in one table and returns a matching value from another:

`=XLOOKUP(B2, Products[Code], Products[Price], "Not found")`

| Function | Use |
|---|---|
| `XLOOKUP` | Modern lookup (Excel 365/2021, Google Sheets) |
| `VLOOKUP` | Older lookup, still common in workplaces |
| `INDEX` + `MATCH` | Flexible lookup that works in older Excel |

## 4. Conditional totals and counts

| Formula | Example |
|---|---|
| `SUMIFS` | `=SUMIFS(Amount, Branch, "Thika", Month, "March")` |
| `COUNTIFS` | `=COUNTIFS(Status, "Paid", Branch, "Nyeri")` |
| `AVERAGEIFS` | `=AVERAGEIFS(Amount, Product, "Unga 2kg")` |
| `UNIQUE` / `FILTER` / `SORT` | Dynamic lists that update automatically (Excel 365, Google Sheets) |

## 5. Conditional formatting: make problems jump out

- **Highlight cells** below target in red (Home > Conditional Formatting > Highlight Cells Rules).
- **Data bars** inside cells for quick size comparisons.
- **Colour scales** for heatmaps (e.g. sales by branch and month).
- **Top 10** rules to spot best and worst performers.

## 6. Charts that answer questions

| Question | Chart |
|---|---|
| How did sales change over time? | Line chart |
| Which branch sold most? | Bar chart (sorted) |
| What share does each product have? | Bar chart (pie only for 2–4 parts) |
| Is there a relationship? | Scatter chart |

More in the [visualisation lesson](./?track=data-analytics&lesson=data-visualisation).

## 7. Analysis ToolPak and quick stats

Turn on File > Options > Add-ins > **Analysis ToolPak** for descriptive statistics, histograms, correlation and regression in a few clicks.

## Practice task

Download or create a sales sheet with 100+ rows (you can generate one with the Python code in the next lessons) and answer:
1. Total sales by branch and month (PivotTable).
2. Top 5 products by revenue.
3. Which branch is below its target? (conditional formatting)
4. One chart showing the monthly trend.

:::think Your manager sends a sheet with merged cells, subtotals in the middle and two header rows, and asks for a PivotTable. What do you do first?
Make a clean copy: one header row, unmerge cells and fill the values down, delete subtotal and blank rows, check each column has one data type, then format it as a table (Ctrl + T) and build the PivotTable from that.
:::

## Summary

- Format data as a table with one header row and one record per row.
- PivotTables summarise by any category in seconds; slicers add filters.
- XLOOKUP, SUMIFS and COUNTIFS combine and summarise data with formulas.
- Conditional formatting highlights problems; choose charts by the question.

```quiz
Q: Which keyboard shortcut formats data as a table in Excel? (write like Ctrl + T)
A: ctrl + t | ctrl+t | ctrlt
Q: Which modern Excel function looks up a value in another table? (one word)
A: xlookup
Q: Which Excel feature summarises data by category without formulas? (one word)
A: pivottable | pivot table | pivottables
```
