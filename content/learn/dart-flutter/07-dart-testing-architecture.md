---
slug: dart-testing-clean-code
title: "Testing and structuring Dart & Flutter apps: unit tests, widget tests, repositories"
after: dart-async-streams-errors
---
# Testing and structuring Dart & Flutter apps: unit tests, widget tests, repositories

An app that "works on my phone" isn't finished. Professional apps are **structured** so each part has one job, and **tested** so you can change code without breaking checkout or payments. Clients pay more for apps that don't break with every update.

## Layers: who does what

| Layer | Job | Example |
|---|---|---|
| **UI (widgets)** | Show state, send user actions | `ProductListScreen`, `CartBadge` |
| **State / logic** | Decide what happens, hold screen state | `CartController`, `ProductsNotifier` |
| **Repository** | One place to get and save data | `ProductRepository` |
| **Data sources** | Talk to the API, database or cache | `ApiClient`, `LocalCache` |
| **Models** | Plain data classes | `Product`, `Order` |

Rules: widgets never call `http` directly, and logic never imports Flutter widgets. That makes logic **testable without a phone**.

A common folder layout (feature-first):

```
lib/
├── main.dart
├── core/                 api_client.dart, formatters.dart, theme.dart
└── features/
    ├── products/
    │   ├── product.dart              (model)
    │   ├── product_repository.dart   (data)
    │   ├── products_controller.dart  (logic)
    │   └── products_screen.dart      (UI)
    └── cart/ ...
test/
├── features/cart/cart_controller_test.dart
└── widget/cart_badge_test.dart
```

## Depend on abstractions, not concrete classes

If your logic uses an **abstract** repository, tests can pass in a fake one with fixed data: no internet, no server, instant results.

```dart
class Product {
  final int id;
  final String name;
  final int price;
  final int stock;
  const Product(this.id, this.name, this.price, this.stock);
}

abstract interface class ProductRepository {
  Future<List<Product>> all();
}

// The real one would call your API with http/dio. This fake is used in tests and demos.
class FakeProductRepository implements ProductRepository {
  final List<Product> items;
  final bool fail;
  FakeProductRepository(this.items, {this.fail = false});

  @override
  Future<List<Product>> all() async {
    if (fail) throw Exception('offline');
    return items;
  }
}

class ProductsController {
  final ProductRepository repo;
  ProductsController(this.repo);

  List<Product> products = [];
  String? error;
  bool loading = false;

  Future<void> load() async {
    loading = true;
    error = null;
    try {
      products = await repo.all();
    } catch (_) {
      error = 'Could not load products. Pull down to retry.';
    } finally {
      loading = false;
    }
  }

  List<Product> get inStock => products.where((p) => p.stock > 0).toList();
  List<Product> search(String q) =>
      products.where((p) => p.name.toLowerCase().contains(q.toLowerCase().trim())).toList();
}

Future<void> main() async {
  final ok = ProductsController(FakeProductRepository(const [
    Product(1, 'Unga 2kg', 180, 12),
    Product(2, 'Sugar 1kg', 150, 0),
    Product(3, 'Unga ya Ngano', 210, 4),
  ]));
  await ok.load();
  print('loaded ${ok.products.length}, in stock ${ok.inStock.length}');
  print('search "unga": ${ok.search("unga").map((p) => p.name).toList()}');

  final offline = ProductsController(FakeProductRepository(const [], fail: true));
  await offline.load();
  print('error shown: ${offline.error}');
}
```

The real `ApiProductRepository` and the fake share one interface, so the controller never knows which one it got. In the app you pass the real one (often through **Provider**, **Riverpod** or **get_it**); in tests, the fake.

## Unit tests

Tests live in the `test/` folder and run with `flutter test` (or `dart test` for pure Dart packages). A test **arranges** data, **acts**, then **asserts** the result with `expect`.

First, the logic to test (`lib/features/cart/cart.dart`):

