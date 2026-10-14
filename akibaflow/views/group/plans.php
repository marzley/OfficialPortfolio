<?php $gid = (int)$g['group_id']; $mgr = \Akiba\Core\Permissions::can($g['role'], 'plans.manage'); $cur = $g['currency']; ?>
<div class="page-head"><h1>Contribution plans</h1></div>
<?php if (!$plans): ?><div class="card empty"><p><strong>No contribution plan yet.</strong></p><p>A plan defines what each member owes and how often. AkibaFlow then generates a real obligation for every member on every due date.</p></div><?php endif; ?>
<div class="grid cols-2"><?php foreach ($plans as $p): ?>
  <div class="card"><h2><a href="/g/<?= $gid ?>/plans/<?= (int)$p['id'] ?>"><?= e($p['name']) ?></a> <?= badge($p['status']) ?></h2>
  <p><strong><?= e(\Akiba\Services\PlanService::describe($p, $cur)) ?></strong></p>
  <p class="muted small"><?= (int)$p['members'] ?> member(s) · from <?= e(d($p['start_date'], 'd M Y')) ?><?= $p['end_date'] ? ' to ' . e(d($p['end_date'], 'd M Y')) : '' ?> · grace <?= (int)$p['grace_days'] ?> day(s) · <?= $p['mandatory'] ? 'mandatory' : 'optional' ?></p></div>
<?php endforeach; ?></div>
<?php if ($mgr): ?>
<form class="card" method="post" action="/g/<?= $gid ?>/plans" novalidate><?= csrf_field() ?><h2>Create a contribution plan</h2>
  <div class="form-grid">
    <div class="field"><label for="pn">Plan name</label><input id="pn" name="name" required value="<?= old('name') ?>"><?= err($errors, 'name') ?></div>
    <div class="field"><label for="pa">Amount per period (<?= e($cur) ?>)</label><input id="pa" name="amount" inputmode="decimal" required value="<?= old('amount') ?>"><?= err($errors, 'amount') ?></div>
    <div class="field"><label for="pf">Frequency</label><select id="pf" name="frequency"><?php foreach (['daily' => 'Daily', 'weekly' => 'Weekly', 'biweekly' => 'Every two weeks', 'monthly' => 'Monthly', 'custom_days' => 'Every N days', 'one_time' => 'One-time'] as $k => $l): ?><option value="<?= $k ?>" <?= ($_POST['frequency'] ?? '') === $k ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select><?= err($errors, 'frequency') ?></div>
    <div class="field"><label for="pw">Weekly: day of week</label><select id="pw" name="weekday"><?php foreach ([1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday', 4 => 'Thursday', 5 => 'Friday', 6 => 'Saturday', 7 => 'Sunday'] as $k => $l): ?><option value="<?= $k ?>" <?= (int)($_POST['weekday'] ?? 1) === $k ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select><?= err($errors, 'weekday') ?></div>
    <div class="field"><label for="pm">Monthly: day of month</label><select id="pm" name="month_day"><?php for ($i = 1; $i <= 31; $i++): ?><option value="<?= $i ?>" <?= (int)($_POST['month_day'] ?? 5) === $i ? 'selected' : '' ?>><?= $i ?></option><?php endfor; ?><option value="last">Last day of month</option></select><p class="help">If a month is shorter (e.g. 31 in April) the due date moves to that month's last day.</p><?= err($errors, 'month_day') ?></div>
    <div class="field"><label for="pi">Every N days (custom)</label><input id="pi" type="number" min="1" max="366" name="interval_days" value="<?= old('interval_days') ?>"><?= err($errors, 'interval_days') ?></div>
    <div class="field"><label for="pan">First due date (biweekly / custom / one-time)</label><input id="pan" type="date" name="anchor_date" value="<?= old('anchor_date') ?>"><?= err($errors, 'anchor_date') ?></div>
    <div class="field"><label for="ps">Starts on</label><input id="ps" type="date" name="start_date" value="<?= old('start_date', date('Y-m-d')) ?>" required><?= err($errors, 'start_date') ?></div>
    <div class="field"><label for="pe">Ends on (optional)</label><input id="pe" type="date" name="end_date" value="<?= old('end_date') ?>"><?= err($errors, 'end_date') ?></div>
    <div class="field"><label for="pg">Grace period (days)</label><input id="pg" type="number" min="0" max="90" name="grace_days" value="<?= old('grace_days', '0') ?>"><p class="help">A contribution is "overdue" only after due date + grace days.</p><?= err($errors, 'grace_days') ?></div>
  </div>
  <div class="field"><label for="pd">Description</label><input id="pd" name="description" value="<?= old('description') ?>"></div>
  <label class="check"><input type="checkbox" name="optional" value="1"> Optional plan (members are not required to take part)</label>
  <p class="mt"><button class="btn primary" type="submit" data-busy-text="Creating…">Create plan &amp; enrol all active members</button></p>
</form>
<?php endif; ?>
