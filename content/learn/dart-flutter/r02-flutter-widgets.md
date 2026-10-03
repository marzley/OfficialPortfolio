---
slug: flutter-widgets
title: "Flutter widgets and layouts: the widget tree, Stateless vs Stateful, Material basics, Row/Column/Stack, lists, theming and responsive design"
after: KEEP
---
# Flutter widgets and layouts: the widget tree, Stateless vs Stateful, Material basics, Row/Column/Stack, lists, theming and responsive design

In Flutter, **everything is a widget**: text, buttons, padding, rows, whole screens, even the app itself. You build interfaces by combining small widgets into a **widget tree**, and Flutter redraws the parts that change when your data changes. This unit explains how Flutter apps are structured, the difference between stateless and stateful widgets, the core layout widgets, building scrolling lists, theming your app with brand colours, and making layouts adapt to different screen sizes.

:::note What you will learn
- Creating a Flutter project and its structure
- main(), runApp, MaterialApp and Scaffold
- The widget tree and composition
- StatelessWidget vs StatefulWidget and setState
- Common widgets: Text, Icon, Image, buttons, Container, Card
- Layout: Padding, Center, Row, Column, Expanded, SizedBox, Stack
- Scrolling lists with ListView.builder
- Navigation between screens (intro)
- Theming: colours, fonts, Material 3
- Responsive layouts with MediaQuery and LayoutBuilder
- Hot reload and debugging layout problems
:::

## Create a project

```bash
flutter create mama_mboga
cd mama_mboga
flutter run            # runs on a connected phone, emulator, Chrome or desktop
```

| Path | Contents |
|---|---|
| `lib/main.dart` | App code starts here |
| `pubspec.yaml` | App name, version, dependencies (packages), assets (images, fonts) |
| `android/`, `ios/`, `web/`... | Platform-specific project files |
| `test/` | Tests |

## The app skeleton

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mama Mboga',
      theme: ThemeData(colorSchemeSeed: Colors.green, useMaterial3: true),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mama Mboga')),
      body: const Center(child: Text('Fresh vegetables delivered in Nakuru')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.shopping_cart),
      ),
    );
  }
}
```

- `runApp` starts the app with the root widget.
- `MaterialApp` provides Material Design, theming and navigation.
- `Scaffold` gives a screen structure: app bar, body, floating action button, drawer, bottom navigation.
- `build` returns the widget tree; Flutter calls it whenever the UI needs to be drawn.

## Stateless vs Stateful widgets

| StatelessWidget | StatefulWidget |
|---|---|
| Doesn't change after it's built (given the same inputs) | Holds **state** that changes over time |
| Examples: a logo, a product card showing fixed data | Examples: a counter, a form, a cart quantity, a toggle |

```dart
import 'package:flutter/material.dart';

class QuantityPicker extends StatefulWidget {
  const QuantityPicker({super.key, required this.price});
  final double price;

  @override
  State<QuantityPicker> createState() => _QuantityPickerState();
}

class _QuantityPickerState extends State<QuantityPicker> {
  int qty = 1;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: const Icon(Icons.remove),
          onPressed: qty > 1 ? () => setState(() => qty--) : null,   // disabled at 1
        ),
        Text('$qty', style: const TextStyle(fontSize: 18)),
        IconButton(
          icon: const Icon(Icons.add),
          onPressed: () => setState(() => qty++),
        ),
        const SizedBox(width: 12),
        Text('KSh ${(qty * widget.price).toStringAsFixed(0)}'),
      ],
    );
  }
}
```

**setState** tells Flutter the state changed so it rebuilds this widget. Data passed in from the parent (`price`) is read with `widget.price`.

## Common widgets

| Widget | Purpose |
|---|---|
| `Text` | Display text with `TextStyle` |
| `Icon` | Material icons (`Icons.phone`) |
| `Image.asset`, `Image.network` | Images from the app bundle or the internet |
| `ElevatedButton`, `FilledButton`, `OutlinedButton`, `TextButton`, `IconButton` | Buttons |
| `Container` | Padding, margin, colour, border, size in one widget |
| `Card` | Elevated surface for grouped content |
| `ListTile` | A standard list row: leading icon, title, subtitle, trailing |
| `TextField` / `TextFormField` | Text input (see the forms lesson) |
| `CircularProgressIndicator` | Loading |

## Layout widgets

| Widget | Use |
|---|---|
| `Padding` | Space around a child |
| `Center`, `Align` | Position a child |
| `SizedBox` | Fixed size or spacing (`SizedBox(height: 16)`) |
| `Row` / `Column` | Arrange children horizontally / vertically |
| `Expanded` / `Flexible` | Make children share available space in a Row/Column |
| `Stack` + `Positioned` | Overlap widgets (a badge on an image) |
| `Wrap` | Flow items onto new lines (tags, chips) |
| `GridView` | Grids of cards or images |

A product card combining several:

```dart
import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.name, required this.price, this.onAdd});
  final String name;
  final double price;
  final VoidCallback? onAdd;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            const CircleAvatar(child: Icon(Icons.local_grocery_store)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: Theme.of(context).textTheme.titleMedium),
                  Text('KSh ${price.toStringAsFixed(0)}',
                      style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                ],
              ),
            ),
            FilledButton(onPressed: onAdd, child: const Text('Add')),
          ],
        ),
      ),
    );
  }
}
```

**Row/Column alignment**: `mainAxisAlignment` controls spacing along the direction (start, center, spaceBetween); `crossAxisAlignment` controls the other direction.

## Scrolling lists

For long or dynamic lists, use `ListView.builder`, which only builds the rows on screen:

```dart
import 'package:flutter/material.dart';

