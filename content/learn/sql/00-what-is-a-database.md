---
slug: what-is-a-database
title: What is a database? Tables, rows, keys and SQL
after: START
---
# What is a database? Tables, rows, keys and SQL

Every app you use stores data somewhere: M-Pesa keeps transactions, KCSE results live in tables of students and marks, an online shop stores products and orders. That "somewhere" is usually a **database**.

## Why not just use Excel?

A spreadsheet is great for one person and a few thousand rows. A database is built for:

- **Many users at once** (thousands of customers paying at the same time),
- **Millions of rows**, searched in milliseconds,
- **Rules** that keep data correct (an order must belong to a real customer),
- **Security**: who may read or change what,
- **Safety**: transactions and backups so money never "half moves".

## Tables, rows and columns

A **relational database** stores data in **tables**. Each table is about one kind of thing.

**Customers**

| CustomerID | Name | City | Phone |
|---|---|---|---|
| 1 | Wanjiku Mwangi | Nairobi | 0712000001 |
| 2 | Otieno Odhiambo | Kisumu | 0712000002 |
| 3 | Achieng Atieno | Kisumu | 0712000003 |

- A **column** (field) is one piece of information: `Name`, `City`.
- A **row** (record) is one customer.
- Each column has a **data type**: text, whole number, decimal, date...

## Keys: how tables connect

- A **primary key** uniquely identifies each row (`CustomerID`). No two customers share it.
- A **foreign key** is a column that points to another table's primary key.

**Orders**

| OrderID | CustomerID | ProductID | Quantity | OrderDate |
|---|---|---|---|---|
| 1 | 1 | 5 | 1 | 2026-08-02 |
| 2 | 2 | 2 | 3 | 2026-08-05 |

`Orders.CustomerID = 1` means "this order belongs to Wanjiku". Instead of copying her name and phone into every order, we store it **once** and link to it. That's the "relational" idea.

## Our practice database

Every SQL example in this tutorial runs on a small shop database, fresh every time you press **Run**:

- **Customers** (CustomerID, Name, City, Phone)
- **Products** (ProductID, Name, Category, Price)
- **Orders** (OrderID, CustomerID, ProductID, Quantity, OrderDate)

Try looking at each table:

```try-sql
SELECT * FROM Customers;
SELECT * FROM Products;
SELECT * FROM Orders;
```

## What is SQL?

**SQL** (Structured Query Language, said "S-Q-L" or "sequel") is the language for talking to relational databases. It's declarative: you say **what** you want, and the database figures out **how** to get it.

| Group | Commands | Does |
|---|---|---|
| Query | `SELECT` | Read data |
| Change data | `INSERT`, `UPDATE`, `DELETE` | Add, edit, remove rows |
| Define structure | `CREATE`, `ALTER`, `DROP` | Make and change tables |
| Control access | `GRANT`, `REVOKE` | Permissions |
| Transactions | `BEGIN`, `COMMIT`, `ROLLBACK` | All-or-nothing changes |

## Popular database systems

| System | Where you'll meet it |
|---|---|
| **MySQL / MariaDB** | Most shared hosting (cPanel), WordPress, PHP sites |
| **PostgreSQL** | Modern web apps, very powerful |
| **SQLite** | Inside phones, apps and this tutorial: a whole database in one file |
| **SQL Server** | Many banks and corporates |
| **Oracle** | Large enterprises |

The SQL you learn here works in all of them with only small differences.

## Writing SQL: the rules

- Keywords aren't case-sensitive, but writing them in CAPITALS makes queries easier to read.
- End each statement with `;`.
- Text values go in **single quotes**: `'Nairobi'`.
- `--` starts a comment.

```try-sql
-- Customers in Kisumu, sorted by name
SELECT Name, Phone
FROM Customers
WHERE City = 'Kisumu'
ORDER BY Name;
```

## Who uses databases (almost everyone)

Every app you use daily runs on databases: M-Pesa transactions, bank accounts, eCitizen records, KRA returns, school management systems, hospital records, supermarket stock, Jumia orders, WhatsApp messages and even this site's lessons and progress. Database skills are needed by back-end developers, data analysts, business intelligence teams, system administrators, and increasingly by accountants and managers who query company data directly.

| Role | How they use SQL |
|---|---|
| Back-end developer | Stores and retrieves app data (users, orders, payments) |
| Data analyst | Answers business questions: sales trends, best customers |
| Database administrator (DBA) | Keeps databases fast, secure and backed up |
| Business user | Pulls reports from systems instead of waiting for IT |
| Data engineer | Moves and transforms data between systems |

## How the practice tables relate

```
Customers (CustomerID PK) ──< Orders (CustomerID FK, ProductID FK) >── Products (ProductID PK)
```

