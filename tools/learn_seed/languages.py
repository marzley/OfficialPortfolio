from common import track, lesson

RUN_NOTE = "> The code boxes here are for reading and copying. Run them free online at {where}, or install the tools on your computer."

# ---------------- Algorithms & problem solving (runnable Python) ----------------
a = track("algorithms", "Algorithms & problem solving", "python",
          "Think like a programmer: pseudocode, flowcharts, searching, sorting, recursion, Big O and data structures, with runnable Python examples.")

lesson(a, "pseudocode-flowcharts", "Pseudocode and flowcharts", """
# Pseudocode and flowcharts

An **algorithm** is a clear list of steps that solves a problem. A recipe is an algorithm. So is "how to buy airtime with M-Pesa".

Before writing code, programmers plan the steps in plain language (**pseudocode**) or as a diagram (**flowchart**).

## Pseudocode example: grade a student

```
START
  INPUT marks
  IF marks >= 70 THEN grade = "A"
  ELSE IF marks >= 60 THEN grade = "B"
  ELSE IF marks >= 50 THEN grade = "C"
  ELSE IF marks >= 40 THEN grade = "D"
  ELSE grade = "E"
  OUTPUT grade
END
```

## Flowchart symbols

| Shape | Meaning |
|---|---|
| Oval | Start / End |
| Parallelogram | Input / Output |
| Rectangle | Process (a calculation or action) |
| Diamond | Decision (yes/no question) |
| Arrow | Direction of flow |

## The same algorithm in Python

```try-python
marks = 64

if marks >= 70:
    grade = "A"
elif marks >= 60:
    grade = "B"
elif marks >= 50:
    grade = "C"
elif marks >= 40:
    grade = "D"
else:
    grade = "E"

print("Grade:", grade)
```

Change `marks` and run it again. Every programming language can express this same logic: learning to **think in steps** is the real skill.

```quiz
Q: Which flowchart shape is used for a decision?
A: diamond | a diamond | rhombus
Q: Which flowchart shape is used for input and output?
A: parallelogram | a parallelogram
Q: What do we call a plain-language plan of an algorithm's steps?
A: pseudocode | pseudo code
```
""", "Write code that prints **Pass** if `score` is 50 or more, otherwise **Fail**. Test it with `score = 72`.",
       "score = 72\n", "Pass", "if")

lesson(a, "searching", "Searching: linear and binary search", """
# Searching: linear and binary search

## Linear search

Check every item one by one until you find it. Simple, works on any list, but slow on big lists.

```try-python
def linear_search(items, target):
    for i, value in enumerate(items):
        if value == target:
            return i          # position found
    return -1                 # not found

towns = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"]
print(linear_search(towns, "Nakuru"))
print(linear_search(towns, "Thika"))
```

## Binary search

Works only on a **sorted** list. Look at the middle item: if the target is smaller, throw away the right half; if bigger, throw away the left half. Repeat. Each step halves the work, like finding a word in a dictionary.

```try-python
def binary_search(items, target):
    low, high = 0, len(items) - 1
    steps = 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if items[mid] == target:
            print("found in", steps, "steps")
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    print("not found after", steps, "steps")
    return -1

numbers = list(range(0, 1_000_000, 2))   # 500,000 sorted even numbers
print(binary_search(numbers, 777_778))
```

Half a million numbers, found in about 19 steps. A linear search could need 500,000.

```quiz
Q: What must be true about a list before you can use binary search?
A: it must be sorted | sorted | it is sorted
Q: Which search checks every item one by one?
A: linear search | linear | sequential search
Q: Binary search on 1,000,000 sorted items needs at most about how many steps? (hint: 2 to the power of 20 is about a million)
A: 20 | 19 | 20 steps
```
""", "Write a function `count_of(items, target)` that uses a loop to count how many times `target` appears, then print `count_of([3, 1, 3, 3, 2], 3)`.",
       "def count_of(items, target):\n    \n\nprint(count_of([3, 1, 3, 3, 2], 3))\n", "3", "for\ndef count_of")

lesson(a, "sorting", "Sorting algorithms", """
# Sorting algorithms

Sorting puts items in order: prices from cheapest, names A–Z, scores highest first.

## Bubble sort (easy to understand, slow)

Compare neighbours and swap them if they're in the wrong order. Repeat until nothing swaps. The biggest values "bubble" to the end.

```try-python
def bubble_sort(items):
    items = items[:]            # work on a copy
    n = len(items)
    for i in range(n):
        swapped = False
        for j in range(n - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            break
    return items

print(bubble_sort([29, 3, 72, 15, 8, 41]))
```

## Selection and insertion sort

- **Selection sort**: find the smallest item, put it first; find the next smallest, put it second; and so on.
- **Insertion sort**: like sorting playing cards in your hand: take each item and insert it into the right place among the ones already sorted. Fast on nearly-sorted data.

## Merge sort (fast)

Split the list in half, sort each half (by splitting again), then **merge** the two sorted halves. This "divide and conquer" approach is much faster on big lists.

```try-python
def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    left, right = merge_sort(items[:mid]), merge_sort(items[mid:])
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    return merged + left[i:] + right[j:]

print(merge_sort([29, 3, 72, 15, 8, 41, 0, 56]))
```

In real Python code, just use `sorted(items)` or `items.sort()`: they use **Timsort**, a very fast hybrid of merge and insertion sort.

```quiz
Q: Which sort repeatedly swaps neighbouring items that are in the wrong order?
A: bubble sort | bubble
Q: Merge sort uses which strategy? (three words)
A: divide and conquer
Q: What is the name of the algorithm Python's sorted() uses?
A: Timsort | tim sort
```
""", "Use `sorted()` with `reverse=True` to print the list `[40, 85, 12, 67]` from highest to lowest.",
       "scores = [40, 85, 12, 67]\n", "[85, 67, 40, 12]", "sorted\nreverse")

