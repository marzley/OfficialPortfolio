---
slug: data-analysis-report
title: "Project 3: Data analysis report (Excel, SQL or Python): from raw data to findings"
after: business-website
---
# Project 3: Data analysis report: from raw data to findings

Data analysts are judged by one thing: **can you turn messy data into a clear answer someone can act on?** In this project you analyse a shop's sales data, answer real business questions and write a short report with charts and recommendations. You can do it in **Excel/Google Sheets**, **SQL** or **Python**; the steps are the same. Ideally do it in two tools; that's great interview material.

**Lessons you need:** [pivot tables and charts](./?track=excel&lesson=charts-pivots), [GROUP BY](./?track=sql&lesson=functions-group), [CSV and JSON in Python](./?track=python&lesson=csv-json-files), [functions and dictionaries](./?track=python&lesson=functions-dicts). See the [data analyst roadmap](./?track=career-roadmaps&lesson=data-analyst-roadmap) for where this fits.

## Step 1: Start with questions, not data

The owner of "Mama Njeri Mini-Mart", with two branches, asks:

1. Which products bring in the most revenue?
2. Which branch performs better, and on which days?
3. How much of our revenue comes through M-Pesa vs cash?
4. What should we stock more of, and what should we promote?

Every chart in your report must answer one of these. Charts that don't answer a question get cut.

## Step 2: Get and understand the data

Each sale is a row: date, branch, product, category, quantity, unit price, payment method. In a real project you'd get an export from the shop's point-of-sale system or Excel book. For practice, use the sample below, or a public dataset (Kaggle has many retail sales datasets; KNBS publishes price data).

Before analysing, write a **data dictionary**: each column, what it means, its type, and any problems you notice.

| Column | Meaning | Type | Problems found |
|---|---|---|---|
| date | Date of sale | date | Two formats mixed: 2026-03-01 and 01/03/2026 |
| branch | Branch name | text | "Kikuyu", "kikuyu " (case and spaces) |
| product | Product name | text | |
| qty | Units sold | integer | One negative value (a refund?) |
| price | Unit price (KSh) | number | |
| payment | M-Pesa or Cash | text | "mpesa", "M-PESA", "Mpesa" |

## Step 3: Clean the data

Cleaning is often 60–80% of real analysis work. Typical steps:
- **Standardise text**: trim spaces, consistent capitals (`TRIM`, `PROPER` in Excel; `.strip().title()` in Python).
- **Fix dates** into one format.
- **Handle odd values**: decide what a negative quantity means (refund? typing error?), and **write down every decision** in your report.
- **Remove exact duplicates**.
- **Add calculated columns**: revenue = qty × price, day of week, month.

Here's the whole analysis in plain Python. It runs right here, so change it and experiment:

```try-python
import csv, io
from collections import defaultdict
from datetime import datetime

RAW = """date,branch,product,category,qty,price,payment
2026-03-02,Kikuyu,Unga 2kg,Flour,10,210,M-Pesa
2026-03-02,kikuyu ,Sugar 1kg,Sugar,6,190,cash
02/03/2026,Ruaka,Milk 500ml,Dairy,24,65,mpesa
2026-03-03,Ruaka,Unga 2kg,Flour,8,210,M-PESA
2026-03-03,Kikuyu,Cooking oil 1L,Oil,4,420,Mpesa
2026-03-04,Ruaka,Bread,Bakery,30,65,Cash
2026-03-04,Kikuyu,Milk 500ml,Dairy,18,65,M-Pesa
2026-03-05,Ruaka,Cooking oil 1L,Oil,7,420,M-Pesa
2026-03-06,Kikuyu,Bread,Bakery,25,65,cash
2026-03-07,Ruaka,Sugar 1kg,Sugar,12,190,M-Pesa
2026-03-07,Ruaka,Unga 2kg,Flour,15,210,M-Pesa
2026-03-07,Kikuyu,Milk 500ml,Dairy,-2,65,Cash
2026-03-08,Kikuyu,Unga 2kg,Flour,9,210,M-Pesa
2026-03-08,Ruaka,Bread,Bakery,35,65,mpesa
"""

def parse_date(s):
    for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(s.strip(), fmt)
        except ValueError:
            pass
    raise ValueError("Unknown date: " + s)

rows, refunds = [], 0
for r in csv.DictReader(io.StringIO(RAW)):
    qty = int(r["qty"])
    if qty < 0:          # decision: treat negative quantities as refunds and leave them out
        refunds += 1
        continue
    pay = r["payment"].strip().lower().replace("-", "")
    rows.append({
        "date": parse_date(r["date"]),
        "branch": r["branch"].strip().title(),
        "product": r["product"].strip(),
        "qty": qty,
        "revenue": qty * float(r["price"]),
        "payment": "M-Pesa" if pay == "mpesa" else "Cash",
    })

total = sum(r["revenue"] for r in rows)
print("Clean rows:", len(rows), "| refunds removed:", refunds)
print("Total revenue: KSh {:,.0f}".format(total))

def total_by(key):
    out = defaultdict(float)
    for r in rows:
        out[key(r)] += r["revenue"]
    return sorted(out.items(), key=lambda kv: kv[1], reverse=True)

print("\nQ1 Revenue by product")
for name, rev in total_by(lambda r: r["product"]):
    print("  {:<16} KSh {:>7,.0f}  {:>5.1f}%".format(name, rev, 100 * rev / total))

print("\nQ2 Revenue by branch")
for name, rev in total_by(lambda r: r["branch"]):
    print("  {:<16} KSh {:>7,.0f}".format(name, rev))

print("\nQ2 Revenue by day of week")
for name, rev in total_by(lambda r: r["date"].strftime("%A")):
    print("  {:<16} KSh {:>7,.0f}".format(name, rev))

print("\nQ3 Payment method share")
for name, rev in total_by(lambda r: r["payment"]):
    print("  {:<16} {:>5.1f}%".format(name, 100 * rev / total))
```

Notice the cleaning decisions are in the code as comments. In a real report you list them in a "Data and method" section.

## Step 4: The same analysis in SQL

If the data is in a database, each question is one query. This runs on a small table created right here:

```try-sql
CREATE TABLE sales (sale_date TEXT, branch TEXT, product TEXT, qty INTEGER, price INTEGER, payment TEXT);
INSERT INTO sales VALUES
 ('2026-03-02','Kikuyu','Unga 2kg',10,210,'M-Pesa'), ('2026-03-02','Kikuyu','Sugar 1kg',6,190,'Cash'),
 ('2026-03-02','Ruaka','Milk 500ml',24,65,'M-Pesa'), ('2026-03-03','Ruaka','Unga 2kg',8,210,'M-Pesa'),
 ('2026-03-03','Kikuyu','Cooking oil 1L',4,420,'M-Pesa'), ('2026-03-04','Ruaka','Bread',30,65,'Cash'),
 ('2026-03-04','Kikuyu','Milk 500ml',18,65,'M-Pesa'), ('2026-03-05','Ruaka','Cooking oil 1L',7,420,'M-Pesa'),
 ('2026-03-06','Kikuyu','Bread',25,65,'Cash'), ('2026-03-07','Ruaka','Sugar 1kg',12,190,'M-Pesa'),
 ('2026-03-07','Ruaka','Unga 2kg',15,210,'M-Pesa'), ('2026-03-08','Kikuyu','Unga 2kg',9,210,'M-Pesa'),
 ('2026-03-08','Ruaka','Bread',35,65,'M-Pesa');

SELECT product, SUM(qty * price) AS revenue,
       ROUND(100.0 * SUM(qty * price) / (SELECT SUM(qty * price) FROM sales), 1) AS pct
FROM sales
GROUP BY product
ORDER BY revenue DESC;
```

Try writing the branch and payment-method queries yourself: change `product` to `branch`, then to `payment`.

## Step 5: The same analysis in Excel or Google Sheets

