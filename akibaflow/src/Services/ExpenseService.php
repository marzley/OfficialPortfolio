<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Audit, Clock, Db, Money, Permissions};

final class ExpenseService
{
    public const CATEGORIES = ['Administration', 'Welfare / Support', 'Project', 'Investment', 'Meeting costs', 'Bank & M-PESA charges', 'Other'];

    public static function create(int $groupId, int $userId, array $in): array
    {
        $db = Db::i();
        $err = [];
        $amount = Money::parse((string)($in['amount'] ?? ''));
        if (!$amount) $err['amount'] = 'Enter a valid amount.';
        $desc = trim((string)($in['description'] ?? ''));
        if (mb_strlen($desc) < 3) $err['description'] = 'Describe the expense.';
        $payee = trim((string)($in['payee'] ?? ''));
        if ($payee === '') $err['payee'] = 'Enter who will be paid.';
        $cat = (string)($in['category'] ?? '');
        if (!in_array($cat, self::CATEGORIES, true)) $err['category'] = 'Choose a category.';
        $date = (string)($in['expense_date'] ?? '');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $err['expense_date'] = 'Enter the expense date.';
        if ($err) return ['ok' => false, 'errors' => $err];
        $thr = (int)GroupService::settings($groupId)['expense_dual_threshold_minor'];
        $need = ($thr > 0 && $amount >= $thr) ? 2 : 1;
        $id = $db->insert('INSERT INTO group_expenses (group_id,category,description,amount_minor,expense_date,payee,payment_method,reference,required_approvals,requested_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [$groupId, $cat, mb_substr($desc, 0, 250), $amount, $date, mb_substr($payee, 0, 150), mb_substr((string)($in['payment_method'] ?? ''), 0, 30) ?: null, mb_substr((string)($in['reference'] ?? ''), 0, 80) ?: null, $need, $userId, Clock::nowSql()]);
        Audit::log('expense.proposed', $groupId, 'expense', $id, ['amount_minor' => $amount, 'payee' => $payee], $userId);
        Notifications::toRoles($groupId, ['chairperson', 'treasurer'], 'expenses', 'Expense awaiting approval', "$desc — " . Money::fmt($amount), '/g/' . $groupId . '/expenses', 'exp-new:' . $id);
        return ['ok' => true, 'errors' => [], 'id' => $id];
    }

    public static function decide(int $expenseId, int $groupId, int $userId, string $role, bool $approve, string $comment = ''): array
    {
        if (!Permissions::can($role, 'expenses.approve')) return ['ok' => false, 'error' => 'You cannot approve expenses.'];
        $db = Db::i();
        return $db->tx(function () use ($db, $expenseId, $groupId, $userId, $approve, $comment) {
            $e = $db->one('SELECT * FROM group_expenses WHERE id=? AND group_id=? FOR UPDATE', [$expenseId, $groupId]);
            if (!$e || $e['status'] !== 'proposed') return ['ok' => false, 'error' => 'This expense is not awaiting approval.'];
            if ((int)$e['requested_by'] === $userId) return ['ok' => false, 'error' => 'You cannot approve an expense you submitted.'];
            try {
                $db->insert('INSERT INTO expense_approvals (expense_id,approver_user_id,decision,comment,created_at) VALUES (?,?,?,?,?)', [$expenseId, $userId, $approve ? 'approve' : 'reject', mb_substr($comment, 0, 250) ?: null, Clock::nowSql()]);
            } catch (\Throwable $ex) {
                if (Db::isDuplicate($ex)) return ['ok' => false, 'error' => 'You have already recorded a decision on this expense.'];
                throw $ex;
            }
            if (!$approve) {
                $db->exec("UPDATE group_expenses SET status='rejected' WHERE id=?", [$expenseId]);
            } elseif ((int)$db->val("SELECT COUNT(*) FROM expense_approvals WHERE expense_id=? AND decision='approve'", [$expenseId]) >= (int)$e['required_approvals']) {
                $db->exec("UPDATE group_expenses SET status='approved' WHERE id=?", [$expenseId]);
            }
            Audit::log($approve ? 'expense.approved' : 'expense.rejected', $groupId, 'expense', $expenseId, ['comment' => $comment], $userId);
            return ['ok' => true];
        });
    }

    /** Money actually leaves the group: only an approved expense can be paid, and only from funds really held. */
    public static function pay(int $expenseId, int $groupId, int $userId, string $method, string $reference): array
    {
        $db = Db::i();
        return $db->tx(function () use ($db, $expenseId, $groupId, $userId, $method, $reference) {
            $e = $db->one('SELECT * FROM group_expenses WHERE id=? AND group_id=? FOR UPDATE', [$expenseId, $groupId]);
            if (!$e || $e['status'] !== 'approved') return ['ok' => false, 'error' => 'Only an approved expense can be paid.'];
            $db->val('SELECT id FROM financial_accounts WHERE group_id=? AND code=? FOR UPDATE', [$groupId, '1000']); // serialise concurrent payouts
            if (Ledger::balance($groupId, '1000') < (int)$e['amount_minor']) return ['ok' => false, 'error' => 'Insufficient group funds to pay this expense.'];
            $db->exec("UPDATE group_expenses SET status='paid', paid_by=?, paid_at=?, payment_method=?, reference=COALESCE(NULLIF(?,''),reference) WHERE id=?", [$userId, Clock::nowSql(), mb_substr($method, 0, 30) ?: $e['payment_method'], mb_substr($reference, 0, 80), $expenseId]);
            Ledger::post($groupId, 'expense', $expenseId, 'Expense: ' . $e['description'], [['5000', (int)$e['amount_minor'], 0], ['1000', 0, (int)$e['amount_minor']]], $userId);
            Audit::log('expense.paid', $groupId, 'expense', $expenseId, ['amount_minor' => (int)$e['amount_minor']], $userId);
            return ['ok' => true];
        });
    }

    public static function reverse(int $expenseId, int $groupId, int $userId, string $reason): array
    {
        $db = Db::i();
        return $db->tx(function () use ($db, $expenseId, $groupId, $userId, $reason) {
            $e = $db->one('SELECT * FROM group_expenses WHERE id=? AND group_id=? FOR UPDATE', [$expenseId, $groupId]);
            if (!$e || $e['status'] !== 'paid') return ['ok' => false, 'error' => 'Only a paid expense can be reversed.'];
            if (trim($reason) === '') return ['ok' => false, 'error' => 'A reason is required.'];
            $db->exec("UPDATE group_expenses SET status='reversed' WHERE id=?", [$expenseId]);
            Ledger::reverseRef($groupId, 'expense', $expenseId, 'Reversal of expense: ' . $reason, $userId);
            Audit::log('expense.reversed', $groupId, 'expense', $expenseId, ['reason' => $reason], $userId);
            return ['ok' => true];
        });
    }
}
