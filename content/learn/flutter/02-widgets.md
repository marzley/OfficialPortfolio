---
slug: widgets-stateless-stateful
title: Widgets in depth: stateless, stateful and the build method
after: setup-first-app
---
# Widgets in depth: stateless, stateful and the build method

In Flutter **everything on screen is a widget**: text, buttons, padding, a whole screen, even the app itself. A widget is a *description* of part of the screen. Flutter reads your descriptions and draws them.

There are two kinds you write yourself:

| | StatelessWidget | StatefulWidget |
|---|---|---|
| Changes while on screen? | No. It only shows what it's given. | Yes. It keeps **state** that can change. |
| Examples | A product card, a logo, a label | A counter, a form, a like button, a cart |
| Rebuilds when | Its parent rebuilds it with new values | You call `setState()` (or its parent rebuilds it) |

## A StatelessWidget

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: PriceTag(item: 'Sukuma', price: 20)))));

class PriceTag extends StatelessWidget {
  final String item;       // values passed in are final: they don't change
  final int price;

  const PriceTag({super.key, required this.item, required this.price});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text('$item: KSh $price', style: const TextStyle(fontSize: 22)),
      ),
    );
  }
}
```

- The **constructor** receives data (`item`, `price`). `required` means the caller must pass it.
- **`build()`** returns the widgets to draw. Flutter calls it whenever it needs to (you never call it yourself).
- `super.key` passes an optional **key** to the parent class (more on keys below).

## A StatefulWidget

A stateful widget is two classes: the widget (settings that don't change) and its **State** object (data that changes).

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: QuantityPicker(item: 'Unga 2kg')))));

class QuantityPicker extends StatefulWidget {
  final String item;
  const QuantityPicker({super.key, required this.item});

  @override
  State<QuantityPicker> createState() => _QuantityPickerState();
}

class _QuantityPickerState extends State<QuantityPicker> {
  int qty = 1;                                   // the state

  void change(int by) {
    setState(() {                                // tell Flutter the state changed
      qty = (qty + by).clamp(1, 99);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(widget.item, style: const TextStyle(fontSize: 18)),   // widget.x reads the widget's values
        IconButton(onPressed: qty > 1 ? () => change(-1) : null, icon: const Icon(Icons.remove)),
        Text('$qty', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        IconButton(onPressed: () => change(1), icon: const Icon(Icons.add)),
      ],
    );
  }
}
```

Key rules:

1. **Only change state inside `setState(() { ... })`.** If you change `qty` without it, the number changes in memory but the screen doesn't update.
2. The State class reads the widget's values with **`widget.`** (`widget.item`).
3. A class name starting with `_` is **private** to its file. That's why state classes are called `_SomethingState`.
4. Passing `null` to `onPressed` **disables** a button (it goes grey). That's how the minus button stops at 1.

## The lifecycle of State

| Method | When it runs | Use it to |
|---|---|---|
| `initState()` | Once, when the widget first appears | Start loading data, create controllers, start timers |
| `didChangeDependencies()` | After `initState`, and when an inherited value (theme, locale) changes | Read `Theme.of(context)` etc. once |
| `build()` | Every time the screen needs drawing | Return the widgets (keep it fast: no network calls here!) |
| `didUpdateWidget(old)` | When the parent rebuilds with new values | React to changed settings |
| `dispose()` | When the widget is removed for good | Cancel timers, close controllers and streams |

```dart
import 'dart:async';
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: OfferCountdown(seconds: 90)))));

class OfferCountdown extends StatefulWidget {
  final int seconds;
  const OfferCountdown({super.key, required this.seconds});

  @override
  State<OfferCountdown> createState() => _OfferCountdownState();
}

class _OfferCountdownState extends State<OfferCountdown> {
  late int left;
  Timer? timer;

  @override
  void initState() {
    super.initState();                       // always call super first
    left = widget.seconds;
    timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (left == 0) {
        timer?.cancel();
      } else {
        setState(() => left--);
      }
    });
  }

  @override
  void dispose() {
    timer?.cancel();                         // stop the timer or it keeps running after the screen closes
    super.dispose();                         // call super last
  }

  @override
  Widget build(BuildContext context) {
    final m = left ~/ 60, s = left % 60;
    return Text(
      left == 0 ? 'Offer ended' : 'Offer ends in $m:${s.toString().padLeft(2, '0')}',
      style: TextStyle(fontSize: 24, color: left < 30 ? Colors.red : null),
    );
  }
}
```

