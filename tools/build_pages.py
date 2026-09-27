"""Build the inner pages (work.html, about.html, ...) from index.html.

Each page reuses sections of the homepage, so edit index.html and then run:

    python3 tools/build_pages.py

Google shows separate pages like these as sitelinks under the main result.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://marzleytechsolutions.co.ke/"

PAGES = [
    {
        "slug": "work",
        "label": "Work",
        "title": "Projects & Portfolio | Marzley Tech Solutions",
        "description": "Websites and systems built by Kelvin Wanyoike (Marzley): CBET Planner, hospital systems, college websites and e-commerce with M-Pesa and Paystack.",
        "sections": ["work", "testimonials"],
    },
    {
        "slug": "about",
        "label": "About",
        "title": "About Kelvin Wanyoike (Marzley) | Marzley Tech Solutions",
        "description": "Kelvin Wanyoike, known as Marzley, is a web developer, designer and IT trainer in Kenya and the founder of Marzley Tech Solutions.",
        "sections": ["about", "testimonials"],
    },
    {
        "slug": "services",
        "label": "Services",
        "title": "Web Development, M-Pesa Integration & IT Training | Marzley Tech Solutions",
        "description": "Websites, business and hospital systems, M-Pesa and Paystack payment integration, UI/UX design and practical IT training in Kenya.",
        "sections": ["services", "demo", "faq"],
    },
    {
        "slug": "process",
        "label": "Process",
        "title": "How We Work | Marzley Tech Solutions",
        "description": "Discuss, design, build, launch: how Marzley Tech Solutions delivers your website or system, plus a quick planner to find the right package.",
        "sections": ["process", "planner"],
    },
    {
        "slug": "pricing",
        "label": "Pricing",
        "title": "Website Packages & Prices in Kenya | Marzley Tech Solutions",
        "description": "Website packages from KSh 15,000: landing pages, small business, e-commerce and corporate sites, plus hosting, SEO and branding add-ons.",
        "sections": ["pricing", "faq"],
    },
    {
        "slug": "contact",
        "label": "Contact",
        "title": "Contact Marzley Tech Solutions | Hire a Web Developer in Kenya",
        "description": "Contact Marzley Tech Solutions on WhatsApp, phone or email. We offer our services 24 hours a day, 7 days a week.",
        "sections": ["contact", "faq"],
    },
]

# Where each homepage section lives when it is not on the current page
HOME_OF = {
    "work": "work", "testimonials": "work#testimonials", "about": "about",
    "services": "services", "demo": "services#demo", "process": "process",
    "planner": "process#planner", "pricing": "pricing", "faq": "contact#faq",
    "contact": "contact",
}


def attr(value):
    return value.replace("&", "&amp;").replace('"', "&quot;")


def sections_of(html):
    found = {}
    for m in re.finditer(r'( *<!-- [^>]*-->\n)?( *<section class="section" id="([a-z]+)".*?</section>\n)', html, re.S):
        found[m.group(3)] = (m.group(1) or "") + m.group(2)
    return found


def build(page, html, sections):
    url = SITE + page["slug"]
    title, desc = attr(page["title"]), attr(page["description"])

    def meta(pattern, value):
        nonlocal html
        html, n = re.subn(pattern, lambda m: m.group(1) + value + m.group(2), html, count=1)
        assert n == 1, pattern

    meta(r'(<title>)[^<]*(</title>)', title)
    meta(r'(<meta name="description" content=")[^"]*(")', desc)
    meta(r'(<link rel="canonical" href=")[^"]*(")', url)
    meta(r'(<meta property="og:title" content=")[^"]*(")', title)
    meta(r'(<meta property="og:description" content=")[^"]*(")', desc)
    meta(r'(<meta property="og:url" content=")[^"]*(")', url)
    meta(r'(<meta name="twitter:title" content=")[^"]*(")', title)
    meta(r'(<meta name="twitter:description" content=")[^"]*(")', desc)
    html = re.sub(r' *<link rel="preload" as="image"[^>]*>\n', "", html)

    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": url + "#webpage",
                "url": url,
                "name": page["title"],
                "description": page["description"],
                "isPartOf": {"@id": SITE + "#website"},
                "about": {"@id": SITE + "#business"},
                "inLanguage": "en-KE",
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE},
                    {"@type": "ListItem", "position": 2, "name": page["label"], "item": url},
                ],
            },
        ],
    }
    ld = json.dumps(graph, indent=4, ensure_ascii=False).replace("\n", "\n    ")
    html, n = re.subn(r'(<script type="application/ld\+json">\n).*?(\n *</script>)',
                      lambda m: m.group(1) + "    " + ld + m.group(2), html, count=1, flags=re.S)
    assert n == 1

    html = html.replace("<body>", '<body class="subpage">', 1)
    html = html.replace('<header class="site-header">', '<header class="site-header" id="top">', 1)
    html = html.replace('<a class="brand" href="#top" aria-label="Marzley Tech Solutions, back to top">',
                        '<a class="brand" href="./" aria-label="Marzley Tech Solutions home">', 1)
    html = html.replace('                <a href="%s">' % page["slug"],
                        '                <a href="%s" class="is-current" aria-current="page">' % page["slug"], 1)

    body = "".join(sections[s] for s in page["sections"])
    # The first section's heading is the page's only h1
    body = re.sub(r'<h2( id="[a-z]+-title">)(.*?)</h2>', r'<h1\1\2</h1>', body, count=1, flags=re.S)
    body = re.sub(r'(<p class="label">)\d+ — ', r'\1', body)
    html, n = re.subn(r'(<main id="main">\n).*?(    </main>)', lambda m: m.group(1) + body + m.group(2),
                      html, count=1, flags=re.S)
    assert n == 1

    on_page = set(page["sections"]) | {"main", "top"}
    html = re.sub(r'href="#([a-z]+)"',
                  lambda m: m.group(0) if m.group(1) in on_page or m.group(1) not in HOME_OF
                  else 'href="%s"' % HOME_OF[m.group(1)], html)
    return html


def main():
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    sections = sections_of(home)
    for page in PAGES:
        missing = [s for s in page["sections"] if s not in sections]
        assert not missing, missing
        out = build(page, home, sections)
        (ROOT / (page["slug"] + ".html")).write_text(out, encoding="utf-8", newline="")
        print("wrote", page["slug"] + ".html")


if __name__ == "__main__":
    main()
