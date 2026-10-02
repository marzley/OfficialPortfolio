---
slug: modules-stdlib
title: "Modules and the standard library: import, math, random, datetime, statistics, os and pip"
after: KEEP
---
# Modules and the standard library: import, math, random, datetime, statistics, os and pip

Python's motto is "batteries included": it ships with a huge **standard library** of ready-made modules for maths, dates, random numbers, statistics, files, CSV, JSON, email, web requests and more. On top of that, hundreds of thousands of third-party packages can be installed with **pip**. Knowing what's available saves you from reinventing the wheel. This unit explains modules, how importing works, the most useful standard modules, and how to install and organise packages.

:::note What you will learn
- What modules and packages are and why they exist
- `import`, `from ... import`, aliases
- Creating your own modules and `if __name__ == "__main__":`
- Tour of useful standard modules: math, random, statistics, datetime, collections, os/pathlib, json/csv, time
- Installing packages with pip and using virtual environments
- Choosing safe, well-maintained packages
:::

## What is a module?

:::define Module
A Python file (`something.py`) containing functions, classes and variables you can **import** and reuse. A **package** is a folder of modules. The **standard library** is the large set of modules that comes with Python.
:::

Why modules?
- **Organisation:** split big programs into files (`payments.py`, `reports.py`).
- **Reuse:** use the same code in many programs.
- **Avoid reinventing:** experts already wrote and tested common tools.

## Importing

```try-python
import math                         # import the whole module
print(math.sqrt(144), math.pi)

from math import ceil, floor        # import specific names
print(ceil(4.1), floor(4.9))

import statistics as st             # alias (short name)
print(st.mean([60, 70, 80]))
```

| Style | Use |
|---|---|
| `import math` | Clear where names come from (`math.sqrt`) |
| `from math import sqrt` | Shorter when you use a few names often |
| `import pandas as pd` | Conventional aliases for long names |
| `from module import *` | **Avoid**: you can't tell where names come from, and names can clash |

## Creating your own module

Two files in the same folder:

```
# pricing.py
VAT_RATE = 0.16

def add_vat(amount):
    return round(amount * (1 + VAT_RATE), 2)

def format_ksh(amount):
    return f"KSh {amount:,.2f}"
```

```
# main.py
from pricing import add_vat, format_ksh
print(format_ksh(add_vat(1000)))    # KSh 1,160.00
```

### `if __name__ == "__main__":`

Code under this check runs only when the file is run directly, not when it's imported:

```try-python
def add_vat(amount):
    return round(amount * 1.16, 2)

if __name__ == "__main__":
    # quick tests when running this file directly
    print(add_vat(1000))
```

## Tour of the standard library

### `math`

```try-python
import math
print(math.sqrt(2), math.pow(2, 10), math.factorial(5))
print(math.ceil(130 / 33))           # buses needed
print(math.isclose(0.1 + 0.2, 0.3))  # compare floats safely
print(math.gcd(48, 36), math.lcm(4, 6))
```

### `random`

```try-python
import random
random.seed(1)                        # same results every run (useful for testing)
print(random.randint(1, 6))           # dice roll 1-6
print(random.choice(["Nairobi", "Mombasa", "Kisumu"]))
cards = list(range(1, 11))
random.shuffle(cards)
print(cards)
print(random.sample(range(1, 50), 6))   # 6 unique numbers
print(round(random.uniform(1.5, 3.5), 2))
```

:::warning random isn't for security
For passwords, OTP codes and tokens use the **`secrets`** module: `secrets.randbelow(1_000_000)`, `secrets.token_urlsafe(16)`. The `random` module is predictable.
:::

```try-python
import secrets
code = f"{secrets.randbelow(1_000_000):06d}"
print("6-digit code:", code)
print("Token:", secrets.token_urlsafe(12))
```

### `statistics`

```try-python
import statistics as st
marks = [78, 45, 90, 66, 85, 66, 52]
print("Mean:", round(st.mean(marks), 1))
print("Median:", st.median(marks))
print("Mode:", st.mode(marks))
print("Std dev:", round(st.stdev(marks), 1))
```

### `datetime`

```try-python
from datetime import date, datetime, timedelta

today = date(2026, 10, 2)
due = today + timedelta(days=30)
print("Due date:", due, due.strftime("%A %d %B %Y"))

exam = date(2026, 11, 3)
print((exam - today).days, "days to the exam")

dt = datetime(2026, 10, 2, 14, 30)
print(dt.strftime("%d/%m/%Y %H:%M"))
print(datetime.strptime("15/12/2005", "%d/%m/%Y").year)   # parse text into a date
print(dt.isoformat())
```

| Code | Means | Example |
|---|---|---|
| `%d` | Day (01–31) | 02 |
| `%m` | Month (01–12) | 10 |
| `%Y` | Year | 2026 |
| `%B` / `%b` | Month name / short | October / Oct |
| `%A` | Weekday name | Friday |
| `%H:%M` | 24-hour time | 14:30 |

For time zones, use `zoneinfo`: `datetime.now(ZoneInfo("Africa/Nairobi"))`.

### `collections`

