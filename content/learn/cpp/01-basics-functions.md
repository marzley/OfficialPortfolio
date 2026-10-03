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

## Why C++ is worth learning

C++ powers game engines (Unreal Engine), browsers (Chrome, Firefox), databases, trading systems, embedded devices, graphics software and competitive programming. It combines C's speed and low-level control with higher-level features like classes, templates and the Standard Library. Many engineering and computer science students learn it, and it's the most popular language in programming competitions.

## Strings in C++ are much easier than in C

```try-cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string first = "Achieng";
    string last = "Odhiambo";
    string full = first + " " + last;          // no buffer sizes to worry about
    cout << full << " has " << full.length() << " characters" << endl;
    cout << "First letter: " << full[0] << endl;
    cout << "Surname starts at index " << full.find(" ") + 1 << endl;
    cout << "Surname: " << full.substr(full.find(" ") + 1) << endl;
    full += " (Kisumu)";
    cout << full << endl;
    if (first == "Achieng") cout << "Names compare with == in C++" << endl;
    return 0;
}
```

`std::string` grows automatically and supports `+`, `==`, `find`, `substr` and more, removing most of C's string dangers.

## Default parameters and overloading

```try-cpp
#include <iostream>
#include <string>
using namespace std;

double withVat(double amount, double rate = 0.16) {
    return amount * (1 + rate);
}

void describe(int qty) { cout << qty << " items" << endl; }
void describe(double kg) { cout << kg << " kg" << endl; }
void describe(string name) { cout << "Product: " << name << endl; }

int main() {
    cout << withVat(1000) << endl;          // uses the default 16%
    cout << withVat(1000, 0.08) << endl;
    describe(5);                            // calls the int version
    describe(2.5);                          // calls the double version
    describe(string("Unga"));               // calls the string version
    return 0;
}
```

## Passing by value, reference and const reference

```try-cpp
#include <iostream>
#include <string>
using namespace std;

void addBonusCopy(int marks) { marks += 5; }            // changes a copy only
void addBonusRef(int &marks) { marks += 5; }            // changes the caller's variable
int countVowels(const string &text) {                   // read-only, no copy made
    int n = 0;
    for (char c : text) {
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') n++;
    }
    return n;
}

int main() {
    int m = 60;
    addBonusCopy(m);
    cout << "After copy: " << m << endl;
    addBonusRef(m);
    cout << "After reference: " << m << endl;
    cout << "Vowels: " << countVowels("habari ya asubuhi") << endl;
    return 0;
}
```

| Parameter style | Use when |
|---|---|
| `int x` (by value) | Small types you don't need to change |
| `int &x` (reference) | The function must change the caller's variable |
| `const string &s` | Large objects you only read (avoids copying) |

## Range-based for loops and vectors (preview)

```try-cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> marks = {67, 82, 45, 90, 58};
    marks.push_back(73);

    int total = 0;
    for (int m : marks) total += m;
    cout << "Count " << marks.size() << ", average " << (double) total / marks.size() << endl;

    for (int &m : marks) m += 2;      // reference: change each element
    for (int m : marks) cout << m << " ";
    cout << endl;
    return 0;
}
```

`vector` is a resizable array; you'll use it more than raw arrays in C++.

## Reading input robustly

```cpp
#include <iostream>
#include <limits>
using namespace std;

int main() {
    int qty;
    cout << "Quantity: ";
    while (!(cin >> qty) || qty <= 0) {
        cin.clear();                                          // clear the error state
        cin.ignore(numeric_limits<streamsize>::max(), '\n');  // discard the bad input
        cout << "Please enter a positive whole number: ";
    }
    string name;
    cin.ignore();                         // drop the leftover newline before getline
    cout << "Customer name: ";
    getline(cin, name);                   // reads a full name with spaces
    cout << name << " ordered " << qty << endl;
}
```

`getline` reads names with spaces, unlike `cin >> name`, which stops at the first space.

## Namespaces

`using namespace std;` is convenient in small programs and exercises. In larger projects, prefer `std::cout`, `std::string` or specific `using std::cout;` declarations, to avoid name clashes between libraries.

## Compiling C++

```bash
g++ -std=c++20 -Wall -Wextra -O2 -o shop shop.cpp
./shop
```

Choose a modern standard (C++17 or C++20) to get useful features, and keep warnings on.

## Practice

1. Ask for a full name with `getline` and print the initials.
2. Write overloaded `area` functions for a square (one side) and a rectangle (two sides).
3. Write `void applyDiscount(double &price, double percent = 10)` and test it.
4. Store 6 prices in a vector, add VAT to each with a reference loop, and print the total.
5. Write a function that counts words in a `const string &` sentence.

:::think Why is `void print(const std::string &s)` preferred over `void print(std::string s)` for long strings?
Passing by value copies the whole string every call, which costs time and memory for long text. A const reference passes the original without copying, and `const` guarantees the function can't modify it, giving both efficiency and safety.
:::

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
Q: Which function reads a full line including spaces into a string?
A: getline
Q: Which container is C++'s resizable array?
A: vector
Q: What feature lets a parameter have a value used when the argument is left out? (two words)
A: default parameter | default argument | default parameters
```
