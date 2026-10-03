---
slug: aspnet-next-steps
title: "ASP.NET Core and next steps: building web APIs, routing, dependency injection, Entity Framework Core, auth, deployment and Unity"
after: KEEP
---
# ASP.NET Core and next steps: building web APIs, routing, dependency injection, Entity Framework Core, auth, deployment and Unity

**ASP.NET Core** is Microsoft's open-source, cross-platform framework for building web applications and APIs with C#. It's fast, secure by design, and used by banks, insurers, government agencies, software companies and startups. Mastering it, together with **Entity Framework Core** for databases, opens many back-end and full-stack developer jobs. This unit shows how an ASP.NET Core API is structured, builds a small working API step by step, adds a database, authentication and validation, explains deployment, and maps out other C# paths (Blazor, MAUI, Unity) and a learning plan.

:::note What you will learn
- What ASP.NET Core can build: APIs, MVC sites, Razor Pages, Blazor
- Creating a project and its structure (Program.cs, appsettings.json)
- Minimal APIs and controllers: routes, HTTP methods, status codes
- Dependency injection and services
- Validation and error handling
- Entity Framework Core: models, DbContext, migrations, LINQ queries
- Configuration and secrets
- Authentication and authorisation (JWT, Identity)
- Testing APIs (Swagger/OpenAPI, Postman)
- Deployment options (Azure, Linux VPS, Docker)
- Other paths: Blazor, .NET MAUI, Unity games
- A learning plan and portfolio projects
:::

## What you can build

| Type | Use |
|---|---|
| **Web API** | JSON APIs for mobile apps, front ends (React/Angular), integrations (e.g. M-Pesa callbacks) |
| **MVC / Razor Pages** | Server-rendered websites and admin portals |
| **Blazor** | Interactive web UIs written in C# instead of JavaScript |
| **SignalR** | Real-time features (chat, live dashboards) |
| **Background services** | Scheduled jobs, queues |

## Create a project

```bash
dotnet new webapi -o SchoolApi
cd SchoolApi
dotnet run
```

The template creates an API with an example endpoint and OpenAPI support for testing in the browser.

| File | Purpose |
|---|---|
| `Program.cs` | App startup: services, middleware, endpoints |
| `appsettings.json` | Configuration (connection strings, settings) |
| `Properties/launchSettings.json` | Local URLs and environment |
| `*.csproj` | Project file: target framework, NuGet packages |

## A minimal API

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<StudentStore>();       // register a service (dependency injection)
var app = builder.Build();

app.MapGet("/students", (StudentStore store) => store.All());

app.MapGet("/students/{admissionNo}", (string admissionNo, StudentStore store) =>
    store.Find(admissionNo) is Student s ? Results.Ok(s) : Results.NotFound());

app.MapPost("/students/{admissionNo}/payments", (string admissionNo, PaymentRequest req, StudentStore store) =>
{
    if (req.Amount <= 0) return Results.BadRequest(new { error = "Amount must be positive" });
    var student = store.Find(admissionNo);
    if (student is null) return Results.NotFound();
    student.Balance -= req.Amount;
    return Results.Ok(student);
});

app.Run();

record PaymentRequest(decimal Amount, string Receipt);

class Student
{
    public string AdmissionNo { get; init; } = "";
    public string Name { get; init; } = "";
    public decimal Balance { get; set; }
}

class StudentStore
{
    private readonly List<Student> students = new()
    {
        new Student { AdmissionNo = "ADM001", Name = "Brian", Balance = 12500m },
        new Student { AdmissionNo = "ADM002", Name = "Faith", Balance = 0m }
    };
    public IEnumerable<Student> All() => students;
    public Student? Find(string adm) => students.FirstOrDefault(s => s.AdmissionNo == adm);
}
```

Concepts:
- **Routes** map URLs and HTTP methods (GET, POST, PUT, DELETE) to code.
- **Route parameters** (`{admissionNo}`) and **JSON bodies** (`PaymentRequest`) bind automatically.
- **Results** return proper status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found.
- **Dependency injection (DI)**: services are registered once and provided where needed, making code modular and testable.

## Controllers (the classic style)

Larger APIs often use controllers:

```csharp
[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly SchoolDb db;
    public StudentsController(SchoolDb db) => this.db = db;     // injected

    [HttpGet("{admissionNo}")]
    public async Task<ActionResult<Student>> Get(string admissionNo)
    {
        var student = await db.Students.FindAsync(admissionNo);
        return student is null ? NotFound() : student;
    }
}
```

`[ApiController]` adds automatic model validation and helpful defaults.

## Validation

Use data annotations (or libraries like FluentValidation):

```csharp
public record CreateStudent(
    [Required, StringLength(10)] string AdmissionNo,
    [Required, StringLength(100)] string Name,
    [Range(0, 1_000_000)] decimal Balance);
```

With controllers, invalid input automatically returns 400 with error details. Never trust client input, and don't expose internal error details in production responses.

## Entity Framework Core: databases with C#

**EF Core** maps C# classes to database tables (SQL Server, PostgreSQL, MySQL, SQLite) and translates LINQ into SQL.

```bash
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet tool install --global dotnet-ef
```

```csharp
public class SchoolDb : DbContext
{
    public SchoolDb(DbContextOptions<SchoolDb> options) : base(options) {}
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Payment> Payments => Set<Payment>();
}

public class Payment
{
    public int Id { get; set; }
    public string AdmissionNo { get; set; } = "";
    public decimal Amount { get; set; }
    public string Receipt { get; set; } = "";
    public DateTime PaidAt { get; set; } = DateTime.UtcNow;
}
```

Register it in Program.cs and create the database with migrations:

```csharp
builder.Services.AddDbContext<SchoolDb>(o =>
    o.UseSqlite(builder.Configuration.GetConnectionString("Default")));
