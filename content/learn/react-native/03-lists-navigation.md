---
slug: react-native-lists-navigation
title: Lists with FlatList and navigation with Expo Router
after: react-native-components-styling
---
# Lists with FlatList and navigation with Expo Router

## FlatList: fast lists of any length

`FlatList` renders only the rows near the screen, so it stays smooth with thousands of items. Never use `ScrollView` + `map` for long lists.

```jsx
import { useState, useCallback } from "react";
import { FlatList, View, Text, Pressable, RefreshControl, StyleSheet } from "react-native";

const ORDERS = Array.from({ length: 50 }, (_, i) => ({
  id: String(1000 + i),
  customer: ["Wanjiku", "Otieno", "Amina", "Kamau", "Chebet"][i % 5],
  total: 300 + ((i * 137) % 4000),
  paid: i % 3 !== 0,
}));

function OrderRow({ order, onPress }) {
  return (
    <Pressable onPress={() => onPress(order)} style={({ pressed }) => [st.row, pressed && { backgroundColor: "#f1f5f9" }]}>
      <View style={{ flex: 1 }}>
        <Text style={st.title}>Order #{order.id}</Text>
        <Text style={st.sub}>{order.customer}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={st.total}>KSh {order.total.toLocaleString()}</Text>
        <Text style={{ color: order.paid ? "#166534" : "#b45309" }}>{order.paid ? "Paid" : "Unpaid"}</Text>
      </View>
    </Pressable>
  );
}

export default function Orders() {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);       // pretend to reload from the API
  }, []);

  return (
    <FlatList
      data={ORDERS}
      keyExtractor={(item) => item.id}                  // a unique key per row
      renderItem={({ item }) => <OrderRow order={item} onPress={(o) => console.log("open", o.id)} />}
      ItemSeparatorComponent={() => <View style={st.sep} />}
      ListHeaderComponent={<Text style={st.header}>Today's orders</Text>}
      ListEmptyComponent={<Text style={{ padding: 16 }}>No orders yet</Text>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}   // pull to refresh
      onEndReached={() => console.log("load the next page")}                                // infinite scroll
      onEndReachedThreshold={0.5}
    />
  );
}

const st = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "800", padding: 16 },
  row: { flexDirection: "row", padding: 16, backgroundColor: "white" },
  title: { fontWeight: "700", fontSize: 16 },
  sub: { color: "#64748b" },
  total: { fontWeight: "700" },
  sep: { height: 1, backgroundColor: "#e2e8f0" },
});
```

For grids use `numColumns={2}`; for grouped lists (by date, by category) use `SectionList`.

## Navigation with Expo Router

**Expo Router** uses **files as routes**: every file in `app/` becomes a screen, like pages on a website.

```
app/
├── _layout.jsx            ← root layout: a Stack navigator
├── (tabs)/
│   ├── _layout.jsx        ← bottom tabs
│   ├── index.jsx          ← "/"            (Home tab)
│   ├── orders.jsx         ← "/orders"      (Orders tab)
│   └── account.jsx        ← "/account"     (Account tab)
└── product/[id].jsx       ← "/product/17"  (a dynamic route)
```

### Root layout: a stack

```jsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ title: "Product" }} />
    </Stack>
  );
}
```

### Tabs layout

```jsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#0b7a5a" }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
      <Tabs.Screen name="orders" options={{ title: "Orders", tabBarIcon: ({ color, size }) => <Ionicons name="receipt" color={color} size={size} /> }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
    </Tabs>
  );
}
```

### Moving between screens and passing data

```jsx
// app/(tabs)/index.jsx
import { Link, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Home() {
  const router = useRouter();
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Link href="/product/17"><Text>Open Unga 2kg (a link)</Text></Link>
      <Pressable onPress={() => router.push({ pathname: "/product/[id]", params: { id: "18" } })}>
        <Text>Open Sugar 1kg (in code)</Text>
      </Pressable>
    </View>
  );
}
```

```jsx
// app/product/[id].jsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Product() {
  const { id } = useLocalSearchParams();         // "17" from /product/17
  const router = useRouter();
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22 }}>Product {id}</Text>
      <Pressable onPress={() => router.back()}><Text>Back</Text></Pressable>
    </View>
  );
}
```

| Call | Does |
|---|---|
| `router.push("/orders")` | Open a screen (Back returns) |
| `router.replace("/(tabs)")` | Replace the current screen (after login) |
| `router.back()` | Go back |
| `<Link href="…">` | A tappable link |

Pass **IDs** in routes, then load full data on the next screen (from state, cache or the API). Don't pass large objects through URLs.

(Before Expo Router, apps used **React Navigation** directly with `createNativeStackNavigator`; Expo Router is built on it, so the concepts are the same.)

```quiz
Q: Which component renders long lists efficiently?
A: FlatList
Q: Which FlatList prop gives each row a unique key?
A: keyExtractor
Q: Which prop adds pull-to-refresh to a FlatList?
A: refreshControl | RefreshControl
Q: In Expo Router, which folder holds the screen files?
A: app | app/
Q: Which hook reads the id from /product/[id]?
A: useLocalSearchParams
Q: Which router method goes back to the previous screen?
A: back | router.back | router.back()
```
