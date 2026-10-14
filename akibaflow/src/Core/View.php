<?php
declare(strict_types=1);
namespace Akiba\Core;

final class View
{
    public static array $shared = [];

    public static function render(string $view, array $data = [], string $layout = 'app'): void
    {
        $data += self::$shared;
        $content = self::partial($view, $data);
        if ($layout === '') { echo $content; return; }
        echo self::partial('layouts/' . $layout, $data + ['content' => $content]);
    }

    public static function partial(string $view, array $data = []): string
    {
        extract($data, EXTR_SKIP);
        ob_start();
        require AF_ROOT . '/views/' . $view . '.php';
        return (string)ob_get_clean();
    }
}

