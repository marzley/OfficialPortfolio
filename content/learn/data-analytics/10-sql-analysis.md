---
slug: sql-for-analysis
title: "SQL for analysis: GROUP BY, HAVING, JOINs, CASE and window functions"
after: excel-for-analysis
---
# SQL for analysis: GROUP BY, HAVING, JOINs, CASE and window functions

Most company data lives in databases. SQL lets you ask questions of millions of rows in seconds. If you know SELECT and WHERE (see the [SQL subject](./?track=sql)), this lesson teaches the queries analysts use daily. Every example runs right here.

## The dataset

A chain of agro-dealers with two tables: **branches** and **sales**.

```try-sql
CREATE TABLE branches (branch_id INTEGER PRIMARY KEY, name TEXT, county TEXT, monthly_target INTEGER);
INSERT INTO branches VALUES
 (1, 'Kenol', 'Murang''a', 300000), (2, 'Thika', 'Kiambu', 450000),
 (3, 'Nyeri Town', 'Nyeri', 350000), (4, 'Embu', 'Embu', 250000);

CREATE TABLE sales (sale_id INTEGER PRIMARY KEY, branch_id INTEGER, sale_date TEXT, item TEXT, category TEXT, amount INTEGER);
INSERT INTO sales VALUES
 (1, 1, '2026-03-02', 'DAP fertiliser 50kg', 'Fertiliser', 7400), (2, 1, '2026-03-02', 'Maize seed 2kg', 'Seed', 1350),
 (3, 2, '2026-03-03', 'CAN fertiliser 50kg', 'Fertiliser', 6200), (4, 2, '2026-03-03', 'Knapsack sprayer', 'Equipment', 4800),
 (5, 3, '2026-03-04', 'Dairy meal 70kg', 'Feeds', 3900), (6, 2, '2026-03-05', 'DAP fertiliser 50kg', 'Fertiliser', 7400),
 (7, 4, '2026-03-05', 'Maize seed 2kg', 'Seed', 1350), (8, 1, '2026-03-06', 'Dairy meal 70kg', 'Feeds', 3900),
 (9, 3, '2026-03-07', 'CAN fertiliser 50kg', 'Fertiliser', 6200), (10, 2, '2026-03-08', 'Dairy meal 70kg', 'Feeds', 3900),
 (11, 1, '2026-04-02', 'DAP fertiliser 50kg', 'Fertiliser', 7400), (12, 3, '2026-04-03', 'Knapsack sprayer', 'Equipment', 4800),
 (13, 2, '2026-04-04', 'Maize seed 2kg', 'Seed', 1350), (14, 4, '2026-04-05', 'DAP fertiliser 50kg', 'Fertiliser', 7400);

SELECT category, COUNT(*) AS sales_count, SUM(amount) AS revenue, ROUND(AVG(amount)) AS avg_sale
FROM sales
GROUP BY category
ORDER BY revenue DESC;
```

**GROUP BY** creates one row per category; COUNT, SUM and AVG summarise each group.

## JOIN: combine tables

```try-sql
CREATE TABLE branches (branch_id INTEGER PRIMARY KEY, name TEXT, county TEXT);
INSERT INTO branches VALUES (1, 'Kenol', 'Murang''a'), (2, 'Thika', 'Kiambu'), (3, 'Nyeri Town', 'Nyeri'), (4, 'Embu', 'Embu');
CREATE TABLE sales (sale_id INTEGER PRIMARY KEY, branch_id INTEGER, amount INTEGER);
INSERT INTO sales VALUES (1, 1, 7400), (2, 1, 1350), (3, 2, 6200), (4, 2, 4800), (5, 3, 3900), (6, 2, 7400), (7, 1, 3900);

SELECT b.name, b.county, COUNT(s.sale_id) AS sales_count, COALESCE(SUM(s.amount), 0) AS revenue
FROM branches b
LEFT JOIN sales s ON s.branch_id = b.branch_id
GROUP BY b.branch_id
ORDER BY revenue DESC;
```

