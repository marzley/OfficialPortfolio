---
slug: forms-validation
title: Handling forms and validating input
after: dom-events
---
# Handling forms and validating input

Forms are where users give you data: sign-ups, orders, payments. JavaScript can read the values, check them, show friendly errors and give instant feedback, before anything is sent.

## Reading a form

```try-html
<form id="order">
  <label>Name <input name="name" required></label><br>
  <label>Quantity <input name="qty" type="number" value="1" min="1"></label><br>
  <label>Size
    <select name="size"><option>1 kg</option><option>2 kg</option></select>
  </label><br>
  <label><input type="checkbox" name="gift"> Gift wrap</label><br>
  <button>Order</button>
</form>
<pre id="out"></pre>
<script>
  const form = document.getElementById("order");
  form.addEventListener("submit", (event) => {
    event.preventDefault();                 // stop the page from reloading
    const data = new FormData(form);
    const order = {
      name: data.get("name"),
      qty: Number(data.get("qty")),
      size: data.get("size"),
      gift: data.get("gift") === "on",
    };
    document.getElementById("out").textContent = JSON.stringify(order, null, 2);
  });
</script>
```

Key ideas:

- Listen for the form's **`submit`** event (it also fires when the user presses Enter).
- `event.preventDefault()` stops the browser's default reload so your code can handle it.
- `new FormData(form)` reads every field by its `name`.
- Values are **strings**; convert numbers with `Number()`.

## Custom validation with friendly messages

```try-html
<style>
  body { font-family: system-ui, sans-serif; }
  .field { margin-bottom: 12px; }
  input { padding: 8px; border: 2px solid #cbd5e1; border-radius: 8px; width: 240px; }
  input.bad { border-color: #dc2626; }
  .err { color: #dc2626; font-size: 14px; margin: 4px 0 0; min-height: 1em; }
  .ok { color: #15803d; font-weight: bold; }
</style>
<form id="signup" novalidate>
  <div class="field"><label>Phone<br><input id="phone" placeholder="0712345678"></label><p class="err" id="phone-err"></p></div>
  <div class="field"><label>Password<br><input id="pw" type="password"></label><p class="err" id="pw-err"></p></div>
  <button>Create account</button>
  <p id="result"></p>
</form>
<script>
  const rules = {
    phone: (v) => /^0[17]\d{8}$/.test(v.replace(/\s/g, "")) ? "" : "Enter 10 digits starting with 07 or 01.",
    pw: (v) => v.length < 8 ? "Use at least 8 characters." : !/\d/.test(v) ? "Add at least one number." : "",
  };
  function check(id) {
    const input = document.getElementById(id);
    const message = rules[id](input.value);
    document.getElementById(id + "-err").textContent = message;
    input.classList.toggle("bad", message !== "");
    return message === "";
  }
  ["phone", "pw"].forEach((id) => document.getElementById(id).addEventListener("input", () => check(id)));
  document.getElementById("signup").addEventListener("submit", (e) => {
    e.preventDefault();
    const allOk = ["phone", "pw"].map(check).every(Boolean);
    document.getElementById("result").innerHTML = allOk ? '<span class="ok">All good! (practice form)</span>' : "";
  });
</script>
```

What's happening:

- `novalidate` switches off the browser's own pop-ups so we can show our own messages.
- A **rule** function per field returns an error message, or `""` if the value is fine.
- Checking on the **`input`** event gives instant feedback while typing.
- On submit we check **all** fields, and only continue if every one passes.

## Regular expressions for common checks

| Check | Pattern |
|---|---|
| Kenyan mobile (07xx/01xx) | `/^0[17]\d{8}$/` |
| International format 2547... | `/^254[17]\d{8}$/` |
| Simple email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Only digits | `/^\d+$/` |
| KRA PIN (A123456789Z) | `/^[AP]\d{9}[A-Z]$/` |

```try-javascript
const toIntl = (p) => p.replace(/\s/g, "").replace(/^0/, "254").replace(/^\+/, "");
console.log(toIntl("0712 345 678"));   // 254712345678 (the format M-Pesa APIs need)
console.log(/^0[17]\d{8}$/.test("0712345678"), /^0[17]\d{8}$/.test("12345"));
```

## Good form UX

- Show errors **next to the field**, in plain words, saying how to fix it.
- Don't clear what the user typed when there's an error.
- Disable the submit button while sending, to stop double payments:

```javascript
button.disabled = true;
button.textContent = "Sending...";
```

- Always validate again on the **server**. Browser checks can be bypassed.

## Why forms matter so much

Forms are where visitors become customers: contact forms, sign-ups, logins, checkout, M-Pesa payment requests, bookings, school applications. A confusing or broken form loses sales; a form with no validation lets bad data (or attacks) into your system. Front-end validation gives instant, friendly feedback; **server-side validation is still required**, because anyone can bypass the browser and send data directly to your server.

| Layer | Purpose | Can it be bypassed? |
|---|---|---|
| HTML attributes (`required`, `type="email"`, `min`, `pattern`) | Basic checks with no code | Yes |
| JavaScript validation | Friendly custom messages, live feedback | Yes |
| Server validation (PHP, Node, Python) | The real gatekeeper: checks everything again | No (if done properly) |
| Database constraints | Last line of defence (NOT NULL, UNIQUE) | No |

## Built-in HTML validation

```try-html
<form id="reg">
  <label>Full name <input name="name" required minlength="3"></label><br>
  <label>Email <input name="email" type="email" required></label><br>
  <label>Phone <input name="phone" required pattern="0[17][0-9]{8}" title="10 digits starting 07 or 01"></label><br>
  <label>Age <input name="age" type="number" min="16" max="80"></label><br>
  <button>Register</button>
</form>
<p id="out"></p>
<script>
  document.getElementById("reg").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    document.getElementById("out").textContent = "Valid! " + JSON.stringify(data);
  });
</script>
```

Try submitting empty or wrong values: the browser blocks the form and shows messages. The **Constraint Validation API** lets JavaScript read these checks: `input.validity.valueMissing`, `input.checkValidity()`, `input.setCustomValidity("message")`.

## Validation logic as plain functions

Keep rules in pure functions so you can test them and reuse them on the server (Node) too:

```try-javascript
const rules = {
  name: v => v.trim().length >= 3 || "Enter your full name (at least 3 letters)",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Enter a valid email address",
  phone: v => /^(?:254|0)[17]\d{8}$/.test(v.replace(/\s+/g, "")) || "Enter a valid phone, e.g. 0712 345 678",
  password: v =>
    (v.length >= 8 && /\d/.test(v) && /[A-Z]/.test(v)) || "At least 8 characters with a number and a capital letter",
};

function validate(data) {
  const errors = {};
  for (const [field, check] of Object.entries(rules)) {
    const result = check(data[field] ?? "");
    if (result !== true) errors[field] = result;
  }
  return errors;
}

console.log(validate({ name: "Jo", email: "jo@site", phone: "0712 345 678", password: "abc" }));
console.log(validate({ name: "Joy Achieng", email: "joy@example.co.ke", phone: "254712345678", password: "Secure123" }));
```

An empty errors object means the form is valid.

## Live validation as the user types

Show errors after the user leaves a field (`blur`) or submits, not on the very first keystroke, which feels aggressive:

```try-html
<style>
  .field { margin-bottom: 12px; font-family: system-ui; }
  .field input { padding: 8px; border: 2px solid #cbd5e1; border-radius: 8px; width: 240px; }
  .field.invalid input { border-color: #dc2626; }
  .field.valid input { border-color: #16a34a; }
  .msg { color: #dc2626; font-size: 13px; min-height: 16px; }
</style>
<form id="f" novalidate>
  <div class="field"><label>Phone<br><input name="phone" inputmode="tel" autocomplete="tel"></label><div class="msg" aria-live="polite"></div></div>
  <div class="field"><label>Amount (KSh)<br><input name="amount" inputmode="numeric"></label><div class="msg" aria-live="polite"></div></div>
  <button>Pay</button>
</form>
<p id="res"></p>
<script>
  const checks = {
    phone: v => /^(?:254|0)[17]\d{8}$/.test(v.replace(/\s+/g, "")) || "Use a number like 0712 345 678",
    amount: v => (Number(v) >= 10 && Number(v) <= 150000) || "Enter an amount between 10 and 150,000",
  };
  const form = document.getElementById("f");
  function checkField(input) {
    const result = checks[input.name](input.value);
    const box = input.closest(".field");
    box.classList.toggle("invalid", result !== true);
    box.classList.toggle("valid", result === true);
    box.querySelector(".msg").textContent = result === true ? "" : result;
    input.setAttribute("aria-invalid", result !== true);
    return result === true;
  }
  form.querySelectorAll("input").forEach(i => {
    i.addEventListener("blur", () => checkField(i));
    i.addEventListener("input", () => { if (i.closest(".field").classList.contains("invalid")) checkField(i); });
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = [...form.querySelectorAll("input")].map(checkField).every(Boolean);
    if (!ok) { form.querySelector(".invalid input").focus(); return; }
    document.getElementById("res").textContent = "Sending request... (demo)";
  });
</script>
```

