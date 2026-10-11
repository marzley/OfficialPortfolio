---
slug: best-ai-for-data-spreadsheets
title: "Best AI for data and spreadsheets: Excel, Google Sheets, charts and analysis"
after: best-ai-for-presentations-documents
---
# Best AI for data and spreadsheets: Excel, Google Sheets, charts and analysis

Spreadsheets run businesses, schools, SACCOs and chamas. AI can write formulas, clean messy data, analyse sales and suggest charts, even if you're not a data expert. But numbers must be **right**, so checking is part of the job.

## The best tools by job

| Job | Best tools | Notes |
|---|---|---|
| **Write and explain formulas** | Chat assistants, **Copilot in Excel**, **Gemini in Google Sheets** | Describe what you want in plain English |
| **Analyse a file (CSV/Excel)** | ChatGPT, Claude and Gemini (upload a file), **Julius** | They can run calculations and make charts from your data |
| **Clean messy data** | Excel's own tools (Flash Fill, Power Query) + AI for instructions | Keep a copy of the original |
| **Dashboards and reports** | **Power BI** (with Copilot), Looker Studio, Excel charts | AI can suggest visuals and write summaries |
| **Learn data skills** | This hub's Excel, SQL and Python subjects | Knowing the basics makes you a far better AI user |

## Formulas in plain English

```text
In Excel, column A has customer names, column B the amount paid and column C the date.
Write a formula to total payments for "Wanjiku" in March 2026 only. Explain how it works.
```

```text
Explain this formula step by step in simple words: =IFERROR(XLOOKUP(E2,A:A,C:C),"Not found")
```

Always test the formula on a few rows where you know the right answer.

## Analysing data with AI (safely)

1. **Remove private details** first: names, phone numbers, ID numbers. Replace with codes (Customer 1, Customer 2).
2. **Upload the file** to a chat assistant that can analyse data, or paste a small sample.
3. **Ask specific questions:**
```text
This file has daily sales for my shop (date, item, quantity, price).
1) Total sales by month, 2) top 5 items by revenue, 3) best day of the week,
4) a simple bar chart of monthly sales. Show the calculations you used.
```
4. **Check a few results by hand** or with a PivotTable.
5. **Ask what it assumed:** "Did you drop any rows? How did you treat blanks?"

## Cleaning messy data

```text
I have a column of Kenyan phone numbers written in different ways: 0712 345 678, +254712345678, 712345678.
Give me an Excel formula to convert them all to the format 2547XXXXXXXX.
```

## Common AI data mistakes

| Mistake | How to catch it |
|---|---|
| Silently skipping rows with blanks or text | Compare row counts before and after |
| Wrong date format (day/month confused) | Check a few dates you know |
| Summing a column that includes a total row | Look at the last rows of your data |
| Made-up numbers when it can't read the file | Ask it to show the first rows it read |

:::warning Private data
Customer lists, M-Pesa statements, salaries and student records are personal data under Kenya's Data Protection Act. Don't upload them to AI tools without permission and a lawful reason. Anonymise first.
:::

:::tip Build real skills
AI is a multiplier: the more you know, the more it helps. Learn [Excel](./?track=excel), [SQL](./?track=sql) and see the [data analyst roadmap](./?track=career-roadmaps&lesson=data-analyst-roadmap).
:::

:::think A chama treasurer asks AI to total a year of contributions from an uploaded file. The total looks lower than expected. What should they check?
Whether the AI read all the rows (ask for the row count and first/last rows), whether blank or text cells (like "KSh 500" written as text) were skipped, whether dates were read correctly, and whether any months are missing. Recalculate with a SUM or PivotTable in Excel to confirm.
:::

## Summary

- Chat assistants, Copilot in Excel and Gemini in Sheets write and explain formulas.
- ChatGPT, Claude, Gemini and Julius analyse uploaded files and make charts.
- Anonymise personal data first; check results by hand or with PivotTables.
- Learn Excel, SQL and Python basics to get far more from AI.

```quiz
Q: What should you do with names and phone numbers before uploading data to AI? (one word)
A: remove | anonymise | anonymize | delete
Q: Which Kenyan law protects personal data? (three words: Data ___ Act)
A: data protection act | protection
Q: Which Excel tool summarises data quickly so you can check AI totals? (one word)
A: pivottable | pivot | pivottables
```
