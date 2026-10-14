<?php $cur = $t['currency']; ?>
<div class="receipt"><div class="card">
  <p class="muted small mb0">PAYMENT RECEIPT</p><h1><?= e($t['receipt_no']) ?> <?= badge($t['status']) ?></h1>
  <dl class="kv">
    <dt>Group</dt><dd><?= e($t['gname']) ?></dd><dt>Member</dt><dd><?= e($t['full_name']) ?> (<?= e($t['member_code']) ?>)</dd>
    <dt>Date</dt><dd><?= e(dt($t['paid_at'], $g['timezone'], 'd M Y, H:i')) ?></dd><dt>Method</dt><dd><?= e(str_replace('_', ' ', $t['method'])) ?></dd>
    <dt>Reference</dt><dd><?= e($t['provider_ref']) ?></dd><dt>Source</dt><dd><?= $t['source'] === 'manual' ? 'Recorded manually by an officer' : 'Confirmed with payment provider' ?></dd>
    <dt>Amount</dt><dd><?= money((int)$t['amount_minor'], $cur) ?></dd>
  </dl>
  <h2 class="mt">How this payment was applied</h2>
  <div class="table-wrap"><table><thead><tr><th>Applied to</th><th class="num">Amount</th></tr></thead><tbody>
  <?php foreach ($alloc as $a): ?><tr><td><?= $a['kind'] === 'credit' ? 'Held as member credit (overpayment)' : e(($a['kind'] === 'penalty' ? 'Late fee' : 'Contribution') . ' due ' . d($a['due_date'], 'D d M Y') . ' — ' . $a['plan_name']) ?><?= $a['reversed_at'] ? ' <span class="badge badge-bad">reversed</span>' : '' ?></td><td class="num"><?= money((int)$a['amount_minor'], $cur) ?></td></tr><?php endforeach; ?>
  <tr class="total"><td>Total</td><td class="num"><?= money((int)$t['amount_minor'], $cur) ?></td></tr></tbody></table></div>
  <div class="btn-row mt no-print"><button class="btn ghost" data-print type="button">Print</button><a class="btn ghost" href="/g/<?= (int)$t['group_id'] ?>/receipts">All receipts</a></div>
</div></div>
