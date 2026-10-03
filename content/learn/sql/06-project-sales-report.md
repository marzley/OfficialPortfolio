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

## How analysts turn queries into decisions

A sales report is only useful if it leads to action: restock fast-moving products, reward loyal customers, run a promotion in a quiet town, drop products that never sell. Analysts in retail chains, banks, telcos, NGOs and startups follow the same process you're practising here: ask clear questions, write queries, check the results, and write findings in plain language for managers.

## Step 0: understand and check the data first

Before reporting, check data quality. Wrong data gives confident but wrong answers.

```try-sql
-- Row counts and date range
SELECT COUNT(*) AS Orders, MIN(OrderDate) AS FirstOrder, MAX(OrderDate) AS LastOrder FROM Orders;

-- Orders pointing to customers or products that do not exist (should be 0)
SELECT COUNT(*) AS OrphanOrders
FROM Orders o
LEFT JOIN Customers c ON c.CustomerID = o.CustomerID
LEFT JOIN Products p ON p.ProductID = o.ProductID
WHERE c.CustomerID IS NULL OR p.ProductID IS NULL;

-- Suspicious values
SELECT * FROM Orders WHERE Quantity <= 0 OR Quantity > 100;
```

## Key performance indicators (KPIs) in one query

```try-sql
WITH lines AS (
  SELECT o.OrderID, o.CustomerID, o.Quantity, p.Price, o.Quantity * p.Price AS Amount
  FROM Orders o JOIN Products p ON p.ProductID = o.ProductID
)
SELECT
  COUNT(DISTINCT OrderID)                       AS Orders,
  COUNT(DISTINCT CustomerID)                    AS ActiveCustomers,
  SUM(Quantity)                                 AS UnitsSold,
  SUM(Amount)                                   AS Revenue,
  ROUND(SUM(Amount) * 1.0 / COUNT(DISTINCT OrderID), 0)     AS AvgOrderValue,
  ROUND(SUM(Amount) * 1.0 / COUNT(DISTINCT CustomerID), 0)  AS RevenuePerCustomer
FROM lines;
```

| KPI | Why managers care |
|---|---|
| Revenue | Overall size of the business |
| Average order value | Are customers buying more per visit? Bundles and upselling raise it |
| Active customers | Is the customer base growing? |
| Revenue per customer | Value of each customer; guides marketing spend |
| Repeat customer rate | Loyalty; cheaper than finding new customers |

## Repeat customers

```try-sql
WITH counts AS (
  SELECT CustomerID, COUNT(*) AS Orders FROM Orders GROUP BY CustomerID
)
SELECT
  SUM(CASE WHEN Orders > 1 THEN 1 ELSE 0 END) AS RepeatCustomers,
  COUNT(*) AS BuyingCustomers,
  ROUND(100.0 * SUM(CASE WHEN Orders > 1 THEN 1 ELSE 0 END) / COUNT(*), 1) AS RepeatRatePct
FROM counts;
```

## Month-over-month growth

```try-sql
WITH monthly AS (
  SELECT strftime('%Y-%m', o.OrderDate) AS Month, SUM(o.Quantity * p.Price) AS Revenue
  FROM Orders o JOIN Products p ON p.ProductID = o.ProductID
  GROUP BY Month
)
SELECT Month, Revenue,
  LAG(Revenue) OVER (ORDER BY Month) AS PrevMonth,
  ROUND(100.0 * (Revenue - LAG(Revenue) OVER (ORDER BY Month)) / LAG(Revenue) OVER (ORDER BY Month), 1) AS GrowthPct
FROM monthly;
```

With only two months of sample data, be careful: small numbers swing a lot. Real reports compare the same period across years too, to account for seasons (school opening, December holidays).

## Category mix and Pareto (80/20) analysis

```try-sql
WITH rev AS (
  SELECT p.Name, SUM(o.Quantity * p.Price) AS Revenue
  FROM Orders o JOIN Products p ON p.ProductID = o.ProductID
  GROUP BY p.ProductID
)
SELECT Name, Revenue,
  ROUND(100.0 * SUM(Revenue) OVER (ORDER BY Revenue DESC) / SUM(Revenue) OVER (), 1) AS CumulativePct
FROM rev
ORDER BY Revenue DESC;
```

Often a small share of products brings most of the revenue (the Pareto principle). Those products should never run out of stock.

## Customer segments (simple RFM idea)

**RFM** groups customers by Recency (how recently they bought), Frequency (how often) and Monetary value (how much):

```try-sql
WITH c AS (
  SELECT cu.Name,
    MAX(o.OrderDate) AS LastOrder,
    COUNT(*) AS Frequency,
    SUM(o.Quantity * p.Price) AS Monetary
  FROM Orders o
  JOIN Customers cu ON cu.CustomerID = o.CustomerID
  JOIN Products p ON p.ProductID = o.ProductID
  GROUP BY cu.CustomerID
)
SELECT Name, LastOrder, Frequency, Monetary,
  CASE
    WHEN Monetary >= 5000 THEN 'High value'
    WHEN LastOrder >= '2026-09-01' THEN 'Recent'
    ELSE 'Needs follow-up'
  END AS Segment
FROM c
ORDER BY Monetary DESC;
```

Segments guide actions: thank and reward high-value customers, send offers to those who haven't bought recently.

## From SQL to a dashboard

- Save key queries as **views** so dashboards always use the same logic.
- Connect a dashboard tool (Looker Studio, Power BI, Metabase or Excel's Get Data) to the database or an exported CSV.
- Use simple visuals: KPI cards, a monthly line chart, a bar chart of top products, a table of customers to follow up.
- Schedule refreshes (daily or weekly).

## Writing the findings

A short report for a manager might read:

> **September summary.** Revenue was KSh X from Y orders (average order KSh Z). Two products produced most revenue: keep them in stock. One customer bought twice; most bought once, so a follow-up offer could increase repeat purchases. Mombasa and Eldoret have few orders: consider local promotions. Data note: only two months of data, so trends are early indications.

Use plain language, round numbers sensibly, and state limitations honestly.

## Practice

1. Calculate the KPIs for August only, then September only, and compare.
2. Find the repeat customer rate.
3. Build the Pareto table and identify the products making up 80% of revenue.
4. Create a view `customer_summary` with each customer's orders, spend and last order date.
5. Write a five-sentence findings summary for the shop owner.

:::think Average order value rose from KSh 2,000 to KSh 3,000, but total revenue fell. How is that possible, and what would you check?
Fewer orders were placed, even though each was bigger (for example, a few large purchases replacing many small ones). Check the number of orders and active customers, whether a few unusually large orders distort the average (look at the median or exclude outliers), and whether some customer group or town stopped buying.
:::

```quiz
Q: Which join keeps rows from the first table even when there is no match?
A: LEFT JOIN | LEFT | left outer join
Q: What is a saved query you can use like a table called?
A: view | a view
Q: How do you find products with no orders after a LEFT JOIN? Complete: WHERE o.OrderID IS ...
A: NULL
Q: What does AOV stand for? (three words)
A: average order value
Q: What principle says a small share of products often brings most revenue? (one word or 80/20)
A: Pareto | 80/20
Q: In RFM analysis, what does F stand for?
A: frequency
```
