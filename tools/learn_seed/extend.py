from common import find, lesson

h = find("html")
lesson(h, "media-embeds", "Audio, video and embeds", """
# Audio, video and embeds

## Video and audio

```try-html
<video controls width="320" poster="https://picsum.photos/320/180">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
  Your browser does not support video.
</video>
<p>Add <code>autoplay muted loop playsinline</code> for a silent background video.</p>
```

- `controls` shows play/pause; always provide it for user videos.
- `poster` is the picture shown before playing.
- Offer MP4 (H.264) for the widest support.

```try-html
<audio controls src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"></audio>
```

## Embedding YouTube, maps and more with iframe

```html
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  title="Our shop tour" loading="lazy" allowfullscreen></iframe>

<iframe src="https://www.google.com/maps?q=Nakuru&output=embed" width="400" height="300"
  style="border:0" loading="lazy" title="Map to our office"></iframe>
```

- Always add a `title` for screen readers.
- `loading="lazy"` makes pages faster.

```quiz
Q: Which attribute shows play and pause buttons on a video?
A: controls
Q: Which attribute sets the picture shown before a video plays?
A: poster
Q: Which element embeds another web page, like YouTube or Google Maps?
A: iframe | <iframe>
```
""", "Add a `<video>` with the `controls` attribute and a `<source>` inside it.", "", "", "<video\ncontrols\n<source")

lesson(h, "seo-accessibility", "SEO and accessibility in HTML", """
# SEO and accessibility

Good HTML helps **Google** understand your page and helps **everyone** use it, including blind users with screen readers and people on slow phones.

## The head: what Google and WhatsApp read

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fresh Juice Delivery in Nairobi | Juicy Ke</title>
  <meta name="description" content="Order fresh juice in Nairobi, delivered in 45 minutes. Pay with M-Pesa.">
  <link rel="canonical" href="https://juicy.co.ke/">
  <meta property="og:title" content="Juicy Ke: fresh juice delivered">
  <meta property="og:image" content="https://juicy.co.ke/share.jpg">
</head>
```

The `og:` tags control the preview when your link is shared on WhatsApp, Facebook and LinkedIn.

## Accessibility checklist

- **One `<h1>`**, then headings in order (h2, h3), not skipping levels.
- **`alt` text** on images that describes them; `alt=""` for decorative images.
- **Labels** for every form input.
- **Links that make sense alone**: "Download the price list", not "click here".
- Enough **colour contrast**; don't use colour alone to show meaning.
- **`lang`** on the `<html>` tag: `<html lang="en">`.
- Buttons for actions (`<button>`), links for navigation (`<a>`).

```try-html
<html lang="en">
<body>
  <h1>Juicy Ke</h1>
  <img src="https://picsum.photos/200/120" alt="Glass of mango juice on a wooden table" width="200" height="120">
  <p><a href="#menu">See our juice menu</a></p>
  <label for="phone">Phone</label>
  <input id="phone" type="tel">
  <button type="button">Order now</button>
</body>
</html>
```

```quiz
Q: Which tags control the preview picture when a link is shared on WhatsApp? (prefix)
A: og | og: | open graph
Q: What attribute describes an image for screen readers?
A: alt
Q: How many h1 headings should a page normally have?
A: 1 | one
Q: Is "click here" a good link text? (yes/no)
A: no
```
""")

