---
slug: introduction
title: "C++ introduction: what C++ is, where it's used, compilers, your first program, iostream, types, strings, control flow and functions"
after: KEEP
---
# C++ introduction: what C++ is, where it's used, compilers, your first program, iostream, types, strings, control flow and functions

**C++** began in the 1980s as "C with classes", created by Bjarne Stroustrup, and grew into one of the most powerful languages in the world. It keeps C's speed and low-level control, and adds classes, templates, a huge standard library (strings, vectors, maps, algorithms) and modern features that make code safer and more expressive. C++ runs game engines (Unreal), browsers (Chrome, Firefox), databases, trading systems, Adobe software, robotics, embedded systems and much of the software where performance matters. It's also the favourite language of **competitive programmers** and a common university course.

:::note What you will learn
- Why C++ and where it's used
- C++ vs C
- Compilers and setup (g++, Clang, MSVC, Code::Blocks, VS Code)
- Your first program: iostream, cout, namespaces
- Variables, types, auto and constants
- Strings with std::string
- Input with cin and getline
- Control flow: if, switch, loops (including range-based for)
- Functions, references and default arguments
- Formatting output with iomanip
- Common beginner errors
:::

## Why C++?

| Strength | Meaning |
|---|---|
| **Performance** | Compiles to fast native code; precise control over memory |
| **Abstraction without cost** | Classes and templates that compile to efficient code |
| **Standard library (STL)** | Ready-made containers (vector, map) and algorithms (sort, find) |
| **Huge reach** | Games, desktop apps, embedded, finance, scientific computing |
| **Competitive programming** | Fast execution and the STL make it the most popular contest language |

## Where C++ is used

| Area | Examples |
|---|---|
| Games | Unreal Engine, many console and PC games |
| Browsers and big apps | Chrome, Firefox, Adobe Photoshop, Microsoft Office components |
| Systems and databases | MySQL, MongoDB, parts of operating systems |
| Embedded and robotics | Arduino (C/C++), drones, automotive software |
| Finance | Low-latency trading systems |
| Science and AI | Simulations; the fast cores of machine learning libraries |

## C++ vs C

| C | C++ |
|---|---|
| Procedural (functions) | Procedural + object-oriented + generic programming |
| `printf`/`scanf` | `cout`/`cin` streams (printf still works) |
| char arrays for strings | `std::string` |
| Manual arrays and malloc | `std::vector`, smart pointers, RAII |
| Small standard library | Large STL: containers, algorithms, utilities |

Most C code compiles as C++, but modern C++ style is quite different and safer.

## Setup

| Platform | Option |
|---|---|
| Windows | MinGW-w64 (g++), Visual Studio Community (MSVC), Code::Blocks; VS Code with the C/C++ extension |
| macOS | Xcode command-line tools (Clang): `xcode-select --install` |
| Linux | `sudo apt install build-essential` (g++) |
| Online | This hub's Run button; onlinegdb.com; Compiler Explorer |

```bash
g++ -std=c++17 -Wall -Wextra hello.cpp -o hello
./hello
```

`-std=c++17` (or c++20) chooses the language version; `-Wall -Wextra` enables warnings.

## Your first program

```try-cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Habari, Kenya!" << endl;
    cout << "Learning C++ on the Marzley learning hub." << endl;
    return 0;
}
```

- `#include <iostream>`: input/output streams.
- `using namespace std;`: lets you write `cout` instead of `std::cout`. It's convenient in small programs; in larger projects, prefer writing `std::` explicitly to avoid name clashes.
- `cout << ...`: sends output to the screen; `<<` chains values.
- `endl` ends the line (`"\n"` is a faster alternative).
- `main` returns 0 for success.

## Variables and types

```try-cpp
#include <iostream>
using namespace std;

int main() {
    int students = 45;
    long long population = 53000000LL;
    double fee = 12500.75;
    char grade = 'A';
    bool paid = true;
    auto town = string("Kisumu");      // auto: the compiler infers the type
    const double VAT = 0.16;           // constant

    cout << "Students: " << students << ", population " << population << endl;
    cout << "Fee: " << fee << ", grade " << grade << ", paid " << boolalpha << paid << endl;
    cout << town << " VAT: " << VAT * 1000 << " on KSh 1000" << endl;
    cout << "int uses " << sizeof(int) << " bytes, double " << sizeof(double) << endl;
    return 0;
}
```

| Type | Use |
|---|---|
| `int`, `long long` | Whole numbers (use long long for big totals) |
| `double` | Decimals |
| `char` | One character |
| `bool` | true/false |
| `std::string` | Text |
| `auto` | Let the compiler deduce the type |

## Strings

