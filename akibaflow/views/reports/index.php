<?php $gid = (int)$g['group_id']; ?>
<div class="page-head"><h1>Reports</h1></div>
<p class="muted">Every report states its basis (expected vs. received vs. owed), currency and period, and can be downloaded as CSV or printed to PDF. Exports are recorded in the audit trail.</p>
<div class="grid cols-2">
<?php foreach ([['collections', 'Collections', 'Daily / weekly / monthly verified money received.'], ['arrears', 'Outstanding contributions', 'Who owes what, and since when.'], ['members', 'Member contribution summary', 'Expected, paid and outstanding per member.'],
  ['income-expenditure', 'Income & expenditure', 'Cash-basis statement from the ledger.'], ['cash-movement', 'Cash movement', 'Every movement of group funds with running balance.'], ['expenses', 'Expenses', 'Proposed, approved and paid expenses.'], ['transactions', 'Payment transactions', 'Every payment with source and status.']] as [$k, $t, $dsc]): ?>
  <div class="card"><h2><a href="/g/<?= $gid ?>/reports/<?= $k ?>"><?= e($t) ?></a></h2><p class="muted"><?= e($dsc) ?></p><a class="btn small ghost" href="/g/<?= $gid ?>/reports/<?= $k ?>">Open</a></div>
<?php endforeach; ?></div>
<p class="muted small mt">Excel: open the CSV in Excel. Native .xlsx and server-generated PDF are not implemented; use "Print / save PDF" in your browser.</p>
