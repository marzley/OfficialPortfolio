---
slug: oop-inheritance-interfaces
title: Classes, inheritance and interfaces in C#
after: classes-linq
---
# Classes, inheritance and interfaces in C#

C# is object-oriented at its core. This lesson covers properties, constructors, inheritance, abstract classes, interfaces and exceptions: the building blocks of ASP.NET APIs, desktop apps and Unity games.

## A class with properties and validation

```try-csharp
using System;

class BankAccount
{
    public string Owner { get; }                 // read-only after construction
    public decimal Balance { get; private set; } // readable outside, changeable only inside

    public BankAccount(string owner, decimal opening)
    {
        if (opening < 500m) throw new ArgumentException("Minimum opening deposit is KSh 500");
        Owner = owner;
        Balance = opening;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Deposit must be positive");
        Balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount > Balance) throw new InvalidOperationException("Insufficient funds");
        Balance -= amount;
    }

    public override string ToString() => $"{Owner}: KSh {Balance:N2}";
}

class Program
{
    static void Main()
    {
        var acc = new BankAccount("Faith", 2000m);
        acc.Deposit(3500m);
        acc.Withdraw(1200m);
        Console.WriteLine(acc);
        try
        {
            acc.Withdraw(100000m);
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine("Refused: " + ex.Message);
        }
    }
}
```

- **Properties** (`Balance { get; private set; }`) control access better than public fields.
- `=>` defines a one-line method (**expression-bodied member**).
- Overriding `ToString()` controls how the object prints.

## Inheritance and polymorphism

```try-csharp
using System;
using System.Collections.Generic;

abstract class Payment
{
    public decimal Amount { get; }
    protected Payment(decimal amount) { Amount = amount; }
    public abstract decimal Fee();                            // each type must define it
    public decimal Total() => Amount + Fee();
    public virtual string Describe() => $"{GetType().Name}: KSh {Total():N2}";
}

class MpesaPayment : Payment
{
    public string Phone { get; }
    public MpesaPayment(decimal amount, string phone) : base(amount) { Phone = phone; }
    public override decimal Fee() => 0m;
    public override string Describe() => base.Describe() + $" from {Phone}";
}

class CardPayment : Payment
{
    public CardPayment(decimal amount) : base(amount) { }
    public override decimal Fee() => Math.Round(Amount * 0.029m, 2);
}

class Program
{
    static void Main()
    {
        var payments = new List<Payment> { new MpesaPayment(2500m, "0712345678"), new CardPayment(2500m) };
        foreach (Payment p in payments)
            Console.WriteLine(p.Describe());
    }
}
```

| Keyword | Meaning |
|---|---|
| `: Payment` | Inherit from Payment |
| `base(amount)` | Call the parent constructor |
| `abstract` | Must be implemented by subclasses; the class can't be created directly |
| `virtual` | May be overridden |
| `override` | Replaces a virtual/abstract member |
| `protected` | Visible to subclasses |

## Interfaces

```try-csharp
using System;
using System.Collections.Generic;

interface INotifier
{
    void Send(string to, string message);
}

class SmsNotifier : INotifier
{
    public void Send(string to, string message) => Console.WriteLine($"SMS to {to}: {message}");
}

class EmailNotifier : INotifier
{
    public void Send(string to, string message) => Console.WriteLine($"Email to {to}: {message}");
}

class ReminderService
{
    private readonly INotifier _notifier;
    public ReminderService(INotifier notifier) { _notifier = notifier; }   // depends on the interface
    public void RemindAll(IEnumerable<string> contacts)
    {
        foreach (string c in contacts) _notifier.Send(c, "Your fees are due on Friday.");
    }
}

class Program
{
    static void Main()
    {
        new ReminderService(new SmsNotifier()).RemindAll(new[] { "0712345678", "0722000111" });
        new ReminderService(new EmailNotifier()).RemindAll(new[] { "parent@example.com" });
    }
}
```

Interface names start with **I** by convention. Passing the notifier into the constructor is called **dependency injection**, and ASP.NET Core is built around it.

## Records: quick data classes

```csharp
public record Product(string Name, decimal Price);

var p = new Product("Unga", 180m);
var cheaper = p with { Price = 170m };   // copy with a change
Console.WriteLine(p == new Product("Unga", 180m));   // True: compared by value
```

## Exceptions summary

- `throw new ArgumentException("...")` for bad input; `InvalidOperationException` when an action isn't allowed now.
- `try { } catch (SpecificException ex) { } finally { }`
- Catch specific exceptions; never swallow them silently.

```quiz
Q: Which keyword lets a subclass replace a virtual method?
A: override
Q: How do you call the parent constructor in C#? Write the keyword.
A: base | base()
Q: By convention, what letter do C# interface names start with?
A: I
Q: Which property style lets code read Balance but only the class change it? Write the accessor part.
A: private set | { get; private set; } | get; private set;
Q: Passing an interface into a constructor instead of creating the object inside is called what? (two words)
A: dependency injection
```
