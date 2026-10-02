---
slug: keys-design
title: "Keys, relationships and table design: primary keys, foreign keys, one-to-many, many-to-many and normalisation"
after: KEEP
---
# Keys, relationships and table design: primary keys, foreign keys, one-to-many, many-to-many and normalisation

Writing queries is half of SQL. The other half is **designing** tables so data stays correct, fast and easy to query for years. A badly designed database causes duplicate records, contradictions ("which phone number is right?"), slow reports and painful changes. A well-designed one makes almost every question a simple JOIN away.

This unit teaches how professionals design databases: keys, relationships, normalisation and a step-by-step method you can use for a school, a chama, a shop or a hospital system.

:::note What you will learn
- Entities, attributes and rows
- Primary keys: natural vs surrogate
- Foreign keys and referential integrity
- One-to-one, one-to-many and many-to-many relationships
- Junction (bridge) tables
- Normalisation: 1NF, 2NF, 3NF in plain language
- When to denormalise
- A full design walkthrough: a school system
- Drawing ER diagrams
:::

## Entities and attributes

- An **entity** is a "thing" you store data about: Student, Course, Teacher, Payment. Each entity usually becomes a **table**.
- An **attribute** is a fact about it: a student's name, date of birth, admission number. Each attribute becomes a **column**.
- Each **row** is one instance: one particular student.

## Primary keys

A **primary key (PK)** uniquely identifies each row. Rules: unique, never NULL, and ideally never changes.

| Type | Example | Pros | Cons |
|---|---|---|---|
| **Natural key** | National ID number, KRA PIN, admission number | Meaningful | Can change, can be missing (children have no ID), privacy concerns |
| **Surrogate key** | Auto-number `StudentID` 1, 2, 3... | Simple, stable, small | Has no meaning outside the database |

Most systems use a **surrogate** key as the PK and store natural identifiers as ordinary columns with a `UNIQUE` constraint.

```try-sql
CREATE TABLE Students (
  StudentID INTEGER PRIMARY KEY,           -- surrogate key
  AdmissionNo TEXT NOT NULL UNIQUE,        -- natural identifier
  Name TEXT NOT NULL,
  DateOfBirth TEXT
);
INSERT INTO Students (AdmissionNo, Name, DateOfBirth) VALUES ('ADM001', 'Brian Kipchumba', '2010-03-14');
INSERT INTO Students (AdmissionNo, Name, DateOfBirth) VALUES ('ADM002', 'Faith Chebet', '2010-07-02');
SELECT * FROM Students;
```

A **composite key** uses two or more columns together, e.g. `(StudentID, CourseID)` in an enrolments table.

## Foreign keys

A **foreign key (FK)** is a column that refers to another table's primary key. It enforces **referential integrity**: you can't have an order for a customer who doesn't exist.

```try-sql
PRAGMA foreign_keys = ON;   -- SQLite needs this switched on
CREATE TABLE Classes (ClassID INTEGER PRIMARY KEY, Name TEXT NOT NULL);
CREATE TABLE Pupils (
  PupilID INTEGER PRIMARY KEY,
  Name TEXT NOT NULL,
  ClassID INTEGER REFERENCES Classes(ClassID)
);
INSERT INTO Classes VALUES (1, 'Grade 7 East'), (2, 'Grade 7 West');
INSERT INTO Pupils (Name, ClassID) VALUES ('Halima', 1), ('Juma', 2);
SELECT p.Name, c.Name AS Class FROM Pupils p JOIN Classes c ON c.ClassID = p.ClassID;
```

Now try inserting a pupil into class 9, which doesn't exist:

```try-sql
-- fails on purpose: class 9 does not exist
PRAGMA foreign_keys = ON;
CREATE TABLE Classes (ClassID INTEGER PRIMARY KEY, Name TEXT);
CREATE TABLE Pupils (PupilID INTEGER PRIMARY KEY, Name TEXT, ClassID INTEGER REFERENCES Classes(ClassID));
INSERT INTO Classes VALUES (1, 'Grade 7 East');
INSERT INTO Pupils (Name, ClassID) VALUES ('Ghost pupil', 9);
```

The database refuses with a "FOREIGN KEY constraint failed" error, protecting your data.

### What happens on delete?

| Option | Meaning |
|---|---|
| `ON DELETE RESTRICT` / `NO ACTION` (default) | Can't delete a class that still has pupils |
| `ON DELETE CASCADE` | Deleting a class deletes its pupils too (careful!) |
| `ON DELETE SET NULL` | Pupils stay, but their ClassID becomes NULL |

