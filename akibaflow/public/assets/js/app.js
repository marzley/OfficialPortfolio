/* AkibaFlow front-end behaviour. No inline scripts (strict CSP). Financial truth always comes from the server. */
(function () {
  'use strict';
  var csrf = (document.querySelector('meta[name="csrf"]') || {}).content || '';

  // Mobile menu
  var menuBtn = document.getElementById('menu-btn'), sidebar = document.getElementById('sidebar'), scrim = document.getElementById('scrim');
  function toggleMenu(open) { if (!sidebar) return; sidebar.classList.toggle('open', open); scrim.classList.toggle('open', open); if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  if (menuBtn) menuBtn.addEventListener('click', function () { toggleMenu(!sidebar.classList.contains('open')); });
  if (scrim) scrim.addEventListener('click', function () { toggleMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });

  // Progress bars (CSP-safe: width set via CSSOM)
  document.querySelectorAll('.progress > span[data-w]').forEach(function (s) { s.style.width = Math.max(0, Math.min(100, +s.dataset.w)) + '%'; });

  // Prevent double submits + confirmation dialogs
  document.addEventListener('submit', function (e) {
    var f = e.target;
    var msg = f.dataset.confirm;
    if (msg && !f.dataset.confirmed) {
      e.preventDefault();
      confirmDialog(msg, function () { f.dataset.confirmed = '1'; f.requestSubmit ? f.requestSubmit() : f.submit(); });
      return;
    }
    if (f.dataset.busy) { e.preventDefault(); return; }
    f.dataset.busy = '1';
    f.querySelectorAll('button[type=submit],input[type=submit]').forEach(function (b) { b.classList.add('is-busy'); b.setAttribute('aria-disabled', 'true'); if (b.dataset.busyText) b.textContent = b.dataset.busyText; });
    setTimeout(function () { delete f.dataset.busy; delete f.dataset.confirmed; f.querySelectorAll('.is-busy').forEach(function (b) { b.classList.remove('is-busy'); b.removeAttribute('aria-disabled'); }); }, 15000);
  }, true);

  function confirmDialog(msg, ok) {
    var back = document.createElement('div'); back.className = 'dialog-backdrop'; back.setAttribute('role', 'dialog'); back.setAttribute('aria-modal', 'true');
    var box = document.createElement('div'); box.className = 'dialog';
    var p = document.createElement('p'); p.textContent = msg;
    var row = document.createElement('div'); row.className = 'btn-row';
    var yes = document.createElement('button'); yes.className = 'btn primary'; yes.textContent = 'Confirm'; yes.type = 'button';
    var no = document.createElement('button'); no.className = 'btn ghost'; no.textContent = 'Cancel'; no.type = 'button';
    row.append(yes, no); box.append(p, row); back.append(box); document.body.append(back); yes.focus();
    function close() { back.remove(); }
    yes.onclick = function () { close(); ok(); }; no.onclick = close;
    back.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function api(url, opts) {
    opts = opts || {}; opts.headers = Object.assign({ 'Accept': 'application/json', 'X-CSRF-Token': csrf }, opts.headers || {}); opts.credentials = 'same-origin';
    return fetch(url, opts).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || ('Request failed (' + r.status + ')')); return j; }); });
  }
  function money(minor, cur) { var neg = minor < 0; minor = Math.abs(minor); var w = Math.floor(minor / 100), c = minor % 100; return (neg ? '-' : '') + (cur === 'KES' ? 'KSh' : cur) + ' ' + w.toLocaleString('en-KE') + (c ? '.' + String(c).padStart(2, '0') : ''); }

  // Live payment status page
  var pay = document.getElementById('pay-status');
  if (pay) {
    var ref = pay.dataset.ref, gid = pay.dataset.gid, box = document.getElementById('pay-status-body'), tries = 0;
    var labels = { pending: ['Waiting for you to approve the M-PESA prompt on your phone…', 'info'], created: ['Starting your payment…', 'info'], succeeded: ['Payment received. Thank you!', 'success'], failed: ['The payment was not completed.', 'error'], unknown: ['We could not confirm this payment yet. If money left your account, the treasurer will reconcile it — you will be notified.', 'warn'] };
    (function poll() {
      api('/api/g/' + gid + '/payments/' + ref).then(function (j) {
        var l = labels[j.status] || labels.unknown;
        box.className = 'alert ' + l[1]; box.textContent = l[0] + (j.result_desc && j.status !== 'succeeded' && j.status !== 'pending' ? ' (' + j.result_desc + ')' : '');
        if (j.status === 'succeeded') { var a = document.getElementById('pay-receipt'); if (a && j.receipt_url) { a.href = j.receipt_url; a.hidden = false; } return; }
        if (j.status === 'pending' || j.status === 'created') { if (++tries < 120) setTimeout(poll, 3000); }
      }).catch(function (e) { box.className = 'alert warn'; box.textContent = 'Could not check status (' + e.message + '). Retrying…'; if (++tries < 120) setTimeout(poll, 5000); });
    })();
  }

  // Contribution calendar
  var cal = document.getElementById('calendar');
  if (cal) {
    var gid2 = cal.dataset.gid, cur = cal.dataset.month, grid = document.getElementById('cal-grid'), title = document.getElementById('cal-title'), detail = document.getElementById('cal-detail');
    function shift(m, n) { var p = m.split('-'), d = new Date(+p[0], +p[1] - 1 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
    function load(m) {
      cur = m; grid.setAttribute('aria-busy', 'true');
      api('/api/g/' + gid2 + '/me/contribution-calendar?month=' + m).then(function (j) {
        title.textContent = j.title; grid.innerHTML = ''; detail.textContent = 'Select a date to see the contribution and payment details.';
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d) { var x = document.createElement('div'); x.className = 'dow'; x.textContent = d; grid.append(x); });
        for (var i = 0; i < j.first_dow - 1; i++) { var b = document.createElement('button'); b.className = 'day blank'; b.disabled = true; b.tabIndex = -1; grid.append(b); }
        for (var day = 1; day <= j.days; day++) {
          var date = m + '-' + String(day).padStart(2, '0'), items = j.items[date] || [], st = items.length ? items[0].status : '';
          var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'day ' + st + (date === j.today ? ' today' : '');
          var n = document.createElement('span'); n.className = 'n'; n.textContent = day; btn.append(n);
          if (items.length) { var t = document.createElement('span'); t.className = 'tag'; t.textContent = items[0].label; btn.append(t); }
          btn.setAttribute('aria-label', date + (items.length ? ': ' + items.map(function (i) { return i.label + ' ' + money(i.original, j.currency); }).join(', ') : ''));
          (function (date, items) { btn.onclick = function () {
            detail.innerHTML = ''; var h = document.createElement('strong'); h.textContent = date; detail.append(h);
            if (!items.length) { var p = document.createElement('p'); p.className = 'muted'; p.textContent = 'No contribution on this date.'; detail.append(p); return; }
            items.forEach(function (it) { var p = document.createElement('p'); p.textContent = it.plan + ' — ' + it.label + ': ' + money(it.original, j.currency) + ', paid ' + money(it.paid, j.currency) + ', outstanding ' + money(it.outstanding, j.currency) + (it.kind === 'penalty' ? ' (late fee)' : ''); detail.append(p); });
          }; })(date, items);
          grid.append(btn);
        }
        grid.removeAttribute('aria-busy');
      }).catch(function (e) { detail.textContent = 'Could not load the calendar: ' + e.message; });
    }
    document.getElementById('cal-prev').onclick = function () { load(shift(cur, -1)); };
    document.getElementById('cal-next').onclick = function () { load(shift(cur, 1)); };
    load(cur);
  }

  // Collections bar chart (data from the server; nothing hard-coded)
  var ch = document.getElementById('collections-chart');
  if (ch) {
    var url = '/api/g/' + ch.dataset.gid + '/charts/collections?by=' + (ch.dataset.by || 'day');
    api(url).then(function (j) {
      if (!j.points.length) { ch.outerHTML = '<p class="empty">No verified collections in this period yet.</p>'; return; }
      var W = 600, H = 220, pad = 28, max = Math.max.apply(null, j.points.map(function (p) { return p.amount; })) || 1, bw = (W - pad * 2) / j.points.length;
      var ns = 'http://www.w3.org/2000/svg', svg = ch; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Verified collections, ' + j.points.length + ' periods, max ' + money(max, j.currency));
      j.points.forEach(function (p, i) {
        var h = Math.max(1, (H - 50) * p.amount / max), r = document.createElementNS(ns, 'rect');
        r.setAttribute('class', 'bar'); r.setAttribute('x', pad + i * bw + 2); r.setAttribute('y', H - 24 - h); r.setAttribute('width', Math.max(2, bw - 4)); r.setAttribute('height', h);
        var t = document.createElementNS(ns, 'title'); t.textContent = p.label + ': ' + money(p.amount, j.currency); r.append(t); svg.append(r);
        if (j.points.length <= 16 || i % Math.ceil(j.points.length / 12) === 0) { var x = document.createElementNS(ns, 'text'); x.setAttribute('x', pad + i * bw + bw / 2); x.setAttribute('y', H - 8); x.setAttribute('text-anchor', 'middle'); x.textContent = p.short; svg.append(x); }
      });
      var m = document.createElementNS(ns, 'text'); m.setAttribute('x', 2); m.setAttribute('y', 12); m.textContent = money(max, j.currency); svg.append(m);
    }).catch(function (e) { ch.outerHTML = '<p class="alert error">Could not load chart: ' + e.message + '</p>'; });
  }

  // Pay form: show chosen amount, reveal custom field
  var payForm = document.getElementById('pay-form');
  if (payForm) {
    var custom = document.getElementById('custom-wrap');
    payForm.addEventListener('change', function () { var v = (payForm.querySelector('input[name=option]:checked') || {}).value; if (custom) custom.hidden = v !== 'custom'; });
  }
})();
document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-print]')) window.print(); });
