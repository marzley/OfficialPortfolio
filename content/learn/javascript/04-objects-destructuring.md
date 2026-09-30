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
