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
import os
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
        "sections": ["about", "learnhub", "testimonials"],
    },
    {
        "slug": "services",
        "label": "Services",
        "title": "Web Development, M-Pesa Integration & IT Training | Marzley Tech Solutions",
        "description": "Websites, business and hospital systems, M-Pesa and Paystack payment integration, UI/UX design and practical IT training in Kenya.",
        "sections": ["services", "safe", "integrations", "learnhub", "demo", "faq"],
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
        "sections": ["training", "learnhub", "testimonials"],
    },
    {
        "slug": "privacy",
        "label": "Privacy",
        "title": "Privacy Policy | Marzley Tech Solutions",
        "description": "How Marzley Tech Solutions collects, uses and protects your personal information, and your rights under Kenya’s Data Protection Act, 2019.",
        "sections": ["privacy"],
    },
    {
        "slug": "terms",
        "label": "Terms",
        "title": "Terms of Service | Marzley Tech Solutions",
        "description": "Terms for websites, systems, M-Pesa integration, care plans and training from Marzley Tech Solutions: quotes, payments, ownership and support.",
        "sections": ["terms"],
    },
]

# Where each homepage section lives when it is not on the current page
HOME_OF = {
    "work": "work", "redesign": "work#redesign", "testimonials": "work#testimonials", "about": "about",
    "services": "services", "demo": "services#demo", "process": "process",
    "planner": "process#planner", "pricing": "pricing", "faq": "contact#faq",
    "contact": "contact", "cases": "work#cases", "deposit": "pricing#deposit",
    "booking": "contact#booking", "training": "training", "compare": "pricing#compare", "care": "pricing#care", "safe": "services#safe", "integrations": "services#integrations", "check": "website-check", "referral": "referrals", "faqs": "faq", "privacy": "privacy", "terms": "terms",
}


def attr(value):
    return value.replace("&", "&amp;").replace('"', "&quot;")


def sections_of(html):
    found = {}
    for m in re.finditer(r'( *<!-- [^>]*-->\n)?( *<section class="section" id="([a-z]+)".*?</section>\n)', html, re.S):
        found[m.group(3)] = (m.group(1) or "") + m.group(2)
    return found


def og_image(slug):
    """img/og/<slug>.jpg if tools/make_og_images.js made one, else the site-wide image."""
    return "img/og/%s.jpg" % slug if (ROOT / "img" / "og" / (slug + ".jpg")).exists() else None


def make_page(html, slug, title, description, main_html, ld_nodes, current, on_page=()):
    """Turn a copy of the homepage into another page with its own meta, schema and main content."""
    url = SITE + slug
    own = og_image(slug)
    if own:
        html = html.replace(SITE + "img/brand/og-image.jpg", SITE + own)
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
    html = html.replace('<a class="brand" href="#top" aria-label="MarzleyTech: back to top">',
                        '<a class="brand" href="./" aria-label="MarzleyTech home">', 1)
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
    if not case and og_image(post["slug"]):
        hero += ('                        <figure class="post-hero"><img src="%s" alt="" width="1200" height="630" loading="eager" /></figure>\n'
                 % og_image(post["slug"]))
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
        '                            <a class="btn btn-solid" href="contact">Get a free quote <span aria-hidden="true">→</span></a>\n'
        '                            <a class="btn btn-ghost" href="https://wa.me/254745789590?text={wa}" target="_blank" rel="noopener noreferrer">'
        '<i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>\n'
        '                        </div>\n'
        '                    </aside>\n'
        '                    <aside class="post-learn" aria-label="Free learning hub">\n'
        '                        <i class="fa-solid fa-laptop-code" aria-hidden="true"></i>\n'
        '                        <p><strong>Want to build it yourself?</strong> Our free learning hub has HTML, CSS, JavaScript, Python and SQL lessons '
        'with a live code editor. No account needed.</p>\n'
        '                        <a class="btn btn-ghost" href="learn/">Start learning free <span aria-hidden="true">→</span></a>\n'
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
          ("Process", "Mchakato"), ("Pricing", "Bei"), ("Blog", "Blogu"), ("Learn", "Jifunze"), ("Contact", "Wasiliana"), ("Client login", "Ingia (wateja)")]


