---
slug: design-basics
title: "Graphic design basics: what designers do, the elements and principles of design, file types, sizes and print vs screen"
after: KEEP
---
# Graphic design basics: what designers do, the elements and principles of design, file types, sizes and print vs screen

**Graphic design** is communicating ideas visually: a poster for a church fundraiser, a logo for a new salon, an Instagram post announcing a sale, a restaurant menu, a business card, packaging for honey jars, a school prospectus, an event banner. Every business needs designs, which is why graphic design is one of the most accessible ways to earn, locally (printing shops, SMEs, churches, schools, politicians, events) and online (Fiverr, Upwork, 99designs, social media clients).

You don't need expensive software to start: **Canva** (free) on a phone or laptop is enough to produce professional work once you understand the fundamentals in this unit.

:::note What you will learn
- What graphic designers do and the main types of design work
- Tools: Canva, Adobe Express, Photoshop, Illustrator, Photopea, GIMP, Inkscape, Affinity
- The elements of design: line, shape, colour, texture, space, form, typography
- The principles: hierarchy, contrast, alignment, balance, proximity, repetition, white space
- The design process from brief to delivery
- Raster vs vector, file formats (JPG, PNG, SVG, PDF)
- Sizes, resolution and DPI; print vs screen; CMYK vs RGB; bleed
- Copyright and using images legally
:::

## What graphic designers do

| Area | Examples |
|---|---|
| **Branding** | Logos, colour palettes, brand guidelines, business cards, letterheads |
| **Marketing** | Posters, flyers, brochures, banners, billboards |
| **Social media** | Posts, stories, carousels, YouTube thumbnails, ads |
| **Print** | Menus, calendars, certificates, wedding/funeral programmes, invitations |
| **Packaging and labels** | Product labels, boxes, stickers |
| **Digital/UI** | Website graphics, app screens (see the web design subject) |
| **Publishing** | Magazines, e-books, reports, school yearbooks |
| **Motion** | Animated posts, short video intros |

## Tools

| Tool | Best for | Cost |
|---|---|---|
| **Canva** | Fast templates, social media, posters; works on phones | Free / Pro |
| **Adobe Express** | Similar to Canva, Adobe ecosystem | Free / paid |
| **Adobe Photoshop** | Photo editing, manipulation, complex raster artwork | Subscription |
| **Adobe Illustrator** | Logos and vector illustration | Subscription |
| **Photopea** | Photoshop-like editor in the browser | Free (ads) |
| **GIMP** | Free photo editing | Free |
| **Inkscape** | Free vector design (logos) | Free |
| **Affinity Designer/Photo** | Professional, one-time purchase | Paid |
| **CorelDRAW** | Popular in Kenyan print shops | Paid |

Start with Canva and Photopea/Inkscape; move to Adobe or Affinity tools as you grow. Avoid cracked software: it's illegal and often contains malware.

## The elements of design

| Element | Meaning | Use |
|---|---|---|
| **Line** | Strokes and paths | Dividers, direction, underlines |
| **Shape** | Geometric (circles, squares) and organic forms | Buttons, frames, icons, backgrounds |
| **Colour** | Hue, value, saturation | Mood, brand, attention (see the colour lesson) |
| **Texture** | Visual feel (grain, paper, fabric) | Depth and character |
| **Space** | Empty areas around and between elements | Breathing room, focus |
| **Form** | 3D appearance | Shadows, product mock-ups |
| **Typography** | Fonts, sizes, spacing | Message and personality |

## The principles of design

| Principle | Meaning | Poster example |
|---|---|---|
| **Hierarchy** | Most important information stands out first | Event name biggest, then date/venue, then details |
| **Contrast** | Clear differences in size, colour, weight | Dark text on light background; yellow CTA on navy |
| **Alignment** | Elements line up to an invisible grid | Text aligned left consistently |
| **Balance** | Visual weight distributed (symmetrical or asymmetrical) | Image on one side balanced by text on the other |
| **Proximity** | Related items grouped | Date, time and venue together |
| **Repetition** | Repeated styles create unity | Same fonts and colours across a set of posts |
| **White space** | Empty space prevents clutter | Margins around text; not filling every gap |
| **Emphasis/focal point** | One thing grabs attention | A big product photo or price |

The most common beginner mistakes: too many fonts, too much text, no clear focal point, low contrast, and cramming every space.

## The design process

1. **Brief**: what's it for, who's the audience, what's the message, what's the call to action, sizes and deadline, brand colours/logo, budget.
2. **Research**: competitors, inspiration (Pinterest, Behance, Dribbble), audience preferences.
3. **Sketch/concepts**: quick ideas on paper or rough layouts.
4. **Design**: build the design with hierarchy and brand consistency.
5. **Review**: check spelling (names, dates, phone numbers!), contrast, alignment.
6. **Feedback and revisions**: agree on the number of revision rounds in advance.
7. **Deliver**: correct file formats and sizes for print or digital use.