lesson(h, "project-landing-page", "Project: a business landing page", """
# Project: build a landing page

Put everything together: build a one-page website for a small business (a salon, a school, a hardware shop, or your own freelance services).

## Requirements

1. A `<header>` with the business name and a `<nav>` linking to sections.
2. A hero section with a heading, one sentence and a "WhatsApp us" button link (`https://wa.me/2547XXXXXXXX`).
3. A services section with at least 3 `<article>` items.
4. A price list in a `<table>`.
5. A contact `<form>` with name, phone and message, all with labels.
6. A `<footer>` with the location and hours.

## Starter

```try-html
<header>
  <h1>Mama Njeri Salon</h1>
  <nav><a href="#services">Services</a> · <a href="#prices">Prices</a> · <a href="#contact">Contact</a></nav>
</header>
<main>
  <section>
    <h2>Look your best this weekend</h2>
    <p>Braids, weaves and nails in Kahawa West.</p>
    <p><a href="https://wa.me/254700000000">Book on WhatsApp</a></p>
  </section>
  <section id="services">
    <h2>Services</h2>
    <article><h3>Braids</h3><p>From KSh 1,500</p></article>
  </section>
</main>
<footer><p>Open Mon–Sat 8am–7pm</p></footer>
```

Finish it, then style it with the CSS track. When you're done, publish it with **GitHub Pages** (Git track). That's your first portfolio piece.
""")

c = find("css")
lesson(c, "grid", "CSS Grid layout", """
# CSS Grid

**Grid** lays out rows *and* columns: perfect for galleries, cards and whole page layouts.

```try-html
<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-family: sans-serif; }
  .grid div { background: #e0f2fe; padding: 24px; border-radius: 10px; text-align: center; }
  .wide { grid-column: span 2; background: #fde68a !important; }
</style>
<div class="grid">
  <div class="wide">Spans 2 columns</div><div>2</div>
  <div>3</div><div>4</div><div>5</div>
</div>
```

## Responsive without media queries

```try-html
<style>
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; font-family: sans-serif; }
  .cards div { background: #0b1b35; color: #fff; padding: 20px; border-radius: 12px; }
</style>
<div class="cards"><div>Web</div><div>Design</div><div>M-Pesa</div><div>Training</div><div>Hosting</div></div>
```

`repeat(auto-fit, minmax(150px, 1fr))` means "as many columns as fit, each at least 150px". Resize the output to see it.

## Page layout with named areas

```css
.page { display: grid; grid-template-areas: "header header" "sidebar main" "footer footer"; grid-template-columns: 240px 1fr; }
header { grid-area: header; } aside { grid-area: sidebar; } main { grid-area: main; } footer { grid-area: footer; }
```

**Flexbox or Grid?** Flexbox for one direction (a row of buttons, a navbar). Grid for two directions (a gallery, a page layout).

```quiz
Q: Which property turns an element into a grid container? (write property: value)
A: display: grid | display:grid
Q: What does 1fr mean? (one ... of the free space)
A: fraction | one fraction | fraction unit
Q: Which is better for a 2D gallery of cards: Flexbox or Grid?
A: Grid
```
""", "Make `.gallery` a grid with **3 columns** using `grid-template-columns`.", "<style>\n  .gallery {\n    \n  }\n  .gallery div { background: #e0f2fe; padding: 20px; }\n</style>\n<div class=\"gallery\"><div>1</div><div>2</div><div>3</div><div>4</div></div>", "", "display\ngrid\ngrid-template-columns")

lesson(c, "position", "Positioning and z-index", """
# Positioning

```try-html
<style>
  .card { position: relative; width: 240px; height: 140px; background: #e2e8f0; border-radius: 12px; font-family: sans-serif; padding: 12px; }
  .badge { position: absolute; top: -10px; right: -10px; background: #dc2626; color: #fff; border-radius: 999px; padding: 4px 10px; font-weight: bold; }
  .bar { position: sticky; top: 0; background: #0b1b35; color: #fff; padding: 10px; }
  .chat { position: fixed; right: 16px; bottom: 16px; background: #16a34a; color: #fff; padding: 12px 16px; border-radius: 999px; }
</style>
<div class="bar">I'm sticky: scroll the output</div>
<div class="card">Product card<span class="badge">-20%</span></div>
<p style="height:500px">Scroll down…</p>
<div class="chat">WhatsApp</div>
```

| Value | Behaviour |
|---|---|
| `static` | Normal flow (default) |
| `relative` | Normal flow, can be nudged; becomes the reference for absolute children |
| `absolute` | Removed from flow, placed relative to the nearest positioned parent |
| `fixed` | Stays on screen when scrolling (chat buttons, cookie bars) |
| `sticky` | Normal until it reaches a scroll position, then sticks (headers) |

**z-index** decides which element is on top when they overlap (only works on positioned elements). Higher number = on top.

```quiz
Q: Which position value keeps a WhatsApp button on screen while scrolling?
A: fixed
Q: For a badge in the corner of a card, the card gets position: relative and the badge gets position: …?
A: absolute
Q: Which property decides which overlapping element is on top?
A: z-index
```
""")

