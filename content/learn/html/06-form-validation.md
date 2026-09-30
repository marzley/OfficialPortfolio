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
