---
slug: data-analyst-roadmap
title: "Data analyst roadmap: Excel, SQL, Python, dashboards and your first role"
after: web-developer-roadmap
---
# Data analyst roadmap: Excel, SQL, Python, dashboards and your first role

A data analyst answers questions with data: *Which products sell best in which county? Why did sales drop in March? Which students are at risk of failing? Did our programme reach the people it was meant to reach?* They clean messy data, analyse it, and present the answer as clear tables, charts and dashboards that managers can act on.

In Kenya, analysts work in banks and SACCOs, telcos, insurance, retail and supermarkets, NGOs and research (monitoring and evaluation, "M&E"), county governments, logistics, health and fintech, and increasingly for international companies remotely.

:::tip You don't need to be a maths genius
You need **comfort** with numbers (percentages, averages, growth rates), curiosity, attention to detail, and the ability to explain findings in plain language. The tools do the heavy calculation.
:::

## The 8 stages

| Stage | Skill | Time (1–2 h/day) |
|---|---|---|
| 1 | Spreadsheets (Excel / Google Sheets) | 4–6 weeks |
| 2 | Basic statistics and thinking with data | 2–3 weeks (alongside) |
| 3 | SQL | 4–6 weeks |
| 4 | Data visualisation and dashboards (Power BI or Looker Studio) | 3–4 weeks |
| 5 | Python for data | 6–8 weeks |
| 6 | Projects | ongoing |
| 7 | Communication and presenting | ongoing |
| 8 | Portfolio and job search | 4+ weeks |

## Stage 1: Excel and Google Sheets

Excel is still the most used data tool in Kenyan offices. Many analyst job adverts list "advanced Excel" first.

Lessons, in order:
1. [Excel basics](./?track=excel&lesson=basics) and [formulas and cell references](./?track=excel&lesson=formulas-cell-references)
2. [Functions](./?track=excel&lesson=functions) (SUM, AVERAGE, COUNTIF, SUMIFS) and [IF logic](./?track=excel&lesson=if-logic-functions)
3. [Text and date functions](./?track=excel&lesson=text-date-functions): cleaning names, phone numbers and dates
4. [Sorting, filtering and tables](./?track=excel&lesson=sort-filter-tables)
5. [Lookups](./?track=excel&lesson=lookups): VLOOKUP, XLOOKUP, INDEX/MATCH
6. [Charts and pivot tables](./?track=excel&lesson=charts-pivots): the most important analyst skill in Excel
7. [Conditional formatting and data validation](./?track=excel&lesson=conditional-formatting-validation)
8. [Practical projects](./?track=excel&lesson=practical-projects)

**Checkpoint:** given a sales sheet with 5,000 rows, you can clean it, build a pivot table of sales by month and region, chart it, and write three findings in plain sentences.

## Stage 2: Statistics and thinking with data

You need these ideas, explained in practical terms:

| Concept | What it means in practice |
|---|---|
| Mean, median, mode | "Average" can mislead. Median income tells a fairer story than mean income when a few people earn a lot. |
| Percentages and growth | Month-on-month growth = (this month − last month) ÷ last month × 100 |
| Spread (range, standard deviation) | Are values close together or all over the place? |
| Distribution and outliers | One wrong entry (KSh 5,000,000 instead of 5,000) can wreck an average. Find and check outliers. |
| Correlation vs causation | Ice cream sales and drowning both rise in hot weather; one doesn't cause the other. |
| Sampling and bias | A survey of only Nairobi smartphone users doesn't represent all Kenyans. |

The hub doesn't have a full statistics subject yet. Free places to learn the basics: Khan Academy's statistics and probability course, and the statistics sections of Google's and Microsoft's free data courses. Practise each idea in Excel as you go.

**Checkpoint:** you can explain in one sentence why the median is sometimes better than the mean, and you can spot an outlier in a column.

## Stage 3: SQL

Most company data lives in databases. SQL lets you ask it questions directly.

Lessons:
1. [What a database is](./?track=sql&lesson=what-is-a-database)
2. [SELECT](./?track=sql&lesson=select), [WHERE and ORDER BY](./?track=sql&lesson=where-order)
3. [Functions and GROUP BY](./?track=sql&lesson=functions-group), [CASE, NULL and HAVING](./?track=sql&lesson=case-null-having)
4. [Text and date functions](./?track=sql&lesson=text-date-functions)
5. [JOINs](./?track=sql&lesson=joins) and [subqueries and views](./?track=sql&lesson=subqueries-views)
6. [Window functions](./?track=sql&lesson=window-functions): running totals, rankings, month-on-month change
7. [Project: sales report](./?track=sql&lesson=project-sales-report)
8. [SQL practice and interview questions](./?track=sql&lesson=sql-practice-interview)

Every SQL example on the hub runs live in your browser, so practise a lot.

**Checkpoint:** you can write "top 5 products by revenue per month with each month's growth" using GROUP BY and a window function.

## Stage 4: Dashboards (Power BI or Looker Studio)

A dashboard puts the key numbers and charts on one screen that updates when the data changes.

- **Power BI Desktop** (Microsoft) is free to download for Windows and very common in Kenyan corporates and NGOs. Microsoft Learn has free official Power BI learning paths, and the PL-300 exam is the matching certification.
- **Looker Studio** (Google) is free, runs in the browser and connects to Google Sheets: good if you are on a weaker laptop or a Mac.

