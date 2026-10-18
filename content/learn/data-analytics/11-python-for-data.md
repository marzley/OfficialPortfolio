---
slug: python-for-data
title: "Python for data analysis: CSV files, grouping, and an introduction to pandas"
after: sql-for-analysis
---
# Python for data analysis: CSV files, grouping, and an introduction to pandas

Excel struggles with very large files and repeating the same steps every week. Python handles millions of rows and automates the whole job: load, clean, analyse, chart and export, with one click. If you're new to Python, do the [Python subject](./?track=python) first.

## Reading a CSV file

CSV (comma-separated values) is the most common data format: every system can export it.

```try-python
import csv, io

csv_text = """date,branch,item,qty,price
2026-03-01,Kenol,Unga 2kg,12,210
2026-03-01,Thika,Milk 500ml,40,65
2026-03-02,Kenol,Sugar 1kg,8,190
2026-03-02,Thika,Unga 2kg,20,210
2026-03-03,Kenol,Milk 500ml,30,65
2026-03-03,Thika,Bread,25,65
"""

rows = list(csv.DictReader(io.StringIO(csv_text)))
print("Rows:", len(rows))
print("First row:", rows[0])
```

In real work you'd use `open("sales.csv")` instead of `io.StringIO(...)`.

## Grouping and totals (like a PivotTable)

```try-python
import csv, io
from collections import defaultdict

csv_text = """date,branch,item,qty,price
2026-03-01,Kenol,Unga 2kg,12,210
2026-03-01,Thika,Milk 500ml,40,65
2026-03-02,Kenol,Sugar 1kg,8,190
2026-03-02,Thika,Unga 2kg,20,210
2026-03-03,Kenol,Milk 500ml,30,65
2026-03-03,Thika,Bread,25,65
"""
rows = list(csv.DictReader(io.StringIO(csv_text)))

by_branch = defaultdict(int)
by_item = defaultdict(int)
for r in rows:
    revenue = int(r["qty"]) * int(r["price"])
    by_branch[r["branch"]] += revenue
    by_item[r["item"]] += revenue

print("Revenue by branch:")
for branch, total in sorted(by_branch.items(), key=lambda kv: -kv[1]):
    print(f"  {branch:<6} KSh {total:,}")

top_item = max(by_item, key=by_item.get)
print("Top item:", top_item, f"(KSh {by_item[top_item]:,})")
```

## Writing results to a new CSV

```try-python
import csv, io

summary = [("Thika", 8425), ("Kenol", 5990)]   # the totals from the example above
out = io.StringIO()
writer = csv.writer(out)
writer.writerow(["branch", "revenue"])
writer.writerows(summary)
print(out.getvalue())
```

## pandas: the analyst's main Python library

**pandas** stores data in a **DataFrame** (like a spreadsheet in code) and does in one line what took a loop above. On your own computer, install it with `pip install pandas` (it's included in Anaconda and Google Colab). Here's how the same analysis looks in pandas:

```python
import pandas as pd

df = pd.read_csv("sales.csv", parse_dates=["date"])
df["revenue"] = df["qty"] * df["price"]

print(df.head())                                   # first 5 rows
print(df.describe())                               # mean, std, quartiles for every number column
print(df.groupby("branch")["revenue"].sum())       # revenue by branch
print(df.groupby(df["date"].dt.month)["revenue"].sum())   # by month

pivot = df.pivot_table(index="branch", columns="item", values="revenue", aggfunc="sum", fill_value=0)
pivot.to_excel("summary.xlsx")                     # needs openpyxl
```

| Task | pandas |
|---|---|
| Load a file | `pd.read_csv()`, `pd.read_excel()` |
| See the data | `df.head()`, `df.info()`, `df.describe()` |
| Filter rows | `df[df["branch"] == "Thika"]` |
| New column | `df["revenue"] = df["qty"] * df["price"]` |
| Group and total | `df.groupby("branch")["revenue"].sum()` |
| Remove duplicates | `df.drop_duplicates()` |
| Missing values | `df.isna().sum()`, `df.dropna()`, `df.fillna()` |
| Charts | `df.plot()` (uses matplotlib) |

:::tip Where to practise pandas for free
**Google Colab** (colab.research.google.com) runs Python notebooks with pandas in your browser, even on a basic laptop. Kaggle also offers free notebooks and datasets.
:::

## Mini project: automate a weekly report

1. Export the week's sales as CSV.
2. Python script: load, clean (lesson 8), total by branch and item, compare with last week.
3. Save a summary CSV or Excel file and a chart.
4. Next week, run the same script on the new file: a 2-hour job becomes 2 minutes.

:::think When is Excel enough, and when should an analyst switch to Python?
Excel is enough for small to medium datasets, one-off analysis and sharing with non-technical colleagues. Switch to Python for very large files, repeated weekly or daily reports, combining many files, complex cleaning or advanced statistics and machine learning.
:::

## Summary

- CSV is the common format; Python's csv module reads and writes it.
- Grouping with dictionaries works like a PivotTable.
- pandas DataFrames make loading, cleaning, grouping and exporting fast.
- Use Google Colab to practise pandas free; automate repeated reports.

```quiz
Q: What does CSV stand for? (three words)
A: comma separated values | comma-separated values
Q: Which Python library stores data in DataFrames? (one word)
A: pandas
Q: Which pandas method groups rows, like a PivotTable? (one word)
A: groupby
```
