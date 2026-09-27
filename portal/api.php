<?php
// Client portal API. All responses are JSON except file downloads.
define('MARZLEY_PORTAL', true);
require __DIR__ . '/lib.php';

install_error_alerts('client portal');
start_session();
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Activity log: every change that succeeds is recorded with who made it
if ($method === 'POST' && !in_array($action, ['login', 'dev_login', 'logout', 'logout_all'], true)) {
    register_shutdown_function(function () use ($action) {
        if (http_response_code() !== 200 || !current_user()) return;
        $d = $action === 'file_upload' ? $_POST + ['name' => $_FILES['file']['name'] ?? ''] : body();
        $keep = ['type', 'id', 'name', 'email', 'title', 'subject', 'status', 'decision', 'amount', 'total', 'description', 'client_id', 'project_id', 'invoice_id', 'ticket_id', 'course_id', 'lesson_id', 'done', 'active'];
        $parts = [];
        foreach ($keep as $k) if (isset($d[$k]) && $d[$k] !== '' && !is_array($d[$k])) $parts[] = "$k=" . mb_substr((string)$d[$k], 0, 80);
        audit($action, implode(', ', $parts));
    });
}

// Every change needs POST with the session's CSRF token (sign-in gets one afterwards).
if ($method === 'POST' && !in_array($action, ['login', 'dev_login'], true)) check_csrf();
if ($method !== 'POST' && !in_array($action, ['me', 'data', 'download', 'payment_status', 'export', 'proof'], true)) fail(405, 'Use POST.');

