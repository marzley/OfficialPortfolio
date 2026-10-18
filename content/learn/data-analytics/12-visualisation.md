---
slug: data-visualisation
title: "Data visualisation: choosing the right chart and designing clear dashboards"
after: python-for-data
---
# Data visualisation: choosing the right chart and designing clear dashboards

A good chart makes the answer obvious in seconds. A bad chart confuses or misleads. Visualisation is about choosing the right chart for the question and removing everything that doesn't help.

## Choose the chart by the question

| Question | Best chart | Avoid |
|---|---|---|
| How did it change over time? | **Line chart** | Pie chart |
| Which is biggest or smallest? | **Bar chart** (sorted) | 3D bars |
| What share of the whole? | **Bar chart** or **stacked bar**; pie only for 2–4 parts | Pie with 10 slices |
| How are values spread? | **Histogram**, **box plot** | Bar chart of raw values |
| Is there a relationship? | **Scatter plot** | Line chart |
| What is the headline number? | **Big number (KPI card)** | A chart for a single number |
| Where? | **Map** (by county or ward) | Map when location doesn't matter |

## Design rules that make charts clear

1. **One message per chart.** Write it as the title: "Thika sales fell 12% in March", not "Sales by branch".
2. **Sort bars** from biggest to smallest (unless the order means something, like months).
3. **Start bar charts at zero.** Cutting the axis exaggerates differences.
4. **Use colour on purpose:** grey for most bars, one strong colour for the one that matters.
5. **Label directly** instead of making people match colours to a legend.
6. **Remove clutter:** heavy gridlines, 3D effects, shadows, unnecessary decimals.
7. **Show units:** KSh, %, thousands (KSh 120k).
8. **Make it readable on a phone:** many Kenyan managers read reports on WhatsApp.

## How charts mislead (and how to spot it)

| Trick | Effect |
|---|---|
| Bar axis starting at 90 instead of 0 | A 2% difference looks huge |
| Different scales on two charts side by side | Fake comparisons |
| Cherry-picked time ranges | Hides the long-term trend |
| 3D pie charts | Front slices look bigger |
| Totals instead of rates | A big county looks "worst" just because it's big (use per 1,000 people) |

## A text bar chart (run it)

```try-python
sales = {"Thika": 455000, "Kenol": 295000, "Nyeri": 338000, "Embu": 210000}
biggest = max(sales.values())

for branch, value in sorted(sales.items(), key=lambda kv: -kv[1]):
    bar = "█" * round(30 * value / biggest)
    print(f"{branch:<6} {bar} KSh {value // 1000}k")
```

Sorted, labelled and simple: the message is clear without a legend.

## Dashboards

A **dashboard** shows the key numbers and charts on one screen, usually updated automatically.

**Layout that works:**
1. **Top row:** 3–5 KPI cards (revenue, orders, average order, growth vs last month).
2. **Middle:** the main trend (line chart).
3. **Bottom:** breakdowns (by branch, product, region) as bar charts.
4. **Filters:** date range, branch, product.

**Ask before building:** Who uses it? What decisions do they make? How often? Fewer, well-chosen charts beat a crowded screen.

## Tools

| Tool | Best for |
|---|---|
| Excel / Google Sheets charts | Quick charts and simple dashboards |
| **Power BI** | Interactive business dashboards (next lesson) |
| **Looker Studio** (free, Google) | Dashboards from Google Sheets, Google Analytics, BigQuery |
| **Tableau** (Tableau Public is free) | Beautiful interactive visualisations, public portfolio |
| Python (matplotlib, seaborn, plotly) | Custom and automated charts |

:::think A chart shows "Number of road accidents by county" and Nairobi is far highest. A reader concludes Nairobi's roads are the most dangerous. What's missing?
Nairobi has far more people, vehicles and kilometres driven, so totals are expected to be high. A fair comparison uses rates, such as accidents per 10,000 vehicles or per 100,000 people, and ideally the same time period and definitions.
:::

## Summary

- Pick the chart by the question: line for time, sorted bars for comparison, histogram for spread, scatter for relationships.
- One message per chart, written as the title; start bars at zero; use colour on purpose.
- Watch for misleading charts: cut axes, cherry-picked ranges, totals instead of rates.
- Dashboards: KPIs on top, trend in the middle, breakdowns below, with filters.

```quiz
Q: Which chart is best for showing change over time? (two words)
A: line chart | line
Q: Should a bar chart's axis start at zero? (yes or no)
A: yes
Q: Which free Google tool builds dashboards from Google Sheets? (two words)
A: looker studio | looker
```
