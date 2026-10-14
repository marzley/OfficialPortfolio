<?php
// php tests/crawl.php http://127.0.0.1:8080 <gid>  — logs in as each demo role and fetches every page, flagging errors.
require __DIR__ . '/http_client.php';
[$_, $base, $gid] = $argv + [null, 'http://127.0.0.1:8080', '1'];
$pages = ['/groups', '/account', '/notifications', "/g/$gid", "/g/$gid/pay", "/g/$gid/history", "/g/$gid/calendar", "/g/$gid/receipts", "/g/$gid/statement", "/g/$gid/goals", "/g/$gid/announcements",
  "/g/$gid/overview", "/g/$gid/members", "/g/$gid/plans", "/g/$gid/plans/1", "/g/$gid/arrears", "/g/$gid/arrears?member=4", "/g/$gid/payments", "/g/$gid/reconcile", "/g/$gid/expenses", "/g/$gid/reports", "/g/$gid/settings", "/g/$gid/audit",
  "/g/$gid/members/4", "/g/$gid/receipts/1", "/g/$gid/reports/collections", "/g/$gid/reports/arrears", "/g/$gid/reports/members", "/g/$gid/reports/expenses", "/g/$gid/reports/income-expenditure", "/g/$gid/reports/cash-movement", "/g/$gid/reports/transactions",
  "/api/g/$gid/me/outstanding-balance", "/api/g/$gid/me/contribution-calendar", "/api/g/$gid/charts/collections", '/sandbox/phone', '/admin', '/admin/users', '/admin/groups', '/admin/integrations', '/admin/jobs', '/admin/backups'];
foreach (['chair@akibaflow.test', 'treasurer@akibaflow.test', 'cecilia@akibaflow.test', 'admin@akibaflow.test'] as $who) {
    $b = new Browser($base);
    $l = $b->login($who);
    echo "== $who (login {$l['status']})\n";
    foreach ($pages as $p) {
        $r = $b->get($p);
        $bad = preg_match('/(Warning|Notice|Fatal error|Deprecated|Parse error|Stack trace|Uncaught)/', $r['body']);
        $flag = ($r['status'] >= 500 || $bad) ? '  <<<<<< PROBLEM' : '';
        if ($r['status'] >= 500 || $bad || in_array('-v', $argv, true)) printf("  %3d %s%s\n", $r['status'], $p, $flag);
        if ($flag && $bad) { preg_match('/.{0,80}(Warning|Notice|Fatal error|Deprecated|Uncaught).{0,200}/s', strip_tags($r['body']), $m); echo "      " . trim($m[0] ?? '') . "\n"; }
    }
}
