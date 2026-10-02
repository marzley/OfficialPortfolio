---
slug: classes-oop
title: "Classes and objects: object-oriented programming in Python"
after: KEEP
---
# Classes and objects: object-oriented programming in Python

As programs grow, you'll have many related pieces of data and behaviour: an account has a balance and can deposit and withdraw; a product has a price and stock and can be sold; a student has marks and can calculate an average. **Object-oriented programming (OOP)** bundles data and the functions that work on it into **classes**. It's how frameworks like Django, many games and large systems are organised. This unit explains classes step by step.

:::note What you will learn
- What classes and objects are, and when OOP helps
- Defining a class, `__init__`, `self` and attributes
- Methods and how they change an object's state
- Class attributes vs instance attributes
- Special methods: `__str__`, `__repr__`, `__eq__`, `__len__`
- Properties and validation
- Inheritance, `super()` and overriding methods
- Composition, dataclasses, and OOP design tips
:::

## Classes and objects

:::define Class and object
A **class** is a blueprint describing what data (attributes) and behaviour (methods) a kind of thing has. An **object** (instance) is one actual thing built from that blueprint.
:::

Analogy: a house plan (class) and the actual houses built from it (objects). Every house has rooms and doors (the same structure), but each has its own owner and paint colour (its own data).

## Your first class

```try-python
class Product:
    def __init__(self, name, price, stock=0):
        self.name = name          # attributes: data stored on each object
        self.price = price
        self.stock = stock

    def is_available(self):       # method: a function that belongs to the class
        return self.stock > 0

    def sell(self, qty=1):
        if qty > self.stock:
            raise ValueError(f"Only {self.stock} {self.name} left")
        self.stock -= qty
        return self.price * qty

unga = Product("Unga 2kg", 180, 12)       # create objects (instances)
sugar = Product("Sugar 1kg", 150)

print(unga.name, unga.price, unga.stock)
print(sugar.is_available())               # False
print("Sale total:", unga.sell(3))
print("Unga left:", unga.stock)
```

### `__init__` and `self`

- `__init__` is the **initialiser** (constructor): it runs automatically when you create an object, setting up its attributes.
- `self` is the object itself. Inside methods, `self.name` means "this object's name". Python passes `self` automatically: you call `unga.sell(3)`, and Python runs `Product.sell(unga, 3)`.

## Methods change state

```try-python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient balance")
        self.balance -= amount
        self.history.append(("withdraw", amount))

acc = Account("Achieng", 1000)
acc.deposit(2500)
acc.withdraw(800)
print(acc.owner, "balance:", acc.balance)
print(acc.history)
```

Each object keeps its **own** data: a second `Account` would have its own balance and history.

## Class attributes vs instance attributes

```try-python
class SavingsAccount:
    interest_rate = 0.08                 # class attribute: shared by all accounts

    def __init__(self, owner, balance):
        self.owner = owner               # instance attributes: per object
        self.balance = balance

    def yearly_interest(self):
        return self.balance * SavingsAccount.interest_rate

a = SavingsAccount("Brian", 10000)
b = SavingsAccount("Chebet", 50000)
print(a.yearly_interest(), b.yearly_interest())
SavingsAccount.interest_rate = 0.09     # change for everyone
print(a.yearly_interest())
```

## Special ("dunder") methods

Methods with double underscores let your objects work with Python's built-in features:

```try-python
class Money:
    def __init__(self, amount):
        self.amount = amount

    def __str__(self):                    # used by print() and str()
        return f"KSh {self.amount:,.2f}"

    def __repr__(self):                   # used in the console/debugging
        return f"Money({self.amount})"

    def __add__(self, other):             # makes + work
        return Money(self.amount + other.amount)

    def __eq__(self, other):              # makes == compare values
        return isinstance(other, Money) and self.amount == other.amount

    def __lt__(self, other):              # makes < (and sorting) work
        return self.amount < other.amount

a, b = Money(1500), Money(250.5)
print(a + b)
print(a == Money(1500))
print(sorted([a, b, Money(10)]))
```

| Method | Enables |
|---|---|
| `__str__` | `print(obj)` friendly text |
| `__repr__` | Developer-friendly representation |
| `__eq__`, `__lt__` | `==`, `<`, sorting |
| `__add__` | `+` |
| `__len__` | `len(obj)` |
| `__contains__` | `x in obj` |

## Properties: controlled attributes

A **property** looks like an attribute but runs code, useful for validation or calculated values:

```try-python
class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks              # goes through the setter below

    @property
    def marks(self):
        return self._marks

    @marks.setter
    def marks(self, value):
        if any(m < 0 or m > 100 for m in value):
            raise ValueError("Marks must be between 0 and 100")
        self._marks = list(value)

    @property
    def average(self):                  # calculated, read-only
        return round(sum(self._marks) / len(self._marks), 1)

s = Student("Amina", [78, 85, 69])
print(s.average)
try:
    s.marks = [78, 120]
except ValueError as e:
    print("Error:", e)
```

The leading underscore in `_marks` is a convention meaning "internal: don't use directly from outside".

## Inheritance

A class can **inherit** from another, reusing its code and adding or changing behaviour:

