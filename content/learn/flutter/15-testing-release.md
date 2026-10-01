---
slug: testing-release
title: Testing, debugging and releasing your Flutter app
after: project-duka-app
---
# Testing, debugging and releasing your Flutter app

An app isn't finished when it works on your phone. It's finished when it **works on other people's phones**, **doesn't crash**, and is **on the Play Store**. This lesson covers debugging, automatic tests, performance, and the release build.

## Debugging tools

| Tool | Use |
|---|---|
| `print()` / `debugPrint()` | Quick values in the terminal (`debugPrint` doesn't cut long text) |
| **Breakpoints** (click beside a line in VS Code, then run with F5) | Pause the app, look at every variable, step line by line |
| **Flutter DevTools** → Widget inspector | Tap a widget on the phone to see its size, constraints and position |
| DevTools → Performance | Find slow frames (red bars = jank) |
| DevTools → Network | See every HTTP request, response and time |
| DevTools → Memory | Find leaks (screens that never get freed) |

Read red error screens from the **top**: the first line says what went wrong, and the stack trace shows **your file and line** (look for `lib/...`).

## Three kinds of tests

| Test | Checks | Speed | Folder |
|---|---|---|---|
| **Unit test** | One function or class (the `Cart`, a price calculator) | Milliseconds | `test/` |
| **Widget test** | One widget or screen: taps, text, layout | Fast (no phone needed) | `test/` |
| **Integration test** | The whole app on a real phone or emulator | Slow | `integration_test/` |

Write many unit tests, some widget tests and a few integration tests.

### A unit test

```dart
import 'package:flutter_test/flutter_test.dart';

// The code under test (normally imported from lib/)
int withVat(int amount) => (amount * 1.16).round();

String? normalisePhone(String input) {
  final d = input.replaceAll(RegExp(r'\D'), '');
  if (RegExp(r'^0[17]\d{8}$').hasMatch(d)) return '254${d.substring(1)}';
  if (RegExp(r'^254[17]\d{8}$').hasMatch(d)) return d;
  return null;
}

void main() {
  test('VAT is 16%', () {
    expect(withVat(1000), 1160);
    expect(withVat(0), 0);
  });

  group('normalisePhone', () {
    test('accepts local and international formats', () {
      expect(normalisePhone('0712 345 678'), '254712345678');
      expect(normalisePhone('+254 112 345 678'), '254112345678');
    });
    test('rejects bad numbers', () {
      expect(normalisePhone('12345'), isNull);
      expect(normalisePhone('0812345678'), isNull);
    });
  });
}
```

Run all tests with **`flutter test`**. Each `expect(actual, expected)` must be true or the test fails and tells you both values.

### A widget test

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int n = 0;
  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(child: Text('Items: $n')),
        floatingActionButton: FloatingActionButton(onPressed: () => setState(() => n++), child: const Icon(Icons.add)),
      );
}

void main() {
  testWidgets('tapping + adds an item', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: Counter()));   // draw the widget
    expect(find.text('Items: 0'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.add));                      // tap the button
    await tester.pump();                                           // redraw after setState

    expect(find.text('Items: 1'), findsOneWidget);
    expect(find.text('Items: 0'), findsNothing);
  });
}
```

Useful finders: `find.text`, `find.byIcon`, `find.byType(ElevatedButton)`, `find.byKey(const Key('pay'))`. Use `tester.enterText(find.byType(TextField), '0712...')` to type, and `pumpAndSettle()` to wait for animations.

## Test on real devices

Before every release, test on:

- A **cheap, older Android** phone (2 GB RAM, Android 8 or 9): the phones many of your users have.
- A **small screen** (5 inch) and a big one.
- **Dark mode** and **large font** settings.
- **No internet** and **slow internet** (turn on airplane mode mid-request).
- Rotating the phone, and leaving the app and coming back.

## Performance checklist

- Run in **profile mode** to measure: `flutter run --profile` (debug mode is much slower and misleading).
- Use `const` widgets and `ListView.builder`.
- Don't rebuild the whole screen for small changes (`select`, `Consumer`, small widgets).
- Resize images; use `cacheWidth` on network images.
- Keep heavy work (parsing big JSON) off the UI thread with `compute()`.

## Preparing a release

1. **App id** (can never change after publishing): in `android/app/build.gradle`, `applicationId "ke.co.yourname.duka"`.
2. **Version** in `pubspec.yaml`: `version: 1.0.0+1`. The part after `+` (the build number) must go up with **every** upload.
3. **Name and icon**: `android:label` in the manifest; icons via `flutter_launcher_icons`.
4. **Permissions**: remove any you don't use.

### Signing key (keep it forever!)

Android apps must be signed. Create an **upload key** once:

```
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Create `android/key.properties` (and add it to `.gitignore`: it contains passwords):

```
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=upload
storeFile=/home/you/keys/upload-keystore.jks
```

Then follow the "Sign the app" steps on **docs.flutter.dev/deployment/android** to load it in `android/app/build.gradle`.

> **Back up the .jks file and passwords** (for example in an encrypted drive and a password manager). With Play App Signing, Google holds the real app key, so a lost upload key can be reset through support, but it takes time. Never commit keys to GitHub.

### Build

```
flutter build appbundle --release       # .aab for the Play Store  → build/app/outputs/bundle/release/app-release.aab
flutter build apk --release --split-per-abi   # smaller .apk files to share directly (WhatsApp, website)
```

`--split-per-abi` makes one APK per phone type (`arm64-v8a` fits almost all modern phones), each much smaller than one "fat" APK.

**Obfuscate** to make your code harder to read: add `--obfuscate --split-debug-info=build/symbols` (keep the symbols folder to read crash reports).

## Publishing on Google Play

1. Create a **Google Play Console** developer account (one-time fee of US$25; you can pay with a Visa/Mastercard debit card).
2. **Create app** → name, language, free or paid.
3. Complete **App content**: privacy policy URL (required; host it on your website), data safety form, content rating questionnaire, target audience, ads declaration.
4. **Store listing**: short description (80 characters), full description, at least 2 phone screenshots, a 512×512 icon and a 1024×500 feature graphic.
5. **Testing**: new personal developer accounts must run a **closed test with at least 12 testers for 14 days** before they can publish to everyone (check the current rule in Play Console). Ask friends, classmates or a WhatsApp group to join.
6. **Production** → create a release → upload the `.aab` → write release notes → roll out.

Reviews usually take from a few hours to a few days. Updates: raise the build number, build, upload a new release.

## After launch

- Add **Firebase Crashlytics** to see crashes from users' phones with the exact line.
- Read and reply to **Play Store reviews**: it improves your rating.
- Ship small updates often.
- Use **staged rollouts** (release to 10% first) for big changes.

```quiz
Q: Which command runs all your Flutter tests?
A: flutter test
Q: Which test type checks one function or class?
A: unit test | unit
Q: In a widget test, which call redraws after a tap?
A: pump | tester.pump | tester.pump()
Q: Which file type do you upload to the Google Play Store?
A: aab | .aab | app bundle | appbundle
Q: In version: 1.0.0+7, which number must go up with every upload?
A: 7 | the build number
Q: Which command builds the Play Store file?
A: flutter build appbundle | flutter build appbundle --release
Q: Which mode should you use to measure performance?
A: profile | profile mode | --profile
```
