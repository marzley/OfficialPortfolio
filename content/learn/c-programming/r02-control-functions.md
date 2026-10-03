---
slug: control-functions
title: "Conditions, loops and functions in C: if/else, switch, for, while, do-while, writing functions, scope and header files"
after: KEEP
---
# Conditions, loops and functions in C: if/else, switch, for, while, do-while, writing functions, scope and header files

Control flow lets programs make decisions and repeat work; **functions** let you organise code into reusable, testable pieces. In C, these are the tools you'll use in every program: from calculating fees and grades to reading sensors on a microcontroller every second. This unit covers conditions, switch, all loop types, writing and calling functions, parameters and return values, scope, recursion basics, and splitting programs into multiple files with headers.

:::note What you will learn
- Relational and logical operators; truth in C (0 and non-zero)
- if, else if, else and the conditional operator
- switch with break and default
- for, while and do-while loops; break and continue; nested loops
- Writing functions: declaration (prototype), definition, call
- Parameters, return values and void functions
- Pass by value
- Local, global and static variables
- Recursion in C
- Organising code with header files
:::

## Truth in C

C traditionally has no boolean type: **0 means false, any non-zero value means true**. Comparisons return 1 (true) or 0 (false). `<stdbool.h>` (C99) adds `bool`, `true` and `false`.

| Operator | Meaning |
|---|---|
| `==`, `!=` | Equal, not equal |
| `<`, `>`, `<=`, `>=` | Comparisons |
| `&&`, `\|\|`, `!` | AND, OR, NOT |

:::warning = vs ==
`if (x = 5)` **assigns** 5 to x and is always true. Use `==` to compare. Compiler warnings (`-Wall`) help catch this.
:::

## if, else if, else

```try-c
#include <stdio.h>

int main(void) {
    int mark = 72;
    char grade;

    if (mark >= 80) {
        grade = 'A';
    } else if (mark >= 65) {
        grade = 'B';
    } else if (mark >= 50) {
        grade = 'C';
    } else if (mark >= 40) {
        grade = 'D';
    } else {
        grade = 'E';
    }
    printf("Mark %d -> grade %c\n", mark, grade);

    double balance = 0.0;
    int boarding = 1;
    if (balance <= 0.0 && boarding) {
        printf("Cleared to report\n");
    }

    int stock = 3;
    printf("%s\n", stock < 5 ? "Reorder soon" : "Stock OK");   /* conditional operator */
    return 0;
}
```

## switch

```try-c
#include <stdio.h>

int main(void) {
    int choice = 2;
    switch (choice) {
        case 1:
            printf("Check balance\n");
            break;
        case 2:
            printf("Send money\n");
            break;
        case 3:
        case 4:
            printf("Buy airtime or bundles\n");   /* 3 and 4 share code */
            break;
        default:
            printf("Invalid option\n");
    }
    return 0;
}
```

`switch` works with integer and `char` values. Without `break`, execution "falls through" into the next case.

## Loops

```try-c
#include <stdio.h>

int main(void) {
    int i;

    /* for: known number of repetitions */
    for (i = 1; i <= 5; i++) {
        printf("7 x %d = %d\n", i, 7 * i);
    }

    /* while: repeat while a condition is true */
    double balance = 0.0;
    int months = 0;
    while (balance < 50000.0) {
        balance = balance * 1.01 + 4500.0;
        months++;
    }
    printf("Months to save 50,000: %d\n", months);

    /* do-while: runs at least once */
    int tries = 0;
    do {
        tries++;
    } while (tries < 3);
    printf("Tries: %d\n", tries);
    return 0;
}
```

### break, continue and nested loops

```try-c
#include <stdio.h>

int main(void) {
    int readings[6] = {4, 7, -1, 12, 0, 9};
    int i, row, col;

    for (i = 0; i < 6; i++) {
        if (readings[i] < 0) continue;   /* skip invalid */
        if (readings[i] == 0) break;     /* stop at zero */
        printf("Reading: %d\n", readings[i]);
    }

    for (row = 1; row <= 3; row++) {     /* a small multiplication table */
        for (col = 1; col <= 4; col++) {
            printf("%4d", row * col);
        }
        printf("\n");
    }
    return 0;
}
```

## Functions

A function is a named block of code that does one job. Functions make programs shorter, clearer and easier to test.

