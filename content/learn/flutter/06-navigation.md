---
slug: navigation-routing
title: Navigation: screens, passing data, tabs, drawers and go_router
after: themes-styling-assets
---
# Navigation: screens, passing data, tabs, drawers and go_router

Real apps have many screens: a product list, a product page, a cart, a checkout. Flutter keeps screens in a **stack**: opening a screen **pushes** it on top; going back **pops** it off.

## Push and pop

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: ProductsScreen()));

class Product {
  final String name;
  final int price;
  const Product(this.name, this.price);
}

const products = [Product('Unga 2kg', 180), Product('Sugar 1kg', 150), Product('Cooking oil 1L', 350)];

class ProductsScreen extends StatelessWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: ListView(
        children: [
          for (final p in products)
            ListTile(
              title: Text(p.name),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                Navigator.push(                                      // open the details screen
                  context,
                  MaterialPageRoute(builder: (context) => ProductDetails(product: p)),   // pass data via the constructor
                );
              },
            ),
        ],
      ),
    );
  }
}

class ProductDetails extends StatelessWidget {
  final Product product;
  const ProductDetails({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(product.name)),       // the back arrow is added for you
      body: Center(child: Text('KSh ${product.price}', style: Theme.of(context).textTheme.displaySmall)),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: FilledButton(onPressed: () => Navigator.pop(context), child: const Text('Back to products')),
      ),
    );
  }
}
```

- **Passing data forward:** give the new screen's constructor the values it needs.
- **Going back:** `Navigator.pop(context)`, the app bar's back arrow, or the phone's back button/gesture all pop.

## Getting a result back

`push` returns a `Future` that completes with whatever the next screen passes to `pop`:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: CheckoutScreen()));

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});
  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String area = 'Not chosen';

  Future<void> chooseArea() async {
    final picked = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (context) => const AreaPicker()),
    );
    if (picked != null) setState(() => area = picked);     // null if the user just pressed back
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: ListTile(title: const Text('Delivery area'), subtitle: Text(area), trailing: const Icon(Icons.edit), onTap: chooseArea),
    );
  }
}

class AreaPicker extends StatelessWidget {
  const AreaPicker({super.key});

  @override
  Widget build(BuildContext context) {
    const areas = ['CBD', 'Westlands', 'Kasarani', 'Rongai', 'Kitengela'];
    return Scaffold(
      appBar: AppBar(title: const Text('Choose area')),
      body: ListView(children: [
        for (final a in areas) ListTile(title: Text(a), onTap: () => Navigator.pop(context, a)),   // send the answer back
      ]),
    );
  }
}
```

## Other Navigator moves

| Code | Does |
|---|---|
| `Navigator.pushReplacement(context, route)` | Replace this screen (after login, the login screen shouldn't be "back") |
| `Navigator.pushAndRemoveUntil(context, route, (r) => false)` | Clear the whole stack (after logout, or after checkout success) |
| `Navigator.popUntil(context, (r) => r.isFirst)` | Go back to the first screen |
| `Navigator.canPop(context)` | Is there a screen to go back to? |

To ask *"Leave without saving?"* when the user presses back, wrap the screen in `PopScope(canPop: false, onPopInvokedWithResult: ...)` and show a dialog.

## Dialogs and bottom sheets

```dart
Future<void> confirmDelete(BuildContext context) async {
  final yes = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Delete product?'),
      content: const Text('This can\'t be undone.'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
        FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete')),
      ],
    ),
  );
  if (yes == true) {
    // delete it
  }
}

void showFilters(BuildContext context) {
  showModalBottomSheet(
    context: context,
    showDragHandle: true,
    builder: (context) => const Padding(padding: EdgeInsets.all(24), child: Text('Filters go here')),
  );
}
```

Dialogs are routes too, so `Navigator.pop(context, value)` closes them and returns a value.

## Bottom navigation bar (the most common app layout)

```dart
import 'package:flutter/material.dart';

void main() => runApp(MaterialApp(theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo), home: const HomeShell()));

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});
  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int index = 0;
  static const pages = [
    Center(child: Text('Home')),
    Center(child: Text('Search')),
    Center(child: Text('Cart')),
    Center(child: Text('Account')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Duka')),
      body: IndexedStack(index: index, children: pages),     // keeps each tab's scroll position and state
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (i) => setState(() => index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.search), label: 'Search'),
          NavigationDestination(icon: Badge(label: Text('3'), child: Icon(Icons.shopping_cart_outlined)), label: 'Cart'),
          NavigationDestination(icon: Icon(Icons.person_outline), label: 'Account'),
        ],
      ),
    );
  }
}
```

`NavigationBar` is the Material 3 bottom bar (3 to 5 items). `IndexedStack` keeps all tabs alive so switching back doesn't reload them.

## Tabs and drawers

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: OrdersTabs()));

