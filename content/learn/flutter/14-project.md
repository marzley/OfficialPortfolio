---
slug: project-duka-app
title: "Project: build a complete shop stock and sales app"
after: animations
---
# Project: build a complete shop stock and sales app

Time to put everything together. You'll build **Duka Stock**, a real app a small shop could use tomorrow:

- A list of products with stock levels and a search box
- Add, edit and delete products (with a validated form)
- Record sales: stock goes down, and today's total goes up
- Low-stock warnings
- A cart-style sale screen
- Clean structure: **models**, a **store** (Provider), and **screens**

The complete app is below in one file so you can paste it into DartPad or `lib/main.dart` and run it. After it works, the lesson shows how to split it into files and save the data with SQLite.

## The plan

```
Models:     Product(id, name, price, stock, lowAt)   Sale(productId, qty, price, time)
Store:      Shop extends ChangeNotifier
            products, sales, todayTotal, lowStock, add/update/delete, sell()
Screens:    HomeShell (bottom bar)
            ├── StockScreen  → ProductForm (add / edit)
            ├── SellScreen
            └── ReportScreen
```

## The code

`flutter pub add provider`, then:

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// ---------------- models ----------------
class Product {
  final int id;
  String name;
  int price;
  int stock;
  int lowAt;               // warn when stock is at or below this
  Product({required this.id, required this.name, required this.price, required this.stock, this.lowAt = 5});
  bool get isLow => stock <= lowAt;
}

class Sale {
  final int productId, qty, price;
  final DateTime time;
  Sale(this.productId, this.qty, this.price, this.time);
  int get total => qty * price;
}

// ---------------- store ----------------
class Shop extends ChangeNotifier {
  int _nextId = 4;
  final List<Product> _products = [
    Product(id: 1, name: 'Unga 2kg', price: 180, stock: 24),
    Product(id: 2, name: 'Sugar 1kg', price: 150, stock: 3),
    Product(id: 3, name: 'Cooking oil 1L', price: 350, stock: 10, lowAt: 3),
  ];
  final List<Sale> _sales = [];

  List<Product> products({String search = ''}) {
    final q = search.trim().toLowerCase();
    final list = _products.where((p) => p.name.toLowerCase().contains(q)).toList()..sort((a, b) => a.name.compareTo(b.name));
    return List.unmodifiable(list);
  }

  List<Product> get lowStock => _products.where((p) => p.isLow).toList();
  List<Sale> get todaysSales {
    final now = DateTime.now();
    return _sales.where((s) => s.time.year == now.year && s.time.month == now.month && s.time.day == now.day).toList();
  }

  int get todayTotal => todaysSales.fold(0, (sum, s) => sum + s.total);
  Product byId(int id) => _products.firstWhere((p) => p.id == id);

  void add(String name, int price, int stock, int lowAt) {
    _products.add(Product(id: _nextId++, name: name, price: price, stock: stock, lowAt: lowAt));
    notifyListeners();
  }

  void update(Product p, {required String name, required int price, required int stock, required int lowAt}) {
    p
      ..name = name
      ..price = price
      ..stock = stock
      ..lowAt = lowAt;
    notifyListeners();
  }

  void delete(Product p) {
    _products.remove(p);
    notifyListeners();
  }

  /// Sells everything in [basket] (productId → qty). Returns an error message, or null if it worked.
  String? sell(Map<int, int> basket) {
    for (final e in basket.entries) {
      final p = byId(e.key);
      if (e.value > p.stock) return 'Only ${p.stock} ${p.name} left.';
    }
    final now = DateTime.now();
    for (final e in basket.entries) {
      final p = byId(e.key);
      p.stock -= e.value;
      _sales.add(Sale(p.id, e.value, p.price, now));
    }
    notifyListeners();
    return null;
  }
}

String ksh(int n) => 'KSh ${n.toString().replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (m) => ',')}';

// ---------------- app ----------------
void main() => runApp(ChangeNotifierProvider(create: (_) => Shop(), child: const DukaApp()));

class DukaApp extends StatelessWidget {
  const DukaApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'Duka Stock',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF0B7A5A)),
        darkTheme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF0B7A5A), brightness: Brightness.dark),
        home: const HomeShell(),
      );
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});
  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int tab = 0;
  @override
  Widget build(BuildContext context) {
    final low = context.select<Shop, int>((s) => s.lowStock.length);
    return Scaffold(
      body: IndexedStack(index: tab, children: const [StockScreen(), SellScreen(), ReportScreen()]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: tab,
        onDestinationSelected: (i) => setState(() => tab = i),
        destinations: [
          NavigationDestination(icon: Badge(isLabelVisible: low > 0, label: Text('$low'), child: const Icon(Icons.inventory_2_outlined)), label: 'Stock'),
          const NavigationDestination(icon: Icon(Icons.point_of_sale), label: 'Sell'),
          const NavigationDestination(icon: Icon(Icons.bar_chart), label: 'Today'),
        ],
      ),
    );
  }
}

