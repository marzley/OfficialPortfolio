---
slug: stacks-queues
title: Stacks and queues
after: data-structures
---
# Stacks and queues

Two simple data structures that appear everywhere: your browser's Back button, "undo", M-Pesa request queues, printer jobs and customer service lines.

## Stack: last in, first out (LIFO)

Think of a stack of plates: you add to the top and take from the top.

| Operation | Meaning |
|---|---|
| **push** | Add to the top |
| **pop** | Remove from the top |
| **peek** | Look at the top without removing |

```try-python
history = []                   # a Python list works as a stack
history.append("home")         # push
history.append("products")
history.append("cart")
print("Current page:", history[-1])   # peek
history.pop()                  # Back button
print("After Back:", history[-1])
print("Stack:", history)
```

### Where stacks are used

- **Undo** in editors: each action is pushed; Undo pops the last one.
- The browser **Back** button.
- The **call stack**: how functions (and recursion) keep track of where to return.
- Checking **balanced brackets** in code:

```try-python
def balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

for s in ["(a[1] + b[2])", "{[}]", "((x)", "print('hi')"]:
    print(f"{s:<16} {balanced(s)}")
```

## Queue: first in, first out (FIFO)

Like a queue at the bank: the first to arrive is served first.

| Operation | Meaning |
|---|---|
| **enqueue** | Join at the back |
| **dequeue** | Leave from the front |

Removing from the front of a Python list is slow for big lists, so use `collections.deque`:

```try-python
from collections import deque

customers = deque()
customers.append("Amina")      # enqueue
customers.append("Brian")
customers.append("Chebet")
print("Serving:", customers.popleft())   # dequeue: Amina
print("Next:", customers[0])
customers.append("Dennis")
print("Waiting:", list(customers))
```

### Where queues are used

- Printer jobs, customer service tickets, SMS sending queues
- Web servers handling requests, and background job queues (sending emails, processing M-Pesa callbacks)
- **Breadth-first search** in graphs (next lesson)

## Simulating a service queue

```try-python
from collections import deque
import random

random.seed(3)
queue = deque()
served = 0
for minute in range(1, 11):
    arrivals = random.randint(0, 2)
    for _ in range(arrivals):
        queue.append(f"C{minute}-{_}")
    if queue:
        queue.popleft()
        served += 1
    print(f"min {minute:2}: +{arrivals} arrived, {len(queue)} waiting")
print("Served:", served, "| still waiting:", len(queue))
```

With one teller serving one customer a minute, the queue grows when arrivals average more than one per minute. That's exactly how banks decide how many tellers to open.

## Priority queues

Sometimes the most **important** item goes first (emergency patients, VIP support tickets). Python's `heapq` gives the smallest item first:

```try-python
import heapq
tickets = []
heapq.heappush(tickets, (2, "Password reset"))
heapq.heappush(tickets, (1, "Payments failing!"))    # 1 = most urgent
heapq.heappush(tickets, (3, "Change logo colour"))
while tickets:
    priority, task = heapq.heappop(tickets)
    print(priority, task)
```

## Comparison

| | Stack | Queue |
|---|---|---|
| Order | LIFO (last in, first out) | FIFO (first in, first out) |
| Python | `list` (`append`, `pop`) | `collections.deque` (`append`, `popleft`) |
| Everyday example | Plates, Undo | Bank line, printer |

## Where stacks and queues are used

Stacks and queues are everywhere in software: the browser's Back button and every app's Undo are stacks; print jobs, customer support tickets, SMS sending and payment processing systems use queues; operating systems schedule tasks with queues; compilers check brackets with stacks. Understanding them helps you design systems that process work fairly and in the right order, and they're common in interviews.

## Stack application: checking balanced brackets

```try-python
def balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

for code in ["print(len([1, 2]))", "{ if (x) { y(); }", "[(])", "total = (a + b) * {c}"]:
    print(f"{code:<24} balanced: {balanced(code)}")
```

Code editors and compilers use this exact idea to report "missing bracket" errors.

## Stack application: undo and redo

```try-python
class Editor:
    def __init__(self):
        self.text = ""
        self.undo_stack = []
        self.redo_stack = []

    def type(self, s):
        self.undo_stack.append(self.text)
        self.redo_stack.clear()          # new action clears redo history
        self.text += s

    def undo(self):
        if self.undo_stack:
            self.redo_stack.append(self.text)
            self.text = self.undo_stack.pop()

    def redo(self):
        if self.redo_stack:
            self.undo_stack.append(self.text)
            self.text = self.redo_stack.pop()

e = Editor()
e.type("Habari ")
e.type("Kenya")
print(repr(e.text))
e.undo(); print(repr(e.text))
e.redo(); print(repr(e.text))
e.undo(); e.type("Nairobi"); print(repr(e.text))
e.redo(); print(repr(e.text))   # nothing to redo after a new action
```

Two stacks implement undo and redo. Typing something new clears the redo stack, just like real editors.

## Queue application: round-robin task scheduling

