---
slug: android-next-steps
title: "Java for Android and next steps: Android Studio, activities, layouts, events, Java vs Kotlin, Spring Boot and your learning path"
after: KEEP
---
# Java for Android and next steps: Android Studio, activities, layouts, events, Java vs Kotlin, Spring Boot and your learning path

With Java fundamentals and OOP, you can move into the areas where Java is used professionally: **Android apps**, **back-end web services with Spring Boot**, and enterprise systems. This unit shows how Java fits into Android development (and how it relates to Kotlin, Google's preferred Android language), walks through the structure of a simple Android app, introduces Spring Boot for building APIs, and lays out a realistic learning path and portfolio projects to get hired.

:::note What you will learn
- Android development overview and tools
- Java vs Kotlin for Android in 2026
- Android Studio project structure: Gradle, manifest, activities, layouts, resources
- A simple Android screen in Java: layout XML and an Activity
- Handling clicks, input and showing messages
- Lists (RecyclerView) and moving between screens (Intents)
- Data: SharedPreferences, Room database, calling APIs
- Publishing to Google Play (overview)
- Java on the back end: Spring Boot REST APIs
- Testing, build tools (Maven/Gradle) and Git
- A learning path and portfolio projects
:::

## Android development overview

| Item | Detail |
|---|---|
| **IDE** | Android Studio (free, from Google) |
| **Languages** | Kotlin (recommended by Google), Java (fully supported, large existing codebases) |
| **UI toolkits** | Jetpack Compose (modern, Kotlin-first) and XML layouts with Views (traditional, works with Java) |
| **Build system** | Gradle |
| **Testing** | Emulator in Android Studio or a real phone via USB debugging |
| **Distribution** | Google Play Store (developer account with a one-time fee), or APK sideloading for internal apps |

## Java or Kotlin?

| Java | Kotlin |
|---|---|
| Huge existing Android codebases and tutorials | Google's preferred language since 2019; newer docs and samples are Kotlin-first |
| Verbose but explicit | Concise, null-safety built in, coroutines for async code |
| Works with XML Views | Required for Jetpack Compose UI |
| Skills transfer to Spring/enterprise back ends | Also used for back ends (Ktor, Spring) |

They **interoperate**: Java and Kotlin classes can live in the same project. Learning Java first makes Kotlin easy (see the Kotlin Android subject). For new Android apps, most teams choose Kotlin; for maintaining existing apps and back-end jobs, Java is valuable.

## Android project structure

```
app/
├── src/main/
│   ├── AndroidManifest.xml          app name, permissions, activities
│   ├── java/ke/co/example/fees/     Java (or Kotlin) source code
│   │   └── MainActivity.java
│   └── res/
│       ├── layout/activity_main.xml  screen layouts
│       ├── values/strings.xml        text (supports translations)
│       ├── values/colors.xml, themes.xml
│       └── drawable/, mipmap/        images and app icons
└── build.gradle(.kts)               dependencies and settings
```

- An **Activity** is a screen with its lifecycle (onCreate, onStart, onResume, onPause, onStop, onDestroy).
- **Resources** keep text, colours and images out of code (e.g. Kiswahili translations in `values-sw/strings.xml`).
- The **manifest** declares activities and permissions (e.g. INTERNET).

## A simple screen: fees calculator

`res/layout/activity_main.xml`:

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:padding="24dp"
    android:layout_width="match_parent" android:layout_height="match_parent">

    <EditText android:id="@+id/inputFee" android:hint="Term fee (KSh)"
        android:inputType="numberDecimal"
        android:layout_width="match_parent" android:layout_height="wrap_content"/>

    <EditText android:id="@+id/inputPaid" android:hint="Amount paid (KSh)"
        android:inputType="numberDecimal"
        android:layout_width="match_parent" android:layout_height="wrap_content"/>

    <Button android:id="@+id/btnCalc" android:text="Calculate balance"
        android:layout_width="match_parent" android:layout_height="wrap_content"/>

    <TextView android:id="@+id/txtResult" android:textSize="20sp"
        android:layout_marginTop="16dp"
        android:layout_width="match_parent" android:layout_height="wrap_content"/>
</LinearLayout>
```

`MainActivity.java`:

```java
package ke.co.example.fees;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        EditText inputFee = findViewById(R.id.inputFee);
        EditText inputPaid = findViewById(R.id.inputPaid);
        TextView result = findViewById(R.id.txtResult);
        Button btn = findViewById(R.id.btnCalc);

        btn.setOnClickListener(v -> {
            try {
                double fee = Double.parseDouble(inputFee.getText().toString());
                double paid = Double.parseDouble(inputPaid.getText().toString());
                double balance = fee - paid;
                result.setText(balance <= 0 ? "Fees cleared ✔" : String.format("Balance: KSh %,.2f", balance));
            } catch (NumberFormatException e) {
                Toast.makeText(this, "Please enter valid amounts", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

What's happening: the layout defines widgets; `findViewById` connects them to Java; a click listener (a lambda) reads input, calculates, validates and updates the screen.

The same calculation logic can be tested as plain Java:

```try-java
class Main {
    static String feeStatus(double fee, double paid) {
        double balance = fee - paid;
        return balance <= 0 ? "Fees cleared" : String.format("Balance: KSh %,.2f", balance);
    }
    public static void main(String[] args) {
        System.out.println(feeStatus(25000, 25000));
        System.out.println(feeStatus(25000, 18750.5));
    }
}
```

Keeping business logic in plain Java classes makes it easy to test and reuse.

## Lists and multiple screens

- **RecyclerView** efficiently displays long lists (students, products, transactions) using an **Adapter** that binds data to row layouts.
- **Intents** open other screens and pass data:

```java
Intent intent = new Intent(this, StudentDetailActivity.class);
intent.putExtra("admissionNo", "ADM001");
startActivity(intent);
```

- Intents also open other apps: dialer (`tel:`), WhatsApp links, maps, the camera.

## Data and networking

| Need | Tool |
|---|---|
| Small settings (dark mode, last user) | SharedPreferences / DataStore |
| Local database | **Room** (SQLite with type-safe queries) |
| Calling web APIs | Retrofit or OkHttp, with JSON parsing (Gson/Moshi) |
| Background work | WorkManager; network calls off the main thread |
| Cloud backend | Firebase (Auth, Firestore), or your own API (Spring Boot, PHP, Node) |

Never put secret API keys (e.g. M-Pesa consumer secrets) inside the app: anyone can extract them from the APK. The app should call **your server**, which talks to Daraja securely (see the M-Pesa lesson).

## Publishing (overview)

1. Create a signed release build (Android App Bundle, `.aab`) in Android Studio.
2. Register a Google Play developer account.
3. Prepare the listing: name, description, screenshots, icon, privacy policy URL, content rating, data safety form.
4. Test with internal/closed testing tracks (new personal developer accounts may need a period of testing with testers before production).
5. Release to production and monitor crashes and reviews.

The Flutter, Kotlin and app development subjects cover publishing in more depth.

## Java on the back end: Spring Boot

**Spring Boot** is the most popular Java framework for web APIs and enterprise apps. A minimal REST endpoint:

```java
@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentRepository repo;
    public StudentController(StudentRepository repo) { this.repo = repo; }

    @GetMapping("/{admissionNo}")
    public ResponseEntity<Student> get(@PathVariable String admissionNo) {
        return repo.findById(admissionNo)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
}
```

Generate projects at **start.spring.io** (choose Spring Web, Spring Data JPA, a database driver), and learn: dependency injection, REST controllers, JPA/Hibernate with MySQL/PostgreSQL, validation, Spring Security, testing with JUnit. Banks, telcos and large companies in Kenya and abroad hire Spring developers.

## Professional tools

| Tool | Purpose |
|---|---|
| **Maven / Gradle** | Build tools and dependency management |
| **JUnit 5, Mockito** | Unit testing |
| **Git and GitHub** | Version control and portfolio |
| **IntelliJ IDEA** | Refactoring, debugging, code analysis |
| **Docker** | Packaging back-end services |

## Learning path

| Stage | Focus |
|---|---|
| 1. Core Java | This subject: syntax, OOP, collections, exceptions |
| 2. Practice | 50+ small problems (HackerRank, LeetCode easy, Exercism Java track) |
| 3. Choose a direction | **Android** (learn Kotlin next, then Jetpack Compose) or **back end** (Spring Boot + SQL) |
| 4. Projects | Build and publish 2–3 portfolio projects |
| 5. Certifications (optional) | Oracle Java SE certifications; Google's Android courses |

## Portfolio project ideas

- **School fees tracker** app: students, payments, balances (Room database), SMS reminders via your API.
- **Chama/SACCO contributions** API in Spring Boot with authentication and reports.
- **Inventory app** for a small shop with barcode scanning (camera) and low-stock alerts.
- **Bus booking** demo: routes, seats, booking, M-Pesa payment via your server (sandbox).

Publish code on GitHub with READMEs and screenshots (see the Git subject).

:::think A developer puts the M-Pesa consumer key and secret directly in their Android app's Java code to call Daraja from the phone. What's the risk and the correct design?
APKs can be decompiled, so anyone could extract the secrets and misuse the merchant's API access. The correct design: the app sends the order to your own server (authenticated), the server holds the credentials and calls Daraja for the STK push, receives the callback, and the app asks your server for the payment status.
:::

## Summary

- Android apps are built in Android Studio with Kotlin (preferred for new apps) or Java (huge existing codebases); they interoperate.
- Projects have a manifest, Activities (screens), XML layouts/resources and Gradle builds; Java code connects widgets and handles events.
- Use RecyclerView for lists, Intents for screens, Room/SharedPreferences for data, Retrofit for APIs, and keep secrets on your server.
- Publish signed app bundles on Google Play after testing; Spring Boot is the leading Java back-end framework.
- Follow a path: core Java → practice → Android (with Kotlin) or Spring back end → portfolio projects on GitHub.

```quiz
Q: Which IDE is used for Android development?
A: Android Studio
Q: Which language does Google recommend for new Android apps?
A: Kotlin
Q: What is a single screen in a traditional Android app called?
A: Activity | an activity
Q: Which component displays long scrollable lists efficiently?
A: RecyclerView
Q: Which object opens another screen or app in Android?
A: Intent | an intent
Q: What is the most popular Java framework for building web APIs? (two words)
A: Spring Boot | spring
```