SW_FOOTER = [
    (">Technology for real solutions<", ">Teknolojia kwa suluhisho halisi<"),
    ("<h4>Explore</h4>", "<h4>Gundua</h4>"), ("<h4>Work</h4>", "<h4>Kazi</h4>"),
    ("<h4>Contact</h4>", "<h4>Mawasiliano</h4>"), ("<h4>Support</h4>", "<h4>Tuunge mkono</h4>"),
    ('href="./">Home</a>', 'href="./">Nyumbani</a>'), ('href="work">Work</a>', 'href="work">Kazi zetu</a>'),
    ('href="about">About</a>', 'href="about">Kuhusu</a>'), ('href="services">Services</a>', 'href="services">Huduma</a>'),
    ('href="process">Process</a>', 'href="process">Mchakato</a>'),
    ('href="pricing">Packages &amp; pricing</a>', 'href="pricing">Vifurushi na bei</a>'),
    ('href="training">Training courses</a>', 'href="training">Kozi za mafunzo</a>'),
    ('href="learn/">Learn to code (free)</a>', 'href="learn/">Jifunze kuandika programu (bure)</a>'),
    ('href="website-check">Free website check</a>', 'href="website-check">Kagua tovuti yako bure</a>'),
    ('href="referrals">Refer &amp; earn</a>', 'href="referrals">Pendekeza upate zawadi</a>'),
    ('href="blog">Blog</a>', 'href="blog">Blogu</a>'), ('href="faq">FAQ</a>', 'href="faq">Maswali</a>'),
    ('href="contact">Contact</a>', 'href="contact">Wasiliana</a>'),
    ('href="work">Selected projects</a>', 'href="work">Miradi yetu</a>'),
    ('href="work#cases">Case studies</a>', 'href="work#cases">Mifano ya kazi</a>'),
    (">Download the app</a>", ">Pakua programu</a>"), (">Client login</a>", ">Ingia (wateja)</a>"),
    (">Email</a>", ">Barua pepe</a>"), (">Support our work ☕</button>", ">Unga mkono kazi yetu ☕</button>"),
    ("All rights reserved.", "Haki zote zimehifadhiwa."), (">Back to top ↑</a>", ">Rudi juu ↑</a>"),
    (">Cookie settings</button>", ">Mipangilio ya vidakuzi</button>"),
    ('href="privacy">Privacy</a>', 'href="privacy">Faragha</a>'),
    (">Tips &amp; offers by email</p>", ">Vidokezo na ofa kwa barua pepe</p>"),
    (">Practical website and M-Pesa tips, new courses and offers. At most twice a month.</p>", ">Vidokezo vya tovuti na M-Pesa, kozi mpya na ofa. Mara mbili kwa mwezi, zaidi.</p>"),
    ('placeholder="Your email address"', 'placeholder="Barua pepe yako"'), (">Subscribe</button>", ">Jiandikishe</button>"), ('href="terms">Terms</a>', 'href="terms">Masharti</a>'),
    ('<a href="kiswahili" hreflang="sw" lang="sw">Kiswahili</a>', '<a href="./" hreflang="en" lang="en">English</a>'),
]


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
    page = page.replace('<span>Client login</span></a>', '<span>Ingia (wateja)</span></a>', 1)
    foot_start = page.index('<footer class="site-footer">')
    foot_end = page.index("</footer>", foot_start)
    foot = page[foot_start:foot_end]
    for en, sw in SW_FOOTER:
        foot = foot.replace(en, sw)
    page = page[:foot_start] + foot + page[foot_end:]
    page = page.replace("<span>Chat with us</span>", "<span>Ongea nasi</span>", 1)
    page = page.replace('aria-label="Chat with us"', 'aria-label="Ongea nasi"', 1)
    page = page.replace(">Skip to content</a>", ">Ruka hadi maudhui</a>", 1)
    page = page.replace('<span class="dot"></span>Available for hire</a>', '<span class="dot"></span>Tunapatikana</a>', 1)
    page = page.replace('<span class="dot" aria-hidden="true"></span>Available for hire</a>',
                        '<span class="dot" aria-hidden="true"></span>Tunapatikana</a>', 1)
    page = page.replace('<button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">Menu</button>',
                        '<button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">Menyu</button>', 1)
    return page


# ---------- 404 page ----------