```try-python
from collections import deque

# (job name, time units still needed)
jobs = deque([("Print fee statements", 3), ("Send SMS reminders", 1), ("Backup database", 4)])
slice_size = 2
clock = 0
while jobs:
    name, remaining = jobs.popleft()
    work = min(slice_size, remaining)
    clock += work
    remaining -= work
    if remaining:
        jobs.append((name, remaining))       # back of the queue for another turn
        print(f"t={clock}: {name} paused, {remaining} left")
    else:
        print(f"t={clock}: {name} finished")
```

Operating systems give each task a short time slice in turn so no single task blocks the others.

## Queue application: breadth-first search (shortest path)

Queues explore things level by level. Here's the fewest number of matatu changes between towns:

```try-python
from collections import deque

routes = {
    "Nairobi": ["Thika", "Nakuru", "Machakos"],
    "Thika": ["Nairobi", "Nyeri"],
    "Nakuru": ["Nairobi", "Eldoret", "Kisumu"],
    "Machakos": ["Nairobi"],
    "Nyeri": ["Thika"],
    "Eldoret": ["Nakuru", "Kitale"],
    "Kisumu": ["Nakuru"],
    "Kitale": ["Eldoret"],
}

def shortest_route(start, goal):
    queue = deque([[start]])
    visited = {start}
    while queue:
        path = queue.popleft()
        town = path[-1]
        if town == goal:
            return path
        for nxt in routes[town]:
            if nxt not in visited:
                visited.add(nxt)
                queue.append(path + [nxt])
    return None

print(" -> ".join(shortest_route("Machakos", "Kitale")))
print(" -> ".join(shortest_route("Nyeri", "Kisumu")))
```

Breadth-first search (BFS) finds the path with the fewest steps; it's used in maps, social networks ("people you may know") and network routing.

## Priority queue application: emergency triage

```try-python
import heapq

patients = []
counter = 0     # keeps arrival order for equal priorities
def arrive(name, priority):           # 1 = most urgent
    global counter
    heapq.heappush(patients, (priority, counter, name))
    counter += 1

arrive("Amina (sprained ankle)", 3)
arrive("Brian (chest pain)", 1)
arrive("Chebet (fever)", 2)
arrive("Dennis (deep cut)", 1)

while patients:
    priority, _, name = heapq.heappop(patients)
    print(f"Priority {priority}: treating {name}")
```

A heap always gives the smallest item quickly (O(log n) to add or remove). The counter breaks ties fairly by arrival time.

## Message queues in real systems

Large applications use **message queues** (RabbitMQ, Redis queues, Amazon SQS, Kafka) to handle work in the background:

1. A customer pays; the web server records the order and puts "send receipt" on a queue.
2. The server responds immediately ("Payment received").
3. A background **worker** takes jobs from the queue: sends the SMS/email, updates stock, generates the PDF.
4. If the SMS gateway is down, the job is retried later instead of failing the payment.

This keeps websites fast and reliable even under heavy load (e.g. thousands of school fee payments on opening day).

## Complexity summary

| Operation | Python list as stack | `deque` as queue | `heapq` priority queue |
|---|---|---|---|
| Add | `append` O(1) | `append` O(1) | `heappush` O(log n) |
| Remove | `pop()` O(1) | `popleft` O(1) | `heappop` O(log n) |
| Peek | `stack[-1]` O(1) | `q[0]` O(1) | `heap[0]` O(1) |

Avoid `list.pop(0)` for queues: it shifts every element (O(n)).

## Practice

1. Reverse a string using a stack.
2. Use a stack to evaluate a postfix expression like `3 4 + 2 *` (answer 14).
3. Simulate a bank with two tellers serving one shared queue of 10 customers.
4. Use BFS to find the shortest path in a small grid maze.
5. Use `heapq` to always process the largest order first (hint: push negative amounts).

:::think Why is `collections.deque` better than a Python list for a queue that handles thousands of jobs?
Removing from the front of a list with `pop(0)` shifts all remaining elements, taking time proportional to the list length, so a large queue becomes slow. A deque is designed for fast additions and removals at both ends (O(1)), so performance stays constant no matter how many jobs are queued.
:::

```quiz
Q: What does LIFO stand for? (four words)
A: last in first out | last in, first out
Q: Which data structure does the browser Back button use?
A: stack | a stack
Q: Which Python class is best for a queue?
A: deque | collections.deque
Q: Which deque method removes from the front?
A: popleft | popleft()
Q: What kind of queue serves the most urgent item first? (one word before "queue")
A: priority | priority queue
Q: Which search algorithm uses a queue to find the path with the fewest steps? (abbreviation)
A: BFS | breadth-first search | breadth first search
Q: Which Python module provides a heap-based priority queue?
A: heapq
Q: How many stacks does a simple undo/redo system use?
A: 2 | two
```
=== exercise ===
Use a list as a stack: push `"a"`, `"b"`, `"c"`, then pop once and print the stack: **['a', 'b']**.
=== starter ===
stack = []
# push three items, pop one, print
=== expected ===
['a', 'b']
=== must_contain ===
append
pop
