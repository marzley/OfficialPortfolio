---
slug: react-native-components-styling
title: Core components, styling and Flexbox layouts
after: react-native-intro
---
# Core components, styling and Flexbox layouts

React Native gives you a small set of **core components** that map to native views on Android and iPhone. Layout uses **Flexbox**, like CSS, with a few differences.

## The core components

| Component | Use |
|---|---|
| `View` | A box: layout container |
| `Text` | Any text |
| `Image` | Local or remote images |
| `ScrollView` | Scrollable content (short lists, forms) |
| `FlatList` / `SectionList` | Long, efficient lists (next lesson) |
| `TextInput` | Text entry |
| `Pressable` | Anything tappable, with pressed feedback |
| `Switch` | On/off toggle |
| `ActivityIndicator` | Loading spinner |
| `Modal` | A pop-up screen |
| `KeyboardAvoidingView` | Moves content up when the keyboard opens |
| `SafeAreaView` (from `react-native-safe-area-context`) | Keeps content away from the notch and system bars |

## Styling

Styles are JavaScript objects. Property names are **camelCase** and numbers are **density-independent pixels** (no `px`):

```jsx
import { View, Text, Image, StyleSheet } from "react-native";

export function ProductCard({ name, price, imageUrl, inStock }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.price}>KSh {price.toLocaleString()}</Text>
        <Text style={[styles.badge, !inStock && styles.soldOut]}>{inStock ? "In stock" : "Sold out"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,                                   // Android shadow
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },   // iPhone shadow
  },
  image: { width: 72, height: 72, borderRadius: 10, backgroundColor: "#f1f5f9" },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "700", color: "#0b1b35" },
  price: { fontSize: 15, color: "#0b7a5a", marginTop: 2 },
  badge: { marginTop: 6, alignSelf: "flex-start", fontSize: 12, color: "#166534", backgroundColor: "#dcfce7", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  soldOut: { color: "#991b1b", backgroundColor: "#fee2e2" },
});
```

- Combine styles with an array: `style={[styles.badge, !inStock && styles.soldOut]}` (later styles win).
- **Remote images need a width and height**.
- `numberOfLines={1}` cuts long text with "…".

## Flexbox in React Native

Differences from web CSS:

| Property | React Native default | Web default |
|---|---|---|
| `flexDirection` | **column** | row |
| `alignContent` | flex-start | stretch |
| `flex: 1` | Takes the available space | Similar |

```jsx
import { View, Text, StyleSheet } from "react-native";

export default function Dashboard() {
  return (
    <View style={s.screen}>
      <Text style={s.title}>Today</Text>
      <View style={s.row}>
        <View style={[s.tile, { backgroundColor: "#dcfce7" }]}>
          <Text style={s.value}>KSh 8,640</Text>
          <Text>Sales</Text>
        </View>
        <View style={[s.tile, { backgroundColor: "#fef3c7" }]}>
          <Text style={s.value}>3</Text>
          <Text>Low stock</Text>
        </View>
      </View>
      <View style={s.spacer} />
      <Text style={s.footer}>Synced 2 minutes ago</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },                 // gap works in recent React Native versions
  tile: { flex: 1, padding: 16, borderRadius: 14 },        // two tiles share the row equally
  value: { fontSize: 22, fontWeight: "800" },
  spacer: { flex: 1 },                                      // pushes the footer to the bottom
  footer: { textAlign: "center", color: "#64748b" },
});
```

## Text input and the keyboard

```jsx
import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

export default function PhoneForm() {
  const [phone, setPhone] = useState("");
  const digits = phone.replace(/\D/g, "");
  const valid = /^(0[17]\d{8}|254[17]\d{8})$/.test(digits);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={st.screen}>
      <Text style={st.label}>M-Pesa number</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}                 // gives the text directly (not an event)
        placeholder="0712 345 678"
        keyboardType="phone-pad"
        maxLength={16}
        style={[st.input, phone && !valid && st.inputError]}
      />
      {phone !== "" && !valid && <Text style={st.error}>Enter a Safaricom or Airtel number</Text>}
      <Pressable
        disabled={!valid}
        onPress={() => alert("We'd now send an M-Pesa prompt (through our server)")}
        style={({ pressed }) => [st.button, !valid && { opacity: 0.4 }, pressed && { opacity: 0.8 }]}
      >
        <Text style={st.buttonText}>Pay</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, padding: 20, justifyContent: "center" },
  label: { fontWeight: "700", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 12, padding: 14, fontSize: 18 },
  inputError: { borderColor: "#dc2626" },
  error: { color: "#dc2626", marginTop: 6 },
  button: { marginTop: 16, backgroundColor: "#0b7a5a", padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});
```

## Platform differences

```js
import { Platform } from "react-native";

const fontFamily = Platform.select({ ios: "System", android: "Roboto" });
if (Platform.OS === "android") {
  // Android-only behaviour
}
```

Most code works on both; use `Platform` only for small differences.

## UI libraries

**React Native Paper** (Material Design), **Tamagui** and **NativeWind** (Tailwind-style classes) give you ready components and theming. Start with core components so you understand what they do.

```quiz
Q: What is the default flexDirection in React Native?
A: column
Q: Which component makes anything tappable with pressed feedback?
A: Pressable
Q: Which TextInput prop gives the typed text directly?
A: onChangeText
Q: Which keyboardType shows a number pad for phone numbers?
A: phone-pad
Q: How do you combine two styles on one component?
A: an array | with an array | style={[a, b]} | array
Q: Which module tells you whether the app runs on Android or iOS?
A: Platform
```
