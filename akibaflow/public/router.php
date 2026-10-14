<?php
// Dev router for `php -S`: serve real files from /public, everything else through index.php.
$p = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($p !== '/' && is_file(__DIR__ . $p)) return false;
require __DIR__ . '/index.php';
