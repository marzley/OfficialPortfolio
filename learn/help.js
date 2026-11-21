/* Marzley Learn: explains code errors in plain language, points to the line, and offers one-tap fixes.
 *   explain(lang, code, result) -> { title, why, fix, example, line, lineText, raw, more: [{ line, text }],
 *                                    fixes: [{ label, code }] } or null
 *   tips(lang, code, result, { stdin }) -> [{ line, title, fix, fixes }]: compiler warnings and other
 *                                    things worth checking, even when the code ran
 *   lint(lang, code) -> friendly warnings for HTML and CSS, which never "fail" in the browser
 * A fix is the whole code with the change made; the page applies only the lines that differ. */
(function () {
  "use strict";

  // Terminal colour and cursor codes (ESC[01;31m …) that compilers print: the guide reads text without them
  var ANSI = /\x1b\[[0-?]*[ -\/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]/g;
  var stripAnsi = function (t) { return String(t == null ? "" : t).replace(ANSI, "").replace(/\x1b/g, ""); };

  // Where each tool reports the line number in its messages
  var LINE_PATTERNS = [
    /File "<exec>", line (\d+)/g,                      // Python
    /on line (\d+)/g,                                  // PHP
    /(?:<source>|prog\.(?:c|cc|cpp|cxx)|example\.(?:c|cpp)):(\d+):\d+/g, // C, C++ (Compiler Explorer, Wandbox), Rust
    /<source>\((\d+),\d+\)|prog\.cs\((\d+),\d+\)/g,   // C#
    /(?:example|prog|Main)\.(?:java|kt|go|rs):(\d+)/g, // Java, Kotlin, Go, Rust
    /\.go:(\d+):\d+/g,
    /panicked at [^:\n]*:(\d+):\d+/g,                  // Rust panics
    /file\.c:(\d+):\d+/g,                              // C (PicoC)
    /^(\d+):(\d+)\s/gm,                                // C++ (in-browser)
    /\[string "[^"]*"\]:(\d+):/g,                      // Lua
    /(?:eval|\(eval\)):(\d+)/g,                        // Ruby
    /\(line (\d+)\)/g,                                 // JavaScript (reported by the runner)
    /\((\d+):\d+\)/g,                                  // TypeScript / JSX compile errors
    /line (\d+)/gi                                     // anything else that says "line N"
  ];
  // Python's traceback ends with the line that failed; compilers list the first mistake first
  function findLine(text, last) {
    for (var i = 0; i < LINE_PATTERNS.length; i++) {
      var re = new RegExp(LINE_PATTERNS[i].source, LINE_PATTERNS[i].flags), m, hit = null;
      while ((m = re.exec(text))) { hit = m; if (!last || !re.global) break; }
      if (hit) return Number(hit[1] || hit[2]);
    }
    return 0;
  }
  // The column, where the tool gives one (line:column)
  function findCol(text) {
    var m = /(?:<source>|prog\.\w+|example\.\w+|\.go):\d+:(\d+)/.exec(text) || /<source>\(\d+,(\d+)\)/.exec(text);
    return m ? Number(m[1]) : 0;
  }

  /** Each error and warning a compiler reported: [{ line, kind, text }] (C, C++, C#, Java, Go, Rust, Kotlin). */
  function diagnostics(raw) {
    var out = [], lines = String(raw || "").split("\n"), m;
    lines.forEach(function (l, i) {
      if ((m = /^(?:<source>|prog\.\w+|(?:\.\/)?example\.\w+|Main\.\w+):(\d+)(?::\d+)?:\s*(error|warning|fatal error):\s*(.*)$/.exec(l))) out.push({ line: +m[1], kind: m[2] === "warning" ? "warning" : "error", text: m[3], at: i });
      else if ((m = /^(?:<source>|prog\.cs)\((\d+),\d+\):\s*(error|warning)\s+(CS\d+:\s*.*)$/.exec(l))) out.push({ line: +m[1], kind: m[2], text: m[3].replace(/\s*\[[^\]]*\]\s*$/, ""), at: i });
      else if ((m = /^(error|warning)(?:\[E\d+\])?:\s*(.*)$/.exec(l))) {
        var at = /-->\s*\S+?:(\d+):\d+/.exec(lines[i + 1] || "");
        if (at && !/^aborting due to|^\d+ warnings? emitted/.test(m[2])) out.push({ line: +at[1], kind: m[1], text: m[2], at: i });
      }
      else if ((m = /^(?:\.\/)?(?:example|prog)\.go:(\d+):\d+:\s*(.*)$/.exec(l))) out.push({ line: +m[1], kind: "error", text: m[2], at: i });
    });
    return out;
  }

  // ---------- helpers for the one-tap fixes ----------
  function lev(a, b) {
    if (a === b) return 0;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  /** The closest known name to a misspelt one (or "" if nothing is close enough). */
  function closest(word, names) {
    var best = "", score = 99, w = String(word);
    (names || []).forEach(function (n) {
      if (!n || n === w) return;
      var d = n.toLowerCase() === w.toLowerCase() ? 0.5 : lev(w.toLowerCase(), n.toLowerCase());
      if (d < score) { score = d; best = n; }
    });
    return score <= Math.max(1, Math.floor(w.length / 3)) ? best : "";
  }
  function words(code) {
    var seen = {}, out = [];
    (String(code).replace(/(["'`])(?:\\.|(?!\1)[^\\\n])*\1/g, " ").match(/[A-Za-z_$][\w$]*/g) || []).forEach(function (w) { if (!seen[w]) { seen[w] = 1; out.push(w); } });
    return out;
  }
  var KNOWN = {
    python: "print input len range int str float list dict set tuple open sum min max abs round sorted reversed enumerate zip map filter type isinstance append extend insert remove pop upper lower strip split join replace format keys values items get count index find startswith endswith True False None def return import while for elif else class",
    javascript: "console log document window alert prompt confirm parseInt parseFloat Number String Math JSON Array Object length push pop shift map filter forEach reduce join split toUpperCase toLowerCase getElementById querySelector addEventListener innerHTML textContent value function return const let var true false null undefined",
    java: "System out println print printf String Scanner nextInt nextLine nextDouble next length charAt equals substring toUpperCase toLowerCase Integer parseInt Math max min abs sqrt pow ArrayList List add get size contains indexOf isEmpty trim split replace HashMap Map put containsKey keySet values Arrays sort toString valueOf main public static void int double boolean char",
    csharp: "Console WriteLine ReadLine Write Math String int Parse ToString Convert ToInt32 ToDouble List Dictionary Length Count Add Contains Max Min Abs Sqrt Pow Main string double bool var",
    c: "printf scanf puts gets getchar putchar fgets strlen strcpy strcmp strcat malloc free sizeof main return include int float double char void",
    cpp: "cout cin endl string vector push_back size length getline main return include int float double char bool void auto",
    go: "fmt Println Printf Print Sprintf Scan Scanln len append make range func main package import var const string int float64 bool",
    rust: "println print format let mut fn main String Vec vec push len iter map collect to_string parse unwrap i32 i64 f64 usize bool",
    kotlin: "println print readLine readln toInt toDouble listOf mutableListOf mapOf size forEach map filter fun main val var String Int Double Boolean",
    php: "echo print strlen count strtoupper strtolower str_replace explode implode array_push array_sum number_format round floor ceil isset empty in_array array_keys array_values sort rsort date substr ucfirst trim",
    sql: "SELECT FROM WHERE AND OR NOT ORDER BY GROUP HAVING LIMIT JOIN INNER LEFT ON AS INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE COUNT SUM AVG MIN MAX DISTINCT LIKE IN BETWEEN IS NULL DESC ASC Customers Products Orders CustomerID Name City Phone ProductID Category Price OrderID Quantity OrderDate"
  };
  KNOWN.typescript = KNOWN.react = KNOWN.html = KNOWN.javascript;
  function known(lang, code) { return words(code).concat(String(KNOWN[lang] || "").split(" ")); }
  function splitLines(code) { return String(code).split("\n"); }
  function joinLines(lines) { return lines.join("\n"); }
  /** The code with line n (1-based) replaced. */
  function withLine(code, n, text) { var l = splitLines(code); if (n < 1 || n > l.length) return null; l[n - 1] = text; return joinLines(l); }
  function codeOf(line) { var m = /^(.*?)(\s*(\/\/|#(?![\[!]|include|define)).*)?$/.exec(line); return m ? m : [line, line, ""]; }
  /** Adds text at the end of line n, before any comment. */
  function addAtEnd(code, n, text) {
    var line = splitLines(code)[n - 1];
    if (line == null) return null;
    var cut = /\s*\/\/.*$/.exec(line), body = cut ? line.slice(0, cut.index) : line, rest = cut ? cut[0] : "";
    return withLine(code, n, body.replace(/\s+$/, "") + text + rest);
  }
  function wordRe(w) { return new RegExp("(^|[^\\w$])" + w.replace(/[$.*+?^()[\]{}|\\]/g, "\\$&") + "(?![\\w$])"); }
  /** Replaces one name with another on line n (whole words only, not inside quotes when possible). */
  function renameOnLine(code, n, from, to) {
    var line = splitLines(code)[n - 1];
    if (line == null || !wordRe(from).test(line)) return null;
    return withLine(code, n, line.replace(new RegExp(wordRe(from).source, "g"), function (all, pre) { return pre + to; }));
  }
  function renameAll(code, from, to, flags) {
    var re = new RegExp("(^|[^\\w$])" + from.replace(/[$.*+?^()[\]{}|\\]/g, "\\$&") + "(?![\\w$])", "g" + (flags || ""));
    var next = String(code).replace(re, function (all, pre) { return pre + to; });
    return next === code ? null : next;
  }
  /** Puts a line near the top: after the existing #include / import / using lines. */
  function addTop(code, text, after) {
    var l = splitLines(code), at = 0;
    l.forEach(function (line, i) { if (after.test(line)) at = i + 1; });
    if (l.some(function (x) { return x.trim() === text.trim(); })) return null;
    l.splice(at, 0, text);
    return joinLines(l);
  }
  // The line that is missing a ; (compilers often report the line after it)
  function semiLine(code, n, col, before) {
    var l = splitLines(code), strip = function (s) { return String(s || "").replace(/\/\/.*$/, "").replace(/\s+$/, ""); };
    var cur = strip(l[n - 1]);
    if (cur.trim() && !before && !/[;{},:]$/.test(cur.trim()) && !/^\s*#/.test(cur)) return n;
    if (cur.trim() && col && col > cur.length && !/[;{},:]$/.test(cur.trim()) && !/^\s*#/.test(cur)) return n;
    for (var i = n - 1; i >= 1; i--) {
      var t = strip(l[i - 1]).trim();
      if (!t || /^(#|\/\*|\*|\/\/)/.test(t)) continue;
      if (/[;{},]$/.test(t) || /^(if|for|while|switch)\s*\(.*\)$/.test(t) || /^(else|do|try)$/.test(t)) return 0;
      return i;
    }
    return 0;
  }
  // Characters that look like code but aren't: curly quotes, non-breaking spaces, zero-width characters and
  // full-width brackets (copied from Word, WhatsApp, Google Docs or a web page). They make compilers report
  // strange errors, so the guide can swap them for the real ones.
  var CURLY = /[\u201C\u201D\u201E\u2033\u2018\u2019\u201A\u2032]/;
  var ODD = /[\u00A0\u00AD\u1680\u2000-\u200F\u2028-\u202F\u205F-\u2064\u3000\uFEFF\uFF01-\uFF5E]/;
  function cleanChars(code) {
    var next = String(code).replace(/[\u201C\u201D\u201E\u2033]/g, '"').replace(/[\u2018\u2019\u201A\u2032]/g, "'")
      .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
      .replace(/[\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u2064\uFEFF]/g, "")
      .replace(/[\uFF01-\uFF5E]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); });
    // Dashes and symbols are only changed outside of "text" (they may be meant there)
    next = next.split("\n").map(function (line) {
      return line.replace(/[\u2010-\u2015\u2212\u00D7\u00F7\u2026]/g, function (c, at) {
        var before = line.slice(0, at).replace(/\\./g, "");
        if ((before.match(/"/g) || []).length % 2) return c;
        var n = c.charCodeAt(0);
        return n === 0xD7 ? "*" : n === 0xF7 ? "/" : n === 0x2026 ? "..." : "-";
      });
    }).join("\n");
    return next === code ? null : next;
  }
  var fixQuotes = function (m, x) {
    var c = cleanChars(x.code);
    return c && { label: CURLY.test(x.code) && !ODD.test(x.code) ? "Change the curly quotes “ ” to straight quotes \" \"" : "Replace the odd characters (copied from another program) with normal ones", code: c };
  };
  var fixSemi = function (before) {
    return function (m, x) {
      var n = semiLine(x.code, x.line, x.col, before);
      var c = n && addAtEnd(x.code, n, ";");
      return c && { label: "Add the missing ; at the end of line " + n, code: c, line: n };
    };
  };
  // Python: the line that starts a block (if, for, def…) needs a colon at the end
  var fixColon = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "";
    if (!/^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\b/.test(line) || /:\s*(#.*)?$/.test(line)) return null;
    var c = withLine(x.code, x.line, line.replace(/\s*(#.*)?$/, function (rest, comment) { return ":" + (comment ? "  " + comment : ""); }));
    return c && { label: "Add : at the end of line " + x.line, code: c, line: x.line };
  };
  var indentOf = function (s) { return (/^[ \t]*/.exec(s || "") || [""])[0]; };
  var PY = {
    indentBlock: function (m, x) {
      var l = splitLines(x.code), head = Number((/on line (\d+)/.exec(x.raw) || [])[1]) || 0;
      if (!head) for (var i = x.line - 1; i >= 1; i--) if (/:\s*(#.*)?$/.test(l[i - 1] || "")) { head = i; break; }
      if (!head || !l[x.line - 1] || !l[x.line - 1].trim()) return null;
      var c = withLine(x.code, x.line, indentOf(l[head - 1]).replace(/\t/g, "    ") + "    " + l[x.line - 1].trim());
      return c && { label: "Indent line " + x.line + " by 4 spaces", code: c, line: x.line };
    },
    unindent: function (m, x) {
      var l = splitLines(x.code), prev = "";
      for (var i = x.line - 1; i >= 1; i--) if ((l[i - 1] || "").trim()) { prev = l[i - 1]; break; }
      if (!l[x.line - 1] || /:\s*(#.*)?$/.test(prev)) return null;
      var c = withLine(x.code, x.line, indentOf(prev) + l[x.line - 1].trim());
      return c && { label: "Line up line " + x.line + " with the line above it", code: c, line: x.line };
    },
    dedent: function (m, x) {
      var l = splitLines(x.code), mine = indentOf(l[x.line - 1]).replace(/\t/g, "    ").length, levels = [0];
      for (var i = 0; i < x.line - 1; i++) if ((l[i] || "").trim()) levels.push(indentOf(l[i]).replace(/\t/g, "    ").length);
      var best = levels.filter(function (v) { return v <= mine; }).sort(function (a, b) { return b - a; })[0] || 0;
      var c = withLine(x.code, x.line, new Array(best + 1).join(" ") + (l[x.line - 1] || "").trim());
      return c && { label: "Line up line " + x.line + " with the block it belongs to", code: c, line: x.line };
    },
    tabs: function (m, x) { var c = String(x.code).replace(/\t/g, "    "); return c !== x.code && { label: "Change every tab to 4 spaces", code: c }; },
    equals: function (m, x) {
      var line = splitLines(x.code)[x.line - 1] || "";
      var next = line.replace(/^(\s*(?:if|elif|while)\b[^=]*?[^=!<>:+\-*\/%])=(?!=)/, "$1==");
      return next !== line && { label: "Change = to == on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
    },
    print: function (m, x) {
      var line = splitLines(x.code)[x.line - 1] || "", next = line.replace(/^(\s*)print\s+(?!\()(.*?)\s*(#.*)?$/, function (a, sp, rest, comment) { return sp + "print(" + rest + ")" + (comment ? "  " + comment : ""); });
      return next !== line && { label: "Put brackets after print on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
    }
  };
  /** "Did you mean …?" from the message itself (Python 3.12, GCC, Rust), or the closest name in the code. */
  var fixName = function (pos) {
    return function (m, x) {
      var wrong = m[pos], hint = /Did you mean:? '([^']+)'\??|did you mean '([^']+)'|similar name exists[^\n]*\n[^\n]*?(\w+)\s*$/i.exec(x.block), right = "";
      if (!wrong) return null;
      if (hint) right = hint[1] || hint[2] || "";
      if (/^std::/.test(right)) return null;                           // handled by the "using namespace std" fix
      if (!right) right = closest(wrong, known(x.lang, x.code));
      if (!right || right === wrong) return null;
      var c = x.line ? renameOnLine(x.code, x.line, wrong, right) : null;
      if (!c) c = renameAll(x.code, wrong, right);
      return c && { label: "Change " + wrong + " to " + right + (x.line ? " on line " + x.line : ""), code: c, line: x.line };
    };
  };
  // C and C++: the header a function or type needs
  var HEADERS = { printf: "stdio.h", scanf: "stdio.h", puts: "stdio.h", getchar: "stdio.h", putchar: "stdio.h", fgets: "stdio.h", gets: "stdio.h", malloc: "stdlib.h", free: "stdlib.h", calloc: "stdlib.h",
    rand: "stdlib.h", srand: "stdlib.h", atoi: "stdlib.h", exit: "stdlib.h", abs: "stdlib.h", qsort: "stdlib.h", strlen: "string.h", strcpy: "string.h", strcmp: "string.h", strcat: "string.h", strncpy: "string.h",
    memset: "string.h", sqrt: "math.h", pow: "math.h", fabs: "math.h", floor: "math.h", ceil: "math.h", sin: "math.h", cos: "math.h", round: "math.h", bool: "stdbool.h", "true": "stdbool.h", "false": "stdbool.h",
    time: "time.h", toupper: "ctype.h", tolower: "ctype.h", isdigit: "ctype.h", isalpha: "ctype.h", isspace: "ctype.h" };
  var CPP_HEADERS = { cout: "iostream", cin: "iostream", endl: "iostream", string: "string", vector: "vector", map: "map", set: "set", sort: "algorithm", max: "algorithm", min: "algorithm", swap: "utility",
    setprecision: "iomanip", setw: "iomanip", getline: "string", sqrt: "cmath", pow: "cmath", abs: "cmath" };
  var fixInclude = function (m, x) {
    var h = /include '<([\w.\/]+)>'|#include <([\w.\/]+)>'|defined in header '<([\w.\/]+)>'/.exec(x.block);
    var name = m[1] || m[2] || m[3] || m[4] || "", header = h ? h[1] || h[2] || h[3] : x.lang === "cpp" ? CPP_HEADERS[name] || HEADERS[name] && "c" + HEADERS[name].replace(/\.h$/, "") : HEADERS[name];
    if (!header) return null;
    var c = addTop(x.code, "#include <" + header + ">", /^\s*#\s*include\b/);
    return c && { label: "Add #include <" + header + "> at the top", code: c, line: 1 };
  };
  var fixStd = function (m, x) {
    var name = m[1] || m[2] || "", has = /#\s*include\s*<iostream>/.test(x.code), c = x.code;
    if (!/^(cout|cin|endl|string|vector|getline)$/.test(name)) return null;
    if (!has && /^(cout|cin|endl)$/.test(name)) c = addTop(c, "#include <iostream>", /^\s*#\s*include\b/) || c;
    if (!/using\s+namespace\s+std\s*;/.test(c)) c = addTop(c, "using namespace std;", /^\s*#\s*include\b|^\s*using\b/) || c;
    return c !== x.code && { label: (has ? "" : "Add #include <iostream> and ") + "using namespace std;", code: c, line: 1 };
  };
  var JAVA_UTIL = /^(Scanner|ArrayList|List|HashMap|Map|Arrays|Random|HashSet|Set|LinkedList|Collections|Iterator|Queue|Stack|Deque|ArrayDeque|TreeMap|TreeSet|LinkedHashMap)$/;
  var fixJavaSymbol = function (m, x) {
    var kind = m[1], name = m[2];
    if (kind === "class" && JAVA_UTIL.test(name)) {
      var c = addTop(x.code, "import java.util." + name + ";", /^\s*(package|import)\b/);
      return c && { label: "Add import java.util." + name + "; at the top", code: c, line: 1 };
    }
    if (kind === "class" && /^(string|integer|system|scanner|math)$/.test(name)) {
      var right = name.charAt(0).toUpperCase() + name.slice(1);
      var c2 = x.line ? renameOnLine(x.code, x.line, name, right) : renameAll(x.code, name, right);
      return c2 && { label: "Change " + name + " to " + right + " (Java is case-sensitive)", code: c2, line: x.line };
    }
    return fixName(2)(m, x);
  };
  // A ' quoted word in Java, C, C++ or Go (they use ' only for one character): make it a "string"
  var fixCharQuotes = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "", next = line.replace(/'([^'\\\n]{2,})'/g, '"$1"');
    return next !== line && { label: "Use double quotes \" \" for text on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
  };
  // Rust prints the corrected line under "help:"; use it
  var fixRustHelp = function (m, x) {
    var re = /help:[^\n]*\n(?:[^\n]*-->[^\n]*\n)?(?:\s*\|\s*\n)?\s*(\d+)\s*\|\s?([^\n]*)\n\s*\|\s*[+~\-^]+/, h = re.exec(x.block) || re.exec(x.raw);
    if (!h) return null;
    var n = Number(h[1]), now = splitLines(x.code)[n - 1];
    if (now == null || now === h[2] || now.trim() === h[2].trim()) return null;
    return { label: "Use the compiler's suggestion for line " + n + ": " + h[2].trim(), code: withLine(x.code, n, h[2]), line: n };
  };
  var fixConstToLet = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "", v = /([A-Za-z_$][\w$]*)\s*(?:[-+*\/%]?=(?!=)|\+\+|--)/.exec(line);
    if (!v) return null;
    var re = new RegExp("\\bconst(\\s+" + v[1] + "\\b)"), c = String(x.code).replace(re, "let$1");
    return c !== x.code && { label: "Declare " + v[1] + " with let instead of const", code: c };
  };
  var fixValToVar = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "", v = /([A-Za-z_]\w*)\s*(?:[-+*\/%]?=(?!=)|\+\+|--)/.exec(line);
    if (!v) return null;
    var c = String(x.code).replace(new RegExp("\\bval(\\s+" + v[1] + "\\b)"), "var$1");
    return c !== x.code && { label: "Declare " + v[1] + " with var instead of val", code: c };
  };
  var fixGoImport = function (m, x) {
    var l = splitLines(x.code), i = l.findIndex(function (s) { return new RegExp('^\\s*(import\\s+)?"' + m[1].replace(/[.\/]/g, "\\$&") + '"\\s*$').test(s); });
    if (i < 0) return null;
    l.splice(i, 1);
    return { label: "Remove the unused import \"" + m[1] + "\"", code: joinLines(l), line: i + 1 };
  };
  var fixGoExported = function (m, x) {
    var right = m[2].charAt(0).toUpperCase() + m[2].slice(1);
    var c = x.line ? renameOnLine(x.code, x.line, m[1] + "." + m[2], m[1] + "." + right) : null;
    if (!c) c = String(x.code).replace(new RegExp("\\b" + m[1] + "\\." + m[2] + "\\b", "g"), m[1] + "." + right);
    return c && c !== x.code && { label: "Change " + m[1] + "." + m[2] + " to " + m[1] + "." + right, code: c, line: x.line };
  };
  var fixGoShort = function (m, x) {
    var l = splitLines(x.code), name = m[1];
    var i = l.findIndex(function (s) { return new RegExp("^\\s*" + name + "\\s*=(?!=)").test(s); });
    if (i < 0) return fixName(1)(m, x);
    l[i] = l[i].replace(new RegExp("^(\\s*" + name + "\\s*)=(?!=)"), "$1:=");
    return { label: "Create " + name + " with := on line " + (i + 1), code: joinLines(l), line: i + 1 };
  };
  var fixGoBrace = function (m, x) {
    var l = splitLines(x.code), n = x.line;
    if (!/^\s*\{\s*$/.test(l[n - 1] || "") || n < 2) return null;
    l[n - 2] = l[n - 2].replace(/\s+$/, "") + " {";
    l.splice(n - 1, 1);
    return { label: "Move { to the end of line " + (n - 1), code: joinLines(l), line: n - 1 };
  };
  var fixPublicClass = function (m, x) {
    var c = String(x.code).replace(new RegExp("\\bpublic\\s+(class\\s+" + m[1] + "\\b)"), "$1");
    return c !== x.code && { label: "Remove public before class " + m[1], code: c };
  };
  var fixScanfAmp = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "", next = line.replace(/(scanf\s*\(\s*"[^"]*"\s*,)([^;]*)\)/, function (a, head, args) {
      return head + args.split(",").map(function (s) { var t = s.trim(); return /^[A-Za-z_]\w*$/.test(t) ? s.replace(t, "&" + t) : s; }).join(",") + ")";
    });
    return next !== line && { label: "Add & before the variables in scanf on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
  };
  var fixIfAssign = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "", next = line.replace(/(\b(?:if|while)\s*\([^=()]*?[^=!<>+\-*\/%&|^])=(?!=)/, "$1==");
    return next !== line && { label: "Change = to == on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
  };
  var fixPhpTag = function (m, x) { return /^\s*<\?php/.test(x.code) ? null : { label: "Add <?php at the top", code: "<?php\n" + x.code, line: 1 }; };
  var fixSqlName = function (m, x) {
    var right = closest(m[1], KNOWN.sql.split(" "));
    var c = right && renameAll(x.code, m[1], right, "i");
    return c && { label: "Change " + m[1] + " to " + right, code: c };
  };
  var fixSqlKeyword = function (m, x) {
    var word = m[1];
    if (!/^[A-Za-z]+$/.test(word)) return null;
    var right = closest(word.toUpperCase(), "SELECT FROM WHERE ORDER GROUP HAVING LIMIT JOIN INSERT INTO VALUES UPDATE DELETE CREATE TABLE DISTINCT BETWEEN".split(" "));
    var c = right && right !== word.toUpperCase() && renameAll(x.code, word, right, "i");
    return c && { label: "Change " + word + " to " + right, code: c };
  };
  var fixPyQuote = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "", name = m[1];
    var next = line.replace(new RegExp("((?:print|input)\\(\\s*)" + name + "(\\s*\\))"), '$1"' + name + '"$2');
    return next !== line && { label: "Put quotes around " + name + " (it's text)", code: withLine(x.code, x.line, next), line: x.line };
  };

  // NameError: a misspelt name, or text that is missing its quotes (print(hello))
  var nameOrQuote = function (m, x) {
    var rename = fixName(1)(m, x), quote = fixPyQuote(m, x);
    if (!rename || !quote) return rename || quote;
    var hint = (/Did you mean:? '([^']+)'/.exec(x.block) || [])[1];
    return words(x.code).indexOf(hint) >= 0 ? [rename, quote] : [quote, rename];
  };
  // Text + number: an answer from input() is text, so turn it into a number; otherwise make the number text
  // A value that is text but used as a number: from input() (turn the answer into a number) or a number in quotes
  var fixPyNumber = function (m, x) {
    var l = splitLines(x.code), names = words(l[x.line - 1] || "");
    for (var i = 0; i < x.line - 1; i++) {
      var a = /^(\s*)([A-Za-z_]\w*)\s*=\s*input\((.*)\)\s*(#.*)?$/.exec(l[i] || "");
      if (a && names.indexOf(a[2]) >= 0) {
        var conv = /float|\.\d/.test(x.code) ? "float" : "int";
        l[i] = a[1] + a[2] + " = " + conv + "(input(" + a[3] + "))" + (a[4] ? "  " + a[4] : "");
        return { label: "Turn the answer into a number: " + conv + "(input(…)) on line " + (i + 1), code: joinLines(l), line: i + 1 };
      }
    }
    var quoted = names.filter(function (n) { return l.slice(0, x.line - 1).some(function (s) { return new RegExp("^\\s*" + n + "\\s*=\\s*([\"'])-?\\d+(\\.\\d+)?\\1\\s*(#.*)?$").test(s); }); });
    if (!quoted.length) return null;
    var line = l[x.line - 1], next = line;
    quoted.forEach(function (n) { next = next.replace(new RegExp("(^|[^\\w.(])" + n + "(?![\\w(])", "g"), function (all, pre) { return pre + (/\./.test(x.code) ? "float(" : "int(") + n + ")"; }); });
    return next !== line && { label: "Turn " + quoted.join(" and ") + " into numbers on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
  };
  var fixPyConcat = function (m, x) {
    var l = splitLines(x.code), line = l[x.line - 1] || "", names = words(line), fixes = [];
    for (var i = 0; i < x.line - 1; i++) {
      var a = /^(\s*)([A-Za-z_]\w*)\s*=\s*input\(/.exec(l[i] || "");
      if (a && names.indexOf(a[2]) >= 0 && !/\b(int|float)\(\s*input\(/.test(l[i])) {
        var conv = /float|\.\d/.test(x.code) ? "float" : "int";
        l[i] = l[i].replace(/=\s*input\((.*)\)\s*$/, "= " + conv + "(input($1))");
        if (l[i] !== splitLines(x.code)[i]) return { label: "Turn the answer into a number: " + conv + "(input(…)) on line " + (i + 1), code: joinLines(l), line: i + 1 };
      }
    }
    var next = line.replace(/((["'])(?:\\.|(?!\2).)*\2\s*\+\s*)([A-Za-z_]\w*)\b(?!\s*[(.\[])/g, "$1str($3)")
      .replace(/(^|[=(,]\s*|\+\s*)([A-Za-z_]\w*)\b(?!\s*[(.\[])(\s*\+\s*["'])/g, function (all, pre, name, rest) { return /^(str|int|float|print|input|len)$/.test(name) ? all : pre + "str(" + name + ")" + rest; });
    return next !== line && { label: "Turn the number into text with str() on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
  };
  var fixPhpVar = function (m, x) {
    var vars = (String(x.code).match(/\$[A-Za-z_]\w*/g) || []).map(function (v) { return v.slice(1); });
    var right = closest(m[1], vars.filter(function (v) { return v !== m[1]; }));
    if (!right) return null;
    var c = String(x.code).split("$" + m[1]).join("$" + right);
    return c !== x.code && { label: "Change $" + m[1] + " to $" + right, code: c };
  };
  var cFix = function (m, x) { return fixStd(m, x) || fixInclude(m, x) || fixName(1)(m, x); };
  var fixAfterClass = function (m, x) {
    var line = splitLines(x.code)[x.line - 1] || "";
    return /\}\s*$/.test(line) ? { label: "Add ; after the } on line " + x.line, code: withLine(x.code, x.line, line.replace(/\}\s*$/, "};")), line: x.line } : null;
  };
  // A missing closing quote: on a #define, or before the ) of a call such as printf("Hi\n);
  var fixCloseQuote = function (m, x) {
    var line = splitLines(x.code)[x.line - 1];
    if (line == null || ((line.replace(/\\./g, "").match(/"/g) || []).length % 2) === 0) return null;
    var next = line.replace(/^(\s*#\s*define\s+\w+(?:\([^)]*\))?\s+"[^"]*?)(\s*(?:\/\/.*)?)$/, "$1\"$2");
    if (next === line) next = line.replace(/^(.*?"(?:[^"\\]|\\.)*?)(\)+\s*;?\s*(?:\/\/.*)?)$/, "$1\"$2");
    return next !== line && { label: "Add the closing \" on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
  };
  var fixCloseBrace = function (m, x) { return { label: "Add the missing } at the end", code: String(x.code).replace(/\s*$/, "") + "\n}\n" }; };
  var fixArrows = function (from, to) {
    return function (m, x) {
      var line = splitLines(x.code)[x.line - 1] || "", next = line.replace(new RegExp("\\b(" + (from === "<<" ? "cin" : "cout") + "\\s*)" + from.replace(/</g, "\\<").replace(/>/g, "\\>"), "g"), "$1" + to);
      next = next.replace(new RegExp(from.replace(/</g, "\\<").replace(/>/g, "\\>"), "g"), to);
      return next !== line && { label: "Use " + to + " with " + (to === ">>" ? "cin" : "cout") + " on line " + x.line, code: withLine(x.code, x.line, next), line: x.line };
    };
  };
  var fixCsUsing = function (m, x) {
    var ns = /^(List|Dictionary|HashSet|Queue|Stack|LinkedList)$/.test(m[1]) ? "System.Collections.Generic" : /^(StringBuilder)$/.test(m[1]) ? "System.Text" : "";
    var c = ns && addTop(x.code, "using " + ns + ";", /^\s*using\b/);
    return c && { label: "Add using " + ns + "; at the top", code: c, line: 1 };
  };
  var fixRename = function (from, to) { return function (m, x) { var c = x.line ? renameOnLine(x.code, x.line, from, to) : renameAll(x.code, from, to); return c && { label: "Change " + from + " to " + to, code: c, line: x.line }; }; };
  var INPUT_HELP = "Type what your program should read in the Input box under the editor (one value per line), then tap Run again.";

  // [languages ("*" = all), pattern, title, why, fix, example, quick fix]
  // In title/why/fix, $1, $2… are replaced with the matching parts of the error.
  var RULES = [
    // ----- stopped / too long (all) -----
    ["*", /ran for more than|took too long|was stopped|^timeout$/i, "Your code never finished",
      "A loop kept running without end, so it was stopped.", "Check the loop's condition changes each time round, e.g. i increases until the condition becomes false. Also check while (true) loops have a break.",
      "let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;   // without this, i stays 0 forever\n}"],
    ["*", /[“”‘’]|stray '\\\d+' in program|illegal character: '\\u[0-9a-f]{4}'|invalid character '.'|invalid non-printable character|Unexpected character|illegal character|\\U0000[0-9a-f]{4}/i, "A character the computer can't read",
      "Your code has a character that looks normal but isn't: often a curly quote “ ” (or a non-breaking space) copied from Word, WhatsApp or a website. Code only understands straight quotes \" and ' and normal spaces.", "Tap the fix button to replace them, or retype that line by hand.", "", fixQuotes],

    // ----- Python -----
    ["python", /IndentationError: expected an indented block/i, "Missing indentation",
      "After a line ending with : (if, for, while, def, class) the next lines must be indented.", "Indent the lines inside the block by 4 spaces.",
      "if marks >= 50:\n    print(\"Pass\")   # 4 spaces", PY.indentBlock],
    ["python", /IndentationError: unexpected indent/i, "Unexpected indentation",
      "This line has spaces at the start but it isn't inside a block.", "Remove the extra spaces so it lines up with the lines around it.", "", PY.unindent],
    ["python", /IndentationError: unindent does not match any outer indentation level/i, "Indentation doesn't line up",
      "This line's spaces don't match any block above it.", "Line it up exactly with the block it belongs to (use 4 spaces per level).", "", PY.dedent],
    ["python", /TabError/i, "Tabs and spaces are mixed",
      "Some lines are indented with tabs and others with spaces.", "Use 4 spaces for each level, never tabs.", "", PY.tabs],
    ["python", /IndentationError/i, "Indentation doesn't line up",
      "Python uses indentation to know which lines belong together.", "Use exactly 4 spaces for each level and don't mix tabs and spaces."],
    ["python", /SyntaxError: expected ':'/i, "Missing colon",
      "Lines that start a block (if, elif, else, for, while, def, class) must end with a colon.", "Add : at the end of the line.", "for name in names:\n    print(name)", fixColon],
    ["python", /SyntaxError: (?:'\(' was never closed|unexpected EOF|EOF while parsing)/i, "A bracket was opened but not closed",
      "Python reached the end of your code while a ( [ or { was still open.", "Count your brackets on that line (and the lines above) and add the missing ) ] or }."],
    ["python", /SyntaxError: unterminated string literal/i, "A text (string) isn't closed",
      "Text in quotes must start and end with the same quote mark.", "Add the missing \" or ' at the end of the text.", "print(\"Habari\")"],
    ["python", /SyntaxError: invalid syntax\. Perhaps you forgot a comma/i, "Missing comma",
      "Items in a list, a function call or a dictionary must be separated by commas.", "Add a comma between the items.", "prices = [120, 450, 80]"],
    ["python", /SyntaxError: invalid syntax\. Maybe you meant '==' or ':=' instead of '='/i, "Use == to compare",
      "A single = stores a value; == checks whether two values are equal.", "Change = to == inside if and while conditions.", "if town == \"Nakuru\":", PY.equals],
    ["python", /SyntaxError: Missing parentheses in call to 'print'/i, "print needs brackets",
      "In Python 3, print is a function.", "Write print(\"text\") with brackets.", "print(\"Habari\")", PY.print],
    ["python", /SyntaxError: invalid decimal literal/i, "A name can't start with a number",
      "Python read a number joined to letters (like 2nd_place or 10kg).", "Start variable names with a letter, e.g. second_place, or put text in quotes."],
    ["python", /SyntaxError/i, "Syntax error",
      "Python couldn't understand this line: something is misspelt, missing or extra.", "Check the line for missing colons, brackets or quotes, and for typos in keywords (e.g. esle instead of else)."],
    ["python", /NameError: name '([^']+)' is not defined/i, "\"$1\" doesn't exist yet",
      "Python doesn't know anything called $1. It may be misspelt, used before it's created, or text that is missing quotes.", "Check the spelling (Python is case-sensitive), create $1 before using it, or put quotes around it if it's meant to be text.",
      "name = \"Amina\"\nprint(name)", nameOrQuote],
    ["python", /TypeError: can only concatenate str \(not "(\w+)"\) to str/i, "You can't join text and a number with +",
      "You tried to add a $1 to text. (Remember: input() always gives text, even when someone types a number.)", "Convert the number with str(), use an f-string, or turn input into a number with int(input()).", "print(\"Total: \" + str(total))\nprint(f\"Total: {total}\")\nage = int(input(\"Age? \"))", fixPyConcat],
    ["python", /TypeError: unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/i, "These values can't be combined",
      "You used $1 with a $2 and a $3. Remember: input() always gives text, even when the learner types a number.", "Convert them to the same type first, e.g. int(\"5\") turns text into a number.", "age = int(input(\"Age? \"))\nprint(age + 1)", fixPyConcat],
    ["python", /TypeError: can't multiply sequence by non-int of type '(\w+)'/i, "Text can't be multiplied like a number",
      "One of the values is text (a str), for example a number in quotes or an answer from input(), so * repeats the text instead of multiplying.", "Turn the text into a number first with int() (or float() for decimals).", "qty = int(\"4\")\nprice = int(input(\"Price? \"))\nprint(qty * price)", fixPyNumber],
    ["python", /TypeError: '([<>]=?)' not supported between instances of '(\w+)' and '(\w+)'/i, "A $2 and a $3 can't be compared with $1",
      "You compared text with a number. Remember: input() always gives text.", "Turn the text into a number first, e.g. age = int(input(\"Age? \")).", "age = int(input(\"Age? \"))\nif age >= 18:\n    print(\"Adult\")", fixPyNumber],
    ["python", /TypeError: 'str' object cannot be interpreted as an integer/i, "range() needs a whole number",
      "You gave range() text (for example an answer from input()).", "Turn it into a number first: n = int(input(\"How many? \")).", "n = int(input(\"How many? \"))\nfor i in range(n):\n    print(i)", fixPyNumber],
    ["python", /TypeError: '(\w+)' object is not iterable/i, "A $1 can't be looped over",
      "for … in needs a list, text or range, not a single $1.", "To repeat a number of times, use range(): for i in range(5):", "for i in range(5):\n    print(i)"],
    ["python", /TypeError: list indices must be integers or slices, not (\w+)/i, "A list position must be a whole number",
      "You used a $1 as a position in a list.", "Use a whole number (int(...) if it comes from input()), or use a dictionary for named keys."],
    ["python", /TypeError: 'NoneType' object is not subscriptable|'NoneType' object has no attribute/i, "Using a value that is None",
      "The variable holds None (nothing). Often a function didn't return anything, or a method like .sort() changed the list and returned None.", "Check the function has a return, and don't assign the result of list.sort() (use sorted() instead)."],
    ["python", /TypeError: object of type '(\w+)' has no len\(\)/i, "A $1 has no length",
      "len() works on text, lists and dictionaries, not a $1.", "To count digits, turn the number into text first: len(str(n))."],
    ["python", /TypeError: '(\w+)' object is not callable/i, "Something isn't a function",
      "You put ( ) after a $1, as if it were a function.", "Remove the brackets, or check you didn't reuse a function's name (like list or str) as a variable."],
    ["python", /TypeError: (\w+)\(\) (?:takes|missing) .*/i, "Wrong number of values passed to $1()",
      "The function $1 was called with more or fewer values than it expects.", "Compare the call with the def line and pass exactly the values it asks for."],
    ["python", /ZeroDivisionError/i, "Division by zero",
      "You divided by 0, which has no answer.", "Check the number isn't 0 before dividing.", "if count != 0:\n    average = total / count"],
    ["python", /IndexError: (?:list|string|tuple) index out of range/i, "That position doesn't exist",
      "You asked for an item past the end. Positions start at 0, so a list of 3 items has positions 0, 1 and 2.", "Use a smaller index, check len() first, or loop with for item in items.", "items = [\"a\", \"b\", \"c\"]\nprint(items[2])   # last item\nprint(items[-1])  # also the last item"],
    ["python", /KeyError: (.+)/i, "Key $1 isn't in the dictionary",
      "The dictionary has no entry called $1.", "Check the spelling, or use .get() with a default.", "price = prices.get(\"sugar\", 0)"],
    ["python", /ValueError: invalid literal for int\(\) with base 10: '([^']*)'/i, "\"$1\" isn't a whole number",
      "int() can only convert text that contains a whole number.", "Make sure the text is a number, use float() for decimals, or check it with .isdigit() first.", "text = input(\"Age? \")\nif text.isdigit():\n    age = int(text)"],
    ["python", /ValueError: could not convert string to float: '([^']*)'/i, "\"$1\" isn't a number",
      "float() can only convert text that contains a number.", "Type a number (like 12.5), or check the text before converting it."],
    ["python", /AttributeError: '(\w+)' object has no attribute '(\w+)'/i, "A $1 has no \"$2\"",
      "You used .$2 on a $1, which doesn't have it.", "Check the spelling and the type of the value (print(type(x)) shows it). For example, lists use .append(), text uses .upper().", "", fixName(2)],
    ["python", /ModuleNotFoundError: No module named '([^']+)'/i, "Module \"$1\" isn't available here",
      "The in-browser Python has the standard library (math, random, datetime, json…), but not extra packages like $1.", "Check the spelling, or try the code on your own computer after pip install $1."],
    ["python", /UnboundLocalError/i, "Variable used before it was given a value",
      "Inside a function, a variable was read before being set.", "Give it a value first, or pass it into the function as a parameter."],
    ["python", /RecursionError/i, "Too many nested calls",
      "A function kept calling itself and never reached a stopping point.", "Add a base case (an if that returns without calling itself again)."],
    ["python", /EOFError/i, "Your program wanted more input",
      "input() was called after the input ended.", "Run again and answer every question, or check the program doesn't ask more often than you expect."],

    // ----- JavaScript / TypeScript / React / HTML scripts -----
    ["javascript typescript react html", /(\w+) is not defined/i, "\"$1\" doesn't exist",
      "JavaScript doesn't know anything called $1. It may be misspelt, used before it's declared, or text missing its quotes.", "Check the spelling (case matters), declare it with let or const first, or put quotes around text.",
      "const town = \"Kisumu\";\nconsole.log(town);", fixName(1)],
    ["javascript typescript react html", /Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '([^']+)'\))?/i, "Using something that is $1",
      "You tried to read .$2 from a value that is $1 (it has nothing in it).", "Check the variable was given a value, that an element with that id exists, or use ?. to read safely.", "const box = document.getElementById(\"title\");\nif (box) box.textContent = \"Hi\";\n// or: user?.name"],
    ["javascript typescript react html", /(\S+) is not a function/i, "$1 isn't a function",
      "You called $1 with ( ) but it isn't a function.", "Check the spelling (e.g. forEach, toUpperCase), and that the value is the type you expect (arrays have .map, text has .toUpperCase)."],
    ["javascript typescript react html", /Assignment to constant variable/i, "A const can't be changed",
      "You tried to change a variable declared with const.", "Use let for values that change.", "let total = 0;\ntotal = total + 5;", fixConstToLet],
    ["javascript typescript react html", /Unexpected end of input/i, "Something isn't closed",
      "The code ended while a { ( [ or a quote was still open.", "Add the missing } ) ] or closing quote. Matching brackets are highlighted when you click next to one."],
    ["javascript typescript react html", /missing \) after argument list/i, "Missing )",
      "A function call is missing its closing bracket, or two values are missing a comma or + between them.", "Close the bracket, and join text and values with + or a template string.", "console.log(\"Total: \" + total);\nconsole.log(`Total: ${total}`);"],
    ["javascript typescript react html", /Invalid or unexpected token|Unterminated string/i, "Unclosed text or a stray character",
      "A string isn't closed, or there's a character JavaScript can't read (like a curly quote copied from Word).", "Close the string with the same quote you opened it with, and retype any “ ” quotes as \" \".", "", fixQuotes],
    ["javascript typescript react html", /Unexpected token '?([^'\s]+)'?/i, "Unexpected \"$1\"",
      "JavaScript didn't expect $1 at this point.", "Look just before it for a missing comma, bracket, or operator, or an extra one."],
    ["javascript typescript react html", /has already been declared/i, "Declared twice",
      "The same name was declared twice with let or const.", "Remove the second let/const and just assign: name = newValue."],
    ["javascript typescript react html", /Maximum call stack size exceeded/i, "A function never stops calling itself",
      "Recursion without an ending condition.", "Add a base case that returns without calling the function again."],
    ["react", /Objects are not valid as a React child/i, "Can't show an object directly",
      "React can show text and numbers, not whole objects.", "Show one field (e.g. {user.name}) or convert it: {JSON.stringify(user)}."],
    ["react", /JSX|Unterminated JSX|Expected corresponding JSX closing tag/i, "JSX tag problem",
      "Each JSX tag must be closed, and a component must return one parent element.", "Close tags like <img /> and <br />, and wrap siblings in <div> or <>…</>."],

    // ----- SQL -----
    ["sql", /no such table: (\w+)/i, "Table \"$1\" doesn't exist",
      "The sample database has Customers, Products and Orders.", "Check the spelling of the table name.", "SELECT * FROM Customers;", fixSqlName],
    ["sql", /no such column: (?:\w+\.)?(\w+)/i, "Column \"$1\" doesn't exist",
      "That column isn't in the table (or the table alias is wrong).", "Run SELECT * FROM TableName LIMIT 1; to see the real column names, then fix the spelling.", "", fixSqlName],
    ["sql", /ambiguous column name: (\w+)/i, "\"$1\" is in more than one table",
      "When you JOIN tables, a column name that appears in both must say which table it's from.", "Write Table.$1 or alias.$1.", "SELECT c.Name, p.Name FROM Orders o JOIN Customers c ON c.CustomerID = o.CustomerID JOIN Products p ON p.ProductID = o.ProductID;"],
    ["sql", /near "([^"]+)": syntax error/i, "SQL syntax error near \"$1\"",
      "Something just before or at $1 is misspelt, missing or in the wrong order.", "Check the order SELECT … FROM … WHERE … GROUP BY … ORDER BY …, commas between columns, and quotes around text.", "SELECT Name, City FROM Customers WHERE City = 'Nairobi' ORDER BY Name;", fixSqlKeyword],
    ["sql", /incomplete input/i, "The statement isn't finished",
      "SQL reached the end while expecting more (like a closing bracket or quote).", "Close any ( or ' and end the statement with ;"],

    // ----- PHP -----
    ["php", /syntax error, unexpected (?:token )?"?([^",]+)"?,? expecting[^\n]*";"/i, "Missing semicolon",
      "PHP found $1 when it expected the previous statement to end with ;", "Add ; at the end of the line before this one.", "<?php\necho \"Habari\";\necho \"Kenya\";", fixSemi(true)],
    ["php", /syntax error, unexpected end of file/i, "Something isn't closed",
      "PHP reached the end of the code while a { ( or quote was still open.", "Add the missing } ) or closing quote."],
    ["php", /syntax error, unexpected (?:token )?"?([^"\s]+)"?/i, "Unexpected \"$1\"",
      "PHP didn't expect $1 here. Most often the line before it is missing its ; at the end.", "Check the line before for a missing ; ) or }, or a missing $ in front of a variable.", "", fixSemi(true)],
    ["php", /Undefined variable \$(\w+)/i, "$$1 has no value yet",
      "The variable $$1 is used before it was given a value.", "Set it first (and check the spelling: PHP variable names are case-sensitive).", "<?php\n$total = 0;\n$total += 180;", fixPhpVar],
    ["php", /Call to undefined function (\w+)\(\)/i, "Function $1() doesn't exist",
      "PHP has no function called $1.", "Check the spelling, or define it with function $1() { … } before calling it.", "", fixName(1)],
    ["php", /Division by zero/i, "Division by zero",
      "You divided by 0.", "Check the divisor isn't 0 first: if ($count != 0) { … }"],
    ["php", /Array to string conversion/i, "Printing a whole array",
      "echo can't print an array directly.", "Use print_r($arr), implode(\", \", $arr), or loop with foreach."],
    ["php", /Undefined (?:array key|index) "?([^"]+)"?/i, "Key \"$1\" isn't in the array",
      "The array has no entry called $1.", "Check the spelling, or use $arr[\"$1\"] ?? \"default\"."],

    // ----- C and C++: compile errors -----
    ["c cpp", /expected ';' after (?:class|struct) definition/i, "Missing ; after }",
      "A class or struct definition ends with }; (a semicolon after the brace).", "Add ; after the closing }.", "struct Point {\n    int x, y;\n};", fixAfterClass],
    ["c cpp", /expected (?:',' or )?';'|comma expected|';' expected/i, "Missing semicolon",
      "In C and C++ every statement ends with ;", "Add ; at the end of the statement (often the line above the one reported).", "printf(\"Hello\\n\");\nint total = 0;", fixSemi(true)],
    ["c cpp", /implicit declaration of function '(\w+)'; did you mean '(\w+)'/i, "\"$1\" is misspelt",
      "There's no function called $1. The compiler thinks you meant $2.", "Fix the spelling.", "", fixName(1)],
    ["c cpp", /implicit declaration of function '(\w+)'/i, "$1() needs its #include line",
      "The compiler doesn't know $1() because the library it belongs to isn't included.", "Add the right #include at the top (stdio.h for printf and scanf, string.h for strlen and strcpy, math.h for sqrt and pow, stdlib.h for malloc and rand).", "#include <stdio.h>", fixInclude],
    ["c cpp", /'(\w+)' was not declared in this scope|use of undeclared identifier '(\w+)'|'(\w+)' undeclared|unknown type name '(\w+)'|'(\w+)' is undefined|undeclared identifier/i, "\"$1\" isn't declared",
      "The compiler doesn't know $1. It may be misspelt, declared later, or its library isn't included.", "Check the spelling, declare variables before using them, and add the right #include (stdio.h for printf, iostream for cout, string.h for strcpy, math.h for sqrt). In C++, cout, cin and string also need using namespace std; (or std:: in front).", "", cFix],
    ["c cpp", /cannot find library: (\w+)|fatal error: ([\w.\/]+): No such file/i, "Library not available",
      "The #include file isn't available.", "Check the spelling of the #include line (e.g. <iostream>, <stdio.h>)."],
    ["c cpp", /missing terminating (["']) character/i, "A text or character isn't closed",
      "A string must start and end with \" on the same line (a single character uses '). One missing quote makes the compiler report many strange errors further down.", "Add the closing $1, then run again: the other errors usually disappear.", "#define FILE_NAME \"students.dat\"\nprintf(\"Hello\\n\");", fixCloseQuote],
    ["c cpp", /expected '\{' before '?(\S+?)'?$/im, "A { is missing before \"$1\"",
      "The compiler expected the start of a block, {, just before $1. Usually the line above is missing its {, or has something extra (a ; after the ) of a function, if or for).", "Look at the line above $1: add the missing {, remove a stray ;, or fix a typo there. If that line already has a { and the error stays, retype the line by hand (a symbol copied from another program can look like { without being one), and check any quote or bracket you closed earlier.", "void greet() {\n    printf(\"Habari\\n\");\n}"],
    ["c cpp", /two or more data types in declaration specifiers/i, "Two types in one declaration",
      "The compiler thinks this line starts a second type inside the same declaration. That usually means something just before it is wrong: a missing ; or } above, or a struct, enum or typedef whose { } isn't written correctly.", "Check the line(s) above for a missing ; or }, then run again: this error often disappears with the first one.", "typedef struct {\n    int id;\n    char name[50];\n} Student;"],
    ["c cpp", /expected identifier or '\(' before '?(\S+?)'?( token)?$/im, "Something is out of place before \"$1\"",
      "A name or ( was expected here. This usually follows an earlier mistake: a missing ; or }, a { that was never opened, or a stray character.", "Fix the first error in the list, then run again: the others often go away."],
    ["c cpp", /expected declaration or statement at end of input|expected '\}' at end of input/i, "Missing }",
      "A { was opened but never closed, so the compiler reached the end of your code.", "Add the missing } (each { needs a matching }).", "", fixCloseBrace],
    ["c cpp", /expected '\)'|expected '\}'|expected '\]'/i, "A bracket isn't closed",
      "A ( { or [ was opened but not closed.", "Add the missing closing bracket. Each { needs a matching }."],
    ["c", /assignment to expression with array type/i, "Text can't be stored with =",
      "In C, an array of characters can't be given new text with =.", "Use strcpy (and #include <string.h>), or set it when you declare it.", "#include <string.h>\nchar name[20];\nstrcpy(name, \"Amina\");"],
    ["cpp", /no match for 'operator<<' \(operand types are 'std::(?:basic_)?istream/i, "cin reads with >>",
      "cin takes values in with >> (cout sends them out with <<).", "Change << to >> after cin.", "int n;\ncin >> n;", fixArrows("<<", ">>")],
    ["cpp", /no match for 'operator>>' \(operand types are 'std::(?:basic_)?ostream/i, "cout prints with <<",
      "cout sends values out with << (cin reads with >>).", "Change >> to << after cout.", "cout << \"Total: \" << total << endl;", fixArrows(">>", "<<")],
    ["cpp", /no match for 'operator<<'/i, "cout can't print this value",
      "cout << doesn't know how to print that type (for example a whole array or a struct).", "Print its parts one by one, or loop over the array."],
    ["c cpp", /format '%(\w+)' expects/i, "printf format doesn't match the value",
      "The %-code doesn't match the value's type.", "Use %d for int, %f for float/double, %c for char, %s for text (and & before variables in scanf)."],
    ["c", /can't assign .* from array initializer/i, "Struct set-up isn't supported here",
      "The quick in-browser C can't fill a struct with { } at once.", "Set each field on its own line, using strcpy for text.", "struct Student s;\nstrcpy(s.name, \"Kiprop\");\ns.marks = 78;"],
    ["c cpp", /undefined reference to `(\w+)'/i, "$1 is used but never written",
      "The compiler found a call to $1, but no function with that name exists (often a misspelling, or main is missing).", "Check the spelling of the function name, and that it's defined.", "", fixName(1)],
    // ----- C and C++: when the program runs -----
    ["c cpp", /SIGSEGV|Segmentation fault|exit code 139/i, "Your program crashed (segmentation fault)",
      "It used memory it isn't allowed to: usually an array position past the end, a pointer that is NULL, or scanf without & before a variable.", "Check array positions stay below the size, and write scanf(\"%d\", &n) with & before each variable.", "int marks[5];\nfor (int i = 0; i < 5; i++)   // < 5, not <= 5\n    marks[i] = 0;\nscanf(\"%d\", &n);"],
    ["c cpp", /SIGFPE|Floating point exception|exit code 136/i, "Division by zero",
      "Whole numbers (int) were divided by 0, which stops the program.", "Check the number isn't 0 before dividing.", "if (count != 0)\n    average = total / count;"],
    ["c cpp", /SIGABRT|exit code 134|terminate called/i, "Your program stopped itself (abort)",
      "Something went badly wrong, e.g. an exception nobody caught, an index past the end of a vector (.at()), or memory freed twice.", "Read the message above it for the cause."],

    // ----- Java -----
    ["java", /cannot find symbol[\s\S]*?symbol:\s*(variable|method|class) (\w+)/i, "\"$2\" can't be found",
      "Java doesn't know $2: it may be misspelt, not declared, or its import is missing.", "Check the spelling (Java is case-sensitive: String, System, Scanner), declare the variable with its type, or add the import (e.g. import java.util.Scanner;).", "", fixJavaSymbol],
    ["java", /package system does not exist/i, "Write System with a capital S",
      "Java is case-sensitive: system isn't the same as System.", "Change system to System.", "System.out.println(\"Habari\");", fixRename("system", "System")],
    ["java", /';' expected/i, "Missing semicolon", "Java statements end with ;", "Add ; at the end of the line.", "", fixSemi(false)],
    ["java", /incompatible types: (\S+) cannot be converted to (\S+)/i, "Wrong type: $1 isn't a $2",
      "You stored a $1 where Java expects a $2.", "Convert it (e.g. Integer.parseInt(text), String.valueOf(n)) or change the variable's type."],
    ["java", /missing return statement/i, "Missing return",
      "The method promises to return a value but some paths don't.", "Add a return at the end of the method (and in every if/else branch)."],
    ["java", /class (\w+) is public, should be declared in a file named/i, "Remove the word public before class",
      "The online compiler saves your code under its own file name, so the main class can't be public.", "Remove public before class $1.", "class Main {\n    public static void main(String[] args) { … }\n}", fixPublicClass],
    ["java", /reached end of file while parsing/i, "Missing }", "A { was never closed.", "Add the missing } at the end.", "", fixCloseBrace],
    ["java", /unclosed character literal/i, "Use double quotes for text",
      "In Java, ' ' holds one character; text (a String) needs \" \".", "Change the single quotes to double quotes.", "System.out.println(\"hello\");", fixCharQuotes],
    ["java", /variable (\w+) might not have been initialized/i, "$1 has no value yet",
      "Java won't use a variable before it's given a value.", "Give $1 a starting value, e.g. int $1 = 0;"],
    ["java kotlin", /NoSuchElementException/i, "Your program needs input",
      "It tried to read a value (Scanner / readLine), but the Input box is empty or has fewer values than it reads.", INPUT_HELP],
    ["java", /InputMismatchException/i, "The input isn't the right type",
      "nextInt() or nextDouble() got something that isn't a number.", "Check the values in the Input box are numbers, in the order the program reads them."],
    ["java kotlin", /NumberFormatException: (?:For input string: )?"?([^"\n]*)"?/i, "\"$1\" isn't a number",
      "The program tried to turn text into a number, but the text isn't one (or is empty).", "Check the Input box: the values must be numbers, one per line."],
    ["java", /ArithmeticException: \/ by zero/i, "Division by zero", "A whole number was divided by 0.", "Check the number isn't 0 before dividing."],
    ["java", /ArrayIndexOutOfBoundsException|StringIndexOutOfBoundsException|IndexOutOfBoundsException/i, "That position doesn't exist",
      "Positions go from 0 to length - 1.", "Loop with i < array.length (not <=), and check a position before using it."],
    ["java", /NullPointerException/i, "Using an empty (null) value", "A variable had no object in it.", "Create the object with new before using it, or check it isn't null first."],

    // ----- C# -----
    ["csharp", /error CS1002/i, "Missing semicolon", "C# statements end with ;", "Add ; at the end of the line.", "", fixSemi(false)],
    ["csharp", /error CS0103: The name '(\w+)' does not exist/i, "\"$1\" doesn't exist here",
      "C# doesn't know $1 in this place.", "Check the spelling (Console, WriteLine and ReadLine start with capitals), declare it (var x = …;) before using it, or add the using line for its namespace.", "", fixName(1)],
    ["csharp", /error CS0246: The type or namespace name '(\w+)/i, "\"$1\" needs a using line",
      "C# can't find the type $1.", "Add the using line for it at the top (List and Dictionary need using System.Collections.Generic;).", "", fixCsUsing],
    ["csharp", /error CS0029: Cannot implicitly convert type '([^']+)' to '([^']+)'/i, "Can't store a $1 in a $2",
      "The types don't match.", "Convert it (e.g. int.Parse(text), value.ToString()) or change the variable's type."],
    ["csharp", /error CS1513/i, "Missing }", "A { was never closed.", "Add the missing }.", "", fixCloseBrace],
    ["csharp", /error CS0161/i, "Missing return", "Not every path returns a value.", "Add a return at the end of the method."],
    ["csharp", /ArgumentNullException|Value cannot be null/i, "Your program needs input",
      "Console.ReadLine() found nothing to read, so it gave null.", INPUT_HELP],
    ["csharp", /FormatException/i, "The input isn't a number",
      "int.Parse (or Convert.ToInt32) got text that isn't a number.", "Check the values in the Input box are numbers, one per line."],
    ["csharp", /DivideByZeroException/i, "Division by zero", "A whole number was divided by 0.", "Check the number isn't 0 before dividing."],
    ["csharp", /IndexOutOfRangeException|ArgumentOutOfRangeException/i, "That position doesn't exist", "Positions go from 0 to Length - 1.", "Loop with i < array.Length (not <=)."],
    ["csharp", /NullReferenceException/i, "Using an empty (null) value", "A variable had no object in it.", "Create it with new before using it, or check it isn't null."],

    // ----- Go -----
    ["go", /declared and not used: (\w+)|(\w+) declared (?:and|but) not used/i, "A variable is never used",
      "Go refuses to compile unused variables.", "Use the variable, delete it, or replace its name with _ ."],
    ["go", /"([^"]+)" imported and not used/i, "Package \"$1\" is imported but unused",
      "Go refuses unused imports.", "Remove it from the import list, or use it.", "", fixGoImport],
    ["go", /undefined: (\w+)\.([a-z]\w*)/i, "Write $1.$2 with a capital letter",
      "Functions from a package start with a capital letter in Go (that's what makes them usable from outside).", "For example fmt.Println, fmt.Printf, strings.ToUpper.", "fmt.Println(\"Habari\")", fixGoExported],
    ["go", /undefined: (\w+)/i, "\"$1\" is undefined", "Go doesn't know $1.", "Check the spelling, and create new variables with := (x := 5), not = .", "total := 0", fixGoShort],
    ["go", /unexpected semicolon or newline before \{/i, "Put { on the same line",
      "In Go the opening { must be at the end of the line, not on its own line.", "Move { up to the end of the line before.", "func main() {", fixGoBrace],
    ["go", /more than one character in rune literal/i, "Use double quotes for text",
      "In Go, ' ' holds one character; text needs \" \".", "Change the single quotes to double quotes.", "", fixCharQuotes],
    ["go", /cannot use (.*) \(untyped (\w+) constant\) as (\w+) value/i, "A $2 can't go in a $3",
      "The value $1 is the wrong type.", "Use a value of the right type, or convert it (strconv.Atoi turns text into a number)."],
    ["go", /missing return/i, "Missing return", "The function must return a value on every path.", "Add a return at the end."],
    ["go", /index out of range \[(\d+)\] with length (\d+)/i, "Position $1 doesn't exist",
      "The list only has $2 items (positions 0 to $2 - 1).", "Loop with i < len(list) and check positions before using them."],
    ["go", /integer divide by zero/i, "Division by zero", "A whole number was divided by 0.", "Check the number isn't 0 before dividing."],
    ["go", /nil pointer dereference|nil map/i, "Using something that is nil", "A pointer or map had nothing in it.", "Create it first (make(map[string]int), &T{}) before using it."],

    // ----- Rust -----
    ["rust", /cannot borrow `(\w+)` as mutable|cannot assign twice to immutable variable `(\w+)`/i, "Variable can't be changed",
      "Rust variables can't change unless declared with mut.", "Declare it with let mut.", "let mut total = 0;\ntotal += 5;", fixRustHelp],
    ["rust", /expected function, found macro `(\w+)`/i, "Add ! after $1",
      "$1 is a macro, so it is called with ! : $1!(…).", "Write $1! instead of $1.", "println!(\"Habari\");", fixRustHelp],
    ["rust", /cannot add `&str` to `&str`/i, "Joining two pieces of text",
      "+ needs a String on the left.", "Use format!(\"{}{}\", a, b), or a.to_string() + b.", "let full = format!(\"{} {}\", first, last);", fixRustHelp],
    ["rust", /mismatched types/i, "Mismatched types", "A value's type doesn't match what's expected (e.g. i32 vs f64 or &str vs String).", "Convert it (as f64, .to_string(), String::from(…)) or change the type.", "", fixRustHelp],
    ["rust", /cannot find value `(\w+)`/i, "\"$1\" can't be found", "Rust doesn't know $1 here.", "Check the spelling and declare it with let before using it.", "", function (m, x) { return fixRustHelp(m, x) || fixName(1)(m, x); }],
    ["rust", /expected `;`/i, "Missing semicolon", "Rust statements end with ;", "Add ; at the end of the statement.", "", function (m, x) { return fixRustHelp(m, x) || fixSemi(false)(m, x); }],
    ["rust", /index out of bounds: the len is (\d+) but the index is (\d+)/i, "Position $2 doesn't exist",
      "The list has $1 items (positions 0 to $1 - 1).", "Check positions before using them, or loop with for x in &list."],
    ["rust", /ParseIntError \{ kind: Empty \}|ParseFloatError \{ kind: Empty \}/i, "Your program needs input",
      "It read an empty line and tried to turn it into a number.", INPUT_HELP],
    ["rust", /ParseIntError|ParseFloatError/i, "The input isn't a number", "parse() got text that isn't a number.", "Check the values in the Input box are numbers, one per line."],
    ["rust", /attempt to divide by zero/i, "Division by zero", "A number was divided by 0.", "Check the number isn't 0 before dividing."],
    ["rust", /attempt to (add|subtract|multiply) with overflow/i, "The number got too big (or below zero)",
      "The result didn't fit in the variable's type (for example a u32 below zero).", "Use a bigger type (i64) or a signed type, or check the values first."],
    ["rust", /error(?:\[E\d+\])?:/i, "The Rust compiler found a problem", "Read the message below: Rust explains the problem and often suggests the fix.", "Use the suggestion under help:, then run again.", "", fixRustHelp],

    // ----- Kotlin -----
    ["kotlin", /Unresolved reference:? '?(\w+)'?/i, "\"$1\" can't be found", "Kotlin doesn't know $1.", "Check the spelling and declare it with val or var first.", "", fixName(1)],
    ["kotlin", /Val cannot be reassigned|'val' cannot be reassigned/i, "A val can't change", "val values are fixed.", "Use var for values that change.", "var total = 0\ntotal += 5", fixValToVar],
    ["kotlin", /Type mismatch|Argument type mismatch|type mismatch/i, "Type mismatch", "A value's type doesn't match what's expected.", "Convert it, e.g. text.toInt(), number.toString()."],
    ["kotlin", /Expecting '\)'|Expecting '\}'|Expecting an element|Missing '\}'/i, "A bracket isn't closed", "A ( or { wasn't closed.", "Add the missing ) or }."],
    ["kotlin", /NullPointerException/i, "Your program needs input (or used null)",
      "readLine()!! found nothing to read, or a value was null.", INPUT_HELP],

    // ----- Ruby -----
    ["ruby", /undefined local variable or method [`']([^']+)'/i, "\"$1\" isn't defined", "Ruby doesn't know $1.", "Check the spelling, set the variable first, or put quotes around text.", "", fixName(1)],
    ["ruby", /undefined method [`']([^']+)' for (nil|an instance of \w+|[^\s]+)/i, "$2 has no method \"$1\"",
      "You called .$1 on a value that doesn't have it (often nil, meaning empty).", "Check the value isn't nil and the method name is right (e.g. .length, .upcase, .each)."],
    ["ruby", /syntax error.*(?:unexpected end-of-input|expecting 'end'|expected an `end`)/i, "Missing end", "Every def, if, do, class and while block needs an end.", "Add end to close the block."],
    ["ruby", /syntax error/i, "Syntax error", "Ruby couldn't understand this line.", "Check for missing end, quotes or brackets."],
    ["ruby", /divided by 0/i, "Division by zero", "You divided by 0.", "Check the number isn't 0 first."],
    ["ruby", /String can't be coerced into Integer|no implicit conversion of (\w+) into (\w+)/i, "Mixing text and numbers",
      "Ruby won't combine text and numbers automatically.", "Use \"Total: #{total}\" or convert with .to_s / .to_i."],

    // ----- Lua -----
    ["lua", /attempt to perform arithmetic on (?:a nil value|nil)/i, "Doing maths with an empty value",
      "A value in your calculation is nil (empty): the variable may be misspelt or never given a value.", "Give the variable a value before using it.", "local total = 0\nprint(total + 5)"],
    ["lua", /attempt to call (?:a nil value|nil)/i, "Calling a function that doesn't exist", "You called something that is nil (it doesn't exist).", "Check the spelling, and define the function before calling it."],
    ["lua", /attempt to concatenate/i, "Joining something that is empty", "One of the values you joined with .. is nil.", "Check the variable has a value, or use tostring(x)."],
    ["lua", /'end' expected/i, "Missing end", "Every if, for, while and function needs an end.", "Add end to close the block."],
    ["lua", /'=' expected|unexpected symbol/i, "Syntax error", "Lua didn't expect this here.", "Check spelling, quotes and that you used = to assign and == to compare."],

    // ----- Sass / Prolog / Regex -----
    ["sass", /Undefined variable/i, "Variable not defined", "A $variable is used before it is set (or is misspelt).", "Define it at the top, e.g. $brand: #0b1b35;"],
    ["sass", /expected "\{"|expected "\}"|expected ";"/i, "Missing bracket or semicolon", "A rule is missing { } or a declaration is missing ;", "Check each selector has { … } and each property ends with ;"],
    ["prolog", /existence_error\(procedure,\/?\(?(\w+),\s*(\d+)/i, "No rule called $1 with $2 arguments",
      "Prolog can't find $1/$2.", "Check the spelling and the number of arguments match your facts and rules."],
    ["prolog", /syntax_error/i, "Syntax error", "Prolog couldn't read a fact or rule.", "Every fact and rule must end with a full stop, and variables start with a capital letter."],
    ["regex", /Invalid pattern|Invalid regular expression/i, "The pattern isn't valid", "Brackets or special characters in the pattern don't match up.", "Escape special characters with \\ (e.g. \\. for a dot) and close every ( and [."],
    ["regex", /Write the pattern on the first line/i, "Pattern format", "The first line must be the pattern between slashes.", "Write /pattern/flags, then a line with ---, then your text.", "/\\d+/g\n---\nOrder 12 costs 450"],

    // ----- A program that ended with an error code (and nothing more specific above) -----
    ["c cpp csharp java go rust kotlin", /^exit code (\d+)$/im, "Your program ended with code $1",
      "main returned $1 (or exit($1) was called). Programs return 0 when everything went well.", "If that wasn't on purpose, end main with return 0;"],
    // ----- Online compilers that couldn't be reached -----
    ["*", /Couldn't reach the online compilers|online compilers are busy/i, "The online compiler couldn't be reached",
      "C#, Java, Go, Rust and Kotlin (and bigger C and C++ programs) are compiled online, which needs an internet connection.", "Check your connection, then tap Run again. Your code is saved on this device."],
    ["*", /Couldn't download|couldn't start|could not load|could not start/i, "The language couldn't load",
      "Its files couldn't be downloaded.", "Check your internet connection, then tap Run again. Once a language has downloaded, it stays on this device."],

    // ----- Generic fallbacks -----
    ["*", /undefined|not defined|cannot find|unknown|unresolved/i, "Something isn't defined",
      "The code uses a name the language doesn't recognise.", "Check spelling and capital letters, and make sure it is created before it is used."],
    ["*", /syntax|unexpected|expected/i, "Syntax error",
      "Something on or just before this line is missing or extra.", "Look for missing brackets, quotes, commas or semicolons."]
  ];

  // Compiler warnings (the code ran, but something looks wrong): [pattern, title, fix, quick fix]
  var WARNINGS = [
    [/missing terminating (["']) character/i, "A closing quote is missing", "A text must end with the same quote it started with (on the same line). Add the closing $1: one missing quote makes the compiler report strange errors later.", fixCloseQuote],
    [/implicit declaration of function '(\w+)'(?!;)/i, "$1() needs its #include line", "Add the right #include at the top (stdio.h for printf and scanf, string.h for strlen, math.h for sqrt).", fixInclude],
    [/format '%(\w+)' expects argument of type '(\w+) \*', but argument \d+ has type '\w+'/i, "scanf needs & before the variable", "Write scanf(\"%$1\", &variable): the & tells scanf where to store the value.", fixScanfAmp],
    [/format '%(\w+)' expects argument of type '([\w ]+)', but argument \d+ has type '([\w ]+)'/i, "%$1 doesn't match a $3", "Use the right code for the value: %d for int, %f for float/double, %c for char, %s for text, %ld for long."],
    [/'(\w+)' is used uninitialized|'(\w+)' may be used uninitialized/i, "$1 is used before it has a value", "Give $1 a starting value when you declare it, e.g. int $1 = 0;"],
    [/suggest parentheses around assignment used as truth value/i, "= inside an if or while", "= stores a value; to compare, use ==.", fixIfAssign],
    [/unused variable [`']?(\w+)/i, "$1 is never used", "Use it or remove it (it does nothing at the moment)."],
    [/control reaches end of non-void function/i, "A function doesn't always return a value", "Add a return at the end of the function, so every path returns something."],
    [/comparison of integer expressions of different signedness/i, "Comparing signed and unsigned numbers", "Usually harmless here; use size_t (or int) for both sides to be safe."],
    [/variable [`']?(\w+)[`']? is never read|value assigned to [`']?(\w+)[`']? is never read/i, "$1 is given a value that is never used", "Check whether you meant to use $1 later, or remove the extra assignment."],
    [/variable does not need to be mutable/i, "mut isn't needed here", "This variable never changes, so you can remove mut."],
    [/declared but never used|is assigned but its value is never used|is never used/i, "Something is never used", "Use it or remove it."]
  ];

  // Python's type names in plain words: "a int" -> "a whole number (int)"
  function plainTypes(t) {
    return String(t).replace(/\b([Aa]) str\b/g, function (a, x) { return (x === "A" ? "Text" : "text") + " (str)"; })
      .replace(/\b([Aa]) int\b/g, "$1 whole number (int)").replace(/\b([Aa]) float\b/g, "$1 decimal number (float)")
      .replace(/\b([Aa]) dict\b/g, "$1 dictionary (dict)").replace(/\b([Aa]) NoneType\b/g, function (a, x) { return x === "A" ? "None" : "None"; })
      .replace(/\b([Aa]) bool\b/g, "$1 True/False value (bool)");
  }
  function fill(s, m) { return String(s || "").replace(/\$(\d)/g, function (_, i) { return m[i] !== undefined ? m[i] : ""; }).replace(/\s+"?"\s/g, " ").replace(/""/g, "").trim(); }
  var groupsOf = function (m) { return [m[0]].concat(m.slice(1).filter(function (g) { return g !== undefined; })); };
  function runFix(fn, g, x) {
    try { var f = fn(g, x); return f && typeof f.code === "string" && f.code !== x.code ? f : null; } catch (e) { return null; }
  }
  function matchRule(lang, text) {
    for (var i = 0; i < RULES.length; i++) {
      var rule = RULES[i];
      if (rule[0] !== "*" && (" " + rule[0] + " ").indexOf(" " + lang + " ") < 0) continue;
      var m = rule[1].exec(text);
      if (m) return { rule: rule, g: groupsOf(m) };
    }
    return null;
  }

  function explain(lang, code, r) {
    var raw = stripAnsi((r && (r.detail || r.error)) || "");
    if (!raw || !r || r.ok || r.stopped) return null;
    code = String(code || "");
    var lines = raw.split("\n"), diags = diagnostics(raw), errs = diags.filter(function (d) { return d.kind === "error"; });
    var block = raw, line = 0;
    if (errs.length) {
      // The first error, with the notes under it, up to the next error or warning. A closing quote that is
      // missing earlier in the code makes the compiler report confusing errors after it: explain that first.
      var main = diags.filter(function (d) { return d.kind === "warning" && d.at < errs[0].at && /missing terminating/.test(d.text); })[0] || errs[0];
      var at = main.at, next = diags.filter(function (d) { return d.at > at; })[0];
      block = lines.slice(at, next ? next.at : lines.length).join("\n");
      line = main.line;
      errs = diags.filter(function (d) { return d.kind === "error" && d !== main; });
      errs.unshift(main);
    } else line = findLine(raw, /^(python|ruby)$/.test(lang));
    if (line && /^(javascript|typescript|react)$/.test(lang) && /\(line \d+\)/.test(raw)) line -= 1;
    var total = code.split("\n").length;
    if (line < 1 || line > total) line = 0;
    var found = matchRule(lang, block) || (block !== raw ? matchRule(lang, raw) : null);
    var py = lang === "python" ? plainTypes : function (t) { return t; };
    var hit = found ? { title: py(fill(found.rule[2], found.g)), why: py(fill(found.rule[3], found.g)), fix: py(fill(found.rule[4], found.g)), example: found.rule[5] || "" }
      : { title: "Your code has an error", why: "Read the message below: it usually names the problem and the line.", fix: "Fix one error at a time, starting with the first one, then run again.", example: "" };
    var x = { code: code, lang: lang, line: line, col: findCol(block), block: block, raw: raw };
    var fixes = [];
    if (found && found.rule[6]) {
      var made = null;
      try { made = found.rule[6](found.g, x); } catch (e) {}
      (Array.isArray(made) ? made : [made]).forEach(function (f) { if (f && typeof f.code === "string" && f.code !== code) fixes.push(f); });
    }
    if ((CURLY.test(code) || ODD.test(code)) && !fixes.some(function (q) { return /curly|odd characters/.test(q.label); })) { var q = runFix(fixQuotes, [], x); if (q) fixes.push(q); }
    hit.line = line;
    hit.lineText = line ? code.split("\n")[line - 1].trim() : "";
    hit.raw = raw;
    hit.fixes = fixes;
    hit.more = errs.slice(1).filter(function (d) { return d.line >= 1 && d.line <= total; }).slice(0, 6).map(function (d) { return { line: d.line, text: d.text.replace(/\s*\[-W[\w=-]+\]$/, "") }; });
    return hit;
  }

  /** Things worth checking even when the code ran: compiler warnings, a program that reads input with an
   * empty Input box, PHP without <?php, and HTML/CSS mistakes. ctx: { stdin } (the Input box, if any). */
  function tips(lang, code, r, ctx) {
    var out = [];
    code = String(code || "");
    var w = stripAnsi((r && r.warnings) || "");
    if (w) diagnostics(w).filter(function (d) { return d.kind === "warning"; }).forEach(function (d) {
      if (out.length >= 4 || out.some(function (t) { return t.line === d.line && t.raw === d.text; })) return;
      for (var i = 0; i < WARNINGS.length; i++) {
        var m = WARNINGS[i][0].exec(d.text);
        if (!m) continue;
        var g = groupsOf(m), x = { code: code, lang: lang, line: d.line, col: 0, block: d.text, raw: w };
        var f = WARNINGS[i][3] ? runFix(WARNINGS[i][3], g, x) : null;
        out.push({ line: d.line, title: fill(WARNINGS[i][1], g), fix: fill(WARNINGS[i][2], g), fixes: f ? [f] : [], raw: d.text });
        return;
      }
      out.push({ line: d.line, title: d.text.replace(/\s*\[-W[\w=-]+\]$/, ""), fix: "", raw: d.text });
    });
    var reads = { c: /\b(scanf|getchar|fgets|gets)\s*\(/, cpp: /\bcin\s*>>|\bgetline\s*\(|\bscanf\s*\(/, java: /\b(Scanner|readLine|BufferedReader)\b/, csharp: /Console\.(ReadLine|Read)\s*\(/,
      go: /\bfmt\.(Scan|Scanln|Scanf)\b|bufio\.New(Reader|Scanner)/, rust: /\bstdin\s*\(\s*\)/, kotlin: /\b(readLine|readln)\s*\(/ };
    if (ctx && ctx.stdin === "" && reads[lang] && reads[lang].test(code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, ""))) out.unshift({ line: 0, title: "Your program reads input, but the Input box is empty", fix: INPUT_HELP, input: true });
    if (lang === "php" && !/<\?php/.test(code) && /\$\w+|\becho\b|\bfunction\b/.test(code)) {
      out.unshift({ line: 1, title: "There's no <?php at the top", fix: "Without it, PHP shows your code as plain text instead of running it.", fixes: [fixPhpTag(null, { code: code })] });
    }
    if (lang === "html" || lang === "css") lint(lang, code).forEach(function (t) { out.push(t); });
    return out.slice(0, 6);
  }

  // HTML and CSS never crash, so point out the most common mistakes instead
  function lint(lang, code) {
    var tips = [], src = String(code || "");
    var lineOf = function (i) { return src.slice(0, i).split("\n").length; };
    if (lang === "html" || lang === "css") {
      var VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr|!doctype)$/i, stack = [], re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*|!doctype)\b[^>]*?(\/?)>/g, m;
      var noScript = src.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, function (x) { return x.replace(/[^\n]/g, " "); });
      while ((m = re.exec(noScript))) {
        var name = m[2].toLowerCase();
        if (VOID.test(name) || m[3]) continue;
        if (!m[1]) stack.push({ name: name, at: m.index });
        else {
          var idx = -1;
          for (var k = stack.length - 1; k >= 0; k--) if (stack[k].name === name) { idx = k; break; }
          if (idx < 0) tips.push({ line: lineOf(m.index), title: "Closing tag </" + name + "> has no opening tag", fix: "Remove it, or add <" + name + "> before it." });
          else {
            stack.slice(idx + 1).forEach(function (t) { if (!/^(p|li|td|th|tr|option|html|head|body)$/.test(t.name)) tips.push({ line: lineOf(t.at), title: "<" + t.name + "> isn't closed", fix: "Add </" + t.name + "> where it should end." }); });
            stack.length = idx;
          }
        }
      }
      stack.forEach(function (t) { if (!/^(p|li|td|th|tr|option|html|head|body)$/.test(t.name)) tips.push({ line: lineOf(t.at), title: "<" + t.name + "> isn't closed", fix: "Add </" + t.name + "> where it should end." }); });
      (noScript.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) || []).slice(0, 1).forEach(function (t) { tips.push({ line: lineOf(noScript.indexOf(t)), title: "Image without alt text", fix: "Add alt=\"description\" so screen readers and Google understand the image." }); });
      // CSS inside <style> (or a whole CSS answer)
      var css = "";
      src.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, function (all, body) { css += body; return all; });
      if (!/<style/i.test(src) && lang === "css" && !/</.test(src)) css = src;
      if (css) {
        var open = (css.match(/\{/g) || []).length, close = (css.match(/\}/g) || []).length;
        if (open !== close) tips.push({ line: 0, title: open > close ? "A CSS rule is missing }" : "There's an extra } in your CSS", fix: "Every selector needs one { and one }." });
        var base = src.indexOf(css) >= 0 ? src.indexOf(css) : 0;
        var TYPO = { colour: "color", "font-colour": "color", "font-color": "color", "text-colour": "color", "text-color": "color", "background-colour": "background-color", backround: "background", "backround-color": "background-color", widht: "width", heigth: "height", "font-wieght": "font-weight", "margin-botom": "margin-bottom", "text-allign": "text-align", allign: "text-align", "boarder": "border", "boarder-radius": "border-radius" };
        var UNITLESS = /^(opacity|z-index|font-weight|line-height|flex|flex-grow|flex-shrink|order|zoom|columns|column-count|orphans|widows|tab-size)$/i;
        var dre = /([a-zA-Z-]+)\s*:\s*([^;{}]*)/g, d;
        var body = css.replace(/[^{}]*\{/g, function (x) { return x.replace(/[^\n{]/g, " "); });   // blank out selectors
        while ((d = dre.exec(body)) && tips.length < 8) {
          var prop = d[1].toLowerCase(), val = d[2], at = lineOf(base + d.index);
          if (/\n\s*[a-zA-Z-]+\s*:/.test(val)) { tips.push({ line: at, title: "Missing ; after \"" + prop + ": " + val.split("\n")[0].trim() + "\"", fix: "End each CSS declaration with a semicolon." }); continue; }
          if (TYPO[prop]) tips.push({ line: at, title: "\"" + prop + "\" isn't a CSS property", fix: "Use " + TYPO[prop] + " (CSS uses American spelling)." });
          if (/^\s*-?\d*\.?\d+\s*$/.test(val) && !/^\s*0\s*$/.test(val) && !UNITLESS.test(prop)) tips.push({ line: at, title: "\"" + prop + ": " + val.trim() + "\" needs a unit", fix: "Add a unit such as px, rem or %, e.g. " + val.trim() + "px." });
        }
      }
    }
    // CSS inside style="…" attributes
    if (lang === "html" || lang === "css") {
      var TYPOS = { colour: "color", "font-colour": "color", "font-color": "color", "text-color": "color", "background-colour": "background-color", backround: "background", widht: "width", heigth: "height", "text-allign": "text-align", allign: "text-align", boarder: "border" };
      var sre = /style\s*=\s*"([^"]*)"/gi, sm;
      while ((sm = sre.exec(src)) && tips.length < 8) {
        sm[1].split(";").forEach(function (decl) {
          var prop = (decl.split(":")[0] || "").trim().toLowerCase();
          if (TYPOS[prop]) tips.push({ line: lineOf(sm.index), title: "\"" + prop + "\" isn't a CSS property", fix: "Use " + TYPOS[prop] + " (CSS uses American spelling)." });
        });
      }
    }
    return tips.slice(0, 5);
  }

  window.MarzleyHelp = { explain: explain, tips: tips, lint: lint, closest: closest, lev: lev };
})();
