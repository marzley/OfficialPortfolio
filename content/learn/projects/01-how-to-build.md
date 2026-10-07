---
slug: how-to-build-projects
title: "How to build portfolio projects (read this first)"
after: START
---
# How to build portfolio projects (read this first)

Lessons teach you skills. **Projects prove you have them.** When an employer or client looks at your application, they rarely ask "which course did you take?" They ask "**what have you built?**" This subject gives you 14 real projects, each broken into steps, each linked to the lessons you need.

| # | Project | Main skills | Level |
|---|---|---|---|
| 1 | [Personal portfolio website](./?track=projects&lesson=portfolio-website) | HTML, CSS, JavaScript, GitHub Pages | Beginner |
| 2 | [Business website for a local client](./?track=projects&lesson=business-website) | HTML, CSS, SEO, Google Business, WhatsApp | Beginner |
| 3 | [Data analysis report](./?track=projects&lesson=data-analysis-report) | Excel or Python, charts, writing findings | Beginner–intermediate |
| 4 | [Blog with an admin panel](./?track=projects&lesson=blog-cms) | PHP, MySQL, login, CRUD | Intermediate |
| 5 | [Inventory and sales system](./?track=projects&lesson=inventory-system) | PHP, SQL, reports, roles | Intermediate |
| 6 | [REST API](./?track=projects&lesson=rest-api) | Node.js/Express, JSON, auth, testing | Intermediate |
| 7 | [M-Pesa payment system](./?track=projects&lesson=mpesa-payment-system) | Daraja STK push, callbacks, security | Intermediate |
| 8 | [Booking system](./?track=projects&lesson=booking-system) | Availability, double-booking, reminders | Intermediate |
| 9 | [E-commerce store](./?track=projects&lesson=ecommerce-store) | Cart, orders, M-Pesa checkout, admin | Intermediate–advanced |
| 10 | [Job board](./?track=projects&lesson=job-board) | Roles, search, file uploads | Intermediate–advanced |
| 11 | [School management system](./?track=projects&lesson=school-management-system) | Complex database, roles, report cards | Advanced |
| 12 | [Student portal](./?track=projects&lesson=student-portal) | Authentication, dashboards, fees | Advanced |
| 13 | [Mobile expense tracker app](./?track=projects&lesson=mobile-expense-app) | Flutter, local storage, charts | Intermediate |
| 14 | [Show your projects: portfolio, GitHub and CV](./?track=projects&lesson=showcase-your-projects) | Presenting your work | All levels |

You don't need to build all of them. Follow your [career roadmap](./?track=career-roadmaps&lesson=choose-a-tech-career): a web developer might build 1, 2, 4, 7 and 9; a data analyst 3 plus their own data projects; a mobile developer 13, 6 and 7.

## What makes a project "portfolio-worthy"?

| Weak project | Strong project |
|---|---|
| A copy of a YouTube tutorial, unchanged | Your own idea or a real client's need, built with your own decisions |
| Only runs on your laptop | **Live link** anyone can open on their phone |
| No README | README with what it does, screenshots, how to run it, what you learned |
| Lorem ipsum text, broken images | Realistic content (a real or realistic Kenyan business) |
| One giant commit "final" | Many small commits showing your progress |
| Passwords in the code | Secrets in a config file excluded from Git |

:::tip Tutorials are fine as a start
Following a tutorial is a good way to learn. To make it **yours**: change the topic, add two or three features the tutorial didn't have, fix something it did badly, and write about what you changed.
:::

## The 8-step method used in every project

Every project in this subject follows the same steps. Use them for your own ideas too.

### 1. Define the problem and the users

Write two or three sentences: *who* is this for and *what problem* does it solve?

> "Small salons in Nakuru take bookings by phone and WhatsApp and often double-book. This booking system lets customers pick a free slot online and lets the owner see the day's bookings on a phone."

### 2. List features as user stories, then cut

