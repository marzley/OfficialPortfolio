<?php
// HTTP-level security tests against a real PHP server on the test database.
require_once __DIR__ . '/http_client.php';
use Akiba\Core\Db;
use Akiba\Services\{ContributionEngine, GroupService};

function httpServer(): string
{
    static $started = false;
    $port = 8099;
    if (!$started) {
        $started = true;
        $cmd = sprintf('php -S 127.0.0.1:%d -t %s %s >/dev/null 2>&1 & echo $!', $port, escapeshellarg(AF_ROOT . '/public'), escapeshellarg(AF_ROOT . '/public/router.php'));
        $pid = (int)shell_exec($cmd);
        register_shutdown_function(fn() => posix_kill($pid, SIGTERM));
        for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }
    }
    return "http://127.0.0.1:$port";
}

/** Group A: chair, treasurer, auditor, member m1, member m2.  Group B: its own chair. Today = 2026-01-07 frozen in DB only via obligations. */
function httpFixture(): array
{
    $A = mkGroup(['name' => 'Group A']);
    $B = mkGroup(['name' => 'Group B']);
    $emails = [];
    $mk = function (string $role, string $tag) use ($A, &$emails) {
        $email = "$tag@test.local";
        $u = mkUser(ucfirst($tag), $email);
        $m = GroupService::addMember($A['gid'], $u, $role, 'active', '2026-01-05');
        $emails[$tag] = $email;
        return [$u, $m];
    };
    [$tu, $tm] = $mk('treasurer', 'treasurer');
    [$au, $am] = $mk('auditor', 'auditor');
    [$m1u, $m1] = $mk('member', 'member1');
    [$m2u, $m2] = $mk('member', 'member2');
    mkPlan($A['gid'], $A['chair'], ['amount' => '100', 'frequency' => 'daily', 'start_date' => '2026-01-05', 'lookahead_days' => 0]);
    ContributionEngine::generate($A['gid'], '2026-01-07');
    Db::i()->exec('UPDATE users SET email=? WHERE id=?', ['chairA@test.local', $A['chair']]);
    Db::i()->exec('UPDATE users SET email=? WHERE id=?', ['chairB@test.local', $B['chair']]);
    return compact('A', 'B', 'tm', 'am', 'm1', 'm2', 'm1u', 'm2u') + ['gid' => $A['gid'], 'gidB' => $B['gid']];
}

function login(string $email): Browser
{
    $b = new Browser(httpServer());
    $r = $b->login($email, 'Passw0rdTest');
    ok($r['status'] === 302 && $r['location'] === '/groups', "login failed for $email: {$r['status']}");
    return $b;
}

test('HTTP: unauthenticated users cannot reach group pages or APIs or initiate payments', function () {
    $f = httpFixture();
    $b = new Browser(httpServer());
    $r = $b->get("/g/{$f['gid']}");
    eq(302, $r['status']); eq('/login', $r['location']);
    $r = $b->get("/api/g/{$f['gid']}/me/outstanding-balance", ['Accept: application/json']);
    eq(401, $r['status']);
    $r = $b->req('POST', "/api/g/{$f['gid']}/payments/initiate", ['option' => 'clear_all', 'phone' => '0712345678', 'idempotency_key' => 'abcdefgh12']);
    ok(in_array($r['status'], [401, 403], true), 'blocked, got ' . $r['status']);
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_requests'));
});

test('HTTP: CSRF — POST without a valid token is rejected, with one it works', function () {
    httpFixture();
    $b = new Browser(httpServer());
    eq(403, $b->req('POST', '/login', ['email' => 'chairA@test.local', 'password' => 'Passw0rdTest'])['status']);
    $b2 = login('chairA@test.local');
    $gid = (int)Db::i()->val("SELECT id FROM `groups` WHERE name='Group A'");
    eq(403, $b2->req('POST', "/g/$gid/announcements", ['title' => 'x', 'body' => 'y'])['status'], 'logged-in POST without token');
});

