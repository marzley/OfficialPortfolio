---
slug: changing-data
title: "INSERT, UPDATE and DELETE: adding, changing and removing data safely"
after: KEEP
---
# INSERT, UPDATE and DELETE: adding, changing and removing data safely

So far you've only **read** data. Real applications also **write** data: a new customer signs up (INSERT), a price changes (UPDATE), a cancelled order is removed (DELETE). These commands are called **DML** (Data Manipulation Language). They are powerful and dangerous: one missing `WHERE` can change every row in a table. This unit teaches each command step by step, with the safety habits professionals use.

In this hub, each Run starts with a fresh copy of the sample database, so you can't break anything. Experiment freely.

:::note What you will learn
- INSERT one row, several rows, and rows from a query
- Default values and auto-generated IDs
- UPDATE with WHERE, calculations and several columns
- DELETE with WHERE
- The "SELECT first" safety habit
- Transactions: undo with ROLLBACK
- Upserts (insert or update)
- Soft deletes and why real systems use them
:::

## INSERT: add rows

```sql
INSERT INTO table (column1, column2, ...)
VALUES (value1, value2, ...);
```

```try-sql
INSERT INTO Customers (Name, City, Phone)
VALUES ('Mutua Musyoka', 'Machakos', '0712000008');

SELECT * FROM Customers;
```

Notice we didn't give a `CustomerID`. It's an `INTEGER PRIMARY KEY`, so SQLite generates the next number automatically (8). MySQL uses `AUTO_INCREMENT`, PostgreSQL `SERIAL` or `GENERATED ... AS IDENTITY`.

:::tip Always list the columns
`INSERT INTO Customers VALUES (9, 'X', 'Y', 'Z')` works but breaks if columns are added or reordered. Listing columns is safer and clearer.
:::

### Several rows at once

```try-sql
INSERT INTO Products (Name, Category, Price) VALUES
  ('Webcam HD', 'Electronics', 2800),
  ('HDMI cable 2m', 'Accessories', 600),
  ('Memory card 64GB', 'Storage', 1500);

SELECT * FROM Products ORDER BY ProductID;
```

### Insert from a query

Copy data from one table into another, e.g. building an archive or a summary table:

```try-sql
CREATE TABLE NairobiCustomers (Name TEXT, Phone TEXT);

INSERT INTO NairobiCustomers (Name, Phone)
SELECT Name, Phone FROM Customers WHERE City = 'Nairobi';

SELECT * FROM NairobiCustomers;
```

## UPDATE: change existing rows

```sql
UPDATE table
SET column1 = value1, column2 = value2
WHERE condition;
```

```try-sql
UPDATE Products SET Price = 950 WHERE ProductID = 2;

SELECT * FROM Products WHERE ProductID = 2;
```

Update with a calculation (10% price increase for Electronics):

```try-sql
UPDATE Products
SET Price = ROUND(Price * 1.10)
WHERE Category = 'Electronics';

SELECT Name, Category, Price FROM Products;
```

Several columns at once:

```try-sql
UPDATE Customers
SET City = 'Thika', Phone = '0722000001'
WHERE CustomerID = 1;

SELECT * FROM Customers WHERE CustomerID = 1;
```

:::warning The missing WHERE disaster
`UPDATE Products SET Price = 0;` sets **every** product's price to 0. There's no "are you sure?" in SQL. Before any UPDATE or DELETE, check the WHERE clause twice.
:::

## DELETE: remove rows

```try-sql
DELETE FROM Orders WHERE OrderID = 7;

SELECT * FROM Orders;
```

`DELETE FROM Orders;` (no WHERE) empties the whole table. `DROP TABLE Orders;` removes the table itself, structure and all.

## The "SELECT first" habit

Professionals write the `SELECT` version first to see exactly which rows will be affected:

```try-sql
-- Step 1: preview
SELECT * FROM Orders WHERE OrderDate < '2026-08-10';
```

```try-sql
-- Step 2: same WHERE, now delete
DELETE FROM Orders WHERE OrderDate < '2026-08-10';
SELECT COUNT(*) AS RemainingOrders FROM Orders;
```

If the preview shows 2 rows, the delete should affect 2 rows. If the preview shows 2,000 rows, stop and rethink.

