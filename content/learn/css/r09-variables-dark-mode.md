---
slug: variables-dark-mode
title: "CSS variables (custom properties) and dark mode: themes that are easy to change"
after: KEEP
---
# CSS variables (custom properties) and dark mode: themes that are easy to change

Imagine a client says: "Change our blue to green everywhere," and the blue appears in 140 places in your CSS. Or users ask for a **dark mode**. **CSS custom properties** (usually called CSS variables) solve both: you define a value once, use it everywhere, and change it in one place, even live with JavaScript or automatically when the user prefers dark mode. This unit covers variables thoroughly and builds a complete light/dark theme system.

:::note What you will learn
- What CSS variables are and why they're better than copy-pasting values
- Declaring (`--name`) and using (`var(--name)`) variables, with fallbacks
- Scope and inheritance: global `:root` variables and local overrides
- Design tokens: colours, spacing, fonts and radii
- Dark mode with `prefers-color-scheme` and a manual toggle
- Changing variables with JavaScript
- Common mistakes
:::

## What are CSS variables?

:::define CSS custom property (variable)
A property you name yourself, starting with two hyphens (`--brand`), that stores a value you can reuse anywhere with `var(--brand)`. Unlike variables in preprocessors such as Sass, CSS variables are **live**: they follow the cascade, inherit, and can change at runtime.
:::

## Declaring and using variables

```try-html
<style>
  :root {
    --brand: #0b1b35;
    --accent: #ffb800;
    --radius: 12px;
    --space: 16px;
  }
  .btn { background: var(--accent); color: var(--brand); padding: calc(var(--space) * 0.75) var(--space); border-radius: var(--radius); border: 0; font: bold 15px sans-serif; }
  .card { border: 2px solid var(--brand); border-radius: var(--radius); padding: var(--space); margin-bottom: var(--space); font-family: sans-serif; }
</style>
<div class="card">Change --brand or --radius in :root and watch everything update.</div>
<button class="btn">Book now</button>
```

- Names start with `--` and are **case-sensitive** (`--Brand` ≠ `--brand`).
- `:root` is the `<html>` element; variables declared there are available everywhere (global).
- `var()` can be used inside other functions like `calc()`.

### Fallback values

`var(--accent, orange)` uses `orange` if `--accent` isn't defined. You can nest: `var(--button-bg, var(--accent, orange))`.

## Scope: global and local variables

Variables **inherit** like `color` does. Redefine a variable on any element to change it for that element and its children only:

```try-html
<style>
  :root { --card-bg: #f1f5f9; --card-text: #0f172a; }
  .card { background: var(--card-bg); color: var(--card-text); padding: 14px; border-radius: 10px; margin: 8px 0; font-family: sans-serif; }
  .card.featured { --card-bg: #0b1b35; --card-text: #ffffff; }   /* local override */
</style>
<div class="card">Normal card</div>
<div class="card featured">Featured card: same CSS, different variables</div>
```

This makes component variations clean: change the variables, not every property.

## Design tokens

Professional teams store all design decisions as variables called **design tokens**:

```
:root {
  /* Colours */
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #0f172a;
  --color-muted: #475569;
  --color-border: #e2e8f0;
  --color-primary: #0b1b35;
  --color-accent: #ffb800;
  --color-danger: #dc2626;
  --color-success: #059669;

  /* Spacing scale */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px;

  /* Typography */
  --font-sans: "Inter", system-ui, sans-serif;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: clamp(1.5rem, 3vw, 2.25rem);

  /* Shapes */
  --radius-sm: 6px; --radius: 12px; --radius-full: 999px;
  --shadow: 0 8px 24px rgb(15 23 42 / 8%);
}
```

Benefits: consistent design, quick rebranding, easier teamwork, and it matches how design tools like Figma define styles ("variables").

## Dark mode

### Why dark mode?

- Many users prefer it, especially at night; it reduces glare.
- On phones with OLED screens, dark interfaces can save some battery.
- Operating systems (Android, iOS, Windows, macOS) let users choose light or dark, and websites can follow that choice.

### Method 1: follow the system setting automatically

```
:root {
  --bg: #ffffff;
  --text: #0f172a;
  --surface: #f1f5f9;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b1220;
    --text: #e2e8f0;
    --surface: #111c33;
  }
}

body { background: var(--bg); color: var(--text); }
.card { background: var(--surface); }
```

Because all colours use variables, the whole site switches by redefining a few values.

```try-html
<style>
  :root { --bg: #ffffff; --text: #0f172a; --surface: #f1f5f9; --accent: #b45309; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #0b1220; --text: #e2e8f0; --surface: #13203a; --accent: #fbbf24; }
  }
  body { background: var(--bg); color: var(--text); font-family: sans-serif; }
  .card { background: var(--surface); padding: 16px; border-radius: 10px; }
  .card a { color: var(--accent); }
</style>
<div class="card">
  <h3>Follows your device theme</h3>
  <p>Switch your device to dark mode and run this again. <a href="#">A link</a></p>
</div>
```

