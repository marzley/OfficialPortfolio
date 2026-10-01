---
slug: dart-generics-enums-records
title: "Dart in depth: generics, enums, records, extensions and sealed classes"
after: dart-classes-async
---
# Dart in depth: generics, enums, records, extensions and sealed classes

You know variables, functions, lists, classes and async. This lesson covers the features that make professional Flutter code short, safe and easy to change: **generics**, **enhanced enums**, **records and patterns**, **extension methods** and **sealed classes**. Every example is a complete program you can run with `dart run` (or paste into DartPad at dartpad.dev).

## Generics: one class, many types

A **generic** type has a placeholder (usually `T`) that is filled in when you use it. You already use generics: `List<String>`, `Map<String, int>`, `Future<User>`.

Writing your own is how you avoid copy-pasting the same class for products, customers and orders:

```dart
// A result of an operation that can succeed with a value of type T, or fail with a message.
class Result<T> {
  final T? value;
  final String? error;
  const Result.ok(T this.value) : error = null;
  const Result.fail(String this.error) : value = null;
  bool get isOk => error == null;
}

class Product {
  final String name;
  final int price;
  const Product(this.name, this.price);
  @override
  String toString() => '$name (KSh $price)';
}

Result<int> parsePrice(String text) {
  final n = int.tryParse(text.trim());
  if (n == null) return const Result.fail('Price must be a number');
  if (n <= 0) return const Result.fail('Price must be above 0');
  return Result.ok(n);
}

Result<Product> makeProduct(String name, String priceText) {
  if (name.trim().length < 2) return const Result.fail('Name is too short');
  final price = parsePrice(priceText);
  if (!price.isOk) return Result.fail(price.error!);
  return Result.ok(Product(name.trim(), price.value!));
}

void main() {
  for (final input in [('Unga 2kg', '180'), ('U', '50'), ('Sugar', 'abc'), ('Milk', '-5')]) {
    final r = makeProduct(input.$1, input.$2);
    print(r.isOk ? 'OK: ${r.value}' : 'Error: ${r.error}');
  }
}
```

### Generic functions and bounds

`T extends num` means "T can be any number type", so you can use `+` and `>` on it:

```dart
T largest<T extends num>(List<T> items) {
  var best = items.first;
  for (final x in items) {
    if (x > best) best = x;
  }
  return best;
}

// A generic cache: works for any key and value types
class Cache<K, V> {
  final _store = <K, V>{};
  int hits = 0, misses = 0;

  V getOrAdd(K key, V Function() create) {
    if (_store.containsKey(key)) {
      hits++;
      return _store[key] as V;
    }
    misses++;
    return _store[key] = create();
  }
}

void main() {
  print(largest([3, 9, 4]));           // int
  print(largest([2.5, 1.75, 2.9]));    // double

  final prices = Cache<String, int>();
  for (final item in ['unga', 'sugar', 'unga', 'unga']) {
    prices.getOrAdd(item, () => item == 'unga' ? 180 : 150);
  }
  print('hits: ${prices.hits}, misses: ${prices.misses}');
}
```

## Enhanced enums

An `enum` is a fixed set of values. In Dart, enums can have **fields, constructors and methods**, which removes lots of `if`/`switch` code:

```dart
enum OrderStatus {
  pending('Waiting for payment', false),
  paid('Paid', false),
  shipped('On the way', false),
  delivered('Delivered', true),
  cancelled('Cancelled', true);

  final String label;
  final bool isFinal;
  const OrderStatus(this.label, this.isFinal);

  // Which status can come next?
  List<OrderStatus> get next => switch (this) {
        OrderStatus.pending => [OrderStatus.paid, OrderStatus.cancelled],
        OrderStatus.paid => [OrderStatus.shipped, OrderStatus.cancelled],
        OrderStatus.shipped => [OrderStatus.delivered],
        OrderStatus.delivered || OrderStatus.cancelled => [],
      };

  bool canMoveTo(OrderStatus other) => next.contains(other);
}

void main() {
  for (final s in OrderStatus.values) {
    print('${s.name.padRight(10)} ${s.label.padRight(20)} final: ${s.isFinal}');
  }
  print(OrderStatus.pending.canMoveTo(OrderStatus.paid));      // true
  print(OrderStatus.delivered.canMoveTo(OrderStatus.pending)); // false
  print(OrderStatus.values.byName('shipped').label);          // from a JSON string
}
```

