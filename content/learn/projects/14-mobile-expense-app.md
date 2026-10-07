---
slug: mobile-expense-app
title: "Project 13: Mobile expense tracker app with Flutter (offline storage, categories, budget, charts)"
after: student-portal
---
# Project 13: Mobile expense tracker app with Flutter

Where does the money go? Fare, lunch, airtime, data bundles, rent, chama contributions, M-Pesa charges… An expense tracker is a perfect first real app: useful every day, works **offline**, and teaches the core of mobile development (screens, forms, lists, state, local storage and simple charts). Kenyan touches such as M-Pesa transaction costs and a monthly budget make it stand out from generic tutorials.

**You'll practise:** Dart classes and JSON, Flutter widgets and layout, forms with validation, state with `setState` (then Provider), saving data on the device, totals and a simple bar chart, and publishing.

**Lessons you need:** [Dart classes and async](./?track=dart-flutter&lesson=dart-classes-async), [Flutter widgets](./?track=flutter&lesson=widgets-stateless-stateful), [lists and grids](./?track=flutter&lesson=lists-grids), [forms and validation](./?track=flutter&lesson=forms-validation), [state management](./?track=flutter&lesson=state-management), [local storage and offline](./?track=flutter&lesson=local-storage-offline), [testing and release](./?track=flutter&lesson=testing-release). See the [mobile app developer roadmap](./?track=career-roadmaps&lesson=mobile-app-developer-roadmap).

## Step 1: Plan the app

**Screens:**
1. **Home**: this month's total, budget progress bar, spending by category (bar chart), list of recent expenses.
2. **Add/edit expense**: amount, category, note, date, payment method (M-Pesa / cash / card).
3. **Settings** (could): monthly budget, export to CSV.

**Data:** an `Expense` has an id, amount (whole shillings), category, note, date and method.

**Categories:** Food, Transport, Airtime & data, Rent & bills, Shopping, Chama & savings, Entertainment, Other.

## Step 2: The model and the logic in pure Dart

Start with the logic, without any UI. It's easier to test, and you can run this with `dart run` (or paste it into DartPad):

```dart
class Expense {
  final String id;
  final int amount; // whole shillings
  final String category;
  final String note;
  final DateTime date;
  final String method; // mpesa, cash, card

  Expense({required this.id, required this.amount, required this.category, this.note = '', required this.date, this.method = 'mpesa'});

  Map<String, dynamic> toJson() => {
        'id': id, 'amount': amount, 'category': category, 'note': note,
        'date': date.toIso8601String(), 'method': method,
      };

  factory Expense.fromJson(Map<String, dynamic> j) => Expense(
        id: j['id'] as String,
        amount: j['amount'] as int,
        category: j['category'] as String,
        note: (j['note'] ?? '') as String,
        date: DateTime.parse(j['date'] as String),
        method: (j['method'] ?? 'mpesa') as String,
      );
}

/// Total for one month.
int monthTotal(List<Expense> all, int year, int month) =>
    all.where((e) => e.date.year == year && e.date.month == month).fold(0, (sum, e) => sum + e.amount);

/// Totals by category for one month, biggest first.
List<MapEntry<String, int>> byCategory(List<Expense> all, int year, int month) {
  final totals = <String, int>{};
  for (final e in all.where((e) => e.date.year == year && e.date.month == month)) {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  }
  return totals.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
}

String ksh(int n) {
  final s = n.toString();
  final buf = StringBuffer();
  for (var i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 == 0) buf.write(',');
    buf.write(s[i]);
  }
  return 'KSh $buf';
}

void main() {
  final list = [
    Expense(id: '1', amount: 150, category: 'Transport', note: 'Matatu to town', date: DateTime(2026, 10, 1)),
    Expense(id: '2', amount: 1000, category: 'Airtime & data', note: 'Monthly bundle', date: DateTime(2026, 10, 2)),
    Expense(id: '3', amount: 350, category: 'Food', note: 'Lunch', date: DateTime(2026, 10, 2), method: 'cash'),
    Expense(id: '4', amount: 12500, category: 'Rent & bills', note: 'Rent', date: DateTime(2026, 10, 5)),
    Expense(id: '5', amount: 2000, category: 'Chama & savings', date: DateTime(2026, 10, 6)),
    Expense(id: '6', amount: 900, category: 'Food', note: 'Groceries', date: DateTime(2026, 9, 28)),
  ];
  print('October total: ${ksh(monthTotal(list, 2026, 10))}');
  for (final e in byCategory(list, 2026, 10)) {
    print('  ${e.key.padRight(16)} ${ksh(e.value)}');
  }
  final budget = 20000;
  final spent = monthTotal(list, 2026, 10);
  print('Budget used: ${(100 * spent / budget).toStringAsFixed(0)}%');

  // JSON round trip, exactly what we will save on the phone
  final saved = list.map((e) => e.toJson()).toList();
  final loaded = saved.map(Expense.fromJson).toList();
  print('Saved and loaded ${loaded.length} expenses; first note: ${loaded.first.note}');
}
```

