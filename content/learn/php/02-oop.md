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
```
