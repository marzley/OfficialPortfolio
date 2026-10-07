---
slug: rest-api
title: "Project 6: REST API with Node.js and Express (CRUD, validation, JWT auth, tests, deploy)"
after: inventory-system
---
# Project 6: REST API with Node.js and Express

An **API** lets other programs use your data and features: a mobile app, a React website, a partner's system, a USSD menu. Almost every modern product is "an API plus some front-ends". In this project you build a REST API for a **matatu SACCO's vehicles and trips** (or any topic you like: books, events, products) with proper validation, authentication, error handling, tests and deployment.

**You'll practise:** Node.js, Express, JSON, HTTP methods and status codes, a database, JWT authentication, input validation, automated tests, environment variables and deployment.

**Lessons you need:** [how backends work](./?track=apis-backend&lesson=how-backends-work), [designing REST APIs](./?track=apis-backend&lesson=designing-rest-apis), [Node and Express API](./?track=apis-backend&lesson=node-express-api), [auth: passwords and tokens](./?track=apis-backend&lesson=auth-passwords-tokens), [async/await](./?track=javascript&lesson=async-await), [modules and npm](./?track=javascript&lesson=modules-npm-tooling). Prefer PHP? The [PHP JSON API lesson](./?track=apis-backend&lesson=php-json-api) covers the same ideas, and every step here translates directly.

## Step 1: Design the API before coding

Write the endpoints in a table. This *is* your documentation's first draft.

| Method | Path | Does | Auth | Success code |
|---|---|---|---|---|
| POST | `/api/auth/register` | Create an account | – | 201 |
| POST | `/api/auth/login` | Get a token | – | 200 |
| GET | `/api/vehicles` | List vehicles (with `?route=` filter and pagination) | – | 200 |
| GET | `/api/vehicles/:id` | One vehicle | – | 200 / 404 |
| POST | `/api/vehicles` | Add a vehicle | admin | 201 |
| PATCH | `/api/vehicles/:id` | Update some fields | admin | 200 |
| DELETE | `/api/vehicles/:id` | Remove a vehicle | admin | 204 |
| POST | `/api/vehicles/:id/trips` | Record a trip | logged in | 201 |

Rules of good REST design: **nouns** in URLs (`/vehicles`, not `/getVehicles`), HTTP **methods** for actions, plural collection names, correct **status codes**, and consistent JSON error responses like `{ "error": "Plate number is required" }`.

## Step 2: Set up the project

```bash
mkdir sacco-api && cd sacco-api
npm init -y
npm install express better-sqlite3 bcryptjs jsonwebtoken dotenv
npm install --save-dev vitest supertest
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo "*.db" >> .gitignore
```

In `package.json`, set `"type": "module"` and add scripts: `"start": "node src/server.js"`, `"test": "vitest run"`.

`.env` (never committed):

```text
PORT=3000
JWT_SECRET=paste-a-long-random-string-here
DB_FILE=sacco.db
```

Generate a strong secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

## Step 3: Validation (pure functions you can test)

Validate **every** input on the server. Keep validation in small pure functions: easy to test and reuse. Try this one; it validates a Kenyan number plate and a vehicle payload:

```try-javascript
function validPlate(plate) {
  // Kenyan plates such as KDA 123A or KCB 456Z: K + two letters, space optional, 3 digits, a letter
  return /^K[A-Z]{2}\s?\d{3}[A-Z]$/.test(String(plate).toUpperCase().trim());
}

function validateVehicle(body) {
  const errors = [];
  if (!body || typeof body !== "object") return ["Send a JSON object"];
  if (!validPlate(body.plate || "")) errors.push("plate must look like KDA 123A");
  const seats = Number(body.seats);
  if (!Number.isInteger(seats) || seats < 4 || seats > 70) errors.push("seats must be a whole number from 4 to 70");
  if (!body.route || String(body.route).trim().length < 3) errors.push("route is required");
  return errors;
}

console.log(validPlate("KDA 123A"), validPlate("kcb456z"), validPlate("KA 12"));
console.log(validateVehicle({ plate: "KDE 001Q", seats: 14, route: "Nairobi - Thika" }));
console.log(validateVehicle({ plate: "123", seats: 200 }));
```

An empty array means valid. In the project, save these in `src/validate.js` with `export` in front of each `function`. For bigger projects, libraries like **zod** or **joi** do the same with less code.

## Step 4: Database

