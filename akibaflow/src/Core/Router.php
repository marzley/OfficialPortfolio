<?php
declare(strict_types=1);
namespace Akiba\Core;

final class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, array $handler): void
    {
        $re = preg_replace_callback('/\{(\w+)\}/', fn($m) => in_array($m[1], ['token', 'secret', 'ref', 'type'], true) ? '([A-Za-z0-9_\-]+)' : '(\d+)', $pattern);
        $this->routes[] = [$method, '#^' . $re . '$#', $handler];
    }

    public function get(string $p, array $h): void { $this->add('GET', $p, $h); }
    public function post(string $p, array $h): void { $this->add('POST', $p, $h); }

    public function dispatch(string $method, string $path): void
    {
        $allowed = [];
        foreach ($this->routes as [$m, $re, $h]) {
            if (!preg_match($re, $path, $mm)) continue;
            if ($m !== $method) { $allowed[] = $m; continue; }
            array_shift($mm);
            $args = array_map(fn($x) => ctype_digit($x) ? (int)$x : $x, $mm);
            if ($method === 'POST' && !str_starts_with($path, '/callbacks/')) Session::checkCsrf();
            $h[0]::{$h[1]}(...$args);
            return;
        }
        if ($allowed) { header('Allow: ' . implode(', ', array_unique($allowed))); Http::abort(405, 'Method not allowed'); }
        Http::abort(404);
    }
}