lesson(a, "big-o", "Big O: how fast is your code?", """
# Big O: how fast is your code?

**Big O notation** describes how the work grows as the input grows. It helps you choose code that stays fast when your shop has 10 customers or 10 million.

| Big O | Name | Example | 1,000 items → steps |
|---|---|---|---|
| O(1) | Constant | Get `items[5]`, look up a dictionary key | 1 |
| O(log n) | Logarithmic | Binary search | ~10 |
| O(n) | Linear | Loop through a list once | 1,000 |
| O(n log n) | Linearithmic | Merge sort, Python's `sorted()` | ~10,000 |
| O(n²) | Quadratic | Loop inside a loop (bubble sort, comparing every pair) | 1,000,000 |

## See the difference

```try-python
import time

n = 3000
data = list(range(n))

start = time.time()
total = 0
for x in data:            # O(n)
    total += x
print("O(n) loop:", round(time.time() - start, 4), "s")

start = time.time()
pairs = 0
for x in data:            # O(n²): a loop inside a loop
    for y in data:
        pairs += 1
print("O(n²) loops:", round(time.time() - start, 4), "s,", pairs, "steps")
```

## A practical tip: use sets and dictionaries for lookups

Checking `if x in some_list` is O(n). Checking `if x in some_set` is O(1) on average.

```try-python
import time
phones = [f"07{n:08d}" for n in range(200_000)]
phone_set = set(phones)

start = time.time(); print("0700199999" in phones); print("list:", round(time.time() - start, 5), "s")
start = time.time(); print("0700199999" in phone_set); print("set: ", round(time.time() - start, 5), "s")
```

```quiz
Q: What is the Big O of looking up a key in a dictionary (on average)?
A: O(1) | constant
Q: What is the Big O of a loop inside a loop over the same list?
A: O(n²) | O(n^2) | quadratic
Q: What is the Big O of binary search?
A: O(log n) | logarithmic
```
""")

lesson(a, "data-structures", "Data structures: stacks, queues and more", """
# Data structures: stacks, queues and more

A **data structure** is a way of organising data so the operations you need are fast.

## Stack: last in, first out (LIFO)

Like a pile of plates. Used for the browser's Back button and undo.

```try-python
history = []
history.append("home")        # push
history.append("pricing")
history.append("contact")
print("Back to:", history.pop())   # pop removes the last one
print(history)
```

## Queue: first in, first out (FIFO)

Like a bank queue. Used for print jobs, messages, customer support tickets.

```try-python
from collections import deque
queue = deque()
queue.append("Wanjiku")       # join the queue
queue.append("Otieno")
queue.append("Amina")
print("Serving:", queue.popleft())
print("Waiting:", list(queue))
```

## Dictionary (hash map)

Key → value, with very fast lookups. Used everywhere: user accounts by email, prices by product.

## Tree

Items arranged in a hierarchy: folders on a computer, the HTML DOM, a company org chart.

## Graph

Points (nodes) connected by lines (edges): roads between towns, friends on social media, routers on the internet. Google Maps finds routes with graph algorithms such as Dijkstra's.

```try-python
roads = {
    "Nairobi": ["Nakuru", "Thika", "Machakos"],
    "Nakuru": ["Nairobi", "Eldoret", "Kisumu"],
    "Eldoret": ["Nakuru"],
    "Kisumu": ["Nakuru"],
    "Thika": ["Nairobi"],
    "Machakos": ["Nairobi", "Mombasa"],
    "Mombasa": ["Machakos"],
}

def route(start, goal):
    # breadth-first search: finds the route with the fewest towns
    queue, seen = [[start]], {start}
    while queue:
        path = queue.pop(0)
        if path[-1] == goal:
            return path
        for nxt in roads[path[-1]]:
            if nxt not in seen:
                seen.add(nxt)
                queue.append(path + [nxt])

print(" -> ".join(route("Kisumu", "Mombasa")))
```

```quiz
Q: Which data structure is last in, first out?
A: stack | a stack
Q: Which data structure is first in, first out?
A: queue | a queue
Q: Folders inside folders on a computer form which data structure?
A: tree | a tree
Q: Towns connected by roads form which data structure?
A: graph | a graph
```
""", "Use a list as a **stack**: push `\"a\"`, `\"b\"` and `\"c\"`, then pop once and print the popped value.",
       "stack = []\n", "c", "append\npop")

lesson(a, "recursion", "Recursion", """
# Recursion

A **recursive** function calls itself to solve a smaller version of the same problem. Every recursive function needs:

1. A **base case** that stops the recursion.
2. A **recursive case** that moves towards the base case.

## Factorial

5! = 5 × 4 × 3 × 2 × 1 = 120

```try-python
def factorial(n):
    if n <= 1:            # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))
print(factorial(10))
```

## Counting files in folders

Recursion is natural for trees, like folders inside folders:

```try-python
folders = {
    "Documents": {"CV.pdf": None, "School": {"Notes.docx": None, "Timetable.xlsx": None}},
    "Photos": {"Mombasa.jpg": None},
}

def count_files(folder):
    total = 0
    for name, content in folder.items():
        if content is None:
            total += 1                 # it's a file
        else:
            total += count_files(content)   # it's a folder: look inside
    return total

print(count_files(folders))
```

## Watch out

- Without a base case, the function calls itself forever and Python stops it with a **RecursionError**.
- Some recursive solutions repeat work. The classic Fibonacci example gets slow quickly. Save results you've already computed (**memoisation**) with `functools.lru_cache`.

```try-python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(15)])
print(fib(90))
```

```quiz
Q: What stops a recursive function from calling itself forever? (two words)
A: base case | the base case
Q: What error does Python raise when recursion goes too deep?
A: RecursionError
Q: Saving already-computed results to avoid repeating work is called…
A: memoisation | memoization | caching
```
""", "Write a recursive function `total(n)` that returns 1 + 2 + … + n, and print `total(100)`.",
       "def total(n):\n    \n\nprint(total(100))\n", "5050", "def total\ntotal(n")

