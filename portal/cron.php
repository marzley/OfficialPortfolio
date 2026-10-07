<?php
// Scheduled jobs for the client portal. Run from cPanel > Cron Jobs, never from a browser:
//
//   Every day at 07:00   php /home/USER/public_html/portal/cron.php daily
//   Every day at 02:30   php /home/USER/public_html/portal/cron.php backup
//   Every hour           php /home/USER/public_html/portal/cron.php monitor
//
// daily:  creates monthly (recurring) invoices, sends payment and approval reminders,
//         finishes any M-Pesa payments that were not settled, and alerts you about
//         support requests waiting more than a day.
// backup: saves the database and uploaded files to backup_dir (outside public_html),
//         copies them off-site if offsite_backup is set, and deletes backups older than backup_keep_days.
// monitor: checks every client website you monitor and emails you when one goes down or comes back.
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
            $due = date('Y-m-d', strtotime($next . ' +' . (int)$r['due_days'] . ' days'));
            $desc = $r['description'] . ' (' . date('F Y', strtotime($next)) . ')';
            [, $number] = create_invoice((int)$r['client_id'], $r['project_id'] ? (int)$r['project_id'] : null, $desc, (int)$r['amount'], $due);
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

    // 2b. Website payments (deposits, care plans) whose result came in but wasn't processed
    foreach (q("SELECT checkout_id FROM site_payments WHERE status = 'pending' AND created_at > ?", [date('Y-m-d H:i:s', time() - 3 * 86400)])->fetchAll() as $p) {
        $r = mpesa_result($p['checkout_id']);
        if ($r && settle_site_payment($p['checkout_id'], $r) === 'paid') $summary[] = 'Recorded a website payment that was not announced';
    }

    // 2c. Video unlocks whose result came in but wasn't processed
    foreach (q("SELECT checkout_id FROM learn_payments WHERE status = 'pending' AND created_at > ?", [date('Y-m-d H:i:s', time() - 3 * 86400)])->fetchAll() as $p) {
        $r = mpesa_result($p['checkout_id']);
        if ($r) settle_learn_payment($p['checkout_id'], $r);
    }

    // 2d. Course-notes PDF payments whose result came in but wasn't processed
    foreach (q("SELECT checkout_id FROM learn_note_payments WHERE status = 'pending' AND created_at > ?", [date('Y-m-d H:i:s', time() - 3 * 86400)])->fetchAll() as $p) {
        $r = mpesa_result($p['checkout_id']);
        if ($r) settle_note_payment($p['checkout_id'], $r);
    }

    // 3. Payment reminders: 3 days before, on the day, then 3, 7 and 14 days late
    $overdue = [];
    foreach (q("SELECT i.*, c.name FROM invoices i JOIN clients c ON c.id = i.client_id WHERE i.status = 'unpaid' AND i.due_date IS NOT NULL")->fetchAll() as $inv) {
        $late = days_between($inv['due_date'], $today);
        $stage = $late >= 14 ? 'late14' : ($late >= 7 ? 'late7' : ($late >= 3 ? 'late3' : ($late === 0 ? 'due' : ($late >= -3 && $late < 0 ? 'soon' : null))));
        if ($late > 0) $overdue[] = "{$inv['number']} · {$inv['name']} · KSh " . number_format(invoice_balance($inv)) . " · $late days late";
        if (!$stage || !once('invoice', (int)$inv['id'], $stage)) continue;
        $amount = 'KSh ' . number_format(invoice_balance($inv)) . ((int)$inv['amount_paid'] > 0 ? ' balance' : '');
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

    // 4b. Domain, hosting and SSL renewals: remind 30 and 7 days before, invoice at 30 days
    $expiring = [];
    foreach (q('SELECT d.*, c.name AS client FROM domains d JOIN clients c ON c.id = d.client_id WHERE d.expires_on <= ?', [date('Y-m-d', strtotime('+30 days'))])->fetchAll() as $dm) {
        $left = days_between($today, $dm['expires_on']);
        $what = ['domain' => 'domain', 'hosting' => 'hosting', 'ssl' => 'SSL certificate', 'email' => 'email service', 'other' => 'service'][$dm['kind']] ?? 'service';
        $expiring[] = "{$dm['name']} ($what) · {$dm['client']} · " . ($left < 0 ? 'EXPIRED ' . -$left . ' days ago' : "expires in $left days");
        $cycle = $dm['expires_on'];
        if ($left <= 30 && $left > 7 && once('domain', (int)$dm['id'], "30:$cycle")) {
            $inv = null;
            if ((int)$dm['auto_invoice'] && (int)$dm['renew_price'] > 0) {
                [, $inv] = create_invoice((int)$dm['client_id'], null, "Renewal: {$dm['name']} $what for 1 year (expires " . date('j M Y', strtotime($cycle)) . ')', (int)$dm['renew_price'], date('Y-m-d', strtotime($cycle . ' -7 days')), 'unpaid', false);
                $summary[] = "Renewal invoice $inv for {$dm['name']}";
            }
            notify_client((int)$dm['client_id'], "Your $what {$dm['name']} renews on " . date('j M', strtotime($cycle)),
                "Your $what “{$dm['name']}” expires on " . date('j F Y', strtotime($cycle)) . '. ' .
                ($inv ? "We’ve sent renewal invoice $inv (KSh " . number_format((int)$dm['renew_price']) . "). Please pay it before the date so your website and email keep working." : 'We’ll take care of the renewal; contact us if anything has changed.'),
                "Marzley Tech: {$dm['name']} expires " . date('j M', strtotime($cycle)) . '.' . ($inv ? " Renewal invoice $inv KSh " . number_format((int)$dm['renew_price']) . '.' : '') . ' ' . portal_url());
        } elseif ($left <= 7 && $left >= 0 && once('domain', (int)$dm['id'], "7:$cycle")) {
            notify_client((int)$dm['client_id'], "Reminder: {$dm['name']} expires in $left days",
                "Your $what “{$dm['name']}” expires on " . date('j F Y', strtotime($cycle)) . '. If it isn’t renewed in time your website or email may stop working. Please pay the renewal invoice in the portal, or contact us.',
                "Marzley Tech: {$dm['name']} expires in $left days. Please renew: " . portal_url());
            $summary[] = "7-day renewal reminder for {$dm['name']}";
        }
    }

    // 5. Support requests where the client has waited more than a day for us
    $waiting = [];
    foreach (q("SELECT t.id, t.subject, c.name FROM tickets t JOIN clients c ON c.id = t.client_id WHERE t.status = 'open'")->fetchAll() as $t) {
        $last = q('SELECT id, author, created_at FROM ticket_messages WHERE ticket_id = ? ORDER BY id DESC LIMIT 1', [$t['id']])->fetch();
        if ($last && $last['author'] === 'client' && strtotime($last['created_at']) < time() - 86400) $waiting[] = "“{$t['subject']}” from {$t['name']}";
    }

    // 6. One morning summary for the team, only when there is something to act on
    if ($overdue || $waiting || $summary || $expiring) {
        $text = "Good morning. Here is today's summary from the client portal.\n";
        if ($overdue) $text .= "\nOverdue invoices:\n- " . implode("\n- ", $overdue) . "\n";
        if ($waiting) $text .= "\nSupport requests waiting more than a day for your reply:\n- " . implode("\n- ", $waiting) . "\n";
        if ($expiring) $text .= "\nDomains and hosting expiring within 30 days:\n- " . implode("\n- ", $expiring) . "\n";
        $newLeads = (int)q("SELECT COUNT(*) AS n FROM leads WHERE status = 'new'")->fetch()['n'];
        if ($newLeads) $text .= "\nNew leads waiting for a reply: $newLeads (Leads tab)\n";
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

    // Off-site copy, so a server failure can't take the backups with it
    if (!empty($cfg['offsite_backup']['bucket'])) {
        $prefix = trim((string)($cfg['offsite_backup']['prefix'] ?? 'marzley-portal'), '/');
        foreach (glob("$dir/portal-*-$stamp.*") as $f) s3_put($cfg['offsite_backup'], "$prefix/" . basename($f), $f);
        set_setting('last_offsite', now());
        $log('backup: copied off-site to ' . $cfg['offsite_backup']['bucket']);
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

/** Check each monitored client website. Alerts when a site is down twice in a row, and when it recovers. */
function run_monitor(callable $log): void {
    $sites = q("SELECT d.*, c.name AS client FROM domains d JOIN clients c ON c.id = d.client_id WHERE d.monitor_url <> ''")->fetchAll();
    foreach ($sites as $s) {
        $start = microtime(true);
        $ch = curl_init($s['monitor_url']);
        curl_setopt_array($ch, [CURLOPT_NOBODY => false, CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 5,
            CURLOPT_TIMEOUT => 20, CURLOPT_CONNECTTIMEOUT => 10, CURLOPT_RANGE => '0-2047', CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
            CURLOPT_USERAGENT => 'MarzleyTech-Monitor/1.0 (+https://marzleytechsolutions.co.ke)']);
        curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $ms = (int)round((microtime(true) - $start) * 1000);
        $ok = $code >= 200 && $code < 400 ? 1 : 0;
        q('INSERT INTO site_checks (domain_id, ok, ms, code, checked_at) VALUES (?, ?, ?, ?, ?)', [$s['id'], $ok, $ms, $code, now()]);
        $prev = q('SELECT ok FROM site_checks WHERE domain_id = ? ORDER BY id DESC LIMIT 1 OFFSET 1', [$s['id']])->fetch();
        if (!$ok && $prev && !(int)$prev['ok'] && $s['last_status'] !== 'down') {
            q("UPDATE domains SET last_status = 'down', down_since = ? WHERE id = ?", [now(), $s['id']]);
            notify_admins("DOWN: {$s['name']}", "{$s['monitor_url']} ({$s['client']}) is not responding (HTTP " . ($code ?: 'no answer') . ") on two checks in a row.");
        } elseif ($ok && $s['last_status'] === 'down') {
            $mins = $s['down_since'] ? (int)round((time() - strtotime($s['down_since'])) / 60) : 0;
            q("UPDATE domains SET last_status = 'up', down_since = NULL WHERE id = ?", [$s['id']]);
            notify_admins("Back up: {$s['name']}", "{$s['monitor_url']} ({$s['client']}) is working again after about $mins minutes.");
        } elseif ($ok && $s['last_status'] === '') {
            q("UPDATE domains SET last_status = 'up' WHERE id = ?", [$s['id']]);
        }
    }
    // Keep 13 months of checks for the care reports
    q('DELETE FROM site_checks WHERE checked_at < ?', [date('Y-m-d', strtotime('-13 months'))]);
    // Newsletter emails still waiting to go out
    $mailed = send_campaign_queue(300);
    if ($mailed) $log("newsletter: sent $mailed");
    set_setting('last_monitor', now());
    $log('monitor: checked ' . count($sites) . ' sites');
}

try {
    if ($job === 'monitor') run_monitor($log);
    elseif ($job === 'daily') run_daily($log);
    elseif ($job === 'backup') run_backup($log);
    else { fwrite(STDERR, "Usage: php cron.php daily|backup|monitor\n"); exit(2); }
} catch (Throwable $e) {
    report_error("scheduled job '$job'", $e->getMessage());
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}
