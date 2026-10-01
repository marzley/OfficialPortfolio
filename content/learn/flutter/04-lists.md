---
slug: lists-grids
title: Lists and grids: ListView, GridView, cards and pull to refresh
after: layout-masterclass
---
# Lists and grids: ListView, GridView, cards and pull to refresh

Almost every app is a list of something: products, messages, transactions, students. Flutter's list widgets are fast even with thousands of rows, because they only build the rows you can see.

## ListView: three ways

| Constructor | Use when |
|---|---|
| `ListView(children: [...])` | A short, fixed list (a settings page) |
| `ListView.builder(itemCount:, itemBuilder:)` | Long or loaded lists: builds rows **lazily** as you scroll |
| `ListView.separated(...)` | Like builder, with a divider (or any widget) between rows |

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: TransactionsScreen()));

class Txn {
  final String who;
  final int amount;           // positive = received, negative = paid
  final DateTime when;
  const Txn(this.who, this.amount, this.when);
}

final txns = List.generate(
  40,
  (i) => Txn(['Wanjiru', 'Kamau Hardware', 'KPLC Tokens', 'Otieno', 'Naivas'][i % 5], i.isEven ? 500 + i * 35 : -(250 + i * 20),
      DateTime(2026, 9, 30).subtract(Duration(hours: i * 7))),
);

class TransactionsScreen extends StatelessWidget {
  const TransactionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('M-Pesa statement')),
      body: ListView.separated(
        itemCount: txns.length,
        separatorBuilder: (context, i) => const Divider(height: 1),
        itemBuilder: (context, i) {                       // called only for visible rows
          final t = txns[i];
          final received = t.amount > 0;
          return ListTile(
            leading: CircleAvatar(
              backgroundColor: received ? Colors.green.shade100 : Colors.red.shade100,
              child: Icon(received ? Icons.call_received : Icons.call_made, color: received ? Colors.green : Colors.red),
            ),
            title: Text(t.who),
            subtitle: Text('${t.when.day}/${t.when.month} at ${t.when.hour.toString().padLeft(2, '0')}:00'),
            trailing: Text(
              '${received ? '+' : '-'}KSh ${t.amount.abs()}',
              style: TextStyle(fontWeight: FontWeight.bold, color: received ? Colors.green.shade700 : Colors.red.shade700),
            ),
            onTap: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Opened ${t.who}'))),
          );
        },
      ),
    );
  }
}
```

**`ListTile`** is a ready-made row with `leading` (left), `title`, `subtitle`, `trailing` (right) and `onTap`. It follows Material Design sizes, so rows look right with no effort.

## Cards and custom rows

When `ListTile` isn't enough, build your own row inside a `Card`:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: SafeArea(child: CourseList()))));

class Course {
  final String title, level;
  final int lessons;
  final double progress;
  const Course(this.title, this.level, this.lessons, this.progress);
}

const courses = [
  Course('HTML for beginners', 'Beginner', 16, 0.8),
  Course('Flutter app development', 'Intermediate', 15, 0.35),
  Course('Excel for business', 'Beginner', 10, 0.0),
];

class CourseList extends StatelessWidget {
  const CourseList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: courses.length,
      itemBuilder: (context, i) => CourseCard(course: courses[i]),
    );
  }
}

class CourseCard extends StatelessWidget {
  final Course course;
  const CourseCard({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return Card(
      clipBehavior: Clip.antiAlias,               // so the InkWell ripple stays inside the rounded corners
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(                              // makes the whole card tappable, with a ripple
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(course.title, style: text.titleMedium),
              const SizedBox(height: 4),
              Text('${course.level} · ${course.lessons} lessons', style: text.bodySmall),
              const SizedBox(height: 12),
              LinearProgressIndicator(value: course.progress, minHeight: 6, borderRadius: BorderRadius.circular(3)),
              const SizedBox(height: 6),
              Text(course.progress == 0 ? 'Not started' : '${(course.progress * 100).round()}% done', style: text.labelSmall),
            ],
          ),
        ),
      ),
    );
  }
}
```

## GridView

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: ProductGrid())));

