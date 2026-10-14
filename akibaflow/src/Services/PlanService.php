<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Audit, Clock, Db, Money};

final class PlanService
{
    /** @return array{ok:bool,errors:array,plan_id?:int} */
    public static function create(int $groupId, int $actor, array $in): array
    {
        $db = Db::i();
        $g = $db->one('SELECT * FROM `groups` WHERE id=?', [$groupId]);
        $err = [];
        $name = trim((string)($in['name'] ?? ''));
        if (mb_strlen($name) < 2) $err['name'] = 'Enter a plan name.';
        $amount = Money::parse((string)($in['amount'] ?? ''));
        if (!$amount || $amount <= 0) $err['amount'] = 'Enter a valid amount greater than zero (max 2 decimals).';
        $start = (string)($in['start_date'] ?? Clock::today($g['timezone']));
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $start) || !checkdate((int)substr($start, 5, 2), (int)substr($start, 8, 2), (int)substr($start, 0, 4))) $err['start_date'] = 'Enter a valid start date.';
        $end = ($in['end_date'] ?? '') !== '' ? (string)$in['end_date'] : null;
        if ($end !== null && $end < $start) $err['end_date'] = 'End date must be on or after the start date.';
        $kind = in_array($in['kind'] ?? 'recurring', ['recurring', 'one_time', 'special'], true) ? ($in['kind'] ?? 'recurring') : 'recurring';
        if ($kind !== 'recurring') $in['frequency'] = 'one_time';
        [$sched, $serr] = ScheduleEngine::validate($in, $start);
        $err += $serr;
        $grace = (int)($in['grace_days'] ?? 0);
        if ($grace < 0 || $grace > 90) $err['grace_days'] = 'Grace period must be 0–90 days.';
        if ($err) return ['ok' => false, 'errors' => $err];

        $look = isset($in['lookahead_days']) && $in['lookahead_days'] !== '' ? max(0, min(366, (int)$in['lookahead_days'])) : ScheduleEngine::defaultLookahead($sched['frequency']);
        $planId = $db->tx(function () use ($db, $groupId, $actor, $g, $in, $name, $kind, $start, $end, $amount, $sched, $grace, $look) {
            $planId = $db->insert(
                'INSERT INTO contribution_plans (group_id,name,description,kind,currency,status,mandatory,applies_to_all,start_date,end_date,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                [$groupId, $name, trim((string)($in['description'] ?? '')) ?: null, $kind, $g['currency'], 'active',
                 !empty($in['optional']) ? 0 : 1, !empty($in['select_members']) ? 0 : 1, $start, $end, $actor, Clock::nowSql()]
            );
            self::insertVersion($planId, 1, $start, $amount, $sched, $grace, $look, 'Initial terms', $actor);
            if (!empty($in['member_ids']) && is_array($in['member_ids'])) {
                foreach ($in['member_ids'] as $mid) {
                    $m = $db->one("SELECT id,joined_on FROM group_memberships WHERE id=? AND group_id=? AND status='active'", [(int)$mid, $groupId]);
                    if ($m) self::enroll($planId, (int)$m['id'], max($start, $m['joined_on'] ?? $start));
                }
            } else {
                foreach ($db->all("SELECT id,joined_on FROM group_memberships WHERE group_id=? AND status='active'", [$groupId]) as $m) {
                    self::enroll($planId, (int)$m['id'], max($start, $m['joined_on'] ?? $start));
                }
            }
            Audit::log('plan.created', $groupId, 'plan', $planId, ['name' => $name, 'amount_minor' => $amount, 'frequency' => $sched['frequency']], $actor);
            return $planId;
        });
        return ['ok' => true, 'errors' => [], 'plan_id' => $planId];
    }

    private static function insertVersion(int $planId, int $no, string $eff, int $amount, array $sched, int $grace, int $look, string $reason, int $actor): int
    {
        return Db::i()->insert(
            'INSERT INTO contribution_plan_versions (plan_id,version_no,effective_from,amount_minor,frequency,weekday,month_day,interval_days,anchor_date,grace_days,lookahead_days,change_reason,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [$planId, $no, $eff, $amount, $sched['frequency'], $sched['weekday'], $sched['month_day'], $sched['interval_days'], $sched['anchor_date'], $grace, $look, $reason, $actor, Clock::nowSql()]
        );
    }

    /**
     * Effective-dated change. Existing obligations keep the version they were created under;
     * the new terms only apply to due dates on/after $effectiveFrom, which must be later than anything already generated.
     * @return array{ok:bool,errors:array}
     */
    public static function newVersion(int $planId, int $actor, array $in): array
    {
        $db = Db::i();
        $plan = $db->one('SELECT p.*, g.timezone FROM contribution_plans p JOIN `groups` g ON g.id=p.group_id WHERE p.id=?', [$planId]);
        if (!$plan) return ['ok' => false, 'errors' => ['plan' => 'Plan not found']];
        $cur = $db->one('SELECT * FROM contribution_plan_versions WHERE plan_id=? ORDER BY version_no DESC LIMIT 1', [$planId]);
        $err = [];
        $amount = Money::parse((string)($in['amount'] ?? ''));
        if (!$amount) $err['amount'] = 'Enter a valid amount greater than zero.';
        $eff = (string)($in['effective_from'] ?? '');
        $today = Clock::today($plan['timezone']);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $eff)) $err['effective_from'] = 'Choose the date the change takes effect.';
        elseif ($eff <= $today) $err['effective_from'] = 'Changes can only take effect from tomorrow onwards; past obligations are never rewritten.';
        else {
            $maxGen = $db->val("SELECT MAX(due_date) FROM contribution_obligations WHERE plan_id=? AND kind='contribution'", [$planId]);
            if ($maxGen && $eff <= $maxGen) $err['effective_from'] = 'Obligations are already generated up to ' . $maxGen . '. Choose a later effective date.';
            if ($eff <= $cur['effective_from']) $err['effective_from'] = 'Must be later than the current terms (effective ' . $cur['effective_from'] . ').';
        }
        $in['frequency'] = $in['frequency'] ?? $cur['frequency'];
        [$sched, $serr] = ScheduleEngine::validate($in, $eff ?: $today);
        $err += $serr;
        $reason = trim((string)($in['reason'] ?? ''));
        if ($reason === '') $err['reason'] = 'Record a reason for the change.';
        if ($err) return ['ok' => false, 'errors' => $err];
        $grace = (int)($in['grace_days'] ?? $cur['grace_days']);
        $look = isset($in['lookahead_days']) && $in['lookahead_days'] !== '' ? (int)$in['lookahead_days'] : ScheduleEngine::defaultLookahead($sched['frequency']);

        $db->tx(function () use ($db, $planId, $cur, $eff, $amount, $sched, $grace, $look, $reason, $actor, $plan) {
            self::insertVersion($planId, (int)$cur['version_no'] + 1, $eff, $amount, $sched, $grace, $look, $reason, $actor);
            Audit::log('plan.terms_changed', (int)$plan['group_id'], 'plan', $planId, [
                'from' => ['amount_minor' => (int)$cur['amount_minor'], 'frequency' => $cur['frequency']],
                'to' => ['amount_minor' => $amount, 'frequency' => $sched['frequency']], 'effective_from' => $eff, 'reason' => $reason,
            ], $actor);
        });
        return ['ok' => true, 'errors' => []];
    }

    public static function setStatus(int $planId, string $status, int $actor): void
    {
        $db = Db::i();
        $p = $db->one('SELECT group_id FROM contribution_plans WHERE id=?', [$planId]);
        $db->exec('UPDATE contribution_plans SET status=? WHERE id=?', [$status, $planId]);
        Audit::log('plan.status_changed', (int)$p['group_id'], 'plan', $planId, ['status' => $status], $actor);
    }

    public static function enroll(int $planId, int $membershipId, string $from): void
    {
        $db = Db::i();
        $open = $db->val('SELECT id FROM contribution_plan_members WHERE plan_id=? AND membership_id=? AND to_date IS NULL', [$planId, $membershipId]);
        if ($open) return;
        $db->insert('INSERT INTO contribution_plan_members (plan_id,membership_id,from_date,created_at) VALUES (?,?,?,?)', [$planId, $membershipId, $from, Clock::nowSql()]);
    }

    public static function enrollInApplicablePlans(int $groupId, int $membershipId, string $joinedOn): void
    {
        foreach (Db::i()->all("SELECT id,start_date FROM contribution_plans WHERE group_id=? AND applies_to_all=1 AND status='active' AND (end_date IS NULL OR end_date>=?)", [$groupId, $joinedOn]) as $p) {
            self::enroll((int)$p['id'], $membershipId, max($joinedOn, $p['start_date']));
        }
    }

    /** Authorised pause: member owes nothing for due dates in [from, to]. Resume by passing the day after. */
    public static function pauseMember(int $planId, int $membershipId, string $fromDate, ?string $resumeOn, int $actor): void
    {
        $db = Db::i();
        $db->tx(function () use ($db, $planId, $membershipId, $fromDate, $resumeOn, $actor) {
            $row = $db->one('SELECT id FROM contribution_plan_members WHERE plan_id=? AND membership_id=? AND to_date IS NULL ORDER BY id DESC LIMIT 1 FOR UPDATE', [$planId, $membershipId]);
            if (!$row) throw new \RuntimeException('Member is not currently enrolled in this plan');
            $db->exec('UPDATE contribution_plan_members SET to_date=? WHERE id=?', [ScheduleEngine::addDays($fromDate, -1), $row['id']]);
            if ($resumeOn) $db->insert('INSERT INTO contribution_plan_members (plan_id,membership_id,from_date,created_at) VALUES (?,?,?,?)', [$planId, $membershipId, $resumeOn, Clock::nowSql()]);
            $p = $db->one('SELECT group_id FROM contribution_plans WHERE id=?', [$planId]);
            Audit::log('plan.member_paused', (int)$p['group_id'], 'membership', $membershipId, ['plan_id' => $planId, 'from' => $fromDate, 'resume' => $resumeOn], $actor);
        });
    }

    public static function versions(int $planId): array
    {
        return Db::i()->all('SELECT * FROM contribution_plan_versions WHERE plan_id=? ORDER BY version_no', [$planId]);
    }

    public static function describe(array $v, string $currency): string
    {
        $amt = Money::fmt((int)$v['amount_minor'], $currency);
        $days = [1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday', 4 => 'Thursday', 5 => 'Friday', 6 => 'Saturday', 7 => 'Sunday'];
        return match ($v['frequency']) {
            'daily' => "$amt every day",
            'weekly' => "$amt every " . ($days[(int)$v['weekday']] ?? 'week'),
            'biweekly' => "$amt every two weeks",
            'monthly' => "$amt monthly on " . ((int)$v['month_day'] === 0 ? 'the last day' : 'day ' . (int)$v['month_day']),
            'custom_days' => "$amt every " . (int)$v['interval_days'] . ' days',
            default => "$amt one-time on " . $v['anchor_date'],
        };
    }
}