// ---------------- stock ----------------
class StockScreen extends StatefulWidget {
  const StockScreen({super.key});
  @override
  State<StockScreen> createState() => _StockScreenState();
}

class _StockScreenState extends State<StockScreen> {
  String search = '';

  @override
  Widget build(BuildContext context) {
    final shop = context.watch<Shop>();
    final items = shop.products(search: search);
    return Scaffold(
      appBar: AppBar(title: const Text('Stock')),
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          child: TextField(
            decoration: const InputDecoration(prefixIcon: Icon(Icons.search), hintText: 'Search products', border: OutlineInputBorder()),
            onChanged: (v) => setState(() => search = v),
          ),
        ),
        Expanded(
          child: items.isEmpty
              ? const Center(child: Text('No products found'))
              : ListView.separated(
                  itemCount: items.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, i) {
                    final p = items[i];
                    return ListTile(
                      title: Text(p.name),
                      subtitle: Text(ksh(p.price)),
                      trailing: Chip(
                        label: Text(p.stock == 0 ? 'Out' : '${p.stock} left'),
                        backgroundColor: p.isLow ? Theme.of(context).colorScheme.errorContainer : null,
                      ),
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ProductForm(product: p))),
                    );
                  },
                ),
        ),
      ]),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProductForm())),
        icon: const Icon(Icons.add),
        label: const Text('Product'),
      ),
    );
  }
}

class ProductForm extends StatefulWidget {
  final Product? product;               // null = adding a new one
  const ProductForm({super.key, this.product});
  @override
  State<ProductForm> createState() => _ProductFormState();
}

class _ProductFormState extends State<ProductForm> {
  final formKey = GlobalKey<FormState>();
  late final name = TextEditingController(text: widget.product?.name);
  late final price = TextEditingController(text: widget.product?.price.toString());
  late final stock = TextEditingController(text: widget.product?.stock.toString());
  late final lowAt = TextEditingController(text: (widget.product?.lowAt ?? 5).toString());

  @override
  void dispose() {
    for (final c in [name, price, stock, lowAt]) {
      c.dispose();
    }
    super.dispose();
  }

  String? wholeNumber(String? v, {int min = 0}) {
    final n = int.tryParse(v ?? '');
    if (n == null) return 'Enter a whole number';
    if (n < min) return 'Must be at least $min';
    return null;
  }

  void save() {
    if (!formKey.currentState!.validate()) return;
    final shop = context.read<Shop>();
    final p = widget.product;
    if (p == null) {
      shop.add(name.text.trim(), int.parse(price.text), int.parse(stock.text), int.parse(lowAt.text));
    } else {
      shop.update(p, name: name.text.trim(), price: int.parse(price.text), stock: int.parse(stock.text), lowAt: int.parse(lowAt.text));
    }
    Navigator.pop(context);
  }

  Future<void> delete() async {
    final yes = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text('Delete ${widget.product!.name}?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(c, true), child: const Text('Delete')),
        ],
      ),
    );
    if (yes == true && mounted) {
      context.read<Shop>().delete(widget.product!);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final editing = widget.product != null;
    return Scaffold(
      appBar: AppBar(
        title: Text(editing ? 'Edit product' : 'New product'),
        actions: [if (editing) IconButton(onPressed: delete, icon: const Icon(Icons.delete_outline), tooltip: 'Delete')],
      ),
      body: Form(
        key: formKey,
        child: ListView(padding: const EdgeInsets.all(16), children: [
          TextFormField(
            controller: name,
            textCapitalization: TextCapitalization.sentences,
            decoration: const InputDecoration(labelText: 'Name'),
            validator: (v) => (v == null || v.trim().length < 2) ? 'Enter the product name' : null,
          ),
          TextFormField(controller: price, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Price (KSh)'),
              validator: (v) => wholeNumber(v, min: 1)),
          TextFormField(controller: stock, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Stock'),
              validator: wholeNumber),
          TextFormField(controller: lowAt, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Warn when stock is at or below'),
              validator: wholeNumber),
          const SizedBox(height: 24),
          FilledButton(onPressed: save, child: const Text('Save')),
        ]),
      ),
    );
  }
}

// ---------------- sell ----------------
class SellScreen extends StatefulWidget {
  const SellScreen({super.key});
  @override
  State<SellScreen> createState() => _SellScreenState();
}

