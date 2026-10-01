---
slug: react-project-and-tooling
title: "Project: a shop with cart, then real-world React tooling"
after: react-more-hooks
---
# Project: a shop with cart, then real-world React tooling

Let's combine everything into a small but complete shop: product grid, search, category filter, cart with quantities, totals, delivery choice and a checkout summary. Then you'll learn how real React projects are created, structured and deployed.

## The shop

```try-react
const { useState, useMemo, useReducer } = React;

const PRODUCTS = [
  { id: 1, name: "Unga 2kg", price: 180, cat: "Food", emoji: "🌾" },
  { id: 2, name: "Sugar 1kg", price: 150, cat: "Food", emoji: "🍬" },
  { id: 3, name: "Cooking oil 1L", price: 350, cat: "Food", emoji: "🫒" },
  { id: 4, name: "Bar soap", price: 120, cat: "Home", emoji: "🧼" },
  { id: 5, name: "Solar lantern", price: 1850, cat: "Electronics", emoji: "🔦" },
  { id: 6, name: "Phone charger", price: 450, cat: "Electronics", emoji: "🔌" },
];
const DELIVERY = { pickup: 0, thika: 150, nairobi: 300 };
const ksh = (n) => "KSh " + n.toLocaleString("en-KE");

function cartReducer(cart, action) {
  switch (action.type) {
    case "add": return { ...cart, [action.id]: (cart[action.id] || 0) + 1 };
    case "remove": {
      const qty = (cart[action.id] || 0) - 1;
      const next = { ...cart };
      if (qty <= 0) delete next[action.id]; else next[action.id] = qty;
      return next;
    }
    case "clear": return {};
    default: return cart;
  }
}

function ProductCard({ p, qty, onAdd }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, textAlign: "center" }}>
      <div style={{ fontSize: 36 }}>{p.emoji}</div>
      <strong>{p.name}</strong>
      <div>{ksh(p.price)}</div>
      <button onClick={onAdd} style={{ marginTop: 6 }}>{qty ? `Add another (${qty})` : "Add to cart"}</button>
    </div>
  );
}

function Cart({ cart, dispatch, delivery, setDelivery }) {
  const lines = Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty }));
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const total = subtotal + (lines.length ? DELIVERY[delivery] : 0);
  if (!lines.length) return <p>Your cart is empty.</p>;
  return (
    <div>
      {lines.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
          <span>{l.name} × {l.qty}</span>
          <span>
            {ksh(l.price * l.qty)}{" "}
            <button onClick={() => dispatch({ type: "remove", id: l.id })}>−</button>
            <button onClick={() => dispatch({ type: "add", id: l.id })}>+</button>
          </span>
        </div>
      ))}
      <label>Delivery:{" "}
        <select value={delivery} onChange={(e) => setDelivery(e.target.value)}>
          <option value="pickup">Pick up (free)</option>
          <option value="thika">Thika (KSh 150)</option>
          <option value="nairobi">Nairobi (KSh 300)</option>
        </select>
      </label>
      <p>Subtotal {ksh(subtotal)} · <strong>Total {ksh(total)}</strong></p>
      <button onClick={() => alert(`We'd now send an M-Pesa prompt for ${ksh(total)} (through the shop's server).`)}>Pay with M-Pesa</button>{" "}
      <button onClick={() => dispatch({ type: "clear" })}>Clear cart</button>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [delivery, setDelivery] = useState("thika");
  const [cart, dispatch] = useReducer(cartReducer, {});

  const visible = useMemo(() => PRODUCTS.filter((p) =>
    (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(query.toLowerCase())), [query, cat]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 720 }}>
      <h2>Duka Online 🛒 <small style={{ fontSize: 14 }}>({count} in cart)</small></h2>
      <input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 6 }} />{" "}
      {["All", "Food", "Home", "Electronics"].map((c) => (
        <button key={c} onClick={() => setCat(c)} style={{ fontWeight: c === cat ? "bold" : "normal", margin: 2 }}>{c}</button>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, margin: "12px 0" }}>
        {visible.map((p) => <ProductCard key={p.id} p={p} qty={cart[p.id]} onAdd={() => dispatch({ type: "add", id: p.id })} />)}
      </div>
      {visible.length === 0 && <p>No products match.</p>}
      <h3>Cart</h3>
      <Cart cart={cart} dispatch={dispatch} delivery={delivery} setDelivery={setDelivery} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

**Challenges:** save the cart to localStorage with the `useLocalStorage` hook from the last lesson; add a checkout form with phone validation; split the code into files (next section).

## Creating a real React project

The live editor is great for learning. Real projects use a **build tool** on your computer. Install **Node.js** (LTS), then:

```bash
npm create vite@latest duka-shop -- --template react
cd duka-shop
npm install
npm run dev          # opens a local dev server with instant reload
```

Project structure:

```
duka-shop/
├── index.html
├── package.json          ← scripts and dependencies
└── src/
    ├── main.jsx          ← renders <App /> into #root
    ├── App.jsx
    ├── components/       ← ProductCard.jsx, Cart.jsx, ...
    ├── hooks/            ← useLocalStorage.js
    └── api/              ← functions that call your backend
```

Each component gets its own file and is shared with `export` / `import`:

```jsx
// src/components/ProductCard.jsx
export default function ProductCard({ product, onAdd }) {
  return <button onClick={onAdd}>{product.name}</button>;
}
```

```jsx
// src/App.jsx
import ProductCard from "./components/ProductCard.jsx";

export default function App() {
  return <ProductCard product={{ name: "Unga 2kg" }} onAdd={() => {}} />;
}
```

## Useful libraries

| Need | Library |
|---|---|
| Pages and URLs | **React Router** |
| Server data, caching | **TanStack Query** |
| Forms and validation | **React Hook Form** + **Zod** |
| Styling | **Tailwind CSS**, CSS Modules |
| Global state | **Zustand**, Redux Toolkit |
| Full framework with server rendering and SEO | **Next.js** |
| Types | **TypeScript** (see the TypeScript subject) |

## Building and deploying

```bash
npm run build        # creates an optimised dist/ folder
```

- **Static hosting**: upload `dist/` to Netlify, Vercel, GitHub Pages or **cPanel** (into `public_html`). For React Router on cPanel, add an `.htaccess` rule that sends unknown paths to `index.html`.
- **API calls**: point your app at your backend (PHP/Node) with HTTPS. Keep secrets on the server, never in React code, because everything in the bundle is visible to users.
- **SEO**: single-page apps are harder for search engines; for public marketing sites, use Next.js or pre-rendering.

```quiz
Q: Which command creates a new React project with Vite?
A: npm create vite@latest | npm create vite
Q: Which command starts the local development server?
A: npm run dev
Q: Which command creates the optimised production files?
A: npm run build
Q: Which library adds pages and URLs to a React app?
A: React Router
Q: Should API secret keys be put in React code? (yes or no)
A: no
Q: Which folder does npm run build create with Vite?
A: dist | dist/
```
