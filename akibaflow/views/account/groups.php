<div class="page-head"><h1>My groups</h1><a class="btn primary" href="/groups/new">+ Create a group</a></div>
<?php if (!$groups): ?>
  <div class="card empty"><p><strong>You are not in any group yet.</strong></p><p>Create a group for your chama, welfare, SACCO-style savings circle or project — or ask your chairperson to invite you.</p><a class="btn primary" href="/groups/new">Create a group</a></div>
<?php endif; ?>
<div class="grid cols-2">
<?php foreach ($groups as $gr): ?>
  <div class="card">
    <h2><a href="/g/<?= (int)$gr['group_id'] ?>"><?= e($gr['name']) ?></a></h2>
    <p class="muted small"><?= e(roleLabel($gr['role'])) ?> · <?= e($gr['currency']) ?> · <?= badge($gr['status'] === 'active' ? $gr['group_status'] : $gr['status']) ?></p>
    <?php if ($gr['status'] === 'active'): ?>
      <p>Outstanding: <strong class="<?= $gr['outstanding'] > 0 ? '' : 'muted' ?>"><?= money((int)$gr['outstanding'], $gr['currency']) ?></strong></p>
      <div class="btn-row"><a class="btn small" href="/g/<?= (int)$gr['group_id'] ?>">Open</a><?php if ($gr['outstanding'] > 0): ?><a class="btn small primary" href="/g/<?= (int)$gr['group_id'] ?>/pay">Pay now</a><?php endif; ?></div>
    <?php else: ?><p class="muted">Awaiting approval from the group administrators.</p><?php endif; ?>
  </div>
<?php endforeach; ?>
</div>
