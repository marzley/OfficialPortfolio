---
slug: dart-classes-async
title: Dart classes, JSON models and async/await
after: dart-functions-collections
---
# Dart classes, JSON models and async/await

Every Flutter app has **models** (a Product, an Order, a User) and fetches data from the internet **asynchronously**. This lesson covers exactly the Dart you'll use for that.

> Try the examples in **DartPad** (dartpad.dev).

## Classes and constructors

```dart
class Product {
  final int id;
  final String name;
  final double price;
  int stock;

  Product({required this.id, required this.name, required this.price, this.stock = 0});

  bool get inStock => stock > 0;                      // a getter
  String get label => '$name - KSh ${price.toStringAsFixed(0)}';

  void sell(int qty) {
    if (qty > stock) throw Exception('Only $stock $name left');
    stock -= qty;
  }

  @override
  String toString() => 'Product($name, stock: $stock)';
}

void main() {
  final unga = Product(id: 1, name: 'Unga 2kg', price: 180, stock: 10);
  unga.sell(3);
  print(unga.label);
  print('${unga.inStock} $unga');
  try {
    unga.sell(50);
  } catch (e) {
    print('Error: $e');
  }
}
```

- `this.id` in the constructor assigns the field directly.
- `final` fields can't change after creation: models are usually **immutable** in Flutter.
- `get` defines a computed property.

## Inheritance, abstract classes and mixins

```dart
abstract class Payment {
  final double amount;
  Payment(this.amount);
  double get fee;                                 // abstract getter
  double get total => amount + fee;
}

class MpesaPayment extends Payment {
  final String phone;
  MpesaPayment(double amount, this.phone) : super(amount);
  @override
  double get fee => 0;
}

class CardPayment extends Payment {
  CardPayment(double amount) : super(amount);
  @override
  double get fee => amount * 0.029;
}

void main() {
  final List<Payment> payments = [MpesaPayment(2500, '0712345678'), CardPayment(2500)];
  for (final p in payments) {
    print('${p.runtimeType}: ${p.total.toStringAsFixed(2)}');
  }
}
```

## JSON models (the pattern you'll use in every app)

```dart
import 'dart:convert';

class Order {
  final int id;
  final String customer;
  final double total;
  final bool paid;

  Order({required this.id, required this.customer, required this.total, required this.paid});

  factory Order.fromJson(Map<String, dynamic> json) => Order(
        id: json['id'] as int,
        customer: json['customer'] as String,
        total: (json['total'] as num).toDouble(),
        paid: json['paid'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {'id': id, 'customer': customer, 'total': total, 'paid': paid};
}

void main() {
  const body = '[{"id":1,"customer":"Faith","total":1950,"paid":true},{"id":2,"customer":"Otieno","total":60}]';
  final list = (jsonDecode(body) as List).map((e) => Order.fromJson(e)).toList();
  for (final o in list) {
    print('${o.customer}: ${o.total} paid=${o.paid}');
  }
  print(jsonEncode(list.first.toJson()));
}
```

A **factory constructor** (`Order.fromJson`) builds an object from a map. Tools like `json_serializable` can generate this code for big models.

## async, await and Future

A **Future** is a value that will arrive later (like a JavaScript Promise).

```dart
Future<double> fetchRate(String currency) async {
  await Future.delayed(const Duration(milliseconds: 500));   // pretend network call
  if (currency == 'XXX') throw Exception('Unknown currency');
  return currency == 'USD' ? 129.5 : 140.2;
}

Future<void> main() async {
  print('Loading...');
  final usd = await fetchRate('USD');
  print('USD: $usd');

  try {
    await fetchRate('XXX');
  } catch (e) {
    print('Failed: $e');
  }

  final both = await Future.wait([fetchRate('USD'), fetchRate('EUR')]);   // in parallel
  print(both);
}
```

## Calling a real API (in your Flutter project)

Add the `http` package (`flutter pub add http`), then:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<Order>> loadOrders() async {
  final res = await http.get(Uri.parse('https://example.com/api/orders'));
  if (res.statusCode != 200) {
    throw Exception('Server error ${res.statusCode}');
  }
  final data = jsonDecode(res.body) as List;
  return data.map((e) => Order.fromJson(e)).toList();
}
```

## Streams (values over time)

A **Stream** delivers many values over time: live chat messages, location updates, a countdown. `await for` reads them one by one, and Flutter's `StreamBuilder` widget redraws the screen on each value.

```quiz
Q: Which keyword makes a field unchangeable after the object is created?
A: final
Q: What kind of constructor usually builds a model from JSON? (one word)
A: factory
Q: Which Dart function turns a JSON string into maps and lists?
A: jsonDecode | jsonDecode()
Q: What type represents a value that will arrive later in Dart?
A: Future
Q: Which function waits for several Futures at the same time?
A: Future.wait | wait
```