def build_404(html):
    body = (
        '        <section class="section notfound" id="notfound" aria-labelledby="nf-title">\n'
        '            <div class="wrap">\n'
        '                <p class="notfound-code" aria-hidden="true">404</p>\n'
        '                <h1 id="nf-title">We couldn’t find that page</h1>\n'
        '                <p class="notfound-lede">The link may be old or mistyped. Here are some places to go instead:</p>\n'
        '                <ul class="notfound-links">\n'
        '                    <li><a href="./"><i class="fa-solid fa-house" aria-hidden="true"></i><span><strong>Home</strong>Start from the beginning</span></a></li>\n'
        '                    <li><a href="work"><i class="fa-solid fa-briefcase" aria-hidden="true"></i><span><strong>Our work</strong>Projects and case studies</span></a></li>\n'
        '                    <li><a href="pricing"><i class="fa-solid fa-tags" aria-hidden="true"></i><span><strong>Pricing</strong>Packages from KSh 15,000</span></a></li>\n'
        '                    <li><a href="blog"><i class="fa-solid fa-newspaper" aria-hidden="true"></i><span><strong>Blog</strong>Tips and guides</span></a></li>\n'
        '                    <li><a href="contact"><i class="fa-solid fa-comments" aria-hidden="true"></i><span><strong>Contact</strong>We’re available 24/7</span></a></li>\n'
        '                </ul>\n'
        '            </div>\n'
        '        </section>\n'
    )
    nodes = [web_page("404", "Page not found | Marzley Tech Solutions", "This page doesn’t exist.")]
    page = make_page(html, "404", "Page not found | Marzley Tech Solutions", "This page doesn’t exist.", body, nodes, None, ["notfound"])
    # Shown at any address, so every link and file must resolve from the site root
    page = page.replace("<head>\n", '<head>\n    <base href="/" />\n', 1)
    page = page.replace('<meta name="robots" content="index, follow, max-image-preview:large" />', '<meta name="robots" content="noindex, follow" />', 1)
    page = re.sub(r' *<link rel="canonical"[^>]*>\n', "", page)
    return page


# ---------- sitemap ----------

