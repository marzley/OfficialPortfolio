---
slug: json-fetch
title: "JSON and fetch: exchanging data with servers and APIs"
after: KEEP
---
# JSON and fetch: exchanging data with servers and APIs

Modern websites and apps constantly exchange data with servers: loading products, sending orders, checking payment status, showing weather, searching. The format they almost always use is **JSON**, and the browser tool for sending and receiving it is **`fetch`**. This unit explains JSON completely, how HTTP requests work from JavaScript, how to use `fetch` for GET and POST, handle errors, and the security rules around APIs.

:::note What you will learn
- What JSON is, its rules, and how it differs from JavaScript objects
- `JSON.parse` and `JSON.stringify` (with pretty printing)
- What an API is and how client–server requests work
- `fetch` for GET and POST, headers and status codes
- Handling errors and loading states
- CORS, API keys and security
- Practising with simulated responses in this editor
:::

## What is JSON?

:::define JSON (JavaScript Object Notation)
A lightweight **text format** for storing and sending structured data, based on JavaScript object syntax. Almost every API (M-Pesa Daraja, weather services, social media, this website's chat) sends and receives JSON.
:::

```
{
  "name": "Bluetooth speaker",
  "price": 3500,
  "inStock": true,
  "tags": ["audio", "wireless"],
  "seller": { "shop": "Juma Electronics", "town": "Kisumu" },
  "discount": null
}
```

### JSON rules (stricter than JavaScript)

| Rule | JSON | JavaScript object |
|---|---|---|
| Keys | **Must** be in double quotes: `"name"` | Quotes optional |
| Strings | Double quotes only | Single, double or backticks |
| Allowed values | string, number, boolean, null, array, object | Also functions, `undefined`, dates... |
| Trailing commas | **Not allowed** | Allowed |
| Comments | **Not allowed** | Allowed |

JSON is **text**. To use it in JavaScript, you convert it to an object (parse); to send data, you convert an object to text (stringify).

## `JSON.parse` and `JSON.stringify`

```try-javascript
// Text from a server -> JavaScript object
const text = '{"name":"Speaker","price":3500,"tags":["audio","wireless"],"seller":{"town":"Kisumu"}}';
const product = JSON.parse(text);
console.log(product.name, product.price);
console.log(product.tags[1], product.seller.town);

// JavaScript object -> text to send
const order = { phone: "254712345678", items: [{ id: 17, qty: 2 }], total: 7000 };
const body = JSON.stringify(order);
console.log(body);
console.log(typeof body);          // "string"

// Pretty printing (2-space indentation) for logs and files
console.log(JSON.stringify(order, null, 2));
```

### Invalid JSON throws an error

```try-javascript
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.log("Invalid JSON:", err.message);
    return null;
  }
}

console.log(safeParse('{"ok": true}'));
console.log(safeParse("{ok: true}"));          // keys without quotes: invalid
console.log(safeParse('{"a": 1,}'));           // trailing comma: invalid
```

Always wrap `JSON.parse` of untrusted text in `try...catch`.

## APIs and requests

An **API** (Application Programming Interface) is a set of URLs (endpoints) on a server that programs can call to get or change data. For example:

| Method | Endpoint | Meaning |
|---|---|---|
| `GET` | `/api/products` | List products |
| `GET` | `/api/products/17` | One product |
| `POST` | `/api/orders` | Create an order |
| `PATCH` | `/api/orders/91` | Update an order |
| `DELETE` | `/api/cart/3` | Remove a cart item |

The browser sends a **request** (method, URL, headers, optional body); the server replies with a **response** (status code, headers, body, usually JSON). The **APIs & backends** subject teaches how to build these servers.

## `fetch`: GET requests

```
fetch("https://api.example.com/products")
  .then((response) => response.json())    // read the body as JSON (also async)
  .then((products) => console.log(products))
  .catch((error) => console.log("Network problem:", error));
```

`fetch` returns a **Promise** (a value that arrives later). The modern, cleaner way uses `async`/`await` (next unit):

```
async function loadProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Server error " + response.status);
  const products = await response.json();
  return products;
}
```

### Check `response.ok`

`fetch` only rejects (throws) on **network failure**. A 404 or 500 response still "succeeds" at the network level, so always check `response.ok` (true for status 200–299) or `response.status`.

## `fetch`: POST requests (sending data)

```
const response = await fetch("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: "254712345678", items: [{ id: 17, qty: 2 }] }),
});
const result = await response.json();
```

- `method`: `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.
- `headers`: tell the server you're sending JSON.
- `body`: the JSON text.
- For login sessions with cookies on the same site, cookies are sent automatically; for other sites add `credentials: "include"` (if the server allows it).

## Practising here with a simulated server

This editor runs in a locked sandbox, so it can't reach other websites. This example simulates a server with a delay, so you can practise the real pattern:

```try-javascript
// A fake "server": resolves with a Response-like object after a delay
const fakeDb = { 17: { id: 17, name: "Bluetooth speaker", price: 3500 } };

function fakeFetch(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = Number(url.split("/").pop());
      const product = fakeDb[id];
      resolve({
        ok: Boolean(product),
        status: product ? 200 : 404,
        json: async () => (product ? product : { error: "Product not found" }),
      });
    }, 300);
  });
}

