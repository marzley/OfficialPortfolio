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

## Why indexes and transactions matter

A query that takes 5 milliseconds on 100 rows can take many seconds on 5 million rows without an index, making an app feel broken. And without transactions, a crash halfway through an M-Pesa-style transfer could take money from one account without adding it to the other. Banks, payment systems, e-commerce sites and school systems all depend on indexes for speed and transactions for correctness. These topics separate beginners from professional developers.

## Seeing whether a query uses an index

```try-sql
CREATE TABLE Payments (
  PaymentID INTEGER PRIMARY KEY,
  Phone     TEXT NOT NULL,
  Amount    INTEGER NOT NULL,
  PaidAt    TEXT NOT NULL
);
EXPLAIN QUERY PLAN SELECT * FROM Payments WHERE Phone = '0712000001';
CREATE INDEX idx_payments_phone ON Payments(Phone);
EXPLAIN QUERY PLAN SELECT * FROM Payments WHERE Phone = '0712000001';
```

Before the index, the plan says **SCAN** (read every row). After, it says **SEARCH ... USING INDEX** (jump straight to matching rows). In MySQL and PostgreSQL use `EXPLAIN SELECT ...`.

## Composite indexes and column order

An index on several columns works like a phone book sorted by surname, then first name:

```sql
CREATE INDEX idx_payments_phone_date ON Payments(Phone, PaidAt);
```

| Query | Can use the index? |
|---|---|
| `WHERE Phone = ?` | Yes (first column) |
| `WHERE Phone = ? AND PaidAt >= ?` | Yes, very efficiently |
| `WHERE PaidAt >= ?` alone | Usually not (it's not the first column) |

Put the column you filter by with `=` first, and range or sort columns after it.

## What stops an index being used

| Query pattern | Problem | Better |
|---|---|---|
| `WHERE UPPER(Name) = 'KAMAU'` | Function on the column | Store normalised values, or an expression index |
| `WHERE Name LIKE '%amau'` | Leading wildcard | Full-text search for "contains" searches |
| `WHERE Phone = 712000001` (number vs text) | Type conversion | Compare with the same type: `'0712000001'` |
| `WHERE strftime('%Y', PaidAt) = '2026'` | Function on the column | `WHERE PaidAt >= '2026-01-01' AND PaidAt < '2027-01-01'` |

## Transactions in action

```try-sql
CREATE TABLE Wallets (Name TEXT PRIMARY KEY, Balance INTEGER NOT NULL CHECK (Balance >= 0));
INSERT INTO Wallets VALUES ('Wanjiku', 5000), ('Otieno', 1000);

BEGIN;
UPDATE Wallets SET Balance = Balance - 1500 WHERE Name = 'Wanjiku';
UPDATE Wallets SET Balance = Balance + 1500 WHERE Name = 'Otieno';
COMMIT;

SELECT * FROM Wallets;
```

Both updates happen together or not at all. If the second update failed (or the server crashed), `ROLLBACK` (or the database's recovery) would undo the first.

```try-sql
CREATE TABLE Wallets (Name TEXT PRIMARY KEY, Balance INTEGER NOT NULL CHECK (Balance >= 0));
INSERT INTO Wallets VALUES ('Wanjiku', 5000), ('Otieno', 1000);

BEGIN;
UPDATE Wallets SET Balance = Balance + 800 WHERE Name = 'Wanjiku';
-- we changed our mind (or an error was detected in the app):
ROLLBACK;

SELECT * FROM Wallets;      -- unchanged
```

## Savepoints: partial undo

```sql
BEGIN;
INSERT INTO Orders ...;
SAVEPOINT before_items;
INSERT INTO OrderItems ...;      -- something goes wrong here
ROLLBACK TO before_items;        -- undo only the items
INSERT INTO OrderItems ...;      -- try again
COMMIT;
```

## Concurrency: two people buying the last item

Two customers click "Buy" for the last laptop at the same moment. Without care, both see `Stock = 1`, both buy, and stock becomes -1. Solutions:

```sql
-- Update only if stock is still available, then check how many rows changed
UPDATE Products SET Stock = Stock - 1 WHERE ProductID = 6 AND Stock >= 1;
-- If 0 rows were updated, tell the second customer it's sold out.
```

Combined with a `CHECK (Stock >= 0)` constraint and transactions, the database guarantees correctness. Larger systems also use row locks (`SELECT ... FOR UPDATE` in MySQL/PostgreSQL) and isolation levels.

## Isolation levels in brief

| Level | Prevents | Notes |
|---|---|---|
| Read uncommitted | Almost nothing | Rarely used |
| Read committed | Reading uncommitted changes | PostgreSQL default |
| Repeatable read | Values changing during your transaction | MySQL InnoDB default |
| Serializable | All anomalies; transactions behave as if one at a time | Safest, slowest |

## Backups and recovery

| Database | Backup tool |
|---|---|
| MySQL / MariaDB | `mysqldump -u user -p dbname > backup.sql` (or cPanel → Backup) |
| PostgreSQL | `pg_dump dbname > backup.sql` |
| SQLite | Copy the file while no writes happen, or `.backup` in the sqlite3 shell |

- Automate daily backups and keep copies off the server (cloud storage).
- **Test restoring** a backup regularly: a backup you can't restore is useless.
- Encrypt backups that contain personal data, and limit who can access them (Data Protection Act).

## Security essentials

- Use **parameterised queries** in application code to prevent SQL injection (never join user input into SQL strings).
- Give each application its own database user with only the permissions it needs (`GRANT SELECT, INSERT, UPDATE ON shop.* TO 'shopapp'@'localhost'`).
- Never expose the database port to the internet without strong protection.
- Hash passwords (bcrypt, Argon2); never store them as plain text.

## Practice

1. Create a Payments table, run `EXPLAIN QUERY PLAN` for a phone search, add an index, and compare.
2. Write a transfer transaction between two wallets and a version that rolls back.
3. Write an UPDATE that only reduces stock if enough is available.
4. Rewrite `WHERE strftime('%m', PaidAt) = '09'` so it can use an index on PaidAt (for one year).
5. Explain the ACID properties using an M-Pesa transfer as the example.

:::think A developer adds indexes on every column of a busy Orders table "to make it fast". Why might the app get slower?
Every index must be updated on each INSERT, UPDATE and DELETE, so writes become slower and the database uses more storage and memory. Indexes should be added for columns actually used in frequent WHERE, JOIN and ORDER BY clauses, guided by EXPLAIN plans and slow-query logs.
:::

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
Q: Which SQLite command shows whether a query uses an index? (three words)
A: EXPLAIN QUERY PLAN
Q: Which command undoes only part of a transaction back to a named point? (two words)
A: ROLLBACK TO | savepoint
Q: Does a function on a column like UPPER(Name) usually stop a normal index being used? (yes or no)
A: yes
Q: Which MySQL tool creates a SQL backup file?
A: mysqldump
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
