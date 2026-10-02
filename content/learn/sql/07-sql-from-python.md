---
slug: sql-from-code
title: "Using SQL from code: Python sqlite3, parameters, SQL injection and connecting apps to MySQL/PostgreSQL"
after: window-functions
---
# Using SQL from code: Python sqlite3, parameters, SQL injection and connecting apps to MySQL/PostgreSQL

Typing queries into a tool is great for learning and analysis, but most SQL in the real world is run **by programs**: a website saving a sign-up form, an M-Pesa callback recording a payment, a Python script producing a daily sales report, a mobile app syncing data. This unit shows how code talks to a database, using Python's built-in `sqlite3` module (no installation needed), and the one security rule every developer must follow: **never build SQL by pasting user input into a string**.

:::note What you will learn
- How applications connect to databases (drivers, connections, cursors)
- Creating tables and inserting data from Python
- Parameterised queries and why they matter
- SQL injection: how attacks work and how to prevent them
- Fetching results and turning them into reports
- Transactions in code
- Connecting to MySQL and PostgreSQL from Python, PHP and Node.js
- ORMs: what they are and when to use one
:::

## How code talks to a database

1. **Driver/library**: code that knows how to speak to a specific database (`sqlite3`, `mysql-connector-python`, `psycopg`, PHP's PDO, Node's `mysql2`/`pg`).
2. **Connection**: opened with a file path (SQLite) or host, port, database name, user and password (MySQL/PostgreSQL).
3. **Cursor / statement**: sends a query and receives rows.
4. **Commit**: saves changes; **close**: releases the connection.

## Your first database in Python

```try-python
import sqlite3

conn = sqlite3.connect(":memory:")      # a temporary database in memory; use "shop.db" for a file
cur = conn.cursor()

cur.execute("""
CREATE TABLE Products (
  ProductID INTEGER PRIMARY KEY,
  Name TEXT NOT NULL,
  Price INTEGER NOT NULL CHECK (Price > 0)
)""")

cur.execute("INSERT INTO Products (Name, Price) VALUES (?, ?)", ("Laptop bag", 2500))
cur.executemany("INSERT INTO Products (Name, Price) VALUES (?, ?)", [
    ("USB flash 32GB", 900),
    ("Wireless mouse", 1200),
    ("Bluetooth speaker", 3500),
])
conn.commit()

for row in cur.execute("SELECT ProductID, Name, Price FROM Products ORDER BY Price DESC"):
    print(row)

conn.close()
```

- `?` marks are **placeholders**; the values are passed separately as a tuple.
- `executemany` inserts many rows efficiently.
- Iterating over `cur.execute(...)` gives each row as a tuple.

## Fetching results

```try-python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row          # rows behave like dictionaries
conn.execute("CREATE TABLE Customers (Name TEXT, City TEXT)")
conn.executemany("INSERT INTO Customers VALUES (?, ?)",
                 [("Wanjiku", "Nairobi"), ("Otieno", "Kisumu"), ("Njeri", "Nairobi")])

one = conn.execute("SELECT COUNT(*) AS n FROM Customers").fetchone()
print("Customers:", one["n"])

rows = conn.execute("SELECT Name, City FROM Customers WHERE City = ?", ("Nairobi",)).fetchall()
for r in rows:
    print(r["Name"], "lives in", r["City"])
```

Note `("Nairobi",)`: a one-item tuple needs the trailing comma.

## SQL injection: the most famous database attack

Imagine a login check written like this:

```python
# DANGEROUS – never do this
query = "SELECT * FROM Users WHERE username = '" + username + "' AND password = '" + password + "'"
```

If an attacker types the username `admin' --`, the query becomes:

```sql
SELECT * FROM Users WHERE username = 'admin' --' AND password = '...'
```

`--` starts a comment, so the password check disappears and the attacker logs in as admin. Other inputs can read every table or delete data. SQL injection has caused many real data breaches.

Here's a safe demonstration of the difference:

```try-python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Users (username TEXT, secret TEXT)")
conn.executemany("INSERT INTO Users VALUES (?, ?)", [("admin", "top-secret"), ("amina", "my-notes")])

evil = "nobody' OR '1'='1"

unsafe = "SELECT username FROM Users WHERE username = '" + evil + "'"
print("Unsafe query returns:", conn.execute(unsafe).fetchall())      # every user leaks

safe = conn.execute("SELECT username FROM Users WHERE username = ?", (evil,)).fetchall()
print("Parameterised query returns:", safe)                          # nobody has that odd name
```

With placeholders, the database treats the input purely as **data**, never as SQL code.

:::warning The rules
- Always use parameters (`?`, `%s`, `:name`, depending on the library) for every value that comes from users, files, URLs or APIs.
- Never format SQL with `+`, f-strings or `.format()` using outside input.
- Table and column names can't be parameters; if they must vary, pick them from a fixed allow-list in your code.
- Give the app's database user only the permissions it needs.
- Store passwords hashed (bcrypt/argon2), never as plain text.
:::

## Transactions in code

