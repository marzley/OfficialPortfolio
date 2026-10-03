---
slug: cascade-specificity
title: The cascade, specificity and inheritance
after: pseudo-classes-elements
---
# The cascade, specificity and inheritance

"Why isn't my CSS working?" Nine times out of ten, another rule is winning. The browser decides the winner with three ideas: **specificity**, **order** and **inheritance**. Learn these and you'll debug CSS in seconds.

## 1. Specificity: the more specific selector wins

Think of specificity as a score with three columns: **(IDs, classes, elements)**.

| Selector | IDs | Classes / attributes / pseudo-classes | Elements | Score |
|---|---|---|---|---|
| `p` | 0 | 0 | 1 | 0-0-1 |
| `.price` | 0 | 1 | 0 | 0-1-0 |
| `p.price` | 0 | 1 | 1 | 0-1-1 |
| `.card .price` | 0 | 2 | 0 | 0-2-0 |
| `#total` | 1 | 0 | 0 | 1-0-0 |
| `a:hover` | 0 | 1 | 1 | 0-1-1 |

Compare from the left: one ID beats any number of classes; one class beats any number of elements.

```try-html
<style>
  #total { color: green; }     /* 1-0-0 wins */
  .price { color: blue; }      /* 0-1-0 */
  p { color: red; }            /* 0-0-1 */
</style>
<p class="price" id="total">KSh 1,200: which colour am I?</p>
```

Inline styles (`style="..."`) beat all selectors. `!important` beats even that, but it makes CSS very hard to maintain: avoid it except as a last resort.

## 2. Order: when specificity ties, the last rule wins

```try-html
<style>
  .note { color: blue; }
  .note { color: purple; }  /* same specificity, comes later: wins */
</style>
<p class="note">I am purple.</p>
```

This is also why your own stylesheet should load **after** any framework CSS.

## 3. Inheritance: some properties pass down to children

Text-related properties inherit: `color`, `font-family`, `font-size`, `line-height`, `text-align`. Box properties do not: `margin`, `padding`, `border`, `background`, `width`.

```try-html
<style>
  .card { color: #0b1b35; font-family: Georgia, serif; border: 2px solid #ffb800; padding: 10px; }
</style>
<div class="card">
  <p>This paragraph inherits the colour and font from .card...</p>
  <p>...but not the border or padding.</p>
</div>
```

You can force inheritance with `inherit`, e.g. `a { color: inherit; }` makes links match the surrounding text.

## Debugging: use DevTools

1. Right-click the element → **Inspect**.
2. In the **Styles** panel, rules are listed from most to least specific.
3. Crossed-out properties are losing. Hover to see which rule wins.

## Habits that prevent specificity wars

- Style mostly with **single classes** (`.card-title`), not long chains or IDs.
- Keep specificity low and flat, so later rules can override easily.
- Avoid `!important`.
- Load your CSS in a sensible order: reset → base → components → utilities.

## Why the cascade matters

"Why isn't my CSS working?" is the most common question in web design, and the answer is nearly always the cascade: another rule is winning. On real projects you combine your styles with a theme, a framework like Bootstrap, WordPress plugin styles and browser defaults. Knowing exactly how the browser decides which rule wins lets you fix problems in minutes instead of piling on `!important`.

## The full order the browser uses

When several rules set the same property on the same element, the browser compares them in this order, stopping at the first difference:

1. **Origin and importance**: user-agent (browser defaults) < your styles < `!important` styles (and inline styles beat normal stylesheet rules).
2. **Cascade layers** (`@layer`): later layers win over earlier ones; unlayered styles beat layered ones.
3. **Specificity**: IDs > classes/attributes/pseudo-classes > elements/pseudo-elements.
4. **Order of appearance**: the last rule wins.

Inheritance only applies when **no rule** sets the property on the element itself.

## Calculating specificity

| Selector | IDs | Classes, attributes, pseudo-classes | Elements, pseudo-elements | Score |
|---|---|---|---|---|
| `p` | 0 | 0 | 1 | 0-0-1 |
| `.price` | 0 | 1 | 0 | 0-1-0 |
| `nav a:hover` | 0 | 1 | 2 | 0-1-2 |
| `input[type="email"]` | 0 | 1 | 1 | 0-1-1 |
| `#cart .item p` | 1 | 1 | 1 | 1-1-1 |
| `:where(.card) p` | 0 | 0 | 1 | 0-0-1 (`:where` counts zero) |
| `:is(#a, .b) p` | 1 | 0 | 1 | 1-0-1 (`:is` takes its most specific argument) |
| `*` | 0 | 0 | 0 | 0-0-0 |

Compare from left to right: one ID beats any number of classes.

## Cascade layers: organising big stylesheets

`@layer` lets you decide which groups of styles win, regardless of specificity:

```try-html
<style>
  @layer reset, framework, components, utilities;

  @layer framework {
    #main .btn { background: gray; color: #fff; padding: 10px 16px; border: 0; border-radius: 6px; }
  }
  @layer components {
    .btn { background: #0b1b35; }
  }
  @layer utilities {
    .bg-gold { background: #f59e0b; color: #0b1b35; }
  }
</style>
<div id="main">
  <button class="btn">Components layer wins over a more specific framework rule</button>
  <button class="btn bg-gold">Utilities layer wins over both</button>
</div>
```

