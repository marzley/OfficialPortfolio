<?php
// Scheduled jobs for the client portal. Run from cPanel > Cron Jobs, never from a browser:
//
//   Every day at 07:00   php /home/USER/public_html/portal/cron.php daily
//   Every day at 02:30   php /home/USER/public_html/portal/cron.php backup
//
// daily:  creates monthly (recurring) invoices, sends payment and approval reminders,
//         finishes any M-Pesa payments that were not settled, and alerts you about
//         support requests waiting more than a day.
// backup: saves the database and uploaded files to backup_dir (outside public_html)
//         and deletes backups older than backup_keep_days.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
require __DIR__ . '/lib.php';
install_error_alerts('scheduled jobs');
config();

$job = $argv[1] ?? 'daily';
$log = function (string $line) { echo date('H:i:s') . "  $line\n"; };

/** Send a reminder once: returns false if this stage was already sent. */
function once(string $kind, int $refId, string $stage): bool {
    if (q('SELECT id FROM reminders WHERE kind = ? AND ref_id = ? AND stage = ?', [$kind, $refId, $stage])->fetch()) return false;
    q('INSERT INTO reminders (kind, ref_id, stage, sent_at) VALUES (?, ?, ?, ?)', [$kind, $refId, $stage, now()]);
    return true;
}

function days_between(string $from, string $to): int {
    return (int)((strtotime($to . ' 00:00:00') - strtotime($from . ' 00:00:00')) / 86400);
}

function run_daily(callable $log): void {
    $today = date('Y-m-d');
    $summary = [];

    // 1. Monthly invoices
    foreach (q('SELECT * FROM recurring_invoices WHERE active = 1 AND next_date <= ?', [$today])->fetchAll() as $r) {
        $next = $r['next_date'];
        while ($next <= $today) {
            $number = 'INV-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));
            $due = date('Y-m-d', strtotime($next . ' +' . (int)$r['due_days'] . ' days'));
            $desc = $r['description'] . ' (' . date('F Y', strtotime($next)) . ')';
            q('INSERT INTO invoices (client_id, project_id, number, description, amount, status, due_date, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)',
                [$r['client_id'], $r['project_id'], $number, $desc, $r['amount'], 'unpaid', $due, now()]);
            notify_client((int)$r['client_id'], "New invoice $number", "Your monthly invoice is ready: $desc, KSh " . number_format((int)$r['amount']) . ", due $due. You can pay it by M-Pesa in the portal.",
                "Marzley Tech: invoice $number KSh " . number_format((int)$r['amount']) . " due $due. Pay by M-Pesa at " . portal_url());
            audit('recurring_invoice', "$number KSh {$r['amount']} for client {$r['client_id']}", 'cron');
            $summary[] = "Created $number (KSh " . number_format((int)$r['amount']) . ')';
            $d = new DateTime($next);
            $d->modify('first day of next month');
            $d->setDate((int)$d->format('Y'), (int)$d->format('n'), (int)$r['day_of_month']);
            $next = $d->format('Y-m-d');
        }
        q('UPDATE recurring_invoices SET next_date = ? WHERE id = ?', [$next, $r['id']]);
    }

    // 2. Finish M-Pesa payments that came in while nobody had the page open
    $stuck = q("SELECT ip.checkout_id FROM invoice_payments ip JOIN invoices i ON i.id = ip.invoice_id WHERE i.status = 'unpaid' AND ip.created_at > ?", [date('Y-m-d H:i:s', time() - 3 * 86400)])->fetchAll();
    foreach ($stuck as $p) {
        $r = mpesa_result($p['checkout_id']);
        if ($r && (int)$r['result_code'] === 0 && settle_payment($p['checkout_id'], $r) === 'paid') $summary[] = 'Settled a payment that was not marked paid';
    }

    // 3. Payment reminders: 3 days before, on the day, then 3, 7 and 14 days late
    $overdue = [];
    foreach (q("SELECT i.*, c.name FROM invoices i JOIN clients c ON c.id = i.client_id WHERE i.status = 'unpaid' AND i.due_date IS NOT NULL")->fetchAll() as $inv) {
        $late = days_between($inv['due_date'], $today);
        $stage = $late >= 14 ? 'late14' : ($late >= 7 ? 'late7' : ($late >= 3 ? 'late3' : ($late === 0 ? 'due' : ($late >= -3 && $late < 0 ? 'soon' : null))));
        if ($late > 0) $overdue[] = "{$inv['number']} · {$inv['name']} · KSh " . number_format((int)$inv['amount']) . " · $late days late";
        if (!$stage || !once('invoice', (int)$inv['id'], $stage)) continue;
        $amount = 'KSh ' . number_format((int)$inv['amount']);
        $when = $late < 0 ? 'is due on ' . date('j M', strtotime($inv['due_date'])) : ($late === 0 ? 'is due today' : "was due $late days ago");
        notify_client((int)$inv['client_id'], "Reminder: invoice {$inv['number']} $when",
            "A friendly reminder that invoice {$inv['number']} ({$inv['description']}, $amount) $when. You can pay it by M-Pesa in the portal in a few seconds. If you have already paid, please ignore this message or reply with the M-Pesa code.",
            "Marzley Tech: invoice {$inv['number']} ($amount) $when. Pay by M-Pesa at " . portal_url());
        $summary[] = "Reminder ($stage) for {$inv['number']}";
    }

    // 4. Approvals waiting on a client: a nudge every 3 days, at most 3 times
    foreach (q("SELECT a.*, p.client_id, p.title AS project FROM approvals a JOIN projects p ON p.id = a.project_id WHERE a.status = 'pending'")->fetchAll() as $a) {
        $age = days_between(substr($a['created_at'], 0, 10), $today);
        $n = min(3, intdiv($age, 3));
        if ($n < 1 || !once('approval', (int)$a['id'], "nudge$n")) continue;
        notify_client((int)$a['client_id'], "Waiting for your review: {$a['title']}",
            "“{$a['title']}” on your project “{$a['project']}” is still waiting for your review. Approving it (or telling us what to change) keeps your project on schedule.",
            'Marzley Tech: "' . mb_substr($a['title'], 0, 50) . '" is waiting for your review at ' . portal_url());
        $summary[] = "Approval nudge for “{$a['title']}”";
    }

    // 5. Support requests where the client has waited more than a day for us
    $waiting = [];
    foreach (q("SELECT t.id, t.subject, c.name FROM tickets t JOIN clients c ON c.id = t.client_id WHERE t.status = 'open'")->fetchAll() as $t) {
        $last = q('SELECT id, author, created_at FROM ticket_messages WHERE ticket_id = ? ORDER BY id DESC LIMIT 1', [$t['id']])->fetch();
        if ($last && $last['author'] === 'client' && strtotime($last['created_at']) < time() - 86400) $waiting[] = "“{$t['subject']}” from {$t['name']}";
    }

    // 6. One morning summary for the team, only when there is something to act on
    if ($overdue || $waiting || $summary) {
        $text = "Good morning. Here is today's summary from the client portal.\n";
        if ($overdue) $text .= "\nOverdue invoices:\n- " . implode("\n- ", $overdue) . "\n";
        if ($waiting) $text .= "\nSupport requests waiting more than a day for your reply:\n- " . implode("\n- ", $waiting) . "\n";
        if ($summary) $text .= "\nDone automatically this morning:\n- " . implode("\n- ", $summary) . "\n";
        notify_admins('Portal summary for ' . date('j M'), $text);
    }
    set_setting('last_cron', now());
    $log('daily: ' . count($summary) . ' actions, ' . count($overdue) . ' overdue, ' . count($waiting) . ' waiting');
}

