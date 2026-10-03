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

## Why a portfolio matters in Kenya's tech market

For web designers, developers, graphic designers and writers, a portfolio is often more convincing than a certificate. Clients and employers want proof: "show me something you built". A simple, fast, well-written portfolio site shows your skills twice: in the projects you present and in the quality of the site itself. It's also the link you put in your CV, LinkedIn, Upwork or Fiverr profile, WhatsApp status and email signature.

## Plan before you code

Answer these questions first; they decide what goes on the page:

| Question | Example answer |
|---|---|
| Who should hire me? | Small businesses in Nakuru needing websites |
| What do I offer? | Business websites, landing pages, website fixes |
| What proof do I have? | Three practice sites, one site for a church, one for a relative's shop |
| What should visitors do? | Message me on WhatsApp or send the contact form |
| What makes me different? | Fast replies, M-Pesa integration, training the client to update content |

## Writing project case studies

A screenshot alone says little. For each project, write a short case study:

```html
<article class="project">
  <img src="img/mama-mboga-shop.webp" alt="Homepage of the Mama Mboga online shop on a phone" width="800" height="600" loading="lazy">
  <h3>Mama Mboga online shop</h3>
  <p><strong>Problem:</strong> A vegetable seller in Nakuru took all orders by phone and often mixed them up.</p>
  <p><strong>Solution:</strong> A mobile-friendly order page with a product list, WhatsApp ordering and delivery areas.</p>
  <p><strong>Result:</strong> Orders now arrive written down in one place; the owner updates prices herself.</p>
  <p><strong>Tools:</strong> HTML, CSS, JavaScript, WhatsApp click-to-chat</p>
  <p><a href="https://example.com/demo">Live demo</a> · <a href="https://github.com/you/mama-mboga">Code</a></p>
</article>
```

Problem → solution → result → tools is the structure employers and clients understand. Be honest: if a project was a practice exercise, call it a "practice project". Never claim client work you didn't do or results you can't support.

## If you have no client work yet

Build realistic practice projects that solve local problems:

1. A restaurant site with a menu, opening hours and a WhatsApp order button.
2. A school landing page with admissions info and a contact form.
3. A landing page for a salon with a price list and booking form.
4. A small JavaScript app: a loan calculator, quiz, or budget tracker.
5. A redesign of an existing (outdated) local business website, clearly labelled as a concept.

Three good projects beat ten unfinished ones.

## Make the page fast and accessible

| Check | Target |
|---|---|
| Lighthouse Performance | 90+ on mobile |
| Images | WebP, resized, lazy-loaded below the fold, width/height set |
| Accessibility | Alt text, labels, good contrast, keyboard navigation, visible focus |
| SEO | Unique title and description, one h1, Open Graph image |
| Mobile | Test on a real phone; no sideways scroll; tap targets large enough |

Run Lighthouse in Chrome DevTools (Lighthouse tab → Analyze) and fix what it reports. A slow portfolio for a web developer is a red flag to clients.

## Add a working contact method

```html
<section id="contact">
  <h2>Let's work together</h2>
  <p>Tell me about your project and I'll reply within 24 hours.</p>
  <a class="btn" href="https://wa.me/254700000000?text=Hi%2C%20I%20saw%20your%20portfolio">Chat on WhatsApp</a>
  <form action="https://formspree.io/f/your-form-id" method="post">
    <label for="cname">Name</label><input id="cname" name="name" autocomplete="name" required>
    <label for="cemail">Email</label><input id="cemail" name="email" type="email" autocomplete="email" required>
    <label for="cmsg">Project details</label><textarea id="cmsg" name="message" rows="4" required></textarea>
    <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">  <!-- spam trap -->
    <button>Send message</button>
  </form>
</section>
```

`wa.me` links open a WhatsApp chat with a pre-filled message (replace the example number with yours, in international format without +). A free form service like Formspree handles form emails on a static site.

## Publishing options

| Option | Cost | Notes |
|---|---|---|
| GitHub Pages | Free | Great for developers; shows your GitHub too |
| Netlify / Cloudflare Pages | Free tier | Drag-and-drop or Git deploys, free HTTPS |
| Shared hosting (cPanel) | Paid yearly | Needed if you want PHP, email accounts |
| Custom domain (.co.ke or .com) | Paid yearly | `yourname.co.ke` looks professional |

After publishing, submit the site to Google Search Console so it can be found when people search your name.

## Promote your portfolio

- Add the link to your CV, LinkedIn, GitHub profile, Upwork/Fiverr profile and email signature.
- Share each new project on LinkedIn or X with a short story of what you learned.
- Ask satisfied clients for a short testimonial (with their permission to publish their name).
- Keep it updated: remove weak old projects as you build better ones.

## Final checklist before sharing

1. All links work (including "Live demo" and "Code").
2. No spelling mistakes (read it aloud or use a spell checker).
3. Contact form tested: you received the test message.
4. Looks good on a small phone, a tablet and a laptop.
5. Your name and main skill are clear within 5 seconds.
6. Page title is "Your Name | Web Designer in Town" (or similar).
7. Favicon and share image are set.

## Practice

1. Write your positioning sentence: "I help [who] with [what] so they can [result]."
2. Write case studies (problem, solution, result, tools) for two projects.
3. Run Lighthouse on your portfolio and reach 90+ on all four scores.
4. Publish it on GitHub Pages or Netlify and share the link with three people for feedback.

:::think A beginner's portfolio lists 15 skills (HTML, CSS, JS, Python, PHP, React, Flutter, Photoshop, ...) but shows only one small project. How would you improve it?
Narrow the focus to the skills shown in real work, and replace the long list with 3 to 5 solid projects with short case studies and live links. Clients trust evidence more than claims; a few well-presented projects in one area (for example business websites) are far more convincing than a long skills list.
:::

```quiz
Q: Which section should show 3 to 6 examples of your real work?
A: projects
Q: Which free service from the Git & GitHub tutorial can publish your portfolio? (two words)
A: github pages
Q: Which meta tag makes your portfolio fit phone screens?
A: viewport
Q: What structure should a project case study follow? (problem, solution, ...)
A: result | problem solution result | problem, solution, result
Q: Which link format opens a WhatsApp chat with your number? (domain)
A: wa.me | https://wa.me
Q: Which Chrome DevTools tool scores performance, accessibility and SEO?
A: Lighthouse
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
