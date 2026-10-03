---
slug: classes
title: "Classes and objects in C++: members, constructors, access control, const methods, operator overloading, RAII and smart pointers"
after: KEEP
---
# Classes and objects in C++: members, constructors, access control, const methods, operator overloading, RAII and smart pointers

Classes let you model real things (a bank account, a product, a player in a game, a sensor) as types that combine **data** and **behaviour**, with rules that keep the data valid. C++ classes are also how the language manages resources safely: memory, files and network connections are acquired in constructors and released automatically in destructors (a technique called **RAII**). This unit covers classes from first principles to the modern practices professional C++ developers use.

:::note What you will learn
- Defining classes: data members and member functions
- public and private access; encapsulation
- Constructors, initialiser lists and default values
- Destructors and object lifetime
- const member functions
- Static members
- Operator overloading (e.g. <<, +, ==)
- Splitting classes into header and source files
- RAII: automatic resource management
- Smart pointers: unique_ptr and shared_ptr
- Structs vs classes
:::

## A first class

```try-cpp
#include <iostream>
#include <string>
using namespace std;

class Account {
private:
    string owner;
    double balance;

public:
    Account(string o, double opening) : owner(o), balance(opening) {}   // constructor with initialiser list

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    bool withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }

    double getBalance() const { return balance; }      // const: doesn't change the object
    string getOwner() const { return owner; }
};

int main() {
    Account acc("Wanjiku", 1000);
    acc.deposit(2500);
    cout << "Withdraw 5000: " << (acc.withdraw(5000) ? "OK" : "declined") << endl;
    cout << "Withdraw 1500: " << (acc.withdraw(1500) ? "OK" : "declined") << endl;
    cout << acc.getOwner() << " balance: " << acc.getBalance() << endl;
    // acc.balance = 1000000;   // error: 'balance' is private
    return 0;
}
```

- **Data members** (`owner`, `balance`) store state; **member functions** define behaviour.
- `private` members are hidden; `public` members form the class's interface.
- Encapsulation guarantees the rules (no negative deposits, no overdrafts) can't be bypassed.
- Classes end with `};` (a common forgotten semicolon).

## Constructors

```try-cpp
#include <iostream>
#include <string>
using namespace std;

class Product {
    string name;
    double price;
    int stock;
public:
    Product() : name("Unnamed"), price(0), stock(0) {}                    // default constructor
    Product(string n, double p, int s = 0) : name(n), price(p), stock(s) {
        if (price < 0) price = 0;                                         // validate
    }
    void print() const {
        cout << name << " - KSh " << price << " (" << stock << " in stock)" << endl;
    }
};

int main() {
    Product a;
    Product b("Laptop bag", 2500, 12);
    Product c("Mouse", 1200);            // stock uses the default 0
    a.print();
    b.print();
    c.print();
    return 0;
}
```

**Initialiser lists** (`: name(n), price(p)`) initialise members directly: more efficient, and required for `const` and reference members.

## Destructors and lifetime

A **destructor** (`~ClassName()`) runs automatically when an object is destroyed, for example when it goes out of scope:

```try-cpp
#include <iostream>
#include <string>
using namespace std;

class Session {
    string user;
public:
    Session(string u) : user(u) { cout << "Login: " << user << endl; }
    ~Session() { cout << "Logout: " << user << endl; }
};

int main() {
    Session admin("admin");
    {
        Session teacher("teacher");
        cout << "Inside block" << endl;
    }                                   // teacher's destructor runs here
    cout << "Back in main" << endl;
    return 0;                           // admin's destructor runs here
}
```

This predictable cleanup is the basis of **RAII**.

## Static members

```try-cpp
#include <iostream>
#include <string>
using namespace std;

class Member {
    static int count;          // shared by all Member objects
    int number;
    string name;
public:
    Member(string n) : name(n) { number = ++count; }
    static int total() { return count; }
    void show() const { cout << "#" << number << " " << name << endl; }
};

int Member::count = 0;         // define the static member once

int main() {
    Member a("Otieno"), b("Achieng"), c("Juma");
    a.show(); b.show(); c.show();
    cout << "Members: " << Member::total() << endl;
    return 0;
}
```

## Operator overloading

Make your types work naturally with operators:

```try-cpp
#include <iostream>
using namespace std;

class Money {
    long long cents;                          // store money as whole cents to avoid rounding errors
public:
    Money(long long c = 0) : cents(c) {}
    static Money ksh(double amount) { return Money((long long)(amount * 100 + 0.5)); }
    Money operator+(const Money &other) const { return Money(cents + other.cents); }
    bool operator==(const Money &other) const { return cents == other.cents; }
    friend ostream &operator<<(ostream &out, const Money &m) {
        out << "KSh " << m.cents / 100 << "." << (m.cents % 100 < 10 ? "0" : "") << m.cents % 100;
        return out;
    }
};

int main() {
    Money a = Money::ksh(1500.50);
    Money b = Money::ksh(249.75);
    Money total = a + b;
    cout << a << " + " << b << " = " << total << endl;
    cout << (total == Money::ksh(1750.25) ? "Totals match" : "Mismatch") << endl;
    return 0;
}
```

Overload operators only when the meaning is obvious (adding money makes sense; adding two students doesn't).

## Header and source files

Professional projects split classes:

```cpp
// account.h
#pragma once
#include <string>
class Account {
    std::string owner;
    double balance;
public:
    Account(std::string owner, double opening);
    void deposit(double amount);
    double getBalance() const;
};
```

```cpp
// account.cpp
#include "account.h"
Account::Account(std::string o, double opening) : owner(o), balance(opening) {}
void Account::deposit(double amount) { if (amount > 0) balance += amount; }
double Account::getBalance() const { return balance; }
```

```bash
g++ -std=c++17 main.cpp account.cpp -o bank
```

`Account::deposit` means "the deposit function belonging to Account"; `#pragma once` prevents double inclusion. In headers, write `std::` rather than `using namespace std;`.

## RAII and smart pointers

In C, you must remember to `free` memory and `fclose` files. In modern C++, objects **own** resources and release them in their destructors, automatically, even if an error occurs. Standard library types (`string`, `vector`, `ifstream`) already work this way.

For dynamically allocated objects, use **smart pointers** instead of raw `new`/`delete`:

```try-cpp
#include <iostream>
#include <memory>
#include <string>
using namespace std;

class Report {
    string title;
public:
    Report(string t) : title(t) { cout << "Created " << title << endl; }
    ~Report() { cout << "Deleted " << title << endl; }
    void print() const { cout << "Report: " << title << endl; }
};

int main() {
    unique_ptr<Report> r = make_unique<Report>("September sales");   // single owner
    r->print();

    shared_ptr<Report> s1 = make_shared<Report>("Fees summary");       // shared ownership
    {
        shared_ptr<Report> s2 = s1;
        cout << "Owners: " << s1.use_count() << endl;
    }
    cout << "Owners now: " << s1.use_count() << endl;
    return 0;                       // both reports deleted automatically
}
```

| Smart pointer | Ownership |
|---|---|
| `unique_ptr` | Exactly one owner; cannot be copied (can be moved) |
| `shared_ptr` | Shared; the object is deleted when the last owner goes away |
| `weak_ptr` | Observes a shared_ptr without owning (breaks cycles) |

Rule: avoid raw `new` and `delete` in application code.

## struct vs class

In C++, `struct` and `class` are almost identical; the only difference is the default access: `struct` members are **public** by default, `class` members **private**. Convention: use `struct` for simple data bundles, `class` for types with rules and behaviour.

```cpp
struct Point { double lat; double lon; };
```

:::think Design a C++ class for a matatu: what private data, constructor checks and public methods would it have?
Private: plate number, capacity, passengers on board, route, fare. Constructor: validate capacity > 0 and fare ≥ 0. Public methods: board(n) (reject if it would exceed capacity), alight(n), fareCollected() const, isFull() const, getPlate() const, and an overloaded << to print a summary. Use const methods for anything that doesn't change the object.
:::

## Summary

- Classes combine private data with public member functions; encapsulation enforces rules.
- Constructors (with initialiser lists) set up objects; destructors clean up automatically when objects go out of scope.
- Mark non-modifying methods `const`; static members are shared across objects; overload operators when meaning is clear.
- Split classes into .h and .cpp files with `ClassName::method` definitions.
- RAII and smart pointers (unique_ptr, shared_ptr) manage resources automatically; avoid raw new/delete; struct = public by default.

```quiz
Q: What is the default access for class members in C++?
A: private
Q: What is the special function called that runs when an object is destroyed?
A: destructor
Q: Which smart pointer allows exactly one owner?
A: unique_ptr | std::unique_ptr
Q: What do you call managing resources through object lifetime (acquire in constructor, release in destructor)? (abbreviation)
A: RAII
Q: Which keyword after a member function says it won't modify the object?
A: const
Q: What is the default access for struct members?
A: public
```
