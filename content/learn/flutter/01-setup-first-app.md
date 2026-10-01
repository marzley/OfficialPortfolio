---
slug: setup-first-app
title: Setting up Flutter and your first app
after: START
---
# Setting up Flutter and your first app

**Flutter** is Google's free toolkit for building apps for **Android, iPhone (iOS), the web, Windows, macOS and Linux** from **one codebase**. You write your app once in the **Dart** language and Flutter draws every pixel itself, so the app looks and behaves the same on every phone.

Big apps built with Flutter include Google Pay, BMW, Alibaba's Xianyu and many Kenyan fintech and SACCO apps. For a developer in Kenya, Flutter is one of the fastest ways to go from idea to an app on the Play Store.

> New to Dart? Do the **Dart & Flutter** subject's first three lessons (Dart basics, functions and classes) first, then come back here.

## What you need

| Item | Minimum | Better |
|---|---|---|
| Computer | 8 GB RAM, 20 GB free disk, 64-bit Windows 10, macOS or Linux | 16 GB RAM and an SSD |
| Phone for testing | Any Android phone (Android 7+) and a USB cable | A second, older phone to test on slow devices |
| Internet | To download about 3 GB once | |
| iPhone apps | A Mac with Xcode is needed to build for iPhone | |

**No powerful PC?** You can still learn: use **DartPad** (dartpad.dev) in your browser, which runs Flutter apps online for free. Every example in this course that starts with `import 'package:flutter/material.dart';` can be pasted into DartPad and run.

## Installing Flutter (Windows)

1. Download the Flutter SDK zip from **docs.flutter.dev** → Get started → Windows → Android.
2. Extract it to a simple folder like `C:\src\flutter` (not *Program Files*: it needs write access).
3. Add `C:\src\flutter\bin` to your **Path**: Start → "Edit the system environment variables" → Environment Variables → Path → Edit → New.
4. Install **Android Studio** (it brings the Android SDK and an emulator). Open it once and let it finish the setup wizard.
5. In Android Studio: **Plugins** → install **Flutter** (it installs Dart too).
6. Open a new Command Prompt and run:

```
flutter doctor
flutter doctor --android-licenses
```

`flutter doctor` checks everything and shows a tick or cross for each part. Fix each cross it lists, then run it again until the Android parts are green.

```
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 3.24.5, on Microsoft Windows)
[✓] Android toolchain - develop for Android devices (Android SDK version 34.0.0)
[✓] Chrome - develop for the web
[✓] Android Studio (version 2024.1)
[✓] VS Code (version 1.95)
[✓] Connected device (2 available)
```

**VS Code** is lighter than Android Studio for writing code. Install it and add the **Flutter** extension. You still need Android Studio installed for the Android SDK.

## Running on your own phone

Testing on a real phone is faster than the emulator on most laptops.

1. On the phone: **Settings → About phone → tap "Build number" 7 times**. You're now a developer.
2. **Settings → System → Developer options → turn on USB debugging**.
3. Connect the USB cable and tap **Allow** on the phone.
4. Run `flutter devices`. Your phone should be listed.

> Wireless option (Android 11+): Developer options → **Wireless debugging**, then pair from Android Studio's device menu. No cable needed.

## Create and run your first app

```
flutter create duka
cd duka
flutter run
```

`flutter create` makes a complete starter app (a counter). `flutter run` builds it and installs it on your phone or emulator. The first build takes a few minutes; later ones are fast.

While it runs, the terminal accepts keys:

| Key | Does |
|---|---|
| `r` | **Hot reload**: shows your code change in about a second and keeps the app's state |
| `R` | **Hot restart**: restarts the app from the beginning (state is lost) |
| `q` | Quit |

Hot reload is Flutter's superpower: change a colour or a word, save, and see it on the phone instantly.

## What's in a Flutter project

