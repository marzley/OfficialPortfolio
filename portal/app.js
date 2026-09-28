/* Marzley Tech client portal. Talks to api.php; every value from the server is
 * inserted as text (never as HTML). */
(function () {
  "use strict";

  var API = "api.php";
  var csrf = null;
  var me = null;
  var data = null;
  var STATUS = { planning: "Planning", design: "Design", build: "Building", review: "Review", live: "Live", on_hold: "On hold" };

  // ---------- helpers ----------
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Kiswahili for clients ----------
  var LANG = "en";
  try { LANG = localStorage.getItem("marzley-portal-lang") === "sw" ? "sw" : "en"; } catch (e) {}
  var SW = {
    "Client portal": "Lango la wateja", "Sign out": "Toka", "Loading…": "Inapakia…", "Hello, ": "Habari, ",
    "See your project’s progress, updates, files and invoices, and pay by M-Pesa. Sign in, or create your free account, with Google or your email.": "Ona maendeleo ya mradi wako, taarifa, faili na ankara, na ulipe kwa M-Pesa. Ingia, au fungua akaunti yako bure, kwa Google au barua pepe yako.",
    "No Google account? Use your email instead": "Huna akaunti ya Google? Tumia barua pepe yako", "Your email (or the phone number you gave us)": "Barua pepe yako (au nambari ya simu uliyotupa)",
    "Your name (new accounts only)": "Jina lako (kwa akaunti mpya tu)", "Need help?": "Unahitaji msaada?",
    "Welcome! Your account is ready.": "Karibu! Akaunti yako iko tayari.",
    "When we start a project for you, its progress, files and invoices will appear here. What would you like to do?": "Tukianza mradi wako, maendeleo yake, faili na ankara zitaonekana hapa. Ungependa kufanya nini?",
    "Get a free quote": "Pata makadirio bure", "Learn to code (free)": "Jifunze kuandika programu (bure)", "Chat on WhatsApp": "Ongea nasi WhatsApp",
    "No access yet?": "Bado huna ruhusa?", "Message us on WhatsApp": "Tutumie ujumbe WhatsApp",
    "Your projects": "Miradi yako", "Invoices": "Ankara", "Your courses": "Kozi zako", "Support": "Msaada", "Projects": "Miradi", "Courses": "Kozi",
    "Domains & hosting": "Vikoa na upangishaji", "Planning": "Mipango", "Design": "Usanifu", "Building": "Ujenzi", "Review": "Ukaguzi", "Live": "Iko hewani", "On hold": "Imesimamishwa",
    "% complete": "% imekamilika", " · Target date ": " · Tarehe lengwa ", "Approvals": "Idhini", "Updates": "Taarifa", "Files": "Faili",
    "No updates yet.": "Bado hakuna taarifa.", "No files yet.": "Bado hakuna faili.", "Your project will appear here once it starts.": "Mradi wako utaonekana hapa ukianza.",
    "Invoice": "Ankara", "Description": "Maelezo", "Amount": "Kiasi", "Due": "Mwisho", "Status": "Hali", "Paid": "Imelipwa", "Unpaid": "Haijalipwa", "Cancelled": "Imeghairiwa",
    "Part paid": "Imelipwa sehemu", "Balance": "Salio", "Receipt": "Risiti", "PDF": "PDF", "Pay with M-Pesa": "Lipa kwa M-Pesa", "Pay by card": "Lipa kwa kadi",
    "I’ve already paid": "Nimeshalipa", "No invoices yet.": "Bado hakuna ankara.", "Waiting for confirmation": "Inasubiri kuthibitishwa",
    "M-Pesa phone number": "Nambari ya simu ya M-Pesa", "Enter your phone number": "Weka nambari yako ya simu", "Send M-Pesa prompt": "Tuma ombi la M-Pesa", "Amount to pay (KSh)": "Kiasi cha kulipa (KSh)", "Close": "Funga",
    "Check your phone and enter your M-Pesa PIN to pay ": "Angalia simu yako na uweke PIN ya M-Pesa kulipa ", "Paid. Thank you! M-Pesa receipt ": "Imelipwa. Asante! Risiti ya M-Pesa ",
    "The payment didn't go through. No money was deducted. You can try again.": "Malipo hayakufanikiwa. Hakuna pesa iliyokatwa. Unaweza kujaribu tena.",
    "How did you pay?": "Ulilipaje?", "M-Pesa (Till 6095737)": "M-Pesa (Till 6095737)", "Bank transfer": "Uhamisho wa benki", "M-Pesa code or bank reference": "Nambari ya M-Pesa au ya benki",
    "Proof of payment (optional)": "Uthibitisho wa malipo (si lazima)", "Send for confirmation": "Tuma kwa uthibitisho",
    "Thanks! We’ll confirm your payment shortly.": "Asante! Tutathibitisha malipo yako hivi karibuni.",
    "Approve": "Idhinisha", "Request changes": "Omba mabadiliko", "Waiting for you": "Inakusubiri", "Approved": "Imeidhinishwa", "Changes requested": "Mabadiliko yameombwa",
    "Need help? Open a support request": "Unahitaji msaada? Fungua ombi la msaada", "About": "Kuhusu", "Subject": "Mada", "Message": "Ujumbe", "Send": "Tuma", "General": "Jumla",
    "Reply": "Jibu", "Mark as solved": "Imetatuliwa", "Reopen": "Fungua tena", "Open": "Wazi", "Closed": "Imefungwa", "No support requests yet.": "Bado hakuna maombi ya msaada.",
    "Write a reply…": "Andika jibu…", "You": "Wewe", "Send us a file (logo, photos, documents)": "Tutumie faili (nembo, picha, nyaraka)", "Upload": "Pakia", "Uploaded.": "Imepakiwa.",
    "expires": "inaisha", "Monthly report": "Ripoti ya mwezi", "Website status": "Hali ya tovuti", "Online": "Iko hewani", "Down": "Haifanyi kazi",
    "is live! How did we do?": "iko hewani! Tulifanyaje?", "Rate us": "Tupe alama", "Payment received. Thank you!": "Malipo yamepokelewa. Asante!",
    "Sections": "Sehemu", "Pay": "Lipa", "Choose a file first.": "Chagua faili kwanza.",
    "No Google account? Sign in with a code": "Huna akaunti ya Google? Ingia kwa nambari ya siri", "Your email or phone number (the one you gave us)": "Barua pepe au nambari ya simu (uliyotupa)",
    "Overview": "Muhtasari", "Request a project": "Omba mradi", "Payments": "Malipo", "Referrals": "Pendekeza", "Profile": "Wasifu", "My account": "Akaunti yangu", "Learning hub": "Kituo cha kujifunza",
    "Active projects": "Miradi inayoendelea", "Balance to pay": "Salio la kulipa", "Paid so far": "Umelipa hadi sasa", "Open support requests": "Maombi ya msaada yaliyo wazi",
    "People you referred": "Watu uliowapendekeza", "Referral rewards earned": "Zawadi ulizopata", "Project progress": "Maendeleo ya mradi", "See all": "Ona yote", "Next payment": "Malipo yajayo",
    "Nothing to pay right now.": "Hakuna cha kulipa sasa.", "Latest updates": "Taarifa za karibuni", "Client ID": "Nambari ya mteja", "Your client ID": "Nambari yako ya mteja",
    "Your referral code": "Nambari yako ya kupendekeza", "Rewards go to": "Zawadi zinatumwa kwa", "Add your M-Pesa number": "Weka nambari yako ya M-Pesa", "Add it in Profile": "Iweke kwenye Wasifu",
    "Copy": "Nakili", "Share on WhatsApp": "Shiriki kwa WhatsApp", "Link copied.": "Kiungo kimenakiliwa.", "Share": "Shiriki", "They sign up or enquire": "Wanajisajili au kuuliza",
    "They pay, we finish the work": "Wanalipa, tunamaliza kazi", "You get paid": "Unalipwa", "Referred": "Waliopendekezwa", "In progress": "Inaendelea", "Reward due to you": "Zawadi unayodai",
    "Rewards paid to you": "Zawadi ulizolipwa", "Name": "Jina", "Since": "Tangu", "Reward": "Zawadi", "Enquired": "Ameuliza", "Signed up": "Amejisajili", "Project started": "Mradi umeanza",
    "Paid · work in progress": "Amelipa · kazi inaendelea", "Work done · reward due": "Kazi imekamilika · zawadi inadaiwa", "Reward paid": "Zawadi imelipwa", "Not eligible": "Haistahili",
    "No one yet. Share your link to start earning.": "Bado hakuna. Shiriki kiungo chako uanze kupata.", "Request a new project": "Omba mradi mpya", "What do you need?": "Unahitaji nini?",
    "Budget": "Bajeti", "When do you need it?": "Unauhitaji lini?", "Describe your project": "Eleza mradi wako", "Send request": "Tuma ombi", "Your requests and quotes": "Maombi na makadirio yako",
    "Received": "Limepokelewa", "We’re in touch": "Tunawasiliana", "Quote sent": "Makadirio yametumwa", "Accepted": "Imekubaliwa", "View & accept": "Ona na ukubali", "View": "Ona",
    "Payment history & statement": "Historia ya malipo na taarifa", "Print statement": "Chapisha taarifa", "Total invoiced": "Jumla ya ankara", "Total paid": "Jumla uliyolipa",
    "Date": "Tarehe", "Method": "Njia", "Reference": "Kumbukumbu", "No payments yet.": "Bado hakuna malipo.", "Your details": "Maelezo yako", "Save": "Hifadhi", "Saved.": "Imehifadhiwa.",
    "M-Pesa phone number (payments and referral rewards)": "Nambari ya M-Pesa (malipo na zawadi)", "Email (sign-in)": "Barua pepe (kuingia)", "Security": "Usalama",
    "Sign out everywhere": "Toka kwenye vifaa vyote", "No projects yet": "Bado hakuna miradi", "Request sent. We’ll get back to you within a day.": "Ombi limetumwa. Tutakujibu ndani ya siku moja.",
    "6-digit code": "Nambari ya tarakimu 6", "Send me a code": "Nitumie nambari", "Sign in": "Ingia"
  };
  var t = function (s) { return LANG === "sw" && SW[s] ? SW[s] : s; };
  function translateStatic() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);
      el.textContent = t(el.getAttribute("data-en"));
    });
    document.documentElement.lang = LANG === "sw" ? "sw" : "en";
    ["lang-toggle", "client-lang"].forEach(function (id) {
      var b = $(id);
      if (b) { b.textContent = LANG === "sw" ? "English" : "Kiswahili"; b.setAttribute("lang", LANG === "sw" ? "en" : "sw"); }
    });
  }
  var isTeam = function () { return me && (me.role === "admin" || me.role === "staff"); };
  var can = function (perm) { return me && (me.role === "admin" || (me.role === "staff" && data && data.me && (data.me.perms || []).indexOf(perm) >= 0)); };

  /** Build an element: h("p", { className: "x" }, "text", child, ...) */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "className") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else if (k === "value") el.value = v;
      else el.setAttribute(k, v === true ? "" : v);
    });
    var add = function (c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) { c.forEach(add); return; }
      el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    };
    for (var i = 2; i < arguments.length; i++) add(arguments[i]);
    return el;
  }

  var ksh = function (n) { return "KSh " + Number(n).toLocaleString("en-KE"); };
  var day = function (s) {
    if (!s) return "";
    var d = new Date(String(s).replace(" ", "T"));
    return isNaN(d) ? s : d.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
  };
  var size = function (b) { return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; };

  var toastTimer;
  function toast(msg, bad) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.toggle("is-bad", !!bad);
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 4000);
  }

  function api(action, opts) {
    opts = opts || {};
    var init = { method: opts.method || "GET", headers: { Accept: "application/json" }, credentials: "same-origin" };
    var url = API + "?action=" + encodeURIComponent(action) + (opts.query || "");
    if (init.method === "POST") {
      if (csrf) init.headers["X-CSRF-Token"] = csrf;
      if (opts.form) init.body = opts.form;
      else { init.headers["Content-Type"] = "application/json"; init.body = JSON.stringify(opts.body || {}); }
    }
    return fetch(url, init).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (d) {
        if (!res.ok) {
          var err = new Error(d.error || "Something went wrong. Please try again.");
          err.status = res.status;
          // Signed out (idle too long, or "sign out everywhere"): go back to the sign-in screen
          if (res.status === 401 && me && action !== "login") signedOut(err.message);
          throw err;
        }
        return d;
      });
    });
  }

  function show(view) {
    ["portal-loading", "view-signin", "view-client", "view-admin"].forEach(function (id) { $(id).hidden = id !== view; });
    document.body.classList.toggle("is-admin", view === "view-admin" || view === "view-client");
    $("portal-user").hidden = !me;
    var lt = $("lang-toggle");
    if (lt) lt.hidden = view === "view-admin";
    if (me) {
      $("portal-name").textContent = me.name || me.email;
      $("admin-name").textContent = me.name || me.email;
    }
  }

  // ---------- sign-in ----------
  // Someone who arrived through a referral link keeps the referrer's code (saved by the website)
  try {
    var inRef = new URLSearchParams(location.search).get("ref");
    if (inRef && /^M[TC][0-9A-Z]{4,8}$/.test(inRef)) localStorage.setItem("marzley-ref", JSON.stringify({ code: inRef, at: Date.now() }));
  } catch (e) {}
  var refCode = function () { try { var r = JSON.parse(localStorage.getItem("marzley-ref") || "null"); return r && r.code ? String(r.code) : ""; } catch (e) { return ""; } };
  var googleClientId = null;
  var googleReady = false;
  function signedOut(message) {
    me = null; csrf = null; data = null;
    show("view-signin");
    $("signin-error").textContent = message || "";
    if (!googleReady) startGoogle(googleClientId);
  }
  function startGoogle(clientId, tries) {
    if (!clientId) { $("signin-error").textContent = "Sign-in is not set up yet."; return; }
    if (!(window.google && google.accounts && google.accounts.id)) {
      if ((tries || 0) > 40) { $("signin-error").textContent = "Google sign-in could not load. Check your connection and reload."; return; }
      return setTimeout(function () { startGoogle(clientId, (tries || 0) + 1); }, 250);
    }
    google.accounts.id.initialize({
      client_id: clientId,
      callback: function (resp) {
        $("signin-error").textContent = "";
        api("login", { method: "POST", body: { credential: resp.credential, ref: refCode() } })
          .then(function (d) { csrf = d.csrf; me = d.user; load(); })
          .catch(function (e) { $("signin-error").textContent = e.message; });
      }
    });
    google.accounts.id.renderButton($("google-signin"), { theme: "filled_blue", size: "large", shape: "pill", text: "signin_with" });
    googleReady = true;
  }

  $("sign-out").addEventListener("click", function () {
    api("logout", { method: "POST" }).catch(function () {}).then(function () {
      me = null; csrf = null;
      if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
      location.reload();
    });
  });

  function load() {
    return api("data").then(function (d) {
      data = d;
      if (isTeam()) {
        renderAdmin(); show("view-admin");
        if (location.hash === "#learn" && can("courses")) { selectTab("learn"); history.replaceState(null, "", location.pathname); }
      }
      else { renderClient(); show("view-client"); }
    }).catch(function (e) {
      if (e.status === 401) signedOut(e.message);
      else toast(e.message, true);
    });
  }

  // ---------- client view ----------
  function projectCard(p, admin) {
    var tx = admin ? function (x) { return x; } : t;
    var ups = data.updates.filter(function (u) { return +u.project_id === +p.id; });
    var files = data.files.filter(function (f) { return +f.project_id === +p.id; });
    var card = h("article", { className: "portal-card" },
      h("div", { className: "portal-card-head" },
        h("h3", { text: p.title }),
        h("span", { className: "pill pill-" + p.status, text: tx(STATUS[p.status] || p.status) })),
      h("div", { className: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(p.progress), "aria-label": "Progress" },
        h("span", { style: "width:" + Math.max(0, Math.min(100, +p.progress)) + "%" })),
      h("p", { className: "portal-meta", text: p.progress + tx("% complete") + (p.due_date ? tx(" · Target date ") + day(p.due_date) : "") }),
      p.summary ? h("p", { className: "portal-summary", text: p.summary }) : null);

    var approvals = (data.approvals || []).filter(function (a) { return +a.project_id === +p.id; });
    if (approvals.length || admin) card.appendChild(h("h4", { text: tx("Approvals") }));
    if (approvals.length) {
      var al = h("ul", { className: "approval-list" });
      approvals.forEach(function (a) { al.appendChild(approvalItem(a, admin)); });
      card.appendChild(al);
    } else if (admin) {
      card.appendChild(h("p", { className: "portal-empty", text: "Nothing waiting for approval." }));
    }

    var timeline = h("ol", { className: "timeline" });
    ups.forEach(function (u) {
      timeline.appendChild(h("li", null,
        h("time", { datetime: u.created_at, text: day(u.created_at) }),
        h("p", { text: u.message }),
        admin ? h("button", { type: "button", className: "linklike danger", onclick: function () { remove("update", u.id); }, text: "Delete" }) : null));
    });
    card.appendChild(h("h4", { text: tx("Updates") }));
    card.appendChild(ups.length ? timeline : h("p", { className: "portal-empty", text: tx("No updates yet.") }));

    card.appendChild(h("h4", { text: tx("Files") }));
    if (files.length) {
      var list = h("ul", { className: "file-list" });
      files.forEach(function (f) {
        list.appendChild(h("li", null,
          h("a", { href: API + "?action=download&id=" + encodeURIComponent(f.id) },
            h("i", { className: "fa-solid fa-file-arrow-down", "aria-hidden": "true" }), " " + f.original_name),
          h("span", { className: "portal-meta", text: size(+f.size) + " · " + day(f.created_at) + (admin && f.uploaded_by === "client" ? " · from client" : "") }),
          admin ? h("button", { type: "button", className: "linklike danger", onclick: function () { remove("file", f.id); }, text: "Delete" }) : null));
      });
      card.appendChild(list);
    } else {
      card.appendChild(h("p", { className: "portal-empty", text: tx("No files yet.") }));
    }
    if (!admin) {
      // Clients can send us their logo, photos and documents
      var up = h("input", { type: "file", "aria-label": t("Send us a file (logo, photos, documents)"), accept: ".pdf,.png,.jpg,.jpeg,.webp,.zip,.docx,.xlsx,.pptx,.txt,.csv" });
      card.appendChild(h("form", { className: "inline-form client-upload", onsubmit: function (e) {
        e.preventDefault();
        if (!up.files[0]) return toast(t("Choose a file first."), true);
        var fd = new FormData();
        fd.append("project_id", p.id);
        fd.append("file", up.files[0]);
        api("file_upload", { method: "POST", form: fd }).then(function () { toast(t("Uploaded.")); load(); }).catch(function (err) { toast(err.message, true); });
      } }, h("span", { className: "portal-meta", text: t("Send us a file (logo, photos, documents)") }), up, h("button", { type: "submit", className: "btn btn-ghost btn-sm", text: t("Upload") })));
    }
    return card;
  }

  function renderClientDomains() {
    var box = $("client-domains");
    box.textContent = "";
    var list = data.domains || [];
    $("ctab-domains").hidden = !list.length;
    if (!list.length) return;
    var ul = h("ul", { className: "admin-list" });
    list.forEach(function (d) {
      var left = Math.round((new Date(d.expires_on + "T00:00:00") - new Date(ymd(new Date()) + "T00:00:00")) / 864e5);
      ul.appendChild(h("li", null, h("div", null, h("strong", { text: d.name }),
        h("span", { className: "portal-meta", text: KINDS[d.kind] + " · " + t("expires") + " " + day(d.expires_on) + (left <= 30 ? " (" + left + " days)" : "") })),
        d.monitor_url ? h("span", { className: "pill " + (d.last_status === "down" ? "pill-unpaid" : "pill-paid"), text: t("Website status") + ": " + t(d.last_status === "down" ? "Down" : "Online") }) : null));
    });
    box.appendChild(ul);
    box.appendChild(h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () { careReport(list[0].client_id, ymd(new Date()).slice(0, 7)); } },
      h("i", { className: "fa-solid fa-chart-simple", "aria-hidden": "true" }), " " + t("Monthly report")));
  }

  function renderInvoices(box, invoices, admin) {
    var tx = admin ? function (x) { return x; } : t;
    box.textContent = "";
    if (!invoices.length) { box.appendChild(h("p", { className: "portal-empty", text: tx("No invoices yet.") })); return; }
    var table = h("table", { className: "portal-table" },
      h("thead", null, h("tr", null,
        h("th", { text: tx("Invoice") }), admin ? h("th", { text: "Client" }) : null, h("th", { text: tx("Description") }),
        h("th", { className: "r", text: tx("Amount") }), h("th", { text: tx("Due") }), h("th", { text: tx("Status") }), h("th", { text: "" }))));
    var body = h("tbody");
    invoices.forEach(function (inv) {
      var client = admin ? (data.clients.find(function (c) { return +c.id === +inv.client_id; }) || {}).name : null;
      var paidPart = +inv.amount_paid || 0;
      var balance = Math.max(0, +inv.amount - paidPart);
      var pending = (data.payments || []).filter(function (p) { return +p.invoice_id === +inv.id && p.status === "pending"; });
      var pdf = h("button", { type: "button", className: "linklike", onclick: function () { printInvoice(inv); }, text: tx(inv.status === "paid" ? "Receipt" : "PDF") });
      var action = h("span", { className: "row-actions" }, pdf);
      if (!admin && inv.status === "unpaid") {
        action.insertBefore(h("button", { type: "button", className: "btn btn-mpesa btn-sm", onclick: function () { payInvoice(inv); }, text: t("Pay") }), pdf);
        if (data.me && data.me.card) action.insertBefore(h("button", { type: "button", className: "linklike", onclick: function () { payByCard(inv, balance); }, text: t("Pay by card") }), pdf);
        action.insertBefore(h("button", { type: "button", className: "linklike", onclick: function () { claimPayment(inv, balance); }, text: t("I’ve already paid") }), pdf);
      }
      if (admin) {
        if (inv.status === "unpaid") action.appendChild(h("button", { type: "button", className: "linklike", onclick: function () { recordPayment(inv, balance); }, text: "Record payment" }));
        action.appendChild(h("button", { type: "button", className: "linklike", onclick: function () { editInvoice(inv); }, text: "Edit" }));
        if (!paidPart) action.appendChild(h("button", { type: "button", className: "linklike danger", onclick: function () { remove("invoice", inv.id); }, text: "Delete" }));
      }
      var statusText = inv.status === "paid" ? tx("Paid") + (inv.mpesa_receipt ? " · " + inv.mpesa_receipt : "") : inv.status === "unpaid" ? (paidPart ? tx("Part paid") : tx("Unpaid")) : tx("Cancelled");
      body.appendChild(h("tr", { "data-status": inv.status },
        h("td", { "data-label": tx("Invoice"), text: inv.number }),
        admin ? h("td", { "data-label": "Client", text: client || "" }) : null,
        h("td", { "data-label": tx("Description"), text: inv.description }),
        h("td", { "data-label": tx("Amount"), className: "r" }, ksh(inv.amount), paidPart && inv.status === "unpaid" ? h("small", { className: "balance", text: tx("Balance") + " " + ksh(balance) }) : null),
        h("td", { "data-label": tx("Due"), text: day(inv.due_date) || "—" }),
        h("td", { "data-label": tx("Status") }, h("span", { className: "pill pill-" + (inv.status === "unpaid" && paidPart ? "build" : inv.status), text: statusText }),
          pending.length ? h("small", { className: "balance", text: tx("Waiting for confirmation") + ": " + ksh(pending.reduce(function (a, p) { return a + +p.amount; }, 0)) }) : null),
        h("td", null, action)));
    });
    table.appendChild(body);
    box.appendChild(h("div", { className: "table-wrap" }, table));
  }

  // ---------- other ways to pay, and recording payments ----------
  function dialog(title, content) {
    var dlg = h("dialog", { className: "portal-dialog", "aria-label": title });
    dlg.appendChild(content);
    dlg.addEventListener("close", function () { dlg.remove(); });
    document.body.appendChild(dlg);
    dlg.showModal();
    var first = dlg.querySelector("input, select, textarea");
    if (first) first.focus();
    return dlg;
  }
  function payByCard(inv, balance) {
    var amt = h("input", { type: "number", min: "1", max: String(balance), value: String(balance) });
    var err = h("p", { className: "portal-error", role: "alert" });
    var dlg = dialog("Pay by card", h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      err.textContent = "";
      api("card_pay", { method: "POST", body: { invoice_id: inv.id, amount: amt.value } }).then(function (r) { location.href = r.url; }).catch(function (x) { err.textContent = x.message; });
    } }, h("h2", { text: t("Pay by card") + ": " + inv.number }), h("p", { className: "portal-meta", text: "Visa, Mastercard and more, through Paystack. You’ll come back here after paying." }),
      field(t("Amount to pay (KSh)"), amt), err, h("button", { type: "submit", className: "btn btn-solid", text: t("Pay by card") }),
      h("button", { type: "button", className: "linklike", onclick: function () { dlg.close(); }, text: t("Close") })));
  }
  function claimPayment(inv, balance) {
    var method = select([["till", t("M-Pesa (Till 6095737)")], ["bank", t("Bank transfer")]], "till");
    var amt = h("input", { type: "number", min: "1", max: String(balance), value: String(balance) });
    var ref = h("input", { maxlength: "60", autocomplete: "off", placeholder: "e.g. SGR7H2K9PQ" });
    var proof = h("input", { type: "file", accept: ".pdf,.png,.jpg,.jpeg,.webp" });
    var err = h("p", { className: "portal-error", role: "alert" });
    var dlg = dialog(t("I’ve already paid"), h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      err.textContent = "";
      var fd = new FormData();
      fd.append("invoice_id", inv.id); fd.append("method", method.value); fd.append("amount", amt.value); fd.append("reference", ref.value);
      if (proof.files[0]) fd.append("proof", proof.files[0]);
      api("payment_claim", { method: "POST", form: fd }).then(function () { dlg.close(); toast(t("Thanks! We’ll confirm your payment shortly.")); load(); }).catch(function (x) { err.textContent = x.message; });
    } }, h("h2", { text: t("I’ve already paid") + ": " + inv.number }),
      field(t("How did you pay?"), method), field(t("Amount to pay (KSh)"), amt), field(t("M-Pesa code or bank reference"), ref), field(t("Proof of payment (optional)"), proof),
      err, h("button", { type: "submit", className: "btn btn-solid", text: t("Send for confirmation") }),
      h("button", { type: "button", className: "linklike", onclick: function () { dlg.close(); }, text: t("Close") })));
  }
  function recordPayment(inv, balance) {
    var method = select([["mpesa", "M-Pesa"], ["till", "M-Pesa till"], ["bank", "Bank transfer"], ["card", "Card"], ["cash", "Cash"]], "mpesa");
    var amt = h("input", { type: "number", min: "1", max: String(balance), value: String(balance) });
    var ref = h("input", { maxlength: "60", autocomplete: "off", placeholder: "M-Pesa code or bank reference" });
    var err = h("p", { className: "portal-error", role: "alert" });
    var hist = (data.payments || []).filter(function (p) { return +p.invoice_id === +inv.id && p.status === "confirmed"; });
    var dlg = dialog("Record a payment", h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      err.textContent = "";
      api("payment_record", { method: "POST", body: { invoice_id: inv.id, amount: amt.value, method: method.value, reference: ref.value } })
        .then(function () { dlg.close(); toast("Payment recorded. The client was sent a receipt."); load(); }).catch(function (x) { err.textContent = x.message; });
    } }, h("h2", { text: "Record a payment: " + inv.number }), h("p", { className: "portal-meta", text: "Total " + ksh(inv.amount) + " · paid " + ksh(inv.amount_paid || 0) + " · balance " + ksh(balance) }),
      hist.length ? h("ul", { className: "file-list" }, hist.map(function (p) { return h("li", null, h("span", { text: ksh(p.amount) + " · " + p.method + (p.reference ? " · " + p.reference : "") }), h("span", { className: "portal-meta", text: day(p.decided_at) })); })) : null,
      field("How it was paid", method), field("Amount (KSh)", amt), field("Reference", ref), err,
      h("button", { type: "submit", className: "btn btn-solid", text: "Record payment" }), h("button", { type: "button", className: "linklike", onclick: function () { dlg.close(); }, text: "Close" })));
  }
  function pendingPayments() {
    var pend = (data.payments || []).filter(function (p) { return p.status === "pending"; });
    if (!pend.length) return null;
    var ul = h("ul", { className: "admin-list" });
    pend.forEach(function (p) {
      var inv = data.invoices.find(function (i) { return +i.id === +p.invoice_id; }) || {};
      var c = data.clients.find(function (x) { return +x.id === +inv.client_id; }) || {};
      ul.appendChild(h("li", null, h("div", null, h("strong", { text: ksh(p.amount) + " · " + (p.method === "till" ? "M-Pesa till" : "Bank transfer") + " · ref " + p.reference }),
        h("span", { className: "portal-meta", text: (c.name || "?") + " · " + (inv.number || "") + " · sent " + day(p.created_at) })),
        h("span", { className: "row-actions" },
          +p.has_proof ? h("a", { className: "linklike", href: API + "?action=proof&id=" + p.id, text: "Proof" }) : null,
          h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () { save("payment_decide", { id: p.id, decision: "confirm" }); }, text: "Confirm" }),
          h("button", { type: "button", className: "linklike danger", onclick: function () {
            var why = prompt("Why can’t you confirm it? (the client will see this)", "We couldn’t find this payment on our statement.");
            if (why) save("payment_decide", { id: p.id, decision: "reject", note: why });
          }, text: "Reject" }))));
    });
    return h("section", { className: "admin-panel attention-panel", "aria-labelledby": "pend-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "pend-title", text: "Payments to confirm" }), h("span", { className: "nav-badge badge-red", text: String(pend.length) })),
      h("p", { className: "portal-meta", text: "Clients say they paid these. Check your M-Pesa or bank statement first." }), ul);
  }

  // ---------- paying an invoice ----------
  function payInvoice(inv) {
    var dlg = h("dialog", { className: "portal-dialog", "aria-labelledby": "pay-title" });
    var err = h("p", { className: "portal-error", role: "alert" });
    var status = h("div", { className: "deposit-status", role: "status", "aria-live": "polite", hidden: true });
    var phone = h("input", { id: "pay-phone", type: "tel", inputmode: "numeric", autocomplete: "tel", placeholder: t("Enter your phone number"), required: true });
    var balance = Math.max(0, +inv.amount - (+inv.amount_paid || 0));
    var amount = h("input", { id: "pay-amount", type: "number", min: "1", max: String(Math.min(balance, 150000)), value: String(Math.min(balance, 150000)) });
    var btn = h("button", { type: "submit", className: "btn btn-mpesa", text: t("Send M-Pesa prompt") });
    var timer;
    var form = h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      err.textContent = "";
      btn.disabled = true;
      api("pay_invoice", { method: "POST", body: { invoice_id: inv.id, phone: phone.value, amount: amount.value } }).then(function () {
        status.hidden = false;
        status.className = "deposit-status is-wait";
        status.textContent = t("Check your phone and enter your M-Pesa PIN to pay ") + ksh(amount.value) + ".";
        var tries = 30;
        (function poll() {
          api("payment_status", { query: "&invoice_id=" + encodeURIComponent(inv.id) }).then(function (s) {
            if (s.status === "paid") {
              status.className = "deposit-status is-ok";
              status.textContent = t("Paid. Thank you! M-Pesa receipt ") + (s.receipt || "") + ".";
              btn.disabled = false;
              load();
            } else if (s.status === "failed") {
              status.className = "deposit-status is-fail";
              status.textContent = t("The payment didn't go through. No money was deducted. You can try again.");
              btn.disabled = false;
            } else if (--tries > 0) {
              timer = setTimeout(poll, 3000);
            } else {
              status.textContent = "Still waiting. If you entered your PIN, the invoice will update once M-Pesa confirms.";
              btn.disabled = false;
            }
          }).catch(function () { if (--tries > 0) timer = setTimeout(poll, 3000); });
        })();
      }).catch(function (e) { err.textContent = e.message; btn.disabled = false; });
    } },
      h("h2", { id: "pay-title", text: t("Pay with M-Pesa") + ": " + inv.number }),
      h("p", { text: inv.description + " · " + t("Balance") + " " + ksh(balance) }),
      h("div", { className: "field" }, h("label", { for: "pay-phone", text: t("M-Pesa phone number") }), phone),
      h("div", { className: "field" }, h("label", { for: "pay-amount", text: t("Amount to pay (KSh)") }), amount),
      err, btn, status,
      h("button", { type: "button", className: "linklike", onclick: function () { clearTimeout(timer); dlg.close(); }, text: t("Close") }));
    dlg.appendChild(form);
    dlg.addEventListener("close", function () { clearTimeout(timer); dlg.remove(); });
    document.body.appendChild(dlg);
    dlg.showModal();
    phone.focus();
  }

  // ---------- admin ----------
  function field(label, input) {
    var id = "f-" + Math.random().toString(36).slice(2, 9);
    input.id = id;
    return h("div", { className: "field" }, h("label", { for: id, text: label }), input);
  }
  function select(options, value) {
    var s = h("select");
    options.forEach(function (o) { s.appendChild(h("option", { value: String(o[0]), text: o[1] })); });
    if (value !== undefined && value !== null) s.value = String(value);
    return s;
  }
  function save(action, payload, form) {
    return api(action, { method: "POST", body: payload }).then(function () {
      toast("Saved.");
      if (form) form.reset();
      return load();
    }).catch(function (e) { toast(e.message, true); });
  }
  function remove(type, id) {
    if (!confirm("Delete this " + type + "? This can't be undone.")) return;
    api("delete", { method: "POST", body: { type: type, id: id } }).then(function () { toast("Deleted."); load(); })
      .catch(function (e) { toast(e.message, true); });
  }
  var clientOptions = function () { return data.clients.map(function (c) { return [c.id, c.name + " (" + c.email + ")"]; }); };

  function renderAdmin() {
    TABS.forEach(function (tb) { $("tab-" + tb).hidden = !tabAllowed(tb); });
    document.querySelectorAll(".admin-nav-label[data-area]").forEach(function (l) {
      l.hidden = !l.getAttribute("data-area").split(" ").some(tabAllowed);
    });
    var current = TABS.filter(function (tb) { return $("tab-" + tb).getAttribute("aria-selected") === "true"; })[0];
    if (current && !tabAllowed(current)) selectTab("overview");
    renderOverview();
    if (can("money")) { renderReports(); renderAdminInvoices(); renderQuotes(); renderDomains(); }
    if (can("leads")) { renderLeads(); renderGrowth(); }
    if (can("projects")) renderAdminProjects();
    if (can("clients")) renderAdminClients();
    if (can("support")) renderSupport($("panel-support"), true);
    var sp = $("panel-support"), sf = filterBar(sp, ":scope > .ticket", "support requests", [["open", "Open"], ["closed", "Solved"]]);
    var firstTicket = sp.querySelector(":scope > .ticket");
    if (firstTicket) { sp.insertBefore(sf.bar, firstTicket); sf.run(); }
    if (can("courses")) { renderAdminCourses(); if (learnData) renderLearn(); }
    if (me.role === "admin") renderActivity();
    var open = (data.tickets || []).filter(function (t) { return t.status === "open"; }).length;
    $("open-count").textContent = String(open);
    $("open-count").hidden = !open;
    var badge = function (id, n) { $(id).textContent = String(n); $(id).hidden = !n; };
    badge("count-projects", data.projects.filter(function (p) { return p.status !== "live"; }).length);
    badge("count-clients", data.clients.length);
    badge("count-invoices", data.invoices.filter(function (i) { return i.status === "unpaid"; }).length);
    badge("count-courses", (data.courses || []).length);
    var sys = data.system || {};
    var stale = function (s) { return !s || (Date.now() - new Date(String(s).replace(" ", "T")).getTime()) / 36e5 > 26; };
    badge("count-activity", me.role === "admin" ? (stale(sys.last_cron) ? 1 : 0) + (stale(sys.last_backup) ? 1 : 0) : 0);
    badge("count-leads", (data.leads || []).filter(function (l) { return l.status === "new"; }).length);
    badge("count-quotes", (data.quotes || []).filter(function (q) { return q.status === "sent"; }).length);
    badge("count-growth", (data.referrals || []).filter(function (r) { return r.status === "due"; }).length + (data.feedback || []).filter(function (f) { return +f.publish_ok && !+f.published && +f.rating >= 4 && f.comment; }).length);
    var soonDays = function (d) { return (new Date(d.expires_on + "T00:00:00") - Date.now()) / 864e5; };
    badge("count-domains", (data.domains || []).filter(function (d) { return soonDays(d) <= 30 || d.last_status === "down"; }).length);
    var pendPay = (data.payments || []).filter(function (x) { return x.status === "pending"; }).length;
    if (pendPay) badge("count-invoices", pendPay + data.invoices.filter(function (i) { return i.status === "unpaid"; }).length);
  }

  function renderAdminClients(edit) {
    var panel = $("panel-clients");
    panel.textContent = "";
    edit = edit || {};
    var name = h("input", { value: edit.name || "", maxlength: "120" });
    var email = h("input", { type: "email", value: edit.email || "", maxlength: "190" });
    var phone = h("input", { type: "tel", value: edit.phone || "", maxlength: "30" });
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      save("client_save", { id: edit.id || 0, name: name.value, email: email.value, phone: phone.value }, form).then(function () { renderAdminClients(); });
    } },
      h("h2", { className: "full", text: edit.id ? "Edit client" : "Add a client" }),
      field("Name", name), field("Google email (used to sign in)", email), field("Phone", phone),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: edit.id ? "Save changes" : "Add client" }),
        edit.id ? h("button", { type: "button", className: "btn btn-ghost", onclick: function () { renderAdminClients(); }, text: "Cancel" }) : null));
    panel.insertBefore(quickStart(), panel.firstChild);
    panel.appendChild(form);
    var cf = filterBar(panel, ".admin-list > li", "people");
    if (data.clients.length) panel.appendChild(cf.bar);
    var list = h("ul", { className: "admin-list" });
    data.clients.forEach(function (c) {
      list.appendChild(h("li", null, h("div", null, h("strong", { text: c.name }), h("span", { className: "portal-meta", text: c.email + (c.phone ? " · " + c.phone : "") })),
        h("span", { className: "row-actions" },
          c.phone ? h("a", { className: "linklike", href: waTo(c.phone, "Hello " + c.name + ","), target: "_blank", rel: "noopener noreferrer", text: "WhatsApp" }) : null,
          h("button", { type: "button", className: "linklike", onclick: function () { renderAdminClients(c); name.focus(); }, text: "Edit" }))));
    });
    panel.appendChild(data.clients.length ? list : h("p", { className: "portal-empty", text: "No clients yet. Add one above; they can then sign in with that Google account." }));
    cf.run();
  }

  function renderAdminProjects(edit) {
    var panel = $("panel-projects");
    panel.textContent = "";
    edit = edit || {};
    if (!data.clients.length) { panel.appendChild(h("p", { className: "portal-empty", text: "Add a client first (Clients tab)." })); return; }
    var client = select(clientOptions(), edit.client_id);
    var title = h("input", { value: edit.title || "", maxlength: "160" });
    var status = select(Object.keys(STATUS).map(function (k) { return [k, STATUS[k]]; }), edit.status || "planning");
    var progress = h("input", { type: "number", min: "0", max: "100", value: edit.progress !== undefined ? edit.progress : 0 });
    var due = h("input", { type: "date", value: edit.due_date || "" });
    var summary = h("textarea", { rows: "3", maxlength: "2000" });
    summary.value = edit.summary || "";
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      save("project_save", { id: edit.id || 0, client_id: client.value, title: title.value, status: status.value, progress: progress.value, due_date: due.value, summary: summary.value }, form)
        .then(function () { renderAdminProjects(); });
    } },
      h("h2", { className: "full", text: edit.id ? "Edit project" : "Add a project" }),
      field("Client", client), field("Project name", title), field("Status", status), field("Progress (%)", progress), field("Target date", due),
      h("div", { className: "field full" }, h("label", { for: "p-summary", text: "Summary (shown to the client)" }), summary),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: edit.id ? "Save changes" : "Add project" }),
        edit.id ? h("button", { type: "button", className: "btn btn-ghost", onclick: function () { renderAdminProjects(); }, text: "Cancel" }) : null));
    summary.id = "p-summary";
    panel.appendChild(form);
    var pf = filterBar(panel, ":scope > .portal-card", "projects", Object.keys(STATUS).map(function (k) { return [k, STATUS[k]]; }));
    panel.appendChild(pf.bar);

    data.projects.forEach(function (p) {
      var card = projectCard(p, true);
      card.setAttribute("data-status", p.status);
      var c = data.clients.find(function (x) { return +x.id === +p.client_id; });
      card.insertBefore(h("p", { className: "portal-meta", text: "Client: " + (c ? c.name : "?") }), card.children[1]);
      var msg = h("textarea", { rows: "2", maxlength: "2000", placeholder: "What’s new on this project?", "aria-label": "New update for " + p.title });
      card.appendChild(h("form", { className: "inline-form", onsubmit: function (e) {
        e.preventDefault();
        save("update_add", { project_id: p.id, message: msg.value }, e.target);
      } }, msg, h("button", { type: "submit", className: "btn btn-solid btn-sm", text: "Post update" })));
      var fileInput = h("input", { type: "file", "aria-label": "File for " + p.title, accept: ".pdf,.png,.jpg,.jpeg,.webp,.zip,.docx,.xlsx,.pptx,.txt,.csv" });
      card.appendChild(h("form", { className: "inline-form", onsubmit: function (e) {
        e.preventDefault();
        if (!fileInput.files[0]) return toast("Choose a file first.", true);
        var fd = new FormData();
        fd.append("project_id", p.id);
        fd.append("file", fileInput.files[0]);
        api("file_upload", { method: "POST", form: fd }).then(function () { toast("Uploaded."); load(); }).catch(function (err) { toast(err.message, true); });
      } }, fileInput, h("button", { type: "submit", className: "btn btn-ghost btn-sm", text: "Upload file" })));
      var apTitle = h("input", { maxlength: "160", placeholder: "What should they approve? e.g. Homepage design", "aria-label": "Approval title for " + p.title });
      var apDetails = h("input", { maxlength: "2000", placeholder: "Details or a link to review (optional)", "aria-label": "Approval details for " + p.title });
      var apBill = can("money") ? h("input", { type: "number", min: "0", placeholder: "Stage payment KSh (optional)", "aria-label": "Invoice this amount when approved (optional)" }) : null;
      card.appendChild(h("form", { className: "inline-form", onsubmit: function (e) {
        e.preventDefault();
        save("approval_request", { project_id: p.id, title: apTitle.value, details: apDetails.value, bill_amount: apBill ? apBill.value : "" }, e.target);
      } }, apTitle, apDetails, apBill, h("button", { type: "submit", className: "btn btn-ghost btn-sm", text: "Request approval" })));
      if (c && c.phone) card.appendChild(h("a", { className: "wa-link", href: waTo(c.phone, "Hello " + c.name + ", there's a new update on " + p.title + " in your Marzley Tech portal: " + location.origin + "/portal/"), target: "_blank", rel: "noopener noreferrer" },
        h("i", { className: "fab fa-whatsapp", "aria-hidden": "true" }), " Message " + c.name + " on WhatsApp"));
      card.appendChild(h("button", { type: "button", className: "linklike", onclick: function () { renderAdminProjects(p); window.scrollTo(0, 0); }, text: "Edit project details" }));
      panel.appendChild(card);
    });
    pf.run();
  }

  function editInvoice(inv) {
    selectTab("invoices");
    renderAdminInvoices(inv);
    window.scrollTo(0, 0);
  }

  function renderAdminInvoices(edit) {
    var panel = $("panel-invoices");
    panel.textContent = "";
    edit = edit || {};
    if (!data.clients.length) { panel.appendChild(h("p", { className: "portal-empty", text: "Add a client first (Clients tab)." })); return; }
    var client = select(clientOptions(), edit.client_id);
    var project = select([["", "No project"]].concat(data.projects.map(function (p) { return [p.id, p.title]; })), edit.project_id || "");
    var desc = h("input", { value: edit.description || "", maxlength: "300", placeholder: "e.g. Website deposit (50%)" });
    var amount = h("input", { type: "number", min: "1", value: edit.amount || "" });
    var due = h("input", { type: "date", value: edit.due_date || "" });
    var status = select([["unpaid", "Unpaid"], ["paid", "Paid"], ["cancelled", "Cancelled"]], edit.status || "unpaid");
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      save("invoice_save", { id: edit.id || 0, client_id: client.value, project_id: project.value, description: desc.value, amount: amount.value, due_date: due.value, status: status.value }, form)
        .then(function () { renderAdminInvoices(); });
    } },
      h("h2", { className: "full", text: edit.id ? "Edit invoice " + edit.number : "Create an invoice" }),
      field("Client", client), field("Project", project), field("Description", desc), field("Amount (KSh)", amount), field("Due date", due), field("Status", status),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: edit.id ? "Save changes" : "Create invoice" }),
        edit.id ? h("button", { type: "button", className: "btn btn-ghost", onclick: function () { renderAdminInvoices(); }, text: "Cancel" }) : null));
    var pp = pendingPayments();
    if (pp && !edit.id) panel.appendChild(pp);
    panel.appendChild(form);
    var inf = filterBar(panel, "tbody tr", "invoices", [["unpaid", "Unpaid"], ["paid", "Paid"], ["cancelled", "Cancelled"]]);
    if (data.invoices.length) panel.appendChild(inf.bar);
    var list = h("div");
    renderInvoices(list, data.invoices, true);
    panel.appendChild(list);
    inf.run();
    panel.appendChild(h("div", { className: "admin-quick" }, exportLink("invoices", "Download invoices (CSV)"), exportLink("receipts", "Download payments received (CSV)")));
    panel.appendChild(renderRecurring());
    var sp = sitePayments();
    if (sp) panel.insertBefore(sp, panel.firstChild);
  }

  // ---------- payments made on the public website (deposits, care plans) ----------
  function sitePayments() {
    var list = (data.site_payments || []).filter(function (p) { return p.purpose !== "demo"; });
    if (!list.length) return null;
    var ul = h("ul", { className: "admin-list" });
    list.slice(0, 30).forEach(function (p) {
      var what = p.purpose === "care" ? "Care plan" + (p.plan ? " (" + p.plan + ")" : "") : "Deposit";
      var inv = p.invoice_id ? data.invoices.find(function (i) { return +i.id === +p.invoice_id; }) : null;
      var actions = h("span", { className: "row-actions" });
      if (p.status === "paid" && !p.invoice_id && data.clients.length) {
        var who = select([["", "Attach to client…"]].concat(clientOptions()));
        who.setAttribute("aria-label", "Client who made this payment");
        actions.appendChild(who);
        actions.appendChild(h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () {
          if (!who.value) return toast("Choose the client first.", true);
          save("site_payment_link", { id: p.id, client_id: who.value });
        }, text: "Attach" }));
      }
      ul.appendChild(h("li", null,
        h("div", null, h("strong", { text: what + " · " + ksh(p.paid_amount || p.amount) + " · " + (p.name || "No name") }),
          h("span", { className: "portal-meta", text: p.phone + " · " + day(p.created_at) + (p.receipt ? " · M-Pesa " + p.receipt : "") + (inv ? " · on invoice " + inv.number : "") + (p.referred_by ? " · referred " + p.referred_by : "") })),
        h("span", { className: "pill pill-" + (p.status === "paid" ? "paid" : p.status === "failed" ? "unpaid" : "review"), text: p.status === "paid" ? (p.invoice_id ? "Paid · attached" : "Paid") : p.status === "failed" ? "Not paid" : "Waiting" }),
        actions));
    });
    return h("section", { className: "admin-panel", "aria-labelledby": "sp-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "sp-title", text: "Website payments" })),
      h("p", { className: "portal-meta", text: "Deposits and care plans paid with the M-Pesa forms on the website. Attach a paid one to a client to give them a receipt and keep it in their account." }), ul);
  }

  var TABS = ["overview", "reports", "leads", "quotes", "growth", "projects", "clients", "invoices", "domains", "support", "courses", "learn", "activity"];
  var TAB_NAMES = { overview: "Overview", reports: "Reports", leads: "Leads", quotes: "Quotes", growth: "Growth", projects: "Projects", clients: "People", invoices: "Invoices", domains: "Domains & hosting", support: "Support", courses: "Courses", learn: "Learning hub", activity: "Activity & system" };
  // Which area each tab belongs to (staff only see the areas the owner gave them)
  var TAB_PERM = { reports: "money", leads: "leads", quotes: "money", growth: "leads", projects: "projects", clients: "clients", invoices: "money", domains: "money", support: "support", courses: "courses", learn: "courses", activity: "owner" };
  var tabAllowed = function (name) { var p = TAB_PERM[name]; return !p || (p === "owner" ? me.role === "admin" : can(p)); };
  var KINDS = { domain: "Domain", hosting: "Hosting", ssl: "SSL certificate", email: "Email", other: "Other" };

  // ---------- search and filter for admin lists ----------
  var FILTERS = {};
  /** A search box (and optional status menu) that hides items in `panel` matching `selector`. Remembers its values across reloads. */
  function filterBar(panel, selector, label, statuses) {
    var state = FILTERS[label] || (FILTERS[label] = { q: "", s: "" });
    var q = h("input", { type: "search", value: state.q, placeholder: "Search " + label + "…", "aria-label": "Search " + label });
    var st = statuses ? select([["", "All"]].concat(statuses), state.s) : null;
    if (st) st.setAttribute("aria-label", "Show " + label + " by status");
    var count = h("span", { className: "filter-count", "aria-live": "polite" });
    var run = function () {
      state.q = q.value; if (st) state.s = st.value;
      var words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var items = panel.querySelectorAll(selector), shown = 0;
      items.forEach(function (el) {
        var ok = words.every(function (w) { return el.textContent.toLowerCase().indexOf(w) >= 0; }) && (!st || !st.value || el.getAttribute("data-status") === st.value);
        el.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = words.length || (st && st.value) ? shown + " of " + items.length + " shown" : items.length + " in total";
    };
    q.addEventListener("input", run);
    if (st) st.addEventListener("change", run);
    return { bar: h("div", { className: "admin-filter" }, h("i", { className: "fa-solid fa-magnifying-glass", "aria-hidden": "true" }), q, st, count), run: run };
  }

  function exportLink(type, label) {
    return h("a", { className: "btn btn-ghost", href: API + "?action=export&type=" + type, download: "" },
      h("i", { className: "fa-solid fa-file-csv", "aria-hidden": "true" }), " " + label);
  }

  // ---------- quick start: client + project + deposit invoice ----------
  function quickStart() {
    var f = {
      name: h("input", { maxlength: "120", autocomplete: "off" }), email: h("input", { type: "email", maxlength: "190", autocomplete: "off" }),
      phone: h("input", { type: "tel", maxlength: "30" }), title: h("input", { maxlength: "160", placeholder: "e.g. School website with M-Pesa" }),
      total: h("input", { type: "number", min: "1", placeholder: "Agreed total in KSh" }), pct: h("input", { type: "number", min: "0", max: "100", value: "50" }),
      due: h("input", { type: "number", min: "0", max: "60", value: "7" })
    };
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      api("quick_start", { method: "POST", body: { name: f.name.value, email: f.email.value, phone: f.phone.value, title: f.title.value, total: f.total.value, deposit_percent: f.pct.value, due_days: f.due.value, lead_id: +($("quick-start").getAttribute("data-lead") || 0) } })
        .then(function (r) { toast(r.invoice ? "Set up. Deposit invoice " + r.invoice + " was sent to the client." : "Client and project set up."); load(); })
        .catch(function (err) { toast(err.message, true); });
    } },
      h("p", { className: "full portal-meta", text: "When a client accepts a quote: this adds them (or finds them by email), creates the project and sends the deposit invoice, all at once." }),
      field("Client name", f.name), field("Google email", f.email), field("Phone (for M-Pesa and SMS)", f.phone), field("Project name", f.title),
      field("Agreed total (KSh)", f.total), field("Deposit (%)", f.pct), field("Deposit due in (days)", f.due),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid" }, h("i", { className: "fa-solid fa-bolt", "aria-hidden": "true" }), " Set it all up")));
    return h("details", { className: "admin-panel quick-start", id: "quick-start" },
      h("summary", null, h("i", { className: "fa-solid fa-bolt", "aria-hidden": "true" }), " Quick start: new client, project and deposit invoice"), form);
  }

  // ---------- monthly (recurring) invoices ----------
  function renderRecurring() {
    var rec = data.recurring || [];
    var client = select(clientOptions());
    var project = select([["", "No project"]].concat(data.projects.map(function (p) { return [p.id, p.title]; })));
    var desc = h("input", { maxlength: "300", placeholder: "e.g. Website care plan" });
    var amount = h("input", { type: "number", min: "1" });
    var dom = h("input", { type: "number", min: "1", max: "28", value: "1" });
    var dueDays = h("input", { type: "number", min: "0", max: "60", value: "7" });
    var form = h("form", { className: "form", onsubmit: function (e) {
      e.preventDefault();
      api("recurring_save", { method: "POST", body: { client_id: client.value, project_id: project.value, description: desc.value, amount: amount.value, day_of_month: dom.value, due_days: dueDays.value } })
        .then(function (r) { toast("Saved. The first invoice goes out on " + day(r.next_date) + "."); load(); })
        .catch(function (err) { toast(err.message, true); });
    } },
      field("Client", client), field("Project", project), field("Description", desc), field("Amount each month (KSh)", amount),
      field("Invoice on day of the month (1–28)", dom), field("Due after (days)", dueDays),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Add monthly invoice" })));
    var list = h("ul", { className: "admin-list" });
    rec.forEach(function (r) {
      var c = data.clients.find(function (x) { return +x.id === +r.client_id; }) || {};
      var on = +r.active === 1;
      list.appendChild(h("li", null,
        h("div", null, h("strong", { text: r.description + " · " + ksh(r.amount) }),
          h("span", { className: "portal-meta", text: (c.name || "?") + " · day " + r.day_of_month + " of each month · " + (on ? "next " + day(r.next_date) : "paused") })),
        h("span", { className: "row-actions" },
          h("button", { type: "button", className: "linklike", onclick: function () { save("recurring_toggle", { id: r.id, active: !on }); }, text: on ? "Pause" : "Resume" }),
          h("button", { type: "button", className: "linklike danger", onclick: function () { remove("recurring", r.id); }, text: "Delete" }))));
    });
    return h("section", { className: "admin-panel", "aria-labelledby": "rec-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "rec-title", text: "Monthly invoices (care plans)" })),
      h("p", { className: "portal-meta", text: "Each month the invoice is created and sent automatically, with an M-Pesa pay button. Reminders go out before and after the due date." }),
      form, rec.length ? list : h("p", { className: "portal-empty", text: "No monthly invoices yet." }));
  }



  // ---------- growth: referrals, website reviews, mailing list, chat questions ----------
  function renderGrowth() {
    var panel = $("panel-growth");
    panel.textContent = "";
    // Referrals
    var refs = data.referrals || [];
    var rl = h("ul", { className: "admin-list" });
    refs.forEach(function (r) {
      rl.appendChild(h("li", null,
        h("div", null, h("strong", { text: r.referrer_name + " → " + r.referred_name + " · " + ksh(r.amount) }),
          h("span", { className: "portal-meta", text: "Send to " + r.referrer_phone + " · code " + r.code + " · " + day(r.created_at) + (r.note ? " · " + r.note : "") })),
        h("span", { className: "pill pill-" + (r.status === "paid" ? "paid" : r.status === "due" ? "unpaid" : r.status === "pending" ? "build" : "on_hold"), text: r.status === "due" ? "Reward due" : r.status === "paid" ? "Paid " + day(r.paid_at) : r.status === "pending" ? "Client paid · waiting for work to finish" : "Not due" }),
        r.status === "pending" ? h("span", { className: "row-actions" },
          h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () { if (confirm("Is the work for " + r.referred_name + " done? The reward becomes due.")) save("referral_ready", { id: r.id }); }, text: "Work done" }),
          h("button", { type: "button", className: "linklike danger", onclick: function () {
            var why = prompt("Why is no reward due?", "Not a genuine referral");
            if (why) save("referral_void", { id: r.id, note: why });
          }, text: "Not due" })) : null,
        r.status === "due" ? h("span", { className: "row-actions" },
          h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () {
            var ref = prompt("M-Pesa code of the reward you sent to " + r.referrer_name + " (optional):", "");
            if (ref !== null) save("referral_paid", { id: r.id, note: ref });
          }, text: "Mark paid" }),
          h("button", { type: "button", className: "linklike danger", onclick: function () {
            var why = prompt("Why is no reward due?", "Not a genuine referral");
            if (why) save("referral_void", { id: r.id, note: why });
          }, text: "Not due" })) : null));
    });
    panel.appendChild(h("section", { className: "admin-panel", "aria-labelledby": "ref-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "ref-title", text: "Referrals" }), h("span", { className: "portal-meta", text: (data.referrers || 0) + " people have a referral link" })),
      h("p", { className: "portal-meta", text: "When someone who came through a referral link pays, it shows here as waiting. The reward becomes due when their project is marked Live (or you click Work done), and you get an email. Send it by M-Pesa, then mark it paid (the referrer gets an SMS if SMS is set up)." }),
      refs.length ? rl : h("p", { className: "portal-empty", text: "No referral rewards yet." })));

    // Reviews for the website
    var fb = (data.feedback || []).filter(function (f) { return +f.rating >= 4 && f.comment; });
    var fl = h("ul", { className: "admin-list" });
    fb.forEach(function (f) {
      var p = data.projects.find(function (x) { return +x.id === +f.project_id; }) || {};
      fl.appendChild(h("li", null,
        h("div", null, h("strong", { text: "★★★★★".slice(0, +f.rating) + " " + f.client + " · " + (p.title || "") }), h("span", { className: "lead-msg", text: "“" + f.comment + "”" })),
        +f.publish_ok ? h("label", { className: "check" }, h("input", { type: "checkbox", checked: +f.published === 1, onchange: function (e) { save("feedback_publish", { id: f.id, published: e.target.checked }); } }), h("span", { text: " Show on website" }))
          : h("span", { className: "portal-meta", text: "Client didn’t agree to show it" })));
    });
    panel.appendChild(h("section", { className: "admin-panel", "aria-labelledby": "rev-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "rev-title", text: "Reviews for the website" })),
      h("p", { className: "portal-meta", text: "4–5 star ratings with a comment. Tick “Show on website” and the review appears in the testimonials, marked “Verified client”. Only possible when the client agreed." }),
      fb.length ? fl : h("p", { className: "portal-empty", text: "Reviews appear here after projects go live and clients rate them." })));

    // Mailing list
    var subs = data.subscribers || [];
    var active = subs.filter(function (x) { return x.status === "subscribed"; }).length;
    var subj = h("input", { maxlength: "200", placeholder: "e.g. New web development class starts 3 November" });
    var body = h("textarea", { rows: "7", maxlength: "20000", placeholder: "Write your message. Keep it short and useful. An unsubscribe link is added automatically." });
    var aC = h("input", { type: "checkbox", value: "clients" }), aS = h("input", { type: "checkbox", value: "students" });
    var sendMail = function (test) {
      var aud = [aC, aS].filter(function (x) { return x.checked; }).map(function (x) { return x.value; });
      if (!test && !confirm("Send this email now?")) return;
      api("campaign_send", { method: "POST", body: { subject: subj.value, body: body.value, audience: aud, test: !!test } })
        .then(function (r) { toast(r.test ? "Test sent to your email." : "Sending to " + r.total + " people (" + r.sent_now + " now, the rest within the hour)."); if (!r.test) load(); })
        .catch(function (e) { toast(e.message, true); });
    };
    var camp = (data.campaigns || []).map(function (c) { return h("li", null, h("div", null, h("strong", { text: c.subject }), h("span", { className: "portal-meta", text: day(c.created_at) + " · sent " + c.sent + " of " + c.total + " · " + c.audience })) ); });
    panel.appendChild(h("section", { className: "admin-panel", "aria-labelledby": "mail-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "mail-title", text: "Mailing list" }), h("span", { className: "portal-meta", text: active + " subscribed" })),
      h("p", { className: "portal-meta", text: "People join from the sign-up box in the website footer and confirm by email. Every email includes a one-click unsubscribe link." }),
      h("form", { className: "form", onsubmit: function (e) { e.preventDefault(); sendMail(false); } },
        field("Subject", subj), h("div", { className: "field full" }, h("label", { for: "mail-body", text: "Message" }), body),
        h("fieldset", { className: "field full perm-list" }, h("legend", { text: "Also send to" }),
          h("label", { className: "check" }, aC, h("span", { text: " Clients with projects" })), h("label", { className: "check" }, aS, h("span", { text: " Students" }))),
        h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Send" }),
          h("button", { type: "button", className: "btn btn-ghost", onclick: function () { sendMail(true); }, text: "Send me a test" }))),
      camp.length ? h("ul", { className: "admin-list" }, camp) : null,
      subs.length ? h("details", null, h("summary", { className: "panel-summary", text: "Subscribers (" + subs.length + ")" }),
        h("ul", { className: "admin-list" }, subs.map(function (x) {
          return h("li", null, h("div", null, h("strong", { text: x.email }), h("span", { className: "portal-meta", text: (x.name ? x.name + " · " : "") + x.status + " · " + day(x.created_at) })),
            x.status !== "unsubscribed" ? h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Unsubscribe " + x.email + "?")) remove("subscriber", x.id); }, text: "Unsubscribe" }) : null);
        }))) : null));
    body.id = "mail-body";

    // Questions the chat couldn't answer
    var qs = data.chat_questions || [];
    var ql = h("ul", { className: "admin-list" });
    qs.forEach(function (x) {
      ql.appendChild(h("li", null, h("div", null, h("strong", { text: x.question }), h("span", { className: "portal-meta", text: "Asked " + x.times + (+x.times === 1 ? " time" : " times") + " · last " + day(x.last_at) })),
        h("button", { type: "button", className: "linklike", onclick: function () { remove("chat_question", x.id); }, text: "Done" })));
    });
    panel.appendChild(h("section", { className: "admin-panel", "aria-labelledby": "cq-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "cq-title", text: "Questions the chat couldn’t answer" })),
      h("p", { className: "portal-meta", text: "Add answers for common ones to data/knowledge.json on the server, then tick them off here. Names, numbers and emails are removed before saving." }),
      qs.length ? ql : h("p", { className: "portal-empty", text: "Nothing yet. The chat is answering everything." })));
  }

  // ---------- leads ----------
  var LEAD_STAGES = [["new", "New"], ["contacted", "Contacted"], ["quoted", "Quoted"], ["won", "Won"], ["lost", "Lost"]];
  function renderLeads() {
    var panel = $("panel-leads");
    panel.textContent = "";
    var leads = data.leads || [];
    var name = h("input", { maxlength: "120" }), email = h("input", { type: "email", maxlength: "190" }), phone = h("input", { type: "tel", maxlength: "30" });
    var source = h("input", { maxlength: "60", placeholder: "e.g. Referral, Facebook, walk-in" }), value = h("input", { type: "number", min: "0", placeholder: "Estimated KSh" });
    var msg = h("textarea", { rows: "2", maxlength: "4000" });
    var add = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      save("lead_save", { name: name.value, email: email.value, phone: phone.value, source: source.value, value: value.value, message: msg.value, status: "new" }, add);
    } }, field("Name", name), field("Email", email), field("Phone", phone), field("Where they came from", source), field("Estimated value", value),
      h("div", { className: "field full" }, h("label", { for: "lead-msg", text: "What they need" }), msg),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Add lead" })));
    msg.id = "lead-msg";
    panel.appendChild(h("details", { className: "admin-panel" }, h("summary", { className: "panel-summary", text: "Add a lead by hand (phone call, walk-in)" }), add));
    panel.appendChild(h("p", { className: "portal-meta", text: "Every enquiry from the website’s forms and the chat call-back appears here automatically." }));
    var lf = filterBar(panel, ".lead-card", "leads");
    panel.appendChild(lf.bar);
    var board = h("div", { className: "lead-board" });
    LEAD_STAGES.forEach(function (st) {
      var items = leads.filter(function (l) { return l.status === st[0]; });
      var total = items.reduce(function (a, l) { return a + (+l.value || 0); }, 0);
      var col = h("section", { className: "lead-col lead-" + st[0], "aria-label": st[1] },
        h("h2", null, st[1] + " ", h("span", { className: "lead-count", text: String(items.length) })), total ? h("p", { className: "portal-meta", text: ksh(total) }) : null);
      items.forEach(function (l) { col.appendChild(leadCard(l)); });
      if (!items.length) col.appendChild(h("p", { className: "portal-empty", text: "None" }));
      board.appendChild(col);
    });
    panel.appendChild(board);
    lf.run();
  }
  function leadCard(l) {
    var st = select(LEAD_STAGES, l.status);
    st.setAttribute("aria-label", "Stage for " + l.name);
    st.addEventListener("change", function () { save("lead_status", { id: l.id, status: st.value }); });
    var notes = h("textarea", { rows: "2", maxlength: "4000", placeholder: "Notes (only your team sees these)", "aria-label": "Notes on " + l.name });
    notes.value = l.notes || "";
    return h("article", { className: "lead-card portal-card" },
      h("div", { className: "portal-card-head" }, h("h3", { text: l.name }), l.value > 0 ? h("span", { className: "pill pill-build", text: ksh(l.value) }) : null),
      h("p", { className: "portal-meta", text: (l.source || "Website") + " · " + day(l.created_at) }),
      h("p", { className: "row-actions" },
        l.phone ? h("a", { className: "linklike", href: waTo(l.phone, "Hello " + l.name + ", this is Marzley Tech Solutions. Thank you for reaching out!"), target: "_blank", rel: "noopener noreferrer", text: "WhatsApp" }) : null,
        l.phone ? h("a", { className: "linklike", href: "tel:" + l.phone.replace(/[^\d+]/g, ""), text: "Call" }) : null,
        l.email ? h("a", { className: "linklike", href: "mailto:" + l.email, text: "Email" }) : null),
      l.message ? h("details", null, h("summary", { text: "What they asked" }), h("p", { className: "lead-msg", text: l.message })) : null,
      st,
      h("form", { className: "inline-form", onsubmit: function (e) {
        e.preventDefault();
        save("lead_save", { id: l.id, name: l.name, email: l.email, phone: l.phone, source: l.source, message: l.message, status: l.status, value: l.value, notes: notes.value });
      } }, notes, h("button", { type: "submit", className: "btn btn-ghost btn-sm", text: "Save notes" })),
      l.status !== "won" && l.status !== "lost" ? h("div", { className: "row-actions" },
        can("money") ? h("button", { type: "button", className: "linklike", onclick: function () { selectTab("quotes"); renderQuotes({ lead_id: l.id, client_name: l.name, client_email: l.email, client_phone: l.phone, title: "", items: "[]", deposit_percent: 50 }); }, text: "Make a quote" }) : null,
        can("money") ? h("button", { type: "button", className: "linklike", onclick: function () { selectTab("clients"); var qs = $("quick-start"); if (qs) { qs.open = true; var i = qs.querySelectorAll("input"); i[0].value = l.name; i[1].value = l.email; i[2].value = l.phone; qs.setAttribute("data-lead", l.id); i[3].focus(); } }, text: "Won: quick start" }) : null,
        h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Delete this lead?")) remove("lead", l.id); }, text: "Delete" })) : null);
  }

  // ---------- quotes ----------
  var QUOTE_STATUS = { draft: "Draft", sent: "Sent", accepted: "Accepted", declined: "Declined" };
  function renderQuotes(edit) {
    var panel = $("panel-quotes");
    panel.textContent = "";
    edit = edit || {};
    var items = [];
    try { items = JSON.parse(edit.items || "[]"); } catch (e) {}
    if (!items.length) items = [{ desc: "", qty: 1, price: "" }];
    var cname = h("input", { maxlength: "120", value: edit.client_name || "" }), cemail = h("input", { type: "email", maxlength: "190", value: edit.client_email || "" });
    var cphone = h("input", { type: "tel", maxlength: "30", value: edit.client_phone || "" }), title = h("input", { maxlength: "160", value: edit.title || "", placeholder: "e.g. Online shop with M-Pesa" });
    var pct = h("input", { type: "number", min: "0", max: "100", value: String(edit.deposit_percent !== undefined ? edit.deposit_percent : 50) });
    var valid = h("input", { type: "date", value: edit.valid_until || ymd(new Date(Date.now() + 30 * 864e5)) });
    var notes = h("textarea", { rows: "3", maxlength: "4000", placeholder: "Timeline, what’s included, what the client provides…" });
    notes.value = edit.notes || "";
    var rows = h("tbody"), totalOut = h("strong");
    var calc = function () {
      var tot = 0;
      rows.querySelectorAll("tr").forEach(function (tr) { var i = tr.querySelectorAll("input"); tot += (+i[1].value || 0) * (+i[2].value || 0); });
      totalOut.textContent = ksh(tot);
    };
    var addRow = function (it) {
      var tr = h("tr", null,
        h("td", null, h("input", { maxlength: "200", value: it.desc || "", "aria-label": "Item", placeholder: "e.g. 5-page website design and build" })),
        h("td", null, h("input", { type: "number", min: "1", value: String(it.qty || 1), "aria-label": "Quantity" })),
        h("td", null, h("input", { type: "number", min: "0", value: it.price === "" ? "" : String(it.price || ""), "aria-label": "Price (KSh)" })),
        h("td", null, h("button", { type: "button", className: "linklike danger", "aria-label": "Remove item", onclick: function () { tr.remove(); calc(); }, text: "×" })));
      tr.addEventListener("input", calc);
      rows.appendChild(tr);
    };
    items.forEach(addRow);
    var form = h("form", { className: "form portal-form quote-form", onsubmit: function (e) {
      e.preventDefault();
      var list = [];
      rows.querySelectorAll("tr").forEach(function (tr) { var i = tr.querySelectorAll("input"); list.push({ desc: i[0].value, qty: i[1].value, price: i[2].value }); });
      api("quote_save", { method: "POST", body: { id: edit.id || 0, lead_id: edit.lead_id || 0, client_name: cname.value, client_email: cemail.value, client_phone: cphone.value, title: title.value,
        items: list, deposit_percent: pct.value, valid_until: valid.value, notes: notes.value } })
        .then(function (r) { toast("Quote saved. Use Send to email it, or copy the link."); load(); }).catch(function (x) { toast(x.message, true); });
    } },
      h("h2", { className: "full", text: edit.id ? "Edit quote" : "New quote" }),
      field("Client name or business", cname), field("Client’s Google email", cemail), field("Phone", cphone), field("What it’s for", title),
      h("div", { className: "field full" }, h("span", { className: "field-label", text: "Items" }),
        h("div", { className: "table-wrap" }, h("table", { className: "portal-table quote-items" }, h("thead", null, h("tr", null, h("th", { text: "Item" }), h("th", { text: "Qty" }), h("th", { text: "Price (KSh)" }), h("th", { text: "" }))), rows)),
        h("p", { className: "quote-total" }, h("button", { type: "button", className: "linklike", onclick: function () { addRow({ desc: "", qty: 1, price: "" }); }, text: "+ Add item" }), h("span", null, "Total: ", totalOut))),
      field("Deposit (%)", pct), field("Valid until", valid),
      h("div", { className: "field full" }, h("label", { for: "q-notes", text: "Notes shown on the quote" }), notes),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Save quote" }),
        edit.id || edit.lead_id ? h("button", { type: "button", className: "btn btn-ghost", onclick: function () { renderQuotes(); }, text: "Cancel" }) : null));
    notes.id = "q-notes";
    panel.appendChild(form);
    calc();
    var quotes = data.quotes || [];
    if (!quotes.length) { panel.appendChild(h("p", { className: "portal-empty", text: "No quotes yet." })); return; }
    var qf = filterBar(panel, ".admin-list > li", "quotes", Object.keys(QUOTE_STATUS).map(function (k) { return [k, QUOTE_STATUS[k]]; }));
    panel.appendChild(qf.bar);
    var ul = h("ul", { className: "admin-list" });
    quotes.forEach(function (q) {
      var link = location.origin + location.pathname.replace(/[^/]*$/, "") + "quote.php?t=" + q.token;
      ul.appendChild(h("li", { "data-status": q.status },
        h("div", null, h("strong", { text: q.title + " · " + ksh(q.total) }),
          h("span", { className: "portal-meta", text: q.client_name + " · " + QUOTE_STATUS[q.status] + (q.accepted_at ? " by " + q.accepted_name + " on " + day(q.accepted_at) : "") + (q.valid_until && q.status !== "accepted" ? " · valid until " + day(q.valid_until) : "") })),
        h("span", { className: "row-actions" },
          h("a", { className: "linklike", href: link, target: "_blank", rel: "noopener", text: "Open" }),
          h("button", { type: "button", className: "linklike", onclick: function () { (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { toast("Link copied."); }, function () { prompt("Copy this link:", link); }); }, text: "Copy link" }),
          q.status === "draft" || q.status === "sent" ? h("button", { type: "button", className: "linklike", onclick: function () { api("quote_send", { method: "POST", body: { id: q.id } }).then(function () { toast("Quote emailed" + (q.client_phone ? " and texted" : "") + " to " + q.client_name + "."); load(); }).catch(function (x) { toast(x.message, true); }); }, text: q.status === "sent" ? "Send again" : "Send" }) : null,
          q.client_phone ? h("a", { className: "linklike", href: waTo(q.client_phone, "Hello " + q.client_name + ", here is your quote from Marzley Tech Solutions: " + link), target: "_blank", rel: "noopener noreferrer", text: "WhatsApp" }) : null,
          q.status !== "accepted" ? h("button", { type: "button", className: "linklike", onclick: function () { renderQuotes(q); window.scrollTo(0, 0); }, text: "Edit" }) : null,
          q.status !== "accepted" ? h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Delete this quote?")) remove("quote", q.id); }, text: "Delete" }) : null)));
    });
    panel.appendChild(ul);
    qf.run();
  }

  // ---------- domains and hosting ----------
  function renderDomains(edit) {
    var panel = $("panel-domains");
    panel.textContent = "";
    edit = edit || {};
    if (!data.clients.length) { panel.appendChild(h("p", { className: "portal-empty", text: "Add a client first (People tab)." })); return; }
    var client = select(clientOptions(), edit.client_id), name = h("input", { maxlength: "190", value: edit.name || "", placeholder: "e.g. wanjikusupplies.co.ke" });
    var kind = select(Object.keys(KINDS).map(function (k) { return [k, KINDS[k]]; }), edit.kind || "domain");
    var exp = h("input", { type: "date", value: edit.expires_on || "" }), price = h("input", { type: "number", min: "0", value: edit.renew_price || "", placeholder: "KSh per year" });
    var auto = h("input", { type: "checkbox" });
    auto.checked = edit.id ? +edit.auto_invoice === 1 : true;
    var url = h("input", { type: "url", maxlength: "300", value: edit.monitor_url || "", placeholder: "https://… (optional)" }), notes = h("input", { maxlength: "500", value: edit.notes || "", placeholder: "Registrar, login location… (optional)" });
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      save("domain_save", { id: edit.id || 0, client_id: client.value, name: name.value, kind: kind.value, expires_on: exp.value, renew_price: price.value, auto_invoice: auto.checked, monitor_url: url.value, notes: notes.value }, form)
        .then(function () { renderDomains(); });
    } },
      h("h2", { className: "full", text: edit.id ? "Edit " + edit.name : "Track a domain, hosting or SSL" }),
      field("Client", client), field("Name", name), field("Type", kind), field("Expires on", exp), field("Renewal price (KSh)", price), field("Website to monitor", url), field("Notes", notes),
      h("label", { className: "check full" }, auto, h("span", { text: " Send the renewal invoice automatically 30 days before expiry" })),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: edit.id ? "Save changes" : "Add" }),
        edit.id ? h("button", { type: "button", className: "btn btn-ghost", onclick: function () { renderDomains(); }, text: "Cancel" }) : null));
    panel.appendChild(form);
    var list = data.domains || [];
    if (!list.length) { panel.appendChild(h("p", { className: "portal-empty", text: "Nothing tracked yet. Reminders go to you and the client 30 and 7 days before each expiry date." })); return; }
    var df = filterBar(panel, "tbody tr", "domains");
    panel.appendChild(df.bar);
    var body = h("tbody");
    var month = ymd(new Date()).slice(0, 7);
    list.forEach(function (d) {
      var c = data.clients.find(function (x) { return +x.id === +d.client_id; }) || {};
      var left = Math.round((new Date(d.expires_on + "T00:00:00") - new Date(ymd(new Date()) + "T00:00:00")) / 864e5);
      var up = (data.uptime || []).filter(function (u) { return +u.domain_id === +d.id && u.month === month; })[0];
      body.appendChild(h("tr", null,
        h("td", { "data-label": "Name" }, h("strong", { text: d.name }), h("small", { className: "balance", text: KINDS[d.kind] })),
        h("td", { "data-label": "Client", text: c.name || "?" }),
        h("td", { "data-label": "Expires" }, day(d.expires_on), " ", h("span", { className: "pill " + (left < 0 ? "pill-unpaid" : left <= 30 ? "pill-review" : "pill-paid"), text: left < 0 ? "expired" : left + " days" })),
        h("td", { "data-label": "Renewal", className: "r", text: +d.renew_price ? ksh(d.renew_price) : "—" }),
        h("td", { "data-label": "Website" }, d.monitor_url ? h("span", { className: "pill " + (d.last_status === "down" ? "pill-unpaid" : "pill-paid"), text: (d.last_status === "down" ? "Down" : "Up") + (up ? " · " + (100 * up.ok / up.checks).toFixed(2) + "%" : "") }) : "—"),
        h("td", null, h("span", { className: "row-actions" },
          h("button", { type: "button", className: "linklike", onclick: function () { if (confirm("Mark " + d.name + " as renewed for another year?")) save("domain_renewed", { id: d.id }); }, text: "Renewed +1 year" }),
          h("button", { type: "button", className: "linklike", onclick: function () { careReport(d.client_id, month); }, text: "Care report" }),
          h("button", { type: "button", className: "linklike", onclick: function () { renderDomains(d); window.scrollTo(0, 0); }, text: "Edit" }),
          h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Stop tracking " + d.name + "?")) remove("domain", d.id); }, text: "Delete" })))));
    });
    panel.appendChild(h("div", { className: "table-wrap" }, h("table", { className: "portal-table" },
      h("thead", null, h("tr", null, h("th", { text: "Name" }), h("th", { text: "Client" }), h("th", { text: "Expires" }), h("th", { className: "r", text: "Renewal" }), h("th", { text: "Website (this month)" }), h("th", { text: "" }))), body)));
    df.run();
  }

  // ---------- monthly care report (printable) ----------
  function careReport(clientId, month) {
    var inMonth = function (s) { return String(s || "").slice(0, 7) === month; };
    var client = isTeam() ? (data.clients.find(function (c) { return +c.id === +clientId; }) || {}) : (data.me || {});
    var projects = data.projects.filter(function (p) { return +p.client_id === +clientId; });
    var pids = projects.map(function (p) { return +p.id; });
    var ups = data.updates.filter(function (u) { return pids.indexOf(+u.project_id) >= 0 && inMonth(u.created_at); });
    var tickets = (data.tickets || []).filter(function (tk) { return +tk.client_id === +clientId && (inMonth(tk.created_at) || inMonth(tk.updated_at)); });
    var sites = (data.domains || []).filter(function (d) { return +d.client_id === +clientId; });
    var paid = (data.payments || []).filter(function (p) { var inv = data.invoices.find(function (i) { return +i.id === +p.invoice_id; }); return inv && +inv.client_id === +clientId && p.status === "confirmed" && inMonth(p.decided_at); });
    var label = new Date(month + "-01T00:00:00").toLocaleDateString("en-KE", { month: "long", year: "numeric" });
    var siteRows = sites.map(function (d) {
      var u = (data.uptime || []).filter(function (x) { return +x.domain_id === +d.id && x.month === month; })[0];
      return "<tr><td>" + esc(d.name) + "<br><span class=\"muted\">" + esc(KINDS[d.kind]) + "</span></td><td>" + (u ? (100 * u.ok / u.checks).toFixed(2) + "%" : "—") + "</td><td>" + (u ? esc(u.avg_ms) + " ms" : "—") + "</td><td>" + esc(day(d.expires_on)) + "</td></tr>";
    }).join("");
    var css = ".page{max-width:800px;margin:24px auto;background:#fff;padding:48px;border-radius:14px;box-shadow:0 10px 30px rgba(11,27,53,.12)}.top{display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid #ffb800;padding-bottom:20px}" +
      ".brand{display:flex;gap:14px;align-items:center}.brand img{width:56px;height:56px;border-radius:50%}.brand b{font-size:20px;color:#0b1b35}.brand b span{color:#d49a00}h1{margin:0;font-size:26px;color:#0b1b35;text-align:right}h2{font-size:17px;color:#0b1b35;margin:28px 0 10px}" +
      ".muted{color:#475569;font-size:13px}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px}.kpis div{background:#f8fafc;border-radius:10px;padding:14px}.kpis b{display:block;font-size:24px;color:#0b1b35}" +
      "table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #e2e8f0;text-align:left;font-size:14px}th{background:#0b1b35;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.06em}ul{padding-left:18px}li{margin:6px 0}.foot{margin-top:28px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#475569}";
    var avgUp = sites.map(function (d) { return (data.uptime || []).filter(function (x) { return +x.domain_id === +d.id && x.month === month; })[0]; }).filter(Boolean);
    var upPct = avgUp.length ? (100 * avgUp.reduce(function (a, u) { return a + +u.ok; }, 0) / avgUp.reduce(function (a, u) { return a + +u.checks; }, 0)).toFixed(2) + "%" : "—";
    var body = "<div class=\"page\"><div class=\"top\"><div class=\"brand\"><img src=\"" + esc(logoUrl()) + "\" alt=\"\"><div><b>Marzley<span>Tech</span> Solutions</b><div class=\"muted\">Monthly care report</div></div></div>" +
      "<div><h1>" + esc(label) + "</h1><div class=\"muted\">" + esc(client.name) + "</div></div></div>" +
      "<div class=\"kpis\"><div><b>" + upPct + "</b><span class=\"muted\">Website uptime</span></div><div><b>" + ups.length + "</b><span class=\"muted\">Updates and changes</span></div><div><b>" + tickets.length + "</b><span class=\"muted\">Support requests</span></div></div>" +
      (sites.length ? "<h2>Websites and services</h2><table><thead><tr><th>Name</th><th>Uptime</th><th>Avg. response</th><th>Renews</th></tr></thead><tbody>" + siteRows + "</tbody></table>" : "") +
      "<h2>Work done this month</h2>" + (ups.length ? "<ul>" + ups.map(function (u) { return "<li><b>" + esc(day(u.created_at)) + ":</b> " + esc(u.message) + "</li>"; }).join("") + "</ul>" : "<p class=\"muted\">No changes were needed this month. Everything was checked and kept up to date.</p>") +
      (tickets.length ? "<h2>Support</h2><ul>" + tickets.map(function (tk) { return "<li>" + esc(tk.subject) + " · " + (tk.status === "closed" ? "solved" : "in progress") + "</li>"; }).join("") + "</ul>" : "") +
      (paid.length ? "<h2>Payments received</h2><ul>" + paid.map(function (p) { return "<li>" + esc(ksh(p.amount)) + " · " + esc(day(p.decided_at)) + (p.reference ? " · " + esc(p.reference) : "") + "</li>"; }).join("") + "</ul>" : "") +
      "<div class=\"foot\">Questions about this report? Call or WhatsApp +254 745 789 590 · marzleytechsolutions.co.ke</div></div>";
    printDoc("Care report " + label + " · " + (client.name || ""), css, body);
  }

  // ---------- team (owner only) ----------
  function teamPanel() {
    var PERMS = { projects: "Projects & files", clients: "People", support: "Support", courses: "Courses", money: "Invoices, payments & quotes", leads: "Leads" };
    var name = h("input", { maxlength: "120" }), email = h("input", { type: "email", maxlength: "190" });
    var boxes = Object.keys(PERMS).map(function (k) { return h("label", { className: "check" }, h("input", { type: "checkbox", value: k }), h("span", { text: " " + PERMS[k] })); });
    var form = h("form", { className: "form", onsubmit: function (e) {
      e.preventDefault();
      var perms = boxes.map(function (b) { return b.querySelector("input"); }).filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
      save("staff_save", { name: name.value, email: email.value, perms: perms }, form);
    } }, field("Name", name), field("Their Google email", email),
      h("fieldset", { className: "field full perm-list" }, h("legend", { text: "What they can work on" }), boxes),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Add or update" })));
    var ul = h("ul", { className: "admin-list" });
    (data.staff || []).forEach(function (st) {
      ul.appendChild(h("li", null, h("div", null, h("strong", { text: st.name }), h("span", { className: "portal-meta", text: st.email + " · " + st.perms.split(",").map(function (p) { return PERMS[p] || p; }).join(", ") })),
        h("span", { className: "row-actions" },
          h("button", { type: "button", className: "linklike", onclick: function () { name.value = st.name; email.value = st.email; boxes.forEach(function (b) { var i = b.querySelector("input"); i.checked = st.perms.split(",").indexOf(i.value) >= 0; }); name.focus(); }, text: "Edit" }),
          h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Remove " + st.name + "? They are signed out at once.")) remove("staff", st.id); }, text: "Remove" }))));
    });
    return h("section", { className: "admin-panel", "aria-labelledby": "team-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "team-title", text: "Team" })),
      h("p", { className: "portal-meta", text: "Give a staff member their own sign-in with only the areas they need. Owners (in portal-config.php) can do everything. Staff never see the activity log, team or security settings." }),
      (data.staff || []).length ? ul : h("p", { className: "portal-empty", text: "No staff yet." }), form);
  }

  // ---------- activity log and system status ----------
  var ACTIONS = {
    sign_in: "Signed in", sign_out: "Signed out", sign_out_everywhere: "Signed out on all devices", client_save: "Saved a client", project_save: "Saved a project",
    update_add: "Posted an update", invoice_save: "Saved an invoice", file_upload: "Uploaded a file", "delete": "Deleted", approval_request: "Asked for approval",
    approval_decide: "Reviewed an approval", ticket_open: "Opened a support request", ticket_reply: "Replied to support", ticket_status: "Changed a support request",
    course_save: "Saved a course", lesson_save: "Added a lesson", enroll: "Enrolled a student", lesson_done: "Lesson progress", certificate_issue: "Issued a certificate",
    pay_invoice: "Started an M-Pesa payment", payment_started: "M-Pesa prompt sent", invoice_paid: "Invoice paid", payment_rejected: "Payment rejected",
    recurring_save: "Added a monthly invoice", recurring_toggle: "Paused or resumed a monthly invoice", recurring_invoice: "Monthly invoice created",
    quick_start: "Quick start", "export": "Downloaded a CSV", backup: "Backup made", part_payment: "Part payment", payment_record: "Recorded a payment",
    payment_claim: "Client reported a payment", payment_decide: "Confirmed or rejected a payment", card_started: "Card payment started", lead_received: "New website lead",
    lead_save: "Saved a lead", lead_status: "Moved a lead", quote_save: "Saved a quote", quote_send: "Sent a quote", quote_accepted: "Quote accepted",
    domain_save: "Saved a domain or hosting", website_payment: "Website payment", demo_paid: "Demo payment", referral_due: "Referral reward due",
    referral_paid: "Paid a referral reward", referral_void: "Referral not due", referrer_joined: "New referrer", feedback_publish: "Review shown/hidden",
    campaign_send: "Sent a newsletter", site_payment_link: "Attached a website payment", code_sent: "Sign-in code sent", domain_renewed: "Marked renewed", staff_save: "Changed team access", feedback: "Client feedback"
  };
  function renderActivity() {
    var panel = $("panel-activity");
    panel.textContent = "";
    var sys = data.system || {};
    var ago = function (s) {
      if (!s) return null;
      var hrs = (Date.now() - new Date(String(s).replace(" ", "T")).getTime()) / 36e5;
      return hrs < 1 ? "less than an hour ago" : hrs < 48 ? Math.round(hrs) + " hours ago" : Math.round(hrs / 24) + " days ago";
    };
    var fresh = function (s, hours) { return s && (Date.now() - new Date(String(s).replace(" ", "T")).getTime()) / 36e5 < hours; };
    var rows = [
      [fresh(sys.last_cron, 26), "Daily jobs (reminders, monthly invoices)", sys.last_cron ? "Last ran " + ago(sys.last_cron) : "Not set up yet: add the cron job in cPanel (see GO-LIVE.md)"],
      [fresh(sys.last_backup, 26), "Nightly backup", sys.last_backup ? "Last backup " + ago(sys.last_backup) : "Not set up yet: add the backup cron job in cPanel"],
      [sys.offsite && fresh(sys.last_offsite, 26), "Off-site copy", sys.offsite ? (sys.last_offsite ? "Last copied " + ago(sys.last_offsite) : "Set up, waiting for the first backup") : "Off: backups only exist on this server. Add offsite_backup in portal-config.php"],
      [!(data.domains || []).some(function (d) { return d.monitor_url; }) || fresh(sys.last_monitor, 2), "Website monitoring", (data.domains || []).some(function (d) { return d.monitor_url; }) ? (sys.last_monitor ? "Last check " + ago(sys.last_monitor) : "Add the hourly monitor cron job") : "No client websites monitored yet (Domains & hosting)"],
      [!!sys.paystack, "Card payments", sys.paystack ? "Paystack is connected" : "Off: add your Paystack secret key to accept cards on invoices"],
      [!!sys.smtp, "Email", sys.smtp ? "Sent through your mailbox (SMTP)" : "Using PHP mail(): add SMTP settings so emails don’t land in spam"],
      [!!sys.sms, "SMS", sys.sms ? "Africa’s Talking is connected" : "Off: add Africa’s Talking keys to send SMS"],
      [!!sys.mpesa, "M-Pesa", sys.mpesa ? "Connected" : "Not configured"],
      [!sys.staging, "Environment", sys.staging ? "Staging (test) site" : "Live site"]
    ];
    var status = h("ul", { className: "system-list" });
    rows.forEach(function (r) {
      status.appendChild(h("li", null, h("span", { className: "row-icon tone-" + (r[0] ? "green" : "amber") }, h("i", { className: "fa-solid " + (r[0] ? "fa-circle-check" : "fa-triangle-exclamation"), "aria-hidden": "true" })),
        h("span", { className: "row-text" }, h("strong", { text: r[1] }), h("small", { text: r[2] }))));
    });
    panel.appendChild(h("div", { className: "admin-columns" },
      h("section", { className: "admin-panel", "aria-labelledby": "sys-title" }, h("div", { className: "admin-panel-head" }, h("h2", { id: "sys-title", text: "System status" })), status),
      h("section", { className: "admin-panel", "aria-labelledby": "sec-title" },
        h("div", { className: "admin-panel-head" }, h("h2", { id: "sec-title", text: "Security and exports" })),
        h("p", { className: "portal-meta", text: "For safety you are signed out after " + (sys.idle_minutes || 30) + " minutes without activity. Lost a phone or used a shared computer? Sign out everywhere." }),
        h("div", { className: "admin-quick" },
          h("button", { type: "button", className: "btn btn-ghost", onclick: function () {
            if (!confirm("Sign out on every device, including this one?")) return;
            api("logout_all", { method: "POST" }).then(function () { location.reload(); }).catch(function (e) { toast(e.message, true); });
          } }, h("i", { className: "fa-solid fa-right-from-bracket", "aria-hidden": "true" }), " Sign out everywhere")),
        h("div", { className: "admin-quick" }, exportLink("clients", "Clients (CSV)"), exportLink("activity", "Activity log (CSV)")))));

    panel.appendChild(teamPanel());
    var log = data.audit || [];
    var sec = h("section", { className: "admin-panel", "aria-labelledby": "log-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "log-title", text: "Activity log" }), h("span", { className: "portal-meta", text: "Latest " + log.length })));
    if (!log.length) { sec.appendChild(h("p", { className: "portal-empty", text: "Changes will be listed here: who did what, and when." })); panel.appendChild(sec); return; }
    var body = h("tbody");
    log.forEach(function (a) {
      body.appendChild(h("tr", { "data-status": a.actor === "M-Pesa" || a.actor === "cron" ? "system" : "people" },
        h("td", { "data-label": "When", text: String(a.created_at).slice(0, 16).replace("T", " ") }),
        h("td", { "data-label": "Who", text: a.actor }),
        h("td", { "data-label": "What", text: ACTIONS[a.action] || a.action }),
        h("td", { "data-label": "Details", className: "log-detail", text: a.detail || "" })));
    });
    var lf = filterBar(sec, "tbody tr", "activity", [["people", "People"], ["system", "Automatic (M-Pesa, daily jobs)"]]);
    sec.appendChild(lf.bar);
    sec.appendChild(h("div", { className: "table-wrap" }, h("table", { className: "portal-table" },
      h("thead", null, h("tr", null, h("th", { text: "When" }), h("th", { text: "Who" }), h("th", { text: "What" }), h("th", { text: "Details" }))), body)));
    panel.appendChild(sec);
    lf.run();
  }
  function selectTab(name) {
    if (me && !tabAllowed(name)) return;
    TABS.forEach(function (t) {
      $("tab-" + t).setAttribute("aria-selected", String(t === name));
      $("tab-" + t).tabIndex = t === name ? 0 : -1;
      $("panel-" + t).hidden = t !== name;
    });
    $("admin-crumb-page").textContent = TAB_NAMES[name];
    // The chart is drawn at the panel's real width, so redraw it once it is visible
    if (name === "reports" && data) renderReports();
    if (name === "learn" && !learnData) { renderLearn(); loadLearn(); }
    window.scrollTo(0, 0);
  }
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (data && !$("panel-reports").hidden) renderReports(); }, 200);
  });
  TABS.forEach(function (t, i) {
    var tab = $("tab-" + t);
    tab.addEventListener("click", function () { selectTab(t); });
    tab.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var j = i, next;
      do { j = (j + d + TABS.length) % TABS.length; next = TABS[j]; } while (!tabAllowed(next) && j !== i);
      selectTab(next);
      $("tab-" + next).focus();
    });
  });
  $("admin-signout").addEventListener("click", function () { $("sign-out").click(); });
  window.addEventListener("hashchange", function () { if (location.hash === "#learn" && data && isTeam()) { selectTab("learn"); history.replaceState(null, "", location.pathname); } });

  // ---------- learning hub: videos (M-Pesa unlock), free notes, tutorials, comments ----------
  var LAPI = "learn.php";
  var learnData = null;
  function lapi(action, body, query) {
    var init = { method: body === undefined ? "GET" : "POST", headers: { Accept: "application/json" }, credentials: "same-origin" };
    if (body !== undefined) { init.headers["Content-Type"] = "application/json"; init.headers["X-CSRF-Token"] = csrf; init.body = JSON.stringify(body); }
    return fetch(LAPI + "?action=" + action + (query || ""), init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(d.error || "Something went wrong."); e.status = r.status; throw e; } return d; });
    });
  }
  function lsave(action, body, msg) {
    return lapi(action, body).then(function () { toast(msg || "Saved."); return loadLearn(); }).catch(function (e) { toast(e.message, true); });
  }
  function loadLearn() {
    return lapi("admin").then(function (d) { learnData = d; renderLearn(); }).catch(function (e) { $("panel-learn").textContent = e.message; });
  }

  /** Send a big file in pieces, so hosting upload limits don't matter. Resumes after a dropped connection. */
  function chunkedUpload(file, meta, onProgress) {
    return lapi("upload_start", Object.assign({ name: file.name, size: file.size }, meta)).then(function (s) {
      var offset = 0, fails = 0;
      var next = function () {
        if (offset >= file.size) return lapi("upload_finish", { token: s.token });
        var blob = file.slice(offset, Math.min(file.size, offset + s.chunk));
        return fetch(LAPI + "?action=upload_chunk&token=" + s.token + "&offset=" + offset, { method: "POST", credentials: "same-origin", body: blob,
          headers: { "Content-Type": "application/octet-stream", "X-CSRF-Token": csrf, Accept: "application/json" } })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) {
            if (r.ok || r.status === 409) { offset = d.received; fails = 0; onProgress(offset / file.size); return next(); }
            throw new Error(d.error || "Upload failed.");
          }); }, function () {
            if (++fails > 5) throw new Error("The connection keeps dropping. Please try again.");
            return new Promise(function (res) { setTimeout(res, 2000 * fails); }).then(next);
          });
      };
      return next();
    });
  }

  /** A JPEG still (max 1280 px wide) from a video file or an image file, as a data URL. */
  function stillFrom(file, isVideo) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      setTimeout(function () { reject(new Error("The picture took too long.")); }, 15000);
      var draw = function (src, w, h2) {
        var scale = Math.min(1, 1280 / w), c = document.createElement("canvas");
        c.width = Math.round(w * scale); c.height = Math.round(h2 * scale);
        c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      if (isVideo) {
        var v = document.createElement("video");
        v.muted = true; v.preload = "auto"; v.src = url;
        v.addEventListener("loadedmetadata", function () { v.currentTime = isFinite(v.duration) && v.duration > 0 ? Math.min(3, v.duration / 3) : 1; });
        v.addEventListener("seeked", function () { draw(v, v.videoWidth, v.videoHeight); });
        v.addEventListener("error", function () { URL.revokeObjectURL(url); reject(new Error("no still")); });
      } else {
        var img = new Image();
        img.onload = function () { draw(img, img.naturalWidth, img.naturalHeight); };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("That picture could not be read.")); };
        img.src = url;
      }
    });
  }
  function videoDuration(file) {
    return new Promise(function (resolve) {
      var v = document.createElement("video"), url = URL.createObjectURL(file);
      v.preload = "metadata";
      v.onloadedmetadata = function () { URL.revokeObjectURL(url); resolve(isFinite(v.duration) ? Math.round(v.duration) : 0); };
      v.onerror = function () { URL.revokeObjectURL(url); resolve(0); };
      v.src = url;
    });
  }

  function trackOptions(empty) { return [["", empty || "No tutorial"]].concat((learnData.tracks || []).map(function (t) { return [t.id, t.title]; })); }

  function uploadForm(kind) {
    var video = kind === "video";
    var file = h("input", { type: "file", accept: video ? "video/mp4,video/webm,.mp4,.m4v,.webm" : "application/pdf,.pdf", required: true });
    var title = h("input", { maxlength: "160", required: true });
    var summary = h("textarea", { rows: "3", maxlength: video ? "4000" : "500", placeholder: video ? "What will people learn? (shown to everyone before they pay)" : "What's in these notes?" });
    var track = select(trackOptions());
    var price = h("input", { type: "number", min: "1", max: "100000", value: "50" });
    var pub = h("input", { type: "checkbox", checked: true });
    var bar = h("progress", { max: "100", value: "0", hidden: true });
    var status = h("p", { className: "portal-meta", role: "status", "aria-live": "polite" });
    var btn = h("button", { type: "submit", className: "btn btn-solid" }, h("i", { className: "fa-solid fa-cloud-arrow-up", "aria-hidden": "true" }), video ? " Upload video" : " Upload PDF");
    summary.id = "lu-" + kind;
    file.addEventListener("change", function () { if (file.files[0] && !title.value) title.value = file.files[0].name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "); });
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      var f = file.files[0];
      if (!f) { toast("Choose a file first.", true); return; }
      btn.disabled = true; bar.hidden = false; bar.value = 0;
      var started = Date.now();
      var meta = { kind: kind, title: title.value, summary: summary.value, track_id: track.value, price: price.value, published: pub.checked };
      (video ? videoDuration(f) : Promise.resolve(0)).then(function (d) {
        meta.duration = d;
        return chunkedUpload(f, meta, function (p) {
          bar.value = Math.round(p * 100);
          var secs = (Date.now() - started) / 1000, left = p > 0.02 ? secs / p - secs : 0;
          status.textContent = Math.round(p * 100) + "% of " + size(f.size) + (left > 5 ? " · about " + (left > 90 ? Math.round(left / 60) + " min" : Math.round(left) + " s") + " left" : "") + ". Keep this page open.";
        });
      }).then(function (r) {
        if (!video) return r;
        status.textContent = "Making the preview picture…";
        return stillFrom(f, true).then(function (img) { return lapi("poster_save", { id: r.id, data: img }); }).catch(function () {}).then(function () { return r; });
      }).then(function () {
        btn.disabled = false; bar.hidden = true; status.textContent = "";
        form.reset(); price.value = "50"; pub.checked = true;
        toast(video ? "Video uploaded." : "Notes uploaded.");
        loadLearn();
      }).catch(function (err) { btn.disabled = false; status.textContent = err.message; toast(err.message, true); });
    } },
      h("h2", { className: "full", text: video ? "Upload a video lesson" : "Upload notes or a book (PDF)" }),
      h("p", { className: "full portal-meta", text: video ? "MP4 (H.264) or WebM, up to 2 GB. Uploads in pieces, so large files are fine; if the connection drops it carries on. A preview picture is taken from the video automatically." :
        "PDF up to 100 MB. Notes are free: anyone can read them in the browser and download them." }),
      field(video ? "Video file" : "PDF file", file), field("Title", title),
      h("div", { className: "field full" }, h("label", { for: summary.id, text: video ? "Description" : "Short description" }), summary),
      field("Tutorial (optional)", track), video ? field("Price to unlock (KSh)", price) : null,
      h("label", { className: "check" }, pub, h("span", { text: " Publish now" })),
      h("div", { className: "full" }, bar, status),
      h("div", { className: "form-foot" }, btn));
    return form;
  }

  function videoItem(v) {
    var li = h("li", { className: "learn-item" });
    var body = function () {
      li.textContent = "";
      li.appendChild(h("div", { className: "learn-thumb" }, +v.has_poster ? h("img", { src: LAPI + "?action=poster&id=" + v.id + "&t=" + Date.now(), alt: "" }) : h("i", { className: "fa-solid fa-film", "aria-hidden": "true" })));
      li.appendChild(h("div", null, h("strong", { text: v.title }),
        h("span", { className: "portal-meta", text: ksh(v.price) + " · " + v.unlocks + " unlocked · " + ksh(v.revenue) + " earned · " + v.views + " views · " + v.likes + " likes · " + size(v.size) + " · " + day(v.created_at) })));
      li.appendChild(h("span", { className: "pill pill-" + (+v.published ? "paid" : "on_hold"), text: +v.published ? "Published" : "Hidden" }));
      var pic = h("input", { type: "file", accept: "image/*", hidden: true, onchange: function () {
        if (!pic.files[0]) return;
        stillFrom(pic.files[0], false).then(function (img) { return lsave("poster_save", { id: v.id, data: img }, "Picture changed."); }).catch(function (e) { toast(e.message, true); });
      } });
      li.appendChild(h("span", { className: "row-actions" },
        h("a", { className: "linklike", href: "../learn/?video=" + v.id, target: "_blank", rel: "noopener", text: "View" }),
        h("button", { type: "button", className: "linklike", onclick: edit, text: "Edit" }),
        h("button", { type: "button", className: "linklike", onclick: function () { pic.click(); }, text: "Picture" }), pic,
        h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Delete “" + v.title + "”? This can't be undone.")) lsave("video_delete", { id: v.id }, "Deleted."); }, text: "Delete" })));
    };
    var edit = function () {
      var title = h("input", { maxlength: "160", value: v.title }), summary = h("textarea", { rows: "3", maxlength: "4000" }), track = select(trackOptions(), v.track_id || "");
      var price = h("input", { type: "number", min: "1", value: v.price }), pub = h("input", { type: "checkbox", checked: +v.published === 1 });
      summary.value = v.summary; summary.id = "ve-" + v.id;
      li.textContent = "";
      li.appendChild(h("form", { className: "form portal-form full-row", onsubmit: function (e) { e.preventDefault(); lsave("video_save", { id: v.id, title: title.value, summary: summary.value, track_id: track.value, price: price.value, published: pub.checked }); } },
        field("Title", title), field("Price to unlock (KSh)", price), h("div", { className: "field full" }, h("label", { for: summary.id, text: "Description" }), summary), field("Tutorial", track),
        h("label", { className: "check" }, pub, h("span", { text: " Published" })),
        h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Save" }), h("button", { type: "button", className: "btn btn-ghost", onclick: body, text: "Cancel" }))));
    };
    body();
    return li;
  }

  function noteItem(n) {
    var li = h("li");
    var body = function () {
      li.textContent = "";
      li.appendChild(h("div", null, h("strong", { text: n.title }), h("span", { className: "portal-meta", text: n.original_name + " · " + size(n.size) + " · " + n.downloads + " downloads · " + day(n.created_at) })));
      li.appendChild(h("span", { className: "pill pill-" + (+n.published ? "paid" : "on_hold"), text: +n.published ? "Published" : "Hidden" }));
      li.appendChild(h("span", { className: "row-actions" },
        h("a", { className: "linklike", href: "../learn/?note=" + n.id, target: "_blank", rel: "noopener", text: "View" }),
        h("button", { type: "button", className: "linklike", onclick: edit, text: "Edit" }),
        h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Delete “" + n.title + "”?")) lsave("note_delete", { id: n.id }, "Deleted."); }, text: "Delete" })));
    };
    var edit = function () {
      var title = h("input", { maxlength: "160", value: n.title }), summary = h("input", { maxlength: "500", value: n.summary }), track = select(trackOptions(), n.track_id || ""), pub = h("input", { type: "checkbox", checked: +n.published === 1 });
      li.textContent = "";
      li.appendChild(h("form", { className: "form portal-form full-row", onsubmit: function (e) { e.preventDefault(); lsave("note_save", { id: n.id, title: title.value, summary: summary.value, track_id: track.value, published: pub.checked }); } },
        field("Title", title), field("Short description", summary), field("Tutorial", track), h("label", { className: "check" }, pub, h("span", { text: " Published" })),
        h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Save" }), h("button", { type: "button", className: "btn btn-ghost", onclick: body, text: "Cancel" }))));
    };
    body();
    return li;
  }

  function lessonForm(l, trackId, onDone) {
    l = l || { id: 0, track_id: trackId, title: "", slug: "", position: 0, body: "# Title\n\nWrite the lesson here.\n\n```try-html\n<h1>Hello</h1>\n```\n", exercise: "", starter: "", expected: "", must_contain: "", published: 1 };
    var ta = function (v, rows, id) { var t = h("textarea", { rows: String(rows), id: id, className: "mono" }); t.value = v || ""; return t; };
    var uid = "le-" + (l.id || "new") + "-";
    var track = select((learnData.tracks || []).map(function (t) { return [t.id, t.title]; }), l.track_id);
    var title = h("input", { maxlength: "160", value: l.title, required: true }), slug = h("input", { maxlength: "80", value: l.slug, placeholder: "e.g. css-grid" });
    var pos = h("input", { type: "number", min: "0", value: l.position }), pub = h("input", { type: "checkbox", checked: +l.published === 1 });
    var body = ta(l.body, 16, uid + "b"), ex = ta(l.exercise, 3, uid + "x"), starter = ta(l.starter, 5, uid + "s"), expected = ta(l.expected, 2, uid + "e"), must = ta(l.must_contain, 3, uid + "m");
    title.addEventListener("input", function () { if (!l.id) slug.value = title.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); });
    var big = function (label, el, hint) { return h("div", { className: "field full" }, h("label", { for: el.id, text: label }), hint ? h("small", { className: "portal-meta", text: hint }) : null, el); };
    return h("form", { className: "form portal-form lesson-form", onsubmit: function (e) {
      e.preventDefault();
      lapi("lesson_save", { id: l.id, track_id: track.value, title: title.value, slug: slug.value || title.value, position: pos.value, body: body.value, exercise: ex.value, starter: starter.value, expected: expected.value, must_contain: must.value, published: pub.checked })
        .then(function () { toast("Lesson saved."); onDone(); loadLearn(); }).catch(function (err) { toast(err.message, true); });
    } },
      field("Tutorial", track), field("Lesson title", title), field("Web address (slug)", slug), field("Order", pos),
      big("Lesson (Markdown)", body, "# Heading, ## Subheading, **bold**, `code`, - lists, > tip, | tables |. A code block marked ```try-html, ```try-css, ```try-javascript, ```try-python or ```try-sql gets a Run button."),
      big("Exercise task (optional)", ex), big("Starter code for the exercise", starter),
      big("Expected output (optional)", expected, "The learner's output must include this text."), big("Code must include (one per line, optional)", must, "Each line must appear somewhere in the learner's code, e.g. <h1> or GROUP BY."),
      h("label", { className: "check" }, pub, h("span", { text: " Published" })),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Save lesson" }), h("button", { type: "button", className: "btn btn-ghost", onclick: onDone, text: "Cancel" }),
        l.id ? h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Delete this lesson?")) lsave("lesson_delete", { id: l.id }, "Deleted."); }, text: "Delete lesson" }) : null));
  }

  function renderLearn() {
    var panel = $("panel-learn");
    panel.textContent = "";
    if (!learnData) { panel.appendChild(h("p", { className: "portal-meta", text: "Loading…" })); return; }
    var d = learnData, st = d.stats;
    var cards = [["Learners", st.learners, "fa-user-graduate", st.new_learners_30 + " new in 30 days"], ["Video income", ksh(st.revenue), "fa-sack-dollar", ksh(st.revenue_30) + " in 30 days"],
      ["Videos unlocked", st.unlocks, "fa-lock-open", (d.videos || []).length + " videos"], ["Lessons completed", st.lessons_done, "fa-circle-check", (d.lessons || []).length + " lessons · " + (d.notes || []).length + " notes"]];
    panel.appendChild(h("section", { className: "admin-panel" },
      h("div", { className: "admin-panel-head" }, h("h2", { text: "Learning hub" }), h("a", { className: "btn btn-ghost", href: "../learn/", target: "_blank", rel: "noopener" }, h("i", { className: "fa-solid fa-arrow-up-right-from-square", "aria-hidden": "true" }), " Open the hub")),
      h("p", { className: "portal-meta", text: "Free tutorials with live code and free notes for everyone; videos unlocked per person with M-Pesa. Learners sign up themselves with Google or an email code." }),
      h("div", { className: "learn-stats" }, cards.map(function (c) {
        return h("div", { className: "learn-stat" }, h("i", { className: "fa-solid " + c[2], "aria-hidden": "true" }), h("span", null, h("small", { text: c[0] }), h("strong", { text: String(c[1]) }), h("em", { text: c[3] })));
      }))));

    panel.appendChild(h("section", { className: "admin-panel" }, uploadForm("video"),
      h("h3", { text: "Videos" }), (d.videos || []).length ? h("ul", { className: "admin-list" }, d.videos.map(videoItem)) : h("p", { className: "portal-empty", text: "No videos yet." })));
    panel.appendChild(h("section", { className: "admin-panel" }, uploadForm("note"),
      h("h3", { text: "Notes & books" }), (d.notes || []).length ? h("ul", { className: "admin-list" }, d.notes.map(noteItem)) : h("p", { className: "portal-empty", text: "No notes yet." })));

    // Tutorials
    var tut = h("section", { className: "admin-panel", "aria-labelledby": "tut-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "tut-title", text: "Tutorials" })),
      h("p", { className: "portal-meta", text: "Lessons are written in simple Markdown. Code blocks marked try-… get a live editor with a Run button. Add an exercise and it checks itself." }));
    var editorBox = h("div");
    tut.appendChild(editorBox);
    var openEditor = function (l, trackId) { editorBox.textContent = ""; editorBox.appendChild(lessonForm(l, trackId, function () { editorBox.textContent = ""; })); editorBox.scrollIntoView({ behavior: "smooth", block: "start" }); };
    (d.tracks || []).forEach(function (t) {
      var lessons = (d.lessons || []).filter(function (l) { return +l.track_id === +t.id; });
      tut.appendChild(h("details", { className: "learn-track" },
        h("summary", null, h("strong", { text: t.title }), h("span", { className: "portal-meta", text: " · " + lessons.length + " lessons" + (+t.published ? "" : " · hidden") })),
        h("ol", { className: "admin-list" }, lessons.map(function (l) {
          return h("li", null, h("div", null, h("strong", { text: l.title }), h("span", { className: "portal-meta", text: "/learn/?track=" + t.slug + "&lesson=" + l.slug + (l.exercise ? " · exercise" : "") + (+l.published ? "" : " · hidden") })),
            h("span", { className: "row-actions" }, h("a", { className: "linklike", href: "../learn/?track=" + encodeURIComponent(t.slug) + "&lesson=" + encodeURIComponent(l.slug), target: "_blank", rel: "noopener", text: "View" }),
              h("button", { type: "button", className: "linklike", onclick: function () { openEditor(l); }, text: "Edit" })));
        })),
        h("p", null, h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () { openEditor(null, t.id); } }, h("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }), " Add a lesson to " + t.title))));
    });
    var tTitle = h("input", { maxlength: "120", placeholder: "e.g. PHP" }), tSlug = h("input", { maxlength: "60", placeholder: "e.g. php" }), tLang = select([["html", "HTML"], ["css", "CSS"], ["javascript", "JavaScript"], ["python", "Python"], ["sql", "SQL"], ["none", "Other (no code runner)"]]);
    var tSum = h("input", { maxlength: "500" });
    tut.appendChild(h("details", null, h("summary", { className: "panel-summary", text: "Add a new tutorial (subject)" }),
      h("form", { className: "form portal-form", onsubmit: function (e) { e.preventDefault(); lsave("track_save", { title: tTitle.value, slug: tSlug.value || tTitle.value, lang: tLang.value, summary: tSum.value, position: (d.tracks || []).length + 1, published: true }); } },
        field("Name", tTitle), field("Web address", tSlug), field("Code runs as", tLang), field("Summary", tSum),
        h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Add tutorial" })))));
    panel.appendChild(tut);

    // Comments
    var cl = (d.comments || []).map(function (c) {
      return h("li", null, h("div", null, h("strong", { text: (c.name || c.email) + " on “" + c.title + "”" }), h("span", { className: "lead-msg", text: c.body }), h("span", { className: "portal-meta", text: c.email + " · " + day(c.created_at) })),
        h("span", { className: "row-actions" },
          h("button", { type: "button", className: "linklike", onclick: function () { lsave("comment_hide", { id: c.id, hidden: !+c.hidden }, +c.hidden ? "Comment shown." : "Comment hidden."); }, text: +c.hidden ? "Show" : "Hide" }),
          h("button", { type: "button", className: "linklike danger", onclick: function () { if (confirm("Delete this comment?")) lsave("comment_delete", { id: c.id }, "Deleted."); }, text: "Delete" })));
    });
    panel.appendChild(h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: "Comments" })),
      cl.length ? h("ul", { className: "admin-list" }, cl) : h("p", { className: "portal-empty", text: "No comments yet." })));

    // Payments
    var pl = (d.payments || []).map(function (p) {
      return h("li", null, h("div", null, h("strong", { text: ksh(p.amount) + " · " + p.title }), h("span", { className: "portal-meta", text: p.email + " · " + p.phone + " · " + day(p.created_at) + (p.receipt ? " · M-Pesa " + p.receipt : "") })),
        h("span", { className: "pill pill-" + (p.status === "paid" ? "paid" : p.status === "pending" ? "review" : "unpaid"), text: p.status === "paid" ? "Paid" : p.status === "pending" ? "Waiting" : "Not paid" }));
    });
    panel.appendChild(h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: "Video payments" })),
      pl.length ? h("ul", { className: "admin-list" }, pl) : h("p", { className: "portal-empty", text: "No video payments yet." })));
  }

  // ---------- client dashboard ----------
  var CTABS = ["overview", "projects", "request", "payments", "referrals", "support", "courses", "domains", "profile"];
  var CTAB_NAMES = { overview: "Overview", projects: "Projects", request: "Request a project", payments: "Payments", referrals: "Referrals", support: "Support", courses: "Courses", domains: "Domains & hosting", profile: "Profile" };
  function selectClientTab(name, focus) {
    if (!$("ctab-" + name) || $("ctab-" + name).hidden) name = "overview";
    CTABS.forEach(function (tb) {
      var tab = $("ctab-" + tb);
      tab.setAttribute("aria-selected", String(tb === name));
      tab.tabIndex = tb === name ? 0 : -1;
      $("cpanel-" + tb).hidden = tb !== name;
    });
    $("client-crumb").setAttribute("data-en", CTAB_NAMES[name]);
    $("client-crumb").textContent = t(CTAB_NAMES[name]);
    $("client-feedback").hidden = name !== "overview" || !$("client-feedback").childNodes.length;
    if (focus) $("ctab-" + name).focus();
    window.scrollTo(0, 0);
  }
  CTABS.forEach(function (tb, i) {
    var tab = $("ctab-" + tb);
    tab.addEventListener("click", function () { selectClientTab(tb); });
    tab.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var j = i, next;
      do { j = (j + d + CTABS.length) % CTABS.length; next = CTABS[j]; } while ($("ctab-" + next).hidden && j !== i);
      selectClientTab(next, true);
    });
  });
  $("client-signout").addEventListener("click", function () { $("sign-out").click(); });

  var balanceOf = function (inv) { return Math.max(0, +inv.amount - (+inv.amount_paid || 0)); };
  function statCards(cards) {
    return h("div", { className: "stat-cards" }, cards.map(function (c) {
      return h("button", { type: "button", className: "stat-card", onclick: function () { selectClientTab(c[4]); } },
        h("span", { className: "stat-icon tone-" + c[3] }, h("i", { className: "fa-solid " + c[2], "aria-hidden": "true" })),
        h("strong", { text: String(c[1]) }), h("span", { text: t(c[0]) }));
    }));
  }

  function renderClientOverview() {
    var panel = $("cpanel-overview");
    panel.textContent = "";
    var dm = data.me || {};
    var active = data.projects.filter(function (p) { return p.status !== "live"; });
    var unpaid = data.invoices.filter(function (i) { return i.status === "unpaid"; });
    var due = unpaid.reduce(function (s, i) { return s + balanceOf(i); }, 0);
    var paid = (data.payments || []).filter(function (p) { return p.status === "confirmed"; }).reduce(function (s, p) { return s + (+p.amount || 0); }, 0);
    var openTickets = (data.tickets || []).filter(function (x) { return x.status === "open"; }).length;
    var refs = dm.referrals || [];
    var earned = refs.filter(function (r) { return r.stage === "reward_paid"; }).reduce(function (s, r) { return s + r.reward; }, 0);
    panel.appendChild(statCards([
      ["Active projects", active.length, "fa-diagram-project", "blue", "projects"],
      ["Balance to pay", ksh(due), "fa-hourglass-half", due ? "amber" : "green", "payments"],
      ["Paid so far", ksh(paid), "fa-sack-dollar", "green", "payments"],
      ["Open support requests", openTickets, "fa-life-ring", "purple", "support"],
      ["People you referred", refs.length, "fa-user-plus", "cyan", "referrals"],
      ["Referral rewards earned", ksh(earned), "fa-gift", "pink", "referrals"]
    ]));
    var brandNew = !data.projects.length && !data.invoices.length && !(data.courses || []).length && !(data.tickets || []).length;
    if (brandNew) panel.appendChild(h("div", { className: "welcome-card" },
      h("h3", { text: t("Welcome! Your account is ready.") }),
      h("p", { text: t("When we start a project for you, its progress, files and invoices will appear here. What would you like to do?") }),
      h("p", { className: "welcome-actions" },
        h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () { selectClientTab("request"); } }, h("i", { className: "fa-solid fa-circle-plus", "aria-hidden": "true" }), " " + t("Request a project")),
        h("a", { className: "btn btn-ghost btn-sm", href: "../learn/" }, h("i", { className: "fa-solid fa-laptop-code", "aria-hidden": "true" }), " " + t("Learn to code (free)")),
        h("a", { className: "btn btn-ghost btn-sm", href: "https://wa.me/254745789590", target: "_blank", rel: "noopener noreferrer" }, h("i", { className: "fa-brands fa-whatsapp", "aria-hidden": "true" }), " " + t("Chat on WhatsApp")))));
    var cols = h("div", { className: "admin-columns" });
    // Project progress
    var prog = h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: t("Project progress") }),
      h("button", { type: "button", className: "linklike", onclick: function () { selectClientTab("projects"); }, text: t("See all") })));
    if (data.projects.length) {
      var ul = h("ul", { className: "mini-progress" });
      data.projects.slice(0, 5).forEach(function (p) {
        ul.appendChild(h("li", null, h("div", { className: "mp-head" }, h("strong", { text: p.title }), h("span", { className: "pill pill-" + p.status, text: t(STATUS[p.status] || p.status) })),
          h("div", { className: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(p.progress), "aria-label": p.title }, h("span", { style: "width:" + Math.max(0, Math.min(100, +p.progress)) + "%" })),
          h("span", { className: "portal-meta", text: p.progress + t("% complete") + (p.due_date ? t(" · Target date ") + day(p.due_date) : "") })));
      });
      prog.appendChild(ul);
    } else prog.appendChild(h("p", { className: "portal-empty", text: t("No projects yet. Request one and we’ll get back to you.") }));
    cols.appendChild(prog);
    // Next payment + latest updates
    var side = h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: t("Next payment") })));
    var next = unpaid.slice().sort(function (a, b) { return String(a.due_date || "9").localeCompare(String(b.due_date || "9")); })[0];
    if (next) side.appendChild(h("div", { className: "next-pay" }, h("div", null, h("strong", { text: ksh(balanceOf(next)) }), h("span", { className: "portal-meta", text: next.number + " · " + next.description + (next.due_date ? " · " + t("Due") + " " + day(next.due_date) : "") })),
      h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () { selectClientTab("payments"); }, text: t("Pay") })));
    else side.appendChild(h("p", { className: "portal-empty", text: t("Nothing to pay right now.") }));
    side.appendChild(h("h3", { className: "mini-h", text: t("Latest updates") }));
    var ups = (data.updates || []).slice(0, 4);
    if (ups.length) side.appendChild(h("ul", { className: "admin-feed" }, ups.map(function (u) {
      var p = data.projects.find(function (x) { return +x.id === +u.project_id; }) || {};
      return h("li", null, h("span", { className: "feed-dot", "aria-hidden": "true" }), h("div", null, h("strong", { text: u.title || p.title || "" }), h("span", { className: "portal-meta", text: (p.title ? p.title + " · " : "") + day(u.created_at) })));
    })));
    else side.appendChild(h("p", { className: "portal-empty", text: t("No updates yet.") }));
    cols.appendChild(side);
    panel.appendChild(cols);
  }

  var LEAD_STAGE = { new: ["Received", "review"], contacted: ["We’re in touch", "design"], quoted: ["Quote sent", "build"], won: ["Accepted", "paid"], lost: ["Closed", "on_hold"] };
  function renderRequest() {
    var panel = $("cpanel-request");
    panel.textContent = "";
    var services = ["Website", "Online shop (e-commerce)", "School, hospital or business system", "M-Pesa or card payments", "Mobile app", "Design & branding", "Website care & hosting", "Training", "Something else"];
    var service = select(services.map(function (x) { return [x, t(x)]; }));
    var budget = select([["", t("Not sure yet")], ["Under KSh 15,000", "Under KSh 15,000"], ["KSh 15,000 – 40,000", "KSh 15,000 – 40,000"], ["KSh 40,000 – 100,000", "KSh 40,000 – 100,000"], ["Over KSh 100,000", "Over KSh 100,000"]]);
    var timeline = select([["", t("Flexible")], ["As soon as possible", t("As soon as possible")], ["Within a month", t("Within a month")], ["1–3 months", t("1–3 months")]]);
    var details = h("textarea", { rows: "6", maxlength: "4000", required: true, placeholder: t("What do you need? For example: a website for my shop with M-Pesa payments and 5 pages.") });
    details.id = "req-details";
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      if (!details.value.trim()) { details.focus(); return; }
      api("project_request", { method: "POST", body: { service: service.value, budget: budget.value, timeline: timeline.value, details: details.value } })
        .then(function () { toast(t("Request sent. We’ll get back to you within a day.")); load().then(function () { selectClientTab("request"); }); })
        .catch(function (err) { toast(err.message, true); });
    } },
      h("h2", { className: "full", text: t("Request a new project") }),
      h("p", { className: "full portal-meta", text: t("Tell us what you need. We’ll reply with questions or a quote, usually within a day. You can pay a deposit here once you accept the quote.") }),
      field(t("What do you need?"), service), field(t("Budget"), budget), field(t("When do you need it?"), timeline),
      h("div", { className: "field full" }, h("label", { for: "req-details", text: t("Describe your project") }), details),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid" }, h("i", { className: "fa-solid fa-paper-plane", "aria-hidden": "true" }), " " + t("Send request"))));
    panel.appendChild(form);
    var reqs = (data.me && data.me.requests) || [];
    var quotes = (data.me && data.me.quotes) || [];
    var list = h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: t("Your requests and quotes") })));
    if (!reqs.length && !quotes.length) list.appendChild(h("p", { className: "portal-empty", text: t("Nothing yet. Requests you send appear here with their status.") }));
    var ul = h("ul", { className: "admin-list" });
    quotes.forEach(function (q) {
      var st = { sent: ["Waiting for you", "review"], accepted: ["Accepted", "paid"], declined: ["Declined", "on_hold"], expired: ["Expired", "on_hold"] }[q.status] || [q.status, "review"];
      ul.appendChild(h("li", null, h("div", null, h("strong", { text: t("Quote") + ": " + q.title + " · " + ksh(q.total) }), h("span", { className: "portal-meta", text: day(q.created_at) + (q.valid_until ? " · " + t("valid until") + " " + day(q.valid_until) : "") })),
        h("span", { className: "pill pill-" + st[1], text: t(st[0]) }),
        h("a", { className: "btn btn-solid btn-sm", href: q.link, target: "_blank", rel: "noopener", text: q.status === "sent" ? t("View & accept") : t("View") })));
    });
    reqs.forEach(function (r) {
      var st = LEAD_STAGE[r.status] || [r.status, "review"];
      var first = String(r.message).split("\n")[0].replace(/^Service: /, "");
      ul.appendChild(h("li", null, h("div", null, h("strong", { text: first }), h("span", { className: "portal-meta", text: t("Sent") + " " + day(r.created_at) + " · " + String(r.message).split("\n\n").slice(1).join(" ").slice(0, 120) })),
        h("span", { className: "pill pill-" + st[1], text: t(st[0]) })));
    });
    if (ul.children.length) list.appendChild(ul);
    panel.appendChild(list);
  }

  function renderStatement() {
    var box = $("client-statement");
    box.textContent = "";
    var invs = data.invoices || [];
    var pays = (data.payments || []).filter(function (p) { return p.status === "confirmed"; });
    var billed = invs.reduce(function (s, i) { return s + (+i.amount || 0); }, 0);
    var paid = pays.reduce(function (s, p) { return s + (+p.amount || 0); }, 0);
    var owed = invs.filter(function (i) { return i.status === "unpaid"; }).reduce(function (s, i) { return s + balanceOf(i); }, 0);
    var numOf = function (id) { return (invs.find(function (i) { return +i.id === +id; }) || {}).number || ""; };
    var sec = h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: t("Payment history & statement") }),
      pays.length || invs.length ? h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: printStatement }, h("i", { className: "fa-solid fa-print", "aria-hidden": "true" }), " " + t("Print statement")) : null),
      h("div", { className: "stat-cards stat-cards-3" },
        h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-blue" }, h("i", { className: "fa-solid fa-file-invoice", "aria-hidden": "true" })), h("strong", { text: ksh(billed) }), h("span", { text: t("Total invoiced") })),
        h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-green" }, h("i", { className: "fa-solid fa-sack-dollar", "aria-hidden": "true" })), h("strong", { text: ksh(paid) }), h("span", { text: t("Total paid") })),
        h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-amber" }, h("i", { className: "fa-solid fa-hourglass-half", "aria-hidden": "true" })), h("strong", { text: ksh(owed) }), h("span", { text: t("Balance") }))));
    if (pays.length) sec.appendChild(h("div", { className: "table-wrap" }, h("table", { className: "portal-table" },
      h("thead", null, h("tr", null, h("th", { text: t("Date") }), h("th", { text: t("Invoice") }), h("th", { text: t("Method") }), h("th", { text: t("Reference") }), h("th", { className: "r", text: t("Amount") }))),
      h("tbody", null, pays.map(function (p) {
        return h("tr", null, h("td", { text: day(p.decided_at || p.created_at) }), h("td", { text: numOf(p.invoice_id) }), h("td", { text: p.method === "mpesa" ? "M-Pesa" : p.method === "card" ? t("Card") : p.method === "bank" ? t("Bank") : p.method }),
          h("td", { text: p.reference || "" }), h("td", { className: "r", text: ksh(p.amount) }));
      })))));
    else sec.appendChild(h("p", { className: "portal-empty", text: t("No payments yet.") }));
    box.appendChild(sec);
    function printStatement() {
      var dm = data.me || {};
      var rows = invs.map(function (i) { return "<tr><td>" + esc(day(i.created_at)) + "</td><td>" + esc(i.number) + "</td><td>" + esc(i.description) + "</td><td class=r>" + esc(ksh(i.amount)) + "</td><td class=r></td></tr>"; })
        .concat(pays.map(function (p) { return "<tr><td>" + esc(day(p.decided_at || p.created_at)) + "</td><td>" + esc(numOf(p.invoice_id)) + "</td><td>Payment " + esc(p.method === "mpesa" ? "M-Pesa " : "") + esc(p.reference || "") + "</td><td class=r></td><td class=r>" + esc(ksh(p.amount)) + "</td></tr>"; }));
      var css = ".page{max-width:820px;margin:24px auto;background:#fff;padding:40px;font:14px/1.5 system-ui,sans-serif;color:#0f172a}h1{margin:0 0 4px;color:#0b1b35}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{border-bottom:1px solid #e2e8f0;padding:8px;text-align:left}.r{text-align:right}.tot td{font-weight:800;border-top:2px solid #0b1b35}.head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.head img{width:64px;height:64px;border-radius:50%}";
      printDoc("Statement " + (dm.client_code || ""), css, "<div class=page><div class=head><div><h1>Account statement</h1><p>" + esc(dm.name || "") + " · " + esc(dm.client_code || "") + "<br>" + esc(dm.email || "") + "<br>Printed " + esc(day(new Date().toISOString().slice(0, 10))) + "</p></div><img src=\"" + esc(logoUrl()) + "\" alt=\"\"></div>" +
        "<table><thead><tr><th>Date</th><th>Invoice</th><th>Details</th><th class=r>Invoiced</th><th class=r>Paid</th></tr></thead><tbody>" + rows.join("") +
        "<tr class=tot><td colspan=3>Totals · balance " + esc(ksh(owed)) + "</td><td class=r>" + esc(ksh(billed)) + "</td><td class=r>" + esc(ksh(paid)) + "</td></tr></tbody></table><p style=\"margin-top:24px;color:#475569\">Marzley Tech Solutions · +254 745 789 590 · marzleytechsolutions.co.ke</p></div>");
    }
  }

  var REF_STAGE = {
    enquired: ["Enquired", "review", 1], signed_up: ["Signed up", "review", 1], project_started: ["Project started", "design", 2],
    paid: ["Paid · work in progress", "build", 3], reward_due: ["Work done · reward due", "unpaid", 4], reward_paid: ["Reward paid", "paid", 5], not_eligible: ["Not eligible", "on_hold", 0]
  };
  function renderReferral() {
    var box = $("client-referral");
    box.textContent = "";
    var dm = data.me || {};
    var link = dm.referral_link;
    var refs = dm.referrals || [];
    var reward = ksh(dm.reward || 2000);
    var input = h("input", { type: "text", readonly: true, value: link || "", "aria-label": t("Your referral link") });
    box.appendChild(h("section", { className: "admin-panel referral-hero" },
      h("div", { className: "admin-panel-head" }, h("h2", { text: t("Refer a friend, earn ") + reward })),
      h("p", { text: t("Share your link or code. When someone you refer pays for a project and the work is done, we send you ") + reward + t(" by M-Pesa.") }),
      h("div", { className: "ref-ids" },
        h("div", null, h("small", { text: t("Your client ID") }), h("strong", { text: dm.client_code || "" })),
        h("div", null, h("small", { text: t("Your referral code") }), h("strong", { text: dm.ref_code || "" })),
        h("div", null, h("small", { text: t("Rewards go to") }), h("strong", { text: dm.phone || t("Add your M-Pesa number") }),
          !dm.phone ? h("button", { type: "button", className: "linklike", onclick: function () { selectClientTab("profile"); }, text: t("Add it in Profile") }) : null)),
      link ? h("div", { className: "ref-link-row" }, input,
        h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () {
          input.select();
          (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { toast(t("Link copied.")); }, function () { document.execCommand("copy"); toast(t("Link copied.")); });
        }, text: t("Copy") }),
        h("a", { className: "btn btn-wa btn-sm", href: "https://wa.me/?text=" + encodeURIComponent("Need a website, online shop or system? I recommend Marzley Tech Solutions: " + link), target: "_blank", rel: "noopener noreferrer" },
          h("i", { className: "fab fa-whatsapp", "aria-hidden": "true" }), " " + t("Share on WhatsApp"))) : null,
      h("ol", { className: "ref-steps" },
        h("li", null, h("strong", { text: t("Share") }), h("span", { text: t("Send your link, or give them your code.") })),
        h("li", null, h("strong", { text: t("They sign up or enquire") }), h("span", { text: t("They appear below straight away.") })),
        h("li", null, h("strong", { text: t("They pay, we finish the work") }), h("span", { text: t("Status: Paid · work in progress.") })),
        h("li", null, h("strong", { text: t("You get paid") }), h("span", { text: reward + t(" to your M-Pesa once the work is done.") })))));
    var inProgress = refs.filter(function (r) { var s = REF_STAGE[r.stage]; return s && s[2] >= 1 && s[2] <= 3; }).length;
    var dueAmt = refs.filter(function (r) { return r.stage === "reward_due"; }).reduce(function (s, r) { return s + r.reward; }, 0);
    var paidAmt = refs.filter(function (r) { return r.stage === "reward_paid"; }).reduce(function (s, r) { return s + r.reward; }, 0);
    var sec = h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: t("People you referred") })),
      h("div", { className: "stat-cards" },
        h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-cyan" }, h("i", { className: "fa-solid fa-users", "aria-hidden": "true" })), h("strong", { text: String(refs.length) }), h("span", { text: t("Referred") })),
        h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-blue" }, h("i", { className: "fa-solid fa-spinner", "aria-hidden": "true" })), h("strong", { text: String(inProgress) }), h("span", { text: t("In progress") })),
        h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-amber" }, h("i", { className: "fa-solid fa-hourglass-half", "aria-hidden": "true" })), h("strong", { text: ksh(dueAmt) }), h("span", { text: t("Reward due to you") })),
        h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-green" }, h("i", { className: "fa-solid fa-gift", "aria-hidden": "true" })), h("strong", { text: ksh(paidAmt) }), h("span", { text: t("Rewards paid to you") }))));
    if (refs.length) sec.appendChild(h("div", { className: "table-wrap" }, h("table", { className: "portal-table" },
      h("thead", null, h("tr", null, h("th", { text: t("Name") }), h("th", { text: t("Client ID") }), h("th", { text: t("Since") }), h("th", { text: t("Status") }), h("th", { className: "r", text: t("Reward") }))),
      h("tbody", null, refs.map(function (r) {
        var s = REF_STAGE[r.stage] || [r.stage, "review", 0];
        var steps = h("span", { className: "ref-track", "aria-hidden": "true" }, [1, 2, 3, 4, 5].map(function (n) { return h("i", { className: n <= s[2] ? "on" : "" }); }));
        return h("tr", null, h("td", { text: r.name }), h("td", { text: r.client_code || "—" }), h("td", { text: day(r.date) }),
          h("td", null, h("span", { className: "pill pill-" + s[1], text: t(s[0]) }), s[2] ? steps : null),
          h("td", { className: "r", text: r.reward ? ksh(r.reward) + (r.stage === "reward_paid" && r.paid_at ? " · " + day(r.paid_at) : "") : "—" }));
      })))));
    else sec.appendChild(h("p", { className: "portal-empty", text: t("No one yet. Share your link to start earning.") }));
    box.appendChild(sec);
  }

  function renderProfile() {
    var panel = $("cpanel-profile");
    panel.textContent = "";
    var dm = data.me || {};
    var name = h("input", { maxlength: "120", value: dm.name || "", autocomplete: "name", required: true });
    var phone = h("input", { type: "tel", maxlength: "30", value: dm.phone || "", autocomplete: "tel", placeholder: t("Enter your phone number") });
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      api("profile_save", { method: "POST", body: { name: name.value, phone: phone.value } })
        .then(function () { toast(t("Saved.")); load().then(function () { selectClientTab("profile"); }); }).catch(function (err) { toast(err.message, true); });
    } },
      h("h2", { className: "full", text: t("Your details") }),
      field(t("Name"), name), field(t("M-Pesa phone number (payments and referral rewards)"), phone),
      h("div", { className: "field" }, h("span", { className: "field-label", text: t("Email (sign-in)") }), h("strong", { text: dm.email || me.email })),
      h("div", { className: "field" }, h("span", { className: "field-label", text: t("Client ID") }), h("strong", { text: dm.client_code || "" })),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: t("Save") })));
    panel.appendChild(form);
    panel.appendChild(h("section", { className: "admin-panel" }, h("div", { className: "admin-panel-head" }, h("h2", { text: t("Security") })),
      h("p", { className: "portal-meta", text: t("Member since") + " " + day(dm.since) + ". " + t("Lost a phone or used a shared computer? Sign out on every device.") }),
      h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () {
        if (!confirm(t("Sign out on all your devices?"))) return;
        api("logout_all", { method: "POST" }).then(function () { location.reload(); }).catch(function (err) { toast(err.message, true); });
      } }, h("i", { className: "fa-solid fa-right-from-bracket", "aria-hidden": "true" }), " " + t("Sign out everywhere"))));
  }

  function renderClient() {
    translateStatic();
    var dm = data.me || {};
    $("client-title").textContent = t("Hello, ") + (dm.name || me.name || "there");
    $("client-name").textContent = dm.name || me.name || me.email;
    $("client-code").textContent = (dm.client_code ? t("Client ID") + " " + dm.client_code : "");
    var fbBox = $("client-feedback");
    fbBox.textContent = "";
    if (dm.feedback) fbBox.appendChild(h("div", { className: "feedback-banner" },
      h("i", { className: "fa-solid fa-rocket", "aria-hidden": "true" }),
      h("p", null, h("strong", { text: "“" + dm.feedback.title + "” " + t("is live! How did we do?") })),
      h("a", { className: "btn btn-solid btn-sm", href: dm.feedback.link, text: t("Rate us") })));
    var box = $("client-projects");
    box.textContent = "";
    if (!data.projects.length) box.appendChild(h("div", { className: "welcome-card" }, h("h3", { text: t("No projects yet") }),
      h("p", { text: t("Request a project and it will appear here with its progress, updates, files and approvals.") }),
      h("p", { className: "welcome-actions" }, h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () { selectClientTab("request"); }, text: t("Request a project") }))));
    data.projects.forEach(function (p) { box.appendChild(projectCard(p, false)); });
    renderInvoices($("client-invoices"), data.invoices, false);
    renderStatement();
    renderClientCourses();
    renderSupport($("client-support"), false);
    renderReferral();
    renderClientDomains();
    renderClientOverview();
    renderRequest();
    renderProfile();
    var badge = function (id, n) { $(id).textContent = String(n); $(id).hidden = !n; };
    badge("ccount-projects", data.projects.filter(function (p) { return p.status !== "live"; }).length);
    badge("ccount-payments", data.invoices.filter(function (i) { return i.status === "unpaid"; }).length);
    badge("ccount-referrals", (dm.referrals || []).filter(function (r) { return r.stage === "reward_due"; }).length);
    badge("ccount-support", (data.tickets || []).filter(function (x) { return x.status === "open"; }).length);
    var current = CTABS.filter(function (tb) { return $("ctab-" + tb).getAttribute("aria-selected") === "true"; })[0] || "overview";
    var want = (location.hash || "").replace("#", "");
    if (CTABS.indexOf(want) >= 0) { current = want; history.replaceState(null, "", location.pathname); }
    selectClientTab(current);
  }

  // ---------- admin overview (dashboard) ----------
  var ymd = function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
  var clock = null;
  function renderOverview() {
    var panel = $("panel-overview");
    panel.textContent = "";
    var now = new Date();
    var month = ymd(now).slice(0, 7);
    var unpaid = data.invoices.filter(function (i) { return i.status === "unpaid"; });
    var paidMonth = data.invoices.filter(function (i) { return i.status === "paid" && String(i.paid_at || "").slice(0, 7) === month; });
    var sum = function (list) { return list.reduce(function (t, i) { return t + Number(i.amount); }, 0); };
    var openTickets = (data.tickets || []).filter(function (t) { return t.status === "open"; });
    var pending = (data.approvals || []).filter(function (a) { return a.status === "pending"; });
    var active = data.projects.filter(function (p) { return p.status !== "live" && p.status !== "on_hold"; });

    // Welcome banner
    var timeEl = h("span", { text: "" });
    var dateEl = h("span", { text: "" });
    var tick = function () {
      try {
        var t = new Date();
        dateEl.textContent = new Intl.DateTimeFormat("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" }).format(t);
        timeEl.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Africa/Nairobi" }).format(t) + " EAT";
      } catch (e) { dateEl.textContent = t.toDateString(); timeEl.textContent = t.toTimeString().slice(0, 8); }
    };
    tick();
    clearInterval(clock);
    clock = setInterval(tick, 1000);
    var first = String(me.name || "Admin").split(" ")[0];
    panel.appendChild(h("section", { className: "admin-welcome", "aria-label": "Welcome" },
      h("div", { className: "admin-welcome-head" },
        h("span", { className: "admin-welcome-icon" }, h("i", { className: "fa-solid fa-user-shield", "aria-hidden": "true" })),
        h("div", null, h("h2", null, "Welcome, ", h("span", { text: first })), h("p", { text: "Marzley Tech Solutions — Admin Control Panel" }))),
      h("ul", { className: "admin-welcome-meta" },
        h("li", null, h("i", { className: "fa-solid fa-calendar-days", "aria-hidden": "true" }), dateEl),
        h("li", null, h("i", { className: "fa-solid fa-clock", "aria-hidden": "true" }), timeEl),
        h("li", null, h("i", { className: "fa-solid fa-users", "aria-hidden": "true" }), h("span", { text: data.clients.length + " clients & students" })))));

    // Number cards
    var cards = [
      ["fa-users", "blue", String(data.clients.length), "Clients & students", "clients"],
      ["fa-diagram-project", "purple", String(active.length), "Active projects", "projects"],
      ["fa-file-invoice-dollar", "amber", ksh(sum(unpaid)), unpaid.length + " unpaid invoice" + (unpaid.length === 1 ? "" : "s"), "invoices"],
      ["fa-sack-dollar", "green", ksh(sum(paidMonth)), "Collected this month", "reports"],
      ["fa-life-ring", "red", String(openTickets.length), "Open support requests", "support"],
      ["fa-clipboard-check", "cyan", String(pending.length), "Approvals waiting on clients", "projects"],
      ["fa-graduation-cap", "indigo", String((data.enrollments || []).length), "Course enrolments", "courses"],
      ["fa-award", "pink", String((data.certificates || []).length), "Certificates issued", "courses"]
    ];
    var grid = h("div", { className: "stat-cards" });
    cards.filter(function (c) { return tabAllowed(c[4]); }).forEach(function (c) {
      grid.appendChild(h("button", { type: "button", className: "stat-card", onclick: function () { selectTab(c[4]); } },
        h("span", { className: "stat-icon tone-" + c[1] }, h("i", { className: "fa-solid " + c[0], "aria-hidden": "true" })),
        h("strong", { text: c[2] }),
        h("span", { text: c[3] })));
    });
    panel.appendChild(grid);

    // Needs attention + recent activity
    var today = ymd(now);
    var soon = ymd(new Date(now.getTime() + 14 * 864e5));
    var clientName = function (id) { return (data.clients.find(function (c) { return +c.id === +id; }) || {}).name || "Client"; };
    var attention = [];
    unpaid.filter(function (i) { return i.due_date && i.due_date < today; }).forEach(function (i) {
      attention.push(["red", "fa-triangle-exclamation", "Overdue: " + i.number + " · " + ksh(i.amount), clientName(i.client_id) + " · due " + day(i.due_date), "invoices"]);
    });
    openTickets.forEach(function (t) {
      var msgs = (data.messages || []).filter(function (m) { return +m.ticket_id === +t.id; });
      var last = msgs[msgs.length - 1];
      if (last && last.author === "client") attention.push(["amber", "fa-comment-dots", "Reply needed: " + t.subject, clientName(t.client_id) + " · " + day(last.created_at), "support"]);
    });
    (data.approvals || []).filter(function (a) { return a.status === "changes"; }).forEach(function (a) {
      var p = data.projects.find(function (x) { return +x.id === +a.project_id; }) || {};
      attention.push(["purple", "fa-pen-to-square", "Changes requested: " + a.title, (p.title || "") + (a.client_note ? " · “" + a.client_note.slice(0, 60) + "”" : ""), "projects"]);
    });
    data.projects.filter(function (p) { return p.due_date && p.status !== "live" && p.due_date <= soon; }).forEach(function (p) {
      attention.push([p.due_date < today ? "red" : "blue", "fa-flag", (p.due_date < today ? "Past target date: " : "Due soon: ") + p.title, clientName(p.client_id) + " · " + day(p.due_date) + " · " + p.progress + "%", "projects"]);
    });
    var attList = h("ul", { className: "admin-list-rows" });
    attention = attention.filter(function (a) { return tabAllowed(a[4]); });
    if (can("money")) (data.payments || []).filter(function (x) { return x.status === "pending"; }).forEach(function (x) {
      attention.unshift(["red", "fa-money-check-dollar", "Payment to confirm: " + ksh(x.amount), (x.method === "till" ? "M-Pesa till" : "Bank") + " · ref " + x.reference, "invoices"]);
    });
    if (can("leads")) (data.leads || []).filter(function (l) { return l.status === "new"; }).slice(0, 3).forEach(function (l) {
      attention.unshift(["blue", "fa-user-plus", "New lead: " + l.name, (l.source || "Website") + " · " + day(l.created_at), "leads"]);
    });
    if (can("money")) (data.domains || []).filter(function (d) { return d.last_status === "down"; }).forEach(function (d) {
      attention.unshift(["red", "fa-plug-circle-xmark", "Website down: " + d.name, "Since " + day(d.down_since), "domains"]);
    });
    attention.slice(0, 8).forEach(function (a) {
      attList.appendChild(h("li", null, h("button", { type: "button", onclick: function () { selectTab(a[4]); } },
        h("span", { className: "row-icon tone-" + a[0] }, h("i", { className: "fa-solid " + a[1], "aria-hidden": "true" })),
        h("span", { className: "row-text" }, h("strong", { text: a[2] }), h("small", { text: a[3] })),
        h("i", { className: "fa-solid fa-chevron-right row-go", "aria-hidden": "true" }))));
    });

    var events = [];
    data.updates.forEach(function (u) {
      var p = data.projects.find(function (x) { return +x.id === +u.project_id; }) || {};
      events.push([u.created_at, "fa-bullhorn", "Update on " + (p.title || "a project"), u.message]);
    });
    data.invoices.forEach(function (i) {
      if (i.status === "paid" && i.paid_at) events.push([i.paid_at, "fa-circle-check", "Paid: " + i.number + " · " + ksh(i.amount), clientName(i.client_id) + (i.mpesa_receipt ? " · M-Pesa " + i.mpesa_receipt : "")]);
      events.push([i.created_at, "fa-file-invoice", "Invoice " + i.number + " created", clientName(i.client_id) + " · " + ksh(i.amount)]);
    });
    (data.approvals || []).forEach(function (a) {
      if (a.decided_at) events.push([a.decided_at, a.status === "approved" ? "fa-thumbs-up" : "fa-pen-to-square", (a.status === "approved" ? "Approved: " : "Changes requested: ") + a.title, a.client_note || ""]);
    });
    (data.messages || []).forEach(function (m) {
      var t = (data.tickets || []).find(function (x) { return +x.id === +m.ticket_id; }) || {};
      events.push([m.created_at, "fa-comments", (m.author === "admin" ? "You replied: " : "Support message: ") + (t.subject || ""), m.message]);
    });
    events.sort(function (a, b) { return String(b[0]).localeCompare(String(a[0])); });
    var feed = h("ol", { className: "admin-feed" });
    events.slice(0, 8).forEach(function (e) {
      feed.appendChild(h("li", null,
        h("span", { className: "feed-icon" }, h("i", { className: "fa-solid " + e[1], "aria-hidden": "true" })),
        h("span", { className: "row-text" }, h("strong", { text: e[2] }), e[3] ? h("small", { text: String(e[3]).slice(0, 110) }) : null),
        h("time", { datetime: e[0], text: day(e[0]) })));
    });

    panel.appendChild(h("div", { className: "admin-columns" },
      h("section", { className: "admin-panel", "aria-labelledby": "att-title" },
        h("div", { className: "admin-panel-head" }, h("h2", { id: "att-title", text: "Needs your attention" }), h("span", { className: "nav-badge badge-red", text: String(attention.length), hidden: !attention.length })),
        attention.length ? attList : h("p", { className: "portal-empty", text: "All clear. Nothing needs you right now." })),
      h("section", { className: "admin-panel", "aria-labelledby": "feed-title" },
        h("div", { className: "admin-panel-head" }, h("h2", { id: "feed-title", text: "Recent activity" })),
        events.length ? feed : h("p", { className: "portal-empty", text: "Activity will appear here as you add projects, invoices and updates." }))));

    // Quick actions
    panel.appendChild(h("div", { className: "admin-quick" },
      h("button", { type: "button", className: "btn btn-solid", onclick: function () { selectTab("clients"); var qs = $("quick-start"); if (qs) { qs.open = true; qs.querySelector("input").focus(); } } }, h("i", { className: "fa-solid fa-bolt", "aria-hidden": "true" }), " Quick start"),
      h("button", { type: "button", className: "btn btn-ghost", onclick: function () { selectTab("clients"); } }, h("i", { className: "fa-solid fa-user-plus", "aria-hidden": "true" }), " Add a client"),
      h("button", { type: "button", className: "btn btn-ghost", onclick: function () { selectTab("projects"); } }, h("i", { className: "fa-solid fa-folder-plus", "aria-hidden": "true" }), " New project"),
      h("button", { type: "button", className: "btn btn-ghost", onclick: function () { selectTab("invoices"); } }, h("i", { className: "fa-solid fa-file-circle-plus", "aria-hidden": "true" }), " Create invoice"),
      h("button", { type: "button", className: "btn btn-ghost", onclick: function () { selectTab("courses"); } }, h("i", { className: "fa-solid fa-book-open", "aria-hidden": "true" }), " Manage courses")));
  }

  // ---------- reports: payments received per month (single-series bar chart) ----------
  function renderReports() {
    var panel = $("panel-reports");
    panel.textContent = "";
    var now = new Date();
    var months = [];
    for (var i = 5; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: ymd(d).slice(0, 7), label: d.toLocaleDateString("en-KE", { month: "short" }), full: d.toLocaleDateString("en-KE", { month: "long", year: "numeric" }), total: 0, count: 0 });
    }
    data.invoices.forEach(function (inv) {
      if (inv.status !== "paid" || !inv.paid_at) return;
      var m = months.find(function (x) { return x.key === String(inv.paid_at).slice(0, 7); });
      if (m) { m.total += Number(inv.amount); m.count += 1; }
    });
    var total = months.reduce(function (t, m) { return t + m.total; }, 0);
    var max = Math.max.apply(null, months.map(function (m) { return m.total; })) || 1;
    var nice = function (v) { var p = Math.pow(10, Math.floor(Math.log10(v))); var n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; };
    var top = nice(max);
    var W = Math.max(300, Math.min(900, (panel.clientWidth || 682) - 42)), H = W < 480 ? 220 : 260, L = 64, R = 12, T = 22, B = 34, bw = (W - L - R) / months.length;
    var NS = "http://www.w3.org/2000/svg";
    var el = function (tag, attrs, text) {
      var n = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      if (text !== undefined) n.textContent = text;
      return n;
    };
    var short = function (v) { return v >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, "") + "M" : v >= 1e3 ? Math.round(v / 1e3) + "k" : String(v); };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "chart-svg", role: "img", "aria-labelledby": "rep-title rep-desc" });
    svg.appendChild(el("desc", { id: "rep-desc" }, "Bar chart of payments received in each of the last six months. The same figures are in the table below."));
    for (var g = 0; g <= 4; g++) {
      var v = top * g / 4, y = T + (H - T - B) * (1 - g / 4);
      svg.appendChild(el("line", { x1: L, x2: W - R, y1: y, y2: y, class: g ? "chart-grid" : "chart-base" }));
      svg.appendChild(el("text", { x: L - 8, y: y + 4, class: "chart-tick", "text-anchor": "end" }, "KSh " + short(v)));
    }
    var tip = h("div", { className: "chart-tip", role: "status", hidden: true });
    months.forEach(function (m, idx) {
      var bh = (H - T - B) * (m.total / top);
      var x = L + idx * bw + bw * 0.22, w = bw * 0.56, y = H - B - bh;
      var r = Math.min(4, bh / 2, w / 2);
      if (bh > 0) {
        var path = "M" + x + "," + (H - B) + " V" + (y + r) + " Q" + x + "," + y + " " + (x + r) + "," + y + " H" + (x + w - r) + " Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + " V" + (H - B) + " Z";
        svg.appendChild(el("path", { d: path, class: "chart-bar" }));
      }
      if (m.total === max && m.total > 0) svg.appendChild(el("text", { x: x + w / 2, y: y - 6, class: "chart-value", "text-anchor": "middle" }, "KSh " + short(m.total)));
      svg.appendChild(el("text", { x: x + w / 2, y: H - B + 20, class: "chart-tick", "text-anchor": "middle" }, m.label));
      var hit = el("rect", { x: L + idx * bw, y: T, width: bw, height: H - T - B, class: "chart-hit", tabindex: "0", role: "img", "aria-label": m.full + ": " + ksh(m.total) });
      var showTip = function () {
        tip.textContent = "";
        tip.appendChild(h("strong", { text: m.full }));
        tip.appendChild(h("span", { text: ksh(m.total) + " · " + m.count + " payment" + (m.count === 1 ? "" : "s") }));
        tip.hidden = false;
        // Centre the tip over the bar, but keep it inside the chart box
        var box = tip.parentNode.clientWidth, tw = tip.offsetWidth;
        tip.style.left = Math.max(0, Math.min(box - tw, (L + idx * bw + bw / 2) / W * box - tw / 2)) + "px";
      };
      hit.addEventListener("mouseenter", showTip);
      hit.addEventListener("focus", showTip);
      hit.addEventListener("mouseleave", function () { tip.hidden = true; });
      hit.addEventListener("blur", function () { tip.hidden = true; });
      svg.appendChild(hit);
    });
    var rows = months.map(function (m) { return h("tr", null, h("th", { scope: "row", text: m.full }), h("td", { className: "r", text: ksh(m.total) }), h("td", { className: "r", text: String(m.count) })); });
    var byStatus = Object.keys(STATUS).map(function (k) { return [STATUS[k], data.projects.filter(function (p) { return p.status === k; }).length]; });
    var unpaidTotal = data.invoices.filter(function (i) { return i.status === "unpaid"; }).reduce(function (t, i) { return t + Number(i.amount); }, 0);
    panel.appendChild(h("div", { className: "stat-cards stat-cards-3" },
      h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-green" }, h("i", { className: "fa-solid fa-sack-dollar", "aria-hidden": "true" })), h("strong", { text: ksh(total) }), h("span", { text: "Received in the last 6 months" })),
      h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-amber" }, h("i", { className: "fa-solid fa-hourglass-half", "aria-hidden": "true" })), h("strong", { text: ksh(unpaidTotal) }), h("span", { text: "Waiting to be paid" })),
      h("div", { className: "stat-card is-static" }, h("span", { className: "stat-icon tone-blue" }, h("i", { className: "fa-solid fa-receipt", "aria-hidden": "true" })), h("strong", { text: String(months.reduce(function (t, m) { return t + m.count; }, 0)) }), h("span", { text: "Payments in the last 6 months" }))));
    panel.appendChild(h("section", { className: "admin-panel", "aria-labelledby": "rep-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "rep-title", text: "Payments received, last 6 months" })),
      h("div", { className: "chart-wrap" }, svg, tip),
      h("details", { className: "chart-table" }, h("summary", { text: "Show as a table" }),
        h("table", { className: "portal-table" }, h("thead", null, h("tr", null, h("th", { text: "Month" }), h("th", { className: "r", text: "Received" }), h("th", { className: "r", text: "Payments" }))), h("tbody", null, rows)))));
    var statusList = h("ul", { className: "status-bars" });
    var most = Math.max.apply(null, byStatus.map(function (b) { return b[1]; })) || 1;
    byStatus.forEach(function (b) {
      statusList.appendChild(h("li", null, h("span", { text: b[0] }), h("span", { className: "status-track" }, h("span", { style: "width:" + (b[1] / most * 100) + "%" })), h("strong", { text: String(b[1]) })));
    });
    panel.appendChild(h("section", { className: "admin-panel", "aria-labelledby": "proj-title" },
      h("div", { className: "admin-panel-head" }, h("h2", { id: "proj-title", text: "Projects by stage" })), statusList));
  }

  // ---------- shared helpers for the new sections ----------
  function waTo(phone, text) {
    var d = String(phone).replace(/\D/g, "");
    if (/^0[17]\d{8}$/.test(d)) d = "254" + d.slice(1);
    return "https://wa.me/" + d + "?text=" + encodeURIComponent(text);
  }
  var esc = function (v) {
    return String(v === null || v === undefined ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  var PRINT_CSS = "*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a;background:#f1f5f9}" +
    ".bar{max-width:800px;margin:16px auto 0;display:flex;justify-content:flex-end;padding:0 16px}.bar button{border:0;border-radius:999px;padding:12px 22px;font-weight:700;font-size:15px;font-family:inherit;cursor:pointer;background:#ffb800;color:#0b1b35}" +
    "@media print{body{background:#fff}.bar{display:none}.page{box-shadow:none!important;margin:0!important}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}";
  function printDoc(title, css, body) {
    var w = window.open("", "_blank");
    if (!w) { toast("Please allow pop-ups to download this document.", true); return; }
    w.document.open();
    w.document.write("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + esc(title) +
      "</title><style>" + PRINT_CSS + css + "</style></head><body><div class=\"bar\"><button type=\"button\">Save as PDF / Print</button></div>" + body +
      "<script src=\"" + esc(new URL("../js/print-page.js", document.baseURI).href) + "\"><\/script></body></html>");
    w.document.close();
  }
  var logoUrl = function () { return new URL("../img/brand/logo-256.webp", document.baseURI).href; };

  // ---------- approvals ----------
  function approvalItem(a, admin) {
    var tx = admin ? function (x) { return x; } : t;
    var label = tx({ pending: "Waiting for you", approved: "Approved", changes: "Changes requested" }[a.status] || a.status);
    if (admin && a.status === "pending") label = "Waiting for client";
    var li = h("li", { className: "approval approval-" + a.status },
      h("div", { className: "approval-head" }, h("strong", { text: a.title }), h("span", { className: "pill pill-" + (a.status === "approved" ? "paid" : a.status === "pending" ? "unpaid" : "on_hold"), text: label })),
      a.details ? (/^https:\/\//.test(a.details) ? h("a", { href: a.details, target: "_blank", rel: "noopener noreferrer", text: "Open to review ↗" }) : h("p", { text: a.details })) : null,
      a.client_note ? h("p", { className: "portal-meta", text: "Note: " + a.client_note }) : null,
      +a.bill_amount ? h("p", { className: "portal-meta", text: (a.status === "approved" ? "Stage payment invoiced: " : "Approving this invoices the stage payment of ") + ksh(a.bill_amount) }) : null);
    if (!admin && a.status === "pending") {
      var note = h("textarea", { rows: "2", maxlength: "2000", placeholder: "What should change? (needed for change requests)", "aria-label": "Notes on " + a.title });
      var decide = function (decision) {
        api("approval_decide", { method: "POST", body: { id: a.id, decision: decision, note: note.value } })
          .then(function () { toast(decision === "approved" ? "Approved. Thank you!" : "Thanks, we’ll make the changes."); load(); })
          .catch(function (e) { toast(e.message, true); });
      };
      li.appendChild(note);
      li.appendChild(h("div", { className: "row-actions" },
        h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () { decide("approved"); }, text: t("Approve") }),
        h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () { decide("changes"); }, text: t("Request changes") })));
    }
    if (admin) li.appendChild(h("button", { type: "button", className: "linklike danger", onclick: function () { remove("approval", a.id); }, text: "Delete" }));
    return li;
  }

  // ---------- invoices and receipts ----------
  function printInvoice(inv) {
    var client = isTeam() ? (data.clients.find(function (c) { return +c.id === +inv.client_id; }) || {}) : (data.me || {});
    var paid = inv.status === "paid";
    var css = ".page{max-width:800px;margin:24px auto;background:#fff;padding:48px;border-radius:14px;box-shadow:0 10px 30px rgba(11,27,53,.12)}" +
      ".top{display:flex;justify-content:space-between;align-items:center;gap:24px;border-bottom:4px solid #ffb800;padding-bottom:24px}.brand{display:flex;gap:14px;align-items:center}.brand img{width:64px;height:64px;border-radius:50%}" +
      ".brand b{font-size:22px;color:#0b1b35}.brand b span{color:#d49a00}h1{margin:0;font-size:30px;color:#0b1b35;text-align:right}.muted{color:#475569;font-size:14px}" +
      ".meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0}.meta div{background:#f8fafc;border-radius:10px;padding:14px 16px}.meta b{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a16207;margin-bottom:4px}" +
      "table{width:100%;border-collapse:collapse}th,td{padding:14px 12px;border-bottom:1px solid #e2e8f0;text-align:left}th{background:#0b1b35;color:#fff;font-size:13px;text-transform:uppercase;letter-spacing:.06em}.r{text-align:right}" +
      "tfoot td{font-weight:800;font-size:20px;border:0}.stamp{display:inline-block;margin-top:20px;padding:8px 18px;border:3px solid #059669;color:#059669;border-radius:10px;font-weight:800;letter-spacing:.1em;transform:rotate(-4deg)}" +
      ".notes{margin-top:24px;font-size:14px;color:#475569}.foot{margin-top:28px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;color:#475569}@media(max-width:600px){.page{margin:12px;padding:24px}.meta{grid-template-columns:1fr}}";
    var body = "<div class=\"page\"><div class=\"top\"><div class=\"brand\"><img src=\"" + esc(logoUrl()) + "\" alt=\"\"><div><b>Marzley<span>Tech</span> Solutions</b><div class=\"muted\">Technology for real solutions</div></div></div>" +
      "<div><h1>" + (paid ? "Receipt" : "Invoice") + "</h1><div class=\"muted\">" + esc(inv.number) + "</div>" +
      (data.org && data.org.kra_pin ? "<div class=\"muted\">KRA PIN " + esc(data.org.kra_pin) + "</div>" : "") + "</div></div>" +
      "<div class=\"meta\"><div><b>Billed to</b>" + esc(client.name) + "<br><span class=\"muted\">" + esc(client.email) + "</span></div>" +
      "<div><b>" + (paid ? "Paid on" : "Date") + "</b>" + esc(day(paid ? inv.paid_at : inv.created_at)) + (inv.due_date && !paid ? "<br><span class=\"muted\">Due " + esc(day(inv.due_date)) + "</span>" : "") + "</div></div>" +
      "<table><thead><tr><th>Description</th><th class=\"r\">Amount</th></tr></thead><tbody><tr><td>" + esc(inv.description) + "</td><td class=\"r\">" + esc(ksh(inv.amount)) + "</td></tr></tbody>" +
      "<tfoot><tr><td>" + (paid ? "Total paid" : "Total due") + "</td><td class=\"r\">" + esc(ksh(inv.amount)) + "</td></tr></tfoot></table>" +
      (paid ? "<div class=\"stamp\">PAID" + (inv.mpesa_receipt ? " · M-PESA " + esc(inv.mpesa_receipt) : "") + "</div>" :
        "<p class=\"notes\">Pay by M-Pesa in the client portal, or Buy Goods Till 6095737 with reference " + esc(inv.number) + ".</p>") +
      "<div class=\"foot\">" + esc((data.org && data.org.name) || "Marzley Tech Solutions") + (data.org && data.org.kra_pin ? " · KRA PIN " + esc(data.org.kra_pin) : "") +
      " · +254 745 789 590 · marzleytechsolutionltd@gmail.com · marzleytechsolutions.co.ke · Kenya" +
      (data.org && data.org.etims ? "<br>An eTIMS tax invoice is issued for this " + (paid ? "payment" : "invoice") + " on request." : "") + "</div></div>";
    printDoc((paid ? "Receipt " : "Invoice ") + inv.number, css, body);
  }

  // ---------- support ----------
  function renderSupport(box, admin) {
    var tx = admin ? function (x) { return x; } : t;
    box.textContent = "";
    var tickets = data.tickets || [];
    if (!admin || data.clients.length) {
      var subject = h("input", { maxlength: "160" });
      var message = h("textarea", { rows: "3", maxlength: "4000" });
      var who = admin ? select(clientOptions()) : null;
      var project = select([["", tx("General")]].concat(data.projects.filter(function (p) { return !admin || true; }).map(function (p) { return [p.id, p.title]; })));
      var form = h("form", { className: "form portal-form", onsubmit: function (e) {
        e.preventDefault();
        save("ticket_open", { client_id: who ? who.value : 0, project_id: project.value, subject: subject.value, message: message.value }, form);
      } },
        h("h3", { className: "full", text: admin ? "Start a conversation with a client" : t("Need help? Open a support request") }),
        who ? field("Client", who) : null, field(tx("About"), project), field(tx("Subject"), subject),
        h("div", { className: "field full" }, h("label", { for: "t-msg-" + (admin ? "a" : "c"), text: tx("Message") }), message),
        h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: tx("Send") })));
      message.id = "t-msg-" + (admin ? "a" : "c");
      box.appendChild(form);
    }
    if (!tickets.length) { box.appendChild(h("p", { className: "portal-empty", text: tx("No support requests yet.") })); return; }
    tickets.forEach(function (t) {
      var msgs = (data.messages || []).filter(function (m) { return +m.ticket_id === +t.id; });
      var client = admin ? (data.clients.find(function (c) { return +c.id === +t.client_id; }) || {}).name : null;
      var thread = h("ol", { className: "thread" });
      msgs.forEach(function (m) {
        thread.appendChild(h("li", { className: "msg msg-" + (m.author === (admin ? "admin" : "client") ? "mine" : "theirs") },
          h("span", { className: "portal-meta", text: (m.author === "admin" ? "Marzley Tech" : (admin ? client : tx("You"))) + " · " + day(m.created_at) }),
          h("p", { text: m.message })));
      });
      var reply = h("textarea", { rows: "2", maxlength: "4000", placeholder: tx("Write a reply…"), "aria-label": tx("Reply") + ": " + t.subject });
      var det = h("details", { className: "portal-card ticket", "data-status": t.status, open: t.status === "open" && admin ? true : null },
        h("summary", null, h("strong", { text: t.subject }), h("span", { className: "pill pill-" + (t.status === "open" ? "unpaid" : "paid"), text: tx(t.status === "open" ? "Open" : "Closed") }),
          admin ? h("span", { className: "portal-meta", text: client || "" }) : null),
        thread,
        h("form", { className: "inline-form", onsubmit: function (e) {
          e.preventDefault();
          save("ticket_reply", { ticket_id: t.id, message: reply.value }, e.target);
        } }, reply, h("button", { type: "submit", className: "btn btn-solid btn-sm", text: tx("Reply") })),
        h("button", { type: "button", className: "linklike", onclick: function () {
          save("ticket_status", { ticket_id: t.id, status: t.status === "open" ? "closed" : "open" });
        }, text: tx(t.status === "open" ? "Mark as solved" : "Reopen") }));
      box.appendChild(det);
    });
  }

  // ---------- referral link ----------
  // ---------- courses ----------
  function youtubeId(url) {
    var m = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function courseLessons(courseId) { return (data.lessons || []).filter(function (l) { return +l.course_id === +courseId; }); }
  function doneSet(clientId) {
    var set = {};
    (data.progress || []).forEach(function (p) { if (+p.client_id === +clientId) set[p.lesson_id] = true; });
    return set;
  }
  function printCertificate(cert, name, courseTitle) {
    var verify = location.origin + "/portal/verify.php?code=" + encodeURIComponent(cert.code);
    var css = "@page{size:A4 landscape;margin:0}.page{max-width:1000px;margin:24px auto;background:#fff;padding:56px;border:14px solid #0b1b35;outline:4px solid #ffb800;outline-offset:-26px;text-align:center;box-shadow:0 10px 30px rgba(11,27,53,.12)}" +
      ".page img{width:90px;height:90px;border-radius:50%}.kicker{margin:18px 0 0;letter-spacing:.3em;text-transform:uppercase;color:#a16207;font-weight:800;font-size:14px}" +
      "h1{margin:10px 0 24px;font-size:44px;color:#0b1b35}.to{color:#475569}.name{margin:8px 0 18px;font-size:40px;font-weight:800;color:#0b1b35;border-bottom:3px solid #ffb800;display:inline-block;padding:0 24px 6px}" +
      ".course{font-size:24px;font-weight:700;color:#0b1b35}.row{display:flex;justify-content:space-between;gap:24px;margin-top:48px;font-size:14px;color:#475569;text-align:left}.row b{display:block;color:#0b1b35;font-size:16px}";
    var body = "<div class=\"page\"><img src=\"" + esc(logoUrl()) + "\" alt=\"\"><p class=\"kicker\">Marzley Tech Solutions</p><h1>Certificate of Completion</h1>" +
      "<p class=\"to\">This certifies that</p><div class=\"name\">" + esc(name) + "</div><p class=\"to\">has successfully completed</p><p class=\"course\">" + esc(courseTitle) + "</p>" +
      "<div class=\"row\"><div><b>Kelvin G. Wanyoike</b>Founder &amp; trainer</div><div><b>" + esc(day(cert.issued_at)) + "</b>Date</div><div><b>" + esc(cert.code) + "</b>Verify at " + esc(verify) + "</div></div></div>";
    printDoc("Certificate " + cert.code, css, body);
  }
  function renderClientCourses() {
    var courses = data.courses || [];
    $("ctab-courses").hidden = !courses.length;
    var box = $("client-courses");
    box.textContent = "";
    var done = doneSet(me.client_id);
    courses.forEach(function (c) {
      var lessons = courseLessons(c.id);
      var count = lessons.filter(function (l) { return done[l.id]; }).length;
      var pct = lessons.length ? Math.round(count / lessons.length * 100) : 0;
      var cert = (data.certificates || []).find(function (x) { return +x.course_id === +c.id; });
      var card = h("article", { className: "portal-card" },
        h("div", { className: "portal-card-head" }, h("h3", { text: c.title }), h("span", { className: "pill " + (cert ? "pill-paid" : "pill-build"), text: cert ? "Completed" : pct + "%" })),
        h("div", { className: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct), "aria-label": "Course progress" }, h("span", { style: "width:" + pct + "%" })),
        h("p", { className: "portal-meta", text: count + " of " + lessons.length + " lessons complete" }),
        c.summary ? h("p", { className: "portal-summary", text: c.summary }) : null);
      if (cert) card.appendChild(h("div", { className: "cert-box" },
        h("i", { className: "fa-solid fa-award", "aria-hidden": "true" }),
        h("div", null, h("strong", { text: "Your certificate is ready" }), h("span", { className: "portal-meta", text: "Code " + cert.code })),
        h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () { printCertificate(cert, data.me.name || me.name, c.title); }, text: "Download certificate" })));
      var list = h("ol", { className: "lessons" });
      lessons.forEach(function (l, i) {
        var box2 = h("input", { type: "checkbox", checked: done[l.id] ? true : null, "aria-label": "Mark “" + l.title + "” complete" });
        box2.addEventListener("change", function () {
          api("lesson_done", { method: "POST", body: { lesson_id: l.id, done: box2.checked } }).then(function (r) {
            if (r.certificate) toast("Course complete! Your certificate is ready.");
            load();
          }).catch(function (e) { box2.checked = !box2.checked; toast(e.message, true); });
        });
        var content = h("div", { className: "lesson-body" });
        var yt = youtubeId(l.video_url);
        if (yt) content.appendChild(h("div", { className: "lesson-video" }, h("iframe", { src: "https://www.youtube-nocookie.com/embed/" + yt + "?rel=0", title: l.title, allow: "encrypted-media; picture-in-picture", allowfullscreen: true, loading: "lazy" })));
        else if (/^https:\/\//.test(l.video_url || "")) content.appendChild(h("a", { href: l.video_url, target: "_blank", rel: "noopener noreferrer", text: "Open the lesson video ↗" }));
        if (l.body) content.appendChild(h("p", { className: "lesson-text", text: l.body }));
        list.appendChild(h("li", { className: done[l.id] ? "is-done" : "" },
          h("details", null, h("summary", null, h("span", { className: "lesson-num", text: String(i + 1) }), h("span", { text: l.title })), content),
          h("label", { className: "lesson-check" }, box2, h("span", { text: "Done" }))));
      });
      card.appendChild(lessons.length ? list : h("p", { className: "portal-empty", text: "Lessons will appear here soon." }));
      box.appendChild(card);
    });
  }
  function renderAdminCourses() {
    var panel = $("panel-courses");
    panel.textContent = "";
    var title = h("input", { maxlength: "160" });
    var summary = h("textarea", { rows: "2", maxlength: "2000" });
    summary.id = "c-summary";
    var form = h("form", { className: "form portal-form", onsubmit: function (e) {
      e.preventDefault();
      save("course_save", { title: title.value, summary: summary.value }, form);
    } }, h("h2", { className: "full", text: "Create a course" }), field("Course name", title),
      h("div", { className: "field full" }, h("label", { for: "c-summary", text: "Summary" }), summary),
      h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Create course" })));
    panel.appendChild(form);
    (data.courses || []).forEach(function (c) {
      var lessons = courseLessons(c.id);
      var card = h("article", { className: "portal-card" }, h("div", { className: "portal-card-head" }, h("h3", { text: c.title }), h("span", { className: "portal-meta", text: lessons.length + " lessons" })));
      var ol = h("ol", { className: "admin-list" });
      lessons.forEach(function (l) {
        ol.appendChild(h("li", null, h("div", null, h("strong", { text: l.title }), h("span", { className: "portal-meta", text: l.video_url || "No video" })),
          h("button", { type: "button", className: "linklike danger", onclick: function () { remove("lesson", l.id); }, text: "Delete" })));
      });
      card.appendChild(h("h4", { text: "Lessons" }));
      card.appendChild(lessons.length ? ol : h("p", { className: "portal-empty", text: "No lessons yet." }));
      var lt = h("input", { maxlength: "160", placeholder: "Lesson title", "aria-label": "Lesson title" });
      var lv = h("input", { maxlength: "300", placeholder: "Video link (YouTube, optional)", "aria-label": "Video link" });
      var lb = h("textarea", { rows: "2", maxlength: "20000", placeholder: "Lesson notes (optional)", "aria-label": "Lesson notes" });
      card.appendChild(h("form", { className: "inline-form", onsubmit: function (e) {
        e.preventDefault();
        save("lesson_save", { course_id: c.id, title: lt.value, video_url: lv.value, body: lb.value }, e.target);
      } }, lt, lv, lb, h("button", { type: "submit", className: "btn btn-ghost btn-sm", text: "Add lesson" })));
      card.appendChild(h("h4", { text: "Students" }));
      var enrolled = (data.enrollments || []).filter(function (en) { return +en.course_id === +c.id; });
      var sl = h("ul", { className: "admin-list" });
      enrolled.forEach(function (en) {
        var st = data.clients.find(function (x) { return +x.id === +en.client_id; }) || {};
        var done = doneSet(en.client_id);
        var n = lessons.filter(function (l) { return done[l.id]; }).length;
        var cert = (data.certificates || []).find(function (x) { return +x.course_id === +c.id && +x.client_id === +en.client_id; });
        sl.appendChild(h("li", null, h("div", null, h("strong", { text: st.name || "?" }), h("span", { className: "portal-meta", text: n + "/" + lessons.length + " lessons" + (cert ? " · Certificate " + cert.code : "") })),
          h("span", { className: "row-actions" },
            cert ? h("button", { type: "button", className: "linklike", onclick: function () { printCertificate(cert, st.name, c.title); }, text: "Certificate" })
              : h("button", { type: "button", className: "linklike", onclick: function () { save("certificate_issue", { client_id: en.client_id, course_id: c.id }); }, text: "Issue certificate" }),
            h("button", { type: "button", className: "linklike danger", onclick: function () { remove("enrollment", en.id); }, text: "Remove" }))));
      });
      card.appendChild(enrolled.length ? sl : h("p", { className: "portal-empty", text: "No students yet." }));
      if (data.clients.length) {
        var who = select(clientOptions());
        who.setAttribute("aria-label", "Student to enrol");
        card.appendChild(h("form", { className: "inline-form", onsubmit: function (e) {
          e.preventDefault();
          save("enroll", { client_id: who.value, course_id: c.id });
        } }, who, h("button", { type: "submit", className: "btn btn-solid btn-sm", text: "Enrol student" })));
      }
      panel.appendChild(card);
    });
  }

  // ---------- start ----------
  // ---------- sign in with a one-time code ----------
  var codeForm = $("code-form"), codeToggle = $("code-toggle");
  if (codeForm) {
    codeToggle.addEventListener("click", function () {
      codeForm.hidden = !codeForm.hidden;
      codeToggle.setAttribute("aria-expanded", String(!codeForm.hidden));
      if (!codeForm.hidden) $("code-who").focus();
    });
    codeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var who = $("code-who").value.trim(), msg = $("code-msg"), btn = $("code-btn");
      if (!who) { msg.textContent = t("Your email (or the phone number you gave us)"); return; }
      btn.disabled = true;
      if ($("code-step2").hidden) {
        api("code_request", { method: "POST", body: { who: who } }).then(function (r) {
          msg.textContent = r.message;
          $("code-step2").hidden = false;
          $("code-name-row").hidden = who.indexOf("@") < 0;
          btn.textContent = t("Sign in");
          $("code-code").focus();
        }).catch(function (x) { msg.textContent = x.message; }).then(function () { btn.disabled = false; });
      } else {
        api("code_verify", { method: "POST", body: { who: who, code: $("code-code").value, name: $("code-name").value.trim(), ref: refCode() } })
          .then(function (d) { csrf = d.csrf; me = d.user; load(); })
          .catch(function (x) { msg.textContent = x.message; btn.disabled = false; });
      }
    });
  }

  translateStatic();
  ["lang-toggle", "client-lang"].forEach(function (id) {
    var lt0 = $(id);
    if (lt0) lt0.addEventListener("click", function () {
      LANG = LANG === "sw" ? "en" : "sw";
      try { localStorage.setItem("marzley-portal-lang", LANG); } catch (e) {}
      translateStatic();
      if (data && me && !isTeam()) renderClient();
    });
  });
  var cardResult = (location.search.match(/[?&]card=([a-z]+)/) || [])[1];
  if (cardResult) {
    history.replaceState(null, "", location.pathname);
    setTimeout(function () {
      if (cardResult === "paid") toast(t("Payment received. Thank you!"));
      else if (cardResult === "pending") toast("Your card payment is still being confirmed. The invoice will update shortly.");
      else toast("The card payment didn’t go through. No money was taken. You can try again or pay by M-Pesa.", true);
    }, 600);
  }
  api("me").then(function (d) {
    me = d.user;
    csrf = d.csrf;
    googleClientId = d.google_client_id;
    if (d.staging) document.body.insertBefore(h("p", { className: "staging-banner", role: "note" },
      h("i", { className: "fa-solid fa-flask", "aria-hidden": "true" }), " Staging site: test data only. Payments use the M-Pesa sandbox."), document.body.firstChild);
    if (me) load();
    else signedOut(d.expired || "");
  }).catch(function (e) {
    show("view-signin");
    $("signin-error").textContent = e.message;
  });
})();
