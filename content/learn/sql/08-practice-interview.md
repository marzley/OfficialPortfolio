---
slug: sql-practice-interview
title: "SQL practice workbook and interview questions: 40 problems from easy to hard, with answers"
after: project-sales-report
---
# SQL practice workbook and interview questions: 40 problems from easy to hard, with answers

You only become good at SQL by writing lots of queries. This workbook gives you **40 problems** on the sample shop database, grouped from easy to hard, plus the theory questions interviewers ask for data analyst, developer and database roles. Try each problem yourself in a Run box before opening the answer.

:::tip How to practise
1. Read the question and say in words what the steps are.
2. Write the query in a Run box (any example below works as a scratchpad).
3. Check the result makes sense (row count, totals).
4. Only then open the answer and compare.
:::

## Reminder: the tables

| Table | Columns |
|---|---|
| Customers | CustomerID, Name, City, Phone |
| Products | ProductID, Name, Category, Price |
| Orders | OrderID, CustomerID, ProductID, Quantity, OrderDate |

```try-sql
-- Scratchpad: write your answers here
SELECT * FROM Orders;
```

---

## Level 1: SELECT, WHERE, ORDER BY

:::think 1. List all products in the Electronics category.
`SELECT * FROM Products WHERE Category = 'Electronics';`
:::

:::think 2. Show customer names and cities, sorted by city then name.
`SELECT Name, City FROM Customers ORDER BY City, Name;`
:::

:::think 3. Which products cost between KSh 1,000 and KSh 4,000?
`SELECT Name, Price FROM Products WHERE Price BETWEEN 1000 AND 4000;`
:::

:::think 4. Find customers whose name starts with "K".
`SELECT Name FROM Customers WHERE Name LIKE 'K%';`
:::

:::think 5. Show the 2 cheapest products.
`SELECT Name, Price FROM Products ORDER BY Price LIMIT 2;`
:::

:::think 6. List orders with quantity greater than 1.
`SELECT * FROM Orders WHERE Quantity > 1;`
:::

:::think 7. Show each product's price including 16% VAT, rounded.
`SELECT Name, ROUND(Price * 1.16) AS WithVAT FROM Products;`
:::

:::think 8. List distinct product categories alphabetically.
`SELECT DISTINCT Category FROM Products ORDER BY Category;`
:::

:::think 9. Customers in Kisumu or Nakuru.
`SELECT Name, City FROM Customers WHERE City IN ('Kisumu', 'Nakuru');`
:::

:::think 10. Orders placed in September 2026.
`SELECT * FROM Orders WHERE OrderDate BETWEEN '2026-09-01' AND '2026-09-30';` (or `WHERE OrderDate LIKE '2026-09%'`)
:::

## Level 2: aggregates and GROUP BY

:::think 11. How many orders are there?
`SELECT COUNT(*) FROM Orders;` → 7
:::

:::think 12. Total units sold across all orders.
`SELECT SUM(Quantity) FROM Orders;` → 11
:::

:::think 13. Average product price per category.
`SELECT Category, ROUND(AVG(Price)) FROM Products GROUP BY Category;`
:::

:::think 14. Number of customers per city, most first.
`SELECT City, COUNT(*) AS n FROM Customers GROUP BY City ORDER BY n DESC;`
:::

:::think 15. Cities with more than one customer.
`SELECT City, COUNT(*) FROM Customers GROUP BY City HAVING COUNT(*) > 1;`
:::

:::think 16. Units sold per month.
`SELECT SUBSTR(OrderDate, 1, 7) AS Month, SUM(Quantity) FROM Orders GROUP BY Month;`
:::

:::think 17. The most expensive product in each category.
`SELECT Category, MAX(Price) FROM Products GROUP BY Category;` (to also show the name, use a window function or correlated subquery; see level 4)
:::

:::think 18. How many different customers have ordered?
`SELECT COUNT(DISTINCT CustomerID) FROM Orders;` → 6
:::

:::think 19. The first and last order dates.
`SELECT MIN(OrderDate), MAX(OrderDate) FROM Orders;`
:::

:::think 20. Products per category, only categories with an average price above 2,000.
`SELECT Category, COUNT(*) FROM Products GROUP BY Category HAVING AVG(Price) > 2000;`
:::

## Level 3: joins