# ---------------- TypeScript ----------------
ts = track("typescript", "TypeScript", "none",
           "JavaScript with types: catch mistakes before your code runs. Used by most modern web apps built with React, Angular and Node.js.")

lesson(ts, "introduction", "TypeScript introduction", """
# TypeScript introduction

**TypeScript** is JavaScript plus **types**. You write `.ts` files, and the TypeScript compiler checks them and turns them into normal JavaScript that browsers and Node.js run.

Why teams use it:

- Catches mistakes **before** the code runs (typos, wrong arguments, missing fields).
- Better autocomplete in editors like VS Code.
- Makes big projects easier to change safely.

```
let shop: string = "Mama Mboga";
let price: number = 150;
let open: boolean = true;

price = "cheap";   // Error: Type 'string' is not assignable to type 'number'.
```

TypeScript can also **infer** types, so you don't have to write them everywhere:

```
let total = 450;         // TypeScript knows this is a number
total.toUpperCase();     // Error: Property 'toUpperCase' does not exist on type 'number'.
```

## Setting it up

```
npm install -g typescript     # install the compiler
tsc --init                    # create tsconfig.json
tsc app.ts                    # compile app.ts to app.js
node app.js
```

""" + RUN_NOTE.format(where="**typescriptlang.org/play**") + """

```quiz
Q: What does the TypeScript compiler turn .ts files into?
A: JavaScript | js
Q: What is the command-line name of the TypeScript compiler?
A: tsc
Q: When TypeScript works out a type without you writing it, this is called type…
A: inference | infer
```
""")

lesson(ts, "types-interfaces", "Types, interfaces and functions", """
# Types, interfaces and functions

## Arrays and union types

```
let towns: string[] = ["Nairobi", "Kisumu"];
let phone: string | null = null;         // a string OR null
type Status = "pending" | "paid" | "failed";
let s: Status = "paid";
s = "done";   // Error: only the three listed values are allowed
```

## Interfaces describe objects

```
interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;          // ? means optional
}

const c: Customer = { id: 1, name: "Wanjiku", phone: "0712345678" };
```

## Typed functions

```
function vat(amount: number, rate: number = 0.16): number {
  return amount * rate;
}

vat(1000);          // 160
vat("1000");        // Error: Argument of type 'string' is not assignable to parameter of type 'number'.

const greet = (c: Customer): string => `Habari ${c.name}!`;
```

## Generics

Generics let a function work with many types while keeping them checked:

```
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const n = first([10, 20]);        // n is number
const t = first(["a", "b"]);      // t is string
```

```quiz
Q: Which symbol makes an interface field optional?
A: ? | question mark
Q: Which keyword describes the shape of an object in TypeScript?
A: interface
Q: What do we call a type like "pending" | "paid"? (a ___ type)
A: union
```
""")

lesson(ts, "typescript-in-practice", "TypeScript in real projects", """
# TypeScript in real projects

## Typing data from an API

```
interface Product { id: number; name: string; price: number; }

async function loadProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Could not load products");
  return res.json() as Promise<Product[]>;
}

loadProducts().then(list => {
  list.forEach(p => console.log(p.name, p.price.toFixed(2)));
});
```

## Where TypeScript is used

- **React** with Vite or Next.js: `npm create vite@latest my-app -- --template react-ts`
- **Angular** (TypeScript by default)
- **Node.js** back ends with Express or NestJS
- **React Native** mobile apps

## Useful built-in helper types

| Type | What it does |
|---|---|
| `Partial<T>` | All fields optional (good for update forms) |
| `Required<T>` | All fields required |
| `Pick<T, "a" | "b">` | Only some fields |
| `Omit<T, "id">` | All fields except some |
| `Record<string, number>` | An object map, e.g. prices by product name |

## Tips

- Turn on `"strict": true` in `tsconfig.json`: it catches the most bugs.
- Avoid `any`: it switches type checking off. Use `unknown` and check the value instead.
- Learn JavaScript first; TypeScript is easy once JavaScript makes sense.

```quiz
Q: Which tsconfig setting turns on the strictest, most helpful checks?
A: strict | "strict": true | strict true
Q: Which helper type makes every field optional?
A: Partial | Partial<T>
Q: Which type switches off type checking and should be avoided?
A: any
```
""")

# ---------------- Java ----------------
j = track("java", "Java", "none",
          "A popular language for Android apps, banks, big business systems and university courses. Learn the syntax and object-oriented programming.")

