---
slug: free-static-hosting
title: Free hosting for static sites: GitHub Pages, Netlify, Cloudflare Pages
after: hosting-types
---
# Free hosting for static sites

If your site is only **HTML, CSS, JavaScript and images** (no PHP, no database), you can host it **free**, fast and with HTTPS, on global networks. Perfect for portfolios, landing pages, school projects and documentation.

## Static vs dynamic, one more time

| Static site | Dynamic site |
|---|---|
| The same files are sent to every visitor | Pages are built by code (PHP, Python...) on each request |
| No database, no server code | Needs a database and server language |
| Free hosting, extremely fast, very secure | Needs paid hosting (cPanel, VPS) |
| Portfolio, brochure site, landing page | Shop with M-Pesa, school portal, login systems |

> A static site can still have forms (via services like Formspree), a WhatsApp button and Google Maps.

## Option 1: GitHub Pages

Best if you already use Git.

1. Put your site in a GitHub repository, with `index.html` at the root.
2. Go to **Settings → Pages**.
3. Under *Source*, choose **Deploy from a branch**, pick `main` and `/ (root)`, and **Save**.
4. After a minute your site is live at `https://yourname.github.io/repo-name/`.
5. A repository named exactly `yourname.github.io` publishes at `https://yourname.github.io/`.

Every `git push` updates the site automatically.

## Option 2: Netlify

1. Sign up at netlify.com (with GitHub).
2. **Add new site → Deploy manually** and drag your site folder into the browser. Done: you get a `something.netlify.app` address.
3. Or connect a GitHub repo so every push deploys.

Extras: free forms (`<form data-netlify="true">`), redirects and preview links for every change.

## Option 3: Cloudflare Pages

Connect a Git repository or upload files. Uses Cloudflare's worldwide network (with locations in Africa, including Nairobi and Mombasa), so it's very fast for Kenyan visitors.

## Comparison

| | GitHub Pages | Netlify | Cloudflare Pages |
|---|---|---|---|
| Deploy by | git push | drag & drop or git | git or upload |
| Custom domain + free HTTPS | Yes | Yes | Yes |
| Built-in forms | No | Yes | No (use a service) |
| Best for | Developers, docs, portfolios | Beginners, quick demos | Speed, heavy traffic |

## Using your own domain (e.g. amina.co.ke)

1. Buy the domain from a registrar (any KENIC-accredited registrar for `.co.ke`).
2. In the hosting service, add the custom domain; it shows you DNS records.
3. At your registrar, add those records, typically:
   - a `CNAME` record for `www` pointing to `yourname.github.io` (or your Netlify/Cloudflare address), and
   - `A` records (or `ALIAS`) for the bare domain as instructed.
4. Wait for DNS to update (minutes to a few hours), then turn on **Enforce HTTPS**.

See the *DNS records* lesson for what A and CNAME mean.

## Before you publish: a checklist

- Every page has a `<title>`, description and viewport meta tag.
- Images are compressed (under ~200 KB each).
- Links are relative (`about.html`, not `C:\Users\...`). File names are lowercase, no spaces.
- A `404.html` page for broken links.
- Test on a phone.
- No secrets in your code: everything in a public repo is **public**.

## Who uses free static hosting

Students publish portfolios, developers host project demos, NGOs and churches run simple information sites, and small businesses launch landing pages, all without paying monthly hosting fees. Static hosts serve plain HTML, CSS, JavaScript and images extremely fast through global networks (CDNs), with free HTTPS. For many simple websites, they're faster, cheaper and more secure than traditional shared hosting.

## What "static" can still do

Static doesn't mean boring. A static site can include:

| Feature | How |
|---|---|
| Contact forms | Form services (Formspree, Netlify Forms) or a WhatsApp link |
| Online payments | Payment links or hosted checkout pages from payment providers |
| Blogs | Static site generators (Hugo, Eleventy, Astro, Jekyll) build HTML from Markdown |
| Search | Client-side search libraries |
| Comments and chat | Embedded third-party widgets |
| Dynamic data | JavaScript calling APIs, or serverless functions (Netlify/Cloudflare functions) |
| Analytics | Privacy-friendly analytics or Google Analytics |

