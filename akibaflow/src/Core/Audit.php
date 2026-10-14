<?php
declare(strict_types=1);
namespace Akiba\Core;

final class Audit
{
    public static function log(string $action, ?int $groupId = null, ?string $entityType = null, ?int $entityId = null, array $details = [], ?int $actor = null): void
    {
        $actor ??= Auth::id();
        $json = $details ? json_encode(self::scrub($details), JSON_UNESCAPED_UNICODE) : null;
        Db::i()->insert(
            'INSERT INTO audit_logs (group_id, actor_user_id, action, entity_type, entity_id, details, ip, created_at) VALUES (?,?,?,?,?,?,?,?)',
            [$groupId, $actor, $action, $entityType, $entityId, $json, PHP_SAPI === 'cli' ? 'cli' : Http::ip(), Clock::nowSql()]
        );
    }

    private static function scrub(array $d): array
    {
        foreach ($d as $k => $v) {
            if (preg_match('/pass|secret|token|key/i', (string)$k)) $d[$k] = '[redacted]';
            elseif (is_array($v)) $d[$k] = self::scrub($v);
        }
        return $d;
    }
}
