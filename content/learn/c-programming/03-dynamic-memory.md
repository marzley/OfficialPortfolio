---
slug: dynamic-memory
title: Dynamic memory: malloc, realloc and free
after: pointers-memory
---
# Dynamic memory: malloc, realloc and free

Normal arrays have a fixed size decided when you write the program. But how many customers will register today? How long is the file you'll read? **Dynamic memory** lets a program ask for exactly as much memory as it needs **while it runs**, and give it back when done.

## Stack vs heap

| | Stack | Heap |
|---|---|---|
| What goes there | Local variables, function calls | Memory you request with `malloc` |
| Size | Small, fixed | Large, flexible |
| Freed | Automatically when the function returns | **By you**, with `free` |
| Speed | Very fast | A little slower |

## malloc: request memory

```try-c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *marks = malloc(n * sizeof(int));     /* room for 5 ints */
    if (marks == NULL) {                      /* always check: memory can run out */
        printf("Out of memory\n");
        return 1;
    }
    for (int i = 0; i < n; i++) {
        marks[i] = 50 + i * 10;               /* use it like an array */
    }
    for (int i = 0; i < n; i++) {
        printf("%d ", marks[i]);
    }
    printf("\n");
    free(marks);                              /* give it back */
    marks = NULL;                             /* avoid using it by accident */
    return 0;
}
```

- `malloc(bytes)` returns a pointer to a new block, or `NULL` if it fails.
- `sizeof(int)` makes the size correct on any computer.
- The memory is **uninitialised** (random values) until you set it. `calloc(n, sizeof(int))` gives zeroed memory.

## realloc: grow (or shrink) a block

```try-c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 2, count = 0;
    int *amounts = malloc(capacity * sizeof(int));
    int incoming[7] = {500, 1200, 300, 800, 2500, 150, 900};

    for (int i = 0; i < 7; i++) {
        if (count == capacity) {                        /* full: double the size */
            capacity *= 2;
            int *bigger = realloc(amounts, capacity * sizeof(int));
            if (bigger == NULL) { free(amounts); return 1; }
            amounts = bigger;
            printf("(grew to %d)\n", capacity);
        }
        amounts[count] = incoming[i];
        count++;
    }

    int total = 0;
    for (int i = 0; i < count; i++) total += amounts[i];
    printf("%d payments, total KSh %d\n", count, total);
    free(amounts);
    return 0;
}
```

This "double when full" trick is exactly how Python lists, Java `ArrayList` and C++ `vector` grow behind the scenes.

> Assign `realloc`'s result to a **new** pointer first. If it fails it returns `NULL`, and writing that over your only pointer would lose (leak) the original memory.

## Structs on the heap

```try-c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Account {
    char name[40];
    double balance;
};

struct Account *openAccount(char *name, double deposit) {
    struct Account *a = malloc(sizeof(struct Account));
    if (a == NULL) return NULL;
    strncpy(a->name, name, sizeof(a->name) - 1);
    a->name[sizeof(a->name) - 1] = '\0';
    a->balance = deposit;
    return a;                 /* the memory lives on after the function returns */
}

int main(void) {
    struct Account *acc = openAccount("Wanjiku", 5000);
    acc->balance -= 1200;     /* -> accesses a field through a pointer */
    printf("%s: KSh %.2f\n", acc->name, acc->balance);
    free(acc);
    return 0;
}
```

`acc->balance` is shorthand for `(*acc).balance`.

## The four classic memory bugs

| Bug | What happens | Prevent it |
|---|---|---|
| **Memory leak** | Forgetting `free`: memory use grows until the program or server slows or crashes | Every `malloc` needs one `free` |
| **Dangling pointer** | Using memory after `free` | Set the pointer to `NULL` after freeing |
| **Double free** | Calling `free` twice on the same block | Same: `NULL` after free (`free(NULL)` is safe) |
| **Buffer overflow** | Writing past the end of a block | Track sizes; use `strncpy`, `snprintf` |

Tools like **Valgrind** (`valgrind ./program`) and gcc's `-fsanitize=address` find these bugs automatically.

## Why this matters beyond C

Languages like Python, Java, JavaScript and Go have a **garbage collector** that frees memory for you. Knowing what happens underneath helps you write faster code in any language, and explains why many security holes (and whole "memory-safe language" debates, like Rust) exist.

## Why dynamic memory matters

Fixed-size arrays only work when you know the size in advance. Real programs often don't: how many customers will register today, how long a file is, how many sensor readings arrive. Dynamic memory lets programs request exactly what they need at runtime. It's used in operating systems, databases, games and embedded firmware, and understanding it explains how higher-level languages (Python lists, Java objects) manage memory behind the scenes, and why memory leaks and crashes happen.

## A growing list (like Python's list or Java's ArrayList)

```try-c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 2;
    int count = 0;
    int *amounts = malloc(capacity * sizeof(int));
    if (amounts == NULL) { printf("Out of memory\n"); return 1; }

    int incoming[7];
    incoming[0] = 500; incoming[1] = 1200; incoming[2] = 350; incoming[3] = 2500;
    incoming[4] = 800; incoming[5] = 150; incoming[6] = 4100;

    for (int i = 0; i < 7; i++) {
        if (count == capacity) {
            capacity = capacity * 2;                      /* double the space */
            int *bigger = realloc(amounts, capacity * sizeof(int));
            if (bigger == NULL) { free(amounts); printf("Out of memory\n"); return 1; }
            amounts = bigger;
            printf("Grew to capacity %d\n", capacity);
        }
        amounts[count] = incoming[i];
        count++;
    }

    int total = 0;
    for (int i = 0; i < count; i++) total += amounts[i];
    printf("%d payments, total KSh %d\n", count, total);
    free(amounts);
    amounts = NULL;
    return 0;
}
```