```

```bash
dotnet ef migrations add Initial
dotnet ef database update
```

Query with LINQ (runs as SQL):

```csharp
var arrears = await db.Students
    .Where(s => s.Balance > 5000)
    .OrderByDescending(s => s.Balance)
    .Select(s => new { s.Name, s.Balance })
    .ToListAsync();
```

EF Core uses parameterised SQL, protecting against SQL injection.

## Configuration and secrets

- Settings go in `appsettings.json` and per-environment files (`appsettings.Development.json`).
- **Secrets** (database passwords, M-Pesa keys, JWT signing keys) must not be committed: use **User Secrets** in development (`dotnet user-secrets set "Mpesa:ConsumerSecret" "..."`) and environment variables or a vault (Azure Key Vault) in production.
- Read them with `builder.Configuration["Mpesa:ConsumerKey"]` or bind to option classes.

## Authentication and authorisation

| Need | Tool |
|---|---|
| User accounts for a web app | ASP.NET Core Identity (registration, login, password hashing, 2FA) |
| APIs for mobile/SPA clients | JWT bearer tokens |
| Organisation logins | OpenID Connect (Microsoft Entra ID, Google) |
| Roles/permissions | `[Authorize(Roles = "Admin")]`, policies |

```csharp
app.MapGet("/admin/reports", () => "secret report").RequireAuthorization("AdminOnly");
```

Always use HTTPS, check that users can only access their own records (avoid IDOR), and rate-limit sensitive endpoints (ASP.NET Core includes rate-limiting middleware).

## Testing and documentation

- **OpenAPI/Swagger**: interactive documentation to test endpoints in the browser.
- **Postman/Insomnia** or VS Code REST Client for manual tests.
- **xUnit** for unit tests; `WebApplicationFactory` for integration tests.

## Deployment

| Option | Notes |
|---|---|
| **Azure App Service** | Easiest managed hosting for .NET |
| **Linux VPS** | Run `dotnet publish`, use a systemd service and Nginx reverse proxy (like the Node/Python deployment lesson) |
| **Docker** | `dotnet publish` into a container; deploy anywhere |
| **Windows Server + IIS** | Common in enterprises |

```bash
dotnet publish -c Release -o ./publish
```

## Other C# paths

| Path | What it is |
|---|---|
| **Blazor** | Interactive web front ends in C# (server or WebAssembly) |
| **.NET MAUI** | Cross-platform mobile and desktop apps |
| **Unity** | Game engine using C# scripts: mobile games, AR/VR, simulations; huge community |
| **Desktop (WPF/WinUI)** | Windows business applications |

A taste of Unity scripting:

```csharp
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public float speed = 5f;
    void Update()
    {
        float x = Input.GetAxis("Horizontal");
        float y = Input.GetAxis("Vertical");
        transform.Translate(new Vector3(x, y, 0) * speed * Time.deltaTime);
    }
}
```

## Learning plan

| Stage | Focus |
|---|---|
| 1 | C# fundamentals, OOP, collections, LINQ (this subject) |
| 2 | ASP.NET Core minimal APIs and controllers |
| 3 | EF Core with SQL Server or PostgreSQL; SQL basics (SQL subject) |
| 4 | Authentication, validation, testing, logging |
| 5 | Deploy a project (Azure or VPS) and add CI (GitHub Actions) |
| 6 | Optional: Microsoft certifications (e.g. Azure Developer Associate), Blazor or Unity |

Free resources: Microsoft Learn (official, free modules for C#, ASP.NET Core and Azure), the .NET YouTube channel, and freeCodeCamp's C# certification with Microsoft.

## Portfolio project ideas

- **School fees API**: students, payments, M-Pesa callback endpoint (sandbox), reports with LINQ.
- **Inventory system**: products, suppliers, stock movements, low-stock alerts, Blazor admin UI.
- **Clinic booking API** with JWT auth, roles (admin, doctor, patient) and SMS reminder background service.
- **Unity mini-game** showcasing C# skills.

:::think An M-Pesa callback endpoint in ASP.NET Core marks orders as paid whenever it receives a POST. What security checks should it have?
Verify the request is genuine (a secret in the callback URL, HTTPS, optionally IP allow-listing per Safaricom guidance), match the CheckoutRequestID to a pending payment created by your system, confirm the amount, process each payment once (unique receipt), log raw payloads, and return the expected acknowledgement. Never trust client-side "paid" signals.
:::

## Summary

- ASP.NET Core builds fast, secure web APIs and apps in C#; create one with `dotnet new webapi`.
- Minimal APIs or controllers map routes and HTTP methods to code, returning proper status codes; DI provides services.
- Validate input; use EF Core with migrations and LINQ for databases (parameterised SQL).
- Keep secrets in user secrets/environment variables; use Identity, JWT or OpenID Connect for auth, plus authorisation checks.
- Test with OpenAPI and xUnit, deploy to Azure, a VPS or Docker, and explore Blazor, MAUI and Unity.

```quiz
Q: Which command creates a new ASP.NET Core Web API project? (three words)
A: dotnet new webapi
Q: Which ORM maps C# classes to database tables in .NET? (three words)
A: Entity Framework Core | EF Core | entity framework
Q: Which HTTP status code means "Not Found"?
A: 404
Q: Which command applies EF Core migrations to the database? (four words)
A: dotnet ef database update
Q: Which .NET technology builds web UIs in C# instead of JavaScript?
A: Blazor
Q: Where should secrets like database passwords be kept in development? (two words)
A: user secrets | user-secrets
```
