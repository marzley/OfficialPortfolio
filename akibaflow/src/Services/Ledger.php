<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Clock, Db};

/** Double-entry ledger. Journals must balance; posted rows are immutable (DB triggers); fix mistakes with reversing journals. */
final class Ledger
{
    /**
     * @param array<int,array{0:string,1:int,2:int,3?:?int}> $lines [accountCode, debit, credit, membershipId?]
     */
    public static function post(int $groupId, string $refType, int $refId, string $desc, array $lines, ?int $actor = null, ?int $reverses = null): int
    {
        $d = $c = 0;
        foreach ($lines as $l) { $d += $l[1]; $c += $l[2]; }
        if ($d !== $c || $d <= 0) throw new \LogicException("Unbalanced journal ($d vs $c)");
        $db = Db::i();
        return $db->tx(function () use ($db, $groupId, $refType, $refId, $desc, $lines, $actor, $reverses) {
            $jid = $db->insert('INSERT INTO ledger_journals (group_id,ref_type,ref_id,description,reverses_journal_id,posted_at,created_by) VALUES (?,?,?,?,?,?,?)',
                [$groupId, $refType, $refId, $desc, $reverses, Clock::nowSql(), $actor]);
            foreach ($lines as $l) {
                if ($l[1] === 0 && $l[2] === 0) continue;
                $acct = $db->val('SELECT id FROM financial_accounts WHERE group_id=? AND code=?', [$groupId, $l[0]]);
                if (!$acct) throw new \LogicException("Unknown account {$l[0]}");
                $db->exec('INSERT INTO ledger_entries (journal_id,account_id,membership_id,debit_minor,credit_minor) VALUES (?,?,?,?,?)',
                    [$jid, $acct, $l[3] ?? null, $l[1], $l[2]]);
            }
            return $jid;
        });
    }

    /** Post the mirror image of the (single) journal for ref; no-op if already reversed or none exists. */
    public static function reverseRef(int $groupId, string $refType, int $refId, string $desc, ?int $actor = null): ?int
    {
        $db = Db::i();
        $j = $db->one('SELECT id FROM ledger_journals WHERE group_id=? AND ref_type=? AND ref_id=? AND reverses_journal_id IS NULL ORDER BY id DESC LIMIT 1', [$groupId, $refType, $refId]);
        if (!$j) return null;
        if ($db->val('SELECT 1 FROM ledger_journals WHERE reverses_journal_id=?', [$j['id']])) return null;
        $lines = [];
        foreach ($db->all('SELECT a.code, e.debit_minor, e.credit_minor, e.membership_id FROM ledger_entries e JOIN financial_accounts a ON a.id=e.account_id WHERE e.journal_id=?', [$j['id']]) as $e) {
            $lines[] = [$e['code'], (int)$e['credit_minor'], (int)$e['debit_minor'], $e['membership_id'] ? (int)$e['membership_id'] : null];
        }
        return self::post($groupId, $refType . '_reversal', $refId, $desc, $lines, $actor, (int)$j['id']);
    }

    /** Natural-sign balance of an account (assets/expenses: debit−credit; others: credit−debit). */
    public static function balance(int $groupId, string $code, ?string $upToUtc = null): int
    {
        $row = Db::i()->one(
            'SELECT a.type, COALESCE(SUM(e.debit_minor),0) d, COALESCE(SUM(e.credit_minor),0) c
             FROM financial_accounts a LEFT JOIN ledger_entries e ON e.account_id=a.id
             LEFT JOIN ledger_journals j ON j.id=e.journal_id
             WHERE a.group_id=? AND a.code=?' . ($upToUtc ? ' AND (j.posted_at<=? OR j.id IS NULL)' : '') . ' GROUP BY a.id',
            $upToUtc ? [$groupId, $code, $upToUtc] : [$groupId, $code]);
        if (!$row) return 0;
        return in_array($row['type'], ['asset', 'expense'], true) ? (int)$row['d'] - (int)$row['c'] : (int)$row['c'] - (int)$row['d'];
    }

    /** Sanity check used by tests and the admin health page: every journal balances. */
    public static function unbalancedJournals(?int $groupId = null): array
    {
        return Db::i()->all(
            'SELECT j.id, SUM(e.debit_minor) d, SUM(e.credit_minor) c FROM ledger_journals j JOIN ledger_entries e ON e.journal_id=j.id'
            . ($groupId ? ' WHERE j.group_id=' . (int)$groupId : '') . ' GROUP BY j.id HAVING d<>c');
    }
}
