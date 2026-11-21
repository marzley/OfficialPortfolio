/* Marzley Learn code runner. Always shown inside a sandboxed frame: it has no access to the website,
 * cookies or accounts. Two kinds of frame use it:
 *  - page frames (the default): HTML, CSS, JavaScript, TypeScript, React and Markdown become this frame's
 *    page. The hub sends {type: "run", lang, code}; we reply {type: "output", text, ok, error}.
 *  - the console frame (?mode=console): one hidden frame that runs Python, SQL, PHP, C, C++, Java and the
 *    other console languages for every code box on the page (learn/console.js). The hub shows the output.
 * Big files (language runtimes) come from the hub, which keeps them on the learner's device. A sandboxed
 * frame can't use the browser's cache, so it would otherwise download them again on every visit. */
(function () {
  "use strict";
  var params = new URLSearchParams(location.search);
  if (params.get("theme") === "dark") document.body.classList.add("dark");
  var ROOT = new URL("/", location.href).href;
  var VFS = params.get("vfs") === "1";                        // the hub can send us files from its store
  var send = function (msg) { try { parent.postMessage(msg, "*"); } catch (e) {} };
  var script = document.querySelector("script[data-engines]");
  var version = function (name) { return script ? script.getAttribute("data-" + name) || "1" : "1"; };

  // ---------- files from the hub's store on this device ----------
  var waiting = {}, seq = 0, blobUrls = {};
  /** Resolves with { files: { path: Blob } } or { error }, or null when the hub can't send files
   * (then load them from the network). Paths are relative to the site root; "dir/" means every file in it. */
  function getFiles(paths, run) {
    if (!VFS) return Promise.resolve(null);
    return new Promise(function (resolve) {
      var req = ++seq;
      waiting[req] = resolve;
      send({ type: "need", req: req, paths: paths, run: run || 0 });
    });
  }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (e.source !== parent || d.type !== "files" || !waiting[d.req]) return;
    var done = waiting[d.req];
    delete waiting[d.req];
    done(d.error ? { error: d.error } : { files: d.files || {} });
  });
  /** A URL to load one file from: a blob: URL of the stored copy, or the file on the server. */
  function fileUrl(path, run, v) {
    if (blobUrls[path]) return Promise.resolve(blobUrls[path]);
    return getFiles([path], run).then(function (r) {
      if (r && r.error) throw new Error(r.error);
      var b = r && r.files[path];
      return b ? (blobUrls[path] = URL.createObjectURL(b)) : ROOT + path + (v ? "?v=" + v : "");
    });
  }
  var loaded = {};
  function loadScript(path, v) {
    if (!loaded[path]) loaded[path] = fileUrl(path, 0, v).then(function (src) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { reject(new Error("Could not load the tools for this language. Check your connection and try again.")); };
        document.head.appendChild(s);
      });
    }).catch(function (e) { delete loaded[path]; throw e; });
    return loaded[path];
  }

  // ---------- the console frame: learn/console.js does the work ----------
  if (params.get("mode") === "console") {
    window.__runner = { ROOT: ROOT, VFS: VFS, send: send, getFiles: getFiles, version: version };
    loadScript("learn/console.js", version("console")).catch(function () {
      document.getElementById("out").textContent = "The code runner could not start.";
      send({ type: "failed" });
    });
    return;
  }
  var out = document.getElementById("out");
  var print = function (text, cls) {
    var span = document.createElement("span");
    if (cls) span.className = cls;
    span.textContent = text;
    out.appendChild(span);
  };
  function showError(title, msg) {
    out.textContent = "";
    print(title + "\n", "err");
    print(msg + "\n", "err");
    send({ type: "output", text: "", ok: false, error: msg });
  }

  // ---------- HTML, CSS and JavaScript: the code becomes this page ----------
  var CONSOLE = "<script>(function(){var lines=[];function fmt(a){return Array.prototype.map.call(a,function(x){" +
    "if(typeof x==='string')return x;try{return JSON.stringify(x);}catch(e){return String(x);}}).join(' ');}" +
    "function show(t,c){if(lines.length>=1000){if(lines.length===1000){lines.push('');t='(Output stopped after 1,000 lines.)';c='#fcd34d';}else return;}lines.push(t);var box=document.getElementById('__console');if(!box){box=document.createElement('pre');box.id='__console';" +
    "box.style.cssText='margin:16px 0 0;padding:10px 12px;border-top:2px solid #ffb800;background:#0b1b35;color:#e2e8f0;font:14px/1.5 monospace;white-space:pre-wrap';" +
    "(document.body||document.documentElement).appendChild(box);}var s=document.createElement('div');if(c)s.style.color=c;s.textContent=t;box.appendChild(s);}" +
    "['log','info','warn','error'].forEach(function(k){console[k]=function(){show(fmt(arguments),k==='error'?'#fca5a5':k==='warn'?'#fcd34d':'');};});" +
    "var firstErr='';window.addEventListener('error',function(e){var m=String(e.message||'');var t=/Your loop ran/.test(m)?m.replace(/^Uncaught Error: /,''):'Error: '+m+(e.lineno?' (line '+e.lineno+')':'');if(!firstErr)firstErr=t;show(t,'#fca5a5');});" +
    "window.__report=function(){parent.postMessage({type:'output',text:lines.join('\\n'),ok:!firstErr,error:firstErr,detail:firstErr},'*');};" +
    "window.addEventListener('load',function(){setTimeout(window.__report,150);});" +
    // The sandbox blocks real form submission (and with it the submit event), so learners' submit
    // handlers would never run. Fire the submit event ourselves after the browser's own checks.
    "function fire(f,b){if(!f.noValidate&&!(b&&b.formNoValidate)&&!f.reportValidity())return;var ev;try{ev=new SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:b||null});}catch(x){ev=new Event('submit',{bubbles:true,cancelable:true});}f.dispatchEvent(ev);}" +
    "document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button,input[type=submit]');if(!b||!b.form||e.defaultPrevented)return;if(b.tagName==='BUTTON'&&(b.getAttribute('type')||'submit').toLowerCase()!=='submit')return;e.preventDefault();fire(b.form,b);});" +
    "document.addEventListener('keydown',function(e){var el=e.target;if(e.key!=='Enter'||e.defaultPrevented||el.tagName!=='INPUT'||!el.form||/^(button|submit|reset|checkbox|radio|file)$/i.test(el.type))return;e.preventDefault();fire(el.form,el.form.querySelector('button:not([type]),button[type=submit],input[type=submit]'));});" +
    "})();<\/script>";

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
    var lib = ["vendor/react/react.production.min.js", "vendor/react/react-dom.production.min.js"];
    Promise.all([loadScript("vendor/sucrase/sucrase.min.js"), fileUrl(lib[0]), fileUrl(lib[1])]).then(function (urls) {
      var js;
      try { js = window.sucrase.transform(code, { transforms: ["jsx", "typescript"], production: true }).code; }
      catch (e) { return showError("JSX error", String(e.message || e)); }
      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" + GUARD + CONSOLE +
        "<style>body{font:15px/1.5 system-ui,sans-serif;margin:12px}</style>" +
        "<script src='" + urls[1] + "'><\/script><script src='" + urls[2] + "'><\/script></head>" +
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

  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (e.source !== parent || d.type !== "run" || typeof d.code !== "string") return;
    if (d.lang === "typescript") runTypeScript(d.code);
    else if (d.lang === "react") runReact(d.code);
    else if (d.lang === "markdown") runMarkdown(d.code);
    else runWeb(d.lang, d.code);
  });
  send({ type: "ready" });
})();
