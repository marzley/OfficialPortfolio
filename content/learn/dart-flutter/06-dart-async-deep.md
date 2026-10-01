---
slug: dart-async-streams-errors
title: "Dart async in depth: Futures, Streams, timeouts, retries and isolates"
after: dart-generics-enums-records
---
# Dart async in depth: Futures, Streams, timeouts, retries and isolates

Almost everything a real app does takes time: loading products from an API, waiting for an M-Pesa callback, reading a file, counting down an OTP timer. Dart handles this with **Futures** (one value later) and **Streams** (many values over time). This lesson goes deep, with complete programs you can run.

> Revise the basics in **Dart classes, JSON models and async/await** first.

## How Dart runs async code: the event loop

Dart runs your code on **one thread** with an **event loop**. When you `await` something, Dart doesn't freeze: it parks your function, handles other events (taps, animations, other Futures), and comes back when the result is ready.

```dart
Future<void> main() async {
  print('1. start');
  Future(() => print('4. a Future (event queue)'));
  Future.microtask(() => print('3. a microtask (runs first)'));
  print('2. end of main\'s synchronous code');
  await Future.delayed(Duration.zero);
  print('5. after await');
}
```

The order is always: synchronous code, then **microtasks**, then **events** (Futures, timers, I/O). This is why a long loop with no `await` freezes a Flutter screen: the event loop can't draw frames until the loop finishes.

## Running Futures one after another vs at the same time

```dart
import 'dart:async';

Future<String> fetch(String name, int ms) async {
  await Future.delayed(Duration(milliseconds: ms));
  return '$name loaded';
}

Future<void> main() async {
  final sw = Stopwatch()..start();

  // One after another: total ≈ 300 + 200 + 100 ms
  await fetch('products', 300);
  await fetch('customers', 200);
  await fetch('settings', 100);
  print('sequential: ~${(sw.elapsedMilliseconds / 100).round() * 100} ms');

  sw.reset();
  // At the same time: total ≈ the slowest one (300 ms)
  final results = await Future.wait([
    fetch('products', 300),
    fetch('customers', 200),
    fetch('settings', 100),
  ]);
  print('parallel: ~${(sw.elapsedMilliseconds / 100).round() * 100} ms');
  print(results);

  // Records version: different types, all at once
  final (count, name) = await (Future.value(42), Future.value('Duka')).wait;
  print('$name has $count products');
}
```

Use `Future.wait` when requests **don't depend on each other** (a dashboard loading sales, stock and customers). Use sequential `await` when one needs the result of another (log in, **then** load the user's shop).

## Error handling with async code

`await` turns a failed Future into an exception you can catch with `try`/`catch`. Create your own exception types so the UI can show the right message:

```dart
class ApiException implements Exception {
  final int status;
  final String message;
  ApiException(this.status, this.message);
  @override
  String toString() => 'ApiException($status): $message';
}

class NoInternetException implements Exception {}

Future<Map<String, dynamic>> loadOrder(int id) async {
  await Future.delayed(const Duration(milliseconds: 50));
  if (id == 0) throw NoInternetException();
  if (id == 404) throw ApiException(404, 'Order not found');
  return {'id': id, 'total': 1240};
}

String friendlyMessage(Object e) => switch (e) {
      NoInternetException() => 'No internet. Check your connection and try again.',
      ApiException(status: 404) => 'We could not find that order.',
      ApiException(status: >= 500) => 'Our server has a problem. Please try again shortly.',
      _ => 'Something went wrong.',
    };

Future<void> main() async {
  for (final id in [7, 404, 0]) {
    try {
      final order = await loadOrder(id);
      print('Order ${order['id']}: KSh ${order['total']}');
    } on NoInternetException {
      print('(offline) ${friendlyMessage(NoInternetException())}');
    } catch (e) {
      print(friendlyMessage(e));
    } finally {
      print('  hide the loading spinner for order $id');
    }
  }
}
```

**Never** leave a Future's error unhandled: in Flutter it shows up as a red error or a silent failure. Always `await` inside `try`, or attach `.catchError`.

## Timeouts

Mobile networks in Kenya can be slow or drop. Never wait forever:

