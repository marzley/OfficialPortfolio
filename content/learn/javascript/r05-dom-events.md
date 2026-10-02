---
slug: dom-events
title: "The DOM and events: changing the page and responding to clicks, typing and more"
after: KEEP
---
# The DOM and events: changing the page and responding to clicks, typing and more

This is where JavaScript and web pages meet. The **DOM** (Document Object Model) is the browser's live version of your HTML that JavaScript can read and change: update text, add items to a list, show an error, switch to dark mode. **Events** are things that happen (a click, typing, submitting a form, scrolling) that JavaScript can respond to. Master these and you can build interactive features for any website.

:::note What you will learn
- What the DOM is and how it relates to HTML
- Selecting elements: `querySelector`, `querySelectorAll`, `getElementById`
- Changing text, HTML, attributes, classes and styles safely
- Creating, inserting and removing elements
- Events: `addEventListener`, the event object, common events
- Forms: reading values and preventing page reloads
- Event delegation for dynamic lists
- Accessibility and performance tips
:::

## What is the DOM?

When the browser loads HTML, it builds a **tree of objects** in memory, one object per element, text and attribute. That tree is the DOM.

```
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1  "Juma's Shop"
        └── ul#cart
            ├── li  "Unga"
            └── li  "Sugar"
```

:::define DOM (Document Object Model)
The browser's live, tree-shaped representation of a web page, which JavaScript can read and change. Changing the DOM changes what the user sees, without reloading the page.
:::

Important: the DOM isn't your HTML file. JavaScript changes the DOM in memory; your file on the server stays the same (refresh and changes disappear unless saved somewhere).

The DOM is a **browser** feature, so DOM examples here run as HTML pages with a `<script>`.

## Selecting elements

```try-html
<h1 id="title">Juma's Shop</h1>
<p class="note">Open daily 8am–8pm</p>
<ul id="cart"><li>Unga</li><li>Sugar</li><li>Milk</li></ul>
<script>
  const title = document.querySelector("#title");        // first match (CSS selector)
  const note = document.querySelector(".note");
  const items = document.querySelectorAll("#cart li");    // all matches (a NodeList)
  const sameTitle = document.getElementById("title");     // by id (no #)

  console.log(title.textContent);
  console.log(note.textContent);
  console.log(items.length, "items in the cart");
  items.forEach((li) => console.log("-", li.textContent));
</script>
```

| Method | Returns |
|---|---|
| `document.querySelector(css)` | The **first** matching element, or `null` |
| `document.querySelectorAll(css)` | **All** matches (NodeList; use `forEach` or `for...of`) |
| `document.getElementById(id)` | Element with that id, or `null` |
| `element.querySelector(css)` | Search **inside** an element |

If a selector finds nothing, you get `null`, and using it (`null.textContent`) throws an error. Check spelling and make sure the script runs **after** the HTML exists (script at the end of `<body>` or `defer`).

## Changing content

```try-html
<h2 id="msg">Loading…</h2>
<p id="price"></p>
<div id="box"></div>
<script>
  document.querySelector("#msg").textContent = "Welcome back, Wanjiku!";
  document.querySelector("#price").textContent = "Total: KSh " + (180 * 3).toLocaleString();

  // innerHTML parses HTML: only use with trusted content
  document.querySelector("#box").innerHTML = "<strong>Free delivery</strong> on orders over KSh 2,000";
</script>
```

### `textContent` vs `innerHTML`

| | `textContent` | `innerHTML` |
|---|---|---|
| Treats value as | Plain text | HTML code |
| Safe with user input | **Yes** | **No** |
| Use for | Names, messages, numbers | Your own trusted HTML templates |

:::warning innerHTML and user input = security risk
Never put text typed by users (names, comments, search terms) into `innerHTML`. Someone could type `<img src=x onerror="stealData()">` and run code on other users' browsers. This attack is called **XSS (cross-site scripting)**. Use `textContent`, or create elements and set their text.
:::

## Attributes, classes and styles

