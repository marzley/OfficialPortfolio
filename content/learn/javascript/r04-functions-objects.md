---
slug: functions-objects
title: "Functions and objects: reusable code and structured data"
after: KEEP
---
# Functions and objects: reusable code and structured data

Two ideas make up most of every JavaScript program. **Functions** package code you can reuse: "calculate the total", "format a phone number", "check if the form is valid". **Objects** group related data: a customer with a name, phone and balance; a product with a name, price and stock. This unit explains both thoroughly, because everything later (the DOM, events, APIs, React) is built from functions and objects.

:::note What you will learn
- Why functions exist; declaring and calling them
- Parameters, arguments, default values and `return`
- Function expressions and arrow functions
- Scope basics: local vs global variables
- Functions as values (callbacks)
- Objects: properties, methods, dot and bracket notation
- Adding, changing and deleting properties; looping over objects
- `this` in methods (introduction) and arrays of objects
:::

## Part 1: Functions

### Why functions?

Imagine calculating VAT in 20 places. Copy-pasting the formula means 20 places to fix if the rate changes. A function writes it **once**:

- **Reuse:** write once, use many times.
- **Organisation:** break big problems into small named steps.
- **Readability:** `calculateTotal(cart)` explains itself.
- **Testing:** check small pieces separately.

:::define Function
A named, reusable block of code that can take inputs (**parameters**), do work, and give back a result (**return value**).
:::

### Declaring and calling

```try-javascript
function greet(name) {          // declare: name is a parameter
  return "Habari, " + name + "!";
}

console.log(greet("Wanjiku"));  // call: "Wanjiku" is an argument
console.log(greet("Otieno"));
```

- **Parameter:** the placeholder in the definition (`name`).
- **Argument:** the actual value passed when calling (`"Wanjiku"`).
- A function does nothing until it's **called** with `()`.

### `return`

`return` sends a value back and **ends** the function. Without `return`, a function gives `undefined`.

```try-javascript
function addVat(amount) {
  return amount * 1.16;       // 16% VAT
}
const price = addVat(1000);
console.log(price);           // 1160

function sayHi() {
  console.log("Hi");          // prints, but returns nothing
}
const result = sayHi();
console.log(result);          // undefined
```

:::tip Print vs return
`console.log` shows a value to humans; `return` gives a value back to your code so it can be used (stored, added, compared). Most useful functions **return**.
:::

### Multiple parameters and default values

```try-javascript
function lineTotal(price, qty = 1) {     // qty defaults to 1
  return price * qty;
}
console.log(lineTotal(180, 3));   // 540
console.log(lineTotal(180));      // 180

function loanRepayment(principal, ratePercent, months) {
  const interest = principal * (ratePercent / 100);
  return Math.round((principal + interest) / months);
}
console.log(loanRepayment(30000, 10, 6));   // flat interest example
```

### Function expressions and arrow functions

Functions are values, so they can be stored in variables:

```try-javascript
const square = function (n) {
  return n * n;
};

// Arrow function: shorter syntax
const cube = (n) => n * n * n;            // one expression: return is automatic
const formatKsh = (n) => "KSh " + n.toLocaleString("en-KE");
const greet = () => "Karibu!";            // no parameters

console.log(square(4), cube(3), formatKsh(1500000), greet());
```

Arrow functions with `{ }` need an explicit `return`:

```try-javascript
const discount = (total) => {
  if (total >= 5000) return total * 0.9;
  return total;
};
console.log(discount(6000), discount(3000));
```

### Scope: where variables live

Variables declared inside a function are **local**: they exist only inside it.

```try-javascript
const shopName = "Mama Mboga";     // global: visible everywhere

function receipt(total) {
  const vat = total * 0.16;        // local: only inside receipt
  return `${shopName}: total ${total}, VAT ${vat}`;
}

console.log(receipt(500));
console.log(typeof vat);           // "undefined": vat doesn't exist out here
```

Keep variables as local as possible; global variables can be changed by any code and cause bugs. (The **Scope, hoisting and closures** unit goes deeper.)

### Functions as arguments (callbacks)

You can pass a function into another function. This is everywhere in JavaScript: event handlers, timers, array methods.

```try-javascript
function applyToAll(numbers, action) {
  const out = [];
  for (const n of numbers) out.push(action(n));
  return out;
}

console.log(applyToAll([1, 2, 3], (n) => n * 10));
console.log([180, 150, 60].map((p) => p * 2));         // built-in version
setTimeout(() => console.log("Runs after 0.5 seconds"), 500);
```

### Good function habits

- **One job per function** (`calculateTotal`, `formatPhone`), named with a **verb**.
- **Return values** rather than printing inside.
- **Short**: if it's longer than a screen, split it.
- **Avoid changing outside variables** inside functions when you can return a new value instead.

## Part 2: Objects

### Why objects?

A customer has many pieces of data. Separate variables (`customerName`, `customerPhone`, `customerBalance`) get messy fast. An **object** groups them:

:::define Object
A collection of **key–value pairs** (properties) describing one thing, written with curly braces: `{ name: "Wanjiku", phone: "0712345678" }`.
:::

```try-javascript
const customer = {
  name: "Wanjiku Kamau",
  phone: "0712345678",
  balance: 1250,
  isMember: true,
  orders: ["Unga", "Sugar"],
};

console.log(customer.name);            // dot notation
console.log(customer["phone"]);        // bracket notation
console.log(customer.orders[1]);       // "Sugar"
console.log(customer.email);           // undefined: no such property
```

