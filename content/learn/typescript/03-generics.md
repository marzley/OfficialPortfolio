---
slug: generics-utility-types
title: Generics and utility types
after: unions-narrowing
---
# Generics and utility types

Some code works the same way for many types: a list, a cache, an API response wrapper. **Generics** let you write it once while keeping full type safety. **Utility types** transform existing types so you don't repeat yourself.

## The problem generics solve

```typescript
function firstNumber(items: number[]): number | undefined { return items[0]; }
function firstString(items: string[]): string | undefined { return items[0]; }
// ...and again for every type? No.
```

## A generic function

`<T>` is a **type parameter**: a placeholder filled in when the function is used.

```try-typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const town = first(["Nakuru", "Nyeri"]);   // T is string
const price = first([180, 350]);           // T is number
console.log(town?.toUpperCase(), price?.toFixed(2));
```

TypeScript infers `T` from the argument, so `town` is known to be a string.

## Generic types and interfaces

```try-typescript
type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message?: string;
};

type Product = { id: number; name: string; price: number };

const productsRes: ApiResponse<Product[]> = {
  ok: true,
  data: [{ id: 1, name: "Unga 2kg", price: 180 }, { id: 2, name: "Oil 1L", price: 350 }],
};
const countRes: ApiResponse<number> = { ok: true, data: 42 };

console.log(productsRes.data.map((p) => p.name).join(", "), "|", countRes.data);
```

## Constraints: T must have certain properties

```try-typescript
function byId<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

const students = [{ id: 1, name: "Amina", form: 2 }, { id: 2, name: "Brian", form: 3 }];
console.log(byId(students, 2)?.name);
// byId([1, 2, 3], 1);   // Error: number doesn't have an id
```

`keyof` lets you accept only real property names:

```try-typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((i) => i[key]);
}
const products = [{ name: "Sugar", price: 160 }, { name: "Salt", price: 30 }];
console.log(pluck(products, "price"));        // number[]
// pluck(products, "colour");                 // Error: "colour" is not a key
```

## A generic class: a simple cache

```try-typescript
class Cache<T> {
  private store = new Map<string, { value: T; expires: number }>();
  constructor(private ttlMs: number) {}

  set(key: string, value: T): void {
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
  }
  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit || hit.expires < Date.now()) return undefined;
    return hit.value;
  }
}

const rates = new Cache<number>(60_000);   // cache exchange rates for a minute
rates.set("USD-KES", 129.5);
console.log(rates.get("USD-KES"), rates.get("EUR-KES"));
```

## Utility types: build new types from old ones

```try-typescript
type User = { id: number; name: string; email: string; phone: string; isAdmin: boolean };

type UserUpdate = Partial<User>;                     // every field optional
type PublicUser = Omit<User, "email" | "phone">;     // remove fields
type LoginForm = Pick<User, "email">;                // keep only some fields
type ReadonlyUser = Readonly<User>;                  // can't be changed
type RoleCounts = Record<"admin" | "staff" | "client", number>;

const patch: UserUpdate = { phone: "0712345678" };
const shown: PublicUser = { id: 1, name: "Amina", isAdmin: false };
const counts: RoleCounts = { admin: 1, staff: 4, client: 120 };
console.log(patch, shown, counts);
```

| Utility | Result |
|---|---|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | No property can be reassigned |
| `Pick<T, K>` | Only the listed keys |
| `Omit<T, K>` | Everything except the listed keys |
| `Record<K, V>` | An object with keys K and values V |
| `ReturnType<F>` | The type a function returns |
| `NonNullable<T>` | Removes `null` and `undefined` |

## When to use generics

Use them when the **same logic** works for many types and you want to keep the type information (collections, API wrappers, caches, form helpers). Don't add them "just because": a simple function with concrete types is easier to read.

## Why generics matter

Generics let you write one function, class or type that works for many data types while keeping full type safety. Without them, you either duplicate code (one function for products, another for students) or lose safety with `any`. Every serious TypeScript codebase uses generics: React's `useState<T>`, `Promise<T>`, `Array<T>`, API clients, form libraries and data stores. Understanding them lets you read library types and write reusable code.

## Generic API helper

```try-typescript
type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

async function fakeGet<T>(url: string, sample: T): Promise<ApiResponse<T>> {
  await new Promise(r => setTimeout(r, 10));
  if (url.includes("broken")) return { ok: false, error: "404 Not Found" };
  return { ok: true, data: sample };
}

type Product = { id: number; name: string; price: number };
type Student = { adm: string; name: string; form: number };

(async () => {
  const p = await fakeGet<Product[]>("/api/products", [{ id: 1, name: "Unga", price: 180 }]);
  if (p.ok) console.log(p.data[0].name, p.data[0].price);     // data is Product[]

  const s = await fakeGet<Student>("/api/students/1", { adm: "ADM001", name: "Baraka", form: 3 });
  if (s.ok) console.log(s.data.name, "Form", s.data.form);    // data is Student

  const bad = await fakeGet<Product[]>("/api/broken", []);
  if (!bad.ok) console.log("Error:", bad.error);
})();
```

One helper, fully typed for every endpoint.

## Multiple type parameters and defaults

