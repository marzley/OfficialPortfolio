<?php $cur = $g['currency']; $gid = (int)$g['group_id']; ?>
<div class="page-head"><h1>Contribution history</h1><a class="btn ghost small" href="/g/<?= $gid ?>/statement">Download statement</a></div>
<form class="card mini-form" method="get">
  <div class="field"><label for="plan">Plan</label><select id="plan" name="plan"><option value="">All plans</option><?php foreach ($plans as $p): ?><option value="<?= (int)$p['id'] ?>" <?= (int)$f['plan_id'] === (int)$p['id'] ? 'selected' : '' ?>><?= e($p['name']) ?></option><?php endforeach; ?></select></div>
  <div class="field"><label for="status">Status</label><select id="status" name="status"><option value="">Any</option><?php foreach (['upcoming', 'due', 'partially_paid', 'overdue', 'paid', 'waived'] as $s): ?><option value="<?= $s ?>" <?= $f['status'] === $s ? 'selected' : '' ?>><?= e(status_label($s)) ?></option><?php endforeach; ?></select></div>
  <div class="field"><label for="from">From</label><input id="from" type="date" name="from" value="<?= e($f['from']) ?>"></div>
  <div class="field"><label for="to">To</label><input id="to" type="date" name="to" value="<?= e($f['to']) ?>"></div>
  <button class="btn" type="submit">Filter</button>
</form>
<div class="card">
<?php if (!$rows): ?><p class="empty">No contributions match these filters yet.</p><?php else: ?>
<div class="table-wrap"><table><thead><tr><th>Period / due</th><th>Plan</th><th class="num">Amount</th><th class="num">Paid</th><th class="num">Outstanding</th><th>Last payment</th><th>Receipt</th><th>Status</th></tr></thead><tbody>
<?php foreach ($rows as $r): ?><tr>
  <td class="nowrap"><?= e(d($r['due_date'], 'D d M Y')) ?></td><td><?= e($r['plan_name']) ?><?= $r['kind'] === 'penalty' ? ' <span class="badge badge-warn">Late fee</span>' : '' ?></td>
  <td class="num"><?= money((int)$r['original_minor'] - (int)$r['waived_minor'], $cur) ?></td><td class="num"><?= money((int)$r['paid_minor'], $cur) ?></td>
  <td class="num"><?= $r['status'] === 'open' ? money((int)$r['outstanding_minor'], $cur) : '—' ?></td>
  <td class="nowrap"><?= $r['last_paid_at'] ? e(dt($r['last_paid_at'], $g['timezone'], 'd M Y')) : '—' ?></td><td><?= e($r['receipts'] ?? '—') ?></td><td><?= badge($r['display_status']) ?></td></tr><?php endforeach; ?>
</tbody></table></div>
<div class="btn-row mt"><?php $qs = $_GET; ?>
  <?php if ($page > 1): $qs['page'] = $page - 1; ?><a class="btn ghost small" href="?<?= e(http_build_query($qs)) ?>">← Newer</a><?php endif; ?>
  <?php if ($more): $qs['page'] = $page + 1; ?><a class="btn ghost small" href="?<?= e(http_build_query($qs)) ?>">Older →</a><?php endif; ?></div>
<?php endif; ?></div>
