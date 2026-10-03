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

## Pure functions and side effects

A **pure function** returns a result based only on its inputs and doesn't change anything outside itself. Pure functions are easy to test and reuse:

```try-python
def with_vat(amount, rate=0.16):          # pure: same input, same output, no side effects
    return round(amount * (1 + rate), 2)

cart_total = 0
def add_to_cart(price):                   # impure: changes a global variable
    global cart_total
    cart_total += price

print(with_vat(1000))
add_to_cart(500); add_to_cart(250)
print(cart_total)
```

Prefer pure functions and pass data in/out explicitly; use globals sparingly.

## The mutable default argument trap

```try-python
def add_item_bad(item, basket=[]):        # the same list is reused on every call!
    basket.append(item)
    return basket

print(add_item_bad("tea"))
print(add_item_bad("sugar"))              # ['tea', 'sugar']: surprise!

def add_item(item, basket=None):          # the correct pattern
    if basket is None:
        basket = []
    basket.append(item)
    return basket

print(add_item("tea"))
print(add_item("sugar"))
```

Default values are created **once**, when the function is defined. Never use a list or dict as a default; use `None`.

## Docstrings and documentation

```try-python
def loan_instalment(principal, monthly_rate, months):
    """Return the fixed monthly instalment for an amortised loan.

    principal: amount borrowed (KSh)
    monthly_rate: interest per month as a decimal (0.015 = 1.5%)
    months: number of monthly payments
    """
    if monthly_rate == 0:
        return principal / months
    r = monthly_rate
    return principal * r * (1 + r) ** months / ((1 + r) ** months - 1)

print(f"KSh {loan_instalment(100_000, 0.015, 12):,.2f} per month")
help(loan_instalment)
```

## Functions as values: sorting with key

```try-python
students = [("Brian", 72), ("Faith", 88), ("Juma", 45), ("Halima", 91)]
print(sorted(students, key=lambda s: s[1], reverse=True))    # by mark
print(max(students, key=lambda s: s[1])[0])                   # top student

def by_name_length(s):
    return len(s[0])
print(sorted(students, key=by_name_length))

rules = [lambda p: p * 0.9, lambda p: p + 250]               # list of functions
price = 5000
for rule in rules:
    price = rule(price)
print(price)
```

## Testing functions with assert

```try-python
def grade(mark):
    if not 0 <= mark <= 100:
        raise ValueError("mark must be 0-100")
    return "A" if mark >= 80 else "B" if mark >= 65 else "C" if mark >= 50 else "D"

assert grade(80) == "A"
assert grade(79) == "B"
assert grade(50) == "C"
assert grade(0) == "D"
try:
    grade(101)
except ValueError as e:
    print("Correctly rejected:", e)
print("All tests passed")
```

Professional projects use **pytest** with test files, but `assert` is a great start.

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `return` (the function returns `None`) | Return the result explicitly |
| Calling without parentheses (`print(total)` shows `<function ...>`) | `total()` |
| Mutable default arguments | Default to `None`, create inside |
| Functions that do too many things | One job per function; split them |
| Changing globals from many functions | Pass parameters and return values |

## Practice

1. Write `bmi(weight_kg, height_m)` returning BMI rounded to 1 decimal, and test it with assert.
2. Write `describe(*marks)` that returns the count, average and highest of any number of marks.
3. Sort a list of products (name, price, stock) by stock, then by price.
4. Write a function with a docstring that converts KSh to USD at a given rate (default rate parameter).

:::think Why does `add_item_bad("sugar")` return `['tea', 'sugar']` the second time it's called?
The default list `basket=[]` is created once when the function is defined and reused on every call that doesn't pass a basket, so items accumulate. Use `basket=None` and create a new list inside the function.
:::

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
Q: What does a function return if it has no return statement?
A: None
Q: What should you use as a default instead of an empty list?
A: None
Q: Which keyword checks a condition in tests and raises an error if it's false?
A: assert
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