```try-python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def monthly_pay(self):
        return self.salary

    def describe(self):
        return f"{self.name}: KSh {self.monthly_pay():,}"

class SalesPerson(Employee):            # SalesPerson IS an Employee
    def __init__(self, name, salary, sales, rate=0.05):
        super().__init__(name, salary)  # run the parent's __init__
        self.sales = sales
        self.rate = rate

    def monthly_pay(self):              # override: change behaviour
        return self.salary + int(self.sales * self.rate)

staff = [Employee("Wanjiku", 45000), SalesPerson("Otieno", 30000, 400000)]
for person in staff:
    print(person.describe())            # each uses its own monthly_pay
print(isinstance(staff[1], Employee))   # True
```

- `class Child(Parent):` inherits everything from the parent.
- `super()` calls the parent's version of a method.
- **Overriding** replaces a method in the child.
- **Polymorphism:** code that calls `person.monthly_pay()` works with any employee type.

Use inheritance for genuine "is a" relationships (a SalesPerson **is an** Employee). Don't overuse it.

## Composition: "has a"

Often it's better for an object to **contain** other objects:

```try-python
class Item:
    def __init__(self, name, price, qty):
        self.name, self.price, self.qty = name, price, qty

    def total(self):
        return self.price * self.qty

class Cart:
    def __init__(self):
        self.items = []                 # a Cart HAS Items

    def add(self, item):
        self.items.append(item)

    def total(self):
        return sum(i.total() for i in self.items)

    def __len__(self):
        return sum(i.qty for i in self.items)

cart = Cart()
cart.add(Item("Unga 2kg", 180, 2))
cart.add(Item("Milk 500ml", 60, 4))
print(len(cart), "items, total KSh", cart.total())
```

## Dataclasses: less boilerplate

For classes that mainly hold data, `@dataclass` writes `__init__`, `__repr__` and `__eq__` for you:

```try-python
from dataclasses import dataclass, field

@dataclass
class Order:
    order_id: int
    customer: str
    items: list = field(default_factory=list)
    paid: bool = False

    def total(self):
        return sum(price * qty for _, price, qty in self.items)

o = Order(1042, "Faith", [("Speaker", 3500, 1), ("Charger", 800, 2)])
print(o)
print("Total:", o.total())
print(o == Order(1042, "Faith", [("Speaker", 3500, 1), ("Charger", 800, 2)]))
```

## When to use OOP

| Use classes when... | Plain functions are fine when... |
|---|---|
| Data and behaviour belong together (Account with deposit/withdraw) | Simple scripts and calculations |
| You have many similar objects with their own state | Data transformations (input → output) |
| You're modelling real-world entities in a system | Small one-off tasks |
| A framework expects it (Django models, games) | |

:::think A school system needs Students, Teachers and Parents. All have a name and phone number, but only Students have marks and only Teachers have subjects. How could you design the classes?
Create a base class `Person` with `name` and `phone` (and shared methods like `contact_details()`), then `Student(Person)` adding marks and `average()`, `Teacher(Person)` adding subjects, and `Parent(Person)` linking to their children (composition: a Parent **has** Students). This avoids repeating shared code.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `self` in method definitions | `def sell(self, qty):` |
| Using `name` instead of `self.name` inside methods | Use `self.` for attributes |
| Calling the class without brackets: `p = Product` | `p = Product("Unga", 180)` |
| Mutable class attributes shared by accident (`items = []` at class level) | Create lists in `__init__` |
| Forgetting `super().__init__()` in a child | Call the parent initialiser |
| Deep inheritance trees | Prefer composition; keep it simple |

## Practice tasks

1. Create a `Book` class with title, author and price, and a `__str__` method.
2. Build a `BankAccount` with deposit, withdraw (with validation) and a transaction history.
3. Add a `@property` that returns a student's grade (A–E) from their average.
4. Create `Vehicle` → `Matatu` (with seats and route) using inheritance.
5. Rewrite your shopping cart using a `@dataclass` for items.

## Summary

- A class is a blueprint; objects are instances with their own data.
- `__init__` sets up attributes; `self` refers to the current object; methods define behaviour and change state.
- Class attributes are shared; instance attributes are per object.
- Dunder methods (`__str__`, `__eq__`, `__add__`, `__len__`) integrate objects with Python features.
- Properties validate and calculate attributes.
- Inheritance (`class Child(Parent)`, `super()`, overriding) models "is a"; composition models "has a".
- `@dataclass` reduces boilerplate for data-holding classes.

```quiz
Q: Which method runs automatically when an object is created?
A: __init__ | init
Q: Inside a method, which name refers to the current object?
A: self
Q: Which special method controls what print(obj) shows?
A: __str__ | str
Q: Which function calls the parent class's method?
A: super | super()
Q: What is it called when a child class replaces a parent's method? (one word)
A: overriding | override
Q: Which decorator auto-generates __init__ and __repr__ for data classes?
A: @dataclass | dataclass
Q: A Cart containing Items is an example of inheritance or composition?
A: composition
```
=== exercise ===
Create a class `Car` with an `__init__` storing `name`, then make `Car("Probox")` and print its name. Output: **Probox**
=== starter ===
class Car:
    pass
=== expected ===
Probox
=== must_contain ===
class Car
__init__
