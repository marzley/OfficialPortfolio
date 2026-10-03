---
slug: classes-enums-modules
title: Classes, enums and organising a TypeScript project
after: generics-utility-types
---
# Classes, enums and organising a TypeScript project

TypeScript adds safety features to JavaScript classes, gives you enums for fixed sets of values, and has a compiler you configure per project. This lesson takes you from snippets to a real project setup.

## Classes with access modifiers

```try-typescript
class BankAccount {
  private balance = 0;                       // only inside this class
  readonly accountNo: string;                // set once, never changed

  constructor(public owner: string, accountNo: string) {   // "public owner" declares + assigns
    this.accountNo = accountNo;
  }

  deposit(amount: number): this {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.balance += amount;
    return this;
  }

  withdraw(amount: number): this {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
    return this;
  }

  get statement(): string {
    return `${this.owner} (${this.accountNo}): KSh ${this.balance.toLocaleString()}`;
  }
}

const acc = new BankAccount("Faith", "001-2233");
acc.deposit(10000).withdraw(2500);
console.log(acc.statement);
// acc.balance = 1_000_000;   // Error: 'balance' is private
// acc.accountNo = "x";       // Error: cannot assign to 'accountNo' because it is read-only
```

| Modifier | Accessible from |
|---|---|
| `public` (default) | Anywhere |
| `protected` | The class and subclasses |
| `private` | Only the class (JavaScript's `#field` is private at runtime too) |
| `readonly` | Can be read anywhere, assigned only once |

## Implementing interfaces and abstract classes

```try-typescript
interface Notifier {
  send(to: string, message: string): Promise<boolean>;
}

class SmsNotifier implements Notifier {
  async send(to: string, message: string) {
    console.log(`SMS to ${to}: ${message}`);
    return true;
  }
}

abstract class Shape {
  abstract area(): number;
  describe() { return `${this.constructor.name} with area ${this.area().toFixed(1)} m²`; }
}
class Rectangle extends Shape {
  constructor(private w: number, private h: number) { super(); }
  area() { return this.w * this.h; }
}
class Circle extends Shape {
  constructor(private r: number) { super(); }
  area() { return Math.PI * this.r ** 2; }
}

new SmsNotifier().send("0712345678", "Your order is ready").then(() => {
  [new Rectangle(4, 3), new Circle(1.5)].forEach((s) => console.log(s.describe()));
});
```

## Enums vs union types

```try-typescript
enum Role {
  Admin = "admin",
  Staff = "staff",
  Client = "client",
}

function canEditPrices(role: Role): boolean {
  return role === Role.Admin || role === Role.Staff;
}
console.log(canEditPrices(Role.Client), canEditPrices(Role.Admin), Role.Staff);

// The same idea with a union of literals (often preferred: no extra code is generated)
type Status = "pending" | "paid" | "delivered";
const s: Status = "paid";
console.log(s);
```

Use **string enums** or **literal unions**; avoid numeric enums without values (they're easy to misuse). Many teams prefer literal unions or `as const` objects because they're plain JavaScript.

```try-typescript
const PAYMENT = { MPESA: "mpesa", CARD: "card" } as const;
type Payment = (typeof PAYMENT)[keyof typeof PAYMENT];   // "mpesa" | "card"
const p: Payment = PAYMENT.MPESA;
console.log(p);
```

## Modules

Split code into files with `export` / `import`, exactly as in JavaScript. You can also export **types**:

```typescript
// types.ts
export type Product = { id: number; name: string; price: number };

// cart.ts
import type { Product } from "./types";
export function total(items: Product[]): number {
  return items.reduce((s, p) => s + p.price, 0);
}
```

## Setting up a real project

```bash
npm init -y
npm install -D typescript
npx tsc --init          # creates tsconfig.json
npx tsc                 # compile .ts files to .js
npx tsc --watch         # recompile on every save
```

Important `tsconfig.json` options:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "noUncheckedIndexedAccess": true
  }
}
```

- **Always turn on `"strict": true`**: it enables the checks that catch the most bugs (like forgetting that a value might be `undefined`).
- For apps, tools like **Vite** (front-end) or **tsx**/**Node's type stripping** (back-end) run TypeScript directly during development.

## Typing data from outside (APIs, forms)

TypeScript types disappear at runtime, so data from an API or form isn't *guaranteed* to match. Validate it (for example with the **Zod** library) at the boundary, then enjoy full type safety inside your app.

## Where classes and project setup matter

Classes are common in Angular apps, NestJS back ends, game code, SDKs and object-oriented domain models (orders, accounts, invoices). Even in function-heavy React code, you'll use classes from libraries and need to understand them. Knowing how to set up a real TypeScript project (tsconfig, strict mode, build and run scripts, typed external data) is what moves you from small exercises to production code.

## Parameter properties and getters

```try-typescript
class Invoice {
  private static nextNumber = 1001;
  readonly number: number;
  private lines: { item: string; qty: number; price: number }[] = [];

  constructor(public readonly customer: string, private vatRate = 0.16) {
    this.number = Invoice.nextNumber++;
  }

  add(item: string, qty: number, price: number): this {
    if (qty <= 0 || price < 0) throw new Error("Invalid line");
    this.lines.push({ item, qty, price });
    return this;
  }

  get subtotal(): number {
    return this.lines.reduce((s, l) => s + l.qty * l.price, 0);
  }
  get vat(): number {
    return Math.round(this.subtotal * this.vatRate * 100) / 100;
  }
  get total(): number {
    return this.subtotal + this.vat;
  }
  toString(): string {
    return `INV-${this.number} ${this.customer}: KSh ${this.total.toFixed(2)}`;
  }
}

