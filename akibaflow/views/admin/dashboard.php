<div class="page-head"><h1>Platform overview</h1></div>
<div class="stats"><?php foreach ($stats as $l => $v): ?><div class="stat"><div class="label"><?= e($l) ?></div><div class="value"><?= (int)$v ?></div></div><?php endforeach; ?></div>
<div class="card"><h2>System health</h2><?php foreach ($health as [$name, $ok, $detail]): ?><p><?= badge($ok ? 'paid' : 'overdue') ?> <strong><?= e($name) ?></strong> — <?= e($detail) ?></p><?php endforeach; ?></div>
<p class="muted small">Group financial records are not shown here. Platform administrators see counts and health only.</p>
