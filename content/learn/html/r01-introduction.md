---
slug: introduction
title: "HTML introduction: what it is, why we need it, who uses it and your first page"
after: KEEP
---
# HTML introduction: what it is, why we need it, who uses it and your first page

Every website you have ever opened, from Google and YouTube to KRA iTax, eCitizen, Jumia, your bank and your school portal, is built on **HTML**. Before you can design websites, build web apps or even understand how the internet shows you information, you need to understand HTML. This first unit takes you from "I have never written code" to "I built and understand my own web page", slowly and completely.

:::note What you will learn in this unit
- What HTML is (and what it is not)
- Why the world needs HTML and why it is the first skill for web development
- Who uses HTML every day, and the jobs it leads to
- Where HTML is used (websites, apps, emails, documents, even TVs)
- How a browser turns HTML text into the page you see
- The parts of an HTML element: tags, content and attributes
- The structure of every HTML page, line by line
- How to write, save and open your own page, and how to fix common mistakes
:::

## What is HTML?

**HTML** stands for **HyperText Markup Language**.

- **HyperText** means text that contains **links** to other text. Clicking a link and jumping to another page is the "hyper" part. This idea is what turned separate documents into the connected World Wide Web.
- **Markup** means we **mark** (label) pieces of content to say what they are: "this is a heading", "this is a paragraph", "this is a picture", "this is a link".
- **Language** means it has rules (a syntax) that browsers understand.

:::define HTML
A markup language that describes the **structure and meaning** of the content on a web page, using tags such as `<h1>` (main heading), `<p>` (paragraph) and `<a>` (link).
:::

Think of a newspaper. The editor decides: this is the headline, this is a sub-heading, this is a paragraph, this is a photo with a caption. HTML does exactly that job for a web page. It does **not** decide colours, fonts or animation; it decides **what each thing is**.

### HTML is not a programming language

People often call HTML "coding", and that's fine, but technically HTML is a **markup** language, not a **programming** language:

| | HTML (markup) | A programming language (e.g. JavaScript, Python) |
|---|---|---|
| Purpose | Describes content and structure | Gives instructions, makes decisions, calculates |
| Can it do maths or `if` decisions? | No | Yes |
| Example | `<h1>Welcome</h1>` | `if (age >= 18) { allowEntry(); }` |

This makes HTML the **easiest** place to start: no logic, no maths, just labelling content correctly.

### The three languages of the web

Every modern website uses three languages together. Remember them with a house:

| Language | Job | House comparison |
|---|---|---|
| **HTML** | Structure and content | The walls, rooms, doors and windows |
| **CSS** | Appearance: colours, fonts, layout, mobile design | The paint, tiles, curtains and furniture arrangement |
| **JavaScript** | Behaviour: clicks, menus, calculations, loading data | The electricity, water and the gate that opens with a remote |

You always build the walls first. That's why HTML comes first.

## A short history: why HTML exists

- **1989–1991:** Tim Berners-Lee, a scientist at CERN (a research centre in Switzerland), wanted researchers to share documents easily and link between them. He invented HTML, the first web browser and the first web server. The first website went live in 1991.
- **1990s:** Browsers like Netscape and Internet Explorer competed and added their own tags, so websites often worked in one browser but not another.
- **1994:** The **W3C** (World Wide Web Consortium) was formed to create shared web standards.
- **2014:** **HTML5** became the official standard, adding audio, video, new form inputs and meaningful tags like `<header>`, `<nav>` and `<article>`.
- **Today:** HTML is a **"living standard"** maintained by WHATWG (the browser makers: Google, Apple, Mozilla, Microsoft). It improves continuously, so we just say "HTML".

:::think Why do you think browser makers agreed to follow one shared HTML standard instead of each inventing their own tags?
Because websites need to work for **everyone**. If each browser understood different tags, a developer would have to build several versions of every site, and users would see broken pages. A shared standard means you write HTML once and it works in Chrome, Safari, Firefox, Edge and phone browsers. It's the same reason all countries agree that a red light means stop.
:::

## Why do we need HTML?

