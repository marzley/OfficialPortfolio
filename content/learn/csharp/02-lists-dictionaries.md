---
slug: lists-dictionaries-linq
title: Lists, dictionaries and LINQ queries
after: variables-control-flow
---
# Lists, dictionaries and LINQ queries

Real programs juggle collections: customers, orders, marks. C# has excellent collection types and **LINQ**, which lets you query data in code much like SQL.

## List&lt;T&gt;: a growable list

```try-csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> cart = new List<string> { "Unga", "Sugar" };
        cart.Add("Oil");
        cart.Insert(0, "Salt");
        cart.Remove("Sugar");
        Console.WriteLine($"{cart.Count} items, first: {cart[0]}");
        Console.WriteLine("Has oil? " + cart.Contains("Oil"));
        cart.Sort();
        Console.WriteLine(string.Join(", ", cart));
    }
}
```

## Dictionary&lt;TKey, TValue&gt;: look-ups by key

```try-csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var stock = new Dictionary<string, int>
        {
            ["Unga"] = 12,
            ["Sugar"] = 0,
            ["Oil"] = 7
        };
        stock["Rice"] = 20;                 // add or replace
        stock["Unga"] -= 2;

        if (stock.TryGetValue("Beans", out int beans))
            Console.WriteLine("Beans: " + beans);
        else
            Console.WriteLine("No beans in stock list");

        foreach (KeyValuePair<string, int> item in stock)
            Console.WriteLine($"{item.Key,-6} {item.Value,4}");

        var counts = new Dictionary<string, int>();
        foreach (string w in "haraka haraka haina baraka".Split(' '))
            counts[w] = counts.ContainsKey(w) ? counts[w] + 1 : 1;
        Console.WriteLine("haraka: " + counts["haraka"]);
    }
}
```

`{item.Key,-6}` left-aligns in 6 characters; `{item.Value,4}` right-aligns in 4.

## Classes to hold records

```csharp
class Student
{
    public string Name { get; set; } = "";
    public string Form { get; set; } = "";
    public int Mark { get; set; }
}
```

`{ get; set; }` makes an auto-implemented **property**.

## LINQ: query collections

```try-csharp
using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public string Name { get; set; } = "";
    public string Form { get; set; } = "";
    public int Mark { get; set; }
}

class Program
{
    static void Main()
    {
        var students = new List<Student>
        {
            new Student { Name = "Amina", Form = "2A", Mark = 78 },
            new Student { Name = "Brian", Form = "3B", Mark = 92 },
            new Student { Name = "Chebet", Form = "2A", Mark = 60 },
            new Student { Name = "Dennis", Form = "3B", Mark = 45 },
        };

        var passed = students.Where(s => s.Mark >= 50).OrderByDescending(s => s.Mark);
        foreach (var s in passed)
            Console.WriteLine($"{s.Name}: {s.Mark}");

        Console.WriteLine("Average: " + students.Average(s => s.Mark));
        Console.WriteLine("Top: " + students.OrderByDescending(s => s.Mark).First().Name);
        Console.WriteLine("Any fails? " + students.Any(s => s.Mark < 50));

        var byForm = students.GroupBy(s => s.Form);
        foreach (var group in byForm)
            Console.WriteLine($"{group.Key}: {group.Count()} students, mean {group.Average(s => s.Mark):F1}");

        List<string> names = students.Select(s => s.Name.ToUpper()).ToList();
        Console.WriteLine(string.Join(" ", names));
    }
}
```

| LINQ method | Like SQL | Does |
|---|---|---|
| `Where` | `WHERE` | Filter |
| `Select` | `SELECT` | Transform each item |
| `OrderBy` / `OrderByDescending` | `ORDER BY` | Sort |
| `GroupBy` | `GROUP BY` | Group |
| `Count`, `Sum`, `Average`, `Max`, `Min` | aggregates | Totals |
| `First`, `FirstOrDefault` | `LIMIT 1` | One item |
| `Any`, `All` | `EXISTS` | Checks |
| `ToList` | | Make a real list |

`s => s.Mark >= 50` is a **lambda expression**: a small function passed to the method.

## Arrays vs List

| | Array `int[]` | `List<int>` |
|---|---|---|
| Size | Fixed | Grows |
| Length | `arr.Length` | `list.Count` |
| Use when | Size is known and fixed | Most of the time |

```quiz
Q: Which collection stores key-value pairs in C#?
A: Dictionary | Dictionary<TKey, TValue>
Q: Which List property gives the number of items?
A: Count
Q: Which LINQ method filters items?
A: Where
Q: Which LINQ method transforms each item?
A: Select
Q: What is s => s.Mark >= 50 called? (two words)
A: lambda expression | lambda
```
