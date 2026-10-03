---
slug: objects-destructuring
title: Objects in depth: destructuring, spread and JSON
after: functions-objects
---
# Objects in depth: destructuring, spread and JSON

Real data (a customer, an order, an API response) is almost always an **object**, often with arrays and objects inside it. These modern tools make working with it much easier.

## Creating and reading objects

```try-javascript
const order = {
  id: "ORD-1042",
  customer: { name: "Faith Njoki", phone: "0712345678" },
  items: [
    { name: "Cake 1kg", price: 1800 },
    { name: "Candles", price: 150 },
  ],
  paid: false,
};

console.log(order.customer.name);          // dot notation
console.log(order["id"]);                  // bracket notation
const field = "paid";
console.log(order[field]);                 // brackets with a variable
console.log(order.items[1].name);          // "Candles"
console.log(order.delivery?.town);         // undefined (optional chaining: no crash)
```

`?.` (**optional chaining**) stops and returns `undefined` if something in the chain is missing, instead of throwing an error.

## Adding, changing and deleting

```try-javascript
const user = { name: "Brian" };
user.town = "Kisii";          // add
user.name = "Brian K.";       // change
delete user.town;             // remove
console.log(user);
console.log("name" in user, Object.keys(user), Object.values(user));

for (const [key, value] of Object.entries({ a: 1, b: 2 })) {
  console.log(key, "=", value);
}
```

## Shorthand properties and methods

```try-javascript
const name = "Tumaini", age = 19;
const student = {
  name,          // same as name: name
  age,
  greet() {      // a method
    return `Hi, I'm ${this.name}`;
  },
};
console.log(student.greet());
```

## Destructuring: unpack values into variables

```try-javascript
const customer = { name: "Faith", phone: "0712345678", town: "Thika" };
const { name, town } = customer;
console.log(name, town);

const { phone: mobile, country = "Kenya" } = customer;   // rename + default
console.log(mobile, country);

const [first, second, ...others] = ["Gold", "Silver", "Bronze", "4th", "5th"];
console.log(first, second, others);

// In function parameters: very common
function receipt({ name, amount }) {
  return `${name} paid KSh ${amount}`;
}
console.log(receipt({ name: "Otieno", amount: 500, method: "M-Pesa" }));
```

## Spread and rest: copy and merge

```try-javascript
const base = { size: "M", colour: "black" };
const shirt = { ...base, colour: "red", price: 800 };   // copy, then override
console.log(shirt);

const a = [1, 2], b = [3, 4];
const all = [...a, ...b, 5];
console.log(all);

function sum(...nums) { return nums.reduce((x, y) => x + y, 0); }  // rest parameter
console.log(sum(10, 20, 30));
```

> Spread makes a **shallow** copy: nested objects are still shared. For a full deep copy use `structuredClone(obj)`.

## References: a common surprise

```try-javascript
const a = { score: 1 };
const b = a;          // NOT a copy: both names point to the same object
b.score = 99;
console.log(a.score); // 99

const c = { ...a };   // a real (shallow) copy
c.score = 5;
console.log(a.score, c.score); // 99 5
```

## JSON: objects as text

**JSON** is how data travels between a website and a server, and how it's stored in files and `localStorage`.

```try-javascript
const cart = { items: ["Unga", "Oil"], total: 530, paid: false };
const text = JSON.stringify(cart);
console.log(text, typeof text);                 // a string

const back = JSON.parse(text);
console.log(back.items[0], typeof back);        // "Unga" object

console.log(JSON.stringify(cart, null, 2));     // pretty printed
```

JSON rules: keys in **double quotes**, no trailing commas, no functions, no comments.

## Why objects are everywhere

In JavaScript, nearly all real data is an object: a user, a product, an order, an API response, the settings of a chart, even DOM elements. Destructuring and spread are not just shortcuts; they are how modern code (React, Vue, Node APIs) reads and updates data every day. If you can confidently unpack, copy and merge objects, you can read most modern JavaScript code.

## Looping over objects

```try-javascript
const stock = { unga: 40, sugar: 25, rice: 0, oil: 12 };

for (const [item, qty] of Object.entries(stock)) {
  console.log(`${item.padEnd(6)} ${qty}`);
}
console.log(Object.keys(stock));
console.log(Object.values(stock).reduce((a, b) => a + b, 0), "items in total");

const outOfStock = Object.entries(stock).filter(([, qty]) => qty === 0).map(([item]) => item);
console.log("Out of stock:", outOfStock);

