---
slug: react-intro
title: "React introduction: components and JSX"
after: START
---
# React introduction: components and JSX

**React** is a JavaScript library for building user interfaces from small, reusable pieces called **components**. It was created at Facebook (Meta) and powers sites like Facebook, Instagram, Netflix, Airbnb and countless Kenyan startups' dashboards. Learning React also prepares you for **React Native**, which builds mobile apps with the same ideas.

> **Before you start:** you should know HTML, CSS and JavaScript basics (functions, arrays, objects, `map`). Do the **JavaScript** subject first if you haven't.

Every example on this page runs live: press **Run**, change the code, run again.

## Your first component

```try-react
function Greeting() {
  return <h1>Habari, Kenya! 👋</h1>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Greeting />);
```

- A **component** is a JavaScript function that returns what should appear on screen.
- Its name **starts with a capital letter** (`Greeting`, not `greeting`).
- `<Greeting />` uses the component, like a custom HTML tag.
- `createRoot(...).render(...)` puts the app into the page's `<div id="root">`.

## JSX: HTML-like syntax in JavaScript

The `<h1>…</h1>` inside JavaScript is **JSX**. It looks like HTML but is turned into JavaScript. A few differences:

| HTML | JSX |
|---|---|
| `class="card"` | `className="card"` |
| `for="email"` | `htmlFor="email"` |
| `style="color: red"` | `style={{ color: "red" }}` (an object) |
| `onclick="..."` | `onClick={handleClick}` (camelCase, a function) |
| `<br>`, `<img>` | Must close: `<br />`, `<img />` |
| Several root elements | One root: wrap in `<div>` or a fragment `<>…</>` |

## Putting JavaScript inside JSX

Curly braces `{ }` insert any JavaScript expression:

```try-react
function ShopCard() {
  const shop = "Mama Mboga";
  const items = ["Sukuma", "Tomatoes", "Onions"];
  const openNow = new Date().getHours() >= 7;
  const delivery = 150;

  return (
    <div style={{ fontFamily: "sans-serif", border: "1px solid #ddd", borderRadius: 12, padding: 16, maxWidth: 320 }}>
      <h2>{shop}</h2>
      <p>{openNow ? "Open now ✅" : "Opens at 7am"}</p>
      <p>We sell {items.length} items. Delivery: KSh {delivery}</p>
      <p>Today's special: {items[0].toUpperCase()}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ShopCard />);
```

## Building pages from components

Big UIs are made by combining small components:

```try-react
function Header() {
  return <header style={{ background: "#0b1b35", color: "white", padding: 12 }}><strong>Duka Online</strong></header>;
}

function Product() {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, margin: "8px 0" }}>
      <strong>Unga 2kg</strong> · KSh 180
    </div>
  );
}

function Footer() {
  return <footer style={{ color: "#64748b", marginTop: 12 }}>Pay with M-Pesa · Delivery in Thika</footer>;
}

function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Header />
      <main style={{ padding: 12 }}>
        <h2>Products</h2>
        <Product />
        <Product />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Both products are the same for now. In the next lesson, **props** let each one show different data.

## How React updates the page

When data changes, React re-runs your component functions, compares the new result with the previous one (the **virtual DOM**), and changes **only** what differs in the real page. You describe *what* the UI should look like for the current data; React handles *how* to update it. This is called **declarative** UI.

## Where React is used

| Use | Example |
|---|---|
| Single-page apps and dashboards | Admin panels, school portals, POS screens |
| Websites with frameworks | **Next.js** (React plus server rendering, routing, SEO) |
| Mobile apps | **React Native** |
| Desktop apps | Electron apps like VS Code's UI ideas, Slack |

## Why React is so widely used

React (created at Meta) is one of the most popular libraries for building user interfaces. Facebook, Instagram, WhatsApp Web, Netflix, Airbnb and countless startups, fintechs and agencies use it. Its component model means you build small, reusable pieces (a product card, a navbar, a payment form) and combine them into whole apps. React skills are among the most requested in front-end job adverts, and the same knowledge carries over to React Native for mobile apps.

## Thinking in components

Look at a typical shop page and break it into components:

```text
App
├── Header (logo, search box, cart icon with count)
├── CategoryTabs
├── ProductGrid
│   └── ProductCard × many (image, name, price, "Add" button)
├── CartSummary (items, total, checkout button)
└── Footer
```

Each component has one job. If `ProductCard` changes design, you edit one place and every card updates.

## A small interactive example

```try-react
const { useState } = React;

const products = [
  { id: 1, name: "Unga 2kg", price: 180 },
  { id: 2, name: "Sugar 1kg", price: 210 },
  { id: 3, name: "Milk 500ml", price: 60 },
];