A **LEFT JOIN** keeps every branch, even Embu with no sales in this sample (revenue 0). An INNER JOIN would drop it, which can hide problems.

## HAVING: filter groups

WHERE filters rows before grouping; **HAVING** filters groups after.

```try-sql
CREATE TABLE sales (sale_id INTEGER PRIMARY KEY, item TEXT, amount INTEGER);
INSERT INTO sales VALUES (1, 'DAP fertiliser 50kg', 7400), (2, 'Maize seed 2kg', 1350), (3, 'DAP fertiliser 50kg', 7400),
 (4, 'Knapsack sprayer', 4800), (5, 'Maize seed 2kg', 1350), (6, 'DAP fertiliser 50kg', 7400), (7, 'Dairy meal 70kg', 3900);

SELECT item, COUNT(*) AS times_sold, SUM(amount) AS revenue
FROM sales
GROUP BY item
HAVING COUNT(*) >= 2
ORDER BY revenue DESC;
```

## CASE: create categories

```try-sql
CREATE TABLE sales (sale_id INTEGER PRIMARY KEY, amount INTEGER);
INSERT INTO sales VALUES (1, 7400), (2, 1350), (3, 6200), (4, 4800), (5, 3900), (6, 950), (7, 12500);

SELECT
  CASE WHEN amount < 2000 THEN 'Small'
       WHEN amount < 6000 THEN 'Medium'
       ELSE 'Large' END AS size_band,
  COUNT(*) AS sales_count,
  SUM(amount) AS revenue
FROM sales
GROUP BY size_band
ORDER BY revenue DESC;
```

## Window functions: running totals and rankings

Window functions calculate across rows **without** collapsing them into groups.

```try-sql
CREATE TABLE monthly (branch TEXT, month TEXT, revenue INTEGER);
INSERT INTO monthly VALUES
 ('Kenol', '2026-01', 280000), ('Kenol', '2026-02', 310000), ('Kenol', '2026-03', 295000),
 ('Thika', '2026-01', 430000), ('Thika', '2026-02', 470000), ('Thika', '2026-03', 455000);

SELECT branch, month, revenue,
       SUM(revenue) OVER (PARTITION BY branch ORDER BY month) AS running_total,
       revenue - LAG(revenue) OVER (PARTITION BY branch ORDER BY month) AS change_vs_last_month,
       RANK() OVER (PARTITION BY month ORDER BY revenue DESC) AS rank_in_month
FROM monthly
ORDER BY branch, month;
```

| Function | Gives |
|---|---|
| `SUM(...) OVER (...)` | Running totals |
| `LAG` / `LEAD` | The previous or next row's value (month-on-month change) |
| `RANK`, `ROW_NUMBER` | Rankings within groups |
| `AVG(...) OVER (...)` | Moving averages |

:::tip Write queries step by step
Start with `SELECT * ... LIMIT 10` to see the data, add filters, then grouping, then ordering. Check row counts at each step, especially after JOINs (a wrong join condition can multiply rows).
:::

:::think A JOIN of sales to products gives a total revenue three times bigger than expected. What's the likely cause?
The join matched each sale to several product rows (for example, the products table has duplicate codes, or the join condition is incomplete), multiplying rows. Check for duplicates in the joined key and count rows before and after the JOIN.
:::

## Summary

- GROUP BY with COUNT, SUM and AVG summarises data; HAVING filters groups.
- LEFT JOIN keeps all rows from the first table; check row counts after joins.
- CASE creates categories; window functions give running totals, changes and rankings.
- Build queries step by step and check results.

```quiz
Q: Which clause filters groups after GROUP BY? (one word)
A: having
Q: Which join keeps every branch even if it has no sales? (two words)
A: left join | left
Q: Which window function gets the previous row's value? (one word)
A: lag
```