```try-python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Accounts (Name TEXT PRIMARY KEY, Balance INTEGER CHECK (Balance >= 0))")
conn.executemany("INSERT INTO Accounts VALUES (?, ?)", [("Wanjiku", 5000), ("Otieno", 1000)])
conn.commit()

def transfer(sender, receiver, amount):
    try:
        with conn:      # commits if the block succeeds, rolls back if it raises an error
            conn.execute("UPDATE Accounts SET Balance = Balance + ? WHERE Name = ?", (amount, receiver))
            conn.execute("UPDATE Accounts SET Balance = Balance - ? WHERE Name = ?", (amount, sender))
        print("Sent", amount)
    except sqlite3.IntegrityError:
        print("Transfer of", amount, "failed: insufficient balance, nothing changed")

transfer("Wanjiku", "Otieno", 2000)
transfer("Wanjiku", "Otieno", 9000)
print(conn.execute("SELECT * FROM Accounts").fetchall())
```

The second transfer adds 9,000 to Otieno first, then fails the CHECK on Wanjiku's balance, so the whole transaction is rolled back and Otieno's balance is restored.

## A daily report script

```try-python
import sqlite3, csv, io
conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE Sales (Day TEXT, Product TEXT, Qty INTEGER, Price INTEGER);
INSERT INTO Sales VALUES ('2026-09-01','Charger',3,800), ('2026-09-01','Mouse',1,1200),
                         ('2026-09-02','Charger',2,800), ('2026-09-02','Speaker',1,3500);
""")
rows = conn.execute("""
  SELECT Day, SUM(Qty) AS Units, SUM(Qty * Price) AS Revenue
  FROM Sales GROUP BY Day ORDER BY Day
""").fetchall()

out = io.StringIO()               # in a real script: open("report.csv", "w", newline="")
w = csv.writer(out)
w.writerow(["Day", "Units", "Revenue"])
w.writerows(rows)
print(out.getvalue())
```

Schedule a script like this with cron (Linux) or Task Scheduler (Windows) and email the CSV every morning.

## Connecting to MySQL and PostgreSQL

The pattern is the same; only the driver and placeholder style change.

**Python + MySQL** (`pip install mysql-connector-python`):

```python
import mysql.connector
conn = mysql.connector.connect(host="localhost", user="shop_app", password=os.environ["DB_PASS"], database="shop")
cur = conn.cursor()
cur.execute("SELECT Name, Price FROM Products WHERE Price < %s", (1000,))
print(cur.fetchall())
```

**Python + PostgreSQL** (`pip install psycopg`): same `%s` placeholders.

**PHP (PDO)**:

```php
$pdo = new PDO('mysql:host=localhost;dbname=shop;charset=utf8mb4', 'shop_app', getenv('DB_PASS'));
$stmt = $pdo->prepare('SELECT Name, Price FROM Products WHERE Category = ?');
$stmt->execute([$_GET['category'] ?? '']);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
```

**Node.js (mysql2)**:

```js
const [rows] = await pool.execute('SELECT Name FROM Customers WHERE City = ?', [city]);
```

:::tip Keep credentials out of code
Read database passwords from environment variables or a config file **outside** your public web folder, and never commit them to Git.
:::

## ORMs

An **ORM** (Object-Relational Mapper) lets you work with tables as classes and objects: SQLAlchemy and Django ORM (Python), Eloquent (Laravel/PHP), Prisma and Sequelize (Node.js), Room (Android). Benefits: less repetitive code, automatic parameters, migrations. Downsides: it can hide slow queries. Learn SQL first; then ORMs make sense and you can debug them.

:::think A PHP page builds `"SELECT * FROM Orders WHERE OrderID = " . $_GET['id']`. An attacker visits `orders.php?id=1 OR 1=1`. What happens, and how do you fix it?
The query becomes `... WHERE OrderID = 1 OR 1=1`, which is true for every row, so all orders leak. Fix: a prepared statement with a placeholder (`WHERE OrderID = ?` and `execute([$_GET['id']])`), plus checking that the user is allowed to see that order.
:::

## Summary

- Programs use a driver to open a connection, run queries through a cursor/statement, commit changes and close.
- Python's sqlite3 needs no installation: `execute`, `executemany`, `fetchone`, `fetchall`, `row_factory`.
- Always use parameterised queries; string-built SQL allows SQL injection.
- Use transactions (`with conn:`) so multi-step changes succeed or fail together.
- MySQL/PostgreSQL work the same way with their own drivers and placeholders; keep credentials out of code; ORMs build on SQL knowledge.

```quiz
Q: Which placeholder symbol does Python's sqlite3 use?
A: ?
Q: What is the attack where user input changes the meaning of a SQL query? (two words)
A: SQL injection
Q: Which method inserts many rows in one call?
A: executemany
Q: Which method returns just one row?
A: fetchone
Q: Can a table name be passed as a query parameter? (yes/no)
A: no
Q: What does ORM stand for?
A: Object-Relational Mapper | object relational mapper | object-relational mapping | object relational mapping
```

=== exercise ===
Using the sample shop database, write the query an app would run (with the city typed in directly for now) to list the **Name** and **Phone** of customers in **Kisumu**, sorted by name.
=== starter ===
SELECT Name, Phone FROM Customers
=== expected ===
Achieng Atieno,0712000003
=== must_contain ===
WHERE
ORDER BY
