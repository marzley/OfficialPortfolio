---
slug: functions-group
title: "Aggregate functions and GROUP BY: COUNT, SUM, AVG, MIN, MAX and summary reports"
after: KEEP
---
# Aggregate functions and GROUP BY: COUNT, SUM, AVG, MIN, MAX and summary reports

Managers rarely want to see every single row. They ask summary questions: *How many customers do we have? What's our total revenue? What's the average price per category? Which town buys the most?* **Aggregate functions** turn many rows into one number, and **GROUP BY** produces one summary row per group. This is the heart of reporting, dashboards and business analysis, and it's one of the most tested SQL topics in job interviews.

:::note What you will learn
- The five core aggregates: COUNT, SUM, AVG, MIN, MAX
- COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column)
- GROUP BY one or several columns
- The golden rule of GROUP BY
- Sorting and limiting grouped results
- Filtering before grouping (WHERE) and after (HAVING, introduced here)
- Building real business summaries
:::

## Aggregate functions

| Function | Returns |
|---|---|
| `COUNT(*)` | number of rows |
| `COUNT(column)` | number of non-NULL values in the column |
| `COUNT(DISTINCT column)` | number of different values |
| `SUM(column)` | total |
| `AVG(column)` | average (mean) |
| `MIN(column)` / `MAX(column)` | smallest / largest |

```try-sql
SELECT COUNT(*) AS Customers FROM Customers;
```

```try-sql
SELECT COUNT(*) AS Products,
       SUM(Price) AS TotalOfPrices,
       ROUND(AVG(Price), 2) AS AveragePrice,
       MIN(Price) AS Cheapest,
       MAX(Price) AS MostExpensive
FROM Products;
```

### COUNT variations

```try-sql
SELECT COUNT(*) AS AllRows,
       COUNT(City) AS RowsWithCity,
       COUNT(DISTINCT City) AS DifferentCities
FROM Customers;
```

`COUNT(column)` skips NULL values; `COUNT(*)` counts every row. All aggregates except `COUNT(*)` ignore NULLs.

### MIN and MAX work on text and dates too

```try-sql
SELECT MIN(OrderDate) AS FirstOrder, MAX(OrderDate) AS LatestOrder FROM Orders;
```

### Aggregates with WHERE

`WHERE` filters rows **before** they're aggregated:

```try-sql
SELECT COUNT(*) AS NairobiCustomers FROM Customers WHERE City = 'Nairobi';
```

```try-sql
SELECT SUM(Quantity) AS UnitsSoldInAugust
FROM Orders
WHERE OrderDate BETWEEN '2026-08-01' AND '2026-08-31';
```

## GROUP BY: one row per group

How many customers are in each city?

```try-sql
SELECT City, COUNT(*) AS Customers
FROM Customers
GROUP BY City;
```

The database:
1. Splits the rows into groups with the same City.
2. Runs `COUNT(*)` on each group.
3. Returns one row per group.

| City | Customers |
|---|---|
| Eldoret | 1 |
| Kisumu | 2 |
| Mombasa | 1 |
| Nairobi | 2 |
| Nakuru | 1 |

More examples:

```try-sql
SELECT Category,
       COUNT(*) AS Products,
       MIN(Price) AS Cheapest,
       MAX(Price) AS Dearest,
       ROUND(AVG(Price)) AS AveragePrice
FROM Products
GROUP BY Category;
```

```try-sql
-- Units sold per product
SELECT ProductID, SUM(Quantity) AS UnitsSold
FROM Orders
GROUP BY ProductID
ORDER BY UnitsSold DESC;
```

## The golden rule of GROUP BY

Every column in `SELECT` must either be:
1. listed in `GROUP BY`, or
2. inside an aggregate function.

```sql
-- Wrong idea: which Name should the database show for the whole city group?
SELECT City, Name, COUNT(*) FROM Customers GROUP BY City;
```

PostgreSQL, SQL Server and strict MySQL reject this with an error. SQLite allows it but picks an arbitrary Name, which gives misleading results. Follow the rule always.

