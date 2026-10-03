---
slug: form-inputs-validation
title: Form input types and built-in validation
after: forms
---
# Form input types and built-in validation

In the *Forms* lesson you built a basic form. Now let's make forms that are **easy on phones** and **catch mistakes** before anything is sent, without writing any JavaScript.

## Input types that help on phones

The `type` attribute changes both the checking and the **keyboard** a phone shows:

| type | Use for | Phone keyboard |
|---|---|---|
| `text` | Names, general text | Letters |
| `email` | Email addresses | Has `@` and `.` |
| `tel` | Phone numbers | Number pad |
| `number` | Quantities, ages | Numbers |
| `url` | Website addresses | Has `/` and `.com` |
| `password` | Passwords | Hides what you type |
| `date` | Dates | Date picker |
| `search` | Search boxes | Has a "search" key |
| `checkbox` | Yes/no, many choices | Tick box |
| `radio` | One choice from a group | Round buttons |
| `range` | A slider | Slider |
| `file` | Uploads | File or camera picker |
| `color` | Colour picker | Colour picker |

## Validation attributes

| Attribute | Meaning | Example |
|---|---|---|
| `required` | Must not be empty | `<input required>` |
| `minlength` / `maxlength` | Text length limits | `minlength="8"` |
| `min` / `max` | Number or date limits | `min="1" max="10"` |
| `step` | Allowed steps for numbers | `step="50"` |
| `pattern` | Must match a pattern (regular expression) | `pattern="0[17][0-9]{8}"` |
| `placeholder` | A hint inside the box (not a label!) | `placeholder="0712 345 678"` |
| `autocomplete` | Helps the browser fill it in | `autocomplete="email"` |

## Try it: an order form that checks itself

Press **Send** with empty or wrong values and watch the browser stop you.

```try-html
<style>
  body { font-family: sans-serif; }
  label { display: block; margin-top: 10px; font-weight: bold; }
  input, select { padding: 8px; width: 100%; max-width: 320px; box-sizing: border-box; }
  input:invalid:not(:placeholder-shown) { border: 2px solid #dc2626; }
  input:valid:not(:placeholder-shown) { border: 2px solid #16a34a; }
</style>
<form>
  <label for="name">Full name</label>
  <input id="name" name="name" required minlength="3" autocomplete="name" placeholder="Amina Wanjiru">

  <label for="phone">Safaricom number</label>
  <input id="phone" name="phone" type="tel" required pattern="0[17][0-9]{8}" placeholder="0712345678"
         title="10 digits starting with 07 or 01">

  <label for="email">Email</label>
  <input id="email" name="email" type="email" placeholder="you@example.com">

  <label for="qty">How many cakes? (1 to 10)</label>
  <input id="qty" name="qty" type="number" min="1" max="10" value="1" required>

  <label for="day">Delivery date</label>
  <input id="day" name="day" type="date" required>

  <label for="size">Size</label>
  <select id="size" name="size" required>
    <option value="">Choose a size</option>
    <option>1 kg</option>
    <option>2 kg</option>
  </select>

  <p><label><input type="checkbox" required> I agree to the terms</label></p>
  <button type="button" onclick="if (this.form.reportValidity()) document.getElementById('ok').textContent = 'Looks good! (practice form, nothing is sent)';">Send</button>
  <p id="ok"></p>
</form>
```

## How the pattern works

`pattern="0[17][0-9]{8}"` reads as:

- `0` : the first digit must be 0,
- `[17]` : then a 1 or a 7,
- `[0-9]{8}` : then exactly 8 more digits.

So `0712345678` and `0110123456` pass, but `712345678` and `07123` fail. Add a `title` to explain the format; browsers show it in the error message.

## Radio buttons and checkboxes

Radio buttons in a group share the **same `name`**, so only one can be chosen. Wrap them in `<fieldset>` with a `<legend>` so everyone knows what the question is:

```try-html
<form>
  <fieldset>
    <legend>How will you pay?</legend>
    <label><input type="radio" name="pay" value="mpesa" checked> M-Pesa</label>
    <label><input type="radio" name="pay" value="card"> Card</label>
    <label><input type="radio" name="pay" value="cash"> Cash on delivery</label>
  </fieldset>
  <fieldset>
    <legend>Extras</legend>
    <label><input type="checkbox" name="extra" value="candles"> Candles</label>
    <label><input type="checkbox" name="extra" value="card"> Greeting card</label>
  </fieldset>
</form>
```

