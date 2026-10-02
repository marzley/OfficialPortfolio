---
slug: mysql-pdo
title: "MySQL with PDO: connecting safely, prepared statements, fetching rows, inserting, transactions and error handling"
after: KEEP
---
# MySQL with PDO: connecting safely, prepared statements, fetching rows, inserting, transactions and error handling

Almost every dynamic website stores its data in a database: products, customers, orders, students, bookings, payments. **MySQL** (and its close relative **MariaDB**) is the database that comes with nearly every PHP hosting plan, and **PDO (PHP Data Objects)** is the modern, secure way for PHP to talk to it. This unit shows how to connect, run queries safely with **prepared statements**, display results, insert and update data, use transactions, and handle errors, with the security practices that stop SQL injection, one of the most damaging web attacks.

You'll need the SQL subject's basics (SELECT, INSERT, UPDATE, DELETE, JOIN). The examples here use a small shop database.

:::note What you will learn
- MySQL, MariaDB and phpMyAdmin
- Creating a database and a dedicated user
- Connecting with PDO, the right options and charset
- Keeping credentials out of your code
- SQL injection and why prepared statements prevent it
- Fetching one row, many rows, a single value
- Inserting, updating and deleting with prepared statements
- lastInsertId, rowCount and transactions
- Displaying results safely in HTML, pagination and search
- Common errors
:::

## MySQL, MariaDB and phpMyAdmin

- **MySQL** is the popular open-source database; **MariaDB** is a compatible fork used by many hosts. PHP code is the same for both.
- **phpMyAdmin** (in XAMPP and cPanel) is a web interface to create databases and tables, run SQL and import/export backups.

## Step 1: Create the database and a user

In phpMyAdmin's SQL tab (or the MySQL command line):

```sql
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shop_app'@'localhost' IDENTIFIED BY 'a-long-random-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'shop_app'@'localhost';

USE shop;
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO products (name, category, price, stock) VALUES
 ('Laptop bag', 'Accessories', 2500, 12),
 ('USB flash 32GB', 'Storage', 900, 40),
 ('Wireless mouse', 'Accessories', 1200, 25),
 ('Bluetooth speaker', 'Electronics', 3500, 6);
```

- **utf8mb4** stores every character, including emojis and all languages.
- **A dedicated user** with only the permissions the app needs: if the site is hacked, the damage is limited. Never connect your app as `root`.
- On cPanel, create databases and users in **MySQL Databases**; names get a prefix like `cpaneluser_shop`.

## Step 2: Keep credentials out of your code

Create `config.php` **outside the public web folder** (e.g. above `public_html`):

```php
<?php
// /home/youraccount/config/shop.php  (NOT inside public_html, never committed to Git)
return [
    'dsn'  => 'mysql:host=localhost;dbname=shop;charset=utf8mb4',
    'user' => 'shop_app',
    'pass' => 'a-long-random-password',
];
```

## Step 3: Connect with PDO

```php
<?php
// db.php
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $cfg = require __DIR__ . '/../config/shop.php';
        $pdo = new PDO($cfg['dsn'], $cfg['user'], $cfg['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // throw errors instead of failing silently
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,      // rows as ['name' => ...] arrays
            PDO::ATTR_EMULATE_PREPARES   => false,                 // real prepared statements
        ]);
    }
    return $pdo;
}
```

Include it where needed: `require __DIR__ . '/db.php';` then call `db()`.

## SQL injection: the attack prepared statements stop

Never put user input directly into SQL:

```php
// DANGEROUS – never do this
$sql = "SELECT * FROM products WHERE category = '" . $_GET['cat'] . "'";
```

A visitor can send `?cat=' OR '1'='1` to dump every row, or worse inputs to read other tables (customers, admin password hashes) or delete data.

**Prepared statements** send the SQL and the values separately, so input is always treated as data, never as SQL code:

```php
$stmt = db()->prepare('SELECT * FROM products WHERE category = ?');
$stmt->execute([$_GET['cat'] ?? '']);
```

Named placeholders are clearer with many values:

```php
$stmt = db()->prepare('SELECT * FROM products WHERE category = :cat AND price <= :max');
$stmt->execute(['cat' => $cat, 'max' => $max]);
```

:::warning Placeholders are for values only
Table names, column names and `ORDER BY` directions can't be placeholders. If users choose a sort column, check it against an allow-list: `$sort = in_array($_GET['sort'] ?? '', ['name', 'price'], true) ? $_GET['sort'] : 'name';`.
:::

## Fetching data

```php
<?php
// Many rows
$stmt = db()->prepare('SELECT id, name, price FROM products WHERE category = ? ORDER BY price');
$stmt->execute(['Accessories']);
$rows = $stmt->fetchAll();           // array of rows
foreach ($rows as $p) {
    echo $p['name'] . ' – KSh ' . number_format($p['price']) . "\n";
}

// One row
$stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
$product = $stmt->fetch();           // array, or false if not found
if (!$product) {
    http_response_code(404);
    exit('Product not found');
}

// One value
$count = db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
```

`query()` without placeholders is fine only for fixed SQL with no user input.

## Displaying results safely

```php
<table>
  <tr><th>Product</th><th>Price</th></tr>
  <?php foreach ($rows as $p): ?>
    <tr>
      <td><?= htmlspecialchars($p['name']) ?></td>
      <td>KSh <?= number_format($p['price']) ?></td>
    </tr>
  <?php endforeach; ?>
</table>
```