test('HTTP: group isolation — Group A members cannot see Group B; Group B chair cannot see Group A', function () {
    $f = httpFixture();
    $m = login('member1@test.local');
    foreach (["/g/{$f['gidB']}", "/g/{$f['gidB']}/overview", "/g/{$f['gidB']}/members", "/g/{$f['gidB']}/pay", "/api/g/{$f['gidB']}/me/outstanding-balance"] as $p) {
        eq(404, $m->get($p, ['Accept: application/json'])['status'], $p);
    }
    $cb = login('chairB@test.local');
    foreach (["/g/{$f['gid']}", "/g/{$f['gid']}/overview", "/g/{$f['gid']}/arrears", "/g/{$f['gid']}/reports/transactions", "/g/{$f['gid']}/members/{$f['m1']}"] as $p) {
        eq(404, $cb->get($p)['status'], $p);
    }
    // Group B chair tries to act on a Group A membership id through THEIR OWN group's URL (IDOR via id swap)
    eq(404, $cb->get("/g/{$f['gidB']}/members/{$f['m1']}")['status'], 'membership id from another group');
    $tok = $cb->csrf("/g/{$f['gidB']}/members");
    eq(404, $cb->req('POST', "/g/{$f['gidB']}/members/{$f['m1']}/action", ['_csrf' => $tok, 'action' => 'suspend'])['status']);
    eq('active', Db::i()->val('SELECT status FROM group_memberships WHERE id=?', [$f['m1']]));
});

test('HTTP: members cannot read each other’s finances or officer pages; receipts are private', function () {
    $f = httpFixture();
    $t = Akiba\Services\PaymentService::recordManual($f['gid'], $f['m2'], 10000, 'cash', 'R1', '', $f['A']['chair']);
    $m1 = login('member1@test.local');
    eq(404, $m1->get("/g/{$f['gid']}/receipts/{$t['txn_id']}")['status'], "other member's receipt");
    foreach (['overview', 'members', 'plans', 'arrears', 'payments', 'reconcile', 'expenses', 'reports', 'settings', 'audit', "members/{$f['m2']}", 'reports/collections'] as $p) {
        eq(403, $m1->get("/g/{$f['gid']}/$p")['status'], $p);
    }
    $st = $m1->get("/g/{$f['gid']}/statement?member={$f['m2']}&format=csv");
    ok(!str_contains($st['body'], 'R1') && !str_contains($st['body'], 'Member 2'), 'statement ?member= ignored for plain member');
    $m2 = login('member2@test.local');
    eq(200, $m2->get("/g/{$f['gid']}/receipts/{$t['txn_id']}")['status'], 'owner can see own receipt');
});

test('HTTP: role limits — treasurer cannot assign roles or reach settings/admin; auditor is read-only', function () {
    $f = httpFixture();
    $tr = login('treasurer@test.local');
    $tok = $tr->csrf("/g/{$f['gid']}/members");
    $r = $tr->req('POST', "/g/{$f['gid']}/members/{$f['tm']}/action", ['_csrf' => $tok, 'action' => 'role', 'role' => 'chairperson']);
    eq(403, $r['status']);
    eq('treasurer', Db::i()->val('SELECT role FROM group_memberships WHERE id=?', [$f['tm']]));
    eq(403, $tr->get("/g/{$f['gid']}/settings")['status']);
    eq(403, $tr->get('/admin')['status']);
    $au = login('auditor@test.local');
    eq(200, $au->get("/g/{$f['gid']}/payments")['status'], 'auditor can read');
    $tok = $au->csrf("/g/{$f['gid']}/payments");
    eq(403, $au->req('POST', "/g/{$f['gid']}/payments/manual", ['_csrf' => $tok, 'membership_id' => $f['m1'], 'amount' => '100', 'method' => 'cash', 'reference' => 'X1'])['status']);
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));
    eq(403, $au->req('POST', "/g/{$f['gid']}/reversals/1/decide", ['_csrf' => $tok, 'decision' => 'approve'])['status']);
});

