<?php
use Akiba\Core\{Clock, Db};
use Akiba\Services\{AllocationService, ContributionEngine, GroupService, Ledger, PaymentService, PlanService};

/** Sets up: group, chair, one enrolled member (joined 2026-01-05), daily KSh 100 plan from 2026-01-05. */
function dailySetup(string $joined = '2026-01-05'): array
{
    $g = mkGroup();
    [$u, $m] = mkMember($g['gid'], 'member', $joined);
    $plan = mkPlan($g['gid'], $g['chair'], ['amount' => '100', 'frequency' => 'daily', 'start_date' => '2026-01-05', 'lookahead_days' => 0]);
    return $g + ['u' => $u, 'm' => $m, 'plan' => $plan];
}

function pay(array $s, int $minor, string $ref, string $today): array
{
    return Db::i()->tx(function () use ($s, $minor, $ref, $today) {
        $p = PaymentService::post(['group_id' => $s['gid'], 'membership_id' => $s['m'], 'amount_minor' => $minor, 'provider' => 'manual', 'provider_ref' => $ref,
            'source' => 'manual', 'method' => 'cash', 'request_id' => null, 'recorded_by' => $s['chair'], 'note' => null]);
        return $p;
    });
}

test('ACCEPTANCE daily: 3 missed days = KSh 300, pay 200 → 100, next day → 200', function () {
    $s = dailySetup();
    // Three consecutive days with no payment
    foreach (['2026-01-05', '2026-01-06', '2026-01-07'] as $d) ContributionEngine::generate($s['gid'], $d);
    $b = ContributionEngine::balance($s['m'], '2026-01-07');
    eq(30000, $b['outstanding_contrib'], 'day 3 outstanding');
    eq(3, $b['unpaid_count']);
    eq(2, $b['overdue_count'], 'day1+day2 overdue, day3 only due');
    eq(20000, $b['overdue_minor']);
    eq('2026-01-05', $b['oldest_unpaid']);
    $rows = Db::i()->all('SELECT original_minor FROM contribution_obligations WHERE membership_id=? ORDER BY due_date', [$s['m']]);
    eq([10000, 10000, 10000], array_map(fn($r) => (int)$r['original_minor'], $rows));

    // Verified payment of 200, oldest first
    Clock::freeze('2026-01-07 09:00:00');
    $p = pay($s, 20000, 'RCPT1', '2026-01-07');
    $st = Db::i()->all('SELECT due_date,status,paid_minor FROM contribution_obligations WHERE membership_id=? ORDER BY due_date', [$s['m']]);
    eq(['paid', 'paid', 'open'], array_column($st, 'status'));
    eq(10000, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);
    eq(2, Db::i()->val('SELECT COUNT(*) FROM payment_allocations WHERE txn_id=?', [$p['txn_id']]), 'two allocation rows');

    // Replay of the same payment must not create another
    $again = pay($s, 20000, 'RCPT1', '2026-01-07');
    ok($again['duplicate'], 'duplicate detected');
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'));

    // Next day's obligation
    ContributionEngine::generate($s['gid'], '2026-01-08');
    eq(20000, ContributionEngine::balance($s['m'], '2026-01-08')['outstanding_contrib']);
    eq([], Ledger::unbalancedJournals());
    eq(20000, Ledger::balance($s['gid'], '1000'), 'group funds = cash actually received');
});

test('generation is idempotent: re-running jobs creates no duplicates', function () {
    $s = dailySetup();
    ContributionEngine::generate($s['gid'], '2026-01-10');
    $n = (int)Db::i()->val('SELECT COUNT(*) FROM contribution_obligations');
    eq(6, $n);
    ContributionEngine::generate($s['gid'], '2026-01-10');
    ContributionEngine::generate($s['gid'], '2026-01-10', true); // full regeneration ignoring watermark
    eq($n, (int)Db::i()->val('SELECT COUNT(*) FROM contribution_obligations'));
});

test('ACCEPTANCE weekly: KSh 500 every Monday, two missed Mondays = 1,000, nothing on other days', function () {
    $g = mkGroup();
    [, $m] = mkMember($g['gid'], 'member', '2026-01-05');
    mkPlan($g['gid'], $g['chair'], ['amount' => '500', 'frequency' => 'weekly', 'weekday' => 1, 'start_date' => '2026-01-05', 'lookahead_days' => 0]);
    foreach (['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-10', '2026-01-12', '2026-01-13'] as $d) ContributionEngine::generate($g['gid'], $d);
    $dates = array_column(Db::i()->all('SELECT due_date FROM contribution_obligations WHERE membership_id=? ORDER BY due_date', [$m]), 'due_date');
    eq(['2026-01-05', '2026-01-12'], $dates);
    eq(100000, ContributionEngine::balance($m, '2026-01-13')['outstanding_contrib']);
});