Even though `#main .btn` is more specific, the `components` layer is declared later, so it wins. This is how modern teams keep third-party CSS from overpowering their own.

## Inheritance in detail

| Usually inherited | Not inherited |
|---|---|
| `color`, `font-*`, `line-height`, `text-align`, `letter-spacing`, `visibility`, `cursor`, `list-style` | `margin`, `padding`, `border`, `background`, `width`, `height`, `display`, `position` |

You can control inheritance explicitly:

```try-html
<style>
  .box { color: #1d4ed8; border: 2px solid #f59e0b; padding: 8px; font: 14px system-ui; margin: 6px 0; }
  .box button { color: inherit; font: inherit; border: inherit; }   /* buttons don't inherit fonts by default */
  .reset { all: unset; cursor: pointer; text-decoration: underline; }
</style>
<div class="box">Parent text <button>Inherits colour, font and border</button></div>
<div class="box"><button class="reset">all: unset removes default button styling</button></div>
```

| Keyword | Meaning |
|---|---|
| `inherit` | Take the parent's value |
| `initial` | Use the CSS specification's default |
| `unset` | `inherit` if the property inherits, otherwise `initial` |
| `revert` | Go back to the browser's default style |

Form elements (`button`, `input`, `select`) don't inherit fonts by default, which is why many resets include `button, input { font: inherit; }`.

## !important: when (rarely) to use it

```css
/* Acceptable: utility classes that must always win */
.hidden { display: none !important; }

/* Acceptable: overriding a third-party style you can't edit */
.plugin-widget .title { color: #0b1b35 !important; }

/* Bad habit: using it to win every argument */
.price { color: red !important; }   /* the next developer now needs !important too */
```

Each `!important` makes the next change harder. Prefer fixing specificity, using a layer, or adding one class.

## Debugging step by step

1. Right-click the element → **Inspect**.
2. In the **Styles** panel, crossed-out declarations lost to another rule; the winning rule is listed above.
3. The **Computed** tab shows the final value and, when expanded, which rule set it.
4. Check for typos (a misspelled property shows a warning icon), invalid values and the wrong selector.
5. Toggle checkboxes next to declarations to test changes live, then copy the fix into your CSS file.

## Strategies teams use

| Strategy | Idea |
|---|---|
| **BEM naming** (`.card__title--large`) | One class per element; flat, low specificity |
| **Utility-first** (Tailwind) | Small single-purpose classes in HTML |
| **CSS Modules / scoped styles** | Tools make class names unique per component |
| **Layers** | Control priority between reset, framework, components and utilities |

All of them aim for the same thing: low, predictable specificity.

## Common mistakes

| Mistake | Fix |
|---|---|
| Styling with IDs (`#header`) | Use classes; save IDs for links and JavaScript |
| Long selectors (`body div.main ul li a`) | One or two classes |
| Fighting a framework with `!important` | Load your CSS after it, use a layer, or one more class |
| Expecting padding/border to inherit | Set them directly or use `inherit` |
| Forgetting buttons don't inherit fonts | `button { font: inherit; }` |

## Practice

1. Write the specificity of `ul#menu li.active > a:hover`.
2. Create three layers (base, components, utilities) and show a utility overriding a component.
3. Restyle a button so it looks like a link using `all: unset` plus a few properties.
4. Take a stylesheet that uses `!important` five times and rewrite it without any.

:::think Bootstrap sets `.btn-primary { background-color: #0d6efd }` and your `.btn { background: #0b1b35 }` doesn't apply. Name two clean fixes.
Your `.btn` has the same specificity but may load earlier, or is less specific than Bootstrap's combined selectors. Fixes: give your rule equal or greater specificity and load it after Bootstrap (for example `.btn.btn-primary`), override Bootstrap's CSS variables (like `--bs-btn-bg`), or put Bootstrap in an earlier `@layer` so your unlayered styles win.
:::

```quiz
Q: Which wins: #total or .price .amount .value?
A: #total | id | the id
Q: If two rules have the same specificity, which wins: the first or the last?
A: last | the last | the last one
Q: Does padding inherit from a parent? (yes or no)
A: no
Q: Does color inherit from a parent? (yes or no)
A: yes
Q: What is the specificity score of .card .price? Write it like 0-2-0.
A: 0-2-0 | 020 | 0,2,0
Q: Which CSS at-rule groups styles into priority levels independent of specificity?
A: @layer | layer
Q: Which keyword returns a property to the browser's default style?
A: revert
Q: Do form buttons inherit font styles by default? (yes or no)
A: no
```
=== exercise ===
The paragraph is red because `p.intro` is more specific. Add a rule using the **id** `#lead` to make it **green**.
=== starter ===
<style>
  p.intro { color: red; }
  
</style>
<p class="intro" id="lead">Make me green.</p>
=== must_contain ===
#lead
green
