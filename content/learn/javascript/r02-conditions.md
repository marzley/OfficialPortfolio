---
slug: conditions
title: "Conditions: if, else, comparison, logical operators, switch and the ternary operator"
after: KEEP
---
# Conditions: if, else, comparison, logical operators, switch and the ternary operator

Programs become useful when they can **decide**: if the payment succeeded, show a receipt; if the phone number is wrong, show an error; if the cart is over KSh 2,000, give free delivery; if the student scored 80 or more, award an A. These decisions are **conditions**. This unit covers every way JavaScript makes decisions, the true/false values behind them, and the mistakes that trip up beginners.

:::note What you will learn
- Booleans (`true` / `false`) and comparison operators
- Why `===` is better than `==`
- `if`, `else if`, `else`
- Logical operators `&&`, `||`, `!`
- Truthy and falsy values
- The ternary operator, `switch`, `??` and `?.`
- Real examples: grading, delivery fees, validation, M-Pesa results
:::

## Booleans: true or false

A **boolean** has only two values: `true` or `false`. Comparisons produce booleans:

```try-javascript
const age = 19;
console.log(age >= 18);     // true
console.log(age < 13);      // false
console.log(typeof true);   // "boolean"
```

### Comparison operators

| Operator | Meaning | Example (`x = 10`) | Result |
|---|---|---|---|
| `===` | Equal (value **and** type) | `x === 10` | `true` |
| `!==` | Not equal (value or type) | `x !== 5` | `true` |
| `>` | Greater than | `x > 10` | `false` |
| `>=` | Greater than or equal | `x >= 10` | `true` |
| `<` | Less than | `x < 20` | `true` |
| `<=` | Less than or equal | `x <= 9` | `false` |

### `===` vs `==`

`==` converts types before comparing, causing surprises; `===` doesn't convert.

```try-javascript
console.log(5 == "5");    // true  (string converted to number)
console.log(5 === "5");   // false (different types)
console.log(0 == "");     // true  (surprising!)
console.log(0 === "");    // false
console.log(null == undefined);  // true
console.log(null === undefined); // false
```

**Rule:** always use `===` and `!==`. Values from forms are **strings**, so convert them first (`Number(input)`) and compare with `===`.

## `if`, `else if`, `else`

```try-javascript
const score = 72;

if (score >= 80) {
  console.log("Grade A");
} else if (score >= 65) {
  console.log("Grade B");
} else if (score >= 50) {
  console.log("Grade C");
} else {
  console.log("Grade D: let's practise more");
}
```

How it works:
1. The condition in brackets is checked.
2. If it's true, that block `{ ... }` runs and **the rest is skipped**.
3. If false, the next `else if` is checked, and so on.
4. `else` runs only if nothing above was true.

Order matters: check the **strictest** condition first. If you checked `score >= 50` first, a score of 95 would get a C.

:::think What would happen if the conditions were ordered score >= 50, then score >= 65, then score >= 80?
A score of 72 (or even 95) would match `score >= 50` first and print "Grade C"; the other branches would never be reached. With `else if` chains, put the most specific/highest thresholds first.
:::

## Logical operators

| Operator | Name | True when |
|---|---|---|
| `&&` | AND | **Both** sides are true |
| `\|\|` | OR | **At least one** side is true |
| `!` | NOT | Reverses true/false |

```try-javascript
const total = 2500;
const isMember = false;
const county = "Nairobi";

// Free delivery: in Nairobi AND total of 2,000 or more
if (county === "Nairobi" && total >= 2000) {
  console.log("Free delivery");
}

// Discount: members OR orders over 5,000
if (isMember || total > 5000) {
  console.log("10% discount");
} else {
  console.log("No discount");
}

// NOT
const isOpen = false;
if (!isOpen) {
  console.log("Sorry, the shop is closed");
}
```

### Short-circuit evaluation

- `a && b`: if `a` is false, JavaScript doesn't even look at `b`.
- `a || b`: if `a` is true, it doesn't look at `b`.

This is used for defaults and guards: `const name = inputName || "Customer";`

## Truthy and falsy values

In conditions, every value counts as true or false. These are **falsy**:

`false`, `0`, `-0`, `""` (empty string), `null`, `undefined`, `NaN`

**Everything else is truthy**, including `"0"`, `"false"`, `[]` (empty array) and `{}` (empty object).

```try-javascript
const phone = "";
if (!phone) {
  console.log("Please enter your phone number");
}

const items = [];
console.log(items ? "truthy" : "falsy");      // truthy: empty arrays are truthy
console.log(items.length ? "has items" : "cart is empty");
```

## The ternary operator

A short `if/else` that **produces a value**: `condition ? valueIfTrue : valueIfFalse`

```try-javascript
const stock = 0;
const label = stock > 0 ? "In stock" : "Out of stock";
console.log(label);

const qty = 3;
console.log(`You have ${qty} item${qty === 1 ? "" : "s"} in your cart`);
```

Use it for simple choices; for complex logic, `if/else` is clearer. Avoid nesting ternaries.

