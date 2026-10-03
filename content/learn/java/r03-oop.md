---
slug: oop
title: "Classes and objects (OOP) in Java: fields, constructors, methods, encapsulation, static members, toString and designing classes"
after: KEEP
---
# Classes and objects (OOP) in Java: fields, constructors, methods, encapsulation, static members, toString and designing classes

Java is built around **object-oriented programming (OOP)**: you model real-world things as **objects** that combine **data** (fields) and **behaviour** (methods). A school system has Student, Teacher and Payment objects; a shop has Product, Cart and Order; a SACCO has Member, Account and Loan. OOP keeps large programs organised, reusable and easier to change, which is why it dominates enterprise and Android development. This unit teaches how to design and write classes properly, building up to a small realistic example.

:::note What you will learn
- Classes vs objects
- Fields (instance variables) and methods
- Constructors and the this keyword
- Creating objects with new
- Encapsulation: private fields, getters and setters, validation
- Static fields and methods
- toString, equals and hashCode basics
- Method overloading
- Objects in arrays and lists
- Designing classes for a real problem
- The four pillars of OOP (preview of inheritance and polymorphism)
:::

## Classes and objects

- A **class** is a blueprint: it defines what data and behaviour objects will have.
- An **object** is an instance created from the class, with its own values.

Blueprint: `Student` (admission number, name, form, balance). Objects: Brian (ADM001, Form 3, KSh 12,500), Faith (ADM002, Form 4, KSh 0).

## A first class

```try-java
class Main {
    static class Student {
        String admissionNo;
        String name;
        int form;
        double balance;

        void payFees(double amount) {
            balance -= amount;
        }

        void printSummary() {
            System.out.printf("%s (%s), Form %d, balance KSh %,.2f%n", name, admissionNo, form, balance);
        }
    }

    public static void main(String[] args) {
        Student s1 = new Student();
        s1.admissionNo = "ADM001";
        s1.name = "Brian";
        s1.form = 3;
        s1.balance = 12500;

        Student s2 = new Student();
        s2.admissionNo = "ADM002";
        s2.name = "Faith";
        s2.form = 4;

        s1.payFees(5000);
        s1.printSummary();
        s2.printSummary();
    }
}
```

Each object has its own copy of the fields. But setting fields directly is error-prone (someone could set `form = 9` or a negative payment). Constructors and encapsulation fix this.

## Constructors and this

A **constructor** runs when an object is created; it has the class's name and no return type.

```try-java
class Main {
    static class Product {
        private String name;
        private double price;
        private int stock;

        Product(String name, double price, int stock) {
            this.name = name;         // this.name = the field; name = the parameter
            this.price = price;
            this.stock = stock;
        }

        Product(String name, double price) {   // overloaded constructor
            this(name, price, 0);              // call the other constructor
        }

        @Override
        public String toString() {
            return name + " – KSh " + price + " (" + stock + " in stock)";
        }
    }

    public static void main(String[] args) {
        Product bag = new Product("Laptop bag", 2500, 12);
        Product mouse = new Product("Wireless mouse", 1200);
        System.out.println(bag);       // println calls toString()
        System.out.println(mouse);
    }
}
```

If you write no constructor, Java provides a default empty one.

## Encapsulation: private fields, getters and setters

**Encapsulation** hides internal data and only allows changes through methods that enforce rules.

```try-java
class Main {
    static class Account {
        private final String owner;
        private double balance;

        Account(String owner, double opening) {
            if (opening < 0) throw new IllegalArgumentException("Opening balance can't be negative");
            this.owner = owner;
            this.balance = opening;
        }

        public String getOwner() { return owner; }
        public double getBalance() { return balance; }

        public void deposit(double amount) {
            if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
            balance += amount;
        }

        public boolean withdraw(double amount) {
            if (amount <= 0 || amount > balance) return false;   // rule enforced in one place
            balance -= amount;
            return true;
        }
    }

    public static void main(String[] args) {
        Account acc = new Account("Wanjiku", 1000);
        acc.deposit(2500);
        System.out.println("Withdraw 5000: " + acc.withdraw(5000));
        System.out.println("Withdraw 1500: " + acc.withdraw(1500));
        System.out.println(acc.getOwner() + " balance: " + acc.getBalance());
        // From any other class, acc.balance = 1000000; would not compile: balance is private.
        // (Here Account is nested inside Main, and Java lets an outer class see its nested classes' private members.)
    }
}
```

| Access modifier | Visible to |
|---|---|
| `private` | Only this class |
| (none: package-private) | Classes in the same package |
| `protected` | Same package + subclasses |
| `public` | Everyone |

Rule of thumb: make fields **private**, expose only the methods others need.

## Static members

`static` fields and methods belong to the **class**, not to individual objects:

