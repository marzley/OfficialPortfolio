<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Access, Auth, Clock, Http, Session, View};

/** Shared controller helpers. */
abstract class Ctl
{
    /** Authenticated + active member of group (+permission). Also publishes $g to layouts. */
    protected static function group(int $gid, ?string $perm = null): array
    {
        $m = Access::require($gid, $perm);
        View::$shared['g'] = $m;
        View::$shared['user'] = Auth::user();
        return $m;
    }

    protected static function page(string $view, array $data = [], string $nav = '', string $title = ''): void
    {
        View::render($view, $data + ['nav' => $nav, 'title' => $title ?: ucfirst($nav)]);
    }

    protected static function back(string $to, ?string $type = null, ?string $msg = null): never
    {
        if ($type) Session::flash($type, (string)$msg);
        Http::redirect($to);
    }

    protected static function today(array $g): string { return Clock::today($g['timezone']); }

    protected static function str(string $k): string { return Http::str($k); }

    protected static function intval(string $k): int { return (int)Http::str($k); }

    protected static function dateOr(string $k, string $default): string
    {
        $v = Http::str($k);
        return preg_match('/^\d{4}-\d{2}-\d{2}$/', $v) ? $v : $default;
    }
}
