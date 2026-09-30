---
slug: variables-types-io
title: Variables, data types, printf and scanf
after: introduction
---
# Variables, data types, printf and scanf

C is small, fast and close to the hardware. It's used for operating systems, embedded devices (ATMs, routers, car electronics) and is a core unit in many TVET and university ICT courses. Mastering the basics carefully pays off in every other language.

> C examples here run in your browser with a small C interpreter. Most beginner programs work; a few advanced features switch automatically to an online compiler.

## Declaring variables

```try-c
#include <stdio.h>

int main(void) {
    int students = 45;
    float height = 1.72f;
    double balance = 12500.75;
    char grade = 'A';

    printf("Students: %d\n", students);
    printf("Height: %.2f m\n", height);
    printf("Balance: KSh %.2f\n", balance);
    printf("Grade: %c\n", grade);
    printf("Size of int: %d bytes, double: %d bytes\n", (int)sizeof(int), (int)sizeof(double));
    return 0;
}
```

## Basic data types

| Type | Typical size | Holds | printf |
|---|---|---|---|
| `char` | 1 byte | One character (`'A'`) or small number | `%c` |
| `int` | 4 bytes | Whole numbers (about ±2.1 billion) | `%d` |
| `long` | 4–8 bytes | Bigger whole numbers | `%ld` |
| `float` | 4 bytes | Decimals, ~7 digits precision | `%f` |
| `double` | 8 bytes | Decimals, ~15 digits: use for money calculations | `%f` / `%lf` in scanf |
| `unsigned int` | 4 bytes | 0 and positive only | `%u` |

C has no built-in `string` type: text is an **array of `char`** (next lessons).

## printf format specifiers

```try-c
#include <stdio.h>

int main(void) {
    printf("[%d]\n", 42);          /* integer */
    printf("[%5d]\n", 42);         /* width 5, right-aligned */
    printf("[%-5d]\n", 42);        /* left-aligned */
    printf("[%05d]\n", 42);        /* padded with zeros */
    printf("[%.2f]\n", 3.14159);   /* 2 decimal places */
    printf("[%8.2f]\n", 160.5);    /* width 8, 2 decimals */
    printf("[%s]\n", "Kisumu");    /* string */
    printf("[%-10s|]\n", "Sugar"); /* padded string: good for tables */
    printf("[%x] [%o]\n", 255, 8); /* hexadecimal, octal */
    printf("100%% sure\n");        /* %% prints a percent sign */
    return 0;
}
```

Escape sequences: `\n` new line, `\t` tab, `\\` backslash, `\"` quote.

## Constants

```try-c
#include <stdio.h>
#define VAT_RATE 0.16
#define SHOP "Duka Bora"

int main(void) {
    double price = 1500;
    printf("%s: price %.2f, VAT %.2f, total %.2f\n", SHOP, price, price * VAT_RATE, price * (1 + VAT_RATE));
    return 0;
}
```

`#define` replaces the name with the value before compiling. Inside functions you can also write `const double VAT = 0.16;`.

## Arithmetic and the integer division trap

```try-c
#include <stdio.h>

int main(void) {
    int a = 17, b = 5;
    printf("%d %d %d\n", a + b, a - b, a * b);
    printf("%d\n", a / b);             /* 3: both ints, so the decimal part is dropped */
    printf("%d\n", a % b);             /* 2: remainder */
    printf("%.2f\n", (double)a / b);   /* 3.40: cast first */

    int count = 10;
    count++;           /* 11 */
    count += 5;        /* 16 */
    printf("%d\n", count);
    return 0;
}
```

## Reading input with scanf

```c
#include <stdio.h>

int main(void) {
    int qty;
    double price;
    char name[50];

    printf("Customer name: ");
    scanf("%49s", name);            /* no & for arrays; %49s stops overflow */
    printf("Quantity: ");
    scanf("%d", &qty);              /* & gives scanf the variable's address */
    printf("Price: ");
    scanf("%lf", &price);           /* %lf for double in scanf */

    printf("%s owes KSh %.2f\n", name, qty * price);
    return 0;
}
```

- `&qty` means "the address of qty": scanf needs to know **where** to store the value.
- `%s` reads one word (stops at a space). To read a full line use `fgets(name, sizeof name, stdin);`.
- Always check input: `if (scanf("%d", &qty) != 1) { printf("Not a number\n"); }`.

(To try input in our editor, type values when it asks. On your computer compile with `gcc main.c -o main` and run `./main`.)

## Common beginner mistakes

| Mistake | Fix |
|---|---|
| Forgetting `;` | Every statement ends with `;` |
| `scanf("%d", qty)` | Needs `&qty` |
| Using `%d` for a double | Use `%f` in printf, `%lf` in scanf |
| `=` instead of `==` in `if` | `if (x == 5)` |
| Uninitialised variables | Always give a starting value: `int total = 0;` |

```quiz
Q: Which printf specifier prints an int?
A: %d
Q: Which printf specifier prints a double with 2 decimal places?
A: %.2f
Q: What is 17 / 5 in C when both are int?
A: 3
Q: What symbol must go before an int variable in scanf?
A: & | ampersand
Q: Which specifier does scanf use to read a double?
A: %lf
```
