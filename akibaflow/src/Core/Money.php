<?php
declare(strict_types=1);
namespace Akiba\Core;

/** Money is always an int of minor units (100 per KES). No floats anywhere. */
final class Money
{
    /** Parse "1,250.50" → 125050. Returns null when invalid (more than 2 decimals, negative, junk). */
    public static function parse(string $s): ?int
    {
        $s = trim(str_replace([',', ' '], '', $s));
        if (!preg_match('/^(\d{1,12})(?:\.(\d{1,2}))?$/', $s, $m)) return null;
        $minor = (int)$m[1] * 100 + (int)str_pad($m[2] ?? '0', 2, '0');
        return $minor;
    }

    public static function fmt(int $minor, string $currency = 'KES'): string
    {
        $neg = $minor < 0;
        $minor = abs($minor);
        $whole = intdiv($minor, 100);
        $cents = $minor % 100;
        $label = $currency === 'KES' ? 'KSh' : $currency;
        $out = $label . ' ' . number_format($whole) . ($cents ? sprintf('.%02d', $cents) : '');
        return ($neg ? '-' : '') . $out;
    }

    /** Plain decimal string for forms / CSV, e.g. "100.00". */
    public static function dec(int $minor): string
    {
        $sign = $minor < 0 ? '-' : '';
        $minor = abs($minor);
        return sprintf('%s%d.%02d', $sign, intdiv($minor, 100), $minor % 100);
    }
}
