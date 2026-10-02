---
slug: numbers-strings
title: "Numbers and strings: data types, conversion, text basics and formatting"
after: KEEP
---
# Numbers and strings: data types, conversion, text basics and formatting

Every value in a program has a **type**: a number for prices and marks, text (a **string**) for names and messages, `True`/`False` for yes/no facts. Knowing types, and converting between them, prevents the most common beginner bugs ("why is 2 + 2 giving 22?"). This unit covers Python's number types, strings, conversion and formatting thoroughly.

:::note What you will learn
- Python's basic types: `int`, `float`, `str`, `bool`, `None`
- Checking types with `type()` and `isinstance()`
- Integer vs float maths, rounding and money
- Converting with `int()`, `float()`, `str()`
- Strings: quotes, escapes, multi-line text, joining and repeating
- Indexing, `len()` and basic string methods
- Formatting numbers with f-strings (commas, decimals, percentages, alignment)
:::

## Data types

| Type | Name | Examples | Used for |
|---|---|---|---|
| `int` | Integer | `42`, `-7`, `1_000_000` | Counts, whole shillings, ages |
| `float` | Floating-point number | `3.14`, `0.16`, `2.5e3` | Measurements, rates, decimals |
| `str` | String | `"Nairobi"`, `'0712345678'` | Text |
| `bool` | Boolean | `True`, `False` | Yes/no facts |
| `NoneType` | None | `None` | "No value yet" |

```try-python
print(type(42), type(3.5), type("Habari"), type(True), type(None))
print(isinstance(42, int))              # True
print(isinstance("42", int))            # False: it's text
big = 1_500_000                         # underscores make big numbers readable
print(big)
```

:::tip Phone numbers are strings
`0712345678` as an `int` loses the leading zero (and you never do maths with phone numbers). Store phone numbers, ID numbers, KRA PINs and postal codes as **strings**.
:::

## Numbers

### `int` and `float` maths

```try-python
print(7 + 3, 7 - 3, 7 * 3)     # 10 4 21 (ints)
print(7 / 2)                    # 3.5: / always gives a float
print(7 // 2, 7 % 2)            # 3 1: floor division and remainder
print(2 ** 8)                   # 256
print(10 / 5)                   # 2.0 (float, even though it divides evenly)
print(3 + 2.0)                  # 5.0: int + float = float
print(abs(-250), max(3, 9, 4), min(3, 9, 4))
```

Python integers can be **any size** (no overflow): `2 ** 200` works fine.

### Floating-point surprises and money

```try-python
print(0.1 + 0.2)                # 0.30000000000000004
print(0.1 + 0.2 == 0.3)         # False
print(round(0.1 + 0.2, 2))      # 0.3

from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))   # 0.3 exactly
```

For money: use **whole shillings or cents as integers** for simple apps, or the `Decimal` module for financial calculations. Round only for display.

### Rounding

```try-python
print(round(3.14159, 2))   # 3.14
print(round(2.5), round(3.5))   # 2 4: Python rounds .5 to the nearest EVEN number ("banker's rounding")
import math
print(math.floor(4.9), math.ceil(4.1))   # 4 5
print(math.ceil(130 / 33))               # 4 buses needed for 130 people (33 seats each)
```

:::warning round() and .5
`round(2.5)` gives `2`, not `3`, because Python uses "round half to even" to reduce bias in large calculations. If a business rule says "always round .5 up", use `Decimal` with `ROUND_HALF_UP` or `math.floor(x + 0.5)` for positive numbers.
:::

## Converting between types

```try-python
print(int("250") + 50)        # 300
print(float("3.75") * 2)      # 7.5
print(str(180) + " bob")      # "180 bob"
print(int(9.99))              # 9: int() cuts off decimals (doesn't round)
print(int("1,500".replace(",", "")))   # 1500
print(bool(0), bool(5), bool(""), bool("hi"))   # False True False True

try:
    int("abc")
except ValueError as e:
    print("Can't convert:", e)
```

This matters with `input()`, which always gives a string:

```try-python
a = "2"
b = "2"
print(a + b)                  # "22": joining text!
print(int(a) + int(b))        # 4
```

## Strings

### Creating strings

```try-python
single = 'Karibu'
double = "Karibu"
quote = "Mama Njeri's salon"          # use double quotes when the text has an apostrophe
speech = 'He said "Asante"'
multi = """Marzley Tech
Websites, apps and systems
Nairobi, Kenya"""
print(single, double)
print(quote)
print(speech)
print(multi)
```

### Escape characters

| Escape | Meaning |
|---|---|
| `\n` | New line |
| `\t` | Tab |
| `\\` | A backslash |
| `\'` / `\"` | A quote inside the same kind of quotes |

```try-python
print("Name:\tWanjiku\nTown:\tNyeri")
print("C:\\Users\\Juma")            # backslashes in Windows paths
print(r"C:\Users\Juma")             # raw string: backslashes kept as-is
```

