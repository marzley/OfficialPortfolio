---
slug: loops-lists
title: "Lists and loops: storing many values and repeating actions"
after: KEEP
---
# Lists and loops: storing many values and repeating actions

Programs rarely work with just one value. A class has 40 students, a shop has 300 products, a month has 30 days of sales. Python stores collections in **lists** and processes them with **loops**. These two ideas are the workhorses of programming: once you know them, you can total a month's sales, find the top student, clean a contact list or produce a report in a few lines.

:::note What you will learn
- Creating lists, indexes, negative indexes and `len()`
- Changing lists: append, insert, remove, pop, sort
- `for` loops over lists, strings and `range()`
- `enumerate()` and `zip()`
- Common patterns: total, average, count, max/min, filter
- Lists of lists and lists of dictionaries (preview)
- Copying lists safely
:::

## Lists

:::define List
An ordered, changeable collection of values in square brackets: `["Unga", "Sugar", "Milk"]`. Items have positions (indexes) starting at 0.
:::

```try-python
items = ["Unga", "Sugar", "Milk", "Bread"]
print(items)
print(items[0])        # Unga
print(items[-1])       # Bread (last)
print(items[1:3])      # ['Sugar', 'Milk'] (slice)
print(len(items))      # 4
print("Milk" in items) # True
```

Lists can hold any types (even mixed), but usually one kind of item per list.

### Changing lists

```try-python
cart = ["Unga", "Sugar"]
cart.append("Milk")          # add to the end
cart.insert(0, "Bread")      # insert at position 0
print(cart)

cart.remove("Sugar")         # remove by value (first match)
last = cart.pop()            # remove and return the last item
print(last, cart)

cart[0] = "Brown bread"      # replace by index
print(cart)

prices = [180, 60, 150, 65]
prices.sort()                        # sort in place
print(prices)
print(sorted(prices, reverse=True))  # new sorted list, original unchanged
print(prices.index(150), prices.count(60))
```

| Method | Does |
|---|---|
| `append(x)` | Add to end |
| `insert(i, x)` | Insert at position |
| `extend(other)` | Add all items from another list |
| `remove(x)` | Remove first matching value |
| `pop(i)` | Remove and return item (last by default) |
| `sort()` / `sorted()` | Sort in place / return new sorted list |
| `reverse()` | Reverse in place |
| `index(x)` | Position of a value |
| `count(x)` | How many times it appears |
| `clear()` | Remove everything |

## The `for` loop

A `for` loop runs its block once for **each item**:

```try-python
students = ["Amina", "Brian", "Chebet", "David"]
for name in students:
    print(f"Karibu, {name}!")
print("All students greeted")
```

Read it as "for each name in students, do this". The indented block is the loop body.

### `range()`: looping a number of times

```try-python
for i in range(5):           # 0, 1, 2, 3, 4
    print(i, end=" ")
print()
for i in range(1, 6):        # 1 to 5
    print(i, end=" ")
print()
for i in range(0, 21, 5):    # 0, 5, 10, 15, 20 (step 5)
    print(i, end=" ")
print()
for i in range(10, 0, -2):   # counting down
    print(i, end=" ")
```

`range(start, stop, step)` stops **before** `stop`.

### Looping over strings

```try-python
for letter in "KENYA":
    print(letter)
```

### `enumerate()`: index and value together

```try-python
towns = ["Nairobi", "Mombasa", "Kisumu"]
for position, town in enumerate(towns, start=1):
    print(f"{position}. {town}")
```

### `zip()`: loop over lists side by side

```try-python
names = ["Amina", "Brian", "Chebet"]
marks = [78, 64, 91]
for name, mark in zip(names, marks):
    print(f"{name:<8} {mark}")
```

## Common loop patterns

### Total and average

```try-python
sales = [3400, 12000, 7800, 15200, 9100]
total = 0
for s in sales:
    total += s                 # same as total = total + s
print("Total:", total)
print("Average:", round(total / len(sales), 1))
print("Built-ins:", sum(sales), max(sales), min(sales))
```

### Counting

```try-python
marks = [78, 45, 90, 52, 38, 66]
passed = 0
for m in marks:
    if m >= 50:
        passed += 1
print(f"{passed} of {len(marks)} passed")
```

### Finding the best (and who)

