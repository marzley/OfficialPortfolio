<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Audit, Clock, Db, Money};

/** Optional, group-approved fixed late fee. Never compounds: at most one penalty per overdue obligation, capped per member. */
final class PenaltyService
{
    public static function run(?int $groupId = null, ?string $asOfOverride = null): int
    {
        $db = Db::i();
        $made = 0;
        $groups = $db->all("SELECT g.id,g.timezone,g.currency,s.penalty_fixed_minor,s.penalty_after_days,s.penalty_max_per_member_minor FROM `groups` g JOIN group_settings s ON s.group_id=g.id
                            WHERE g.status='active' AND s.penalty_enabled=1 AND s.penalty_fixed_minor>0" . ($groupId ? ' AND g.id=' . (int)$groupId : ''));
        foreach ($groups as $g) {
            $today = $asOfOverride ?? Clock::today($g['timezone']);
            $due = $db->all(
                "SELECT o.* FROM contribution_obligations o
                 WHERE o.group_id=? AND o.kind='contribution' AND o.status='open' AND o.original_minor-o.waived_minor-o.paid_minor>0
                   AND DATE_ADD(o.due_date, INTERVAL (o.grace_days + ?) DAY) < ?
                   AND NOT EXISTS (SELECT 1 FROM contribution_obligations p WHERE p.parent_obligation_id=o.id AND p.kind='penalty')
                 ORDER BY o.due_date, o.id", [$g['id'], (int)$g['penalty_after_days'], $today]);
            foreach ($due as $o) {
                $amt = (int)$g['penalty_fixed_minor'];
                if ((int)$g['penalty_max_per_member_minor'] > 0) {
                    $so = (int)$db->val("SELECT COALESCE(SUM(original_minor),0) FROM contribution_obligations WHERE membership_id=? AND kind='penalty'", [$o['membership_id']]);
                    $amt = min($amt, (int)$g['penalty_max_per_member_minor'] - $so);
                }
                if ($amt <= 0) continue;
                try {
                    $id = $db->insert("INSERT INTO contribution_obligations (group_id,membership_id,plan_id,plan_version_id,kind,parent_obligation_id,period_key,due_date,grace_days,original_minor,created_at) VALUES (?,?,?,?,'penalty',?,?,?,0,?,?)",
                        [$o['group_id'], $o['membership_id'], $o['plan_id'], $o['plan_version_id'], $o['id'], 'PEN:' . $o['id'], $today, $amt, Clock::nowSql()]);
                } catch (\Throwable $e) {
                    if (Db::isDuplicate($e)) continue;
                    throw $e;
                }
                $made++;
                Audit::log('penalty.applied', (int)$g['id'], 'obligation', $id, ['parent' => (int)$o['id'], 'amount_minor' => $amt], 0);
                $u = $db->val('SELECT user_id FROM group_memberships WHERE id=?', [$o['membership_id']]);
                Notifications::send((int)$u, (int)$g['id'], 'payment', 'Late fee applied', 'A group-approved late fee of ' . Money::fmt($amt, $g['currency']) . ' was added for the contribution due ' . $o['due_date'] . '. It is shown separately from your contributions.', '/g/' . $g['id'] . '/me', 'pen:' . $id);
            }
        }
        return $made;
    }
}
