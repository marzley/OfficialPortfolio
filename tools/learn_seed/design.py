from common import track, lesson

# ---------------- Web design & UI/UX ----------------
d = track("web-design", "Web design & UI/UX", "html",
          "Design websites people love to use: layout, colour, fonts, spacing, buttons, forms, mobile-first design and accessibility, with live examples.")

lesson(d, "design-principles", "Principles of good design", """
# Principles of good design

Good design is not decoration. It helps people **find what they need and act on it** quickly: call you, pay, book or read. Most great websites follow the same few principles.

## 1. Visual hierarchy

The most important thing should look the most important. Size, weight, colour and position tell the eye where to go first.

- One clear main heading per page.
- One main button (the **primary action**) per screen. Everything else is secondary.
- Big, bold and high on the page = important. Small and grey = supporting detail.

## 2. Contrast

Things that are different should **look** different. A yellow "Pay now" button on a navy page stands out; a grey button on a grey page disappears.

## 3. Alignment

Line things up. Text that starts at the same left edge looks organised; text that starts anywhere looks messy, even if the reader can't say why.

## 4. Proximity (grouping)

Things that belong together sit close together. A label sits right above its input, not halfway between two inputs.

## 5. Repetition (consistency)

Use the same button style, the same heading sizes and the same spacing everywhere. Consistency makes a site feel trustworthy and easier to learn.

## 6. White space

Empty space is not wasted space. It gives content room to breathe and makes pages easier to scan on a phone.

Compare these two cards: same content, different design.

```try-html
<div style="font-family:sans-serif;display:flex;gap:24px;flex-wrap:wrap">
  <div style="border:1px solid #999;padding:4px;width:230px">
    <b>Website package</b> KSh 25,000 Home, About, Services and Contact pages. Google Maps. WhatsApp button. <a href="#">Order</a> <a href="#">More info</a> <a href="#">Call</a>
  </div>

  <div style="border:1px solid #e2e8f0;border-radius:14px;padding:22px;width:230px">
    <h3 style="margin:0 0 4px">Website package</h3>
    <p style="font-size:28px;font-weight:800;margin:0 0 12px">KSh 25,000</p>
    <p style="color:#475569;margin:0 0 16px">Home, About, Services and Contact pages, Google Maps and a WhatsApp button.</p>
    <a href="#" style="display:block;text-align:center;background:#ffb800;color:#0b1b35;font-weight:700;padding:12px;border-radius:999px;text-decoration:none">Order now</a>
  </div>
</div>
```

The second card uses hierarchy (big price), grouping, white space and **one** clear action.

```quiz
Q: What is the name for making the most important thing look the most important?
A: visual hierarchy | hierarchy
Q: How many primary (main) buttons should a screen usually have?
A: one | 1
Q: Placing related items close together is called…
A: proximity | grouping
Q: Is empty (white) space wasted space? (yes or no)
A: no
```
""", "Make a card with a heading **Free website check**, a short paragraph, and a single link styled as a button (give it a `background` colour and `padding`).",
       "<div>\n  \n</div>", "", "<h\nFree website check\n<p\n<a\nbackground\npadding")

