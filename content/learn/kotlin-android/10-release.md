---
slug: android-testing-release
title: Testing, signing and releasing your Android app
after: retrofit-and-room
---
# Testing, signing and releasing your Android app

Your app works on your phone. Now make it reliable on everyone's phone and publish it on Google Play.

## Unit tests (plain Kotlin)

Logic in ViewModels, repositories and helper functions can be tested on your computer in milliseconds. Tests live in `app/src/test/`.

```kotlin
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

fun normalisePhone(input: String): String? {
    val d = input.filter { it.isDigit() }
    return when {
        Regex("^0[17]\\d{8}$").matches(d) -> "254" + d.drop(1)
        Regex("^254[17]\\d{8}$").matches(d) -> d
        else -> null
    }
}

class PhoneTest {
    @Test fun acceptsLocalFormat() = assertEquals("254712345678", normalisePhone("0712 345 678"))
    @Test fun acceptsInternational() = assertEquals("254112345678", normalisePhone("+254 112 345 678"))
    @Test fun rejectsShortNumbers() = assertNull(normalisePhone("12345"))
}
```

Run with the green ▶ beside the test, or `./gradlew test`.

To test ViewModels with coroutines, use `kotlinx-coroutines-test` (`runTest`) and a fake repository that returns fixed data.

## Compose UI tests

UI tests in `app/src/androidTest/` drive the real screens:

```kotlin
class CounterScreenTest {
    @get:Rule val compose = createComposeRule()

    @Test fun tappingAddIncreasesQuantity() {
        compose.setContent { QuantityPicker(item = "Unga") }
        compose.onNodeWithText("1").assertExists()
        compose.onNodeWithContentDescription("More").performClick()
        compose.onNodeWithText("2").assertExists()
    }
}
```

## Before release: the checklist

- [ ] Test on a cheap, older phone (2 GB RAM, Android 8 to 10) and a small screen.
- [ ] Turn on airplane mode mid-request: the app must show a friendly message, not crash.
- [ ] Rotate the phone on every screen: no lost input (ViewModel / `rememberSaveable`).
- [ ] Dark mode and large font size.
- [ ] Remove unused permissions and debug logs of personal data.
- [ ] Crash reporting added (Firebase Crashlytics).
- [ ] Privacy policy ready (required on Google Play).

## Shrinking and obfuscation

In `app/build.gradle.kts`, release builds should enable **R8**:

