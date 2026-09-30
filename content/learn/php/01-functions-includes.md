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
```