1. **Browsers only understand HTML (plus CSS and JavaScript).** You can't send a Word document or a photo of your design to a browser and get a website. Every page, even ones built with modern tools like React or WordPress, ends up as HTML in the browser.
2. **It gives content meaning.** When you mark a heading as `<h1>`, the browser, Google and screen readers all know it's the main topic. Plain text can't do this.
3. **Search engines read it.** Google ranks pages partly by reading their HTML: titles, headings, links and image descriptions. Good HTML helps a business get found when someone searches "plumber in Thika".
4. **Accessibility.** Blind and visually impaired people use **screen readers** that read HTML aloud. Correct HTML lets them jump between headings, understand links and fill forms. Poor HTML locks them out.
5. **It works everywhere.** The same HTML file works on a KSh 8,000 Android phone, an iPhone, a laptop and a smart TV.
6. **It's the foundation for everything else.** CSS styles HTML. JavaScript changes HTML. Frameworks generate HTML. If you skip HTML, everything later is confusing.

:::kenya
When a small business in Nakuru asks for a website so customers can find their opening hours, prices and M-Pesa till number, the developer's first job is writing that information as HTML. Businesses pay Kenyan web developers anything from KSh 15,000 for a simple site to hundreds of thousands for large systems, and every one of those projects starts with HTML.
:::

## Who uses HTML?

| Who | How they use HTML |
|---|---|
| **Front-end web developers** | Write HTML, CSS and JavaScript for the parts of websites users see |
| **Full-stack developers** | Front-end plus servers and databases (e.g. PHP + MySQL generating HTML pages) |
| **Web designers** | Turn their designs into HTML/CSS, or work closely with developers |
| **WordPress / Shopify site builders** | Edit themes and templates, which are HTML with extra code |
| **Digital marketers and SEO specialists** | Edit page titles, meta descriptions and headings to rank higher on Google |
| **Email marketers** | Build newsletters (emails are HTML too) |
| **Content writers and bloggers** | Format articles; most editors show an "HTML" view |
| **App developers** | Many apps show web pages inside them, and hybrid apps are HTML-based |
| **Students and trainees** | HTML is the first unit in most ICT, computer science and CBET web courses |
| **Business owners** | Make small edits to their own site (prices, contacts) |

:::career
HTML alone rarely gets you hired, but it's the first step to jobs such as **front-end developer**, **web designer**, **WordPress developer**, **email developer** and **SEO specialist**. Freelancers on Upwork and Fiverr regularly get paid to fix and convert HTML pages. Combined with CSS and JavaScript, HTML can lead to a real income within months of consistent practice.
:::

## Where is HTML used?

- **Websites:** business sites, blogs, news, schools, churches, government portals (eCitizen, KRA, KUCCPS).
- **Web applications:** Gmail, Google Docs, online banking, M-Pesa web portals, school management systems, hospital systems. These are HTML + CSS + JavaScript talking to servers.
- **Emails:** newsletters and receipts (like your online shopping receipts) are HTML emails.
- **Mobile apps:** many apps contain web views, and frameworks like Ionic and Capacitor build whole apps from HTML.
- **Desktop apps:** VS Code, Slack, Discord and Microsoft Teams are built with web technology (Electron).
- **Documents and e-books:** EPUB e-books are HTML inside; many help pages and manuals are HTML.
- **Smart TVs, car screens, kiosks and ATMs:** many of their screens are web pages.

## How a browser shows an HTML page

When you type an address like `marzleytechsolutions.co.ke` and press Enter:

1. Your browser asks a **DNS** server: "What is the IP address of this name?" (like looking up a phone number in contacts).
2. It connects to the **web server** at that address and asks for the page (an **HTTP request**).
3. The server sends back an **HTML file** (text).
4. The browser **reads the HTML from top to bottom** and builds a tree of elements in memory, called the **DOM** (Document Object Model).
5. It downloads the extra files the HTML mentions: CSS, JavaScript, images, fonts.
6. It **renders** (paints) the page on your screen.

All of this usually happens in under two seconds. The HTML is the starting point: everything else is loaded because the HTML asked for it.

:::tip See the HTML of any website
On a laptop, open any website, right-click and choose **View page source** (or press `Ctrl+U`). That text is the HTML the server sent. Choose **Inspect** to see the live DOM. You can't break the real site this way; changes only affect your own screen.
:::

## The anatomy of an HTML element

HTML is made of **elements**. Most elements have three parts:

```
<p>Karibu to my website</p>
│ │                  │
│ └ content          └ closing tag (has a slash)
└ opening tag
```