Write features as *"As a [user], I can [action] so that [benefit]"*. Then mark each one **Must**, **Should** or **Could** (this is called MoSCoW prioritisation). Build only the *Musts* first. A finished small project beats an unfinished big one.

### 3. Sketch the screens

On paper or in Figma ([wireframes and user flows](./?track=web-design&lesson=wireframes-user-flows)): every page, what's on it, and where each button goes.

### 4. Design the data

List the "things" (customers, products, bookings) and their properties, then draw how they connect. This becomes your database tables ([keys and database design](./?track=sql&lesson=keys-design)).

### 5. Set up the project properly

```bash
mkdir booking-system && cd booking-system
git init
echo "config.php" >> .gitignore      # secrets never go to GitHub
echo "uploads/" >> .gitignore
git add . && git commit -m "Start project"
```

Create a GitHub repository and push. See [your first repository](./?track=git&lesson=first-repo).

### 6. Build in thin vertical slices

Don't build "all the database", then "all the pages". Build **one feature end to end** (form → server → database → page shows the result), commit, then the next. You always have something that works.

### 7. Test like a user and like an attacker

- Try it on a phone. Try empty forms, very long text, wrong phone numbers, double-clicking "submit".
- Try to break it: what if someone changes the ID in the URL to see another user's data? What if they type `<script>` into a form? See [web security](./?track=cybersecurity&lesson=web-security).

### 8. Deploy, document and show

- Deploy: static sites to [GitHub Pages or free hosts](./?track=hosting&lesson=free-static-hosting), PHP to [shared hosting](./?track=hosting&lesson=cpanel-deploy), Node to a [platform or VPS](./?track=hosting&lesson=deploy-node-python-apps).
- Write the README (template in [Show your projects](./?track=projects&lesson=showcase-your-projects)).
- Add the project to your portfolio site and CV.

## A README template

```markdown
# Salon Booking System

Online booking for small salons: customers choose a service and a free time slot; the owner manages the day's bookings from a phone.

**Live demo:** https://example.com  ·  Demo login: owner@example.com / demo1234

![Screenshot of the booking page](screenshot.png)

## Features
- Shows only free time slots (no double bookings, enforced by the database)
- SMS-style confirmation code for each booking
- Owner dashboard: today's bookings, mark done / cancelled

## Built with
PHP 8, MySQL, HTML/CSS, vanilla JavaScript

## Run it locally
1. Import `database.sql` into MySQL
2. Copy `config.example.php` to `config.php` and fill in your database details
3. `php -S localhost:8000`

## What I learned
- Preventing double bookings with a UNIQUE key
- Protecting forms with CSRF tokens and prepared statements
```

## Keep secrets secret

Every project that uses a database, email or M-Pesa has **secrets**: passwords, API keys, consumer secrets. Rules:

1. Keep them in a separate file (`config.php`, `.env`) that is listed in `.gitignore`.
2. Commit a `config.example.php` with fake values so others know what to fill in.
3. If you ever push a secret to GitHub by mistake, **change the secret immediately**. Deleting the commit isn't enough; bots scan GitHub for leaked keys within minutes.

## Use AI as a tutor, not a ghost-writer

AI tools can explain errors, suggest approaches and review your code ([AI for study and learning](./?track=ai-tools&lesson=ai-for-study-learning)). But if you paste a whole project from AI and can't explain it, an interviewer will find out in two questions. Rule of thumb: **never commit code you can't explain line by line.**

## Summary

- Projects prove skills; live links and READMEs make them count.
- Follow the 8 steps: problem → features → screens → data → setup → slices → testing → deploy and show.
- Build the *Must* features first, commit often, keep secrets out of Git.

```quiz
Q: In MoSCoW prioritisation, which features do you build first? (one word)
A: must | musts | must-have | must have
Q: Which file tells Git which files never to commit? Include the dot.
A: .gitignore
Q: If you push a secret key to GitHub by mistake, what must you do immediately? (change the ___)
A: secret | key | the secret | the key | password
Q: Instead of building all of one layer at a time, you build features in thin vertical ___ (one word)
A: slices | slice
```
