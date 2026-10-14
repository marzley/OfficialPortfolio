<?php
use Akiba\Core\{Clock, Db, Env};
use Akiba\Payments\{MpesaDriver, SandboxDriver};
use Akiba\Services\{ContributionEngine, Ledger, PaymentService, Notifications, ReminderService};

function payFixture(): array
{
    $s = dailySetup();
    Clock::freeze('2026-01-07 09:00:00');                    // 12:00 in Nairobi, Jan 7
    ContributionEngine::generate($s['gid'], '2026-01-07');   // 3 days owed = 300
    $mem = Akiba\Core\Access::membership($s['gid'], $s['u']);
    return $s + ['mem' => $mem];
}

function startPay(array $s, string $opt = 'clear_all', ?int $custom = null, ?string $key = null): array
{
    return PaymentService::initiate($s['mem'], $opt, $custom, '0712345678', $key ?? bin2hex(random_bytes(8)));
}

test('payment quote is computed server-side from obligations', function () {
    $s = payFixture();
    $q = PaymentService::quote($s['mem']);
    eq(10000, $q['pay_today']);
    eq(30000, $q['clear_all']);
});

test('initiate → pending; client cannot choose the amount for today/clear_all', function () {
    $s = payFixture();
    $r = startPay($s, 'clear_all', 999999);
    ok($r['ok']);
    eq(30000, (int)$r['request']['amount_minor'], 'custom amount ignored for clear_all');
    eq('pending', $r['request']['status']);
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'), 'pending is not money received');
    eq(30000, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib'], 'still owed');
});

test('idempotency: double-click / retried submit creates one request; second live prompt refused', function () {
    $s = payFixture();
    $a = startPay($s, 'today', null, 'same-key-12345');
    $b = startPay($s, 'today', null, 'same-key-12345');
    ok($b['replayed'] ?? false);
    eq($a['request']['id'], $b['request']['id']);
    $c = startPay($s, 'today');
    ok(!$c['ok'], 'second concurrent prompt with a new key is refused');
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_requests'));
});

test('custom amount validation: bounds, whole shillings, partial policy', function () {
    $s = payFixture();
    ok(!startPay($s, 'custom', 0)['ok']);
    ok(!startPay($s, 'custom', 5050)['ok'], 'fractional shillings rejected for M-PESA');
    ok(!startPay($s, 'custom', 10000000)['ok'], 'over the max');
    Db::i()->exec('UPDATE group_settings SET allow_partial=0 WHERE group_id=?', [$s['gid']]);
    ok(!startPay($s, 'custom', 15000)['ok'], 'partial refused when group disallows it');
    ok(startPay($s, 'custom', 20000)['ok'], 'whole obligations OK');
});

test('FULL FLOW sandbox: pay → callback → verified → allocated → receipt; replayed callback is a no-op', function () {
    $s = payFixture();
    $r = startPay($s, 'clear_all')['request'];
    $res = SandboxDriver::respond($r['provider_request_id'], 'pay');
    eq(200, $res['http']);
    $req = Db::i()->one('SELECT * FROM payment_requests WHERE id=?', [$r['id']]);
    eq('succeeded', $req['status']);
    eq(0, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
    $t = Db::i()->one('SELECT * FROM payment_transactions');
    eq('provider_verified', $t['source']);
    eq(30000, (int)$t['amount_minor']);
    ok(str_starts_with($t['receipt_no'], 'AFR-'));
    eq(3, (int)Db::i()->val('SELECT COUNT(*) FROM payment_allocations WHERE txn_id=?', [$t['id']]));

    // Safaricom retries / attacker replays the same callback body
    $payload = json_decode(Db::i()->val('SELECT payload FROM payment_provider_events LIMIT 1'), true);
    for ($i = 0; $i < 3; $i++) PaymentService::handleStkCallback($payload, '1.2.3.4', 'sandbox');
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'), 'no double credit');
    eq(3, (int)Db::i()->val('SELECT duplicate_count FROM payment_provider_events LIMIT 1'));
    eq(30000, Ledger::balance($s['gid'], '1000'));
    ok((int)Db::i()->val("SELECT COUNT(*) FROM notifications WHERE user_id=? AND category='payment'", [$s['u']]) === 1, 'one receipt notification');
});

test('failed / cancelled payments stay unpaid and notify truthfully', function () {
    $s = payFixture();
    $r = startPay($s, 'today')['request'];
    SandboxDriver::respond($r['provider_request_id'], 'cancel');
    eq('failed', Db::i()->val('SELECT status FROM payment_requests WHERE id=?', [$r['id']]));
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));
    eq(30000, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
    $n = Db::i()->one("SELECT title FROM notifications WHERE user_id=?", [$s['u']]);
    eq('Payment not completed', $n['title']);
    // safe retry allowed
    Db::i()->exec("UPDATE payment_requests SET created_at=? ", [Clock::now()->modify('-10 minutes')->format('Y-m-d H:i:s')]);
    ok(startPay($s, 'today')['ok']);
});

test('forged success callback without provider confirmation is NOT credited', function () {
    $s = payFixture();
    $r = startPay($s, 'clear_all')['request'];      // sandbox state remains "prompted" → provider query says pending
    $forged = ['Body' => ['stkCallback' => ['MerchantRequestID' => 'x', 'CheckoutRequestID' => $r['provider_request_id'], 'ResultCode' => 0, 'ResultDesc' => 'ok',
        'CallbackMetadata' => ['Item' => [['Name' => 'Amount', 'Value' => 300], ['Name' => 'MpesaReceiptNumber', 'Value' => 'FAKE123']]]]]];
    PaymentService::handleStkCallback($forged, '6.6.6.6', 'sandbox');
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));
    $req = Db::i()->one('SELECT status,result_code FROM payment_requests WHERE id=?', [$r['id']]);
    eq('unknown', $req['status']);
    eq('UNVERIFIED', $req['result_code']);
    eq(30000, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
});