- The **opening tag** `<p>` starts the element. `p` is the **tag name** (paragraph).
- The **content** is what's inside.
- The **closing tag** `</p>` ends it. It's the same name with a forward slash `/`.

Some elements have **no content** and no closing tag. They are called **empty** or **void** elements:

```
<br>                         a line break
<img src="logo.png" alt="Marzley Tech logo">   an image
<hr>                         a horizontal line (a thematic break)
```

### Attributes: extra information

**Attributes** go inside the opening tag and give extra information, as `name="value"` pairs:

```
<a href="https://kra.go.ke">Visit KRA</a>
   │    │
   │    └ value (in quotes)
   └ attribute name
```

Here `href` tells the link where to go. You'll learn many attributes: `src`, `alt`, `class`, `id`, `lang` and more.

### Nesting: elements inside elements

Elements can contain other elements. This is called **nesting**, and the rule is: **close the inner one before the outer one** (last opened, first closed).

```
Correct:  <p>This is <strong>very</strong> important.</p>
Wrong:    <p>This is <strong>very</p> important.</strong>
```

Think of boxes inside boxes: you close the small box before closing the big box.

## The structure of every HTML page

Every complete HTML page follows the same skeleton. Read each line's explanation carefully.

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My first page</title>
</head>
<body>
  <h1>Habari! Welcome to my page</h1>
  <p>I am learning HTML with Marzley Tech.</p>
</body>
</html>
```

| Line | What it means |
|---|---|
| `<!DOCTYPE html>` | Tells the browser "this is a modern HTML5 page". Without it, browsers use an old "quirks mode" that can break layouts. It isn't a tag; it's a declaration, and it always comes first. |
| `<html lang="en">` | The **root** element that wraps everything. `lang="en"` says the page is in English (use `sw` for Kiswahili). Screen readers use it to pronounce words correctly, and Google uses it for search results. |
| `<head>` | Information **about** the page that isn't shown in the page body: title, character set, links to CSS, descriptions for Google. |
| `<meta charset="UTF-8">` | Lets the page show every character correctly: Kiswahili, emojis, KSh, accents. Without it you may see strange symbols like `â€™`. |
| `<meta name="viewport" ...>` | Makes the page fit phone screens instead of looking like a tiny zoomed-out desktop page. Essential in Kenya, where most people browse on phones. |
| `<title>` | The text on the browser tab and the blue clickable title in Google results. |
| `<body>` | Everything visible on the page: headings, text, images, links, forms. |
| `<h1>` | The main heading. |
| `<p>` | A paragraph. |

Press **Run** above, then change the heading text and run it again. Then try adding a second paragraph.

:::think If you deleted the `<title>` line, would the page still show the heading and paragraph?
Yes. The title is in the `<head>`, which isn't shown in the page body. The page still works, but the browser tab would show the file name or address instead of a nice title, and Google would have no good title to show. So always include it.
:::

## Writing your first page on your own computer

The editor on this page is great for practice. To build real websites, you'll create files on your computer:

1. **Install a code editor.** We recommend **Visual Studio Code** (free, from code.visualstudio.com). On a phone, you can practise here or use apps like Acode (Android).
2. **Make a folder** for your project, e.g. `Documents/my-website`.
3. **Create a file** named `index.html`. The name `index.html` is special: web servers show it automatically when someone visits your domain.
4. **Type the skeleton** above (in VS Code, typing `!` then pressing Tab writes it for you).
5. **Save** with `Ctrl+S`.
6. **Open it in a browser:** double-click the file, or drag it into Chrome. The address bar will show something like `file:///C:/Users/You/Documents/my-website/index.html`.
7. **Edit, save, refresh.** Change the HTML, save, then press `F5` in the browser to see the change.

:::warning File name rules that save you hours
- Use **lowercase** letters: `about.html`, not `About.HTML`. Many web servers treat `About.html` and `about.html` as different files.
- **No spaces**: use `contact-us.html`, not `contact us.html`.
- Always end with **`.html`**. On Windows, turn on "File name extensions" in File Explorer so you don't accidentally save `index.html.txt`.
:::

## Comments: notes for humans

A **comment** is a note in your code that the browser ignores. Use comments to explain sections or to temporarily hide code.

