---
slug: functions-dicts
title: "Functions and dictionaries: reusable code and key-value data"
after: KEEP
---
# Functions and dictionaries: reusable code and key-value data

**Functions** let you name a piece of logic and reuse it: `calculate_vat()`, `format_phone()`, `grade()`. **Dictionaries** store data by name instead of position: a student's name, class and marks; a product's price and stock; county codes. Combined with lists, these two tools let you model almost any real-world data and process it cleanly. This unit covers both from first principles.

:::note What you will learn
- Defining and calling functions with `def`
- Parameters, arguments, default values, keyword arguments
- `return` vs `print`, returning several values
- Local vs global scope
- Docstrings and good function design
- Dictionaries: creating, reading, `get()`, adding, updating, deleting
- Looping with `.keys()`, `.values()`, `.items()`
- Counting and grouping with dictionaries; lists of dictionaries
:::

## Part 1: Functions

### Why functions?

- **Don't repeat yourself (DRY):** write logic once, use it everywhere.
- **Organise:** break a big problem into small named steps.
- **Test:** check each piece separately.
- **Read:** `send_receipt(customer)` is clearer than 20 lines of details.

:::define Function
A named block of reusable code defined with `def`. It can take inputs (**parameters**), and give back a result with **`return`**.
:::

### Defining and calling

```try-python
def greet(name):
    return f"Habari, {name}!"

print(greet("Wanjiku"))
print(greet("Otieno"))
```

- `def` starts the definition, then the name, brackets with parameters, and a colon.
- The body is indented.
- Nothing happens until you **call** it: `greet("Wanjiku")`.

### `return` vs `print`

```try-python
def add_vat(amount):
    return amount * 1.16          # gives the value back

def show_vat(amount):
    print(amount * 1.16)          # only displays it

price = add_vat(1000)             # 1160.0 stored in price
print(price + 50)                 # can be used further

result = show_vat(1000)           # prints 1160.0
print(result)                     # None: show_vat returns nothing
```

Functions that **return** values are far more useful: you can store, combine and test their results.

### Parameters: defaults and keywords

```try-python
def line_total(price, qty=1, discount=0):
    return price * qty * (1 - discount)

print(line_total(180))                     # 180: qty and discount use defaults
print(line_total(180, 3))                  # 540
print(line_total(180, qty=3, discount=0.1))  # keyword arguments: clear and any order
print(line_total(discount=0.5, price=1000))
```

:::warning Never use a list or dict as a default value
`def add_item(item, cart=[])` shares **one** list between all calls, so items pile up unexpectedly. Use `cart=None` and inside: `if cart is None: cart = []`.
:::

### Returning several values

```try-python
def summary(marks):
    return min(marks), max(marks), sum(marks) / len(marks)

lowest, highest, average = summary([78, 45, 90, 66])
print(lowest, highest, round(average, 1))
```

(Python returns a **tuple** that you unpack into variables.)

### Scope

Variables created inside a function are **local** to it:

```try-python
shop = "Mama Mboga"          # global

def receipt(total):
    vat = total * 0.16       # local
    return f"{shop}: total {total}, VAT {vat:.0f}"

print(receipt(500))
try:
    print(vat)
except NameError as e:
    print("Outside the function:", e)
```

Prefer passing values in and returning results out, instead of changing global variables inside functions.

### Docstrings and good design

```try-python
def loan_repayment(principal, annual_rate, months):
    """Return the fixed monthly repayment for a reducing-balance loan.

    principal: amount borrowed in KSh
    annual_rate: yearly interest rate as a decimal (0.14 for 14%)
    months: number of monthly repayments
    """
    r = annual_rate / 12
    if r == 0:
        return principal / months
    return principal * r / (1 - (1 + r) ** -months)

print(round(loan_repayment(100000, 0.14, 12)))
help(loan_repayment)
```

Good functions: **one job**, a **verb name** (`calculate_total`, `is_valid_phone`), short, and documented when not obvious.

### Functions are values

You can pass functions around, e.g. as a sort key:

```try-python
products = [("Speaker", 3500), ("Charger", 800), ("Earphones", 1200)]

def by_price(item):
    return item[1]

print(sorted(products, key=by_price))
print(sorted(products, key=lambda item: item[1], reverse=True))   # lambda: a tiny unnamed function
```

## Part 2: Dictionaries

### Why dictionaries?

With lists you find items by **position** (`student[2]`, but what was 2?). Dictionaries store values under **keys** (names), so data is self-describing:

:::define Dictionary
A collection of **key: value** pairs in curly braces, e.g. `{"name": "Amina", "class": "Grade 9"}`. Keys are unique; you look values up by key, very fast.
:::

```try-python
student = {
    "name": "Amina Hassan",
    "class": "Grade 9",
    "marks": [78, 85, 69],
    "boarder": False,
}
print(student["name"])
print(student["marks"][1])
print(len(student))            # 4 keys
print("class" in student)      # True: checks keys
```

