---
slug: web-developer-roadmap
title: "Web developer roadmap: from zero to your first job or client"
after: choose-a-tech-career
---
# Web developer roadmap: from zero to your first job or client

Web developers build the websites and web apps that businesses, schools, churches, hospitals and governments run on. In Kenya there is steady demand for people who can build **business websites**, **booking and payment systems with M-Pesa**, **school and SACCO systems**, **e-commerce shops** and **WordPress sites**, both from local clients and from international companies hiring remotely.

This roadmap has **10 stages**. Each stage lists the lessons to take (click them), what to build, and a checkpoint so you know when to move on.

:::tip Front-end, back-end or full-stack?
- **Front-end**: what users see and click (HTML, CSS, JavaScript, React).
- **Back-end**: servers, databases, logins, payments (PHP or Node.js, SQL, APIs).
- **Full-stack**: both. Most Kenyan clients and small companies want full-stack people, so this roadmap covers both, front-end first.
:::

## Stage 1: How the web works and HTML (2–3 weeks)

Lessons:
- [Introduction to HTML](./?track=html&lesson=introduction) and [how the web works](./?track=html&lesson=how-the-web-works)
- [Headings and paragraphs](./?track=html&lesson=headings-paragraphs), [links and images](./?track=html&lesson=links-images), [lists and tables](./?track=html&lesson=lists-tables)
- [Forms](./?track=html&lesson=forms) and [form inputs and validation](./?track=html&lesson=form-inputs-validation)
- [Semantic HTML](./?track=html&lesson=semantic) and [SEO and accessibility](./?track=html&lesson=seo-accessibility)

Build: the [HTML landing page project](./?track=html&lesson=project-landing-page).

**Checkpoint:** you can write a complete page from an empty file without copying, using `header`, `main`, `section`, `footer`, a form and an image with `alt` text.

## Stage 2: CSS and responsive design (3–4 weeks)

Lessons:
- [CSS introduction](./?track=css&lesson=introduction), [selectors and colours](./?track=css&lesson=selectors-colours), [the box model](./?track=css&lesson=box-model)
- [Flexbox](./?track=css&lesson=flexbox), [Grid](./?track=css&lesson=grid), [responsive design](./?track=css&lesson=responsive)
- [Variables and dark mode](./?track=css&lesson=variables-dark-mode), [transitions and animations](./?track=css&lesson=transitions-animations)
- Design sense: [design principles](./?track=web-design&lesson=design-principles), [typography](./?track=web-design&lesson=typography), [mobile-first](./?track=web-design&lesson=mobile-first)

Build: the [business page project](./?track=css&lesson=project-business-page), then [Project: business website](./?track=projects&lesson=business-website).

**Checkpoint:** your pages look good on a phone *and* a laptop, and you can lay out a card grid with Grid and a navigation bar with Flexbox without looking anything up.

## Stage 3: JavaScript (6–8 weeks)

This is the biggest stage. Take your time.

Lessons:
- [Introduction](./?track=javascript&lesson=introduction), [variables and types](./?track=javascript&lesson=variables-types), [conditions](./?track=javascript&lesson=conditions), [loops and arrays](./?track=javascript&lesson=loops-arrays)
- [Functions and objects](./?track=javascript&lesson=functions-objects), [array methods](./?track=javascript&lesson=array-methods), [scope and closures](./?track=javascript&lesson=scope-closures)
- [The DOM and events](./?track=javascript&lesson=dom-events), [form validation](./?track=javascript&lesson=forms-validation)
- [JSON and fetch](./?track=javascript&lesson=json-fetch), [async/await](./?track=javascript&lesson=async-await), [local storage](./?track=javascript&lesson=local-storage)
- [Modules, npm and tooling](./?track=javascript&lesson=modules-npm-tooling)

Build: the [to-do app](./?track=javascript&lesson=project-todo) and the [quiz app](./?track=javascript&lesson=project-quiz-app). Then add interactivity to your [portfolio website](./?track=projects&lesson=portfolio-website).

