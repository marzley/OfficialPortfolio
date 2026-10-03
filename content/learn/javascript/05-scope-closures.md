---
slug: scope-closures
title: Scope, hoisting and closures
after: objects-destructuring
---
# Scope, hoisting and closures

**Scope** decides where a variable can be seen. Understanding it prevents bugs where values "disappear" or get overwritten, and it unlocks **closures**, one of JavaScript's most powerful ideas.

## Three kinds of scope

```try-javascript
const shop = "Duka Bora";            // global scope: visible everywhere

function sell() {
  const item = "Unga";               // function scope: only inside sell()
  if (true) {
    const qty = 2;                   // block scope: only inside these { }
    console.log(shop, item, qty);    // all visible here
  }
  // console.log(qty);  // would be an error: qty is not defined here
}
sell();
// console.log(item);   // error: item only exists inside sell()
```

- `let` and `const` are **block scoped**: they live inside the nearest `{ }`.
- `var` ignores blocks and is function scoped. That's one reason to avoid it.

## Shadowing

An inner variable with the same name hides the outer one:

```try-javascript
const rate = 16;
function price(amount) {
  const rate = 0;               // shadows the outer rate inside this function
  return amount + amount * rate / 100;
}
console.log(price(100), rate);  // 100 16
```

## Hoisting

Function **declarations** can be called before they appear, because JavaScript "hoists" them:

```try-javascript
console.log(add(2, 3));      // works: 5
function add(a, b) { return a + b; }

try {
  console.log(total);         // let/const cannot be used before their line
  let total = 10;
} catch (e) {
  console.log("Error:", e.message);
}
```

## Closures: functions that remember

A **closure** is a function that remembers the variables from where it was created, even after that outer function has finished.

```try-javascript
function makeCounter() {
  let count = 0;              // private: nothing outside can touch it
  return function () {
    count++;
    return count;
  };
}
const nextTicket = makeCounter();
console.log(nextTicket()); // 1
console.log(nextTicket()); // 2
console.log(nextTicket()); // 3

const other = makeCounter(); // its own separate count
console.log(other());        // 1
```

## Practical closure: a price calculator factory

```try-javascript
function withVat(rate) {
  return (amount) => Math.round(amount * (1 + rate / 100));
}
const kenyaVat = withVat(16);
const noVat = withVat(0);
console.log(kenyaVat(1000));  // 1160
console.log(noVat(1000));     // 1000
```

## Practical closure: private data (a wallet)

```try-javascript
function createWallet(owner) {
  let balance = 0;
  return {
    deposit(amount) { if (amount > 0) balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return balance;
    },
    getBalance: () => `${owner}: KSh ${balance}`,
  };
}
const w = createWallet("Kevin");
w.deposit(2000);
console.log(w.withdraw(500));
console.log(w.withdraw(5000));
console.log(w.getBalance());
console.log(w.balance);  // undefined: the balance is truly private
```

## The classic loop bug (and why let fixes it)

```try-javascript
for (var i = 1; i <= 3; i++) setTimeout(() => console.log("var:", i), 0);   // 4 4 4
for (let j = 1; j <= 3; j++) setTimeout(() => console.log("let:", j), 0);   // 1 2 3
```

With `let`, every loop round gets its own `j`, so each timer remembers the right number.

## Why scope matters

Scope decides **where a variable can be seen and changed**. Good scoping keeps variables private to the code that needs them, so one part of your site can't accidentally break another. On a real website you might have a cart script, an analytics script and a chat widget on the same page: if they all used global variables called `total` or `count`, they would overwrite each other. Closures power everyday features: event handlers that remember which button was clicked, debounced search boxes, counters, and modules that hide their internal data.

## The scope chain

When JavaScript looks up a name, it searches the current scope, then the outer one, then the next, out to the global scope. Inner functions can see outer variables, never the reverse:

```try-javascript
const shop = "Duka Bora";               // global
function openShop() {
  const opening = "8:00";               // openShop's scope
  function showSign() {
    const greeting = "Karibu";          // showSign's scope
    console.log(`${greeting} to ${shop}, open from ${opening}`);
  }
  showSign();
  // console.log(greeting);             // ReferenceError: not visible out here
}
openShop();
```

## The temporal dead zone

`let` and `const` are hoisted but not initialised: using them before the declaration line throws an error. This protects you from using half-set-up variables:

```try-javascript
try {
  console.log(total);
  let total = 100;
} catch (e) {
  console.log(e.name + ":", e.message);
}
console.log(typeof notDeclaredAnywhere);   // "undefined" (typeof is safe)
```

## Closures in event handlers

Every handler created in a loop remembers its own values. This is the pattern behind "Add to cart" buttons:

```try-javascript
const products = [
  { id: 1, name: "Unga 2kg", price: 180 },
  { id: 2, name: "Sugar 1kg", price: 210 },
];
const handlers = [];
for (const p of products) {
  handlers.push(() => console.log(`Added ${p.name} (KSh ${p.price})`));
}
// later, when "buttons" are clicked:
handlers[1]();
handlers[0]();
```