lesson(j, "introduction", "Java introduction", """
# Java introduction

**Java** is used for Android apps, banking and telecom systems, enterprise software and many university and KCSE/TVET computer studies courses. Its motto: *write once, run anywhere*: Java code compiles to **bytecode** that runs on the **Java Virtual Machine (JVM)** on any operating system.

## Hello, Kenya

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Habari, Kenya!");
    }
}
```

- Every Java program lives inside a **class**. The file name must match the public class: `Main.java`.
- The program starts at `main`.
- Statements end with `;` and blocks use `{ }`.

## Compile and run

```
javac Main.java     # compile to Main.class (bytecode)
java Main           # run it on the JVM
```

## Variables and types

Java is **statically typed**: every variable has a type that can't change.

```java
int age = 21;
double price = 1499.50;
boolean paid = true;
char grade = 'A';
String name = "Otieno";       // String starts with a capital S
var town = "Kisumu";          // Java 10+: type inferred as String
```

""" + RUN_NOTE.format(where="**onlinegdb.com** (choose Java) or **programiz.com/java-programming/online-compiler**") + """
Popular editors: **IntelliJ IDEA Community**, **VS Code** with the Java extension, and **Android Studio** for apps.

```quiz
Q: What does the JVM stand for?
A: Java Virtual Machine
Q: Which command compiles Main.java?
A: javac Main.java | javac
Q: Which method does every Java program start from?
A: main
Q: Which type holds whole numbers like 21? (3 letters)
A: int
```
""")

lesson(j, "control-flow", "Conditions, loops and arrays", """
# Conditions, loops and arrays

## if / else

```java
int marks = 67;
if (marks >= 70) {
    System.out.println("A");
} else if (marks >= 60) {
    System.out.println("B");
} else {
    System.out.println("Keep going!");
}
```

## switch

```java
String day = "SAT";
switch (day) {
    case "SAT", "SUN" -> System.out.println("Weekend");
    default -> System.out.println("Weekday");
}
```

## Loops

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Line " + i);
}

int balance = 1000;
while (balance > 0) {
    balance -= 300;
}
```

## Arrays and ArrayList

```java
int[] scores = {45, 78, 92, 60};
int total = 0;
for (int s : scores) {        // "for each" loop
    total += s;
}
System.out.println("Average: " + (double) total / scores.length);

import java.util.ArrayList;
ArrayList<String> towns = new ArrayList<>();
towns.add("Nakuru");
towns.add("Eldoret");
System.out.println(towns.size());   // 2
```

Arrays have a fixed size; an `ArrayList` can grow and shrink.

```quiz
Q: Which loop type is written like for (int s : scores)? (two words)
A: for each | for-each | enhanced for
Q: How do you get the number of items in a Java array called scores?
A: scores.length
Q: Which class gives you a list that can grow?
A: ArrayList
```
""")

lesson(j, "oop", "Classes and objects (OOP)", """
# Classes and objects (OOP)

Java is **object-oriented**. A **class** is a blueprint; an **object** is a thing made from it.

```java
public class Account {
    private String owner;          // fields (data)
    private double balance;

    public Account(String owner) { // constructor
        this.owner = owner;
        this.balance = 0;
    }

    public void deposit(double amount) {   // methods (behaviour)
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
    }

    public double getBalance() { return balance; }
}

// Using it
Account a = new Account("Amina");
a.deposit(2500);
System.out.println(a.getBalance());   // 2500.0
```

## The four pillars of OOP

| Pillar | Meaning | Example |
|---|---|---|
| **Encapsulation** | Hide data, expose safe methods | `balance` is `private`; change it only through `deposit` |
| **Inheritance** | A class extends another | `SavingsAccount extends Account` |
| **Polymorphism** | Same method, different behaviour | Each shape's `area()` is calculated differently |
| **Abstraction** | Show what, hide how | An `interface Payment { void pay(double amount); }` with MpesaPayment and CardPayment |

```java
interface Payment { void pay(double amount); }

class MpesaPayment implements Payment {
    public void pay(double amount) { System.out.println("STK push for KSh " + amount); }
}
class CardPayment implements Payment {
    public void pay(double amount) { System.out.println("Charging card KSh " + amount); }
}
```

```quiz
Q: What is the blueprint for objects called?
A: class | a class
Q: Which keyword creates a new object?
A: new
Q: Hiding data behind methods is which OOP pillar?
A: encapsulation
Q: Which keyword makes a class inherit from another?
A: extends
```
""")

lesson(j, "android-next-steps", "Java for Android and next steps", """
# Java for Android and next steps

## Android

Android apps are built in **Android Studio** (free) using **Kotlin** (Google's preferred language today) or **Java**. Knowing Java makes Kotlin easy to learn.

A button click in Java:

```java
Button payBtn = findViewById(R.id.payBtn);
payBtn.setOnClickListener(v ->
    Toast.makeText(this, "Processing payment…", Toast.LENGTH_SHORT).show()
);
```

## Handling errors: exceptions

```java
try {
    int shares = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("Please enter a number");
} finally {
    System.out.println("Done");
}
```

## Where to go next

- **Collections**: `HashMap`, `HashSet`, `List`, streams (`list.stream().filter(...)`)
- **Build tools**: Maven or Gradle
- **Back ends**: Spring Boot powers many bank and enterprise APIs
- **Databases**: JDBC and JPA/Hibernate
- **Certifications**: Oracle Certified Associate (OCA) Java

Free learning: **dev.java/learn** (official), **Codecademy Java** (free course), **Harvard CS50** for fundamentals, and the Android Developers site **developer.android.com/courses**.

```quiz
Q: Which free program is used to build Android apps? (two words)
A: Android Studio
Q: Which language does Google now prefer for Android, alongside Java?
A: Kotlin
Q: Which keyword starts a block that catches exceptions?
A: try
Q: Which popular framework is used to build Java back-end APIs? (two words)
A: Spring Boot | spring
```
""")

# ---------------- C ----------------
cc = track("c-programming", "C programming", "none",
           "The language behind operating systems, microcontrollers and embedded devices. Understand memory, pointers and how computers really work.")

