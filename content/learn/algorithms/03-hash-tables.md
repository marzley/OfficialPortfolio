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

## Why hash tables are everywhere

Hash tables (Python dictionaries and sets, JavaScript objects and Maps, PHP associative arrays, Java HashMaps) are the most used data structure in everyday programming. They power database indexes, caches, user sessions, counting and grouping in reports, duplicate detection for payments, and lookups by ID, phone number or code. Knowing how they work explains why they're fast, when they slow down, and what can be used as a key.

## Building a tiny hash table yourself

```try-python
class HashTable:
    def __init__(self, size=8):
        self.buckets = [[] for _ in range(size)]
        self.count = 0

    def _index(self, key):
        return hash(key) % len(self.buckets)

    def put(self, key, value):
        bucket = self.buckets[self._index(key)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)      # update existing key
                return
        bucket.append((key, value))           # new key (collisions share the bucket list)
        self.count += 1
        if self.count / len(self.buckets) > 0.75:
            self._resize()

    def get(self, key, default=None):
        for k, v in self.buckets[self._index(key)]:
            if k == key:
                return v
        return default

    def _resize(self):
        old = [pair for bucket in self.buckets for pair in bucket]
        self.buckets = [[] for _ in range(len(self.buckets) * 2)]
        self.count = 0
        for k, v in old:
            self.put(k, v)

stock = HashTable()
for item, qty in [("unga", 40), ("sugar", 25), ("rice", 30), ("salt", 12), ("tea", 18), ("oil", 9), ("soap", 50)]:
    stock.put(item, qty)
stock.put("unga", 35)
print(stock.get("unga"), stock.get("tea"), stock.get("milk", 0))
print("Buckets:", len(stock.buckets), "items:", stock.count)
```

Key ideas: a **hash function** turns a key into a bucket number; **collisions** (two keys in one bucket) are handled by keeping a small list; when the table gets too full (the **load factor** passes a threshold), it **resizes** and redistributes keys so lookups stay fast.

## Two-sum: the classic interview question

```try-python
def two_sum(prices, budget):
    seen = {}                       # price -> index
    for i, p in enumerate(prices):
        need = budget - p
        if need in seen:
            return seen[need], i
        seen[p] = i
    return None

prices = [450, 1200, 350, 900, 2500, 750]
print(two_sum(prices, 1600))       # indexes of two items costing exactly 1600 together
print(two_sum(prices, 10))
```

The brute-force approach checks every pair (O(n²)); the hash table version is a single pass (O(n)).

## Grouping and indexing records

```try-python
from collections import defaultdict

transactions = [
    {"receipt": "QJK1", "phone": "0712000001", "amount": 1500},
    {"receipt": "QJK2", "phone": "0722000002", "amount": 300},
    {"receipt": "QJK3", "phone": "0712000001", "amount": 700},
    {"receipt": "QJK4", "phone": "0733000003", "amount": 2500},
]

by_receipt = {t["receipt"]: t for t in transactions}          # index for O(1) lookups
by_phone = defaultdict(list)
for t in transactions:
    by_phone[t["phone"]].append(t)

print(by_receipt["QJK3"]["amount"])
for phone, items in by_phone.items():
    print(phone, len(items), "payments, total", sum(t["amount"] for t in items))
```

Building an index once and then looking items up is far faster than searching the list each time, which is exactly what database indexes do.

## Caching expensive results

```try-python
import time
from functools import lru_cache

@lru_cache(maxsize=1000)
def delivery_fee(town):
    time.sleep(0.05)             # pretend this calls a slow pricing service
    return {"Nairobi": 200, "Thika": 300}.get(town, 500)

start = time.perf_counter()
for town in ["Nairobi", "Thika", "Nairobi", "Nairobi", "Thika", "Kisumu"]:
    delivery_fee(town)
print(f"Took about {time.perf_counter() - start:.2f}s for 6 lookups (only 3 slow calls)")
print(delivery_fee.cache_info())
```

`lru_cache` stores results in a hash table keyed by the arguments. Web applications use the same idea with Redis or Memcached to avoid repeating slow database queries.

## What makes a good key

| Key | Usable? | Why |
|---|---|---|
| `"0712000001"` (string) | Yes | Immutable, hashable |
| `42`, `3.5`, `True` | Yes | Immutable |
| `("Nakuru", "2026-09")` (tuple) | Yes, if its contents are immutable | Great for multi-part keys |
| `["a", "b"]` (list) | No | Mutable: its hash could change |
| `{"a": 1}` (dict) | No | Mutable |
| `frozenset({1, 2})` | Yes | Immutable set |

```try-python
sales = {}
for town, month, amount in [("Nakuru", "2026-08", 1800), ("Nakuru", "2026-09", 1400), ("Thika", "2026-09", 840), ("Nakuru", "2026-09", 600)]:
    sales[(town, month)] = sales.get((town, month), 0) + amount
print(sales)
try:
    bad = {["Nakuru"]: 1}
except TypeError as e:
    print("Error:", e)
```

## Hashing beyond dictionaries

- **Password storage** uses slow cryptographic hashes (bcrypt, Argon2): related idea, different goal (security, not speed).
- **File integrity**: SHA-256 checksums verify downloads haven't changed.
- **Git** identifies every commit and file by its hash.
- **Load balancers** hash a user's ID to send them to the same server consistently.
- **Bloom filters** use several hashes to test "probably seen" cheaply (used in databases and browsers).

## Performance notes

| Operation | Average | Worst case |
|---|---|---|
| Lookup, insert, delete | O(1) | O(n) (many collisions) |
| Iterate all items | O(n) | O(n) |

Python dictionaries keep insertion order (since Python 3.7) and resize automatically, so in everyday use you get fast, predictable behaviour.

## Practice

1. Find the first repeated M-Pesa receipt code in a list using a set.
2. Count word frequencies in a paragraph and print the top 5.
3. Group students by form into a dictionary of lists.
4. Check whether two strings are anagrams using a dictionary of character counts.
5. Use a tuple key `(town, product)` to total sales.

:::think A developer uses a list of 200,000 customer phone numbers and checks `if phone in customers` for each of 100,000 new orders. The job takes many minutes. What's the fix and why does it work?
Convert the list to a set once (`customers = set(customers)`). Membership checks on a list scan item by item (O(n)), while sets use hashing for roughly constant-time lookups (O(1)), so the total work drops from billions of comparisons to about 300,000 operations.
:::

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
Q: What is the ratio of stored items to buckets in a hash table called? (two words)
A: load factor
Q: Which Python decorator caches function results in a hash table?
A: lru_cache | functools.lru_cache | @lru_cache
Q: Can a tuple of strings be a dictionary key? (yes or no)
A: yes
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
