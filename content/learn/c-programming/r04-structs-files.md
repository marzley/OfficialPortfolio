---
slug: structs-files
title: "Structs and files in C: grouping data with struct, arrays of structs, pointers to structs, typedef, enums and reading/writing files"
after: KEEP
---
# Structs and files in C: grouping data with struct, arrays of structs, pointers to structs, typedef, enums and reading/writing files

Real programs handle records: a student with an admission number, name and balance; a product with a code, price and stock; a sensor reading with a time and value. C's **struct** groups related fields into one custom type. And because data in memory disappears when the program ends, programs **save to files** and read them back: student lists, sales logs, configuration and backups. This unit covers structs in depth, then text and binary file handling, ending with a small records program you can extend into a school or shop system.

:::note What you will learn
- Defining structs and creating struct variables
- Accessing fields with the dot operator
- typedef for cleaner type names
- Arrays of structs and searching/sorting them
- Pointers to structs and the arrow operator
- Passing structs to functions (by value and by pointer)
- Nested structs and enums
- Opening, writing, reading and closing text files (fopen, fprintf, fscanf, fgets)
- Appending, checking errors and CSV files
- Binary files (fwrite, fread)
- A complete small records program
:::

## Defining a struct

```try-c
#include <stdio.h>
#include <string.h>

struct Student {
    char admission[10];
    char name[30];
    int form;
    double balance;
};

int main(void) {
    struct Student s1;
    strcpy(s1.admission, "ADM001");
    strcpy(s1.name, "Brian Kipchumba");
    s1.form = 3;
    s1.balance = 12500.0;

    struct Student s2;
    strcpy(s2.admission, "ADM002");
    strcpy(s2.name, "Faith Chebet");
    s2.form = 4;
    s2.balance = 0.0;

    printf("%s %s, Form %d, balance KSh %.2f\n", s1.admission, s1.name, s1.form, s1.balance);
    printf("%s %s, Form %d, balance KSh %.2f\n", s2.admission, s2.name, s2.form, s2.balance);
    printf("Each Student record uses %d bytes\n", (int)sizeof(struct Student));
    return 0;
}
```

