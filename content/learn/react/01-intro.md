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
```
