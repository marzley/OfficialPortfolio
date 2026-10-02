---
slug: how-the-web-works
title: "How the web works: browsers, servers, URLs, DNS, HTTP and hosting"
after: introduction
---
# How the web works: browsers, servers, URLs, DNS, HTTP and hosting

Before going deeper into HTML, it helps to understand the journey a web page takes from a computer somewhere in the world to the screen in your hand. Knowing this makes you a better developer: you'll understand why sites are slow, why links break, what "hosting" and "domain" mean when a client asks, and where HTML fits.

:::note What you will learn
- The difference between the internet and the web
- Clients and servers, and what a web browser really does
- URLs: every part of a web address explained
- IP addresses and DNS (the internet's phone book)
- HTTP and HTTPS requests, responses and status codes (200, 404, 500)
- Domains, hosting and how a website goes live in Kenya
- Static vs dynamic websites
:::

## The internet vs the web

People use the words interchangeably, but they're different:

| | The internet | The World Wide Web |
|---|---|---|
| What it is | The global **network** of connected computers and cables | A **service** that runs on the internet: linked pages viewed in browsers |
| Analogy | The roads | The matatus and the places they take you |
| Other services on it | Email, WhatsApp, video calls, online games, M-Pesa apps | (The web is one of many services) |

The internet physically connects through undersea fibre-optic cables. Kenya is connected through several cables landing at Mombasa (such as TEAMS, SEACOM, EASSy, LION2 and PEACE), then fibre runs inland to data centres, mobile masts and homes. When a cable is damaged at sea, internet in East Africa can slow down for days, which shows how physical the internet really is.

## Clients and servers

- A **client** is the device asking for something: your phone or laptop, using a **browser** (Chrome, Safari, Firefox, Edge, Opera Mini).
- A **server** is a computer that stores websites and sends pages when asked. It's usually in a data centre, running 24/7.

:::define Web server
A computer (and the software on it, like Apache, Nginx or LiteSpeed) that stores website files and delivers them to browsers when they request them.
:::

### What a browser does

1. Takes the address you type or the link you tap.
2. Finds the server and requests the page.
3. Reads the HTML, requests the CSS, JavaScript, images and fonts it mentions.
4. Builds the page (the **DOM**), applies styles, runs scripts and draws it.
5. Handles your clicks, typing and scrolling.

Different browsers use different **engines** (Chromium/Blink for Chrome, Edge, Opera and Brave; WebKit for Safari; Gecko for Firefox). That's why testing in more than one browser matters.

## URLs: the parts of a web address

```
https://shop.example.co.ke:443/products/laptops?brand=hp&page=2#reviews
└─┬─┘   └┬─┘ └─────┬────┘ └┬┘ └──────┬──────┘ └───────┬───────┘ └──┬──┘
scheme  sub   domain name  port    path          query string     fragment
```

| Part | Example | Meaning |
|---|---|---|
| **Scheme/protocol** | `https` | How to talk to the server (HTTPS = secure) |
| **Subdomain** | `shop` | A section of the domain (www, shop, mail, portal) |
| **Domain name** | `example.co.ke` | The site's name; `.co.ke` is the **top-level** part for Kenyan companies |
| **Port** | `443` | Usually hidden (443 for HTTPS, 80 for HTTP) |
| **Path** | `/products/laptops` | Which page or file on the server |
| **Query string** | `?brand=hp&page=2` | Extra data, `name=value` pairs joined with `&` (filters, searches) |
| **Fragment** | `#reviews` | A section within the page; never sent to the server |

### Kenyan domain endings

| Ending | For |
|---|---|
| `.co.ke` | Companies and businesses (most common) |
| `.or.ke` | Organisations, NGOs |
| `.ac.ke` | Universities and colleges |
| `.sc.ke` | Schools |
| `.go.ke` | Government |
| `.ke` | General (shorter, newer) |
| `.me.ke`, `.info.ke`, `.mobi.ke` | Personal and other uses |

These are managed by **KENIC** (Kenya Network Information Centre) and sold through accredited registrars. Global endings like `.com`, `.org` and `.africa` are also popular.

## IP addresses and DNS

Computers find each other using **IP addresses**, numbers like `142.250.185.78` (IPv4) or longer ones like `2a00:1450:4001::200e` (IPv6). Humans remember names better than numbers, so the **Domain Name System (DNS)** translates names into IP addresses.

:::define DNS
The internet's phone book: a worldwide system that converts domain names (`google.com`) into the IP addresses computers use to connect.
:::

The lookup, simplified:

1. You type `example.co.ke`.
2. Your device checks its memory (cache). If not found, it asks your internet provider's **DNS resolver** (Safaricom, Airtel, your Wi-Fi provider, or public ones like 1.1.1.1 / 8.8.8.8).
3. The resolver asks the **root servers**, then the `.ke` servers, then the domain's own **nameservers**, which hold its records.
4. The answer (an IP address) comes back and is cached for a while.
5. Your browser connects to that IP.

Common DNS records you'll meet when setting up sites:

| Record | Purpose |
|---|---|
| **A** | Domain → IPv4 address of the web server |
| **AAAA** | Domain → IPv6 address |
| **CNAME** | An alias pointing to another name (`www` → `example.co.ke`) |
| **MX** | Which server receives the domain's email |
| **TXT** | Text for verification (Google Search Console) and email security (SPF, DKIM) |
| **NS** | The nameservers responsible for the domain |

:::think You change your domain's nameservers to a new host, but some people still see the old site for hours. Why?
DNS answers are **cached** by resolvers and devices for a period set by each record (the TTL, time to live), so some resolvers keep the old answer until it expires. This "propagation" can take from minutes up to 24–48 hours. It isn't broken; it just takes time.
:::

## HTTP and HTTPS

**HTTP** (HyperText Transfer Protocol) is the language browsers and servers use. The browser sends a **request**; the server sends a **response**.

A request (simplified):

```
GET /products/laptops HTTP/1.1
Host: shop.example.co.ke
User-Agent: Chrome on Android
Accept: text/html
```

A response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 18240

<!DOCTYPE html><html>...
```

### Methods

| Method | Meaning |
|---|---|
| `GET` | Get a page or data |
| `POST` | Send data (forms, orders) |
| `PUT` / `PATCH` | Update data (APIs) |
| `DELETE` | Delete data (APIs) |

### Status codes you must know

| Code | Meaning | You'll see it when |
|---|---|---|
| **200** OK | Success | The page loaded |
| **301** Moved Permanently | Redirect | A page moved to a new address (important for SEO) |
| **302** Found | Temporary redirect | After logging in |
| **304** Not Modified | Use your cached copy | Revisiting a page |
| **400** Bad Request | The request was invalid | Broken form data |
| **401** Unauthorized | Login needed | Protected pages |
| **403** Forbidden | Not allowed | Wrong file permissions on a server |
| **404** Not Found | No such page | A broken link or typo |
| **429** Too Many Requests | Slow down | Too many attempts |
| **500** Internal Server Error | The server's code crashed | A PHP error |
| **503** Service Unavailable | Server overloaded or down | Maintenance, traffic spikes |

Groups: **2xx** success, **3xx** redirect, **4xx** client mistake, **5xx** server problem.

### HTTPS: the S means secure

**HTTPS** encrypts the connection with **TLS**, so people on the same Wi-Fi, your internet provider or attackers can't read or change what's sent (passwords, M-Pesa numbers, messages). The padlock in the address bar shows HTTPS. Browsers label plain HTTP pages "Not secure", and Google prefers HTTPS sites. Certificates are free with **Let's Encrypt** and cPanel's **AutoSSL**, so there's no excuse for HTTP today.

:::tip See it yourself
Open Chrome DevTools (F12) → **Network** tab, then reload any page. You'll see every request the page makes, its status code, size and time. Developers use this every day to find slow images and broken files.
:::

## Hosting and how a site goes live

To publish a website you need:

1. **A domain name** (e.g. `mybakery.co.ke`), rented yearly from a registrar. `.co.ke` domains typically cost around KSh 1,000–1,500 per year (prices vary by registrar).
2. **Hosting**: space on a server that's always online, rented monthly or yearly.
3. **Files**: your HTML, CSS, JavaScript and images, uploaded to the server (usually into a folder called `public_html`).
4. **DNS** pointing the domain to the hosting server.
5. **An SSL certificate** for HTTPS.

| Hosting type | What it is | Good for |
|---|---|---|
| **Shared hosting** (cPanel) | Many sites share one server | Small business sites, blogs; cheapest |
| **VPS** | Your own virtual server | Growing sites and custom apps; you manage it |
| **Cloud** (AWS, Google Cloud, Azure) | Pay for what you use, scale up | Large systems |
| **Static hosting** (GitHub Pages, Netlify, Cloudflare Pages) | Serves HTML/CSS/JS files only | Portfolios, landing pages; often free |
| **Website builders** (WordPress.com, Wix, Shopify) | Hosting + editor in one | Non-technical owners |

Kenyan hosting companies and international ones both serve Kenyan sites; servers closer to users (or a CDN) load faster.

### CDNs

A **Content Delivery Network** (like Cloudflare) keeps copies of your files in data centres around the world, including Nairobi and Mombasa, so visitors download from a nearby location. It also protects against attacks.

## Static vs dynamic websites

| | Static | Dynamic |
|---|---|---|
| How pages are made | The same HTML file is sent to everyone | The server **builds** HTML for each request using code and a database |
| Technologies | HTML, CSS, JavaScript | PHP, Node.js, Python + MySQL/PostgreSQL; WordPress |
| Examples | Portfolio, landing page | Online shop, school portal, M-Pesa-integrated system, blog with comments |
| Pros | Fast, cheap, secure | Logins, payments, content managers, personalisation |

Either way, **the browser always receives HTML**. That's why HTML is the foundation.

## The full journey, in one picture

```
You tap a link
   │
   ▼
Browser ── DNS lookup ──► "example.co.ke = 102.x.x.x"
   │
   ▼
Browser ── HTTPS request (GET /) ──► Web server (data centre)
                                         │ static: reads index.html
                                         │ dynamic: PHP + database build HTML
   ◄── HTTP response 200 + HTML ─────────┘
   │
   ├── requests CSS, JS, images, fonts (more requests)
   ▼
Browser builds the DOM, applies CSS, runs JS, paints the page
```

## Common misunderstandings

| Myth | Truth |
|---|---|
| "The domain is the website" | The domain is just the name; you also need hosting and files |
| "Buying a domain gives me email" | Email needs an email service (hosting email, Google Workspace, Zoho) and MX records |
| "HTTPS is only for shops" | Every site should use HTTPS |
| "My site is on my laptop, so it's online" | Files on your laptop are only visible to you until uploaded to a server |
| "404 means the server is down" | 404 means that page isn't there; the server answered fine |

## Practice tasks

1. Break this URL into its parts: `https://portal.school.ac.ke/results?year=2026&term=2#math`.
2. Open DevTools → Network on a news site. How many requests does it make? What's the largest file?
3. Find a page that gives a 404 on a big website (type a made-up path). What does their 404 page offer?
4. Explain to a friend in three sentences the difference between a domain and hosting.
5. List the DNS records you'd need for a site at `mybakery.co.ke` with email at `info@mybakery.co.ke`.

## Summary

- The internet is the network; the web is linked pages running on it.
- Browsers (clients) request pages from servers; the browser builds the page from HTML, CSS and JS.
- A URL has a scheme, (sub)domain, path, query string and fragment; `.co.ke`, `.ac.ke`, `.go.ke` etc. are managed by KENIC.
- DNS turns names into IP addresses; records include A, CNAME, MX and TXT.
- HTTP requests and responses carry pages; know status codes 200, 301, 404 and 500; always use HTTPS.
- Going live needs a domain, hosting, uploaded files, DNS and SSL. Static sites send the same files; dynamic sites build HTML on the server.

```quiz
Q: Is the web the same as the internet? (yes or no)
A: no
Q: What system converts domain names into IP addresses? Write the abbreviation.
A: DNS
Q: Which status code means "page not found"?
A: 404
Q: Which status code means success?
A: 200
Q: Which DNS record type tells the world which server receives a domain's email?
A: MX
Q: Which Kenyan domain ending is used by companies? Write it with dots.
A: .co.ke | co.ke
Q: In the URL ...?brand=hp, what is the part after the ? called? (two words)
A: query string | querystring
Q: Which organisation manages .ke domains?
A: KENIC
Q: What folder in cPanel hosting usually holds the website files?
A: public_html
```