Doubling the capacity each time keeps the number of `realloc` calls small; this is how dynamic arrays in many languages work internally. Note the pattern of assigning `realloc`'s result to a temporary pointer first: if it fails, the original block is still valid and can be freed.

## calloc: zeroed memory

```try-c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int days = 7;
    int *sales = calloc(days, sizeof(int));     /* all values start at 0 */
    if (sales == NULL) return 1;
    sales[2] = 1500;
    sales[5] = 900;
    for (int d = 0; d < days; d++) printf("Day %d: %d\n", d + 1, sales[d]);
    free(sales);
    return 0;
}
```

`malloc` leaves memory with unpredictable contents; `calloc` sets it all to zero.

## A dynamic array of structs

```try-c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Student {
    char name[30];
    int mark;
};

void set_student(struct Student *s, char name[], int mark) {
    strcpy(s->name, name);
    s->mark = mark;
}

int main(void) {
    int n = 3;
    struct Student *list = malloc(n * sizeof(struct Student));
    if (list == NULL) return 1;

    set_student(&list[0], "Amina", 78);
    set_student(&list[1], "Brian", 91);
    set_student(&list[2], "Chebet", 64);

    int best = 0;
    for (int i = 1; i < n; i++) {
        if (list[i].mark > list[best].mark) best = i;
    }
    for (int i = 0; i < n; i++) printf("%-8s %d\n", list[i].name, list[i].mark);
    printf("Top student: %s\n", list[best].name);

    free(list);
    return 0;
}
```

`s->name` is shorthand for `(*s).name`: access a field through a pointer.

## Reading a line of unknown length (concept)

```c
char *read_line(FILE *in) {
    int cap = 16, len = 0, c;
    char *buf = malloc(cap);
    if (!buf) return NULL;
    while ((c = fgetc(in)) != EOF && c != '\n') {
        if (len + 1 >= cap) {
            cap *= 2;
            char *tmp = realloc(buf, cap);
            if (!tmp) { free(buf); return NULL; }
            buf = tmp;
        }
        buf[len++] = (char) c;
    }
    buf[len] = '\0';
    return buf;          /* the caller must free() it */
}
```

Functions that return allocated memory must clearly document that the caller is responsible for freeing it.

## Ownership rules that prevent bugs

1. **Every `malloc`/`calloc`/`realloc` has exactly one matching `free`.**
2. Decide which function **owns** each block (who frees it); document it.
3. Set pointers to `NULL` after freeing to avoid accidental reuse.
4. Never free memory you didn't allocate (stack variables, string literals).
5. Check every allocation for `NULL`.
6. Free in reverse order of allocation for nested structures (free inner parts before the outer struct).

## Finding memory bugs with tools

| Tool | Finds |
|---|---|
| Valgrind (`valgrind --leak-check=full ./app`) | Leaks, invalid reads/writes, use of uninitialised memory |
| AddressSanitizer (`gcc -fsanitize=address -g`) | Out-of-bounds access, use-after-free, double free |
| Compiler warnings (`-Wall -Wextra`) | Many simple mistakes |

Run tests under these tools regularly; memory bugs often don't crash immediately, which makes them hard to find later.

## Memory in embedded systems

Many microcontrollers have only a few kilobytes of RAM. Embedded developers often **avoid dynamic allocation** entirely after start-up (to prevent fragmentation and unpredictable failures), using fixed-size buffers and static pools instead. Safety-critical coding standards (such as MISRA C in the automotive industry) restrict dynamic memory use.

## Practice

1. Build a dynamic array that reads numbers until -1 and prints their average (on your own computer with scanf).
2. Allocate an array of 5 `struct Product` (name, price), fill it, and print the cheapest product.
3. Write a function `char *repeat(char *s, int times)` that returns a new allocated string, and free it in `main`.
4. Run a program with a deliberate leak under Valgrind or AddressSanitizer and read the report.
5. Explain in your own words why `realloc` should be assigned to a temporary pointer.

:::think A program calls `p = realloc(p, new_size);` and realloc fails. What goes wrong, and how should it be written?
On failure realloc returns NULL but doesn't free the original block. Assigning directly to `p` overwrites the only pointer to that block with NULL, so the memory leaks and the data is lost. Write `tmp = realloc(p, new_size); if (tmp == NULL) { /* handle error, p still valid */ } else { p = tmp; }`.
:::

```quiz
Q: Which function requests memory from the heap?
A: malloc | malloc()
Q: Which function gives memory back?
A: free | free()
Q: What does malloc return if it fails?
A: NULL
Q: Which function changes the size of an existing block?
A: realloc | realloc()
Q: What is it called when a program forgets to free memory? (two words)
A: memory leak | leak
Q: Which function allocates memory and sets it to zero?
A: calloc
Q: Which operator accesses a struct field through a pointer?
A: -> | arrow
Q: Which tool reports memory leaks when running a program? (name one)
A: Valgrind | AddressSanitizer
Q: What should you set a pointer to after freeing it?
A: NULL
```