```
duka/
├── lib/
│   └── main.dart          ← your Dart code starts here
├── pubspec.yaml           ← app name, version, packages, images and fonts
├── android/               ← the Android project (app id, permissions, icons)
├── ios/                   ← the iPhone project (needs a Mac)
├── web/  windows/  ...    ← other platforms
├── test/                  ← automatic tests
└── build/                 ← generated files (never edit or commit)
```

You will spend 95% of your time in `lib/` and `pubspec.yaml`.

## Your first app, line by line

Replace everything in `lib/main.dart` with this and save. Hot reload shows it at once.

```dart
import 'package:flutter/material.dart';   // Google's Material Design widgets

void main() {
  runApp(const DukaApp());                  // start the app with the root widget
}

class DukaApp extends StatelessWidget {
  const DukaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Duka',
      debugShowCheckedModeBanner: false,    // hide the red "DEBUG" ribbon
      theme: ThemeData(colorSchemeSeed: Colors.teal, useMaterial3: true),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(                         // a basic screen: app bar + body + buttons
      appBar: AppBar(title: const Text('Mama Mboga Duka')),
      body: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.storefront, size: 72),
            SizedBox(height: 12),
            Text('Karibu! Fresh vegetables daily.', style: TextStyle(fontSize: 20)),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.phone),
        label: const Text('Call to order'),
      ),
    );
  }
}
```

What each part does:

- `main()` is where every Dart program starts. `runApp()` takes a widget and makes it the whole screen.
- **`MaterialApp`** sets up the app: its title, theme (colours and fonts) and the first screen (`home`).
- **`Scaffold`** is one screen's skeleton: `appBar` at the top, `body` in the middle, and a `floatingActionButton`.
- **`Center`**, **`Column`**, **`Icon`**, **`SizedBox`** and **`Text`** are all widgets. A screen is a **tree** of widgets inside widgets.
- `const` tells Flutter a widget never changes, so it can reuse it instead of rebuilding it. It makes apps faster. Your editor will suggest where to add it.

## The widget tree

```
DukaApp
└── MaterialApp
    └── HomeScreen
        └── Scaffold
            ├── AppBar → Text
            ├── Center → Column → Icon, SizedBox, Text
            └── FloatingActionButton → Icon, Text
```

Learning Flutter is mostly learning **which widgets exist** and **how to nest them**. The next lessons cover the important ones.

## Useful commands

| Command | Use |
|---|---|
| `flutter doctor` | Check your setup |
| `flutter devices` | List phones and emulators |
| `flutter run` | Build and run in debug mode |
| `flutter pub add http` | Add a package (here, `http`) |
| `flutter pub get` | Download the packages listed in `pubspec.yaml` |
| `flutter clean` | Delete build files (fixes many strange build errors) |
| `flutter build apk --release` | Make an installable APK |
| `flutter build appbundle` | Make an AAB for the Play Store |
| `flutter upgrade` | Update Flutter |

## Common first-day problems

| Problem | Fix |
|---|---|
| `'flutter' is not recognized` | The `bin` folder isn't on your Path. Add it and open a **new** terminal. |
| `Android license status unknown` | Run `flutter doctor --android-licenses` and type `y` to each. |
| Phone not listed | Change the USB mode to *File transfer*, accept the "Allow USB debugging" pop-up, try another cable. |
| Gradle build takes forever / fails | It downloads a lot the first time: use good internet and wait. Then try `flutter clean` and run again. |
| Emulator very slow | Turn on virtualization (VT-x/SVM) in the BIOS, or use your real phone. |

```quiz
Q: Which command checks that Flutter and the Android tools are installed correctly?
A: flutter doctor
Q: Which key do you press in the terminal for hot reload?
A: r
Q: Which file lists your app's packages, images and fonts?
A: pubspec.yaml
Q: Which folder holds your Dart code?
A: lib | lib/
Q: Which widget gives a screen an app bar, a body and a floating button?
A: Scaffold
Q: Which function takes your root widget and starts the app?
A: runApp | runApp()
```
