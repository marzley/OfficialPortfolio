<div class="auth"><div class="card">
  <div class="brand">AkibaFlow</div>
  <h1>Create your account</h1>
  <form method="post" action="/register" novalidate>
    <?= csrf_field() ?>
    <div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" required value="<?= old('name') ?>"><?= err($errors, 'name') ?></div>
    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required value="<?= old('email') ?>"><?= err($errors, 'email') ?></div>
    <div class="field"><label for="phone">M-PESA phone (optional)</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678" value="<?= old('phone') ?>"><?= err($errors, 'phone') ?></div>
    <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="new-password" required aria-describedby="pwh"><p class="help" id="pwh">At least 10 characters, with letters and numbers.</p><?= err($errors, 'password') ?></div>
    <button class="btn primary block" type="submit" data-busy-text="Creating…">Create account</button>
  </form>
  <p class="small mt">Already registered? <a href="/login">Sign in</a></p>
</div></div>
