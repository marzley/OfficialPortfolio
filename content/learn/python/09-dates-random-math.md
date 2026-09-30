---
slug: dates-random-math
title: Dates, times, random numbers and maths
after: modules-stdlib
---
# Dates, times, random numbers and maths

Loan due dates, receipts, countdowns, games and reports all need dates and numbers. Python's standard library covers them.

## datetime basics

```try-python
from datetime import datetime, date, timedelta

now = datetime.now()
today = date.today()
print("Now:", now)
print("Today:", today)
print(today.year, today.month, today.day)
print("Weekday (Monday=0):", today.weekday())
```

## Formatting dates (strftime)

```try-python
from datetime import datetime

d = datetime(2026, 12, 12, 14, 30)          # Jamhuri Day, 2:30 pm
print(d.strftime("%d/%m/%Y"))                # 12/12/2026
print(d.strftime("%A, %d %B %Y"))            # Saturday, 12 December 2026
print(d.strftime("%I:%M %p"))                # 02:30 PM
print(d.strftime("%Y-%m-%d %H:%M"))          # 2026-12-12 14:30
```

| Code | Meaning | Example |
|---|---|---|
| `%d` | Day | 12 |
| `%m` | Month number | 12 |
| `%B` / `%b` | Month name / short | December / Dec |
| `%Y` | Year | 2026 |
| `%A` / `%a` | Weekday / short | Saturday / Sat |
| `%H:%M` | 24-hour time | 14:30 |
| `%I %p` | 12-hour + AM/PM | 02 PM |

## Reading dates from text (strptime)

```try-python
from datetime import datetime

text = "05/03/2026"
d = datetime.strptime(text, "%d/%m/%Y")
print(d.date(), d.strftime("%A"))
```

## Date arithmetic with timedelta

```try-python
from datetime import date, timedelta

borrowed = date(2026, 9, 1)
due = borrowed + timedelta(days=30)
print("Loan due:", due)

today = date(2026, 9, 28)
left = (due - today).days
print("Days left:", left)

birthday = date(2000, 6, 15)
age_days = (today - birthday).days
print("Age in years (approx):", age_days // 365)

# every Monday for the next 4 weeks
start = today + timedelta(days=(7 - today.weekday()) % 7)
for i in range(4):
    print((start + timedelta(weeks=i)).strftime("%a %d %b"))
```

## The math module

```try-python
import math

print(math.sqrt(144), math.pi)
print(math.ceil(4.1), math.floor(4.9))
print(math.pow(2, 10), 2 ** 10)
print(round(math.pi, 3))

# area of a round water tank base with radius 1.5 m
r = 1.5
print(f"Area: {math.pi * r ** 2:.2f} m²")

# how many 50-seat buses for 173 students?
print("Buses:", math.ceil(173 / 50))
```

## random: games, samples and simulations

```try-python
import random

print(random.randint(1, 6))                     # dice: 1 to 6
print(random.random())                          # 0.0 to 1.0
print(random.choice(["Heads", "Tails"]))
names = ["Amina", "Brian", "Chebet", "Dennis", "Esther"]
print(random.sample(names, 2))                  # 2 different winners
random.shuffle(names)
print(names)

random.seed(42)                                 # same "random" results every run (for testing)
print(random.randint(1, 100), random.randint(1, 100))
```

> `random` is fine for games. For passwords, PINs and security codes use the `secrets` module, which is designed to be unpredictable:

```try-python
import secrets, string
otp = "".join(secrets.choice(string.digits) for _ in range(6))
print("Your code:", otp)
print(secrets.token_urlsafe(16))
```

## statistics

```try-python
import statistics as st

marks = [45, 78, 92, 60, 78, 55]
print("Mean:", round(st.mean(marks), 1))
print("Median:", st.median(marks))
print("Mode:", st.mode(marks))
print("Std dev:", round(st.stdev(marks), 1))
```

## Mini project: a loan schedule

```try-python
from datetime import date, timedelta

principal = 30000
monthly_rate = 0.015            # 1.5% a month
months = 4
payment = round(principal * (1 + monthly_rate * months) / months, 2)

due = date(2026, 10, 5)
print(f"{'#':<3}{'Due date':<14}{'Payment':>10}")
for n in range(1, months + 1):
    print(f"{n:<3}{due.strftime('%d %b %Y'):<14}{payment:>10,.2f}")
    due += timedelta(days=30)
print(f"Total repaid: KSh {payment * months:,.2f}")
```

```quiz
Q: Which datetime method formats a date as text?
A: strftime | strftime()
Q: Which class adds or subtracts days from a date?
A: timedelta
Q: What does math.ceil(4.1) give?
A: 5
Q: Which random function picks a whole number between two values?
A: randint | random.randint
Q: Which module should you use for security codes and passwords?
A: secrets
```
=== exercise ===
Use `timedelta` to print the date 30 days after `date(2026, 9, 1)`. The output should be **2026-10-01**.
=== starter ===
from datetime import date, timedelta
start = date(2026, 9, 1)
# print the due date
=== expected ===
2026-10-01
=== must_contain ===
timedelta(
