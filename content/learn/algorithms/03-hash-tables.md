---
slug: hash-tables
title: Hash tables: fast look-ups with dictionaries
after: stacks-queues
---
# Hash tables: fast look-ups with dictionaries

How does M-Pesa find your account among 30+ million instantly? How does a school system find a student by admission number? With **hash tables**, called `dict` in Python, objects/`Map` in JavaScript and associative arrays in PHP.

## The problem with lists

To find a phone number in a list of 1,000,000 customers, you may check every item: **O(n)**. A hash table finds it in (on average) **one step: O(1)**, no matter how big it gets.

## How a hash table works (simplified)

1. A **hash function** turns the key (e.g. `"0712345678"`) into a number.
2. That number picks a **bucket** (slot) in an array.
3. The value is stored in that bucket. To look it up, hash the key again and go straight there.

```try-python
def simple_hash(key, buckets=10):
    return sum(ord(ch) for ch in key) % buckets    # a toy hash function

for phone in ["0712345678", "0722000111", "0733999888"]:
    print(phone, "-> bucket", simple_hash(phone))
```

When two keys land in the same bucket it's a **collision**; real hash tables handle them (e.g. keeping a small list in each bucket) and grow when they get full. Python's `dict` does all this for you.

## Speed comparison

```try-python
import time

n = 200_000
phones_list = [f"07{i:08d}" for i in range(n)]
phones_dict = {p: i for i, p in enumerate(phones_list)}
target = phones_list[-1]

t = time.perf_counter()
for _ in range(100): target in phones_list
list_time = time.perf_counter() - t

t = time.perf_counter()
for _ in range(100): target in phones_dict
dict_time = time.perf_counter() - t

print(f"list: {list_time:.4f}s  dict: {dict_time:.6f}s  (~{list_time / dict_time:,.0f}x faster)")
```

## Classic problems solved with hash tables

### Counting (frequency)

```try-python
text = "haraka haraka haina baraka"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
print(counts)
```

### Two-sum: find two numbers that add up to a target

A famous interview question. Nested loops are O(n²); a dictionary makes it O(n):

```try-python
def two_sum(nums, target):
    seen = {}                        # value -> index
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return seen[need], i
        seen[n] = i
    return None

print(two_sum([500, 1200, 300, 800], 1100))   # indexes of 300 and 800
```

### Detect duplicates

```try-python
def first_duplicate(codes):
    seen = set()                     # a set is a hash table of keys only
    for c in codes:
        if c in seen:
            return c
        seen.add(c)
    return None

print(first_duplicate(["SJK1", "SJK2", "SJK3", "SJK2", "SJK5"]))   # a repeated M-Pesa code
```

### Grouping

```try-python
students = [("Amina", "2A"), ("Brian", "3B"), ("Chebet", "2A"), ("Dennis", "3B"), ("Esther", "4C")]
by_class = {}
for name, cls in students:
    by_class.setdefault(cls, []).append(name)
print(by_class)
```

## Rules for keys

- Keys must be **hashable** (unchangeable): strings, numbers, tuples. Not lists.
- Keys are unique: assigning the same key again **replaces** the value.
- Dictionaries use more memory than lists: the price of speed.

## Where you'll meet hashing

- Database **indexes** (hash and B-tree indexes)
- Caches (storing results so you don't recompute them)
- Password hashing (a different, deliberately slow kind of hash: see the cybersecurity lessons)
- Git uses hashes to name every commit

```quiz
Q: What is the average time to look up a key in a hash table, in Big O?
A: O(1)
Q: What is it called when two keys land in the same bucket?
A: collision | a collision
Q: What is Python's built-in hash table type?
A: dict | dictionary
Q: Can a list be a dictionary key? (yes or no)
A: no
Q: Two-sum with a dictionary runs in O(n). What is it with nested loops?
A: O(n^2) | O(n²) | O(n*n)
```
=== exercise ===
Count the letters in `"banana"` with a dictionary and print the count for `"a"`: **3**.
=== starter ===
counts = {}
for ch in "banana":
    pass
print(counts["a"])
=== expected ===
3
=== must_contain ===
counts[
