---
slug: variables-strings
title: "Variables, data types, strings and numbers: everything you need to store and format data in PHP"
after: KEEP
---
# Variables, data types, strings and numbers: everything you need to store and format data in PHP

Every program works with data: a customer's name, a product price, a phone number, whether an order is paid. **Variables** store that data, and PHP gives you many tools to work with text (strings) and numbers: joining, searching, formatting money, rounding, calculating VAT. This unit covers them all with runnable examples, including the formatting you'll use on real Kenyan business sites (KSh amounts, phone numbers, dates).

:::note What you will learn
- Creating variables and naming rules
- Data types: string, int, float, bool, null, array
- Checking and converting types
- Constants
- Strings: quotes, joining, interpolation, heredoc
- Useful string functions (length, case, search, replace, trim, split)
- Numbers: arithmetic, rounding, number_format, integer division and modulus
- Dates and times basics
- Common mistakes
:::

## Variables

```try-php
<?php
$name = "Wanjiku";
$age = 24;
$price = 1499.99;
$isMember = true;

echo "Name: $name\n";
echo "Age: $age\n";
echo "Price: $price\n";
echo "Member: " . ($isMember ? "yes" : "no") . "\n";

$age = $age + 1;        // variables can change
echo "Next year: $age\n";
```

Naming rules:
- Start with `$`, then a letter or underscore: `$total`, `$_temp` (not `$1total`).
- Letters, numbers and underscores only; no spaces or hyphens.
- Case-sensitive: `$Total` ≠ `$total`.
- Use clear names: `$orderTotal` (camelCase) or `$order_total` (snake_case); pick one style.

## Data types

| Type | Example | Notes |
|---|---|---|
| **string** | `"Nairobi"` | Text |
| **int** | `42`, `-7` | Whole numbers |
| **float** | `3.14`, `1499.99` | Decimals |
| **bool** | `true`, `false` | Yes/no |
| **null** | `null` | "No value" |
| **array** | `["Nairobi", "Mombasa"]` | A list or map (next lesson) |
| **object** | `new DateTime()` | From classes (OOP lesson) |

PHP decides the type from the value (dynamic typing). Check it:

```try-php
<?php
$values = ["Nairobi", 42, 3.14, true, null, [1, 2]];
foreach ($values as $v) {
    echo gettype($v), "\n";
}
var_dump(1499.99);            // shows type and value: very useful for debugging
var_dump("5" == 5);           // loose comparison: true
var_dump("5" === 5);          // strict comparison (type too): false
```

:::tip Use === for comparisons
`==` converts types before comparing, which can surprise you. `===` compares value **and** type. Prefer `===` and `!==`.
:::

## Converting types

```try-php
<?php
$qty = "3";                       // from a form, everything arrives as a string
$total = (int)$qty * 250;
echo $total, "\n";                // 750

echo (float)"12.5abc", "\n";      // 12.5
echo intval("0712"), "\n";        // 712: careful with phone numbers! Keep them as strings
echo (string)2026, "\n";
var_dump((bool)"0", (bool)"", (bool)"hello");   // false, false, true
var_dump(is_numeric("12.5"), is_numeric("12a"));
```

Phone numbers, ID numbers and M-Pesa codes are **strings**, not numbers: converting `0712345678` to an integer loses the leading zero.

## Constants

Values that never change:

```try-php
<?php
const VAT_RATE = 0.16;
define("SHOP_NAME", "Mama Mboga Online");

$price = 1000;
echo SHOP_NAME, ": VAT on KSh $price is KSh ", $price * VAT_RATE, "\n";
```

Constants have no `$` and are written in CAPITALS by convention.

## Strings

### Single vs double quotes

```try-php
<?php
$town = "Kisumu";
echo "I live in $town\n";       // double quotes: variables are replaced
echo 'I live in $town\n';       // single quotes: printed exactly (no \n either)
echo "\n";
echo "Total: {$town}-branch\n"; // braces separate the variable from following text
```

### Joining strings

```try-php
<?php
$first = "Otieno";
$last = "Odhiambo";
$full = $first . " " . $last;
$greeting = "Hello";
$greeting .= ", " . $full . "!";   // .= appends
echo $greeting, "\n";
```

### Heredoc for long text

```try-php
<?php
$name = "Achieng";
$amount = number_format(2500);
$message = <<<TEXT
Dear $name,
We have received your payment of KSh $amount.
Thank you for shopping with us.
TEXT;
echo $message, "\n";
```

## Useful string functions

```try-php
<?php
$s = "  Wireless Mouse - Black  ";
echo "[" . trim($s) . "]\n";                  // remove spaces at both ends
echo strlen(trim($s)), "\n";                  // length
echo strtoupper("nairobi"), "\n";             // NAIROBI
echo strtolower("MOMBASA"), "\n";             // mombasa
echo ucwords("kamau njoroge"), "\n";          // Kamau Njoroge
echo str_replace("Black", "White", $s), "\n"; // replace
echo strpos("hello world", "world"), "\n";    // position (0-based): 6
var_dump(str_contains("Laptop bag", "bag"));  // PHP 8: true
var_dump(str_starts_with("0712345678", "07"));
echo substr("2026-09-15", 0, 4), "\n";        // 2026
print_r(explode(",", "Nairobi,Mombasa,Kisumu"));   // split into an array
echo implode(" | ", ["Tea", "Mandazi", "Chapati"]), "\n";  // join an array
echo str_pad("7", 3, "0", STR_PAD_LEFT), "\n";      // 007
```

