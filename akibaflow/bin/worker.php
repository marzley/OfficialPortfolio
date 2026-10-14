<?php
declare(strict_types=1);
// Run every minute from cron:  * * * * * php /path/to/akibaflow/bin/worker.php
// Safe to run concurrently (named DB lock) and to re-run (every job is idempotent).
require __DIR__ . '/../src/bootstrap.php';

use Akiba\Core\{Clock, Db};
use Akiba\Services\{ContributionEngine, Notifications, PaymentService, PenaltyService, ReminderService};

$db = Db::i();
if (!(int)$db->val("SELECT GET_LOCK('akibaflow_worker', 0)")) { echo "Another worker is running.\n"; exit(0); }

$jobs = [
    'generate_obligations' => fn() => json_encode(ContributionEngine::generate()),
    'apply_penalties' => fn() => 'created=' . PenaltyService::run(),
    'send_reminders' => fn() => json_encode(ReminderService::run()),
    'poll_payments' => fn() => json_encode(PaymentService::pollOpenRequests()),
    'deliver_notifications' => fn() => json_encode(Notifications::process()),
];
foreach ($jobs as $name => $fn) {
    $start = Clock::nowSql();
    try {
        $msg = $fn();
        $status = 'ok';
    } catch (Throwable $e) {
        $msg = get_class($e) . ': ' . $e->getMessage();
        $status = 'error';
        error_log("[worker:$name] $msg");
    }
    $db->exec('INSERT INTO scheduled_job_logs (job,status,message,started_at,finished_at) VALUES (?,?,?,?,?)', [$name, $status, mb_substr((string)$msg, 0, 490), $start, Clock::nowSql()]);
    echo str_pad($name, 24) . " $status  $msg\n";
}
$db->val("SELECT RELEASE_LOCK('akibaflow_worker')");
