---
slug: introduction
title: "C introduction: why C matters, where it's used, compiling, your first program, program structure, data types and printf"
after: KEEP
---
# C introduction: why C matters, where it's used, compiling, your first program, program structure, data types and printf

**C** is one of the most influential programming languages ever created. Developed in the early 1970s by Dennis Ritchie at Bell Labs to build the Unix operating system, it still runs much of the world's technology: operating system kernels (Linux, much of Windows and macOS), embedded devices (microcontrollers in cars, ATMs, POS machines, medical devices, smart meters), routers, databases, and the interpreters of languages like Python. Learning C teaches you how computers really work: memory, addresses, bytes and the cost of every operation. It's also a core course in most Kenyan computer science and engineering programmes.

:::note What you will learn
- Why C is still important and where it's used
- How C programs are compiled and run (preprocessor, compiler, linker)
- Setting up a compiler: GCC, MinGW, Code::Blocks, VS Code
- Your first program, line by line
- Program structure: headers, main, statements, return values
- Data types, sizes and limits
- Variables, constants and naming
- printf format specifiers and scanf for input
- Operators, integer division and casting
- Comments and common beginner errors
:::

## Why learn C?

| Reason | Detail |
|---|---|
| **Speed and control** | Compiles to fast machine code; you control memory directly |
| **Everywhere in hardware** | Microcontrollers (Arduino uses C/C++), IoT devices, embedded systems |
| **Foundation** | C++, Java, C#, JavaScript, Go and PHP borrow its syntax |
| **Understanding computers** | Pointers, memory layout, how data is stored |
| **Careers** | Embedded systems, firmware, operating systems, networking equipment, high-performance computing |

Trade-offs: no built-in safety nets (no automatic bounds checking or garbage collection), so mistakes can crash programs or create security holes. That's why understanding C deeply is valuable.

## Where C is used

| Area | Examples |
|---|---|
| Operating systems | Linux kernel, parts of Windows, macOS, Android's lower layers |
| Embedded and IoT | Arduino, ESP32, STM32 microcontrollers; smart meters, POS terminals, car ECUs |
| Networking | Router firmware, network stacks |
| Databases and tools | SQLite, Redis, parts of MySQL/PostgreSQL |
| Languages | The standard Python interpreter (CPython) is written in C |

## From source code to running program

```
hello.c → [preprocessor] → [compiler] → hello.o (object code) → [linker] → hello (executable) → run
```

1. **Preprocessor**: handles `#include` and `#define` (copies in header files, replaces macros).
2. **Compiler**: translates C into machine code (object file).
3. **Linker**: combines object files and libraries (like the one containing `printf`) into an executable.

## Setting up

| Platform | Option |
|---|---|
| Windows | MinGW-w64 (GCC for Windows), Code::Blocks (includes a compiler), or WSL with GCC; VS Code + C/C++ extension |
| macOS | `xcode-select --install` (Clang) |
| Linux | `sudo apt install build-essential` (GCC) |
| Online | This hub's Run button; onlinegdb.com |

Compile and run in a terminal:

```bash
gcc hello.c -o hello -Wall    # -Wall shows helpful warnings
./hello                        # Windows: hello.exe
```

## Your first program

```try-c
#include <stdio.h>

int main(void) {
    printf("Habari, Kenya!\n");
    printf("Learning C on the Marzley learning hub.\n");
    return 0;
}
```

Line by line:
- `#include <stdio.h>`: includes the standard input/output header, which declares `printf`.
- `int main(void)`: the **main function**, where execution starts; it returns an `int`.
- `{ ... }`: the function body.
- `printf(...)`: prints formatted text; `\n` is a new line.
- `return 0;`: tells the operating system the program finished successfully (non-zero means an error).
- Every statement ends with `;`.

## Data types

```try-c
#include <stdio.h>

int main(void) {
    int students = 45;
    float height = 1.72f;
    double balance = 12500.75;
    char grade = 'A';
    long population = 53000000L;

    printf("Students: %d\n", students);
    printf("Height: %.2f m\n", height);
    printf("Balance: KSh %.2f\n", balance);
    printf("Grade: %c (stored as the number %d)\n", grade, grade);
    printf("Population: %ld\n", population);
    printf("int is %d bytes, double is %d bytes, char is %d byte\n",
           (int)sizeof(int), (int)sizeof(double), (int)sizeof(char));
    return 0;
}
```

| Type | Typical size | Use | printf |
|---|---|---|---|
| `char` | 1 byte | A character (stored as a number, e.g. 'A' = 65) | `%c` |
| `int` | 4 bytes | Whole numbers (about ±2.1 billion) | `%d` |
| `long` | 4 or 8 bytes | Larger whole numbers | `%ld` |
| `float` | 4 bytes | Decimals (~7 digits precision) | `%f` |
| `double` | 8 bytes | Decimals (~15 digits) | `%f` (printf), `%lf` (scanf) |
| `unsigned int` | 4 bytes | Non-negative whole numbers | `%u` |

