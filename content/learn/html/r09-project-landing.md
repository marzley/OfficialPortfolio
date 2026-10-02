---
slug: project-landing-page
title: "Project: build a complete business landing page, step by step"
after: KEEP
---
# Project: build a complete business landing page, step by step

Time to put everything together. In this project you'll build a complete one-page website for a small Kenyan business, the way a professional would: plan first, write the structure, add content section by section, check quality, and prepare it to go live. This is the kind of page clients pay KSh 10,000–25,000 for, so treat it as the first item in your portfolio.

:::note What you will practise
- Planning a page: goals, audience, content and outline
- Semantic structure: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Headings, paragraphs, lists, links, images, a table and a form
- Head tags for SEO and sharing
- A quality checklist (validation, accessibility, phone test)
:::

## Step 1: Understand the client

Every real project starts with questions, not code. Our client: **Mama Njeri Salon**, Kahawa West, Nairobi.

| Question | Answer |
|---|---|
| What is the goal of the site? | Get more bookings via WhatsApp and calls |
| Who are the customers? | Women aged 18–45 nearby, mostly on phones |
| What do they need to know? | Services, prices, location, opening hours, how to book |
| What makes the salon special? | Experienced braiders, clean salon, fair prices, open Sundays |
| Contacts | WhatsApp/phone 0700 000 000, near Kahawa West stage |

:::tip The one-sentence goal
Write the goal in one sentence and check every section against it: *"Help nearby women see our services and prices quickly and book on WhatsApp."* If a section doesn't help that, cut it.
:::

## Step 2: Plan the outline

```
<head>      title, description, Open Graph
<header>    salon name + nav (Services · Prices · Reviews · Contact)
<main>
  h1 hero:  "Braids, weaves and nails in Kahawa West" + Book on WhatsApp button
  section:  Services (3–4 article cards)
  section:  Prices (table)
  section:  Why choose us (list)
  section:  Reviews (blockquotes)
  section:  Book / contact (form + call/WhatsApp links + map link)
<footer>    address, hours, copyright
```

## Step 3: The skeleton and head

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Braids, Weaves &amp; Nails in Kahawa West | Mama Njeri Salon</title>
  <meta name="description" content="Professional braids, weaves and nails in Kahawa West, Nairobi. Fair prices, open Sundays. Book on WhatsApp 0700 000 000.">
  <meta property="og:title" content="Mama Njeri Salon, Kahawa West">
  <meta property="og:description" content="Braids, weaves and nails. Book on WhatsApp.">
  <meta property="og:image" content="https://example.co.ke/share.jpg">
</head>
<body>
  ...
</body>
</html>
```

Note `&amp;`: the `&` character is written as `&amp;` in HTML text so it isn't confused with an entity.

## Step 4: Build the page

Build it in the editor below, section by section. Read the comments, run it, then customise.

```try-html
<header>
  <p><strong>Mama Njeri Salon</strong> · Kahawa West</p>
  <nav aria-label="Main">
    <a href="#services">Services</a> ·
    <a href="#prices">Prices</a> ·
    <a href="#reviews">Reviews</a> ·
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <!-- Hero: the first screen. Say what, where, and the main action. -->
  <section>
    <h1>Braids, weaves and nails in Kahawa West</h1>
    <p>Experienced stylists, a clean salon and fair prices. Open every day, including Sundays.</p>
    <p><a href="https://wa.me/254700000000?text=Hello%20Mama%20Njeri%2C%20I%20would%20like%20to%20book">Book on WhatsApp</a> or call <a href="tel:+254700000000">0700 000 000</a></p>
    <img src="https://picsum.photos/360/200" alt="Stylist braiding a customer's hair in the salon" width="360" height="200">
  </section>

  <!-- Services: each card is self-contained, so article fits -->
  <section id="services">
    <h2>Our services</h2>
    <article>
      <h3>Braids</h3>
      <p>Knotless, box braids, cornrows and twists. Hair can be provided.</p>
    </article>
    <article>
      <h3>Weaves and wigs</h3>
      <p>Sew-in weaves, wig installation and styling.</p>
    </article>
    <article>
      <h3>Nails</h3>
      <p>Gel polish, acrylics, manicure and pedicure.</p>
    </article>
  </section>

  <!-- Prices: tabular data, so a real table -->
  <section id="prices">
    <h2>Prices</h2>
    <table border="1" cellpadding="6">
      <caption>Prices from (KSh), hair not included</caption>
      <thead><tr><th scope="col">Service</th><th scope="col">Price from</th><th scope="col">Time</th></tr></thead>
      <tbody>
        <tr><th scope="row">Knotless braids (medium)</th><td>2,500</td><td>4–5 hours</td></tr>
        <tr><th scope="row">Cornrows</th><td>600</td><td>1 hour</td></tr>
        <tr><th scope="row">Weave installation</th><td>1,000</td><td>2 hours</td></tr>
        <tr><th scope="row">Gel polish</th><td>800</td><td>45 minutes</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>Why customers choose us</h2>
    <ul>
      <li>8+ years of experience</li>
      <li>Clean tools for every client</li>
      <li>Open Sundays 10am–6pm</li>
      <li>Pay with M-Pesa (Till 000000)</li>
    </ul>
  </section>

  <section id="reviews">
    <h2>What customers say</h2>
    <blockquote><p>"My knotless braids lasted six weeks and looked neat the whole time."</p><p>— Wairimu, Kahawa Sukari</p></blockquote>
    <blockquote><p>"Friendly, on time and fair prices."</p><p>— Faith, Githurai</p></blockquote>
  </section>

  <section id="contact">
    <h2>Book an appointment</h2>
    <form action="/book.php" method="post">
      <p><label for="n">Your name</label><br><input id="n" name="name" autocomplete="name" required></p>
      <p><label for="p">Phone number</label><br><input id="p" name="phone" type="tel" autocomplete="tel" placeholder="e.g. 0712 345 678" required></p>
      <p><label for="s">Service</label><br>
        <select id="s" name="service"><option>Braids</option><option>Weave</option><option>Nails</option></select></p>
      <p><label for="d">Preferred date</label><br><input id="d" name="date" type="date"></p>
      <button type="submit">Request booking</button>
    </form>
    <p><a href="https://maps.google.com/?q=Kahawa+West+Nairobi" target="_blank" rel="noopener noreferrer">Get directions on Google Maps (opens in a new tab)</a></p>
  </section>