**Checkpoint:** you can fetch JSON from an API and display it as cards, with loading and error states, and save user settings in local storage.

## Stage 4: Git and GitHub (1 week, then every day)

Lessons: [what Git is](./?track=git&lesson=what-is-git), [your first repository](./?track=git&lesson=first-repo), [good commits](./?track=git&lesson=gitignore-good-commits), [branches](./?track=git&lesson=branches), [GitHub](./?track=git&lesson=github), [pull requests](./?track=git&lesson=pull-requests-teamwork), [GitHub Pages](./?track=git&lesson=github-pages).

From now on, **every project lives on GitHub** with a clear README.

**Checkpoint:** your portfolio site is live on GitHub Pages and has at least 20 meaningful commits.

## Stage 5: A back-end language: PHP or Node.js (6–8 weeks)

Pick **one** first:

| | PHP | Node.js (JavaScript) |
|---|---|---|
| Why | Runs on almost every cheap Kenyan shared host (cPanel). Huge WordPress and Laravel market. | Same language as the front-end. Popular with start-ups and remote jobs. |
| Hosting | Any shared hosting | VPS or platforms such as Render or Railway |
| Lessons | [PHP introduction](./?track=php&lesson=introduction) → [forms and security](./?track=php&lesson=forms-security) → [sessions and login](./?track=php&lesson=sessions-login) → [OOP](./?track=php&lesson=oop-classes) → [file uploads](./?track=php&lesson=file-uploads) → [Composer and frameworks](./?track=php&lesson=composer-frameworks) | [How backends work](./?track=apis-backend&lesson=how-backends-work) → [Node and Express API](./?track=apis-backend&lesson=node-express-api) → [auth, passwords and tokens](./?track=apis-backend&lesson=auth-passwords-tokens) |

**Checkpoint:** you can build a login system that hashes passwords, uses sessions or tokens, and blocks pages for logged-out users.

## Stage 6: Databases and SQL (4 weeks)

Lessons:
- [What a database is](./?track=sql&lesson=what-is-a-database), [SELECT](./?track=sql&lesson=select), [WHERE and ORDER BY](./?track=sql&lesson=where-order), [GROUP BY](./?track=sql&lesson=functions-group)
- [JOINs](./?track=sql&lesson=joins), [changing data](./?track=sql&lesson=changing-data), [creating tables](./?track=sql&lesson=create-tables-constraints)
- [Keys and database design](./?track=sql&lesson=keys-design), [indexes and transactions](./?track=sql&lesson=indexes-transactions)
- Connecting from code: [MySQL with PDO](./?track=php&lesson=mysql-pdo) and the [CRUD app](./?track=php&lesson=crud-app)

Build: [Project: blog with an admin panel](./?track=projects&lesson=blog-cms) and [Project: inventory system](./?track=projects&lesson=inventory-system).

**Checkpoint:** you can design tables for a new idea (say, a clinic), with primary and foreign keys, and write the JOIN that answers "which patients saw which doctor this week".

## Stage 7: APIs and M-Pesa (3–4 weeks)

Lessons: [designing REST APIs](./?track=apis-backend&lesson=designing-rest-apis), [a PHP JSON API](./?track=apis-backend&lesson=php-json-api), [M-Pesa Daraja API](./?track=apis-backend&lesson=mpesa-daraja-api), [M-Pesa integration in PHP](./?track=php&lesson=mpesa-integration).

Build: [Project: REST API](./?track=projects&lesson=rest-api) and [Project: M-Pesa payment system](./?track=projects&lesson=mpesa-payment-system).

**Checkpoint:** a user can pay with STK push in the Daraja sandbox, your callback records the receipt, and the page updates when payment completes.

