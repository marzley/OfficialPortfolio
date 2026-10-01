---
slug: node-express-api
title: Building an API with Node.js and Express
after: php-json-api
---
# Building an API with Node.js and Express

**Node.js** runs JavaScript on the server, so you can use one language for your React website, React Native app and backend. **Express** is the most widely used Node web framework: small, flexible and easy to learn.

## Setup

```bash
mkdir duka-api && cd duka-api
npm init -y
npm install express
```

Add `"type": "module"` to `package.json` to use `import` syntax.

## A complete small API

```js
// server.js
import express from "express";

const app = express();
app.use(express.json({ limit: "100kb" }));           // parse JSON bodies (with a size limit)

let nextId = 3;
const products = [
  { id: 1, name: "Unga 2kg", price: 180, stock: 12 },
  { id: 2, name: "Sugar 1kg", price: 150, stock: 0 },
];

app.get("/v1/products", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  res.json({ data: products.filter((p) => p.name.toLowerCase().includes(q)) });
});

app.get("/v1/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: { message: "Product not found" } });
  res.json({ data: product });
});

app.post("/v1/products", (req, res) => {
  const { name, price } = req.body ?? {};
  if (typeof name !== "string" || name.trim().length < 2 || !Number.isInteger(price) || price <= 0) {
    return res.status(422).json({ error: { message: "Name and a whole-number price above 0 are required" } });
  }
  const product = { id: nextId++, name: name.trim(), price, stock: 0 };
  products.push(product);
  res.status(201).json({ data: product });
});

// errors thrown anywhere end up here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { message: "Something went wrong" } });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
```

Run it with `node server.js` (or `node --watch server.js` to restart on every save) and test with `curl http://localhost:3000/v1/products`.

## Middleware: code that runs before your routes

Middleware functions receive `(req, res, next)`. They're used for logging, authentication, rate limiting and validation:

```js
function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const user = verifyToken(token);                  // your function: check a session or JWT
  if (!user) return res.status(401).json({ error: { message: "Please sign in" } });
  req.user = user;                                  // available to the route
  next();
}

function requireRole(role) {
  return (req, res, next) =>
    req.user.role === role ? next() : res.status(403).json({ error: { message: "Not allowed" } });
}

function verifyToken(token) {
  return token === "demo-token" ? { id: 7, role: "owner" } : null;
}

// usage: app.delete("/v1/products/:id", requireAuth, requireRole("owner"), (req, res) => { ... });
```

## Routing logic you can run

The logic inside routes is plain JavaScript. Here's a sales summary like an API would compute:

```try-javascript
const sales = [
  { id: 1, productId: 1, qty: 2, price: 180, method: "mpesa", at: "2026-10-01T09:15:00+03:00" },
  { id: 2, productId: 2, qty: 1, price: 150, method: "cash", at: "2026-10-01T10:02:00+03:00" },
  { id: 3, productId: 1, qty: 5, price: 180, method: "mpesa", at: "2026-10-01T16:40:00+03:00" },
  { id: 4, productId: 3, qty: 3, price: 60, method: "credit", at: "2026-09-30T18:20:00+03:00" },
];

function dailyReport(sales, day) {
  const today = sales.filter((s) => s.at.startsWith(day));
  const byMethod = {};
  for (const s of today) byMethod[s.method] = (byMethod[s.method] || 0) + s.qty * s.price;
  const total = Object.values(byMethod).reduce((a, b) => a + b, 0);
  return { day, count: today.length, total, byMethod };
}

console.log(JSON.stringify(dailyReport(sales, "2026-10-01"), null, 2));
```

## Connecting a database

Popular choices:

| Database | Node library |
|---|---|
| PostgreSQL | `pg`, or an ORM like **Prisma** or **Drizzle** |
| MySQL | `mysql2` |
| SQLite | `better-sqlite3` |
| MongoDB | `mongodb`, `mongoose` |

Always use **parameterised queries** (`db.query("SELECT * FROM products WHERE id = $1", [id])`), never string concatenation.

## Configuration and secrets

Read secrets from **environment variables**, never from code:

```js
const config = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY,
};
if (!config.databaseUrl) throw new Error("DATABASE_URL is not set");
```

Locally, keep them in a `.env` file (listed in `.gitignore`) and load it with `node --env-file=.env server.js` (Node 20+).

## Production essentials

- **helmet** (security headers), **cors** (allowed origins), **express-rate-limit** (stop abuse).
- Input validation with **zod** or similar.
- Logging (pino), health-check endpoint (`GET /health`).
- Run with a process manager (pm2) or on a platform (Render, Railway, Fly.io, a VPS). See the deployment lesson.

```quiz
Q: Which Express function parses JSON request bodies?
A: express.json | express.json()
Q: How do you read :id from /v1/products/:id in Express?
A: req.params.id
Q: How do you read ?q= from the URL in Express?
A: req.query.q
Q: Functions that run before routes, receiving (req, res, next), are called?
A: middleware
Q: Where should secrets like database URLs come from?
A: environment variables | env | process.env
Q: Which package adds security headers to Express?
A: helmet
```
