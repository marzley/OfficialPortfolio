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

## Why props and lists are the heart of React

Almost every screen displays lists of data (products, messages, students, transactions) and passes data down from parent components to children. Props make components reusable: one `ProductCard` can show any product. Getting lists, keys and conditional rendering right avoids common bugs like wrong items updating, flickering inputs or `0` appearing on screen.

## Passing functions as props (lifting state up)

When several components need the same data, keep the state in their closest common parent and pass down both the data and functions to change it:

```try-react
const { useState } = React;

function QuantityPicker({ value, onChange }) {
  return (
    <span>
      <button onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <strong style={{ margin: "0 8px" }}>{value}</strong>
      <button onClick={() => onChange(value + 1)}>+</button>
    </span>
  );
}

function CartRow({ item, onQtyChange }) {
  return (
    <li style={{ margin: "6px 0" }}>
      {item.name} (KSh {item.price}){" "}
      <QuantityPicker value={item.qty} onChange={(q) => onQtyChange(item.id, q)} />
    </li>
  );
}

function App() {
  const [items, setItems] = useState([
    { id: 1, name: "Unga 2kg", price: 180, qty: 1 },
    { id: 2, name: "Oil 1L", price: 350, qty: 2 },
  ]);
  const updateQty = (id, qty) =>
    setItems(items.map((it) => (it.id === id ? { ...it, qty } : it)));
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <ul>{items.map((it) => <CartRow key={it.id} item={it} onQtyChange={updateQty} />)}</ul>
      <p>Total: KSh {total.toLocaleString()}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Data flows **down** through props; events flow **up** through callback props. `App` owns the state, so the total and every row stay in sync.

## Filtering, searching and sorting lists

```try-react
const { useState } = React;

const students = [
  { id: 1, name: "Amina Hassan", form: 2, mean: 78 },
  { id: 2, name: "Brian Otieno", form: 3, mean: 65 },
  { id: 3, name: "Chebet Kiprop", form: 2, mean: 91 },
  { id: 4, name: "Dennis Mwangi", form: 3, mean: 49 },
];

function App() {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const visible = students
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    .filter((s) => form === "all" || s.form === Number(form))
    .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : b.mean - a.mean));

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <input placeholder="Search name" value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={form} onChange={(e) => setForm(e.target.value)}>
        <option value="all">All forms</option>
        <option value="2">Form 2</option>
        <option value="3">Form 3</option>
      </select>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Sort by name</option>
        <option value="mean">Sort by mean</option>
      </select>
      {visible.length === 0 ? (
        <p>No students match.</p>
      ) : (
        <ul>
          {visible.map((s) => (
            <li key={s.id}>{s.name}, Form {s.form}: {s.mean} {s.mean < 50 && <em>(needs support)</em>}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Notice that the filtered list is **calculated** from state on every render rather than stored separately. Storing derived data in extra state is a common source of out-of-sync bugs.

## Why keys matter: a demonstration

When items are reordered or removed, React uses `key` to match old and new elements. With index keys, typed input can "jump" to the wrong row:

```jsx
// Problem: index keys + inputs + removing items = state attached to the wrong row
{todos.map((t, i) => <TodoRow key={i} todo={t} />)}

// Fix: a stable id from the data
{todos.map((t) => <TodoRow key={t.id} todo={t} />)}
```

Use database IDs, or generate an ID when an item is created (`crypto.randomUUID()`), never `Math.random()` during rendering.

## Conditional rendering patterns

| Pattern | Example | Note |
|---|---|---|
| Ternary | `{isLoggedIn ? <Dashboard /> : <Login />}` | Two options |
| `&&` | `{error && <p className="error">{error}</p>}` | Show or nothing; careful with numbers (`0 && ...` renders 0) |
| Early return | `if (loading) return <Spinner />;` | Clean for loading/error states |
| Object map | `const icons = { paid: "✓", pending: "…" }; {icons[status]}` | Many states |

Use `{items.length > 0 && ...}` rather than `{items.length && ...}` to avoid a stray `0`.

## Composition with children and render props

```jsx
function Card({ title, children, footer }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div>{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}

<Card title="Business plan" footer={<button>Choose plan</button>}>
  <p>KSh 2,500 per month</p>
  <ul><li>5 email accounts</li><li>Daily backups</li></ul>
</Card>
```

Passing JSX through `children` (and other props like `footer`) creates flexible layout components without making one giant component with many options.

## Prop validation with TypeScript

```tsx
type Product = { id: number; name: string; price: number; stock: number };

type ProductCardProps = {
  product: Product;
  onAdd?: (p: Product) => void;      // optional callback
  compact?: boolean;
};

function ProductCard({ product, onAdd, compact = false }: ProductCardProps) {
  return (
    <div className={compact ? "card card--compact" : "card"}>
      {product.name}: KSh {product.price}
      {onAdd && <button onClick={() => onAdd(product)}>Add</button>}
    </div>
  );
}
```

TypeScript catches missing or wrongly typed props at build time, which is why most professional React projects use it.

## Practice

1. Build a product list with a search box and a category filter.
2. Lift state up so a cart icon in the header shows the number of items added from product cards.
3. Create a `Card` component that accepts `title`, `children` and an optional `footer`.
4. Render a list of orders with different badges for pending, paid and cancelled using an object map.
5. Convert a component's props to TypeScript types.

:::think A developer stores both `students` and `filteredStudents` in state and updates `filteredStudents` whenever the search box changes. After editing a student's mark, the filtered list shows the old mark. Why, and what's better?
The two pieces of state got out of sync: the edit updated `students` but `filteredStudents` still held old copies. Better to keep only the source data and the search text in state, and calculate the filtered list during rendering (`students.filter(...)`), so it's always derived from the latest data.
:::

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
Q: In which direction does data flow through props: down or up?
A: down
Q: What is moving shared state to the closest common parent called? (three words)
A: lifting state up | lift state up
Q: Should list keys use Math.random()? (yes or no)
A: no
```