lesson(d, "colour", "Colour: palettes and contrast", """
# Colour: palettes and contrast

Colour sets the mood and guides attention. Most professional sites use a **small palette**:

| Role | How much | Example (Marzley) |
|---|---|---|
| Primary / brand | Headers, key areas | Navy `#0b1b35` |
| Accent | Buttons and highlights only | Amber `#ffb800` |
| Neutrals | Text, backgrounds, borders | Greys and white |
| Status | Success, warning, error | Green, orange, red |

A common rule is **60-30-10**: 60% neutral background, 30% brand colour, 10% accent.

## Contrast for reading

Text must stand out from its background. The WCAG accessibility guidelines ask for a contrast ratio of at least **4.5 : 1** for normal text and **3 : 1** for large text. Light grey text on white often fails, and outdoors on a phone it becomes unreadable.

```try-html
<div style="font-family:sans-serif">
  <p style="color:#bbb;background:#fff;padding:10px">Light grey on white: hard to read (fails)</p>
  <p style="color:#475569;background:#fff;padding:10px">Slate grey on white: easy to read (passes)</p>
  <p style="color:#0b1b35;background:#ffb800;padding:10px;font-weight:700">Navy on amber: strong and readable</p>
</div>
```

## Tips

- Never use colour **alone** to show meaning. Add an icon or words too ("Error: phone number is missing"), because about 1 in 12 men has some colour blindness.
- Pick colours with a tool such as **coolors.co** or **Adobe Color**, and test contrast with **WebAIM Contrast Checker**.
- Keep the accent colour rare so it keeps its power.
- In CSS, store colours as variables so you can change them in one place:

```try-html
<style>
  :root { --brand: #0b1b35; --accent: #ffb800; }
  .hero { background: var(--brand); color: #fff; padding: 24px; font-family: sans-serif; border-radius: 12px; }
  .hero a { background: var(--accent); color: var(--brand); padding: 10px 18px; border-radius: 999px; text-decoration: none; font-weight: 700; }
</style>
<div class="hero"><h2>Grow your business online</h2><a href="#">Get a quote</a></div>
```

```quiz
Q: In the 60-30-10 rule, what percentage is the accent colour?
A: 10 | 10%
Q: What minimum contrast ratio does WCAG ask for normal text? (write it like 4.5:1)
A: 4.5:1 | 4.5 : 1 | 4.5
Q: Should colour be the only way to show an error? (yes or no)
A: no
```
""", "Create CSS variables `--brand` and `--accent` in `:root` and use them for a heading's `color` and a link's `background`.",
       "<style>\n  :root {  }\n</style>\n<h1>My shop</h1>\n<a href=\"#\">Buy</a>", "", "--brand\n--accent\nvar(--brand)\nvar(--accent)")

lesson(d, "typography", "Typography: fonts that read well", """
# Typography: fonts that read well

About 90% of a website is text, so typography matters more than any picture.

## Choosing fonts

- **Sans-serif** fonts (Inter, Roboto, Open Sans, Poppins) are clean and easy to read on screens. Most modern sites use them.
- **Serif** fonts (Merriweather, Playfair Display, Georgia) feel classic and formal: good for law firms, schools or headlines.
- Use **at most two** font families: one for headings and one for body text (or just one for everything).
- Free, legal fonts: **Google Fonts** (fonts.google.com).

## Size, line height and line length

| Setting | Good starting point |
|---|---|
| Body text size | 16–18 px |
| Line height | 1.5–1.7 |
| Line length | 45–80 characters per line |
| Headings | Clearly bigger: e.g. 32 px, 24 px, 20 px |

```try-html
<style>
  body { font-family: system-ui, sans-serif; }
  .bad { font-size: 12px; line-height: 1.1; max-width: none; }
  .good { font-size: 17px; line-height: 1.65; max-width: 60ch; color: #334155; }
  h2 { font-size: 26px; line-height: 1.2; margin: 18px 0 6px; color: #0b1b35; }
</style>
<h2>Too small and cramped</h2>
<p class="bad">We build websites, online shops and school systems for businesses across Kenya. Every site is fast on mobile data, easy to update and comes with support.</p>
<h2>Comfortable to read</h2>
<p class="good">We build websites, online shops and school systems for businesses across Kenya. Every site is fast on mobile data, easy to update and comes with support.</p>
```

## Scale and weight

Use a consistent **type scale** (for example each heading about 1.25× the next) and use **weight** (400 regular, 600 semi-bold, 800 extra-bold) to create hierarchy without adding more fonts.

## Avoid

- ALL CAPITALS for long text (hard to read; fine for short labels).
- Centred paragraphs longer than two lines.
- Justified text on phones (it creates rivers of gaps).

```quiz
Q: What is a good body text size on the web, in pixels? (give one number from 16 to 18)
A: 16 | 17 | 18
Q: What is a comfortable line height for body text? (give a number between 1.5 and 1.7)
A: 1.5 | 1.6 | 1.65 | 1.7
Q: What is the maximum number of font families you should usually use?
A: two | 2
Q: Which free website offers hundreds of web fonts? (two words)
A: Google Fonts
```
""", "Style the paragraph so it has a `font-size` of **17px**, a `line-height` of **1.6** and a `max-width` of **60ch**.",
       "<style>\n  p {  }\n</style>\n<p>Readable text makes people stay longer on your website.</p>", "", "font-size\n17px\nline-height\n1.6\nmax-width\n60ch")

