<?php $gid = (int)$g['group_id']; $mgr = \Akiba\Core\Permissions::can($g['role'], 'members.manage'); $roles = \Akiba\Core\Permissions::can($g['role'], 'roles.assign'); ?>
<div class="page-head"><h1>Members</h1></div>
<?php if ($link): ?><div class="alert success"><strong>Invitation link</strong> (shown once — share it with the invitee; it expires in 14 days):<br><code><?= e($link) ?></code></div><?php endif; ?>
<div class="card">
<div class="table-wrap"><table><thead><tr><th>Member</th><th>Contact</th><th>Code</th><th>Role</th><th>Status</th><?php if ($mgr): ?><th>Actions</th><?php endif; ?></tr></thead><tbody>
<?php foreach ($rows as $m): ?><tr>
  <td><?= \Akiba\Core\Permissions::can($g['role'], 'obligations.view_all') && $m['status'] === 'active' ? '<a href="/g/' . $gid . '/members/' . (int)$m['id'] . '">' . e($m['full_name']) . '</a>' : e($m['full_name']) ?></td>
  <td class="small"><?= e($m['email']) ?><br><?= e($m['phone'] ?? '') ?></td><td><code><?= e($m['member_code']) ?></code></td>
  <td><?php if ($roles && $m['status'] === 'active'): ?><form class="mini-form" method="post" action="/g/<?= $gid ?>/members/<?= (int)$m['id'] ?>/action"><?= csrf_field() ?><input type="hidden" name="action" value="role">
      <label class="sr-only" for="r<?= (int)$m['id'] ?>">Role for <?= e($m['full_name']) ?></label><select id="r<?= (int)$m['id'] ?>" name="role"><?php foreach (\Akiba\Core\Permissions::ROLES as $r): ?><option value="<?= $r ?>" <?= $m['role'] === $r ? 'selected' : '' ?>><?= e(roleLabel($r)) ?></option><?php endforeach; ?></select><button class="btn small ghost">Set</button></form><?php else: ?><?= e(roleLabel($m['role'])) ?><?php endif; ?></td>
  <td><?= badge($m['status']) ?></td>
  <?php if ($mgr): ?><td><div class="btn-row">
    <?php foreach ([['pending', 'approve', 'Approve', 'primary'], ['pending', 'reject', 'Reject', 'ghost'], ['active', 'suspend', 'Suspend', 'ghost'], ['suspended', 'reactivate', 'Reactivate', 'ghost'], ['active', 'exit', 'Remove', 'danger'], ['suspended', 'exit', 'Remove', 'danger']] as [$from, $act, $label, $cls]):
      if ($m['status'] !== $from || (int)$m['id'] === (int)$g['id']) continue; ?>
      <form method="post" action="/g/<?= $gid ?>/members/<?= (int)$m['id'] ?>/action" data-confirm="<?= e("$label {$m['full_name']}? " . ($act === 'exit' ? 'They stop receiving new obligations; existing dues stay on record.' : '')) ?>"><?= csrf_field() ?><input type="hidden" name="action" value="<?= $act ?>"><button class="btn small <?= $cls ?>"><?= $label ?></button></form>
    <?php endforeach; ?></div></td><?php endif; ?></tr><?php endforeach; ?>
</tbody></table></div></div>
<?php if ($mgr): ?>
<form class="card" method="post" action="/g/<?= $gid ?>/members/invite"><?= csrf_field() ?><h2>Invite a member</h2>
  <div class="mini-form"><div class="field"><label for="ie">Email</label><input id="ie" type="email" name="email" required></div>
  <div class="field"><label for="ir">Role</label><select id="ir" name="role"><option value="member">Member</option><?php if ($roles): foreach (['treasurer', 'secretary', 'auditor', 'chairperson'] as $r): ?><option value="<?= $r ?>"><?= e(roleLabel($r)) ?></option><?php endforeach; endif; ?></select></div>
  <button class="btn primary" type="submit">Create invitation</button></div></form>
<?php if ($invites): ?><div class="card"><h2>Pending invitations</h2><?php foreach ($invites as $i): ?><p class="mb0"><?= e($i['email']) ?> · <?= e(roleLabel($i['role'])) ?> · expires <?= e(dt($i['expires_at'], $g['timezone'], 'd M')) ?></p><?php endforeach; ?></div><?php endif; ?>
<?php endif; ?>
