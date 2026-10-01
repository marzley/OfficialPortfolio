---
slug: forms-validation
title: Forms and input: text fields, validation, pickers and the keyboard
after: navigation-routing
---
# Forms and input: text fields, validation, pickers and the keyboard

Sign up, log in, checkout, "add a product": forms are everywhere. A good form is **quick to fill on a phone**, **catches mistakes before sending**, and **explains errors clearly**.

## TextField and TextEditingController

A `TextEditingController` holds what's typed, so you can read it, change it and listen to it.

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: GreetScreen()));

class GreetScreen extends StatefulWidget {
  const GreetScreen({super.key});
  @override
  State<GreetScreen> createState() => _GreetScreenState();
}

class _GreetScreenState extends State<GreetScreen> {
  final nameCtrl = TextEditingController();
  String greeting = '';

  @override
  void dispose() {
    nameCtrl.dispose();                     // controllers must be disposed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Greeting')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          TextField(
            controller: nameCtrl,
            textCapitalization: TextCapitalization.words,
            decoration: const InputDecoration(labelText: 'Your name', border: OutlineInputBorder()),
            onChanged: (v) => setState(() => greeting = v.isEmpty ? '' : 'Habari, $v!'),   // runs on every key
            onSubmitted: (_) => FocusScope.of(context).unfocus(),                          // Enter/Done: hide keyboard
          ),
          const SizedBox(height: 16),
          Text(greeting, style: Theme.of(context).textTheme.headlineSmall),
          TextButton(onPressed: () { nameCtrl.clear(); setState(() => greeting = ''); }, child: const Text('Clear')),
        ]),
      ),
    );
  }
}
```

## The right keyboard for each field

| Field | Setting | Why |
|---|---|---|
| Phone | `keyboardType: TextInputType.phone` | Number pad with + |
| Amount | `TextInputType.numberWithOptions(decimal: true)` | Digits and a dot |
| Email | `TextInputType.emailAddress` | Shows @ and .com |
| Password | `obscureText: true`, `autocorrect: false` | Hides text, no suggestions |
| Names | `textCapitalization: TextCapitalization.words` | Capital letter for each word |
| Long notes | `maxLines: 4` or `minLines: 2, maxLines: null` | Grows as you type |

Also set `textInputAction: TextInputAction.next` so the keyboard's button jumps to the next field, and `autofillHints: [AutofillHints.email]` so the phone can fill saved details.

## Form + TextFormField + validators

Wrap fields in a **`Form`** with a `GlobalKey<FormState>`. Each `TextFormField` gets a `validator` that returns an **error message**, or `null` if the value is fine. `formKey.currentState!.validate()` runs them all.

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() => runApp(MaterialApp(theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green), home: const SignUpScreen()));

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});
  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final formKey = GlobalKey<FormState>();
  final name = TextEditingController();
  final phone = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  bool hidePassword = true;
  bool agreed = false;
  bool sending = false;

  @override
  void dispose() {
    for (final c in [name, phone, email, password]) {
      c.dispose();
    }
    super.dispose();
  }

  /// Accepts 0712345678, 0112345678, 254712345678 or +254 712 345 678; returns 2547XXXXXXXX or null.
  static String? normalisePhone(String input) {
    final digits = input.replaceAll(RegExp(r'\D'), '');
    if (RegExp(r'^0[17]\d{8}$').hasMatch(digits)) return '254${digits.substring(1)}';
    if (RegExp(r'^254[17]\d{8}$').hasMatch(digits)) return digits;
    return null;
  }

  Future<void> submit() async {
    FocusScope.of(context).unfocus();
    if (!formKey.currentState!.validate()) return;           // shows every error message at once
    if (!agreed) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please accept the terms first.')));
      return;
    }
    setState(() => sending = true);
    await Future.delayed(const Duration(seconds: 2));         // pretend to call the server
    if (!mounted) return;
    setState(() => sending = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Account created for ${normalisePhone(phone.text)}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create account')),
      body: Form(
        key: formKey,
        autovalidateMode: AutovalidateMode.onUserInteraction,   // re-check a field once the user has typed in it
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: name,
              textCapitalization: TextCapitalization.words,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Full name', prefixIcon: Icon(Icons.person)),
              validator: (v) => (v == null || v.trim().split(' ').length < 2) ? 'Enter your first and last name' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: phone,
              keyboardType: TextInputType.phone,
              textInputAction: TextInputAction.next,
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9+ ]')), LengthLimitingTextInputFormatter(16)],
              decoration: const InputDecoration(labelText: 'M-Pesa number', hintText: '0712 345 678', prefixIcon: Icon(Icons.phone)),
              validator: (v) => normalisePhone(v ?? '') == null ? 'Enter a Safaricom or Airtel number like 0712 345 678' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: email,
              keyboardType: TextInputType.emailAddress,
              autofillHints: const [AutofillHints.email],
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Email (optional)', prefixIcon: Icon(Icons.email)),
              validator: (v) {
                if (v == null || v.isEmpty) return null;                        // optional field
                return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(v) ? null : 'That email doesn\'t look right';
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: password,
              obscureText: hidePassword,
              autocorrect: false,
              enableSuggestions: false,
              decoration: InputDecoration(
                labelText: 'Password',
                prefixIcon: const Icon(Icons.lock),
                helperText: 'At least 8 characters, with a number',
                suffixIcon: IconButton(
                  icon: Icon(hidePassword ? Icons.visibility : Icons.visibility_off),
                  tooltip: hidePassword ? 'Show password' : 'Hide password',
                  onPressed: () => setState(() => hidePassword = !hidePassword),
                ),
              ),
              validator: (v) {
                if (v == null || v.length < 8) return 'Use at least 8 characters';
                if (!RegExp(r'\d').hasMatch(v)) return 'Add at least one number';
                return null;
              },
            ),
            CheckboxListTile(
              value: agreed,
              onChanged: (v) => setState(() => agreed = v ?? false),
              title: const Text('I agree to the terms and privacy policy'),
              controlAffinity: ListTileControlAffinity.leading,
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 8),
            FilledButton(
              onPressed: sending ? null : submit,                              // disabled while sending: no double taps
              child: sending
                  ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.5))
                  : const Text('Create account'),
            ),
          ],
        ),
      ),
    );
  }
}
```

