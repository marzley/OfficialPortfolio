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

## Why React Native

React Native lets you build real Android and iOS apps with JavaScript (or TypeScript) and React. One codebase produces native apps, and web developers can reuse their React skills. Apps from Meta, Microsoft, Shopify, Discord and many startups use it. For Kenyan developers and agencies, it's a practical way to deliver apps for clients who want both Android and iPhone versions without maintaining two separate codebases.

## How React Native works

- You write components with React (`<View>`, `<Text>`, `<Pressable>`), and React Native renders **real native UI elements**, not a web page inside the app.
- JavaScript runs on the device (with the Hermes engine) and talks to native code for things like the camera, location and notifications.
- **Expo** adds tooling and ready-made libraries (camera, image picker, notifications, secure storage, updates) so you rarely need to write native Android/iOS code.

## Core components compared with the web

| Web (React) | React Native | Notes |
|---|---|---|
| `<div>` | `<View>` | Layout container (uses flexbox by default, column direction) |
| `<p>`, `<span>` | `<Text>` | All text must be inside `<Text>` |
| `<img>` | `<Image>` | Needs width/height for remote images |
| `<button>`, `onClick` | `<Pressable>` / `<TouchableOpacity>`, `onPress` | Custom touchable areas |
| `<input>` | `<TextInput>` | `keyboardType="phone-pad"`, `secureTextEntry` |
| `<ul>` with `map` | `<FlatList>` | Efficient long lists (renders only what's visible) |
| CSS files | `StyleSheet.create({...})` | camelCase properties, numbers are density-independent pixels |
| Scrolling page | `<ScrollView>` | For short content; use FlatList for long lists |

## A product list screen

```jsx
import { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, StyleSheet } from "react-native";

const PRODUCTS = [
  { id: "1", name: "Unga 2kg", price: 180 },
  { id: "2", name: "Sugar 1kg", price: 210 },
  { id: "3", name: "Cooking oil 1L", price: 350 },
];

export default function ProductsScreen() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const visible = PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <View style={styles.screen}>
      <TextInput style={styles.search} placeholder="Search products" value={query} onChangeText={setQuery} />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>KSh {item.price}</Text>
            <Pressable style={styles.button} onPress={() => setCart([...cart, item])}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text>No products found</Text>}
      />
      <Text style={styles.total}>{cart.length} items · KSh {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#fff" },
  search: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  name: { flex: 1, fontWeight: "600" },
  button: { backgroundColor: "#0b1b35", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  buttonText: { color: "#fff", fontWeight: "700" },
  total: { fontSize: 18, fontWeight: "700", paddingTop: 12 },
});
```

## Layout with flexbox

React Native uses flexbox for everything, with `flexDirection: "column"` as the default:

| Property | Effect |
|---|---|
| `flex: 1` | Take up available space |
| `flexDirection: "row"` | Arrange children horizontally |
| `justifyContent` | Spacing along the main axis (`center`, `space-between`) |
| `alignItems` | Alignment on the cross axis (`center`, `flex-start`) |
| `gap` | Space between children |

Use `SafeAreaView` (from `react-native-safe-area-context`) so content doesn't go under phone notches and status bars.

## Navigation with Expo Router

Expo Router uses files and folders as screens, like Next.js:

```text
app/
├── _layout.jsx          ← stack or tab layout
├── index.jsx            ← home screen "/"
├── cart.jsx             ← "/cart"
└── product/[id].jsx     ← "/product/123" (dynamic route)
```

```jsx
import { Link, useLocalSearchParams } from "expo-router";

<Link href="/product/2">View sugar</Link>          // navigate

const { id } = useLocalSearchParams();            // read the id on product/[id].jsx
```

## Fetching data from your API

```jsx
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";

function useProducts() {
  const [state, setState] = useState({ loading: true, data: [], error: null });
  useEffect(() => {
    let cancelled = false;
    fetch("https://api.example.co.ke/products")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => !cancelled && setState({ loading: false, data, error: null }))
      .catch(() => !cancelled && setState({ loading: false, data: [], error: "Check your internet connection" }));
    return () => { cancelled = true; };
  }, []);
  return state;
}
```

Always show loading and error states; mobile connections drop often. Cache important data on the device (AsyncStorage, SQLite) so the app works offline.

## Device features with Expo libraries

| Feature | Library |
|---|---|
| Camera / photos | `expo-image-picker`, `expo-camera` |
| Location | `expo-location` |
| Push notifications | `expo-notifications` |
| Secure storage (tokens) | `expo-secure-store` |
| Local database | `expo-sqlite` |
| Sharing files | `expo-sharing` |
| Over-the-air updates | `expo-updates` (EAS Update) |

Ask for permissions only when needed, with a clear explanation, and handle "denied" gracefully.

## Building and publishing

```bash
npm install -g eas-cli
eas login
eas build --platform android      # builds an .aab in the cloud (no Android Studio needed)
eas build --platform ios          # needs an Apple Developer account
eas submit --platform android     # upload to Google Play
```

EAS (Expo Application Services) builds apps in the cloud, which helps if your computer is not powerful or you don't have a Mac for iOS builds. Keep API secrets on your server, not in the app bundle.

## Practice

1. Create an Expo app and change the home screen to show your name and a button that counts taps.
2. Build a product list with `FlatList`, a search `TextInput` and an "Add" button.
3. Add a second screen with Expo Router and navigate to it with `Link`.
4. Fetch a list from a public test API and show loading and error states.
5. Use `expo-image-picker` to choose a photo and display it.

:::think Why should a long product list use FlatList instead of mapping items inside a ScrollView?
A ScrollView renders every item at once, which uses a lot of memory and makes screens slow (especially on budget phones) when lists are long. FlatList renders only the items currently visible (plus a small buffer) and recycles them while scrolling, keeping the app fast and smooth.
:::

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
Q: Which React Native component efficiently renders long lists?
A: FlatList
Q: Which function creates styles in React Native? (StyleSheet...)
A: StyleSheet.create | create
Q: Which Expo service builds Android and iOS apps in the cloud? (abbreviation)
A: EAS | EAS Build
Q: What is the default flexDirection in React Native?
A: column
```