```try-typescript
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p1 = pair("Nairobi", 4_400_000);      // [string, number]
const p2 = pair(true, ["a", "b"]);           // [boolean, string[]]
console.log(p1, p2);

type Paginated<T, Meta = { page: number; total: number }> = { items: T[]; meta: Meta };
const page: Paginated<string> = { items: ["Unga", "Sugar"], meta: { page: 1, total: 42 } };
console.log(page.meta.total);
```

## keyof and indexed access with generics

```try-typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const students = [
  { name: "Amina", form: 2, fees: 12000 },
  { name: "Brian", form: 3, fees: 0 },
];
console.log(pluck(students, "name"));    // string[]
console.log(pluck(students, "fees"));    // number[]
// pluck(students, "age");               // error: "age" is not a key

function sortBy<T>(items: T[], key: keyof T): T[] {
  return [...items].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));
}
console.log(sortBy(students, "fees").map(s => s.name));
```

`K extends keyof T` means "K must be one of T's property names", and `T[K]` is "the type of that property".

## A typed event emitter

```try-typescript
type Events = {
  paymentReceived: { receipt: string; amount: number };
  orderShipped: { orderId: number; courier: string };
};

class Emitter<E extends Record<string, unknown>> {
  private handlers: { [K in keyof E]?: ((payload: E[K]) => void)[] } = {};
  on<K extends keyof E>(event: K, fn: (payload: E[K]) => void) {
    (this.handlers[event] ??= []).push(fn);
  }
  emit<K extends keyof E>(event: K, payload: E[K]) {
    this.handlers[event]?.forEach(fn => fn(payload));
  }
}

const bus = new Emitter<Events>();
bus.on("paymentReceived", p => console.log(`Paid KSh ${p.amount} (${p.receipt})`));
bus.on("orderShipped", o => console.log(`Order ${o.orderId} shipped via ${o.courier}`));
bus.emit("paymentReceived", { receipt: "SJK4H2L9XA", amount: 1500 });
bus.emit("orderShipped", { orderId: 1024, courier: "G4S" });
// bus.emit("orderShipped", { orderId: 1 });   // error: courier missing
```

Event names and payloads are checked: a typo in an event name or a missing field is caught immediately.

## Mapped and conditional types

```try-typescript
type Product = { id: number; name: string; price: number; inStock: boolean };

// Make every property a form field with an error message
type FormErrors<T> = { [K in keyof T]?: string };
const errors: FormErrors<Product> = { price: "Price must be above 0" };

// Make every property readonly (like Readonly<T>)
type Frozen<T> = { readonly [K in keyof T]: T[K] };
const frozen: Frozen<Product> = { id: 1, name: "Unga", price: 180, inStock: true };

// Conditional type: pick only the keys whose values are numbers
type NumberKeys<T> = { [K in keyof T]: T[K] extends number ? K : never }[keyof T];
type ProductNumbers = NumberKeys<Product>;   // "id" | "price"
const k: ProductNumbers = "price";

console.log(errors, frozen.name, k);
```

These power the built-in utility types (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`).

## More built-in utility types

```try-typescript
async function loadUser() { return { id: 7, name: "Zawadi", roles: ["admin"] }; }

type User = Awaited<ReturnType<typeof loadUser>>;          // the resolved object type
type UserUpdate = Partial<Omit<User, "id">>;               // everything optional except id removed
type Contact = Required<{ phone?: string; email?: string }>;
type Status = Exclude<"draft" | "published" | "deleted", "deleted">;   // "draft" | "published"

const update: UserUpdate = { name: "Zawadi W." };
const contact: Contact = { phone: "0712000000", email: "z@example.co.ke" };
const st: Status = "published";
console.log(update, contact, st);
```

## When not to use generics

- If a function only ever handles one type, a plain type is clearer.
- Don't add type parameters that appear only once (e.g. `function log<T>(x: T): void`): `unknown` works the same.
- Readability matters: deeply nested conditional types can be hard for teammates to maintain.

## Practice

1. Write `last<T>(items: T[]): T | undefined`.
2. Write `indexBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T>`.
3. Create a generic `Cache<K, V>` class with get, set and has.
4. Define `FormValues<T>` that converts every property of T to `string` (form inputs are strings).
5. Use `ReturnType` and `Awaited` to type the result of an async function without repeating the type.

:::think Why is `function first<T>(items: T[]): T` better than `function first(items: any[]): any`?
With the generic version, TypeScript knows that `first(products)` returns a product and `first(names)` returns a string, so autocomplete works and mistakes are caught. With `any`, the result has no type information, so typos and wrong assumptions slip through to runtime.
:::

```quiz
Q: What is <T> in function first<T>() called? (two words)
A: type parameter | a type parameter | generic
Q: Which keyword limits T to types with certain properties?
A: extends
Q: Which utility type makes every property optional?
A: Partial | Partial<T>
Q: Which utility type removes some properties?
A: Omit | Omit<T, K>
Q: Which operator gives the union of an object type's property names?
A: keyof
Q: Which constraint means K must be one of T's property names? (K extends ...)
A: keyof T | K extends keyof T | keyof
Q: Which utility type gives the resolved type of a Promise?
A: Awaited
Q: Which utility type gives a function's return type?
A: ReturnType
```
