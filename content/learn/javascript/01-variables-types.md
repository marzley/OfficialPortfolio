---
slug: variables-types
title: Variables and data types
after: introduction
---
# Variables and data types

A **variable** is a named box that stores a value so you can use it later. JavaScript has three ways to make one, and seven basic kinds of values.

## let, const and var

```try-javascript
const shopName = "Mama Mboga Fresh";   // const: cannot be reassigned
let stock = 40;                       // let: can change
stock = stock - 5;

console.log(shopName, "has", stock, "bunches left");
```

| Keyword | Can change? | Use it when |
|---|---|---|
| `const` | No (the box always points to the same value) | **Default choice.** Most values never change. |
| `let` | Yes | Counters, totals, anything that changes |
| `var` | Yes | Old code only. It has confusing scope rules; avoid it. |

> Rule of thumb: start with `const`. Switch to `let` only when you need to reassign.

## Naming rules

- Letters, digits, `_` and `$`; cannot start with a digit.
- Case sensitive: `total` and `Total` are different.
- Use **camelCase**: `totalPrice`, `customerName`.
- Pick names that explain the value: `vatRate` beats `x`.

## The data types

| Type | Example | Notes |
|---|---|---|
| `string` | `"Nairobi"`, `'Kisumu'`, `` `Hi ${name}` `` | Text |
| `number` | `42`, `3.5`, `-10` | Integers and decimals are the same type |
| `boolean` | `true`, `false` | Yes/no |
| `undefined` | `undefined` | A variable with no value yet |
| `null` | `null` | "Deliberately empty" |
| `bigint` | `9007199254740993n` | Very large whole numbers |
| `symbol` | `Symbol("id")` | Unique keys (advanced) |

And **objects** (including arrays and functions) for everything else.

```try-javascript
let town = "Eldoret";
let population = 475716;
let isCity = true;
let mayor;              // undefined
let discount = null;    // empty on purpose
let towns = ["Nyeri", "Meru"];
let person = { name: "Wanjiru", age: 24 };

console.log(typeof town);       // string
console.log(typeof population); // number
console.log(typeof isCity);     // boolean
console.log(typeof mayor);      // undefined
console.log(typeof discount);   // object  (a famous old quirk!)
console.log(typeof towns, Array.isArray(towns)); // object true
console.log(typeof person);     // object
```

## Converting between types

Values from forms and `prompt()` are always **strings**. Convert them before doing maths:

```try-javascript
const input = "250";
console.log(input + 50);          // "25050"  (joined as text!)
console.log(Number(input) + 50);  // 300
console.log(parseInt("12 bags")); // 12
console.log(parseFloat("3.75kg"));// 3.75
console.log(String(99) + " shillings");
console.log(Number("abc"));       // NaN = "Not a Number"
console.log(Boolean(""), Boolean("hi"), Boolean(0), Boolean(5));
```

## Truthy and falsy

In an `if`, these values count as **false**: `false`, `0`, `""` (empty string), `null`, `undefined`, `NaN`. Everything else is **true**.

```try-javascript
const name = "";
if (name) {
  console.log("Hello " + name);
} else {
  console.log("Please enter your name");
}
```

## == vs ===

Always use `===` (strict equal) and `!==`. The loose `==` converts types first and gives surprising results:

```try-javascript
console.log(5 == "5");   // true  (surprise)
console.log(5 === "5");  // false (different types)
console.log(0 == "");    // true  (surprise)
console.log(0 === "");   // false
```

```quiz
Q: Which keyword should be your default for variables that won't be reassigned?
A: const
Q: What does typeof "Mombasa" return?
A: string
Q: What is "10" + 5 in JavaScript?
A: 105 | "105"
Q: Which comparison operator checks value AND type?
A: === | triple equals
Q: Is an empty string "" truthy or falsy?
A: falsy
```
=== exercise ===
Create a `const` called `price` with the value **1500** and a `let` called `qty` with **3**. Log their product so the output is **4500**.
=== starter ===
// your code here
=== expected ===
4500
=== must_contain ===
const price
let qty
console.log