## Important: always check on the server too

Built-in validation helps honest users. Anyone can switch it off in their browser, so your server code (PHP, Python...) must **check everything again** before saving or charging money. You'll see this in the PHP lessons.

## Good form habits

- Every input needs a visible `<label>`. Placeholders disappear when you type.
- Ask only for what you need. Every extra field loses customers.
- Use the right `type` so phones show the right keyboard.
- Put helpful formats in the label or `title` ("10 digits starting with 07").

## Who depends on good forms

Every business website collects something: enquiries, bookings, orders, job applications, school admissions, newsletter sign-ups, M-Pesa payment numbers. The right input types and validation attributes make forms faster to fill on phones, reduce mistakes and cut down on fake or broken submissions, all before writing any JavaScript.

## Every input type you should know

| Type | Phone keyboard / control | Use |
|---|---|---|
| `text` | Normal keyboard | Names, short answers |
| `email` | Keyboard with @ and . | Email addresses (checks the format) |
| `tel` | Number pad | Phone numbers |
| `number` | Number pad with arrows | Quantities, ages (not phone numbers or IDs) |
| `url` | Keyboard with / and .com | Website links |
| `password` | Hidden characters | Passwords |
| `search` | Keyboard with a "search" key | Search boxes |
| `date`, `time`, `datetime-local`, `month`, `week` | Date/time pickers | Bookings, deadlines |
| `range` | Slider | Budgets, ratings |
| `color` | Colour picker | Design tools |
| `file` | File chooser / camera | Uploads (CV, ID photo) |
| `checkbox`, `radio` | Tick boxes / choose one | Options |
| `hidden` | Not shown | Extra data sent with the form |

Use `type="tel"` (not `number`) for phone numbers and ID numbers: `number` removes leading zeros, adds arrows and may show "e" for exponents.

## Helpful attributes beyond validation

```html
<input type="text" name="fullname" autocomplete="name" autocapitalize="words" required>
<input type="email" name="email" autocomplete="email" required>
<input type="tel" name="phone" autocomplete="tel" inputmode="tel" pattern="0[17][0-9]{8}" required>
<input type="text" name="otp" autocomplete="one-time-code" inputmode="numeric" maxlength="6">
<input type="password" name="new-password" autocomplete="new-password" minlength="8">
<input type="text" name="town" list="towns">
<datalist id="towns"><option value="Nairobi"><option value="Mombasa"><option value="Kisumu"><option value="Nakuru"><option value="Eldoret"></datalist>
```

- `autocomplete` lets phones fill names, emails, phones and addresses in one tap and lets password managers work. `one-time-code` lets phones suggest SMS verification codes.
- `datalist` gives suggestions while still allowing any value.
- `inputmode` chooses the keyboard without changing validation.

## Try it: a booking form

```try-html
<style>
  form { font: 14px system-ui; max-width: 340px; }
  label { display: block; margin-top: 10px; font-weight: 600; }
  input, select, textarea { width: 100%; box-sizing: border-box; padding: 8px; border: 2px solid #cbd5e1; border-radius: 8px; font: inherit; margin-top: 4px; }
  input:user-invalid, select:user-invalid { border-color: #dc2626; }
  fieldset { border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 12px; }
  fieldset label { display: inline; font-weight: 400; }
  button { margin-top: 14px; padding: 10px 16px; background: #0b1b35; color: #fff; border: 0; border-radius: 8px; font-weight: 700; }
  output { display: block; margin-top: 8px; }
</style>
<form id="book">
  <label for="n">Full name</label>
  <input id="n" name="name" autocomplete="name" required minlength="3">
  <label for="p">Phone</label>
  <input id="p" name="phone" type="tel" autocomplete="tel" required pattern="0[17][0-9]{8}" title="10 digits starting with 07 or 01" placeholder="0712345678">
  <label for="s">Service</label>
  <select id="s" name="service" required>
    <option value="">Choose a service</option>
    <option>Website design</option><option>Computer repair</option><option>Training</option>
  </select>
  <label for="d">Preferred date</label>
  <input id="d" name="date" type="date" required>
  <label for="b">Budget: <output id="bo">20000</output></label>
  <input id="b" name="budget" type="range" min="5000" max="100000" step="5000" value="20000">
  <fieldset>
    <legend>Contact me by</legend>
    <input type="radio" id="c1" name="contact" value="call" required><label for="c1">Call</label>
    <input type="radio" id="c2" name="contact" value="whatsapp"><label for="c2">WhatsApp</label>
  </fieldset>
  <label for="m">Details (optional)</label>
  <textarea id="m" name="details" rows="3" maxlength="300"></textarea>
  <label><input type="checkbox" name="consent" required style="width:auto"> I agree to be contacted about this booking</label>
  <button>Book now</button>
  <output id="res"></output>
</form>
<script>
  const d = document.getElementById("d");
  d.min = new Date().toISOString().slice(0, 10);          // no past dates
  const b = document.getElementById("b");
  b.addEventListener("input", () => document.getElementById("bo").textContent = Number(b.value).toLocaleString());
  document.getElementById("book").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("res").textContent = "Booked: " + JSON.stringify(Object.fromEntries(new FormData(e.target)));
  });
</script>
```

