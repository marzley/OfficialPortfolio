---
slug: modules-npm-tooling
title: Modules, npm and the modern JavaScript toolbox
after: classes-oop
---
# Modules, npm and the modern JavaScript toolbox

Small scripts fit in one file. Real apps have dozens. **Modules** split code into files that share only what they choose to, and **npm** gives you access to millions of free packages. This lesson explains the tools you'll meet in every modern JavaScript job.

## ES modules: export and import

**money.js**

```javascript
export const VAT = 0.16;

export function withVat(amount) {
  return Math.round(amount * (1 + VAT));
}

export default function formatKsh(n) {
  return "KSh " + n.toLocaleString("en-KE");
}
```

**app.js**

```javascript
import formatKsh, { withVat, VAT } from "./money.js";

console.log(formatKsh(withVat(1000)));   // KSh 1,160
console.log(`VAT is ${VAT * 100}%`);
```

**index.html**

```html
<script type="module" src="app.js"></script>
```

| Syntax | Meaning |
|---|---|
| `export const x` / `export function f` | Named export (a file can have many) |
| `export default ...` | The main export (one per file) |
| `import { x, f } from "./file.js"` | Import named exports (names must match) |
| `import anything from "./file.js"` | Import the default (any name you like) |
| `import * as money from "./money.js"` | Everything as one object |

Benefits: each file has its own scope (no accidental global variables), dependencies are clear, and tools can remove unused code.

> Module scripts only work when the page is served over `http://` or `https://`, not by double-clicking the file. Use VS Code's Live Server extension or `npx serve`.

## Node.js: JavaScript outside the browser

**Node.js** runs JavaScript on your computer or a server. With it you can build APIs, command-line tools and run build tools. After installing Node from nodejs.org:

```bash
node --version
node hello.js
```

## npm: the package manager

```bash
npm init -y                 # create package.json for your project
npm install dayjs           # add a package (saved in node_modules/)
npm install -D vite         # a development tool
npm run dev                 # run a script from package.json
```

**package.json** lists your project's packages and scripts:

```json
{
  "name": "duka-app",
  "scripts": { "dev": "vite", "build": "vite build" },
  "dependencies": { "dayjs": "^1.11.10" },
  "devDependencies": { "vite": "^5.0.0" }
}
```

- `node_modules/` holds the downloaded packages. Never edit it, and never commit it to Git (add it to `.gitignore`).
- Anyone can recreate it with `npm install`.
- `package-lock.json` records exact versions so everyone gets the same code: commit it.

## The tools you'll hear about

| Tool | What it does |
|---|---|
| **Vite** | Dev server with instant reload, and builds optimised files for production |
| **ESLint** | Finds mistakes and bad patterns as you type |
| **Prettier** | Formats your code automatically |
| **TypeScript** | Adds types to JavaScript (see our TypeScript tutorial) |
| **React / Vue / Svelte** | Libraries for building interactive user interfaces from components |
| **Express** | A small framework for building web servers and APIs in Node |

## A tiny Node API with Express

```javascript
// server.js  (npm install express, then: node server.js)
import express from "express";
const app = express();
app.use(express.json());

const products = [{ id: 1, name: "Unga", price: 180 }];

app.get("/api/products", (req, res) => res.json(products));
app.post("/api/products", (req, res) => {
  const p = { id: products.length + 1, ...req.body };
  products.push(p);
  res.status(201).json(p);
});

app.listen(3000, () => console.log("API on http://localhost:3000"));
```

Your front-end can now `fetch("/api/products")`. This is the core of full-stack JavaScript.

## Choosing packages wisely

- Check weekly downloads, last update date and open issues on npmjs.com.
- Fewer packages means fewer security risks and a smaller app. Don't install a package for something a few lines of code can do.
- Run `npm audit` to check for known security problems.

## Why modules and tooling exist

Small scripts can live in one file, but real projects have thousands of lines: cart logic, API calls, validation, UI components. **Modules** split code into files with clear imports and exports, so each part can be understood, tested and reused. **Tooling** (npm, bundlers, linters, formatters, test runners) automates the boring and error-prone work: installing libraries, shrinking files for fast loading, catching mistakes and checking that features still work after changes. Every JavaScript job advert assumes you know these basics.

## Organising a project

A typical small front-end project:

```text
my-shop/
├── index.html
├── package.json
├── src/
│   ├── main.js          # starts the app
│   ├── api.js           # fetch calls to the server
│   ├── cart.js          # cart logic (no DOM code)
│   ├── format.js        # money/date helpers
│   └── ui/
│       └── render.js    # DOM updates
└── tests/
    └── cart.test.js
```

Keeping logic (cart, format) separate from DOM code makes it testable in Node without a browser.

## Named vs default exports

| | Named export | Default export |
|---|---|---|
| Write | `export function total() {}` | `export default function Cart() {}` |
| Import | `import { total } from "./cart.js"` | `import Cart from "./cart.js"` (any name) |
| Many per file? | Yes | One |
| Good for | Utility collections | A file that has one main thing (a component) |

```javascript
// format.js
export const ksh = n => `KSh ${n.toLocaleString("en-KE")}`;
export function percent(x) { return `${(x * 100).toFixed(1)}%`; }

// main.js
import { ksh, percent as pct } from "./format.js";   // rename on import
import * as fmt from "./format.js";                   // everything as an object
console.log(ksh(2500), pct(0.16), fmt.ksh(100));
```

