---
slug: organising-css-performance
title: "Organising CSS for real projects: naming (BEM), file structure, reuse and performance"
after: css-debugging-devtools
---
# Organising CSS for real projects: naming (BEM), file structure, reuse and performance

A 50-line stylesheet is easy. A real business site or web app can have thousands of lines, edited by several people over years. Without organisation, CSS becomes "append-only": nobody dares delete anything, rules fight each other, and every change breaks something else. This unit teaches how professionals structure CSS: naming conventions like **BEM**, file organisation, reusable components, modern features (nesting, layers) and performance.

:::note What you will learn
- Why CSS gets messy and the principles that keep it clean
- Naming conventions: BEM
- Organising files and sections
- Components, utilities and design tokens
- Keeping specificity low; cascade layers and nesting
- CSS performance: size, loading, critical CSS, fonts
:::

## Why CSS gets messy

- **Global scope:** every rule can affect any element anywhere.
- **Specificity wars:** fixing one thing with a stronger selector forces the next fix to be even stronger, until `!important` appears everywhere.
- **No ownership:** unclear which rules belong to which part of the site.
- **Fear of deleting:** unused CSS piles up.

## Principles of maintainable CSS

1. **Low, flat specificity:** mostly single class selectors (`.card-title`), not `#main div ul li a`.
2. **Components:** style reusable blocks (card, button, navbar) independently of where they appear.
3. **Consistency:** design tokens (variables) for colours, spacing and fonts.
4. **Predictable naming:** names tell you what something is and where its styles live.
5. **Delete freely:** if components are self-contained, removing one doesn't break others.

## BEM naming

**BEM** stands for **Block, Element, Modifier**:

| Part | Syntax | Example | Meaning |
|---|---|---|---|
| Block | `.block` | `.card` | A standalone component |
| Element | `.block__element` | `.card__title`, `.card__price` | A part of the block (double underscore) |
| Modifier | `.block--modifier` | `.card--featured` | A variation (double hyphen) |

```try-html
<style>
  .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; max-width: 260px; font-family: system-ui, sans-serif; margin-bottom: 10px; }
  .card__title { margin: 0 0 4px; font-size: 18px; }
  .card__price { color: #475569; margin: 0 0 12px; }
  .card__button { display: inline-block; background: #0b1b35; color: #fff; padding: 8px 14px; border-radius: 8px; text-decoration: none; }
  .card--featured { border-color: #f59e0b; background: #fff7e0; }
  .card--featured .card__button { background: #f59e0b; color: #0b1b35; }
</style>
<div class="card">
  <h3 class="card__title">Starter website</h3>
  <p class="card__price">KSh 15,000</p>
  <a class="card__button" href="#">Choose</a>
</div>
<div class="card card--featured">
  <h3 class="card__title">Business website</h3>
  <p class="card__price">KSh 35,000 · Most popular</p>
  <a class="card__button" href="#">Choose</a>
</div>
```

Benefits: you know `.card__price` belongs to the card component, specificity stays at one class, and the same card works anywhere on the site.

## Organising files

For a small to medium site, one file with clear sections works:

```
/* =========================================
   1. Tokens (variables)
   2. Reset / base (html, body, headings, links, images)
   3. Layout (container, grid, header, footer)
   4. Components (buttons, cards, forms, navbar, modal)
   5. Pages (home hero, pricing page specifics)
   6. Utilities (.sr-only, .text-center, .mt-4)
   7. Media queries per component, or at the end
   ========================================= */
```

For bigger projects, split into files and combine them with a build tool or `@import` during build:

```
css/
├── tokens.css
├── base.css
├── layout.css
├── components/
│   ├── button.css
│   ├── card.css
│   └── navbar.css
├── pages/
│   └── home.css
└── utilities.css
```

Avoid many separate `<link>` files in production without bundling: each file is an extra request (HTTP/2 reduces the cost, but bundling and minifying is still common).

## Base styles and resets

A small, modern base:

```
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-sans); line-height: 1.6; color: var(--color-text); background: var(--color-bg); }
img, svg, video { display: block; max-width: 100%; height: auto; }
input, button, select, textarea { font: inherit; }
h1, h2, h3 { line-height: 1.2; }
a { color: var(--color-link); }
```

## Utilities

Small single-purpose classes for common needs:

```
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }   /* visible to screen readers only */
.text-center { text-align: center; }
.mt-4 { margin-top: var(--space-4); }
```

Keep utilities few and consistent (or use a utility framework like Tailwind).

## Keeping specificity under control

