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
    const method = opts.method || (body === undefined ? "GET" : "POST");
    const headers = Object.assign({ Cookie: cookie }, csrf ? { "X-CSRF-Token": csrf } : {});
    let payload;
    if (method === "POST") {
      if (body instanceof FormData) payload = body;
      else { headers["Content-Type"] = "application/json"; payload = JSON.stringify(body || {}); }
    }
    const r = await fetch(API + action + (opts.query || ""), { method, headers, body: payload, redirect: "manual" });
    const sc = r.headers.get("set-cookie");
    if (sc) cookie = sc.split(";")[0];
    const text = await r.text();
    let j = null;
    try { j = JSON.parse(text); } catch (e) {}
    if (j && j.csrf) csrf = j.csrf;
    return { s: r.status, j, text, headers: r.headers };
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
  ok("database upgraded to version 3", one("SELECT v FROM settings WHERE k = 'schema_version'").v === "3");

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
