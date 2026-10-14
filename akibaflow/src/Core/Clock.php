<?php
declare(strict_types=1);
namespace Akiba\Core;

use DateTimeImmutable;
use DateTimeZone;

/** Injectable clock so scheduling logic can be tested at exact local-time boundaries. */
final class Clock
{
    private static ?DateTimeImmutable $fixed = null;

    public static function freeze(?string $utc): void
    {
        self::$fixed = $utc === null ? null : new DateTimeImmutable($utc, new DateTimeZone('UTC'));
    }

    public static function now(): DateTimeImmutable
    {
        return self::$fixed ?? new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public static function nowSql(): string { return self::now()->format('Y-m-d H:i:s'); }

    /** Group-local calendar date (Y-m-d). */
    public static function today(string $tz): string
    {
        return self::now()->setTimezone(new DateTimeZone($tz))->format('Y-m-d');
    }

    public static function localDate(string $utcSql, string $tz): string
    {
        return (new DateTimeImmutable($utcSql, new DateTimeZone('UTC')))->setTimezone(new DateTimeZone($tz))->format('Y-m-d');
    }

    public static function localDateTime(?string $utcSql, string $tz, string $fmt = 'd M Y, H:i'): string
    {
        if (!$utcSql) return '—';
        return (new DateTimeImmutable($utcSql, new DateTimeZone('UTC')))->setTimezone(new DateTimeZone($tz))->format($fmt);
    }

    /** Group-local [from,to] dates (inclusive) → UTC datetime bounds [start, endExclusive]. */
    public static function localRangeToUtc(string $from, string $to, string $tz): array
    {
        $z = new DateTimeZone($tz);
        $u = new DateTimeZone('UTC');
        $a = (new DateTimeImmutable($from . ' 00:00:00', $z))->setTimezone($u)->format('Y-m-d H:i:s');
        $b = (new DateTimeImmutable($to . ' 00:00:00', $z))->modify('+1 day')->setTimezone($u)->format('Y-m-d H:i:s');
        return [$a, $b];
    }
}
