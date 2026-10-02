---
slug: introduction
title: "Python introduction: what it is, why it's so popular, who uses it and your first programs"
after: KEEP
---
# Python introduction: what it is, why it's so popular, who uses it and your first programs

**Python** is one of the most popular programming languages in the world and often the first language taught in schools, universities and bootcamps. It reads almost like English, so you can focus on solving problems instead of fighting symbols. Python powers data analysis, artificial intelligence, automation, web servers, scientific research, and countless scripts that save people hours of work. This unit starts from absolute zero.

:::note What you will learn
- What Python is and a short history
- Why Python is so popular and what it's used for
- Who uses Python (jobs and industries) and where it runs
- How to run Python: this editor, your computer, Google Colab
- `print()`, comments, variables and basic maths
- Input and f-strings
- Indentation: Python's most important rule
- Reading errors calmly and good habits
:::

## What is Python?

:::define Python
A general-purpose, high-level programming language known for clear, readable code. "High-level" means it handles memory and other computer details for you, so you write instructions in a way that's close to human language.
:::

Compare the same task in two languages:

```
// Java
public class Hello {
  public static void main(String[] args) {
    System.out.println("Habari!");
  }
}
```

```
# Python
print("Habari!")
```

### A short history

- **1989–1991:** Guido van Rossum started Python as a hobby project in the Netherlands; version 0.9 was released in 1991. The name comes from the British comedy group **Monty Python**, not the snake.
- **2000:** Python 2.0.
- **2008:** **Python 3** (not backwards compatible, but cleaner). Python 2 reached end of life in 2020; always learn **Python 3**.
- **Today:** Python consistently ranks at or near the top of programming language popularity rankings (such as the TIOBE index and GitHub's reports), driven by data science and AI.

## Why is Python so popular?

1. **Easy to read and write:** clean syntax, few symbols, indentation instead of braces.
2. **Huge standard library ("batteries included"):** dates, maths, files, CSV, JSON, email, web requests and more, built in.
3. **Massive ecosystem:** over half a million packages on PyPI (the Python Package Index) for almost anything: data (pandas), AI (PyTorch, TensorFlow, scikit-learn), web (Django, Flask, FastAPI), automation (Selenium, requests), charts (matplotlib).
4. **Versatile:** scripts, websites, data analysis, AI, games, hardware (Raspberry Pi), desktop apps.
5. **Free and open source**, running on Windows, Mac, Linux and even phones.
6. **Big, friendly community:** tutorials, forums and answers everywhere.

## What is Python used for?

| Field | Examples |
|---|---|
| **Data analysis** | Cleaning sales data, survey analysis, reports and charts (pandas, Jupyter) |
| **Artificial intelligence and machine learning** | Chatbots, image recognition, crop disease detection, fraud detection, recommendation systems |
| **Automation and scripting** | Renaming hundreds of files, sending reports, filling spreadsheets, web scraping |
| **Web development (back end)** | Websites and APIs with Django, Flask, FastAPI (Instagram's back end famously uses Django) |
| **Science and research** | Universities, health research (e.g. KEMRI-type research work), climate and agriculture data |
| **Finance and fintech** | Risk models, analytics, trading research |
| **Education** | First programming language in schools and universities |
| **Hardware and IoT** | Raspberry Pi projects, sensors, smart farming |
| **Cybersecurity** | Security tools, log analysis, automation |

:::kenya
Kenyan organisations use Python for M-Pesa transaction analytics, agricultural data (weather, yields, prices), health research, credit scoring in digital lending, NGO monitoring and evaluation data, and automating government and business reports. Data analyst, data scientist and machine learning roles in Nairobi frequently list Python.
:::

## Who uses Python?

| Who | How |
|---|---|
| **Data analysts and scientists** | Analysing and visualising data, building models |
| **Machine learning / AI engineers** | Training and deploying AI models |
| **Back-end developers** | Web apps and APIs (Django, FastAPI) |
| **DevOps and system administrators** | Automation scripts, cloud tooling |
| **Researchers and scientists** | Experiments, simulations, statistics |
| **Accountants, analysts and office workers** | Automating Excel and reports |
| **Cybersecurity professionals** | Writing tools and analysing logs |
| **Teachers and students** | Learning programming and problem solving |

:::career
Python skills lead to roles such as **data analyst**, **data scientist**, **machine learning engineer**, **back-end developer**, **automation engineer** and **AI trainer** (coding tasks for AI models pay well; see the earning subject). Even non-programmers who can automate spreadsheets with Python become far more productive.
:::

## Ways to run Python

1. **This editor:** examples run in your browser. (The first run downloads Python into the page, so it may take a few seconds.)
2. **Your computer:** install Python 3 from **python.org** (on Windows, tick "Add Python to PATH"). Write code in **VS Code** with the Python extension, save as `hello.py`, run with `python hello.py` (or `python3`).
3. **Google Colab** (colab.research.google.com): free Python notebooks in the browser, great for data and AI, works on modest laptops.
4. **Phone:** apps like Pydroid 3 (Android) let you practise on the go.

### The Python shell

Typing `python` in a terminal opens the **interactive shell** (`>>>`), where each line runs immediately: perfect for quick experiments.

## Your first program

```try-python
print("Habari! Welcome to Python.")
print("I am learning at Marzley Tech")
print(2 + 3)
print("Total:", 180 * 3)
```

`print()` shows output. Text goes in quotes (single `'...'` or double `"..."`); numbers don't. `print` can take several values separated by commas; it puts spaces between them.

## Comments

```try-python
# This is a comment: Python ignores it
print("Comments explain code to humans")   # a comment at the end of a line

# Use comments to explain WHY, not obvious WHAT:
vat_rate = 0.16   # Kenya's standard VAT rate
```

## Variables

A **variable** is a name that refers to a value.

```try-python
customer = "Wanjiku"
price_per_kg = 180
kilos = 3

total = price_per_kg * kilos
print(customer, "pays KSh", total)

kilos = 5              # variables can be changed
total = price_per_kg * kilos
print("New total: KSh", total)
```

Rules and conventions:
- Names use letters, digits and underscores; they **can't start with a digit**; no spaces.
- Case-sensitive: `total` and `Total` are different.
- Python style (**PEP 8**) uses **snake_case**: `price_per_kg`, `first_name`.
- Choose meaningful names: `total_price`, not `tp` or `x`.
- No `let`/`const` needed: just assign with `=`.

## Basic maths

```try-python
print(10 + 5)    # 15 addition
print(10 - 5)    # 5 subtraction
print(10 * 5)    # 50 multiplication
print(10 / 4)    # 2.5 division (always gives a decimal)
print(10 // 4)   # 2 whole-number (floor) division
print(10 % 3)    # 1 remainder
print(2 ** 10)   # 1024 power
print((2 + 3) * 4)   # 20 brackets first
```

`//` and `%` are very useful: 100 days = `100 // 7` weeks and `100 % 7` days.

## Input and f-strings

`input()` asks the user for text. It **always returns a string**, so convert numbers with `int()` or `float()`.

```try-python
name = input("What is your name? ")
town = input("Which town are you from? ")
print(f"Karibu {name} from {town}!")

age_text = "19"            # imagine this came from input("How old are you? ")
age = int(age_text)        # convert text to a whole number before doing maths
print(f"Next year you will be {age + 1}.")
```

(In this editor, input is simulated with sample text, so try it on your computer for real interaction. On your computer, `age = int(input("How old are you? "))` works the same way; if someone types something that isn't a number, `int()` raises an error, which you'll learn to handle later.)

### f-strings

An **f-string** (formatted string) starts with `f` and puts values inside `{}`:

```try-python
item = "Unga 2kg"
price = 180
qty = 3
print(f"{qty} x {item} = KSh {price * qty}")
print(f"Total with VAT: KSh {price * qty * 1.16:,.2f}")   # :,.2f = commas + 2 decimals
```

## Indentation: Python's most important rule

Python uses **indentation** (spaces at the start of lines) to group code, where other languages use `{ }`. The standard is **4 spaces**.

```try-python
marks = 72
if marks >= 50:
    print("Pass")          # indented: belongs to the if
    print("Well done!")
print("Results printed")   # not indented: always runs
```

Wrong indentation causes an `IndentationError` or changes what your program does. VS Code inserts 4 spaces when you press Tab in Python files.

## Reading errors

Errors (called **exceptions** or **tracebacks**) tell you what went wrong and where:

```try-python
# This example fails on purpose so you can read the error
price = 180
print("Total:", price * qty)    # qty was never defined
```

The last line of the traceback, `NameError: name 'qty' is not defined`, is the key: what type of error and why. Common ones:

| Error | Usually means |
|---|---|
| `SyntaxError` | Typo in the code structure (missing bracket, quote or colon) |
| `IndentationError` | Wrong or inconsistent indentation |
| `NameError` | Using a name that doesn't exist (typo or not created yet) |
| `TypeError` | Wrong type, e.g. adding a number to a string |
| `ValueError` | Right type, bad value, e.g. `int("abc")` |
| `ZeroDivisionError` | Dividing by zero |

:::think Why does print("Age: " + 25) cause a TypeError, while print("Age:", 25) works?
`+` between a string and a number is not allowed in Python (it won't guess whether you want maths or text joining). Separate values with commas in `print`, convert the number with `str(25)`, or use an f-string: `print(f"Age: {25}")`.
:::

## Good habits from day one

- Run code after every small change.
- Read the **last line** of errors first.
- Use clear snake_case names and 4-space indentation.
- Type code yourself; experiment by changing examples.
- Use AI assistants to explain errors, but make sure you understand the fix.

## Practice tasks

1. Print your name, school or workplace and town on three lines.
2. Store the price of bread (65) and quantity (4) in variables and print the total with an f-string.
3. Convert 100 days into weeks and remaining days using `//` and `%`.
4. Ask for two numbers with `input()`, convert them, and print their sum (on your computer).
5. Make three deliberate errors (missing quote, wrong indentation, undefined name) and read each message.

## Summary

- Python is a readable, general-purpose language created by Guido van Rossum (1991); always use Python 3.
- It's popular for data, AI, automation, web back ends, science and education, with a huge library ecosystem.
- Run it here, on your computer (python.org + VS Code), or in Google Colab.
- `print()` shows output; `#` starts comments; variables use snake_case; `/` gives decimals, `//` whole numbers, `%` remainders.
- `input()` returns strings; convert with `int()`/`float()`; f-strings format output.
- Indentation (4 spaces) groups code; read the last line of tracebacks to understand errors.

```quiz
Q: Who created Python? Write the surname.
A: van Rossum | Van Rossum | Guido van Rossum | Rossum
Q: Which version of Python should you learn: 2 or 3?
A: 3 | Python 3
Q: Which function shows output in Python?
A: print | print()
Q: What does input() always return? (type)
A: string | str | a string
Q: What does 17 // 5 give?
A: 3
Q: How many spaces is the standard Python indentation?
A: 4 | four
Q: Which naming style does Python use for variables like price_per_kg?
A: snake_case | snake case
Q: Which character starts a comment in Python?
A: # | hash
```
=== exercise ===
Create a variable `town` with the value **Nakuru** and print `I live in Nakuru` using an f-string.
=== starter ===
town = ""
=== expected ===
I live in Nakuru
=== must_contain ===
