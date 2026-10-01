---
slug: react-state-events
title: State, events and forms
after: react-props-lists
---
# State, events and forms

Props come from the parent. **State** is data a component owns that changes over time: a counter, the text in a search box, items in a cart. When state changes, React re-renders the component.

## useState

```try-react
const { useState } = React;

function Counter() {
  const [count, setCount] = useState(0);        // [current value, function to change it]

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>Items in cart: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Add item</button>{" "}
      <button onClick={() => setCount(Math.max(0, count - 1))} disabled={count === 0}>Remove item</button>{" "}
      <button onClick={() => setCount(0)}>Clear</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Counter />);
```

Rules of state:

1. **Never change state directly** (`count = 5` does nothing). Always use the setter.
2. When the new value depends on the old one, use the **updater form**: `setCount(c => c + 1)`.
3. For objects and arrays, create **new copies** instead of changing them:

```js
setUser({ ...user, name: "Amina" });          // copy the object, change one field
setItems([...items, newItem]);                // add
setItems(items.filter(i => i.id !== id));     // remove
setItems(items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));   // update one
```

## Events

```try-react
const { useState } = React;

function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(41);

  function toggle() {
    setLiked(!liked);
    setLikes((n) => (liked ? n - 1 : n + 1));
  }

  return (
    <button onClick={toggle} style={{ fontSize: 18, padding: "8px 16px", borderRadius: 999 }}>
      {liked ? "❤️" : "🤍"} {likes}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<LikeButton />);
```

Pass the **function** (`onClick={toggle}`), don't call it (`onClick={toggle()}` would run on every render).

## Controlled inputs and forms

In React, form inputs are usually **controlled**: their value comes from state, and typing updates the state.

```try-react
const { useState } = React;

function normalisePhone(text) {
  const d = text.replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(d)) return "254" + d.slice(1);
  if (/^254[17]\d{8}$/.test(d)) return d;
  return null;
}

function CheckoutForm() {
  const [form, setForm] = useState({ name: "", phone: "", area: "Thika" });
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState("");

  const errors = {
    name: form.name.trim().split(" ").length < 2 ? "Enter your first and last name" : "",
    phone: normalisePhone(form.phone) ? "" : "Enter a number like 0712 345 678",
  };
  const valid = !errors.name && !errors.phone;

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });   // one handler for all fields
  }

  function submit(e) {
    e.preventDefault();                                         // stop the page reloading
    setSubmitted(true);
    if (valid) setDone(`Order placed! We'll send an M-Pesa prompt to ${normalisePhone(form.phone)}.`);
  }

  const field = { display: "block", width: "100%", padding: 8, margin: "4px 0 2px", boxSizing: "border-box" };
  return (
    <form onSubmit={submit} noValidate style={{ fontFamily: "sans-serif", maxWidth: 340 }}>
      <label>Full name<input name="name" value={form.name} onChange={update} style={field} /></label>
      {submitted && errors.name && <small style={{ color: "crimson" }}>{errors.name}</small>}

      <label style={{ display: "block", marginTop: 10 }}>M-Pesa number
        <input name="phone" type="tel" value={form.phone} onChange={update} style={field} placeholder="0712 345 678" />
      </label>
      {submitted && errors.phone && <small style={{ color: "crimson" }}>{errors.phone}</small>}

      <label style={{ display: "block", marginTop: 10 }}>Delivery area
        <select name="area" value={form.area} onChange={update} style={field}>
          <option>Thika</option><option>Ruiru</option><option>Juja</option><option>Nairobi CBD</option>
        </select>
      </label>

      <button type="submit" style={{ marginTop: 14, padding: "10px 16px" }}>Place order</button>
      {done && <p style={{ color: "green" }}>{done}</p>}
    </form>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CheckoutForm />);
```

## Lifting state up

When two components need the same state, move it to their **closest common parent**, and pass the value and a setter down as props:

```try-react
const { useState } = React;

function Search({ value, onChange }) {
  return <input placeholder="Search products" value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: 8, width: 240 }} />;
}

function Results({ query }) {
  const all = ["Unga", "Sugar", "Salt", "Soap", "Sukuma", "Milk"];
  const found = all.filter((p) => p.toLowerCase().includes(query.toLowerCase()));
  return <ul>{found.map((p) => <li key={p}>{p}</li>)}</ul>;
}

function App() {
  const [query, setQuery] = useState("");        // lives in the parent, shared by both children
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Search value={query} onChange={setQuery} />
      <Results query={query} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

```quiz
Q: Which hook adds state to a component?
A: useState
Q: Should you change state by assigning to it directly? (yes or no)
A: no
Q: Which form of the setter should you use when the new value depends on the old: setCount(count + 1) or setCount(c => c + 1)?
A: setCount(c => c + 1) | updater | the updater form
Q: Which method stops a form submit from reloading the page?
A: preventDefault | e.preventDefault()
Q: An input whose value comes from state is called a ... input?
A: controlled
Q: Moving shared state to the closest common parent is called lifting state ...?
A: up
```