## Step 3: Create the Flutter project

```bash
flutter create expense_tracker
cd expense_tracker
flutter pub add shared_preferences
flutter run
```

`shared_preferences` stores small amounts of data (we'll save the expense list as JSON). For thousands of records or complex queries, move to `sqflite` (SQLite) later; see [local storage and offline](./?track=flutter&lesson=local-storage-offline).

## Step 4: The app (version 1)

Put the `Expense` class and helper functions from Step 2 in `lib/expense.dart` (without `main`). Then this is a complete, working `lib/main.dart`: home screen with total, budget bar, category bars and a list; an add form; swipe to delete; data saved on the phone.

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Expense {
  final String id;
  final int amount;
  final String category;
  final String note;
  final DateTime date;

  Expense({required this.id, required this.amount, required this.category, this.note = '', required this.date});

  Map<String, dynamic> toJson() => {'id': id, 'amount': amount, 'category': category, 'note': note, 'date': date.toIso8601String()};

  factory Expense.fromJson(Map<String, dynamic> j) => Expense(
        id: j['id'] as String,
        amount: j['amount'] as int,
        category: j['category'] as String,
        note: (j['note'] ?? '') as String,
        date: DateTime.parse(j['date'] as String),
      );
}

const categories = ['Food', 'Transport', 'Airtime & data', 'Rent & bills', 'Shopping', 'Chama & savings', 'Entertainment', 'Other'];

void main() => runApp(const ExpenseApp());

class ExpenseApp extends StatelessWidget {
  const ExpenseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Expense Tracker',
      theme: ThemeData(colorSchemeSeed: Colors.green, useMaterial3: true),
      darkTheme: ThemeData(colorSchemeSeed: Colors.green, brightness: Brightness.dark, useMaterial3: true),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  static const _key = 'expenses_v1';
  final int budget = 20000;
  List<Expense> expenses = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    final list = raw == null ? <Expense>[] : (jsonDecode(raw) as List).map((j) => Expense.fromJson(j as Map<String, dynamic>)).toList();
    setState(() {
      expenses = list..sort((a, b) => b.date.compareTo(a.date));
      loading = false;
    });
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(expenses.map((e) => e.toJson()).toList()));
  }

  void _add(Expense e) {
    setState(() => expenses = [e, ...expenses]..sort((a, b) => b.date.compareTo(a.date)));
    _save();
  }

  void _delete(Expense e) {
    setState(() => expenses.remove(e));
    _save();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text('Deleted ${e.category} expense'),
      action: SnackBarAction(label: 'UNDO', onPressed: () => _add(e)),
    ));
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final thisMonth = expenses.where((e) => e.date.year == now.year && e.date.month == now.month).toList();
    final total = thisMonth.fold<int>(0, (s, e) => s + e.amount);
    final totals = <String, int>{};
    for (final e in thisMonth) {
      totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    }
    final sorted = totals.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final used = budget == 0 ? 0.0 : (total / budget).clamp(0.0, 1.0);

    return Scaffold(
      appBar: AppBar(title: const Text('My expenses')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final e = await Navigator.push<Expense>(context, MaterialPageRoute(builder: (_) => const AddExpenseScreen()));
          if (e != null) _add(e);
        },
        icon: const Icon(Icons.add),
        label: const Text('Add'),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text('This month', style: Theme.of(context).textTheme.titleMedium),
                Text('KSh $total', style: Theme.of(context).textTheme.displaySmall),
                const SizedBox(height: 8),
                LinearProgressIndicator(value: used, minHeight: 10, color: used > 0.9 ? Colors.red : null),
                Text('${(used * 100).round()}% of KSh $budget budget'),
                const SizedBox(height: 24),
                for (final c in sorted) _CategoryBar(name: c.key, amount: c.value, max: sorted.first.value),
                const Divider(height: 32),
                if (expenses.isEmpty) const Text('No expenses yet. Tap Add to record your first one.'),
                for (final e in expenses)
                  Dismissible(
                    key: ValueKey(e.id),
                    background: Container(color: Colors.red, alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 16), child: const Icon(Icons.delete, color: Colors.white)),
                    direction: DismissDirection.endToStart,
                    onDismissed: (_) => _delete(e),
                    child: ListTile(
                      title: Text(e.note.isEmpty ? e.category : e.note),
                      subtitle: Text('${e.category} · ${e.date.day}/${e.date.month}/${e.date.year}'),
                      trailing: Text('KSh ${e.amount}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
              ],
            ),
    );
  }
}

