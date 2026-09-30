// Client portal tests: run with `sh tests/run.sh` (sets up the database, config and servers).
// Plain Node 18+, no packages. Exits with code 1 if any check fails.
"use strict";
const fs = require("fs");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const WORK = process.argv[2];
const ROOT = __dirname + "/..";
const BASE = "http://127.0.0.1:8899";
const API = BASE + "/portal/api.php?action=";
let failed = 0;
const ok = (name, cond, extra) => {
  if (!cond) failed++;
  console.log((cond ? "PASS " : "FAIL ") + name + (!cond && extra !== undefined ? "  " + JSON.stringify(extra) : ""));
};
const sql = (q) => execFileSync("php", [__dirname + "/sq.php", WORK + "/portal.db", "exec", q]);
const sel = (q) => JSON.parse(execFileSync("php", [__dirname + "/sq.php", WORK + "/portal.db", "sel", q]).toString());
const one = (q) => sel(q)[0];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cron = (job) => execFileSync("php", ["-d", "sendmail_path=tee -a " + WORK + "/mail.txt", ROOT + "/portal/cron.php", job], { env: process.env }).toString();
const subjects = () => [...fs.readFileSync(WORK + "/mail.txt", "utf8").matchAll(/^Subject: =\?UTF-8\?B\?([^?]+)\?=/gm)].map((m) => Buffer.from(m[1], "base64").toString());
const clearMail = () => fs.writeFileSync(WORK + "/mail.txt", "");

function session() {
  let cookie = "", csrf = null;
  const call = async (action, body, opts = {}) => {
    const method = opts.method || (body === undefined && opts.raw === undefined ? "GET" : "POST");
    const headers = Object.assign({ Cookie: cookie }, csrf ? { "X-CSRF-Token": csrf } : {});
    let payload;
    if (method === "POST") {
      if (body instanceof FormData) payload = body;
      else { headers["Content-Type"] = "application/json"; payload = JSON.stringify(body || {}); }
    }
    if (method === "POST" && opts.raw !== undefined) { headers["Content-Type"] = "application/octet-stream"; payload = opts.raw; }
    Object.assign(headers, opts.headers || {});
    const r = await fetch((opts.api || API) + action + (opts.query || ""), { method, headers, body: payload, redirect: "manual" });
    const sc = r.headers.get("set-cookie");
    if (sc) cookie = sc.split(";")[0];
    const text = await r.text();
    let j = null;
    try { j = JSON.parse(text); } catch (e) {}
    if (j && j.csrf) csrf = j.csrf;
    return { s: r.status, j, text, headers: r.headers, raw: text };
  };
  return call;
}
const login = async (email) => { const s = session(); await s("dev_login", { email }); return s; };
const callback = (id, amount, receipt, key = "testsecret", code = 0) => fetch(BASE + "/callback.php" + (key ? "?key=" + key : ""), {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ Body: { stkCallback: { MerchantRequestID: "m", CheckoutRequestID: id, ResultCode: code, ResultDesc: "x",
    CallbackMetadata: { Item: [{ Name: "Amount", Value: amount }, { Name: "MpesaReceiptNumber", Value: receipt }, { Name: "PhoneNumber", Value: 254722000111 }] } } } }),
});
const stk = (invoiceId, id, amount) => sql(`INSERT INTO invoice_payments (invoice_id, checkout_id, amount, method, created_at) VALUES (${invoiceId}, '${id}', ${amount}, 'mpesa', datetime('now'))`);

