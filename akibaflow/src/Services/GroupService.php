<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Audit, Clock, Db, Permissions};

final class GroupService
{
    public static function memberCode(): string
    {
        $alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        $db = Db::i();
        for ($i = 0; $i < 20; $i++) {
            $c = 'AF';
            for ($j = 0; $j < 6; $j++) $c .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            if (!$db->val('SELECT 1 FROM group_memberships WHERE member_code=?', [$c])) return $c;
        }
        throw new \RuntimeException('Could not allocate member code');
    }

    public static function slug(string $name): string
    {
        $s = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $name), '-'));
        $s = $s !== '' ? substr($s, 0, 30) : 'group';
        $db = Db::i();
        $try = $s;
        for ($i = 2; $db->val('SELECT 1 FROM `groups` WHERE code=?', [$try]); $i++) $try = $s . '-' . $i;
        return $try;
    }

    /** @return array{ok:bool,errors:array,group_id?:int} */
    public static function create(int $userId, array $in): array
    {
        $err = [];
        $name = trim((string)($in['name'] ?? ''));
        if (mb_strlen($name) < 3) $err['name'] = 'Group name must be at least 3 characters.';
        $currency = strtoupper((string)($in['currency'] ?? 'KES'));
        if (!preg_match('/^[A-Z]{3}$/', $currency)) $err['currency'] = 'Invalid currency.';
        $tz = (string)($in['timezone'] ?? 'Africa/Nairobi');
        if (!in_array($tz, \DateTimeZone::listIdentifiers(), true)) $err['timezone'] = 'Unknown time zone.';
        $email = trim((string)($in['contact_email'] ?? ''));
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $err['contact_email'] = 'Invalid email.';
        if ($err) return ['ok' => false, 'errors' => $err];

        $db = Db::i();
        $gid = $db->tx(function () use ($db, $userId, $in, $name, $currency, $tz, $email) {
            $gid = $db->insert(
                'INSERT INTO `groups` (code,name,description,purpose,country,currency,timezone,contact_email,contact_phone,membership_mode,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                [self::slug($name), $name, trim((string)($in['description'] ?? '')) ?: null, trim((string)($in['purpose'] ?? '')) ?: null,
                 'KE', $currency, $tz, $email ?: null, trim((string)($in['contact_phone'] ?? '')) ?: null,
                 ($in['membership_mode'] ?? '') === 'request_to_join' ? 'request_to_join' : 'invite_only', $userId, Clock::nowSql()]
            );
            $db->exec('INSERT INTO group_settings (group_id) VALUES (?)', [$gid]);
            foreach ([['1000', 'Group Funds', 'asset'], ['2000', 'Member Credits', 'liability'], ['3000', 'Member Contributions', 'equity'],
                      ['4000', 'Penalty Income', 'income'], ['5000', 'Group Expenses', 'expense']] as [$c, $n, $t]) {
                $db->exec('INSERT INTO financial_accounts (group_id,code,name,type) VALUES (?,?,?,?)', [$gid, $c, $n, $t]);
            }
            $db->insert(
                "INSERT INTO group_memberships (group_id,user_id,member_code,role,status,joined_on,created_at) VALUES (?,?,?,?,'active',?,?)",
                [$gid, $userId, self::memberCode(), 'chairperson', Clock::today($tz), Clock::nowSql()]
            );
            Audit::log('group.created', $gid, 'group', $gid, ['name' => $name], $userId);
            return $gid;
        });
        return ['ok' => true, 'errors' => [], 'group_id' => $gid];
    }

    /** Add (or reactivate) a member. Active members are enrolled into applicable plans immediately. */
    public static function addMember(int $groupId, int $userId, string $role = 'member', string $status = 'active', ?string $joinedOn = null): int
    {
        if (!in_array($role, Permissions::ROLES, true)) throw new \InvalidArgumentException('bad role');
        $db = Db::i();
        $g = $db->one('SELECT timezone FROM `groups` WHERE id=?', [$groupId]);
        $joinedOn ??= Clock::today($g['timezone']);
        return $db->tx(function () use ($db, $groupId, $userId, $role, $status, $joinedOn) {
            $ex = $db->one('SELECT id,status FROM group_memberships WHERE group_id=? AND user_id=? FOR UPDATE', [$groupId, $userId]);
            if ($ex) {
                $db->exec('UPDATE group_memberships SET status=?, role=?, joined_on=?, exited_on=NULL WHERE id=?', [$status, $role, $joinedOn, $ex['id']]);
                $mid = (int)$ex['id'];
            } else {
                $mid = $db->insert('INSERT INTO group_memberships (group_id,user_id,member_code,role,status,joined_on,created_at) VALUES (?,?,?,?,?,?,?)',
                    [$groupId, $userId, self::memberCode(), $role, $status, $status === 'active' ? $joinedOn : null, Clock::nowSql()]);
            }
            if ($status === 'active') PlanService::enrollInApplicablePlans($groupId, $mid, $joinedOn);
            return $mid;
        });
    }

    public static function setStatus(int $groupId, int $membershipId, string $status, string $actorNote = ''): void
    {
        $db = Db::i();
        $g = $db->one('SELECT timezone FROM `groups` WHERE id=?', [$groupId]);
        $today = Clock::today($g['timezone']);
        $db->tx(function () use ($db, $groupId, $membershipId, $status, $today) {
            $m = $db->one('SELECT * FROM group_memberships WHERE id=? AND group_id=? FOR UPDATE', [$membershipId, $groupId]);
            if (!$m) throw new \RuntimeException('Member not found');
            if ($status === 'exited') {
                $db->exec('UPDATE group_memberships SET status=?, exited_on=? WHERE id=?', ['exited', $today, $membershipId]);
                $db->exec('UPDATE contribution_plan_members SET to_date=? WHERE membership_id=? AND to_date IS NULL', [$today, $membershipId]);
            } elseif ($status === 'active' && $m['status'] === 'pending') {
                $db->exec('UPDATE group_memberships SET status=?, joined_on=? WHERE id=?', ['active', $today, $membershipId]);
                PlanService::enrollInApplicablePlans($groupId, $membershipId, $today);
            } else {
                // suspend / reactivate: obligations already generated remain; no new ones while not active
                $db->exec('UPDATE group_memberships SET status=? WHERE id=?', [$status, $membershipId]);
            }
        });
        Audit::log('member.status_changed', $groupId, 'membership', $membershipId, ['status' => $status, 'note' => $actorNote]);
    }

    public static function settings(int $groupId): array
    {
        return Db::i()->one('SELECT * FROM group_settings WHERE group_id=?', [$groupId]) ?? [];
    }
}