A simple brief template:

```
Client: Grace Bakery, Nakuru
Project: Instagram post + A4 poster for a Christmas cake promo
Audience: families in Nakuru, 25–50
Key message: "Order Christmas cakes by 20 Dec – 15% off"
Must include: logo, WhatsApp 07xx..., photo of cake, prices
Style: warm, festive, brand colours (maroon + gold)
Sizes: 1080×1350 px (IG), A4 print (with 3 mm bleed)
Deadline: Friday 5 pm
```

## Raster vs vector

| | Raster (bitmap) | Vector |
|---|---|---|
| Made of | Pixels | Mathematical paths |
| Scaling | Gets blurry/pixelated when enlarged | Scales to any size perfectly |
| Best for | Photos, detailed artwork | Logos, icons, illustrations, signage |
| Formats | JPG, PNG, WebP, GIF, TIFF, PSD | SVG, AI, EPS, PDF (can contain vectors) |

**Logos should always be created as vectors** so they work on business cards and billboards alike.

## File formats

| Format | Use |
|---|---|
| **JPG** | Photos; small files; no transparency |
| **PNG** | Graphics with transparency (logos on websites), screenshots, sharp text |
| **SVG** | Vector logos and icons for the web |
| **PDF** | Print-ready files; documents; keeps vectors and fonts |
| **WebP** | Smaller web images |
| **MP4/GIF** | Animated/video content |

## Size, resolution and DPI

- Screens measure in **pixels**: an Instagram portrait post is 1080×1350 px.
- Print measures in physical size and **DPI** (dots per inch): print at **300 DPI** for sharp results. An A4 poster (210×297 mm) at 300 DPI needs about **2480×3508 px**.

```try-python
def pixels_for_print(width_mm, height_mm, dpi=300):
    inch = 25.4
    return round(width_mm / inch * dpi), round(height_mm / inch * dpi)

for name, w, h in [("Business card (85x55 mm)", 85, 55), ("A5 flyer", 148, 210), ("A4 poster", 210, 297), ("A3 poster", 297, 420)]:
    print(f"{name:26} needs about {pixels_for_print(w, h)} px at 300 DPI")
```

A low-resolution image (e.g. a 600 px WhatsApp photo) will look blurry when printed large; ask clients for original high-resolution photos.

## Print vs screen

| | Screen | Print |
|---|---|---|
| Colour mode | **RGB** (light: red, green, blue) | **CMYK** (ink: cyan, magenta, yellow, black) |
| Resolution | Pixel dimensions | 300 DPI at final size |
| Bleed | Not needed | **Bleed** (usually 3 mm) extends background past the trim line so there are no white edges |
| Safe zone | Keep text away from edges | Keep important text 3–5 mm inside the trim line |
| Delivery | PNG/JPG | High-quality PDF (Canva: "PDF Print" with crop marks and bleed) |

Bright RGB colours (neon greens, vivid blues) may print duller in CMYK. Ask the printer for their requirements and, for important jobs, a test print.

## Copyright and images

- Don't copy images from Google or other designers' work; it may be copyrighted.
- Use your own photos, client-provided images, or free licensed sources: Unsplash, Pexels, Pixabay (check licences), Canva's library within its licence terms.
- Fonts have licences too; Google Fonts are free for commercial use.
- Don't use famous brands' logos or celebrities' photos in ads without permission.

:::think A client sends a 400×300 px logo screenshot from WhatsApp and wants it on a 2-metre roll-up banner. What problems will occur and what should you do?
The raster screenshot will be extremely pixelated when enlarged. Ask for the original vector logo (SVG, AI, EPS or PDF); if none exists, recreate (vectorise) the logo in Illustrator/Inkscape (with permission, as a paid service), then design the banner at the printer's specification (CMYK, correct size and resolution, bleed) and export a print PDF.
:::

## Summary

- Graphic design communicates visually across branding, marketing, social media, print, packaging and digital work.
- Start with Canva and free tools (Photopea, GIMP, Inkscape); avoid cracked software.
- Use the elements (line, shape, colour, texture, space, form, type) and principles (hierarchy, contrast, alignment, balance, proximity, repetition, white space).
- Follow a process: brief, research, concepts, design, review, revisions, delivery.
- Know raster vs vector, file formats, pixels vs 300 DPI, RGB vs CMYK, bleed and safe zones, and respect copyright.

```quiz
Q: Which type of graphic scales without losing quality: raster or vector?
A: vector
Q: What resolution (DPI) is standard for print?
A: 300 | 300 dpi
Q: Which colour mode is used for printing?
A: CMYK
Q: What is the extra area beyond the trim line in print designs called?
A: bleed
Q: Which file format supports transparency and is common for web logos?
A: PNG | SVG
Q: Which free tool lets you design posters and social posts with templates?
A: Canva
```
