---
slug: buttons-forms
title: "Buttons, forms and calls to action: button styles and states, form design, validation messages and checkout UX"
after: KEEP
---
# Buttons, forms and calls to action: button styles and states, form design, validation messages and checkout UX

Buttons and forms are where visitors **act**: "Get a quote", "Pay with M-Pesa", "Book appointment", "Sign up", "Send message". A beautiful website that has confusing buttons or long, frustrating forms loses customers at the most important moment. This unit covers how to design clear, accessible buttons and calls to action, and forms that people actually complete, including validation messages and mobile-friendly checkout flows.

:::note What you will learn
- Primary, secondary and tertiary buttons
- Button states: hover, focus, active, disabled, loading
- Size, touch targets and placement
- Writing button labels and calls to action
- Form layout and labels
- Choosing input types for mobile keyboards
- Required fields, help text and validation messages
- Reducing friction: fewer fields, autofill, progress steps
- Checkout and payment UX (including M-Pesa)
- Accessibility for buttons and forms
:::

## Button hierarchy

| Type | Look | Use |
|---|---|---|
| **Primary** | Solid, high-contrast accent colour | The **one** main action per screen ("Pay now") |
| **Secondary** | Outline or lighter fill | Alternative actions ("View packages") |
| **Tertiary / text** | Text link style | Low-priority actions ("Cancel", "Learn more") |
| **Destructive** | Red, with confirmation | "Delete account" |

If everything is a bright button, nothing stands out.

```try-html
<style>
  .btn { font: 600 16px system-ui; padding: 12px 20px; border-radius: 10px; border: 2px solid transparent; cursor: pointer; margin: 4px; }
  .primary { background: #ffb800; color: #0b1b35; }
  .primary:hover { background: #e6a600; }
  .secondary { background: #fff; color: #0b1b35; border-color: #0b1b35; }
  .tertiary { background: none; color: #1d4ed8; text-decoration: underline; }
  .btn:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
  .btn:disabled { opacity: .5; cursor: not-allowed; }
</style>
<button class="btn primary">Pay with M-Pesa</button>
<button class="btn secondary">View packages</button>
<button class="btn tertiary">Cancel</button>
<button class="btn primary" disabled>Processing…</button>
```

## Button states

| State | Purpose |
|---|---|
| **Default** | Clearly looks clickable |
| **Hover** | Feedback on desktop (darker/lighter shade) |
| **Focus** | Visible outline for keyboard users: never remove it without a replacement |
| **Active/pressed** | Brief feedback on click/tap |
| **Disabled** | Not available (explain why nearby, e.g. "Enter your phone number first") |
| **Loading** | After clicking: spinner/"Processing…" and prevent double clicks (avoid double payments!) |

## Size and placement

- **Touch targets** at least about **44×44px** (Apple) / 48×48dp (Google) with space between them, so fingers don't hit the wrong button.
- Put the primary button where the eye ends: after the form fields, at the bottom right of dialogs on desktop or full-width on phones.
- Make important CTAs visible without scrolling on landing pages, and repeat them after key sections.
- On phones, a **sticky bottom bar** with "WhatsApp us" or "Call now" works well for local businesses.

## Writing button labels and CTAs

- Use **verbs** that say what happens: "Get my free quote", "Book a site visit", "Download the price list".
- Be specific: "Pay KSh 1,500" beats "Submit".
- Reduce anxiety near the button: "No obligation", "Replies within 1 hour", "Secure M-Pesa payment".
- Keep labels short (2–5 words).

## Form design

### Layout

- **One column**: faster to complete than multi-column forms.
- **Labels above fields** (not only placeholders: placeholder text disappears when typing and is often low-contrast).
- Group related fields (Contact details, Delivery address) with headings.
- Mark optional fields "(optional)" instead of starring everything required, or clearly mark required fields.

### Input types for mobile keyboards

```try-html
<style>
  form.demo { display: grid; gap: 14px; max-width: 360px; font-family: system-ui; }
  form.demo label { display: grid; gap: 6px; font-weight: 600; color: #0f172a; }
  form.demo input, form.demo select, form.demo textarea { font: 16px system-ui; padding: 12px; border: 1.5px solid #cbd5e1; border-radius: 10px; }
  form.demo input:focus { outline: 3px solid #93c5fd; border-color: #2563eb; }
  form.demo small { font-weight: 400; color: #64748b; }
  form.demo button { font: 700 16px system-ui; padding: 14px; border: 0; border-radius: 10px; background: #ffb800; color: #0b1b35; }
</style>
<form class="demo" onsubmit="return false">
  <label>Full name <input name="name" autocomplete="name" required></label>
  <label>Phone number <small>We'll send the M-Pesa prompt to this number</small>
    <input type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="07XX XXX XXX" required></label>
  <label>Email (optional) <input type="email" name="email" autocomplete="email"></label>
  <label>Service <select name="service"><option>Website design</option><option>SEO</option><option>Maintenance</option></select></label>
  <label>Preferred date <input type="date" name="date"></label>
  <label>Message <textarea name="message" rows="3"></textarea></label>
  <button>Get my free quote</button>
</form>
```