```dart
import 'dart:async';

Future<String> slowServer() async {
  await Future.delayed(const Duration(seconds: 3));
  return 'data';
}

Future<void> main() async {
  try {
    final data = await slowServer().timeout(const Duration(milliseconds: 500));
    print(data);
  } on TimeoutException {
    print('The server took too long. Showing saved data instead.');
  }
}
```

## Retries with exponential backoff

When a request fails because of a bad connection, try again, waiting a little longer each time (200 ms, 400 ms, 800 ms...). **Only retry safe requests** (GETs, or payments protected by an idempotency key):

```dart
import 'dart:async';

int attempts = 0;

Future<String> flakyRequest() async {
  attempts++;
  await Future.delayed(const Duration(milliseconds: 20));
  if (attempts < 3) throw TimeoutException('network dropped');
  return 'products loaded on attempt $attempts';
}

Future<T> retry<T>(Future<T> Function() task, {int maxAttempts = 4, int baseMs = 100}) async {
  for (var attempt = 1;; attempt++) {
    try {
      return await task();
    } on TimeoutException catch (e) {
      if (attempt >= maxAttempts) rethrow;
      final wait = baseMs * (1 << (attempt - 1));        // 100, 200, 400 ...
      print('attempt $attempt failed (${e.message}); retrying in $wait ms');
      await Future.delayed(Duration(milliseconds: wait));
    }
  }
}

Future<void> main() async {
  print(await retry(flakyRequest));
}
```

## Streams: many values over time

A **Stream** delivers values one by one: a countdown, live order updates, a chat, GPS positions, Firestore documents. You listen with `await for` or `.listen()`.

### Making a stream with `async*`

```dart
// OTP resend countdown, like "Resend code in 5s"
Stream<int> countdown(int from) async* {
  for (var s = from; s >= 0; s--) {
    yield s;                                         // send a value to listeners
    await Future.delayed(const Duration(milliseconds: 100));   // 1 second in a real app
  }
}

Future<void> main() async {
  await for (final s in countdown(5)) {
    print(s == 0 ? 'You can resend the code now' : 'Resend code in ${s}s');
  }
}
```

### Transforming streams

Streams have the same helpers as lists (`map`, `where`, `take`), applied as values arrive:

```dart
Stream<Map<String, Object>> orderFeed() async* {
  final orders = [
    {'id': 1, 'total': 450, 'status': 'paid'},
    {'id': 2, 'total': 12000, 'status': 'pending'},
    {'id': 3, 'total': 3000, 'status': 'paid'},
    {'id': 4, 'total': 800, 'status': 'cancelled'},
    {'id': 5, 'total': 15500, 'status': 'paid'},
  ];
  for (final o in orders) {
    await Future.delayed(const Duration(milliseconds: 30));
    yield o;
  }
}

Future<void> main() async {
  final paidTotals = orderFeed()
      .where((o) => o['status'] == 'paid')
      .map((o) => o['total'] as int);

  var runningTotal = 0;
  await for (final t in paidTotals) {
    runningTotal += t;
    print('new paid order KSh $t, today so far KSh $runningTotal');
  }

  // Reduce a whole stream to one value
  final biggest = await orderFeed().map((o) => o['total'] as int).reduce((a, b) => a > b ? a : b);
  print('biggest order: KSh $biggest');
}
```

### StreamController: push values yourself

A `StreamController` lets one part of your app **push** events and others **listen**, for example a cart that several screens watch:

```dart
import 'dart:async';

class CartService {
  final _items = <String, int>{};
  final _controller = StreamController<int>.broadcast();   // broadcast: many listeners

  Stream<int> get count => _controller.stream;

  void add(String item) {
    _items.update(item, (q) => q + 1, ifAbsent: () => 1);
    _controller.add(_items.values.fold(0, (a, b) => a + b));
  }

  Future<void> dispose() => _controller.close();
}

Future<void> main() async {
  final cart = CartService();
  final badge = cart.count.listen((n) => print('cart badge shows $n'));
  final checkout = cart.count.listen((n) => print('  checkout button: ${n > 0 ? "enabled" : "disabled"}'));

  cart.add('Unga');
  cart.add('Sugar');
  cart.add('Unga');
  await Future.delayed(Duration.zero);     // let the events be delivered

  await badge.cancel();
  await checkout.cancel();
  await cart.dispose();
}
```

**Always cancel subscriptions and close controllers** when a screen is closed (in Flutter: in `dispose()`), otherwise you leak memory and get "setState called after dispose" errors. In Flutter, `StreamBuilder` listens and cancels for you.

