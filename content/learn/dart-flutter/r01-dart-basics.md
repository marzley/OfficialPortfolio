---
slug: dart-basics
title: "Dart basics: why Dart and Flutter, setup, variables and null safety, strings, control flow, functions and collections"
after: KEEP
---
# Dart basics: why Dart and Flutter, setup, variables and null safety, strings, control flow, functions and collections

**Flutter** is Google's toolkit for building beautiful, fast apps for **Android, iPhone, web and desktop from one codebase**, and **Dart** is the language Flutter apps are written in. Many startups, banks and agencies use Flutter to ship to both Android and iOS without maintaining two separate apps, which makes it a very practical skill for Kenyan developers, where Android dominates but clients often want iPhone versions too. Before building screens, you need solid Dart fundamentals: this unit covers them step by step with runnable examples.

:::note What you will learn
- Why Dart and Flutter, who uses them, and how Flutter works
- Installing Flutter (which includes Dart) and checking your setup
- Your first Dart program and running it
- Variables: var, final, const and types
- Null safety: nullable types, ?, !, ?? and late
- Strings, interpolation and useful methods
- Operators, conditions, switch and loops
- Functions: parameters (positional, named, optional), arrow functions, functions as values
- Collections: List, Set, Map and their key methods
:::

## Why Dart and Flutter?

| Benefit | Meaning |
|---|---|
| **One codebase** | Android, iOS, web, Windows, macOS, Linux |
| **Fast development** | Hot reload shows code changes in about a second |
| **Native performance** | Dart compiles to native machine code for mobile |
| **Beautiful UI** | Everything is a widget; full control over design; Material and Cupertino styles |
| **Growing jobs** | Agencies, fintechs and startups use Flutter for cross-platform apps |

Apps built with Flutter include products from Google, BMW, Alibaba and many fintech and e-commerce companies.

## Setup

1. Install Flutter from flutter.dev (Windows, macOS or Linux); it includes the Dart SDK.
2. Run `flutter doctor` and follow its suggestions (Android Studio + Android SDK, accept licences, an emulator or a phone with USB debugging; Xcode on macOS for iOS).
3. Use **VS Code** (Flutter and Dart extensions) or **Android Studio** (Flutter plugin).
4. For Dart-only practice: DartPad (dartpad.dev) runs Dart in the browser, and the Run button here runs Dart examples.

```bash
flutter doctor
dart create hello_dart   # a console Dart project
cd hello_dart && dart run
```

## Your first Dart program

```dart
void main() {
  print('Habari, Kenya!');
  print('Learning Dart for Flutter apps.');
}
```

- `main()` is the entry point; `void` means it returns nothing.
- `print` writes to the console.
- Statements end with `;`; strings use single or double quotes.

## Variables: var, final and const

```dart
void main() {
  var school = 'Alliance High';     // type inferred: String
  String town = 'Kikuyu';           // explicit type
  int students = 45;
  double fee = 12500.50;
  bool paid = true;

  final createdAt = DateTime.now();       // set once at runtime, can't change
  const vat = 0.16;                       // compile-time constant

  students = students + 1;                // var/typed variables can change
  print('$school in $town has $students students, fee KSh $fee, paid: $paid');
  print('VAT on 1000 is ${1000 * vat}');
  print('Record created at ${createdAt.year}');
}
```

