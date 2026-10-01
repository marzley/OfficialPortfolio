---
slug: local-storage-offline
title: Saving data on the phone: shared_preferences, SQLite and offline apps
after: http-apis-json
---
# Saving data on the phone: shared_preferences, SQLite and offline apps

Many users in Kenya have **expensive or patchy data**. An app that works offline, saves its data on the phone and syncs later feels fast and gets better reviews. Flutter has several ways to store data locally:

| Option | Stores | Good for |
|---|---|---|
| **shared_preferences** | Small key-value pairs | Settings, "has seen onboarding", last used phone number |
| **flutter_secure_storage** | Small **encrypted** values | Login tokens, PINs |
| **sqflite** (SQLite) | Tables with SQL | Stock lists, sales records, notes: structured data you search and sort |
| Files (`path_provider`) | Any file | Downloaded PDFs, images, exports |
| Drift, Isar, Hive | Databases with Dart APIs | Larger apps (Drift is typed SQL on top of SQLite) |

## shared_preferences: remembering small things

`flutter pub add shared_preferences`

```dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(const MaterialApp(home: SettingsScreen()));

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool darkMode = false;
  String shopName = '';
  int opens = 0;

  @override
  void initState() {
    super.initState();
    load();
  }

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final count = (prefs.getInt('opens') ?? 0) + 1;       // ?? gives a default the first time
    await prefs.setInt('opens', count);
    setState(() {
      darkMode = prefs.getBool('darkMode') ?? false;
      shopName = prefs.getString('shopName') ?? '';
      opens = count;
    });
  }

  Future<void> save(String key, Object value) async {
    final prefs = await SharedPreferences.getInstance();
    if (value is bool) await prefs.setBool(key, value);
    if (value is String) await prefs.setString(key, value);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Settings (opened $opens times)')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        SwitchListTile(
          title: const Text('Dark mode'),
          value: darkMode,
          onChanged: (v) { setState(() => darkMode = v); save('darkMode', v); },
        ),
        TextFormField(
          key: ValueKey(shopName),                 // redraw with the loaded value
          initialValue: shopName,
          decoration: const InputDecoration(labelText: 'Shop name'),
          onChanged: (v) => save('shopName', v),
        ),
      ]),
    );
  }
}
```

Types it stores: `bool`, `int`, `double`, `String`, `List<String>`. To store an object, save it as a JSON string (`jsonEncode`). **Don't** put big lists or secrets in it.

## SQLite with sqflite: real tables on the phone

`flutter pub add sqflite path`

SQLite is the same SQL you learn in the **SQL** subject, running inside the app. Practise the queries there, then use them here. Put all database code in one helper class:

```dart
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class Product {
  final int? id;           // null until saved
  final String name;
  final int price;
  final int stock;
  const Product({this.id, required this.name, required this.price, required this.stock});

  Map<String, Object?> toMap() => {'id': id, 'name': name, 'price': price, 'stock': stock};
  factory Product.fromMap(Map<String, Object?> m) =>
      Product(id: m['id'] as int, name: m['name'] as String, price: m['price'] as int, stock: m['stock'] as int);
}

class ShopDb {
  static Database? _db;

  static Future<Database> get db async => _db ??= await openDatabase(
        join(await getDatabasesPath(), 'duka.db'),
        version: 2,
        onCreate: (db, version) async {
          await db.execute('''
            CREATE TABLE products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              price INTEGER NOT NULL,
              stock INTEGER NOT NULL DEFAULT 0,
              category TEXT NOT NULL DEFAULT 'General'
            )''');
          await db.execute('CREATE TABLE sales (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, qty INTEGER, sold_at TEXT)');
        },
        onUpgrade: (db, oldVersion, newVersion) async {
          // version 1 had no category: add it without deleting anyone's data
          if (oldVersion < 2) await db.execute("ALTER TABLE products ADD COLUMN category TEXT NOT NULL DEFAULT 'General'");
        },
      );

  static Future<int> insert(Product p) async =>
      (await db).insert('products', p.toMap()..remove('id'));

  static Future<List<Product>> all({String search = ''}) async {
    final rows = await (await db).query(
      'products',
      where: search.isEmpty ? null : 'name LIKE ?',
      whereArgs: search.isEmpty ? null : ['%$search%'],     // ? placeholders: never paste user text into SQL
      orderBy: 'name',
    );
    return rows.map(Product.fromMap).toList();
  }

  static Future<void> updateStock(int id, int stock) async =>
      (await db).update('products', {'stock': stock}, where: 'id = ?', whereArgs: [id]);

  static Future<void> delete(int id) async => (await db).delete('products', where: 'id = ?', whereArgs: [id]);

  /// Record a sale and reduce stock together: both happen or neither does.
  static Future<void> sell(int productId, int qty) async {
    await (await db).transaction((txn) async {
      await txn.insert('sales', {'product_id': productId, 'qty': qty, 'sold_at': DateTime.now().toIso8601String()});
      await txn.rawUpdate('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, productId]);
    });
  }

  static Future<int> todaysSales() async {
    final today = DateTime.now().toIso8601String().substring(0, 10);
    final r = await (await db).rawQuery(
      'SELECT COALESCE(SUM(s.qty * p.price), 0) AS total FROM sales s JOIN products p ON p.id = s.product_id WHERE s.sold_at LIKE ?',
      ['$today%'],
    );
    return r.first['total'] as int;
  }
}
```

