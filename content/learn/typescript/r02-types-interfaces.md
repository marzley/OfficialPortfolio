---
slug: types-interfaces
title: "Types, interfaces and functions: object types, optional and readonly properties, unions, narrowing, generics and utility types"
after: KEEP
---
# Types, interfaces and functions: object types, optional and readonly properties, unions, narrowing, generics and utility types

Real programs work with **objects**: a customer with a name and phone, an order with items and a status, an API response with data and errors. TypeScript lets you describe the **shape** of these objects precisely, so the compiler can check every use. This unit covers type aliases and interfaces, optional and readonly properties, union and literal types, narrowing, function types, generics and the built-in utility types, all with examples drawn from typical business apps.

:::note What you will learn
- Object types with `type` and `interface`
- Optional (`?`) and `readonly` properties
- Arrays of objects and nested types
- Union types and literal types (like order statuses)
- Narrowing with typeof, in, equality and discriminated unions
- Function types and callbacks
- Interfaces vs type aliases
- Extending and combining types
- Generics for reusable code
- Utility types: Partial, Required, Pick, Omit, Record, Readonly
- Enums vs union types
:::

## Object types

```try-typescript
type Customer = {
  id: number;
  name: string;
  phone: string;
  email?: string;            // optional
  readonly createdAt: Date;  // can't be reassigned
};

const c: Customer = {
  id: 1,
  name: "Achieng Atieno",
  phone: "254712000003",
  createdAt: new Date("2026-08-01"),
};

// c.createdAt = new Date();   // error: Cannot assign to 'createdAt' because it is a read-only property
// c.nmae = "x";               // error: Property 'nmae' does not exist
console.log(c.name, c.email ?? "(no email)");
```

## Interfaces

`interface` is another way to describe object shapes:

```try-typescript
interface Product {
  id: number;
  name: string;
  category: "Accessories" | "Storage" | "Electronics";
  price: number;
  tags?: string[];
}

const catalogue: Product[] = [
  { id: 1, name: "Laptop bag", category: "Accessories", price: 2500 },
  { id: 2, name: "USB flash 32GB", category: "Storage", price: 900, tags: ["school"] },
  { id: 3, name: "Bluetooth speaker", category: "Electronics", price: 3500 },
];

const cheap = catalogue.filter((p) => p.price < 3000).map((p) => p.name);
console.log(cheap);
```

### Extending

```try-typescript
interface Person {
  name: string;
  phone: string;
}
interface Employee extends Person {
  staffNo: string;
  department: string;
}

type Timestamps = { createdAt: string; updatedAt: string };
type Student = Person & Timestamps & { admissionNo: string };   // intersection with &

const e: Employee = { name: "Kamau", phone: "254712000004", staffNo: "S-104", department: "Finance" };
const s: Student = { name: "Faith", phone: "254712000009", admissionNo: "ADM002", createdAt: "2026-01-10", updatedAt: "2026-09-01" };
console.log(e.department, s.admissionNo);
```

### interface or type?

| | `interface` | `type` |
|---|---|---|
| Object shapes | Yes | Yes |
| Unions (`A \| B`), tuples, primitives | No | Yes |
| Extending | `extends` | `&` intersections |
| Declaration merging | Yes (useful for libraries) | No |

Both are fine for objects; many teams use `interface` for objects and `type` for unions and other combinations. Be consistent.

## Union and literal types

```try-typescript
type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending": return "Waiting for payment";
    case "paid": return "Preparing your order";
    case "shipped": return "On the way";
    case "delivered": return "Delivered";
    case "cancelled": return "Cancelled";
  }
}

let s: OrderStatus = "paid";
// s = "refunded";   // error: not one of the allowed values
console.log(statusLabel(s));
```

Literal unions document allowed values and make typos impossible.

## Narrowing

When a value can be several types, check which one it is; TypeScript narrows the type inside each branch:

```try-typescript
function formatId(id: string | number): string {
  if (typeof id === "number") {
    return id.toString().padStart(5, "0");   // id is number here
  }
  return id.toUpperCase();                     // id is string here
}
console.log(formatId(42), formatId("adm002"));
```

### Discriminated unions

A shared literal property (the "discriminant") lets TypeScript narrow objects:

```try-typescript
type PaymentResult =
  | { status: "success"; receipt: string; amount: number }
  | { status: "failed"; reason: string }
  | { status: "pending"; checkoutId: string };

function describe(r: PaymentResult): string {
  switch (r.status) {
    case "success": return `Paid KSh ${r.amount} (receipt ${r.receipt})`;
    case "failed": return `Payment failed: ${r.reason}`;
    case "pending": return `Waiting for PIN (checkout ${r.checkoutId})`;
  }
}

const results: PaymentResult[] = [
  { status: "success", receipt: "QJK7RT61SV", amount: 1500 },
  { status: "failed", reason: "Insufficient balance" },
  { status: "pending", checkoutId: "ws_CO_123" },
];
results.forEach((r) => console.log(describe(r)));
```

