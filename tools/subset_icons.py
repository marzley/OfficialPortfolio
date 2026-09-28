"""Make a small Font Awesome with only the icons the site uses.

The full library is ~370 KB (CSS + fonts) and blocks the first paint. This scans the site for
fa-* class names and writes:
  vendor/fontawesome/css/icons.min.css        (base styles + only the used icons)
  vendor/fontawesome/webfonts/*-sub.woff2     (fonts with only those glyphs)

Run after adding an icon anywhere:  python3 tools/subset_icons.py   (build_pages.py runs it too)
Needs: pip install fonttools brotli
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FA = ROOT / "vendor" / "fontawesome"
SCAN = ["*.html", "content/*.html", "learn/*.html", "learn/*.js", "portal/*.html", "portal/*.js", "portal/*.php",
        "js/home.js", "js/offline.js", "js/print-button.js", "js/print-page.js", "data/*.json", "tools/build_pages.py", "*.php"]
FONTS = {"solid": "fa-solid-900", "regular": "fa-regular-400", "brands": "fa-brands-400"}


def used_names():
    names = set()
    for pattern in SCAN:
        for f in ROOT.glob(pattern):
            if f.name.endswith(".min.js"):
                continue
            text = re.sub(r"<style data-inline=.*?</style>", "", f.read_text(encoding="utf-8", errors="ignore"), flags=re.S)
            names.update(re.findall(r"\bfa-([a-z0-9]+(?:-[a-z0-9]+)*)", text))
    return names


def main():
    css = (FA / "css" / "all.min.css").read_text(encoding="utf-8")
    names = used_names()
    # Split into top-level rules (the file has no nested blocks except @keyframes/@media, kept whole)
    rules = re.findall(r"@(?:-webkit-)?keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}|@media[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}|[^{}@]+\{[^{}]*\}|@font-face\{[^{}]*\}|:root[^{}]*\{[^{}]*\}", css)
    out, codes, kept = [], set(), set()
    for rule in rules:
        sel = rule.split("{", 1)[0]
        if rule.startswith("@font-face"):
            continue                                              # replaced below
        icon = re.fullmatch(r"\s*((?:\.fa-[a-z0-9-]+:(?:before|after),?)+)\s*", sel)
        if icon and "content:" in rule:
            parts = [p for p in sel.split(",") if re.match(r"\.fa-([a-z0-9-]+):", p) and re.match(r"\.fa-([a-z0-9-]+):", p).group(1) in names]
            if not parts:
                continue
            kept.update(re.match(r"\.fa-([a-z0-9-]+):", p).group(1) for p in parts)
            body = rule.split("{", 1)[1]
            codes.update(int(c, 16) for c in re.findall(r'content:"\\([0-9a-f]+)', body))
            out.append(",".join(parts) + "{" + body)
            continue
        out.append(rule)
    missing = sorted(n for n in names if n not in kept and not re.search(r"\.fa-" + re.escape(n) + r"\b", "".join(out)))
    faces = ('@font-face{font-family:"Font Awesome 6 Brands";font-style:normal;font-weight:400;font-display:block;src:url(../webfonts/fa-brands-400-sub.woff2) format("woff2")}'
             '@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:400;font-display:block;src:url(../webfonts/fa-regular-400-sub.woff2) format("woff2")}'
             '@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:900;font-display:block;src:url(../webfonts/fa-solid-900-sub.woff2) format("woff2")}')
    header = "/* Font Awesome Free 6.5.2 (subset of the icons this site uses; made by tools/subset_icons.py) - https://fontawesome.com/license/free */\n"
    (FA / "css" / "icons.min.css").write_text(header + "".join(out) + faces, encoding="utf-8")

    from fontTools import subset
    for key, base in FONTS.items():
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        font = subset.load_font(str(FA / "webfonts" / (base + ".woff2")), opts)
        cmap = font.getBestCmap()
        want = [c for c in codes if c in cmap]
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=want or [0x20])
        sub.subset(font)
        subset.save_font(font, str(FA / "webfonts" / (base + "-sub.woff2")), opts)
    size = sum((FA / "webfonts" / (b + "-sub.woff2")).stat().st_size for b in FONTS.values()) + (FA / "css" / "icons.min.css").stat().st_size
    print(f"icons: {len(kept)} used, {len(codes)} glyphs, {size // 1024} KB total")
    utility = {"solid", "regular", "brands", "fw", "spin", "lg", "xl", "2x", "3x", "xs", "sm", "beat", "fade", "pulse", "flip", "shake", "bounce", "ul", "li", "stack", "border",
               "classic", "sharp", "rotate-90", "rotate-180", "rotate-270", "inverse"}
    unknown = [n for n in missing if n not in utility]
    if unknown:
        print("  (not icons, ignored: " + ", ".join(unknown[:30]) + (" ..." if len(unknown) > 30 else "") + ")")


if __name__ == "__main__":
    sys.exit(main())
