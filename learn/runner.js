/* Marzley Learn code runner. Runs inside a sandboxed frame (no access to the site, cookies or
 * accounts). The page sends {type: "run", lang, code}; we reply with {type: "output", text, ok}. */
(function () {
  "use strict";
  var params = new URLSearchParams(location.search);
  if (params.get("theme") === "dark") document.body.classList.add("dark");
  var out = document.getElementById("out");
  var send = function (msg) { try { parent.postMessage(msg, "*"); } catch (e) {} };
  var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); };
  var print = function (text, cls) {
    var span = document.createElement("span");
    if (cls) span.className = cls;
    span.textContent = text;
    out.appendChild(span);
  };

  // ---------- HTML, CSS and JavaScript: the code becomes this page ----------
  var CONSOLE = "<script>(function(){var lines=[];function fmt(a){return Array.prototype.map.call(a,function(x){" +
    "if(typeof x==='string')return x;try{return JSON.stringify(x);}catch(e){return String(x);}}).join(' ');}" +
    "function show(t,c){if(lines.length>=1000){if(lines.length===1000){lines.push('');t='(Output stopped after 1,000 lines.)';c='#fcd34d';}else return;}lines.push(t);var box=document.getElementById('__console');if(!box){box=document.createElement('pre');box.id='__console';" +
    "box.style.cssText='margin:16px 0 0;padding:10px 12px;border-top:2px solid #ffb800;background:#0b1b35;color:#e2e8f0;font:14px/1.5 monospace;white-space:pre-wrap';" +
    "(document.body||document.documentElement).appendChild(box);}var s=document.createElement('div');if(c)s.style.color=c;s.textContent=t;box.appendChild(s);}" +
    "['log','info','warn','error'].forEach(function(k){console[k]=function(){show(fmt(arguments),k==='error'?'#fca5a5':k==='warn'?'#fcd34d':'');};});" +
    "window.addEventListener('error',function(e){var m=String(e.message||'');show(/Your loop ran/.test(m)?m.replace(/^Uncaught Error: /,''):'Error: '+m+(e.lineno?' (line '+e.lineno+')':''),'#fca5a5');});" +
    "window.__report=function(){parent.postMessage({type:'output',text:lines.join('\\n'),ok:true},'*');};" +
    "window.addEventListener('load',function(){setTimeout(window.__report,150);});})();<\/script>";

  // ---------- Loop guard for JavaScript ----------
  // Adds a time check inside every for / while / do loop, so a loop that never ends is stopped after
  // a few seconds with a clear message instead of freezing the learner's browser tab.
  var GUARD = "<script>(function(){var t=0;window.__lp=function(){var n=Date.now();if(!t){t=n;setTimeout(function(){t=0;},0);}" +
    "if(n-t>" + 3000 + "){t=n;throw new Error('Your loop ran for more than 3 seconds and was stopped. Check for a loop that never ends.');}};})();<\/script>";
  function guardLoops(src) {
    var ins = [], i = 0, n = src.length, stack = [], doBodies = {}, last = "";
    var isId = function (c) { return /[A-Za-z0-9_$]/.test(c); };
    var regexOk = function () { return last === "" || /[(,=:\[!&|?{};+\-*%<>~^]$/.test(last) || /^(return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await)$/.test(last); };
    // Skip a string, template, comment or regex starting at j; returns the index after it (or j if none)
    var skip = function (j) {
      var c = src[j], d = src[j + 1];
      if (c === "/" && d === "/") { while (j < n && src[j] !== "\n") j++; return j; }
      if (c === "/" && d === "*") { j = src.indexOf("*/", j + 2); return j < 0 ? n : j + 2; }
      if (c === "'" || c === '"') { j++; while (j < n && src[j] !== c && src[j] !== "\n") { if (src[j] === "\\") j++; j++; } return j + 1; }
      if (c === "`") {
        j++; var depth = 0;
        while (j < n) {
          if (src[j] === "\\") { j += 2; continue; }
          if (depth === 0 && src[j] === "`") return j + 1;
          if (src[j] === "$" && src[j + 1] === "{") { depth++; j += 2; continue; }
          if (depth > 0 && src[j] === "}") depth--;
          j++;
        }
        return n;
      }
      if (c === "/" && regexOk()) {
        j++; var cls = false;
        while (j < n && src[j] !== "\n") { if (src[j] === "\\") { j += 2; continue; } if (src[j] === "[") cls = true; else if (src[j] === "]") cls = false; else if (src[j] === "/" && !cls) break; j++; }
        j++; while (j < n && /[a-z]/i.test(src[j])) j++;
        return j;
      }
      return -1;
    };
    var ws = function (j) { for (;;) { while (j < n && /\s/.test(src[j])) j++; if (src[j] === "/" && (src[j + 1] === "/" || src[j + 1] === "*")) { j = skip(j); continue; } return j; } };
    // Index just after the bracket that closes the one at j
    var match = function (j) {
      var open = src[j], close = open === "(" ? ")" : open === "{" ? "}" : "]", depth = 0;
      while (j < n) {
        var k = skip(j);
        if (k >= 0 && k !== j) { j = k; continue; }
        if (src[j] === open) depth++;
        else if (src[j] === close) { depth--; if (depth === 0) return j + 1; }
        j++;
      }
      return n;
    };
    // End of a single statement starting at j (for loops written without braces)
    var stmtEnd = function (j) {
      j = ws(j);
      if (src[j] === "{") return match(j);
      var from = j;
      while (j < n) {
        var k = skip(j);
        if (k >= 0 && k !== j) { j = k; continue; }
        var c = src[j];
        if (c === "(" || c === "[" || c === "{") { j = match(j); continue; }
        if (c === ";") return j + 1;
        if (c === "}") return j;
        if (c === "\n" && /[^,+\-*\/%=&|?:.(\[{!<>\s]\s*$/.test(src.slice(from, j)) && !/^\s*[.?:+\-*\/%=&|,)\]]/.test(src.slice(j + 1, j + 40))) return j;
        j++;
      }
      return n;
    };
    while (i < n) {
      var k = skip(i);
      if (k >= 0 && k !== i) { last = "x"; i = k; continue; }
      var c = src[i];
      if (isId(c)) {
        var s0 = i; while (i < n && isId(src[i])) i++;
        var word = src.slice(s0, i), before = s0 > 0 ? src[s0 - 1] : "";
        var prevDot = /\.\s*$/.test(src.slice(Math.max(0, s0 - 5), s0)) && !/\.\.\.\s*$/.test(src.slice(Math.max(0, s0 - 5), s0));
        if (!prevDot && !isId(before)) {
          if (word === "do") {
            var b = ws(i);
            if (src[b] === "{") { ins.push([b + 1, "__lp();"]); doBodies[match(b)] = true; }
          } else if (word === "for" || word === "while") {
            var p = ws(i);
            if (word === "for" && src.slice(p, p + 5) === "await") p = ws(p + 5);
            var isDoTail = false;
            if (word === "while") { var q = s0 - 1; while (q >= 0 && /\s/.test(src[q])) q--; isDoTail = doBodies[q + 1] === true; }
            if (src[p] === "(" && !isDoTail) {
              var close = match(p), body = ws(close);
              if (src[body] === "{") ins.push([body + 1, "__lp();"]);
              else { var e = stmtEnd(close); ins.push([close, "{__lp();"]); ins.push([e, "}"]); }
            }
          }
        }
        last = word;
        continue;
      }
      if (!/\s/.test(c)) last = c;
      i++;
    }
    ins.sort(function (a, b) { return b[0] - a[0]; });
    var outSrc = src;
    ins.forEach(function (x) { outSrc = outSrc.slice(0, x[0]) + x[1] + outSrc.slice(x[0]); });
    return outSrc;
  }
  var safeGuard = function (code) { try { return guardLoops(code); } catch (e) { return code; } };
  var guardHtml = function (html) {
    return html.replace(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi, function (all, attrs, body) {
      attrs = attrs || "";
      if (/\ssrc\s*=/i.test(attrs) || (/\stype\s*=/i.test(attrs) && !/type\s*=\s*["']?(text\/javascript|module|application\/javascript)/i.test(attrs))) return all;
      return "<script" + attrs + ">" + safeGuard(body) + "<\/script>";
    });
  };

  function runWeb(lang, code) {
    var html;
    if (lang === "javascript") {
      html = "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" + GUARD + CONSOLE +
        "<style>body{font:15px/1.5 system-ui,sans-serif;margin:12px}</style></head><body><script>\n" + safeGuard(code).replace(/<\/script/gi, "<\\/script") + "\n<\/script></body></html>";
    } else {
      html = /<html[\s>]/i.test(code) || /<!doctype/i.test(code) ? code : "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head><body>" + code + "</body></html>";
      html = guardHtml(html);
      html = html.replace(/<head([^>]*)>/i, "<head$1>" + GUARD + CONSOLE);
      if (html.indexOf(CONSOLE) < 0) html = GUARD + CONSOLE + html;
    }
    document.open();
    document.write(html);
    document.close();
  }

  // ---------- Python (Pyodide, loaded once) ----------
  var pyReady = null;
  function loadPython() {
    if (pyReady) return pyReady;
    pyReady = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "/vendor/pyodide/pyodide.js";
      s.onload = function () { window.loadPyodide({ indexURL: "/vendor/pyodide/" }).then(resolve, reject); };
      s.onerror = function () { reject(new Error("Python could not load. Check your connection and try again.")); };
      document.head.appendChild(s);
    });
    return pyReady;
  }
  // Stops Python code that runs for more than 10 seconds (usually a loop that never ends), so the
  // learner's browser tab never freezes. It checks the clock every few hundred lines of their code.
  var PY_GUARD = [
    "import sys, time",
    "class CodeTookTooLong(Exception): pass",
    "def __mz_guard():",
    "    state = {'n': 0, 'end': time.monotonic() + 10}",
    "    def local(frame, event, arg):",
    "        state['n'] += 1",
    "        if state['n'] % 200 == 0 and time.monotonic() > state['end']:",
    "            state['end'] = time.monotonic() + 1",
    "            raise CodeTookTooLong('Your code ran for more than 10 seconds and was stopped. Check for a loop that never ends.')",
    "        return local",
    "    def glob(frame, event, arg):",
    "        return local if frame.f_code.co_filename == '<exec>' else None",
    "    def reset(): state['end'] = time.monotonic() + 10",
    "    return glob, reset",
    "__mz_tracer, __mz_guard_reset = __mz_guard()",
    "def __mz_guard_off(): sys.settrace(None)",
    "sys.settrace(__mz_tracer)"
  ].join("\n");
  function runPython(code) {
    out.textContent = "";
    print("Starting Python… (the first run takes a few seconds)\n", "muted");
    loadPython().then(function (py) {
      out.textContent = "";
      var text = [], lines = 0, MAX = 2000;
      var emit = function (t, cls) {
        lines++;
        if (lines > MAX) { if (lines === MAX + 1) print("(Output stopped after " + MAX.toLocaleString() + " lines.)\n", "muted"); return; }
        text.push(t); print(t + "\n", cls);
      };
      py.setStdout({ batched: function (t) { emit(t); } });
      py.setStderr({ batched: function (t) { emit(t, "err"); } });
      // Time spent typing an answer doesn't count towards the time limit
      py.setStdin({ stdin: function () { var v = prompt("Input for your program:"); try { py.globals.get("__mz_guard_reset")(); } catch (e) {} return v === null ? "" : v; } });
      try {
        py.runPython(PY_GUARD);
        py.runPython(code);
        py.runPython("__mz_guard_off()");
        if (!text.length) print("(no output)", "muted");
        send({ type: "output", text: text.join("\n"), ok: true });
      } catch (e) {
        try { py.runPython("__mz_guard_off()"); } catch (e2) {}
        var stopped = /CodeTookTooLong: (.*)/.exec(String(e.message || e));
        var msg = stopped ? stopped[1] : String(e.message || e).split("\n").filter(function (l) { return l && !/^\s*File "\/lib\//.test(l) && !/_pyodide/.test(l); }).join("\n");
        print(msg.trim() + "\n", "err");
        send({ type: "output", text: text.join("\n"), ok: false, error: msg });
      }
    }).catch(function (e) { out.textContent = ""; print(e.message, "err"); send({ type: "output", text: "", ok: false, error: e.message }); });
  }

  // ---------- SQL (sql.js) on a small sample shop database ----------
  var SAMPLE = [
    "CREATE TABLE Customers (CustomerID INTEGER PRIMARY KEY, Name TEXT, City TEXT, Phone TEXT);",
    "INSERT INTO Customers VALUES (1,'Wanjiku Mwangi','Nairobi','0712000001'),(2,'Otieno Odhiambo','Kisumu','0712000002'),(3,'Achieng Atieno','Kisumu','0712000003'),(4,'Kamau Njoroge','Nakuru','0712000004'),(5,'Amina Hassan','Mombasa','0712000005'),(6,'Kiprop Kiptoo','Eldoret','0712000006'),(7,'Njeri Wambui','Nairobi','0712000007');",
    "CREATE TABLE Products (ProductID INTEGER PRIMARY KEY, Name TEXT, Category TEXT, Price INTEGER);",
    "INSERT INTO Products VALUES (1,'Laptop bag','Accessories',2500),(2,'USB flash 32GB','Storage',900),(3,'Wireless mouse','Accessories',1200),(4,'Phone charger','Electronics',800),(5,'Bluetooth speaker','Electronics',3500),(6,'External hard disk 1TB','Storage',6500);",
    "CREATE TABLE Orders (OrderID INTEGER PRIMARY KEY, CustomerID INTEGER, ProductID INTEGER, Quantity INTEGER, OrderDate TEXT);",
    "INSERT INTO Orders VALUES (1,1,5,1,'2026-08-02'),(2,2,2,3,'2026-08-05'),(3,1,3,2,'2026-08-11'),(4,4,6,1,'2026-08-15'),(5,5,1,1,'2026-08-20'),(6,7,4,2,'2026-09-01'),(7,3,2,1,'2026-09-03');"
  ].join("\n");
  // Runs the SQL and collects the results, at most 1,000 rows per statement. Used inside a worker
  // (so a query that never ends can be stopped) and, if workers aren't available, on this page.
  function execSql(SQL, sample, code) {
    var db = new SQL.Database(), results = [], MAX = 1000;
    try {
      db.run(sample);
      var it = db.iterateStatements(code);
      for (var st = it.next(); !st.done; st = it.next()) {
        var stmt = st.value, cols = stmt.getColumnNames(), rows = [], more = false;
        while (stmt.step()) {
          if (rows.length >= MAX) { more = true; break; }
          rows.push(stmt.get());
        }
        if (!cols.length && stmt.getColumnNames) cols = stmt.getColumnNames();
        stmt.free();
        if (cols.length) results.push({ columns: cols, values: rows, more: more });
      }
      return { ok: true, results: results };
    } catch (e) {
      return { ok: false, results: results, error: String(e && e.message || e) };
    } finally { db.close(); }
  }
  var SQL_BASE = new URL("/vendor/sqljs/", location.href).href;
  var SQL_LIMIT = 8000;
  var sqlWorker = null, sqlLocal = null;
  function startSqlWorker() {
    var body = "var SQLP=null;" + execSql.toString() +
      "self.onmessage=function(e){var base=e.data.base;if(!SQLP){importScripts(base+'sql-wasm.js');SQLP=initSqlJs({locateFile:function(f){return base+f;}});}" +
      "SQLP.then(function(SQL){self.postMessage(execSql(SQL,e.data.sample,e.data.code));},function(err){self.postMessage({ok:false,results:[],error:'SQL could not load. Check your connection and try again.'});});};";
    return new Worker(URL.createObjectURL(new Blob([body], { type: "text/javascript" })));
  }
  function loadSqlHere() {
    if (sqlLocal) return sqlLocal;
    sqlLocal = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = SQL_BASE + "sql-wasm.js";
      s.onload = function () { window.initSqlJs({ locateFile: function (f) { return SQL_BASE + f; } }).then(resolve, reject); };
      s.onerror = function () { reject(new Error("SQL could not load. Check your connection and try again.")); };
      document.head.appendChild(s);
    });
    return sqlLocal;
  }
  function sqlResult(code) {
    if (sqlWorker !== false) {
      try { if (!sqlWorker) sqlWorker = startSqlWorker(); } catch (e) { sqlWorker = false; }
    }
    if (!sqlWorker) return loadSqlHere().then(function (SQL) { return execSql(SQL, SAMPLE, code); });
    var w = sqlWorker;
    return new Promise(function (resolve) {
      var timer = null;
      var started = function () {
        // The first run also downloads SQL, so the time limit starts once it has loaded (or after 20 s at most)
        timer = setTimeout(function () {
          w.terminate(); if (sqlWorker === w) sqlWorker = null;
          resolve({ ok: false, results: [], error: "Your query ran for more than " + SQL_LIMIT / 1000 + " seconds and was stopped. Check for a recursive query that never ends." });
        }, SQL_LIMIT + (w.__warm ? 0 : 20000));
      };
      w.onmessage = function (e) { clearTimeout(timer); w.__warm = true; resolve(e.data); };
      w.onerror = function (e) {
        clearTimeout(timer); e.preventDefault(); w.terminate(); sqlWorker = false;
        loadSqlHere().then(function (SQL) { resolve(execSql(SQL, SAMPLE, code)); }, function (err) { resolve({ ok: false, results: [], error: err.message }); });
      };
      w.postMessage({ base: SQL_BASE, sample: SAMPLE, code: code });
      started();
    });
  }
  function runSql(code) {
    out.textContent = "";
    print("Running…\n", "muted");
    sqlResult(code).then(function (r) {
      out.textContent = "";
      var text = [];
      if (r.ok && !r.results.length) print("Done. (The statement returned no rows.)\n", "muted");
      r.results.forEach(function (res) {
        var t = "<table><thead><tr>" + res.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          res.values.map(function (row) { return "<tr>" + row.map(function (v) { return "<td>" + esc(v === null ? "NULL" : v) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
        var wrap = document.createElement("div");
        wrap.innerHTML = t;
        out.appendChild(wrap);
        print("Number of records: " + res.values.length + (res.more ? " (showing the first 1,000)" : "") + "\n", "muted");
        text.push(res.columns.join(","));
        res.values.forEach(function (row) { text.push(row.join(",")); });
      });
      if (!r.ok) print("Error: " + r.error + "\n", "err");
      send(r.ok ? { type: "output", text: text.join("\n"), ok: true } : { type: "output", text: "", ok: false, error: r.error });
    }).catch(function (e) { out.textContent = ""; print(e.message, "err"); send({ type: "output", text: "", ok: false, error: e.message }); });
  }

  // ---------- Helpers for the extra languages ----------
  var ROOT = new URL("/", location.href).href;
  var ENGINES_V = (document.querySelector("script[data-engines]") || { getAttribute: function () { return "1"; } }).getAttribute("data-engines");
  var loaded = {};
  function loadScript(path) {
    if (!loaded[path]) loaded[path] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = ROOT + path;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Could not load the tools for this language. Check your connection and try again.")); };
      document.head.appendChild(s);
    });
    return loaded[path];
  }
  function showError(title, msg) {
    out.textContent = "";
    print(title + "\n", "err");
    print(msg + "\n", "err");
    send({ type: "output", text: "", ok: false, error: msg });
  }

  // ---------- TypeScript: types are checked by your editor in real projects; here we strip them and run the JavaScript ----------
  function runTypeScript(code) {
    loadScript("vendor/sucrase/sucrase.min.js").then(function () {
      var js;
      try { js = window.sucrase.transform(code, { transforms: ["typescript"] }).code; }
      catch (e) { return showError("TypeScript error", String(e.message || e)); }
      runWeb("javascript", js);
    }).catch(function (e) { showError("Error", e.message); });
  }

  // ---------- React (JSX): React 18 from this site, the JSX is compiled in the browser ----------
  function runReact(code) {
    loadScript("vendor/sucrase/sucrase.min.js").then(function () {
      var js;
      try { js = window.sucrase.transform(code, { transforms: ["jsx", "typescript"], production: true }).code; }
      catch (e) { return showError("JSX error", String(e.message || e)); }
      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" + GUARD + CONSOLE +
        "<style>body{font:15px/1.5 system-ui,sans-serif;margin:12px}</style>" +
        "<script src='" + ROOT + "vendor/react/react.production.min.js'><\/script><script src='" + ROOT + "vendor/react/react-dom.production.min.js'><\/script></head>" +
        "<body><div id='root'></div><script>\n" + safeGuard(js).replace(/<\/script/gi, "<\\/script") + "\n<\/script></body></html>";
      document.open(); document.write(html); document.close();
    }).catch(function (e) { showError("Error", e.message); });
  }

  // ---------- Markdown: shows the formatted page ----------
  function runMarkdown(code) {
    loadScript("vendor/marked/marked.min.js").then(function () {
      var body = window.marked.parse(code).replace(/<script[\s\S]*?<\/script>/gi, "").replace(/ on\w+=/gi, " data-x=");
      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" +
        "<style>body{font:16px/1.65 system-ui,sans-serif;margin:16px;max-width:70ch;color:#0f172a}h1,h2,h3{line-height:1.25;color:#0b1b35}code{background:#f1f5f9;padding:2px 5px;border-radius:5px}" +
        "pre{background:#0b1b35;color:#e2e8f0;padding:12px;border-radius:10px;overflow:auto}pre code{background:none;padding:0}blockquote{border-left:4px solid #ffb800;margin:0;padding:4px 14px;color:#475569}" +
        "table{border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:6px 10px}img{max-width:100%}a{color:#1d4ed8}</style></head><body>" + body +
        "<script>parent.postMessage({type:'output',text:document.body.innerText,ok:true},'*');<\/script></body></html>";
      document.open(); document.write(html); document.close();
    }).catch(function (e) { showError("Error", e.message); });
  }

  // ---------- JSON: checks it, shows where the mistake is, and formats it ----------
  function runJson(code) {
    out.textContent = "";
    try {
      var data = JSON.parse(code);
      var count = function (v) { return Array.isArray(v) ? v.length + " items" : v && typeof v === "object" ? Object.keys(v).length + " keys" : typeof v; };
      print("✔ Valid JSON (" + (Array.isArray(data) ? "array, " : data && typeof data === "object" ? "object, " : "") + count(data) + ")\n\n", "muted");
      var pretty = JSON.stringify(data, null, 2);
      print(pretty + "\n");
      send({ type: "output", text: pretty, ok: true });
    } catch (e) {
      var msg = String(e.message || e), m = /position (\d+)/.exec(msg), where = "";
      if (m) {
        var pos = Number(m[1]), before = code.slice(0, pos), line = before.split("\n").length, col = pos - before.lastIndexOf("\n");
        where = " (line " + line + ", column " + col + ")";
        var src = code.split("\n")[line - 1] || "";
        print("✘ Invalid JSON" + where + "\n", "err");
        print(src + "\n" + " ".repeat(Math.max(0, col - 1)) + "^\n\n", "err");
      } else print("✘ Invalid JSON\n", "err");
      print(msg + "\n\nCommon mistakes: a comma after the last item, single quotes instead of double quotes, or keys without quotes.\n", "muted");
      send({ type: "output", text: "", ok: false, error: msg });
    }
  }

  // ---------- PHP 8.3 (WebAssembly) in a worker, so long-running code can be stopped ----------
  var phpWorker = null, PHP_LIMIT = 10000;
  function startPhpWorker() {
    // The PHP build expects a browser page, so give it the few window/document pieces it touches
    var src = "self.window = self; self.document = { currentScript: null, body: null, documentElement: { style: {} }, addEventListener() {}, removeEventListener() {}, querySelector() { return null; }, getElementById() { return null; } };" +
      "self.__PHP_BASE = '" + ROOT + "vendor/php/php.js'; importScripts(self.__PHP_BASE);" +
      "let php = null, out = [];" +
      "self.onmessage = async (e) => {" +
      "  try {" +
      "    if (!php) { php = self.createPhp(); php.addEventListener('output', ev => out.push(['o', ev.detail.join('')])); php.addEventListener('error', ev => out.push(['e', ev.detail.join('')])); await php.binary; self.postMessage({ ready: true }); }" +
      "    else await php.refresh();" +
      "    out = []; const code = await php.run(e.data.code); self.postMessage({ done: true, out, code });" +
      "  } catch (err) { self.postMessage({ done: true, out, fail: String(err && err.message || err) }); }" +
      "};";
    return new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
  }
  function runPhp(code) {
    out.textContent = "";
    var w;
    try { w = phpWorker || (phpWorker = startPhpWorker()); } catch (e) { return showError("Error", "PHP can't run in this browser. Try a recent Chrome, Edge or Firefox."); }
    var warm = !!w.__warm, timer = null;
    if (!warm) print("Starting PHP… (the first run downloads it once, about 4 MB)\n", "muted");
    var arm = function () { clearTimeout(timer); timer = setTimeout(function () { w.terminate(); phpWorker = null; out.textContent = ""; print("Your code ran for more than 10 seconds and was stopped. Check for a loop that never ends.\n", "err"); send({ type: "output", text: "", ok: false, error: "Your code ran for more than 10 seconds and was stopped." }); }, PHP_LIMIT); };
    if (warm) arm(); else timer = setTimeout(arm, 60000);
    w.onmessage = function (e) {
      var d = e.data || {};
      if (d.ready) { w.__warm = true; arm(); return; }
      if (!d.done) return;
      clearTimeout(timer);
      out.textContent = "";
      var text = "", errs = "";
      (d.out || []).forEach(function (p) { if (p[0] === "o") text += p[1]; else errs += p[1]; });
      var html = /<\/?(html|body|p|h[1-6]|div|table|ul|ol|br|b|strong)[\s>\/]/i.test(text);
      if (html) {
        var box = document.createElement("div"); box.className = "php-html";
        var fr = document.createElement("iframe"); fr.setAttribute("sandbox", ""); fr.srcdoc = text; fr.style.cssText = "width:100%;min-height:260px;border:1px solid #cbd5e1;border-radius:8px;background:#fff";
        print("Rendered HTML:\n", "muted"); box.appendChild(fr); out.appendChild(box); print("\nSource:\n", "muted"); print(text + "\n");
      } else if (text) print(text + (/\n$/.test(text) ? "" : "\n"));
      var problem = errs || d.fail || "";
      if (/(Parse|Fatal) error|Warning:|Uncaught/.test(text) && !problem) problem = (text.match(/(Parse error|Fatal error|Warning):[^\n]*/) || [""])[0];
      if (errs) print(errs + "\n", "err");
      if (d.fail) print(d.fail + "\n", "err");
      if (!text && !errs && !d.fail) print("(no output)", "muted");
      send(problem ? { type: "output", text: text, ok: false, error: problem } : { type: "output", text: text, ok: true });
    };
    w.onerror = function (e) { clearTimeout(timer); e.preventDefault && e.preventDefault(); w.terminate(); phpWorker = null; showError("Error", "PHP could not start. Check your connection and try again."); };
    w.postMessage({ code: code });
  }

  // ---------- C, C++, Lua, Ruby, Sass and Prolog: engines in a worker (learn/engines.js), stopped after 10 seconds ----------
  var engWorker = null, ENG_LIMIT = 10000, ENG_NAMES = { c: "C", cpp: "C++", lua: "Lua", ruby: "Ruby", sass: "Sass", prolog: "Prolog", regex: "Regex" };
  function startEngines() {
    var src = "self.__LEARN_ROOT = '" + ROOT + "'; importScripts('" + ROOT + "learn/engines.js?v=" + ENGINES_V + "');";
    return new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
  }
  function runEngine(lang, code, stdin) {
    out.textContent = "";
    var w, timer = null, first = !engWorker;
    try { w = engWorker || (engWorker = startEngines()); } catch (e) { return showError("Error", "This language can't run in this browser. Try a recent Chrome, Edge or Firefox."); }
    print(first || !w["__" + lang] ? "Starting " + ENG_NAMES[lang] + "…" + (lang === "ruby" ? " (the first run downloads it once, about 5 MB)" : "") + "\n" : "Running…\n", "muted");
    var stop = function () {
      w.terminate(); engWorker = null; out.textContent = "";
      print("Your code ran for more than 10 seconds and was stopped. Check for a loop that never ends.\n", "err");
      send({ type: "output", text: "", ok: false, error: "Your code ran for more than 10 seconds and was stopped." });
    };
    // First use downloads the engine, so allow longer before the 10-second limit starts
    timer = setTimeout(stop, ENG_LIMIT + (w["__" + lang] ? 0 : 50000));
    var go = function () { w.postMessage({ lang: lang, code: code, stdin: stdin || "" }); };
    w.onmessage = function (e) {
      var d = e.data || {};
      if (d.ready) { go(); return; }
      if (!d.done) return;
      clearTimeout(timer);
      w["__" + lang] = true;
      out.textContent = "";
      // The quick in-browser C/C++ interpreters don't cover everything: fall back to the full online compiler
      if ((lang === "c" || lang === "cpp") && d.err && !d.out && /cannot find library|not supported|unsupported|can't assign|not implemented|unknown type|undefined identifier|is not defined/i.test(d.err)) {
        return runRemote(lang, code, "This code needs the full compiler, so it's running on Compiler Explorer (godbolt.org)…");
      }
      if (lang === "sass" && d.out) {
        print("Compiled CSS:\n", "muted"); print(d.out);
      } else if (d.out) print(d.out);
      if (d.err) print(d.err, "err");
      if (!d.out && !d.err) print("(no output)", "muted");
      send(d.err && !d.out ? { type: "output", text: "", ok: false, error: d.err.trim().split("\n")[0] } : { type: "output", text: d.out || "", ok: !d.err, error: d.err ? d.err.trim().split("\n")[0] : "" });
    };
    w.onerror = function (e) { clearTimeout(timer); if (e.preventDefault) e.preventDefault(); w.terminate(); engWorker = null; showError("Error", "The " + ENG_NAMES[lang] + " engine could not start. Check your connection and try again."); };
    if (!first) go();
  }

  // ---------- C#, Java, Go, Rust and Kotlin: compiled and run by Compiler Explorer (godbolt.org), a free online service ----------
  var CE = "https://godbolt.org/api/", CE_LANG = { csharp: "csharp", java: "java", go: "go", rust: "rust", kotlin: "kotlin", c: "c", cpp: "c++" },
    CE_NAMES = { csharp: "C#", java: "Java", go: "Go", rust: "Rust", kotlin: "Kotlin", c: "C", cpp: "C++" },
    CE_OPEN = { csharp: "https://dotnetfiddle.net/", java: "https://www.onlinegdb.com/online_java_compiler", go: "https://go.dev/play/", rust: "https://play.rust-lang.org/", kotlin: "https://play.kotlinlang.org/", c: "https://www.onlinegdb.com/online_c_compiler", cpp: "https://www.onlinegdb.com/online_c++_compiler" },
    ceCompiler = {};
  function ceJson(url, body) {
    return fetch(url, body ? { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body) } : { headers: { "Accept": "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("The online compiler replied with an error (" + r.status + ")."); return r.json(); });
  }
  // All compilers for a language that can run code, newest stable first
  function compilerList(lang) {
    if (ceCompiler[lang]) return Promise.resolve(ceCompiler[lang]);
    return ceJson(CE + "compilers/" + CE_LANG[lang] + "?fields=id,name,semver,supportsExecute").then(function (list) {
      var ok = (list || []).filter(function (c) { return c.supportsExecute !== false && !/nightly|trunk|beta|snapshot|alpha|\brc\b|dev|experimental|native/i.test(c.name + " " + c.id); });
      var num = function (v) { return String(v || "").split(/[^0-9]+/).filter(Boolean).slice(0, 3).map(function (x) { return ("000" + x).slice(-4); }).join("."); };
      ok.sort(function (a, b) { return num(b.semver) < num(a.semver) ? -1 : num(b.semver) > num(a.semver) ? 1 : 0; });
      if (!ok.length) throw new Error("No compiler is available for this language right now.");
      return (ceCompiler[lang] = { ids: ok.map(function (c) { return c.id; }), good: 0 });
    });
  }
  function ceText(x) { return (x || []).map(function (l) { return l.text; }).join("\n"); }
  // A crash inside the compiler's own runtime (not the learner's code): try another compiler version
  function infraFailure(lang, ex, stdout, stderr) {
    if (stdout) return false;
    if (ex.didExecute === false && !(ex.buildResult && ex.buildResult.code)) return true;
    if (/Exception in thread|Error occurred during initialization of VM|Could not find or load main class|Internal compiler error/i.test(stderr)) {
      var frames = stderr.split("\n").filter(function (l) { return /^\s*at /.test(l); });
      // No stack frame points at the learner's file: the failure is in the runtime itself
      return frames.length > 0 && !frames.some(function (l) { return /example|Main|Kt\.|Program|\.kt:|\.java:(?!.*java\.base)/.test(l) && !/java\.base|jdk\.internal|kotlin\.|sun\./.test(l); });
    }
    return false;
  }
  function runRemote(lang, code, note) {
    out.textContent = "";
    print((note || "Compiling and running on Compiler Explorer (godbolt.org)…") + "\n", "muted");
    var done = false, timer = setTimeout(function () { if (!done) { done = true; fail("The online compiler took too long to answer."); } }, 60000);
    var fail = function (why) {
      out.textContent = "";
      print(why + "\n\n", "err");
      print("You can still run your code: copy it (the copy button above) and paste it into " + CE_OPEN[lang] + "\n", "muted");
      send({ type: "output", text: "", ok: false, error: why });
    };
    var attempt = function (c, n) {
      var id = c.ids[(c.good + n) % c.ids.length];
      return ceJson(CE + "compiler/" + encodeURIComponent(id) + "/compile", {
        source: code, lang: CE_LANG[lang], allowStoreCodeDebug: false,
        options: { userArguments: "", executeParameters: { args: [], stdin: "" }, compilerOptions: { executorRequest: true, skipAsm: true }, filters: { execute: true }, tools: [], libraries: [] }
      }).then(function (r) {
        var ex = r.execResult || r, stdout = ceText(ex.stdout), stderr = ceText(ex.stderr);
        if (infraFailure(lang, ex, stdout, stderr) && n + 1 < Math.min(4, c.ids.length)) {
          if (!done) { out.textContent = ""; print("That compiler version had a problem, trying another one…\n", "muted"); }
          return attempt(c, n + 1);
        }
        c.good = (c.good + n) % c.ids.length;
        return r;
      });
    };
    compilerList(lang).then(function (c) { return attempt(c, 0); }).then(function (r) {
      if (done) return; done = true; clearTimeout(timer);
      var ex = r.execResult || r, build = ex.buildResult || r.buildResult || {};
      out.textContent = "";
      var stdout = ceText(ex.stdout), stderr = ceText(ex.stderr);
      var buildErr = build.code ? (ceText(build.stderr) || ceText(build.stdout)) : "";
      if (buildErr) { print("Your code didn't compile:\n", "err"); print(buildErr + "\n", "err"); return send({ type: "output", text: "", ok: false, error: buildErr.split("\n")[0] }); }
      if (stdout) print(stdout + "\n");
      if (stderr) print(stderr + "\n", "err");
      if (ex.timedOut) print("Your program took too long and was stopped.\n", "err");
      if (!stdout && !stderr) print("(no output)", "muted");
      send({ type: "output", text: stdout, ok: !stderr && !ex.timedOut && !(ex.code > 0), error: stderr ? stderr.split("\n")[0] : "" });
    }).catch(function (e) {
      if (done) return; done = true; clearTimeout(timer);
      fail(/Failed to fetch|NetworkError|Load failed/i.test(String(e && e.message)) ? "Couldn't reach the online compiler. Check your internet connection." : String(e && e.message || e));
    });
  }

  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type !== "run" || typeof d.code !== "string") return;
    if (ENG_NAMES[d.lang]) return runEngine(d.lang, d.code, d.stdin);
    if (CE_LANG[d.lang]) return runRemote(d.lang, d.code);
    if (d.lang === "python") runPython(d.code);
    else if (d.lang === "sql") runSql(d.code);
    else if (d.lang === "php") runPhp(d.code);
    else if (d.lang === "typescript") runTypeScript(d.code);
    else if (d.lang === "react") runReact(d.code);
    else if (d.lang === "markdown") runMarkdown(d.code);
    else if (d.lang === "json") runJson(d.code);
    else runWeb(d.lang, d.code);
  });
  send({ type: "ready" });
})();
