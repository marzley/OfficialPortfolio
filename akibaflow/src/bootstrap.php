<?php
declare(strict_types=1);

define('AF_ROOT', dirname(__DIR__));

spl_autoload_register(static function (string $class): void {
    if (strncmp($class, 'Akiba\\', 6) !== 0) return;
    $file = AF_ROOT . '/src/' . str_replace('\\', '/', substr($class, 6)) . '.php';
    if (is_file($file)) require $file;
});

use Akiba\Core\Env;
use Akiba\Core\Db;

Env::load(getenv('AKIBA_ENV_FILE') ?: AF_ROOT . '/.env');
date_default_timezone_set('UTC'); // all stored datetimes are UTC; group-local logic uses Clock

Db::init([
    'host' => Env::get('DB_HOST', '127.0.0.1'),
    'port' => (int)Env::get('DB_PORT', '3306'),
    'name' => Env::get('DB_NAME', 'akibaflow'),
    'user' => Env::get('DB_USER', 'akiba'),
    'pass' => Env::get('DB_PASS', ''),
]);

require_once AF_ROOT . '/src/Core/helpers.php';
