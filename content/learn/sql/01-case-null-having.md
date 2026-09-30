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
```
=== exercise ===
List each **Category** with the number of products in it, using `GROUP BY` and `COUNT(*)`.
=== starter ===
-- your query here
=== must_contain ===
Category
COUNT(*)
GROUP BY
