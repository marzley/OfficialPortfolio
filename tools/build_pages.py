"""Build the inner pages, the blog and sitemap.xml from index.html.

Each inner page reuses sections of the homepage. Blog posts are written as
simple files in content/blog/ (a comment with title, description, date and tag,
then the article HTML). After editing index.html or adding a post, run:

    python3 tools/build_pages.py

Google shows separate pages like these as sitelinks under the main result.
"""
import datetime
import html as htmllib
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "blog"
CASES_DIR = ROOT / "content" / "case-studies"
EXTRA_SECTIONS = ROOT / "content" / "sections.html"
KISWAHILI = ROOT / "content" / "kiswahili.html"
SITE = "https://marzleytechsolutions.co.ke/"

PAGES = [
    {
        "slug": "work",
        "label": "Work",
        "title": "Projects & Portfolio | Marzley Tech Solutions",
        "description": "Websites and systems built by Kelvin Wanyoike (Marzley): CBET Planner, hospital systems, college websites and e-commerce with M-Pesa and Paystack.",
        "sections": ["work", "cases", "testimonials"],
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
        "sections": ["services", "safe", "integrations", "demo", "faq"],
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
        "sections": ["pricing", "compare", "care", "deposit", "faq"],
    },
    {
        "slug": "contact",
        "label": "Contact",
        "title": "Contact Marzley Tech Solutions | Hire a Web Developer in Kenya",
        "description": "Contact Marzley Tech Solutions on WhatsApp, phone or email. We offer our services 24 hours a day, 7 days a week.",
        "sections": ["contact", "booking", "faq"],
    },
    {
        "slug": "website-check",
        "label": "Website check",
        "title": "Free Website Health Check: Speed, Security & SEO | Marzley Tech Solutions",
        "description": "Check your website for free: https security, speed, mobile setup and Google basics, with simple tips to fix each issue.",
        "sections": ["check", "care"],
    },
    {
        "slug": "referrals",
        "label": "Referrals",
        "title": "Referral Programme: Earn KSh 2,000 per Client | Marzley Tech Solutions",
        "description": "Refer a business, school or clinic to Marzley Tech Solutions and get KSh 2,000 by M-Pesa when they become a client.",
        "sections": ["referral", "testimonials"],
    },
    {
        "slug": "faq",
        "label": "FAQ",
        "title": "FAQ: Websites, M-Pesa, Systems & Training | Marzley Tech Solutions",
        "description": "Answers to common questions about website timelines, ownership, M-Pesa payments, custom systems, training certificates and support in Kenya.",
        "sections": ["faqs"],
        "faq_schema": True,
    },
    {
        "slug": "training",
        "label": "Training",
        "title": "IT Training & Mentorship in Kenya: Web Development, Programming, Design | Marzley Tech",
        "description": "Practical, project-based training in web development, programming and graphic design, in person and online. Over 200 students trained.",
        "sections": ["training", "testimonials"],
    },
]

# Where each homepage section lives when it is not on the current page
HOME_OF = {
    "work": "work", "redesign": "work#redesign", "testimonials": "work#testimonials", "about": "about",
    "services": "services", "demo": "services#demo", "process": "process",
    "planner": "process#planner", "pricing": "pricing", "faq": "contact#faq",
    "contact": "contact", "cases": "work#cases", "deposit": "pricing#deposit",
    "booking": "contact#booking", "training": "training", "compare": "pricing#compare", "care": "pricing#care", "safe": "services#safe", "integrations": "services#integrations", "check": "website-check", "referral": "referrals", "faqs": "faq",
}


def attr(value):
    return value.replace("&", "&amp;").replace('"', "&quot;")


def sections_of(html):
    found = {}
    for m in re.finditer(r'( *<!-- [^>]*-->\n)?( *<section class="section" id="([a-z]+)".*?</section>\n)', html, re.S):
        found[m.group(3)] = (m.group(1) or "") + m.group(2)
    return found


