---
slug: themes-styling-assets
title: Styling your app: themes, colours, fonts, images and dark mode
after: lists-grids
---
# Styling your app: themes, colours, fonts, images and dark mode

A professional app uses **the same colours, fonts and shapes everywhere**. In Flutter you set these once in a **theme**, and every widget follows it. Change the theme and the whole app changes.

## Material 3 and the colour scheme

Flutter uses Google's **Material 3** design. The easiest way to get a full, matching set of colours is to give Flutter **one seed colour**:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const ThemedApp());

class ThemedApp extends StatelessWidget {
  const ThemedApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B1B35)),   // your brand colour
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B1B35), brightness: Brightness.dark),
      ),
      themeMode: ThemeMode.system,       // follow the phone's light/dark setting
      home: const PaletteScreen(),
    );
  }
}

class PaletteScreen extends StatelessWidget {
  const PaletteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Theme.of(context).colorScheme;
    Widget swatch(String name, Color bg, Color fg) =>
        Container(height: 56, color: bg, alignment: Alignment.center, child: Text(name, style: TextStyle(color: fg)));
    return Scaffold(
      appBar: AppBar(title: const Text('My colour scheme')),
      body: ListView(children: [
        swatch('primary', c.primary, c.onPrimary),
        swatch('primaryContainer', c.primaryContainer, c.onPrimaryContainer),
        swatch('secondary', c.secondary, c.onSecondary),
        swatch('tertiary', c.tertiary, c.onTertiary),
        swatch('surface', c.surface, c.onSurface),
        swatch('error', c.error, c.onError),
      ]),
      floatingActionButton: FloatingActionButton(onPressed: () {}, child: const Icon(Icons.add)),
    );
  }
}
```

Each colour has an **"on" partner** for text and icons placed on it (`primary` + `onPrimary`). Use them in pairs and your text is always readable, in light and dark mode.

**Rule:** never hard-code colours like `Colors.blue` inside screens. Use `Theme.of(context).colorScheme.primary`. Then dark mode and rebranding just work.

## Text styles

The theme has a ready scale of text styles:

| Style | Typical use |
|---|---|
| `displayLarge` / `displayMedium` | Huge numbers (a balance) |
| `headlineMedium` | Screen headings |
| `titleLarge` / `titleMedium` | Card and section titles |
| `bodyLarge` / `bodyMedium` | Normal text |
| `labelLarge` | Buttons |
| `bodySmall` / `labelSmall` | Captions, hints |

```dart
Text('KSh 12,450', style: Theme.of(context).textTheme.displaySmall)
Text('Available balance', style: Theme.of(context).textTheme.bodySmall)

// adjust one style without losing the rest
Text('Overdue', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.red, fontWeight: FontWeight.bold))
```

## Styling all buttons, inputs and cards at once

```dart
import 'package:flutter/material.dart';

final appTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFFFB800)),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      minimumSize: const Size.fromHeight(52),                 // tall, full-width buttons
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
  ),
  cardTheme: CardTheme(elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
  appBarTheme: const AppBarTheme(centerTitle: true),
);

void main() => runApp(MaterialApp(
      theme: appTheme,
      home: Scaffold(
        appBar: AppBar(title: const Text('Checkout')),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(children: [
            const TextField(decoration: InputDecoration(labelText: 'M-Pesa number', prefixIcon: Icon(Icons.phone))),
            const SizedBox(height: 16),
            FilledButton(onPressed: () {}, child: const Text('Pay KSh 1,240')),
          ]),
        ),
      ),
    ));
```

Every `FilledButton`, `TextField` and `Card` in the app now looks the same without repeating styles.

## Custom fonts

1. Download a font (for example **Inter** or **Poppins** from fonts.google.com) and copy the `.ttf` files to `assets/fonts/`.
2. Register them in `pubspec.yaml` (indentation matters: 2 spaces):

```yaml
flutter:
  uses-material-design: true
  fonts:
    - family: Poppins
      fonts:
        - asset: assets/fonts/Poppins-Regular.ttf
        - asset: assets/fonts/Poppins-Bold.ttf
          weight: 700
