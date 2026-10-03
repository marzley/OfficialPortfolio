---
slug: introduction
title: "TypeScript introduction: what it is, why teams use it, setup, basic types, type inference and compiling"
after: KEEP
---
# TypeScript introduction: what it is, why teams use it, setup, basic types, type inference and compiling

**TypeScript** is JavaScript with **types**. You write the same JavaScript you know, plus optional type annotations that say what kind of data each variable, parameter and return value should hold. A tool called the **TypeScript compiler** checks your code before it runs and catches mistakes like passing a string where a number is expected, misspelling a property name, or forgetting that a value might be `undefined`. Then it removes the types and outputs plain JavaScript that runs anywhere: browsers, Node.js, React Native apps.

TypeScript is used by most modern web teams: React, Angular, Vue and Next.js projects, Node.js back ends, and companies large and small. Many job adverts for front-end and full-stack developers list it as required.

:::note What you will learn
- What TypeScript is and how it relates to JavaScript
- Why teams use it: catching bugs early, better editor help, safer refactoring
- Who uses it and where
- Setting up: Node.js, tsc, tsconfig.json, VS Code, running TS directly
- Basic types: string, number, boolean, arrays, tuples, any, unknown, null/undefined
- Type inference
- Functions with typed parameters and return values
- Reading compiler errors
- How TypeScript compiles to JavaScript
:::

## JavaScript vs TypeScript

```javascript
// JavaScript: this bug only shows up when the code runs (maybe in front of a customer)
function totalPrice(price, qty) {
  return price * qty;
}
totalPrice("1500", 2);   // works by accident: "1500" * 2 = 3000
totalPrice("1,500", 2);  // NaN at runtime
```

```typescript
// TypeScript: the editor underlines the mistake before you run anything
function totalPrice(price: number, qty: number): number {
  return price * qty;
}
totalPrice("1,500", 2);  // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

TypeScript is a **superset** of JavaScript: every valid JavaScript program is (almost always) valid TypeScript. You can adopt it gradually.

## Why teams use TypeScript

| Benefit | Example |
|---|---|
| **Catch bugs before running** | Typos in property names, wrong argument types, missing return values |
| **Better editor support** | Auto-complete shows exactly which properties an object has; hover shows types |
| **Self-documenting code** | `function sendSms(phone: string, message: string): Promise<boolean>` explains itself |
| **Safer refactoring** | Rename a property and the compiler shows every place that must change |
| **Fewer runtime errors** | Especially "cannot read properties of undefined" |
| **Scales to big teams** | Clear contracts between parts of a large codebase |

Costs: a build step, learning the type system, and some extra typing. For anything beyond small scripts, most teams find it worth it.

## Who uses it and where

- **Front-end**: React, Angular (TypeScript by default), Vue, Svelte, Next.js apps.
- **Back-end**: Node.js APIs with Express, NestJS, Fastify; serverless functions.
- **Mobile**: React Native and Ionic apps.
- **Tools**: VS Code itself is written in TypeScript.

## Setting up

1. Install **Node.js** (LTS) from nodejs.org.
2. Install TypeScript in a project:

```bash
mkdir ts-practice && cd ts-practice
npm init -y
npm install --save-dev typescript
npx tsc --init          # creates tsconfig.json
```

3. Write `hello.ts`, then compile and run:

```bash
npx tsc hello.ts        # creates hello.js
node hello.js
```

Recent Node.js versions can also run many `.ts` files directly (type annotations are stripped, not checked), and tools like `tsx` run TypeScript quickly during development. Always run `tsc` (or your editor) to actually **check** types.

**VS Code** has TypeScript support built in: errors appear as red underlines as you type.

In this hub, the **Run** button runs TypeScript examples for you.

## Basic types

```try-typescript
let shopName: string = "Mama Mboga";
let stock: number = 42;
let isOpen: boolean = true;
let prices: number[] = [120, 450, 80];
let towns: Array<string> = ["Nairobi", "Kisumu"];
let coords: [number, number] = [-1.2921, 36.8219];   // tuple: fixed length and types

console.log(shopName, stock, isOpen);
console.log("Total of prices:", prices.reduce((a, b) => a + b, 0));
console.log("Lat/Lon:", coords[0], coords[1]);
```

| Type | Example |
|---|---|
| `string` | `"Nairobi"` |
| `number` | `42`, `3.14` (integers and decimals) |
| `boolean` | `true`, `false` |
| `number[]` / `Array<number>` | `[1, 2, 3]` |
| Tuple `[string, number]` | `["Unga", 195]` |
| `null`, `undefined` | Absence of a value |
| `any` | Turns off checking (avoid) |
| `unknown` | A safe "could be anything": you must check before using |
| `void` | A function returns nothing |
| `never` | Something that never happens (e.g. a function that always throws) |

## Type inference

You don't have to annotate everything. TypeScript **infers** types from values:

```try-typescript
let count = 10;          // inferred as number
let greeting = "Habari"; // inferred as string
// count = "ten";        // would be an error: Type 'string' is not assignable to type 'number'