class ProductList extends StatelessWidget {
  const ProductList({super.key});

  static const products = [
    ('Sukuma wiki', 30.0),
    ('Tomatoes (1kg)', 100.0),
    ('Onions (1kg)', 120.0),
    ('Avocado', 25.0),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: products.length,
      itemBuilder: (context, i) {
        final (name, price) = products[i];
        return ListTile(
          leading: const Icon(Icons.eco),
          title: Text(name),
          trailing: Text('KSh ${price.toStringAsFixed(0)}'),
          onTap: () => ScaffoldMessenger.of(context)
              .showSnackBar(SnackBar(content: Text('$name added to cart'))),
        );
      },
    );
  }
}
```

## Navigation (intro)

```dart
Navigator.push(context, MaterialPageRoute(builder: (_) => const CartScreen()));
Navigator.pop(context);   // go back
```

Larger apps use named routes or packages like **go_router** for deep links and web URLs.

## Theming

Define colours and text styles once in `ThemeData`:

```dart
MaterialApp(
  theme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B1B35)),
    textTheme: const TextTheme(bodyMedium: TextStyle(fontSize: 16)),
  ),
  darkTheme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B1B35), brightness: Brightness.dark),
  ),
  themeMode: ThemeMode.system,
  home: const HomeScreen(),
)
```

Then use `Theme.of(context).colorScheme.primary` and `textTheme` in widgets instead of hard-coded colours, so light/dark mode and rebranding work everywhere.

## Responsive layouts

```dart
import 'package:flutter/material.dart';

class ResponsiveCatalogue extends StatelessWidget {
  const ResponsiveCatalogue({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth > 900 ? 4 : constraints.maxWidth > 600 ? 3 : 2;
        return GridView.count(
          crossAxisCount: columns,
          padding: const EdgeInsets.all(12),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          children: List.generate(
            8,
            (i) => Card(child: Center(child: Text('Product ${i + 1}'))),
          ),
        );
      },
    );
  }
}
```

`LayoutBuilder` gives the available width; `MediaQuery.sizeOf(context)` gives the screen size. Use them to switch between phone, tablet and desktop layouts.

## Hot reload and layout debugging

- **Hot reload** (`r` in the terminal or the lightning icon) applies code changes in about a second while keeping state; **hot restart** (`R`) resets state.
- **Flutter DevTools** has a Widget Inspector to see the tree and layout bounds.
- Common errors:
  - "RenderFlex overflowed by N pixels": a Row/Column's content is too big; wrap children in `Expanded`/`Flexible`, use `SingleChildScrollView`, or reduce sizes.
  - "Vertical viewport was given unbounded height": a ListView inside a Column; wrap the ListView in `Expanded`.

:::think A Row containing a long product name Text and an Add button shows a yellow-and-black overflow stripe on small phones. How do you fix it?
Wrap the Text in `Expanded` (or `Flexible`) so it takes only the remaining space, and set `overflow: TextOverflow.ellipsis` or allow wrapping with `maxLines`. The button keeps its natural size and the text adapts.
:::

## Summary

- Flutter apps are trees of widgets; `runApp`, `MaterialApp` and `Scaffold` form the skeleton; `build` describes the UI.
- StatelessWidgets don't change; StatefulWidgets hold state and call `setState` to rebuild.
- Layout with Padding, Row, Column, Expanded, SizedBox, Stack, Wrap and GridView; show long lists with ListView.builder.
- Navigate with Navigator (or go_router); theme with ColorScheme and TextTheme, supporting dark mode.
- Make layouts responsive with LayoutBuilder/MediaQuery; use hot reload and DevTools to fix overflow errors.

```quiz
Q: In Flutter, what is almost everything built from?
A: widgets | widget
Q: Which method tells Flutter to rebuild a StatefulWidget after data changes?
A: setState
Q: Which widget provides the basic screen structure with an app bar and body?
A: Scaffold
Q: Which widget makes a child fill the remaining space in a Row or Column?
A: Expanded
Q: Which ListView constructor efficiently builds only visible rows?
A: ListView.builder | builder
Q: Which Flutter feature shows code changes in about a second while keeping state? (two words)
A: hot reload
```
