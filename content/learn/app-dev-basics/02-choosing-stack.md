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
```
