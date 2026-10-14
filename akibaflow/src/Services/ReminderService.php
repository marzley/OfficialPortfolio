<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Clock, Db, Money};

/**
 * Reminders are driven by obligation rows. contribution_reminders has UNIQUE(obligation_id,type) so a re-run
 * (or two workers) can never send the same reminder twice. One message per member per run, quoting the
 * member's live total — so three missed days yields "KSh 100", then "KSh 200", then "KSh 300" over time.
 */
final class ReminderService
{
    public static function run(?int $groupId = null, ?string $asOfOverride = null): array
    {
        $db = Db::i();
        $stats = ['members_notified' => 0, 'digests' => 0];
        $groups = $db->all("SELECT g.id,g.name,g.timezone,g.currency,s.* FROM `groups` g JOIN group_settings s ON s.group_id=g.id WHERE g.status='active' AND s.reminders_paused=0" . ($groupId ? ' AND g.id=' . (int)$groupId : ''));
        foreach ($groups as $g) {
            $today = $asOfOverride ?? Clock::today($g['timezone']);
            $channels = array_values(array_intersect(explode(',', $g['reminder_channels']), ['in_app', 'email', 'sms']));
            $rows = $db->all(
                "SELECT o.id, o.membership_id, o.due_date, o.grace_days, o.original_minor, m.user_id, u.full_name
                 FROM contribution_obligations o JOIN group_memberships m ON m.id=o.membership_id JOIN users u ON u.id=m.user_id
                 WHERE o.group_id=? AND o.status='open' AND o.kind='contribution' AND m.status='active'
                   AND (o.due_date<=? OR (?>0 AND o.due_date=DATE_ADD(?, INTERVAL ? DAY)))
                 ORDER BY o.membership_id, o.due_date", [$g['id'], $today, (int)$g['remind_before_days'], $today, (int)$g['remind_before_days']]);
            $byMember = [];
            foreach ($rows as $r) $byMember[(int)$r['membership_id']][] = $r;
            foreach ($byMember as $mid => $obs) {
                $newTypes = [];
                foreach ($obs as $o) {
                    $type = $o['due_date'] > $today ? 'upcoming' : (ScheduleEngine::addDays($o['due_date'], (int)$o['grace_days']) < $today ? 'overdue' : ($o['due_date'] === $today ? 'due_today' : null));
                    if ($type === null) continue; // inside grace window after the due day: nothing new to say
                    $bal = ContributionEngine::balance($mid, $today);
                    $n = $db->exec('INSERT IGNORE INTO contribution_reminders (obligation_id,membership_id,type,outstanding_minor,created_at) VALUES (?,?,?,?,?)', [$o['id'], $mid, $type, $bal['outstanding_contrib'], Clock::nowSql()]);
                    if ($n) $newTypes[$type] = $o;
                }
                if (!$newTypes) continue;
                $type = isset($newTypes['overdue']) ? 'overdue' : (isset($newTypes['due_today']) ? 'due_today' : 'upcoming');
                $o = $newTypes[$type];
                $bal = ContributionEngine::balance($mid, $today);
                [$subject, $body] = self::message($type, $o, $bal, $g);
                Notifications::send((int)$o['user_id'], (int)$g['id'], 'reminders', $subject, $body, '/g/' . $g['id'] . '/pay', "rem:$mid:$type:$today", $channels);
                $stats['members_notified']++;
            }
            if ((int)$g['overdue_digest']) {
                $d = $db->one("SELECT COUNT(DISTINCT membership_id) n, COALESCE(SUM(original_minor-waived_minor-paid_minor),0) amt FROM contribution_obligations
                               WHERE group_id=? AND status='open' AND kind='contribution' AND DATE_ADD(due_date, INTERVAL grace_days DAY)<?", [$g['id'], $today]);
                if ((int)$d['n'] > 0) {
                    Notifications::toRoles((int)$g['id'], ['chairperson', 'treasurer'], 'reminders', 'Overdue contributions summary',
                        sprintf('%d member(s) have overdue contributions totalling %s in %s.', (int)$d['n'], Money::fmt((int)$d['amt'], $g['currency']), $g['name']), '/g/' . $g['id'] . '/arrears', "digest:{$g['id']}:$today");
                    $stats['digests']++;
                }
            }
        }
        return $stats;
    }

    private static function message(string $type, array $o, array $bal, array $g): array
    {
        $cur = $g['currency'];
        $amt = Money::fmt((int)$o['original_minor'], $cur);
        $out = Money::fmt($bal['outstanding_contrib'], $cur);
        $first = explode(' ', $o['full_name'])[0];
        if ($type === 'upcoming') return ['Upcoming contribution', "Hello $first, your contribution of $amt for {$g['name']} is due on {$o['due_date']}."];
        if ($type === 'due_today') return ['Contribution due today', "Hello $first, your contribution of $amt for {$g['name']} is due today. Your outstanding contribution balance is $out. Pay securely through AkibaFlow."];
        $n = max(1, $bal['overdue_count']);
        if ($n === 1) return ['Contribution overdue', "Hello $first, your contribution of $amt for {$g['name']} was due on {$o['due_date']}. Outstanding balance: $out. Please pay through AkibaFlow."];
        if ($n === 2) return ['Two contributions overdue', "Hello $first, you have 2 overdue contributions for {$g['name']}. Outstanding balance: $out. Please settle soon through AkibaFlow."];
        return ['Overdue contributions', "Your outstanding contributions for {$g['name']} total $out across $n missed contributions. Please review your contribution history and settle your outstanding balance through AkibaFlow."];
    }
}
