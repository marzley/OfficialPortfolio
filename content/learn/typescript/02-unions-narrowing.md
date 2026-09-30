---
slug: unions-narrowing
title: Union types, literal types and narrowing
after: typed-functions
---
# Union types, literal types and narrowing

Real data isn't always one type. A phone number might arrive as a string or a number; a payment might be M-Pesa or card; an API call might succeed or fail. **Union types** describe "this or that", and **narrowing** lets TypeScript know which one you have.

## Union types

```try-typescript
function normalisePhone(phone: string | number): string {
  const s = String(phone).replace(/\D/g, "");
  return s.startsWith("254") ? "0" + s.slice(3) : s.padStart(10, "0");
}
console.log(normalisePhone("+254 712 345 678"), normalisePhone(712345678));
```

## Literal types: only these exact values

```try-typescript
type PaymentMethod = "mpesa" | "card" | "cash";
type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

function label(status: OrderStatus): string {
  switch (status) {
    case "pending": return "⏳ Waiting for payment";
    case "paid": return "✅ Paid";
    case "delivered": return "📦 Delivered";
    case "cancelled": return "❌ Cancelled";
  }
}

const method: PaymentMethod = "mpesa";
// const bad: PaymentMethod = "bitcoin";   // Error: not one of the allowed values
console.log(method, label("paid"));
```

Literal types stop typos like `"payed"` from ever reaching production.

## Narrowing: telling TypeScript which type you have

TypeScript follows your `if` checks and **narrows** the type inside each branch.

```try-typescript
function describe(value: string | number | boolean | null): string {
  if (value === null) return "nothing";
  if (typeof value === "string") return `text of length ${value.length}`;   // value: string here
  if (typeof value === "number") return `number ${value.toFixed(2)}`;      // value: number here
  return value ? "yes" : "no";                                            // value: boolean here
}
console.log(describe("Karibu"), "|", describe(3.14159), "|", describe(true), "|", describe(null));
```

Ways to narrow:

| Check | Example |
|---|---|
| `typeof` | `typeof x === "string"` |
| Equality | `x === null`, `status === "paid"` |
| Truthiness | `if (user) { ... }` |
| `in` | `"amount" in payment` |
| `instanceof` | `err instanceof Error` |
| Array check | `Array.isArray(x)` |

## Discriminated unions: the most useful pattern

Give each shape a common **tag** property, then `switch` on it:

```try-typescript
type Mpesa = { kind: "mpesa"; phone: string; receipt: string };
type Card = { kind: "card"; last4: string; brand: "Visa" | "Mastercard" };
type Cash = { kind: "cash" };
type Payment = { amount: number } & (Mpesa | Card | Cash);

function receiptLine(p: Payment): string {
  switch (p.kind) {
    case "mpesa": return `KSh ${p.amount} via M-Pesa (${p.receipt}) from ${p.phone}`;
    case "card":  return `KSh ${p.amount} via ${p.brand} ending ${p.last4}`;
    case "cash":  return `KSh ${p.amount} cash`;
  }
}

const payments: Payment[] = [
  { kind: "mpesa", amount: 1500, phone: "0712345678", receipt: "SJK4H2L9XA" },
  { kind: "card", amount: 2500, last4: "4242", brand: "Visa" },
  { kind: "cash", amount: 300 },
];
payments.forEach((p) => console.log(receiptLine(p)));
```

Inside `case "mpesa"`, TypeScript knows `p.receipt` exists. If you later add a new payment kind and forget to handle it, TypeScript warns you.

## Handling API results safely

```try-typescript
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function parseAmount(input: string): Result<number> {
  const n = Number(input);
  return Number.isFinite(n) && n > 0 ? { ok: true, data: n } : { ok: false, error: `"${input}" is not a valid amount` };
}

for (const x of ["1500", "abc", "-5"]) {
  const r = parseAmount(x);
  console.log(r.ok ? `OK: ${r.data}` : `Error: ${r.error}`);
}
```

## Optional chaining and nullish coalescing

```try-typescript
type Customer = { name: string; address?: { town?: string } };
const c: Customer = { name: "Brian" };
console.log(c.address?.town ?? "Town not given");
```

```quiz
Q: A union type like string | number uses which symbol? Name it in words.
A: pipe | vertical bar | bar
Q: What kind of type allows only exact values like "mpesa" | "card"? (two words)
A: literal type | literal types | literal
Q: Which operator checks a primitive type, like "string"?
A: typeof
Q: What is a union of object types with a shared tag property called? (two words)
A: discriminated union | tagged union | discriminated unions
Q: Which operator gives a default when a value is null or undefined?
A: ?? | nullish coalescing
```
