<?php
declare(strict_types=1);
namespace Akiba\Core;

use mysqli;
use mysqli_sql_exception;

/** Thin mysqli wrapper: prepared statements only, nested transactions, deadlock retry. */
final class Db
{
    private static ?Db $inst = null;
    private static array $cfg = [];
    private mysqli $m;
    private int $depth = 0;

    public static function init(array $cfg): void { self::$cfg = $cfg; self::$inst = null; }

    public static function i(): self
    {
        return self::$inst ??= new self(self::$cfg);
    }

    private function __construct(array $c)
    {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $this->m = new mysqli($c['host'], $c['user'], $c['pass'], $c['name'], $c['port']);
        $this->m->set_charset('utf8mb4');
        $this->m->query("SET time_zone = '+00:00'");
        $this->m->query("SET SESSION sql_mode = 'STRICT_ALL_TABLES,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO'");
    }

    public function raw(): mysqli { return $this->m; }

    private function prepare(string $sql, array $params): \mysqli_stmt
    {
        $st = $this->m->prepare($sql);
        if ($params) {
            $types = '';
            $vals = [];
            foreach ($params as $p) {
                if (is_bool($p)) $p = (int)$p;
                $types .= is_int($p) ? 'i' : (is_float($p) ? 'd' : 's');
                $vals[] = $p;
            }
            $st->bind_param($types, ...$vals);
        }
        $st->execute();
        return $st;
    }

    public function all(string $sql, array $params = []): array
    {
        $st = $this->prepare($sql, $params);
        $res = $st->get_result();
        $rows = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];
        $st->close();
        return $rows;
    }

    public function one(string $sql, array $params = []): ?array
    {
        return $this->all($sql, $params)[0] ?? null;
    }

    public function val(string $sql, array $params = []): mixed
    {
        $r = $this->one($sql, $params);
        return $r ? reset($r) : null;
    }

    /** @return int affected rows */
    public function exec(string $sql, array $params = []): int
    {
        $st = $this->prepare($sql, $params);
        $n = $st->affected_rows;
        $st->close();
        return $n;
    }

    public function insert(string $sql, array $params = []): int
    {
        $st = $this->prepare($sql, $params);
        $id = (int)$st->insert_id;
        $st->close();
        return $id;
    }

    public function tx(callable $fn): mixed
    {
        if ($this->depth > 0) { // nested: join the outer transaction
            $this->depth++;
            try { return $fn($this); } finally { $this->depth--; }
        }
        for ($attempt = 1; ; $attempt++) {
            $this->m->begin_transaction();
            $this->depth = 1;
            try {
                $r = $fn($this);
                $this->m->commit();
                $this->depth = 0;
                return $r;
            } catch (\Throwable $e) {
                $this->m->rollback();
                $this->depth = 0;
                if ($e instanceof mysqli_sql_exception && in_array($e->getCode(), [1213, 1205], true) && $attempt < 3) {
                    usleep(random_int(20000, 120000));
                    continue;
                }
                throw $e;
            }
        }
    }

    public function inTx(): bool { return $this->depth > 0; }

    public static function isDuplicate(\Throwable $e): bool
    {
        return $e instanceof mysqli_sql_exception && $e->getCode() === 1062;
    }

    public static function now(): string { return Clock::nowSql(); }
}
