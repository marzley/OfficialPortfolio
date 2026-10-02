---
slug: local-storage
title: "Saving data in the browser: localStorage, sessionStorage, cookies and IndexedDB"
after: KEEP
---
# Saving data in the browser: localStorage, sessionStorage, cookies and IndexedDB

Websites often need to **remember** things between visits: a shopping cart, dark mode, a draft message, the last lesson you opened (this learning hub does all of these). Browsers offer several storage options. This unit explains each, focusing on **localStorage** (the simplest and most used), with safe patterns, limits and security rules.

:::note What you will learn
- Why browser storage exists and what it should (and shouldn't) hold
- `localStorage` and `sessionStorage`: setItem, getItem, removeItem, clear
- Storing objects and arrays with JSON
- Safe wrappers (storage can be blocked or full)
- Building a persistent cart and theme preference
- Cookies and IndexedDB: when to use them
- Security and privacy rules
:::

## Why store data in the browser?

| Use | Example |
|---|---|
| Preferences | Dark mode, language, font size |
| Convenience | Shopping cart before login, form drafts, recently viewed products |
| Offline support | Saved notes, cached data for apps that work offline (PWAs) |
| Performance | Avoid reloading data that rarely changes |

Data stored in the browser lives **only on that device and browser**. It's not shared with other devices, and users can clear it any time, so important data (orders, payments, accounts) must be saved on a **server**.

## localStorage

:::define localStorage
A simple key–value store in the browser that keeps **strings** for a website, with **no expiry**: data stays after closing the browser until it's deleted by code or the user.
:::

```
localStorage.setItem("theme", "dark");          // save
const theme = localStorage.getItem("theme");    // read: "dark" (or null if missing)
localStorage.removeItem("theme");               // delete one key
localStorage.clear();                           // delete everything for this site
```

- Keys and values are **strings**.
- Each website (origin: protocol + domain + port) has its own separate storage.
- Typical limit: about **5 MB** per origin (varies by browser).
- It's **synchronous** (blocks briefly); fine for small data.

### sessionStorage

Same methods, but data lasts only for the **current tab** session and is cleared when the tab closes. Useful for temporary data like a multi-step form in progress.

| | localStorage | sessionStorage |
|---|---|---|
| Lifetime | Until deleted | Until the tab closes |
| Shared between tabs of the same site | Yes | No (each tab separate) |
| Typical use | Preferences, cart | Temporary wizard steps |

## Storing objects and arrays: use JSON

Storage only holds strings. Saving an object directly gives `"[object Object]"`. Convert with JSON:

```try-javascript
// A tiny in-memory stand-in for localStorage, so this runs anywhere
const storage = new Map();
const store = {
  setItem: (k, v) => storage.set(k, String(v)),
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
};

const cart = [{ id: 17, name: "Speaker", qty: 1 }, { id: 4, name: "Charger", qty: 2 }];

store.setItem("cart-wrong", cart);
console.log(store.getItem("cart-wrong"));            // "[object Object],[object Object]" (useless)

store.setItem("cart", JSON.stringify(cart));          // correct: save as JSON text
const saved = JSON.parse(store.getItem("cart"));      // read back as an array
console.log(saved.length, "items; first:", saved[0].name);

console.log(store.getItem("missing"));               // null when the key doesn't exist
```

Numbers and booleans come back as strings too: `Number(localStorage.getItem("visits"))`, `localStorage.getItem("muted") === "true"`.

## Storage can fail: always use a safe wrapper

`localStorage` can throw errors:
- In some **private/incognito** modes and in **sandboxed frames** (like this practice editor), access is blocked.
- When storage is **full** (`QuotaExceededError`).
- Saved text may be **corrupted** or from an older version of your app (invalid JSON).

A safe pattern:

```try-javascript
const safeStore = {
  get(key, fallback) {
    try {
      const raw = globalThis.localStorage ? localStorage.getItem(key) : null;
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;                   // blocked or invalid JSON: use the default
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;                      // blocked or full: carry on without saving
    }
  },
};

console.log(safeStore.get("cart", []));                 // [] if nothing saved or storage blocked
console.log("Saved?", safeStore.set("theme", "dark"));  // false here (no localStorage in this runner)
```

Your app should **work even if storage fails**; it just won't remember things.

## Example: a cart that survives reloads

```try-html
<h3>Cart (<span id="count">0</span> items)</h3>
<button data-name="Unga 2kg">Add Unga</button>
<button data-name="Sugar 1kg">Add Sugar</button>
<button id="clear">Clear</button>
<ul id="items"></ul>
<p id="note" style="color:#64748b"></p>
<script>
  const KEY = "demo-cart";
  let memory = [];
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { document.querySelector("#note").textContent = "(Storage is blocked in this practice editor, so the cart lives in memory only. On a real site it would survive a reload.)"; return memory; }
  }
  function save(cart) {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { memory = cart; }
  }
  function render() {
    const cart = load();
    document.querySelector("#count").textContent = cart.length;
    const ul = document.querySelector("#items");
    ul.replaceChildren(...cart.map((name) => { const li = document.createElement("li"); li.textContent = name; return li; }));
  }
  document.querySelectorAll("[data-name]").forEach((btn) =>
    btn.addEventListener("click", () => { const cart = load(); cart.push(btn.dataset.name); save(cart); render(); }));
  document.querySelector("#clear").addEventListener("click", () => { save([]); render(); });
  render();
</script>
```

On your own site (not in the sandbox), add items, reload the page, and the cart is still there.

## Example: remembering dark mode

```
const saved = localStorage.getItem("theme");                // "dark", "light" or null
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.dataset.theme = saved || (prefersDark ? "dark" : "light");
```

Run this in a small script in the `<head>` so the right theme appears before the page paints (no flash of the wrong theme).

## Listening for changes in other tabs

When localStorage changes in **another tab** of the same site, a `storage` event fires, so you can keep tabs in sync (e.g. cart count):

```
window.addEventListener("storage", (e) => {
  if (e.key === "cart") updateCartBadge(JSON.parse(e.newValue || "[]"));
});
```

## Cookies

**Cookies** are small pieces of data (about 4 KB each) that the browser **sends to the server with every request** to that site. They're mainly for **sessions/logins** and server-side features.

| | localStorage | Cookies |
|---|---|---|
| Sent to the server automatically | No | Yes, on every request |
| Size | ~5 MB | ~4 KB per cookie |
| Expiry | None (until deleted) | Set by the site |
| Readable by JavaScript | Yes | Yes, unless `HttpOnly` |
| Best for | Client-side preferences and caches | Login sessions (set by the server) |

Secure session cookies are set by the **server** with `HttpOnly` (JavaScript can't read them, protecting against theft), `Secure` (HTTPS only) and `SameSite` (protects against cross-site request forgery).

## IndexedDB

For **large or structured data** (thousands of records, offline apps, files), browsers offer **IndexedDB**: an asynchronous database in the browser. Its API is more complex; libraries like **idb** or **Dexie** make it easier. Use it for offline-first apps (e.g. a field data collection app that syncs when back online).

## Security and privacy rules

:::warning Never store secrets in localStorage
Any JavaScript running on your page (including a malicious script injected through an XSS bug or a compromised third-party library) can read localStorage. **Don't** store passwords, M-Pesa PINs, full card numbers, or long-lived login tokens there. Use server sessions with `HttpOnly` cookies for authentication.
:::

- Store only what's necessary; it's personal data on a shared device in many households and cyber cafés.
- Provide a way to clear data (e.g. "Sign out" clears cached personal data).
- Kenya's Data Protection Act applies to personal data you collect, including what you store about users.
- Respect users' choices about cookies and tracking (consent for analytics/ads cookies where required).

:::think A school portal stores each student's full name, results and login token in localStorage so pages load faster. What problems could this cause on a shared computer in a cyber café?
The next person using that browser could read the stored results and token (via DevTools or a malicious script) and possibly access the student's account. Sensitive data and tokens shouldn't be in localStorage; use server sessions with HttpOnly cookies, short session lifetimes, and clear any cached data on sign-out.
:::

## Common mistakes

| Mistake | Fix |
|---|---|
| Saving objects without `JSON.stringify` | Stringify on save, parse on load |
| Not handling `null` for missing keys | Provide defaults |
| No `try...catch` around storage | Wrap in a safe helper |
| Storing secrets or tokens | Server sessions + HttpOnly cookies |
| Relying on localStorage for important data | Save orders/accounts on the server |
| Huge data in localStorage | IndexedDB for large data |

## Practice tasks

1. Save a visitor's name from an input and greet them on the next visit (test on your own computer, not the sandbox).
2. Count page visits with localStorage and display "You've visited X times".
3. Save a form draft on every `input` event and restore it on load.
4. Build a dark mode toggle that remembers the choice.
5. Write a `safeStore` helper and use it in a small project.

## Summary

- Browser storage remembers data on one device: preferences, carts, drafts, offline data.
- `localStorage` persists; `sessionStorage` lasts for the tab; both store strings via `setItem`, `getItem`, `removeItem`, `clear`.
- Use JSON for objects/arrays; wrap storage in `try...catch`; handle `null` defaults.
- Cookies travel to the server and suit sessions (HttpOnly, Secure, SameSite); IndexedDB suits large structured data.
- Never store secrets or tokens in localStorage; keep important data on the server.

```quiz
Q: Which storage keeps data after the browser is closed: localStorage or sessionStorage?
A: localStorage | local storage
Q: Which method saves a value in localStorage?
A: setItem | localStorage.setItem
Q: What does getItem return when the key doesn't exist?
A: null
Q: What must you do to an object before saving it in localStorage?
A: JSON.stringify | stringify | JSON.stringify it
Q: Roughly how much data can localStorage hold per site? Write in MB.
A: 5MB | 5 MB | 5
Q: Which cookie flag stops JavaScript from reading a cookie?
A: HttpOnly | httponly
Q: Should login tokens or passwords be stored in localStorage? (yes or no)
A: no
```
