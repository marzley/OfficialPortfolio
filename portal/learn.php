<?php
// Learning hub API (used by /learn/ and the portal's Learning hub tab). JSON, except videos, posters and notes.
// Free for everyone: tutorials, practice and PDF notes. Videos: unlocked per learner with M-Pesa.
define('MARZLEY_PORTAL', true);
require __DIR__ . '/lib.php';

// The JSON may be fetched by search engines rendering /learn/, but it shouldn't appear in results itself
header('X-Robots-Tag: noindex');
install_error_alerts('learning hub');
start_session();
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
const LEARN_GET = ['me', 'catalog', 'lesson', 'videos', 'video', 'notes', 'note', 'poster', 'stream', 'unlock_status', 'admin'];
const VIDEO_TYPES = ['mp4' => 'video/mp4', 'm4v' => 'video/mp4', 'webm' => 'video/webm'];
const VIDEO_MAX = 2048 * 1024 * 1024;   // 2 GB
const NOTE_MAX = 100 * 1024 * 1024;     // 100 MB
const CHUNK_MAX = 8 * 1024 * 1024;

if ($method === 'POST' && !in_array($action, ['code_request', 'code_verify', 'google', 'dev_login'], true)) check_csrf();
if ($method !== 'POST' && !in_array($action, LEARN_GET, true)) fail(405, 'Use POST.');

learn_seed(db());   // adds any new tutorials shipped in data/learn-seed.json
$editor = learn_is_editor();
$me = learner();
$pub = $editor ? '1 = 1' : 'published = 1';

function need_learner(): array {
    $l = learner();
    if (!$l) fail(401, 'Please sign in first. It’s free.');
    return $l;
}

function need_editor(): array {
    return require_perm('courses');
}

function learn_sign_in(string $email, string $name): array {
    session_regenerate_id(true);
    unset($_SESSION['csrf']);
    $_SESSION['learner'] = learner_for($email, $name);
    q('UPDATE learners SET last_seen = ? WHERE id = ?', [now(), $_SESSION['learner']['id']]);
    audit('learner_sign_in', '', $email);
    return $_SESSION['learner'];
}

/** First name and initial, so comments don't show full names or emails. */
function public_name(string $name, string $email): string {
    $parts = preg_split('/\s+/', trim($name)) ?: [];
    if (!$parts || $parts[0] === '') return ucfirst(explode('@', $email)[0][0] ?? 'L') . '.';
    return $parts[0] . (isset($parts[1]) ? ' ' . mb_substr($parts[1], 0, 1) . '.' : '');
}

/** A video, if it's published (or hidden but already paid for by this learner, who keeps access). */
function video_row(int $id, bool $editor): array {
    $v = q('SELECT * FROM learn_videos WHERE id = ?', [$id])->fetch();
    if (!$v || (!$v['published'] && !$editor && !learn_unlocked((int)$v['id'], learner()))) fail(404, 'Video not found.');
    return $v;
}

function public_video(array $v, ?array $me): array {
    $id = (int)$v['id'];
    return [
        'id' => $id, 'title' => $v['title'], 'summary' => $v['summary'], 'track_id' => $v['track_id'] ? (int)$v['track_id'] : null,
        'price' => (int)$v['price'], 'views' => (int)$v['views'], 'duration' => (int)$v['duration'], 'published' => (int)$v['published'],
        'poster' => $v['poster_name'] ? "learn.php?action=poster&id=$id" : null, 'created_at' => $v['created_at'],
        'likes' => (int)q('SELECT COUNT(*) AS n FROM learn_likes WHERE video_id = ?', [$id])->fetch()['n'],
        'comments' => (int)q('SELECT COUNT(*) AS n FROM learn_comments WHERE video_id = ? AND hidden = 0', [$id])->fetch()['n'],
        'unlocked' => learn_unlocked($id, $me),
    ];
}

