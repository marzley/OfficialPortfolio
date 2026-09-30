---
slug: inheritance-interfaces
title: Inheritance, interfaces and polymorphism
after: oop
---
# Inheritance, interfaces and polymorphism

The **OOP** lesson introduced classes and objects. Now the three ideas that make large Java systems (and Android apps) manageable: **inheritance**, **interfaces** and **polymorphism**.

## Inheritance: extends

A subclass **inherits** fields and methods from a parent class and can add or change behaviour.

```try-java
class Main {
    static class Employee {
        protected String name;
        protected double salary;

        Employee(String name, double salary) {
            this.name = name;
            this.salary = salary;
        }
        double monthlyPay() { return salary; }
        String describe() { return String.format("%s earns KSh %,.0f", name, monthlyPay()); }
    }

    static class SalesAgent extends Employee {
        private double sales;
        SalesAgent(String name, double salary, double sales) {
            super(name, salary);              // call the parent constructor first
            this.sales = sales;
        }
        @Override
        double monthlyPay() { return super.monthlyPay() + sales * 0.05; }   // add 5% commission
    }

    static class Intern extends Employee {
        Intern(String name) { super(name, 15000); }
        @Override
        String describe() { return super.describe() + " (intern)"; }
    }

    public static void main(String[] args) {
        Employee[] staff = { new Employee("Njoroge", 45000), new SalesAgent("Adhiambo", 30000, 400000), new Intern("Kevin") };
        for (Employee e : staff) System.out.println(e.describe());
    }
}
```

- `extends` creates the parent–child relationship ("a SalesAgent **is an** Employee").
- `super(...)` calls the parent constructor; `super.method()` calls the parent's version.
- `@Override` asks the compiler to check you really are overriding a parent method.
- `protected` fields are visible to subclasses.

## Polymorphism: one call, many behaviours

In the loop above, `e.describe()` runs a **different** `monthlyPay()` depending on the real object. The code that loops doesn't need to know the exact type. Adding a new employee type doesn't change that loop at all.

## Abstract classes

An **abstract** class is a partial template that can't be created directly:

```try-java
class Main {
    static abstract class Payment {
        protected double amount;
        Payment(double amount) { this.amount = amount; }
        abstract double fee();                                  // subclasses MUST implement
        double total() { return amount + fee(); }
    }
    static class MpesaPayment extends Payment {
        MpesaPayment(double a) { super(a); }
        double fee() { return 0; }
    }
    static class CardPayment extends Payment {
        CardPayment(double a) { super(a); }
        double fee() { return amount * 0.029; }
    }
    public static void main(String[] args) {
        Payment[] ps = { new MpesaPayment(2500), new CardPayment(2500) };
        for (Payment p : ps) System.out.printf("%s: KSh %.2f%n", p.getClass().getSimpleName(), p.total());
    }
}
```

## Interfaces: a contract

An **interface** lists methods a class promises to provide. A class can extend only **one** class but implement **many** interfaces.

```try-java
import java.util.List;

class Main {
    interface Notifier {
        void send(String to, String message);
        default void sendAll(List<String> recipients, String message) {   // default method
            for (String r : recipients) send(r, message);
        }
    }

    static class SmsNotifier implements Notifier {
        public void send(String to, String message) { System.out.println("SMS to " + to + ": " + message); }
    }
    static class EmailNotifier implements Notifier {
        public void send(String to, String message) { System.out.println("Email to " + to + ": " + message); }
    }

    static void remind(Notifier n) {       // works with ANY Notifier
        n.sendAll(List.of("0712345678", "0722000111"), "Fees are due on Friday.");
    }

    public static void main(String[] args) {
        remind(new SmsNotifier());
        remind(new EmailNotifier());
        Notifier whatsapp = (to, msg) -> System.out.println("WhatsApp " + to + ": " + msg);  // a lambda!
        whatsapp.send("0733111222", "Your order is ready");
    }
}
```

Interfaces with a single method (like `Notifier.send`) can be implemented with a **lambda**, which is how Android click listeners work.

## Abstract class or interface?

| Use an abstract class when... | Use an interface when... |
|---|---|
| Subclasses share code and fields | Unrelated classes share a capability ("can send", "can be printed") |
| There's a clear "is a" relationship | You want many implementations to be swappable |
| | A class needs several capabilities |

## Object methods everyone inherits

Every class secretly extends `Object`, which provides `toString()`, `equals()` and `hashCode()`. Override `toString()` to print objects nicely:

```try-java
class Main {
    static class Product {
        String name; double price;
        Product(String n, double p) { name = n; price = p; }
        @Override public String toString() { return name + " (KSh " + price + ")"; }
    }
    public static void main(String[] args) {
        System.out.println(new Product("Unga 2kg", 180));
    }
}
```

```quiz
Q: Which keyword makes one class inherit from another?
A: extends
Q: Which keyword calls the parent class constructor?
A: super | super()
Q: Which annotation checks that you are really overriding a method?
A: @Override | Override
Q: How many classes can a Java class extend?
A: 1 | one
Q: Which keyword makes a class follow an interface?
A: implements
```