function sql_value(PDO $pdo, $v): string {
    if ($v === null) return 'NULL';
    if (is_int($v) || is_float($v)) return (string)$v;
    return $pdo->quote((string)$v);
}

function run_backup(callable $log): void {
    $cfg = config();
    $dir = $cfg['backup_dir'];
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) throw new RuntimeException("Cannot create the backup folder $dir");
    @file_put_contents($dir . '/.htaccess', "Require all denied\n");
    $stamp = date('Y-m-d_His');
    $pdo = db();
    $sqlite = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';

    // Database: a .sql.gz file you can import in phpMyAdmin
    $dbFile = "$dir/portal-db-$stamp.sql.gz";
    $gz = gzopen($dbFile, 'wb6');
    if (!$gz) throw new RuntimeException("Cannot write $dbFile");
    gzwrite($gz, "-- Marzley Tech client portal backup, " . date('c') . "\n-- Restore: phpMyAdmin > your database > Import this file.\n");
    if (!$sqlite) gzwrite($gz, "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n");
    $tables = $sqlite
        ? $pdo->query("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")->fetchAll(PDO::FETCH_KEY_PAIR)
        : array_fill_keys($pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN), null);
    $rowsTotal = 0;
    foreach ($tables as $table => $create) {
        if (!$sqlite) $create = $pdo->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_NUM)[1];
        $qt = $sqlite ? "\"$table\"" : "`$table`";
        gzwrite($gz, "\nDROP TABLE IF EXISTS $qt;\n$create;\n");
        $st = $pdo->query("SELECT * FROM $qt");
        $batch = [];
        while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
            $batch[] = '(' . implode(', ', array_map(fn($v) => sql_value($pdo, $v), $row)) . ')';
            $rowsTotal++;
            if (count($batch) === 200) { gzwrite($gz, "INSERT INTO $qt VALUES\n" . implode(",\n", $batch) . ";\n"); $batch = []; }
        }
        if ($batch) gzwrite($gz, "INSERT INTO $qt VALUES\n" . implode(",\n", $batch) . ";\n");
    }
    if (!$sqlite) gzwrite($gz, "\nSET FOREIGN_KEY_CHECKS = 1;\n");
    gzclose($gz);
    @chmod($dbFile, 0600);

    // Uploaded client files
    $files = 0;
    $store = $cfg['storage_dir'];
    if (is_dir($store)) {
        $archive = "$dir/portal-files-$stamp.tar";
        $tar = new PharData($archive);
        foreach (new DirectoryIterator($store) as $f) {
            if ($f->isFile()) { $tar->addFile($f->getPathname(), $f->getFilename()); $files++; }
        }
        if ($files) { $tar->compress(Phar::GZ); unset($tar); @unlink($archive); @chmod("$archive.gz", 0600); }
        else { unset($tar); @unlink($archive); }
    }

    // Keep the last N days
    $keep = max(1, (int)$cfg['backup_keep_days']);
    foreach (glob("$dir/portal-*") as $old) {
        if (filemtime($old) < time() - $keep * 86400) @unlink($old);
    }
    set_setting('last_backup', now());
    audit('backup', "$rowsTotal rows, $files files", 'cron');
    $log("backup: $rowsTotal rows, $files files -> $dir");
}

try {
    if ($job === 'daily') run_daily($log);
    elseif ($job === 'backup') run_backup($log);
    else { fwrite(STDERR, "Usage: php cron.php daily|backup\n"); exit(2); }
} catch (Throwable $e) {
    report_error("scheduled job '$job'", $e->getMessage());
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}
