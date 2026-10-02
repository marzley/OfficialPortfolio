---
slug: big-o
title: "Big O: measuring how fast code grows, common complexities, analysing loops, space complexity and practical optimisation"
after: KEEP
---
# Big O: measuring how fast code grows, common complexities, analysing loops, space complexity and practical optimisation

Code that works on 10 records can become painfully slow on 100,000. A school system that checks every student against every other student, a shop app that searches the whole product list for each order line, or a report that re-reads the database inside a loop may be fine in testing and then grind to a halt in real use. **Big O notation** describes how an algorithm's running time (or memory) **grows** as the input grows. It helps you predict performance, compare solutions, and answer the "what's the time complexity?" questions that appear in almost every developer interview.

:::note What you will learn
- Why we measure growth rather than seconds
- What Big O means, and dropping constants and smaller terms
- The common complexities: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
- How to analyse loops, nested loops and function calls
- Best, average and worst cases
- Space complexity
- Complexity of common Python operations
- Practical optimisation: choosing better data structures and algorithms
:::

## Why growth, not seconds?

Running time in seconds depends on the computer, language and other programs running. Big O ignores those details and asks: **if the input doubles, what happens to the work?**

| Input size n | O(1) | O(log n) | O(n) | O(n log n) | O(n²) |
|---|---|---|---|---|---|
| 10 | 1 | ~3 | 10 | ~33 | 100 |
| 1,000 | 1 | ~10 | 1,000 | ~10,000 | 1,000,000 |
| 1,000,000 | 1 | ~20 | 1,000,000 | ~20,000,000 | 1,000,000,000,000 |

```try-python
import math
print(f"{'n':>10} {'log n':>7} {'n log n':>12} {'n^2':>16}")
for n in [10, 100, 1_000, 10_000, 1_000_000]:
    print(f"{n:>10,} {math.log2(n):>7.1f} {n * math.log2(n):>12,.0f} {n * n:>16,}")
```

## Rules of Big O

1. **Drop constants**: O(2n) → O(n); O(500) → O(1).
2. **Keep the dominant term**: O(n² + n + 100) → O(n²), because n² dominates for large n.
3. **Different inputs, different variables**: looping over list A then list B is O(a + b); nested loops over both are O(a × b).
4. Big O usually means the **worst case** unless stated otherwise.

## Common complexities

### O(1): constant

The work doesn't depend on input size.

```python
first = items[0]             # index access
price = prices["mango"]      # dictionary lookup (average)
items.append(x)              # list append (amortised)
```

### O(log n): logarithmic

Each step cuts the problem in half: binary search, balanced tree lookups, database indexes.

### O(n): linear

Work grows in proportion to the input: one loop over the data.

```try-python
def total(prices):
    s = 0
    for p in prices:      # runs n times
        s += p
    return s
print(total([120, 450, 80, 300]))
```

### O(n log n): linearithmic

Efficient sorting (merge sort, Timsort), many divide-and-conquer algorithms.

### O(n²): quadratic

Nested loops over the same data: comparing every item with every other.

```try-python
def has_duplicate_slow(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):   # nested loop
            if items[i] == items[j]:
                return True
    return False

def has_duplicate_fast(items):
    seen = set()
    for x in items:                         # one loop, set lookups are O(1) on average
        if x in seen:
            return True
        seen.add(x)
    return False

receipts = ["QJK1", "QJK2", "QJK3", "QJK2"]
print(has_duplicate_slow(receipts), has_duplicate_fast(receipts))
```

Same answer, very different growth: O(n²) vs O(n).

### O(2ⁿ) and O(n!): exponential and factorial

Work explodes: trying every subset or every ordering (naive recursive Fibonacci, brute-force route planning). Only usable for tiny inputs; dynamic programming or clever algorithms are needed (see the dynamic programming lesson).

## Analysing code step by step

1. Count how many times each loop runs in terms of n.
2. Nested loops **multiply**; sequential blocks **add**.
3. Function calls cost their own complexity (calling an O(n) function inside an O(n) loop gives O(n²)).
4. Simplify with the rules.

