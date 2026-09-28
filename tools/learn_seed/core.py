import json
from common import track, lesson, TRACKS as T

# ---------------- HTML ----------------
h=track("html","HTML","html","Build the structure of every web page: headings, text, links, images, lists, tables and forms.")
lesson(h,"introduction","HTML introduction","""
# HTML introduction

**HTML** (HyperText Markup Language) describes the *structure* of a web page. Every website you visit, from Safaricom to your favourite blog, is built on HTML.

HTML is made of **elements**. An element usually has an opening tag, some content and a closing tag:

```html
<p>This is a paragraph.</p>
```

## Your first page

A complete HTML page looks like this. Press **Run** to see it, then change the text and run it again.

```try-html
<!DOCTYPE html>
<html>
<head>
  <title>My first page</title>
</head>
<body>
  <h1>Habari! Welcome to my page</h1>
  <p>I am learning HTML with Marzley Tech.</p>
</body>
</html>
```

- `<!DOCTYPE html>` tells the browser this is a modern HTML page.
- `<head>` holds information *about* the page, like its title (shown on the browser tab).
- `<body>` holds everything you see on the page.

> Tip: HTML is not case-sensitive, but we always write tags in lowercase. It is the standard.
""","Make a page with a main heading that says **Hello Kenya** and a paragraph under it.","<!DOCTYPE html>\n<html>\n<body>\n  \n</body>\n</html>","","<h1>\nHello Kenya\n</h1>\n<p>")
lesson(h,"headings-paragraphs","Headings and paragraphs","""
# Headings and paragraphs

HTML has six levels of headings, from `<h1>` (most important) to `<h6>` (least important). Use **one** `<h1>` per page for the main title. Search engines like Google use headings to understand your page.

```try-html
<h1>Mama Mboga Online</h1>
<h2>Fresh vegetables</h2>
<h3>Sukuma wiki</h3>
<p>Fresh from Limuru every morning.</p>
<h3>Tomatoes</h3>
<p>Sold per kilo or per crate.</p>
```

## Paragraphs and line breaks

The `<p>` element is a paragraph. The browser ignores extra spaces and new lines in your code, so use `<br>` for a line break and `<hr>` for a horizontal line.

```try-html
<p>Marzley Tech Solutions<br>Nairobi, Kenya<br>+254 745 789 590</p>
<hr>
<p>This paragraph
   has lots of     spaces
   but shows on one line.</p>
```

## Formatting text

```try-html
<p><strong>Important:</strong> offer ends Friday.</p>
<p>Prices are <em>negotiable</em>.</p>
<p>Water is H<sub>2</sub>O and 10<sup>2</sup> is 100.</p>
<p><mark>Highlighted</mark> and <small>small print</small>.</p>
```
""","Write an `<h2>` that says **Our services** followed by a paragraph that contains the word **websites** in bold (use `<strong>`).","<h1>Marzley Tech</h1>\n","","<h2>\nOur services\n<strong>websites</strong>")
lesson(h,"links-images","Links and images","""
# Links and images

## Links

A link uses the `<a>` element. The `href` attribute says where it goes.

```try-html
<p><a href="https://marzleytechsolutions.co.ke">Visit Marzley Tech</a></p>
<p><a href="https://wa.me/254745789590" target="_blank">Chat on WhatsApp</a> (opens a new tab)</p>
<p><a href="mailto:hello@example.com">Send us an email</a></p>
<p><a href="tel:+254745789590">Call us</a></p>
```

**Attributes** give extra information about an element. They always go in the opening tag: `name="value"`.

## Images

The `<img>` element shows a picture. It has no closing tag. Always add `alt` text: it is read aloud to blind users and shown if the image fails to load.

```try-html
<img src="https://picsum.photos/320/180" alt="A random landscape photo" width="320" height="180">
<p>Photos should be small (use WebP or JPG) so pages load fast on mobile data.</p>
```

> Setting `width` and `height` stops the page from "jumping" while images load.
""","Add a link with the text **Our work** that goes to `https://marzleytechsolutions.co.ke/work`.","<p>See what we've built:</p>\n","","<a\nhref=\"https://marzleytechsolutions.co.ke/work\"\nOur work")
lesson(h,"lists-tables","Lists and tables","""
# Lists and tables

## Lists

Use `<ul>` for an unordered (bulleted) list and `<ol>` for an ordered (numbered) list. Each item is an `<li>`.

```try-html
<h3>Shopping list</h3>
<ul>
  <li>Unga</li>
  <li>Sugar</li>
  <li>Milk</li>
</ul>
<h3>How to pay with M-Pesa</h3>
<ol>
  <li>Go to M-Pesa and choose Lipa na M-Pesa</li>
  <li>Choose Buy Goods and Services</li>
  <li>Enter the till number and amount</li>
</ol>
```

## Tables

Tables show data in rows (`<tr>`) and cells. Header cells use `<th>`; normal cells use `<td>`.

```try-html
<table border="1" cellpadding="6">
  <tr><th>Package</th><th>Price (KSh)</th></tr>
  <tr><td>Starter website</td><td>15,000</td></tr>
  <tr><td>Business website</td><td>35,000</td></tr>
  <tr><td>Online shop</td><td>40,000</td></tr>
</table>
```

> Use tables for data, not for page layout. Layout is CSS's job.
""","Make an ordered list (`<ol>`) with three items: **Nairobi**, **Mombasa** and **Kisumu**.","","","<ol>\n<li>Nairobi</li>\n<li>Mombasa</li>\n<li>Kisumu</li>")
lesson(h,"forms","Forms","""
# Forms

Forms collect information from users: sign-ups, orders, contact messages.

```try-html
<form>
  <p>
    <label for="name">Your name</label><br>
    <input id="name" name="name" type="text" placeholder="e.g. Wanjiku">
  </p>
  <p>
    <label for="phone">Phone number</label><br>
    <input id="phone" name="phone" type="tel" placeholder="Enter your phone number">
  </p>
  <p>
    <label for="plan">Package</label><br>
    <select id="plan" name="plan">
      <option>Starter</option>
      <option>Business</option>
      <option>Online shop</option>
    </select>
  </p>
  <p>
    <label><input type="checkbox" name="hosting"> I also need hosting</label>
  </p>
  <p>
    <label for="msg">Message</label><br>
    <textarea id="msg" name="message" rows="3"></textarea>
  </p>
  <button type="submit">Send</button>
</form>
```

- Every input should have a `<label>`. Clicking the label focuses the input, and screen readers read it out.
- `type="email"`, `type="tel"` and `type="number"` show the right keyboard on phones.
- Add `required` to make a field compulsory.
""","Build a form with an email input (`type=\"email\"`) that is `required`, and a submit button.","<form>\n  \n</form>","","<form\ntype=\"email\"\nrequired\n<button")
lesson(h,"semantic","Semantic HTML","""
# Semantic HTML

*Semantic* elements describe their meaning. They help search engines, screen readers and other developers understand your page.

```try-html
<header>
  <h1>Kibanda Café</h1>
  <nav><a href="#menu">Menu</a> · <a href="#contact">Contact</a></nav>
</header>
<main>
  <section id="menu">
    <h2>Menu</h2>
    <article>
      <h3>Chapati and beans</h3>
      <p>KSh 150</p>
    </article>
  </section>
</main>
<footer id="contact">
  <p>Open daily 7am to 9pm · Kilimani, Nairobi</p>
</footer>
```

| Element | Use it for |
|---|---|
| `<header>` | The top of a page or section (logo, title) |
| `<nav>` | Main navigation links |
| `<main>` | The main content (once per page) |
| `<section>` | A group of related content with a heading |
| `<article>` | Something that stands on its own (a post, a product) |
| `<footer>` | The bottom: contacts, copyright |

> Well-structured HTML ranks better on Google and works better for everyone.
""","Wrap a heading **Welcome** in a `<header>`, and a paragraph in a `<footer>`.","","","<header>\n<footer>\nWelcome")