async function showProduct(id) {
  console.log(`Loading product ${id}...`);
  try {
    const res = await fakeFetch(`/api/products/${id}`);
    const data = await res.json();
    if (!res.ok) {
      console.log(`Error ${res.status}: ${data.error}`);
      return;
    }
    console.log(`${data.name}: KSh ${data.price.toLocaleString()}`);
  } catch (err) {
    console.log("Network problem. Check your connection.");
  }
}

showProduct(17).then(() => showProduct(99));
```

## Showing loading, success and error states

Every data request needs four UI states:

1. **Loading:** spinner or skeleton, disable the button.
2. **Success with data:** show it.
3. **Empty:** "No products found".
4. **Error:** a friendly message and a "Try again" button.

```
button.disabled = true;
status.textContent = "Loading…";
try {
  const data = await loadProducts();
  render(data.length ? data : []);
  status.textContent = data.length ? "" : "No products yet.";
} catch {
  status.textContent = "We couldn't load products. Check your connection and try again.";
} finally {
  button.disabled = false;
}
```

:::kenya
Mobile connections drop and slow down often, especially in matatus or rural areas. Good apps set **timeouts**, show clear retry options, and keep the last loaded data visible instead of a blank screen. `AbortController` lets you cancel slow requests: `fetch(url, { signal: AbortSignal.timeout(10000) })` gives up after 10 seconds in modern browsers.
:::

## CORS: why some requests are blocked

Browsers block a page on one domain from reading responses from **another domain** unless that server allows it with CORS headers (`Access-Control-Allow-Origin`). That's why a request that works in Postman may fail in the browser. The fix is on the **server** (allow your domain) or calling your own backend, which then calls the other API.

## Security rules for APIs

- **Never put secret API keys in front-end JavaScript.** Anyone can open DevTools and read them. M-Pesa consumer secrets, passkeys and private keys must stay on your server; the browser calls your backend, and your backend calls Daraja.
- **Validate on the server.** The browser can send anything.
- **Use HTTPS** for all API calls.
- **Don't trust data from APIs blindly** when inserting into the page: use `textContent`, not `innerHTML`.

:::think A developer puts the M-Pesa consumer key and secret in app.js so the browser can request payments directly. What's the risk?
Anyone visiting the site can open DevTools, copy the keys and use them to make API calls as the business (and they may be able to misuse the account). Secrets belong only on the server. The browser should send the order to the developer's backend, which holds the keys and talks to Safaricom.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Treating JSON text as an object | `JSON.parse` it first |
| Single quotes or trailing commas in JSON | Double quotes, no trailing commas |
| Forgetting `await response.json()` | Reading the body is asynchronous |
| Not checking `response.ok` | 404/500 don't throw by themselves |
| Sending an object as body without stringify | `body: JSON.stringify(data)` with the JSON header |
| API secrets in front-end code | Keep them on the server |
| No loading/error states | Always show them |

## Practice tasks

1. Write JSON for a student with name, class, subjects (array) and a guardian object; parse it and print the guardian's phone.
2. Convert an array of 3 products to pretty-printed JSON.
3. Modify the fake fetch example to return a list of products and print the cheapest.
4. Write the `fetch` code (not runnable here) to POST a contact form `{ name, phone, message }` to `/api/contact`.
5. Explain in your own words why secrets can't live in front-end JavaScript.

## Summary

- **JSON** is the text format for data exchange: double-quoted keys and strings, no comments or trailing commas.
- `JSON.parse` turns text into objects (wrap in `try...catch`); `JSON.stringify` turns objects into text (`null, 2` for pretty output).
- APIs are server endpoints called with HTTP methods (GET, POST, PATCH, DELETE).
- `fetch` returns a Promise; check `response.ok`; read JSON with `await response.json()`; POST with method, headers and a JSON body.
- Handle loading, empty and error states; understand CORS; never expose secrets in front-end code.

```quiz
Q: What does JSON stand for? Write the full name.
A: JavaScript Object Notation | javascript object notation
Q: Which method turns JSON text into a JavaScript object?
A: JSON.parse | JSON.parse()
Q: Which method turns an object into JSON text?
A: JSON.stringify | JSON.stringify()
Q: Are trailing commas allowed in JSON? (yes or no)
A: no
Q: Which response property is true for status codes 200–299?
A: ok | response.ok
Q: Which HTTP method is used to create an order?
A: POST
Q: Should M-Pesa secrets be in front-end JavaScript? (yes or no)
A: no
```
=== exercise ===
Parse the JSON in `data` and print the **price** of the product. The output should be **3500**.
=== starter ===
const data = '{"name":"Speaker","price":3500}';
=== expected ===
3500
=== must_contain ===
JSON.parse
