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

## Why C# is worth learning

C# (pronounced "C sharp") is Microsoft's main language and runs on .NET, which works on Windows, Linux and macOS. It's used for business and banking systems, ASP.NET web APIs, Windows desktop apps, cloud services on Azure, and games with the Unity engine (one of the most popular game engines in the world). Many Kenyan banks, insurers and enterprises run .NET systems, so C# skills lead to well-paid corporate and freelance work.

## Value types, reference types and nullable values

```try-csharp
using System;

class Program
{
    static void Main()
    {
        int a = 10;
        int b = a;          // value type: b gets a copy
        b = 20;
        Console.WriteLine($"a={a}, b={b}");

        int[] first = { 1, 2, 3 };
        int[] second = first;   // reference type: both point to the same array
        second[0] = 99;
        Console.WriteLine($"first[0]={first[0]}");

        int? discount = null;   // nullable int: may have no value
        Console.WriteLine(discount.HasValue ? $"Discount {discount}" : "No discount");
        int applied = discount ?? 0;   // default when null
        Console.WriteLine($"Applied: {applied}");

        string? nickname = null;
        Console.WriteLine(nickname?.Length ?? 0);   // ?. avoids NullReferenceException
    }
}
```

| Kind | Examples | Assignment copies... |
|---|---|---|
| Value types | `int`, `double`, `decimal`, `bool`, `char`, `struct` | The value |
| Reference types | `string`, arrays, `class` objects, `List<T>` | The reference (both names share one object) |

Strings are reference types but immutable, so they behave like values in practice.

## Safe conversions with TryParse

```try-csharp
using System;

class Program
{
    static void Main()
    {
        string[] inputs = { "1500", "abc", "-20", "2,500", "" };
        foreach (string input in inputs)
        {
            string clean = input.Replace(",", "").Trim();
            if (decimal.TryParse(clean, out decimal amount) && amount > 0)
            {
                Console.WriteLine($"'{input}' -> KSh {amount:N2}");
            }
            else
            {
                Console.WriteLine($"'{input}' -> invalid amount");
            }
        }
    }
}
```

`TryParse` returns `false` instead of throwing an exception, which is the right choice for user input.

## switch expressions and pattern matching

```try-csharp
using System;

class Program
{
    static string Grade(int mark) => mark switch
    {
        >= 80 => "A",
        >= 65 => "B",
        >= 50 => "C",
        >= 0 => "E",
        _ => "Invalid"
    };

    static decimal DeliveryFee(string town, decimal orderTotal) => (town, orderTotal) switch
    {
        (_, >= 5000m) => 0m,               // free delivery for big orders anywhere
        ("Nairobi", _) => 200m,
        ("Mombasa" or "Kisumu", _) => 400m,
        _ => 600m
    };

    static void Main()
    {
        foreach (int m in new[] { 92, 71, 55, 30, -5 })
            Console.WriteLine($"{m}: {Grade(m)}");

        Console.WriteLine(DeliveryFee("Nairobi", 1200m));
        Console.WriteLine(DeliveryFee("Kisumu", 800m));
        Console.WriteLine(DeliveryFee("Garissa", 6000m));
    }
}
```

Switch expressions with patterns (`>= 80`, tuples, `or`) express business rules clearly and the compiler warns if cases are missing.

## Loops: a savings plan and a multiplication table

```try-csharp
using System;

class Program
{
    static void Main()
    {
        decimal balance = 0m;
        int month = 0;
        do
        {
            balance = balance * 1.01m + 4500m;
            month++;
        } while (balance < 50000m);
        Console.WriteLine($"Target reached in {month} months: KSh {balance:N2}");

        for (int row = 1; row <= 3; row++)
        {
            for (int col = 1; col <= 5; col++)
                Console.Write($"{row * col,4}");    // ,4 = width 4, right-aligned
            Console.WriteLine();
        }
    }
}
```

## Methods with out, ref and optional parameters

```try-csharp
using System;

class Program
{
    static decimal WithVat(decimal amount, decimal rate = 0.16m) => amount * (1 + rate);

    static bool TrySplitName(string full, out string first, out string last)
    {
        string[] parts = full.Trim().Split(' ', 2);
        first = parts[0];
        last = parts.Length > 1 ? parts[1] : "";
        return parts.Length > 1;
    }

    static void AddBonus(ref int marks, int bonus) => marks += bonus;

    static void Main()
    {
        Console.WriteLine(WithVat(1000m));
        Console.WriteLine(WithVat(1000m, rate: 0.08m));      // named argument

        if (TrySplitName("Achieng Odhiambo", out string f, out string l))
            Console.WriteLine($"First: {f}, last: {l}");

        int score = 60;
        AddBonus(ref score, 5);
        Console.WriteLine($"Score: {score}");
    }
}
```

| Keyword | Meaning |
|---|---|
| `out` | The method must assign it; used to return extra values (like `TryParse`) |
| `ref` | The method can read and change the caller's variable |
| Optional parameter | Has a default value; can be skipped |
| Named argument | `rate: 0.08m` makes calls clearer |

## Exceptions for unexpected problems

```try-csharp
using System;

class Program
{
    static decimal Withdraw(decimal balance, decimal amount)
    {
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount), "Amount must be positive");
        if (amount > balance) throw new InvalidOperationException($"Insufficient funds: balance {balance:N2}");
        return balance - amount;
    }

    static void Main()
    {
        decimal balance = 1000m;
        foreach (decimal request in new[] { 200m, 5000m, -5m })
        {
            try
            {
                balance = Withdraw(balance, request);
                Console.WriteLine($"Withdrew {request:N2}, balance {balance:N2}");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Declined: {ex.Message}");
            }
            catch (ArgumentOutOfRangeException)
            {
                Console.WriteLine("Invalid amount");
            }
        }
    }
}
```

Use exceptions for situations that shouldn't normally happen; use `TryParse`-style methods for expected invalid input.

## Practice

1. Read amounts from a string array with `decimal.TryParse` and total only the valid ones.
2. Write a switch expression that returns a shipping zone from a town name.
3. Write `bool TryParsePhone(string input, out string normalised)` for 2547XXXXXXXX numbers.
4. Use a `do while` loop to calculate how many months it takes to repay a loan.
5. Throw and catch a custom message when a withdrawal exceeds the balance.

:::think Why should a banking app use `decimal` instead of `double` for balances?
`double` stores numbers in binary and can't represent many decimal fractions exactly (0.1 + 0.2 isn't exactly 0.3), so tiny rounding errors accumulate over many transactions. `decimal` stores base-10 values exactly to 28–29 significant digits, which is what money calculations require.
:::

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
Q: Which method converts text to a number without throwing an exception if it fails?
A: TryParse
Q: What symbol makes a value type nullable, as in int? ...
A: ? | question mark
Q: Which keyword passes a variable so the method can change the caller's value?
A: ref
Q: In a switch expression, which symbol is the catch-all case?
A: _ | underscore | discard
```
