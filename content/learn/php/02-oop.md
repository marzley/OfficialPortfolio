---
slug: oop-classes
title: Object-oriented PHP: classes, interfaces and namespaces
after: functions-includes
---
# Object-oriented PHP: classes, interfaces and namespaces

Modern PHP (Laravel, WordPress plugins, Symfony) is written with **classes**. Once you understand them, frameworks stop feeling like magic.

## A class and objects

```try-php
<?php
class Product {
    public function __construct(
        public string $name,
        public float $price,
        private int $stock = 0,          // private: only this class can change it
    ) {}

    public function inStock(): bool {
        return $this->stock > 0;
    }

    public function sell(int $qty): string {
        if ($qty > $this->stock) {
            throw new RuntimeException("Only {$this->stock} {$this->name} left");
        }
        $this->stock -= $qty;
        return sprintf("Sold %d x %s for KSh %s", $qty, $this->name, number_format($qty * $this->price));
    }

    public function getStock(): int { return $this->stock; }
}

$unga = new Product("Unga 2kg", 180, 10);
echo $unga->sell(3), "\n";
echo "Left: ", $unga->getStock(), "\n";
try {
    $unga->sell(50);
} catch (RuntimeException $e) {
    echo "Error: ", $e->getMessage(), "\n";
}
```

- `new Product(...)` creates an **object** (instance).
- `$this` is the current object; `->` accesses its properties and methods.
- **Constructor property promotion** (PHP 8): `public string $name` in the constructor declares and sets the property in one go.

## Visibility

| Keyword | Accessible from |
|---|---|
| `public` | Anywhere |
| `protected` | This class and classes that extend it |
| `private` | Only this class |