Forgetting `dispose()` causes **memory leaks** and the famous error *"setState() called after dispose()"*.

## BuildContext

Every `build()` gets a `BuildContext`: the widget's **position in the tree**. You use it to find things above you:

```dart
final theme = Theme.of(context);                 // the app's colours and text styles
final size = MediaQuery.sizeOf(context);          // the screen size
Navigator.of(context).pop();                      // close this screen
ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Saved')));
```

## How Flutter rebuilds (and why it's fast)

When you call `setState`, Flutter calls `build()` again **for that widget and its children**. That sounds slow, but widgets are just light descriptions. Flutter compares the new tree with the old one and only repaints what actually changed.

Tips that keep apps smooth:

- Add **`const`** to widgets that never change: they're skipped during rebuilds.
- Keep state **as low in the tree as possible**: put the counter in a small widget, not the whole screen.
- Split big `build()` methods into **small widget classes** (not helper methods): each can rebuild on its own.
- Never do heavy work (network calls, big loops, reading files) inside `build()`.

## Keys

Keys help Flutter tell apart widgets of the same type when a list changes order.

```dart
ListView(
  children: [
    for (final item in items) ItemTile(key: ValueKey(item.id), item: item),
  ],
)
```

Without keys, deleting the first item of a list of stateful tiles can make the **wrong tile keep the wrong state** (for example a ticked checkbox moving to another row). Use `ValueKey(id)` with a unique id whenever list items have state or can be reordered.

## Composition: build big from small

Flutter apps are made of many small widgets combined. Compare:

| Instead of | Do |
|---|---|
| One 300-line `build()` | Screen widget → `ProductList` → `ProductTile` → `PriceTag` |
| Copy-pasting the same card | A `ProductCard` widget with parameters |
| A method `Widget _header()` | A class `class Header extends StatelessWidget` (can be `const` and rebuilds on its own) |

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: ShopScreen()));

class Product {
  final String name;
  final int price;
  final bool inStock;
  const Product(this.name, this.price, this.inStock);
}

const products = [Product('Unga 2kg', 180, true), Product('Sugar 1kg', 150, false), Product('Milk 500ml', 60, true)];

class ShopScreen extends StatelessWidget {
  const ShopScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Shop')),
      body: ListView(children: [for (final p in products) ProductTile(product: p)]),
    );
  }
}

class ProductTile extends StatelessWidget {
  final Product product;
  const ProductTile({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const Icon(Icons.shopping_basket),
      title: Text(product.name),
      subtitle: StockBadge(inStock: product.inStock),
      trailing: Text('KSh ${product.price}', style: Theme.of(context).textTheme.titleMedium),
    );
  }
}

class StockBadge extends StatelessWidget {
  final bool inStock;
  const StockBadge({super.key, required this.inStock});

  @override
  Widget build(BuildContext context) {
    return Text(inStock ? 'In stock' : 'Sold out', style: TextStyle(color: inStock ? Colors.green : Colors.red));
  }
}
```

## Common errors explained

| Error message | Cause | Fix |
|---|---|---|
| `setState() called after dispose()` | A timer or network call finished after the screen closed | Cancel it in `dispose()`, or check `if (!mounted) return;` before `setState` |
| `The method 'setState' isn't defined` | You're in a StatelessWidget | Make it a StatefulWidget (your editor's quick fix: *Convert to StatefulWidget*) |
| `Invalid constant value` | `const` on a widget that uses a variable | Remove that `const` |
| Screen doesn't update | You changed a variable outside `setState` | Wrap the change in `setState(() { ... })` |

```quiz
Q: Which kind of widget keeps data that can change while it's on screen?
A: StatefulWidget | stateful
Q: Which method must you call so the screen updates after changing state?
A: setState | setState()
Q: Which lifecycle method runs once when a stateful widget first appears?
A: initState | initState()
Q: Which lifecycle method should cancel timers and controllers?
A: dispose | dispose()
Q: Inside a State class, how do you read a value called item from the widget? Write the expression.
A: widget.item
Q: What do you pass to onPressed to disable a button?
A: null
Q: Which key type would you give list items that each have a unique id?
A: ValueKey | ValueKey(id)
```
