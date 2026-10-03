---
slug: classes-oop
title: Classes and object-oriented JavaScript
after: local-storage
---
# Classes and object-oriented JavaScript

When your program has many similar things (products, customers, bank accounts), a **class** is a blueprint for making them. Each object made from a class is called an **instance**, and it bundles data (properties) with behaviour (methods).

## Your first class

```try-javascript
class Product {
  constructor(name, price, stock = 0) {
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
  inStock() {
    return this.stock > 0;
  }
  sell(qty) {
    if (qty > this.stock) return `Only ${this.stock} ${this.name} left`;
    this.stock -= qty;
    return `Sold ${qty} ${this.name} for KSh ${qty * this.price}`;
  }
}

const unga = new Product("Unga 2kg", 180, 10);
const sugar = new Product("Sugar 1kg", 160);
console.log(unga.sell(3));
console.log(unga.stock, unga.inStock(), sugar.inStock());
console.log(sugar.sell(1));
```

- `constructor` runs when you write `new Product(...)`. It sets up the object.
- `this` means "the object this method belongs to".
- Methods are functions written inside the class.

## Getters, setters and private fields

```try-javascript
class Account {
  #balance = 0;                 // # makes it private: only the class can see it
  constructor(owner) { this.owner = owner; }

  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.#balance += amount;
    return this;                // returning this allows chaining
  }
  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    return this;
  }
  get balance() { return `KSh ${this.#balance.toLocaleString()}`; }  // read like a property
}

const acc = new Account("Mercy");
acc.deposit(5000).withdraw(1200);
console.log(acc.owner, acc.balance);
try { acc.withdraw(99999); } catch (e) { console.log(e.message); }
```

Private fields (`#balance`) protect data from being changed by accident: `acc.#balance = 1000000` outside the class is a syntax error.

## Static members

`static` methods belong to the class itself, not to each object. Useful for helpers and counters.

```try-javascript
class Receipt {
  static count = 0;
  constructor(amount) {
    Receipt.count++;
    this.code = Receipt.makeCode();
    this.amount = amount;
  }
  static makeCode() {
    return "RC" + String(Receipt.count).padStart(5, "0");
  }
}
new Receipt(100); new Receipt(250);
const r = new Receipt(900);
console.log(r.code, "total receipts:", Receipt.count);
```

## Inheritance: extends and super

A class can **extend** another, reusing everything and adding or changing behaviour.

```try-javascript
class Employee {
  constructor(name, salary) { this.name = name; this.salary = salary; }
  monthlyPay() { return this.salary; }
  describe() { return `${this.name} earns KSh ${this.monthlyPay().toLocaleString()} a month`; }
}

class SalesAgent extends Employee {
  constructor(name, salary, sales) {
    super(name, salary);          // run the parent constructor first
    this.sales = sales;
  }
  monthlyPay() {                  // override: add 5% commission
    return super.monthlyPay() + this.sales * 0.05;
  }
}

const staff = [new Employee("Njoroge", 40000), new SalesAgent("Adhiambo", 25000, 400000)];
staff.forEach((s) => console.log(s.describe()));
console.log(staff[1] instanceof Employee);  // true
```

Both objects answer `describe()`, but each calculates pay its own way. This is called **polymorphism**.

## When to use classes

| Use a class when... | A plain object is fine when... |
|---|---|
| You make many objects of the same kind | You have one settings object |
| Data and the functions that change it belong together | It's just data (e.g. from JSON) |
| You want private data and clear rules | You don't need methods |

## Who uses classes, and why

Classes organise code around **things** in your program: a `Product`, a `Cart`, a `Student`, an `Invoice`. Each class bundles data (fields) with the actions that belong to that data (methods). You'll meet classes in Node.js back ends, game development, browser APIs (`new Date()`, `new Map()`, `new URL()`), testing libraries and older React code. Even if you prefer plain functions, you must be able to read and write classes.

## Four ideas of object-oriented programming

| Idea | Meaning | Example |
|---|---|---|
| **Encapsulation** | Keep data and the rules that protect it together | A `Wallet` with a private balance that can only change through deposit/withdraw |
| **Abstraction** | Hide details behind simple methods | `cart.checkout()` hides payment steps |
| **Inheritance** | Build a special version of a class | `MpesaPayment extends Payment` |
| **Polymorphism** | Different classes respond to the same method in their own way | Every payment type has `pay()` |

## A complete example: a shop cart

```try-javascript
class Product {
  constructor(id, name, price) {
    if (price < 0) throw new Error("Price cannot be negative");
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class Cart {
  #lines = new Map();                  // private: id -> { product, qty }

  add(product, qty = 1) {
    const line = this.#lines.get(product.id);
    if (line) line.qty += qty;
    else this.#lines.set(product.id, { product, qty });
    return this;                        // allows chaining
  }
  remove(id) { this.#lines.delete(id); return this; }
  get count() { return [...this.#lines.values()].reduce((s, l) => s + l.qty, 0); }
  get subtotal() { return [...this.#lines.values()].reduce((s, l) => s + l.qty * l.product.price, 0); }
  total(vatRate = 0.16) { return Math.round(this.subtotal * (1 + vatRate)); }
  toString() {
    return [...this.#lines.values()].map(l => `${l.qty} x ${l.product.name}`).join(", ");
  }
}

const unga = new Product(1, "Unga 2kg", 180);
const oil = new Product(2, "Oil 1L", 350);
const cart = new Cart().add(unga, 2).add(oil).add(unga);
console.log(String(cart));
console.log(cart.count, "items, subtotal", cart.subtotal, "total", cart.total());
```

