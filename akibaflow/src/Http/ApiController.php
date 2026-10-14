<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Access, Clock, Db, Http, Money};
use Akiba\Services\{ContributionEngine, PaymentService, ReportService, ScheduleEngine};

/** JSON endpoints. Session-authenticated, group-scoped, same permission checks as the HTML pages. */
final class ApiController extends Ctl
{
    public static function balance(int $gid): void
    {
        $g = Access::require($gid);
        $q = PaymentService::quote($g);
        Http::json(['group_id' => $gid, 'currency' => $g['currency'], 'as_of' => $q['today'], 'balance' => $q['balance'], 'options' => [
            'pay_today' => $q['pay_today'], 'clear_all' => $q['clear_all'], 'advance' => $q['advance'], 'max_custom' => $q['max_custom']]]);
    }

    public static function calendar(int $gid): void
    {
        $g = Access::require($gid);
        $month = preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', Http::str('month')) ? Http::str('month') : substr(Clock::today($g['timezone']), 0, 7);
        $first = $month . '-01';
        $last = date('Y-m-t', strtotime($first));
        $today = Clock::today($g['timezone']);
        $label = ['upcoming' => 'Soon', 'due' => 'Due', 'partially_paid' => 'Part', 'overdue' => 'Late', 'paid' => 'Paid', 'waived' => 'Waived', 'cancelled' => 'Void'];
        $rows = Db::i()->all('SELECT o.due_date, o.kind, o.original_minor, o.waived_minor, o.paid_minor, p.name plan, ' . ContributionEngine::statusSql('o') . " AS st
                              FROM contribution_obligations o JOIN contribution_plans p ON p.id=o.plan_id WHERE o.membership_id=? AND o.due_date BETWEEN ? AND ? ORDER BY o.due_date, o.kind, o.id",
            [$today, $today, $g['id'], $first, $last]);
        $items = [];
        foreach ($rows as $r) {
            $items[$r['due_date']][] = ['status' => $r['st'], 'label' => $label[$r['st']] ?? $r['st'], 'plan' => $r['plan'], 'kind' => $r['kind'], 'original' => (int)$r['original_minor'] - (int)$r['waived_minor'],
                'paid' => (int)$r['paid_minor'], 'outstanding' => max(0, (int)$r['original_minor'] - (int)$r['waived_minor'] - (int)$r['paid_minor'])];
        }
        // Future dates beyond what has been generated: show the schedule as "scheduled", clearly distinct from real obligations.
        Http::json(['title' => date('F Y', strtotime($first)), 'days' => (int)date('t', strtotime($first)), 'first_dow' => (int)date('N', strtotime($first)), 'today' => $today, 'currency' => $g['currency'], 'items' => $items]);
    }

    public static function paymentStatus(int $gid, string $ref): void
    {
        $g = Access::require($gid);
        $r = Db::i()->one('SELECT ref,status,result_desc,txn_id,amount_minor FROM payment_requests WHERE ref=? AND group_id=? AND membership_id=?', [$ref, $gid, $g['id']]);
        if (!$r) Http::json(['error' => 'Not found'], 404);
        Http::json(['ref' => $r['ref'], 'status' => $r['status'], 'result_desc' => $r['result_desc'], 'amount_minor' => (int)$r['amount_minor'],
            'receipt_url' => $r['txn_id'] ? "/g/$gid/receipts/" . $r['txn_id'] : null]);
    }

    public static function initiate(int $gid): void
    {
        $g = Access::require($gid);
        \Akiba\Core\Session::checkCsrf();
        $custom = Http::str('option') === 'custom' ? Money::parse(Http::str('custom_amount')) : null;
        try {
            $res = PaymentService::initiate($g, Http::str('option'), $custom, Http::str('phone'), Http::str('idempotency_key'));
        } catch (\RuntimeException $e) {
            error_log('[api pay] ' . $e->getMessage());
            Http::json(['error' => 'Payments are not available right now.'], 503);
        }
        if (!$res['ok']) Http::json(['error' => $res['error']], 422);
        $r = $res['request'];
        Http::json(['ref' => $r['ref'], 'status' => $r['status'], 'amount_minor' => (int)$r['amount_minor'], 'replayed' => $res['replayed'] ?? false], ($res['replayed'] ?? false) ? 200 : 201);
    }

    public static function collections(int $gid): void
    {
        $g = Access::require($gid, 'reports.view');
        $by = Http::str('by') === 'month' ? 'month' : 'day';
        $today = Clock::today($g['timezone']);
        $from = $by === 'month' ? date('Y-m-01', strtotime($today . ' -11 months')) : ScheduleEngine::addDays($today, -29);
        $rep = ReportService::collections($gid, $from, $today, $by);
        $pts = array_map(fn($r) => ['label' => $r[0], 'short' => $by === 'month' ? substr($r[0], 5) : substr($r[0], 8), 'amount' => $r[4]], $rep['rows']);
        Http::json(['currency' => $g['currency'], 'from' => $from, 'to' => $today, 'by' => $by, 'points' => $pts]);
    }
}
