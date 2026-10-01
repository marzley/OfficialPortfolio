---
slug: animations
title: Animations that feel good: implicit, Hero, page transitions and loaders
after: device-features
---
# Animations that feel good: implicit, Hero, page transitions and loaders

Good animation isn't decoration: it **explains what changed** (the item flew into the cart), **gives feedback** (the button pressed), and makes waiting feel shorter. Flutter makes smooth 60/120 fps animation easy.

## Level 1: implicit animations (the easy 80%)

"Implicit" widgets animate by themselves whenever a value you give them changes. Just change the value in `setState`.

| Widget | Animates |
|---|---|
| `AnimatedContainer` | Size, colour, padding, border radius, alignment |
| `AnimatedOpacity` | Fade in/out |
| `AnimatedScale`, `AnimatedRotation`, `AnimatedSlide` | Scale, rotate, move |
| `AnimatedAlign`, `AnimatedPadding`, `AnimatedPositioned` | Position |
| `AnimatedSwitcher` | Swap one child for another with a fade (or any transition) |
| `AnimatedCrossFade` | Fade between exactly two children |
| `TweenAnimationBuilder` | Any value you like (a number counting up) |

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: LikeCard()))));

class LikeCard extends StatefulWidget {
  const LikeCard({super.key});
  @override
  State<LikeCard> createState() => _LikeCardState();
}

class _LikeCardState extends State<LikeCard> {
  bool expanded = false;
  bool liked = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => expanded = !expanded),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeOutCubic,                     // how the speed changes over time
        width: expanded ? 320 : 220,
        height: expanded ? 220 : 120,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: expanded ? Colors.teal.shade100 : Colors.amber.shade100,
          borderRadius: BorderRadius.circular(expanded ? 28 : 12),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            const Expanded(child: Text('Mandazi ×10', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
            IconButton(
              onPressed: () => setState(() => liked = !liked),
              icon: AnimatedSwitcher(
                duration: const Duration(milliseconds: 250),
                transitionBuilder: (child, anim) => ScaleTransition(scale: anim, child: child),
                child: Icon(liked ? Icons.favorite : Icons.favorite_border,
                    key: ValueKey(liked),                // a new key tells AnimatedSwitcher the child changed
                    color: liked ? Colors.red : null),
              ),
            ),
          ]),
          AnimatedOpacity(
            opacity: expanded ? 1 : 0,
            duration: const Duration(milliseconds: 300),
            child: const Text('Freshly made every morning in Kisumu. Tap the card again to close.'),
          ),
        ]),
      ),
    );
  }
}
```

### Curves

`Curves.easeOut` (fast then slow: best for things appearing), `easeIn` (slow then fast: things leaving), `easeInOut`, `easeOutBack` (overshoots a little: playful), `linear` (mechanical: use for spinners only).

### Durations

| Movement | Duration |
|---|---|
| Small (a button, an icon) | 100 to 200 ms |
| Medium (a card expanding) | 250 to 400 ms |
| Large (a full-screen transition) | 300 to 500 ms |

Longer than ~500 ms feels slow. Respect users who turn off animations: `MediaQuery.disableAnimationsOf(context)`.

## Counting numbers up

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: BalanceCounter(balance: 48250)))));

class BalanceCounter extends StatelessWidget {
  final int balance;
  const BalanceCounter({super.key, required this.balance});

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: balance.toDouble()),
      duration: const Duration(milliseconds: 1200),
      curve: Curves.easeOutCubic,
      builder: (context, value, _) => Text(
        'KSh ${value.round()}',
        style: Theme.of(context).textTheme.displaySmall,
      ),
    );
  }
}
```

## Level 2: Hero (shared element) transitions

A **Hero** flies a widget from one screen to the next: tap a product photo and it grows into the details page. Give both widgets the **same `tag`**:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Gallery()));

