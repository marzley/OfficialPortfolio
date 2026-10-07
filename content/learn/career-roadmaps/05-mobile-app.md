---
slug: mobile-app-developer-roadmap
title: "Mobile app developer roadmap: Flutter, Kotlin or React Native to the Play Store"
after: cybersecurity-roadmap
---
# Mobile app developer roadmap: Flutter, Kotlin or React Native to the Play Store

Kenya is a mobile-first country: most people reach the internet through a smartphone, and M-Pesa trained everyone to transact on their phones. Banks, SACCOs, delivery services, schools, churches, hospitals, logistics firms and start-ups all want apps, and international companies hire mobile developers remotely.

This roadmap gets you from zero to a published app on the **Google Play Store**.

## Step 0: Choose your stack

| Stack | Language | Builds | Why choose it | Start here |
|---|---|---|---|---|
| **Flutter** | Dart | Android + iPhone + web from one codebase | Very popular in Kenya and Africa, fast to build good-looking apps, one codebase | [Dart & Flutter](./?track=dart-flutter&lesson=dart-basics), then [Flutter app development](./?track=flutter&lesson=setup-first-app) |
| **Native Android** | Kotlin | Android only | Best performance and full access to Android, required by some employers | [Android apps with Kotlin](./?track=kotlin-android&lesson=kotlin-basics) |
| **React Native (Expo)** | JavaScript | Android + iPhone | Reuse JavaScript/React skills from web development | [React Native apps](./?track=react-native&lesson=react-native-intro) |

Our suggestion: **Flutter** if you're starting fresh, **React Native** if you already know JavaScript and React, **Kotlin** if you want to specialise in Android or a job advert asks for it. Read [choosing your stack](./?track=app-dev-basics&lesson=choosing-your-stack) for a deeper comparison. Pick **one** and stick with it for at least six months.

:::tip Computer requirements
Android development needs a reasonably capable laptop: **8 GB RAM minimum** (16 GB is much more comfortable), an SSD, and around 20 GB free space for Android Studio and an emulator. If your laptop is weak, test on a real Android phone over USB instead of the emulator. Building for iPhone needs a Mac, but you can learn and publish on Android first.
:::

## Stage 1: App development fundamentals (1–2 weeks)

- [What app development is](./?track=app-dev-basics&lesson=what-is-app-development)
- [Planning an app](./?track=app-dev-basics&lesson=planning-an-app)
- [Mobile UI and UX](./?track=app-dev-basics&lesson=mobile-ui-ux)
- [Data, offline use and security](./?track=app-dev-basics&lesson=data-offline-security)

## Stage 2: The language (4–6 weeks)

**Flutter path (Dart):** [Dart basics](./?track=dart-flutter&lesson=dart-basics) → [functions and collections](./?track=dart-flutter&lesson=dart-functions-collections) → [classes and async](./?track=dart-flutter&lesson=dart-classes-async) → [generics, enums and records](./?track=dart-flutter&lesson=dart-generics-enums-records) → [async streams and errors](./?track=dart-flutter&lesson=dart-async-streams-errors).

**Kotlin path:** [Kotlin basics](./?track=kotlin-android&lesson=kotlin-basics) → [functions and collections](./?track=kotlin-android&lesson=kotlin-functions-collections) → [classes and null safety](./?track=kotlin-android&lesson=kotlin-classes-null-safety) → [coroutines](./?track=kotlin-android&lesson=kotlin-coroutines).

**React Native path:** the JavaScript stages of the [web developer roadmap](./?track=career-roadmaps&lesson=web-developer-roadmap), then [React](./?track=react&lesson=react-intro) → [state and events](./?track=react&lesson=react-state-events) → [effects and data](./?track=react&lesson=react-effects-data).

**Checkpoint:** you can write classes, lists/maps, functions and async code (`await` a delayed result) without looking up the syntax.

## Stage 3: Building screens (4–6 weeks)

**Flutter:** [setup and first app](./?track=flutter&lesson=setup-first-app), [widgets](./?track=flutter&lesson=widgets-stateless-stateful), [layout masterclass](./?track=flutter&lesson=layout-masterclass), [lists and grids](./?track=flutter&lesson=lists-grids), [themes and assets](./?track=flutter&lesson=themes-styling-assets), [navigation](./?track=flutter&lesson=navigation-routing), [forms](./?track=flutter&lesson=forms-validation).