switch ($action) {

    // ---------- sign-in ----------

    case 'me':
        $u = current_user();
        out(['user' => $u, 'csrf' => $u ? csrf_token() : null, 'google_client_id' => config()['google_client_id'],
            'staging' => is_staging(), 'expired' => $u ? null : expired_message()]);

    case 'login':
        $token = (string)(body()['credential'] ?? '');
        if ($token === '') fail(400, 'Missing Google sign-in.');
        $claims = verify_google_token($token);
        $user = sign_in($claims['email'], $claims['name'] ?? '');
        out(['user' => $user, 'csrf' => csrf_token()]);

    case 'dev_login':
        // Local testing only: needs dev_login in the config AND PHP's built-in server on this computer.
        if (empty(config()['dev_login']) || PHP_SAPI !== 'cli-server' || !in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) fail(404, 'Not found.');
        $user = sign_in((string)(body()['email'] ?? ''), 'Test user');
        out(['user' => $user, 'csrf' => csrf_token()]);

    case 'logout':
        if ($u = current_user()) audit('sign_out', '', $u['email']);
        $_SESSION = [];
        session_regenerate_id(true);
        out(['ok' => true]);

    case 'logout_all':
        // Sign this person out on every phone and computer, including this one
        $u = require_user();
        set_setting('epoch:' . strtolower($u['email']), (string)(session_epoch($u['email']) + 1));
        audit('sign_out_everywhere', '', $u['email']);
        $_SESSION = [];
        session_regenerate_id(true);
        out(['ok' => true]);

    // ---------- reading ----------

    case 'data':
        $u = require_user();
        $team = is_team($u);
        $money = can($u, 'money');
        $all = fn($perm) => can($u, $perm);
        if ($team) {
            $clients = q('SELECT id, name, email, phone, created_at FROM clients ORDER BY name')->fetchAll();
            $projects = q('SELECT * FROM projects ORDER BY updated_at DESC')->fetchAll();
            $invoices = $money ? q('SELECT * FROM invoices ORDER BY created_at DESC')->fetchAll() : [];
        } else {
            $clients = [];
            $projects = q('SELECT * FROM projects WHERE client_id = ? ORDER BY updated_at DESC', [$u['client_id']])->fetchAll();
            $invoices = q("SELECT * FROM invoices WHERE client_id = ? AND status <> 'cancelled' ORDER BY created_at DESC", [$u['client_id']])->fetchAll();
        }
        $ids = array_map(fn($p) => (int)$p['id'], $projects) ?: [0];
        $marks = implode(',', array_fill(0, count($ids), '?'));
        $updates = q("SELECT * FROM updates WHERE project_id IN ($marks) ORDER BY created_at DESC", $ids)->fetchAll();
        $files = q("SELECT id, project_id, original_name, size, uploaded_by, created_at FROM files WHERE project_id IN ($marks) ORDER BY created_at DESC", $ids)->fetchAll();
        $approvals = q("SELECT * FROM approvals WHERE project_id IN ($marks) ORDER BY created_at DESC", $ids)->fetchAll();
        $invIds = array_map(fn($i) => (int)$i['id'], $invoices) ?: [0];
        $imarks = implode(',', array_fill(0, count($invIds), '?'));
        $payments = q("SELECT id, invoice_id, amount, method, reference, status, note, proof_file IS NOT NULL AS has_proof, created_by, created_at, decided_at FROM payments WHERE invoice_id IN ($imarks) ORDER BY id DESC", $invIds)->fetchAll();
        if ($team) {
            $tickets = $all('support') ? q('SELECT * FROM tickets ORDER BY status DESC, updated_at DESC')->fetchAll() : [];
            $courses = $all('courses') ? q('SELECT * FROM courses ORDER BY title')->fetchAll() : [];
            $enrollments = $all('courses') ? q('SELECT * FROM enrollments')->fetchAll() : [];
            $progress = $all('courses') ? q('SELECT client_id, lesson_id FROM lesson_progress')->fetchAll() : [];
            $certificates = $all('courses') ? q('SELECT * FROM certificates')->fetchAll() : [];
            $domains = $money ? q('SELECT * FROM domains ORDER BY expires_on')->fetchAll() : [];
            $me = ['perms' => $u['role'] === 'admin' ? array_keys(STAFF_PERMS) : ($u['perms'] ?? []), 'owner' => $u['role'] === 'admin'];
        } else {
            $cid = $u['client_id'];
            $tickets = q('SELECT * FROM tickets WHERE client_id = ? ORDER BY updated_at DESC', [$cid])->fetchAll();
            $courses = q('SELECT c.* FROM courses c JOIN enrollments e ON e.course_id = c.id WHERE e.client_id = ? ORDER BY c.title', [$cid])->fetchAll();
            $enrollments = q('SELECT * FROM enrollments WHERE client_id = ?', [$cid])->fetchAll();
            $progress = q('SELECT client_id, lesson_id FROM lesson_progress WHERE client_id = ?', [$cid])->fetchAll();
            $certificates = q('SELECT * FROM certificates WHERE client_id = ?', [$cid])->fetchAll();
            $domains = q('SELECT id, client_id, name, kind, expires_on, renew_price, monitor_url, last_status FROM domains WHERE client_id = ? ORDER BY expires_on', [$cid])->fetchAll();
            $row = q('SELECT name, email, phone FROM clients WHERE id = ?', [$cid])->fetch();
            $code = $row ? referral_code((string)$row['phone']) : null;
            $fb = q('SELECT f.token, p.title FROM feedback f JOIN projects p ON p.id = f.project_id WHERE f.client_id = ? AND f.submitted_at IS NULL ORDER BY f.id DESC LIMIT 1', [$cid])->fetch();
            $me = ['name' => $row['name'] ?? '', 'email' => $row['email'] ?? '', 'phone' => $row['phone'] ?? '',
                   'referral_link' => $code ? rtrim(config()['site_url'] ?? 'https://marzleytechsolutions.co.ke', '/') . '/?ref=' . $code : null,
                   'feedback' => $fb ? ['link' => portal_url() . 'feedback.php?t=' . $fb['token'], 'title' => $fb['title']] : null,
                   'card' => (bool)paystack()];
        }
        // Monthly uptime for each monitored site (care reports)
        $dids = array_map(fn($d) => (int)$d['id'], $domains) ?: [0];
        $dmarks = implode(',', array_fill(0, count($dids), '?'));
        $uptime = q("SELECT domain_id, substr(checked_at, 1, 7) AS month, COUNT(*) AS checks, SUM(ok) AS ok, ROUND(AVG(ms)) AS avg_ms FROM site_checks WHERE domain_id IN ($dmarks) AND checked_at >= ? GROUP BY domain_id, substr(checked_at, 1, 7)",
            array_merge($dids, [date('Y-m-01', strtotime('-5 months'))]))->fetchAll();
        $tids = array_map(fn($t) => (int)$t['id'], $tickets) ?: [0];
        $tmarks = implode(',', array_fill(0, count($tids), '?'));
        $messages = q("SELECT * FROM ticket_messages WHERE ticket_id IN ($tmarks) ORDER BY created_at", $tids)->fetchAll();
        $cids = array_map(fn($c) => (int)$c['id'], $courses) ?: [0];
        $cmarks = implode(',', array_fill(0, count($cids), '?'));
        $lessons = q("SELECT * FROM lessons WHERE course_id IN ($cmarks) ORDER BY course_id, position, id", $cids)->fetchAll();
        $cfg = config();
        $org = ['name' => $cfg['business_name'], 'kra_pin' => $cfg['kra_pin'], 'etims' => (bool)$cfg['etims']];
        $extra = [];
        if ($team) {
            $extra['recurring'] = $money ? q('SELECT * FROM recurring_invoices ORDER BY active DESC, next_date')->fetchAll() : [];
            $extra['quotes'] = $money ? q('SELECT * FROM quotes ORDER BY id DESC')->fetchAll() : [];
            $extra['leads'] = $all('leads') ? q('SELECT * FROM leads ORDER BY updated_at DESC')->fetchAll() : [];
            $extra['feedback'] = q('SELECT project_id, rating, comment, submitted_at FROM feedback WHERE submitted_at IS NOT NULL ORDER BY submitted_at DESC')->fetchAll();
            if ($u['role'] === 'admin') {
                $extra['audit'] = q('SELECT * FROM audit_log ORDER BY id DESC LIMIT 300')->fetchAll();
                $extra['staff'] = q('SELECT id, email, name, perms, created_at FROM staff ORDER BY name')->fetchAll();
                $extra['system'] = [
                    'last_cron' => setting('last_cron'), 'last_backup' => setting('last_backup'), 'last_offsite' => setting('last_offsite'), 'last_monitor' => setting('last_monitor'),
                    'offsite' => !empty($cfg['offsite_backup']['bucket']), 'paystack' => (bool)paystack(),
                    'sms' => !empty($cfg['sms']['api_key']), 'smtp' => !empty($cfg['smtp']['host']), 'mpesa' => (bool)mpesa_config(),
                    'staging' => is_staging(), 'idle_minutes' => (int)$cfg['admin_idle_minutes'],
                ];
            }
        }
        out(compact('clients', 'projects', 'updates', 'invoices', 'payments', 'files', 'approvals', 'tickets', 'messages',
            'courses', 'lessons', 'enrollments', 'progress', 'certificates', 'domains', 'uptime', 'me', 'org') + $extra);

    case 'download':
        $u = require_user();
        $f = q('SELECT f.*, p.client_id FROM files f JOIN projects p ON p.id = f.project_id WHERE f.id = ?', [(int)($_GET['id'] ?? 0)])->fetch();
        if (!$f || (is_team($u) ? !can($u, 'projects') : (int)$f['client_id'] !== $u['client_id'])) fail(404, 'File not found.');
        $path = config()['storage_dir'] . '/' . basename($f['stored_name']);
        if (!is_file($path)) fail(404, 'File not found.');
        header('Content-Type: application/octet-stream');
        header('Content-Length: ' . filesize($path));
        header('Content-Disposition: attachment; filename="' . str_replace(['"', "\r", "\n"], '', $f['original_name']) . '"; filename*=UTF-8\'\'' . rawurlencode($f['original_name']));
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: private, no-store');
        readfile($path);
        exit;

    // ---------- admin: clients, projects, updates, invoices, files ----------

    case 'client_save':
        require_perm('clients');
        $d = body();
        $name = str_in($d, 'name', 120);
        $email = strtolower(str_in($d, 'email', 190));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Please enter a valid email.');
        $phone = str_in($d, 'phone', 30, false);
        $id = (int)($d['id'] ?? 0);
        $dupe = q('SELECT id FROM clients WHERE email = ? AND id <> ?', [$email, $id])->fetch();
        if ($dupe) fail(400, 'A client with that email already exists.');
        if (in_array($email, config()['admin_emails'], true) || q('SELECT id FROM staff WHERE email = ?', [$email])->fetch()) fail(400, 'That email belongs to your team. Clients need their own Google account.');
        if ($id) q('UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?', [$name, $email, $phone, $id]);
        else q('INSERT INTO clients (name, email, phone, created_at) VALUES (?, ?, ?, ?)', [$name, $email, $phone, now()]);
        out(['ok' => true]);

    case 'project_save':
        require_perm('projects');
        $d = body();
        $clientId = (int)($d['client_id'] ?? 0);
        if (!q('SELECT id FROM clients WHERE id = ?', [$clientId])->fetch()) fail(400, 'Choose a client.');
        $title = str_in($d, 'title', 160);
        $status = (string)($d['status'] ?? 'planning');
        if (!in_array($status, PROJECT_STATUSES, true)) fail(400, 'Unknown status.');
        $progress = int_in($d, 'progress', 0, 100);
        $due = date_in($d, 'due_date');
        $summary = str_in($d, 'summary', 2000, false);
        $id = (int)($d['id'] ?? 0);
        $was = $id ? (q('SELECT status FROM projects WHERE id = ?', [$id])->fetch()['status'] ?? null) : null;
        if ($id) q('UPDATE projects SET client_id = ?, title = ?, status = ?, progress = ?, due_date = ?, summary = ?, updated_at = ? WHERE id = ?',
            [$clientId, $title, $status, $progress, $due, $summary, now(), $id]);
        else q('INSERT INTO projects (client_id, title, status, progress, due_date, summary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [$clientId, $title, $status, $progress, $due, $summary, now(), now()]);
        // Just went live: ask the client how we did
        if ($id && $status === 'live' && $was !== 'live') request_feedback($id);
        out(['ok' => true]);

    case 'update_add':
        require_perm('projects');
        $d = body();
        $pid = (int)($d['project_id'] ?? 0);
        if (!q('SELECT id FROM projects WHERE id = ?', [$pid])->fetch()) fail(400, 'Choose a project.');
        $message = str_in($d, 'message', 2000);
        q('INSERT INTO updates (project_id, message, created_at) VALUES (?, ?, ?)', [$pid, $message, now()]);
        q('UPDATE projects SET updated_at = ? WHERE id = ?', [now(), $pid]);
        if ($pc = client_of_project($pid)) notify_client((int)$pc['client_id'], 'New update on ' . $pc['title'], "There's a new update on your project “{$pc['title']}”:\n\n$message",
            'Marzley Tech: new update on ' . mb_substr($pc['title'], 0, 60) . '. See it at ' . portal_url());
        out(['ok' => true]);

    case 'invoice_save':
        $u = require_perm('money');
        $d = body();
        $clientId = (int)($d['client_id'] ?? 0);
        if (!q('SELECT id FROM clients WHERE id = ?', [$clientId])->fetch()) fail(400, 'Choose a client.');
        $projectId = (int)($d['project_id'] ?? 0) ?: null;
        if ($projectId && !q('SELECT id FROM projects WHERE id = ? AND client_id = ?', [$projectId, $clientId])->fetch()) fail(400, 'That project belongs to another client.');
        $desc = str_in($d, 'description', 300);
        $amount = int_in($d, 'amount', 1, 10000000);
        $status = (string)($d['status'] ?? 'unpaid');
        if (!in_array($status, INVOICE_STATUSES, true)) fail(400, 'Unknown status.');
        $due = date_in($d, 'due_date');
        $id = (int)($d['id'] ?? 0);
        if ($id) {
            $old = q('SELECT * FROM invoices WHERE id = ?', [$id])->fetch();
            if (!$old) fail(404, 'Invoice not found.');
            if ($amount < (int)$old['amount_paid']) fail(400, 'The amount can’t be less than what has already been paid (KSh ' . number_format((int)$old['amount_paid']) . ').');
            q('UPDATE invoices SET client_id = ?, project_id = ?, description = ?, amount = ?, due_date = ? WHERE id = ?', [$clientId, $projectId, $desc, $amount, $due, $id]);
            if ($status === 'paid' && $old['status'] !== 'paid') {
                // Marked paid by hand: record the balance as a manual payment (and send the receipt)
                $bal = $amount - (int)$old['amount_paid'];
                if ($bal > 0) apply_payment($id, $bal, 'manual', '', $u['email']);
                else q("UPDATE invoices SET status = 'paid', paid_at = ? WHERE id = ?", [now(), $id]);
            } elseif ($status !== 'paid') {
                q('UPDATE invoices SET status = ?, paid_at = NULL WHERE id = ?', [$status, $id]);
                // Became larger than what was paid, e.g. after a correction
                if ($status === 'unpaid' && $amount <= (int)$old['amount_paid']) q("UPDATE invoices SET status = 'paid', paid_at = ? WHERE id = ?", [now(), $id]);
            }
        } else {
            [, $number] = create_invoice($clientId, $projectId, $desc, $amount, $due, $status);
            out(['ok' => true, 'number' => $number]);
        }
        out(['ok' => true]);

    case 'file_upload':
        $u = require_user();
        $pid = (int)($_POST['project_id'] ?? 0);
        $proj = q('SELECT id, client_id, title FROM projects WHERE id = ?', [$pid])->fetch();
        if (is_team($u)) require_perm('projects');
        elseif (!$proj || (int)$proj['client_id'] !== $u['client_id']) fail(404, 'Choose one of your projects.');
        if (!$proj) fail(400, 'Choose a project.');
        if (!is_team($u) && (int)q('SELECT COUNT(*) AS n FROM files WHERE project_id = ? AND uploaded_by = ? AND created_at > ?', [$pid, 'client', date('Y-m-d H:i:s', time() - 3600)])->fetch()['n'] >= 30) fail(429, 'That’s a lot of files in one hour. Please send the rest as a ZIP.');
        [$stored, $name, $size] = store_upload($_FILES['file'] ?? ['error' => UPLOAD_ERR_NO_FILE, 'size' => 0, 'name' => '']);
        q('INSERT INTO files (project_id, original_name, stored_name, size, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?)', [$pid, $name, $stored, $size, is_team($u) ? 'admin' : 'client', now()]);
        if (is_team($u)) notify_client((int)$proj['client_id'], 'New file on ' . $proj['title'], "A new file, “{$name}”, was added to your project “{$proj['title']}”.");
        else notify_admins("{$u['name']} uploaded a file", "{$u['name']} added “{$name}” to “{$proj['title']}”. Open the portal to download it.");
        out(['ok' => true]);

    case 'delete':
        $d = body();
        $id = (int)($d['id'] ?? 0);
        $need = ['update' => 'projects', 'file' => 'projects', 'approval' => 'projects', 'invoice' => 'money', 'recurring' => 'money', 'quote' => 'money',
                 'domain' => 'money', 'lesson' => 'courses', 'enrollment' => 'courses', 'lead' => 'leads', 'staff' => 'owner'][$d['type'] ?? ''] ?? null;
        if (!$need) fail(400, 'Unknown item.');
        $need === 'owner' ? require_admin() : require_perm($need);
        switch ($d['type']) {
            case 'update': q('DELETE FROM updates WHERE id = ?', [$id]); break;
            case 'approval': q('DELETE FROM approvals WHERE id = ?', [$id]); break;
            case 'lesson': q('DELETE FROM lessons WHERE id = ?', [$id]); break;
            case 'enrollment': q('DELETE FROM enrollments WHERE id = ?', [$id]); break;
            case 'recurring': q('DELETE FROM recurring_invoices WHERE id = ?', [$id]); break;
            case 'quote': q('DELETE FROM quotes WHERE id = ?', [$id]); break;
            case 'domain': q('DELETE FROM site_checks WHERE domain_id = ?', [$id]); q('DELETE FROM domains WHERE id = ?', [$id]); break;
            case 'lead': q('DELETE FROM leads WHERE id = ?', [$id]); break;
            case 'staff':
                $st = q('SELECT email FROM staff WHERE id = ?', [$id])->fetch();
                q('DELETE FROM staff WHERE id = ?', [$id]);
                if ($st) set_setting('epoch:' . $st['email'], (string)(session_epoch($st['email']) + 1)); // signed out at once
                break;
            case 'invoice':
                if ((int)(q('SELECT amount_paid FROM invoices WHERE id = ?', [$id])->fetch()['amount_paid'] ?? 0) > 0) fail(400, 'This invoice has payments recorded. Cancel it instead of deleting it, so your records stay complete.');
                q('DELETE FROM payments WHERE invoice_id = ?', [$id]);
                q('DELETE FROM invoices WHERE id = ?', [$id]);
                break;
            case 'file':
                $f = q('SELECT stored_name FROM files WHERE id = ?', [$id])->fetch();
                if ($f) @unlink(config()['storage_dir'] . '/' . basename($f['stored_name']));
                q('DELETE FROM files WHERE id = ?', [$id]);
                break;
            default: fail(400, 'Unknown item.');
        }
        out(['ok' => true]);

    // ---------- approvals ----------

    case 'approval_request':
        $u = require_perm('projects');
        $d = body();
        $pid = (int)($d['project_id'] ?? 0);
        $pc = client_of_project($pid);
        if (!$pc) fail(400, 'Choose a project.');
        $title = str_in($d, 'title', 160);
        // Staged billing: approving this stage creates an invoice for this amount
        $bill = isset($d['bill_amount']) && $d['bill_amount'] !== '' && $d['bill_amount'] !== null ? int_in($d, 'bill_amount', 0, 10000000) : 0;
        if ($bill > 0 && !can($u, 'money')) fail(403, 'Only people with access to invoices can attach a payment to an approval.');
        q('INSERT INTO approvals (project_id, title, details, status, bill_amount, created_at) VALUES (?, ?, ?, ?, ?, ?)', [$pid, $title, str_in($d, 'details', 2000, false), 'pending', $bill ?: null, now()]);
        notify_client((int)$pc['client_id'], 'Please review: ' . $title, "“{$title}” on your project “{$pc['title']}” is ready for your review. Approve it or request changes in the portal." .
            ($bill ? "\n\nWhen you approve, the stage payment of KSh " . number_format($bill) . " will be invoiced." : ''));
        out(['ok' => true]);

    case 'approval_decide':
        $u = require_user();
        $d = body();
        $a = q("SELECT a.*, p.client_id, p.title AS project FROM approvals a JOIN projects p ON p.id = a.project_id WHERE a.id = ? AND a.status = 'pending'", [(int)($d['id'] ?? 0)])->fetch();
        if (!$a || (is_team($u) ? !can($u, 'projects') : (int)$a['client_id'] !== $u['client_id'])) fail(404, 'Nothing to review.');
        $decision = (string)($d['decision'] ?? '');
        if (!in_array($decision, ['approved', 'changes'], true)) fail(400, 'Choose approve or request changes.');
        $note = str_in($d, 'note', 2000, $decision === 'changes');
        $changed = q("UPDATE approvals SET status = ?, client_note = ?, decided_at = ? WHERE id = ? AND status = 'pending'", [$decision, $note, now(), $a['id']])->rowCount();
        if ($changed && $decision === 'approved' && (int)$a['bill_amount'] > 0) {
            [$invId, $number] = create_invoice((int)$a['client_id'], (int)$a['project_id'], "Stage payment: {$a['title']} ({$a['project']})", (int)$a['bill_amount'], date('Y-m-d', strtotime('+7 days')));
            q('UPDATE approvals SET invoice_id = ? WHERE id = ?', [$invId, $a['id']]);
        }
        notify_admins(($decision === 'approved' ? 'Approved: ' : 'Changes requested: ') . $a['title'],
            "{$u['name']} " . ($decision === 'approved' ? 'approved' : 'requested changes to') . " “{$a['title']}” on {$a['project']}." . ($note ? "\n\nNote: $note" : ''));
        out(['ok' => true]);

    // ---------- support tickets ----------

    case 'ticket_open':
        $u = require_user();
        $d = body();
        if (is_team($u)) require_perm('support');
        $clientId = is_team($u) ? (int)($d['client_id'] ?? 0) : $u['client_id'];
        if (!q('SELECT id FROM clients WHERE id = ?', [$clientId])->fetch()) fail(400, 'Choose a client.');
        $pid = (int)($d['project_id'] ?? 0) ?: null;
        if ($pid && !q('SELECT id FROM projects WHERE id = ? AND client_id = ?', [$pid, $clientId])->fetch()) fail(400, 'Choose one of your projects.');
        $subject = str_in($d, 'subject', 160);
        $message = str_in($d, 'message', 4000);
        $open = q("SELECT COUNT(*) AS n FROM tickets WHERE client_id = ? AND created_at > ?", [$clientId, date('Y-m-d H:i:s', time() - 3600)])->fetch();
        if ((int)$open['n'] >= 10) fail(429, 'Too many new requests. Please reply on an existing one.');
        q('INSERT INTO tickets (client_id, project_id, subject, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [$clientId, $pid, $subject, 'open', now(), now()]);
        $tid = (int)db()->lastInsertId();
        q('INSERT INTO ticket_messages (ticket_id, author, message, created_at) VALUES (?, ?, ?, ?)', [$tid, is_team($u) ? 'admin' : 'client', $message, now()]);
        if (is_team($u)) notify_client($clientId, 'Support: ' . $subject, $message);
        else notify_admins('New support request: ' . $subject, "From {$u['name']} ({$u['email']}):\n\n$message");
        out(['ok' => true]);

    case 'ticket_reply':
        $u = require_user();
        $d = body();
        $t = q('SELECT * FROM tickets WHERE id = ?', [(int)($d['ticket_id'] ?? 0)])->fetch();
        if (!$t || (is_team($u) ? !can($u, 'support') : (int)$t['client_id'] !== $u['client_id'])) fail(404, 'Request not found.');
        $message = str_in($d, 'message', 4000);
        $author = is_team($u) ? 'admin' : 'client';
        q('INSERT INTO ticket_messages (ticket_id, author, message, created_at) VALUES (?, ?, ?, ?)', [$t['id'], $author, $message, now()]);
        q("UPDATE tickets SET status = 'open', updated_at = ? WHERE id = ?", [now(), $t['id']]);
        if ($author === 'admin') notify_client((int)$t['client_id'], 'Reply: ' . $t['subject'], $message);
        else notify_admins('Reply: ' . $t['subject'], "From {$u['name']}:\n\n$message");
        out(['ok' => true]);

    case 'ticket_status':
        $u = require_user();
        $d = body();
        $t = q('SELECT * FROM tickets WHERE id = ?', [(int)($d['ticket_id'] ?? 0)])->fetch();
        if (!$t || (is_team($u) ? !can($u, 'support') : (int)$t['client_id'] !== $u['client_id'])) fail(404, 'Request not found.');
        $status = ($d['status'] ?? '') === 'closed' ? 'closed' : 'open';
        q('UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?', [$status, now(), $t['id']]);
        out(['ok' => true]);

    // ---------- courses ----------

    case 'course_save':
        require_perm('courses');
        $d = body();
        $id = (int)($d['id'] ?? 0);
        $title = str_in($d, 'title', 160);
        $summary = str_in($d, 'summary', 2000, false);
        if ($id) q('UPDATE courses SET title = ?, summary = ? WHERE id = ?', [$title, $summary, $id]);
        else q('INSERT INTO courses (title, summary, created_at) VALUES (?, ?, ?)', [$title, $summary, now()]);
        out(['ok' => true]);

    case 'lesson_save':
        require_perm('courses');
        $d = body();
        $courseId = (int)($d['course_id'] ?? 0);
        if (!q('SELECT id FROM courses WHERE id = ?', [$courseId])->fetch()) fail(400, 'Choose a course.');
        $video = str_in($d, 'video_url', 300, false);
        if ($video !== '' && !preg_match('#^https://#i', $video)) fail(400, 'The video link must start with https://');
        $next = (int)q('SELECT COALESCE(MAX(position), 0) + 1 AS n FROM lessons WHERE course_id = ?', [$courseId])->fetch()['n'];
        q('INSERT INTO lessons (course_id, position, title, video_url, body, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [$courseId, $next, str_in($d, 'title', 160), $video, str_in($d, 'body', 20000, false), now()]);
        out(['ok' => true]);

    case 'enroll':
        require_perm('courses');
        $d = body();
        $clientId = (int)($d['client_id'] ?? 0);
        $courseId = (int)($d['course_id'] ?? 0);
        $course = q('SELECT title FROM courses WHERE id = ?', [$courseId])->fetch();
        if (!$course || !q('SELECT id FROM clients WHERE id = ?', [$clientId])->fetch()) fail(400, 'Choose a student and a course.');
        if (!q('SELECT id FROM enrollments WHERE client_id = ? AND course_id = ?', [$clientId, $courseId])->fetch()) {
            q('INSERT INTO enrollments (client_id, course_id, created_at) VALUES (?, ?, ?)', [$clientId, $courseId, now()]);
            notify_client($clientId, 'You’re enrolled: ' . $course['title'], "You now have access to “{$course['title']}” in the portal. Sign in with Google to start learning.");
        }
        out(['ok' => true]);

    case 'lesson_done':
        $u = require_user();
        if (is_team($u)) fail(400, 'Only students track lessons.');
        $d = body();
        $lesson = q('SELECT l.id, l.course_id FROM lessons l JOIN enrollments e ON e.course_id = l.course_id AND e.client_id = ? WHERE l.id = ?', [$u['client_id'], (int)($d['lesson_id'] ?? 0)])->fetch();
        if (!$lesson) fail(404, 'Lesson not found.');
        if (!empty($d['done'])) {
            if (!q('SELECT id FROM lesson_progress WHERE client_id = ? AND lesson_id = ?', [$u['client_id'], $lesson['id']])->fetch()) {
                q('INSERT INTO lesson_progress (client_id, lesson_id, completed_at) VALUES (?, ?, ?)', [$u['client_id'], $lesson['id'], now()]);
            }
        } else {
            q('DELETE FROM lesson_progress WHERE client_id = ? AND lesson_id = ?', [$u['client_id'], $lesson['id']]);
        }
        $code = maybe_issue_certificate($u['client_id'], (int)$lesson['course_id']);
        out(['ok' => true, 'certificate' => $code]);

    case 'certificate_issue':
        require_perm('courses');
        $d = body();
        $clientId = (int)($d['client_id'] ?? 0);
        $courseId = (int)($d['course_id'] ?? 0);
        if (!q('SELECT id FROM enrollments WHERE client_id = ? AND course_id = ?', [$clientId, $courseId])->fetch()) fail(400, 'That student is not enrolled in this course.');
        out(['ok' => true, 'code' => issue_certificate($clientId, $courseId)]);

    // ---------- clients: pay an invoice by M-Pesa ----------

    case 'pay_invoice':
        $u = require_user();
        $d = body();
        $inv = q("SELECT * FROM invoices WHERE id = ? AND status = 'unpaid'", [(int)($d['invoice_id'] ?? 0)])->fetch();
        if (!$inv || (is_team($u) ? !can($u, 'money') : (int)$inv['client_id'] !== $u['client_id'])) fail(404, 'Invoice not found or already paid.');
        $balance = invoice_balance($inv);
        $amount = isset($d['amount']) && $d['amount'] !== '' ? int_in($d, 'amount', 1, $balance) : $balance;
        if ($amount > 150000) fail(400, 'M-Pesa allows up to KSh 150,000 per payment. Enter a smaller amount and pay the rest in another payment.');
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        if (!$msisdn) fail(400, 'Enter a Safaricom number like 0712 345 678.');
        $recent = q('SELECT COUNT(*) AS n FROM invoice_payments WHERE invoice_id = ? AND created_at > ?', [$inv['id'], date('Y-m-d H:i:s', time() - 600)])->fetch();
        if ((int)$recent['n'] >= 5) fail(429, 'Too many payment requests. Please wait a few minutes.');
        $checkout = stk_push($msisdn, $amount, $inv['number'], 'Invoice');
        audit('payment_started', "{$inv['number']} KSh $amount");
        q("INSERT INTO invoice_payments (invoice_id, checkout_id, amount, method, created_at) VALUES (?, ?, ?, 'mpesa', ?)", [$inv['id'], $checkout, $amount, now()]);
        out(['ok' => true, 'checkout_id' => $checkout]);

    case 'payment_status':
        $u = require_user();
        $inv = q('SELECT * FROM invoices WHERE id = ?', [(int)($_GET['invoice_id'] ?? 0)])->fetch();
        if (!$inv || (is_team($u) ? !can($u, 'money') : (int)$inv['client_id'] !== $u['client_id'])) fail(404, 'Invoice not found.');
        $pay = q("SELECT checkout_id FROM invoice_payments WHERE invoice_id = ? AND method = 'mpesa' ORDER BY id DESC LIMIT 1", [$inv['id']])->fetch();
        if ($pay && ($done = q('SELECT reference FROM payments WHERE checkout_id = ?', [$pay['checkout_id']])->fetch())) out(['status' => 'paid', 'receipt' => $done['reference']]);
        if ($inv['status'] === 'paid') out(['status' => 'paid', 'receipt' => $inv['mpesa_receipt']]);
        $r = $pay ? mpesa_result($pay['checkout_id']) : null;
        if (!$r) out(['status' => 'pending']);
        $result = settle_payment($pay['checkout_id'], $r);
        if ($result === 'paid') out(['status' => 'paid', 'receipt' => (q('SELECT reference FROM payments WHERE checkout_id = ?', [$pay['checkout_id']])->fetch()['reference'] ?? '')]);
        if ($result === 'pending') out(['status' => 'pending']);
        if ($result === 'mismatch') out(['status' => 'failed', 'code' => -2, 'message' => 'We could not match this payment to your invoice. We have been alerted and will contact you.']);
        out(['status' => 'failed', 'code' => (int)$r['result_code']]);

    // ---------- admin: monthly invoices, quick start, exports ----------

    case 'recurring_save':
        require_perm('money');
        $d = body();
        $clientId = (int)($d['client_id'] ?? 0);
        if (!q('SELECT id FROM clients WHERE id = ?', [$clientId])->fetch()) fail(400, 'Choose a client.');
        $projectId = (int)($d['project_id'] ?? 0) ?: null;
        if ($projectId && !q('SELECT id FROM projects WHERE id = ? AND client_id = ?', [$projectId, $clientId])->fetch()) fail(400, 'That project belongs to another client.');
        $desc = str_in($d, 'description', 300);
        $amount = int_in($d, 'amount', 1, 150000);
        $dom = int_in($d, 'day_of_month', 1, 28);
        $dueDays = int_in($d, 'due_days', 0, 60);
        $next = new DateTime('today');
        if ((int)$next->format('j') > $dom) $next->modify('first day of next month');
        $next->setDate((int)$next->format('Y'), (int)$next->format('n'), $dom);
        q('INSERT INTO recurring_invoices (client_id, project_id, description, amount, day_of_month, due_days, next_date, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)',
            [$clientId, $projectId, $desc, $amount, $dom, $dueDays, $next->format('Y-m-d'), now()]);
        out(['ok' => true, 'next_date' => $next->format('Y-m-d')]);

    case 'recurring_toggle':
        require_perm('money');
        $d = body();
        q('UPDATE recurring_invoices SET active = ? WHERE id = ?', [empty($d['active']) ? 0 : 1, (int)($d['id'] ?? 0)]);
        out(['ok' => true]);

    case 'quick_start':
        // New client + project + deposit invoice in one step (e.g. after a quote is accepted)
        require_perm('money');
        $d = body();
        $name = str_in($d, 'name', 120);
        $email = strtolower(str_in($d, 'email', 190));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Please enter a valid email.');
        $phone = str_in($d, 'phone', 30, false);
        $title = str_in($d, 'title', 160);
        $total = int_in($d, 'total', 1, 10000000);
        $pct = int_in($d, 'deposit_percent', 0, 100);
        $dueDays = int_in($d, 'due_days', 0, 60);
        [$clientId, $projectId, $number] = setup_client_project($name, $email, $phone, $title, $total, $pct, $dueDays);
        if (!empty($d['lead_id'])) q("UPDATE leads SET status = 'won', client_id = ?, updated_at = ? WHERE id = ?", [$clientId, now(), (int)$d['lead_id']]);
        out(['ok' => true, 'client_id' => $clientId, 'project_id' => $projectId, 'invoice' => $number]);

    case 'export':
        $type = (string)($_GET['type'] ?? '');
        if ($type === 'activity') require_admin();
        else require_perm($type === 'clients' ? 'clients' : 'money');
        $sets = [
            'invoices' => ['SELECT i.number, c.name AS client, c.email, i.description, i.amount, i.status, i.due_date, i.created_at, i.paid_at, i.mpesa_receipt FROM invoices i JOIN clients c ON c.id = i.client_id ORDER BY i.created_at', []],
            'payments' => ["SELECT i.paid_at, i.number, c.name AS client, i.description, i.amount, i.mpesa_receipt FROM invoices i JOIN clients c ON c.id = i.client_id WHERE i.status = 'paid' ORDER BY i.paid_at", []],
            'clients' => ['SELECT name, email, phone, created_at FROM clients ORDER BY name', []],
            'activity' => ['SELECT created_at, actor, action, detail, ip FROM audit_log ORDER BY id DESC LIMIT 5000', []],
            'receipts' => ["SELECT p.decided_at AS date, i.number AS invoice, c.name AS client, p.amount, p.method, p.reference FROM payments p JOIN invoices i ON i.id = p.invoice_id JOIN clients c ON c.id = i.client_id WHERE p.status = 'confirmed' ORDER BY p.decided_at", []],
        ];
        if (!isset($sets[$type])) fail(400, 'Unknown export.');
        $rows = q($sets[$type][0], $sets[$type][1])->fetchAll();
        audit('export', $type);
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="marzley-' . $type . '-' . date('Y-m-d') . '.csv"');
        header('Cache-Control: private, no-store');
        header('X-Content-Type-Options: nosniff');
        $out = fopen('php://output', 'w');
        fwrite($out, "\xEF\xBB\xBF"); // so Excel reads the file as UTF-8
        // A cell starting with = + - @ could run as a formula in Excel: prefix it with '
        $safe = fn($v) => is_string($v) && $v !== '' && strpbrk($v[0], "=+-@\t\r") !== false ? "'" . $v : $v;
        fputcsv($out, $rows ? array_keys($rows[0]) : ['no data'], ',', '"', '');
        foreach ($rows as $r) fputcsv($out, array_map($safe, $r), ',', '"', '');
        fclose($out);
        exit;


    // ---------- payments: record, claim, confirm, card ----------

    case 'payment_record':
        $u = require_perm('money');
        $d = body();
        $inv = q("SELECT * FROM invoices WHERE id = ? AND status = 'unpaid'", [(int)($d['invoice_id'] ?? 0)])->fetch();
        if (!$inv) fail(404, 'Invoice not found or already paid.');
        $amount = int_in($d, 'amount', 1, invoice_balance($inv));
        $methodIn = (string)($d['method'] ?? '');
        if (!in_array($methodIn, ['mpesa', 'till', 'bank', 'card', 'cash', 'manual'], true)) fail(400, 'Choose how it was paid.');
        $ref = strtoupper(preg_replace('/[^A-Za-z0-9-]/', '', str_in($d, 'reference', 60, $methodIn !== 'cash' && $methodIn !== 'manual')));
        if (reference_used($ref)) fail(400, "Reference $ref has already been used for another payment.");
        apply_payment((int)$inv['id'], $amount, $methodIn, $ref, $u['email']);
        out(['ok' => true]);

    case 'payment_claim':
        // "I've already paid": the client tells us about a till or bank payment; staff confirm it
        $u = require_user();
        if (is_team($u)) fail(400, 'Use “Record a payment” instead.');
        $inv = q("SELECT * FROM invoices WHERE id = ? AND client_id = ? AND status = 'unpaid'", [(int)($_POST['invoice_id'] ?? 0), $u['client_id']])->fetch();
        if (!$inv) fail(404, 'Invoice not found or already paid.');
        $amount = int_in($_POST, 'amount', 1, invoice_balance($inv));
        $methodIn = (string)($_POST['method'] ?? '');
        if (!in_array($methodIn, ['till', 'bank'], true)) fail(400, 'Choose M-Pesa till or bank transfer.');
        $ref = strtoupper(preg_replace('/[^A-Za-z0-9-]/', '', str_in($_POST, 'reference', 60)));
        if ($methodIn === 'till' && !preg_match('/^[A-Z0-9]{10}$/', $ref)) fail(400, 'An M-Pesa code has 10 letters and numbers, like SGR7H2K9PQ.');
        if (reference_used($ref)) fail(400, 'That reference has already been used. If you think this is a mistake, contact us.');
        if ((int)q("SELECT COUNT(*) AS n FROM payments WHERE invoice_id = ? AND status = 'pending'", [$inv['id']])->fetch()['n'] >= 3) fail(429, 'We already have payments waiting to be confirmed on this invoice. We’ll confirm them shortly.');
        $proof = null;
        if (!empty($_FILES['proof']) && $_FILES['proof']['error'] !== UPLOAD_ERR_NO_FILE) [$proof] = store_upload($_FILES['proof']);
        q("INSERT INTO payments (invoice_id, amount, method, reference, status, proof_file, created_by, created_at) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)",
            [$inv['id'], $amount, $methodIn, $ref, $proof, $u['email'], now()]);
        notify_admins("Payment to confirm: {$inv['number']}", "{$u['name']} says they paid KSh " . number_format($amount) . ' by ' . ($methodIn === 'till' ? 'M-Pesa till' : 'bank transfer') .
            " for {$inv['number']} (reference $ref)" . ($proof ? ', with proof attached' : '') . ". Check your statement, then confirm or reject it in the portal (Invoices).");
        out(['ok' => true]);

    case 'payment_decide':
        $u = require_perm('money');
        $d = body();
        $p = q("SELECT p.*, i.number, i.client_id, i.status AS inv_status, i.amount AS inv_amount, i.amount_paid FROM payments p JOIN invoices i ON i.id = p.invoice_id WHERE p.id = ? AND p.status = 'pending'", [(int)($d['id'] ?? 0)])->fetch();
        if (!$p) fail(404, 'Nothing to confirm.');
        if (($d['decision'] ?? '') === 'confirm') {
            if ($p['inv_status'] !== 'unpaid') fail(400, 'This invoice is already paid or cancelled.');
            if ((int)$p['amount'] > (int)$p['inv_amount'] - (int)$p['amount_paid']) fail(400, 'This is more than the balance. Edit the invoice first, or record the right amount.');
            if (reference_used($p['reference'], (int)$p['id'])) fail(400, 'That reference was already used for another payment.');
            apply_payment((int)$p['invoice_id'], (int)$p['amount'], $p['method'], $p['reference'], $u['email'], null, (int)$p['id']);
        } else {
            $note = str_in($d, 'note', 500);
            q("UPDATE payments SET status = 'rejected', note = ?, decided_at = ? WHERE id = ?", [$note, now(), $p['id']]);
            notify_client((int)$p['client_id'], "About your payment for {$p['number']}", "We could not confirm the payment of KSh " . number_format((int)$p['amount']) . " (reference {$p['reference']}).\n\nReason: $note\n\nPlease reply or message us on WhatsApp +254 745 789 590 and we’ll sort it out.");
        }
        out(['ok' => true]);

    case 'proof':
        $u = require_perm('money');
        $p = q('SELECT proof_file FROM payments WHERE id = ?', [(int)($_GET['id'] ?? 0)])->fetch();
        $path = $p && $p['proof_file'] ? config()['storage_dir'] . '/' . basename($p['proof_file']) : '';
        if (!$path || !is_file($path)) fail(404, 'File not found.');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="payment-proof.' . pathinfo($path, PATHINFO_EXTENSION) . '"');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: private, no-store');
        readfile($path);
        exit;

    case 'card_pay':
        $u = require_user();
        $d = body();
        if (!paystack()) fail(503, 'Card payments are not available right now. Please pay by M-Pesa.');
        $inv = q("SELECT * FROM invoices WHERE id = ? AND status = 'unpaid'", [(int)($d['invoice_id'] ?? 0)])->fetch();
        if (!$inv || (is_team($u) ? !can($u, 'money') : (int)$inv['client_id'] !== $u['client_id'])) fail(404, 'Invoice not found or already paid.');
        $amount = isset($d['amount']) && $d['amount'] !== '' ? int_in($d, 'amount', 1, invoice_balance($inv)) : invoice_balance($inv);
        $email = is_team($u) ? (q('SELECT email FROM clients WHERE id = ?', [$inv['client_id']])->fetch()['email'] ?? $u['email']) : $u['email'];
        $ref = 'MTC' . $inv['id'] . 'X' . strtoupper(bin2hex(random_bytes(5)));
        $res = paystack_call('POST', '/transaction/initialize', [
            'email' => $email, 'amount' => $amount * 100, 'currency' => 'KES', 'reference' => $ref,
            'callback_url' => portal_url() . 'paystack.php', 'metadata' => ['invoice' => $inv['number']],
        ]);
        $url = $res['data']['authorization_url'] ?? '';
        if (!($res['status'] ?? false) || !preg_match('#^https://#', $url)) fail(502, 'Card payment could not start. Please try again or pay by M-Pesa.');
        q("INSERT INTO invoice_payments (invoice_id, checkout_id, amount, method, created_at) VALUES (?, ?, ?, 'card', ?)", [$inv['id'], $ref, $amount, now()]);
        audit('card_started', "{$inv['number']} KSh $amount");
        out(['ok' => true, 'url' => $url]);

    // ---------- leads and quotes ----------

    case 'lead_save':
        require_perm('leads');
        $d = body();
        $id = (int)($d['id'] ?? 0);
        $status = (string)($d['status'] ?? 'new');
        if (!in_array($status, ['new', 'contacted', 'quoted', 'won', 'lost'], true)) fail(400, 'Unknown status.');
        $vals = [str_in($d, 'name', 120), strtolower(str_in($d, 'email', 190, false)), str_in($d, 'phone', 30, false), str_in($d, 'source', 60, false),
                 str_in($d, 'message', 4000, false), $status, isset($d['value']) && $d['value'] !== '' ? int_in($d, 'value', 0, 100000000) : 0, str_in($d, 'notes', 4000, false)];
        if ($vals[1] !== '' && !filter_var($vals[1], FILTER_VALIDATE_EMAIL)) fail(400, 'Please enter a valid email.');
        if ($id) q('UPDATE leads SET name = ?, email = ?, phone = ?, source = ?, message = ?, status = ?, value = ?, notes = ?, updated_at = ? WHERE id = ?', array_merge($vals, [now(), $id]));
        else q('INSERT INTO leads (name, email, phone, source, message, status, value, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', array_merge($vals, [now(), now()]));
        out(['ok' => true]);

    case 'lead_status':
        require_perm('leads');
        $d = body();
        $status = (string)($d['status'] ?? '');
        if (!in_array($status, ['new', 'contacted', 'quoted', 'won', 'lost'], true)) fail(400, 'Unknown status.');
        q('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?', [$status, now(), (int)($d['id'] ?? 0)]);
        out(['ok' => true]);

    case 'quote_save':
        require_perm('money');
        $d = body();
        $id = (int)($d['id'] ?? 0);
        $items = [];
        foreach (array_slice(is_array($d['items'] ?? null) ? $d['items'] : [], 0, 30) as $it) {
            $desc = trim((string)($it['desc'] ?? ''));
            if ($desc === '') continue;
            $qty = max(1, min(1000, (int)($it['qty'] ?? 1)));
            $price = max(0, min(10000000, (int)($it['price'] ?? 0)));
            $items[] = ['desc' => mb_substr($desc, 0, 200), 'qty' => $qty, 'price' => $price];
        }
        if (!$items) fail(400, 'Add at least one item.');
        $total = array_sum(array_map(fn($i) => $i['qty'] * $i['price'], $items));
        if ($total < 1) fail(400, 'The total must be more than zero.');
        $email = strtolower(str_in($d, 'client_email', 190));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Please enter the client’s Google email.');
        $vals = [(int)($d['lead_id'] ?? 0) ?: null, str_in($d, 'client_name', 120), $email, str_in($d, 'client_phone', 30, false), str_in($d, 'title', 160),
                 json_encode($items, JSON_UNESCAPED_UNICODE), $total, int_in($d, 'deposit_percent', 0, 100), date_in($d, 'valid_until'), str_in($d, 'notes', 4000, false)];
        if ($id) {
            $q0 = q('SELECT status FROM quotes WHERE id = ?', [$id])->fetch();
            if (!$q0) fail(404, 'Quote not found.');
            if ($q0['status'] === 'accepted') fail(400, 'This quote was accepted and can’t be changed. Make a new one.');
            q('UPDATE quotes SET lead_id = ?, client_name = ?, client_email = ?, client_phone = ?, title = ?, items = ?, total = ?, deposit_percent = ?, valid_until = ?, notes = ? WHERE id = ?', array_merge($vals, [$id]));
            $token = q('SELECT token FROM quotes WHERE id = ?', [$id])->fetch()['token'];
        } else {
            $token = bin2hex(random_bytes(24));
            q("INSERT INTO quotes (lead_id, client_name, client_email, client_phone, title, items, total, deposit_percent, valid_until, notes, token, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)", array_merge($vals, [$token, now()]));
        }
        if ($vals[0]) q("UPDATE leads SET status = 'quoted', value = ?, updated_at = ? WHERE id = ? AND status IN ('new', 'contacted')", [$total, now(), $vals[0]]);
        out(['ok' => true, 'link' => portal_url() . 'quote.php?t=' . $token]);

    case 'quote_send':
        require_perm('money');
        $qt = q("SELECT * FROM quotes WHERE id = ? AND status IN ('draft', 'sent')", [(int)(body()['id'] ?? 0)])->fetch();
        if (!$qt) fail(404, 'Quote not found or already answered.');
        $link = portal_url() . 'quote.php?t=' . $qt['token'];
        send_mail($qt['client_email'], "Your quote from Marzley Tech Solutions: {$qt['title']}", "Hello {$qt['client_name']},\n\nThank you for talking to us. Here is your quote for “{$qt['title']}”: KSh " . number_format((int)$qt['total']) .
            ".\n\nView and accept it here: $link\n\nAny questions? Reply to this email or WhatsApp +254 745 789 590.", false);
        if ($qt['client_phone'] !== '') send_sms($qt['client_phone'], "Marzley Tech: your quote for {$qt['title']} (KSh " . number_format((int)$qt['total']) . "): $link");
        q("UPDATE quotes SET status = 'sent' WHERE id = ?", [$qt['id']]);
        out(['ok' => true, 'link' => $link]);

    // ---------- domains and hosting ----------

    case 'domain_save':
        require_perm('money');
        $d = body();
        $clientId = (int)($d['client_id'] ?? 0);
        if (!q('SELECT id FROM clients WHERE id = ?', [$clientId])->fetch()) fail(400, 'Choose a client.');
        $kind = (string)($d['kind'] ?? 'domain');
        if (!in_array($kind, ['domain', 'hosting', 'ssl', 'email', 'other'], true)) fail(400, 'Unknown type.');
        $expires = date_in($d, 'expires_on');
        if (!$expires) fail(400, 'Enter the expiry date.');
        $url = str_in($d, 'monitor_url', 300, false);
        if ($url !== '' && !preg_match('#^https?://[a-z0-9.-]+\.[a-z]{2,}(/|$)#i', $url)) fail(400, 'The address to monitor must start with https:// and be a public website.');
        $vals = [$clientId, strtolower(str_in($d, 'name', 190)), $kind, $expires, isset($d['renew_price']) && $d['renew_price'] !== '' ? int_in($d, 'renew_price', 0, 10000000) : 0,
                 empty($d['auto_invoice']) ? 0 : 1, $url, str_in($d, 'notes', 500, false)];
        $id = (int)($d['id'] ?? 0);
        if ($id) q('UPDATE domains SET client_id = ?, name = ?, kind = ?, expires_on = ?, renew_price = ?, auto_invoice = ?, monitor_url = ?, notes = ? WHERE id = ?', array_merge($vals, [$id]));
        else q('INSERT INTO domains (client_id, name, kind, expires_on, renew_price, auto_invoice, monitor_url, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', array_merge($vals, [now()]));
        out(['ok' => true]);

    case 'domain_renewed':
        require_perm('money');
        $dm = q('SELECT * FROM domains WHERE id = ?', [(int)(body()['id'] ?? 0)])->fetch();
        if (!$dm) fail(404, 'Not found.');
        $next = date('Y-m-d', strtotime($dm['expires_on'] . ' +1 year'));
        q('UPDATE domains SET expires_on = ? WHERE id = ?', [$next, $dm['id']]);
        out(['ok' => true, 'expires_on' => $next]);

    // ---------- team ----------

    case 'staff_save':
        require_admin();
        $d = body();
        $email = strtolower(str_in($d, 'email', 190));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Please enter a valid Google email.');
        if (in_array($email, config()['admin_emails'], true)) fail(400, 'That person is already an owner.');
        if (q('SELECT id FROM clients WHERE email = ?', [$email])->fetch()) fail(400, 'That email belongs to a client. Staff need their own Google account.');
        $perms = array_values(array_intersect(is_array($d['perms'] ?? null) ? $d['perms'] : [], array_keys(STAFF_PERMS)));
        if (!$perms) fail(400, 'Choose at least one area they can work on.');
        $name = str_in($d, 'name', 120);
        $existing = q('SELECT id FROM staff WHERE email = ?', [$email])->fetch();
        if ($existing) q('UPDATE staff SET name = ?, perms = ? WHERE id = ?', [$name, implode(',', $perms), $existing['id']]);
        else q('INSERT INTO staff (email, name, perms, created_at) VALUES (?, ?, ?, ?)', [$email, $name, implode(',', $perms), now()]);
        // Changed access takes effect at once: sign them out everywhere
        set_setting('epoch:' . $email, (string)(session_epoch($email) + 1));
        out(['ok' => true]);

    default:
        fail(404, 'Unknown action.');
}