:::kenya Why M-Pesa matters
Being able to take M-Pesa payments is one of the most requested skills in Kenyan web projects: online shops, school fees, event tickets, bookings and SACCO contributions. A working M-Pesa project in your portfolio makes you stand out.
:::

## Stage 8: Deployment and hosting (2 weeks)

Lessons: [domains](./?track=hosting&lesson=domains), [hosting types](./?track=hosting&lesson=hosting-types), [DNS records](./?track=hosting&lesson=dns-records), [deploying on cPanel](./?track=hosting&lesson=cpanel-deploy), [SSL, email and backups](./?track=hosting&lesson=ssl-email-backups), [website speed](./?track=hosting&lesson=website-speed), [deploying Node and Python apps](./?track=hosting&lesson=deploy-node-python-apps), [PHP deployment](./?track=php&lesson=deploy-php-hosting). Security basics: [web security](./?track=cybersecurity&lesson=web-security).

**Checkpoint:** at least one database-backed project is live on a real domain with HTTPS.

## Stage 9: A framework and bigger projects (4–8 weeks)

Pick one direction:
- **Front-end**: [React](./?track=react&lesson=react-intro) → [state and events](./?track=react&lesson=react-state-events) → [effects and data](./?track=react&lesson=react-effects-data). Add [TypeScript](./?track=typescript&lesson=introduction).
- **Back-end**: Laravel (PHP) or Express (Node), see [Composer and frameworks](./?track=php&lesson=composer-frameworks).
- **WordPress** (big freelance market): [WordPress basics](./?track=hosting&lesson=wordpress-basics).

Build one **large** project: [e-commerce store](./?track=projects&lesson=ecommerce-store), [booking system](./?track=projects&lesson=booking-system), [school management system](./?track=projects&lesson=school-management-system) or [job board](./?track=projects&lesson=job-board).

## Stage 10: Portfolio, CV and getting work

- Follow [Show your projects: portfolio, GitHub and CV](./?track=projects&lesson=showcase-your-projects).
- Freelancing: [web design business](./?track=make-money-online&lesson=web-design-business), [profiles and proposals](./?track=make-money-online&lesson=profile-and-proposals), [pricing](./?track=make-money-online&lesson=pricing), [getting paid in Kenya](./?track=make-money-online&lesson=getting-paid-kenya).
- Jobs: apply to junior developer roles, internships and agencies. Many agencies hire juniors who can show a live project.

## Your portfolio by the end

| # | Project | Shows |
|---|---|---|
| 1 | Personal portfolio site | HTML, CSS, responsive design, deployment |
| 2 | Business website for a real or realistic client | Design, SEO, contact form |
| 3 | Blog or inventory system | PHP/Node, SQL, CRUD, login |
| 4 | M-Pesa payment project | APIs, callbacks, security |
| 5 | One large app (shop, booking, school system) | Planning, full-stack, real-world thinking |

## Common mistakes

- **Tutorial hell**: watching course after course without building. Build after every few lessons.
- **Learning five languages at once.** Finish JavaScript and one back-end language first.
- **Skipping SQL and security.** Real clients store real data; you are responsible for it.
- **No live links.** A recruiter will spend about 30 seconds. Give them a link that works on their phone.

## Summary

- 10 stages: HTML → CSS → JavaScript → Git → back-end → SQL → APIs and M-Pesa → deployment → framework → portfolio.
- Build a project at every stage; publish everything on GitHub with live links.
- Expect roughly 9–15 months at 1–3 hours a day to be job-ready; it depends on you.

```quiz
Q: Which language makes web pages interactive in the browser?
A: JavaScript | JS
Q: Which back-end language runs on almost every cheap cPanel host?
A: PHP
Q: What is the Safaricom API for M-Pesa payments called?
A: Daraja | Daraja API
Q: What is "tutorial hell"? Answer: watching tutorials without ___ (one word)
A: building | build | projects
Q: Which free GitHub feature can host your static portfolio site?
A: GitHub Pages | Pages
```