lesson(cc, "introduction", "C introduction", """
# C introduction

**C** (1972) is one of the most important languages ever made. Linux, Windows' core, Python's main interpreter, databases and the chips in cars, fridges and M-Pesa agent tills are written in C. Learning it teaches you how computers really work.

```c
#include <stdio.h>

int main(void) {
    printf("Habari, Kenya!\\n");
    return 0;
}
```

- `#include <stdio.h>` brings in input/output functions like `printf`.
- `main` is where the program starts. `return 0` means "finished successfully".
- `\\n` is a new line.

## Compile and run

C is **compiled** to machine code:

```
gcc hello.c -o hello     # compile
./hello                  # run (Linux/macOS);  hello.exe on Windows
```

## Variables and printing

```c
int age = 20;
float price = 99.5f;
double pi = 3.14159;
char grade = 'B';

printf("Age: %d\\n", age);           // %d  whole numbers
printf("Price: %.2f\\n", price);     // %f  decimals (.2 = two decimal places)
printf("Grade: %c\\n", grade);       // %c  a character
```

## Input

```c
int marks;
printf("Enter marks: ");
scanf("%d", &marks);      // & gives scanf the variable's address
```

""" + RUN_NOTE.format(where="**onlinegdb.com** (choose C)") + """
On Windows, install **Code::Blocks** (with MinGW) or **VS Code** with GCC.

```quiz
Q: Which header file gives you printf?
A: stdio.h | <stdio.h>
Q: Which format specifier prints a whole number (int)?
A: %d
Q: Which popular compiler command compiles C code? (3 letters)
A: gcc
Q: What value does main return to say everything went well?
A: 0 | zero
```
""")

lesson(cc, "control-functions", "Conditions, loops and functions", """
# Conditions, loops and functions

```c
#include <stdio.h>

// A function that returns the larger of two numbers
int max(int a, int b) {
    return a > b ? a : b;
}

int main(void) {
    int marks = 58;

    if (marks >= 50) {
        printf("Pass\\n");
    } else {
        printf("Fail\\n");
    }

    for (int i = 1; i <= 5; i++) {
        printf("%d x 7 = %d\\n", i, i * 7);
    }

    int n = 10;
    while (n > 0) {
        n -= 3;
    }

    printf("Bigger: %d\\n", max(12, 40));
    return 0;
}
```

## Arrays and strings

```c
int scores[5] = {45, 78, 92, 60, 71};
int total = 0;
for (int i = 0; i < 5; i++) total += scores[i];
printf("Average: %.1f\\n", total / 5.0);

char name[20] = "Wanjiru";          // a string is an array of characters ending in '\\0'
printf("%s has %zu letters\\n", name, strlen(name));   // needs #include <string.h>
```

C doesn't check array limits: writing to `scores[10]` corrupts memory instead of giving a nice error. This is the cause of many security bugs, so always check your indexes.

```quiz
Q: What character ends every C string? (write it as in code)
A: '\\0' | \\0 | null character | null
Q: Which format specifier prints a string?
A: %s
Q: Does C stop you from writing past the end of an array? (yes or no)
A: no
```
""")

lesson(cc, "pointers-memory", "Pointers and memory", """
# Pointers and memory

Every variable lives at an **address** in memory. A **pointer** is a variable that stores an address.

```c
int balance = 500;
int *p = &balance;      // p holds the address of balance

printf("%d\\n", balance);   // 500
printf("%p\\n", (void*)p);  // an address like 0x7ffd...
printf("%d\\n", *p);        // 500  (* reads the value at the address)

*p = 800;                  // change balance through the pointer
printf("%d\\n", balance);   // 800
```

- `&x` = "address of x"
- `*p` = "the value p points to"

## Why pointers matter: changing a variable inside a function

```c
void add_bonus(int *salary) {
    *salary += 2000;
}

int main(void) {
    int pay = 30000;
    add_bonus(&pay);
    printf("%d\\n", pay);   // 32000
}
```

## Dynamic memory

```c
#include <stdlib.h>

int n = 100;
int *list = malloc(n * sizeof(int));   // ask for memory
if (list == NULL) return 1;            // always check
list[0] = 42;
free(list);                            // give it back when done
```

Forgetting `free` causes **memory leaks**; using memory after freeing it causes crashes and security holes. Languages like Python and Java manage memory for you; in C, you do it yourself.

```quiz
Q: Which operator gives the address of a variable?
A: & | ampersand
Q: Which function requests memory at run time?
A: malloc | malloc()
Q: Which function returns memory you no longer need?
A: free | free()
Q: What is it called when a program never frees memory it no longer uses? (two words)
A: memory leak | a memory leak
```
""")

lesson(cc, "structs-files", "Structs and files", """
# Structs and files

## Structs group related data

```c
#include <stdio.h>
#include <string.h>

struct Student {
    char name[40];
    int adm_no;
    float mean;
};

int main(void) {
    struct Student s;
    strcpy(s.name, "Kiprop");
    s.adm_no = 1024;
    s.mean = 74.5f;
    printf("%s (%d): %.1f\\n", s.name, s.adm_no, s.mean);

    // Save to a text file
    FILE *f = fopen("students.txt", "a");     // "a" = append, "w" = overwrite, "r" = read
    if (f == NULL) { printf("Cannot open file\\n"); return 1; }
    fprintf(f, "%s,%d,%.1f\\n", s.name, s.adm_no, s.mean);
    fclose(f);
    return 0;
}
```

## Where C is used today

- **Embedded systems and IoT**: Arduino (C/C++), ESP32, STM32 microcontrollers
- **Operating systems and drivers**: Linux kernel
- **High-performance code**: databases (SQLite, MySQL), game engines, Python libraries
- **Networking**: routers and firmware

Next steps: try an **Arduino** kit (sold in Nairobi electronics shops on Luthuli Avenue and online) to blink LEDs and read sensors, or read the classic book *The C Programming Language* by Kernighan and Ritchie.

```quiz
Q: Which keyword groups several variables into one type?
A: struct
Q: Which fopen mode adds to the end of a file without deleting it?
A: a | "a" | append
Q: Which function closes a file?
A: fclose | fclose()
Q: Name the popular microcontroller platform programmed in C/C++ (7 letters).
A: Arduino
```
""")

