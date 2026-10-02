---
slug: files-errors
title: "Errors and exceptions: try, except, else, finally, raising errors and working with files"
after: KEEP
---
# Errors and exceptions: try, except, else, finally, raising errors and working with files

Things go wrong in real programs: users type "abc" where a number belongs, files are missing, networks drop, a division by zero sneaks in. A program that crashes on the first problem is useless. Python handles problems with **exceptions**: you can catch them, explain them to users, recover, and clean up. This unit covers exceptions thoroughly, plus reading and writing files safely (where many errors happen).

:::note What you will learn
- Syntax errors vs exceptions; reading tracebacks
- Common built-in exceptions
- `try`, `except`, `else`, `finally`
- Catching specific exceptions and getting the error message
- Raising your own exceptions and custom exception classes
- Validating user input in a loop
- Reading and writing text files with `with open(...)`
- Paths, encodings and handling missing files
:::

## Syntax errors vs exceptions

- **Syntax errors** happen before the program runs: Python can't understand the code (missing colon, bracket or quote). You must fix the code.
- **Exceptions** happen while the program runs: the code is valid, but something goes wrong (dividing by zero, a missing file, bad input). These can be **handled**.

### Reading a traceback

```try-python
# This example fails on purpose so you can read the traceback
def average(marks):
    return sum(marks) / len(marks)

print(average([70, 80]))
print(average([]))          # empty list: division by zero
```

Read from the **bottom**: the last line names the exception (`ZeroDivisionError: division by zero`); the lines above show where it happened (which function, which line), most recent call last.

## Common exceptions

| Exception | Typical cause |
|---|---|
| `ValueError` | Right type, wrong value: `int("abc")` |
| `TypeError` | Wrong type: `"5" + 5` |
| `ZeroDivisionError` | Dividing by zero |
| `IndexError` | List index out of range |
| `KeyError` | Dictionary key doesn't exist |
| `NameError` | Variable not defined |
| `AttributeError` | Object doesn't have that method/attribute: `None.upper()` |
| `FileNotFoundError` | File doesn't exist |
| `PermissionError` | Not allowed to read/write the file |

## `try` and `except`

```try-python
text = "abc"
try:
    qty = int(text)
    print("Quantity:", qty)
except ValueError:
    print("Please enter a whole number, like 3")
print("The program keeps running")
```

Python runs the `try` block; if a `ValueError` happens, it jumps to the matching `except` instead of crashing.

### Catch specific exceptions

```try-python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
    except TypeError:
        return "Both values must be numbers"

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide("10", 2))
```

:::warning Avoid bare except
`except:` (or `except Exception:` used carelessly) catches **everything**, including bugs you should see, like typos (`NameError`). Catch the specific exceptions you expect, so real bugs still show up.
:::

### Getting the error message

```try-python
try:
    {"unga": 180}["rice"]
except KeyError as e:
    print("Missing key:", e)

try:
    int("12.5")
except ValueError as e:
    print("Error details:", e)
```

### `else` and `finally`

```try-python
def read_amount(text):
    try:
        amount = float(text)
    except ValueError:
        print(f"'{text}' is not a number")
    else:
        print(f"Valid amount: KSh {amount:,.2f}")   # runs only if no exception
    finally:
        print("Finished checking", repr(text))       # always runs (cleanup)

read_amount("1500")
read_amount("abc")
```

- `else`: code that should run **only when no exception** happened.
- `finally`: code that **always** runs (closing files, releasing resources, hiding a loading message).

## Validating input in a loop

A common pattern: keep asking until the input is valid. (This editor simulates input, so run it on your computer to type values.)

```
while True:
    text = input("How many kilos? ")
    try:
        kilos = float(text)
        if kilos <= 0:
            raise ValueError("must be more than zero")
        break                         # valid: leave the loop
    except ValueError as e:
        print("Invalid:", e)
print("You ordered", kilos, "kg")
```

Here is the same logic in a function you can run with test values:

```try-python
def parse_kilos(text):
    try:
        kilos = float(text)
    except ValueError:
        return None, "Please type a number, like 2.5"
    if kilos <= 0:
        return None, "Kilos must be more than zero"
    if kilos > 100:
        return None, "For orders above 100 kg, call us"
    return kilos, "OK"

for attempt in ["two", "-1", "250", "2.5"]:
    print(attempt, "->", parse_kilos(attempt))
```

## Raising exceptions

Your own functions should **raise** exceptions when given impossible values, instead of returning nonsense:

```try-python
def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount > balance:
        raise ValueError(f"Insufficient balance: you have KSh {balance}")
    return balance - amount

for amt in [500, -20, 9000]:
    try:
        print("New balance:", withdraw(2000, amt))
    except ValueError as e:
        print("Error:", e)
```

### Custom exceptions

For bigger programs, define your own exception types:

```try-python
class PaymentError(Exception):
    """Raised when an M-Pesa payment fails."""

class InsufficientFunds(PaymentError):
    pass

def pay(balance, amount):
    if amount > balance:
        raise InsufficientFunds(f"Need KSh {amount - balance} more")
    return "Paid"

try:
    pay(100, 250)
except InsufficientFunds as e:
    print("Top up M-Pesa:", e)
except PaymentError:
    print("Payment failed for another reason")
```