### Dot vs bracket notation

- **Dot:** `customer.name`, the usual way.
- **Brackets:** `customer["name"]`, needed when the key is in a variable or has spaces/special characters.

```try-javascript
const product = { name: "Speaker", price: 3200, "warranty months": 6 };
const field = "price";
console.log(product[field]);               // 3200
console.log(product["warranty months"]);   // 6
```

### Adding, changing and deleting

```try-javascript
const item = { name: "Phone case", price: 500 };
item.price = 450;             // change
item.colour = "Black";        // add
delete item.colour;           // delete
console.log(item);
console.log("price" in item, "colour" in item);   // true false
```

### Methods: functions inside objects

```try-javascript
const account = {
  owner: "Brian",
  balance: 2000,
  deposit(amount) {
    this.balance += amount;
    return this.balance;
  },
  withdraw(amount) {
    if (amount > this.balance) return "Insufficient balance";
    this.balance -= amount;
    return this.balance;
  },
};

console.log(account.deposit(500));     // 2500
console.log(account.withdraw(3000));   // Insufficient balance
console.log(account.withdraw(1000));   // 1500
```

Inside a method, `this` refers to the object the method was called on (`account`). Arrow functions don't have their own `this`, so use normal method syntax for object methods.

### Looping over objects

```try-javascript
const prices = { unga: 180, sugar: 150, milk: 60 };

for (const key in prices) {
  console.log(key, "costs", prices[key]);
}

console.log(Object.keys(prices));      // ["unga", "sugar", "milk"]
console.log(Object.values(prices));    // [180, 150, 60]
for (const [name, price] of Object.entries(prices)) {
  console.log(`${name}: KSh ${price}`);
}
```

### Objects are copied by reference

```try-javascript
const a = { qty: 1 };
const b = a;          // b points to the SAME object
b.qty = 5;
console.log(a.qty);   // 5 !

const c = { ...a };   // spread: a real (shallow) copy
c.qty = 9;
console.log(a.qty, c.qty);   // 5 9
```

:::think Why did changing b.qty also change a.qty?
Objects (and arrays) are stored by **reference**: `const b = a` copies the address of the object, not the object itself, so both names point to the same data. To get an independent copy, create a new object, e.g. with the spread syntax `{ ...a }` (or `structuredClone(a)` for nested data).
:::

## Putting it together: arrays of objects + functions

```try-javascript
const cart = [
  { name: "Unga 2kg", price: 180, qty: 2 },
  { name: "Cooking oil 1L", price: 320, qty: 1 },
  { name: "Sugar 1kg", price: 150, qty: 3 },
];

function cartTotal(items) {
  let total = 0;
  for (const it of items) total += it.price * it.qty;
  return total;
}

function deliveryFee(total) {
  return total >= 2000 ? 0 : 150;
}

function formatKsh(n) {
  return "KSh " + n.toLocaleString("en-KE");
}

const subtotal = cartTotal(cart);
const fee = deliveryFee(subtotal);
console.log("Subtotal:", formatKsh(subtotal));
console.log("Delivery:", formatKsh(fee));
console.log("Total:", formatKsh(subtotal + fee));
```

Small, named functions working on objects: that's how real applications are structured.

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `()` when calling: `greet` | `greet()` |
| Forgetting `return` | Return the value you need |
| Code after `return` expecting to run | `return` ends the function |
| Arrow function with `{}` but no `return` | Add `return` or remove the braces |
| Using arrow functions as object methods with `this` | Use normal method syntax |
| `obj.key` when the key is in a variable | `obj[key]` |
| Thinking `const b = a` copies an object | Use `{ ...a }` |

## Practice tasks

1. Write `celsiusToFahrenheit(c)` and test it with 0, 25 and 37.
2. Write `isAdult(age)` returning `true`/`false`, and use it in an `if`.
3. Create a `student` object with name, class and an array of marks; add a method `average()`.
4. Write `formatPhone("0712345678")` that returns `"+254 712 345 678"`.
5. Build an array of 3 product objects and a function that returns the names of products under KSh 500.

## Summary

- Functions package reusable code: declare with `function name(params) { ... }` or arrow syntax `(p) => ...`; call with `()`; `return` gives back a value.
- Parameters can have defaults; variables inside functions are local.
- Functions are values: pass them as callbacks.
- Objects group related data as key–value pairs; access with dot or bracket notation; add, change, delete properties; methods use `this`.
- Loop objects with `for...in`, `Object.keys`, `Object.values`, `Object.entries`.
- Objects and arrays are copied by reference; spread `{ ...obj }` makes a copy.

```quiz
Q: What keyword sends a value back from a function?
A: return
Q: What does a function return if it has no return statement?
A: undefined
Q: In function greet(name), what is name called?
A: parameter | a parameter
Q: Write the arrow function that doubles n (shortest form).
A: (n) => n * 2 | n => n * 2 | n=>n*2 | (n)=>n*2
Q: Which notation must you use when an object key is stored in a variable? (dot or bracket)
A: bracket | brackets
Q: Which method gives an array of an object's keys?
A: Object.keys | Object.keys()
Q: Inside an object method, which keyword refers to the object?
A: this
```
=== exercise ===
Write a function `double(n)` that returns `n * 2`, then print `double(21)`. The output should be **42**.
=== starter ===
function double(n) {
  
}

console.log(double(21));
=== expected ===
42
=== must_contain ===
