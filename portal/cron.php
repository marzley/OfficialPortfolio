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
// weekly: (also runs with daily on Mondays) a short progress email to learners active in the last 30 days.
// Automations (switch each off in the portal under Growth > Automations): review requests, lead follow-ups,
// quote follow-ups, notes pass reminders, monthly care reports, the weekly chat questions email and
// social post drafts run with daily; failed payment rescue runs with monitor (hourly).
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

    // 7. Automations
    $auto = run_daily_automations($log);
    $summary = array_merge($summary, $auto['done']);

    // 6. One morning summary for the team, only when there is something to act on
    if ($overdue || $waiting || $summary || $expiring || $auto['leads'] || $auto['quotes'] || $auto['social']) {
        $text = "Good morning. Here is today's summary from the client portal.\n";
        if ($overdue) $text .= "\nOverdue invoices:\n- " . implode("\n- ", $overdue) . "\n";
        if ($waiting) $text .= "\nSupport requests waiting more than a day for your reply:\n- " . implode("\n- ", $waiting) . "\n";
        if ($expiring) $text .= "\nDomains and hosting expiring within 30 days:\n- " . implode("\n- ", $expiring) . "\n";
        $newLeads = (int)q("SELECT COUNT(*) AS n FROM leads WHERE status = 'new'")->fetch()['n'];
        if ($newLeads) $text .= "\nNew leads waiting for a reply: $newLeads (Leads tab)\n";
        if ($auto['leads']) $text .= "\nLeads still “new” after 2 days (they got a follow-up email; give them a call):\n- " . implode("\n- ", $auto['leads']) . "\n";
        if ($auto['quotes']) $text .= "\nQuotes not accepted after 5 days (the client got a reminder; give them a call):\n- " . implode("\n- ", $auto['quotes']) . "\n";
        if ($auto['social']) $text .= "\nReady-to-post updates (copy and paste):\n\n" . implode("\n\n", $auto['social']) . "\n";
        if ($summary) $text .= "\nDone automatically this morning:\n- " . implode("\n- ", $summary) . "\n";
        notify_admins('Portal summary for ' . date('j M'), $text);
    }
    set_setting('last_cron', now());
    $log('daily: ' . count($summary) . ' actions, ' . count($overdue) . ' overdue, ' . count($waiting) . ' waiting');
}