# ---------------- CSS ----------------
c=track("css","CSS","css","Style your pages: colours, fonts, spacing, the box model, Flexbox, Grid and mobile-friendly layouts.")
lesson(c,"introduction","CSS introduction","""
# CSS introduction

**CSS** (Cascading Style Sheets) controls how HTML looks: colours, fonts, spacing and layout.

A CSS rule has a **selector** (what to style) and **declarations** (how to style it):

```css
h1 {
  color: navy;
  font-size: 32px;
}
```

You can put CSS in a `<style>` element in the page. Press **Run**, then change the colours.

```try-html
<style>
  body { font-family: system-ui, sans-serif; background: #f8fafc; }
  h1 { color: #0b1b35; }
  p { color: #475569; font-size: 18px; }
</style>
<h1>Styled with CSS</h1>
<p>CSS makes pages look good on every screen.</p>
```

## Three ways to add CSS

1. **External file** (best for real sites): `<link rel="stylesheet" href="style.css">`
2. **Internal**: a `<style>` element, as above.
3. **Inline**: `<p style="color: red">` (avoid; it's hard to maintain).
""","Make every `<p>` on the page **green** using a `<style>` rule.","<style>\n  \n</style>\n<p>Karibu!</p>","","p\ncolor\ngreen")
lesson(c,"selectors-colours","Selectors and colours","""
# Selectors and colours

## Selectors

```try-html
<style>
  p { color: #334155; }              /* every <p> */
  .price { color: #047857; font-weight: bold; }   /* class="price" */
  #offer { background: #fef3c7; padding: 8px; }   /* id="offer" */
  li:hover { color: #b45309; }       /* when the mouse is over it */
</style>
<p>Normal paragraph.</p>
<p class="price">KSh 2,500</p>
<p id="offer">Offer: free delivery in Nairobi!</p>
<ul><li>Hover over me</li><li>And me</li></ul>
```

- **Element** selector: `p`
- **Class** selector: `.price` (use for things that repeat)
- **ID** selector: `#offer` (unique, once per page)

## Colours

CSS colours can be names (`red`), hex (`#ffb800`), `rgb(255, 184, 0)` or `hsl(43, 100%, 50%)`.

```try-html
<style>
  div { padding: 10px; margin: 4px 0; color: white; font-family: sans-serif; }
</style>
<div style="background: #0b1b35">#0b1b35 navy</div>
<div style="background: rgb(4, 120, 87)">rgb(4, 120, 87) green</div>
<div style="background: hsl(0, 70%, 45%)">hsl(0, 70%, 45%) red</div>
```

> Keep enough contrast between text and background so everyone can read it.
""","Give the paragraph with `class=\"price\"` a **red** colour using a class selector.","<style>\n  \n</style>\n<p class=\"price\">KSh 900</p>","",".price\ncolor")
lesson(c,"box-model","The box model","""
# The box model

Every element is a box made of four layers:

1. **Content**: the text or image
2. **Padding**: space inside the border
3. **Border**: the line around it
4. **Margin**: space outside, between boxes

```try-html
<style>
  .card {
    width: 220px;
    padding: 16px;
    border: 3px solid #ffb800;
    margin: 20px;
    border-radius: 12px;
    background: #fff7e0;
    font-family: sans-serif;
  }
  * { box-sizing: border-box; }
</style>
<div class="card">I have padding, a border and a margin.</div>
<div class="card">So do I.</div>
```

> `box-sizing: border-box` makes `width` include padding and border. Most developers set it on everything.
""","Give `.box` a padding of **20px** and a **2px solid** border.","<style>\n  .box {\n    \n  }\n</style>\n<div class=\"box\">Box</div>","","padding\n20px\nborder\n2px solid")
lesson(c,"flexbox","Flexbox layout","""
# Flexbox layout

**Flexbox** lays items out in a row or column, and makes spacing and alignment easy.

```try-html
<style>
  .row { display: flex; gap: 12px; justify-content: space-between; align-items: center;
         padding: 12px; background: #0b1b35; font-family: sans-serif; }
  .row a { color: white; text-decoration: none; }
  .logo { color: #ffb800; font-weight: bold; }
</style>
<nav class="row">
  <span class="logo">MyShop</span>
  <div style="display:flex; gap:16px">
    <a href="#">Home</a><a href="#">Products</a><a href="#">Contact</a>
  </div>
</nav>
```

| Property | What it does |
|---|---|
| `display: flex` | Turns on Flexbox for the children |
| `flex-direction` | `row` (default) or `column` |
| `justify-content` | Spacing along the row: `center`, `space-between` |
| `align-items` | Alignment across: `center`, `flex-start` |
| `gap` | Space between items |
| `flex-wrap: wrap` | Lets items move to the next line on small screens |
""","Make `.menu` a flex container with a **gap** between the items.","<style>\n  .menu {\n    \n  }\n</style>\n<div class=\"menu\"><span>Tea</span><span>Coffee</span><span>Juice</span></div>","","display\nflex\ngap")
lesson(c,"responsive","Responsive design","""
# Responsive design

Most Kenyans browse on phones, so your site must look good on small screens. Two tools do most of the work:

## 1. The viewport tag

Put this in the `<head>` of every page:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## 2. Media queries

A media query applies CSS only when the screen matches. Run this, then drag the output panel narrower (or try on your phone).

```try-html
<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-family: sans-serif; }
  .grid div { background: #e0f2fe; padding: 20px; text-align: center; border-radius: 8px; }
  @media (max-width: 600px) {
    .grid { grid-template-columns: 1fr; }
  }
</style>
<div class="grid"><div>One</div><div>Two</div><div>Three</div></div>
```

> Design for mobile first, then add media queries for bigger screens.
""","Write a media query for screens up to **600px** wide that makes `h1` smaller.","<style>\n  h1 { font-size: 48px; }\n  \n</style>\n<h1>Hello</h1>","","@media\nmax-width\n600px")