Notice method chaining (`return this`), getters for computed values and a private field that outside code can't corrupt.

## Polymorphism with payment methods

```try-javascript
class Payment {
  constructor(amount) { this.amount = amount; }
  pay() { throw new Error("pay() must be implemented"); }
  receipt() { return `${this.constructor.name}: KSh ${this.amount} -> ${this.pay()}`; }
}
class MpesaPayment extends Payment {
  constructor(amount, phone) { super(amount); this.phone = phone; }
  pay() { return `STK push sent to ${this.phone}`; }
}
class CardPayment extends Payment {
  constructor(amount, last4) { super(amount); this.last4 = last4; }
  pay() { return `Card ending ${this.last4} charged`; }
}
class CashPayment extends Payment {
  pay() { return "Cash received at the counter"; }
}

const payments = [new MpesaPayment(1500, "254712345678"), new CardPayment(3000, "4242"), new CashPayment(200)];
for (const p of payments) console.log(p.receipt());
```

The checkout code calls `receipt()` without caring which kind of payment it is. Adding a new method (say, bank transfer) means writing one new class, not editing every `if`.

## Composition over inheritance

Deep inheritance chains (`Animal → Mammal → Dog → ShopDog`) become hard to change. Often it's better to **compose** objects from smaller parts:

```try-javascript
const canNotify = obj => ({ ...obj, notify(msg) { return `SMS to ${obj.phone}: ${msg}`; } });
const canEarnPoints = obj => ({ ...obj, points: 0, earn(amount) { this.points += Math.floor(amount / 100); return this.points; } });

const customer = canEarnPoints(canNotify({ name: "Zawadi", phone: "0712000111" }));
console.log(customer.notify("Your order is ready"));
console.log("Points:", customer.earn(2350));
```

Use inheritance for true "is a" relationships; use composition for "has a" or "can do" features.

## instanceof, static factories and toJSON

```try-javascript
class Student {
  static #nextId = 1;
  constructor(name, form) { this.id = Student.#nextId++; this.name = name; this.form = form; }
  static fromCsv(line) {
    const [name, form] = line.split(",");
    return new Student(name.trim(), Number(form));
  }
  toJSON() { return { id: this.id, name: this.name, form: `Form ${this.form}` }; }
}
const s = Student.fromCsv("Baraka Mutua, 3");
console.log(s instanceof Student, s.id);
console.log(JSON.stringify([s, new Student("Neema", 1)]));
```

`toJSON` controls how an object is saved as JSON, useful when sending data to an API.

## Classes are functions underneath

```try-javascript
class Dog { bark() { return "Woof"; } }
console.log(typeof Dog);                                      // "function"
console.log(Object.getPrototypeOf(new Dog()) === Dog.prototype); // true
```

Methods live on the **prototype** and are shared by all instances, so creating thousands of objects doesn't duplicate method code.

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Forgetting `new` | TypeError: class constructor cannot be invoked without 'new' | `new Product(...)` |
| Using a field before `super()` in a subclass | ReferenceError | Call `super()` first |
| Passing a method as a callback (`button.onclick = cart.clear`) | `this` is lost | Arrow function `() => cart.clear()` or `.bind(cart)` |
| Huge "god" classes doing everything | Hard to test | Split responsibilities |

## Practice

1. Build a `BankAccount` class with a private balance, `deposit`, `withdraw` (throwing on overdraft) and a `history` getter.
2. Extend it as `SavingsAccount` with `addInterest(rate)`.
3. Create `Shape` with `area()`, and `Circle`, `Rectangle` subclasses; print the areas of a mixed list.
4. Add a static `fromJSON(obj)` to `Product` and recreate products from JSON text.

:::think Why does `setTimeout(cart.clear, 1000)` fail with "Cannot read properties of undefined", while `setTimeout(() => cart.clear(), 1000)` works?
Passing `cart.clear` passes only the function, detached from `cart`, so when it runs, `this` is undefined (in class code, which is strict). The arrow function calls `clear` as a method of `cart`, so `this` is the cart.
:::

```quiz
Q: Which method runs automatically when you create an object with new?
A: constructor | constructor()
Q: Which keyword makes one class inherit from another?
A: extends
Q: Which keyword calls the parent class constructor?
A: super | super()
Q: Which symbol makes a class field private?
A: # | hash
Q: What is it called when different classes answer the same method in their own way?
A: polymorphism
Q: What does returning this from methods allow? (two words)
A: method chaining | chaining
Q: Which method controls how an object is turned into JSON?
A: toJSON | toJSON()
Q: Where do class methods actually live and get shared from?
A: prototype | the prototype
```
=== exercise ===
Create a class `Book` with a constructor taking `title`, and a method `label()` that returns `"Book: " + this.title`. Log `new Book("Kidagaa").label()`.
=== starter ===
class Book {
  
}
console.log(new Book("Kidagaa").label());
=== expected ===
Book: Kidagaa
=== must_contain ===
constructor
this.title
