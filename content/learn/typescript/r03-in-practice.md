---
slug: typescript-in-practice
title: "TypeScript in real projects: classes, modules, async APIs, runtime validation, React and Node.js, tsconfig and migrating JavaScript"
after: KEEP
---
# TypeScript in real projects: classes, modules, async APIs, runtime validation, React and Node.js, tsconfig and migrating JavaScript

Knowing types is the start; using TypeScript well in real projects is the goal. This unit covers what you'll do daily in a TypeScript codebase: organising code with modules, writing classes, calling APIs with async/await and typed responses, validating data that arrives at runtime, typing React components and Node.js/Express APIs, configuring `tsconfig.json`, using third-party libraries, and migrating an existing JavaScript project gradually.

:::note What you will learn
- Modules: import/export and project structure
- Classes, access modifiers and implementing interfaces
- Async/await, Promises and typed fetch calls
- Runtime validation with type guards and Zod
- Error handling patterns
- Typing React components, props, state and events
- Typing a Node.js/Express API
- tsconfig essentials and strict mode
- Using libraries and @types packages
- Migrating JavaScript to TypeScript step by step
- Tooling: ESLint, Prettier, tests and CI
:::

## Modules and project structure

Split code into files and share with `export`/`import`:

```typescript
// src/types.ts
export interface Product { id: number; name: string; price: number }

// src/utils/money.ts
export function formatKsh(n: number): string {
  return "KSh " + n.toLocaleString("en-KE");
}

// src/index.ts
import type { Product } from "./types";
import { formatKsh } from "./utils/money";
const p: Product = { id: 1, name: "Laptop bag", price: 2500 };
console.log(p.name, formatKsh(p.price));
```

`import type` imports only types (removed at compile time). A typical structure:

```
src/
  types/       shared interfaces and types
  services/    API calls, payments, database access
  utils/       helpers (formatting, validation)
  components/  React components (front end)
  routes/      API routes (back end)
tests/
tsconfig.json
package.json
```

## Classes

```try-typescript
interface Payable {
  pay(amount: number): string;
}

class Wallet implements Payable {
  private balance: number;              // only accessible inside the class
  constructor(public owner: string, opening = 0) {   // 'public owner' creates a property
    this.balance = opening;
  }
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.balance += amount;
  }
  pay(amount: number): string {
    if (amount > this.balance) return `${this.owner}: insufficient balance`;
    this.balance -= amount;
    return `${this.owner} paid KSh ${amount}. Balance KSh ${this.balance}`;
  }
  get currentBalance(): number { return this.balance; }
}

const w = new Wallet("Wanjiku", 1000);
w.deposit(500);
console.log(w.pay(1200));
console.log(w.pay(800));
console.log(w.currentBalance);
// w.balance = 999999;   // error: 'balance' is private
```

Access modifiers: `public` (default), `private`, `protected` (class and subclasses), `readonly`.

## Async code and typed API calls

```try-typescript
type Student = { admissionNo: string; name: string; balance: number };

// A fake API so the example runs anywhere
function fakeFetchStudents(): Promise<Student[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([
      { admissionNo: "ADM001", name: "Brian", balance: 12500 },
      { admissionNo: "ADM002", name: "Faith", balance: 0 },
    ]), 100));
}

async function studentsWithArrears(): Promise<string[]> {
  const students = await fakeFetchStudents();
  return students.filter((s) => s.balance > 0).map((s) => `${s.name} owes KSh ${s.balance}`);
}

studentsWithArrears().then((list) => console.log(list));
```

With real `fetch`, the response JSON is untyped (`any`), so **validate** before trusting it:

```typescript
async function getStudents(): Promise<Student[]> {
  const res = await fetch("/api/students");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: unknown = await res.json();
  return parseStudents(data);      // runtime validation (below)
}
```

## Runtime validation

### Type guards

```try-typescript
type Student = { admissionNo: string; name: string; balance: number };

function isStudent(x: unknown): x is Student {
  return typeof x === "object" && x !== null &&
    typeof (x as Student).admissionNo === "string" &&
    typeof (x as Student).name === "string" &&
    typeof (x as Student).balance === "number";
}

const fromApi: unknown[] = [
  { admissionNo: "ADM001", name: "Brian", balance: 12500 },
  { admissionNo: "ADM003", name: "Juma", balance: "unknown" },   // bad data
];
for (const item of fromApi) {
  console.log(isStudent(item) ? `OK: ${item.name}` : "Rejected invalid record");
}
```

`x is Student` tells TypeScript that if the function returns true, `x` is a `Student`.

### Zod (popular validation library)

```typescript
import { z } from "zod";

const StudentSchema = z.object({
  admissionNo: z.string(),
  name: z.string().min(1),
  balance: z.number().nonnegative(),
});
type Student = z.infer<typeof StudentSchema>;     // the type comes from the schema

const result = StudentSchema.safeParse(dataFromApi);
if (!result.success) console.error(result.error.issues);
```

