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

## Who uses WordPress

WordPress powers a large share of the world's websites: business sites, blogs, school and church sites, news sites, NGO sites and online shops with WooCommerce. In Kenya, many web design agencies and freelancers build mainly with WordPress because clients can update content themselves without coding. Knowing how to install, secure, speed up and maintain WordPress is a directly marketable skill, including through monthly maintenance contracts.

## Planning a WordPress site

Before installing:

1. **Pages** (static content): Home, About, Services, Contact, Privacy Policy.
2. **Posts** (dated content): blog articles, news.
3. **Menus**: main navigation and footer links.
4. **Content**: real text and photos from the client (the biggest cause of delays).
5. **Features**: contact form, WhatsApp button, booking, shop, gallery, newsletter.

## Block editor (Gutenberg) essentials

| Block | Use |
|---|---|
| Paragraph, Heading, List | Text content (use headings in order: H2, H3) |
| Image, Gallery | Photos with alt text |
| Columns, Group | Layouts |
| Buttons | Calls to action ("Get a quote") |
| Cover | Hero sections with text over an image |
| Reusable/synced patterns | Content blocks used on many pages (e.g. a CTA banner) |

Block themes with **Full Site Editing** (Appearance → Editor) let you edit headers, footers and templates visually.

## Page builders vs the block editor

| Option | Pros | Cons |
|---|---|---|
| Block editor (built in) | Fast, no extra plugin, future-proof | Fewer design widgets than some builders |
| Elementor and similar builders | Drag-and-drop, many widgets, popular with designers | Heavier pages, plugin dependency, can be slower |

For speed and long-term maintainability, many developers now prefer block themes; for clients who want lots of visual control, builders remain popular.

## WooCommerce basics for Kenyan shops

1. Install WooCommerce; run the setup wizard (store address, currency KES, products type).
2. Add products: name, price, images, description, stock, categories.
3. Shipping: delivery zones (Nairobi CBD, Nairobi suburbs, upcountry) with flat rates or local pickup.
4. Payments: M-Pesa through a payment gateway plugin or provider integration, card payments, cash on delivery. Use reputable, maintained plugins and keep API credentials secret.
5. Test orders end to end before launch (place an order, pay a small amount, check emails).
6. Set up order notification emails and a returns policy page.

## Keeping WordPress secure: a routine

| Frequency | Task |
|---|---|
| Weekly | Update plugins, themes and core (after a backup); check for unknown admin users |
| Monthly | Test a backup restore; review security plugin logs; remove unused plugins/themes |
| Always | Strong unique passwords, 2FA for admins, limited login attempts |
| At setup | Change the default "admin" username; disable file editing in the dashboard; use HTTPS |

```php
// wp-config.php hardening examples
define('DISALLOW_FILE_EDIT', true);      // no theme/plugin editor in the dashboard
define('WP_AUTO_UPDATE_CORE', 'minor');  // automatic minor (security) updates
```

Install plugins only from wordpress.org or reputable vendors. **Nulled** (pirated premium) themes and plugins frequently contain backdoors.

## Speed for WordPress

- Choose a lightweight theme; avoid installing many plugins for small features.
- Use a caching plugin (or the host's built-in caching, such as LiteSpeed Cache on LiteSpeed servers).
- Compress and resize images (WebP); lazy-load below-the-fold images.
- Use a CDN (e.g. Cloudflare) for static files.
- Keep PHP updated to a supported version (cPanel → Select PHP Version / MultiPHP Manager).
- Clean the database occasionally (old revisions, spam comments, transients).

## SEO basics in WordPress

- Settings → Permalinks → **Post name**.
- An SEO plugin (Yoast, Rank Math or similar) for titles, meta descriptions, XML sitemaps and Open Graph tags.
- One focus topic per page; descriptive headings; internal links between related pages.
- Submit the sitemap to Google Search Console.
- Settings → Reading: make sure "Discourage search engines" is **unticked** after launch.

## Handing over to a client

1. Create the client an **Editor** account (or Shop Manager for WooCommerce) rather than Administrator, unless they need full control.
2. Record a short screen video showing how to edit pages, add posts and update products.
3. Provide written login details through a secure method, and encourage them to change passwords.
4. Offer a maintenance plan (updates, backups, security monitoring, small edits) for a monthly fee.
5. Document which theme, plugins and licences the site uses and when they renew.

## Practice

1. Install WordPress locally (LocalWP) or on hosting, and build a 5-page business site with the block editor.
2. Add a contact form, a WhatsApp button and a Google Map.
3. Install WooCommerce and add three products with images, prices and delivery zones.
4. Apply the security routine: 2FA, limited logins, removed unused plugins, `DISALLOW_FILE_EDIT`.
5. Test speed with PageSpeed Insights before and after enabling caching and image optimisation.

:::think A client's WordPress site was hacked twice this year. It has 38 plugins (12 inactive), a nulled premium theme and an admin user named "admin". What would you change?
Remove the nulled theme (replace with a legitimate one), delete inactive and unnecessary plugins, update everything, change the admin username and all passwords, add 2FA and login limiting, scan and clean the site (or rebuild from clean sources), set up off-site backups, and put the site on a monthly maintenance routine. Nulled software and outdated plugins are the most likely causes.
:::

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
Q: Which wp-config.php setting disables the theme and plugin editor in the dashboard?
A: DISALLOW_FILE_EDIT
Q: What are pirated premium WordPress themes and plugins often called?
A: nulled
Q: Which WordPress role lets a client edit content without changing settings or plugins?
A: Editor
```
