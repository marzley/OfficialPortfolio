<div class="page-head"><h1>Notifications</h1>
  <?php if ($items): ?><form method="post" action="/notifications/read"><?= csrf_field() ?><button class="btn ghost small">Mark all as read</button></form><?php endif; ?></div>
<?php if (!$items): ?><div class="card empty">You're all caught up.</div><?php endif; ?>
<?php foreach ($items as $n): ?>
  <div class="card"><div class="page-head"><strong><?= e($n['title']) ?></strong><span class="muted small"><?= e(dt($n['created_at'])) ?><?= $n['read_at'] ? '' : ' · <span class="badge badge-warn">New</span>' ?></span></div>
  <p><?= e($n['body']) ?></p><?php if ($n['link'] && str_starts_with($n['link'], '/')): ?><a href="<?= e($n['link']) ?>">Open</a><?php endif; ?></div>
<?php endforeach; ?>
