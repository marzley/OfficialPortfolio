<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Clock, Db};

/**
 * Generates one obligation per member per due date (idempotent via UNIQUE(plan,member,kind,period_key))
 * and derives balances from the obligation rows — never from "days since last payment".
 */
final class ContributionEngine
{
    /** SQL expression for the display status. $t is the SQL placeholder/column for the group-local "today". */
    public static function statusSql(string $alias = 'o'): string
    {
        return "CASE WHEN $alias.status <> 'open' THEN $alias.status
                     WHEN $alias.due_date > ? THEN 'upcoming'
                     WHEN DATE_ADD($alias.due_date, INTERVAL $alias.grace_days DAY) < ? THEN 'overdue'
                     WHEN $alias.paid_minor > 0 THEN 'partially_paid'
                     ELSE 'due' END";
    }

    /**
     * Generate obligations for every active plan (optionally one group). Safe to re-run any number of times.
     * @return array{created:int,groups:int}
     */
    public static function generate(?int $groupId = null, ?string $asOfOverride = null, bool $full = false): array
    {
        $db = Db::i();
        $groups = $db->all("SELECT id,timezone FROM `groups` WHERE status='active'" . ($groupId ? ' AND id=' . (int)$groupId : ''));
        $created = 0;
        foreach ($groups as $g) {
            $asOf = $asOfOverride ?? Clock::today($g['timezone']);
            foreach ($db->all("SELECT * FROM contribution_plans WHERE group_id=? AND status='active'", [$g['id']]) as $plan) {
                $created += self::generateForPlan($plan, $asOf, $full);
            }
            if (GroupService::settings((int)$g['id'])['excess_policy'] === 'apply_future') {
                foreach ($db->all('SELECT membership_id FROM member_credit_entries WHERE group_id=? GROUP BY membership_id HAVING SUM(amount_minor)>0', [$g['id']]) as $r) {
                    AllocationService::applyCredit((int)$g['id'], (int)$r['membership_id'], $asOf, true);
                }
            }
        }
        return ['created' => $created, 'groups' => count($groups)];
    }