Use CASCADE for truly dependent data (an order's line items), not for important records.

## Relationship types

### One-to-many (most common)

One customer has many orders; each order belongs to one customer. Put the FK on the "many" side: `Orders.CustomerID`.

### One-to-one

One user has one profile. Put a UNIQUE FK on one side, or keep both in one table unless you have a reason to split (optional or sensitive data).

### Many-to-many

A student takes many courses; a course has many students. You **can't** store this with a single FK. You need a **junction table** (also called a bridge or link table):

```try-sql
CREATE TABLE Students (StudentID INTEGER PRIMARY KEY, Name TEXT);
CREATE TABLE Courses (CourseID INTEGER PRIMARY KEY, Title TEXT);
CREATE TABLE Enrolments (
  StudentID INTEGER REFERENCES Students(StudentID),
  CourseID INTEGER REFERENCES Courses(CourseID),
  EnrolledOn TEXT,
  Grade TEXT,
  PRIMARY KEY (StudentID, CourseID)
);
INSERT INTO Students VALUES (1, 'Brian'), (2, 'Faith'), (3, 'Wairimu');
INSERT INTO Courses VALUES (10, 'Python'), (11, 'Excel'), (12, 'Networking');
INSERT INTO Enrolments VALUES (1, 10, '2026-01-10', 'A'), (1, 11, '2026-01-10', 'B'),
                              (2, 10, '2026-01-12', 'B'), (3, 12, '2026-02-01', NULL);
SELECT s.Name, c.Title, e.Grade
FROM Enrolments e
JOIN Students s ON s.StudentID = e.StudentID
JOIN Courses c ON c.CourseID = e.CourseID
ORDER BY s.Name;
```

The junction table can carry facts about the relationship itself: enrolment date, grade, fee paid.

## Normalisation in plain language

Normalisation is a set of rules that remove repetition and contradictions.

### Unnormalised data

| StudentName | Phone | Courses |
|---|---|---|
| Brian | 0711..., 0722... | Python, Excel |

Problems: several values in one cell, hard to search, hard to update.

### First Normal Form (1NF): one value per cell, no repeating groups

Each cell holds a single value; no columns like Course1, Course2, Course3. Use extra rows or a separate table instead.

### Second Normal Form (2NF): every column depends on the whole key

In a table keyed by `(StudentID, CourseID)`, `StudentName` depends only on StudentID, not the whole key. Move it to the Students table.

### Third Normal Form (3NF): no column depends on another non-key column

If a Students table has `ClassID` and `ClassTeacher`, the teacher depends on the class, not the student. Move ClassTeacher to the Classes table.

A memorable summary: every non-key column should depend on **the key, the whole key, and nothing but the key**.

## When to denormalise

Sometimes you intentionally repeat data for speed or history:
- Store `UnitPrice` on each order line, because the product price will change later but the order must remember what was charged.
- Reporting tables or data warehouses store pre-joined, summarised data for fast dashboards.

Denormalise deliberately, not by accident.

## Design walkthrough: a school fees system

1. **List the entities**: Students, Classes, Terms, FeeItems (tuition, lunch, transport), Invoices, Payments, Guardians.
2. **List attributes** for each: Students(AdmissionNo, Name, DOB, ClassID), Payments(Amount, Method, MpesaRef, PaidOn)...
3. **Find relationships**:
   - Class 1–many Students
   - Student many–many Guardians (a guardian may have several children; a child may have two guardians) → `StudentGuardians` junction
   - Student 1–many Invoices; Invoice 1–many Payments
4. **Choose keys**: surrogate PKs; UNIQUE on AdmissionNo and MpesaRef.
5. **Add constraints**: `Amount > 0`, `NOT NULL` where required.
6. **Test with questions**: "What's each student's balance this term?" If a question needs messy workarounds, revisit the design.

## ER diagrams

An **Entity-Relationship (ER) diagram** draws tables as boxes and relationships as lines. Crow's-foot notation shows "many" as a three-pronged foot. Free tools: draw.io (diagrams.net), dbdiagram.io, Lucidchart (free tier). Draw the diagram before writing `CREATE TABLE` statements; it's much cheaper to fix a drawing than a live database.

:::think A chama database has a Members table with columns Contribution1, Contribution2, ... Contribution12 for each month. What's wrong, and how would you redesign it?
It breaks 1NF (repeating groups): adding a 13th month needs a new column, and totals are awkward. Create a Contributions table: ContributionID, MemberID (FK), Month, Amount, PaidOn, MpesaRef. Then totals are a simple GROUP BY.
:::

## Summary

- Entities become tables, attributes become columns; each table needs a primary key (usually a surrogate).
- Foreign keys link tables and enforce referential integrity; choose ON DELETE behaviour carefully.
- One-to-many uses an FK on the many side; many-to-many needs a junction table.
- Normalise to 3NF: one value per cell, depend on the whole key, nothing but the key.
- Denormalise only on purpose (historical prices, reporting); design on an ER diagram first.

```quiz
Q: What uniquely identifies each row in a table? (two words)
A: primary key
Q: What kind of table links two tables in a many-to-many relationship? (one word)
A: junction | bridge | link | linking
Q: In a one-to-many relationship, which side gets the foreign key: one or many?
A: many | the many side
Q: An auto-numbered ID with no outside meaning is what kind of key?
A: surrogate | surrogate key
Q: Columns like Course1, Course2, Course3 break which normal form? (e.g. 1NF)
A: 1NF | first normal form | first
Q: Which ON DELETE option deletes child rows automatically?
A: CASCADE | ON DELETE CASCADE
```
