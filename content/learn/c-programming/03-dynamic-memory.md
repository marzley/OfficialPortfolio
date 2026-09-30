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
```
