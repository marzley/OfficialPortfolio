<?php /** @var array $g */ $cur = $g['currency']; $gid = (int)$g['group_id']; ?>
<div class="page-head"><div><h1>Hello, <?= e(explode(' ', $user['full_name'])[0]) ?></h1><p class="muted mb0"><?= e($g['group_name']) ?> · <?= e(d($today)) ?></p></div></div>

<?php if ($pending): ?>
  <div class="alert info" role="status"><?= $pending['status'] === 'unknown' ? 'A recent payment of ' . money((int)$pending['amount_minor'], $cur) . ' could not be confirmed yet. If money left your account, the treasurer will reconcile it.' : 'You have a payment of ' . money((int)$pending['amount_minor'], $cur) . ' awaiting confirmation.' ?>
    <a href="/g/<?= $gid ?>/pay/<?= e($pending['ref']) ?>">View status</a></div>
<?php elseif ($lastReq && $lastReq['status'] === 'failed' && strtotime($lastReq['created_at']) > time() - 86400): ?>
  <div class="alert warn" role="status">Your last payment attempt (<?= money((int)$lastReq['amount_minor'], $cur) ?>) was not completed<?= $lastReq['result_desc'] ? ': ' . e($lastReq['result_desc']) : '' ?>. Nothing was recorded as paid.</div>
<?php elseif ($lastReq && $lastReq['status'] === 'succeeded' && strtotime($lastReq['created_at']) > time() - 86400): ?>
  <div class="alert success" role="status">Your last payment of <?= money((int)$lastReq['amount_minor'], $cur) ?> was received.</div>
<?php endif; ?>

<?php if ($bal['outstanding_total'] > 0): ?>
<section class="hero-pay" aria-label="Amount you owe">
  <p class="sub mb0">Total outstanding</p>
  <div class="row"><div class="big"><?= money($bal['outstanding_total'], $cur) ?></div>
    <div class="btn-row"><a class="btn gold" href="/g/<?= $gid ?>/pay">CONTRIBUTE NOW</a></div></div>
  <p class="sub mt-s mb0"><?= $bal['unpaid_count'] ?> unpaid contribution<?= $bal['unpaid_count'] === 1 ? '' : 's' ?><?= $bal['oldest_unpaid'] ? ' · oldest due ' . e(d($bal['oldest_unpaid'], 'D d M')) : '' ?><?= $bal['outstanding_penalty'] > 0 ? ' · includes late fees ' . money($bal['outstanding_penalty'], $cur) : '' ?></p>
</section>
<?php else: ?>
<section class="hero-pay clear" aria-label="You are up to date">
  <div class="row"><div><div class="big">You're all paid up ✓</div><p class="sub mb0">No outstanding contributions<?= $next ? ' · next contribution ' . e(d($next, 'D d M')) : '' ?></p></div>
    <div class="btn-row"><a class="btn gold" href="/g/<?= $gid ?>/pay">CONTRIBUTE NOW</a></div></div>
</section>
<?php endif; ?>

<div class="stats">
  <div class="stat good"><div class="label">Total contributions paid</div><div class="value"><?= money($bal['total_paid'], $cur) ?></div><div class="hint">Verified payments only</div></div>
  <div class="stat"><div class="label">Due today</div><div class="value"><?= money($bal['due_today'], $cur) ?></div></div>
  <div class="stat <?= $bal['outstanding_total'] ? 'gold' : '' ?>"><div class="label">Total outstanding</div><div class="value"><?= money($bal['outstanding_total'], $cur) ?></div></div>
  <div class="stat <?= $bal['overdue_minor'] ? 'bad' : '' ?>"><div class="label">Overdue amount</div><div class="value"><?= money($bal['overdue_minor'], $cur) ?></div><div class="hint"><?= $bal['overdue_count'] ?> overdue</div></div>
  <div class="stat"><div class="label">Next contribution</div><div class="value"><?= $next ? e(d($next, 'D d M')) : '—' ?></div></div>
  <div class="stat"><div class="label">Completion rate</div><div class="value"><?= $bal['completion_rate'] === null ? '—' : $bal['completion_rate'] . '%' ?></div>
    <?php if ($bal['completion_rate'] !== null): ?><div class="progress"><span data-w="<?= (int)$bal['completion_rate'] ?>"></span></div><?php endif; ?></div>
  <div class="stat"><div class="label">Member credit</div><div class="value"><?= money($bal['credit'], $cur) ?></div>
    <?php if ($bal['credit'] > 0 && $bal['outstanding_contrib'] > 0): ?><form method="post" action="/g/<?= $gid ?>/credit/apply"><?= csrf_field() ?><button class="btn small ghost" type="submit">Apply to my dues</button></form><?php else: ?><div class="hint">Held overpayments</div><?php endif; ?></div>
  <div class="stat"><div class="label">Overdue items</div><div class="value"><?= $bal['overdue_count'] ?></div></div>
</div>

<div class="btn-row mb0">
  <a class="btn primary" href="/g/<?= $gid ?>/pay">Contribute now</a>
  <a class="btn ghost" href="/g/<?= $gid ?>/history">Contribution history</a>
  <a class="btn ghost" href="/g/<?= $gid ?>/calendar">Calendar</a>
  <a class="btn ghost" href="/g/<?= $gid ?>/receipts">Receipts</a>
  <a class="btn ghost" href="/g/<?= $gid ?>/statement">Statement</a>
  <?php if ($contact['contact_email'] || $contact['contact_phone']): ?><a class="btn ghost" href="<?= $contact['contact_email'] ? 'mailto:' . e($contact['contact_email']) : 'tel:' . e($contact['contact_phone']) ?>">Contact administrator</a><?php endif; ?>
</div>

<div class="grid cols-2 mt">
  <div class="card"><h2>What I owe</h2>
    <?php if (!$open): ?><p class="empty">Nothing outstanding. 🎉</p><?php else: ?>
    <div class="table-wrap"><table><thead><tr><th>Due</th><th>Plan</th><th class="num">Outstanding</th><th>Status</th></tr></thead><tbody>
      <?php foreach ($open as $o): ?><tr><td class="nowrap"><?= e(d($o['due_date'], 'D d M')) ?></td><td><?= e($o['plan_name']) ?><?= $o['kind'] === 'penalty' ? ' <span class="badge badge-warn">Late fee</span>' : '' ?></td><td class="num"><?= money((int)$o['outstanding_minor'], $cur) ?></td><td><?= badge($o['display_status']) ?></td></tr><?php endforeach; ?>
    </tbody></table></div>
    <p class="small muted mt-s">Payments clear your oldest dues first.</p><?php endif; ?>
  </div>
  <div class="card"><h2>My contribution plans</h2>
    <?php if (!$plans): ?><p class="empty">You are not enrolled in a contribution plan yet.</p><?php endif; ?>
    <?php foreach ($plans as $p): ?><p><strong><?= e($p['name']) ?></strong><br><span class="muted"><?= e(\Akiba\Services\PlanService::describe($p, $cur)) ?></span></p><?php endforeach; ?>
    <h2 class="mt">Recent payments</h2>
    <?php if (!$recent): ?><p class="muted">No payments yet.</p><?php endif; ?>
    <?php foreach ($recent as $t): ?><p class="mb0"><a href="/g/<?= $gid ?>/receipts/<?= (int)$t['id'] ?>"><?= e($t['receipt_no']) ?></a> · <?= money((int)$t['amount_minor'], $cur) ?> · <?= e(dt($t['paid_at'], $g['timezone'], 'd M')) ?> <?= badge($t['status']) ?></p><?php endforeach; ?>
  </div>
</div>
