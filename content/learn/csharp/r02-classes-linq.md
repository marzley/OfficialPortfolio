---
slug: classes-linq
title: "Classes and LINQ in C#: properties, constructors, records, inheritance, interfaces, collections and querying data with LINQ"
after: KEEP
---
# Classes and LINQ in C#: properties, constructors, records, inheritance, interfaces, collections and querying data with LINQ

C# is object-oriented: you build applications from **classes** that model your domain (students, products, orders, payments) and **interfaces** that define contracts. C# adds very productive features on top: **properties**, **records** for data, and **LINQ** (Language Integrated Query), which lets you filter, sort, group and summarise collections with clear, SQL-like code. LINQ is one of the most loved C# features and is used constantly in ASP.NET, data processing and reporting code.

:::note What you will learn
- Classes, fields, properties and constructors
- Auto-properties, init-only properties and validation
- Records for data objects
- Static members
- Inheritance, virtual/override and abstract classes
- Interfaces and polymorphism
- Collections: List<T>, Dictionary<TKey, TValue>
- LINQ: Where, Select, OrderBy, GroupBy, Sum, Average, Any, First...
- Query syntax vs method syntax
- A worked sales report with LINQ
:::

## Classes and properties

```try-csharp
using System;

class Account
{
    public string Owner { get; }                  // read-only auto-property (set in constructor)
    public decimal Balance { get; private set; }  // anyone can read, only this class can change

    public Account(string owner, decimal opening)
    {
        if (opening < 0) throw new ArgumentException("Opening balance can't be negative");
        Owner = owner;
        Balance = opening;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Deposit must be positive");
        Balance += amount;
    }

    public bool Withdraw(decimal amount)
    {
        if (amount <= 0 || amount > Balance) return false;
        Balance -= amount;
        return true;
    }

    public override string ToString() => $"{Owner}: KSh {Balance:N2}";
}

class Program
{
    static void Main()
    {
        var acc = new Account("Wanjiku", 1000m);
        acc.Deposit(2500m);
        Console.WriteLine($"Withdraw 5000: {acc.Withdraw(5000m)}");
        Console.WriteLine($"Withdraw 1500: {acc.Withdraw(1500m)}");
        Console.WriteLine(acc);
        // acc.Balance = 1_000_000m;   // compile error: the setter is private
    }
}
```

**Properties** look like fields but run code (get/set), so you can validate and control access. Use them instead of public fields.

## Object initialisers and init-only properties

```try-csharp
using System;

class Product
{
    public string Name { get; init; } = "";
    public string Category { get; init; } = "";
    public decimal Price { get; init; }
    public int Stock { get; set; }
}

class Program
{
    static void Main()
    {
        var bag = new Product { Name = "Laptop bag", Category = "Accessories", Price = 2500m, Stock = 12 };
        bag.Stock -= 2;                       // allowed: Stock has set
        // bag.Price = 100m;                  // error: init-only after creation
        Console.WriteLine($"{bag.Name} ({bag.Category}) KSh {bag.Price:N0}, stock {bag.Stock}");
    }
}
```

## Records

**Records** are concise types for data, with value-based equality and a readable ToString:

```try-csharp
using System;

record Payment(string Receipt, string Phone, decimal Amount);

class Program
{
    static void Main()
    {
        var p1 = new Payment("QJK7RT61SV", "254712345678", 1500m);
        var p2 = new Payment("QJK7RT61SV", "254712345678", 1500m);
        Console.WriteLine(p1);
        Console.WriteLine($"Same payment? {p1 == p2}");    // true: compares values
        var corrected = p1 with { Amount = 1550m };       // copy with a change
        Console.WriteLine(corrected);
    }
}
```

## Inheritance and polymorphism

```try-csharp
using System;
using System.Collections.Generic;

abstract class Employee
{
    public string Name { get; }
    protected Employee(string name) => Name = name;
    public abstract decimal MonthlyPay();                         // must be implemented
    public virtual string Describe() => $"{Name}: KSh {MonthlyPay():N0}";
}

class Salaried : Employee
{
    private readonly decimal salary;
    public Salaried(string name, decimal salary) : base(name) => this.salary = salary;
    public override decimal MonthlyPay() => salary;
}

class SalesAgent : Employee
{
    private readonly decimal basePay, sales;
    public SalesAgent(string name, decimal basePay, decimal sales) : base(name)
    {
        this.basePay = basePay;
        this.sales = sales;
    }
    public override decimal MonthlyPay() => basePay + sales * 0.05m;
    public override string Describe() => base.Describe() + " (incl. commission)";
}

class Program
{
    static void Main()
    {
        var staff = new List<Employee>
        {
            new Salaried("Achieng", 65000m),
            new SalesAgent("Kamau", 30000m, 800000m)
        };
        foreach (var e in staff) Console.WriteLine(e.Describe());   // each type's own version runs
    }
}
```

- `abstract` classes can't be created directly and may have abstract members subclasses must implement.
- `virtual` members can be overridden with `override`; `base` calls the parent's version.
- **Polymorphism**: code works with `Employee` while each object behaves according to its real type.

## Interfaces

An **interface** is a contract: any class implementing it promises to provide those members.

```try-csharp
using System;
using System.Collections.Generic;

interface IPaymentMethod
{
    string Name { get; }
    bool Pay(decimal amount);
}

class MpesaPayment : IPaymentMethod
{
    public string Name => "M-Pesa";
    public bool Pay(decimal amount) { Console.WriteLine($"STK push sent for KSh {amount:N0}"); return true; }
}

class CashPayment : IPaymentMethod
{
    public string Name => "Cash";
    public bool Pay(decimal amount) { Console.WriteLine($"Collect KSh {amount:N0} at the counter"); return true; }
}

class Program
{
    static void Checkout(IPaymentMethod method, decimal total)
    {
        Console.WriteLine($"Paying with {method.Name}...");
        method.Pay(total);
    }

    static void Main()
    {
        var methods = new List<IPaymentMethod> { new MpesaPayment(), new CashPayment() };
        foreach (var m in methods) Checkout(m, 4250m);
    }
}
```

