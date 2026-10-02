---
slug: github-pages
title: "Publish a website free with GitHub Pages: setup, custom domains, HTTPS and automatic deploys"
after: KEEP
---
# Publish a website free with GitHub Pages: setup, custom domains, HTTPS and automatic deploys

**GitHub Pages** turns a GitHub repository into a live website for free. Every time you push, the site updates. It's perfect for portfolios, project demos, documentation, event pages and small business brochure sites built with HTML, CSS and JavaScript. Many developers' first public website is on GitHub Pages, and employers love a live link next to your code.

:::note What you will learn
- What GitHub Pages can and can't host
- Publishing a site from a branch, step by step
- User/organisation sites vs project sites
- Using a custom domain (e.g. a .co.ke domain) with HTTPS
- Static site generators and GitHub Actions deploys
- Fixing common problems (404s, broken CSS, caching)
- Alternatives: Netlify, Vercel, Cloudflare Pages
:::

## What Pages can host

| Works | Doesn't work |
|---|---|
| HTML, CSS, JavaScript, images, fonts | PHP, Python, Node.js servers |
| Single-page apps (React, Vue) built to static files | Databases on the server |
| Static site generators (Jekyll, Hugo, Astro, Eleventy) | Server-side form processing |
| Calling external APIs from the browser | Storing secrets (everything is public) |

For forms, use a form service or a serverless function on another platform. For PHP/MySQL sites (like a portal with M-Pesa callbacks), use web hosting (see the hosting subject).

## Step 1: Prepare your repository

Your repository needs an `index.html` at the root (or in a `/docs` folder):

```
my-portfolio/
├── index.html
├── about.html
├── css/style.css
├── js/main.js
└── images/profile.jpg
```

Use **relative links** so they work on Pages: `href="css/style.css"`, not `href="/C:/Users/..."` or `href="/css/style.css"` (a leading slash breaks on project sites, explained below).

## Step 2: Turn on Pages

1. Push your site to GitHub.
2. Open the repository → **Settings** → **Pages**.
3. Under **Build and deployment**, Source: **Deploy from a branch**.
4. Branch: `main`, folder: `/ (root)` (or `/docs`), then **Save**.
5. Wait a minute or two. The page shows: "Your site is live at `https://username.github.io/my-portfolio/`".

The **Actions** tab shows the deployment progress; a green tick means it's live.

## User sites vs project sites

| Type | Repository name | URL |
|---|---|---|
| **User site** (one per account) | `username.github.io` | `https://username.github.io/` |
| **Project site** (unlimited) | Any name, e.g. `shop-demo` | `https://username.github.io/shop-demo/` |

Because project sites live in a sub-folder (`/shop-demo/`), a link like `/css/style.css` points to `username.github.io/css/style.css`, which doesn't exist. Use `css/style.css` (relative) instead.

## Updating the site

```bash
# edit files
git add .
git commit -m "Add projects section"
git push
```

The site rebuilds automatically within a minute or two. If you don't see changes, hard-refresh (`Ctrl+Shift+R`) because browsers cache files.

## Custom domain (e.g. yourname.co.ke)

1. Buy a domain from a registrar (for `.co.ke`, a KENIC-accredited registrar).
2. In **Settings → Pages → Custom domain**, enter `www.yourname.co.ke` and save. GitHub adds a `CNAME` file to your repo.
3. At your registrar's DNS settings:
   - For `www`: a **CNAME** record pointing to `username.github.io`.
   - For the bare domain (`yourname.co.ke`): **A** records pointing to GitHub's Pages IP addresses (listed in GitHub's documentation: currently 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153).
4. Wait for DNS to update (minutes to a few hours).
5. Tick **Enforce HTTPS** once it becomes available. GitHub provides a free certificate.

:::tip Verify your domain
GitHub recommends verifying your custom domain in your account settings to stop others from taking it over if your Pages site is ever removed.
:::

## Static site generators and Actions

Writing every page in HTML gets repetitive. **Static site generators** build pages from templates and Markdown:
- **Jekyll** is built into GitHub Pages.
- **Hugo, Astro, Eleventy, Next.js (static export), Vite builds** work through **GitHub Actions**: in Settings → Pages, choose Source: **GitHub Actions** and use the suggested workflow for your tool. Each push runs the build and publishes the output.

A simplified workflow for a site that needs `npm run build` (output in `dist/`):

```yaml
name: Deploy site
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

## Common problems

| Problem | Cause | Fix |
|---|---|---|
| 404 "There isn't a GitHub Pages site here" | Pages not enabled, wrong branch/folder, or no `index.html` | Check Settings → Pages and file names (`index.html`, lowercase) |
| Page loads but no styling | Wrong CSS path (leading `/` or wrong case) | Use relative paths; match letter case exactly (`Style.css` ≠ `style.css`) |
| Images missing | File name case or spaces | Use lowercase names without spaces |
| Old version showing | Browser cache or build still running | Hard refresh; check the Actions tab |
| Custom domain stops working | DNS records wrong or CNAME file deleted | Recheck DNS and the custom domain setting |

## Rules and limits

- Pages sites are **public** (even from private repos on paid plans the site itself is public).
- Don't use Pages to run an online shop handling payments or sensitive data; GitHub's terms say it's not for commercial transaction sites.
- There are soft limits on site size and bandwidth (check GitHub's documentation); fine for portfolios and small sites.

## Alternatives

| Platform | Strengths |
|---|---|
| **Netlify** | Drag-and-drop deploys, forms, redirects, previews |
| **Vercel** | Next.js and front-end frameworks, serverless functions |
| **Cloudflare Pages** | Fast global network, functions, generous free tier |

All of them deploy from GitHub on each push.

:::think Your project site at `username.github.io/portfolio/` shows text but no CSS. Your HTML has `<link rel="stylesheet" href="/css/style.css">`. What's wrong?
The leading slash makes the browser look at `username.github.io/css/style.css`, outside the `/portfolio/` folder. Change it to `href="css/style.css"` (relative). Also check the folder and file name case matches exactly.
:::

## Summary

- GitHub Pages hosts static sites (HTML/CSS/JS) free from a repository, updating on every push.
- Enable it in Settings → Pages: deploy from a branch (`main`, root or `/docs`) or with GitHub Actions.
- User sites use `username.github.io`; project sites live in a sub-folder, so use relative paths.
- Custom domains need CNAME/A records; enable Enforce HTTPS; verify your domain.
- Pages can't run PHP or databases; use hosting or Netlify/Vercel/Cloudflare functions for server features.

```quiz
Q: What file must exist at the root for the home page?
A: index.html
Q: What is the repository name for a user site of the account wanjiku-dev?
A: wanjiku-dev.github.io
Q: Can GitHub Pages run PHP? (yes/no)
A: no
Q: Which DNS record type points www to username.github.io?
A: CNAME
Q: Which keyboard shortcut does a hard refresh in most browsers?
A: Ctrl+Shift+R | ctrl shift r | ctrl+f5
```