class _CategoryBar extends StatelessWidget {
  final String name;
  final int amount;
  final int max;
  const _CategoryBar({required this.name, required this.amount, required this.max});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(children: [
        SizedBox(width: 120, child: Text(name, overflow: TextOverflow.ellipsis)),
        Expanded(
          child: FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: max == 0 ? 0 : amount / max,
            child: Container(height: 14, decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary, borderRadius: BorderRadius.circular(4))),
          ),
        ),
        SizedBox(width: 80, child: Text('KSh $amount', textAlign: TextAlign.right)),
      ]),
    );
  }
}

class AddExpenseScreen extends StatefulWidget {
  const AddExpenseScreen({super.key});

  @override
  State<AddExpenseScreen> createState() => _AddExpenseScreenState();
}

class _AddExpenseScreenState extends State<AddExpenseScreen> {
  final _form = GlobalKey<FormState>();
  final _amount = TextEditingController();
  final _note = TextEditingController();
  String _category = categories.first;
  DateTime _date = DateTime.now();

  @override
  void dispose() {
    _amount.dispose();
    _note.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add expense')),
      body: Form(
        key: _form,
        child: ListView(padding: const EdgeInsets.all(16), children: [
          TextFormField(
            controller: _amount,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Amount (KSh)', border: OutlineInputBorder()),
            validator: (v) {
              final n = int.tryParse((v ?? '').replaceAll(',', ''));
              if (n == null || n <= 0) return 'Enter an amount greater than 0';
              if (n > 10000000) return 'That looks too large';
              return null;
            },
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: _category,
            decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
            items: [for (final c in categories) DropdownMenuItem(value: c, child: Text(c))],
            onChanged: (v) => setState(() => _category = v ?? _category),
          ),
          const SizedBox(height: 16),
          TextFormField(controller: _note, decoration: const InputDecoration(labelText: 'Note (optional)', border: OutlineInputBorder())),
          const SizedBox(height: 16),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text('Date: ${_date.day}/${_date.month}/${_date.year}'),
            trailing: const Icon(Icons.calendar_today),
            onTap: () async {
              final d = await showDatePicker(context: context, initialDate: _date, firstDate: DateTime(2020), lastDate: DateTime.now());
              if (d != null) setState(() => _date = d);
            },
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () {
              if (!_form.currentState!.validate()) return;
              Navigator.pop(context, Expense(
                id: DateTime.now().microsecondsSinceEpoch.toString(),
                amount: int.parse(_amount.text.replaceAll(',', '')),
                category: _category,
                note: _note.text.trim(),
                date: _date,
              ));
            },
            child: const Text('Save'),
          ),
        ]),
      ),
    );
  }
}
```

Read through it slowly and match each part to the lessons: `StatefulWidget` and `setState`, `Navigator.push` returning a value, `Form` with validators, `Dismissible` with undo, and JSON saved with `SharedPreferences`.

## Step 5: Improve the structure (Provider)

As the app grows, keeping everything in one `State` class gets messy. Move the list and its logic into a `ChangeNotifier` class (`ExpenseStore`) with `add`, `remove`, `load`, `save` and computed totals, and provide it with the `provider` package. Screens then only display data and call methods. See [state management](./?track=flutter&lesson=state-management).

## Step 6: Kenyan features that make it yours

- **M-Pesa charges helper**: when the method is M-Pesa and the type is "Send money" or "Withdraw", show the estimated transaction cost from a tariff table you keep in the app, so users see what fees cost them each month. Tariffs change: keep the table in one place and show "last updated" text, or let users enter the actual cost from the SMS.
- **Chama & savings** tracked separately as "money set aside", not spending.
- **Weekly summary notification** (with the `flutter_local_notifications` package).
- **Kiswahili** translation of the interface.

## Step 7: Test it

Write unit tests for the pure functions (`monthTotal`, `byCategory`, JSON round trip) in `test/`, and a widget test that adds an expense and checks the total appears:

```dart
import 'package:flutter_test/flutter_test.dart';

