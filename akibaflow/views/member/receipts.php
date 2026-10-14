<?php $gid = (int)$g['group_id']; ?>
<div class="page-head"><h1>Receipts</h1><a class="btn ghost small" href="/g/<?= $gid ?>/statement">Download statement</a></div>
<div class="card">
<?php if (!$rows): ?><p class="empty">No payments recorded yet.</p><?php else: ?>
<div class="table-wrap"><table><thead><tr><th>Receipt</th><th>Date</th><th>Method</th><th class="num">Amount</th><th>Status</th></tr></thead><tbody>
<?php foreach ($rows as $t): ?><tr><td><a href="/g/<?= $gid ?>/receipts/<?= (int)$t['id'] ?>"><?= e($t['receipt_no']) ?></a></td><td class="nowrap"><?= e(dt($t['paid_at'], $g['timezone'])) ?></td><td><?= e(str_replace('_', ' ', $t['method'])) ?></td><td class="num"><?= money((int)$t['amount_minor'], $t['currency']) ?></td><td><?= badge($t['status']) ?></td></tr><?php endforeach; ?>
</tbody></table></div><?php endif; ?></div>
