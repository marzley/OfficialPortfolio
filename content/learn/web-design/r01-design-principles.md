---
slug: design-principles
title: "Principles of good design: hierarchy, contrast, alignment, proximity, repetition, white space and usability"
after: KEEP
---
# Principles of good design: hierarchy, contrast, alignment, proximity, repetition, white space and usability

Visitors decide within seconds whether a website looks trustworthy and whether they can find what they need. Good design isn't decoration: it's **communication**. A few principles, used by designers everywhere, make the difference between a page that feels messy and one that guides people calmly to the "Call now" or "Pay with M-Pesa" button. This unit explains each principle with live examples you can edit, and shows how UI (user interface) and UX (user experience) fit together.

:::note What you will learn
- UI vs UX, and why design matters for business
- Visual hierarchy: guiding the eye
- Contrast, alignment, proximity, repetition (CRAP)
- White space and balance
- Consistency and simplicity
- Usability heuristics (Nielsen's 10)
- Gestalt principles in practice
- How to critique a design
:::

## UI vs UX

| | UI (user interface) | UX (user experience) |
|---|---|---|
| Focus | How it **looks**: layout, colours, fonts, buttons | How it **works and feels**: ease, speed, clarity, satisfaction |
| Questions | Is the button visible? Is text readable? | Can a parent pay school fees in under 2 minutes? |
| Skills | Visual design, typography, colour | Research, user flows, testing, information architecture |

They overlap: beautiful but confusing designs fail, and so do usable but ugly ones that customers don't trust.

## Why design matters for business

- **Trust**: people judge credibility by appearance; a dated, cluttered site can lose customers before they read anything.
- **Conversion**: clear layouts and calls to action turn visitors into enquiries and sales.
- **Accessibility**: good design works for more people, including those with visual impairments or slow phones.
- **Efficiency**: consistent design systems make building and updating faster.

## 1. Visual hierarchy

Hierarchy shows what's most important first. Tools: **size, weight, colour, position, spacing**.

Typical order on a service page: headline → short explanation → main call to action → supporting details.

```try-html
<div style="font-family:system-ui,sans-serif;max-width:420px;padding:20px;border:1px solid #e2e8f0;border-radius:12px">
  <p style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;margin:0">Websites for small businesses</p>
  <h2 style="font-size:28px;margin:6px 0 10px;color:#0b1b35">Get more customers online</h2>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">Fast, mobile-friendly websites with M-Pesa payments and WhatsApp chat.</p>
  <a href="#" style="display:inline-block;background:#ffb800;color:#0b1b35;font-weight:700;padding:12px 20px;border-radius:999px;text-decoration:none">Get a free quote</a>
  <p style="color:#94a3b8;font-size:13px;margin:12px 0 0">Replies within 1 hour · No obligation</p>
</div>
```

Squint test: blur your eyes at a design. The things you still see should be the most important.

## 2. Contrast

Make different things look **clearly different**: big vs small, dark vs light, bold vs regular, colourful vs neutral. Weak contrast makes everything blend; strong contrast creates focus. (Text contrast also matters for readability: see the colour lesson.)

## 3. Alignment

Every element should line up with something. Left-aligned text is easiest to read for long content; centred text suits short headings. Random alignment looks careless.

## 4. Proximity

Related items go **close together**; unrelated items are separated by space. A price should sit next to its product; a form label next to its input.

```try-html
<div style="font-family:system-ui,sans-serif;display:flex;gap:24px;flex-wrap:wrap">
  <div style="width:180px">
    <p style="margin:0 0 30px">Laptop bag</p>
    <p style="margin:0 0 30px">KSh 2,500</p>
    <p style="margin:0">Add to cart</p>
  </div>
  <div style="width:180px;border:1px solid #e2e8f0;border-radius:10px;padding:12px">
    <p style="margin:0;font-weight:700">Laptop bag</p>
    <p style="margin:2px 0 12px;color:#16a34a">KSh 2,500</p>
    <a href="#" style="background:#0b1b35;color:#fff;padding:8px 12px;border-radius:8px;text-decoration:none">Add to cart</a>
  </div>
</div>
```

The right card groups name and price, then separates the action: much easier to scan.

## 5. Repetition (consistency)

Repeat the same styles for the same things: all buttons look alike, all headings use the same font and sizes, all cards share spacing. Repetition creates a recognisable brand and makes pages predictable, so users learn once and reuse that knowledge.

## 6. White space

White space (empty space) isn't wasted: it gives content room to breathe, improves readability and makes designs feel premium. Common beginner mistake: filling every gap with text, banners and icons.

## 7. Balance and grids

Arrange elements so the page feels stable: **symmetrical** (formal, calm) or **asymmetrical** (dynamic) balance. Grids (12-column on desktop, 4 on phones) keep layouts organised (see the spacing and layout lesson).

## 8. Simplicity and focus

Each page should have **one main goal**: book, call, buy, sign up. Remove anything that distracts from it. Fewer choices lead to faster decisions.

## Gestalt principles

The brain groups things automatically:

| Principle | Meaning | Use |
|---|---|---|
| **Proximity** | Close items seem related | Group form fields and labels |
| **Similarity** | Similar-looking items seem related | Same style for all links |
| **Enclosure** | Items inside a border/background seem grouped | Cards |
| **Continuity** | Eyes follow lines and paths | Steps, timelines |
| **Figure–ground** | We separate foreground from background | Modals, overlays |
| **Closure** | We complete incomplete shapes | Logos, icons |

## Usability heuristics (Jakob Nielsen's 10)

1. **Visibility of system status**: show loading, "Payment received", progress steps.
2. **Match the real world**: use familiar words ("Pay with M-Pesa", not "Initiate C2B transaction").
3. **User control and freedom**: undo, back, cancel.
4. **Consistency and standards**: follow conventions (logo top-left links home, cart icon top-right).
5. **Error prevention**: confirm destructive actions; input masks for phone numbers.
6. **Recognition rather than recall**: show options instead of making users remember.
7. **Flexibility and efficiency**: shortcuts for experienced users.
8. **Aesthetic and minimalist design**: only relevant information.
9. **Help users recover from errors**: clear messages ("Phone number must start with 07 or 01").
10. **Help and documentation**: FAQs, tooltips.

## How to critique a design

Ask:
1. What's the page's goal? Is it obvious within 5 seconds?
2. What do I see first, second, third?
3. Are related things grouped? Is spacing consistent?
4. Is text readable (size, contrast, line length) on a phone?
5. Is the main action clear and easy to tap?
6. Does it look trustworthy (real photos, reviews, contact details)?

:::think A school website's homepage has six different fonts, a scrolling news ticker, three pop-ups, centred paragraphs in red on blue, and the "Pay fees" link hidden in the footer. Which principles are broken and what would you change?
Repetition/consistency (six fonts), simplicity and focus (ticker, pop-ups), contrast/readability (red on blue), alignment (long centred paragraphs), and hierarchy (the key action buried). Use one or two fonts, remove distractions, use readable dark-on-light text left-aligned, and give "Pay fees" and "Admissions" prominent buttons near the top.
:::

## Summary

- UI is how it looks; UX is how it works and feels; both drive trust and conversions.
- Hierarchy guides the eye using size, weight, colour, position and space.
- Contrast, alignment, proximity and repetition organise designs; white space and balance make them calm and readable.
- Keep one main goal per page; apply Gestalt principles and Nielsen's usability heuristics.
- Critique designs by checking goal clarity, reading order, grouping, readability, actions and trust.

```quiz
Q: What does UX stand for?
A: user experience
Q: Which principle says related items should be placed close together?
A: proximity
Q: Is white space wasted space? (yes/no)
A: no
Q: How many main goals should a landing page usually have?
A: 1 | one
Q: Which usability heuristic is shown by a "Payment received" message? (four words starting "visibility")
A: visibility of system status
```

=== exercise ===
Make a card with a heading **Free website check**, a short paragraph, and a single link styled as a button (give it a `background` colour and `padding`).
=== starter ===
<div>
  
</div>
=== expected ===

=== must_contain ===
<h
Free website check
<p
<a
background
padding
