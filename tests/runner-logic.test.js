// Checks the logic of the Practice page's code runner and mistake guide. Needs only Node: no browser, no compilers.
//   node tests/runner-logic.test.js   (also run by tests/run.sh)
//  - terminal colour codes from compilers are removed (they once showed as boxes and letters)
//  - the online compiler picked for each language is the standard one, never an experimental one with a higher version number
//  - the guide explains real compiler output (with or without colour codes and folder paths) and offers the right fix
"use strict";
const fs = require("fs");
const root = __dirname + "/..";
let fails = 0, total = 0;
const ok = (cond, label) => { total++; if (!cond) { fails++; console.log("FAIL runner: " + label); } };

// ---------- learn/console.js (loaded the way the sandboxed frame loads it) ----------
const sent = [];
global.window = { __runner: { ROOT: "http://x/", VFS: false, send: (m) => sent.push(m), getFiles: () => Promise.resolve(null), version: () => "1" }, addEventListener() {} };
global.parent = {}; global.Worker = function () {};
const consoleSrc = fs.readFileSync(root + "/learn/console.js", "utf8");
new Function("window", consoleSrc.replace("(function () {", "(function () { window.__t = { Run: function () { return Run; }, choose: function () { return chooseCompilers; } };"))(window);
const Run = window.__t.Run(), choose = window.__t.choose();

const shown = (chunks) => {
  sent.length = 0;
  const r = new Run({ id: 1, lang: "c" });
  chunks.forEach((c) => r.write(c));
  r.flush();
  return sent.filter((m) => m.type === "out").map((m) => m.parts.map((p) => p[0]).join("")).join("");
};
const E = "\x1b";
ok(shown([E + "[01m" + E + "[K<source>:10:5:" + E + "[m" + E + "[K " + E + "[01;31m" + E + "[Kerror: " + E + "[m" + E + "[Kexpected '" + E + "[01m" + E + "[K{" + E + "[m" + E + "[K' before 'int'"]) === "<source>:10:5: error: expected '{' before 'int'", "gcc's colour codes are removed");
ok(shown([E + "[3", "1mred", E + "[0m text " + E, "[2K" + E + "[Hdone\n"]) === "red text done\n", "a colour code split across chunks is removed");
ok(shown(["plain [brackets] and 50% stay"]) === "plain [brackets] and 50% stay", "ordinary text is untouched");

const k = (id, name, semver, ex) => ({ id, name, semver, supportsExecute: ex });
const first = (lang, list) => (choose(lang, list)[0] || {}).id;
ok(first("rust", [k("r1900", "rustc 1.90.0", "1.90.0", true), k("g", "gccrs 15.1", "15.1.0", true), k("m", "mrustc (master)", "0.11.2", true), k("n", "rustc nightly", "nightly", true)]) === "r1900", "Rust: rustc, not the experimental gccrs (higher version number)");
ok(first("go", [k("gc", "x86-64 gc 1.23.2", "1.23.2", true), k("gg", "x86-64 gccgo 14.2.0", "14.2.0", true), k("pp", "ppc64le gc 1.23.2", "1.23.2", true)]) === "gc", "Go: gc, not gccgo or another platform");
ok(first("java", [k("j23", "java 23.0.1", "23.0.1", true), k("ea", "java 25-ea", "25.0.0", true), k("gr", "graalvm 23.1", "23.1.0", true)]) === "j23", "Java: a released JDK, not early access");
ok(first("csharp", [k("d", ".NET 8.0.1", "8.0.1", true), k("m", "mono 12.0", "12.0.0", true)]) === "d", "C#: .NET, not Mono");
ok(first("kotlin", [k("kt", "kotlinc 2.0.21", "2.0.21", true), k("rc", "kotlinc 2.1.0-RC", "2.1.0", true), k("kn", "kotlin-native 2.0.21", "2.0.21", true)]) === "kt", "Kotlin: kotlinc, not native or a release candidate");
ok(first("c", [k("a", "x86-64 gcc 14.2", "14.2.0", true), k("c", "x86-64 clang 19.1.0", "19.1.0", true), k("arm", "armv8 gcc 15.1", "15.1.0", false)]) === "a", "C: newest GCC first");
ok(first("rust", [k("g", "gccrs 15.1", "15.1.0", true)]) === "g", "when only an experimental compiler exists, there is still something to try");

