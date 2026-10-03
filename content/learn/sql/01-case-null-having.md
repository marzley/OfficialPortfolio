---
slug: case-null-having
title: CASE, NULL values and HAVING
after: functions-group
---
# CASE, NULL values and HAVING

Three tools that make reports smarter: **CASE** labels data, **NULL handling** avoids silent mistakes, and **HAVING** filters groups.

## CASE: if/else inside a query

```try-sql
SELECT Name, Price,
  CASE
    WHEN Price >= 5000 THEN 'Premium'
    WHEN Price >= 1500 THEN 'Mid-range'
    ELSE 'Budget'
  END AS PriceBand
FROM Products
ORDER BY Price DESC;
```

`CASE` checks each `WHEN` in order and uses the first that matches. `AS` gives the new column a name.

CASE also works inside totals, for example counting by condition:

```try-sql
SELECT
  COUNT(*) AS AllProducts,
  SUM(CASE WHEN Price < 1500 THEN 1 ELSE 0 END) AS Budget,
  SUM(CASE WHEN Category = 'Storage' THEN 1 ELSE 0 END) AS StorageItems
FROM Products;
```

## NULL: "unknown" or "missing"

`NULL` is not zero and not an empty string. It means **no value**. Let's add a customer with no phone and a product with no price:

```try-sql
INSERT INTO Customers (CustomerID, Name, City, Phone) VALUES (8, 'Baraka Mutua', 'Machakos', NULL);
INSERT INTO Products VALUES (7, 'Keyboard', 'Accessories', NULL);

SELECT Name, Phone FROM Customers WHERE Phone IS NULL;
SELECT Name, COALESCE(Phone, 'no phone') AS Contact FROM Customers;
SELECT COUNT(*) AS AllRows, COUNT(Price) AS WithPrice, AVG(Price) AS AvgPrice FROM Products;
```

Rules to remember:

| Rule | Example |
|---|---|
| Test with `IS NULL` / `IS NOT NULL`, never `= NULL` | `WHERE Phone IS NULL` |
| Any maths with NULL gives NULL | `NULL + 5` → `NULL` |
| `COUNT(*)` counts rows; `COUNT(col)` skips NULLs | see above |
| `SUM`, `AVG`, `MIN`, `MAX` ignore NULLs | |
| `COALESCE(a, b, ...)` returns the first non-NULL | `COALESCE(Phone, 'none')` |

```try-sql
SELECT NULL = NULL AS EqualsTest, NULL IS NULL AS IsTest, 5 + NULL AS MathsTest;
```

## GROUP BY recap and HAVING

`WHERE` filters **rows before** grouping. `HAVING` filters **groups after** grouping.

```try-sql
-- Total quantity ordered per customer, only customers who ordered 2 or more items
SELECT c.Name, SUM(o.Quantity) AS Items
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
GROUP BY c.Name
HAVING SUM(o.Quantity) >= 2
ORDER BY Items DESC;
```

```try-sql
-- Categories with more than one product, and their average price
SELECT Category, COUNT(*) AS Products, ROUND(AVG(Price)) AS AvgPrice
FROM Products
WHERE Price IS NOT NULL
GROUP BY Category
HAVING COUNT(*) > 1;
```

## The order SQL runs a query

You write clauses in this order, but the database logically runs them in a different one. Knowing it explains why you can't use a column alias in `WHERE`:

| Written | Runs |
|---|---|
| 1. SELECT | 5 |
| 2. FROM / JOIN | 1 |
| 3. WHERE | 2 |
| 4. GROUP BY | 3 |
| 5. HAVING | 4 |
| 6. ORDER BY | 6 |
| 7. LIMIT | 7 |

## Revenue report with everything

```try-sql
SELECT p.Category,
       SUM(o.Quantity * p.Price) AS Revenue,
       CASE WHEN SUM(o.Quantity * p.Price) >= 5000 THEN 'Top seller' ELSE 'Grow this' END AS Note
FROM Orders o
JOIN Products p ON p.ProductID = o.ProductID
GROUP BY p.Category
HAVING Revenue > 0
ORDER BY Revenue DESC;
```

## Where CASE, NULL and HAVING are used

These three features turn raw data into business answers. **CASE** labels data (big/small orders, price bands, grades). **NULL handling** prevents wrong totals and missing rows when information is incomplete, which is very common in real data (customers without emails, unpaid invoices without payment dates). **HAVING** finds groups that meet a condition, such as customers who spent over a threshold or products ordered more than a certain number of times. Analysts use them in nearly every report.

## CASE for price bands and labels

```try-sql
SELECT Name, Price,
  CASE
    WHEN Price < 1000 THEN 'Budget'
    WHEN Price < 3000 THEN 'Mid-range'
    ELSE 'Premium'
  END AS Band
FROM Products
ORDER BY Price;
```

CASE checks conditions in order and returns the first match, just like IF/ELSE IF in programming.

## Counting with CASE (pivot-style reports)

CASE inside SUM or COUNT creates columns for each category, a technique often called conditional aggregation:

```try-sql
SELECT c.City,
  COUNT(*) AS Orders,
  SUM(CASE WHEN o.OrderDate < '2026-09-01' THEN 1 ELSE 0 END) AS August,
  SUM(CASE WHEN o.OrderDate >= '2026-09-01' THEN 1 ELSE 0 END) AS September
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
GROUP BY c.City
ORDER BY Orders DESC;
```