# ---------------- C++ ----------------
cp = track("cpp", "C++", "none",
           "C with classes and much more: used for games, high-performance apps, competitive programming and embedded systems.")

lesson(cp, "introduction", "C++ introduction", """
# C++ introduction

**C++** extends C with classes, a huge standard library and modern features. It's used in game engines (Unreal Engine), browsers (Chrome), trading systems, Arduino and competitive programming.

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    cout << "What is your name? ";
    cin >> name;
    cout << "Karibu, " << name << "!" << endl;
    return 0;
}
```

- `cout <<` prints, `cin >>` reads input.
- `string` is a real text type (easier than C's character arrays).

Compile with `g++ main.cpp -o main` and run `./main`.

## Vectors: lists that grow

```cpp
#include <vector>
#include <algorithm>

vector<int> prices = {450, 120, 999, 75};
prices.push_back(300);                 // add
sort(prices.begin(), prices.end());    // sort ascending
for (int p : prices) cout << p << " ";
cout << "\\nItems: " << prices.size() << endl;
```

## Maps

```cpp
#include <map>
map<string, int> stock;
stock["sugar"] = 40;
stock["unga"] = 25;
stock["sugar"] -= 5;
for (auto& [item, qty] : stock) cout << item << ": " << qty << endl;
```

""" + RUN_NOTE.format(where="**onlinegdb.com** (choose C++)") + """

```quiz
Q: Which object prints output in C++?
A: cout | std::cout
Q: Which container is a list that can grow?
A: vector | std::vector
Q: Which method adds an item to the end of a vector?
A: push_back | push_back()
Q: Which command compiles C++ code? (3 letters)
A: g++
```
""")

lesson(cp, "classes", "Classes and objects in C++", """
# Classes and objects in C++

```cpp
#include <iostream>
#include <string>
using namespace std;

class Product {
private:
    string name;
    double price;
public:
    Product(string n, double p) : name(n), price(p) {}

    double priceWithVat() const { return price * 1.16; }
    string getName() const { return name; }
};

int main() {
    Product p("Phone charger", 800);
    cout << p.getName() << ": KSh " << p.priceWithVat() << endl;
}
```

## Inheritance and virtual functions

```cpp
class Shape {
public:
    virtual double area() const = 0;   // pure virtual: every shape must define it
    virtual ~Shape() = default;
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
};
```

## Modern C++ memory safety

Use **smart pointers** instead of raw `new`/`delete`:

```cpp
#include <memory>
auto shape = make_unique<Circle>(2.0);   // freed automatically
cout << shape->area() << endl;
```

```quiz
Q: Which keyword lets a derived class change a base class method at run time?
A: virtual
Q: Which smart-pointer helper creates a unique_ptr?
A: make_unique | make_unique()
Q: In C++, which access keyword hides class members from outside code?
A: private
```
""")

lesson(cp, "competitive-programming", "C++ for competitive programming", """
# C++ for competitive programming

C++ is the most popular language in coding contests because it's fast and its **Standard Template Library (STL)** has ready-made data structures and algorithms.

## A typical contest template

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<long long> a(n);
    for (auto& x : a) cin >> x;

    long long best = *max_element(a.begin(), a.end());
    long long sum = accumulate(a.begin(), a.end(), 0LL);
    cout << best << " " << sum << "\\n";
}
```

## STL cheat sheet

| Need | Use |
|---|---|
| Dynamic array | `vector<int>` |
| Sorted unique values | `set<int>` |
| Key → value (sorted) | `map<string,int>` |
| Fast lookup (unsorted) | `unordered_map<string,int>` |
| Queue / stack | `queue<int>`, `stack<int>` |
| Always get the biggest | `priority_queue<int>` |
| Sort / binary search | `sort()`, `lower_bound()` |

## Practice sites

- **Codeforces**, **AtCoder**, **LeetCode**, **HackerRank**
- **Kattis** and ICPC regional contests for universities

Contests teach you algorithms quickly, and good ratings impress employers.

```quiz
Q: What does STL stand for?
A: Standard Template Library
Q: Which container always gives you the biggest item first? (two words joined by _)
A: priority_queue
Q: Which STL function sorts a vector?
A: sort | sort()
```
""")

# ---------------- C# ----------------
cs = track("csharp", "C#", "none",
           "Microsoft's language for Windows apps, websites with ASP.NET, business systems and Unity games.")

lesson(cs, "introduction", "C# introduction", """
# C# introduction

**C#** (say "C sharp") is Microsoft's modern language. It's used for business and desktop software, websites and APIs with **ASP.NET Core**, and games with **Unity** (one of the world's most popular game engines).

```csharp
Console.WriteLine("Habari, Kenya!");

string name = "Njeri";
int age = 24;
decimal balance = 1500.75m;      // decimal is best for money
bool isMember = true;

Console.WriteLine($"{name} is {age} years old and has KSh {balance:N2}");
```

Modern C# (with **top-level statements**) doesn't need a class around small programs.

## Set up

1. Install the free **.NET SDK** from dotnet.microsoft.com.
2. Create and run a project:

```
dotnet new console -o HelloApp
cd HelloApp
dotnet run
```

Editors: **Visual Studio Community** (free, Windows) or **VS Code** with the C# Dev Kit.

## Conditions and loops

```csharp
int marks = 72;
string grade = marks >= 70 ? "A" : marks >= 50 ? "C" : "E";

for (int i = 1; i <= 3; i++) Console.WriteLine($"Round {i}");

var towns = new List<string> { "Nyeri", "Meru", "Embu" };
foreach (var t in towns) Console.WriteLine(t.ToUpper());
```

""" + RUN_NOTE.format(where="**dotnetfiddle.net**") + """

```quiz
Q: Which type is best for money values in C#?
A: decimal
Q: Which command runs a .NET project?
A: dotnet run
Q: Which popular game engine uses C#?
A: Unity
Q: What symbol before a string lets you insert variables in { }?
A: $ | dollar
```
""")

