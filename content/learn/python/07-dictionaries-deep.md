---
slug: dictionaries-in-depth
title: Dictionaries in depth: nested data and counting
after: functions-in-depth
---
# Dictionaries in depth: nested data and counting

A **dictionary** stores **key → value** pairs. It's how Python represents records (a customer, a product) and it's the shape of most data from APIs (JSON).

## Create, read, update, delete

```try-python
product = {"name": "Unga 2kg", "price": 180, "stock": 12}

print(product["name"])                 # read (error if key missing)
print(product.get("discount"))         # None instead of an error
print(product.get("discount", 0))      # with a default

product["price"] = 175                 # update
product["category"] = "food"           # add
del product["stock"]                   # delete
removed = product.pop("category")      # delete and return the value
print(product, removed)
print("price" in product, len(product))
```

## Looping

```try-python
prices = {"sugar": 160, "oil": 350, "salt": 30}
for item in prices:                    # keys
    print(item)
for price in prices.values():
    print(price)
for item, price in prices.items():     # both: the most common
    print(f"{item:<6} KSh {price}")
```

## Nested data: lists of dicts and dicts of lists

```try-python
customers = [
    {"name": "Amina", "town": "Mombasa", "orders": [1200, 800]},
    {"name": "Brian", "town": "Nakuru", "orders": [300]},
    {"name": "Chebet", "town": "Eldoret", "orders": []},
]

for c in customers:
    spent = sum(c["orders"])
    print(f"{c['name']} from {c['town']} spent KSh {spent:,}")

print(customers[0]["orders"][1])        # 800
customers[2]["orders"].append(2500)     # change nested data
print(customers[2])
```

## Counting and grouping (very common!)

```try-python
sales = ["unga", "oil", "unga", "sugar", "unga", "oil"]

counts = {}
for item in sales:
    counts[item] = counts.get(item, 0) + 1
print(counts)

from collections import Counter          # the built-in shortcut
c = Counter(sales)
print(c.most_common(2))

students = [("Amina", "Form 2"), ("Brian", "Form 3"), ("Chebet", "Form 2")]
by_class = {}
for name, form in students:
    by_class.setdefault(form, []).append(name)
print(by_class)
```

## Merging and sorting

```try-python
defaults = {"theme": "light", "language": "en", "sms": True}
user = {"language": "sw"}
settings = defaults | user          # later values win (Python 3.9+)
print(settings)

stock = {"sugar": 4, "oil": 20, "salt": 9}
low_first = dict(sorted(stock.items(), key=lambda kv: kv[1]))
print(low_first)
print(max(stock, key=stock.get))    # item with most stock
```

## Keys must be unchangeable

Keys can be strings, numbers or tuples, not lists. Values can be anything.

```try-python
distances = {("Nairobi", "Nakuru"): 160, ("Nairobi", "Mombasa"): 485}
print(distances[("Nairobi", "Mombasa")], "km")
```

## Mini project: a simple phone book

```try-python
book = {}

def add(name, phone):
    book[name.title()] = phone

def find(name):
    return book.get(name.title(), "Not found")

add("amina hassan", "0712345678")
add("BRIAN OTIENO", "0722000111")
print(find("Amina Hassan"))
print(find("Zawadi"))
for name in sorted(book):
    print(f"{name:<15} {book[name]}")
```

```quiz
Q: Which method reads a key without an error if it is missing?
A: get | get() | .get
Q: Which method loops over keys and values together?
A: items | items() | .items()
Q: Can a list be a dictionary key? (yes or no)
A: no
Q: What does {"a": 1} | {"a": 2} give for "a"?
A: 2
Q: Which class from collections counts items quickly?
A: Counter
```
=== exercise ===
Count the items in `sales = ["unga", "oil", "unga"]` into a dictionary and print it: **{'unga': 2, 'oil': 1}**.
=== starter ===
sales = ["unga", "oil", "unga"]
counts = {}
# count here
print(counts)
=== expected ===
{'unga': 2, 'oil': 1}
=== must_contain ===
for
counts[
