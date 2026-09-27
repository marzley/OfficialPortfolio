<?php
// PHP built-in server router for tests: clean URLs (/about -> about.html) and the 404 page, like .htaccess.
$p = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = $_SERVER['DOCUMENT_ROOT'];
if ($p !== '/' && is_file($root . $p)) return false;
if (substr($p, -1) === '/' && is_file($root . $p . 'index.html')) { readfile($root . $p . 'index.html'); return true; }
$slug = trim($p, '/');
if ($slug === '') { readfile($root . '/index.html'); return true; }
if (preg_match('/^[a-z0-9-]+$/', $slug) && is_file("$root/$slug.html")) { header('Content-Type: text/html; charset=utf-8'); readfile("$root/$slug.html"); return true; }
http_response_code(404);
readfile("$root/404.html");
