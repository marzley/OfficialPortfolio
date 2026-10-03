---
slug: window-functions
title: Window functions: rankings, running totals and more
after: subqueries-views
---
# Window functions: rankings, running totals and more

`GROUP BY` squashes rows into one per group. **Window functions** calculate across related rows **but keep every row**. They answer questions like "rank each product by price", "running total of sales" and "compare each order to the previous one": things that used to need complicated subqueries.

## The shape

```sql
function() OVER (PARTITION BY column ORDER BY column)
```

- `OVER (...)` makes it a window function.
- `PARTITION BY` splits rows into groups (optional).
- `ORDER BY` sets the order inside each group (optional).

## Ranking

```try-sql
SELECT Name, Category, Price,
       ROW_NUMBER() OVER (ORDER BY Price DESC) AS RowNum,
       RANK()       OVER (ORDER BY Price DESC) AS PriceRank
FROM Products;
```

Rank **within each category**:

```try-sql
SELECT Category, Name, Price,
       RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS RankInCategory
FROM Products
ORDER BY Category, RankInCategory;
```

| Function | Ties (two items at KSh 900) |
|---|---|
| `ROW_NUMBER()` | 1, 2, 3, 4 (always unique) |
| `RANK()` | 1, 2, 2, 4 (skips after a tie) |
| `DENSE_RANK()` | 1, 2, 2, 3 (no gaps) |

## Top N per group

"The most expensive product in each category":

```try-sql
SELECT Category, Name, Price
FROM (
  SELECT Category, Name, Price,
         ROW_NUMBER() OVER (PARTITION BY Category ORDER BY Price DESC) AS rn
  FROM Products
)
WHERE rn = 1;
```

## Aggregates as windows: totals next to each row

```try-sql
SELECT Name, Category, Price,
       SUM(Price) OVER (PARTITION BY Category)            AS CategoryTotal,
       ROUND(100.0 * Price / SUM(Price) OVER (), 1)       AS PercentOfAll,
       ROUND(AVG(Price) OVER (PARTITION BY Category))     AS CategoryAvg
FROM Products;
```

## Running totals

```try-sql
SELECT o.OrderDate, p.Name, o.Quantity * p.Price AS Amount,
       SUM(o.Quantity * p.Price) OVER (ORDER BY o.OrderDate) AS RunningTotal
FROM Orders o
JOIN Products p ON p.ProductID = o.ProductID
ORDER BY o.OrderDate;
```

## LAG and LEAD: compare with the previous or next row

```try-sql
WITH daily AS (
  SELECT o.OrderDate AS Day, SUM(o.Quantity * p.Price) AS Sales
  FROM Orders o JOIN Products p ON p.ProductID = o.ProductID
  GROUP BY o.OrderDate
)
SELECT Day, Sales,
       LAG(Sales)  OVER (ORDER BY Day) AS PreviousSales,
       Sales - LAG(Sales) OVER (ORDER BY Day) AS Change,
       LEAD(Day)   OVER (ORDER BY Day) AS NextOrderDay
FROM daily;
```

`WITH daily AS (...)` is a **CTE** (common table expression): a named temporary result that makes long queries readable.

## Where they work

Window functions work in SQLite 3.25+, MySQL 8+, PostgreSQL, SQL Server and Oracle. Older MySQL 5.7 hosting doesn't support them: check your host's version with `SELECT VERSION();`.

## Why window functions matter

Many business questions need a value **for each row** plus information about **other rows**: "rank each salesperson", "show each order with the customer's total", "running total of sales by date", "change from last month", "top 3 products per category". Before window functions, these needed complicated self-joins or exporting to Excel. Now they're a few lines of SQL. Data analysts use them daily, and they're a favourite interview topic.

## GROUP BY vs window functions

```try-sql
-- GROUP BY: one row per customer (details disappear)
SELECT CustomerID, SUM(Quantity) AS Units FROM Orders GROUP BY CustomerID;

-- Window: every order row stays, with the customer total alongside
SELECT OrderID, CustomerID, Quantity,
       SUM(Quantity) OVER (PARTITION BY CustomerID) AS CustomerUnits
FROM Orders
ORDER BY CustomerID, OrderID;
```

GROUP BY collapses rows; window functions keep them and add calculated columns.

## Share of total (percentages)

```try-sql
SELECT p.Name,
  SUM(o.Quantity * p.Price) AS Revenue,
  ROUND(100.0 * SUM(o.Quantity * p.Price) / SUM(SUM(o.Quantity * p.Price)) OVER (), 1) AS PctOfTotal
FROM Orders o
JOIN Products p ON p.ProductID = o.ProductID
GROUP BY p.ProductID
ORDER BY Revenue DESC;
```

`SUM(SUM(...)) OVER ()` looks odd but is common: the inner SUM is the GROUP BY total per product; the outer window SUM adds those totals across all rows.

## ROW_NUMBER vs RANK vs DENSE_RANK

```try-sql
WITH scores(Student, Score) AS (
  VALUES ('Amina', 92), ('Brian', 88), ('Chebet', 88), ('Dennis', 75), ('Esther', 70)
)
SELECT Student, Score,
  ROW_NUMBER() OVER (ORDER BY Score DESC) AS RowNum,
  RANK()       OVER (ORDER BY Score DESC) AS Rnk,
  DENSE_RANK() OVER (ORDER BY Score DESC) AS DenseRnk,
  NTILE(2)     OVER (ORDER BY Score DESC) AS Half
FROM scores;
```

