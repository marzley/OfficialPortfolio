---
slug: wordpress-basics
title: WordPress: install, themes, plugins and keeping it safe
after: cpanel-deploy
---
# WordPress: install, themes, plugins and keeping it safe

**WordPress** powers over 40% of all websites. It lets non-developers manage pages, blog posts and even online shops (with WooCommerce) from a dashboard. As a developer or freelancer in Kenya, many clients will ask for it, so it's worth knowing well.

## When WordPress is a good choice

| Good fit | Better with custom code |
|---|---|
| Business sites, blogs, news, NGOs, churches | Complex systems: school management, hospital, payroll |
| Clients who want to edit content themselves | Apps with heavy custom logic |
| Online shops (WooCommerce) | Maximum speed with minimal maintenance |

## Installing on cPanel hosting

1. In cPanel, open **Softaculous** (or "WordPress Manager").
2. Choose **Install**, pick your domain, protocol **https://**, and leave the directory empty to install at the root.
3. Set an **admin username** (not "admin") and a strong password; use your real email.
4. Click **Install**. Your dashboard is at `yourdomain.co.ke/wp-admin`.

(Manual install: download from wordpress.org, upload, create a MySQL database and user in cPanel, then open the site and follow the setup wizard.)

## The dashboard tour

| Menu | Use |
|---|---|
| **Posts** | Blog articles (dated, with categories and tags) |
| **Pages** | Fixed pages: Home, About, Services, Contact |
| **Media** | Images and files |
| **Appearance → Themes** | The site's design |
| **Appearance → Menus / Editor** | Navigation and site-wide layout |
| **Plugins** | Add features |
| **Users** | Accounts and roles |
| **Settings** | Site title, permalinks, reading options |

First things to set:

- **Settings → General**: site title and tagline, time zone (Nairobi).
- **Settings → Permalinks**: choose **Post name** (`/about-us/` instead of `/?p=123`) for SEO.
- **Settings → Reading**: choose a static page as the homepage for business sites.

## Themes

Pick a lightweight, well-maintained theme with good reviews and recent updates (e.g. GeneratePress, Astra, Kadence, or a default "Twenty" theme). Use the **block editor** (Gutenberg) to build pages. Avoid bloated themes that load dozens of scripts: they make sites slow on mobile data.

## Essential plugins (keep the list short)

| Need | Example plugins |
|---|---|
| SEO | Yoast SEO or Rank Math |
| Security | Wordfence |
| Backups | UpdraftPlus (send backups to Google Drive) |
| Caching/speed | LiteSpeed Cache (on LiteSpeed hosts) or WP Super Cache |
| Forms | Contact Form 7, WPForms Lite |
| Shop | WooCommerce, plus an M-Pesa payment plugin |
| Anti-spam | Akismet or Antispam Bee |

Every plugin is code from someone else that can have bugs or security holes. **Fewer plugins = faster and safer.** Delete ones you don't use.

## User roles

| Role | Can |
|---|---|
| Administrator | Everything |
| Editor | Publish and manage all posts/pages |
| Author | Publish their own posts |
| Contributor | Write, but not publish |
| Subscriber | Only manage their profile |

Give the client an **Editor** account for daily work if they don't need to install plugins.

## Keeping WordPress secure

Most hacked WordPress sites had **outdated plugins/themes** or **weak passwords**.

1. Update WordPress, themes and plugins regularly (enable auto-updates for minor versions).
2. Use strong, unique passwords and **2FA** for admins.
3. Limit login attempts (Wordfence does this).
4. Never install "nulled" (pirated) premium themes/plugins: they very often contain malware.
5. Daily backups stored off the server.
6. Remove unused themes and plugins.
7. Use HTTPS everywhere.

## Speed tips

- Compress images (WebP) before uploading.
- Use a caching plugin.
- Avoid page builders that add heavy code, or use them carefully.
- Test with PageSpeed Insights and our free website check.

```quiz
Q: What is the address of the WordPress dashboard? (the path after your domain)
A: /wp-admin | wp-admin
Q: Which permalink setting is best for SEO? (two words)
A: post name | postname
Q: Which plugin turns WordPress into an online shop?
A: WooCommerce
Q: What is the main cause of hacked WordPress sites? (two words)
A: outdated plugins | old plugins | weak passwords | outdated software
Q: Which role can publish and edit everyone's posts but not install plugins?
A: Editor
```
