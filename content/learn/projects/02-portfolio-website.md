---
slug: portfolio-website
title: "Project 1: Personal portfolio website (HTML, CSS, JavaScript, GitHub Pages)"
after: how-to-build-projects
---
# Project 1: Personal portfolio website

Your portfolio website is the home of every other project. It's the link you put on your CV, LinkedIn, WhatsApp status and freelance profiles. In this project you build a fast, responsive, accessible one-page portfolio and publish it free on GitHub Pages.

**You'll practise:** semantic HTML, Flexbox and Grid, responsive design, dark mode with CSS variables, a little JavaScript, Git and deployment.

**Lessons you need first:** [HTML forms](./?track=html&lesson=forms), [semantic HTML](./?track=html&lesson=semantic), [Flexbox](./?track=css&lesson=flexbox), [Grid](./?track=css&lesson=grid), [responsive design](./?track=css&lesson=responsive), [variables and dark mode](./?track=css&lesson=variables-dark-mode), [DOM and events](./?track=javascript&lesson=dom-events), [GitHub Pages](./?track=git&lesson=github-pages). The [HTML portfolio lesson](./?track=html&lesson=project-portfolio) is a smaller warm-up.

## Step 1: Plan the content

A portfolio is a sales page where **you** are the product. Before any code, write the content in a document:

| Section | What to write |
|---|---|
| **Hero** | Your name, a one-line title ("Junior web developer in Nairobi building fast websites and M-Pesa payment systems"), and two buttons: *See my work* and *Contact me* |
| **About** | 3–4 sentences: what you do, what you're learning, what kind of work you want. Real facts only. |
| **Skills** | Grouped: Front-end, Back-end, Tools. Only list what you can actually use. |
| **Projects** | 3–6 cards: screenshot, title, one-sentence problem, tech used, *Live* and *Code* links |
| **Experience / education** | Attachments, freelance work, courses, a relevant degree or diploma |
| **Contact** | Email, WhatsApp link, LinkedIn, GitHub, and a contact form |

:::warning Be honest
Never invent clients, jobs, awards or years of experience. Recruiters check, and one discovered lie destroys trust. If you have no client work yet, show your projects and say you're "available for first projects and attachments". That's normal and fine.
:::

## Step 2: Set up the folder and repository

```bash
mkdir portfolio && cd portfolio
mkdir css js img
touch index.html css/style.css js/main.js
git init
git add . && git commit -m "Project skeleton"
```

On GitHub, create a repository called **`yourusername.github.io`**. A repository with exactly that name is published at `https://yourusername.github.io` automatically.

## Step 3: The HTML structure

Use semantic elements so search engines and screen readers understand the page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jane Wambui | Web developer in Nairobi</title>
  <meta name="description" content="Jane Wambui builds fast, mobile-friendly websites and M-Pesa payment systems for Kenyan businesses.">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <a href="#top" class="logo">JW</a>
    <nav aria-label="Main">
      <button class="menu-btn" aria-expanded="false" aria-controls="menu">Menu</button>
      <ul id="menu">
        <li><a href="#projects">Projects</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <button id="theme" aria-label="Switch dark mode">🌙</button>
  </header>

  <main id="top">
    <section class="hero">
      <h1>Hi, I'm Jane. I build fast websites for Kenyan businesses.</h1>
      <p>Junior web developer · HTML, CSS, JavaScript, PHP, MySQL · M-Pesa integrations</p>
      <a class="btn" href="#projects">See my work</a>
      <a class="btn btn-line" href="#contact">Contact me</a>
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <div class="cards">
        <article class="card">
          <img src="img/booking.webp" alt="Salon booking system showing free time slots" width="600" height="375" loading="lazy">
          <h3>Salon booking system</h3>
          <p>Customers book free time slots online; the owner manages the day from a phone.</p>
          <p class="tags">PHP · MySQL · JavaScript</p>
          <a href="https://example.com">Live demo</a> · <a href="https://github.com/you/booking">Code</a>
        </article>
        <!-- more cards -->
      </div>
    </section>

    <section id="about">…</section>
    <section id="contact">…</section>
  </main>

  <footer><p>© 2026 Jane Wambui</p></footer>
  <script src="js/main.js" defer></script>
