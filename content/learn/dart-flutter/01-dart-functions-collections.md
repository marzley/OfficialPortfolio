---
slug: dart-functions-collections
title: Dart functions, lists, maps and null safety
after: dart-basics
---
# Dart functions, lists, maps and null safety

Flutter apps are written in **Dart**. Before building screens, get comfortable with Dart's functions, collections and its **null safety**, which prevents the most common app crash ("null is not a subtype of...").

> Dart doesn't run in our editor. Copy any example into **DartPad** (dartpad.dev), which runs Dart and Flutter in your browser for free, then press Run.

## Functions

```dart
double withVat(double amount, {double rate = 16}) {   // named parameter with a default
  return amount * (1 + rate / 100);
}

String greet(String name, [String? title]) {          // [ ] = optional positional
  return title == null ? 'Habari $name' : 'Habari $title $name';
}

int square(int n) => n * n;                           // arrow function for one expression

void main() {
  print(withVat(1000));              // 1160.0
  print(withVat(1000, rate: 0));     // named argument
  print(greet('Wanjiru'));
  print(greet('Otieno', 'Dr.'));
  print(square(9));
}
```

| Parameter style | Declared as | Called as |
|---|---|---|
| Required positional | `f(int a)` | `f(3)` |
| Optional positional | `f([int? a])` | `f()` or `f(3)` |
| Named (optional) | `f({int a = 0})` | `f(a: 3)` |
| Named required | `f({required int a})` | `f(a: 3)` |

Flutter widgets use **named parameters** everywhere: `Text('Hi', style: ...)`, `Padding(padding: ..., child: ...)`.

## Lists

```dart
void main() {
  final towns = <String>['Nyeri', 'Meru'];
  towns.add('Embu');
  towns.insert(0, 'Nanyuki');
  print('${towns.length} towns, first: ${towns.first}');

  final prices = [180, 350, 60, 1200];
  final withVat = prices.map((p) => (p * 1.16).round()).toList();
  final cheap = prices.where((p) => p < 300).toList();
  final total = prices.reduce((a, b) => a + b);
  print('$withVat $cheap $total');

  prices.sort();
  print(prices);
  for (final p in prices) {
    print('KSh $p');
  }

  final menu = ['Home', 'Shop', if (true) 'Offers', for (var i = 1; i <= 2; i++) 'Page $i'];
  print(menu);   // collection if/for: used a lot for building widget lists
}
```

## Maps and sets

```dart
void main() {
  final stock = <String, int>{'Unga': 12, 'Sugar': 0, 'Oil': 7};
  stock['Rice'] = 20;
  stock.update('Unga', (v) => v - 2);
  print(stock['Oil']);            // 7
  print(stock['Beans']);          // null: missing key
  print(stock.containsKey('Sugar'));
  stock.forEach((item, qty) => print('$item: $qty'));

  final unique = {'Otieno', 'Wanjiru', 'Otieno'};   // a Set
  print(unique.length);           // 2
}
```

## Null safety

In Dart, a variable **cannot be null unless its type ends with `?`**. The compiler forces you to handle the null case.

```dart
void main() {
  String name = 'Amina';        // can never be null
  String? nickname;             // may be null (starts as null)

  // print(nickname.length);    // compile error: nickname might be null
  print(nickname?.length);      // ?. : null if nickname is null
  print(nickname ?? 'No nickname');   // ?? : a default value

  nickname = 'Mina';
  if (nickname != null) {
    print(nickname.length);     // safe: Dart knows it's not null here
  }

  int? maybeQty = int.tryParse('abc');   // null if not a number
  final qty = maybeQty ?? 1;
  print(qty);

  late String token;            // late: "I promise to set it before use"
  token = 'abc123';
  print(token);
}
```