```try-java
class Main {
    static class Member {
        private static int count = 0;          // shared by all members
        private static final double SHARE_PRICE = 1000;
        private final int memberNo;
        private final String name;

        Member(String name) {
            count++;
            this.memberNo = count;
            this.name = name;
        }

        static int getCount() { return count; }
        static double sharesValue(int shares) { return shares * SHARE_PRICE; }

        @Override
        public String toString() { return "#" + memberNo + " " + name; }
    }

    public static void main(String[] args) {
        Member a = new Member("Otieno");
        Member b = new Member("Achieng");
        System.out.println(a + ", " + b);
        System.out.println("Members: " + Member.getCount());
        System.out.println("Value of 25 shares: KSh " + Member.sharesValue(25));
    }
}
```

`Math.sqrt()`, `Integer.parseInt()` and `main` itself are static.

## Method overloading

Several methods with the same name but different parameters:

```java
double fee(int form) { ... }
double fee(int form, boolean boarding) { ... }
```

Java picks the version matching the arguments.

## equals and hashCode

`==` on objects compares **references** (same object?). To compare by content, override `equals` (and `hashCode`, needed for HashMap/HashSet):

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Student other)) return false;
    return admissionNo.equals(other.admissionNo);
}
@Override
public int hashCode() { return admissionNo.hashCode(); }
```

Modern Java (16+) also offers **records** for simple data classes, which generate the constructor, getters, `equals`, `hashCode` and `toString` automatically:

```try-java
class Main {
    static record Payment(String receipt, String phone, double amount) {}

    public static void main(String[] args) {
        Payment p1 = new Payment("QJK7RT61SV", "254712345678", 1500);
        Payment p2 = new Payment("QJK7RT61SV", "254712345678", 1500);
        System.out.println(p1);
        System.out.println("Same payment? " + p1.equals(p2));
        System.out.println("Amount: " + p1.amount());
    }
}
```

## Objects in collections

```try-java
import java.util.ArrayList;
import java.util.List;

class Main {
    static class Item {
        private final String name;
        private final double price;
        private final int qty;
        Item(String name, double price, int qty) { this.name = name; this.price = price; this.qty = qty; }
        double lineTotal() { return price * qty; }
        String getName() { return name; }
    }

    static class Cart {
        private final List<Item> items = new ArrayList<>();
        void add(Item item) { items.add(item); }
        double subtotal() {
            double sum = 0;
            for (Item i : items) sum += i.lineTotal();
            return sum;
        }
        double total() {
            double sub = subtotal();
            return sub >= 5000 ? sub : sub + 250;      // free delivery over KSh 5,000
        }
        int size() { return items.size(); }
    }

    public static void main(String[] args) {
        Cart cart = new Cart();
        cart.add(new Item("Laptop bag", 2500, 1));
        cart.add(new Item("Phone charger", 800, 2));
        System.out.printf("%d items, subtotal KSh %,.0f, total KSh %,.0f%n", cart.size(), cart.subtotal(), cart.total());
    }
}
```

The `Cart` hides how items are stored and how delivery is calculated: callers just use `add` and `total`.

## Designing classes

1. **Identify nouns** in the problem (Member, Loan, Repayment) → candidate classes.
2. **Identify data** each needs (fields) and **actions** (methods): a Loan has principal, rate, term; it can calculate repayment and record a payment.
3. **Assign responsibility**: each class does one job well (single responsibility).
4. **Hide details**: private fields, public methods for what others need.
5. **Validate** in constructors and methods so objects can't get into invalid states.

## The four pillars of OOP

| Pillar | Meaning |
|---|---|
| **Encapsulation** | Bundle data with methods; hide internal details |
| **Abstraction** | Expose what an object does, not how |
| **Inheritance** | Build new classes from existing ones (`extends`) |
| **Polymorphism** | Treat different objects through a common type/interface |

Inheritance and interfaces are covered in the inheritance and interfaces lesson.

:::think Design a Loan class for a SACCO: what fields, constructor checks and methods would it have?
Fields (private): memberNo, principal, annualRate, months, balance. Constructor: validate principal > 0, rate ≥ 0, months > 0; set balance = principal (plus interest if flat-rate). Methods: monthlyInstalment(), repay(amount) (reject ≤ 0, reduce balance, record payment), isCleared(), getBalance(), toString(). Possibly a static method for the maximum loan based on savings (e.g. 3 × savings).
:::

## Summary

- A class is a blueprint; objects are instances with their own field values, created with `new`.
- Constructors initialise objects (use `this` for fields; overload and chain with `this(...)`).
- Encapsulate with private fields and public methods that validate; choose access modifiers carefully.
- Static members belong to the class; override `toString`, and `equals`/`hashCode` for content equality; records simplify data classes.
- Design classes around nouns, responsibilities and rules; OOP's pillars are encapsulation, abstraction, inheritance and polymorphism.

```quiz
Q: Which keyword creates a new object?
A: new
Q: Which keyword refers to the current object inside a method?
A: this
Q: Which access modifier hides a field from other classes?
A: private
Q: A field shared by all objects of a class is declared with which keyword?
A: static
Q: Which method does println call to display an object?
A: toString | toString()
Q: Which Java feature (16+) creates a simple immutable data class automatically?
A: record | records
```
