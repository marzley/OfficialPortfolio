/* Marzley Learn: language engines that run inside a Web Worker (started by runner.js), so code that
 * never ends can be stopped. Each engine returns { out, err }. Loaded with importScripts(). */
(function () {
  "use strict";
  var BASE = self.__LEARN_ROOT + "vendor/langs/";
  // Some engines expect a browser page; give them the few pieces they touch
  self.window = self;
  self.HTMLDocument = self.HTMLDocument || function HTMLDocument() {};
  self.document = self.document || { currentScript: null, body: null, documentElement: { style: {} }, readyState: "complete",
    addEventListener: function () {}, removeEventListener: function () {}, querySelector: function () { return null; },
    querySelectorAll: function () { return []; }, getElementById: function () { return null; }, getElementsByTagName: function () { return []; },
    createElement: function () { return { style: {}, setAttribute: function () {}, appendChild: function () {} }; } };

  var out = "", err = "";
  var capture = function (fn) { return function () { var s = Array.prototype.map.call(arguments, function (x) { return typeof x === "string" ? x : String(x); }).join(" "); fn(s); }; };
  var line = function (s) { return /\n$/.test(s) ? s : s + "\n"; };
  console.log = capture(function (s) { out += line(s); });
  console.info = console.log;
  console.warn = capture(function (s) { if (!/(were|was) not loaded/.test(s)) err += line(s); });
  console.error = console.warn;

  var loaded = {};
  var need = function (file) { if (!loaded[file]) { importScripts(BASE + file); loaded[file] = true; } };

  var ENGINES = {
    c: function (code) {
      need("picoc.js");
      return Promise.resolve(self.picocjs.runC(code, function (s) { out += line(String(s)); })).then(function () {
        // PicoC prints its errors as normal output: move them to the error stream
        var at = out.search(/[^\n]*\n?[^\n]*\^\s*\n?[^\n]*file\.c:\d+:\d+|file\.c:\d+:\d+/);
        if (at >= 0) { var head = out.slice(0, at), tail = out.slice(at); var cut = head.lastIndexOf("\n", head.length - 2); if (/\^\s*$/.test(head.trim()) || true) { err += tail; out = head; } }
      });
    },
    cpp: function (code, stdin) {
      need("jscpp.js");
      try {
        var exit = self.JSCPP.run(code, stdin || "", { stdio: { write: function (s) { out += s; } }, unsigned_overflow: "ignore" });
        if (exit) err += "\n(Program exited with code " + exit + ")\n";
      } catch (e) { err += String(e && e.message || e) + "\n"; }
      return Promise.resolve();
    },
    lua: function (code) {
      need("fengari.js");
      var f = self.fengari;
      var L = f.lauxlib.luaL_newstate();
      f.lualib.luaL_openlibs(L);
      // print() writes to our output
      f.lua.lua_pushjsfunction(L, function (L) {
        var n = f.lua.lua_gettop(L), parts = [];
        for (var i = 1; i <= n; i++) parts.push(f.to_jsstring(f.lauxlib.luaL_tolstring(L, i)));
        out += parts.join("\t") + "\n";
        return 0;
      });
      f.lua.lua_setglobal(L, f.to_luastring("print"));
      var st = f.lauxlib.luaL_loadstring(L, f.to_luastring(code));
      if (st === 0) st = f.lua.lua_pcall(L, 0, 0, 0);
      if (st !== 0) err += f.to_jsstring(f.lua.lua_tostring(L, -1)) + "\n";
      return Promise.resolve();
    },
    prolog: function (code) {
      need("tau-prolog.js");
      var pl = self.pl;
      // Lines starting with ?- are queries; everything else is the program
      var lines = code.split("\n"), program = [], queries = [];
      lines.forEach(function (l) { var m = /^\s*\?-\s*(.*)$/.exec(l); if (m) queries.push(m[1]); else program.push(l); });
      var session = pl.create(1000000);
      session.streams.user_output = new pl.type.Stream({ put: function (t) { out += t; return true; }, flush: function () { return true; } }, "append", "user_output", "text", false, "eof_code");
      session.standard_output = session.streams.user_output;
      session.current_output = session.streams.user_output;
      return new Promise(function (resolve) {
        session.consult(":- use_module(library(lists)).\n" + program.join("\n"), {
          success: function () {
            var next = function (i) {
              if (i >= queries.length) { if (!queries.length) out += "(Program loaded. Add a query like ?- member(X, [a,b]). to run it.)\n"; return resolve(); }
              out += "?- " + queries[i] + "\n";
              session.query(queries[i], {
                success: function () {
                  var count = 0;
                  var more = function () {
                    session.answer({
                      success: function (a) { count++; out += "   " + session.format_answer(a) + "\n"; if (count < 20) more(); else { out += "   (showing the first 20 answers)\n"; next(i + 1); } },
                      fail: function () { if (!count) out += "   false.\n"; next(i + 1); },
                      error: function (e) { err += "   error: " + pl.format_answer(e) + "\n"; next(i + 1); },
                      limit: function () { err += "   stopped: the query ran too long\n"; next(i + 1); }
                    });
                  };
                  more();
                },
                error: function (e) { err += "Query error: " + pl.format_answer(e) + "\n"; next(i + 1); }
              });
            };
            next(0);
          },
          error: function (e) { err += "Program error: " + pl.format_answer(e) + "\n"; resolve(); }
        });
      });
    },
    regex: function (code) {
      // First line: /pattern/flags. After a line of ---: the text to search.
      var parts = code.split(/\n-{3,}\n/), head = (parts[0] || "").trim(), text = parts.slice(1).join("\n---\n");
      var m = /^\/([\s\S]*)\/([a-z]*)$/.exec(head), re;
      if (!m) { err += "Write the pattern on the first line like /\\d+/g, then a line with ---, then your text.\n"; return Promise.resolve(); }
      try { re = new RegExp(m[1], m[2].indexOf("g") < 0 ? m[2] + "g" : m[2]); } catch (e) { err += "Invalid pattern: " + e.message + "\n"; return Promise.resolve(); }
      var found = [], x, marked = "", last = 0;
      while ((x = re.exec(text)) && found.length < 200) {
        found.push(x);
        marked += text.slice(last, x.index) + "[" + x[0] + "]";
        last = x.index + x[0].length;
        if (x[0] === "") re.lastIndex++;
      }
      marked += text.slice(last);
      out += found.length ? found.length + " match" + (found.length === 1 ? "" : "es") + " for " + head + "\n\n" : "No matches for " + head + "\n";
      found.forEach(function (f, i) {
        out += (i + 1) + ". \"" + f[0] + "\" at position " + f.index;
        if (f.length > 1) out += "   groups: " + f.slice(1).map(function (g, j) { return "$" + (j + 1) + "=" + JSON.stringify(g === undefined ? null : g); }).join(", ");
        if (f.groups) out += "   named: " + JSON.stringify(f.groups);
        out += "\n";
      });
      if (found.length) out += "\nText with matches in [brackets]:\n" + marked + "\n";
      return Promise.resolve();
    },
    sass: function (code) {
      need("sass.js");
      try { out += self.sass.compileString(code, { style: "expanded", logger: self.sass.Logger.silent }).css + "\n"; }
      catch (e) { err += String(e && e.message || e) + "\n"; }
      return Promise.resolve();
    },
    ruby: (function () {
      var vmReady = null;
      return function (code) {
        need("ruby-wasi.js");
        if (!vmReady) {
          vmReady = WebAssembly.compileStreaming(fetch(BASE + "ruby.wasm")).then(function (mod) {
            return self["ruby-wasm-wasi"].DefaultRubyVM(mod, { consolePrint: true });
          }).then(function (r) { return r.vm; });
        }
        return vmReady.then(function (vm) {
          try { vm.eval("$stdout.sync = true; " + code); }
          catch (e) { err += String(e && e.message || e) + "\n"; }
        });
      };
    })()
  };

  self.onmessage = function (e) {
    var d = e.data || {};
    out = ""; err = "";
    var engine = ENGINES[d.lang];
    if (!engine) { self.postMessage({ done: true, out: "", err: "Unknown language" }); return; }
    var finish = function () { self.postMessage({ done: true, out: out, err: err }); };
    try {
      Promise.resolve(engine(d.code, d.stdin)).then(finish, function (x) { err += String(x && x.message || x) + "\n"; finish(); });
    } catch (x) { err += String(x && x.message || x) + "\n"; finish(); }
  };
  self.postMessage({ ready: true });
})();
