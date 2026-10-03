---
slug: operators-booleans
title: Operators, booleans and making decisions
after: numbers-strings
---
# Operators, booleans and making decisions

Programs make decisions by comparing values. The result of a comparison is a **boolean**: `True` or `False`. This lesson covers every operator you'll use.

## Arithmetic operators

```try-python
a, b = 17, 5
print(a + b, a - b, a * b)   # 22 12 85
print(a / b)                 # 3.4   true division (always a float)
print(a // b)                # 3     floor division (whole part)
print(a % b)                 # 2     remainder
print(a ** 2)                # 289   power
print(divmod(a, b))          # (3, 2) both at once
```

`//` and `%` are great for splitting things: 130 minutes = `130 // 60` hours and `130 % 60` minutes.

```try-python
minutes = 130
print(f"{minutes // 60} h {minutes % 60} min")

shillings = 2750
print("1000s:", shillings // 1000, "remaining:", shillings % 1000)
```

## Assignment shortcuts

```try-python
total = 100
total += 50    # total = total + 50
total -= 20
total *= 2
total //= 3
print(total)
```

## Comparison operators

| Operator | Meaning |
|---|---|
| `==` | equal to |
| `!=` | not equal to |
| `>` `<` | greater / less than |
| `>=` `<=` | greater or equal / less or equal |

```try-python
marks = 67
print(marks >= 50)       # True
print(marks == 100)      # False
print("Nairobi" == "nairobi")  # False: case matters
print(18 <= marks <= 70) # True: Python allows chained comparisons
```

## Logical operators: and, or, not

```try-python
age = 20
has_id = True
has_ticket = False

print(age >= 18 and has_id)          # both must be True
print(has_ticket or age < 12)        # at least one True
print(not has_ticket)                # reverses

can_enter = age >= 18 and has_id and has_ticket
print("Can enter:", can_enter)
```

| A | B | A and B | A or B |
|---|---|---|---|
| True | True | True | True |
| True | False | False | True |
| False | True | False | True |
| False | False | False | False |

## Membership and identity

```try-python
towns = ["Nakuru", "Naivasha", "Gilgil"]
print("Naivasha" in towns)       # True
print("Thika" not in towns)      # True
print("robi" in "Nairobi")       # True: works on text too

x = None
print(x is None)                 # use "is" to check for None
```

## Truthy and falsy

In an `if`, these count as False: `False`, `0`, `0.0`, `""`, `[]`, `{}`, `None`. Everything else is True.

```try-python
cart = []
if cart:
    print("Checkout")
else:
    print("Your cart is empty")
```

## Putting it together: a loan eligibility check

```try-python
monthly_income = 45000
existing_loans = 1
credit_score = 640
is_employed = True

eligible = is_employed and monthly_income >= 30000 and existing_loans < 2 and credit_score >= 600
limit = monthly_income * 3 if eligible else 0     # conditional expression

print("Eligible:", eligible)
print(f"Loan limit: KSh {limit:,}")
```

## Operator precedence

Python follows maths order: `**` first, then `* / // %`, then `+ -`, then comparisons, then `not`, `and`, `or`. When in doubt, use brackets: they make code clearer anyway.

```try-python
print(2 + 3 * 4)       # 14
print((2 + 3) * 4)     # 20
print(True or False and False)   # True: "and" runs before "or"
```

## Short-circuit evaluation

`and` and `or` stop as soon as the answer is known. Python uses this to avoid errors and to provide defaults:

```try-python
items = []
# Without short-circuiting, items[0] would crash on an empty list:
if items and items[0] > 100:
    print("First item is expensive")
else:
    print("No items, or the first is cheap")

nickname = ""
display = nickname or "Guest"      # or returns the first truthy value
print("Welcome,", display)

count = 0
print(count != 0 and 100 / count)  # safe: division never happens when count is 0
```

## Chained comparisons and conditional expressions

```try-python
mark = 72
print(50 <= mark < 80)                       # same as 50 <= mark and mark < 80
age = 17
status = "adult" if age >= 18 else "minor"   # one-line if/else (conditional expression)
print(status)

temperature = 31
advice = "Hot: drink water" if temperature > 30 else "Cool" if temperature < 18 else "Pleasant"
print(advice)
```

Keep conditional expressions short; use a normal `if/elif/else` when logic gets longer.

## match: pattern matching (Python 3.10+)

```try-python
def handle(command):
    match command.split():
        case ["balance"]:
            return "Your balance is KSh 3,450"
        case ["send", amount, phone]:
            return f"Sending KSh {amount} to {phone}"
        case ["help" | "menu"]:
            return "Options: balance, send <amount> <phone>"
        case _:
            return "Unknown command"

for c in ["balance", "send 500 0712345678", "menu", "withdraw"]:
    print(c, "->", handle(c))
```

## Worked example: M-Pesa-style fee bands

Decisions often check ranges. Here are example bands for practice (not real tariffs):

```try-python
def fee(amount):
    if amount < 1:
        raise ValueError("Amount must be at least KSh 1")
    elif amount <= 100:
        return 0
    elif amount <= 1_500:
        return 15
    elif amount <= 5_000:
        return 30
    elif amount <= 20_000:
        return 50
    return 100

for a in [50, 100, 101, 1500, 1501, 25000]:
    print(f"KSh {a:>6,}: fee KSh {fee(a)}")
```

Test **boundary values** (100, 101, 1,500, 1,501): that's where most bugs hide.

## Common mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `if x = 5:` | `=` assigns; SyntaxError | Use `==` to compare |
| `if mark > 50 or < 80:` | Invalid syntax | `if 50 < mark < 80:` |
| `if answer == "yes" or "y":` | Always True ("y" is truthy) | `if answer in ("yes", "y"):` |
| Checking `> 80` after `> 50` | First match wins; wrong branch | Order from most to least strict |
| `is` to compare numbers/strings | Compares identity, not value | Use `==` (use `is` only for `None`) |

## Practice

1. Write `can_vote(age, has_id)` returning True only if age ≥ 18 and has_id is True.
2. Write a grade function with A (80+), B (65–79), C (50–64), D (40–49), E (below 40), and test boundaries.
3. Given hours worked, pay KSh 300/hour, with overtime (over 40 hours) at 1.5×. Print the pay for 35, 40 and 46 hours.
4. Rewrite `if x > 0: sign = "positive" else: sign = "not positive"` as a conditional expression.

:::think Why does `if answer == "yes" or "y":` always run, even when answer is "no"?
Python reads it as `(answer == "yes") or ("y")`. The second part, the non-empty string "y", is always truthy, so the whole condition is True. Write `if answer in ("yes", "y"):` or `if answer == "yes" or answer == "y":`.
:::

```quiz
Q: What does 17 // 5 give?
A: 3
Q: What does 17 % 5 give?
A: 2
Q: What does 2 ** 3 give?
A: 8
Q: What is the result of True and False?
A: False
Q: Which keyword checks whether a value is in a list?
A: in
Q: What does "" or "Guest" return?
A: Guest | "Guest"
Q: Which keyword starts structural pattern matching in Python 3.10+?
A: match
Q: Is 50 <= 72 < 80 True or False?
A: True
```
=== exercise ===
Given `minutes = 135`, print the hours and remaining minutes as **2 h 15 min** using `//` and `%`.
=== starter ===
minutes = 135
# print "2 h 15 min"
=== expected ===
2 h 15 min
=== must_contain ===
//
%
