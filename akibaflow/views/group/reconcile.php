<?php $cur = $g['currency']; $gid = (int)$g['group_id']; $act = \Akiba\Core\Permissions::can($g['role'], 'payments.record_manual'); $bad = $rec['funds_ledger'] !== $rec['funds_expected'] || $rec['paid_mismatch'] || $rec['ledger_unbalanced']; ?>
<div class="page-head"><h1>Reconciliation</h1></div>
<div class="alert <?= $bad ? 'error' : 'success' ?>" role="status"><strong>Integrity check:</strong> ledger funds <?= money($rec['funds_ledger'], $cur) ?> vs. posted payments − paid expenses <?= money($rec['funds_expected'], $cur) ?>
  <?= $bad ? ' — MISMATCH, investigate before paying out funds.' : ' — consistent.' ?>
  <?php if ($rec['paid_mismatch']): ?><br><?= count($rec['paid_mismatch']) ?> obligation(s) whose paid amount does not match their allocations.<?php endif; ?>
  <?php if ($rec['ledger_unbalanced']): ?><br><?= count($rec['ledger_unbalanced']) ?> unbalanced journal(s).<?php endif; ?></div>

<div class="card"><h2>Payments needing attention <span class="badge badge-warn"><?= count($rec['unresolved']) ?></span></h2>
<p class="muted small">Requests with no final answer, amount mismatches, or provider confirmations without a receipt. <strong>Nothing here has been credited.</strong> Match each to your M-PESA statement and record the receipt.</p>
<?php if (!$rec['unresolved']): ?><p class="empty">Nothing waiting. ✓</p><?php endif; ?>
<?php foreach ($rec['unresolved'] as $r): ?><div class="card"><p><strong><?= e($r['full_name']) ?></strong> (<?= e($r['member_code']) ?>) · requested <?= money((int)$r['amount_minor'], $cur) ?> · <?= e(dt($r['created_at'], $g['timezone'])) ?> · ref <code><?= e($r['ref']) ?></code> <?= badge($r['status']) ?></p>
  <p class="small muted"><?= e($r['result_code'] ?? '') ?> <?= e($r['result_desc'] ?? '') ?></p>
  <?php if ($act): ?><div class="btn-row"><form method="post" action="/g/<?= $gid ?>/reconcile/check/<?= (int)$r['id'] ?>"><?= csrf_field() ?><button class="btn small ghost">Ask provider for status</button></form></div>
  <form class="mini-form mt-s" method="post" action="/g/<?= $gid ?>/reconcile/resolve/<?= (int)$r['id'] ?>" data-confirm="Credit this payment to the member? Use only when the M-PESA statement shows the money was received."><?= csrf_field() ?>
    <div class="field"><label for="rc<?= (int)$r['id'] ?>">M-PESA receipt code</label><input id="rc<?= (int)$r['id'] ?>" name="reference" required></div>
    <div class="field"><label for="ra<?= (int)$r['id'] ?>">Amount received (<?= e($cur) ?>)</label><input id="ra<?= (int)$r['id'] ?>" name="amount" inputmode="decimal" required value="<?= e(\Akiba\Core\Money::dec((int)$r['amount_minor'])) ?>"></div><button class="btn small primary">Reconcile &amp; credit</button></form><?php endif; ?></div><?php endforeach; ?></div>

<div class="card"><h2>Paybill payments awaiting review <span class="badge badge-warn"><?= count($rec['c2b_pending']) ?></span></h2>
<?php if (!$rec['c2b_pending']): ?><p class="empty">None.</p><?php endif; ?>
<?php foreach ($rec['c2b_pending'] as $ev): $p = json_decode($ev['payload'], true) ?: []; ?><div class="mini-form"><p class="mb0"><code><?= e($ev['event_key']) ?></code> · KSh <?= e($p['TransAmount'] ?? '?') ?> · account <code><?= e($p['BillRefNumber'] ?? '') ?></code> · <?= e(dt($ev['received_at'], $g['timezone'])) ?></p>
  <?php if ($act): ?><form method="post" action="/g/<?= $gid ?>/reconcile/c2b/<?= (int)$ev['id'] ?>" data-confirm="Accept this Paybill payment and apply it to the member's dues?"><?= csrf_field() ?><button class="btn small primary">Accept &amp; allocate</button></form><?php endif; ?></div><?php endforeach; ?></div>

<div class="grid cols-2">
<div class="card"><h2>Failed payments (30 days)</h2><?php if (!$rec['failed']): ?><p class="empty">None.</p><?php endif; ?>
<?php foreach ($rec['failed'] as $r): ?><p class="mb0"><?= e($r['full_name']) ?> · <?= money((int)$r['amount_minor'], $cur) ?> · <?= e(dt($r['created_at'], $g['timezone'], 'd M H:i')) ?> · <span class="muted small"><?= e($r['result_desc'] ?? '') ?></span></p><?php endforeach; ?></div>
<div class="card"><h2>Duplicate callbacks ignored</h2><?php if (!$rec['duplicates']): ?><p class="empty">None.</p><?php endif; ?>
<?php foreach ($rec['duplicates'] as $d): ?><p class="mb0"><code><?= e($d['event_key']) ?></code> · received again <?= (int)$d['duplicate_count'] ?>× · no extra money recorded</p><?php endforeach; ?></div></div>
