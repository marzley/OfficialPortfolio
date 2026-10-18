---
slug: data-analytics-start-here
title: "Start here: what data analysts do and your roadmap from zero to job-ready"
after: START
---
# Start here: what data analysts do and your roadmap from zero to job-ready

A **data analyst** turns raw numbers into answers that help people decide. A supermarket asks "Which branch is losing money and why?" A county asks "Which wards have the lowest clinic attendance?" A SACCO asks "Which members are likely to default?" The analyst finds, cleans and studies the data, then explains the answer clearly.

## What a data analyst does every day

- Talks to managers to understand the **question**
- Finds and **collects** data (spreadsheets, databases, surveys, systems like M-Pesa statements or POS exports)
- **Cleans** it: fixes errors, duplicates and missing values
- **Analyses** it: totals, trends, comparisons, statistics
- **Visualises** it: charts and dashboards
- **Presents** findings and recommendations

## The six-step analysis process

| Step | Question to ask | Example (a chain of shops) |
|---|---|---|
| 1. Ask | What decision needs to be made? | "Should we open longer hours on Saturdays?" |
| 2. Prepare | What data do we need, and where is it? | Hourly sales from the POS for 6 months |
| 3. Process | Is the data clean and complete? | Remove test sales, fix missing branch names |
| 4. Analyse | What does the data say? | Saturday 6–9pm sales are 18% of weekly revenue |
| 5. Share | How do we explain it? | A one-page report with two charts |
| 6. Act | What do we do now? | Pilot longer hours in two branches, measure results |

Most beginners rush to step 4. The best analysts spend real time on steps 1 and 3.

## The tools you'll learn (in this order)

| Tool | What it's for | Where to learn |
|---|---|---|
| **Excel / Google Sheets** | Quick analysis, PivotTables, charts; used in almost every office | This subject + [Excel](./?track=excel) |
| **SQL** | Getting data out of databases | This subject + [SQL](./?track=sql) |
| **Statistics** | Knowing what the numbers really mean | Lessons 3–7 of this subject |
| **Power BI** (or Looker Studio) | Dashboards for managers | Lesson 13 |
| **Python** | Bigger data, automation, advanced analysis | This subject + [Python](./?track=python) |

:::note You don't need to be a maths genius
You need school-level maths, curiosity, care with details and the patience to check your work. Computers do the calculating; you do the thinking.
:::

## Your roadmap (about 4–6 months part-time)

1. **Month 1:** Excel basics, PivotTables, charts; the statistics lessons here.
2. **Month 2:** SQL: SELECT, WHERE, GROUP BY, JOINs.
3. **Month 3:** Data cleaning, visualisation and Power BI.
4. **Month 4:** Python basics for data (lists, dictionaries, CSV files; then pandas).
5. **Months 5–6:** Two or three portfolio projects with real Kenyan data, a polished CV and LinkedIn, applications or freelance gigs.

See the full [data analyst career roadmap](./?track=career-roadmaps&lesson=data-analyst-roadmap) and the [data analysis portfolio project](./?track=projects&lesson=data-analysis-report).

## Your first analysis (run it)

Here are a week of sales from a small shop. Click **Run**, then try changing the numbers.

```try-python
sales = {"Mon": 4200, "Tue": 3900, "Wed": 4100, "Thu": 4600, "Fri": 6800, "Sat": 9100, "Sun": 5200}

total = sum(sales.values())
best_day = max(sales, key=sales.get)
average = total / len(sales)

print("Total for the week: KSh", total)
print("Average per day: KSh", round(average))
print("Best day:", best_day, "with KSh", sales[best_day])
print("Weekend share:", round(100 * (sales["Sat"] + sales["Sun"]) / total), "%")
```

That's analysis: a question (how did we do?), data, calculations and an insight (weekends matter a lot).

:::think A manager says: "Give me a report on sales." What should you do before opening Excel?
Ask questions first: What decision is the report for? Which period, branches and products? Compared to what (last month, last year, target)? Who will read it, and how much detail do they want? A clear question saves hours and makes the report useful.
:::

## Summary

- Data analysts turn data into answers and recommendations.
- Follow the process: ask, prepare, process, analyse, share, act.
- Learn Excel, SQL, statistics, Power BI and Python, in that order.
- Build real projects; they matter more than certificates alone.

```quiz
Q: What is the first step of the analysis process? (one word)
A: ask
Q: Which tool gets data out of databases? (abbreviation)
A: sql
Q: In the example, which day had the highest sales? (three letters)
A: sat | saturday
```