What makes this a good form:

- **Clear, specific error messages** ("Enter a Safaricom or Airtel number like 0712 345 678"), not "Invalid input".
- **Input formatters** stop bad characters being typed at all.
- **Normalising** the phone number means users can type it any way they like.
- The button is **disabled while sending**, so a second tap can't create two accounts (or charge twice!).
- A **`ListView`** (not a Column) means the form scrolls when the keyboard opens.

> Validation in the app is for convenience. **Always validate again on the server**: anyone can send requests to your API without using your app.

## Choices: switches, radios, dropdowns, chips

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: SafeArea(child: OrderOptions()))));

class OrderOptions extends StatefulWidget {
  const OrderOptions({super.key});
  @override
  State<OrderOptions> createState() => _OrderOptionsState();
}

enum Delivery { pickup, rider, courier }

class _OrderOptionsState extends State<OrderOptions> {
  bool giftWrap = false;
  Delivery delivery = Delivery.rider;
  String county = 'Nairobi';
  final extras = <String>{};
  double tip = 50;

  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.all(16), children: [
      SwitchListTile(title: const Text('Gift wrap (+KSh 100)'), value: giftWrap, onChanged: (v) => setState(() => giftWrap = v)),
      const Text('Delivery'),
      SegmentedButton<Delivery>(
        segments: const [
          ButtonSegment(value: Delivery.pickup, label: Text('Pick up')),
          ButtonSegment(value: Delivery.rider, label: Text('Boda rider')),
          ButtonSegment(value: Delivery.courier, label: Text('Courier')),
        ],
        selected: {delivery},
        onSelectionChanged: (s) => setState(() => delivery = s.first),
      ),
      const SizedBox(height: 16),
      DropdownButtonFormField<String>(
        value: county,
        decoration: const InputDecoration(labelText: 'County', border: OutlineInputBorder()),
        items: [for (final c in ['Nairobi', 'Kiambu', 'Machakos', 'Nakuru', 'Mombasa', 'Kisumu']) DropdownMenuItem(value: c, child: Text(c))],
        onChanged: (v) => setState(() => county = v!),
      ),
      const SizedBox(height: 16),
      Wrap(spacing: 8, children: [
        for (final e in ['Extra napkins', 'Call on arrival', 'Leave at gate'])
          FilterChip(
            label: Text(e),
            selected: extras.contains(e),
            onSelected: (on) => setState(() => on ? extras.add(e) : extras.remove(e)),
          ),
      ]),
      const SizedBox(height: 16),
      Text('Tip for the rider: KSh ${tip.round()}'),
      Slider(value: tip, min: 0, max: 200, divisions: 8, label: 'KSh ${tip.round()}', onChanged: (v) => setState(() => tip = v)),
    ]);
  }
}
```

## Date and time pickers

```dart
Future<void> pickDeliveryDate(BuildContext context) async {
  final now = DateTime.now();
  final date = await showDatePicker(
    context: context,
    initialDate: now.add(const Duration(days: 1)),
    firstDate: now,                                    // no past dates
    lastDate: now.add(const Duration(days: 30)),
    helpText: 'Choose delivery day',
  );
  if (date == null || !context.mounted) return;        // the user cancelled
  final time = await showTimePicker(context: context, initialTime: const TimeOfDay(hour: 10, minute: 0));
  if (time == null) return;
  final when = DateTime(date.year, date.month, date.day, time.hour, time.minute);
  debugPrint('Deliver at $when');
}
```

## Moving between fields and hiding the keyboard

- `textInputAction: TextInputAction.next` moves to the next field automatically inside a Form.
- On the last field use `TextInputAction.done` and `onFieldSubmitted: (_) => submit()`.
- Hide the keyboard: `FocusScope.of(context).unfocus()`. Many apps wrap the screen in `GestureDetector(onTap: () => FocusScope.of(context).unfocus(), child: ...)` so tapping empty space closes the keyboard.

## Accessibility for forms

- Always use `labelText` (screen readers read it), not only a hint.
- Show errors **as text**, not only by turning the border red.
- Keep tap targets 48 dp or bigger (the Material widgets already do).

```quiz
Q: Which class holds and controls the text in a TextField?
A: TextEditingController
Q: What should a validator return when the value is fine?
A: null
Q: Which call runs every validator in a Form? Write the method name.
A: validate | validate() | formKey.currentState!.validate()
Q: Which TextField property hides a password?
A: obscureText | obscureText: true
Q: Which keyboardType shows a number pad for phone numbers?
A: TextInputType.phone | phone
Q: Which widget groups fields so they can all be validated together?
A: Form
Q: Which function shows a calendar to choose a date?
A: showDatePicker
```