```python
def report(students):            # n students
    for s in students:           # O(n)
        print(s)
    for s in students:           # O(n)
        for t in students:       # O(n) inside → O(n²)
            compare(s, t)
# total O(n + n²) → O(n²)
```

Hidden loops to watch for: `x in list` (O(n)), `list.index()`, `list.remove()`, `list.insert(0, x)`, string concatenation in loops, and **database queries inside loops** (the "N+1 query" problem in web apps).

## Measure it

```try-python
import time

def count_pairs_slow(n):
    c = 0
    for i in range(n):
        for j in range(n):
            c += 1
    return c

for n in [200, 400, 800]:
    t = time.perf_counter()
    count_pairs_slow(n)
    print(f"n={n}: {time.perf_counter() - t:.4f}s")
```

Doubling n roughly **quadruples** the time for O(n²) code: that pattern tells you the complexity even without maths.

## Best, average and worst cases

| Algorithm | Best | Average | Worst |
|---|---|---|---|
| Linear search | O(1) | O(n) | O(n) |
| Binary search | O(1) | O(log n) | O(log n) |
| Quick sort | O(n log n) | O(n log n) | O(n²) |
| Dictionary lookup | O(1) | O(1) | O(n) (rare, many collisions) |

Plan for the worst case when it matters (e.g. payment systems under heavy load).

## Space complexity

Big O also measures **memory**:
- Summing a list with a running total: O(1) extra space.
- Making a copy of the list or a set of seen items: O(n) extra space.
- Recursion uses stack space: depth n → O(n).

There's often a **time–space trade-off**: the fast duplicate check uses O(n) memory to save time.

## Complexity of common Python operations

| Operation | list | dict / set |
|---|---|---|
| Access by index / key | O(1) | O(1) average |
| `x in collection` | O(n) | O(1) average |
| Append / add | O(1) amortised | O(1) average |
| Insert/remove at the start | O(n) | — |
| Remove by value | O(n) | O(1) average |
| Sort | O(n log n) | — |

`collections.deque` gives O(1) appends and pops at both ends (good for queues).

## Practical optimisation

1. **Measure first** (time it, profile it); don't guess.
2. **Choose the right data structure**: sets/dicts for membership and lookups, deque for queues, heaps for priorities.
3. **Avoid repeated work**: compute once outside the loop; cache results.
4. **Use built-ins** (written in C, very fast): `sum`, `sorted`, `max`, `in` on sets.
5. **Push work to the database**: use SQL `WHERE`, `JOIN`, `GROUP BY` and indexes instead of loading everything into Python.
6. **Batch** network/database calls instead of one per item.
7. Keep code readable: optimise the slow parts that matter, not everything.

:::think A web app shows each order with its customer's name. The code loads 2,000 orders, then for each order runs a separate database query to get the customer. Why is this slow, and how would you fix it?
It's the N+1 query problem: 1 query for orders plus 2,000 customer queries, each with network and database overhead (effectively O(n) round trips). Fix with a single SQL JOIN between orders and customers (with an index on customer ID), or load all needed customers in one query into a dictionary and look them up in O(1).
:::

## Summary

- Big O describes how work grows with input size, ignoring hardware and constants.
- Drop constants and smaller terms; sequential blocks add, nested loops multiply.
- Know O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ) and recognise them in code.
- Consider best/average/worst cases and space complexity (time–space trade-offs).
- Optimise by measuring, choosing better data structures (sets, dicts), avoiding hidden loops and N+1 queries, and using built-ins and the database.

```quiz
Q: What is the Big O of looking up a key in a Python dictionary (average)?
A: O(1) | 1 | constant
Q: What is the Big O of two nested loops over the same list of n items?
A: O(n^2) | O(n²) | n^2 | quadratic
Q: Simplify O(3n + 5).
A: O(n) | n
Q: Binary search has which complexity?
A: O(log n) | log n
Q: If doubling n roughly quadruples running time, what complexity is likely?
A: O(n^2) | O(n²) | quadratic | n^2
Q: Running one database query per item in a loop is called the N+1 what problem?
A: query | n+1 query
```