lesson(c, "transitions-animations", "Transitions and animations", """
# Transitions and animations

## Transitions: smooth changes

```try-html
<style>
  .btn { background: #ffb800; border: 0; padding: 14px 22px; border-radius: 10px; font: bold 16px sans-serif; cursor: pointer;
         transition: transform .2s ease, box-shadow .2s ease; }
  .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,.2); }
</style>
<button class="btn">Hover me</button>
```

## Keyframe animations

```try-html
<style>
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dot { width: 20px; height: 20px; background: #16a34a; border-radius: 50%; animation: pulse 1.2s infinite; display: inline-block; }
  .loader { width: 36px; height: 36px; border: 4px solid #e2e8f0; border-top-color: #ffb800; border-radius: 50%; animation: spin .8s linear infinite; margin-top: 16px; }
</style>
<span class="dot"></span> Online
<div class="loader"></div>
```

## Be kind with motion

Some people get dizzy from animation. Respect their setting:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

Animate only `transform` and `opacity` for smooth performance on phones.

```quiz
Q: Which property smoothly animates a change like a hover effect?
A: transition
Q: Which at-rule defines the steps of an animation?
A: @keyframes | keyframes
Q: Which media query respects users who dislike motion?
A: prefers-reduced-motion
```
""")

lesson(c, "variables-dark-mode", "CSS variables and dark mode", """
# CSS variables and dark mode

**Custom properties** (CSS variables) store values you reuse: brand colours, spacing, fonts. Change one place, the whole site updates.

```try-html
<style>
  :root { --brand: #ffb800; --bg: #ffffff; --text: #0f172a; --radius: 12px; }
  @media (prefers-color-scheme: dark) { :root { --bg: #0b1628; --text: #e2e8f0; } }
  body { background: var(--bg); color: var(--text); font-family: sans-serif; padding: 16px; }
  .btn { background: var(--brand); color: #0b1b35; border: 0; padding: 12px 18px; border-radius: var(--radius); font-weight: bold; }
</style>
<h2>Themed with variables</h2>
<button class="btn">Buy now</button>
<p>Switch your phone or computer to dark mode and run again.</p>
```

## A dark mode toggle

```try-html
<style>
  :root { --bg: #fff; --text: #111; }
  [data-theme="dark"] { --bg: #111827; --text: #f9fafb; }
  body { background: var(--bg); color: var(--text); font-family: sans-serif; transition: background .3s; }
</style>
<button id="t">Toggle dark mode</button>
<p>Hello!</p>
<script>
  document.getElementById("t").onclick = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  };
</script>
```

```quiz
Q: How do you read a CSS variable called --brand?
A: var(--brand)
Q: Where are global CSS variables usually declared?
A: :root | root
Q: Which media query detects the user's dark mode setting?
A: prefers-color-scheme | prefers-color-scheme: dark
```
""", "Create a variable `--brand` on `:root` and use it as the `background` of `.btn`.", "<style>\n  :root {\n    \n  }\n  .btn { padding: 12px; }\n</style>\n<button class=\"btn\">Pay</button>", "", "--brand\nvar(--brand)")

