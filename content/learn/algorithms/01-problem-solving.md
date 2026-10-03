---
slug: problem-solving-steps
title: How to solve programming problems step by step
after: pseudocode-flowcharts
---
# How to solve programming problems step by step

Beginners often stare at a blank editor. Experienced programmers don't know the answer instantly either: they follow a **process**. Use this one for exercises, exams and job interviews.

## The 6-step method

1. **Understand** the problem. Restate it in your own words. What are the inputs and outputs?
2. **Examples**: work 2–3 examples by hand, including an unusual one (empty list, zero, negative).
3. **Break it down** into small steps (pseudocode).
4. **Code** one small step at a time, running as you go.
5. **Test** with your examples and edge cases.
6. **Improve**: tidy names, remove repetition, think about speed.

## Worked example: "Find the second-highest mark"

**1. Understand.** Input: a list of marks. Output: the second-highest *different* mark.

**2. Examples.**

| Input | Output | Note |
|---|---|---|
| [45, 78, 92, 60] | 78 | normal |
| [90, 90, 85] | 85 | duplicates of the top mark |
| [70] | None | only one mark |
| [] | None | empty |

**3. Break it down (pseudocode).**

```
remove duplicates
if fewer than 2 marks: return nothing
sort from highest to lowest
return the second one
```

**4 & 5. Code and test.**

```try-python
def second_highest(marks):
    unique = sorted(set(marks), reverse=True)
    if len(unique) < 2:
        return None
    return unique[1]

tests = [([45, 78, 92, 60], 78), ([90, 90, 85], 85), ([70], None), ([], None)]
for marks, expected in tests:
    result = second_highest(marks)
    print(marks, "->", result, "OK" if result == expected else f"FAIL (expected {expected})")
```

**6. Improve.** Sorting is fine for a class list. For millions of numbers we could scan once, keeping the top two:

```try-python
def second_highest_fast(marks):
    first = second = None
    for m in marks:
        if first is None or m > first:
            first, second = m, first
        elif m != first and (second is None or m > second):
            second = m
    return second

print(second_highest_fast([45, 78, 92, 60]), second_highest_fast([90, 90, 85]), second_highest_fast([70]))
```

## Strategies when you're stuck

| Strategy | How it helps |
|---|---|
| **Solve it by hand** | Write out exactly what *you* do; that's the algorithm |
| **Simplify** | Solve for a list of 2 items first, then generalise |
| **Work backwards** | Start from the output you need |
| **Look for a pattern** | Print intermediate values and look |
| **Use known building blocks** | Counting, summing, searching, sorting, filtering |
| **Draw it** | Boxes and arrows for lists, trees, networks |
| **Rubber duck** | Explain your code line by line out loud |
| **Take a break** | Many solutions appear after a short walk |

## Common building blocks (patterns)

```try-python
nums = [4, 9, 2, 9, 7]

total = 0                      # accumulate
for n in nums: total += n

count_nines = 0                # count
for n in nums:
    if n == 9: count_nines += 1

biggest = nums[0]              # track the best so far
for n in nums:
    if n > biggest: biggest = n

seen, dupes = set(), set()     # detect duplicates with a set
for n in nums:
    if n in seen: dupes.add(n)
    seen.add(n)

print(total, count_nines, biggest, dupes)
```

Most beginner problems are a combination of these.

## Practice sites

Start easy and practise a little every day: our Python and Algorithms exercises, then sites like Exercism, HackerRank, LeetCode (Easy level), Codewars and Kenya's own hackathons and competitions.

## Why problem solving is the core skill

Programming languages change; problem-solving skills last. Employers test them in technical interviews, and every real task (calculating loan schedules, matching payments to invoices, finding the cheapest delivery route) starts with understanding the problem and designing steps before writing code. Practising structured problem solving makes you faster and more confident in any language.

## Applying the method: matching payments to invoices

**Problem**: a school has a list of invoices (admission number, amount due) and a list of M-Pesa payments (account number = admission number, amount). Find who has fully paid, who has partly paid and who hasn't paid.

1. **Understand**: inputs are two lists; output is three groups. Several payments can belong to one student. Account numbers may have spaces or lowercase letters.
2. **Examples**: ADM001 owes 15,000 and paid 10,000 + 5,000 → fully paid. ADM002 owes 15,000 and paid 4,000 → partial. ADM003 paid nothing → unpaid.
3. **Edge cases**: overpayment, payment with an unknown account number, empty lists.
4. **Plan**: total payments per account in a dictionary, then compare each invoice with its total.
5. **Code**, then **test** with the examples and edge cases.

