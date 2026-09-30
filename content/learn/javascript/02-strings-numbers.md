---
slug: strings-numbers-operators
title: Strings, numbers and operators
after: variables-types
---
# Strings, numbers and operators

Most programs are about text (names, messages, receipts) and numbers (prices, totals, dates). This lesson gives you the tools for both.

## Arithmetic operators

```try-javascript
const a = 17, b = 5;
console.log(a + b);   // 22 add
console.log(a - b);   // 12 subtract
console.log(a * b);   // 85 multiply
console.log(a / b);   // 3.4 divide
console.log(a % b);   // 2  remainder (modulo)
console.log(a ** 2);  // 289 power

let total = 100;
total += 50;   // same as total = total + 50
total *= 2;
total++;       // add 1
console.log(total); // 301
```

`%` (remainder) is surprisingly useful: `n % 2 === 0` tests for even numbers.

## Rounding and money

```try-javascript
const price = 1234.5678;
console.log(Math.round(price));      // 1235
console.log(Math.floor(price));      // 1234
console.log(Math.ceil(price));       // 1235
console.log(price.toFixed(2));       // "1234.57" (a string)
console.log((1500).toLocaleString("en-KE"));  // "1,500"
console.log(0.1 + 0.2);              // 0.30000000000000004 !
```

> Computers store decimals in binary, so `0.1 + 0.2` isn't exactly `0.3`. For money, work in **whole cents** (or whole shillings) and format at the end.

## Useful Math functions

```try-javascript
console.log(Math.max(3, 19, 7), Math.min(3, 19, 7));
console.log(Math.abs(-40));
console.log(Math.sqrt(144));
const dice = Math.floor(Math.random() * 6) + 1;   // random 1 to 6
console.log("Dice:", dice);
```

## Strings

```try-javascript
const first = "Grace", last = "Achieng";
const full = first + " " + last;                // joining (concatenation)
const greeting = `Habari ${first}! Your balance is KSh ${(2500).toLocaleString()}.`; // template literal
console.log(full);
console.log(greeting);
console.log(full.length);             // 13
console.log(full.toUpperCase());      // GRACE ACHIENG
console.log(full[0], full.at(-1));    // G g
```

Template literals use **backticks** and `${...}` to drop values into text. They can also span several lines.

## String methods you'll use every day

```try-javascript
const phone = "  0712 345 678 ";
console.log(phone.trim());                          // remove spaces at the ends
console.log(phone.replaceAll(" ", ""));             // "0712345678"
console.log("Nairobi".includes("robi"));            // true
console.log("Nairobi".startsWith("Nai"));           // true
console.log("Nairobi".indexOf("r"));                // 3
console.log("Nairobi".slice(0, 3));                 // "Nai"
console.log("a,b,c".split(","));                    // ["a","b","c"]
console.log(["x", "y"].join(" - "));                // "x - y"
console.log("7".padStart(3, "0"));                  // "007"
console.log("ha".repeat(3));                        // "hahaha"
```

## Comparison and logical operators

| Operator | Meaning |
|---|---|
| `===`, `!==` | Equal / not equal (strict) |
| `>`, `<`, `>=`, `<=` | Greater, less... |
| `&&` | AND: both must be true |
| `||` | OR: at least one true |
| `!` | NOT |
| `??` | Use a default if the value is `null` or `undefined` |

```try-javascript
const age = 20, hasId = true;
console.log(age >= 18 && hasId);        // true
console.log(age < 13 || age > 65);      // false
console.log(!hasId);                    // false

const nickname = null;
console.log(nickname ?? "Guest");       // "Guest"
const status = age >= 18 ? "adult" : "minor";   // ternary operator
console.log(status);
```

## Project: format an M-Pesa style message

```try-javascript
const amount = 1250;
const to = "JOYCE WAMBUI";
const balance = 8430.5;
const code = "SJ" + Math.random().toString(36).slice(2, 10).toUpperCase();
console.log(`${code} Confirmed. Ksh${amount.toFixed(2)} sent to ${to} on ${new Date().toLocaleDateString("en-KE")}. New M-PESA balance is Ksh${balance.toLocaleString("en-KE", { minimumFractionDigits: 2 })}.`);
```

```quiz
Q: What is 17 % 5?
A: 2
Q: Which characters wrap a template literal?
A: backticks | backtick | `
Q: Which method removes spaces from both ends of a string?
A: trim | trim()
Q: What does "Kenya".length return?
A: 5
Q: Which operator gives a default value when something is null or undefined?
A: ?? | nullish coalescing
```
=== exercise ===
Use a **template literal** to log exactly: **Total: KSh 4500** where 4500 comes from the variables `price = 1500` and `qty = 3`.
=== starter ===
const price = 1500;
const qty = 3;
// log the total using `${...}`
=== expected ===
Total: KSh 4500
=== must_contain ===
${
