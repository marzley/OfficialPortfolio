"""Readable, pre-rendered pages for every subject and lesson of the learning hub.

The hub itself (/learn/?track=…&lesson=…) is a JavaScript app with live code and quizzes. Search
engines index plain HTML faster and better, so each subject and lesson also gets a static page:

    /learn/<subject>/            the course page: summary and every lesson
    /learn/<subject>/<lesson>/   the lesson notes, code examples and questions, with a button to open
                                 the interactive lesson

They are the canonical addresses (the app points its canonical link here) and are listed in the
sitemap. Built from data/learn-seed.json by tools/build_pages.py; never edit the output by hand.
"""
import html
import json
import re
import shutil
from pathlib import Path
from urllib.parse import urljoin, urlparse, parse_qs

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://marzleytechsolutions.co.ke/"
OUT = ROOT / "learn"
e = html.escape
LANG_NAMES = {"html": "HTML", "css": "CSS", "javascript": "JavaScript", "python": "Python", "sql": "SQL", "php": "PHP",
              "typescript": "TypeScript", "react": "React", "c": "C", "cpp": "C++", "csharp": "C#", "java": "Java", "go": "Go",
              "rust": "Rust", "kotlin": "Kotlin", "dart": "Dart", "json": "JSON", "bash": "Terminal", "yaml": "YAML", "xml": "XML",
              "jsx": "JSX", "markdown": "Markdown", "regex": "Regex", "sass": "Sass", "ruby": "Ruby", "lua": "Lua"}


def lesson_url(track, slug=None):
    return "/learn/%s/%s" % (track, (slug + "/") if slug else "")


def fix_link(url):
    """Links in lessons are written relative to /learn/. Make them work from a static page."""
    if re.match(r"^(mailto:|tel:|#)", url):
        return url
    absolute = urljoin(SITE + "learn/", url.replace("&amp;", "&"))
    u = urlparse(absolute)
    if u.netloc != urlparse(SITE).netloc:
        return absolute
    q = parse_qs(u.query)
    if u.path == "/learn/" and q.get("track"):
        return lesson_url(q["track"][0], q.get("lesson", [None])[0]) + (("#" + u.fragment) if u.fragment else "")
    return u.path + (("?" + u.query) if u.query else "") + (("#" + u.fragment) if u.fragment else "")


def inline(text):
    parts = re.split(r"(`[^`]+`)", text)
    out = []
    for p in parts:
        if p.startswith("`") and p.endswith("`") and len(p) > 1:
            out.append("<code>%s</code>" % e(p[1:-1]))
            continue
        s = e(p, quote=False)
        s = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", lambda m: '<a href="%s"%s>%s</a>' % (
            e(fix_link(html.unescape(m.group(2)))),
            ' target="_blank" rel="noopener noreferrer"' if m.group(2).startswith("http") else "", m.group(1)), s)
        s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
        s = re.sub(r"(^|[^*\w])\*([^*\s][^*]*)\*", r"\1<em>\2</em>", s)
        out.append(s)
    return "".join(out)


def split_row(line):
    cells, cur, tick = [], "", False
    for ch in line.strip().strip("|"):
        if ch == "`":
            tick = not tick
        if ch == "|" and not tick:
            cells.append(cur.strip())
            cur = ""
        else:
            cur += ch
    cells.append(cur.strip())
    return cells


def quiz_html(code):
    items, q = [], None
    for line in code.splitlines():
        m = re.match(r"\s*([QAH]):\s*(.*)$", line)
        if not m:
            continue
        if m.group(1) == "Q":
            q = {"q": m.group(2), "a": "", "h": ""}
            items.append(q)
        elif q is not None and m.group(1) == "A":
            q["a"] = m.group(2).split("|")[0].strip()
        elif q is not None and m.group(1) == "H":
            q["h"] = m.group(2)
    if not items:
        return ""
    lis = "".join('<li><p>%s</p><details><summary>Show answer</summary><p>%s%s</p></details></li>'
                  % (inline(i["q"]), inline(i["a"]), (" · " + inline(i["h"])) if i["h"] else "") for i in items)
    return '<section class="static-quiz"><h2>Check yourself</h2><ol>%s</ol></section>' % lis


