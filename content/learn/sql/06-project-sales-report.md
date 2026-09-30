---
slug: project-sales-report
title: Project: a business sales report in SQL
---
# Project: a business sales report in SQL

The owner of our shop asks you: *"How is the business doing?"* In this project you'll answer with real SQL queries, the way a data analyst or back-end developer would. Each query is a section of the report.

## 1. The headline numbers

```try-sql
SELECT COUNT(DISTINCT o.OrderID)            AS Orders,
       COUNT(DISTINCT o.CustomerID)         AS Customers,
       SUM(o.Quantity)                      AS ItemsSold,
       SUM(o.Quantity * p.Price)            AS Revenue,
       ROUND(AVG(o.Quantity * p.Price))     AS AvgOrderValue
FROM Orders o
JOIN Products p ON p.ProductID = o.ProductID;
```

## 2. Revenue by category

```try-sql
SELECT p.Category,
       SUM(o.Quantity) AS Items,
       SUM(o.Quantity * p.Price) AS Revenue,
       ROUND(100.0 * SUM(o.Quantity * p.Price) / (SELECT SUM(o2.Quantity * p2.Price) FROM Orders o2 JOIN Products p2 ON p2.ProductID = o2.ProductID), 1) AS SharePct
FROM Orders o
JOIN Products p ON p.ProductID = o.ProductID
GROUP BY p.Category
ORDER BY Revenue DESC;
```

## 3. Best customers

```try-sql
SELECT c.Name, c.City,
       COUNT(*) AS Orders,
       SUM(o.Quantity * p.Price) AS Spent,
       RANK() OVER (ORDER BY SUM(o.Quantity * p.Price) DESC) AS Position
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p  ON p.ProductID = o.ProductID
GROUP BY c.CustomerID
ORDER BY Spent DESC;
```

## 4. Sales by town

```try-sql
SELECT c.City, SUM(o.Quantity * p.Price) AS Revenue, COUNT(DISTINCT c.CustomerID) AS Buyers
FROM Customers c
LEFT JOIN Orders o  ON o.CustomerID = c.CustomerID
LEFT JOIN Products p ON p.ProductID = o.ProductID
GROUP BY c.City
ORDER BY Revenue DESC;
```

The `LEFT JOIN` keeps towns whose customers haven't ordered, so they show with an empty revenue: a sales opportunity.

## 5. Products that never sold

Every product in the sample has sold, so first we add a new one that hasn't:

```try-sql
INSERT INTO Products VALUES (7, 'Laptop stand', 'Accessories', 1800);

SELECT p.Name, p.Price
FROM Products p
LEFT JOIN Orders o ON o.ProductID = p.ProductID
WHERE o.OrderID IS NULL;
```

## 6. Month by month

```try-sql
SELECT STRFTIME('%Y-%m', o.OrderDate) AS Month,
       COUNT(*) AS Orders,
       SUM(o.Quantity * p.Price) AS Revenue
FROM Orders o
JOIN Products p ON p.ProductID = o.ProductID
GROUP BY Month
ORDER BY Month;
```

## 7. Save it as a view

A **view** is a saved query you can use like a table. The website's dashboard can now just `SELECT * FROM SalesLines`.

```try-sql
CREATE VIEW SalesLines AS
SELECT o.OrderID, o.OrderDate, c.Name AS Customer, c.City, p.Name AS Product, p.Category,
       o.Quantity, p.Price, o.Quantity * p.Price AS Amount
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p  ON p.ProductID = o.ProductID;

SELECT Customer, Product, Amount FROM SalesLines WHERE City = 'Nairobi';
SELECT Category, SUM(Amount) FROM SalesLines GROUP BY Category;
```

## Writing up your findings

A report is more than numbers. Turn your results into 3–5 sentences, for example:

> *Revenue so far is KSh X from Y orders. Storage items bring in the most money (Z%). Kamau Njoroge is our top customer. The new laptop stand hasn't sold yet: consider a promotion. Eldoret customers haven't ordered yet.*

## Challenges

1. Which day of the week gets the most orders? (Hint: `STRFTIME('%w', OrderDate)`.)
2. Add a `Discount` column to Orders and recalculate revenue.
3. Find customers who ordered more than one different product.
4. Build a query that a dashboard could use for a "last 30 days" chart.

```quiz
Q: Which join keeps rows from the first table even when there is no match?
A: LEFT JOIN | LEFT | left outer join
Q: What is a saved query you can use like a table called?
A: view | a view
Q: How do you find products with no orders after a LEFT JOIN? Complete: WHERE o.OrderID IS ...
A: NULL
```