Sizes can vary by platform; `sizeof` tells you on your machine, and `<limits.h>` defines limits such as `INT_MAX` (2,147,483,647 for a 4-byte int). C has no built-in `bool` or `string` types in old standards: `<stdbool.h>` provides `bool`, and strings are arrays of `char` (see the arrays and strings lesson).

## Variables and constants

```try-c
#include <stdio.h>
#define VAT_RATE 0.16          /* preprocessor constant: replaced before compiling */

int main(void) {
    int max_students = 50;
    double price = 1000.0;
    double vat = price * VAT_RATE;
    int enrolled = 47;

    printf("VAT on KSh %.0f is KSh %.2f\n", price, vat);
    printf("Seats left: %d of %d\n", max_students - enrolled, max_students);
    return 0;
}
```

You can also make a typed constant with `const`, which the compiler protects from changes (try it with GCC on your computer):

```c
const int MAX_STUDENTS = 50;
MAX_STUDENTS = 60;   /* error: assignment of read-only variable */
```

Rules: names start with a letter or underscore, contain letters/digits/underscores, are case-sensitive, and can't be keywords (`int`, `return`, `while`...). **Always initialise variables**: an uninitialised local variable holds garbage (whatever was in memory).

## printf format specifiers

```try-c
#include <stdio.h>

int main(void) {
    printf("[%d]\n", 42);
    printf("[%5d]\n", 42);          /* width 5, right-aligned */
    printf("[%-5d]\n", 42);         /* left-aligned */
    printf("[%05d]\n", 42);         /* zero-padded */
    printf("[%.2f]\n", 3.14159);    /* 2 decimal places */
    printf("[%8.2f]\n", 160.5);     /* width 8 */
    printf("[%s]\n", "Kisumu");
    printf("[%-10s|]\n", "Sugar");  /* padded string for tables */
    printf("[%x] [%o]\n", 255, 8);  /* hexadecimal, octal */
    printf("100%% sure\n");         /* %% prints % */
    return 0;
}
```

## Reading input with scanf

Run this on your own computer (the online runner can't type input):

```c
#include <stdio.h>

int main(void) {
    int age;
    double fee;
    char name[50];

    printf("Name: ");
    scanf("%49s", name);          /* reads one word; 49 limits length to avoid overflow */
    printf("Age: ");
    scanf("%d", &age);            /* & gives scanf the address of age */
    printf("Fee: ");
    scanf("%lf", &fee);           /* %lf for double in scanf */

    printf("%s, %d years, fee KSh %.2f\n", name, age, fee);
    return 0;
}
```

The `&` (address-of operator) lets `scanf` store the value in your variable; pointers are explained later. For whole lines with spaces, use `fgets`.

## Operators and integer division

```try-c
#include <stdio.h>

int main(void) {
    int a = 17, b = 5;
    printf("%d %d %d %d %d\n", a + b, a - b, a * b, a / b, a % b);   /* 22 12 85 3 2 */
    printf("%.2f\n", (double)a / b);                                  /* 3.40 */

    int count = 10;
    count++;
    count += 5;
    printf("count = %d\n", count);                                    /* 16 */

    int total = 245, n = 4;
    printf("Wrong average: %d\n", total / n);                         /* 61 */
    printf("Right average: %.2f\n", (double)total / n);               /* 61.25 */
    return 0;
}
```

`int / int` gives an `int` (decimals dropped). Cast one operand to `double` for decimal results.

## Comments

```c
/* Multi-line comment
   (works in all C versions) */
// Single-line comment (C99 and later)
```

## Common beginner errors

| Error | Cause |
|---|---|
| `expected ';' before ...` | Missing semicolon on the previous line |
| `implicit declaration of function 'printf'` | Forgot `#include <stdio.h>` |
| `undefined reference to 'main'` | Misspelt `main` or no main function |
| Wrong numbers printed | Wrong format specifier (`%d` for a double) |
| Random values | Uninitialised variable |
| Program crashes on scanf | Forgot `&` before the variable |

Compile with `-Wall -Wextra` to catch many of these early.

:::think A student's program prints a huge random number for `total`. The code declares `int total;` then adds marks to it in a loop. What's wrong?
`total` was never initialised, so it started with garbage memory. Declare it as `int total = 0;` before the loop. Compiling with `-Wall` would warn about this.
:::

## Summary

- C (1972, Dennis Ritchie) powers operating systems, embedded devices, networking and language runtimes; it teaches how computers work.
- Source code goes through the preprocessor, compiler and linker; use GCC/Clang with `-Wall`.
- Programs start at `int main(void)`, use `#include <stdio.h>` for printf, end statements with `;` and `return 0` on success.
- Types: char, int, long, float, double, unsigned; use sizeof; constants with `#define` or `const`; always initialise variables.
- printf formats output (`%d`, `%f`, `%.2f`, `%c`, `%s`); scanf reads input with `&`; watch integer division.

```quiz
Q: Who created the C language? (full name)
A: Dennis Ritchie
Q: Which header file declares printf?
A: stdio.h | <stdio.h>
Q: What value does main return to show success?
A: 0 | zero
Q: Which format specifier prints an int?
A: %d
Q: What does 17 / 5 give when both are ints in C?
A: 3
Q: Which GCC option turns on helpful warnings?
A: -Wall
```
