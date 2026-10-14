<?php
declare(strict_types=1);
// Usage: php bin/backup.php            create a compressed, checksummed dump in storage/backups and record it
//        php bin/backup.php --verify   verify the newest backup (checksum + gzip integrity + schema present) and record the result
// Copy the files in storage/backups to separate, access-controlled, off-server storage (see docs/BACKUP_AND_RECOVERY.md).
require __DIR__ . '/../src/bootstrap.php';

use Akiba\Core\{Clock, Db, Env};

$db = Db::i();
$dir = AF_ROOT . '/storage/backups';
if (!is_dir($dir)) mkdir($dir, 0700, true);

if (in_array('--verify', $argv, true)) {
    $b = $db->one("SELECT * FROM backup_runs WHERE status='ok' ORDER BY id DESC LIMIT 1");
    if (!$b) { fwrite(STDERR, "No backup to verify.\n"); exit(1); }
    $path = $dir . '/' . $b['file'];
    $problem = null;
    if (!is_file($path)) $problem = 'file missing';
    elseif (hash_file('sha256', $path) !== $b['sha256']) $problem = 'checksum mismatch';
    else {
        $gz = gzopen($path, 'rb');
        $head = '';
        while ($gz && !gzeof($gz) && strlen($head) < 4_000_000) $head .= gzread($gz, 65536);
        $ok = $gz && gzeof($gz);
        if ($gz) gzclose($gz);
        if (!$ok) $problem = 'gzip stream truncated or corrupt';
        elseif (!str_contains($head, 'CREATE TABLE `users`')) $problem = 'dump does not contain the users table';
    }
    if ($problem) {
        $db->exec("UPDATE backup_runs SET status='failed', message=? WHERE id=?", ['verify failed: ' . $problem, $b['id']]);
        fwrite(STDERR, "VERIFY FAILED: $problem\n"); exit(2);
    }
    $db->exec('UPDATE backup_runs SET verified_at=?, message=? WHERE id=?', [Clock::nowSql(), 'checksum + gzip + schema check passed', $b['id']]);
    echo "Backup {$b['file']} verified.\n"; exit(0);
}

$name = 'akibaflow-' . gmdate('Ymd-His') . '.sql.gz';
$path = $dir . '/' . $name;
$cnf = tempnam(sys_get_temp_dir(), 'afcnf');
chmod($cnf, 0600);
file_put_contents($cnf, "[client]\nuser=" . Env::get('DB_USER') . "\npassword=" . Env::get('DB_PASS') . "\nhost=" . Env::get('DB_HOST', '127.0.0.1') . "\nport=" . Env::get('DB_PORT', '3306') . "\n");
$cmd = sprintf('mysqldump --defaults-extra-file=%s --single-transaction --routines --triggers --no-tablespaces %s 2>&1 | gzip -9 > %s; echo ${PIPESTATUS[0]}', escapeshellarg($cnf), escapeshellarg((string)Env::get('DB_NAME')), escapeshellarg($path));
$out = trim((string)shell_exec('bash -c ' . escapeshellarg($cmd)));
unlink($cnf);
$ok = $out === '0' && is_file($path) && filesize($path) > 500;
chmod($path, 0600);
$db->exec('INSERT INTO backup_runs (file,size_bytes,sha256,status,message,created_at) VALUES (?,?,?,?,?,?)',
    [$name, is_file($path) ? filesize($path) : 0, is_file($path) ? hash_file('sha256', $path) : null, $ok ? 'ok' : 'failed', $ok ? 'created, not yet verified' : 'mysqldump exit ' . $out, Clock::nowSql()]);
echo $ok ? "Backup created: $path\n" : "BACKUP FAILED (mysqldump exit $out)\n";
exit($ok ? 0 : 1);