## Grouping by several columns

One row for each combination:

```try-sql
SELECT CustomerID, ProductID, SUM(Quantity) AS Units
FROM Orders
GROUP BY CustomerID, ProductID
ORDER BY CustomerID;
```

Group by month using a date function (`SUBSTR` takes the first 7 characters, `YYYY-MM`):

```try-sql
SELECT SUBSTR(OrderDate, 1, 7) AS Month,
       COUNT(*) AS Orders,
       SUM(Quantity) AS Units
FROM Orders
GROUP BY Month
ORDER BY Month;
```

## Sorting and top groups

Which city has the most customers?

```try-sql
SELECT City, COUNT(*) AS Customers
FROM Customers
GROUP BY City
ORDER BY Customers DESC, City
LIMIT 1;
```

Notice two cities tie at 2. Adding `City` as a second sort makes the result predictable.

## HAVING: filter groups after aggregation

`WHERE` can't use aggregates because it runs before grouping. `HAVING` filters the groups:

```try-sql
SELECT City, COUNT(*) AS Customers
FROM Customers
GROUP BY City
HAVING COUNT(*) >= 2;
```

| Clause | Filters | Can use aggregates? |
|---|---|---|
| `WHERE` | rows, before grouping | No |
| `HAVING` | groups, after grouping | Yes |

Both together:

```try-sql
-- Categories whose products over KSh 1,000 average more than KSh 3,000
SELECT Category, ROUND(AVG(Price)) AS AvgPrice
FROM Products
WHERE Price > 1000
GROUP BY Category
HAVING AVG(Price) > 3000;
```

## A business summary

Revenue needs Price from Products and Quantity from Orders. That needs a JOIN (next lessons), but here's a preview of a real sales report:

```try-sql
SELECT p.Category,
       SUM(o.Quantity) AS Units,
       SUM(o.Quantity * p.Price) AS Revenue
FROM Orders o
JOIN Products p ON p.ProductID = o.ProductID
GROUP BY p.Category
ORDER BY Revenue DESC;
```

## Common mistakes

| Mistake | Fix |
|---|---|
| `WHERE COUNT(*) > 1` | Use `HAVING COUNT(*) > 1` |
| Selecting a non-grouped column | Add it to GROUP BY or wrap it in an aggregate |
| `AVG` on whole numbers looks rounded | SQLite's AVG returns a decimal; use `ROUND(AVG(x), 2)` to tidy it |
| Forgetting that NULLs are skipped | Use `COUNT(*)` to count rows, or `COALESCE` to treat NULL as 0 |

:::think A report shows "Average order quantity: 1.57". Your manager asks for the average quantity *per customer*, i.e. first total each customer's quantity, then average those totals. How would you do it?
Two steps: group by customer to get totals, then average them with a subquery: `SELECT AVG(Total) FROM (SELECT CustomerID, SUM(Quantity) AS Total FROM Orders GROUP BY CustomerID);`. The subqueries lesson covers this technique.
:::

## Summary

- COUNT, SUM, AVG, MIN and MAX turn many rows into one value; they skip NULLs (except COUNT(*)).
- COUNT(DISTINCT column) counts different values.
- GROUP BY makes one summary row per group; every selected column must be grouped or aggregated.
- WHERE filters rows before grouping; HAVING filters groups after.
- Combine with ORDER BY and LIMIT for "top" reports.

```quiz
Q: Which function adds up values in a column?
A: SUM
Q: Which counts every row including NULLs: COUNT(*) or COUNT(column)?
A: COUNT(*)
Q: Which clause filters groups after aggregation?
A: HAVING
Q: Can WHERE use COUNT(*) in its condition? (yes/no)
A: no
Q: How many different cities are in the Customers table?
A: 5 | five
Q: Which function returns the average?
A: AVG
```

=== exercise ===
Count how many products are in each **Category** (use `GROUP BY`).
=== starter ===

=== expected ===
Accessories,2
=== must_contain ===
GROUP BY
