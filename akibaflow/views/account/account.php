<div class="page-head"><h1>My account</h1>
  <form method="post" action="/logout"><?= csrf_field() ?><button class="btn ghost" type="submit">Sign out</button></form></div>
<div class="grid cols-2">
<form class="card" method="post" action="/account/profile">
  <?= csrf_field() ?><h2>Profile</h2>
  <div class="field"><label for="n">Full name</label><input id="n" name="name" value="<?= e($u['full_name']) ?>" required></div>
  <div class="field"><label>Email</label><input value="<?= e($u['email']) ?>" disabled><p class="help"><?= $u['email_verified_at'] ? 'Verified' : 'Not verified yet — check your inbox.' ?></p></div>
  <div class="field"><label for="p">M-PESA phone</label><input id="p" name="phone" type="tel" value="<?= e($u['phone'] ?? '') ?>" placeholder="0712 345 678"></div>
  <button class="btn primary" type="submit">Save profile</button>
</form>
<form class="card" method="post" action="/account/password">
  <?= csrf_field() ?><h2>Change password</h2>
  <div class="field"><label for="cp">Current password</label><input id="cp" name="current" type="password" autocomplete="current-password" required></div>
  <div class="field"><label for="np">New password</label><input id="np" name="password" type="password" autocomplete="new-password" required><p class="help">Signs you out of all other devices.</p></div>
  <button class="btn primary" type="submit">Change password</button>
</form>
</div>
<form class="card" method="post" action="/account/prefs">
  <?= csrf_field() ?><h2>Notification preferences</h2>
  <p class="muted small">Payment receipts, security and membership messages are always sent. You can switch off optional messages here.</p>
  <table><thead><tr><th>Message type</th><th>Email</th><th>SMS</th></tr></thead><tbody>
  <?php foreach (['reminders' => 'Contribution reminders', 'announcements' => 'Group announcements'] as $cat => $label): ?>
    <tr><td><?= e($label) ?></td>
    <?php foreach (['email', 'sms'] as $ch): ?><td><label class="check"><input type="checkbox" name="pref[<?= $cat ?>][<?= $ch ?>]" value="1" <?= ($prefs[$cat][$ch] ?? 1) ? 'checked' : '' ?>><span class="sr-only"><?= e("$label by $ch") ?></span></label></td><?php endforeach; ?></tr>
  <?php endforeach; ?></tbody></table>
  <button class="btn primary" type="submit">Save preferences</button>
</form>
<div class="card"><h2>Signed-in devices</h2>
  <div class="table-wrap"><table><thead><tr><th>Device</th><th>IP</th><th>Last active</th><th></th></tr></thead><tbody>
  <?php foreach ($sessions as $s): ?><tr>
    <td><?= e(mb_substr($s['user_agent'] ?? 'Unknown', 0, 60)) ?><?= $s['current'] ? ' <span class="badge badge-ok">This device</span>' : '' ?></td>
    <td><?= e($s['ip']) ?></td><td><?= e(dt($s['last_seen_at'])) ?></td>
    <td><?php if (!$s['current']): ?><form method="post" action="/account/sessions/<?= (int)$s['id'] ?>/revoke" data-confirm="Sign this device out?"><?= csrf_field() ?><button class="btn small ghost">Sign out</button></form><?php endif; ?></td></tr>
  <?php endforeach; ?></tbody></table></div>
</div>
