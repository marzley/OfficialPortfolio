<div class="page-head"><h1>Jobs &amp; failures</h1></div>
<div class="card"><h2>Failed notifications <span class="badge badge-bad"><?= count($failed) ?></span></h2><p class="muted small"><?= $skipped ?> notification(s) were skipped because a channel (e.g. SMS) is not configured.</p>
<?php if (!$failed): ?><p class="empty">No failed notifications.</p><?php endif; ?>
<?php foreach ($failed as $j): ?><div class="mini-form"><p class="mb0"><?= e($j['channel']) ?> → <?= e($j['email']) ?> · <?= e($j['subject']) ?> · <span class="muted small"><?= e($j['last_error']) ?> (<?= (int)$j['attempts'] ?> attempts)</span></p>
 <form method="post" action="/admin/jobs/<?= (int)$j['id'] ?>/retry"><?= csrf_field() ?><button class="btn small ghost">Retry</button></form></div><?php endforeach; ?></div>
<div class="card"><h2>Scheduled job runs</h2><div class="table-wrap"><table><thead><tr><th>Job</th><th>Status</th><th>Result</th><th>Finished (UTC)</th></tr></thead><tbody>
<?php foreach ($jobs as $j): ?><tr><td><code><?= e($j['job']) ?></code></td><td><?= badge($j['status'] === 'ok' ? 'succeeded' : 'failed') ?></td><td class="small"><?= e($j['message']) ?></td><td class="nowrap"><?= e($j['finished_at']) ?></td></tr><?php endforeach; ?>
<?php if (!$jobs): ?><tr><td colspan="4" class="empty">The worker has not run yet. Schedule <code>php bin/worker.php</code> every minute.</td></tr><?php endif; ?></tbody></table></div></div>
