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

## Why error handling and debugging matter

Every developer spends a large share of their time finding and fixing bugs. Users don't see your code; they see a button that does nothing, a blank page or a payment that "hangs". Good error handling turns those failures into clear messages ("Network problem, please try again") and keeps the rest of the page working. Good debugging skills are what employers test for in interviews and what makes freelance clients trust you.

| Kind of problem | Example | How you notice |
|---|---|---|
| **Syntax error** | Missing `)` or `}` | The script doesn't run at all; the console shows SyntaxError with a line number |
| **Runtime error** | Calling a method on `undefined` | Code stops at that line with TypeError/ReferenceError |
| **Logic error** | Total adds VAT twice | No error message; the result is just wrong |
| **Network/async error** | API down, slow 3G | A rejected promise, a failed fetch, or nothing happens |

Logic errors are the hardest because nothing crashes; testing with known answers is how you catch them.

## Errors in asynchronous code

`try/catch` only catches errors in code it is waiting for. With promises, use `await` inside `try`, or `.catch()`:

```try-javascript
function fakeFetchBalance(phone) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^07\d{8}$/.test(phone)) reject(new Error("Invalid phone number"));
      else resolve({ phone, balance: 1520 });
    }, 50);
  });
}

async function showBalance(phone) {
  try {
    const data = await fakeFetchBalance(phone);
    console.log(`Balance for ${data.phone}: KSh ${data.balance}`);
  } catch (err) {
    console.log("Could not load balance:", err.message);
  } finally {
    console.log("(hide loading spinner)");
  }
}
showBalance("0712345678").then(() => showBalance("12345"));
```

A common bug is forgetting `await`: the `try` finishes immediately and the rejection becomes an "Uncaught (in promise)" error.

## Custom error classes

Naming your errors lets you handle each kind differently:

```try-javascript
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}
class PaymentError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "PaymentError";
    this.code = code;
  }
}

function pay(amount, phone) {
  if (!(amount > 0)) throw new ValidationError("amount", "Enter an amount above 0");
  if (!/^(07|01)\d{8}$/.test(phone)) throw new ValidationError("phone", "Enter a valid Safaricom/Airtel number");
  if (amount > 150000) throw new PaymentError("Amount above the transaction limit", "LIMIT");
  return "Request sent";
}

for (const [amount, phone] of [[500, "0712345678"], [0, "0712345678"], [200000, "0112345678"], [50, "999"]]) {
  try {
    console.log(pay(amount, phone));
  } catch (err) {
    if (err instanceof ValidationError) console.log(`Fix the ${err.field} field: ${err.message}`);
    else if (err instanceof PaymentError) console.log(`Payment problem (${err.code}): ${err.message}`);
    else throw err;   // unknown errors: don't hide them
  }
}
```

The limit value above is an example; real limits come from the payment provider's current rules.

## Don't swallow errors

```javascript
// Bad: the error disappears and nobody knows why the feature broke
try { saveOrder(order); } catch (e) {}

// Better: tell the user, and record details for developers
try {
  saveOrder(order);
} catch (e) {
  showMessage("We couldn't save your order. Please try again.");
  console.error("saveOrder failed", e);
}
```

Show friendly messages to users; keep technical details (stack traces, server responses) for logs. Never show passwords, tokens or other secrets in error messages.

## Global error handlers

As a safety net, browsers let you catch anything you missed, for example to report it to a logging service:

```javascript
window.addEventListener("error", e => {
  console.error("Unhandled error:", e.message, e.filename, e.lineno);
});
window.addEventListener("unhandledrejection", e => {
  console.error("Unhandled promise rejection:", e.reason);
});
```

Services like Sentry collect these from real users' browsers so you learn about bugs before customers complain.

## More console tools

```try-javascript
const orders = [{ id: 1, total: 530 }, { id: 2, total: 1200 }];
console.group("Order check");
console.log("Orders loaded:", orders.length);
console.warn("Order 2 is above KSh 1,000: needs approval");
console.groupEnd();

console.time("sum");
let s = 0;
for (let i = 0; i < 1e6; i++) s += i;
console.timeEnd("sum");

console.assert(orders.every(o => o.total > 0), "Found an order with zero total");
console.count("render"); console.count("render");
```

## Reading a stack trace

```try-javascript
function calculateVat(order) { return order.total * 0.16; }
function checkout(order) { return calculateVat(order); }
try {
  checkout(undefined);
} catch (e) {
  console.log(e.stack.split("\n").slice(0, 3).join("\n"));
}
```

Read from the top: the first line says **what** went wrong, the next lines show **where**, from the innermost function outwards. Start with the first line that points to your own file, not a library.

## Debugging in DevTools step by step

1. Open DevTools (F12 or Ctrl+Shift+I), go to **Sources**, and open your script.
2. Click a line number to set a **breakpoint**, then trigger the action (click the button).
3. When execution pauses, hover over variables or look at the **Scope** panel.
4. Use **Step over** (F10) to run line by line, **Step into** (F11) to enter a function.
5. Add **watch expressions** such as `cart.length` or `total * 1.16`.
6. Use **conditional breakpoints** (right-click a line number) like `item.price === undefined` to stop only on the bad case.
7. Check the **Network** tab for failed requests (red rows, status 404/500) and the response body.

On a phone, use remote debugging: connect an Android phone by USB and open `chrome://inspect` on your computer.

## Defensive coding habits

- Validate input at the edges (forms, API responses) before using it.
- Use optional chaining (`data?.customer?.name`) and defaults (`?? "Guest"`) for data that may be missing.
- Prefer `===` and explicit conversions.
- Write small functions you can test with known inputs and outputs.
- Use a linter (ESLint) to catch mistakes like unused variables or typos before running.

## Practice

1. Write `parseAge(text)` that throws a `ValidationError` for non-numbers or ages outside 0–120, and test it with five inputs.
2. Make an async function that "fetches" a product and retries up to 3 times when it fails.
3. Add `console.time` around two ways of building a 10,000-item string and compare them.
4. Find the bug: `const total = items.reduce((s, i) => s + i.price)` gives `"[object Object]180210"`. (Hint: the starting value.)

:::think A form's Submit button does nothing and there's no visible error. What do you check first?
Open the Console for errors (maybe a TypeError stopped the handler), then check that the event listener is attached (wrong selector returns null), and the Network tab to see whether a request was sent and what status came back. Adding a `console.log` at the start of the handler quickly shows whether it runs at all.
:::

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
Q: Which keyword must you use inside try so that a promise rejection is caught?
A: await
Q: Which operator checks whether an error is a particular class?
A: instanceof
Q: Which browser event catches unhandled promise rejections?
A: unhandledrejection
Q: Which console methods measure how long code takes? (give the first)
A: console.time | time
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
