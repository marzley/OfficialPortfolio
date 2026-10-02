---
slug: hosting-types
title: "Types of hosting: shared, VPS, cloud, dedicated, managed WordPress and static hosting compared, and how to choose"
after: KEEP
---
# Types of hosting: shared, VPS, cloud, dedicated, managed WordPress and static hosting compared, and how to choose

**Web hosting** is renting space on a computer (a **server**) that's always on and connected to the internet, so your website, email or app is available 24/7. Picking the right type matters: too little and the site is slow or crashes when customers arrive; too much and you pay for power you don't use or must manage complex servers. This unit explains each type of hosting, who it's for, what to look for in a provider, and how to estimate what you need, for everything from a church website to a busy online shop or SaaS app.

:::note What you will learn
- What a server is and what hosting includes
- Shared hosting (cPanel) and its limits
- VPS hosting: power and responsibility
- Cloud hosting (AWS, Azure, Google Cloud, DigitalOcean and others)
- Dedicated servers and colocation
- Managed WordPress hosting
- Static and serverless hosting (GitHub Pages, Netlify, Vercel, Cloudflare)
- Comparing features: storage, bandwidth, uptime, backups, location, support
- Local (Kenyan) vs international hosts
- Choosing the right option for different projects
:::

## What is a server, and what does hosting include?

A server is a computer optimised to run continuously in a **data centre** with backup power, cooling, fast internet links and physical security. Hosting packages bundle some of:
- Disk space for files and databases
- Bandwidth (data transferred to visitors)
- A web server (Apache, Nginx, LiteSpeed), PHP, databases (MySQL/MariaDB)
- Email accounts
- A control panel (cPanel, DirectAdmin, Plesk)
- SSL certificates, backups, security features
- Support

## Shared hosting

Many websites share one server's resources (CPU, memory, disk).

| Pros | Cons |
|---|---|
| Cheapest; affordable yearly plans | Resources limited and shared ("noisy neighbours") |
| Easy: cPanel, one-click WordPress, email included | Limited control (no root access, fixed software) |
| Host manages the server, updates and security | Can slow down under heavy traffic |
| Good support for beginners | Not suited to custom software or heavy apps |

**Best for**: business brochure sites, small WordPress sites, schools, churches, portfolios, small shops, and most freelance client sites.

Watch for "unlimited" plans: they still have fair-use limits on CPU, memory, inodes (number of files) and email sending.

## VPS (Virtual Private Server)

A physical server is split into virtual machines, each with **guaranteed** CPU, RAM and storage, and its own operating system.

| Pros | Cons |
|---|---|
| Dedicated resources, more predictable performance | You manage the server (updates, security, backups) unless you pay for managed |
| Full root access: install anything (Node.js, Python, Docker) | Needs Linux skills (see the Linux subject) |
| Scales up easily (more RAM/CPU) | Mistakes can take the site down or open security holes |

**Best for**: custom apps (Laravel, Django, Node.js), busier sites, multiple client sites managed by an agency, learning server administration. A **managed VPS** includes admin support at a higher price.

## Cloud hosting

Large providers (**AWS**, **Microsoft Azure**, **Google Cloud**) and developer-friendly clouds (DigitalOcean, Linode/Akamai, Vultr, Hetzner) offer virtual servers and many managed services: databases, storage, load balancers, container platforms, serverless functions.

| Pros | Cons |
|---|---|
| Scale up/down quickly; pay for what you use | Pricing can be complex; costs surprise beginners |
| Global data centres, including regions in Africa (e.g. South Africa) | Requires skills to configure securely |
| Managed services reduce maintenance | Data egress (download) charges on some clouds |
| High availability options (multiple servers/zones) | |

**Best for**: growing apps, SaaS products, high-traffic or mission-critical systems, companies with technical teams. Always set **billing alerts** when learning.

## Dedicated servers and colocation

- **Dedicated server**: a whole physical server rented to you. Maximum performance and control; expensive; you or the provider manage it.
- **Colocation**: you buy your own server and rent space, power and connectivity in a data centre (Nairobi has several data centres).

**Best for**: large organisations, heavy databases, strict compliance needs, or special hardware.

## Managed WordPress hosting

Hosting optimised only for WordPress: caching, staging sites, automatic updates, daily backups, malware scanning, expert support.

**Best for**: business-critical WordPress and WooCommerce sites where speed and reliability matter and you'd rather not manage the technical side.

