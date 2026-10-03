---
slug: choosing-your-stack
title: Choosing your stack and setting up your tools
after: what-is-app-development
---
# Choosing your stack and setting up your tools

A **stack** is the set of technologies an app is built with: the app framework, the backend language, the database and the hosting. Choosing well saves months; choosing badly means rewriting.

## Popular stacks for Kenyan projects

| Stack | App | Backend | Database | Good for |
|---|---|---|---|---|
| **Flutter + PHP** | Flutter | PHP (Laravel or plain) on cPanel | MySQL | Business apps with M-Pesa, low hosting cost |
| **Flutter + Firebase** | Flutter | Firebase (Auth, Firestore, Functions) | Firestore | Fast prototypes, real-time and offline features |
| **React Native + Node** | React Native (Expo) | Node.js (Express) | PostgreSQL or MySQL | JavaScript teams, apps with a matching React website |
| **Kotlin + Spring/Ktor** | Native Android | Kotlin/Java backend | PostgreSQL | Android-first products, large teams |
| **PWA + PHP** | HTML/CSS/JS (or React) | PHP | MySQL | Cheapest way to reach everyone, internal systems |

There's no single "best" stack. Choose by:

1. **Team skills**: what you (or your team) know well ships faster.
2. **Budget and hosting**: cPanel PHP hosting is cheap and common in Kenya; cloud servers cost more but scale further.
3. **Features**: heavy offline use, Bluetooth printers, background location? Favour Flutter or native.
4. **Maintenance**: who will maintain it in 2 years? Popular tools are easier to hire for.

## The tools you need

| Tool | Purpose | Cost |
|---|---|---|
| **VS Code** | Code editor for Flutter, React Native, web, PHP | Free |
| **Android Studio** | Android SDK, emulator, Kotlin development | Free |
| **Git + GitHub** | Version control and backup of your code | Free |
| **Figma** | UI design and prototypes | Free plan |
| **Postman** or **Insomnia** | Testing APIs | Free plans |
| **A real Android phone** | Testing (better than the emulator on most laptops) | You probably have one |
| **Node.js** | Needed for React Native, many web tools | Free |
| **XAMPP** or **Laragon** | Local PHP + MySQL server on Windows | Free |

## Minimum computer

- **8 GB RAM** is the practical minimum for Android Studio; 16 GB is comfortable.
- An **SSD** makes builds much faster than a hard disk.
- No good laptop yet? Learn Dart on **DartPad**, React on **CodeSandbox/StackBlitz**, and use this hub's live editors. Many professionals started that way.

## Set up Git from day one

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

