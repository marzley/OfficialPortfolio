<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Audit, Auth, Clock, Db, Env, Http, View};
use Akiba\Payments\MpesaDriver;
use Akiba\Services\Ledger;

/** Platform console. Deliberately shows counts and health — never a group's private member balances or transactions. */
final class AdminController extends Ctl
{
    private static function admin(string $title, string $view, array $data = []): void
    {
        $u = Auth::requireSuperAdmin();
        View::render($view, $data + ['title' => $title, 'user' => $u, 'admin' => true], 'plain_admin');
    }

    public static function dashboard(): void
    {
        $db = Db::i();
        $day = Clock::now()->modify('-30 days')->format('Y-m-d H:i:s');
        $stats = [
            'Registered users' => $db->val('SELECT COUNT(*) FROM users'),
            'Active (signed in last 30 days)' => $db->val('SELECT COUNT(*) FROM users WHERE last_login_at>?', [$day]),
            'Groups' => $db->val('SELECT COUNT(*) FROM `groups`'),
            'Active groups' => $db->val("SELECT COUNT(*) FROM `groups` WHERE status='active'"),
            'Pending memberships' => $db->val("SELECT COUNT(*) FROM group_memberships WHERE status='pending'"),
            'Contribution plans' => $db->val("SELECT COUNT(*) FROM contribution_plans WHERE status='active'"),
            'Verified transactions' => $db->val("SELECT COUNT(*) FROM payment_transactions WHERE status='posted'"),
            'Payments awaiting reconciliation' => $db->val("SELECT COUNT(*) FROM payment_requests WHERE status IN ('pending','unknown','created')"),
            'Failed payments (30 days)' => $db->val("SELECT COUNT(*) FROM payment_requests WHERE status='failed' AND created_at>?", [$day]),
            'Failed notifications' => $db->val("SELECT COUNT(*) FROM notification_jobs WHERE status='failed'"),
        ];
        $lastJob = $db->one("SELECT MAX(finished_at) t FROM scheduled_job_logs WHERE job='generate_obligations'");
        $lastBackup = $db->one("SELECT * FROM backup_runs ORDER BY id DESC LIMIT 1");
        $health = [
            ['Background worker', $lastJob['t'] && strtotime($lastJob['t'] . ' UTC') > time() - 600, $lastJob['t'] ? 'Last run ' . $lastJob['t'] . ' UTC' : 'Never run — schedule bin/worker.php every minute'],
            ['Unbalanced ledger journals', count(Ledger::unbalancedJournals()) === 0, count(Ledger::unbalancedJournals()) . ' found'],
            ['Latest backup', $lastBackup && $lastBackup['status'] === 'ok' && $lastBackup['verified_at'] && strtotime($lastBackup['created_at'] . ' UTC') > time() - 86400 * 2, $lastBackup ? ($lastBackup['status'] . ', ' . $lastBackup['created_at'] . ' UTC' . ($lastBackup['verified_at'] ? ', verified' : ', NOT verified')) : 'No backup has ever been recorded'],
            ['Payment driver', true, Env::get('PAYMENT_DRIVER', 'sandbox') . (Env::isProduction() ? '' : ' (non-production)')],
        ];
        self::admin('Platform admin', 'admin/dashboard', ['stats' => $stats, 'health' => $health]);
    }

    public static function users(): void
    {
        $q = Http::str('q');
        $rows = Db::i()->all('SELECT id,full_name,email,phone,status,is_super_admin,last_login_at,created_at,(SELECT COUNT(*) FROM group_memberships m WHERE m.user_id=users.id) groups_n FROM users'
            . ($q ? ' WHERE full_name LIKE ? OR email LIKE ? OR phone LIKE ?' : '') . ' ORDER BY id DESC LIMIT 100', $q ? array_fill(0, 3, '%' . addcslashes($q, '%_') . '%') : []);
        self::admin('Users', 'admin/users', ['rows' => $rows, 'q' => $q]);
    }

    public static function userStatus(int $id): void
    {
        $me = Auth::requireSuperAdmin();
        $s = Http::str('status') === 'suspended' ? 'suspended' : 'active';
        if ($id === (int)$me['id']) self::back('/admin/users', 'error', 'You cannot change your own status.');
        Db::i()->exec('UPDATE users SET status=? WHERE id=?', [$s, $id]);
        if ($s === 'suspended') Db::i()->exec('UPDATE user_sessions SET revoked_at=? WHERE user_id=? AND revoked_at IS NULL', [Clock::nowSql(), $id]);
        Audit::log('admin.user_status', null, 'user', $id, ['status' => $s]);
        self::back('/admin/users', 'success', 'User ' . $s . '.');
    }

