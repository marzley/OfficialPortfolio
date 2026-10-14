<div class="auth"><div class="card">
  <h1>Join <?= e($inv['group_name']) ?></h1>
  <p>You've been invited as <strong><?= e(roleLabel($inv['role'])) ?></strong> (<?= e($inv['email']) ?>).</p>
  <?php if (!$user): ?>
    <p>Sign in or create an account with <strong><?= e($inv['email']) ?></strong> to accept.</p>
    <div class="btn-row"><a class="btn primary" href="/login">Sign in</a><a class="btn ghost" href="/register">Create account</a></div>
  <?php elseif (strtolower($user['email']) !== strtolower($inv['email'])): ?>
    <div class="alert warn">This invitation was sent to a different email address than your account (<?= e($user['email']) ?>).</div>
  <?php else: ?>
    <form method="post" action="/invites/<?= e($token) ?>"><?= csrf_field() ?><button class="btn primary block" type="submit">Accept invitation</button></form>
  <?php endif; ?>
</div></div>
