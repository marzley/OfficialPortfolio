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
const LEARN_GET = ['me', 'dashboard', 'avatar', 'catalog', 'lesson', 'lesson_social', 'videos', 'video', 'notes', 'note', 'poster', 'stream', 'unlock_status', 'final_test', 'leaderboard', 'email_off', 'classes', 'class_get', 'class_info', 'notes_pay_status', 'notes_access', 'admin'];
const VIDEO_TYPES = ['mp4' => 'video/mp4', 'm4v' => 'video/mp4', 'webm' => 'video/webm'];
const VIDEO_MAX = 2048 * 1024 * 1024;   // 2 GB
const NOTE_MAX = 100 * 1024 * 1024;     // 100 MB
const CHUNK_MAX = 8 * 1024 * 1024;

if ($method === 'POST' && !in_array($action, ['code_request', 'code_verify', 'google', 'dev_login', 'password_login'], true)) check_csrf();
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
        if ($me) {
            award_points((int)$me['id'], 'signup', 'signup', 'Created your account');   // accounts made before points existed
            $row = q('SELECT id, name, phone, avatar, created_at, leaderboard, weekly_email FROM learners WHERE id = ?', [$me['id']])->fetch();
            $me += ['phone' => $row['phone'] ?? '', 'avatar' => $row ? avatar_url($row) : null, 'since' => $row['created_at'] ?? '',
                    'learner_code' => 'L-' . str_pad((string)$me['id'], 5, '0', STR_PAD_LEFT), 'points' => learner_points((int)$me['id']),
                    'password' => password_status($me['email']) + ['fresh' => fresh_sign_in()],
                    'settings' => ['leaderboard' => (bool)($row['leaderboard'] ?? 0), 'weekly_email' => (bool)($row['weekly_email'] ?? 1)]];
        }
        out(['learner' => $me, 'csrf' => csrf_token(), 'editor' => $editor, 'progress' => $progress,
             'google_client_id' => config()['google_client_id'], 'mpesa' => (bool)mpesa_config(), 'notes_prices' => notes_pdf_prices(),
             'notes_bundles' => array_values(notes_bundles()), 'whatsapp_updates' => setting('whatsapp_updates_url', '')]);

    case 'google':
        $token = (string)(body()['credential'] ?? '');
        if ($token === '') fail(400, 'Missing Google sign-in.');
        $claims = verify_google_token($token);
        $l = learn_sign_in($claims['email'], $claims['name'] ?? '');
        mark_fresh_sign_in();
        out(['learner' => $l, 'csrf' => csrf_token()]);

    case 'password_login':
        $d = body();
        $login = strtolower(trim((string)($d['login'] ?? '')));
        if ($login === '' || (string)($d['password'] ?? '') === '') fail(400, 'Enter your username or email and your password.');
        if (!rate_ok('pw_ip', 20, 900) || !rate_ok('pw_who:' . $login, 6, 900)) fail(429, 'Too many tries. Please wait 15 minutes, or use “Forgot password?”.');
        $email = password_check($login, (string)$d['password']);
        if (!$email) { audit('password_failed', mb_substr($login, 0, 60), 'visitor'); fail(401, 'Wrong username/email or password.'); }
        out(['learner' => learn_sign_in($email, ''), 'csrf' => csrf_token()]);

    case 'password_set':
        $l = need_learner();
        out(['ok' => true, 'password' => password_save($l['email'], (string)$l['name'], body())]);

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
        mark_fresh_sign_in();
        out(['learner' => $l, 'csrf' => csrf_token()]);

    case 'logout':
        unset($_SESSION['learner']);
        if (!current_user()) { $_SESSION = []; session_regenerate_id(true); }
        out(['ok' => true]);

    case 'profile':
        // Name and phone can change; the email (used to sign in) and learner ID can't
        $l = need_learner();
        $d = body();
        $name = str_in($d, 'name', 120);
        if (trim($name) === '') fail(400, 'Please enter your name.');
        $set = ['name' => $name];
        if (array_key_exists('phone', $d)) {
            $phone = trim((string)$d['phone']);
            if ($phone !== '' && !normalise_phone($phone)) fail(400, 'Enter a Kenyan phone number, for example 0712 345 678.');
            $set['phone'] = $phone !== '' ? '0' . substr((string)normalise_phone($phone), 3) : '';
            q('UPDATE learners SET name = ?, phone = ? WHERE id = ?', [$name, $set['phone'], $l['id']]);
        } else q('UPDATE learners SET name = ? WHERE id = ?', [$name, $l['id']]);
        $_SESSION['learner']['name'] = $name;
        out(['ok' => true] + $set);

    case 'settings':
        // Leaderboard (opt-in) and the weekly progress email
        $l = need_learner();
        $d = body();
        if (array_key_exists('leaderboard', $d)) q('UPDATE learners SET leaderboard = ? WHERE id = ?', [empty($d['leaderboard']) ? 0 : 1, $l['id']]);
        if (array_key_exists('weekly_email', $d)) q('UPDATE learners SET weekly_email = ? WHERE id = ?', [empty($d['weekly_email']) ? 0 : 1, $l['id']]);
        $r = q('SELECT leaderboard, weekly_email FROM learners WHERE id = ?', [$l['id']])->fetch();
        out(['ok' => true, 'settings' => ['leaderboard' => (bool)$r['leaderboard'], 'weekly_email' => (bool)$r['weekly_email']]]);

    case 'classes':
        // Classes I teach and classes I've joined
        $l = need_learner();
        $own = q('SELECT c.*, (SELECT COUNT(*) FROM learn_class_members m WHERE m.class_id = c.id) AS members, t.title AS track_title FROM learn_classes c LEFT JOIN learn_tracks t ON t.id = c.track_id WHERE c.owner_id = ? ORDER BY c.id DESC', [$l['id']])->fetchAll();
        $joined = q('SELECT c.id, c.name, c.code, t.slug AS track, t.title AS track_title, o.name AS tutor FROM learn_class_members m JOIN learn_classes c ON c.id = m.class_id LEFT JOIN learn_tracks t ON t.id = c.track_id JOIN learners o ON o.id = c.owner_id WHERE m.learner_id = ? ORDER BY m.id DESC', [$l['id']])->fetchAll();
        out(['own' => array_map(fn($c) => ['id' => (int)$c['id'], 'name' => $c['name'], 'code' => $c['code'], 'members' => (int)$c['members'], 'track_title' => $c['track_title']], $own), 'joined' => $joined]);

    case 'class_create':
        $l = need_learner();
        $d = body();
        $name = trim(str_in($d, 'name', 120));
        if ($name === '') fail(400, 'Give the class a name, for example “Form 3 Computer Studies” or “ICT cohort 5”.');
        if ((int)q('SELECT COUNT(*) FROM learn_classes WHERE owner_id = ?', [$l['id']])->fetchColumn() >= 20) fail(400, 'You can run up to 20 classes. Delete an old one first.');
        $tid = null;
        if (!empty($d['track'])) {
            $t = q('SELECT id FROM learn_tracks WHERE slug = ? AND published = 1', [(string)$d['track']])->fetch();
            if (!$t) fail(404, 'Subject not found.');
            $tid = (int)$t['id'];
        }
        $code = new_class_code();
        q('INSERT INTO learn_classes (owner_id, name, code, track_id, created_at) VALUES (?, ?, ?, ?, ?)', [$l['id'], $name, $code, $tid, now()]);
        out(['ok' => true, 'id' => (int)q('SELECT id FROM learn_classes WHERE code = ?', [$code])->fetchColumn(), 'code' => $code]);

    case 'class_get':
        $l = need_learner();
        $c = q('SELECT * FROM learn_classes WHERE id = ? AND owner_id = ?', [(int)($_GET['id'] ?? 0), $l['id']])->fetch();
        if (!$c) fail(404, 'Class not found.');
        out(['class' => learn_class_report($c)]);

    case 'class_info':
        // What a student sees before joining
        $c = q('SELECT c.name, c.code, t.title AS track_title, o.name AS tutor, o.email AS tutor_email FROM learn_classes c LEFT JOIN learn_tracks t ON t.id = c.track_id JOIN learners o ON o.id = c.owner_id WHERE c.code = ?', [strtoupper((string)($_GET['code'] ?? ''))])->fetch();
        if (!$c) fail(404, 'That class link isn’t valid. Ask your tutor for a new one.');
        out(['class' => ['name' => $c['name'], 'code' => $c['code'], 'track_title' => $c['track_title'], 'tutor' => learner_public_name((string)$c['tutor'], (string)$c['tutor_email'])]]);

    case 'class_join':
        $l = need_learner();
        $c = q('SELECT id, owner_id, name FROM learn_classes WHERE code = ?', [strtoupper((string)(body()['code'] ?? ''))])->fetch();
        if (!$c) fail(404, 'That class link isn’t valid. Ask your tutor for a new one.');
        if ((int)$c['owner_id'] === (int)$l['id']) fail(400, 'This is your own class: share the link with your students.');
        if (!q('SELECT id FROM learn_class_members WHERE class_id = ? AND learner_id = ?', [$c['id'], $l['id']])->fetch()) {
            if ((int)q('SELECT COUNT(*) FROM learn_class_members WHERE class_id = ?', [$c['id']])->fetchColumn() >= 300) fail(400, 'This class is full.');
            q('INSERT INTO learn_class_members (class_id, learner_id, joined_at) VALUES (?, ?, ?)', [$c['id'], $l['id'], now()]);
        }
        out(['ok' => true, 'name' => $c['name']]);

    case 'class_leave':
        $l = need_learner();
        q('DELETE FROM learn_class_members WHERE class_id = ? AND learner_id = ?', [(int)(body()['id'] ?? 0), $l['id']]);
        out(['ok' => true]);

    case 'class_remove':
        $l = need_learner();
        $d = body();
        $c = q('SELECT id FROM learn_classes WHERE id = ? AND owner_id = ?', [(int)($d['id'] ?? 0), $l['id']])->fetch();
        if (!$c) fail(404, 'Class not found.');
        if (!empty($d['learner_id'])) q('DELETE FROM learn_class_members WHERE class_id = ? AND learner_id = ?', [$c['id'], (int)$d['learner_id']]);
        else { q('DELETE FROM learn_class_members WHERE class_id = ?', [$c['id']]); q('DELETE FROM learn_classes WHERE id = ?', [$c['id']]); }
        out(['ok' => true]);

    case 'leaderboard':
        out(learn_leaderboard(20, $me ? (int)$me['id'] : 0));

    case 'email_off':
        // One-click link in the weekly email
        $t = (string)($_GET['t'] ?? '');
        $row = strlen($t) === 48 ? q('SELECT id FROM learners WHERE mail_token = ?', [$t])->fetch() : null;
        if ($row) q('UPDATE learners SET weekly_email = 0 WHERE id = ?', [$row['id']]);
        header('Content-Type: text/html; charset=utf-8');
        page_message('Weekly emails', 'fa-envelope', $row ? 'Weekly emails turned off' : 'Link not recognised',
            $row ? '<p>You won’t get the weekly learning email any more. You can turn it back on from your dashboard.</p><p><a class="btn btn-solid" href="../learn/?page=me">Open my dashboard</a></p>' : '<p>This link isn’t valid. You can change email settings on your dashboard.</p><p><a class="btn btn-solid" href="../learn/?page=me">Open my dashboard</a></p>');
        exit;

    case 'avatar_save':
        $l = need_learner();
        if (!rate_ok('avatar:' . $l['id'], 10, 3600)) fail(429, 'Too many photo changes. Please wait a little.');
        save_avatar((int)$l['id'], (string)(body()['image'] ?? ''));
        out(['ok' => true, 'avatar' => avatar_url(q('SELECT id, avatar FROM learners WHERE id = ?', [$l['id']])->fetch())]);

    case 'avatar_remove':
        $l = need_learner();
        remove_avatar((int)$l['id']);
        out(['ok' => true]);

    case 'avatar':
        $a = (string)q('SELECT avatar FROM learners WHERE id = ?', [(int)($_GET['id'] ?? 0)])->fetchColumn();
        if ($a === '' || !preg_match('/^[a-f0-9]{24}\.jpg$/', $a)) fail(404, 'No photo.');
        header_remove('X-Robots-Tag');
        send_file(learn_dir('avatars') . '/' . $a, 'image/jpeg', 'photo.jpg', false);

    // ---------- points and the learner's dashboard ----------

    case 'points':
        // Things only the browser sees: understanding a section, watching a video to the end, running code
        $l = need_learner();
        $d = body();
        $kind = (string)($d['kind'] ?? '');
        if (!in_array($kind, ['understood', 'video', 'code'], true)) fail(400, 'Unknown action.');
        if (!rate_ok('points:' . $l['id'], 120, 3600)) out(['points' => 0, 'total' => learner_points((int)$l['id'])]);
        $lesson = null;
        if (!empty($d['lesson_id'])) {
            $lesson = q('SELECT ls.id, ls.title, ls.slug, t.slug AS track FROM learn_lessons ls JOIN learn_tracks t ON t.id = ls.track_id WHERE ls.id = ? AND ls.published = 1', [(int)$d['lesson_id']])->fetch();
            if (!$lesson) fail(404, 'Lesson not found.');
        }
        $link = $lesson ? "?track={$lesson['track']}&lesson={$lesson['slug']}" : '';
        if ($kind === 'understood') {
            $sec = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($d['section'] ?? '')));
            if (!$lesson || $sec === '') fail(400, 'Which section?');
            $got = award_points((int)$l['id'], 'understood', $lesson['id'] . ':' . substr($sec, 0, 60), 'Understood a section of “' . $lesson['title'] . '”', $link);
        } elseif ($kind === 'video') {
            $vid = preg_replace('/[^A-Za-z0-9_-]/', '', (string)($d['video'] ?? ''));
            if ($vid === '') fail(400, 'Which video?');
            $title = mb_substr(trim((string)($d['title'] ?? '')), 0, 120);
            if (str_starts_with($vid, 'v-')) {
                // a paid video: only counts once it's unlocked
                $v = q('SELECT id, title FROM learn_videos WHERE id = ?', [(int)substr($vid, 2)])->fetch();
                if (!$v || !learn_unlocked((int)$v['id'], $l)) fail(403, 'Unlock this video first.');
                $title = $v['title'];
                $link = '?video=' . (int)$v['id'];
            }
            $got = award_points((int)$l['id'], 'video', $vid, 'Watched a full video' . ($title !== '' ? ': ' . $title : ($lesson ? ' in “' . $lesson['title'] . '”' : '')), $link);
        } else {
            $got = award_points((int)$l['id'], 'code', date('YmdHis') . bin2hex(random_bytes(3)), 'Ran code' . ($lesson ? ' in “' . $lesson['title'] . '”' : ' in the practice editor'), $link);
        }
        out(['points' => $got, 'total' => learner_points((int)$l['id'])]);

    case 'dashboard':
        $l = need_learner();
        $id = (int)$l['id'];
        learn_certificates_sync($id);
        $by = [];
        foreach (q('SELECT kind, COUNT(*) AS n, SUM(points) AS p FROM learn_points WHERE learner_id = ? GROUP BY kind', [$id])->fetchAll() as $r) $by[$r['kind']] = ['count' => (int)$r['n'], 'points' => (int)$r['p']];
        $activity = array_map(fn($r) => ['kind' => $r['kind'], 'points' => (int)$r['points'], 'text' => $r['detail'], 'link' => $r['link'], 'at' => $r['created_at']],
            q('SELECT kind, points, detail, link, created_at FROM learn_points WHERE learner_id = ? ORDER BY id DESC LIMIT 60', [$id])->fetchAll());
        // Replies other people (or Marzley Tech) wrote under this learner's comments
        foreach (q('SELECT r.body, r.is_staff, r.created_at, w.name, w.email, ls.title, ls.slug, t.slug AS track FROM learn_reviews r JOIN learn_reviews p ON p.id = r.parent_id
                    JOIN learners w ON w.id = r.learner_id JOIN learn_lessons ls ON ls.id = r.lesson_id JOIN learn_tracks t ON t.id = ls.track_id
                    WHERE p.learner_id = ? AND r.learner_id <> ? AND r.hidden = 0 ORDER BY r.id DESC LIMIT 20', [$id, $id])->fetchAll() as $r) {
            $activity[] = ['kind' => 'replied', 'points' => 0, 'text' => ($r['is_staff'] ? 'Marzley Tech' : public_name($r['name'], $r['email'])) . ' replied to your comment on “' . $r['title'] . '”: ' . mb_substr($r['body'], 0, 140),
                           'link' => "?track={$r['track']}&lesson={$r['slug']}#reviews", 'at' => $r['created_at']];
        }
        usort($activity, fn($a, $b) => strcmp($b['at'], $a['at']));
        $recent = q('SELECT v.lesson_id, v.visited_at, ls.title, ls.slug, t.slug AS track, t.title AS track_title FROM learn_visits v JOIN learn_lessons ls ON ls.id = v.lesson_id JOIN learn_tracks t ON t.id = ls.track_id
                     WHERE v.learner_id = ? AND ls.published = 1 ORDER BY v.visited_at DESC LIMIT 8', [$id])->fetchAll();
        $badges = learn_badges($id);
        out(['points' => learner_points($id), 'by_kind' => $by, 'certificates' => learn_certificates($id), 'tests_ready' => learn_tests_ready($id), 'badges' => $badges['badges'], 'streak' => $badges['streak'], 'activity' => array_slice($activity, 0, 60), 'recent' => $recent,
             'rules' => LEARN_POINTS, 'daily' => LEARN_POINTS_DAILY]);

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
        if ($me && !q('UPDATE learn_visits SET visited_at = ? WHERE learner_id = ? AND lesson_id = ?', [now(), $me['id'], $l['id']])->rowCount()) {
            try { q('INSERT INTO learn_visits (learner_id, lesson_id, visited_at) VALUES (?, ?, ?)', [$me['id'], $l['id'], now()]); } catch (PDOException $e) { /* opened twice at once */ }
        }
        out(['track' => $t, 'lesson' => $l]);

    case 'progress':
        $l = need_learner();
        $id = (int)(body()['lesson_id'] ?? 0);
        $ls = q('SELECT ls.id, ls.title, ls.slug, t.slug AS track, ls.track_id FROM learn_lessons ls JOIN learn_tracks t ON t.id = ls.track_id WHERE ls.id = ?', [$id])->fetch();
        if (!$ls) fail(404, 'Lesson not found.');
        if (!q('SELECT id FROM learn_progress WHERE learner_id = ? AND lesson_id = ?', [$l['id'], $id])->fetch()) {
            q('INSERT INTO learn_progress (learner_id, lesson_id, created_at) VALUES (?, ?, ?)', [$l['id'], $id, now()]);
        }
        $got = award_points((int)$l['id'], 'complete', (string)$id, 'Completed “' . $ls['title'] . '”', "?track={$ls['track']}&lesson={$ls['slug']}");
        // Finishing the last lesson of a subject earns its certificate (and its points)
        $cert = learn_certificate_check((int)$l['id'], (int)$ls['track_id']);
        if ($cert) $got += LEARN_POINTS['certificate'];
        // Every lesson done but the final test is still to come
        $ready = $cert ? null : (array_values(array_filter(learn_tests_ready((int)$l['id']), fn($x) => $x['track'] === $ls['track']))[0] ?? null);
        out(['ok' => true, 'points' => $got, 'certificate' => $cert, 'final_test' => $ready]);

    case 'final_test':
        // A fresh set of questions from the subject's lesson quizzes; the answers stay on the server
        $l = need_learner();
        $t = q('SELECT id, slug, title FROM learn_tracks WHERE slug = ? AND published = 1', [(string)($_GET['track'] ?? '')])->fetch();
        if (!$t) fail(404, 'Subject not found.');
        $tid = (int)$t['id'];
        $cert = q('SELECT * FROM learn_certificates WHERE learner_id = ? AND track_id = ?', [$l['id'], $tid])->fetch();
        if ($cert) out(['status' => 'certified', 'certificate' => learn_certificate_row($cert), 'title' => $t['title']]);
        $total = (int)q('SELECT COUNT(*) FROM learn_lessons WHERE track_id = ? AND published = 1', [$tid])->fetchColumn();
        $done = (int)q('SELECT COUNT(*) FROM learn_progress p JOIN learn_lessons ls ON ls.id = p.lesson_id WHERE p.learner_id = ? AND ls.track_id = ? AND ls.published = 1', [$l['id'], $tid])->fetchColumn();
        if ($done < $total) out(['status' => 'lessons', 'title' => $t['title'], 'done' => $done, 'total' => $total]);
        if (!learn_final_needed((int)$l['id'], $tid)) {
            $c = learn_certificate_check((int)$l['id'], $tid);
            out(['status' => 'certified', 'certificate' => $c, 'title' => $t['title']]);
        }
        if (!rate_ok('final_start:' . $l['id'], 12, 3600)) fail(429, 'You’ve started a lot of tests this hour. Revise the lessons and try again a little later.');
        $bank = learn_quiz_bank($tid);
        shuffle($bank);
        $pick = array_slice($bank, 0, FINAL_TEST_SIZE);
        $_SESSION['final_test'][$tid] = ['ids' => array_column($pick, 'id'), 'at' => time()];
        out(['status' => 'test', 'title' => $t['title'], 'track' => $t['slug'], 'pass' => FINAL_TEST_PASS,
             'questions' => array_map(fn($x) => ['q' => $x['q'], 'lesson' => $x['lesson']], $pick)]);

    case 'final_submit':
        $l = need_learner();
        $d = body();
        $t = q('SELECT id, slug, title FROM learn_tracks WHERE slug = ? AND published = 1', [(string)($d['track'] ?? '')])->fetch();
        if (!$t) fail(404, 'Subject not found.');
        $tid = (int)$t['id'];
        $att = $_SESSION['final_test'][$tid] ?? null;
        if (!$att || $att['at'] < time() - 7200) fail(409, 'This test has expired. Start it again for a fresh set of questions.');
        unset($_SESSION['final_test'][$tid]);
        $byId = [];
        foreach (learn_quiz_bank($tid) as $x) $byId[$x['id']] = $x;
        $answers = is_array($d['answers'] ?? null) ? array_values($d['answers']) : [];
        $score = 0; $results = [];
        foreach ($att['ids'] as $i => $qid) {
            $x = $byId[$qid] ?? null;
            if (!$x) continue;   // the lesson changed since the test started: that question doesn't count
            $given = quiz_norm(mb_substr((string)($answers[$i] ?? ''), 0, 300));
            $ok = $given !== '' && in_array($given, array_map('quiz_norm', $x['a']), true);
            if ($ok) $score++;
            $results[] = ['correct' => $ok, 'lesson' => $x['lesson'], 'link' => "?track={$t['slug']}&lesson={$x['slug']}"];
        }
        $count = count($results);
        $passed = $count > 0 && $score * 100 >= FINAL_TEST_PASS * $count;
        q('INSERT INTO learn_final_tests (learner_id, track_id, score, total, passed, created_at) VALUES (?, ?, ?, ?, ?, ?)', [$l['id'], $tid, $score, $count, (int)$passed, now()]);
        $cert = $passed ? learn_certificate_check((int)$l['id'], $tid) : null;
        out(['score' => $score, 'total' => $count, 'passed' => $passed, 'pass' => FINAL_TEST_PASS, 'results' => $results, 'certificate' => $cert]);

    // ---------- notes and books (free) ----------

    case 'notes':
        out(['notes' => q("SELECT id, title, summary, track_id, original_name, size, pages, downloads, published, created_at FROM learn_notes WHERE $pub ORDER BY created_at DESC")->fetchAll()]);

    case 'note':
        $n = q("SELECT * FROM learn_notes WHERE id = ? AND $pub", [(int)($_GET['id'] ?? 0)])->fetch();
        if (!$n) fail(404, 'Notes not found.');
        $dl = !empty($_GET['dl']);
        if ($dl) q('UPDATE learn_notes SET downloads = downloads + 1 WHERE id = ?', [$n['id']]);
        send_file(learn_dir('notes') . '/' . $n['stored_name'], 'application/pdf', $n['original_name'], $dl);

    // ---------- course notes as a PDF (paid with M-Pesa; reading online stays free) ----------
    // No account is needed: the buyer gets a secret token once Safaricom confirms the payment.
    // The token is kept in their browser, and can be recovered with the phone number and M-Pesa receipt.

    case 'notes_pay':
        $d = body();
        $t = q('SELECT id, slug, title FROM learn_tracks WHERE slug = ? AND published = 1', [(string)($d['track'] ?? '')])->fetch();
        if (!$t) fail(404, 'Those notes were not found.');
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        if (!$msisdn) fail(400, 'Enter your M-Pesa number, for example 0712 345 678.');
        if (!rate_ok('notes_pay', 6, 900)) fail(429, 'Too many payment prompts. Please wait a few minutes and try again.');
        $cp = coupon_apply((string)($d['coupon'] ?? ''), 'notes', notes_pdf_track_price((int)$t['id']));
        $price = $cp['price'];
        $checkout = stk_push($msisdn, $price, 'NOTES' . $t['id'], 'Notes PDF');
        q('INSERT INTO learn_note_payments (checkout_id, track_id, amount, phone, token, status, coupon, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [$checkout, $t['id'], $price, $msisdn, bin2hex(random_bytes(24)), 'pending', $cp['code'], now()]);
        $_SESSION['note_checkouts'] = array_slice(array_merge($_SESSION['note_checkouts'] ?? [], [$checkout]), -20);
        out(['ok' => true, 'checkout_id' => $checkout, 'amount' => $price, 'status' => 'pending']);

    case 'notes_pass_pay':
        // Monthly pass: one payment unlocks every subject's PDF for NOTES_PASS_DAYS days (stored with track_id 0)
        $d = body();
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        if (!$msisdn) fail(400, 'Enter your M-Pesa number, for example 0712 345 678.');
        $plan = notes_pass_plans()[(string)($d['plan'] ?? '30')] ?? null;
        if (!$plan) fail(400, 'Choose a pass.');
        if (!rate_ok('notes_pay', 6, 900)) fail(429, 'Too many payment prompts. Please wait a few minutes and try again.');
        $cp = coupon_apply((string)($d['coupon'] ?? ''), 'pass', $plan['price']);
        $price = $cp['price'];
        $checkout = stk_push($msisdn, $price, 'NOTESPASS', 'Notes pass');
        q('INSERT INTO learn_note_payments (checkout_id, track_id, amount, phone, token, status, pass_days, coupon, created_at) VALUES (?, 0, ?, ?, ?, ?, ?, ?, ?)',
            [$checkout, $price, $msisdn, bin2hex(random_bytes(24)), 'pending', $plan['days'], $cp['code'], now()]);
        $_SESSION['note_checkouts'] = array_slice(array_merge($_SESSION['note_checkouts'] ?? [], [$checkout]), -20);
        out(['ok' => true, 'checkout_id' => $checkout, 'amount' => $price, 'status' => 'pending']);

    case 'notes_bundle_pay':
        // Several related subjects' PDFs at a bundle price (kept for good, like single PDFs)
        $d = body();
        $b = notes_bundles()[(string)($d['bundle'] ?? '')] ?? null;
        if (!$b) fail(404, 'That bundle was not found.');
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        if (!$msisdn) fail(400, 'Enter your M-Pesa number, for example 0712 345 678.');
        if (!rate_ok('notes_pay', 6, 900)) fail(429, 'Too many payment prompts. Please wait a few minutes and try again.');
        $cp = coupon_apply((string)($d['coupon'] ?? ''), 'bundle', $b['price']);
        $price = $cp['price'];
        $checkout = stk_push($msisdn, $price, 'NOTESBUNDLE', 'Notes bundle');
        q('INSERT INTO learn_note_payments (checkout_id, track_id, amount, phone, token, status, bundle, coupon, created_at) VALUES (?, 0, ?, ?, ?, ?, ?, ?, ?)',
            [$checkout, $price, $msisdn, bin2hex(random_bytes(24)), 'pending', $b['slug'], $cp['code'], now()]);
        $_SESSION['note_checkouts'] = array_slice(array_merge($_SESSION['note_checkouts'] ?? [], [$checkout]), -20);
        out(['ok' => true, 'checkout_id' => $checkout, 'amount' => $price, 'status' => 'pending']);

    case 'coupon_check':
        // Preview the price with a coupon before paying
        $d = body();
        if (!rate_ok('coupon_check', 30, 600)) fail(429, 'Too many tries. Please wait a few minutes.');
        $kind = (string)($d['kind'] ?? '');
        if ($kind === 'notes') {
            $t = q('SELECT id FROM learn_tracks WHERE slug = ? AND published = 1', [(string)($d['track'] ?? '')])->fetch();
            if (!$t) fail(404, 'Those notes were not found.');
            $base = notes_pdf_track_price((int)$t['id']);
        } elseif ($kind === 'pass') {
            $plan = notes_pass_plans()[(string)($d['plan'] ?? '30')] ?? null;
            if (!$plan) fail(400, 'Choose a pass.');
            $base = $plan['price'];
        } elseif ($kind === 'bundle') {
            $b = notes_bundles()[(string)($d['bundle'] ?? '')] ?? null;
            if (!$b) fail(404, 'That bundle was not found.');
            $base = $b['price'];
        } else fail(400, 'Unknown purchase.');
        $cp = coupon_apply((string)($d['coupon'] ?? ''), $kind, $base);
        out(['ok' => true, 'price' => $cp['price'], 'was' => $base, 'percent' => $cp['percent'], 'code' => $cp['code']]);

    case 'notes_pay_status':
        $checkout = (string)($_GET['checkout'] ?? '');
        // Only the browser that started the payment can collect its download token
        if (!in_array($checkout, $_SESSION['note_checkouts'] ?? [], true)) fail(404, 'Payment not found.');
        $np = q('SELECT p.*, t.slug FROM learn_note_payments p LEFT JOIN learn_tracks t ON t.id = p.track_id WHERE p.checkout_id = ?', [$checkout])->fetch();
        if (!$np) fail(404, 'Payment not found.');
        $status = $np['status'];
        if ($status === 'pending' && ($r = mpesa_result($checkout))) $status = settle_note_payment($checkout, $r);
        // "Check now": if Safaricom says the prompt was cancelled or failed, say so instead of waiting
        if ($status === 'pending' && !empty($_GET['check']) && strtotime($np['created_at']) < time() - 15 && rate_ok('notes_check', 30, 600)) {
            $code = stk_query($checkout);
            if ($code !== null && $code !== '0' && $code !== '4999') {
                q("UPDATE learn_note_payments SET status = 'failed' WHERE id = ? AND status = 'pending'", [$np['id']]);
                $status = 'failed';
            }
        }
        if ($status === 'mismatch') $status = 'failed';
        out(['status' => $status] + ($status === 'paid' ? ['token' => $np['token'], 'track' => $np['slug'], 'pass' => (int)$np['track_id'] === 0 && $np['bundle'] === '', 'bundle' => $np['bundle'] !== '' ? $np['bundle'] : null] : []));

    case 'notes_access':
        $token = (string)($_GET['token'] ?? '');
        $np = preg_match('/^[a-f0-9]{48}$/', $token) ? q("SELECT p.*, t.slug FROM learn_note_payments p LEFT JOIN learn_tracks t ON t.id = p.track_id WHERE p.token = ? AND p.status = 'paid'", [$token])->fetch() : null;
        $want = q('SELECT id, slug, title, (SELECT COUNT(*) FROM learn_lessons WHERE track_id = t.id AND published = 1) AS n FROM learn_tracks t WHERE slug = ? AND published = 1', [(string)($_GET['track'] ?? '')])->fetch();
        $isBundle = $np && (int)$np['track_id'] === 0 && $np['bundle'] !== '';
        $isPass = $np && (int)$np['track_id'] === 0 && !$isBundle;
        $inBundle = $isBundle && $want && in_array($want['slug'], NOTES_BUNDLES[$np['bundle']][1] ?? [], true);
        if (!$np || !$want || (!$isPass && !$inBundle && $np['slug'] !== $want['slug'])) fail(403, 'This download is not unlocked yet.');
        if ($isPass && notes_pass_expiry($np) < now()) fail(403, 'Your monthly notes pass has expired. Buy a new one, or pay for just this subject.');
        if (!empty($_GET['dl'])) {
            q('UPDATE learn_note_payments SET downloads = downloads + 1 WHERE id = ?', [$np['id']]);
            if ($me) award_points((int)$me['id'], 'notes', ($isPass || $isBundle) ? 'p' . $np['id'] . '-' . $want['id'] : (string)$np['id'], 'Downloaded the ' . $want['title'] . ' notes PDF', '?book=' . $want['slug'], notes_pdf_points((int)$want['n']));
        }
        out(['ok' => true, 'receipt' => $np['receipt'], 'phone' => substr($np['phone'], 0, 6) . '***' . substr($np['phone'], -3), 'paid_at' => $np['paid_at']] + ($isPass ? ['pass' => true, 'expires_at' => notes_pass_expiry($np)] : []));

    case 'notes_recover':
        $d = body();
        if (!rate_ok('notes_recover', 10, 3600)) fail(429, 'Too many tries. Please wait an hour, or WhatsApp us on 0745 789 590.');
        $tr = (string)($d['track'] ?? '');
        $bundle = str_starts_with($tr, 'bundle:') ? substr($tr, 7) : '';
        if ($bundle !== '' && !isset(NOTES_BUNDLES[$bundle])) fail(404, 'That bundle was not found.');
        $t = ($tr === 'pass' || $bundle !== '') ? ['id' => 0, 'slug' => $tr] : q('SELECT id, slug FROM learn_tracks WHERE slug = ?', [$tr])->fetch();
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        $receipt = strtoupper(preg_replace('/[^A-Z0-9]/i', '', (string)($d['receipt'] ?? '')));
        if (!$t || !$msisdn) fail(400, 'Enter the M-Pesa number you paid with.');
        if (strlen($receipt) < 8) fail(400, 'Enter the M-Pesa receipt code from your confirmation SMS, for example SJK4H2L9XA.');
        // A payment whose result arrived but wasn't processed yet is settled now
        foreach (q("SELECT checkout_id FROM learn_note_payments WHERE track_id = ? AND phone = ? AND status = 'pending' AND created_at > ?", [$t['id'], $msisdn, date('Y-m-d H:i:s', time() - 7 * 86400)])->fetchAll() as $p) {
            if ($r = mpesa_result($p['checkout_id'])) settle_note_payment($p['checkout_id'], $r);
        }
        $np = q("SELECT token FROM learn_note_payments WHERE track_id = ? AND bundle = ? AND phone = ? AND receipt = ? AND status = 'paid'", [$t['id'], $bundle, $msisdn, $receipt])->fetch();
        if (!$np) fail(404, 'We couldn’t match that payment to these notes yet. Check the number and receipt code, or WhatsApp us your M-Pesa message on 0745 789 590 and we’ll sort it out.');
        audit('notes_pdf_recovered', "Track {$t['id']} receipt $receipt", 'visitor');
        out(['ok' => true, 'token' => $np['token'], 'track' => $t['slug']]);

    case 'notes_price_set':
        need_editor();
        $d = body();
        $set = [];
        foreach (['small', 'medium', 'large', 'pass', 'pass90'] as $size) {
            if (($size === 'pass' || $size === 'pass90') && !isset($d[$size])) continue;
            $price = (int)($d[$size] ?? 0);
            if ($price < 1 || $price > 100000) fail(400, 'Enter prices between KSh 1 and KSh 100,000.');
            $set[$size] = $price;
        }
        foreach ($set as $size => $price) set_setting($size === 'pass' ? 'notes_pass_price' : ($size === 'pass90' ? 'notes_pass90_price' : 'notes_pdf_price_' . $size), (string)$price);
        audit('notes_pdf_price', "KSh {$set['small']} / {$set['medium']} / {$set['large']}" . (isset($set['pass']) ? " / pass {$set['pass']}" : ''));
        out(['ok' => true]);

    case 'coupon_save':
        need_editor();
        $d = body();
        $code = strtoupper(preg_replace('/[^A-Z0-9]/i', '', (string)($d['code'] ?? '')));
        $pct = (int)($d['percent'] ?? 0);
        $applies = in_array($d['applies'] ?? '', ['all', 'notes', 'pass', 'bundle'], true) ? $d['applies'] : 'all';
        $exp = trim((string)($d['expires_on'] ?? ''));
        if (strlen($code) < 3 || strlen($code) > 30) fail(400, 'Use a code of 3 to 30 letters and numbers, for example TVET20.');
        if ($pct < 1 || $pct > 90) fail(400, 'Choose a discount between 1% and 90%.');
        if ($exp !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $exp)) fail(400, 'Use a date like 2026-12-31, or leave it empty.');
        if (q('SELECT id FROM learn_coupons WHERE code = ?', [$code])->fetch()) fail(400, 'That code already exists.');
        q('INSERT INTO learn_coupons (code, percent, applies, max_uses, expires_on, active, note, created_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)',
            [$code, $pct, $applies, max(0, (int)($d['max_uses'] ?? 0)), $exp ?: null, mb_substr((string)($d['note'] ?? ''), 0, 120), now()]);
        audit('coupon_created', "$code $pct% ($applies)");
        out(['ok' => true]);

    case 'whatsapp_updates_save':
        need_editor();
        $url = trim((string)(body()['url'] ?? ''));
        if ($url !== '' && !preg_match('#^https://(whatsapp\.com/channel/|www\.whatsapp\.com/channel/|chat\.whatsapp\.com/|wa\.me/)[A-Za-z0-9_?=&%+/.-]+$#', $url)) fail(400, 'Paste a WhatsApp channel, group or wa.me link (starting with https://).');
        set_setting('whatsapp_updates_url', $url);
        out(['ok' => true]);

    case 'coupon_toggle':
        need_editor();
        $d = body();
        q('UPDATE learn_coupons SET active = ? WHERE id = ?', [empty($d['active']) ? 0 : 1, (int)($d['id'] ?? 0)]);
        out(['ok' => true]);

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
        // "Check now": if Safaricom says the prompt was cancelled or failed, say so instead of waiting
        if ($status === 'pending' && !empty($_GET['check']) && strtotime($lp['created_at']) < time() - 15 && rate_ok('unlock_check:' . $l['id'], 30, 600)) {
            $code = stk_query($lp['checkout_id']);
            if ($code !== null && $code !== '0' && $code !== '4999') {
                q("UPDATE learn_payments SET status = 'failed' WHERE id = ? AND status = 'pending'", [$lp['id']]);
                $status = 'failed';
            }
        }
        out(['status' => $status === 'mismatch' ? 'failed' : $status, 'unlocked' => learn_unlocked((int)$lp['video_id'], $l)]);

    case 'unlock_recover':
        // Paid, but the video didn't unlock (prompt closed, connection lost): match the M-Pesa receipt
        $l = need_learner();
        $d = body();
        if (!rate_ok('unlock_recover:' . $l['id'], 10, 3600)) fail(429, 'Too many tries. Please wait an hour, or WhatsApp us on 0745 789 590.');
        $v = video_row((int)($d['id'] ?? 0), false);
        if (learn_unlocked((int)$v['id'], $l)) out(['ok' => true, 'unlocked' => true]);
        $msisdn = normalise_phone((string)($d['phone'] ?? ''));
        $receipt = strtoupper(preg_replace('/[^A-Z0-9]/i', '', (string)($d['receipt'] ?? '')));
        if (!$msisdn) fail(400, 'Enter the M-Pesa number you paid with.');
        if (strlen($receipt) < 8) fail(400, 'Enter the M-Pesa receipt code from your confirmation SMS, for example SJK4H2L9XA.');
        // A payment whose result arrived but wasn't processed yet is settled now
        foreach (q("SELECT checkout_id FROM learn_payments WHERE video_id = ? AND phone = ? AND status = 'pending' AND created_at > ?", [$v['id'], $msisdn, date('Y-m-d H:i:s', time() - 7 * 86400)])->fetchAll() as $p) {
            if ($r = mpesa_result($p['checkout_id'])) settle_learn_payment($p['checkout_id'], $r);
        }
        $lp = q("SELECT p.*, w.email FROM learn_payments p JOIN learners w ON w.id = p.learner_id WHERE p.video_id = ? AND p.phone = ? AND p.receipt = ? AND p.status = 'paid'", [$v['id'], $msisdn, $receipt])->fetch();
        if (!$lp) fail(404, 'We couldn’t match that payment to this video yet. Check the number and receipt code, or WhatsApp us your M-Pesa message on 0745 789 590 and we’ll unlock it for you.');
        if ((int)$lp['learner_id'] !== (int)$l['id']) {
            [$u, $dom] = explode('@', $lp['email']) + ['', ''];
            fail(409, 'That payment unlocked the video on another account (' . mb_substr($u, 0, 2) . '…@' . $dom . '). Sign in with that email to watch it.');
        }
        if (!q('SELECT id FROM learn_unlocks WHERE video_id = ? AND learner_id = ?', [$v['id'], $l['id']])->fetch()) {
            q('INSERT INTO learn_unlocks (video_id, learner_id, amount, receipt, created_at) VALUES (?, ?, ?, ?, ?)', [$v['id'], $l['id'], (int)$lp['paid_amount'], $receipt, now()]);
        }
        audit('video_unlock_recovered', "Video {$v['id']} receipt $receipt", $l['email']);
        out(['ok' => true, 'unlocked' => true]);

    case 'like':
        $l = need_learner();
        $v = video_row((int)(body()['id'] ?? 0), $editor);
        if (!learn_unlocked((int)$v['id'], $l)) fail(403, 'Unlock this video to like it.');
        $got = 0;
        if (q('SELECT id FROM learn_likes WHERE video_id = ? AND learner_id = ?', [$v['id'], $l['id']])->fetch()) {
            q('DELETE FROM learn_likes WHERE video_id = ? AND learner_id = ?', [$v['id'], $l['id']]);
            $liked = false;
        } else {
            q('INSERT INTO learn_likes (video_id, learner_id, created_at) VALUES (?, ?, ?)', [$v['id'], $l['id'], now()]);
            $liked = true;
            $got = award_points((int)$l['id'], 'like', 'v' . $v['id'], 'Liked the video “' . $v['title'] . '”', '?video=' . (int)$v['id']);
        }
        out(['liked' => $liked, 'points' => $got, 'likes' => (int)q('SELECT COUNT(*) AS n FROM learn_likes WHERE video_id = ?', [$v['id']])->fetch()['n']]);

    case 'comment':
        $l = need_learner();
        $d = body();
        $v = video_row((int)($d['id'] ?? 0), $editor);
        if (!learn_unlocked((int)$v['id'], $l)) fail(403, 'Unlock this video to comment.');
        $text = trim(preg_replace("/[ \t]+/u", ' ', str_in($d, 'body', 2000)));
        if (!rate_ok('learn_comment:' . $l['id'], 20, 3600)) fail(429, 'You’re commenting very fast. Please wait a little.');
        q('INSERT INTO learn_comments (video_id, learner_id, body, hidden, created_at) VALUES (?, ?, ?, 0, ?)', [$v['id'], $l['id'], $text, now()]);
        $got = award_points((int)$l['id'], 'comment', 'vc' . db()->lastInsertId(), 'Commented on the video “' . $v['title'] . '”', '?video=' . (int)$v['id']);
        out(['ok' => true, 'points' => $got]);

    case 'comment_delete':
        $l = need_learner();
        $id = (int)(body()['id'] ?? 0);
        $n = $editor ? q('DELETE FROM learn_comments WHERE id = ?', [$id])->rowCount()
                     : q('DELETE FROM learn_comments WHERE id = ? AND learner_id = ?', [$id, $l['id']])->rowCount();
        if (!$n) fail(404, 'Comment not found.');
        q("DELETE FROM learn_points WHERE kind = 'comment' AND ref = ?", ['vc' . $id]);
        out(['ok' => true]);

    // ---------- likes and reviews on lessons (anyone can read; signed-in learners post) ----------

    case 'lesson_social':
        $lid = (int)($_GET['lesson_id'] ?? 0);
        if (!q("SELECT id FROM learn_lessons WHERE id = ? AND $pub", [$lid])->fetch()) fail(404, 'Lesson not found.');
        $vis = $editor ? '' : 'AND r.hidden = 0';
        $rows = q("SELECT r.id, r.parent_id, r.rating, r.body, r.is_staff, r.hidden, r.created_at, r.learner_id, l.name, l.email, l.avatar FROM learn_reviews r JOIN learners l ON l.id = r.learner_id WHERE r.lesson_id = ? $vis ORDER BY r.id", [$lid])->fetchAll();
        $top = [];
        $replies = [];
        foreach ($rows as $r) {
            $item = ['id' => (int)$r['id'], 'name' => $r['is_staff'] ? 'Marzley Tech' : public_name($r['name'], $r['email']), 'staff' => (bool)$r['is_staff'],
                     'rating' => $r['rating'] ? (int)$r['rating'] : null, 'body' => $r['body'], 'created_at' => $r['created_at'],
                     'mine' => $me && (int)$r['learner_id'] === (int)$me['id'], 'hidden' => (bool)$r['hidden'], 'replies' => [],
                     'avatar' => $r['is_staff'] ? null : avatar_url(['id' => $r['learner_id'], 'avatar' => $r['avatar']])];
            if ($editor) $item['email'] = $r['email'];
            if ($r['parent_id']) $replies[(int)$r['parent_id']][] = $item; else $top[] = $item;
        }
        foreach ($top as &$t) $t['replies'] = $replies[$t['id']] ?? [];
        unset($t);
        $rated = q('SELECT COUNT(*) AS n, AVG(rating) AS a FROM learn_reviews WHERE lesson_id = ? AND parent_id IS NULL AND rating IS NOT NULL AND hidden = 0', [$lid])->fetch();
        out([
            'likes' => (int)q('SELECT COUNT(*) AS n FROM learn_lesson_likes WHERE lesson_id = ?', [$lid])->fetch()['n'],
            'liked' => $me ? (bool)q('SELECT id FROM learn_lesson_likes WHERE lesson_id = ? AND learner_id = ?', [$lid, $me['id']])->fetch() : false,
            'rating' => ['count' => (int)$rated['n'], 'average' => $rated['n'] ? round((float)$rated['a'], 1) : null],
            'reviews' => array_reverse($top),   // newest first; replies stay oldest first under each one
            'count' => count($rows), 'editor' => $editor,
        ]);

    case 'lesson_like':
        $l = need_learner();
        $lid = (int)(body()['lesson_id'] ?? 0);
        if (!q("SELECT id FROM learn_lessons WHERE id = ? AND $pub", [$lid])->fetch()) fail(404, 'Lesson not found.');
        $got = 0;
        if (q('SELECT id FROM learn_lesson_likes WHERE lesson_id = ? AND learner_id = ?', [$lid, $l['id']])->fetch()) {
            q('DELETE FROM learn_lesson_likes WHERE lesson_id = ? AND learner_id = ?', [$lid, $l['id']]);
            $liked = false;
        } else {
            q('INSERT INTO learn_lesson_likes (lesson_id, learner_id, created_at) VALUES (?, ?, ?)', [$lid, $l['id'], now()]);
            $liked = true;
            $ls = q('SELECT ls.title, ls.slug, t.slug AS track FROM learn_lessons ls JOIN learn_tracks t ON t.id = ls.track_id WHERE ls.id = ?', [$lid])->fetch();
            $got = award_points((int)$l['id'], 'like', 'l' . $lid, 'Liked “' . $ls['title'] . '”', "?track={$ls['track']}&lesson={$ls['slug']}");
        }
        out(['liked' => $liked, 'points' => $got, 'likes' => (int)q('SELECT COUNT(*) AS n FROM learn_lesson_likes WHERE lesson_id = ?', [$lid])->fetch()['n']]);

    case 'review':
        $l = need_learner();
        $d = body();
        $lid = (int)($d['lesson_id'] ?? 0);
        $lesson = q("SELECT l.id, l.title, l.slug, t.slug AS track FROM learn_lessons l JOIN learn_tracks t ON t.id = l.track_id WHERE l.id = ? AND " . ($editor ? '1 = 1' : 'l.published = 1'), [$lid])->fetch();
        if (!$lesson) fail(404, 'Lesson not found.');
        $text = trim(preg_replace("/[ \t]+/u", ' ', str_in($d, 'body', 2000)));
        if ($text === '') fail(400, 'Please write something first.');
        $parent = (int)($d['parent_id'] ?? 0);
        if ($parent && !q('SELECT id FROM learn_reviews WHERE id = ? AND lesson_id = ? AND parent_id IS NULL', [$parent, $lid])->fetch()) fail(404, 'That comment was removed.');
        $rating = $parent ? 0 : (int)($d['rating'] ?? 0);
        if ($rating < 0 || $rating > 5) fail(400, 'Rate the lesson from 1 to 5 stars.');
        if (!$editor && !rate_ok('learn_review:' . $l['id'], 15, 3600)) fail(429, 'You’re posting very fast. Please wait a little.');
        // one star rating per person per lesson: a new rating replaces their old one
        if ($rating) q('UPDATE learn_reviews SET rating = NULL WHERE lesson_id = ? AND learner_id = ? AND parent_id IS NULL', [$lid, $l['id']]);
        q('INSERT INTO learn_reviews (lesson_id, learner_id, parent_id, rating, body, is_staff, hidden, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)',
            [$lid, $l['id'], $parent ?: null, $rating ?: null, $text, $editor ? 1 : 0, now()]);
        $rid = (int)db()->lastInsertId();
        $got = award_points((int)$l['id'], $parent ? 'reply' : 'comment', 'r' . $rid, ($parent ? 'Replied to a comment on “' : 'Commented on “') . $lesson['title'] . '”',
            "?track={$lesson['track']}&lesson={$lesson['slug']}#reviews");
        if (!$editor) {
            $who = public_name($l['name'], $l['email']);
            foreach (config()['admin_emails'] as $to) {
                send_mail($to, ($parent ? 'New reply' : 'New review') . ' on “' . $lesson['title'] . '”',
                    "$who wrote" . ($rating ? " ($rating/5 stars)" : '') . ":\n\n$text\n\nReply or delete it in the portal (Learning hub > Lesson reviews), or on the lesson:\n" .
                    rtrim(config()['site_url'] ?? 'https://marzleytechsolutions.co.ke', '/') . "/learn/?track={$lesson['track']}&lesson={$lesson['slug']}#reviews", false);
            }
        }
        out(['ok' => true, 'points' => $got]);

    case 'review_delete':
        $l = need_learner();
        $id = (int)(body()['id'] ?? 0);
        $n = $editor ? q('DELETE FROM learn_reviews WHERE id = ?', [$id])->rowCount()
                     : q('DELETE FROM learn_reviews WHERE id = ? AND learner_id = ?', [$id, $l['id']])->rowCount();
        if (!$n) fail(404, 'Comment not found.');
        q('DELETE FROM learn_reviews WHERE parent_id = ?', [$id]);   // its replies go with it
        q("DELETE FROM learn_points WHERE kind IN ('comment', 'reply') AND ref = ?", ['r' . $id]);
        out(['ok' => true]);

    case 'review_hide':
        need_editor();
        $d = body();
        q('UPDATE learn_reviews SET hidden = ? WHERE id = ?', [empty($d['hidden']) ? 0 : 1, (int)($d['id'] ?? 0)]);
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
            'comments' => $comments, 'payments' => $payments, 'notes_prices' => notes_pdf_prices(),
            'note_payments' => q('SELECT p.id, p.amount, p.phone, p.status, p.receipt, p.downloads, p.created_at, p.paid_at, p.track_id, p.pass_days, p.bundle, p.coupon, COALESCE(t.title, \'Monthly notes pass (all subjects)\') AS title FROM learn_note_payments p LEFT JOIN learn_tracks t ON t.id = p.track_id ORDER BY p.id DESC LIMIT 100')->fetchAll(),
            'reviews' => q('SELECT r.id, r.lesson_id, r.parent_id, r.rating, r.body, r.is_staff, r.hidden, r.created_at, l.name, l.email, s.title AS lesson, s.slug, t.slug AS track, t.title AS track_title
                FROM learn_reviews r JOIN learners l ON l.id = r.learner_id JOIN learn_lessons s ON s.id = r.lesson_id JOIN learn_tracks t ON t.id = s.track_id ORDER BY r.id DESC LIMIT 300')->fetchAll(),
            'top_lessons' => q('SELECT s.title, t.title AS track_title, COUNT(k.id) AS likes FROM learn_lesson_likes k JOIN learn_lessons s ON s.id = k.lesson_id JOIN learn_tracks t ON t.id = s.track_id GROUP BY s.id, s.title, t.title ORDER BY likes DESC LIMIT 10')->fetchAll(),
            'stats' => [
                'learners' => (int)q('SELECT COUNT(*) AS n FROM learners')->fetch()['n'],
                'new_learners_30' => (int)q('SELECT COUNT(*) AS n FROM learners WHERE created_at >= ?', [date('Y-m-d H:i:s', time() - 30 * 86400)])->fetch()['n'],
                'revenue' => (int)q('SELECT COALESCE(SUM(amount), 0) AS n FROM learn_unlocks')->fetch()['n'],
                'revenue_30' => (int)q('SELECT COALESCE(SUM(amount), 0) AS n FROM learn_unlocks WHERE created_at >= ?', [date('Y-m-d H:i:s', time() - 30 * 86400)])->fetch()['n'],
                'unlocks' => (int)q('SELECT COUNT(*) AS n FROM learn_unlocks')->fetch()['n'],
                'notes_revenue' => (int)q("SELECT COALESCE(SUM(paid_amount), 0) AS n FROM learn_note_payments WHERE status = 'paid'")->fetch()['n'],
                'notes_revenue_30' => (int)q("SELECT COALESCE(SUM(paid_amount), 0) AS n FROM learn_note_payments WHERE status = 'paid' AND paid_at >= ?", [date('Y-m-d H:i:s', time() - 30 * 86400)])->fetch()['n'],
                'notes_sold' => (int)q("SELECT COUNT(*) AS n FROM learn_note_payments WHERE status = 'paid'")->fetch()['n'],
                'lessons_done' => (int)q('SELECT COUNT(*) AS n FROM learn_progress')->fetch()['n'],
                'lesson_likes' => (int)q('SELECT COUNT(*) AS n FROM learn_lesson_likes')->fetch()['n'],
                'reviews' => (int)q('SELECT COUNT(*) AS n FROM learn_reviews WHERE parent_id IS NULL')->fetch()['n'],
                'certificates' => (int)q('SELECT COUNT(*) AS n FROM learn_certificates')->fetch()['n'],
            ],
            'sales' => learn_sales_report(),
            'notes_bundles' => array_values(notes_bundles()), 'whatsapp_updates' => setting('whatsapp_updates_url', ''),
            'coupons' => q("SELECT c.*, (SELECT COUNT(*) FROM learn_note_payments p WHERE p.coupon = c.code AND p.status = 'paid') AS used FROM learn_coupons c ORDER BY c.id DESC")->fetchAll(),
            'certificates' => q('SELECT c.code, c.lessons, c.issued_at, l.name, l.email, t.title FROM learn_certificates c JOIN learners l ON l.id = c.learner_id JOIN learn_tracks t ON t.id = c.track_id ORDER BY c.id DESC LIMIT 100')->fetchAll(),
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
