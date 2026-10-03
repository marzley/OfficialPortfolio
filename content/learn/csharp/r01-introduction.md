---
slug: introduction
title: "C# introduction: what C# and .NET are, where they're used, setup, your first program, types, strings, control flow and methods"
after: KEEP
---
# C# introduction: what C# and .NET are, where they're used, setup, your first program, types, strings, control flow and methods

**C#** (pronounced "C sharp") is a modern, general-purpose language created by Microsoft (led by Anders Hejlsberg) and released in 2000. It runs on **.NET**, a free, open-source, cross-platform platform for building almost anything: web applications and APIs (ASP.NET Core), Windows desktop apps, mobile apps (.NET MAUI), cloud services on Azure, games (the **Unity** engine uses C#), and enterprise systems in banks, insurance companies, government and large organisations, including many in Kenya. C# is strongly typed, safe, productive, and well supported by excellent tools like Visual Studio.

:::note What you will learn
- What C# and .NET are, and where they're used
- Installing the .NET SDK and choosing an editor (Visual Studio, VS Code, Rider)
- Creating and running a console project with the dotnet CLI
- Your first program and program structure (classes, Main, top-level statements)
- Variables and types, including decimal for money
- Strings, interpolation and formatting
- Reading input and converting types safely (Parse vs TryParse)
- Conditions, switch expressions and loops
- Methods, parameters, return values, optional and named arguments
- Common errors
:::

## Where C# is used

| Area | Examples |
|---|---|
| **Web apps and APIs** | ASP.NET Core for business systems, portals, e-commerce, REST APIs |
| **Enterprise** | Banking, insurance, ERP integrations, internal tools |
| **Cloud** | Azure Functions, microservices |
| **Desktop** | Windows apps (WPF, WinForms, WinUI) |
| **Mobile** | .NET MAUI (Android, iOS, Windows, macOS from one codebase) |
| **Games** | Unity: a large share of mobile and indie games, AR/VR |
| **Automation** | Office add-ins, scripts, tools |

## Setup

1. Install the **.NET SDK** (an LTS version) from dotnet.microsoft.com.
2. Choose an editor:
   - **Visual Studio Community** (Windows, free): the full IDE.
   - **VS Code** with the C# Dev Kit extension (any OS).
   - **JetBrains Rider** (paid, free for some uses).
3. Create and run a console app:

```bash
dotnet --version
dotnet new console -o HelloKenya
cd HelloKenya
dotnet run
```

In this hub, the **Run** button compiles and runs C# examples online.

## Your first program

```try-csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Habari, Kenya!");
        Console.WriteLine("Learning C# on the Marzley learning hub.");
    }
}
```

- `using System;` gives access to the `System` namespace (where `Console` lives).
- Code lives inside **classes**; `Main` is the entry point.
- `Console.WriteLine` prints a line.
- Statements end with `;`; blocks use `{ }`; C# is case-sensitive.

Modern .NET projects created with `dotnet new console` use **top-level statements**: the file can simply contain `Console.WriteLine("Hello");` and the compiler generates the class and Main for you. Both styles compile to the same thing.

## Variables and types

```try-csharp
using System;

class Program
{
    static void Main()
    {
        int students = 45;
        long population = 53_000_000;
        double distanceKm = 160.5;
        decimal balance = 15000.75m;     // decimal: exact, best for money (m suffix)
        bool isPaid = true;
        char grade = 'A';
        string school = "Alliance High";
        var town = "Kikuyu";             // var: type inferred (string)
        const decimal Vat = 0.16m;

        Console.WriteLine(school + " in " + town + " has " + students + " students.");
        Console.WriteLine($"Population {population:N0}, distance {distanceKm} km");
        Console.WriteLine($"Balance KSh {balance:N2}, paid: {isPaid}, grade {grade}");
        Console.WriteLine($"VAT on KSh 1,000: KSh {1000 * Vat:N2}");
    }
}
```

| Type | Use |
|---|---|
| `int`, `long` | Whole numbers |
| `double` | Decimals for measurements and science |
| `decimal` | **Money** and exact decimal arithmetic |
| `bool` | true/false |
| `char` | One character |
| `string` | Text |
| `var` | Let the compiler infer the type (still strongly typed) |

Why `decimal` for money? `double` can't represent some decimals exactly (0.1 + 0.2 isn't exactly 0.3), which causes rounding errors in financial calculations.

## Strings and formatting

```try-csharp
using System;

class Program
{
    static void Main()
    {
        string name = "Wanjiku Kamau";
        decimal amount = 2500000m;
        DateTime due = new DateTime(2026, 10, 31);

        Console.WriteLine($"Hello {name}!");                         // interpolation
        Console.WriteLine($"Amount: KSh {amount:N0}");                 // 2,500,000
        Console.WriteLine($"Due: {due:dd MMM yyyy}");                  // 31 Oct 2026
        Console.WriteLine(name.ToUpper());
        Console.WriteLine(name.Length + " characters");
        Console.WriteLine(name.Contains("Kamau"));
        Console.WriteLine(name.Split(' ')[0]);                         // first name
        Console.WriteLine("0712345678".Replace("0712", "254712"));
        string item = "Item", price = "Price", unga = "Unga";
        Console.WriteLine($"{item,-12}|{price,8}");                    // alignment: -12 left, 8 right
        Console.WriteLine($"{unga,-12}|{195,8}");
    }
}
```

