---
slug: react-native-intro
title: React Native and Expo: setup and your first app
after: START
---
# React Native and Expo: setup and your first app

**React Native** lets you build real Android and iPhone apps with **JavaScript** (or TypeScript) and **React**. Unlike a website in a wrapper, React Native draws **native** buttons, lists and text, so apps feel at home on each phone. Apps built with it include parts of Facebook, Instagram, Shopify, Discord and many fintech apps.

**Expo** is the recommended way to start: it handles the native tooling for you, lets you run the app on your phone instantly with the **Expo Go** app, and builds store-ready apps in the cloud.

> **Before you start:** learn **JavaScript** and the **React** subject in this hub (components, props, state, effects). React Native uses exactly the same React ideas.

## Setup (about 15 minutes)

1. Install **Node.js LTS** from nodejs.org.
2. Install **Expo Go** on your Android phone from the Play Store.
3. Create and start a project:

```bash
npx create-expo-app@latest duka
cd duka
npx expo start
```

4. A QR code appears in the terminal. **Scan it with Expo Go**: the app opens on your phone. Save a file and it reloads in about a second.

Your phone and computer must be on the **same Wi-Fi**. If not, run `npx expo start --tunnel`.

No computer at all yet? Use **snack.expo.dev**: write React Native in the browser and run it on your phone through Expo Go.

## Project structure (Expo Router template)

```
duka/
├── app/                 ← screens: each file is a route (Expo Router)
│   ├── _layout.tsx      ← navigation layout (stack, tabs)
│   └── index.tsx        ← the first screen
├── assets/              ← images, fonts, icon, splash screen
├── components/          ← your reusable components
├── app.json             ← app name, icon, package id, permissions
└── package.json
```

New templates use **TypeScript** (`.tsx`). Plain JavaScript works too; the examples here are JavaScript so they're easy to read.

## Your first screen

```jsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Karibu Duka 🛒</Text>
      <Text style={styles.subtitle}>Items in your cart: {count}</Text>
      <Pressable style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>Add item</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "800", color: "#0b1b35" },
  subtitle: { fontSize: 16, marginVertical: 12, color: "#475569" },
  button: { backgroundColor: "#ffb800", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 999 },
  buttonText: { fontWeight: "700", color: "#0b1b35", fontSize: 16 },
});
```

## React vs React Native

| React (web) | React Native |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` (all text must be inside `<Text>`) |
| `<img>` | `<Image>` |
| `<button onClick>` | `<Pressable onPress>` (or `<Button>`) |
| `<input>` | `<TextInput>` |
| CSS files, classes | `StyleSheet.create({ ... })` JavaScript objects |
| Scrolls automatically | Use `<ScrollView>` or `<FlatList>` |
| `onClick` | `onPress` |

Everything else (components, props, `useState`, `useEffect`, context, custom hooks) is the same.

## Debugging

- Shake the phone (or press `m` in the terminal) for the **developer menu**.
- `console.log` output appears in the terminal.
- Errors show as a red screen with the file and line.
- Press `j` to open the JavaScript debugger.

## When to choose React Native

| Good fit | Consider Flutter or native instead |
|---|---|
| Your team knows JavaScript/React | You want pixel-identical custom UI everywhere (Flutter) |
| You also have a React website (share logic and skills) | Heavy graphics, games, or deep hardware features (native) |
| Rapid prototyping with Expo Go | |

See [Flutter vs React Native vs native Android](../flutter-vs-react-native-kenya).

```quiz
Q: Which app runs your React Native project on your phone by scanning a QR code?
A: Expo Go
Q: Which command starts an Expo project?
A: npx expo start
Q: What replaces <div> in React Native?
A: View | <View>
Q: Must all text in React Native be inside a <Text> component? (yes or no)
A: yes
Q: Which event replaces onClick in React Native?
A: onPress
Q: Which website lets you write React Native in the browser?
A: snack.expo.dev | Expo Snack | Snack
```
