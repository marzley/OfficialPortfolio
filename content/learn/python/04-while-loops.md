---
slug: while-loops-control
title: while loops, break, continue and loop patterns
after: loops-lists
---
# while loops, break, continue and loop patterns

A `for` loop repeats **for each item**. A `while` loop repeats **as long as a condition is true**: perfect when you don't know in advance how many times you'll loop.

## while

```try-python
savings = 0
week = 0
while savings < 10000:
    savings += 1500
    week += 1
print(f"You reach KSh 10,000 in week {week} with KSh {savings:,}")
```

Every `while` loop needs something inside it that eventually makes the condition **False**, or it runs forever. (Our editor stops runaway loops for you.)

## break: leave the loop early

```try-python
pins = ["1234", "0000", "4821", "9999"]
correct = "4821"
for attempt, pin in enumerate(pins, start=1):
    if pin == correct:
        print(f"Unlocked on attempt {attempt}")
        break
    print(f"Attempt {attempt}: wrong PIN")
```

## continue: skip to the next round

```try-python
orders = [1200, -50, 800, 0, 3000]
total = 0
for amount in orders:
    if amount <= 0:
        continue          # skip invalid amounts
    total += amount
print("Valid total:", total)
```

## else on loops

A loop's `else` runs only if the loop finished **without** `break`. Handy for searches:

```try-python
stock = {"unga": 5, "sugar": 0, "oil": 3}
wanted = "rice"
for item in stock:
    if item == wanted:
        print("Found", wanted)
        break
else:
    print(wanted, "is not sold here")
```

## A menu loop (the classic program shape)

```try-python
# Simulated key presses, so this runs without typing
choices = iter(["1", "2", "3", "9", "4"])
balance = 1000

while True:
    choice = next(choices)   # on your computer: choice = input("Choose 1-4: ")
    if choice == "1":
        print("Balance:", balance)
    elif choice == "2":
        balance += 500
        print("Deposited 500")
    elif choice == "3":
        balance -= 200
        print("Withdrew 200")
    elif choice == "4":
        print("Goodbye!")
        break
    else:
        print("Invalid option", choice)
```

## Useful loop helpers

```try-python
fruits = ["mango", "banana", "pawpaw"]
prices = [50, 10, 120]

for i, f in enumerate(fruits, start=1):      # number the items
    print(i, f)

for f, p in zip(fruits, prices):             # loop two lists together
    print(f"{f}: KSh {p}")

for n in range(10, 0, -3):                   # count down in steps of 3
    print(n, end=" ")
print()

for f in reversed(fruits):
    print(f, end=" ")
print()
```

## Nested loops: a multiplication table

```try-python
for row in range(1, 6):
    line = ""
    for col in range(1, 6):
        line += f"{row * col:4}"
    print(line)
```

## Loop patterns you'll reuse forever

```try-python
marks = [45, 78, 92, 60, 33, 88]

# 1. Count
passed = 0
for m in marks:
    if m >= 50:
        passed += 1

# 2. Sum and average
average = sum(marks) / len(marks)

# 3. Find the maximum by hand
best = marks[0]
for m in marks:
    if m > best:
        best = m

# 4. Build a new list
grades = []
for m in marks:
    grades.append("A" if m >= 80 else "B" if m >= 60 else "C" if m >= 50 else "F")

print(passed, round(average, 1), best, grades)
```

## Input validation loops

A very common use of `while` is asking until the input is valid. Here the inputs are simulated so the example runs anywhere:

```try-python
attempts = iter(["abc", "-5", "1500"])     # pretend these are typed by the user

while True:
    typed = next(attempts)
    print("User typed:", typed)
    if not typed.lstrip("-").isdigit():
        print("  Please enter a number.")
        continue
    amount = int(typed)
    if amount <= 0:
        print("  Amount must be positive.")
        continue
    break
print("Accepted amount:", amount)
```

## Avoiding infinite loops

A `while` loop needs something inside it that eventually makes the condition False:

| Problem | Example | Fix |
|---|---|---|
| Counter never changes | `while i < 10: print(i)` | Add `i += 1` |
| Condition can never be reached | `while x != 10: x += 3` (from 0: 3, 6, 9, 12...) | Use `x < 10` |
| `while True` with no `break` | Runs forever | Make sure every path can reach `break` |

If a program gets stuck, press **Ctrl+C** to stop it.

## Simulations with while

Loops are perfect for "how long until..." questions:

```try-python
# A chama saves KSh 20,000 per month and earns 0.8% interest monthly.
# How many months to reach KSh 500,000?
balance, months = 0.0, 0
while balance < 500_000:
    balance = balance * 1.008 + 20_000
    months += 1
print(f"{months} months ({months // 12} years {months % 12} months), balance KSh {balance:,.0f}")

# A loan of KSh 100,000 at 1.5% monthly interest, repaid KSh 9,000 a month
loan, month = 100_000.0, 0
while loan > 0:
    loan = loan * 1.015 - 9_000
    month += 1
print(f"Loan cleared in {month} months")
```

## enumerate, zip and range in loops

```try-python
students = ["Brian", "Faith", "Juma"]
marks = [72, 88, 55]

for position, name in enumerate(students, start=1):
    print(position, name)

for name, mark in zip(students, marks):
    print(f"{name}: {mark}")

for i in range(10, 0, -3):          # count down in steps of 3
    print(i, end=" ")
print()
```

## for or while?

| Use `for` when... | Use `while` when... |
|---|---|
| You loop over a collection or a known range | You don't know how many times in advance |
| Processing every item in a list/file | Waiting for valid input, a condition, a target |
| Example: total every sale | Example: months until savings reach a goal |

## Practice

1. Print all even numbers from 2 to 20 with a `while` loop.
2. Simulate a PIN check: allow 3 attempts from a list of guesses, print "Locked" if all fail.
3. A population of 1,000 chicks grows 8% a month; how many months to exceed 5,000?
4. Use `zip` to print each item with its price and the running total.

:::think What's the difference between `break` and `continue` inside a loop?
`break` exits the loop completely and moves on to the code after it. `continue` skips the rest of the current round and jumps to the next iteration of the same loop.
:::

```quiz
Q: Which loop keeps going as long as a condition is True?
A: while
Q: Which keyword leaves a loop immediately?
A: break
Q: Which keyword skips to the next round of the loop?
A: continue
Q: Which function numbers the items while looping?
A: enumerate | enumerate()
Q: Which function loops over two lists together?
A: zip | zip()
Q: Which key combination stops a program stuck in an infinite loop?
A: Ctrl+C | ctrl c
Q: Which built-in gives both the index and the item in a for loop?
A: enumerate
Q: Which built-in pairs items from two lists together?
A: zip
```
=== exercise ===
Use a `while` loop to print the numbers **1 to 5**, one per line.
=== starter ===
n = 1
# while loop here
=== expected ===
1
2
3
4
5
=== must_contain ===
while
