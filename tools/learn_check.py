"""Check the lessons in content/learn: headers, quiz blocks, and that every runnable example works.

Runs each ```try-python / try-javascript / try-sql / try-c / try-cpp / try-java / try-go / try-php
/ try-kotlin block with the matching local tool (python3, node, sqlite3 via Python, gcc, g++, javac,
go, php, kotlinc) and reports failures. Browser-only JavaScript (DOM, fetch, localStorage...) and
HTML are skipped. Examples learners copy elsewhere are checked too: ```dart programs run with
`dart`, Flutter screens go through `flutter analyze`, ```kotlin programs with fun main run with
kotlinc, and ```jsx / try-react must at least parse (esbuild). Point KOTLIN_HOME, DART_SDK,
FLUTTER_ROOT and ESBUILD at the tools if they aren't on the PATH; missing tools are skipped.

    python3 tools/learn_check.py            # all lessons
    python3 tools/learn_check.py python     # one subject
    python3 tools/learn_check.py -v         # also print each block's output
"""
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content" / "learn"
# The same sample shop database the learning hub loads before every SQL example (learn/runner.js)
_runner = (ROOT / "learn" / "runner.js").read_text(encoding="utf-8")
SAMPLE_SQL = "\n".join(re.findall(r'^\s*"((?:CREATE|INSERT)[^"]*)"', _runner.split("var SAMPLE = [", 1)[1].split("].join", 1)[0], re.M))
BROWSER_ONLY = re.compile(r"\b(document|window|localStorage|sessionStorage|fetch|alert|prompt|navigator|FormData)\b")


def run(cmd, cwd, stdin=""):
    p = subprocess.run(cmd, cwd=cwd, input=stdin, capture_output=True, text=True, timeout=60)
    return p.returncode, (p.stdout + p.stderr).strip()


def tool(env, name, sub):
    base = os.environ.get(env)
    if base and Path(base, sub).exists():
        return str(Path(base, sub))
    return shutil.which(name)


KOTLINC = tool("KOTLIN_HOME", "kotlinc", "bin/kotlinc")
DART = tool("DART_SDK", "dart", "bin/dart")
FLUTTER = tool("FLUTTER_ROOT", "flutter", "bin/flutter")
ESBUILD = os.environ.get("ESBUILD") or shutil.which("esbuild")
FLUTTER_APP = Path(tempfile.gettempdir(), "learn-check-flutter")
FLUTTER_PACKAGES = ["http", "provider", "shared_preferences", "sqflite", "path", "intl", "url_launcher", "image_picker",
                    "go_router", "geolocator", "firebase_core", "firebase_auth", "cloud_firestore", "flutter_riverpod", "share_plus"]


def flutter_app():
    """A throwaway Flutter project (made once) whose lib/main.dart each example is analysed as."""
    if not (FLUTTER_APP / "pubspec.lock").exists() or not all(p + ":" in (FLUTTER_APP / "pubspec.yaml").read_text() for p in FLUTTER_PACKAGES):
        shutil.rmtree(FLUTTER_APP, ignore_errors=True)
        subprocess.run([FLUTTER, "create", "--empty", "--project-name", "check_app", str(FLUTTER_APP)], capture_output=True, text=True, check=True)
        subprocess.run([FLUTTER, "pub", "add"] + FLUTTER_PACKAGES, cwd=FLUTTER_APP, capture_output=True, text=True, check=True)
    return FLUTTER_APP


def run_block(lang, code, tmp):
    if lang == "kotlin":
        if "fun main" not in code or re.search(r"^import (android|androidx|kotlinx|retrofit2|okhttp3)\.", code, re.M):
            return None                      # an Android screen: needs Android Studio, not checked here
        Path(tmp, "main.kt").write_text(code)
        rc, out = run([KOTLINC, "main.kt", "-include-runtime", "-nowarn", "-d", "main.jar"], tmp)
        return (rc, out) if rc else run(["java", "-jar", "main.jar"], tmp)
    if lang == "dart":
        if re.search(r"^import 'package:", code, re.M):     # Flutter or packages: analyse it inside a Flutter project
            app = flutter_app()
            (app / "lib" / "main.dart").write_text(code)
            rc, out = run([FLUTTER, "analyze", "--no-pub", "--no-fatal-infos", "--no-fatal-warnings", "lib/main.dart"], app)
            return rc, out
        if "void main" not in code and "Future<void> main" not in code:
            return None                      # a fragment
        Path(tmp, "main.dart").write_text(code)
        return run([DART, "run", "main.dart"], tmp)
    if lang in ("jsx", "react", "tsx"):
        p = subprocess.run([ESBUILD, "--loader=" + ("tsx" if lang == "tsx" else "jsx"), "--log-level=error"], input=code, capture_output=True, text=True, timeout=60)
        return p.returncode, p.stderr.strip()
    if lang == "python":
        return run([sys.executable, "-c", code], tmp, stdin="test\n" * 5)
    if lang == "javascript":
        if BROWSER_ONLY.search(code):
            return None
        return run(["node", "-e", code], tmp)
    if lang == "sql":
        db = sqlite3.connect(":memory:", isolation_level=None)
        db.executescript(SAMPLE_SQL)
        out = []
        try:
            for stmt in [s for s in split_sql(code) if s.strip()]:
                cur = db.execute(stmt)
                if cur.description:
                    out.append(" | ".join(d[0] for d in cur.description))
                    out += [" | ".join(str(v) for v in row) for row in cur.fetchall()]
            return 0, "\n".join(out)
        except sqlite3.Error as e:
            return 1, "%s\nin: %s" % (e, stmt.strip()[:200])
    if lang in ("c", "cpp"):
        src = Path(tmp, "main." + lang)
        src.write_text(code)
        comp = ["gcc", "-std=c11"] if lang == "c" else ["g++", "-std=c++17"]
        rc, out = run(comp + [str(src), "-o", "prog", "-lm"], tmp)
        rc, out = (rc, out) if rc else run(["./prog"], tmp)
        if rc:
            return rc, out
        # Also run it with the in-browser engine learners actually use (PicoC / JSCPP)
        p = subprocess.run(["node", str(ROOT / "tools" / "learn_engine_run.js"), lang], input=code,
                           capture_output=True, text=True, timeout=120)
        eng = (p.stdout + p.stderr).strip()
        if lang == "cpp" and re.search(r"Parsing Failure|cannot find library|not supported|is not defined", eng):
            return 0, out          # the hub falls back to the full online compiler for these
        if p.returncode:
            return 1, "works with %s but fails in the browser engine:\n%s" % (comp[0], eng)
        if p.stdout.strip() != out.strip():
            return 1, "the browser engine prints something different:\n--- %s\n%s\n--- engine\n%s" % (comp[0], out, p.stdout.strip())
        return 0, out
    if lang == "java":
        name = (re.search(r"public\s+class\s+(\w+)", code) or re.search(r"class\s+(\w+)", code)).group(1)
        Path(tmp, name + ".java").write_text(code)
        rc, out = run(["javac", name + ".java"], tmp)
        return (rc, out) if rc else run(["java", name], tmp)
    if lang == "typescript":
        if BROWSER_ONLY.search(code):
            return None
        Path(tmp, "main.ts").write_text(code)
        return run(["node", "--no-warnings", "--experimental-transform-types", "main.ts"], tmp)
    if lang == "go":
        Path(tmp, "main.go").write_text(code)
        return run(["go", "run", "main.go"], tmp)
    if lang == "php":
        Path(tmp, "main.php").write_text(code)
        return run(["php", "main.php"], tmp)
    return None