const items = ["tea", "mandazi"];       // string[]
const total = items.length * 50;        // number
console.log(typeof count, typeof greeting, total);
```

A good rule: let TypeScript infer local variables, and add explicit types to **function parameters**, **return values** and **object shapes** (next lesson).

## Functions

```try-typescript
function vat(amount: number, rate: number = 0.16): number {
  return Math.round(amount * rate * 100) / 100;
}

function greet(name: string, title?: string): string {     // ? = optional parameter
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}

const formatKsh = (n: number): string => "KSh " + n.toLocaleString("en-KE");

console.log(vat(1000));
console.log(greet("Wanjiku"), "|", greet("Otieno", "Dr."));
console.log(formatKsh(2500000));
```

## any vs unknown

```try-typescript
function parseAmount(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input === "string") {
    const n = Number(input.replace(/,/g, ""));
    if (!Number.isNaN(n)) return n;
  }
  throw new Error("Not a valid amount");
}

console.log(parseAmount(1500), parseAmount("2,500"));
try {
  parseAmount({ value: 10 });
} catch (e) {
  console.log((e as Error).message);
}
```

With `unknown`, TypeScript forces you to check the type first (narrowing), which is safer than `any` (which allows anything and hides bugs).

## Null and undefined (strict mode)

With `"strict": true` in `tsconfig.json` (recommended), TypeScript makes you handle missing values:

```try-typescript
function findPrice(product: string): number | undefined {
  const prices: Record<string, number> = { unga: 195, sugar: 180 };
  return prices[product];
}

const p = findPrice("rice");
// console.log(p.toFixed(2));   // error: 'p' is possibly 'undefined'
console.log(p !== undefined ? p.toFixed(2) : "Price not found");
console.log(findPrice("unga") ?? 0);
```

`number | undefined` is a **union type**: the value is one of those types.

## Reading compiler errors

| Error message (shortened) | Meaning |
|---|---|
| `Type 'string' is not assignable to type 'number'` | Wrong type of value |
| `Property 'nmae' does not exist on type 'Customer'` | Typo or missing property |
| `Argument of type ... is not assignable to parameter of type ...` | Wrong argument passed |
| `Object is possibly 'undefined'` | Handle the missing case first |
| `Cannot find name 'x'` | Undeclared variable or missing import |

Errors include the file and line; hover in VS Code for details.

## How compilation works

```
app.ts  ──tsc──►  app.js   (types removed, modern syntax optionally converted for older browsers)
```

Types exist **only at development/compile time**. At runtime, it's plain JavaScript, so data from outside (forms, APIs) still needs validation (libraries like Zod help).

Key `tsconfig.json` options:

| Option | Purpose |
|---|---|
| `"strict": true` | Turn on the strongest checks (recommended) |
| `"target"` | Which JavaScript version to output (e.g. ES2020) |
| `"module"` | Module system (e.g. ESNext, NodeNext) |
| `"outDir"` | Where compiled JS goes |
| `"rootDir"` | Where your TS source lives |

:::think A colleague says, "TypeScript checked my code, so I don't need to validate data from the API." Why is that wrong?
TypeScript types are removed at runtime and can't check data that arrives while the program runs. If the API returns a different shape (missing fields, strings instead of numbers), your code can still crash. Validate external data at runtime (manual checks or a library like Zod) and then trust the types inside your code.
:::

## Summary

- TypeScript is JavaScript plus types, checked before running and compiled to plain JavaScript.
- It catches bugs early, improves editor help and makes large codebases safer; it's standard in modern web development.
- Set up with Node.js, `npm install -D typescript`, `npx tsc --init`, and VS Code; run `tsc` to check types.
- Basic types: string, number, boolean, arrays, tuples, unions, null/undefined, unknown (prefer over any), void, never.
- Rely on inference for locals, annotate function parameters/returns, use strict mode, and still validate runtime data.

```quiz
Q: TypeScript code is compiled into which language?
A: JavaScript | js
Q: Which type should you prefer over any for values of unknown type?
A: unknown
Q: Which symbol marks a function parameter as optional?
A: ?
Q: What tsconfig option turns on the strongest checks? (write it like "strict": true)
A: "strict": true | strict | strict: true | strict true
Q: What do you call a type like number | undefined? (two words)
A: union type | a union type | union
Q: Do TypeScript types exist at runtime? (yes/no)
A: no
```
