---
slug: subqueries-views
title: "Subqueries, CTEs, views and UNION: queries inside queries and reusable results"
after: KEEP
---
# Subqueries, CTEs, views and UNION: queries inside queries and reusable results

Some questions need two steps. "Which products cost more than the **average**?" means first calculating the average, then comparing each product with it. "Who are our **top customers**, and what did they buy?" needs a list first, then details. **Subqueries** (queries inside queries) and **CTEs** (named temporary results) let you solve multi-step questions in one statement. **Views** save a query under a name so everyone can reuse it, and **UNION** stacks results on top of each other.

:::note What you will learn
- Scalar subqueries (one value)
- Subqueries with IN and NOT IN
- Correlated subqueries and EXISTS
- Subqueries in FROM (derived tables)
- CTEs with WITH, including several CTEs
- Views: creating, using and dropping them
- UNION, UNION ALL, INTERSECT and EXCEPT
- When to use a join vs a subquery
:::

## Scalar subqueries: one value

A subquery in brackets that returns a single value can be used like a number:

```try-sql
SELECT Name, Price
FROM Products
WHERE Price > (SELECT AVG(Price) FROM Products);
```

The database runs the inner query first (average ≈ 2,567), then the outer query compares each price to it.

Use one in SELECT to show the comparison:

```try-sql
SELECT Name,
       Price,
       ROUND((SELECT AVG(Price) FROM Products)) AS AvgPrice,
       Price - ROUND((SELECT AVG(Price) FROM Products)) AS Difference
FROM Products
ORDER BY Difference DESC;
```

The most expensive product, without LIMIT:

```try-sql
SELECT Name, Price FROM Products WHERE Price = (SELECT MAX(Price) FROM Products);
```

## Subqueries returning a list: IN and NOT IN

Customers who have placed at least one order:

```try-sql
SELECT Name FROM Customers
WHERE CustomerID IN (SELECT CustomerID FROM Orders);
```

Customers who have never ordered:

```try-sql
SELECT Name FROM Customers
WHERE CustomerID NOT IN (SELECT CustomerID FROM Orders);
```

:::warning NOT IN and NULL
If the subquery returns any NULL, `NOT IN` returns no rows at all (because "x is not equal to unknown" is unknown). Add `WHERE CustomerID IS NOT NULL` inside the subquery, or use `NOT EXISTS`.
:::

Products bought by Nairobi customers (a subquery inside a subquery):

```try-sql
SELECT Name FROM Products
WHERE ProductID IN (
  SELECT ProductID FROM Orders
  WHERE CustomerID IN (SELECT CustomerID FROM Customers WHERE City = 'Nairobi')
);
```

## Correlated subqueries

A **correlated** subquery refers to the outer query's current row, so it runs once per row.

Products that cost more than the average **of their own category**:

```try-sql
SELECT p.Name, p.Category, p.Price
FROM Products p
WHERE p.Price > (
  SELECT AVG(p2.Price) FROM Products p2 WHERE p2.Category = p.Category
);
```

Each customer's most recent order date:

```try-sql
SELECT c.Name,
       (SELECT MAX(o.OrderDate) FROM Orders o WHERE o.CustomerID = c.CustomerID) AS LastOrder
FROM Customers c;
```

### EXISTS and NOT EXISTS

`EXISTS` is true if the subquery returns at least one row. It's often clearer and safer than IN/NOT IN:

```try-sql
SELECT c.Name
FROM Customers c
WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID);
```

## Subqueries in FROM (derived tables)

A subquery in FROM acts as a temporary table. It must have an alias:

```try-sql
SELECT ROUND(AVG(Total), 2) AS AvgUnitsPerCustomer
FROM (
  SELECT CustomerID, SUM(Quantity) AS Total
  FROM Orders
  GROUP BY CustomerID
) AS t;
```

## CTEs: WITH

A **Common Table Expression** names a subquery at the top so the main query reads like steps:

```try-sql
WITH CustomerSpend AS (
  SELECT o.CustomerID, SUM(o.Quantity * p.Price) AS Spent
  FROM Orders o
  JOIN Products p ON p.ProductID = o.ProductID
  GROUP BY o.CustomerID
)
SELECT c.Name, cs.Spent
FROM CustomerSpend cs
JOIN Customers c ON c.CustomerID = cs.CustomerID
ORDER BY cs.Spent DESC;
```

Several CTEs, each using the ones before:

```try-sql
WITH Spend AS (
  SELECT o.CustomerID, SUM(o.Quantity * p.Price) AS Spent
  FROM Orders o JOIN Products p ON p.ProductID = o.ProductID
  GROUP BY o.CustomerID
),
Average AS (
  SELECT AVG(Spent) AS AvgSpent FROM Spend
)
SELECT c.Name, s.Spent, ROUND(a.AvgSpent) AS AvgSpent,
       CASE WHEN s.Spent > a.AvgSpent THEN 'Above average' ELSE 'Below average' END AS Segment
FROM Spend s
JOIN Customers c ON c.CustomerID = s.CustomerID
CROSS JOIN Average a
ORDER BY s.Spent DESC;
```

CTEs make complex reports readable, and they're used heavily in data analysis jobs. A **recursive CTE** can even generate sequences or walk hierarchies:

```try-sql
WITH RECURSIVE Days(d) AS (
  SELECT '2026-09-01'
  UNION ALL
  SELECT DATE(d, '+1 day') FROM Days WHERE d < '2026-09-07'
)
SELECT d AS Day FROM Days;
```

## Views: saved queries

A **view** is a named, saved query that behaves like a read-only table:

```try-sql
CREATE VIEW OrderDetails AS
SELECT o.OrderID, o.OrderDate, c.Name AS Customer, c.City,
       p.Name AS Product, o.Quantity, p.Price,
       o.Quantity * p.Price AS LineTotal
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p ON p.ProductID = o.ProductID;

SELECT Customer, Product, LineTotal FROM OrderDetails WHERE City = 'Kisumu';
```

```try-sql
CREATE VIEW OrderDetails AS
SELECT o.OrderID, c.City, o.Quantity * p.Price AS LineTotal
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p ON p.ProductID = o.ProductID;

SELECT City, SUM(LineTotal) AS Revenue FROM OrderDetails GROUP BY City ORDER BY Revenue DESC;
```

Why use views:
- **Simplicity**: analysts query `OrderDetails` without writing joins.
- **Consistency**: everyone uses the same definition of "revenue".
- **Security**: give a user access to a view that hides sensitive columns (like phone numbers) instead of the full table.

A view stores the query, not the data, so it always shows current data. Remove one with `DROP VIEW OrderDetails;`.

## UNION and friends: stacking results

`UNION` combines the rows of two queries with the **same number of columns** and compatible types:

```try-sql
SELECT Name, 'Customer' AS Type FROM Customers WHERE City = 'Kisumu'
UNION
SELECT Name, 'Product' AS Type FROM Products WHERE Category = 'Storage';
```

| Operator | Result |
|---|---|
| `UNION` | Rows from both, duplicates removed |
| `UNION ALL` | Rows from both, duplicates kept (faster) |
| `INTERSECT` | Rows in both results |
| `EXCEPT` | Rows in the first but not the second (Oracle: `MINUS`) |

```try-sql
-- Cities that have customers but no orders
SELECT City FROM Customers
EXCEPT
SELECT c.City FROM Orders o JOIN Customers c ON c.CustomerID = o.CustomerID;
```

## Join or subquery?

| Use a JOIN when... | Use a subquery/CTE when... |
|---|---|
| You need columns from both tables in the result | You only need to filter by another table |
| Simple relationships | Multi-step logic (aggregate, then compare) |
| | Readability: naming steps with CTEs |

Modern databases often optimise both into the same plan, so choose the clearest one.

:::think Write the steps (in words) for: "Show customers who spent more than KSh 5,000 in total, with their city."
Step 1: a CTE that totals each customer's spending (Orders JOIN Products, GROUP BY CustomerID). Step 2: join it to Customers for name and city. Step 3: filter `WHERE Spent > 5000` (or use HAVING in step 1).
:::

## Summary

- Scalar subqueries return one value; IN/NOT IN subqueries return a list (beware NULL with NOT IN).
- Correlated subqueries run per row; EXISTS/NOT EXISTS test for matching rows.
- Subqueries in FROM need an alias; CTEs (WITH) name steps and make complex queries readable; recursive CTEs generate sequences.
- Views save queries for simplicity, consistency and security.
- UNION, UNION ALL, INTERSECT and EXCEPT combine results with matching columns.

```quiz
Q: Which keyword starts a CTE?
A: WITH
Q: Which operator combines two results and removes duplicates?
A: UNION
Q: Which keeps duplicates: UNION or UNION ALL?
A: UNION ALL
Q: A saved query that behaves like a table is called a what?
A: view | a view
Q: Which keyword tests whether a subquery returns any rows?
A: EXISTS
Q: Which operator returns rows in the first result but not the second (SQLite)?
A: EXCEPT
```

=== exercise ===
Select the **Name** of products that cost more than the **average** price, using a subquery.
=== starter ===

=== expected ===
External hard disk 1TB
=== must_contain ===
SELECT
AVG
