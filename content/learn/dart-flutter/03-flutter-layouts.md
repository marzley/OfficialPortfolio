---
slug: flutter-layouts
title: Flutter layouts: Row, Column, Stack, ListView and responsive screens
after: flutter-widgets
---
# Flutter layouts

In Flutter, **everything is a widget**, including layout. You build screens by nesting a small set of layout widgets. Master these and you can build almost any design.

> Paste the examples into DartPad (choose a Flutter sample first) or run them in your Flutter project with `flutter run`.

## The core layout widgets

| Widget | Does |
|---|---|
| `Column` | Children top to bottom |
| `Row` | Children left to right |
| `Stack` | Children on top of each other |
| `Container` | Box with padding, margin, colour, border, size |
| `Padding` | Space inside around a child |
| `SizedBox` | Fixed size, or a gap between widgets |
| `Expanded` / `Flexible` | Share remaining space in a Row/Column |
| `Center`, `Align` | Position a child |
| `ListView` | Scrollable list |
| `GridView` | Scrollable grid |
| `Card`, `ListTile` | Ready-made Material pieces |

## Row and Column alignment

```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,     // along the column (vertical)
  crossAxisAlignment: CrossAxisAlignment.start,    // across it (horizontal)
  children: [
    const Text('Mama Njeri Bakery', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
    const SizedBox(height: 8),                     // a gap
    Row(
      children: [
        const Icon(Icons.location_on, color: Colors.red),
        const SizedBox(width: 4),
        const Text('Thika Road, Juja'),
        const Spacer(),                            // pushes the next child to the end
        TextButton(onPressed: () {}, child: const Text('Map')),
      ],
    ),
  ],
)
```

- **Main axis** = the direction of the Row/Column; **cross axis** = the other direction.
- `Expanded` makes a child take the remaining space; give several children `flex: 2`, `flex: 1` to share it.

## A product card

```dart
class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.name, required this.price, required this.imageUrl});
  final String name;
  final int price;
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AspectRatio(aspectRatio: 4 / 3, child: Image.network(imageUrl, fit: BoxFit.cover)),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 4),
                Text('KSh $price', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

## Stack: layering (badges, image overlays)

```dart
Stack(
  children: [
    Image.network('https://picsum.photos/400/200', fit: BoxFit.cover),
    Positioned(
      top: 8,
      left: 8,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(8)),
        child: const Text('-20%', style: TextStyle(color: Colors.white)),
      ),
    ),
  ],
)
```

## Scrolling lists

```dart
final products = List.generate(50, (i) => 'Product ${i + 1}');

ListView.builder(                        // builds only visible rows: fast for long lists
  itemCount: products.length,
  itemBuilder: (context, i) => ListTile(
    leading: CircleAvatar(child: Text('${i + 1}')),
    title: Text(products[i]),
    subtitle: const Text('In stock'),
    trailing: const Icon(Icons.chevron_right),
    onTap: () {},
  ),
)
```

Grids:

```dart
GridView.builder(
  padding: const EdgeInsets.all(12),
  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 220,             // columns adapt to screen width
    mainAxisSpacing: 12,
    crossAxisSpacing: 12,
    childAspectRatio: 0.75,
  ),
  itemCount: 20,
  itemBuilder: (context, i) => ProductCard(name: 'Item $i', price: 100 * i, imageUrl: 'https://picsum.photos/seed/$i/400/300'),
)
```

## Responsive layouts

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 700) {
      return Row(children: const [Expanded(child: Menu()), Expanded(flex: 3, child: Content())]);
    }
    return const Content();   // phones: one column, menu in a Drawer
  },
)
```

`MediaQuery.of(context).size.width` also gives the screen width.

## Fixing the famous overflow error

The yellow-and-black striped bar ("A RenderFlex overflowed by 42 pixels") means content is bigger than its space. Fixes:

- Wrap long text in `Expanded` or `Flexible` inside a Row.
- Make the screen scrollable with `SingleChildScrollView` or a `ListView`.
- Don't give fixed heights that are too small; let widgets size themselves.

## Use the Flutter Inspector

In VS Code or Android Studio, the **Flutter Inspector** shows the widget tree and draws layout boundaries so you can see why something sits where it does.

```quiz
Q: Which widget lays out children from top to bottom?
A: Column
Q: Which widget layers children on top of each other?
A: Stack
Q: Which widget makes a child fill the remaining space in a Row?
A: Expanded
Q: Which ListView constructor builds only the visible rows?
A: ListView.builder | builder
Q: Which widget makes a screen scroll when content is too tall? (write the class name)
A: SingleChildScrollView | ListView
```