class _SellScreenState extends State<SellScreen> {
  final basket = <int, int>{};          // productId → qty

  @override
  Widget build(BuildContext context) {
    final shop = context.watch<Shop>();
    final total = basket.entries.fold(0, (sum, e) => sum + shop.byId(e.key).price * e.value);
    return Scaffold(
      appBar: AppBar(title: const Text('New sale')),
      body: ListView(children: [
        for (final p in shop.products())
          ListTile(
            enabled: p.stock > 0,
            title: Text(p.name),
            subtitle: Text('${ksh(p.price)} · ${p.stock} in stock'),
            trailing: Row(mainAxisSize: MainAxisSize.min, children: [
              IconButton(
                onPressed: (basket[p.id] ?? 0) > 0 ? () => setState(() => basket.update(p.id, (q) => q - 1)) : null,
                icon: const Icon(Icons.remove_circle_outline),
              ),
              SizedBox(width: 24, child: Text('${basket[p.id] ?? 0}', textAlign: TextAlign.center)),
              IconButton(
                onPressed: (basket[p.id] ?? 0) < p.stock ? () => setState(() => basket.update(p.id, (q) => q + 1, ifAbsent: () => 1)) : null,
                icon: const Icon(Icons.add_circle_outline),
              ),
            ]),
          ),
      ]),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: FilledButton.icon(
            onPressed: total == 0
                ? null
                : () {
                    final error = shop.sell(Map.of(basket)..removeWhere((_, q) => q == 0));
                    final messenger = ScaffoldMessenger.of(context);
                    if (error != null) {
                      messenger.showSnackBar(SnackBar(content: Text(error)));
                      return;
                    }
                    setState(basket.clear);
                    messenger.showSnackBar(SnackBar(content: Text('Sale saved: ${ksh(total)}')));
                  },
            icon: const Icon(Icons.check),
            label: Text('Complete sale · ${ksh(total)}'),
          ),
        ),
      ),
    );
  }
}

// ---------------- report ----------------
class ReportScreen extends StatelessWidget {
  const ReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final shop = context.watch<Shop>();
    final text = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Today')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Sales today', style: text.titleMedium),
              Text(ksh(shop.todayTotal), style: text.displaySmall),
              Text('${shop.todaysSales.length} items sold', style: text.bodySmall),
            ]),
          ),
        ),
        const SizedBox(height: 16),
        Text('Low stock', style: text.titleMedium),
        if (shop.lowStock.isEmpty) const ListTile(leading: Icon(Icons.check_circle, color: Colors.green), title: Text('All stock levels are fine')),
        for (final p in shop.lowStock)
          ListTile(leading: const Icon(Icons.warning_amber, color: Colors.orange), title: Text(p.name), trailing: Text('${p.stock} left')),
      ]),
    );
  }
}
```

## How it fits together

1. **`Shop`** holds all the data and rules (no widgets). Every change ends with `notifyListeners()`.
2. Screens call `context.watch<Shop>()` to show data and `context.read<Shop>()` in button callbacks to change it.
3. The **bottom bar badge** uses `context.select` so it only rebuilds when the number of low-stock items changes.
4. **`sell()` checks all items first**, then changes stock. A sale never half-happens.
5. The form is reused for **add and edit**: `product == null` means add.

## Challenges (do them in order)

1. **Split into files**: `lib/models/product.dart`, `lib/state/shop.dart`, `lib/screens/stock_screen.dart`... Use `import 'package:duka/models/product.dart';`.
2. **Save with SQLite**: move the lists into the `ShopDb` class from the local storage lesson. Load products in the `Shop` constructor, and write through to the database in `add`, `update`, `delete` and `sell`.
3. **Payment method**: ask "Cash or M-Pesa?" when completing a sale and show totals per method in the report.
4. **Receipts**: share a text receipt with `share_plus` after each sale.
5. **Sales history**: a screen listing past days with totals (group sales by date).
6. **Barcodes**: add a barcode field and use `mobile_scanner` to find a product by scanning it.
7. **Sync**: send sales to a PHP API or Firestore when online.

Finishing even the first four gives you a strong **portfolio project**. Record a 1-minute screen video of it for your CV and LinkedIn.

```quiz
Q: In this app, which class holds the data and rules?
A: Shop
Q: Which Provider call does the badge use so it rebuilds only when its number changes?
A: select | context.select
Q: Which method must Shop call after every change so screens update?
A: notifyListeners | notifyListeners()
Q: Which Provider call should a button's onPressed use to reach the Shop?
A: read | context.read
Q: Which widget keeps each tab's screen alive in the bottom bar?
A: IndexedStack
```