### Joining, repeating and length

```try-python
first = "Achieng"
last = "Otieno"
full = first + " " + last           # concatenation
print(full)
print("-" * 20)                     # repetition
print(len(full))                    # 14 characters (including the space)
print("Otieno" in full)             # True: membership test
```

### Indexing

Each character has a position, starting at **0**; negative indexes count from the end:

```try-python
word = "Mombasa"
print(word[0])      # M
print(word[3])      # b
print(word[-1])     # a (last)
print(word[0:4])    # Momb (slicing: start up to, not including, 4)
```

Strings are **immutable**: you can't change a character in place (`word[0] = "X"` is an error); you create a new string instead. The **Strings in depth** unit covers slicing and methods fully.

### Common methods (preview)

```try-python
town = "  nairobi  "
print(town.strip())                 # "nairobi"
print(town.strip().title())         # "Nairobi"
print("KSH".lower(), "ksh".upper())
print("0712 345 678".replace(" ", ""))
print("Unga,Sugar,Milk".split(","))
print(", ".join(["Unga", "Sugar", "Milk"]))
print("0712345678".startswith("07"))
print("Mombasa".count("a"))
```

## Formatting with f-strings

f-strings can format numbers precisely using `{value:format}`:

```try-python
total = 1234567.891
rate = 0.163
qty = 7

print(f"{total:,}")          # 1,234,567.891  thousands separators
print(f"{total:,.2f}")       # 1,234,567.89   commas + 2 decimals
print(f"{total:.0f}")        # 1234568
print(f"{rate:.1%}")         # 16.3%
print(f"{qty:03d}")          # 007  zero-padded
print(f"[{'Unga':<10}]")     # left-align in 10 spaces
print(f"[{'Unga':>10}]")     # right-align
print(f"[{'Unga':^10}]")     # centre

# A receipt
items = [("Unga 2kg", 2, 180), ("Sugar 1kg", 1, 150), ("Milk 500ml", 4, 60)]
grand = 0
for name, q, price in items:
    line = q * price
    grand += line
    print(f"{name:<12}{q:>3} x {price:>4} = {line:>6,}")
print(f"{'TOTAL':<23}{grand:>6,}")
```

:::think A shop prints prices with f"{price}" and gets 1500.0 for some items and 1500 for others. Why, and how would you print every price as "1,500.00"?
Some prices are floats (`1500.0`) and some ints (`1500`), and the default display differs. Use a format spec for consistency: `f"{price:,.2f}"` prints `1,500.00` for both.
:::

## `None`

`None` represents "no value": a missing middle name, a result not calculated yet, a function that returns nothing.

```try-python
middle_name = None
if middle_name is None:
    print("No middle name provided")
```

Compare with `is None`, not `== None`.

## Common mistakes

| Mistake | Fix |
|---|---|
| `"2" + "2"` gives `"22"` | Convert with `int()`/`float()` |
| `"Age: " + 25` | f-string or `str(25)` |
| Phone numbers as ints | Keep as strings |
| Expecting `round(2.5)` = 3 | Python rounds half to even |
| Comparing floats with `==` | Round, or use `Decimal` |
| `int("9.5")` error | `int(float("9.5"))` or `float` |
| Changing a string in place | Create a new string |

## Practice tasks

1. Print the types of `"100"`, `100`, `100.0` and `True`.
2. Convert `"1,250"` and `"3.5"` into numbers and multiply them.
3. Print your full name, its length and its first and last letters.
4. Print a neatly aligned receipt for 4 items with f-string alignment and commas.
5. Calculate 16% VAT on KSh 12,500 and print it with 2 decimals.

## Summary

- Basic types: `int`, `float`, `str`, `bool`, `None`; check with `type()`/`isinstance()`.
- `/` gives floats, `//` floor division, `%` remainder; floats can be imprecise (use ints, `Decimal`, and round for display).
- Convert with `int()`, `float()`, `str()`, `bool()`; `input()` gives strings.
- Strings: quotes, escapes, triple quotes, `+`, `*`, `len()`, `in`, indexing from 0, immutable.
- f-strings format numbers: `:,`, `.2f`, `%`, padding and alignment.

```quiz
Q: What type is 3.5 in Python?
A: float
Q: What does "3" + "4" give?
A: 34 | "34"
Q: What does int("250") + 50 give?
A: 300
Q: Should phone numbers be stored as int or str?
A: str | string
Q: What does round(2.5) give in Python?
A: 2
Q: What is the index of the first character in a string?
A: 0 | zero
Q: Which f-string format shows 1234.5 as 1,234.50? Write the format spec after the colon.
A: ,.2f | :,.2f
Q: How should you check if a variable is None? (two words: x is ...)
A: is None | x is None
```
=== exercise ===
Print the length of the string `"Marzley Tech"`. The output should be **12**.
=== starter ===
text = "Marzley Tech"
=== expected ===
12
=== must_contain ===
len(
