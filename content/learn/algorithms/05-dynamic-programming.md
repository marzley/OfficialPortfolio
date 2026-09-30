---
slug: dynamic-programming
title: Dynamic programming and memoisation
after: graphs-bfs-dfs
---
# Dynamic programming and memoisation

Some problems contain the **same smaller problems** again and again. **Dynamic programming (DP)** solves each small problem **once**, saves the answer, and reuses it. It can turn a program that would take years into one that takes milliseconds.

## The slow way: Fibonacci with plain recursion

Fibonacci numbers: each is the sum of the two before (0, 1, 1, 2, 3, 5, 8, 13...).

```try-python
import time

calls = 0
def fib(n):
    global calls
    calls += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

t = time.perf_counter()
print(fib(25), "in", calls, "calls,", round(time.perf_counter() - t, 3), "s")
```

`fib(25)` makes about a quarter of a million calls, because `fib(23)` is computed twice, `fib(22)` three times, and so on. The work roughly doubles with each extra number: **exponential** time.

## Fix 1: memoisation (top-down)

Remember each answer the first time you compute it:

```try-python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(25))
print(fib(200))        # instant, even though it's a 42-digit number
```

The same idea by hand with a dictionary:

```try-python
memo = {}
def fib(n):
    if n < 2:
        return n
    if n not in memo:
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]
print(fib(90))
```

## Fix 2: tabulation (bottom-up)

Build the answers from the smallest up, in a table (or just two variables):

```try-python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
print([fib(i) for i in range(12)])
```

## When to use DP

Look for two signs:

1. **Overlapping subproblems**: the same smaller question is asked many times.
2. **Optimal substructure**: the best answer is built from the best answers to smaller parts.

## Classic problem: making change with the fewest coins

Kenyan coins: 1, 5, 10, 20 shillings. What's the fewest coins to make KSh 38?

```try-python
def min_coins(amount, coins=(1, 5, 10, 20)):
    best = [0] + [float("inf")] * amount      # best[x] = fewest coins to make x
    choice = [0] * (amount + 1)
    for x in range(1, amount + 1):
        for c in coins:
            if c <= x and best[x - c] + 1 < best[x]:
                best[x] = best[x - c] + 1
                choice[x] = c
    used, x = [], amount
    while x > 0:
        used.append(choice[x])
        x -= choice[x]
    return best[amount], used

print(min_coins(38))                  # 6 coins: 20 + 10 + 5 + 1 + 1 + 1
print(min_coins(12, coins=(1, 6, 10)))  # greedy (10+1+1) gives 3; DP finds 6+6 = 2
```

The second example shows why DP matters: a "greedy" approach (always take the biggest coin) isn't always optimal.

## Classic problem: the knapsack (best value within a budget)

You have KSh 1,000 for ads, and each option has a cost and expected customers. Which combination gives the most customers?

```try-python
def knapsack(budget, items):
    best = [0] * (budget + 1)
    for name, cost, value in items:
        for b in range(budget, cost - 1, -1):     # go backwards so each item is used once
            best[b] = max(best[b], best[b - cost] + value)
    return best[budget]

ads = [("Facebook boost", 400, 30), ("Posters", 300, 18), ("Radio mention", 700, 45), ("WhatsApp status promo", 200, 15)]
print("Most customers for KSh 1,000:", knapsack(1000, ads))
```

## Real uses of DP

- Spell checkers and "did you mean" (edit distance)
- DNA and text comparison (`diff` in Git)
- Route and resource planning
- Some AI and speech recognition algorithms

```quiz
Q: What is storing answers to subproblems so they are not recomputed called?
A: memoisation | memoization | memoize
Q: Which Python decorator caches a function's results?
A: lru_cache | functools.lru_cache | @lru_cache
Q: Building answers from the smallest problem upwards in a table is called what? (one word)
A: tabulation | bottom-up
Q: Does always taking the biggest coin (greedy) always give the fewest coins? (yes or no)
A: no
Q: What is the name of the 'best value within a budget' problem?
A: knapsack | the knapsack problem
```
=== exercise ===
Write `fib(n)` using a loop (tabulation) and print `fib(10)`: **55**.
=== starter ===
def fib(n):
    pass

print(fib(10))
=== expected ===
55
=== must_contain ===
for