test('ACCEPTANCE monthly: KSh 2,000 on the 5th, two missed months = 4,000, no daily accrual', function () {
    $g = mkGroup();
    [, $m] = mkMember($g['gid'], 'member', '2026-01-01');
    mkPlan($g['gid'], $g['chair'], ['amount' => '2000', 'frequency' => 'monthly', 'month_day' => 5, 'start_date' => '2026-01-01', 'lookahead_days' => 0]);
    foreach (['2026-01-04', '2026-01-05', '2026-01-20', '2026-02-05', '2026-02-27'] as $d) ContributionEngine::generate($g['gid'], $d);
    eq(2, (int)Db::i()->val('SELECT COUNT(*) FROM contribution_obligations'));
    eq(400000, ContributionEngine::balance($m, '2026-02-27')['outstanding_contrib']);
});

test('partial payments: 250 against 4×100 → Mon/Tue paid, Wed 50 left, Thu untouched, 150 outstanding', function () {
    $s = dailySetup();
    ContributionEngine::generate($s['gid'], '2026-01-08');
    pay($s, 25000, 'P250', '2026-01-08');
    $st = Db::i()->all('SELECT status,paid_minor FROM contribution_obligations WHERE membership_id=? ORDER BY due_date', [$s['m']]);
    eq(['paid', 'paid', 'open', 'open'], array_column($st, 'status'));
    eq([10000, 10000, 5000, 0], array_map(fn($r) => (int)$r['paid_minor'], $st));
    eq(15000, ContributionEngine::balance($s['m'], '2026-01-08')['outstanding_contrib']);
    $b = ContributionEngine::balance($s['m'], '2026-01-08');
    eq('2026-01-07', Db::i()->val("SELECT due_date FROM contribution_obligations WHERE membership_id=? AND status='open' ORDER BY due_date LIMIT 1", [$s['m']]));
});