## Transactions: changes you can undo

A **transaction** groups statements so they all succeed or all fail. Until you `COMMIT`, you can `ROLLBACK` (undo).

```try-sql
BEGIN TRANSACTION;
DELETE FROM Customers;            -- oops, no WHERE!
SELECT COUNT(*) AS DuringMistake FROM Customers;
ROLLBACK;                         -- undo everything since BEGIN
SELECT COUNT(*) AS AfterRollback FROM Customers;
```

Banks and M-Pesa rely on transactions: moving money must subtract from one account **and** add to another, or do neither.

```try-sql
CREATE TABLE Accounts (Name TEXT, Balance INTEGER);
INSERT INTO Accounts VALUES ('Wanjiku', 5000), ('Otieno', 1000);

BEGIN TRANSACTION;
UPDATE Accounts SET Balance = Balance - 2000 WHERE Name = 'Wanjiku';
UPDATE Accounts SET Balance = Balance + 2000 WHERE Name = 'Otieno';
COMMIT;

SELECT * FROM Accounts;
```

The indexes and transactions lesson covers this further.

## Upsert: insert or update

"Add this product, or if it already exists, update it." SQLite and PostgreSQL use `ON CONFLICT`:

```try-sql
INSERT INTO Products (ProductID, Name, Category, Price)
VALUES (2, 'USB flash 32GB', 'Storage', 850)
ON CONFLICT(ProductID) DO UPDATE SET Price = excluded.Price;

SELECT * FROM Products WHERE ProductID = 2;
```

`excluded` refers to the values you tried to insert. MySQL's equivalent is `INSERT ... ON DUPLICATE KEY UPDATE`.

## Soft deletes

Many real systems never truly delete important records (orders, payments, users). Instead they mark them:

```try-sql
ALTER TABLE Orders ADD COLUMN Cancelled INTEGER DEFAULT 0;

UPDATE Orders SET Cancelled = 1 WHERE OrderID = 3;

SELECT OrderID, Cancelled FROM Orders;
-- Reports then use: WHERE Cancelled = 0
```

Soft deletes keep history for audits, refunds and disputes, and mistakes can be reversed.

## Safety checklist

1. Write the `SELECT` first with the same WHERE.
2. Use a transaction for multi-step changes or risky edits.
3. Back up important databases before big changes.
4. Use primary keys in WHERE (`WHERE ProductID = 2`) for single-row changes.
5. In applications, use **parameterised queries**, never paste user input into SQL (that prevents SQL injection; see the cybersecurity subject).

:::think A junior developer runs `UPDATE Customers SET City = 'Nakuru' WHERE Name = 'Kamau';` and nothing changes. There's no error. Why?
No customer's Name is exactly 'Kamau'; it's 'Kamau Njoroge'. UPDATE with a WHERE that matches no rows succeeds but changes 0 rows. Preview with SELECT first, and update by primary key (`WHERE CustomerID = 4`).
:::

## Summary

- `INSERT INTO table (cols) VALUES (...)` adds rows; you can insert several rows or the result of a SELECT.
- `UPDATE table SET ... WHERE ...` changes rows; `DELETE FROM table WHERE ...` removes them.
- Without WHERE, UPDATE and DELETE affect every row.
- Preview with SELECT, use transactions (BEGIN, COMMIT, ROLLBACK), and update by primary key.
- Upserts insert or update; soft deletes mark rows instead of removing them.

```quiz
Q: Which command adds new rows to a table?
A: INSERT | INSERT INTO
Q: What happens if you run DELETE FROM Orders; with no WHERE?
A: all rows are deleted | deletes all rows | all rows deleted | everything is deleted | empties the table
Q: Which command undoes changes made since BEGIN TRANSACTION?
A: ROLLBACK
Q: Which command makes a transaction's changes permanent?
A: COMMIT
Q: What is marking a row as removed instead of deleting it called? (two words)
A: soft delete
Q: An UPDATE matches no rows. Does it give an error? (yes/no)
A: no
```

=== exercise ===
Insert a new product called **Webcam** in the **Electronics** category costing **2800**, then select all products.
=== starter ===

=== expected ===
Webcam,Electronics,2800
=== must_contain ===
INSERT INTO Products
