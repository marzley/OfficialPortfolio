<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Audit, Auth, Clock, Db, Http, Phone, Session, View};
use Akiba\Services\{ContributionEngine, GroupService, Notifications};

final class AccountController extends Ctl
{
    public static function groups(): void
    {
        $u = Auth::require();
        $rows = Db::i()->all("SELECT m.*, g.name, g.currency, g.timezone, g.status AS group_status FROM group_memberships m JOIN `groups` g ON g.id=m.group_id
                              WHERE m.user_id=? AND m.status IN ('active','pending') ORDER BY g.name", [$u['id']]);
        foreach ($rows as &$r) {
            $r['outstanding'] = $r['status'] === 'active' ? ContributionEngine::balance((int)$r['id'], Clock::today($r['timezone']))['outstanding_total'] : 0;
        }
        View::render('account/groups', ['groups' => $rows, 'title' => 'My groups', 'user' => $u]);
    }

    public static function newGroupForm(): void
    {
        $u = Auth::require();
        View::render('account/new_group', ['errors' => [], 'title' => 'Create a group', 'user' => $u]);
    }

    public static function newGroup(): void
    {
        $u = Auth::require();
        $r = GroupService::create((int)$u['id'], $_POST);
        if (!$r['ok']) {
            http_response_code(422);
            View::render('account/new_group', ['errors' => $r['errors'], 'title' => 'Create a group', 'user' => $u]);
            return;
        }
        self::back('/g/' . $r['group_id'] . '/plans', 'success', 'Group created. Next, set up your first contribution plan.');
    }

    public static function account(): void
    {
        $u = Auth::require();
        $db = Db::i();
        $prefs = [];
        foreach ($db->all('SELECT channel,category,enabled FROM notification_preferences WHERE user_id=?', [$u['id']]) as $p) $prefs[$p['category']][$p['channel']] = (int)$p['enabled'];
        $cur = hash('sha256', session_id());
        $sessions = $db->all('SELECT id,session_hash,ip,user_agent,last_seen_at FROM user_sessions WHERE user_id=? AND revoked_at IS NULL ORDER BY last_seen_at DESC LIMIT 20', [$u['id']]);
        foreach ($sessions as &$s) $s['current'] = hash_equals($s['session_hash'], $cur);
        View::render('account/account', ['u' => $u, 'prefs' => $prefs, 'sessions' => $sessions, 'title' => 'My account', 'user' => $u]);
    }

    public static function profile(): void
    {
        $u = Auth::require();
        $name = self::str('name');
        $phoneRaw = self::str('phone');
        $phone = $phoneRaw === '' ? null : Phone::normalize($phoneRaw);
        if (mb_strlen($name) < 2 || ($phoneRaw !== '' && !$phone)) self::back('/account', 'error', 'Enter your name and a valid Kenyan phone number.');
        try {
            Db::i()->exec('UPDATE users SET full_name=?, phone=? WHERE id=?', [$name, $phone, $u['id']]);
        } catch (\Throwable $e) {
            if (Db::isDuplicate($e)) self::back('/account', 'error', 'That phone number could not be saved. Use a different number.');
            throw $e;
        }
        self::back('/account', 'success', 'Profile updated.');
    }

    public static function password(): void
    {
        $u = Auth::require();
        $row = Db::i()->one('SELECT password_hash FROM users WHERE id=?', [$u['id']]);
        if (!password_verify((string)($_POST['current'] ?? ''), $row['password_hash'])) self::back('/account', 'error', 'Your current password is incorrect.');
        $new = (string)($_POST['password'] ?? '');
        if ($e = Auth::passwordError($new)) self::back('/account', 'error', $e);
        Auth::changePassword((int)$u['id'], $new);
        self::back('/account', 'success', 'Password changed. Other devices were signed out.');
    }

    public static function prefs(): void
    {
        $u = Auth::require();
        $in = $_POST['pref'] ?? [];
        foreach (['reminders', 'announcements'] as $cat) {
            foreach (['email', 'sms'] as $ch) {
                Db::i()->exec('INSERT INTO notification_preferences (user_id,channel,category,enabled) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE enabled=VALUES(enabled)',
                    [$u['id'], $ch, $cat, !empty($in[$cat][$ch]) ? 1 : 0]);
            }
        }
        self::back('/account', 'success', 'Preferences saved.');
    }

    public static function revokeSession(int $id): void
    {
        $u = Auth::require();
        Db::i()->exec('UPDATE user_sessions SET revoked_at=? WHERE id=? AND user_id=?', [Clock::nowSql(), $id, $u['id']]);
        self::back('/account', 'success', 'Device signed out.');
    }

    public static function notifications(): void
    {
        $u = Auth::require();
        $items = Db::i()->all('SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 100', [$u['id']]);
        View::render('account/notifications', ['items' => $items, 'title' => 'Notifications', 'user' => $u]);
    }

    public static function markRead(): void
    {
        $u = Auth::require();
        Db::i()->exec('UPDATE notifications SET read_at=? WHERE user_id=? AND read_at IS NULL', [Clock::nowSql(), $u['id']]);
        self::back('/notifications');
    }

    private static function invitation(string $token): ?array
    {
        return Db::i()->one('SELECT i.*, g.name AS group_name FROM group_invitations i JOIN `groups` g ON g.id=i.group_id WHERE i.token_hash=? AND i.accepted_at IS NULL AND i.expires_at>?', [hash('sha256', $token), Clock::nowSql()]);
    }

    public static function invite(string $token): void
    {
        $inv = self::invitation($token);
        if (!$inv) Http::abort(404, 'This invitation is invalid or has expired.');
        View::render('account/invite', ['inv' => $inv, 'token' => $token, 'user' => Auth::user(), 'title' => 'Invitation'], 'plain');
    }

    public static function acceptInvite(string $token): void
    {
        $u = Auth::require();
        $inv = self::invitation($token);
        if (!$inv || strtolower($u['email']) !== strtolower($inv['email'])) Http::abort(404, 'This invitation is invalid or was sent to a different email address.');
        Db::i()->tx(function () use ($inv, $u) {
            GroupService::addMember((int)$inv['group_id'], (int)$u['id'], $inv['role'], 'active');
            Db::i()->exec('UPDATE group_invitations SET accepted_at=? WHERE id=?', [Clock::nowSql(), $inv['id']]);
            Audit::log('member.joined', (int)$inv['group_id'], 'user', (int)$u['id'], ['role' => $inv['role']]);
        });
        self::back('/g/' . $inv['group_id'], 'success', 'Welcome to ' . $inv['group_name'] . '!');
    }
}