```try-python
invoices = {"ADM001": 15000, "ADM002": 15000, "ADM003": 12000, "ADM004": 8000}
payments = [("adm001", 10000), (" ADM001", 5000), ("ADM002", 4000), ("ADM004", 9000), ("ADM999", 3000)]

paid = {}
unknown = []
for account, amount in payments:
    key = account.strip().upper()          # clean the account number
    if key in invoices:
        paid[key] = paid.get(key, 0) + amount
    else:
        unknown.append((account, amount))

for adm, due in invoices.items():
    total = paid.get(adm, 0)
    if total == 0:
        status = "UNPAID"
    elif total < due:
        status = f"PARTIAL (balance {due - total:,})"
    elif total == due:
        status = "PAID"
    else:
        status = f"OVERPAID by {total - due:,}"
    print(f"{adm}: due {due:,}, paid {total:,} -> {status}")
print("Payments to unknown accounts:", unknown)
```

The plan (group, then compare) came before the code, and edge cases (cleaning account numbers, overpayments, unknown accounts) shaped it.

## Thinking about efficiency (a first look at Big O)

How does the work grow as the input grows?

| Approach to "is this receipt a duplicate?" | Work for n receipts | Big O |
|---|---|---|
| Compare every receipt with every other | About n × n comparisons | O(n²) |
| Sort first, then compare neighbours | About n log n | O(n log n) |
| Keep a set of seen receipts | About n set lookups | O(n) |

```try-python
import time

receipts = [f"QJK{i}" for i in range(2000)] + ["QJK10"]

start = time.perf_counter()
dups_slow = {r for i, r in enumerate(receipts) for s in receipts[i + 1:] if r == s}
slow = time.perf_counter() - start

start = time.perf_counter()
seen, dups_fast = set(), set()
for r in receipts:
    if r in seen:
        dups_fast.add(r)
    seen.add(r)
fast = time.perf_counter() - start

print(dups_slow, dups_fast)
print(f"Nested loops took about {slow / max(fast, 1e-9):.0f}x longer than the set approach")
```

For a few hundred items any approach works; for millions of M-Pesa transactions, the choice of algorithm decides whether a report takes seconds or hours.

## Debugging your own solution

When code gives the wrong answer:

1. **Reproduce** with the smallest input that fails.
2. **Print or inspect** values at each step (or use a debugger with breakpoints).
3. **Check assumptions**: is the input what you think (types, spaces, case)?
4. **Trace by hand** on paper for a small example.
5. **Fix one thing at a time**, then rerun all your test cases.

```try-python
def average(marks):
    return sum(marks) / len(marks)

tests = [([80, 60], 70), ([50], 50), ([], 0)]
for marks, expected in tests:
    try:
        result = average(marks)
    except ZeroDivisionError:
        result = "error"
    print(marks, "->", result, "expected", expected, "OK" if result == expected else "FIX ME")
```

The failing empty-list test shows exactly what to fix: `return sum(marks) / len(marks) if marks else 0`.

## Breaking big problems into smaller ones

**Problem**: "Build a weekly sales report for a shop."

| Sub-problem | Function |
|---|---|
| Read sales data | `load_sales(path)` |
| Clean bad rows | `clean(rows)` |
| Total by day | `totals_by_day(rows)` |
| Best-selling products | `top_products(rows, n)` |
| Format the report | `format_report(...)` |

Each small function is easy to write and test. This **decomposition** is how large programs are built.

## Interview-style practice approach

1. Repeat the problem in your own words and ask clarifying questions.
2. Work through an example out loud.
3. Describe a simple (even slow) solution first.
4. Improve it, explaining the time and space trade-offs.
5. Write clean code with good names.
6. Test with normal and edge cases before saying you're done.

Interviewers value clear thinking and communication as much as the final code.

## Practice

1. Given a list of daily sales, find the longest streak of days with sales above KSh 10,000.
2. Given two lists of phone numbers (customers and blacklist), return customers who are not blacklisted, efficiently.
3. Check whether two words are anagrams ("listen", "silent").
4. Find the first non-repeating character in a string.
5. Given a list of prices and a budget, find two different items whose prices add up exactly to the budget.

:::think You need to check 100,000 new payments against a list of 50,000 already-processed receipt codes. Why is converting the processed list to a set a good idea?
Checking `code in list` scans the list each time (up to 50,000 comparisons per payment, billions in total), while `code in set` uses hashing and takes roughly constant time per check. Building the set once costs about 50,000 steps, after which 100,000 checks are fast, turning a very slow job into a quick one.
:::

```quiz
Q: What is the first step in solving a problem?
A: understand | understand the problem
Q: What do we call unusual inputs like an empty list or zero? (two words, hyphen allowed)
A: edge cases | edge case | edge-cases
Q: Which Python type removes duplicates quickly?
A: set
Q: What informal plan written in plain words comes before code?
A: pseudocode
Q: What is the Big O of checking every item against every other item?
A: O(n^2) | O(n²) | n squared | O(n*n)
Q: What is splitting a big problem into smaller functions called?
A: decomposition
Q: Which Python structure gives fast membership checks for duplicates?
A: set
```
=== exercise ===
Write `count_even(nums)` that returns how many numbers in the list are even, and print `count_even([4, 7, 10, 3, 8])`. Output: **3**.
=== starter ===
def count_even(nums):
    pass

print(count_even([4, 7, 10, 3, 8]))
=== expected ===
3
=== must_contain ===
def count_even
% 2
