---
slug: portfolio-project
title: "Project: design and build your portfolio page, from planning and case studies to publishing and getting clients"
after: KEEP
---
# Project: design and build your portfolio page, from planning and case studies to publishing and getting clients

A portfolio is your most important marketing tool as a designer or developer. Clients and employers rarely hire based on certificates alone; they want to **see** what you can do and how you think. In this capstone project you'll plan, design and build a one-page portfolio using everything from this subject (hierarchy, colour, typography, spacing, mobile-first layout, accessible buttons and forms, landing-page structure), write case studies, publish it free, and use it to win work.

:::note What you will build
- A clear personal brand and positioning statement
- A one-page responsive portfolio (hero, work, case studies, services, about, testimonials, contact)
- 3 project case studies that show your process
- An accessible, fast, SEO-friendly page
- A live link on GitHub Pages or Netlify
- A plan to share it and get enquiries
:::

## Step 1: Plan

Answer these before designing:
1. **Who** do you want to work with? (Small businesses in Mombasa? NGOs? Startups? Employers hiring junior developers?)
2. **What** do you offer? (Website design, landing pages, UI design for apps, WordPress sites, branding)
3. **Why you?** (Fast delivery, M-Pesa integrations, design + SEO, bilingual content, specific industry experience)
4. **What action** should visitors take? (WhatsApp you, book a call, email, view GitHub)

Write a one-line positioning statement: "I design fast, mobile-friendly websites that help Kenyan small businesses get customers on WhatsApp and Google."

## Step 2: Gather your work

Don't have clients yet? Create **realistic practice projects**:
- Redesign a local business's outdated website (as a concept; don't misrepresent it as commissioned work).
- Design a landing page for a fictional but realistic product (a solar company, a salon, a school).
- Build a small web app (booking form, fees calculator, M-Pesa checkout demo in sandbox).
- Volunteer for a church, chama, school club or NGO, with permission to show the work.

Aim for **3 strong projects** rather than 10 weak ones.

## Step 3: Write case studies

A case study shows how you think, which matters as much as the final visuals:

```
Project: Online booking site for Glow Salon (Kisumu)
Problem: Bookings came only by phone; missed calls meant lost clients.
My role: UX research, UI design, front-end build.
Process:
 - Interviewed the owner and 5 clients; mapped the booking flow.
 - Wireframed a 3-step booking: service → time → M-Pesa deposit.
 - Designed mobile-first screens in Figma; tested a prototype with 4 users.
 - Built with HTML/CSS/JS and a PHP back end; M-Pesa sandbox integration.
Result: Booking takes under 1 minute; the owner reports fewer no-shows thanks to deposits.
Visuals: before/after screenshots, mobile mock-ups, link to live site.
```

Be honest about results; use measured numbers when you have them, and describe qualitative feedback when you don't.

## Step 4: Design the page

Sections (like a landing page, with **you** as the offer):

| Section | Content |
|---|---|
| **Hero** | Name, positioning line, primary CTA ("See my work" / "WhatsApp me"), photo optional |
| **Selected work** | 3 project cards with image, title, one line, link to case study |
| **Services** | What you offer, maybe "from" prices |
| **Process** | 3–4 steps: discovery → design → build → launch/support |
| **About** | Short story, skills/tools, photo (builds trust) |
| **Testimonials** | Real quotes with names (even from volunteer or class projects) |
| **Contact** | WhatsApp link, email, simple form, social links (LinkedIn, GitHub, Behance) |

Design in Figma first (mobile and desktop), using a small palette, 1–2 fonts, a spacing scale and reusable components.

## Step 5: Build it

