---
slug: introduction
title: "JavaScript introduction: what it is, why we need it, who uses it and your first programs"
after: KEEP
---
# JavaScript introduction: what it is, why we need it, who uses it and your first programs

HTML builds the page, CSS makes it look good, and **JavaScript makes it do things**: menus that open, forms that check your phone number before sending, prices that update when you change the quantity, M-Pesa payment buttons, live chat, maps, games and whole applications like Gmail and WhatsApp Web. JavaScript is the most widely used programming language in the world, and it's your first real **programming** language on this hub. This unit starts from zero.

:::note What you will learn
- What JavaScript is, its history and how it differs from Java
- Why JavaScript matters and what it can do
- Who uses it and where it runs (browsers, servers, phones, desktops)
- How to run JavaScript: this editor, the browser console, `<script>` tags, Node.js
- Statements, `console.log`, comments and your first variables
- How programs run: top to bottom, and what errors look like
- Good habits from day one
:::

## What is JavaScript?

:::define JavaScript
A programming language that runs in every web browser (and on servers with Node.js). It can store data, make decisions, repeat actions, respond to user events, change the page's HTML and CSS, and talk to servers.
:::

Compared with HTML and CSS:

| | HTML | CSS | JavaScript |
|---|---|---|---|
| Type | Markup | Style sheet | **Programming language** |
| Job | Structure and content | Appearance and layout | Behaviour and logic |
| Can it make decisions (`if`)? | No | Very limited (media queries) | Yes |
| Can it calculate? | No | A little (`calc()`) | Yes, fully |
| Example | `<button>Pay</button>` | `button { color: white; }` | `button.onclick = () => pay();` |

### A short history

- **1995:** Brendan Eich created JavaScript at Netscape in about 10 days, to make web pages interactive. It was named "JavaScript" partly for marketing because Java was popular; **the two languages are unrelated** ("Java is to JavaScript as car is to carpet").
- **1997:** standardised as **ECMAScript** (ES), which is why you hear "ES6" or "ES2015".
- **2008–2009:** Google's fast V8 engine (Chrome) and **Node.js** (JavaScript on servers) transformed what JavaScript could do.
- **2015 (ES6):** a huge update: `let`, `const`, arrow functions, classes, modules, promises.
- **Today:** a new ECMAScript version comes every year; JavaScript runs almost everywhere.

## Why do we need JavaScript?

Without JavaScript, a web page can only show information and send forms to a server, reloading the page each time. With JavaScript you can:

1. **Respond instantly to users:** open menus, show/hide content, validate forms before submitting.
2. **Update the page without reloading:** load more products, show search results as you type, refresh a chat.
3. **Calculate:** cart totals, loan repayments, unit conversions, BMI, exam grades.
4. **Store data in the browser:** remember a cart, a dark-mode choice, a draft.
5. **Talk to servers and APIs:** fetch weather, send orders, start an M-Pesa payment through your backend.
6. **Build whole applications:** Google Docs, WhatsApp Web, banking dashboards, school portals, games.

:::kenya
When you enter your phone number on a Kenyan e-commerce site and an M-Pesa prompt appears on your phone, JavaScript on the page sent your number to the shop's server, which asked Safaricom's Daraja API to send the STK push, and JavaScript then waited for confirmation to show "Payment received". That's JavaScript working with a backend.
:::

## Who uses JavaScript?

| Who | How |
|---|---|
| **Front-end developers** | Interactive websites and web apps (often with React, Vue or Angular) |
| **Back-end developers** | Servers and APIs with **Node.js** (Express, NestJS) |
| **Full-stack developers** | Both sides, sometimes entirely in JavaScript/TypeScript |
| **Mobile developers** | **React Native** apps for Android and iOS |
| **Desktop app developers** | **Electron** apps (VS Code, Slack, Discord, Teams) |
| **Game developers** | Browser games (Phaser, Three.js) |
| **Data visualisation specialists** | Interactive charts (Chart.js, D3) |
| **WordPress/Shopify developers** | Theme interactivity |
| **Automation and testing engineers** | Testing web apps (Playwright, Cypress), automating tasks |

:::career
JavaScript (and its typed version, **TypeScript**) appears in more developer job listings than almost any other language. Front-end, full-stack, React and React Native jobs all require it. Learning JavaScript well opens local jobs, remote jobs and freelance work (web apps, website features, bug fixes).
:::

## Where does JavaScript run?

- **Browsers:** every browser has a JavaScript engine (V8 in Chrome/Edge, SpiderMonkey in Firefox, JavaScriptCore in Safari).
- **Servers:** Node.js (also Deno and Bun).
- **Phones:** React Native and hybrid apps.
- **Desktops:** Electron apps.
- **Elsewhere:** browser extensions, smart TVs, IoT devices, even spreadsheets (Google Apps Script is JavaScript).

## Ways to run JavaScript

### 1. The editor on this page

The examples below run in a safe sandbox. Press **Run**, read the output, change the code and run again.

### 2. The browser console

Press **F12** → **Console** on any website and type `2 + 2`, then Enter. Great for quick tests.

### 3. In an HTML page with `<script>`

```
<!DOCTYPE html>
<html>
<body>
  <h1>Hello</h1>
  <script src="app.js"></script>   <!-- external file (best) -->
</body>
</html>
```

Put scripts at the **end of `<body>`** or use `<script src="app.js" defer>` in the `<head>` so the HTML loads first.

### 4. Node.js on your computer

Install Node.js (nodejs.org), save `hello.js`, then run `node hello.js` in a terminal.

## Your first program

```try-javascript
console.log("Habari! Welcome to JavaScript.");
console.log(2 + 3);
console.log("I am learning at", "Marzley Tech");
```

