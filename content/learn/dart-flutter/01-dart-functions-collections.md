---
slug: dart-functions-collections
title: Dart functions, lists, maps and null safety
after: dart-basics
---
# Dart functions, lists, maps and null safety

Flutter apps are written in **Dart**. Before building screens, get comfortable with Dart's functions, collections and its **null safety**, which prevents the most common app crash ("null is not a subtype of...").

> Dart doesn't run in our editor. Copy any example into **DartPad** (dartpad.dev), which runs Dart and Flutter in your browser for free, then press Run.

## Functions

```dart
double withVat(double amount, {double rate = 16}) {   // named parameter with a default
  return amount * (1 + rate / 100);
}

String greet(String name, [String? title]) {          // [ ] = optional positional
  return title == null ? 'Habari $name' : 'Habari $title $name';
}

int square(int n) => n * n;                           // arrow function for one expression

void main() {
  print(withVat(1000));              // 1160.0
  print(withVat(1000, rate: 0));     // named argument
  print(greet('Wanjiru'));
  print(greet('Otieno', 'Dr.'));
  print(square(9));
}
```

| Parameter style | Declared as | Called as |
|---|---|---|
| Required positional | `f(int a)` | `f(3)` |
| Optional positional | `f([int? a])` | `f()` or `f(3)` |
| Named (optional) | `f({int a = 0})` | `f(a: 3)` |
| Named required | `f({required int a})` | `f(a: 3)` |

Flutter widgets use **named parameters** everywhere: `Text('Hi', style: ...)`, `Padding(padding: ..., child: ...)`.

## Lists

```dart
void main() {
  final towns = <String>['Nyeri', 'Meru'];
  towns.add('Embu');
  towns.insert(0, 'Nanyuki');
  print('${towns.length} towns, first: ${towns.first}');

  final prices = [180, 350, 60, 1200];
  final withVat = prices.map((p) => (p * 1.16).round()).toList();
  final cheap = prices.where((p) => p < 300).toList();
  final total = prices.reduce((a, b) => a + b);
  print('$withVat $cheap $total');

  prices.sort();
  print(prices);
  for (final p in prices) {
    print('KSh $p');
  }

  final menu = ['Home', 'Shop', if (true) 'Offers', for (var i = 1; i <= 2; i++) 'Page $i'];
  print(menu);   // collection if/for: used a lot for building widget lists
}
```

## Maps and sets

```dart
void main() {
  final stock = <String, int>{'Unga': 12, 'Sugar': 0, 'Oil': 7};
  stock['Rice'] = 20;
  stock.update('Unga', (v) => v - 2);
  print(stock['Oil']);            // 7
  print(stock['Beans']);          // null: missing key
  print(stock.containsKey('Sugar'));
  stock.forEach((item, qty) => print('$item: $qty'));

  final unique = {'Otieno', 'Wanjiru', 'Otieno'};   // a Set
  print(unique.length);           // 2
}
```

## Null safety

In Dart, a variable **cannot be null unless its type ends with `?`**. The compiler forces you to handle the null case.

```dart
void main() {
  String name = 'Amina';        // can never be null
  String? nickname;             // may be null (starts as null)

  // print(nickname.length);    // compile error: nickname might be null
  print(nickname?.length);      // ?. : null if nickname is null
  print(nickname ?? 'No nickname');   // ?? : a default value

  nickname = 'Mina';
  if (nickname != null) {
    print(nickname.length);     // safe: Dart knows it's not null here
  }

  int? maybeQty = int.tryParse('abc');   // null if not a number
  final qty = maybeQty ?? 1;
  print(qty);

  late String token;            // late: "I promise to set it before use"
  token = 'abc123';
  print(token);
}
```

| Syntax | Meaning |
|---|---|
| `String?` | May be null |
| `x?.y` | Access only if x isn't null |
| `x ?? y` | Use y if x is null |
| `x ??= y` | Assign y only if x is null |
| `x!` | "I'm sure it's not null" (crashes if you're wrong: avoid) |
| `late` | Initialised later, before first use |

## String interpolation

```dart
final item = 'Cake';
final qty = 2;
final price = 1800.0;
print('$qty x $item = KSh ${(qty * price).toStringAsFixed(2)}');
```

`$name` inserts a variable; `${expression}` inserts any expression.

```quiz
Q: Which free website runs Dart and Flutter code in the browser?
A: DartPad | dartpad.dev
Q: Which symbol after a type means the variable may be null?
A: ? | question mark
Q: Which operator gives a default value when something is null?
A: ??
Q: Which keyword makes a named parameter compulsory?
A: required
Q: Which list method keeps only matching items?
A: where | where()
```
