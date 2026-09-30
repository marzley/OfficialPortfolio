---
slug: json-api
title: Build a JSON API with PHP
after: file-uploads
---
# Build a JSON API with PHP

A modern site's pages often talk to the server with `fetch()` instead of reloading. Mobile apps (Flutter, Android) do the same. They all need an **API**: a PHP script that receives requests and answers with **JSON**. You've also seen one side of this already: M-Pesa's Daraja is an API.

## JSON in PHP

```try-php
<?php
$order = ['id' => 1042, 'items' => ['Unga', 'Oil'], 'total' => 530.0, 'paid' => false, 'note' => null];
echo json_encode($order), "\n";
echo json_encode($order, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), "\n";

$text = '{"phone":"254712345678","amount":1500}';
$data = json_decode($text, true);          // true = give me arrays, not objects
echo $data['phone'], " pays ", $data['amount'], "\n";

$bad = json_decode('{"amount": }', true);
var_dump($bad, json_last_error_msg());
```

## A small products API (api.php)

```php
<?php
declare(strict_types=1);
require __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

try {
    if ($method === 'GET' && $id === null) {                 // list
        $rows = $pdo->query('SELECT id, name, price, stock FROM products ORDER BY name')->fetchAll();
        respond(200, ['data' => $rows]);
    }
    if ($method === 'GET') {                                  // one item
        $stmt = $pdo->prepare('SELECT id, name, price, stock FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch() ?: respond(404, ['error' => 'Product not found']);
        respond(200, ['data' => $row]);
    }
    if ($method === 'POST') {                                 // create
        $in = json_decode(file_get_contents('php://input'), true) ?? [];
        $name = trim((string)($in['name'] ?? ''));
        $price = $in['price'] ?? null;
        if ($name === '' || !is_numeric($price) || $price < 0) {
            respond(422, ['error' => 'name and a positive price are required']);
        }
        $stmt = $pdo->prepare('INSERT INTO products (name, price) VALUES (?, ?)');
        $stmt->execute([$name, $price]);
        respond(201, ['data' => ['id' => (int)$pdo->lastInsertId(), 'name' => $name, 'price' => (float)$price]]);
    }
    respond(405, ['error' => 'Method not allowed']);
} catch (Throwable $e) {
    error_log($e->getMessage());                             // log details privately
    respond(500, ['error' => 'Server error']);               // never show the real error to users
}
```

## HTTP status codes to use

| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful read/update |
| 201 | Created | A new record was made |
| 400 | Bad request | Malformed JSON |
| 401 | Unauthorised | Not logged in / no token |
| 403 | Forbidden | Logged in but not allowed |
| 404 | Not found | No such record |
| 422 | Unprocessable | Validation failed |
| 429 | Too many requests | Rate limited |
| 500 | Server error | Something broke on our side |

## Calling the API from JavaScript

```javascript
// list
const res = await fetch("/api.php");
const { data } = await res.json();

// create
const r = await fetch("/api.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Sugar 1kg", price: 160 }),
});
if (!r.ok) {
  const err = await r.json();
  alert(err.error);
}
```

## Calling other APIs from PHP (cURL)

```php
$ch = curl_init('https://api.example.com/rates');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Accept: application/json', 'Authorization: Bearer ' . $token],
]);
$body = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$data = $status === 200 ? json_decode($body, true) : null;
```

This is exactly the pattern for M-Pesa Daraja: get an access token, then `POST` JSON to the STK Push endpoint.

## Securing an API

- **Authentication**: sessions for your own website; API keys or tokens (`Authorization: Bearer ...`) for apps.
- **Validate every input** and return clear `422` errors.
- **Rate limit** login and payment endpoints.
- Allow other websites (CORS) only if you really need to, and only specific origins.
- Always use **HTTPS**.
- Never return passwords, full card data or internal error messages.

```quiz
Q: Which PHP function turns an array into JSON?
A: json_encode | json_encode()
Q: What second argument makes json_decode return arrays?
A: true
Q: Which status code means a new record was created?
A: 201
Q: Which status code is best for failed validation?
A: 422
Q: Which PHP stream reads the raw JSON body of a POST request?
A: php://input
```