```try-python
from collections import Counter, defaultdict, namedtuple

words = "unga sukari unga maziwa unga sukari".split()
print(Counter(words).most_common(2))

groups = defaultdict(list)
for name, cls in [("Amina", 9), ("Brian", 8), ("Chebet", 9)]:
    groups[cls].append(name)
print(dict(groups))

Point = namedtuple("Point", "lat lon")
nairobi = Point(-1.2921, 36.8219)
print(nairobi.lat, nairobi.lon)
```

### `os`, `pathlib` and `sys`

```try-python
import os, sys
from pathlib import Path

print(os.getcwd())                      # current folder
Path("demo").mkdir(exist_ok=True)
Path("demo/a.txt").write_text("hello", encoding="utf-8")
print(os.listdir("demo"))
print(Path("demo/a.txt").suffix, Path("demo/a.txt").stem)
print(sys.version.split()[0])           # Python version
```

### `json` and `csv`

```try-python
import json, csv, io

data = {"shop": "Juma Electronics", "items": [{"name": "Speaker", "price": 3500}]}
text = json.dumps(data, indent=2)
print(text)
print(json.loads(text)["items"][0]["price"])

rows = "name,price\nUnga,180\nSugar,150\n"
for row in csv.DictReader(io.StringIO(rows)):
    print(row["name"], int(row["price"]))
```

(The **CSV and JSON** unit covers files in depth.)

### `time`

```try-python
import time
start = time.perf_counter()
total = sum(range(1_000_000))
print("Took", round(time.perf_counter() - start, 4), "seconds")
```

Other gems: `re` (regular expressions), `urllib`/`http` (web requests), `sqlite3` (a database built in!), `smtplib` (email), `zipfile`, `logging`, `argparse` (command-line tools), `unittest` (testing).

## Third-party packages and pip

**pip** installs packages from **PyPI** (pypi.org):

```
pip install requests        # popular package for web requests
pip install pandas openpyxl # data analysis + Excel files
pip list                    # see installed packages
pip install -r requirements.txt
```

Popular packages:

| Package | For |
|---|---|
| `requests` | Calling web APIs |
| `pandas` | Data analysis (tables) |
| `matplotlib` / `seaborn` | Charts |
| `openpyxl` | Excel files |
| `flask` / `django` / `fastapi` | Web apps and APIs |
| `numpy` | Fast numerical computing |
| `scikit-learn` | Machine learning |
| `python-dotenv` | Loading secrets from `.env` files |

### Virtual environments

Different projects may need different package versions. A **virtual environment** keeps each project's packages separate:

```
python -m venv .venv
# Windows:  .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install requests
pip freeze > requirements.txt     # record exact versions for others/servers
```

### Choosing packages safely

- Prefer popular, actively maintained packages (recent releases, good documentation, many users).
- Check the exact name: attackers publish look-alike packages ("typosquatting") with malicious code.
- Pin versions in `requirements.txt` for production.
- Don't install random packages from forum posts without checking them.

:::think Your friend's script works on their laptop but fails on yours with "ModuleNotFoundError: No module named 'pandas'". Why, and how do you fix it properly?
`pandas` is a third-party package installed on their computer but not yours. Install it (`pip install pandas`), ideally inside a virtual environment, and ask them to share a `requirements.txt` so you can install exactly the same versions with `pip install -r requirements.txt`.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Naming your file `random.py` or `math.py` | It hides the real module; rename your file |
| `from x import *` | Import specific names |
| `random` for OTP codes | `secrets` |
| Installing packages globally for every project | Virtual environments |
| Missing `requirements.txt` | `pip freeze > requirements.txt` |
| Forgetting `%Y` vs `%y` in date formats | `%Y` = 2026, `%y` = 26 |

## Practice tasks

1. Use `random` to simulate 1,000 dice rolls and count each face with `Counter`.
2. Calculate the mean, median and mode of a class's marks.
3. Print today's date in the format "Friday 02 October 2026" and the date 90 days later.
4. Create your own `utils.py` module with two functions and import them into another file.
5. Generate a secure 6-digit code with `secrets`.

## Summary

- Modules are reusable Python files; packages are folders of modules; the standard library is huge.
- Import with `import x`, `from x import y`, `import x as alias`; avoid `import *`.
- Your own modules are just `.py` files; use `if __name__ == "__main__":` for direct-run code.
- Key modules: `math`, `random` (not for security; use `secrets`), `statistics`, `datetime`, `collections`, `os`/`pathlib`, `json`/`csv`, `time`.
- Install packages with `pip` inside virtual environments, record them in `requirements.txt`, and choose packages carefully.

```quiz
Q: Which keyword brings a module into your program?
A: import
Q: Which module should generate secure OTP codes?
A: secrets
Q: Which statistics function gives the middle value?
A: median | statistics.median
Q: Which datetime class adds days to a date?
A: timedelta
Q: Which tool installs third-party Python packages?
A: pip
Q: Which command creates a virtual environment? Write it like python -m ...
A: python -m venv .venv | python -m venv | venv
Q: Which strftime code gives the 4-digit year?
A: %Y
```
=== exercise ===
Import `statistics` and print the **mean** of [60, 70, 80]. The output should be **70**.
=== starter ===
marks = [60, 70, 80]
=== expected ===
70
=== must_contain ===
import statistics
mean
