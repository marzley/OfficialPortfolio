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
