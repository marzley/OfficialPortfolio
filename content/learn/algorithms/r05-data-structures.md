---
slug: data-structures
title: "Data structures: arrays/lists, tuples, sets, dictionaries, stacks, queues, linked lists, trees, heaps and graphs, and when to use each"
after: KEEP
---
# Data structures: arrays/lists, tuples, sets, dictionaries, stacks, queues, linked lists, trees, heaps and graphs, and when to use each

A **data structure** is a way of organising data in memory so it can be used efficiently. Choosing the right one can make a program thousands of times faster and much simpler: a set for checking duplicate M-Pesa receipts, a queue for customers waiting for service, a dictionary for looking up students by admission number, a tree for a school's folder structure, a graph for matatu routes. This unit surveys the essential data structures, how they work, their strengths and costs, and how to use them in Python, with deeper dives in the lessons that follow.

:::note What you will learn
- Why data structures matter
- Arrays and Python lists
- Tuples and immutability
- Sets for uniqueness and fast membership
- Dictionaries (hash tables) for key–value lookups
- Stacks (LIFO) and queues (FIFO), deques
- Linked lists
- Trees, binary search trees and heaps (priority queues)
- Graphs
- A decision guide for choosing a structure
:::

## Why they matter

Every structure makes some operations fast and others slow. The question is always: **what will my program do most often?** Look up by key? Keep order? Remove the oldest item? Find the smallest? Check if something exists?

## Arrays and lists

An **array** stores items in contiguous memory, accessed by **index**. Python's **list** is a dynamic array: it grows automatically.

```try-python
marks = [67, 82, 45, 90]
print(marks[0], marks[-1])       # index access: O(1)
marks.append(58)                 # add to end: O(1) amortised
marks.insert(0, 99)              # insert at start: O(n), shifts everything
print(marks, len(marks))
print(82 in marks)               # search: O(n)
print(marks[1:3])                # slicing
```

**Use for**: ordered collections you loop over or access by position.

## Tuples

