---
slug: power-bi-dashboards
title: "Power BI: from raw data to an interactive dashboard (Power Query, data model, DAX)"
after: data-visualisation
---
# Power BI: from raw data to an interactive dashboard (Power Query, data model, DAX)

**Power BI** is Microsoft's business intelligence tool. Banks, telcos, NGOs, insurers and government agencies in Kenya use it to build dashboards that managers can click and filter. **Power BI Desktop** is free to download for Windows; sharing dashboards online inside an organisation usually needs a paid licence.

## The Power BI workflow

| Step | Where | What you do |
|---|---|---|
| 1. Get data | Home > Get Data | Connect to Excel, CSV, SQL databases, SharePoint, web |
| 2. Clean (transform) | **Power Query** editor | Remove columns, fix types, trim text, merge tables |
| 3. Model | Model view | Link tables with relationships |
| 4. Calculate | **DAX** measures | Totals, ratios, comparisons |
| 5. Visualise | Report view | Cards, charts, tables, slicers, maps |
| 6. Share | Publish | Power BI Service (online), PDF, PowerPoint |

## Step 2: Power Query

Power Query records every cleaning step (like the Excel version in lesson 8). Common steps:
- **Use first row as headers**
- **Change type** (text, whole number, date)
- **Trim** and **Clean** text
- **Remove duplicates** and **Remove rows** (blank, errors)
- **Merge queries** (like a JOIN) and **Append queries** (stack monthly files)
- **Unpivot columns** (turn month columns into rows)

Click **Close & Apply**. Next month, click **Refresh** and every step runs again on the new data.

## Step 3: the data model (star schema)

Good models have:
- One **fact table** with events and numbers (each sale: date, branch, product, amount)
- Several **dimension tables** describing things (Branches, Products, Dates)

Relationships connect them (Sales[BranchID] → Branches[BranchID]). This shape is called a **star schema**, and it makes reports fast and filters work correctly. Add a proper **Date table** so time comparisons work.

## Step 4: DAX measures

**DAX** (Data Analysis Expressions) is Power BI's formula language. Write **measures** for calculations:

```text
Total Revenue = SUM(Sales[Amount])

Orders = COUNTROWS(Sales)

Average Order = DIVIDE([Total Revenue], [Orders])

Thika Revenue = CALCULATE([Total Revenue], Branches[Name] = "Thika")

Revenue Last Month = CALCULATE([Total Revenue], DATEADD('Date'[Date], -1, MONTH))

Growth % = DIVIDE([Total Revenue] - [Revenue Last Month], [Revenue Last Month])
```

| DAX function | Use |
|---|---|
| `SUM`, `AVERAGE`, `COUNTROWS` | Basic totals |
| `DIVIDE` | Safe division (no error when dividing by zero) |
| `CALCULATE` | Change the filter for a calculation: the most important DAX function |
| `DATEADD`, `SAMEPERIODLASTYEAR`, `TOTALYTD` | Time intelligence |
| `RANKX` | Rankings |

**Measures vs calculated columns:** measures calculate on the fly for whatever is filtered (use them for totals and ratios); calculated columns add a value to every row (use them for categories).

## Step 5: build the report

A one-page sales dashboard:
1. **Cards:** Total Revenue, Orders, Average Order, Growth %.
2. **Line chart:** revenue by month.
3. **Bar chart:** revenue by branch (sorted).
4. **Bar chart:** top 10 products.
5. **Slicers:** date range, branch, category.
6. **Map:** revenue by county (if location matters).

Click any bar and the whole page filters: that interactivity is what managers love.

## Step 6: share it

- **Publish** to the Power BI Service and share with colleagues (requires licences in most organisations).
- Export to PDF or PowerPoint for meetings.
- Schedule refreshes so dashboards update automatically.

:::tip Practise and prove it
Rebuild a dashboard with open data (KNBS, World Bank, or a Kaggle dataset). Microsoft's **PL-300: Power BI Data Analyst** certification is widely recognised by employers. Free alternatives to practise: Looker Studio and Tableau Public.
:::

:::warning Don't publish private data
"Publish to web" makes a report public on the internet. Never use it for company, customer or personal data. Use secure sharing within your organisation.
:::

:::think A manager says the dashboard's "Growth %" shows a huge jump in January. When you check, December's data is only half-loaded. What should you do?
Fix the data first (complete the December load or exclude incomplete periods), add a "data up to" date on the dashboard, and consider a data-quality check that flags incomplete months, so managers don't act on misleading growth figures.
:::

## Summary

- Power BI: get data → Power Query → model → DAX → visuals → publish.
- Use a star schema: a fact table plus dimension tables and a Date table.
- DAX measures (SUM, DIVIDE, CALCULATE, time intelligence) power the numbers.
- Keep dashboards focused; never "publish to web" with private data.

```quiz
Q: Which Power BI editor is used to clean and transform data? (two words)
A: power query | powerquery
Q: What is Power BI's formula language called? (abbreviation)
A: dax
Q: Which DAX function changes the filter context of a calculation? (one word)
A: calculate
```