const inv = new Invoice("Kamau Hardware").add("Cement 50kg", 10, 780).add("Nails 1kg", 3, 250);
console.log(String(inv));
console.log(inv.subtotal, inv.vat);
const inv2 = new Invoice("Wanjiru Salon", 0);
console.log(String(inv2.add("Hair dryer", 1, 4500)));
```

`public readonly customer` in the constructor creates and assigns the property in one step. Returning `this` allows chaining.

## private vs #private

| | `private` | `#private` |
|---|---|---|
| Checked by | TypeScript only (compile time) | JavaScript runtime |
| Visible in compiled JS | Yes (just a normal property) | No, truly hidden |
| Use | Most TypeScript code | When real runtime privacy matters (libraries) |

## Abstract classes and interfaces together

```try-typescript
interface Notifier {
  send(to: string, message: string): Promise<boolean>;
}

abstract class BaseNotifier implements Notifier {
  protected sent = 0;
  abstract send(to: string, message: string): Promise<boolean>;
  get count() { return this.sent; }
  protected log(channel: string, to: string, message: string) {
    this.sent++;
    console.log(`[${channel}] to ${to}: ${message}`);
  }
}

class SmsNotifier extends BaseNotifier {
  async send(to: string, message: string) {
    if (message.length > 160) return false;
    this.log("SMS", to, message);
    return true;
  }
}

class EmailNotifier extends BaseNotifier {
  async send(to: string, message: string) {
    this.log("Email", to, message);
    return true;
  }
}

(async () => {
  const channels: Notifier[] = [new SmsNotifier(), new EmailNotifier()];
  for (const c of channels) await c.send("customer", "Your order #1024 has shipped");
})();
```

Code that depends on the `Notifier` interface can use any channel, which makes testing easy (a fake notifier in tests).

## const enums, union types and as const

```try-typescript
const PaymentMethod = {
  Mpesa: "mpesa",
  Card: "card",
  Cash: "cash",
} as const;
type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];   // "mpesa" | "card" | "cash"

function fee(method: PaymentMethod, amount: number): number {
  return method === PaymentMethod.Card ? Math.round(amount * 0.03) : 0;
}

console.log(fee(PaymentMethod.Card, 2000), fee("mpesa", 2000));
console.log(Object.values(PaymentMethod));
```

The `as const` object pattern gives you named constants and a union type, works in plain JavaScript, and is popular as an alternative to enums.

## A production-ready tsconfig

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src"]
}
```

| Option | Effect |
|---|---|
| `strict` | Enables the core safety checks (null checks, no implicit any, and more) |
| `noUncheckedIndexedAccess` | `arr[0]` is `T | undefined`: forces you to handle missing items |
| `noImplicitOverride` | Requires `override` keyword in subclasses: catches typos |
| `sourceMap` | Error stack traces point to your `.ts` lines |

Front-end projects using Vite set many of these for you (`npm create vite@latest` → a TypeScript template).

## Validating external data at runtime

Types disappear at runtime, so data from APIs, forms and `localStorage` must be checked. Libraries like **Zod** define a schema once and give you both validation and a type:

```typescript
import { z } from "zod";

const OrderSchema = z.object({
  id: z.number(),
  phone: z.string().regex(/^2547\d{8}$/),
  amount: z.number().positive(),
  status: z.enum(["pending", "paid", "cancelled"]),
});
type Order = z.infer<typeof OrderSchema>;

const result = OrderSchema.safeParse(await res.json());
if (!result.success) {
  console.error(result.error.issues);
} else {
  const order: Order = result.data;   // safe to use
}
```

## Project structure and scripts

```
my-api/
├── src/
│   ├── index.ts
│   ├── routes/orders.ts
│   ├── services/payments.ts
│   └── types.ts
├── tests/
├── package.json
└── tsconfig.json
```

```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "typecheck": "tsc --noEmit",
  "test": "vitest"
}
```

Run `npm run typecheck` in CI (e.g. GitHub Actions) so type errors block merging.

## Practice

1. Build a `BankAccount` class with a `#balance`, deposit/withdraw methods and a transactions getter.
2. Create an interface `Storage<T>` with get/set and two implementations: in-memory and (in the browser) localStorage.
3. Replace an enum with the `as const` object pattern.
4. Set up a Node + TypeScript project with `strict` and `noUncheckedIndexedAccess`, and fix the errors it reveals.
5. Write a Zod schema for a student record and validate sample data.

:::think Your TypeScript types say an API returns `{ amount: number }`, but in production the app crashes because the API sometimes sends `"amount": "1500"` (a string). Why didn't TypeScript catch it, and how do you prevent it?
TypeScript types are erased at compile time and only describe what you assume; they don't check real data arriving at runtime. Validate external data at the boundary with a schema library (Zod, Valibot) or manual checks, convert or reject bad values, and only then treat the data as your typed model.
:::

```quiz
Q: Which modifier makes a property visible only inside its class?
A: private
Q: Which modifier allows a property to be assigned only once?
A: readonly
Q: Which keyword makes a class follow an interface?
A: implements
Q: Which tsconfig option turns on all the important safety checks?
A: strict | "strict": true
Q: Which command creates a tsconfig.json file?
A: npx tsc --init | tsc --init
Q: Which keyword in a constructor parameter creates and assigns a property automatically? (one of)
A: public | private | readonly | protected
Q: Which tsconfig option makes arr[0] possibly undefined?
A: noUncheckedIndexedAccess
Q: Which library is popular for runtime validation that also produces TypeScript types?
A: Zod
```
