---
slug: functions-in-depth
title: Functions in depth: defaults, *args, **kwargs and lambda
after: functions-dicts
---
# Functions in depth: defaults, *args, **kwargs and lambda

Functions let you write something once and reuse it everywhere. This lesson covers the features that make functions flexible and easy to use.

## Parameters vs arguments, and return

```try-python
def vat(amount, rate):          # amount and rate are parameters
    """Return the VAT on an amount. rate is a percentage."""
    return amount * rate / 100

tax = vat(1000, 16)              # 1000 and 16 are arguments
print(tax)
print(vat.__doc__)               # the docstring documents the function
```

A function without `return` gives back `None`. `return` also ends the function immediately.

## Default values

```try-python
def greet(name, greeting="Habari"):
    return f"{greeting}, {name}!"

print(greet("Amina"))
print(greet("John", "Hello"))
```

> Never use a list or dict as a default (`def f(items=[])`): it's shared between calls. Use `items=None` and create the list inside.

## Keyword arguments

Name the arguments when calling, in any order. It makes calls much clearer:

```try-python
def make_order(item, qty=1, delivery=False, town="Nairobi"):
    fee = 200 if delivery else 0
    return f"{qty} x {item} to {town}, delivery fee KSh {fee}"

print(make_order("Cake", 2))
print(make_order("Cake", delivery=True, town="Thika"))
print(make_order(item="Bread", town="Kiambu", qty=5))
```

## *args: any number of positional arguments

```try-python
def total(*amounts):
    print("Received:", amounts)          # a tuple
    return sum(amounts)

print(total(100, 250, 75))
print(total())

prices = [10, 20, 30]
print(total(*prices))                    # * unpacks a list into arguments
```

## **kwargs: any number of keyword arguments

```try-python
def profile(name, **details):
    print("Name:", name)
    for key, value in details.items():
        print(f"  {key}: {value}")

profile("Wanjiku", town="Nyeri", age=23, course="ICT")

info = {"town": "Kitui", "age": 30}
profile("Mutua", **info)                 # ** unpacks a dict
```

Order in a definition: normal parameters, `*args`, keyword parameters with defaults, `**kwargs`.

## Returning several values

```try-python
def stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

lo, hi, avg = stats([45, 78, 92, 60])
print(lo, hi, round(avg, 1))
```

## lambda: small nameless functions

A `lambda` is a one-line function, mostly used where a function is needed as an argument:

```try-python
square = lambda n: n * n
print(square(9))

students = [("Amina", 78), ("Brian", 92), ("Chebet", 60)]
print(sorted(students, key=lambda s: s[1]))                 # sort by mark
print(list(map(lambda s: s[0].upper(), students)))
print(list(filter(lambda s: s[1] >= 70, students)))
```

## Scope: local and global

```try-python
counter = 0            # global

def add_one():
    global counter     # needed only to CHANGE a global
    counter += 1

def show():
    message = "inside" # local: only exists in this function
    print(message, counter)

add_one(); add_one()
show()
```

Prefer passing values in and returning results out, instead of changing globals. Such functions are easier to test and reuse.

## Type hints (optional but helpful)

```try-python
def loan_repayment(principal: float, rate: float, months: int) -> float:
    """Monthly repayment for a simple-interest loan."""
    total = principal * (1 + rate / 100 * months / 12)
    return round(total / months, 2)

print(loan_repayment(50000, 12, 6))
```

Hints don't change how the code runs, but editors use them to catch mistakes and suggest code.

## Recursion (a function calling itself)

```try-python
def countdown(n):
    if n == 0:                 # base case: stop
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)           # recursive case

countdown(3)
```

See the Algorithms tutorial for more on recursion.

```quiz
Q: What does a function return if it has no return statement?
A: None
Q: Which parameter form collects any number of positional arguments?
A: *args
Q: Which parameter form collects any number of keyword arguments?
A: **kwargs
Q: Which keyword makes a small one-line nameless function?
A: lambda
Q: What is the triple-quoted text right under def called?
A: docstring | a docstring
```
=== exercise ===
Write a function `total(*amounts)` that returns the sum of all its arguments, and print `total(100, 250, 75)`: **425**.
=== starter ===
def total(*amounts):
    pass

print(total(100, 250, 75))
=== expected ===
425
=== must_contain ===
*amounts
return