`console.log()` prints values to the **console** (the output area). It's how developers see what their code is doing. Text must be in quotes (a **string**); numbers don't need quotes.

### Statements and semicolons

Each instruction is a **statement**, usually on its own line and ending with a semicolon `;`. JavaScript can often insert missing semicolons automatically, but writing them is a clear, safe habit.

### Comments

```try-javascript
// A single-line comment: the computer ignores this
/* A multi-line comment:
   use it to explain longer ideas */
console.log("Comments help humans understand code"); // comment at the end of a line
```

## Variables: storing information

A **variable** is a named box that stores a value so you can use it later.

```try-javascript
let customer = "Wanjiku";
const pricePerKg = 180;
let kilos = 3;

let total = pricePerKg * kilos;
console.log(customer, "pays KSh", total);

kilos = 5;                       // let variables can change
total = pricePerKg * kilos;
console.log("New total: KSh", total);
```

- `let` creates a variable that **can change**.
- `const` creates one that **can't be reassigned** (use it by default; switch to `let` when the value must change).
- Avoid the old `var` keyword in new code (it has confusing scope rules).
- Names: start with a letter, `_` or `$`; no spaces; case-sensitive (`total` ≠ `Total`); use **camelCase** (`pricePerKg`).

## Basic maths

```try-javascript
console.log(10 + 5);    // 15 addition
console.log(10 - 5);    // 5  subtraction
console.log(10 * 5);    // 50 multiplication
console.log(10 / 4);    // 2.5 division
console.log(10 % 3);    // 1  remainder (modulo)
console.log(2 ** 3);    // 8  power
console.log((2 + 3) * 4); // 20: brackets first
```

## How programs run

JavaScript runs **top to bottom**, one statement after another (later you'll learn how events, functions and asynchronous code change the order). If a line has an **error**, the program stops there and the console shows a message:

```try-javascript
// This example fails on purpose so you can read the error
console.log("Line 1 runs");
console.log(totl);          // typo: totl was never created
console.log("This line never runs");
```

Read the error: `ReferenceError: totl is not defined`. It tells you **what** went wrong and usually **which line**. Reading errors calmly is a core programming skill; the help box under the editor explains common errors in simple words.

:::think Why does the third line not print in the example above?
Because the second line throws an error (`totl` doesn't exist), and an uncaught error stops the script. Everything after it is skipped. Fix the typo (`total` defined properly) and all lines run.
:::

## What JavaScript can do on a page (a preview)

```try-html
<h2 id="title">Price calculator</h2>
<label>Kilos of sugar: <input id="kg" type="number" value="1" min="1"></label>
<p id="out">Total: KSh 150</p>
<script>
  const input = document.querySelector("#kg");
  const out = document.querySelector("#out");
  input.addEventListener("input", () => {
    const kg = Number(input.value) || 0;
    out.textContent = "Total: KSh " + kg * 150;
  });
</script>
```

Change the number: the total updates instantly without reloading. You'll learn exactly how in the DOM and events units.

## Good habits from day one

- **Run code often**, after every small change.
- **Use `console.log`** to check values.
- **Read errors** instead of panicking.
- **Name things clearly** (`totalPrice`, not `x`).
- **Indent consistently** (2 spaces is common).
- **Type code yourself** instead of copy-pasting; your fingers learn too.
- Use AI assistants to **explain** code and errors, but make sure you understand every line you use.

## Common beginner mistakes

| Mistake | Example | Fix |
|---|---|---|
| Missing quotes around text | `console.log(Hello)` | `console.log("Hello")` |
| Mismatched quotes | `"Hello'` | `"Hello"` |
| Wrong capitalisation | `Console.log` | `console.log` |
| Using a variable before creating it | `console.log(x); let x = 5;` | Create it first |
| Reassigning a `const` | `const a = 1; a = 2;` | Use `let` if it must change |
| Missing brackets | `console.log("Hi"` | `console.log("Hi")` |

## Practice tasks

1. Print your name, your town and your favourite food on three lines.
2. Create variables for the price of bread (KSh 65) and quantity (4); print the total.
3. Calculate how many full weeks are in 100 days and the remaining days (use `/`, `Math.floor` and `%`).
4. Open the browser console on any website and do three calculations.
5. Make a deliberate typo, run it, and read the error message.

## Summary

- **JavaScript** is a programming language for behaviour and logic; it runs in browsers, on servers (Node.js), phones and desktops. It is unrelated to Java.
- It makes pages interactive, calculates, stores data, talks to servers and powers full applications.
- Run it in this editor, the browser console, `<script>` tags (end of body or `defer`) or Node.js.
- `console.log()` prints output; comments use `//` and `/* */`.
- Variables: `const` by default, `let` when the value changes; avoid `var`.
- Programs run top to bottom; an error stops the script and the message tells you what's wrong.

```quiz
Q: Is JavaScript related to Java? (yes or no)
A: no
Q: Which function prints values to the console?
A: console.log | console.log()
Q: Which keyword creates a variable that cannot be reassigned?
A: const
Q: Which keyword creates a variable that can change?
A: let
Q: What does 10 % 3 give?
A: 1
Q: What lets JavaScript run on servers? (two words or one: Node...)
A: Node.js | node | nodejs | Node
Q: What is the official standard name of JavaScript?
A: ECMAScript | ecmascript
Q: Which naming style is used for JavaScript variables like totalPrice?
A: camelCase | camel case
```
=== exercise ===
Create a variable `price` with the value **250** and print `price * 4`. The output should be **1000**.
=== starter ===
let price = 0;
=== expected ===
1000
=== must_contain ===