lesson(cs, "classes-linq", "Classes and LINQ", """
# Classes and LINQ

## Classes and properties

```csharp
public class Product
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public int Stock { get; set; }

    public bool InStock => Stock > 0;
}

var items = new List<Product>
{
    new() { Name = "Unga 2kg", Price = 180, Stock = 12 },
    new() { Name = "Sugar 1kg", Price = 150, Stock = 0 },
    new() { Name = "Milk 500ml", Price = 60, Stock = 40 },
};
```

## LINQ: query lists like a database

```csharp
var available = items
    .Where(p => p.InStock)
    .OrderBy(p => p.Price)
    .Select(p => $"{p.Name}: KSh {p.Price}");

foreach (var line in available) Console.WriteLine(line);

decimal stockValue = items.Sum(p => p.Price * p.Stock);
Console.WriteLine($"Stock value: KSh {stockValue:N0}");
```

## Records (quick data types)

```csharp
public record Payment(string Phone, decimal Amount, string Receipt);
var p = new Payment("0712345678", 500m, "SGH7XK2L9P");
Console.WriteLine(p);
```

```quiz
Q: Which LINQ method filters items?
A: Where | Where()
Q: Which LINQ method sorts from smallest to largest?
A: OrderBy | OrderBy()
Q: Which keyword quickly declares an immutable data type with a short syntax?
A: record
```
""")

lesson(cs, "aspnet-next-steps", "ASP.NET Core and next steps", """
# ASP.NET Core and next steps

**ASP.NET Core** builds fast websites and APIs that run on Windows, Linux and the cloud.

A minimal API in one file:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var products = new List<string> { "Laptop bag", "Mouse", "Charger" };

app.MapGet("/", () => "Karibu to our shop API");
app.MapGet("/products", () => products);
app.MapPost("/products", (string name) => { products.Add(name); return Results.Created($"/products", name); });

app.Run();
```

Create one with `dotnet new web -o ShopApi`, then `dotnet run`.

## The .NET world

| Area | Technology |
|---|---|
| Web apps | ASP.NET Core MVC, Razor Pages, Blazor |
| Databases | Entity Framework Core with SQL Server, MySQL or PostgreSQL |
| Desktop | WPF, WinForms, .NET MAUI |
| Mobile | .NET MAUI |
| Games | Unity |
| Cloud | Microsoft Azure |

Free learning: **learn.microsoft.com/dotnet** (official tutorials and free certifications prep) and Unity Learn (**learn.unity.com**) for games.

```quiz
Q: Which framework builds websites and APIs in C#? (two words)
A: ASP.NET Core | asp.net
Q: Which library talks to databases in .NET? (two words, then Core)
A: Entity Framework Core | Entity Framework | EF Core
Q: Which command creates a new empty web project? (dotnet new …)
A: dotnet new web
```
""")

# ---------------- Dart & Flutter ----------------
df = track("dart-flutter", "Dart & Flutter (mobile apps)", "none",
           "Build Android and iPhone apps from one codebase with Google's Flutter framework and the Dart language.")

lesson(df, "dart-basics", "Dart basics", """
# Dart basics

**Flutter** is Google's toolkit for building apps for Android, iPhone, web and desktop from **one codebase**. Apps are written in **Dart**, a friendly language that looks like a mix of JavaScript and Java.

```dart
void main() {
  String name = 'Mwangi';
  int age = 23;
  double balance = 1200.50;
  bool active = true;
  var town = 'Nyeri';          // type inferred
  final joined = 2024;         // can't be changed after set

  print('$name from $town is $age');
  print('Balance: KSh ${balance.toStringAsFixed(2)}');
}
```

## Null safety

Dart won't let a variable be `null` unless you allow it with `?`:

```dart
String? email;           // may be null
print(email ?? 'No email');   // ?? gives a default
```

## Lists, maps and functions

```dart
var prices = [120, 450, 80];
prices.add(300);
var total = prices.reduce((a, b) => a + b);

var stock = {'sugar': 40, 'unga': 25};
stock['sugar'] = stock['sugar']! - 5;

int vat(int amount) => (amount * 0.16).round();
print(vat(1000));   // 160
```

""" + RUN_NOTE.format(where="**dartpad.dev** (it runs Flutter apps too)") + """

```quiz
Q: Which language are Flutter apps written in?
A: Dart
Q: Which symbol after a type allows a variable to be null?
A: ? | question mark
Q: Which operator gives a default value when something is null?
A: ?? | double question mark
Q: Which keyword makes a variable that can only be set once?
A: final | const
```
""")