:::think 21. Each order with the customer's name.
`SELECT o.OrderID, c.Name FROM Orders o JOIN Customers c ON c.CustomerID = o.CustomerID;`
:::

:::think 22. Each order with product name and line total.
`SELECT o.OrderID, p.Name, o.Quantity * p.Price AS LineTotal FROM Orders o JOIN Products p ON p.ProductID = o.ProductID;`
:::

:::think 23. Total revenue.
`SELECT SUM(o.Quantity * p.Price) FROM Orders o JOIN Products p ON p.ProductID = o.ProductID;`
:::

```try-sql
-- Check your answer to 23 here
SELECT SUM(o.Quantity * p.Price) AS Revenue
FROM Orders o JOIN Products p ON p.ProductID = o.ProductID;
```

:::think 24. Revenue per city.
`SELECT c.City, SUM(o.Quantity * p.Price) AS Revenue FROM Orders o JOIN Customers c ON c.CustomerID = o.CustomerID JOIN Products p ON p.ProductID = o.ProductID GROUP BY c.City ORDER BY Revenue DESC;`
:::

:::think 25. Customers who never ordered.
`SELECT c.Name FROM Customers c LEFT JOIN Orders o ON o.CustomerID = c.CustomerID WHERE o.OrderID IS NULL;` → Kiprop Kiptoo
:::

:::think 26. Number of orders per customer, including zero.
`SELECT c.Name, COUNT(o.OrderID) FROM Customers c LEFT JOIN Orders o ON o.CustomerID = c.CustomerID GROUP BY c.CustomerID, c.Name;`
:::

:::think 27. Which products did Wanjiku Mwangi buy?
`SELECT p.Name FROM Orders o JOIN Customers c ON c.CustomerID = o.CustomerID JOIN Products p ON p.ProductID = o.ProductID WHERE c.Name = 'Wanjiku Mwangi';`
:::

:::think 28. Revenue per category.
`SELECT p.Category, SUM(o.Quantity * p.Price) FROM Orders o JOIN Products p ON p.ProductID = o.ProductID GROUP BY p.Category;`
:::

:::think 29. Pairs of customers in the same city.
`SELECT a.Name, b.Name, a.City FROM Customers a JOIN Customers b ON a.City = b.City AND a.CustomerID < b.CustomerID;`
:::

:::think 30. The best-selling product by units.
`SELECT p.Name, SUM(o.Quantity) AS Units FROM Orders o JOIN Products p ON p.ProductID = o.ProductID GROUP BY p.ProductID, p.Name ORDER BY Units DESC LIMIT 1;`
:::

## Level 4: subqueries, CTEs and window functions

:::think 31. Products priced above the average.
`SELECT Name FROM Products WHERE Price > (SELECT AVG(Price) FROM Products);`
:::

:::think 32. The customer who spent the most.
`WITH s AS (SELECT o.CustomerID, SUM(o.Quantity * p.Price) AS Spent FROM Orders o JOIN Products p ON p.ProductID = o.ProductID GROUP BY o.CustomerID) SELECT c.Name, s.Spent FROM s JOIN Customers c ON c.CustomerID = s.CustomerID ORDER BY s.Spent DESC LIMIT 1;`
:::

:::think 33. Rank products by price within each category.
`SELECT Category, Name, Price, RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS rnk FROM Products;`
:::

:::think 34. The most expensive product in each category, with its name.
`SELECT Category, Name, Price FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY Category ORDER BY Price DESC) AS rn FROM Products) WHERE rn = 1;`
:::

:::think 35. Running total of units by order date.
`SELECT OrderDate, Quantity, SUM(Quantity) OVER (ORDER BY OrderDate, OrderID) AS RunningUnits FROM Orders;`
:::

:::think 36. Each customer's first order date.
`SELECT c.Name, MIN(o.OrderDate) FROM Customers c JOIN Orders o ON o.CustomerID = c.CustomerID GROUP BY c.CustomerID, c.Name;`
:::

:::think 37. Customers who bought something from the Storage category (use EXISTS).
`SELECT c.Name FROM Customers c WHERE EXISTS (SELECT 1 FROM Orders o JOIN Products p ON p.ProductID = o.ProductID WHERE o.CustomerID = c.CustomerID AND p.Category = 'Storage');`
:::