/** The daily automations. Returns what was done, plus lists for the morning summary. */
function run_daily_automations(callable $log): array {
    $done = []; $leads = []; $quotes = []; $social = [];
    $ago = fn(int $days) => date('Y-m-d H:i:s', time() - $days * 86400);

    // Review requests: one rating reminder a week after going live; one Google request a week after a 4–5 star rating
    if (automation_on('review_requests')) {
        foreach (q('SELECT f.*, p.title FROM feedback f JOIN projects p ON p.id = f.project_id WHERE f.created_at <= ? AND f.created_at >= ?', [$ago(7), $ago(60)])->fetchAll() as $f) {
            if ($f['submitted_at'] === null) {
                if (!once('feedback', (int)$f['id'], 'rate_reminder')) continue;
                $link = portal_url() . 'feedback.php?t=' . $f['token'];
                notify_client((int)$f['client_id'], "Quick favour: how did we do on “{$f['title']}”?", "A week ago “{$f['title']}” went live. If you have 30 seconds, we’d love to know how we did:\n$link\n\nThank you!", "Marzley Tech: how did we do on {$f['title']}? Rate us in 30 seconds: $link", 'rate_project', ['{first}', $f['title'], $link]);
                $done[] = "Asked the client of “{$f['title']}” to rate the project";
            } elseif ((int)$f['rating'] >= 4 && strtotime($f['submitted_at']) <= time() - 7 * 86400 && ($g = google_write_url()) !== '') {
                if (!once('feedback', (int)$f['id'], 'google')) continue;
                notify_client((int)$f['client_id'], 'Would you share your review on Google?', "Thank you again for your kind rating of “{$f['title']}”. Reviews on Google help other businesses find us, and it only takes a minute:\n$g\n\nWe won’t ask again. Thank you!", "Marzley Tech: thank you for your rating! Would you share it on Google? $g", 'google_review', ['{first}', $g]);
                $done[] = "Asked the client of “{$f['title']}” for a Google review";
            }
        }
    }

    // Lead follow-ups: still "new" 2 days after the instant reply
    if (automation_on('lead_replies')) {
        foreach (q("SELECT l.* FROM leads l JOIN reminders r ON r.kind = 'lead_reply' AND r.ref_id = l.id WHERE l.status = 'new' AND l.created_at <= ? AND l.created_at >= ?", [$ago(2), $ago(10)])->fetchAll() as $l) {
            if (!once('lead_followup', (int)$l['id'], '1')) continue;
            $first = strtok($l['name'], ' ') ?: 'there';
            if ($l['email'] !== '') send_mail($l['email'], 'Following up on your enquiry', "Hello $first,\n\nJust following up on your message to Marzley Tech Solutions. If we haven’t connected yet, reply to this email or WhatsApp us on +254 745 789 590 and we’ll get you sorted: a quote, a call or a quick question answered.\n\nOur work: " . site_url('work') . "\nPrices: " . site_url('pricing') . "\n\nWe won’t email you about this again.\nKelvin Wanyoike · Marzley Tech Solutions", false);
            elseif ($l['phone'] !== '') send_phone($l['phone'], "Hello $first, following up on your message to Marzley Tech. Reply or WhatsApp 0745 789 590 for a quote or a quick answer.", 'lead_followup', [$first]);
            $leads[] = $l['name'] . ($l['phone'] !== '' ? " ({$l['phone']})" : '') . ' · ' . $l['source'];
        }
    }

    // Quote follow-ups: sent 5+ days ago, still not accepted, still valid
    if (automation_on('quote_followups')) {
        foreach (q("SELECT * FROM quotes WHERE status = 'sent' AND sent_at IS NOT NULL AND sent_at <= ? AND sent_at >= ? AND (valid_until IS NULL OR valid_until >= ?)", [$ago(5), $ago(30), date('Y-m-d')])->fetchAll() as $qt) {
            if (!once('quote', (int)$qt['id'], 'followup')) continue;
            $link = portal_url() . 'quote.php?t=' . $qt['token'];
            $first = strtok($qt['client_name'], ' ') ?: 'there';
            send_mail($qt['client_email'], "Your quote: {$qt['title']}", "Hello $first,\n\nJust checking in on your quote for “{$qt['title']}” (KSh " . number_format((int)$qt['total']) . ").\n\nView or accept it here: $link\n\nHappy to adjust anything, answer questions or jump on a call: reply here or WhatsApp +254 745 789 590.\n\nKelvin Wanyoike · Marzley Tech Solutions", false);
            if ($qt['client_phone'] !== '') send_phone($qt['client_phone'], "Marzley Tech: checking in on your quote for {$qt['title']}. View or accept: $link", 'quote_reminder', [$first, $qt['title'], $link]);
            $quotes[] = "{$qt['client_name']} · {$qt['title']} · KSh " . number_format((int)$qt['total']) . ($qt['client_phone'] !== '' ? " · {$qt['client_phone']}" : '');
        }
    }

    // Notes pass reminders: 3 days before the pass ends (SMS)
    if (automation_on('pass_reminders') && phone_ready()) {
        foreach (q("SELECT * FROM learn_note_payments WHERE status = 'paid' AND track_id = 0 AND bundle = '' AND pass_days > 0 AND paid_at >= ?", [$ago(120)])->fetchAll() as $p) {
            $ends = strtotime(notes_pass_expiry($p));
            if ($ends < time() + 2 * 86400 || $ends > time() + 3 * 86400) continue;
            if (!once('pass_expiry', (int)$p['id'], 'd3')) continue;
            send_phone($p['phone'], 'Marzley Tech: your notes pass ends on ' . date('j M', $ends) . '. Renew to keep downloading every subject’s PDF: ' . site_url('learn/?page=notes'), 'pass_ending', [date('j M', $ends), site_url('learn/?page=notes')]);
            $done[] = 'Reminded a notes pass buyer that their pass ends on ' . date('j M', $ends);
        }
    }

    // Monthly care reports (on the 1st, for last month)
    if (automation_on('care_reports') && date('j') === '1') $done = array_merge($done, run_care_reports($log));

    // Weekly chat questions (Mondays)
    if (automation_on('chat_digest') && date('N') === '1' && run_chat_digest()) $done[] = 'Sent the weekly chat questions email';

    // Social post drafts for new blog posts and new lessons
    if (automation_on('social_drafts')) $social = social_drafts();
    return ['done' => $done, 'leads' => $leads, 'quotes' => $quotes, 'social' => $social];
}