Try submitting with missing fields, a wrong phone number or a past date (the date picker won't allow it).

## Custom messages with setCustomValidity

```javascript
const phone = document.querySelector("#p");
phone.addEventListener("input", () => {
  phone.setCustomValidity("");
  if (phone.validity.patternMismatch) {
    phone.setCustomValidity("Enter a Kenyan mobile number like 0712345678");
  }
});
```

The browser's default messages can be vague ("Please match the requested format"). Custom messages tell users exactly what to do.

## Accessible forms checklist

- Every input has a visible `<label>` connected with `for`/`id` (placeholders are not labels).
- Group radio buttons and checkboxes in `<fieldset>` with a `<legend>`.
- Mark required fields clearly (text such as "required", not only a red star).
- Put help text near the field and connect it with `aria-describedby`.
- Error messages say what went wrong and how to fix it.
- The form works with the keyboard alone (Tab, Space, Enter).

## Where form data goes

```html
<form action="/contact.php" method="post">           <!-- your own server script -->
<form action="https://formspree.io/f/xxxx" method="post">  <!-- a form service -->
<form action="/search" method="get">                  <!-- data appears in the URL: good for search -->
```

- Use `method="post"` for personal data, messages and anything that changes data.
- Use `get` for searches and filters, so results can be bookmarked and shared.
- Add `enctype="multipart/form-data"` when uploading files.
- Protect forms from spam with a hidden honeypot field, rate limiting or a CAPTCHA, and always validate on the server.

## Common mistakes

| Mistake | Fix |
|---|---|
| `type="number"` for phone numbers | `type="tel"` |
| Placeholder instead of a label | Visible `<label>` |
| Asking for unnecessary data | Ask only what you need (Data Protection Act) |
| Long single-page forms with no grouping | Use fieldsets or steps |
| No message after submitting | Show a clear success message or thank-you page |
| Sending personal data with `get` | `post` |

## Practice

1. Build a school admission form with student details, parent phone, class (select) and a file upload for a birth certificate.
2. Add `autocomplete` values to every field of a checkout form.
3. Create a job application form that only accepts PDF uploads (`accept=".pdf"`).
4. Write custom error messages for an email and a phone field.
5. Make a search form that uses `get` and check how the URL changes.

:::think Why is `type="tel"` better than `type="number"` for a phone field like 0712345678?
`number` treats the value as a quantity: it can drop the leading zero, show increment arrows, accept "e" for exponents and reject spaces or "+254". `tel` keeps the value as text exactly as typed while still showing a number keypad on phones; combine it with `pattern` for validation.
:::

```quiz
Q: Which input type shows a number pad for phone numbers on mobile?
A: tel
Q: Which attribute makes a field compulsory?
A: required
Q: Radio buttons in the same group must share the same value for which attribute?
A: name
Q: Which element gives a group of inputs a caption, inside a fieldset?
A: legend
Q: Is browser validation enough on its own, or must the server check again too?
A: server | the server must check again | must check again | both | server too
Q: Which attribute value lets phones auto-fill SMS verification codes?
A: one-time-code | autocomplete="one-time-code"
Q: Which element provides suggestions for a text input while allowing any value?
A: datalist | <datalist>
Q: Which form method should you use for search forms so results can be bookmarked?
A: get | GET
Q: Which enctype is required for file uploads?
A: multipart/form-data
```
=== exercise ===
Make an input for a Kenyan phone number: `type="tel"`, `required` and the pattern `0[17][0-9]{8}`, with a label.
=== starter ===
<form>
  
  <button>Send</button>
</form>
=== must_contain ===
type="tel"
required
pattern="0[17][0-9]{8}"
<label
