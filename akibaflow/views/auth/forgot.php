<div class="auth"><div class="card">
  <h1>Reset your password</h1>
  <?php if ($sent): ?>
    <div class="alert success" role="status">If an account exists for that email, a reset link is on its way. It expires in 60 minutes.</div>
    <a class="btn" href="/login">Back to sign in</a>
  <?php else: ?>
  <form method="post" action="/forgot">
    <?= csrf_field() ?>
    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email"></div>
    <button class="btn primary block" type="submit">Send reset link</button>
  </form>
  <?php endif; ?>
</div></div>
