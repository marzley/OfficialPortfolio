---
slug: css-debugging-devtools
title: "Debugging CSS with browser DevTools: find and fix any layout problem"
after: cascade-specificity
---
# Debugging CSS with browser DevTools: find and fix any layout problem

Every developer writes CSS that doesn't work the first time. The difference between beginners and professionals isn't avoiding bugs; it's **finding them quickly**. Browser **DevTools** (built into Chrome, Edge, Firefox and Safari) show exactly which rules apply to an element, which are overridden, its box model, flex and grid lines, and how it looks on a phone. This unit teaches a step-by-step debugging method and the DevTools features you'll use daily.

:::note What you will learn
- Opening DevTools and inspecting elements
- Reading the Styles panel: applied, overridden and invalid rules
- The Computed tab and box model diagram
- Flexbox and Grid overlays
- Device mode for responsive testing
- Finding horizontal scroll, overflow and z-index problems
- A reliable debugging checklist
:::

## Opening DevTools

- **Windows/Linux:** `F12` or `Ctrl+Shift+I`; **Mac:** `Cmd+Option+I`.
- Or right-click any element → **Inspect**: DevTools opens with that element selected.
- On Android, you can debug a phone's Chrome from a computer via USB (`chrome://inspect`), useful for phone-only bugs.

## The Elements panel

The left side shows the live **DOM** (the HTML after the browser parsed it and JavaScript changed it). Hovering a node highlights it on the page with margin (orange), padding (green) and content (blue) overlays.

You can:
- Double-click to edit text or attributes.
- Drag elements to reorder them (temporarily).
- Right-click → **Force state** → `:hover`, `:focus`, `:active` to inspect hover styles without holding the mouse.

## The Styles panel

For the selected element, Styles lists **every matching rule**, most specific first:

- **Crossed-out** declarations are overridden by a more specific or later rule.
- A **warning triangle** marks an invalid property or value (typo like `colr` or `20 px`).
- Greyed-out properties don't apply (e.g. `width` on an inline element; DevTools often explains why when you hover the icon).
- Each rule shows its **source file and line** (click to jump to it).
- Click any value to edit it live; use arrow keys to nudge numbers (Shift for steps of 10).
- Tick boxes toggle declarations on/off to see their effect.
- Add new rules with **+**.

:::tip Edits are temporary
Changes in DevTools disappear on reload. When you find the fix, copy it into your real CSS file.
:::

## The Computed tab and box model

**Computed** shows final values after the cascade (e.g. the actual `font-size` in px) and a **box model diagram** with exact content size, padding, border and margin. Click a computed property to see which rule set it. This is how you answer "why is this box 350px when I wrote 300px?" (padding and border with `content-box`).

## Flexbox and Grid tools

In the Elements panel, containers show a small **flex** or **grid** badge. Click it to overlay:
- Grid line numbers, track sizes, gaps and named areas.
- Flex item boundaries and free space.
Chrome's flexbox editor lets you click to try `justify-content` and `align-items` values visually.

## Device mode (responsive testing)

Click the phone/tablet icon (`Ctrl+Shift+M`):
- Choose device presets or drag the width freely.
- Throttle network ("Slow 4G") and CPU to feel budget-phone performance.
- See which media queries exist (enable "Show media queries" in the device toolbar menu) and click to jump to a breakpoint.

Remember: device mode simulates sizes, but real phones can still behave differently (fonts, touch, performance). Test on a real phone too.

## Solving common CSS problems

### "My style isn't applying"

1. Inspect the element. Is your rule listed?
   - **Not listed:** the selector doesn't match (typo in class name, wrong element, missing dot) or the CSS file didn't load (check the **Network** tab for a 404 on `style.css`, or the **Console** for errors).
   - **Listed but crossed out:** another rule wins. See which one (more specific or later), then adjust specificity or order.
   - **Warning triangle:** invalid syntax; fix the typo.
2. Check the cache: hard refresh with `Ctrl+Shift+R`.

### "There's a horizontal scrollbar on mobile"

