---
slug: async-await
title: "Promises and async/await: handling things that take time"
after: KEEP
---
# Promises and async/await: handling things that take time

Some tasks take time: loading data from a server, waiting for an M-Pesa payment confirmation, reading a file, a countdown timer. JavaScript can't freeze the page while waiting, or users couldn't tap or scroll. Instead it uses **asynchronous** code: start the task, keep the page responsive, and handle the result when it arrives. This unit explains callbacks, **Promises** and **async/await** from the ground up, with runnable examples.

:::note What you will learn
- Synchronous vs asynchronous code and the event loop (simply)
- Callbacks and `setTimeout`
- Promises: pending, fulfilled, rejected; `.then`, `.catch`, `.finally`
- Creating your own Promise
- `async` functions and `await`
- Error handling with `try...catch`
- Running tasks in sequence vs in parallel (`Promise.all`, `allSettled`, `race`)
- Timeouts, retries and polling (like checking a payment status)
:::

## Synchronous vs asynchronous

**Synchronous** code runs line by line; each line waits for the previous one.

**Asynchronous** code starts a task and moves on; the result is handled later.

```try-javascript
console.log("1. Order placed");
setTimeout(() => console.log("3. Payment confirmed (after 1 second)"), 1000);
console.log("2. Showing 'waiting for payment' message");
```

The output order is 1, 2, 3: `setTimeout` schedules the function for later, and JavaScript continues immediately.

### The event loop, simply

JavaScript runs on **one thread** (one thing at a time). Slow tasks (timers, network requests) are handed to the browser or Node.js. When they finish, their callbacks wait in a **queue**, and the **event loop** runs them when the main code is free. That's why a long loop that never ends freezes everything: the queue never gets a turn.

## Callbacks

The original way: pass a function to be called when the task finishes.

```try-javascript
function loadUser(id, callback) {
  setTimeout(() => callback({ id, name: "Achieng" }), 300);
}

loadUser(7, (user) => {
  console.log("Loaded", user.name);
});
```

Nested callbacks for steps that depend on each other become hard to read ("callback hell"):

```
loadUser(7, (user) => {
  loadOrders(user.id, (orders) => {
    loadPayment(orders[0].id, (payment) => {
      // deeper and deeper...
    });
  });
});
```

Promises solve this.

## Promises

:::define Promise
An object representing a value that will be available **later** (or an error). A promise is **pending** at first, then becomes **fulfilled** (success, with a value) or **rejected** (failure, with an error).
:::

```try-javascript
function checkPayment(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === 0) resolve({ receipt: "SJ12ABC3DE", amount: 1500 });
      else reject(new Error("Payment failed with code " + code));
    }, 400);
  });
}

checkPayment(0)
  .then((result) => console.log("Paid! Receipt:", result.receipt))
  .catch((err) => console.log("Error:", err.message))
  .finally(() => console.log("Hide the spinner"));

checkPayment(1032)
  .then((result) => console.log("Paid!", result))
  .catch((err) => console.log("Error:", err.message));
```

- `resolve(value)` fulfils the promise; `reject(error)` rejects it.
- `.then()` runs on success, `.catch()` on failure, `.finally()` either way.
- `.then()` returns a new promise, so you can **chain** steps.

## `async` and `await`

`async/await` lets you write asynchronous code that **reads like normal code**:

```try-javascript
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getUser(id) { return wait(200).then(() => ({ id, name: "Brian" })); }
function getOrders(userId) { return wait(200).then(() => [{ id: 91, total: 2400 }, { id: 92, total: 650 }]); }

async function showDashboard() {
  console.log("Loading...");
  const user = await getUser(7);            // waits here without freezing the page
  const orders = await getOrders(user.id);
  const total = orders.reduce((sum, o) => sum + o.total, 0);
  console.log(`${user.name} has ${orders.length} orders worth KSh ${total}`);
  return total;
}

showDashboard().then((t) => console.log("Returned:", t));
```

Rules:
- `await` can only be used inside an `async` function (or at the top level of a module).
- An `async` function **always returns a promise**.
- `await promise` pauses **that function** until the promise settles, while the rest of the page keeps working.

## Error handling with `try...catch`

```try-javascript
function fakeRequest(ok) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (ok ? resolve("Data loaded") : reject(new Error("Network error"))), 200));
}

async function load(ok) {
  try {
    const data = await fakeRequest(ok);
    console.log("Success:", data);
  } catch (err) {
    console.log("Could not load:", err.message, "→ show a 'Try again' button");
  } finally {
    console.log("Done (hide loading spinner)");
  }
}

load(true).then(() => load(false));
```

Unhandled promise rejections cause console errors and can crash Node.js programs, so always catch errors.

## Sequence vs parallel

If tasks **depend** on each other, await them one after another. If they're **independent**, start them together with `Promise.all`, which is much faster.

```try-javascript
const wait = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));

async function sequential() {
  const t = Date.now();
  const a = await wait(300, "products");
  const b = await wait(300, "categories");
  const c = await wait(300, "offers");
  console.log("Sequential:", [a, b, c].join(", "), "in about", Math.round((Date.now() - t) / 100) * 100, "ms");
}

async function parallel() {
  const t = Date.now();
  const [a, b, c] = await Promise.all([wait(300, "products"), wait(300, "categories"), wait(300, "offers")]);
  console.log("Parallel:", [a, b, c].join(", "), "in about", Math.round((Date.now() - t) / 100) * 100, "ms");
}

sequential().then(parallel);
```

