---
slug: loops-arrays
title: "Arrays and loops: storing lists of data and repeating actions"
after: KEEP
---
# Arrays and loops: storing lists of data and repeating actions

Real programs work with **lists**: products in a shop, students in a class, transactions in a statement, messages in a chat. JavaScript stores lists in **arrays**, and processes them with **loops** that repeat an action for every item. Together, arrays and loops let a few lines of code handle ten items or ten million. This unit covers arrays and every common loop in depth, with Kenyan examples.

:::note What you will learn
- Creating arrays, indexes and `length`
- Reading, changing, adding and removing items
- `for`, `for...of`, `while`, `do...while` and `forEach`
- `break` and `continue`
- Totals, counting, finding the largest, filtering with loops
- Arrays of objects (preview), nested loops and avoiding infinite loops
:::

## What is an array?

:::define Array
An ordered list of values stored in one variable, written with square brackets: `["Unga", "Sugar", "Milk"]`. Each item has a numbered position called an **index**, starting at **0**.
:::

```try-javascript
const items = ["Unga", "Sugar", "Milk", "Bread"];

console.log(items);          // the whole array
console.log(items[0]);       // "Unga"  (first item is index 0)
console.log(items[2]);       // "Milk"
console.log(items.length);   // 4
console.log(items[items.length - 1]);   // "Bread" (last item)
console.log(items.at(-1));   // "Bread" (modern way to get the last item)
console.log(items[10]);      // undefined (no item there)
```

Why zero-based? The index means "how many steps from the start": the first item is 0 steps away.

Arrays can hold any type, even mixed: `[180, "Unga", true]`, but usually one kind of data per array.

## Changing arrays

```try-javascript
const cart = ["Unga", "Sugar"];

cart.push("Milk");          // add to the end
cart.unshift("Bread");      // add to the start
console.log(cart);          // ["Bread", "Unga", "Sugar", "Milk"]

const last = cart.pop();    // remove from the end (returns it)
const first = cart.shift(); // remove from the start
console.log(last, first, cart);

cart[0] = "Unga 2kg";       // replace by index
console.log(cart);

console.log(cart.includes("Sugar"));   // true
console.log(cart.indexOf("Sugar"));    // 1 (or -1 if not found)

cart.splice(1, 1);          // at index 1, remove 1 item
console.log(cart);
```

