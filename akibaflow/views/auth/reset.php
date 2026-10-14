<div class="auth"><div class="card">
  <h1>Choose a new password</h1>
  <form method="post" action="/reset/<?= e($token) ?>">
    <?= csrf_field() ?>
    <div class="field"><label for="password">New password</label><input id="password" name="password" type="password" autocomplete="new-password" required><p class="help">At least 10 characters, with letters and numbers.</p><?= err($errors, 'password') ?></div>
    <button class="btn primary block" type="submit">Update password</button>
  </form>
</div></div>