def make_page(html, slug, title, description, main_html, ld_nodes, current, on_page=()):
    """Turn a copy of the homepage into another page with its own meta, schema and main content."""
    url = SITE + slug
    title_a, desc_a = attr(title), attr(description)

    def meta(pattern, value):
        nonlocal html
        html, n = re.subn(pattern, lambda m: m.group(1) + value + m.group(2), html, count=1)
        assert n == 1, pattern

    meta(r'(<title>)[^<]*(</title>)', title_a)
    meta(r'(<meta name="description" content=")[^"]*(")', desc_a)
    meta(r'(<link rel="canonical" href=")[^"]*(")', url)
    meta(r'(<meta property="og:title" content=")[^"]*(")', title_a)
    meta(r'(<meta property="og:description" content=")[^"]*(")', desc_a)
    meta(r'(<meta property="og:url" content=")[^"]*(")', url)
    meta(r'(<meta name="twitter:title" content=")[^"]*(")', title_a)
    meta(r'(<meta name="twitter:description" content=")[^"]*(")', desc_a)
    html = re.sub(r' *<link rel="preload" as="image"[^>]*>\n', "", html)
    html = re.sub(r' *<link rel="alternate" hreflang="[^"]*"[^>]*>\n', "", html)

    graph = {"@context": "https://schema.org", "@graph": ld_nodes}
    ld = json.dumps(graph, indent=4, ensure_ascii=False).replace("\n", "\n    ")
    html, n = re.subn(r'(<script type="application/ld\+json">\n).*?(\n *</script>)',
                      lambda m: m.group(1) + "    " + ld + m.group(2), html, count=1, flags=re.S)
    assert n == 1

    html = html.replace("<body>", '<body class="subpage">', 1)
    html = html.replace('<header class="site-header">', '<header class="site-header" id="top">', 1)
    html = html.replace('<a class="brand" href="#top" aria-label="Marzley Tech Solutions, back to top">',
                        '<a class="brand" href="./" aria-label="Marzley Tech Solutions home">', 1)
    html = html.replace('<a href="./" class="is-current" aria-current="page">Home</a>', '<a href="./">Home</a>', 1)
    if current:
        html = html.replace('                <a href="%s">' % current,
                            '                <a href="%s" class="is-current" aria-current="page">' % current, 1)

    html, n = re.subn(r'(<main id="main">\n).*?(    </main>)', lambda m: m.group(1) + main_html + m.group(2),
                      html, count=1, flags=re.S)
    assert n == 1

    keep = set(on_page) | {"main", "top"}
    html = re.sub(r'href="#([a-z]+)"',
                  lambda m: m.group(0) if m.group(1) in keep or m.group(1) not in HOME_OF
                  else 'href="%s"' % HOME_OF[m.group(1)], html)
    return html


def web_page(slug, title, description):
    url = SITE + slug
    return {
        "@type": "WebPage",
        "@id": url + "#webpage",
        "url": url,
        "name": title,
        "description": description,
        "isPartOf": {"@id": SITE + "#website"},
        "about": {"@id": SITE + "#business"},
        "inLanguage": "en-KE",
    }


def breadcrumbs(*trail):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": SITE}]
    for i, (name, slug) in enumerate(trail, start=2):
        items.append({"@type": "ListItem", "position": i, "name": name, "item": SITE + slug})
    return {"@type": "BreadcrumbList", "itemListElement": items}