The amount limits here are just for the demo. Note `aria-live` so screen readers announce errors, and focusing the first invalid field on submit.

## Sending form data to a server

```javascript
form.addEventListener("submit", async e => {
  e.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;                       // prevent double submissions
  button.textContent = "Sending...";
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    form.reset();
    showMessage("Thank you! We'll reply within 24 hours.");
  } catch (err) {
    showMessage("Sorry, we couldn't send your message. Please try again or WhatsApp us.");
  } finally {
    button.disabled = false;
    button.textContent = "Send";
  }
});
```

Disable the button while sending: on slow connections, people tap twice and create duplicate orders or payment prompts.

## Security essentials for forms

- **Validate again on the server**; never trust anything from the browser.
- **Escape output**: when showing user input on a page, use `textContent`, not `innerHTML`, to prevent cross-site scripting (XSS).
- **Never store passwords in localStorage** or send them over plain HTTP. Use HTTPS always.
- Add **spam protection**: a hidden honeypot field, rate limiting or a CAPTCHA.
- Use **CSRF tokens** for forms that change data on sites with logins.
- Collect only the data you need, and explain why (Kenya's Data Protection Act).

```try-javascript
const userInput = '<img src=x onerror="alert(1)">Nice shop!';
// Unsafe: element.innerHTML = userInput   -> the onerror code would run
// Safe:   element.textContent = userInput -> shown as plain text
const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
console.log(escapeHtml(userInput));
```

## Mobile-friendly form tips

| Tip | Why |
|---|---|
| `inputmode="numeric"` or `type="tel"` for phone and amounts | Opens the number keypad |
| `autocomplete="name"`, `"email"`, `"tel"` | Phones fill details automatically |
| Large tap targets (at least 44px tall) | Easier on small screens |
| Labels above fields, not placeholder-only | Placeholders disappear when typing |
| One column layout | Easier to scan on a phone |
| Clear error messages next to the field | Users know exactly what to fix |

## Practice

1. Build a booking form (name, phone, date, service) that refuses dates in the past.
2. Add a "confirm password" field that must match the password.
3. Show a live character counter on a 160-character message field.
4. Write `validateMpesaForm({ phone, amount })` as a pure function and test it with five inputs.
5. Add a honeypot field and ignore submissions where it is filled.

:::think If the JavaScript validation already blocks invalid phone numbers, why must the PHP or Node server validate them again?
Because the browser is under the user's control: JavaScript can be turned off, edited in DevTools, or skipped entirely by sending a request with a tool like curl or Postman. Only checks on the server, which you control, can be trusted to protect your data and payment requests.
:::

```quiz
Q: Which event fires when a form is sent (button click or Enter)?
A: submit
Q: Which method stops the page from reloading when the form is submitted?
A: preventDefault | event.preventDefault() | preventDefault()
Q: Which object reads all fields of a form by their name attribute?
A: FormData | new FormData
Q: Which form attribute turns off the browser's own validation pop-ups?
A: novalidate
Q: Convert 0712345678 to the international format used by M-Pesa APIs.
A: 254712345678
Q: Which property should you use to show user input safely instead of innerHTML?
A: textContent
Q: Which input attribute opens the number keypad on phones?
A: inputmode | inputmode="numeric"
Q: Must you validate again on the server even with JavaScript validation? (yes or no)
A: yes
```
=== exercise ===
Write a function `isKenyanPhone(p)` that returns `true` for `0712345678` using the pattern `/^0[17]\d{8}$/`, then log `isKenyanPhone("0712345678")`.
=== starter ===
function isKenyanPhone(p) {
  
}
console.log(isKenyanPhone("0712345678"));
=== expected ===
true
=== must_contain ===
test
return