When you need user logins, a database you manage, or server-side PHP, use shared hosting, a VPS or a platform service instead.

## Deploying with Git: automatic updates

The best workflow connects your GitHub repository to the host:

1. Push your site to GitHub.
2. In Netlify or Cloudflare Pages, choose "Import from Git" and select the repository.
3. Set the build command (empty for plain HTML; `npm run build` for Vite/React) and the output folder (`/`, `dist` or `build`).
4. Every `git push` to main deploys a new version automatically.
5. Pull requests get **preview URLs**, so you (or a client) can check changes before they go live.

## Custom domains step by step

1. Buy a domain from a registrar (for `.co.ke`, a KENIC-accredited registrar; for `.com`, any registrar).
2. In the host's dashboard, add the custom domain.
3. At your registrar's DNS settings, add the records the host tells you, typically:

| Record | Name | Value (example) |
|---|---|---|
| A | `@` (root domain) | The host's IP addresses |
| CNAME | `www` | `yourname.github.io` or `yoursite.netlify.app` |

4. Wait for DNS to update (minutes to a few hours, sometimes longer).
5. Turn on **Enforce HTTPS** once the certificate is issued.

Alternatively, point the domain's name servers to Cloudflare or Netlify DNS and manage records there.

## Redirects and custom 404 pages

```
# Netlify: _redirects file in the published folder
/old-services   /services   301
/blog/*         /articles/:splat   301
```

- A `404.html` page in the root is shown for missing pages on GitHub Pages, Netlify and Cloudflare Pages: make it helpful, with links home and to popular pages.
- Use 301 redirects when you rename pages, so old links and search rankings keep working.

## Headers for security and speed

Netlify and Cloudflare Pages support a `_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Long caching for versioned assets (files whose names change when the content changes) makes repeat visits very fast.

## Limits to know

Free plans have limits on bandwidth, build minutes, file sizes and commercial use, which change over time. GitHub Pages, for example, is intended for project and personal sites and has size and bandwidth guidelines. Read each host's current terms before using a free plan for a busy commercial site.

## Choosing the right hosting

| Need | Good choice |
|---|---|
| Portfolio, landing page, documentation | GitHub Pages, Netlify, Cloudflare Pages |
| WordPress site or PHP app with MySQL, email accounts | Shared cPanel hosting |
| Node.js/Python app, custom server software | VPS or a platform service |
| Large traffic static site | Cloudflare Pages / Netlify (CDN) |

## Practice

1. Publish a one-page site on GitHub Pages and on Netlify; compare the process.
2. Connect a repository to Netlify or Cloudflare Pages and confirm a `git push` redeploys the site.
3. Add a custom 404 page and a redirect from an old URL.
4. Add a contact form using a form service and test it.
5. Run PageSpeed Insights on the published site.

:::think A client wants a simple 5-page brochure website with a contact form, and they want to avoid monthly hosting costs. What would you propose?
A static site (HTML/CSS or a static site generator) hosted free on Netlify, Cloudflare Pages or GitHub Pages, with a form service or WhatsApp link for contact and a custom domain (the domain renewal is the main yearly cost). It loads fast, has free HTTPS and little to maintain. If they later need a blog with easy editing, a headless CMS or WordPress hosting can be added.
:::

```quiz
Q: Can a site that needs PHP and MySQL run on GitHub Pages? (yes or no)
A: no
Q: In GitHub, which settings section publishes a site?
A: Pages | Settings Pages
Q: What must your home page file be called?
A: index.html
Q: Which DNS record type usually points www to yourname.github.io?
A: CNAME
Q: Which free host lets you drag and drop a folder to deploy?
A: Netlify
Q: Which file defines redirects on Netlify?
A: _redirects
Q: Which HTTP status code is used for a permanent redirect?
A: 301
Q: What do pull requests get on Netlify and Cloudflare Pages so changes can be checked before going live? (two words)
A: preview URLs | deploy previews | preview links
```
