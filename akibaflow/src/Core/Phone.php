<?php
declare(strict_types=1);
namespace Akiba\Core;

final class Phone
{
    /** Normalise Kenyan numbers to +2547XXXXXXXX / +2541XXXXXXXX. Returns null if invalid. */
    public static function normalize(string $raw): ?string
    {
        $d = preg_replace('/[\s\-().]/', '', $raw);
        if (str_starts_with($d, '+')) $d = substr($d, 1);
        if (!ctype_digit($d)) return null;
        if (preg_match('/^0([17]\d{8})$/', $d, $m)) $d = '254' . $m[1];
        elseif (preg_match('/^([17]\d{8})$/', $d, $m)) $d = '254' . $m[1];
        if (!preg_match('/^254[17]\d{8}$/', $d)) return null;
        return '+' . $d;
    }

    /** Daraja wants 2547XXXXXXXX without "+". */
    public static function msisdn(string $e164): string { return ltrim($e164, '+'); }
}
