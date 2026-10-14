<?php
declare(strict_types=1);
namespace Akiba\Services;

use DateTimeImmutable;
use DateTimeZone;

/**
 * Pure date maths: which calendar dates does a plan version fall due on, within [from, to]?
 * No DB access, so every rule is unit-testable. Dates are timezone-less Y-m-d strings (group-local).
 *
 * Monthly rule: a configured day that doesn't exist in a month (e.g. 31 in April, 30 in February)
 * falls on the LAST valid day of that month. month_day = 0 means "last day of every month".
 */
final class ScheduleEngine
{
    public const FREQUENCIES = ['daily', 'weekly', 'biweekly', 'monthly', 'custom_days', 'one_time'];

    private static function d(string $s): DateTimeImmutable
    {
        return new DateTimeImmutable($s . ' 00:00:00', new DateTimeZone('UTC'));
    }

    private static function diffDays(string $a, string $b): int
    {
        return (int)self::d($a)->diff(self::d($b))->format('%r%a');
    }

    /** @return string[] ascending Y-m-d due dates within [$from,$to] inclusive */
    public static function dueDates(array $v, string $from, string $to): array
    {
        if ($from > $to) return [];
        $out = [];
        switch ($v['frequency']) {
            case 'daily':
                for ($d = self::d($from); $d->format('Y-m-d') <= $to; $d = $d->modify('+1 day')) $out[] = $d->format('Y-m-d');
                break;

            case 'weekly':
                $wd = (int)($v['weekday'] ?: 1);
                $d = self::d($from);
                $d = $d->modify('+' . (($wd - (int)$d->format('N') + 7) % 7) . ' days');
                for (; $d->format('Y-m-d') <= $to; $d = $d->modify('+7 days')) $out[] = $d->format('Y-m-d');
                break;

            case 'biweekly':
            case 'custom_days':
                $step = $v['frequency'] === 'biweekly' ? 14 : max(1, (int)$v['interval_days']);
                $anchor = $v['anchor_date'] ?: $v['effective_from'];
                $gap = self::diffDays($anchor, $from);
                $k = $gap <= 0 ? 0 : (int)ceil($gap / $step);
                for ($d = self::d($anchor)->modify('+' . ($k * $step) . ' days'); $d->format('Y-m-d') <= $to; $d = $d->modify("+$step days")) {
                    if ($d->format('Y-m-d') >= $from) $out[] = $d->format('Y-m-d');
                }
                break;

            case 'monthly':
                $md = (int)$v['month_day'];
                $cur = self::d(substr($from, 0, 7) . '-01');
                $end = self::d(substr($to, 0, 7) . '-01');
                for (; $cur <= $end; $cur = $cur->modify('+1 month')) {
                    $dim = (int)$cur->format('t');
                    $day = $md === 0 ? $dim : min($md, $dim);
                    $date = $cur->format('Y-m-') . sprintf('%02d', $day);
                    if ($date >= $from && $date <= $to) $out[] = $date;
                }
                break;

            case 'one_time':
                $a = $v['anchor_date'] ?: $v['effective_from'];
                if ($a >= $from && $a <= $to) $out[] = $a;
                break;
        }
        return $out;
    }

    /** First due date strictly after $after, searching up to ~2 years ahead. */
    public static function nextDue(array $v, string $after, ?string $planEnd = null): ?string
    {
        $from = self::d($after)->modify('+1 day')->format('Y-m-d');
        $to = self::d($after)->modify('+800 days')->format('Y-m-d');
        if ($planEnd && $planEnd < $to) $to = $planEnd;
        return self::dueDates($v, $from, $to)[0] ?? null;
    }

    public static function addDays(string $date, int $n): string
    {
        return self::d($date)->modify(($n >= 0 ? '+' : '') . $n . ' days')->format('Y-m-d');
    }

    public static function dayDiff(string $a, string $b): int { return self::diffDays($a, $b); }

    public static function defaultLookahead(string $frequency): int
    {
        return match ($frequency) { 'daily' => 1, 'weekly' => 7, 'biweekly' => 14, 'monthly' => 31, default => 7 };
    }

    /** Validate and normalise the schedule portion of a plan form. Returns [fields, errors]. */
    public static function validate(array $in, string $startDate): array
    {
        $err = [];
        $f = $in['frequency'] ?? '';
        if (!in_array($f, self::FREQUENCIES, true)) $err['frequency'] = 'Choose a valid frequency.';
        $out = ['frequency' => $f, 'weekday' => null, 'month_day' => null, 'interval_days' => null, 'anchor_date' => null];
        if ($f === 'weekly') {
            $wd = (int)($in['weekday'] ?? 0);
            if ($wd < 1 || $wd > 7) $err['weekday'] = 'Choose the contribution day of the week.';
            $out['weekday'] = $wd;
        } elseif ($f === 'monthly') {
            $md = (string)($in['month_day'] ?? '');
            if ($md === 'last') $md = '0';
            if (!ctype_digit($md) || (int)$md > 31) $err['month_day'] = 'Choose a day of the month (1–31) or "last day".';
            $out['month_day'] = (int)$md;
        } elseif ($f === 'biweekly' || $f === 'custom_days' || $f === 'one_time') {
            $a = (string)($in['anchor_date'] ?? '');
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $a)) $err['anchor_date'] = $f === 'one_time' ? 'Choose the due date.' : 'Choose the first due date.';
            $out['anchor_date'] = $a ?: null;
            if ($f === 'custom_days') {
                $n = (int)($in['interval_days'] ?? 0);
                if ($n < 1 || $n > 366) $err['interval_days'] = 'Interval must be between 1 and 366 days.';
                $out['interval_days'] = $n;
            }
        }
        return [$out, $err];
    }
}