- The struct **definition** describes the fields; it doesn't create a variable.
- Access fields with the **dot operator**: `s1.balance`.
- Copy strings into char array fields with `strcpy` (you can't assign arrays with `=`).
- With GCC you can also initialise a struct in one line, in field order: `struct Student s2 = {"ADM002", "Faith Chebet", 4, 0.0};` (the in-browser runner here doesn't support that shortcut, so the examples assign fields one by one).

## typedef

`typedef` gives a type a shorter name:

```c
typedef struct {
    char code[10];
    char name[30];
    double price;
    int stock;
} Product;

Product p;              /* instead of struct Product p; */
```

## Arrays of structs

```try-c
#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    double price;
    int stock;
} Product;

Product items[4];

void set_item(int i, char *name, double price, int stock) {
    strcpy(items[i].name, name);
    items[i].price = price;
    items[i].stock = stock;
}

int main(void) {
    int i;
    double stock_value = 0.0;
    set_item(0, "Laptop bag", 2500.0, 12);
    set_item(1, "USB flash", 900.0, 3);
    set_item(2, "Mouse", 1200.0, 25);
    set_item(3, "Charger", 800.0, 2);

    printf("%-12s %8s %6s\n", "Product", "Price", "Stock");
    for (i = 0; i < 4; i++) {
        printf("%-12s %8.0f %6d", items[i].name, items[i].price, items[i].stock);
        if (items[i].stock < 5) printf("  <- reorder");
        printf("\n");
        stock_value += items[i].price * items[i].stock;
    }
    printf("Total stock value: KSh %.0f\n", stock_value);
    return 0;
}
```

## Pointers to structs and the arrow operator

```try-c
#include <stdio.h>
#include <string.h>

typedef struct {
    char owner[20];
    double balance;
} Account;

void deposit(Account *acc, double amount) {
    if (amount > 0) acc->balance += amount;      /* acc->balance is (*acc).balance */
}

int withdraw(Account *acc, double amount) {
    if (amount <= 0 || amount > acc->balance) return 0;
    acc->balance -= amount;
    return 1;
}

void show(Account acc) {                          /* by value: gets a copy (fine for printing) */
    printf("%s: KSh %.2f\n", acc.owner, acc.balance);
}

int main(void) {
    Account a;
    strcpy(a.owner, "Wanjiku");
    a.balance = 1000.0;
    deposit(&a, 2500.0);
    printf("Withdraw 5000: %s\n", withdraw(&a, 5000.0) ? "OK" : "declined");
    printf("Withdraw 1500: %s\n", withdraw(&a, 1500.0) ? "OK" : "declined");
    show(a);
    return 0;
}
```

| Syntax | When |
|---|---|
| `s.field` | You have a struct variable |
| `p->field` | You have a pointer to a struct (same as `(*p).field`) |

Pass **pointers** when a function must change the struct, or to avoid copying large structs.

## Nested structs and enums

```try-c
#include <stdio.h>

enum Status { PENDING, PAID, SHIPPED, DELIVERED };

typedef struct {
    int day;
    int month;
    int year;
} Date;

typedef struct {
    int id;
    double amount;
    Date ordered;
    enum Status status;
} Order;

char *status_name(enum Status s) {
    switch (s) {
        case PENDING: return "Pending";
        case PAID: return "Paid";
        case SHIPPED: return "Shipped";
        case DELIVERED: return "Delivered";
    }
    return "Unknown";
}

int main(void) {
    Order o;
    o.id = 1042;
    o.amount = 4250.0;
    o.ordered.day = 15;
    o.ordered.month = 9;
    o.ordered.year = 2026;
    o.status = PAID;
    printf("Order %d: KSh %.2f on %02d/%02d/%d, status %s\n",
           o.id, o.amount, o.ordered.day, o.ordered.month, o.ordered.year, status_name(o.status));
    o.status = SHIPPED;
    printf("Now: %s\n", status_name(o.status));
    return 0;
}
```

An **enum** gives names to integer constants (PENDING = 0, PAID = 1...), making code readable.

## Files: why and how

Data in variables disappears when the program ends. Files store it permanently. The basic steps:

1. **Open** with `fopen(filename, mode)`, which returns a `FILE *` (or NULL on failure).
2. **Read or write** with `fprintf`, `fscanf`, `fgets`, `fputs`, `fread`, `fwrite`.
3. **Close** with `fclose`.

| Mode | Meaning |
|---|---|
| `"r"` | Read (file must exist) |
| `"w"` | Write (creates or **erases** the file) |
| `"a"` | Append to the end (creates if missing) |
| `"r+"` | Read and write |
| `"rb"`, `"wb"`, `"ab"` | Binary versions |

The file examples below use `fopen`, so run them with GCC on your own computer (the in-browser runner has no file system).

### Writing a text file (CSV)

```c
#include <stdio.h>

typedef struct { char name[20]; double price; int stock; } Product;

int main(void) {
    Product items[3] = {{"Laptop bag", 2500, 12}, {"USB flash", 900, 3}, {"Mouse", 1200, 25}};
    FILE *f = fopen("products.csv", "w");
    if (f == NULL) {
        perror("Could not open products.csv");
        return 1;
    }
    fprintf(f, "name,price,stock\n");
    for (int i = 0; i < 3; i++) {
        fprintf(f, "%s,%.2f,%d\n", items[i].name, items[i].price, items[i].stock);
    }
    fclose(f);
    printf("Saved 3 products\n");
    return 0;
}
```

The result opens in Excel or Google Sheets as a table.

### Reading a text file line by line

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("products.csv", "r");
    if (f == NULL) { perror("products.csv"); return 1; }

    char line[200], name[50];
    double price;
    int stock, count = 0;

    fgets(line, sizeof line, f);                     /* skip the header line */
    while (fgets(line, sizeof line, f) != NULL) {    /* read until end of file */
        if (sscanf(line, "%49[^,],%lf,%d", name, &price, &stock) == 3) {
            printf("%-12s KSh %8.2f  stock %d\n", name, price, stock);
            count++;
        }
    }
    fclose(f);
    printf("%d products read\n", count);
    return 0;
}
```

- `fgets` reads a whole line safely (up to the buffer size).
- `sscanf` parses the line; `%49[^,]` reads up to 49 characters that aren't commas (so names can contain spaces).
- Check the return value of `sscanf` (number of fields read) to skip bad lines.

### Appending (logs)

```c
FILE *log = fopen("payments.log", "a");
if (log) {
    fprintf(log, "2026-09-15 10:42,QJK7RT61SV,254712345678,1500\n");
    fclose(log);
}
```

### Binary files

Binary files store structs exactly as bytes: fast and compact, but not human-readable and not portable between different systems.

```c
Product items[3] = { /* ... */ };
FILE *f = fopen("products.dat", "wb");
fwrite(items, sizeof(Product), 3, f);
fclose(f);

Product loaded[3];
f = fopen("products.dat", "rb");
size_t n = fread(loaded, sizeof(Product), 3, f);   /* returns how many records were read */
fclose(f);
```

Text (CSV) is usually better for sharing; binary suits fixed-size records and speed.

### File error handling

- Always check `fopen` for NULL; `perror` prints the reason ("No such file or directory").
- Check return values of reads (`fgets` returns NULL at end of file or error).
- Always `fclose` files (it also flushes buffered data to disk).
- Opening with `"w"` erases existing content: use `"a"` to add.

## A small records program (in memory)

This runnable version keeps records in an array of structs with add, search and report functions; on your computer, add `save` and `load` functions using the file code above.

```try-c
#include <stdio.h>
#include <string.h>

#define MAX 50

typedef struct {
    char admission[10];
    char name[30];
    double balance;
} Student;

Student db[MAX];
int count = 0;

int add_student(char *adm, char *name, double balance) {
    if (count >= MAX) return 0;
    strcpy(db[count].admission, adm);
    strcpy(db[count].name, name);
    db[count].balance = balance;
    count++;
    return 1;
}

int find(char *adm) {                 /* returns the position, or -1 if not found */
    int i;
    for (i = 0; i < count; i++) {
        if (strcmp(db[i].admission, adm) == 0) return i;
    }
    return -1;
}

void report(void) {
    int i;
    double total = 0.0;
    for (i = 0; i < count; i++) {
        printf("%-8s %-18s KSh %9.2f\n", db[i].admission, db[i].name, db[i].balance);
        total += db[i].balance;
    }
    printf("Total arrears: KSh %.2f\n", total);
}

int main(void) {
    int pos;
    add_student("ADM001", "Brian Kipchumba", 12500.0);
    add_student("ADM002", "Faith Chebet", 0.0);
    add_student("ADM003", "Halima Omar", 4300.0);

    pos = find("ADM003");
    if (pos != -1) {
        db[pos].balance -= 4300.0;            /* record a payment */
        printf("Payment recorded for %s\n", db[pos].name);
    }
    if (find("ADM999") == -1) printf("ADM999 not found\n");
    report();
    return 0;
}
```

Ideas to extend it: a menu loop, saving to and loading from `students.csv`, sorting by balance, and input validation. This mirrors how real systems are structured before moving to a database.

:::think Your program writes the student list with fopen("students.csv", "w") every time a payment is recorded. A colleague suggests using "a" instead. When is each correct?
Use "w" (overwrite) when you rewrite the full, updated list each time (the file always reflects current data). Use "a" (append) for logs where you add new events without changing old ones (e.g. a payments history). Appending the whole list each time would create duplicates.
:::

## Summary

- A struct groups related fields; access them with `.`; typedef simplifies names; copy strings with strcpy.
- Arrays of structs hold many records; loop to search, total and report.
- Pointers to structs use `->`; pass pointers to modify structs or avoid copies; enums name related constants; structs can nest.
- Files: fopen (check NULL) → fprintf/fgets/sscanf/fputs or fwrite/fread → fclose; modes r, w (erases), a (appends), b (binary).
- CSV text files are portable and readable; binary files are compact; build records programs with add, find, report, save and load.

```quiz
Q: Which keyword groups related fields into a custom type?
A: struct
Q: Which operator accesses a field through a pointer to a struct?
A: -> | arrow
Q: Which keyword creates a shorter name for a type?
A: typedef
Q: Which fopen mode adds to the end of a file without erasing it?
A: a | "a"
Q: What does fopen return if it fails?
A: NULL
Q: Which function safely reads a whole line from a file?
A: fgets
```