## Working with files

### Writing a file

```try-python
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("Shopping list\n")
    f.write("Unga 2kg\n")
    f.write("Sukuma wiki\n")
print("Saved notes.txt")
```

### Reading a file

```try-python
with open("notes.txt", "w", encoding="utf-8") as f:     # create the file first (each example runs on its own)
    f.write("Shopping list\nUnga 2kg\nSukuma wiki\n")

with open("notes.txt", "r", encoding="utf-8") as f:
    content = f.read()
print(content)

with open("notes.txt", encoding="utf-8") as f:
    for line_number, line in enumerate(f, start=1):
        print(line_number, line.strip())
```

### Appending

```try-python
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("Shopping list\nUnga 2kg\n")

with open("notes.txt", "a", encoding="utf-8") as f:     # "a" adds to the end
    f.write("Milk 500ml\n")
print(open("notes.txt", encoding="utf-8").read())
```

| Mode | Meaning |
|---|---|
| `"r"` | Read (default); error if the file doesn't exist |
| `"w"` | Write: creates the file or **erases** existing content |
| `"a"` | Append to the end |
| `"x"` | Create; error if it already exists |
| `"rb"` / `"wb"` | Binary (images, PDFs) |

### Why `with`?

`with open(...) as f:` automatically **closes** the file when the block ends, even if an error happens. Forgetting to close files can lose data or lock files.

### Encoding

Always pass `encoding="utf-8"` for text files, so Kiswahili accents, emojis and symbols like "KSh" or "€" read and write correctly on every computer (Windows doesn't always default to UTF-8).

### Handling missing files

```try-python
def load_settings(path):
    try:
        with open(path, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"{path} not found, using default settings")
        return "theme=light"

print(load_settings("settings.txt"))
```

### Paths with `pathlib`

```try-python
from pathlib import Path

folder = Path("reports")
folder.mkdir(exist_ok=True)                 # create the folder if missing
file = folder / "sales-2026-10.txt"         # join paths safely on any OS
file.write_text("Total sales: KSh 125,400\n", encoding="utf-8")
print(file, "exists:", file.exists())
print(file.read_text(encoding="utf-8"))
print([p.name for p in folder.iterdir()])
```

`pathlib` works the same on Windows, Mac and Linux (no worrying about `\` vs `/`).

:::think A program opens "sales.csv" with mode "w" to add today's sales, and yesterday's data disappears. Why?
Mode `"w"` **erases** the file before writing. To add to the end, use mode `"a"` (append). For important data, also keep backups and consider a database.
:::

## Good practices

- Catch **specific** exceptions; let unexpected bugs show (and log them).
- Give users **helpful** messages; log technical details for developers.
- Validate input early; raise exceptions for impossible values in your functions.
- Use `with` for files; always set `encoding="utf-8"`.
- Don't use exceptions for normal flow when a simple `if` is clearer.

## Common mistakes

| Mistake | Fix |
|---|---|
| Bare `except:` hiding bugs | Catch specific exceptions |
| Putting too much code in `try` | Only the lines that may fail |
| Ignoring errors silently (`except: pass`) | At least log or tell the user |
| Opening files without `with` | Use `with open(...)` |
| Mode `"w"` when you meant `"a"` | Append with `"a"` |
| No `encoding` | `encoding="utf-8"` |

## Practice tasks

1. Ask for an age; handle non-numbers and negative values with helpful messages.
2. Write `safe_average(marks)` that returns `None` for an empty list instead of crashing.
3. Raise a `ValueError` in a function when a phone number isn't 10 digits.
4. Write 5 lines to a file, then read it back and print the line count.
5. Load a file that may not exist and fall back to defaults.

## Summary

- Syntax errors must be fixed; exceptions happen at runtime and can be handled.
- Read tracebacks from the bottom; know common exceptions (`ValueError`, `TypeError`, `KeyError`, `IndexError`, `ZeroDivisionError`, `FileNotFoundError`).
- `try/except` (specific exceptions, `as e`), `else` (no error), `finally` (always).
- `raise` exceptions for invalid values; create custom exception classes for bigger programs.
- Files: `with open(path, mode, encoding="utf-8")`; modes `r`, `w` (erases), `a`, `x`; `pathlib` for paths.

```quiz
Q: Which block runs only if no exception happened?
A: else
Q: Which block always runs, error or not?
A: finally
Q: Which exception does int("abc") raise?
A: ValueError
Q: Which exception happens when a dictionary key is missing?
A: KeyError
Q: Which keyword creates your own error?
A: raise
Q: Which file mode adds to the end without erasing?
A: a | "a" | append
Q: Which statement closes files automatically?
A: with | with open
Q: Which encoding should you use for text files?
A: utf-8 | UTF-8 | utf8
```
=== exercise ===
Use try/except so that dividing 10 by 0 prints **Cannot divide** instead of crashing.
=== starter ===
a = 10
b = 0
=== expected ===
Cannot divide
=== must_contain ===
try
except
