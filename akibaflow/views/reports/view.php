<?php $m = $rep['meta']; $cur = $m['currency']; $tot = \Akiba\Services\ReportService::totals($rep); $sep = str_contains($base, '?') ? '&' : '?'; ?>
<div class="page-head"><div><h1><?= e($m['title']) ?></h1><p class="muted mb0"><?= e($m['group']) ?> · <?= e($cur) ?><?= $m['from'] || $m['to'] ? ' · ' . e(($m['from'] ?? '…') . ' to ' . ($m['to'] ?? '…')) : '' ?></p></div>
  <div class="btn-row no-print"><a class="btn ghost small" href="<?= e($base . $sep . http_build_query(['from' => $from ?? '', 'to' => $to ?? '', 'format' => 'csv'] + ($extra ?? []))) ?>">Download CSV</a><button class="btn ghost small" type="button" data-print>Print / save PDF</button></div></div>
<?php if (!empty($hasDates)): ?>
<form class="card mini-form no-print" method="get" action="<?= e(strtok($base, '?')) ?>">
  <?php if (preg_match('/member=(\d+)/', $base, $mm)): ?><input type="hidden" name="member" value="<?= (int)$mm[1] ?>"><?php endif; ?>
  <?php foreach (($extra ?? []) as $k => $v): ?><input type="hidden" name="<?= e($k) ?>" value="<?= e($v) ?>"><?php endforeach; ?>
  <div class="field"><label for="from">From</label><input id="from" type="date" name="from" value="<?= e($from) ?>"></div>
  <div class="field"><label for="to">To</label><input id="to" type="date" name="to" value="<?= e($to) ?>"></div><button class="btn" type="submit">Apply</button></form>
<?php endif; ?>
<div class="alert info"><strong>What these numbers mean:</strong> <?= e($m['basis']) ?></div>
<div class="card">
<?php if (!$rep['rows']): ?><p class="empty">No records for this report and period.</p><?php else: ?>
<div class="table-wrap"><table><thead><tr><?php foreach ($rep['columns'] as $i => $c): ?><th class="<?= in_array($i, $rep['money_cols'], true) ? 'num' : '' ?>"><?= e($c) ?></th><?php endforeach; ?></tr></thead><tbody>
<?php foreach ($rep['rows'] as $r): ?><tr><?php foreach ($r as $i => $v): ?><td class="<?= in_array($i, $rep['money_cols'], true) ? 'num' : '' ?>"><?= in_array($i, $rep['money_cols'], true) && is_int($v) ? e(money($v, $cur)) : e($v) ?></td><?php endforeach; ?></tr><?php endforeach; ?>
<?php if ($tot): ?><tr class="total"><?php foreach ($rep['columns'] as $i => $c): ?><td class="<?= in_array($i, $rep['money_cols'], true) ? 'num' : '' ?>"><?= $i === 0 ? 'Total' : (isset($tot[$i]) ? (in_array($i, $rep['money_cols'], true) ? e(money((int)$tot[$i], $cur)) : e($tot[$i])) : '') ?></td><?php endforeach; ?></tr><?php endif; ?>
</tbody></table></div><?php endif; ?></div>
<p class="muted small">Generated <?= e($m['generated_at']) ?></p>
