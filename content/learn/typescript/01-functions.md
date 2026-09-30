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
```
