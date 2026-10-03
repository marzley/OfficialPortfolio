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

## Why array methods matter

Lists are the most common data in apps: products, orders, students, transactions, search results, chat messages. Array methods let you transform, filter and summarise lists in clear, short code instead of long `for` loops with counters. They are used everywhere in modern JavaScript, and React displays lists almost entirely with `map`. Interviewers often ask candidates to solve small problems with `map`, `filter` and `reduce`.

## Choosing the right method

| You want to... | Use | Returns |
|---|---|---|
| Change every item | `map` | New array, same length |
| Keep some items | `filter` | New array, same or shorter |
| Get one value (total, max, object) | `reduce` | Anything |
| Get the first match | `find` / `findIndex` | Item or `undefined` / index or -1 |
| Get the last match | `findLast` / `findLastIndex` | Item / index |
| Ask "any?" / "all?" | `some` / `every` | true/false |
| Just do something with each | `forEach` | `undefined` |
| Flatten nested lists | `flat` / `flatMap` | New array |

## reduce in depth

`reduce` can build any result, not just numbers:

```try-javascript
const sales = [
  { town: "Nakuru", product: "Unga", amount: 1800 },
  { town: "Thika", product: "Sugar", amount: 840 },
  { town: "Nakuru", product: "Oil", amount: 1400 },
  { town: "Eldoret", product: "Unga", amount: 900 },
];

const totalsByTown = sales.reduce((acc, s) => {
  acc[s.town] = (acc[s.town] ?? 0) + s.amount;
  return acc;
}, {});
console.log(totalsByTown);

const biggest = sales.reduce((best, s) => (s.amount > best.amount ? s : best));
console.log("Biggest sale:", biggest);

const stats = sales.reduce(
  (acc, s) => ({ count: acc.count + 1, sum: acc.sum + s.amount }),
  { count: 0, sum: 0 }
);
console.log(`Average sale: KSh ${(stats.sum / stats.count).toFixed(0)}`);
```

Always give `reduce` a **starting value** (the second argument). Without it, an empty array throws an error, and the first item is used as the accumulator, which causes bugs when items are objects.

## Copying vs changing the original

Some methods change (mutate) the original array; others return a new one:

| Changes the original | Returns a new array |
|---|---|
| `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill` | `map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`, `toSpliced`, `with` |

```try-javascript
const marks = [67, 82, 45, 90];
const sorted = marks.toSorted((a, b) => b - a);   // new array, original untouched
console.log(marks, sorted);
const copy = [...marks].sort((a, b) => a - b);    // older way: copy first, then sort
console.log(copy);
const updated = marks.with(2, 50);                // replace index 2 in a copy
console.log(updated, marks);
```

In frameworks like React, prefer the non-mutating versions so changes are detected.

## Sorting objects by several fields

```try-javascript
const students = [
  { name: "Wanjiru", form: 2, mean: 71.5 },
  { name: "Otieno", form: 1, mean: 80.2 },
  { name: "Akinyi", form: 2, mean: 84.0 },
  { name: "Baraka", form: 1, mean: 80.2 },
];
const ordered = students.toSorted(
  (a, b) => a.form - b.form || b.mean - a.mean || a.name.localeCompare(b.name)
);
ordered.forEach(s => console.log(`Form ${s.form}  ${s.name.padEnd(8)} ${s.mean}`));
```

The `||` chain means: sort by form; if equal, by mean (highest first); if still equal, by name.

## flat, flatMap and Array.from

```try-javascript
const orders = [
  { id: 1, items: ["Unga", "Oil"] },
  { id: 2, items: ["Sugar"] },
  { id: 3, items: ["Unga", "Salt", "Tea"] },
];
const allItems = orders.flatMap(o => o.items);
console.log(allItems);
console.log([...new Set(allItems)]);                     // unique items

console.log([[1, 2], [3, [4, 5]]].flat(2));              // [1, 2, 3, 4, 5]
console.log(Array.from({ length: 5 }, (_, i) => (i + 1) * 100));  // [100, 200, 300, 400, 500]
console.log(Array.from("KENYA"));
```

