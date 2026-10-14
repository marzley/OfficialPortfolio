<div class="<?= isset($user) ? '' : 'auth' ?>">
  <div class="card">
    <h1><?= e($code) ?> — <?= $code === 404 ? 'Not found' : ($code === 403 ? 'Not allowed' : 'Something went wrong') ?></h1>
    <p><?= e($message) ?></p>
    <p><a class="btn" href="/groups">Back to my groups</a></p>
  </div>
</div>