`color-scheme: light dark;` also tells the browser to style form controls and scrollbars appropriately.

### Method 2: a manual toggle (user choice wins)

Users should be able to override the system. Use a `data-theme` attribute on `<html>` and a little JavaScript to set it and remember it:

```try-html
<style>
  :root { --bg: #ffffff; --text: #0f172a; --surface: #f1f5f9; }
  :root[data-theme="dark"] { --bg: #0b1220; --text: #e2e8f0; --surface: #13203a; }
  body { background: var(--bg); color: var(--text); font-family: sans-serif; transition: background-color .2s, color .2s; }
  .card { background: var(--surface); padding: 16px; border-radius: 10px; }
  button { padding: 8px 14px; border-radius: 8px; border: 1px solid #94a3b8; background: var(--surface); color: var(--text); cursor: pointer; }
</style>
<div class="card">
  <p>Theme demo</p>
  <button id="toggle" aria-pressed="false">Dark mode</button>
</div>
<script>
  const btn = document.getElementById("toggle");
  btn.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    btn.setAttribute("aria-pressed", dark);
    btn.textContent = dark ? "Light mode" : "Dark mode";
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  });
</script>
```

On a real site, read the saved choice from `localStorage` **as early as possible** (a tiny script in the `<head>`) to avoid a flash of the wrong theme. This learning hub's moon button works exactly this way.

### Designing a good dark theme

- **Don't use pure black and pure white.** Very dark navy/grey backgrounds (`#0b1220`) with light grey text (`#e2e8f0`) are easier on the eyes.
- **Reduce saturation** of bright colours; strong colours "vibrate" on dark backgrounds. Lighten accent colours to keep contrast.
- **Elevation with lightness**, not shadows: raised surfaces are slightly lighter than the background.
- **Check contrast again** (4.5:1 for text) in dark mode.
- **Images and logos:** provide versions that work on dark backgrounds (e.g. a light logo), or add a light background behind transparent PNGs.

:::think Your logo is navy on a transparent background. What happens in dark mode, and how can you fix it?
Navy on a dark navy background becomes almost invisible. Fixes: use a light or white version of the logo in dark mode (swap with `<picture>` and `prefers-color-scheme`, or with a CSS variable for an SVG's `fill`), or place the logo on a light badge/background.
:::

## Changing variables with JavaScript

```
document.documentElement.style.setProperty("--accent", "#059669");
const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent");
```

Uses: theme pickers, letting users choose brand colours in a website builder, adjusting a progress bar width (`--progress: 70%`).

## Variables vs Sass variables

| | CSS variables | Sass variables (`$brand`) |
|---|---|---|
| Processed | In the browser, live | When compiling Sass to CSS |
| Change at runtime / per element | Yes | No |
| Media queries/themes | Easy | Must output separate CSS |

Modern CSS variables cover most needs that once required Sass.

## Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `var()`: `color: --brand;` | `color: var(--brand);` |
| One hyphen: `-brand` | Two hyphens: `--brand` |
| Case mismatch `--Brand` vs `--brand` | Use one consistent lowercase style |
| Hard-coded colours scattered in CSS | Replace with tokens |
| Dark mode with pure `#000` and `#fff` | Use softer dark and light values |
| Theme flashes on page load | Apply the saved theme in the `<head>` early |
| Forgetting dark-mode contrast and logos | Re-check contrast; provide logo variants |

## Practice tasks

1. Create tokens for colours, spacing and radius, then rebuild a card and button using only variables.
2. Make a `.card.featured` variant purely by overriding variables.
3. Add automatic dark mode with `prefers-color-scheme`.
4. Add a manual toggle that remembers the choice in `localStorage`.
5. Check contrast of your dark theme's text and links with DevTools.

## Summary

- CSS variables: declare `--name: value;` (usually on `:root`), use `var(--name, fallback)`.
- They follow the cascade and inherit; override them locally for variations.
- Use design tokens for colours, spacing, typography and shapes.
- Dark mode: redefine colour variables in `@media (prefers-color-scheme: dark)` and/or `[data-theme="dark"]` with a remembered toggle; design dark themes with soft colours and checked contrast.
- JavaScript can read and change variables at runtime.

```quiz
Q: What do CSS variable names start with?
A: -- | two hyphens | double hyphen
Q: Which function reads a CSS variable?
A: var | var()
Q: Which selector is usually used for global variables?
A: :root | root
Q: Which media feature detects dark mode preference?
A: prefers-color-scheme
Q: Are CSS variable names case-sensitive? (yes or no)
A: yes
Q: Which browser storage is used to remember a theme choice?
A: localStorage | local storage
Q: In var(--accent, orange), what is orange called?
A: fallback | the fallback | fallback value
```
=== exercise ===
Create a variable `--brand` on `:root` and use it as the `background` of `.btn`.
=== starter ===
<style>
  :root {
    
  }
  .btn { padding: 12px; }
</style>
<button class="btn">Pay</button>
=== expected ===

=== must_contain ===
--brand
var(--brand)
