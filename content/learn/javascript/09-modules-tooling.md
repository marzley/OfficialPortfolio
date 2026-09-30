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
```
