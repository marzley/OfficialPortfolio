/* Marzley Tech learning hub: tutorials with live code, practice, videos (unlocked with M-Pesa) and free notes.
 * Learner code never runs on this page: it runs in runner.html, a sandboxed frame with no access to the site. */
(function () {
  "use strict";
  var API = "../portal/learn.php?action=";
  var LANGS = { html: "HTML", css: "CSS", javascript: "JavaScript", python: "Python", sql: "SQL" };
  var TRACK_ICONS = { html: "fa-brands fa-html5", css: "fa-brands fa-css3-alt", javascript: "fa-brands fa-js", python: "fa-brands fa-python", sql: "fa-solid fa-database",
    networking: "fa-solid fa-network-wired", "make-money-online": "fa-solid fa-sack-dollar", git: "fa-brands fa-git-alt", linux: "fa-brands fa-linux", php: "fa-brands fa-php",
    cybersecurity: "fa-solid fa-shield-halved", hosting: "fa-solid fa-server", marketing: "fa-solid fa-bullhorn", "it-basics": "fa-solid fa-computer",
    "web-design": "fa-solid fa-pen-ruler", "graphic-design": "fa-solid fa-palette", algorithms: "fa-solid fa-diagram-project", typescript: "fa-solid fa-code",
    java: "fa-brands fa-java", "c-programming": "fa-solid fa-microchip", cpp: "fa-solid fa-gears", csharp: "fa-brands fa-microsoft", "dart-flutter": "fa-solid fa-mobile-screen",
    go: "fa-brands fa-golang", "digital-literacy": "fa-solid fa-user-shield", "ms-word": "fa-solid fa-file-word", excel: "fa-solid fa-table",
    powerpoint: "fa-solid fa-person-chalkboard", "google-workspace": "fa-solid fa-cloud", "ai-tools": "fa-solid fa-robot", "e-services-kenya": "fa-solid fa-landmark",
    "computer-maintenance": "fa-solid fa-screwdriver-wrench" };
  var TRACK_GROUPS = [
    { title: "Web & coding", icon: "fa-solid fa-code", slugs: ["html", "css", "javascript", "python", "sql", "php", "typescript", "algorithms", "git"] },
    { title: "More programming languages", icon: "fa-solid fa-laptop-code", slugs: ["java", "c-programming", "cpp", "csharp", "dart-flutter", "go"] },
    { title: "Design", icon: "fa-solid fa-palette", slugs: ["web-design", "graphic-design"] },
    { title: "ICT & digital skills", icon: "fa-solid fa-computer", slugs: ["it-basics", "digital-literacy", "ms-word", "excel", "powerpoint", "google-workspace", "ai-tools", "e-services-kenya", "computer-maintenance"] },
    { title: "Networking, systems & security", icon: "fa-solid fa-network-wired", slugs: ["networking", "linux", "cybersecurity", "hosting"] },
    { title: "Business & earning online", icon: "fa-solid fa-sack-dollar", slugs: ["make-money-online", "marketing"] }
  ];
  // Where learners can run languages this site can't run in the browser
  var PLAYGROUNDS = { typescript: ["TypeScript Playground", "https://www.typescriptlang.org/play"], java: ["OnlineGDB (Java)", "https://www.onlinegdb.com/online_java_compiler"],
    "c-programming": ["OnlineGDB (C)", "https://www.onlinegdb.com/online_c_compiler"], cpp: ["OnlineGDB (C++)", "https://www.onlinegdb.com/online_c++_compiler"],
    csharp: [".NET Fiddle", "https://dotnetfiddle.net/"], "dart-flutter": ["DartPad", "https://dartpad.dev/"], go: ["Go Playground", "https://go.dev/play/"],
    php: ["OnlineGDB (PHP)", "https://www.onlinegdb.com/online_php_interpreter"] };
  var MODES = { html: "htmlmixed", css: "htmlmixed", javascript: "javascript", python: "python", sql: "text/x-sql" };
  var STARTERS = {
    html: "<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello!</h1>\n  <p>Edit me and press Run.</p>\n</body>\n</html>",
    css: "<style>\n  h1 { color: #0b1b35; font-family: sans-serif; }\n  .box { padding: 16px; background: #fff7e0; border: 2px solid #ffb800; border-radius: 12px; }\n</style>\n<h1>Styling practice</h1>\n<div class=\"box\">Change my colours.</div>",
    javascript: "const items = [\"Unga\", \"Sugar\", \"Milk\"];\nfor (const item of items) {\n  console.log(\"Buy \" + item);\n}",
    python: "name = \"Kenya\"\nfor i in range(3):\n    print(f\"{i + 1}. Habari, {name}!\")",
    sql: "SELECT c.Name, p.Name AS Product, o.Quantity\nFROM Orders o\nJOIN Customers c ON c.CustomerID = o.CustomerID\nJOIN Products p ON p.ProductID = o.ProductID;"
  };

  var state = { me: null, csrf: null, editor: false, progress: [], catalog: null, gsiLoaded: false, mpesa: false };
  var main = document.getElementById("learn-main");
  var side = document.getElementById("learn-side");
  var sideToggle = document.getElementById("side-toggle");
  var scrim = document.getElementById("side-scrim");
  var cleanup = [];   // things to stop when leaving a page (polling, observers)

  // ---------- small helpers ----------
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ksh = function (n) { return "KSh " + Number(n || 0).toLocaleString("en-KE"); };
  var isDark = function () { return document.documentElement.getAttribute("data-theme") === "dark"; };
  var store = {
    get: function (k) { try { return localStorage.getItem("learn:" + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem("learn:" + k, v); } catch (e) {} }
  };
  function api(action, body, query) {
    var opts = { credentials: "same-origin", headers: {} };
    if (body !== undefined) {
      opts.method = "POST";
      opts.headers["Content-Type"] = "application/json";
      if (state.csrf) opts.headers["X-CSRF-Token"] = state.csrf;
      opts.body = JSON.stringify(body);
    }
    return fetch(API + action + (query || ""), opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (j && j.csrf) state.csrf = j.csrf;
        if (!r.ok) { var e = new Error((j && j.error) || "Something went wrong. Please try again."); e.status = r.status; throw e; }
        return j;
      });
    }, function () { throw new Error("You seem to be offline. Check your connection and try again."); });
  }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function timeAgo(s) {
    var d = new Date(String(s).replace(" ", "T") + "+03:00"), sec = (Date.now() - d.getTime()) / 1000;
    if (isNaN(sec)) return "";
    if (sec < 60) return "just now";
    if (sec < 3600) return Math.floor(sec / 60) + " min ago";
    if (sec < 86400) return Math.floor(sec / 3600) + " h ago";
    if (sec < 86400 * 30) return Math.floor(sec / 86400) + " d ago";
    return d.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
  }
  function plural(n, word) { return n + " " + word + (Number(n) === 1 ? "" : "s"); }
  function fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; }
  function fmtDur(s) { s = Number(s) || 0; if (!s) return ""; var m = Math.floor(s / 60), r = s % 60; return m >= 60 ? Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0") + ":" + String(r).padStart(2, "0") : m + ":" + String(r).padStart(2, "0"); }

  // ---------- safe Markdown (everything is escaped first; only a small set of formatting is allowed) ----------
  function inline(text) {
    var parts = String(text).split(/(`[^`]+`)/g);
    return parts.map(function (p) {
      if (/^`[^`]+`$/.test(p)) return "<code>" + esc(p.slice(1, -1)) + "</code>";
      var s = esc(p);
      s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
        var u = url.replace(/&amp;/g, "&");
        if (!/^(https?:\/\/|mailto:|tel:|\.{0,2}\/|#|\?)/i.test(u)) return label;
        var ext = /^https?:/i.test(u);
        return '<a href="' + esc(u) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + label + "</a>";
      });
      s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
      return s;
    }).join("");
  }
  function splitRow(line) {
    var cells = [], cur = "", tick = false;
    line = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === "`") tick = !tick;
      if (ch === "|" && !tick) { cells.push(cur.trim()); cur = ""; } else cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  }
  /** Returns { html, blocks } where blocks are the "try it" code samples, placed at <div data-try="n">. */
  function markdown(src, top) {
    var lines = String(src || "").replace(/\r/g, "").split("\n"), out = [], blocks = [], quizzes = [], i = 0, para = [];
    var flush = function () { if (para.length) { out.push("<p>" + inline(para.join(" ")) + "</p>"); para = []; } };
    while (i < lines.length) {
      var line = lines[i];
      var fence = line.match(/^```\s*([\w-]*)\s*$/);
      if (fence) {
        flush();
        var code = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) code.push(lines[i++]);
        i++;
        var lang = fence[1] || "";
        if (/^try-/.test(lang)) { blocks.push({ lang: lang.slice(4), code: code.join("\n") }); out.push('<div data-try="' + (blocks.length - 1) + '"></div>'); }
        else if (lang === "quiz") { quizzes.push(code.join("\n")); out.push('<div data-quiz="' + (quizzes.length - 1) + '"></div>'); }
        else if (/^tool-/.test(lang)) out.push('<div data-tool="' + esc(lang.slice(5)) + '"></div>');
        else out.push('<pre class="code-sample"><code>' + esc(code.join("\n")) + "</code></pre>");
        continue;
      }
      var hd = line.match(/^(#{1,4})\s+(.*)$/);
      if (hd) { flush(); var lv = Math.min(4, hd[1].length + (top ? 0 : 1)); out.push("<h" + lv + ">" + inline(hd[2]) + "</h" + lv + ">"); i++; continue; }
      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:-]+\|/.test(lines[i + 1])) {
        flush();
        var head = splitRow(line), rows = [];
        i += 2;
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(splitRow(lines[i++]));
        out.push('<div class="table-wrap"><table><thead><tr>' + head.map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
        continue;
      }
      if (/^>\s?/.test(line)) {
        flush();
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
        out.push('<aside class="tip"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i><p>' + inline(q.join(" ")) + "</p></aside>");
        continue;
      }
      if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
        flush();
        var ordered = /^\s*\d+\./.test(line), items = [];
        while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ""));
        var tag = ordered ? "ol" : "ul";
        out.push("<" + tag + ">" + items.map(function (t) { return "<li>" + inline(t) + "</li>"; }).join("") + "</" + tag + ">");
        continue;
      }
      if (!line.trim()) { flush(); i++; continue; }
      para.push(line.trim());
      i++;
    }
    flush();
    return { html: out.join("\n"), blocks: blocks, quizzes: quizzes };
  }

  // ---------- running code (in the sandboxed frame) ----------
  function runLang(lang, code) { return lang === "javascript" && /^\s*</.test(code) ? "html" : lang; }
  function Runner(box) {
    this.box = box;
    this.frame = null;
    this.frameLang = null;
    this.ready = null;
  }
  Runner.prototype.fresh = function (kind) {
    if (this.frame) this.frame.remove();
    var f = document.createElement("iframe");
    f.className = "run-frame";
    f.title = "Output";
    f.setAttribute("sandbox", "allow-scripts allow-modals");
    f.setAttribute("loading", "eager");
    f.src = "runner.html?theme=" + (isDark() ? "dark" : "light");
    var self = this;
    this.ready = new Promise(function (resolve) {
      var onMsg = function (e) { if (e.source === f.contentWindow && e.data && e.data.type === "ready") { window.removeEventListener("message", onMsg); resolve(); } };
      window.addEventListener("message", onMsg);
    });
    this.box.appendChild(f);
    this.frame = f;
    this.frameLang = kind;
    return this.ready;
  };
  /** Run code; resolves with { text, ok, error } once the frame reports its output. */
  Runner.prototype.run = function (lang, code) {
    var self = this;
    lang = runLang(lang, code);
    var web = lang === "html" || lang === "css" || lang === "javascript";
    // Web code replaces the frame's page, so it gets a new frame each run. Python and SQL keep theirs (loaded once).
    var ready = web || this.frameLang !== lang || !this.frame ? this.fresh(lang) : this.ready;
    this.box.hidden = false;
    return ready.then(function () {
      return new Promise(function (resolve) {
        var done = false;
        var onMsg = function (e) {
          if (!self.frame || e.source !== self.frame.contentWindow || !e.data || e.data.type !== "output") return;
          window.removeEventListener("message", onMsg);
          done = true;
          resolve({ text: String(e.data.text || ""), ok: !!e.data.ok, error: e.data.error || "" });
        };
        window.addEventListener("message", onMsg);
        self.frame.contentWindow.postMessage({ type: "run", lang: lang, code: code }, "*");
        setTimeout(function () {
          if (done) return;
          window.removeEventListener("message", onMsg);
          // The frame is stuck: throw it away so the next run starts a fresh one
          if (self.frame) { self.frame.remove(); self.frame = null; self.frameLang = null; }
          resolve({ text: "", ok: false, error: "timeout" });
        }, lang === "python" ? 90000 : lang === "sql" ? 40000 : 10000);
      });
    });
  };

  function makeEditor(host, code, lang) {
    if (!window.CodeMirror) {
      var ta = document.createElement("textarea");
      ta.className = "plain-editor";
      ta.value = code;
      ta.spellcheck = false;
      ta.setAttribute("aria-label", "Code editor");
      host.appendChild(ta);
      return { getValue: function () { return ta.value; }, setValue: function (v) { ta.value = v; }, refresh: function () {}, setMode: function () {} };
    }
    var cm = window.CodeMirror(host, {
      value: code, mode: MODES[runLang(lang, code)] || "htmlmixed", lineNumbers: true, tabSize: 2, indentUnit: lang === "python" ? 4 : 2,
      lineWrapping: true, autoCloseBrackets: true, matchBrackets: true, autoCloseTags: true, styleActiveLine: true, viewportMargin: Infinity,
      extraKeys: { Tab: function (c) { c.replaceSelection(lang === "python" ? "    " : "  "); } }
    });
    cm.getInputField().setAttribute("aria-label", (LANGS[lang] || "Code") + " editor");
    cm.setMode = function (l) { cm.setOption("mode", MODES[l] || "htmlmixed"); cm.setOption("indentUnit", l === "python" ? 4 : 2); };
    return cm;
  }

  /** An editor + Run button + output. opts: { lang, code, title, check } */
  function codeBlock(host, opts) {
    var lang = opts.lang;
    var wrap = el('<div class="try"><div class="try-bar"><span class="try-lang">' + esc(opts.title || ("Try it · " + (LANGS[runLang(lang, opts.code)] || lang))) + '</span>' +
      '<div class="try-btns"><button type="button" class="try-reset" title="Reset the code"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i><span class="sr-only">Reset</span></button>' +
      '<a class="try-open" title="Open in the practice editor" href="./?page=practice&amp;lang=' + esc(lang) + '"><i class="fa-solid fa-up-right-from-square" aria-hidden="true"></i><span class="sr-only">Open in practice</span></a>' +
      '<button type="button" class="btn btn-solid btn-sm try-run"><i class="fa-solid fa-play" aria-hidden="true"></i> Run</button></div></div>' +
      '<div class="try-body"><div class="try-editor"></div><div class="try-output" hidden></div></div></div>');
    host.appendChild(wrap);
    var ed = makeEditor(wrap.querySelector(".try-editor"), opts.code, lang);
    var runner = new Runner(wrap.querySelector(".try-output"));
    var runBtn = wrap.querySelector(".try-run");
    var run = function () {
      runBtn.disabled = true;
      return runner.run(lang, ed.getValue()).then(function (r) { runBtn.disabled = false; return r; });
    };
    runBtn.addEventListener("click", run);
    wrap.querySelector(".try-reset").addEventListener("click", function () { ed.setValue(opts.code); });
    wrap.querySelector(".try-open").addEventListener("click", function () { store.set("code:" + lang, ed.getValue()); });
    wrap.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } });
    return { editor: ed, run: run, el: wrap };
  }

  // ---------- quizzes (```quiz blocks: Q: / A: answer | other accepted answer / H: hint) ----------
  function normAns(s) { return String(s).toLowerCase().replace(/[“”"'`]/g, "").replace(/,/g, "").replace(/\s+/g, "").replace(/\.$/, ""); }
  function renderQuiz(host, text, onAllCorrect) {
    var qs = [], cur = null;
    String(text).split("\n").forEach(function (line) {
      var m = line.match(/^\s*([QAH]):\s*(.*)$/);
      if (!m) { if (cur && line.trim() && cur.a === undefined) cur.q += " " + line.trim(); return; }
      if (m[1] === "Q") { cur = { q: m[2] }; qs.push(cur); }
      else if (cur && m[1] === "A") cur.a = m[2].split("|").map(function (x) { return x.trim(); }).filter(Boolean);
      else if (cur && m[1] === "H") cur.h = m[2];
    });
    qs = qs.filter(function (q) { return q.a && q.a.length; });
    if (!qs.length) return;
    var box = el('<section class="quiz"><h3><i class="fa-solid fa-circle-question" aria-hidden="true"></i> Practice questions</h3><ol></ol><p class="quiz-score" role="status" aria-live="polite"></p></section>');
    var ol = box.querySelector("ol"), right = {};
    qs.forEach(function (q, i) {
      var li = el('<li><p class="quiz-q">' + inline(q.q) + '</p><div class="quiz-row"><label class="sr-only" for="qz' + i + '"></label><input autocomplete="off" spellcheck="false" placeholder="Your answer" />' +
        '<button type="button" class="btn btn-solid btn-sm">Check</button><button type="button" class="linklike quiz-show">Show answer</button></div><p class="quiz-fb" aria-live="polite"></p></li>');
      var input = li.querySelector("input"), fb = li.querySelector(".quiz-fb");
      var check = function () {
        var v = normAns(input.value);
        if (!v) { input.focus(); return; }
        var ok = q.a.some(function (a) { return normAns(a) === v; });
        li.classList.toggle("ok", ok); li.classList.toggle("bad", !ok);
        fb.innerHTML = ok ? '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Correct!' : '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Not quite.' + (q.h ? " Hint: " + inline(q.h) : " Try again.");
        if (ok) right[i] = true;
        var n = Object.keys(right).length;
        box.querySelector(".quiz-score").textContent = n + " of " + qs.length + " correct";
        if (n === qs.length && onAllCorrect) onAllCorrect();
      };
      li.querySelector(".btn").addEventListener("click", check);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); check(); } });
      li.querySelector(".quiz-show").addEventListener("click", function () { fb.innerHTML = "Answer: <strong>" + esc(q.a[0]) + "</strong>" + (q.h ? " · " + inline(q.h) : ""); });
      ol.appendChild(li);
    });
    host.appendChild(box);
  }

  // ---------- interactive tools (```tool-cidr, ```tool-subnet-practice, ```tool-binary, ```tool-chmod, ```tool-rate) ----------
  function ipToInt(ip) {
    var p = String(ip).trim().split(".");
    if (p.length !== 4) return null;
    var n = 0;
    for (var i = 0; i < 4; i++) { if (!/^\d{1,3}$/.test(p[i]) || +p[i] > 255) return null; n = n * 256 + (+p[i]); }
    return n;
  }
  function intToIp(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join("."); }
  function maskOf(prefix) { return prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0; }
  function bin8(n) { return ("00000000" + n.toString(2)).slice(-8); }
  function ipBin(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].map(bin8).join("."); }
  function subnet(ipInt, prefix) {
    var mask = maskOf(prefix), net = (ipInt & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, total = Math.pow(2, 32 - prefix);
    var usable = prefix >= 31 ? (prefix === 31 ? 2 : 1) : total - 2;
    return { mask: mask, net: net, bc: bc, total: total, usable: usable, first: prefix >= 31 ? net : net + 1, last: prefix >= 31 ? bc : bc - 1 };
  }
  function ipClass(n) { var a = n >>> 24; return a < 128 ? "A" : a < 192 ? "B" : a < 224 ? "C" : a < 240 ? "D (multicast)" : "E (reserved)"; }
  function ipKind(n) {
    var a = n >>> 24, b = (n >>> 16) & 255;
    if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return "Private (RFC 1918)";
    if (a === 127) return "Loopback";
    if (a === 169 && b === 254) return "Link-local (APIPA)";
    if (a === 100 && b >= 64 && b <= 127) return "Carrier-grade NAT (shared)";
    if (a >= 224) return "Multicast / reserved";
    return "Public";
  }
  var TOOLS = {
    cidr: function (host) {
      var box = el('<div class="tool"><h3><i class="fa-solid fa-calculator" aria-hidden="true"></i> CIDR / subnet calculator</h3><div class="tool-row"><label for="cidr-in">IP address / prefix</label>' +
        '<input id="cidr-in" value="192.168.10.77/27" spellcheck="false" autocomplete="off" /><button type="button" class="btn btn-solid btn-sm">Calculate</button></div><div class="tool-out" aria-live="polite"></div></div>');
      var input = box.querySelector("input"), out = box.querySelector(".tool-out");
      var run = function () {
        var m = input.value.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\s*(?:\/\s*(\d{1,2})|\s+(\d{1,3}(?:\.\d{1,3}){3}))?$/);
        var ip = m ? ipToInt(m[1]) : null, prefix = m && m[2] !== undefined ? +m[2] : null;
        if (m && m[3]) { var mk = ipToInt(m[3]); if (mk !== null) { var bits = mk.toString(2); if (/^1*0*$/.test(("00000000000000000000000000000000" + bits).slice(-32))) prefix = (("00000000000000000000000000000000" + bits).slice(-32).match(/1/g) || []).length; } }
        if (m && prefix === null && !m[3]) prefix = ip === null ? null : ((ip >>> 24) < 128 ? 8 : (ip >>> 24) < 192 ? 16 : 24);
        if (ip === null || prefix === null || prefix > 32) { out.innerHTML = '<p class="bad">Type an address like <code>192.168.1.10/24</code> or <code>10.0.0.5 255.255.255.0</code>.</p>'; return; }
        var s = subnet(ip, prefix);
        var rows = [["Address", intToIp(ip)], ["Prefix (CIDR)", "/" + prefix], ["Subnet mask", intToIp(s.mask)], ["Wildcard mask", intToIp((~s.mask) >>> 0)],
          ["Network address", intToIp(s.net)], ["Broadcast address", prefix >= 31 ? "none (/" + prefix + ")" : intToIp(s.bc)], ["First usable host", intToIp(s.first)], ["Last usable host", intToIp(s.last)],
          ["Total addresses", s.total.toLocaleString() + " (2^" + (32 - prefix) + ")"], ["Usable hosts", s.usable.toLocaleString() + (prefix < 31 ? " (2^" + (32 - prefix) + " − 2)" : "")],
          ["Block size (in the interesting octet)", String(prefix % 8 === 0 && prefix < 32 ? 256 : Math.pow(2, 8 - prefix % 8))], ["Class (old system)", ipClass(ip)], ["Type", ipKind(ip)],
          ["Address in binary", "<code>" + ipBin(ip) + "</code>"], ["Mask in binary", "<code>" + ipBin(s.mask) + "</code>"], ["Network in binary", "<code>" + ipBin(s.net) + "</code>"]];
        out.innerHTML = '<table class="tool-table"><tbody>' + rows.map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + (/<code>/.test(r[1]) ? r[1] : esc(r[1])) + "</td></tr>"; }).join("") + "</tbody></table>";
      };
      box.querySelector("button").addEventListener("click", run);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });
      host.appendChild(box); run();
    },
    "subnet-practice": function (host) {
      var box = el('<div class="tool"><h3><i class="fa-solid fa-dumbbell" aria-hidden="true"></i> Subnetting practice (new question every time)</h3><p class="tool-q"></p><div class="tool-grid"></div>' +
        '<p class="tool-btns"><button type="button" class="btn btn-solid btn-sm" data-a="check">Check</button><button type="button" class="btn btn-line btn-sm" data-a="show">Show answers</button><button type="button" class="btn btn-line btn-sm" data-a="new">New question</button></p><p class="tool-score" aria-live="polite"></p></div>');
      var fields = [["net", "Network address"], ["bc", "Broadcast address"], ["first", "First usable host"], ["last", "Last usable host"], ["hosts", "Usable hosts"], ["mask", "Subnet mask"]];
      var grid = box.querySelector(".tool-grid"), q = box.querySelector(".tool-q"), score = box.querySelector(".tool-score"), ans = {}, stats = { right: 0, tried: 0 };
      try { stats = JSON.parse(store.get("subnet-score") || "null") || stats; } catch (e) {}
      fields.forEach(function (f) { grid.appendChild(el('<label class="tool-field"><span>' + f[1] + '</span><input data-f="' + f[0] + '" spellcheck="false" autocomplete="off" /></label>')); });
      var fresh = function () {
        var firsts = [10, 172, 192], a = firsts[Math.floor(Math.random() * 3)];
        var ip = a === 10 ? [10, rnd(0, 255), rnd(0, 255), rnd(1, 254)] : a === 172 ? [172, rnd(16, 31), rnd(0, 255), rnd(1, 254)] : [192, 168, rnd(0, 255), rnd(1, 254)];
        var prefix = rnd(a === 192 ? 24 : 18, 30), n = ipToInt(ip.join(".")), s = subnet(n, prefix);
        ans = { net: intToIp(s.net), bc: intToIp(s.bc), first: intToIp(s.first), last: intToIp(s.last), hosts: String(s.usable), mask: intToIp(s.mask) };
        q.innerHTML = "Host <strong>" + ip.join(".") + "/" + prefix + "</strong>. Work out:";
        grid.querySelectorAll("input").forEach(function (i) { i.value = ""; i.parentNode.className = "tool-field"; });
        grid.querySelector("input").focus({ preventScroll: true });
      };
      function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
      var showScore = function () { score.textContent = stats.tried ? "Your score: " + stats.right + " of " + stats.tried + " questions fully correct" : ""; };
      box.querySelector(".tool-btns").addEventListener("click", function (e) {
        var a = e.target.getAttribute("data-a");
        if (a === "new") return fresh();
        if (a === "show") { grid.querySelectorAll("input").forEach(function (i) { i.value = ans[i.getAttribute("data-f")]; }); return; }
        if (a === "check") {
          var all = true;
          grid.querySelectorAll("input").forEach(function (i) {
            var ok = normAns(i.value) === normAns(ans[i.getAttribute("data-f")]);
            i.parentNode.className = "tool-field " + (ok ? "ok" : "bad"); if (!ok) all = false;
          });
          stats.tried++; if (all) stats.right++;
          store.set("subnet-score", JSON.stringify(stats)); showScore();
          if (all) score.textContent += " · Perfect! Press “New question”.";
        }
      });
      host.appendChild(box); fresh(); showScore();
    },
    binary: function (host) {
      var box = el('<div class="tool"><h3><i class="fa-solid fa-calculator" aria-hidden="true"></i> Binary / decimal / hex converter</h3><div class="tool-grid">' +
        '<label class="tool-field"><span>Decimal</span><input data-b="10" value="192" /></label><label class="tool-field"><span>Binary</span><input data-b="2" /></label><label class="tool-field"><span>Hexadecimal</span><input data-b="16" /></label></div>' +
        '<p class="tool-bits" aria-hidden="true"></p></div>');
      var inputs = box.querySelectorAll("input"), bits = box.querySelector(".tool-bits");
      var upd = function (src) {
        var n = parseInt(src.value.trim().replace(/^0x/i, "").replace(/\s/g, ""), +src.getAttribute("data-b"));
        if (isNaN(n) || n < 0) return;
        inputs.forEach(function (i) { if (i !== src) { var b = +i.getAttribute("data-b"); i.value = b === 2 ? n.toString(2) : b === 16 ? n.toString(16).toUpperCase() : String(n); } });
        if (n <= 255) bits.innerHTML = [128, 64, 32, 16, 8, 4, 2, 1].map(function (v) { return '<span class="' + (n & v ? "on" : "") + '"><b>' + (n & v ? 1 : 0) + "</b>" + v + "</span>"; }).join("");
        else bits.textContent = "";
      };
      inputs.forEach(function (i) { i.addEventListener("input", function () { upd(i); }); });
      host.appendChild(box); upd(inputs[0]);
    },
    chmod: function (host) {
      var who = ["Owner", "Group", "Others"], perms = [["r", 4], ["w", 2], ["x", 1]];
      var box = el('<div class="tool"><h3><i class="fa-solid fa-lock" aria-hidden="true"></i> Linux permissions calculator</h3><table class="tool-table chmod"><thead><tr><th></th><th>Read (4)</th><th>Write (2)</th><th>Execute (1)</th></tr></thead><tbody>' +
        who.map(function (w, i) { return "<tr><th>" + w + "</th>" + perms.map(function (p) { return '<td><input type="checkbox" data-w="' + i + '" data-v="' + p[1] + '" aria-label="' + w + " " + p[0] + '" /></td>'; }).join("") + "</tr>"; }).join("") +
        '</tbody></table><div class="tool-row"><label for="chmod-oct">Number</label><input id="chmod-oct" value="755" maxlength="3" /><code class="chmod-sym"></code></div></div>');
      var boxes = box.querySelectorAll("input[type=checkbox]"), oct = box.querySelector("#chmod-oct"), sym = box.querySelector(".chmod-sym");
      var fromBoxes = function () {
        var d = [0, 0, 0];
        boxes.forEach(function (b) { if (b.checked) d[+b.getAttribute("data-w")] += +b.getAttribute("data-v"); });
        oct.value = d.join(""); show(d);
      };
      var show = function (d) { sym.textContent = "chmod " + d.join("") + " file   →   -" + d.map(function (x) { return (x & 4 ? "r" : "-") + (x & 2 ? "w" : "-") + (x & 1 ? "x" : "-"); }).join(""); };
      var fromOct = function () {
        if (!/^[0-7]{3}$/.test(oct.value)) return;
        var d = oct.value.split("").map(Number);
        boxes.forEach(function (b) { b.checked = !!(d[+b.getAttribute("data-w")] & +b.getAttribute("data-v")); });
        show(d);
      };
      boxes.forEach(function (b) { b.addEventListener("change", fromBoxes); });
      oct.addEventListener("input", fromOct);
      host.appendChild(box); fromOct();
    },
    rate: function (host) {
      var box = el('<div class="tool"><h3><i class="fa-solid fa-calculator" aria-hidden="true"></i> Freelance rate calculator</h3><div class="tool-grid">' +
        '<label class="tool-field"><span>Income you want per month (KSh)</span><input data-k="want" type="number" value="80000" /></label>' +
        '<label class="tool-field"><span>Monthly work costs: internet, power, tools (KSh)</span><input data-k="costs" type="number" value="8000" /></label>' +
        '<label class="tool-field"><span>Paid hours you can bill per week</span><input data-k="hours" type="number" value="20" /></label>' +
        '<label class="tool-field"><span>Platform fee (%)</span><input data-k="fee" type="number" value="10" /></label>' +
        '<label class="tool-field"><span>Tax to set aside (%)</span><input data-k="tax" type="number" value="10" /></label>' +
        '<label class="tool-field"><span>KSh per US$ (check today’s rate)</span><input data-k="fx" type="number" value="129" /></label></div><div class="tool-out" aria-live="polite"></div></div>');
      var out = box.querySelector(".tool-out");
      var calc = function () {
        var v = {}; box.querySelectorAll("input").forEach(function (i) { v[i.getAttribute("data-k")] = Math.max(0, +i.value || 0); });
        var need = (v.want + v.costs) / Math.max(0.01, (1 - v.fee / 100) * (1 - v.tax / 100));
        var hoursMonth = v.hours * 52 / 12, hourly = hoursMonth ? need / hoursMonth : 0;
        out.innerHTML = '<table class="tool-table"><tbody><tr><th>You must bill per month</th><td>KSh ' + Math.round(need).toLocaleString() + "</td></tr><tr><th>Billable hours per month</th><td>" + Math.round(hoursMonth) +
          "</td></tr><tr><th>Minimum hourly rate</th><td><strong>KSh " + Math.round(hourly).toLocaleString() + " ≈ US$ " + (v.fx ? (hourly / v.fx).toFixed(2) : "?") + "</strong></td></tr><tr><th>Half-day (4 h)</th><td>KSh " + Math.round(hourly * 4).toLocaleString() +
          "</td></tr><tr><th>Full day (8 h)</th><td>KSh " + Math.round(hourly * 8).toLocaleString() + "</td></tr></tbody></table><p class=\"muted small\">Only about half of a freelancer’s working time is billable (the rest is finding clients, admin and learning), which is why billable hours are lower than working hours.</p>";
      };
      box.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", calc); });
      host.appendChild(box); calc();
    }
  };

  // ---------- page structure ----------
  function setNav(which) {
    document.querySelectorAll(".learn-nav a").forEach(function (a) {
      var on = a.getAttribute("data-nav") === which;
      a.classList.toggle("is-current", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  function showSide(on) {
    side.hidden = !on;
    sideToggle.hidden = !on;
    document.body.classList.toggle("has-side", on);
    closeSide();
  }
  function closeSide() { document.body.classList.remove("side-open"); sideToggle.setAttribute("aria-expanded", "false"); scrim.hidden = true; }
  sideToggle.addEventListener("click", function () {
    var open = !document.body.classList.contains("side-open");
    document.body.classList.toggle("side-open", open);
    sideToggle.setAttribute("aria-expanded", String(open));
    scrim.hidden = !open;
  });
  scrim.addEventListener("click", closeSide);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSide(); });

  var HOME_TITLE = "Free Coding & ICT Lessons in Kenya | Marzley Tech Learn", HOME_DESC = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute("content") : "";
  function setMeta(sel, attr, val) { var m = document.querySelector(sel); if (m) m.setAttribute(attr, val); }
  function setTitle(t, desc) {
    var title = t ? (t.length > 34 ? t + " | Marzley Learn" : t + " | Marzley Tech Learning Hub") : HOME_TITLE;
    document.title = title;
    desc = desc || HOME_DESC;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
  }
  /** One clean address per page for search engines: /learn/?track=…&lesson=…, ?page=…, ?video=…, ?note=… */
  function setCanonical() {
    var p = new URLSearchParams(location.search), keep = new URLSearchParams();
    ["track", "lesson", "video", "note", "page"].forEach(function (k) { if (p.get(k) && !(k === "page" && (p.get("track") || p.get("video") || p.get("note")))) keep.set(k, p.get(k)); });
    var url = (/marzleytechsolutions\.co\.ke$/.test(location.hostname) ? "https://marzleytechsolutions.co.ke" : location.origin) + location.pathname + (keep.toString() ? "?" + keep.toString() : "");
    var link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = url;
    setMeta('meta[property="og:url"]', "content", url);
  }
  function errorBox(msg) { main.innerHTML = '<div class="empty"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><p>' + esc(msg) + '</p><p><a class="btn btn-solid btn-sm" href="./">Back to the learning hub</a></p></div>'; }

  function isDone(id) { return state.progress.indexOf(Number(id)) >= 0; }
  function loadLocalProgress() { try { return JSON.parse(store.get("progress") || "[]").map(Number); } catch (e) { return []; } }
  function markDone(id) {
    id = Number(id);
    if (!isDone(id)) state.progress.push(id);
    store.set("progress", JSON.stringify(state.progress));
    var link = side.querySelector('[data-lesson="' + id + '"]');
    if (link) link.classList.add("done");
    updateUser();
    if (state.me) api("progress", { lesson_id: id }).catch(function () {});
  }

  function getCatalog() {
    if (state.catalog) return Promise.resolve(state.catalog);
    return api("catalog").then(function (j) { state.catalog = j.tracks || []; return state.catalog; });
  }

  function renderSide(track, lessonSlug) {
    var tracks = state.catalog || [];
    side.innerHTML = '<nav class="track-tabs" aria-label="Subjects">' + tracks.map(function (t) {
      return '<a href="./?track=' + esc(t.slug) + '" class="' + (t.slug === track.slug ? "is-current" : "") + '"' + (t.slug === track.slug ? ' aria-current="true"' : "") + ">" + esc(t.title) + "</a>";
    }).join("") + "</nav>" +
      '<h2 class="side-title">' + esc(track.title) + ' tutorial</h2><ol class="lesson-list">' + track.lessons.map(function (l) {
        var cur = l.slug === lessonSlug;
        return '<li><a href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(l.slug) + '" data-lesson="' + l.id + '" class="' + (cur ? "is-current " : "") + (isDone(l.id) ? "done" : "") + '"' + (cur ? ' aria-current="page"' : "") + ">" +
          '<i class="fa-solid fa-circle-check tick" aria-hidden="true"></i><span>' + esc(l.title) + "</span>" + (isDone(l.id) ? '<span class="sr-only"> (done)</span>' : "") + "</a></li>";
      }).join("") + "</ol>" +
      (LANGS[track.lang] ? '<a class="side-practice" href="./?page=practice&amp;lang=' + esc(track.lang) + '"><i class="fa-solid fa-code" aria-hidden="true"></i> Practice ' + esc(track.title) + "</a>" : "");
  }

  // ---------- pages ----------
  function pageHome() {
    setNav("");
    showSide(false);
    setTitle("");
    main.innerHTML = '<section class="hero-learn"><div><p class="eyebrow">Marzley Tech Learning Hub</p><h1>Learn tech skills free, right in your browser</h1>' +
      '<p class="lead" id="hub-lead">30+ subjects and 190 lessons: coding in 13 languages with a live editor, web and graphic design, Excel, Word and everyday ICT skills, networking and subnetting, cybersecurity, AI tools and how to make money online. Practise with questions that check themselves. Works on your phone.</p>' +
      '<ul class="free-badges"><li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Tutorials: free</li><li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Notes: free</li><li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Practice: free</li><li><i class="fa-solid fa-user" aria-hidden="true"></i> No account needed</li></ul>' +
      '<p class="hero-ctas"><a class="btn btn-solid" href="./?track=html">Start with HTML</a><a class="btn btn-line" href="./?page=practice">Open the code editor</a></p></div>' +
      '<div class="hero-code" aria-hidden="true"><pre><span class="c-k">print</span>(<span class="c-s">"Habari, Kenya!"</span>)\n<span class="c-t">&lt;h1&gt;</span>Hello<span class="c-t">&lt;/h1&gt;</span>\n<span class="c-k">SELECT</span> * <span class="c-k">FROM</span> Customers;</pre></div></section>' +
      '<section class="home-sec"><h2>Tutorials</h2><div class="track-grid" id="track-grid"><p class="muted">Loading…</p></div></section>' +
      '<section class="home-sec"><div class="sec-head"><h2>Latest videos</h2><a href="./?page=videos">All videos</a></div><div class="video-grid" id="home-videos"></div></section>' +
      '<section class="home-sec"><div class="sec-head"><h2>Free notes &amp; books</h2><a href="./?page=notes">All notes</a></div><div class="note-grid" id="home-notes"></div></section>';
    getCatalog().then(function (tracks) {
      var lessons = tracks.reduce(function (n, t) { return n + t.lessons.length; }, 0);
      if (tracks.length > 5) $("#hub-lead").firstChild.textContent = tracks.length + " subjects and " + lessons + " lessons: coding in 13 languages with a live editor, web and graphic design, Excel, Word and everyday ICT skills, networking and subnetting, cybersecurity, AI tools and how to make money online. Practise with questions that check themselves. Works on your phone.";
      var groups = TRACK_GROUPS.map(function (g) { return { title: g.title, icon: g.icon, items: [] }; }), other = { title: "More subjects", icon: "fa-solid fa-book", items: [] };
      tracks.forEach(function (t) {
        var gi = -1;
        TRACK_GROUPS.forEach(function (g, i) { if (g.slugs.indexOf(t.slug) >= 0) gi = i; });
        (gi >= 0 ? groups[gi] : other).items.push(t);
      });
      groups.push(other);
      var card = function (t) {
        var done = t.lessons.filter(function (l) { return isDone(l.id); }).length;
        var first = t.lessons[0];
        return '<a class="track-card t-' + esc(t.lang) + " s-" + esc(t.slug) + '" href="./?track=' + esc(t.slug) + (first ? "&amp;lesson=" + esc(first.slug) : "") + '"><i class="' + (TRACK_ICONS[t.slug] || TRACK_ICONS[t.lang] || "fa-solid fa-book") + '" aria-hidden="true"></i>' +
          "<h3>" + esc(t.title) + "</h3><p>" + esc(t.summary) + '</p><span class="track-meta">' + t.lessons.length + " lessons" + (done ? " · " + done + " done" : "") + "</span>" +
          '<span class="bar" aria-hidden="true"><span style="width:' + (t.lessons.length ? Math.round(100 * done / t.lessons.length) : 0) + '%"></span></span></a>';
      };
      var shown = groups.filter(function (g) { return g.items.length; });
      $("#track-grid").outerHTML = shown.length ? '<nav class="group-jump" aria-label="Subject groups">' + shown.map(function (g, i) { return '<a href="#grp-' + i + '"><i class="' + g.icon + '" aria-hidden="true"></i> ' + esc(g.title) + "</a>"; }).join("") + "</nav>" +
        shown.map(function (g, i) { return '<div class="track-group" id="grp-' + i + '"><h3 class="group-title"><i class="' + g.icon + '" aria-hidden="true"></i> ' + esc(g.title) + ' <span class="muted">' + g.items.length + '</span></h3><div class="track-grid">' + g.items.map(card).join("") + "</div></div>"; }).join("")
        : '<p class="muted">Tutorials are coming soon.</p>';
    }).catch(function (e) { $("#track-grid").innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
    api("videos").then(function (j) { var v = (j.videos || []).slice(0, 3); $("#home-videos").innerHTML = v.length ? v.map(function (x) { return videoCard(x); }).join("") : '<p class="muted">Video lessons are coming soon.</p>'; })
      .catch(function () { $("#home-videos").innerHTML = '<p class="muted">Videos could not load.</p>'; });
    api("notes").then(function (j) { var n = (j.notes || []).slice(0, 4); $("#home-notes").innerHTML = n.length ? n.map(function (x) { return noteCard(x); }).join("") : '<p class="muted">Notes are coming soon.</p>'; })
      .catch(function () { $("#home-notes").innerHTML = '<p class="muted">Notes could not load.</p>'; });
  }

  function pageTutorials() {
    getCatalog().then(function (tracks) {
      if (!tracks.length) { setNav("tutorials"); showSide(false); main.innerHTML = '<div class="empty"><p>Tutorials are coming soon.</p></div>'; return; }
      go("./?track=" + encodeURIComponent(tracks[0].slug), true);
    }).catch(function (e) { errorBox(e.message); });
  }

  /** "Keep learning" box under each lesson: free videos on YouTube, and an online editor for languages we can't run here. */
  function moreBox(track, l) {
    var q = encodeURIComponent((track.title.replace(/\s*\(.*\)\s*/, " ") + " " + l.title.replace(/^Project:\s*/, "") + " tutorial").replace(/\s+/g, " ").trim());
    var pg = PLAYGROUNDS[track.slug];
    return '<aside class="more-box" aria-label="Keep learning"><h2><i class="fa-solid fa-circle-play" aria-hidden="true"></i> Keep learning</h2><ul>' +
      '<li><a href="https://www.youtube.com/results?search_query=' + q + '" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-youtube" aria-hidden="true"></i> Watch free videos on “' + esc(l.title) + '”</a></li>' +
      (pg ? '<li><a href="' + esc(pg[1]) + '" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-play" aria-hidden="true"></i> Run the code online: ' + esc(pg[0]) + "</a></li>" : "") +
      '<li><a href="./?page=videos"><i class="fa-solid fa-film" aria-hidden="true"></i> Our step-by-step video lessons</a></li></ul></aside>';
  }

  function pageLesson(trackSlug, lessonSlug) {
    setNav("tutorials");
    getCatalog().then(function (tracks) {
      var track = tracks.filter(function (t) { return t.slug === trackSlug; })[0];
      if (!track) return errorBox("That tutorial was not found.");
      if (!lessonSlug) { if (!track.lessons.length) return errorBox("This tutorial has no lessons yet."); return go("./?track=" + encodeURIComponent(track.slug) + "&lesson=" + encodeURIComponent(track.lessons[0].slug), true); }
      showSide(true);
      renderSide(track, lessonSlug);
      main.innerHTML = '<p class="learn-loading"><span class="spinner" aria-hidden="true"></span> Loading…</p>';
      return api("lesson", undefined, "&track=" + encodeURIComponent(trackSlug) + "&slug=" + encodeURIComponent(lessonSlug)).then(function (j) {
        var l = j.lesson, idx = track.lessons.map(function (x) { return x.slug; }).indexOf(lessonSlug);
        var prev = track.lessons[idx - 1], next = track.lessons[idx + 1];
        setTitle(l.title + " (" + track.title + ")", "Free " + track.title + " lesson: " + l.title + ". Clear notes, examples and practice questions.");
        var md = markdown(l.body, true);
        var pager = '<nav class="pager" aria-label="Lessons">' +
          (prev ? '<a class="btn btn-line btn-sm" href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(prev.slug) + '"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> ' + esc(prev.title) + "</a>" : "<span></span>") +
          (next ? '<a class="btn btn-solid btn-sm" href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(next.slug) + '">' + esc(next.title) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' : "<span></span>") + "</nav>";
        main.innerHTML = '<article class="lesson"><p class="crumbs"><a href="./">Learn</a> / <a href="./?track=' + esc(track.slug) + '">' + esc(track.title) + "</a></p>" + pager.replace('class="pager" aria-label="Lessons"', 'class="pager pager-top" aria-label="Previous and next lesson"') +
          '<div class="lesson-body">' + md.html + "</div>" + moreBox(track, l) + (l.exercise ? '<section class="exercise" id="exercise" aria-labelledby="ex-title"><h2 id="ex-title"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i> Exercise</h2><div class="ex-task">' + markdown(l.exercise).html + '</div><div id="ex-host"></div><p class="ex-result" id="ex-result" role="status" aria-live="polite"></p></section>' :
          '<p class="done-row"><button type="button" class="btn btn-line btn-sm" id="mark-done">' + (isDone(l.id) ? '<i class="fa-solid fa-check" aria-hidden="true"></i> Completed' : "Mark as completed") + "</button></p>") + pager + "</article>";
        md.blocks.forEach(function (b, n) { codeBlock(main.querySelector('[data-try="' + n + '"]'), { lang: b.lang, code: b.code }); });
        var quizDone = 0;
        md.quizzes.forEach(function (q, n) {
          renderQuiz(main.querySelector('[data-quiz="' + n + '"]'), q, function () {
            if (++quizDone === md.quizzes.length && !l.exercise) { markDone(l.id); var b = $("#mark-done"); if (b) b.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Completed'; }
          });
        });
        main.querySelectorAll("[data-tool]").forEach(function (h) { var fn = TOOLS[h.getAttribute("data-tool")]; if (fn) fn(h); });
        if (l.exercise) exercise(l, track);
        var md2 = $("#mark-done");
        if (md2) md2.addEventListener("click", function () { markDone(l.id); md2.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Completed'; });
        main.focus({ preventScroll: true });
      });
    }).catch(function (e) { errorBox(e.message); });
  }

  function norm(s) { return String(s).replace(/\r/g, "").split("\n").map(function (x) { return x.trim().replace(/\s+/g, " "); }).filter(Boolean).join("\n").toLowerCase(); }
  function exercise(l, track) {
    var saved = store.get("ex:" + l.id);
    var block = codeBlock($("#ex-host"), { lang: track.lang, code: saved != null ? saved : (l.starter || ""), title: "Your answer · " + (LANGS[track.lang] || track.lang) });
    var result = $("#ex-result");
    var check = el('<button type="button" class="btn btn-solid btn-sm ex-check"><i class="fa-solid fa-check" aria-hidden="true"></i> Check my answer</button>');
    block.el.querySelector(".try-btns").appendChild(check);
    block.el.querySelector(".try-run").classList.replace("btn-solid", "btn-line");
    block.el.querySelector(".try-reset").addEventListener("click", function () { block.editor.setValue(l.starter || ""); });
    if (isDone(l.id)) result.innerHTML = '<span class="ok"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> You’ve completed this exercise.</span>';
    check.addEventListener("click", function () {
      var code = block.editor.getValue();
      store.set("ex:" + l.id, code);
      check.disabled = true;
      result.textContent = "Checking…";
      block.run().then(function (r) {
        check.disabled = false;
        var problems = [];
        var codeN = code.toLowerCase().replace(/\s+/g, " ");
        String(l.must_contain || "").split("\n").map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (tok) {
          if (codeN.indexOf(tok.toLowerCase().replace(/\s+/g, " ")) < 0) problems.push("Your code should include <code>" + esc(tok) + "</code>.");
        });
        if (!r.ok && r.error && r.error !== "timeout") problems.unshift("Your code has an error: " + esc(r.error.split("\n").slice(-1)[0]));
        if (r.error === "timeout") problems.unshift("Your code took too long to run. Check for a loop that never ends.");
        if (l.expected && norm(r.text).indexOf(norm(l.expected)) < 0) problems.push("The output should include: <code>" + esc(l.expected) + "</code>");
        if (problems.length) {
          result.innerHTML = '<span class="bad"><i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Not yet. ' + problems[0] + "</span>";
        } else {
          markDone(l.id);
          var next = track.lessons[track.lessons.map(function (x) { return x.id; }).indexOf(l.id) + 1];
          result.innerHTML = '<span class="ok"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Correct, well done!' + (next ? ' <a href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(next.slug) + '">Next: ' + esc(next.title) + " →</a>" : " You’ve finished the " + esc(track.title) + " tutorial!") + "</span>" +
            (state.me ? "" : ' <button type="button" class="linklike" id="save-progress">Sign in to save your progress</button>');
          var sp = $("#save-progress");
          if (sp) sp.addEventListener("click", function () { openSignin("Sign in to keep your progress on any device."); });
        }
      });
    });
  }

  function pagePractice(lang) {
    setNav("practice");
    showSide(false);
    lang = LANGS[lang] ? lang : store.get("practice-lang") || "python";
    setTitle(LANGS[lang] + " online editor", "Free online " + LANGS[lang] + " editor: write code and run it in your browser.");
    main.innerHTML = '<section class="practice"><div class="practice-head"><h1>Practice</h1><div class="lang-pick" role="tablist" aria-label="Language">' +
      Object.keys(LANGS).map(function (k) { return '<button type="button" role="tab" data-lang="' + k + '" aria-selected="' + (k === lang) + '">' + LANGS[k] + "</button>"; }).join("") +
      '</div></div><div class="practice-grid"><div class="pane"><div class="pane-bar"><span>Code</span><div><button type="button" class="try-reset" id="p-reset" title="Start again"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i><span class="sr-only">Start again</span></button>' +
      '<button type="button" class="try-reset" id="p-copy" title="Copy code"><i class="fa-regular fa-copy" aria-hidden="true"></i><span class="sr-only">Copy code</span></button>' +
      '<button type="button" class="btn btn-solid btn-sm" id="p-run"><i class="fa-solid fa-play" aria-hidden="true"></i> Run <kbd>Ctrl</kbd>+<kbd>Enter</kbd></button></div></div><div class="pane-editor" id="p-editor"></div></div>' +
      '<div class="pane"><div class="pane-bar"><span>Output</span></div><div class="pane-output" id="p-out"></div></div></div>' +
      '<p class="muted small">Your code is saved on this device. Python runs fully in your browser (the first run downloads it once). SQL uses a sample shop database with Customers, Products and Orders.</p></section>';
    var ed = makeEditor($("#p-editor"), store.get("code:" + lang) || STARTERS[lang], lang);
    var runner = new Runner($("#p-out"));
    var run = function () { store.set("code:" + lang, ed.getValue()); $("#p-run").disabled = true; runner.run(lang, ed.getValue()).then(function () { $("#p-run").disabled = false; }); };
    $("#p-run").addEventListener("click", run);
    $("#p-reset").addEventListener("click", function () { if (confirm("Start again with the example code?")) ed.setValue(STARTERS[lang]); });
    $("#p-copy").addEventListener("click", function () { if (navigator.clipboard) navigator.clipboard.writeText(ed.getValue()); });
    main.querySelector(".practice").addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } });
    main.querySelectorAll(".lang-pick button").forEach(function (b) {
      b.addEventListener("click", function () { store.set("code:" + lang, ed.getValue()); store.set("practice-lang", b.getAttribute("data-lang")); go("./?page=practice&lang=" + b.getAttribute("data-lang")); });
    });
    var t = setInterval(function () { store.set("code:" + lang, ed.getValue()); }, 5000);
    cleanup.push(function () { clearInterval(t); store.set("code:" + lang, ed.getValue()); });
    if (lang !== "python") run();
  }

  // ---------- videos ----------
  function videoCard(v, lvl) {
    var hx = lvl || "h3";
    return '<a class="video-card" href="./?video=' + v.id + '"><span class="thumb">' + (v.poster ? '<img src="../portal/' + esc(v.poster) + '" alt="" loading="lazy" />' : '<i class="fa-solid fa-circle-play" aria-hidden="true"></i>') +
      (v.duration ? '<span class="dur">' + fmtDur(v.duration) + "</span>" : "") + '<span class="price ' + (v.unlocked ? "open" : "") + '">' + (v.unlocked ? '<i class="fa-solid fa-lock-open" aria-hidden="true"></i> Unlocked' : '<i class="fa-solid fa-lock" aria-hidden="true"></i> ' + ksh(v.price)) + "</span></span>" +
      "<" + hx + ">" + esc(v.title) + (v.published ? "" : ' <span class="tag">Draft</span>') + "</" + hx + '><p class="meta">' + v.views + " views · " + v.likes + " likes · " + v.comments + " comments</p></a>";
  }
  var CHANNELS = [
    ["freeCodeCamp.org", "Full free courses: web development, Python, JavaScript, SQL, data science", "https://www.youtube.com/@freecodecamp"],
    ["CS50 (Harvard)", "The famous introduction to computer science and programming", "https://www.youtube.com/@cs50"],
    ["Programming with Mosh", "Clear beginner courses: Python, JavaScript, SQL, React", "https://www.youtube.com/@programmingwithmosh"],
    ["Traversy Media", "Web development crash courses and projects", "https://www.youtube.com/@TraversyMedia"],
    ["Net Ninja", "Step-by-step playlists on JavaScript, React, Flutter and more", "https://www.youtube.com/@NetNinja"],
    ["Kevin Powell", "CSS and web design explained properly", "https://www.youtube.com/@KevinPowell"],
    ["Fireship", "Fast explainers on languages, frameworks and tools", "https://www.youtube.com/@Fireship"],
    ["Flutter", "Official Flutter channel for mobile app development", "https://www.youtube.com/@flutterdev"],
    ["Professor Messer", "Free CompTIA A+, Network+ and Security+ courses", "https://www.youtube.com/@professormesser"],
    ["Jeremy's IT Lab", "A complete free Cisco CCNA course with labs", "https://www.youtube.com/@JeremysITLab"],
    ["NetworkChuck", "Networking, Linux, cybersecurity and cloud, made fun", "https://www.youtube.com/@NetworkChuck"],
    ["ExcelIsFun", "Thousands of Excel lessons from basics to advanced", "https://www.youtube.com/@excelisfun"],
    ["Leila Gharani", "Practical Excel, Power BI and productivity tips", "https://www.youtube.com/@LeilaGharani"]
  ];
  function freeChannels() {
    return '<section class="home-sec free-channels" aria-labelledby="fc-title"><h2 id="fc-title">Free video courses from around the web</h2>' +
      '<p class="muted">Hand-picked YouTube channels with complete, free courses. Every lesson in our tutorials also has a “Watch free videos” link for that exact topic.</p><ul class="channel-list">' +
      CHANNELS.map(function (c) { return '<li><a href="' + esc(c[2]) + '" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-youtube" aria-hidden="true"></i><span><strong>' + esc(c[0]) + "</strong>" + esc(c[1]) + "</span></a></li>"; }).join("") + "</ul></section>";
  }
  function pageVideos() {
    setNav("videos");
    showSide(false);
    setTitle("Video lessons", "Step-by-step coding video lessons. Unlock each one with M-Pesa.");
    main.innerHTML = '<section class="list-page"><h1>Video lessons</h1><p class="lead">Step-by-step lessons you can pause and replay. Watching needs a free account: sign in, unlock a video once with M-Pesa and it’s yours to watch any time. Tutorials, notes and practice stay free without an account.</p><div class="video-grid" id="vid-grid"><p class="muted">Loading…</p></div></section>';
    main.querySelector(".list-page").insertAdjacentHTML("beforeend", freeChannels());
    api("videos").then(function (j) {
      $("#vid-grid").innerHTML = (j.videos || []).map(function (v) { return videoCard(v, "h2"); }).join("") || '<div class="empty"><i class="fa-solid fa-video" aria-hidden="true"></i><p>Our own video lessons are coming soon. Meanwhile, try the free channels below.</p></div>';
    }).catch(function (e) { $("#vid-grid").innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
  }

  function pageVideo(id) {
    while (cleanup.length) { try { cleanup.pop()(); } catch (e) {} }
    setNav("videos");
    showSide(false);
    main.innerHTML = '<p class="learn-loading"><span class="spinner" aria-hidden="true"></span> Loading…</p>';
    api("video", undefined, "&id=" + encodeURIComponent(id)).then(function (j) {
      var v = j.video;
      setTitle(v.title, v.summary ? v.summary.slice(0, 150) : "Video lesson: " + v.title);
      main.innerHTML = '<article class="video-page"><p class="crumbs"><a href="./?page=videos">Videos</a></p><div class="player" id="player"></div>' +
        "<h1>" + esc(v.title) + '</h1><div class="video-meta"><span>' + plural(v.views, "view") + " · " + esc(timeAgo(v.created_at)) + '</span><div class="video-acts">' +
        '<button type="button" class="pill-btn" id="like-btn" aria-pressed="' + !!v.liked + '"' + (v.unlocked ? "" : " disabled") + '><i class="fa-' + (v.liked ? "solid" : "regular") + ' fa-thumbs-up" aria-hidden="true"></i> <span id="like-n">' + v.likes + '</span><span class="sr-only"> likes</span></button>' +
        '<button type="button" class="pill-btn" id="share-btn"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i> Share</button></div></div>' +
        (v.summary ? '<div class="video-desc">' + markdown(v.summary).html + "</div>" : "") +
        '<section class="comments" aria-labelledby="c-title"><h2 id="c-title">' + plural(v.comments, "comment") + '</h2><div id="c-body"></div></section></article>';
      renderPlayer(v);
      renderComments(v);
      $("#share-btn").addEventListener("click", function () {
        var url = location.href;
        if (navigator.share) navigator.share({ title: v.title, url: url }).catch(function () {});
        else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { $("#share-btn").innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Link copied'; });
      });
      $("#like-btn").addEventListener("click", function () {
        var b = $("#like-btn");
        b.disabled = true;
        api("like", { id: v.id }).then(function (r) {
          b.disabled = false;
          b.setAttribute("aria-pressed", String(r.liked));
          b.querySelector("i").className = "fa-" + (r.liked ? "solid" : "regular") + " fa-thumbs-up";
          $("#like-n").textContent = r.likes;
        }).catch(function (e) { b.disabled = false; alert(e.message); });
      });
    }).catch(function (e) { errorBox(e.status === 404 ? "That video was not found." : e.message); });
  }

  function renderPlayer(v) {
    var p = $("#player");
    if (v.unlocked) {
      p.innerHTML = '<video controls playsinline preload="metadata" controlslist="nodownload nofullscreen noremoteplayback" disablepictureinpicture disableremoteplayback' + (v.poster ? ' poster="../portal/' + esc(v.poster) + '"' : "") +
        ' src="../portal/learn.php?action=stream&amp;id=' + v.id + '"></video>';
      var video = p.querySelector("video");
      video.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      watermark(p, video, "Marzley Tech Solutions");
      return;
    }
    p.innerHTML = '<div class="locked"' + (v.poster ? ' style="background-image:url(\'../portal/' + esc(v.poster) + '\')"' : "") + '><div class="lock-card">' +
      '<i class="fa-solid fa-lock" aria-hidden="true"></i><h2>Unlock this video for ' + ksh(v.price) + '</h2><p>Pay once with M-Pesa and watch any time, plus join the comments.</p><div id="unlock-area"></div></div></div>';
    unlockArea(v);
  }

  /**
   * "Marzley Tech Solutions" drifting across the video (plus a faint tiled copy that can't be
   * cropped out), so any screen recording is branded as ours. Fullscreen goes through
   * our own button, which keeps the watermark on screen (the browser's own fullscreen would hide it).
   */
  function watermark(box, video, text) {
    if (!text) return;
    var tile = document.createElement("canvas");
    tile.width = 460; tile.height = 220;
    var g = tile.getContext("2d");
    g.translate(230, 110); g.rotate(-0.35);
    g.font = "600 15px system-ui, sans-serif"; g.textAlign = "center";
    g.fillStyle = "rgba(255,255,255,0.07)"; g.fillText(text, 0, 0);
    var layer = el('<div class="wm" aria-hidden="true"><div class="wm-tile"></div><span class="wm-tag"></span></div>');
    layer.querySelector(".wm-tile").style.backgroundImage = "url(" + tile.toDataURL() + ")";
    var tag = layer.querySelector(".wm-tag");
    tag.textContent = text;
    box.appendChild(layer);
    var move = function () {
      tag.style.opacity = "0";
      setTimeout(function () {
        tag.style.left = (4 + Math.random() * 56) + "%";
        tag.style.top = (6 + Math.random() * 70) + "%";
        tag.style.opacity = "";
      }, 400);
    };
    move();
    var timer = setInterval(move, 7000);
    // If someone removes or hides the watermark in the browser's tools, the video stops
    var guard = new MutationObserver(function () {
      var gone = !box.contains(layer) || !layer.contains(tag) || getComputedStyle(layer).display === "none" || getComputedStyle(tag).visibility === "hidden" || tag.textContent !== text;
      if (gone) { video.pause(); video.removeAttribute("src"); video.load(); box.innerHTML = '<div class="empty"><p>The video stopped. Please reload the page.</p></div>'; guard.disconnect(); }
    });
    guard.observe(box, { childList: true, subtree: true, attributes: true, characterData: true });
    cleanup.push(function () { clearInterval(timer); guard.disconnect(); });

    var fs = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    if (fs) {
      var btn = el('<button type="button" class="wm-full" title="Full screen (F)"><i class="fa-solid fa-expand" aria-hidden="true"></i><span class="sr-only">Full screen</span></button>');
      box.appendChild(btn);
      var toggle = function () {
        var cur = document.fullscreenElement || document.webkitFullscreenElement;
        if (cur) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        else (box.requestFullscreen || box.webkitRequestFullscreen).call(box);
      };
      btn.addEventListener("click", toggle);
      video.addEventListener("dblclick", function (e) { e.preventDefault(); toggle(); });
      var onKey = function (e) { if ((e.key === "f" || e.key === "F") && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) toggle(); };
      document.addEventListener("keydown", onKey);
      var onFs = function () {
        // The player's own fullscreen button would show the bare video without the watermark: switch to ours
        if ((document.fullscreenElement || document.webkitFullscreenElement) === video) {
          var ex = (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          Promise.resolve(ex).then(function () { return (box.requestFullscreen || box.webkitRequestFullscreen).call(box); }).catch(function () {
            var hint = el('<p class="wm-hint" role="status">For full screen, use this button <i class="fa-solid fa-arrow-up-right" aria-hidden="true"></i></p>');
            box.appendChild(hint);
            btn.classList.add("pulse");
            setTimeout(function () { hint.remove(); btn.classList.remove("pulse"); }, 3500);
          });
          return;
        }
        btn.querySelector("i").className = "fa-solid " + ((document.fullscreenElement || document.webkitFullscreenElement) ? "fa-compress" : "fa-expand"); };
      document.addEventListener("fullscreenchange", onFs);
      document.addEventListener("webkitfullscreenchange", onFs);
      cleanup.push(function () { document.removeEventListener("keydown", onKey); document.removeEventListener("fullscreenchange", onFs); document.removeEventListener("webkitfullscreenchange", onFs); });
    }
    // iPhones only have the built-in fullscreen player, which would hide the watermark: keep it inline
    video.addEventListener("webkitbeginfullscreen", function () { try { video.webkitExitFullscreen(); } catch (e) {} });
  }

  function unlockArea(v) {
    var area = $("#unlock-area");
    if (!state.me) {
      area.innerHTML = '<button type="button" class="btn btn-solid" id="u-signin">Sign in to unlock</button><p class="small">Free account. Takes a minute.</p>';
      $("#u-signin").addEventListener("click", function () { openSignin("Sign in first, then pay with M-Pesa to unlock the video."); });
      return;
    }
    if (!state.mpesa) {
      area.innerHTML = '<p>Online payment is being set up. <a href="https://wa.me/254745789590?text=' + encodeURIComponent("Hello Marzley, I'd like to unlock the video: " + v.title) + '" target="_blank" rel="noopener noreferrer">WhatsApp us</a> to unlock it.</p>';
      return;
    }
    area.innerHTML = '<form class="unlock-form" id="unlock-form" novalidate><label for="u-phone">M-Pesa phone number</label><div class="unlock-row"><input id="u-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Enter your phone number" value="' + esc(store.get("phone") || "") + '" required />' +
      '<button type="submit" class="btn btn-solid" id="u-pay">Pay ' + ksh(v.price) + '</button></div><p class="u-msg" id="u-msg" role="status" aria-live="polite"></p></form>';
    $("#unlock-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var phone = $("#u-phone").value.trim(), msg = $("#u-msg"), btn = $("#u-pay");
      if (phone.replace(/\D/g, "").length < 9) { msg.textContent = "Enter your M-Pesa number, for example 0712 345 678."; $("#u-phone").focus(); return; }
      store.set("phone", phone);
      btn.disabled = true;
      msg.innerHTML = '<span class="spinner sm" aria-hidden="true"></span> Sending the M-Pesa prompt…';
      api("unlock", { id: v.id, phone: phone }).then(function (r) {
        if (r.status === "paid") return location.reload();
        msg.innerHTML = '<span class="spinner sm" aria-hidden="true"></span> Check your phone and enter your M-Pesa PIN to pay ' + ksh(v.price) + ".";
        var tries = 0;
        var poll = setInterval(function () {
          tries++;
          api("unlock_status", undefined, "&checkout=" + encodeURIComponent(r.checkout_id)).then(function (s) {
            if (s.unlocked) { clearInterval(poll); msg.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Paid! Unlocking…'; setTimeout(function () { pageVideo(v.id); }, 700); }
            else if (s.status === "failed" || s.status === "mismatch") { clearInterval(poll); btn.disabled = false; msg.textContent = "The payment didn’t go through. Please try again."; }
            else if (tries > 40) { clearInterval(poll); btn.disabled = false; msg.textContent = "We haven’t received the payment yet. If you paid, refresh this page in a minute."; }
          }).catch(function () {});
        }, 3000);
        cleanup.push(function () { clearInterval(poll); });
      }).catch(function (err) { btn.disabled = false; msg.textContent = err.message; });
    });
  }

  function renderComments(v) {
    var box = $("#c-body");
    if (!v.unlocked) {
      box.innerHTML = '<p class="muted"><i class="fa-solid fa-lock" aria-hidden="true"></i> Comments are open to people who unlocked this video.</p>';
      return;
    }
    var list = v.comment_list.map(function (c) {
      return '<li class="comment' + (c.hidden ? " is-hidden" : "") + '"><span class="avatar" aria-hidden="true">' + esc((c.name || "?").charAt(0).toUpperCase()) + '</span><div><p class="c-head"><strong>' + esc(c.name) + "</strong> <span>" + esc(timeAgo(c.created_at)) + "</span>" + (c.hidden ? ' <span class="tag">Hidden</span>' : "") + "</p>" +
        '<p class="c-text">' + esc(c.body).replace(/\n/g, "<br>") + "</p>" + (c.mine || state.editor ? '<button type="button" class="linklike c-del" data-id="' + c.id + '">Delete</button>' : "") + "</div></li>";
    }).join("");
    box.innerHTML = '<form class="c-form" id="c-form" novalidate><span class="avatar" aria-hidden="true">' + esc(((state.me && state.me.name) || "?").charAt(0).toUpperCase()) + '</span><div class="c-field"><label for="c-text" class="sr-only">Add a comment</label>' +
      '<textarea id="c-text" rows="2" maxlength="2000" placeholder="Add a comment or ask a question…"></textarea><div class="c-actions"><p class="u-msg" id="c-msg" role="status" aria-live="polite"></p><button type="submit" class="btn btn-solid btn-sm">Comment</button></div></div></form>' +
      '<ul class="comment-list">' + (list || '<li class="muted">No comments yet. Be the first.</li>') + "</ul>";
    $("#c-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var t = $("#c-text").value.trim();
      if (!t) { $("#c-text").focus(); return; }
      api("comment", { id: v.id, body: t }).then(function () { pageVideo(v.id); }).catch(function (err) { $("#c-msg").textContent = err.message; });
    });
    box.querySelectorAll(".c-del").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!confirm("Delete this comment?")) return;
        api("comment_delete", { id: Number(b.getAttribute("data-id")) }).then(function () { pageVideo(v.id); }).catch(function (err) { alert(err.message); });
      });
    });
  }

  // ---------- notes and books ----------
  function noteCard(n, lvl) {
    var hx = lvl || "h3";
    return '<a class="note-card" href="./?note=' + n.id + '"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i><div><' + hx + ">" + esc(n.title) + (Number(n.published) ? "" : ' <span class="tag">Draft</span>') + "</" + hx + ">" +
      (n.summary ? "<p>" + esc(n.summary) + "</p>" : "") + '<p class="meta">PDF · ' + fmtSize(n.size) + " · Free</p></div></a>";
  }
  function pageNotes() {
    setNav("notes");
    showSide(false);
    setTitle("Free notes and books", "Free programming notes and books. Read them online or download the PDF.");
    main.innerHTML = '<section class="list-page"><h1>Notes &amp; books</h1><p class="lead">Free to read here or download. New notes are added regularly.</p><div class="note-grid" id="note-grid"><p class="muted">Loading…</p></div></section>';
    api("notes").then(function (j) {
      $("#note-grid").innerHTML = (j.notes || []).map(function (n) { return noteCard(n, "h2"); }).join("") || '<div class="empty"><i class="fa-solid fa-book" aria-hidden="true"></i><p>Notes are coming soon.</p></div>';
    }).catch(function (e) { $("#note-grid").innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
  }

  var pdfLib = null;
  function pageNote(id) {
    setNav("notes");
    showSide(false);
    main.innerHTML = '<p class="learn-loading"><span class="spinner" aria-hidden="true"></span> Loading…</p>';
    api("notes").then(function (j) {
      var n = (j.notes || []).filter(function (x) { return String(x.id) === String(id); })[0];
      if (!n) return errorBox("Those notes were not found.");
      setTitle(n.title, n.summary || "Free notes: " + n.title);
      var src = "../portal/learn.php?action=note&id=" + n.id;
      main.innerHTML = '<article class="reader"><p class="crumbs"><a href="./?page=notes">Notes</a></p><div class="reader-head"><div><h1>' + esc(n.title) + "</h1>" + (n.summary ? '<p class="muted">' + esc(n.summary) + "</p>" : "") + "</div>" +
        '<div class="reader-tools"><button type="button" class="icon-btn" id="z-out" title="Smaller"><i class="fa-solid fa-magnifying-glass-minus" aria-hidden="true"></i><span class="sr-only">Zoom out</span></button>' +
        '<span id="z-val" class="z-val">100%</span><button type="button" class="icon-btn" id="z-in" title="Bigger"><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i><span class="sr-only">Zoom in</span></button>' +
        '<span class="pg" id="pg"></span><a class="btn btn-solid btn-sm" href="' + src + '&amp;dl=1" download><i class="fa-solid fa-download" aria-hidden="true"></i> Download</a></div></div>' +
        '<div class="pages" id="pages"><p class="learn-loading"><span class="spinner" aria-hidden="true"></span> Opening the PDF…</p></div></article>';
      var load = pdfLib ? Promise.resolve(pdfLib) : import("../vendor/pdfjs/pdf.min.mjs").then(function (m) { m.GlobalWorkerOptions.workerSrc = "../vendor/pdfjs/pdf.worker.min.mjs"; pdfLib = m; return m; });
      load.then(function (lib) { return lib.getDocument({ url: src, isEvalSupported: false, withCredentials: true }).promise; }).then(function (doc) { showPdf(doc); })
        .catch(function () { $("#pages").innerHTML = '<div class="empty"><p>This PDF could not be shown here.</p><p><a class="btn btn-solid btn-sm" href="' + src + '" target="_blank" rel="noopener">Open the PDF</a></p></div>'; });
    }).catch(function (e) { errorBox(e.message); });
  }

  function showPdf(doc) {
    var box = $("#pages"), zoom = 1, rendered = {}, tasks = {};
    box.innerHTML = "";
    $("#pg").textContent = doc.numPages + " page" + (doc.numPages === 1 ? "" : "s");
    doc.getPage(1).then(function (first) {
      var base = first.getViewport({ scale: 1 });
      var holders = [];
      for (var i = 1; i <= doc.numPages; i++) {
        var h = el('<div class="page" data-page="' + i + '"><span class="pnum">' + i + "</span></div>");
        box.appendChild(h);
        holders.push(h);
      }
      var size = function () {
        var w = Math.min(box.clientWidth, 900) * zoom;
        holders.forEach(function (h) { h.style.width = w + "px"; h.style.height = (w * base.height / base.width) + "px"; });
        $("#z-val").textContent = Math.round(zoom * 100) + "%";
      };
      var draw = function (h) {
        var n = Number(h.getAttribute("data-page"));
        if (rendered[n] === zoom) return;
        rendered[n] = zoom;
        doc.getPage(n).then(function (page) {
          var w = h.clientWidth, vp1 = page.getViewport({ scale: 1 }), scale = w / vp1.width, dpr = Math.min(window.devicePixelRatio || 1, 2);
          var vp = page.getViewport({ scale: scale * dpr });
          var c = document.createElement("canvas");
          c.width = Math.floor(vp.width);
          c.height = Math.floor(vp.height);
          c.setAttribute("aria-label", "Page " + n);
          c.setAttribute("role", "img");
          if (tasks[n]) try { tasks[n].cancel(); } catch (e) {}
          tasks[n] = page.render({ canvasContext: c.getContext("2d"), viewport: vp });
          tasks[n].promise.then(function () { var old = h.querySelector("canvas"); if (old) old.remove(); h.appendChild(c); }).catch(function () {});
        });
      };
      size();
      var io = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) draw(e.target); }); }, { rootMargin: "600px 0px" });
      holders.forEach(function (h) { io.observe(h); });
      cleanup.push(function () { io.disconnect(); doc.destroy(); });
      var rezoom = function (z) {
        zoom = Math.max(0.5, Math.min(2.5, z));
        size();
        holders.forEach(function (h) { var r = h.getBoundingClientRect(); if (r.bottom > -600 && r.top < innerHeight + 600) draw(h); });
      };
      $("#z-in").addEventListener("click", function () { rezoom(zoom + 0.25); });
      $("#z-out").addEventListener("click", function () { rezoom(zoom - 0.25); });
      var rt;
      var onResize = function () { clearTimeout(rt); rt = setTimeout(function () { rendered = {}; rezoom(zoom); }, 200); };
      window.addEventListener("resize", onResize);
      cleanup.push(function () { window.removeEventListener("resize", onResize); });
    });
  }

  // ---------- signing in ----------
  var dlg = document.getElementById("signin-dialog");
  function openSignin(why) {
    $("#signin-why").textContent = why || "It’s free. Save your progress, unlock videos, like and comment.";
    $("#c-msg").textContent = "";
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    loadGsi();
  }
  function loadGsi() {
    var cid = state.googleClientId;
    if (!cid) { $("#gsi-box").hidden = true; $(".or").hidden = true; return; }
    var render = function () {
      try {
        window.google.accounts.id.initialize({ client_id: cid, callback: function (resp) {
          api("google", { credential: resp.credential }).then(signedIn).catch(function (e) { $("#c-msg").textContent = e.message; });
        } });
        window.google.accounts.id.renderButton($("#gsi-box"), { theme: isDark() ? "filled_black" : "outline", size: "large", text: "continue_with", shape: "pill", width: 280 });
      } catch (e) {}
    };
    if (window.google && window.google.accounts) return render();
    if (state.gsiLoaded) return;
    state.gsiLoaded = true;
    var s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = render;
    s.onerror = function () { $("#gsi-box").hidden = true; $(".or").hidden = true; };
    document.head.appendChild(s);
  }
  var codeSent = false;
  $("#code-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("#c-email").value.trim(), msg = $("#c-msg"), btn = $("#c-btn");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Please enter a valid email address."; $("#c-email").focus(); return; }
    btn.disabled = true;
    if (!codeSent) {
      api("code_request", { email: email }).then(function (r) {
        codeSent = true;
        btn.disabled = false;
        msg.textContent = r.message;
        $("#c-code-row").hidden = false;
        btn.textContent = "Sign in";
        $("#c-code").focus();
      }).catch(function (err) { btn.disabled = false; msg.textContent = err.message; });
      return;
    }
    api("code_verify", { email: email, code: $("#c-code").value, name: $("#c-name").value.trim() }).then(function (r) { btn.disabled = false; signedIn(r); })
      .catch(function (err) { btn.disabled = false; msg.textContent = err.message; });
  });
  $("#c-email").addEventListener("input", function () { if (codeSent) { codeSent = false; $("#c-code-row").hidden = true; $("#c-btn").textContent = "Email me a code"; } });

  function signedIn(r) {
    state.me = r.learner;
    try { dlg.close(); } catch (e) { dlg.removeAttribute("open"); }
    // Bring progress made before signing in to the account
    var local = loadLocalProgress();
    refreshMe().then(function () {
      local.filter(function (id) { return !isDone(id); }).forEach(function (id) { markDone(id); });
      route();
    });
  }

  function refreshMe() {
    return api("me").then(function (j) {
      state.me = j.learner;
      state.editor = !!j.editor;
      state.mpesa = !!j.mpesa;
      state.googleClientId = j.google_client_id;
      state.progress = j.learner ? (j.progress || []).map(Number) : loadLocalProgress();
      updateUser();
    }).catch(function () {
      state.progress = loadLocalProgress();
      updateUser();
    });
  }
  function updateUser() {
    var me = state.me;
    $("#signin-btn").hidden = !!me;
    $("#user-menu").hidden = !me;
    $("#manage-link").hidden = !state.editor;
    if (!me) return;
    var name = me.name || me.email;
    $("#user-avatar").textContent = name.charAt(0).toUpperCase();
    $("#user-label").textContent = "Account: " + name;
    $("#user-name").textContent = me.name || "Learner";
    $("#user-email").textContent = me.email;
    $("#user-progress").textContent = state.progress.length + " lesson" + (state.progress.length === 1 ? "" : "s") + " completed";
  }
  $("#signin-btn").addEventListener("click", function () { openSignin(); });
  $("#user-btn").addEventListener("click", function () {
    var pop = $("#user-pop"), open = pop.hidden;
    pop.hidden = !open;
    $("#user-btn").setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) { if (!e.target.closest("#user-menu")) { $("#user-pop").hidden = true; $("#user-btn").setAttribute("aria-expanded", "false"); } });
  $("#signout-btn").addEventListener("click", function () {
    api("logout", {}).then(function () { state.me = null; state.progress = loadLocalProgress(); updateUser(); $("#user-pop").hidden = true; route(); });
  });

  // Theme (shared with the rest of the site)
  var themeBtn = $("#theme-btn");
  var syncTheme = function () { themeBtn.setAttribute("aria-pressed", String(isDark())); themeBtn.querySelector("i").className = "fa-solid " + (isDark() ? "fa-sun" : "fa-moon"); };
  themeBtn.addEventListener("click", function () {
    var dark = !isDark();
    if (dark) document.documentElement.setAttribute("data-theme", "dark"); else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("marzley-theme", dark ? "dark" : "light"); } catch (e) {}
    syncTheme();
  });
  syncTheme();

  // ---------- routing (real links, so every lesson has its own address) ----------
  function go(url, replace) {
    history[replace ? "replaceState" : "pushState"](null, "", url);
    route();
    if (!replace) window.scrollTo(0, 0);
  }
  function route() {
    while (cleanup.length) { try { cleanup.pop()(); } catch (e) {} }
    setCanonical();
    var p = new URLSearchParams(location.search);
    if (p.get("track")) return pageLesson(p.get("track"), p.get("lesson"));
    if (p.get("video")) return pageVideo(p.get("video"));
    if (p.get("note")) return pageNote(p.get("note"));
    var page = p.get("page");
    if (page === "tutorials") return pageTutorials();
    if (page === "practice") return pagePractice(p.get("lang"));
    if (page === "videos") return pageVideos();
    if (page === "notes") return pageNotes();
    pageHome();
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
    var url = new URL(a.getAttribute("href"), location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    if (!url.search && url.hash) return;
    e.preventDefault();
    closeSide();
    go(url.pathname + url.search);
  });
  window.addEventListener("popstate", route);

  refreshMe().then(route);
})();
