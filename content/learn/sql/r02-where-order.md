---
slug: where-order
title: "WHERE and ORDER BY: filtering rows with conditions, AND/OR, IN, BETWEEN, LIKE and sorting"
after: KEEP
---
# WHERE and ORDER BY: filtering rows with conditions, AND/OR, IN, BETWEEN, LIKE and sorting

Real tables hold thousands or millions of rows, and you rarely want all of them. A bank wants transactions from *this month*, a shop wants products *under KSh 1,000*, a school wants students *in Form 4 East*. `WHERE` filters rows to just the ones you need, and `ORDER BY` sorts the result. Together they answer most everyday questions asked of a database.

:::note What you will learn
- WHERE with comparison operators
- Combining conditions with AND, OR, NOT and brackets
- IN, BETWEEN and LIKE patterns
- Filtering text, numbers and dates
- ORDER BY ascending and descending, by several columns
- Top-N queries with ORDER BY + LIMIT
:::

## WHERE: keep only matching rows

```sql
SELECT columns
FROM table
WHERE condition;
```

```try-sql
SELECT * FROM Customers WHERE City = 'Nairobi';
```

Text values go in **single quotes**. Numbers don't.

```try-sql
SELECT Name, Price FROM Products WHERE Price > 2000;
```

## Comparison operators

| Operator | Meaning | Example |
|---|---|---|
| `=` | equal | `City = 'Kisumu'` |
| `<>` or `!=` | not equal | `Category <> 'Storage'` |
| `>` / `<` | greater / less than | `Price > 1000` |
| `>=` / `<=` | greater/less or equal | `Quantity >= 2` |

```try-sql
SELECT Name, Category FROM Products WHERE Category <> 'Storage';
```

:::tip Case sensitivity
In SQLite, `=` on text is case-sensitive: `'nairobi'` doesn't match `'Nairobi'`. Use `LOWER(City) = 'nairobi'` to ignore case. MySQL usually ignores case by default; it depends on the database settings.
:::

## AND, OR, NOT

- `AND`: both conditions must be true.
- `OR`: at least one must be true.
- `NOT`: reverses a condition.

```try-sql
SELECT Name, Category, Price
FROM Products
WHERE Category = 'Electronics' AND Price < 1000;
```

```try-sql
SELECT Name, City FROM Customers WHERE City = 'Kisumu' OR City = 'Mombasa';
```

### Brackets matter

`AND` is evaluated before `OR`, just like multiplication before addition. Compare:

```try-sql
-- Accessories of any price, plus Electronics under 1000
SELECT Name, Category, Price FROM Products
WHERE Category = 'Accessories' OR Category = 'Electronics' AND Price < 1000;
```

```try-sql
-- Accessories or Electronics, all under 1000
SELECT Name, Category, Price FROM Products
WHERE (Category = 'Accessories' OR Category = 'Electronics') AND Price < 1000;
```

When you mix AND and OR, **always use brackets** to make your meaning clear.

## IN: match any value in a list

```try-sql
SELECT Name, City FROM Customers WHERE City IN ('Kisumu', 'Mombasa', 'Eldoret');
```

`NOT IN` excludes the list:

```try-sql
SELECT Name, City FROM Customers WHERE City NOT IN ('Nairobi');
```

## BETWEEN: a range (inclusive)

```try-sql
SELECT Name, Price FROM Products WHERE Price BETWEEN 800 AND 2500;
```

Both ends are included: 800 and 2500 match. It also works with dates stored as `YYYY-MM-DD` text:

```try-sql
SELECT * FROM Orders WHERE OrderDate BETWEEN '2026-08-01' AND '2026-08-31';
```

## LIKE: text patterns

| Pattern | Matches |
|---|---|
| `'A%'` | starts with A |
| `'%a'` | ends with a |
| `'%phone%'` | contains "phone" |
| `'_a%'` | second letter is a (`_` is exactly one character) |

```try-sql
SELECT Name FROM Customers WHERE Name LIKE 'A%';
```

```try-sql
SELECT Name FROM Products WHERE Name LIKE '%USB%';
```

```try-sql
-- Safaricom-style numbers starting 0712
SELECT Name, Phone FROM Customers WHERE Phone LIKE '0712%';
```

In SQLite, `LIKE` ignores case for English letters, so `'%usb%'` also matches "USB".

## NULL: missing values

`NULL` means "unknown or missing". You can't compare it with `=`; use `IS NULL` or `IS NOT NULL`:

```sql
SELECT * FROM Customers WHERE Phone IS NULL;
```

The CASE, NULL and HAVING lesson covers NULL in depth.

## ORDER BY: sorting

```try-sql
SELECT Name, Price FROM Products ORDER BY Price;
```

Ascending (`ASC`, smallest first) is the default. Use `DESC` for largest first:

```try-sql
SELECT Name, Price FROM Products ORDER BY Price DESC;
```

### Sorting by several columns

Sort by category A–Z, then by price high to low within each category:

```try-sql
SELECT Category, Name, Price FROM Products ORDER BY Category ASC, Price DESC;
```

Text sorts alphabetically; dates in `YYYY-MM-DD` format sort correctly as text, which is why that format is the standard.

You can sort by an alias or calculated column:

```try-sql
SELECT Name, Price * 1.16 AS WithVAT FROM Products ORDER BY WithVAT DESC;
```

## Top-N queries

The 3 most expensive products:

```try-sql
SELECT Name, Price FROM Products ORDER BY Price DESC LIMIT 3;
```

The most recent order:

```try-sql
SELECT * FROM Orders ORDER BY OrderDate DESC LIMIT 1;
```

## Putting it together

Customers outside Nairobi whose name contains "o", sorted by city then name:

```try-sql
SELECT Name, City
FROM Customers
WHERE City <> 'Nairobi' AND Name LIKE '%o%'
ORDER BY City, Name;
```

Order of clauses is fixed: `SELECT → FROM → WHERE → ORDER BY → LIMIT`.

:::think A manager asks for "orders in August with quantity 2 or more, or any order from customer 5". Write the WHERE clause with correct brackets.
`WHERE (OrderDate BETWEEN '2026-08-01' AND '2026-08-31' AND Quantity >= 2) OR CustomerID = 5`. The brackets group the August-and-quantity condition, so customer 5's orders are included regardless of month.
:::

## Summary

- `WHERE` filters rows with `=`, `<>`, `>`, `<`, `>=`, `<=`; text in single quotes.
- Combine conditions with AND, OR, NOT, and use brackets when mixing them.
- `IN` matches a list, `BETWEEN` a range (inclusive), `LIKE` text patterns with `%` and `_`.
- Use `IS NULL` for missing values.
- `ORDER BY` sorts (ASC default, DESC for reverse), by one or more columns; with `LIMIT` it gives top-N results.

```quiz
Q: Which keyword sorts results from largest to smallest?
A: DESC
Q: Which wildcard in LIKE matches any number of characters?
A: %
Q: Does BETWEEN 800 AND 2500 include 2500? (yes/no)
A: yes
Q: Which is evaluated first without brackets: AND or OR?
A: AND
Q: How do you check for missing values? (two words)
A: IS NULL
Q: Which keyword matches any value in a list like ('Kisumu', 'Mombasa')?
A: IN
```

=== exercise ===
Select all customers from **Nairobi**.
=== starter ===
SELECT * FROM Customers
=== expected ===
Wanjiku Mwangi,Nairobi
=== must_contain ===
WHERE
