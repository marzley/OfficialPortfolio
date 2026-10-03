---
slug: typed-functions
title: Typed functions, optional and default parameters
after: types-interfaces
---
# Typed functions, optional and default parameters

Functions are where most bugs hide: wrong argument types, missing arguments, unexpected return values. TypeScript lets you describe exactly what goes in and what comes out.

> Our editor runs TypeScript by removing the types and running the JavaScript, so it won't show type errors. To see type checking, use the TypeScript Playground (typescriptlang.org/play) or VS Code, which underline mistakes as you type.

## Parameter and return types

```try-typescript
function withVat(amount: number, rate: number): number {
  return Math.round(amount * (1 + rate / 100));
}

const formatKsh = (n: number): string => "KSh " + n.toLocaleString("en-KE");

console.log(formatKsh(withVat(1500, 16)));
// withVat("1500", 16);   // Error in the editor: string is not assignable to number
```

TypeScript can often **infer** the return type, but writing it for important functions documents your intent and catches mistakes inside the function.

## Optional and default parameters

```try-typescript
function greet(name: string, title?: string): string {    // ? = optional
  return title ? `Habari ${title} ${name}` : `Habari ${name}`;
}

function deliveryFee(km: number, perKm: number = 30, minimum = 150): number {
  return Math.max(minimum, km * perKm);
}

console.log(greet("Wanjiru"), "|", greet("Otieno", "Dr."));
console.log(deliveryFee(3), deliveryFee(12), deliveryFee(12, 25));
```

- `title?: string` means the type is `string | undefined`.
- Optional parameters must come **after** required ones.
- Defaults (`perKm = 30`) make a parameter optional and TypeScript infers its type.

## Rest parameters

```try-typescript
function total(...amounts: number[]): number {
  return amounts.reduce((sum, a) => sum + a, 0);
}
console.log(total(100, 250, 75));
```

## Object parameters with types

```try-typescript
type Order = {
  item: string;
  qty: number;
  price: number;
  delivery?: boolean;
};

function orderTotal({ qty, price, delivery = false }: Order): number {
  return qty * price + (delivery ? 200 : 0);
}

console.log(orderTotal({ item: "Cake", qty: 2, price: 1800, delivery: true }));
// orderTotal({ item: "Cake", qty: 2 });   // Error: property 'price' is missing
```

## Function types

You can describe the **shape** of a function, useful for callbacks:

```try-typescript
type PriceRule = (amount: number) => number;

const blackFriday: PriceRule = (a) => a * 0.7;
const loyalty: PriceRule = (a) => a - 100;

function applyRules(amount: number, rules: PriceRule[]): number {
  return rules.reduce((a, rule) => rule(a), amount);
}
console.log(applyRules(2000, [blackFriday, loyalty]));
```

## void and never

- `void`: the function returns nothing useful.
- `never`: the function never returns (it always throws or loops forever).

```try-typescript
function log(message: string): void {
  console.log(`[${new Date().toISOString().slice(0, 10)}] ${message}`);
}

function fail(message: string): never {
  throw new Error(message);
}

log("Server started");
try { fail("Payment gateway down"); } catch (e) { console.log((e as Error).message); }
```

## Overloads (briefly)

When a function accepts different argument shapes, you can declare several signatures. Most of the time, a **union type** (next lesson) is simpler.

## Why typed functions matter

Functions are where most bugs hide: called with the wrong arguments, returning `undefined` by accident, or receiving a string where a number was expected (very common with form inputs and API data). Typed functions document themselves, let your editor autocomplete correctly, and catch mistakes before the code ever runs. Teams building React apps, Node APIs, Angular projects and mobile apps with React Native rely on this every day.

## Typing callbacks

Many functions take other functions as arguments: event handlers, array methods, API helpers.

```try-typescript
type Product = { name: string; price: number; inStock: boolean };

function filterProducts(items: Product[], test: (p: Product) => boolean): Product[] {
  return items.filter(test);
}

const products: Product[] = [
  { name: "Unga 2kg", price: 180, inStock: true },
  { name: "Sugar 1kg", price: 210, inStock: false },
  { name: "Cooking oil 1L", price: 350, inStock: true },
];

const cheapInStock = filterProducts(products, p => p.inStock && p.price < 300);
console.log(cheapInStock.map(p => p.name));

function onEach<T>(items: T[], action: (item: T, index: number) => void): void {
  items.forEach(action);
}
onEach(products, (p, i) => console.log(`${i + 1}. ${p.name} - KSh ${p.price}`));
```

Notice how `p` in the arrow functions is automatically typed as `Product`: TypeScript infers callback parameter types from the function signature.

## Returning objects and tuples