## Dynamic import: load code only when needed

```javascript
document.querySelector("#show-chart").addEventListener("click", async () => {
  const { drawChart } = await import("./chart.js");   // downloaded on first click
  drawChart(salesData);
});
```

This keeps the first page load small, which matters for users on slow mobile data.

## package.json scripts

```json
{
  "name": "my-shop",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "node --test",
    "lint": "eslint src"
  },
  "dependencies": { "chart.js": "^4.4.0" },
  "devDependencies": { "vite": "^5.0.0", "eslint": "^9.0.0" }
}
```

Run them with `npm run dev`, `npm run build`, `npm test`. The versions shown are examples; `npm install` records the real current versions.

| Term | Meaning |
|---|---|
| `dependencies` | Needed when the app runs (chart library, date library) |
| `devDependencies` | Only for development (bundler, linter, test runner) |
| `^4.4.0` | Allow minor and patch updates (4.x.x), not 5.0.0 |
| `package-lock.json` | Records exact installed versions; commit it so everyone gets the same versions |
| `npx` | Run a package's command without installing it globally |

## Testing with Node's built-in test runner

```javascript
// cart.js
export function cartTotal(items, vat = 0.16) {
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  return Math.round(sub * (1 + vat));
}

// tests/cart.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { cartTotal } from "../src/cart.js";

test("adds VAT", () => {
  assert.equal(cartTotal([{ price: 100, qty: 2 }]), 232);
});
test("empty cart is zero", () => {
  assert.equal(cartTotal([]), 0);
});
```

Run `npm test`. Tests let you change code confidently: if something breaks, a test fails before your users notice. Popular alternatives are Vitest and Jest.

## Environment variables and secrets

Configuration that differs between your laptop and the live server (API URLs, database passwords, payment keys) goes in environment variables, not in code:

```javascript
// server-side Node only
const port = process.env.PORT ?? 3000;
const apiKey = process.env.PAYMENT_API_KEY;   // set on the server, never committed
if (!apiKey) console.warn("PAYMENT_API_KEY is not set");
```

Important: anything bundled into front-end JavaScript is visible to every visitor. Secret keys (M-Pesa consumer secret, database passwords) must stay on the server and never be put into browser code or committed to Git. Add `.env` to `.gitignore`.

## Building for production

A bundler (Vite, esbuild, webpack) takes your modules and:

- **Bundles** many files into a few for fewer requests.
- **Minifies** (removes spaces, shortens names) for smaller downloads.
- **Tree-shakes**: drops exported code that nothing imports.
- Adds **content hashes** to file names (`main.3f9a1c.js`) so browsers cache safely.
- Transforms modern syntax and TypeScript/JSX.

```bash
npm create vite@latest my-shop    # choose "Vanilla" or "React"
cd my-shop && npm install
npm run dev                       # local server with instant reload
npm run build                     # optimised files in dist/ ready to upload
```

Upload the `dist/` folder to any static host or cPanel `public_html`.

## Code quality tools

| Tool | Job |
|---|---|
| **ESLint** | Finds likely bugs and bad patterns (unused variables, `==`, missing awaits) |
| **Prettier** | Formats code consistently so teams don't argue about style |
| **TypeScript** | Adds types that catch mistakes before running |
| **Husky / lint-staged** | Run lint and tests automatically before each commit |
| **GitHub Actions** | Run tests on every push and pull request |

## Security habits with npm

- Install only well-maintained packages; check the package name carefully (typosquatting: `expresss` instead of `express`).
- Run `npm audit` and update regularly with `npm outdated` / `npm update`.
- Use `npm ci` on servers and in CI: it installs exactly what's in the lockfile.
- Never run unknown install scripts as an administrator.

## Practice

1. Split a single-file calculator into `math.js` (logic) and `main.js` (output) with named exports.
2. Create a project with `npm init -y`, add a `start` script, and run it.
3. Write two tests for a `formatPhone` function using `node:test`.
4. Use a dynamic `import()` to load a module only when a button is clicked.

:::think Why should `node_modules/` be left out of Git but `package-lock.json` be committed?
`node_modules` is large and can be rebuilt exactly from `package.json` and the lockfile, so committing it wastes space and causes conflicts. The lockfile records the exact versions that worked, so teammates and servers install identical dependencies with `npm ci`.
:::

```quiz
Q: Which keyword shares a function from a module file?
A: export
Q: What must the script tag's type be to use import in the browser?
A: module | type="module"
Q: Which command creates a package.json file quickly?
A: npm init -y | npm init
Q: Which folder should never be committed to Git?
A: node_modules | node_modules/
Q: What runs JavaScript outside the browser, on servers?
A: node | node.js | nodejs
Q: Which file records the exact installed dependency versions?
A: package-lock.json | lockfile
Q: Which npm command installs exactly what the lockfile says, for servers and CI?
A: npm ci
Q: What is it called when a bundler removes unused exported code? (two words)
A: tree shaking | tree-shaking
Q: Should secret API keys be bundled into front-end JavaScript? (yes or no)
A: no
```
