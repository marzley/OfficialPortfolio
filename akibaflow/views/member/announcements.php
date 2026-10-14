<?php $gid = (int)$g['group_id']; ?>
<div class="page-head"><h1>Announcements</h1></div>
<?php if (\Akiba\Core\Permissions::can($g['role'], 'announce.create')): ?>
<form class="card" method="post" action="/g/<?= $gid ?>/announcements"><?= csrf_field() ?><h2>New announcement</h2>
  <div class="field"><label for="at">Title</label><input id="at" name="title" required maxlength="190"></div>
  <div class="field"><label for="ab">Message</label><textarea id="ab" name="body" required></textarea></div>
  <button class="btn primary" type="submit">Post &amp; notify members</button></form>
<?php endif; ?>
<?php if (!$rows): ?><div class="card empty">No announcements yet.</div><?php endif; ?>
<?php foreach ($rows as $a): ?><div class="card"><h2><?= e($a['title']) ?></h2><p><?= nl2br(e($a['body'])) ?></p><p class="muted small mb0"><?= e($a['full_name']) ?> · <?= e(dt($a['created_at'], $g['timezone'])) ?></p></div><?php endforeach; ?>
