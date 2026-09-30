---
slug: arrays-strings
title: Arrays and strings in C
after: control-functions
---
# Arrays and strings in C

An **array** stores many values of the same type in a row in memory. A **string** in C is just an array of `char` ending with a special `'\0'` character. Understanding both is essential for C and explains how memory works in every language.

## Arrays

```try-c
#include <stdio.h>

int main(void) {
    int marks[5] = {78, 92, 45, 60, 88};
    int total = 0, best = marks[0];

    for (int i = 0; i < 5; i++) {
        printf("Student %d: %d\n", i + 1, marks[i]);
        total += marks[i];
        if (marks[i] > best) best = marks[i];
    }
    printf("Average: %.1f, best: %d\n", total / 5.0, best);

    int count = sizeof(marks) / sizeof(marks[0]);   /* number of elements */
    printf("Elements: %d\n", count);
    return 0;
}
```

- Indexes start at **0**; the last is `size - 1`.
- C does **not** check bounds: `marks[10]` reads or overwrites random memory. This is a classic source of bugs and security holes (buffer overflows).
- `sizeof(array) / sizeof(array[0])` gives the element count (only where the array was declared).

## Passing arrays to functions

Arrays are passed as a **pointer** to the first element, so also pass the length. `int *values` and `int values[]` mean the same thing in a parameter; we use the pointer form because it makes clear the function works on the caller's array:

```try-c
#include <stdio.h>

double average(int *values, int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) sum += values[i];
    return n > 0 ? (double)sum / n : 0;
}

void addBonus(int *values, int n, int bonus) {
    for (int i = 0; i < n; i++) values[i] += bonus;   /* changes the caller's array! */
}

int main(void) {
    int marks[4] = {45, 78, 92, 60};
    printf("Average: %.2f\n", average(marks, 4));
    addBonus(marks, 4, 5);
    printf("After bonus, first mark: %d\n", marks[0]);
    return 0;
}
```

## Two-dimensional arrays

```try-c
#include <stdio.h>

int main(void) {
    /* 3 students x 4 subjects */
    int marks[3][4] = {
        {78, 84, 90, 71},
        {92, 71, 65, 88},
        {55, 62, 70, 49}
    };
    for (int s = 0; s < 3; s++) {
        int total = 0;
        for (int j = 0; j < 4; j++) total += marks[s][j];
        printf("Student %d total: %d\n", s + 1, total);
    }
    return 0;
}
```

## Strings: char arrays ending in '\0'

```
"Kenya" in memory:  'K' 'e' 'n' 'y' 'a' '\0'
                     0   1   2   3   4    5
```

The hidden `'\0'` (null terminator) marks the end, so "Kenya" needs **6** chars of space.

```try-c
#include <stdio.h>
#include <string.h>

int main(void) {
    char town[20] = "Nakuru";
    char greeting[50];

    printf("%s has %d letters\n", town, (int)strlen(town));

    strcpy(greeting, "Karibu ");          /* copy */
    strcat(greeting, town);               /* append */
    printf("%s!\n", greeting);

    if (strcmp(town, "Nakuru") == 0) {    /* compare: 0 means equal */
        printf("Same town\n");
    }

    town[0] = 'n';                        /* change one character */
    printf("%s\n", town);

    for (int i = 0; town[i] != '\0'; i++) {
        printf("%c-", town[i]);
    }
    printf("\n");
    return 0;
}
```

## The string.h toolbox

| Function | Does | Watch out |
|---|---|---|
| `strlen(s)` | Length (not counting `'\0'`) | |
| `strcpy(dst, src)` | Copy | `dst` must be big enough |
| `strncpy(dst, src, n)` | Copy at most n chars | May not add `'\0'` |
| `strcat(dst, src)` | Append | `dst` must be big enough |
| `strcmp(a, b)` | Compare: 0 equal, <0 or >0 | Don't use `==` for strings |
| `strchr(s, c)` | Find a character | Returns a pointer or NULL |
| `strstr(s, sub)` | Find a substring | Returns a pointer or NULL |

Safer formatting into a buffer: `snprintf(buf, sizeof buf, "KSh %d", amount);`

## Counting and changing characters

```try-c
#include <stdio.h>
#include <ctype.h>

int main(void) {
    char sms[] = "Your balance is Ksh 1,250. Call 0712345678!";
    int digits = 0, letters = 0;
    for (int i = 0; sms[i] != '\0'; i++) {
        if (isdigit(sms[i])) digits++;
        else if (isalpha(sms[i])) letters++;
        sms[i] = toupper(sms[i]);
    }
    printf("Digits: %d, letters: %d\n%s\n", digits, letters, sms);
    return 0;
}
```

```quiz
Q: What is the index of the first element of a C array?
A: 0 | zero
Q: What character marks the end of a C string? (write it as in code)
A: '\0' | \0 | null | null terminator
Q: How many chars of space does the string "Kenya" need?
A: 6 | six
Q: Which function compares two strings?
A: strcmp | strcmp()
Q: Does C check array bounds for you? (yes or no)
A: no
```
