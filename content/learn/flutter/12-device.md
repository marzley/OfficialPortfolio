---
slug: device-features
title: Phone features: camera, location, calls, WhatsApp, sharing and permissions
after: firebase-auth-firestore
---
# Phone features: camera, location, calls, WhatsApp, sharing and permissions

Apps become really useful when they use the phone itself: take a photo of a receipt, find the nearest branch, call the shop, open a WhatsApp chat, share an invoice. Flutter reaches these features through **plugins** (packages with Android and iOS code inside).

| Feature | Package |
|---|---|
| Open links, call, SMS, email, WhatsApp, maps | `url_launcher` |
| Camera and gallery photos | `image_picker` |
| GPS location | `geolocator` |
| Share text or files to other apps | `share_plus` |
| Scan QR/barcodes | `mobile_scanner` |
| Local notifications (reminders) | `flutter_local_notifications` |
| Check internet type | `connectivity_plus` |
| Fingerprint/face unlock | `local_auth` |

After adding a plugin, **stop the app and run it again** (hot reload doesn't load new native code).

## Calls, SMS, email, WhatsApp and maps with url_launcher

`flutter pub add url_launcher`

```dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

void main() => runApp(const MaterialApp(home: ContactScreen()));

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  static const phone = '+254745789590';

  Future<void> open(BuildContext context, Uri uri) async {
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No app on this phone can open that.')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final message = Uri.encodeComponent('Hello, I\'d like to order 2 packets of unga.');
    return Scaffold(
      appBar: AppBar(title: const Text('Contact the shop')),
      body: ListView(children: [
        ListTile(leading: const Icon(Icons.call), title: const Text('Call'), onTap: () => open(context, Uri.parse('tel:$phone'))),
        ListTile(leading: const Icon(Icons.sms), title: const Text('SMS'), onTap: () => open(context, Uri.parse('sms:$phone?body=$message'))),
        ListTile(
          leading: const Icon(Icons.chat),
          title: const Text('WhatsApp'),
          onTap: () => open(context, Uri.parse('https://wa.me/${phone.substring(1)}?text=$message')),   // wa.me needs 2547..., no +
        ),
        ListTile(leading: const Icon(Icons.email), title: const Text('Email'),
            onTap: () => open(context, Uri.parse('mailto:hello@example.co.ke?subject=Order&body=$message'))),
        ListTile(leading: const Icon(Icons.map), title: const Text('Directions'),
            onTap: () => open(context, Uri.parse('https://www.google.com/maps/search/?api=1&query=Kenyatta+Avenue+Nairobi'))),
        ListTile(leading: const Icon(Icons.public), title: const Text('Website'),
            onTap: () => open(context, Uri.parse('https://marzleytechsolutions.co.ke'))),
      ]),
    );
  }
}
```

**Android 11+ package visibility:** to check which apps can open a link, add a `<queries>` block to `AndroidManifest.xml` (the url_launcher README has the exact lines for `tel`, `sms`, `mailto` and `https`). Without it, `canLaunchUrl` may wrongly say "no".

`Uri.encodeComponent` turns spaces and symbols in the message into URL-safe text. Always use it for text you put in a link.

## Taking photos and choosing from the gallery

`flutter pub add image_picker`

On iPhone, add usage descriptions to `ios/Runner/Info.plist` (`NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`), or the app crashes when it asks. Android needs no extra setup for image_picker.

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

void main() => runApp(const MaterialApp(home: ReceiptScreen()));

class ReceiptScreen extends StatefulWidget {
  const ReceiptScreen({super.key});
  @override
  State<ReceiptScreen> createState() => _ReceiptScreenState();
}

class _ReceiptScreenState extends State<ReceiptScreen> {
  final picker = ImagePicker();
  File? photo;

  Future<void> pick(ImageSource source) async {
    final x = await picker.pickImage(
      source: source,
      maxWidth: 1600,          // shrink big photos: faster uploads, less data
      imageQuality: 80,        // JPEG quality 0-100
    );
    if (x == null) return;     // the user cancelled
    setState(() => photo = File(x.path));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Receipt photo')),
      body: Center(
        child: photo == null
            ? const Text('No photo yet')
            : ClipRRect(borderRadius: BorderRadius.circular(12), child: Image.file(photo!, height: 320)),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            Expanded(child: OutlinedButton.icon(onPressed: () => pick(ImageSource.gallery), icon: const Icon(Icons.photo), label: const Text('Gallery'))),
            const SizedBox(width: 12),
            Expanded(child: FilledButton.icon(onPressed: () => pick(ImageSource.camera), icon: const Icon(Icons.camera_alt), label: const Text('Camera'))),
          ]),
        ),
      ),
    );
  }
}
```

To upload the photo to your server, use `http.MultipartRequest` (or Firebase Storage's `putFile`).

## Location (GPS)

`flutter pub add geolocator`, then in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

```dart
import 'package:geolocator/geolocator.dart';

