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

## How variables really work

A Python variable is a **label attached to a value**, not a box that holds it. When you write `price = 250`, Python creates the value `250` in memory and attaches the label `price` to it. Assigning again moves the label:

```try-python
price = 250
print(price, id(price))      # id() shows where the value lives in memory
price = 300                  # the label now points to a different value
print(price, id(price))

a = [1, 2, 3]
b = a                        # b is a second label on the SAME list
b.append(4)
print(a)                     # [1, 2, 3, 4]: changing through b changed a too
c = a.copy()                 # a real copy
c.append(5)
print(a, c)
```

This matters with lists and dictionaries (mutable values): two names can refer to the same object. Numbers and strings can't be changed in place, so this surprise doesn't happen with them.

## Dynamic typing

Python works out the type from the value, and a name can later point to a value of a different type:

```try-python
data = 42
print(type(data))
data = "forty-two"
print(type(data))
print(isinstance(data, str))       # check a type in code
```

This flexibility is convenient but can hide mistakes, so use clear names (`total_ksh`, `student_name`) and, in bigger programs, **type hints**:

```try-python
def vat(amount: float, rate: float = 0.16) -> float:
    return amount * rate

print(vat(1000))
```

Type hints don't change how the code runs; editors and tools like mypy use them to catch errors early.

## Validating input safely

Real users type unexpected things. A safe pattern converts inside `try`/`except`:

```try-python
def to_amount(text):
    try:
        value = float(text.replace(",", "").strip())
    except ValueError:
        return None
    return value if value > 0 else None

for typed in ["1500", " 2,500 ", "abc", "-20", "0"]:
    result = to_amount(typed)
    print(repr(typed), "->", result if result is not None else "invalid, please try again")
```

## Common mistakes

| Mistake | Example | Fix |
|---|---|---|
| Doing maths on input without converting | `input("Qty: ") * 2` repeats the text | `int(input("Qty: ")) * 2` |
| Using a name before assigning it | `print(total)` before `total = 0` | Assign first (`NameError` otherwise) |
| Spaces or hyphens in names | `total price = 5`, `total-price = 5` | `total_price = 5` |
| Overwriting built-in names | `list = [1, 2]` then `list("abc")` fails | Use `items`, `names`, etc. |
| Comparing floats exactly | `0.1 + 0.2 == 0.3` is False | `round(x, 2)` or `math.isclose` |
| Expecting `int()` to round | `int(2.9)` gives 2 | `round(2.9)` gives 3 |

## Practice

1. Store your name, town and age in variables and print a sentence using an f-string.
2. Given `price = "1200"` and `qty = "3"` (as text), print the total with VAT at 16%, formatted with commas and 2 decimals.
3. Swap the values of `morning` and `evening` without a third variable.
4. Write `to_int(text)` that returns an int, or `None` if the text isn't a whole number.

:::think Why does `b = a` followed by `b.append(4)` change `a` when `a` is a list, but `y = x` followed by `y = y + 1` doesn't change `x` when `x` is a number?
`b = a` makes both names point to the same list object, and `append` changes that object in place. With numbers, `y + 1` creates a **new** number object and `y` is re-pointed to it; `x` still points to the old value. Integers are immutable, lists are mutable.
:::

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
Q: Which built-in function tells you the type of a value?
A: type | type()
Q: What error does int("abc") raise?
A: ValueError
Q: Which method makes a separate copy of a list?
A: copy | .copy()
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
