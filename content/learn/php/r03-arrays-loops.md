---
slug: arrays-loops
title: "Arrays, conditions and loops: lists, associative arrays, if/else, match, for, foreach, while and array functions"
after: KEEP
---
# Arrays, conditions and loops: lists, associative arrays, if/else, match, for, foreach, while and array functions

Real programs make **decisions** (is the payment complete? is the user an admin? is stock below 5?) and work with **lists** of things (products in a cart, students in a class, rows from a database). This unit covers PHP's **arrays**, **conditions** and **loops** in depth: the tools you'll use on every page that shows a list, calculates a total or reacts to user input.

:::note What you will learn
- Indexed arrays and associative arrays
- Nested (multidimensional) arrays, like database rows
- Adding, removing and checking items
- if, elseif, else and logical operators
- The ternary and null coalescing operators
- switch and match
- for, foreach, while and do-while loops; break and continue
- Essential array functions: count, sort, in_array, array_sum, array_map, array_filter, array_column
- A practical shopping cart example
:::

## Indexed arrays

A list where each item has a number (index) starting at **0**:

```try-php
<?php
$towns = ["Nairobi", "Mombasa", "Kisumu"];
echo $towns[0], "\n";              // Nairobi
echo count($towns), "\n";          // 3

$towns[] = "Nakuru";               // add to the end
array_unshift($towns, "Eldoret");  // add to the start
print_r($towns);

$last = array_pop($towns);         // remove from the end
echo "Removed: $last\n";
print_r($towns);
```

## Associative arrays

Use **named keys** instead of numbers: perfect for records like a product or a customer.

```try-php
<?php
$product = [
    "name" => "Bluetooth speaker",
    "category" => "Electronics",
    "price" => 3500,
    "in_stock" => true,
];

echo $product["name"] . " costs KSh " . number_format($product["price"]) . "\n";
$product["price"] = 3200;          // change
$product["colour"] = "Black";      // add a new key
unset($product["in_stock"]);       // remove a key
print_r($product);

var_dump(isset($product["colour"]));          // does the key exist (and isn't null)?
var_dump(array_key_exists("weight", $product));
```

## Nested arrays

A list of associative arrays looks exactly like rows from a database table:

```try-php
<?php
$products = [
    ["id" => 1, "name" => "Laptop bag", "category" => "Accessories", "price" => 2500],
    ["id" => 2, "name" => "USB flash 32GB", "category" => "Storage", "price" => 900],
    ["id" => 3, "name" => "Wireless mouse", "category" => "Accessories", "price" => 1200],
    ["id" => 4, "name" => "Phone charger", "category" => "Electronics", "price" => 800],
];

echo $products[2]["name"], "\n";   // Wireless mouse

foreach ($products as $p) {
    printf("%-3d %-16s %-12s KSh %6s\n", $p["id"], $p["name"], $p["category"], number_format($p["price"]));
}
```

## Conditions: if, elseif, else

```try-php
<?php
$stock = 3;

if ($stock === 0) {
    echo "Out of stock\n";
} elseif ($stock < 5) {
    echo "Only $stock left, order soon!\n";
} else {
    echo "In stock\n";
}
```

### Comparison and logical operators

| Operator | Meaning |
|---|---|
| `===` / `!==` | Equal / not equal (value and type) |
| `<`, `>`, `<=`, `>=` | Less/greater than (or equal) |
| `&&` (and) | Both true |
| `||` (or) | At least one true |
| `!` | Not |

```try-php
<?php
$age = 20;
$hasId = true;
$isAdmin = false;

if ($age >= 18 && $hasId) {
    echo "Can register\n";
}
if ($isAdmin || $age > 60) {
    echo "Gets special access\n";
} else {
    echo "Standard access\n";
}
if (!$isAdmin) {
    echo "Not an admin\n";
}
```

### Ternary and null coalescing

```try-php
<?php
$paid = true;
echo $paid ? "Paid\n" : "Pending\n";             // condition ? if true : if false

$input = [];                                     // e.g. $_GET from a URL
$page = $input["page"] ?? 1;                     // use 1 if "page" is missing or null
$town = $input["town"] ?? "Nairobi";
echo "Page $page, town $town\n";
```

`??` is used constantly with form and URL data to avoid "undefined index" warnings.

## switch and match

```try-php
<?php
$status = "shipped";

switch ($status) {
    case "pending":
        echo "Waiting for payment\n";
        break;
    case "paid":
    case "processing":
        echo "We're preparing your order\n";
        break;
    case "shipped":
        echo "On the way\n";
        break;
    default:
        echo "Unknown status\n";
}

// PHP 8 match: shorter, returns a value, uses strict comparison, no break needed
$label = match ($status) {
    "pending" => "Waiting for payment",
    "paid", "processing" => "Preparing your order",
    "shipped" => "On the way",
    "delivered" => "Delivered",
    default => "Unknown",
};
echo $label, "\n";
```

## Loops

### for: when you know how many times

```try-php
<?php
for ($i = 1; $i <= 5; $i++) {
    echo "Lesson $i\n";
}

// Multiplication table for 7
for ($i = 1; $i <= 10; $i++) {
    echo "7 x $i = " . (7 * $i) . "\n";
}
```

### foreach: for every item in an array (most used)

```try-php
<?php
$fees = ["Tuition" => 25000, "Lunch" => 6000, "Transport" => 8000, "Activity" => 1500];

$total = 0;
foreach ($fees as $item => $amount) {
    echo str_pad($item, 10) . " KSh " . number_format($amount) . "\n";
    $total += $amount;
}
echo str_pad("TOTAL", 10) . " KSh " . number_format($total) . "\n";
```

