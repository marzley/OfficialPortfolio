/* Marzley Learn: the console frame. One hidden, sandboxed frame (learn/runner.html?mode=console) runs
 * the console languages for every code box on the page:
 *   Python, SQL and PHP in the browser (each in its own Web Worker),
 *   C, C++, Lua, Ruby, Sass, Prolog and Regex with the in-browser engines (learn/engines.js, one Worker),
 *   C, C++, C#, Java, Go, Rust and Kotlin on online compilers (Compiler Explorer, then Wandbox).
 * Workers stay loaded between runs, so only the first run of a language waits for it to start. A program
 * that runs too long is stopped by ending its worker. The hub (learn.js) shows the output.
 * From the hub: {type: "run", id, lang, code, stdin, inputs, seed, cache}, {type: "stop", id},
 *   {type: "warm", lang, cache}.
 * To the hub: {type: "out", id, parts: [[text, kind]]} (kind: "" output, "err", "muted", "in" what the
 *   learner typed, "note"), {type: "status", id, text}, {type: "table", id, columns, values, more},
 *   {type: "html", id, html}, {type: "done", id, ok, text, error, detail, warnings, exit, input}. */
(function () {
  "use strict";
  var R = window.__runner, ROOT = R.ROOT, send = R.send;
  var LIMIT = 10000;                       // how long a program may run (ms)
  // Compilers (and some programs) print terminal colour and cursor codes such as ESC[01;31m. A page can't
  // show them, so they would appear as strange boxes and letters: remove them.
  var ANSI = /\x1b\[[0-?]*[ -\/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]/g;
  var stripAnsi = function (t) { return String(t == null ? "" : t).replace(ANSI, "").replace(/\x1b/g, ""); };
  var MAX_LINES = 5000, MAX_CHARS = 300000;
  var NAMES = { python: "Python", sql: "SQL", php: "PHP", json: "JSON", c: "C", cpp: "C++", lua: "Lua", ruby: "Ruby", sass: "Sass", prolog: "Prolog", regex: "Regex", csharp: "C#", java: "Java", go: "Go", rust: "Rust", kotlin: "Kotlin" };

  // ---------- one run: output goes to the hub in small batches ----------
  var current = null;
  function Run(d) {
    this.id = d.id; this.lang = d.lang; this.out = ""; this.lines = 0; this.chars = 0; this.cut = false;
    this.parts = []; this.timer = null; this.limit = null; this.ended = false; this.kill = null; this.esc = "";
  }
  Run.prototype.write = function (text, kind) {
    if (this.ended || !text) return;
    kind = kind || "";
    if (text.indexOf("\x1b") >= 0 || this.esc) {
      text = (this.esc || "") + text;
      var half = /\x1b(?:\[[0-?]*[ -\/]*|\][^\x07\x1b]*)?$/.exec(text);
      this.esc = half ? half[0] : "";
      text = stripAnsi(half ? text.slice(0, half.index) : text);
      if (!text) return;
    }
    if (kind !== "note") {
      if (this.cut) return;
      var n = (text.match(/\n/g) || []).length, cut = "";
      if (this.lines + n > MAX_LINES || this.chars + text.length > MAX_CHARS) {
        // Keep the lines that still fit, then say the rest was left out
        var keep = text.length;
        if (this.lines + n > MAX_LINES) {
          var room = MAX_LINES - this.lines, at = -1;
          for (var k = 0; k < room && (at = text.indexOf("\n", at + 1)) >= 0; k++) keep = at + 1;
          if (room <= 0) keep = 0;
        }
        text = text.slice(0, Math.max(0, Math.min(keep, MAX_CHARS - this.chars)));
        n = (text.match(/\n/g) || []).length;
        this.cut = true;
        cut = "\n(Output stopped after " + (this.lines + n >= MAX_LINES ? MAX_LINES.toLocaleString() + " lines" : "this much text") + ". Your program kept running.)\n";
      }
      this.lines += n; this.chars += text.length;
      if (!kind) this.out += text;
    }
    var last = this.parts[this.parts.length - 1];
    if (text) { if (last && last[1] === kind) last[0] += text; else this.parts.push([text, kind]); }
    if (cut) { this.parts.push([cut, "muted"]); return this.flush(); }
    if (!this.timer) this.timer = setTimeout(this.flush.bind(this), 40);
  };
  Run.prototype.flush = function () {
    clearTimeout(this.timer); this.timer = null;
    if (this.parts.length && !this.ended) send({ type: "out", id: this.id, parts: this.parts });
    this.parts = [];
  };
  Run.prototype.status = function (text) { if (!this.ended) { this.flush(); send({ type: "status", id: this.id, text: text }); } };
  /** Starts the time limit (once the language has loaded, so a first download doesn't count). */
  Run.prototype.arm = function (ms) {
    var self = this;
    clearTimeout(this.limit);
    this.limit = setTimeout(function () {
      if (self.kill) self.kill();
      self.write("\nYour code ran for more than " + (ms || LIMIT) / 1000 + " seconds and was stopped. Check for a loop that never ends.\n", "err");
      self.finish({ ok: false, error: "Your code ran for more than " + (ms || LIMIT) / 1000 + " seconds and was stopped.", timeout: true });
    }, ms || LIMIT);
  };
  Run.prototype.finish = function (r) {
    if (this.ended) return;
    this.flush();
    clearTimeout(this.limit);
    this.ended = true;
    r.type = "done"; r.id = this.id;
    if (r.text == null) r.text = this.out;
    ["text", "error", "detail", "warnings"].forEach(function (k) { if (r[k]) r[k] = stripAnsi(r[k]); });
    send(r);
    if (current === this) current = null;
  };
  var fail = function (run, msg) { run.write(msg + "\n", "err"); run.finish({ ok: false, error: msg, setup: true }); };

  // ---------- files: asked from the hub once, then kept here ----------
  var kept = {};
  /** Resolves with { path: Blob } (null when the hub can't send files: workers then load from the server). */
  function files(paths, run) {
    var missing = paths.filter(function (p) { return !kept[p] && !kept["dir:" + p]; });
    var done = function () {
      var map = {};
      Object.keys(kept).forEach(function (k) { if (k.indexOf("dir:") === 0) return; paths.forEach(function (p) { if (k === p || (p.slice(-1) === "/" && k.indexOf(p) === 0)) map[k] = kept[k]; }); });
      return map;
    };
    if (!missing.length) return Promise.resolve(R.VFS ? done() : null);
    return R.getFiles(missing, run ? run.id : 0).then(function (r) {
      if (!r) return null;
      if (r.error) throw new Error(r.error);
      Object.keys(r.files).forEach(function (k) { kept[k] = r.files[k]; });
      missing.forEach(function (p) { if (p.slice(-1) === "/") kept["dir:" + p] = true; });
      return done();
    });
  }

  // Inside each worker: serve the hub's files to fetch() and importScripts(), as if from the server
  var SHIM = "(" + function (ROOT) {
    var files = {}, urls = {}, origin = new URL(ROOT).origin;
    var key = function (u) {
      try { var x = new URL(u instanceof URL ? u.href : String(u), ROOT); return x.origin === origin ? decodeURIComponent(x.pathname.slice(1)) : null; } catch (e) { return null; }
    };
    var TYPES = { wasm: "application/wasm", js: "text/javascript", json: "application/json", zip: "application/zip" };
    self.__addFiles = function (map) { for (var k in map) files[k] = map[k]; };
    var realFetch = self.fetch, realImport = self.importScripts;
    self.fetch = function (input) {
      var k = key(typeof input === "string" || input instanceof URL ? input : input && input.url);
      if (k && files[k]) return Promise.resolve(new Response(files[k], { status: 200, headers: { "Content-Type": TYPES[k.split(".").pop()] || "application/octet-stream" } }));
      return realFetch.apply(self, arguments);
    };
    self.importScripts = function () {
      var list = [];
      for (var i = 0; i < arguments.length; i++) {
        var k = key(arguments[i]);
        list.push(k && files[k] ? (urls[k] || (urls[k] = URL.createObjectURL(files[k]))) : arguments[i]);
      }
      return realImport.apply(self, list);
    };
  }.toString() + ")(" + JSON.stringify(ROOT) + ");\n";

  // A worker that keeps one language loaded between runs
  function Slot(name, paths, main, extra) { this.name = name; this.paths = paths; this.main = main; this.extra = extra || ""; this.w = null; this.ready = null; this.on = null; this.sent = {}; }
  Slot.prototype.get = function (run) {
    var self = this;
    if (this.ready) return this.ready;
    var p = this.ready = files(this.paths, run).then(function (blobs) {
      return new Promise(function (resolve, reject) {
        var src = SHIM + "var ROOT = " + JSON.stringify(ROOT) + ", V = " + JSON.stringify(R.version("engines")) + ";\n" + self.extra + "\n(" + self.main + ")();";
        var w = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
        self.w = w; self.sent = {};
        w.onmessage = function (e) {
          var d = e.data || {};
          if (d.t === "ready") return resolve(w);
          if (d.t === "fail") return reject(new Error(d.error || self.name + " could not start."));
          if (self.w !== w) return;            // a late message from a worker that has been ended
          if (self.on) self.on(d);
        };
        w.onerror = function (e) {
          if (e && e.preventDefault) e.preventDefault();
          reject(new Error(self.name + " could not start. Check your connection and try again."));
          // A worker that was ended on purpose (a program stuck in a loop) can still report an error a moment later:
          // that must not stop the next run, which uses a different worker
          if (self.w !== w) return;
          if (self.on) self.on({ t: "crash", error: String(e && e.message || "") });
        };
        if (blobs) w.postMessage({ files: blobs });
        w.postMessage({ t: "load" });
      });
    });
    p.catch(function () { if (self.ready === p) self.kill(); });
    return p;
  };
  Slot.prototype.kill = function () { if (this.w) this.w.terminate(); this.w = null; this.ready = null; this.on = null; this.sent = {}; };
  /** Starts the language if needed; shows "Starting…" the first time. */
  function start(slot, run) {
    if (!slot.w) run.status("Starting " + slot.name + "…");
    return slot.get(run);
  }

  // ---------- Python (Pyodide) ----------
  function pythonMain() {
    var py = null, inputs = [], pos = 0, asked = false, mute = false, buf = "", kind = "", last = 0, sent = 0, dec = {};
    var post = function (m) { self.postMessage(m); };
    function flush() { if (buf) post({ t: "out", s: buf, k: kind }); buf = ""; last = Date.now(); }
    function emit(s, k) {
      if (mute || !s) return;
      if (k !== kind) flush();
      kind = k;
      if ((sent += s.length) > 1000000) return;          // the console frame shows "Output stopped" long before this
      buf += s;
      if (buf.length > 8192 || Date.now() - last > 50) flush();
    }
    var writer = function (k) { return function (bytes) { emit((dec[k] || (dec[k] = new TextDecoder())).decode(bytes, { stream: true }), k); return bytes.length; }; };
    // Pyodide logs a stack trace when reading input stops a program on purpose: keep that quiet
    var cerr = console.error;
    console.error = function (a) { if (/Error thrown in read|waiting for input/.test(String(a))) return; cerr.apply(console, arguments); };
    // The traceback without Pyodide's own lines, with the learner's line of code under each of their lines
    function clean(msg, code) {
      var src = String(code).split("\n"), lines = String(msg).split("\n"), out = [], frames = 0;
      for (var i = 0; i < lines.length; i++) {
        var l = lines[i], m = /^  File "(.*?)", line (\d+)/.exec(l);
        if (m) {
          var body = [];
          while (i + 1 < lines.length && /^    /.test(lines[i + 1])) body.push(lines[++i]);
          if (m[1] !== "<exec>") continue;
          frames++;
          out.push(l);
          if (body.length) out = out.concat(body);
          else if (src[m[2] - 1] && src[m[2] - 1].trim()) out.push("    " + src[m[2] - 1].trim());
          continue;
        }
        if (/^Traceback \(most recent call last\)/.test(l) || !l.trim()) continue;
        out.push(l);
      }
      var syntax = /^(SyntaxError|IndentationError|TabError)\b/.test(out[out.length - 1] || "");
      return ((frames && !syntax ? "Traceback (most recent call last):\n" : "") + out.join("\n")).trim();
    }
    function load() {
      try { importScripts(ROOT + "vendor/pyodide/pyodide.js"); } catch (e) { return post({ t: "fail", error: "Python could not load. Check your connection and try again." }); }
      self.loadPyodide({ indexURL: ROOT + "vendor/pyodide/" }).then(function (p) {
        py = p;
        py.setStdout({ write: writer("") });
        py.setStderr({ write: writer("err") });
        py.setStdin({ stdin: function () {
          if (pos < inputs.length) {
            var v = inputs[pos];
            if (v === null) return null;                   // the learner ended the input
            pos++;
            flush(); emit(v + "\n", "in"); flush();
            return v + "\n";
          }
          // No more answers: the hub asks the learner, then runs the program again from the start with them
          if (!asked) { asked = true; flush(); post({ t: "input" }); }
          mute = true;
          throw new Error("waiting for input");
        } });
        py.runPython("import random");
        post({ t: "ready" });
      }, function (e) { post({ t: "fail", error: "Python could not start: " + String(e && e.message || e) }); });
    }
    function run(d) {
      inputs = d.inputs || []; pos = 0; asked = false; mute = false; buf = ""; kind = ""; sent = 0; dec = {}; last = Date.now();
      var ok = true, detail = "", g = null, exit = "";
      try {
        py.runPython("random.seed(" + (Number(d.seed) || 0) + ")");
        g = py.globals.get("dict")();
        g.set("__name__", "__main__");
        var r = py.runPython(d.code, { globals: g });
        if (r && typeof r.destroy === "function") r.destroy();
      } catch (e) {
        var type = e && e.type;
        if (type === "SystemExit") {
          exit = String(e.message || "").trim().split("\n").pop().replace(/^SystemExit:?\s*/, "");
          if (exit && exit !== "0" && exit !== "None" && !/^\d+$/.test(exit)) { mute = false; emit(exit + "\n", "err"); }
        } else {
          ok = false;
          if (!asked) detail = clean(e && e.message || e, d.code);
        }
      }
      mute = false;
      flush();
      if (g) try { g.destroy(); } catch (x) {}
      post({ t: "done", ok: ok, asked: asked, detail: detail, exit: exit });
    }
    self.onmessage = function (e) {
      var d = e.data || {};
      if (d.files) return self.__addFiles(d.files);
      if (d.t === "load") return load();
      if (d.t === "run") run(d);
    };
  }
  var python = new Slot("Python", ["vendor/pyodide/"], pythonMain);
  var pyDrain = null;
  function runPython(run, d) {
    start(python, run).then(function (w) {
      if (run.ended) return;
      var go = function () {
        if (run.ended) return;
        run.status("");
        python.on = function (m) {
          if (m.t === "out") return run.write(m.s, m.k);
          if (m.t === "input") {
            // The program needs an answer. It is stopped at this point (the hub runs it again with the answer).
            // If it doesn't finish quickly (a bare "except:" that keeps asking), end the worker.
            python.on = function (m2) { if (m2.t === "done") { clearTimeout(pyDrain); pyDrain = null; python.on = null; } };
            pyDrain = setTimeout(function () { pyDrain = null; python.kill(); }, 700);
            return run.finish({ ok: true, input: true });
          }
          if (m.t === "crash") { python.kill(); return fail(run, "Python stopped unexpectedly. Tap Run to try again."); }
          if (m.t === "done") {
            python.on = null;
            if (m.exit && /^\d+$/.test(m.exit) && m.exit !== "0") run.write("\n(Program ended with exit code " + m.exit + ")\n", "muted");
            if (m.ok && !run.out && !run.lines) run.write("(no output)", "muted");
            if (!m.ok && m.detail) run.write((run.out && !/\n$/.test(run.out) ? "\n" : "") + m.detail + "\n", "err");
            var last = (m.detail || "").trim().split("\n").pop();
            run.finish(m.ok ? { ok: true } : { ok: false, error: last || "Error", detail: m.detail });
          }
        };
        run.kill = function () { python.kill(); };
        run.arm();
        w.postMessage({ t: "run", code: d.code, inputs: d.inputs || [], seed: d.seed || 0 });
      };
      // Still finishing the last program that asked for input
      if (pyDrain) { var t = setInterval(function () { if (!pyDrain) { clearInterval(t); if (python.w) go(); else runPython(run, d); } }, 25); }
      else go();
    }, function (e) { fail(run, e.message); });
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
  // Runs the SQL and collects the results, at most 1,000 rows per statement (inside the worker)
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
  function sqlMain() {
    var SQL = null;
    self.onmessage = function (e) {
      var d = e.data || {};
      if (d.files) return self.__addFiles(d.files);
      if (d.t === "load") {
        try { importScripts(ROOT + "vendor/sqljs/sql-wasm.js"); } catch (x) { return self.postMessage({ t: "fail", error: "SQL could not load. Check your connection and try again." }); }
        self.initSqlJs({ locateFile: function (f) { return ROOT + "vendor/sqljs/" + f; } }).then(function (s) { SQL = s; self.postMessage({ t: "ready" }); },
          function (x) { self.postMessage({ t: "fail", error: "SQL could not start: " + String(x && x.message || x) }); });
        return;
      }
      if (d.t === "run") { var r = execSql(SQL, d.sample, d.code); r.t = "done"; self.postMessage(r); }
    };
  }
  var sql = new Slot("SQL", ["vendor/sqljs/"], sqlMain, execSql.toString());
  function runSql(run, d) {
    start(sql, run).then(function (w) {
      if (run.ended) return;
      run.status("");
      sql.on = function (r) {
        if (r.t === "crash") { sql.kill(); return fail(run, "SQL stopped unexpectedly. Tap Run to try again."); }
        if (r.t !== "done") return;
        sql.on = null;
        var text = [];
        r.results.forEach(function (res) {
          send({ type: "table", id: run.id, columns: res.columns, values: res.values, more: res.more });
          text.push(res.columns.join(","));
          res.values.forEach(function (row) { text.push(row.join(",")); });
        });
        if (r.ok && !r.results.length) run.write("Done. (The statement returned no rows.)\n", "muted");
        if (!r.ok) run.write("Error: " + r.error + "\n", "err");
        run.finish(r.ok ? { ok: true, text: text.join("\n") } : { ok: false, text: text.join("\n"), error: r.error, detail: r.error });
      };
      run.kill = function () { sql.kill(); };
      run.arm(8000);
      w.postMessage({ t: "run", sample: SAMPLE, code: d.code });
    }, function (e) { fail(run, e.message); });
  }

  // ---------- PHP 8.3 (WebAssembly) ----------
  function phpMain() {
    // The PHP build expects a browser page: give it the few window/document pieces it touches
    self.window = self;
    self.document = { currentScript: null, body: null, documentElement: { style: {} }, addEventListener: function () {}, removeEventListener: function () {}, querySelector: function () { return null; }, getElementById: function () { return null; } };
    var php = null, out = [], fresh = true;
    self.onmessage = function (e) {
      var d = e.data || {};
      if (d.files) return self.__addFiles(d.files);
      if (d.t === "load") {
        self.__PHP_BASE = ROOT + "vendor/php/php.js";
        try { importScripts(self.__PHP_BASE); } catch (x) { return self.postMessage({ t: "fail", error: "PHP could not load. Check your connection and try again." }); }
        php = self.createPhp();
        php.addEventListener("output", function (ev) { out.push(["o", ev.detail.join("")]); });
        php.addEventListener("error", function (ev) { out.push(["e", ev.detail.join("")]); });
        php.binary.then(function () { self.postMessage({ t: "ready" }); }, function (x) { self.postMessage({ t: "fail", error: "PHP could not start: " + String(x && x.message || x) }); });
        return;
      }
      if (d.t === "run") {
        out = [];
        (fresh ? Promise.resolve() : php.refresh()).then(function () { fresh = false; return php.run(d.code); })
          .then(function (code) { self.postMessage({ t: "done", out: out, code: code }); }, function (x) { self.postMessage({ t: "done", out: out, fail: String(x && x.message || x) }); });
      }
    };
  }
  var php = new Slot("PHP", ["vendor/php/"], phpMain);
  function runPhp(run, d) {
    start(php, run).then(function (w) {
      if (run.ended) return;
      run.status("");
      php.on = function (r) {
        if (r.t === "crash") { php.kill(); return fail(run, "PHP stopped unexpectedly. Tap Run to try again."); }
        if (r.t !== "done") return;
        php.on = null;
        var text = "", errs = "";
        (r.out || []).forEach(function (p) { if (p[0] === "o") text += p[1]; else errs += p[1]; });
        if (/<\/?(html|body|p|h[1-6]|div|table|ul|ol|br|b|strong|form|img|a)[\s>\/]/i.test(text)) send({ type: "html", id: run.id, html: text });
        else if (text) run.write(text + (/\n$/.test(text) ? "" : "\n"));
        var problem = errs || r.fail || "";
        if (/(Parse|Fatal) error|Warning:|Uncaught/.test(text) && !problem) problem = (text.match(/(Parse error|Fatal error|Warning):[^\n]*/) || [""])[0];
        if (errs) run.write(errs + "\n", "err");
        if (r.fail) run.write(r.fail + "\n", "err");
        if (!text && !errs && !r.fail) run.write("(no output)", "muted");
        run.out = text;
        run.finish(problem ? { ok: false, error: problem.trim().split("\n")[0], detail: (errs + "\n" + (r.fail || "") + "\n" + ((text.match(/(Parse error|Fatal error|Warning|Deprecated|Notice):[^\n]*/g) || []).join("\n"))).trim() } : { ok: true });
      };
      run.kill = function () { php.kill(); };
      run.arm();
      w.postMessage({ t: "run", code: d.code });
    }, function (e) { fail(run, e.message); });
  }

  // ---------- C, C++, Lua, Ruby, Sass, Prolog and Regex: engines in one worker (learn/engines.js) ----------
  function enginesMain() {
    self.__LEARN_ROOT = ROOT;
    self.onmessage = function (e) {
      var d = e.data || {};
      if (d.files) return self.__addFiles(d.files);
      if (d.t === "load") {
        // engines.js takes over the messages and says "ready"
        try { importScripts(ROOT + "learn/engines.js?v=" + V); } catch (x) { self.postMessage({ t: "fail", error: "The in-browser engines could not load. Check your connection and try again." }); }
      }
    };
  }
  var engines = new Slot("the in-browser engines", ["learn/engines.js"], enginesMain);
  var ENGINE_FILES = { c: ["vendor/langs/picoc.js"], cpp: ["vendor/langs/jscpp.js"], lua: ["vendor/langs/fengari.js"], prolog: ["vendor/langs/tau-prolog.js"], sass: ["vendor/langs/sass.js"], ruby: ["vendor/langs/ruby-wasi.js", "vendor/langs/ruby.wasm"], regex: [] };
  var remoteCache = {};
  function needsFullCompiler(lang, code, stdin) {
    var src = code.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
    if (lang === "c") return /\b(scanf|fgets|getchar|gets|getline|sscanf|qsort|bsearch|const|union|static|volatile|inline|_Bool|size_t|uint\d+_t|int\d+_t|bool|true|false)\b/.test(src) ||
      /#include\s*<(?!stdio\.h>|stdlib\.h>|string\.h>|math\.h>)/.test(src) || /%z[ud]/.test(src) || /#define\s+\w+\(/.test(src);
    if (lang === "cpp") return (/\bcin\b|getline/.test(src) && !stdin) ||
      /#include\s*<(?!iostream>|cmath>|cstdio>|cstdlib>|cstring>|iomanip>)/.test(src) ||
      /\b(class|template|auto|nullptr|constexpr|virtual|override|operator|typename|try|catch|throw|new|delete|struct\s+\w+\s*:\s*public)\b/.test(src) ||
      /\b(vector|string|map|set|pair|unique_ptr|shared_ptr|function)\s*</.test(src) || /\bstd::(?!cout\b|cin\b|endl\b)\w+/.test(src) ||
      /\[\s*[&=]?\s*\]\s*\(/.test(src) || /&\s*\w+\s*[,)]/.test(src) || /:\s*\w+\s*\)\s*\{?/.test(src.replace(/\?[^:;]*:/g, ""));
    return false;
  }
  function runEngine(run, d, quickOnly) {
    var lang = d.lang, code = d.code, stdin = d.stdin;
    if (!quickOnly && (lang === "c" || lang === "cpp") && needsFullCompiler(lang, code, stdin)) return runRemote(run, d, null);
    var first = !engines.w || !engines.sent[lang];
    if (first) run.status("Starting " + NAMES[lang] + "…");
    engines.get(run).then(function (w) {
      return files(ENGINE_FILES[lang], run).then(function (blobs) {
        if (run.ended) return;
        if (blobs && Object.keys(blobs).length) w.postMessage({ files: blobs });
        engines.sent[lang] = true;
        run.status("");
        engines.on = function (r) {
          if (r.t === "crash") { engines.kill(); return fail(run, "The " + NAMES[lang] + " engine stopped unexpectedly. Tap Run to try again."); }
          if (r.t !== "done") return;
          engines.on = null;
          // The quick in-browser C/C++ interpreters don't cover everything: any error they report is checked
          // by the full compiler, which either runs the code or gives the clearer message for a real mistake.
          if ((lang === "c" || lang === "cpp") && r.err && !quickOnly) return runRemote(run, d, r);
          if (lang === "sass" && r.out) { run.write("Compiled CSS:\n", "muted"); run.write(r.out); }
          else if (r.out) run.write(r.out);
          if (r.err) run.write(r.err, "err");
          if (r.err && quickOnly) run.write("\nThe online compilers couldn't be reached and the quick in-browser interpreter doesn't support everything in this code. Check your internet connection, then tap Run again.\n", "muted");
          if (!r.out && !r.err) run.write("(no output)", "muted");
          var first = r.err ? r.err.trim().split("\n")[0] : "";
          run.finish({ ok: !r.err, text: r.out || "", error: first, detail: r.err || "" });
        };
        run.kill = function () { engines.kill(); };
        run.arm();
        w.postMessage({ lang: lang, code: code, stdin: stdin || "" });
      });
    }).catch(function (e) { fail(run, e.message); });
  }

  // ---------- C#, Java, Go, Rust, Kotlin (and C/C++ beyond the quick interpreters): full compilers online ----------
  // Compiler Explorer (godbolt.org) first; if it can't be reached or has a problem, Wandbox (wandbox.org).
  // Both are free services, so the code is sent to them. The hub keeps their compiler lists on the
  // learner's device for a week (sent in with each run), so a run doesn't wait for the list.
  var CE = "https://godbolt.org/api/", CE_LANG = { csharp: "csharp", java: "java", go: "go", rust: "rust", kotlin: "kotlin", c: "c", cpp: "c++" },
    CE_NAMES = { csharp: "C#", java: "Java", go: "Go", rust: "Rust", kotlin: "Kotlin", c: "C", cpp: "C++" },
    WB = "https://wandbox.org/api/", WB_LANG = { c: "C", cpp: "C++", java: "Java", go: "Go", rust: "Rust", csharp: "C#" },
    ceCompiler = {}, wbCompiler = {};
  function jsonFetch(url, body, ms) {
    var ctl = window.AbortController ? new AbortController() : null;
    var t = ctl ? setTimeout(function () { ctl.abort(); }, ms || 30000) : null;
    var opts = body ? { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body) } : { headers: { "Accept": "application/json" } };
    if (ctl) opts.signal = ctl.signal;
    return fetch(url, opts).then(function (r) {
      if (t) clearTimeout(t);
      if (!r.ok) { var e = new Error("The online compiler replied with an error (" + r.status + ")."); e.server = true; throw e; }
      return r.json();
    }, function (e) { if (t) clearTimeout(t); var x = new Error(e && e.name === "AbortError" ? "The online compiler took too long to answer." : "Couldn't reach the online compiler."); x.network = true; throw x; });
  }
  var num = function (v) { return String(v || "").split(/[^0-9]+/).filter(Boolean).slice(0, 3).map(function (x) { return ("000" + x).slice(-4); }).join("."); };
  // All Compiler Explorer compilers for a language that can run code, newest stable first (GCC first for C and C++)
  function compilerList(lang, cached) {
    if (ceCompiler[lang]) return Promise.resolve(ceCompiler[lang]);
    if (cached && cached.ids && cached.ids.length) return Promise.resolve(ceCompiler[lang] = { ids: cached.ids, good: cached.good || 0 });
    return jsonFetch(CE + "compilers/" + CE_LANG[lang] + "?fields=id,name,semver,supportsExecute", null, 20000).then(function (list) {
      var ok = (list || []).filter(function (c) { return c.supportsExecute !== false && !/nightly|trunk|beta|snapshot|alpha|\brc\b|dev|experimental|native|arm|risc|mips|power|wasm|avr|msp|s390|loong|cross/i.test(c.name + " " + c.id); });
      ok.sort(function (a, b) {
        var ga = /gcc/i.test(a.name) ? 1 : 0, gb = /gcc/i.test(b.name) ? 1 : 0;
        if ((lang === "c" || lang === "cpp") && ga !== gb) return gb - ga;
        return num(b.semver) < num(a.semver) ? -1 : num(b.semver) > num(a.semver) ? 1 : 0;
      });
      if (!ok.length) throw new Error("No compiler is available for this language right now.");
      ceCompiler[lang] = { ids: ok.slice(0, 8).map(function (c) { return c.id; }), good: 0 };
      send({ type: "cache", key: "ce:" + lang, value: ceCompiler[lang] });
      return ceCompiler[lang];
    });
  }
  function ceText(x) { return stripAnsi((x || []).map(function (l) { return l.text; }).join("\n")); }
  // A crash inside the compiler's own runtime (not the learner's code): try another compiler version
  function infraFailure(lang, ex, stdout, stderr) {
    if (stdout) return false;
    if (ex.didExecute === false && !(ex.buildResult && ex.buildResult.code)) return true;
    if (/Exception in thread|Error occurred during initialization of VM|Could not find or load main class|Internal compiler error/i.test(stderr)) {
      var frames = stderr.split("\n").filter(function (l) { return /^\s*at /.test(l); });
      return frames.length > 0 && !frames.some(function (l) { return /example|Main|Kt\.|Program|\.kt:|\.java:(?!.*java\.base)/.test(l) && !/java\.base|jdk\.internal|kotlin\.|sun\./.test(l); });
    }
    return false;
  }
  /** Compiler Explorer: resolves with { buildErr, stdout, stderr, timedOut, code }. */
  function viaGodbolt(lang, code, stdin, cached, note) {
    var attempt = function (c, n) {
      var id = c.ids[(c.good + n) % c.ids.length];
      return jsonFetch(CE + "compiler/" + encodeURIComponent(id) + "/compile", {
        source: code, lang: CE_LANG[lang], allowStoreCodeDebug: false,
        options: { userArguments: lang === "c" || lang === "cpp" ? "-Wall" : "", executeParameters: { args: [], stdin: stdin || "" }, compilerOptions: { executorRequest: true, skipAsm: true }, filters: { execute: true }, tools: [], libraries: [] }
      }, 40000).then(function (r) {
        var ex = r.execResult || r, stdout = ceText(ex.stdout), stderr = ceText(ex.stderr);
        if (infraFailure(lang, ex, stdout, stderr) && n + 1 < Math.min(3, c.ids.length)) {
          if (note) note("That compiler version had a problem, trying another one…");
          return attempt(c, n + 1);
        }
        if (c.good !== (c.good + n) % c.ids.length) { c.good = (c.good + n) % c.ids.length; send({ type: "cache", key: "ce:" + lang, value: c }); }
        var build = ex.buildResult || r.buildResult || {};
        return { buildErr: build.code ? (ceText(build.stderr) || ceText(build.stdout)) : "", warnings: build.code ? "" : ceText(build.stderr), stdout: stdout, stderr: stderr, timedOut: !!ex.timedOut, code: ex.code, signal: (/\b(SIG[A-Z]+)\b/.exec(stderr + " " + (ex.signal || "")) || [])[1] || "" };
      }, function (e) {
        // A compiler that has been retired since the list was saved: forget the list and fetch it again
        if (e.server && n === 0 && cached) { ceCompiler[lang] = null; send({ type: "cache", key: "ce:" + lang, value: null }); return compilerList(lang, null).then(function (c2) { return attempt(c2, 0); }); }
        throw e;
      });
    };
    return compilerList(lang, cached).then(function (c) { return attempt(c, 0); });
  }
  /** Wandbox: the same result shape. */
  function viaWandbox(lang, code, stdin, cached) {
    if (!WB_LANG[lang]) return Promise.reject(new Error("No backup compiler for " + CE_NAMES[lang] + "."));
    var pick = wbCompiler[lang] ? Promise.resolve(wbCompiler[lang]) : cached ? Promise.resolve(wbCompiler[lang] = cached) :
      jsonFetch(WB + "list.json", null, 20000).then(function (list) {
        var ok = (list || []).filter(function (c) { return c.language === WB_LANG[lang] && !/head|dev|snapshot|nightly/i.test(c.name + " " + c.version); });
        ok.sort(function (a, b) {
          var ga = /^gcc/.test(a.name) ? 1 : 0, gb = /^gcc/.test(b.name) ? 1 : 0;
          if ((lang === "c" || lang === "cpp") && ga !== gb) return gb - ga;
          return num(b.version) < num(a.version) ? -1 : num(b.version) > num(a.version) ? 1 : 0;
        });
        if (!ok.length) throw new Error("No backup compiler is available for this language right now.");
        wbCompiler[lang] = ok[0].name;
        send({ type: "cache", key: "wb:" + lang, value: ok[0].name });
        return ok[0].name;
      });
    return pick.then(function (name) {
      return jsonFetch(WB + "compile.json", { compiler: name, code: code, stdin: stdin || "", options: lang === "c" || lang === "cpp" ? "warning" : "", save: false }, 40000);
    }).then(function (r) {
      var status = String(r.status == null ? "" : r.status), compileErr = stripAnsi(r.compiler_error);
      r.compiler_output = stripAnsi(r.compiler_output); r.program_output = r.program_output == null ? r.program_output : stripAnsi(r.program_output); r.program_error = r.program_error == null ? r.program_error : stripAnsi(r.program_error);
      var built = r.program_output != null || r.program_error != null;
      return { buildErr: !built && status !== "0" ? (compileErr || r.compiler_output || "Your code didn't compile.") : "", stdout: (r.program_output || "").replace(/\n$/, ""), stderr: (r.program_error || "").replace(/\n$/, ""),
        timedOut: /SIGKILL|SIGXCPU|time/i.test(String(r.signal || "")), code: status === "" ? 0 : Number(status),
        warnings: built || status === "0" ? compileErr : "", signal: String(r.signal || "") };
    });
  }
  var SIGNALS = { 134: "SIGABRT", 136: "SIGFPE", 139: "SIGSEGV", 137: "SIGKILL" };
  function runRemote(run, d, interp) {
    var lang = d.lang, code = d.code, stdin = d.stdin, cache = d.cache || remoteCache;
    var t0 = Date.now();
    clearTimeout(run.limit);                 // the online services have their own time limits
    run.status(interp ? "Checking with the full " + CE_NAMES[lang] + " compiler…" : "Compiling and running your " + CE_NAMES[lang] + " code online…");
    // A slow answer: say what's happening, so the wait doesn't look like a freeze
    var slow = setTimeout(function () { run.status("Still compiling… online compilers can take up to 20 seconds when they're busy."); }, 7000);
    run.kill = function () { clearTimeout(slow); };
    var show = function (r, where) {
      clearTimeout(slow);
      if (run.ended) return;
      run.status("");
      if (r.buildErr) {
        run.write("Your code didn't compile:\n", "err");
        run.write(r.buildErr.replace(/\s+$/, "") + "\n", "err");
        return run.finish({ ok: false, text: "", error: r.buildErr.split("\n")[0], detail: r.buildErr, compile: true, where: where });
      }
      if (r.stdout) run.write(r.stdout + "\n");
      if (r.stderr) run.write(r.stderr + "\n", "err");
      if (r.timedOut) run.write("Your program took too long and was stopped. Check for a loop that never ends.\n", "err");
      var sig = r.signal || SIGNALS[r.code] || (r.code < 0 ? SIGNALS[128 - r.code] : "") || "";
      if (r.code && !r.timedOut) run.write("\nProgram exited with code " + r.code + (sig ? " (" + sig + ")" : "") + ".\n", "muted");
      if (!r.stdout && !r.stderr && !r.code) run.write("(no output)\n", "muted");
      run.write("\nRan on " + where + " in " + ((Date.now() - t0) / 1000).toFixed(1) + " s.", "note");
      var bad = !!r.stderr || r.timedOut || !!r.code;
      run.finish({ ok: !bad, text: r.stdout, error: r.stderr ? r.stderr.split("\n")[0] : r.timedOut ? "took too long" : r.code ? "exit code " + r.code + (sig ? " " + sig : "") : "",
        detail: (r.stderr || "") + (r.timedOut ? "\nYour program took too long and was stopped." : "") + (r.code ? "\nexit code " + r.code + (sig ? " " + sig : "") : ""), warnings: r.warnings || "", exit: r.code || 0, signal: sig, where: where });
    };
    viaGodbolt(lang, code, stdin, cache["ce:" + lang], function (t) { run.status(t); }).then(function (r) { show(r, "Compiler Explorer (godbolt.org)"); }, function (e1) {
      if (run.ended) return;
      run.status("Compiler Explorer didn't answer, trying the backup compiler…");
      return viaWandbox(lang, code, stdin, cache["wb:" + lang]).then(function (r) { show(r, "Wandbox (wandbox.org)"); }, function (e2) {
        clearTimeout(slow);
        if (run.ended) return;
        run.status("");
        // The quick interpreter's own answer is better than nothing
        if (interp) {
          if (interp.out) run.write(interp.out);
          run.write(interp.err, "err");
          run.write("\nThe full compiler couldn't be reached to double-check this, so this is the quick in-browser interpreter's message.\n", "muted");
          return run.finish({ ok: false, text: interp.out || "", error: interp.err.trim().split("\n")[0], detail: interp.err });
        }
        // C and C++: the in-browser interpreter may still manage it
        if (lang === "c" || lang === "cpp") { run.write("The online compilers couldn't be reached, so trying the quick in-browser interpreter…\n", "muted"); return runEngine(run, d, true); }
        var why = (e1 && e1.network) || (e2 && e2.network) ? "Couldn't reach the online compilers. Check your internet connection, then tap Run again." : "The online compilers are busy right now. Wait a moment, then tap Run again.";
        run.write(why + "\n", "err");
        run.write("Your code is saved on this device, so nothing is lost.\n", "muted");
        run.finish({ ok: false, error: why, offline: true });
      });
    });
  }

  // ---------- JSON: checks it, shows where the mistake is, and formats it ----------
  function runJson(run, code) {
    try {
      var data = JSON.parse(code);
      var count = function (v) { return Array.isArray(v) ? v.length + " items" : v && typeof v === "object" ? Object.keys(v).length + " keys" : typeof v; };
      run.write("✔ Valid JSON (" + (Array.isArray(data) ? "array, " : data && typeof data === "object" ? "object, " : "") + count(data) + ")\n\n", "muted");
      var pretty = JSON.stringify(data, null, 2);
      run.write(pretty + "\n");
      run.finish({ ok: true, text: pretty });
    } catch (e) {
      var msg = String(e.message || e), line = 0, col = 0, m;
      if ((m = /line (\d+) column (\d+)/.exec(msg))) { line = +m[1]; col = +m[2]; }
      else if ((m = /position (\d+)/.exec(msg))) { var before = code.slice(0, +m[1]); line = before.split("\n").length; col = +m[1] - before.lastIndexOf("\n"); }
      if (line) {
        var src = code.split("\n")[line - 1] || "";
        run.write("✘ Invalid JSON (line " + line + ", column " + col + ")\n", "err");
        run.write(src + "\n" + " ".repeat(Math.max(0, col - 1)) + "^\n\n", "err");
      } else run.write("✘ Invalid JSON\n", "err");
      run.write(msg + "\n\nCommon mistakes: a comma after the last item, single quotes instead of double quotes, or keys without quotes.\n", "muted");
      run.finish({ ok: false, error: msg, detail: msg + (line ? " (line " + line + ")" : "") });
    }
  }

  // The hub starts a language in advance (only when it is already on this device), so the first Run is quick
  function warm(lang, cache) {
    if (cache) remoteCache = cache;
    var none = { status: function () {}, ended: false, id: 0 };
    if (lang === "python") python.get(none).catch(function () {});
    else if (lang === "sql") sql.get(none).catch(function () {});
    else if (lang === "php") php.get(none).catch(function () {});
    else if (ENGINE_FILES[lang]) engines.get(none).then(function (w) {
      return files(ENGINE_FILES[lang], null).then(function (b) { if (b && Object.keys(b).length) w.postMessage({ files: b }); engines.sent[lang] = true; });
    }).catch(function () {});
    if (CE_LANG[lang] && lang !== "c" && lang !== "cpp") compilerList(lang, (cache || {})["ce:" + lang]).catch(function () {});
  }

  window.addEventListener("message", function (e) {
    if (e.source !== parent) return;
    var d = e.data || {};
    if (d.type === "warm") return warm(d.lang, d.cache);
    if (d.type === "stop") {
      if (current && current.id === d.id) {
        if (current.kill) current.kill();
        current.write("\nStopped.\n", "muted");
        current.finish({ ok: false, stopped: true, error: "Stopped" });
      }
      return;
    }
    if (d.type !== "run" || typeof d.code !== "string" || !NAMES[d.lang]) return;
    if (current) { if (current.kill) current.kill(); current.finish({ ok: false, stopped: true, error: "Stopped" }); }
    var run = current = new Run(d);
    if (d.cache) remoteCache = d.cache;
    try {
      if (d.lang === "python") runPython(run, d);
      else if (d.lang === "sql") runSql(run, d);
      else if (d.lang === "php") runPhp(run, d);
      else if (d.lang === "json") runJson(run, d.code);
      else if (ENGINE_FILES[d.lang]) runEngine(run, d);
      else runRemote(run, d, null);
    } catch (x) { fail(run, "Something went wrong: " + (x && x.message || x)); }
  });
  send({ type: "ready" });
})();