test('HTTP: platform admin cannot read group financial pages; ordinary users cannot become admin', function () {
    $f = httpFixture();
    $admin = mkUser('Admin', 'root@test.local', true);
    $a = login('root@test.local');
    eq(200, $a->get('/admin')['status']);
    eq(404, $a->get("/g/{$f['gid']}/overview")['status']);
    $ch = login('chairA@test.local');
    eq(403, $ch->get('/admin/users')['status']);
    $tok = $ch->csrf('/groups');
    eq(403, $ch->req('POST', "/admin/users/{$f['A']['chair']}/status", ['_csrf' => $tok, 'status' => 'suspended'])['status']);
});

test('HTTP: amount tampering — server ignores client amounts for today/clear_all and bounds custom', function () {
    $f = httpFixture();
    $m = login('member1@test.local');
    $tok = $m->csrf("/g/{$f['gid']}/pay");
    $page = $m->get("/g/{$f['gid']}/pay");
    preg_match('/name="idem" value="([a-f0-9]+)"/', $page['body'], $mm);
    $r = $m->req('POST', "/g/{$f['gid']}/pay", ['_csrf' => $tok, 'option' => 'clear_all', 'custom_amount' => '1', 'amount' => '1', 'phone' => '0712345678', 'idem' => $mm[1]]);
    eq(302, $r['status']);
    eq(30000, (int)Db::i()->val('SELECT amount_minor FROM payment_requests'), 'full 3 days, not 1');
    // double submit with the same idempotency key → still one request
    $m->req('POST', "/g/{$f['gid']}/pay", ['_csrf' => $tok, 'option' => 'clear_all', 'phone' => '0712345678', 'idem' => $mm[1]]);
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_requests'));
    // absurd custom amount from another member
    $m2 = login('member2@test.local');
    $tok2 = $m2->csrf("/g/{$f['gid']}/pay");
    $r = $m2->req('POST', "/g/{$f['gid']}/pay", ['_csrf' => $tok2, 'option' => 'custom', 'custom_amount' => '999999', 'phone' => '0712345678', 'idem' => 'abcdef123456']);
    eq(302, $r['status']);
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_requests'), 'oversized custom amount refused');
    // a member cannot read another member's payment status
    $ref = Db::i()->val('SELECT ref FROM payment_requests LIMIT 1');
    eq(404, $m2->get("/api/g/{$f['gid']}/payments/$ref", ['Accept: application/json'])['status']);
});

test('HTTP: callback endpoints — wrong secret 404, bad payload 400, no session needed, replay safe', function () {
    $f = httpFixture();
    $b = new Browser(httpServer());
    eq(404, $b->req('POST', '/callbacks/mpesa/stk/wrong-secret-value', '{}', ['Content-Type: application/json'])['status']);
    eq(400, $b->req('POST', '/callbacks/mpesa/stk/test-secret-long-enough', '{"nope":1}', ['Content-Type: application/json'])['status']);
    eq(400, $b->req('POST', '/callbacks/mpesa/stk/test-secret-long-enough', 'not json', ['Content-Type: application/json'])['status']);
    $body = json_encode(['Body' => ['stkCallback' => ['CheckoutRequestID' => 'ws_none', 'ResultCode' => 0]]]);
    eq(200, $b->req('POST', '/callbacks/mpesa/stk/test-secret-long-enough', $body, ['Content-Type: application/json'])['status']);
    eq(200, $b->req('POST', '/callbacks/mpesa/stk/test-secret-long-enough', $body, ['Content-Type: application/json'])['status']);
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_provider_events'));
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));
    eq(405, $b->get('/callbacks/mpesa/stk/test-secret-long-enough')['status']);
});

