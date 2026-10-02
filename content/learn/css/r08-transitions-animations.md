---
slug: transitions-animations
title: "Transitions and animations: smooth hover effects, keyframes and motion done right"
after: KEEP
---
# Transitions and animations: smooth hover effects, keyframes and motion done right

Motion makes interfaces feel alive and helps users understand what's happening: a button that gently changes colour on hover, a menu that slides open, a loading spinner, a card that lifts when touched. CSS can do all of this without JavaScript. But motion done badly is distracting, slow, or even makes some people physically ill. This unit teaches **transitions**, **keyframe animations**, timing, performance and accessible motion.

:::note What you will learn
- The difference between transitions and animations
- `transition` properties: property, duration, timing function, delay
- Easing curves and how they feel
- `@keyframes` and the `animation` properties
- Common UI animations: hover lifts, fade-ins, spinners, skeleton loaders, pulses
- Performance: animate `transform` and `opacity`
- `prefers-reduced-motion` and accessible motion
:::

## Transitions vs animations

| | Transition | Animation |
|---|---|---|
| Triggered by | A **change of state** (hover, focus, class added) | Starts on its own (page load) or when applied |
| Steps | Start → end | Any number of steps (`@keyframes`) |
| Repeats | No (runs when the state changes) | Can loop forever |
| Example | Button colour on hover | Loading spinner |

## Transitions

A **transition** animates the change between two values of a property.

```try-html
<style>
  .btn {
    background: #0b1b35; color: #fff; border: 0; padding: 12px 20px; border-radius: 10px; font: bold 15px sans-serif; cursor: pointer;
    transition: background-color 0.25s ease, transform 0.25s ease;
  }
  .btn:hover, .btn:focus-visible { background: #f59e0b; color: #0b1b35; transform: translateY(-3px); }
</style>
<button class="btn">Hover or focus me</button>
```

### The four parts

```
transition: background-color 0.25s ease-in-out 0s;
            │                │     │           │
            property         duration  timing  delay
```

| Property | Meaning |
|---|---|
| `transition-property` | Which property to animate (`opacity`, `transform`, `background-color`, or `all`) |
| `transition-duration` | How long (`200ms`, `0.3s`) |
| `transition-timing-function` | The speed curve (`ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier(...)`) |
| `transition-delay` | Wait before starting |

Separate several transitions with commas. Avoid `transition: all`: it animates unexpected properties and can hurt performance.

### Not everything can transition

Properties with in-between values animate (colours, sizes, opacity, transforms, shadows). Properties like `display: none → block` can't smoothly animate in the traditional way; instead animate `opacity` and `visibility` (or `transform`).

## Timing functions (easing)

Easing describes how speed changes during the motion:

| Easing | Feels like | Good for |
|---|---|---|
| `linear` | Constant speed, mechanical | Spinners, progress bars |
| `ease` (default) | Quick start, gentle end | General use |
| `ease-out` | Fast then slows to a stop | Things **entering** the screen |
| `ease-in` | Slow then speeds up | Things **leaving** the screen |
| `ease-in-out` | Slow, fast, slow | Moving between positions |

```try-html
<style>
  .track { position: relative; height: 34px; background: #f1f5f9; margin: 6px 0; border-radius: 6px; font: 12px sans-serif; }
  .dot { position: absolute; left: 4px; top: 4px; width: 26px; height: 26px; border-radius: 50%; background: #2563eb; transition: left 1.5s; }
  .race:hover .dot { left: calc(100% - 30px); }
  .track span { position: absolute; right: 8px; top: 9px; color: #64748b; }
</style>
<div class="race">
  <p style="font-family:sans-serif">Hover this area to race the dots:</p>
  <div class="track"><div class="dot" style="transition-timing-function: linear"></div><span>linear</span></div>
  <div class="track"><div class="dot" style="transition-timing-function: ease-in"></div><span>ease-in</span></div>
  <div class="track"><div class="dot" style="transition-timing-function: ease-out"></div><span>ease-out</span></div>
  <div class="track"><div class="dot" style="transition-timing-function: ease-in-out"></div><span>ease-in-out</span></div>
</div>
```

### Good durations

- Small UI feedback (buttons, colours): **100–250ms**
- Larger movements (menus, panels, modals): **200–400ms**
- Anything over ~500ms for routine UI feels slow and gets annoying.

## Keyframe animations

`@keyframes` defines the steps; the `animation` property applies them.

```try-html
<style>
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card { animation: fade-up 0.6s ease-out both; padding: 16px; background: #fff7e0; border: 1px solid #f59e0b; border-radius: 10px; margin-bottom: 8px; font-family: sans-serif; }
  .card:nth-child(2) { animation-delay: 0.15s; }
  .card:nth-child(3) { animation-delay: 0.3s; }
</style>
<div>
  <div class="card">Websites</div>
  <div class="card">Apps</div>
  <div class="card">Hosting</div>
</div>
<p style="font-family:sans-serif">Press Run again to replay.</p>
```

### Animation properties

| Property | Example | Meaning |
|---|---|---|
| `animation-name` | `fade-up` | Which `@keyframes` |
| `animation-duration` | `0.6s` | Length of one cycle |
| `animation-timing-function` | `ease-out` | Easing |
| `animation-delay` | `0.2s` | Wait before starting |
| `animation-iteration-count` | `3`, `infinite` | How many times |
| `animation-direction` | `alternate` | Play backwards on alternate cycles |
| `animation-fill-mode` | `both`, `forwards` | Keep the start/end styles before/after the animation |
| `animation-play-state` | `paused` | Pause/resume |

