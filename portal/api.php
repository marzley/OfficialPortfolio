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
        out(compact('clients', 'projects', 'updates', 'invoices', 'files'));

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
        q('INSERT INTO updates (project_id, message, created_at) VALUES (?, ?, ?)', [$pid, str_in($d, 'message', 2000), now()]);
        q('UPDATE projects SET updated_at = ? WHERE id = ?', [now(), $pid]);
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
        out(['ok' => true]);

    case 'delete':
        require_admin();
        $d = body();
        $id = (int)($d['id'] ?? 0);
        switch ($d['type'] ?? '') {
            case 'update': q('DELETE FROM updates WHERE id = ?', [$id]); break;
            case 'invoice': q('DELETE FROM invoices WHERE id = ?', [$id]); break;
            case 'file':
                $f = q('SELECT stored_name FROM files WHERE id = ?', [$id])->fetch();
                if ($f) @unlink(config()['storage_dir'] . '/' . basename($f['stored_name']));
                q('DELETE FROM files WHERE id = ?', [$id]);
                break;
            default: fail(400, 'Unknown item.');
        }
        out(['ok' => true]);

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
            q("UPDATE invoices SET status = 'paid', paid_at = ?, mpesa_receipt = ? WHERE id = ? AND status = 'unpaid'", [now(), $receipt, $inv['id']]);
            out(['status' => 'paid', 'receipt' => $receipt]);
        }
        out(['status' => 'failed', 'code' => (int)$r['result_code']]);

    default:
        fail(404, 'Unknown action.');
}
