---
slug: designing-rest-apis
title: Designing a good REST API
after: how-backends-work
---
# Designing a good REST API

An API is a contract between your backend and every app that uses it. A clear, consistent API makes mobile and web development faster and avoids bugs. Let's design the API for **Duka Connect** (the shop app from the App development fundamentals subject).

## Resources and URLs

```
GET    /v1/products                 list products (search, filter, paginate)
POST   /v1/products                 create a product
GET    /v1/products/{id}            one product
PATCH  /v1/products/{id}            update some fields
DELETE /v1/products/{id}            delete

GET    /v1/sales?date=2026-10-01    sales for a day
POST   /v1/sales                    record a sale
GET    /v1/reports/daily            today's totals

POST   /v1/auth/login               sign in, returns a token
POST   /v1/payments/mpesa/stk       start an M-Pesa payment
POST   /v1/payments/mpesa/callback  Safaricom's callback (not called by the app)
```

Conventions:

- **Plural nouns**, lowercase, hyphens: `/order-items`, not `/getOrderItems`.
- **Version** the API (`/v1/`) so you can change it later without breaking old app versions on users' phones.
- **Nest** only one level for clear ownership: `/customers/7/orders`.

## Consistent responses

Pick one shape and use it everywhere:

```json
{
  "data": [{ "id": 17, "name": "Unga 2kg", "price": 180, "stock": 12 }],
  "meta": { "page": 1, "per_page": 20, "total": 134 }
}
```

Errors:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Please check the highlighted fields.",
    "fields": { "price": "Price must be more than 0" }
  }
}
```

Apps can show `message` directly and highlight `fields`.

## Pagination, filtering and sorting

Never return thousands of rows at once (slow, expensive on mobile data):

```
GET /v1/products?page=2&per_page=20
GET /v1/products?q=unga&category=food&in_stock=1
GET /v1/products?sort=-price          (minus = descending)
```

```try-javascript
// Server-side pagination logic
function paginate(items, page = 1, perPage = 20) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  page = Math.min(Math.max(1, page), totalPages);           // keep page in range
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { page, per_page: perPage, total: items.length, total_pages: totalPages } };
}

const products = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: `Product ${i + 1}` }));
const result = paginate(products, 3, 20);
console.log(result.meta);
console.log(result.data.map(p => p.id));
```

## Validation: never trust the client

Validate **every** input on the server: types, required fields, lengths, ranges and formats. The app's validation is for convenience; anyone can send requests directly with tools like Postman.

```try-javascript
function validateProduct(input) {
  const errors = {};
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name.length < 2 || name.length > 80) errors.name = "Name must be 2 to 80 characters";
  if (!Number.isInteger(input.price) || input.price <= 0) errors.price = "Price must be a whole number above 0";
  if (input.stock !== undefined && (!Number.isInteger(input.stock) || input.stock < 0)) errors.stock = "Stock can't be negative";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: { name, price: input.price, stock: input.stock ?? 0 } };
}

console.log(validateProduct({ name: "Unga 2kg", price: 180 }));
console.log(validateProduct({ name: "U", price: -5, stock: -1 }));
console.log(validateProduct({ name: "Sugar", price: "150" }));     // a string price is rejected
```

## Security and reliability rules

| Rule | Why |
|---|---|
| HTTPS only | Protects tokens and data in transit |
| Authenticate every request (except public ones) | Know who's calling |
| **Authorise** per resource | Shop A must never read shop B's sales, even by guessing IDs |
| Rate-limit logins and expensive endpoints | Stops password guessing and abuse |
| Return generic error messages | Don't leak SQL errors or stack traces |
| Log errors with details on the server | So you can fix them |
| **Idempotency** for payments | A retried request must not charge twice (use an order ID or idempotency key) |
| Timestamps in ISO format with timezone | `2026-10-01T14:30:00+03:00` avoids confusion |
| Money as whole units (KSh) or cents in integers | Avoids floating-point rounding errors |

## Document your API

Write down every endpoint: method, URL, inputs, example response, errors. The **OpenAPI** (Swagger) format can generate interactive docs. Even a simple Markdown file in your repo saves hours for whoever builds the app (including future you).

```quiz
Q: Should API resource names be nouns or verbs?
A: nouns
Q: In /v1/products, what does the v1 part stand for?
A: version 1 | version one | version
Q: On which side must input always be validated?
A: server | the server | server side
Q: Making sure a retried payment request doesn't charge twice is called ...?
A: idempotency | idempotent
Q: Which format generates interactive API documentation?
A: OpenAPI | Swagger
Q: With 47 products and 20 per page, how many pages are there?
A: 3 | three
```
=== exercise ===
Write `isValidPhone(text)` that returns `true` for Kenyan mobile numbers like `0712345678` or `254712345678` (spaces allowed), and `false` otherwise. Print the result for `"0712 345 678"` and `"12345"`: the output should be `true` then `false`.
=== starter ===
function isValidPhone(text) {
  // remove non-digits, then test 0[17]XXXXXXXX or 254[17]XXXXXXXX
  return false;
}

console.log(isValidPhone("0712 345 678"));
console.log(isValidPhone("12345"));
=== expected ===
true
false
=== must_contain ===
function isValidPhone
