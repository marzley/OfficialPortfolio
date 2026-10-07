// Make a 1200x630 share image (img/og/<slug>.jpg) for every page, using each page's title.
// Needs Node and Playwright:  npm i -D playwright && npx playwright install chromium
// Run from the project root after tools/build_pages.py, then run build_pages.py again.
const fs = require("fs");
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright")); }

const root = path.resolve(__dirname, "..");
const skip = new Set(["index.html", "offline.html", "404.html"]);
const labels = { work: "Our work", about: "About us", services: "Services", process: "How we work", pricing: "Pricing",
  contact: "Contact", training: "Training", blog: "Blog", faq: "FAQ", "website-check": "Free tool", referrals: "Refer & earn", kiswahili: "Kiswahili", "kelvin-wanyoike": "Author", privacy: "Legal", terms: "Legal" };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const logo = "data:image/webp;base64," + fs.readFileSync(path.join(root, "img/brand/logo-256.webp")).toString("base64");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  fs.mkdirSync(path.join(root, "img/og"), { recursive: true });
  for (const file of fs.readdirSync(root).filter((f) => f.endsWith(".html") && !skip.has(f))) {
    const slug = file.slice(0, -5);
    const html = fs.readFileSync(path.join(root, file), "utf8");
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1].replace(/ \| Marzley Tech.*$/, "").replace(/&amp;/g, "&");
    const label = labels[slug] || (slug.startsWith("case-study") ? "Case study" : "Blog");
    await page.setContent(`<!doctype html><html><body style="margin:0">
      <div style="width:1200px;height:630px;box-sizing:border-box;padding:70px 80px;display:flex;flex-direction:column;justify-content:space-between;
        font-family:Inter,'DejaVu Sans',Arial,sans-serif;color:#fff;background:radial-gradient(circle at 85% 15%,rgba(255,184,0,.35),transparent 45%),linear-gradient(150deg,#1e3a7a,#0b1b35 65%);">
        <div style="display:flex;align-items:center;gap:18px"><img src="${logo}" style="width:84px;height:84px;border-radius:50%;background:#fff">
          <span style="font-size:34px;font-weight:800">Marzley<span style="color:#ffb800">Tech</span> Solutions</span></div>
        <div><div style="font-size:26px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#ffb800;margin-bottom:18px">${esc(label)}</div>
          <div style="font-size:${title.length > 60 ? 54 : 66}px;font-weight:800;line-height:1.08;letter-spacing:-.02em;max-width:1000px">${esc(title)}</div></div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:26px;color:rgba(255,255,255,.8)">
          <span>marzleytechsolutions.co.ke</span><span style="height:10px;width:220px;border-radius:10px;background:#ffb800"></span></div>
      </div></body></html>`);
    await page.screenshot({ path: path.join(root, "img/og", slug + ".jpg"), type: "jpeg", quality: 82 });
    console.log("made img/og/" + slug + ".jpg");
  }
  await browser.close();
})();
