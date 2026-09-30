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
