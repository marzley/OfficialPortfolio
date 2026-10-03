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

## Where dynamic programming is used

Dynamic programming (DP) solves problems that break into overlapping subproblems by remembering answers instead of recomputing them. It powers spell checkers and "did you mean" suggestions (edit distance), DNA comparison, route planning, budgeting and resource allocation, text justification, and many optimisation problems in finance and logistics. It's also a favourite topic in technical interviews at large tech companies.

## How to recognise a DP problem

Ask two questions:

1. **Optimal substructure**: can the best answer be built from best answers to smaller versions? (The cheapest way to make KSh 70 uses the cheapest way to make a smaller amount.)
2. **Overlapping subproblems**: do the same smaller problems come up again and again? (Plain recursive Fibonacci recomputes the same values many times.)

If both are yes, DP usually helps.

## A recipe for DP solutions

1. Define the **state**: what does `dp[i]` (or `dp[i][j]`) mean in words?
2. Write the **recurrence**: how is `dp[i]` built from smaller states?
3. Set the **base cases**.
4. Decide the **order** to fill the table (or use memoised recursion).
5. Read off the **answer**, and if needed, reconstruct the choices.

## Climbing stairs (counting ways)

You can climb 1 or 2 steps at a time. How many different ways are there to climb n steps?

```try-python
def ways(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]     # last move was 1 step or 2 steps
    return dp[n]

for n in [1, 2, 3, 4, 5, 10, 30]:
    print(n, ways(n))
```

State: `dp[i]` = number of ways to reach step i. Recurrence: ways to get to i come from step i-1 or i-2.

## Longest increasing streak of sales (subsequence)

Find the length of the longest increasing subsequence of monthly sales (not necessarily consecutive months):

```try-python
def longest_increasing(values):
    n = len(values)
    dp = [1] * n                  # dp[i] = longest increasing subsequence ending at i
    prev = [-1] * n
    for i in range(n):
        for j in range(i):
            if values[j] < values[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j
    end = max(range(n), key=lambda i: dp[i])
    seq = []
    while end != -1:
        seq.append(values[end])
        end = prev[end]
    return seq[::-1]

sales = [120, 90, 150, 130, 180, 160, 210, 200]
best = longest_increasing(sales)
print(len(best), best)
```

Keeping a `prev` array lets you reconstruct the actual sequence, not just its length.

## Edit distance: "did you mean...?"

How many single-character edits (insert, delete, replace) turn one word into another?

```try-python
def edit_distance(a, b):
    rows, cols = len(a) + 1, len(b) + 1
    dp = [[0] * cols for _ in range(rows)]
    for i in range(rows):
        dp[i][0] = i                 # delete all characters
    for j in range(cols):
        dp[0][j] = j                 # insert all characters
    for i in range(1, rows):
        for j in range(1, cols):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1,        # delete
                           dp[i][j - 1] + 1,        # insert
                           dp[i - 1][j - 1] + cost) # replace (or keep)
    return dp[-1][-1]

towns = ["Nairobi", "Nakuru", "Naivasha", "Nanyuki", "Kisumu", "Mombasa"]
typed = "Nakru"
suggestion = min(towns, key=lambda t: edit_distance(typed.lower(), t.lower()))
print(f"Did you mean {suggestion}? (distance {edit_distance(typed.lower(), suggestion.lower())})")
print(edit_distance("kitten", "sitting"))
```

Search boxes, spell checkers and data-cleaning tools use edit distance to match misspelled names (useful when matching customer or town names typed by people).

## Grid paths with obstacles

```try-python
def count_paths(grid):
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:            # blocked cell
                dp[r][c] = 0
            elif r == 0 and c == 0:
                dp[r][c] = 1
            else:
                dp[r][c] = (dp[r - 1][c] if r > 0 else 0) + (dp[r][c - 1] if c > 0 else 0)
    return dp[-1][-1]

warehouse = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0],
]
print("Routes from top-left to bottom-right:", count_paths(warehouse))
```

Moving only right or down, the number of routes to a cell is the sum of routes to the cell above and the cell to the left.

## Reducing memory

Many DP tables only need the previous row or two values:

```try-python
def ways_small_memory(n):
    a, b = 1, 2                 # ways to reach step 1 and step 2
    if n <= 2:
        return n
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

print(ways_small_memory(30), ways_small_memory(80))
```

This turns O(n) memory into O(1), which matters for very large inputs.

## DP vs greedy

| Approach | Idea | Risk |
|---|---|---|
| Greedy | Always take the locally best choice | Can miss the overall best answer |
| Dynamic programming | Consider all relevant sub-answers systematically | More computation and memory, but correct when the structure fits |

With coins 1, 3 and 4, making 6: greedy takes 4+1+1 (3 coins), but DP finds 3+3 (2 coins). Kenyan currency denominations happen to work with greedy, but many real optimisation problems don't.

## Practice

1. Count ways to climb n stairs when you can take 1, 2 or 3 steps.
2. Find the maximum sum of non-adjacent numbers in a list (house robber problem).
3. Compute the longest common subsequence of two words.
4. Use edit distance to match misspelled county names to the correct ones.
5. Reduce the memory of your stairs solution to O(1).

:::think A greedy algorithm gives change by always picking the largest coin that fits. Why might it fail for coins {1, 3, 4} and an amount of 6, and how does DP fix it?
Greedy picks 4 first, leaving 2, which needs 1+1: three coins in total. The optimal answer is 3+3: two coins. DP computes the fewest coins for every amount from 0 to 6, considering every coin at each step, so it finds that 6 = 3 + (best for 3) is better than 6 = 4 + (best for 2).
:::

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
Q: What property means the best answer is built from best answers to smaller problems? (two words)
A: optimal substructure
Q: What algorithm measures the minimum edits to turn one word into another? (two words)
A: edit distance | Levenshtein distance
Q: Does a greedy coin algorithm always give the fewest coins for every coin system? (yes or no)
A: no
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
