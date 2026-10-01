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
```