| Keyword | Meaning |
|---|---|
| `var` | Variable with an inferred type (the type can't change later) |
| `String`, `int`, `double`, `bool`, `num` | Explicit types |
| `final` | Assigned once (value known at runtime) |
| `const` | Compile-time constant (also used for constant widgets in Flutter) |
| `dynamic` | Turns off type checking (avoid) |

## Null safety

Dart has **sound null safety**: a variable can't be `null` unless its type says so with `?`. This prevents a huge class of crashes.

```dart
void main() {
  String name = 'Achieng';
  String? nickname;                       // may be null
  print(nickname ?? 'No nickname');       // ?? gives a default when null

  int? discount = getDiscount('VIP');
  if (discount != null) {
    print('Discount: $discount%');        // inside the check, discount is treated as int
  }

  print(nickname?.length);                // ?. returns null instead of crashing
  nickname = 'Chichi';
  print(nickname!.toUpperCase());         // ! asserts it's not null (crashes if it is: use carefully)
  print(name.length);
}

int? getDiscount(String customerType) => customerType == 'VIP' ? 10 : null;
```

| Syntax | Meaning |
|---|---|
| `String?` | Nullable String |
| `a ?? b` | `a` if not null, else `b` |
| `a?.b` | Access `b` only if `a` isn't null |
| `a!` | "I'm sure a isn't null" |
| `late` | Will be initialised before use (e.g. in Flutter `initState`) |

## Strings

```dart
void main() {
  var first = 'Wanjiku';
  var last = 'Kamau';
  var full = '$first $last';                      // interpolation
  print('Name: $full (${full.length} characters)');
  print(full.toUpperCase());
  print(full.contains('Kamau'));
  print(full.split(' ').first);
  print('0712345678'.replaceFirst('0', '254'));
  print('KSh ${1500.5.toStringAsFixed(2)}');
  print(int.parse('1500') + 500);
  print(int.tryParse('abc') ?? 0);                // safe conversion
  var multi = '''
Line one
Line two''';
  print(multi);
}
```

## Operators, conditions and loops

```dart
void main() {
  var a = 17, b = 5;
  print('${a + b} ${a - b} ${a * b} ${a / b} ${a ~/ b} ${a % b}');   // / gives double, ~/ integer division

  var mark = 72;
  String grade;
  if (mark >= 80) {
    grade = 'A';
  } else if (mark >= 65) {
    grade = 'B';
  } else if (mark >= 50) {
    grade = 'C';
  } else {
    grade = 'D/E';
  }
  print('Mark $mark -> $grade');

  var status = 'shipped';
  var label = switch (status) {             // switch expression (Dart 3)
    'pending' => 'Waiting for payment',
    'paid' || 'processing' => 'Preparing your order',
    'shipped' => 'On the way',
    _ => 'Unknown',
  };
  print(label);

  for (var i = 1; i <= 3; i++) {
    print('7 x $i = ${7 * i}');
  }

  var towns = ['Nairobi', 'Mombasa', 'Kisumu'];
  for (var town in towns) {
    print(town);
  }

  var balance = 0.0;
  var months = 0;
  while (balance < 50000) {
    balance = balance * 1.01 + 4500;
    months++;
  }
  print('Months to save 50,000: $months');
}
```

## Functions

```dart
double vat(double amount, [double rate = 0.16]) => amount * rate;   // optional positional parameter

String greet({required String name, String title = ''}) {           // named parameters
  return title.isEmpty ? 'Hello, $name' : 'Hello, $title $name';
}

double applyAll(double price, List<double Function(double)> rules) {
  var result = price;
  for (final rule in rules) {
    result = rule(result);
  }
  return result;
}

void main() {
  print(vat(1000));
  print(vat(1000, 0.08));
  print(greet(name: 'Otieno'));
  print(greet(name: 'Akinyi', title: 'Dr.'));

  double tenPercentOff(double p) => p * 0.9;
  final addDelivery = (double p) => p + 250;        // anonymous function
  print(applyAll(5000, [tenPercentOff, addDelivery]));
}
```

Named parameters (`{required String name}`) are everywhere in Flutter: `Text('Hi', style: ...)`, `Padding(padding: ..., child: ...)`.

## Collections

```dart
void main() {
  // List: ordered
  var marks = <int>[67, 82, 45, 90];
  marks.add(58);
  print('Count ${marks.length}, first ${marks.first}, last ${marks.last}');
  print('Passed: ${marks.where((m) => m >= 50).toList()}');
  print('With bonus: ${marks.map((m) => m + 5).toList()}');
  print('Total: ${marks.reduce((a, b) => a + b)}');
  marks.sort();
  print('Sorted: $marks');

  // Set: unique values
  var receipts = <String>{'QJK1', 'QJK2'};
  print('Added QJK1 again? ${receipts.add('QJK1')}');   // false: already present

  // Map: key -> value
  var stock = <String, int>{'unga': 40, 'sugar': 25};
  stock['rice'] = 30;
  stock['unga'] = stock['unga']! - 5;
  stock.forEach((item, qty) => print('$item: $qty'));
  print('Has salt? ${stock.containsKey('salt')}');

  // Collection if/for and spread (used a lot in Flutter widget lists)
  var isAdmin = true;
  var menu = ['Home', 'Courses', if (isAdmin) 'Admin', for (var t in ['Help', 'Logout']) t];
  print(menu);
  var all = [...marks, 100];
  print(all);
}
```

| Collection | Use | Key methods |
|---|---|---|
| `List` | Ordered items | add, remove, where, map, sort, reduce, contains |
| `Set` | Unique items | add, contains, union, intersection |
| `Map` | Key–value pairs | [], containsKey, forEach, keys, values, entries |

:::think What's the difference between `final` and `const` in Dart, and why does Flutter code use `const` so often?
`final` is set once at runtime (e.g. `final now = DateTime.now()`); `const` must be known at compile time and creates a canonical, immutable value. Flutter uses `const` constructors for widgets that never change (like `const Text('Hello')`), so the framework can reuse them instead of rebuilding, which improves performance.
:::

## Summary

- Flutter builds apps for Android, iOS, web and desktop from one Dart codebase, with hot reload and native performance.
- Install Flutter (includes Dart), run `flutter doctor`, and use VS Code or Android Studio; DartPad and the Run button help practise.
- Variables use var, explicit types, final (runtime once) and const (compile time); null safety uses `?`, `??`, `?.`, `!` and `late`.
- Strings support interpolation (`$name`, `${expr}`) and methods; control flow includes if, switch expressions, for, for-in and while.
- Functions support optional positional and named parameters, arrow syntax and functions as values; collections are List, Set and Map with where, map, reduce and collection if/for.

```quiz
Q: Which language are Flutter apps written in?
A: Dart
Q: Which symbol makes a Dart type nullable?
A: ?
Q: Which operator gives a default value when something is null?
A: ?? | null-coalescing
Q: Which keyword declares a compile-time constant?
A: const
Q: Which operator performs integer division in Dart?
A: ~/
Q: Which command checks your Flutter installation? (two words)
A: flutter doctor
```
