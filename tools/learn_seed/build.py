"""Regenerate data/learn-seed.json from the lesson files. Run: python3 tools/learn_seed/build.py

Raise VERSION whenever you add lessons: the live site then adds the new subjects and lessons
automatically (lessons already there, including ones edited in the portal, are left alone).
"""
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from common import TRACKS  # noqa: E402
import core, extend, networking, money, git_linux, more_tracks, design, languages, ict  # noqa: E402,F401

VERSION = "3"
ROOT = pathlib.Path(__file__).resolve().parents[2]


def check(t, l):
    body = l["body"]
    fences = re.findall(r"^```", body, re.M)
    assert len(fences) % 2 == 0, f"{t['slug']}/{l['slug']}: unclosed code fence"
    for block in re.findall(r"^```quiz\n(.*?)^```", body, re.M | re.S):
        qs = re.findall(r"^Q:", block, re.M)
        ans = re.findall(r"^A:\s*(.+)$", block, re.M)
        assert qs and len(qs) == len(ans), f"{t['slug']}/{l['slug']}: every Q needs an A"
        for a in ans:
            assert all(x.strip() for x in a.split("|")), f"{t['slug']}/{l['slug']}: empty answer in {a!r}"


def main():
    slugs = set()
    lessons = 0
    for t in TRACKS:
        assert t["slug"] not in slugs, "duplicate track " + t["slug"]
        slugs.add(t["slug"])
        seen = set()
        for l in t["lessons"]:
            assert l["slug"] not in seen, f"duplicate lesson {t['slug']}/{l['slug']}"
            seen.add(l["slug"])
            check(t, l)
            lessons += 1
    out = ROOT / "data" / "learn-seed.json"
    out.write_text(json.dumps({"version": VERSION, "tracks": TRACKS}, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(l["body"].split()) for t in TRACKS for l in t["lessons"])
    quizzes = sum(l["body"].count("\nQ:") for t in TRACKS for l in t["lessons"])
    print(f"{len(TRACKS)} subjects, {lessons} lessons, {quizzes} practice questions, about {words:,} words -> {out.relative_to(ROOT)}")
    for t in TRACKS:
        print(f"  {t['title']}: {len(t['lessons'])} lessons")


if __name__ == "__main__":
    main()
