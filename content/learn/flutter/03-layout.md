---
slug: layout-masterclass
title: Layout masterclass: Row, Column, Expanded, Stack and constraints
after: widgets-stateless-stateful
---
# Layout masterclass: Row, Column, Expanded, Stack and constraints

Layout is where most beginners get stuck in Flutter: yellow-and-black overflow stripes, "unbounded height" errors, things that won't centre. This lesson explains **how Flutter decides sizes** so you can build any screen with confidence.

## The one rule: constraints go down, sizes go up, parent sets position

1. A parent tells each child its **constraints**: a minimum and maximum width and height.
2. The child picks a **size** within those limits and reports it back up.
3. The parent decides **where** to put the child.

So a widget can't just "be 300 wide": it can only ask, and its parent's constraints win. Most layout puzzles are solved by asking *"what constraints is this widget getting?"*

| Constraint type | Meaning | Given by |
|---|---|---|
| Tight | Exactly this size | `SizedBox(width: 100, height: 50)`, a full screen |
| Loose | Anything from 0 up to a maximum | `Center`, `Align` |
| Unbounded | No maximum (infinite) | A `Column` gives its children unbounded **height**; a `ListView` scrolls, so it's unbounded in its scroll direction |

## Spacing and boxes

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: SafeArea(child: BoxesDemo()))));

class BoxesDemo extends StatelessWidget {
  const BoxesDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),                          // space inside, around the child
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
            margin: const EdgeInsets.only(bottom: 12),             // space outside
            decoration: BoxDecoration(
              color: Colors.amber.shade100,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.amber, width: 2),
              boxShadow: const [BoxShadow(blurRadius: 8, color: Colors.black12, offset: Offset(0, 4))],
            ),
            child: const Text('Container: padding, margin, colour, border, shadow'),
          ),
          const SizedBox(height: 12),                              // a fixed gap
          const SizedBox(width: double.infinity, height: 56,       // full width button
              child: ElevatedButton(onPressed: null, child: Text('Full-width button'))),
          const Divider(height: 32),
          const Align(alignment: Alignment.centerRight, child: Text('Aligned right')),
        ],
      ),
    );
  }
}
```

| Widget | Use |
|---|---|
| `Padding` | Space inside around one child |
| `SizedBox` | A fixed size, or an empty gap between widgets |
| `Container` | Padding + margin + colour + border + rounded corners + shadow in one |
| `Center` / `Align` | Put a child in the middle / at a corner or edge |
| `SafeArea` | Keep content away from the notch, status bar and gesture bar |
| `Divider` | A thin line between sections |

`EdgeInsets` options: `.all(16)`, `.symmetric(horizontal: 16, vertical: 8)`, `.only(left: 8, top: 4)`, `.fromLTRB(8, 4, 8, 4)`.

## Row and Column

A **Row** lays children out horizontally; a **Column** vertically.

- The **main axis** is the direction they lay out (horizontal for Row, vertical for Column).
- The **cross axis** is the other direction.

| Property | Values | Controls |
|---|---|---|
| `mainAxisAlignment` | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly` | Spacing along the main axis |
| `crossAxisAlignment` | `start`, `center`, `end`, `stretch`, `baseline` | Alignment across |
| `mainAxisSize` | `max` (default), `min` | Take all space, or only what children need |

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: SafeArea(child: OrderCard()))));

class OrderCard extends StatelessWidget {
  const OrderCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Order #1042', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                Chip(label: const Text('Paid'), backgroundColor: Colors.green.shade100),
              ],
            ),
            const SizedBox(height: 8),
            const Row(children: [Icon(Icons.person, size: 18), SizedBox(width: 6), Text('Wanjiku M.')]),
            const Row(children: [Icon(Icons.location_on, size: 18), SizedBox(width: 6), Text('Thika Road, Nairobi')]),
            const Divider(),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [Text('3 items'), Text('KSh 1,240', style: TextStyle(fontWeight: FontWeight.bold))],
            ),
          ],
        ),
      ),
    );
  }
}
```

## Expanded and Flexible: sharing space

By default, Row children are only as wide as they need. **`Expanded`** makes a child take the remaining space. Give several children `flex` values to share space in proportion.

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: SafeArea(child: FlexDemo()))));

class FlexDemo extends StatelessWidget {
  const FlexDemo({super.key});

  Widget box(Color c, String t) => Container(height: 60, color: c, alignment: Alignment.center, child: Text(t));

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(children: [box(Colors.red.shade200, 'fixed'), Expanded(child: box(Colors.green.shade200, 'Expanded: the rest'))]),
        Row(children: [
          Expanded(flex: 2, child: box(Colors.blue.shade200, 'flex 2')),
          Expanded(flex: 1, child: box(Colors.orange.shade200, 'flex 1')),
        ]),
        // A search bar: the text field takes all the space the button doesn't need
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(children: [
            const Expanded(child: TextField(decoration: InputDecoration(hintText: 'Search products', border: OutlineInputBorder()))),
            const SizedBox(width: 8),
            FilledButton(onPressed: () {}, child: const Text('Go')),
          ]),
        ),
        // Long text in a Row must be wrapped in Expanded or it overflows
        const Padding(
          padding: EdgeInsets.all(12),
          child: Row(children: [
            Icon(Icons.info_outline),
            SizedBox(width: 8),
            Expanded(child: Text('Deliveries within Nairobi take 1 to 2 days. Upcountry orders go by Easy Coach and take 2 to 3 days.')),
          ]),
        ),
      ],
    );
  }
}
```