</body>
</html>
```

Replace the example name and links with your own.

## Step 4: Style it, mobile first

Write the phone layout first, then add a media query for bigger screens. Use CSS variables so dark mode is just a second set of colours:

```css
:root {
  --bg: #ffffff; --text: #1f2937; --muted: #6b7280; --brand: #2563eb; --card: #f3f4f6;
}
[data-theme="dark"] {
  --bg: #0f172a; --text: #e5e7eb; --muted: #9ca3af; --brand: #60a5fa; --card: #1e293b;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; background: var(--bg); color: var(--text); }
section { padding: 4rem 1rem; max-width: 1100px; margin: 0 auto; }
.hero h1 { font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.15; }
.btn { display: inline-block; padding: .75rem 1.25rem; border-radius: 8px; background: var(--brand); color: #fff; text-decoration: none; }
.btn-line { background: transparent; color: var(--brand); border: 2px solid var(--brand); }
.cards { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.card { background: var(--card); border-radius: 12px; padding: 1rem; }
.card img { width: 100%; height: auto; border-radius: 8px; }
.site-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem; }
#menu { display: none; list-style: none; padding: 0; }
#menu.open { display: block; }
@media (min-width: 768px) {
  .menu-btn { display: none; }
  #menu { display: flex; gap: 1.5rem; }
}
```

`repeat(auto-fit, minmax(260px, 1fr))` gives one column on phones and two or three on laptops, with no media query at all.

## Step 5: Add JavaScript (small and useful)

Two features: the mobile menu and a dark mode switch that remembers the choice.

```javascript
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector("#menu");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

const themeBtn = document.querySelector("#theme");
const saved = localStorage.getItem("theme");
if (saved === "dark") document.documentElement.dataset.theme = "dark";
themeBtn.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  if (dark) document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  localStorage.setItem("theme", dark ? "dark" : "light");
});
```

Try a mini version of the project card grid and the dark mode switch here:

```try-html
<style>
  :root { --bg:#fff; --text:#1f2937; --card:#f3f4f6; --brand:#2563eb; }
  [data-theme="dark"] { --bg:#0f172a; --text:#e5e7eb; --card:#1e293b; --brand:#60a5fa; }
  body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 1rem; }
  .cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
  .card { background: var(--card); border-radius: 10px; padding: 1rem; }
  button { background: var(--brand); color: #fff; border: 0; padding: .5rem 1rem; border-radius: 6px; }
</style>
<button id="t">Toggle dark mode</button>
<h2>Projects</h2>
<div class="cards">
  <div class="card"><h3>Booking system</h3><p>PHP · MySQL</p></div>
  <div class="card"><h3>M-Pesa checkout</h3><p>Daraja API</p></div>
  <div class="card"><h3>Sales dashboard</h3><p>Excel · SQL</p></div>
</div>
<script>
  document.getElementById("t").onclick = function () {
    var r = document.documentElement;
    if (r.dataset.theme === "dark") delete r.dataset.theme; else r.dataset.theme = "dark";
  };
</script>
```

## Step 6: A contact form that works on a static site

GitHub Pages can't run PHP, so a form needs a helper:
- **Simplest:** a `mailto:` link and a WhatsApp link: `https://wa.me/2547XXXXXXXX?text=Hi%20Jane` (your number in international format, no `+` or leading `0`).
- **A real form:** free tiers of form services (Formspree, Web3Forms, Netlify Forms) accept a form `action` and email you the messages. Read their privacy terms.
- **Later:** host on PHP hosting and process the form yourself (see the [blog project](./?track=projects&lesson=blog-cms) for safe form handling).

## Step 7: Performance, SEO and accessibility

- Images: resize to the size they're displayed at, save as **WebP**, add `width`, `height`, `loading="lazy"` and meaningful `alt` text ([responsive images](./?track=html&lesson=responsive-images)).
- One `h1`, then `h2`s for sections; a unique `<title>` and meta description ([SEO and accessibility](./?track=html&lesson=seo-accessibility)).
- Colour contrast: text must be readable in both themes. Test with the browser's Lighthouse tool (DevTools → Lighthouse) and aim for 90+ in every category.
- Add an Open Graph image so your link looks good when shared on WhatsApp and LinkedIn:

```html
<meta property="og:title" content="Jane Wambui | Web developer">
<meta property="og:description" content="Fast websites and M-Pesa payment systems for Kenyan businesses.">
<meta property="og:image" content="https://yourusername.github.io/img/og.png">
```

## Step 8: Deploy

```bash
git add .
git commit -m "Portfolio: hero, projects, about, contact, dark mode"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

Open `https://yourusername.github.io` after a minute or two. Later you can connect your own domain (a `.co.ke` domain is affordable; see [domains](./?track=hosting&lesson=domains) and [DNS records](./?track=hosting&lesson=dns-records)).

## Stretch goals

- A **projects filter** (All / Web / Data / Mobile) with JavaScript.
- Load projects from a `projects.json` file with `fetch` ([JSON and fetch](./?track=javascript&lesson=json-fetch)), so adding a project means editing one file.
- A **blog** section where you write about what you're learning (great for SEO and interviews).
- Subtle scroll animations that respect `prefers-reduced-motion`.

## Checklist before you share it

- Looks right on a small phone, a tablet and a laptop
- Every link works; live demos open; GitHub repos are public with READMEs
- No spelling mistakes (read it aloud, or have a friend read it)
- Lighthouse scores 90+; images are compressed
- Your contact details are correct and the form or WhatsApp link works
- Only true facts about you

## Summary

- Plan the content first; you are the product.
- Semantic HTML, mobile-first CSS with variables, small useful JavaScript.
- Publish free with a `username.github.io` repository; add your own domain later.

```quiz
Q: What must the GitHub repository be named so it is published at https://yourusername.github.io? (use yourusername)
A: yourusername.github.io
Q: Which CSS value makes a grid automatically fit as many columns as possible? (two words, hyphenated first word)
A: auto-fit | repeat(auto-fit
Q: Which image format is usually smallest for photos on the web today?
A: WebP | AVIF
Q: Which attribute delays loading off-screen images? (write attribute="value")
A: loading="lazy" | loading=lazy | lazy
```