(async () => {
  const year = new Date().getFullYear();
  const admin = await login("admin@example.com");
  let r = await admin("client_save", { name: "Wanjiku Supplies", email: "client@example.com", phone: "0712345678" });
  ok("add client", r.s === 200, r.j);
  const client = await login("client@example.com");
  const cid = one("SELECT id FROM clients WHERE email = 'client@example.com'").id;

  // ---------- database upgrade ----------
  ok("database upgraded to the latest version", one("SELECT v FROM settings WHERE k = 'schema_version'").v === "8");

  // ---------- sequential invoice numbers ----------
  r = await admin("invoice_save", { client_id: cid, description: "Website build", amount: 10000, status: "unpaid" });
  ok("first invoice number is MT-" + year + "-0001", r.j && r.j.number === `MT-${year}-0001`, r.j);
  r = await admin("invoice_save", { client_id: cid, description: "Hosting", amount: 3000, status: "unpaid" });
  ok("second invoice number follows on", r.j && r.j.number === `MT-${year}-0002`, r.j);
  const inv1 = one(`SELECT * FROM invoices WHERE number = 'MT-${year}-0001'`);
  const inv2 = one(`SELECT * FROM invoices WHERE number = 'MT-${year}-0002'`);

  // ---------- M-Pesa: secret key, part payments, checks ----------
  stk(inv1.id, "ws_A", 4000);
  let cr = await callback("ws_A", 4000, "RCP0000001", null);
  ok("callback without key refused", cr.status === 403);
  cr = await callback("ws_A", 4000, "RCP0000001", "wrong");
  ok("callback with wrong key refused", cr.status === 403);
  await callback("ws_A", 3000, "RCPLOW0001");
  await sleep(300);
  ok("paying less than requested is rejected", +one(`SELECT amount_paid FROM invoices WHERE id = ${inv1.id}`).amount_paid === 0);
  await callback("ws_A", 4000, "RCP0000001");
  await sleep(300);
  ok("a second result can’t replace the first", +one(`SELECT amount_paid FROM invoices WHERE id = ${inv1.id}`).amount_paid === 0);
  stk(inv1.id, "ws_B", 4000);
  await callback("ws_B", 4000, "RCP0000002");
  await sleep(300);
  let i1 = one(`SELECT * FROM invoices WHERE id = ${inv1.id}`);
  ok("part payment recorded, invoice still unpaid", +i1.amount_paid === 4000 && i1.status === "unpaid", i1);
  r = await client("payment_status", undefined, { query: "&invoice_id=" + inv1.id });
  ok("status check reports the part payment as paid", r.j.status === "paid" && r.j.receipt === "RCP0000002", r.j);
  stk(inv1.id, "ws_C", 6000);
  await callback("ws_C", 6000, "RCP0000002");
  await sleep(300);
  ok("a reused M-Pesa code is rejected", +one(`SELECT amount_paid FROM invoices WHERE id = ${inv1.id}`).amount_paid === 4000);
  stk(inv1.id, "ws_D", 6000);
  await callback("ws_D", 6000, "RCP0000003");
  await sleep(300);
  i1 = one(`SELECT * FROM invoices WHERE id = ${inv1.id}`);
  ok("balance payment marks the invoice paid", i1.status === "paid" && +i1.amount_paid === 10000, i1);
  ok("two payment records", one(`SELECT COUNT(*) AS n FROM payments WHERE invoice_id = ${inv1.id} AND status = 'confirmed'`).n == 2);
  r = await client("pay_invoice", { invoice_id: inv2.id, phone: "0712345678", amount: 5000 });
  ok("can’t ask to pay more than the balance", r.s === 400, r.j);

  // ---------- recording and claiming payments ----------
  r = await admin("payment_record", { invoice_id: inv2.id, amount: 1000, method: "bank", reference: "BANK-001" });
  ok("staff record a bank payment", r.s === 200, r.j);
  r = await admin("payment_record", { invoice_id: inv2.id, amount: 500, method: "bank", reference: "bank-001" });
  ok("the same reference can’t be used twice", r.s === 400, r.j);
  const fd = new FormData();
  fd.append("invoice_id", inv2.id); fd.append("method", "till"); fd.append("amount", "1500"); fd.append("reference", "SGR7H2K9PQ");
  fd.append("proof", new Blob(["%PDF-1.4 fake"], { type: "application/pdf" }), "slip.pdf");
  r = await client("payment_claim", fd);
  ok("client reports a till payment with proof", r.s === 200, r.j);
  const claim = one("SELECT * FROM payments WHERE reference = 'SGR7H2K9PQ'");
  ok("claim waits for confirmation", claim.status === "pending" && +one(`SELECT amount_paid FROM invoices WHERE id = ${inv2.id}`).amount_paid === 1000);
  const fd2 = new FormData();
  fd2.append("invoice_id", inv2.id); fd2.append("method", "till"); fd2.append("amount", "100"); fd2.append("reference", "BAD");
  r = await client("payment_claim", fd2);
  ok("an invalid M-Pesa code is refused", r.s === 400, r.j);
  r = await client("payment_decide", { id: claim.id, decision: "confirm" });
  ok("clients can’t confirm their own payment", r.s === 403);
  r = await admin("proof", undefined, { query: "&id=" + claim.id });
  ok("staff can download the proof", r.s === 200 && r.text.startsWith("%PDF"));
  r = await admin("payment_decide", { id: claim.id, decision: "confirm" });
  ok("staff confirm the claim", r.s === 200 && +one(`SELECT amount_paid FROM invoices WHERE id = ${inv2.id}`).amount_paid === 2500, r.j);
  const fd3 = new FormData();
  fd3.append("invoice_id", inv2.id); fd3.append("method", "bank"); fd3.append("amount", "500"); fd3.append("reference", "NOTREAL1");
  await client("payment_claim", fd3);
  const claim2 = one("SELECT id FROM payments WHERE reference = 'NOTREAL1'");
  clearMail();
  r = await admin("payment_decide", { id: claim2.id, decision: "reject", note: "Not on our statement" });
  ok("rejected claim notifies the client", r.s === 200 && subjects().some((x) => /About your payment/.test(x)), subjects());

  // ---------- card payments (Paystack) ----------
  r = await client("card_pay", { invoice_id: inv2.id, amount: 500 });
  ok("card payment starts", r.s === 200 && /^https:\/\/checkout\.paystack\.com\//.test(r.j.url), r.j);
  const ref = r.j.url.split("fake-")[1];
  let pr = await fetch(BASE + "/portal/paystack.php?reference=" + ref, { redirect: "manual" });
  ok("return from Paystack records the payment", pr.headers.get("location") === "./?card=paid" && one(`SELECT status FROM invoices WHERE id = ${inv2.id}`).status === "paid", pr.headers.get("location"));
  pr = await fetch(BASE + "/portal/paystack.php?reference=" + ref, { redirect: "manual" });
  ok("coming back twice doesn’t double-count", one(`SELECT COUNT(*) AS n FROM payments WHERE checkout_id = '${ref}'`).n == 1);
  r = await admin("invoice_save", { client_id: cid, description: "Logo", amount: 2000, status: "unpaid" });
  const inv3 = one(`SELECT * FROM invoices WHERE number = '${r.j.number}'`);
  r = await client("card_pay", { invoice_id: inv3.id });
  const ref2 = r.j.url.split("fake-")[1];
  await fetch("http://127.0.0.1:8898/_control", { method: "POST", body: JSON.stringify({ amount: 100 }) });
  pr = await fetch(BASE + "/portal/paystack.php?reference=" + ref2, { redirect: "manual" });
  ok("card amount lower than the invoice is refused", pr.headers.get("location") === "./?card=mismatch" && one(`SELECT status FROM invoices WHERE id = ${inv3.id}`).status === "unpaid");
  await fetch("http://127.0.0.1:8898/_control", { method: "POST", body: "null" });
  const hook = JSON.stringify({ event: "charge.success", data: { reference: ref2 } });
  pr = await fetch(BASE + "/portal/paystack.php", { method: "POST", headers: { "x-paystack-signature": "bad" }, body: hook });
  ok("webhook with a bad signature is refused", pr.status === 401);
  pr = await fetch(BASE + "/portal/paystack.php", { method: "POST", headers: { "x-paystack-signature": crypto.createHmac("sha512", "sk_test_fake").update(hook).digest("hex") }, body: hook });
  ok("signed webhook records the payment", pr.status === 200 && one(`SELECT status FROM invoices WHERE id = ${inv3.id}`).status === "paid");

  // ---------- staged billing ----------
  r = await admin("project_save", { client_id: cid, title: "Shop website", status: "design", progress: 20 });
  const pid = one("SELECT id FROM projects WHERE title = 'Shop website'").id;
  r = await admin("approval_request", { project_id: pid, title: "Homepage design", details: "", bill_amount: 15000 });
  ok("approval with a stage payment", r.s === 200, r.j);
  const ap = one("SELECT id FROM approvals WHERE title = 'Homepage design'");
  r = await client("approval_decide", { id: ap.id, decision: "approved" });
  const stageInv = one("SELECT * FROM invoices WHERE description LIKE 'Stage payment: Homepage design%'");
  ok("approving creates the stage invoice", r.s === 200 && stageInv && +stageInv.amount === 15000, stageInv);
  r = await client("approval_decide", { id: ap.id, decision: "approved" });
  ok("no second stage invoice", r.s === 404 && one("SELECT COUNT(*) AS n FROM invoices WHERE description LIKE 'Stage payment:%'").n == 1);

  // ---------- client file uploads ----------
  const up = new FormData();
  up.append("project_id", pid);
  up.append("file", new Blob(["logo"], { type: "image/png" }), "logo.png");
  r = await client("file_upload", up);
  ok("client uploads a file to their project", r.s === 200 && one("SELECT uploaded_by FROM files ORDER BY id DESC LIMIT 1").uploaded_by === "client", r.j);
  await admin("client_save", { name: "Other Client", email: "other@example.com", phone: "" });
  const other = await login("other@example.com");
  const up2 = new FormData();
  up2.append("project_id", pid);
  up2.append("file", new Blob(["x"], { type: "image/png" }), "x.png");
  r = await other("file_upload", up2);
  ok("clients can’t upload to someone else’s project", r.s === 404);
  const up3 = new FormData();
  up3.append("project_id", pid);
  up3.append("file", new Blob(["<?php echo 1;"], { type: "text/plain" }), "shell.php");
  r = await client("file_upload", up3);
  ok("a .php upload is refused", r.s === 400);

  // ---------- leads from the website ----------
  const lead = new FormData();
  lead.append("name", "Peter Otieno"); lead.append("email", "peter@example.com"); lead.append("phone", "0733111222");
  lead.append("message", "I need a school website"); lead.append("_source", "Booking");
  let lr = await fetch(BASE + "/portal/lead.php", { method: "POST", body: lead });
  ok("website enquiry becomes a lead", lr.status === 200 && (await lr.json()).ok === true && one("SELECT COUNT(*) AS n FROM leads WHERE email = 'peter@example.com'").n == 1);
  lr = await fetch(BASE + "/portal/lead.php", { method: "POST", body: lead });
  ok("a repeat enquiry is added to the same lead", one("SELECT COUNT(*) AS n FROM leads WHERE email = 'peter@example.com'").n == 1);
  const spam = new FormData(); spam.append("name", "Bot"); spam.append("email", "bot@example.com"); spam.append("_gotcha", "x");
  lr = await fetch(BASE + "/portal/lead.php", { method: "POST", body: spam });
  ok("spam (honeypot) is ignored", lr.status === 200 && one("SELECT COUNT(*) AS n FROM leads WHERE email = 'bot@example.com'").n == 0);
  const empty = new FormData(); empty.append("name", "No contact");
  lr = await fetch(BASE + "/portal/lead.php", { method: "POST", body: empty });
  ok("a lead needs an email or phone", lr.status === 400);
  const leadId = one("SELECT id FROM leads WHERE email = 'peter@example.com'").id;
  r = await admin("lead_status", { id: leadId, status: "contacted" });
  ok("move a lead", r.s === 200 && one(`SELECT status FROM leads WHERE id = ${leadId}`).status === "contacted");

  clearMail();
  const cb = new FormData(); cb.append("name", "Kelvin Test"); cb.append("phone", "0756781458"); cb.append("best_time", "Evening"); cb.append("_source", "Call-back request");
  lr = await fetch(BASE + "/portal/lead.php", { method: "POST", body: cb, headers: { Accept: "application/json" } });
  ok("chat call-back is saved and answers ok", lr.status === 200 && (await lr.json()).ok === true && one("SELECT COUNT(*) AS n FROM leads WHERE phone = '0756781458'").n == 1);
  ok("call-back emailed to the team at once", subjects().some((x) => /^CALL BACK: Kelvin Test \(0756781458\)/.test(x)), subjects());

  // ---------- AI chat (Claude, through the official SDK) ----------
  let cr2 = await (await fetch(BASE + "/portal/chat.php")).json();
  ok("chat reports AI switched on", cr2.enabled === true, cr2);
  let ch = await fetch(BASE + "/portal/chat.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "assistant", content: "Hi!" }, { role: "user", content: "How much is an online shop?" }] }) });
  let cj = await ch.json();
  ok("AI answer returned as plain text", ch.status === 200 && cj.reply.startsWith("We build websites") && !cj.reply.includes("**") && !cj.reply.includes("LINK:"), cj);
  ok("only links from the knowledge base are kept", JSON.stringify(cj.links) === JSON.stringify([["See packages & prices", "pricing"]]), cj.links);
  const sent = JSON.parse(fs.readFileSync(WORK + "/fake/claude-last.json", "utf8"));
  ok("request uses claude-opus-5 with low effort", sent.body.model === "claude-opus-5" && sent.body.output_config.effort === "low", sent.body.output_config);
  ok("system prompt holds the knowledge base and is cached", sent.body.system[0].cache_control.type === "ephemeral" && sent.body.system[0].text.includes("KSh 1,500/month"));
  ok("conversation starts with the visitor", sent.body.messages[0].role === "user" && sent.body.messages.length === 1);
  ok("refusal fallbacks switched on", sent.body.fallbacks === "default" && /server-side-fallback-2026-07-01/.test(sent.headers["anthropic-beta"]), sent.headers);
  fs.writeFileSync(WORK + "/fake/claude-mode", "overloaded");
  ch = await fetch(BASE + "/portal/chat.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }) });
  ok("when Claude is busy the page is told to use its own answers", ch.status === 503);
  fs.writeFileSync(WORK + "/fake/claude-mode", "ok");
  ch = await fetch(BASE + "/portal/chat.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [] }) });
  ok("empty chat is refused", ch.status === 400);
  for (let i = 0; i < 4; i++) ch = await fetch(BASE + "/portal/chat.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }) });
  ok("each visitor has an hourly limit", ch.status === 429);

  // ---------- online quotes ----------
  r = await admin("quote_save", { lead_id: leadId, client_name: "Peter Otieno", client_email: "peter@example.com", client_phone: "0733111222", title: "School website",
    items: [{ desc: "Design and build", qty: 1, price: 40000 }, { desc: "Hosting (1 year)", qty: 1, price: 5000 }], deposit_percent: 50, valid_until: "", notes: "Four weeks." });
  ok("quote saved with a private link", r.s === 200 && /quote\.php\?t=[a-f0-9]{48}$/.test(r.j.link), r.j);
  const qt = one("SELECT * FROM quotes ORDER BY id DESC LIMIT 1");
  ok("quote total worked out on the server", +qt.total === 45000);
  ok("lead moves to Quoted", one(`SELECT status FROM leads WHERE id = ${leadId}`).status === "quoted");
  clearMail();
  r = await admin("quote_send", { id: qt.id });
  ok("quote emailed", r.s === 200 && subjects().some((x) => /Your quote from Marzley Tech/.test(x)));
  let page = await (await fetch(BASE + "/portal/quote.php?t=" + qt.token)).text();
  ok("quote page shows the items and total", page.includes("Design and build") && page.includes("KSh 45,000") && page.includes("KRA PIN P051234567X"));
  let post = await fetch(BASE + "/portal/quote.php", { method: "POST", body: new URLSearchParams({ t: qt.token, accept_name: "Peter Otieno" }) });
  ok("accepting needs the terms box", (await post.text()).includes("Please tick the box"));
  post = await fetch(BASE + "/portal/quote.php", { method: "POST", body: new URLSearchParams({ t: qt.token, accept_name: "Peter Otieno", agree: "1" }), redirect: "manual" });
  const acc = one(`SELECT * FROM quotes WHERE id = ${qt.id}`);
  const peter = one("SELECT id FROM clients WHERE email = 'peter@example.com'");
  const dep = peter && one(`SELECT * FROM invoices WHERE client_id = ${peter.id}`);
  ok("accepting sets up client, project and deposit", post.status === 303 && acc.status === "accepted" && peter && dep && +dep.amount === 22500, { acc, dep });
  ok("lead marked Won", one(`SELECT status FROM leads WHERE id = ${leadId}`).status === "won");
  await fetch(BASE + "/portal/quote.php", { method: "POST", body: new URLSearchParams({ t: qt.token, accept_name: "Peter Otieno", agree: "1" }), redirect: "manual" });
  ok("accepting twice does nothing more", one("SELECT COUNT(*) AS n FROM projects WHERE title = 'School website'").n == 1);
  r = await admin("quote_save", { id: qt.id, client_name: "x", client_email: "x@example.com", title: "x", items: [{ desc: "a", qty: 1, price: 1 }], deposit_percent: 0 });
  ok("accepted quotes can’t be edited", r.s === 400);
  page = await (await fetch(BASE + "/portal/quote.php?t=" + "0".repeat(48))).text();
  ok("unknown quote link shows a friendly page", page.includes("couldn’t find this quote"));

  // ---------- domains, renewals and monitoring ----------
  const in20 = new Date(Date.now() + 20 * 864e5).toISOString().slice(0, 10);
  r = await admin("domain_save", { client_id: cid, name: "wanjikusupplies.co.ke", kind: "domain", expires_on: in20, renew_price: 1500, auto_invoice: true, monitor_url: "", notes: "" });
  ok("track a domain", r.s === 200, r.j);
  r = await admin("domain_save", { client_id: cid, name: "bad", kind: "domain", expires_on: in20, monitor_url: "http://127.0.0.1/" });
  ok("monitoring private addresses is refused", r.s === 400);
  const dom = one("SELECT id FROM domains WHERE name = 'wanjikusupplies.co.ke'");
  sql(`UPDATE domains SET monitor_url = 'http://127.0.0.1:8899/' WHERE id = ${dom.id}`);
  sql(`INSERT INTO domains (client_id, name, kind, expires_on, renew_price, auto_invoice, monitor_url, notes, created_at) VALUES (${cid}, 'down.example', 'hosting', '2030-01-01', 0, 0, 'http://127.0.0.1:1/', '', datetime('now'))`);
  clearMail();
  cron("monitor");
  cron("monitor");
  ok("site down twice in a row alerts you", subjects().some((x) => /^DOWN: down\.example/.test(x)), subjects());
  ok("working site recorded as up", one(`SELECT last_status FROM domains WHERE id = ${dom.id}`).last_status === "up");
  clearMail();
  cron("daily");
  ok("renewal invoice created 30 days before", one("SELECT COUNT(*) AS n FROM invoices WHERE description LIKE 'Renewal: wanjikusupplies.co.ke%'").n == 1);
  ok("client told about the renewal", subjects().some((x) => /wanjikusupplies\.co\.ke renews on/.test(x)), subjects());
  cron("daily");
  ok("renewal invoice not repeated", one("SELECT COUNT(*) AS n FROM invoices WHERE description LIKE 'Renewal:%'").n == 1);
  r = await admin("domain_renewed", { id: dom.id });
  ok("renewed moves expiry a year on", r.s === 200 && r.j.expires_on > in20, r.j);
  r = await admin("data");
  ok("uptime figures for care reports", (r.j.uptime || []).some((u) => +u.domain_id === +dom.id && +u.checks >= 2), r.j.uptime);

  // ---------- after-launch feedback ----------
  clearMail();
  await admin("project_save", { id: pid, client_id: cid, title: "Shop website", status: "live", progress: 100 });
  const fb = one(`SELECT * FROM feedback WHERE project_id = ${pid}`);
  ok("going live asks the client for a rating", fb && subjects().some((x) => /is live! How did we do\?/.test(x)));
  r = await client("data");
  ok("portal shows the rating prompt", r.j.me.feedback && r.j.me.feedback.link.includes(fb.token));
  post = await fetch(BASE + "/portal/feedback.php", { method: "POST", body: new URLSearchParams({ t: fb.token, rating: "2", comment: "Slow replies" }), redirect: "manual" });
  ok("low rating goes privately to you", post.status === 303 && subjects().some((x) => /^Needs attention: .*2\/5/.test(x)), subjects());
  page = await (await fetch(BASE + "/portal/feedback.php?t=" + fb.token)).text();
  ok("low rating thanks them without the review button", page.includes("Thank you for telling us") && !page.includes("Leave a Google review"));

  // ---------- staff accounts ----------
  r = await admin("staff_save", { name: "Grace Support", email: "grace@example.com", perms: ["support"] });
  ok("owner adds a staff member", r.s === 200, r.j);
  r = await client("staff_save", { name: "x", email: "x@example.com", perms: ["money"] });
  ok("clients can’t add staff", r.s === 403);
  const grace = await login("grace@example.com");
  r = await grace("data");
  ok("staff see no money", r.s === 200 && r.j.invoices.length === 0 && r.j.audit === undefined && r.j.me.perms.join() === "support", r.j.me);
  r = await grace("invoice_save", { client_id: cid, description: "x", amount: 1, status: "unpaid" });
  ok("staff without money access can’t invoice", r.s === 403);
  r = await grace("export", undefined, { query: "&type=activity" });
  ok("staff can’t read the activity log", r.s === 403);
  r = await grace("ticket_open", { client_id: cid, subject: "Checking in", message: "How is everything?" });
  ok("support staff can message clients", r.s === 200, r.j);
  const staffId = one("SELECT id FROM staff WHERE email = 'grace@example.com'").id;
  await admin("delete", { type: "staff", id: staffId });
  r = await grace("data");
  ok("removed staff are signed out at once", r.s === 401);

  // ---------- exports ----------
  r = await admin("export", undefined, { query: "&type=receipts" });
  ok("payments-received CSV", r.s === 200 && r.text.includes("RCP0000002") && r.text.includes("BANK-001"));
  sql(`UPDATE clients SET name = '=HYPERLINK(1)' WHERE id = ${cid}`);
  r = await admin("export", undefined, { query: "&type=clients" });
  ok("spreadsheet formulas are neutralised", r.text.includes("'=HYPERLINK(1)"));
  sql(`UPDATE clients SET name = 'Wanjiku Supplies' WHERE id = ${cid}`);

  // ---------- sign out everywhere ----------
  const admin2 = await login("admin@example.com");
  r = await admin2("logout_all", {});
  r = await admin("data");
  ok("sign out everywhere ends other sessions", r.s === 401 && /all devices/.test(r.j.error));

  // ---------- round 4: website payments, referrals, reviews, mailing list, chat log, code sign-in ----------
  const admin3 = await login("admin@example.com");
  // referrer joins on the website
  let fr = new FormData(); fr.append("name", "Mercy Referrer"); fr.append("phone", "0711223344");
  let rr = await (await fetch(BASE + "/portal/refer.php", { method: "POST", body: fr })).json();
  ok("referrer sign-up saved with their code", rr.ok && /^MT[0-9A-Z]+$/.test(rr.code), rr);
  const code = rr.code;
  // website deposit (as stkpush.php records it), paid through the callback
  sql(`INSERT INTO site_payments (checkout_id, purpose, plan, amount, phone, name, referred_by, status, created_at) VALUES ('ws_SITE1', 'deposit', '', 5000, '0722555666', 'Amani Bakery', '${code}', 'pending', datetime('now'))`);
  clearMail();
  await callback("ws_SITE1", 5000, "SITE000001");
  await sleep(400);
  const sp1 = one("SELECT * FROM site_payments WHERE checkout_id = 'ws_SITE1'");
  ok("website deposit recorded as paid", sp1.status === "paid" && sp1.receipt === "SITE000001", sp1);
  ok("team emailed about the website payment", subjects().some((x) => /^Payment received: KSh 5,000 from Amani Bakery/.test(x)), subjects());
  const bakery = one("SELECT * FROM leads WHERE phone = '0722555666'");
  ok("website payment put on the Leads board as Won", bakery && bakery.status === "won" && +bakery.value === 5000, bakery);
  ok("referral recorded, reward waits until the work is done", one(`SELECT COUNT(*) AS n FROM referrals WHERE code = '${code}' AND status = 'pending'`).n == 1 && subjects().some((x) => /^Referral: Amani Bakery paid/.test(x)) && !subjects().some((x) => /^Referral reward due/.test(x)));
  sql(`INSERT INTO site_payments (checkout_id, purpose, amount, phone, name, status, created_at) VALUES ('ws_SITE2', 'deposit', 5000, '0722555777', 'Short Payer', 'pending', datetime('now'))`);
  await callback("ws_SITE2", 100, "SITE000002");
  await sleep(300);
  ok("underpaid website deposit is not announced", one("SELECT status FROM site_payments WHERE checkout_id = 'ws_SITE2'").status === "pending");
  sql(`INSERT INTO site_payments (checkout_id, purpose, amount, phone, name, status, created_at) VALUES ('ws_DEMO1', 'demo', 1, '0722555888', '', 'pending', datetime('now'))`);
  clearMail();
  await callback("ws_DEMO1", 1, "DEMO000001");
  await sleep(300);
  ok("demo payments are recorded quietly", one("SELECT status FROM site_payments WHERE checkout_id = 'ws_DEMO1'").status === "paid" && !subjects().some((x) => /Payment received/.test(x)));
  // attach the deposit to a client account
  r = await admin3("client_save", { name: "Amani Bakery", email: "amani@example.com", phone: "0722555666" });
  const amani = one("SELECT id FROM clients WHERE email = 'amani@example.com'").id;
  r = await admin3("site_payment_link", { id: sp1.id, client_id: amani });
  const amInv = one(`SELECT * FROM invoices WHERE client_id = ${amani}`);
  ok("website payment attached as a paid invoice with its M-Pesa code", r.s === 200 && amInv.status === "paid" && amInv.mpesa_receipt === "SITE000001", amInv);
  ok("attaching the payment links the referral to the client", +one("SELECT client_id FROM referrals WHERE referred_name = 'Amani Bakery'").client_id === +amani);
  r = await admin3("referral_paid", { id: one("SELECT id FROM referrals WHERE status = 'pending'").id, note: "EARLY" });
  ok("a reward can't be paid before the work is done", r.s === 404);
  clearMail();
  r = await admin3("referral_ready", { id: one("SELECT id FROM referrals WHERE status = 'pending'").id });
  ok("“Work done” makes the reward due and emails the team", r.s === 200 && one("SELECT status FROM referrals").status === "due" && subjects().some((x) => /^Referral reward due/.test(x)));
  r = await admin3("referral_paid", { id: one("SELECT id FROM referrals WHERE status = 'due'").id, note: "RWD1234567" });
  ok("referral reward marked paid", r.s === 200 && one("SELECT status FROM referrals").status === "paid");
  // referral through a lead that becomes a client and pays an invoice
  let lf = new FormData(); lf.append("name", "Juma Hardware"); lf.append("phone", "0733444555"); lf.append("email", "juma@example.com"); lf.append("referred_by", code); lf.append("_source", "Contact form");
  await fetch(BASE + "/portal/lead.php", { method: "POST", body: lf });
  const jl = one("SELECT * FROM leads WHERE email = 'juma@example.com'");
  ok("referral code kept on the lead", jl.referred_by === code, jl);
  r = await admin3("quick_start", { name: "Juma Hardware", email: "juma@example.com", phone: "0733444555", title: "Shop site", total: 20000, deposit_percent: 50, due_days: 7, lead_id: jl.id });
  const jInv = one(`SELECT * FROM invoices WHERE number = '${r.j.invoice}'`);
  await admin3("payment_record", { invoice_id: jInv.id, amount: 10000, method: "mpesa", reference: "JUMA000001" });
  ok("client's first payment records the referral (work in progress)", one(`SELECT COUNT(*) AS n FROM referrals WHERE referred_name = 'Juma Hardware' AND status = 'pending'`).n == 1);
  const jumaId = one("SELECT id FROM clients WHERE email = 'juma@example.com'").id;
  const jProj = one(`SELECT * FROM projects WHERE client_id = ${jumaId}`);
  r = await admin3("project_save", { id: jProj.id, client_id: jumaId, title: jProj.title, status: "live", progress: 100 });
  ok("marking the project Live makes the reward due", r.s === 200 && one(`SELECT status FROM referrals WHERE referred_name = 'Juma Hardware'`).status === "due", r.j);
  let self = new FormData(); self.append("name", "Mercy Referrer"); self.append("phone", "0711223344"); self.append("email", "mercy@example.com"); self.append("referred_by", code);
  await fetch(BASE + "/portal/lead.php", { method: "POST", body: self });
  const ml = one("SELECT * FROM leads WHERE email = 'mercy@example.com'");
  r = await admin3("quick_start", { name: "Mercy", email: "mercy@example.com", phone: "0711223344", title: "Blog", total: 2000, deposit_percent: 100, due_days: 1, lead_id: ml.id });
  await admin3("payment_record", { invoice_id: one(`SELECT id FROM invoices WHERE number = '${r.j.invoice}'`).id, amount: 2000, method: "cash", reference: "" });
  ok("self-referrals earn nothing", one("SELECT COUNT(*) AS n FROM referrals WHERE referred_name = 'Mercy'").n == 0);

  // client dashboard: client ID, referral code, referrals and their status, requests, profile
  const mercy = await login("mercy@example.com");
  r = await mercy("data");
  const mme = r.j.me;
  ok("client sees their client ID and referral code", /^MT-\d{4}$/.test(mme.client_code) && mme.ref_code === code, mme);
  const byName = (n) => mme.referrals.find((x) => x.name.indexOf(n) === 0);
  ok("referrer sees who they referred, with client ID and status", byName("Amani") && byName("Amani").stage === "reward_paid" && /^MT-\d{4}$/.test(byName("Amani").client_code) &&
    byName("Juma") && byName("Juma").stage === "reward_due" && byName("Juma").reward === 2000, mme.referrals);
  ok("referred people's names are shortened", byName("Juma").name === "Juma H.");
  const friend = session();
  r = await friend("dev_login", { email: "friend.of.mercy@example.com", ref: code });
  ok("signing up through a referral link remembers the referrer", one("SELECT referred_by FROM clients WHERE email = 'friend.of.mercy@example.com'").referred_by === code);
  r = await mercy("data");
  ok("a new sign-up shows as “signed up” for the referrer", r.j.me.referrals.some((x) => x.stage === "signed_up" && /^MT-\d{4}$/.test(x.client_code)));
  r = await friend("project_request", { service: "Website", budget: "KSh 15,000 – 40,000", timeline: "Within a month", details: "A site for my salon with booking." });
  ok("a client can request a project", r.s === 200 && one("SELECT COUNT(*) AS n FROM leads WHERE source = 'Portal request' AND email = 'friend.of.mercy@example.com'").n == 1);
  r = await friend("data");
  ok("the request shows in their dashboard", r.j.me.requests.length === 1 && r.j.me.requests[0].status === "new");
  r = await admin3("project_request", { service: "Website", details: "x" });
  ok("only clients request projects", r.s === 403);
  r = await friend("profile_save", { name: "Faith Friend", phone: "12" });
  ok("profile rejects a bad phone number", r.s === 400);
  const friendCode = one("SELECT ref_code FROM clients WHERE email = 'friend.of.mercy@example.com'").ref_code;
  r = await friend("profile_save", { name: "Faith Friend", phone: "0799 111 222" });
  const fr2 = one("SELECT * FROM clients WHERE email = 'friend.of.mercy@example.com'");
  ok("profile saved; their referral code stays the same", r.s === 200 && fr2.name === "Faith Friend" && fr2.phone === "0799111222" && fr2.ref_code === friendCode && /^MC/.test(friendCode));

  // chat questions log (personal details removed)
  await fetch(BASE + "/portal/chat-log.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: "Do you do drone videos? call me 0712 345 678 or me@x.com" }) });
  await fetch(BASE + "/portal/chat-log.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: "Do you do drone videos? call me 0712 345 678 or me@x.com" }) });
  const cq = one("SELECT * FROM chat_questions");
  ok("unanswered chat question saved without personal details", cq && cq.question === "Do you do drone videos? call me [number] or [email]" && +cq.times === 2, cq);

  // reviews for the website
  await admin3("project_save", { client_id: amani, title: "Bakery site", status: "planning", progress: 0 });
  const bp = one("SELECT id FROM projects WHERE title = 'Bakery site'").id;
  await admin3("project_save", { id: bp, client_id: amani, title: "Bakery site", status: "live", progress: 100 });
  const bfb = one(`SELECT * FROM feedback WHERE project_id = ${bp}`);
  await fetch(BASE + "/portal/feedback.php", { method: "POST", body: new URLSearchParams({ t: bfb.token, rating: "5", comment: "Our orders doubled!", publish_ok: "1" }), redirect: "manual" });
  let tj = await (await fetch(BASE + "/portal/testimonials.php")).json();
  ok("reviews stay hidden until approved", tj.reviews.length === 0);
  r = await admin3("feedback_publish", { id: bfb.id, published: true });
  tj = await (await fetch(BASE + "/portal/testimonials.php")).json();
  ok("approved review appears on the website", r.s === 200 && tj.reviews.length === 1 && tj.reviews[0].comment === "Our orders doubled!" && tj.reviews[0].rating === 5, tj);
  const low = one("SELECT id FROM feedback WHERE rating <= 3 LIMIT 1");
  if (low) { r = await admin3("feedback_publish", { id: low.id, published: true }); ok("low ratings can't be published", r.s === 400); }

  // mailing list
  clearMail();
  let sf = new FormData(); sf.append("email", "reader@example.com");
  let sj = await (await fetch(BASE + "/portal/subscribe.php", { method: "POST", body: sf })).json();
  const conf = (fs.readFileSync(WORK + "/mail.txt", "utf8").match(/subscribe\.php\?c=([a-f0-9]{48})/) || [])[1];
  ok("sign-up sends a confirmation link", sj.ok && conf && one("SELECT status FROM subscribers WHERE email = 'reader@example.com'").status === "pending");
  await fetch(BASE + "/portal/subscribe.php?c=" + conf);
  ok("confirming subscribes them", one("SELECT status FROM subscribers WHERE email = 'reader@example.com'").status === "subscribed");
  clearMail();
  r = await admin3("campaign_send", { subject: "November class", body: "A new class starts soon.", audience: ["clients"] });
  const sentTo = [...fs.readFileSync(WORK + "/mail.txt", "utf8").matchAll(/^To: <?([^>\s]+)>?/gm)].map((m) => m[1]);
  ok("newsletter goes to subscribers and chosen clients", r.s === 200 && sentTo.includes("reader@example.com") && sentTo.includes("amani@example.com"), { r: r.j, sentTo });
  ok("every newsletter has an unsubscribe link", /Unsubscribe: .*subscribe\.php\?u=[a-f0-9]{48}/.test(fs.readFileSync(WORK + "/mail.txt", "utf8")));
  const unsub = fs.readFileSync(WORK + "/mail.txt", "utf8").match(/To: <?amani@example\.com[\s\S]*?subscribe\.php\?u=([a-f0-9]{48})/)[1];
  await fetch(BASE + "/portal/subscribe.php?u=" + unsub);
  clearMail();
  await admin3("campaign_send", { subject: "Second", body: "Hello again.", audience: ["clients"] });
  ok("unsubscribed people aren't emailed again", !/amani@example\.com/.test(fs.readFileSync(WORK + "/mail.txt", "utf8")));

  // sign in with a one-time code
  clearMail();
  const anon = session();
  r = await anon("code_request", { who: "0799000999" });
  ok("an unknown phone number gets the same answer and no message", r.s === 200 && /If that matches/.test(r.j.message) && fs.readFileSync(WORK + "/mail.txt", "utf8") === "");

  // anyone can create an account with their email
  const newbie = session();
  r = await newbie("code_request", { who: "New.Person@example.com" });
  const newCode = (fs.readFileSync(WORK + "/mail.txt", "utf8").match(/sign-in code is (\d{6})/) || [])[1];
  ok("a new email gets a sign-up code", r.s === 200 && !!newCode && !one("SELECT id FROM clients WHERE email = 'new.person@example.com'"));
  r = await newbie("code_verify", { who: "new.person@example.com", code: newCode === "000000" ? "111111" : "000000", name: "New Person" });
  ok("wrong sign-up code refused, no account made", r.s === 401 && !one("SELECT id FROM clients WHERE email = 'new.person@example.com'"));
  r = await newbie("code_verify", { who: "new.person@example.com", code: newCode, name: "Neema Wanjiru" });
  ok("right code creates a client account and signs in", r.s === 200 && r.j.user.role === "client" && one("SELECT name FROM clients WHERE email = 'new.person@example.com'").name === "Neema Wanjiru");
  r = await newbie("data");
  ok("the new client sees an empty account of their own", r.s === 200 && r.j.projects.length === 0 && r.j.invoices.length === 0 && r.j.clients.length === 0);
  ok("the owner is told about the new account", subjects().some((x) => /New portal account: Neema Wanjiru/.test(x)));
  const gnew = session();
  r = await gnew("dev_login", { email: "google.person@example.com" });
  ok("signing in with a new Google account creates a client account", r.s === 200 && r.j.user.role === "client" && !!one("SELECT id FROM clients WHERE email = 'google.person@example.com'"));
  clearMail();
  r = await anon("code_request", { who: "AMANI@example.com" });
  const mailed = fs.readFileSync(WORK + "/mail.txt", "utf8");
  const theCode = (mailed.match(/sign-in code is (\d{6})/) || [])[1];
  ok("client gets a 6-digit code by email", !!theCode);
  r = await anon("code_verify", { who: "amani@example.com", code: theCode === "000000" ? "111111" : "000000" });
  ok("wrong code refused", r.s === 401);
  r = await anon("code_verify", { who: "amani@example.com", code: theCode });
  ok("right code signs the client in", r.s === 200 && r.j.user.email === "amani@example.com" && r.j.user.role === "client");
  r = await anon("data");
  ok("signed-in client sees their own account", r.s === 200 && r.j.invoices.every((i) => +i.client_id === +amani));
  const anon2 = session();
  r = await anon2("code_verify", { who: "amani@example.com", code: theCode });
  ok("a code works only once", r.s === 401);
  r = await anon2("code_request", { who: "0722555666" });
  ok("code can be requested with a phone number", r.s === 200);

  // ---------- learning hub: free tutorials and notes, videos unlocked with M-Pesa ----------
  {
    const L = { api: BASE + "/portal/learn.php?action=" };
    const lget = (s, action, query) => s(action, undefined, Object.assign({ query }, L));
    const lpost = (s, action, body, extra) => s(action, body, Object.assign({}, L, extra || {}));
    const guest = session();
    const boss = await login("admin@example.com");
    const cl = await login("client@example.com");
    r = await lget(guest, "catalog");
    const lessonCount = r.j.tracks.reduce((n, t) => n + t.lessons.length, 0);
    ok("tutorials are there (coding, networking, making money online and more)", r.s === 200 && r.j.tracks.slice(0, 5).map((t) => t.slug).join() === "html,css,javascript,python,sql" &&
      ["networking", "make-money-online", "linux", "git", "php", "cybersecurity"].every((x) => r.j.tracks.some((t) => t.slug === x)) && lessonCount >= 100, r.j.tracks.map((t) => t.slug));
    // a newer tutorials file adds what's missing but never overwrites lessons edited in the portal
    sql("UPDATE learn_lessons SET title = 'My own intro' WHERE slug = 'introduction' AND track_id = (SELECT id FROM learn_tracks WHERE slug = 'html')");
    sql("DELETE FROM learn_lessons WHERE track_id = (SELECT id FROM learn_tracks WHERE slug = 'networking')");
    sql("DELETE FROM learn_tracks WHERE slug = 'networking'");
    sql("UPDATE settings SET v = '1' WHERE k = 'learn_seed_version'");
    r = await lget(guest, "catalog");
    const netTrack = r.j.tracks.find((t) => t.slug === "networking");
    ok("new subjects are added to an existing site automatically", netTrack && netTrack.lessons.some((l) => l.slug === "cidr"));
    ok("lessons edited in the portal are kept", one("SELECT title FROM learn_lessons WHERE slug = 'introduction' AND track_id = (SELECT id FROM learn_tracks WHERE slug = 'html')").title === "My own intro");
    r = await lget(guest, "lesson", "&track=networking&slug=cidr");
    ok("the CIDR lesson has its calculator and practice questions", r.s === 200 && /```tool-cidr/.test(r.j.lesson.body) && /```quiz/.test(r.j.lesson.body));
    r = await lget(guest, "lesson", "&track=python&slug=introduction");
    ok("a lesson is free to read without signing in", r.s === 200 && /```try-python/.test(r.j.lesson.body));
    sql("UPDATE learn_lessons SET published = 0 WHERE slug = 'semantic'");
    r = await lget(guest, "lesson", "&track=html&slug=semantic");
    ok("hidden lessons can’t be read", r.s === 404);
    r = await lget(guest, "me");
    ok("visitors aren’t signed in", r.s === 200 && r.j.learner === null && !r.j.editor);
    r = await lpost(guest, "progress", { lesson_id: 1 });
    ok("saving progress needs an account", r.s === 401);

    // anyone can sign up with an email code
    clearMail();
    const stu = session();
    await lget(stu, "me");
    r = await lpost(stu, "code_request", { email: "Student@Example.com" });
    const lcode = (fs.readFileSync(WORK + "/mail.txt", "utf8").match(/learning hub sign-in code is (\d{6})/) || [])[1];
    ok("learner gets a sign-up code by email", r.s === 200 && !!lcode);
    r = await lpost(stu, "code_verify", { email: "student@example.com", code: lcode === "000000" ? "111111" : "000000" });
    ok("wrong learner code refused", r.s === 401);
    r = await lpost(stu, "code_verify", { email: "student@example.com", code: lcode, name: "Achieng Otieno" });
    ok("right code creates the learner account", r.s === 200 && r.j.learner.email === "student@example.com" && one("SELECT name FROM learners WHERE email = 'student@example.com'").name === "Achieng Otieno");
    r = await lpost(stu, "progress", { lesson_id: 3 });
    r = await lget(stu, "me");
    ok("lesson progress is saved to the account", r.j.progress.includes(3));
    r = await stu("data");
    ok("a learner is not a portal client", r.s === 401);
    const noCsrf = await fetch(L.api + "progress", { method: "POST", headers: { "Content-Type": "application/json", Cookie: "" }, body: "{}" });
    ok("learner changes need the CSRF token", noCsrf.status === 403);

    // the owner uploads a video in pieces, and a PDF
    const webm = Buffer.concat([Buffer.from([0x1a, 0x45, 0xdf, 0xa3]), Buffer.alloc(3000, 7)]);
    r = await lpost(cl, "upload_start", { kind: "video", name: "x.webm", size: 10, title: "x" });
    ok("clients can’t upload to the learning hub", r.s === 403);
    r = await lpost(boss, "upload_start", { kind: "video", name: "lesson.exe", size: 10, title: "x" });
    ok("only MP4/WebM videos accepted", r.s === 400, r.j);
    r = await lpost(boss, "upload_start", { kind: "video", name: "HTML basics.webm", size: webm.length, title: "HTML basics", summary: "Build a page", price: 50, published: true, duration: 600 });
    const tok = r.j.token;
    ok("video upload starts", r.s === 200 && !!tok, r.j);
    r = await lpost(boss, "upload_chunk", undefined, { query: `&token=${tok}&offset=0`, raw: webm.subarray(0, 1000) });
    ok("first piece received", r.s === 200 && r.j.received === 1000, r.j);
    r = await lpost(boss, "upload_chunk", undefined, { query: `&token=${tok}&offset=0`, raw: webm.subarray(0, 1000) });
    ok("a repeated piece is refused and says where to carry on", r.s === 409 && r.j.received === 1000);
    r = await lpost(boss, "upload_finish", { token: tok });
    ok("an unfinished upload can’t be saved", r.s === 400);
    r = await lpost(boss, "upload_chunk", undefined, { query: `&token=${tok}&offset=1000`, raw: webm.subarray(1000) });
    r = await lpost(boss, "upload_finish", { token: tok });
    const vid = r.j && r.j.id;
    ok("video saved when every piece arrived", r.s === 200 && vid > 0 && one(`SELECT size FROM learn_videos WHERE id = ${vid}`).size == webm.length);
    r = await lpost(boss, "upload_start", { kind: "video", name: "fake.mp4", size: 20, title: "Fake" });
    await lpost(boss, "upload_chunk", undefined, { query: `&token=${r.j.token}&offset=0`, raw: Buffer.from("this is not a video!") });
    r = await lpost(boss, "upload_finish", { token: r.j.token });
    ok("a file that isn’t really a video is rejected", r.s === 400);
    const jpeg = "data:image/jpeg;base64," + Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(100)]).toString("base64");
    r = await lpost(boss, "poster_save", { id: vid, data: jpeg });
    ok("preview picture saved", r.s === 200);
    const pdf = Buffer.from("%PDF-1.4\n% test notes\n" + "x".repeat(200));
    r = await lpost(boss, "upload_start", { kind: "note", name: "Python notes.pdf", size: pdf.length, title: "Python notes", published: true });
    await lpost(boss, "upload_chunk", undefined, { query: `&token=${r.j.token}&offset=0`, raw: pdf });
    r = await lpost(boss, "upload_finish", { token: r.j.token });
    const nid = r.j && r.j.id;
    ok("PDF notes uploaded", r.s === 200 && nid > 0);

    // free notes: read in the browser or download
    r = await lget(guest, "notes");
    ok("notes are listed for everyone", r.j.notes.some((n) => n.id == nid));
    let fr = await fetch(L.api + "note&id=" + nid);
    ok("notes open in the browser without paying", fr.status === 200 && fr.headers.get("content-type") === "application/pdf" && /^inline/.test(fr.headers.get("content-disposition")));
    fr = await fetch(L.api + "note&id=" + nid + "&dl=1");
    ok("notes can be downloaded (and downloads are counted)", /^attachment/.test(fr.headers.get("content-disposition")) && one(`SELECT downloads FROM learn_notes WHERE id = ${nid}`).downloads == 1);

    // videos are locked until paid
    r = await lget(guest, "videos");
    const pv = r.j.videos.find((v) => v.id == vid);
    ok("videos are listed with their price, locked", pv && pv.price === 50 && pv.unlocked === false && pv.poster);
    fr = await fetch(L.api + "stream&id=" + vid);
    ok("a visitor can’t watch a locked video", fr.status === 403);
    r = await lget(stu, "stream", "&id=" + vid);
    ok("a learner can’t watch before paying", r.s === 403);
    r = await lpost(stu, "comment", { id: vid, body: "Hi" });
    ok("commenting needs the video unlocked", r.s === 403);
    r = await lpost(stu, "like", { id: vid });
    ok("liking needs the video unlocked", r.s === 403);
    r = await lget(boss, "stream", "&id=" + vid);
    ok("the owner can watch without paying", r.s === 200);

    // paying with M-Pesa
    r = await lpost(stu, "unlock", { id: vid, phone: "0712 345 678" });
    const stk1 = JSON.parse(fs.readFileSync(WORK + "/fake/stk-last.json", "utf8"));
    ok("unlock sends an M-Pesa prompt for the video price", r.s === 200 && r.j.checkout_id === stk1.id && stk1.body.Amount === 50 && stk1.body.PhoneNumber === "254712345678");
    await callback(r.j.checkout_id, 30, "LRNLOW0001");
    await sleep(300);
    r = await lget(stu, "unlock_status", "&checkout=" + r.j.checkout_id);
    ok("paying less doesn’t unlock the video", r.j.unlocked === false && r.j.status === "failed", r.j);
    r = await lpost(stu, "unlock", { id: vid, phone: "0712345678" });
    const co = r.j.checkout_id;
    r = await lget(guest, "unlock_status", "&checkout=" + co);
    ok("payment status is private to the learner", r.s === 401);
    await callback(co, 50, "LRN0000001");
    await sleep(300);
    r = await lget(stu, "unlock_status", "&checkout=" + co);
    ok("paying the full price unlocks the video", r.j.unlocked === true && r.j.status === "paid", r.j);
    r = await stu("stream", undefined, Object.assign({ query: "&id=" + vid, headers: { Range: "bytes=0-3" } }, L));
    ok("unlocked video streams, with seeking (byte ranges)", r.s === 206 && r.headers.get("content-range") === `bytes 0-3/${webm.length}` && r.headers.get("content-length") === "4");
    await stu("stream", undefined, Object.assign({ query: "&id=" + vid, headers: { Range: "bytes=4-" } }, L));
    ok("views counted once per person", one(`SELECT views FROM learn_videos WHERE id = ${vid}`).views == 1);
    const stu2 = session();
    await lpost(stu2, "dev_login", { email: "kamau@example.com", name: "Kamau Njoroge" });
    r = await lpost(stu2, "unlock", { id: vid, phone: "0722000111" });
    await callback(r.j.checkout_id, 50, "LRN0000001");
    await sleep(300);
    r = await lget(stu2, "unlock_status", "&checkout=" + r.j.checkout_id);
    ok("an M-Pesa code can’t unlock twice", r.j.unlocked === false);

    // likes and comments (only for people who unlocked)
    r = await lpost(stu, "like", { id: vid });
    ok("like", r.s === 200 && r.j.liked === true && r.j.likes === 1);
    r = await lpost(stu, "like", { id: vid });
    ok("like again to undo", r.j.liked === false && r.j.likes === 0);
    await lpost(stu, "like", { id: vid });
    r = await lpost(stu, "comment", { id: vid, body: "Very clear, thank you!" });
    ok("comment posted", r.s === 200);
    r = await lget(stu2, "video", "&id=" + vid);
    ok("people who haven’t unlocked see the count but not the comments", r.j.video.comments === 1 && r.j.video.comment_list.length === 0);
    sql(`INSERT INTO learn_unlocks (video_id, learner_id, amount, receipt, created_at) SELECT ${vid}, id, 50, 'MANUAL', datetime('now') FROM learners WHERE email = 'kamau@example.com'`);
    r = await lget(stu2, "video", "&id=" + vid);
    const cm = r.j.video.comment_list[0];
    ok("other unlocked learners see the comment, with a short name and no email", cm && cm.body === "Very clear, thank you!" && cm.name === "Achieng O." && !JSON.stringify(r.j).includes("student@example.com") && cm.mine === false);
    r = await lpost(stu2, "comment_delete", { id: cm.id });
    ok("learners can’t delete other people’s comments", r.s === 404);
    r = await lpost(boss, "comment_hide", { id: cm.id, hidden: true });
    r = await lget(stu2, "video", "&id=" + vid);
    ok("the owner can hide a comment", r.j.video.comment_list.length === 0 && r.j.video.comments === 0);

    // likes, star ratings and comments on free lessons: anyone reads, learners post, the owner replies and moderates
    const lsn = one("SELECT l.id FROM learn_lessons l JOIN learn_tracks t ON t.id = l.track_id WHERE t.slug = 'python' AND l.slug = 'introduction'").id;
    r = await lpost(guest, "lesson_like", { lesson_id: lsn });
    ok("liking a lesson needs an account", r.s === 401);
    r = await lpost(stu, "lesson_like", { lesson_id: lsn });
    ok("lesson liked", r.s === 200 && r.j.liked === true && r.j.likes === 1);
    await lpost(stu2, "lesson_like", { lesson_id: lsn });
    r = await lpost(stu2, "lesson_like", { lesson_id: lsn });
    ok("like a lesson again to undo", r.j.liked === false && r.j.likes === 1);
    clearMail();
    r = await lpost(stu, "review", { lesson_id: lsn, body: "Great intro!", rating: 4 });
    ok("review posted", r.s === 200);
    ok("the owner is emailed about new reviews", /Achieng O. wrote \(4\/5 stars\)/.test(fs.readFileSync(WORK + "/mail.txt", "utf8")));
    r = await lpost(stu, "review", { lesson_id: lsn, body: "Changed my mind, it's perfect", rating: 5 });
    r = await lpost(stu, "review", { lesson_id: lsn, body: "x", rating: 9 });
    ok("ratings must be 1 to 5", r.s === 400);
    r = await lget(guest, "lesson_social", "&lesson_id=" + lsn);
    ok("everyone can read lesson reviews and likes, without emails", r.s === 200 && r.j.likes === 1 && r.j.reviews.length === 2 && r.j.reviews[0].name === "Achieng O." && !JSON.stringify(r.j).includes("student@example.com"));
    ok("one star rating per person counts", r.j.rating.count === 1 && r.j.rating.average === 5);
    const rvId = r.j.reviews[1].id;
    r = await lpost(boss, "review", { lesson_id: lsn, parent_id: rvId, body: "Thank you, keep going!" });
    r = await lget(stu2, "lesson_social", "&lesson_id=" + lsn);
    const rv = r.j.reviews.find((x) => x.id === rvId);
    ok("the owner’s reply shows under the review, marked as the tutor", rv.replies.length === 1 && rv.replies[0].staff === true && rv.replies[0].name === "Marzley Tech");
    r = await lpost(stu2, "review_delete", { id: rvId });
    ok("learners can’t delete other people’s reviews", r.s === 404);
    r = await lget(boss, "admin");
    ok("the owner sees every lesson review in the portal", r.j.reviews.some((x) => x.id === rvId && x.email === "student@example.com") && r.j.stats.reviews === 2 && r.j.stats.lesson_likes === 1);
    r = await lpost(boss, "review_hide", { id: rvId, hidden: true });
    r = await lget(guest, "lesson_social", "&lesson_id=" + lsn);
    ok("hidden reviews disappear for everyone else", r.j.reviews.length === 1);
    r = await lpost(boss, "review_delete", { id: rvId });
    ok("the owner can delete a review (and its replies go too)", r.s === 200 && one("SELECT COUNT(*) AS n FROM learn_reviews WHERE parent_id = " + rvId).n == 0);

    // managing
    r = await lget(boss, "admin");
    ok("hub dashboard shows income and learners", r.s === 200 && r.j.stats.revenue === 100 && r.j.stats.learners >= 2 && r.j.videos[0].unlocks === 2, r.j.stats);
    r = await lget(stu, "admin");
    ok("learners can’t open the hub dashboard", r.s === 401 || r.s === 403);
    r = await lpost(boss, "video_delete", { id: vid });
    ok("a paid-for video can’t be deleted (only hidden)", r.s === 400);
    r = await lpost(boss, "video_save", { id: vid, title: "HTML basics", summary: "", price: 80, published: false });
    r = await lget(guest, "videos");
    ok("hidden videos disappear from the list", !r.j.videos.some((v) => v.id == vid));
    r = await lget(stu, "stream", "&id=" + vid);
    ok("people who paid keep access to a hidden video", r.s === 200);
    r = await lget(guest, "video", "&id=" + vid);
    ok("hidden videos can’t be opened by anyone else", r.s === 404);
    r = await lpost(boss, "lesson_save", { id: 0, track_id: 1, title: "Audio and video", slug: "audio-video", position: 9, body: "# Audio and video\n\nUse `<video>`.", published: true });
    r = await lget(guest, "lesson", "&track=html&slug=audio-video");
    ok("new lessons can be written in the portal", r.s === 200 && r.j.lesson.title === "Audio and video");

    // a payment the callback couldn't finish is picked up by the daily job
    await lpost(boss, "video_save", { id: vid, title: "HTML basics", summary: "", price: 50, published: true });
    const stu3 = session();
    await lpost(stu3, "dev_login", { email: "wanjiru@example.com" });
    r = await lpost(stu3, "unlock", { id: vid, phone: "0733000111" });
    fs.mkdirSync(WORK + "/private/mpesa_results", { recursive: true });
    fs.writeFileSync(`${WORK}/private/mpesa_results/${r.j.checkout_id}.json`, JSON.stringify({ result_code: 0, amount: 50, receipt: "LRNCRON001" }));
    cron("daily");
    ok("daily job completes video payments the callback missed", one(`SELECT status FROM learn_payments WHERE checkout_id = '${r.j.checkout_id}'`).status === "paid");
  }

  // ---------- backups, off-site copy, uptime endpoint ----------
  const out = cron("backup");
  const files = fs.readdirSync(WORK + "/backups");
  ok("backup written", files.some((f) => /^portal-db-.*\.sql\.gz$/.test(f)), out);
  const offsite = fs.existsSync(WORK + "/fake/s3/test-bucket/portal") ? fs.readdirSync(WORK + "/fake/s3/test-bucket/portal") : [];
  ok("backup copied off-site with a valid signature", offsite.some((f) => /\.sql\.gz$/.test(f)), out);
  const dump = execFileSync("sh", ["-c", `zcat ${WORK}/backups/${files.find((f) => /\.sql\.gz$/.test(f))}`]).toString();
  fs.writeFileSync(WORK + "/restore.sql", dump);
  execFileSync("php", ["-r", `$p=new PDO("sqlite:${WORK}/restore.db");$p->exec(file_get_contents("${WORK}/restore.sql"));`]);
  const restored = JSON.parse(execFileSync("php", [__dirname + "/sq.php", WORK + "/restore.db", "sel", "SELECT COUNT(*) AS n FROM payments"]).toString())[0].n;
  ok("backup restores", restored == one("SELECT COUNT(*) AS n FROM payments").n);
  const upr = await fetch(BASE + "/portal/up.php");
  ok("uptime endpoint says OK", upr.status === 200 && (await upr.text()) === "OK");
  const cronWeb = await fetch(BASE + "/portal/cron.php");
  ok("jobs can’t be run from a browser", cronWeb.status === 404);

  console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
