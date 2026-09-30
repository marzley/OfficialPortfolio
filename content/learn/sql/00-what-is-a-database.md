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
