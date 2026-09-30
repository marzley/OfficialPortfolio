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
```
