<?php $cur = $g['currency']; $gid = (int)$g['group_id']; $can = fn($p) => \Akiba\Core\Permissions::can($g['role'], $p); ?>
<div class="page-head"><h1>Expenses</h1><span class="muted">Available funds: <strong><?= money($funds, $cur) ?></strong></span></div>
<div class="card"><?php if (!$rows): ?><p class="empty">No expenses recorded.</p><?php else: ?>
<div class="table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Payee</th><th class="num">Amount</th><th>Approvals</th><th>Status</th><th>Actions</th></tr></thead><tbody>
<?php foreach ($rows as $x): ?><tr><td class="nowrap"><?= e(d($x['expense_date'], 'd M Y')) ?></td><td><?= e($x['description']) ?><br><span class="muted small"><?= e($x['category']) ?> · by <?= e($x['requester']) ?></span></td><td><?= e($x['payee']) ?></td><td class="num"><?= money((int)$x['amount_minor'], $cur) ?></td>
  <td><?= (int)$x['approvals'] ?>/<?= (int)$x['required_approvals'] ?></td><td><?= badge($x['status']) ?></td>
  <td><div class="btn-row">
  <?php if ($x['status'] === 'proposed' && $can('expenses.approve') && (int)$x['requested_by'] !== (int)$g['user_id'] && !(int)$x['mine']): foreach (['approve' => ['primary', 'Approve'], 'reject' => ['ghost', 'Reject']] as $dec => [$cls, $l]): ?>
    <form method="post" action="/g/<?= $gid ?>/expenses/<?= (int)$x['id'] ?>/decide" data-confirm="<?= $l ?> this expense?"><?= csrf_field() ?><input type="hidden" name="decision" value="<?= $dec ?>"><button class="btn small <?= $cls ?>"><?= $l ?></button></form><?php endforeach; endif; ?>
  <?php if ($x['status'] === 'approved' && $can('expenses.pay')): ?><form method="post" action="/g/<?= $gid ?>/expenses/<?= (int)$x['id'] ?>/pay" data-confirm="Mark as paid? This reduces group funds by <?= e(money((int)$x['amount_minor'], $cur)) ?>."><?= csrf_field() ?><input type="hidden" name="method" value="<?= e($x['payment_method'] ?? '') ?>"><input type="hidden" name="reference" value="<?= e($x['reference'] ?? '') ?>"><button class="btn small primary">Mark paid</button></form><?php endif; ?>
  <?php if ($x['status'] === 'paid' && $can('expenses.pay')): ?><form class="mini-form" method="post" action="/g/<?= $gid ?>/expenses/<?= (int)$x['id'] ?>/reverse" data-confirm="Reverse this expense? Funds are restored by a compensating ledger entry."><?= csrf_field() ?><div class="field"><label class="sr-only" for="er<?= (int)$x['id'] ?>">Reason</label><input id="er<?= (int)$x['id'] ?>" name="reason" placeholder="Reason" required></div><button class="btn small ghost">Reverse</button></form><?php endif; ?>
  </div></td></tr><?php endforeach; ?></tbody></table></div><?php endif; ?></div>
<?php if ($can('expenses.create')): ?>
<form class="card" method="post" action="/g/<?= $gid ?>/expenses"><?= csrf_field() ?><h2>Propose an expense</h2>
  <p class="muted small">A proposed expense is <strong>not</strong> spending until it is approved and then paid.</p>
  <div class="form-grid">
    <div class="field"><label for="xc">Category</label><select id="xc" name="category"><?php foreach ($cats as $c): ?><option><?= e($c) ?></option><?php endforeach; ?></select></div>
    <div class="field"><label for="xa">Amount (<?= e($cur) ?>)</label><input id="xa" name="amount" inputmode="decimal" required></div>
    <div class="field"><label for="xd">Date</label><input id="xd" type="date" name="expense_date" value="<?= date('Y-m-d') ?>" required></div>
    <div class="field"><label for="xp">Payee</label><input id="xp" name="payee" required></div>
    <div class="field"><label for="xm">Payment method</label><select id="xm" name="payment_method"><option value="">—</option><option value="mpesa">M-PESA</option><option value="bank">Bank</option><option value="cash">Cash</option></select></div>
    <div class="field"><label for="xr">Reference</label><input id="xr" name="reference"></div></div>
  <div class="field"><label for="xs">Description</label><input id="xs" name="description" required></div>
  <button class="btn primary" type="submit">Submit for approval</button></form>
<?php endif; ?>
