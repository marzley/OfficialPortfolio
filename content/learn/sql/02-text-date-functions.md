---
slug: text-date-functions
title: Text, number and date functions
after: case-null-having
---
# Text, number and date functions

Databases can clean, format and calculate as they read. These functions save you writing extra code in PHP or Python.

> Function names differ a little between databases. We show SQLite (used here) and note the MySQL version where it's different.

## Text functions

```try-sql
SELECT Name,
       UPPER(Name) AS Upper,
       LOWER(City) AS LowerCity,
       LENGTH(Name) AS Letters,
       SUBSTR(Phone, 1, 4) AS Prefix,
       SUBSTR(Phone, -3) AS Last3,
       REPLACE(Phone, '07', '+2547') AS Intl,
       Name || ' (' || City || ')' AS Label
FROM Customers;
```

| SQLite | MySQL | Does |
|---|---|---|
| `a || b` | `CONCAT(a, b)` | Join text |
| `SUBSTR(s, start, len)` | `SUBSTRING(s, start, len)` | Part of a string |
| `LENGTH(s)` | `CHAR_LENGTH(s)` | Number of characters |
| `UPPER`, `LOWER`, `TRIM`, `REPLACE` | same | |
| `INSTR(s, find)` | `LOCATE(find, s)` | Position of text |

## Searching text with LIKE

```try-sql
SELECT Name FROM Customers WHERE Name LIKE 'K%';        -- starts with K
SELECT Name FROM Products WHERE Name LIKE '%USB%';       -- contains USB
SELECT Name FROM Customers WHERE Name LIKE '_a%';        -- second letter a
```

`%` = any number of characters, `_` = exactly one character.

## Number functions

```try-sql
SELECT Name, Price,
       ROUND(Price * 1.16) AS WithVat,
       ROUND(Price * 0.9, 2) AS TenPercentOff,
       Price % 1000 AS Remainder,
       ABS(Price - 2000) AS DistanceFrom2000
FROM Products;
```

Integer division: in SQLite `7 / 2` gives `3` because both are whole numbers. Use `7 / 2.0` or `CAST(7 AS REAL) / 2` for `3.5`.

```try-sql
SELECT 7 / 2 AS IntDiv, 7 / 2.0 AS RealDiv, CAST('42' AS INTEGER) + 1 AS FromText;
```

## Dates

SQLite stores dates as text in `YYYY-MM-DD` format (which sorts correctly). MySQL has real `DATE` and `DATETIME` types.

```try-sql
SELECT DATE('now') AS Today,
       DATE('2026-08-02', '+30 days') AS DueDate,
       STRFTIME('%Y', '2026-08-02') AS Year,
       STRFTIME('%m', '2026-08-02') AS Month,
       JULIANDAY('2026-09-03') - JULIANDAY('2026-08-02') AS DaysBetween;
```

```try-sql
-- Orders per month
SELECT STRFTIME('%Y-%m', OrderDate) AS Month, COUNT(*) AS Orders, SUM(Quantity) AS Items
FROM Orders
GROUP BY Month
ORDER BY Month;

-- Orders in the first half of August
SELECT * FROM Orders WHERE OrderDate BETWEEN '2026-08-01' AND '2026-08-15';
```

| Task | SQLite | MySQL |
|---|---|---|
| Today | `DATE('now')` | `CURDATE()` |
| Add 30 days | `DATE(d, '+30 days')` | `DATE_ADD(d, INTERVAL 30 DAY)` |
| Year | `STRFTIME('%Y', d)` | `YEAR(d)` |
| Days between | `JULIANDAY(a) - JULIANDAY(b)` | `DATEDIFF(a, b)` |
| Format | `STRFTIME('%d/%m/%Y', d)` | `DATE_FORMAT(d, '%d/%m/%Y')` |

## Putting it together: a customer contact list

```try-sql
SELECT UPPER(SUBSTR(Name, 1, INSTR(Name, ' ') - 1)) AS FirstName,
       City,
       '+254' || SUBSTR(Phone, 2) AS WhatsApp
FROM Customers
ORDER BY City, FirstName;
```

```quiz
Q: SQLite joins text with ||. Which function does MySQL use instead?
A: CONCAT | CONCAT()
Q: In LIKE, which symbol matches any number of characters?
A: %
Q: What does SUBSTR('Kenya', 1, 3) return?
A: Ken
Q: In SQLite, what does 7 / 2 give?
A: 3
Q: Which date format sorts correctly as text: YYYY-MM-DD or DD/MM/YYYY?
A: YYYY-MM-DD
```
=== exercise ===
Show each customer's **Name** in capitals using `UPPER`.
=== starter ===
-- your query here
=== must_contain ===
UPPER(
Customers
