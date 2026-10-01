---
slug: react-more-hooks
title: "More hooks: useRef, useMemo, useReducer, context and custom hooks"
after: react-effects-data
---
# More hooks: useRef, useMemo, useReducer, context and custom hooks

Hooks are functions starting with `use` that give components extra powers. You've used `useState` and `useEffect`. Here are the others you'll meet in real projects.

> **Rules of hooks:** call hooks only at the **top level** of a component (not inside loops, conditions or nested functions), and only from React components or custom hooks.

## useRef: remembering without re-rendering, and DOM access

```try-react
const { useRef, useState } = React;

function PinEntry() {
  const inputRef = useRef(null);              // points to a DOM element
  const attempts = useRef(0);                 // a value that persists but doesn't trigger re-renders
  const [msg, setMsg] = useState("");

  function check() {
    attempts.current += 1;
    if (inputRef.current.value === "1234") setMsg("Correct ✅");
    else {
      setMsg(`Wrong PIN (attempt ${attempts.current})`);
      inputRef.current.value = "";
      inputRef.current.focus();               // move the cursor back into the input
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <input ref={inputRef} type="password" placeholder="Enter PIN (try 1234)" style={{ padding: 8 }} />
      <button onClick={check} style={{ marginLeft: 6, padding: 8 }}>Check</button>
      <p>{msg}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PinEntry />);
```

## useMemo and useCallback: avoiding expensive repeat work

```try-react
const { useState, useMemo } = React;

const allProducts = Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `Product ${i}`, price: (i * 37) % 2000 }));

function Catalogue() {
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);

  const results = useMemo(() => {                      // only recalculated when query changes
    const q = query.toLowerCase();
    return allProducts.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 10);
  }, [query]);

  return (
    <div style={{ fontFamily: "sans-serif", background: dark ? "#0b1b35" : "white", color: dark ? "white" : "black", padding: 12 }}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search 5,000 products" />
      <button onClick={() => setDark(!dark)} style={{ marginLeft: 6 }}>Toggle theme</button>
      <ul>{results.map((p) => <li key={p.id}>{p.name}: KSh {p.price}</li>)}</ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Catalogue />);
```

Toggling the theme re-renders, but the filtering doesn't run again because `query` didn't change. `useCallback(fn, deps)` does the same for functions you pass to child components. Use them when you measure a real slowdown; don't wrap everything.

## useReducer: complex state with clear actions

When state has many related parts and many ways to change, a **reducer** keeps the logic in one place:

```try-react
const { useReducer } = React;

const initial = { items: [], total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const exists = state.items.find((i) => i.id === action.product.id);
      const items = exists
        ? state.items.map((i) => (i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { ...action.product, qty: 1 }];
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case "remove": {
      const items = state.items
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case "clear":
      return initial;
    default:
      return state;
  }
}

const catalogue = [{ id: 1, name: "Unga", price: 180 }, { id: 2, name: "Sugar", price: 150 }, { id: 3, name: "Milk", price: 60 }];

function Shop() {
  const [cart, dispatch] = useReducer(cartReducer, initial);
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {catalogue.map((p) => (
        <button key={p.id} onClick={() => dispatch({ type: "add", product: p })} style={{ margin: 4 }}>+ {p.name}</button>
      ))}
      <ul>
        {cart.items.map((i) => (
          <li key={i.id}>{i.name} × {i.qty} <button onClick={() => dispatch({ type: "remove", id: i.id })}>−</button></li>
        ))}
      </ul>
      <strong>Total: KSh {cart.total}</strong>{" "}
      <button onClick={() => dispatch({ type: "clear" })}>Clear</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Shop />);
```

The reducer is a pure function: easy to test and reason about. This is the same idea as Redux.

## Context: sharing data without prop drilling

```try-react
const { createContext, useContext, useState } = React;

const ThemeContext = createContext("light");

function Badge() {
  const theme = useContext(ThemeContext);               // read the nearest provider's value
  return <span style={{ padding: "4px 10px", borderRadius: 999, background: theme === "dark" ? "#ffb800" : "#0b1b35", color: theme === "dark" ? "#0b1b35" : "white" }}>Duka</span>;
}

function Toolbar() {
  return <div style={{ padding: 8 }}><Badge /></div>;   // doesn't need to pass theme along
}

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ fontFamily: "sans-serif", background: theme === "dark" ? "#0b1b35" : "#f8fafc", padding: 12 }}>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Switch theme</button>
        <Toolbar />
      </div>
    </ThemeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Use context for app-wide values: the signed-in user, theme, language, cart. For complex global state, teams also use libraries like **Zustand** or **Redux Toolkit**.

## Custom hooks: reuse logic

```try-react
const { useState, useEffect } = React;

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem(key); return saved !== null ? JSON.parse(saved) : initial; }
    catch (e) { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }, [key, value]);
  return [value, setValue];
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}

function App() {
  const [name, setName] = useLocalStorage("shopName", "");
  const online = useOnline();
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <p>{online ? "🟢 Online" : "🔴 Offline: changes are saved on this device"}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Shop name (remembered)" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

A custom hook is just a function whose name starts with `use` and that calls other hooks.

```quiz
Q: Which hook holds a value that persists without causing re-renders, or points to a DOM element?
A: useRef
Q: Which hook remembers the result of an expensive calculation?
A: useMemo
Q: Which hook manages complex state with actions and a reducer function?
A: useReducer
Q: Which hook reads a value shared through context?
A: useContext
Q: What must a custom hook's name start with?
A: use
Q: May you call hooks inside an if statement? (yes or no)
A: no
```