class ProductGrid extends StatelessWidget {
  const ProductGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final items = ['Tomatoes', 'Onions', 'Sukuma', 'Cabbage', 'Carrots', 'Avocado', 'Mangoes', 'Bananas'];
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 200,        // each tile at most 200 wide: 2 columns on phones, more on tablets
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 3 / 4,        // width : height
      ),
      itemCount: items.length,
      itemBuilder: (context, i) => Card(
        child: Column(
          children: [
            Expanded(child: Container(color: Colors.green.shade100, child: const Center(child: Icon(Icons.eco, size: 48)))),
            Padding(padding: const EdgeInsets.all(8), child: Text(items[i], style: const TextStyle(fontWeight: FontWeight.bold))),
          ],
        ),
      ),
    );
  }
}
```

`SliverGridDelegateWithMaxCrossAxisExtent` is **responsive by itself**. Use `SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2)` when you want exactly N columns.

## Pull to refresh, empty and loading states

A good list screen always handles four states: **loading, error, empty, and data**.

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: OrdersScreen()));

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});
  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  List<String>? orders;          // null = still loading
  String? error;

  @override
  void initState() {
    super.initState();
    load();
  }

  Future<void> load() async {
    try {
      await Future.delayed(const Duration(seconds: 1));      // pretend network call
      final result = ['Order 1042 · KSh 1,240', 'Order 1041 · KSh 560'];
      if (!mounted) return;                                  // the screen may have closed meanwhile
      setState(() { orders = result; error = null; });
    } catch (e) {
      if (!mounted) return;
      setState(() => error = 'Could not load orders. Check your internet.');
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget body;
    if (error != null) {
      body = Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        Text(error!), const SizedBox(height: 8), OutlinedButton(onPressed: load, child: const Text('Try again')),
      ]));
    } else if (orders == null) {
      body = const Center(child: CircularProgressIndicator());
    } else if (orders!.isEmpty) {
      body = const Center(child: Text('No orders yet'));
    } else {
      body = RefreshIndicator(                              // pull down to reload
        onRefresh: load,
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),   // lets you pull even when the list is short
          itemCount: orders!.length,
          itemBuilder: (context, i) => ListTile(leading: const Icon(Icons.receipt_long), title: Text(orders![i])),
        ),
      );
    }
    return Scaffold(appBar: AppBar(title: const Text('Orders')), body: body);
  }
}
```

## Swipe to delete

```dart
Dismissible(
  key: ValueKey(item.id),
  direction: DismissDirection.endToStart,
  background: Container(color: Colors.red, alignment: Alignment.centerRight,
      padding: const EdgeInsets.only(right: 20), child: const Icon(Icons.delete, color: Colors.white)),
  onDismissed: (_) => setState(() => items.remove(item)),
  child: ListTile(title: Text(item.name)),
)
```

Always offer **Undo** in a SnackBar after deleting: `SnackBar(content: Text('Deleted'), action: SnackBarAction(label: 'Undo', onPressed: ...))`.

## Loading more as you scroll (pagination)

For long lists from a server, load 20 at a time. In `itemBuilder`, when you reach the last item, load the next page:

```dart
itemCount: items.length + (hasMore ? 1 : 0),
itemBuilder: (context, i) {
  if (i == items.length) {          // the extra last row
    loadNextPage();                 // guard with an isLoading flag so it runs once
    return const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator()));
  }
  return ListTile(title: Text(items[i].name));
},
```

## Performance tips for lists

- Use **`.builder`** for anything longer than a screen.
- Give rows a **fixed height** when you can (`itemExtent: 72`): scrolling is smoother.
- Use `const` rows and small widgets.
- Load images at the size you show them (`cacheWidth` on `Image.network`).

```quiz
Q: Which ListView constructor builds rows lazily as you scroll?
A: ListView.builder | builder
Q: Which ready-made row widget has leading, title, subtitle and trailing?
A: ListTile
Q: Which widget adds pull-to-refresh to a list?
A: RefreshIndicator
Q: Which widget makes a row swipe-to-delete?
A: Dismissible
Q: Before calling setState after an await, which property should you check?
A: mounted
Q: Name the four states a list screen should handle: loading, error, empty and ...?
A: data | loaded | content
```