lesson(d, "spacing-layout", "Spacing, grids and layout", """
# Spacing, grids and layout

## Use a spacing scale

Instead of random gaps (7 px here, 13 px there), pick a scale and stick to it. Many designers use multiples of **8**: 4, 8, 16, 24, 32, 48, 64. Consistent spacing makes a page look calm and professional.

## Common page layouts

- **Single column**: blog posts, forms, phones. Easy to read.
- **Cards in a grid**: products, services, courses.
- **Split (50/50)**: text on one side, image on the other. Stacks on phones.
- **F-pattern and Z-pattern**: people scan the top line, then down the left side. Put important things top-left and the main button where the eye ends.

## Card grid that fits any screen

```try-html
<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; font-family: sans-serif; }
  .card { padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; }
  .card h3 { margin: 0 0 8px; }
  .card p { margin: 0; color: #475569; line-height: 1.5; }
</style>
<div class="grid">
  <div class="card"><h3>Websites</h3><p>Fast, mobile-first sites.</p></div>
  <div class="card"><h3>Online shops</h3><p>Sell with M-Pesa and cards.</p></div>
  <div class="card"><h3>Systems</h3><p>Schools, clinics, SACCOs.</p></div>
  <div class="card"><h3>Training</h3><p>Learn ICT skills.</p></div>
</div>
```

Drag the window narrower: the cards wrap on their own. `auto-fit` + `minmax()` is one of the most useful lines in CSS.

## Split layout that stacks on phones

```try-html
<style>
  .split { display: flex; flex-wrap: wrap; gap: 24px; align-items: center; font-family: sans-serif; }
  .split > * { flex: 1 1 260px; }
  .img { height: 180px; border-radius: 16px; background: linear-gradient(135deg, #0b1b35, #1e3a7a); }
</style>
<section class="split">
  <div><h2>Your business, online in days</h2><p>We design, build and host your website so you can focus on customers.</p></div>
  <div class="img" role="img" aria-label="Illustration"></div>
</section>
```

```quiz
Q: Many designers base their spacing on multiples of which number?
A: 8 | eight
Q: Which CSS function lets grid columns be at least 180px but share extra space? (just the name)
A: minmax | minmax()
Q: In the F-pattern, which side of the page do people scan down? (left or right)
A: left
```
""")

lesson(d, "buttons-forms", "Buttons, forms and calls to action", """
# Buttons, forms and calls to action

A **call to action (CTA)** is the thing you want visitors to do: "Get a quote", "Pay with M-Pesa", "Chat on WhatsApp".

## Great buttons

- Say **what happens**: "Download the price list", not "Submit" or "Click here".
- Look clickable: filled colour, rounded corners, enough padding.
- Are big enough to tap: at least **44 × 44 px** on phones.
- Have clear states: hover, focus (for keyboard users), disabled and loading.

```try-html
<style>
  .btn { display: inline-block; font: 700 16px system-ui, sans-serif; padding: 14px 22px; border-radius: 999px; border: 2px solid #0b1b35; cursor: pointer; margin: 6px; }
  .primary { background: #ffb800; color: #0b1b35; border-color: #ffb800; }
  .secondary { background: #fff; color: #0b1b35; }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(11,27,53,.18); }
  .btn:focus-visible { outline: 3px solid #2563eb; outline-offset: 3px; }
</style>
<button class="btn primary">Get a free quote</button>
<button class="btn secondary">See our work</button>
```

## Forms people finish

- Ask for **as little as possible**. Every extra field loses customers.
- Put the **label above** the input, and never use the placeholder as the only label.
- Use the right input type so phones show the right keyboard: `type="tel"`, `type="email"`, `inputmode="numeric"`.
- Show errors **next to the field** in plain words: "Enter a Safaricom number like 0712 345 678".
- Group long forms into steps.

```try-html
<style>
  form { max-width: 340px; font-family: system-ui, sans-serif; }
  label { display: block; font-weight: 600; margin: 14px 0 6px; }
  input { width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 16px; }
  button { margin-top: 18px; width: 100%; padding: 14px; background: #0b1b35; color: #fff; border: 0; border-radius: 10px; font-size: 16px; font-weight: 700; }
</style>
<form onsubmit="event.preventDefault(); alert('Thanks!')">
  <label for="n">Your name</label>
  <input id="n" autocomplete="name" required>
  <label for="p">Phone number</label>
  <input id="p" type="tel" autocomplete="tel" placeholder="0712 345 678" required>
  <button>Request a call back</button>
</form>
```

```quiz
Q: What is the minimum comfortable tap size for a button on a phone, in pixels?
A: 44 | 44px | 44 x 44
Q: Should you use the placeholder as the only label? (yes or no)
A: no
Q: Which input type makes phones show a number pad for phone numbers?
A: tel | type="tel"
Q: What does CTA stand for?
A: call to action
```
""", "Make a button with the text **Pay with M-Pesa** that has a `background` colour, `padding` and `border-radius`.",
       "<style>\n  button {  }\n</style>\n", "", "<button\nPay with M-Pesa\nbackground\npadding\nborder-radius")

