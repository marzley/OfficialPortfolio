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