test('amount mismatch is parked for reconciliation, never auto-credited', function () {
    $s = payFixture();
    $r = startPay($s, 'clear_all')['request'];
    SandboxDriver::respond($r['provider_request_id'], 'pay', 10000); // customer edited amount: 100 instead of 300
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));
    eq('AMOUNT_MISMATCH', Db::i()->val('SELECT result_code FROM payment_requests WHERE id=?', [$r['id']]));
    $rec = PaymentService::reconciliation($s['gid']);
    eq(1, count($rec['unresolved']));
    // treasurer reconciles against the statement; the same receipt cannot be posted twice
    $rc = Db::i()->val("SELECT payload FROM payment_provider_events LIMIT 1");
    $mp = json_decode($rc, true)['Body']['stkCallback']['CallbackMetadata']['Item'][1]['Value'];
    PaymentService::recordManual($s['gid'], $s['m'], 10000, 'mpesa_paybill', $mp, 'matched statement', $s['chair'], (int)$r['id']);
    eq('succeeded', Db::i()->val('SELECT status FROM payment_requests WHERE id=?', [$r['id']]));
    eq(20000, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
    throws(fn() => PaymentService::recordManual($s['gid'], $s['m'], 10000, 'mpesa_paybill', $mp, 'dup', $s['chair']), 'already been recorded');
});

test('unmatched / malformed callbacks are stored or rejected, never crash or credit', function () {
    $s = payFixture();
    eq(400, PaymentService::handleStkCallback(['foo' => 'bar'], '1.1.1.1', 'mpesa')['http']);
    $ok = PaymentService::handleStkCallback(['Body' => ['stkCallback' => ['CheckoutRequestID' => 'ws_unknown', 'ResultCode' => 0]]], '1.1.1.1', 'mpesa');
    eq(200, $ok['http']);
    eq('unmatched_request', Db::i()->val('SELECT outcome FROM payment_provider_events'));
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));
});

