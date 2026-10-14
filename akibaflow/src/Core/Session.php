<?php
declare(strict_types=1);
namespace Akiba\Core;

final class Session
{
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) return;
        $secure = Env::isProduction() || (($_SERVER['HTTPS'] ?? '') === 'on');
        session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'httponly' => true, 'secure' => $secure, 'samesite' => 'Lax']);
        session_name('akibaflow');
        session_start();
    }

    public static function flash(string $type, string $msg): void { $_SESSION['_flash'][] = [$type, $msg]; }

    public static function takeFlash(): array
    {
        $f = $_SESSION['_flash'] ?? [];
        unset($_SESSION['_flash']);
        return $f;
    }

    public static function csrf(): string
    {
        return $_SESSION['_csrf'] ??= bin2hex(random_bytes(32));
    }

    public static function checkCsrf(): void
    {
        $sent = $_POST['_csrf'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        $known = $_SESSION['_csrf'] ?? '';
        if (!is_string($sent) || $sent === '' || $known === '' || !hash_equals($known, $sent)) {
            Http::abort(403, 'Security token expired. Reload the page and try again.');
        }
    }
}
