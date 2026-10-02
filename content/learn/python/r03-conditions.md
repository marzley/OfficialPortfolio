---
slug: conditions
title: "If statements: making decisions with if, elif, else, and, or, not and match"
after: KEEP
---
# If statements: making decisions with if, elif, else, and, or, not and match

A program that always does the same thing isn't very useful. Real programs decide: award a grade from marks, charge delivery only under a certain amount, reject an invalid phone number, show a different message for a failed M-Pesa payment. In Python these decisions use `if`, `elif` and `else`. This unit explains them in depth, with booleans, comparisons, logical operators, truthiness and the newer `match` statement.

:::note What you will learn
- Booleans and comparison operators
- `if`, `elif`, `else` and indentation
- Logical operators `and`, `or`, `not`, and chained comparisons
- Truthy and falsy values
- Nested conditions and guard clauses
- Conditional expressions (one-line if)
- `match` / `case` (Python 3.10+)
- Real examples: grading, fees, validation
:::

## Booleans and comparisons

A **boolean** is `True` or `False` (capital T and F in Python). Comparisons produce booleans:

| Operator | Meaning | Example (`x = 10`) |
|---|---|---|
| `==` | Equal to | `x == 10` → True |
| `!=` | Not equal | `x != 5` → True |
| `>` `<` | Greater / less than | `x > 10` → False |
| `>=` `<=` | Greater/less or equal | `x >= 10` → True |
| `in` | Is in a sequence | `"a" in "Kenya"` → True |
| `is` | Same object (use for `None`) | `x is None` → False |

```try-python
age = 19
print(age >= 18)         # True
print(age == "19")       # False: int is not equal to str
print("Nai" in "Nairobi")
print(type(age >= 18))   # <class 'bool'>
```

:::warning = vs ==
`=` **assigns** a value (`age = 19`); `==` **compares** (`age == 19`). Writing `if age = 19:` is a SyntaxError in Python, which at least catches the mistake for you.
:::

## `if`, `elif`, `else`

```try-python
marks = 72

if marks >= 80:
    print("Grade A")
elif marks >= 65:
    print("Grade B")
elif marks >= 50:
    print("Grade C")
else:
    print("Grade D: let's revise together")

print("Done")
```

- Each condition ends with a **colon** `:`.
- The block under it is **indented** (4 spaces).
- Python checks conditions top to bottom and runs **only the first** true block.
- `elif` (else if) and `else` are optional.

Order matters: check the strictest/highest condition first.

## Logical operators

| Operator | True when |
|---|---|
| `and` | Both conditions are true |
| `or` | At least one is true |
| `not` | Reverses True/False |

```try-python
total = 2500
county = "Nairobi"
is_member = False

if county == "Nairobi" and total >= 2000:
    print("Free delivery")

if is_member or total > 5000:
    print("10% discount")
else:
    print("No discount")

if not is_member:
    print("Join our loyalty club for discounts")
```

### Chained comparisons

Python lets you write ranges naturally:

```try-python
marks = 67
if 65 <= marks < 80:
    print("Grade B range")

hour = 14
if 8 <= hour < 17:
    print("Office is open")
```

### `in` for several options

```try-python
county = "Kiambu"
if county in ("Nairobi", "Kiambu", "Kajiado", "Machakos"):
    print("Same-day delivery available")
```

Much cleaner than `county == "Nairobi" or county == "Kiambu" or ...`.

## Truthy and falsy values

In conditions, values count as true or false. **Falsy:** `False`, `None`, `0`, `0.0`, `""` (empty string), `[]`, `{}`, `()`, `set()`. Everything else is truthy.

```try-python
phone = ""
if not phone:
    print("Please enter your phone number")

cart = ["Unga"]
if cart:
    print(f"You have {len(cart)} item(s)")
```

## Nested conditions and guard clauses

You can put `if` inside `if`, but deep nesting is hard to read:

```try-python
def can_withdraw(balance, amount, pin_ok):
    if pin_ok:
        if amount > 0:
            if amount <= balance:
                return "Approved"
            else:
                return "Insufficient balance"
        else:
            return "Enter a valid amount"
    else:
        return "Wrong PIN"

print(can_withdraw(5000, 1500, True))
```

**Guard clauses** handle problems first and return early, keeping code flat:

```try-python
def can_withdraw(balance, amount, pin_ok):
    if not pin_ok:
        return "Wrong PIN"
    if amount <= 0:
        return "Enter a valid amount"
    if amount > balance:
        return "Insufficient balance"
    return "Approved"

for case in [(5000, 1500, True), (5000, 9000, True), (5000, 100, False), (5000, -5, True)]:
    print(case, "->", can_withdraw(*case))
```

