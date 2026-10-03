---
slug: functions-includes
title: Functions, includes and organising a PHP site
after: arrays-loops
---
# Functions, includes and organising a PHP site

As a site grows, copying the same header onto 10 pages, or the same price calculation into 5 files, becomes a nightmare. **Functions** and **includes** let you write things once.

## Writing functions

```try-php
<?php
function withVat(float $amount, float $rate = 16): float {
    return round($amount * (1 + $rate / 100), 2);
}

function formatKsh(float $amount): string {
    return "KSh " . number_format($amount, 2);
}

echo formatKsh(withVat(1000)), "\n";       // KSh 1,160.00
echo formatKsh(withVat(1000, 0)), "\n";    // KSh 1,000.00
echo formatKsh(withVat(amount: 2500)), "\n"; // named argument (PHP 8)
```

- Type hints (`float`, `string`) and return types (`: float`) catch mistakes early.
- Default values (`$rate = 16`) make arguments optional.
- **Named arguments** (PHP 8) make calls readable.

## Variable scope

Variables inside a function are **local**. Pass what the function needs as arguments:

```try-php
<?php
$shop = "Duka Bora";

function receiptTitle(string $shopName): string {
    // echo $shop;  // would be undefined here
    return strtoupper($shopName) . " - RECEIPT";
}
echo receiptTitle($shop), "\n";

// Arrow functions (PHP 7.4+) automatically see outer variables
$vatRate = 16;
$addVat = fn($x) => $x * (1 + $vatRate / 100);
echo $addVat(500), "\n";

// Functions as values: great with array functions
$prices = [180, 350, 60];
$withVat = array_map($addVat, $prices);
$cheap = array_filter($prices, fn($p) => $p < 200);
print_r($withVat);
print_r($cheap);
echo array_sum($prices), "\n";
```

## Useful built-in functions

| Area | Functions |
|---|---|
| Strings | `strlen`, `strtoupper`, `ucwords`, `trim`, `str_replace`, `str_contains`, `explode`, `implode`, `sprintf` |
| Numbers | `round`, `number_format`, `intdiv`, `max`, `min`, `random_int` |
| Arrays | `count`, `in_array`, `array_map`, `array_filter`, `array_sum`, `sort`, `usort`, `array_column` |
| Dates | `date('Y-m-d')`, `strtotime('+30 days')` |
| Safety | `htmlspecialchars`, `password_hash`, `password_verify`, `filter_var` |

```try-php
<?php
echo sprintf("%-10s %8s\n", "Item", "Price");
echo sprintf("%-10s %8s\n", "Sugar", number_format(160));
echo date("d/m/Y", strtotime("2026-09-01 +30 days")), "\n";
echo ucwords("amina hassan"), "\n";
var_dump(filter_var("amina@example.com", FILTER_VALIDATE_EMAIL) !== false);
```

## include and require: reuse whole files

Split a site into parts:

```
site/
├── includes/
│   ├── config.php      (settings, database connection)
│   ├── functions.php   (your helper functions)
│   ├── header.php      (the top of every page: <head>, menu)
│   └── footer.php      (the bottom of every page)
├── index.php
├── about.php
└── contact.php
```

**includes/header.php**

```php
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= htmlspecialchars($pageTitle ?? 'Duka Bora') ?></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<nav><a href="/">Home</a> <a href="/about.php">About</a> <a href="/contact.php">Contact</a></nav>
```

**about.php**

```php
<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'About us | Duka Bora';
require __DIR__ . '/includes/header.php';
?>
<main>
  <h1>About Duka Bora</h1>
  <p>Serving Thika since 2015.</p>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
```

| Statement | If the file is missing | Loads twice? |
|---|---|---|
| `include` | Warning, page continues | Yes |
| `require` | Fatal error, page stops | Yes |
| `include_once` / `require_once` | as above | No, only once |

Use `require_once` for config and functions (they must exist and must load once), and `require` for templates like the header.

> `__DIR__` is the folder of the current file. Using it makes paths work no matter which page includes the file.

## Keep secrets out of the web folder

Put database passwords and API keys in a config file **outside** `public_html` (or protect it), and never commit it to Git:

```php
$config = require dirname(__DIR__) . '/private/config.php';
```

## Why functions and includes matter in PHP

Most websites in Kenya run on PHP: WordPress sites, custom school and SACCO portals, booking systems and M-Pesa integrations on cPanel hosting. Real PHP projects are split into many files and functions: one file for the database connection, one for helper functions, a header and footer shared by every page, and separate files for each feature. Organising code this way makes it easier to fix bugs, add features and keep secrets safe.

## Type declarations and strict types

```try-php
<?php
declare(strict_types=1);

function vat(float $amount, float $rate = 0.16): float {
    return round($amount * $rate, 2);
}

function formatKsh(float $amount): string {
    return 'KSh ' . number_format($amount, 2);
}

function findStudent(array $students, string $adm): ?array {   // ?array: array or null
    foreach ($students as $s) {
        if ($s['adm'] === $adm) return $s;
    }
    return null;
}

echo formatKsh(vat(2500)) . "\n";
$students = [['adm' => 'ADM001', 'name' => 'Baraka'], ['adm' => 'ADM002', 'name' => 'Neema']];
$s = findStudent($students, 'ADM002');
echo $s ? $s['name'] : 'Not found', "\n";
echo findStudent($students, 'ADM999')['name'] ?? 'Not found', "\n";

try {
    echo vat("2500");          // a string is rejected in strict mode
} catch (TypeError $e) {
    echo "TypeError: wrong argument type\n";
}
```

