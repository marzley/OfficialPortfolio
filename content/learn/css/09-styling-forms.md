---
slug: styling-forms-buttons
title: "Styling forms and buttons: inputs, focus states, errors and mobile-friendly forms"
after: transitions-animations
---
# Styling forms and buttons: inputs, focus states, errors and mobile-friendly forms

Forms are where websites make money: sign-ups, bookings, orders and payments. Browser default forms look plain and differ between browsers and phones. This unit shows how to style inputs, selects, checkboxes and buttons so they're attractive, consistent, easy to tap and accessible, including clear focus and error states.

:::note What you will learn
- Resetting and styling text inputs, selects and textareas
- Labels, spacing and layout for readable forms
- Focus styles with `:focus` and `:focus-visible`
- Validation states with `:invalid`, `:user-invalid` and error messages
- Styling checkboxes and radios with `accent-color`
- Button styles: primary, secondary, disabled, loading
- Mobile form best practices
:::

## Why styling forms matters

- **Conversion:** clear, friendly forms get completed more often.
- **Trust:** a payment form that looks broken makes people doubt the business.
- **Accessibility:** visible labels, focus outlines and readable error messages help everyone, especially keyboard and screen reader users.
- **Mobile:** small fields and buttons cause mistaps and frustration.

## A clean base for inputs

Form controls don't inherit fonts by default. Start with:

```
input, select, textarea, button { font: inherit; color: inherit; }
```

```try-html
<style>
  .form { max-width: 380px; display: grid; gap: 14px; font-family: system-ui, sans-serif; }
  .field { display: grid; gap: 6px; }
  .field label { font-weight: 600; font-size: 15px; }
  .field input, .field select, .field textarea {
    font: inherit; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; color: #0f172a; width: 100%; box-sizing: border-box;
    transition: border-color .15s, box-shadow .15s;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgb(37 99 235 / 25%);
  }
  .hint { font-size: 13px; color: #64748b; }
</style>
<form class="form">
  <div class="field"><label for="n">Full name</label><input id="n" autocomplete="name"></div>
  <div class="field"><label for="p">Phone</label><input id="p" type="tel" placeholder="0712 345 678"><span class="hint">We'll send an M-Pesa prompt to this number.</span></div>
  <div class="field"><label for="c">County</label><select id="c"><option>Nairobi</option><option>Mombasa</option><option>Kisumu</option></select></div>
  <div class="field"><label for="m">Message</label><textarea id="m" rows="3"></textarea></div>
</form>
```

Key choices: labels **above** fields (best on phones), generous padding (taller fields are easier to tap), a clear border, rounded corners, and a strong focus ring.

:::warning Never remove focus without a replacement
`outline: none` alone makes the form unusable for keyboard users, who can't see which field is active. If you remove the default outline, add a visible alternative (border colour + `box-shadow` ring as above).
:::

### `:focus` vs `:focus-visible`

- `:focus` matches whenever an element has focus (mouse click or keyboard).
- `:focus-visible` matches when the browser decides a focus ring is helpful, mainly keyboard navigation. Use it for buttons and links so mouse users don't see rings on click, while keyboard users still do. For text inputs, always show focus.

## Validation and error states

HTML validation (`required`, `type="email"`, `pattern`) can be styled:

| Pseudo-class | Matches |
|---|---|
| `:invalid` / `:valid` | Fields currently failing/passing validation (even before the user types) |
| `:user-invalid` | Fields that are invalid **after** the user interacted (supported in modern browsers) |
| `:required` / `:optional` | Required or optional fields |
| `:placeholder-shown` | Fields showing their placeholder (empty) |
| `:disabled` | Disabled fields |

```try-html
<style>
  .f { display: grid; gap: 6px; max-width: 340px; font-family: system-ui, sans-serif; }
  .f input { padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font: inherit; }
  .f input:user-invalid { border-color: #dc2626; background: #fef2f2; }
  .f .error { display: none; color: #b91c1c; font-size: 13px; }
  .f input:user-invalid + .error { display: block; }
  .f input:valid:not(:placeholder-shown) { border-color: #059669; }
</style>
<form class="f">
  <label for="e">Email</label>
  <input id="e" type="email" required placeholder="you@example.com">
  <span class="error">⚠ Enter a valid email address, like wanjiku@gmail.com.</span>
</form>
<p style="font-family:sans-serif">Type something invalid, then click outside the field.</p>
```

Error message rules:
- Show errors **next to the field** in text (not colour alone), with an icon.
- Explain how to fix: "Enter a phone number like 0712 345 678" beats "Invalid input".
- Use `aria-describedby` to connect the message to the input for screen readers (with JavaScript-driven validation).
- Never rely only on browser validation: the server must check too.

## Checkboxes, radios and range sliders

`accent-color` restyles native controls with one line, keeping their accessibility:

```try-html
<style>
  .opts { accent-color: #f59e0b; font-family: sans-serif; }
  .opts label { display: flex; align-items: center; gap: 8px; padding: 8px 0; }
  .opts input { width: 20px; height: 20px; }
</style>
<div class="opts">
  <label><input type="checkbox" checked> Website</label>
  <label><input type="checkbox"> Hosting</label>
  <label><input type="radio" name="pay" checked> M-Pesa</label>
  <label><input type="radio" name="pay"> Card</label>
  <label>Budget <input type="range" min="10000" max="100000"></label>
</div>
```

