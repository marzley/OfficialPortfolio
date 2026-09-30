---
slug: indexes-transactions
title: Indexes, transactions and keeping data safe
after: keys-design
---
# Indexes, transactions and keeping data safe

Two ideas separate a toy database from a real one: **indexes** keep it fast as it grows, and **transactions** keep it correct when things go wrong.

## Indexes: the book's index for your table

Without an index, finding customers in Kisumu means reading **every row** (a "full table scan"). With 10 rows that's nothing; with 5 million M-Pesa transactions it's painfully slow. An **index** is a sorted lookup structure, like the index at the back of a textbook.

```try-sql
CREATE INDEX idx_customers_city ON Customers(City);
CREATE INDEX idx_orders_customer_date ON Orders(CustomerID, OrderDate);

EXPLAIN QUERY PLAN SELECT * FROM Customers WHERE City = 'Kisumu';
EXPLAIN QUERY PLAN SELECT * FROM Customers WHERE Name = 'Amina Hassan';
```

The first plan says **SEARCH ... USING INDEX**; the second says **SCAN** (reads every row) because there's no index on `Name`. In MySQL use `EXPLAIN SELECT ...`.

### When to add an index

| Add an index on... | Because |
|---|---|
| Columns in `WHERE` you search often (phone, email, city) | Fast look-ups |
| Foreign keys (`Orders.CustomerID`) | Fast joins |
| Columns you `ORDER BY` on big tables | Avoids sorting |
| Columns that must be unique | `CREATE UNIQUE INDEX` also enforces it |

### The cost of indexes

- Each index uses disk space.
- Every `INSERT`, `UPDATE` and `DELETE` must update the indexes too, so writes get slightly slower.
- Don't index everything: index what your real queries use.

## Transactions: all or nothing

Moving KSh 1,000 from Amina to Brian needs **two** updates. If the power goes off between them, money vanishes. A **transaction** groups statements so either **all** happen or **none** do.

```try-sql
CREATE TABLE Wallets (Owner TEXT PRIMARY KEY, Balance INTEGER NOT NULL CHECK (Balance >= 0));
INSERT INTO Wallets VALUES ('Amina', 5000), ('Brian', 1200);

BEGIN TRANSACTION;
UPDATE Wallets SET Balance = Balance - 1000 WHERE Owner = 'Amina';
UPDATE Wallets SET Balance = Balance + 1000 WHERE Owner = 'Brian';
COMMIT;

SELECT * FROM Wallets;
```

If something fails, `ROLLBACK` undoes everything since `BEGIN`:

```try-sql
CREATE TABLE Wallets (Owner TEXT PRIMARY KEY, Balance INTEGER NOT NULL);
INSERT INTO Wallets VALUES ('Amina', 5000), ('Brian', 1200);

BEGIN;
UPDATE Wallets SET Balance = Balance - 1000 WHERE Owner = 'Amina';
-- Imagine the second update failed here (network error, crash...)
ROLLBACK;

SELECT * FROM Wallets;   -- Amina still has 5000
```

In application code the pattern is:

```php
$pdo->beginTransaction();
try {
    $pdo->prepare("UPDATE wallets SET balance = balance - ? WHERE owner = ?")->execute([1000, 'Amina']);
    $pdo->prepare("UPDATE wallets SET balance = balance + ? WHERE owner = ?")->execute([1000, 'Brian']);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();   // nothing changed
    throw $e;
}
```

## ACID: what a good database promises

| Letter | Means | In plain words |
|---|---|---|
| **A**tomicity | All or nothing | No half-finished transfers |
| **C**onsistency | Rules always hold | Constraints (CHECK, FOREIGN KEY) are never broken |
| **I**solation | Transactions don't disturb each other | Two cashiers don't sell the last item twice |
| **D**urability | Committed means saved | Survives a crash or power cut |

## Keeping data safe

1. **Backups**: schedule daily automatic backups (cPanel, `mysqldump`) and test restoring one.
2. **Least privilege**: the website's database user shouldn't be able to `DROP` tables.
3. **Prepared statements**: never build SQL by joining user input into a string. That's how **SQL injection** attacks work (see the PHP and Cybersecurity tutorials).
4. **Soft deletes**: add a `DeletedAt` column instead of really deleting important records.
5. **Audit columns**: `CreatedAt`, `UpdatedAt`, `CreatedBy` help you trace problems.

```try-sql
CREATE TABLE Invoices (
  InvoiceID INTEGER PRIMARY KEY,
  Amount INTEGER NOT NULL,
  CreatedAt TEXT DEFAULT (DATETIME('now')),
  DeletedAt TEXT
);
INSERT INTO Invoices (Amount) VALUES (2500), (4000);
UPDATE Invoices SET DeletedAt = DATETIME('now') WHERE InvoiceID = 1;   -- "delete" softly
SELECT * FROM Invoices WHERE DeletedAt IS NULL;                        -- active invoices
```

```quiz
Q: What speeds up searches on a column, like the index of a book?
A: index | an index
Q: Which command permanently saves a transaction's changes?
A: COMMIT
Q: Which command undoes everything since BEGIN?
A: ROLLBACK
Q: What does the A in ACID stand for?
A: Atomicity
Q: Do indexes make INSERTs slightly faster or slower?
A: slower
```
=== exercise ===
Create an index called **idx_products_category** on `Products(Category)`.
=== starter ===
-- your statement here
=== must_contain ===
CREATE INDEX
idx_products_category
Products
Category
