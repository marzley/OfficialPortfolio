<?php $gid = (int)$g['group_id']; $cur = $g['currency']; $mgr = \Akiba\Core\Permissions::can($g['role'], 'goals.manage'); ?>
<div class="page-head"><h1>Savings goals</h1></div>
<?php if (!$goals): ?><div class="card empty">No savings goals yet.</div><?php endif; ?>
<div class="grid cols-2">
<?php foreach ($goals as $s): $pct = min(100, (int)floor(100 * $s['progress'] / max(1, $s['target_minor']))); ?>
  <div class="card"><h2><?= e($s['name']) ?> <?= badge($s['status']) ?></h2>
    <p class="muted"><?= e($s['description'] ?? '') ?></p>
    <p><strong><?= money($s['progress'], $cur) ?></strong> of <?= money((int)$s['target_minor'], $cur) ?> <?= $s['target_date'] ? '· by ' . e(d($s['target_date'], 'd M Y')) : '' ?></p>
    <div class="progress" role="progressbar" aria-valuenow="<?= $pct ?>" aria-valuemin="0" aria-valuemax="100" aria-label="<?= e($s['name']) ?> progress"><span data-w="<?= $pct ?>"></span></div>
    <p class="small muted mt-s"><?= $s['plan_id'] ? 'Progress counts verified payments allocated to the linked plan.' : 'Progress counts amounts the treasurer has earmarked from group funds.' ?></p>
    <?php if ($mgr && !$s['plan_id'] && $s['status'] === 'active'): ?>
    <form class="mini-form" method="post" action="/g/<?= $gid ?>/goals/<?= (int)$s['id'] ?>/allocate"><?= csrf_field() ?>
      <div class="field"><label for="amt<?= (int)$s['id'] ?>">Earmark amount</label><input id="amt<?= (int)$s['id'] ?>" name="amount" inputmode="decimal" required></div><button class="btn small" type="submit">Allocate</button></form><?php endif; ?>
  </div>
<?php endforeach; ?>
</div>
<?php if ($mgr): ?>
<form class="card" method="post" action="/g/<?= $gid ?>/goals"><?= csrf_field() ?><h2>New goal</h2>
  <div class="form-grid">
    <div class="field"><label for="gn">Name</label><input id="gn" name="name" required></div>
    <div class="field"><label for="gt">Target amount (<?= e($cur) ?>)</label><input id="gt" name="target" inputmode="decimal" required></div>
    <div class="field"><label for="gd">Target date</label><input id="gd" type="date" name="target_date"></div>
    <div class="field"><label for="gp">Linked plan (optional)</label><select id="gp" name="plan_id"><option value="">None — earmark manually</option><?php foreach ($plans as $p): ?><option value="<?= (int)$p['id'] ?>"><?= e($p['name']) ?></option><?php endforeach; ?></select></div>
  </div>
  <div class="field"><label for="gdesc">Description</label><input id="gdesc" name="description"></div>
  <button class="btn primary" type="submit">Create goal</button>
</form>
<?php endif; ?>
