---
slug: flutter-state-navigation-forms
title: Flutter state, navigation, forms and loading data
after: flutter-layouts
---
# Flutter state, navigation, forms and loading data

A real app changes over time: a cart fills up, a form is typed into, data arrives from a server, the user moves between screens. This lesson covers the four skills that turn a static layout into a working app.

## 1. State with StatefulWidget and setState

```dart
import 'package:flutter/material.dart';

class CartButton extends StatefulWidget {
  const CartButton({super.key});
  @override
  State<CartButton> createState() => _CartButtonState();
}

class _CartButtonState extends State<CartButton> {
  int items = 0;                                   // the state

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: const Icon(Icons.remove),
          onPressed: items == 0 ? null : () => setState(() => items--),
        ),
        Text('$items in cart', style: const TextStyle(fontSize: 18)),
        IconButton(
          icon: const Icon(Icons.add),
          onPressed: () => setState(() => items++),   // setState redraws the widget
        ),
      ],
    );
  }
}
```

Change state **inside** `setState(...)`; Flutter then calls `build` again. For state shared across many screens (a cart, the logged-in user), use a state-management package such as **Provider** or **Riverpod**.

## 2. Navigation between screens

```dart
// Go to a details screen, passing data
Navigator.push(
  context,
  MaterialPageRoute(builder: (_) => ProductDetails(productId: 42)),
);

// Go back (optionally returning a value)
Navigator.pop(context, 'added');

// Replace the screen (e.g. after login, so Back doesn't return to the login page)
Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const HomeScreen()));
```

Larger apps often use named routes or the **go_router** package for web-style URLs and deep links.

## 3. Forms with validation

```dart
class PayForm extends StatefulWidget {
  const PayForm({super.key});
  @override
  State<PayForm> createState() => _PayFormState();
}

class _PayFormState extends State<PayForm> {
  final _formKey = GlobalKey<FormState>();
  final _phone = TextEditingController();
  final _amount = TextEditingController();

  @override
  void dispose() {                              // free controllers when the screen closes
    _phone.dispose();
    _amount.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _phone,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(labelText: 'M-Pesa number', hintText: '0712345678'),
            validator: (v) => RegExp(r'^0[17]\d{8}$').hasMatch(v ?? '') ? null : 'Enter 10 digits starting 07 or 01',
          ),
          TextFormField(
            controller: _amount,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Amount (KSh)'),
            validator: (v) => (int.tryParse(v ?? '') ?? 0) > 0 ? null : 'Enter an amount above 0',
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Sending prompt to ${_phone.text}...')),
                );
              }
            },
            child: const Text('Pay with M-Pesa'),
          ),
        ],
      ),
    );
  }
}
```

- A `validator` returns `null` when the value is fine, or an error message.
- `keyboardType` shows the right keyboard on phones.
- Never put M-Pesa or other API **secrets** in the app: the app calls **your server**, and your server talks to Daraja.

## 4. Loading data with FutureBuilder

```dart
FutureBuilder<List<Order>>(
  future: loadOrders(),                         // from the Dart async lesson
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(child: CircularProgressIndicator());
    }
    if (snapshot.hasError) {
      return Center(child: Text('Could not load orders. Check your connection.'));
    }
    final orders = snapshot.data!;
    if (orders.isEmpty) return const Center(child: Text('No orders yet'));
    return ListView.builder(
      itemCount: orders.length,
      itemBuilder: (_, i) => ListTile(
        title: Text(orders[i].customer),
        trailing: Text('KSh ${orders[i].total.toStringAsFixed(0)}'),
      ),
    );
  },
)
```

Always design the **four states**: loading, error, empty and data.

> Create the Future once (e.g. in `initState`) rather than inside `build`, otherwise the request repeats every time the screen redraws.

## Saving data on the phone

| Need | Package |
|---|---|
| Small settings (theme, token) | `shared_preferences` |
| Secure secrets (tokens) | `flutter_secure_storage` |
| Offline database | `sqflite` or `drift` |
| Cloud database and auth | Firebase (`cloud_firestore`, `firebase_auth`) or your own API |

## A typical small-app structure

```
lib/
├── main.dart            (app, theme, routes)
├── models/              (Product, Order: fromJson/toJson)
├── services/            (api_service.dart: all http calls)
├── screens/             (home_screen.dart, product_screen.dart, cart_screen.dart)
└── widgets/             (product_card.dart, cart_button.dart)
```

```quiz
Q: Which method tells Flutter the state changed and the widget should redraw?
A: setState | setState()
Q: Which Navigator method opens a new screen?
A: push | Navigator.push
Q: What should a TextFormField validator return when the input is valid?
A: null
Q: Which widget shows different UI while a Future is loading, failed or done?
A: FutureBuilder
Q: Should M-Pesa API secrets be stored inside the mobile app? (yes or no)
A: no
```
