<?php
declare(strict_types=1);
// Usage: php bin/migrate.php [--fresh]   (--fresh drops every table first; refuses in production)
require __DIR__ . '/../src/bootstrap.php';

use Akiba\Core\{Db, Env};

$db = Db::i();
$m = $db->raw();
if (in_array('--fresh', $argv, true)) {
    if (Env::isProduction()) { fwrite(STDERR, "Refusing --fresh in production.\n"); exit(1); }
    $m->query('SET FOREIGN_KEY_CHECKS=0');
    foreach ($db->all("SELECT table_name AS t FROM information_schema.tables WHERE table_schema=DATABASE()") as $r) $m->query('DROP TABLE IF EXISTS `' . $r['t'] . '`');
    $m->query('SET FOREIGN_KEY_CHECKS=1');
}
$m->query('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(100) PRIMARY KEY, applied_at DATETIME NOT NULL) ENGINE=InnoDB');
$done = array_column($db->all('SELECT version FROM schema_migrations'), 'version');
$files = glob(__DIR__ . '/../migrations/*.sql');
sort($files);
foreach ($files as $f) {
    $v = basename($f);
    if (in_array($v, $done, true)) continue;
    echo "Applying $v ... ";
    foreach (preg_split('/^;;\s*$/m', file_get_contents($f)) as $stmt) {
        $stmt = trim($stmt);
        if ($stmt !== '') $m->query($stmt);
    }
    $db->exec('INSERT INTO schema_migrations (version, applied_at) VALUES (?, UTC_TIMESTAMP())', [$v]);
    echo "ok\n";
}
echo "Database is up to date.\n";