```try-typescript
function splitName(full: string): { first: string; last: string } {
  const [first, ...rest] = full.trim().split(/\s+/);
  return { first, last: rest.join(" ") };
}

function minMax(values: number[]): [min: number, max: number] {
  return [Math.min(...values), Math.max(...values)];
}

const { first, last } = splitName("Achieng Mary Odhiambo");
console.log(first, "|", last);
const [lowest, highest] = minMax([67, 82, 45, 90]);
console.log(`Lowest ${lowest}, highest ${highest}`);
```

Labelled tuples (`[min: number, max: number]`) make return values self-explanatory in editor tooltips.

## Async functions and Promise types

```try-typescript
type Payment = { receipt: string; amount: number; phone: string };

function fakeLookup(receipt: string): Promise<Payment | null> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(receipt === "SJK4H2L9XA" ? { receipt, amount: 1500, phone: "254712345678" } : null);
    }, 20);
  });
}

async function describePayment(receipt: string): Promise<string> {
  const p = await fakeLookup(receipt);
  if (!p) return `${receipt}: not found`;
  return `${p.receipt}: KSh ${p.amount} from ${p.phone}`;
}

(async () => {
  console.log(await describePayment("SJK4H2L9XA"));
  console.log(await describePayment("XXXX"));
})();
```

An `async` function always returns a `Promise<...>`. Writing the return type explicitly catches mistakes such as forgetting to return in one branch.

## Type guards: functions that narrow types

```try-typescript
type MpesaPayment = { method: "mpesa"; phone: string; amount: number };
type CardPayment = { method: "card"; last4: string; amount: number };
type AnyPayment = MpesaPayment | CardPayment;

function isMpesa(p: AnyPayment): p is MpesaPayment {
  return p.method === "mpesa";
}

const payments: AnyPayment[] = [
  { method: "mpesa", phone: "0712345678", amount: 500 },
  { method: "card", last4: "4242", amount: 2500 },
];

for (const p of payments) {
  if (isMpesa(p)) console.log("M-Pesa from", p.phone);   // p is MpesaPayment here
  else console.log("Card ending", p.last4);              // p is CardPayment here
}
```

The return type `p is MpesaPayment` tells TypeScript that when the function returns true, the argument has that type.

## Assertion functions

```try-typescript
function assertPositive(n: number, label: string): asserts n {
  if (!(n > 0)) throw new Error(`${label} must be greater than 0`);
}

function pay(amount: number) {
  assertPositive(amount, "Amount");
  return `Paying KSh ${amount}`;
}

console.log(pay(1200));
try { pay(0); } catch (e) { console.log((e as Error).message); }
```

## Generic helper functions (preview)

```try-typescript
function groupBy<T, K extends string>(items: T[], key: (item: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of items) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}

const sales = [
  { town: "Nakuru", amount: 1800 },
  { town: "Thika", amount: 840 },
  { town: "Nakuru", amount: 1400 },
];
const byTown = groupBy(sales, s => s.town);
console.log(Object.keys(byTown), byTown["Nakuru"].length);
```

You'll learn generics fully in a later lesson; notice how one function works safely for any item type.

## Best practices

| Practice | Why |
|---|---|
| Type parameters always; let return types be inferred for small functions | Clear inputs, less noise |
| Write explicit return types for exported/public functions | Stable API, clearer errors |
| Prefer one object parameter when there are more than 3 parameters | Order-proof calls, easier to extend |
| Avoid `any`; use `unknown` and narrow it | Keeps type safety |
| Keep functions small and pure where possible | Easier to test |

## Practice

1. Write `formatKsh(amount: number, decimals?: number): string` with a default of 0 decimals.
2. Write `applyDiscounts(price: number, ...rules: ((p: number) => number)[]): number`.
3. Create a type guard `isError(value: unknown): value is Error`.
4. Write an async function that returns `Promise<number[]>` of fake marks after a short delay.
5. Write a `sumBy<T>(items: T[], pick: (item: T) => number): number` helper.

:::think Why is `unknown` safer than `any` for data coming from an API?
With `any`, TypeScript lets you do anything (call methods, read properties) without checks, so mistakes reach runtime. With `unknown`, you must narrow the type first (typeof checks, type guards or validation) before using it, so you can't accidentally assume the data has a shape it might not have.
:::

```quiz
Q: Which symbol after a parameter name makes it optional?
A: ? | question mark
Q: Must optional parameters come before or after required ones?
A: after
Q: What return type means a function returns nothing useful?
A: void
Q: What return type means a function never finishes normally?
A: never
Q: What do you call it when TypeScript works out a type without you writing it?
A: inference | type inference | infer
Q: What return type syntax marks a function as a type guard for Product? (fill in: p is ...)
A: p is Product | is
Q: What type does an async function returning a string have? (generic form)
A: Promise<string>
Q: Which type is safer than any for unknown data?
A: unknown
```
