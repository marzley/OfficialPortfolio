"""Copy the user guide PDF into the site and render its pages as preview images.

    python3 tools/guide/publish.py path/to/Marzley-Tech-User-Guide.pdf

Writes docs/Marzley-Tech-User-Guide.pdf, img/guide/p01.webp ... (900 px wide) and
data/guide.json (page count, file size and where each section starts), which
tools/build_pages.py reads, so rebuild the site afterwards.
"""
import io
import json
import re
import shutil
import sys
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
src = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).with_name("Marzley-Tech-User-Guide.pdf"))
(ROOT / "docs").mkdir(exist_ok=True)
out = ROOT / "img" / "guide"
out.mkdir(parents=True, exist_ok=True)
for old in out.glob("p*.webp"):
    old.unlink()
shutil.copyfile(src, ROOT / "docs" / "Marzley-Tech-User-Guide.pdf")
doc = pymupdf.open(src)
for page in doc:
    pix = page.get_pixmap(matrix=pymupdf.Matrix(900 / page.rect.width, 900 / page.rect.width))
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    img.save(out / ("p%02d.webp" % (page.number + 1)), "WEBP", quality=72, method=6)
sections = [{"title": "Contents and the system at a glance", "page": 2}]
for page in doc:
    lines = [l.strip() for l in page.get_text().splitlines() if l.strip()]
    if lines and re.sub(r"\s", "", lines[0]).upper().startswith("SECTION"):
        sections.append({"num": re.sub(r"\D", "", lines[0]), "title": lines[1], "page": page.number + 1})
info = {"pages": doc.page_count, "bytes": (ROOT / "docs" / "Marzley-Tech-User-Guide.pdf").stat().st_size,
        "sections": sections}
(ROOT / "data" / "guide.json").write_text(json.dumps(info, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
print("published %d pages, %d sections" % (doc.page_count, len(sections)))
