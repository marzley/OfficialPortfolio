<?php $gid = (int)$g['group_id']; $cur = $g['currency']; $ch = explode(',', $s['reminder_channels']); ?>
<div class="page-head"><h1>Group settings</h1></div>
<form method="post" action="/g/<?= $gid ?>/settings"><?= csrf_field() ?>
<div class="card"><h2>Group details</h2>
  <div class="form-grid"><div class="field"><label for="ce">Contact email</label><input id="ce" type="email" name="contact_email" value="<?= e($grp['contact_email'] ?? '') ?>"></div>
  <div class="field"><label for="cp">Contact phone</label><input id="cp" type="tel" name="contact_phone" value="<?= e($grp['contact_phone'] ?? '') ?>"></div></div>
  <div class="field"><label for="ds">Description</label><textarea id="ds" name="description"><?= e($grp['description'] ?? '') ?></textarea></div>
  <p class="muted small">Currency <strong><?= e($cur) ?></strong> and time zone <strong><?= e($g['timezone']) ?></strong> are fixed once a group has financial history.</p></div>
<div class="card"><h2>Payments</h2>
  <label class="check"><input type="checkbox" name="allow_partial" value="1" <?= $s['allow_partial'] ? 'checked' : '' ?>> Allow partial payments</label>
  <label class="check"><input type="checkbox" name="allow_advance" value="1" <?= $s['allow_advance'] ? 'checked' : '' ?>> Allow advance payments (paying ahead of the due date)</label>
  <div class="field mt"><label for="ep">When a member pays more than they owe</label><select id="ep" name="excess_policy"><option value="hold_credit" <?= $s['excess_policy'] === 'hold_credit' ? 'selected' : '' ?>>Hold the excess as member credit (member applies it)</option><option value="apply_future" <?= $s['excess_policy'] === 'apply_future' ? 'selected' : '' ?>>Apply the excess to upcoming contributions automatically</option></select></div>
  <p class="muted small">Allocation order: oldest due first, contributions before late fees.</p>
  <label class="check"><input type="checkbox" name="dual_control" value="1" <?= $s['dual_control_reversals'] ? 'checked' : '' ?>> Payment reversals need approval from a second officer</label></div>
<div class="card"><h2>Reminders</h2>
  <label class="check"><input type="checkbox" name="reminders_paused" value="1" <?= $s['reminders_paused'] ? 'checked' : '' ?>> Pause all reminders (history is kept)</label>
  <div class="field mt"><label for="rb">Remind this many days before a due date (0 = off)</label><input id="rb" type="number" min="0" max="30" name="remind_before_days" value="<?= (int)$s['remind_before_days'] ?>"></div>
  <fieldset><legend>Channels</legend><?php foreach (['in_app' => 'In-app', 'email' => 'Email', 'sms' => 'SMS (needs provider configured)'] as $k => $l): ?><label class="check"><input type="checkbox" name="channels[]" value="<?= $k ?>" <?= in_array($k, $ch, true) ? 'checked' : '' ?>> <?= $l ?></label><?php endforeach; ?></fieldset>
  <label class="check"><input type="checkbox" name="overdue_digest" value="1" <?= $s['overdue_digest'] ? 'checked' : '' ?>> Send officers a daily overdue summary</label></div>
<div class="card"><h2>Late fees (optional)</h2>
  <p class="muted small">Off by default. Unpaid contributions are <strong>never</strong> penalised automatically; only if your group has approved a fee and you enable it here. One fixed fee per overdue contribution, never compounding, shown separately to members. Check applicable law and your group's constitution first.</p>
  <label class="check"><input type="checkbox" name="penalty_enabled" value="1" <?= $s['penalty_enabled'] ? 'checked' : '' ?>> Charge a fixed late fee</label>
  <div class="form-grid mt"><div class="field"><label for="pf">Fee per overdue contribution (<?= e($cur) ?>)</label><input id="pf" name="penalty_fixed" inputmode="decimal" value="<?= e($s['penalty_fixed_minor'] ? \Akiba\Core\Money::dec((int)$s['penalty_fixed_minor']) : '') ?>"></div>
  <div class="field"><label for="pa">…after this many extra days overdue</label><input id="pa" type="number" min="0" name="penalty_after_days" value="<?= (int)$s['penalty_after_days'] ?>"></div>
  <div class="field"><label for="pm">Maximum fees per member (0 = no cap)</label><input id="pm" name="penalty_max" inputmode="decimal" value="<?= e($s['penalty_max_per_member_minor'] ? \Akiba\Core\Money::dec((int)$s['penalty_max_per_member_minor']) : '') ?>"></div></div></div>
<div class="card"><h2>Expenses</h2><div class="field"><label for="et">Expenses at or above this amount need two approvers (0 = one approver)</label><input id="et" name="expense_threshold" inputmode="decimal" value="<?= e($s['expense_dual_threshold_minor'] ? \Akiba\Core\Money::dec((int)$s['expense_dual_threshold_minor']) : '') ?>"></div></div>
<button class="btn primary" type="submit" data-confirm="Save settings? Changes apply going forward only.">Save settings</button>
</form>
