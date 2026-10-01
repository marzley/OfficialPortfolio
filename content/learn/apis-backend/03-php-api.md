---
slug: php-json-api
title: Building a JSON API in PHP and MySQL
after: designing-rest-apis
---
# Building a JSON API in PHP and MySQL

PHP runs on almost every cPanel hosting plan in Kenya, which makes it the cheapest way to host an API for your app. You'll build a small, secure products API with **plain PHP and PDO** (the same ideas apply in Laravel).

> Learn PHP basics first in the **PHP & MySQL** subject. The `try-php` examples below run in your browser.

## JSON in PHP

```try-php
<?php
$products = [
    ['id' => 1, 'name' => 'Unga 2kg', 'price' => 180, 'stock' => 12],
    ['id' => 2, 'name' => 'Sugar 1kg', 'price' => 150, 'stock' => 0],
];

// PHP array -> JSON text (what the API sends)
echo json_encode(['data' => $products], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), "\n";

// JSON text -> PHP array (what the API receives)
$body = '{"name": "Milk 500ml", "price": 60}';
$input = json_decode($body, true);          // true = associative array
echo "New product: {$input['name']} at KSh {$input['price']}\n";

var_dump(json_decode('{bad json', true));    // NULL when the JSON is invalid: always check
echo json_last_error_msg(), "\n";
```

## Project layout

```
public_html/
└── api/
    ├── index.php          ← every request comes here (front controller)
    └── .htaccess          ← sends /api/products/17 to index.php
private/                   ← OUTSIDE public_html
    └── config.php         ← database password and secrets
```

`.htaccess` (Apache):

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [QSA,L]
```

## Helpers: responding and reading input

```php
<?php
function respond(int $status, array $payload): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $message, array $fields = []): never {
    respond($status, ['error' => array_filter(['message' => $message, 'fields' => $fields])]);
}

function body(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) fail(400, 'Send a JSON body.');
    return $data;
}
```

## The database connection (PDO)

```php
<?php
$config = require __DIR__ . '/../../private/config.php';   // ['db_dsn' => ..., 'db_user' => ..., 'db_pass' => ...]

$pdo = new PDO($config['db_dsn'], $config['db_user'], $config['db_pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,          // errors become exceptions
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,                  // real prepared statements
]);
```

**Never** put the password in a file inside `public_html`, and never commit it to Git.

## Routing and endpoints

```php
<?php
// index.php (after the helpers and $pdo above)
$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');     // e.g. "api/products/17"
$parts = explode('/', preg_replace('#^api/?#', '', $path));             // ["products", "17"]
$resource = $parts[0] ?? '';
$id = isset($parts[1]) ? (int)$parts[1] : null;

try {
    if ($resource === 'products' && $method === 'GET' && $id === null) {
        $q = '%' . trim($_GET['q'] ?? '') . '%';
        $page = max(1, (int)($_GET['page'] ?? 1));
        $per = 20;
        $stmt = $pdo->prepare('SELECT id, name, price, stock FROM products WHERE name LIKE ? ORDER BY name LIMIT ? OFFSET ?');
        $stmt->bindValue(1, $q);
        $stmt->bindValue(2, $per, PDO::PARAM_INT);
        $stmt->bindValue(3, ($page - 1) * $per, PDO::PARAM_INT);
        $stmt->execute();
        respond(200, ['data' => $stmt->fetchAll(), 'meta' => ['page' => $page]]);
    }

    if ($resource === 'products' && $method === 'GET' && $id) {
        $stmt = $pdo->prepare('SELECT id, name, price, stock FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch() ?: fail(404, 'Product not found.');
        respond(200, ['data' => $product]);
    }

    if ($resource === 'products' && $method === 'POST') {
        $user = require_user($pdo);                         // see the auth lesson
        if ($user['role'] !== 'owner') fail(403, 'Only owners can add products.');
        $in = body();
        $name = trim((string)($in['name'] ?? ''));
        $price = filter_var($in['price'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        $errors = [];
        if (mb_strlen($name) < 2 || mb_strlen($name) > 80) $errors['name'] = 'Name must be 2 to 80 characters';
        if ($price === false) $errors['price'] = 'Price must be a whole number above 0';
        if ($errors) fail(422, 'Please check the highlighted fields.', $errors);

        $stmt = $pdo->prepare('INSERT INTO products (shop_id, name, price, stock) VALUES (?, ?, ?, 0)');
        $stmt->execute([$user['shop_id'], $name, $price]);
        respond(201, ['data' => ['id' => (int)$pdo->lastInsertId(), 'name' => $name, 'price' => $price, 'stock' => 0]]);
    }

    fail(404, 'Not found.');
} catch (Throwable $e) {
    error_log('API error: ' . $e->getMessage());           // details in the server log
    fail(500, 'Something went wrong. Please try again.');   // nothing technical for users
}
```

## Prepared statements: why they matter

```try-php
<?php
// Never build SQL by pasting user input into the query:
$name = "x' OR '1'='1";
$unsafe = "SELECT * FROM users WHERE name = '$name'";
echo "Dangerous query: $unsafe\n";          // the WHERE clause is now always true: SQL injection!

// With PDO prepared statements, input is sent separately and can never change the query:
echo "Safe query: SELECT * FROM users WHERE name = ?  (value sent separately)\n";
```

Every `?` in a prepared statement is filled with data safely. This single habit prevents one of the most common and damaging attacks.

## CORS: letting your website call the API

Browsers block a website on one domain from calling an API on another unless the API allows it. Allow only your own front-end:

```php
<?php
$allowed = ['https://duka.co.ke', 'https://app.duka.co.ke'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;     // the browser's preflight check
```

Mobile apps aren't affected by CORS (it's a browser rule).

## Testing your API

- **Postman** or **Insomnia**: send requests and see responses.
- **curl** in the terminal: `curl -s https://yoursite.co.ke/api/products?q=unga`
- Write down a test checklist: valid input, invalid input, missing token, wrong shop's data, huge page numbers.

```quiz
Q: Which PHP function turns an array into JSON?
A: json_encode
Q: What second argument makes json_decode return an associative array?
A: true
Q: Which PHP database extension supports prepared statements across databases?
A: PDO
Q: What attack do prepared statements prevent?
A: SQL injection | sql injection
Q: Which public web folder must the database password file never be inside?
A: public_html
Q: Which browser rule controls whether a website can call an API on another domain?
A: CORS
```