```try-html
<style>
  .highlight { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 8px; }
  .hidden { display: none; }
</style>
<p id="offer">Weekend offer: 10% off</p>
<a id="link" href="#">Our shop</a>
<img id="pic" src="https://picsum.photos/120/80" alt="Shop">
<p id="secret" class="hidden">Secret discount code: KARIBU10</p>
<script>
  const offer = document.querySelector("#offer");
  offer.classList.add("highlight");          // add a class
  offer.classList.toggle("bold");            // add if missing, remove if present
  console.log(offer.classList.contains("highlight"));   // true

  const link = document.querySelector("#link");
  link.setAttribute("href", "https://marzleytechsolutions.co.ke");
  link.textContent = "Visit Marzley Tech";

  document.querySelector("#pic").alt = "Inside our Kisumu shop";

  document.querySelector("#secret").classList.remove("hidden");   // show it

  offer.style.fontSize = "20px";             // inline style (camelCase property)
</script>
```

**Prefer classes over inline styles:** keep design in CSS, and use JavaScript to add or remove classes (`is-open`, `is-active`, `has-error`). It's cleaner and easier to maintain.

## Creating and removing elements

```try-html
<ul id="list"></ul>
<script>
  const list = document.querySelector("#list");
  const products = ["Unga 2kg", "Sugar 1kg", "Milk 500ml"];

  for (const name of products) {
    const li = document.createElement("li");   // create
    li.textContent = name;                     // safe text
    list.append(li);                           // insert at the end
  }

  const first = document.createElement("li");
  first.textContent = "Bread (new!)";
  list.prepend(first);                         // insert at the start

  list.lastElementChild.remove();              // remove the last item
</script>
```

Other insert methods: `before()`, `after()`, `insertAdjacentHTML()` (trusted HTML only), `replaceWith()`.

## Events

An **event** is a signal that something happened. You attach a **listener**: a function that runs when the event occurs.

```try-html
<button id="btn">Add to cart</button>
<p id="count">Items in cart: 0</p>
<script>
  let count = 0;
  const btn = document.querySelector("#btn");
  const out = document.querySelector("#count");

  btn.addEventListener("click", () => {
    count++;
    out.textContent = "Items in cart: " + count;
  });
</script>
```

`element.addEventListener("eventName", function)`. Avoid old inline `onclick="..."` attributes in HTML: they mix code into markup and are blocked by strict security policies (CSP).

### Common events

| Event | Fires when |
|---|---|
| `click` | Element is clicked/tapped (also Enter/Space on buttons) |
| `input` | Value of an input changes (every keystroke) |
| `change` | Value committed (select changed, checkbox toggled, input left) |
| `submit` | Form is submitted |
| `keydown` / `keyup` | Key pressed / released |
| `focus` / `blur` | Element gains / loses focus |
| `mouseenter` / `mouseleave` | Mouse enters / leaves (no equivalent on touch screens) |
| `scroll` | Page or element scrolls |
| `DOMContentLoaded` | HTML is fully parsed |
| `load` | Page and all images/resources loaded |

### The event object

The listener receives an **event object** with details:

```try-html
<input id="search" placeholder="Search products">
<p id="info"></p>
<script>
  const search = document.querySelector("#search");
  const info = document.querySelector("#info");

  search.addEventListener("input", (event) => {
    info.textContent = `You typed: "${event.target.value}" (${event.target.value.length} characters)`;
  });

  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { search.value = ""; info.textContent = "Cleared"; }
  });
</script>
```

- `event.target`: the element that triggered the event.
- `event.key`: which key was pressed.
- `event.preventDefault()`: stop the browser's default action (e.g. form reload, link navigation).

## Forms with JavaScript

```try-html
<form id="order">
  <label for="phone">M-Pesa number</label>
  <input id="phone" name="phone" type="tel" placeholder="0712 345 678">
  <label for="qty">Quantity</label>
  <input id="qty" name="qty" type="number" value="1" min="1">
  <button type="submit">Order</button>
  <p id="feedback" role="status"></p>
</form>
<script>
  const form = document.querySelector("#order");
  const feedback = document.querySelector("#feedback");

  form.addEventListener("submit", (e) => {
    e.preventDefault();                          // stop the page reloading
    const phone = form.phone.value.replace(/\D/g, "");
    const qty = Number(form.qty.value);

    if (!/^(0|254)[17]\d{8}$/.test(phone)) {
      feedback.textContent = "Enter a valid Safaricom or Airtel number.";
      form.phone.focus();
      return;
    }
    feedback.textContent = `Order received: ${qty} item(s). We'll send an M-Pesa prompt to ${phone}.`;
  });