```dart
class Cart {
  final Map<String, ({int price, int qty})> _lines = {};

  void add(String name, int price, {int qty = 1}) {
    if (qty <= 0) throw ArgumentError('qty must be positive');
    final current = _lines[name];
    _lines[name] = (price: price, qty: (current?.qty ?? 0) + qty);
  }

  void remove(String name) => _lines.remove(name);

  int get count => _lines.values.fold(0, (sum, l) => sum + l.qty);
  int get subtotal => _lines.values.fold(0, (sum, l) => sum + l.price * l.qty);

  // 16% VAT included in prices (Kenya): VAT part = subtotal * 16 / 116, rounded
  int get vatIncluded => (subtotal * 16 / 116).round();

  int deliveryFee() => subtotal >= 2000 || subtotal == 0 ? 0 : 150;
  int get total => subtotal + deliveryFee();
}

void main() {
  final cart = Cart()
    ..add('Unga 2kg', 180, qty: 2)
    ..add('Cooking oil 1L', 320)
    ..add('Unga 2kg', 180);
  print('items: ${cart.count}, subtotal: ${cart.subtotal}, delivery: ${cart.deliveryFee()}, total: ${cart.total}');
  print('VAT included: ${cart.vatIncluded}');
}
```

And its tests (`test/cart_test.dart`). In a Flutter project you import `flutter_test` and your own file (for an app named `duka`: `import 'package:duka/features/cart/cart.dart';`); pure Dart packages use `package:test/test.dart`, which has the same functions. Here a short copy of `Cart` is included so the file stands alone:

```dart
import 'package:flutter_test/flutter_test.dart';

// In your project this comes from: import 'package:duka/features/cart/cart.dart';
class Cart {
  final Map<String, ({int price, int qty})> _lines = {};
  void add(String name, int price, {int qty = 1}) {
    if (qty <= 0) throw ArgumentError('qty must be positive');
    _lines[name] = (price: price, qty: (_lines[name]?.qty ?? 0) + qty);
  }
  int get count => _lines.values.fold(0, (sum, l) => sum + l.qty);
  int get subtotal => _lines.values.fold(0, (sum, l) => sum + l.price * l.qty);
  int deliveryFee() => subtotal >= 2000 || subtotal == 0 ? 0 : 150;
  int get total => subtotal + deliveryFee();
}

void main() {
  group('Cart', () {
    late Cart cart;
    setUp(() => cart = Cart());          // a fresh cart before every test

    test('starts empty with no delivery fee', () {
      expect(cart.count, 0);
      expect(cart.total, 0);
    });

    test('adding the same item twice increases its quantity', () {
      cart.add('Unga 2kg', 180);
      cart.add('Unga 2kg', 180, qty: 2);
      expect(cart.count, 3);
      expect(cart.subtotal, 540);
    });

    test('charges KSh 150 delivery below KSh 2,000', () {
      cart.add('Sugar 1kg', 150);
      expect(cart.deliveryFee(), 150);
      expect(cart.total, 300);
    });

    test('free delivery from KSh 2,000', () {
      cart.add('Rice 5kg', 1000, qty: 2);
      expect(cart.deliveryFee(), 0);
    });

    test('rejects zero or negative quantity', () {
      expect(() => cart.add('Milk', 60, qty: 0), throwsArgumentError);
    });
  });
}
```

Test the **edges**: empty cart, exactly KSh 2,000, zero quantity, a failed API call. Bugs hide at boundaries.

### A tiny test runner you can run here

To see the idea without installing packages, here is a mini `expect` in plain Dart:

```dart
var passed = 0, failed = 0;

void check(String name, Object? actual, Object? expected) {
  if (actual == expected) {
    passed++;
    print('PASS  $name');
  } else {
    failed++;
    print('FAIL  $name: expected $expected, got $actual');
  }
}

int deliveryFee(int subtotal) => subtotal >= 2000 || subtotal == 0 ? 0 : 150;

String? validatePhone(String input) {
  final d = input.replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty) return 'Enter your phone number';
  if (!RegExp(r'^(0|254)[17]\d{8}$').hasMatch(d)) return 'Enter a valid Safaricom or Airtel number';
  return null;     // null means valid
}

void main() {
  check('empty cart has no delivery fee', deliveryFee(0), 0);
  check('KSh 1,999 pays delivery', deliveryFee(1999), 150);
  check('KSh 2,000 is free', deliveryFee(2000), 0);
  check('valid 07 number', validatePhone('0712 345 678'), null);
  check('valid 254 number', validatePhone('254112345678'), null);
  check('empty phone', validatePhone(''), 'Enter your phone number');
  check('too short', validatePhone('07123'), 'Enter a valid Safaricom or Airtel number');
  print('\n$passed passed, $failed failed');
}
```

