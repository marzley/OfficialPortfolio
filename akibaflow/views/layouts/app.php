<?php
/** @var string $content */
$user = $user ?? \Akiba\Core\Auth::user();
$g = $g ?? null;            // active membership row (with group_name, role)
$nav = $nav ?? '';
$unread = $user ? (int)\Akiba\Core\Db::i()->val('SELECT COUNT(*) FROM notifications WHERE user_id=? AND read_at IS NULL', [$user['id']]) : 0;
$can = fn(string $p) => $g && \Akiba\Core\Permissions::can($g['role'], $p);
$gid = $g['group_id'] ?? null;
$link = function (string $key, string $href, string $label, string $icon) use ($nav) {
    return '<a href="' . e($href) . '"' . ($nav === $key ? ' aria-current="page"' : '') . '><span aria-hidden="true">' . $icon . '</span> ' . e($label) . '</a>';
};
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf" content="<?= e(\Akiba\Core\Session::csrf()) ?>">
<title><?= e($title ?? 'AkibaFlow') ?> · AkibaFlow</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/app.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="shell<?= $g ? ' has-sidebar' : '' ?>">
  <header class="topbar">
    <?php if ($g): ?><button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="sidebar">☰</button><?php endif; ?>
    <a class="brand" href="/groups">Akiba<span class="dot">Flow</span></a>
    <?php if ($g): ?><span class="group-chip" title="Active group"><?= e($g['group_name']) ?> · <?= e(roleLabel($g['role'])) ?></span><?php endif; ?>
    <span class="spacer"></span>
    <?php if ($user): ?>
      <a class="icon-btn" href="/notifications" aria-label="Notifications<?= $unread ? ", $unread unread" : '' ?>">🔔<?php if ($unread): ?><span class="count"><?= $unread > 99 ? '99+' : $unread ?></span><?php endif; ?></a>
      <a class="icon-btn" href="/account" aria-label="My account">👤</a>
    <?php endif; ?>
  </header>
  <?php if ($g): ?>
  <div class="scrim" id="scrim"></div>
  <nav class="sidebar" id="sidebar" aria-label="Group navigation">
    <h4>My money</h4>
    <?= $link('me', "/g/$gid", 'My dashboard', '🏠') ?>
    <?= $link('pay', "/g/$gid/pay", 'Contribute now', '💳') ?>
    <?= $link('history', "/g/$gid/history", 'Contribution history', '📒') ?>
    <?= $link('calendar', "/g/$gid/calendar", 'Calendar', '📅') ?>
    <?= $link('receipts', "/g/$gid/receipts", 'Receipts & statement', '🧾') ?>
    <?php if ($can('members.view') || $can('reports.view') || $can('plans.view')): ?><h4>Group</h4>
    <?= $link('overview', "/g/$gid/overview", 'Financial overview', '📊') ?>
    <?php if ($can('members.view')) echo $link('members', "/g/$gid/members", 'Members', '👥'); ?>
    <?php if ($can('plans.view')) echo $link('plans', "/g/$gid/plans", 'Contribution plans', '🗓️'); ?>
    <?php if ($can('obligations.view_all')) echo $link('arrears', "/g/$gid/arrears", 'Outstanding balances', '⏳'); ?>
    <?php if ($can('payments.view_all')) echo $link('payments', "/g/$gid/payments", 'Payments', '💰'); ?>
    <?php if ($can('reconcile.view')) echo $link('reconcile', "/g/$gid/reconcile", 'Reconciliation', '🔍'); ?>
    <?php if ($can('expenses.view')) echo $link('expenses', "/g/$gid/expenses", 'Expenses', '🧮'); ?>
    <?php if ($can('reports.view')) echo $link('reports', "/g/$gid/reports", 'Reports', '📈'); ?>
    <?php endif; ?>
    <h4>Community</h4>
    <?= $link('goals', "/g/$gid/goals", 'Savings goals', '🎯') ?>
    <?= $link('announcements', "/g/$gid/announcements", 'Announcements', '📣') ?>
    <?php if ($can('audit.view')) echo $link('audit', "/g/$gid/audit", 'Audit trail', '🛡️'); ?>
    <?php if ($can('group.manage')) echo $link('settings', "/g/$gid/settings", 'Group settings', '⚙️'); ?>
    <h4>Switch</h4>
    <a href="/groups"><span aria-hidden="true">🔁</span> All my groups</a>
  </nav>
  <?php endif; ?>
  <main id="main" class="main">
    <?php foreach (\Akiba\Core\Session::takeFlash() as [$t, $m]): ?><div class="alert <?= e($t) ?>" role="<?= $t === 'error' ? 'alert' : 'status' ?>"><?= e($m) ?></div><?php endforeach; ?>
    <?= $content ?>
  </main>
</div>
<script src="/assets/js/app.js" defer></script>
</body>
</html>
