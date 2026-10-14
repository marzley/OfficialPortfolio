<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Auth, Clock, Db, Env, Http, Session, View};
use Akiba\Services\Notifications;

final class AuthController extends Ctl
{
    public static function landing(): void
    {
        if (Auth::user()) Http::redirect('/groups');
        View::render('auth/landing', ['title' => 'Akiba Yako, Maendeleo Yako'], 'plain');
    }

    public static function loginForm(): void
    {
        if (Auth::user()) Http::redirect('/groups');
        View::render('auth/login', ['title' => 'Sign in', 'errors' => []], 'plain');
    }

    public static function login(): void
    {
        $email = self::str('email');
        $res = Auth::attempt($email, (string)($_POST['password'] ?? ''));
        if (!$res['ok']) {
            http_response_code(401);
            View::render('auth/login', ['title' => 'Sign in', 'errors' => ['form' => $res['error']]], 'plain');
            return;
        }
        $to = $_SESSION['_intended'] ?? '/groups';
        unset($_SESSION['_intended']);
        Http::redirect(preg_match('#^/[^/\\\\]#', $to) || $to === '/' ? $to : '/groups'); // same-site relative redirects only
    }

    public static function registerForm(): void
    {
        View::render('auth/register', ['title' => 'Create account', 'errors' => []], 'plain');
    }

    public static function register(): void
    {
        $r = Auth::register(self::str('name'), self::str('email'), self::str('phone'), (string)($_POST['password'] ?? ''));
        if (!$r['ok']) {
            http_response_code(422);
            View::render('auth/register', ['title' => 'Create account', 'errors' => $r['errors']], 'plain');
            return;
        }
        $link = rtrim((string)Env::get('APP_URL', ''), '/') . '/verify/' . $r['verify_token'];
        Notifications::send($r['user_id'], null, 'security', 'Verify your email', "Welcome to AkibaFlow. Confirm your email address: $link", '/verify/' . $r['verify_token'], 'verify:' . $r['user_id'], ['email']);
        Auth::establish($r['user_id']);
        self::back('/groups', 'success', 'Account created. We sent a verification link to your email.');
    }

    public static function logout(): void
    {
        Auth::logout();
        Session::start();
        Http::redirect('/');
    }

    public static function verify(string $token): void
    {
        $uid = Auth::consumeToken($token, 'email_verify');
        if ($uid) Db::i()->exec('UPDATE users SET email_verified_at=? WHERE id=?', [Clock::nowSql(), $uid]);
        self::back(Auth::user() ? '/groups' : '/login', $uid ? 'success' : 'error', $uid ? 'Email verified. Thank you!' : 'That verification link is invalid or has expired.');
    }

    public static function forgotForm(): void
    {
        View::render('auth/forgot', ['title' => 'Reset password', 'sent' => false], 'plain');
    }

    public static function forgot(): void
    {
        $email = strtolower(self::str('email'));
        $u = Db::i()->one("SELECT id FROM users WHERE email=? AND status='active'", [$email]);
        Db::i()->exec('INSERT INTO auth_events (user_id,identifier,ip,event,created_at) VALUES (?,?,?,?,?)', [$u['id'] ?? null, $email, Http::ip(), 'reset_request', Clock::nowSql()]);
        $recent = (int)Db::i()->val("SELECT COUNT(*) FROM auth_events WHERE (identifier=? OR ip=?) AND event='reset_request' AND created_at>?", [$email, Http::ip(), Clock::now()->modify('-1 hour')->format('Y-m-d H:i:s')]);
        if ($u && $recent <= 5) {
            $t = Auth::issueToken((int)$u['id'], 'password_reset', 60);
            Notifications::send((int)$u['id'], null, 'security', 'Reset your password', 'Use this link within 60 minutes: ' . rtrim((string)Env::get('APP_URL', ''), '/') . '/reset/' . $t . ' — if you did not ask for this, ignore this message.', null, 'reset:' . bin2hex(random_bytes(6)), ['email']);
        }
        // Same response whether or not the account exists.
        View::render('auth/forgot', ['title' => 'Reset password', 'sent' => true], 'plain');
    }

    public static function resetForm(string $token): void
    {
        View::render('auth/reset', ['title' => 'Choose a new password', 'token' => $token, 'errors' => []], 'plain');
    }

    public static function reset(string $token): void
    {
        $pw = (string)($_POST['password'] ?? '');
        if ($e = Auth::passwordError($pw)) {
            http_response_code(422);
            View::render('auth/reset', ['title' => 'Choose a new password', 'token' => $token, 'errors' => ['password' => $e]], 'plain');
            return;
        }
        $uid = Auth::consumeToken($token, 'password_reset');
        if (!$uid) self::back('/forgot', 'error', 'That reset link is invalid or has expired. Request a new one.');
        Db::i()->exec('UPDATE users SET password_hash=? WHERE id=?', [password_hash($pw, PASSWORD_DEFAULT), $uid]);
        Db::i()->exec('UPDATE user_sessions SET revoked_at=? WHERE user_id=? AND revoked_at IS NULL', [Clock::nowSql(), $uid]);
        self::back('/login', 'success', 'Password updated. Sign in with your new password.');
    }
}