/** The questions the website chat couldn't answer in the last 7 days, emailed to the team once a week. */
function run_chat_digest(): bool {
    $qs = q('SELECT question, times FROM chat_questions WHERE last_at >= ? ORDER BY times DESC, last_at DESC LIMIT 15', [date('Y-m-d H:i:s', time() - 7 * 86400)])->fetchAll();
    if (!$qs || !once('chat_digest', 0, date('o-\WW'))) return false;
    notify_admins('This week’s chat questions (' . count($qs) . ')', "Questions visitors asked the website chat in the last 7 days that it couldn’t answer well:\n\n- " .
        implode("\n- ", array_map(fn($r) => $r['question'] . ($r['times'] > 1 ? " ({$r['times']}×)" : ''), $qs)) .
        "\n\nAdd answers to data/knowledge.json so the chat can answer next time, or turn a common question into a blog post. The full list is in the portal under Growth.");
    return true;
}

/** Last month's report for each client with a monitored website. */
function run_care_reports(callable $log): array {
    $from = date('Y-m-01', strtotime('first day of last month'));
    $to = date('Y-m-01');
    $month = date('F Y', strtotime($from));
    $done = [];
    foreach (q("SELECT DISTINCT client_id FROM domains WHERE monitor_url <> ''")->fetchAll() as $c) {
        $cid = (int)$c['client_id'];
        $lines = [];
        foreach (q("SELECT id, name, monitor_url FROM domains WHERE client_id = ? AND monitor_url <> ''", [$cid])->fetchAll() as $d) {
            $s = q('SELECT COUNT(*) AS checks, SUM(ok) AS ok, ROUND(AVG(ms)) AS ms FROM site_checks WHERE domain_id = ? AND checked_at >= ? AND checked_at < ?', [$d['id'], $from, $to])->fetch();
            if (!(int)$s['checks']) continue;
            $up = round(100 * (int)$s['ok'] / (int)$s['checks'], 2);
            $failed = (int)$s['checks'] - (int)$s['ok'];
            $lines[] = "{$d['name']}\n  Uptime: $up% (" . number_format((int)$s['checks']) . ' checks' . ($failed ? ", $failed failed" : ', none failed') . ")\n  Average response time: " . number_format((float)$s['ms'] / 1000, 2) . ' seconds';
        }
        if (!$lines || !once('care_report', $cid, substr($from, 0, 7))) continue;
        $opened = (int)q('SELECT COUNT(*) FROM tickets WHERE client_id = ? AND created_at >= ? AND created_at < ?', [$cid, $from, $to])->fetchColumn();
        $closed = (int)q("SELECT COUNT(*) FROM tickets WHERE client_id = ? AND status = 'closed' AND updated_at >= ? AND updated_at < ?", [$cid, $from, $to])->fetchColumn();
        $renew = q("SELECT name, kind, expires_on FROM domains WHERE client_id = ? AND expires_on BETWEEN ? AND ? ORDER BY expires_on", [$cid, date('Y-m-d'), date('Y-m-d', strtotime('+60 days'))])->fetchAll();
        $text = "Here is your website report for $month.\n\n" . implode("\n\n", $lines) .
            "\n\nSupport: $opened request" . ($opened === 1 ? '' : 's') . " opened, $closed resolved." .
            ($renew ? "\n\nComing up for renewal:\n- " . implode("\n- ", array_map(fn($r) => "{$r['name']} ({$r['kind']}) on " . date('j M Y', strtotime($r['expires_on'])), $renew)) : '') .
            "\n\nWe check your website every hour and get an alert if it goes down. Need a change or have a question? Open a support request in your portal or WhatsApp +254 745 789 590.";
        notify_client($cid, "Your website report for $month", $text);
        $done[] = "Sent the $month care report to client #$cid";
    }
    $log('care reports: ' . count($done));
    return $done;
}

