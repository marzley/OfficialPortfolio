---
slug: how-backends-work
title: "How backends work: HTTP, REST, JSON and status codes"
after: START
---
# How backends work: HTTP, REST, JSON and status codes

Every serious app (mobile or web) has a **backend**: a server that stores data, checks who's allowed to do what, takes payments and sends notifications. The app (the **client**) talks to it through an **API** over the internet.

```
 Phone app / website (client)                     Server (backend)
 ─────────────────────────────                     ───────────────────────────────
  GET /api/products  ───────── HTTPS request ────►  check token → query database
                     ◄──────── HTTPS response ────  200 OK + JSON list of products
```

## HTTP in one minute

A **request** has:

| Part | Example |
|---|---|
| **Method** | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| **URL** | `https://api.duka.co.ke/v1/products?category=food` |
| **Headers** | `Authorization: Bearer abc123`, `Content-Type: application/json` |
| **Body** (for POST/PUT/PATCH) | `{"name": "Unga 2kg", "price": 180}` |

A **response** has a **status code**, headers and usually a JSON body.

## Methods: what you want to do

| Method | Meaning | Example |
|---|---|---|
| `GET` | Read | `GET /products` (list), `GET /products/17` (one) |
| `POST` | Create | `POST /orders` with the order in the body |
| `PUT` | Replace | `PUT /products/17` with the full product |
| `PATCH` | Update some fields | `PATCH /products/17` with `{"price": 190}` |
| `DELETE` | Delete | `DELETE /products/17` |

## Status codes you must know

| Code | Meaning | When |
|---|---|---|
| **200** OK | Success | Reading or updating worked |
| **201** Created | Created | A new order or user was created |
| **204** No Content | Success, nothing to return | After a delete |
| **400** Bad Request | Invalid input | Missing field, wrong format |
| **401** Unauthorized | Not signed in / bad token | Token missing or expired |
| **403** Forbidden | Signed in but not allowed | An attendant trying to delete products |
| **404** Not Found | Doesn't exist | Wrong ID |
| **409** Conflict | Clashes with current state | Email already registered |
| **422** Unprocessable | Valid JSON but fails validation | Price is negative |
| **429** Too Many Requests | Rate limit hit | Too many login attempts |
| **500** Server Error | Bug or failure on the server | Never show the technical details to users |

**2xx** = success, **4xx** = the client's fault, **5xx** = the server's fault.

## JSON: the language of APIs

```try-javascript
// What a server sends back (as text)
const responseText = `{
  "orders": [
    {"id": 1042, "customer": "Wanjiku", "total": 1240, "paid": true},
    {"id": 1043, "customer": "Otieno", "total": 560, "paid": false}
  ],
  "page": 1,
  "total_pages": 3
}`;

const data = JSON.parse(responseText);            // text -> JavaScript objects
const unpaid = data.orders.filter(o => !o.paid);
console.log("Unpaid orders:", unpaid.map(o => o.id));
console.log("Total value:", data.orders.reduce((s, o) => s + o.total, 0));

const newOrder = { customer: "Amina", items: [{ productId: 17, qty: 2 }] };
console.log(JSON.stringify(newOrder));             // objects -> text to send in a request
```

JSON rules: keys in **double quotes**, strings in double quotes, no trailing commas, no comments. Values can be strings, numbers, `true`/`false`, `null`, arrays and objects.

## What a backend does with a request

```try-javascript
// A tiny simulated backend: route the request, check auth, validate, respond
const db = { products: [{ id: 1, name: "Unga 2kg", price: 180 }, { id: 2, name: "Sugar 1kg", price: 150 }] };
const tokens = { "secret-token-123": { userId: 7, role: "owner" } };

function handle(req) {
  const user = tokens[(req.headers.Authorization || "").replace("Bearer ", "")];
  if (!user) return { status: 401, body: { error: "Please sign in" } };

  if (req.method === "GET" && req.path === "/products") {
    return { status: 200, body: db.products };
  }
  if (req.method === "POST" && req.path === "/products") {
    if (user.role !== "owner") return { status: 403, body: { error: "Only owners can add products" } };
    const { name, price } = req.body || {};
    if (!name || typeof price !== "number" || price <= 0) return { status: 422, body: { error: "Name and a positive price are required" } };
    const product = { id: db.products.length + 1, name, price };
    db.products.push(product);
    return { status: 201, body: product };
  }
  return { status: 404, body: { error: "Not found" } };
}

const auth = { Authorization: "Bearer secret-token-123" };
console.log(handle({ method: "GET", path: "/products", headers: {} }));
console.log(handle({ method: "POST", path: "/products", headers: auth, body: { name: "Milk", price: -5 } }));
console.log(handle({ method: "POST", path: "/products", headers: auth, body: { name: "Milk 500ml", price: 60 } }));
console.log(handle({ method: "GET", path: "/orders", headers: auth }));
```

Real backends (PHP, Node.js, Python, Kotlin...) do exactly these steps: **route → authenticate → authorise → validate → do the work (database) → respond with a status code and JSON**.

## REST in short

**REST** is a style for APIs where URLs name **resources** (nouns) and methods say what to do:

| Good (REST) | Avoid |
|---|---|
| `GET /orders/1042` | `GET /getOrder?id=1042` |
| `POST /orders` | `POST /createNewOrder` |
| `GET /customers/7/orders` | `GET /ordersForCustomer?c=7` |

Other API styles you'll hear about: **GraphQL** (the client asks for exactly the fields it needs) and **webhooks** (the server calls *your* URL when something happens, like M-Pesa's payment callback).

```quiz
Q: Which HTTP method reads data?
A: GET
Q: Which HTTP method creates something new?
A: POST
Q: Which status code means "created"?
A: 201
Q: Which status code means the user isn't signed in or the token is bad?
A: 401
Q: Which status code means signed in but not allowed?
A: 403
Q: Which JavaScript function turns JSON text into objects?
A: JSON.parse | JSON.parse()
Q: A server calling your URL when something happens (like an M-Pesa payment) is called a ...?
A: webhook | callback
```
=== exercise ===
The server returned `{"items":[{"name":"Unga","qty":2,"price":180},{"name":"Milk","qty":3,"price":60}]}`. Parse it and print the **order total** (qty × price, added up). The answer is **540**.
=== starter ===
const text = '{"items":[{"name":"Unga","qty":2,"price":180},{"name":"Milk","qty":3,"price":60}]}';
// parse the JSON and print the total
=== expected ===
540
=== must_contain ===
JSON.parse