    public static function generateForPlan(array $plan, string $asOf, bool $full = false): int
    {
        $db = Db::i();
        $versions = $db->all('SELECT * FROM contribution_plan_versions WHERE plan_id=? ORDER BY effective_from, version_no', [$plan['id']]);
        if (!$versions) return 0;
        $intervals = $db->all(
            "SELECT pm.membership_id, pm.from_date, pm.to_date FROM contribution_plan_members pm
             JOIN group_memberships m ON m.id=pm.membership_id
             WHERE pm.plan_id=? AND m.status='active'", [$plan['id']]);
        if (!$intervals) return 0;
        $marks = [];
        if (!$full) {
            foreach ($db->all("SELECT membership_id, MAX(due_date) d FROM contribution_obligations WHERE plan_id=? AND kind='contribution' GROUP BY membership_id", [$plan['id']]) as $r) $marks[(int)$r['membership_id']] = $r['d'];
        }
        $rows = [];
        foreach ($intervals as $iv) {
            $mid = (int)$iv['membership_id'];
            foreach ($versions as $i => $v) {
                $next = $versions[$i + 1]['effective_from'] ?? null;
                $from = max($v['effective_from'], $plan['start_date'], $iv['from_date']);
                if (isset($marks[$mid])) $from = max($from, ScheduleEngine::addDays($marks[$mid], 1));
                $to = ScheduleEngine::addDays($asOf, (int)$v['lookahead_days']);
                if ($next) $to = min($to, ScheduleEngine::addDays($next, -1));
                if ($plan['end_date']) $to = min($to, $plan['end_date']);
                if ($iv['to_date']) $to = min($to, $iv['to_date']);
                foreach (ScheduleEngine::dueDates($v, $from, $to) as $due) {
                    $rows[] = [$mid, $v, $due];
                }
            }
        }
        if (!$rows) return 0;
        $before = (int)$db->val("SELECT COUNT(*) FROM contribution_obligations WHERE plan_id=?", [$plan['id']]);
        $now = Clock::nowSql();
        $db->tx(function () use ($db, $plan, $rows, $now) {
            foreach (array_chunk($rows, 250) as $chunk) {
                $p = [];
                foreach ($chunk as [$mid, $v, $due]) {
                    array_push($p, $plan['group_id'], $mid, $plan['id'], $v['id'], $due, $due, $v['grace_days'], $v['amount_minor'], $now, 'open');
                }
                $sql = 'INSERT INTO contribution_obligations (group_id,membership_id,plan_id,plan_version_id,kind,period_key,due_date,grace_days,original_minor,created_at,status) VALUES '
                    . implode(',', array_map(fn() => "(?,?,?,?,'contribution',?,?,?,?,?,?)", $chunk))
                    . ' ON DUPLICATE KEY UPDATE id=id';
                $db->exec($sql, $p);
            }
        });
        return (int)$db->val("SELECT COUNT(*) FROM contribution_obligations WHERE plan_id=?", [$plan['id']]) - $before;
    }

    // ---------------------------------------------------------------- balances

    /**
     * Everything the dashboard needs, computed from obligation rows.
     * "Outstanding" = open obligations with due_date <= today (upcoming ones are listed separately).
     */
    public static function balance(int $membershipId, string $today): array
    {
        $db = Db::i();
        $r = $db->one(
            "SELECT
               COALESCE(SUM(CASE WHEN o.kind='contribution' AND o.due_date<=? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS outstanding_contrib,
               COALESCE(SUM(CASE WHEN o.kind='penalty' AND o.due_date<=? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS outstanding_penalty,
               COALESCE(SUM(CASE WHEN o.kind='contribution' AND DATE_ADD(o.due_date, INTERVAL o.grace_days DAY)<? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS overdue_minor,
               COALESCE(SUM(CASE WHEN o.kind='contribution' AND DATE_ADD(o.due_date, INTERVAL o.grace_days DAY)<? THEN 1 END),0) AS overdue_count,
               COALESCE(SUM(CASE WHEN o.kind='contribution' AND o.due_date<=? THEN 1 END),0) AS unpaid_count,
               COALESCE(SUM(CASE WHEN o.kind='contribution' AND o.due_date=? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS due_today,
               COALESCE(SUM(CASE WHEN o.kind='contribution' AND o.due_date>? THEN o.original_minor-o.waived_minor-o.paid_minor END),0) AS upcoming_minor,
               MIN(CASE WHEN o.kind='contribution' AND o.due_date<=? THEN o.due_date END) AS oldest_unpaid,
               MIN(CASE WHEN o.kind='contribution' AND o.due_date>=? THEN o.due_date END) AS next_due
             FROM contribution_obligations o WHERE o.membership_id=? AND o.status='open'",
            [$today, $today, $today, $today, $today, $today, $today, $today, $today, $membershipId]);
        $tot = $db->one(
            "SELECT COALESCE(SUM(CASE WHEN kind='contribution' THEN paid_minor END),0) AS paid,
                    COALESCE(SUM(CASE WHEN kind='contribution' AND due_date<=? THEN original_minor-waived_minor END),0) AS expected_to_date,
                    COALESCE(SUM(CASE WHEN kind='contribution' AND due_date<=? THEN paid_minor END),0) AS paid_to_date
             FROM contribution_obligations WHERE membership_id=? AND status<>'cancelled'", [$today, $today, $membershipId]);
        $r['total_paid'] = (int)$tot['paid'];
        $r['completion_rate'] = (int)$tot['expected_to_date'] > 0 ? (int)floor(min(100, 100 * $tot['paid_to_date'] / $tot['expected_to_date'])) : null;
        $r['credit'] = (int)$db->val('SELECT COALESCE(SUM(amount_minor),0) FROM member_credit_entries WHERE membership_id=?', [$membershipId]);
        foreach (['outstanding_contrib', 'outstanding_penalty', 'overdue_minor', 'overdue_count', 'unpaid_count', 'due_today', 'upcoming_minor'] as $k) $r[$k] = (int)$r[$k];
        $r['outstanding_total'] = $r['outstanding_contrib'] + $r['outstanding_penalty'];
        return $r;
    }

    public static function obligations(int $membershipId, string $today, array $f = [], int $limit = 50, int $offset = 0): array
    {
        $w = ['o.membership_id=?'];
        $p = [$today, $today, $membershipId];
        if (!empty($f['plan_id'])) { $w[] = 'o.plan_id=?'; $p[] = (int)$f['plan_id']; }
        if (!empty($f['from'])) { $w[] = 'o.due_date>=?'; $p[] = $f['from']; }
        if (!empty($f['to'])) { $w[] = 'o.due_date<=?'; $p[] = $f['to']; }
        $having = '';
        if (!empty($f['status'])) { $having = ' HAVING display_status=?'; $p[] = $f['status']; }
        $sql = "SELECT o.*, p.name AS plan_name, (o.original_minor-o.waived_minor-o.paid_minor) AS outstanding_minor, " . self::statusSql('o') . " AS display_status,
                  (SELECT MAX(t.paid_at) FROM payment_allocations a JOIN payment_transactions t ON t.id=a.txn_id WHERE a.obligation_id=o.id AND a.reversed_at IS NULL) AS last_paid_at,
                  (SELECT GROUP_CONCAT(DISTINCT t.receipt_no) FROM payment_allocations a JOIN payment_transactions t ON t.id=a.txn_id WHERE a.obligation_id=o.id AND a.reversed_at IS NULL) AS receipts
                FROM contribution_obligations o JOIN contribution_plans p ON p.id=o.plan_id
                WHERE " . implode(' AND ', $w) . $having . ' ORDER BY o.due_date DESC, o.id DESC LIMIT ' . (int)$limit . ' OFFSET ' . (int)$offset;
        return Db::i()->all($sql, $p);
    }

    /** Next contribution date strictly after $today: an existing open obligation, else the next date the schedule produces. */
    public static function nextContributionDate(int $membershipId, string $today): ?string
    {
        $db = Db::i();
        $d = $db->val("SELECT MIN(due_date) FROM contribution_obligations WHERE membership_id=? AND status='open' AND kind='contribution' AND due_date>?", [$membershipId, $today]);
        $best = $d ?: null;
        $plans = $db->all("SELECT p.id, p.end_date FROM contribution_plans p JOIN contribution_plan_members pm ON pm.plan_id=p.id
                           WHERE pm.membership_id=? AND p.status='active' AND (pm.to_date IS NULL OR pm.to_date>?)", [$membershipId, $today]);
        foreach ($plans as $p) {
            $v = $db->one('SELECT * FROM contribution_plan_versions WHERE plan_id=? ORDER BY effective_from DESC, version_no DESC LIMIT 1', [$p['id']]);
            $n = ScheduleEngine::nextDue($v, max($today, ScheduleEngine::addDays($v['effective_from'], -1)), $p['end_date']);
            if ($n && ($best === null || $n < $best)) $best = $n;
        }
        return $best;
    }
}
