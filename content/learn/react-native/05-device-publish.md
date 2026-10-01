---
slug: react-native-device-and-publish
title: Phone features, then building and publishing with EAS
after: react-native-state-data
---
# Phone features, then building and publishing with EAS

## Phone features with Expo libraries

Install with `npx expo install <package>` (it picks versions compatible with your Expo SDK).

| Feature | Package |
|---|---|
| Camera and gallery | `expo-image-picker`, `expo-camera` |
| Location | `expo-location` |
| Calls, SMS, WhatsApp, maps, websites | `Linking` (built in) |
| Push notifications | `expo-notifications` |
| Sharing files and text | `expo-sharing`, `Share` (built in) |
| QR and barcode scanning | `expo-camera` |
| Fingerprint/face unlock | `expo-local-authentication` |

### Calls, WhatsApp and maps

```jsx
import { Linking, Alert, Pressable, Text, View } from "react-native";

const PHONE = "254745789590";

async function open(url) {
  try {
    await Linking.openURL(url);
  } catch (e) {
    Alert.alert("Can't open", "No app on this phone can open that.");
  }
}

export default function Contact() {
  const msg = encodeURIComponent("Hello, I'd like to order 2 packets of unga.");
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Pressable onPress={() => open(`tel:+${PHONE}`)}><Text>📞 Call</Text></Pressable>
      <Pressable onPress={() => open(`https://wa.me/${PHONE}?text=${msg}`)}><Text>💬 WhatsApp</Text></Pressable>
      <Pressable onPress={() => open(`sms:+${PHONE}?body=${msg}`)}><Text>✉️ SMS</Text></Pressable>
      <Pressable onPress={() => open("https://www.google.com/maps/search/?api=1&query=Thika+Town")}><Text>🗺️ Directions</Text></Pressable>
    </View>
  );
}
```

### Taking a photo

```jsx
import { useState } from "react";
import { View, Image, Pressable, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ReceiptPhoto() {
  const [uri, setUri] = useState(null);

  async function takePhoto() {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return alert("Camera permission is needed to photograph the receipt.");
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });   // smaller files, faster uploads
    if (!result.canceled) setUri(result.assets[0].uri);
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Pressable onPress={takePhoto}><Text style={{ fontWeight: "700" }}>Take receipt photo</Text></Pressable>
      {uri && <Image source={{ uri }} style={{ width: "100%", height: 320, borderRadius: 12 }} />}
    </View>
  );
}
```

### Location

```js
import * as Location from "expo-location";

export async function currentPosition() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("We need your location to find the nearest branch.");
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { lat: pos.coords.latitude, lng: pos.coords.longitude };
}
```

**Permission rules:** ask only when the user taps the feature, explain why first, and keep the app usable if they say no.

## Configuring the app (app.json)

```json
{
  "expo": {
    "name": "Duka",
    "slug": "duka",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png", "backgroundColor": "#0b1b35" },
    "android": {
      "package": "ke.co.marzley.duka",
      "versionCode": 1,
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#0b1b35" }
    },
    "ios": { "bundleIdentifier": "ke.co.marzley.duka" }
  }
}
```

The Android `package` is your permanent application ID on Google Play.

## Building with EAS (Expo Application Services)

```bash
npm install -g eas-cli
eas login                      # free Expo account
eas build:configure
eas build -p android --profile preview      # an installable APK to share for testing
eas build -p android --profile production   # an AAB for Google Play
```

EAS builds in the cloud, so you **don't need Android Studio**, and it can build **iPhone** apps without a Mac (you still need an Apple Developer account to publish). EAS manages your signing keys; download a backup of the Android keystore.

**Over-the-air updates:** `eas update` pushes JavaScript and asset changes to installed apps without a new store release (native changes still need a new build). Follow the store rules: don't change what the app fundamentally does through updates.

## Publishing

- **Google Play**: create the app in Play Console (US$25 once), complete the store listing and app content, run closed testing (new personal accounts need **12 testers for 14 days**), then upload the AAB (or use `eas submit -p android`). Full steps: **App development fundamentals → Testing and publishing**.
- **App Store**: Apple Developer Program (US$99 per year), App Store Connect listing, `eas submit -p ios`.

## A project to build

**"Mtaa Deliveries"**: a small delivery app.

1. Tabs: New request, My requests, Account.
2. New request form: pickup, drop-off, phone, item description, photo.
3. Save requests locally (SQLite) and send them to an API.
4. "Call rider" and "WhatsApp rider" buttons with `Linking`.
5. Build an APK with EAS and test it on two phones; then publish.

```quiz
Q: Which command installs an Expo package with compatible versions?
A: npx expo install
Q: Which built-in module opens tel:, sms: and https: links?
A: Linking
Q: Which Expo library takes photos or picks images from the gallery?
A: expo-image-picker | ImagePicker
Q: Which service builds React Native apps in the cloud?
A: EAS | Expo Application Services | EAS Build
Q: Which EAS command pushes JavaScript updates without a new store release?
A: eas update
Q: In app.json, which Android field is the permanent application ID?
A: package | android.package
```
