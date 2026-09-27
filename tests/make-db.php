<?php
// Creates a SQLite copy of portal/schema.sql for the tests: php tests/make-db.php path/to/test.db
$sql = file_get_contents(__DIR__ . '/../portal/schema.sql');
$sql = preg_replace('/^\s*--.*$/m', '', $sql);
$sql = preg_replace('/\)\s*ENGINE=[^;]*;/', ');', $sql);
$sql = str_replace('INT UNSIGNED AUTO_INCREMENT PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT', $sql);
$sql = preg_replace('/\b(TINYINT|INT) UNSIGNED\b/', 'INTEGER', $sql);
$sql = preg_replace('/,\s*INDEX\s+\w*\s*\([^)]*\)/', '', $sql);          // SQLite has no inline INDEX
$sql = preg_replace('/^INSERT INTO settings.*ON DUPLICATE KEY.*$/m', "INSERT OR REPLACE INTO settings (k, v) VALUES ('schema_version', '2');", $sql);
@unlink($argv[1]);
$pdo = new PDO('sqlite:' . $argv[1]);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec($sql);
echo "created {$argv[1]}\n";
