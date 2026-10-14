<div class="auth"><div class="card">
  <div class="brand">Akiba<span class="dot">Flow</span></div>
  <p class="tag">Akiba Yako, Maendeleo Yako.</p>
  <h1>Sign in</h1>
  <?php if (!empty($errors['form'])): ?><div class="alert error" role="alert"><?= e($errors['form']) ?></div><?php endif; ?>
  <?php foreach (\Akiba\Core\Session::takeFlash() as [$t, $m]): ?><div class="alert <?= e($t) ?>"><?= e($m) ?></div><?php endforeach; ?>
  <form method="post" action="/login" novalidate>
    <?= csrf_field() ?>
    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required value="<?= old('email') ?>"></div>
    <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></div>
    <button class="btn primary block" type="submit" data-busy-text="Signing in…">Sign in</button>
  </form>
  <p class="small mt"><a href="/forgot">Forgot password?</a> · <a href="/register">Create an account</a></p>
</div></div>
