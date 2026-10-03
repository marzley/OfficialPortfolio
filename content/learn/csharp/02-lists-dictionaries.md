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

## Where collections and LINQ are used

Business applications constantly work with lists of records: customers, invoices, products, students, transactions. C#'s `List<T>`, `Dictionary<TKey, TValue>` and LINQ (Language Integrated Query) make filtering, grouping, sorting and summarising data short and readable. ASP.NET APIs, Unity games and desktop apps all use them daily, and LINQ queries look very similar to SQL, which helps when working with databases through Entity Framework.

## Records: concise data types

```try-csharp
using System;
using System.Collections.Generic;

record Product(int Id, string Name, string Category, decimal Price, int Stock);

class Program
{
    static void Main()
    {
        var p1 = new Product(1, "Unga 2kg", "Food", 180m, 12);
        var p2 = p1 with { Price = 190m };          // copy with one change
        Console.WriteLine(p1);
        Console.WriteLine(p2);
        Console.WriteLine(p1 == new Product(1, "Unga 2kg", "Food", 180m, 12));   // value equality: True
    }
}
```

Records give you a constructor, properties, readable `ToString()`, value-based equality and `with` copies in one line, ideal for data from databases and APIs.

## LINQ: grouping and summarising

```try-csharp
using System;
using System.Collections.Generic;
using System.Linq;

record Sale(string Town, string Product, int Qty, decimal Price)
{
    public decimal Amount => Qty * Price;
}

class Program
{
    static void Main()
    {
        var sales = new List<Sale>
        {
            new("Nakuru", "Unga", 10, 180m), new("Thika", "Sugar", 4, 210m),
            new("Nakuru", "Oil", 4, 350m), new("Eldoret", "Unga", 5, 180m),
            new("Thika", "Unga", 6, 180m),
        };

        var byTown = sales
            .GroupBy(s => s.Town)
            .Select(g => new { Town = g.Key, Orders = g.Count(), Revenue = g.Sum(s => s.Amount) })
            .OrderByDescending(x => x.Revenue);

        foreach (var t in byTown)
            Console.WriteLine($"{t.Town,-8} {t.Orders,2} orders  KSh {t.Revenue,8:N0}");

        Console.WriteLine($"Total revenue: KSh {sales.Sum(s => s.Amount):N0}");
        Console.WriteLine($"Average sale: KSh {sales.Average(s => s.Amount):N0}");
        Console.WriteLine($"Best seller: {sales.GroupBy(s => s.Product).OrderByDescending(g => g.Sum(s => s.Qty)).First().Key}");
        Console.WriteLine($"Any sale over 3,000? {sales.Any(s => s.Amount > 3000m)}");
    }
}
```

| LINQ method | SQL equivalent | Purpose |
|---|---|---|
| `Where` | `WHERE` | Filter |
| `Select` | `SELECT` | Transform/project |
| `OrderBy` / `OrderByDescending` / `ThenBy` | `ORDER BY` | Sort |
| `GroupBy` | `GROUP BY` | Group |
| `Count`, `Sum`, `Average`, `Min`, `Max` | Aggregates | Summaries |
| `First`, `FirstOrDefault`, `Single` | `LIMIT 1` | One item |
| `Any`, `All` | `EXISTS` | Yes/no checks |
| `Distinct`, `Take`, `Skip` | `DISTINCT`, `LIMIT`, `OFFSET` | Unique items, paging |

## Dictionaries: safe lookups and counting

```try-csharp
using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        var prices = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase)
        {
            ["unga"] = 180m, ["sugar"] = 210m, ["oil"] = 350m
        };

        if (prices.TryGetValue("SUGAR", out decimal price))      // case-insensitive keys
            Console.WriteLine($"Sugar: {price}");
        Console.WriteLine(prices.GetValueOrDefault("salt", 0m));

        string[] words = "pay fees pay rent pay fees".Split(' ');
        var counts = new Dictionary<string, int>();
        foreach (var w in words)
            counts[w] = counts.GetValueOrDefault(w) + 1;
        foreach (var kv in counts.OrderByDescending(kv => kv.Value))
            Console.WriteLine($"{kv.Key}: {kv.Value}");
    }
}
```

`TryGetValue` avoids `KeyNotFoundException`; a `StringComparer` makes keys case-insensitive, which helps with user-typed data.

## HashSet and Queue

```try-csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var receipts = new HashSet<string>();
        foreach (var r in new[] { "QJK1", "QJK2", "QJK1", "QJK3" })
        {
            if (!receipts.Add(r))                  // Add returns false for duplicates
                Console.WriteLine($"Duplicate receipt {r} ignored");
        }
        Console.WriteLine($"Unique receipts: {receipts.Count}");

        var queue = new Queue<string>();
        queue.Enqueue("Customer A");
        queue.Enqueue("Customer B");
        queue.Enqueue("Customer C");
        while (queue.Count > 0)
            Console.WriteLine($"Serving {queue.Dequeue()}");
    }
}
```

| Collection | Use |
|---|---|
| `List<T>` | Ordered list, index access |
| `Dictionary<K,V>` | Lookup by key |
| `HashSet<T>` | Unique items, fast "contains" |
| `Queue<T>` | First in, first out (customer queues, jobs) |
| `Stack<T>` | Last in, first out (undo history) |
| `SortedDictionary<K,V>` | Keys kept in order |

## Classes vs records vs structs

| Type | Use when |
|---|---|
| `class` | Objects with identity and behaviour that change over time (an `Account` with deposits) |
| `record` | Data that's mostly read-only and compared by value (DTOs, API responses, report rows) |
| `struct` | Small value types (coordinates, money amounts) where copying is cheap |

## Practice

1. Create a `record Student(string Name, int Form, double Mean)` list and print the top student in each form with LINQ.
2. Group a list of expenses by category and show totals sorted from largest to smallest.
3. Count word frequencies with a `Dictionary<string, int>`.
4. Use a `HashSet<string>` to detect duplicate phone numbers.
5. Simulate a bank queue with `Queue<string>` serving five customers.

:::think Why is `prices.TryGetValue(key, out var p)` usually better than `prices[key]` when the key comes from user input?
`prices[key]` throws a `KeyNotFoundException` if the key doesn't exist, which crashes the request unless caught. `TryGetValue` returns `false` for missing keys so you can show a friendly message, and it looks the key up only once.
:::

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
Q: Which C# type gives value equality, ToString and with-copies in one line?
A: record
Q: Which LINQ method groups items by a key?
A: GroupBy
Q: Which collection returns false from Add when the item already exists?
A: HashSet | HashSet<T>
Q: Which Dictionary method looks up a key without throwing if it's missing?
A: TryGetValue
```
