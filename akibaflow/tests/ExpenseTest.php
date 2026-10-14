<?php
use Akiba\Core\Db;
use Akiba\Services\{ExpenseService, Ledger, PaymentService};

test('expense workflow: proposed is not spending; self-approval blocked; dual approval over threshold; cannot overspend; reversal restores', function () {
    $g = mkGroup();
    [$tu, $tm] = mkMember($g['gid'], 'treasurer');
    [$cu, $cm] = mkMember($g['gid'], 'secretary');
    [$mu, $mm] = mkMember($g['gid']);
    Db::i()->exec('UPDATE group_settings SET expense_dual_threshold_minor=100000 WHERE group_id=?', [$g['gid']]);
    PaymentService::recordManual($g['gid'], $mm, 300000, 'cash', 'FUND1', '', $tu);       // KSh 3,000 in the bank
    $e = ExpenseService::create($g['gid'], $cu, ['category' => 'Project', 'description' => 'Tent hire', 'amount' => '2000', 'payee' => 'Tents Ltd', 'expense_date' => '2026-01-07']);
    ok($e['ok']);
    eq('proposed', Db::i()->val('SELECT status FROM group_expenses'));
    eq(300000, Ledger::balance($g['gid'], '1000'), 'proposal does not move money');
    eq(2, (int)Db::i()->val('SELECT required_approvals FROM group_expenses'), '≥ threshold needs two');
    ok(!ExpenseService::decide($e['id'], $g['gid'], $cu, 'secretary', true)['ok'], 'secretary has no approval right');
    $own = ExpenseService::create($g['gid'], $tu, ['category' => 'Project', 'description' => 'Own', 'amount' => '10', 'payee' => 'X', 'expense_date' => '2026-01-07']);
    ok(!ExpenseService::decide($own['id'], $g['gid'], $tu, 'treasurer', true)['ok'], 'cannot approve own');
    ok(ExpenseService::decide($e['id'], $g['gid'], $tu, 'treasurer', true)['ok']);
    eq('proposed', Db::i()->val('SELECT status FROM group_expenses WHERE id=?', [$e['id']]), 'still needs a 2nd approval');
    ok(!ExpenseService::decide($e['id'], $g['gid'], $tu, 'treasurer', true)['ok'], 'same approver twice blocked');
    ok(!ExpenseService::pay($e['id'], $g['gid'], $tu, 'cash', '')['ok'], 'cannot pay unapproved');
    ok(ExpenseService::decide($e['id'], $g['gid'], $g['chair'], 'chairperson', true)['ok']);
    eq('approved', Db::i()->val('SELECT status FROM group_expenses WHERE id=?', [$e['id']]));
    ok(ExpenseService::pay($e['id'], $g['gid'], $tu, 'cash', 'CHQ1')['ok']);
    eq(100000, Ledger::balance($g['gid'], '1000'));
    ok(!ExpenseService::pay($e['id'], $g['gid'], $tu, 'cash', '')['ok'], 'no double payment');
    $big = ExpenseService::create($g['gid'], $tu, ['category' => 'Project', 'description' => 'Too big', 'amount' => '5000', 'payee' => 'Y', 'expense_date' => '2026-01-07']);
    ExpenseService::decide($big['id'], $g['gid'], $g['chair'], 'chairperson', true);
    $c2 = ExpenseService::decide($big['id'], $g['gid'], $cu, 'secretary', true); // secretary can't
    ok(!$c2['ok']);
    ExpenseService::create($g['gid'], $cu, ['category' => 'Other', 'description' => 'Small', 'amount' => '5000', 'payee' => 'Z', 'expense_date' => '2026-01-07']);
    ok(ExpenseService::reverse($e['id'], $g['gid'], $tu, 'Cancelled event')['ok']);
    eq(300000, Ledger::balance($g['gid'], '1000'), 'compensating entry restores funds');
    eq([], Ledger::unbalancedJournals());
    $rec = PaymentService::reconciliation($g['gid']);
    eq($rec['funds_ledger'], $rec['funds_expected'], 'ledger agrees with payments − paid expenses');
});

test('expense payout is blocked when group funds are insufficient', function () {
    $g = mkGroup();
    [$tu] = mkMember($g['gid'], 'treasurer');
    $e = ExpenseService::create($g['gid'], $tu, ['category' => 'Other', 'description' => 'No money', 'amount' => '100', 'payee' => 'P', 'expense_date' => '2026-01-07']);
    ExpenseService::decide($e['id'], $g['gid'], $g['chair'], 'chairperson', true);
    $r = ExpenseService::pay($e['id'], $g['gid'], $tu, 'cash', '');
    ok(!$r['ok'] && str_contains($r['error'], 'Insufficient'));
});

