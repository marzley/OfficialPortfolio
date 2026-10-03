---
slug: tuples-sets-comprehensions
title: Tuples, sets and comprehensions
after: while-loops-control
---
# Tuples, sets and comprehensions

You know **lists**. Python has other collections for other jobs, and a short way to build them called **comprehensions**.

## Choosing the right collection

| Type | Example | Ordered? | Changeable? | Duplicates? | Use for |
|---|---|---|---|---|---|
| list | `[1, 2, 2]` | Yes | Yes | Yes | Most sequences |
| tuple | `(1, 2, 2)` | Yes | **No** | Yes | Fixed records, coordinates |
| set | `{1, 2}` | No | Yes | **No** | Unique items, fast "is it in?" |
| dict | `{"a": 1}` | Yes (insertion) | Yes | Keys unique | Look-ups by key |

## Tuples: fixed records

```try-python
location = (-1.2921, 36.8219)        # latitude, longitude of Nairobi
print(location[0])

lat, lng = location                   # unpacking
print(f"Lat {lat}, Lng {lng}")

student = ("Amina", 19, "Mombasa")
name, age, town = student
print(name, "is", age)

def min_max(nums):
    return min(nums), max(nums)       # returns a tuple
lo, hi = min_max([40, 7, 99, 13])
print(lo, hi)
```

Tuples can't be changed (`location[0] = 0` is an error), which makes them safe for data that shouldn't change, and usable as dictionary keys.

## Sets: unique items

```try-python
visitors = ["Otieno", "Wanjiru", "Otieno", "Kiprop", "Wanjiru"]
unique = set(visitors)
print(unique, len(unique))           # duplicates removed

form_a = {"Amina", "Brian", "Chebet"}
form_b = {"Brian", "Dennis", "Chebet"}
print(form_a & form_b)    # in both (intersection)
print(form_a | form_b)    # in either (union)
print(form_a - form_b)    # only in A (difference)
print("Dennis" in form_b) # very fast membership test

tags = set()
tags.add("python")
tags.add("python")        # ignored: already there
tags.discard("java")      # no error if missing
print(tags)
```

## List comprehensions

A comprehension builds a list in one readable line:

```
[expression for item in iterable if condition]
```

```try-python
prices = [200, 450, 1200, 80]

with_vat = [round(p * 1.16) for p in prices]
print(with_vat)

big = [p for p in prices if p > 300]
print(big)

labels = [f"KSh {p:,}" for p in prices]
print(labels)

squares = [n * n for n in range(1, 6)]
print(squares)

# The long way, for comparison:
result = []
for p in prices:
    if p > 300:
        result.append(p)
print(result == big)
```

## Dict and set comprehensions

```try-python
names = ["amina", "brian", "chebet"]
lengths = {n: len(n) for n in names}
print(lengths)

prices = {"sugar": 160, "oil": 350, "salt": 30}
discounted = {item: p * 0.9 for item, p in prices.items() if p > 100}
print(discounted)

first_letters = {n[0].upper() for n in names}
print(first_letters)
```

## Useful built-ins that work on any collection

```try-python
marks = [45, 78, 92, 60]
print(len(marks), sum(marks), min(marks), max(marks))
print(sorted(marks, reverse=True))
print(any(m < 50 for m in marks), all(m > 40 for m in marks))

students = [("Amina", 78), ("Brian", 92), ("Chebet", 60)]
print(sorted(students, key=lambda s: s[1], reverse=True))   # sort by mark
print(max(students, key=lambda s: s[1]))                     # top student
```

> Keep comprehensions short. If one needs two lines or several `if`s, a normal loop is clearer.

## Unpacking tuples (and other sequences)

```try-python
point = (-1.2921, 36.8219)
lat, lon = point                          # unpacking
print(f"Lat {lat}, Lon {lon}")

first, *middle, last = [72, 88, 55, 91, 64]   # * collects the rest
print(first, middle, last)

records = [("ADM001", "Brian", 12500), ("ADM002", "Faith", 0)]
for adm, name, balance in records:
    print(adm, name, balance)

def min_max(values):
    return min(values), max(values)      # returns a tuple
lo, hi = min_max([67, 82, 45, 90])
print(lo, hi)
```

