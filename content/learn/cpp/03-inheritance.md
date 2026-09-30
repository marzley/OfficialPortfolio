---
slug: inheritance-polymorphism
title: Inheritance, virtual functions and polymorphism
after: classes
---
# Inheritance, virtual functions and polymorphism

The *Classes* lesson showed how to bundle data and functions. Now we'll build class **families**: a base class with shared behaviour and derived classes that specialise it, all used through one common interface.

## Inheritance

```try-cpp
#include <iostream>
#include <string>
using namespace std;

class Employee {
protected:                       // visible to derived classes
    string name;
    double salary;
public:
    Employee(string n, double s) : name(n), salary(s) {}     // initialiser list
    virtual double monthlyPay() const { return salary; }     // virtual: can be overridden
    virtual ~Employee() {}                                   // virtual destructor for base classes
    void describe() const { cout << name << " earns KSh " << monthlyPay() << endl; }
};

class SalesAgent : public Employee {
    double sales;
public:
    SalesAgent(string n, double s, double sales) : Employee(n, s), sales(sales) {}
    double monthlyPay() const override { return salary + sales * 0.05; }
};

class Intern : public Employee {
public:
    Intern(string n) : Employee(n, 15000) {}
};

int main() {
    Employee e("Njoroge", 45000);
    SalesAgent a("Adhiambo", 30000, 400000);
    Intern i("Kevin");
    e.describe();
    a.describe();
    i.describe();
    return 0;
}
```

- `class SalesAgent : public Employee` means "a SalesAgent **is an** Employee".
- The constructor calls the base constructor in its **initialiser list**: `: Employee(n, s)`.
- `protected` members are visible to derived classes but not outside.

## virtual and override: runtime polymorphism

`describe()` calls `monthlyPay()`. Because `monthlyPay` is **virtual**, C++ calls the version of the **actual object** at runtime, so the sales agent's commission is included even though `describe` lives in `Employee`.

- `override` asks the compiler to confirm you're really overriding a virtual function (it catches typos).
- A base class with virtual functions should have a **virtual destructor**, so deleting through a base pointer cleans up correctly.

## Using the family through base pointers

```try-cpp
#include <iostream>
#include <vector>
#include <memory>
#include <cmath>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;      // pure virtual: Shape is abstract
    virtual string name() const = 0;
    virtual ~Shape() = default;
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

class Circle : public Shape {
    double r;
public:
    explicit Circle(double r) : r(r) {}
    double area() const override { return M_PI * r * r; }
    string name() const override { return "Circle"; }
};

int main() {
    vector<unique_ptr<Shape>> plot;                  // smart pointers free memory automatically
    plot.push_back(make_unique<Rectangle>(20, 15));
    plot.push_back(make_unique<Circle>(4));
    double total = 0;
    for (const auto &s : plot) {
        cout << s->name() << ": " << s->area() << " m2" << endl;
        total += s->area();
    }
    cout << "Total area: " << total << " m2" << endl;
    return 0;
}
```

- `= 0` makes a **pure virtual** function; a class with one is **abstract** (can't be created directly).
- `unique_ptr` (from `<memory>`) owns an object and deletes it automatically: no manual `delete`, no leaks. Prefer smart pointers over raw `new`/`delete` in modern C++.

## Access levels in inheritance

| Base member | Accessible in derived class? | Accessible outside? |
|---|---|---|
| `public` | Yes | Yes |
| `protected` | Yes | No |
| `private` | No | No |

## Composition: "has a" vs "is a"

Inheritance models **is a** (a Circle *is a* Shape). Many designs are better with **composition**, **has a**: a `Car` *has an* `Engine` member rather than inheriting from `Engine`. A good rule: prefer composition unless there's a true "is a" relationship.

## The rule of zero

If your class only uses members that manage themselves (`string`, `vector`, smart pointers), you don't need to write a destructor, copy constructor or assignment operator at all: the compiler's versions are correct. That's the modern C++ "rule of zero".

```quiz
Q: Which keyword lets a derived class replace a base class function at runtime?
A: virtual
Q: Which keyword asks the compiler to check that you are overriding a virtual function?
A: override
Q: What does = 0 after a virtual function make it? (two words)
A: pure virtual | pure virtual function
Q: Which smart pointer owns an object and deletes it automatically?
A: unique_ptr | std::unique_ptr
Q: Should a base class with virtual functions have a virtual destructor? (yes or no)
A: yes
```
