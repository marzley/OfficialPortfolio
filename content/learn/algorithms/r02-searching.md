---
slug: searching
title: "Searching algorithms: linear search, binary search, step counts, edge cases and searching real data"
after: KEEP
---
# Searching algorithms: linear search, binary search, step counts, edge cases and searching real data

Searching is one of the most common jobs computers do: finding a student by admission number, checking whether an M-Pesa receipt has already been used, looking up a product price, finding a contact in your phone, or Google finding pages among billions. The algorithm you choose decides whether a search takes a millisecond or minutes. This unit teaches the two fundamental algorithms, **linear search** and **binary search**, how to count their steps, their edge cases, and how Python's built-in tools and data structures make searching fast in practice.

:::note What you will learn
- The searching problem and real examples
- Linear search: how it works, code, best and worst cases
- Binary search: how it works on sorted data, code (iterative and recursive)
- Comparing step counts as data grows
- Edge cases and off-by-one errors
- Finding all matches, the first match, and the position to insert
- Python's in, index, bisect and dictionaries/sets
- Choosing the right search approach
:::

## The searching problem

Given a collection and a target, answer: **Is the target present? Where is it?** Return its position (index), or a signal like `-1` if it's not found.

## Linear search

Check each item one by one from the start until you find the target or reach the end.

```
FOR i ← 0 TO length − 1
    IF items[i] = target THEN RETURN i
ENDFOR
RETURN −1
```

```try-python
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1

phones = ["0722111222", "0711333444", "0700555666", "0733777888"]
print(linear_search(phones, "0700555666"))   # 2
print(linear_search(phones, "0799000000"))   # -1
```

| Case | Comparisons for n items |
|---|---|
| Best (target first) | 1 |
| Worst (last or missing) | n |
| Average | about n/2 |

**Pros**: works on unsorted data, simple, fine for small lists. **Cons**: slow for large data (1 million items may need 1 million checks). Its time complexity is **O(n)** (see the Big O lesson).

## Binary search

Works only on **sorted** data. Look at the middle item:
- If it's the target, done.
- If the target is smaller, search the **left half**.
- If larger, search the **right half**.

Each step halves the remaining data, like finding a word in a dictionary by opening near the middle.

Example: find 67 in `[5, 12, 23, 34, 45, 56, 67, 78, 89]`:

| Step | low | high | mid | items[mid] | Action |
|---|---|---|---|---|---|
| 1 | 0 | 8 | 4 | 45 | 67 > 45 → go right |
| 2 | 5 | 8 | 6 | 67 | Found at index 6 |

```try-python
def binary_search(items, target):
    low, high = 0, len(items) - 1
    steps = 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if items[mid] == target:
            return mid, steps
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps

data = [5, 12, 23, 34, 45, 56, 67, 78, 89]
print(binary_search(data, 67))   # (6, 2)
print(binary_search(data, 40))   # (-1, ...)
```

A recursive version:

```try-python
def binary_search_rec(items, target, low, high):
    if low > high:
        return -1
    mid = (low + high) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return binary_search_rec(items, target, mid + 1, high)
    return binary_search_rec(items, target, low, mid - 1)

data = [3, 8, 15, 21, 42, 57, 63]
print(binary_search_rec(data, 21, 0, len(data) - 1))   # 3
```

Binary search is **O(log n)**: about log₂(n) steps.

## Comparing step counts

```try-python
import math
for n in [10, 1_000, 1_000_000, 1_000_000_000]:
    linear = n
    binary = math.ceil(math.log2(n + 1))
    print(f"{n:>13,} items: linear worst {linear:>13,} checks, binary worst {binary} checks")
```

For a billion sorted items, binary search needs about 30 checks. That's the power of halving.

The catch: data must be **sorted**, and sorting costs time (often O(n log n)). If you search once, a linear search may be fine; if you search many times, sort once (or use a better structure) and then search fast.

## Edge cases and off-by-one errors

Test these every time:
- Empty list → should return -1 without crashing.
- One item, found and not found.
- Target at the first and last positions.
- Target smaller than all items, or larger than all.
- Duplicates (which index is returned?).

Common bugs: `while low < high` instead of `<=` (misses the last element), forgetting `+1`/`-1` when moving `low`/`high` (infinite loops), and calculating mid on unsorted data.

## Variations

```try-python
def find_all(items, target):
    return [i for i, x in enumerate(items) if x == target]

def first_occurrence(items, target):          # binary search for the first of duplicates
    low, high, answer = 0, len(items) - 1, -1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] >= target:
            if items[mid] == target:
                answer = mid
            high = mid - 1
        else:
            low = mid + 1
    return answer

print(find_all([3, 1, 3, 3, 2], 3))                 # [0, 2, 3]
print(first_occurrence([1, 2, 2, 2, 5, 7], 2))      # 1
```

## Searching in Python in practice

```try-python
import bisect

fruits = ["mango", "banana", "avocado", "pawpaw"]
print("avocado" in fruits)          # True: linear search under the hood
print(fruits.index("pawpaw"))       # 3

prices = [50, 120, 250, 400, 900]   # sorted
pos = bisect.bisect_left(prices, 250)
print("250 found at", pos, prices[pos] == 250)
print("Insert 300 at position", bisect.bisect_left(prices, 300))

# Dictionaries and sets search in about constant time on average
receipts = {"QJK7RT61SV", "QJK8PL22AB"}
print("QJK7RT61SV" in receipts)     # fast duplicate-payment check

students = {"ADM001": "Brian", "ADM002": "Faith"}
print(students.get("ADM002", "Not found"))
```

| Need | Best tool |
|---|---|
| Small or unsorted list, one search | `in` / linear search |
| Large sorted list, many searches | Binary search (`bisect`) |
| Lookup by key (ID, phone, receipt) | Dictionary or set (hash table) |
| Database records | SQL `WHERE` with an **index** (see the SQL indexes lesson) |
| Text search across documents | Search engines/full-text indexes |

:::think A school system stores 50,000 student records in a list and finds students by admission number with a loop. Searches feel slow when many teachers use it. What would you suggest?
Use a dictionary keyed by admission number (average constant-time lookup), or in a database add an index on the admission number column and query with WHERE. If the list must remain, keep it sorted by admission number and use binary search (bisect).
:::

## Summary

- Searching finds whether and where a target exists; return an index or -1.
- Linear search checks every item: works on unsorted data, O(n).
- Binary search halves sorted data each step: O(log n), about 30 steps for a billion items.
- Test edge cases (empty, single, first/last, missing, duplicates) and watch off-by-one errors.
- In practice use `in`, `bisect`, dictionaries/sets and database indexes depending on the data.

```quiz
Q: Which search works on unsorted data?
A: linear | linear search
Q: What must be true about data before using binary search?
A: sorted | it must be sorted
Q: About how many steps does binary search need for 1,000,000 items?
A: 20
Q: What is the Big O of linear search?
A: O(n) | n
Q: What value is commonly returned when a target is not found?
A: -1
Q: Which Python module provides binary search helpers?
A: bisect
```

=== exercise ===
Write a function `count_of(items, target)` that uses a loop to count how many times `target` appears, then print `count_of([3, 1, 3, 3, 2], 3)`.
=== starter ===
def count_of(items, target):
    

print(count_of([3, 1, 3, 3, 2], 3))
=== expected ===
3
=== must_contain ===
for
def count_of