One customer can have **many** orders (one-to-many). One product can appear in **many** orders. The Orders table links them: this is how relational databases avoid repeating customer and product details on every order.

```try-sql
-- How many rows are in each table?
SELECT 'Customers' AS TableName, COUNT(*) AS Rows FROM Customers
UNION ALL SELECT 'Products', COUNT(*) FROM Products
UNION ALL SELECT 'Orders', COUNT(*) FROM Orders;
```

## Your first useful questions

```try-sql
-- Which customers live in Nairobi?
SELECT Name, Phone FROM Customers WHERE City = 'Nairobi';

-- Products cheaper than 2,000, cheapest first
SELECT Name, Price FROM Products WHERE Price < 2000 ORDER BY Price;

-- Orders in September 2026
SELECT * FROM Orders WHERE OrderDate >= '2026-09-01';
```

Each query answers a business question. Learning SQL is mostly learning to translate questions into these clauses.

## Joining tables: a preview

The real power appears when tables are combined:

```try-sql
SELECT o.OrderID, c.Name AS Customer, p.Name AS Product, o.Quantity,
       o.Quantity * p.Price AS Total
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p ON p.ProductID = o.ProductID
ORDER BY Total DESC;
```

You'll learn joins properly later; for now notice how foreign keys (CustomerID, ProductID) connect the tables.

## Relationship types

| Relationship | Example | How it's stored |
|---|---|---|
| One-to-one | A person and their national ID record | Same key in both tables |
| One-to-many | A customer and their orders | Foreign key in the "many" table (Orders.CustomerID) |
| Many-to-many | Students and courses | A linking table (Enrolments: StudentID, CourseID) |

## Normalisation in plain language

Normalisation means organising data so each fact is stored **once**:

| Problem table (repeated data) | | | |
|---|---|---|---|
| OrderID | CustomerName | CustomerPhone | Product |
| 1 | Wanjiku Mwangi | 0712000001 | Speaker |
| 3 | Wanjiku Mwangi | 0712000001 | Mouse |

If Wanjiku changes her phone number, you must update every order row, and missing one creates conflicting data. Storing customers once in a Customers table and referring to them by CustomerID solves this. That's exactly how the practice database is designed.

## SQL vs NoSQL

| | SQL (relational) | NoSQL (document, key-value) |
|---|---|---|
| Examples | MySQL, PostgreSQL, SQLite, SQL Server | MongoDB, Firebase Firestore, Redis |
| Structure | Tables with fixed columns | Flexible documents (JSON-like) |
| Strengths | Relationships, consistency, reporting | Flexible data, scaling some workloads, real-time apps |
| Typical use | Banking, e-commerce, school systems | Chat apps, mobile app data, caching |

Most developers learn SQL first because relational databases remain extremely common and SQL skills transfer between systems.

## Database careers and learning path

1. **SELECT basics**: filtering, sorting, limiting.
2. **Aggregates and GROUP BY**: totals and counts.
3. **Joins**: combining tables.
4. **Creating tables and constraints**: designing databases.
5. **Insert, update, delete and transactions**: changing data safely.
6. **Indexes and performance**: making queries fast.
7. **Using SQL from code**: Python, PHP, Node.js.
8. **Analytics**: window functions, reporting, dashboards.

Practise on real-looking data; free datasets from the Kenya National Bureau of Statistics or open data portals make good projects.

## Practice

1. List all products in the Storage category.
2. Show customers from Kisumu sorted by name.
3. Find orders with a quantity greater than 1.
4. Draw the relationships between Customers, Products and Orders on paper and label the keys.

:::think Why does the Orders table store CustomerID instead of the customer's name and phone number?
Storing only the ID avoids repeating customer details on every order. Details are kept once in Customers, so updating a phone number happens in one place, data stays consistent, and storage is smaller. Joins bring the details back when needed.
:::

```quiz
Q: In a table, what is one record called: a row or a column?
A: row | a row
Q: Which kind of key uniquely identifies each row?
A: primary key | primary
Q: Which kind of key points to a row in another table?
A: foreign key | foreign
Q: Which SQL command reads data?
A: SELECT
Q: Which database runs inside phones and this tutorial, stored in one file?
A: SQLite
Q: What is the relationship between Customers and Orders: one-to-one, one-to-many or many-to-many?
A: one-to-many | one to many
Q: What do you call organising data so each fact is stored only once?
A: normalisation | normalization
Q: Which type of table connects two tables in a many-to-many relationship? (two words, e.g. ... table)
A: linking table | junction table | link table | join table
```
=== exercise ===
Show the **Name** and **Price** of every product.
=== starter ===
-- your query here
=== must_contain ===
SELECT
Name
Price
Products
