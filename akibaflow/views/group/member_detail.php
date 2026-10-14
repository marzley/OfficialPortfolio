<?php $cur = $g['currency']; $gid = (int)$g['group_id']; ?>
<div class="page-head"><div><h1><?= e($u['full_name']) ?></h1><p class="muted mb0"><?= e($t['member_code']) ?> · <?= e(roleLabel($t['role'])) ?> · <?= e($u['phone'] ?? $u['email']) ?></p></div>
  <div class="btn-row"><a class="btn ghost small" href="/g/<?= $gid ?>/statement?member=<?= (int)$t['id'] ?>">Statement</a><a class="btn ghost small" href="/g/<?= $gid ?>/arrears?member=<?= (int)$t['id'] ?>">Manage dues</a></div></div>
<div class="stats">
  <div class="stat good"><div class="label">Paid</div><div class="value"><?= money($bal['total_paid'], $cur) ?></div></div>
  <div class="stat gold"><div class="label">Outstanding</div><div class="value"><?= money($bal['outstanding_total'], $cur) ?></div></div>
  <div class="stat <?= $bal['overdue_minor'] ? 'bad' : '' ?>"><div class="label">Overdue</div><div class="value"><?= money($bal['overdue_minor'], $cur) ?></div><div class="hint"><?= $bal['overdue_count'] ?> items</div></div>
  <div class="stat"><div class="label">Credit held</div><div class="value"><?= money($bal['credit'], $cur) ?></div></div>
</div>
<div class="grid cols-2"><div class="card"><h2>Obligations</h2><div class="table-wrap"><table><thead><tr><th>Due</th><th>Plan</th><th class="num">Amount</th><th class="num">Paid</th><th>Status</th></tr></thead><tbody>
<?php foreach ($rows as $r): ?><tr><td class="nowrap"><?= e(d($r['due_date'], 'd M Y')) ?></td><td><?= e($r['plan_name']) ?></td><td class="num"><?= money((int)$r['original_minor'], $cur) ?></td><td class="num"><?= money((int)$r['paid_minor'], $cur) ?></td><td><?= badge($r['display_status']) ?></td></tr><?php endforeach; ?></tbody></table></div></div>
<div class="card"><h2>Payments</h2><?php if (!$pays): ?><p class="muted">None yet.</p><?php endif; ?><?php foreach ($pays as $p): ?><p class="mb0"><a href="/g/<?= $gid ?>/receipts/<?= (int)$p['id'] ?>"><?= e($p['receipt_no']) ?></a> · <?= money((int)$p['amount_minor'], $cur) ?> · <?= e(dt($p['paid_at'], $g['timezone'], 'd M Y')) ?> <?= badge($p['status']) ?></p><?php endforeach; ?></div></div>
