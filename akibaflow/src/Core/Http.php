<?php
declare(strict_types=1);
namespace Akiba\Core;

final class Http
{
    public static function ip(): string { return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'; }

    public static function json(mixed $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function redirect(string $to): never
    {
        header('Location: ' . $to);
        exit;
    }

    public static function abort(int $code, string $msg = ''): never
    {
        throw new HttpException($msg ?: match ($code) { 403 => 'Forbidden', 404 => 'Not found', 429 => 'Too many requests', default => 'Error' }, $code);
    }

    public static function wantsJson(): bool
    {
        return str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/api/') || str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
    }

    public static function input(string $key, mixed $default = null): mixed
    {
        static $json = null;
        if ($json === null) {
            $json = [];
            if (str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
                $json = json_decode((string)file_get_contents('php://input'), true) ?: [];
            }
        }
        return $_POST[$key] ?? $json[$key] ?? $_GET[$key] ?? $default;
    }

    public static function str(string $key, string $default = ''): string
    {
        $v = self::input($key, $default);
        return is_string($v) ? trim($v) : $default;
    }
}
