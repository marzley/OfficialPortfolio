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

## Why APIs matter

APIs connect systems: a mobile app talks to a PHP back end, a website loads products without refreshing, an M-Pesa payment callback notifies your server, a school portal sends results to an SMS gateway. Building JSON APIs in PHP lets your existing hosting power mobile apps, JavaScript front ends and integrations with other businesses. API skills are in demand for back-end and full-stack roles.

## A consistent JSON response helper

```try-php
<?php
function jsonResponse(mixed $data, int $status = 200): string {
    // In a real endpoint: http_response_code($status); header('Content-Type: application/json');
    return json_encode([
        'success' => $status < 400,
        'status' => $status,
        'data' => $status < 400 ? $data : null,
        'error' => $status >= 400 ? $data : null,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

echo jsonResponse(['id' => 7, 'name' => 'Wanjirũ', 'site' => 'https://example.co.ke']), "\n";
echo jsonResponse(['phone' => 'Enter a valid phone number'], 422), "\n";
```

A predictable shape (`success`, `data`, `error`) makes life easier for the developers using your API. `JSON_UNESCAPED_UNICODE` keeps characters like `ũ` readable.

## Validating JSON input

```try-php
<?php
function validateOrder(array $in): array {
    $errors = [];
    if (!isset($in['product_id']) || !is_int($in['product_id']) || $in['product_id'] <= 0) {
        $errors['product_id'] = 'product_id must be a positive integer';
    }
    if (!isset($in['qty']) || !is_int($in['qty']) || $in['qty'] < 1 || $in['qty'] > 100) {
        $errors['qty'] = 'qty must be between 1 and 100';
    }
    $phone = preg_replace('/\D/', '', (string) ($in['phone'] ?? ''));
    if (!preg_match('/^(?:254|0)[17]\d{8}$/', $phone)) {
        $errors['phone'] = 'phone must be a valid Kenyan mobile number';
    }
    return $errors;
}

$bodies = [
    '{"product_id": 3, "qty": 2, "phone": "0712 345 678"}',
    '{"product_id": "3", "qty": 0}',
    '{bad json',
];
foreach ($bodies as $raw) {
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        echo "400: invalid JSON (", json_last_error_msg(), ")\n";
        continue;
    }
    $errors = validateOrder($data);
    echo $errors ? "422: " . json_encode($errors) : "201: order accepted", "\n";
}
```

In a live endpoint, `$raw = file_get_contents('php://input');` reads the request body. Never trust input types: `"3"` (a string) isn't the same as `3`.

## Routing several endpoints in one file

```php
<?php
// api/index.php (with .htaccess sending /api/* here)
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');   // e.g. "api/products/3"
$parts = explode('/', $path);

match (true) {
    $method === 'GET' && $parts[1] === 'products' && !isset($parts[2]) => listProducts($pdo),
    $method === 'GET' && $parts[1] === 'products' && isset($parts[2]) => showProduct($pdo, (int) $parts[2]),
    $method === 'POST' && $parts[1] === 'orders' => createOrder($pdo),
    default => notFound(),
};
```

```apache
# api/.htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [QSA,L]
```

Frameworks like Laravel and Slim provide routing, validation and middleware out of the box when projects grow.

## Pagination and filtering

```php
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = min(50, max(1, (int) ($_GET['per_page'] ?? 20)));
$offset = ($page - 1) * $perPage;
$search = '%' . ($_GET['q'] ?? '') . '%';

$stmt = $pdo->prepare('SELECT id, name, price FROM products WHERE name LIKE ? ORDER BY name LIMIT ? OFFSET ?');
$stmt->bindValue(1, $search);
$stmt->bindValue(2, $perPage, PDO::PARAM_INT);
$stmt->bindValue(3, $offset, PDO::PARAM_INT);
$stmt->execute();
echo json_encode(['page' => $page, 'per_page' => $perPage, 'items' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
```

Always cap `per_page` so nobody can request a million rows at once.

## Authentication with API tokens

```php
function requireToken(PDO $pdo): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(\S+)$/', $header, $m)) {
        http_response_code(401);
        exit(json_encode(['error' => 'Missing token']));
    }
    $hash = hash('sha256', $m[1]);                       // store only hashes of tokens
    $stmt = $pdo->prepare('SELECT id, name FROM api_clients WHERE token_hash = ? AND active = 1');
    $stmt->execute([$hash]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$client) {
        http_response_code(401);
        exit(json_encode(['error' => 'Invalid token']));
    }
    return $client;
}
```

Tokens are like passwords: send them only over HTTPS, store only hashes, and let clients rotate them. (Some Apache setups need a rewrite rule to pass the Authorization header to PHP.)

## Handling payment callbacks (webhooks) safely

When a payment provider calls your callback URL:

1. Read the raw body and log it securely (without exposing secrets).
2. Validate the structure; find the matching pending order by its reference.
3. **Confirm** the payment (verify a signature if the provider offers one, or query the provider's status API).
4. Make processing **idempotent**: if the same callback arrives twice, don't mark the order paid twice or send two receipts (check a unique transaction ID).
5. Respond quickly with the status the provider expects; do slow work (emails, SMS) afterwards.
6. Keep consumer keys and secrets in configuration outside the web root, never in code repositories.

## CORS: allowing browser apps on other domains

```php
$allowed = ['https://app.example.co.ke'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
```

Allow only the origins you trust; `Access-Control-Allow-Origin: *` with credentials is unsafe.

## Testing your API

- **curl**: `curl -X POST https://example.co.ke/api/orders -H "Content-Type: application/json" -d '{"product_id":3,"qty":2,"phone":"0712345678"}'`
- **Postman / Insomnia / Bruno**: save collections of requests for each endpoint.
- Check status codes, response shape, error messages and behaviour with bad input.

## Practice

1. Write a `jsonResponse` helper and use it for success and validation-error responses.
2. Build `GET /api/products?page=2&q=unga` with pagination and search using PDO.
3. Add `POST /api/orders` with validation returning 422 for bad input and 201 for success.
4. Protect write endpoints with a Bearer token stored as a hash.
5. Make a callback handler idempotent by checking a unique transaction ID before updating an order.

:::think A payment provider retries a callback three times because your server took 30 seconds to respond. Customers receive three receipts and orders are marked paid three times. How do you fix it?
Make the handler idempotent: store the provider's unique transaction ID with a UNIQUE constraint and skip processing if it already exists. Respond quickly (within the provider's timeout) and move slow tasks like emails and SMS to a queue or background job, so the provider doesn't keep retrying.
:::

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
Q: Which status code should an API return for a missing or invalid token?
A: 401
Q: What property means repeating the same request has the same effect as doing it once?
A: idempotent | idempotency
Q: Which json_encode flag keeps characters like ũ readable instead of escaped?
A: JSON_UNESCAPED_UNICODE
Q: Which header prefix carries an API token, as in Authorization: ... token? (one word)
A: Bearer
```
