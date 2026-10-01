---
slug: react-effects-data
title: useEffect and loading data
after: react-state-events
---
# useEffect and loading data

Components should be "pure": given the same props and state, they return the same UI. But apps also need to **do things**: load data from an API, start a timer, save to localStorage, update the page title. These are **side effects**, and they go in `useEffect`.

## useEffect basics

```try-react
const { useState, useEffect } = React;

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);   // start when the component appears
    return () => clearInterval(id);                            // clean up when it disappears
  }, []);                                                      // [] = run once, after the first render

  return <h2 style={{ fontFamily: "sans-serif" }}>Nairobi time: {now.toLocaleTimeString("en-KE")}</h2>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Clock />);
```

| Dependency array | Effect runs |
|---|---|
| `useEffect(fn, [])` | Once, after the first render |
| `useEffect(fn, [a, b])` | After the first render, and whenever `a` or `b` change |
| `useEffect(fn)` (no array) | After **every** render (rarely what you want) |

The function you **return** is the **cleanup**: stop timers, cancel requests, remove listeners.

## Loading data: loading, error and data states

This example simulates an API with a short delay, so it works anywhere. In a real app, replace `fakeApi` with `fetch("https://your-api/products")`.

```try-react
const { useState, useEffect } = React;

function fakeApi(fail) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Network error")) : resolve([
      { id: 1, name: "Unga 2kg", price: 180 },
      { id: 2, name: "Sugar 1kg", price: 150 },
      { id: 3, name: "Cooking oil 1L", price: 350 },
    ])), 800));
}

function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;                       // ignore results if the component left the screen
    setLoading(true);
    setError("");
    fakeApi(attempt === 0)                       // the first attempt fails on purpose, to show the error state
      .then((data) => { if (!cancelled) setItems(data); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);                                 // re-run when the user retries

  if (loading) return <p>Loading products…</p>;
  if (error) return <p>⚠️ {error}. <button onClick={() => setAttempt(attempt + 1)}>Try again</button></p>;
  if (items.length === 0) return <p>No products yet.</p>;
  return <ul>{items.map((p) => <li key={p.id}>{p.name}: KSh {p.price}</li>)}</ul>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<div style={{ fontFamily: "sans-serif" }}><Products /></div>);
```

## Real fetch with async/await

```js
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    try {
      setLoading(true);
      const res = await fetch("https://api.example.co.ke/products", { signal: controller.signal });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setItems(await res.json());
    } catch (e) {
      if (e.name !== "AbortError") setError("Could not load products. Check your connection.");
    } finally {
      setLoading(false);
    }
  }
  load();
  return () => controller.abort();          // cancel if the user leaves the page
}, []);
```

## Saving to localStorage

```try-react
const { useState, useEffect } = React;

function Notes() {
  const [text, setText] = useState(() => {
    try { return localStorage.getItem("note") || ""; } catch (e) { return ""; }
  });

  useEffect(() => {
    try { localStorage.setItem("note", text); } catch (e) { /* storage may be blocked */ }
  }, [text]);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} cols={36} placeholder="Shopping list…" />
      <p>{text.length} characters (saved in your browser)</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Notes />);
```

## You might not need an effect

Don't use effects to **calculate** things from props or state; just calculate during rendering:

```js
// ❌ unnecessary effect and an extra render
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce((s, i) => s + i.price, 0)), [items]);
```

```js
// ✅ simply calculate it while rendering
const total = items.reduce((s, i) => s + i.price, 0);
```

## In real projects

Data-fetching libraries like **TanStack Query** (React Query) or **SWR** handle caching, retries, refetching and loading states for you. Frameworks like **Next.js** can load data on the server. Learn plain `useEffect` first so you understand what those tools do.

```quiz
Q: Which hook runs side effects like loading data or starting timers?
A: useEffect
Q: Which dependency array makes an effect run only once after the first render?
A: [] | empty array | an empty array
Q: What is the function returned from an effect called?
A: cleanup | the cleanup function | cleanup function
Q: Which browser object cancels a fetch request?
A: AbortController
Q: Should you use an effect to calculate a total from state? (yes or no)
A: no
Q: Name a library that handles data fetching, caching and retries in React.
A: TanStack Query | React Query | SWR
```
