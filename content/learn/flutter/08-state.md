---
slug: state-management
title: State management: setState, lifting state, Provider and Riverpod
after: forms-validation
---
# State management: setState, lifting state, Provider and Riverpod

**State** is any data that can change while the app runs: what's in the cart, whether the user is logged in, the list of orders, the chosen theme. **State management** is deciding *where that data lives* and *how screens find out when it changes*.

## Two kinds of state

| Ephemeral (local) state | App state (shared) |
|---|---|
| Used by **one** widget | Used by **many** screens |
| The selected tab, a password's show/hide, an animation | The cart, the logged-in user, settings, downloaded data |
| Use `setState` | Use Provider, Riverpod, Bloc... |

Don't over-engineer: a show/hide toggle doesn't need a package.

## Lifting state up

When two widgets need the same data, move the data to their **closest common parent** and pass it down, with callbacks to change it.

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: ShopPage()));

class ShopPage extends StatefulWidget {
  const ShopPage({super.key});
  @override
  State<ShopPage> createState() => _ShopPageState();
}

class _ShopPageState extends State<ShopPage> {
  final cart = <String>[];                        // state lives in the common parent

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Shop'), actions: [CartIcon(count: cart.length)]),   // passed down
      body: ProductList(onAdd: (item) => setState(() => cart.add(item))),                   // callback up
    );
  }
}

class CartIcon extends StatelessWidget {
  final int count;
  const CartIcon({super.key, required this.count});
  @override
  Widget build(BuildContext context) =>
      Padding(padding: const EdgeInsets.all(12), child: Badge(label: Text('$count'), isLabelVisible: count > 0, child: const Icon(Icons.shopping_cart)));
}

class ProductList extends StatelessWidget {
  final void Function(String item) onAdd;
  const ProductList({super.key, required this.onAdd});
  @override
  Widget build(BuildContext context) => ListView(children: [
        for (final p in ['Unga', 'Sugar', 'Milk'])
          ListTile(title: Text(p), trailing: IconButton(icon: const Icon(Icons.add_shopping_cart), onPressed: () => onAdd(p))),
      ]);
}
```

This works for a few widgets. But when the cart is needed on the product page, the cart page, the checkout page and the app bar, passing it through every constructor ("prop drilling") gets painful. That's when you use a state management package.

## Provider + ChangeNotifier (recommended for beginners)

**Provider** is simple and officially recommended in Flutter's docs. The idea:

1. Put your state and the functions that change it in a class that **extends `ChangeNotifier`**.
2. Call **`notifyListeners()`** after every change.
3. **Provide** it above the widgets that need it.
4. Widgets **watch** it and rebuild when it changes.

`flutter pub add provider`, then:

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// 1. The state and its logic, with no widgets in it (easy to test)
class CartItem {
  final String name;
  final int price;
  int qty;
  CartItem(this.name, this.price, {this.qty = 1});
}

class Cart extends ChangeNotifier {
  final Map<String, CartItem> _items = {};

  List<CartItem> get items => _items.values.toList();
  int get count => _items.values.fold(0, (n, i) => n + i.qty);
  int get total => _items.values.fold(0, (sum, i) => sum + i.price * i.qty);

  void add(String name, int price) {
    final existing = _items[name];
    if (existing != null) {
      existing.qty++;
    } else {
      _items[name] = CartItem(name, price);
    }
    notifyListeners();                                    // 2. tell everyone watching
  }

  void remove(String name) {
    final item = _items[name];
    if (item == null) return;
    if (item.qty > 1) {
      item.qty--;
    } else {
      _items.remove(name);
    }
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}

// 3. Provide it at the top of the app
void main() => runApp(ChangeNotifierProvider(create: (_) => Cart(), child: const MaterialApp(home: ProductsPage())));

const catalogue = {'Unga 2kg': 180, 'Sugar 1kg': 150, 'Milk 500ml': 60, 'Bread': 65};

class ProductsPage extends StatelessWidget {
  const ProductsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final count = context.watch<Cart>().count;           // 4. rebuilds when the cart changes
    return Scaffold(
      appBar: AppBar(title: const Text('Duka'), actions: [
        IconButton(
          icon: Badge(label: Text('$count'), isLabelVisible: count > 0, child: const Icon(Icons.shopping_cart)),
          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CartPage())),
        ),
      ]),
      body: ListView(children: [
        for (final e in catalogue.entries)
          ListTile(
            title: Text(e.key),
            subtitle: Text('KSh ${e.value}'),
            trailing: FilledButton.tonal(
              onPressed: () => context.read<Cart>().add(e.key, e.value),   // read: call a method, don't rebuild
              child: const Text('Add'),
            ),
          ),
      ]),
    );
  }
}

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<Cart>();
    return Scaffold(
      appBar: AppBar(title: const Text('Your cart')),
      body: cart.items.isEmpty
          ? const Center(child: Text('Your cart is empty'))
          : ListView(children: [
              for (final i in cart.items)
                ListTile(
                  title: Text(i.name),
                  subtitle: Text('KSh ${i.price} × ${i.qty}'),
                  trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                    IconButton(icon: const Icon(Icons.remove_circle_outline), onPressed: () => cart.remove(i.name)),
                    Text('${i.qty}'),
                    IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: () => cart.add(i.name, i.price)),
                  ]),
                ),
            ]),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: FilledButton(onPressed: cart.items.isEmpty ? null : () {}, child: Text('Pay KSh ${cart.total} with M-Pesa')),
        ),
      ),
    );
  }
}
```