// ---------- learn/help.js ----------
global.window = {};
new Function(fs.readFileSync(root + "/learn/help.js", "utf8"))();
const H = window.MarzleyHelp;
const colour = (t) => t.replace(/(<source>:\d+:\d+:|error:|warning:)/g, E + "[01m" + E + "[K$1" + E + "[m" + E + "[K");   // like Compiler Explorer's output
const explain = (lang, code, raw, variant) => {
  if (variant === "colour") raw = colour(raw);
  if (variant === "folder") raw = raw.replace(/<source>/g, "/app/example.c").replace(/^example\./gm, "/tmp/compiler-explorer-compiler1/example.");
  return H.explain(lang, code, { ok: false, error: raw.split("\n")[0], detail: raw });
};
const CASES = [
  ["C: missing ;", "c", "#include <stdio.h>\nint main() {\n    int x = 5\n    printf(\"%d\\n\", x);\n    return 0;\n}",
    "<source>: In function 'main':\n<source>:4:5: error: expected ',' or ';' before 'printf'\n    4 |     printf(\"%d\\n\", x);\n      |     ^~~~~~\n<source>:3:9: warning: unused variable 'x' [-Wunused-variable]\n    3 |     int x = 5\n      |         ^",
    /Missing semicolon/, 4, /Add the missing ; at the end of line 3/],
  ["C: unclosed quote is explained before the errors it causes", "c", "#include <stdio.h>\n#define FILE_NAME \"students.dat\n\nint main() {\n    FILE *f = fopen(FILE_NAME, \"r\");\n    return 0;\n}",
    "<source>:2:19: warning: missing terminating \" character\n    2 | #define FILE_NAME \"students.dat\n      |                   ^\n<source>: In function 'main':\n<source>:5:30: error: missing terminating \" character\n<source>:5:21: error: expected ')' before 'FILE_NAME'",
    /text or character isn't closed/, 2, /Add the closing " on line 2/],
  ["C: the cascade from a missing { (a real user report)", "c", "\n#include <stdio.h>\ntypedef struct {\n    int id;\n} Student;\nStudent s;\n",
    "<source>:4:5: error: expected '{' before 'int'\n    4 |     int id;\n      |     ^~~\n<source>:4:5: error: two or more data types in declaration specifiers\n<source>:5:1: error: expected identifier or '(' before '}' token\n<source>:6:1: error: unknown type name 'Student'",
    /A \{ is missing before "int"/, 4, null],
  ["C++: missing std", "cpp", "#include <iostream>\nint main() {\n    cout << \"Hi\" << endl;\n}",
    "<source>: In function 'int main()':\n<source>:3:5: error: 'cout' was not declared in this scope; did you mean 'std::cout'?\n<source>:3:21: error: 'endl' was not declared in this scope; did you mean 'std::endl'?",
    /isn't declared/, 3, /using namespace std/],
  ["Java: missing ;", "java", "class Main {\n    public static void main(String[] args) {\n        int x = 5\n        System.out.println(x);\n    }\n}",
    "example.java:3: error: ';' expected\n        int x = 5\n                 ^\n1 error", /Missing semicolon/, 3, /Add the missing ; at the end of line 3/],
  ["Go: unused import", "go", "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\tfmt.Println(\"hi\")\n}",
    "./example.go:5:2: \"os\" imported and not used", /imported but unused/, 5, /Remove the unused import "os"/],
  ["Rust: immutable", "rust", "fn main() {\n    let x = 5;\n    x = 6;\n}",
    "error[E0384]: cannot assign twice to immutable variable `x`\n --> <source>:3:5\n  |\n2 |     let x = 5;\n  |         - first assignment to `x`\n3 |     x = 6;\n  |     ^^^^^ cannot assign twice to immutable variable\nhelp: consider making this binding mutable\n  |\n2 |     let mut x = 5;\n  |         +++",
    /can't be changed/, 3, /let mut x = 5/],
  ["Rust: a broken online compiler is not the learner's mistake", "rust", "fn main() {\n    let v = vec![1];\n}",
    "crab1: error: unknown crate 'core'\ncrab1: error: unknown crate 'std'\n<source>:2:13: error: could not resolve macro invocation 'vec' [E0433]", /online Rust compiler had a problem/, 0, null],
  ["Python: misspelt name", "python", "name = 'Amina'\nprint('Hi ' + nme)",
    "Traceback (most recent call last):\n  File \"<exec>\", line 2, in <module>\n    print('Hi ' + nme)\nNameError: name 'nme' is not defined. Did you mean: 'name'?", /nme/, 2, /Change nme to name on line 2/],
];
CASES.forEach(([label, lang, code, raw, title, line, fixLabel]) => {
  ["plain", "colour", "folder"].forEach((variant) => {
    if (variant === "folder" && !/^(C|C\+\+|Java|Go)/.test(label)) return;
    const h = explain(lang, code, raw, variant);
    const where = label + " [" + variant + "]";
    ok(h && title.test(h.title), where + ": title is " + (h && h.title));
    ok(h && h.line === line, where + ": line " + (h && h.line) + ", expected " + line);
    ok(!h || !/\x1b/.test(h.raw), where + ": no colour codes reach the guide's text");
    if (fixLabel) ok(h && h.fixes.some((f) => fixLabel.test(f.label)), where + ": a fix says " + fixLabel + " (got " + (h && h.fixes.map((f) => f.label).join(" / ")) + ")");
  });
});
// a lone quote mark inside the guide's sentences must stay (it was once removed: "end with on the same line")
ok(/end with " on the same line/.test(explain("c", CASES[1][2], CASES[1][3], "plain").why), "the guide's sentences keep their quote marks");
const cascade = explain("c", CASES[2][2], CASES[2][3], "colour");
ok(cascade.more.length === 3, "the cascade lists the other errors under the first");
// characters pasted from Word, WhatsApp or a web page
const NB = String.fromCharCode(0xA0), LQ = String.fromCharCode(0x201C), RQ = String.fromCharCode(0x201D);
const nb = H.explain("c", "int" + NB + "x = 5;", { ok: false, detail: "<source>:1:4: error: stray '\\302' in program" });
ok(nb && nb.fixes.length === 1 && nb.fixes[0].code === "int x = 5;", "a non-breaking space is replaced with a normal one");
const cq = H.explain("python", "print(" + LQ + "hi" + RQ + ")", { ok: false, detail: "  File \"<exec>\", line 1\n    print(" + LQ + "hi" + RQ + ")\nSyntaxError: invalid character '" + LQ + "' (U+201C)" });
ok(cq && cq.fixes.length === 1 && cq.fixes[0].code === 'print("hi")', "curly quotes are replaced with straight ones");

console.log(fails ? fails + " of " + total + " runner checks failed" : "PASS runner logic: " + total + " checks (colour codes removed, the standard compiler is chosen, the guide explains real compiler output)");
process.exit(fails ? 1 : 0);
