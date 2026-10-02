---
slug: charts-pivots
title: "Charts and pivot tables: summarising thousands of rows and presenting results clearly"
after: KEEP
---
# Charts and pivot tables: summarising thousands of rows and presenting results clearly

Data is only useful when people can understand it. A table of 5,000 sales transactions means little to a manager; "Thika branch grew 18% this quarter, mostly from cooking oil" with a clear chart drives decisions. **Pivot tables** summarise large datasets in seconds without formulas, and **charts** show patterns at a glance. This unit teaches both step by step, plus slicers, pivot charts and simple dashboards.

:::note What you will learn
- Choosing the right chart for your message
- Creating, formatting and improving charts
- Preparing data for pivot tables
- Building pivot tables: rows, columns, values, filters
- Changing summaries (sum, count, average, % of total), grouping dates, sorting
- Refreshing pivots when data changes
- Slicers, timelines and pivot charts
- Building a simple dashboard
:::

## Part 1: Charts

### Choosing the right chart

| Your message | Chart type | Example |
|---|---|---|
| Compare categories | **Column** or **bar** chart | Sales by product, enrolment by school |
| Show a trend over time | **Line** chart | Monthly sales, daily temperatures |
| Parts of a whole (few parts) | **Pie** or **doughnut** (use sparingly) | Market share of 3–5 products |
| Compare parts across categories | **Stacked column** | Sales by product per branch |
| Relationship between two numbers | **Scatter** chart | Advertising spend vs sales |
| Distribution | **Histogram** | Spread of exam marks |
| Progress towards a target | **Bar with target line**, combo chart | Monthly target vs actual |

Rules of thumb:
- Use **bar** (horizontal) charts when category names are long.
- Avoid **3D** charts: they distort values.
- Use pie charts only for a few parts that add up to 100%.
- **Time goes left to right** on line and column charts.

### Creating a chart

1. Select the data, including headers (e.g. Month and Sales).
2. **Insert → Recommended Charts** (Excel suggests suitable types) or pick a chart type.
3. The chart appears; use **Chart Design** and **Format** tabs (or the `+` and brush icons beside the chart).

**Google Sheets:** select data → Insert → Chart → use the Chart editor panel.

### Making charts clear

| Element | Tip |
|---|---|
| **Chart title** | Say the message: "Saturday is our busiest day", not just "Sales" |
| **Axis titles** | Units: "Sales (KSh)", "Month" |
| **Data labels** | Show values on bars when there are few |
| **Legend** | Remove if only one series; place it where it's easy to read |
| **Gridlines** | Light or removed |
| **Colours** | One highlight colour for what matters, grey for the rest |
| **Axis start** | Column/bar charts should start at zero to avoid exaggeration |
| **Sort** | Sort categories (largest to smallest) for easier comparison |

### Useful chart features

- **Combo chart** (Insert → Combo): e.g. sales as columns and profit margin as a line on a secondary axis.
- **Sparklines** (Insert → Sparklines): tiny charts inside cells showing each row's trend.
- **Change chart type** (right-click), **Switch Row/Column** (Chart Design) to flip what's on the axis.
- **Move chart to its own sheet** (Chart Design → Move Chart) for printing.
- **Charts update automatically** when data changes; with Excel Tables, new rows are included automatically.

:::think A pie chart shows sales of 12 products, many with similar small slices. Why is it hard to read, and what's better?
Humans struggle to compare angles and many small similar slices, and 12 colours overwhelm the legend. A **sorted bar chart** (largest to smallest) makes differences obvious and labels easy to read.
:::

## Part 2: Pivot tables

### What is a pivot table?

:::define Pivot table
An interactive summary that groups and totals data by categories you choose (for example, total sales by branch and month) without writing formulas. You "pivot" by dragging fields to rearrange the summary.
:::

Questions a pivot table answers in seconds:
- Total sales by branch? By product? By month?
- Which salesperson sold the most?
- How many transactions per day of the week?
- Average order value per county?

### Prepare the data first

Pivot tables need a clean, flat table:

| Date | Branch | Salesperson | Product | Qty | Amount |
|---|---|---|---|---|---|
| 2026-07-01 | Thika | Wanjiku | Unga 2kg | 3 | 540 |
| 2026-07-01 | Ruiru | Otieno | Cooking oil 1L | 2 | 640 |
| ... | | | | | |

- One header row with unique names; no blank rows or columns; no merged cells.
- Each column holds one type of data; dates are real dates; amounts are numbers.
- Ideally convert it to an **Excel Table** (`Ctrl+T`) so new rows are included when you refresh.

### Create a pivot table

1. Click anywhere inside the data.
2. **Insert → PivotTable** → confirm the range → choose **New Worksheet** → OK.
3. The **PivotTable Fields** pane appears with your column names and four areas:

| Area | Purpose | Example |
|---|---|---|
| **Rows** | Categories down the side | Branch |
| **Columns** | Categories across the top | Month |
| **Values** | Numbers to summarise | Sum of Amount |
| **Filters** | Filter the whole report | Product |