:::think 38. Each category's share of total revenue (percent).
`WITH r AS (SELECT p.Category, SUM(o.Quantity * p.Price) AS Rev FROM Orders o JOIN Products p ON p.ProductID = o.ProductID GROUP BY p.Category) SELECT Category, Rev, ROUND(100.0 * Rev / (SELECT SUM(Rev) FROM r), 1) AS Pct FROM r ORDER BY Rev DESC;`
:::

:::think 39. Days between each order and the previous order.
`SELECT OrderID, OrderDate, JULIANDAY(OrderDate) - JULIANDAY(LAG(OrderDate) OVER (ORDER BY OrderDate)) AS DaysSincePrev FROM Orders;`
:::

:::think 40. Find duplicate city names in Customers (a classic interview question).
`SELECT City, COUNT(*) FROM Customers GROUP BY City HAVING COUNT(*) > 1;` The same GROUP BY + HAVING pattern finds duplicate emails, phones or M-Pesa references in any table.
:::

```try-sql
-- Try 38 here: each category's share of revenue
WITH r AS (
  SELECT p.Category, SUM(o.Quantity * p.Price) AS Rev
  FROM Orders o JOIN Products p ON p.ProductID = o.ProductID
  GROUP BY p.Category
)
SELECT Category, Rev, ROUND(100.0 * Rev / (SELECT SUM(Rev) FROM r), 1) AS Pct
FROM r ORDER BY Rev DESC;
```

---

## Theory questions interviewers ask

| Question | Short answer |
|---|---|
| What's the difference between WHERE and HAVING? | WHERE filters rows before grouping; HAVING filters groups after aggregation |
| INNER vs LEFT JOIN? | INNER returns matches only; LEFT keeps all left rows with NULLs where unmatched |
| Primary key vs unique key? | Both unique; a table has one primary key (never NULL) but can have many unique constraints |
| What is a foreign key? | A column referencing another table's primary key, enforcing referential integrity |
| What is normalisation? | Organising tables to remove redundancy (1NF, 2NF, 3NF) |
| DELETE vs TRUNCATE vs DROP? | DELETE removes chosen rows (can roll back); TRUNCATE quickly empties a table; DROP removes the table itself |
| What is an index? Downsides? | A lookup structure that speeds reads; costs storage and slows writes |
| What is a transaction? ACID? | A unit of work; Atomicity, Consistency, Isolation, Durability |
| UNION vs UNION ALL? | UNION removes duplicates; UNION ALL keeps them and is faster |
| What is a view? | A saved query used like a table |
| RANK vs DENSE_RANK vs ROW_NUMBER? | RANK leaves gaps after ties, DENSE_RANK doesn't, ROW_NUMBER is always unique |
| How do you prevent SQL injection? | Parameterised queries/prepared statements, least-privilege users, input validation |
| What does NULL mean? Why can't you use = NULL? | Unknown/missing; comparisons with NULL are unknown, so use IS NULL |
| What is a CTE? | A named temporary result defined with WITH |

## A study plan for SQL jobs

1. Finish every lesson in this subject and redo the exercises without looking.
2. Do this workbook twice, a week apart.
3. Practise on free sites (SQLBolt, SQLZoo, Mode's SQL tutorial, HackerRank and LeetCode database problems).
4. Build a portfolio project: import a public Kenyan dataset (e.g. from the KNBS or Kenya Open Data portal, or Kaggle) into SQLite or PostgreSQL, write 15 analysis queries, and publish them on GitHub with a short write-up.
5. Learn one tool on top: Excel/Power Query, Power BI or Looker Studio dashboards connected to SQL.

## Summary

- Practise in levels: basics → aggregates → joins → subqueries, CTEs and window functions.
- Say the steps in words before writing the query, then sanity-check results.
- Know the common theory answers (WHERE vs HAVING, joins, keys, normalisation, indexes, ACID, injection).
- Build a public SQL portfolio project with real data.

```quiz
Q: How many orders are in the sample Orders table?
A: 7 | seven
Q: Which clause finds duplicates together with GROUP BY? 
A: HAVING
Q: Which window function always gives unique numbers, even for ties?
A: ROW_NUMBER | ROW_NUMBER()
Q: Which command removes a whole table including its structure?
A: DROP | DROP TABLE
Q: What does the A in ACID stand for?
A: Atomicity
```
