---
slug: react-native-state-data
title: State, APIs and storing data on the phone
after: react-native-lists-navigation
---
# State, APIs and storing data on the phone

## Loading from an API with fetch

```jsx
import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";

const API = "https://jsonplaceholder.typicode.com";

export default function Customers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);        // give up after 15 s on bad networks
      const res = await fetch(`${API}/users`, { signal: controller.signal, headers: { Accept: "application/json" } });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setItems(await res.json());
    } catch (e) {
      setError(e.name === "AbortError" ? "The network is slow. Try again." : "Could not load. Check your internet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  if (error) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text>{error}</Text>
        <Pressable onPress={load} style={{ marginTop: 12 }}><Text style={{ color: "#0b7a5a", fontWeight: "700" }}>Try again</Text></Pressable>
      </View>
    );
  }
  return (
    <FlatList
      data={items}
      keyExtractor={(u) => String(u.id)}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
          <Text style={{ fontWeight: "700" }}>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
}
```

Sending data:

```js
async function createOrder(token, order) {
  const res = await fetch("https://api.example.co.ke/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(order),
  });
  if (res.status === 401) throw new Error("Please sign in again");
  if (!res.ok) throw new Error("Could not place the order");
  return res.json();
}
```

> **Security:** never put API secrets (M-Pesa keys, payment keys, database passwords) in a React Native app. Anyone can unpack the app and read them. The app calls **your** server; your server holds the secrets.

## Sharing state across screens with context

```jsx
import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function reducer(cart, action) {
  switch (action.type) {
    case "add": return { ...cart, [action.id]: (cart[action.id] || 0) + 1 };
    case "remove": {
      const next = { ...cart };
      if ((next[action.id] || 0) <= 1) delete next[action.id]; else next[action.id] -= 1;
      return next;
    }
    case "clear": return {};
    default: return cart;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, {});
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return <CartContext.Provider value={{ cart, count, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
```

Wrap the app in `<CartProvider>` in `app/_layout.jsx`, then any screen can call `const { count, dispatch } = useCart();`. For bigger apps, **Zustand** is a popular, simple global store, and **TanStack Query** handles server data, caching and refetching.

## Storing data on the phone

| Need | Library |
|---|---|
| Small values: settings, cached lists | `@react-native-async-storage/async-storage` |
| Secrets: login tokens | `expo-secure-store` (encrypted) |
| Structured data, offline records, search | `expo-sqlite` |
| Files | `expo-file-system` |

```js
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export async function saveSettings(settings) {
  await AsyncStorage.setItem("settings", JSON.stringify(settings));
}

export async function loadSettings() {
  const raw = await AsyncStorage.getItem("settings");
  return raw ? JSON.parse(raw) : { theme: "system", language: "en" };
}

export async function saveToken(token) {
  await SecureStore.setItemAsync("authToken", token);       // encrypted on the device
}

export async function getToken() {
  return SecureStore.getItemAsync("authToken");
}
```

## SQLite for offline records

```js
import * as SQLite from "expo-sqlite";

const db = await SQLite.openDatabaseAsync("duka.db");

await db.execAsync(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price INTEGER NOT NULL,
    synced INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

export async function recordSale(product, qty, price) {
  await db.runAsync("INSERT INTO sales (product, qty, price, created_at) VALUES (?, ?, ?, ?)",
    product, qty, price, new Date().toISOString());          // ? placeholders prevent SQL injection
}

export async function unsyncedSales() {
  return db.getAllAsync("SELECT * FROM sales WHERE synced = 0");
}
```

Record sales offline, then send `unsyncedSales()` to the server when online and mark them `synced = 1`. Practise the SQL in the **SQL** subject.

```quiz
Q: Which built-in function calls APIs in React Native?
A: fetch
Q: Where should a login token be stored in an Expo app?
A: expo-secure-store | SecureStore | secure store
Q: Which library stores small settings as key-value pairs?
A: AsyncStorage | @react-native-async-storage/async-storage
Q: Which Expo library gives you an SQLite database?
A: expo-sqlite
Q: Should M-Pesa secret keys be inside the app? (yes or no)
A: no
Q: Which React feature shares state like a cart across screens?
A: context | Context
```
