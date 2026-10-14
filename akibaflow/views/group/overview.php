<?php $cur = $g['currency']; $gid = (int)$g['group_id']; ?>
<div class="page-head"><h1>Financial overview</h1><a class="btn ghost small" href="/g/<?= $gid ?>/reports">Reports</a></div>
<form class="card mini-form" method="get">
  <div class="field"><label for="from">From</label><input id="from" type="date" name="from" value="<?= e($from) ?>"></div>
  <div class="field"><label for="to">To</label><input id="to" type="date" name="to" value="<?= e($to) ?>"></div>
  <div class="field"><label for="plan">Plan</label><select id="plan" name="plan"><option value="">All plans</option><?php foreach ($plans as $p): ?><option value="<?= (int)$p['id'] ?>" <?= $planId === (int)$p['id'] ? 'selected' : '' ?>><?= e($p['name']) ?></option><?php endforeach; ?></select></div>
  <button class="btn" type="submit">Apply</button>
</form>
<p class="muted small">Money received and obligations are shown separately: <strong>collected</strong> is cash actually received; <strong>expected</strong> and <strong>outstanding</strong> are amounts owed by members, not money held.</p>
<div class="stats">
  <div class="stat good"><div class="label">Verified collections</div><div class="value"><?= money($o['collected'], $cur) ?></div><div class="hint">Money received in period</div></div>
  <div class="stat"><div class="label">Contributions expected</div><div class="value"><?= money($o['expected'], $cur) ?></div><div class="hint">Falling due in period</div></div>
  <div class="stat gold"><div class="label">Outstanding (all time)</div><div class="value"><?= money($o['outstanding'], $cur) ?></div><div class="hint">Owed by members</div></div>
  <div class="stat <?= $o['overdue'] ? 'bad' : '' ?>"><div class="label">Overdue</div><div class="value"><?= money($o['overdue'], $cur) ?></div></div>
  <div class="stat"><div class="label">Collection rate</div><div class="value"><?= $o['collection_rate'] === null ? '—' : $o['collection_rate'] . '%' ?></div><div class="hint">Paid ÷ expected, this period</div></div>
  <div class="stat"><div class="label">Expenses paid</div><div class="value"><?= money($o['expenses'], $cur) ?></div></div>
  <div class="stat good"><div class="label">Available group funds</div><div class="value"><?= money($o['available_funds'], $cur) ?></div><div class="hint">From the ledger<?= $o['member_credits'] ? ' · incl. ' . money($o['member_credits'], $cur) . ' member credits' : '' ?></div></div>
  <div class="stat"><div class="label">Pending / failed payments</div><div class="value"><?= $o['pending_n'] ?> / <?= $o['failed_n'] ?></div><div class="hint"><a href="/g/<?= $gid ?>/reconcile">Reconcile</a></div></div>
</div>
<div class="grid cols-2">
  <div class="card"><h2>Collections</h2>
    <p class="muted small mb0">Last 30 days, verified money received per day.</p>
    <svg class="chart" id="collections-chart" data-gid="<?= $gid ?>" data-by="day" aria-label="Collections chart"></svg></div>
  <div class="card"><h2>Upcoming obligations</h2>
    <?php if (!$upcoming): ?><p class="empty">No upcoming obligations generated yet.</p><?php endif; ?>
    <?php foreach ($upcoming as $u): ?><p class="mb0"><strong><?= e(d($u['due_date'], 'D d M')) ?></strong> · <?= e($u['name']) ?> · <?= (int)$u['n'] ?> member(s) · <?= money((int)$u['amt'], $cur) ?></p><?php endforeach; ?>
    <p class="muted small mt">Next 7 days: <?= money($o['upcoming7'], $cur) ?></p>
    <h2 class="mt">Recent transactions</h2>
    <?php if (!$recent): ?><p class="muted">No payments yet.</p><?php endif; ?>
    <?php foreach ($recent as $t): ?><p class="mb0"><a href="/g/<?= $gid ?>/receipts/<?= (int)$t['id'] ?>"><?= e($t['receipt_no']) ?></a> · <?= e($t['full_name']) ?> · <?= money((int)$t['amount_minor'], $cur) ?> <?= badge($t['status']) ?><?= $t['source'] === 'manual' ? ' <span class="badge badge-neutral">manual</span>' : '' ?></p><?php endforeach; ?>
  </div>
</div>
<div class="card"><h2>Members</h2>
  <form class="mini-form" method="get"><input type="hidden" name="from" value="<?= e($from) ?>"><input type="hidden" name="to" value="<?= e($to) ?>">
    <div class="field"><label for="q">Search</label><input id="q" type="search" name="q" value="<?= e($q) ?>" placeholder="Name, phone or code"></div>
    <div class="field"><label for="sort">Sort by</label><select id="sort" name="sort"><?php foreach (['outstanding' => 'Outstanding', 'overdue' => 'Overdue items', 'name' => 'Name', 'paid' => 'Paid', 'last' => 'Last payment'] as $k => $l): ?><option value="<?= $k ?>" <?= $sort === $k ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select></div><button class="btn" type="submit">Go</button></form>
  <div class="table-wrap mt"><table><thead><tr><th>Member</th><th class="num">Expected</th><th class="num">Paid</th><th class="num">Outstanding</th><th class="num">Overdue</th><th>Last payment</th><th>Status</th></tr></thead><tbody>
  <?php foreach ($members as $m): $st = (int)$m['overdue_count'] > 0 ? 'overdue' : ((int)$m['outstanding'] > 0 ? 'due' : 'paid'); ?>
    <tr><td><a href="/g/<?= $gid ?>/members/<?= (int)$m['id'] ?>"><?= e($m['full_name']) ?></a> <span class="muted small"><?= e($m['member_code']) ?></span></td><td class="num"><?= money((int)$m['expected'], $cur) ?></td><td class="num"><?= money((int)$m['paid'], $cur) ?></td>
    <td class="num"><?= money((int)$m['outstanding'], $cur) ?></td><td class="num"><?= (int)$m['overdue_count'] ?></td><td class="nowrap"><?= $m['last_payment'] ? e(dt($m['last_payment'], $g['timezone'], 'd M Y')) : '—' ?></td><td><?= badge($st) ?></td></tr>
  <?php endforeach; ?>
  <?php if (!$members): ?><tr><td colspan="7" class="empty">No members match.</td></tr><?php endif; ?></tbody></table></div>
</div>
