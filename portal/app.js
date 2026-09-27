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
        if (!res.ok) { var err = new Error(d.error || "Something went wrong. Please try again."); err.status = res.status; throw err; }
        return d;
      });
    });
  }

  function show(view) {
    ["portal-loading", "view-signin", "view-client", "view-admin"].forEach(function (id) { $(id).hidden = id !== view; });
    document.body.classList.toggle("is-admin", view === "view-admin");
    $("portal-user").hidden = !me;
    if (me) {
      $("portal-name").textContent = me.name || me.email;
      $("admin-name").textContent = me.name || me.email;
    }
  }

  // ---------- sign-in ----------
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
        api("login", { method: "POST", body: { credential: resp.credential } })
          .then(function (d) { csrf = d.csrf; me = d.user; load(); })
          .catch(function (e) { $("signin-error").textContent = e.message; });
      }
    });
    google.accounts.id.renderButton($("google-signin"), { theme: "filled_blue", size: "large", shape: "pill", text: "signin_with" });
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
      if (me.role === "admin") { renderAdmin(); show("view-admin"); }
      else { renderClient(); show("view-client"); }
    }).catch(function (e) {
      if (e.status === 401) { me = null; show("view-signin"); }
      else toast(e.message, true);
    });
  }

  // ---------- client view ----------
  function projectCard(p, admin) {
    var ups = data.updates.filter(function (u) { return +u.project_id === +p.id; });
    var files = data.files.filter(function (f) { return +f.project_id === +p.id; });
    var card = h("article", { className: "portal-card" },
      h("div", { className: "portal-card-head" },
        h("h3", { text: p.title }),
        h("span", { className: "pill pill-" + p.status, text: STATUS[p.status] || p.status })),
      h("div", { className: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(p.progress), "aria-label": "Progress" },
        h("span", { style: "width:" + Math.max(0, Math.min(100, +p.progress)) + "%" })),
      h("p", { className: "portal-meta", text: p.progress + "% complete" + (p.due_date ? " · Target date " + day(p.due_date) : "") }),
      p.summary ? h("p", { className: "portal-summary", text: p.summary }) : null);

    var approvals = (data.approvals || []).filter(function (a) { return +a.project_id === +p.id; });
    if (approvals.length || admin) card.appendChild(h("h4", { text: "Approvals" }));
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
    card.appendChild(h("h4", { text: "Updates" }));
    card.appendChild(ups.length ? timeline : h("p", { className: "portal-empty", text: "No updates yet." }));

    card.appendChild(h("h4", { text: "Files" }));
    if (files.length) {
      var list = h("ul", { className: "file-list" });
      files.forEach(function (f) {
        list.appendChild(h("li", null,
          h("a", { href: API + "?action=download&id=" + encodeURIComponent(f.id) },
            h("i", { className: "fa-solid fa-file-arrow-down", "aria-hidden": "true" }), " " + f.original_name),
          h("span", { className: "portal-meta", text: size(+f.size) + " · " + day(f.created_at) }),
          admin ? h("button", { type: "button", className: "linklike danger", onclick: function () { remove("file", f.id); }, text: "Delete" }) : null));
      });
      card.appendChild(list);
    } else {
      card.appendChild(h("p", { className: "portal-empty", text: "No files yet." }));
    }
    return card;
  }

  function renderClient() {
    $("client-title").textContent = "Hello, " + (me.name || "there");
    var box = $("client-projects");
    box.textContent = "";
    if (!data.projects.length) box.appendChild(h("p", { className: "portal-empty", text: "Your project will appear here once it starts." }));
    data.projects.forEach(function (p) { box.appendChild(projectCard(p, false)); });
    renderInvoices($("client-invoices"), data.invoices, false);
    renderClientCourses();
    // Students with only courses don't need empty project and invoice sections
    var studentOnly = !data.projects.length && !data.invoices.length && (data.courses || []).length > 0;
    $("sec-projects").hidden = studentOnly;
    $("sec-invoices").hidden = studentOnly;
    document.querySelectorAll('.portal-jump a[href="#sec-projects"], .portal-jump a[href="#sec-invoices"]').forEach(function (a) { a.hidden = studentOnly; });
    renderSupport($("client-support"), false);
    renderReferral();
  }

  function renderInvoices(box, invoices, admin) {
    box.textContent = "";
    if (!invoices.length) { box.appendChild(h("p", { className: "portal-empty", text: "No invoices yet." })); return; }
    var table = h("table", { className: "portal-table" },
      h("thead", null, h("tr", null,
        h("th", { text: "Invoice" }), admin ? h("th", { text: "Client" }) : null, h("th", { text: "Description" }),
        h("th", { className: "r", text: "Amount" }), h("th", { text: "Due" }), h("th", { text: "Status" }), h("th", { text: "" }))));
    var body = h("tbody");
    invoices.forEach(function (inv) {
      var client = admin ? (data.clients.find(function (c) { return +c.id === +inv.client_id; }) || {}).name : null;
      var pdf = h("button", { type: "button", className: "linklike", onclick: function () { printInvoice(inv); }, text: inv.status === "paid" ? "Receipt" : "PDF" });
      var action = h("span", { className: "row-actions" }, pdf);
      if (!admin && inv.status === "unpaid") action.insertBefore(h("button", { type: "button", className: "btn btn-mpesa btn-sm", onclick: function () { payInvoice(inv); }, text: "Pay with M-Pesa" }), pdf);
      if (admin) {
        action.appendChild(h("button", { type: "button", className: "linklike", onclick: function () { editInvoice(inv); }, text: "Edit" }));
        action.appendChild(h("button", { type: "button", className: "linklike danger", onclick: function () { remove("invoice", inv.id); }, text: "Delete" }));
      }
      body.appendChild(h("tr", null,
        h("td", { "data-label": "Invoice", text: inv.number }),
        admin ? h("td", { "data-label": "Client", text: client || "" }) : null,
        h("td", { "data-label": "Description", text: inv.description }),
        h("td", { "data-label": "Amount", className: "r", text: ksh(inv.amount) }),
        h("td", { "data-label": "Due", text: day(inv.due_date) || "—" }),
        h("td", { "data-label": "Status" }, h("span", { className: "pill pill-" + inv.status, text: inv.status === "paid" ? "Paid" + (inv.mpesa_receipt ? " · " + inv.mpesa_receipt : "") : inv.status === "unpaid" ? "Unpaid" : "Cancelled" })),
        h("td", null, action)));
    });
    table.appendChild(body);
    box.appendChild(h("div", { className: "table-wrap" }, table));
  }

  // ---------- paying an invoice ----------
  function payInvoice(inv) {
    var dlg = h("dialog", { className: "portal-dialog", "aria-labelledby": "pay-title" });
    var err = h("p", { className: "portal-error", role: "alert" });
    var status = h("div", { className: "deposit-status", role: "status", "aria-live": "polite", hidden: true });
    var phone = h("input", { id: "pay-phone", type: "tel", inputmode: "numeric", autocomplete: "tel", placeholder: "0712 345 678", required: true });
    var btn = h("button", { type: "submit", className: "btn btn-mpesa", text: "Send M-Pesa prompt" });
    var timer;
    var form = h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      err.textContent = "";
      btn.disabled = true;
      api("pay_invoice", { method: "POST", body: { invoice_id: inv.id, phone: phone.value } }).then(function () {
        status.hidden = false;
        status.className = "deposit-status is-wait";
        status.textContent = "Check your phone and enter your M-Pesa PIN to pay " + ksh(inv.amount) + ".";
        var tries = 30;
        (function poll() {
          api("payment_status", { query: "&invoice_id=" + encodeURIComponent(inv.id) }).then(function (s) {
            if (s.status === "paid") {
              status.className = "deposit-status is-ok";
              status.textContent = "Paid. Thank you! M-Pesa receipt " + (s.receipt || "") + ".";
              btn.disabled = false;
              load();
            } else if (s.status === "failed") {
              status.className = "deposit-status is-fail";
              status.textContent = "The payment didn't go through. No money was deducted. You can try again.";
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
      h("h2", { id: "pay-title", text: "Pay " + inv.number }),
      h("p", { text: inv.description + " · " + ksh(inv.amount) }),
      h("div", { className: "field" }, h("label", { for: "pay-phone", text: "M-Pesa phone number" }), phone),
      err, btn, status,
      h("button", { type: "button", className: "linklike", onclick: function () { clearTimeout(timer); dlg.close(); }, text: "Close" }));
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
    renderOverview();
    renderReports();
    renderAdminProjects();
    renderAdminClients();
    renderAdminInvoices();
    renderSupport($("panel-support"), true);
    renderAdminCourses();
    var open = (data.tickets || []).filter(function (t) { return t.status === "open"; }).length;
    $("open-count").textContent = String(open);
    $("open-count").hidden = !open;
    var badge = function (id, n) { $(id).textContent = String(n); $(id).hidden = !n; };
    badge("count-projects", data.projects.filter(function (p) { return p.status !== "live"; }).length);
    badge("count-clients", data.clients.length);
    badge("count-invoices", data.invoices.filter(function (i) { return i.status === "unpaid"; }).length);
    badge("count-courses", (data.courses || []).length);
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
    panel.appendChild(form);
    var list = h("ul", { className: "admin-list" });
    data.clients.forEach(function (c) {
      list.appendChild(h("li", null, h("div", null, h("strong", { text: c.name }), h("span", { className: "portal-meta", text: c.email + (c.phone ? " · " + c.phone : "") })),
        h("span", { className: "row-actions" },
          c.phone ? h("a", { className: "linklike", href: waTo(c.phone, "Hello " + c.name + ","), target: "_blank", rel: "noopener noreferrer", text: "WhatsApp" }) : null,
          h("button", { type: "button", className: "linklike", onclick: function () { renderAdminClients(c); name.focus(); }, text: "Edit" }))));
    });
    panel.appendChild(data.clients.length ? list : h("p", { className: "portal-empty", text: "No clients yet. Add one above; they can then sign in with that Google account." }));
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

    data.projects.forEach(function (p) {
      var card = projectCard(p, true);
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
      card.appendChild(h("form", { className: "inline-form", onsubmit: function (e) {
        e.preventDefault();
        save("approval_request", { project_id: p.id, title: apTitle.value, details: apDetails.value }, e.target);
      } }, apTitle, apDetails, h("button", { type: "submit", className: "btn btn-ghost btn-sm", text: "Request approval" })));
      if (c && c.phone) card.appendChild(h("a", { className: "wa-link", href: waTo(c.phone, "Hello " + c.name + ", there's a new update on " + p.title + " in your Marzley Tech portal: " + location.origin + "/portal/"), target: "_blank", rel: "noopener noreferrer" },
        h("i", { className: "fab fa-whatsapp", "aria-hidden": "true" }), " Message " + c.name + " on WhatsApp"));
      card.appendChild(h("button", { type: "button", className: "linklike", onclick: function () { renderAdminProjects(p); window.scrollTo(0, 0); }, text: "Edit project details" }));
      panel.appendChild(card);
    });
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
    panel.appendChild(form);
    var list = h("div");
    renderInvoices(list, data.invoices, true);
    panel.appendChild(list);
  }

  var TABS = ["overview", "reports", "projects", "clients", "invoices", "support", "courses"];
  var TAB_NAMES = { overview: "Overview", reports: "Reports", projects: "Projects", clients: "People", invoices: "Invoices", support: "Support", courses: "Courses" };
  function selectTab(name) {
    TABS.forEach(function (t) {
      $("tab-" + t).setAttribute("aria-selected", String(t === name));
      $("tab-" + t).tabIndex = t === name ? 0 : -1;
      $("panel-" + t).hidden = t !== name;
    });
    $("admin-crumb-page").textContent = TAB_NAMES[name];
    // The chart is drawn at the panel's real width, so redraw it once it is visible
    if (name === "reports" && data) renderReports();
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
      var next = TABS[(i + d + TABS.length) % TABS.length];
      selectTab(next);
      $("tab-" + next).focus();
    });
  });
  $("admin-signout").addEventListener("click", function () { $("sign-out").click(); });

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
    cards.forEach(function (c) {
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
      h("button", { type: "button", className: "btn btn-solid", onclick: function () { selectTab("clients"); } }, h("i", { className: "fa-solid fa-user-plus", "aria-hidden": "true" }), " Add a client"),
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
    var label = { pending: "Waiting for you", approved: "Approved", changes: "Changes requested" }[a.status] || a.status;
    if (admin && a.status === "pending") label = "Waiting for client";
    var li = h("li", { className: "approval approval-" + a.status },
      h("div", { className: "approval-head" }, h("strong", { text: a.title }), h("span", { className: "pill pill-" + (a.status === "approved" ? "paid" : a.status === "pending" ? "unpaid" : "on_hold"), text: label })),
      a.details ? (/^https:\/\//.test(a.details) ? h("a", { href: a.details, target: "_blank", rel: "noopener noreferrer", text: "Open to review ↗" }) : h("p", { text: a.details })) : null,
      a.client_note ? h("p", { className: "portal-meta", text: "Note: " + a.client_note }) : null);
    if (!admin && a.status === "pending") {
      var note = h("textarea", { rows: "2", maxlength: "2000", placeholder: "What should change? (needed for change requests)", "aria-label": "Notes on " + a.title });
      var decide = function (decision) {
        api("approval_decide", { method: "POST", body: { id: a.id, decision: decision, note: note.value } })
          .then(function () { toast(decision === "approved" ? "Approved. Thank you!" : "Thanks, we’ll make the changes."); load(); })
          .catch(function (e) { toast(e.message, true); });
      };
      li.appendChild(note);
      li.appendChild(h("div", { className: "row-actions" },
        h("button", { type: "button", className: "btn btn-solid btn-sm", onclick: function () { decide("approved"); }, text: "Approve" }),
        h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () { decide("changes"); }, text: "Request changes" })));
    }
    if (admin) li.appendChild(h("button", { type: "button", className: "linklike danger", onclick: function () { remove("approval", a.id); }, text: "Delete" }));
    return li;
  }

  // ---------- invoices and receipts ----------
  function printInvoice(inv) {
    var client = me.role === "admin" ? (data.clients.find(function (c) { return +c.id === +inv.client_id; }) || {}) : (data.me || {});
    var paid = inv.status === "paid";
    var css = ".page{max-width:800px;margin:24px auto;background:#fff;padding:48px;border-radius:14px;box-shadow:0 10px 30px rgba(11,27,53,.12)}" +
      ".top{display:flex;justify-content:space-between;align-items:center;gap:24px;border-bottom:4px solid #ffb800;padding-bottom:24px}.brand{display:flex;gap:14px;align-items:center}.brand img{width:64px;height:64px;border-radius:50%}" +
      ".brand b{font-size:22px;color:#0b1b35}.brand b span{color:#d49a00}h1{margin:0;font-size:30px;color:#0b1b35;text-align:right}.muted{color:#475569;font-size:14px}" +
      ".meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0}.meta div{background:#f8fafc;border-radius:10px;padding:14px 16px}.meta b{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a16207;margin-bottom:4px}" +
      "table{width:100%;border-collapse:collapse}th,td{padding:14px 12px;border-bottom:1px solid #e2e8f0;text-align:left}th{background:#0b1b35;color:#fff;font-size:13px;text-transform:uppercase;letter-spacing:.06em}.r{text-align:right}" +
      "tfoot td{font-weight:800;font-size:20px;border:0}.stamp{display:inline-block;margin-top:20px;padding:8px 18px;border:3px solid #059669;color:#059669;border-radius:10px;font-weight:800;letter-spacing:.1em;transform:rotate(-4deg)}" +
      ".notes{margin-top:24px;font-size:14px;color:#475569}.foot{margin-top:28px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;color:#475569}@media(max-width:600px){.page{margin:12px;padding:24px}.meta{grid-template-columns:1fr}}";
    var body = "<div class=\"page\"><div class=\"top\"><div class=\"brand\"><img src=\"" + esc(logoUrl()) + "\" alt=\"\"><div><b>Marzley<span>Tech</span> Solutions</b><div class=\"muted\">Technology for real solutions</div></div></div>" +
      "<div><h1>" + (paid ? "Receipt" : "Invoice") + "</h1><div class=\"muted\">" + esc(inv.number) + "</div></div></div>" +
      "<div class=\"meta\"><div><b>Billed to</b>" + esc(client.name) + "<br><span class=\"muted\">" + esc(client.email) + "</span></div>" +
      "<div><b>" + (paid ? "Paid on" : "Date") + "</b>" + esc(day(paid ? inv.paid_at : inv.created_at)) + (inv.due_date && !paid ? "<br><span class=\"muted\">Due " + esc(day(inv.due_date)) + "</span>" : "") + "</div></div>" +
      "<table><thead><tr><th>Description</th><th class=\"r\">Amount</th></tr></thead><tbody><tr><td>" + esc(inv.description) + "</td><td class=\"r\">" + esc(ksh(inv.amount)) + "</td></tr></tbody>" +
      "<tfoot><tr><td>" + (paid ? "Total paid" : "Total due") + "</td><td class=\"r\">" + esc(ksh(inv.amount)) + "</td></tr></tfoot></table>" +
      (paid ? "<div class=\"stamp\">PAID" + (inv.mpesa_receipt ? " · M-PESA " + esc(inv.mpesa_receipt) : "") + "</div>" :
        "<p class=\"notes\">Pay by M-Pesa in the client portal, or Buy Goods Till 6095737 with reference " + esc(inv.number) + ".</p>") +
      "<div class=\"foot\">Marzley Tech Solutions · +254 745 789 590 · marzleytechsolutionltd@gmail.com · marzleytechsolutions.co.ke · Kenya</div></div>";
    printDoc((paid ? "Receipt " : "Invoice ") + inv.number, css, body);
  }

  // ---------- support ----------
  function renderSupport(box, admin) {
    box.textContent = "";
    var tickets = data.tickets || [];
    if (!admin || data.clients.length) {
      var subject = h("input", { maxlength: "160" });
      var message = h("textarea", { rows: "3", maxlength: "4000" });
      var who = admin ? select(clientOptions()) : null;
      var project = select([["", "General"]].concat(data.projects.filter(function (p) { return !admin || true; }).map(function (p) { return [p.id, p.title]; })));
      var form = h("form", { className: "form portal-form", onsubmit: function (e) {
        e.preventDefault();
        save("ticket_open", { client_id: who ? who.value : 0, project_id: project.value, subject: subject.value, message: message.value }, form);
      } },
        h("h3", { className: "full", text: admin ? "Start a conversation with a client" : "Need help? Open a support request" }),
        who ? field("Client", who) : null, field("About", project), field("Subject", subject),
        h("div", { className: "field full" }, h("label", { for: "t-msg-" + (admin ? "a" : "c"), text: "Message" }), message),
        h("div", { className: "form-foot" }, h("button", { type: "submit", className: "btn btn-solid", text: "Send" })));
      message.id = "t-msg-" + (admin ? "a" : "c");
      box.appendChild(form);
    }
    if (!tickets.length) { box.appendChild(h("p", { className: "portal-empty", text: "No support requests yet." })); return; }
    tickets.forEach(function (t) {
      var msgs = (data.messages || []).filter(function (m) { return +m.ticket_id === +t.id; });
      var client = admin ? (data.clients.find(function (c) { return +c.id === +t.client_id; }) || {}).name : null;
      var thread = h("ol", { className: "thread" });
      msgs.forEach(function (m) {
        thread.appendChild(h("li", { className: "msg msg-" + (m.author === (admin ? "admin" : "client") ? "mine" : "theirs") },
          h("span", { className: "portal-meta", text: (m.author === "admin" ? "Marzley Tech" : (admin ? client : "You")) + " · " + day(m.created_at) }),
          h("p", { text: m.message })));
      });
      var reply = h("textarea", { rows: "2", maxlength: "4000", placeholder: "Write a reply…", "aria-label": "Reply to " + t.subject });
      var det = h("details", { className: "portal-card ticket", open: t.status === "open" && admin ? true : null },
        h("summary", null, h("strong", { text: t.subject }), h("span", { className: "pill pill-" + (t.status === "open" ? "unpaid" : "paid"), text: t.status === "open" ? "Open" : "Closed" }),
          admin ? h("span", { className: "portal-meta", text: client || "" }) : null),
        thread,
        h("form", { className: "inline-form", onsubmit: function (e) {
          e.preventDefault();
          save("ticket_reply", { ticket_id: t.id, message: reply.value }, e.target);
        } }, reply, h("button", { type: "submit", className: "btn btn-solid btn-sm", text: "Reply" })),
        h("button", { type: "button", className: "linklike", onclick: function () {
          save("ticket_status", { ticket_id: t.id, status: t.status === "open" ? "closed" : "open" });
        }, text: t.status === "open" ? "Mark as solved" : "Reopen" }));
      box.appendChild(det);
    });
  }

  // ---------- referral link ----------
  function renderReferral() {
    var box = $("client-referral");
    box.textContent = "";
    var link = data.me && data.me.referral_link;
    if (!link) return;
    var input = h("input", { type: "text", readonly: true, value: link, "aria-label": "Your referral link" });
    box.appendChild(h("aside", { className: "portal-card referral-card" },
      h("h2", { className: "portal-h2", text: "Refer a friend, earn KSh 2,000" }),
      h("p", { text: "Share your link. When someone you refer becomes a client, you get KSh 2,000 by M-Pesa or off your next invoice." }),
      h("div", { className: "ref-link-row" }, input,
        h("button", { type: "button", className: "btn btn-ghost btn-sm", onclick: function () {
          input.select();
          (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { toast("Link copied."); }, function () { document.execCommand("copy"); toast("Link copied."); });
        }, text: "Copy" })),
      h("a", { className: "btn btn-wa btn-sm", href: "https://wa.me/?text=" + encodeURIComponent("Need a website, online shop or system? I recommend Marzley Tech Solutions: " + link), target: "_blank", rel: "noopener noreferrer" },
        h("i", { className: "fab fa-whatsapp", "aria-hidden": "true" }), " Share on WhatsApp")));
  }

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
    $("sec-courses").hidden = !courses.length;
    $("jump-courses").hidden = !courses.length;
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
  api("me").then(function (d) {
    me = d.user;
    csrf = d.csrf;
    if (me) load();
    else { show("view-signin"); startGoogle(d.google_client_id); }
  }).catch(function (e) {
    show("view-signin");
    $("signin-error").textContent = e.message;
  });
})();
