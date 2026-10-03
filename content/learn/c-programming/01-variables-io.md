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

## Why C still matters

C is the language underneath much of computing: operating systems (Linux, the core of Windows and Android), embedded devices (ATMs, POS machines, routers, smart meters, car electronics, medical devices), databases and the interpreters of languages like Python and PHP. Learning C teaches how computers really store data in memory, which makes you a better programmer in any language. It's also common in university computer science and engineering courses and in embedded systems jobs.

## Sizes and ranges of types

The exact size of types can vary by platform, but on typical modern computers:

| Type | Usual size | Typical range / use |
|---|---|---|
| `char` | 1 byte | One character or small number (-128 to 127) |
| `short` | 2 bytes | -32,768 to 32,767 |
| `int` | 4 bytes | About ±2.1 billion |
| `long long` | 8 bytes | Very large whole numbers |
| `float` | 4 bytes | About 6–7 significant digits |
| `double` | 8 bytes | About 15–16 significant digits (use this for decimals) |

```try-c
#include <stdio.h>

int main(void) {
    printf("char: %d byte\n", (int) sizeof(char));
    printf("int: %d bytes\n", (int) sizeof(int));
    printf("double: %d bytes\n", (int) sizeof(double));
    return 0;
}
```

`sizeof` tells you how many bytes a type uses on the current machine, which matters in embedded systems where memory is very limited.

## Integer division and the modulo operator in practice

```try-c
#include <stdio.h>

int main(void) {
    int total_minutes = 135;
    int hours = total_minutes / 60;
    int minutes = total_minutes % 60;
    printf("%d minutes = %d h %d min\n", total_minutes, hours, minutes);

    int students = 173;
    int bus_seats = 50;
    int buses = (students + bus_seats - 1) / bus_seats;   /* round up without floats */
    printf("Buses needed: %d\n", buses);

    int amount = 2750;
    int thousands = amount / 1000;
    int hundreds = (amount % 1000) / 100;
    printf("KSh %d = %d x 1000 + %d x 100 + %d\n", amount, thousands, hundreds, amount % 100);

    double average = (double) (67 + 82 + 45) / 3;          /* cast before dividing */
    printf("Average: %.2f\n", average);
    return 0;
}
```

The `(a + b - 1) / b` trick rounds up using integers only, which is common in embedded code where floating point is slow or unavailable.

## Increment, compound assignment and precedence

```try-c
#include <stdio.h>

int main(void) {
    int stock = 10;
    stock -= 3;
    stock *= 2;
    stock++;
    printf("Stock: %d\n", stock);

    int a = 5;
    int b = a++;      /* b gets 5, then a becomes 6 */
    int c = ++a;      /* a becomes 7, then c gets 7 */
    printf("a=%d b=%d c=%d\n", a, b, c);

    printf("%d %d\n", 2 + 3 * 4, (2 + 3) * 4);
    return 0;
}
```

Avoid using `x++` more than once in the same expression (like `x++ + x++`): the result is undefined in C.

## Formatting output like a receipt

```try-c
#include <stdio.h>

int main(void) {
    printf("%-12s %5s %10s\n", "ITEM", "QTY", "AMOUNT");
    printf("%-12s %5d %10.2f\n", "Unga 2kg", 2, 360.0);
    printf("%-12s %5d %10.2f\n", "Sugar 1kg", 1, 210.0);
    printf("%-12s %5d %10.2f\n", "Milk 500ml", 3, 180.0);
    printf("%-12s %5s %10.2f\n", "TOTAL", "", 750.0);
    printf("Leading zeros: %05d\n", 42);
    printf("Percent sign: %d%%\n", 16);
    return 0;
}
```

| Format | Meaning |
|---|---|
| `%-12s` | String, left-aligned in 12 characters |
| `%5d` | Integer, right-aligned in 5 characters |
| `%10.2f` | Decimal, 10 wide, 2 decimals |
| `%05d` | Pad with zeros |
| `%%` | A literal percent sign |
| `%c` | One character |
| `%lld` | `long long` |

## Safer input with fgets

`scanf("%s", ...)` stops at spaces and can overflow a buffer. A safer pattern reads a whole line with `fgets`, then converts:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char line[64];
    printf("Enter amount: ");
    if (fgets(line, sizeof line, stdin) != NULL) {
        char *end;
        double amount = strtod(line, &end);
        if (end == line) {
            printf("That is not a number.\n");
        } else {
            printf("With VAT: %.2f\n", amount * 1.16);
        }
    }
    return 0;
}
```

`strtod` (and `strtol` for integers) report where conversion stopped, so you can detect invalid input instead of getting silent garbage.

## Characters are numbers

```try-c
#include <stdio.h>

int main(void) {
    char grade = 'B';
    printf("%c has code %d\n", grade, grade);
    printf("Next letter: %c\n", grade + 1);
    char digit = '7';
    int value = digit - '0';
    printf("Digit value doubled: %d\n", value * 2);
    char lower = 'k';
    printf("Upper case: %c\n", lower - 'a' + 'A');
    return 0;
}
```

## Compiling and warnings

```bash
gcc -Wall -Wextra -std=c11 -o receipt receipt.c   # turn on warnings
./receipt
```

Always compile with `-Wall -Wextra`: warnings often point to real bugs (unused variables, wrong printf specifiers, missing returns). Treat warnings as errors you must fix.

## Practice

1. Convert 4,000 seconds into hours, minutes and seconds.
2. Calculate how many crates of 24 bottles are needed for 500 bottles, rounding up.
3. Print a 3-item receipt with aligned columns and a total.
4. Read an amount safely with `fgets` and `strtod`, rejecting non-numbers.
5. Print the codes of the letters in your name with `%c` and `%d`.

:::think Why does `printf("%d\n", 7 / 2 * 2.0)` print a strange number or trigger a warning, while `printf("%.1f\n", 7 / 2 * 2.0)` prints 6.0?
`7 / 2` is integer division (3), then `3 * 2.0` is a double (6.0). Printing a double with `%d` is a format mismatch, which gives undefined/garbage output (and a compiler warning with -Wall). The correct specifier for a double is `%f`, and the value is 6.0, not 7, because the division happened first as integers.
:::

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
Q: Which operator tells you how many bytes a type uses?
A: sizeof
Q: Which printf format left-aligns a string in 12 characters?
A: %-12s
Q: Which function safely reads a whole line of input?
A: fgets
Q: Which gcc options turn on common warnings? (give the main one)
A: -Wall | -Wall -Wextra
```
