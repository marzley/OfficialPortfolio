"""Merge the lessons written as Markdown in content/learn/<track>/*.md into data/learn-seed.json.

Each file looks like this (everything after the header is the lesson body):

    ---
    slug: text-formatting
    title: Text formatting and special characters
    after: headings-paragraphs
    ---
    # Text formatting ...
    === exercise ===
    Make a paragraph with **bold** text.
    === starter ===
    <p></p>
    === expected ===
    === must_contain ===
    <strong>

A new subject is a new folder with a _track.md file (title, lang and summary in the same
--- header); it is added after the existing subjects.

"after" is the lesson it follows in the subject, or START to come first (files are merged
in name order, so a new lesson can follow another new one; without "after" it goes last). Running the script again replaces the lessons
it added before, and the seed "version" changes whenever the content does, so the
portal adds the new lessons on its next visit (portal/lib.php learn_seed).

    python3 tools/learn_merge.py
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "data" / "learn-seed.json"
SRC = ROOT / "content" / "learn"
PARTS = ("exercise", "starter", "expected", "must_contain")


def header(text):
    """key: value lines; a value may be wrapped in quotes (needed when it contains a colon)."""
    head = {}
    for k, v in re.findall(r"^(\w+):\s*(.*)$", text, re.M):
        v = v.strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
            v = v[1:-1]
        head[k] = v
    return head


def parse(path):
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    assert m, "%s: missing --- header" % path
    head = header(m.group(1))
    rest = text[m.end():]
    pieces = re.split(r"^=== (\w+) ===\n", rest, flags=re.M)
    lesson = {"slug": head["slug"], "title": head["title"], "body": pieces[0].strip() + "\n"}
    for name in PARTS:
        lesson[name] = ""
    for name, value in zip(pieces[1::2], pieces[2::2]):
        assert name in PARTS, "%s: unknown part %s" % (path, name)
        lesson[name] = value.strip("\n")
    return head.get("after", ""), lesson


def main():
    seed = json.loads(SEED.read_text(encoding="utf-8"))
    tracks = {t["slug"]: t for t in seed["tracks"]}
    added = 0
    for folder in sorted(p for p in SRC.iterdir() if p.is_dir()):
        meta = folder / "_track.md"
        if meta.exists():
            head = header(meta.read_text(encoding="utf-8").split("---")[1])
            if folder.name not in tracks:
                tracks[folder.name] = {"slug": folder.name, "lessons": []}
                seed["tracks"].append(tracks[folder.name])
            tracks[folder.name].update(title=head["title"], lang=head.get("lang", "none"), summary=head["summary"])
        if folder.name not in tracks:
            continue                       # an empty folder for a subject not written yet
        track = tracks[folder.name]
        for path in sorted(folder.glob("[!_]*.md")):
            after, lesson = parse(path)
            track["lessons"] = [l for l in track["lessons"] if l["slug"] != lesson["slug"]]
            slugs = [l["slug"] for l in track["lessons"]]
            at = 0 if after == "START" else slugs.index(after) + 1 if after else len(slugs)
            track["lessons"].insert(at, lesson)
            added += 1
    body = json.dumps(seed["tracks"], ensure_ascii=False, sort_keys=True)
    seed["version"] = "4-" + hashlib.sha1(body.encode("utf-8")).hexdigest()[:10]
    SEED.write_text(json.dumps(seed, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    total = sum(len(t["lessons"]) for t in seed["tracks"])
    print("merged %d lessons; %d subjects, %d lessons in total" % (added, len(seed["tracks"]), total))


if __name__ == "__main__":
    main()