/// Returns the phone's position, or throws a message you can show the user.
Future<Position> currentPosition() async {
  if (!await Geolocator.isLocationServiceEnabled()) {
    throw 'Location is off. Turn it on in your phone settings.';
  }
  var permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();          // shows the system pop-up
    if (permission == LocationPermission.denied) throw 'We need your location to find the nearest branch.';
  }
  if (permission == LocationPermission.deniedForever) {
    throw 'Location permission is blocked. Allow it in Settings > Apps.';
  }
  return Geolocator.getCurrentPosition(locationSettings: const LocationSettings(accuracy: LocationAccuracy.high));
}

/// Nearest branch, using straight-line distance in metres.
String nearestBranch(Position me) {
  const branches = {'Nairobi CBD': (-1.2841, 36.8155), 'Thika': (-1.0333, 37.0693), 'Nakuru': (-0.3031, 36.0800)};
  final sorted = branches.entries.toList()
    ..sort((a, b) => Geolocator.distanceBetween(me.latitude, me.longitude, a.value.$1, a.value.$2)
        .compareTo(Geolocator.distanceBetween(me.latitude, me.longitude, b.value.$1, b.value.$2)));
  final d = Geolocator.distanceBetween(me.latitude, me.longitude, sorted.first.value.$1, sorted.first.value.$2);
  return '${sorted.first.key} (${(d / 1000).toStringAsFixed(1)} km away)';
}
```

(`(-1.2841, 36.8155)` is a Dart **record**: a quick pair of values, read with `.$1` and `.$2`.)

## Permissions: the golden rules

1. **Ask only when needed**, at the moment the user taps the feature ("Find nearest branch"), not all at once on first launch.
2. **Explain why first** with a short screen or dialog. People say yes more when they understand.
3. **Handle "no" gracefully**: the rest of the app must still work.
4. If blocked forever, offer a button to open settings (`Geolocator.openAppSettings()` or the **permission_handler** package's `openAppSettings()`).
5. Only request what you use: the Play Store rejects apps asking for SMS, call log or background location without a strong reason.

## Sharing

`flutter pub add share_plus`

```dart
import 'package:share_plus/share_plus.dart';

Future<void> shareInvoice() async {
  await Share.share('Invoice #1042 from Duka Thika: KSh 1,240. Pay via M-Pesa Till 123456.', subject: 'Your invoice');
  // Files: Share.shareXFiles([XFile('/path/to/invoice.pdf')]);
}
```

## Other handy plugins

- **mobile_scanner**: scan QR codes and barcodes (stock taking, event tickets).
- **flutter_local_notifications**: reminders that work offline ("Pay rent tomorrow").
- **firebase_messaging**: push notifications sent from your server.
- **local_auth**: unlock with fingerprint before showing balances.
- **connectivity_plus**: show an "offline" banner.

```quiz
Q: Which package opens phone calls, SMS, WhatsApp and web links?
A: url_launcher
Q: Which URI scheme starts a phone call?
A: tel | tel:
Q: Which package takes photos with the camera or picks from the gallery?
A: image_picker
Q: Which ImageSource opens the camera?
A: ImageSource.camera | camera
Q: Which package gets the GPS position?
A: geolocator
Q: Which package shares text or files to WhatsApp, email and other apps?
A: share_plus
Q: Which function makes message text safe to put in a link?
A: Uri.encodeComponent | encodeComponent
```
