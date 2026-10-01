---
slug: react-props-lists
title: Props, lists and conditional rendering
after: react-intro
---
# Props, lists and conditional rendering

Components become useful when you can **pass them data**. That data is called **props** (properties).

## Props

```try-react
function ProductCard({ name, price, inStock }) {      // props come in as one object; we destructure it
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, margin: "8px 0", fontFamily: "sans-serif" }}>
      <strong>{name}</strong>
      <div>KSh {price.toLocaleString()}</div>
      <small style={{ color: inStock ? "green" : "crimson" }}>{inStock ? "In stock" : "Sold out"}</small>
    </div>
  );
}

function App() {
  return (
    <div>
      <ProductCard name="Unga 2kg" price={180} inStock={true} />
      <ProductCard name="Cooking oil 3L" price={1150} inStock={false} />
      <ProductCard name="Solar lantern" price={1850} inStock />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

- Strings can be passed in quotes; numbers, booleans, arrays, objects and functions in `{ }`.
- Writing just `inStock` means `inStock={true}`.
- Props are **read-only**: a component must never change its own props.

## Rendering lists with map

```try-react
const products = [
  { id: 1, name: "Unga 2kg", price: 180, stock: 12 },
  { id: 2, name: "Sugar 1kg", price: 150, stock: 0 },
  { id: 3, name: "Milk 500ml", price: 60, stock: 40 },
  { id: 4, name: "Bread", price: 65, stock: 8 },
];

function ProductRow({ product }) {
  return (
    <li style={{ padding: "6px 0", color: product.stock === 0 ? "#94a3b8" : "inherit" }}>
      {product.name}: KSh {product.price} {product.stock === 0 && <em>(sold out)</em>}
    </li>
  );
}

function ProductList({ items }) {
  if (items.length === 0) return <p>No products yet.</p>;
  return (
    <ul style={{ fontFamily: "sans-serif" }}>
      {items.map((p) => <ProductRow key={p.id} product={p} />)}
    </ul>
  );
}

function App() {
  const available = products.filter((p) => p.stock > 0);
  const total = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  return (
    <div>
      <h2>All products</h2>
      <ProductList items={products} />
      <p>{available.length} of {products.length} in stock · stock value KSh {total.toLocaleString()}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

**Keys:** every item in a list needs a unique, stable `key` (usually its database `id`). React uses keys to know which item is which when the list changes. Don't use the array index if items can be added, removed or reordered.

## Conditional rendering

| Pattern | Use |
|---|---|
| `{cond ? <A /> : <B />}` | Show one thing or another |
| `{cond && <A />}` | Show something only if true |
| `if (...) return ...` early | Whole different output (loading, empty, error) |

Careful: `{count && <p>…</p>}` shows a `0` on screen when `count` is 0. Use `{count > 0 && …}`.

## children: components that wrap content

```try-react
function Card({ title, children }) {
  return (
    <section style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, margin: 8, fontFamily: "sans-serif" }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </section>
  );
}

function App() {
  return (
    <>
      <Card title="Delivery">
        <p>Within Thika: KSh 150. Upcountry by bus: KSh 400.</p>
      </Card>
      <Card title="Pay with M-Pesa">
        <ol>
          <li>Lipa na M-Pesa → Buy Goods</li>
          <li>Till number 123456</li>
        </ol>
      </Card>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Anything between `<Card>` and `</Card>` arrives as the `children` prop. Layouts, modals and cards are built this way.

## Thinking in components

1. Draw the screen and box each part (header, search, product list, product row, cart summary).
2. Each box becomes a component.
3. Decide what data each needs (props) and where that data lives (next lesson: state).

```quiz
Q: What is data passed into a component called?
A: props | properties
Q: Can a component change its own props? (yes or no)
A: no
Q: Which array method turns a list of data into a list of elements?
A: map | .map
Q: What unique attribute does each list item need?
A: key
Q: Which prop holds the content placed between a component's opening and closing tags?
A: children
Q: What appears on screen if you write {count && <p>Items</p>} and count is 0?
A: 0 | zero
```