## `switch`

When comparing one value against many exact options:

```try-javascript
const resultCode = 1032;   // M-Pesa STK result code

switch (resultCode) {
  case 0:
    console.log("Payment successful");
    break;
  case 1032:
    console.log("You cancelled the payment");
    break;
  case 1:
    console.log("Insufficient balance");
    break;
  case 1037:
    console.log("No response from your phone. Try again.");
    break;
  default:
    console.log("Payment failed, code " + resultCode);
}
```

- `switch` uses strict comparison (`===`).
- `break` stops it falling into the next case; forgetting it is a classic bug.
- `default` handles anything not listed.

A modern alternative is an **object lookup**:

```try-javascript
const messages = { 0: "Payment successful", 1032: "You cancelled the payment", 1: "Insufficient balance" };
const code = 1;
console.log(messages[code] ?? "Payment failed, code " + code);
```

## Nullish coalescing `??` and optional chaining `?.`

- `a ?? b` gives `b` only if `a` is `null` or `undefined` (unlike `||`, it keeps `0` and `""`).
- `obj?.prop` reads a property safely, giving `undefined` instead of an error if `obj` is null/undefined.

```try-javascript
const settings = { volume: 0 };
console.log(settings.volume || 50);   // 50 (wrong: 0 was a real value)
console.log(settings.volume ?? 50);   // 0  (correct)

const user = null;
console.log(user?.name);              // undefined, no crash
console.log(user?.name ?? "Guest");   // "Guest"
```

## Real-world examples

### Validating a Kenyan phone number (simplified)

```try-javascript
function checkPhone(raw) {
  const digits = raw.replace(/\D/g, "");          // remove spaces and symbols
  if (digits.length === 0) return "Enter your phone number";
  if (digits.startsWith("0") && digits.length === 10) return "OK";
  if (digits.startsWith("254") && digits.length === 12) return "OK";
  return "Enter a valid number like 0712 345 678";
}

console.log(checkPhone(""));
console.log(checkPhone("0712 345 678"));
console.log(checkPhone("254712345678"));
console.log(checkPhone("12345"));
```

### Delivery fee rules

```try-javascript
function deliveryFee(total, county) {
  if (total === 0) return 0;
  if (county === "Nairobi") {
    return total >= 2000 ? 0 : 150;
  }
  return total >= 5000 ? 200 : 400;   // upcountry
}

console.log(deliveryFee(1500, "Nairobi"));   // 150
console.log(deliveryFee(2500, "Nairobi"));   // 0
console.log(deliveryFee(3000, "Nakuru"));    // 400
console.log(deliveryFee(6000, "Nakuru"));    // 200
```

## Common mistakes

| Mistake | Example | Fix |
|---|---|---|
| `=` instead of `===` | `if (x = 5)` | `if (x === 5)` (`=` assigns!) |
| Using `==` | `if (input == 18)` | Convert and use `===` |
| Comparing strings from forms as numbers | `"100" > "9"` is `false` (string comparison) | `Number("100") > 9` |
| Wrong order in `else if` | Low threshold first | Highest/strictest first |
| Missing `break` in `switch` | Falls through cases | Add `break` |
| `||` for defaults when 0 is valid | `qty || 1` | `qty ?? 1` |
| `if (x > 5 && < 10)` | Invalid | `if (x > 5 && x < 10)` |

## Practice tasks

1. Write a grading program for scores 0–100 with A–E grades, rejecting scores outside 0–100.
2. A matatu fare is KSh 100, but KSh 60 for students and free for children under 5. Print the fare for different passengers.
3. Write a function that returns "Good morning", "Good afternoon" or "Good evening" from an hour (0–23).
4. Use `switch` to print the name of a day from a number 1–7.
5. Use `??` to give a default quantity of 1 only when the quantity is missing (not when it's 0).

## Summary

- Booleans are `true`/`false`; comparisons produce booleans. Always use `===`/`!==`.
- `if / else if / else` choose between blocks; put strict conditions first.
- `&&` (and), `||` (or), `!` (not); they short-circuit.
- Falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN`; everything else is truthy.
- Ternary `a ? b : c` for simple value choices; `switch` (with `break`) or object lookups for many exact options.
- `??` provides defaults only for null/undefined; `?.` reads properties safely.

```quiz
Q: Which operator checks value and type equality?
A: === | triple equals
Q: What does 5 === "5" give?
A: false
Q: Which logical operator needs both sides to be true?
A: && | and
Q: Is an empty string truthy or falsy?
A: falsy
Q: Is an empty array truthy or falsy?
A: truthy
Q: What keyword stops a switch case falling into the next case?
A: break
Q: What does 0 ?? 50 give?
A: 0
Q: What does the ternary operator look like? Write its two symbols in order.
A: ? : | ?: | ? and :
```
=== exercise ===
Given `const score = 75;`, print **Pass** if the score is 50 or more, otherwise **Fail**.
=== starter ===
const score = 75;
=== expected ===
Pass
=== must_contain ===
