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
```
=== exercise ===
Rank all products by **Price** from highest to lowest using `RANK() OVER (ORDER BY Price DESC)`.
=== starter ===
-- your query here
=== must_contain ===
RANK()
OVER
ORDER BY Price DESC