## Pagination and top-N

```try-javascript
const items = Array.from({ length: 23 }, (_, i) => `Product ${i + 1}`);
const perPage = 10;
const pages = Math.ceil(items.length / perPage);
for (let page = 1; page <= pages; page++) {
  const slice = items.slice((page - 1) * perPage, page * perPage);
  console.log(`Page ${page}/${pages}:`, slice[0], "...", slice.at(-1));
}
```

`at(-1)` gets the last item, which is neater than `arr[arr.length - 1]`.

## A complete data task: a sales report

```try-javascript
const transactions = [
  { date: "2026-09-01", type: "sale", amount: 2500, method: "mpesa" },
  { date: "2026-09-01", type: "refund", amount: 300, method: "mpesa" },
  { date: "2026-09-02", type: "sale", amount: 1200, method: "cash" },
  { date: "2026-09-02", type: "sale", amount: 4100, method: "mpesa" },
  { date: "2026-09-03", type: "sale", amount: 650, method: "card" },
];
const sales = transactions.filter(t => t.type === "sale");
const refunds = transactions.filter(t => t.type === "refund");
const sum = list => list.reduce((s, t) => s + t.amount, 0);
const byMethod = Object.groupBy
  ? Object.groupBy(sales, t => t.method)
  : sales.reduce((acc, t) => ((acc[t.method] ??= []).push(t), acc), {});

console.log("Gross sales:", sum(sales));
console.log("Refunds:", sum(refunds));
console.log("Net:", sum(sales) - sum(refunds));
for (const [method, list] of Object.entries(byMethod)) {
  console.log(`  ${method.padEnd(6)} ${String(list.length).padStart(2)} sales  KSh ${sum(list)}`);
}
console.log("Any sale above 4,000?", sales.some(t => t.amount > 4000));
console.log("All amounts positive?", transactions.every(t => t.amount > 0));
```

## Performance notes

- Chaining `filter().map()` loops twice; that's fine for hundreds or thousands of items. For huge arrays in hot code, a single `reduce` or `for` loop can be faster.
- `includes` and `find` scan the whole array. For repeated lookups by id, build a `Map` once: `new Map(products.map(p => [p.id, p]))`.
- Avoid `forEach` with `async` callbacks: it doesn't wait. Use `for...of` with `await`, or `Promise.all(items.map(async ...))`.

## Common mistakes

| Mistake | Result | Fix |
|---|---|---|
| Forgetting `return` in a `{}` arrow | `map` gives `[undefined, ...]` | `x => x * 2` or `x => { return x * 2; }` |
| Returning an object from an arrow without brackets | `x => { name: x }` returns undefined | `x => ({ name: x })` |
| `sort()` on numbers without a compare function | Sorted as text | `sort((a, b) => a - b)` |
| `reduce` without a starting value | Errors on empty arrays | Always pass one |
| Using `map` just to loop | Wasted new array | `forEach` or `for...of` |

## Practice

1. From the products list, get the names of in-stock food items sorted by price.
2. Calculate the total stock value (`price * stock`) with `reduce`.
3. Find the most expensive product in each category.
4. Turn `["Nairobi", "Mombasa", "Kisumu"]` into `[{ id: 1, town: "Nairobi" }, ...]`.
5. Given an array of words, count how many times each appears.

:::think Why does `[1, 2, 3].map(n => { n * 2 })` give `[undefined, undefined, undefined]`?
Curly braces after `=>` start a function body, and a body needs an explicit `return`. Without it the function returns undefined. Use the short form `n => n * 2` or write `{ return n * 2; }`.
:::

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
Q: Which method returns a sorted copy without changing the original array?
A: toSorted | toSorted()
Q: Which method maps each item to an array and flattens the result one level?
A: flatMap | flatMap()
Q: Which method gets the last item using a negative index?
A: at | at(-1)
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