/** Send a private file, with byte ranges so videos can be skipped through. */
function send_file(string $path, string $type, string $name, bool $attachment): void {
    if (!is_file($path)) fail(404, 'File not found.');
    session_write_close();   // don't hold up the learner's other requests while streaming
    $size = filesize($path);
    $start = 0;
    $end = $size - 1;
    header('Accept-Ranges: bytes');
    if (preg_match('/^bytes=(\d*)-(\d*)$/', $_SERVER['HTTP_RANGE'] ?? '', $m) && ($m[1] !== '' || $m[2] !== '')) {
        if ($m[1] === '') { $start = max(0, $size - (int)$m[2]); }
        else { $start = (int)$m[1]; if ($m[2] !== '') $end = min($end, (int)$m[2]); }
        if ($start > $end || $start >= $size) { http_response_code(416); header("Content-Range: bytes */$size"); exit; }
        http_response_code(206);
        header("Content-Range: bytes $start-$end/$size");
    }
    header('Content-Type: ' . $type);
    header('Content-Length: ' . ($end - $start + 1));
    header('Content-Disposition: ' . ($attachment ? 'attachment' : 'inline') . '; filename="' . str_replace('"', '', $name) . '"');
    header('Cache-Control: private, max-age=3600');
    header('X-Content-Type-Options: nosniff');
    if ($_SERVER['REQUEST_METHOD'] === 'HEAD') exit;
    @set_time_limit(0);
    $fp = fopen($path, 'rb');
    fseek($fp, $start);
    $left = $end - $start + 1;
    while ($left > 0 && !feof($fp) && !connection_aborted()) {
        $chunk = fread($fp, (int)min(262144, $left));
        if ($chunk === false) break;
        echo $chunk;
        flush();
        $left -= strlen($chunk);
    }
    fclose($fp);
    exit;
}

/** Check the first bytes really are a video or PDF, whatever the file name says. */
function looks_like(string $file, string $ext): bool {
    $head = (string)file_get_contents($file, false, null, 0, 16);
    if ($ext === 'pdf') return str_starts_with($head, '%PDF-');
    if ($ext === 'webm') return str_starts_with($head, "\x1A\x45\xDF\xA3");
    return substr($head, 4, 4) === 'ftyp';   // mp4 / m4v
}

