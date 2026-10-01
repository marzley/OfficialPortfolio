---
slug: what-is-app-development
title: What is app development? Types of apps and how they work
after: START
---
# What is app development? Types of apps and how they work

**App development** is designing, building, testing and publishing software that people use on phones, tablets and computers: M-Pesa, WhatsApp, Bolt, banking apps, school portals, shop stock apps. In Kenya, where most people reach the internet through an Android phone, apps are often how businesses meet their customers.

This subject is the **map** for the whole App development area of the hub. It explains the choices and concepts; the **Flutter**, **Android with Kotlin**, **React Native**, **React** and **APIs & backends** subjects teach the building itself.

## The four kinds of apps

| Type | Built with | Runs | Strengths | Weak spots |
|---|---|---|---|---|
| **Native app** | Kotlin (Android), Swift (iPhone) | Installed from the store | Best performance and full access to phone features | Two separate apps for Android and iPhone |
| **Cross-platform app** | Flutter (Dart), React Native (JavaScript) | Installed from the store | One codebase for Android and iPhone, near-native quality | Some advanced features need native code |
| **Web app** | HTML, CSS, JavaScript (often React) | In the browser | No install, works on every device, instant updates | Fewer phone features, needs a browser |
| **Progressive web app (PWA)** | A web app plus a manifest and service worker | Browser, but installable to the home screen and can work offline | Cheap, one version for all, no store approval | Limited on iPhone, no Play Store presence by default |

**What most Kenyan businesses should start with:** a fast **web app or PWA** (cheapest, reaches everyone), then a **Flutter** or **native Android** app when they need notifications, offline work or phone features. See the blog post [Flutter vs React Native vs native Android](../flutter-vs-react-native-kenya).

## How an app works: the four layers

```
┌──────────────────────────┐
│ 1. User interface (UI)    │  screens, buttons, forms, lists
├──────────────────────────┤
│ 2. App logic              │  what happens when you tap: calculations, rules, navigation
├──────────────────────────┤
│ 3. Local data             │  settings, cached lists, offline records on the phone
└────────────┬─────────────┘
             │ internet (HTTPS + JSON)
┌────────────▼─────────────┐
│ 4. Backend (server)       │  accounts, database, payments (M-Pesa), notifications, admin panel
└──────────────────────────┘
```

Most beginners only think about layer 1. Real apps spend as much effort on layers 2 to 4: the **backend** and the **admin dashboard** are often half the project.

## Who builds an app (roles)

| Role | Does |
|---|---|
| Product owner / client | Decides what the app must achieve, sets priorities |
| UI/UX designer | Screens, user journeys, prototypes (Figma) |
| Mobile developer | Builds the app (Flutter, Kotlin, React Native) |
| Backend developer | APIs, database, payments, security |
| Tester (QA) | Finds bugs on many devices |
| DevOps | Hosting, deployment, monitoring |

In small Kenyan projects, **one developer often plays all these roles**. That's why the skills in this subject matter.

## The life of an app project

1. **Idea and research**: what problem, for whom, and what exists already?
2. **Plan**: features, screens, data, budget (lesson 3).
3. **Design**: wireframes and a clickable prototype (lesson 4).
4. **Build**: app + backend, in small steps you can test.
5. **Test**: on real, cheap phones and bad networks (lesson 7).
6. **Publish**: Google Play and the App Store (lesson 8).
7. **Maintain**: fix bugs, update for new Android versions, add features. Apps are never "finished".

## Words you'll hear

| Word | Meaning |
|---|---|
| **APK / AAB** | Android app files: APK to install directly, AAB to upload to Google Play |
| **SDK** | Software Development Kit: tools for building for a platform (Android SDK, Flutter SDK) |
| **IDE** | The program you code in (Android Studio, VS Code) |
| **API** | How the app talks to a server or another service |
| **Backend** | Server, database and logic behind the app |
| **Emulator** | A pretend phone on your computer for testing |
| **Push notification** | A message from the server that appears on the phone |
| **MVP** | Minimum viable product: the smallest version that solves the main problem |

## Which path should you learn?

| If you… | Start with |
|---|---|
| Want one skill for Android and iPhone | **Flutter** (Dart) |
| Already know or want JavaScript (also for websites) | **React**, then **React Native** |
| Want to specialise in Android and the deepest phone features | **Android with Kotlin** |
| Want everything to work in the browser first | HTML/CSS/JavaScript → **PWA** |

Whatever you choose, learn **APIs & backends**: every serious app needs a server.

```quiz
Q: Which type of app runs in the browser but can be installed to the home screen and work offline?
A: PWA | progressive web app
Q: Which framework builds Android and iPhone apps from one Dart codebase?
A: Flutter
Q: Which file type do you upload to Google Play?
A: AAB | .aab | app bundle
Q: What do we call the server, database and logic behind an app?
A: backend | the backend
Q: What does MVP stand for?
A: minimum viable product
Q: Which language is used for native Android apps today?
A: Kotlin
```