git init                      # start tracking a project
git add .
git commit -m "First version of the shop app"
git remote add origin https://github.com/you/duka-app.git
git push -u origin main
```

Commit small changes often with clear messages. GitHub is also your **portfolio**: employers and clients look at it. Learn more in the **Git & GitHub** subject.

## Project folder habits

- One repository per app (and one for the backend, or a folder for each).
- A **README** explaining what the app does and how to run it.
- Never commit **secrets** (API keys, passwords, signing keys): put them in environment files listed in `.gitignore`.
- Use the platform's recommended structure (Flutter's `lib/`, Android's `app/src/main/`).

## Why the stack decision matters

The technologies you choose affect how fast you can build, how much the app costs to run, who can maintain it later, and whether it works well for users on budget phones and patchy networks. Clients rarely care about frameworks; they care about cost, speed to launch, reliability and future changes. A good developer explains the trade-offs in plain language and recommends what fits the project, not just what's fashionable.

## Native vs cross-platform vs web

| Approach | Examples | Strengths | Weaknesses |
|---|---|---|---|
| Native Android | Kotlin + Jetpack Compose | Best performance and device access, Google's recommended path | Android only; iOS needs a separate app |
| Native iOS | Swift + SwiftUI | Best iPhone experience | Needs a Mac; iOS only |
| Cross-platform | Flutter (Dart), React Native (JavaScript/TypeScript) | One codebase for Android and iOS; fast development | Some platform-specific work still needed; larger app size than native in some cases |
| Progressive Web App (PWA) | HTML/CSS/JS, React, Vue | No store needed, works on any device with a browser, installable | Limited device features on some platforms; less "app store" visibility |
| No-code / low-code | Glide, FlutterFlow, AppSheet, Adalo | Very fast prototypes, internal tools | Limits on customisation; platform lock-in; subscription costs |

## Choosing by project type

| Project | Sensible choice | Why |
|---|---|---|
| Small business catalogue with WhatsApp ordering | PWA or website | Cheapest, no store approval, easy to share links |
| Delivery or ride app needing GPS, camera and notifications on Android and iOS | Flutter or React Native | One codebase, full device access |
| Fintech app with heavy security and performance needs | Native or Flutter, with a strong back end | Mature security tooling and performance |
| Internal staff tool (stock taking, field data) | No-code or PWA first; native later if needed | Quick to deliver, cheap to change |
| Game | Unity (C#) or Godot | Game engines handle graphics and physics |
| Existing React web team | React Native | Reuse skills and some code |

## The back end: often the bigger decision

Most apps need a server for accounts, data, payments and notifications:

| Option | Examples | Good for |
|---|---|---|
| Backend-as-a-Service | Firebase, Supabase, Appwrite | Fast MVPs, authentication, real-time data, small teams |
| Custom API | Laravel (PHP), Django/FastAPI (Python), Node.js (Express/NestJS), Spring (Java), ASP.NET (C#) | Complex business rules, payments, integrations, full control |
| Hosting | Shared cPanel (PHP), VPS, cloud platforms (Render, Railway, Fly.io), major clouds | Depends on stack, traffic and budget |

Payments (M-Pesa Daraja, card gateways) **must** go through a server you control, because secret keys can't be stored in the app.

## Cost factors to explain to clients

| Cost | Notes |
|---|---|
| Development time | The biggest cost; cross-platform can reduce it when both Android and iOS are needed |
| Developer accounts | Google Play one-time fee; Apple Developer Program yearly fee |
| Hosting and database | Monthly; grows with users and data |
| Third-party services | SMS gateways, maps, email, push notifications, payment fees |
| Maintenance | Updates for new Android/iOS versions, security fixes, library updates (budget for this every year) |

Never quote only the build: clients are often surprised by yearly store fees, hosting and maintenance.

## Setting up a development environment step by step

1. Install **Git** and create a GitHub account.
2. Install **VS Code** (with extensions for your language) and/or **Android Studio** (Android SDK and emulator).
3. Install the language toolchain: Flutter SDK, Node.js LTS (for React Native/Expo), or the JDK (Kotlin/Android).
4. Run the toolchain's check command (`flutter doctor`, `npx expo-doctor`) and fix what it reports.
5. Enable **USB debugging** on an Android phone (Settings → About phone → tap Build number 7 times → Developer options → USB debugging) to test on a real device.
6. Install **Postman** or a similar tool for testing APIs.

Testing on a real budget phone is often faster and more realistic than an emulator on a modest laptop.

## Working on a modest computer

- Use a real phone for testing instead of the emulator to save RAM.
- Close browsers with many tabs while building.
- An SSD makes builds much faster than an HDD.
- Cloud build services (Expo EAS, Codemagic, GitHub Actions) can build release versions remotely.
- Cyber cafés and tech hubs (and some libraries) can help when you don't yet have a capable laptop.

## Decision checklist

1. Which platforms do users need (Android only, or iOS too, or web)?
2. Which device features are required (camera, GPS, Bluetooth, notifications, offline)?
3. What's the budget and timeline?
4. Who will maintain it, and what skills do they have?
5. How many users and how much data are expected in the first year?
6. What integrations are needed (M-Pesa, SMS, maps, existing systems)?

Write the decision and reasons down; it helps when clients or new team members ask "why did we choose this?"

## Practice

1. For three app ideas (school fees portal, delivery app, church events app), choose a stack and justify it.
2. Install your chosen toolchain and run its doctor/check command until everything passes.
3. Enable USB debugging and run a sample app on your phone.
4. Write a one-page cost estimate including store fees, hosting and yearly maintenance.
5. Create a GitHub repository with a `.gitignore` for your stack.

:::think A client wants "an app like Jumia" built in three weeks on a small budget. What would you recommend, and why?
Clarify the core need: likely a product catalogue, ordering and payment for their own shop. Suggest starting with a fast, mobile-friendly web shop or PWA (or a simple cross-platform MVP) with WhatsApp/M-Pesa checkout, launching quickly and gathering real orders. Large marketplace features (multiple sellers, logistics, reviews) can come later once the business proves demand. Be honest about what's realistic for the time and budget.
:::

```quiz
Q: What do we call the set of technologies an app is built with?
A: stack | a stack | tech stack
Q: Which free tool provides the Android SDK and emulator?
A: Android Studio
Q: How much RAM is the practical minimum for Android Studio?
A: 8 GB | 8 | 8GB
Q: Which file stops secrets from being committed to Git?
A: .gitignore | gitignore
Q: Which tool tests APIs by sending requests?
A: Postman | Insomnia
Q: What kind of web app can be installed on a phone without an app store? (abbreviation)
A: PWA | progressive web app
Q: Which two cross-platform frameworks are popular for Android and iOS from one codebase? (name one)
A: Flutter | React Native
Q: Where must payment secret keys always be kept?
A: server | on the server | the server
```