## Input and safe conversion

Reading input (run on your own computer):

```csharp
Console.Write("Enter amount: ");
string? input = Console.ReadLine();
if (decimal.TryParse(input, out decimal amount) && amount > 0)
{
    Console.WriteLine($"You entered KSh {amount:N2}");
}
else
{
    Console.WriteLine("Please enter a valid positive number.");
}
```

`decimal.Parse("abc")` throws an exception; `TryParse` returns `false` instead, which is safer for user input:

```try-csharp
using System;

class Program
{
    static void Main()
    {
        string[] inputs = { "1500", "2,500", "abc", "-20" };
        foreach (string s in inputs)
        {
            bool ok = decimal.TryParse(s.Replace(",", ""), out decimal value);
            Console.WriteLine(ok && value > 0 ? $"'{s}' -> {value}" : $"'{s}' is not a valid amount");
        }
    }
}
```

## Conditions and switch

```try-csharp
using System;

class Program
{
    static string Grade(int mark)
    {
        if (mark >= 80) return "A";
        else if (mark >= 65) return "B";
        else if (mark >= 50) return "C";
        else if (mark >= 40) return "D";
        return "E";
    }

    static void Main()
    {
        Console.WriteLine($"72 -> {Grade(72)}");

        string status = "shipped";
        string label = status switch                // switch expression
        {
            "pending" => "Waiting for payment",
            "paid" or "processing" => "Preparing your order",
            "shipped" => "On the way",
            _ => "Unknown"
        };
        Console.WriteLine(label);

        int stock = 3;
        Console.WriteLine(stock < 5 ? "Reorder soon" : "Stock OK");   // ternary
    }
}
```

## Loops

```try-csharp
using System;

class Program
{
    static void Main()
    {
        for (int i = 1; i <= 3; i++)
            Console.WriteLine($"7 x {i} = {7 * i}");

        int[] marks = { 67, 82, 45, 90 };
        int total = 0;
        foreach (int m in marks) total += m;
        Console.WriteLine($"Average: {(double)total / marks.Length:F1}");

        decimal balance = 0m;
        int months = 0;
        while (balance < 50000m)
        {
            balance = balance * 1.01m + 4500m;
            months++;
        }
        Console.WriteLine($"Months to save 50,000: {months}");
    }
}
```

## Methods

```try-csharp
using System;

class Program
{
    static decimal Vat(decimal amount, decimal rate = 0.16m) => amount * rate;   // optional parameter, expression body

    static void PrintReceipt(string item, int qty, decimal price)
    {
        decimal total = qty * price;
        Console.WriteLine($"{item} x{qty} = KSh {total:N2}");
    }

    static (decimal min, decimal max) Range(decimal[] values)                    // returns a tuple
    {
        decimal lo = values[0], hi = values[0];
        foreach (var v in values) { if (v < lo) lo = v; if (v > hi) hi = v; }
        return (lo, hi);
    }

    static void Main()
    {
        Console.WriteLine(Vat(1000m));
        Console.WriteLine(Vat(1000m, rate: 0.08m));        // named argument
        PrintReceipt("Phone charger", 2, 800m);
        var (min, max) = Range(new decimal[] { 1200m, 450m, 3999m, 800m });
        Console.WriteLine($"Cheapest {min}, dearest {max}");
    }
}
```

## Common errors

| Error | Cause |
|---|---|
| `CS1002: ; expected` | Missing semicolon |
| `CS0103: The name 'x' does not exist in the current context` | Typo or variable out of scope |
| `CS0029: Cannot implicitly convert type 'double' to 'decimal'` | Mixing types: add the `m` suffix or convert |
| `FormatException` | `Parse` on invalid text: use `TryParse` |
| `NullReferenceException` | Using an object that's null: check for null (nullable reference types help) |

:::think Why should a school fees system written in C# store amounts as decimal rather than double?
`decimal` represents base-10 numbers exactly (like 1500.10), so totals and balances don't drift with rounding errors. `double` is binary floating point and can't represent many decimal fractions exactly, so repeated calculations can be off by small amounts, unacceptable for money.
:::

## Summary

- C# runs on .NET, a free cross-platform platform for web (ASP.NET Core), desktop, mobile (MAUI), cloud and games (Unity).
- Install the .NET SDK; use Visual Studio, VS Code or Rider; `dotnet new console` and `dotnet run`.
- Types: int, long, double, decimal (money), bool, char, string, var; strings support interpolation and formatting.
- Use TryParse for safe input; if/else, switch expressions and the ternary operator for decisions; for, foreach and while loops.
- Methods support optional/named parameters, expression bodies and tuple returns.

```quiz
Q: Which platform does C# run on?
A: .NET | dotnet
Q: Which type should you use for money in C#?
A: decimal
Q: Which game engine uses C#?
A: Unity
Q: Which method converts text to a number without throwing an exception on bad input?
A: TryParse | decimal.TryParse | int.TryParse
Q: Which CLI command creates a new console project? (three words)
A: dotnet new console
Q: Which symbol starts an interpolated string in C#?
A: $
```
