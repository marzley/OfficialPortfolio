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

## Why table design matters

A well-designed database keeps data correct for years: no duplicate customers, no orders for products that don't exist, no negative prices, no missing phone numbers. A badly designed one causes endless bugs and reports nobody trusts. Designing tables (choosing columns, types, keys and constraints) is a core job for back-end developers and database administrators, and a common topic in interviews and university projects.

## Designing tables step by step: a school example

1. **List the things (entities)**: Students, Classes, Subjects, Marks, Fee payments.
2. **List each entity's attributes**: Student → admission number, name, date of birth, class, parent phone.
3. **Choose primary keys**: StudentID (auto number), or the admission number if it never changes.
4. **Find relationships**: one class has many students; a student has many marks; a mark belongs to one subject.
5. **Add foreign keys** for those relationships.
6. **Add constraints**: required fields, unique admission numbers, marks between 0 and 100.

```try-sql
CREATE TABLE Classes (
  ClassID   INTEGER PRIMARY KEY,
  Name      TEXT NOT NULL UNIQUE              -- e.g. 'Form 2 East'
);
CREATE TABLE Students (
  StudentID    INTEGER PRIMARY KEY,
  AdmissionNo  TEXT NOT NULL UNIQUE,
  FullName     TEXT NOT NULL,
  DateOfBirth  TEXT,
  ClassID      INTEGER NOT NULL REFERENCES Classes(ClassID),
  ParentPhone  TEXT CHECK (length(ParentPhone) = 10)
);
CREATE TABLE Subjects (
  SubjectID INTEGER PRIMARY KEY,
  Name      TEXT NOT NULL UNIQUE
);
CREATE TABLE Marks (
  StudentID INTEGER NOT NULL REFERENCES Students(StudentID),
  SubjectID INTEGER NOT NULL REFERENCES Subjects(SubjectID),
  Term      TEXT NOT NULL,
  Score     INTEGER NOT NULL CHECK (Score BETWEEN 0 AND 100),
  PRIMARY KEY (StudentID, SubjectID, Term)     -- one mark per student, subject and term
);

INSERT INTO Classes (Name) VALUES ('Form 2 East'), ('Form 2 West');
INSERT INTO Subjects (Name) VALUES ('Maths'), ('English');
INSERT INTO Students (AdmissionNo, FullName, ClassID, ParentPhone) VALUES
  ('ADM001', 'Baraka Mutua', 1, '0712000101'),
  ('ADM002', 'Neema Chebet', 2, '0712000102');
INSERT INTO Marks VALUES (1, 1, '2026T3', 78), (1, 2, '2026T3', 65), (2, 1, '2026T3', 91);

SELECT s.FullName, c.Name AS Class, sub.Name AS Subject, m.Score
FROM Marks m
JOIN Students s ON s.StudentID = m.StudentID
JOIN Classes c ON c.ClassID = s.ClassID
JOIN Subjects sub ON sub.SubjectID = m.SubjectID
ORDER BY s.FullName, sub.Name;
```

The **composite primary key** (StudentID, SubjectID, Term) stops the same mark being entered twice.

## Watching constraints protect your data

```try-sql
CREATE TABLE Accounts (
  AccountID INTEGER PRIMARY KEY,
  Phone     TEXT NOT NULL UNIQUE,
  Balance   INTEGER NOT NULL DEFAULT 0 CHECK (Balance >= 0)
);
INSERT INTO Accounts (Phone) VALUES ('0712000001');
INSERT INTO Accounts (Phone, Balance) VALUES ('0712000002', 500);
SELECT * FROM Accounts;
-- Each line below would be rejected. Remove the -- from one line at a time and run:
-- INSERT INTO Accounts (Phone) VALUES ('0712000001')                (UNIQUE fails)
-- INSERT INTO Accounts (Phone, Balance) VALUES ('0712000003', -50)  (CHECK fails)
-- INSERT INTO Accounts (Balance) VALUES (100)                       (NOT NULL fails)
```

Try un-commenting one line at a time to see the error. Constraints are the database refusing bad data, even if the application code has a bug.

## Choosing good data types

