<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="csrf" content="<?= e(\Akiba\Core\Session::csrf()) ?>">
<title><?= e($title ?? 'Admin') ?> · AkibaFlow</title><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/css/app.css"></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="topbar"><a class="brand" href="/admin">Akiba<span class="dot">Flow</span> · Platform</a><span class="spacer"></span><a class="icon-btn" href="/groups" aria-label="Back to my groups">↩</a></header>
<main id="main" class="main">
<div class="tabs" role="navigation" aria-label="Admin sections"><?php foreach (['/admin' => 'Overview', '/admin/users' => 'Users', '/admin/groups' => 'Groups', '/admin/integrations' => 'Integrations', '/admin/jobs' => 'Jobs & failures', '/admin/backups' => 'Backups'] as $h => $l): ?>
  <a class="btn small <?= parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) === $h ? '' : 'ghost' ?>" href="<?= $h ?>"><?= $l ?></a><?php endforeach; ?></div>
<?php foreach (\Akiba\Core\Session::takeFlash() as [$t, $m]): ?><div class="alert <?= e($t) ?>"><?= e($m) ?></div><?php endforeach; ?>
<?= $content ?></main><script src="/assets/js/app.js" defer></script></body></html>