Some element is wider than the screen. Find it:
1. In device mode at 360px width, scroll right and look for what sticks out.
2. Or paste this in the **Console** to list elements wider than the viewport:

```
[...document.querySelectorAll("*")].filter(e => e.getBoundingClientRect().right > innerWidth + 1).forEach(e => console.log(e));
```

3. Usual culprits: images without `max-width: 100%`, fixed widths, wide tables, long words or URLs (`overflow-wrap: anywhere`), `100vw` elements (which include the scrollbar width), negative margins.

A temporary debugging trick to see every box:

```
* { outline: 1px solid red; }
```

### "There's a mysterious gap"

Inspect the elements around the gap and check the box model: usually margins (including collapsing margins), default browser margins on `body`, `h1` or `p`, line-height on inline images (fix with `display: block` on the image), or whitespace between `inline-block` elements.

### "z-index doesn't work"

Check: is the element positioned (or a flex/grid item)? Is it inside a **stacking context** with a lower z-index (look for parents with `z-index`, `transform`, `opacity < 1`, `filter`)? The Layers panel (Chrome: More tools → Layers) can visualise stacking.

### "My hover style doesn't show"

Use **Force state → :hover** in the Elements panel. Check specificity versus the normal state rule, and remember phones don't hover.

### "The font looks different"

Computed tab → scroll to **Rendered fonts** at the bottom to see which font file is actually used (maybe your web font failed to load and a fallback is showing).

## The debugging checklist

1. **Reproduce** the problem reliably (which page, which screen size, which browser).
2. **Inspect** the exact element.
3. **Read** the Styles panel: missing, crossed-out or invalid?
4. **Check** the box model and Computed values.
5. **Toggle** declarations on/off to find the cause.
6. **Isolate**: remove things until the bug disappears, then add them back.
7. **Fix** in your source file, then **test** on other screen sizes and browsers.
8. **Learn**: note the cause so you recognise it next time.

:::think A button looks correct on your laptop but its text is cut off on a small Android phone. What DevTools steps would you take?
Use device mode at a small width (e.g. 360px) and inspect the button. Check its computed width/height and padding: a fixed `height` or `width` or `white-space: nowrap` may be cutting text off. Toggle those declarations, try `min-height` instead of `height` and allow wrapping, then confirm on the real phone (fonts may be bigger there, especially if the user has increased text size).
:::

## Other useful panels

| Panel | Use |
|---|---|
| **Console** | JavaScript errors, quick tests |
| **Network** | Did CSS, images and fonts load? File sizes and timing |
| **Lighthouse** | Performance, accessibility, SEO audits |
| **Performance** | Find slow animations and layout thrashing |
| **Accessibility tree / contrast checker** | Names, roles and colour contrast (click a colour swatch in Styles to see the contrast ratio) |
| **CSS Overview** (Chrome) | All colours, fonts and media queries used on a page |

## Practice tasks

1. Inspect a heading on a big website and find which rule sets its font size; change it live.
2. Create a page with a horizontal scroll bug (a 600px-wide image) and find it using the console snippet.
3. Force `:hover` on a button and edit its hover colour.
4. Use the Grid overlay on a grid layout and read the line numbers.
5. Run Lighthouse on your project and fix one accessibility issue.

## Summary

- Open DevTools with F12 or right-click → Inspect; the Elements panel shows the live DOM.
- The Styles panel shows matching rules, crossed-out overrides and invalid declarations; edit and toggle live.
- Computed shows final values and the box model; flex/grid badges show layout overlays.
- Device mode tests responsive sizes and slow networks; still test on real phones.
- Debug systematically: reproduce, inspect, read, check box model, toggle, isolate, fix, test.

```quiz
Q: Which key usually opens DevTools?
A: F12
Q: In the Styles panel, what does a crossed-out declaration mean? (one word)
A: overridden
Q: Which DevTools tab shows final values and the box model diagram?
A: Computed
Q: Which DevTools mode tests phone and tablet sizes? (one word)
A: device | device mode
Q: Which temporary CSS rule outlines every element to find layout problems? Write the selector.
A: * | *
Q: Which panel shows whether style.css failed to load with a 404?
A: Network
```