### Named tuples for readable records

```try-python
from collections import namedtuple
Payment = namedtuple("Payment", ["receipt", "phone", "amount"])
p = Payment("QJK7RT61SV", "254712345678", 1500)
print(p.receipt, p.amount)
print(p)
```

## Set operations in practice

```try-python
paid = {"ADM001", "ADM003", "ADM004"}
registered = {"ADM001", "ADM002", "ADM003", "ADM004", "ADM005"}
print("Not yet paid:", sorted(registered - paid))
print("Paid:", len(paid & registered))

seen = set()
receipts = ["QJK1", "QJK2", "QJK1", "QJK3"]
duplicates = [r for r in receipts if r in seen or seen.add(r)]
print("Duplicate receipts:", duplicates)
```

Checking `x in some_set` is very fast even for millions of items, much faster than searching a list.

## More comprehension patterns

```try-python
marks = {"Brian": 72, "Faith": 88, "Juma": 45, "Halima": 91}

passed = [name for name, m in marks.items() if m >= 50]
grades = {name: ("Pass" if m >= 50 else "Fail") for name, m in marks.items()}
curved = {name: min(m + 5, 100) for name, m in marks.items()}
table = [(r, c, r * c) for r in range(1, 4) for c in range(1, 4) if r <= c]
print(passed)
print(grades)
print(curved)
print(table)

total = sum(m for m in marks.values())    # generator expression: no list built in memory
print("Average:", total / len(marks))
```

Rule of thumb: if a comprehension needs more than one condition and a nested loop, or doesn't fit on about one line, a normal `for` loop is clearer.

## Choosing quickly

| Need | Use |
|---|---|
| Ordered and changeable | `list` |
| Fixed record or dict key | `tuple` (or namedtuple / dataclass) |
| Unique items, fast membership | `set` |
| Look up by key | `dict` |

## Common mistakes

| Mistake | Fix |
|---|---|
| `t = (5)` is just the number 5 | One-item tuple needs a comma: `(5,)` |
| `{}` creates an empty dict, not a set | `set()` for an empty set |
| Expecting sets to keep order | Sets are unordered; sort if needed |
| Putting lists in sets or as dict keys | Use tuples (immutable) instead |
| Huge, unreadable comprehensions | Use a normal loop |

## Practice

1. From a list of phone numbers with duplicates, print the unique numbers sorted.
2. Make a dict mapping each word in a sentence to its length using a comprehension.
3. Given two lists of club members, find who's in both and who's only in the first.
4. Unpack `("Mombasa", 1_208_333, "Coast")` into three named variables and print a sentence.

:::think Why would you store GPS coordinates as a tuple rather than a list?
A location is a fixed record (latitude, longitude) that shouldn't change by accident; tuples are immutable, slightly lighter, and can be used as dictionary keys or set members (e.g. a set of visited locations), which lists can't.
:::

```quiz
Q: Which collection cannot be changed after it is created?
A: tuple
Q: Which collection automatically removes duplicates?
A: set
Q: What does [n * 2 for n in [1, 2, 3]] give?
A: [2, 4, 6] | [2,4,6]
Q: Which set operator gives items that are in both sets?
A: & | intersection
Q: Which function returns True if at least one item passes a test?
A: any | any()
Q: How do you write a tuple with one item, 5?
A: (5,) | 5,
Q: What does {} create: an empty set or an empty dict?
A: dict | an empty dict | empty dict
Q: Which collections class creates tuples with named fields?
A: namedtuple | collections.namedtuple
```
=== exercise ===
Use a list comprehension to make a list of the squares of 1 to 5 and print it: **[1, 4, 9, 16, 25]**.
=== starter ===
# one line with a list comprehension
squares = 
print(squares)
=== expected ===
[1, 4, 9, 16, 25]
=== must_contain ===
for
range