| Syntax | Meaning |
|---|---|
| `String?` | May be null |
| `x?.y` | Access only if x isn't null |
| `x ?? y` | Use y if x is null |
| `x ??= y` | Assign y only if x is null |
| `x!` | "I'm sure it's not null" (crashes if you're wrong: avoid) |
| `late` | Initialised later, before first use |

## String interpolation

```dart
final item = 'Cake';
final qty = 2;
final price = 1800.0;
print('$qty x $item = KSh ${(qty * price).toStringAsFixed(2)}');
```

`$name` inserts a variable; `${expression}` inserts any expression.

## Why Dart functions and collections matter for Flutter

Every Flutter screen is built from Dart: lists of products become `ListView`s, maps hold JSON from APIs, and functions handle button taps, validation and calculations. Fluency with Dart's collection methods (`map`, `where`, `fold`), named parameters and null safety makes Flutter code shorter, safer and easier to read. Flutter developers are in demand for cross-platform apps used by fintechs, retailers, logistics companies and startups.

## Named, required and default parameters

```dart
String formatPrice(double amount, {String currency = 'KSh', int decimals = 0}) {
  return '$currency ${amount.toStringAsFixed(decimals)}';
}

String orderSummary({required String customer, required int items, double delivery = 0}) {
  final fee = delivery == 0 ? 'free delivery' : 'delivery ${formatPrice(delivery)}';
  return '$customer: $items items, $fee';
}

void main() {
  print(formatPrice(2500));
  print(formatPrice(19.5, currency: 'USD', decimals: 2));
  print(orderSummary(customer: 'Wanjiru', items: 3));
  print(orderSummary(customer: 'Otieno', items: 1, delivery: 250));
}
```

This is the same style Flutter widgets use: `Text('Hi', style: ...)`, `Padding(padding: ..., child: ...)`. `required` makes a named parameter compulsory.

## Functions as values and closures

```dart
typedef PriceRule = double Function(double price);

PriceRule percentOff(double percent) => (price) => price * (1 - percent / 100);
PriceRule flatOff(double amount) => (price) => (price - amount).clamp(0, double.infinity).toDouble();

double applyRules(double price, List<PriceRule> rules) =>
    rules.fold(price, (current, rule) => rule(current));

void main() {
  final rules = [percentOff(10), flatOff(100)];
  print(applyRules(2000, rules));        // 2000 -> 1800 -> 1700

  var counter = 0;
  void increment() => counter++;         // closure captures counter
  increment();
  increment();
  print('Counter: $counter');
}
```

Callbacks like `onPressed: () => setState(() => count++)` in Flutter are exactly these closures.

## Collection methods in depth

```dart
class Product {
  final String name;
  final String category;
  final double price;
  final int stock;
  const Product(this.name, this.category, this.price, this.stock);
}

void main() {
  const products = [
    Product('Unga 2kg', 'Food', 180, 12),
    Product('Sugar 1kg', 'Food', 210, 0),
    Product('Soap', 'Home', 60, 30),
    Product('Cooking oil 1L', 'Food', 350, 7),
  ];

  final inStock = products.where((p) => p.stock > 0).toList();
  final names = inStock.map((p) => p.name).join(', ');
  final stockValue = products.fold<double>(0, (sum, p) => sum + p.price * p.stock);
  final cheapest = products.reduce((a, b) => a.price < b.price ? a : b);
  final anyOut = products.any((p) => p.stock == 0);
  final sorted = [...products]..sort((a, b) => b.price.compareTo(a.price));

  print('In stock: $names');
  print('Stock value: KSh ${stockValue.toStringAsFixed(0)}');
  print('Cheapest: ${cheapest.name}');
  print('Anything out of stock? $anyOut');
  print('Most expensive first: ${sorted.map((p) => p.name).toList()}');

  final byCategory = <String, List<Product>>{};
  for (final p in products) {
    byCategory.putIfAbsent(p.category, () => []).add(p);
  }
  byCategory.forEach((cat, list) => print('$cat: ${list.length} products'));
}
```

`[...products]..sort(...)` copies the list with the spread operator and sorts the copy using the cascade operator `..`, leaving the original unchanged.

## Cascades: configuring objects fluently

```dart
class Receipt {
  final lines = <String>[];
  double total = 0;
  void add(String item, double amount) {
    lines.add('$item: ${amount.toStringAsFixed(0)}');
    total += amount;
  }
}

void main() {
  final r = Receipt()
    ..add('Unga', 180)
    ..add('Milk', 120)
    ..add('Bread', 65);
  print(r.lines.join('\n'));
  print('Total: ${r.total.toStringAsFixed(0)}');
}
```

## Records and pattern matching (Dart 3)

```dart
(double min, double max) range(List<double> values) {
  final sorted = [...values]..sort();
  return (sorted.first, sorted.last);
}

String describePayment(Map<String, Object?> json) {
  return switch (json) {
    {'method': 'mpesa', 'phone': String phone} => 'M-Pesa from $phone',
    {'method': 'card', 'last4': String last4} => 'Card ending $last4',
    _ => 'Unknown payment',
  };
}

void main() {
  final (low, high) = range([67, 82, 45, 90]);
  print('Lowest $low, highest $high');

  print(describePayment({'method': 'mpesa', 'phone': '0712345678'}));
  print(describePayment({'method': 'card', 'last4': '4242'}));
  print(describePayment({'method': 'cash'}));
}
```

Records return several values without creating a class; patterns safely pull values out of JSON-like maps, with the compiler checking types.

## Null safety with collections

```dart
void main() {
  final stock = <String, int>{'unga': 40, 'sugar': 25};
  final salt = stock['salt'];               // int? because the key may be missing
  print(salt ?? 0);
  print(stock['unga']! + 10);               // ! only when you're sure

  final List<String?> phones = ['0712000001', null, '0722000002'];
  final valid = phones.whereType<String>().toList();   // removes nulls
  print(valid);

  final first = phones.firstWhere((p) => p != null && p.startsWith('07'), orElse: () => null);
  print(first);
}
```

`whereType<String>()` turns a `List<String?>` into a list of non-null strings, a common clean-up step for API data.

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `.toList()` after `map`/`where` | They return lazy iterables; call `.toList()` when you need a list |
| `sort()` returns void, so `final s = list.sort()` fails | Sort in place, or `[...list]..sort()` |
| Using `!` everywhere | Use `??`, `?.` and proper checks |
| Mutating a `const` list | Copy it first with the spread operator |
| `reduce` on an empty list | Throws; use `fold` with a starting value |

## Practice

1. Write `double cartTotal(List<Map<String, num>> items, {double vat = 0.16})`.
2. Group a list of students by form into a `Map<int, List<String>>`.
3. Return the lowest and highest mark as a record and destructure it.
4. Use a switch with patterns to describe different notification maps (sms, email, push).
5. Clean a list of nullable phone numbers with `whereType` and keep only valid 10-digit numbers.

:::think Why does `final total = items.map((i) => i.price).reduce((a, b) => a + b);` crash for an empty cart, and what's safer?
`reduce` needs at least one element and throws a StateError on an empty list. `fold<double>(0, (sum, i) => sum + i.price)` starts from 0 and works for empty lists, returning 0.
:::

```quiz
Q: Which free website runs Dart and Flutter code in the browser?
A: DartPad | dartpad.dev
Q: Which symbol after a type means the variable may be null?
A: ? | question mark
Q: Which operator gives a default value when something is null?
A: ??
Q: Which keyword makes a named parameter compulsory?
A: required
Q: Which list method keeps only matching items?
A: where | where()
Q: Which operator calls several methods on the same object in a row?
A: .. | cascade | cascade operator
Q: Which collection method combines items with a starting value and works on empty lists?
A: fold
Q: Which keyword makes a named parameter compulsory in Dart?
A: required
Q: Which method removes nulls from a List<String?>? (whereType<...>)
A: whereType | whereType<String>
```
