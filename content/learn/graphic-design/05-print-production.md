---
slug: print-production
title: "Print design and production: banners, labels, packaging, branded merchandise and working with printers"
after: social-media-design
---
# Print design and production: banners, labels, packaging, branded merchandise and working with printers

Despite social media, print is still big business in Kenya: roll-up banners at events, shop signage, product labels for honey, juice and cosmetics, branded T-shirts and caps, calendars, school prospectuses, wedding and funeral programmes, election posters, menus and vehicle branding. Designing for print has its own rules: a beautiful design on screen can come out blurry, cut off or the wrong colour if it isn't prepared properly. This unit teaches print-ready design and how to work smoothly with printers, an area where many designers lose money through reprints.

:::note What you will learn
- Common print products and their sizes
- Print-ready files: size, bleed, safe zone, resolution, colour mode, fonts
- Paper types and finishes
- Large format: banners, roll-ups, billboards, vehicle branding
- Labels and packaging basics (including Kenyan labelling considerations)
- Branded merchandise: T-shirts, caps, mugs (printing methods)
- Proofs, approvals and avoiding costly mistakes
- Working with printers and pricing print jobs
:::

## Common print products and sizes

| Product | Typical size |
|---|---|
| Business card | 85×55 mm (common in Kenya/Europe) or 90×50 mm |
| A6 / A5 flyer | 105×148 mm / 148×210 mm |
| A4 / A3 poster | 210×297 mm / 297×420 mm |
| Roll-up banner | 85×200 cm (common), 100×200 cm, 120×200 cm |
| Tear-drop/feather flag | Varies by supplier |
| PVC banner | Custom (e.g. 3×1 m) |
| Funeral/wedding programme | A4 folded to A5 (booklet) |
| Calendar | A3 wall, A5 desk |
| Sticker/label | Custom to the container |

Always confirm sizes with the printer before designing: suppliers' templates differ.

## Print-ready file checklist

| ✓ | Item | Detail |
|---|---|---|
| | **Correct final size** | Design at the exact trim size (e.g. 85×55 mm) |
| | **Bleed** | Extend backgrounds and images 3 mm beyond the trim on all sides (large format may need more; ask) |
| | **Safe zone** | Keep text and logos 3–5 mm inside the trim line |
| | **Resolution** | Images at 300 DPI at final size (large banners viewed from a distance can be lower, e.g. 100–150 DPI; ask the printer) |
| | **Colour mode** | CMYK for print (or high-quality PDF the printer converts); check rich blacks and brand colours |
| | **Fonts** | Embedded in the PDF or converted to outlines |
| | **File format** | High-quality PDF (Canva "PDF Print" with crop marks and bleed; PDF/X from Adobe/Affinity) |
| | **Proofread** | Names, spellings, dates, phone numbers, prices, QR codes tested |

```try-python
def file_size_with_bleed(w_mm, h_mm, bleed_mm=3, dpi=300):
    w, h = w_mm + 2 * bleed_mm, h_mm + 2 * bleed_mm
    px = lambda mm: round(mm / 25.4 * dpi)
    return w, h, px(w), px(h)

for name, w, h in [("Business card", 85, 55), ("A5 flyer", 148, 210), ("A4 poster", 210, 297)]:
    W, H, pw, ph = file_size_with_bleed(w, h)
    print(f"{name:14} document {W}x{H} mm with bleed -> {pw}x{ph} px at 300 DPI")
```

## Paper and finishes

| Option | Use |
|---|---|
| **Paper weight** (gsm) | 80 gsm office paper; 130–170 gsm flyers/posters; 250–350 gsm business cards, covers |
| **Gloss vs matte** | Gloss: vivid photos; matte: elegant, easier to read, writable |
| **Lamination** | Durability (menus, cards); matte or gloss |
| **Spot UV, foil, embossing** | Premium business cards and packaging (extra cost, special file layers) |
| **Folding and binding** | Booklets (saddle stitch), reports (spiral, perfect binding) |

Ask the printer for samples so clients can feel the options.

## Large format