4. Drag **Branch** to Rows and **Amount** to Values: instant total sales per branch.
5. Drag **Product** to Columns for a branch × product matrix.

**Google Sheets:** Insert → Pivot table → add Rows, Columns, Values, Filters in the editor.

### Changing how values are summarised

Click the field in Values → **Value Field Settings**:
- **Sum** (default for numbers), **Count** (number of transactions), **Average**, **Max**, **Min**.
- **Show Values As → % of Grand Total / % of Column Total / Running Total / Difference From** (e.g. month-on-month change).
- **Number Format** → set comma or currency format for the whole field.

### Grouping

- **Dates:** right-click a date in the pivot → **Group** → Months, Quarters, Years (Excel often groups automatically).
- **Numbers:** group ages or amounts into bands (e.g. 0–999, 1,000–4,999).
- **Text:** select items → right-click → Group (e.g. group branches into "Nairobi region" and "Central").

### Sorting and filtering

- Right-click → **Sort → Largest to Smallest** to rank branches or products.
- Use the dropdown on Row Labels for filters, or **Value Filters → Top 10** (e.g. top 5 products).

### Refreshing

Pivot tables **don't update automatically** when source data changes. Click inside the pivot → **PivotTable Analyze → Refresh** (or `Alt+F5`; **Refresh All** with `Ctrl+Alt+F5`). If you added rows outside the original range, change the data source (or use an Excel Table to avoid this).

### Drilling down

**Double-click** any number in a pivot table: Excel creates a new sheet listing the exact rows behind that number. Great for checking and explaining totals.

## Slicers, timelines and pivot charts

- **Slicers** (PivotTable Analyze → Insert Slicer): clickable buttons to filter by branch, product or salesperson. Very user-friendly for managers.
- **Timelines** (Insert Timeline): a date slider to filter by months/quarters/years.
- **Pivot charts** (PivotTable Analyze → PivotChart): charts linked to the pivot; they change when you filter or rearrange.
- Connect one slicer to several pivots (Slicer → Report Connections) to filter a whole dashboard at once.

## Building a simple dashboard

A **dashboard** is one sheet showing the key numbers and charts:

1. Clean data on a "Data" sheet (as an Excel Table).
2. Several pivot tables on a "Calc" sheet (sales by month, by branch, top products, transactions count).
3. Pivot charts and key numbers (total sales, average sale, best branch) on a "Dashboard" sheet.
4. Slicers for branch and product, connected to all pivots.
5. Clean formatting: titles that state insights, consistent colours, no gridlines (View → untick Gridlines).
6. Refresh All when new data arrives.

:::kenya Example dashboard questions for a Kenyan retailer
- Which branch sells most on weekends vs weekdays?
- Which products sell most in the last week of the month (salary week)?
- How much of revenue came through M-Pesa vs cash?
- Which month had the lowest sales, and why (school fees season, holidays)?
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Messy source data (blanks, merged cells, text numbers) | Clean data first |
| Forgetting to refresh | Refresh/Refresh All after data changes |
| New rows not included | Use an Excel Table as the source |
| Count instead of Sum (or vice versa) | Check Value Field Settings |
| 3D and cluttered charts | Simple 2D charts with clear titles |
| Pie charts with many slices | Sorted bar chart |
| Truncated axes exaggerating differences | Start bar/column axes at zero |

## Practice tasks

1. Create a dataset of 50+ sales rows (Date, Branch, Product, Qty, Amount) or download a sample dataset.
2. Make a pivot table of total sales by branch, sorted largest to smallest, with % of grand total.
3. Group dates by month and show branch × month totals.
4. Add slicers for Product and Branch and a pivot chart.
5. Build a one-page dashboard with three charts and two key numbers, with insight-based titles.

## Summary

- Choose charts by message: column/bar to compare, line for trends, pie only for few parts, scatter for relationships.
- Make charts clear: insight titles, axis titles, labels, minimal clutter, zero baseline for bars.
- Pivot tables summarise clean, flat data by dragging fields to Rows, Columns, Values and Filters.
- Change summaries (Sum, Count, Average, % of total), group dates, sort, filter, drill down by double-clicking.
- Refresh pivots after data changes; use Excel Tables as sources.
- Slicers, timelines and pivot charts make interactive dashboards.

```quiz
Q: Which chart type is best for showing a trend over time?
A: line | line chart
Q: Which chart type is best for comparing categories with long names?
A: bar | bar chart
Q: Which pivot table area holds the numbers to summarise?
A: Values
Q: Do pivot tables update automatically when the data changes? (yes or no)
A: no
Q: Which shortcut refreshes all pivot tables? Write like Ctrl+Alt+F5.
A: Ctrl+Alt+F5 | ctrl alt f5
Q: What do you double-click in a pivot to see the rows behind a number? (one word: the ...)
A: number | value | cell
Q: Which feature adds clickable filter buttons to pivot tables?
A: slicers | slicer
```
