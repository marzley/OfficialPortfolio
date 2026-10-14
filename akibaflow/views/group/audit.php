<div class="page-head"><h1>Audit trail</h1></div>
<p class="muted">Append-only record of sensitive actions. Entries cannot be edited or deleted.</p>
<div class="card"><?php if (!$rows): ?><p class="empty">No activity recorded yet.</p><?php else: ?>
<div class="table-wrap"><table><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Details</th></tr></thead><tbody>
<?php foreach ($rows as $r): ?><tr><td class="nowrap"><?= e(dt($r['created_at'], $g['timezone'], 'd M Y H:i')) ?></td><td><?= e($r['full_name'] ?? 'System') ?></td><td><code><?= e($r['action']) ?></code></td><td class="small"><?= e(mb_substr((string)$r['details'], 0, 300)) ?></td></tr><?php endforeach; ?></tbody></table></div>
<div class="btn-row mt"><?php if ($page > 1): ?><a class="btn ghost small" href="?page=<?= $page - 1 ?>">← Newer</a><?php endif; ?><?php if ($more): ?><a class="btn ghost small" href="?page=<?= $page + 1 ?>">Older →</a><?php endif; ?></div><?php endif; ?></div>