test('advance payment: excess held as explicit credit (default policy), then applied by generation under apply_future', function () {
    $s = dailySetup();
    ContributionEngine::generate($s['gid'], '2026-01-05');
    $p = pay($s, 30000, 'ADV1', '2026-01-05'); // owes 100, pays 300
    eq(20000, ContributionEngine::balance($s['m'], '2026-01-05')['credit']);
    eq(0, ContributionEngine::balance($s['m'], '2026-01-05')['outstanding_contrib']);
    ContributionEngine::generate($s['gid'], '2026-01-06');
    eq(100 * 100, ContributionEngine::balance($s['m'], '2026-01-06')['outstanding_contrib'], 'held credit is NOT auto-applied under hold_credit');
    $applied = Db::i()->tx(fn() => AllocationService::applyCredit($s['gid'], $s['m'], '2026-01-06', false));
    eq(10000, $applied);
    eq(0, ContributionEngine::balance($s['m'], '2026-01-06')['outstanding_contrib']);
    eq(10000, ContributionEngine::balance($s['m'], '2026-01-06')['credit']);

    Db::i()->exec("UPDATE group_settings SET excess_policy='apply_future' WHERE group_id=?", [$s['gid']]);
    ContributionEngine::generate($s['gid'], '2026-01-07');
    eq(0, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib'], 'auto-applied');
    eq(0, ContributionEngine::balance($s['m'], '2026-01-07')['credit']);
    eq([], Ledger::unbalancedJournals());
    eq(0, Ledger::balance($s['gid'], '2000'), 'credit liability fully consumed');
    eq(30000, Ledger::balance($s['gid'], '3000'));
});

test('payment reversal reopens obligations, never deletes, and keeps ledger + credit consistent', function () {
    $s = dailySetup();
    ContributionEngine::generate($s['gid'], '2026-01-06');
    $p = pay($s, 30000, 'REV1', '2026-01-06');         // 200 owed, 100 credit
    Db::i()->tx(fn() => AllocationService::applyCredit($s['gid'], $s['m'], '2026-01-06', true)); // nothing due; includes upcoming (none generated)
    ContributionEngine::generate($s['gid'], '2026-01-07');
    Db::i()->tx(fn() => AllocationService::applyCredit($s['gid'], $s['m'], '2026-01-07', false)); // credit spent on day 3
    eq(0, ContributionEngine::balance($s['m'], '2026-01-07')['outstanding_contrib']);

    AllocationService::reverse($p['txn_id'], 'Cashier error', $s['chair'], $s['chair']);
    $t = Db::i()->one('SELECT status FROM payment_transactions WHERE id=?', [$p['txn_id']]);
    eq('reversed', $t['status']);
    eq(1, (int)Db::i()->val('SELECT COUNT(*) FROM payment_transactions'), 'row retained');
    $b = ContributionEngine::balance($s['m'], '2026-01-07');
    eq(30000, $b['outstanding_contrib'], 'all three days owed again');
    eq(0, $b['credit'], 'no negative credit');
    eq(0, Ledger::balance($s['gid'], '1000'));
    eq(0, Ledger::balance($s['gid'], '2000'));
    eq(0, Ledger::balance($s['gid'], '3000'));
    eq([], Ledger::unbalancedJournals());
    throws(fn() => AllocationService::reverse($p['txn_id'], 'again', 1, 1), 'posted');
    throws(fn() => Db::i()->exec('DELETE FROM payment_transactions WHERE id=?', [$p['txn_id']]), 'cannot be deleted');
    throws(fn() => Db::i()->exec('UPDATE ledger_entries SET debit_minor=1 WHERE id>0'), 'immutable');
});

test('waiver reduces what is owed, not what was received', function () {
    $s = dailySetup();
    ContributionEngine::generate($s['gid'], '2026-01-06');
    $first = (int)Db::i()->val('SELECT id FROM contribution_obligations ORDER BY due_date LIMIT 1');
    AllocationService::waive($first, 10000, 'Hospitalised', $s['chair']);
    eq(10000, ContributionEngine::balance($s['m'], '2026-01-06')['outstanding_contrib']);
    eq('waived', Db::i()->val('SELECT status FROM contribution_obligations WHERE id=?', [$first]));
    eq(0, Ledger::balance($s['gid'], '1000'));
    throws(fn() => AllocationService::waive($first, 100, 'x', $s['chair']), 'open');
});

test('plan change is effective-dated and never rewrites existing obligations', function () {
    $s = dailySetup();
    ContributionEngine::generate($s['gid'], '2026-01-07');
    Clock::freeze('2026-01-07 10:00:00');
    $bad = PlanService::newVersion($s['plan'], $s['chair'], ['amount' => '200', 'frequency' => 'daily', 'effective_from' => '2026-01-07', 'reason' => 'x']);
    ok(!$bad['ok'], 'cannot backdate');
    $r = PlanService::newVersion($s['plan'], $s['chair'], ['amount' => '200', 'frequency' => 'daily', 'effective_from' => '2026-01-09', 'reason' => 'Cost of living', 'lookahead_days' => 0]);
    ok($r['ok'], json_encode($r['errors']));
    foreach (['2026-01-08', '2026-01-09', '2026-01-10'] as $d) ContributionEngine::generate($s['gid'], $d);
    $rows = Db::i()->all('SELECT due_date, original_minor FROM contribution_obligations ORDER BY due_date');
    $by = array_column($rows, 'original_minor', 'due_date');
    eq(['2026-01-05' => '10000', '2026-01-06' => '10000', '2026-01-07' => '10000', '2026-01-08' => '10000', '2026-01-09' => '20000', '2026-01-10' => '20000'], array_map('strval', $by));
    ok((int)Db::i()->val("SELECT COUNT(*) FROM audit_logs WHERE action='plan.terms_changed'") === 1, 'audited');
});

test('member joining late / exiting / pausing only owes within eligibility', function () {
    $g = mkGroup();
    [, $late] = mkMember($g['gid'], 'member', '2026-01-08');
    [, $exit] = mkMember($g['gid'], 'member', '2026-01-05');
    [, $pause] = mkMember($g['gid'], 'member', '2026-01-05');
    $plan = mkPlan($g['gid'], $g['chair'], ['amount' => '100', 'frequency' => 'daily', 'start_date' => '2026-01-05', 'lookahead_days' => 0]);
    ContributionEngine::generate($g['gid'], '2026-01-07');
    eq(0, (int)Db::i()->val('SELECT COUNT(*) FROM contribution_obligations WHERE membership_id=?', [$late]), 'not yet joined');
    Clock::freeze('2026-01-07 08:00:00');
    GroupService::setStatus($g['gid'], $exit, 'exited');                          // exits on 2026-01-07
    PlanService::pauseMember($plan, $pause, '2026-01-08', '2026-01-10', $g['chair']);
    foreach (['2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11'] as $d) ContributionEngine::generate($g['gid'], $d);
    $cnt = fn($m) => (int)Db::i()->val('SELECT COUNT(*) FROM contribution_obligations WHERE membership_id=?', [$m]);
    eq(4, $cnt($late), 'late joiner: Jan 8–11');
    eq(3, $cnt($exit), 'exit: Jan 5–7 only');
    eq(5, $cnt($pause), 'paused: Jan 5,6,7 then 10,11');
});

test('penalties are optional, separate, capped, and never compound', function () {
    $s = dailySetup();
    ContributionEngine::generate($s['gid'], '2026-01-08');
    eq(0, Akiba\Services\PenaltyService::run($s['gid'], '2026-01-08'), 'disabled by default');
    Db::i()->exec('UPDATE group_settings SET penalty_enabled=1, penalty_fixed_minor=5000, penalty_max_per_member_minor=8000 WHERE group_id=?', [$s['gid']]);
    eq(2, Akiba\Services\PenaltyService::run($s['gid'], '2026-01-08'), 'obligations overdue as at the 8th: Jan 5,6,7 (grace 0); cap limits total');
    eq(0, Akiba\Services\PenaltyService::run($s['gid'], '2026-01-08'), 're-run adds nothing');
    $pen = (int)Db::i()->val("SELECT SUM(original_minor) FROM contribution_obligations WHERE kind='penalty'");
    eq(8000, $pen, 'capped at 80');
    $b = ContributionEngine::balance($s['m'], '2026-01-08');
    eq(40000, $b['outstanding_contrib'], 'contributions unchanged by fines');
    eq(8000, $b['outstanding_penalty']);
});