1. Paste the data, select it, **Insert → Table** (or Format as table).
2. Add a column `Revenue = [@qty]*[@price]` and `Day = TEXT([@date],"dddd")`.
3. Clean with `TRIM`, `PROPER`, and Find & Replace for payment names.
4. **Insert → PivotTable**: rows = product, values = sum of revenue; sort descending; add "% of grand total".
5. Make a second pivot for branch × day of week and a third for payment method.
6. Chart each pivot: bar chart for products, column chart for days, a simple bar (or one donut at most) for payments.

## Step 6: In pandas (the professional Python way)

In Jupyter or Google Colab, the same analysis is much shorter:

```python
import pandas as pd

df = pd.read_csv("sales.csv")
df["branch"] = df["branch"].str.strip().str.title()
df["payment"] = df["payment"].str.lower().str.replace("-", "").map({"mpesa": "M-Pesa", "cash": "Cash"})
df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True)
df = df[df["qty"] > 0]
df["revenue"] = df["qty"] * df["price"]

print(df.groupby("product")["revenue"].sum().sort_values(ascending=False))
print(df.pivot_table(index=df["date"].dt.day_name(), columns="branch", values="revenue", aggfunc="sum"))
df.groupby("product")["revenue"].sum().sort_values().plot(kind="barh", title="Revenue by product (KSh)")
```

## Step 7: Choose honest, clear charts

| Question | Best chart |
|---|---|
| Compare categories (products, branches) | Horizontal bar chart, sorted |
| Change over time (daily, monthly sales) | Line chart |
| Share of a whole with 2–3 parts (M-Pesa vs cash) | A single stacked bar, or one simple donut |
| Two categories at once (branch × day) | Grouped bars or a heat-map table |

Rules: start bar axes at zero, label axes with units (KSh), write a title that states the finding ("Unga brings in a third of all revenue"), and avoid 3D effects.

## Step 8: Write the report

One to two pages. Managers read the first paragraph; make it count.

> **Summary.** In the week of 2–8 March, the two branches sold KSh 25,440 (after removing one refund). **Unga 2kg was the top product** at about 35% of revenue. **Ruaka out-sold Kikuyu** by about KSh 6,200, with higher bread, cooking oil and Unga sales. **About 81% of revenue came through M-Pesa.**
>
> **Recommendations.** 1) Never run out of Unga 2kg: set a minimum stock level. 2) Test a bread-and-milk morning offer at Kikuyu. 3) Promote M-Pesa payment (e.g. a Lipa na M-Pesa till sign at every counter) to reduce cash handling.
>
> **Data and method.** 14 sales records; 1 negative-quantity row treated as a refund and excluded; branch names and payment methods standardised; dates in two formats unified. One week of data is too short for firm conclusions; repeat monthly.

Check the numbers in your summary against your own output; they must match exactly.

## Step 9: Publish it

- GitHub repository with: the data (or a link to it if it's public), the notebook or Excel file, SQL files, `README.md` with the summary and 2–3 chart images.
- Optional: a one-page dashboard in Power BI or Looker Studio with the same KPIs.
- A LinkedIn post: the question, one chart, one finding, a link.

:::warning Real data needs permission
If you use a real business's data, get permission and remove anything personal (customer names, phone numbers). Never publish someone's M-Pesa statement.
:::

## Stretch goals

- A month of data with a daily **line chart** and a 7-day moving average.
- **Basket analysis**: which products are bought together.
- Automate it: a Python script that reads each week's CSV and emails the summary.

## Summary

- Start from business questions; every chart must answer one.
- Clean carefully and document every decision.
- The same analysis works in Excel (pivots), SQL (GROUP BY) and Python (dictionaries or pandas).
- Report: findings first, recommendations, then method and limitations.

```quiz
Q: Which chart type is best for showing change over time?
A: line | line chart | a line chart
Q: In the sample, a negative quantity was treated as a what?
A: refund | a refund | refunds
Q: Which SQL clause totals revenue for each product? (two words)
A: GROUP BY
Q: Which Python string method removes spaces from both ends?
A: strip | .strip() | strip()
```