test('CONCURRENCY: two processes settle the same callback simultaneously → exactly one transaction', function () {
    if (!function_exists('pcntl_fork')) return;
    $s = payFixture();
    $r = startPay($s, 'clear_all')['request'];
    $db = Db::i();
    $db->exec("UPDATE sandbox_stk SET state='success', receipt='SBXCONC1' WHERE checkout_id=?", [$r['provider_request_id']]);
    $payload = ['Body' => ['stkCallback' => ['MerchantRequestID' => 'm', 'CheckoutRequestID' => $r['provider_request_id'], 'ResultCode' => 0, 'ResultDesc' => 'ok',
        'CallbackMetadata' => ['Item' => [['Name' => 'Amount', 'Value' => 300], ['Name' => 'MpesaReceiptNumber', 'Value' => 'SBXCONC1']]]]]];
    $pids = [];
    for ($i = 0; $i < 4; $i++) {
        $pid = pcntl_fork();
        if ($pid === 0) {
            Db::init(['host' => Env::get('DB_HOST', '127.0.0.1'), 'port' => 3306, 'name' => getenv('DB_NAME'), 'user' => getenv('DB_USER'), 'pass' => getenv('DB_PASS')]);
            try { PaymentService::handleStkCallback($payload, 'child', 'sandbox'); } catch (Throwable $e) { fwrite(STDERR, 'child error: ' . $e->getMessage() . "\n"); exit(2); }
            exit(0);
        }
        $pids[] = $pid;
    }
    foreach ($pids as $pid) { pcntl_waitpid($pid, $status); eq(0, pcntl_wexitstatus($status), 'child exit'); }
    Db::init(['host' => Env::get('DB_HOST', '127.0.0.1'), 'port' => 3306, 'name' => getenv('DB_NAME'), 'user' => getenv('DB_USER'), 'pass' => getenv('DB_PASS')]);
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'), 'one transaction');
    eq(3, (int)Db::i()->val('SELECT COUNT(*) FROM payment_allocations'), 'allocated once (3 obligations)');
    eq(30000, Ledger::balance($s['gid'], '1000'));
    eq(0, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
});

test('CONCURRENCY: simultaneous manual payments for one member never over-allocate an obligation', function () {
    if (!function_exists('pcntl_fork')) return;
    $s = payFixture();   // owes 300
    $pids = [];
    for ($i = 0; $i < 6; $i++) {
        $pid = pcntl_fork();
        if ($pid === 0) {
            Db::init(['host' => '127.0.0.1', 'port' => 3306, 'name' => getenv('DB_NAME'), 'user' => getenv('DB_USER'), 'pass' => getenv('DB_PASS')]);
            try { PaymentService::post(['group_id' => $s['gid'], 'membership_id' => $s['m'], 'amount_minor' => 10000, 'provider' => 'manual', 'provider_ref' => "CC$i", 'source' => 'manual', 'method' => 'cash', 'request_id' => null, 'recorded_by' => $s['chair'], 'note' => null]); }
            catch (Throwable $e) { fwrite(STDERR, 'child error: ' . $e->getMessage() . "\n"); exit(2); }
            exit(0);
        }
        $pids[] = $pid;
    }
    foreach ($pids as $pid) { pcntl_waitpid($pid, $status); eq(0, pcntl_wexitstatus($status), 'child exit'); }
    Db::init(['host' => '127.0.0.1', 'port' => 3306, 'name' => getenv('DB_NAME'), 'user' => getenv('DB_USER'), 'pass' => getenv('DB_PASS')]);
    eq(3, (int)Db::i()->val("SELECT COUNT(*) FROM contribution_obligations WHERE status='paid'"), 'all three paid');
    eq(30000, (int)Db::i()->val('SELECT SUM(paid_minor) FROM contribution_obligations'), 'never more than owed');
    eq(30000, ContributionEngine::balance($s['m'], '2026-01-07')['credit'], '300 surplus held as explicit credit');
    eq(60000, Ledger::balance($s['gid'], '1000'));
    eq([], Ledger::unbalancedJournals());
    eq([], PaymentService::reconciliation($s['gid'])['paid_mismatch']);
});

test('dual-control reversal: requester cannot approve own reversal; approval restores the balance', function () {
    $s = payFixture();
    [$tu, $tm] = mkMember($s['gid'], 'treasurer', '2026-01-05');
    $p = PaymentService::recordManual($s['gid'], $s['m'], 30000, 'cash', 'CASH-1', '', $tu);
    eq(0, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
    ok(PaymentService::requestReversal($p['txn_id'], $s['gid'], 'Wrong member', $tu)['ok']);
    $rev = (int)Db::i()->val('SELECT id FROM payment_reversals');
    ok(!PaymentService::decideReversal($rev, $s['gid'], $tu, true)['ok'], 'self-approval blocked');
    ok(PaymentService::decideReversal($rev, $s['gid'], $s['chair'], true)['ok']);
    eq(30000, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
    eq('reversed', Db::i()->val('SELECT status FROM payment_transactions'));
});

test('M-PESA driver builds correct Daraja requests and treats timeouts as UNKNOWN (not failed)', function () {
    putenv('MPESA_CONSUMER_KEY=k'); putenv('MPESA_CONSUMER_SECRET=s'); putenv('MPESA_SHORTCODE=174379'); putenv('MPESA_PASSKEY=pk');
    putenv('MPESA_CALLBACK_SECRET=cbsec'); putenv('APP_URL=https://app.example'); putenv('MPESA_ENV=sandbox');
    @unlink(AF_ROOT . '/storage/mpesa_token.json');
    $calls = [];
    $d = new MpesaDriver(function ($method, $url, $headers, $body) use (&$calls) {
        $calls[] = [$method, $url, $headers, $body];
        if (str_contains($url, 'oauth')) return [200, json_encode(['access_token' => 'TOK', 'expires_in' => '3599'])];
        return [200, json_encode(['MerchantRequestID' => 'm1', 'CheckoutRequestID' => 'ws_CO_1', 'ResponseCode' => '0', 'CustomerMessage' => 'Success'])];
    });
    $r = $d->initiate(['amount_minor' => 30000, 'phone' => '+254712345678', 'reference' => 'AFABC123', 'description' => 'AkibaFlow']);
    ok($r['ok']);
    eq('ws_CO_1', $r['checkout_id']);
    eq('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', $calls[0][1]);
    ok(str_contains($calls[0][2][0], base64_encode('k:s')));
    $body = json_decode($calls[1][3], true);
    eq(300, $body['Amount']);
    eq(254712345678, $body['PartyA']);
    eq('https://app.example/callbacks/mpesa/stk/cbsec', $body['CallBackURL']);
    eq(base64_encode('174379' . 'pk' . $body['Timestamp']), $body['Password']);
    ok(!$d->initiate(['amount_minor' => 30050, 'phone' => '+254712345678', 'reference' => 'x', 'description' => 'y'])['ok'], 'fractional rejected');
    @unlink(AF_ROOT . '/storage/mpesa_token.json');
    $timeout = new MpesaDriver(fn() => throw new RuntimeException('transport: Operation timed out'));
    $t = $timeout->initiate(['amount_minor' => 10000, 'phone' => '+254712345678', 'reference' => 'x', 'description' => 'y']);
    ok(!$t['ok'] && $t['unknown'], 'timeout → unknown');
    $q = new MpesaDriver(fn($m, $u) => str_contains($u, 'oauth') ? [200, '{"access_token":"T","expires_in":"3599"}'] : [200, '{"ResultCode":"1032","ResultDesc":"Request cancelled by user"}']);
    eq('failed', $q->query('ws')['status']);
    $q2 = new MpesaDriver(fn($m, $u) => str_contains($u, 'oauth') ? [200, '{"access_token":"T","expires_in":"3599"}'] : [500, '{"errorCode":"500.001.1001","errorMessage":"The transaction is being processed"}']);
    eq('pending', $q2->query('ws')['status']);
    putenv('MPESA_CONSUMER_KEY'); putenv('MPESA_CONSUMER_SECRET'); putenv('MPESA_SHORTCODE'); putenv('MPESA_PASSKEY'); putenv('APP_URL'); putenv('MPESA_ENV');
    @unlink(AF_ROOT . '/storage/mpesa_token.json');
});

test('C2B paybill confirmation is parked for review, then posted once; duplicate delivery ignored', function () {
    $s = payFixture();
    $code = Db::i()->val('SELECT member_code FROM group_memberships WHERE id=?', [$s['m']]);
    $p = ['TransID' => 'SGH7XYZ123', 'TransAmount' => '100.00', 'BillRefNumber' => strtolower($code), 'MSISDN' => 'x'];
    PaymentService::handleC2bConfirmation($p, '1.1.1.1');
    PaymentService::handleC2bConfirmation($p, '1.1.1.1');
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'), 'not auto-posted');
    $ev = (int)Db::i()->val('SELECT id FROM payment_provider_events');
    PaymentService::acceptC2b($ev, $s['gid'], $s['chair']);
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));
    throws(fn() => PaymentService::acceptC2b($ev, $s['gid'], $s['chair']), 'not awaiting');
    eq(20000, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
});

test('reminders: escalate with live totals, once per obligation, quiet when paid', function () {
    $s = dailySetup();
    $ex = [];
    foreach (['2026-01-05' => 100, '2026-01-06' => 200, '2026-01-07' => 300] as $day => $total) {
        ContributionEngine::generate($s['gid'], $day);
        ReminderService::run($s['gid'], $day);
        ReminderService::run($s['gid'], $day);  // re-run: no duplicates
        $ex[$day] = Db::i()->val("SELECT body FROM notifications WHERE user_id=? AND category='reminders' ORDER BY id DESC LIMIT 1", [$s['u']]);
        ok(str_contains($ex[$day], "KSh $total"), "$day body should mention KSh $total: {$ex[$day]}");
    }
    eq(3, (int)Db::i()->val("SELECT COUNT(*) FROM notifications WHERE user_id=? AND category='reminders'", [$s['u']]));
    ok(str_contains($ex['2026-01-07'], 'overdue') || str_contains($ex['2026-01-07'], 'due today'));
    // Pay everything: next run says nothing new for old obligations
    Clock::freeze('2026-01-07 09:00:00');
    pay($s, 30000, 'R9', '2026-01-07');
    $before = (int)Db::i()->val("SELECT COUNT(*) FROM notifications WHERE category='reminders'");
    ReminderService::run($s['gid'], '2026-01-07');
    eq($before, (int)Db::i()->val("SELECT COUNT(*) FROM notifications WHERE category='reminders'"));
    // admin digest sent to chair, deduped per day
    ok((int)Db::i()->val("SELECT COUNT(*) FROM notifications WHERE user_id=? AND title='Overdue contributions summary'", [$s['chair']]) >= 1);
});

test('notification queue: email logged with truthful status, SMS skipped when unconfigured, optional-category preferences respected, dedupe', function () {
    $s = dailySetup();
    Notifications::send($s['u'], $s['gid'], 'reminders', 'Hi', 'Body', null, 'k1');
    Notifications::send($s['u'], $s['gid'], 'reminders', 'Hi', 'Body', null, 'k1');   // deduped
    eq(1, (int)Db::i()->val("SELECT COUNT(*) FROM notification_jobs WHERE channel='email'"));
    $st = Notifications::process();
    eq(1, $st['sent']);
    eq(1, $st['skipped'], 'sms not configured');
    $d = Db::i()->val("SELECT detail FROM notification_deliveries d JOIN notification_jobs j ON j.id=d.job_id WHERE j.channel='email'");
    ok(str_contains($d, 'NOT transmitted'));
    Db::i()->exec("INSERT INTO notification_preferences (user_id,channel,category,enabled) VALUES (?,'email','reminders',0)", [$s['u']]);
    Notifications::send($s['u'], $s['gid'], 'reminders', 'Hi2', 'Body', null, 'k2');
    eq(0, (int)Db::i()->val("SELECT COUNT(*) FROM notification_jobs WHERE dedupe_key='k2' AND channel='email'"), 'opted out of optional email');
    Notifications::send($s['u'], $s['gid'], 'payment', 'Receipt', 'Body', null, 'k3');
    eq(1, (int)Db::i()->val("SELECT COUNT(*) FROM notification_jobs WHERE dedupe_key='k3' AND channel='email'"), 'essential notifications ignore the opt-out');
});