## Debounce: wait until the user stops typing

A search box shouldn't call the API on every key press. **Debouncing** waits until the user pauses:

```dart
import 'dart:async';

class Debouncer {
  final Duration delay;
  Timer? _timer;
  Debouncer(this.delay);

  void run(void Function() action) {
    _timer?.cancel();                // a new key press cancels the previous wait
    _timer = Timer(delay, action);
  }
}

Future<void> main() async {
  final search = Debouncer(const Duration(milliseconds: 300));
  var apiCalls = 0;

  for (final text in ['u', 'un', 'ung', 'unga']) {
    search.run(() {
      apiCalls++;
      print('search API called with "$text"');
    });
    await Future.delayed(const Duration(milliseconds: 80));   // user typing fast
  }
  await Future.delayed(const Duration(milliseconds: 400));
  print('API calls: $apiCalls (instead of 4)');
}
```

## Isolates: heavy work without freezing the screen

Async code still runs on the **same thread**. Heavy CPU work (parsing a huge JSON file, processing images, big reports) freezes the UI. Move it to another **isolate** with `Isolate.run` (Flutter also has `compute()`):

```dart
import 'dart:isolate';

// Pretend this is a heavy report over thousands of sales
int heavyReport(int n) {
  var total = 0;
  for (var i = 1; i <= n; i++) {
    total += (i * 37) % 101;
  }
  return total;
}

Future<void> main() async {
  print('UI stays responsive while the report runs...');
  final result = await Isolate.run(() => heavyReport(20000000));
  print('Report total: $result');
}
```

Isolates **don't share memory**: data is copied in and out. Use them only for genuinely heavy work (more than about 16 ms, one frame).

## Async in Flutter: FutureBuilder and StreamBuilder

You don't need to run these here (they need a Flutter project), but this is how the ideas above appear in widgets:

```dart
import 'package:flutter/material.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});
  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  // Create the Future ONCE (in initState), not inside build()
  late final Future<List<String>> _orders = loadOrders();

  Future<List<String>> loadOrders() async {
    await Future.delayed(const Duration(seconds: 1));
    return ['Order 1001: KSh 1,240', 'Order 1002: KSh 450'];
  }

  Stream<int> countdown() async* {
    for (var s = 30; s >= 0; s--) {
      yield s;
      await Future.delayed(const Duration(seconds: 1));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Orders')),
      body: Column(
        children: [
          StreamBuilder<int>(
            stream: countdown(),
            builder: (context, snap) => Text('Refreshing in ${snap.data ?? 30}s'),
          ),
          Expanded(
            child: FutureBuilder<List<String>>(
              future: _orders,
              builder: (context, snap) {
                if (snap.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snap.hasError) {
                  return Center(child: Text('Could not load orders: ${snap.error}'));
                }
                final orders = snap.data!;
                if (orders.isEmpty) return const Center(child: Text('No orders yet'));
                return ListView(children: [for (final o in orders) ListTile(title: Text(o))]);
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

Every async screen needs **four states**: loading, error, empty and data. Forgetting the error and empty states is the most common beginner mistake.

## Summary

| Need | Tool |
|---|---|
| One value later | `Future`, `async`/`await` |
| Several independent requests | `Future.wait` or a record's `.wait` |
| Don't wait forever | `.timeout()` |
| Flaky networks | Retry with exponential backoff (safe requests only) |
| Many values over time | `Stream`, `async*`/`yield`, `await for` |
| Push events to many listeners | `StreamController.broadcast()` |
| Search-as-you-type | Debounce with a `Timer` |
| Heavy CPU work | `Isolate.run` / `compute()` |

```quiz
Q: How many threads does a single Dart isolate run your code on?
A: 1 | one
Q: Which runs first: a microtask or a Future event?
A: microtask | a microtask
Q: Which function runs several independent Futures at the same time?
A: Future.wait
Q: Which exception does .timeout() throw?
A: TimeoutException
Q: Which keyword sends a value out of an async* function?
A: yield
Q: Which StreamController constructor allows many listeners?
A: broadcast | StreamController.broadcast
Q: What technique waits until the user stops typing before searching?
A: debounce | debouncing
Q: Which function runs heavy work on another isolate?
A: Isolate.run | compute
```