# ---------------- JavaScript ----------------
j=track("javascript","JavaScript","javascript","Make pages interactive: variables, functions, arrays, objects, loops, the DOM and events.")
lesson(j,"introduction","JavaScript introduction","""
# JavaScript introduction

**JavaScript** makes web pages do things: react to clicks, check forms, load data and more. It runs in every browser.

`console.log()` prints a value to the output. Press **Run**:

```try-javascript
console.log("Hello, Kenya!");
console.log(2 + 3);
console.log("Total: KSh " + (1500 * 3));
```

## Variables

Store values in variables with `let` (can change) or `const` (can't change).

```try-javascript
const name = "Achieng";
let balance = 1000;
balance = balance - 250;
console.log(name + " has KSh " + balance);
console.log(`${name} has KSh ${balance}`);   // template string: easier
```

## Types

```try-javascript
console.log(typeof "text");    // string
console.log(typeof 42);        // number
console.log(typeof true);      // boolean
console.log(typeof [1, 2]);    // object (an array)
```
""","Create a variable `price` with the value **250** and print `price * 4`. The output should be **1000**.","let price = 0;\n","1000","")
lesson(j,"conditions","Conditions","""
# Conditions

Use `if`, `else if` and `else` to run code only when something is true.

```try-javascript
const amount = 1200;

if (amount >= 1000) {
  console.log("Free delivery!");
} else if (amount >= 500) {
  console.log("Delivery: KSh 100");
} else {
  console.log("Delivery: KSh 200");
}
```

## Comparison operators

| Operator | Meaning |
|---|---|
| `===` | equal (value and type) |
| `!==` | not equal |
| `>` `<` `>=` `<=` | greater / less than |
| `&&` | and |
| `||` | or |

```try-javascript
const age = 20, hasId = true;
console.log(age >= 18 && hasId ? "Allowed in" : "Not allowed");
console.log(5 == "5");   // true (loose, avoid)
console.log(5 === "5");  // false (strict, use this)
```
""","Given `const score = 75;`, print **Pass** if the score is 50 or more, otherwise **Fail**.","const score = 75;\n","Pass","")
lesson(j,"loops-arrays","Arrays and loops","""
# Arrays and loops

An **array** holds a list of values.

```try-javascript
const towns = ["Nairobi", "Mombasa", "Kisumu"];
console.log(towns[0]);        // first item
console.log(towns.length);    // how many
towns.push("Nakuru");         // add one
console.log(towns);
```

## Loops

```try-javascript
const prices = [200, 450, 1200];
let total = 0;
for (const p of prices) {
  total += p;
}
console.log("Total:", total);

for (let i = 1; i <= 3; i++) {
  console.log("Round " + i);
}
```

## Useful array methods

```try-javascript
const prices = [200, 450, 1200];
console.log(prices.map(p => p * 2));          // [400, 900, 2400]
console.log(prices.filter(p => p > 300));     // [450, 1200]
console.log(prices.reduce((a, b) => a + b));  // 1850
```
""","Use a loop (or `reduce`) to add up the numbers in `nums` and print the total. It should be **100**.","const nums = [10, 20, 30, 40];\n","100","")
lesson(j,"functions-objects","Functions and objects","""
# Functions and objects

A **function** is reusable code. Give it inputs (parameters) and it can `return` a result.

```try-javascript
function vat(amount) {
  return amount * 0.16;
}
console.log(vat(1000));   // 160

const withVat = (amount) => amount + vat(amount);   // arrow function
console.log(withVat(1000));   // 1160
```

## Objects

An **object** groups related values as `key: value` pairs.

```try-javascript
const product = {
  name: "Bluetooth speaker",
  price: 3500,
  inStock: true,
};
console.log(product.name);
product.price = 3200;
console.log(`${product.name}: KSh ${product.price}`);

const cart = [
  { name: "Mouse", price: 1200, qty: 2 },
  { name: "Charger", price: 800, qty: 1 },
];
const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log("Cart total:", total);
```
""","Write a function `double(n)` that returns `n * 2`, then print `double(21)`. The output should be **42**.","function double(n) {\n  \n}\n\nconsole.log(double(21));","42","")
lesson(j,"dom-events","The DOM and events","""
# The DOM and events

The **DOM** is the page as JavaScript sees it. You can find elements, change them and react to clicks.

Run this and click the button:

```try-html
<h2 id="count">Clicks: 0</h2>
<button id="btn">Click me</button>
<script>
  let clicks = 0;
  const btn = document.getElementById("btn");
  const label = document.getElementById("count");
  btn.addEventListener("click", () => {
    clicks++;
    label.textContent = "Clicks: " + clicks;
    console.log("Clicked", clicks, "times");
  });
</script>
```

## A tiny calculator

```try-html
<input id="a" type="number" value="1500"> ×
<input id="b" type="number" value="3">
<button id="go">=</button> <strong id="res"></strong>
<script>
  document.getElementById("go").addEventListener("click", () => {
    const a = Number(document.getElementById("a").value);
    const b = Number(document.getElementById("b").value);
    document.getElementById("res").textContent = a * b;
  });
</script>
```

> Use `textContent` (not `innerHTML`) to show text typed by users. It's safer.
""","Using `document.querySelector`, change the text of the `<h1>` to **Done** and print it with `console.log`.","<h1>Loading…</h1>\n<script>\n  \n</script>","Done","querySelector\ntextContent")