const colours = [Colors.red, Colors.green, Colors.blue, Colors.orange, Colors.purple, Colors.teal];

class Gallery extends StatelessWidget {
  const Gallery({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kitenge prints')),
      body: GridView.count(
        crossAxisCount: 3,
        padding: const EdgeInsets.all(8),
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        children: [
          for (var i = 0; i < colours.length; i++)
            GestureDetector(
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => Detail(index: i))),
              child: Hero(tag: 'print-$i', child: Container(decoration: BoxDecoration(color: colours[i], borderRadius: BorderRadius.circular(12)))),
            ),
        ],
      ),
    );
  }
}

class Detail extends StatelessWidget {
  final int index;
  const Detail({super.key, required this.index});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Print ${index + 1}')),
      body: Column(children: [
        Hero(tag: 'print-$index', child: Container(height: 300, color: colours[index])),
        const Padding(padding: EdgeInsets.all(16), child: Text('100% cotton, 6 yards. KSh 1,800')),
      ]),
    );
  }
}
```

## Level 3: custom page transitions

```dart
Route<T> fadeRoute<T>(Widget page) => PageRouteBuilder<T>(
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (context, animation, secondary) => page,
      transitionsBuilder: (context, animation, secondary, child) => FadeTransition(
        opacity: animation,
        child: SlideTransition(
          position: Tween(begin: const Offset(0, 0.05), end: Offset.zero).animate(CurvedAnimation(parent: animation, curve: Curves.easeOut)),
          child: child,
        ),
      ),
    );

// Navigator.push(context, fadeRoute(const CartPage()));
```

## Level 4: explicit animations with AnimationController

When you need full control (repeat forever, play backwards, chain steps), use an `AnimationController`. The State needs `SingleTickerProviderStateMixin` (it syncs with the screen's refresh rate):

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: PulsingDot()))));

class PulsingDot extends StatefulWidget {
  const PulsingDot({super.key});
  @override
  State<PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<PulsingDot> with SingleTickerProviderStateMixin {
  late final AnimationController controller =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 900))..repeat(reverse: true);
  late final Animation<double> scale = Tween(begin: 0.8, end: 1.2).animate(CurvedAnimation(parent: controller, curve: Curves.easeInOut));

  @override
  void dispose() {
    controller.dispose();          // always dispose controllers
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: scale,
      child: Container(
        width: 60,
        height: 60,
        decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
        child: const Icon(Icons.wifi_tethering, color: Colors.white),
      ),
    );
  }
}
```

Controller methods: `forward()`, `reverse()`, `repeat()`, `stop()`, `reset()`, and `value` (0.0 to 1.0).

## Loading placeholders (skeletons)

Instead of a spinner in the middle of an empty screen, show grey boxes shaped like the content, gently pulsing. It feels faster. The **shimmer** package makes this easy, or build one with the pulsing technique above.

## Lottie and Rive

Designers make animations in **After Effects (Lottie)** or **Rive** and export small files. `lottie` and `rive` packages play them: great for onboarding screens, success ticks after payment and empty states. Free animations: lottiefiles.com.

## Don't overdo it

- Animate **meaningful** changes only.
- Keep it short and consistent (same curve and duration family everywhere).
- Test on a cheap phone: if it stutters, simplify (avoid animating big blurs and shadows).

```quiz
Q: Which widget animates size, colour and border radius when the values change?
A: AnimatedContainer
Q: Which widget swaps one child for another with a transition?
A: AnimatedSwitcher
Q: For a Hero animation, what must the two widgets share?
A: tag | the same tag
Q: Which mixin does a State need to create an AnimationController?
A: SingleTickerProviderStateMixin | TickerProviderStateMixin
Q: About how long should a small button animation take, in milliseconds? Give a number from 100 to 200.
A: 100 | 150 | 200 | 120 | 180
Q: Which curve starts fast and ends slow?
A: easeOut | Curves.easeOut | easeOutCubic
```