lesson(d, "mobile-first", "Mobile-first and responsive design", """
# Mobile-first and responsive design

Most people in Kenya browse on phones, often on mobile data. **Mobile-first** means you design for the small screen first, then add more layout for bigger screens.

## The basics

1. Always include the viewport tag in the `<head>`:

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

2. Write the phone styles first, then use `min-width` media queries to enhance:

```try-html
<style>
  .menu { display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; }
  .menu a { padding: 12px; background: #f1f5f9; border-radius: 10px; color: #0b1b35; text-decoration: none; }
  @media (min-width: 600px) {
    .menu { flex-direction: row; }
  }
</style>
<nav class="menu"><a href="#">Home</a><a href="#">Services</a><a href="#">Pricing</a><a href="#">Contact</a></nav>
<p style="font-family:sans-serif;color:#475569">Make the output narrower than 600px: the menu stacks.</p>
```

3. Use flexible units: `%`, `rem`, `fr`, `vw` and `max-width` instead of fixed widths.
4. Make images flexible:

```
img { max-width: 100%; height: auto; }
```

## Speed is part of design

- Compress images (WebP format, under about 200 KB each).
- Load only the fonts you need.
- Test on a cheap phone and slow network. In Chrome DevTools, turn on the device toolbar and throttle to "Slow 4G".

## Common breakpoints

There is no magic list, but many sites use roughly **600 px** (large phones and small tablets), **900 px** (tablets and small laptops) and **1200 px** (desktops). Add a breakpoint where **your** layout starts to look wrong.

```quiz
Q: In mobile-first CSS, do you mainly use min-width or max-width media queries?
A: min-width
Q: Which tag must be in the head so phones don't zoom out the page? (one word: the meta name)
A: viewport
Q: Which modern image format is usually smaller than JPG and PNG?
A: WebP
Q: What CSS makes images shrink to fit their container? (property and value, like max-width: 100%)
A: max-width: 100% | max-width:100%
```
""", "Write a media query for screens **at least 600px wide** that sets `.menu` to `flex-direction: row`.",
       "<style>\n  .menu { display: flex; flex-direction: column; }\n  \n</style>\n<nav class=\"menu\"><a href=\"#\">Home</a><a href=\"#\">Shop</a></nav>", "", "@media\nmin-width\n600px\nflex-direction\nrow")

lesson(d, "accessibility", "Accessible design for everyone", """
# Accessible design for everyone

**Accessibility (a11y)** means people with disabilities can use your site: blind users with screen readers, people who can't use a mouse, people with low vision or colour blindness, and older users. It also helps everyone else, and Google rewards it.

## Checklist

- **Text alternatives**: every meaningful image has `alt` text. Decorative images use `alt=""`.
- **Headings in order**: one `<h1>`, then `<h2>`, `<h3>`. Screen reader users jump between headings.
- **Labels on every input** with `<label for="...">`.
- **Keyboard**: everything works with Tab, Enter and Space. Never remove the focus outline without replacing it.
- **Contrast**: at least 4.5 : 1 for normal text.
- **Links make sense alone**: "Read our pricing" instead of "Click here".
- **Don't rely on colour alone**, and don't flash things more than 3 times a second.
- **Language**: `<html lang="en">` so screen readers pronounce correctly.
- **Respect settings**: honour `prefers-reduced-motion` for people who get dizzy from animations.

```try-html
<style>
  a, button { font: 16px system-ui, sans-serif; }
  button:focus-visible, a:focus-visible { outline: 3px solid #ffb800; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
</style>
<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%2790%27%3E%3Crect width=%27160%27 height=%2790%27 rx=%2712%27 fill=%27%230b1b35%27/%3E%3C/svg%3E" alt="Kelvin presenting a website to a client">
<p><a href="#">Read our pricing</a> (press Tab to see the focus ring)</p>
<button>Get a quote</button>
```

## Test it yourself

- Unplug the mouse and use the site with only the keyboard.
- Run **Lighthouse** in Chrome DevTools (it has an Accessibility score).
- Try a free screen reader: **NVDA** on Windows or **TalkBack** on Android.

```quiz
Q: What attribute gives an image a text alternative?
A: alt
Q: What alt value should a purely decorative image have?
A: "" | empty | alt="" | nothing
Q: Which key do keyboard users press to move between links and buttons?
A: Tab
Q: Which free Windows screen reader is mentioned? (4 letters)
A: NVDA
```
""")

