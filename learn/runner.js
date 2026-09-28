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
    "function show(t,c){lines.push(t);var box=document.getElementById('__console');if(!box){box=document.createElement('pre');box.id='__console';" +
    "box.style.cssText='margin:16px 0 0;padding:10px 12px;border-top:2px solid #ffb800;background:#0b1b35;color:#e2e8f0;font:14px/1.5 monospace;white-space:pre-wrap';" +
    "(document.body||document.documentElement).appendChild(box);}var s=document.createElement('div');if(c)s.style.color=c;s.textContent=t;box.appendChild(s);}" +
    "['log','info','warn','error'].forEach(function(k){console[k]=function(){show(fmt(arguments),k==='error'?'#fca5a5':k==='warn'?'#fcd34d':'');};});" +
    "window.addEventListener('error',function(e){show('Error: '+e.message+(e.lineno?' (line '+e.lineno+')':''),'#fca5a5');});" +
    "window.__report=function(){parent.postMessage({type:'output',text:lines.join('\\n'),ok:true},'*');};" +
    "window.addEventListener('load',function(){setTimeout(window.__report,150);});})();<\/script>";

  function runWeb(lang, code) {
    var html;
    if (lang === "javascript") {
      html = "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" + CONSOLE +
        "<style>body{font:15px/1.5 system-ui,sans-serif;margin:12px}</style></head><body><script>\n" + code.replace(/<\/script/gi, "<\\/script") + "\n<\/script></body></html>";
    } else {
      html = /<html[\s>]/i.test(code) || /<!doctype/i.test(code) ? code : "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head><body>" + code + "</body></html>";
      html = html.replace(/<head([^>]*)>/i, "<head$1>" + CONSOLE);
      if (html.indexOf("__console") < 0 && html.indexOf(CONSOLE) < 0) html = CONSOLE + html;
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
  function runPython(code) {
    out.textContent = "";
    print("Starting Python… (the first run takes a few seconds)\n", "muted");
    loadPython().then(function (py) {
      out.textContent = "";
      var text = [];
      py.setStdout({ batched: function (t) { text.push(t); print(t + "\n"); } });
      py.setStderr({ batched: function (t) { text.push(t); print(t + "\n", "err"); } });
      py.setStdin({ stdin: function () { var v = prompt("Input for your program:"); return v === null ? "" : v; } });
      try {
        py.runPython(code);
        if (!text.length) print("(no output)", "muted");
        send({ type: "output", text: text.join("\n"), ok: true });
      } catch (e) {
        var msg = String(e.message || e).split("\n").filter(function (l) { return l && !/^\s*File "\/lib\//.test(l) && !/_pyodide/.test(l); }).join("\n");
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
  var sqlReady = null;
  function loadSql() {
    if (sqlReady) return sqlReady;
    sqlReady = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "/vendor/sqljs/sql-wasm.js";
      s.onload = function () { window.initSqlJs({ locateFile: function (f) { return "/vendor/sqljs/" + f; } }).then(resolve, reject); };
      s.onerror = function () { reject(new Error("SQL could not load. Check your connection and try again.")); };
      document.head.appendChild(s);
    });
    return sqlReady;
  }
  function runSql(code) {
    out.textContent = "";
    loadSql().then(function (SQL) {
      var db = new SQL.Database();
      db.run(SAMPLE);
      var text = [];
      try {
        var results = db.exec(code);
        if (!results.length) print("Done. (The statement returned no rows.)\n", "muted");
        results.forEach(function (r) {
          var t = "<table><thead><tr>" + r.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
            r.values.map(function (row) { return "<tr>" + row.map(function (v) { return "<td>" + esc(v === null ? "NULL" : v) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
          var wrap = document.createElement("div");
          wrap.innerHTML = t;
          out.appendChild(wrap);
          print("Number of records: " + r.values.length + "\n", "muted");
          text.push(r.columns.join(","));
          r.values.forEach(function (row) { text.push(row.join(",")); });
        });
        send({ type: "output", text: text.join("\n"), ok: true });
      } catch (e) {
        print("Error: " + e.message + "\n", "err");
        send({ type: "output", text: "", ok: false, error: e.message });
      }
      db.close();
    }).catch(function (e) { print(e.message, "err"); send({ type: "output", text: "", ok: false, error: e.message }); });
  }

  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type !== "run" || typeof d.code !== "string") return;
    if (d.lang === "python") runPython(d.code);
    else if (d.lang === "sql") runSql(d.code);
    else runWeb(d.lang, d.code);
  });
  send({ type: "ready" });
})();