## Conditional expressions (one-line if)

```try-python
stock = 0
label = "In stock" if stock > 0 else "Out of stock"
print(label)

qty = 1
print(f"{qty} item{'s' if qty != 1 else ''} in your cart")
```

Use for simple value choices only.

## `match` / `case` (Python 3.10+)

`match` compares a value against patterns, like `switch` in other languages but more powerful:

```try-python
def payment_message(code):
    match code:
        case 0:
            return "Payment successful"
        case 1032:
            return "You cancelled the payment"
        case 1:
            return "Insufficient balance"
        case 1037:
            return "No response from your phone. Try again."
        case _:
            return f"Payment failed (code {code})"

for c in [0, 1032, 1, 2001]:
    print(c, payment_message(c))
```

`case _:` is the default. `match` can also unpack structures:

```try-python
def describe(command):
    match command.split():
        case ["add", item]:
            return f"Adding {item} to the cart"
        case ["remove", item]:
            return f"Removing {item}"
        case ["checkout"]:
            return "Going to checkout"
        case _:
            return "Unknown command"

print(describe("add unga"))
print(describe("checkout"))
print(describe("fly away"))
```

## Real-world examples

### Validating a Kenyan phone number

```try-python
def check_phone(raw):
    digits = "".join(ch for ch in raw if ch.isdigit())
    if not digits:
        return "Enter your phone number"
    if digits.startswith("0") and len(digits) == 10 and digits[1] in "17":
        return "OK"
    if digits.startswith("254") and len(digits) == 12 and digits[3] in "17":
        return "OK"
    return "Enter a valid number like 0712 345 678"

for p in ["", "0712 345 678", "254112345678", "0812345678", "12345"]:
    print(repr(p), "->", check_phone(p))
```

### Matatu fare rules

```try-python
def fare(age, is_student, peak_hour):
    if age < 5:
        return 0
    base = 120 if peak_hour else 80
    if is_student:
        return base // 2
    return base

print(fare(4, False, True))    # 0
print(fare(20, True, True))    # 60
print(fare(35, False, False))  # 80
```

:::think A program checks "if marks > 50: pass" but a student with exactly 50 complains they failed. What's wrong?
The rule should probably be "50 or more passes", so the comparison must be `>=`, not `>`. Boundary values (exactly 50, exactly 2,000, exactly 18) are where most condition bugs hide; always test them.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Missing colon after the condition | `if x > 5:` |
| Wrong indentation | 4 spaces for the block |
| `else if` | Python uses `elif` |
| Comparing input strings to numbers | `int(input(...))` first |
| `x == 1 or 2` (always true!) | `x == 1 or x == 2` or `x in (1, 2)` |
| Wrong order of `elif` thresholds | Highest/strictest first |
| `== None` | `is None` |
| `true`/`false` lowercase | `True`/`False` |

## Practice tasks

1. Write a program that prints whether a number is positive, negative or zero.
2. Grade marks 0–100 into A–E, and print "Invalid marks" outside that range.
3. Use `in` to check whether a county is in a list of counties you deliver to.
4. Rewrite a nested `if` as guard clauses.
5. Use `match` to print the day name for numbers 1–7, with a default for anything else.

## Summary

- Booleans are `True`/`False`; comparisons use `==`, `!=`, `<`, `>`, `<=`, `>=`, `in`, `is`.
- `if / elif / else` with colons and 4-space indentation; only the first true block runs.
- `and`, `or`, `not`; chained comparisons like `65 <= x < 80`; `in` for several options.
- Falsy: `False`, `None`, `0`, empty strings and collections.
- Guard clauses keep code flat; one-line `a if cond else b`; `match`/`case` for many patterns (3.10+).
- Test boundary values.

```quiz
Q: Which keyword means "else if" in Python?
A: elif
Q: What character ends an if line?
A: : | colon
Q: What do Python booleans look like? Write true with the correct capitalisation.
A: True
Q: Is an empty list truthy or falsy?
A: falsy
Q: Write the chained comparison for x between 10 (included) and 20 (excluded).
A: 10 <= x < 20 | 10<=x<20
Q: In match/case, which pattern is the default?
A: _ | case _
Q: How should you compare a variable with None? (two words)
A: is None
```
=== exercise ===
Given `marks = 45`, print **Pass** if marks are 50 or more, otherwise print **Fail**.
=== starter ===
marks = 45
=== expected ===
Fail
=== must_contain ===
if