j = find("javascript")
lesson(j, "json-fetch", "JSON and fetch", """
# JSON and fetch

**JSON** is the text format apps use to send data: `{"name": "Mouse", "price": 1200}`. The M-Pesa API, weather apps, and this website's chat all use JSON.

```try-javascript
const text = '{"name":"Mouse","price":1200,"tags":["usb","wireless"]}';
const product = JSON.parse(text);          // text -> object
console.log(product.name, product.price);
console.log(product.tags.length);

const back = JSON.stringify({ town: "Nakuru", open: true });   // object -> text
console.log(back);
```

## fetch: get data from a server

```js
fetch("https://api.example.com/products")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log("Failed:", error));
```

Sending data (e.g. a contact form) with POST:

```js
fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Achieng", phone: "0712345678" })
});
```

> The practice editor runs in a locked sandbox, so network requests from it won't reach other sites. Use these patterns in your own projects.

```quiz
Q: Which method turns JSON text into a JavaScript object?
A: JSON.parse
Q: Which method turns an object into JSON text?
A: JSON.stringify
Q: Which built-in function makes HTTP requests from JavaScript?
A: fetch
```
""", "Parse the JSON in `data` and print the **price** of the product. The output should be **3500**.", "const data = '{\"name\":\"Speaker\",\"price\":3500}';\n", "3500", "JSON.parse")

lesson(j, "async-await", "Promises and async/await", """
# Promises and async/await

Some things take time: loading data, waiting for a payment, a timer. JavaScript doesn't stop and wait; it uses **promises**.

```try-javascript
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkout() {
  console.log("Sending M-Pesa prompt…");
  await wait(500);
  console.log("Waiting for PIN…");
  await wait(500);
  console.log("Paid!");
}
checkout();
console.log("This line runs first!");
```

- `async` functions can use `await`, which pauses *that function* until the promise finishes.
- Everything else keeps running (that's why the last line printed first).

## Handling errors

```try-javascript
async function getPrice(ok) {
  if (!ok) throw new Error("Item not found");
  return 1200;
}

async function main() {
  try {
    console.log(await getPrice(true));
    console.log(await getPrice(false));
  } catch (e) {
    console.log("Error:", e.message);
  }
}
main();
```

With fetch:

```js
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Server said " + res.status);
    const products = await res.json();
    console.log(products);
  } catch (e) {
    console.log("Could not load:", e.message);
  }
}
```

```quiz
Q: Which keyword makes a function able to use await?
A: async
Q: Which statement catches errors from awaited code?
A: try...catch | try catch | try/catch | try
Q: Does await stop all JavaScript on the page? (yes/no)
A: no
```
""")

lesson(j, "local-storage", "Saving data in the browser (localStorage)", """
# localStorage

Save small data in the user's browser so it's still there after refresh: a cart, a theme, a draft.

```try-html
<input id="name" placeholder="Your name">
<button id="save">Save</button>
<p id="hello"></p>
<script>
  const hello = document.getElementById("hello");
  const saved = localStorage.getItem("name");
  if (saved) hello.textContent = "Welcome back, " + saved + "!";
  document.getElementById("save").onclick = () => {
    const v = document.getElementById("name").value;
    localStorage.setItem("name", v);
    hello.textContent = "Saved! Refresh and run again.";
  };
</script>
```

> In this practice editor storage is blocked for safety, so the saved value won't persist here. Try it in your own project.

## Storing objects and arrays

localStorage stores **text only**, so use JSON:

```js
const cart = [{ id: 1, qty: 2 }];
localStorage.setItem("cart", JSON.stringify(cart));
const back = JSON.parse(localStorage.getItem("cart") || "[]");
```

## Rules

- Never store passwords, tokens or personal data; any script on the page can read it.
- It's per device and browser; clearing browser data deletes it.
- Limit is about 5 MB.

```quiz
Q: Which method saves a value in localStorage?
A: setItem | localStorage.setItem
Q: Can localStorage store objects directly, or only text?
A: text | only text | strings
Q: Should you store passwords in localStorage? (yes/no)
A: no
```
""")