| Method | Does |
|---|---|
| `push(x)` | Add to end |
| `pop()` | Remove from end |
| `unshift(x)` | Add to start |
| `shift()` | Remove from start |
| `splice(i, n, ...new)` | Remove/insert at any position |
| `includes(x)` | Is it in the array? |
| `indexOf(x)` | Position, or -1 |
| `slice(a, b)` | Copy part (doesn't change the original) |
| `join(", ")` | Turn into a string |
| `concat(other)` or `[...a, ...b]` | Combine arrays |

:::tip const arrays can still change
`const cart = []` means the variable `cart` always points to the **same array**, but you can still push and pop items inside it. You just can't do `cart = somethingElse`.
:::

## Why loops?

Printing four items one by one is fine. Printing 500 products isn't. A **loop** repeats code for each item or until a condition is met.

## The `for` loop

```try-javascript
for (let i = 0; i < 5; i++) {
  console.log("Count:", i);
}
```

```
for (let i = 0;   i < 5;   i++)
     │            │        │
     start        keep going while true    after each round
```

1. `let i = 0` runs once at the start.
2. Before each round, `i < 5` is checked; if false, the loop ends.
3. The body runs.
4. `i++` (add 1) runs, then back to step 2.

Looping through an array by index:

```try-javascript
const students = ["Amina", "Brian", "Chebet", "David"];
for (let i = 0; i < students.length; i++) {
  console.log(`${i + 1}. ${students[i]}`);
}
```

## `for...of`: the simplest way to loop through items

```try-javascript
const prices = [180, 150, 60, 65];
let total = 0;
for (const price of prices) {
  total += price;            // same as total = total + price
}
console.log("Total: KSh", total);
```

Use `for...of` when you need each **value**; use a classic `for` when you need the **index** too (or `for (const [i, v] of arr.entries())`).

## `forEach`

An array method that runs a function for every item:

```try-javascript
const towns = ["Nairobi", "Mombasa", "Kisumu"];
towns.forEach((town, index) => {
  console.log(index, town.toUpperCase());
});
```

`forEach` can't be stopped early with `break`; use `for...of` if you need that.

## `while` and `do...while`

`while` repeats **as long as** a condition is true, useful when you don't know how many rounds you'll need:

```try-javascript
// How many months to save KSh 50,000 if you save KSh 4,500 a month?
let saved = 0;
let months = 0;
while (saved < 50000) {
  saved += 4500;
  months++;
}
console.log(`${months} months (saved KSh ${saved})`);
```

`do...while` runs the body **at least once**, then checks:

```try-javascript
let attempts = 0;
do {
  attempts++;
  console.log("Attempt", attempts);
} while (attempts < 3);
```

### Infinite loops

If the condition never becomes false, the loop never ends and the page freezes:

```
let i = 0;
while (i < 5) {
  console.log(i);
  // forgot i++ : infinite loop!
}
```

Always make sure something inside the loop moves it towards ending.

## `break` and `continue`

- `break` stops the loop completely.
- `continue` skips to the next round.

```try-javascript
const balances = [1200, 0, 540, -300, 980];
for (const b of balances) {
  if (b === 0) continue;               // skip empty accounts
  if (b < 0) { console.log("Negative balance found, stopping"); break; }
  console.log("Balance:", b);
}
```

## Common loop patterns

### Sum and average

```try-javascript
const marks = [78, 65, 90, 54, 82];
let sum = 0;
for (const m of marks) sum += m;
const average = sum / marks.length;
console.log("Average:", average.toFixed(1));
```

### Counting

```try-javascript
const votes = ["Yes", "No", "Yes", "Yes", "No", "Yes"];
let yes = 0;
for (const v of votes) {
  if (v === "Yes") yes++;
}
console.log(`Yes: ${yes}, No: ${votes.length - yes}`);
```

### Finding the largest

```try-javascript
const sales = [3400, 12000, 7800, 15200, 9100];
let best = sales[0];
for (const s of sales) {
  if (s > best) best = s;
}
console.log("Best day: KSh", best);
console.log("Also:", Math.max(...sales));   // built-in shortcut
```

### Building a new array (filtering by hand)

```try-javascript
const products = [180, 1500, 60, 2300, 450];
const expensive = [];
for (const p of products) {
  if (p > 1000) expensive.push(p);
}
console.log(expensive);
```

The next units show `filter`, `map` and `reduce`, which do these jobs in one line.

## Arrays of objects (preview)

Real data is usually a list of **objects**:

```try-javascript
const cart = [
  { name: "Unga 2kg", price: 180, qty: 2 },
  { name: "Sugar 1kg", price: 150, qty: 1 },
  { name: "Milk 500ml", price: 60, qty: 4 },
];

let total = 0;
for (const item of cart) {
  const line = item.price * item.qty;
  console.log(`${item.name.padEnd(12)} x${item.qty}  KSh ${line}`);
  total += line;
}
console.log("TOTAL".padEnd(16), "KSh", total);
```

## Nested loops

A loop inside a loop, e.g. a multiplication table or rows and columns:

```try-javascript
for (let row = 1; row <= 3; row++) {
  let line = "";
  for (let col = 1; col <= 5; col++) {
    line += String(row * col).padStart(4);
  }
  console.log(line);
}
```

Nested loops multiply the work (100 × 100 = 10,000 rounds), so be careful with large data.

:::think You loop through 47 counties and, for each county, loop through 47 counties again to compare them. How many rounds run in total?
47 × 47 = 2,209 rounds. That's fine for a computer, but the same pattern with 100,000 records would be 10 billion rounds, which is far too slow. That's why programmers learn better approaches (objects/maps for lookups, sorting) for large data.
:::

## Choosing a loop

| Need | Use |
|---|---|
| Each item's value | `for...of` |
| Index and value | `for` or `arr.entries()` |
| Run a function per item, no early stop | `forEach` |
| Unknown number of rounds | `while` |
| Run at least once | `do...while` |
| Transform/filter/total | `map`, `filter`, `reduce` (next units) |

## Common mistakes

| Mistake | Fix |
|---|---|
| Starting at index 1 | Arrays start at 0 |
| `i <= arr.length` | `i < arr.length` (last index is length − 1) |
| Forgetting to change the loop variable | Avoid infinite loops |
| Modifying an array while looping it with indexes | Build a new array instead |
| Using `for...in` on arrays | `for...in` is for object keys; use `for...of` |

## Practice tasks

1. Store 5 Kenyan towns in an array; print each with its position number.
2. Calculate the total and average of a week's sales.
3. Count how many students passed (50+) from an array of marks.
4. Find the cheapest product in a price array without `Math.min`.
5. Print a 1–10 multiplication table for the number 7 using a loop.

## Summary

- Arrays store ordered lists; indexes start at 0; `length` gives the count.
- Change arrays with `push`, `pop`, `shift`, `unshift`, `splice`; check with `includes`/`indexOf`.
- Loops: `for` (index), `for...of` (values), `forEach`, `while`, `do...while`; `break` stops, `continue` skips.
- Common patterns: sum, average, count, largest, building filtered arrays.
- Avoid infinite loops and off-by-one errors.

```quiz
Q: What is the index of the first item in an array?
A: 0 | zero
Q: Which property gives the number of items in an array?
A: length
Q: Which method adds an item to the end of an array?
A: push | push()
Q: Which method removes the last item?
A: pop | pop()
Q: Which loop is simplest for reading each value of an array? (for...?)
A: for...of | for of
Q: Which keyword skips to the next round of a loop?
A: continue
Q: An array has 6 items. What is the index of the last one?
A: 5
```
=== exercise ===
Use a loop (or `reduce`) to add up the numbers in `nums` and print the total. It should be **100**.
=== starter ===
const nums = [10, 20, 30, 40];
=== expected ===
100
=== must_contain ===
