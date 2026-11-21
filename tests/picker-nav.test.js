// Checks the Learn header (the Home button) and the Practice page's language picker. Needs only Node: no browser.
//   node tests/picker-nav.test.js   (also run by tests/run.sh)
//  - Home is the first link of the top navigation on the hub and on every static lesson and subject page
//  - every Practice language is in exactly one group and has a badge whose text is readable (4.5:1 contrast)
//  - the old language strip is gone, and a group that is not open stays hidden
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
let fails = 0, total = 0;
const ok = (cond, label) => { total++; if (!cond) { fails++; console.log("FAIL picker/nav: " + label); } };

// ---------- the Home button ----------
const order = (html) => (/<nav class="learn-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(html) || [, ""])[1].match(/<a [^>]*>[\s\S]*?<\/a>/g) || [];
const label = (a) => a.replace(/<[^>]*>/g, "").trim();
const hub = fs.readFileSync(path.join(root, "learn/index.html"), "utf8");
const hubLinks = order(hub);
ok(hubLinks.map(label).join(",") === "Home,Tutorials,Practice,Videos,Notes", "the hub's navigation is Home, Tutorials, Practice, Videos, Notes (got " + hubLinks.map(label).join(",") + ")");
ok(/href="\.\/"/.test(hubLinks[0] || "") && /data-nav="home"/.test(hubLinks[0] || "") && /fa-house/.test(hubLinks[0] || ""), "on the hub, Home links to ./ , is the data-nav=home link and has the house icon");
ok(/function pageHome\(\) \{\s*setNav\("home"\);/.test(fs.readFileSync(path.join(root, "learn/learn.js"), "utf8")), "the hub's home page highlights Home");

// every built static page (lessons, subjects) has Home first
let pages = 0, missing = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html" && p !== path.join(root, "learn/index.html")) {
      const html = fs.readFileSync(p, "utf8");
      if (!/class="learn-nav"/.test(html)) continue;
      pages++;
      const l = order(html);
      if (l.map(label).join(",") !== "Home,Tutorials,Practice,Videos,Notes" || !/href="\/learn\/"/.test(l[0])) missing.push(path.relative(root, p));
    }
  }
})(path.join(root, "learn"));
ok(pages > 600, "found the static lesson and subject pages (" + pages + ")");
ok(missing.length === 0, "every static page has Home first, linking to /learn/ (" + missing.length + " do not" + (missing.length ? ", e.g. " + missing[0] : "") + ")");

// ---------- the language picker ----------
const js = fs.readFileSync(path.join(root, "learn/learn.js"), "utf8");
const grab = (re, name) => { const m = re.exec(js); if (!m) { ok(false, "could not find " + name + " in learn.js"); return null; } return new Function("return " + m[1])(); };
const LANGS = grab(/var LANGS = (\{[^;]*\});/, "LANGS");
const GROUPS = grab(/var PRACTICE_GROUPS = (\[[\s\S]*?\n  \]);/, "PRACTICE_GROUPS");
const BADGE = grab(/var LANG_BADGE = (\{[\s\S]*?\n  \});/, "LANG_BADGE");
if (LANGS && GROUPS && BADGE) {
  const inGroups = [].concat(...GROUPS.map((g) => g[1]));
  ok(inGroups.length === new Set(inGroups).size, "no language is listed in two groups");
  ok(Object.keys(LANGS).every((k) => inGroups.includes(k)) && inGroups.every((k) => LANGS[k]), "every language is in a group, and every listed language exists (" + inGroups.length + " of " + Object.keys(LANGS).length + ")");
  ok(inGroups.every((k) => BADGE[k]), "every language has a badge");
  const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  Object.keys(BADGE).forEach((k) => {
    const [text, bg, fg] = BADGE[k];
    ok(/^#[0-9a-f]{6}$/i.test(bg) && (!fg || /^#[0-9a-f]{6}$/i.test(fg)), k + ": badge colours are six-digit hex");
    ok(text.length >= 1 && text.length <= 4, k + ': the badge label "' + text + '" is 1 to 4 characters');
    const c = contrast(bg, fg || "#ffffff");
    ok(c >= 4.5, k + ": the badge text is readable (" + c.toFixed(1) + ":1, needs 4.5)");
  });
  ok(Object.keys(BADGE).length === inGroups.length, "there are no badges for languages that do not exist");
}

// ---------- the styles ----------
const css = fs.readFileSync(path.join(root, "learn/learn.css"), "utf8");
ok(!/\.lang-pick|\.lang-group/.test(css) && !/lang-pick|lang-group/.test(js), "the old language strip is gone from the styles and the script");
ok(/\.lang-panel\[hidden\]\s*\{\s*display:\s*none/.test(css), "a group that is not open stays hidden (the panel is a flex box, which would otherwise override the hidden attribute)");
ok(/\.lang-tile\[aria-current=page\]/.test(css) && /\.lang-tile:focus-visible/.test(css), "the open language is marked and tiles show a focus ring");

console.log(fails ? fails + " of " + total + " picker/nav checks failed" : "PASS picker and nav: " + total + " checks (Home first on " + (pages + 1) + " pages, every language has a readable badge)");
process.exit(fails ? 1 : 0);
