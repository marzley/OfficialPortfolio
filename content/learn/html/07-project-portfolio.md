---
slug: project-portfolio
title: Project: build your own portfolio page
after: project-landing-page
---
# Project: build your own portfolio page

A **portfolio** is the page that gets you hired. Clients and employers want to see who you are, what you can do and proof that you've done it. In this project you'll combine everything from the HTML course into one complete page.

## What a strong portfolio has

1. **Header** with your name, a short title ("Web developer in Eldoret") and a menu.
2. **About**: 2–3 sentences, a photo, what you are good at.
3. **Skills**: a clear list.
4. **Projects**: 3–6 real pieces of work, each with a picture, what it is, the tools you used, and a link.
5. **Contact**: WhatsApp, email and a small form.
6. **Footer** with your social links.

## Step 1: the skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Brian Kiprop | Web Developer in Eldoret</title>
  <meta name="description" content="I build fast websites for small businesses in Eldoret and online.">
</head>
<body>
  <header>...</header>
  <main>
    <section id="about">...</section>
    <section id="skills">...</section>
    <section id="projects">...</section>
    <section id="contact">...</section>
  </main>
  <footer>...</footer>
</body>
</html>
```

## Step 2: the full page

Run it, then **change every detail to your own**: name, town, projects, links.

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Brian Kiprop | Web Developer in Eldoret</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b; }
    header { background: #0b1b35; color: #fff; padding: 24px 16px; }
    header a { color: #ffb800; margin-right: 12px; text-decoration: none; }
    main { max-width: 760px; margin: auto; padding: 16px; }
    .projects { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
    article { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    article img { width: 100%; height: auto; display: block; }
    article div { padding: 10px 12px; }
    .tags span { background: #f1f5f9; border-radius: 99px; padding: 2px 8px; font-size: 13px; margin-right: 4px; }
    label { display: block; margin-top: 8px; font-weight: 600; }
    input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
    footer { text-align: center; padding: 20px; background: #f1f5f9; }
  </style>
</head>
<body>
  <header>
    <h1>Brian Kiprop</h1>
    <p>Web developer in Eldoret. I build fast websites for small businesses.</p>
    <nav><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#contact">Contact</a></nav>
  </header>
  <main>
    <section id="about">
      <h2>About me</h2>
      <p>I studied ICT at a TVET college and have built websites for shops, schools and churches.
         I love clean design and pages that load fast on any phone.</p>
    </section>
    <section id="skills">
      <h2>Skills</h2>
      <ul>
        <li>HTML, CSS and JavaScript</li>
        <li>Responsive design for phones</li>
        <li>M-Pesa payment buttons</li>
        <li>Basic SEO and Google Business Profile</li>
      </ul>
    </section>
    <section id="projects">
      <h2>Projects</h2>
      <div class="projects">
        <article>
          <img src="https://picsum.photos/id/292/420/240" alt="Screenshot of a bakery website" width="420" height="240">
          <div>
            <h3>Njeri's Bakery</h3>
            <p>Online cake menu with WhatsApp ordering.</p>
            <p class="tags"><span>HTML</span><span>CSS</span></p>
            <a href="#">View project</a>
          </div>
        </article>
        <article>
          <img src="https://picsum.photos/id/180/420/240" alt="Screenshot of a school website" width="420" height="240">
          <div>
            <h3>Hill View School</h3>
            <p>School site with news, fees and a contact form.</p>
            <p class="tags"><span>HTML</span><span>JavaScript</span></p>
            <a href="#">View project</a>
          </div>
        </article>
      </div>
    </section>
    <section id="contact">
      <h2>Contact</h2>
      <p>WhatsApp: <a href="https://wa.me/254700000000">0700 000 000</a></p>
      <form>
        <label for="n">Your name</label><input id="n" required>
        <label for="m">Message</label><textarea id="m" rows="4" required></textarea>
        <p><button>Send</button></p>
      </form>
    </section>
  </main>
  <footer>&copy; 2026 Brian Kiprop</footer>
</body>
</html>
```

## Step 3: make it yours

- Use a real, friendly photo of yourself.
- Replace the projects with your own work. No real clients yet? Build 3 practice sites (a café, a school, a salon) and show them.
- Write project descriptions as **results**: "Customers can now order on WhatsApp" is stronger than "I used HTML".

## Step 4: publish it for free

When it's ready, put it online with **GitHub Pages** (see the Git & GitHub tutorial). Share the link in your CV, WhatsApp status and LinkedIn.

## Checklist before you share

1. Title and description describe you and your town.
2. Every image has an `alt` and is compressed.
3. All links work.
4. Test on your phone.
5. Your contact details are correct.

```quiz
Q: Which section should show 3 to 6 examples of your real work?
A: projects
Q: Which free service from the Git & GitHub tutorial can publish your portfolio? (two words)
A: github pages
Q: Which meta tag makes your portfolio fit phone screens?
A: viewport
```
=== exercise ===
Start your own portfolio: add a `<header>` with an `<h1>` of your name, and a `<section id="projects">` with an `<h2>` that says **Projects**.
=== starter ===
<!DOCTYPE html>
<html lang="en">
<body>
  
</body>
</html>
=== must_contain ===
<header>
<h1>
id="projects"
Projects