Fully custom checkboxes are possible (`appearance: none` and drawing your own) but take care to keep focus states, sizes and keyboard behaviour.

### Option cards (radio buttons styled as selectable cards)

```try-html
<style>
  .plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; font-family: system-ui, sans-serif; }
  .plan { position: relative; display: block; border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px; cursor: pointer; }
  .plan input { position: absolute; opacity: 0; }
  .plan strong { display: block; }
  .plan:has(input:checked) { border-color: #0b1b35; background: #fff7e0; }
  .plan:has(input:focus-visible) { outline: 3px solid #2563eb; outline-offset: 2px; }
</style>
<div class="plans">
  <label class="plan"><input type="radio" name="plan" checked><strong>Starter</strong>KSh 15,000</label>
  <label class="plan"><input type="radio" name="plan"><strong>Business</strong>KSh 35,000</label>
  <label class="plan"><input type="radio" name="plan"><strong>Shop</strong>KSh 40,000</label>
</div>
```

`:has()` (the "parent selector", supported by modern browsers) styles the card when its radio is checked. The input remains in the page (just invisible), so keyboard and screen readers still work.

## Buttons

```try-html
<style>
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 10px; border: 2px solid transparent; font: 600 15px system-ui, sans-serif; cursor: pointer; transition: background-color .15s, transform .1s; }
  .btn:active { transform: translateY(1px); }
  .btn:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
  .btn-primary { background: #0b1b35; color: #fff; }
  .btn-primary:hover { background: #1e3a6b; }
  .btn-secondary { background: #fff; color: #0b1b35; border-color: #0b1b35; }
  .btn-danger { background: #dc2626; color: #fff; }
  .btn:disabled { opacity: .5; cursor: not-allowed; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading::before { content: ""; width: 14px; height: 14px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin .7s linear infinite; }
</style>
<p>
  <button class="btn btn-primary">Pay KSh 1,500</button>
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-danger">Delete</button>
  <button class="btn btn-primary" disabled>Disabled</button>
  <button class="btn btn-primary loading" aria-busy="true">Processing…</button>
</p>
```

Button guidelines:
- One **primary** button per form/screen; secondary actions look quieter.
- **Minimum height ~44px** for touch.
- Clear labels: "Pay KSh 1,500", "Create account".
- States: hover, active (pressed), focus-visible, disabled, loading.
- Use `<button>` for actions and `<a>` for navigation, even if they look the same.

## Mobile form best practices

- **Font size at least 16px** in inputs (iPhones zoom in on smaller text in focused inputs).
- **Full-width fields** and buttons on phones.
- **Correct input types** (`tel`, `email`, `number`) and `autocomplete` so phones show the right keyboard and autofill.
- **Space** between fields so fingers don't hit the wrong one.
- **Keep the submit button visible** and not covered by fixed elements like chat bubbles.

## Common mistakes

| Mistake | Fix |
|---|---|
| Inputs using the browser's small default font | `font: inherit` and 16px+ |
| Removing focus outlines | Visible custom focus styles |
| Red border as the only error signal | Text message + icon |
| Errors shown before the user typed | Use `:user-invalid` or validate on blur/submit |
| Tiny checkboxes and radios | Larger size and full-label tap areas |
| Several primary-looking buttons | One primary action |
| Links styled as buttons doing actions | Use `<button>` |

## Practice tasks

1. Style a booking form: labels above fields, 12px padding, rounded borders and a blue focus ring.
2. Add error styling with `:user-invalid` and a helpful message under the email field.
3. Restyle checkboxes and radios with `accent-color` and larger sizes.
4. Build radio "plan cards" using `:has(input:checked)`.
5. Create a button system with primary, secondary, danger, disabled and loading states.

## Summary

- Give form controls `font: inherit`, generous padding, clear borders and labels above fields.
- Always provide visible focus styles (`:focus`, `:focus-visible`).
- Style validation with `:invalid`, `:user-invalid`, `:placeholder-shown`, and show text error messages.
- `accent-color` restyles checkboxes, radios and ranges simply; `:has()` enables selectable option cards.
- Buttons need clear hierarchy, 44px height, all states, and the right element (`<button>` vs `<a>`).
- On phones: 16px+ inputs, full-width fields, correct types and autocomplete.

```quiz
Q: Which pseudo-class matches a field that is invalid after the user interacted with it?
A: :user-invalid | user-invalid
Q: Which property restyles checkbox and radio colours with one line?
A: accent-color
Q: What minimum font size in inputs stops iPhones zooming in? Write in px.
A: 16px | 16
Q: Which pseudo-class shows focus mainly for keyboard users?
A: :focus-visible | focus-visible
Q: Which selector lets a parent react to a checked input inside it? Write it with the colon.
A: :has | :has() | has
Q: Should errors be shown by colour alone? (yes or no)
A: no
```
=== exercise ===
Style `input` with a `padding` and add an `input:focus` rule that changes its `border-color`.
=== starter ===
<style>
  input { border: 1px solid #ccc; }
</style>
<input placeholder="Phone number">
=== expected ===

=== must_contain ===
padding
:focus
border-color