| Avoid | Prefer |
|---|---|
| `#header .nav ul li a` | `.nav__link` |
| Styling by IDs | Classes |
| `!important` to win fights | Fix the selector or order (reserve `!important` for utilities and reduced-motion overrides) |
| Qualifying classes with elements (`div.card`) | `.card` |

### `:where()` for zero specificity

`:where(.content) a { ... }` has the specificity of just `a`, making base styles easy to override.

### Cascade layers (`@layer`)

Modern CSS lets you declare layers whose order decides priority, regardless of selector specificity:

```
@layer reset, base, components, utilities;

@layer base { a { color: navy; } }
@layer components { .btn { color: white; } }
@layer utilities { .text-red { color: red; } }
```

Later layers win over earlier ones; great for taming third-party CSS (put a framework in an early layer so your styles win easily).

### Native CSS nesting

Modern browsers support nesting (previously only in Sass):

```
.card {
  padding: 16px;
  & .card__title { font-size: 18px; }
  &:hover { box-shadow: var(--shadow); }
  @media (min-width: 700px) { padding: 24px; }
}
```

Nest shallowly; deep nesting recreates long, specific selectors.

## CSS performance

CSS is **render-blocking**: the browser won't paint the page until it has downloaded and parsed the CSS in the `<head>`. Keep it fast:

1. **Keep CSS small:** remove unused rules (Chrome DevTools **Coverage** tab shows unused CSS); avoid importing huge frameworks for a few components.
2. **Minify** for production (removes spaces and comments) and enable **compression** (gzip/Brotli) on the server.
3. **Cache:** use long cache times with versioned file names (`style.css?v=abc123` or `style.abc123.css`) so returning visitors don't download CSS again. (This site does this.)
4. **Critical CSS:** inline the small amount of CSS needed for the first screen in `<head>`, load the rest after; useful for slow mobile networks.
5. **Avoid `@import` chains** inside CSS files; they load one after another.
6. **Fonts:** use few font weights, `font-display: swap`, self-host or preconnect, and prefer WOFF2.
7. **Efficient effects:** large `box-shadow` and `filter: blur()` on many elements can slow scrolling on budget phones.

:::think Your site's CSS is 400 KB because the whole Bootstrap framework plus three icon libraries are included, but only a few components are used. What can you do?
Remove the libraries you don't need, include only the Bootstrap components you use (Bootstrap's Sass source lets you import selected parts), subset or replace icon fonts with a few inline SVG icons, run the Coverage tool to find unused CSS, then minify and compress. Smaller CSS means faster first paint, especially on mobile data.
:::

## Documentation and teamwork

- Comment sections and non-obvious decisions ("/* 3px nudge aligns the icon with the text baseline */").
- Keep a simple style guide page showing buttons, forms, cards and colours.
- Use a linter (**Stylelint**) and formatter (**Prettier**) for consistent code.
- Use version control (**Git**) so changes can be reviewed and undone.

## Common mistakes

| Mistake | Fix |
|---|---|
| Deep, specific selectors | Single classes with BEM |
| `!important` everywhere | Fix specificity/order; use layers |
| Page-specific hacks scattered everywhere | Components + page sections |
| Unused CSS never removed | Coverage tool; self-contained components |
| Huge frameworks for small sites | Plain CSS or selected components |
| No caching/versioning | Versioned, minified, cached files |

## Practice tasks

1. Rewrite a messy stylesheet's card section using BEM names.
2. Organise your project's CSS into the seven sections listed above.
3. Use the Coverage tab to find how much of a website's CSS is unused on its home page.
4. Put a third-party stylesheet into an early `@layer` and override it easily.
5. Minify your CSS with a free online minifier or build tool and compare file sizes.

## Summary

- Maintainable CSS uses low specificity, self-contained components, design tokens and predictable naming.
- **BEM:** `.block`, `.block__element`, `.block--modifier`.
- Organise CSS into tokens, base, layout, components, pages and utilities; bundle for production.
- Use `:where()`, `@layer` and shallow native nesting to control the cascade.
- Performance: small, minified, compressed, cached CSS; critical CSS for the first screen; efficient fonts and effects.

```quiz
Q: What does the B in BEM stand for?
A: Block
Q: In BEM, which separator marks an element? (two characters)
A: __ | double underscore
Q: In BEM, which separator marks a modifier? (two characters)
A: -- | double hyphen
Q: Which pseudo-class gives a selector zero specificity?
A: :where | :where() | where
Q: Which at-rule creates cascade layers?
A: @layer | layer
Q: Which DevTools tab shows unused CSS?
A: Coverage
Q: Is CSS in the head render-blocking? (yes or no)
A: yes
```
