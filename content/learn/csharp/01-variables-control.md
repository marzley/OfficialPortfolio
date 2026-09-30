---
slug: variables-control-flow
title: Variables, types, conditions and loops in C#
after: introduction
---
# Variables, types, conditions and loops in C#

C# (said "C sharp") is Microsoft's main language: it builds Windows apps, web APIs with ASP.NET, games with **Unity**, and business systems in many banks and companies. Its syntax will feel familiar if you know Java or JavaScript.

> Examples run on Compiler Explorer (online), so they need internet and take a few seconds. Keep the `Program` class and `Main` method.

## Variables and types

```try-csharp
using System;

class Program
{
    static void Main()
    {
        int students = 45;
        double fee = 12500.50;
        decimal balance = 15000.75m;      // decimal: exact, use for money (note the m)
        bool isPaid = true;
        char grade = 'A';
        string school = "Alliance High";
        var town = "Kikuyu";               // var: the compiler infers string
        const double Vat = 0.16;

        Console.WriteLine(school + " in " + town + " has " + students + " students.");
        Console.WriteLine($"Fee: KSh {fee:N2}, balance: KSh {balance:N2}, paid: {isPaid}, grade {grade}");
        Console.WriteLine($"VAT on 1000 is {1000 * Vat}");
    }
}
```

`$"...{value}..."` is **string interpolation**; `:N2` formats with thousands separators and 2 decimals.

| Type | Holds | Example |
|---|---|---|
| `int` | Whole numbers | `int qty = 3;` |
| `long` | Big whole numbers | `long pop = 52000000;` |
| `double` | Decimals (fast, approximate) | `double rate = 3.5;` |
| `decimal` | Exact decimals for **money** | `decimal price = 199.99m;` |
| `bool` | `true` / `false` | |
| `char` | One character | `'K'` |
| `string` | Text | `"Nairobi"` |

## Conversions

```try-csharp
using System;

class Program
{
    static void Main()
    {
        string input = "250";
        int qty = int.Parse(input);
        double price = double.Parse("180.5");
        Console.WriteLine(qty * price);

        if (int.TryParse("abc", out int value))       // safe: no crash on bad input
            Console.WriteLine("Number: " + value);
        else
            Console.WriteLine("Not a number");

        int whole = (int)9.99;                         // cast: cuts the decimals -> 9
        Console.WriteLine(whole + " " + Convert.ToString(42) + " " + Math.Round(12.567, 2));
    }
}
```

Prefer `TryParse` for user input: it returns `false` instead of throwing an exception.

## Conditions

```try-csharp
using System;

class Program
{
    static void Main()
    {
        int[] marks = { 92, 67, 45 };
        foreach (int mark in marks)
        {
            string grade;
            if (mark >= 80) grade = "A";
            else if (mark >= 60) grade = "B";
            else if (mark >= 50) grade = "C";
            else grade = "Fail";
            Console.WriteLine($"{mark}: {grade}");
        }

        string day = "SAT";
        switch (day)
        {
            case "SAT":
            case "SUN":
                Console.WriteLine("Weekend");
                break;
            default:
                Console.WriteLine("Weekday");
                break;
        }

        int age = 20;
        string status = age >= 18 ? "adult" : "minor";   // ternary
        Console.WriteLine(status);
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
            Console.WriteLine("Round " + i);

        decimal savings = 0;
        int week = 0;
        while (savings < 10000m)
        {
            savings += 1500m;
            week++;
        }
        Console.WriteLine($"KSh 10,000 reached in week {week}");

        string[] towns = { "Nyeri", "Meru", "Embu" };
        foreach (string t in towns)
            Console.Write(t + " ");
        Console.WriteLine();
    }
}
```

## Methods

```try-csharp
using System;

class Program
{
    static decimal WithVat(decimal amount, decimal rate = 16m)
    {
        return Math.Round(amount * (1 + rate / 100), 2);
    }

    static bool IsValidPhone(string phone)
    {
        return phone.Length == 10 && (phone.StartsWith("07") || phone.StartsWith("01"));
    }

    static void Main()
    {
        Console.WriteLine(WithVat(1000m));
        Console.WriteLine(WithVat(1000m, 0m));
        Console.WriteLine(IsValidPhone("0712345678") + " " + IsValidPhone("12345"));
    }
}
```

C# methods use **PascalCase** names (`WithVat`, `IsValidPhone`), unlike Java's camelCase.

```quiz
Q: Which C# type should you use for money?
A: decimal
Q: What letter must follow a decimal literal like 199.99?
A: m | M
Q: Which method converts a string to an int without crashing on bad input?
A: int.TryParse | TryParse
Q: What symbol starts an interpolated string in C#?
A: $
Q: Which loop goes through every item in an array?
A: foreach
```