Keep data `private` and expose methods that enforce the rules (you can't sell more than you have).

## Inheritance

```try-php
<?php
abstract class Payment {
    public function __construct(protected float $amount) {}
    abstract public function fee(): float;          // every payment type must define this
    public function total(): float { return $this->amount + $this->fee(); }
    public function describe(): string {
        return static::class . ": KSh " . number_format($this->total(), 2);
    }
}

class MpesaPayment extends Payment {
    public function fee(): float { return 0; }      // customer pays M-Pesa charges separately
}

class CardPayment extends Payment {
    public function fee(): float { return round($this->amount * 0.029, 2); }  // 2.9%
}

foreach ([new MpesaPayment(2500), new CardPayment(2500)] as $p) {
    echo $p->describe(), "\n";
}
```

An **abstract** class can't be created directly; it's a template for child classes.

## Interfaces: a contract

```try-php
<?php
interface Notifier {
    public function send(string $to, string $message): bool;
}

class SmsNotifier implements Notifier {
    public function send(string $to, string $message): bool {
        echo "SMS to $to: $message\n";
        return true;
    }
}

class EmailNotifier implements Notifier {
    public function send(string $to, string $message): bool {
        echo "Email to $to: $message\n";
        return true;
    }
}

function remindAll(Notifier $n, array $clients): void {   // works with ANY notifier
    foreach ($clients as $c) {
        $n->send($c, "Your invoice is due tomorrow.");
    }
}

remindAll(new SmsNotifier(), ["0712345678"]);
remindAll(new EmailNotifier(), ["amina@example.com"]);
```

Code that depends on an **interface** instead of a specific class is easy to extend (add WhatsApp later) and easy to test.

## Static members and constants

```try-php
<?php
class Tax {
    public const VAT = 0.16;
    public static function add(float $amount): float {
        return round($amount * (1 + self::VAT), 2);
    }
}
echo Tax::add(1000), " (VAT ", Tax::VAT * 100, "%)\n";
```

## Namespaces and autoloading

Big projects group classes into **namespaces** (like folders) so names don't clash:

```php
<?php
namespace App\Payments;

class MpesaClient { /* ... */ }
```

```php
<?php
use App\Payments\MpesaClient;
$mpesa = new MpesaClient();
```

**Composer** (PHP's package manager) loads classes automatically:

```bash
composer init
composer require guzzlehttp/guzzle     # install a package
```

```php
require __DIR__ . '/vendor/autoload.php';   // one line, and every class just works
```

## Why object-oriented PHP matters

Modern PHP frameworks (Laravel, Symfony), WordPress plugins, payment SDKs and most professional PHP code are object-oriented. Classes group data and behaviour (an `Order` with its items and total), interfaces let you swap parts (M-Pesa or card payments), and namespaces with Composer autoloading keep large projects organised. If you want to work on real PHP projects, OOP is essential.

## Constructor promotion and readonly properties

```try-php
<?php
declare(strict_types=1);

final class Product {
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        private float $price,
        private int $stock = 0,
    ) {
        if ($price <= 0) throw new InvalidArgumentException("Price must be positive");
    }

    public function price(): float { return $this->price; }
    public function inStock(): bool { return $this->stock > 0; }

    public function sell(int $qty): void {
        if ($qty > $this->stock) {
            throw new RuntimeException("Only {$this->stock} {$this->name} left");
        }
        $this->stock -= $qty;
    }
}

$unga = new Product(1, 'Unga 2kg', 180, 10);
$unga->sell(3);
echo $unga->name, " in stock: ", $unga->inStock() ? 'yes' : 'no', "\n";
try {
    $unga->sell(50);
} catch (RuntimeException $e) {
    echo "Error: ", $e->getMessage(), "\n";
}
try {
    $unga->name = 'Changed';          // readonly: can't be modified
} catch (Error $e) {
    echo "Cannot change a readonly property\n";
}
```

Constructor promotion (`public readonly int $id` in the constructor) declares and assigns properties in one place.

## Enums (PHP 8.1+)

```try-php
<?php
enum OrderStatus: string {
    case Pending = 'pending';
    case Paid = 'paid';
    case Shipped = 'shipped';
    case Cancelled = 'cancelled';

    public function label(): string {
        return match ($this) {
            self::Pending => 'Waiting for payment',
            self::Paid => 'Preparing your order',
            self::Shipped => 'On the way',
            self::Cancelled => 'Cancelled',
        };
    }
}

$status = OrderStatus::from('paid');         // from a database value
echo $status->label(), "\n";
echo OrderStatus::tryFrom('unknown') === null ? "Invalid status\n" : '';
foreach (OrderStatus::cases() as $case) echo $case->value, ' ';
echo "\n";
```

Enums replace "magic strings" like `'paid'` scattered through code, so typos become errors.

## Interfaces and dependency injection

```try-php
<?php
interface PaymentGateway {
    public function charge(string $customer, float $amount): string;   // returns a reference
}

class MpesaGateway implements PaymentGateway {
    public function charge(string $customer, float $amount): string {
        return "STK push to $customer for KSh " . number_format($amount);
    }
}

class FakeGateway implements PaymentGateway {
    public array $charges = [];
    public function charge(string $customer, float $amount): string {
        $this->charges[] = [$customer, $amount];
        return 'TEST-' . count($this->charges);
    }
}

class CheckoutService {
    public function __construct(private PaymentGateway $gateway) {}   // injected

    public function checkout(string $customer, array $items): string {
        $total = array_sum(array_map(fn($i) => $i['price'] * $i['qty'], $items));
        if ($total <= 0) throw new InvalidArgumentException('Empty cart');
        return $this->gateway->charge($customer, $total);
    }
}

$items = [['price' => 180, 'qty' => 2], ['price' => 350, 'qty' => 1]];
echo (new CheckoutService(new MpesaGateway()))->checkout('254712345678', $items), "\n";

$fake = new FakeGateway();
echo (new CheckoutService($fake))->checkout('test', $items), "\n";
print_r($fake->charges);
```

`CheckoutService` doesn't create its own gateway; it receives one. That's **dependency injection**: production uses `MpesaGateway`, tests use `FakeGateway`, and the checkout code never changes. Laravel's service container does this automatically.

## Abstract classes and traits

```try-php
<?php
trait HasTimestamps {
    public ?string $createdAt = null;
    public function touch(): void { $this->createdAt = '2026-09-28 10:00'; }
}

abstract class Notification {
    use HasTimestamps;
    public function __construct(protected string $to) {}
    abstract protected function channel(): string;
    public function send(string $message): string {
        $this->touch();
        return "[{$this->channel()}] to {$this->to}: $message";
    }
}

class SmsNotification extends Notification {
    protected function channel(): string { return 'SMS'; }
}
class EmailNotification extends Notification {
    protected function channel(): string { return 'Email'; }
}

foreach ([new SmsNotification('0712345678'), new EmailNotification('amina@example.co.ke')] as $n) {
    echo $n->send('Your order has shipped'), "\n";
}
```

A **trait** copies methods and properties into classes that use it, sharing code without inheritance.

## Exceptions: custom types

```try-php
<?php
class ValidationException extends Exception {
    public function __construct(public readonly array $errors) {
        parent::__construct('Validation failed');
    }
}

function validateBooking(array $data): void {
    $errors = [];
    if (empty($data['name'])) $errors['name'] = 'Name is required';
    if (!preg_match('/^0[17]\d{8}$/', $data['phone'] ?? '')) $errors['phone'] = 'Enter a valid phone number';
    if ($errors) throw new ValidationException($errors);
}

try {
    validateBooking(['name' => '', 'phone' => '12345']);
} catch (ValidationException $e) {
    foreach ($e->errors as $field => $msg) echo "$field: $msg\n";
}
```

## Composer autoloading in practice

```json
{
  "autoload": { "psr-4": { "App\\": "src/" } }
}
```

```php
<?php
// src/Payments/MpesaGateway.php
namespace App\Payments;

class MpesaGateway implements PaymentGateway { /* ... */ }

// public/index.php
require __DIR__ . '/../vendor/autoload.php';
use App\Payments\MpesaGateway;
$gateway = new MpesaGateway();
```

Run `composer dump-autoload` after adding the autoload section. Class `App\Payments\MpesaGateway` is loaded automatically from `src/Payments/MpesaGateway.php`: no more long lists of `require` lines.

## Practice

1. Create a `BankAccount` class with promoted constructor properties, a private balance and deposit/withdraw methods with exceptions.
2. Define an `enum PaymentMethod` with a `fee(float $amount)` method.
3. Write a `Notifier` interface with SMS and email implementations, and inject one into an `OrderService`.
4. Create a `HasSlug` trait that turns a title into a URL slug.
5. Set up a Composer project with PSR-4 autoloading and two namespaced classes.

:::think Why is `new CheckoutService(new MpesaGateway())` easier to test than a CheckoutService that creates `new MpesaGateway()` inside its own constructor?
When the service creates its own gateway, every test would trigger real payment requests (or need complicated hacks). Injecting the gateway lets tests pass a fake implementation that records calls, so checkout logic can be tested quickly and safely, while production passes the real gateway.
:::

```quiz
Q: Which keyword creates a new object from a class?
A: new
Q: Which variable refers to the current object inside a method?
A: $this | this
Q: Which visibility lets only the class itself access a property?
A: private
Q: Which keyword makes a class follow a contract of methods?
A: implements | interface
Q: What is PHP's package manager called?
A: Composer
Q: Which PHP 8.1 feature defines a fixed set of named cases like Pending and Paid?
A: enum | enums
Q: What is passing a class its dependencies (like a gateway) from outside called? (two words)
A: dependency injection
Q: Which keyword copies reusable methods into a class without inheritance?
A: trait | use
Q: Which modifier prevents a property from being changed after construction?
A: readonly
```
