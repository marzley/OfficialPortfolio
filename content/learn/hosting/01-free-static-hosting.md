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
```