```try-c
#include <stdio.h>

/* Prototypes (declarations): tell the compiler the function's name, return type and parameters */
double vat(double amount);
char grade_for(int mark);
void print_receipt(char *item, int qty, double price);

int main(void) {
    printf("VAT on 1000: %.2f\n", vat(1000.0));
    printf("Grade for 67: %c\n", grade_for(67));
    print_receipt("Phone charger", 2, 800.0);
    return 0;
}

/* Definitions */
double vat(double amount) {
    return amount * 0.16;
}

char grade_for(int mark) {
    if (mark >= 80) return 'A';
    if (mark >= 65) return 'B';
    if (mark >= 50) return 'C';
    if (mark >= 40) return 'D';
    return 'E';
}

void print_receipt(char *item, int qty, double price) {
    double total = qty * price;
    printf("%-15s x%d  KSh %.2f\n", item, qty, total);
    printf("VAT included: KSh %.2f\n", total - total / 1.16);
}
```

| Part | Example |
|---|---|
| Return type | `double`, `char`, `int`, or `void` (returns nothing) |
| Name | `vat` |
| Parameters | `(double amount)` |
| Body | `{ return amount * 0.16; }` |

Declare a **prototype** before `main` (or define the function before it's used), so the compiler knows how to call it.

## Pass by value

C passes **copies** of arguments to functions. Changing a parameter doesn't change the caller's variable:

```try-c
#include <stdio.h>

void try_to_double(int x) {
    x = x * 2;
    printf("Inside function: %d\n", x);
}

int main(void) {
    int n = 10;
    try_to_double(n);
    printf("After call: %d\n", n);   /* still 10 */
    return 0;
}
```

To let a function change the caller's variable, pass its **address** with a pointer (see the pointers lesson).

## Scope and storage

```try-c
#include <stdio.h>

int total_visits = 0;            /* global: visible to all functions (use sparingly) */

void record_visit(void) {
    static int calls = 0;        /* static local: keeps its value between calls */
    int temp = 5;                /* local: created fresh on every call */
    calls++;
    total_visits++;
    printf("Call %d (temp %d)\n", calls, temp);
}

int main(void) {
    record_visit();
    record_visit();
    record_visit();
    printf("Total visits: %d\n", total_visits);
    return 0;
}
```

| Variable | Lives | Visible |
|---|---|---|
| Local | While the function runs | Inside its block |
| Static local | Whole program | Inside its function |
| Global | Whole program | Everywhere in the file (and other files with `extern`) |

Prefer local variables and parameters; globals make programs harder to understand and test.

## Recursion

Functions can call themselves (see the algorithms recursion lesson):

```try-c
#include <stdio.h>

long factorial(int n) {
    if (n <= 1) return 1;          /* base case */
    return n * factorial(n - 1);   /* recursive case */
}

int main(void) {
    int i;
    for (i = 0; i <= 10; i++) {
        printf("%d! = %ld\n", i, factorial(i));
    }
    return 0;
}
```

## Organising code with header files

Larger programs split code into files:

```c
/* fees.h: declarations */
#ifndef FEES_H
#define FEES_H
double balance_due(double fee, double paid);
#endif
```

```c
/* fees.c: definitions */
#include "fees.h"
double balance_due(double fee, double paid) { return fee - paid; }
```

```c
/* main.c */
#include <stdio.h>
#include "fees.h"
int main(void) { printf("%.2f\n", balance_due(25000, 18000)); return 0; }
```

```bash
gcc main.c fees.c -o fees -Wall
```

`#ifndef/#define/#endif` are **include guards** that prevent the header being included twice. Use `<...>` for system headers and `"..."` for your own.

:::think Write a function `int is_leap(int year)` that returns 1 for leap years and 0 otherwise. What's the rule?
A year is a leap year if it's divisible by 4 and not by 100, unless it's also divisible by 400: `return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);`. So 2024 and 2000 are leap years; 1900 isn't.
:::

## Summary

- In C, 0 is false and non-zero is true; comparisons give 1 or 0; don't confuse `=` with `==`.
- Use if/else if/else, the conditional operator and switch (with break and default).
- Loops: for, while, do-while; break and continue; nested loops for tables.
- Functions have prototypes, definitions, parameters and return values; C passes arguments by value.
- Know local, static and global scope; recursion needs a base case; split code into .c and .h files with include guards.

```quiz
Q: In C, which value means false?
A: 0 | zero
Q: Which keyword stops a case in a switch from falling through?
A: break
Q: Which loop always runs at least once?
A: do-while | do while
Q: What is a function declaration before main called?
A: prototype | a prototype | function prototype
Q: Does C pass function arguments by value or by reference by default?
A: value | by value
Q: Which keyword makes a local variable keep its value between calls?
A: static
```