## Testing async code and errors

`test` waits for `async` test bodies. Use matchers like `throwsA`, `completion` and `emitsInOrder`:

```dart
import 'package:flutter_test/flutter_test.dart';

Stream<int> countdown(int from) async* {
  for (var s = from; s >= 0; s--) {
    yield s;
  }
}

Future<int> loadStock(String item) async {
  if (item.isEmpty) throw ArgumentError('item required');
  return 12;
}

void main() {
  test('loads stock', () async {
    expect(await loadStock('unga'), 12);
  });

  test('fails for an empty item name', () {
    expect(loadStock(''), throwsA(isA<ArgumentError>()));
  });

  test('countdown emits 3, 2, 1, 0 then closes', () {
    expect(countdown(3), emitsInOrder([3, 2, 1, 0, emitsDone]));
  });
}
```

## Widget tests

Widget tests build a widget in a fake screen, tap and type, and check what's shown. They run in seconds, without an emulator:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class CounterButton extends StatefulWidget {
  const CounterButton({super.key});
  @override
  State<CounterButton> createState() => _CounterButtonState();
}

class _CounterButtonState extends State<CounterButton> {
  int qty = 1;
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          key: const Key('minus'),
          icon: const Icon(Icons.remove),
          onPressed: qty > 1 ? () => setState(() => qty--) : null,
        ),
        Text('$qty', key: const Key('qty')),
        IconButton(
          key: const Key('plus'),
          icon: const Icon(Icons.add),
          onPressed: () => setState(() => qty++),
        ),
      ],
    );
  }
}

void main() {
  testWidgets('quantity goes up and never below 1', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: Scaffold(body: CounterButton())));

    expect(find.text('1'), findsOneWidget);

    await tester.tap(find.byKey(const Key('plus')));
    await tester.pump();                       // rebuild after setState
    expect(find.text('2'), findsOneWidget);

    await tester.tap(find.byKey(const Key('minus')));
    await tester.tap(find.byKey(const Key('minus')));   // disabled at 1: nothing happens
    await tester.pump();
    expect(find.text('1'), findsOneWidget);
  });
}
```

| Test type | Speed | Tests | Tool |
|---|---|---|---|
| **Unit** | Milliseconds | Functions and classes (cart, validators, controllers) | `test` / `flutter_test` |
| **Widget** | Fast | One screen or widget, taps and text | `flutter_test` (`testWidgets`) |
| **Integration** | Slow | The whole app on a device or emulator | `integration_test` |

Aim for **many** unit tests, **some** widget tests and **a few** integration tests for critical flows (sign in, checkout, pay).

## Code quality tools

- `dart format .` formats code consistently.
- `dart analyze` (or `flutter analyze`) finds bugs and style problems; configure rules in `analysis_options.yaml` with `flutter_lints` or `very_good_analysis`.
- `flutter test --coverage` shows which lines your tests exercise.
- **CI**: run format, analyze and test on every push with GitHub Actions, so broken code never reaches the Play Store.

A minimal GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          channel: stable
      - run: flutter pub get
      - run: dart format --set-exit-if-changed .
      - run: flutter analyze
      - run: flutter test
```

## Checklist before you hand an app to a client

- [ ] Logic separated from widgets; data through repositories
- [ ] Unit tests for money, validation and status rules
- [ ] Widget tests for key screens (login, cart)
- [ ] Loading, error and empty states on every screen
- [ ] `flutter analyze` clean; code formatted
- [ ] Secrets (API keys, M-Pesa passkey) on the server, never in the app
- [ ] Release build tested on a low-end Android phone

```quiz
Q: Which folder holds a Dart project's tests?
A: test | test/
Q: Which function checks a result in a Dart test?
A: expect | expect()
Q: Which function runs before every test in a group?
A: setUp | setup
Q: Which function writes a widget test?
A: testWidgets
Q: After a tap, which tester method rebuilds the widget?
A: pump | tester.pump | pump()
Q: Which command finds bugs and style problems in Dart code?
A: dart analyze | flutter analyze | analyze
Q: Should there be more unit tests or integration tests? (unit or integration)
A: unit | unit tests
```
