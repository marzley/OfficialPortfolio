---
slug: design-systems-components
title: Design systems and reusable components
after: design-tools-figma
---
# Design systems and reusable components

When a site grows past a few pages, or several people work on it, designs drift: five shades of blue, three button styles, random spacing. A **design system** fixes this with shared rules and reusable pieces. Big companies (Google's Material, Apple's Human Interface Guidelines, Shopify's Polaris) all have one, and even a small business site benefits from a mini version.

## What's in a design system

| Part | Contains | Example |
|---|---|---|
| **Design tokens** | Named values for colours, fonts, spacing, radius, shadows | `--brand: #0b1b35; --space-2: 8px` |
| **Components** | Reusable UI pieces with rules | Button, card, input, alert, navbar |
| **Patterns** | Combinations for common tasks | Login form, pricing table, empty state |
| **Guidelines** | When and how to use things | "One primary button per screen" |
| **Voice & tone** | How the brand writes | Friendly, simple, "we" |

## Design tokens in CSS

```try-html
<style>
  :root {
    /* colour */
    --brand: #0b1b35; --accent: #ffb800; --success: #15803d; --danger: #dc2626;
    --text: #1e293b; --muted: #64748b; --line: #e2e8f0; --surface: #ffffff;
    /* spacing scale (4px base) */
    --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s6: 24px;
    /* shape */
    --radius: 10px; --shadow: 0 6px 18px rgba(15,23,42,.10);
    --font: system-ui, sans-serif;
  }
  body { font-family: var(--font); color: var(--text); padding: var(--s4); }

  /* Button component with variants and sizes */
  .btn { display: inline-flex; align-items: center; gap: var(--s2); padding: var(--s2) var(--s4); border-radius: var(--radius); border: 2px solid transparent; font: 600 15px var(--font); cursor: pointer; }
  .btn-primary { background: var(--brand); color: #fff; }
  .btn-secondary { background: transparent; border-color: var(--brand); color: var(--brand); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-sm { padding: var(--s1) var(--s3); font-size: 13px; }
  .btn:disabled { opacity: .5; cursor: not-allowed; }

  /* Alert component */
  .alert { padding: var(--s3) var(--s4); border-radius: var(--radius); border-left: 4px solid; margin: var(--s3) 0; }
  .alert-success { background: #dcfce7; border-color: var(--success); }
  .alert-danger { background: #fee2e2; border-color: var(--danger); }

  /* Card component */
  .card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--s4); box-shadow: var(--shadow); max-width: 280px; }
  .card h3 { margin: 0 0 var(--s2); }
</style>

<p>
  <button class="btn btn-primary">Pay with M-Pesa</button>
  <button class="btn btn-secondary">View details</button>
  <button class="btn btn-danger btn-sm">Delete</button>
  <button class="btn btn-primary" disabled>Processing…</button>
</p>
<div class="alert alert-success">Payment received. Receipt SJK4H2L9XA.</div>
<div class="alert alert-danger">That phone number doesn't look right.</div>
<div class="card"><h3>Small business website</h3><p>From KSh 25,000</p><button class="btn btn-primary btn-sm">Get a quote</button></div>
```

Change `--brand` or `--radius` once and every component updates. That's the power of tokens.

## Component states

Every interactive component needs designs for its **states**:

| State | Button example |
|---|---|
| Default | Normal |
| Hover | Slightly darker |
| Focus | Clear outline for keyboard users |
| Active/pressed | Pressed in |
| Disabled | Faded, not clickable |
| Loading | Spinner, "Processing…" |
| Error / success | For inputs and forms |

Forgetting states (especially loading and error) is a common reason apps feel broken.

## Components in Figma

In Figma, make a **component** (Ctrl/Cmd + Alt + K) for each reusable piece. Use **variants** for types and states (Primary/Secondary × Default/Hover/Disabled). Save colours and text as **styles/variables**. Then designers use instances, and changing the main component updates them all, mirroring how code works.

## A mini style guide page

For client projects, deliver a single page showing: logo usage, colour palette with hex codes, typography scale, buttons, form fields, cards and icons. It keeps future work consistent, even if someone else maintains the site.

## Existing systems and frameworks

You don't always need to start from zero:

- **CSS frameworks**: Bootstrap, Tailwind CSS (utility classes built on a token scale).
- **Component libraries**: Material UI, shadcn/ui (React), Flutter's Material widgets.

Customise them with your brand tokens so your site doesn't look like everyone else's.

```quiz
Q: What are named values like --brand and --space-2 called? (two words)
A: design tokens | tokens
Q: Name one state besides default that a button needs.
A: hover | focus | disabled | loading | active | pressed
Q: In Figma, what do you call a reusable element whose copies update together?
A: component | a component
Q: What Figma feature groups types and states of one component?
A: variants | variant
Q: Name a popular utility-first CSS framework.
A: Tailwind | Tailwind CSS
```