lesson(d, "landing-page-anatomy", "Anatomy of a landing page that sells", """
# Anatomy of a landing page that sells

A landing page has **one goal**: get the visitor to take one action. Here is a proven structure, top to bottom:

1. **Hero**: a clear headline saying what you offer and for whom, one sentence of detail, and the main button. ("Websites for Kenyan businesses, ready in 7 days. Get a free quote.")
2. **Trust strip**: client logos, "200+ happy clients", star rating.
3. **Problem → solution**: show you understand their pain, then how you fix it.
4. **Benefits, not features**: "Customers can pay you at 2 a.m." beats "M-Pesa STK integration".
5. **Proof**: testimonials with names and photos, case studies, before/after.
6. **Pricing or next step**: clear packages or "from KSh 15,000".
7. **FAQ**: answer objections (How long? What if I need changes?).
8. **Final call to action** and contact details, WhatsApp button.

```try-html
<style>
  body { font-family: system-ui, sans-serif; margin: 0; color: #0f172a; }
  .hero { background: #0b1b35; color: #fff; padding: 40px 24px; text-align: center; }
  .hero h1 { margin: 0 0 10px; font-size: 30px; }
  .hero p { color: #cbd5e1; max-width: 46ch; margin: 0 auto 20px; line-height: 1.6; }
  .cta { background: #ffb800; color: #0b1b35; padding: 14px 24px; border-radius: 999px; font-weight: 800; text-decoration: none; display: inline-block; }
  .trust { text-align: center; padding: 14px; background: #f1f5f9; color: #475569; }
  .benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; padding: 24px; }
  .benefits div { border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; }
</style>
<section class="hero">
  <h1>Your shop, online in 7 days</h1>
  <p>A fast website where customers can see your products and pay with M-Pesa, day or night.</p>
  <a class="cta" href="#">Get a free quote</a>
</section>
<p class="trust">★★★★★ Trusted by 50+ Kenyan businesses</p>
<section class="benefits">
  <div><b>Get paid 24/7</b><br>M-Pesa and card payments.</div>
  <div><b>Found on Google</b><br>Built for search from day one.</div>
  <div><b>Easy to update</b><br>Change prices yourself.</div>
</section>
```

## Write headlines that work

- Be specific: numbers and time frames beat vague claims.
- Talk to the customer ("you"), not about yourself ("we are a leading…").
- Test two versions and keep the one that gets more clicks (A/B testing).

```quiz
Q: How many main goals should a landing page have?
A: one | 1
Q: "Customers can pay you at 2 a.m." is a benefit or a feature?
A: benefit | a benefit
Q: What is it called when you compare two versions of a page to see which performs better?
A: A/B testing | ab testing | a/b test | split testing
```
""", "Build a hero section: an `<h1>`, a paragraph and a link with the text **Get a free quote**.",
       "<section class=\"hero\">\n  \n</section>", "", "<h1\n<p\n<a\nGet a free quote")

