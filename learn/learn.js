/* Marzley Tech learning hub: tutorials with live code, practice, videos (unlocked with M-Pesa) and free notes.
 * Learner code never runs on this page: it runs in runner.html, a sandboxed frame with no access to the site. */
(function () {
  "use strict";
  var API = "../portal/learn.php?action=";
  var LANGS = { html: "HTML", css: "CSS", javascript: "JavaScript", python: "Python", sql: "SQL" };
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
    var lines = String(src || "").replace(/\r/g, "").split("\n"), out = [], blocks = [], i = 0, para = [];
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
    return { html: out.join("\n"), blocks: blocks };
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
        setTimeout(function () { if (!done) { window.removeEventListener("message", onMsg); resolve({ text: "", ok: false, error: "timeout" }); } }, lang === "python" ? 90000 : 8000);
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

  function setTitle(t, desc) {
    document.title = t ? t + " | Marzley Tech Learning Hub" : "Learn to code free: HTML, CSS, JavaScript, Python, SQL | Marzley Tech Solutions";
    if (desc) { var m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute("content", desc); }
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
      '<a class="side-practice" href="./?page=practice&amp;lang=' + esc(track.lang) + '"><i class="fa-solid fa-code" aria-hidden="true"></i> Practice ' + esc(track.title) + "</a>";
  }

  // ---------- pages ----------
  function pageHome() {
    setNav("");
    showSide(false);
    setTitle("");
    main.innerHTML = '<section class="hero-learn"><div><p class="eyebrow">Marzley Tech Learning Hub</p><h1>Learn to code, free, right in your browser</h1>' +
      '<p class="lead">Read simple lessons, edit the examples and see the result instantly. No installs, works on your phone. Then practise, read free notes and watch step-by-step videos.</p>' +
      '<p class="hero-ctas"><a class="btn btn-solid" href="./?track=html">Start with HTML</a><a class="btn btn-line" href="./?page=practice">Open the code editor</a></p></div>' +
      '<div class="hero-code" aria-hidden="true"><pre><span class="c-k">print</span>(<span class="c-s">"Habari, Kenya!"</span>)\n<span class="c-t">&lt;h1&gt;</span>Hello<span class="c-t">&lt;/h1&gt;</span>\n<span class="c-k">SELECT</span> * <span class="c-k">FROM</span> Customers;</pre></div></section>' +
      '<section class="home-sec"><h2>Tutorials</h2><div class="track-grid" id="track-grid"><p class="muted">Loading…</p></div></section>' +
      '<section class="home-sec"><div class="sec-head"><h2>Latest videos</h2><a href="./?page=videos">All videos</a></div><div class="video-grid" id="home-videos"></div></section>' +
      '<section class="home-sec"><div class="sec-head"><h2>Free notes &amp; books</h2><a href="./?page=notes">All notes</a></div><div class="note-grid" id="home-notes"></div></section>';
    var icons = { html: "fa-brands fa-html5", css: "fa-brands fa-css3-alt", javascript: "fa-brands fa-js", python: "fa-brands fa-python", sql: "fa-solid fa-database" };
    getCatalog().then(function (tracks) {
      $("#track-grid").innerHTML = tracks.map(function (t) {
        var done = t.lessons.filter(function (l) { return isDone(l.id); }).length;
        var first = t.lessons[0];
        return '<a class="track-card t-' + esc(t.lang) + '" href="./?track=' + esc(t.slug) + (first ? "&amp;lesson=" + esc(first.slug) : "") + '"><i class="' + (icons[t.lang] || "fa-solid fa-book") + '" aria-hidden="true"></i>' +
          "<h3>" + esc(t.title) + "</h3><p>" + esc(t.summary) + '</p><span class="track-meta">' + t.lessons.length + " lessons" + (done ? " · " + done + " done" : "") + "</span>" +
          '<span class="bar" aria-hidden="true"><span style="width:' + (t.lessons.length ? Math.round(100 * done / t.lessons.length) : 0) + '%"></span></span></a>';
      }).join("") || '<p class="muted">Tutorials are coming soon.</p>';
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
        setTitle(l.title + " (" + track.title + ")", "Free " + track.title + " lesson: " + l.title + ". Read, edit the code and see the result live.");
        var md = markdown(l.body, true);
        var pager = '<nav class="pager" aria-label="Lessons">' +
          (prev ? '<a class="btn btn-line btn-sm" href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(prev.slug) + '"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> ' + esc(prev.title) + "</a>" : "<span></span>") +
          (next ? '<a class="btn btn-solid btn-sm" href="./?track=' + esc(track.slug) + "&amp;lesson=" + esc(next.slug) + '">' + esc(next.title) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' : "<span></span>") + "</nav>";
        main.innerHTML = '<article class="lesson"><p class="crumbs"><a href="./">Learn</a> / <a href="./?track=' + esc(track.slug) + '">' + esc(track.title) + "</a></p>" + pager.replace('class="pager" aria-label="Lessons"', 'class="pager pager-top" aria-label="Previous and next lesson"') +
          '<div class="lesson-body">' + md.html + "</div>" + (l.exercise ? '<section class="exercise" id="exercise" aria-labelledby="ex-title"><h2 id="ex-title"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i> Exercise</h2><div class="ex-task">' + markdown(l.exercise).html + '</div><div id="ex-host"></div><p class="ex-result" id="ex-result" role="status" aria-live="polite"></p></section>' :
          '<p class="done-row"><button type="button" class="btn btn-line btn-sm" id="mark-done">' + (isDone(l.id) ? '<i class="fa-solid fa-check" aria-hidden="true"></i> Completed' : "Mark as completed") + "</button></p>") + pager + "</article>";
        md.blocks.forEach(function (b, n) { codeBlock(main.querySelector('[data-try="' + n + '"]'), { lang: b.lang, code: b.code }); });
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
  function pageVideos() {
    setNav("videos");
    showSide(false);
    setTitle("Video lessons", "Step-by-step coding video lessons. Unlock each one with M-Pesa.");
    main.innerHTML = '<section class="list-page"><h1>Video lessons</h1><p class="lead">Step-by-step lessons you can pause and replay. Unlock a video once with M-Pesa and it’s yours to watch any time.</p><div class="video-grid" id="vid-grid"><p class="muted">Loading…</p></div></section>';
    api("videos").then(function (j) {
      $("#vid-grid").innerHTML = (j.videos || []).map(function (v) { return videoCard(v, "h2"); }).join("") || '<div class="empty"><i class="fa-solid fa-video" aria-hidden="true"></i><p>Video lessons are coming soon.</p></div>';
    }).catch(function (e) { $("#vid-grid").innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
  }

  function pageVideo(id) {
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
      p.innerHTML = '<video controls playsinline preload="metadata" controlslist="nodownload" disablepictureinpicture' + (v.poster ? ' poster="../portal/' + esc(v.poster) + '"' : "") +
        ' src="../portal/learn.php?action=stream&amp;id=' + v.id + '"></video>';
      p.querySelector("video").addEventListener("contextmenu", function (e) { e.preventDefault(); });
      return;
    }
    p.innerHTML = '<div class="locked"' + (v.poster ? ' style="background-image:url(\'../portal/' + esc(v.poster) + '\')"' : "") + '><div class="lock-card">' +
      '<i class="fa-solid fa-lock" aria-hidden="true"></i><h2>Unlock this video for ' + ksh(v.price) + '</h2><p>Pay once with M-Pesa and watch any time, plus join the comments.</p><div id="unlock-area"></div></div></div>';
    unlockArea(v);
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