`values.byName('shipped')` turns the text from an API back into the enum. It throws if the name doesn't exist, so validate API data first.

## Records: return several values without a class

A **record** groups values together: `(int, String)` or with names `({int total, int count})`. Great for returning more than one thing from a function:

```dart
({int total, int count, double average}) summarise(List<int> sales) {
  final total = sales.fold(0, (sum, s) => sum + s);
  return (total: total, count: sales.length, average: sales.isEmpty ? 0 : total / sales.length);
}

(String, int) splitItem(String text) {
  final parts = text.split('x');
  return (parts[0].trim(), int.parse(parts[1].trim()));
}

void main() {
  final s = summarise([1200, 450, 3000, 800]);
  print('Total ${s.total}, ${s.count} sales, average ${s.average.toStringAsFixed(1)}');

  // Destructuring: unpack a record into variables
  final (name, qty) = splitItem('Unga 2kg x 3');
  print('$name: $qty');

  final (:total, :count, average: _) = summarise([100, 200]);
  print('$total from $count');
}
```

## Patterns and switch expressions

**Patterns** let you check the shape of data and pull values out in one step. They are perfect for JSON from an API:

```dart
String describe(Object? json) => switch (json) {
      {'type': 'sale', 'amount': int amount} when amount >= 10000 => 'Big sale: KSh $amount',
      {'type': 'sale', 'amount': int amount} => 'Sale: KSh $amount',
      {'type': 'refund', 'amount': int amount, 'reason': String reason} => 'Refund KSh $amount ($reason)',
      [] => 'Empty list',
      [var first, ...] => 'List starting with $first',
      null => 'Nothing received',
      _ => 'Unknown data',
    };

void main() {
  print(describe({'type': 'sale', 'amount': 1240}));
  print(describe({'type': 'sale', 'amount': 25000}));
  print(describe({'type': 'refund', 'amount': 300, 'reason': 'damaged'}));
  print(describe({'type': 'sale', 'amount': '1240'}));   // amount is a String, not int
  print(describe([5, 6, 7]));
  print(describe(null));

  // if-case: check and extract in an if statement
  final Object data = {'phone': '0712345678'};
  if (data case {'phone': String phone} when phone.length == 10) {
    print('Valid phone field: $phone');
  }
}
```

Notice that `'1240'` (text) doesn't match `int amount`. Patterns check **types**, which catches bad API data before it crashes your app.

## Sealed classes: every case handled

A `sealed` class has a fixed set of subclasses in the same file. When you `switch` over it, Dart **forces** you to handle every subclass. This is the cleanest way to model screen states (loading, loaded, error) and payment results:

```dart
sealed class PaymentState {}

class Idle extends PaymentState {}

class WaitingForPin extends PaymentState {
  final String checkoutId;
  WaitingForPin(this.checkoutId);
}

class Paid extends PaymentState {
  final String receipt;
  final int amount;
  Paid(this.receipt, this.amount);
}

class Failed extends PaymentState {
  final int code;
  final String message;
  Failed(this.code, this.message);
}

String screenText(PaymentState state) => switch (state) {
      Idle() => 'Tap "Pay with M-Pesa"',
      WaitingForPin(:final checkoutId) => 'Enter your M-Pesa PIN on your phone ($checkoutId)',
      Paid(:final receipt, :final amount) => 'Paid KSh $amount. Receipt $receipt',
      Failed(code: 1032) => 'You cancelled the payment',
      Failed(:final message) => 'Payment failed: $message',
    };

void main() {
  final states = <PaymentState>[
    Idle(),
    WaitingForPin('ws_CO_0110'),
    Paid('SJ12ABC3DE', 1240),
    Failed(1032, 'Request cancelled by user'),
    Failed(1, 'Insufficient balance'),
  ];
  for (final s in states) {
    print(screenText(s));
  }
}
```

