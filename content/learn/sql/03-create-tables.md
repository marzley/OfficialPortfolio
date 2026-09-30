---
slug: create-tables-constraints
title: Creating tables: data types and constraints
after: changing-data
---
# Creating tables: data types and constraints

So far you've used tables that already existed. Now you'll design and create your own, with rules (**constraints**) that stop bad data getting in.

## CREATE TABLE

```try-sql
CREATE TABLE Students (
  StudentID   INTEGER PRIMARY KEY,
  AdmNo       TEXT    NOT NULL UNIQUE,
  Name        TEXT    NOT NULL,
  Form        INTEGER CHECK (Form BETWEEN 1 AND 4),
  Phone       TEXT,
  FeesBalance INTEGER DEFAULT 0,
  JoinedOn    TEXT    DEFAULT (DATE('now'))
);

INSERT INTO Students (AdmNo, Name, Form, Phone) VALUES ('ADM001', 'Amina Hassan', 2, '0712345678');
INSERT INTO Students (AdmNo, Name, Form) VALUES ('ADM002', 'Brian Otieno', 3);
SELECT * FROM Students;
```

## Common data types

| Kind | MySQL | SQLite | Example |
|---|---|---|---|
| Whole numbers | `INT`, `BIGINT` | `INTEGER` | 42 |
| Money / exact decimals | `DECIMAL(10,2)` | `NUMERIC` | 1500.50 |
| Decimals (approximate) | `FLOAT`, `DOUBLE` | `REAL` | 3.14 |
| Short text | `VARCHAR(100)` | `TEXT` | 'Nairobi' |
| Long text | `TEXT` | `TEXT` | a description |
| Date / time | `DATE`, `DATETIME` | `TEXT` ('2026-09-28') | |
| True/false | `BOOLEAN` (TINYINT) | `INTEGER` 0/1 | |

> For money use `DECIMAL` (or store whole cents as integers). Never `FLOAT`: it can't store 0.10 exactly.

## Constraints: rules the database enforces

| Constraint | Meaning |
|---|---|
| `PRIMARY KEY` | Unique id for each row (auto-numbers in SQLite; use `AUTO_INCREMENT` in MySQL) |
| `NOT NULL` | Must have a value |
| `UNIQUE` | No duplicates (e.g. emails, admission numbers) |
| `DEFAULT` | Value used if none is given |
| `CHECK` | Must pass a condition |
| `FOREIGN KEY` | Must match a row in another table |

Watch the database refuse bad data (each failing line shows an error, so run them one at a time by deleting the others):

```sql
INSERT INTO Students (AdmNo, Name, Form) VALUES ('ADM001', 'Copycat', 1);   -- UNIQUE fails
INSERT INTO Students (AdmNo, Form) VALUES ('ADM009', 2);                   -- NOT NULL fails
INSERT INTO Students (AdmNo, Name, Form) VALUES ('ADM010', 'Zed', 7);      -- CHECK fails
```

## Foreign keys: linking tables safely

```try-sql
PRAGMA foreign_keys = ON;   -- SQLite needs this. MySQL (InnoDB) checks foreign keys automatically.

CREATE TABLE Students (StudentID INTEGER PRIMARY KEY, Name TEXT NOT NULL);
CREATE TABLE Payments (
  PaymentID  INTEGER PRIMARY KEY,
  StudentID  INTEGER NOT NULL REFERENCES Students(StudentID) ON DELETE CASCADE,
  Amount     INTEGER NOT NULL CHECK (Amount > 0),
  MpesaCode  TEXT UNIQUE,
  PaidOn     TEXT NOT NULL
);

INSERT INTO Students (Name) VALUES ('Amina'), ('Brian');
INSERT INTO Payments (StudentID, Amount, MpesaCode, PaidOn) VALUES
  (1, 15000, 'SJK1A2B3C4', '2026-09-01'),
  (1, 5000,  'SJK5D6E7F8', '2026-09-15'),
  (2, 20000, 'SJL9G8H7I6', '2026-09-02');

SELECT s.Name, SUM(p.Amount) AS Paid, COUNT(*) AS Payments
FROM Students s JOIN Payments p ON p.StudentID = s.StudentID
GROUP BY s.Name;
```

`ON DELETE CASCADE` means: if a student is deleted, their payments are deleted too. Other options: `RESTRICT` (refuse to delete) or `SET NULL`.

## Changing and removing tables

```try-sql
CREATE TABLE Suppliers (SupplierID INTEGER PRIMARY KEY, Name TEXT NOT NULL);
ALTER TABLE Suppliers ADD COLUMN Phone TEXT;
ALTER TABLE Suppliers RENAME TO Vendors;
INSERT INTO Vendors (Name, Phone) VALUES ('Bidco', '0700111222');
SELECT * FROM Vendors;
DROP TABLE Vendors;              -- deletes the table and ALL its data. Careful!
```

- `DROP TABLE IF EXISTS x` avoids an error if it's already gone.
- There's no undo. On real systems, **back up first**.

## The same table in MySQL

```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adm_no VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  form TINYINT CHECK (form BETWEEN 1 AND 4),
  fees_balance DECIMAL(10,2) DEFAULT 0,
  joined_on DATE DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

`utf8mb4` supports all characters including emoji. Use it for every table.

```quiz
Q: Which constraint stops duplicate values in a column?
A: UNIQUE
Q: Which constraint means a column must always have a value?
A: NOT NULL
Q: Which MySQL data type should you use for money?
A: DECIMAL | decimal(10,2)
Q: Which command deletes a whole table and its data?
A: DROP TABLE | DROP
Q: Which command adds a column to an existing table?
A: ALTER TABLE | ALTER | ALTER TABLE ADD COLUMN
```
=== exercise ===
Create a table **Books** with `BookID INTEGER PRIMARY KEY`, `Title TEXT NOT NULL` and `Price INTEGER`, then `SELECT * FROM Books`.
=== starter ===
-- create the table, then select from it
=== must_contain ===
CREATE TABLE Books
PRIMARY KEY
NOT NULL
SELECT