lesson(d, "design-tools-figma", "Design tools: Figma, wireframes and prototypes", """
# Design tools: Figma, wireframes and prototypes

Before coding, designers plan pages in three levels of detail:

| Stage | What it is | Tool |
|---|---|---|
| **Sketch / wireframe** | Boxes and lines showing layout only, no colours | Paper, Figma, Balsamiq |
| **Mockup** | Full design with colours, fonts and images | Figma, Adobe XD, Canva |
| **Prototype** | Clickable mockup to test the flow | Figma prototype mode |

## Figma basics

**Figma** (figma.com) runs in the browser and has a free plan. Key ideas:

- **Frames**: the artboards for each screen (choose "iPhone 14" or "Desktop").
- **Auto layout**: makes elements stack and space themselves like CSS flexbox.
- **Components**: reusable parts (a button, a card). Change the main one and every copy updates.
- **Styles / variables**: saved colours and text styles, like CSS variables.
- **Prototype tab**: link a button to another frame to make it clickable.
- **Dev mode / Inspect**: developers read sizes, colours and CSS from the design.
- **Community**: thousands of free UI kits, icons and templates.

## A simple design process

1. **Understand** the user and goal (who visits, what must they do?).
2. **Research**: look at 5 competitor or inspiration sites (Dribbble, Behance, Awwwards, Land-book).
3. **Wireframe** the key pages on paper first. It's fast and cheap to change.
4. **Mockup** in Figma using a small palette and one or two fonts.
5. **Prototype and test** with 3–5 real people. Watch where they get stuck.
6. **Hand over** to development, then measure and improve.

## Free resources

- Icons: Font Awesome, Heroicons, Lucide
- Photos: Unsplash, Pexels
- Illustrations: unDraw, Storyset
- Colours: coolors.co · Fonts: Google Fonts

```quiz
Q: What is a layout-only drawing without colours called?
A: wireframe | a wireframe
Q: In Figma, what is a reusable element (like a button) called?
A: component | a component
Q: Which Figma feature works like CSS flexbox? (two words)
A: auto layout | autolayout
Q: How many people do you need for a useful quick usability test? (give a number from 3 to 5)
A: 3 | 4 | 5
```
""")

lesson(d, "portfolio-project", "Project: design your portfolio page", """
# Project: design your portfolio page

Put everything together by designing a one-page portfolio. It's the best way to show clients or employers what you can do.

## What to include

1. A hero with your name, what you do and a button ("Hire me" or "See my work").
2. Three project cards with an image, a title and one line each.
3. A short "About me" with a photo.
4. Contact: WhatsApp, email and links (GitHub, LinkedIn).

## Starter code

Run it, then make it yours: change the colours, fonts, text and spacing using what you've learned.

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root { --brand: #0b1b35; --accent: #ffb800; --muted: #475569; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #0f172a; line-height: 1.6; }
  .wrap { max-width: 960px; margin: 0 auto; padding: 0 20px; }
  header { background: var(--brand); color: #fff; padding: 56px 0; }
  header h1 { font-size: clamp(28px, 6vw, 44px); margin: 0 0 8px; line-height: 1.15; }
  header p { color: #cbd5e1; margin: 0 0 22px; max-width: 48ch; }
  .btn { background: var(--accent); color: var(--brand); padding: 12px 22px; border-radius: 999px; font-weight: 800; text-decoration: none; }
  h2 { margin: 40px 0 16px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .card { border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
  .card .pic { height: 120px; background: linear-gradient(135deg, var(--brand), #1e3a7a); }
  .card div { padding: 16px; }
  .card h3 { margin: 0 0 4px; font-size: 18px; }
  .card p { margin: 0; color: var(--muted); }
  footer { margin-top: 48px; padding: 24px 0; background: #f1f5f9; }
</style>
</head>
<body>
<header><div class="wrap">
  <h1>Hi, I'm Amina.<br>I design websites that sell.</h1>
  <p>Web designer in Mombasa helping small businesses look professional online.</p>
  <a class="btn" href="#work">See my work</a>
</div></header>
<main class="wrap">
  <h2 id="work">Recent work</h2>
  <div class="grid">
    <article class="card"><div class="pic"></div><div><h3>Salon booking site</h3><p>Online bookings and M-Pesa deposits.</p></div></article>
    <article class="card"><div class="pic"></div><div><h3>School website</h3><p>News, fees and admissions pages.</p></div></article>
    <article class="card"><div class="pic"></div><div><h3>Café menu</h3><p>A fast menu that works on any phone.</p></div></article>
  </div>
  <h2>About me</h2>
  <p>I've designed for 20+ clients. I focus on clear layouts, strong colours and pages that load fast on mobile data.</p>
</main>
<footer><div class="wrap">WhatsApp: 07XX XXX XXX · Email: amina@example.com</div></footer>
</body>
</html>
```

## Check your design

- Is there one clear main action?
- Does it look good at phone width?
- Is all text easy to read (size and contrast)?
- Did you use no more than two fonts and a small palette?

When you're happy, publish it free on **GitHub Pages** or **Netlify** (see the Web hosting subject) and share the link.
""")

