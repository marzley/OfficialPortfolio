---
slug: select
title: "SELECT: reading data from a table, choosing columns, aliases, calculations and DISTINCT"
after: KEEP
---
# SELECT: reading data from a table, choosing columns, aliases, calculations and DISTINCT

`SELECT` is the SQL command you'll use more than any other. It asks the database a question and gets back a **result set**: a table of rows and columns. Every report, dashboard, app screen and data analysis starts with a `SELECT`. When you open your M-Pesa statement, an online shop's product list or your school portal results, a `SELECT` query ran behind the scenes.

This unit teaches `SELECT` thoroughly using the sample Kenyan shop database built into this hub: **Customers**, **Products** and **Orders**. Every example can be run with the **Run** button.

:::note What you will learn
- The structure of a SELECT query and how the database reads it
- Selecting all columns vs specific columns
- Column aliases with AS
- Calculated columns (arithmetic) and string joining
- DISTINCT to remove duplicates
- LIMIT to get a few rows
- Comments, formatting and common errors
:::

## The sample database

| Table | Columns |
|---|---|
| **Customers** | CustomerID, Name, City, Phone |
| **Products** | ProductID, Name, Category, Price |
| **Orders** | OrderID, CustomerID, ProductID, Quantity, OrderDate |

## The basic shape

```sql
SELECT column1, column2
FROM table_name;
```

- `SELECT` lists **what** you want (columns or calculations).
- `FROM` says **where** the data comes from (a table).
- The semicolon `;` ends the statement. Many tools accept a single query without it, but it's a good habit.

SQL keywords are **not case-sensitive** (`select` works like `SELECT`), but writing keywords in capitals makes queries easier to read. Table and column names in this database start with capitals.

## Select every column

```try-sql
SELECT * FROM Products;
```

`*` means "all columns". It's great for exploring a table, but in real applications list the columns you need: it's faster, clearer, and won't break if someone adds a column later.

## Select specific columns

```try-sql
SELECT Name, Price FROM Products;
```

The result shows columns in the order you list them, not the order in the table:

```try-sql
SELECT Price, Name, Category FROM Products;
```

## Aliases: renaming columns in the result

`AS` gives a column a friendlier name in the output. It doesn't change the table.

```try-sql
SELECT Name AS Product, Price AS "Price (KSh)" FROM Products;
```

Use double quotes for aliases with spaces or special characters. Aliases are very useful for calculated columns, which otherwise get ugly names.

## Calculated columns

You can do arithmetic in `SELECT`: `+`, `-`, `*`, `/`.

```try-sql
SELECT Name,
       Price,
       Price * 1.16 AS PriceWithVAT,
       Price * 0.9 AS SalePrice
FROM Products;
```

Rounding makes money look right:

```try-sql
SELECT Name, ROUND(Price * 1.16, 2) AS PriceWithVAT FROM Products;
```

:::warning Integer division
In SQLite (and some other databases) dividing two whole numbers gives a whole number: `7 / 2` is `3`. Use a decimal to get `3.5`: `7 / 2.0` or `7 * 1.0 / 2`.
:::

```try-sql
SELECT 7 / 2 AS WholeDivision, 7 / 2.0 AS DecimalDivision;
```

## Joining text together

The `||` operator joins (concatenates) text in SQLite, PostgreSQL and Oracle. MySQL uses `CONCAT()`.

```try-sql
SELECT Name || ' (' || City || ')' AS CustomerLabel FROM Customers;
```

## DISTINCT: unique values only

Which cities do our customers live in?

```try-sql
SELECT City FROM Customers;
```

Some cities repeat. `DISTINCT` removes duplicates:

```try-sql
SELECT DISTINCT City FROM Customers;
```

With several columns, `DISTINCT` removes rows where **all** listed columns are the same:

```try-sql
SELECT DISTINCT Category FROM Products;
```

## LIMIT: just a few rows

Large tables can have millions of rows. `LIMIT` returns only the first few:

```try-sql
SELECT Name, Price FROM Products LIMIT 3;
```

Different databases spell this differently: SQL Server uses `SELECT TOP 3 ...`, Oracle uses `FETCH FIRST 3 ROWS ONLY`. Without `ORDER BY` (next lesson) "the first 3" can be any 3 rows.

## Selecting without a table

You can use `SELECT` as a calculator or to test functions:

```try-sql
SELECT 2500 * 3 AS Total, UPPER('nairobi') AS Town, DATE('now') AS Today;
```

## Comments and formatting

```try-sql
-- This is a single-line comment
/* This is a
   multi-line comment */
SELECT Name,      -- product name
       Price      -- in KSh
FROM Products;
```

Put each column on its own line in longer queries. Readable SQL is easier to debug and review.

## How the database processes a SELECT

You write `SELECT ... FROM ...`, but the database logically works in this order:

1. **FROM**: find the table(s)
2. **WHERE**: filter rows
3. **GROUP BY**: make groups
4. **HAVING**: filter groups
5. **SELECT**: compute the columns
6. **ORDER BY**: sort
7. **LIMIT**: cut the rows

This explains things later, such as why you can't use a SELECT alias in WHERE in most databases.

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `no such table: product` | Wrong table name | Check spelling: `Products` |
| `no such column: Prise` | Typo in column name | Check spelling |
| `near "FROM": syntax error` | Missing comma or extra comma before FROM | `SELECT Name, Price FROM`, no comma before FROM |
| Text without quotes | `'Nairobi'` must be in single quotes | Use single quotes for text values |

:::think You write `SELECT Name Price FROM Products;` (forgetting the comma). It runs without an error, but the result has one column called "Price" containing product names. Why?
Without the comma, SQL reads `Price` as an **alias** for `Name` (the `AS` keyword is optional). So it shows the Name column renamed to Price. Always check commas between columns.
:::

## Summary

- `SELECT columns FROM table` reads data; `*` selects all columns.
- `AS` creates aliases; calculated columns use arithmetic and functions like `ROUND`.
- `||` joins text in SQLite; watch out for integer division.
- `DISTINCT` removes duplicate rows; `LIMIT` returns a few rows.
- The database processes FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.

```quiz
Q: Which symbol selects all columns?
A: *
Q: Which keyword gives a column a new name in the result?
A: AS
Q: Which keyword removes duplicate rows from the result?
A: DISTINCT
Q: In SQLite, what is 7 / 2?
A: 3
Q: Which keyword returns only the first few rows in SQLite and MySQL?
A: LIMIT
Q: Which clause does the database process first: SELECT or FROM?
A: FROM
```

=== exercise ===
Select only the **Name** and **Price** columns from the **Products** table.
=== starter ===

=== expected ===
Name,Price
=== must_contain ===
SELECT
Products