# ---------------- Python ----------------
p=track("python","Python","python","Learn programming with Python: variables, input and output, conditions, loops, lists, dictionaries and functions.")
lesson(p,"introduction","Python introduction","""
# Python introduction

**Python** is one of the easiest programming languages to learn, and one of the most used: for websites, data, automation and AI. It runs right here in your browser.

```try-python
print("Hello, Kenya!")
print(2 + 3)
print("KSh", 1500 * 3)
```

> The first run takes a few seconds while Python loads. After that it's instant.

## Variables

Python doesn't need `let` or `const`. Just give a name a value.

```try-python
name = "Kamau"
age = 24
height = 1.75
is_student = True

print(name, "is", age, "years old")
print(f"{name} is {height} m tall")   # f-string: easiest way to mix text and values
print(type(age), type(height), type(name))
```

## Comments

Anything after `#` is a comment. Python ignores it.
""","Create a variable `town` with the value **Nakuru** and print `I live in Nakuru` using an f-string.","town = \"\"\n","I live in Nakuru","")
lesson(p,"numbers-strings","Numbers and strings","""
# Numbers and strings

## Maths

```try-python
print(10 + 3)   # 13
print(10 - 3)   # 7
print(10 * 3)   # 30
print(10 / 3)   # 3.333...
print(10 // 3)  # 3  (whole number division)
print(10 % 3)   # 1  (remainder)
print(2 ** 10)  # 1024 (power)
print(round(10 / 3, 2))
```

## Strings

```try-python
shop = "mama mboga"
print(shop.upper())
print(shop.title())
print(len(shop))
print(shop.replace("mama", "baba"))
print("mboga" in shop)
print(shop[0:4])   # slicing: characters 0 to 3
```

## Converting

```try-python
price = "250"
qty = 3
print(int(price) * qty)   # 750, after turning the text into a number
print("Total: " + str(int(price) * qty))
```
""","Print the length of the string `\"Marzley Tech\"`. The output should be **12**.","text = \"Marzley Tech\"\n","12","len(")
lesson(p,"conditions","If statements","""
# If statements

Python uses **indentation** (4 spaces) to group code. There are no curly braces.

```try-python
amount = 1200

if amount >= 1000:
    print("Free delivery!")
elif amount >= 500:
    print("Delivery: KSh 100")
else:
    print("Delivery: KSh 200")
```

## Combining conditions

```try-python
age = 20
has_id = True

if age >= 18 and has_id:
    print("You can vote")

marks = 65
grade = "A" if marks >= 80 else "B" if marks >= 60 else "C"
print("Grade:", grade)
```

## Input

`input()` asks the user to type something. (Here it opens a small box.)

```try-python
name = input("What is your name? ")
print(f"Karibu, {name}!")
```
""","Given `marks = 45`, print **Pass** if marks are 50 or more, otherwise print **Fail**.","marks = 45\n","Fail","if")
lesson(p,"loops-lists","Lists and loops","""
# Lists and loops

## Lists

```try-python
towns = ["Nairobi", "Mombasa", "Kisumu"]
print(towns[0])
towns.append("Eldoret")
print(towns, len(towns))
print(sorted(towns))
```

## for loops

```try-python
prices = [200, 450, 1200]
total = 0
for p in prices:
    total += p
print("Total:", total)
print("Also:", sum(prices))

for i in range(1, 4):
    print("Round", i)
```

## while loops

```try-python
balance = 1000
day = 0
while balance > 0:
    balance -= 300
    day += 1
print("Money runs out on day", day)
```

## List comprehensions

```try-python
prices = [200, 450, 1200]
with_vat = [p * 1.16 for p in prices]
print(with_vat)
print([p for p in prices if p > 300])
```
""","Use a loop to print the numbers **1 to 5**, each on its own line.","","1\n2\n3\n4\n5","for")
lesson(p,"functions-dicts","Functions and dictionaries","""
# Functions and dictionaries

## Functions

```try-python
def vat(amount):
    return amount * 0.16

def with_vat(amount):
    return amount + vat(amount)

print(vat(1000))
print(with_vat(1000))

def greet(name, greeting="Habari"):
    return f"{greeting}, {name}!"

print(greet("Njeri"))
print(greet("Otieno", "Hello"))
```

## Dictionaries

A dictionary stores `key: value` pairs.

```try-python
product = {"name": "Mouse", "price": 1200, "stock": 15}
print(product["name"])
product["price"] = 1000
print(product)

cart = [
    {"name": "Mouse", "price": 1200, "qty": 2},
    {"name": "Charger", "price": 800, "qty": 1},
]
total = sum(item["price"] * item["qty"] for item in cart)
print("Cart total:", total)

for key, value in product.items():
    print(key, "=", value)
```
""","Write a function `square(n)` that returns `n * n`, then print `square(9)`. The output should be **81**.","def square(n):\n    pass\n\nprint(square(9))","81","def square")