// build an object back from entries
const doubled = Object.fromEntries(Object.entries(stock).map(([k, v]) => [k, v * 2]));
console.log(doubled);
```

## Grouping data

```try-javascript
const orders = [
  { id: 1, town: "Nakuru", total: 1200 },
  { id: 2, town: "Thika", total: 540 },
  { id: 3, town: "Nakuru", total: 860 },
];
const byTown = {};
for (const o of orders) {
  byTown[o.town] ??= [];          // create the array if missing
  byTown[o.town].push(o);
}
console.log(Object.keys(byTown));
const totals = Object.fromEntries(
  Object.entries(byTown).map(([town, list]) => [town, list.reduce((s, o) => s + o.total, 0)])
);
console.log(totals);
```

Newer runtimes also have `Object.groupBy(orders, o => o.town)`, which does the grouping in one call.

## Destructuring function parameters

Functions with many options read better when they take one object:

```try-javascript
function createInvoice({ customer, items, vatRate = 0.16, currency = "KSh" }) {
  const subtotal = items.reduce((s, { price, qty = 1 }) => s + price * qty, 0);
  const vat = subtotal * vatRate;
  return `${customer}: ${currency} ${(subtotal + vat).toFixed(2)} (VAT ${vat.toFixed(2)})`;
}
console.log(createInvoice({ customer: "Kamau Hardware", items: [{ price: 1500, qty: 2 }, { price: 400 }] }));
console.log(createInvoice({ customer: "School", items: [{ price: 1000 }], vatRate: 0 }));
```

The order of options no longer matters, and defaults are clear. React components receive their props exactly this way.

## Renaming and nested destructuring

```try-javascript
const response = {
  status: "ok",
  data: { user: { id: 7, full_name: "Achieng Odhiambo", contacts: { phone: "0712345678" } } },
};
const {
  data: { user: { full_name: name, contacts: { phone }, email = "not provided" } },
} = response;
console.log(name, phone, email);
```

Use this carefully: very deep destructuring is hard to read and crashes if a level is missing. Optional chaining (`response.data?.user?.email`) is safer for unreliable data.

## Updating objects immutably

Frameworks like React expect you to create **new** objects instead of changing old ones. Spread makes that easy:

```try-javascript
const cart = { customer: "Juma", items: [{ name: "Milk", qty: 1 }], coupon: null };

const withCoupon = { ...cart, coupon: "KARIBU10" };
const moreMilk = {
  ...cart,
  items: cart.items.map(i => (i.name === "Milk" ? { ...i, qty: i.qty + 1 } : i)),
};
const { coupon, ...withoutCoupon } = withCoupon;       // remove a key

console.log(cart.items[0].qty, moreMilk.items[0].qty); // 1 2: original unchanged
console.log(withoutCoupon);
```

## Shallow vs deep copies

```try-javascript
const original = { name: "Plan A", features: ["SSL", "Email"] };
const shallow = { ...original };
shallow.features.push("Backups");                // changes the shared inner array!
console.log(original.features);

const deep = structuredClone(original);
deep.features.push("CDN");
console.log(original.features, deep.features);
```

Spread copies only the top level. Nested arrays and objects are still shared, so use `structuredClone` when you need an independent copy.

## Comparing objects

```try-javascript
const a = { id: 1 };
const b = { id: 1 };
console.log(a === b);                                  // false: different objects
console.log(a === a);                                  // true: same object
console.log(JSON.stringify(a) === JSON.stringify(b));  // true (simple cases only)
```

`===` compares references, not contents. For real apps, compare the fields that matter (usually an `id`).

## Maps for dynamic keys

When keys come from users or data (phone numbers, product codes), a `Map` is often better than an object:

```try-javascript
const balances = new Map();
balances.set("0712345678", 1500);
balances.set("0722000111", 300);
balances.set("0712345678", balances.get("0712345678") + 200);
console.log(balances.size, balances.get("0712345678"));
for (const [phone, bal] of balances) console.log(phone, bal);
console.log(balances.has("0799999999"));
```

Maps keep insertion order, allow any key type and have a `.size`.

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `const { name } = undefined` | TypeError | Default: `const { name } = data ?? {}` |
| Expecting spread to deep copy | Nested data shared | `structuredClone` |
| `obj.length` | Objects don't have length | `Object.keys(obj).length` |
| `JSON.stringify` with dates | Dates become strings | Convert back with `new Date(str)` after parsing |
| Using `for...in` on arrays | Iterates keys as strings and inherited props | `for...of` or array methods |

## Practice

1. Given an array of students `{ name, class, fee_balance }`, group them by class and total the balances per class.
2. Write `updateQty(cart, name, qty)` that returns a new cart without changing the old one.
3. Destructure `{ title, price, seller: { name: sellerName } }` from a product object with a default price of 0.
4. Convert `{ unga: 180, sugar: 210 }` into `[{ item: "unga", price: 180 }, ...]` and back.

:::think A React-style app updates `state.items.push(newItem)` and the screen doesn't refresh. Why might creating a new array fix it?
Many frameworks detect changes by comparing references. `push` changes the existing array, so the reference stays the same and the framework thinks nothing changed. `setItems([...items, newItem])` creates a new array with a new reference, which signals the update.
:::

```quiz
Q: Which operator reads a nested property safely without crashing if it is missing?
A: ?. | optional chaining
Q: What do the three dots ... do in { ...base }?
A: spread | copy | spread operator | copies
Q: Which function turns an object into a JSON string?
A: JSON.stringify | stringify
Q: If b = a (an object) and you change b.score, does a.score change? (yes or no)
A: yes
Q: Which function makes a full deep copy of an object?
A: structuredClone | structuredClone()
Q: Which method turns an object into an array of [key, value] pairs?
A: Object.entries | entries
Q: Which function makes a deep copy of an object?
A: structuredClone | structuredClone()
Q: Which built-in collection has a .size and allows any type of key?
A: Map
```
=== exercise ===
Use destructuring to get `name` and `town` from `customer`, then log them so the output is **Faith Thika**.
=== starter ===
const customer = { name: "Faith", town: "Thika", phone: "0712345678" };
// destructure here
=== expected ===
Faith Thika
=== must_contain ===
const {
