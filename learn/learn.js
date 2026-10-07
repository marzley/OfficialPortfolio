/* Marzley Tech learning hub: tutorials with live code, practice, videos (unlocked with M-Pesa) and free notes.
 * Learner code never runs on this page: it runs in runner.html, a sandboxed frame with no access to the site. */
(function () {
  "use strict";
  var API = "../portal/learn.php?action=";
  var LANGS = { html: "HTML", css: "CSS", javascript: "JavaScript", python: "Python", sql: "SQL", php: "PHP", typescript: "TypeScript", react: "React", json: "JSON", markdown: "Markdown", c: "C", cpp: "C++", csharp: "C#", java: "Java", go: "Go", rust: "Rust", kotlin: "Kotlin", lua: "Lua", ruby: "Ruby", sass: "Sass", regex: "Regex", prolog: "Prolog" };
  var TRACK_ICONS = { html: "fa-brands fa-html5", css: "fa-brands fa-css3-alt", javascript: "fa-brands fa-js", python: "fa-brands fa-python", sql: "fa-solid fa-database",
    networking: "fa-solid fa-network-wired", "make-money-online": "fa-solid fa-sack-dollar", git: "fa-brands fa-git-alt", linux: "fa-brands fa-linux", php: "fa-brands fa-php",
    cybersecurity: "fa-solid fa-shield-halved", hosting: "fa-solid fa-server", marketing: "fa-solid fa-bullhorn", "it-basics": "fa-solid fa-computer",
    "web-design": "fa-solid fa-pen-ruler", "graphic-design": "fa-solid fa-palette", algorithms: "fa-solid fa-diagram-project", typescript: "fa-solid fa-code",
    "app-dev-basics": "fa-solid fa-mobile-screen-button", flutter: "fa-solid fa-layer-group", "kotlin-android": "fa-brands fa-android", react: "fa-brands fa-react",
    "react-native": "fa-solid fa-mobile", "apis-backend": "fa-solid fa-plug", "artificial-intelligence": "fa-solid fa-brain",
    java: "fa-brands fa-java", "c-programming": "fa-solid fa-microchip", cpp: "fa-solid fa-gears", csharp: "fa-brands fa-microsoft", "dart-flutter": "fa-solid fa-mobile-screen",
    go: "fa-brands fa-golang", "digital-literacy": "fa-solid fa-user-shield", "ms-word": "fa-solid fa-file-word", excel: "fa-solid fa-table",
    powerpoint: "fa-solid fa-person-chalkboard", "google-workspace": "fa-solid fa-cloud", "ai-tools": "fa-solid fa-robot", "e-services-kenya": "fa-solid fa-landmark",
    "computer-maintenance": "fa-solid fa-screwdriver-wrench", "earn-online": "fa-solid fa-hand-holding-dollar",
    projects: "fa-solid fa-hammer", "career-roadmaps": "fa-solid fa-route" };
  var TRACK_GROUPS = [
    { title: "Career roadmaps & projects", icon: "fa-solid fa-route", slugs: ["career-roadmaps", "projects"] },
    { title: "Web & coding", icon: "fa-solid fa-code", slugs: ["html", "css", "javascript", "python", "sql", "php", "typescript", "algorithms", "git"] },
    { title: "App development", icon: "fa-solid fa-mobile-screen-button", slugs: ["app-dev-basics", "dart-flutter", "flutter", "kotlin-android", "react", "react-native", "apis-backend"] },
    { title: "Artificial intelligence (AI)", icon: "fa-solid fa-brain", slugs: ["artificial-intelligence", "ai-tools"] },
    { title: "More programming languages", icon: "fa-solid fa-laptop-code", slugs: ["java", "c-programming", "cpp", "csharp", "go"] },
    { title: "Design", icon: "fa-solid fa-palette", slugs: ["web-design", "graphic-design"] },
    { title: "ICT & digital skills", icon: "fa-solid fa-computer", slugs: ["earn-online", "it-basics", "digital-literacy", "ms-word", "excel", "powerpoint", "google-workspace", "e-services-kenya", "computer-maintenance"] },
    { title: "Networking, systems & security", icon: "fa-solid fa-network-wired", slugs: ["networking", "linux", "cybersecurity", "hosting"] },
    { title: "Business & earning online", icon: "fa-solid fa-sack-dollar", slugs: ["make-money-online", "marketing"] }
  ];
  // Career roadmaps and the projects subject, shown on the hub home page
  var PATHS = [
    ["career-roadmaps", "web-developer-roadmap", "fa-solid fa-code", "Web developer", "HTML, CSS, JavaScript, PHP or Node, SQL, M-Pesa, deployment"],
    ["career-roadmaps", "data-analyst-roadmap", "fa-solid fa-chart-column", "Data analyst", "Excel, SQL, dashboards, Python, real data projects"],
    ["career-roadmaps", "cybersecurity-roadmap", "fa-solid fa-shield-halved", "Cybersecurity", "Networking, Linux, security skills, labs, certifications"],
    ["career-roadmaps", "mobile-app-developer-roadmap", "fa-solid fa-mobile-screen-button", "Mobile app developer", "Flutter, Kotlin or React Native to the Play Store"],
    ["career-roadmaps", "it-support-networking-roadmap", "fa-solid fa-screwdriver-wrench", "IT support & networking", "Hardware, Windows, networks, helpdesk jobs"],
    ["projects", "how-to-build-projects", "fa-solid fa-hammer", "Build real projects", "14 step-by-step portfolio projects: shop, M-Pesa, school system, API, app"]
  ];
  /** Subjects sorted into TRACK_GROUPS (plus "More subjects" for any new ones), empty groups left out. */
  function groupTracks(tracks) {
    var groups = TRACK_GROUPS.map(function (g) { return { title: g.title, icon: g.icon, items: [] }; }), other = { title: "More subjects", icon: "fa-solid fa-book", items: [] };
    tracks.forEach(function (t) {
      var gi = -1;
      TRACK_GROUPS.forEach(function (g, i) { if (g.slugs.indexOf(t.slug) >= 0) gi = i; });
      (gi >= 0 ? groups[gi] : other).items.push(t);
    });
    groups.forEach(function (g, i) { var order = TRACK_GROUPS[i].slugs; g.items.sort(function (a, b) { return order.indexOf(a.slug) - order.indexOf(b.slug); }); });
    groups.push(other);
    return groups.filter(function (g) { return g.items.length; });
  }
  // Where learners can run languages this site can't run in the browser
  var PLAYGROUNDS = { typescript: ["TypeScript Playground", "https://www.typescriptlang.org/play"], java: ["OnlineGDB (Java)", "https://www.onlinegdb.com/online_java_compiler"],
    "c-programming": ["OnlineGDB (C)", "https://www.onlinegdb.com/online_c_compiler"], cpp: ["OnlineGDB (C++)", "https://www.onlinegdb.com/online_c++_compiler"],
    csharp: [".NET Fiddle", "https://dotnetfiddle.net/"], "dart-flutter": ["DartPad", "https://dartpad.dev/"], flutter: ["DartPad (Flutter)", "https://dartpad.dev/"],
    "kotlin-android": ["Kotlin Playground", "https://play.kotlinlang.org/"], "react-native": ["Expo Snack", "https://snack.expo.dev/"], go: ["Go Playground", "https://go.dev/play/"],
    php: ["OnlineGDB (PHP)", "https://www.onlinegdb.com/online_php_interpreter"] };
  var MODES = { html: "htmlmixed", css: "htmlmixed", javascript: "javascript", python: "python", sql: "text/x-sql", php: "application/x-httpd-php", typescript: "text/typescript", react: "jsx", json: "application/json", markdown: "markdown", c: "text/x-csrc", cpp: "text/x-c++src", csharp: "text/x-csharp", java: "text/x-java", go: "text/x-go", rust: "text/x-rustsrc", kotlin: "text/x-kotlin", lua: "text/x-lua", ruby: "text/x-ruby", sass: "text/x-scss", regex: "text/plain", prolog: "text/plain" };
  var STARTERS = {
    html: "<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello!</h1>\n  <p>Edit me and press Run.</p>\n</body>\n</html>",
    css: "<style>\n  h1 { color: #0b1b35; font-family: sans-serif; }\n  .box { padding: 16px; background: #fff7e0; border: 2px solid #ffb800; border-radius: 12px; }\n</style>\n<h1>Styling practice</h1>\n<div class=\"box\">Change my colours.</div>",
    javascript: "const items = [\"Unga\", \"Sugar\", \"Milk\"];\nfor (const item of items) {\n  console.log(\"Buy \" + item);\n}",
    python: "name = \"Kenya\"\nfor i in range(3):\n    print(f\"{i + 1}. Habari, {name}!\")",
    sql: "SELECT c.Name, p.Name AS Product, o.Quantity\nFROM Orders o\nJOIN Customers c ON c.CustomerID = o.CustomerID\nJOIN Products p ON p.ProductID = o.ProductID;"
,
    php: "<?php\n$name = \"Kenya\";\n$prices = [\"Unga\" => 180, \"Sugar\" => 150, \"Milk\" => 60];\n\necho \"Habari, $name!\\n\";\nforeach ($prices as $item => $price) {\n    echo \"$item: KSh \" . number_format($price) . \"\\n\";\n}\necho \"Total: KSh \" . array_sum($prices);",
    typescript: "type Product = { name: string; price: number; stock: number };\n\nconst products: Product[] = [\n  { name: \"Unga 2kg\", price: 180, stock: 12 },\n  { name: \"Sugar 1kg\", price: 150, stock: 0 },\n];\n\nfunction inStock(list: Product[]): string[] {\n  return list.filter(p => p.stock > 0).map(p => p.name);\n}\n\nconsole.log(\"In stock:\", inStock(products));",
    react: "const { useState } = React;\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div style={{ fontFamily: \"sans-serif\" }}>\n      <h2>Items in cart: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>Add item</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.getElementById(\"root\")).render(<Counter />);",
    json: "{\n  \"shop\": \"Mama Mboga\",\n  \"town\": \"Nakuru\",\n  \"open\": true,\n  \"products\": [\n    { \"name\": \"Sukuma\", \"price\": 20 },\n    { \"name\": \"Tomatoes\", \"price\": 10 }\n  ]\n}",
    markdown: "# My shop\n\nWe sell **fresh vegetables** in *Nakuru*.\n\n## Prices\n\n| Item | Price |\n|------|-------|\n| Sukuma | KSh 20 |\n| Tomatoes | KSh 10 |\n\n- Open daily\n- Pay with M-Pesa\n\n> Order on WhatsApp: 0712 345 678"
  };

  Object.assign(STARTERS, {
    "c": "#include <stdio.h>\n\nint main() {\n    int prices[] = {180, 150, 60};\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        total += prices[i];\n    }\n    printf(\"Habari, Kenya!\\n\");\n    printf(\"Total: KSh %d\\n\", total);\n    return 0;\n}",
    "cpp": "#include <iostream>\nusing namespace std;\n\nint square(int x) {\n    return x * x;\n}\n\nint main() {\n    cout << \"Habari, Kenya!\" << endl;\n    for (int i = 1; i <= 5; i++) {\n        cout << i << \" squared is \" << square(i) << endl;\n    }\n    return 0;\n}",
    "csharp": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nclass Program\n{\n    static void Main()\n    {\n        var prices = new Dictionary<string, decimal> { [\"Unga\"] = 180, [\"Sugar\"] = 150, [\"Milk\"] = 60 };\n        foreach (var p in prices)\n            Console.WriteLine($\"{p.Key}: KSh {p.Value}\");\n        Console.WriteLine($\"Total: KSh {prices.Values.Sum()}\");\n    }\n}",
    "java": "import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> towns = List.of(\"Nairobi\", \"Kisumu\", \"Mombasa\");\n        for (String town : towns) {\n            System.out.println(\"Habari, \" + town + \"!\");\n        }\n        System.out.println(\"Towns: \" + towns.size());\n    }\n}",
    "go": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tprices := map[string]int{\"Unga\": 180, \"Sugar\": 150, \"Milk\": 60}\n\ttotal := 0\n\tfor item, price := range prices {\n\t\tfmt.Printf(\"%s: KSh %d\\n\", item, price)\n\t\ttotal += price\n\t}\n\tfmt.Println(\"Total:\", total)\n}",
    "rust": "fn main() {\n    let prices = vec![180, 150, 60];\n    let total: i32 = prices.iter().sum();\n    for (i, p) in prices.iter().enumerate() {\n        println!(\"Item {}: KSh {}\", i + 1, p);\n    }\n    println!(\"Total: KSh {}\", total);\n}",
    "kotlin": "data class Product(val name: String, val price: Int)\n\nfun main() {\n    val products = listOf(Product(\"Unga\", 180), Product(\"Sugar\", 150), Product(\"Milk\", 60))\n    products.forEach { println(\"${it.name}: KSh ${it.price}\") }\n    println(\"Total: KSh ${products.sumOf { it.price }}\")\n}",
    "lua": "local prices = { Unga = 180, Sugar = 150, Milk = 60 }\nlocal total = 0\nfor item, price in pairs(prices) do\n  print(item .. \": KSh \" .. price)\n  total = total + price\nend\nprint(\"Total: KSh \" .. total)",
    "ruby": "prices = { \"Unga\" => 180, \"Sugar\" => 150, \"Milk\" => 60 }\n\nprices.each do |item, price|\n  puts \"#{item}: KSh #{price}\"\nend\nputs \"Total: KSh #{prices.values.sum}\"\nputs \"Cheapest: #{prices.min_by { |_, p| p }.first}\"",
    "sass": "$brand: #0b1b35;\n$accent: #ffb800;\n$radius: 12px;\n\n@mixin card($pad: 16px) {\n  padding: $pad;\n  border-radius: $radius;\n}\n\n.card {\n  @include card(24px);\n  color: $brand;\n  border: 2px solid $accent;\n\n  h2 { margin: 0; }\n  &:hover { background: $accent; }\n}",
    "regex": "/07\\d{2}\\s?\\d{3}\\s?\\d{3}/g\n---\nCall 0712 345 678 or 0798123456. Office: 020 123 4567.",
    "prolog": "% Facts\nparent(kamau, wanjiku).\nparent(kamau, otieno).\nparent(wanjiku, amina).\n\n% Rules\ngrandparent(X, Z) :- parent(X, Y), parent(Y, Z).\nsibling(X, Y) :- parent(P, X), parent(P, Y), X \\= Y.\n\n% Queries (lines starting with ?-)\n?- grandparent(kamau, Who).\n?- sibling(wanjiku, S)."
  });

  var state = { me: null, csrf: null, editor: false, progress: [], catalog: null, gsiLoaded: false, mpesa: false, notesPrice: 50 };
  var main = document.getElementById("learn-main");
  var side = document.getElementById("learn-side");
  var sideToggle = document.getElementById("side-toggle");
  var scrim = document.getElementById("side-scrim");
  var cleanup = [];   // things to stop when leaving a page (polling, observers)

  // ---------- small helpers ----------
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ksh = function (n) { return "KSh " + Number(n || 0).toLocaleString("en-KE"); };
  var kes = function (n) { return "KES " + Number(n || 0).toLocaleString("en-KE"); };
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
  var CALLOUT = { note: ["fa-circle-info", "Note"], tip: ["fa-lightbulb", "Tip"], warning: ["fa-triangle-exclamation", "Watch out"], example: ["fa-flask", "Example"],
    define: ["fa-book", "Key term"], kenya: ["fa-location-dot", "In Kenya"], career: ["fa-briefcase", "Careers"] };
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
        else if (lang === "youtube") code.forEach(function (l) { var p = l.split("|"); if (p[0].trim()) out.push(ytEmbed(p[0].trim(), (p[1] || "").trim())); });
        else out.push('<pre class="code-sample"><code>' + esc(code.join("\n")) + "</code></pre>");
        continue;
      }
      var box = line.match(/^:::\s*(note|tip|warning|example|think|define|kenya|career)\b\s*(.*)$/);
      if (box) {
        flush();
        var inner = [];
        i++;
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) inner.push(lines[i++]);
        i++;
        var sub = markdown(inner.join("\n"), false), kind = box[1], label = box[2].trim();
        sub.blocks.forEach(function (b) { blocks.push(b); });
        var body = sub.html.replace(/data-try="(\d+)"/g, function (m, n) { return 'data-try="' + (blocks.length - sub.blocks.length + Number(n)) + '"'; });
        if (kind === "think") out.push('<details class="callout callout-think"><summary><i class="fa-solid fa-brain" aria-hidden="true"></i><span><b>Think about it:</b> ' + inline(label) + '</span><em>Show answer</em></summary><div class="callout-body">' + body + "</div></details>");
        else out.push('<aside class="callout callout-' + kind + '"><p class="callout-title"><i class="fa-solid ' + CALLOUT[kind][0] + '" aria-hidden="true"></i> ' + (label ? inline(label) : CALLOUT[kind][1]) + '</p><div class="callout-body">' + body + "</div></aside>");
        continue;
      }
      if (/^\s*-{3,}\s*$/.test(line)) { flush(); out.push("<hr>"); i++; continue; }
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
    var web = lang === "html" || lang === "css" || lang === "javascript" || lang === "typescript" || lang === "react" || lang === "markdown";
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
          resolve({ text: String(e.data.text || ""), ok: !!e.data.ok, error: e.data.error || "", detail: e.data.detail || "" });
        };
        window.addEventListener("message", onMsg);
        self.frame.contentWindow.postMessage({ type: "run", lang: lang, code: code }, "*");
        setTimeout(function () {
          if (done) return;
          window.removeEventListener("message", onMsg);
          // The frame is stuck: throw it away so the next run starts a fresh one
          if (self.frame) { self.frame.remove(); self.frame = null; self.frameLang = null; }
          resolve({ text: "", ok: false, error: "timeout" });
        }, lang === "python" || lang === "php" || lang === "ruby" ? 90000 : lang === "sql" || ONLINE_LANGS[lang] ? 45000 : { c: 1, cpp: 1, lua: 1, sass: 1, prolog: 1, regex: 1 }[lang] ? 70000 : 15000);
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

  // ---------- "What went wrong" helper under the output (learn/help.js does the explaining) ----------
  function clearMarks(ed) {
    if (ed && ed.__errLine != null && ed.removeLineClass) { ed.removeLineClass(ed.__errLine, "background", "cm-err-line"); ed.__errLine = null; }
  }
  function renderHelp(box, lang, code, r, ed) {
    if (!box) return;
    clearMarks(ed);
    box.innerHTML = "";
    box.hidden = true;
    var H = window.MarzleyHelp;
    if (!H) return;
    var hit = r && !r.ok ? H.explain(lang, code, r) : null;
    var tips = (lang === "html" || lang === "css") ? H.lint(lang, code) : [];
    if (!hit && !tips.length) return;
    var html = "";
    if (hit) {
      if (hit.line && ed && ed.addLineClass) { ed.addLineClass(hit.line - 1, "background", "cm-err-line"); ed.__errLine = hit.line - 1; }
      html += '<div class="help-card help-err"><p class="help-title"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ' + esc(hit.title) + "</p>" +
        (hit.line ? '<p class="help-line"><button type="button" class="linklike help-go" data-line="' + hit.line + '">Line ' + hit.line + "</button>" + (hit.lineText ? ": <code>" + esc(hit.lineText.slice(0, 120)) + "</code>" : "") + "</p>" : "") +
        '<p><strong>What went wrong:</strong> ' + esc(hit.why) + '</p><p><strong>How to fix it:</strong> ' + esc(hit.fix) + "</p>" +
        (hit.example ? '<p class="help-ex-label">Example:</p><pre class="help-ex"><code>' + esc(hit.example) + "</code></pre>" : "") +
        '<details class="help-raw"><summary>Full error message</summary><pre>' + esc(hit.raw.slice(0, 3000)) + "</pre></details></div>";
    }
    if (tips.length) {
      html += '<div class="help-card help-tips"><p class="help-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> ' + (hit ? "Also check" : "Tips to improve your code") + "</p><ul>" +
        tips.map(function (t) { return "<li>" + (t.line ? '<button type="button" class="linklike help-go" data-line="' + t.line + '">Line ' + t.line + "</button>: " : "") + "<strong>" + esc(t.title) + ".</strong> " + esc(t.fix) + "</li>"; }).join("") + "</ul></div>";
    }
    box.innerHTML = html;
    box.hidden = false;
    box.querySelectorAll(".help-go").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = Number(b.getAttribute("data-line")) - 1;
        if (ed && ed.setCursor) { ed.focus(); ed.setCursor({ line: n, ch: 0 }); ed.scrollIntoView({ line: n, ch: 0 }, 80); }
      });
    });
  }

  /** An editor + Run button + output. opts: { lang, code, title, check } */
  function codeBlock(host, opts) {
    var lang = opts.lang;
    var wrap = el('<div class="try"><div class="try-bar"><span class="try-lang">' + esc(opts.title || ("Try it · " + (LANGS[runLang(lang, opts.code)] || lang))) + '</span>' +
      '<div class="try-btns"><button type="button" class="try-reset" title="Reset the code"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i><span class="sr-only">Reset</span></button>' +
      '<a class="try-open" title="Open in the practice editor" href="./?page=practice&amp;lang=' + esc(lang) + '"><i class="fa-solid fa-up-right-from-square" aria-hidden="true"></i><span class="sr-only">Open in practice</span></a>' +
      '<button type="button" class="btn btn-solid btn-sm try-run"><i class="fa-solid fa-play" aria-hidden="true"></i> Run</button></div></div>' +
      '<div class="try-body"><div class="try-editor"></div><div class="try-output" hidden></div></div><div class="try-help" hidden aria-live="polite"></div></div>');
    host.appendChild(wrap);
    var ed = makeEditor(wrap.querySelector(".try-editor"), opts.code, lang);
    var runner = new Runner(wrap.querySelector(".try-output"));
    var runBtn = wrap.querySelector(".try-run");
    var run = function () {
      runBtn.disabled = true;
      var code = ed.getValue();
      return runner.run(lang, code).then(function (r) { runBtn.disabled = false; renderHelp(wrap.querySelector(".try-help"), runLang(lang, code), code, r, ed); return r; });
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
  function closeSide() { document.body.classList.remove("side-open"); if (!wide.matches) sideToggle.setAttribute("aria-expanded", "false"); scrim.hidden = true; }
  // Wide screens: the button folds the lesson list away (remembered); small screens: it slides the list in over the page
  var wide = window.matchMedia("(min-width: 901px)");
  function syncCollapsed() {
    var folded = store.get("side-folded") === "1";
    document.body.classList.toggle("side-folded", folded);
    if (wide.matches) sideToggle.setAttribute("aria-expanded", String(!folded));
    sideToggle.title = wide.matches ? (folded ? "Show the lesson list" : "Hide the lesson list") : "Lessons";
  }
  function toggleSide() {
    if (wide.matches) {
      store.set("side-folded", document.body.classList.contains("side-folded") ? "0" : "1");
      syncCollapsed();
      return;
    }
    var open = !document.body.classList.contains("side-open");
    document.body.classList.toggle("side-open", open);
    sideToggle.setAttribute("aria-expanded", String(open));
    scrim.hidden = !open;
  }
  sideToggle.addEventListener("click", toggleSide);
  if (wide.addEventListener) wide.addEventListener("change", function () { closeSide(); syncCollapsed(); });
  syncCollapsed();
  side.addEventListener("click", function (e) { if (e.target.closest(".side-fold")) toggleSide(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "[" && !e.ctrlKey && !e.metaKey && !e.altKey && document.body.classList.contains("has-side") && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.closest(".CodeMirror")) toggleSide();
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
  /** One clean address per page for search engines: /learn/?track=…&lesson=…, ?page=…, ?video=…, ?note=…, ?book=… */
  function setCanonical() {
    var p = new URLSearchParams(location.search), keep = new URLSearchParams();
    ["track", "lesson", "video", "note", "book", "page"].forEach(function (k) { if (p.get(k) && !(k === "page" && (p.get("track") || p.get("video") || p.get("note") || p.get("book")))) keep.set(k, p.get(k)); });
    var base = (/marzleytechsolutions\.co\.ke$/.test(location.hostname) ? "https://marzleytechsolutions.co.ke" : location.origin) + location.pathname;
    // Subjects and lessons have static, pre-rendered pages (tools/learn_static.py): those are the canonical addresses
    var url = p.get("track") ? base + encodeURIComponent(p.get("track")) + "/" + (p.get("lesson") ? encodeURIComponent(p.get("lesson")) + "/" : "")
      : base + (keep.toString() ? "?" + keep.toString() : "");
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

  // ---------- live search over every lesson, subject and blog post (data/learn-search.json, built by tools/build_pages.py) ----------
  var searchIndex = null;
  function getSearchIndex() {
    if (!searchIndex) searchIndex = fetch("../data/learn-search.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("Search could not load."); return r.json(); }).then(function (d) {
      var names = {};
      (d.tracks || []).forEach(function (t) { names[t[0]] = t[1]; });
      return {
        names: names,
        tracks: (d.tracks || []).map(function (t) { return { slug: t[0], title: t[1], summary: t[2], hay: (t[1] + " " + t[2]).toLowerCase() }; }),
        lessons: (d.lessons || []).map(function (l) { return { track: l[0], slug: l[1], title: l[2], heads: l[3], text: l[4], t: l[2].toLowerCase(), h: l[3].toLowerCase(), x: l[4].toLowerCase(), n: (names[l[0]] || "").toLowerCase() }; }),
        posts: (d.posts || []).map(function (p) { return { slug: p[0], title: p[1], summary: p[2], tag: p[3], hay: (p[1] + " " + p[2] + " " + p[3]).toLowerCase() }; })
      };
    }).catch(function (e) { searchIndex = null; throw e; });
    return searchIndex;
  }
  function searchWords(q) { return String(q).toLowerCase().replace(/[^\w#+.\-\s]/g, " ").split(/\s+/).filter(function (w) { return w.length > 0; }).slice(0, 8); }
  function countOf(hay, w) { var n = 0, i = hay.indexOf(w); while (i >= 0 && n < 20) { n++; i = hay.indexOf(w, i + w.length); } return n; }
  /** Every word must appear somewhere; titles count most, then headings, the subject name, then the text. */
  function searchRun(ix, q, limit) {
    var words = searchWords(q), phrase = String(q).toLowerCase().trim();
    if (!words.length) return { tracks: [], lessons: [], posts: [], total: 0 };
    var every = function (hay) { return words.every(function (w) { return hay.indexOf(w) >= 0; }); };
    var lessons = [];
    ix.lessons.forEach(function (l) {
      if (!every(l.t + " " + l.h + " " + l.n + " " + l.x)) return;
      var score = 0;
      words.forEach(function (w) { score += (l.t.indexOf(w) >= 0 ? 12 : 0) + (l.h.indexOf(w) >= 0 ? 5 : 0) + (l.n.indexOf(w) >= 0 ? 4 : 0) + Math.min(countOf(l.x, w), 10); });
      if (l.t.indexOf(phrase) >= 0) score += 30;
      if (l.t.indexOf(phrase) === 0) score += 10;
      lessons.push({ l: l, score: score });
    });
    lessons.sort(function (a, b) { return b.score - a.score; });
    return {
      tracks: ix.tracks.filter(function (t) { return every(t.hay); }).slice(0, 4),
      posts: ix.posts.filter(function (p) { return every(p.hay); }).slice(0, limit > 20 ? 10 : 3),
      lessons: lessons.slice(0, limit).map(function (x) { return x.l; }),
      total: lessons.length
    };
  }
  function markWords(text, words) {
    var out = esc(text);
    words.filter(function (w) { return w.length > 1; }).forEach(function (w) {
      out = out.replace(new RegExp("(" + esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>");
    });
    return out;
  }
  function snippet(l, words) {
    var at = -1;
    words.some(function (w) { at = l.x.indexOf(w); return at >= 0; });
    if (at < 0) return l.text.slice(0, 140);
    var start = Math.max(0, at - 60), part = l.text.slice(start, start + 160);
    return (start ? "…" : "") + part.replace(/^\S*\s/, start ? "" : part.split(" ")[0] + " ") + "…";
  }
  /** A search box with live results. opts.page: results shown in the page (not a drop-down), opts.q: starting text. */
  function searchUI(host, opts) {
    if (!host) return;
    opts = opts || {};
    var id = "s" + Math.random().toString(36).slice(2, 8);
    host.innerHTML = '<div class="lsearch' + (opts.page ? " lsearch-page" : "") + (opts.big ? " lsearch-big" : "") + '" role="search">' +
      '<label class="sr-only" for="' + id + '">Search lessons and notes</label><div class="lsearch-box"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
      '<input type="search" id="' + id + '" autocomplete="off" spellcheck="false" enterkeyhint="search" placeholder="' + esc(opts.placeholder || "Search lessons, e.g. flexbox, loops, subnetting") + '" aria-controls="' + id + '-r" />' +
      (opts.page ? "" : '<kbd aria-hidden="true">/</kbd>') + '</div><div class="lsearch-res" id="' + id + '-r"' + (opts.page ? "" : " hidden") + '></div></div>';
    var input = host.querySelector("input"), res = host.querySelector(".lsearch-res"), timer = 0, last = null;
    if (opts.q) input.value = opts.q;
    var close = function () { if (!opts.page) res.hidden = true; };
    var render = function () {
      var q = input.value.trim();
      if (!q) { res.innerHTML = opts.page ? '<p class="muted">Type a word to search every lesson, subject and blog post.</p>' : ""; if (!opts.page) res.hidden = true; return; }
      if (q === last && !res.hidden) return;
      last = q;
      res.hidden = false;
      if (!searchIndex) res.innerHTML = '<p class="lsearch-msg"><span class="spinner" aria-hidden="true"></span> Searching…</p>';
      getSearchIndex().then(function (ix) {
        if (input.value.trim() !== q) return;
        var r = searchRun(ix, q, opts.page ? 100 : 8), words = searchWords(q);
        var html = "";
        if (r.tracks.length) html += '<p class="lsearch-h">Subjects</p><ul class="lsearch-list">' + r.tracks.map(function (t) {
          return '<li><a href="./?track=' + esc(t.slug) + '"><i class="' + (TRACK_ICONS[t.slug] || "fa-solid fa-book") + '" aria-hidden="true"></i><span><strong>' + markWords(t.title, words) + "</strong><small>" + esc(t.summary) + "</small></span></a></li>";
        }).join("") + "</ul>";
        if (r.lessons.length) html += '<p class="lsearch-h">Lessons <span>' + (r.total > r.lessons.length ? r.lessons.length + " of " + r.total : r.total) + "</span></p><ul class=\"lsearch-list\">" + r.lessons.map(function (l) {
          return '<li><a href="./?track=' + esc(l.track) + "&amp;lesson=" + esc(l.slug) + '"><i class="' + (TRACK_ICONS[l.track] || "fa-solid fa-book-open") + '" aria-hidden="true"></i><span><strong>' + markWords(l.title, words) + '</strong><small class="lsearch-sub">' + esc(ix.names[l.track] || "") + "</small><small>" + markWords(snippet(l, words), words) + "</small></span></a></li>";
        }).join("") + "</ul>";
        if (r.posts.length) html += '<p class="lsearch-h">Blog</p><ul class="lsearch-list">' + r.posts.map(function (p) {
          return '<li><a href="../' + esc(p.slug) + '"><i class="fa-solid fa-newspaper" aria-hidden="true"></i><span><strong>' + markWords(p.title, words) + "</strong><small>" + esc(p.summary) + "</small></span></a></li>";
        }).join("") + "</ul>";
        if (!html) html = '<p class="lsearch-msg">Nothing found for “' + esc(q) + '”. Try a shorter word, like <em>loop</em> or <em>table</em>.</p>';
        else if (!opts.page && r.total > r.lessons.length) html += '<a class="lsearch-all" href="./?page=search&amp;q=' + encodeURIComponent(q) + '">See all ' + r.total + " results <i class=\"fa-solid fa-arrow-right\" aria-hidden=\"true\"></i></a>";
        res.innerHTML = html;
        if (opts.page) history.replaceState(history.state, "", "./?page=search&q=" + encodeURIComponent(q));
      }).catch(function (e) { res.innerHTML = '<p class="lsearch-msg">' + esc(e.message) + "</p>"; });
    };
    input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(render, 120); });
    input.addEventListener("focus", function () { if (input.value.trim()) { last = null; render(); } getSearchIndex().catch(function () {}); });
    input.addEventListener("keydown", function (e) {
      var links = [].slice.call(res.querySelectorAll("a"));
      if (e.key === "ArrowDown" && links.length) { e.preventDefault(); links[0].focus(); }
      else if (e.key === "Escape") { if (input.value) input.value = ""; render(); close(); }
      else if (e.key === "Enter") { e.preventDefault(); if (!opts.page && input.value.trim()) go("./?page=search&q=" + encodeURIComponent(input.value.trim())); }
    });
    res.addEventListener("keydown", function (e) {
      var links = [].slice.call(res.querySelectorAll("a")), i = links.indexOf(document.activeElement);
      if (e.key === "ArrowDown" && i < links.length - 1) { e.preventDefault(); links[i + 1].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); (i > 0 ? links[i - 1] : input).focus(); }
      else if (e.key === "Escape") { input.focus(); close(); }
    });
    if (!opts.page) document.addEventListener("click", function (e) { if (host.isConnected && !host.contains(e.target)) close(); });
    res.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    if (opts.q || opts.page) render();
    if (opts.focus) input.focus();
    return input;
  }
  function pageSearch(q) {
    setNav("");
    showSide(false);
    setTitle(q ? "Search: " + q : "Search lessons", "Search every free lesson, subject and blog post on the Marzley Tech learning hub.");
    main.innerHTML = '<section class="search-page"><h1><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Search the learning hub</h1><div id="search-host"></div></section>';
    searchUI($("#search-host"), { page: true, q: q, focus: !q, big: true });
  }
  // "/" jumps to the nearest search box
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || /input|textarea|select/i.test((document.activeElement || {}).tagName || "") || (document.activeElement && document.activeElement.isContentEditable)) return;
    var box = [].slice.call(document.querySelectorAll(".lsearch input")).filter(function (i) { return i.offsetParent; })[0];
    e.preventDefault();
    if (box) box.focus(); else go("./?page=search");
  });

  function renderSide(track, lessonSlug) {
    var tracks = state.catalog || [];
    var groups = groupTracks(tracks);
    side.innerHTML = '<button type="button" class="side-fold" title="Hide the lesson list (shortcut: [ )"><i class="fa-solid fa-angles-left" aria-hidden="true"></i> Hide lessons</button><div class="side-search" id="side-search"></div><nav class="subject-menu" aria-label="Subjects"><h2 class="side-title side-title-top">Subjects</h2>' + groups.map(function (g) {
      var here = g.items.some(function (t) { return t.slug === track.slug; });
      return '<details class="subj-group"' + (here ? " open" : "") + '><summary><i class="' + g.icon + '" aria-hidden="true"></i><span>' + esc(g.title) + '</span><span class="subj-n">' + g.items.length + '</span><i class="fa-solid fa-chevron-down subj-caret" aria-hidden="true"></i></summary>' +
        '<ul class="subj-list">' + g.items.map(function (t) {
          var cur = t.slug === track.slug;
          return '<li><a href="./?track=' + esc(t.slug) + '" class="' + (cur ? "is-current" : "") + '"' + (cur ? ' aria-current="true"' : "") + '><i class="' + (TRACK_ICONS[t.slug] || "fa-solid fa-book") + '" aria-hidden="true"></i><span>' + esc(t.title) + '</span><span class="subj-n">' + t.lessons.length + "</span></a></li>";
        }).join("") + "</ul></details>";
    }).join("") + "</nav>" +
      '<h2 class="side-title">' + esc(track.title) + ' tutorial</h2><ol class="lesson-list">' + track.lessons.map(function (l) {
        var cur = l.slug === lessonSlug;
        return '<li><a href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(l.slug) + '" data-lesson="' + l.id + '" class="' + (cur ? "is-current " : "") + (isDone(l.id) ? "done" : "") + '"' + (cur ? ' aria-current="page"' : "") + ">" +
          '<i class="fa-solid fa-circle-check tick" aria-hidden="true"></i><span>' + esc(l.title) + "</span>" + (isDone(l.id) ? '<span class="sr-only"> (done)</span>' : "") + "</a></li>";
      }).join("") + "</ol>" +
      (LANGS[track.lang] ? '<a class="side-practice" href="./?page=practice&amp;lang=' + esc(track.lang) + '"><i class="fa-solid fa-code" aria-hidden="true"></i> Practice ' + esc(track.title) + "</a>" : "");
    searchUI($("#side-search"), { placeholder: "Search all lessons…" });
  }

  // ---------- pages ----------
  function pageHome() {
    setNav("");
    showSide(false);
    setTitle("");
    main.innerHTML = '<section class="hero-learn"><div><p class="eyebrow">Marzley Tech Learning Hub</p><h1>Learn tech skills free, right in your browser</h1>' +
      '<p class="lead" id="hub-lead">42 subjects and 485+ lessons: coding in 13 languages with a live editor, app development (Flutter, Kotlin, React Native, APIs), web and graphic design, Excel, Word and everyday ICT skills, networking and subnetting, cybersecurity, AI tools and how to make money online. Practise with questions that check themselves. Works on your phone.</p>' +
      '<div id="hub-search"></div><ul class="free-badges"><li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Tutorials: free</li><li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Notes: free</li><li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Practice: free</li><li><i class="fa-solid fa-user" aria-hidden="true"></i> No account needed</li></ul>' +
      '<p class="hero-ctas"><a class="btn btn-solid" href="./?track=html">Start with HTML</a><a class="btn btn-line" href="./?track=career-roadmaps&amp;lesson=choose-a-tech-career">Find your career path</a></p></div>' +
      '<div class="hero-code" aria-hidden="true"><pre><span class="c-k">print</span>(<span class="c-s">"Habari, Kenya!"</span>)\n<span class="c-t">&lt;h1&gt;</span>Hello<span class="c-t">&lt;/h1&gt;</span>\n<span class="c-k">SELECT</span> * <span class="c-k">FROM</span> Customers;</pre></div></section>' +
      '<section class="home-sec path-sec"><div class="sec-head"><h2>Choose your path</h2><a href="./?track=projects&amp;lesson=how-to-build-projects">Build real projects</a></div>' +
      '<p class="path-steps" aria-label="How the roadmaps work"><span>Learn</span><span>Practise</span><span>Build</span><span>Show</span><span>Work</span><span>Earn</span></p><div class="path-grid">' +
      PATHS.map(function (r) { return '<a class="path-card" href="./?track=' + r[0] + "&amp;lesson=" + r[1] + '"><i class="' + r[2] + '" aria-hidden="true"></i><strong>' + esc(r[3]) + "</strong><small>" + esc(r[4]) + "</small></a>"; }).join("") + "</div></section>" +
      '<section class="home-sec"><h2>Tutorials</h2><div class="track-grid" id="track-grid"><p class="muted">Loading…</p></div></section>' +
      '<section class="home-sec"><div class="sec-head"><h2>Latest videos</h2><a href="./?page=videos">All videos</a></div><div class="video-grid" id="home-videos"></div></section>' +
      '<section class="home-sec"><div class="sec-head"><h2>Free notes &amp; books</h2><a href="./?page=notes">All notes</a></div><div class="note-grid" id="home-notes"></div></section>';
    searchUI($("#hub-search"), { big: true, placeholder: "What do you want to learn? e.g. Flutter, Excel VLOOKUP, subnetting" });
    getCatalog().then(function (tracks) {
      var lessons = tracks.reduce(function (n, t) { return n + t.lessons.length; }, 0);
      if (tracks.length > 5) $("#hub-lead").firstChild.textContent = tracks.length + " subjects and " + lessons + " lessons: coding in 13 languages with a live editor, web and graphic design, Excel, Word and everyday ICT skills, networking and subnetting, cybersecurity, AI tools and how to make money online. Practise with questions that check themselves. Works on your phone.";
      var card = function (t) {
        var done = t.lessons.filter(function (l) { return isDone(l.id); }).length;
        var first = t.lessons[0];
        return '<a class="track-card t-' + esc(t.lang) + " s-" + esc(t.slug) + '" href="./?track=' + esc(t.slug) + (first ? "&amp;lesson=" + esc(first.slug) : "") + '"><i class="' + (TRACK_ICONS[t.slug] || TRACK_ICONS[t.lang] || "fa-solid fa-book") + '" aria-hidden="true"></i>' +
          "<h3>" + esc(t.title) + "</h3><p>" + esc(t.summary) + '</p><span class="track-meta">' + t.lessons.length + " lessons" + (done ? " · " + done + " done" : "") + "</span>" +
          '<span class="bar" aria-hidden="true"><span style="width:' + (t.lessons.length ? Math.round(100 * done / t.lessons.length) : 0) + '%"></span></span></a>';
      };
      var shown = groupTracks(tracks);
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

  // ---------- YouTube videos inside lessons (click to load, privacy-friendly youtube-nocookie) ----------
  function ytEmbed(id, title) {
    if (!/^[\w-]{11}$|^PL[\w-]{10,}$/.test(id)) return "";
    var list = /^PL/.test(id);
    var watch = list ? "https://www.youtube.com/playlist?list=" + id : "https://www.youtube.com/watch?v=" + id;
    return '<figure class="yt" data-yt="' + esc(id) + '">' +
      '<button type="button" class="yt-play" aria-label="Play video: ' + esc(title || "YouTube video") + '">' +
      (list ? '<span class="yt-list"><i class="fa-solid fa-list" aria-hidden="true"></i> Playlist</span>' : '<img src="https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg" alt="" loading="lazy" width="480" height="360" />') +
      '<span class="yt-btn" aria-hidden="true"><i class="fa-solid fa-play"></i></span></button>' +
      '<figcaption><i class="fa-brands fa-youtube" aria-hidden="true"></i> ' + esc(title || "Video") +
      ' · <a href="' + watch + '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption></figure>';
  }
  function ytPlay(fig) {
    var id = fig.getAttribute("data-yt");
    var src = /^PL/.test(id) ? "https://www.youtube-nocookie.com/embed/videoseries?list=" + encodeURIComponent(id) + "&autoplay=1"
      : "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
    var frame = el('<iframe title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>');
    frame.src = src;
    fig.querySelector(".yt-play").replaceWith(frame);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".yt-play");
    if (b) ytPlay(b.closest(".yt"));
  });
  var videoMap = null;
  function getVideoMap() {
    if (!videoMap) videoMap = fetch("../data/learn-videos.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return videoMap;
  }
  /** Adds "Watch this lesson" videos after the lesson's first paragraph (unless the lesson embeds its own). */
  function lessonVideos(track, l, host) {
    if (!host || host.querySelector(".yt")) return;
    getVideoMap().then(function (m) {
      var keys = (m.lessons || {})[track.slug + "/" + l.slug] || (m.tracks || {})[track.slug] || [];
      var vids = keys.map(function (k) { return (m.videos || {})[k]; }).filter(Boolean);
      if (!vids.length || !host.isConnected) return;
      var box = el('<section class="lesson-video" aria-label="Video lesson"><h2><i class="fa-solid fa-circle-play" aria-hidden="true"></i> Watch and learn</h2>' + ytEmbed(vids[0].id, vids[0].title) +
        (vids.length > 1 ? '<details class="more-videos"><summary>More videos on this topic (' + (vids.length - 1) + ")</summary>" + vids.slice(1).map(function (v) { return ytEmbed(v.id, v.title); }).join("") + "</details>" : "") +
        '<p class="yt-note">Free videos from YouTube creators. They load only when you press play.</p></section>');
      var first = host.querySelector(":scope > p");
      if (first) first.after(box); else host.prepend(box);
    });
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
          '<p class="done-row"><button type="button" class="btn btn-line btn-sm" id="mark-done">' + (isDone(l.id) ? '<i class="fa-solid fa-check" aria-hidden="true"></i> Completed' : "Mark as completed") + "</button></p>") + pager + '<section class="lesson-social" id="reviews" aria-label="Likes and reviews"></section></article>';
        md.blocks.forEach(function (b, n) { codeBlock(main.querySelector('[data-try="' + n + '"]'), { lang: b.lang, code: b.code }); });
        lessonVideos(track, l, main.querySelector(".lesson-body"));
        enhanceLesson(main.querySelector(".lesson"), l);
        var quizDone = 0;
        md.quizzes.forEach(function (q, n) {
          renderQuiz(main.querySelector('[data-quiz="' + n + '"]'), q, function () {
            if (++quizDone === md.quizzes.length && !l.exercise) { markDone(l.id); var b = $("#mark-done"); if (b) b.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Completed'; }
          });
        });
        main.querySelectorAll("[data-tool]").forEach(function (h) { var fn = TOOLS[h.getAttribute("data-tool")]; if (fn) fn(h); });
        if (l.exercise) exercise(l, track);
        lessonSocial(l, $("#reviews"));
        var md2 = $("#mark-done");
        if (md2) md2.addEventListener("click", function () { markDone(l.id); md2.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Completed'; });
        main.focus({ preventScroll: true });
      });
    }).catch(function (e) { errorBox(e.message); });
  }

  // ---------- long lessons: contents list, reading progress, reading time and "I understand this section" ticks ----------
  var readerScroll = null;
  function slugify(t) { return String(t).toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section"; }
  function enhanceLesson(article, l) {
    if (readerScroll) { window.removeEventListener("scroll", readerScroll); readerScroll = null; }
    var body = article && article.querySelector(".lesson-body");
    if (!body) return;
    var words = (body.textContent || "").split(/\s+/).filter(Boolean).length, mins = Math.max(1, Math.round(words / 200));
    var heads = [].slice.call(body.querySelectorAll(":scope > h2"));
    var h1 = body.querySelector("h1");
    var meta = el('<p class="lesson-meta"><span><i class="fa-regular fa-clock" aria-hidden="true"></i> About ' + plural(mins, "minute") + ' of reading</span>' +
      (heads.length ? '<span><i class="fa-solid fa-list-check" aria-hidden="true"></i> ' + plural(heads.length, "section") + "</span>" : "") + "</p>");
    if (h1) h1.insertAdjacentElement("afterend", meta); else body.insertBefore(meta, body.firstChild);
    var bar = el('<div class="read-progress" aria-hidden="true"><span></span></div>');
    article.insertBefore(bar, article.firstChild);
    var fill = bar.firstChild;
    if (heads.length < 3) {
      readerScroll = function () { var r = body.getBoundingClientRect(), total = r.height - innerHeight * 0.6; fill.style.width = Math.min(100, Math.max(0, total > 0 ? -r.top / total * 100 : 100)) + "%"; };
      window.addEventListener("scroll", readerScroll, { passive: true }); readerScroll();
      return;
    }
    // Wrap each h2 and what follows it in a section, ending with a button to tick it off
    var key = "sections:" + l.id, got = {};
    try { got = JSON.parse(store.get(key) || "{}") || {}; } catch (e) { got = {}; }
    var used = {};
    var sections = heads.map(function (h) {
      var id = slugify(h.textContent);
      while (used[id]) id += "-2";
      used[id] = 1;
      var sec = document.createElement("section");
      sec.className = "lsec";
      sec.id = "s-" + id;
      h.parentNode.insertBefore(sec, h);
      var n = h;
      while (n && !(n !== h && n.nodeType === 1 && n.tagName === "H2")) { var nx = n.nextSibling; sec.appendChild(n); n = nx; }
      var btn = el('<p class="lsec-done"><button type="button" class="btn btn-line btn-sm" aria-pressed="false"><i class="fa-regular fa-circle-check" aria-hidden="true"></i> <span>I understand this section</span></button></p>');
      sec.appendChild(btn);
      return { id: id, sec: sec, title: h.textContent, btn: btn.querySelector("button") };
    });
    var toc = el('<nav class="lesson-toc" aria-label="In this lesson"><details open><summary><span>In this lesson</span><small class="toc-count"></small></summary><ol></ol></details></nav>');
    var ol = toc.querySelector("ol");
    sections.forEach(function (s) {
      s.link = el('<li><a href="#s-' + s.id + '"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>' + esc(s.title) + "</span></a></li>").firstChild;
      ol.appendChild(s.link.parentNode);
      var subs = [].slice.call(s.sec.querySelectorAll(":scope > h3"));
      if (subs.length > 1) {
        var sub = document.createElement("ol");
        sub.className = "toc-sub";
        subs.forEach(function (h) {
          var hid = "s-" + s.id + "-" + slugify(h.textContent);
          h.id = hid;
          h.classList.add("lsec-sub");
          var a = el('<li><a href="#' + hid + '">' + esc(h.textContent) + "</a></li>");
          a.firstChild.addEventListener("click", function (e) { e.preventDefault(); h.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(history.state, "", location.search + "#" + hid); if (innerWidth < 1200) toc.querySelector("details").open = false; });
          sub.appendChild(a);
        });
        s.link.parentNode.appendChild(sub);
      }
      s.link.addEventListener("click", function (e) { e.preventDefault(); s.sec.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(history.state, "", location.search + "#s-" + s.id); if (innerWidth < 1200) toc.querySelector("details").open = false; });
    });
    var count = toc.querySelector(".toc-count");
    var paint = function () {
      var n = 0;
      sections.forEach(function (s) {
        var on = !!got[s.id];
        if (on) n++;
        s.btn.setAttribute("aria-pressed", String(on));
        s.btn.classList.toggle("is-on", on);
        s.btn.querySelector("i").className = on ? "fa-solid fa-circle-check" : "fa-regular fa-circle-check";
        s.btn.querySelector("span").textContent = on ? "Understood" : "I understand this section";
        s.link.classList.toggle("got", on);
      });
      count.textContent = n + " of " + sections.length + " understood";
    };
    sections.forEach(function (s) {
      s.btn.addEventListener("click", function () {
        if (got[s.id]) delete got[s.id]; else got[s.id] = 1;
        store.set(key, JSON.stringify(got));
        paint();
      });
    });
    paint();
    var wrap = el('<div class="lesson-wrap"></div>');
    body.parentNode.insertBefore(wrap, body);
    wrap.appendChild(body);
    wrap.appendChild(toc);
    article.classList.add("has-toc");
    if (innerWidth < 1200) toc.querySelector("details").open = false;
    readerScroll = function () {
      var r = body.getBoundingClientRect(), total = r.height - innerHeight * 0.6;
      fill.style.width = Math.min(100, Math.max(0, total > 0 ? -r.top / total * 100 : 100)) + "%";
      var cur = sections[0];
      sections.forEach(function (s) { if (s.sec.getBoundingClientRect().top < 140) cur = s; });
      sections.forEach(function (s) { s.link.classList.toggle("is-current", s === cur); });
    };
    window.addEventListener("scroll", readerScroll, { passive: true });
    readerScroll();
    var target = /^#s-/.test(location.hash) && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { target.scrollIntoView({ block: "start" }); }, 50);
  }

  // ---------- likes, star ratings and comments under each lesson (everyone reads them; signing in lets you post) ----------
  function stars(n, label) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += '<i class="fa-' + (n >= i - 0.25 ? "solid fa-star" : n >= i - 0.75 ? "solid fa-star-half-stroke" : "regular fa-star") + '" aria-hidden="true"></i>';
    return '<span class="stars" role="img" aria-label="' + esc(label || n + " out of 5 stars") + '">' + out + "</span>";
  }
  function lessonSocial(l, box) {
    if (!box) return;
    var openAfter = location.hash === "#reviews";
    var load = function (keepOpen) {
      return api("lesson_social", undefined, "&lesson_id=" + l.id).then(function (d) { if (box.isConnected) draw(d, keepOpen); })
        .catch(function () { box.innerHTML = ""; });
    };
    var item = function (c, d, isReply) {
      var tools = [];
      if (!isReply && state.me) tools.push('<button type="button" class="linklike" data-reply="' + c.id + '">Reply</button>');
      if (d.editor) tools.push('<button type="button" class="linklike" data-hide="' + c.id + '" data-hidden="' + (c.hidden ? 1 : 0) + '">' + (c.hidden ? "Show" : "Hide") + "</button>");
      if (c.mine || d.editor) tools.push('<button type="button" class="linklike danger" data-del="' + c.id + '">Delete</button>');
      return '<li class="comment rv' + (c.hidden ? " is-hidden" : "") + (c.staff ? " rv-staff" : "") + '" id="rv-' + c.id + '"><span class="avatar" aria-hidden="true">' + (c.staff ? '<i class="fa-solid fa-graduation-cap"></i>' : esc((c.name || "?").charAt(0).toUpperCase())) + "</span><div class=\"rv-main\">" +
        '<p class="c-head"><strong>' + esc(c.name) + "</strong>" + (c.staff ? ' <span class="tag tag-staff">Tutor</span>' : "") + (c.rating ? " " + stars(c.rating) : "") + " <span>" + esc(timeAgo(c.created_at)) + "</span>" +
        (c.hidden ? ' <span class="tag">Hidden</span>' : "") + (d.editor && c.email ? ' <span class="muted small">' + esc(c.email) + "</span>" : "") + "</p>" +
        '<p class="c-body">' + esc(c.body).replace(/\n/g, "<br>") + "</p>" + (tools.length ? '<p class="rv-tools">' + tools.join(" · ") + "</p>" : "") +
        (c.replies && c.replies.length ? '<ul class="comment-list rv-replies">' + c.replies.map(function (r) { return item(r, d, true); }).join("") + "</ul>" : "") +
        (isReply ? "" : '<div class="rv-reply-host" data-for="' + c.id + '"></div>') + "</div></li>";
    };
    var draw = function (d, keepOpen) {
      var n = d.reviews.length, r = d.rating;
      box.innerHTML = '<div class="ls-bar"><p class="ls-q">Was this lesson helpful?</p>' +
        '<button type="button" class="pill-btn ls-like" aria-pressed="' + d.liked + '"><i class="fa-' + (d.liked ? "solid" : "regular") + ' fa-thumbs-up" aria-hidden="true"></i> ' + (d.liked ? "Liked" : "Like") + ' <span class="ls-n">' + d.likes + '</span><span class="sr-only"> likes</span></button>' +
        (r.count ? '<span class="ls-rating">' + stars(r.average, "Rated " + r.average + " out of 5") + " <strong>" + r.average + "</strong> <span class=\"muted\">(" + plural(r.count, "rating") + ")</span></span>" : '<span class="ls-rating muted">No ratings yet</span>') + "</div>" +
        '<details class="ls-reviews"' + (keepOpen || openAfter ? " open" : "") + '><summary><span class="ls-sum"><i class="fa-regular fa-comments" aria-hidden="true"></i> Reviews &amp; comments <span class="subj-n">' + n + '</span></span><span class="muted small">Ask a question, share a tip or rate this lesson</span><i class="fa-solid fa-chevron-down subj-caret" aria-hidden="true"></i></summary>' +
        (state.me ? '<form class="c-form rv-form" novalidate><span class="avatar" aria-hidden="true">' + esc(((state.me.name) || "?").charAt(0).toUpperCase()) + '</span><div class="c-field">' +
          '<fieldset class="star-pick"><legend>Your rating (optional)</legend><div class="star-row">' + [5, 4, 3, 2, 1].map(function (v) { return '<input type="radio" name="rv-stars" id="rv-s' + v + '" value="' + v + '"><label for="rv-s' + v + '" title="' + v + ' star' + (v > 1 ? "s" : "") + '"><i class="fa-solid fa-star" aria-hidden="true"></i><span class="sr-only">' + v + " star" + (v > 1 ? "s" : "") + "</span></label>"; }).join("") + "</div></fieldset>" +
          '<label for="rv-text" class="sr-only">Your review or question</label><textarea id="rv-text" rows="3" maxlength="2000" placeholder="What did you think? Ask a question or share a tip…"></textarea>' +
          '<div class="c-actions"><p class="u-msg" role="status" aria-live="polite"></p><button type="submit" class="btn btn-solid btn-sm">Post</button></div></div></form>'
          : '<p class="rv-signin"><button type="button" class="btn btn-line btn-sm" data-signin>Sign in to like, rate and comment</button> <span class="muted small">It’s free. Everyone can read the reviews.</span></p>') +
        '<ul class="comment-list rv-list">' + (n ? d.reviews.map(function (c) { return item(c, d, false); }).join("") : '<li class="muted">No reviews yet. Be the first to say what you think.</li>') + "</ul></details>";
      if (openAfter) { openAfter = false; box.scrollIntoView({ block: "start" }); }
    };
    box.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (!t) return;
      if (t.classList.contains("ls-like") || t.hasAttribute("data-signin")) {
        if (!state.me) return openSignin("Sign in to like lessons, rate them and comment. It’s free.");
        t.disabled = true;
        return api("lesson_like", { lesson_id: l.id }).then(function (j) {
          t.disabled = false;
          t.setAttribute("aria-pressed", j.liked);
          t.innerHTML = '<i class="fa-' + (j.liked ? "solid" : "regular") + ' fa-thumbs-up" aria-hidden="true"></i> ' + (j.liked ? "Liked" : "Like") + ' <span class="ls-n">' + j.likes + '</span><span class="sr-only"> likes</span>';
        }).catch(function (err) { t.disabled = false; alert(err.message); });
      }
      if (t.hasAttribute("data-del")) {
        if (!confirm("Delete this comment" + (box.querySelector("#rv-" + t.getAttribute("data-del") + " .rv-replies") ? " and its replies" : "") + "?")) return;
        return api("review_delete", { id: Number(t.getAttribute("data-del")) }).then(function () { load(true); }).catch(function (err) { alert(err.message); });
      }
      if (t.hasAttribute("data-hide")) return api("review_hide", { id: Number(t.getAttribute("data-hide")), hidden: t.getAttribute("data-hidden") !== "1" }).then(function () { load(true); }).catch(function (err) { alert(err.message); });
      if (t.hasAttribute("data-reply")) {
        var host = box.querySelector('.rv-reply-host[data-for="' + t.getAttribute("data-reply") + '"]');
        if (host.firstChild) { host.innerHTML = ""; return; }
        host.innerHTML = '<form class="rv-reply" novalidate><label class="sr-only" for="rp-' + t.getAttribute("data-reply") + '">Your reply</label><textarea id="rp-' + t.getAttribute("data-reply") + '" rows="2" maxlength="2000" placeholder="Write a reply…"></textarea>' +
          '<div class="c-actions"><p class="u-msg" role="status" aria-live="polite"></p><button type="button" class="linklike" data-cancel>Cancel</button> <button type="submit" class="btn btn-solid btn-sm">Reply</button></div></form>';
        host.querySelector("textarea").focus();
      }
      if (t.hasAttribute("data-cancel")) t.closest(".rv-reply-host").innerHTML = "";
    });
    box.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, text = f.querySelector("textarea").value.trim(), msg = f.querySelector(".u-msg"), btn = f.querySelector("button[type=submit]");
      if (!text) { msg.textContent = "Please write something first."; return; }
      var body = { lesson_id: l.id, body: text };
      if (f.classList.contains("rv-reply")) body.parent_id = Number(f.parentNode.getAttribute("data-for"));
      else { var st = f.querySelector("input[name=rv-stars]:checked"); if (st) body.rating = Number(st.value); }
      btn.disabled = true;
      api("review", body).then(function () { load(true); }).catch(function (err) { btn.disabled = false; msg.textContent = err.message; });
    });
    load(false);
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

  // ---------- Practice page: what each language is for, tips, and examples to load ----------
  var PRACTICE = {
    html: { track: "html", about: "HTML is the structure of every web page: headings, text, links, images, lists, tables and forms.", uses: ["Every website", "Emails and newsletters", "Web and mobile apps"],
      tips: ["Every page needs <html>, <head> and <body>.", "Use one <h1> per page, then <h2>, <h3>.", "Give every <img> an alt description."],
      examples: [["Hello page", null], ["Links and images", "<h1>Our shop</h1>\n<p>Visit our <a href=\"https://marzleytechsolutions.co.ke\">website</a>.</p>\n<img src=\"https://picsum.photos/300/160\" alt=\"A random photo\">"],
        ["Table of prices", "<table border=\"1\" cellpadding=\"8\">\n  <tr><th>Item</th><th>Price</th></tr>\n  <tr><td>Unga</td><td>KSh 180</td></tr>\n  <tr><td>Sugar</td><td>KSh 150</td></tr>\n</table>"],
        ["Contact form", "<form>\n  <label>Name <input name=\"name\" required></label><br><br>\n  <label>Phone <input type=\"tel\" name=\"phone\"></label><br><br>\n  <button>Send</button>\n</form>"]] },
    css: { track: "css", about: "CSS styles web pages: colours, fonts, spacing, layout, animation and making pages fit phone screens.", uses: ["Website design", "Responsive layouts", "Animations"],
      tips: ["Use classes (.card) to style many elements at once.", "Flexbox lays out a row; Grid lays out rows and columns.", "Test at phone width: design mobile-first."],
      examples: [["Styled box", null], ["Flexbox row", "<style>\n  .row { display: flex; gap: 12px; }\n  .row div { flex: 1; padding: 16px; background: #0b1b35; color: #fff; border-radius: 10px; }\n</style>\n<div class=\"row\"><div>One</div><div>Two</div><div>Three</div></div>"],
        ["Card grid", "<style>\n  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; font-family: sans-serif; }\n  .card { padding: 18px; border: 1px solid #e2e8f0; border-radius: 14px; }\n</style>\n<div class=\"grid\"><div class=\"card\">Websites</div><div class=\"card\">Shops</div><div class=\"card\">Systems</div></div>"],
        ["Button hover", "<style>\n  button { padding: 12px 22px; border: 0; border-radius: 999px; background: #ffb800; font-weight: 700; transition: transform .2s; }\n  button:hover { transform: translateY(-3px); }\n</style>\n<button>Hover me</button>"]] },
    javascript: { track: "javascript", about: "JavaScript makes pages interactive and also runs servers (Node.js) and mobile apps (React Native).", uses: ["Interactive websites", "Web apps", "Servers with Node.js"],
      tips: ["console.log() prints to the output.", "Use const by default, let when a value changes.", "Arrays have map, filter and reduce."],
      examples: [["Loop over items", null], ["Functions", "function vat(amount) {\n  return amount * 0.16;\n}\nconsole.log(\"VAT on 1000:\", vat(1000));"],
        ["Array methods", "const prices = [120, 450, 80, 300];\nconsole.log(prices.filter(p => p > 100));\nconsole.log(prices.map(p => p * 2));\nconsole.log(prices.reduce((a, b) => a + b, 0));"],
        ["Change the page", "<h1 id=\"title\">Hello</h1>\n<button onclick=\"document.getElementById('title').textContent = 'Clicked!'\">Click me</button>"]] },
    python: { track: "python", about: "Python is easy to read and used for automation, data analysis, AI, web back ends and teaching programming.", uses: ["Data and AI", "Automation scripts", "Web back ends"],
      tips: ["Indentation (4 spaces) matters.", "f-strings: f\"Total: {total}\".", "input() asks the user for a value in a pop-up."],
      examples: [["Loop and f-strings", null], ["Lists and dictionaries", "stock = {\"unga\": 12, \"sugar\": 0, \"milk\": 40}\nfor item, qty in stock.items():\n    status = \"in stock\" if qty > 0 else \"SOLD OUT\"\n    print(f\"{item}: {status}\")"],
        ["Functions", "def grade(marks):\n    if marks >= 70: return \"A\"\n    if marks >= 50: return \"C\"\n    return \"E\"\n\nfor m in [82, 55, 31]:\n    print(m, grade(m))"],
        ["Ask for input", "name = input(\"What is your name? \")\nprint(\"Karibu,\", name)"]] },
    sql: { track: "sql", about: "SQL talks to databases. Practise on a sample shop database with Customers, Products and Orders.", uses: ["Websites and apps", "Reports", "Data analysis"],
      tips: ["SELECT columns FROM table WHERE condition.", "JOIN links tables by their IDs.", "GROUP BY with COUNT or SUM makes summaries."],
      examples: [["Join three tables", null], ["Filter and sort", "SELECT Name, Price FROM Products\nWHERE Price > 1000\nORDER BY Price DESC;"],
        ["Count per city", "SELECT City, COUNT(*) AS Customers\nFROM Customers\nGROUP BY City\nORDER BY Customers DESC;"],
        ["Sales per product", "SELECT p.Name, SUM(o.Quantity * p.Price) AS Sales\nFROM Orders o JOIN Products p ON p.ProductID = o.ProductID\nGROUP BY p.Name ORDER BY Sales DESC;"]] },
    php: { track: "php", about: "PHP runs on the server behind WordPress and most cPanel websites. Here PHP 8.3 runs right in your browser.", uses: ["WordPress and CMSs", "Business systems", "M-Pesa back ends"],
      tips: ["Start with <?php. Variables begin with $.", "echo prints; . joins strings.", "Databases and sending email need a real server (XAMPP or hosting)."],
      examples: [["Arrays and loops", null], ["Functions", "<?php\nfunction vat(float $amount): float {\n    return $amount * 0.16;\n}\necho \"VAT: KSh \" . vat(2500);"],
        ["Build HTML", "<?php $items = [\"Websites\", \"Online shops\", \"Systems\"]; ?>\n<h1>Our services</h1>\n<ul>\n<?php foreach ($items as $i): ?>\n  <li><?= htmlspecialchars($i) ?></li>\n<?php endforeach; ?>\n</ul>"],
        ["Classes", "<?php\nclass Account {\n    private float $balance = 0;\n    public function deposit(float $amt): void { $this->balance += $amt; }\n    public function balance(): float { return $this->balance; }\n}\n$a = new Account();\n$a->deposit(1500);\necho \"Balance: \" . $a->balance();"]] },
    typescript: { track: "typescript", about: "TypeScript is JavaScript with types. Here the types are removed and the code runs; your editor (VS Code) checks them in real projects.", uses: ["React and Angular apps", "Node.js back ends", "Large projects"],
      tips: ["Describe objects with type or interface.", "string | null means either type.", "Output appears with console.log()."],
      examples: [["Types and filter", null], ["Interfaces", "interface Customer { name: string; phone: string; email?: string }\nconst c: Customer = { name: \"Wanjiku\", phone: \"0712345678\" };\nconsole.log(`${c.name} (${c.email ?? \"no email\"})`);"],
        ["Generics", "function first<T>(items: T[]): T | undefined {\n  return items[0];\n}\nconsole.log(first([10, 20]), first([\"a\", \"b\"]));"],
        ["Classes", "class Cart {\n  private items: { name: string; price: number }[] = [];\n  add(name: string, price: number) { this.items.push({ name, price }); return this; }\n  total(): number { return this.items.reduce((s, i) => s + i.price, 0); }\n}\nconsole.log(new Cart().add(\"Unga\", 180).add(\"Milk\", 60).total());"]] },
    react: { track: "javascript", about: "React builds user interfaces from components. Write JSX; React 18 runs in the output. Use React.useState and friends.", uses: ["Web apps", "Dashboards", "Mobile apps with React Native"],
      tips: ["A component is a function that returns JSX.", "useState keeps values that change.", "Render with ReactDOM.createRoot(document.getElementById(\"root\")).render(<App />)."],
      examples: [["Counter", null], ["List from data", "const products = [{ id: 1, name: \"Unga\", price: 180 }, { id: 2, name: \"Milk\", price: 60 }];\n\nfunction App() {\n  return (\n    <ul>\n      {products.map(p => <li key={p.id}>{p.name}: KSh {p.price}</li>)}\n    </ul>\n  );\n}\n\nReactDOM.createRoot(document.getElementById(\"root\")).render(<App />);"],
        ["Form input", "const { useState } = React;\n\nfunction Greet() {\n  const [name, setName] = useState(\"\");\n  return (\n    <div>\n      <input placeholder=\"Your name\" value={name} onChange={e => setName(e.target.value)} />\n      <p>Karibu, {name || \"friend\"}!</p>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.getElementById(\"root\")).render(<Greet />);"]] },
    json: { track: "javascript", about: "JSON is the text format apps and APIs use to send data. Paste JSON to check it and format it neatly.", uses: ["APIs (like M-Pesa Daraja)", "Config files", "Saving data"],
      tips: ["Keys and text use double quotes.", "No comma after the last item.", "Values: text, numbers, true/false, null, arrays [] and objects {}."],
      examples: [["Shop data", null], ["M-Pesa style reply", "{\n  \"MerchantRequestID\": \"29115-34620561-1\",\n  \"CheckoutRequestID\": \"ws_CO_191220191020363925\",\n  \"ResponseCode\": \"0\",\n  \"ResponseDescription\": \"Success. Request accepted for processing\",\n  \"CustomerMessage\": \"Success. Request accepted for processing\"\n}"],
        ["Find the mistake", "{\n  \"name\": \"Otieno\",\n  \"town\": 'Kisumu',\n  \"skills\": [\"HTML\", \"CSS\",]\n}"]] },
    markdown: { track: "git", about: "Markdown is a simple way to format text, used in README files on GitHub, notes, chats and documentation.", uses: ["GitHub README files", "Notes and docs", "Blog posts"],
      tips: ["# makes a heading, ## a smaller one.", "**bold**, *italic*, `code`.", "- makes a bullet list; 1. a numbered list."],
      examples: [["Shop page", null], ["README file", "# Duka App\n\nA simple shop system built with PHP and MySQL.\n\n## Features\n- Products and stock\n- M-Pesa payments\n- Sales reports\n\n## Install\n```\ngit clone https://github.com/you/duka.git\n```"],
        ["Links and images", "Visit [Marzley Tech](https://marzleytechsolutions.co.ke).\n\n![A photo](https://picsum.photos/400/200)"]] }
  };

  Object.assign(PRACTICE, {
    c: { track: "c-programming", about: "C is the language behind operating systems, microcontrollers and embedded devices. Learning it shows how computers really work.", uses: ["Operating systems", "Arduino and embedded", "Fast programs"],
      tips: ["Every program starts in int main().", "printf(\"%d\", n) prints numbers; %s text; %.2f decimals.", "Arrays start at index 0 and C does not check the end."],
      examples: [["Array total", null], ["Functions", "#include <stdio.h>\n\nint max(int a, int b) {\n    return a > b ? a : b;\n}\n\nint main() {\n    printf(\"Bigger: %d\\n\", max(12, 40));\n    return 0;\n}"],
        ["Pointers", "#include <stdio.h>\n\nvoid addBonus(int *salary) {\n    *salary += 2000;\n}\n\nint main() {\n    int pay = 30000;\n    addBonus(&pay);\n    printf(\"Pay: %d\\n\", pay);\n    return 0;\n}"],
        ["Structs", "#include <stdio.h>\n#include <string.h>\n\nstruct Student { char name[20]; int marks; };\n\nint main() {\n    struct Student s;\n    strcpy(s.name, \"Kiprop\");\n    s.marks = 78;\n    printf(\"%s scored %d\\n\", s.name, s.marks);\n    return 0;\n}"]] },
    cpp: { track: "cpp", about: "C++ adds classes and a huge library to C. It powers games, browsers, trading systems and coding contests.", uses: ["Games", "High-performance apps", "Competitive programming"],
      tips: ["cout << prints; endl ends the line.", "Functions must be declared before main or above it.", "Code using string, vector or other libraries runs on the full online compiler automatically."],
      examples: [["Squares", null], ["Grades with if", "#include <iostream>\nusing namespace std;\n\nint main() {\n    int marks[] = {82, 55, 31};\n    for (int i = 0; i < 3; i++) {\n        if (marks[i] >= 70) cout << marks[i] << \": A\" << endl;\n        else if (marks[i] >= 50) cout << marks[i] << \": C\" << endl;\n        else cout << marks[i] << \": E\" << endl;\n    }\n    return 0;\n}"],
        ["Recursion", "#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    cout << \"5! = \" << factorial(5) << endl;\n    return 0;\n}"]] },
    csharp: { track: "csharp", about: "C# is Microsoft's language for business software, websites with ASP.NET and games with Unity.", uses: ["Business systems", "ASP.NET websites", "Unity games"],
      tips: ["Console.WriteLine prints a line.", "Use $\"Total: {total}\" to insert values into text.", "decimal is best for money."],
      examples: [["Dictionary total", null], ["Classes", "using System;\n\nclass Account\n{\n    public string Owner { get; }\n    public decimal Balance { get; private set; }\n    public Account(string owner) => Owner = owner;\n    public void Deposit(decimal amount) => Balance += amount;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Account(\"Amina\");\n        a.Deposit(2500);\n        Console.WriteLine($\"{a.Owner}: KSh {a.Balance}\");\n    }\n}"],
        ["LINQ", "using System;\nusing System.Linq;\n\nclass Program\n{\n    static void Main()\n    {\n        int[] marks = { 45, 78, 92, 60, 71 };\n        Console.WriteLine($\"Average: {marks.Average():F1}\");\n        Console.WriteLine(\"Passed: \" + string.Join(\", \", marks.Where(m => m >= 50)));\n    }\n}"]] },
    java: { track: "java", about: "Java runs Android apps, banks and big business systems, and is taught in many colleges.", uses: ["Android apps", "Banking systems", "Enterprise software"],
      tips: ["Keep the class name Main with a main method.", "System.out.println prints a line.", "Every statement ends with ;"],
      examples: [["List of towns", null], ["Classes", "class Main {\n    static class Account {\n        private double balance;\n        void deposit(double amount) { balance += amount; }\n        double getBalance() { return balance; }\n    }\n\n    public static void main(String[] args) {\n        Account a = new Account();\n        a.deposit(2500);\n        System.out.println(\"Balance: \" + a.getBalance());\n    }\n}"],
        ["Loops and arrays", "class Main {\n    public static void main(String[] args) {\n        int[] scores = {45, 78, 92, 60};\n        int total = 0;\n        for (int s : scores) total += s;\n        System.out.println(\"Average: \" + (double) total / scores.length);\n    }\n}"]] },
    go: { track: "go", about: "Go is a simple, fast language from Google for web servers, APIs and cloud tools like Docker and Kubernetes.", uses: ["APIs and servers", "Cloud tools", "Fintech back ends"],
      tips: ["Start with package main and func main().", ":= declares a variable.", "Go has only one loop keyword: for."],
      examples: [["Map of prices", null], ["Functions with errors", "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nfunc divide(a, b float64) (float64, error) {\n\tif b == 0 {\n\t\treturn 0, errors.New(\"cannot divide by zero\")\n\t}\n\treturn a / b, nil\n}\n\nfunc main() {\n\tif r, err := divide(10, 4); err == nil {\n\t\tfmt.Println(\"Result:\", r)\n\t}\n\t_, err := divide(1, 0)\n\tfmt.Println(\"Error:\", err)\n}"],
        ["Structs", "package main\n\nimport \"fmt\"\n\ntype Order struct {\n\tItem   string\n\tAmount int\n\tPaid   bool\n}\n\nfunc main() {\n\to := Order{\"Charger\", 800, true}\n\tfmt.Printf(\"%+v\\n\", o)\n}"]] },
    rust: { track: "algorithms", about: "Rust is fast and memory-safe. It is used for systems, web servers, blockchain and command-line tools.", uses: ["Systems programming", "WebAssembly", "Command-line tools"],
      tips: ["println!(\"{}\", x) prints values.", "Variables can't change unless you write let mut.", "The compiler's error messages are very helpful: read them."],
      examples: [["Vector sum", null], ["Structs and methods", "struct Account { owner: String, balance: f64 }\n\nimpl Account {\n    fn deposit(&mut self, amount: f64) { self.balance += amount; }\n}\n\nfn main() {\n    let mut a = Account { owner: String::from(\"Amina\"), balance: 0.0 };\n    a.deposit(2500.0);\n    println!(\"{}: KSh {}\", a.owner, a.balance);\n}"],
        ["Match", "fn grade(marks: u32) -> &'static str {\n    match marks {\n        70..=100 => \"A\",\n        50..=69 => \"C\",\n        _ => \"E\",\n    }\n}\n\nfn main() {\n    for m in [82, 55, 31] {\n        println!(\"{} -> {}\", m, grade(m));\n    }\n}"]] },
    kotlin: { track: "java", about: "Kotlin is Google's preferred language for Android apps. It is shorter and safer than Java.", uses: ["Android apps", "Back ends", "Multiplatform apps"],
      tips: ["fun main() is where the program starts.", "val can't change; var can.", "\"${x}\" puts values into text."],
      examples: [["Data classes", null], ["Null safety", "fun main() {\n    val email: String? = null\n    println(email ?: \"No email\")\n    println(email?.length ?: 0)\n}"],
        ["Loops and ranges", "fun main() {\n    for (i in 1..5) println(\"$i x 7 = ${i * 7}\")\n    val evens = (1..20).filter { it % 2 == 0 }\n    println(evens)\n}"]] },
    lua: { track: "algorithms", about: "Lua is a small, fast scripting language used in games (Roblox, World of Warcraft), apps and embedded devices.", uses: ["Game scripting (Roblox)", "Embedded devices", "App plugins"],
      tips: ["print() shows output; .. joins text.", "Tables {} are Lua's lists and dictionaries.", "Lists start at index 1."],
      examples: [["Price table", null], ["Functions", "local function grade(marks)\n  if marks >= 70 then return \"A\" elseif marks >= 50 then return \"C\" end\n  return \"E\"\nend\n\nfor _, m in ipairs({82, 55, 31}) do\n  print(m, grade(m))\nend"],
        ["Loops", "for i = 1, 5 do\n  print(i .. \" x 7 = \" .. i * 7)\nend"]] },
    ruby: { track: "algorithms", about: "Ruby is a friendly language built for programmer happiness. Ruby on Rails powers sites like GitHub and Shopify.", uses: ["Web apps with Rails", "Automation", "Startups"],
      tips: ["puts prints a line.", "\"#{x}\" puts values into text.", "Blocks: [1, 2, 3].each { |n| puts n }"],
      examples: [["Hash of prices", null], ["Classes", "class Account\n  attr_reader :balance\n  def initialize(owner)\n    @owner = owner\n    @balance = 0\n  end\n  def deposit(amount)\n    @balance += amount\n    self\n  end\nend\n\na = Account.new(\"Amina\").deposit(2500)\nputs \"Balance: #{a.balance}\""],
        ["Arrays", "marks = [82, 55, 31, 90]\nputs marks.select { |m| m >= 50 }.inspect\nputs marks.map { |m| m + 5 }.inspect\nputs \"Average: #{marks.sum / marks.size.to_f}\""]] },
    sass: { track: "css", about: "Sass (SCSS) is CSS with superpowers: variables, nesting and mixins. It compiles to normal CSS.", uses: ["Large websites", "Design systems", "Bootstrap theming"],
      tips: ["$name: value; makes a variable.", "Nest selectors inside each other; & means the parent.", "@mixin and @include reuse groups of styles."],
      examples: [["Variables and mixin", null], ["Nesting", "nav {\n  ul { list-style: none; margin: 0; }\n  li { display: inline-block; }\n  a {\n    color: #0b1b35;\n    &:hover { color: #ffb800; }\n  }\n}"],
        ["Loops", "@for $i from 1 through 4 {\n  .mt-#{$i} { margin-top: #{$i * 8}px; }\n}"]] },
    regex: { track: "javascript", about: "Regular expressions find patterns in text: phone numbers, emails, dates and more. Write the pattern, then --- and your text.", uses: ["Form validation", "Search and replace", "Data cleaning"],
      tips: ["\\d digit, \\w letter or digit, \\s space, . any character.", "+ one or more, * zero or more, {3} exactly three.", "( ) makes a group; flags: g all, i ignore case."],
      examples: [["Kenyan phone numbers", null], ["Emails", "/[\\w.+-]+@[\\w-]+\\.[\\w.]+/g\n---\nWrite to info@marzleytechsolutions.co.ke or sales@example.com today."],
        ["Dates with groups", "/(\\d{4})-(\\d{2})-(\\d{2})/g\n---\nPaid on 2026-09-28, due again on 2026-10-28."],
        ["M-Pesa codes", "/\\b[A-Z0-9]{10}\\b/g\n---\nSGH7XK2L9P Confirmed. Ksh500.00 sent. Ref TJK2M8ZQ4A."]] },
    prolog: { track: "algorithms", about: "Prolog is a logic language: you state facts and rules, then ask questions. It is used in AI, expert systems and language processing.", uses: ["AI and expert systems", "Puzzles and logic", "University courses"],
      tips: ["Facts and rules end with a full stop.", "Variables start with a capital letter.", "Ask questions on lines that start with ?-"],
      examples: [["Family tree", null], ["Lists", "total([], 0).\ntotal([H|T], S) :- total(T, S1), S is H + S1.\n\n?- total([180, 150, 60], S).\n?- member(X, [unga, sugar, milk])."],
        ["Recommendations", "likes(amina, python).\nlikes(otieno, java).\nlikes(amina, design).\ncourse(python, data).\ncourse(java, android).\ncourse(design, web).\n\nsuggest(P, Area) :- likes(P, T), course(T, Area).\n\n?- suggest(amina, Area)."]] }
  });
  var PRACTICE_GROUPS = [
    ["Web", ["html", "css", "javascript", "typescript", "react", "sass", "json", "markdown"]],
    ["Programming", ["python", "php", "c", "cpp", "csharp", "java", "go", "rust", "kotlin", "lua", "ruby", "prolog"]],
    ["Data", ["sql", "regex"]]
  ];
  var ONLINE_LANGS = { csharp: 1, java: 1, go: 1, rust: 1, kotlin: 1 };

  function pagePractice(lang) {
    setNav("practice");
    showSide(false);
    lang = LANGS[lang] ? lang : store.get("practice-lang") || "python";
    setTitle(LANGS[lang] + " online editor", "Free online " + LANGS[lang] + " editor: write code and run it in your browser.");
    main.innerHTML = '<section class="practice"><div class="practice-head"><h1>Practice</h1><div class="lang-pick" role="tablist" aria-label="Language">' +
      PRACTICE_GROUPS.map(function (g) { return '<span class="lang-group">' + g[0] + "</span>" + g[1].map(function (k) { return '<button type="button" role="tab" data-lang="' + k + '" aria-selected="' + (k === lang) + '">' + LANGS[k] + "</button>"; }).join(""); }).join("") +
      '</div></div><div class="practice-grid"><div class="pane"><div class="pane-bar"><span>Code</span><div><label class="sr-only" for="p-example">Load an example</label><select id="p-example" class="ex-select"><option value="">Examples…</option>' +
      PRACTICE[lang].examples.map(function (x, i) { return '<option value="' + i + '">' + esc(x[0]) + "</option>"; }).join("") + "</select>" +
      '<button type="button" class="try-reset" id="p-reset" title="Start again"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i><span class="sr-only">Start again</span></button>' +
      '<button type="button" class="try-reset" id="p-copy" title="Copy code"><i class="fa-regular fa-copy" aria-hidden="true"></i><span class="sr-only">Copy code</span></button>' +
      '<button type="button" class="btn btn-solid btn-sm" id="p-run"><i class="fa-solid fa-play" aria-hidden="true"></i> Run <kbd>Ctrl</kbd>+<kbd>Enter</kbd></button></div></div><div class="pane-editor" id="p-editor"></div></div>' +
      '<div class="pane"><div class="pane-bar"><span>Output</span></div><div class="pane-output" id="p-out"></div></div></div>' +
      '<div class="practice-help" id="p-help" hidden aria-live="polite"></div>' + practiceDetails(lang) + '</section>';
    var ed = makeEditor($("#p-editor"), store.get("code:" + lang) || STARTERS[lang], lang);
    var runner = new Runner($("#p-out"));
    var run = function () {
      var code = ed.getValue();
      store.set("code:" + lang, code); $("#p-run").disabled = true;
      runner.run(lang, code).then(function (r) { $("#p-run").disabled = false; renderHelp($("#p-help"), runLang(lang, code), code, r, ed); });
    };
    $("#p-run").addEventListener("click", run);
    $("#p-reset").addEventListener("click", function () { if (confirm("Start again with the example code?")) ed.setValue(STARTERS[lang]); });
    $("#p-copy").addEventListener("click", function () { if (navigator.clipboard) navigator.clipboard.writeText(ed.getValue()); });
    $("#p-example").addEventListener("change", function () {
      var ex = PRACTICE[lang].examples[this.value];
      if (ex) { ed.setValue(ex[1] == null ? STARTERS[lang] : ex[1]); run(); }
      this.value = "";
    });
    main.querySelector(".practice").addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } });
    main.querySelectorAll(".lang-pick button").forEach(function (b) {
      b.addEventListener("click", function () { store.set("code:" + lang, ed.getValue()); store.set("practice-lang", b.getAttribute("data-lang")); go("./?page=practice&lang=" + b.getAttribute("data-lang")); });
    });
    var t = setInterval(function () { store.set("code:" + lang, ed.getValue()); }, 5000);
    cleanup.push(function () { clearInterval(t); store.set("code:" + lang, ed.getValue()); });
    if (lang !== "python" && lang !== "php" && lang !== "ruby" && !ONLINE_LANGS[lang]) run();
  }
  function practiceDetails(lang) {
    var info = PRACTICE[lang], track = info.track;
    if (ONLINE_LANGS[lang]) info = Object.assign({}, info, { online: true });
    var note = { python: "Python runs fully in your browser. The first run downloads it once (about 10 MB).", php: "PHP 8.3 runs fully in your browser. The first run downloads it once (about 4 MB). Databases, sessions and email need a real server.",
      sql: "SQL runs on a sample shop database with Customers, Products and Orders. Try SELECT * FROM Products;", typescript: "Types are removed before running, so type mistakes are not reported here. Use VS Code to see them.",
      react: "React 18 and ReactDOM are ready to use. Hooks: React.useState, React.useEffect.", json: "Only data is allowed in JSON: no comments, no trailing commas.", markdown: "The output shows the formatted page, like GitHub shows a README.",
      c: "C runs instantly in your browser with a small C interpreter (PicoC). If your code uses something it doesn't support, it is sent to Compiler Explorer (godbolt.org), a free online compiler.", cpp: "Simple C++ (cout, loops, functions, arrays) runs instantly in your browser. Code that needs string, vector or other libraries is sent to Compiler Explorer (godbolt.org), a free online compiler.",
      lua: "Lua runs fully in your browser.", ruby: "Ruby 3.3 runs fully in your browser. The first run downloads it once (about 5 MB).", sass: "The output shows the CSS that your Sass compiles to.",
      regex: "Uses JavaScript regular expressions, the same ones websites use for form checks.", prolog: "Prolog runs in your browser (Tau Prolog). Put questions on lines starting with ?-" }[lang] || (ONLINE_LANGS[lang] ? LANGS[lang] + " is compiled and run by Compiler Explorer (godbolt.org), a free online service, so your code is sent to it. It needs an internet connection and takes a few seconds." : "Your code runs in a safe sandbox: it can't touch this website, your cookies or your accounts.");
    return '<section class="practice-info" aria-labelledby="pi-title"><div class="pi-main"><h2 id="pi-title">About ' + esc(LANGS[lang]) + '</h2><p>' + esc(info.about) + '</p>' +
      '<p class="pi-uses">' + info.uses.map(function (u) { return '<span class="tag">' + esc(u) + "</span>"; }).join(" ") + '</p><p class="muted small">' + esc(note) + ' Your code is saved on this device.</p></div>' +
      '<div class="pi-tips"><h3>Quick tips</h3><ul>' + info.tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      '<p><a class="btn btn-line btn-sm" href="./?track=' + esc(track) + '"><i class="fa-solid fa-book-open" aria-hidden="true"></i> ' + (track === lang ? "Learn " + esc(LANGS[lang]) + " step by step" : "Related lessons") + "</a></p></div></section>";
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
    setTitle("Notes and books", "Course notes for every subject, from the basics up: read free online or download the whole subject as a PDF. Plus free programming notes and books.");
    main.innerHTML = '<section class="list-page"><h1>Notes &amp; books</h1><p class="lead">Complete course notes for every subject, from the basics all the way up. Read them free online, no account needed, or download a whole subject as a PDF for ' + esc(kes(state.notesPrice)) + ' with M-Pesa.</p>' +
      '<h2 class="notes-h">Course notes</h2><div class="book-grid" id="book-grid"><p class="muted">Loading…</p></div>' +
      '<h2 class="notes-h">PDF notes &amp; books</h2><div class="note-grid" id="note-grid"><p class="muted">Loading…</p></div></section>';
    getCatalog().then(function (tracks) {
      $("#book-grid").innerHTML = tracks.map(function (t) {
        return '<a class="book-card" href="./?book=' + esc(t.slug) + '"><i class="' + (TRACK_ICONS[t.slug] || TRACK_ICONS[t.lang] || "fa-solid fa-book") + '" aria-hidden="true"></i><span><strong>' + esc(t.title) + " notes</strong>" +
          '<span class="muted">' + t.lessons.length + " topics · read free · PDF " + esc(kes(state.notesPrice)) + "</span></span></a>";
      }).join("") || '<p class="muted">Course notes are coming soon.</p>';
    }).catch(function (e) { $("#book-grid").innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
    api("notes").then(function (j) {
      $("#note-grid").innerHTML = (j.notes || []).map(function (n) { return noteCard(n, "h2"); }).join("") || '<p class="muted">More downloadable PDF notes are coming soon. Meanwhile, every course above can be downloaded as a PDF.</p>';
    }).catch(function (e) { $("#note-grid").innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
  }

  /** A whole subject as one notes book: every lesson in order, with code, questions and answers. Free to read; the PDF download is paid with M-Pesa. */
  function pageBook(slug) {
    setNav("notes");
    showSide(false);
    main.innerHTML = '<p class="learn-loading"><span class="spinner" aria-hidden="true"></span> Loading the notes…</p>';
    getCatalog().then(function (tracks) {
      var track = tracks.filter(function (t) { return t.slug === slug; })[0];
      if (!track) return errorBox("Those notes were not found.");
      setTitle(track.title + " notes", "Free " + track.title + " course notes: all " + track.lessons.length + " topics from the basics up, with examples and practice questions. Read free online or download them as a PDF.");
      var queue = track.lessons.slice(), done = {}, loaded = 0;
      var fetchOne = function () {
        var item = queue.shift();
        if (!item) return Promise.resolve();
        return api("lesson", undefined, "&track=" + encodeURIComponent(track.slug) + "&slug=" + encodeURIComponent(item.slug))
          .then(function (j) { done[item.slug] = j.lesson; }, function () { done[item.slug] = null; })
          .then(function () { loaded++; var s = $("#book-progress"); if (s) s.textContent = loaded + " of " + track.lessons.length; return fetchOne(); });
      };
      main.innerHTML = '<p class="learn-loading"><span class="spinner" aria-hidden="true"></span> Loading the notes… <span id="book-progress"></span></p>';
      return Promise.all([fetchOne(), fetchOne(), fetchOne(), fetchOne()]).then(function () {
        var toc = track.lessons.map(function (l, i) { return '<li><a href="#n-' + esc(l.slug) + '">' + esc(l.title) + "</a></li>"; }).join("");
        var parts = track.lessons.map(function (item, i) {
          var l = done[item.slug];
          if (!l) return '<section class="book-part" id="n-' + esc(item.slug) + '"><h2>' + (i + 1) + ". " + esc(item.title) + '</h2><p class="muted">This topic could not load. <a href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(item.slug) + '">Open it online</a>.</p></section>';
          return '<section class="book-part" id="n-' + esc(item.slug) + '"><p class="book-num">Topic ' + (i + 1) + " of " + track.lessons.length + "</p>" + bookBody(l, track) +
            '<p class="book-open"><a href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(item.slug) + '"><i class="fa-solid fa-laptop-code" aria-hidden="true"></i> Open the interactive lesson (run the code, check your answers, watch the video)</a></p></section>';
        }).join("");
        main.innerHTML = '<article class="book"><p class="crumbs"><a href="./?page=notes">Notes</a></p>' +
          '<header class="book-head"><p class="eyebrow">Marzley Tech Learning Hub · Course notes</p><h1>' + esc(track.title) + " notes</h1><p class=\"lead\">" + esc(track.summary || "") + "</p>" +
          '<p class="book-tools"><button type="button" class="btn btn-solid btn-sm" id="book-pdf"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> <span id="book-pdf-label">Save as PDF · ' + esc(kes(state.notesPrice)) + "</span></button>" +
          '<a class="btn btn-line btn-sm" href="./?track=' + esc(track.slug) + '"><i class="fa-solid fa-play" aria-hidden="true"></i> Start the interactive course</a></p>' +
          '<p class="muted book-meta">' + track.lessons.length + " topics · free to read online · PDF download " + esc(kes(state.notesPrice)) + " via M-Pesa · marzleytechsolutions.co.ke/learn</p></header>" +
          '<nav class="book-toc" aria-label="Contents"><h2>Contents</h2><ol>' + toc + "</ol></nav>" + parts +
          '<footer class="book-foot">© Marzley Tech Solutions · Free learning hub: marzleytechsolutions.co.ke/learn · Questions? WhatsApp 0745 789 590</footer></article>';
        bookPdfSetup(track);
      });
    }).catch(function (e) { errorBox(e.message); });
  }

  /** A lesson rendered for reading and printing: runnable examples become plain code, quizzes show their answers. */
  function bookBody(l, track) {
    var md = markdown(l.body);
    var box = el("<div>" + md.html + "</div>");
    md.blocks.forEach(function (b, n) {
      var h = box.querySelector('[data-try="' + n + '"]');
      if (h) h.outerHTML = '<pre class="code-sample"><code>' + esc(b.code) + "</code></pre>";
    });
    md.quizzes.forEach(function (q, n) {
      var h = box.querySelector('[data-quiz="' + n + '"]');
      if (!h) return;
      var items = [], cur = null;
      String(q).split("\n").forEach(function (line) {
        var m = line.match(/^\s*([QAH]):\s*(.*)$/);
        if (!m) return;
        if (m[1] === "Q") { cur = { q: m[2] }; items.push(cur); }
        else if (cur && m[1] === "A") cur.a = m[2].split("|")[0].trim();
      });
      h.outerHTML = '<section class="book-quiz"><h3><i class="fa-solid fa-circle-question" aria-hidden="true"></i> Check yourself</h3><ol>' + items.map(function (it) {
        return "<li>" + inline(it.q) + (it.a ? ' <details><summary>Answer</summary><strong>' + esc(it.a) + "</strong></details>" : "") + "</li>";
      }).join("") + "</ol></section>";
    });
    box.querySelectorAll("[data-tool]").forEach(function (h) { h.outerHTML = '<p class="muted"><i class="fa-solid fa-calculator" aria-hidden="true"></i> An interactive tool is available in the online lesson.</p>'; });
    var ex = l.exercise ? '<section class="book-ex"><h3><i class="fa-solid fa-dumbbell" aria-hidden="true"></i> Exercise</h3>' + markdown(l.exercise).html + "</section>" : "";
    return box.innerHTML + ex;
  }

  // ---------- course notes as a PDF: paid once with M-Pesa, then downloaded (not printed) ----------
  // Reading online stays free. The PDF is made in the browser from the notes on the page, after the
  // server confirms the payment and gives this browser a download token (kept for free re-downloads).
  var payDlg = null, payPoll = null;
  function pdfTokenKey(slug) { return "notes-pdf:" + slug; }
  function stopPayPoll() { if (payPoll) { clearInterval(payPoll); payPoll = null; } }

  function bookPdfSetup(track) {
    var btn = $("#book-pdf");
    if (store.get(pdfTokenKey(track.slug))) $("#book-pdf-label").textContent = "Download PDF";
    btn.addEventListener("click", function () { startNotesPdf(track); });
    // Printing is turned off for course notes: Ctrl+P opens the PDF download instead
    var onKey = function (e) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && String(e.key).toLowerCase() === "p") { e.preventDefault(); startNotesPdf(track); }
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-print");
    cleanup.push(function () { document.removeEventListener("keydown", onKey); document.body.classList.remove("no-print"); stopPayPoll(); if (payDlg && payDlg.open) payDlg.close(); });
  }

  function payDialog() {
    if (payDlg) return payDlg;
    payDlg = el('<dialog class="learn-dialog pay-dialog" aria-labelledby="pay-title"><form method="dialog" class="dialog-close"><button class="icon-btn" aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></form><div id="pay-body"></div></dialog>');
    document.body.appendChild(payDlg);
    payDlg.addEventListener("close", stopPayPoll);
    return payDlg;
  }
  function openPay(html) {
    var d = payDialog();
    $("#pay-body", d).innerHTML = html;
    if (!d.open) { if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", ""); }
    return d;
  }
  function closePay() { stopPayPoll(); if (payDlg && payDlg.open) payDlg.close(); }

  function startNotesPdf(track) {
    var token = store.get(pdfTokenKey(track.slug));
    if (token) {
      openPay('<div class="pay-center"><span class="spinner" aria-hidden="true"></span><h2 id="pay-title">Checking your download…</h2></div>');
      api("notes_access", undefined, "&track=" + encodeURIComponent(track.slug) + "&token=" + encodeURIComponent(token)).then(function (info) {
        makeNotesPdf(track, token, info);
      }).catch(function (e) {
        if (e.status === 403) { try { localStorage.removeItem("learn:" + pdfTokenKey(track.slug)); } catch (x) {} return payForm(track); }
        payMessage("Couldn’t check your download", e.message, track);
      });
      return;
    }
    payForm(track);
  }

  function payForm(track, err) {
    var price = kes(state.notesPrice);
    if (!state.mpesa) {
      openPay('<h2 id="pay-title">Unlock PDF download</h2><p class="muted">Online payment is being set up. WhatsApp us and we’ll send you the ' + esc(track.title) + ' notes PDF.</p>' +
        '<p><a class="btn btn-solid pay-btn" href="https://wa.me/254745789590?text=' + encodeURIComponent("Hello Marzley, I'd like the " + track.title + " notes as a PDF.") + '" target="_blank" rel="noopener noreferrer">WhatsApp us</a></p>');
      return;
    }
    var d = openPay('<h2 id="pay-title" class="pay-title">Unlock PDF Download</h2><p class="pay-sub">A payment of <strong>' + esc(price) + '</strong> is required to download the <strong>' + esc(track.title) + '</strong> notes (' + track.lessons.length + ' topics) as a PDF.</p>' +
      '<form id="pay-form" class="pay-form" novalidate><label for="pay-phone">M-PESA PHONE NUMBER</label><div class="pay-phone"><span>+254</span><input id="pay-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="712345678" maxlength="13" value="' + esc((store.get("phone") || "").replace(/^(\+?254|0)/, "")) + '" required /></div>' +
      '<p class="form-msg pay-err" id="pay-msg" role="status" aria-live="polite">' + esc(err || "") + '</p><button type="submit" class="btn pay-btn" id="pay-go">Pay ' + esc(price) + '</button></form>' +
      '<button type="button" class="pay-link" id="pay-cancel">Cancel</button><button type="button" class="pay-small" id="pay-recover">Already paid but didn’t get your document?</button>' +
      '<p class="pay-note">Reading the notes online stays free. The PDF is for your personal use and works on this device whenever you come back.</p>');
    $("#pay-cancel", d).addEventListener("click", closePay);
    $("#pay-recover", d).addEventListener("click", function () { recoverForm(track); });
    setTimeout(function () { var i = $("#pay-phone", d); if (i && !i.value) i.focus(); }, 50);
    $("#pay-form", d).addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = $("#pay-phone", d).value.replace(/\s+/g, "");
      var phone = /^(0|254|\+254)/.test(raw) ? raw.replace(/^\+/, "") : "0" + raw;
      if (!/^(0[17]\d{8}|254[17]\d{8})$/.test(phone)) { $("#pay-msg", d).textContent = "Enter your M-Pesa number, for example 712 345 678."; return; }
      var go = $("#pay-go", d);
      go.disabled = true; go.textContent = "Sending request…";
      store.set("phone", phone);
      api("notes_pay", { track: track.slug, phone: phone }).then(function (r) { payWaiting(track, r.checkout_id, r.amount || state.notesPrice); })
        .catch(function (er) { go.disabled = false; go.textContent = "Pay " + price; $("#pay-msg", d).textContent = er.message; });
    });
  }

  function payWaiting(track, checkout, amount) {
    var d = openPay('<div class="pay-center"><span class="pay-phone-ico" aria-hidden="true"><i class="fa-solid fa-mobile-screen"></i></span><h2 id="pay-title">Request Sent!</h2>' +
      '<p class="pay-sub">Please check your phone and enter your M-PESA PIN to complete the payment of ' + esc(kes(amount)) + '.</p>' +
      '<p class="pay-wait" id="pay-wait" role="status" aria-live="polite"><span class="spinner" aria-hidden="true"></span> Waiting to auto-detect payment…</p>' +
      '<button type="button" class="btn pay-check" id="pay-check">Check Now</button><button type="button" class="pay-link" id="pay-cancel">Cancel</button></div>');
    var tries = 0, busy = false;
    var check = function (manual) {
      if (busy) return;
      busy = true;
      api("notes_pay_status", undefined, "&checkout=" + encodeURIComponent(checkout) + (manual ? "&check=1" : "")).then(function (s) {
        busy = false;
        if (s.status === "paid" && s.token) {
          stopPayPoll();
          store.set(pdfTokenKey(track.slug), s.token);
          var lbl = $("#book-pdf-label"); if (lbl) lbl.textContent = "Download PDF";
          makeNotesPdf(track, s.token, null);
        } else if (s.status === "failed") {
          stopPayPoll();
          payForm(track, "The payment didn’t go through (it may have been cancelled or timed out). You can try again.");
        } else if (manual) {
          $("#pay-wait", d).innerHTML = '<span class="spinner" aria-hidden="true"></span> Not received yet. Enter your PIN on the M-Pesa prompt, then tap Check Now.';
        }
      }).catch(function (e) { busy = false; if (manual) $("#pay-wait", d).textContent = e.message; });
    };
    stopPayPoll();
    payPoll = setInterval(function () {
      if (++tries > 60) { stopPayPoll(); $("#pay-wait", d).textContent = "Still waiting. If you paid, tap Check Now, or use “Already paid” with your M-Pesa receipt."; return; }
      check(false);
    }, 3000);
    $("#pay-check", d).addEventListener("click", function () { check(true); });
    $("#pay-cancel", d).addEventListener("click", closePay);
  }

  function recoverForm(track) {
    var d = openPay('<h2 id="pay-title" class="pay-title">Get your PDF</h2><p class="pay-sub">Enter the number you paid with and the M-Pesa receipt code from your confirmation SMS.</p>' +
      '<form id="rec-form" class="pay-form" novalidate><label for="rec-phone">M-PESA PHONE NUMBER</label><div class="pay-phone"><span>+254</span><input id="rec-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="712345678" value="' + esc((store.get("phone") || "").replace(/^(\+?254|0)/, "")) + '" required /></div>' +
      '<label for="rec-code">M-PESA RECEIPT CODE</label><input id="rec-code" class="pay-input" autocapitalize="characters" placeholder="e.g. SJK4H2L9XA" maxlength="20" required />' +
      '<p class="form-msg pay-err" id="rec-msg" role="status" aria-live="polite"></p><button type="submit" class="btn pay-btn" id="rec-go">Get my PDF</button></form>' +
      '<button type="button" class="pay-link" id="rec-back">Back</button><p class="pay-note">Still stuck? <a href="https://wa.me/254745789590?text=' + encodeURIComponent("Hello Marzley, I paid for the " + track.title + " notes PDF but didn't get it.") + '" target="_blank" rel="noopener noreferrer">WhatsApp us</a> your M-Pesa message.</p>');
    $("#rec-back", d).addEventListener("click", function () { payForm(track); });
    $("#rec-form", d).addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = $("#rec-phone", d).value.replace(/\s+/g, "");
      var phone = /^(0|254|\+254)/.test(raw) ? raw.replace(/^\+/, "") : "0" + raw;
      var go = $("#rec-go", d);
      go.disabled = true; go.textContent = "Checking…";
      api("notes_recover", { track: track.slug, phone: phone, receipt: $("#rec-code", d).value }).then(function (r) {
        store.set(pdfTokenKey(track.slug), r.token);
        var lbl = $("#book-pdf-label"); if (lbl) lbl.textContent = "Download PDF";
        makeNotesPdf(track, r.token, null);
      }).catch(function (er) { go.disabled = false; go.textContent = "Get my PDF"; $("#rec-msg", d).textContent = er.message; });
    });
  }

  function payMessage(title, text, track) {
    var d = openPay('<h2 id="pay-title" class="pay-title">' + esc(title) + '</h2><p class="pay-sub">' + esc(text) + '</p><button type="button" class="btn pay-btn" id="pay-retry">Try again</button>');
    $("#pay-retry", d).addEventListener("click", function () { startNotesPdf(track); });
  }

  // pdfmake and its fonts load only when someone downloads a PDF
  var pdfMakeReady = null;
  var PDF_FONT_FILES = ["Roboto-Regular.ttf", "Roboto-Medium.ttf", "Roboto-Italic.ttf", "Roboto-MediumItalic.ttf", "DejaVuSansMono.ttf", "DejaVuSansMono-Bold.ttf"];
  function loadPdfMake() {
    if (pdfMakeReady) return pdfMakeReady;
    var base = "../vendor/pdfmake/";
    var script = new Promise(function (res, rej) {
      if (window.pdfMake) return res();
      var s = document.createElement("script");
      s.src = base + "pdfmake.min.js";
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error("The PDF maker could not load. Check your connection and try again.")); };
      document.head.appendChild(s);
    });
    var toB64 = function (buf) {
      var bytes = new Uint8Array(buf), out = "", step = 0x8000;
      for (var i = 0; i < bytes.length; i += step) out += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
      return btoa(out);
    };
    var fonts = Promise.all(PDF_FONT_FILES.map(function (f) {
      return fetch(base + f).then(function (r) { if (!r.ok) throw new Error("A font for the PDF could not load."); return r.arrayBuffer(); }).then(function (b) { return [f, toB64(b)]; });
    })).then(function (pairs) { var vfs = {}; pairs.forEach(function (p) { vfs[p[0]] = p[1]; }); return vfs; });
    pdfMakeReady = Promise.all([script, fonts]).then(function (r) { return r[1]; });
    pdfMakeReady.catch(function () { pdfMakeReady = null; });
    return pdfMakeReady;
  }

  function makeNotesPdf(track, token, info) {
    var d = openPay('<div class="pay-center"><span class="pay-ok-ico" aria-hidden="true"><i class="fa-solid fa-circle-check"></i></span><h2 id="pay-title">' + (info ? "Preparing your PDF" : "Payment received!") + '</h2>' +
      '<p class="pay-wait" id="pdf-state" role="status" aria-live="polite"><span class="spinner" aria-hidden="true"></span> Making your PDF… this takes a few seconds.</p></div>');
    var lic = info ? Promise.resolve(info) : api("notes_access", undefined, "&track=" + encodeURIComponent(track.slug) + "&token=" + encodeURIComponent(token));
    var book = main.querySelector("article.book");
    Promise.all([lic, loadPdfMake()]).then(function (r) {
      if (!book) throw new Error("Open the notes page, then tap Download PDF.");
      var licence = r[0], vfs = r[1];
      return new Promise(function (res) { setTimeout(res, 30); }).then(function () {
        var doc = notesPdfDoc(track, book, licence);
        var fonts = {
          Roboto: { normal: "Roboto-Regular.ttf", bold: "Roboto-Medium.ttf", italics: "Roboto-Italic.ttf", bolditalics: "Roboto-MediumItalic.ttf" },
          Mono: { normal: "DejaVuSansMono.ttf", bold: "DejaVuSansMono-Bold.ttf", italics: "DejaVuSansMono.ttf", bolditalics: "DejaVuSansMono-Bold.ttf" }
        };
        var name = "Marzley-Tech-" + track.title.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-notes.pdf";
        return new Promise(function (res, rej) {
          try {
            var pdf = window.pdfMake.createPdf(doc, null, fonts, vfs);
            pdf.getBlob(function (blob) {
              var url = URL.createObjectURL(blob);
              var a = document.createElement("a");
              a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
              setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
              res({ name: name, size: blob.size });
            });
          } catch (e) { rej(e); }
        });
      });
    }).then(function (f) {
      api("notes_access", undefined, "&track=" + encodeURIComponent(track.slug) + "&token=" + encodeURIComponent(token) + "&dl=1").catch(function () {});
      $("#pay-title", d).textContent = "Your PDF is ready";
      $("#pdf-state", d).innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i> ' + esc(f.name) + " (" + fmtSize(f.size) + ") has been downloaded. Check your Downloads folder.";
      d.querySelector(".pay-center").appendChild(el('<button type="button" class="btn pay-check" id="pdf-again">Download again</button>'));
      $("#pdf-again", d).addEventListener("click", function () { makeNotesPdf(track, token, null); });
    }).catch(function (e) {
      $("#pay-title", d).textContent = "The PDF couldn’t be made";
      $("#pdf-state", d).textContent = (e && e.message ? e.message : "Something went wrong.") + " Your payment is saved: tap Download PDF again in a moment.";
    });
  }

  /** Turns the notes on the page into a pdfmake document: headings, text, lists, code, tables and boxes. */
  function notesPdfDoc(track, book, licence) {
    var EMOJI = /[\u{1F000}-\u{1FAFF}\u{FE0F}\u{200D}\u{20E3}]/gu;
    var SYMBOLS = /[\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/gu;
    var clean = function (t) { return String(t).replace(EMOJI, "").replace(SYMBOLS, ""); };
    var cleanCode = function (t) {
      return String(t).replace(EMOJI, "").replace(/\t/g, "    ").split("\n").map(function (line) {
        var out = [];
        while (line.length > 92) { out.push(line.slice(0, 92)); line = "  " + line.slice(92); }
        out.push(line);
        return out.join("\n");
      }).join("\n").replace(/\s+$/, "");
    };
    var isIcon = function (n) { return n.tagName === "I" && /\bfa-/.test(n.className); };

    function inline(node, st) {
      st = st || {};
      var runs = [];
      node.childNodes.forEach(function (c) {
        if (c.nodeType === 3) {
          var t = clean(c.nodeValue.replace(/\s+/g, " "));
          if (t) runs.push(Object.assign({ text: t }, st));
          return;
        }
        if (c.nodeType !== 1 || isIcon(c)) return;
        var tag = c.tagName;
        if (tag === "BR") runs.push({ text: "\n" });
        else if (tag === "STRONG" || tag === "B") runs = runs.concat(inline(c, Object.assign({}, st, { bold: true })));
        else if (tag === "EM" || tag === "I") runs = runs.concat(inline(c, Object.assign({}, st, { italics: true })));
        else if (tag === "CODE" || tag === "KBD") runs.push(Object.assign({}, st, { text: c.textContent.replace(EMOJI, ""), font: "Mono", fontSize: 8.6, color: "#9a3412" }));
        else if (tag === "A") runs = runs.concat(inline(c, Object.assign({}, st, { color: "#1d4ed8" })));
        else if (tag === "DETAILS") {
          runs.push(Object.assign({}, st, { text: "  Answer: ", bold: true, color: "#166534" }));
          c.childNodes.forEach(function (k) {
            if (k.nodeType === 1 && k.tagName === "SUMMARY") return;
            var wrap = document.createElement("span"); wrap.appendChild(k.cloneNode(true));
            runs = runs.concat(inline(wrap, Object.assign({}, st, { color: "#166534" })));
          });
        }
        else if (tag === "BUTTON" || tag === "SCRIPT" || tag === "STYLE") return;
        else runs = runs.concat(inline(c, st));
      });
      return runs;
    }
    function hasText(runs) { return runs.some(function (r) { return typeof r === "object" && /\S/.test(r.text || ""); }); }

    function codeBlock(text) {
      return { table: { widths: ["*"], body: [[{ text: cleanCode(text), font: "Mono", fontSize: 8, lineHeight: 1.18, preserveLeadingSpaces: true, color: "#0f172a" }]] },
        layout: { fillColor: function () { return "#f3f5f8"; }, hLineColor: function () { return "#d8dee6"; }, vLineColor: function () { return "#d8dee6"; },
          paddingLeft: function () { return 8; }, paddingRight: function () { return 8; }, paddingTop: function () { return 6; }, paddingBottom: function () { return 6; } },
        margin: [0, 2, 0, 10] };
    }
    function boxBlock(title, body, color, fill) {
      var stack = [];
      if (title && hasText(title)) stack.push({ text: title, bold: true, color: color, margin: [0, 0, 0, 4] });
      stack = stack.concat(body);
      return { table: { widths: ["*"], body: [[{ stack: stack }]] }, headlineLevel: 1,
        layout: { fillColor: function () { return fill; }, hLineWidth: function () { return 0; }, vLineWidth: function (i) { return i === 0 ? 3 : 0; }, vLineColor: function () { return color; },
          paddingLeft: function () { return 10; }, paddingRight: function () { return 10; }, paddingTop: function () { return 8; }, paddingBottom: function () { return 6; } },
        margin: [0, 4, 0, 10] };
    }
    function tableBlock(t) {
      var rows = [];
      t.querySelectorAll("tr").forEach(function (tr, ri) {
        var cells = [];
        tr.querySelectorAll("th, td").forEach(function (c) {
          var runs = inline(c);
          cells.push({ text: runs.length ? runs : " ", bold: c.tagName === "TH", fontSize: 8.6, fillColor: c.tagName === "TH" ? "#e8edf4" : (ri % 2 ? null : "#fafbfc") });
        });
        if (cells.length) rows.push(cells);
      });
      if (!rows.length) return null;
      var n = Math.max.apply(null, rows.map(function (r) { return r.length; }));
      rows = rows.map(function (r) { while (r.length < n) r.push({ text: " " }); return r; });
      var widths = []; for (var i = 0; i < n; i++) widths.push("*");
      return { table: { headerRows: 1, keepWithHeaderRows: 1, dontBreakRows: true, widths: widths, body: rows }, layout: { hLineColor: function () { return "#d8dee6"; }, vLineColor: function () { return "#d8dee6"; },
        paddingLeft: function () { return 5; }, paddingRight: function () { return 5; }, paddingTop: function () { return 3; }, paddingBottom: function () { return 3; } }, margin: [0, 2, 0, 10] };
    }
    function listItem(li) {
      var blockKids = li.querySelector(":scope > ul, :scope > ol, :scope > pre, :scope > p, :scope > div, :scope > table");
      if (!blockKids) return { text: inline(li), margin: [0, 1, 0, 2] };
      var stack = [], buf = document.createElement("span");
      li.childNodes.forEach(function (k) {
        if (k.nodeType === 1 && /^(UL|OL|PRE|P|DIV|TABLE)$/.test(k.tagName)) {
          if (buf.childNodes.length) { var r = inline(buf); if (hasText(r)) stack.push({ text: r }); buf = document.createElement("span"); }
          var holder = document.createElement("div"); holder.appendChild(k.cloneNode(true));
          stack = stack.concat(blocks(holder));
        } else buf.appendChild(k.cloneNode(true));
      });
      if (buf.childNodes.length) { var r2 = inline(buf); if (hasText(r2)) stack.push({ text: r2 }); }
      return { stack: stack, margin: [0, 1, 0, 2] };
    }
    var SKIP = /\b(book-open|book-tools|crumbs|book-toc|sr-only|book-foot|book-meta)\b/;
    var CALLOUT_COLORS = { note: ["#1d4ed8", "#eef4ff"], tip: ["#15803d", "#effaf2"], warning: ["#b45309", "#fff7e8"], example: ["#7c3aed", "#f5f1ff"],
      define: ["#0e7490", "#ecfbfe"], kenya: ["#166534", "#effaf2"], career: ["#9d174d", "#fdf0f6"], think: ["#6d28d9", "#f5f1ff"] };

    function blocks(node) {
      var out = [];
      node.childNodes.forEach(function (c) {
        if (c.nodeType === 3) { var t = clean(c.nodeValue.replace(/\s+/g, " ")).trim(); if (t) out.push({ text: t, style: "p" }); return; }
        if (c.nodeType !== 1 || isIcon(c) || SKIP.test(c.className || "")) return;
        var tag = c.tagName, cls = c.className || "";
        if (/^H[1-6]$/.test(tag)) { var hr = inline(c); if (hasText(hr)) out.push({ text: hr, style: tag === "H1" ? "h1" : tag === "H2" ? "h2" : tag === "H3" ? "h3" : "h4", headlineLevel: 1 }); }
        else if (tag === "P") {
          var pr = inline(c);
          if (!hasText(pr)) return;
          if (/\bbook-num\b/.test(cls)) out.push({ text: pr, style: "eyebrow" });
          else if (/\bcallout-title\b/.test(cls)) out.push({ text: pr, bold: true });
          else out.push({ text: pr, style: "p" });
        }
        else if (tag === "UL" || tag === "OL") {
          var items = []; c.querySelectorAll(":scope > li").forEach(function (li) { items.push(listItem(li)); });
          if (items.length) { var lst = { style: "list" }; lst[tag === "UL" ? "ul" : "ol"] = items; out.push(lst); }
        }
        else if (tag === "PRE") out.push(codeBlock(c.textContent));
        else if (tag === "TABLE") { var tb = tableBlock(c); if (tb) out.push(tb); }
        else if (tag === "HR") out.push({ canvas: [{ type: "line", x1: 0, y1: 4, x2: 495, y2: 4, lineWidth: 0.6, lineColor: "#cbd5e1" }], margin: [0, 4, 0, 10] });
        else if (tag === "DETAILS" && /\bcallout-think\b/.test(cls)) {
          var span = c.querySelector("summary span"), body = c.querySelector(".callout-body");
          var col = CALLOUT_COLORS.think;
          out.push(boxBlock(span ? inline(span) : [{ text: "Think about it" }], [{ text: "Answer:", bold: true, color: col[0], margin: [0, 2, 0, 2] }].concat(body ? blocks(body) : []), col[0], col[1]));
        }
        else if (tag === "DETAILS") {
          var sm = c.querySelector("summary"), rest = document.createElement("div");
          c.childNodes.forEach(function (k) { if (!(k.nodeType === 1 && k.tagName === "SUMMARY")) rest.appendChild(k.cloneNode(true)); });
          out.push({ stack: [{ text: sm ? inline(sm) : "", bold: true }].concat(blocks(rest)), margin: [0, 2, 0, 8] });
        }
        else if (tag === "ASIDE" || tag === "BLOCKQUOTE" || /\bbook-quiz\b|\bbook-ex\b/.test(cls)) {
          var kind = (cls.match(/callout-(\w+)/) || [])[1] || (/\bbook-quiz\b/.test(cls) ? "think" : /\bbook-ex\b/.test(cls) ? "tip" : /\btip\b/.test(cls) ? "tip" : "note");
          var colr = CALLOUT_COLORS[kind] || CALLOUT_COLORS.note;
          var titleEl = c.querySelector(":scope > .callout-title, :scope > h3");
          var rest2 = document.createElement("div");
          c.childNodes.forEach(function (k) { if (k !== titleEl) rest2.appendChild(k.cloneNode(true)); });
          out.push(boxBlock(titleEl ? inline(titleEl) : null, blocks(rest2), colr[0], colr[1]));
        }
        else if (/^(IMG|SVG|IFRAME|VIDEO|AUDIO|BUTTON|FORM|INPUT|SELECT|TEXTAREA|SCRIPT|STYLE|CANVAS|NOSCRIPT)$/.test(tag)) return;
        else if (/^(DIV|SECTION|ARTICLE|HEADER|FOOTER|MAIN|NAV|FIGURE|SPAN|DL)$/.test(tag)) {
          var inner = blocks(c);
          if (inner.length) out = out.concat(inner);
          else { var ir = inline(c); if (hasText(ir)) out.push({ text: ir, style: "p" }); }
        }
        else { var other = inline(c); if (hasText(other)) out.push({ text: other, style: "p" }); }
      });
      return out;
    }

    var today = new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
    var lic = licence && licence.receipt ? "Licensed to " + licence.phone + " · M-Pesa " + licence.receipt : "Licensed copy";
    var lead = book.querySelector(".book-head .lead");
    var content = [
      { text: "MARZLEY TECH LEARNING HUB · COURSE NOTES", style: "eyebrow", margin: [0, 120, 0, 10] },
      { text: track.title + " notes", fontSize: 34, bold: true, color: "#0b1b35", margin: [0, 0, 0, 12] },
      { text: clean(lead ? lead.textContent : (track.summary || "")), fontSize: 13, color: "#475569", lineHeight: 1.35, margin: [0, 0, 0, 24] },
      { canvas: [{ type: "rect", x: 0, y: 0, w: 90, h: 4, color: "#f5b400" }], margin: [0, 0, 0, 18] },
      { text: track.lessons.length + " topics, from the basics up, with examples, practice questions and answers.", fontSize: 11, color: "#334155", margin: [0, 0, 0, 6] },
      { text: "Downloaded " + today + " · " + lic, fontSize: 9.5, color: "#64748b", margin: [0, 0, 0, 4] },
      { text: "Interactive lessons, live code and videos: marzleytechsolutions.co.ke/learn", fontSize: 9.5, color: "#64748b" },
      { text: "This PDF is for your personal use. Please don’t share or resell it. © Marzley Tech Solutions.", fontSize: 8.5, color: "#94a3b8", margin: [0, 140, 0, 0] },
      { toc: { title: { text: "Contents", style: "h1" }, numberStyle: { color: "#64748b" }, textStyle: { fontSize: 10.5 } }, pageBreak: "before" }
    ];
    book.querySelectorAll("section.book-part").forEach(function (part) {
      var b = blocks(part);
      if (!b.length) return;
      b[0].pageBreak = "before";
      for (var i = 0; i < b.length; i++) { if (b[i].style === "h1" || b[i].style === "h2") { b[i].tocItem = true; b[i].tocMargin = [0, 3, 0, 0]; break; } }
      content = content.concat(b);
    });
    content.push({ text: "Keep learning", style: "h2", pageBreak: "before" });
    content.push({ text: "Practise every topic with live code, quizzes and videos at marzleytechsolutions.co.ke/learn. Questions? WhatsApp 0745 789 590.", style: "p" });

    return {
      pageSize: "A4",
      pageMargins: [50, 58, 50, 58],
      info: { title: track.title + " notes · Marzley Tech", author: "Marzley Tech Solutions", subject: track.title + " course notes", creator: "Marzley Tech Learning Hub" },
      header: function (page) {
        if (page === 1) return null;
        return { columns: [{ text: track.title + " notes" }, { text: "Marzley Tech Learning Hub", alignment: "right" }], margin: [50, 26, 50, 0], fontSize: 8, color: "#94a3b8" };
      },
      footer: function (page, pages) {
        if (page === 1) return null;
        return { columns: [{ text: lic + " · personal use only", width: "*" }, { text: page + " / " + pages, alignment: "right", width: 60 }], margin: [50, 22, 50, 0], fontSize: 7.5, color: "#94a3b8" };
      },
      content: content,
      // A heading never sits alone at the bottom of a page
      pageBreakBefore: function (node, followingOnPage) { return !!node.headlineLevel && node.pageBreak !== "before" && followingOnPage.length < 2; },
      defaultStyle: { font: "Roboto", fontSize: 10, lineHeight: 1.3, color: "#1f2937" },
      styles: {
        h1: { fontSize: 19, bold: true, color: "#0b1b35", margin: [0, 2, 0, 10], lineHeight: 1.15 },
        h2: { fontSize: 14.5, bold: true, color: "#0b1b35", margin: [0, 12, 0, 6], lineHeight: 1.15 },
        h3: { fontSize: 12, bold: true, color: "#1e293b", margin: [0, 10, 0, 4] },
        h4: { fontSize: 10.5, bold: true, color: "#1e293b", margin: [0, 8, 0, 3] },
        p: { margin: [0, 0, 0, 7] },
        list: { margin: [0, 0, 0, 8] },
        eyebrow: { fontSize: 8.5, bold: true, color: "#a16207", characterSpacing: 0.6, margin: [0, 0, 0, 4] }
      }
    };
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
      state.notesPrice = Number(j.notes_price) || state.notesPrice;
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
    if (p.get("book")) return pageBook(p.get("book"));
    var page = p.get("page");
    if (page === "tutorials") return pageTutorials();
    if (page === "practice") return pagePractice(p.get("lang"));
    if (page === "videos") return pageVideos();
    if (page === "notes") return pageNotes();
    if (page === "search") return pageSearch(p.get("q") || "");
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