### while and do-while

```try-php
<?php
// Savings: how many months to reach KSh 50,000 saving 4,500 a month with 1% monthly interest?
$balance = 0;
$months = 0;
while ($balance < 50000) {
    $balance = $balance * 1.01 + 4500;
    $months++;
}
echo "Months needed: $months (balance KSh " . number_format($balance) . ")\n";

$tries = 0;
do {
    $tries++;               // runs at least once, then checks
} while ($tries < 3);
echo "Tries: $tries\n";
```

### break and continue

```try-php
<?php
$numbers = [4, 7, -1, 12, 0, 9];
foreach ($numbers as $n) {
    if ($n < 0) {
        continue;           // skip negatives
    }
    if ($n === 0) {
        break;              // stop at zero
    }
    echo $n, "\n";
}
```

## Essential array functions

```try-php
<?php
$prices = [2500, 900, 1200, 800, 3500];
echo "Count: ", count($prices), "\n";
echo "Total: ", array_sum($prices), "\n";
echo "Highest: ", max($prices), ", lowest: ", min($prices), "\n";
echo "Average: ", round(array_sum($prices) / count($prices)), "\n";

sort($prices);               // ascending (rsort for descending)
echo implode(", ", $prices), "\n";

var_dump(in_array(900, $prices));               // is a value present?
echo array_search(1200, $prices), "\n";         // its index

$withVat = array_map(fn($p) => round($p * 1.16), $prices);   // transform each
echo implode(", ", $withVat), "\n";

$cheap = array_filter($prices, fn($p) => $p < 1500);          // keep matching
echo implode(", ", $cheap), "\n";

print_r(array_slice($prices, 0, 2));            // first two
print_r(array_unique([1, 2, 2, 3, 3, 3]));
print_r(array_merge(["a", "b"], ["c"]));
```

Working with "rows":

```try-php
<?php
$products = [
    ["name" => "Laptop bag", "category" => "Accessories", "price" => 2500],
    ["name" => "USB flash", "category" => "Storage", "price" => 900],
    ["name" => "Mouse", "category" => "Accessories", "price" => 1200],
];

print_r(array_column($products, "name"));        // just the names

usort($products, fn($a, $b) => $a["price"] <=> $b["price"]);   // sort by price
echo $products[0]["name"], " is cheapest\n";

$accessories = array_filter($products, fn($p) => $p["category"] === "Accessories");
echo count($accessories), " accessories\n";

// Group totals by category
$byCategory = [];
foreach ($products as $p) {
    $byCategory[$p["category"]] = ($byCategory[$p["category"]] ?? 0) + $p["price"];
}
print_r($byCategory);
```

`<=>` (the "spaceship" operator) returns -1, 0 or 1, exactly what sorting functions need.

## A practical example: a shopping cart

```try-php
<?php
$catalogue = [
    101 => ["name" => "Laptop bag", "price" => 2500],
    102 => ["name" => "Wireless mouse", "price" => 1200],
    103 => ["name" => "Phone charger", "price" => 800],
];
$cart = [101 => 1, 103 => 3];     // product ID => quantity

$subtotal = 0;
foreach ($cart as $id => $qty) {
    if (!isset($catalogue[$id])) {
        continue;                 // ignore unknown products
    }
    $line = $catalogue[$id]["price"] * $qty;
    $subtotal += $line;
    printf("%-15s x%d  KSh %s\n", $catalogue[$id]["name"], $qty, number_format($line));
}
$delivery = $subtotal >= 5000 ? 0 : 250;
$total = $subtotal + $delivery;
echo "Subtotal: KSh " . number_format($subtotal) . "\n";
echo "Delivery: " . ($delivery === 0 ? "FREE" : "KSh $delivery") . "\n";
echo "Total:    KSh " . number_format($total) . "\n";
```

In a real shop, `$catalogue` comes from MySQL and `$cart` lives in the session (later lessons).

:::think You have an array of students with "name" and "mark" (0–100). How would you print each student's grade (A: 80+, B: 65–79, C: 50–64, D: below 50) and the class average?
Loop with `foreach`, use `match(true) { $s["mark"] >= 80 => "A", $s["mark"] >= 65 => "B", $s["mark"] >= 50 => "C", default => "D" }` (or if/elseif) for the grade, and compute the average with `array_sum(array_column($students, "mark")) / count($students)`.
:::

## Summary

- Indexed arrays use numbers from 0; associative arrays use named keys; nested arrays look like database rows.
- Add with `$arr[] =`, remove with `unset`/`array_pop`, check with `isset`, `in_array`, `array_key_exists`.
- Conditions: if/elseif/else, `&&`, `||`, `!`, ternary `?:`, null coalescing `??`, switch and PHP 8 `match`.
- Loops: for, foreach (most common), while, do-while, with break and continue.
- Array functions: count, array_sum, sort/usort, array_map, array_filter, array_column, implode/explode.

```quiz
Q: What index does the first item of an indexed array have?
A: 0 | zero
Q: Which loop is designed to go through every item of an array?
A: foreach
Q: Which operator returns a default when a key is missing or null?
A: ?? | null coalescing
Q: Which function counts items in an array?
A: count
Q: Which function keeps only items matching a condition?
A: array_filter
Q: Which PHP 8 expression is a stricter, shorter switch that returns a value?
A: match
```

**Learn more:** [PHP manual: arrays](https://www.php.net/manual/en/language.types.array.php) · [PHP manual: array functions](https://www.php.net/manual/en/ref.array.php)
