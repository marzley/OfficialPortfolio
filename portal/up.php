<?php
// Uptime check for UptimeRobot (or any monitor). Answers "OK" with status 200 when the
// portal database works and the daily jobs ran in the last 26 hours; otherwise status 503.
// It shows no private information.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
require __DIR__ . '/lib.php';
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

$problems = [];
try {
    q('SELECT 1');
    $last = setting('last_cron');
    if ($last !== null && strtotime($last) < time() - 26 * 3600) $problems[] = 'daily jobs have not run';
    $backup = setting('last_backup');
    if ($backup !== null && strtotime($backup) < time() - 50 * 3600) $problems[] = 'backups have not run';
} catch (Throwable $e) {
    $problems[] = 'database';
}
http_response_code($problems ? 503 : 200);
echo $problems ? 'PROBLEM: ' . implode(', ', $problems) : 'OK';
