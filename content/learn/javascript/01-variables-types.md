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

## Why variables and types matter

Every program stores information while it runs: the items in a shopping cart, the logged-in user's name, the M-Pesa amount typed in a form, whether a menu is open. Variables are the named places where that information lives, and **types** decide what you can do with it (add numbers, join text, check true/false). Most beginner bugs in JavaScript come from a value having a different type from what you expected, for example a form field giving you `"500"` (text) instead of `500` (a number).

| Who | How they use this |
|---|---|
| Front-end developers | Store form input, toggle UI state, keep cart totals |
| Back-end (Node.js) developers | Hold request data, database results, configuration |
| Testers | Check that values have the right type and range |
| Data and analytics people | Clean values from spreadsheets and APIs before charting |

## const with objects and arrays

`const` stops you **reassigning** the variable, but the object or array it points to can still change:

```try-javascript
const cart = ["Unga"];
cart.push("Sugar");          // allowed: changing the array's contents
console.log(cart);

const user = { name: "Akinyi", town: "Kisumu" };
user.town = "Nairobi";       // allowed: changing a property
console.log(user);

function emptyCart() {
  cart = [];                 // not allowed: reassigning a const
}
try {
  emptyCart();
} catch (e) {
  console.log("Error:", e.message);
}
```

Use `Object.freeze(obj)` if you really need an object that can't be changed.

## Numbers in detail

JavaScript has one `number` type for both whole numbers and decimals, plus `BigInt` for very large integers:

```try-javascript
console.log(7 / 2);                    // 3.5 (no integer division)
console.log(Math.floor(7 / 2));        // 3
console.log(7 % 2);                    // 1 (remainder)
console.log(0.1 + 0.2);                // 0.30000000000000004
console.log((0.1 + 0.2).toFixed(2));   // "0.30" (a string)
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991
console.log(10 / 0, -10 / 0);          // Infinity -Infinity
console.log(0 / 0, Number.isNaN(0 / 0)); // NaN true
console.log(9007199254740993n + 2n);   // BigInt
```

For money, many apps store amounts in the smallest unit (cents) as whole numbers, and format only when displaying.

## null vs undefined

| Value | Meaning | Typical source |
|---|---|---|
| `undefined` | "No value was ever given" | A declared but unassigned variable, a missing object property, a function with no `return` |
| `null` | "Deliberately empty" | You set it on purpose, e.g. `selectedProduct = null` after clearing |

```try-javascript
let phone;
console.log(phone);                       // undefined
const profile = { name: "Juma", email: null };
console.log(profile.email, profile.age);  // null undefined
console.log(typeof null);                 // "object" (a famous old quirk)
console.log(profile.age ?? "age not set");  // ?? gives a default for null/undefined
console.log(profile.address?.town);       // optional chaining: undefined, no crash
```

## Template literals

Backticks let you insert values and write multi-line text:

```try-javascript
const name = "Wanjiru";
const total = 2350;
const message = `Habari ${name},
Your order total is KSh ${total.toLocaleString("en-KE")}.
VAT included: KSh ${(total * 0.16 / 1.16).toFixed(2)}`;
console.log(message);
```

## Checking types safely

```try-javascript
const values = [42, "42", true, null, undefined, [1, 2], { a: 1 }, () => 1, NaN];
for (const v of values) {
  const label = Array.isArray(v) ? "array" : v === null ? "null" : typeof v;
  console.log(String(v).padEnd(12), label);
}
console.log(Number.isInteger(5.0), Number.isInteger(5.5));
```

Remember: `typeof []` is `"object"`, so use `Array.isArray()` for arrays, and `typeof NaN` is `"number"`, so use `Number.isNaN()`.

## Converting form input correctly

Everything typed into an HTML input arrives as a string. Convert and validate before maths:

```try-javascript
function toAmount(text) {
  const n = Number(String(text).replace(/,/g, "").trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}
for (const typed of ["1500", " 2,500 ", "abc", "", "-20", "12.5"]) {
  console.log(JSON.stringify(typed), "->", toAmount(typed));
}
console.log(parseInt("250kg"), Number("250kg"));   // 250 NaN
```

`parseInt` reads digits until it hits something else; `Number` requires the whole string to be a number. Choose deliberately.

## Common mistakes

| Mistake | Result | Fix |
|---|---|---|
| `input.value + 10` | `"5010"` (joined text) | `Number(input.value) + 10` |
| Using `var` in new code | Function scope and hoisting surprises | Use `const`, then `let` |
| `if (x == null)` vs `===` confusion | Unexpected matches | Use `===`, and `??` for defaults |
| `total.toFixed(2) + 5` | Text joining, because toFixed returns a string | Do maths first, format last |
| Forgetting `let`/`const` | Creates an accidental global (or an error in strict mode) | Always declare |

## Practice

1. Create `const` variables for a product name, price and quantity, and print a receipt line with a template literal.
2. Write `isValidPhone(text)` that returns true for 10-digit numbers starting with `07` or `01`.
3. Show the difference between `parseFloat("12.5kg")` and `Number("12.5kg")`.
4. Given `const settings = { theme: null }`, print `"light"` when theme is null or missing, using `??`.

:::think Why does `const cart = []` still let you call `cart.push("Rice")`?
`const` fixes the variable binding (the label), not the contents of the value. `cart` must keep pointing at the same array, but that array is mutable, so its items can change. Reassigning `cart = []` is what's forbidden.
:::

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
Q: What does typeof null return?
A: object | "object"
Q: Which operator gives a default only when a value is null or undefined?
A: ?? | nullish coalescing
Q: Which method correctly checks whether a value is an array?
A: Array.isArray | Array.isArray()
Q: What type does toFixed() return?
A: string
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
