<?php
declare(strict_types=1);
// Minimal dependency-free test harness. Run: php tests/run.php [filter]
putenv('AKIBA_ENV_FILE=/dev/null');
putenv('DB_NAME=' . (getenv('TEST_DB_NAME') ?: 'akibaflow_test'));
putenv('DB_USER=' . (getenv('DB_USER') ?: 'akiba'));
putenv('DB_PASS=' . (getenv('DB_PASS') ?: 'akiba_dev_pw'));
putenv('APP_ENV=testing');
putenv('PAYMENT_DRIVER=sandbox');
putenv('MPESA_CALLBACK_SECRET=test-secret-long-enough');
putenv('MPESA_VERIFY_WITH_QUERY=true');
require __DIR__ . '/../src/bootstrap.php';

use Akiba\Core\{Clock, Db};

$GLOBALS['__tests'] = [];
$GLOBALS['__fail'] = 0;
$GLOBALS['__pass'] = 0;

function test(string $name, callable $fn): void { $GLOBALS['__tests'][] = [$name, $fn]; }

function eq(mixed $expected, mixed $actual, string $msg = ''): void
{
    if ($expected !== $actual) {
        throw new AssertionError(($msg ? "$msg: " : '') . 'expected ' . var_export($expected, true) . ' got ' . var_export($actual, true));
    }
}
function ok(bool $cond, string $msg = 'assertion failed'): void { if (!$cond) throw new AssertionError($msg); }
function throws(callable $fn, string $contains = ''): void
{
    try { $fn(); } catch (Throwable $e) {
        if ($contains !== '' && stripos($e->getMessage(), $contains) === false) throw new AssertionError("exception '{$e->getMessage()}' does not contain '$contains'");
        return;
    }
    throw new AssertionError('expected an exception');
}

function resetDb(): void
{
    $m = Db::i()->raw();
    $m->query('SET FOREIGN_KEY_CHECKS=0');
    foreach (Db::i()->all("SELECT table_name AS t FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name<>'schema_migrations'") as $r) $m->query('TRUNCATE TABLE `' . $r['t'] . '`');
    $m->query('SET FOREIGN_KEY_CHECKS=1');
    Clock::freeze(null);
}

function mkUser(string $name = 'Test User', ?string $email = null, bool $admin = false): int
{
    static $n = 0;
    $n++;
    $email ??= "user$n@test.local";
    return Db::i()->insert('INSERT INTO users (email,phone,full_name,password_hash,is_super_admin,email_verified_at,created_at) VALUES (?,?,?,?,?,?,?)',
        [$email, sprintf('+2547%08d', $n), $name, password_hash('Passw0rdTest', PASSWORD_DEFAULT), (int)$admin, Clock::nowSql(), Clock::nowSql()]);
}

/** @return array{gid:int,chair:int,chair_m:int} */
function mkGroup(array $over = []): array
{
    $chair = mkUser('Chair Person');
    $r = Akiba\Services\GroupService::create($chair, $over + ['name' => 'Test Group ' . random_int(1, 99999)]);
    if (!$r['ok']) throw new RuntimeException(json_encode($r['errors']));
    $mid = (int)Db::i()->val('SELECT id FROM group_memberships WHERE group_id=? AND user_id=?', [$r['group_id'], $chair]);
    return ['gid' => $r['group_id'], 'chair' => $chair, 'chair_m' => $mid];
}

/** Adds an active member and returns [userId, membershipId]. */
function mkMember(int $gid, string $role = 'member', ?string $joined = null): array
{
    $u = mkUser('Member ' . random_int(1, 9999));
    $m = Akiba\Services\GroupService::addMember($gid, $u, $role, 'active', $joined);
    return [$u, $m];
}

function mkPlan(int $gid, int $actor, array $over = []): int
{
    $r = Akiba\Services\PlanService::create($gid, $actor, $over + ['name' => 'Plan', 'amount' => '100', 'frequency' => 'daily', 'start_date' => '2026-01-05']);
    if (!$r['ok']) throw new RuntimeException(json_encode($r['errors']));
    return $r['plan_id'];
}

function runTests(?string $filter): int
{
    foreach ($GLOBALS['__tests'] as [$name, $fn]) {
        if ($filter && stripos($name, $filter) === false) continue;
        try {
            resetDb();
            $fn();
            $GLOBALS['__pass']++;
            echo "  PASS  $name\n";
        } catch (Throwable $e) {
            $GLOBALS['__fail']++;
            echo "  FAIL  $name\n        " . get_class($e) . ': ' . $e->getMessage() . "\n        at " . basename($e->getFile()) . ':' . $e->getLine() . "\n";
        }
    }
    echo "\n{$GLOBALS['__pass']} passed, {$GLOBALS['__fail']} failed\n";
    return $GLOBALS['__fail'] ? 1 : 0;
}
