<?php
declare(strict_types=1);
namespace Akiba\Core;

/** Group-scoped authorisation. Every group route goes through here; ids from the client are never trusted. */
final class Access
{
    /** Active membership of the current user in $groupId, or null. Group 404 (not 403) hides existence. */
    public static function membership(int $groupId, ?int $userId = null): ?array
    {
        $userId ??= Auth::id();
        if (!$userId) return null;
        return Db::i()->one(
            "SELECT m.*, g.name AS group_name, g.currency, g.timezone, g.status AS group_status, g.code AS group_code
             FROM group_memberships m JOIN `groups` g ON g.id=m.group_id
             WHERE m.group_id=? AND m.user_id=? AND m.status='active'", [$groupId, $userId]);
    }

    /** Require membership (+ optional permission). Returns the membership row. */
    public static function require(int $groupId, ?string $perm = null): array
    {
        Auth::require();
        $m = self::membership($groupId);
        if (!$m) Http::abort(404);
        if ($perm !== null && !Permissions::can($m['role'], $perm)) Http::abort(403, 'You do not have permission to do that in this group.');
        return $m;
    }

    public static function can(array $membership, string $perm): bool
    {
        return Permissions::can($membership['role'], $perm);
    }

    /** Membership row by id, but only if it belongs to $groupId (prevents IDOR across groups). */
    public static function memberInGroup(int $groupId, int $membershipId): array
    {
        $m = Db::i()->one('SELECT * FROM group_memberships WHERE id=? AND group_id=?', [$membershipId, $groupId]);
        if (!$m) Http::abort(404);
        return $m;
    }

    /** Can $actor view membership $target's private financial data? Own data, or group officers with obligations.view_all. */
    public static function canViewMemberFinance(array $actor, array $target): bool
    {
        if ((int)$actor['group_id'] !== (int)$target['group_id']) return false;
        return (int)$actor['id'] === (int)$target['id'] || Permissions::can($actor['role'], 'obligations.view_all');
    }
}