</script>
```

Remember: browser-side validation is for convenience; the **server must validate again** (anyone can bypass JavaScript).

## Event delegation

Adding a listener to every item in a long or changing list is wasteful, and new items wouldn't have listeners. Instead, listen on the **parent** and check what was clicked (events **bubble** up from the target to its ancestors):

```try-html
<ul id="tasks">
  <li>Buy unga <button class="del">✕</button></li>
  <li>Pay rent <button class="del">✕</button></li>
</ul>
<button id="add">Add task</button>
<script>
  const tasks = document.querySelector("#tasks");
  tasks.addEventListener("click", (e) => {
    const btn = e.target.closest(".del");      // did the click happen on a delete button?
    if (btn) btn.closest("li").remove();
  });

  let n = 1;
  document.querySelector("#add").addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = "New task " + n++ + " ";
    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    li.append(del);
    tasks.append(li);                            // works without adding new listeners
  });
</script>
```

:::think Why does deleting a newly added task still work, even though no listener was added to its button?
Because the listener is on the `<ul>`. Clicks on any button inside **bubble up** to the `<ul>`, where the code checks `e.target.closest(".del")`. Any present or future child button is handled by that single parent listener.
:::

## Accessibility and performance tips

- Use real `<button>` elements for clickable actions (keyboard and screen reader support for free).
- Announce dynamic messages with `role="status"` or `aria-live="polite"` (as in the form example).
- Move focus sensibly (e.g. to the first error field, or into an opened dialog).
- Batch DOM changes: build items then insert once (e.g. using a `DocumentFragment` or building an array of elements) for big lists.
- For `scroll` and `input` events that fire very often, keep handlers light (or debounce them).

## Common mistakes

| Mistake | Fix |
|---|---|
| Script runs before the HTML exists (`null` errors) | Script at end of `<body>` or `defer` |
| Wrong selector (`"title"` instead of `"#title"`) | Use CSS selector syntax |
| `innerHTML` with user input | `textContent` / `createElement` |
| Calling the function when adding the listener: `addEventListener("click", save())` | Pass it: `addEventListener("click", save)` |
| Forgetting `preventDefault()` on form submit | Page reloads and data is lost |
| Comparing input values as numbers | `Number(input.value)` |
| `div` with click handler instead of `button` | Use `<button>` |

## Practice tasks

1. Build a counter with + and − buttons that never goes below 0.
2. Make a "Show more" button that reveals hidden text by toggling a class.
3. Build a live character counter for a 160-character SMS textarea.
4. Create a product list from an array of objects using `createElement`.
5. Build a to-do list where tasks can be added and deleted (use event delegation).

## Summary

- The DOM is the browser's live tree of the page; JavaScript reads and changes it.
- Select with `querySelector`, `querySelectorAll`, `getElementById`.
- Change content with `textContent` (safe) or `innerHTML` (trusted HTML only); change classes with `classList`; attributes with `setAttribute` or properties.
- Create with `createElement`, insert with `append`/`prepend`, remove with `remove()`.
- Respond to events with `addEventListener`; use the event object (`target`, `key`, `preventDefault()`).
- Handle forms with `submit` + `preventDefault`; use event delegation for dynamic lists; keep it accessible.

```quiz
Q: What does DOM stand for? Write the first word.
A: Document
Q: Which method selects the first element matching a CSS selector?
A: querySelector | document.querySelector
Q: Which property safely sets plain text in an element?
A: textContent
Q: Which method attaches an event listener?
A: addEventListener
Q: Which event fires on every keystroke in an input?
A: input
Q: Which event method stops a form from reloading the page?
A: preventDefault | preventDefault() | e.preventDefault()
Q: Which classList method adds a class if missing and removes it if present?
A: toggle | toggle()
Q: What is the attack called when user input is run as code through innerHTML? (three letters)
A: XSS
```
=== exercise ===
Using `document.querySelector`, change the text of the `<h1>` to **Done** and print it with `console.log`.
=== starter ===
<h1>Loading…</h1>
<script>
  
</script>
=== expected ===
Done
=== must_contain ===
querySelector
textContent