**Kotlin:** [Android Studio first app](./?track=kotlin-android&lesson=android-studio-first-app), [Compose basics](./?track=kotlin-android&lesson=compose-basics), [state and lists](./?track=kotlin-android&lesson=compose-state-lists), [navigation and MVVM](./?track=kotlin-android&lesson=navigation-and-mvvm).

**React Native:** [components and styling](./?track=react-native&lesson=react-native-components-styling), [lists and navigation](./?track=react-native&lesson=react-native-lists-navigation).

**Checkpoint:** a 3-screen app (list → detail → form) that looks good on a small phone and a large phone.

## Stage 4: State, data and storage (4–6 weeks)

- **Flutter:** [state management](./?track=flutter&lesson=state-management), [HTTP, APIs and JSON](./?track=flutter&lesson=http-apis-json), [local storage and offline](./?track=flutter&lesson=local-storage-offline), [Firebase auth and Firestore](./?track=flutter&lesson=firebase-auth-firestore)
- **Kotlin:** [Retrofit and Room](./?track=kotlin-android&lesson=retrofit-and-room)
- **React Native:** [state and data](./?track=react-native&lesson=react-native-state-data)

Build: [Project: mobile expense tracker app](./?track=projects&lesson=mobile-expense-app).

**Checkpoint:** your app saves data that survives closing it, loads data from an API with loading and error states, and has a login.

## Stage 5: The back-end your app talks to (3–4 weeks)

Most real apps need a server: [how backends work](./?track=apis-backend&lesson=how-backends-work), [designing REST APIs](./?track=apis-backend&lesson=designing-rest-apis), [auth and tokens](./?track=apis-backend&lesson=auth-passwords-tokens), [Firebase, Supabase and deploying](./?track=apis-backend&lesson=baas-and-deploying). Build [Project: REST API](./?track=projects&lesson=rest-api) and connect your app to it.

## Stage 6: M-Pesa and device features (2–4 weeks)

- [M-Pesa in apps](./?track=app-dev-basics&lesson=mpesa-in-apps) and the [Daraja API](./?track=apis-backend&lesson=mpesa-daraja-api): the payment request always goes through **your server**, never straight from the app (the app must never contain your Daraja secrets).
- [Device features](./?track=flutter&lesson=device-features): camera, location, sharing, notifications.
- [Animations](./?track=flutter&lesson=animations) for polish.

## Stage 7: Testing and publishing (2–3 weeks)

- [Testing and release (Flutter)](./?track=flutter&lesson=testing-release), [Android testing and release](./?track=kotlin-android&lesson=android-testing-release), [publish an app](./?track=dart-flutter&lesson=publish-app), [testing and publishing](./?track=app-dev-basics&lesson=testing-and-publishing), [React Native device features and publishing](./?track=react-native&lesson=react-native-device-and-publish)
- A Google Play developer account has a one-time registration fee (check the current amount on Google's site) and new personal accounts must run a closed test with testers before going to production. Plan for this.
- Write a privacy policy; the Play Store requires one if your app collects personal data.

## Stage 8: Portfolio and work

Aim for:
1. One **published app** on the Play Store (even a simple one).
2. One **app with a back-end and login** (source on GitHub, with screenshots and a demo video in the README).
3. One **app with M-Pesa (sandbox)** or another Kenyan-relevant feature.
4. The [Flutter Duka project](./?track=flutter&lesson=project-duka-app) as extra proof.

Then read [app developer career](./?track=app-dev-basics&lesson=app-developer-career) and [Show your projects](./?track=projects&lesson=showcase-your-projects). Look for junior mobile roles, internships at start-ups and agencies, and freelance work building simple business apps.

## Summary

- Choose one stack: Flutter (recommended start), Kotlin or React Native.
- Fundamentals → language → screens → state and data → back-end → M-Pesa and device features → testing and publishing → portfolio.
- Keep secrets on the server; publish at least one app to the Play Store.

```quiz
Q: Which language does Flutter use?
A: Dart
Q: Which language is used for modern native Android apps?
A: Kotlin
Q: Where must your Daraja API secrets live: in the app or on your server?
A: server | your server | on the server | the server
Q: Which Google store do Android apps get published to? (two words)
A: Play Store | Google Play | Google Play Store
```