### watch, read and select

| Call | Use in | Rebuilds? |
|---|---|---|
| `context.watch<Cart>()` | `build()` | Yes, whenever the cart changes |
| `context.read<Cart>()` | Button callbacks (`onPressed`) | No. Never use `watch` inside a callback. |
| `context.select<Cart, int>((c) => c.count)` | `build()` | Only when **that value** changes (fewer rebuilds) |
| `Consumer<Cart>(builder: ...)` | Part of a build | Rebuilds just the part inside it |

Several providers? Use `MultiProvider(providers: [ChangeNotifierProvider(create: (_) => Cart()), ChangeNotifierProvider(create: (_) => Auth())], child: ...)`.

## Riverpod (the next step)

**Riverpod** is by the same author as Provider. It fixes Provider's weak points: no `BuildContext` needed to read state, compile-time safety (no "ProviderNotFoundException"), and easy async loading. `flutter pub add flutter_riverpod`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// A simple value that can change
final counterProvider = StateProvider<int>((ref) => 0);

// Data loaded asynchronously: Riverpod handles loading and error states for you
final pricesProvider = FutureProvider<Map<String, int>>((ref) async {
  await Future.delayed(const Duration(seconds: 1));     // pretend network call
  return {'Unga': 180, 'Sugar': 150};
});

void main() => runApp(const ProviderScope(child: MaterialApp(home: Home())));   // ProviderScope at the top

class Home extends ConsumerWidget {                      // ConsumerWidget gets a WidgetRef
  const Home({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    final prices = ref.watch(pricesProvider);
    return Scaffold(
      appBar: AppBar(title: Text('Tapped $count times')),
      body: prices.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (p) => ListView(children: [for (final e in p.entries) ListTile(title: Text(e.key), trailing: Text('KSh ${e.value}'))]),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(counterProvider.notifier).state++,
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

## Other popular choices

| Approach | Style | Good for |
|---|---|---|
| `setState` | Built in | Local UI state, small apps |
| **Provider** | ChangeNotifier + watch/read | Beginners, small and medium apps |
| **Riverpod** | Providers declared globally, `ref.watch` | Medium and large apps, async data |
| **Bloc / Cubit** | Events in, states out (streams) | Big teams, strict structure, banking-style apps |
| GetX | All-in-one | Popular in tutorials, but mixes many concerns; many teams avoid it |

Pick **one** for a project and use it consistently. Employers in Kenya often ask for Provider, Riverpod or Bloc experience.

## Good habits

- Keep **logic out of widgets**: the `Cart` class above has no Flutter UI code, so you can unit-test it.
- Make state **private** (`_items`) and expose read-only getters and methods. Nobody should change the list without calling `notifyListeners`.
- Keep state **as low as possible** in the tree, and use `select`/`Consumer` so only what's needed rebuilds.
- Never store widgets or `BuildContext` in state.

```quiz
Q: Which is right for a password show/hide toggle: setState or Provider?
A: setState
Q: A ChangeNotifier must call which method after changing its data?
A: notifyListeners | notifyListeners()
Q: Which Provider call rebuilds the widget when the state changes?
A: watch | context.watch
Q: Which call should you use inside an onPressed callback?
A: read | context.read
Q: What do you wrap the whole app in to use Riverpod?
A: ProviderScope
Q: Moving shared data to the closest common parent widget is called lifting state ...?
A: up
```