class OrdersTabs extends StatelessWidget {
  const OrdersTabs({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Orders'),
          bottom: const TabBar(tabs: [Tab(text: 'New'), Tab(text: 'Delivering'), Tab(text: 'Done')]),
        ),
        drawer: Drawer(                                   // the side menu (swipe from the left or tap ☰)
          child: ListView(children: const [
            DrawerHeader(child: Text('Mama Mboga Duka')),
            ListTile(leading: Icon(Icons.inventory), title: Text('Stock')),
            ListTile(leading: Icon(Icons.bar_chart), title: Text('Reports')),
            ListTile(leading: Icon(Icons.settings), title: Text('Settings')),
          ]),
        ),
        body: const TabBarView(children: [
          Center(child: Text('New orders')),
          Center(child: Text('Out for delivery')),
          Center(child: Text('Delivered')),
        ]),
      ),
    );
  }
}
```

## go_router: named routes and web-style URLs

For bigger apps (and Flutter web, where each screen needs a URL), use the **go_router** package (`flutter pub add go_router`):

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const HomePage()),
    GoRoute(
      path: '/product/:id',                          // :id is a parameter in the URL
      builder: (context, state) => ProductPage(id: state.pathParameters['id']!),
    ),
    GoRoute(path: '/cart', builder: (context, state) => const Scaffold(body: Center(child: Text('Cart')))),
  ],
);

void main() => runApp(MaterialApp.router(routerConfig: router));

class HomePage extends StatelessWidget {
  const HomePage({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Home')),
        body: Column(children: [
          ListTile(title: const Text('Unga 2kg'), onTap: () => context.push('/product/17')),   // push: can go back
          ListTile(title: const Text('Cart'), onTap: () => context.go('/cart')),              // go: jump to the page
        ]),
      );
}

class ProductPage extends StatelessWidget {
  final String id;
  const ProductPage({super.key, required this.id});
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text('Product $id')));
}
```

go_router also handles **redirects** (send logged-out users to `/login`), deep links (open the app from a link in an SMS) and nested tab navigation (`StatefulShellRoute`).

## Which to use?

| App size | Use |
|---|---|
| A few screens, learning | `Navigator.push` / `pop` |
| Many screens, login redirects, deep links, web | `go_router` |

```quiz
Q: Which Navigator method opens a new screen on top?
A: push | Navigator.push
Q: Which method closes the current screen?
A: pop | Navigator.pop
Q: How does a screen send a value back? Write the call.
A: Navigator.pop(context, value) | Navigator.pop(context,value)
Q: After logging in, which method replaces the login screen so Back doesn't return to it?
A: pushReplacement | Navigator.pushReplacement
Q: Which widget keeps every bottom-bar tab alive when you switch?
A: IndexedStack
Q: Which function shows a pop-up that slides up from the bottom?
A: showModalBottomSheet
Q: In go_router, what does :id mean in the path /product/:id?
A: a parameter | parameter | path parameter | url parameter
```
