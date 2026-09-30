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
