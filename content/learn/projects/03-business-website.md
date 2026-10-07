---
slug: business-website
title: "Project 2: Business website for a local client (SEO, WhatsApp, Google Business)"
after: portfolio-website
---
# Project 2: Business website for a local client

Most Kenyan small businesses (salons, hardware shops, clinics, schools, restaurants, car hire, cleaning companies, churches) still don't have a good website. A fast, mobile-friendly site that appears on Google and sends enquiries straight to WhatsApp is one of the most practical things you can build, and often the first thing people get paid for.

In this project you build a complete multi-page site for a **real** business (a relative's shop, a local business that agrees to be your test client) or a **realistic made-up** one.

**You'll practise:** multi-page HTML and CSS, design, local SEO, Google Business Profile, WhatsApp click-to-chat, Google Maps, forms, speed, and hosting on a real domain.

**Lessons you need:** [the CSS business page project](./?track=css&lesson=project-business-page), [landing page anatomy](./?track=web-design&lesson=landing-page-anatomy), [colour](./?track=web-design&lesson=colour), [typography](./?track=web-design&lesson=typography), [SEO basics](./?track=marketing&lesson=seo-basics), [Google Business](./?track=marketing&lesson=google-business), [WhatsApp Business](./?track=marketing&lesson=whatsapp-business), [cPanel deployment](./?track=hosting&lesson=cpanel-deploy).

## Step 1: Interview the client

Even if the "client" is your aunt's shop, ask these questions and write down the answers. This is exactly what you'll do with paying clients later.

1. What does the business sell or do? What are the top 3 services or products?
2. Who are the customers? Where are they? How do they find you now?
3. What should a visitor **do** on the site? (Call? WhatsApp? Book? Visit the shop?)
4. Opening hours, location, phone, WhatsApp number, email, social media.
5. Prices (or price ranges) they're happy to show.
6. Photos: do they have good ones? If not, you'll take some with a phone in good daylight.
7. Competitors they admire or worry about.

Write a one-paragraph **brief** from the answers and get the client to agree to it. A clear brief prevents "can you also add…" problems later.

## Step 2: Plan pages and the main action

Typical small business site:

| Page | Purpose |
|---|---|
| Home | Who you are, what you offer, why choose you, a strong call to action |
| Services (or Products / Menu) | Each service with a short description and price or "from KSh…" |
| About | The story, the team, years in business (true facts only), photos |
| Gallery or Work | Before/after photos, finished jobs, the shop |
| Contact | Map, address, hours, phone, WhatsApp, a form |

The **main action** (usually "Chat on WhatsApp" or "Call now") should be visible on every page, especially on phones.

## Step 3: Design

- Pick 2–3 brand colours (use the logo if they have one) and 1–2 fonts ([colour](./?track=web-design&lesson=colour), [typography](./?track=web-design&lesson=typography)).
- Sketch the home page on paper: hero with a real photo and headline → services → reasons to choose them → testimonials (real ones only) → call to action → footer.
- Write headlines that say what the customer gets: "Reliable car hire in Eldoret, from KSh 3,500 a day" beats "Welcome to our website".

## Step 4: Build the pages

Reuse a header and footer on every page. A sticky WhatsApp button helps phone users:

```html
<a class="wa-float" href="https://wa.me/254712345678?text=Hello%2C%20I%20found%20you%20on%20your%20website" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
  WhatsApp us
</a>
```

```css
.wa-float {
  position: fixed; right: 16px; bottom: 16px; z-index: 50;
  background: #25d366; color: #fff; padding: .8rem 1.1rem; border-radius: 999px;
  font-weight: 600; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,.2);
}
```

A tap-to-call link: `<a href="tel:+254712345678">Call 0712 345 678</a>`.

Embed a map: on Google Maps, find the business → **Share** → **Embed a map** → copy the `<iframe>`, and add `loading="lazy"` and a `title` attribute.

A services list with prices in a table or cards ([tables](./?track=html&lesson=lists-tables), [Grid](./?track=css&lesson=grid)).

## Step 5: The contact form

On PHP hosting you can process the form yourself. A minimal, safe handler:

```php
<?php
// contact.php: sends the message to the business email
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
if (!empty($_POST['website'])) { exit('Thanks!'); }          // honeypot field: bots fill it, humans don't see it

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');
if ($name === '' || $message === '' || !preg_match('/^(\+?254|0)[17]\d{8}$/', $phone)) {
    http_response_code(422);
    exit('Please fill in your name, a valid Kenyan phone number and a message.');
}
$body = "Name: $name\nPhone: $phone\n\n$message";
mail('info@example.co.ke', 'Website enquiry from ' . $name, $body, 'From: website@example.co.ke');
header('Location: thanks.html');
```

The hidden `website` field is a **honeypot** to stop spam bots. Hide it with CSS (`position:absolute; left:-9999px`), not `type="hidden"`, so bots still see it. The phone check accepts `07…`, `01…`, `2547…` and `+2547…`. On many shared hosts, SMTP (for example with PHPMailer) delivers more reliably than `mail()`; ask the host.

## Step 6: Local SEO, so customers find it on Google

1. **Titles and descriptions** with the service and town: `<title>Car Hire in Eldoret | Rift Wheels</title>`.
2. **Headings** that match what people search: "Self-drive car hire in Eldoret", "Airport transfers".
3. **NAP consistency**: the business **N**ame, **A**ddress and **P**hone must be exactly the same on the website, Google Business Profile and social pages.
4. **Google Business Profile**: help the owner create or claim it, add photos, hours, services and the website link ([Google Business](./?track=marketing&lesson=google-business)). For local searches like "salon near me", this often matters more than the website itself.
5. **Structured data** helps Google understand the business:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Rift Wheels Car Hire",
  "telephone": "+254712345678",
  "address": { "@type": "PostalAddress", "streetAddress": "Uganda Road", "addressLocality": "Eldoret", "addressCountry": "KE" },
  "openingHours": "Mo-Sa 08:00-18:00",
  "url": "https://riftwheels.co.ke"
}
</script>
```

6. Submit the site in **Google Search Console** and add a `sitemap.xml`.

:::note About rankings
Nobody can honestly guarantee a #1 position on Google. Good content, a complete Google Business Profile, real reviews and a fast site improve the chances. Promise clients the work, not the ranking.
:::

## Step 7: Speed and mobile

Most visitors will be on phones with mobile data:
- Compress photos (WebP, under about 200 KB each for large images).
- Avoid heavy sliders and auto-playing videos.
- Test with Lighthouse and on a real mid-range Android phone.
- See [website speed](./?track=hosting&lesson=website-speed).

## Step 8: Domain, hosting and handover

- Register a domain (`.co.ke` for Kenyan businesses) **in the client's name** with their email, so they own it ([domains](./?track=hosting&lesson=domains)).
- Host it on shared hosting with SSL ([SSL, email and backups](./?track=hosting&lesson=ssl-email-backups)), and set up professional email (info@business.co.ke).
- Hand over: logins in a document, a short guide to changing prices or photos, and a renewal reminder date.
- Offer a **maintenance plan** ([website maintenance](./?track=hosting&lesson=website-maintenance)).

## Turning this into income

If the client is real and happy, ask for a short written testimonial and permission to show the site in your portfolio. Then use it to approach similar businesses. See [web design business](./?track=make-money-online&lesson=web-design-business) and [pricing](./?track=make-money-online&lesson=pricing). Always agree the scope, price, deposit and timeline in writing before starting paid work.

## Stretch goals

- A simple **price list the owner can edit** (a JSON file, or a small PHP admin page).
- **Kiswahili version** of key pages.
- Google Analytics or a privacy-friendly analytics tool, plus a monthly report for the owner ([measuring results](./?track=marketing&lesson=measure-results-analytics)).
- Online booking ([booking system project](./?track=projects&lesson=booking-system)) or M-Pesa payments ([M-Pesa project](./?track=projects&lesson=mpesa-payment-system)).

## Checklist

- WhatsApp and call buttons work on a phone
- Map, hours, address and phone are correct and match Google Business Profile
- Every page has a unique title and description that include the town and service
- Contact form validates input, blocks spam, and actually delivers email
- HTTPS works; images are compressed; Lighthouse 90+ on mobile
- Domain registered in the client's name

## Summary

- Interview the client, write a brief, plan pages around one main action.
- Build mobile-first with WhatsApp, call and map built in.
- Local SEO: town and service in titles, consistent NAP, Google Business Profile, structured data.
- Hand over properly and offer maintenance.

```quiz
Q: In local SEO, what does NAP stand for? (three words)
A: Name Address Phone | Name, Address, Phone | name address phone number
Q: What is the hidden form field that catches spam bots called?
A: honeypot | a honeypot
Q: Which Kenyan domain ending is common for businesses? Include the dot.
A: .co.ke | co.ke
Q: Whose name should the client's domain be registered in?
A: the client | client | client's | the client's | owner | the owner
```
