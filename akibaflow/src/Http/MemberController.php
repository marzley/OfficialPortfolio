<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Access, Audit, Clock, Db, Http, Money, Session, View};
use Akiba\Services\{AllocationService, ContributionEngine, PaymentService, ReportService};

final class MemberController extends Ctl
{
    public static function dashboard(int $gid): void
    {
        $g = self::group($gid);
        $today = self::today($g);
        $bal = ContributionEngine::balance((int)$g['id'], $today);
        $db = Db::i();
        $statusSql = ContributionEngine::statusSql('o');
        $open = $db->all("SELECT o.*, p.name plan_name, (o.original_minor-o.waived_minor-o.paid_minor) outstanding_minor, $statusSql AS display_status
                          FROM contribution_obligations o JOIN contribution_plans p ON p.id=o.plan_id
                          WHERE o.membership_id=? AND o.status='open' AND o.due_date<=? ORDER BY o.due_date, o.id LIMIT 8", [$today, $today, $g['id'], $today]);
        $recent = $db->all('SELECT * FROM payment_transactions WHERE membership_id=? ORDER BY id DESC LIMIT 5', [$g['id']]);
        $pending = $db->one("SELECT * FROM payment_requests WHERE membership_id=? AND status IN ('pending','created','unknown') AND created_at>? ORDER BY id DESC LIMIT 1", [$g['id'], Clock::now()->modify('-1 day')->format('Y-m-d H:i:s')]);
        $lastReq = $db->one("SELECT * FROM payment_requests WHERE membership_id=? ORDER BY id DESC LIMIT 1", [$g['id']]);
        $plans = $db->all("SELECT p.id,p.name,v.amount_minor,v.frequency,v.weekday,v.month_day,v.interval_days,v.anchor_date FROM contribution_plans p
                           JOIN contribution_plan_members pm ON pm.plan_id=p.id AND pm.membership_id=? AND (pm.to_date IS NULL OR pm.to_date>=?)
                           JOIN contribution_plan_versions v ON v.id=(SELECT id FROM contribution_plan_versions WHERE plan_id=p.id AND effective_from<=? ORDER BY effective_from DESC, version_no DESC LIMIT 1)
                           WHERE p.status='active'", [$g['id'], $today, $today]);
        $admin = $db->one('SELECT contact_email, contact_phone FROM `groups` WHERE id=?', [$gid]);
        self::page('member/dashboard', ['bal' => $bal, 'open' => $open, 'recent' => $recent, 'pending' => $pending, 'lastReq' => $lastReq, 'plans' => $plans, 'today' => $today,
            'next' => ContributionEngine::nextContributionDate((int)$g['id'], $today), 'contact' => $admin], 'me', 'My dashboard');
    }

    public static function payForm(int $gid): void
    {
        $g = self::group($gid);
        $q = PaymentService::quote($g);
        $phone = \Akiba\Core\Auth::user()['phone'] ?? '';
        self::page('member/pay', ['q' => $q, 'phone' => $phone, 'idem' => bin2hex(random_bytes(12)), 'errors' => [],
            'sandbox' => \Akiba\Core\Env::get('PAYMENT_DRIVER', 'sandbox') === 'sandbox' && !\Akiba\Core\Env::isProduction()], 'pay', 'Contribute now');
    }

    public static function pay(int $gid): void
    {
        $g = self::group($gid);
        $option = self::str('option');
        $custom = $option === 'custom' ? Money::parse(self::str('custom_amount')) : null;
        if ($option === 'custom' && !$custom) self::back("/g/$gid/pay", 'error', 'Enter a valid amount (up to 2 decimals).');
        try {
            $res = PaymentService::initiate($g, $option, $custom, self::str('phone'), self::str('idem'));
        } catch (\RuntimeException $e) {
            error_log('[pay] ' . $e->getMessage());
            self::back("/g/$gid/pay", 'error', 'Payments are not available right now. Please contact your group administrator.');
        }
        if (!$res['ok']) self::back("/g/$gid/pay", 'error', $res['error']);
        Http::redirect("/g/$gid/pay/" . $res['request']['ref']);
    }

    public static function payStatus(int $gid, string $ref): void
    {
        $g = self::group($gid);
        $req = Db::i()->one('SELECT * FROM payment_requests WHERE ref=? AND group_id=? AND membership_id=?', [$ref, $gid, $g['id']]);
        if (!$req) Http::abort(404);
        self::page('member/pay_status', ['req' => $req, 'sandbox' => $req['provider'] === 'sandbox'], 'pay', 'Payment status');
    }

    public static function applyCredit(int $gid): void
    {
        $g = self::group($gid);
        $applied = Db::i()->tx(fn() => AllocationService::applyCredit($gid, (int)$g['id'], self::today($g), false, (int)$g['user_id']));
        self::back("/g/$gid", $applied ? 'success' : 'info', $applied ? 'Applied ' . money($applied, $g['currency']) . ' of your credit to your dues.' : 'There is no credit to apply or nothing is due.');
    }

    public static function history(int $gid): void
    {
        $g = self::group($gid);
        $today = self::today($g);
        $f = ['plan_id' => self::intval('plan'), 'from' => self::str('from'), 'to' => self::str('to'), 'status' => self::str('status')];
        $page = max(1, self::intval('page'));
        $rows = ContributionEngine::obligations((int)$g['id'], $today, $f, 31, ($page - 1) * 30);
        $more = count($rows) > 30;
        $rows = array_slice($rows, 0, 30);
        $plans = Db::i()->all('SELECT DISTINCT p.id,p.name FROM contribution_plans p JOIN contribution_obligations o ON o.plan_id=p.id WHERE o.membership_id=?', [$g['id']]);
        self::page('member/history', ['rows' => $rows, 'f' => $f, 'plans' => $plans, 'page' => $page, 'more' => $more], 'history', 'Contribution history');
    }

    public static function calendar(int $gid): void
    {
        $g = self::group($gid);
        $month = preg_match('/^\d{4}-\d{2}$/', self::str('month')) ? self::str('month') : substr(self::today($g), 0, 7);
        self::page('member/calendar', ['month' => $month], 'calendar', 'Contribution calendar');
    }

    public static function receipts(int $gid): void
    {
        $g = self::group($gid);
        $rows = Db::i()->all('SELECT * FROM payment_transactions WHERE membership_id=? ORDER BY id DESC LIMIT 100', [$g['id']]);
        self::page('member/receipts', ['rows' => $rows, 'to' => date('Y-m-d'), 'from' => date('Y-01-01')], 'receipts', 'Receipts');
    }

    public static function receipt(int $gid, int $id): void
    {
        $g = self::group($gid);
        $t = Db::i()->one('SELECT t.*, u.full_name, m.member_code, gr.name gname FROM payment_transactions t JOIN group_memberships m ON m.id=t.membership_id JOIN users u ON u.id=m.user_id JOIN `groups` gr ON gr.id=t.group_id WHERE t.id=? AND t.group_id=?', [$id, $gid]);
        if (!$t) Http::abort(404);
        $target = Db::i()->one('SELECT * FROM group_memberships WHERE id=?', [$t['membership_id']]);
        if (!Access::canViewMemberFinance($g, $target)) Http::abort(404);
        $alloc = Db::i()->all("SELECT a.*, o.due_date, o.kind, p.name plan_name FROM payment_allocations a LEFT JOIN contribution_obligations o ON o.id=a.obligation_id LEFT JOIN contribution_plans p ON p.id=o.plan_id WHERE a.txn_id=? ORDER BY o.due_date, a.id", [$id]);
        self::page('member/receipt', ['t' => $t, 'alloc' => $alloc], 'receipts', 'Receipt ' . $t['receipt_no']);
    }

    public static function statement(int $gid): void
    {
        $g = self::group($gid);
        $mid = (int)$g['id'];
        if (self::intval('member') && Access::can($g, 'obligations.view_all')) {
            $mid = (int)Access::memberInGroup($gid, self::intval('member'))['id'];
            Audit::log('statement.viewed', $gid, 'membership', $mid);
        }
        $to = self::dateOr('to', self::today($g));
        $from = self::dateOr('from', substr($to, 0, 4) . '-01-01');
        $rep = ReportService::memberStatement($mid, $from, $to);
        if (self::str('format') === 'csv') {
            Audit::log('statement.exported', $gid, 'membership', $mid, ['from' => $from, 'to' => $to]);
            ReportService::csv($rep, "statement_{$from}_{$to}.csv");
        }
        self::page('reports/view', ['rep' => $rep, 'from' => $from, 'to' => $to, 'base' => "/g/$gid/statement" . ($mid !== (int)$g['id'] ? '?member=' . $mid : ''), 'hasDates' => true, 'csvUrl' => true], 'receipts', 'Statement');
    }

    public static function goals(int $gid): void
    {
        $g = self::group($gid);
        $goals = Db::i()->all('SELECT * FROM savings_goals WHERE group_id=? ORDER BY status, id DESC', [$gid]);
        foreach ($goals as &$goal) {
            $goal['progress'] = $goal['plan_id']
                ? (int)Db::i()->val("SELECT COALESCE(SUM(a.amount_minor),0) FROM payment_allocations a JOIN contribution_obligations o ON o.id=a.obligation_id WHERE o.plan_id=? AND a.reversed_at IS NULL AND a.kind='obligation'", [$goal['plan_id']])
                : 0;
            $goal['progress'] += (int)Db::i()->val('SELECT COALESCE(SUM(amount_minor),0) FROM savings_goal_allocations WHERE goal_id=?', [$goal['id']]);
        }
        $plans = Db::i()->all('SELECT id,name FROM contribution_plans WHERE group_id=?', [$gid]);
        self::page('member/goals', ['goals' => $goals, 'plans' => $plans], 'goals', 'Savings goals');
    }

    public static function announcements(int $gid): void
    {
        self::group($gid);
        $rows = Db::i()->all('SELECT a.*, u.full_name FROM announcements a JOIN users u ON u.id=a.created_by WHERE a.group_id=? ORDER BY a.id DESC LIMIT 50', [$gid]);
        self::page('member/announcements', ['rows' => $rows], 'announcements', 'Announcements');
    }
}