```kotlin
android {
    buildTypes {
        release {
            isMinifyEnabled = true          // removes unused code, shortens names
            isShrinkResources = true        // removes unused resources
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

This makes the app smaller and harder to reverse-engineer. Test the release build: some libraries need keep rules.

## Versioning

```kotlin
defaultConfig {
    applicationId = "ke.co.marzley.duka"   // never changes after publishing
    versionCode = 3                        // must increase with every upload
    versionName = "1.1.0"                  // what users see
    minSdk = 24
    targetSdk = 35                         // keep up with Google Play's yearly requirement
}
```

## Signing and building the bundle

1. **Build → Generate Signed App Bundle / APK → Android App Bundle**.
2. Create a new **upload keystore** (`.jks`), with strong passwords. **Back it up** and never commit it to Git.
3. Choose the **release** build and finish. The `.aab` file appears under `app/release/`.
4. In Play Console, use **Play App Signing** (Google manages the final signing key; your upload key can be reset if lost).

## Publishing on Google Play (summary)

1. Play Console account (US$25 once).
2. Create the app, fill **store listing** (descriptions, icon, screenshots, feature graphic).
3. **App content**: privacy policy, data safety, content rating, target audience, ads.
4. **Testing**: internal and closed testing. New personal accounts need a **closed test with at least 12 testers for 14 days** before production (check the current rule).
5. **Production release** with release notes; consider a **staged rollout**.

Full details: **App development fundamentals → Testing and publishing**.

## Project ideas to build next

1. **Duka stock and sales app** with Room, offline-first, and a daily report.
2. **Chama contributions app**: members, contributions, loans, M-Pesa payment through your backend.
3. **School notices app**: news feed from an API, push notifications with Firebase Cloud Messaging.
4. **Field data collection**: forms with GPS location and photos, synced with WorkManager.

Publish one, put the code on GitHub with a README and demo video, and you have a strong Android portfolio.

## From working app to published product

Getting an app onto Google Play is where many developers stall. Release work includes testing on real devices, fixing crashes, making the app small and fast, protecting secrets, preparing the store listing, meeting Google Play's policies and planning updates. Doing this well is what turns a project into a product that clients pay for and users trust, and it's a skill that freelance and agency clients value highly.

## Testing strategy: the testing pyramid

| Level | What it tests | Tools | How many |
|---|---|---|---|
| Unit tests | Pure Kotlin logic (validation, calculations, ViewModels with fakes) | JUnit, kotlinx-coroutines-test, MockK | Many (fast) |
| Integration tests | Database (Room), repositories, API parsing | Room in-memory DB, MockWebServer | Some |
| UI tests | Screens and user flows | Compose testing, Espresso | A few key flows |
| Manual testing | Real devices, real networks | Budget phones, slow networks | Before every release |

```kotlin
class PhoneValidatorTest {
    @Test fun acceptsSafaricomFormat() = assertEquals("254712345678", normalisePhone("0712 345 678"))
    @Test fun acceptsNew01Prefix() = assertEquals("254112345678", normalisePhone("0112345678"))
    @Test fun rejectsShortNumbers() = assertNull(normalisePhone("07123"))
}
```

Test the logic most likely to cause real-world problems: money calculations, validation, offline behaviour and payment state handling.

## Testing on real conditions

- **Budget devices**: test on an inexpensive Android phone with 2–3 GB RAM, not only a flagship or emulator.
- **Android versions**: test the oldest version you support (your `minSdk`) and the newest.
- **Networks**: slow 3G/4G, switching between Wi-Fi and data, airplane mode. Use the emulator's network throttling.
- **Screen sizes and settings**: small phones, tablets, large font sizes, dark mode, Kiswahili if supported.
- **Interruptions**: incoming calls, rotating the phone, the app being killed in the background.
- **Battery and data**: check that the app doesn't drain the battery or use data in the background unnecessarily.

## Firebase Crashlytics and pre-launch reports

- **Crashlytics** reports crashes from users' phones with stack traces, device models and Android versions.
- **Google Play Console's pre-launch report** runs your app on a range of real devices and reports crashes, accessibility and security issues.
- **Android vitals** in Play Console shows crash rates, ANRs (App Not Responding) and excessive wake-ups; poor vitals can reduce your app's visibility on Play.

## Keeping secrets out of the app

Anything inside an APK/AAB can be extracted. Never put these in the app:

- M-Pesa (Daraja) consumer secrets or passkeys, payment API secret keys
- Database passwords, admin API keys, SMS gateway credentials

Instead, the app calls **your server**, which holds the secrets and talks to payment and SMS providers. Public keys meant for clients (e.g. a maps API key restricted to your app's package name and signing certificate) are acceptable when properly restricted.

## R8 shrinking in practice

```kotlin
// app/build.gradle.kts
android {
    buildTypes {
        release {
            isMinifyEnabled = true          // shrink and obfuscate code
            isShrinkResources = true        // remove unused resources
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

If a library uses reflection (e.g. some JSON parsers), add keep rules for your data classes:

```
-keep class com.example.shop.data.model.** { *; }
```

Always test the **release build** on a device before uploading: shrinking problems only appear in release builds. Upload the mapping file (Play Console does this with the bundle) so crash reports show readable stack traces.

## App size matters in Kenya

Users on limited data bundles and phones with little storage avoid large apps.

- Ship an **Android App Bundle** (Play generates optimised APKs per device).
- Use WebP/vector images, remove unused libraries and resources.
- Download large content on demand (e.g. images loaded from the network with caching).
- Check size in Play Console's app size report.

## Versioning and release tracks

```kotlin
defaultConfig {
    versionCode = 12          // integer, must increase with every upload
    versionName = "1.3.0"     // shown to users
}
```

| Track | Who gets it | Use |
|---|---|---|
| Internal testing | Up to a small list of testers, available within minutes | Quick checks by your team |
| Closed testing | Invited testers / groups | Client and beta-user testing |
| Open testing | Anyone who opts in from the listing | Public beta |
| Production | Everyone | Use **staged rollouts** (e.g. 10% → 50% → 100%) |

New personal developer accounts must complete a closed test with a minimum number of testers over a set period before getting production access; check Play Console for the current requirement.

## Store listing that converts

| Element | Tips |
|---|---|
| App name and short description | Clear benefit and keywords: "Order fresh groceries in Nakuru, pay with M-Pesa" |
| Screenshots | Real screens with short captions showing key features; phone and tablet if supported |
| Feature graphic | Clean branding, little text |
| Full description | Features, who it's for, how it works, support contact |
| Privacy policy | Required; accurate about data collected |
| Data safety form | Must match what the app and its SDKs actually collect and share |

Respond to reviews politely and fix reported problems quickly; ratings strongly affect downloads.

## Policies to watch

- Request only necessary permissions, with clear explanations (SMS and call log permissions are heavily restricted).
- Provide account deletion (in-app and via a web link) if users can create accounts.
- Target a recent Android API level as required by Play's target API requirements.
- Follow rules for financial, lending and health apps, which have extra declarations and requirements (lending apps in particular face strict policies and local licensing requirements).

## After launch

1. Monitor Crashlytics and Android vitals daily for the first week.
2. Ship fixes quickly using staged rollouts; halt a rollout if crash rates jump.
3. Use in-app update prompts for critical fixes.
4. Track key events (sign-ups, orders, payments) with analytics that respect privacy and consent.
5. Plan regular updates: dependencies, security fixes and new Android versions.

## Practice

1. Write unit tests for a validation function and a price calculation.
2. Enable R8 for release, build a signed bundle and test the release build on a real phone.
3. Move any secret keys out of your app into a small server endpoint.
4. Prepare a store listing: short description, full description, 4 screenshots and a privacy policy.
5. Upload to the internal testing track and invite two testers.

:::think An app works perfectly in debug mode, but the release build crashes when parsing JSON from the server. What's the likely cause, and how do you fix it?
R8 shrinking/obfuscation renamed or removed data class fields that the JSON library accesses by reflection, so parsing fails in the minified release build. Add keep rules for the model classes (or use a library with code generation such as kotlinx.serialization or Moshi codegen), and always test the release build before uploading.
:::

```quiz
Q: Which folder holds plain Kotlin unit tests in an Android project?
A: src/test | app/src/test | test
Q: Which Gradle command runs unit tests?
A: ./gradlew test | gradlew test
Q: Which tool shrinks and obfuscates release builds?
A: R8
Q: Which number must increase with every upload to Google Play?
A: versionCode
Q: What file holds your upload signing key?
A: keystore | .jks | jks | a keystore
Q: Which service lets Google manage the final signing key?
A: Play App Signing
Q: Which Firebase tool reports crashes from users' devices?
A: Crashlytics | Firebase Crashlytics
Q: Which Play Console feature releases an update to a percentage of users first? (two words)
A: staged rollout | staged rollouts
Q: Which number must increase with every upload to Google Play?
A: versionCode | version code
Q: Should M-Pesa consumer secrets be stored inside the Android app? (yes or no)
A: no
```
