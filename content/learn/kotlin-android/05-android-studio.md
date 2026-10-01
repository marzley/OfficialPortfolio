---
slug: android-studio-first-app
title: Android Studio and your first Android app
after: kotlin-coroutines
---
# Android Studio and your first Android app

Time to build a real Android app. You'll install **Android Studio**, create a project with **Jetpack Compose** (the modern way to build Android screens), understand the project structure and run it on your phone.

## Install Android Studio

1. Download from **developer.android.com/studio** (Windows, macOS or Linux; about 1 GB, plus SDK downloads).
2. Run the setup wizard with the **Standard** options. It installs the Android SDK, build tools and an emulator image.
3. Minimum practical computer: **8 GB RAM**, 20 GB free disk, SSD strongly recommended.

## Create a project

**File → New → New Project → Empty Activity** (the Compose template), then:

| Field | Example | Notes |
|---|---|---|
| Name | Duka | Shown under the icon |
| Package name | `ke.co.marzley.duka` | Your **application ID**: unique, can't change after publishing |
| Minimum SDK | API 24 (Android 7.0) | Covers almost all phones in use; lower = more phones, fewer features |
| Build configuration language | Kotlin DSL | `build.gradle.kts` files |

## The project structure

```
app/
├── src/main/
│   ├── java/ke/co/marzley/duka/
│   │   ├── MainActivity.kt        ← the entry screen
│   │   └── ui/theme/              ← colours, typography, theme
│   ├── res/                       ← resources: icons (mipmap), strings, images (drawable)
│   └── AndroidManifest.xml        ← app name, icon, permissions, activities
├── build.gradle.kts               ← app settings: versions, dependencies
gradle/libs.versions.toml           ← library versions in one place
```

- **Activity**: a screen container. Modern Compose apps usually have **one** activity and many composable screens.
- **AndroidManifest.xml**: declares the app's name, icon, permissions (like `INTERNET`) and the starting activity.
- **Gradle**: the build system. It downloads libraries and builds the APK/AAB. The first build takes a while.

## MainActivity explained

```kotlin
package ke.co.marzley.duka

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import ke.co.marzley.duka.ui.theme.DukaTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {                       // the UI is Compose from here on
            DukaTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Welcome(name = "Mama Mboga", modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun Welcome(name: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text("Karibu, $name!", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        Text("Fresh vegetables delivered daily.")
    }
}

@Preview(showBackground = true)
@Composable
fun WelcomePreview() {
    DukaTheme { Welcome("Mama Mboga") }
}
```

- `setContent { }` sets the screen's content using **composable** functions.
- `@Composable` marks functions that describe UI.
- `@Preview` shows the composable in Android Studio's design pane without running the app.
- `Scaffold` provides the standard screen layout (top bar, content, floating button), and `innerPadding` keeps content clear of system bars.

## Run the app

**On your phone (recommended):**

1. Settings → About phone → tap **Build number** 7 times.
2. Settings → System → Developer options → **USB debugging** on.
3. Connect with USB, allow debugging, select the phone in Android Studio's device menu, press **Run ▶**.

Or use **wireless debugging** (Android 11+) from Developer options and pair through Android Studio.

**On the emulator:** Device Manager → create a virtual device (a Pixel with a recent system image) → Run. Enable virtualisation in your BIOS if it's slow.

## Logcat and debugging

- **Logcat** shows your app's logs and crashes. Log with `Log.d("Duka", "Loaded ${items.size} products")`.
- When the app crashes, Logcat shows a red **stack trace**: find the first line that mentions **your** package and file.
- Click beside a line number to set a **breakpoint**, then use **Debug** instead of Run to pause and inspect variables.

## Dependencies

Libraries are added in `app/build.gradle.kts` (versions often live in `gradle/libs.versions.toml`):

```kotlin
dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))     // keeps Compose library versions compatible
    implementation(libs.androidx.material3)
    // added in later lessons: navigation-compose, lifecycle-viewmodel-compose, retrofit, room
}
```

After editing, click **Sync Now**.

```quiz
Q: What is the modern toolkit for building Android screens in Kotlin called?
A: Jetpack Compose | Compose
Q: Which file declares the app's permissions and starting activity?
A: AndroidManifest.xml | manifest | the manifest
Q: Which annotation marks a function that describes UI?
A: @Composable | Composable
Q: Which annotation shows a composable in Android Studio's design pane?
A: @Preview | Preview
Q: Which tool shows your app's logs and crash stack traces?
A: Logcat
Q: What is the build system that downloads libraries and builds the app?
A: Gradle
```
