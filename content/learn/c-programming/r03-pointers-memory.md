---
slug: pointers-memory
title: "Pointers and memory in C: addresses, dereferencing, pointers and functions, arrays, pointer arithmetic, malloc/free and common bugs"
after: KEEP
---
# Pointers and memory in C: addresses, dereferencing, pointers and functions, arrays, pointer arithmetic, malloc/free and common bugs

**Pointers** are what make C both powerful and famous for being tricky. A pointer is a variable that stores a **memory address**: the location of another value. Pointers let functions change variables passed to them, let you work efficiently with arrays and strings, build dynamic data structures (linked lists, trees), allocate memory at runtime, and talk directly to hardware registers on microcontrollers. Understanding them explains how every computer manages memory, and it's what separates people who "know some C" from people who really understand it.

:::note What you will learn
- How memory works: bytes, addresses, the stack and the heap
- The address-of operator `&` and printing addresses
- Declaring pointers and dereferencing with `*`
- Pointers and functions: changing the caller's variables (swap)
- Returning several results through pointers
- Arrays and pointers: the array name, indexing and pointer arithmetic
- Strings as char arrays and char pointers
- Dynamic memory: malloc, calloc, realloc, free
- NULL pointers and checking allocations
- Common bugs: uninitialised and dangling pointers, leaks, buffer overflows
- Tools: compiler warnings, Valgrind and AddressSanitizer
:::

## How memory works

Memory is a long row of numbered **bytes**. Each byte has an **address** (shown in hexadecimal like `0x7ffd5e8c`). A variable occupies one or more bytes: an `int` usually 4, a `double` 8, a `char` 1.

| Region | Holds | Managed by |
|---|---|---|
| **Stack** | Local variables and function call information | Automatically: freed when the function returns |
| **Heap** | Memory you request at runtime with malloc | You: must be freed with free |
| **Static/global area** | Global and static variables | Whole program lifetime |
| **Code** | The program's instructions | Read-only |

## Addresses with &

```c
#include <stdio.h>

int main(void) {
    int students = 45;
    double fee = 12500.0;
    printf("students = %d, stored at address %p\n", students, (void *)&students);
    printf("fee = %.1f, stored at address %p\n", fee, (void *)&fee);
    printf("An int uses %d bytes, a double uses %d bytes\n", (int)sizeof(students), (int)sizeof(fee));
    return 0;
}
```

Run this with GCC on your computer: `&students` means "the address of students", and `%p` prints it in hexadecimal. Addresses change from run to run, so your output will differ.

## Declaring and dereferencing pointers

```try-c
#include <stdio.h>

int main(void) {
    int balance = 1000;
    int *p = &balance;            /* p is a pointer to int, holding balance's address */

    printf("balance = %d\n", balance);
    printf("p points to the value %d\n", *p);   /* *p = the value at the address (dereference) */

    *p = 1500;                    /* change balance THROUGH the pointer */
    printf("balance is now %d\n", balance);

    *p = *p + 250;
    printf("after deposit: %d\n", balance);
    return 0;
}
```

| Expression | Meaning |
|---|---|
| `int *p;` | Declare p as a pointer to an int |
| `p = &x;` | Store x's address in p |
| `*p` | The value at the address p holds (dereference) |
| `*p = 5;` | Write 5 to that location |
| `p` | The address itself |

The `*` has two jobs: in a **declaration** it means "pointer to"; in an **expression** it means "the value at".

## Pointers and functions

C passes arguments **by value** (copies). To let a function change the caller's variables, pass their **addresses**:

```try-c
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void apply_payment(double *balance, double amount) {
    if (amount > 0) {
        *balance = *balance - amount;
    }
}

int main(void) {
    int x = 3, y = 8;
    swap(&x, &y);
    printf("x = %d, y = %d\n", x, y);

    double fees = 25000.0;
    apply_payment(&fees, 7500.0);
    printf("Fee balance: %.2f\n", fees);
    return 0;
}
```

This is why `scanf("%d", &age)` needs `&`: scanf must write into your variable.

### Returning several results

```try-c
#include <stdio.h>

void stats(int marks[], int n, int *min, int *max, double *avg) {
    int i, total = 0;
    *min = marks[0];
    *max = marks[0];
    for (i = 0; i < n; i++) {
        if (marks[i] < *min) *min = marks[i];
        if (marks[i] > *max) *max = marks[i];
        total += marks[i];
    }
    *avg = (double)total / n;
}

int main(void) {
    int marks[5] = {67, 82, 45, 90, 58};
    int lo, hi;
    double average;
    stats(marks, 5, &lo, &hi, &average);
    printf("Lowest %d, highest %d, average %.1f\n", lo, hi, average);
    return 0;
}
```

## Arrays and pointers

An array's name acts like a pointer to its first element. `marks[i]` is the same as `*(marks + i)`:

```try-c
#include <stdio.h>

int main(void) {
    int marks[4] = {67, 82, 45, 90};
    int *p = marks;              /* same as &marks[0] */
    int i;

    for (i = 0; i < 4; i++) {
        printf("marks[%d] = %d, *(p + %d) = %d\n", i, marks[i], i, *(p + i));
    }

    p = p + 2;                   /* pointer arithmetic: moves by 2 ints, not 2 bytes */
    printf("After p + 2, *p = %d\n", *p);
    return 0;
}
```

