---
slug: composer-frameworks
title: "Composer, packages and frameworks: from plain PHP to Laravel"
after: json-api
---
# Composer, packages and frameworks: from plain PHP to Laravel

As projects grow, writing everything from scratch becomes slow and risky: routing URLs, validating forms, sending emails, handling logins, protecting against CSRF, talking to the database. Professional PHP developers use **Composer** to install tested **packages** and often build on a **framework** such as **Laravel** or **Symfony**, which provides a solid structure and ready-made, secure features. Laravel in particular is very popular with Kenyan and international employers and freelance clients.

:::note What you will learn
- What Composer is and why every modern PHP project uses it
- composer.json, composer.lock and the vendor folder
- Autoloading your own classes (PSR-4)
- Useful packages: PHPMailer, Guzzle, Dotenv, Carbon
- What a framework gives you, and MVC
- Laravel's structure: routes, controllers, Blade views, Eloquent models, migrations
- Building a tiny Laravel feature step by step
- When to use plain PHP, WordPress or a framework
:::

## Composer

**Composer** is PHP's dependency manager: you list the packages your project needs, and it downloads them (and the packages *they* need) into a `vendor/` folder, plus an autoloader so you can use them with one `require`.

Install it from getcomposer.org (Windows installer, or the command-line installer on macOS/Linux). Then in your project folder:

```bash
composer init                         # create composer.json interactively
composer require phpmailer/phpmailer  # add a package
composer require vlucas/phpdotenv
composer install                      # install everything listed (e.g. after cloning a project)
composer update                       # update packages within allowed versions
```

| File/folder | Purpose | Commit to Git? |
|---|---|---|
| `composer.json` | The packages you asked for and version ranges | Yes |
| `composer.lock` | The exact versions installed | Yes (so everyone gets the same versions) |
| `vendor/` | Downloaded code | **No** (add to .gitignore; recreate with `composer install`) |

Use packages at the top of your script:

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
$mail = new PHPMailer(true);
```

Find packages on **packagist.org**. Prefer well-maintained ones with many downloads, recent releases and good documentation.

## Autoloading your own classes

Tell Composer where your classes live (PSR-4 standard), then never write `require` for each class file again:

```json
{
    "autoload": {
        "psr-4": { "App\\": "src/" }
    }
}
```

Run `composer dump-autoload`. Now `src/Services/Invoice.php` with `namespace App\Services; class Invoice {}` loads automatically when you write `new App\Services\Invoice()`.

## Useful packages

| Package | What it does |
|---|---|
| `phpmailer/phpmailer` or `symfony/mailer` | Send email over SMTP |
| `guzzlehttp/guzzle` | Call APIs (e.g. M-Pesa, SMS gateways) more easily than raw cURL |
| `vlucas/phpdotenv` | Load secrets from a `.env` file into environment variables |
| `nesbot/carbon` | Friendly date handling ("3 days ago", adding months) |
| `dompdf/dompdf` | Generate PDF invoices and receipts from HTML |
| `phpoffice/phpspreadsheet` | Read and write Excel files |
| `phpunit/phpunit` | Automated tests |

## What a framework gives you

A framework is a ready-made structure and toolkit:

| Feature | Plain PHP | Framework (e.g. Laravel) |
|---|---|---|
| URL routing | Many separate .php files | Clean routes like `/products/42` |
| Database | Write PDO code by hand | ORM (Eloquent), query builder, migrations |
| Security | You must remember CSRF, escaping, hashing | Built in by default |
| Validation | Write your own | One line of rules |
| Logins | Build from scratch | Starter kits |
| Email, queues, scheduling, caching, file storage | Build or find packages | Included |
| Structure | Whatever you invent | Conventions every Laravel developer knows |

Most frameworks follow **MVC**:
- **Model**: data and business rules (a `Product` with its database table).
- **View**: what the user sees (HTML templates).
- **Controller**: receives the request, uses models, returns a view or JSON.

## Laravel in practice

Create a project (needs PHP and Composer):

```bash
composer create-project laravel/laravel shop
cd shop
php artisan serve          # http://127.0.0.1:8000
```

Key folders:

| Path | Contains |
|---|---|
| `routes/web.php` | URL routes for web pages |
| `app/Http/Controllers/` | Controllers |
| `app/Models/` | Eloquent models |
| `resources/views/` | Blade templates |
| `database/migrations/` | Table definitions as code |
| `.env` | Settings and secrets (never commit) |

### A tiny feature: list and add products

**1. Migration** (`php artisan make:model Product -mc` creates model, migration and controller):

```php
// database/migrations/xxxx_create_products_table.php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('category');
    $table->unsignedInteger('price');
    $table->timestamps();
});
```

Run `php artisan migrate` to create the table.

**2. Model**:

```php
// app/Models/Product.php
class Product extends Model
{
    protected $fillable = ['name', 'category', 'price'];
}
```

**3. Routes**:

```php
// routes/web.php
use App\Http\Controllers\ProductController;
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
```

**4. Controller**:

```php
// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('name')->paginate(20);
        return view('products.index', ['products' => $products]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|max:120',
            'category' => 'required|in:Accessories,Storage,Electronics',
            'price' => 'required|integer|min:1',
        ]);
        Product::create($data);
        return redirect('/products')->with('status', 'Product added');
    }
}
```

**5. Blade view**:

```php
{{-- resources/views/products/index.blade.php --}}
@if (session('status')) <p>{{ session('status') }}</p> @endif
<ul>
  @foreach ($products as $p)
    <li>{{ $p->name }} – KSh {{ number_format($p->price) }}</li>
  @endforeach