Start from this starter code, then make it yours: colours, fonts, text, projects and spacing.

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Amina Hassan – Web Designer in Mombasa</title>
<meta name="description" content="Amina designs fast, mobile-friendly websites for small businesses in Kenya, with M-Pesa payments and WhatsApp chat.">
<style>
  :root { --brand: #0b1b35; --accent: #ffb800; --muted: #475569; --line: #e2e8f0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; color: #0f172a; line-height: 1.6; }
  .wrap { width: min(100% - 32px, 960px); margin-inline: auto; }
  header { background: var(--brand); color: #fff; padding: 56px 0; }
  header h1 { font-size: clamp(28px, 6vw, 44px); margin: 0 0 8px; line-height: 1.15; }
  header p { color: #cbd5e1; margin: 0 0 22px; max-width: 48ch; }
  .btn { display: inline-block; background: var(--accent); color: var(--brand); padding: 12px 22px; border-radius: 999px; font-weight: 800; text-decoration: none; }
  .btn:focus-visible { outline: 3px solid #93c5fd; outline-offset: 3px; }
  h2 { margin: 48px 0 16px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .card { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; background: #fff; }
  .card .pic { height: 120px; background: linear-gradient(135deg, var(--brand), #1e3a7a); }
  .card div { padding: 16px; }
  .card h3 { margin: 0 0 4px; font-size: 18px; }
  .card p { margin: 0; color: var(--muted); }
  .steps { counter-reset: s; list-style: none; padding: 0; display: grid; gap: 10px; }
  .steps li { counter-increment: s; padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; }
  .steps li::before { content: counter(s) ". "; font-weight: 800; color: #b45309; }
  blockquote { margin: 0; padding: 16px; background: #fffbeb; border-left: 4px solid var(--accent); border-radius: 8px; }
  footer { margin-top: 56px; padding: 28px 0; background: #f1f5f9; }
</style>
</head>
<body>
<header><div class="wrap">
  <h1>Hi, I'm Amina.<br>I design websites that sell.</h1>
  <p>Web designer in Mombasa helping small businesses look professional online and get more WhatsApp enquiries.</p>
  <a class="btn" href="#work">See my work</a>
</div></header>
<main class="wrap">
  <h2 id="work">Selected work</h2>
  <div class="grid">
    <article class="card"><div class="pic" role="img" aria-label="Salon booking site preview"></div><div><h3>Salon booking site</h3><p>3-step bookings with M-Pesa deposits.</p></div></article>
    <article class="card"><div class="pic" role="img" aria-label="School website preview"></div><div><h3>School website</h3><p>Admissions, fees and news, built mobile-first.</p></div></article>
    <article class="card"><div class="pic" role="img" aria-label="Café menu preview"></div><div><h3>Café menu</h3><p>A fast menu that loads on any phone.</p></div></article>
  </div>
  <h2>How I work</h2>
  <ol class="steps"><li>Discovery call and goals</li><li>Wireframes and design in Figma</li><li>Build, test on real phones</li><li>Launch, training and support</li></ol>
  <h2>About me</h2>
  <p>I've designed for 20+ clients across Kenya. I focus on clear layouts, accessible design and pages that load fast on mobile data.</p>
  <blockquote>"Amina's site paid for itself in the first month." – Juma, café owner</blockquote>
  <h2>Let's work together</h2>
  <p><a class="btn" href="https://wa.me/254700000000">WhatsApp me</a></p>
</main>
<footer><div class="wrap">Email: amina@example.com · LinkedIn · GitHub</div></footer>
</body>
</html>
```

## Step 6: Quality checks

| Area | Check |
|---|---|
| **Design** | One clear main action; strong hierarchy; consistent spacing; 2 fonts max; small palette |
| **Mobile** | Looks good at 360–414px; no sideways scroll; buttons easy to tap |
| **Accessibility** | Contrast passes; alt text/labels; keyboard focus visible; headings in order; `lang` set |
| **Performance** | Compressed images (WebP), few fonts, PageSpeed mobile score checked |
| **SEO** | Descriptive `<title>` and meta description; one H1; your name + role + location in text |
| **Content** | No typos; real contact links work; honest case studies |

## Step 7: Publish

- **GitHub Pages**: push to a repository named `username.github.io` (see the Git subject), or **Netlify/Cloudflare Pages** with drag-and-drop or Git.
- Optional: a custom domain like `aminahassan.co.ke` for credibility.
- Add Google Search Console and simple analytics to see visits.

## Step 8: Get it in front of people

- Add the link to your WhatsApp profile, LinkedIn, Upwork/Fiverr profiles, email signature and CV.
- Share each case study as a LinkedIn post or short video walkthrough.
- Send personalised messages to 10 local businesses with a concrete idea for their website (see the freelancing lessons).
- Ask happy clients for testimonials and update your portfolio every few months, replacing older work with better projects.

:::think A junior designer's portfolio shows 15 screenshots with no explanations, a slow 8 MB hero video, and only an email address hidden in the footer. How would you improve it?
Choose the best 3–5 projects and turn them into short case studies (problem, role, process, result); replace the video with a compressed image or remove it; add a clear hero with positioning and a prominent CTA (WhatsApp/book a call) repeated near the end; add services, process, about and testimonials; and check mobile, accessibility, speed and SEO before republishing.
:::

## Summary

- Plan your audience, offer, differentiator and main action, and write a positioning statement.
- Gather 3 strong projects (practice or real) and present them as case studies showing your process.
- Structure the page like a landing page: hero, work, services, process, about, testimonials, contact.
- Design in Figma, build mobile-first, and check design, accessibility, performance, SEO and content quality.
- Publish on GitHub Pages/Netlify, share widely, and keep improving it with new work and testimonials.

```quiz
Q: How many strong projects should a beginner portfolio focus on (at least)?
A: 3 | three
Q: What does a case study show besides the final design?
A: process | your process | how you think | the process
Q: Name a free place to publish a static portfolio.
A: GitHub Pages | netlify | cloudflare pages
Q: Which HTML attribute tells browsers and screen readers the page language?
A: lang
Q: Should you present a concept redesign as paid client work? (yes/no)
A: no
```