This pattern models API responses, payment states and UI states safely: you can only access `receipt` when the status is `"success"`.

## Function types and callbacks

```try-typescript
type PriceRule = (price: number) => number;

const tenPercentOff: PriceRule = (p) => p * 0.9;
const addDelivery: PriceRule = (p) => p + 250;

function applyRules(price: number, rules: PriceRule[]): number {
  return rules.reduce((current, rule) => rule(current), price);
}

console.log(applyRules(5000, [tenPercentOff, addDelivery]));   // 4750
```

## Generics

**Generics** let you write reusable code that works with many types while keeping type safety. `T` is a placeholder for a type:

```try-typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([10, 20, 30]);          // number | undefined
const t = first(["Nairobi", "Kisumu"]); // string | undefined
console.log(n, t);

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

type Student = { admissionNo: string; name: string };

function handle<T>(res: ApiResponse<T>, show: (data: T) => string): string {
  return res.ok ? show(res.data) : "Error: " + res.error;
}

const good: ApiResponse<Student[]> = { ok: true, data: [{ admissionNo: "ADM001", name: "Brian" }] };
const bad: ApiResponse<Student[]> = { ok: false, error: "Server unavailable" };
console.log(handle(good, (list) => list.map((s) => s.name).join(", ")));
console.log(handle(bad, (list) => String(list.length)));
```

You already use generics: `Array<string>`, `Promise<User>`, `Map<string, number>`.

## Utility types

| Utility | Result | Use |
|---|---|---|
| `Partial<T>` | All properties optional | Update forms (send only changed fields) |
| `Required<T>` | All properties required | After validation |
| `Readonly<T>` | All properties readonly | Config, immutable state |
| `Pick<T, K>` | Only some properties | Public profile without private fields |
| `Omit<T, K>` | All except some | Create input without `id` |
| `Record<K, V>` | Object with keys K and values V | Lookups: `Record<string, number>` |

```try-typescript
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

type NewUser = Omit<User, "id">;                 // for sign-up forms
type PublicUser = Pick<User, "id" | "name">;     // safe to send to the browser
type UserUpdate = Partial<Omit<User, "id">>;      // edit profile: any subset

const update: UserUpdate = { name: "Wanjiku M." };
const stock: Record<string, number> = { unga: 40, sugar: 25 };
const pub: PublicUser = { id: 7, name: "Njeri" };
console.log(update, stock.unga, pub);
```

## Enums vs union types

TypeScript has `enum`, but many teams prefer **string literal unions** (simpler, no extra runtime code):

```typescript
enum Role { Admin = "admin", Teacher = "teacher", Parent = "parent" }   // generates a JS object
type RoleU = "admin" | "teacher" | "parent";                              // types only
```

Use unions by default; enums appear in older codebases and some frameworks.

:::think Design types for a school fees app: a Payment can be by M-Pesa (with a receipt number and phone), by bank (with a bank reference) or in cash (with the receiving clerk's name). All payments have an amount and a date. How would you model it?
A discriminated union: `type Payment = { amount: number; date: string } & ({ method: "mpesa"; receipt: string; phone: string } | { method: "bank"; reference: string } | { method: "cash"; clerk: string });`. A `switch (p.method)` then safely accesses the right fields for each method.
:::

## Summary

- Describe object shapes with `type` or `interface`; use `?` for optional and `readonly` for fixed properties.
- Extend interfaces with `extends` or combine types with `&`.
- Union and literal types restrict values (order statuses); narrowing with typeof and discriminated unions makes branches type-safe.
- Function types describe callbacks; generics write reusable, type-safe functions and types like `ApiResponse<T>`.
- Utility types (Partial, Required, Readonly, Pick, Omit, Record) transform types; prefer literal unions to enums.

```quiz
Q: Which symbol marks an object property as optional?
A: ?
Q: Which keyword lets one interface build on another?
A: extends
Q: Which utility type makes all properties optional?
A: Partial | Partial<T>
Q: Which utility type removes some properties from a type?
A: Omit | Omit<T, K>
Q: What is the placeholder T in function first<T>(items: T[]) called? (one word)
A: generic | type parameter | generic type
Q: A union of objects sharing a literal property like status is called a what union?
A: discriminated | discriminated union | tagged union
```