</ul>
{{ $products->links() }}
<form method="post" action="/products">
  @csrf
  <input name="name" value="{{ old('name') }}">
  <select name="category"><option>Accessories</option><option>Storage</option><option>Electronics</option></select>
  <input name="price" type="number">
  <button>Add</button>
</form>
```

Notice what Laravel did for you: `{{ }}` escapes output (XSS protection), `@csrf` adds a CSRF token, `validate()` checks input and returns errors, Eloquent uses prepared statements, and pagination is one method.

## Plain PHP, WordPress or a framework?

| Project | Good choice |
|---|---|
| Learning PHP, tiny scripts, a contact form | Plain PHP |
| Brochure websites, blogs, simple shops, client edits content themselves | **WordPress** (+ WooCommerce) |
| Custom systems: portals, booking, school/SACCO management, APIs, SaaS | **Laravel** (or Symfony) |

Learn plain PHP first (this subject) so you understand what frameworks do for you, then pick up Laravel with its official documentation and free video courses.

:::think A client wants a school fees portal with parent logins, M-Pesa payments, SMS reminders, PDF receipts and an admin dashboard. Why might Laravel be a better choice than writing everything in plain PHP files?
Laravel provides secure authentication, validation, CSRF protection, an ORM with migrations, queues and scheduling for SMS reminders, mail and notification systems, and a clear structure; packages handle PDFs and HTTP calls to M-Pesa. The result is faster to build, safer, and easier for another developer to maintain.
:::

## Summary

- Composer installs packages into `vendor/` from `composer.json`; commit composer.json and composer.lock, not vendor.
- PSR-4 autoloading loads your own classes automatically.
- Useful packages: PHPMailer, Guzzle, Dotenv, Carbon, Dompdf, PhpSpreadsheet, PHPUnit.
- Frameworks provide routing, ORM, validation, security and structure (MVC).
- Laravel: routes → controllers → Eloquent models → Blade views, with migrations and built-in protections.

```quiz
Q: What is PHP's dependency manager called?
A: Composer
Q: Which folder holds downloaded packages (and should not be committed)?
A: vendor | vendor/
Q: Which website lists PHP packages for Composer?
A: packagist | packagist.org
Q: What does the M in MVC stand for?
A: Model
Q: Which Laravel command creates database tables from migrations? (three words)
A: php artisan migrate
Q: Which Blade directive adds a CSRF token to a form?
A: @csrf | csrf
```

**Learn more:** [Composer documentation](https://getcomposer.org/doc/) · [Laravel documentation](https://laravel.com/docs)