In a browser you would write `button.addEventListener("click", () => addToCart(p.id))`, and each button's handler keeps its own `p`.

## Debounce: a closure that saves server requests

A search box shouldn't hit the server on every keystroke. A debounced function waits until typing pauses:

```try-javascript
function debounce(fn, ms) {
  let timer;                              // remembered between calls
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
const search = debounce(q => console.log("Searching for:", q), 200);
search("n"); search("na"); search("nai"); search("nairobi");   // only the last runs
```

## once: run something a single time

```try-javascript
function once(fn) {
  let done = false, result;
  return (...args) => {
    if (!done) { done = true; result = fn(...args); }
    return result;
  };
}
const initPayment = once(() => { console.log("Payment SDK loaded"); return "ready"; });
console.log(initPayment(), initPayment(), initPayment());
```

## Memoisation: remembering results

Closures can cache expensive results:

```try-javascript
function memo(fn) {
  const cache = new Map();
  return n => {
    if (cache.has(n)) return cache.get(n);
    const value = fn(n);
    cache.set(n, value);
    return value;
  };
}
let calls = 0;
const slowSquare = n => { calls++; return n * n; };
const fastSquare = memo(slowSquare);
console.log(fastSquare(12), fastSquare(12), fastSquare(12), "calls:", calls);
```

## The module pattern (before ES modules)

Older code (and many WordPress themes and plugins) uses an immediately invoked function to create private scope:

```try-javascript
const Cart = (function () {
  const items = [];                        // private
  function total() { return items.reduce((s, i) => s + i.price * i.qty, 0); }
  return {
    add(name, price, qty = 1) { items.push({ name, price, qty }); },
    count: () => items.length,
    total,
  };
})();
Cart.add("Milk", 60, 2);
Cart.add("Bread", 65);
console.log(Cart.count(), "items, total KSh", Cart.total());
console.log(Cart.items);                   // undefined: private
```

Today ES modules (`import`/`export`) give each file its own scope, which achieves the same thing more cleanly.

## `this` and arrow functions (scope-related)

Arrow functions don't have their own `this`; they use the `this` of the surrounding code. Regular functions get `this` from how they are called:

```try-javascript
const timer = {
  seconds: 0,
  startRegular() {
    const self = this;
    [1, 2].forEach(function () { self.seconds++; });   // old workaround
  },
  startArrow() {
    [1, 2].forEach(() => { this.seconds++; });        // arrow keeps this
  },
};
timer.startRegular();
timer.startArrow();
console.log(timer.seconds);   // 4
```

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Accidental globals (`total = 0` without let) | Shared across scripts; hard bugs | Always declare; use strict mode/modules |
| Using `var` in loops with callbacks | All callbacks see the last value | Use `let`/`const` |
| Huge closures holding big data | Memory stays in use | Keep only what's needed; remove listeners you no longer need |
| Arrow functions as object methods that use `this` | `this` isn't the object | Use method syntax `name() {}` |

## Practice

1. Write `makeIdGenerator(prefix)` that returns a function producing `"INV-1"`, `"INV-2"`, ...
2. Build a `createBankAccount(initial)` with deposit, withdraw (refuse overdrafts) and balance, keeping the balance private.
3. Write `throttle(fn, ms)` that runs fn at most once every ms milliseconds.
4. Explain why `typeof undeclaredVariable` doesn't throw but `console.log(undeclaredVariable)` does.

:::think A page has 3 buttons created in a `for (var i = 0; i < 3; i++)` loop, and every button alerts "3". Why, and what are two fixes?
`var` is function-scoped, so all three handlers share one `i`, which is 3 when any button is clicked. Fix 1: use `let i` (a new binding per iteration). Fix 2: store the value on the element (`button.dataset.index = i`) or create the handler through a function that takes `i` as a parameter, capturing its own copy.
:::

```quiz
Q: Are let and const block scoped or function scoped?
A: block scoped | block
Q: Can you call a function declaration before the line where it is written? (yes or no)
A: yes
Q: What is the name for a function that remembers variables from where it was created?
A: closure | a closure
Q: In makeCounter, can outside code change count directly? (yes or no)
A: no
Q: Which keyword fixes the classic setTimeout loop bug: var or let?
A: let
Q: What is the error called when you use a let variable before its declaration line? (three words)
A: temporal dead zone | TDZ
Q: Which technique delays a function until the user stops typing?
A: debounce | debouncing
Q: Do arrow functions have their own this? (yes or no)
A: no
```
=== exercise ===
Write a function `makeCounter` that returns a function which counts up. Call it three times and log the last result, **3**.
=== starter ===
function makeCounter() {
  let count = 0;
  // return a function here
}
const next = makeCounter();
next();
next();
console.log(next());
=== expected ===
3
=== must_contain ===
return
count
