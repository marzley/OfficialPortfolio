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
```
