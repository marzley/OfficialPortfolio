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

## Where arrays and strings are used in C

Arrays hold sensor readings in embedded devices, pixel data in images, buffers of network packets, and lists of records in small systems. C strings are everywhere in system programming: file paths, commands, messages sent over serial ports, SMS text in GSM modules. Because C doesn't protect you from going past the end of an array, careless string handling has caused many famous security vulnerabilities (buffer overflows). Learning to handle them carefully is essential.

## Finding minimum, maximum and searching

```try-c
#include <stdio.h>

int main(void) {
    int marks[8];
    marks[0] = 67; marks[1] = 82; marks[2] = 45; marks[3] = 90;
    marks[4] = 58; marks[5] = 73; marks[6] = 39; marks[7] = 88;
    int n = 8;

    int min = marks[0];
    int max = marks[0];
    int sum = 0;
    int passed = 0;
    for (int i = 0; i < n; i++) {
        if (marks[i] < min) min = marks[i];
        if (marks[i] > max) max = marks[i];
        if (marks[i] >= 50) passed++;
        sum += marks[i];
    }
    printf("Min %d, max %d, average %.1f, passed %d of %d\n", min, max, (double) sum / n, passed, n);

    int target = 73;
    int found = -1;
    for (int i = 0; i < n; i++) {
        if (marks[i] == target) { found = i; break; }
    }
    if (found >= 0) printf("%d found at index %d\n", target, found);
    else printf("%d not found\n", target);
    return 0;
}
```

## Sorting with bubble sort

```try-c
#include <stdio.h>

void print_array(int *a, int n) {
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
}

void bubble_sort(int *a, int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        int swapped = 0;
        for (int i = 0; i < n - 1 - pass; i++) {
            if (a[i] > a[i + 1]) {
                int tmp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = tmp;
                swapped = 1;
            }
        }
        if (!swapped) break;          /* already sorted: stop early */
    }
}

int main(void) {
    int prices[6];
    prices[0] = 350; prices[1] = 180; prices[2] = 2500;
    prices[3] = 60; prices[4] = 900; prices[5] = 210;
    print_array(prices, 6);
    bubble_sort(prices, 6);
    print_array(prices, 6);
    return 0;
}
```

Bubble sort is simple but slow for large data; the standard library's `qsort` is much faster. Learning it builds understanding of loops, swaps and passing arrays to functions.

## Building strings safely

```try-c
#include <stdio.h>
#include <string.h>

int main(void) {
    char first[20];
    char last[20];
    char full[40];
    strcpy(first, "Achieng");
    strcpy(last, "Odhiambo");

    strcpy(full, first);
    strcat(full, " ");
    strcat(full, last);
    printf("Full name: %s (%d characters)\n", full, (int) strlen(full));

    char message[60];
    snprintf(message, sizeof message, "Habari %s, your balance is KSh %d", first, 1250);
    printf("%s\n", message);
    return 0;
}
```

`snprintf` writes formatted text into a buffer and never writes more than the size you give it, which makes it much safer than repeated `strcat`.

## Reversing and checking palindromes

```try-c
#include <stdio.h>
#include <string.h>

void reverse(char *s) {
    int i = 0;
    int j = strlen(s) - 1;
    while (i < j) {
        char tmp = s[i];
        s[i] = s[j];
        s[j] = tmp;
        i++;
        j--;
    }
}

int is_palindrome(char s[]) {
    int i = 0;
    int j = strlen(s) - 1;
    while (i < j) {
        if (s[i] != s[j]) return 0;
        i++;
        j--;
    }
    return 1;
}

int main(void) {
    char word[20];
    strcpy(word, "Kenya");
    reverse(word);
    printf("Reversed: %s\n", word);
    printf("racecar palindrome? %d\n", is_palindrome("racecar"));
    printf("nairobi palindrome? %d\n", is_palindrome("nairobi"));
    return 0;
}
```

## Validating a phone number

```try-c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

int valid_phone(char s[]) {
    if (strlen(s) != 10) return 0;
    if (s[0] != '0') return 0;
    if (s[1] != '7' && s[1] != '1') return 0;
    for (int i = 0; i < 10; i++) {
        if (!isdigit(s[i])) return 0;
    }
    return 1;
}

int main(void) {
    printf("0712345678 -> %d\n", valid_phone("0712345678"));
    printf("0112345678 -> %d\n", valid_phone("0112345678"));
    printf("07123 -> %d\n", valid_phone("07123"));
    printf("07123456a8 -> %d\n", valid_phone("07123456a8"));
    return 0;
}
```

## Buffer overflows: the classic danger

```c
char name[8];
strcpy(name, "A very long name indeed");   /* writes past the end of name: undefined behaviour */
```

Writing beyond an array's end can corrupt other variables, crash the program, or let attackers run their own code. Safer habits:

| Risky | Safer |
|---|---|
| `gets(buffer)` (removed from the standard) | `fgets(buffer, sizeof buffer, stdin)` |
| `strcpy(dest, src)` with unknown length | Check `strlen(src) < sizeof dest`, or use `snprintf` |
| `sprintf(buf, ...)` | `snprintf(buf, sizeof buf, ...)` |
| `scanf("%s", buf)` | `scanf("%19s", buf)` with a width limit, or `fgets` |
| Loops with `i <= n` | `i < n` |

Compiler tools like `-fsanitize=address` (AddressSanitizer) detect many out-of-bounds errors during testing.

## Practice

1. Store 10 daily temperatures and print the hottest day, coldest day and average.
2. Sort an array of 8 prices with bubble sort, then print them from highest to lowest.
3. Write `count_char(s, c)` that counts how often a character appears in a string.
4. Build a greeting with `snprintf` that includes a name and an amount.
5. Write a function that checks whether a KRA PIN-like code has a letter, 9 digits and a letter.

:::think Why must a buffer for the string "Nairobi" be at least 8 chars, and what goes wrong with `char town[7]; strcpy(town, "Nairobi");`?
"Nairobi" has 7 letters plus the terminating `'\0'`, so it needs 8 bytes. With only 7, `strcpy` writes the `'\0'` one byte past the end, which is a buffer overflow: it may overwrite another variable or crash, and the behaviour is undefined even if it seems to work.
:::

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
Q: Which function writes formatted text into a buffer with a size limit?
A: snprintf
Q: Which unsafe input function was removed from the C standard?
A: gets
Q: Which ctype.h function checks whether a character is a digit?
A: isdigit
Q: In bubble sort, what flag lets you stop early when the array is already sorted?
A: swapped
```