```

3. Use it app-wide: `ThemeData(fontFamily: 'Poppins', ...)`.

(Or use the **google_fonts** package, which downloads fonts at run time. Bundling them is better for apps used offline.)

## Images

**From the internet:**

```dart
Image.network(
  'https://example.com/unga.jpg',
  width: 120, height: 120, fit: BoxFit.cover,
  loadingBuilder: (context, child, progress) => progress == null ? child : const CircularProgressIndicator(),
  errorBuilder: (context, error, stack) => const Icon(Icons.broken_image),   // no internet? show an icon, not a crash
)
```

**Bundled with the app (assets):** put files in `assets/images/`, list the folder in `pubspec.yaml`, then use `Image.asset`:

```yaml
flutter:
  assets:
    - assets/images/
```

```dart
Image.asset('assets/images/logo.png', height: 64)
```

`BoxFit` values: `cover` (fill, crop the edges), `contain` (fit inside, maybe with gaps), `fill` (stretch), `fitWidth`, `fitHeight`.

**Round photos:** `CircleAvatar(backgroundImage: NetworkImage(url), radius: 28)` or wrap an image in `ClipRRect(borderRadius: BorderRadius.circular(12), child: ...)`.

**Keep your APK small:** use `.webp` images, resize them before adding (no 4000-pixel photos for a 100-pixel icon), and use icons (`Icons.x`) instead of image files where possible.

## Icons

Flutter includes the full Material icon set: `Icon(Icons.shopping_cart)`, `Icons.phone`, `Icons.payments`, `Icons.delivery_dining`... Search them at **fonts.google.com/icons**. Most icons have `_outlined` and `_rounded` versions (`Icons.home_outlined`).

## Let the user choose light or dark

```dart
import 'package:flutter/material.dart';

void main() => runApp(const App());

class App extends StatefulWidget {
  const App({super.key});
  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  ThemeMode mode = ThemeMode.system;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(colorSchemeSeed: Colors.teal, useMaterial3: true),
      darkTheme: ThemeData(colorSchemeSeed: Colors.teal, brightness: Brightness.dark, useMaterial3: true),
      themeMode: mode,
      home: Scaffold(
        appBar: AppBar(title: const Text('Settings')),
        body: ListView(children: [
          for (final m in ThemeMode.values)
            RadioListTile<ThemeMode>(
              title: Text({ThemeMode.system: 'Same as phone', ThemeMode.light: 'Light', ThemeMode.dark: 'Dark'}[m]!),
              value: m,
              groupValue: mode,
              onChanged: (v) => setState(() => mode = v!),
            ),
        ]),
      ),
    );
  }
}
```

(To remember the choice after the app restarts, save it with `shared_preferences`: see the local storage lesson.)

## App icon and name

- **Name** shown under the icon: `android/app/src/main/AndroidManifest.xml` → `android:label="Duka"`.
- **Icon**: the easiest way is the **flutter_launcher_icons** package: put a 1024×1024 PNG in `assets/icon.png`, configure it in `pubspec.yaml`, and run `dart run flutter_launcher_icons`. It creates every size Android and iOS need.

## Design checklist

- One seed colour (your brand), everything else from the colour scheme.
- Text styles from `textTheme`, not random font sizes.
- Touch targets at least **48×48** (Material buttons already are).
- Enough contrast: light grey text on white fails outdoors in the sun.
- Test **dark mode** and **large text** (phone Settings → Font size) before release.

```quiz
Q: Which ColorScheme constructor builds a full palette from one colour?
A: ColorScheme.fromSeed | fromSeed
Q: Which colour should text on a primary-coloured button use?
A: onPrimary | colorScheme.onPrimary
Q: Which MaterialApp property makes the app follow the phone's light/dark setting? Write the value.
A: ThemeMode.system | system
Q: Which widget shows an image bundled inside the app? Write the constructor.
A: Image.asset
Q: Which BoxFit fills the box and crops the edges?
A: cover | BoxFit.cover
Q: Which file do you register fonts and images in?
A: pubspec.yaml
```