Important ideas in that code:

- **One database, opened once** (`_db ??=`).
- **`version` + `onUpgrade`**: when you release version 2 of your app with a new column, existing users' data is kept. Never just delete and recreate tables in an update.
- **`whereArgs` with `?`** prevents SQL injection and handles quotes in names like *Mama's Kitchen*.
- **Transactions** keep related changes together (a sale and a stock change).

Try the same queries on the sample shop database in the **SQL** subject's editor.

## Using the database in a screen

```dart
import 'package:flutter/material.dart';

class Product {
  final int id;
  final String name;
  final int stock;
  const Product(this.id, this.name, this.stock);
}

// Stand-in for ShopDb so this screen runs on its own
class FakeDb {
  static final _items = [const Product(1, 'Unga 2kg', 12), const Product(2, 'Sugar 1kg', 0)];
  static Future<List<Product>> all() async => List.of(_items);
}

void main() => runApp(const MaterialApp(home: StockScreen()));

class StockScreen extends StatefulWidget {
  const StockScreen({super.key});
  @override
  State<StockScreen> createState() => _StockScreenState();
}

class _StockScreenState extends State<StockScreen> {
  List<Product> items = [];

  @override
  void initState() {
    super.initState();
    refresh();
  }

  Future<void> refresh() async {
    final data = await FakeDb.all();
    if (mounted) setState(() => items = data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Stock')),
      body: ListView(children: [
        for (final p in items)
          ListTile(
            title: Text(p.name),
            trailing: Text(p.stock == 0 ? 'OUT' : '${p.stock} left', style: TextStyle(color: p.stock == 0 ? Colors.red : null)),
          ),
      ]),
    );
  }
}
```

After any insert, update or delete, call `refresh()` (or, better, keep the list in a Provider/Riverpod notifier that reloads itself).

## Offline-first: the pattern

1. The app **always reads from the local database**. The screen appears instantly, with or without internet.
2. When online, it **fetches updates from the server** and saves them locally; the screen refreshes.
3. Changes made offline are saved locally with a flag `synced = 0`, and sent to the server when the connection returns. Then set `synced = 1`.
4. Resolve conflicts with an `updated_at` timestamp (the newest change wins) or ask the user.

This is how good agent, SACCO and field-survey apps in Kenya keep working in areas with no signal.

## Files and folders

`flutter pub add path_provider`. `getApplicationDocumentsDirectory()` gives a private folder for your app's files (receipts, exported CSVs). Files there are deleted when the app is uninstalled. To let the user keep a file, share it with the **share_plus** package.

## Where things go: a cheat sheet

| Data | Store it in |
|---|---|
| Theme, language, onboarding done | shared_preferences |
| Login token, PIN | flutter_secure_storage |
| Products, sales, customers, notes | SQLite (sqflite or Drift) |
| Photos, PDFs | Files in the app documents folder |
| Data shared between phones and users | A server or Firebase (next lesson), cached in SQLite |

```quiz
Q: Which package stores small key-value settings?
A: shared_preferences
Q: Which package gives you SQLite in Flutter?
A: sqflite
Q: What SQL placeholder symbol prevents SQL injection in whereArgs?
A: ?
Q: Which database callback keeps users' data when you add a column in a new app version?
A: onUpgrade
Q: What groups several database changes so they all happen or none do?
A: a transaction | transaction
Q: Where should login tokens be stored?
A: flutter_secure_storage | secure storage
```