```try-cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string first = "Wanjiku";
    string last = "Kamau";
    string full = first + " " + last;          // concatenation

    cout << full << " has " << full.length() << " characters" << endl;
    cout << "First letter: " << full[0] << endl;
    cout << "Surname starts at index " << full.find("Kamau") << endl;
    cout << "First 3 letters: " << full.substr(0, 3) << endl;

    string phone = "0712345678";
    if (phone.size() == 10 && phone[0] == '0') {
        string intl = "254" + phone.substr(1);
        cout << "M-Pesa format: " << intl << endl;
    }
    return 0;
}
```

`std::string` manages its own memory, unlike C char arrays, which avoids many bugs.

## Input

Run input examples on your own computer:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    cout << "Full name: ";
    getline(cin, name);          // reads a whole line including spaces
    cout << "Age: ";
    cin >> age;                  // reads one value
    cout << "Hello " << name << ", next year you'll be " << age + 1 << endl;
}
```

Mixing `cin >>` then `getline` needs `cin.ignore()` in between to skip the leftover newline.

## Control flow

```try-cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int mark = 72;
    if (mark >= 80) cout << "A" << endl;
    else if (mark >= 65) cout << "B" << endl;
    else if (mark >= 50) cout << "C" << endl;
    else cout << "Below C" << endl;

    int option = 2;
    switch (option) {
        case 1: cout << "Check balance" << endl; break;
        case 2: cout << "Send money" << endl; break;
        default: cout << "Invalid" << endl;
    }

    for (int i = 1; i <= 3; i++) {
        cout << "7 x " << i << " = " << 7 * i << endl;
    }

    vector<int> marks = {67, 82, 45, 90};
    int total = 0;
    for (int m : marks) {            // range-based for loop
        total += m;
    }
    cout << "Average: " << (double)total / marks.size() << endl;

    int months = 0;
    double balance = 0;
    while (balance < 50000) {
        balance = balance * 1.01 + 4500;
        months++;
    }
    cout << "Months to save 50,000: " << months << endl;
    return 0;
}
```

## Functions and references

```try-cpp
#include <iostream>
#include <string>
using namespace std;

double vat(double amount, double rate = 0.16) {      // default argument
    return amount * rate;
}

void applyPayment(double &balance, double amount) {   // & = reference: changes the caller's variable
    balance -= amount;
}

string greet(const string &name) {                    // const reference: no copy, can't modify
    return "Hello, " + name;
}

int square(int x) { return x * x; }
double square(double x) { return x * x; }              // overloading: same name, different types

int main() {
    cout << vat(1000) << " " << vat(1000, 0.08) << endl;
    double fees = 25000;
    applyPayment(fees, 7500);
    cout << "Balance: " << fees << endl;
    cout << greet("Otieno") << endl;
    cout << square(5) << " " << square(2.5) << endl;
    return 0;
}
```

A **reference** (`double &balance`) is another name for an existing variable: simpler and safer than C pointers for "change the caller's value". `const string &` passes large objects efficiently without copying.

## Formatting output

```try-cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    cout << fixed << setprecision(2);
    cout << setw(12) << "Item" << setw(10) << "Price" << endl;
    cout << setw(12) << "Laptop bag" << setw(10) << 2500.0 << endl;
    cout << setw(12) << "USB flash" << setw(10) << 900.0 << endl;
    return 0;
}
```

`setw(n)` sets the width of the next value (right-aligned by default); `fixed` with `setprecision(2)` shows two decimal places. With g++, you can also use `left` and `right` to change alignment.

## Common beginner errors

| Error | Cause |
|---|---|
| `'cout' was not declared in this scope` | Missing `#include <iostream>` or `std::` |
| `expected ';'` | Missing semicolon |
| Integer division surprises | `7 / 2` is 3; use `7.0 / 2` or a cast |
| `getline` skipped | Leftover newline after `cin >>`; use `cin.ignore()` |
| Out-of-range index | `vector` with `[]` doesn't check; use `.at(i)` while learning |

:::think What's the difference between `void addBonus(double salary)` and `void addBonus(double &salary)` when the function adds 1000 to salary?
The first receives a copy, so the caller's salary doesn't change. The second receives a reference to the caller's variable, so adding 1000 changes the original.
:::

## Summary

- C++ (Bjarne Stroustrup) adds classes, templates and a large standard library to C's speed; it powers games, browsers, databases, embedded and finance software.
- Compile with `g++ -std=c++17 -Wall`; programs use iostream with `cout`/`cin`.
- Types include int, long long, double, char, bool, std::string; `auto` infers types; `const` makes constants.
- Control flow mirrors C, plus range-based for loops over containers like vector.
- Functions support default arguments, overloading and references (`&`, `const &`); iomanip formats output.

```quiz
Q: Who created C++? (full name)
A: Bjarne Stroustrup
Q: Which object prints output in C++?
A: cout | std::cout
Q: Which header provides cout and cin?
A: iostream | <iostream>
Q: Which function reads a whole line including spaces?
A: getline
Q: What symbol in a parameter makes it a reference?
A: &
Q: Which keyword lets the compiler infer a variable's type?
A: auto
```