```javascript
// src/db.js
import Database from "better-sqlite3";

export function openDb(file = process.env.DB_FILE || ":memory:") {
  const db = new Database(file);
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member','admin')));
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY, plate TEXT UNIQUE NOT NULL, seats INTEGER NOT NULL, route TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY, vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      passengers INTEGER NOT NULL, fare_total INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
  `);
  return db;
}
```

SQLite is perfect for learning and small apps. For production with many users, PostgreSQL or MySQL is common; the SQL is almost the same.

## Step 5: The Express app

Export the app separately from `listen()` so tests can use it without opening a port:

```javascript
// src/app.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateVehicle } from "./validate.js";

export function makeApp(db, secret) {
  const app = express();
  app.use(express.json({ limit: "100kb" }));

  // --- auth helpers ---
  function auth(req, res, next) {
    const token = (req.headers.authorization || "").replace(/^Bearer /, "");
    try {
      req.user = jwt.verify(token, secret);
      next();
    } catch {
      res.status(401).json({ error: "Log in first" });
    }
  }
  const admin = (req, res, next) => (req.user.role === "admin" ? next() : res.status(403).json({ error: "Admins only" }));

  app.post("/api/auth/register", async (req, res) => {
    const { email, password } = req.body || {};
    if (!/^\S+@\S+\.\S+$/.test(email || "") || String(password || "").length < 8) {
      return res.status(422).json({ error: "A valid email and a password of 8+ characters are required" });
    }
    try {
      const hash = await bcrypt.hash(password, 12);
      const r = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email.toLowerCase(), hash);
      res.status(201).json({ id: r.lastInsertRowid, email: email.toLowerCase() });
    } catch {
      res.status(409).json({ error: "That email is already registered" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body || {};
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(email || "").toLowerCase());
    if (!user || !(await bcrypt.compare(String(password || ""), user.password_hash))) {
      return res.status(401).json({ error: "Wrong email or password" });
    }
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: "2h" });
    res.json({ token });
  });

  // --- vehicles ---
  app.get("/api/vehicles", (req, res) => {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
    const rows = req.query.route
      ? db.prepare("SELECT * FROM vehicles WHERE route LIKE ? ORDER BY id LIMIT ? OFFSET ?").all("%" + req.query.route + "%", limit, offset)
      : db.prepare("SELECT * FROM vehicles ORDER BY id LIMIT ? OFFSET ?").all(limit, offset);
    res.json({ data: rows, limit, offset });
  });

  app.get("/api/vehicles/:id", (req, res) => {
    const v = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(req.params.id);
    v ? res.json(v) : res.status(404).json({ error: "Vehicle not found" });
  });

  app.post("/api/vehicles", auth, admin, (req, res) => {
    const errors = validateVehicle(req.body);
    if (errors.length) return res.status(422).json({ error: errors.join("; ") });
    const plate = req.body.plate.toUpperCase().replace(/\s+/g, "").replace(/^(K[A-Z]{2})/, "$1 ");   // always stored as "KDE 001Q"
    try {
      const r = db.prepare("INSERT INTO vehicles (plate, seats, route) VALUES (?, ?, ?)").run(plate, Number(req.body.seats), req.body.route.trim());
      res.status(201).json({ id: r.lastInsertRowid, plate, seats: Number(req.body.seats), route: req.body.route.trim() });
    } catch {
      res.status(409).json({ error: "That plate is already registered" });
    }
  });

  app.delete("/api/vehicles/:id", auth, admin, (req, res) => {
    const r = db.prepare("DELETE FROM vehicles WHERE id = ?").run(req.params.id);
    r.changes ? res.status(204).end() : res.status(404).json({ error: "Vehicle not found" });
  });

  // Unknown routes and unexpected errors: always JSON, never a stack trace
  app.use((req, res) => res.status(404).json({ error: "Not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.type === "entity.parse.failed" ? 400 : 500).json({ error: err.type === "entity.parse.failed" ? "Invalid JSON" : "Server error" });
  });
  return app;
}
```

```javascript
// src/server.js
import "dotenv/config";
import { openDb } from "./db.js";
import { makeApp } from "./app.js";

