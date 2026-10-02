---
slug: recursion
title: "Recursion: base cases, the call stack, classic examples, recursion vs loops, tree recursion and avoiding stack overflow"
after: KEEP
---
# Recursion: base cases, the call stack, classic examples, recursion vs loops, tree recursion and avoiding stack overflow

**Recursion** is when a function solves a problem by calling **itself** on a smaller version of the same problem. It's a natural fit for problems that contain smaller copies of themselves: folders inside folders, comments with replies to replies, family trees, organisation charts, sorting by splitting lists in half, and exploring every route through a network. Recursion feels strange at first, but once it clicks it becomes one of the most powerful ideas in programming, and it's essential for trees, graphs, divide-and-conquer algorithms and many interview questions.

:::note What you will learn
- What recursion is: base case and recursive case
- How the call stack works
- Classic examples: countdown, factorial, sum, power, palindromes, Fibonacci
- Recursion on lists and strings
- Tree recursion: folders and nested data
- Divide and conquer: binary search, merge sort
- Recursion vs iteration
- Recursion limits, stack overflow and memoisation
- A method for writing recursive functions
:::

## The two essential parts

1. **Base case**: the simplest version, answered directly, which **stops** the recursion.
2. **Recursive case**: break the problem into a smaller version and call the function on it.

```try-python
def countdown(n):
    if n == 0:                 # base case
        print("Lift off!")
        return
    print(n)
    countdown(n - 1)           # recursive case: smaller problem

countdown(5)
```