`Flexible` is like `Expanded` but lets the child be **smaller** than its share. `Spacer()` is an empty `Expanded`: handy to push things apart.

## Stack: widgets on top of each other

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: ProductImage()))));

class ProductImage extends StatelessWidget {
  const ProductImage({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 260,
      height: 200,
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Container(color: Colors.teal.shade300, child: const Icon(Icons.image, size: 80, color: Colors.white)),
            ),
          ),
          Positioned(
            top: 10,
            left: 10,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(8)),
              child: const Text('-20%', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
          const Positioned(right: 8, bottom: 8, child: CircleAvatar(child: Icon(Icons.favorite_border))),
        ],
      ),
    );
  }
}
```

Children are drawn in order, so the **last child is on top**. Use `Positioned` (top, left, right, bottom) to pin children to edges.

## Wrap: chips that flow onto the next line

```dart
Wrap(
  spacing: 8,          // gap between chips in a line
  runSpacing: 8,       // gap between lines
  children: [for (final c in ['Vegetables', 'Fruits', 'Cereals', 'Dairy', 'Meat', 'Snacks']) Chip(label: Text(c))],
)
```

A `Row` with too many chips overflows; a `Wrap` moves them to the next line.

## Scrolling

A `Column` doesn't scroll. If content might be taller than the screen (always assume small phones!), wrap it:

```dart
SingleChildScrollView(
  padding: const EdgeInsets.all(16),
  child: Column(children: [/* a long form or article */]),
)
```

For long or endless lists use `ListView.builder` (next lesson): it only builds the rows that are visible.

## Responsive layouts

Phones are 320 to 430 points wide; tablets and the web are much wider. Two tools:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: ResponsiveGrid())));

class ResponsiveGrid extends StatelessWidget {
  const ResponsiveGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(                           // gives you the space available to THIS widget
      builder: (context, constraints) {
        final columns = constraints.maxWidth < 500 ? 2 : constraints.maxWidth < 900 ? 3 : 5;
        return GridView.count(
          crossAxisCount: columns,
          padding: const EdgeInsets.all(12),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          children: [for (var i = 1; i <= 12; i++) Card(child: Center(child: Text('Product $i')))],
        );
      },
    );
  }
}
```

- `MediaQuery.sizeOf(context)` gives the **whole screen's** size.
- `LayoutBuilder` gives the space **your widget** has (better inside panels and split screens).

## Fixing the famous layout errors

| Error | Why | Fix |
|---|---|---|
| Yellow/black stripes: *"A RenderFlex overflowed by 42 pixels on the right"* | Children of a Row are wider than the screen | Wrap the long child in `Expanded`/`Flexible`, use `Wrap`, or shorten text with `overflow: TextOverflow.ellipsis` |
| Same, *"on the bottom"* | Column taller than the screen (often when the keyboard opens) | Wrap in `SingleChildScrollView` or use a `ListView` |
| *"Vertical viewport was given unbounded height"* | A `ListView` inside a `Column` (the Column gives infinite height) | Wrap the ListView in `Expanded`, or give it `shrinkWrap: true` for short lists |
| *"BoxConstraints forces an infinite width"* | A `TextField` directly in a Row | Wrap the TextField in `Expanded` |
| Widget ignores its width/height | Its parent gives tight constraints | Wrap it in `Center` or `Align` so it gets loose constraints |

Use **Flutter DevTools → Widget inspector** (in VS Code: *Flutter: Open DevTools*) and tap a widget on your phone: it shows each widget's constraints and size. It's the fastest way to understand a layout.

```quiz
Q: Complete the rule: constraints go down, sizes go ...
A: up
Q: Which widget makes a Row child take all the remaining space?
A: Expanded
Q: What is the main axis of a Column?
A: vertical | the vertical axis | y
Q: Which widget puts children on top of each other?
A: Stack
Q: Which widget moves chips onto the next line instead of overflowing?
A: Wrap
Q: A ListView inside a Column gives "unbounded height". Which widget do you wrap the ListView in?
A: Expanded
Q: Which widget keeps content away from the notch and status bar?
A: SafeArea
Q: Which widget tells you the space available to your own widget?
A: LayoutBuilder
```