if (!process.env.JWT_SECRET) throw new Error("Set JWT_SECRET in .env");
makeApp(openDb(), process.env.JWT_SECRET).listen(process.env.PORT || 3000, () => console.log("API running"));
```

Add `PATCH /api/vehicles/:id` and the trips endpoints yourself, using the same patterns. That's the real learning.

To make your first admin, register normally, then run `UPDATE users SET role = 'admin' WHERE email = '...'` in the database.

## Step 6: Try it with curl or Thunder Client

```bash
curl -X POST localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"me@example.com","password":"long-password-1"}'
curl -X POST localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"me@example.com","password":"long-password-1"}'
curl -X POST localhost:3000/api/vehicles -H "Authorization: Bearer PASTE_TOKEN" -H "Content-Type: application/json" -d '{"plate":"KDE 001Q","seats":14,"route":"Nairobi - Thika"}'
curl "localhost:3000/api/vehicles?route=Thika"
```

Thunder Client (a VS Code extension), Postman or Bruno give you a visual way to do the same.

## Step 7: Automated tests

Tests prove your API works and keeps working after changes. With Vitest and Supertest:

```javascript
// test/api.test.js
import { describe, it, expect } from "vitest";
import request from "supertest";
import { openDb } from "../src/db.js";
import { makeApp } from "../src/app.js";

const db = openDb(":memory:");
const app = makeApp(db, "test-secret");

describe("vehicles API", () => {
  it("lists vehicles (empty at first)", async () => {
    const res = await request(app).get("/api/vehicles");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it("refuses to create a vehicle without a token", async () => {
    const res = await request(app).post("/api/vehicles").send({ plate: "KDE 001Q", seats: 14, route: "Thika" });
    expect(res.status).toBe(401);
  });

  it("lets an admin create a vehicle and rejects bad input", async () => {
    await request(app).post("/api/auth/register").send({ email: "a@b.co", password: "password123" });
    db.prepare("UPDATE users SET role = 'admin' WHERE email = 'a@b.co'").run();
    const { body } = await request(app).post("/api/auth/login").send({ email: "a@b.co", password: "password123" });
    const ok = await request(app).post("/api/vehicles").set("Authorization", "Bearer " + body.token)
      .send({ plate: "kde 001q", seats: 14, route: "Nairobi - Thika" });
    expect(ok.status).toBe(201);
    expect(ok.body.plate).toBe("KDE 001Q");
    const bad = await request(app).post("/api/vehicles").set("Authorization", "Bearer " + body.token).send({ plate: "x", seats: 900 });
    expect(bad.status).toBe(422);
  });
});
```

Run `npm test`. Then add a GitHub Actions workflow so tests run on every push ([GitHub Actions CI](./?track=git&lesson=github-actions-ci)).

## Step 8: Security checklist

- Passwords hashed with bcrypt (cost 10–12); never returned in responses
- JWT secret long and random, from an environment variable; tokens expire
- Every input validated; prepared statements everywhere
- Request size limit (`express.json({ limit })`); login rate limiting (e.g. `express-rate-limit`)
- `helmet` middleware for security headers; CORS allowed only for your own front-end's domain
- Errors return JSON without stack traces in production
- HTTPS in production

## Step 9: Document and deploy

- Write the endpoint table, example requests and responses in the README, or generate interactive docs with an **OpenAPI** (Swagger) file.
- Deploy to a Node-friendly platform (Render, Railway, Fly.io and similar have free or cheap tiers; terms change, so check) or a VPS with a process manager and a reverse proxy ([deploying Node and Python apps](./?track=hosting&lesson=deploy-node-python-apps)). Set environment variables in the platform dashboard, never in the code.
- Note: SQLite on many free platforms is wiped on every deploy; use the platform's PostgreSQL for real data.

## Stretch goals

- Connect a front-end: a React page ([React effects and data](./?track=react&lesson=react-effects-data)) or your [Flutter app](./?track=projects&lesson=mobile-expense-app).
- Refresh tokens and logout; password reset by email.
- Move to PostgreSQL; add database migrations.
- Package it with **Docker** so it runs the same everywhere.
- Add M-Pesa fare payments ([M-Pesa project](./?track=projects&lesson=mpesa-payment-system)).

## Summary

- Design endpoints first: nouns, methods, status codes, consistent JSON errors.
- Validate everything on the server; hash passwords; protect routes with JWT and roles.
- Export the app separately so it can be tested; write automated tests and run them in CI.
- Keep secrets in environment variables; document and deploy.

```quiz
Q: Which HTTP status code means "created"?
A: 201
Q: Which status code means "you are logged in but not allowed"?
A: 403
Q: Which HTTP method is used to update only some fields of a resource?
A: PATCH
Q: In "Authorization: Bearer <token>", what kind of token does this project use? (three letters)
A: JWT
Q: Where should the JWT secret be stored? (two words, or the file name)
A: environment variable | environment variables | .env | env
```