lesson(df, "flutter-widgets", "Flutter widgets and layouts", """
# Flutter widgets and layouts

In Flutter, **everything is a widget**: text, buttons, padding, rows, whole screens.

```dart
import 'package:flutter/material.dart';

void main() => runApp(const ShopApp());

class ShopApp extends StatelessWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Duka',
      theme: ThemeData(colorSchemeSeed: Colors.amber),
      home: Scaffold(
        appBar: AppBar(title: const Text('Duka Online')),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: const [
            ListTile(leading: Icon(Icons.shopping_bag), title: Text('Unga 2kg'), trailing: Text('KSh 180')),
            ListTile(leading: Icon(Icons.local_drink), title: Text('Milk 500ml'), trailing: Text('KSh 60')),
          ],
        ),
      ),
    );
  }
}
```

## Common layout widgets

| Widget | Does |
|---|---|
| `Column` / `Row` | Stack children vertically / horizontally |
| `Padding`, `SizedBox` | Space around / between things |
| `Container` | Box with colour, border, size |
| `ListView` | Scrolling list |
| `Expanded` | Take the remaining space |
| `Stack` | Place widgets on top of each other |

## Stateful widgets

When something changes (a counter, a form), use a `StatefulWidget` and call `setState()`:

```dart
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int items = 0;
  @override
  Widget build(BuildContext context) => ElevatedButton(
        onPressed: () => setState(() => items++),
        child: Text('Items in cart: $items'),
      );
}
```

```quiz
Q: In Flutter, everything on screen is a…
A: widget | a widget
Q: Which widget stacks children vertically?
A: Column
Q: Which method tells Flutter to redraw after data changes?
A: setState | setState()
```
""")

lesson(df, "publish-app", "Building and publishing your app", """
# Building and publishing your app

## Set up

1. Install **Flutter** from docs.flutter.dev (it includes Dart).
2. Install **Android Studio** (for the Android SDK and emulator) or use a real phone with USB debugging on.
3. Run `flutter doctor` to check everything.

```
flutter create duka
cd duka
flutter run            # runs on your connected phone or emulator
```

Hot reload (press `r`) updates the app in about a second without losing its state.

## Useful packages (pub.dev)

| Need | Package |
|---|---|
| Call an API | `http` or `dio` |
| Save small data on the phone | `shared_preferences` |
| Local database | `sqflite` or `drift` |
| Login, database, push notifications | `firebase_core`, `firebase_auth`, `cloud_firestore` |
| State management | `provider` or `riverpod` |

M-Pesa payments are usually done through **your own server**: the app asks your server to send an STK push, so your Daraja keys never sit inside the app.

## Publishing

- **Google Play**: a one-time USD 25 developer registration fee. Build with `flutter build appbundle` and upload the `.aab` file in Play Console.
- **Apple App Store**: USD 99 per year and a Mac to build.

```quiz
Q: Which command checks that your Flutter setup is working?
A: flutter doctor
Q: Which Flutter feature updates the running app in about a second? (two words)
A: hot reload
Q: Which file type do you upload to Google Play? (3 letters, .___)
A: aab | .aab
Q: Should Daraja (M-Pesa) secret keys be put inside the app? (yes or no)
A: no
```
""")

# ---------------- Go ----------------
go = track("go", "Go (Golang)", "none",
           "A simple, fast language from Google for web servers, APIs, cloud tools and DevOps (Docker and Kubernetes are written in Go).")

lesson(go, "introduction", "Go introduction", """
# Go introduction

**Go** (Golang) was made at Google for simple, fast, reliable software. Docker, Kubernetes and many cloud and fintech back ends are written in Go.

```go
package main

import "fmt"

func main() {
    name := "Achieng"          // := declares and infers the type
    var age int = 25
    balance := 1200.50

    fmt.Println("Habari,", name)
    fmt.Printf("%s is %d and has KSh %.2f\\n", name, age, balance)
}
```

Run with `go run main.go`, or build a single program file with `go build`.

## Only one loop: for

```go
for i := 1; i <= 3; i++ {
    fmt.Println(i)
}

towns := []string{"Nairobi", "Kisumu", "Mombasa"}
for index, town := range towns {
    fmt.Println(index, town)
}
```

## Functions can return several values

Go handles errors by returning them, not with exceptions:

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

result, err := divide(10, 0)
if err != nil {
    fmt.Println("Error:", err)
}
```

""" + RUN_NOTE.format(where="**go.dev/play**") + """

```quiz
Q: Which operator declares a variable and infers its type in Go?
A: := | colon equals
Q: How many kinds of loop keyword does Go have?
A: one | 1 | for
Q: What does a Go function return when there's no error?
A: nil
Q: Name one famous tool written in Go.
A: Docker | Kubernetes
```
""")

lesson(go, "structs-web", "Structs and a web server", """
# Structs and a web server

## Structs and methods

```go
type Order struct {
    ID     int
    Item   string
    Amount float64
    Paid   bool
}

func (o Order) Summary() string {
    status := "unpaid"
    if o.Paid {
        status = "paid"
    }
    return fmt.Sprintf("#%d %s KSh %.0f (%s)", o.ID, o.Item, o.Amount, status)
}
```

## A JSON API with only the standard library

```go
package main

import (
    "encoding/json"
    "net/http"
)

type Product struct {
    Name  string  `json:"name"`
    Price float64 `json:"price"`
}

func main() {
    http.HandleFunc("/products", func(w http.ResponseWriter, r *http.Request) {
        products := []Product{{"Charger", 800}, {"Earphones", 650}}
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(products)
    })
    http.ListenAndServe(":8080", nil)
}
```

Open `http://localhost:8080/products` to see the JSON.

## Goroutines: doing things at the same time

```go
go sendSMS("0712345678")     // runs in the background
```

Goroutines and **channels** make it easy to handle thousands of requests at once, which is why Go is popular for payment and messaging systems.

```quiz
Q: Which package in the standard library builds web servers? (net/…)
A: net/http | http
Q: Which keyword starts a function running in the background?
A: go
Q: What are goroutines used to communicate through?
A: channels | channel
```
""")