# ---------------- SQL ----------------
s=track("sql","SQL","sql","Talk to databases: SELECT, WHERE, ORDER BY, functions, GROUP BY and JOIN, on a sample Kenyan shop database.")
lesson(s,"select","SELECT","""
# SQL SELECT

**SQL** (Structured Query Language) is how programs read and change data in databases like MySQL, PostgreSQL and SQLite. Nearly every website and app uses one.

You have a sample shop database with three tables:

- **Customers** (CustomerID, Name, City, Phone)
- **Products** (ProductID, Name, Category, Price)
- **Orders** (OrderID, CustomerID, ProductID, Quantity, OrderDate)

`SELECT` reads data. `*` means every column.

```try-sql
SELECT * FROM Customers;
```

Choose columns by name:

```try-sql
SELECT Name, City FROM Customers;
```

Only unique values:

```try-sql
SELECT DISTINCT City FROM Customers;
```

> Your changes never break anything: the sample database is fresh every time you press Run.
""","Select only the **Name** and **Price** columns from the **Products** table.","","Name,Price","SELECT\nProducts")
lesson(s,"where-order","WHERE and ORDER BY","""
# WHERE and ORDER BY

## WHERE filters rows

```try-sql
SELECT * FROM Customers WHERE City = 'Kisumu';
```

```try-sql
SELECT Name, Price FROM Products WHERE Price > 1000;
```

Combine conditions with `AND`, `OR`, `NOT`, `IN`, `BETWEEN` and `LIKE`:

```try-sql
SELECT * FROM Products
WHERE Category IN ('Storage', 'Electronics') AND Price BETWEEN 800 AND 4000;
```

```try-sql
SELECT * FROM Customers WHERE Name LIKE 'A%';   -- names starting with A
```

## ORDER BY sorts

```try-sql
SELECT Name, Price FROM Products ORDER BY Price DESC;
```

## LIMIT

```try-sql
SELECT Name, Price FROM Products ORDER BY Price DESC LIMIT 3;
```
""","Select all customers from **Nairobi**.","SELECT * FROM Customers\n","Wanjiku Mwangi,Nairobi","WHERE")
lesson(s,"functions-group","Functions and GROUP BY","""
# Functions and GROUP BY

## Aggregate functions

```try-sql
SELECT COUNT(*) AS products, MIN(Price) AS cheapest, MAX(Price) AS dearest, AVG(Price) AS average
FROM Products;
```

## GROUP BY

`GROUP BY` puts rows into groups, then the functions work per group.

```try-sql
SELECT City, COUNT(*) AS customers
FROM Customers
GROUP BY City
ORDER BY customers DESC;
```

```try-sql
SELECT Category, COUNT(*) AS items, SUM(Price) AS total_value
FROM Products
GROUP BY Category;
```

## HAVING filters groups

```try-sql
SELECT City, COUNT(*) AS customers
FROM Customers
GROUP BY City
HAVING COUNT(*) > 1;
```
""","Count how many products are in each **Category** (use `GROUP BY`).","","Accessories,2","GROUP BY")
lesson(s,"joins","JOIN","""
# JOIN

Data is split across tables. `JOIN` puts it back together using matching IDs.

```try-sql
SELECT Orders.OrderID, Customers.Name, Orders.OrderDate
FROM Orders
JOIN Customers ON Customers.CustomerID = Orders.CustomerID;
```

Join three tables and do some maths:

```try-sql
SELECT c.Name AS customer, p.Name AS product, o.Quantity, p.Price * o.Quantity AS total
FROM Orders o
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products p ON p.ProductID = o.ProductID
ORDER BY total DESC;
```

## LEFT JOIN

`LEFT JOIN` keeps every row from the first table, even with no match. Who hasn't ordered yet?

```try-sql
SELECT c.Name, o.OrderID
FROM Customers c
LEFT JOIN Orders o ON o.CustomerID = c.CustomerID
WHERE o.OrderID IS NULL;
```
""","Show each order's **OrderID** with the **product Name**, by joining Orders and Products.","","","JOIN\nProducts\nOrders")
lesson(s,"changing-data","INSERT, UPDATE and DELETE","""
# INSERT, UPDATE and DELETE

## INSERT adds rows

```try-sql
INSERT INTO Customers (Name, City, Phone) VALUES ('Mutua Musyoka', 'Machakos', '0712000008');
SELECT * FROM Customers;
```

## UPDATE changes rows

```try-sql
UPDATE Products SET Price = 3200 WHERE ProductID = 5;
SELECT * FROM Products WHERE ProductID = 5;
```

> **Always** use `WHERE` with UPDATE and DELETE. Without it, *every* row changes!

## DELETE removes rows

```try-sql
DELETE FROM Orders WHERE OrderID = 7;
SELECT COUNT(*) AS orders_left FROM Orders;
```

## CREATE TABLE

```try-sql
CREATE TABLE Suppliers (SupplierID INTEGER PRIMARY KEY, Name TEXT NOT NULL, Town TEXT);
INSERT INTO Suppliers (Name, Town) VALUES ('Nyeri Tech Distributors', 'Nyeri');
SELECT * FROM Suppliers;
```
""","Insert a new product called **Webcam** in the **Electronics** category costing **2800**, then select all products.","","Webcam,Electronics,2800","INSERT INTO Products")