lesson(j, "project-todo", "Project: a to-do list app", """
# Project: to-do list

Combine the DOM, events and arrays into a working app.

```try-html
<style>
  body { font-family: sans-serif; max-width: 420px; }
  li { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
  li.done span { text-decoration: line-through; color: #94a3b8; }
  button { cursor: pointer; }
</style>
<h2>My tasks</h2>
<form id="f"><input id="task" placeholder="New task" required> <button>Add</button></form>
<ul id="list"></ul>
<p id="count"></p>
<script>
  const tasks = [];
  const list = document.getElementById("list");
  function render() {
    list.innerHTML = "";
    tasks.forEach((t, i) => {
      const li = document.createElement("li");
      if (t.done) li.className = "done";
      const span = document.createElement("span");
      span.textContent = t.text;
      span.onclick = () => { t.done = !t.done; render(); };
      const del = document.createElement("button");
      del.textContent = "✕";
      del.onclick = () => { tasks.splice(i, 1); render(); };
      li.append(span, del);
      list.append(li);
    });
    document.getElementById("count").textContent = tasks.filter(t => !t.done).length + " left";
  }
  document.getElementById("f").onsubmit = e => {
    e.preventDefault();
    const input = document.getElementById("task");
    tasks.push({ text: input.value, done: false });
    input.value = "";
    render();
  };
</script>
```

## Challenges

1. Add a "Clear completed" button.
2. Show the date each task was added.
3. Save tasks with localStorage in your own copy.
4. Add priority colours (high, medium, low).
""")

p = find("python")
lesson(p, "files-errors", "Errors and exceptions", """
# Errors and exceptions

Programs meet bad input: letters instead of numbers, division by zero, missing files. **try/except** handles problems gracefully instead of crashing.

```try-python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Can't divide by zero"

print(safe_divide(10, 2))
print(safe_divide(5, 0))
```

## Validating input

```try-python
entries = ["250", "abc", "-5", "1200"]
for text in entries:
    try:
        amount = int(text)
        if amount <= 0:
            raise ValueError("amount must be positive")
        print("OK:", amount)
    except ValueError as e:
        print(f"Bad input {text!r}: {e}")
```

## Common errors

| Error | Meaning |
|---|---|
| `SyntaxError` | Code is written wrongly (missing colon, bracket) |
| `IndentationError` | Wrong spaces at the start of a line |
| `NameError` | Using a variable that doesn't exist (typo?) |
| `TypeError` | Wrong type, e.g. `"5" + 3` |
| `ValueError` | Right type, bad value, e.g. `int("abc")` |
| `KeyError` / `IndexError` | Missing dictionary key / list position |
| `ZeroDivisionError` | Dividing by zero |

## Files (in your own projects)

```python
with open("sales.txt", "w") as f:
    f.write("Mouse,1200\\n")
with open("sales.txt") as f:
    for line in f:
        name, price = line.strip().split(",")
```

```quiz
Q: Which error does int("abc") raise?
A: ValueError
Q: Which error does "5" + 3 raise?
A: TypeError
Q: Which keyword starts a block that handles an error?
A: except
```
""", "Use try/except so that dividing 10 by 0 prints **Cannot divide** instead of crashing.", "a = 10\nb = 0\n", "Cannot divide", "try\nexcept")

lesson(p, "modules-stdlib", "Modules: random, math, datetime", """
# Modules

Python comes with a huge **standard library**. `import` a module to use it.

```try-python
import random, math
from datetime import date, timedelta

print(random.randint(1, 6))                  # dice
print(random.choice(["Nairobi", "Mombasa", "Kisumu"]))
print(math.sqrt(144), math.pi)
today = date.today()
print("Today:", today)
print("Due in 14 days:", today + timedelta(days=14))
```

## A real use: M-Pesa transaction code generator

```try-python
import random, string

def fake_receipt():
    letters = string.ascii_uppercase + string.digits
    return "".join(random.choice(letters) for _ in range(10))

for _ in range(3):
    print(fake_receipt())
```

## Useful modules

| Module | For |
|---|---|
| `random` | Random numbers and choices |
| `math` | sqrt, ceil, floor, log |
| `datetime` | Dates and times |
| `statistics` | mean, median, mode |
| `json` | Read/write JSON |
| `csv` | Spreadsheet files |
| `re` | Regular expressions (patterns) |
| `ipaddress` | IP networks and subnets (see the Networking track) |

Outside this hub you can install thousands more with `pip install`, e.g. `requests` (web APIs), `pandas` (data), `flask`/`django` (websites).

```quiz
Q: Which module gives random numbers?
A: random
Q: Which module has sqrt and pi?
A: math
Q: Which tool installs extra Python packages on your computer?
A: pip
```
""", "Import `statistics` and print the **mean** of [60, 70, 80]. The output should be **70**.", "marks = [60, 70, 80]\n", "70", "import statistics\nmean")

