---
slug: array-methods
title: Array methods: map, filter, reduce, find and sort
after: loops-arrays
---
# Array methods: map, filter, reduce, find and sort

Loops work, but modern JavaScript uses **array methods** that say *what* you want instead of *how* to loop. They make code shorter and easier to read. Each takes a small function (often an arrow function) that runs for every item.

## Arrow functions in one minute

```javascript
function double(n) { return n * 2; }   // normal function
const double2 = (n) => n * 2;           // arrow function, same thing
const add = (a, b) => a + b;
```

## Our sample data

```try-javascript
const products = [
  { name: "Unga 2kg", price: 180, category: "food", stock: 12 },
  { name: "Sugar 1kg", price: 160, category: "food", stock: 0 },
  { name: "Soap bar", price: 60, category: "home", stock: 30 },
  { name: "Cooking oil 1L", price: 350, category: "food", stock: 7 },
  { name: "Matchbox", price: 10, category: "home", stock: 100 },
];

// forEach: do something with each item (returns nothing)
products.forEach((p) => console.log(p.name, "- KSh", p.price));
```

## map: transform every item into a new array

```try-javascript
const prices = [180, 160, 60, 350];
const withVat = prices.map((p) => Math.round(p * 1.16));
console.log(withVat); // [209, 186, 70, 406]

const names = ["amina", "otieno", "kiprop"];
console.log(names.map((n) => n[0].toUpperCase() + n.slice(1)));
```

`map` always returns an array of the **same length**.

## filter: keep only matching items

```try-javascript
const products = [
  { name: "Unga 2kg", price: 180, stock: 12 },
  { name: "Sugar 1kg", price: 160, stock: 0 },
  { name: "Cooking oil 1L", price: 350, stock: 7 },
];
const inStock = products.filter((p) => p.stock > 0);
console.log(inStock.map((p) => p.name));        // ["Unga 2kg", "Cooking oil 1L"]
const cheap = products.filter((p) => p.price < 200);
console.log(cheap.length);                       // 2
```

## reduce: boil an array down to one value

```try-javascript
const cart = [
  { item: "Unga", price: 180, qty: 2 },
  { item: "Oil", price: 350, qty: 1 },
  { item: "Soap", price: 60, qty: 3 },
];
const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);
console.log("Total: KSh", total);  // 890
```

`reduce((accumulator, item) => ..., startValue)`: the accumulator carries the running result. Always give a start value (here `0`).

## find, findIndex, some, every, includes

```try-javascript
const users = [
  { id: 1, name: "Wanjiku", paid: true },
  { id: 2, name: "Omondi", paid: false },
  { id: 3, name: "Chebet", paid: true },
];
console.log(users.find((u) => u.id === 2));          // the Omondi object
console.log(users.findIndex((u) => u.name === "Chebet")); // 2
console.log(users.some((u) => !u.paid));             // true: someone hasn't paid
console.log(users.every((u) => u.paid));             // false
console.log(["M-Pesa", "Card"].includes("Card"));    // true
```

## sort (careful!)

```try-javascript
const nums = [100, 25, 3, 1000];
console.log([...nums].sort());               // [100, 1000, 25, 3]  sorted as TEXT!
console.log([...nums].sort((a, b) => a - b)); // [3, 25, 100, 1000]  lowest first
console.log([...nums].sort((a, b) => b - a)); // highest first

const people = [{ n: "Zawadi", age: 31 }, { n: "Baraka", age: 22 }];
people.sort((a, b) => a.n.localeCompare(b.n));  // alphabetical
console.log(people.map((p) => p.n));
```

> `sort` changes the original array. Copy it first with `[...array]` if you need to keep the original order.

## Chaining: combine methods

```try-javascript
const sales = [
  { agent: "Achieng", amount: 1200, month: "Jan" },
  { agent: "Kamau", amount: 800, month: "Jan" },
  { agent: "Achieng", amount: 2300, month: "Feb" },
  { agent: "Kamau", amount: 400, month: "Feb" },
];
const achiengTotal = sales
  .filter((s) => s.agent === "Achieng")
  .map((s) => s.amount)
  .reduce((a, b) => a + b, 0);
console.log("Achieng sold KSh", achiengTotal); // 3500
```

## Cheat sheet

| Method | Returns | Use it to |
|---|---|---|
| `map` | New array, same length | Transform each item |
| `filter` | New array, maybe shorter | Keep matching items |
| `reduce` | One value | Totals, counts, grouping |
| `find` | First match or `undefined` | Look up one item |
| `some` / `every` | `true` / `false` | Check a condition |
| `sort` | The same array, sorted | Order items |
| `slice` | A copy of part | Pagination, top 3 |
| `includes` | `true` / `false` | Is a value in the list? |

```quiz
Q: Which method creates a new array by transforming every item?
A: map | map()
Q: Which method keeps only the items that pass a test?
A: filter | filter()
Q: Which method turns an array into a single value like a total?
A: reduce | reduce()
Q: What does [10, 9, 100].sort() give first: 10 or 9 or 100?
A: 10
H: Without a compare function, sort compares as text.
Q: Which method returns the first item that matches?
A: find | find()
```
=== exercise ===
Use `reduce` to add up the array `[180, 350, 60]` and log the total. The output should be **590**.
=== starter ===
const prices = [180, 350, 60];
// use reduce
=== expected ===
590
=== must_contain ===
reduce