This is the SQL equivalent of an Excel pivot table with months as columns.

## CASE in ORDER BY: custom sort orders

```try-sql
SELECT Name, City FROM Customers
ORDER BY CASE City WHEN 'Nairobi' THEN 1 WHEN 'Mombasa' THEN 2 ELSE 3 END, Name;
```

Nairobi customers appear first, then Mombasa, then everyone else alphabetically.

## How NULL behaves (and surprises people)

```try-sql
SELECT
  NULL = NULL           AS EqualsNull,      -- NULL, not true!
  NULL IS NULL          AS IsNullTest,          -- 1 (true)
  5 + NULL              AS AddNull,         -- NULL
  COALESCE(NULL, 0)     AS Coalesced,       -- 0
  IFNULL(NULL, 'none')  AS IfNullResult,    -- 'none' (SQLite/MySQL)
  NULLIF(10, 10)        AS NullIfSame;      -- NULL (useful to avoid division by zero)
```

Key rules:

- Comparisons with NULL return NULL (unknown), so `WHERE Email = NULL` never matches. Use `IS NULL` / `IS NOT NULL`.
- Aggregates like `SUM`, `AVG` and `COUNT(column)` **ignore** NULLs; `COUNT(*)` counts all rows.
- Arithmetic with NULL gives NULL; wrap values in `COALESCE(col, 0)` when a missing value should count as zero.

## NULL in outer joins: finding what's missing

```try-sql
-- Customers who have never ordered
SELECT c.Name, c.City
FROM Customers c
LEFT JOIN Orders o ON o.CustomerID = c.CustomerID
WHERE o.OrderID IS NULL;
```

A LEFT JOIN fills unmatched rows with NULLs, and `IS NULL` finds them. This is a classic interview question and a common business question ("which products never sold?").

## Safe division with NULLIF

```try-sql
SELECT p.Name,
  COALESCE(SUM(o.Quantity), 0) AS UnitsSold,
  ROUND(p.Price * 1.0 / NULLIF(COALESCE(SUM(o.Quantity), 0), 0), 1) AS PricePerUnitSold
FROM Products p
LEFT JOIN Orders o ON o.ProductID = p.ProductID
GROUP BY p.ProductID
ORDER BY UnitsSold DESC;
```

`NULLIF(x, 0)` turns 0 into NULL, so dividing by it returns NULL instead of an error.

## HAVING with several conditions

```try-sql
SELECT c.Name,
  COUNT(*) AS Orders,
  SUM(o.Quantity * p.Price) AS Spent
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p ON p.ProductID = o.ProductID
GROUP BY c.CustomerID
HAVING COUNT(*) >= 1 AND SUM(o.Quantity * p.Price) > 2000
ORDER BY Spent DESC;
```

## WHERE vs HAVING side by side

| | WHERE | HAVING |
|---|---|---|
| Filters | Individual rows | Groups |
| Runs | Before GROUP BY | After GROUP BY |
| Can use aggregates (SUM, COUNT)? | No | Yes |
| Example | `WHERE City = 'Nairobi'` | `HAVING SUM(Total) > 5000` |

Filtering with WHERE first (when possible) is faster, because fewer rows are grouped.

## Common mistakes

| Mistake | Result | Fix |
|---|---|---|
| `WHERE Phone = NULL` | No rows | `WHERE Phone IS NULL` |
| `WHERE SUM(x) > 100` | Error | Move to `HAVING` |
| Forgetting ELSE in CASE | NULL for unmatched rows | Add an ELSE |
| `SUM(a + b)` when b can be NULL | Rows with NULL b are lost from the total | `SUM(a + COALESCE(b, 0))` |
| `COUNT(column)` expecting all rows | NULLs not counted | `COUNT(*)` |

## Practice

1. Label orders as 'Single' (quantity 1) or 'Multiple' (quantity over 1) with CASE.
2. Count products per price band (Budget, Mid-range, Premium).
3. Find products that have never been ordered.
4. List cities whose customers placed more than one order in total.
5. Show each customer's total spending, showing 0 for customers with no orders.

:::think A report shows total revenue per customer, but customers with no orders are missing. How do you include them with 0?
Start from Customers and LEFT JOIN Orders (and Products), so every customer appears, then wrap the total in COALESCE: `COALESCE(SUM(o.Quantity * p.Price), 0)`. An inner JOIN drops customers with no matching orders.
:::

```quiz
Q: How do you test for a missing value: = NULL or IS NULL?
A: IS NULL
Q: Which function returns the first value that is not NULL?
A: COALESCE
Q: Which clause filters groups after GROUP BY?
A: HAVING
Q: Which clause filters rows before grouping?
A: WHERE
Q: What is 5 + NULL?
A: NULL
Q: Which function returns NULL when two values are equal, often used to avoid division by zero?
A: NULLIF
Q: Does COUNT(*) count rows where a column is NULL? (yes or no)
A: yes
Q: Which join helps find customers who have never ordered? (two words)
A: LEFT JOIN | left outer join
```
=== exercise ===
List each **Category** with the number of products in it, using `GROUP BY` and `COUNT(*)`.
=== starter ===
-- your query here
=== must_contain ===
Category
COUNT(*)
GROUP BY
