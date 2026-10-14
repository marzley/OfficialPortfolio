<?php $gid = (int)$g['group_id']; ?>
<div class="page-head"><h1>Payment status</h1></div>
<div class="card" id="pay-status" data-ref="<?= e($req['ref']) ?>" data-gid="<?= $gid ?>">
  <p>Amount: <strong><?= money((int)$req['amount_minor'], $g['currency']) ?></strong> · Reference <code><?= e($req['ref']) ?></code></p>
  <div id="pay-status-body" class="alert info" role="status" aria-live="polite">Checking…</div>
  <?php if ($sandbox): ?><p class="alert warn">Development mode: open the <a href="/sandbox/phone" target="_blank" rel="noopener">sandbox phone</a> to answer the prompt.</p><?php endif; ?>
  <div class="btn-row"><a class="btn primary" id="pay-receipt" href="#" hidden>View receipt</a><a class="btn ghost" href="/g/<?= $gid ?>">Back to dashboard</a><a class="btn ghost" href="/g/<?= $gid ?>/pay">Try another payment</a></div>
  <noscript><p class="muted">Enable JavaScript to see live status, or refresh this page.</p></noscript>
</div>
