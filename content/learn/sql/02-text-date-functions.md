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

## Why text and date functions matter

Business data is full of text and dates: names, phone numbers, product codes, cities, order dates, due dates, payment times. Reports need them formatted, cleaned and grouped: "sales per month", "customers whose names start with K", "orders in the last 30 days", "phone numbers in 2547 format". These functions let the database do that work instead of exporting everything to Excel.

## Cleaning and formatting text

```try-sql
SELECT
  Name,
  UPPER(Name)                                   AS Upper,
  LENGTH(Name)                                  AS Chars,
  SUBSTR(Name, 1, INSTR(Name, ' ') - 1)         AS FirstName,
  SUBSTR(Name, INSTR(Name, ' ') + 1)            AS LastName,
  '254' || SUBSTR(Phone, 2)                     AS IntlPhone,
  SUBSTR(Phone, 1, 4) || '***' || SUBSTR(Phone, -3) AS Masked
FROM Customers;
```

`INSTR` finds the position of the space, so SUBSTR can split first and last names. Masking phone numbers is good practice when sharing reports with people who don't need full numbers.

## TRIM, REPLACE and consistent values

Data typed by people needs cleaning:

```try-sql
WITH messy(raw) AS (
  VALUES ('  nairobi '), ('NAIROBI'), ('Nrb'), ('Kisumu  '), ('mombasa')
)
SELECT raw,
  TRIM(raw) AS Trimmed,
  UPPER(SUBSTR(TRIM(raw), 1, 1)) || LOWER(SUBSTR(TRIM(raw), 2)) AS Proper,
  CASE UPPER(TRIM(raw)) WHEN 'NRB' THEN 'Nairobi' ELSE UPPER(SUBSTR(TRIM(raw), 1, 1)) || LOWER(SUBSTR(TRIM(raw), 2)) END AS Clean
FROM messy;
```

`WITH ... AS (VALUES ...)` creates a temporary table on the fly: handy for experimenting.

## Pattern matching beyond LIKE

| Pattern | Matches |
|---|---|
| `LIKE 'K%'` | Starts with K |
| `LIKE '%bag%'` | Contains "bag" (case-insensitive for ASCII in SQLite) |
| `LIKE '_____'` | Exactly 5 characters (each `_` is one character) |
| `LIKE '07%'` | Phone numbers starting 07 |
| `GLOB 'K*'` | Starts with capital K (case-sensitive, SQLite) |

```try-sql
SELECT Name FROM Products WHERE Name LIKE '%USB%' OR Name LIKE '%disk%';
SELECT Name FROM Customers WHERE Name LIKE '% A%';    -- surname starts with A
```

## Number formatting

```try-sql
SELECT Name, Price,
  ROUND(Price * 1.16, 2)         AS WithVAT,
  ROUND(Price * 0.16 / 1.16, 2)  AS VATIncluded,
  printf('KSh %,d', Price)       AS Formatted,
  Price / 1000                   AS Thousands,
  Price / 1000.0                 AS ThousandsDecimal,
  Price % 1000                   AS Remainder
FROM Products;
```

Remember integer division: `Price / 1000` drops decimals when both values are integers; multiply by `1.0` or use a decimal literal to keep them. (`printf` with `%,d` is available in recent SQLite versions; MySQL uses `FORMAT(Price, 0)`.)

## Grouping by month, week and weekday

```try-sql
SELECT strftime('%Y-%m', OrderDate) AS Month,
       COUNT(*) AS Orders
FROM Orders
GROUP BY Month
ORDER BY Month;

SELECT OrderID, OrderDate,
  CASE strftime('%w', OrderDate)
    WHEN '0' THEN 'Sunday' WHEN '1' THEN 'Monday' WHEN '2' THEN 'Tuesday'
    WHEN '3' THEN 'Wednesday' WHEN '4' THEN 'Thursday' WHEN '5' THEN 'Friday'
    ELSE 'Saturday' END AS Weekday
FROM Orders;
```

## Date arithmetic

```try-sql
SELECT OrderID, OrderDate,
  date(OrderDate, '+14 days')                          AS DeliveryDue,
  date(OrderDate, 'start of month')                    AS MonthStart,
  date(OrderDate, 'start of month', '+1 month', '-1 day') AS MonthEnd,
  CAST(julianday('2026-09-30') - julianday(OrderDate) AS INTEGER) AS DaysBeforeSep30
FROM Orders;
```

In a live system you'd use `date('now')` instead of a fixed date: `WHERE OrderDate >= date('now', '-30 days')` gives the last 30 days.

## The same ideas in MySQL and PostgreSQL

| Task | SQLite | MySQL | PostgreSQL |
|---|---|---|---|
| Join text | `a || b` | `CONCAT(a, b)` | `a || b` or `CONCAT` |
| Current date | `date('now')` | `CURDATE()` | `CURRENT_DATE` |
| Month from date | `strftime('%m', d)` | `MONTH(d)` | `EXTRACT(MONTH FROM d)` |
| Add days | `date(d, '+7 days')` | `DATE_ADD(d, INTERVAL 7 DAY)` | `d + INTERVAL '7 days'` |
| Days between | `julianday(a) - julianday(b)` | `DATEDIFF(a, b)` | `a - b` |
| Format date | `strftime('%d/%m/%Y', d)` | `DATE_FORMAT(d, '%d/%m/%Y')` | `TO_CHAR(d, 'DD/MM/YYYY')` |

The concepts are identical; only the function names differ. Search "[database] date functions" when switching systems.

## Storing dates correctly

- Store dates as ISO text (`YYYY-MM-DD`) in SQLite, or as proper `DATE`/`DATETIME`/`TIMESTAMP` types in MySQL and PostgreSQL.
- Store times in UTC when systems span time zones, and convert to East Africa Time (UTC+3) for display.
- Never store dates as `DD/MM/YYYY` text: sorting and comparisons break.

## Practice

1. Show each customer's first name and city in capitals.
2. List products whose names contain "phone" or "speaker" (any case).
3. Count orders per month and per weekday.
4. Calculate a delivery due date 7 days after each order.
5. Show each product price with VAT, rounded to 2 decimals, and formatted with commas.

:::think Why does `SELECT 2500 / 1000` return 2 in SQLite, and how do you get 2.5?
Both numbers are integers, so SQLite performs integer division and drops the remainder. Make one value a decimal: `2500 / 1000.0`, `2500 * 1.0 / 1000`, or `CAST(2500 AS REAL) / 1000`.
:::

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
Q: Which SQLite function finds the position of one text inside another?
A: INSTR | instr
Q: In LIKE, which symbol matches exactly one character?
A: _ | underscore
Q: Which SQLite function formats dates, e.g. to get the month?
A: strftime
Q: Which function joins text in MySQL?
A: CONCAT
```
=== exercise ===
Show each customer's **Name** in capitals using `UPPER`.
=== starter ===
-- your query here
=== must_contain ===
UPPER(
Customers
