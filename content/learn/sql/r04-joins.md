---
slug: joins
title: "JOIN: combining tables with INNER, LEFT, RIGHT, FULL, self and cross joins"
after: KEEP
---
# JOIN: combining tables with INNER, LEFT, RIGHT, FULL, self and cross joins

Good databases split data into separate tables so nothing is repeated: customers in one table, products in another, orders in a third. Each order only stores a `CustomerID` and a `ProductID`. To see "Wanjiku bought a Bluetooth speaker for KSh 3,500", you must **join** the tables back together. JOINs are what make relational databases powerful, and they're the topic most beginners find hardest, so this unit goes slowly with pictures in words and many runnable examples.

:::note What you will learn
- Why data is split into tables, and how keys link them
- INNER JOIN step by step
- Table aliases and qualified column names
- Joining three tables
- LEFT JOIN and finding rows with no match
- RIGHT and FULL OUTER JOIN
- Self joins and CROSS JOIN
- Joins with GROUP BY for real reports
- Common join mistakes
:::

## Why join?

Imagine storing everything in one table:

| OrderID | CustomerName | City | Product | Price | Quantity |
|---|---|---|---|---|---|
| 1 | Wanjiku Mwangi | Nairobi | Bluetooth speaker | 3500 | 1 |
| 3 | Wanjiku Mwangi | Nairobi | Wireless mouse | 1200 | 2 |

Wanjiku's name and city repeat on every order. If she moves to Thika, you must update many rows, and if you miss one, the data contradicts itself. Splitting data into tables (normalisation) stores each fact once. **Keys** connect them:

- `Customers.CustomerID` is the **primary key** of Customers.
- `Orders.CustomerID` is a **foreign key** pointing to it.
- `Orders.ProductID` points to `Products.ProductID`.

## INNER JOIN

```sql
SELECT columns
FROM TableA
INNER JOIN TableB ON TableA.key = TableB.key;
```

An INNER JOIN returns only rows that have a match in **both** tables.

```try-sql
SELECT Orders.OrderID, Customers.Name, Orders.Quantity
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;
```

How it works: for each order, the database finds the customer whose `CustomerID` equals the order's `CustomerID`, and glues the two rows together. `JOIN` on its own means `INNER JOIN`.

## Table aliases

Writing full table names gets long. Give each table a short alias:

```try-sql
SELECT o.OrderID, c.Name, c.City, o.OrderDate
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
ORDER BY o.OrderDate;
```

When both tables have a column with the same name (like `Name` in Customers and Products, or `CustomerID`), you **must** say which one: `c.Name`, `p.Name`. Otherwise you get an "ambiguous column name" error.

## Joining three tables

Who bought what, and for how much?

```try-sql
SELECT o.OrderID,
       c.Name AS Customer,
       p.Name AS Product,
       o.Quantity,
       p.Price,
       o.Quantity * p.Price AS LineTotal
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p ON p.ProductID = o.ProductID
ORDER BY o.OrderID;
```

Each JOIN adds one table with its own `ON` condition. You can keep chaining joins this way.

You can still filter and sort:

```try-sql
SELECT c.Name, p.Name AS Product, o.OrderDate
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p ON p.ProductID = o.ProductID
WHERE c.City = 'Kisumu'
ORDER BY o.OrderDate;
```

## LEFT JOIN: keep everything from the left table

A LEFT JOIN returns **all rows from the left table**, plus matching rows from the right. Where there's no match, the right side's columns are NULL.

Which customers have ordered, and which haven't?

```try-sql
SELECT c.Name, o.OrderID
FROM Customers c
LEFT JOIN Orders o ON o.CustomerID = c.CustomerID
ORDER BY c.Name;
```

Kiprop Kiptoo appears with a NULL OrderID: he has never ordered. An INNER JOIN would have hidden him.

### Finding rows with no match

A very common task: "customers who never ordered", "products that never sold":

```try-sql
SELECT c.Name, c.City
FROM Customers c
LEFT JOIN Orders o ON o.CustomerID = c.CustomerID
WHERE o.OrderID IS NULL;
```

```try-sql
SELECT p.Name
FROM Products p
LEFT JOIN Orders o ON o.ProductID = p.ProductID
WHERE o.OrderID IS NULL;
```