    public static function groups(): void
    {
        $rows = Db::i()->all("SELECT g.id,g.name,g.code,g.status,g.currency,g.created_at,u.full_name creator,
              (SELECT COUNT(*) FROM group_memberships m WHERE m.group_id=g.id AND m.status='active') members,
              (SELECT COUNT(*) FROM contribution_plans p WHERE p.group_id=g.id AND p.status='active') plans
              FROM `groups` g JOIN users u ON u.id=g.created_by ORDER BY g.id DESC LIMIT 100");
        self::admin('Groups', 'admin/groups', ['rows' => $rows]);
    }

    public static function groupStatus(int $id): void
    {
        Auth::requireSuperAdmin();
        $s = Http::str('status');
        if (!in_array($s, ['active', 'suspended'], true)) Http::abort(404);
        Db::i()->exec("UPDATE `groups` SET status=? WHERE id=? AND status IN ('active','suspended')", [$s, $id]);
        Audit::log('admin.group_status', $id, 'group', $id, ['status' => $s, 'reason' => Http::str('reason')]);
        self::back('/admin/groups', 'success', 'Group ' . $s . '. Financial history is untouched.');
    }

    public static function integrations(): void
    {
        $mask = fn(?string $v) => $v ? str_repeat('•', 8) . ' (set)' : 'not set';
        $items = [
            'Payment driver' => Env::get('PAYMENT_DRIVER', 'sandbox'),
            'M-PESA environment' => Env::get('MPESA_ENV', 'sandbox'),
            'Consumer key' => $mask(Env::get('MPESA_CONSUMER_KEY')), 'Consumer secret' => $mask(Env::get('MPESA_CONSUMER_SECRET')),
            'Shortcode' => Env::get('MPESA_SHORTCODE') ?: 'not set', 'Passkey' => $mask(Env::get('MPESA_PASSKEY')),
            'Callback secret' => $mask(Env::get('MPESA_CALLBACK_SECRET')), 'Callback URL (STK)' => rtrim((string)Env::get('APP_URL'), '/') . '/callbacks/mpesa/stk/<secret>',
            'Callback URL (C2B confirmation)' => rtrim((string)Env::get('APP_URL'), '/') . '/callbacks/mpesa/c2b/<secret>',
            'Verify with STK query' => Env::bool('MPESA_VERIFY_WITH_QUERY', true) ? 'yes' : 'NO — unsafe', 'Callback IP allowlist' => Env::get('MPESA_CALLBACK_IP_ALLOWLIST') ?: 'not set (recommended in production)',
            'Mail driver' => Env::get('MAIL_DRIVER', 'log') . (Env::get('MAIL_DRIVER', 'log') === 'log' ? ' (messages are NOT sent)' : ''), 'SMS driver' => Env::get('SMS_DRIVER', 'none'),
        ];
        $logs = Db::i()->all('SELECT * FROM integration_logs ORDER BY id DESC LIMIT 20');
        self::admin('Integrations', 'admin/integrations', ['items' => $items, 'logs' => $logs, 'configured' => MpesaDriver::configured()]);
    }

    public static function testMpesa(): void
    {
        Auth::requireSuperAdmin();
        if (!MpesaDriver::configured()) self::back('/admin/integrations', 'error', 'M-PESA credentials are not fully configured in the environment.');
        $r = (new MpesaDriver())->testConnection();
        Db::i()->exec('INSERT INTO integration_logs (integration,level,message,created_at) VALUES (?,?,?,?)', ['mpesa', $r['ok'] ? 'info' : 'error', mb_substr($r['message'], 0, 400), Clock::nowSql()]);
        self::back('/admin/integrations', $r['ok'] ? 'success' : 'error', $r['message']);
    }

    public static function jobs(): void
    {
        $db = Db::i();
        self::admin('Jobs & failures', 'admin/jobs', [
            'jobs' => $db->all('SELECT * FROM scheduled_job_logs ORDER BY id DESC LIMIT 40'),
            'failed' => $db->all("SELECT j.*, u.email FROM notification_jobs j JOIN users u ON u.id=j.user_id WHERE j.status='failed' ORDER BY j.id DESC LIMIT 50"),
            'skipped' => (int)$db->val("SELECT COUNT(*) FROM notification_jobs WHERE status='skipped'"),
        ]);
    }

    public static function retryJob(int $id): void
    {
        Auth::requireSuperAdmin();
        Db::i()->exec("UPDATE notification_jobs SET status='pending', attempts=0, next_attempt_at=? WHERE id=? AND status='failed'", [Clock::nowSql(), $id]);
        self::back('/admin/jobs', 'success', 'Job queued for retry.');
    }

    public static function backups(): void
    {
        self::admin('Backups', 'admin/backups', ['rows' => Db::i()->all('SELECT * FROM backup_runs ORDER BY id DESC LIMIT 30')]);
    }
}
