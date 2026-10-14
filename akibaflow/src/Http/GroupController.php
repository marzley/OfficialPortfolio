<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Access, Audit, Auth, Clock, Db, Env, Http, Money, Permissions, Session, View};
use Akiba\Services\{AllocationService, ContributionEngine, ExpenseService, GroupService, Ledger, Notifications, PaymentService, PlanService, ReportService};

/** Officer-facing pages. Every action re-checks the permission on the server and scopes ids to the group. */
final class GroupController extends Ctl
{
    // ------------------------------------------------------------ overview
    public static function overview(int $gid): void
    {
        $g = self::group($gid, 'reports.view');
        $today = self::today($g);
        $to = self::dateOr('to', $today);
        $from = self::dateOr('from', substr($to, 0, 8) . '01');
        $planId = self::intval('plan') ?: null;
        if ($planId && !Db::i()->val('SELECT 1 FROM contribution_plans WHERE id=? AND group_id=?', [$planId, $gid])) $planId = null;
        $o = ReportService::overview($gid, $from, $to, $planId);
        $db = Db::i();
        $recent = $db->all("SELECT t.*, u.full_name FROM payment_transactions t JOIN group_memberships m ON m.id=t.membership_id JOIN users u ON u.id=m.user_id WHERE t.group_id=? ORDER BY t.id DESC LIMIT 8", [$gid]);
        $members = ReportService::memberTable($gid, self::str('q') ?: null, self::str('sort') ?: 'outstanding', false, 25);
        $upcoming = $db->all("SELECT o.due_date, p.name, SUM(o.original_minor-o.waived_minor-o.paid_minor) amt, COUNT(*) n FROM contribution_obligations o JOIN contribution_plans p ON p.id=o.plan_id
                              WHERE o.group_id=? AND o.status='open' AND o.kind='contribution' AND o.due_date>? GROUP BY o.due_date, p.name ORDER BY o.due_date LIMIT 5", [$gid, $today]);
        $plans = $db->all('SELECT id,name FROM contribution_plans WHERE group_id=? ORDER BY name', [$gid]);
        self::page('group/overview', compact('o', 'from', 'to', 'planId', 'recent', 'members', 'upcoming', 'plans') + ['q' => self::str('q'), 'sort' => self::str('sort') ?: 'outstanding'], 'overview', 'Financial overview');
    }

    // ------------------------------------------------------------ members
    public static function members(int $gid): void
    {
        $g = self::group($gid, 'members.view');
        $rows = Db::i()->all("SELECT m.*, u.full_name, u.email, u.phone FROM group_memberships m JOIN users u ON u.id=m.user_id WHERE m.group_id=? ORDER BY FIELD(m.status,'pending','active','suspended','exited','rejected'), u.full_name", [$gid]);
        $inv = Db::i()->all('SELECT * FROM group_invitations WHERE group_id=? AND accepted_at IS NULL AND expires_at>? ORDER BY id DESC', [$gid, Clock::nowSql()]);
        self::page('group/members', ['rows' => $rows, 'invites' => $inv, 'link' => $_SESSION['_invite_link'] ?? null], 'members', 'Members');
        unset($_SESSION['_invite_link']);
    }

    public static function invite(int $gid): void
    {
        $g = self::group($gid, 'members.manage');
        $email = strtolower(self::str('email'));
        $role = self::str('role');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($role, Permissions::ROLES, true)) self::back("/g/$gid/members", 'error', 'Enter a valid email and role.');
        if ($role !== 'member' && !Access::can($g, 'roles.assign')) self::back("/g/$gid/members", 'error', 'Only the chairperson can invite officers.');
        $raw = bin2hex(random_bytes(24));
        Db::i()->insert('INSERT INTO group_invitations (group_id,email,role,token_hash,invited_by,expires_at,created_at) VALUES (?,?,?,?,?,?,?)',
            [$gid, $email, $role, hash('sha256', $raw), $g['user_id'], Clock::now()->modify('+14 days')->format('Y-m-d H:i:s'), Clock::nowSql()]);
        $link = rtrim((string)Env::get('APP_URL', ''), '/') . '/invites/' . $raw;
        if ($u = Db::i()->one('SELECT id FROM users WHERE email=?', [$email])) {
            Notifications::send((int)$u['id'], $gid, 'membership', 'You are invited to ' . $g['group_name'], "You've been invited to join {$g['group_name']} as " . roleLabel($role) . ".", '/invites/' . $raw, 'invite:' . $raw);
        }
        Audit::log('member.invited', $gid, 'invitation', null, ['email' => $email, 'role' => $role]);
        $_SESSION['_invite_link'] = $link; // shown once so the chair can share it by WhatsApp/SMS
        self::back("/g/$gid/members", 'success', 'Invitation created. Share the link below with the member.');
    }