Like lists, but **immutable** (can't change after creation). Good for fixed records and as dictionary keys.

```try-python
location = (-1.2921, 36.8219)       # Nairobi latitude, longitude
lat, lon = location                 # unpacking
routes = {("Nairobi", "Nakuru"): 160, ("Nairobi", "Mombasa"): 485}
print(routes[("Nairobi", "Nakuru")], "km")
```

## Sets

Unordered collections of **unique** items, with very fast membership checks (hash-based).

```try-python
used_receipts = {"QJK1A", "QJK2B"}
new = "QJK2B"
if new in used_receipts:                       # O(1) average
    print("Duplicate receipt! Reject payment")
used_receipts.add("QJK3C")

form3 = {"Brian", "Faith", "Halima"}
football = {"Faith", "Juma", "Halima"}
print(form3 & football)    # intersection: in both
print(form3 | football)    # union
print(form3 - football)    # difference
```

**Use for**: removing duplicates, membership tests, comparing groups.

## Dictionaries (hash tables)

Store **key → value** pairs with average O(1) lookups.

```try-python
stock = {"unga": 40, "sugar": 25, "oil": 12}
stock["sugar"] -= 3                      # update
stock["rice"] = 30                       # add
print(stock.get("salt", 0))              # default if missing
for item, qty in stock.items():
    if qty < 20:
        print("Reorder", item)

# Counting with a dictionary
votes = ["A", "B", "A", "C", "A", "B"]
counts = {}
for v in votes:
    counts[v] = counts.get(v, 0) + 1
print(counts)
```

**Use for**: lookups by ID/name, counting, caching, JSON-like records. (See the hash tables lesson.)

## Stacks: last in, first out (LIFO)

Like a pile of plates: add (push) and remove (pop) from the top.

```try-python
history = []
for page in ["home", "products", "cart"]:
    history.append(page)          # push
print("Back to:", history.pop())  # pop → "cart"
print("Now on:", history[-1])     # peek
```

**Uses**: undo/redo, browser back button, checking balanced brackets, function calls (the call stack), depth-first search.

## Queues: first in, first out (FIFO)

Like a queue at a bank: the first person to arrive is served first. Use `collections.deque` (fast at both ends).

```try-python
from collections import deque
customers = deque()
customers.append("Wanjiku")        # enqueue
customers.append("Otieno")
customers.append("Achieng")
print("Serving:", customers.popleft())   # dequeue → Wanjiku
print("Waiting:", list(customers))
```

**Uses**: task queues (sending SMS in order), print queues, breadth-first search, handling requests. (See the stacks and queues lesson.)

## Linked lists

Each **node** stores a value and a pointer to the next node. Inserting/removing at the front is O(1) without shifting, but accessing the k-th item requires walking the chain (O(n)).

```try-python
class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

# Build: 10 -> 20 -> 30
head = Node(10, Node(20, Node(30)))
head = Node(5, head)               # insert at front: O(1)

node = head
while node:
    print(node.value, end=" -> " if node.next else "\n")
    node = node.next
```

In Python you rarely build linked lists yourself (lists and deques cover most needs), but they explain how many structures work and are common interview topics.

## Trees

A **tree** is a hierarchy of nodes: one **root**, and each node has **children**. Examples: folders on a computer, an organisation chart, HTML documents (the DOM), categories in an online shop.

A **binary search tree (BST)** keeps smaller values to the left and larger to the right, allowing O(log n) search when balanced:

```try-python
class BST:
    def __init__(self, value):
        self.value, self.left, self.right = value, None, None
    def insert(self, v):
        if v < self.value:
            if self.left: self.left.insert(v)
            else: self.left = BST(v)
        else:
            if self.right: self.right.insert(v)
            else: self.right = BST(v)
    def contains(self, v):
        if v == self.value: return True
        branch = self.left if v < self.value else self.right
        return branch.contains(v) if branch else False
    def in_order(self):                     # visits values in sorted order
        left = self.left.in_order() if self.left else []
        right = self.right.in_order() if self.right else []
        return left + [self.value] + right

t = BST(50)
for v in [30, 70, 20, 40, 60, 80]:
    t.insert(v)
print(t.contains(60), t.contains(65))
print(t.in_order())
```

Databases use balanced trees (B-trees) for their indexes.

## Heaps (priority queues)

A **heap** always gives quick access to the **smallest** (min-heap) or largest item. Great for "what's most urgent next?"

```try-python
import heapq
tasks = []
heapq.heappush(tasks, (2, "Reply to supplier"))
heapq.heappush(tasks, (1, "Fix payment outage"))      # lower number = higher priority
heapq.heappush(tasks, (3, "Update blog"))
while tasks:
    priority, task = heapq.heappop(tasks)
    print(priority, task)
```

**Uses**: scheduling, hospital triage systems, Dijkstra's shortest path, finding top-k items.

## Graphs

A **graph** has **nodes** (vertices) connected by **edges**: towns and roads, people and friendships, web pages and links, network devices and cables. Often stored as an **adjacency list** (a dictionary of neighbours):

```try-python
roads = {
    "Nairobi": ["Nakuru", "Machakos", "Thika"],
    "Nakuru": ["Nairobi", "Eldoret", "Kisumu"],
    "Eldoret": ["Nakuru", "Kisumu"],
    "Kisumu": ["Nakuru", "Eldoret"],
    "Machakos": ["Nairobi"],
    "Thika": ["Nairobi"],
}
print("Direct roads from Nakuru:", roads["Nakuru"])
```

See the graphs, BFS and DFS lesson for searching routes.

## Choosing a structure

| Need | Use |
|---|---|
| Ordered items, access by position | List |
| Fixed record that shouldn't change | Tuple |
| Unique items, fast "is it there?" | Set |
| Look up by key, counting | Dictionary |
| Undo, back button, nested structures | Stack (list) |
| First come, first served | Queue (deque) |
| Always get the smallest/most urgent | Heap (heapq) |
| Hierarchy | Tree |
| Networks and connections | Graph |
| Sorted data with fast search and inserts | Balanced tree / database index (or sorted list + bisect for small data) |

:::think A matatu SACCO app must: (1) record buses in the order they arrive at the stage to load passengers fairly, (2) quickly check whether a number plate is registered, and (3) store each bus's driver and route. Which data structures fit each need?
(1) A queue (deque) for arrival order (FIFO). (2) A set of registered plates for O(1) membership checks. (3) A dictionary mapping plate → {"driver": ..., "route": ...}.
:::

## Summary

- Data structures organise data for efficient operations; choose based on what you do most.
- Lists (ordered, index access), tuples (immutable), sets (unique, fast membership), dictionaries (key lookups).
- Stacks are LIFO, queues FIFO (use deque); linked lists allow O(1) front inserts but slow indexing.
- Trees model hierarchies (BSTs, database B-trees); heaps give the smallest/most urgent item fast; graphs model networks.
- Use the decision guide to pick the right structure for each requirement.

```quiz
Q: Which structure works last in, first out?
A: stack | a stack
Q: Which structure works first in, first out?
A: queue | a queue
Q: Which Python structure stores unique items with fast membership checks?
A: set | a set
Q: Which Python module provides a heap (priority queue)?
A: heapq
Q: Which data structure models towns connected by roads?
A: graph | a graph
Q: Which Python class from collections gives fast appends and pops at both ends?
A: deque
```

=== exercise ===
Use a list as a **stack**: push `"a"`, `"b"` and `"c"`, then pop once and print the popped value.
=== starter ===
stack = []
=== expected ===
c
=== must_contain ===
append
pop
