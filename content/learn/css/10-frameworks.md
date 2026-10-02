---
slug: css-frameworks-bootstrap-tailwind
title: "CSS frameworks: Bootstrap and Tailwind CSS, when to use them and how they work"
after: variables-dark-mode
---
# CSS frameworks: Bootstrap and Tailwind CSS, when to use them and how they work

Many professional websites aren't styled entirely from scratch. Developers use **CSS frameworks**: ready-made collections of styles and components that speed up building. Job adverts in Kenya and abroad often mention **Bootstrap** or **Tailwind CSS**. This unit explains what frameworks are, how Bootstrap and Tailwind differ, how to start with each, and when plain CSS is the better choice.

:::note What you will learn
- What a CSS framework is, and its pros and cons
- Bootstrap: grid, components and utility classes
- Tailwind CSS: utility-first styling and how it builds CSS
- Other options (Bulma, Pico, component libraries)
- Choosing between plain CSS, Bootstrap and Tailwind
- Why learning real CSS first still matters
:::

## What is a CSS framework?

:::define CSS framework
A pre-written library of CSS (sometimes with JavaScript) that provides a layout system, ready-made components (buttons, navbars, cards, modals) and helper classes, so developers can build consistent, responsive interfaces faster.
:::

### Pros
- **Speed:** build pages quickly with ready components.
- **Consistency:** spacing, colours and typography follow one system.
- **Responsive by default:** grids and utilities handle breakpoints.
- **Teamwork:** many developers already know the framework.
- **Documentation and community:** answers for most problems online.

### Cons
- **Sites can look generic** ("every Bootstrap site looks the same") without customisation.
- **Extra weight** if you include styles you don't use.
- **Learning the framework's way** instead of CSS itself; debugging is hard without CSS knowledge.
- **Lock-in:** redesigning away from a framework can be work.

## Bootstrap

**Bootstrap** (created at Twitter, first released in 2011) is one of the most widely used frameworks. It provides a 12-column responsive grid, components (navbar, cards, modals, forms, alerts, carousels) and utility classes.

### Adding Bootstrap (quick start with a CDN)

```
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

(Check getbootstrap.com for the current version.)

### The grid

```
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">Card 1</div>
    <div class="col-12 col-md-6 col-lg-4">Card 2</div>
    <div class="col-12 col-md-6 col-lg-4">Card 3</div>
  </div>
</div>
```

- `container` centres content with a max-width.
- `row` holds columns; each row has **12 columns**.
- `col-12` = full width on phones; `col-md-6` = half width from the `md` breakpoint (≥768px); `col-lg-4` = one third from `lg` (≥992px).

### Components and utilities

```
<button class="btn btn-primary">Book now</button>
<div class="card p-3 shadow-sm">
  <h5 class="card-title">Websites</h5>
  <p class="text-muted mb-0">From KSh 15,000</p>
</div>
<div class="d-flex justify-content-between align-items-center gap-2">...</div>
```

Utility classes like `p-3` (padding), `mb-0` (margin-bottom 0), `d-flex` (display flex) and `text-center` cover common styles. Bootstrap is customised through **Sass variables** or **CSS variables** (e.g. changing `--bs-primary`).

**Good for:** admin dashboards, school/business systems, prototypes, teams wanting ready components (modals, dropdowns, tabs) with JavaScript behaviour included.

## Tailwind CSS

**Tailwind CSS** is a **utility-first** framework: instead of components like `.card`, you compose designs from small single-purpose classes directly in HTML.

```
<div class="max-w-sm rounded-xl border border-slate-200 p-4 shadow-sm">
  <h3 class="text-lg font-bold text-slate-900">Websites</h3>
  <p class="mt-1 text-slate-600">From KSh 15,000</p>
  <a href="#" class="mt-3 inline-flex rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700">Get a quote</a>
</div>
```

| Class | CSS |
|---|---|
| `p-4` | `padding: 1rem` |
| `mt-3` | `margin-top: 0.75rem` |
| `rounded-xl` | Large border radius |
| `text-slate-600` | A grey text colour from Tailwind's palette |
| `hover:bg-slate-700` | Background on hover |
| `md:grid-cols-3` | 3 grid columns from the `md` breakpoint |
| `dark:bg-slate-900` | Background in dark mode |

### How Tailwind builds CSS

Tailwind scans your files for class names and generates **only the CSS you use**, so the final CSS file is usually small. You install it with a build tool (npm, Vite, a framework like Next.js or Laravel), or use the Play CDN for quick experiments (not recommended for production).

### Pros and cons of Tailwind

- **Pros:** fast styling without naming classes; consistent design scale; tiny production CSS; works great with component frameworks (React, Vue, Laravel Blade) where markup is reused.
- **Cons:** long class lists in HTML; requires a build step; you still need to understand CSS concepts (flexbox, grid, spacing) to use it well.

**Good for:** modern web apps, React/Next.js projects, custom designs, startups. Very common in current job listings.

## Other options

| Option | Notes |
|---|---|
| **Bulma** | Component framework, CSS-only (no JavaScript) |
| **Pico CSS** | Minimal "classless" styling: plain semantic HTML looks good |
| **Foundation** | Older, flexible framework |
| **Component libraries** | Material UI, Chakra, shadcn/ui (for React); Flutter/React Native have their own |
| **Sass** | Not a framework: a CSS preprocessor (variables, nesting, mixins); much less necessary now that CSS has variables and nesting |

## Choosing

| Situation | Good choice |
|---|---|
| Learning web development | **Plain CSS first** |
| Simple business website with a unique design | Plain CSS (small, fast) |
| Admin panel, internal system, quick prototype | Bootstrap |
| Custom-designed web app with React/Vue/Laravel | Tailwind |
| WordPress site | Theme's own CSS + small customisations |

:::think A beginner who only knows Bootstrap classes is asked to fix a layout bug on a site built with plain CSS. What problem might they have?
They may not understand what Bootstrap classes were doing underneath (Flexbox, margins, breakpoints), so they can't read or debug plain CSS. Frameworks are tools built **on** CSS; developers who understand CSS can use any framework, but framework-only knowledge doesn't transfer well.
:::

## Practice tasks

1. Build the same pricing card three ways: plain CSS, Bootstrap classes, Tailwind classes. Compare the code.
2. Create a Bootstrap grid with 3 cards that become 2 columns on tablets and 1 on phones.
3. Use the Tailwind Play website (play.tailwindcss.com) to build a responsive navbar.
4. Change Bootstrap's primary colour using its CSS variables.
5. Write down which approach you'd use for: a school portal, a salon landing page, a React startup app.

## Summary

- CSS frameworks provide grids, components and utilities to build faster and consistently.
- **Bootstrap:** component-based, 12-column grid, utility classes, JavaScript components; great for systems and dashboards.
- **Tailwind:** utility-first classes composed in HTML; generates only used CSS; popular for modern apps.
- Frameworks speed up work but can look generic and add a learning layer; always learn plain CSS first.

```quiz
Q: How many columns does Bootstrap's grid row have?
A: 12 | twelve
Q: Is Tailwind CSS component-first or utility-first?
A: utility-first | utility first | utility
Q: In Bootstrap, what does the class col-md-6 make an element on medium screens? (fraction)
A: half | half width | 1/2
Q: Which framework generates only the CSS classes you use in your files?
A: Tailwind | Tailwind CSS
Q: Should beginners learn plain CSS before frameworks? (yes or no)
A: yes
Q: What is Sass: a framework or a preprocessor?
A: preprocessor | a preprocessor
```
