<?php $gid = (int)$g['group_id']; $cur = $g['currency']; $mgr = \Akiba\Core\Permissions::can($g['role'], 'plans.manage'); $cv = end($versions); ?>
<div class="page-head"><div><h1><?= e($plan['name']) ?> <?= badge($plan['status']) ?></h1><p class="muted mb0"><?= e($plan['description'] ?? '') ?></p></div><a class="btn ghost small" href="/g/<?= $gid ?>/plans">All plans</a></div>
<div class="stats"><div class="stat"><div class="label">Enrolled</div><div class="value"><?= count($enrolled) ?></div></div><div class="stat"><div class="label">Obligations to date</div><div class="value"><?= (int)$stats['n'] ?></div></div>
  <div class="stat"><div class="label">Expected to date</div><div class="value"><?= money((int)$stats['expected'], $cur) ?></div></div><div class="stat good"><div class="label">Paid toward plan</div><div class="value"><?= money((int)$stats['paid'], $cur) ?></div></div></div>
<div class="grid cols-2">
<div class="card"><h2>Terms history</h2><p class="muted small">Each obligation keeps the terms that applied when it was created. Changes are effective-dated and never rewrite the past.</p>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Effective</th><th>Terms</th><th>Grace</th><th>Reason</th></tr></thead><tbody>
<?php foreach ($versions as $v): ?><tr><td><?= (int)$v['version_no'] ?></td><td class="nowrap"><?= e(d($v['effective_from'], 'd M Y')) ?></td><td><?= e(\Akiba\Services\PlanService::describe($v, $cur)) ?></td><td><?= (int)$v['grace_days'] ?>d</td><td class="small"><?= e($v['change_reason'] ?? '') ?></td></tr><?php endforeach; ?></tbody></table></div></div>
<div class="card"><h2>Enrolled members</h2><?php foreach ($enrolled as $m): ?><p class="mb0"><?= e($m['full_name']) ?> <span class="muted small"><?= e($m['member_code']) ?> · since <?= e(d($m['from_date'], 'd M Y')) ?></span></p><?php endforeach; ?><?php if (!$enrolled): ?><p class="empty">No members enrolled.</p><?php endif; ?></div>
</div>
<?php if ($mgr): ?>
<form class="card" method="post" action="/g/<?= $gid ?>/plans/<?= (int)$plan['id'] ?>/version"><?= csrf_field() ?><h2>Change the terms</h2>
  <div class="form-grid">
    <div class="field"><label for="a">New amount (<?= e($cur) ?>)</label><input id="a" name="amount" inputmode="decimal" required value="<?= e(\Akiba\Core\Money::dec((int)$cv['amount_minor'])) ?>"><?= err($errors, 'amount') ?></div>
    <div class="field"><label for="f">Frequency</label><select id="f" name="frequency"><?php foreach (['daily' => 'Daily', 'weekly' => 'Weekly', 'biweekly' => 'Every two weeks', 'monthly' => 'Monthly', 'custom_days' => 'Every N days'] as $k => $l): ?><option value="<?= $k ?>" <?= $cv['frequency'] === $k ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select></div>
    <div class="field"><label for="w">Weekly day</label><select id="w" name="weekday"><?php foreach ([1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday', 4 => 'Thursday', 5 => 'Friday', 6 => 'Saturday', 7 => 'Sunday'] as $k => $l): ?><option value="<?= $k ?>" <?= (int)$cv['weekday'] === $k ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select></div>
    <div class="field"><label for="md">Monthly day</label><select id="md" name="month_day"><?php for ($i = 1; $i <= 31; $i++): ?><option value="<?= $i ?>" <?= $cv['month_day'] !== null && (int)$cv['month_day'] === $i ? 'selected' : '' ?>><?= $i ?></option><?php endfor; ?><option value="last" <?= $cv['month_day'] !== null && (int)$cv['month_day'] === 0 ? 'selected' : '' ?>>Last day</option></select></div>
    <div class="field"><label for="iv">Every N days</label><input id="iv" type="number" name="interval_days" min="1" value="<?= e($cv['interval_days'] ?? '') ?>"></div>
    <div class="field"><label for="an">Phase date (biweekly/custom)</label><input id="an" type="date" name="anchor_date" value="<?= e($cv['anchor_date'] ?? '') ?>"><?= err($errors, 'anchor_date') ?></div>
    <div class="field"><label for="ef">Effective from</label><input id="ef" type="date" name="effective_from" required><?= err($errors, 'effective_from') ?></div>
    <div class="field"><label for="gr">Grace days</label><input id="gr" type="number" name="grace_days" min="0" value="<?= (int)$cv['grace_days'] ?>"></div>
  </div>
  <div class="field"><label for="re">Reason for change (recorded in audit trail)</label><input id="re" name="reason" required><?= err($errors, 'reason') ?></div>
  <button class="btn primary" type="submit" data-confirm="Members will be notified. Existing obligations are not changed. Continue?">Schedule new terms</button>
</form>
<form class="card" method="post" action="/g/<?= $gid ?>/plans/<?= (int)$plan['id'] ?>/status"><?= csrf_field() ?><h2>Plan status</h2>
  <div class="mini-form"><div class="field"><label for="st">Status</label><select id="st" name="status"><?php foreach (['active' => 'Active', 'paused' => 'Paused (no new obligations)', 'ended' => 'Ended'] as $k => $l): ?><option value="<?= $k ?>" <?= $plan['status'] === $k ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select></div><button class="btn" type="submit" data-confirm="Change plan status? Existing dues stay on record.">Update</button></div></form>
<?php endif; ?>