def split_sql(code):
    out, cur, q = [], "", None
    for ch in code:
        cur += ch
        if q:
            if ch == q:
                q = None
        elif ch in "'\"":
            q = ch
        elif ch == ";":
            out.append(cur)
            cur = ""
    out.append(cur)
    return [re.sub(r"--[^\n]*", "", s) for s in out]


def check_quiz(text, where):
    problems, cur = [], None
    for line in text.splitlines():
        m = re.match(r"\s*([QAH]):\s*(.*)$", line)
        if not m:
            continue
        if m.group(1) == "Q":
            if cur is not None and not cur:
                problems.append("%s: question without answer" % where)
            cur = []
        elif m.group(1) == "A":
            if re.match(r"\s*\|", m.group(2)) or "||" in m.group(2):
                problems.append("%s: answers are split on |, so an answer can't be a | symbol: %r" % (where, m.group(2)))
            answers = [a.strip() for a in m.group(2).split("|") if a.strip()]
            norm = [re.sub(r"\s+|[\"'`,“”]|\.$", "", a.lower()) for a in answers]
            if not any(norm):
                problems.append("%s: answer normalises to nothing: %r" % (where, m.group(2)))
            cur = answers
    if cur is not None and not cur:
        problems.append("%s: last question without answer" % where)
    return problems


def main():
    verbose = "-v" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("-")]
    have = {t: shutil.which(t) for t in ("node", "gcc", "g++", "javac", "go", "php")}
    have.update(kotlinc=KOTLINC, dart=DART, esbuild=ESBUILD)
    fails, ran, skipped = [], 0, 0
    for path in sorted(SRC.glob("*/[!_]*.md")):
        if only and path.parent.name not in only:
            continue
        text = path.read_text(encoding="utf-8")
        where = "%s/%s" % (path.parent.name, path.name)
        if not re.match(r"---\nslug: [a-z0-9-]+\ntitle: .+\n", text):
            fails.append("%s: bad header" % where)
        body = re.split(r"^=== \w+ ===$", text, flags=re.M)[0]
        for i, (lang, code) in enumerate(re.findall(r"^```([\w-]*)\n(.*?)^```$", body, re.S | re.M)):
            if lang == "quiz":
                fails += check_quiz(code, where)
                continue
            if not lang.startswith("try-") and lang not in ("dart", "kotlin", "jsx", "tsx"):
                continue
            lang = lang[4:] if lang.startswith("try-") else lang
            need = {"javascript": "node", "typescript": "node", "c": "gcc", "cpp": "g++", "java": "javac", "go": "go", "php": "php",
                    "kotlin": "kotlinc", "dart": "dart", "jsx": "esbuild", "tsx": "esbuild", "react": "esbuild"}.get(lang)
            if need and not have[need] or (lang == "dart" and "import 'package:" in code and not FLUTTER):
                skipped += 1
                continue
            with tempfile.TemporaryDirectory() as tmp:
                try:
                    res = run_block(lang, code, tmp)
                except subprocess.TimeoutExpired:
                    res = (1, "timeout")
            if res is None:
                skipped += 1
                continue
            ran += 1
            rc, out = res
            if verbose:
                print("--- %s block %d (%s)\n%s" % (where, i, lang, out[:1500]))
            if rc != 0 and "fails on purpose" not in code:
                fails.append("%s block %d (%s):\n    %s" % (where, i, lang, out[-600:].replace("\n", "\n    ")))
    print("ran %d code blocks, skipped %d (browser-only or no tool)" % (ran, skipped))
    for f in fails:
        print("FAIL", f)
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
