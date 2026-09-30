---
slug: basics-references-functions
title: C++ basics: I/O, types, references and functions
after: introduction
---
# C++ basics: I/O, types, references and functions

C++ builds on C and adds classes, references, a huge standard library and much more. It powers games, browsers (Chrome), databases, trading systems and competitive programming. This lesson covers the everyday basics.

> Simple examples run in your browser. Code that uses the standard library (`string`, `vector`, `map`...) or classes runs automatically on Compiler Explorer (online), which needs internet and a few seconds.

## Input and output with streams

```try-cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int students = 45;
    double fee = 12500.5;
    cout << "Students: " << students << endl;
    cout << fixed << setprecision(2) << "Fee: KSh " << fee << endl;
    cout << setw(10) << "Item" << setw(8) << "Price" << endl;
    cout << setw(10) << "Sugar" << setw(8) << 160.0 << endl;
    return 0;
}
```

| Tool | Does |
|---|---|
| `cout << x` | Print |
| `cin >> x` | Read (stops at spaces) |
| `getline(cin, s)` | Read a whole line into a `string` |
| `endl` / `"\n"` | New line (`"\n"` is faster) |
| `fixed << setprecision(2)` | 2 decimal places (from `<iomanip>`) |
| `setw(n)` | Column width |

## Types, auto and const

```try-cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int qty = 3;
    double price = 180.0;
    bool paid = true;
    char grade = 'A';
    string name = "Wanjiru";          // real strings, unlike C
    const double VAT = 0.16;          // can't be changed
    auto total = qty * price * (1 + VAT);   // auto: the compiler works out the type (double)

    cout << name << " bought " << qty << " items for " << total << endl;
    cout << "Paid: " << boolalpha << paid << ", grade " << grade << endl;
    cout << "Name has " << name.length() << " letters, first is " << name[0] << endl;
    return 0;
}
```

## Functions

```try-cpp
#include <iostream>
using namespace std;

double withVat(double amount, double rate = 16) {    // default argument
    return amount * (1 + rate / 100);
}

int main() {
    cout << withVat(1000) << " " << withVat(1000, 0) << endl;
    return 0;
}
```

**Overloading**: several functions can share a name if their parameter types differ. The compiler picks the one that matches the call:

```cpp
int square(int n) { return n * n; }
double square(double n) { return n * n; }

square(5);     // calls the int version: 25
square(1.5);   // calls the double version: 2.25
```

## References: another name for a variable

A **reference** (`&`) lets a function change the caller's variable directly, without pointer syntax:

```try-cpp
#include <iostream>
using namespace std;

void addBonus(int &marks, int bonus) {   // & = reference: works on the original
    marks += bonus;
}

void byValue(int marks) {                // a copy: the original doesn't change
    marks += 100;
}

int main() {
    int marks = 60;
    byValue(marks);
    cout << "After byValue: " << marks << endl;   // 60
    addBonus(marks, 5);
    cout << "After addBonus: " << marks << endl;  // 65

    int &alias = marks;                           // a reference variable
    alias = 90;
    cout << "marks is now " << marks << endl;     // 90
    return 0;
}
```

### const references: fast and safe

Passing a big object (a long string, a vector) by value copies it. Pass by `const` reference to avoid the copy and promise not to change it:

```cpp
void printReceipt(const string &customer, const vector<double> &items);
```

| Parameter style | Copies? | Can change caller's value? | Use for |
|---|---|---|---|
| `int x` | Yes | No | Small values (int, double, char) |
| `int &x` | No | **Yes** | Outputs you want to modify |
| `const string &s` | No | No | Big inputs (strings, vectors, objects) |
| `int *p` | No | Yes (via `*p`) | C-style code, optional values |

## Control flow is the same as C

`if/else`, `switch`, `for`, `while`, `do-while` work exactly as in C. C++ adds the **range-based for** (next lesson) for looping over containers.

```try-cpp
#include <iostream>
using namespace std;

int main() {
    for (int mark = 40; mark <= 90; mark += 25) {
        if (mark >= 80) cout << mark << ": A" << endl;
        else if (mark >= 50) cout << mark << ": C" << endl;
        else cout << mark << ": Fail" << endl;
    }
    return 0;
}
```

```quiz
Q: Which object prints to the screen in C++?
A: cout | std::cout
Q: Which keyword lets the compiler work out a variable's type?
A: auto
Q: Which symbol in a parameter makes it a reference?
A: & | ampersand
Q: Does a function receiving int x (by value) change the caller's variable? (yes or no)
A: no
Q: What is the best way to pass a large string you only read? (two words)
A: const reference | const string& | const &
```