lesson(p, "classes-oop", "Classes and objects", """
# Classes and objects

A **class** is a blueprint; **objects** are things made from it. Use classes when data and the actions on it belong together.

```try-python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"{self.owner} deposited {amount}. Balance: {self.balance}")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
            return
        self.balance -= amount
        print(f"{self.owner} withdrew {amount}. Balance: {self.balance}")

a = Account("Wanjiku", 500)
a.deposit(1500)
a.withdraw(3000)
a.withdraw(700)
```

- `__init__` runs when an object is created; `self` is the object itself.
- **Attributes** (data): `self.balance`. **Methods** (actions): `deposit()`.

## Inheritance

```try-python
class Product:
    def __init__(self, name, price):
        self.name, self.price = name, price
    def total(self, qty):
        return self.price * qty

class DiscountedProduct(Product):
    def __init__(self, name, price, percent):
        super().__init__(name, price)
        self.percent = percent
    def total(self, qty):
        return super().total(qty) * (100 - self.percent) / 100

items = [Product("Mouse", 1200), DiscountedProduct("Speaker", 3500, 20)]
for it in items:
    print(it.name, it.total(2))
```

```quiz
Q: Which method runs automatically when an object is created?
A: __init__ | init
Q: What is the first parameter of a method, referring to the object itself?
A: self
Q: Which function calls the parent class's method?
A: super | super()
```
""", "Create a class `Car` with an `__init__` storing `name`, then make `Car(\"Probox\")` and print its name. Output: **Probox**", "class Car:\n    pass\n\n", "Probox", "class Car\n__init__")

lesson(p, "project-mpesa-calculator", "Project: M-Pesa charges calculator", """
# Project: a transaction charges calculator

Build a program that works out a fee from a tariff table, a pattern used in fintech and billing systems.

> The bands below are **example numbers for practice**, not Safaricom's current tariff. Check the official M-Pesa tariff before using real values.

```try-python
BANDS = [          # (maximum amount, fee)
    (100, 0),
    (500, 7),
    (1000, 13),
    (1500, 23),
    (2500, 33),
    (3500, 53),
    (5000, 57),
    (7500, 78),
    (10000, 90),
    (15000, 100),
    (20000, 105),
    (250000, 108),
]

def fee_for(amount):
    if amount < 1 or amount > 250000:
        raise ValueError("Amount must be between 1 and 250,000")
    for maximum, fee in BANDS:
        if amount <= maximum:
            return fee

for amount in [50, 750, 2600, 12000, 70000]:
    print(f"Send KSh {amount:,} -> fee KSh {fee_for(amount)}")
```

## Extend it

1. Ask for the amount with `input()` and handle bad input with try/except.
2. Show "total deducted" (amount + fee).
3. Find the cheapest way to send KSh 30,000 in two transactions.
4. Put the bands in a dictionary loaded from JSON.
""")