`declare(strict_types=1);` at the top of a file stops PHP from silently converting types (like the string `"2500"` into a number), catching bugs early.

## Named arguments and nullsafe operator

```try-php
<?php
function createInvoice(string $customer, float $amount, float $vatRate = 0.16, string $currency = 'KSh', bool $paid = false): string {
    $total = $amount * (1 + $vatRate);
    return sprintf("%s: %s %s (%s)", $customer, $currency, number_format($total, 2), $paid ? 'paid' : 'unpaid');
}

echo createInvoice('Kamau Hardware', 10000), "\n";
echo createInvoice(customer: 'School', amount: 5000, paid: true, vatRate: 0), "\n";

$order = ['customer' => ['address' => null]];
echo $order['customer']['address']['town'] ?? 'No town given', "\n";
```

Named arguments make calls with many optional parameters readable and order-independent.

## Closures and array functions

```try-php
<?php
$products = [
    ['name' => 'Unga 2kg', 'price' => 180, 'stock' => 12],
    ['name' => 'Sugar 1kg', 'price' => 210, 'stock' => 0],
    ['name' => 'Cooking oil 1L', 'price' => 350, 'stock' => 7],
];

$inStock = array_filter($products, fn($p) => $p['stock'] > 0);
$names = array_map(fn($p) => strtoupper($p['name']), $inStock);
$stockValue = array_reduce($products, fn($sum, $p) => $sum + $p['price'] * $p['stock'], 0);
usort($products, fn($a, $b) => $b['price'] <=> $a['price']);    // most expensive first

print_r(array_values($names));
echo "Stock value: KSh ", number_format($stockValue), "\n";
echo "Most expensive: ", $products[0]['name'], "\n";

$discount = 10;
$applyDiscount = function (float $price) use ($discount): float {   // use: capture a variable
    return $price * (1 - $discount / 100);
};
echo $applyDiscount(1000), "\n";
```

| Function | Purpose |
|---|---|
| `array_map` | Transform every item |
| `array_filter` | Keep matching items (keys are preserved; use `array_values` to reindex) |
| `array_reduce` | Combine into one value |
| `usort` | Sort with your own comparison (`<=>` is the "spaceship" operator) |
| `array_column` | Pull one column from a list of rows |
| `in_array`, `array_search` | Find values |

## A helpers file used by every page

```php
<?php
// includes/helpers.php
declare(strict_types=1);

function e(?string $value): string {               // escape output to prevent XSS
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function redirect(string $path): never {
    header('Location: ' . $path);
    exit;
}

function old(string $field): string {               // refill forms after validation errors
    return e($_POST[$field] ?? '');
}

function flash(string $message): void {
    $_SESSION['flash'] = $message;
}
```

```php
<?php
// contact.php
session_start();
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/db.php';          // database connection
include __DIR__ . '/partials/header.php';
?>
<h1>Contact us</h1>
<input name="name" value="<?= old('name') ?>">
<?php include __DIR__ . '/partials/footer.php'; ?>
```

Every page escapes output with `e()` and shares the same header and footer, so a design change happens in one place.

## Organising a small PHP project

```text
/home/username/
├── config/
│   └── config.php          ← database password, API keys (outside public_html)
└── public_html/
    ├── index.php
    ├── contact.php
    ├── includes/
    │   ├── helpers.php
    │   └── db.php           ← requires ../config/config.php
    ├── partials/
    │   ├── header.php
    │   └── footer.php
    └── assets/ (css, js, images)
```

Keeping configuration with passwords **outside** `public_html` means it can never be downloaded through a browser, even if the server is misconfigured.

## Common mistakes

| Mistake | Fix |
|---|---|
| `include 'header.php'` with relative paths breaking in subfolders | Use `__DIR__ . '/partials/header.php'` |
| Echoing user input directly | Escape with `htmlspecialchars` (an `e()` helper) |
| Global variables everywhere | Pass values as function parameters |
| Database password in a file inside `public_html` | Move config outside the web root |
| Using `==` for comparisons | Use `===` to compare value and type |

## Practice

1. Write `formatPhone(string $phone): ?string` that returns 2547XXXXXXXX or null.
2. Use `array_filter` and `array_map` to list the names of products under KSh 300.
3. Create a header and footer partial and include them in three pages.
4. Write an `e()` helper and use it to display a comment containing `<script>`.
5. Rewrite a function call with five parameters using named arguments.

:::think Why use `require_once __DIR__ . '/includes/db.php'` instead of `include 'includes/db.php'`?
`require_once` stops with a clear error if the database file is missing (the page can't work without it) and prevents loading it twice. `__DIR__` builds an absolute path from the current file's folder, so the include works no matter which page or subfolder runs it.
:::

```quiz
Q: Which statement stops the page with a fatal error if the file is missing?
A: require | require_once
Q: Which version loads a file only once even if called twice?
A: require_once | include_once
Q: Which constant gives the folder of the current PHP file?
A: __DIR__
Q: Which function formats 1500 as 1,500.00 when given 2 decimals?
A: number_format | number_format()
Q: What does fn($x) => $x * 2 create? (two words)
A: arrow function | an arrow function
Q: Which declaration stops PHP from silently converting argument types?
A: strict_types | declare(strict_types=1)
Q: What is the <=> operator called?
A: spaceship | spaceship operator
Q: Which keyword makes a closure capture an outside variable?
A: use
Q: Which function escapes text for safe HTML output?
A: htmlspecialchars
```