| Method | Behaviour |
|---|---|
| `Promise.all([...])` | Waits for all; **rejects as soon as one fails** |
| `Promise.allSettled([...])` | Waits for all; gives each result or error (none lost) |
| `Promise.race([...])` | Settles with the **first** to finish (success or failure) |
| `Promise.any([...])` | First **successful** one |

:::think A dashboard loads sales, stock and customer numbers from three separate API endpoints. Should it await them one by one or use Promise.all? What if the customer endpoint sometimes fails?
They don't depend on each other, so start them together with `Promise.all` (or `allSettled`). If one may fail and you still want to show the other two, use `Promise.allSettled` and show an error only in the failed widget, instead of the whole dashboard failing.
:::

## Timeouts

Networks can hang. Race a request against a timer:

```try-javascript
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const slowServer = () => wait(2000).then(() => "data");

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms));
  return Promise.race([promise, timeout]);
}

withTimeout(slowServer(), 500)
  .then((d) => console.log(d))
  .catch((e) => console.log(e.message, "→ show 'slow connection, try again'"));
```

(With real `fetch`, use `AbortSignal.timeout(ms)`.)

## Polling: checking a payment status

After an M-Pesa STK push, the app often asks its own server every few seconds whether the payment has completed, stopping after success, failure or a time limit:

```try-javascript
let checks = 0;
function fakeStatus() {           // simulates your backend's /payments/status endpoint
  checks++;
  return Promise.resolve(checks < 3 ? { status: "pending" } : { status: "paid", receipt: "SJ12ABC3DE" });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForPayment({ every = 300, maxTries = 10 } = {}) {
  for (let i = 1; i <= maxTries; i++) {
    const s = await fakeStatus();
    console.log(`Check ${i}: ${s.status}`);
    if (s.status === "paid") return s;
    if (s.status === "failed") throw new Error("Payment failed");
    await wait(every);
  }
  throw new Error("Still pending. We'll confirm by SMS.");
}

waitForPayment()
  .then((s) => console.log("Paid! Receipt", s.receipt))
  .catch((e) => console.log(e.message));
```

In real apps, intervals are a few seconds, and the server learns the result from Safaricom's callback (see the M-Pesa Daraja lesson).

## Retries

```
async function retry(task, times = 3) {
  for (let attempt = 1; attempt <= times; attempt++) {
    try { return await task(); }
    catch (err) { if (attempt === times) throw err; await wait(500 * attempt); }
  }
}
```

Only retry **safe** operations (loading data). Never blindly retry payments, or customers could be charged twice.

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `await` | You get a Promise object instead of the value |
| `await` outside an `async` function | Make the function `async` |
| No `try...catch` or `.catch()` | Always handle errors |
| Awaiting independent tasks one by one | `Promise.all` |
| Using `Promise.all` when one failure shouldn't break everything | `Promise.allSettled` |
| Expecting code after `setTimeout` to wait | It doesn't; put follow-up code in the callback or `await` a promise |
| Retrying payment requests | Only retry safe operations; use idempotency on the server |

## Practice tasks

1. Write `wait(ms)` and use it to print a 3-2-1 countdown, one number per second.
2. Create a promise that resolves "In stock" or rejects "Out of stock" based on a quantity; handle both with `async/await`.
3. Load three fake resources with `Promise.all` and measure the time vs sequential.
4. Use `Promise.allSettled` with one failing task and print which succeeded.
5. Add a timeout to a slow fake request using `Promise.race`.

## Summary

- Asynchronous code starts slow tasks and handles results later, keeping the page responsive (event loop).
- Callbacks work but nest badly; **Promises** represent future values: pending → fulfilled/rejected; `.then`, `.catch`, `.finally`.
- `async` functions return promises; `await` pauses the function until a promise settles; use `try...catch` for errors.
- Run independent tasks in parallel with `Promise.all`/`allSettled`; use `race` for timeouts.
- Polling and retries are common patterns; never blindly retry payments.

```quiz
Q: In what order do these print: log A, setTimeout log B (0ms), log C? Write like A C B.
A: A C B | ACB | A, C, B
Q: What are the three states of a Promise? Write the first (initial) one.
A: pending
Q: Which method handles a rejected promise in a chain?
A: catch | .catch | .catch()
Q: Which keyword must a function have to use await inside it?
A: async
Q: What does an async function always return?
A: a promise | promise | Promise
Q: Which method waits for all promises and fails fast if one rejects?
A: Promise.all | all
Q: Which method waits for all and reports each success or failure?
A: Promise.allSettled | allSettled
Q: Should a payment request be retried automatically? (yes or no)
A: no
```
=== exercise ===
Create an `async` function `main` that uses `await` on `Promise.resolve(500)` and prints the value. The output should be **500**.
=== starter ===
async function main() {
  
}

main();
=== expected ===
500
=== must_contain ===
async
await
