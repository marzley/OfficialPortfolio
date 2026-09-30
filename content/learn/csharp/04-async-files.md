---
slug: async-files-json
title: Files, JSON and async/await in C#
after: oop-inheritance-interfaces
---
# Files, JSON and async/await in C#

Apps read settings, save reports, call web APIs and must stay responsive while they wait. This lesson covers the file system, JSON with the built-in `System.Text.Json`, and asynchronous code with `async`/`await`.

## Reading and writing text files

```try-csharp
using System;
using System.IO;

class Program
{
    static void Main()
    {
        string path = Path.Combine(Path.GetTempPath(), "sales.csv");   // a folder every program may write to
        File.WriteAllText(path, "name,amount\nAmina,1200\nBrian,850\n");
        File.AppendAllText(path, "Chebet,2300\n");

        string[] lines = File.ReadAllLines(path);
        decimal total = 0;
        for (int i = 1; i < lines.Length; i++)            // skip the header
        {
            string[] parts = lines[i].Split(',');
            total += decimal.Parse(parts[1]);
            Console.WriteLine($"{parts[0],-8} {parts[1],6}");
        }
        Console.WriteLine($"Total: {total}");
        Console.WriteLine("Exists: " + File.Exists(path));
    }
}
```

| Method | Does |
|---|---|
| `File.ReadAllText` / `WriteAllText` | Whole file as one string |
| `File.ReadAllLines` | Array of lines |
| `File.AppendAllText` | Add to the end |
| `File.Exists`, `File.Delete` | Check / remove |
| `Directory.CreateDirectory`, `Directory.GetFiles` | Folders |
| `Path.Combine("data", "file.txt")` | Build paths safely on any OS |

For large files, read line by line with `File.ReadLines(path)` or a `StreamReader` inside `using`, which closes it automatically.

## JSON with System.Text.Json

```try-csharp
using System;
using System.Collections.Generic;
using System.Text.Json;

class Order
{
    public int Id { get; set; }
    public string Customer { get; set; } = "";
    public List<string> Items { get; set; } = new List<string>();
    public decimal Total { get; set; }
    public bool Paid { get; set; }
}

class Program
{
    static void Main()
    {
        var order = new Order { Id = 1042, Customer = "Faith", Items = new List<string> { "Cake", "Candles" }, Total = 1950m };
        string json = JsonSerializer.Serialize(order, new JsonSerializerOptions { WriteIndented = true });
        Console.WriteLine(json);

        string incoming = "{\"Id\":7,\"Customer\":\"Otieno\",\"Items\":[\"Bread\"],\"Total\":60,\"Paid\":true}";
        Order? back = JsonSerializer.Deserialize<Order>(incoming);
        Console.WriteLine($"{back!.Customer} paid? {back.Paid}, total {back.Total}");
    }
}
```

`Serialize` turns an object into JSON text; `Deserialize<T>` turns JSON back into an object. This is how ASP.NET APIs send and receive data.

## async and await

Waiting for a network call or a big file shouldn't freeze the app. `async` methods return a `Task`, and `await` pauses the method **without blocking** the thread.

```try-csharp
using System;
using System.Threading.Tasks;

class Program
{
    static async Task<decimal> GetExchangeRateAsync(string currency)
    {
        await Task.Delay(300);                // pretend this is a slow web request
        return currency == "USD" ? 129.5m : 140.2m;
    }

    static async Task Main()
    {
        Console.WriteLine("Fetching rates...");
        Task<decimal> usdTask = GetExchangeRateAsync("USD");   // both start now
        Task<decimal> eurTask = GetExchangeRateAsync("EUR");
        decimal usd = await usdTask;                           // wait for both (about 300 ms total, not 600)
        decimal eur = await eurTask;
        Console.WriteLine($"USD {usd}, EUR {eur}");
        Console.WriteLine($"KSh 10,000 = USD {Math.Round(10000 / usd, 2)}");
    }
}
```

Rules of thumb:

- Name async methods with the **Async** suffix.
- Return `Task` (no value) or `Task<T>` (a value); avoid `async void` except for event handlers.
- `await` everything you start; use `Task.WhenAll` to wait for many.

## Calling a web API (for your own computer)

```csharp
using System.Net.Http;
using System.Net.Http.Json;

var http = new HttpClient();
var products = await http.GetFromJsonAsync<List<Product>>("https://example.com/api/products");
```

## Where to go next

| Want to build | Learn |
|---|---|
| Web APIs and websites | **ASP.NET Core** (minimal APIs, MVC, Razor Pages) |
| Databases | **Entity Framework Core** |
| Windows desktop apps | WinForms, WPF or .NET MAUI |
| Mobile apps | .NET MAUI |
| Games | **Unity** |

Install the free **.NET SDK** and **Visual Studio Community** or **VS Code** with the C# Dev Kit, then run `dotnet new console -o MyApp`.

```quiz
Q: Which method reads a whole text file into an array of lines?
A: File.ReadAllLines | ReadAllLines
Q: Which class turns objects into JSON text?
A: JsonSerializer
Q: What type does an async method that returns a value give back? Write it for decimal.
A: Task<decimal>
Q: Which keyword waits for a Task without blocking?
A: await
Q: Which method waits for several tasks at once?
A: Task.WhenAll | WhenAll
```