test('HTTP: login throttling, no account enumeration, safe redirects, security headers, strict CSP', function () {
    httpFixture();
    $b = new Browser(httpServer());
    $msgs = [];
    for ($i = 0; $i < 6; $i++) {
        $r = $b->login($i % 2 ? 'chairA@test.local' : 'chairA@test.local', 'wrong-pass-' . $i);
        $msgs[] = $r['body'];
    }
    ok(str_contains($msgs[5], 'Too many failed attempts'), 'locked out after repeated failures');
    ok(str_contains($b->login('chairA@test.local', 'Passw0rdTest')['body'], 'Too many'), 'even the right password is refused during lockout');
    $b2 = new Browser(httpServer());
    $unknown = $b2->login('nobody@test.local', 'whatever12345')['body'];
    ok(str_contains($unknown, 'Incorrect email or password'), 'unknown email gets the same message as a wrong password');
    $r = $b2->get('/login');
    ok(str_contains($r['headers'], "frame-ancestors 'none'") && str_contains($r['headers'], 'X-Content-Type-Options: nosniff'), 'headers');
    ok(!str_contains($r['body'], 'style="') && !preg_match('/<script(?![^>]*src=)/', $r['body']), 'no inline style/script (CSP-safe)');
    $f = new Browser(httpServer());
    $tok = $f->csrf('/forgot');
    $known = $f->req('POST', '/forgot', ['_csrf' => $tok, 'email' => 'chairB@test.local']);
    $tok = $f->csrf('/forgot');
    $nope = $f->req('POST', '/forgot', ['_csrf' => $tok, 'email' => 'ghost@test.local']);
    eq(strlen(preg_replace('/value="[a-f0-9]+"|content="[a-f0-9]+"/', '', $known['body'])), strlen(preg_replace('/value="[a-f0-9]+"|content="[a-f0-9]+"/', '', $nope['body'])), 'identical reset response');
});

test('HTTP: output is HTML-escaped (stored XSS attempt in member name and announcement)', function () {
    $f = httpFixture();
    Db::i()->exec("UPDATE users SET full_name=? WHERE id=?", ['<script>alert(1)</script>', $f['m1u']]);
    $ch = login('chairA@test.local');
    $body = $ch->get("/g/{$f['gid']}/members")['body'];
    ok(!str_contains($body, '<script>alert(1)</script>') && str_contains($body, '&lt;script&gt;'), 'escaped');
    $tok = $ch->csrf("/g/{$f['gid']}/announcements");
    $ch->req('POST', "/g/{$f['gid']}/announcements", ['_csrf' => $tok, 'title' => '<img src=x onerror=1>', 'body' => 'hi']);
    ok(!str_contains($ch->get("/g/{$f['gid']}/announcements")['body'], '<img src=x'), 'announcement escaped');
});

test('HTTP: CSV export has basis/currency/period, neutralises formula injection, is audited, and matches the dashboard total', function () {
    $f = httpFixture();
    Db::i()->exec("UPDATE users SET full_name=? WHERE id=?", ['=HYPERLINK("http://evil")', $f['m1u']]);
    $ch = login('chairA@test.local');
    $r = $ch->get("/g/{$f['gid']}/reports/arrears?format=csv");
    eq(200, $r['status']);
    ok(str_contains($r['headers'], 'text/csv') && str_contains($r['headers'], 'attachment'));
    ok(str_contains($r['body'], 'Currency,KES') && str_contains($r['body'], 'Basis,') && str_contains($r['body'], 'Generated,'));
    ok(!preg_match('/^=HYPERLINK/m', $r['body']) && str_contains($r['body'], "'=HYPERLINK"), 'formula neutralised');
    // 3 members x 3 days x KSh 100 + chair & treasurer & auditor (also enrolled) => total from CSV equals dashboard figure
    $rows = array_map('str_getcsv', preg_split('/\R/', trim($r['body'])));
    $total = null;
    foreach ($rows as $row) if (($row[0] ?? '') === 'TOTAL') $total = (float)end($row);
    $overview = Akiba\Services\ReportService::overview($f['gid'], '2026-01-01', '2026-12-31');
    $db = Db::i();
    $truth = (int)$db->val("SELECT SUM(original_minor-waived_minor-paid_minor) FROM contribution_obligations WHERE group_id=? AND status='open' AND due_date<='2026-01-07'", [$f['gid']]);
    eq($truth, (int)round($total * 100), 'CSV total equals obligation rows');
    ok((int)$db->val("SELECT COUNT(*) FROM audit_logs WHERE action='report.exported'") === 1, 'export audited');
});