function ProductCard({ product, onAdd }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, marginBottom: 8 }}>
      <strong>{product.name}</strong> <span>KSh {product.price}</span>{" "}
      <button onClick={() => onAdd(product)}>Add</button>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 360 }}>
      <h2>Duka Bora</h2>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={(item) => setCart([...cart, item])} />
      ))}
      <p>{cart.length} items · Total KSh {total}</p>
      {cart.length > 0 && <button onClick={() => setCart([])}>Clear cart</button>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Click "Add": React re-renders with the new state, and the total updates automatically. You describe **what** the UI should look like for the current data; React works out **how** to update the page.

## JSX rules to remember

| Rule | Example |
|---|---|
| Return one parent element (or a fragment) | `<>...</>` wraps siblings without adding a div |
| Close every tag | `<img />`, `<br />`, `<input />` |
| `className` instead of `class` | `<div className="card">` |
| `htmlFor` instead of `for` on labels | `<label htmlFor="email">` |
| camelCase attributes and events | `onClick`, `onChange`, `tabIndex` |
| Inline styles are objects | `style={{ color: "red", fontSize: 18 }}` |
| JavaScript expressions in `{}` | `{price * qty}`, `{isOpen ? "Open" : "Closed"}` |
| Comments inside JSX | `{/* comment */}` |

## Declarative vs imperative UI

```javascript
// Imperative (plain DOM): you describe every step
const li = document.createElement("li");
li.textContent = product.name;
list.appendChild(li);
counter.textContent = items.length;

// Declarative (React): you describe the result for the current data
<ul>{items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
<p>{items.length} items</p>
```

As apps grow, keeping many manual DOM updates in sync becomes error-prone; declarative rendering avoids that class of bugs.

## Setting up a real React project

```bash
npm create vite@latest duka-app -- --template react      # or react-ts for TypeScript
cd duka-app
npm install
npm run dev          # local development server with instant updates
npm run build        # optimised files in dist/ ready to deploy
```

| Option | Use when |
|---|---|
| **Vite + React** | Single-page apps, dashboards, learning; deploy `dist/` to Netlify, Cloudflare Pages or any static host |
| **Next.js** | SEO-friendly websites, server rendering, API routes, full-stack apps |
| **React Native / Expo** | Mobile apps for Android and iOS |

## React developer tools

- **React Developer Tools** browser extension: inspect the component tree, props and state.
- **ESLint** with React rules (`eslint-plugin-react-hooks`) catches common hook mistakes.
- **Prettier** formats code consistently.
- **TypeScript** adds types for props and state, increasingly standard in jobs.

## The React ecosystem (what you'll meet later)

| Need | Common choices |
|---|---|
| Routing (pages) | React Router, Next.js routing |
| Server data fetching and caching | TanStack Query, SWR, Next.js data fetching |
| Forms | React Hook Form + Zod validation |
| Styling | CSS Modules, Tailwind CSS, component libraries (MUI, shadcn/ui, Chakra) |
| Global state | Context, Zustand, Redux Toolkit |
| Testing | Vitest/Jest + React Testing Library, Playwright for end-to-end |

Learn core React (components, props, state, effects) well before adding libraries.

## Practice

1. Break the homepage of a site you use into a component tree on paper.
2. Build a `Greeting` component that shows "Habari za asubuhi" before noon and "Habari za jioni" after.
3. Create a `PriceTag` component that formats numbers as KSh with commas.
4. Build a simple counter with "+" and "−" buttons that never goes below zero.
5. Create a Vite React project and replace the starter page with your own components.

:::think Why does React need you to call `setCart(...)` instead of just doing `cart.push(item)`?
React re-renders when state is updated through its setter function. `cart.push` changes the array in place without telling React, so the screen doesn't update (and React may not detect the change because the array reference stays the same). Calling `setCart([...cart, item])` creates a new array and schedules a re-render with the new data.
:::

```quiz
Q: What do we call the reusable pieces a React UI is built from?
A: components | component
Q: Must a component's name start with a capital letter? (yes or no)
A: yes
Q: What is the HTML-like syntax inside React code called?
A: JSX
Q: In JSX, which attribute replaces HTML's class?
A: className
Q: Which brackets insert a JavaScript expression into JSX?
A: {} | curly braces | { }
Q: Which React framework adds server rendering and routing for SEO-friendly sites?
A: Next.js | Next | nextjs
Q: What empty tag pair groups elements without adding a div? (write it)
A: <></> | fragment | <> </>
Q: Which command creates a new React project with Vite? (npm create ...)
A: npm create vite@latest | vite
Q: Which browser extension inspects React components, props and state? (three words)
A: React Developer Tools | React DevTools
```