| Data | Good choice | Why |
|---|---|---|
| Money | `INTEGER` cents (SQLite) or `DECIMAL(12,2)` (MySQL/PostgreSQL) | Floats cause rounding errors |
| Phone numbers, ID numbers, admission numbers | `TEXT` / `VARCHAR` | Leading zeros; no maths is done on them |
| Dates | `DATE` / `DATETIME` (or ISO text in SQLite) | Correct sorting and date functions |
| Yes/no | `BOOLEAN` (MySQL `TINYINT(1)`, SQLite 0/1) | Clear meaning |
| Long descriptions | `TEXT` | No small length limit |
| Fixed set of values | `TEXT` with `CHECK (Status IN ('pending','paid','cancelled'))` or a lookup table | Prevents typos |

## ON DELETE: what happens to related rows

```sql
CREATE TABLE Orders (
  OrderID    INTEGER PRIMARY KEY,
  CustomerID INTEGER NOT NULL REFERENCES Customers(CustomerID) ON DELETE RESTRICT,
  ...
);
CREATE TABLE OrderItems (
  OrderID   INTEGER NOT NULL REFERENCES Orders(OrderID) ON DELETE CASCADE,
  ...
);
```

| Option | Meaning | Use |
|---|---|---|
| `RESTRICT` / `NO ACTION` | Refuse to delete a parent that has children | Can't delete a customer who has orders |
| `CASCADE` | Delete children automatically | Deleting an order removes its items |
| `SET NULL` | Set the foreign key to NULL | Keep posts when an author account is removed |

Note: SQLite only enforces foreign keys after `PRAGMA foreign_keys = ON;` (many apps run this on every connection).

## Altering tables safely

```try-sql
CREATE TABLE Suppliers (SupplierID INTEGER PRIMARY KEY, Name TEXT NOT NULL);
ALTER TABLE Suppliers ADD COLUMN Phone TEXT;
ALTER TABLE Suppliers ADD COLUMN Active INTEGER NOT NULL DEFAULT 1;
ALTER TABLE Suppliers RENAME COLUMN Name TO CompanyName;
INSERT INTO Suppliers (CompanyName, Phone) VALUES ('Nairobi Electronics Ltd', '0722000000');
SELECT * FROM Suppliers;
```

On live systems, changes to tables are done through **migrations**: versioned scripts (Laravel, Django and Prisma all have migration tools) so every developer's and server's database stays in sync. Always back up before changing production tables.

## Naming conventions

- Pick one style and stick to it: `PascalCase` (Customers, OrderDate) or `snake_case` (customers, order_date).
- Table names: plural (Customers) or singular (Customer), but consistent.
- Primary key: `ID` or `TableNameID` (CustomerID).
- Foreign key: same name as the primary key it refers to.
- Avoid spaces and reserved words (`Order`, `Group`, `User` need quoting in some databases).

## Common mistakes

| Mistake | Fix |
|---|---|
| Phone numbers stored as INTEGER | TEXT |
| Money as FLOAT | DECIMAL or integer cents |
| No primary key | Every table needs one |
| Comma-separated lists in one column ("Maths,English") | A separate linking table |
| Same data in several tables | Normalise: store once, link by ID |
| No constraints, trusting the app | Add NOT NULL, UNIQUE, CHECK, foreign keys |

## Practice

1. Design tables for a chama: Members, Contributions (member, amount, date), Loans and Repayments.
2. Add CHECK constraints so contributions are positive and loan status is one of 'active', 'repaid', 'defaulted'.
3. Create a linking table for a many-to-many relationship between Students and Clubs.
4. Add a `CreatedAt` column with a default of the current time (`DEFAULT CURRENT_TIMESTAMP`).
5. Try inserting invalid data and read each error message.

:::think Why is storing "Maths,English,Kiswahili" in one Subjects column of a Students table a poor design?
You can't easily count students per subject, enforce valid subject names, add marks per subject, or update one subject without string manipulation. Queries become slow and error-prone. A separate linking table (StudentSubjects with StudentID and SubjectID) stores one row per combination and works with joins, constraints and indexes.
:::

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
Q: What is a primary key made of two or more columns called? (two words)
A: composite key | composite primary key
Q: Which ON DELETE option automatically deletes child rows?
A: CASCADE
Q: Which SQLite command must be run to enforce foreign keys? (PRAGMA ...)
A: PRAGMA foreign_keys = ON | foreign_keys | PRAGMA foreign_keys=ON
Q: What data type should phone numbers use: INTEGER or TEXT?
A: TEXT | text
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
