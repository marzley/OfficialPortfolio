// Checks that the main website's back-to-top button can work on every page. Needs only Node: no browser.
//   node tests/site-pages.test.js   (also run by tests/run.sh)
//  - every page has the button, and the "#top" it links to is the real top of the page
//    (it was once the fixed header, which is always in view, so on inner pages the button appeared but did nothing)
//  - the script scrolls to the top itself when the button is pressed
//  - every page loads the script that shows the button, with a version stamp that matches the file
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const root = path.join(__dirname, "..");
let fails = 0, total = 0;
const ok = (cond, label) => { total++; if (!cond) { fails++; console.log("FAIL site pages: " + label); } };

const pages = fs.readdirSync(root).filter((f) => f.endsWith(".html") && f !== "offline.html").sort();
ok(pages.length > 80, "found the website's pages (" + pages.length + ")");

const stamp = (f) => crypto.createHash("sha1").update(fs.readFileSync(path.join(root, f))).digest("hex").slice(0, 10);
const homeStamp = stamp("js/home.min.js");
const noButton = [], badTarget = [], noScript = [], oldStamp = [];
pages.forEach((f) => {
  const html = fs.readFileSync(path.join(root, f), "utf8");
  if (!/<a class="to-top" href="#top" aria-label="Back to top">/.test(html)) noButton.push(f);
  const ids = html.match(/<([a-z0-9]+)\b[^>]*\bid="top"[^>]*>/g) || [];
  const tag = ids.length === 1 ? /^<([a-z0-9]+)/.exec(ids[0])[1] : "";
  const hero = ids.length === 1 && /class="hero\b/.test(ids[0]);
  if (!(tag === "body" || (tag === "section" && hero))) badTarget.push(f + " (" + (ids.length === 1 ? "<" + tag + ">" : ids.length + " elements") + ")");
  const m = /<script src="js\/home\.min\.js\?v=([0-9a-f]+)" defer>/.exec(html);
  if (!m) noScript.push(f); else if (m[1] !== homeStamp) oldStamp.push(f);
});
ok(noButton.length === 0, "every page has the back-to-top button (" + noButton.length + " do not" + (noButton.length ? ", e.g. " + noButton[0] : "") + ")");
ok(badTarget.length === 0, "on every page #top is the page's real top (the body, or the homepage's first section), never the fixed header (" + badTarget.length + " are not" + (badTarget.length ? ", e.g. " + badTarget[0] : "") + ")");
ok(noScript.length === 0, "every page loads the script that shows the button (" + noScript.length + " do not" + (noScript.length ? ", e.g. " + noScript[0] : "") + ")");
ok(oldStamp.length === 0, "the script's version stamp matches the file on every page, so visitors get the fixed script (" + oldStamp.length + " are stale)");

const src = fs.readFileSync(path.join(root, "js/home.js"), "utf8");
ok(/toTop\.addEventListener\("click"[\s\S]{0,400}window\.scrollTo\(\{ top: 0/.test(src), "home.js scrolls to the top itself when the button is pressed");
const min = fs.readFileSync(path.join(root, "js/home.min.js"), "utf8");
ok(/scrollTo\(\{top:0/.test(min), "the minified script has it too");
const footerLinks = pages.filter((f) => /<a href="#top">Back to top/.test(fs.readFileSync(path.join(root, f), "utf8")));
ok(footerLinks.length > 50, "the text link at the bottom of the page uses the same #top (" + footerLinks.length + " pages)");

console.log(fails ? fails + " of " + total + " site-page checks failed" : "PASS site pages: " + total + " checks (" + pages.length + " pages: back-to-top button, working #top target, script stamp)");
process.exit(fails ? 1 : 0);