# ---------------- Graphic design with Canva ----------------
g = track("graphic-design", "Graphic design with Canva", "none",
          "Design posters, social media posts, logos and business cards with Canva, and learn the basics of branding. Great for side income.")

lesson(g, "design-basics", "Graphic design basics", """
# Graphic design basics

Graphic design is communicating with pictures and words. Whether it's a poster for a church event, a flyer for a salon or an Instagram post for a shop, the same rules apply.

## The building blocks

- **Layout**: where things sit. Use a grid and align elements to it.
- **Typography**: fonts. Use one bold font for headlines and one simple font for details.
- **Colour**: 2–3 main colours. Use your brand colours consistently.
- **Images**: sharp, well-lit photos. Never stretch a photo out of shape.
- **White space**: leave breathing room around text and the edges.

## Hierarchy on a poster

A viewer should get the message in **3 seconds**:

1. **Headline** (biggest): "MEGA SALE" or "Free Medical Camp"
2. **Key details**: date, time, place, price
3. **Call to action**: "Call 0712 345 678" or "Book on WhatsApp"
4. **Logo** and small print (smallest)

## Common mistakes

- Too many fonts and colours on one design.
- Text over a busy photo with no dark overlay, so it can't be read.
- Everything the same size (no hierarchy).
- Low-resolution images that look blurry when printed.
- Spelling mistakes. Always proofread twice, especially phone numbers and dates.

## Print vs screen

| | Screen (social media) | Print (flyers, banners) |
|---|---|---|
| Colour mode | RGB | CMYK |
| Resolution | 72–150 ppi is fine | 300 dpi |
| File type | PNG or JPG | PDF (print) |

```quiz
Q: Roughly how many seconds should it take a viewer to get a poster's main message?
A: 3 | three
Q: Which colour mode do professional printers use? (4 letters)
A: CMYK
Q: What resolution in dpi should designs for print usually have?
A: 300 | 300 dpi
Q: Which file type is best to send to a printer?
A: PDF | pdf print
```
""")

lesson(g, "canva-essentials", "Canva essentials", """
# Canva essentials

**Canva** (canva.com) is a free design tool that works in the browser and on phones. It's popular for social media posts, posters, presentations, CVs and more.

## Getting started

1. Sign up free with your email or Google account.
2. Search for what you want: "Instagram post", "Flyer", "Business card", "Logo".
3. Pick a template or start blank.
4. Edit text, colours, photos and elements.
5. **Share → Download** as PNG (images), PDF Print (printing) or MP4 (videos).

## Key tools

- **Elements**: shapes, lines, icons, stickers, frames and grids.
- **Text**: add headings and body text; use the preset font combinations.
- **Uploads**: add your own logo and photos.
- **Brand Kit** (Pro, free for eligible education and non-profit accounts): save your logo, colours and fonts.
- **Background remover** (Pro): cut a product out of its background.
- **Resize** (Pro): turn one design into many sizes.
- **Magic Studio**: AI features such as generating images or writing text.
- **Position → Align**: line things up neatly. Hold Shift to keep proportions when resizing.

## Standard sizes (pixels)

| Design | Size |
|---|---|
| Instagram post | 1080 × 1080 (square) or 1080 × 1350 (portrait) |
| Instagram / WhatsApp / TikTok story | 1080 × 1920 |
| Facebook cover | about 1640 × 624 (safe area in the centre) |
| YouTube thumbnail | 1280 × 720 |
| A4 flyer | 210 × 297 mm |
| Business card | 85 × 55 mm (common in Kenya) or 3.5 × 2 in |

## Workflow tips

- Duplicate a page to try variations instead of starting again.
- Use the **grid view** to check a whole carousel at once.
- Group items (Ctrl+G) so they move together.
- Keep templates for your regular posts so your page looks consistent.

```quiz
Q: What size in pixels is a standard square Instagram post? (write like 1080x1080)
A: 1080x1080 | 1080 x 1080 | 1080×1080
Q: Which download option should you choose for printing? (two words)
A: PDF Print
Q: What size in pixels is a story (Instagram/WhatsApp)? (write like 1080x1920)
A: 1080x1920 | 1080 x 1920 | 1080×1920
Q: Which keyboard shortcut groups selected elements in Canva?
A: Ctrl+G | ctrl g | cmd+g
```
""")