    public static function memberAction(int $gid, int $mid): void
    {
        $g = self::group($gid, 'members.manage');
        $target = Access::memberInGroup($gid, $mid);
        $action = self::str('action');
        $isSelf = (int)$target['id'] === (int)$g['id'];
        switch ($action) {
            case 'approve': case 'reject': case 'suspend': case 'reactivate': case 'exit':
                if ($isSelf) self::back("/g/$gid/members", 'error', 'You cannot change your own membership status.');
                if (in_array($target['role'], ['chairperson'], true) && !Access::can($g, 'roles.assign')) self::back("/g/$gid/members", 'error', 'Not allowed.');
                $new = ['approve' => 'active', 'reject' => 'rejected', 'suspend' => 'suspended', 'reactivate' => 'active', 'exit' => 'exited'][$action];
                GroupService::setStatus($gid, $mid, $new, self::str('note'));
                if ($action === 'approve') Notifications::send((int)$target['user_id'], $gid, 'membership', 'Membership approved', 'You are now a member of ' . $g['group_name'] . '.', "/g/$gid", 'appr:' . $mid);
                self::back("/g/$gid/members", 'success', 'Member updated.');
            case 'role':
                Access::require($gid, 'roles.assign');
                $role = self::str('role');
                if (!in_array($role, Permissions::ROLES, true)) self::back("/g/$gid/members", 'error', 'Invalid role.');
                if ($isSelf && $role !== 'chairperson' && (int)Db::i()->val("SELECT COUNT(*) FROM group_memberships WHERE group_id=? AND role='chairperson' AND status='active'", [$gid]) < 2) {
                    self::back("/g/$gid/members", 'error', 'A group must keep at least one chairperson. Promote someone else first.');
                }
                Db::i()->exec('UPDATE group_memberships SET role=? WHERE id=? AND group_id=?', [$role, $mid, $gid]);
                Audit::log('member.role_changed', $gid, 'membership', $mid, ['from' => $target['role'], 'to' => $role]);
                self::back("/g/$gid/members", 'success', 'Role updated.');
        }
        self::back("/g/$gid/members", 'error', 'Unknown action.');
    }

    public static function memberDetail(int $gid, int $mid): void
    {
        $g = self::group($gid, 'obligations.view_all');
        $t = Access::memberInGroup($gid, $mid);
        $u = Db::i()->one('SELECT full_name,email,phone FROM users WHERE id=?', [$t['user_id']]);
        Audit::log('member.finance_viewed', $gid, 'membership', $mid);
        $today = self::today($g);
        $bal = ContributionEngine::balance($mid, $today);
        $rows = ContributionEngine::obligations($mid, $today, [], 40, 0);
        $pays = Db::i()->all('SELECT * FROM payment_transactions WHERE membership_id=? ORDER BY id DESC LIMIT 20', [$mid]);
        self::page('group/member_detail', ['t' => $t, 'u' => $u, 'bal' => $bal, 'rows' => $rows, 'pays' => $pays], 'members', $u['full_name']);
    }

    // ------------------------------------------------------------ plans
    public static function plans(int $gid): void
    {
        $g = self::group($gid, 'plans.view');
        self::renderPlans($gid, $g, []);
    }