```try-python
names = ["Amina", "Brian", "Chebet", "David"]
marks = [78, 64, 91, 85]
best_i = 0
for i in range(len(marks)):
    if marks[i] > marks[best_i]:
        best_i = i
print(f"Top student: {names[best_i]} with {marks[best_i]}")
```

### Building a new list (filtering)

```try-python
prices = [180, 1500, 60, 2300, 450]
expensive = []
for p in prices:
    if p > 1000:
        expensive.append(p)
print(expensive)

# The same with a list comprehension (covered in depth later)
print([p for p in prices if p > 1000])
print([p * 1.16 for p in prices])       # add VAT to every price
```

## `break`, `continue` and `else` on loops

```try-python
balances = [1200, 0, 540, -300, 980]
for b in balances:
    if b == 0:
        continue                 # skip zero balances
    if b < 0:
        print("Negative balance found, stopping")
        break                    # stop the loop
    print("Balance:", b)

# for...else: the else runs only if the loop didn't break
numbers = [3, 7, 11]
for n in numbers:
    if n % 2 == 0:
        print("Found an even number")
        break
else:
    print("No even numbers")
```

## Lists of lists

A list can contain lists: a table of rows.

```try-python
timetable = [
    ["Mon", "Maths", "English"],
    ["Tue", "Science", "Kiswahili"],
    ["Wed", "CRE", "Computer"],
]
for row in timetable:
    day, first, second = row          # unpacking
    print(f"{day}: {first}, then {second}")
print(timetable[1][2])                # Kiswahili
```

## Lists of dictionaries (preview)

```try-python
cart = [
    {"name": "Unga 2kg", "price": 180, "qty": 2},
    {"name": "Sugar 1kg", "price": 150, "qty": 1},
]
total = 0
for item in cart:
    total += item["price"] * item["qty"]
print("Total:", total)
```

## Copying lists

```try-python
a = [1, 2, 3]
b = a            # NOT a copy: both names point to the same list
b.append(4)
print(a)         # [1, 2, 3, 4]

c = a.copy()     # a real (shallow) copy; also a[:] or list(a)
c.append(5)
print(a, c)
```

:::think You loop over a list and remove items that are out of stock while looping. Some out-of-stock items are skipped. Why?
Removing items while looping shifts the remaining items' positions, so the loop jumps over the item that moved into the removed one's place. Instead, build a new list of items to keep (`in_stock = [p for p in products if p["stock"] > 0]`) or loop over a copy.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Index starts at 1 | Lists start at 0 |
| `IndexError: list index out of range` | Last index is `len(list) - 1` |
| Forgetting the colon or indentation in `for` | `for x in items:` + 4 spaces |
| `range(1, 10)` expecting 10 included | Stop is excluded: `range(1, 11)` |
| `b = a` thinking it copies | `a.copy()` |
| Removing from a list while looping it | Build a new list |
| `sort()` returns `None` | Use `sorted()` if you need the result |

## Practice tasks

1. Make a list of 5 towns; print each with its number using `enumerate`.
2. Calculate the total, average, highest and lowest of a week's sales.
3. From a list of marks, build a new list of those 50 and above.
4. Print a multiplication table for 7 using `range`.
5. Use `zip` to print a receipt from separate lists of items, quantities and prices.

## Summary

- Lists store ordered, changeable collections; indexes start at 0; negative indexes count from the end; slices `[a:b]`.
- Change lists with `append`, `insert`, `remove`, `pop`, `sort`, and use `sorted()`, `sum()`, `max()`, `min()`, `len()`.
- `for` loops run once per item; `range()` generates number sequences; `enumerate()` and `zip()` add indexes and pair lists.
- Patterns: totals, averages, counts, best item, filtered lists (and list comprehensions).
- `break`, `continue`, loop `else`; copy lists with `.copy()`.

```quiz
Q: What is the index of the first item in a list?
A: 0 | zero
Q: Which list method adds an item to the end?
A: append | append()
Q: What numbers does range(1, 5) produce? Write them with spaces.
A: 1 2 3 4 | 1,2,3,4 | 1, 2, 3, 4
Q: Which function gives both the index and value in a loop?
A: enumerate | enumerate()
Q: Which built-in function adds up a list of numbers?
A: sum | sum()
Q: Which keyword stops a loop completely?
A: break
Q: Does b = a make a copy of list a? (yes or no)
A: no
```
=== exercise ===
Use a loop to print the numbers **1 to 5**, each on its own line.
=== starter ===

=== expected ===
1
2
3
4
5
=== must_contain ===
for