Without a base case (or if the problem doesn't get smaller), the function calls itself forever until Python stops it with a `RecursionError`.

## Factorial

n! = n × (n − 1) × ... × 1, and 0! = 1. Notice n! = n × (n − 1)!: the problem contains a smaller copy of itself.

```try-python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for n in [0, 1, 5, 10]:
    print(n, factorial(n))
```

## The call stack

Each function call gets a **stack frame** with its own variables. Calls wait for the ones they made to finish:

```
factorial(4)
  = 4 * factorial(3)
        = 3 * factorial(2)
              = 2 * factorial(1)
                    = 1           ← base case returns
              = 2 * 1 = 2
        = 3 * 2 = 6
  = 4 * 6 = 24
```

```try-python
def factorial_trace(n, depth=0):
    print("  " * depth + f"factorial({n}) called")
    if n <= 1:
        print("  " * depth + "base case → 1")
        return 1
    result = n * factorial_trace(n - 1, depth + 1)
    print("  " * depth + f"factorial({n}) returns {result}")
    return result

factorial_trace(4)
```

The stack grows going down and unwinds coming back up.

## More classic examples

```try-python
def total(n):                       # 1 + 2 + ... + n
    return 0 if n == 0 else n + total(n - 1)

def power(base, exp):               # base^exp using halving (fast)
    if exp == 0:
        return 1
    half = power(base, exp // 2)
    return half * half if exp % 2 == 0 else half * half * base

def is_palindrome(s):
    s = "".join(ch.lower() for ch in s if ch.isalnum())
    if len(s) <= 1:
        return True
    return s[0] == s[-1] and is_palindrome(s[1:-1])

def digits_sum(n):
    return n if n < 10 else n % 10 + digits_sum(n // 10)

print(total(10), power(2, 10), is_palindrome("Was it a car or a cat I saw"), digits_sum(2026))
```

## Recursion on lists

Think: "the answer for the whole list = combine the first item with the answer for the rest".

```try-python
def list_sum(items):
    if not items:
        return 0
    return items[0] + list_sum(items[1:])

def list_max(items):
    if len(items) == 1:
        return items[0]
    rest_max = list_max(items[1:])
    return items[0] if items[0] > rest_max else rest_max

print(list_sum([5, 10, 15]), list_max([4, 19, 7, 12]))
```

(Slicing creates copies, so these are for learning; built-ins `sum` and `max` are better in real code.)

## Tree recursion: nested data

Recursion shines with **nested** structures of unknown depth, like folders or comment threads:

```try-python
folder = {
    "name": "School",
    "files": ["timetable.pdf"],
    "subfolders": [
        {"name": "Form1", "files": ["math.docx", "eng.docx"], "subfolders": []},
        {"name": "Form2", "files": ["bio.docx"], "subfolders": [
            {"name": "Labs", "files": ["lab1.pdf", "lab2.pdf", "lab3.pdf"], "subfolders": []}
        ]},
    ],
}

def count_files(f):
    return len(f["files"]) + sum(count_files(sub) for sub in f["subfolders"])

def show(f, depth=0):
    print("  " * depth + "📁 " + f["name"])
    for name in f["files"]:
        print("  " * (depth + 1) + "📄 " + name)
    for sub in f["subfolders"]:
        show(sub, depth + 1)

show(folder)
print("Total files:", count_files(folder))
```

A loop alone struggles here because you don't know how deep the nesting goes; recursion handles any depth naturally.

## Divide and conquer

Split the problem, solve the parts recursively, combine the results:
- **Binary search**: search one half (see the searching lesson).
- **Merge sort**: sort both halves, then merge (see the sorting lesson).
- **Fast power** (above): compute power(base, exp/2) once and square it, O(log n) multiplications.

## Fibonacci: a warning and a fix

Fibonacci numbers: 0, 1, 1, 2, 3, 5, 8... where fib(n) = fib(n−1) + fib(n−2).

```try-python
import time
from functools import lru_cache

def fib_slow(n):
    if n < 2:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)    # recomputes the same values many times

@lru_cache(maxsize=None)
def fib_fast(n):
    if n < 2:
        return n
    return fib_fast(n - 1) + fib_fast(n - 2)    # each value computed once (memoisation)

t = time.perf_counter(); print(fib_slow(25), f"{time.perf_counter() - t:.3f}s (slow)")
t = time.perf_counter(); print(fib_fast(25), f"{time.perf_counter() - t:.6f}s (memoised)")
print(fib_fast(90))
```

Naive Fibonacci is O(2ⁿ) because it branches twice per call; **memoisation** stores results and makes it O(n). This is the start of **dynamic programming** (see that lesson).

## Recursion vs iteration

| | Recursion | Iteration (loops) |
|---|---|---|
| Natural for | Trees, nested data, divide and conquer, backtracking | Simple repetition over sequences |
| Readability | Elegant for self-similar problems | Often clearer for simple counting |
| Memory | Uses stack frames (O(depth)) | Usually O(1) extra |
| Risk | Stack overflow if too deep | Infinite loops if conditions are wrong |

Any recursive algorithm can be rewritten with a loop and an explicit stack, and simple recursion like factorial is usually better as a loop in Python:

```try-python
def factorial_loop(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
print(factorial_loop(10))
```

## Recursion limits

Python limits recursion depth (by default about 1,000 frames) to prevent crashes:

```try-python
import sys
print("Recursion limit:", sys.getrecursionlimit())

def depth(n):
    return 0 if n == 0 else 1 + depth(n - 1)

print(depth(500))       # fine
try:
    depth(100000)       # far too deep
except RecursionError as e:
    print("RecursionError:", e)
```

For very deep problems, use iteration or an explicit stack. (Increasing the limit with `sys.setrecursionlimit` can crash Python if set too high.)

## A method for writing recursive functions

1. **Define** what the function returns for an input ("count_files(f) returns the number of files in f and all subfolders").
2. **Base case**: the smallest input you can answer directly (empty list, n = 0, a folder with no subfolders).
3. **Trust the recursion**: assume the function works for smaller inputs.
4. **Recursive case**: combine the current piece with the result for the smaller input(s).
5. **Make progress**: ensure every call moves toward the base case.
6. **Test** with small inputs and trace them.

:::think Write a recursive function that reverses a string, e.g. "maize" → "eziam". What are the base and recursive cases?
Base case: a string of length 0 or 1 is its own reverse. Recursive case: reverse(s) = reverse(s[1:]) + s[0]. In Python: `def reverse(s): return s if len(s) <= 1 else reverse(s[1:]) + s[0]`.
:::

## Summary

- Recursion solves a problem by calling the same function on smaller versions; it needs a base case and progress toward it.
- Each call adds a frame to the call stack, which unwinds as results return.
- Classic uses: factorial, sums, powers, palindromes, list processing, and especially nested/tree data.
- Divide-and-conquer algorithms (binary search, merge sort) are recursive; naive Fibonacci shows why memoisation matters.
- Prefer loops for simple repetition and very deep problems; Python's recursion limit is about 1,000.

```quiz
Q: What stops a recursive function from calling itself forever? (two words)
A: base case | the base case
Q: What error does Python raise when recursion goes too deep?
A: RecursionError
Q: What is 5 factorial?
A: 120
Q: What technique stores previous results to speed up recursive Fibonacci?
A: memoisation | memoization | caching | lru_cache
Q: Roughly what is Python's default recursion limit?
A: 1000 | 1,000
Q: Which kind of data is recursion especially good for: flat lists or nested structures?
A: nested structures | nested | trees
```

=== exercise ===
Write a recursive function `total(n)` that returns 1 + 2 + … + n, and print `total(100)`.
=== starter ===
def total(n):
    

print(total(100))
=== expected ===
5050
=== must_contain ===
def total
total(n
