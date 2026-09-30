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
