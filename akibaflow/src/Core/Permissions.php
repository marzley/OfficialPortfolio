<?php
declare(strict_types=1);
namespace Akiba\Core;

/** Role → permission matrix. Enforced server-side by Access::require(). Documented in docs/SECURITY.md. */
final class Permissions
{
    public const ROLES = ['chairperson', 'treasurer', 'secretary', 'member', 'auditor'];

    private const MATRIX = [
        'chairperson' => [
            'group.view', 'group.manage', 'members.view', 'members.manage', 'roles.assign',
            'plans.view', 'plans.manage', 'waivers.grant', 'reports.view', 'audit.view',
            'payments.view_all', 'payments.record_manual', 'payments.reverse', 'reconcile.view',
            'expenses.view', 'expenses.create', 'expenses.approve', 'announce.create', 'goals.manage', 'obligations.view_all',
        ],
        'treasurer' => [
            'group.view', 'members.view', 'plans.view', 'reports.view',
            'payments.view_all', 'payments.record_manual', 'payments.reverse', 'reconcile.view',
            'expenses.view', 'expenses.create', 'expenses.approve', 'expenses.pay', 'goals.manage', 'obligations.view_all',
        ],
        'secretary' => [
            'group.view', 'members.view', 'members.manage', 'plans.view', 'reports.view',
            'expenses.view', 'expenses.create', 'announce.create', 'obligations.view_all',
        ],
        'auditor' => [
            'group.view', 'members.view', 'plans.view', 'reports.view', 'audit.view',
            'payments.view_all', 'reconcile.view', 'expenses.view', 'obligations.view_all',
        ],
        'member' => ['group.view'],
    ];

    public static function can(string $role, string $perm): bool
    {
        return in_array($perm, self::MATRIX[$role] ?? [], true);
    }

    public static function matrix(): array { return self::MATRIX; }
}