One schema gives both runtime validation and the TypeScript type: great for API inputs, forms and environment variables.

## Error handling

In `catch`, the error is `unknown` (in strict mode), so check it:

```try-typescript
function risky(n: number): number {
  if (n < 0) throw new Error("Negative values not allowed");
  return Math.sqrt(n);
}

try {
  console.log(risky(16));
  console.log(risky(-1));
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.log("Caught:", message);
}

// A Result type avoids exceptions for expected failures
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
function safeDivide(a: number, b: number): Result<number> {
  return b === 0 ? { ok: false, error: "Division by zero" } : { ok: true, value: a / b };
}
const r = safeDivide(10, 0);
console.log(r.ok ? r.value : r.error);
```

## TypeScript with React

```tsx
type ProductCardProps = {
  name: string;
  price: number;
  onAdd: (name: string) => void;
  badge?: string;
};

export function ProductCard({ name, price, onAdd, badge }: ProductCardProps) {
  const [qty, setQty] = useState<number>(1);
  return (
    <div className="card">
      {badge && <span className="badge">{badge}</span>}
      <h3>{name}</h3>
      <p>KSh {price.toLocaleString()}</p>
      <input type="number" value={qty}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQty(Number(e.target.value))} />
      <button onClick={() => onAdd(name)}>Add to cart</button>
    </div>
  );
}
```

Props types catch missing or wrong props wherever the component is used. Create projects with Vite's React + TypeScript template (`npm create vite@latest`) or Next.js (TypeScript by default). See the React subject.

## TypeScript with Node.js and Express

```typescript
import express, { Request, Response } from "express";

type CreateOrder = { productId: number; qty: number; phone: string };

const app = express();
app.use(express.json());

app.post("/orders", (req: Request<{}, {}, CreateOrder>, res: Response) => {
  const { productId, qty, phone } = req.body;      // typed, but still validate (e.g. Zod)
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: "qty must be a positive integer" });
  }
  res.status(201).json({ ok: true, productId, qty, phone });
});

app.listen(3000);
```

Install types for libraries that don't include them: `npm install -D @types/express @types/node`.

## tsconfig essentials

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

Front-end frameworks generate a suitable tsconfig for you; mainly ensure `strict` is on.

## Libraries and @types

- Many packages ship their own types (look for a "TS" badge on npm).
- Others have community types in **DefinitelyTyped**: `npm install -D @types/packagename`.
- If no types exist, declare a minimal module (`declare module "old-lib";`) and add types gradually.

## Migrating JavaScript to TypeScript

1. Add TypeScript and a tsconfig with `"allowJs": true` and `"checkJs": false`.
2. Rename files one at a time from `.js` to `.ts` (or `.jsx` to `.tsx`), starting with shared utilities.
3. Fix errors; use `unknown` and narrowing rather than `any` where possible.
4. Add types for core data (API responses, database models).
5. Turn on `strict` (or its individual flags) once most files are converted.
6. Add type checking (`tsc --noEmit`) to CI so errors can't be merged.

## Tooling

| Tool | Purpose |
|---|---|
| **ESLint** with typescript-eslint | Catch bad patterns |
| **Prettier** | Consistent formatting |
| **Vitest / Jest** | Unit tests (types don't replace tests) |
| **tsc --noEmit** in CI | Fail builds on type errors (see the GitHub Actions lesson) |

:::think Your team's Express API receives JSON orders. A developer typed `req.body` as `CreateOrder` and assumes qty is always a positive number. Why can this still crash, and what's the best fix?
Typing `req.body` only tells the compiler what you expect; clients can send anything (missing fields, strings, negatives). Validate at runtime with a schema (e.g. Zod `safeParse`), return 400 on invalid input, and use the inferred type afterwards so the rest of the code is genuinely safe.
:::

## Summary

- Organise code with modules (`export`/`import`, `import type`) and a clear folder structure.
- Classes support access modifiers and `implements` interfaces; async functions return typed Promises.
- Validate external data at runtime with type guards or Zod; handle `unknown` errors safely.
- Type React props, state and events, and Express requests/responses; install @types for untyped libraries.
- Keep `strict` on, migrate JS gradually, and add ESLint, tests and `tsc --noEmit` to CI.

```quiz
Q: Which keyword imports only types, removed at compile time? (two words)
A: import type
Q: Which access modifier makes a class property usable only inside the class?
A: private
Q: What does a function returning "x is Student" act as? (two words)
A: type guard | a type guard
Q: Which library lets one schema provide both runtime validation and a TypeScript type?
A: Zod
Q: Which npm scope provides community type definitions for libraries?
A: @types | types
Q: What command checks types without producing output files?
A: tsc --noEmit | npx tsc --noEmit
```