```try-html
<!-- This is a comment. Visitors don't see it on the page. -->
<h1>Juma's Phone Repairs</h1>
<!-- TODO: add our opening hours below -->
<p>We fix screens, batteries and charging ports in Kisumu.</p>
```

Comments **are** visible if someone views the page source, so never put passwords or secrets in them.

## Whitespace: how browsers treat spaces and new lines

Browsers **collapse** multiple spaces and new lines into **one space**. This lets you indent your code neatly without changing the page.

```try-html
<p>This     has     many     spaces
and a new line, but it shows on one line with single spaces.</p>
```

To control layout and spacing you use CSS (later), not extra spaces. To force a line break inside text (like an address), use `<br>`:

```try-html
<p>Marzley Tech Solutions<br>Nairobi, Kenya<br>Open Monday to Saturday</p>
```

## Good habits from day one

- **Indent** nested elements with 2 spaces so you can see the structure.
- **Lowercase** tag and attribute names (HTML ignores case, but lowercase is the standard).
- **Quote** attribute values: `href="about.html"`.
- **Close** every element that needs closing.
- **Save often** and **test on a phone** as well as a computer.
- **Check your code** with the free W3C validator (validator.w3.org) when something looks wrong.

## Common beginner mistakes

| Mistake | Example | Fix |
|---|---|---|
| Forgetting the closing tag | `<p>Hello` | `<p>Hello</p>` |
| Wrong slash direction | `<\p>` | `</p>` (forward slash) |
| Wrong nesting order | `<p><strong>Hi</p></strong>` | `<p><strong>Hi</strong></p>` |
| Missing quotes | `<a href=about page.html>` | `<a href="about-page.html">` |
| Typo in tag name | `<pargraph>` | `<p>` |
| File saved as `.txt` | `index.html.txt` | Show file extensions; save as `index.html` |
| Content outside `<body>` | Text after `</html>` | Put visible content inside `<body>` |

:::tip When something doesn't show
Browsers are forgiving: they try to guess what you meant instead of showing an error. That's helpful, but it can hide mistakes. If something looks wrong, check closing tags and nesting first; they cause most problems.
:::

## Practice tasks

Try these in the editor above (or in VS Code):

1. Change the page title to your name and the heading to **"Welcome to [your town]"**.
2. Add three paragraphs: one about yourself, one about your school or work, and one about what you want to build.
3. Add a comment above each paragraph describing it.
4. Use `<br>` to write your address on three lines.
5. Change `lang="en"` to `lang="sw"` and write one paragraph in Kiswahili.

## Summary

- **HTML** (HyperText Markup Language) describes the **structure and meaning** of web content. It's a **markup** language, not a programming language.
- Websites use **HTML** (structure), **CSS** (appearance) and **JavaScript** (behaviour) together.
- HTML is needed because browsers understand it, search engines read it, screen readers depend on it, and every web technology builds on it.
- It's used by developers, designers, marketers, email builders and students, in websites, web apps, emails, apps and devices.
- An **element** = opening tag + content + closing tag; **attributes** add extra information; elements **nest** inside each other.
- Every page has `<!DOCTYPE html>`, `<html>`, `<head>` (with `charset`, `viewport` and `title`) and `<body>`.
- Name files in lowercase with no spaces, and save them as `.html`.

```quiz
Q: What does HTML stand for?
A: HyperText Markup Language | hypertext markup language
Q: Is HTML a markup language or a programming language?
A: markup | markup language
Q: Which language controls colours, fonts and layout?
A: CSS
Q: Which element holds everything visible on the page?
A: body | <body>
Q: Which element's text appears on the browser tab?
A: title | <title>
Q: Which meta tag makes a page fit phone screens? Write its name value.
A: viewport
Q: What do we call an element with no content and no closing tag, like <br>?
A: void | empty | void element | empty element
Q: What file name do web servers show automatically for a folder?
A: index.html
Q: Who invented HTML? Write the surname.
A: Berners-Lee | Tim Berners-Lee | berners lee
```
=== exercise ===
Make a page with a main heading that says **Hello Kenya** and a paragraph under it.
=== starter ===
<!DOCTYPE html>
<html>
<body>
  
</body>
</html>
=== expected ===

=== must_contain ===
<h1>
Hello Kenya
</h1>
<p>