/** Ready-to-paste posts for blog posts published in the last 3 days and lessons added since the last run (each only once). */
function social_drafts(): array {
    $out = [];
    $feed = @simplexml_load_file(site_root() . '/feed.xml');
    if ($feed && isset($feed->channel->item)) {
        foreach ($feed->channel->item as $it) {
            $when = strtotime((string)$it->pubDate);
            if (!$when || $when < time() - 3 * 86400 || $when > time() + 86400) continue;
            $title = trim((string)$it->title); $link = trim((string)$it->link); $desc = trim((string)$it->description);
            if (!once('social_post', crc32($link) & 0x7fffffff, 'post')) continue;
            $out[] = "NEW POST: $title\n" .
                "Google Business (Add update, button Learn more):\n$desc\n$link\n\n" .
                "Facebook:\n$title 👇\n\n$desc\n\nRead it here: $link\n\n#Kenya #MarzleyTech\n\n" .
                "WhatsApp Channel / Status:\nNew on our blog: $title\n$link";
        }
    }
    // New lessons: those with an id above the highest one already seen (the first run only remembers where we are)
    $max = (int)q('SELECT MAX(id) FROM learn_lessons')->fetchColumn();
    $seen = setting('social_lessons_seen');
    set_setting('social_lessons_seen', (string)$max);
    $rows = $seen === null ? [] : q('SELECT t.id, t.slug, t.title, COUNT(*) AS n FROM learn_lessons l JOIN learn_tracks t ON t.id = l.track_id WHERE l.published = 1 AND l.id > ? GROUP BY t.id, t.slug, t.title', [(int)$seen])->fetchAll();
    // A big import adds hundreds at once: that isn't news
    if ($rows && array_sum(array_column($rows, 'n')) <= 60) {
        foreach ($rows as $r) {
            if (!once('social_lessons', (int)$r['id'], date('Y-m-d'))) continue;
            $link = site_url('learn/?track=' . $r['slug']);
            $out[] = "NEW LESSONS: {$r['title']}\nFacebook / WhatsApp:\n📚 {$r['n']} new free lesson" . ($r['n'] == 1 ? '' : 's') . " in {$r['title']} on the Marzley Tech learning hub. Learn on your phone, practise as you go and get a certificate.\n$link";
        }
    }
    return $out;
}

