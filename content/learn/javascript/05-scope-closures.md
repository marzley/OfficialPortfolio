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
