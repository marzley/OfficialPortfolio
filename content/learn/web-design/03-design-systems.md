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

## Why design systems matter

As websites and apps grow, inconsistency creeps in: five shades of blue, buttons of different sizes, forms that behave differently on each page. A design system is a shared set of rules, tokens and components that keeps everything consistent and makes design and development faster. Large organisations (Google's Material Design, GOV.UK, Shopify Polaris, IBM Carbon) publish theirs, and even small agencies benefit from a simple version reused across client projects.

## Layers of a design system

| Layer | Contents | Example |
|---|---|---|
| Principles | The values guiding decisions | "Clear over clever", "Mobile first", "Accessible by default" |
| Design tokens | Named values | `--color-primary`, `--space-4`, `--radius-md`, `--font-size-lg` |
| Foundations | Colour, typography, spacing, grid, elevation, motion, icons | A spacing scale of 4, 8, 12, 16, 24, 32, 48 |
| Components | Reusable UI parts with states | Buttons, inputs, cards, modals, navigation, alerts |
| Patterns | Combinations solving common problems | Sign-up form, checkout, search with filters, empty states |
| Documentation | How and when to use each part | Usage guidelines, do/don't examples, code snippets |

## A spacing and sizing scale

Using a consistent scale (often based on 4px or 8px) makes layouts feel balanced:

```css
:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 999px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / .06);
  --shadow-md: 0 4px 12px rgb(0 0 0 / .08);
}
.card { padding: var(--space-5); border-radius: var(--radius-md); box-shadow: var(--shadow-md); }
.stack > * + * { margin-top: var(--space-4); }
```

Designers pick from the scale instead of random values like 13px or 27px.

## Semantic colour tokens and theming

Separate **raw colours** from **meaning**:

```css
:root {
  /* raw palette */
  --blue-600: #1d4ed8; --blue-700: #1e40af;
  --gray-50: #f8fafc;  --gray-900: #0f172a;
  --green-600: #16a34a; --red-600: #dc2626;

  /* semantic tokens */
  --color-bg: var(--gray-50);
  --color-text: var(--gray-900);
  --color-primary: var(--blue-600);
  --color-primary-hover: var(--blue-700);
  --color-success: var(--green-600);
  --color-danger: var(--red-600);
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0b1220;
    --color-text: #e2e8f0;
    --color-primary: #60a5fa;
  }
}
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-primary:hover { background: var(--color-primary-hover); }
```

Components use semantic tokens (`--color-primary`), so rebranding or adding dark mode means changing tokens, not every component.

## Documenting a component: the button

| Aspect | Specification |
|---|---|
| Variants | Primary (main action), Secondary, Outline, Ghost/text, Danger |
| Sizes | Small (32px), Medium (40px), Large (48px) |
| States | Default, hover, focus-visible, active, disabled, loading |
| Content | Short verb phrases: "Get quote", "Pay with M-Pesa"; optional icon |
| Accessibility | Real `<button>` or `<a>`; visible focus; minimum 44px touch target on mobile; loading state announced |
| Usage | One primary button per section; use Danger only for destructive actions |

```html
<button class="btn btn-primary btn-md">Get a quote</button>
<button class="btn btn-outline btn-md" disabled>Unavailable</button>
<button class="btn btn-primary btn-md" aria-busy="true">Processing…</button>
```

## Forms in a design system

Define once and reuse everywhere:

- Label above the field, optional hint text, error message below.
- Consistent field height, border, focus style and error colour.
- Validation rules and message tone ("Enter a phone number like 0712 345 678").
- Patterns for phone numbers, amounts (KSh), dates and file uploads.

## Design tokens across tools

Tokens can be stored once (often in JSON) and exported to CSS variables, Figma variables, and mobile apps (Flutter, Android, iOS), so web and app stay consistent:

```json
{
  "color": { "primary": { "value": "#1d4ed8" }, "danger": { "value": "#dc2626" } },
  "space": { "4": { "value": "16px" } }
}
```

Tools such as Style Dictionary transform token files into platform formats. Figma **variables** and **modes** support light/dark themes and multiple brands.

## Governance: keeping the system alive

- Assign an owner (a person or small team).
- Version the system (v1.2.0) and keep a changelog.
- Have a simple process for proposing new components ("Do we really need a new card type?").
- Review regularly; remove unused components.
- Keep documentation next to code (e.g. a style guide page or Storybook).

## Starting small as a freelancer or small team

You don't need a huge system. Start with:

1. A token file: colours, fonts, font sizes, spacing, radius, shadows.
2. Five core components: button, input, card, alert, navigation.
3. A one-page style guide showing them with their states.
4. Reuse and improve it across projects.

## Practice

1. Create a token set (colours, spacing, radius, shadows, font sizes) as CSS variables.
2. Build a button component with five variants, three sizes and all states.
3. Add dark mode by changing only semantic tokens.
4. Document an input field component with label, hint, error and disabled states.
5. Create a style guide page showing all your components.

:::think A team's website uses 23 slightly different shades of blue and 9 button styles. Rebranding to green will take weeks. How would a design system have helped?
With semantic tokens (e.g. `--color-primary`) and a small set of documented button variants, every component would reference the same values. Rebranding would mean changing a few token values, and all buttons, links and highlights would update consistently, taking hours instead of weeks.
:::

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
Q: Spacing scales are commonly based on multiples of which number of pixels? (4 or 8)
A: 4 | 8 | 4 or 8
Q: What are tokens like --color-primary that describe meaning rather than a raw colour called? (two words)
A: semantic tokens | semantic
Q: What tool is often used to document components next to code?
A: Storybook
```
