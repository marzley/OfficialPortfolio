---
slug: forms
title: "Forms: collecting information from users, step by step"
after: KEEP
---
# Forms: collecting information from users, step by step

Every time you log in, search on Google, apply on KUCCPS, register on eCitizen, order food or send a "Contact us" message, you are using an HTML **form**. Forms are how websites stop being leaflets and start doing business: they collect names, phone numbers, orders, payments and applications. This unit explains forms from the ground up: how they work, every main control, how data reaches the server, and how to make forms that people can actually complete on a phone.

:::note What you will learn
- What a form is, why businesses depend on forms and where forms are used
- How a form sends data: `action`, `method`, `name` and what the server receives
- Labels and why every field needs one
- Text inputs, text areas, drop-down menus, checkboxes, radio buttons and buttons
- Grouping fields with `<fieldset>` and `<legend>`
- Making forms easy, accessible and safe (including Kenya's Data Protection Act)
:::

## What is a form?

:::define Form
A section of a page, written with `<form>`, that contains **controls** (text boxes, menus, checkboxes, buttons) where users enter information, and that **submits** that information to a server or to JavaScript for processing.
:::

## Why forms matter

- **They create customers:** a contact or quote form turns a visitor into a lead.
- **They run services:** logins, sign-ups, applications, bookings, payments, surveys and exams.
- **They save time:** a well-made form replaces phone calls, paper forms and queues (think of eCitizen replacing office visits).
- **Bad forms lose money:** confusing or broken forms are one of the main reasons people abandon online purchases and sign-ups.

## Who builds and uses forms, and where

- **Front-end developers** build the HTML, design and checks.
- **Back-end developers** write the server code (PHP, Node.js, Python) that receives, checks and saves the data.
- **Designers and UX specialists** decide the order of fields and wording.
- **Businesses and government** use forms for orders, applications (KRA PIN, passports, KUCCPS), school admissions, hospital bookings, job applications and feedback.

## How a form works, from typing to the server

1. The user fills in the fields and presses **Submit**.
2. The browser collects every field that has a **`name`** and pairs it with its value: `name=Wanjiku`, `phone=0712345678`.
3. It sends them to the address in the form's **`action`** attribute, using the **`method`** (`GET` or `POST`).
4. The **server** (for example a PHP script) receives the data, checks it, saves it in a database or sends an email, and replies with a new page ("Thank you, we'll call you").

```
<form action="/contact.php" method="post">
       │                    │
       │                    └ how to send: post (hidden in the request) or get (in the URL)
       └ where to send the data
```

### GET vs POST

| | `method="get"` | `method="post"` |
|---|---|---|
| Where the data goes | In the URL: `search.php?q=laptops&county=nairobi` | Inside the request body, not in the URL |
| Can be bookmarked / shared | Yes | No |
| Use for | Searches and filters | Logins, sign-ups, orders, messages, anything private or that changes data |
| Size | Limited by URL length | Large (including file uploads) |

```try-html
<form action="https://www.google.com/search" method="get" target="_blank">
  <label for="q">Search Google</label>
  <input id="q" name="q" type="search" placeholder="e.g. best laptops in Kenya">
  <button type="submit">Search</button>
</form>
```

Run it, type something and press Search: look at the new tab's address. You'll see `?q=` followed by your words. That's GET.

:::warning Never send passwords with GET
GET puts values in the URL, which is saved in browser history, server logs and sometimes shared links. Always use `method="post"` (and HTTPS) for passwords and personal data.
:::

### The `name` attribute is essential

Only fields with a `name` are sent. The `name` is the label the **server** uses; `id` is for the page (labels, CSS, links). They're often the same word.

```
<input id="phone" name="phone" type="tel">
```

On the server, PHP reads this as `$_POST['phone']`.

## Labels: every field needs one

A `<label>` is the visible text describing a field. Connect it with `for` (matching the input's `id`):

```try-html
<form>
  <p>
    <label for="fullname">Full name</label><br>
    <input id="fullname" name="fullname" type="text" autocomplete="name">
  </p>
  <p>
    <label>
      <input type="checkbox" name="newsletter"> Send me offers by email
    </label>
  </p>
</form>
```

Why labels matter:

- **Bigger tap target:** tapping the label focuses the field or ticks the box. Very helpful on phones.
- **Screen readers** announce the label when the field is focused. Without it, a blind user hears just "edit text".
- **Clarity:** everyone knows what to type.

:::warning Placeholder is not a label
`placeholder` text (grey hint inside the box) disappears when typing starts, often has poor contrast, and isn't reliably read by all assistive technology. Use it only for examples ("e.g. 0712 345 678"), always **in addition to** a label.
:::

## Text inputs

`<input>` is a void element. Its `type` decides what kind of field it is.

| Type | Use | Phone keyboard |
|---|---|---|
| `text` | Names, general text | Normal |
| `email` | Email addresses (checks for @) | With @ and . |
| `tel` | Phone numbers | Number pad |
| `number` | Quantities, ages | Numbers |
| `password` | Passwords (hidden as dots) | Normal |
| `search` | Search boxes | Normal, with a search key |
| `url` | Web addresses | With / and .com |
| `date`, `time` | Dates and times | Date/time picker |

```try-html
<form>
  <p><label for="em">Email</label><br><input id="em" name="email" type="email" autocomplete="email" placeholder="e.g. wanjiku@gmail.com"></p>
  <p><label for="ph">Phone</label><br><input id="ph" name="phone" type="tel" autocomplete="tel" placeholder="e.g. 0712 345 678"></p>
  <p><label for="qty">Quantity</label><br><input id="qty" name="qty" type="number" min="1" max="20" value="1"></p>
  <p><label for="pw">Password</label><br><input id="pw" name="password" type="password" autocomplete="new-password"></p>
  <p><label for="dt">Delivery date</label><br><input id="dt" name="date" type="date"></p>
</form>
```

Useful attributes:

- `value`: the starting value.
- `placeholder`: an example hint.
- `required`: the form won't submit if empty.
- `autocomplete`: lets the browser fill saved details (`name`, `email`, `tel`, `street-address`, `new-password`), saving users lots of typing on phones.
- `maxlength`, `min`, `max`: limits (the validation unit covers these in depth).
- `disabled` and `readonly`: can't be edited (disabled fields aren't submitted; readonly ones are).

## Text areas: long text

`<textarea>` is for messages and descriptions. It has a closing tag; any text between the tags is the starting value.

```try-html
<form>
  <label for="msg">Tell us about your project</label><br>
  <textarea id="msg" name="message" rows="5" cols="40" placeholder="What does your business do? What pages do you need?"></textarea>
</form>
```

## Drop-down menus: `<select>`

Use a drop-down when there are **many fixed options** (more than about 5): counties, packages, courses.

```try-html
<form>
  <label for="county">County</label><br>
  <select id="county" name="county">
    <option value="">Choose your county</option>
    <optgroup label="Nairobi region">
      <option value="nairobi">Nairobi</option>
      <option value="kiambu">Kiambu</option>
      <option value="kajiado">Kajiado</option>
    </optgroup>
    <optgroup label="Coast">
      <option value="mombasa">Mombasa</option>
      <option value="kilifi">Kilifi</option>
    </optgroup>
  </select>
</form>
```

- `value` is what's sent to the server; the text between the tags is what users see.
- `<optgroup label="...">` groups long lists.
- Add `selected` to an option to pre-select it; `multiple` on the select allows several choices (but checkboxes are usually easier for users).

## Checkboxes and radio buttons

- **Checkboxes**: choose **any number** (zero, one or many). "Which services do you need?"
- **Radio buttons**: choose **exactly one** from a group. Radios with the **same `name`** belong to one group.

```try-html
<form>
  <fieldset>
    <legend>Which services do you need?</legend>
    <label><input type="checkbox" name="services" value="website"> Website</label><br>
    <label><input type="checkbox" name="services" value="hosting"> Hosting</label><br>
    <label><input type="checkbox" name="services" value="seo"> SEO</label>
  </fieldset>

  <fieldset>
    <legend>How should we contact you?</legend>
    <label><input type="radio" name="contact" value="call" checked> Phone call</label><br>
    <label><input type="radio" name="contact" value="whatsapp"> WhatsApp</label><br>
    <label><input type="radio" name="contact" value="email"> Email</label>
  </fieldset>
</form>
```

- `checked` pre-selects an option.
- Always give each option a `value`; without it the browser sends `on`.

:::think Why must all three contact-method radio buttons share the same name="contact"?
The shared `name` is what makes them one group, so selecting one automatically unselects the others, and the server receives a single answer (`contact=whatsapp`). If each had a different name, users could select all three, which makes no sense for "choose one".
:::

## Grouping: `<fieldset>` and `<legend>`

`<fieldset>` groups related fields (a box around them); `<legend>` is the group's title. Screen readers announce the legend with each option ("How should we contact you? WhatsApp, radio button"). Use them for radio groups, checkbox groups and sections of long forms ("Personal details", "Delivery address").

## Buttons

```try-html
<form>
  <input name="code" placeholder="Discount code">
  <button type="submit">Apply code</button>
  <button type="reset">Clear form</button>
  <button type="button" onclick="alert('Help: codes are in your SMS')">Help</button>
</form>
```

| Type | Behaviour |
|---|---|
| `submit` | Sends the form (the default inside a form) |
| `reset` | Clears all fields (rarely a good idea; users click it by accident) |
| `button` | Does nothing by itself; used with JavaScript |

Write clear button text describing the action: "Send message", "Create account", "Pay KSh 1,500", not just "Submit".

## A complete contact form

```try-html
<form action="/contact.php" method="post">
  <h2>Request a free quote</h2>
  <p>
    <label for="name">Your name</label><br>
    <input id="name" name="name" type="text" autocomplete="name" required>
  </p>
  <p>
    <label for="phone">Phone number</label><br>
    <input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="e.g. 0712 345 678" required>
  </p>
  <p>
    <label for="plan">Package</label><br>
    <select id="plan" name="plan">
      <option value="starter">Starter website</option>
      <option value="business">Business website</option>
      <option value="shop">Online shop</option>
    </select>
  </p>
  <p>
    <label><input type="checkbox" name="hosting" value="yes"> I also need hosting and a .co.ke domain</label>
  </p>
  <p>
    <label for="msg">Message (optional)</label><br>
    <textarea id="msg" name="message" rows="4"></textarea>
  </p>
  <p><small>We use your details only to reply to this request.</small></p>
  <button type="submit">Send my request</button>
</form>
```

(In this practice editor the form has nowhere real to send; on a live site `contact.php` would receive it.)

## Making forms easy to complete

1. **Ask only what you need.** Every extra field loses some users.
2. **One column** layout; labels above fields work best on phones.
3. **Use the right input types** so phones show the right keyboard.
4. **Use `autocomplete`** so browsers fill saved details.
5. **Mark optional fields** ("optional") rather than filling the form with asterisks.
6. **Group long forms** into sections or steps.
7. **Clear button text** and a clear success message after submitting.
8. **Helpful error messages** next to the field ("Enter a phone number like 0712 345 678"), not just "Invalid input".

## Security and privacy

- **Never trust form data.** Anyone can change the HTML in their browser or send fake requests. The **server** must check every value (covered in the validation unit and the PHP subject).
- **HTTPS** encrypts data in transit; never collect personal details on an `http://` page.
- **Collect only what you need and say why.** Kenya's **Data Protection Act (2019)** requires organisations to handle personal data lawfully, collect only what's necessary, keep it secure and tell people how it's used. A short privacy note near the button and a privacy policy page are good practice.
- **Protect against spam** with server-side checks, rate limits, or a hidden "honeypot" field.

## Common mistakes

| Mistake | Fix |
|---|---|
| Inputs without `<label>` | Add a label with `for` matching the input's `id` |
| Missing `name` attributes | Add `name` so values are sent |
| Radio buttons with different names | Same `name` for one group |
| `type="text"` for phone and email | Use `tel` and `email` |
| Placeholder used instead of a label | Use both |
| "Submit" button text | Describe the action |
| Passwords sent with GET | Use POST over HTTPS |
| Only checking in the browser | Always check on the server too |

## Practice tasks

1. Build a school admission form: student name, date of birth, gender (radio), class applying for (select), subjects of interest (checkboxes), parent phone and a message.
2. Group it into two fieldsets: "Student details" and "Parent details".
3. Add `autocomplete` values to the name, phone and email fields.
4. Build a search form using GET and explain what the URL looks like after submitting.
5. Look at a real form (eCitizen, a bank, an online shop). List three things it does well and one thing that could be easier.

## Summary

- `<form>` collects data; `action` says where to send it and `method` says how (GET for searches, POST for private data or changes).
- Only fields with a `name` are sent; `id` connects labels and styles.
- Every field needs a `<label>`; placeholder text is only a hint.
- Main controls: `<input>` (many types), `<textarea>`, `<select>`/`<option>`, checkboxes (many choices), radio buttons (one choice per `name`) and `<button>`.
- Group related fields with `<fieldset>` and `<legend>`.
- Keep forms short, phone-friendly and clear; use HTTPS, validate on the server and respect privacy law.

```quiz
Q: Which form attribute says where the data is sent?
A: action
Q: Which method should a login form use? (get or post)
A: post | POST
Q: Which attribute must a field have for its value to be sent?
A: name
Q: Which element describes a field and should be connected with for?
A: label | <label>
Q: Which input type shows a number pad for phone numbers on mobiles?
A: tel
Q: Which control lets users pick exactly one option from a group?
A: radio | radio button | radio buttons
Q: Which element gives a title to a fieldset?
A: legend | <legend>
Q: Which element is used for long multi-line messages?
A: textarea | <textarea>
Q: Which Kenyan law sets rules for collecting personal data? Write its short name.
A: Data Protection Act | the Data Protection Act | Data Protection Act 2019
```
=== exercise ===
Build a form with an email input (`type="email"`) that is `required`, and a submit button.
=== starter ===
<form>
  
</form>
=== expected ===

=== must_contain ===
<form
type="email"
required
<button
