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
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
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
    $("portal-user").hidden = !me;
    if (me) $("portal-name").textContent = me.name || me.email;
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
      var action = null;
      if (!admin && inv.status === "unpaid") action = h("button", { type: "button", className: "btn btn-mpesa btn-sm", onclick: function () { payInvoice(inv); }, text: "Pay with M-Pesa" });
      if (admin) action = h("span", { className: "row-actions" },
        h("button", { type: "button", className: "linklike", onclick: function () { editInvoice(inv); }, text: "Edit" }),
        h("button", { type: "button", className: "linklike danger", onclick: function () { remove("invoice", inv.id); }, text: "Delete" }));
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
    renderAdminProjects();
    renderAdminClients();
    renderAdminInvoices();
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
        h("button", { type: "button", className: "linklike", onclick: function () { renderAdminClients(c); name.focus(); }, text: "Edit" })));
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

  function selectTab(name) {
    ["projects", "clients", "invoices"].forEach(function (t) {
      $("tab-" + t).setAttribute("aria-selected", String(t === name));
      $("panel-" + t).hidden = t !== name;
    });
  }
  ["projects", "clients", "invoices"].forEach(function (t) {
    $("tab-" + t).addEventListener("click", function () { selectTab(t); });
  });

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