Note: `strlen` counts bytes, so for text with accents or emojis use `mb_strlen` and the other `mb_` functions.

### Practical: format a Kenyan phone number

```try-php
<?php
function normalisePhone(string $phone): ?string {
    $digits = preg_replace('/\D/', '', $phone);      // keep digits only
    if (str_starts_with($digits, "0") && strlen($digits) === 10) {
        return "254" . substr($digits, 1);
    }
    if (str_starts_with($digits, "254") && strlen($digits) === 12) {
        return $digits;
    }
    if (strlen($digits) === 9 && ($digits[0] === "7" || $digits[0] === "1")) {
        return "254" . $digits;
    }
    return null;                                      // invalid
}

foreach (["0712 345 678", "+254 712345678", "712345678", "0110 123 456", "12345"] as $p) {
    echo str_pad($p, 16), " -> ", normalisePhone($p) ?? "invalid", "\n";
}
```

M-Pesa APIs need numbers in the `2547XXXXXXXX` / `2541XXXXXXXX` format, so this function is genuinely useful.

## Numbers

```try-php
<?php
$a = 17; $b = 5;
echo $a + $b, "\n";        // 22
echo $a - $b, "\n";        // 12
echo $a * $b, "\n";        // 85
echo $a / $b, "\n";        // 3.4
echo intdiv($a, $b), "\n"; // 3 (whole number division)
echo $a % $b, "\n";        // 2 (remainder: modulus)
echo $a ** 2, "\n";        // 289 (power)

$count = 10;
$count++;                  // add 1
$count += 5;               // add 5
echo $count, "\n";         // 16
```

### Rounding and money

```try-php
<?php
$price = 1234.5678;
echo round($price), "\n";          // 1235
echo round($price, 2), "\n";       // 1234.57
echo floor($price), "\n";          // 1234
echo ceil($price), "\n";           // 1235
echo number_format($price), "\n";            // 1,235
echo number_format($price, 2), "\n";         // 1,234.57
echo "KSh " . number_format(2500000), "\n";  // KSh 2,500,000

// VAT calculation
$net = 8620.69;
$vat = round($net * 0.16, 2);
echo "Net KSh " . number_format($net, 2) . " + VAT KSh " . number_format($vat, 2)
   . " = KSh " . number_format($net + $vat, 2) . "\n";
```

:::warning Floats and money
Floats can't store some decimals exactly: `0.1 + 0.2` isn't exactly `0.3`. For money, many systems store amounts as **whole cents/shillings in integers** (e.g. 150050 for KSh 1,500.50), or use `round()` at each step and `DECIMAL` columns in MySQL.
:::

```try-php
<?php
var_dump(0.1 + 0.2 == 0.3);          // false!
var_dump(round(0.1 + 0.2, 2) == 0.3); // true
```

## Dates and times basics

```try-php
<?php
date_default_timezone_set("Africa/Nairobi");
echo date("Y-m-d"), "\n";              // 2026-09-15 style
echo date("l, j F Y"), "\n";           // Tuesday, 15 September 2026 style
echo date("H:i"), "\n";                // 24-hour time

$due = new DateTime("2026-10-01");
$due->modify("+30 days");
echo "Due: " . $due->format("d/m/Y") . "\n";

$start = new DateTime("2026-01-10");
$end = new DateTime("2026-03-25");
echo "Days between: " . $start->diff($end)->days . "\n";
```

Always set the timezone (`Africa/Nairobi`) so times are right for Kenyan users.

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `$` | `$name`, not `name` |
| Using `+` to join strings | Use `.` |
| Variables inside single quotes | Use double quotes or concatenation |
| Comparing with `==` and getting surprises | Use `===` |
| Storing phone numbers as integers | Keep them as strings |
| Money rounding errors | Round each step, or use integer cents |

:::think A form sends quantity "3" and price "250.50". Write the steps to calculate the total including 16% VAT, displayed like "KSh 871.74".
Convert: `$qty = (int)$_POST['qty']; $price = (float)$_POST['price'];` (after validating both are numeric). Subtotal = 3 × 250.50 = 751.50; VAT = round(751.50 × 0.16, 2) = 120.24; total = 871.74; display with `"KSh " . number_format($total, 2)`.
:::

## Summary

- Variables start with `$`, are case-sensitive and hold strings, ints, floats, bools, null, arrays or objects.
- Use `var_dump`/`gettype` to inspect, casts like `(int)` to convert, and `===` to compare strictly.
- Constants (`const`, `define`) hold fixed values like VAT rates.
- Strings: double quotes interpolate, `.` joins, heredoc for long text; many functions: trim, strtoupper, str_replace, explode, implode, str_contains.
- Numbers: arithmetic, intdiv, %, round, number_format; be careful with floats for money; set the Africa/Nairobi timezone for dates.

```quiz
Q: Which function formats 2500000 as 2,500,000?
A: number_format
Q: What does 17 % 5 return?
A: 2
Q: Which comparison checks value AND type?
A: === | triple equals
Q: Which function splits "a,b,c" into an array?
A: explode
Q: Should phone numbers be stored as integers or strings?
A: strings | string
Q: Which function removes spaces from both ends of a string?
A: trim
```

**Learn more:** [PHP manual: strings](https://www.php.net/manual/en/language.types.string.php) · [PHP manual: string functions](https://www.php.net/manual/en/ref.strings.php)
