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

## Who uses dates and numbers in code?

| Where | Example |
|---|---|
| Lending apps and SACCOs | Due dates, late penalties, interest schedules |
| Schools | Term dates, attendance by week, age on admission |
| Shops and pharmacies | Expiry dates, daily sales reports, opening hours |
| HR and payroll | Working days in a month, leave balances, overtime |
| Games and quizzes | Random questions, dice, shuffled answers |
| Data analysis | Averages, medians and spread of marks, sales or survey answers |

## Working with times and durations

```try-python
from datetime import datetime, timedelta

clock_in = datetime(2026, 9, 28, 7, 55)
clock_out = datetime(2026, 9, 28, 17, 20)
worked = clock_out - clock_in
hours = worked.total_seconds() / 3600
print("Worked:", worked, f"= {hours:.2f} hours")

overtime = max(0, hours - 8)
print(f"Overtime: {overtime:.2f} h, pay KSh {overtime * 250:,.0f}")

meeting = datetime(2026, 10, 1, 9, 0)
reminder = meeting - timedelta(minutes=30)
print("Send reminder at", reminder.strftime("%H:%M on %d %b"))
```

`timedelta` supports `days`, `seconds`, `minutes`, `hours` and `weeks`. There is no `months=` because months have different lengths.

## Adding months safely

```try-python
from datetime import date
import calendar

def add_months(d, n):
    month = d.month - 1 + n
    year = d.year + month // 12
    month = month % 12 + 1
    last_day = calendar.monthrange(year, month)[1]
    return date(year, month, min(d.day, last_day))

start = date(2026, 1, 31)
for i in range(1, 5):
    print(add_months(start, i))      # Feb 28, Mar 31, Apr 30, May 31
print("Days in Feb 2028:", calendar.monthrange(2028, 2)[1])
print("2028 leap year?", calendar.isleap(2028))
```

## Comparing and sorting dates

Dates compare like numbers, so you can sort them, find the earliest and check ranges:

```try-python
from datetime import date

expiry = {
    "Panadol": date(2026, 11, 30),
    "Amoxil": date(2026, 10, 10),
    "ORS": date(2027, 3, 1),
}
today = date(2026, 10, 1)
for drug, exp in sorted(expiry.items(), key=lambda kv: kv[1]):
    days = (exp - today).days
    status = "EXPIRED" if days < 0 else "expires soon" if days <= 30 else "ok"
    print(f"{drug:<8} {exp}  {days:>4} days  {status}")
```

## Working days

```try-python
from datetime import date, timedelta

holidays = {date(2026, 10, 10), date(2026, 10, 20)}   # Mazingira Day, Mashujaa Day (example list)

def working_days(start, end):
    d, count = start, 0
    while d <= end:
        if d.weekday() < 5 and d not in holidays:
            count += 1
        d += timedelta(days=1)
    return count

print("Working days in Oct 2026:", working_days(date(2026, 10, 1), date(2026, 10, 31)))
```

Keep a list of public holidays in your program or a settings file and update it each year, because some holiday dates move or are gazetted at short notice.

## ISO format: the safest way to store dates

Store dates as `YYYY-MM-DD` (ISO 8601) in files and databases. They sort correctly as text and every system understands them:

```try-python
from datetime import date, datetime

d = date(2026, 3, 5)
print(d.isoformat())                         # 2026-03-05
print(date.fromisoformat("2026-12-25"))
print(datetime.fromisoformat("2026-12-25T18:30:00"))
print(sorted(["05/03/2026", "12/01/2026"]))   # wrong order as text!
print(sorted(["2026-03-05", "2026-01-12"]))   # correct order
```

## Time zones in brief

`datetime.now()` gives the computer's local time with no time zone attached ("naive"). Servers often run on UTC, three hours behind Kenya (EAT, UTC+3). For anything shared between systems, use aware datetimes:

```try-python
from datetime import datetime, timezone, timedelta

EAT = timezone(timedelta(hours=3), "EAT")
utc_now = datetime(2026, 9, 28, 6, 0, tzinfo=timezone.utc)
print("UTC:", utc_now)
print("Nairobi:", utc_now.astimezone(EAT))
```

In larger programs, `zoneinfo.ZoneInfo("Africa/Nairobi")` provides the official zone.

## Money and decimals

Floats store numbers in binary, so some decimals can't be represented exactly. For money, either round carefully or use `Decimal`:

```try-python
from decimal import Decimal, ROUND_HALF_UP

print(0.1 + 0.2)                                  # 0.30000000000000004
print(Decimal("0.1") + Decimal("0.2"))            # 0.3

price = Decimal("1999.995")
print(price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
vat = (Decimal("2500") * Decimal("0.16")).quantize(Decimal("0.01"))
print("VAT:", vat)
```

Another common approach is to store amounts in **cents** as integers (KSh 12.50 → 1250) and only format them for display.

## Compound interest and loans

```try-python
principal = 50000
annual_rate = 0.12
years = 3

simple = principal * annual_rate * years
compound = principal * (1 + annual_rate / 12) ** (12 * years) - principal
print(f"Simple interest:   KSh {simple:,.2f}")
print(f"Compound (monthly): KSh {compound:,.2f}")

# reducing-balance monthly payment (standard loan formula)
r = annual_rate / 12
n = years * 12
payment = principal * r / (1 - (1 + r) ** -n)
print(f"Monthly payment: KSh {payment:,.2f}, total KSh {payment * n:,.2f}")
```

## A random simulation: estimating chances

Simulations repeat a random experiment many times to estimate a probability:

```try-python
import random

random.seed(1)
trials = 10000
both_six = sum(1 for _ in range(trials)
               if random.randint(1, 6) == 6 and random.randint(1, 6) == 6)
print(f"Estimated chance of double six: {both_six / trials:.3f} (exact {1/36:.3f})")

# weighted choice: 70% chance of 'small prize'
prizes = random.choices(["small", "medium", "big"], weights=[70, 25, 5], k=10)
print(prizes)
```

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `datetime.strptime("5/3/2026", "%m/%d/%Y")` | Day and month swapped (US order) | Kenya uses day/month: `%d/%m/%Y` |
| Storing dates as `"05/03/2026"` text | Sorts wrongly | Store ISO `2026-03-05` |
| `timedelta(months=1)` | TypeError | Use an add-months function |
| Using `random` for OTPs | Predictable | Use `secrets` |
| Comparing money floats with `==` | Rounding errors | Round, use Decimal or integer cents |

## Practice

1. Ask for a date of birth as text (`DD/MM/YYYY`) and print the exact age in years.
2. Print a 6-month repayment schedule using `add_months` instead of `+30 days`.
3. Simulate 1,000 coin tosses and print how many heads and tails.
4. List all Fridays in December 2026.
5. Given a list of sale timestamps, count sales per hour of the day.

:::think Why might adding `timedelta(days=30)` each month give the wrong due dates for a loan that is due on the 5th of every month?
Months have 28 to 31 days, so adding 30 days drifts: 5 Jan + 30 days is 4 Feb, then 6 Mar, and so on. Use a month-aware calculation that keeps the same day number (and clamps to the last day for the 29th to 31st).
:::

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
Q: Which timedelta method converts a duration to a number of seconds?
A: total_seconds | total_seconds()
Q: Which date format sorts correctly as text and should be used for storage? (name or pattern)
A: ISO | ISO 8601 | YYYY-MM-DD
Q: Which module gives exact decimal arithmetic for money?
A: decimal | Decimal
Q: Which calendar function tells you how many days are in a month?
A: monthrange | calendar.monthrange
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
