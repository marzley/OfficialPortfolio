<?php $cur = $g['currency']; $gid = (int)$g['group_id']; $waive = \Akiba\Core\Permissions::can($g['role'], 'waivers.grant'); ?>
<div class="page-head"><h1>Outstanding balances</h1><a class="btn ghost small" href="/g/<?= $gid ?>/reports/arrears?format=csv">Download CSV</a></div>
<div class="alert info">These are amounts <strong>owed by members</strong> — not money in the group account. Total outstanding: <strong><?= money($total, $cur) ?></strong>.</div>
<form class="card mini-form" method="get"><div class="field"><label for="q">Search</label><input id="q" type="search" name="q" value="<?= e($q) ?>" placeholder="Name, phone or code"></div><button class="btn">Search</button></form>
<div class="card"><?php if (!$rows): ?><p class="empty">Nobody owes anything right now. 🎉</p><?php else: ?>
<div class="table-wrap"><table><thead><tr><th>Member</th><th class="num">Outstanding</th><th class="num">Overdue items</th><th>Oldest unpaid</th><th>Last payment</th><th></th></tr></thead><tbody>
<?php foreach ($rows as $r): ?><tr><td><a href="/g/<?= $gid ?>/members/<?= (int)$r['id'] ?>"><?= e($r['full_name']) ?></a> <span class="muted small"><?= e($r['phone'] ?? '') ?></span></td><td class="num"><?= money((int)$r['outstanding'], $cur) ?></td><td class="num"><?= (int)$r['overdue_count'] ?></td>
  <td class="nowrap"><?= e(d($r['oldest_unpaid'], 'd M Y')) ?></td><td class="nowrap"><?= $r['last_payment'] ? e(dt($r['last_payment'], $g['timezone'], 'd M Y')) : 'never' ?></td><td><a class="btn small ghost" href="?member=<?= (int)$r['id'] ?>">Details</a></td></tr><?php endforeach; ?>
</tbody></table></div><?php endif; ?></div>
<?php if ($mid): ?><div class="card"><h2>Open obligations</h2>
<?php if (!$open): ?><p class="muted">No open obligations for this member.</p><?php endif; ?>
<div class="table-wrap"><table><tbody><?php foreach ($open as $o): ?><tr><td class="nowrap"><?= e(d($o['due_date'], 'd M Y')) ?></td><td><?= e($o['plan_name']) ?></td><td class="num"><?= money((int)$o['outstanding_minor'], $cur) ?></td><td><?= badge($o['display_status']) ?></td>
<td><?php if ($waive): ?><form class="mini-form" method="post" action="/g/<?= $gid ?>/obligations/<?= (int)$o['id'] ?>/waive" data-confirm="Waive this amount? This reduces what the member owes and is permanently recorded."><?= csrf_field() ?>
  <div class="field"><label class="sr-only" for="wr<?= (int)$o['id'] ?>">Reason</label><input id="wr<?= (int)$o['id'] ?>" name="reason" placeholder="Reason (required)" required></div><button class="btn small ghost">Waive</button></form><?php endif; ?></td></tr><?php endforeach; ?></tbody></table></div></div><?php endif; ?>