CALLOUT = {"note": "Note", "tip": "Tip", "warning": "Watch out", "example": "Example", "define": "Key term", "kenya": "In Kenya", "career": "Careers"}


def markdown(src):
    """The same small Markdown subset the hub uses (learn/learn.js), rendered without JavaScript."""
    lines = src.replace("\r", "").split("\n")
    out, para, i, h1_done = [], [], 0, False

    def flush():
        if para:
            out.append("<p>%s</p>" % inline(" ".join(para)))
            para.clear()

    while i < len(lines):
        line = lines[i]
        fence = re.match(r"^```\s*([\w-]*)\s*$", line)
        if fence:
            flush()
            lang, code = fence.group(1), []
            i += 1
            while i < len(lines) and not re.match(r"^```\s*$", lines[i]):
                code.append(lines[i])
                i += 1
            i += 1
            body = "\n".join(code)
            if lang == "quiz":
                out.append(quiz_html(body))
            elif lang == "youtube":
                links = []
                for row in code:
                    if "|" in row:
                        vid, title = [x.strip() for x in row.split("|", 1)]
                        url = ("https://www.youtube.com/playlist?list=" if vid.startswith("PL") else "https://www.youtube.com/watch?v=") + vid
                        links.append('<li><a href="%s" target="_blank" rel="noopener noreferrer">%s</a></li>' % (e(url), e(title)))
                if links:
                    out.append('<aside class="static-videos"><h3>Videos</h3><ul>%s</ul></aside>' % "".join(links))
            elif lang.startswith("tool-"):
                out.append('<p class="static-note">This part of the lesson has an interactive tool. Open the live lesson to use it.</p>')
            else:
                name = lang[4:] if lang.startswith("try-") else lang
                label = LANG_NAMES.get(name, name.upper() if name else "")
                live = lang.startswith("try-")
                out.append('<figure class="static-code">%s<pre><code%s>%s</code></pre></figure>' % (
                    ('<figcaption>%s%s</figcaption>' % (e(label), " · runs live in the interactive lesson" if live else "")) if label else "",
                    (' class="language-%s"' % e(name)) if name else "", e(body)))
            continue
        box = re.match(r"^:::\s*(note|tip|warning|example|think|define|kenya|career)\b\s*(.*)$", line)
        if box:
            flush()
            inner = []
            i += 1
            while i < len(lines) and not re.match(r"^:::\s*$", lines[i]):
                inner.append(lines[i])
                i += 1
            i += 1
            kind, label = box.group(1), box.group(2).strip()
            body = markdown("\n".join(inner))
            if kind == "think":
                out.append('<details class="callout callout-think"><summary><span><b>Think about it:</b> %s</span><em>Show answer</em></summary>'
                           '<div class="callout-body">%s</div></details>' % (inline(label), body))
            else:
                out.append('<aside class="callout callout-%s"><p class="callout-title">%s</p><div class="callout-body">%s</div></aside>'
                           % (kind, inline(label) if label else CALLOUT[kind], body))
            continue
        h = re.match(r"^(#{1,4})\s+(.*)$", line)
        if h:
            flush()
            level = len(h.group(1))
            if level == 1:
                level = 1 if not h1_done else 2
                h1_done = True
            out.append("<h%d>%s</h%d>" % (level, inline(h.group(2)), level))
            i += 1
            continue
        if line.strip().startswith("|") and i + 1 < len(lines) and re.match(r"^\s*\|?\s*:?-{2,}", lines[i + 1]):
            flush()
            head = split_row(line)
            i += 2
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(split_row(lines[i]))
                i += 1
            out.append('<div class="static-table"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>' % (
                "".join("<th>%s</th>" % inline(c) for c in head),
                "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % inline(c) for c in r) for r in rows)))
            continue
        if re.match(r"^\s*[-*]\s+", line) or re.match(r"^\s*\d+\.\s+", line):
            flush()
            ordered = bool(re.match(r"^\s*\d+\.\s+", line))
            items = []
            while i < len(lines) and (re.match(r"^\s*([-*]|\d+\.)\s+", lines[i])):
                items.append(re.sub(r"^\s*([-*]|\d+\.)\s+", "", lines[i]))
                i += 1
            tag = "ol" if ordered else "ul"
            out.append("<%s>%s</%s>" % (tag, "".join("<li>%s</li>" % inline(x) for x in items), tag))
            continue
        if line.startswith(">"):
            flush()
            quote = []
            while i < len(lines) and lines[i].startswith(">"):
                quote.append(lines[i].lstrip("> "))
                i += 1
            out.append("<blockquote><p>%s</p></blockquote>" % inline(" ".join(quote)))
            continue
        if re.match(r"^-{3,}\s*$", line):
            flush()
            out.append("<hr />")
            i += 1
            continue
        if not line.strip():
            flush()
            i += 1
            continue
        para.append(line.strip())
        i += 1
    flush()
    return "\n".join(out)


def plain(md):
    md = re.sub(r"^```.*?^```", " ", md, flags=re.S | re.M)
    md = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", md)
    md = re.sub(r"[#*`>|_]+", " ", md)
    return re.sub(r"\s+", " ", md).strip()


def description(lesson, track):
    body = re.sub(r"^#.*$", "", lesson["body"], count=1, flags=re.M)
    first = plain(body.split("\n\n## ")[0])
    text = first or ("Free %s lesson: %s." % (track["title"], lesson["title"]))
    if len(text) > 155:
        text = text[:152].rsplit(" ", 1)[0].rstrip(",;:.") + "…"
    return text


def fit(title, extra):
    for t in (title + " | " + extra, title + " | Marzley Learn", title):
        if len(t) <= 60:
            return t
    return title[:57].rsplit(" ", 1)[0] + "…"


def page(head_assets, title, desc, canonical, ld, crumbs, main):
    nav = ('<nav class="learn-nav" aria-label="Learning hub">'
           '<a href="/learn/?page=tutorials"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Tutorials</a>'
           '<a href="/learn/?page=practice"><i class="fa-solid fa-code" aria-hidden="true"></i> Practice</a>'
           '<a href="/learn/?page=videos"><i class="fa-solid fa-circle-play" aria-hidden="true"></i> Videos</a>'
           '<a href="/learn/?page=notes"><i class="fa-solid fa-file-lines" aria-hidden="true"></i> Notes</a></nav>')
    crumb_html = " / ".join('<a href="%s">%s</a>' % (e(u), e(n)) for n, u in crumbs[:-1]) + " / <span>%s</span>" % e(crumbs[-1][0])
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content="{desc}" />
    <link rel="canonical" href="{canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#0b1b35" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Marzley Tech Learning Hub" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:url" content="{canonical}" />
    <meta property="og:image" content="{site}img/og/training.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{desc}" />
    <meta name="twitter:image" content="{site}img/og/training.jpg" />
    <script type="application/ld+json">{ld}</script>
    <link rel="icon" type="image/png" sizes="32x32" href="/img/brand/favicon-32.png" />
{assets}
</head>
<body class="learn-body static-learn">
    <a class="skip-link" href="#learn-main">Skip to content</a>
    <header class="learn-top">
        <div class="learn-top-in">
            <a class="brand" href="/"><img src="/img/brand/logo-96.webp" alt="" width="36" height="36" /><span>Marzley<span class="accent">Tech</span></span></a>
            <a class="learn-home" href="/learn/">Learn</a>
            {nav}
            <div class="learn-actions"><a class="icon-btn search-btn" href="/learn/?page=search" title="Search lessons"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span class="sr-only">Search lessons</span></a></div>
        </div>
    </header>
    <main id="learn-main" class="learn-main static-main" tabindex="-1">
        <p class="crumbs">{crumbs}</p>
{main}
    </main>
    <footer class="learn-foot">
        <p>Marzley Tech Solutions · <a href="/">Website</a> · <a href="/learn/">Learning hub</a> · <a href="/training">Training courses</a> · <a href="/blog">Blog</a> · <a href="/contact">Contact</a> · <a href="https://wa.me/254745789590" target="_blank" rel="noopener noreferrer">WhatsApp</a> · <a href="/privacy">Privacy</a></p>
    </footer>
</body>
</html>
""".format(title=e(title), desc=e(desc), canonical=e(canonical), site=SITE, ld=json.dumps(ld, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/"),
           assets=head_assets, nav=nav, crumbs=crumb_html, main=main)


def breadcrumbs(crumbs):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE.rstrip("/") + u} for i, (n, u) in enumerate(crumbs)]}


def head_assets():
    """The hub's own stylesheets (with their ?v= stamps), so the static pages look the same."""
    text = (ROOT / "learn" / "index.html").read_text(encoding="utf-8")
    tags = []
    for href in re.findall(r'<link rel="stylesheet" href="([^"]+)"', text):
        if "codemirror" in href:
            continue
        tags.append('    <link rel="stylesheet" href="%s" />' % (("/learn/" + href) if not href.startswith("../") else "/" + href[3:]))
    m = re.search(r'<script src="\.\./js/theme-init\.js([^"]*)"', text)
    if m:
        tags.append('    <script src="/js/theme-init.js%s"></script>' % m.group(1))
    return "\n".join(tags)


def build():
    seed = json.loads((ROOT / "data" / "learn-seed.json").read_text(encoding="utf-8"))
    assets = head_assets()
    written = set()
    for track in seed["tracks"]:
        t, lessons = track["slug"], track["lessons"]
        tdir = OUT / t
        if tdir.exists():
            shutil.rmtree(tdir)
        tdir.mkdir(parents=True)
        written.add(t)
        course_url = SITE.rstrip("/") + lesson_url(t)
        # ---- the course page
        items = "".join('<li><a href="%s"><span class="static-n">%d</span> %s</a></li>' % (e(lesson_url(t, l["slug"])), n + 1, e(l["title"]))
                        for n, l in enumerate(lessons))
        first = lesson_url(t, lessons[0]["slug"]) if lessons else "/learn/"
        main = ('<article class="static-course"><h1>%s: free course</h1><p class="lead">%s</p>'
                '<p class="static-meta">%d lessons · free · no account needed · code examples, practice questions and videos</p>'
                '<p class="static-ctas"><a class="btn btn-solid" href="%s">Start lesson 1</a> '
                '<a class="btn btn-line" href="/learn/?track=%s">Open the interactive course</a> '
                '<a class="btn btn-line" href="/learn/?book=%s">Printable course notes</a></p>'
                '<h2>Lessons</h2><ol class="static-lessons">%s</ol></article>') % (
            e(track["title"]), e(track["summary"]), len(lessons), e(first), e(t), e(t), items)
        crumbs = [("Home", "/"), ("Learn", "/learn/"), (track["title"], lesson_url(t))]
        ld = {"@context": "https://schema.org", "@graph": [
            {"@type": "Course", "@id": course_url + "#course", "name": track["title"], "description": track["summary"], "url": course_url,
             "provider": {"@type": "Organization", "@id": SITE + "#business", "name": "Marzley Tech Solutions", "url": SITE},
             "isAccessibleForFree": True, "inLanguage": "en",
             "offers": {"@type": "Offer", "price": "0", "priceCurrency": "KES", "category": "Free"},
             "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "Online", "courseWorkload": "PT%dH" % max(1, len(lessons))},
             "hasPart": [{"@type": "LearningResource", "name": l["title"], "url": SITE.rstrip("/") + lesson_url(t, l["slug"])} for l in lessons]},
            breadcrumbs(crumbs)]}
        (tdir / "index.html").write_text(page(assets, fit(track["title"] + " free course", "Marzley Tech"),
                                              (track["summary"][:152].rsplit(" ", 1)[0] + "…") if len(track["summary"]) > 155 else track["summary"],
                                              course_url, ld, crumbs, main), encoding="utf-8")
        # ---- each lesson
        for n, l in enumerate(lessons):
            prev, nxt = (lessons[n - 1] if n else None), (lessons[n + 1] if n + 1 < len(lessons) else None)
            url = SITE.rstrip("/") + lesson_url(t, l["slug"])
            live = "/learn/?track=%s&amp;lesson=%s" % (e(t), e(l["slug"]))
            body = markdown(l["body"])
            if "<h1" not in body:
                body = "<h1>%s</h1>\n" % e(l["title"]) + body
            exercise = ""
            if l.get("exercise"):
                exercise = ('<section class="static-exercise"><h2>Exercise</h2>%s<p><a class="btn btn-solid" href="%s#exercise">'
                            'Do this exercise in the live editor</a></p></section>') % (markdown(l["exercise"]), live)
            pager = '<nav class="pager" aria-label="Lessons">%s%s</nav>' % (
                ('<a class="btn btn-line btn-sm" href="%s"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> %s</a>' % (e(lesson_url(t, prev["slug"])), e(prev["title"]))) if prev else "<span></span>",
                ('<a class="btn btn-solid btn-sm" href="%s">%s <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' % (e(lesson_url(t, nxt["slug"])), e(nxt["title"]))) if nxt else "<span></span>")
            cta = ('<aside class="static-live"><p><strong>This is the reading version.</strong> Open the interactive lesson to run every code example, '
                   'answer the questions with instant marking, watch the video and save your progress. It’s free.</p>'
                   '<p><a class="btn btn-solid" href="%s"><i class="fa-solid fa-play" aria-hidden="true"></i> Open the interactive lesson</a></p></aside>') % live
            main = ('<article class="lesson static-lesson">%s<div class="lesson-body">%s</div>%s'
                    '<p class="static-meta">Lesson %d of %d in <a href="%s">%s</a> · <a href="/learn/?book=%s">Printable course notes</a></p>%s</article>') % (
                cta, body, exercise, n + 1, len(lessons), e(lesson_url(t)), e(track["title"]), e(t), pager)
            crumbs = [("Home", "/"), ("Learn", "/learn/"), (track["title"], lesson_url(t)), (l["title"], lesson_url(t, l["slug"]))]
            desc = description(l, track)
            ld = {"@context": "https://schema.org", "@graph": [
                {"@type": "LearningResource", "@id": url + "#lesson", "name": l["title"], "description": desc, "url": url,
                 "learningResourceType": "Lesson", "isAccessibleForFree": True, "inLanguage": "en", "educationalUse": "self-study",
                 "isPartOf": {"@type": "Course", "@id": course_url + "#course", "name": track["title"], "url": course_url},
                 "author": {"@type": "Person", "@id": SITE + "#kelvin", "name": "Kelvin Wanyoike"},
                 "publisher": {"@type": "Organization", "@id": SITE + "#business", "name": "Marzley Tech Solutions"}},
                breadcrumbs(crumbs)]}
            d = tdir / l["slug"]
            d.mkdir()
            (d / "index.html").write_text(page(assets, fit(l["title"], track["title"]), desc, url, ld, crumbs, main), encoding="utf-8")
    # remove folders of subjects that no longer exist
    for d in OUT.iterdir():
        if d.is_dir() and (d / "index.html").exists() and d.name not in written and "static-course" in (d / "index.html").read_text(encoding="utf-8"):
            shutil.rmtree(d)
    return sum(len(tr["lessons"]) for tr in seed["tracks"]), len(seed["tracks"])


if __name__ == "__main__":
    print("static learn pages: %d lessons, %d subjects" % build())
