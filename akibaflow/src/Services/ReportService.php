<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Clock, Db};

/**
 * Report queries. Every report states what its numbers mean (basis), its date range and currency.
 * Dashboards and exports call the same functions so they can never disagree.
 */
final class ReportService
{
    private static function meta(array $g, string $title, string $basis, ?string $from, ?string $to): array
    {
        return ['title' => $title, 'basis' => $basis, 'currency' => $g['currency'], 'from' => $from, 'to' => $to,
            'group' => $g['name'], 'generated_at' => Clock::localDateTime(Clock::nowSql(), $g['timezone'], 'd M Y H:i') . ' ' . $g['timezone']];
    }

    public static function group(int $gid): array
    {
        return Db::i()->one('SELECT * FROM `groups` WHERE id=?', [$gid]) ?? [];
    }

    /** Group dashboard numbers. */
    public static function overview(int $gid, string $from, string $to, ?int $planId = null): array
    {
        $db = Db::i();
        $g = self::group($gid);
        $today = Clock::today($g['timezone']);
        [$u0, $u1] = Clock::localRangeToUtc($from, $to, $g['timezone']);
        $pf = $planId ? ' AND o.plan_id=' . (int)$planId : '';

        if ($planId) {
            $collected = (int)$db->val("SELECT COALESCE(SUM(a.amount_minor),0) FROM payment_allocations a JOIN payment_transactions t ON t.id=a.txn_id JOIN contribution_obligations o ON o.id=a.obligation_id
                                        WHERE t.group_id=? AND t.status='posted' AND a.reversed_at IS NULL AND t.paid_at>=? AND t.paid_at<?$pf", [$gid, $u0, $u1]);
        } else {
            $collected = (int)$db->val("SELECT COALESCE(SUM(amount_minor),0) FROM payment_transactions WHERE group_id=? AND status='posted' AND paid_at>=? AND paid_at<?", [$gid, $u0, $u1]);
        }
        $ob = $db->one("SELECT
              COALESCE(SUM(CASE WHEN o.kind='contribution' AND o.due_date BETWEEN ? AND ? AND o.due_date<=? THEN o.original_minor-o.waived_minor END),0) AS expected,
              COALESCE(SUM(CASE WHEN o.kind='contribution' AND o.due_date BETWEEN ? AND ? AND o.due_date<=? THEN o.paid_minor END),0) AS paid_on_expected,
              COALESCE(SUM(CASE WHEN o.status='open' AND o.due_date<=? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS outstanding,
              COALESCE(SUM(CASE WHEN o.status='open' AND o.kind='contribution' AND DATE_ADD(o.due_date, INTERVAL o.grace_days DAY)<? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS overdue,
              COALESCE(SUM(CASE WHEN o.status='open' AND o.kind='contribution' AND o.due_date>? AND o.due_date<=DATE_ADD(?, INTERVAL 7 DAY) THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS upcoming7
            FROM contribution_obligations o WHERE o.group_id=?$pf", [$from, $to, $today, $from, $to, $today, $today, $today, $today, $today, $gid]);
        $expenses = (int)$db->val("SELECT COALESCE(SUM(amount_minor),0) FROM group_expenses WHERE group_id=? AND status='paid' AND paid_at>=? AND paid_at<?", [$gid, $u0, $u1]);
        $pending = $db->one("SELECT COUNT(*) n, COALESCE(SUM(amount_minor),0) amt FROM payment_requests WHERE group_id=? AND status IN ('created','pending','unknown')", [$gid]);
        $failed = (int)$db->val("SELECT COUNT(*) FROM payment_requests WHERE group_id=? AND status='failed' AND created_at>=? AND created_at<?", [$gid, $u0, $u1]);
        return [
            'collected' => $collected, 'expected' => (int)$ob['expected'], 'outstanding' => (int)$ob['outstanding'], 'overdue' => (int)$ob['overdue'],
            'collection_rate' => (int)$ob['expected'] > 0 ? (int)floor(100 * $ob['paid_on_expected'] / $ob['expected']) : null,
            'expenses' => $expenses, 'available_funds' => Ledger::balance($gid, '1000'), 'member_credits' => Ledger::balance($gid, '2000'),
            'pending_n' => (int)$pending['n'], 'pending_amt' => (int)$pending['amt'], 'failed_n' => $failed, 'upcoming7' => (int)$ob['upcoming7'], 'today' => $today,
        ];
    }

    /** One row per active member with live balances (dashboard table, arrears report). */
    public static function memberTable(int $gid, ?string $search = null, string $sort = 'outstanding', bool $onlyOwing = false, int $limit = 200, int $offset = 0): array
    {
        $db = Db::i();
        $g = self::group($gid);
        $today = Clock::today($g['timezone']);
        $order = ['name' => 'u.full_name', 'outstanding' => 'outstanding DESC, u.full_name', 'overdue' => 'overdue_count DESC, u.full_name', 'paid' => 'paid DESC', 'last' => 'last_payment DESC'][$sort] ?? 'outstanding DESC';
        $params = [$today, $today, $today, $today, $gid];
        $where = "m.group_id=? AND m.status IN ('active','suspended')";
        if ($search) { $where .= ' AND (u.full_name LIKE ? OR m.member_code LIKE ? OR u.phone LIKE ?)'; $like = '%' . addcslashes($search, '%_') . '%'; array_push($params, $like, $like, $like); }
        $having = $onlyOwing ? 'HAVING outstanding > 0' : '';
        $sql = "SELECT m.id, m.member_code, m.role, m.status, u.full_name, u.phone,
                  COALESCE(SUM(CASE WHEN o.kind='contribution' AND o.status<>'cancelled' AND o.due_date<=? THEN o.original_minor-o.waived_minor END),0) AS expected,
                  COALESCE(SUM(CASE WHEN o.kind='contribution' THEN o.paid_minor END),0) AS paid,
                  COALESCE(SUM(CASE WHEN o.status='open' AND o.due_date<=? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS outstanding,
                  COALESCE(SUM(CASE WHEN o.status='open' AND o.kind='contribution' AND DATE_ADD(o.due_date, INTERVAL o.grace_days DAY)<? THEN 1 END),0) AS overdue_count,
                  MIN(CASE WHEN o.status='open' AND o.due_date<=? THEN o.due_date END) AS oldest_unpaid,
                  (SELECT MAX(t.paid_at) FROM payment_transactions t WHERE t.membership_id=m.id AND t.status='posted') AS last_payment,
                  (SELECT COALESCE(SUM(c.amount_minor),0) FROM member_credit_entries c WHERE c.membership_id=m.id) AS credit
                FROM group_memberships m JOIN users u ON u.id=m.user_id
                LEFT JOIN contribution_obligations o ON o.membership_id=m.id
                WHERE $where GROUP BY m.id $having ORDER BY $order LIMIT " . (int)$limit . ' OFFSET ' . (int)$offset;
        return $db->all($sql, $params);
    }

    public static function collections(int $gid, string $from, string $to, string $by = 'day'): array
    {
        $g = self::group($gid);
        [$u0, $u1] = Clock::localRangeToUtc($from, $to, $g['timezone']);
        $off = (new \DateTimeZone($g['timezone']))->getOffset(new \DateTimeImmutable($from));
        $fmt = match ($by) { 'month' => '%Y-%m', 'week' => '%x-W%v', default => '%Y-%m-%d' };
        $rows = Db::i()->all(
            "SELECT DATE_FORMAT(DATE_ADD(paid_at, INTERVAL ? SECOND), '$fmt') AS period, COUNT(*) n, SUM(amount_minor) amount,
                    SUM(CASE WHEN source='provider_verified' THEN amount_minor ELSE 0 END) AS verified_provider, SUM(CASE WHEN source='manual' THEN amount_minor ELSE 0 END) AS manual
             FROM payment_transactions WHERE group_id=? AND status='posted' AND paid_at>=? AND paid_at<? GROUP BY period ORDER BY period", [$off, $gid, $u0, $u1]);
        return ['meta' => self::meta($g, ucfirst($by) . 'ly collections', 'Verified collections: money actually received and posted (reversed payments excluded). Not expected amounts.', $from, $to),
            'columns' => ['Period', 'Payments', 'Provider-verified', 'Manually recorded', 'Total collected'],
            'rows' => array_map(fn($r) => [$r['period'], (int)$r['n'], (int)$r['verified_provider'], (int)$r['manual'], (int)$r['amount']], $rows),
            'money_cols' => [2, 3, 4], 'total_cols' => [1, 2, 3, 4]];
    }

    public static function arrears(int $gid): array
    {
        $g = self::group($gid);
        $rows = self::memberTable($gid, null, 'outstanding', true, 1000);
        return ['meta' => self::meta($g, 'Outstanding contributions', 'Outstanding member obligations (amounts owed, NOT money held). Late fees shown inside the total where enabled.', null, Clock::today($g['timezone'])),
            'columns' => ['Member', 'Code', 'Phone', 'Overdue items', 'Oldest unpaid', 'Outstanding'],
            'rows' => array_map(fn($r) => [$r['full_name'], $r['member_code'], $r['phone'] ?? '', (int)$r['overdue_count'], $r['oldest_unpaid'] ?? '', (int)$r['outstanding']], $rows),
            'money_cols' => [5], 'total_cols' => [5]];
    }

    public static function memberContributions(int $gid): array
    {
        $g = self::group($gid);
        $rows = self::memberTable($gid, null, 'name', false, 1000);
        return ['meta' => self::meta($g, 'Member contribution summary', 'Expected = obligations due to date; Paid = verified payments allocated; Outstanding = still owed.', null, Clock::today($g['timezone'])),
            'columns' => ['Member', 'Code', 'Expected to date', 'Paid', 'Outstanding', 'Credit held'],
            'rows' => array_map(fn($r) => [$r['full_name'], $r['member_code'], (int)$r['expected'], (int)$r['paid'], (int)$r['outstanding'], (int)$r['credit']], $rows),
            'money_cols' => [2, 3, 4, 5], 'total_cols' => [2, 3, 4, 5]];
    }

    public static function expenses(int $gid, string $from, string $to): array
    {
        $g = self::group($gid);
        $rows = Db::i()->all("SELECT e.*, u.full_name FROM group_expenses e JOIN users u ON u.id=e.requested_by WHERE e.group_id=? AND e.expense_date BETWEEN ? AND ? ORDER BY e.expense_date, e.id", [$gid, $from, $to]);
        return ['meta' => self::meta($g, 'Expense report', 'All expenses by expense date. Only status "Paid" has reduced group funds; proposed/approved are commitments, not spending.', $from, $to),
            'columns' => ['Date', 'Category', 'Description', 'Payee', 'Status', 'Requested by', 'Amount'],
            'rows' => array_map(fn($r) => [$r['expense_date'], $r['category'], $r['description'], $r['payee'], status_label($r['status']), $r['full_name'], (int)$r['amount_minor']], $rows),
            'money_cols' => [6], 'total_cols' => [], 'sum_where' => ['col' => 4, 'equals' => 'Paid', 'sum' => 6]];
    }

    public static function incomeExpenditure(int $gid, string $from, string $to): array
    {
        $g = self::group($gid);
        [$u0, $u1] = Clock::localRangeToUtc($from, $to, $g['timezone']);
        $db = Db::i();
        $sum = fn(string $code, string $side) => (int)$db->val(
            "SELECT COALESCE(SUM(e.{$side}_minor),0) FROM ledger_entries e JOIN financial_accounts a ON a.id=e.account_id JOIN ledger_journals j ON j.id=e.journal_id
             WHERE a.group_id=? AND a.code=? AND j.posted_at>=? AND j.posted_at<?", [$gid, $code, $u0, $u1]);
        $contrib = $sum('3000', 'credit') - $sum('3000', 'debit');
        $penalty = $sum('4000', 'credit') - $sum('4000', 'debit');
        $expense = $sum('5000', 'debit') - $sum('5000', 'credit');
        $opening = Ledger::balance($gid, '1000', $u0);
        $closing = Ledger::balance($gid, '1000', $u1);
        $rows = [['Contributions received (net of reversals)', $contrib], ['Late fees received', $penalty], ['Total income', $contrib + $penalty], ['Expenses paid (net of reversals)', -$expense],
            ['Net surplus / (deficit)', $contrib + $penalty - $expense], ['Overpayments held as member credit (liability, not income)', $sum('2000', 'credit') - $sum('2000', 'debit')],
            ['Group funds at start of period', $opening], ['Group funds at end of period', $closing]];
        return ['meta' => self::meta($g, 'Income and expenditure', 'Cash basis, from the double-entry ledger. Unpaid obligations are not income.', $from, $to),
            'columns' => ['Line', 'Amount'], 'rows' => $rows, 'money_cols' => [1], 'total_cols' => []];
    }

    public static function cashMovement(int $gid, string $from, string $to): array
    {
        $g = self::group($gid);
        [$u0, $u1] = Clock::localRangeToUtc($from, $to, $g['timezone']);
        $rows = Db::i()->all("SELECT j.id, j.posted_at, j.ref_type, j.description, e.debit_minor, e.credit_minor FROM ledger_entries e JOIN financial_accounts a ON a.id=e.account_id JOIN ledger_journals j ON j.id=e.journal_id
                              WHERE a.group_id=? AND a.code='1000' AND j.posted_at>=? AND j.posted_at<? ORDER BY j.id", [$gid, $u0, $u1]);
        $bal = Ledger::balance($gid, '1000', $u0);
        $out = [];
        foreach ($rows as $r) {
            $bal += (int)$r['debit_minor'] - (int)$r['credit_minor'];
            $out[] = [Clock::localDateTime($r['posted_at'], $g['timezone'], 'Y-m-d H:i'), $r['ref_type'], $r['description'], (int)$r['debit_minor'], (int)$r['credit_minor'], $bal];
        }
        return ['meta' => self::meta($g, 'Cash movement', 'Movements of the group funds account (money in = debit, money out = credit) with running balance.', $from, $to),
            'columns' => ['Posted', 'Type', 'Description', 'Money in', 'Money out', 'Balance'], 'rows' => $out, 'money_cols' => [3, 4, 5], 'total_cols' => [3, 4]];
    }

    public static function transactions(int $gid, string $from, string $to, ?string $status = null, ?string $source = null): array
    {
        $g = self::group($gid);
        [$u0, $u1] = Clock::localRangeToUtc($from, $to, $g['timezone']);
        $w = 't.group_id=? AND t.paid_at>=? AND t.paid_at<?';
        $p = [$gid, $u0, $u1];
        if (in_array($status, ['posted', 'reversed'], true)) { $w .= ' AND t.status=?'; $p[] = $status; }
        if (in_array($source, ['provider_verified', 'manual'], true)) { $w .= ' AND t.source=?'; $p[] = $source; }
        $rows = Db::i()->all("SELECT t.*, u.full_name, m.member_code FROM payment_transactions t JOIN group_memberships m ON m.id=t.membership_id JOIN users u ON u.id=m.user_id WHERE $w ORDER BY t.id DESC LIMIT 2000", $p);
        return ['meta' => self::meta($g, 'Payment transactions', 'Posted = counted as money received. Manual entries are recorded by an officer; provider-verified ones were confirmed with the payment provider.', $from, $to),
            'columns' => ['Receipt', 'Date', 'Member', 'Method', 'Reference', 'Source', 'Status', 'Amount'],
            'rows' => array_map(fn($r) => [$r['receipt_no'], Clock::localDateTime($r['paid_at'], $g['timezone'], 'Y-m-d H:i'), $r['full_name'] . ' (' . $r['member_code'] . ')', $r['method'], $r['provider_ref'], $r['source'] === 'manual' ? 'Manual' : 'Provider-verified', status_label($r['status']), (int)$r['amount_minor']], $rows),
            'money_cols' => [7], 'total_cols' => [], 'sum_where' => ['col' => 6, 'equals' => 'Posted', 'sum' => 7], 'raw' => $rows];
    }

    /** Chronological statement for one member: obligations raised, payments received, running outstanding. */
    public static function memberStatement(int $membershipId, string $from, string $to): array
    {
        $db = Db::i();
        $m = $db->one('SELECT m.*, u.full_name, g.name gname, g.currency, g.timezone, g.id gid FROM group_memberships m JOIN users u ON u.id=m.user_id JOIN `groups` g ON g.id=m.group_id WHERE m.id=?', [$membershipId]);
        $g = ['name' => $m['gname'], 'currency' => $m['currency'], 'timezone' => $m['timezone']];
        [$u0, $u1] = Clock::localRangeToUtc($from, $to, $m['timezone']);
        $events = [];
        foreach ($db->all("SELECT o.due_date, o.kind, o.original_minor, o.waived_minor, p.name FROM contribution_obligations o JOIN contribution_plans p ON p.id=o.plan_id
                           WHERE o.membership_id=? AND o.due_date BETWEEN ? AND ? AND o.status<>'cancelled' ORDER BY o.due_date, o.id", [$membershipId, $from, $to]) as $o) {
            $events[] = [$o['due_date'] . ' 00:00', $o['due_date'], ($o['kind'] === 'penalty' ? 'Late fee — ' : 'Contribution due — ') . $o['name'], (int)$o['original_minor'] - (int)$o['waived_minor'], 0, ''];
        }
        foreach ($db->all("SELECT t.paid_at, t.amount_minor, t.receipt_no, t.status FROM payment_transactions t WHERE t.membership_id=? AND t.paid_at>=? AND t.paid_at<? ORDER BY t.paid_at", [$membershipId, $u0, $u1]) as $t) {
            $local = Clock::localDateTime($t['paid_at'], $m['timezone'], 'Y-m-d H:i');
            $events[] = [$local, substr($local, 0, 10), 'Payment received' . ($t['status'] === 'reversed' ? ' (REVERSED)' : ''), 0, $t['status'] === 'reversed' ? 0 : (int)$t['amount_minor'], $t['receipt_no']];
        }
        usort($events, fn($a, $b) => strcmp($a[0], $b[0]));
        $bal = 0;
        $rows = [];
        foreach ($events as $e) {
            $bal += $e[3] - $e[4];
            $rows[] = [$e[1], $e[2], $e[5], $e[3], $e[4], $bal];
        }
        return ['meta' => self::meta($g, 'Member statement — ' . $m['full_name'] . ' (' . $m['member_code'] . ')', 'Charges are contributions falling due in the period; credits are verified payments. Running balance = charges − payments within this period (excludes balances before it).', $from, $to),
            'columns' => ['Date', 'Description', 'Receipt', 'Charged', 'Paid', 'Running balance'], 'rows' => $rows, 'money_cols' => [3, 4, 5], 'total_cols' => [3, 4]];
    }

    public static function totals(array $rep): array
    {
        $t = [];
        foreach ($rep['total_cols'] as $c) $t[$c] = array_sum(array_column($rep['rows'], $c));
        return $t;
    }

    public static function csv(array $rep, string $filename): never
    {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . preg_replace('/[^A-Za-z0-9_.-]/', '_', $filename) . '"');
        $o = fopen('php://output', 'w');
        $safe = fn($v) => is_string($v) && $v !== '' && strpbrk($v[0], '=+-@') !== false ? "'" . $v : $v; // neutralise spreadsheet formula injection
        fputcsv($o, [$rep['meta']['title']]);
        fputcsv($o, ['Group', $rep['meta']['group']]);
        fputcsv($o, ['Currency', $rep['meta']['currency']]);
        if ($rep['meta']['from'] || $rep['meta']['to']) fputcsv($o, ['Period', ($rep['meta']['from'] ?? '') . ' to ' . ($rep['meta']['to'] ?? '')]);
        fputcsv($o, ['Basis', $rep['meta']['basis']]);
        fputcsv($o, ['Generated', $rep['meta']['generated_at']]);
        fputcsv($o, []);
        fputcsv($o, $rep['columns']);
        foreach ($rep['rows'] as $r) {
            foreach ($rep['money_cols'] as $c) if (isset($r[$c]) && is_int($r[$c])) $r[$c] = \Akiba\Core\Money::dec($r[$c]);
            fputcsv($o, array_map($safe, $r));
        }
        $t = self::totals($rep);
        if ($t) {
            $line = array_fill(0, count($rep['columns']), '');
            $line[0] = 'TOTAL';
            foreach ($t as $c => $v) $line[$c] = in_array($c, $rep['money_cols'], true) ? \Akiba\Core\Money::dec((int)$v) : $v;
            fputcsv($o, $line);
        }
        fclose($o);
        exit;
    }
}