int monthTotal(List<int> amounts) => amounts.fold(0, (s, a) => s + a);

void main() {
  test('month total adds all amounts', () {
    expect(monthTotal([150, 350, 1000]), 1500);
    expect(monthTotal([]), 0);
  });
}
```

Run with `flutter test`. Also test by hand on a small, old Android phone: big fonts setting on, dark mode on, airplane mode on (it must work offline).

## Step 8: Publish

Follow [testing and release](./?track=flutter&lesson=testing-release) and [publish an app](./?track=dart-flutter&lesson=publish-app): app icon (`flutter_launcher_icons`), app name, version, a signed release build (`flutter build appbundle`), a privacy policy page (state that data stays on the device), screenshots and a short description. New personal Google Play developer accounts must run a closed test with testers before production; recruit friends and classmates early.

## Stretch goals

- Move storage to `sqflite`; add search and filters by month and category.
- Export to CSV and share it (`share_plus`).
- A proper chart library (e.g. `fl_chart`) with a monthly trend line.
- Cloud backup and sync with Firebase ([Firebase auth and Firestore](./?track=flutter&lesson=firebase-auth-firestore)) or your own [REST API](./?track=projects&lesson=rest-api).
- Read M-Pesa SMS messages automatically (needs SMS permission; the Play Store restricts this heavily, so research the policy before trying).

## Summary

- Write and test the logic in pure Dart first, then build the UI.
- A complete v1: home with totals, budget and category bars; add form with validation; swipe to delete with undo; offline storage as JSON.
- Refactor to Provider as it grows; add Kenyan features; test; publish to the Play Store.

```quiz
Q: Which Flutter package stores small key-value data on the device in this project?
A: shared_preferences | shared preferences
Q: Which widget lets the user swipe a list item away?
A: Dismissible
Q: Which method rebuilds a StatefulWidget after data changes?
A: setState | setState()
Q: Which command builds the file you upload to Google Play? (flutter build ___)
A: appbundle | flutter build appbundle
```