What to learn: importing and cleaning data (Power Query), relationships between tables, measures (DAX basics such as SUM, CALCULATE, a year-to-date total), choosing the right chart, slicers and filters, and dashboard layout. The design ideas in [design principles](./?track=web-design&lesson=design-principles) apply to dashboards too: one message per chart, clear titles, consistent colours.

**Checkpoint:** a one-page dashboard with 3–4 headline numbers (KPIs), a trend chart, a breakdown chart and a filter, built from a dataset you cleaned yourself.

## Stage 5: Python for data

Python handles data too big or messy for Excel and automates repetitive reports.

Lessons:
1. [Python introduction](./?track=python&lesson=introduction) through [loops and lists](./?track=python&lesson=loops-lists) and [functions and dictionaries](./?track=python&lesson=functions-dicts)
2. [Files and errors](./?track=python&lesson=files-errors) and [CSV and JSON files](./?track=python&lesson=csv-json-files)
3. [Modules and the standard library](./?track=python&lesson=modules-stdlib), [dates and maths](./?track=python&lesson=dates-random-math)
4. [SQL from Python](./?track=sql&lesson=sql-from-code)
5. [Project: grade report](./?track=python&lesson=project-grade-report)
6. Then the data libraries: **pandas** (tables), **matplotlib** or **seaborn** (charts), in **Jupyter** or **Google Colab** (free, runs in the browser, no installation). The [data analysis project](./?track=projects&lesson=data-analysis-report) walks you through a full analysis with both plain Python and pandas.
7. Optional, next level: [how machine learning works](./?track=artificial-intelligence&lesson=how-machine-learning-works) and [build a classifier](./?track=artificial-intelligence&lesson=build-a-classifier).

**Checkpoint:** you can load a CSV in pandas, clean it, group it, chart it and export a summary table.

## Stage 6: Projects (the most important stage)

Build 3–4 projects on **real, public data**. Good Kenyan-relevant sources:
- **KNBS** (Kenya National Bureau of Statistics): census, economic surveys, consumer price index (CPI)
- **Central Bank of Kenya**: exchange rates, interest rates, mobile money statistics
- **Kaggle** and **Our World in Data**: thousands of clean datasets on every topic
- **World Bank Open Data**: Kenya development indicators
- Your own data (with permission): a chama's contributions, a small shop's sales book, a school's anonymised marks

Project ideas:
1. **Retail sales analysis**: which products, days and branches drive revenue ([data analysis project](./?track=projects&lesson=data-analysis-report)).
2. **Inflation tracker**: CPI trends for food, fuel and transport over 5 years, with a dashboard.
3. **School results analysis**: subject performance by class and term, students at risk.
4. **M-Pesa statement analyser**: categorise your own spending (never publish real personal data).
5. **Survey analysis**: design a Google Form, collect 50+ responses, clean and analyse them.

Each project should have: the question, the data source, cleaning steps, analysis, charts, **findings in plain English**, and recommendations.

## Stage 7: Communication

An analysis nobody understands is wasted. Practise:
- Writing a one-page summary: the question, 3 key findings, 1–2 recommendations.
- Presenting in 5 minutes: [PowerPoint charts and reports](./?track=powerpoint&lesson=charts-smartart-media) and [pitch decks and reports](./?track=powerpoint&lesson=pitch-decks-reports).
- Charts that tell the truth: axes starting at zero for bar charts, clear labels, no 3D pie charts.

## Stage 8: Portfolio and job search

- Put each project on GitHub (notebooks, SQL files, a README with the findings and a screenshot) and/or publish dashboards (Power BI public samples, Looker Studio share links, Tableau Public).
- Write a short LinkedIn post about each project's findings.
- Target titles: *data analyst, junior data analyst, M&E assistant/officer, reporting analyst, business intelligence analyst, data clerk* (a common way in).
- Prepare for tests: many employers give an Excel or SQL practical test. Use the [SQL interview practice](./?track=sql&lesson=sql-practice-interview).
- Certificates that can help (optional, not required): Google Data Analytics Professional Certificate (Coursera, paid but financial aid is available), Microsoft PL-300 (Power BI). Projects matter more than certificates.

See [Show your projects](./?track=projects&lesson=showcase-your-projects) for CV and GitHub tips.

:::warning Data ethics and the law
Kenya's **Data Protection Act (2019)** applies to personal data. Never publish real names, phone numbers, ID numbers or M-Pesa records in a portfolio. Anonymise data and get permission. See [data protection in Kenya](./?track=cybersecurity&lesson=data-protection-kenya).
:::

## Summary

- Order: Excel → statistics basics → SQL → dashboards → Python → projects → communication → portfolio.
- Pivot tables, SQL JOINs and GROUP BY, and one dashboard tool are the core job skills.
- Use real public data (KNBS, CBK, Kaggle) and write findings in plain language.
- Protect personal data; anonymise everything you publish.

```quiz
Q: Which Excel feature summarises thousands of rows by category in a few clicks? (two words)
A: pivot table | pivot tables | pivottable
Q: Which is less affected by a few extreme values: the mean or the median?
A: median | the median
Q: Which SQL clause groups rows so you can total each group? (two words)
A: GROUP BY
Q: Which Python library is the standard for working with tables of data?
A: pandas
Q: Which Kenyan law protects personal data? (name the act, without the year)
A: Data Protection Act | the Data Protection Act | DPA
```
