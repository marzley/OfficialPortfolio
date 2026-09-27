<?php
// Client portal API. All responses are JSON except file downloads.
define('MARZLEY_PORTAL', true);
require __DIR__ . '/lib.php';

start_session();
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Every change needs POST with the session's CSRF token (sign-in gets one afterwards).
if ($method === 'POST' && !in_array($action, ['login', 'dev_login'], true)) check_csrf();
if ($method !== 'POST' && !in_array($action, ['me', 'data', 'download', 'payment_status'], true)) fail(405, 'Use POST.');

switch ($action) {

    // ---------- sign-in ----------

    case 'me':
        $u = current_user();
        out(['user' => $u, 'csrf' => $u ? csrf_token() : null, 'google_client_id' => config()['google_client_id']]);

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
        $_SESSION = [];
        session_regenerate_id(true);
        out(['ok' => true]);

    // ---------- reading ----------

    case 'data':
        $u = require_user();
        if ($u['role'] === 'admin') {
            $clients = q('SELECT id, name, email, phone, created_at FROM clients ORDER BY name')->fetchAll();
            $projects = q('SELECT * FROM projects ORDER BY updated_at DESC')->fetchAll();
            $invoices = q('SELECT * FROM invoices ORDER BY created_at DESC')->fetchAll();
        } else {
            $clients = [];
            $projects = q('SELECT * FROM projects WHERE client_id = ? ORDER BY updated_at DESC', [$u['client_id']])->fetchAll();
            $invoices = q("SELECT * FROM invoices WHERE client_id = ? AND status <> 'cancelled' ORDER BY created_at DESC", [$u['client_id']])->fetchAll();
        }
        $ids = array_map(fn($p) => (int)$p['id'], $projects) ?: [0];
        $marks = implode(',', array_fill(0, count($ids), '?'));
        $updates = q("SELECT * FROM updates WHERE project_id IN ($marks) ORDER BY created_at DESC", $ids)->fetchAll();
        $files = q("SELECT id, project_id, original_name, size, created_at FROM files WHERE project_id IN ($marks) ORDER BY created_at DESC", $ids)->fetchAll();
        $approvals = q("SELECT * FROM approvals WHERE project_id IN ($marks) ORDER BY created_at DESC", $ids)->fetchAll();
        if ($u['role'] === 'admin') {
            $tickets = q('SELECT * FROM tickets ORDER BY status DESC, updated_at DESC')->fetchAll();
            $courses = q('SELECT * FROM courses ORDER BY title')->fetchAll();
            $enrollments = q('SELECT * FROM enrollments')->fetchAll();
            $progress = q('SELECT client_id, lesson_id FROM lesson_progress')->fetchAll();
            $certificates = q('SELECT * FROM certificates')->fetchAll();
            $me = null;
        } else {
            $cid = $u['client_id'];
            $tickets = q('SELECT * FROM tickets WHERE client_id = ? ORDER BY updated_at DESC', [$cid])->fetchAll();
            $courses = q('SELECT c.* FROM courses c JOIN enrollments e ON e.course_id = c.id WHERE e.client_id = ? ORDER BY c.title', [$cid])->fetchAll();
            $enrollments = q('SELECT * FROM enrollments WHERE client_id = ?', [$cid])->fetchAll();
            $progress = q('SELECT client_id, lesson_id FROM lesson_progress WHERE client_id = ?', [$cid])->fetchAll();
            $certificates = q('SELECT * FROM certificates WHERE client_id = ?', [$cid])->fetchAll();
            $row = q('SELECT name, email, phone FROM clients WHERE id = ?', [$cid])->fetch();
            $code = $row ? referral_code((string)$row['phone']) : null;
            $me = ['name' => $row['name'] ?? '', 'email' => $row['email'] ?? '',
                   'referral_link' => $code ? rtrim(config()['site_url'] ?? 'https://marzleytechsolutions.co.ke', '/') . '/?ref=' . $code : null];
        }
        $tids = array_map(fn($t) => (int)$t['id'], $tickets) ?: [0];
        $tmarks = implode(',', array_fill(0, count($tids), '?'));
        $messages = q("SELECT * FROM ticket_messages WHERE ticket_id IN ($tmarks) ORDER BY created_at", $tids)->fetchAll();
        $cids = array_map(fn($c) => (int)$c['id'], $courses) ?: [0];
        $cmarks = implode(',', array_fill(0, count($cids), '?'));
        $lessons = q("SELECT * FROM lessons WHERE course_id IN ($cmarks) ORDER BY course_id, position, id", $cids)->fetchAll();
        out(compact('clients', 'projects', 'updates', 'invoices', 'files', 'approvals', 'tickets', 'messages',
            'courses', 'lessons', 'enrollments', 'progress', 'certificates', 'me'));

    case 'download':
        $u = require_user();
        $f = q('SELECT f.*, p.client_id FROM files f JOIN projects p ON p.id = f.project_id WHERE f.id = ?', [(int)($_GET['id'] ?? 0)])->fetch();
        if (!$f || ($u['role'] !== 'admin' && (int)$f['client_id'] !== $u['client_id'])) fail(404, 'File not found.');
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
        require_admin();
        $d = body();
        $name = str_in($d, 'name', 120);
        $email = strtolower(str_in($d, 'email', 190));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Please enter a valid email.');
        $phone = str_in($d, 'phone', 30, false);
        $id = (int)($d['id'] ?? 0);
        $dupe = q('SELECT id FROM clients WHERE email = ? AND id <> ?', [$email, $id])->fetch();
        if ($dupe) fail(400, 'A client with that email already exists.');
        if ($id) q('UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?', [$name, $email, $phone, $id]);
        else q('INSERT INTO clients (name, email, phone, created_at) VALUES (?, ?, ?, ?)', [$name, $email, $phone, now()]);
        out(['ok' => true]);

    case 'project_save':
        require_admin();
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
        if ($id) q('UPDATE projects SET client_id = ?, title = ?, status = ?, progress = ?, due_date = ?, summary = ?, updated_at = ? WHERE id = ?',
            [$clientId, $title, $status, $progress, $due, $summary, now(), $id]);
        else q('INSERT INTO projects (client_id, title, status, progress, due_date, summary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [$clientId, $title, $status, $progress, $due, $summary, now(), now()]);
        out(['ok' => true]);

    case 'update_add':
        require_admin();
        $d = body();
        $pid = (int)($d['project_id'] ?? 0);
        if (!q('SELECT id FROM projects WHERE id = ?', [$pid])->fetch()) fail(400, 'Choose a project.');
        $message = str_in($d, 'message', 2000);
        q('INSERT INTO updates (project_id, message, created_at) VALUES (?, ?, ?)', [$pid, $message, now()]);
        q('UPDATE projects SET updated_at = ? WHERE id = ?', [now(), $pid]);
        if ($pc = client_of_project($pid)) notify_client((int)$pc['client_id'], 'New update on ' . $pc['title'], "There's a new update on your project “{$pc['title']}”:\n\n$message");
        out(['ok' => true]);

    case 'invoice_save':
        require_admin();
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
            q('UPDATE invoices SET client_id = ?, project_id = ?, description = ?, amount = ?, status = ?, due_date = ?, paid_at = CASE WHEN ? = \'paid\' THEN COALESCE(paid_at, ?) ELSE NULL END WHERE id = ?',
                [$clientId, $projectId, $desc, $amount, $status, $due, $status, now(), $id]);
        } else {
            $number = 'INV-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));
            q('INSERT INTO invoices (client_id, project_id, number, description, amount, status, due_date, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [$clientId, $projectId, $number, $desc, $amount, $status, $due, $status === 'paid' ? now() : null, now()]);
            if ($status === 'unpaid') notify_client($clientId, "New invoice $number", "You have a new invoice: $desc, KSh " . number_format($amount) . ($due ? ", due $due" : '') . '. You can pay it by M-Pesa in the portal.');
        }
        out(['ok' => true]);

    case 'file_upload':
        require_admin();
        $pid = (int)($_POST['project_id'] ?? 0);
        if (!q('SELECT id FROM projects WHERE id = ?', [$pid])->fetch()) fail(400, 'Choose a project.');
        $up = $_FILES['file'] ?? null;
        if (!$up || $up['error'] !== UPLOAD_ERR_OK) fail(400, 'The upload did not work. Files can be up to 20 MB.');
        if ($up['size'] > 20 * 1024 * 1024) fail(400, 'Files can be up to 20 MB.');
        $ext = strtolower(pathinfo($up['name'], PATHINFO_EXTENSION));
        $allowed = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'zip', 'docx', 'xlsx', 'pptx', 'txt', 'csv'];
        if (!in_array($ext, $allowed, true)) fail(400, 'That file type is not allowed. Use PDF, images, ZIP or Office files.');
        $dir = config()['storage_dir'];
        if (!is_dir($dir) && !@mkdir($dir, 0750, true)) fail(500, 'The file folder could not be created.');
        $stored = bin2hex(random_bytes(16)) . '.' . $ext;
        if (!move_uploaded_file($up['tmp_name'], $dir . '/' . $stored)) fail(500, 'The file could not be saved.');
        $name = mb_substr(preg_replace('/[^\p{L}\p{N} ._()-]/u', '_', $up['name']), 0, 180);
        q('INSERT INTO files (project_id, original_name, stored_name, size, created_at) VALUES (?, ?, ?, ?, ?)', [$pid, $name, $stored, (int)$up['size'], now()]);
        if ($pc = client_of_project($pid)) notify_client((int)$pc['client_id'], 'New file on ' . $pc['title'], "A new file, “{$name}”, was added to your project “{$pc['title']}”.");
        out(['ok' => true]);

    case 'delete':
        require_admin();
        $d = body();
        $id = (int)($d['id'] ?? 0);
        switch ($d['type'] ?? '') {
            case 'update': q('DELETE FROM updates WHERE id = ?', [$id]); break;
            case 'invoice': q('DELETE FROM invoices WHERE id = ?', [$id]); break;
            case 'approval': q('DELETE FROM approvals WHERE id = ?', [$id]); break;
            case 'lesson': q('DELETE FROM lessons WHERE id = ?', [$id]); break;
            case 'enrollment': q('DELETE FROM enrollments WHERE id = ?', [$id]); break;
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
        require_admin();
        $d = body();
        $pid = (int)($d['project_id'] ?? 0);
        $pc = client_of_project($pid);
        if (!$pc) fail(400, 'Choose a project.');
        $title = str_in($d, 'title', 160);
        q('INSERT INTO approvals (project_id, title, details, status, created_at) VALUES (?, ?, ?, ?, ?)', [$pid, $title, str_in($d, 'details', 2000, false), 'pending', now()]);
        notify_client((int)$pc['client_id'], 'Please review: ' . $title, "“{$title}” on your project “{$pc['title']}” is ready for your review. Approve it or request changes in the portal.");
        out(['ok' => true]);

    case 'approval_decide':
        $u = require_user();
        $d = body();
        $a = q("SELECT a.*, p.client_id, p.title AS project FROM approvals a JOIN projects p ON p.id = a.project_id WHERE a.id = ? AND a.status = 'pending'", [(int)($d['id'] ?? 0)])->fetch();
        if (!$a || ($u['role'] !== 'admin' && (int)$a['client_id'] !== $u['client_id'])) fail(404, 'Nothing to review.');
        $decision = (string)($d['decision'] ?? '');
        if (!in_array($decision, ['approved', 'changes'], true)) fail(400, 'Choose approve or request changes.');
        $note = str_in($d, 'note', 2000, $decision === 'changes');
        q('UPDATE approvals SET status = ?, client_note = ?, decided_at = ? WHERE id = ?', [$decision, $note, now(), $a['id']]);
        notify_admins(($decision === 'approved' ? 'Approved: ' : 'Changes requested: ') . $a['title'],
            "{$u['name']} " . ($decision === 'approved' ? 'approved' : 'requested changes to') . " “{$a['title']}” on {$a['project']}." . ($note ? "\n\nNote: $note" : ''));
        out(['ok' => true]);

    // ---------- support tickets ----------

    case 'ticket_open':
        $u = require_user();
        $d = body();
        $clientId = $u['role'] === 'admin' ? (int)($d['client_id'] ?? 0) : $u['client_id'];
        if (!q('SELECT id FROM clients WHERE id = ?', [$clientId])->fetch()) fail(400, 'Choose a client.');
        $pid = (int)($d['project_id'] ?? 0) ?: null;
        if ($pid && !q('SELECT id FROM projects WHERE id = ? AND client_id = ?', [$pid, $clientId])->fetch()) fail(400, 'Choose one of your projects.');
        $subject = str_in($d, 'subject', 160);
        $message = str_in($d, 'message', 4000);
        $open = q("SELECT COUNT(*) AS n FROM tickets WHERE client_id = ? AND created_at > ?", [$clientId, date('Y-m-d H:i:s', time() - 3600)])->fetch();
        if ((int)$open['n'] >= 10) fail(429, 'Too many new requests. Please reply on an existing one.');
        q('INSERT INTO tickets (client_id, project_id, subject, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [$clientId, $pid, $subject, 'open', now(), now()]);
        $tid = (int)db()->lastInsertId();
        q('INSERT INTO ticket_messages (ticket_id, author, message, created_at) VALUES (?, ?, ?, ?)', [$tid, $u['role'] === 'admin' ? 'admin' : 'client', $message, now()]);
        if ($u['role'] === 'admin') notify_client($clientId, 'Support: ' . $subject, $message);
        else notify_admins('New support request: ' . $subject, "From {$u['name']} ({$u['email']}):\n\n$message");
        out(['ok' => true]);

    case 'ticket_reply':
        $u = require_user();
        $d = body();
        $t = q('SELECT * FROM tickets WHERE id = ?', [(int)($d['ticket_id'] ?? 0)])->fetch();
        if (!$t || ($u['role'] !== 'admin' && (int)$t['client_id'] !== $u['client_id'])) fail(404, 'Request not found.');
        $message = str_in($d, 'message', 4000);
        $author = $u['role'] === 'admin' ? 'admin' : 'client';
        q('INSERT INTO ticket_messages (ticket_id, author, message, created_at) VALUES (?, ?, ?, ?)', [$t['id'], $author, $message, now()]);
        q("UPDATE tickets SET status = 'open', updated_at = ? WHERE id = ?", [now(), $t['id']]);
        if ($author === 'admin') notify_client((int)$t['client_id'], 'Reply: ' . $t['subject'], $message);
        else notify_admins('Reply: ' . $t['subject'], "From {$u['name']}:\n\n$message");
        out(['ok' => true]);

    case 'ticket_status':
        $u = require_user();
        $d = body();
        $t = q('SELECT * FROM tickets WHERE id = ?', [(int)($d['ticket_id'] ?? 0)])->fetch();
        if (!$t || ($u['role'] !== 'admin' && (int)$t['client_id'] !== $u['client_id'])) fail(404, 'Request not found.');
        $status = ($d['status'] ?? '') === 'closed' ? 'closed' : 'open';
        q('UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?', [$status, now(), $t['id']]);
        out(['ok' => true]);

    // ---------- courses ----------

    case 'course_save':
        require_admin();
        $d = body();
        $id = (int)($d['id'] ?? 0);
        $title = str_in($d, 'title', 160);
        $summary = str_in($d, 'summary', 2000, false);
        if ($id) q('UPDATE courses SET title = ?, summary = ? WHERE id = ?', [$title, $summary, $id]);
        else q('INSERT INTO courses (title, summary, created_at) VALUES (?, ?, ?)', [$title, $summary, now()]);
        out(['ok' => true]);

    case 'lesson_save':
        require_admin();
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
        require_admin();
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
        if ($u['role'] === 'admin') fail(400, 'Only students track lessons.');
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
        require_admin();
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
        if (!$inv || ($u['role'] !== 'admin' && (int)$inv['client_id'] !== $u['client_id'])) fail(404, 'Invoice not found or already paid.');
        if ((int)$inv['amount'] > 150000) fail(400, 'This invoice is above the M-Pesa limit. Please pay by bank transfer or in parts.');
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        if (!$msisdn) fail(400, 'Enter a Safaricom number like 0712 345 678.');
        $recent = q('SELECT COUNT(*) AS n FROM invoice_payments WHERE invoice_id = ? AND created_at > ?', [$inv['id'], date('Y-m-d H:i:s', time() - 600)])->fetch();
        if ((int)$recent['n'] >= 5) fail(429, 'Too many payment requests. Please wait a few minutes.');
        $checkout = stk_push($msisdn, (int)$inv['amount'], $inv['number'], 'Invoice');
        q('INSERT INTO invoice_payments (invoice_id, checkout_id, created_at) VALUES (?, ?, ?)', [$inv['id'], $checkout, now()]);
        out(['ok' => true, 'checkout_id' => $checkout]);

    case 'payment_status':
        $u = require_user();
        $inv = q('SELECT * FROM invoices WHERE id = ?', [(int)($_GET['invoice_id'] ?? 0)])->fetch();
        if (!$inv || ($u['role'] !== 'admin' && (int)$inv['client_id'] !== $u['client_id'])) fail(404, 'Invoice not found.');
        if ($inv['status'] === 'paid') out(['status' => 'paid', 'receipt' => $inv['mpesa_receipt']]);
        $pay = q('SELECT checkout_id FROM invoice_payments WHERE invoice_id = ? ORDER BY id DESC LIMIT 1', [$inv['id']])->fetch();
        $r = $pay ? mpesa_result($pay['checkout_id']) : null;
        if (!$r) out(['status' => 'pending']);
        if ((int)$r['result_code'] === 0 && (int)$r['amount'] >= (int)$inv['amount']) {
            $receipt = preg_replace('/[^A-Z0-9]/i', '', (string)$r['receipt']);
            $changed = q("UPDATE invoices SET status = 'paid', paid_at = ?, mpesa_receipt = ? WHERE id = ? AND status = 'unpaid'", [now(), $receipt, $inv['id']])->rowCount();
            if ($changed) notify_admins("Invoice {$inv['number']} paid", "Invoice {$inv['number']} (KSh " . number_format((int)$inv['amount']) . ") was paid by M-Pesa. Receipt: $receipt.");
            out(['status' => 'paid', 'receipt' => $receipt]);
        }
        out(['status' => 'failed', 'code' => (int)$r['result_code']]);

    default:
        fail(404, 'Unknown action.');
}