Pointer arithmetic moves by the **size of the type**: adding 1 to an `int *` moves 4 bytes (on typical systems).

When you pass an array to a function, C passes a pointer to its first element, so the function **can change** the original array, and it **doesn't know the length**: always pass the size too (as `stats` above did).

## Strings and pointers

A C string is an array of `char` ending with the **null character** `'\0'`:

```try-c
#include <stdio.h>
#include <string.h>

int count_vowels(char *s) {
    int count = 0;
    while (*s != '\0') {                     /* walk the string with a pointer */
        char c = *s;
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;
        s++;
    }
    return count;
}

int main(void) {
    char town[20] = "Nakuru";               /* array: 7 bytes used including '\0' */
    printf("%s has %d letters and %d vowels\n", town, (int)strlen(town), count_vowels(town));
    town[0] = 'M';                          /* arrays can be modified */
    printf("Changed: %s\n", town);
    return 0;
}
```

The arrays and strings lesson covers `strcpy`, `strcat`, `strcmp` and safe string handling.

## Dynamic memory: malloc and free

When you don't know how much memory you need until the program runs (e.g. the number of students entered), allocate it on the **heap**:

```try-c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5, i;
    int *marks = malloc(n * sizeof(int));     /* request space for 5 ints */
    if (marks == NULL) {                      /* always check */
        printf("Out of memory\n");
        return 1;
    }
    for (i = 0; i < n; i++) {
        marks[i] = 50 + i * 10;
    }

    n = 8;                                    /* need more space: grow the block */
    int *bigger = realloc(marks, n * sizeof(int));
    if (bigger == NULL) {
        free(marks);
        return 1;
    }
    marks = bigger;
    for (i = 5; i < n; i++) {
        marks[i] = 0;
    }

    for (i = 0; i < n; i++) {
        printf("%d ", marks[i]);
    }
    printf("\n");

    free(marks);                              /* give the memory back */
    marks = NULL;                             /* avoid a dangling pointer */
    return 0;
}
```

| Function | Purpose |
|---|---|
| `malloc(bytes)` | Allocate uninitialised memory; returns a pointer or NULL |
| `calloc(count, size)` | Allocate and set to zero |
| `realloc(ptr, bytes)` | Resize an allocation (may move it) |
| `free(ptr)` | Release memory |

Every `malloc`/`calloc` must eventually be matched by exactly one `free`.

## NULL pointers

`NULL` means "points to nothing". Initialise pointers to NULL if they don't point anywhere yet, and check before dereferencing:

```c
int *p = NULL;
if (p != NULL) {
    printf("%d\n", *p);
}
```

Dereferencing NULL crashes the program (a "segmentation fault").

## Common pointer bugs

| Bug | Example | Result | Prevention |
|---|---|---|---|
| **Uninitialised pointer** | `int *p; *p = 5;` | Writes to a random address: crash or corruption | Initialise to NULL or a valid address |
| **NULL dereference** | `*p` when p is NULL | Segmentation fault | Check for NULL |
| **Dangling pointer** | Using memory after `free`, or returning the address of a local variable | Unpredictable behaviour | Set to NULL after free; never return addresses of locals |
| **Memory leak** | Forgetting to free | Program uses more and more memory | Free everything you allocate |
| **Double free** | `free(p); free(p);` | Crash or corruption | Set to NULL after free |
| **Buffer overflow** | Writing past the end of an array | Corrupts memory; major security hole | Check bounds; use sizes; safe functions (`snprintf`, `fgets`) |

Buffer overflows in C code have caused many famous security vulnerabilities, which is why careful bounds checking matters.

## Tools that catch memory bugs

```bash
gcc -Wall -Wextra -g program.c -o program                 # warnings and debug info
gcc -fsanitize=address -g program.c -o program && ./program   # AddressSanitizer: reports overflows and use-after-free
valgrind --leak-check=full ./program                       # Valgrind (Linux): finds leaks and invalid accesses
```

Use a debugger (`gdb`, or the debugger in VS Code/Code::Blocks) to step through code and inspect pointers.

:::think What's wrong with this function, and how would you fix it? `int *make_counter(void) { int count = 0; return &count; }`
`count` is a local variable on the stack; it's destroyed when the function returns, so the returned pointer is dangling. Fix: allocate on the heap (`int *c = malloc(sizeof(int)); if (c) *c = 0; return c;` and free it later), or use a static variable, or have the caller provide the storage.
:::

## Summary

- Memory is numbered bytes; local variables live on the stack, malloc'd memory on the heap.
- `&x` gives an address; `int *p = &x;` stores it; `*p` reads or writes the value there.
- Pass pointers to let functions change caller variables or return several results.
- Array names act as pointers to the first element; `a[i]` equals `*(a + i)`; pass array sizes to functions; strings end with `'\0'`.
- Use malloc/calloc/realloc and free carefully: check for NULL, free exactly once, avoid dangling pointers, leaks and overflows; use sanitizers and Valgrind.

```quiz
Q: Which operator gives the address of a variable?
A: & | ampersand
Q: Which operator gets the value a pointer points to?
A: * | asterisk | dereference
Q: Which function allocates memory on the heap?
A: malloc
Q: Which function releases memory allocated with malloc?
A: free
Q: Which character ends every C string? (write it as in code)
A: '\0' | \0 | null character | null
Q: What do you call a pointer that points to memory that has been freed? (one word)
A: dangling
```