### `get()`: safe lookup

```try-python
prices = {"unga": 180, "sugar": 150}
print(prices.get("unga"))           # 180
print(prices.get("rice"))           # None (no error)
print(prices.get("rice", 0))        # 0 default
try:
    prices["rice"]
except KeyError as e:
    print("KeyError:", e)            # square brackets raise an error for missing keys
```

### Adding, updating and deleting

```try-python
stock = {"unga": 12, "sugar": 0}
stock["milk"] = 30          # add
stock["unga"] -= 2          # update
stock.update({"sugar": 20, "bread": 15})
del stock["bread"]          # delete
removed = stock.pop("milk") # delete and return
print(stock, removed)
```

### Looping

```try-python
prices = {"unga": 180, "sugar": 150, "milk": 60}
for item in prices:                      # keys
    print(item)
for price in prices.values():
    print(price)
for item, price in prices.items():       # both (most common)
    print(f"{item}: KSh {price}")
```

### Counting with a dictionary

```try-python
votes = ["Yes", "No", "Yes", "Abstain", "Yes", "No"]
counts = {}
for v in votes:
    counts[v] = counts.get(v, 0) + 1
print(counts)

from collections import Counter          # the built-in shortcut
print(Counter(votes).most_common(2))
```

### Grouping

```try-python
students = [("Amina", "Grade 9"), ("Brian", "Grade 8"), ("Chebet", "Grade 9"), ("David", "Grade 8")]
by_class = {}
for name, cls in students:
    by_class.setdefault(cls, []).append(name)
print(by_class)
```

### Lists of dictionaries: records

This is how data from databases, APIs and CSV files usually looks:

```try-python
products = [
    {"name": "Unga 2kg", "price": 180, "stock": 12},
    {"name": "Sugar 1kg", "price": 150, "stock": 0},
    {"name": "Milk 500ml", "price": 60, "stock": 30},
]

def in_stock(items):
    return [p["name"] for p in items if p["stock"] > 0]

def stock_value(items):
    return sum(p["price"] * p["stock"] for p in items)

print(in_stock(products))
print("Stock value: KSh", stock_value(products))
cheapest = min(products, key=lambda p: p["price"])
print("Cheapest:", cheapest["name"])
```

### Dictionary rules

- Keys must be **immutable** (strings, numbers, tuples), and unique.
- Values can be anything, including lists and other dictionaries.
- Dictionaries keep **insertion order** (Python 3.7+).

:::think Why is a dictionary better than two separate lists (names and phones) for a contact book?
With two lists you must keep positions perfectly in sync; deleting or sorting one breaks the pairing. A dictionary (`{"Wanjiku": "0712...", ...}`) or a list of contact dictionaries keeps each name with its phone, and lookups by name are instant instead of searching through a list.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting to call: `greet` instead of `greet()` | Add brackets |
| Printing inside instead of returning | `return` the result |
| Mutable default arguments (`cart=[]`) | `cart=None` |
| `dict["missing"]` crashing | `.get("missing", default)` |
| Looping a dict and expecting values | Use `.values()` or `.items()` |
| Using lists as dictionary keys | Use strings/tuples |

## Practice tasks

1. Write `celsius_to_fahrenheit(c)` and `is_adult(age)`; test them.
2. Write `grade(marks)` returning A–E, and use it on a list of marks.
3. Create a dictionary of 5 products and prices; print them sorted by price.
4. Count how many times each word appears in a sentence.
5. Store 4 students as dictionaries with marks; print each student's average and the class average.

## Summary

- Define functions with `def name(params):`; call with `name(args)`; `return` gives back values (otherwise `None`).
- Parameters can have defaults and be passed by keyword; return several values as a tuple.
- Variables inside functions are local; write small, single-purpose, documented functions; `lambda` for tiny functions.
- Dictionaries store `key: value` pairs; read with `[]` or `.get()`; add/update/delete; loop with `.items()`.
- Use dictionaries for counting, grouping and records (lists of dictionaries).

```quiz
Q: Which keyword defines a function in Python?
A: def
Q: What does a function return if it has no return statement?
A: None
Q: Which dictionary method returns None (or a default) instead of an error for a missing key?
A: get | get()
Q: Which dictionary method gives key-value pairs for a loop?
A: items | items()
Q: Can a list be a dictionary key? (yes or no)
A: no
Q: What is a tiny unnamed function in Python called?
A: lambda
Q: Which collections class counts items quickly?
A: Counter
```
=== exercise ===
Write a function `square(n)` that returns `n * n`, then print `square(9)`. The output should be **81**.
=== starter ===
def square(n):
    pass

print(square(9))
=== expected ===
81
=== must_contain ===
def square