Data from the database may originally have come from users, so **escape it** when printing (XSS protection).

## Inserting, updating, deleting

```php
<?php
// INSERT
$stmt = db()->prepare('INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)');
$stmt->execute([$name, $category, $price, $stock]);
$newId = db()->lastInsertId();

// UPDATE
$stmt = db()->prepare('UPDATE products SET price = ?, stock = ? WHERE id = ?');
$stmt->execute([$price, $stock, $id]);
echo $stmt->rowCount() . " row(s) updated";

// DELETE
$stmt = db()->prepare('DELETE FROM products WHERE id = ?');
$stmt->execute([$id]);
```

Validate input before these (see the forms lesson), and protect admin actions with a login and CSRF tokens.

## Search and pagination

```php
<?php
$q = trim($_GET['q'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = 20;
$offset = ($page - 1) * $perPage;

$stmt = db()->prepare('SELECT id, name, price FROM products
                       WHERE name LIKE :q ORDER BY name LIMIT :lim OFFSET :off');
$stmt->bindValue(':q', '%' . $q . '%');
$stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':off', $offset, PDO::PARAM_INT);
$stmt->execute();
$results = $stmt->fetchAll();
```

`bindValue(..., PDO::PARAM_INT)` is needed for LIMIT/OFFSET values.

## Transactions

When several changes must succeed or fail together (an order and its stock reduction, a payment and its receipt):

```php
<?php
$pdo = db();
try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
    $stmt->execute([$qty, $productId, $qty]);
    if ($stmt->rowCount() === 0) {
        throw new RuntimeException('Not enough stock');
    }

    $stmt = $pdo->prepare('INSERT INTO orders (product_id, qty, customer_phone) VALUES (?, ?, ?)');
    $stmt->execute([$productId, $qty, $phone]);

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    error_log($e->getMessage());
    echo 'Sorry, we could not place your order.';
}
```

The `AND stock >= ?` condition makes the stock check and update happen in one step, so two customers can't buy the last item at the same time.

## Practise the PDO API with SQLite

The Run button can't reach a MySQL server, but PHP's built-in **SQLite** driver uses exactly the same PDO methods. Try it on your own computer with `php file.php` (SQLite support is included in most PHP installs):

```php
<?php
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)');
$ins = $pdo->prepare('INSERT INTO products (name, price) VALUES (?, ?)');
foreach ([['Laptop bag', 2500], ['USB flash', 900], ['Mouse', 1200]] as $p) {
    $ins->execute($p);
}
$stmt = $pdo->prepare('SELECT name, price FROM products WHERE price < ? ORDER BY price');
$stmt->execute([2000]);
foreach ($stmt as $row) {
    echo $row['name'] . ': KSh ' . number_format($row['price']) . "\n";
}
```

Only the DSN changes when you switch to MySQL.

## Common errors

| Error | Cause |
|---|---|
| `SQLSTATE[HY000] [1045] Access denied for user` | Wrong username/password, or the user lacks access to that database |
| `SQLSTATE[HY000] [2002] Connection refused / No such file` | MySQL not running, or wrong host (try `127.0.0.1` vs `localhost`) |
| `SQLSTATE[42S02] Base table or view not found` | Table name typo or wrong database |
| `SQLSTATE[42S22] Unknown column` | Column name typo |
| `SQLSTATE[23000] Integrity constraint violation: Duplicate entry` | Inserting a duplicate value in a UNIQUE column |
| `Invalid parameter number` | Number of placeholders doesn't match the values given |

On a live site, log errors (`error_log`) and show users a friendly message; never display raw database errors (they leak table names and paths).

:::think A product page uses `$id = $_GET['id']; $row = $pdo->query("SELECT * FROM products WHERE id = $id")->fetch();`. Name two problems and rewrite it safely.
It's vulnerable to SQL injection (e.g. `id=1 OR 1=1`), and it doesn't handle a missing product. Safe version: `$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?'); $stmt->execute([(int)($_GET['id'] ?? 0)]); $row = $stmt->fetch(); if (!$row) { http_response_code(404); exit('Not found'); }`.
:::

## Summary

- Create a utf8mb4 database and a least-privilege user; keep credentials in a config file outside the web root.
- Connect with PDO using ERRMODE_EXCEPTION, FETCH_ASSOC and real prepared statements.
- Always use prepared statements (`?` or `:name`) for values; allow-list column names.
- fetchAll, fetch and fetchColumn read data; execute with values to insert, update, delete; lastInsertId and rowCount report results.
- Escape output with htmlspecialchars, use transactions for multi-step changes, and log errors instead of displaying them.

```quiz
Q: What does PDO stand for?
A: PHP Data Objects
Q: What stops SQL injection in PDO? (two words)
A: prepared statements | prepared statement
Q: Which fetch method returns all rows?
A: fetchAll | fetchAll()
Q: Which method returns the ID of the row just inserted?
A: lastInsertId | lastInsertId()
Q: Which character set should a modern MySQL database use?
A: utf8mb4
Q: Can a table name be a placeholder in a prepared statement? (yes/no)
A: no
```

**Learn more:** [PHP: The Right Way – databases](https://phptherightway.com/#databases) · [PHP manual: PDO](https://www.php.net/manual/en/book.pdo.php)