lesson(g, "logos-branding", "Logos and branding", """
# Logos and branding

A **brand** is how people feel about a business. The **visual identity** (logo, colours, fonts, style) is what makes it recognisable.

## What makes a good logo

- **Simple**: recognisable at a small size (a phone app icon or a stamp).
- **Memorable**: one idea, not five.
- **Versatile**: works in one colour, on dark and light backgrounds, printed and on screen.
- **Timeless**: avoid trendy effects that will look dated.
- **Appropriate**: a law firm and a kids' shop need very different feels.

## Types of logos

| Type | Example idea |
|---|---|
| Wordmark (just the name in a special font) | "Marzley" in bold letters |
| Lettermark (initials) | "MT" |
| Icon / symbol | A leaf for an organic shop |
| Combination | Icon + name (most common for small businesses) |
| Emblem | Name inside a badge or crest (schools, clubs) |

## A simple brand kit

Every business should have a one-page brand guide:

1. **Logo** versions: full colour, white, black, and icon only.
2. **Colours** with their codes (HEX for screens, CMYK for print).
3. **Fonts**: headline and body.
4. **Tone of voice**: friendly? formal? Kiswahili, English or Sheng?
5. **Examples**: a sample post and a sample flyer.

## Deliver files properly

- **PNG** with a transparent background for websites and social media.
- **SVG** or **PDF** (vector) so it can be enlarged for banners without blurring.
- **JPG** for quick sharing on WhatsApp.

> Designing logos, brand kits and social media templates is a real side income. Build a portfolio of 5–10 designs (even for imaginary businesses) and share it on Instagram, Behance and WhatsApp status.

```quiz
Q: A logo made only of the business name in a special font is called a…
A: wordmark | a wordmark
Q: Which file type can be enlarged to any size without blurring? (3 letters)
A: SVG
Q: Which image type supports a transparent background: PNG or JPG?
A: PNG
Q: Name the colour code format used for screens (3 letters).
A: HEX | RGB
```
""")

lesson(g, "social-media-design", "Designing for social media", """
# Designing for social media

People scroll fast. Your design has about **one second** to stop the thumb.

## Rules for scroll-stopping posts

- **One message per post.** "20% off school shoes this week" is enough.
- **Big, short text**: 5–7 words on the image. Put details in the caption.
- **Strong contrast**: bold colours, a dark overlay behind text on photos.
- **Faces and products** get attention. Show real people and real items.
- **Consistent style**: same colours, fonts and layout so followers recognise you instantly.
- **Brand in every post**: small logo or handle in a corner.
- **Clear next step**: "DM to order", "Link in bio", "WhatsApp 07XX".

## Types of posts that work for small businesses

| Post | Idea |
|---|---|
| Product showcase | Clean photo + price |
| Before and after | Salon, cleaning, renovation, website redesign |
| Testimonial | Customer photo + short quote |
| Tips / how-to carousel | "5 ways to keep your phone battery healthy" |
| Behind the scenes | Your team at work |
| Offer / event | Date, time, place, price, CTA |

## Carousels

Carousels (multiple slides) get strong engagement. Slide 1 is the hook ("5 mistakes killing your sales"), the middle slides deliver value, and the last slide asks for action (follow, share, DM).

## Plan ahead

- Make a **content calendar** for the month (e.g. Monday tips, Wednesday product, Friday testimonial).
- Design templates once in Canva and reuse them.
- Schedule posts with **Meta Business Suite** (Facebook and Instagram, free).

```quiz
Q: About how many words should be on the image of a social media post? (give a number from 5 to 7)
A: 5 | 6 | 7
Q: What is a post with several slides called?
A: carousel | a carousel
Q: Which free Meta tool schedules Facebook and Instagram posts? (three words)
A: Meta Business Suite
Q: Which slide of a carousel is the hook: first or last?
A: first
```
""")