    private static function renderPlans(int $gid, array $g, array $errors): void
    {
        $plans = Db::i()->all("SELECT p.*, v.amount_minor, v.frequency, v.weekday, v.month_day, v.interval_days, v.anchor_date, v.grace_days, v.effective_from,
              (SELECT COUNT(*) FROM contribution_plan_members pm WHERE pm.plan_id=p.id AND pm.to_date IS NULL) AS members
              FROM contribution_plans p JOIN contribution_plan_versions v ON v.id=(SELECT id FROM contribution_plan_versions WHERE plan_id=p.id AND effective_from<=? ORDER BY effective_from DESC, version_no DESC LIMIT 1)
              WHERE p.group_id=? ORDER BY p.status, p.id DESC", [self::today($g), $gid]);
        self::page('group/plans', ['plans' => $plans, 'errors' => $errors, 'members' => Db::i()->all("SELECT m.id,u.full_name FROM group_memberships m JOIN users u ON u.id=m.user_id WHERE m.group_id=? AND m.status='active' ORDER BY u.full_name", [$gid])], 'plans', 'Contribution plans');
    }

    public static function createPlan(int $gid): void
    {
        $g = self::group($gid, 'plans.manage');
        $r = PlanService::create($gid, (int)$g['user_id'], $_POST);
        if (!$r['ok']) {
            http_response_code(422);
            self::renderPlans($gid, $g, $r['errors']);
            return;
        }
        ContributionEngine::generate($gid); // obligations appear immediately; the worker keeps them current
        self::back("/g/$gid/plans/" . $r['plan_id'], 'success', 'Contribution plan created and members enrolled.');
    }

    public static function planDetail(int $gid, int $id): void
    {
        $g = self::group($gid, 'plans.view');
        $plan = Db::i()->one('SELECT * FROM contribution_plans WHERE id=? AND group_id=?', [$id, $gid]);
        if (!$plan) Http::abort(404);
        $versions = PlanService::versions($id);
        $enrolled = Db::i()->all("SELECT pm.*, u.full_name, m.member_code FROM contribution_plan_members pm JOIN group_memberships m ON m.id=pm.membership_id JOIN users u ON u.id=m.user_id WHERE pm.plan_id=? AND pm.to_date IS NULL ORDER BY u.full_name", [$id]);
        $stats = Db::i()->one("SELECT COUNT(*) n, COALESCE(SUM(original_minor-waived_minor),0) expected, COALESCE(SUM(paid_minor),0) paid FROM contribution_obligations WHERE plan_id=? AND kind='contribution' AND due_date<=?", [$id, self::today($g)]);
        self::page('group/plan_detail', ['plan' => $plan, 'versions' => $versions, 'enrolled' => $enrolled, 'stats' => $stats, 'errors' => $_SESSION['_errors'] ?? []], 'plans', $plan['name']);
        unset($_SESSION['_errors']);
    }

    public static function planVersion(int $gid, int $id): void
    {
        $g = self::group($gid, 'plans.manage');
        if (!Db::i()->val('SELECT 1 FROM contribution_plans WHERE id=? AND group_id=?', [$id, $gid])) Http::abort(404);
        $r = PlanService::newVersion($id, (int)$g['user_id'], $_POST);
        if (!$r['ok']) { $_SESSION['_errors'] = $r['errors']; self::back("/g/$gid/plans/$id", 'error', 'Please fix the highlighted fields: ' . implode(' ', $r['errors'])); }
        $members = Db::i()->all('SELECT m.user_id FROM contribution_plan_members pm JOIN group_memberships m ON m.id=pm.membership_id WHERE pm.plan_id=? AND pm.to_date IS NULL', [$id]);
        $p = Db::i()->one('SELECT name FROM contribution_plans WHERE id=?', [$id]);
        foreach ($members as $m) Notifications::send((int)$m['user_id'], $gid, 'membership', 'Contribution plan changed', "Terms for \"{$p['name']}\" change from " . ($_POST['effective_from'] ?? '') . '. Existing dues are not affected.', "/g/$gid", "plan-change:$id:" . ($_POST['effective_from'] ?? '') . ':' . $m['user_id']);
        self::back("/g/$gid/plans/$id", 'success', 'New terms scheduled. Existing obligations keep the terms they were created under.');
    }

    public static function planStatus(int $gid, int $id): void
    {
        $g = self::group($gid, 'plans.manage');
        if (!Db::i()->val('SELECT 1 FROM contribution_plans WHERE id=? AND group_id=?', [$id, $gid])) Http::abort(404);
        $s = self::str('status');
        if (!in_array($s, ['active', 'paused', 'ended'], true)) Http::abort(404);
        PlanService::setStatus($id, $s, (int)$g['user_id']);
        self::back("/g/$gid/plans/$id", 'success', 'Plan status updated. Existing obligations remain on record.');
    }

    // ------------------------------------------------------------ arrears & waivers
    public static function arrears(int $gid): void
    {
        $g = self::group($gid, 'obligations.view_all');
        $rep = ReportService::arrears($gid);
        $rows = ReportService::memberTable($gid, self::str('q') ?: null, 'outstanding', true, 300);
        $open = [];
        if ($mid = self::intval('member')) {
            Access::memberInGroup($gid, $mid);
            $open = ContributionEngine::obligations($mid, self::today($g), ['status' => ''], 60, 0);
        }
        self::page('group/arrears', ['rows' => $rows, 'q' => self::str('q'), 'open' => array_filter($open, fn($r) => $r['status'] === 'open'), 'mid' => $mid, 'total' => array_sum(array_column($rows, 'outstanding'))], 'arrears', 'Outstanding balances');
    }

    public static function waive(int $gid, int $id): void
    {
        $g = self::group($gid, 'waivers.grant');
        $o = Db::i()->one('SELECT * FROM contribution_obligations WHERE id=? AND group_id=?', [$id, $gid]);
        if (!$o) Http::abort(404);
        $amt = self::str('amount') === '' ? (int)$o['original_minor'] - (int)$o['waived_minor'] - (int)$o['paid_minor'] : Money::parse(self::str('amount'));
        try {
            AllocationService::waive($id, (int)$amt, self::str('reason'), (int)$g['user_id']);
        } catch (\RuntimeException $e) {
            self::back("/g/$gid/arrears?member=" . $o['membership_id'], 'error', $e->getMessage());
        }
        self::back("/g/$gid/arrears?member=" . $o['membership_id'], 'success', 'Waiver recorded and audited.');
    }

    // ------------------------------------------------------------ payments
    public static function payments(int $gid): void
    {
        $g = self::group($gid, 'payments.view_all');
        $to = self::dateOr('to', self::today($g));
        $from = self::dateOr('from', substr($to, 0, 8) . '01');
        $rep = ReportService::transactions($gid, $from, $to, self::str('status') ?: null, self::str('source') ?: null);
        $members = Db::i()->all("SELECT m.id,u.full_name,m.member_code FROM group_memberships m JOIN users u ON u.id=m.user_id WHERE m.group_id=? AND m.status IN ('active','suspended') ORDER BY u.full_name", [$gid]);
        $revs = Db::i()->all("SELECT r.*, t.receipt_no, t.amount_minor, t.currency, u.full_name requester FROM payment_reversals r JOIN payment_transactions t ON t.id=r.txn_id JOIN users u ON u.id=r.requested_by WHERE t.group_id=? AND r.status='requested' ORDER BY r.id", [$gid]);
        self::page('group/payments', ['rep' => $rep, 'from' => $from, 'to' => $to, 'members' => $members, 'revs' => $revs, 'status' => self::str('status'), 'source' => self::str('source')], 'payments', 'Payments');
    }

    public static function manualPayment(int $gid): void
    {
        $g = self::group($gid, 'payments.record_manual');
        $mem = Access::memberInGroup($gid, self::intval('membership_id'));
        $amt = Money::parse(self::str('amount'));
        try {
            if (!$amt) throw new \InvalidArgumentException('Enter a valid amount.');
            $out = PaymentService::recordManual($gid, (int)$mem['id'], $amt, self::str('method'), self::str('reference'), self::str('note'), (int)$g['user_id']);
        } catch (\InvalidArgumentException $e) {
            self::back("/g/$gid/payments", 'error', $e->getMessage());
        }
        self::back("/g/$gid/receipts/" . $out['txn_id'], 'success', 'Manual payment recorded. It is labelled "recorded manually" on reports and receipts.');
    }

    public static function requestReversal(int $gid, int $id): void
    {
        $g = self::group($gid, 'payments.reverse');
        $r = PaymentService::requestReversal($id, $gid, self::str('reason'), (int)$g['user_id']);
        self::back("/g/$gid/payments", $r['ok'] ? 'success' : 'error', $r['ok'] ? (!empty($r['pending_approval']) ? 'Reversal requested. A second officer must approve it.' : 'Payment reversed.') : $r['error']);
    }

    public static function decideReversal(int $gid, int $id): void
    {
        $g = self::group($gid, 'payments.reverse');
        $r = PaymentService::decideReversal($id, $gid, (int)$g['user_id'], self::str('decision') === 'approve');
        self::back("/g/$gid/payments", $r['ok'] ? 'success' : 'error', $r['ok'] ? 'Decision recorded.' : $r['error']);
    }

    // ------------------------------------------------------------ reconciliation
    public static function reconcile(int $gid): void
    {
        $g = self::group($gid, 'reconcile.view');
        $rec = PaymentService::reconciliation($gid);
        Db::i()->exec('INSERT INTO payment_reconciliation_runs (group_id,run_by,summary,created_at) VALUES (?,?,?,?)', [$gid, $g['user_id'], json_encode(['unresolved' => count($rec['unresolved']), 'failed' => count($rec['failed']), 'c2b' => count($rec['c2b_pending']), 'paid_mismatch' => count($rec['paid_mismatch']), 'unbalanced' => count($rec['ledger_unbalanced']), 'funds_ledger' => $rec['funds_ledger'], 'funds_expected' => $rec['funds_expected']]), Clock::nowSql()]);
        self::page('group/reconcile', ['rec' => $rec, 'members' => Db::i()->all("SELECT m.id,u.full_name,m.member_code FROM group_memberships m JOIN users u ON u.id=m.user_id WHERE m.group_id=? AND m.status='active' ORDER BY u.full_name", [$gid])], 'reconcile', 'Reconciliation');
    }

    public static function recheck(int $gid, int $id): void
    {
        self::group($gid, 'payments.record_manual');
        if (!Db::i()->val('SELECT 1 FROM payment_requests WHERE id=? AND group_id=?', [$id, $gid])) Http::abort(404);
        try { $s = PaymentService::checkStatus($id); } catch (\RuntimeException $e) { self::back("/g/$gid/reconcile", 'error', 'Provider unavailable: ' . $e->getMessage()); }
        self::back("/g/$gid/reconcile", 'info', 'Provider status checked. Request is now: ' . status_label($s) . '.');
    }

    public static function resolveRequest(int $gid, int $id): void
    {
        $g = self::group($gid, 'payments.record_manual');
        $req = Db::i()->one('SELECT * FROM payment_requests WHERE id=? AND group_id=?', [$id, $gid]);
        if (!$req) Http::abort(404);
        $amt = Money::parse(self::str('amount'));
        try {
            if (!$amt) throw new \InvalidArgumentException('Enter the amount shown on the M-PESA statement.');
            PaymentService::recordManual($gid, (int)$req['membership_id'], $amt, 'mpesa_paybill', self::str('reference'), 'Reconciled against statement for request ' . $req['ref'], (int)$g['user_id'], $id);
        } catch (\InvalidArgumentException $e) {
            self::back("/g/$gid/reconcile", 'error', $e->getMessage());
        }
        self::back("/g/$gid/reconcile", 'success', 'Payment reconciled and credited.');
    }

    public static function acceptC2b(int $gid, int $id): void
    {
        $g = self::group($gid, 'payments.record_manual');
        try { PaymentService::acceptC2b($id, $gid, (int)$g['user_id']); } catch (\InvalidArgumentException $e) { self::back("/g/$gid/reconcile", 'error', $e->getMessage()); }
        self::back("/g/$gid/reconcile", 'success', 'Paybill payment accepted and allocated.');
    }

    // ------------------------------------------------------------ expenses
    public static function expenses(int $gid): void
    {
        $g = self::group($gid, 'expenses.view');
        $rows = Db::i()->all("SELECT e.*, u.full_name requester, (SELECT COUNT(*) FROM expense_approvals a WHERE a.expense_id=e.id AND a.decision='approve') approvals,
              (SELECT COUNT(*) FROM expense_approvals a WHERE a.expense_id=e.id AND a.approver_user_id=?) mine FROM group_expenses e JOIN users u ON u.id=e.requested_by WHERE e.group_id=? ORDER BY e.id DESC LIMIT 100", [$g['user_id'], $gid]);
        self::page('group/expenses', ['rows' => $rows, 'funds' => Ledger::balance($gid, '1000'), 'errors' => [], 'cats' => ExpenseService::CATEGORIES], 'expenses', 'Expenses');
    }

    public static function createExpense(int $gid): void
    {
        $g = self::group($gid, 'expenses.create');
        $r = ExpenseService::create($gid, (int)$g['user_id'], $_POST);
        if (!$r['ok']) self::back("/g/$gid/expenses", 'error', 'Could not save: ' . implode(' ', $r['errors']));
        self::back("/g/$gid/expenses", 'success', 'Expense proposed. It is not counted as spent until approved and paid.');
    }

    public static function decideExpense(int $gid, int $id): void
    {
        $g = self::group($gid, 'expenses.approve');
        $r = ExpenseService::decide($id, $gid, (int)$g['user_id'], $g['role'], self::str('decision') === 'approve', self::str('comment'));
        self::back("/g/$gid/expenses", $r['ok'] ? 'success' : 'error', $r['ok'] ? 'Decision recorded.' : $r['error']);
    }

    public static function payExpense(int $gid, int $id): void
    {
        $g = self::group($gid, 'expenses.pay');
        $r = ExpenseService::pay($id, $gid, (int)$g['user_id'], self::str('method'), self::str('reference'));
        self::back("/g/$gid/expenses", $r['ok'] ? 'success' : 'error', $r['ok'] ? 'Expense marked paid and posted to the ledger.' : $r['error']);
    }

    public static function reverseExpense(int $gid, int $id): void
    {
        $g = self::group($gid, 'expenses.pay');
        $r = ExpenseService::reverse($id, $gid, (int)$g['user_id'], self::str('reason'));
        self::back("/g/$gid/expenses", $r['ok'] ? 'success' : 'error', $r['ok'] ? 'Expense reversed.' : $r['error']);
    }

    // ------------------------------------------------------------ reports
    public static function reports(int $gid): void
    {
        self::group($gid, 'reports.view');
        self::page('reports/index', [], 'reports', 'Reports');
    }

    public static function report(int $gid, string $type): void
    {
        $g = self::group($gid, 'reports.view');
        $to = self::dateOr('to', self::today($g));
        $from = self::dateOr('from', substr($to, 0, 8) . '01');
        $extra = [];
        $hasDates = true;
        switch ($type) {
            case 'collections': $by = in_array(self::str('by'), ['day', 'week', 'month'], true) ? self::str('by') : 'day'; $rep = ReportService::collections($gid, $from, $to, $by); $extra = ['by' => $by]; break;
            case 'arrears': $rep = ReportService::arrears($gid); $hasDates = false; break;
            case 'members': $rep = ReportService::memberContributions($gid); $hasDates = false; break;
            case 'expenses': $rep = ReportService::expenses($gid, $from, $to); break;
            case 'income-expenditure': $rep = ReportService::incomeExpenditure($gid, $from, $to); break;
            case 'cash-movement': $rep = ReportService::cashMovement($gid, $from, $to); break;
            case 'transactions': $rep = ReportService::transactions($gid, $from, $to); break;
            default: Http::abort(404);
        }
        if (self::str('format') === 'csv') {
            Audit::log('report.exported', $gid, null, null, ['type' => $type, 'from' => $from, 'to' => $to]);
            ReportService::csv($rep, "{$type}_{$from}_{$to}.csv");
        }
        self::page('reports/view', ['rep' => $rep, 'from' => $from, 'to' => $to, 'base' => "/g/$gid/reports/$type", 'hasDates' => $hasDates, 'extra' => $extra], 'reports', $rep['meta']['title']);
    }

    // ------------------------------------------------------------ audit / settings / goals / announcements
    public static function audit(int $gid): void
    {
        $g = self::group($gid, 'audit.view');
        $page = max(1, self::intval('page'));
        $rows = Db::i()->all('SELECT a.*, u.full_name FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_user_id WHERE a.group_id=? ORDER BY a.id DESC LIMIT 51 OFFSET ' . (($page - 1) * 50), [$gid]);
        $more = count($rows) > 50;
        self::page('group/audit', ['rows' => array_slice($rows, 0, 50), 'page' => $page, 'more' => $more], 'audit', 'Audit trail');
    }

    public static function settings(int $gid): void
    {
        $g = self::group($gid, 'group.manage');
        self::page('group/settings', ['s' => GroupService::settings($gid), 'grp' => Db::i()->one('SELECT * FROM `groups` WHERE id=?', [$gid])], 'settings', 'Group settings');
    }

    public static function saveSettings(int $gid): void
    {
        $g = self::group($gid, 'group.manage');
        $cur = GroupService::settings($gid);
        $m = fn(string $k) => Money::parse(self::str($k)) ?? 0;
        $pen = !empty($_POST['penalty_enabled']);
        $new = [
            'excess_policy' => in_array(self::str('excess_policy'), ['hold_credit', 'apply_future'], true) ? self::str('excess_policy') : $cur['excess_policy'],
            'allow_partial' => !empty($_POST['allow_partial']) ? 1 : 0, 'allow_advance' => !empty($_POST['allow_advance']) ? 1 : 0,
            'penalty_enabled' => $pen ? 1 : 0, 'penalty_fixed_minor' => $m('penalty_fixed'), 'penalty_after_days' => max(0, min(365, self::intval('penalty_after_days'))),
            'penalty_max_per_member_minor' => $m('penalty_max'), 'remind_before_days' => max(0, min(30, self::intval('remind_before_days'))),
            'reminders_paused' => !empty($_POST['reminders_paused']) ? 1 : 0, 'overdue_digest' => !empty($_POST['overdue_digest']) ? 1 : 0,
            'reminder_channels' => implode(',', array_values(array_intersect((array)($_POST['channels'] ?? []), ['in_app', 'email', 'sms']))) ?: 'in_app',
            'expense_dual_threshold_minor' => $m('expense_threshold'), 'dual_control_reversals' => !empty($_POST['dual_control']) ? 1 : 0,
        ];
        if ($pen && $new['penalty_fixed_minor'] <= 0) self::back("/g/$gid/settings", 'error', 'Enter the fixed late fee amount, or turn late fees off.');
        $sets = implode(',', array_map(fn($k) => "$k=?", array_keys($new)));
        Db::i()->exec("UPDATE group_settings SET $sets WHERE group_id=?", [...array_values($new), $gid]);
        Db::i()->exec('UPDATE `groups` SET description=?, contact_email=?, contact_phone=? WHERE id=?', [self::str('description') ?: null, self::str('contact_email') ?: null, self::str('contact_phone') ?: null, $gid]);
        Audit::log('settings.changed', $gid, 'group', $gid, ['before' => $cur, 'after' => $new]);
        self::back("/g/$gid/settings", 'success', 'Settings saved. Changes apply to future obligations, reminders and fees; history is untouched.');
    }

    public static function saveGoal(int $gid): void
    {
        $g = self::group($gid, 'goals.manage');
        $t = Money::parse(self::str('target'));
        if (!$t || self::str('name') === '') self::back("/g/$gid/goals", 'error', 'Enter a name and a valid target amount.');
        $plan = self::intval('plan_id') ?: null;
        if ($plan && !Db::i()->val('SELECT 1 FROM contribution_plans WHERE id=? AND group_id=?', [$plan, $gid])) $plan = null;
        $id = Db::i()->insert('INSERT INTO savings_goals (group_id,name,description,target_minor,target_date,plan_id,created_by,created_at) VALUES (?,?,?,?,?,?,?,?)',
            [$gid, mb_substr(self::str('name'), 0, 150), self::str('description') ?: null, $t, preg_match('/^\d{4}-\d{2}-\d{2}$/', self::str('target_date')) ? self::str('target_date') : null, $plan, $g['user_id'], Clock::nowSql()]);
        Audit::log('goal.created', $gid, 'goal', $id);
        self::back("/g/$gid/goals", 'success', 'Goal created.');
    }

    public static function allocateGoal(int $gid, int $id): void
    {
        $g = self::group($gid, 'goals.manage');
        $goal = Db::i()->one('SELECT * FROM savings_goals WHERE id=? AND group_id=? AND plan_id IS NULL', [$id, $gid]);
        if (!$goal) Http::abort(404);
        $amt = Money::parse(self::str('amount'));
        if (!$amt) self::back("/g/$gid/goals", 'error', 'Enter a valid amount.');
        $r = Db::i()->tx(function () use ($gid, $id, $amt, $g) {
            Db::i()->val('SELECT id FROM financial_accounts WHERE group_id=? AND code=? FOR UPDATE', [$gid, '1000']);
            $earmarked = (int)Db::i()->val('SELECT COALESCE(SUM(a.amount_minor),0) FROM savings_goal_allocations a JOIN savings_goals s ON s.id=a.goal_id WHERE s.group_id=?', [$gid]);
            if (Ledger::balance($gid, '1000') - $earmarked < $amt) return false;
            Db::i()->insert('INSERT INTO savings_goal_allocations (goal_id,amount_minor,created_by,created_at) VALUES (?,?,?,?)', [$id, $amt, $g['user_id'], Clock::nowSql()]);
            Audit::log('goal.allocated', $gid, 'goal', $id, ['amount_minor' => $amt]);
            return true;
        });
        self::back("/g/$gid/goals", $r ? 'success' : 'error', $r ? 'Funds earmarked for this goal.' : 'Not enough unallocated group funds to earmark that amount.');
    }

    public static function announce(int $gid): void
    {
        $g = self::group($gid, 'announce.create');
        $title = mb_substr(self::str('title'), 0, 190);
        $body = self::str('body');
        if ($title === '' || $body === '') self::back("/g/$gid/announcements", 'error', 'Enter a title and a message.');
        $id = Db::i()->insert('INSERT INTO announcements (group_id,title,body,created_by,created_at) VALUES (?,?,?,?,?)', [$gid, $title, $body, $g['user_id'], Clock::nowSql()]);
        foreach (Db::i()->all("SELECT user_id FROM group_memberships WHERE group_id=? AND status='active'", [$gid]) as $m) {
            Notifications::send((int)$m['user_id'], $gid, 'announcements', $title, mb_substr($body, 0, 500), "/g/$gid/announcements", "ann:$id:" . $m['user_id']);
        }
        Audit::log('announcement.posted', $gid, 'announcement', $id);
        self::back("/g/$gid/announcements", 'success', 'Announcement posted and members notified.');
    }
}
