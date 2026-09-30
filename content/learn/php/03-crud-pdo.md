---
slug: crud-app
title: Build a CRUD app with PHP and MySQL (create, read, update, delete)
after: mysql-pdo
---
# Build a CRUD app with PHP and MySQL

Almost every business system is **CRUD** underneath: **C**reate, **R**ead, **U**pdate, **D**elete records. A customer list, a stock list, a student register: same pattern. Let's build a complete, secure one for products.

## The database table

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## db.php: one connection for every page

```php
<?php
// Keep the real password in a config file outside public_html
$pdo = new PDO(
    'mysql:host=localhost;dbname=shop;charset=utf8mb4',
    'shop_user',
    'your-strong-password',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

function e(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
```

## Read: list products (index.php)

```php
<?php
require __DIR__ . '/db.php';
$search = trim($_GET['q'] ?? '');
$stmt = $pdo->prepare('SELECT * FROM products WHERE name LIKE ? ORDER BY name');
$stmt->execute(['%' . $search . '%']);
$products = $stmt->fetchAll();
?>
<form><input name="q" value="<?= e($search) ?>" placeholder="Search"> <button>Search</button></form>
<a href="edit.php">+ Add product</a>
<table>
  <tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr>
  <?php foreach ($products as $p): ?>
  <tr>
    <td><?= e($p['name']) ?></td>
    <td>KSh <?= number_format($p['price'], 2) ?></td>
    <td><?= (int)$p['stock'] ?></td>
    <td>
      <a href="edit.php?id=<?= (int)$p['id'] ?>">Edit</a>
      <form method="post" action="delete.php" style="display:inline" onsubmit="return confirm('Delete this product?')">
        <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
        <button>Delete</button>
      </form>
    </td>
  </tr>
  <?php endforeach; ?>
</table>
```

## Create and Update: one form (edit.php)

```php
<?php
require __DIR__ . '/db.php';
$id = (int)($_GET['id'] ?? 0);
$product = ['name' => '', 'price' => '', 'stock' => 0];
$errors = [];

if ($id) {
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$id]);
    $product = $stmt->fetch() ?: exit('Product not found');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product = [
        'name'  => trim($_POST['name'] ?? ''),
        'price' => $_POST['price'] ?? '',
        'stock' => $_POST['stock'] ?? 0,
    ];
    // Validate on the server: never trust the browser
    if ($product['name'] === '' || mb_strlen($product['name']) > 120) $errors[] = 'Name is required (max 120 characters).';
    if (!is_numeric($product['price']) || $product['price'] < 0) $errors[] = 'Price must be a positive number.';
    if (filter_var($product['stock'], FILTER_VALIDATE_INT) === false) $errors[] = 'Stock must be a whole number.';

    if (!$errors) {
        if ($id) {
            $stmt = $pdo->prepare('UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?');
            $stmt->execute([$product['name'], $product['price'], $product['stock'], $id]);
        } else {
            $stmt = $pdo->prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)');
            $stmt->execute([$product['name'], $product['price'], $product['stock']]);
        }
        header('Location: index.php');   // Post/Redirect/Get: refreshing won't resubmit
        exit;
    }
}
?>
<h1><?= $id ? 'Edit' : 'Add' ?> product</h1>
<?php foreach ($errors as $err): ?><p style="color:red"><?= e($err) ?></p><?php endforeach; ?>
<form method="post">
  <label>Name <input name="name" value="<?= e($product['name']) ?>" required maxlength="120"></label>
  <label>Price <input name="price" type="number" step="0.01" min="0" value="<?= e((string)$product['price']) ?>" required></label>
  <label>Stock <input name="stock" type="number" value="<?= (int)$product['stock'] ?>"></label>
  <button>Save</button>
</form>
```

## Delete (delete.php)

```php
<?php
require __DIR__ . '/db.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
$stmt->execute([(int)($_POST['id'] ?? 0)]);
header('Location: index.php');
```

## The security checklist (why each line is there)

| Risk | Protection in this code |
|---|---|
| **SQL injection** | Prepared statements with `?` placeholders, never string-joined SQL |
| **XSS** (scripts in data) | Every output goes through `e()` = `htmlspecialchars` |
| Bad data | Server-side validation even though the form has `required` |
| Deleting by visiting a link | Delete only accepts **POST** |
| Double submit on refresh | Redirect after saving (Post/Redirect/Get) |
| **CSRF** (another site submitting your forms) | Add a CSRF token for real apps (below) |
| Anyone editing | Put these pages behind a login (Sessions lesson) |

### Adding a CSRF token

```php
session_start();
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
// in every form:
echo '<input type="hidden" name="csrf" value="' . $_SESSION['csrf'] . '">';
// when handling POST:
if (!hash_equals($_SESSION['csrf'], $_POST['csrf'] ?? '')) { http_response_code(403); exit('Invalid request'); }
```

## Pagination for big tables

```php
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = 20;
$stmt = $pdo->prepare('SELECT * FROM products ORDER BY name LIMIT ? OFFSET ?');
$stmt->bindValue(1, $perPage, PDO::PARAM_INT);
$stmt->bindValue(2, ($page - 1) * $perPage, PDO::PARAM_INT);
$stmt->execute();
```

```quiz
Q: What does the C in CRUD stand for?
A: Create
Q: Which PDO feature stops SQL injection? (two words)
A: prepared statements | prepared statement | prepare
Q: Which function escapes output to stop XSS?
A: htmlspecialchars | htmlspecialchars()
Q: Which HTTP method should a delete action accept?
A: POST
Q: After saving a form, what should you do so refreshing doesn't resubmit? (one word)
A: redirect | header location
```
