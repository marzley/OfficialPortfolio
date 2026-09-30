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