- **Roll-up banners**: keep the bottom 10–15 cm free of important content (it can hide in the stand); put the logo and main message at eye level (top half); use large text readable from 3+ metres.
- **PVC banners and billboards**: very short text (a billboard is read in seconds by people driving past); big logo, one message, contact.
- **Vehicle branding**: design on the vehicle template from the printer; avoid text over door handles and gaps; phone numbers large and readable.
- **Shop signage**: high contrast and readable from across the street; consider night lighting.

## Labels and packaging

- **Measure the container** (circumference, height) and get a dieline (cutting template) from the printer.
- Information hierarchy: brand, product name, key benefit, variant/size, then required details.
- Typical label content: product name, net quantity, ingredients, manufacturer's name and address, batch number, manufacturing and expiry dates, storage instructions, and certification marks where applicable.
- Food, cosmetics and many other goods in Kenya have labelling and standards requirements (for example from **KEBS**, the Kenya Bureau of Standards, and sector regulators). The **client** is responsible for regulatory compliance, but a good designer asks for their requirements and leaves space for marks, barcodes and batch details.
- **Barcodes** (from GS1 Kenya for retail) must be printed at the correct size with quiet space around them.
- Test print and stick a sample label on the real container before mass printing.

## Branded merchandise

| Method | Best for | Design notes |
|---|---|---|
| **Screen printing** | Bulk T-shirts, simple designs | Few solid colours (each colour is a separate screen) |
| **DTF/DTG/heat transfer** | Small runs, full colour | Check minimum line thickness |
| **Embroidery** | Caps, polo shirts, uniforms | Simplify logos; avoid tiny text and gradients |
| **Sublimation** | Mugs, polyester shirts, lanyards | Full colour on white/light surfaces |
| **Engraving** | Plaques, pens, awards | One-colour vector artwork |

Provide **vector** artwork and a one-colour version of logos for merchandise.

## Proofs and avoiding costly mistakes

1. Send the client a **PDF proof** and get written approval (WhatsApp/email "Approved") before printing.
2. For large or expensive runs, request a **physical proof** or test print.
3. Check colours on paper, not only on screen (screens are brighter; colours vary by printer and paper).
4. Double-check variable data: names on certificates, numbering, dates.
5. Keep final print files and approvals in a dated folder.

Common reprint causes: spelling mistakes in names, no bleed (white edges), low-resolution images, text too close to edges, wrong size, RGB colours printing dull.

## Working with printers and pricing

- Build relationships with 2–3 reliable printers (digital, offset and large format); ask for their **file specifications** and price lists.
- **Digital printing**: short runs, fast. **Offset printing**: cheaper per piece for large quantities (e.g. thousands of flyers).
- Quote clients either **design only** or **design + print**: if you manage printing, add a margin for your time and responsibility, and agree who pays for reprints caused by client errors after approval.
- Lead times: allow for proofs, printing, finishing and delivery, especially before elections, Christmas and graduation seasons when printers are busy.

:::think A client approved a funeral programme on WhatsApp, but after printing 300 copies, the family notices the deceased's name is misspelt in one place. Who pays, and how could this have been prevented?
If the client approved the proof in writing, the reprint cost is usually the client's responsibility (as per your agreed terms), though many designers share costs to keep goodwill. Prevention: a clear proofreading step with the family (ask them to check every name and date), highlighting key details in the proof message, written approval, and a test print for sensitive jobs.
:::

## Summary

- Know common print sizes and confirm them with the printer.
- Print-ready files need correct size, 3 mm bleed, safe zones, 300 DPI images, CMYK awareness, embedded fonts and a print PDF.
- Choose paper weight and finishes with the client; design large format for distance viewing.
- Labels need dielines, clear hierarchy and space for regulatory information (client's responsibility to comply), barcodes and batch details.
- Merchandise needs vector, simplified logos; always get written proof approval and work with reliable printers.

```quiz
Q: How much bleed is usually added to each side of a print design?
A: 3mm | 3 mm | 3
Q: What paper weight unit is used for print stock? (three letters)
A: gsm
Q: Which printing method is best for logos on caps and uniforms?
A: embroidery
Q: Which Kenyan body sets product standards? (abbreviation)
A: KEBS
Q: Which printing type is cheaper per piece for very large quantities: digital or offset?
A: offset
Q: What must you get from the client before printing? (two words)
A: written approval | approval | proof approval
```
