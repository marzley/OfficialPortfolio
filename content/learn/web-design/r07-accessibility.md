---
slug: accessibility
title: "Accessible design for everyone: disabilities, WCAG, semantic HTML, keyboard use, screen readers, forms, media and testing"
after: KEEP
---
# Accessible design for everyone: disabilities, WCAG, semantic HTML, keyboard use, screen readers, forms, media and testing

**Accessibility (a11y)** means designing websites and apps that everyone can use, including people who are blind or have low vision, are deaf or hard of hearing, have motor impairments (using a keyboard, switch or voice instead of a mouse), have cognitive or learning disabilities, or are older. It also helps everyone in temporary or situational limits: a broken arm, bright sunlight on a phone, a noisy matatu, a slow connection. Accessible sites reach more customers, rank better (many accessibility practices overlap with SEO), and reduce legal risk. Kenya's Constitution and disability laws, and international standards like WCAG, all point toward inclusive digital services.

:::note What you will learn
- Who benefits from accessibility (permanent, temporary, situational)
- WCAG principles (POUR) and conformance levels
- Semantic HTML and landmarks
- Headings and page structure
- Keyboard accessibility and focus
- Screen readers, alt text and ARIA basics
- Colour, contrast and text sizing
- Accessible forms and error messages
- Video, audio and motion
- Testing tools and a practical checklist
:::

## Who benefits

| Type | Examples | Needs |
|---|---|---|
| **Visual** | Blindness, low vision, colour blindness | Screen readers, zoom, good contrast, alt text |
| **Hearing** | Deaf, hard of hearing | Captions, transcripts |
| **Motor** | Limited hand movement, tremors | Keyboard/voice navigation, large targets |
| **Cognitive** | Dyslexia, ADHD, memory issues | Simple language, clear layout, consistent navigation |
| **Temporary/situational** | Injury, bright sun, holding a baby, noisy places | Same solutions help everyone |

## WCAG: the standard

The **Web Content Accessibility Guidelines** (WCAG, by the W3C) define success criteria grouped under four principles, **POUR**:

| Principle | Meaning | Examples |
|---|---|---|
| **Perceivable** | Users can see/hear content | Alt text, captions, contrast |
| **Operable** | Users can use the interface | Keyboard access, enough time, no seizure-triggering flashes |
| **Understandable** | Content and UI are clear | Plain language, predictable navigation, helpful errors |
| **Robust** | Works with assistive technologies | Valid semantic HTML, correct ARIA |

Levels: **A** (minimum), **AA** (the common target for organisations and many laws), **AAA** (highest). Aim for **WCAG 2.2 AA**.

## Semantic HTML: the foundation

Use elements for their meaning; browsers and screen readers understand them automatically:

| Use | Instead of |
|---|---|
| `<button>` for actions | `<div onclick>` |
| `<a href>` for navigation | `<span>` with JavaScript |
| `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` | Many anonymous `<div>`s |
| `<h1>`–`<h6>` in order | Bold text pretending to be headings |
| `<ul>`/`<ol>` for lists | Lines with dashes |
| `<table>` with `<th>` for data | Tables for layout |
| `<label>` connected to inputs | Placeholder-only fields |

```try-html
<header style="font-family:system-ui"><a href="#main" class="skip">Skip to main content</a>
  <nav aria-label="Main"><a href="/">Home</a> · <a href="/services">Services</a> · <a href="/contact">Contact</a></nav>
</header>
<main id="main" style="font-family:system-ui">
  <h1>Website design in Nairobi</h1>
  <h2>Our packages</h2>
  <ul><li>Starter website</li><li>Online shop</li></ul>
  <button type="button">Get a quote</button>
</main>
<style>
  .skip { position: absolute; left: -999px; }
  .skip:focus { left: 8px; top: 8px; background: #ffb800; padding: 8px; }
</style>
```

A **skip link** lets keyboard users jump past the navigation (press Tab in the preview to reveal it).

## Headings and structure

- One `<h1>` per page describing its topic; then `<h2>` for sections, `<h3>` for subsections; don't skip levels for styling.
- Screen-reader users often navigate by headings, so headings should make sense as an outline.
- Use landmarks (`header`, `nav`, `main`, `footer`) so users can jump between regions.

## Keyboard accessibility

Many people navigate with **Tab**, **Shift+Tab**, **Enter**, **Space** and arrow keys.
- Every interactive element must be reachable and usable by keyboard.
- **Visible focus**: never remove outlines without a clear replacement (`:focus-visible` styles).
- Logical tab order (follow the visual order; avoid positive `tabindex`).
- Menus, dialogs and dropdowns: open/close with keyboard; `Esc` closes dialogs; focus moves into a dialog and returns afterwards.
- No keyboard traps.

Test: unplug your mouse and try to complete a booking or checkout.

## Screen readers and alt text

Screen readers (NVDA and JAWS on Windows, VoiceOver on iPhone/Mac, TalkBack on Android) read content aloud.

**Alt text** describes images' **purpose**:

| Image | Good alt |
|---|---|
| Product photo | `alt="Black leather laptop bag with front zip pocket"` |
| Logo linking home | `alt="Marzley Tech Solutions home"` |
| Chart | Summarise the key point, with data in text or a table |
| Decorative image | `alt=""` (empty, so screen readers skip it) |
| Icon button | Accessible name: `<button aria-label="Close menu">✕</button>` |

Avoid "image of..." and filenames like "IMG_2045.jpg".

### ARIA (use sparingly)

ARIA attributes add meaning when HTML can't: `aria-label`, `aria-expanded` (menus), `aria-describedby` (error messages), `aria-live` (announce updates like "Payment received"). The first rule of ARIA: **use native HTML first**; wrong ARIA makes things worse.

```try-html
<button aria-expanded="false" aria-controls="faq1" onclick="const o=this.getAttribute('aria-expanded')==='true';this.setAttribute('aria-expanded',!o);document.getElementById('faq1').hidden=o;" style="font:16px system-ui;padding:10px 14px">Do you accept M-Pesa?</button>
<div id="faq1" hidden style="font-family:system-ui;padding:8px 0">Yes. Pay via STK push at checkout or to our Paybill.</div>
<p role="status" aria-live="polite" style="font-family:system-ui">Status messages placed in a live region are announced by screen readers.</p>
```

## Colour, contrast and text

- Contrast at least **4.5:1** for normal text, **3:1** for large text and UI components (see the colour lesson).
- Don't use colour alone to convey meaning.
- Text resizable to 200% without breaking layout; use relative units (rem).
- Avoid text in images (unreadable for screen readers and blurry when zoomed).
- Readable fonts, adequate line height and line length.

## Accessible forms

- Visible `<label>` for every field (connected with `for`/`id` or wrapping).
- Clear instructions before fields ("Phone format: 07XX XXX XXX").
- Errors in text, linked with `aria-describedby`, focus moved to the first error.
- Group related options with `<fieldset>` and `<legend>` (e.g. delivery method).
- Don't set short timeouts on forms; warn and allow extensions.
- Avoid CAPTCHAs that only work visually; use accessible alternatives.

## Video, audio and motion

- **Captions** for videos (YouTube auto-captions need correction); **transcripts** for audio/podcasts.
- Don't autoplay audio; provide pause controls for carousels and animations.
- Respect `prefers-reduced-motion` for users sensitive to motion:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
```

- Nothing should flash more than three times per second.

## Plain language and cognitive accessibility

- Short sentences, common words, clear headings, lists.
- Consistent navigation and button placement across pages.
- Explain jargon; show steps for complex processes (applications, payments).
- Offer Kiswahili versions where your audience needs them.

## Testing

| Method | Tools |
|---|---|
| Automated scans (find around a third of issues) | Lighthouse (Chrome DevTools), axe DevTools, WAVE |
| Keyboard test | Tab through every page and flow |
| Screen reader test | NVDA (free, Windows), VoiceOver (Mac/iPhone), TalkBack (Android) |
| Zoom test | Browser zoom to 200%; phone large text settings |
| Contrast | WebAIM Contrast Checker |
| Real users | Ask people who use assistive technology for feedback |

## Accessibility checklist

| ✓ | Check |
|---|---|
| | Semantic HTML: buttons, links, landmarks, headings in order |
| | All images have appropriate alt text (empty for decorative) |
| | Fully keyboard usable with visible focus; skip link |
| | Contrast meets WCAG AA; colour not the only cue |
| | Forms have labels, instructions and helpful errors |
| | Videos captioned; no autoplay audio; reduced motion respected |
| | Page has `lang` attribute (`<html lang="en">`) and descriptive titles |
| | Works at 200% zoom and on small screens |

:::think A county government services page uses images of text for instructions, has an icon-only "search" button with no label, and a fee payment form where errors are shown only by turning fields red. Who is excluded and how do you fix it?
Screen-reader users can't read image text or understand the unlabeled button; colour-blind users and screen-reader users miss red-only errors; zoom users get blurry text. Fix: real HTML text, `aria-label="Search"` (or visible text) on the button, and error messages in text with icons linked via `aria-describedby`, plus labels and a keyboard test.
:::

## Summary

- Accessibility helps people with permanent, temporary and situational disabilities, and improves usability and SEO for all.
- Follow WCAG's POUR principles and aim for level AA.
- Use semantic HTML, proper heading order, landmarks and skip links.
- Ensure keyboard access with visible focus, meaningful alt text, and careful ARIA only when needed.
- Meet contrast rules, build accessible forms, caption media, respect reduced motion, and test with automated tools, keyboards and screen readers.

```quiz
Q: What do the letters POUR stand for? (four words)
A: perceivable operable understandable robust | perceivable, operable, understandable, robust
Q: What alt text should a purely decorative image have?
A: empty | alt="" | ""
Q: Which WCAG level do most organisations aim for?
A: AA
Q: Which element should you use for a clickable action instead of a div?
A: button | <button>
Q: Which media feature lets you reduce animations for sensitive users?
A: prefers-reduced-motion
Q: Name a free screen reader for Windows.
A: NVDA
```