def build(page, html, sections):
    body = "".join(sections[s] for s in page["sections"])
    # The first section's heading is the page's only h1
    body = re.sub(r'<h2( id="[a-z]+-title">)(.*?)</h2>', r'<h1\1\2</h1>', body, count=1, flags=re.S)
    body = re.sub(r'(<p class="label">)\d+ — ', r'\1', body)
    nodes = [web_page(page["slug"], page["title"], page["description"]),
             breadcrumbs((page["label"], page["slug"]))]
    if page.get("faq_schema"):
        strip = lambda x: htmllib.unescape(re.sub(r"<[^>]+>", "", x)).strip()
        pairs = re.findall(r"<details data-faq>\s*<summary>(.*?)</summary>\s*<p>(.*?)</p>", body, re.S)
        nodes.append({"@type": "FAQPage", "@id": SITE + page["slug"] + "#faq",
                      "mainEntity": [{"@type": "Question", "name": strip(q),
                                      "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in pairs]})
    return make_page(html, page["slug"], page["title"], page["description"], body, nodes,
                     page["slug"], page["sections"])


# ---------- blog ----------

def read_posts(folder=POSTS_DIR):
    posts = []
    for path in sorted(folder.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        m = re.match(r"\s*<!--(.*?)-->\s*(.*)", text, re.S)
        assert m, "%s needs a header comment" % path.name
        info = dict(line.split(":", 1) for line in m.group(1).strip().splitlines() if ":" in line)
        info = {k.strip(): v.strip() for k, v in info.items()}
        for key in ("title", "description", "date"):
            assert info.get(key), "%s is missing %s" % (path.name, key)
        words = len(re.sub(r"<[^>]+>", " ", m.group(2)).split())
        posts.append({
            "slug": path.stem,
            "title": info["title"],
            "description": info["description"],
            "date": datetime.date.fromisoformat(info["date"]),
            "tag": info.get("tag", "Guide"),
            "minutes": max(1, math.ceil(words / 200)),
            "image": info.get("image"),
            "live": info.get("live"),
            "body": m.group(2).strip(),
        })
    posts.sort(key=lambda p: (p["date"], p["title"]), reverse=True)
    return posts


def keep_together(text):
    """Stop "M-Pesa" breaking across two lines in headings."""
    return text.replace("M-Pesa", '<span class="nobreak">M-Pesa</span>')


def nice_date(d):
    return "%d %s %d" % (d.day, d.strftime("%b"), d.year)


def post_card(post):
    e = htmllib.escape
    return (
        '                    <a class="post-card reveal" href="{slug}">\n'
        '                        <span class="label">{tag}</span>\n'
        '                        <h3>{title}</h3>\n'
        '                        <p>{desc}</p>\n'
        '                        <span class="post-card-meta"><time datetime="{iso}">{date}</time> · {mins} min read</span>\n'
        '                    </a>\n'
    ).format(slug=post["slug"], tag=e(post["tag"]), title=e(post["title"]), desc=e(post["description"]),
             iso=post["date"].isoformat(), date=nice_date(post["date"]), mins=post["minutes"]).replace(
        "<h3>%s</h3>" % e(post["title"]), "<h3>%s</h3>" % keep_together(e(post["title"])))


BLOG = {
    "slug": "blog",
    "label": "Blog",
    "title": "Blog: Web, M-Pesa & Tech Tips for Kenyan Businesses | Marzley Tech Solutions",
    "description": "Practical guides on website costs in Kenya, M-Pesa payment integration, CBET documentation and running your business online.",
}


def build_blog(html, posts):
    cards = "".join(post_card(p) for p in posts)
    body = (
        '        <section class="section" id="blog" aria-labelledby="blog-title">\n'
        '            <div class="wrap">\n'
        '                <div class="section-head reveal">\n'
        '                    <div>\n'
        '                        <p class="label">Blog</p>\n'
        '                        <h1 id="blog-title">Tips &amp; guides</h1>\n'
        '                    </div>\n'
        '                    <p>Practical, plain-language guides on websites, M-Pesa payments and technology for Kenyan businesses and institutions.</p>\n'
        '                </div>\n'
        '                <div class="post-grid">\n' + cards +
        '                </div>\n'
        '            </div>\n'
        '        </section>\n'
    )
    blog_node = {
        "@type": "Blog",
        "@id": SITE + "blog#blog",
        "url": SITE + "blog",
        "name": "Marzley Tech Solutions Blog",
        "publisher": {"@id": SITE + "#business"},
        "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": SITE + p["slug"]} for p in posts],
    }
    nodes = [web_page("blog", BLOG["title"], BLOG["description"]), blog_node, breadcrumbs(("Blog", "blog"))]
    return make_page(html, "blog", BLOG["title"], BLOG["description"], body, nodes, "blog", ["blog"])


def build_post(html, post, posts, kind="blog"):
    """A blog post, or a case study when kind is "case"."""
    e = htmllib.escape
    case = kind == "case"
    parent_name, parent_slug = ("Work", "work") if case else ("Blog", "blog")
    others = [p for p in posts if p["slug"] != post["slug"]][:3]
    more = ""
    if others:
        more = (
            '                <section class="post-more" aria-labelledby="more-title">\n'
            '                    <h2 id="more-title">%s</h2>\n' % ("More case studies" if case else "More from the blog") +
            '                    <div class="post-grid">\n' + "".join(post_card(p) for p in others) +
            '                    </div>\n'
            '                </section>\n'
        )
    hero = ""
    if post.get("image"):
        hero += ('                        <figure class="post-hero"><img src="%s" alt="%s" loading="eager" /></figure>\n'
                 % (e(post["image"]), e(post["title"].split(":")[0] + " screenshot")))
    if post.get("live"):
        hero += ('                        <p class="post-live"><a class="btn btn-solid" href="%s" target="_blank" rel="noopener noreferrer">'
                 'Visit the live site <span aria-hidden="true">↗</span></a></p>\n' % e(post["live"]))
    body = (
        '        <section class="section post-section" id="post" aria-labelledby="post-title">\n'
        '            <div class="wrap">\n'
        '                <nav class="crumbs" aria-label="Breadcrumb"><a href="./">Home</a><span aria-hidden="true">/</span>'
        '<a href="{parent_slug}">{parent_name}</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>\n'
        '                <article class="post">\n'
        '                    <header class="post-head">\n'
        '                        <p class="label">{tag}</p>\n'
        '                        <h1 id="post-title">{h1}</h1>\n'
        '                        <p class="post-meta"><img src="img/kelvin/headshot.jpg" alt="" width="36" height="36" loading="lazy" />'
        '<span>By <strong>Kelvin Wanyoike</strong> · <time datetime="{iso}">{date}</time> · {mins} min read</span></p>\n'
        '{hero}'
        '                    </header>\n'
        '                    <div class="post-body">\n{body}\n                    </div>\n'
        '                    <aside class="post-cta" aria-label="Work with Marzley Tech">\n'
        '                        <h2>Need help with your project?</h2>\n'
        '                        <p>Tell me what you need and get a clear quote. We’re available 24/7.</p>\n'
        '                        <div class="cta-row">\n'
        '                            <a class="btn btn-solid" href="contact">Start a project <span aria-hidden="true">→</span></a>\n'
        '                            <a class="btn btn-ghost" href="https://wa.me/254745789590?text={wa}" target="_blank" rel="noopener noreferrer">'
        '<i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>\n'
        '                        </div>\n'
        '                    </aside>\n'
        '                </article>\n'
        '{more}'
        '            </div>\n'
        '        </section>\n'
    ).format(title=e(post["title"]), tag=e(post["tag"]), iso=post["date"].isoformat(), date=nice_date(post["date"]),
             mins=post["minutes"], more=more, h1=keep_together(e(post["title"])),
             parent_slug=parent_slug, parent_name=parent_name, hero=hero,
             body=re.sub(r"<h2>(.*?)</h2>", lambda m: "<h2>%s</h2>" % keep_together(m.group(1)), post["body"]),
             wa="Hello%20Marzley%2C%20I%20read%20your%20article%20and%20I%27d%20like%20to%20discuss%20a%20project.")
    url = SITE + post["slug"]
    article = {
        "@type": "BlogPosting",
        "@id": url + "#article",
        "headline": post["title"],
        "description": post["description"],
        "datePublished": post["date"].isoformat(),
        "dateModified": post["date"].isoformat(),
        "author": {"@id": SITE + "#kelvin", "@type": "Person", "name": "Kelvin Wanyoike", "url": SITE + "about"},
        "publisher": {"@id": SITE + "#business"},
        "image": SITE + (post.get("image") or "img/brand/og-image.jpg"),
        "mainEntityOfPage": url,
        "inLanguage": "en-KE",
    }
    if case:
        article["@type"] = "Article"
        article["articleSection"] = "Case study"
    nodes = [web_page(post["slug"], post["title"], post["description"]), article,
             breadcrumbs((parent_name, parent_slug), (post["title"], post["slug"]))]
    page = make_page(html, post["slug"], post["title"] + " | Marzley Tech Solutions", post["description"],
                     body, nodes, parent_slug, ["post"])
    return page.replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />', 1)


# ---------- Kiswahili ----------

SW_NAV = [("Home", "Nyumbani"), ("Work", "Kazi"), ("About", "Kuhusu"), ("Services", "Huduma"),
          ("Process", "Mchakato"), ("Pricing", "Bei"), ("Blog", "Blogu"), ("Contact", "Wasiliana")]


def build_kiswahili(html):
    text = KISWAHILI.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->\s*(.*)", text, re.S)
    info = {k.strip(): v.strip() for k, v in (line.split(":", 1) for line in m.group(1).strip().splitlines() if ":" in line)}
    main_html = m.group(2).rstrip() + "\n"
    ids = re.findall(r'<section class="section[^"]*" id="([a-z]+)"', main_html)
    nodes = [dict(web_page("kiswahili", info["title"], info["description"]), inLanguage="sw-KE"),
             breadcrumbs(("Kiswahili", "kiswahili"))]
    page = make_page(html, "kiswahili", info["title"], info["description"], main_html, nodes, None, ids)
    page = page.replace('<html lang="en"', '<html lang="sw"', 1)
    page = page.replace('<meta property="og:locale" content="en_KE" />', '<meta property="og:locale" content="sw_KE" />', 1)
    page = page.replace('    <link rel="canonical" href="%skiswahili" />\n' % SITE,
                        '    <link rel="canonical" href="%skiswahili" />\n'
                        '    <link rel="alternate" hreflang="en" href="%s" />\n'
                        '    <link rel="alternate" hreflang="sw" href="%skiswahili" />\n'
                        '    <link rel="alternate" hreflang="x-default" href="%s" />\n' % (SITE, SITE, SITE, SITE), 1)
    nav_start = page.index('<nav class="nav" id="site-nav"')
    nav_end = page.index("</nav>", nav_start)
    nav = page[nav_start:nav_end]
    for en, sw in SW_NAV:
        nav = nav.replace(">%s</a>" % en, ">%s</a>" % sw, 1)
    nav = nav.replace('aria-label="Main"', 'aria-label="Menyu kuu"', 1)
    page = page[:nav_start] + nav + page[nav_end:]
    page = page.replace(">Skip to content</a>", ">Ruka hadi maudhui</a>", 1)
    page = page.replace('<span class="dot"></span>Available for hire</a>', '<span class="dot"></span>Tunapatikana</a>', 1)
    page = page.replace('<span class="dot" aria-hidden="true"></span>Available for hire</a>',
                        '<span class="dot" aria-hidden="true"></span>Tunapatikana</a>', 1)
    page = page.replace('<button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">Menu</button>',
                        '<button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">Menyu</button>', 1)
    return page


# ---------- sitemap ----------

def write_sitemap(posts, cases=()):
    today = datetime.date.today().isoformat()
    urls = [
        ("", "weekly", "1.0", ["img/brand/og-image.jpg", "img/kelvin/office.jpg", "img/kelvin/office-square.jpg"]),
        ("work", "weekly", "0.9", []), ("services", "monthly", "0.9", []), ("pricing", "monthly", "0.9", []),
        ("about", "monthly", "0.8", []), ("contact", "monthly", "0.8", []), ("process", "monthly", "0.7", []),
        ("training", "monthly", "0.8", []), ("website-check", "monthly", "0.8", []), ("faq", "monthly", "0.7", []), ("referrals", "monthly", "0.6", []), ("blog", "weekly", "0.8", []), ("kiswahili", "monthly", "0.7", []),
    ] + [(p["slug"], "monthly", "0.8", []) for p in cases] + [(p["slug"], "monthly", "0.7", []) for p in posts]
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
    for slug, freq, prio, images in urls:
        out.append("  <url>")
        out.append("    <loc>%s%s</loc>" % (SITE, slug))
        out.append("    <lastmod>%s</lastmod>" % today)
        out.append("    <changefreq>%s</changefreq>" % freq)
        out.append("    <priority>%s</priority>" % prio)
        for img in images:
            out.append("    <image:image>")
            out.append("      <image:loc>%s%s</image:loc>" % (SITE, img))
            out.append("    </image:image>")
        out.append("  </url>")
    out.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(out) + "\n", encoding="utf-8", newline="")


def write(name, text):
    (ROOT / name).write_text(text, encoding="utf-8", newline="")
    print("wrote", name)


def main():
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    sections = sections_of(home)
    sections.update(sections_of(EXTRA_SECTIONS.read_text(encoding="utf-8")))
    for page in PAGES:
        missing = [s for s in page["sections"] if s not in sections]
        assert not missing, missing
        write(page["slug"] + ".html", build(page, home, sections))
    posts = read_posts()
    write("blog.html", build_blog(home, posts))
    for post in posts:
        write(post["slug"] + ".html", build_post(home, post, posts))
    cases = read_posts(CASES_DIR)
    for case in cases:
        write(case["slug"] + ".html", build_post(home, case, cases, kind="case"))
    write("kiswahili.html", build_kiswahili(home))
    write_sitemap(posts, cases)
    print("wrote sitemap.xml")


if __name__ == "__main__":
    main()
