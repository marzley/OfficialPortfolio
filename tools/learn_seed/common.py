"""Helpers for writing learning hub lessons. Run build.py to regenerate data/learn-seed.json."""
TRACKS = []


def track(slug, title, lang, summary):
    t = {"slug": slug, "title": title, "lang": lang, "summary": summary, "lessons": []}
    TRACKS.append(t)
    return t


def find(slug):
    return next(t for t in TRACKS if t["slug"] == slug)


def lesson(t, slug, title, body, exercise="", starter="", expected="", must=""):
    t["lessons"].append({"slug": slug, "title": title, "body": body.strip() + "\n", "exercise": exercise.strip(),
                         "starter": starter.strip("\n"), "expected": expected, "must_contain": must})