If you add a new subclass (say `Refunded`) and forget it in the switch, the code **won't compile** until you handle it. That is how big apps stay bug-free when they grow.

## Extension methods: add methods to existing types

You can't edit `int` or `String`, but you can **extend** them. Use this for formatting money, phone numbers and dates everywhere in your app:

```dart
extension Money on int {
  String get ksh {
    final digits = toString();
    final buf = StringBuffer();
    for (var i = 0; i < digits.length; i++) {
      if (i > 0 && (digits.length - i) % 3 == 0) buf.write(',');
      buf.write(digits[i]);
    }
    return 'KSh $buf';
  }
}

extension KenyanPhone on String {
  String? get msisdn {
    final d = replaceAll(RegExp(r'\D'), '');
    if (RegExp(r'^0[17]\d{8}$').hasMatch(d)) return '254${d.substring(1)}';
    if (RegExp(r'^254[17]\d{8}$').hasMatch(d)) return d;
    return null;
  }
}

extension SumBy<T> on Iterable<T> {
  int sumBy(int Function(T) pick) => fold(0, (total, x) => total + pick(x));
}

void main() {
  print(1240.ksh);          // KSh 1,240
  print(1500000.ksh);       // KSh 1,500,000
  print('0712 345 678'.msisdn);
  print('12345'.msisdn);

  final cart = [('Unga', 180, 2), ('Sugar', 150, 1)];
  print(cart.sumBy((item) => item.$2 * item.$3).ksh);
}
```

## Immutability and `copyWith`

In Flutter, state objects should be **immutable**: instead of changing an object, create a new one with the changes. The `copyWith` pattern makes that easy:

```dart
class CartItem {
  final String name;
  final int price;
  final int qty;
  const CartItem({required this.name, required this.price, this.qty = 1});

  CartItem copyWith({String? name, int? price, int? qty}) =>
      CartItem(name: name ?? this.name, price: price ?? this.price, qty: qty ?? this.qty);

  int get subtotal => price * qty;

  @override
  bool operator ==(Object other) =>
      other is CartItem && other.name == name && other.price == price && other.qty == qty;

  @override
  int get hashCode => Object.hash(name, price, qty);

  @override
  String toString() => '$name x$qty = $subtotal';
}

void main() {
  const a = CartItem(name: 'Unga 2kg', price: 180);
  final b = a.copyWith(qty: 3);
  print(a);                       // unchanged
  print(b);
  print(a == const CartItem(name: 'Unga 2kg', price: 180));   // true: same values
  print(a == b);                                              // false
}
```

Overriding `==` and `hashCode` means two objects with the same values are equal, so Flutter (and state libraries like Riverpod and Bloc) can tell when something really changed. Packages like **freezed** generate this code for you in larger apps.

## Summary

| Feature | Use it for |
|---|---|
| Generics `<T>` | Reusable classes and functions (Result, Cache, Repository) |
| Enhanced enums | Statuses with labels, colours and rules |
| Records `(a, b)` | Returning several values; quick groups |
| Patterns / `switch` expressions | Safely reading JSON and branching on shapes |
| Sealed classes | Screen states and results where every case must be handled |
| Extensions | Formatting money, phones and dates everywhere |
| Immutability + `copyWith` | Predictable Flutter state |

```quiz
Q: In List<T>, what is T called? (one word)
A: generic | type parameter | placeholder
Q: Which keyword limits a generic, as in <T ... num>?
A: extends
Q: Which enum method turns the text 'shipped' into OrderStatus.shipped?
A: byName | values.byName
Q: What is (int, String) called in Dart?
A: record | a record
Q: Which class modifier makes switch force you to handle every subclass?
A: sealed
Q: Which keyword adds new methods to an existing type like int?
A: extension
Q: What is the method called that makes a changed copy of an immutable object?
A: copyWith | copywith
```