switch ($action) {

    // ---------- signing in (free) ----------

    case 'me':
        $progress = $me ? array_map('intval', array_column(q('SELECT lesson_id FROM learn_progress WHERE learner_id = ?', [$me['id']])->fetchAll(), 'lesson_id')) : [];
        out(['learner' => $me, 'csrf' => csrf_token(), 'editor' => $editor, 'progress' => $progress,
             'google_client_id' => config()['google_client_id'], 'mpesa' => (bool)mpesa_config()]);

    case 'google':
        $token = (string)(body()['credential'] ?? '');
        if ($token === '') fail(400, 'Missing Google sign-in.');
        $claims = verify_google_token($token);
        $l = learn_sign_in($claims['email'], $claims['name'] ?? '');
        out(['learner' => $l, 'csrf' => csrf_token()]);

    case 'dev_login':
        if (empty(config()['dev_login']) || PHP_SAPI !== 'cli-server' || !in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) fail(404, 'Not found.');
        $d = body();
        $l = learn_sign_in((string)($d['email'] ?? ''), (string)($d['name'] ?? 'Test learner'));
        out(['learner' => $l, 'csrf' => csrf_token()]);

    case 'code_request':
        $d = body();
        $email = strtolower(trim((string)($d['email'] ?? '')));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Please enter a valid email address.');
        if (!rate_ok('learn_code_ip', 10, 3600) || !rate_ok('learn_code:' . $email, 3, 900)) fail(429, 'Too many codes asked for. Please wait 15 minutes.');
        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        q('UPDATE learn_codes SET used_at = ? WHERE email = ? AND used_at IS NULL', [now(), $email]);
        q('INSERT INTO learn_codes (email, code_hash, attempts, expires_at, created_at) VALUES (?, ?, 0, ?, ?)',
            [$email, hash('sha256', $email . ':' . $code), date('Y-m-d H:i:s', time() + 600), now()]);
        send_mail($email, "Your learning hub code: $code", "Hello,\n\nYour Marzley Tech learning hub sign-in code is $code. It works for 10 minutes.\n\n" .
            "If you didn't ask for it, you can ignore this email.", false);
        out(['ok' => true, 'message' => 'We’ve emailed you a 6-digit code. It works for 10 minutes.']);

    case 'code_verify':
        $d = body();
        $email = strtolower(trim((string)($d['email'] ?? '')));
        $code = preg_replace('/\D/', '', (string)($d['code'] ?? ''));
        if (!rate_ok('learn_verify_ip', 20, 3600)) fail(429, 'Too many tries. Please wait an hour.');
        $row = filter_var($email, FILTER_VALIDATE_EMAIL) ? q('SELECT * FROM learn_codes WHERE email = ? AND used_at IS NULL AND expires_at > ? ORDER BY id DESC LIMIT 1', [$email, now()])->fetch() : null;
        if (!$row || strlen($code) !== 6) fail(401, 'That code is wrong or has expired. Ask for a new one.');
        if ((int)$row['attempts'] >= 5) { q('UPDATE learn_codes SET used_at = ? WHERE id = ?', [now(), $row['id']]); fail(401, 'Too many wrong tries. Ask for a new code.'); }
        if (!hash_equals($row['code_hash'], hash('sha256', $email . ':' . $code))) {
            q('UPDATE learn_codes SET attempts = attempts + 1 WHERE id = ?', [$row['id']]);
            fail(401, 'That code is wrong or has expired. Ask for a new one.');
        }
        q('UPDATE learn_codes SET used_at = ? WHERE id = ?', [now(), $row['id']]);
        $name = mb_substr(trim(preg_replace('/\s+/u', ' ', (string)($d['name'] ?? ''))), 0, 120);
        $l = learn_sign_in($email, $name);
        if ($name !== '' && $l['name'] === '') { q('UPDATE learners SET name = ? WHERE id = ?', [$name, $l['id']]); $_SESSION['learner']['name'] = $l['name'] = $name; }
        out(['learner' => $l, 'csrf' => csrf_token()]);

    case 'logout':
        unset($_SESSION['learner']);
        if (!current_user()) { $_SESSION = []; session_regenerate_id(true); }
        out(['ok' => true]);

    case 'profile':
        $l = need_learner();
        $name = str_in(body(), 'name', 120);
        q('UPDATE learners SET name = ? WHERE id = ?', [$name, $l['id']]);
        $_SESSION['learner']['name'] = $name;
        out(['ok' => true]);

    // ---------- tutorials (free) ----------

    case 'catalog':
        $tracks = q("SELECT id, slug, title, lang, summary, position, published FROM learn_tracks WHERE $pub ORDER BY position, id")->fetchAll();
        $lessons = q("SELECT id, track_id, slug, title, position, published, exercise <> '' AS has_exercise FROM learn_lessons WHERE $pub ORDER BY position, id")->fetchAll();
        foreach ($tracks as &$t) {
            $t['lessons'] = array_values(array_filter($lessons, fn($l) => (int)$l['track_id'] === (int)$t['id']));
        }
        out(['tracks' => $tracks]);

    case 'lesson':
        $t = q("SELECT id, slug, title, lang FROM learn_tracks WHERE slug = ? AND $pub", [(string)($_GET['track'] ?? '')])->fetch();
        $l = $t ? q("SELECT * FROM learn_lessons WHERE track_id = ? AND slug = ? AND $pub", [$t['id'], (string)($_GET['slug'] ?? '')])->fetch() : null;
        if (!$l) fail(404, 'Lesson not found.');
        out(['track' => $t, 'lesson' => $l]);

    case 'progress':
        $l = need_learner();
        $id = (int)(body()['lesson_id'] ?? 0);
        if (!q('SELECT id FROM learn_lessons WHERE id = ?', [$id])->fetch()) fail(404, 'Lesson not found.');
        if (!q('SELECT id FROM learn_progress WHERE learner_id = ? AND lesson_id = ?', [$l['id'], $id])->fetch()) {
            q('INSERT INTO learn_progress (learner_id, lesson_id, created_at) VALUES (?, ?, ?)', [$l['id'], $id, now()]);
        }
        out(['ok' => true]);

    // ---------- notes and books (free) ----------

    case 'notes':
        out(['notes' => q("SELECT id, title, summary, track_id, original_name, size, pages, downloads, published, created_at FROM learn_notes WHERE $pub ORDER BY created_at DESC")->fetchAll()]);

    case 'note':
        $n = q("SELECT * FROM learn_notes WHERE id = ? AND $pub", [(int)($_GET['id'] ?? 0)])->fetch();
        if (!$n) fail(404, 'Notes not found.');
        $dl = !empty($_GET['dl']);
        if ($dl) q('UPDATE learn_notes SET downloads = downloads + 1 WHERE id = ?', [$n['id']]);
        send_file(learn_dir('notes') . '/' . $n['stored_name'], 'application/pdf', $n['original_name'], $dl);

    // ---------- videos (unlocked with M-Pesa) ----------

    case 'videos':
        $rows = q("SELECT * FROM learn_videos WHERE $pub ORDER BY created_at DESC")->fetchAll();
        out(['videos' => array_map(fn($v) => public_video($v, $me), $rows)]);

    case 'video':
        $v = video_row((int)($_GET['id'] ?? 0), $editor);
        $pv = public_video($v, $me);
        $pv['liked'] = $me && q('SELECT id FROM learn_likes WHERE video_id = ? AND learner_id = ?', [$v['id'], $me['id']])->fetch() ? true : false;
        // Comments are for people who unlocked the video
        $pv['comment_list'] = [];
        if ($pv['unlocked']) {
            foreach (q('SELECT c.id, c.body, c.hidden, c.created_at, c.learner_id, l.name, l.email FROM learn_comments c JOIN learners l ON l.id = c.learner_id WHERE c.video_id = ?' . ($editor ? '' : ' AND c.hidden = 0') . ' ORDER BY c.id DESC LIMIT 200', [$v['id']])->fetchAll() as $c) {
                $pv['comment_list'][] = ['id' => (int)$c['id'], 'body' => $c['body'], 'hidden' => (int)$c['hidden'], 'created_at' => $c['created_at'],
                    'name' => public_name((string)$c['name'], (string)$c['email']), 'mine' => $me && (int)$c['learner_id'] === $me['id']];
            }
        }
        out(['video' => $pv]);

    case 'poster':
        $v = video_row((int)($_GET['id'] ?? 0), $editor);
        if (!$v['poster_name']) fail(404, 'No picture.');
        send_file(learn_dir('posters') . '/' . $v['poster_name'], 'image/jpeg', "video-{$v['id']}.jpg", false);

    case 'stream':
        $v = video_row((int)($_GET['id'] ?? 0), $editor);
        if (!learn_unlocked((int)$v['id'], $me)) fail(403, 'Unlock this video to watch it.');
        $seen = $_SESSION['viewed'] ?? [];
        if (!in_array((int)$v['id'], $seen, true) && !$editor) {
            q('UPDATE learn_videos SET views = views + 1 WHERE id = ?', [$v['id']]);
            $_SESSION['viewed'] = array_slice(array_merge($seen, [(int)$v['id']]), -200);
        }
        send_file(learn_dir('videos') . '/' . $v['stored_name'], $v['mime'], "video-{$v['id']}", false);

    case 'unlock':
        $l = need_learner();
        $d = body();
        $v = video_row((int)($d['id'] ?? 0), false);
        if (learn_unlocked((int)$v['id'], $l)) out(['ok' => true, 'status' => 'paid']);
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        if (!$msisdn) fail(400, 'Enter your M-Pesa number, for example 0712 345 678.');
        if (!rate_ok('learn_unlock:' . $l['id'], 6, 900)) fail(429, 'Too many payment prompts. Please wait a few minutes.');
        $checkout = stk_push($msisdn, (int)$v['price'], 'VID' . $v['id'], 'Video unlock');
        q('INSERT INTO learn_payments (checkout_id, video_id, learner_id, amount, phone, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [$checkout, $v['id'], $l['id'], (int)$v['price'], $msisdn, 'pending', now()]);
        out(['ok' => true, 'checkout_id' => $checkout, 'status' => 'pending']);

    case 'unlock_status':
        $l = need_learner();
        $lp = q('SELECT * FROM learn_payments WHERE checkout_id = ? AND learner_id = ?', [(string)($_GET['checkout'] ?? ''), $l['id']])->fetch();
        if (!$lp) fail(404, 'Payment not found.');
        $status = $lp['status'];
        if ($status === 'pending' && ($r = mpesa_result($lp['checkout_id']))) $status = settle_learn_payment($lp['checkout_id'], $r);
        out(['status' => $status, 'unlocked' => learn_unlocked((int)$lp['video_id'], $l)]);

    case 'like':
        $l = need_learner();
        $v = video_row((int)(body()['id'] ?? 0), $editor);
        if (!learn_unlocked((int)$v['id'], $l)) fail(403, 'Unlock this video to like it.');
        if (q('SELECT id FROM learn_likes WHERE video_id = ? AND learner_id = ?', [$v['id'], $l['id']])->fetch()) {
            q('DELETE FROM learn_likes WHERE video_id = ? AND learner_id = ?', [$v['id'], $l['id']]);
            $liked = false;
        } else {
            q('INSERT INTO learn_likes (video_id, learner_id, created_at) VALUES (?, ?, ?)', [$v['id'], $l['id'], now()]);
            $liked = true;
        }
        out(['liked' => $liked, 'likes' => (int)q('SELECT COUNT(*) AS n FROM learn_likes WHERE video_id = ?', [$v['id']])->fetch()['n']]);

    case 'comment':
        $l = need_learner();
        $d = body();
        $v = video_row((int)($d['id'] ?? 0), $editor);
        if (!learn_unlocked((int)$v['id'], $l)) fail(403, 'Unlock this video to comment.');
        $text = trim(preg_replace("/[ \t]+/u", ' ', str_in($d, 'body', 2000)));
        if (!rate_ok('learn_comment:' . $l['id'], 20, 3600)) fail(429, 'You’re commenting very fast. Please wait a little.');
        q('INSERT INTO learn_comments (video_id, learner_id, body, hidden, created_at) VALUES (?, ?, ?, 0, ?)', [$v['id'], $l['id'], $text, now()]);
        out(['ok' => true]);

    case 'comment_delete':
        $l = need_learner();
        $id = (int)(body()['id'] ?? 0);
        $n = $editor ? q('DELETE FROM learn_comments WHERE id = ?', [$id])->rowCount()
                     : q('DELETE FROM learn_comments WHERE id = ? AND learner_id = ?', [$id, $l['id']])->rowCount();
        if (!$n) fail(404, 'Comment not found.');
        out(['ok' => true]);

    // ---------- managing the hub (owner, or staff with the Courses area) ----------

    case 'admin':
        need_editor();
        $videos = array_map(function ($v) {
            $v['unlocks'] = (int)q('SELECT COUNT(*) AS n FROM learn_unlocks WHERE video_id = ?', [$v['id']])->fetch()['n'];
            $v['revenue'] = (int)q('SELECT COALESCE(SUM(amount), 0) AS n FROM learn_unlocks WHERE video_id = ?', [$v['id']])->fetch()['n'];
            $v['likes'] = (int)q('SELECT COUNT(*) AS n FROM learn_likes WHERE video_id = ?', [$v['id']])->fetch()['n'];
            $v['has_poster'] = $v['poster_name'] ? 1 : 0;
            unset($v['stored_name'], $v['poster_name']);
            return $v;
        }, q('SELECT * FROM learn_videos ORDER BY created_at DESC')->fetchAll());
        $comments = q('SELECT c.id, c.video_id, c.body, c.hidden, c.created_at, l.name, l.email, v.title FROM learn_comments c JOIN learners l ON l.id = c.learner_id JOIN learn_videos v ON v.id = c.video_id ORDER BY c.id DESC LIMIT 100')->fetchAll();
        $payments = q('SELECT p.id, p.video_id, p.amount, p.phone, p.status, p.receipt, p.created_at, p.paid_at, l.email, v.title FROM learn_payments p JOIN learners l ON l.id = p.learner_id JOIN learn_videos v ON v.id = p.video_id ORDER BY p.id DESC LIMIT 100')->fetchAll();
        out([
            'tracks' => q('SELECT * FROM learn_tracks ORDER BY position, id')->fetchAll(),
            'lessons' => q('SELECT * FROM learn_lessons ORDER BY track_id, position, id')->fetchAll(),
            'videos' => $videos,
            'notes' => q('SELECT id, title, summary, track_id, original_name, size, downloads, published, created_at FROM learn_notes ORDER BY created_at DESC')->fetchAll(),
            'comments' => $comments, 'payments' => $payments,
            'stats' => [
                'learners' => (int)q('SELECT COUNT(*) AS n FROM learners')->fetch()['n'],
                'new_learners_30' => (int)q('SELECT COUNT(*) AS n FROM learners WHERE created_at >= ?', [date('Y-m-d H:i:s', time() - 30 * 86400)])->fetch()['n'],
                'revenue' => (int)q('SELECT COALESCE(SUM(amount), 0) AS n FROM learn_unlocks')->fetch()['n'],
                'revenue_30' => (int)q('SELECT COALESCE(SUM(amount), 0) AS n FROM learn_unlocks WHERE created_at >= ?', [date('Y-m-d H:i:s', time() - 30 * 86400)])->fetch()['n'],
                'unlocks' => (int)q('SELECT COUNT(*) AS n FROM learn_unlocks')->fetch()['n'],
                'lessons_done' => (int)q('SELECT COUNT(*) AS n FROM learn_progress')->fetch()['n'],
            ],
        ]);

    case 'track_save':
        need_editor();
        $d = body();
        $id = (int)($d['id'] ?? 0);
        $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', str_in($d, 'slug', 60)), '-'));
        $lang = in_array($d['lang'] ?? '', ['html', 'css', 'javascript', 'python', 'sql', 'none'], true) ? $d['lang'] : 'none';
        $args = [$slug, str_in($d, 'title', 120), $lang, str_in($d, 'summary', 500, false), (int)($d['position'] ?? 0), empty($d['published']) ? 0 : 1];
        if (q('SELECT id FROM learn_tracks WHERE slug = ? AND id <> ?', [$slug, $id])->fetch()) fail(400, 'Another track already uses that web address.');
        if ($id) q('UPDATE learn_tracks SET slug = ?, title = ?, lang = ?, summary = ?, position = ?, published = ? WHERE id = ?', array_merge($args, [$id]));
        else q('INSERT INTO learn_tracks (slug, title, lang, summary, position, published) VALUES (?, ?, ?, ?, ?, ?)', $args);
        out(['ok' => true]);

    case 'track_delete':
        need_editor();
        $id = (int)(body()['id'] ?? 0);
        if (q('SELECT id FROM learn_lessons WHERE track_id = ?', [$id])->fetch()) fail(400, 'Delete or move its lessons first.');
        q('DELETE FROM learn_tracks WHERE id = ?', [$id]);
        out(['ok' => true]);

    case 'lesson_save':
        need_editor();
        $d = body();
        $id = (int)($d['id'] ?? 0);
        $track = (int)($d['track_id'] ?? 0);
        if (!q('SELECT id FROM learn_tracks WHERE id = ?', [$track])->fetch()) fail(400, 'Choose a track.');
        $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', str_in($d, 'slug', 80)), '-'));
        if (q('SELECT id FROM learn_lessons WHERE track_id = ? AND slug = ? AND id <> ?', [$track, $slug, $id])->fetch()) fail(400, 'Another lesson in this track already uses that web address.');
        $args = [$track, $slug, str_in($d, 'title', 160), (int)($d['position'] ?? 0), str_in($d, 'body', 60000), str_in($d, 'exercise', 4000, false),
                 str_in($d, 'starter', 20000, false), str_in($d, 'expected', 4000, false), str_in($d, 'must_contain', 500, false), empty($d['published']) ? 0 : 1, now()];
        if ($id) q('UPDATE learn_lessons SET track_id = ?, slug = ?, title = ?, position = ?, body = ?, exercise = ?, starter = ?, expected = ?, must_contain = ?, published = ?, updated_at = ? WHERE id = ?', array_merge($args, [$id]));
        else q('INSERT INTO learn_lessons (track_id, slug, title, position, body, exercise, starter, expected, must_contain, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', $args);
        out(['ok' => true]);

    case 'lesson_delete':
        need_editor();
        $id = (int)(body()['id'] ?? 0);
        q('DELETE FROM learn_progress WHERE lesson_id = ?', [$id]);
        q('DELETE FROM learn_lessons WHERE id = ?', [$id]);
        out(['ok' => true]);

    // Large files arrive in pieces (so hosting upload limits don't matter): start, chunk..., finish
    case 'upload_start':
        $u = need_editor();
        $d = body();
        $kind = ($d['kind'] ?? '') === 'note' ? 'note' : 'video';
        $name = mb_substr(preg_replace('/[^\p{L}\p{N} ._()-]/u', '_', str_in($d, 'name', 200)), 0, 180);
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $size = (int)($d['size'] ?? 0);
        if ($kind === 'note' && $ext !== 'pdf') fail(400, 'Notes and books must be PDF files.');
        if ($kind === 'video' && !isset(VIDEO_TYPES[$ext])) fail(400, 'Videos must be MP4 or WebM. Export MP4 (H.264) from your editor or phone.');
        if ($size < 1 || $size > ($kind === 'note' ? NOTE_MAX : VIDEO_MAX)) fail(400, $kind === 'note' ? 'PDFs can be up to 100 MB.' : 'Videos can be up to 2 GB.');
        $meta = ['title' => str_in($d, 'title', 160), 'summary' => str_in($d, 'summary', 4000, false), 'track_id' => (int)($d['track_id'] ?? 0) ?: null,
                 'price' => max(1, min(100000, (int)($d['price'] ?? 50))), 'duration' => max(0, (int)($d['duration'] ?? 0)), 'published' => empty($d['published']) ? 0 : 1];
        // Clear out uploads that were abandoned more than a day ago
        foreach (glob(learn_dir('tmp') . '/*.part') ?: [] as $old) if (filemtime($old) < time() - 86400) @unlink($old);
        $token = bin2hex(random_bytes(20));
        touch(learn_dir('tmp') . "/$token.part");
        q('INSERT INTO learn_uploads (token, kind, name, size, received, meta, created_by, created_at) VALUES (?, ?, ?, ?, 0, ?, ?, ?)', [$token, $kind, $name, $size, json_encode($meta), $u['email'], now()]);
        out(['token' => $token, 'chunk' => CHUNK_MAX]);

    case 'upload_chunk':
        need_editor();
        $up = q('SELECT * FROM learn_uploads WHERE token = ?', [(string)($_GET['token'] ?? '')])->fetch();
        if (!$up) fail(404, 'Upload not found. Please start again.');
        $offset = (int)($_GET['offset'] ?? -1);
        if ($offset !== (int)$up['received']) out(['received' => (int)$up['received']], 409);   // the browser resumes from here
        $data = file_get_contents('php://input', false, null, 0, CHUNK_MAX + 1);
        if ($data === false || $data === '' || strlen($data) > CHUNK_MAX || $offset + strlen($data) > (int)$up['size']) fail(400, 'That piece of the file is the wrong size.');
        file_put_contents(learn_dir('tmp') . "/{$up['token']}.part", $data, FILE_APPEND | LOCK_EX);
        $received = $offset + strlen($data);
        q('UPDATE learn_uploads SET received = ? WHERE id = ?', [$received, $up['id']]);
        out(['received' => $received]);

    case 'upload_finish':
        need_editor();
        $up = q('SELECT * FROM learn_uploads WHERE token = ?', [(string)(body()['token'] ?? '')])->fetch();
        if (!$up) fail(404, 'Upload not found. Please start again.');
        $tmp = learn_dir('tmp') . "/{$up['token']}.part";
        $ext = strtolower(pathinfo($up['name'], PATHINFO_EXTENSION));
        if ((int)$up['received'] !== (int)$up['size'] || filesize($tmp) !== (int)$up['size']) fail(400, 'The upload is not complete yet.');
        if (!looks_like($tmp, $ext)) { @unlink($tmp); q('DELETE FROM learn_uploads WHERE id = ?', [$up['id']]); fail(400, 'That file is not a real ' . ($up['kind'] === 'note' ? 'PDF.' : 'MP4 or WebM video.')); }
        $stored = bin2hex(random_bytes(16)) . '.' . $ext;
        $m = json_decode($up['meta'], true);
        if ($up['kind'] === 'note') {
            rename($tmp, learn_dir('notes') . "/$stored");
            q('INSERT INTO learn_notes (title, summary, track_id, stored_name, original_name, size, downloads, published, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)',
                [$m['title'], mb_substr($m['summary'], 0, 500), $m['track_id'], $stored, $up['name'], $up['size'], $m['published'], now()]);
        } else {
            rename($tmp, learn_dir('videos') . "/$stored");
            q('INSERT INTO learn_videos (title, summary, track_id, stored_name, mime, size, duration, price, views, published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)',
                [$m['title'], $m['summary'], $m['track_id'], $stored, VIDEO_TYPES[$ext], $up['size'], $m['duration'], $m['price'], $m['published'], now()]);
        }
        $newId = (int)db()->lastInsertId();
        q('DELETE FROM learn_uploads WHERE id = ?', [$up['id']]);
        out(['ok' => true, 'id' => $newId]);

    case 'poster_save':
        // A still from the video (the portal grabs it in the browser) or a picture you choose, as a JPEG data URL
        need_editor();
        $d = body();
        $v = video_row((int)($d['id'] ?? 0), true);
        if (!preg_match('#^data:image/jpeg;base64,([A-Za-z0-9+/=]+)$#', (string)($d['data'] ?? ''), $mm)) fail(400, 'Choose a JPEG picture.');
        $bin = base64_decode($mm[1], true);
        if ($bin === false || strlen($bin) > 800 * 1024 || !str_starts_with($bin, "\xFF\xD8\xFF")) fail(400, 'The picture must be a JPEG under 800 KB.');
        $name = bin2hex(random_bytes(16)) . '.jpg';
        file_put_contents(learn_dir('posters') . "/$name", $bin);
        if ($v['poster_name']) @unlink(learn_dir('posters') . '/' . $v['poster_name']);
        q('UPDATE learn_videos SET poster_name = ? WHERE id = ?', [$name, $v['id']]);
        out(['ok' => true]);

    case 'video_save':
        need_editor();
        $d = body();
        $v = video_row((int)($d['id'] ?? 0), true);
        q('UPDATE learn_videos SET title = ?, summary = ?, track_id = ?, price = ?, published = ? WHERE id = ?',
            [str_in($d, 'title', 160), str_in($d, 'summary', 4000, false), (int)($d['track_id'] ?? 0) ?: null, max(1, min(100000, (int)($d['price'] ?? 50))), empty($d['published']) ? 0 : 1, $v['id']]);
        out(['ok' => true]);

    case 'video_delete':
        need_editor();
        $v = video_row((int)(body()['id'] ?? 0), true);
        if (q('SELECT id FROM learn_unlocks WHERE video_id = ?', [$v['id']])->fetch()) fail(400, 'People have paid for this video, so it can’t be deleted. Unpublish it instead (they keep access).');
        @unlink(learn_dir('videos') . '/' . $v['stored_name']);
        if ($v['poster_name']) @unlink(learn_dir('posters') . '/' . $v['poster_name']);
        foreach (['learn_comments', 'learn_likes', 'learn_payments'] as $t) q("DELETE FROM $t WHERE video_id = ?", [$v['id']]);
        q('DELETE FROM learn_videos WHERE id = ?', [$v['id']]);
        out(['ok' => true]);

    case 'note_save':
        need_editor();
        $d = body();
        $n = q('SELECT id FROM learn_notes WHERE id = ?', [(int)($d['id'] ?? 0)])->fetch();
        if (!$n) fail(404, 'Notes not found.');
        q('UPDATE learn_notes SET title = ?, summary = ?, track_id = ?, published = ? WHERE id = ?',
            [str_in($d, 'title', 160), str_in($d, 'summary', 500, false), (int)($d['track_id'] ?? 0) ?: null, empty($d['published']) ? 0 : 1, $n['id']]);
        out(['ok' => true]);

    case 'note_delete':
        need_editor();
        $n = q('SELECT * FROM learn_notes WHERE id = ?', [(int)(body()['id'] ?? 0)])->fetch();
        if (!$n) fail(404, 'Notes not found.');
        @unlink(learn_dir('notes') . '/' . $n['stored_name']);
        q('DELETE FROM learn_notes WHERE id = ?', [$n['id']]);
        out(['ok' => true]);

    case 'comment_hide':
        need_editor();
        $d = body();
        q('UPDATE learn_comments SET hidden = ? WHERE id = ?', [empty($d['hidden']) ? 0 : 1, (int)($d['id'] ?? 0)]);
        out(['ok' => true]);

    default:
        fail(404, 'Unknown action.');
}
