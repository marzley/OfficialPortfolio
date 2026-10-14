<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Audit, Clock, Db};

/**
 * Applies money to obligations. Always oldest-due-first; contributions before penalties.
 * Every method must run inside a DB transaction and takes a row lock on the member so that two
 * concurrent payments for the same member can never allocate against the same balance.
 */
final class AllocationService
{
    public static function lockMember(int $membershipId): array
    {
        $m = Db::i()->one('SELECT id,group_id FROM group_memberships WHERE id=? FOR UPDATE', [$membershipId]);
        if (!$m) throw new \RuntimeException('Member not found');
        return $m;
    }

    private static function openObligations(int $membershipId, string $today, bool $upcoming): array
    {
        $cmp = $upcoming ? '>' : '<=';
        return Db::i()->all(
            "SELECT id,kind,original_minor,waived_minor,paid_minor FROM contribution_obligations
             WHERE membership_id=? AND status='open' AND due_date $cmp ? AND (kind='contribution' OR ?=0)
             ORDER BY (kind='penalty'), due_date, id FOR UPDATE", [$membershipId, $today, $upcoming ? 1 : 0]);
    }

    /** Adds $amt to obligation paid_minor and settles it when fully covered. */
    private static function applyTo(array $o, int $amt): void
    {
        $db = Db::i();
        $paid = (int)$o['paid_minor'] + $amt;
        $done = $paid + (int)$o['waived_minor'] >= (int)$o['original_minor'];
        $db->exec("UPDATE contribution_obligations SET paid_minor=?, status=?, settled_at=? WHERE id=?",
            [$paid, $done ? 'paid' : 'open', $done ? Clock::nowSql() : null, $o['id']]);
    }

    /**
     * Allocate a posted payment. Returns a breakdown.
     * @return array{to_obligations:int,to_penalties:int,to_future:int,to_credit:int,allocations:array}
     */
    public static function allocatePayment(int $txnId, int $groupId, int $membershipId, int $amount, string $today, ?int $actor = null): array
    {
        $db = Db::i();
        $set = GroupService::settings($groupId);
        self::lockMember($membershipId);
        $left = $amount;
        $res = ['to_obligations' => 0, 'to_penalties' => 0, 'to_future' => 0, 'to_credit' => 0, 'allocations' => []];

        $apply = function (array $list, string $bucket) use (&$left, &$res, $db, $txnId, $groupId, $membershipId): void {
            foreach ($list as $o) {
                if ($left <= 0) break;
                $outstanding = (int)$o['original_minor'] - (int)$o['waived_minor'] - (int)$o['paid_minor'];
                if ($outstanding <= 0) continue;
                $take = min($left, $outstanding);
                $aid = $db->insert("INSERT INTO payment_allocations (group_id,membership_id,source,txn_id,obligation_id,kind,amount_minor,created_at) VALUES (?,?,'payment',?,?,'obligation',?,?)",
                    [$groupId, $membershipId, $txnId, $o['id'], $take, Clock::nowSql()]);
                self::applyTo($o, $take);
                $left -= $take;
                $res[$bucket === 'due' ? ($o['kind'] === 'penalty' ? 'to_penalties' : 'to_obligations') : 'to_future'] += $take;
                $res['allocations'][] = ['id' => $aid, 'obligation_id' => (int)$o['id'], 'amount' => $take, 'kind' => $o['kind']];
            }
        };
        $apply(self::openObligations($membershipId, $today, false), 'due');
        if ($left > 0 && (int)$set['allow_advance'] && $set['excess_policy'] === 'apply_future') {
            $apply(self::openObligations($membershipId, $today, true), 'future');
        }
        if ($left > 0) {
            $aid = $db->insert("INSERT INTO payment_allocations (group_id,membership_id,source,txn_id,obligation_id,kind,amount_minor,created_at) VALUES (?,?,'payment',?,NULL,'credit',?,?)",
                [$groupId, $membershipId, $txnId, $left, Clock::nowSql()]);
            $db->exec("INSERT INTO member_credit_entries (group_id,membership_id,amount_minor,reason,txn_id,allocation_id,created_at) VALUES (?,?,?,'overpayment',?,?,?)",
                [$groupId, $membershipId, $left, $txnId, $aid, Clock::nowSql()]);
            $res['to_credit'] = $left;
            $res['allocations'][] = ['id' => $aid, 'obligation_id' => null, 'amount' => $left, 'kind' => 'credit'];
            $left = 0;
        }
        Ledger::post($groupId, 'payment', $txnId, 'Payment received', array_values(array_filter([
            ['1000', $amount, 0, $membershipId],
            ['3000', 0, $res['to_obligations'] + $res['to_future'], $membershipId],
            ['4000', 0, $res['to_penalties'], $membershipId],
            ['2000', 0, $res['to_credit'], $membershipId],
        ], fn($l) => $l[1] > 0 || $l[2] > 0)), $actor);
        return $res;
    }

    /** Spend held member credit on obligations. Returns amount applied. */
    public static function applyCredit(int $groupId, int $membershipId, string $today, bool $includeUpcoming, ?int $actor = null): int
    {
        $db = Db::i();
        return $db->tx(function () use ($db, $groupId, $membershipId, $today, $includeUpcoming, $actor) {
            self::lockMember($membershipId);
            $credit = (int)$db->val('SELECT COALESCE(SUM(amount_minor),0) FROM member_credit_entries WHERE membership_id=?', [$membershipId]);
            if ($credit <= 0) return 0;
            $set = GroupService::settings($groupId);
            $lists = [self::openObligations($membershipId, $today, false)];
            if ($includeUpcoming && (int)$set['allow_advance']) $lists[] = self::openObligations($membershipId, $today, true);
            $applied = 0;
            foreach ($lists as $list) {
                foreach ($list as $o) {
                    if ($credit <= 0) break;
                    $outstanding = (int)$o['original_minor'] - (int)$o['waived_minor'] - (int)$o['paid_minor'];
                    if ($outstanding <= 0) continue;
                    $take = min($credit, $outstanding);
                    $aid = $db->insert("INSERT INTO payment_allocations (group_id,membership_id,source,txn_id,obligation_id,kind,amount_minor,created_at) VALUES (?,?,'credit',NULL,?,'obligation',?,?)",
                        [$groupId, $membershipId, $o['id'], $take, Clock::nowSql()]);
                    $db->exec("INSERT INTO member_credit_entries (group_id,membership_id,amount_minor,reason,allocation_id,created_at) VALUES (?,?,?,'applied',?,?)",
                        [$groupId, $membershipId, -$take, $aid, Clock::nowSql()]);
                    self::applyTo($o, $take);
                    Ledger::post($groupId, 'credit_application', $aid, 'Member credit applied', [
                        ['2000', $take, 0, $membershipId], [$o['kind'] === 'penalty' ? '4000' : '3000', 0, $take, $membershipId]], $actor);
                    $credit -= $take;
                    $applied += $take;
                }
            }
            return $applied;
        });
    }

    private static function reopen(int $obligationId, int $amt): void
    {
        $db = Db::i();
        $o = $db->one('SELECT * FROM contribution_obligations WHERE id=? FOR UPDATE', [$obligationId]);
        $paid = (int)$o['paid_minor'] - $amt;
        if ($paid < 0) throw new \LogicException('Reversal would make paid amount negative');
        $settled = $paid + (int)$o['waived_minor'] >= (int)$o['original_minor'];
        $status = $o['status'] === 'cancelled' ? 'cancelled' : ($settled ? ((int)$o['waived_minor'] > 0 && $paid === 0 ? 'waived' : 'paid') : 'open');
        $db->exec('UPDATE contribution_obligations SET paid_minor=?, status=?, settled_at=? WHERE id=?',
            [$paid, $status, $status === 'open' ? null : $o['settled_at'], $obligationId]);
    }

    /**
     * Reverse a posted payment: allocations are marked reversed (never deleted), obligations reopen,
     * the ledger gets a compensating journal. If the payment's overpayment credit was already spent,
     * the newest credit applications are un-applied until the member's credit is non-negative again.
     */
    public static function reverse(int $txnId, string $reason, int $requestedBy, ?int $approvedBy): void
    {
        $db = Db::i();
        $db->tx(function () use ($db, $txnId, $reason, $requestedBy, $approvedBy) {
            $t = $db->one('SELECT * FROM payment_transactions WHERE id=? FOR UPDATE', [$txnId]);
            if (!$t || $t['status'] !== 'posted') throw new \RuntimeException('Only a posted payment can be reversed');
            self::lockMember((int)$t['membership_id']);
            $now = Clock::nowSql();
            foreach ($db->all('SELECT * FROM payment_allocations WHERE txn_id=? AND reversed_at IS NULL FOR UPDATE', [$txnId]) as $a) {
                if ($a['kind'] === 'obligation') self::reopen((int)$a['obligation_id'], (int)$a['amount_minor']);
                else $db->exec("INSERT INTO member_credit_entries (group_id,membership_id,amount_minor,reason,txn_id,allocation_id,created_at) VALUES (?,?,?,'payment_reversed',?,?,?)",
                    [$t['group_id'], $t['membership_id'], -(int)$a['amount_minor'], $txnId, $a['id'], $now]);
                $db->exec('UPDATE payment_allocations SET reversed_at=? WHERE id=?', [$now, $a['id']]);
            }
            $db->exec("UPDATE payment_transactions SET status='reversed' WHERE id=?", [$txnId]);
            Ledger::reverseRef((int)$t['group_id'], 'payment', $txnId, 'Reversal of ' . $t['receipt_no'] . ': ' . $reason, $approvedBy ?? $requestedBy);

            $credit = (int)$db->val('SELECT COALESCE(SUM(amount_minor),0) FROM member_credit_entries WHERE membership_id=?', [$t['membership_id']]);
            while ($credit < 0) {
                $a = $db->one("SELECT * FROM payment_allocations WHERE membership_id=? AND source='credit' AND reversed_at IS NULL ORDER BY id DESC LIMIT 1 FOR UPDATE", [$t['membership_id']]);
                if (!$a) throw new \LogicException('Negative credit with nothing to un-apply');
                self::reopen((int)$a['obligation_id'], (int)$a['amount_minor']);
                $db->exec('UPDATE payment_allocations SET reversed_at=? WHERE id=?', [$now, $a['id']]);
                $db->exec("INSERT INTO member_credit_entries (group_id,membership_id,amount_minor,reason,allocation_id,created_at) VALUES (?,?,?,'application_reversed',?,?)",
                    [$t['group_id'], $t['membership_id'], (int)$a['amount_minor'], $a['id'], $now]);
                Ledger::reverseRef((int)$t['group_id'], 'credit_application', (int)$a['id'], 'Un-applied credit after reversal of ' . $t['receipt_no'], $approvedBy ?? $requestedBy);
                $credit += (int)$a['amount_minor'];
            }
            Audit::log('payment.reversed', (int)$t['group_id'], 'payment', $txnId, ['reason' => $reason, 'receipt' => $t['receipt_no'], 'requested_by' => $requestedBy, 'approved_by' => $approvedBy], $approvedBy ?? $requestedBy);
        });
    }

    /** Authorised reduction of what's owed. Never touches money received. */
    public static function waive(int $obligationId, int $amount, string $reason, int $actor): void
    {
        $db = Db::i();
        $db->tx(function () use ($db, $obligationId, $amount, $reason, $actor) {
            $o = $db->one('SELECT * FROM contribution_obligations WHERE id=? FOR UPDATE', [$obligationId]);
            if (!$o || $o['status'] !== 'open') throw new \RuntimeException('Only an open obligation can be waived');
            $outstanding = (int)$o['original_minor'] - (int)$o['waived_minor'] - (int)$o['paid_minor'];
            if ($amount <= 0 || $amount > $outstanding) throw new \RuntimeException('Waiver must be between 0 and the outstanding amount');
            if (trim($reason) === '') throw new \RuntimeException('A reason is required');
            $waived = (int)$o['waived_minor'] + $amount;
            $done = $waived + (int)$o['paid_minor'] >= (int)$o['original_minor'];
            $db->exec('UPDATE contribution_obligations SET waived_minor=?, status=?, settled_at=? WHERE id=?',
                [$waived, $done ? ((int)$o['paid_minor'] > 0 ? 'paid' : 'waived') : 'open', $done ? Clock::nowSql() : null, $obligationId]);
            $db->insert('INSERT INTO contribution_waivers (obligation_id,amount_minor,reason,actor_user_id,created_at) VALUES (?,?,?,?,?)', [$obligationId, $amount, $reason, $actor, Clock::nowSql()]);
            Audit::log('obligation.waived', (int)$o['group_id'], 'obligation', $obligationId, ['amount_minor' => $amount, 'reason' => $reason], $actor);
        });
    }
}