/** Hourly: one "try again" message for M-Pesa payments that failed or weren't finished (at most one per phone a day). */
function run_payment_rescue(callable $log): void {
    if (!automation_on('pay_rescue')) return;
    $sent = 0;
    $recent = array_flip(q("SELECT p.phone FROM reminders r JOIN learn_note_payments p ON p.id = r.ref_id WHERE r.kind = 'pay_rescue' AND r.stage = 'notes' AND r.sent_at >= ?", [date('Y-m-d H:i:s', time() - 86400)])->fetchAll(PDO::FETCH_COLUMN));
    if (phone_ready()) {
        $rows = q("SELECT p.*, t.slug, t.title FROM learn_note_payments p LEFT JOIN learn_tracks t ON t.id = p.track_id
            WHERE p.status IN ('failed', 'pending') AND p.created_at BETWEEN ? AND ?", [date('Y-m-d H:i:s', time() - 6 * 3600), date('Y-m-d H:i:s', time() - 3600)])->fetchAll();
        foreach ($rows as $p) {
            if (isset($recent[$p['phone']])) continue;
            // Paid since (perhaps on a second try)? Then there is nothing to rescue
            if (q("SELECT id FROM learn_note_payments WHERE phone = ? AND status = 'paid' AND created_at >= ?", [$p['phone'], $p['created_at']])->fetch()) continue;
            if (!once('pay_rescue', (int)$p['id'], 'notes')) continue;
            if ((int)$p['track_id'] === 0) [$what, $link] = $p['bundle'] !== '' ? ['your notes bundle', site_url('learn/?page=notes')] : ['your notes pass', site_url('learn/?page=notes')];
            elseif ($p['product'] === 'revision') [$what, $link] = ["the {$p['title']} revision pack", site_url('learn/?page=revision')];
            else [$what, $link] = ["the {$p['title']} notes PDF", site_url('learn/?book=' . $p['slug'])];
            send_phone($p['phone'], "Marzley Tech: your M-Pesa payment for $what didn't go through. Try again here: $link (already paid? use \"Already paid\" with your M-Pesa code). Help: WhatsApp 0745789590", 'payment_retry', [$what, $link]);
            $recent[$p['phone']] = 1;
            $sent++;
        }
    }
    // Video unlocks: the learner has an account, so email them
    foreach (q("SELECT p.*, v.title, l.email, l.name FROM learn_payments p JOIN learn_videos v ON v.id = p.video_id JOIN learners l ON l.id = p.learner_id
        WHERE p.status IN ('failed', 'pending') AND p.created_at BETWEEN ? AND ?", [date('Y-m-d H:i:s', time() - 6 * 3600), date('Y-m-d H:i:s', time() - 3600)])->fetchAll() as $p) {
        if (q('SELECT id FROM learn_unlocks WHERE video_id = ? AND learner_id = ?', [$p['video_id'], $p['learner_id']])->fetch()) continue;
        if (q("SELECT r.id FROM reminders r JOIN learn_payments x ON x.id = r.ref_id WHERE r.kind = 'pay_rescue' AND r.stage = 'video' AND x.learner_id = ? AND r.sent_at >= ?", [$p['learner_id'], date('Y-m-d H:i:s', time() - 86400)])->fetch()) continue;
        if (!once('pay_rescue', (int)$p['id'], 'video')) continue;
        send_mail($p['email'], "Your video “{$p['title']}” is still waiting", 'Hello' . ($p['name'] !== '' ? ' ' . strtok($p['name'], ' ') : '') . ",\n\nYour M-Pesa payment to unlock “{$p['title']}” didn't go through (it may have been cancelled or timed out). You can try again here:\n" . site_url('learn/?video=' . $p['video_id']) .
            "\n\nAlready paid? Open the video and tap “Already paid” with your M-Pesa code. Need help? WhatsApp +254 745 789 590.\n\nMarzley Tech Solutions", false);
        $sent++;
    }
    if ($sent) $log("payment rescue: $sent");
}

function sql_value(PDO $pdo, $v): string {
    if ($v === null) return 'NULL';
    if (is_int($v) || is_float($v)) return (string)$v;
    return $pdo->quote((string)$v);
}

/** Monday mornings: a short progress email for learners active in the last 30 days (once a week each). */
function run_weekly_learning(callable $log): void {
    $week = date('o-\\WW');
    $sent = 0;
    foreach (q('SELECT id FROM learners WHERE weekly_email = 1 AND last_seen >= ?', [date('Y-m-d H:i:s', time() - 30 * 86400)])->fetchAll() as $r) {
        $m = learn_weekly_email((int)$r['id']);
        if (!$m || !once('learn_weekly', (int)$r['id'], $week)) continue;
        send_mail($m['to'], $m['subject'], $m['text'], false);
        $sent++;
    }
    $log("weekly learning emails: sent $sent");
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
    // One "try again" message for payments that failed in the last few hours
    run_payment_rescue($log);
    // Newsletter emails still waiting to go out
    $mailed = send_campaign_queue(300);
    if ($mailed) $log("newsletter: sent $mailed");
    set_setting('last_monitor', now());
    $log('monitor: checked ' . count($sites) . ' sites');
}

try {
    if ($job === 'monitor') run_monitor($log);
    elseif ($job === 'daily') { run_daily($log); if (date('N') === '1') run_weekly_learning($log); }
    elseif ($job === 'weekly') run_weekly_learning($log);
    elseif ($job === 'backup') run_backup($log);
    elseif ($job === 'care') run_care_reports($log);                       // send last month's care reports now
    elseif ($job === 'chat') $log(run_chat_digest() ? 'chat questions: sent' : 'chat questions: nothing to send');
    else { fwrite(STDERR, "Usage: php cron.php daily|backup|monitor|weekly|care|chat\n"); exit(2); }
} catch (Throwable $e) {
    report_error("scheduled job '$job'", $e->getMessage());
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}
