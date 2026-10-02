---
slug: sorting
title: "Sorting algorithms: bubble, selection, insertion, merge and quick sort, stability, complexity and sorting real data"
after: KEEP
---
# Sorting algorithms: bubble, selection, insertion, merge and quick sort, stability, complexity and sorting real data

Sorting puts items in order: students by marks, products by price, transactions by date, names alphabetically, leaderboards by score. Sorted data is easier to read and makes other operations fast (binary search, finding duplicates, medians, ranges). Studying sorting algorithms is the classic way to learn how to think about efficiency, and it appears in exams and technical interviews. This unit explains the main algorithms step by step with runnable code, compares their speed, and shows how to sort real data in Python.

:::note What you will learn
- Why sorting matters
- Bubble sort, selection sort and insertion sort (simple, O(n²))
- Merge sort and quick sort (divide and conquer, O(n log n))
- Counting comparisons and timing algorithms
- Stability and in-place sorting
- Python's sorted() and .sort(), keys, reverse and multi-level sorts
- Choosing a sort in practice
:::

## Bubble sort

Repeatedly compare **adjacent** items and swap them if they're in the wrong order. After each pass, the largest remaining item "bubbles" to the end.

Pass 1 on `[5, 1, 4, 2]`: compare 5,1 → swap `[1,5,4,2]`; 5,4 → swap `[1,4,5,2]`; 5,2 → swap `[1,4,2,5]`.

```try-python
def bubble_sort(items):
    a = items[:]                      # work on a copy
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):    # the last i items are already in place
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:               # already sorted: stop early
            break
    return a

print(bubble_sort([64, 25, 12, 22, 11]))
```

Simple to understand, but slow for large lists: **O(n²)** comparisons in the worst case.

## Selection sort

Find the **smallest** remaining item and swap it into the next position.

```try-python
def selection_sort(items):
    a = items[:]
    for i in range(len(a)):
        smallest = i
        for j in range(i + 1, len(a)):
            if a[j] < a[smallest]:
                smallest = j
        a[i], a[smallest] = a[smallest], a[i]
    return a

print(selection_sort([29, 10, 14, 37, 13]))
```

Always O(n²) comparisons but few swaps (useful when writing data is expensive).

## Insertion sort

Build a sorted section one item at a time, inserting each new item into its correct place, like sorting playing cards in your hand.

```try-python
def insertion_sort(items):
    a = items[:]
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]          # shift bigger items right
            j -= 1
        a[j + 1] = key
    return a

print(insertion_sort([12, 11, 13, 5, 6]))
```

O(n²) worst case, but very fast for **small or nearly sorted** lists (close to O(n)), which is why real-world sorts use it for small pieces.

## Merge sort (divide and conquer)

1. **Divide** the list into halves until each piece has one item.
2. **Merge** pieces back together in order.

```try-python
def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:       # <= keeps equal items in order (stable)
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
```

Always **O(n log n)**, stable, but needs extra memory for merging.

## Quick sort

1. Choose a **pivot**.
2. **Partition**: items smaller than the pivot go left, larger go right.
3. Recursively sort both sides.

```try-python
def quick_sort(items):
    if len(items) <= 1:
        return items
    pivot = items[len(items) // 2]
    left = [x for x in items if x < pivot]
    middle = [x for x in items if x == pivot]
    right = [x for x in items if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([10, 7, 8, 9, 1, 5, 7]))
```

Average **O(n log n)** and very fast in practice; worst case O(n²) with bad pivots (e.g. always the first item on already sorted data). Good implementations choose pivots carefully and sort in place.

## Comparing performance

Time the algorithms on random data (functions are defined before the loop that calls them, because Python runs top to bottom):