</main>

<footer>
  <address>Mama Njeri Salon, next to Kahawa West stage, Nairobi · <a href="tel:+254700000000">0700 000 000</a></address>
  <p>Open Monday–Saturday 8am–8pm, Sunday 10am–6pm</p>
  <p><small>© 2026 Mama Njeri Salon</small></p>
</footer>
```

## Step 5: Quality checklist

Go through every item before calling the page finished.

**Structure**
- [ ] One `<h1>`; headings in order
- [ ] `<header>`, `<nav>`, `<main>`, `<section>`s with headings, `<footer>`
- [ ] Nav links jump to the right sections (ids match)

**Content**
- [ ] Phone, WhatsApp and location visible in the first screen and footer
- [ ] Prices clear, with currency
- [ ] No spelling mistakes (read it aloud)

**Links and images**
- [ ] `tel:` and WhatsApp links use `+254`/`254` format and work on a phone
- [ ] Every image has good `alt` text, `width` and `height`
- [ ] Images compressed (under about 200 KB each)

**Forms**
- [ ] Every field has a label; correct input types; `required` where needed
- [ ] Button text describes the action

**SEO and sharing**
- [ ] Unique title and description
- [ ] Open Graph tags; test by sending the link on WhatsApp once live

**Testing**
- [ ] W3C validator: no errors
- [ ] Keyboard only: can reach every link and field
- [ ] Opened on a real phone

## Step 6: Making it real

Right now the page is plain HTML. Next steps:

1. **Style it with CSS** (the CSS subject): colours, fonts, spacing, mobile layout and a big "Book on WhatsApp" button.
2. **Make the form work** with a server script (PHP) or a form service, so bookings arrive by email.
3. **Get a domain and hosting** (the hosting subject): e.g. `mamanjerisalon.co.ke`, upload the files to `public_html` in cPanel, turn on free SSL (HTTPS).
4. **Create a Google Business Profile** so the salon appears on Google Maps.
5. **Submit the site** in Google Search Console.

:::career Turning this into income
Build two or three landing pages like this for real or imaginary businesses (a salon, a restaurant, a hardware shop), put them online free with GitHub Pages or Netlify, and show them to local businesses. Many small businesses in Kenya still have no website, only a Facebook page or WhatsApp number. A clear, fast landing page with WhatsApp booking is an easy offer to explain.
:::

## Extension challenges

1. Add an FAQ section with `<details>` ("Do you provide hair?", "Do I need to book?").
2. Add a gallery section with `<figure>`/`<figcaption>` for four hairstyles.
3. Add LocalBusiness JSON-LD in the `<head>`.
4. Make a Kiswahili version of the page (`lang="sw"`) and link between them.
5. Rebuild the whole page for a different business in your area, from the client questions onwards.

## Summary

- Real projects start with the client's goal, audience and content, then an outline.
- A landing page needs: a clear hero with the main action, services, prices, trust (reviews, reasons), contact/booking and a footer with contacts.
- Use semantic elements, correct links (`tel:`, WhatsApp), accessible images and forms, and SEO head tags.
- Check quality with a checklist, the validator, the keyboard and a real phone, then style, connect the form and publish.

```quiz
Q: What should you write first, before any code, in a real project? (two words: the client's ...)
A: goal | the goal | client goal | client's goal
Q: How is the & character written in HTML text?
A: &amp; | &amp
Q: Which element should the services cards use, since each is self-contained?
A: article | <article>
Q: What prices content needs rows and columns: which element?
A: table | <table>
Q: What country code goes in a Kenyan WhatsApp link (wa.me/...)?
A: 254 | +254
Q: Which free W3C tool checks your HTML for errors? (one word)
A: validator | W3C validator
Q: Which free Google listing helps a salon appear on Google Maps?
A: Google Business Profile | Business Profile | GBP
```