| Function | Ties (88, 88) | Next value |
|---|---|---|
| ROW_NUMBER | 2, 3 (arbitrary order) | 4 |
| RANK | 2, 2 | 4 (gap) |
| DENSE_RANK | 2, 2 | 3 (no gap) |
| NTILE(n) | Splits rows into n roughly equal groups | Quartiles, top/bottom halves |

Schools usually rank with RANK (ties share a position and the next is skipped).

## Running totals and moving averages

```try-sql
WITH daily(Day, Sales) AS (
  VALUES ('2026-09-01', 1200), ('2026-09-02', 800), ('2026-09-03', 1500),
         ('2026-09-04', 600), ('2026-09-05', 2100), ('2026-09-06', 900)
)
SELECT Day, Sales,
  SUM(Sales) OVER (ORDER BY Day) AS RunningTotal,
  ROUND(AVG(Sales) OVER (ORDER BY Day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 0) AS MovingAvg3,
  Sales - LAG(Sales) OVER (ORDER BY Day) AS ChangeFromYesterday,
  ROUND(100.0 * (Sales - LAG(Sales) OVER (ORDER BY Day)) / LAG(Sales) OVER (ORDER BY Day), 1) AS PctChange
FROM daily;
```

The **frame** `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` limits the window to the current row and the two before it: a 3-day moving average that smooths out daily ups and downs.

## Frames explained

| Frame | Meaning |
|---|---|
| `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` | From the first row to this one (running total) |
| `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` | Last 3 rows |
| `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` | Previous, current and next row |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` | The whole partition |

## FIRST_VALUE and LAST_VALUE: comparing with the best

```try-sql
SELECT Name, Category, Price,
  FIRST_VALUE(Name) OVER (PARTITION BY Category ORDER BY Price DESC) AS MostExpensiveInCategory,
  Price - MAX(Price) OVER (PARTITION BY Category) AS DiffFromTop
FROM Products
ORDER BY Category, Price DESC;
```

## Top N per group with a CTE

```try-sql
WITH ranked AS (
  SELECT Name, Category, Price,
         ROW_NUMBER() OVER (PARTITION BY Category ORDER BY Price DESC) AS rn
  FROM Products
)
SELECT Category, Name, Price FROM ranked WHERE rn <= 1 ORDER BY Category;
```

You can't use a window function directly in WHERE (windows are calculated after WHERE), so wrap it in a CTE or subquery, then filter.

## Customer analytics example

```try-sql
WITH spend AS (
  SELECT c.Name, o.OrderDate, o.Quantity * p.Price AS Amount
  FROM Orders o
  JOIN Customers c ON c.CustomerID = o.CustomerID
  JOIN Products p ON p.ProductID = o.ProductID
)
SELECT Name, OrderDate, Amount,
  ROW_NUMBER() OVER (PARTITION BY Name ORDER BY OrderDate) AS OrderNumber,
  SUM(Amount) OVER (PARTITION BY Name ORDER BY OrderDate) AS LifetimeSpend,
  CAST(julianday(OrderDate) - julianday(LAG(OrderDate) OVER (PARTITION BY Name ORDER BY OrderDate)) AS INTEGER) AS DaysSinceLastOrder
FROM spend
ORDER BY Name, OrderDate;
```

This shows each customer's order number, how much they have spent so far, and the gap between orders: the basis of loyalty and retention analysis.

## Common mistakes

| Mistake | Fix |
|---|---|
| Using a window function in WHERE | Wrap in a CTE/subquery |
| Forgetting ORDER BY inside OVER for running totals | `SUM(x) OVER (ORDER BY date)` |
| Integer division in percentages | Multiply by `100.0` |
| LAST_VALUE returning the current row | Add `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` |
| Ranking without a tie-breaker | Add a second ORDER BY column for ROW_NUMBER |

## Practice

1. Rank products by price within each category using DENSE_RANK.
2. Show each order with the running total of quantity by date.
3. Calculate each product's percentage of total revenue.
4. Find the most expensive product in each category with a CTE and ROW_NUMBER.
5. Show the change in daily sales from the previous day with LAG.

:::think Why can't you write `WHERE RANK() OVER (ORDER BY Price DESC) <= 3` to get the top 3 products?
SQL processes WHERE before calculating window functions (which happen at the SELECT stage), so the rank doesn't exist yet when WHERE runs. Calculate the rank in a CTE or subquery first, then filter on it in the outer query.
:::

```quiz
Q: Which keyword turns a function into a window function?
A: OVER
Q: Which clause splits rows into groups inside a window?
A: PARTITION BY
Q: Which ranking function never gives two rows the same number?
A: ROW_NUMBER | ROW_NUMBER()
Q: Which function reads the value from the previous row?
A: LAG | LAG()
Q: What does WITH name AS (...) create? (three letters)
A: CTE
Q: Which ranking function leaves no gaps after ties?
A: DENSE_RANK | dense_rank
Q: Which function splits rows into a given number of roughly equal groups?
A: NTILE
Q: What part of a window definition limits it to, for example, the previous 2 rows and the current row?
A: frame | ROWS BETWEEN | window frame
```
=== exercise ===
Rank all products by **Price** from highest to lowest using `RANK() OVER (ORDER BY Price DESC)`.
=== starter ===
-- your query here
=== must_contain ===
RANK()
OVER
ORDER BY Price DESC