def write_sitemap(posts, cases=()):
    today = datetime.date.today().isoformat()
    urls = [
        ("", "weekly", "1.0", ["img/brand/og-image.jpg", "img/kelvin/office.jpg", "img/kelvin/office-square.jpg"]),
        ("work", "weekly", "0.9", []), ("services", "monthly", "0.9", []), ("pricing", "monthly", "0.9", []),
        ("about", "monthly", "0.8", []), ("contact", "monthly", "0.8", []), ("process", "monthly", "0.7", []),
        ("training", "monthly", "0.8", []), ("learn/", "weekly", "0.8", []), ("website-check", "monthly", "0.8", []), ("faq", "monthly", "0.7", []), ("referrals", "monthly", "0.6", []), ("blog", "weekly", "0.8", []), ("kiswahili", "monthly", "0.7", []),
        ("privacy", "yearly", "0.3", []), ("terms", "yearly", "0.3", []),
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


def minify_assets():
    """css/home.css and js/home.js -> .min versions (esbuild if installed, otherwise a plain copy)."""
    import shutil
    import subprocess
    pairs = [("css/home.css", "css/home.min.css"), ("js/home.js", "js/home.min.js")]
    esbuild = shutil.which("esbuild") or os.environ.get("ESBUILD")
    for src, dst in pairs:
        if esbuild:
            subprocess.run([esbuild, str(ROOT / src), "--minify", "--log-level=warning", "--outfile=" + str(ROOT / dst)], check=True)
        else:
            shutil.copyfile(ROOT / src, ROOT / dst)
        print("wrote", dst, "(minified)" if esbuild else "(copy: install esbuild to minify)")


def write(name, text):
    (ROOT / name).write_text(text, encoding="utf-8", newline="")
    print("wrote", name)


def sync_csp_hash():
    """The theme script is inline in every page (no extra request); keep its hash in the .htaccess CSP."""
    import base64, hashlib
    m = re.search(r"<script>(\(function \(\) \{ var root = document\.documentElement;.*?)</script>", (ROOT / "index.html").read_text(encoding="utf-8"))
    if not m:
        return
    digest = base64.b64encode(hashlib.sha256(m.group(1).encode("utf-8")).digest()).decode()
    ht = ROOT / ".htaccess"
    text = ht.read_text(encoding="utf-8")
    new = re.sub(r"script-src 'self'( 'sha256-[^']+')?", "script-src 'self' 'sha256-%s'" % digest, text, count=1)
    if new != text:
        ht.write_text(new, encoding="utf-8", newline="")
        print("updated the CSP hash for the inline theme script")


INLINE_CSS = [("css/home.min.css", "css/"), ("vendor/fontawesome/css/icons.min.css", "vendor/fontawesome/css/")]


def inline_css():
    """Put the site CSS inside every page instead of separate files, so phones can draw the page
    without waiting for extra downloads (the biggest mobile speed win). Safe to run repeatedly."""
    blocks = {}
    for path, base in INLINE_CSS:
        css = (ROOT / path).read_text(encoding="utf-8")
        parent = base.rstrip("/").rpartition("/")[0]
        parent = parent + "/" if parent else ""
        # url(../x) inside the CSS is relative to its folder; make it relative to the site root
        css = re.sub(r"url\((['\"]?)\.\./", lambda m: "url(" + m.group(1) + parent, css)
        css = re.sub(r"/\*!.*?\*/", "", css, flags=re.S).strip()
        blocks[path] = '<style data-inline="%s">%s</style>' % (path, css.replace("</", "<\\/"))
    count = 0
    for page in sorted(ROOT.glob("*.html")):
        text = page.read_text(encoding="utf-8")
        new = text
        for path, _ in INLINE_CSS:
            new = new.replace('<link rel="stylesheet" href="%s" />' % path, blocks[path])
            new = re.sub(r'<style data-inline="%s">.*?</style>' % re.escape(path), lambda m: blocks[path], new, flags=re.S)
        if new != text:
            page.write_text(new, encoding="utf-8", newline="")
            count += 1
    print("inlined CSS into %d pages" % count)


VERSIONED = ["js/home.min.js", "vendor/gsap/gsap.min.js", "vendor/gsap/ScrollTrigger.min.js"]


def version_assets():
    """Add ?v=<content hash> to script links, so browsers can cache them for long and still get updates."""
    import hashlib
    tags = {}
    for path in VERSIONED:
        f = ROOT / path
        if f.exists():
            tags[path] = hashlib.sha1(f.read_bytes()).hexdigest()[:10]
    for page in sorted(ROOT.glob("*.html")):
        text = page.read_text(encoding="utf-8")
        new = text
        for path, v in tags.items():
            new = re.sub(r'src="%s(\?v=[0-9a-f]+)?"' % re.escape(path), 'src="%s?v=%s"' % (path, v), new)
        if new != text:
            page.write_text(new, encoding="utf-8", newline="")
    # The portal and learning hub pages load their own scripts and styles. Stamp them too,
    # so a new upload never runs old cached JavaScript against new HTML (or the other way round).
    for page in ("portal/index.html", "learn/index.html"):
        f = ROOT / page
        if not f.exists():
            continue
        text = f.read_text(encoding="utf-8")

        def stamp(m):
            ref = m.group(2)
            target = (f.parent / ref).resolve()
            if not target.is_file():
                return m.group(0)
            v = hashlib.sha1(target.read_bytes()).hexdigest()[:10]
            return '%s="%s?v=%s"' % (m.group(1), ref, v)

        new = re.sub(r'(src|href)="((?:\.\./)?[A-Za-z0-9_./-]+\.(?:js|css))(?:\?v=[0-9a-f]+)?"', stamp, text)
        if new != text:
            f.write_text(new, encoding="utf-8", newline="")


def subset_icons():
    """Rebuild the small icon font with every fa-* icon the site uses (needs fonttools)."""
    try:
        import fontTools  # noqa: F401
    except ImportError:
        print("skipped icon subset (pip install fonttools brotli)")
        return
    import subprocess, sys
    subprocess.run([sys.executable, str(ROOT / "tools" / "subset_icons.py")], check=True)


def main():
    minify_assets()
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
    write("404.html", build_404(home))
    write_sitemap(posts, cases)
    subset_icons()
    inline_css()
    version_assets()
    sync_csp_hash()
    print("wrote sitemap.xml")


if __name__ == "__main__":
    main()
