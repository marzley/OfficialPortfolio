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

## Why async and file handling matter

Real applications constantly wait for slow things: databases, web APIs (payment providers, SMS gateways), files and network drives. Asynchronous code lets an ASP.NET server handle other requests while waiting, and keeps desktop and mobile apps responsive instead of freezing. Reading and writing files (CSV reports, logs, JSON settings, exported statements) is a daily task in business software.

## Running tasks at the same time

```try-csharp
using System;
using System.Diagnostics;
using System.Threading.Tasks;

class Program
{
    static async Task<decimal> GetBalanceAsync(string account, int delayMs)
    {
        await Task.Delay(delayMs);              // pretend to call a slow service
        return account.Length * 1000m;
    }

    static async Task Main()
    {
        var timer = Stopwatch.StartNew();

        // One after another: about 300 ms
        decimal a = await GetBalanceAsync("Savings", 150);
        decimal b = await GetBalanceAsync("Current", 150);
        bool slow = timer.ElapsedMilliseconds >= 290;
        Console.WriteLine($"Sequential total {a + b}, took 300 ms or more: {slow}");

        // At the same time: about 150 ms
        timer.Restart();
        Task<decimal> t1 = GetBalanceAsync("Savings", 150);
        Task<decimal> t2 = GetBalanceAsync("Current", 150);
        decimal[] results = await Task.WhenAll(t1, t2);
        bool fast = timer.ElapsedMilliseconds < 290;
        Console.WriteLine($"Parallel total {results[0] + results[1]}, faster: {fast}");
    }
}
```

Starting tasks first and awaiting them together with `Task.WhenAll` is how an API calls several independent services without adding up their delays.

## Timeouts and cancellation

```try-csharp
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task<string> CheckPaymentAsync(string receipt, CancellationToken token)
    {
        await Task.Delay(500, token);            // a slow provider
        return $"{receipt}: confirmed";
    }

    static async Task Main()
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(100));
        try
        {
            string status = await CheckPaymentAsync("SJK4H2L9XA", cts.Token);
            Console.WriteLine(status);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Payment check timed out; we'll retry shortly.");
        }
    }
}
```

Pass a `CancellationToken` through async methods so slow work can be stopped when a user leaves the page or a timeout passes.

## Handling errors in async code

```try-csharp
using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> LoadOrderAsync(int id)
    {
        await Task.Delay(10);
        if (id == 3) throw new InvalidOperationException($"Order {id} not found");
        return id * 100;
    }

    static async Task Main()
    {
        foreach (int id in new[] { 1, 3, 4 })
        {
            try
            {
                int total = await LoadOrderAsync(id);
                Console.WriteLine($"Order {id}: {total}");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}
```

Exceptions thrown inside an async method surface when you `await` it, so normal `try/catch` works. Avoid `async void` except for event handlers: exceptions from it can't be caught by the caller.

## Retry with backoff

```try-csharp
using System;
using System.Threading.Tasks;

class Program
{
    static int attempts = 0;

    static async Task<string> FlakyServiceAsync()
    {
        await Task.Delay(5);
        attempts++;
        if (attempts < 3) throw new TimeoutException("Gateway timeout");
        return "SMS sent";
    }

    static async Task<T> RetryAsync<T>(Func<Task<T>> action, int maxAttempts)
    {
        for (int attempt = 1; ; attempt++)
        {
            try
            {
                return await action();
            }
            catch (TimeoutException) when (attempt < maxAttempts)
            {
                int wait = 10 * (int)Math.Pow(2, attempt);    // 20, 40, 80 ms...
                Console.WriteLine($"Attempt {attempt} failed, retrying in {wait} ms");
                await Task.Delay(wait);
            }
        }
    }

    static async Task Main()
    {
        string result = await RetryAsync(FlakyServiceAsync, 5);
        Console.WriteLine($"{result} after {attempts} attempts");
    }
}
```

Waiting longer after each failure (exponential backoff) gives an overloaded service time to recover. Libraries like Polly provide retries, timeouts and circuit breakers for production systems.

## Working with paths and CSV text

```try-csharp
using System;
using System.IO;
using System.Linq;

class Program
{
    static void Main()
    {
        string folder = Path.Combine("reports", "2026", "september");
        string file = Path.Combine(folder, "sales.csv");
        Console.WriteLine(file);
        Console.WriteLine($"Name: {Path.GetFileName(file)}, extension: {Path.GetExtension(file)}");

        string csv = "date,town,amount\n2026-09-01,Nakuru,1800\n2026-09-02,Thika,840\n2026-09-03,Nakuru,1400";
        var rows = csv.Split('\n').Skip(1)
            .Select(line => line.Split(','))
            .Select(p => new { Date = DateTime.Parse(p[0]), Town = p[1], Amount = decimal.Parse(p[2]) });

        foreach (var g in rows.GroupBy(r => r.Town))
            Console.WriteLine($"{g.Key}: {g.Sum(r => r.Amount):N0} from {g.Count()} sales, last on {g.Max(r => r.Date):dd MMM}");
    }
}
```

Use `Path.Combine` instead of joining folder names with `"\\"` or `"/"`, so code works on Windows, Linux and macOS servers.

## Reading large files efficiently

```csharp
// Streams line by line instead of loading a 2 GB log into memory
await foreach (string line in File.ReadLinesAsync("app.log"))   // .NET 7+
{
    if (line.Contains("ERROR")) Console.WriteLine(line);
}

// Writing safely: 'using' closes the file even if an error occurs
await using var writer = new StreamWriter("summary.csv");
await writer.WriteLineAsync("town,total");
await writer.WriteLineAsync("Nakuru,3200");
```

## Calling a REST API with HttpClient

```csharp
using System.Net.Http.Json;

record Rate(string Currency, decimal Value);

var http = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };   // reuse one HttpClient
try
{
    Rate? rate = await http.GetFromJsonAsync<Rate>("https://api.example.com/rates/usd-kes");
    Console.WriteLine(rate is null ? "No data" : $"1 USD = {rate.Value} KES");
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Network error: {ex.Message}");
}
```

Create one `HttpClient` and reuse it (or use `IHttpClientFactory` in ASP.NET); creating a new one per request can exhaust network sockets. Keep API keys in configuration (environment variables, user secrets), never in source code.

## Practice

1. Start three fake API calls with different delays and await them with `Task.WhenAll`.
2. Add a 200 ms timeout to a slow task using `CancellationTokenSource`.
3. Write a retry helper that retries up to 3 times on `TimeoutException`.
4. Parse a CSV string of expenses and print totals per category with LINQ.
5. Build file paths for monthly report folders with `Path.Combine`.

:::think An ASP.NET API calls three independent services (customer, orders, loyalty points) one after another with `await`, taking 3 seconds in total. How can you make it faster without changing the services?
Start all three calls first (store the tasks), then `await Task.WhenAll(...)`. Because the calls don't depend on each other, they run concurrently and the total time drops to roughly the slowest single call (about 1 second) instead of the sum.
:::

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
Q: Which method awaits several tasks at the same time?
A: Task.WhenAll | WhenAll
Q: Which type lets you cancel an async operation or apply a timeout? (two words, the token type)
A: CancellationToken | CancellationTokenSource
Q: Which method builds file paths that work on any operating system?
A: Path.Combine | Combine
Q: Should you write async void methods for normal code? (yes or no)
A: no
```
