---
slug: variables-input
title: Variables, input and type conversion
after: introduction
---
# Variables, input and type conversion

A **variable** is a name that points to a value. In Python you create one simply by assigning to it: no keyword needed.

```try-python
name = "Wanjiru"
age = 21
height = 1.65
is_student = True

print(name, age, height, is_student)
print(type(name), type(age), type(height), type(is_student))
```

## The basic types

| Type | Example | Used for |
|---|---|---|
| `str` | `"Kisumu"` | Text |
| `int` | `42`, `-7` | Whole numbers |
| `float` | `3.14`, `1500.0` | Decimals |
| `bool` | `True`, `False` | Yes/no |
| `NoneType` | `None` | "No value yet" |

## Naming rules and style

- Letters, digits and `_`; can't start with a digit; no spaces.
- Case sensitive: `total` ≠ `Total`.
- Python style is **snake_case**: `total_price`, `customer_name`.
- Don't use Python words like `print`, `list`, `str` as names.

```try-python
total_price = 2500          # good
x = 2500                    # works, but unclear
first_name, last_name = "Brian", "Otieno"   # assign two at once
a = b = 0                   # same value to both
print(first_name, last_name, a, b)

# swap two values in one line
a, b = 1, 2
a, b = b, a
print(a, b)
```

## Getting input from the user

`input()` shows a message and waits for the user to type. **It always returns a string.**

```python
name = input("What is your name? ")
print("Habari", name)
```

> In our online editor, `input()` opens a small box for you to type into. On your own computer it waits in the terminal.

## Type conversion (casting)

Because input is text, convert it before doing maths:

```try-python
qty = "3"            # imagine this came from input()
price = "250.50"

print(qty + qty)                     # "33": joined as text!
print(int(qty) + int(qty))           # 6
print(float(price) * int(qty))       # 751.5
print(str(2026) + " is the year")    # number to text
print(int(9.99))                     # 9: cuts off the decimal, doesn't round
print(round(9.99), round(2.456, 2))  # 10  2.46
print(bool(0), bool(5), bool(""), bool("hi"))
```

If the text isn't a valid number, `int("abc")` raises a `ValueError`. You'll learn to handle that with `try`/`except` in a later lesson.

## A small program: M-Pesa withdrawal estimate

```try-python
balance = float("5000")        # imagine: float(input("Balance: "))
amount = float("1200")         # imagine: float(input("Amount to withdraw: "))
fee = 29                        # example fee for this amount

if amount + fee <= balance:
    remaining = balance - amount - fee
    print(f"You can withdraw KSh {amount:,.0f}. Fee KSh {fee}. Balance after: KSh {remaining:,.2f}")
else:
    print("Not enough money for this withdrawal and its fee.")
```

`f"..."` strings (f-strings) put values straight into text. `{remaining:,.2f}` means "comma separators and 2 decimal places". More in the Strings lesson.

## Constants

Python has no real constants, but by convention names in CAPITALS mean "don't change this":

```python
VAT_RATE = 0.16
MAX_LOGIN_TRIES = 3
```

```quiz
Q: What type does input() always return?
A: str | string
Q: What does int("3") + int("4") give?
A: 7
Q: What does "3" + "4" give?
A: 34 | "34"
Q: What is the Python naming style with underscores called?
A: snake_case | snake case
Q: What does int(9.99) give?
A: 9
```
=== exercise ===
Convert the strings `qty = "4"` and `price = "150"` to integers and print their product, **600**.
=== starter ===
qty = "4"
price = "150"
# convert and print the product
=== expected ===
600
=== must_contain ===
int(
print
