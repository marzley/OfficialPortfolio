---
slug: publish-app
title: "Building and publishing your Flutter app: icons, versions, permissions, release builds, signing, Google Play, the App Store and updates"
after: KEEP
---
# Building and publishing your Flutter app: icons, versions, permissions, release builds, signing, Google Play, the App Store and updates

Building an app is only half the journey: real users need to install it from **Google Play** or the **Apple App Store**, trust it, and receive updates. Publishing involves preparing the app (name, icon, permissions, privacy), creating signed **release builds**, filling in store listings and policies, testing with real users, and then monitoring crashes and reviews. This unit walks through the whole process for Flutter apps, with practical tips for Kenyan developers and clients.

:::note What you will learn
- Pre-release checklist: app name, package ID, icon, splash screen, versioning
- Permissions and privacy (including Kenya's Data Protection Act)
- Testing on real devices and performance profiling
- Release builds: APK vs App Bundle; obfuscation
- Signing Android apps with an upload key
- Publishing on Google Play: account, listing, content rating, data safety, testing tracks
- Publishing on the Apple App Store: developer program, Xcode, TestFlight, review
- Other distribution: direct APK, internal apps, web builds
- Updates, crash reporting, analytics and reviews
- Pricing, in-app purchases and earning from apps
:::

## Pre-release checklist

| Item | How |
|---|---|
| **App name** | `android/app/src/main/AndroidManifest.xml` (`android:label`) and `ios/Runner/Info.plist` (`CFBundleDisplayName`) |
| **Package ID** | A unique reverse-domain ID like `ke.co.mamamboga.app` (set when creating: `flutter create --org ke.co.mamamboga`); it can't change after publishing |
| **App icon** | Use the `flutter_launcher_icons` package to generate all sizes from one 1024×1024 image |
| **Splash screen** | `flutter_native_splash` package |
| **Version** | In `pubspec.yaml`: `version: 1.0.0+1` (name 1.0.0, build number 1); increase the build number for every upload |
| **Remove debug items** | Test data, debug banners, console logs with sensitive data |
| **API endpoints** | Point to production servers; never embed secret keys (e.g. M-Pesa secrets) in the app |

```yaml
# pubspec.yaml (excerpt)
name: mama_mboga
version: 1.2.0+5
dev_dependencies:
  flutter_launcher_icons: ^0.14.0
flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/icon/icon.png"
```

```bash
dart run flutter_launcher_icons
```

(Package versions change; check pub.dev for the current ones.)

## Permissions and privacy

- Request only permissions you truly need (camera, location, contacts, notifications), and explain why in the app before the system prompt.
- Android: declare permissions in `AndroidManifest.xml`; iOS: add usage descriptions in `Info.plist` (e.g. `NSCameraUsageDescription`: "Take photos of products for your shop listing").
- Use packages like `permission_handler` to request at runtime and handle "denied".
- Publish a **privacy policy** (a web page) explaining what data you collect, why, how it's stored and shared, and how users can request deletion. Stores require it for most apps.
- Comply with Kenya's **Data Protection Act** when handling personal data (consent, security, purpose limitation), and support account deletion if users create accounts (both stores require an in-app or web way to delete accounts).

## Test before release

- Test on **real devices**, especially budget Android phones with limited RAM and older Android versions common among users.
- Test slow and offline networks (loading states, retries, cached data).
- Check different screen sizes, dark mode, large text settings, and both languages if you support Kiswahili.
- Run in **profile mode** (`flutter run --profile`) and use DevTools to find jank (dropped frames) and memory issues.
- Write tests: unit tests for logic, widget tests for UI (`flutter test`).

## Release builds for Android

| Format | Use |
|---|---|
| **App Bundle (.aab)** | Required for Google Play; Play generates optimised APKs per device |
| **APK (.apk)** | Direct installs (sideloading), internal distribution, testing |

```bash
flutter build appbundle --release       # build/app/outputs/bundle/release/app-release.aab
flutter build apk --release --split-per-abi   # smaller APKs per CPU type for direct sharing
flutter build appbundle --obfuscate --split-debug-info=build/symbols   # harder to reverse-engineer
```

### Signing

Android apps must be **signed**. Create an upload key once and keep it safe (store it in a password manager and backups):

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Reference it from `android/key.properties` (never commit this file or the keystore to Git) and configure `android/app/build.gradle` signing configs as described in Flutter's official deployment guide. With **Play App Signing**, Google manages the final app signing key, and your upload key can be reset if lost.

## Publishing on Google Play

1. **Create a developer account** at the Google Play Console (one-time registration fee; identity verification required; organisations may need a D-U-N-S number).
2. **Create the app**: name, default language, app or game, free or paid.
3. **Store listing**: short description (80 characters), full description, app icon (512×512), feature graphic (1024×500), phone screenshots (and tablet if supported), category, contact email.
4. **App content**: privacy policy URL, app access instructions (test login for reviewers), ads declaration, **content rating** questionnaire, target audience, **data safety** form (what data you collect and share), news/financial app declarations if applicable.
5. **Testing**: upload the .aab to an internal or closed testing track and invite testers. New personal developer accounts must run a closed test with a minimum number of testers for a set period before applying for production access (check the current requirement in Play Console).
6. **Production release**: create a release, add release notes, roll out (optionally staged: 10% → 50% → 100%).
7. **Review**: Google reviews the app (hours to several days); fix any policy issues reported.

Write a listing that sells: clear benefit in the first lines ("Order fresh vegetables in Nakuru and pay with M-Pesa"), screenshots with short captions, and keywords customers actually search for (app store optimisation).

## Publishing on the Apple App Store

1. Join the **Apple Developer Program** (annual fee; individual or organisation).
2. You need a **Mac with Xcode** to build and upload iOS apps (or a cloud CI service with macOS builders such as Codemagic or GitHub Actions macOS runners).
3. Set the bundle identifier, signing team and capabilities in Xcode (`ios/Runner.xcworkspace`).
4. Build: `flutter build ipa --release`, then upload with Xcode Organizer or the Transporter app.
5. Create the app in **App Store Connect**: description, keywords, screenshots for required device sizes, privacy "nutrition labels", age rating, pricing.
6. Test with **TestFlight** (internal and external testers).
7. Submit for **App Review**; Apple checks quality, privacy, payments and guidelines. Common rejections: crashes, broken links, incomplete features, missing account deletion, or unclear permission explanations.

## Other distribution options

| Option | When |
|---|---|
| **Direct APK** | Internal company apps, pilots, field staff; users must allow installing from unknown sources (security risk: share only from trusted sources) |
| **Managed Google Play / MDM** | Organisations distributing apps privately to employees |
| **Flutter web** | `flutter build web`: host on Firebase Hosting, Netlify or your server for a browser version |
| **Huawei AppGallery, Samsung Galaxy Store** | Extra reach for users on those devices |

## After launch: updates and monitoring

- **Crash reporting**: Firebase Crashlytics or Sentry to see crashes with stack traces.
- **Analytics**: Firebase Analytics (with a clear privacy policy and consent where needed) to understand feature use.
- **Reviews**: respond politely in Play Console/App Store Connect; fix reported problems quickly.
- **Updates**: increase the version/build number, write release notes, use staged rollouts; consider in-app update prompts.
- **Keep dependencies and SDK targets current**: stores require apps to target recent Android/iOS versions; update Flutter regularly.
- **Backend reliability**: most app problems users notice are server-side (slow APIs, failed payments): monitor your servers too.

## Earning from apps

| Model | Notes |
|---|---|
| **Client projects** | Build apps for businesses (shops, schools, SACCOs, clinics): the most common income for Kenyan developers |
| **Paid apps** | Hard in Kenya; works better for niche professional tools and global audiences |
| **In-app purchases/subscriptions** | Store billing rules apply for digital goods (stores take a commission) |
| **Ads** | Google AdMob; needs large user numbers; respect user experience |
| **Freemium / B2B SaaS** | Free basic app, paid features or business subscriptions |
| **Physical goods and services** | Selling products/services (food, deliveries) can use M-Pesa or card payments through your own server, following store rules for physical goods |

Store policies distinguish digital goods (which must generally use store billing) from physical goods and services (which can use other payment methods like M-Pesa). Read the current policies before designing payments.

:::think A developer loses the laptop holding the app's upload keystore just before an important update. Is the app lost forever?
If the app uses Play App Signing (the default for new apps), the upload key can be reset: request an upload key reset in Play Console and register a new upload certificate; Google still holds the app signing key. Without Play App Signing, losing the signing key means you couldn't update the app. Lesson: back up keystores and passwords securely and enable Play App Signing.
:::

## Summary

- Prepare the app: unique package ID, name, icon, splash, versioning (`1.0.0+1`), production endpoints and no secrets in the app.
- Request minimal permissions with explanations; publish a privacy policy; support account deletion; follow the Data Protection Act.
- Test on real (budget) devices and slow networks; profile performance; write tests.
- Build signed App Bundles for Google Play (Play App Signing, testing tracks, data safety, content rating) and IPAs for the App Store (Mac/Xcode or cloud CI, TestFlight, App Review).
- After launch, monitor crashes and reviews, ship updates with staged rollouts, and choose a sustainable earning model.

```quiz
Q: Which file format does Google Play require for new apps? (two words or extension)
A: App Bundle | aab | .aab | android app bundle
Q: Which command builds a release App Bundle in Flutter? (three words)
A: flutter build appbundle
Q: Where do you set the app version in a Flutter project?
A: pubspec.yaml | pubspec
Q: Which Apple tool lets testers try iOS apps before release?
A: TestFlight
Q: Which tool creates an Android keystore for signing?
A: keytool
Q: Should secret API keys like M-Pesa consumer secrets be put inside the app? (yes/no)
A: no
```
