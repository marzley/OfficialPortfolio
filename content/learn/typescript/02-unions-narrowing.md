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

## Why unions and narrowing matter

Real data comes in different shapes: a payment can be M-Pesa or card, an API call can succeed or fail, a form field can be empty or filled, a user can be a guest or logged in. Union types describe these possibilities exactly, and narrowing forces your code to handle each case. This removes whole classes of bugs, like reading a property that doesn't exist or forgetting to handle an error state, which is why React and Node teams lean on these features heavily.

## Exhaustive checking with never

When you add a new case to a union, TypeScript can tell you every place that doesn't handle it yet:

```try-typescript
type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

function statusLabel(s: OrderStatus): string {
  switch (s) {
    case "pending": return "Waiting for payment";
    case "paid": return "Preparing your order";
    case "shipped": return "On the way";
    case "delivered": return "Delivered";
    case "cancelled": return "Cancelled";
    default: {
      const unreachable: never = s;     // error here if a status isn't handled
      return unreachable;
    }
  }
}

const all: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];
all.forEach(s => console.log(s.padEnd(10), statusLabel(s)));
```

If someone adds `"refunded"` to `OrderStatus`, the `never` line becomes a compile error until the new case is handled.

## Narrowing with in and instanceof

```try-typescript
type Teacher = { name: string; subjects: string[] };
type Student = { name: string; form: number };

function describe(person: Teacher | Student): string {
  if ("subjects" in person) return `${person.name} teaches ${person.subjects.join(", ")}`;
  return `${person.name} is in Form ${person.form}`;
}
console.log(describe({ name: "Mr Otieno", subjects: ["Maths", "Physics"] }));
console.log(describe({ name: "Neema", form: 3 }));

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unknown error";
}
console.log(messageOf(new Error("Network timeout")), "|", messageOf("Bad input"), "|", messageOf(42));
```

## Modelling UI states with discriminated unions

Instead of several booleans (`isLoading`, `hasError`, `data`) that can contradict each other, use one union:

```try-typescript
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function render(state: LoadState<string[]>): string {
  switch (state.status) {
    case "idle": return "Press Search to begin";
    case "loading": return "Loading...";
    case "success": return state.data.length ? state.data.join(", ") : "No results";
    case "error": return `Error: ${state.message}`;
  }
}

const states: LoadState<string[]>[] = [
  { status: "idle" },
  { status: "loading" },
  { status: "success", data: ["Nairobi", "Nakuru"] },
  { status: "error", message: "No internet connection" },
];
states.forEach(s => console.log(render(s)));
```

It's impossible to have `data` while in the "error" state, so whole categories of UI bugs disappear.

## Result types for errors without exceptions

```try-typescript
type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

function parseAmount(text: string): Result<number> {
  const n = Number(text.replace(/,/g, "").trim());
  if (!Number.isFinite(n)) return { ok: false, error: `"${text}" is not a number` };
  if (n <= 0) return { ok: false, error: "Amount must be above 0" };
  return { ok: true, value: n };
}

for (const input of ["1,500", "abc", "-20", "250"]) {
  const r = parseAmount(input);
  console.log(r.ok ? `OK: ${r.value}` : `Error: ${r.error}`);
}
```

The caller must check `r.ok` before reading `r.value`, so errors can't be ignored by accident.

## Template literal types

```try-typescript
type Size = "sm" | "md" | "lg";
type Variant = "primary" | "outline";
type ButtonClass = `btn-${Variant}-${Size}`;     // 6 combinations

const cls: ButtonClass = "btn-primary-md";
console.log(cls);

type Currency = "KES" | "USD";
type PriceKey = `price_${Lowercase<Currency>}`;   // "price_kes" | "price_usd"
const prices: Record<PriceKey, number> = { price_kes: 2500, price_usd: 19 };
console.log(prices);
```

## The satisfies operator

`satisfies` checks that a value matches a type while keeping its precise inferred type:

```try-typescript
type Town = "Nairobi" | "Mombasa" | "Kisumu";
const deliveryFees = {
  Nairobi: 200,
  Mombasa: 450,
  Kisumu: 400,
} satisfies Record<Town, number>;

console.log(deliveryFees.Mombasa + 50);
```

If a town is missing or misspelled, TypeScript reports it, yet `deliveryFees` keeps exact keys for autocomplete.

## Common mistakes

| Mistake | Fix |
|---|---|
| Several booleans for one state | One discriminated union |
| Using `as` to force a type | Narrow with checks or validate |
| Forgetting a case in a switch | Add a `never` exhaustive check |
| `typeof x === "array"` | `Array.isArray(x)` |
| `typeof null === "object"` surprises | Check `x !== null` first |

## Practice

1. Model a form field as `{ state: "empty" } | { state: "invalid"; reason: string } | { state: "valid"; value: string }` and render each.
2. Add `"refunded"` to `OrderStatus` and fix the error the `never` check reports.
3. Write `parsePhone(text): Result<string>` that normalises to 2547XXXXXXXX or returns an error.
4. Create a template literal type for CSS spacing classes like `mt-1` to `mt-4`.
5. Use `satisfies` to type a config object of payment methods and their fees.

:::think Why is `{ status: "success"; data: T } | { status: "error"; message: string }` safer than `{ loading: boolean; error?: string; data?: T }`?
The boolean/optional version allows impossible combinations (loading with an error and data at the same time) and forces checks everywhere. The discriminated union allows only valid states, and TypeScript narrows automatically on `status`, so you can only read `data` when it actually exists.
:::

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
Q: Which type is used in a default branch to check that every union case is handled?
A: never
Q: Which operator checks whether a property exists on an object to narrow a union?
A: in
Q: Which operator checks a value against a type while keeping its precise inferred type?
A: satisfies
```