s = find("sql")
lesson(s, "keys-design", "Keys, relationships and table design", """
# Designing tables

## Primary and foreign keys

- **Primary key**: uniquely identifies each row (`CustomerID`). Never repeats, never empty.
- **Foreign key**: a column pointing to another table's primary key (`Orders.CustomerID` → `Customers.CustomerID`). It links tables and prevents orders for customers who don't exist.

```try-sql
CREATE TABLE Branches (BranchID INTEGER PRIMARY KEY, Town TEXT NOT NULL UNIQUE);
CREATE TABLE Staff (
  StaffID INTEGER PRIMARY KEY,
  Name TEXT NOT NULL,
  Phone TEXT UNIQUE,
  Salary INTEGER CHECK (Salary > 0),
  BranchID INTEGER REFERENCES Branches(BranchID)
);
INSERT INTO Branches (Town) VALUES ('Nairobi'), ('Kisumu');
INSERT INTO Staff (Name, Phone, Salary, BranchID) VALUES ('Otieno', '0711000001', 45000, 2), ('Wairimu', '0711000002', 52000, 1);
SELECT s.Name, b.Town, s.Salary FROM Staff s JOIN Branches b ON b.BranchID = s.BranchID;
```

## Constraints

| Constraint | Ensures |
|---|---|
| `PRIMARY KEY` | Unique row identifier |
| `NOT NULL` | Must have a value |
| `UNIQUE` | No duplicates (phone, email) |
| `CHECK` | Value follows a rule |
| `DEFAULT` | Value used when none given |
| `REFERENCES` / `FOREIGN KEY` | Must exist in the other table |

## Relationships

- **One-to-many**: one customer → many orders (foreign key on the "many" side).
- **Many-to-many**: students ↔ courses → use a **join table** `Enrollments(StudentID, CourseID)`.
- **One-to-one**: a user ↔ a profile.

## Normalisation (simply)

Don't repeat the same information in many rows. If a customer's phone number is typed in every order, changing it means updating hundreds of rows. Put it once in `Customers` and link by ID.

```quiz
Q: Which key uniquely identifies each row?
A: primary key | primary
Q: Which key links to another table's primary key?
A: foreign key | foreign
Q: Students and courses have which kind of relationship?
A: many-to-many | many to many
Q: Which constraint stops two customers having the same phone number?
A: UNIQUE
```
""")

lesson(s, "subqueries-views", "Subqueries, CASE, views and indexes", """
# Subqueries, CASE, views and indexes

## Subqueries

A query inside another query.

```try-sql
SELECT Name, Price FROM Products
WHERE Price > (SELECT AVG(Price) FROM Products);
```

Customers who have ordered at least once:

```try-sql
SELECT Name, City FROM Customers
WHERE CustomerID IN (SELECT CustomerID FROM Orders);
```

## CASE: if/else in SQL

```try-sql
SELECT Name, Price,
  CASE
    WHEN Price >= 5000 THEN 'Premium'
    WHEN Price >= 1500 THEN 'Standard'
    ELSE 'Budget'
  END AS Tier
FROM Products ORDER BY Price;
```

## Views: saved queries

```try-sql
CREATE VIEW OrderTotals AS
SELECT o.OrderID, c.Name AS Customer, p.Price * o.Quantity AS Total
FROM Orders o JOIN Customers c ON c.CustomerID = o.CustomerID JOIN Products p ON p.ProductID = o.ProductID;

SELECT Customer, SUM(Total) AS Spent FROM OrderTotals GROUP BY Customer ORDER BY Spent DESC;
```

## Indexes: speed

An **index** is like the index at the back of a book: the database finds rows fast without reading the whole table.

```sql
CREATE INDEX idx_orders_customer ON Orders(CustomerID);
```

Add indexes on columns you often search, join or sort by. Too many indexes slow down inserts.

```quiz
Q: What is a query inside another query called?
A: subquery | a subquery | nested query
Q: Which SQL keyword works like if/else inside a SELECT?
A: CASE
Q: What is a saved query you can select from like a table?
A: view | a view
Q: What makes searching a column faster?
A: index | an index
```
""", "Select the **Name** of products that cost more than the **average** price, using a subquery.", "", "External hard disk 1TB", "SELECT\nAVG")