## Static and serverless hosting

If a site is just HTML, CSS and JavaScript (or built by a static site generator), platforms like **GitHub Pages**, **Netlify**, **Vercel** and **Cloudflare Pages** host it free or cheaply on fast global networks, deploying automatically from Git. **Serverless functions** handle small dynamic tasks (forms, APIs). See the free static hosting lesson.

**Best for**: portfolios, landing pages, documentation, front-end apps (React/Vue) that call APIs.

## Comparison table

| Type | Cost | Control | Skill needed | Typical use |
|---|---|---|---|---|
| Static/serverless | Free–low | Medium | Low–medium | Portfolios, landing pages, front-end apps |
| Shared | Low | Low | Low | Small business sites, WordPress |
| Managed WordPress | Medium | Low–medium | Low | Important WordPress/WooCommerce sites |
| VPS | Medium | High | Medium–high | Custom apps, agencies |
| Cloud | Variable | Very high | High | Scalable apps, SaaS |
| Dedicated | High | Full | High | Large, heavy workloads |

## What to compare between providers

| Feature | Questions |
|---|---|
| **Resources** | Storage type (SSD/NVMe), CPU/RAM limits, inodes, databases |
| **PHP and software versions** | Current PHP versions available? Node.js/Python support if needed? |
| **Uptime** | Guarantee (e.g. 99.9%) and real reputation |
| **Backups** | Daily? How many days kept? Easy restore? Off-site? |
| **Security** | Free SSL, malware scanning, firewall, account isolation |
| **Email** | Number of accounts, storage, sending limits, spam filtering |
| **Server location** | Close to your visitors for speed (local or nearby data centres for Kenyan audiences); a CDN helps globally |
| **Support** | 24/7? WhatsApp/phone/ticket? Response quality? |
| **Payment and pricing** | M-Pesa? Renewal price vs first-year discount? Refund policy? |
| **Scalability** | Easy upgrade path? |

## Local vs international hosts

| Local Kenyan hosts | International hosts |
|---|---|
| Pay in KSh via M-Pesa; local support and time zone | Often more features, larger infrastructure |
| Easy .co.ke domain bundles | May have servers far away (higher latency) unless using a CDN |
| Some host in Kenyan data centres (low latency for local visitors) | Card payments in USD |

Either can be excellent; judge by reviews, support responsiveness, backups and performance tests.

## Estimating what you need

| Project | Suggested starting point |
|---|---|
| Church/school/NGO brochure site | Shared hosting or static hosting |
| Small business WordPress with blog | Shared hosting (good quality) |
| Online shop with 200 products, M-Pesa checkout | Quality shared/managed WordPress or small VPS |
| School management system for 2,000 students | VPS or cloud, with backups and monitoring |
| SaaS app for many businesses | Cloud with managed database, backups, scaling |
| Portfolio or landing page | Free static hosting |

Start modestly and upgrade when monitoring shows you need it; most providers make upgrading easy.

:::think A freelancer has 15 client WordPress sites on one cheap shared hosting account. One site gets hacked through an old plugin, and soon all 15 sites show spam redirects. What went wrong, and what better setup would you suggest?
All sites shared one account, so malware spread across them (no isolation), and plugins weren't maintained. Better: separate accounts/containers per client (reseller hosting or a VPS with isolated users), automatic updates and removal of unused plugins, a security plugin/WAF, and daily off-site backups per site, plus clients owning their own hosting where possible.
:::

## Summary

- Hosting rents always-on servers in data centres for websites, email and apps.
- Shared hosting is cheap and easy for small sites; VPS gives dedicated resources and root access; cloud scales flexibly; dedicated gives a whole machine.
- Managed WordPress hosting optimises important WordPress sites; static/serverless hosting suits HTML/JS sites free or cheaply.
- Compare resources, software versions, uptime, backups, security, email, location, support and renewal pricing.
- Match hosting to the project, start modestly, monitor and upgrade when needed.

```quiz
Q: Which hosting type shares one server's resources among many websites?
A: shared | shared hosting
Q: What does VPS stand for?
A: Virtual Private Server
Q: Which hosting type is best for a plain HTML portfolio at no cost?
A: static | static hosting | github pages | free static hosting
Q: What should you always set when learning on AWS, Azure or Google Cloud? (two words)
A: billing alerts | billing alert | budget alerts
Q: Which control panel is common on shared hosting?
A: cPanel | cpanel
```
