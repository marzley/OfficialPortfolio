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

## Where inheritance and polymorphism are used

Object-oriented design organises large programs: game engines have a base `Entity` with players, enemies and items deriving from it; GUI frameworks have widgets (buttons, text boxes) sharing a base class; payment systems treat card, mobile money and bank transfers through one interface. Understanding inheritance, virtual functions and when to prefer composition helps you read and design professional C++ code.

## A payment hierarchy

```try-cpp
#include <iostream>
#include <string>
using namespace std;

class Payment {
public:
    Payment(double amount) : amount(amount) {}
    virtual ~Payment() {}
    virtual string method() const = 0;            // pure virtual: must be implemented
    virtual double fee() const { return 0; }      // default behaviour
    double total() const { return amount + fee(); }
    void receipt() const {
        cout << method() << ": KSh " << amount << " + fee " << fee() << " = " << total() << endl;
    }
protected:
    double amount;
};

class MpesaPayment : public Payment {
public:
    MpesaPayment(double amount, string phone) : Payment(amount), phone(phone) {}
    string method() const override { return "M-Pesa (" + phone + ")"; }
private:
    string phone;
};

class CardPayment : public Payment {
public:
    CardPayment(double amount) : Payment(amount) {}
    string method() const override { return "Card"; }
    double fee() const override { return amount * 0.03; }
};

int main() {
    MpesaPayment m(1500, "0712345678");
    CardPayment c(2000);
    Payment *payments[2];
    payments[0] = &m;
    payments[1] = &c;
    for (int i = 0; i < 2; i++) payments[i]->receipt();
    return 0;
}
```

`receipt()` is written once in the base class but calls the correct `method()` and `fee()` for each derived class at runtime. That's **polymorphism**.

## Constructors and destructors in inheritance

```try-cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "Base constructed" << endl; }
    virtual ~Base() { cout << "Base destroyed" << endl; }
};

class Derived : public Base {
public:
    Derived() { cout << "Derived constructed" << endl; }
    ~Derived() override { cout << "Derived destroyed" << endl; }
};

int main() {
    Base *p = new Derived();
    delete p;          // with a virtual destructor, both destructors run
    return 0;
}
```

Base parts are built first and destroyed last. Without `virtual` on the base destructor, deleting through a `Base*` would skip the derived destructor and leak resources.

## Smart pointers and polymorphic containers

```cpp
#include <iostream>
#include <memory>
#include <vector>

int main() {
    std::vector<std::unique_ptr<Payment>> payments;
    payments.push_back(std::make_unique<MpesaPayment>(1500, "0712345678"));
    payments.push_back(std::make_unique<CardPayment>(2000));
    for (const auto &p : payments) p->receipt();
}   // all payments deleted automatically here
```

`std::unique_ptr` owns the object and deletes it automatically; no manual `delete`, no leaks. `std::shared_ptr` is for shared ownership (use only when needed).

## Composition: building from parts

Prefer "has a" relationships when one class isn't truly a kind of another:

```try-cpp
#include <iostream>
#include <string>
using namespace std;

class Address {
public:
    Address(string town, string street) : town(town), street(street) {}
    string label() const { return street + ", " + town; }
private:
    string town;
    string street;
};

class Customer {
public:
    Customer(string name, Address address) : name(name), address(address) {}
    void print() const { cout << name << " - " << address.label() << endl; }
private:
    string name;
    Address address;          // a Customer HAS an Address
};

int main() {
    Customer c("Kamau Hardware", Address("Nakuru", "Kenyatta Avenue"));
    c.print();
    return 0;
}
```

A `Customer` isn't a kind of `Address`, so inheriting would be wrong; containing one is natural and flexible.

## Interfaces in C++

C++ has no `interface` keyword; an **abstract class with only pure virtual functions** plays that role:

```cpp
class Notifier {
public:
    virtual ~Notifier() = default;
    virtual bool send(const std::string &to, const std::string &message) = 0;
};

class SmsNotifier : public Notifier {
public:
    bool send(const std::string &to, const std::string &message) override {
        std::cout << "SMS to " << to << ": " << message << "\n";
        return true;
    }
};
```

Code that depends on `Notifier&` works with SMS, email or a fake notifier used in tests.

## Common inheritance mistakes

| Mistake | Problem | Fix |
|---|---|---|
| No virtual destructor in a polymorphic base | Derived destructors skipped | `virtual ~Base() = default;` |
| Forgetting `override` | Typos create a new function instead of overriding | Always write `override` |
| Storing derived objects by value in `vector<Base>` | **Slicing**: derived parts are cut off | Store pointers/smart pointers |
| Deep inheritance trees | Hard to understand and change | Prefer composition, keep hierarchies shallow |
| Making everything `public` | No encapsulation | `private` data, `protected` only when needed |

## Practice

1. Create `Shape` with pure virtual `area()` and `name()`, then `Circle`, `Rectangle` and `Triangle`.
2. Store mixed shapes in an array of base pointers and print each area.
3. Add a virtual destructor and print messages to see the order of destruction.
4. Model `Car` with an `Engine` member (composition) rather than inheriting from `Engine`.
5. Rewrite the payment example using `std::vector<std::unique_ptr<Payment>>`.

:::think What is object slicing, and how does `std::vector<Payment>` cause it if you push an `MpesaPayment`?
A `vector<Payment>` stores actual `Payment` objects. Pushing an `MpesaPayment` copies only the `Payment` part into the vector, cutting off the phone field and the derived behaviour, so virtual calls use the base versions. Store pointers (preferably `unique_ptr<Payment>`) to keep the full derived objects.
:::

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
Q: What is it called when a derived object is copied into a base object and loses its derived parts?
A: slicing | object slicing
Q: Which smart pointer should usually own polymorphic objects in a vector?
A: unique_ptr | std::unique_ptr
Q: Is "a Customer has an Address" inheritance or composition?
A: composition
```
