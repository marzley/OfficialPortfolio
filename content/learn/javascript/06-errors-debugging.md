---
slug: errors-debugging
title: Errors, try/catch and debugging
after: scope-closures
---
# Errors, try/catch and debugging

Every programmer writes bugs. Good programmers find them fast. This lesson shows how to read error messages, handle errors gracefully and use the browser's tools to debug.

## Reading an error message

```try-javascript
// This example fails on purpose, so you can read the error message
const user = null;
console.log(user.name);
```

You'll see something like **TypeError: Cannot read properties of null (reading 'name')**. It tells you:

1. The **type** of error (`TypeError`),
2. **What** went wrong (reading `name` from `null`),
3. And in the browser console, **where** (file and line number).

## The common error types

| Error | Usually means | Example |
|---|---|---|
| `SyntaxError` | Code is written wrongly (missing bracket, quote) | `if (x > 1 {` |
| `ReferenceError` | Using a name that doesn't exist (often a typo) | `consol.log()` |
| `TypeError` | Using a value the wrong way | `null.name`, `5()` |
| `RangeError` | A number is out of the allowed range | `new Array(-1)` |

## try / catch / finally

Wrap risky code so one failure doesn't stop the whole program:

```try-javascript
const text = '{"amount": 500, "phone": "0712345678"';   // broken JSON: missing }

try {
  const data = JSON.parse(text);
  console.log("Amount:", data.amount);
} catch (error) {
  console.log("Could not read the payment data.");
  console.log("Details:", error.name, "-", error.message);
} finally {
  console.log("This always runs (e.g. hide the loading spinner).");
}
```

## Throwing your own errors

Use `throw` when your function receives something it can't work with:

```try-javascript
function withdraw(balance, amount) {
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (amount > balance) {
    throw new RangeError(`Insufficient funds: balance is KSh ${balance}`);
  }
  return balance - amount;
}

for (const amt of [300, -5, 9000]) {
  try {
    console.log("New balance:", withdraw(1000, amt));
  } catch (e) {
    console.log(`${e.name}: ${e.message}`);
  }
}
```

## Debugging with console

```try-javascript
const cart = [{ item: "Oil", price: 350 }, { item: "Soap", price: 60 }];
console.log("cart is", cart);
console.table(cart);                 // a neat table in the browser console
console.warn("Stock is low");
console.error("Payment failed");
console.log(typeof cart[0].price);   // check types when maths looks wrong
```

## Browser DevTools

Press **F12** (or right-click → Inspect) in Chrome or Edge:

- **Console**: errors in red, with a clickable file and line number.
- **Sources**: click a line number to set a **breakpoint**. The code pauses there so you can see every variable's value, then step line by line.
- Add the word `debugger;` in your code to pause at that point when DevTools is open.
- **Network**: see requests to servers (useful for `fetch` problems).

## A debugging routine that works

1. **Read** the whole error message. Note the line number.
2. **Reproduce** it: what exact steps cause it?
3. **Check your assumptions** with `console.log`: is the variable what you think? Is it a string instead of a number?
4. **Shrink** the problem: comment out code until the bug disappears, then add back.
5. **Explain** the code line by line to someone (or a rubber duck). You'll often spot the mistake while talking.
6. **Search** the exact error text online; someone has had it before.

> Tip: our practice editor explains many errors in plain language and suggests a fix. Try making a mistake on purpose to see it.

```quiz
Q: Which error type do you usually get from a typo in a variable name?
A: ReferenceError | reference error
Q: Which block runs whether or not an error happened?
A: finally
Q: Which keyword creates your own error?
A: throw
Q: Which console method shows an array of objects as a table?
A: console.table | table
Q: Which word in your code pauses it when DevTools is open?
A: debugger
```
=== exercise ===
Wrap `JSON.parse("{bad json")` in `try/catch` and log **Invalid data** in the catch block.
=== starter ===
// try to parse, catch the error
JSON.parse("{bad json");
=== expected ===
Invalid data
=== must_contain ===
try
catch