Shorthand: `animation: name duration timing delay count direction fill-mode;`

### Percent keyframes

```
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.08); }
  100% { transform: scale(1); }
}
```

## Useful UI animations

### Loading spinner

```try-html
<style>
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 36px; height: 36px; border: 4px solid #e2e8f0; border-top-color: #0b1b35; border-radius: 50%; animation: spin 0.8s linear infinite; }
</style>
<div class="spinner" role="status" aria-label="Loading"></div>
```

### Skeleton loader (shimmer)

```try-html
<style>
  @keyframes shimmer { from { background-position: -200px 0; } to { background-position: 200px 0; } }
  .sk { height: 14px; margin: 8px 0; border-radius: 6px; background: linear-gradient(90deg, #e2e8f0 0, #f8fafc 50%, #e2e8f0 100%); background-size: 400px 100%; animation: shimmer 1.2s linear infinite; }
</style>
<div style="max-width:320px"><div class="sk" style="width:60%"></div><div class="sk"></div><div class="sk" style="width:80%"></div></div>
```

Skeletons show the shape of content while data loads, which feels faster than a blank page.

### Attention pulse (use sparingly)

```try-html
<style>
  @keyframes ring { 0% { box-shadow: 0 0 0 0 rgb(37 211 102 / 60%); } 100% { box-shadow: 0 0 0 16px rgb(37 211 102 / 0%); } }
  .wa { display: inline-block; background: #25d366; color: #fff; padding: 12px 18px; border-radius: 999px; font: bold 14px sans-serif; animation: ring 1.8s ease-out infinite; text-decoration: none; }
</style>
<a class="wa" href="#">WhatsApp us</a>
```

## Performance: animate `transform` and `opacity`

Browsers can animate `transform` (move, scale, rotate) and `opacity` very cheaply, often on the GPU, without recalculating layout. Animating `width`, `height`, `top`, `left` or `margin` forces layout recalculation every frame, which can stutter on budget phones.

| Instead of animating | Animate |
|---|---|
| `left`/`top` | `transform: translate(...)` |
| `width`/`height` (to grow) | `transform: scale(...)` |
| `display`/`visibility` for fades | `opacity` |

`will-change: transform;` hints to the browser to prepare, but use it sparingly (only on elements about to animate).

:::think Why might a beautiful animation that runs smoothly on your laptop stutter on a customer's KSh 10,000 phone?
Budget phones have much slower processors and GPUs. If the animation changes layout properties (width, top, margin) or animates many elements at once, the phone can't redraw 60 times per second. Animating only `transform` and `opacity`, keeping animations short, and testing on a real low-end phone avoids this.
:::

## Accessible motion

Some people experience dizziness, nausea or migraines from motion (vestibular disorders), and moving content distracts people with attention difficulties. Operating systems have a **"reduce motion"** setting; respect it:

```
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Other rules:
- Nothing should flash more than **three times per second** (seizure risk).
- Auto-playing motion longer than 5 seconds needs a way to **pause** it (WCAG).
- Motion should support understanding (feedback, showing where something came from), not just decorate.

## Common mistakes

| Mistake | Fix |
|---|---|
| `transition: all` | List specific properties |
| Very long durations (1s+) for UI | 100–400ms |
| Animating `width`, `left`, `margin` | Animate `transform` and `opacity` |
| Endless decorative animations | Use sparingly; pause after a while |
| Hover-only effects | Also style `:focus-visible`; remember phones have no hover |
| Ignoring reduced motion | Add a `prefers-reduced-motion` block |

## Practice tasks

1. Make a button that changes colour and lifts 3px on hover and keyboard focus, in 200ms.
2. Create cards that fade up one after another on page load using `animation-delay`.
3. Build a loading spinner and a three-line skeleton loader.
4. Add a `prefers-reduced-motion` block and test it (turn on "reduce motion" in your phone or computer accessibility settings).
5. Convert an animation that uses `left` into one using `transform: translateX()`.

## Summary

- **Transitions** animate between states (hover, focus, class changes): `transition: property duration timing delay`.
- **Animations** use `@keyframes` and `animation-*` properties for multi-step or looping motion.
- Choose easing deliberately (`ease-out` for entering, `ease-in` for leaving) and keep UI durations short (100–400ms).
- Animate `transform` and `opacity` for smooth performance on budget phones.
- Respect `prefers-reduced-motion`, avoid flashing, and use motion to help understanding.

```quiz
Q: Which CSS feature animates between two states, like on hover?
A: transition | transitions
Q: Which at-rule defines the steps of an animation? Write it with the @.
A: @keyframes | keyframes
Q: Which easing is best for elements entering the screen?
A: ease-out
Q: Which animation-iteration-count value loops forever?
A: infinite
Q: Name one of the two properties that are cheapest to animate.
A: transform | opacity
Q: Which media feature detects users who want less motion?
A: prefers-reduced-motion
Q: Nothing should flash more than how many times per second?
A: 3 | three
```
=== exercise ===
Give `.btn` a `transition` on `background-color` and change its background on `:hover`.
=== starter ===
<style>
  .btn { background: navy; color: white; padding: 12px 18px; border: 0; }
</style>
<button class="btn">Pay now</button>
=== expected ===

=== must_contain ===
transition
:hover
background