```try-python
import random, time

def bubble_sort(a):
    a = a[:]
    for i in range(len(a) - 1):
        for j in range(len(a) - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

def merge_sort(a):
    if len(a) <= 1:
        return a
    m = len(a) // 2
    l, r = merge_sort(a[:m]), merge_sort(a[m:])
    out, i, j = [], 0, 0
    while i < len(l) and j < len(r):
        if l[i] <= r[j]:
            out.append(l[i]); i += 1
        else:
            out.append(r[j]); j += 1
    return out + l[i:] + r[j:]

def timed(fn, data):
    start = time.perf_counter()
    fn(data)
    return time.perf_counter() - start

random.seed(1)
for n in [500, 2000]:
    data = [random.randint(0, 100000) for _ in range(n)]
    print(f"n={n}: bubble {timed(bubble_sort, data):.3f}s, merge {timed(merge_sort, data):.4f}s, built-in {timed(sorted, data):.5f}s")
```

| Algorithm | Best | Average | Worst | Extra memory | Stable? |
|---|---|---|---|---|---|
| Bubble | O(n) (with early stop) | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | No (typical in-place versions) |
| Python's Timsort | O(n) | O(n log n) | O(n log n) | O(n) | Yes |

## Stability

A **stable** sort keeps items with equal keys in their original order. Example: students already sorted by name, then sorted by grade; with a stable sort, students with the same grade remain alphabetical. That's why multi-level sorting works.

## Sorting in Python

Python's built-in sort (**Timsort**, a hybrid of merge and insertion sort) is fast and stable. Use it in real code.

```try-python
scores = [40, 85, 12, 67]
print(sorted(scores))                  # new list, ascending
print(sorted(scores, reverse=True))    # descending
scores.sort()                          # sorts the list in place
print(scores)

students = [
    {"name": "Wanjiku", "form": 3, "mark": 78},
    {"name": "Otieno", "form": 4, "mark": 91},
    {"name": "Amina", "form": 3, "mark": 91},
    {"name": "Kiprop", "form": 4, "mark": 65},
]
by_mark = sorted(students, key=lambda s: s["mark"], reverse=True)
print([s["name"] for s in by_mark])

# Multi-level: form ascending, then mark descending
multi = sorted(students, key=lambda s: (s["form"], -s["mark"]))
print([(s["form"], s["name"], s["mark"]) for s in multi])

print(sorted(["banana", "Avocado", "mango"], key=str.lower))   # case-insensitive
```

## Choosing a sort in practice

- **Use the language's built-in sort** (Python `sorted`, JavaScript `Array.prototype.sort` with a compare function, SQL `ORDER BY`).
- Learn the classic algorithms to understand complexity and for interviews/exams.
- Nearly sorted small data: insertion sort shines.
- Huge datasets that don't fit in memory: external merge sorts (databases handle this).

:::think Trace one pass of bubble sort on [7, 3, 9, 2]. What is the list after the first pass?
Compare 7,3 → swap [3,7,9,2]; 7,9 → no swap; 9,2 → swap [3,7,2,9]. After pass 1: [3, 7, 2, 9], with the largest (9) at the end.
:::

## Summary

- Sorting orders data and enables fast searching and analysis.
- Bubble, selection and insertion sorts are simple O(n²) algorithms; insertion is great for nearly sorted data.
- Merge sort (stable, O(n log n), extra memory) and quick sort (fast average O(n log n), careful pivots) use divide and conquer.
- Stability preserves the order of equal items, enabling multi-level sorts.
- In real code use built-in sorts (Python's stable Timsort) with key, reverse and tuple keys.

```quiz
Q: Which simple sort repeatedly swaps adjacent items?
A: bubble | bubble sort
Q: What is the average time complexity of merge sort?
A: O(n log n) | n log n
Q: Which sort chooses a pivot?
A: quick | quick sort | quicksort
Q: What is a sort called that keeps equal items in their original order?
A: stable | a stable sort
Q: What sorting algorithm does Python's sorted() use?
A: Timsort | timsort
Q: Which sort is very fast on nearly sorted small lists?
A: insertion | insertion sort
```

=== exercise ===
Use `sorted()` with `reverse=True` to print the list `[40, 85, 12, 67]` from highest to lowest.
=== starter ===
scores = [40, 85, 12, 67]
=== expected ===
[85, 67, 40, 12]
=== must_contain ===
sorted
reverse