(Every product in the sample has sold at least once, so the second query returns no rows. That's a valid answer.)

## RIGHT and FULL OUTER JOIN

| Join | Returns |
|---|---|
| `INNER JOIN` | Only matching rows |
| `LEFT JOIN` | All left rows + matches |
| `RIGHT JOIN` | All right rows + matches |
| `FULL OUTER JOIN` | All rows from both, matched where possible |

```sql
SELECT c.Name, o.OrderID
FROM Orders o
RIGHT JOIN Customers c ON o.CustomerID = c.CustomerID;
```

A RIGHT JOIN is just a LEFT JOIN with the tables swapped, so many developers only use LEFT JOIN. MySQL doesn't support FULL OUTER JOIN (you combine a LEFT and a RIGHT join with UNION); recent SQLite versions and PostgreSQL support both.

## Self join: a table joined to itself

Which customers live in the same city as another customer?

```try-sql
SELECT a.Name AS Customer, b.Name AS Neighbour, a.City
FROM Customers a
JOIN Customers b ON a.City = b.City AND a.CustomerID < b.CustomerID;
```

`a.CustomerID < b.CustomerID` avoids pairing someone with themselves and listing each pair twice. Self joins are also used for employee → manager relationships stored in one table.

## CROSS JOIN: every combination

```try-sql
SELECT c.Name, p.Name AS Product
FROM Customers c
CROSS JOIN Products p
LIMIT 10;
```

7 customers × 6 products = 42 rows. Useful for generating combinations (sizes × colours, dates × stores), dangerous by accident: two tables of 10,000 rows give 100 million rows.

## Joins with GROUP BY: real reports

Revenue per customer:

```try-sql
SELECT c.Name,
       COUNT(o.OrderID) AS Orders,
       SUM(o.Quantity * p.Price) AS Spent
FROM Customers c
JOIN Orders o ON o.CustomerID = c.CustomerID
JOIN Products p ON p.ProductID = o.ProductID
GROUP BY c.CustomerID, c.Name
ORDER BY Spent DESC;
```

Revenue per city, including cities with no sales (LEFT JOIN + COALESCE turns NULL into 0):

```try-sql
SELECT c.City,
       COALESCE(SUM(o.Quantity * p.Price), 0) AS Revenue
FROM Customers c
LEFT JOIN Orders o ON o.CustomerID = c.CustomerID
LEFT JOIN Products p ON p.ProductID = o.ProductID
GROUP BY c.City
ORDER BY Revenue DESC;
```

## Common join mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Missing `ON` condition | Huge result (every combination) | Always join on the key columns |
| Joining on the wrong columns (`o.OrderID = c.CustomerID`) | Nonsense matches | Join foreign key to primary key |
| Ambiguous column | Error: ambiguous column name | Prefix with the alias: `c.Name` |
| Filtering a LEFT JOIN's right table in WHERE | Unmatched rows vanish (becomes an inner join) | Put the condition in the `ON` clause instead |
| Counting with `COUNT(*)` after LEFT JOIN | Customers with no orders count as 1 | Use `COUNT(o.OrderID)` |

:::think You LEFT JOIN Customers to Orders and add `WHERE o.OrderDate >= '2026-09-01'` to see each customer's September orders, but customers without September orders disappear. Why, and how do you fix it?
Rows with no matching order have NULL OrderDate, and `NULL >= '2026-09-01'` isn't true, so WHERE removes them. Move the condition into the join: `LEFT JOIN Orders o ON o.CustomerID = c.CustomerID AND o.OrderDate >= '2026-09-01'`.
:::

## Summary

- Data is split into tables to avoid repetition; primary and foreign keys link them.
- INNER JOIN returns matches in both tables; use aliases and prefix shared column names.
- Chain JOINs to combine three or more tables.
- LEFT JOIN keeps all left rows; `WHERE right.key IS NULL` finds rows with no match.
- RIGHT and FULL joins exist; self joins compare rows in one table; CROSS JOIN makes every combination.
- Joins + GROUP BY produce real business reports.

```quiz
Q: Which join returns only rows that match in both tables?
A: INNER JOIN | inner | join
Q: Which join keeps all rows from the first (left) table?
A: LEFT JOIN | left | left outer join
Q: After a LEFT JOIN, what value appears in right-table columns with no match?
A: NULL
Q: 7 customers CROSS JOIN 6 products gives how many rows?
A: 42
Q: Which customer in the sample has never placed an order? (full name)
A: Kiprop Kiptoo
Q: A key in Orders that points to Customers is called a what? (two words)
A: foreign key
```

=== exercise ===
Show each order's **OrderID** with the **product Name**, by joining Orders and Products.
=== starter ===

=== expected ===

=== must_contain ===
JOIN
Products
Orders