Interfaces make code flexible and testable (you can swap a real payment provider for a fake one in tests). ASP.NET Core relies on them heavily through **dependency injection**.

## Collections

```try-csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var towns = new List<string> { "Nairobi", "Mombasa" };
        towns.Add("Kisumu");
        towns.Remove("Mombasa");
        Console.WriteLine(string.Join(", ", towns) + $" ({towns.Count})");

        var stock = new Dictionary<string, int> { ["unga"] = 40, ["sugar"] = 25 };
        stock["unga"] -= 5;
        stock["rice"] = 30;
        if (stock.TryGetValue("salt", out int salt)) Console.WriteLine(salt);
        else Console.WriteLine("No salt in stock list");
        foreach (var (item, qty) in stock) Console.WriteLine($"{item}: {qty}");
    }
}
```

| Collection | Use |
|---|---|
| `List<T>` | Ordered, growable list |
| `Dictionary<TKey, TValue>` | Fast lookup by key |
| `HashSet<T>` | Unique values, fast membership |
| `Queue<T>` / `Stack<T>` | FIFO / LIFO |

## LINQ: querying collections

LINQ adds query methods to any collection:

```try-csharp
using System;
using System.Linq;
using System.Collections.Generic;

record Sale(string Branch, string Product, int Qty, decimal Price, DateTime Date)
{
    public decimal Total => Qty * Price;
}

class Program
{
    static void Main()
    {
        var sales = new List<Sale>
        {
            new("Nairobi", "Charger", 3, 800m, new DateTime(2026, 9, 1)),
            new("Mombasa", "Speaker", 1, 3500m, new DateTime(2026, 9, 2)),
            new("Nairobi", "Mouse", 2, 1200m, new DateTime(2026, 9, 2)),
            new("Kisumu", "Charger", 5, 800m, new DateTime(2026, 9, 3)),
            new("Mombasa", "Mouse", 1, 1200m, new DateTime(2026, 9, 4)),
        };

        decimal revenue = sales.Sum(s => s.Total);
        Console.WriteLine($"Total revenue: KSh {revenue:N0}");

        var bigSales = sales.Where(s => s.Total >= 2400m).Select(s => $"{s.Branch} {s.Product} {s.Total:N0}");
        Console.WriteLine("Sales >= 2,400: " + string.Join("; ", bigSales));

        var byBranch = sales
            .GroupBy(s => s.Branch)
            .Select(g => new { Branch = g.Key, Revenue = g.Sum(s => s.Total), Orders = g.Count() })
            .OrderByDescending(x => x.Revenue);
        foreach (var b in byBranch) Console.WriteLine($"{b.Branch,-8} KSh {b.Revenue,7:N0} ({b.Orders} orders)");

        Console.WriteLine($"Any sale over 5,000? {sales.Any(s => s.Total > 5000m)}");
        Console.WriteLine($"Average order: KSh {sales.Average(s => s.Total):N0}");
        var top = sales.OrderByDescending(s => s.Total).First();
        Console.WriteLine($"Biggest sale: {top.Product} in {top.Branch}");
    }
}
```

| Method | Does |
|---|---|
| `Where` | Filter |
| `Select` | Transform/project |
| `OrderBy` / `OrderByDescending` / `ThenBy` | Sort |
| `GroupBy` | Group by a key |
| `Sum`, `Average`, `Min`, `Max`, `Count` | Aggregates |
| `Any`, `All` | Test conditions |
| `First`, `FirstOrDefault`, `Single` | Get one item |
| `Take`, `Skip` | Paging |
| `Distinct` | Remove duplicates |
| `ToList`, `ToDictionary` | Materialise results |

### Query syntax

The same queries can be written in SQL-like syntax:

```csharp
var nairobi = from s in sales
              where s.Branch == "Nairobi"
              orderby s.Total descending
              select s.Product;
```

Method syntax is more common in modern code; both compile the same way.

### Deferred execution

LINQ queries run when you **enumerate** them (foreach, ToList, Count). Call `.ToList()` to capture results once if you'll use them several times. With **Entity Framework Core**, LINQ queries are translated into SQL and run in the database (see the ASP.NET lesson).

:::think Using LINQ, how would you list the names of students (with properties Name, Form and Balance) in Form 4 who owe more than KSh 5,000, highest balance first?
`students.Where(s => s.Form == 4 && s.Balance > 5000m).OrderByDescending(s => s.Balance).Select(s => s.Name).ToList();`
:::

## Summary

- Classes use properties (with private setters, init-only) and constructors to keep objects valid; override ToString for display.
- Records are concise data types with value equality and `with` copies.
- Inheritance uses abstract/virtual/override and `base`; interfaces define contracts for flexible, testable code.
- Collections: List<T>, Dictionary<TKey, TValue>, HashSet<T>, Queue/Stack.
- LINQ filters, transforms, sorts, groups and aggregates collections (Where, Select, OrderBy, GroupBy, Sum...) with deferred execution.

```quiz
Q: Which C# feature lets you read a value publicly but set it only inside the class? (example: public decimal Balance { get; private set; })
A: property | properties | private set
Q: Which keyword creates a concise data type with value-based equality?
A: record
Q: Which keyword allows a method to be overridden in a subclass?
A: virtual
Q: Which LINQ method filters a collection?
A: Where
Q: Which LINQ method groups items by a key?
A: GroupBy
Q: What does LINQ stand for? (three words)
A: Language Integrated Query
```