| Field | Use | Why |
|---|---|---|
| Phone | `type="tel"` | Number keypad on phones |
| Email | `type="email"` | @ key; basic validation |
| Number | `inputmode="numeric"` | Numeric keypad (for codes, quantities) |
| Date | `type="date"` | Native date picker |
| Autofill | `autocomplete="name"`, `"tel"`, `"email"`, `"street-address"` | Browsers fill details automatically |

Use font-size **16px or more** on inputs; smaller sizes make iPhones zoom in.

## Validation messages

- Validate as the user leaves a field (or on submit), not aggressively on every keystroke.
- Put the message **next to the field**, in plain language, with an icon and colour (not colour alone).
- Say how to fix it: "Enter a Kenyan number like 0712 345 678", not "Invalid input".
- Keep what the user typed; never clear the whole form after an error.
- On submit with errors, move focus to the first error and show a summary.
- Always validate again on the server (see the PHP forms lesson).

```try-html
<div style="font-family:system-ui;max-width:360px">
  <label style="display:grid;gap:6px;font-weight:600">Phone number
    <input value="0712 34" aria-invalid="true" aria-describedby="phone-err" style="font:16px system-ui;padding:12px;border:2px solid #dc2626;border-radius:10px">
  </label>
  <p id="phone-err" style="color:#b91c1c;margin:6px 0 0">⚠ Phone number is too short. Enter 10 digits, like 0712 345 678.</p>
</div>
```

## Reducing friction

- **Ask only what you need**: every extra field lowers completion. Do you really need the address for a quote?
- Use smart defaults and dropdowns where sensible; avoid dropdowns with 2–3 options (use radio buttons).
- **Multi-step forms** with a progress indicator for long processes (applications, bookings).
- Allow **guest checkout**; offer account creation after purchase.
- Show **trust signals** near forms: privacy note, security, reviews.
- Confirm success clearly: "Thanks, Grace! We'll call you within 1 hour." and send a confirmation by SMS/WhatsApp/email.

## Checkout and payment UX

1. Show the **total** clearly, including delivery and fees, before payment.
2. Offer payment methods customers use: **M-Pesa** (STK push and Paybill/Till fallback), cards, pay on delivery where appropriate.
3. For STK push: pre-fill the phone, explain "Check your phone and enter your M-Pesa PIN", show a waiting state with a timer, and handle failures with a clear **Try again** option (see the M-Pesa lesson).
4. Never double-charge: disable the button while processing.
5. Show a receipt page with order number and next steps.

## Accessibility checklist

| ✓ | Check |
|---|---|
| | Use real `<button>` and `<a>` elements (not clickable `<div>`s) |
| | Every input has a visible `<label>` connected to it |
| | Focus states are visible; everything works with the keyboard (Tab, Enter, Space) |
| | Errors use text and icons, not only red; linked with `aria-describedby` |
| | Contrast meets WCAG (text and button borders) |
| | Touch targets are large enough with spacing |

:::think An online shop's checkout has 14 fields, including "Fax number", placeholders instead of labels, tiny buttons labelled "Submit", and no message after clicking pay. What would you change?
Remove unnecessary fields (fax, duplicate address lines); use visible labels with proper input types and autocomplete; one-column layout; a clear primary button like "Pay KSh 4,250 with M-Pesa" that's large and shows a loading state; explain the STK push and show success/failure messages and a receipt; add trust signals and guest checkout.
:::

## Summary

- Use a clear hierarchy: one primary button per screen, with secondary and text buttons for other actions.
- Design all states (hover, focus, active, disabled, loading) and large touch targets.
- Write specific, verb-led CTAs and reassure near the button.
- Build one-column forms with visible labels, the right input types and autocomplete; write helpful validation messages next to fields.
- Reduce friction, design clear M-Pesa checkout flows, and make buttons and forms accessible.

```quiz
Q: How many primary buttons should a screen usually have?
A: 1 | one
Q: What minimum touch target size is commonly recommended? (in px, e.g. 44)
A: 44 | 44px | 48 | 48px | 44x44
Q: Which input type shows a phone keypad on mobile?
A: tel | type="tel"
Q: Should placeholders replace labels? (yes/no)
A: no
Q: What should a button show after clicking Pay to prevent double payments? (one word)
A: loading | processing | disabled
```

=== exercise ===
Make a button with the text **Pay with M-Pesa** that has a `background` colour, `padding` and `border-radius`.
=== starter ===
<style>
  button {  }
</style>
=== expected ===

=== must_contain ===
<button
Pay with M-Pesa
background
padding
border-radius
