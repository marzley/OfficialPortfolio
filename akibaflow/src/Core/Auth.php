<?php
declare(strict_types=1);
namespace Akiba\Core;

final class Auth
{
    private static ?array $user = null;
    private static bool $loaded = false;

    public static function id(): ?int
    {
        $u = self::user();
        return $u ? (int)$u['id'] : null;
    }

    public static function user(): ?array
    {
        if (self::$loaded) return self::$user;
        self::$loaded = true;
        if (PHP_SAPI === 'cli' || empty($_SESSION['uid'])) return null;
        $db = Db::i();
        $u = $db->one('SELECT id,email,phone,full_name,status,is_super_admin,email_verified_at FROM users WHERE id=?', [$_SESSION['uid']]);
        $sess = $db->one('SELECT id,revoked_at FROM user_sessions WHERE session_hash=?', [hash('sha256', session_id())]);
        if (!$u || $u['status'] !== 'active' || !$sess || $sess['revoked_at'] !== null) {
            $_SESSION = [];
            return null;
        }
        $db->exec('UPDATE user_sessions SET last_seen_at=? WHERE id=?', [Clock::nowSql(), $sess['id']]);
        return self::$user = $u;
    }

    public static function require(): array
    {
        $u = self::user();
        if (!$u) {
            if (Http::wantsJson()) Http::json(['error' => 'Authentication required'], 401);
            $_SESSION['_intended'] = $_SERVER['REQUEST_URI'] ?? '/';
            Http::redirect('/login');
        }
        return $u;
    }

    public static function requireSuperAdmin(): array
    {
        $u = self::require();
        if (!(int)$u['is_super_admin']) Http::abort(403);
        return $u;
    }

    // ---------- registration / login ----------

    /** @return array{ok:bool, errors:array, user_id?:int, verify_token?:string} */
    public static function register(string $name, string $email, string $phone, string $password): array
    {
        $errors = [];
        $name = trim($name);
        $email = strtolower(trim($email));
        if (mb_strlen($name) < 2) $errors['name'] = 'Enter your full name.';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email address.';
        $p = $phone === '' ? null : Phone::normalize($phone);
        if ($phone !== '' && !$p) $errors['phone'] = 'Enter a valid Kenyan phone number (e.g. 0712 345 678).';
        if ($e = self::passwordError($password)) $errors['password'] = $e;
        if ($errors) return ['ok' => false, 'errors' => $errors];

        $db = Db::i();
        try {
            $uid = $db->insert(
                'INSERT INTO users (email, phone, full_name, password_hash, created_at) VALUES (?,?,?,?,?)',
                [$email, $p, $name, password_hash($password, PASSWORD_DEFAULT), Clock::nowSql()]
            );
        } catch (\Throwable $e) {
            if (Db::isDuplicate($e)) {
                // Do not reveal which identifier exists (account enumeration).
                return ['ok' => false, 'errors' => ['email' => 'We could not create an account with these details. If you already registered, sign in or reset your password.']];
            }
            throw $e;
        }
        $db->exec('INSERT INTO auth_events (user_id,identifier,ip,event,created_at) VALUES (?,?,?,?,?)', [$uid, $email, Http::ip(), 'register', Clock::nowSql()]);
        $token = self::issueToken($uid, 'email_verify', 60 * 24 * 3);
        return ['ok' => true, 'errors' => [], 'user_id' => $uid, 'verify_token' => $token];
    }

    public static function passwordError(string $pw): ?string
    {
        if (strlen($pw) < 10) return 'Use at least 10 characters.';
        if (!preg_match('/[A-Za-z]/', $pw) || !preg_match('/\d/', $pw)) return 'Include both letters and numbers.';
        return null;
    }

    public static function issueToken(int $uid, string $type, int $minutes): string
    {
        $raw = bin2hex(random_bytes(32));
        Db::i()->exec('UPDATE user_tokens SET used_at=? WHERE user_id=? AND type=? AND used_at IS NULL', [Clock::nowSql(), $uid, $type]);
        Db::i()->insert(
            'INSERT INTO user_tokens (user_id,type,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)',
            [$uid, $type, hash('sha256', $raw), Clock::now()->modify("+$minutes minutes")->format('Y-m-d H:i:s'), Clock::nowSql()]
        );
        return $raw;
    }

    public static function consumeToken(string $raw, string $type): ?int
    {
        $db = Db::i();
        return $db->tx(function () use ($db, $raw, $type) {
            $t = $db->one('SELECT id,user_id FROM user_tokens WHERE token_hash=? AND type=? AND used_at IS NULL AND expires_at>? FOR UPDATE',
                [hash('sha256', $raw), $type, Clock::nowSql()]);
            if (!$t) return null;
            $db->exec('UPDATE user_tokens SET used_at=? WHERE id=?', [Clock::nowSql(), $t['id']]);
            return (int)$t['user_id'];
        });
    }

    public static function throttled(string $email): bool
    {
        $since = Clock::now()->modify('-15 minutes')->format('Y-m-d H:i:s');
        $db = Db::i();
        $byId = (int)$db->val("SELECT COUNT(*) FROM auth_events WHERE identifier=? AND event='login_fail' AND created_at>?", [strtolower($email), $since]);
        $byIp = (int)$db->val("SELECT COUNT(*) FROM auth_events WHERE ip=? AND event='login_fail' AND created_at>?", [Http::ip(), $since]);
        return $byId >= 5 || $byIp >= 20;
    }

    /** @return array{ok:bool, error?:string} */
    public static function attempt(string $email, string $password): array
    {
        $email = strtolower(trim($email));
        $db = Db::i();
        if (self::throttled($email)) return ['ok' => false, 'error' => 'Too many failed attempts. Please wait 15 minutes and try again.'];
        $u = $db->one('SELECT * FROM users WHERE email=?', [$email]);
        // Always run a hash verification to keep timing similar for unknown emails.
        $hash = $u['password_hash'] ?? '$2y$10$usesomesillystringforsaltuQZ8gPz2wJ3m5yFhD0dCq1m8m6mO3e6e';
        $good = password_verify($password, $hash);
        if (!$u || !$good || $u['status'] !== 'active') {
            $db->exec('INSERT INTO auth_events (user_id,identifier,ip,event,created_at) VALUES (?,?,?,?,?)', [$u['id'] ?? null, $email, Http::ip(), 'login_fail', Clock::nowSql()]);
            return ['ok' => false, 'error' => ($u && $good && $u['status'] !== 'active') ? 'This account is suspended. Contact support.' : 'Incorrect email or password.'];
        }
        if (password_needs_rehash($u['password_hash'], PASSWORD_DEFAULT)) {
            $db->exec('UPDATE users SET password_hash=? WHERE id=?', [password_hash($password, PASSWORD_DEFAULT), $u['id']]);
        }
        self::establish((int)$u['id']);
        return ['ok' => true];
    }

    public static function establish(int $uid): void
    {
        $db = Db::i();
        session_regenerate_id(true);
        $_SESSION['uid'] = $uid;
        $_SESSION['_csrf'] = bin2hex(random_bytes(32));
        $db->insert('INSERT INTO user_sessions (user_id,session_hash,ip,user_agent,created_at,last_seen_at) VALUES (?,?,?,?,?,?)',
            [$uid, hash('sha256', session_id()), Http::ip(), substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250), Clock::nowSql(), Clock::nowSql()]);
        $db->exec('UPDATE users SET last_login_at=? WHERE id=?', [Clock::nowSql(), $uid]);
        $db->exec('INSERT INTO auth_events (user_id,identifier,ip,event,created_at) VALUES (?,?,?,?,?)', [$uid, null, Http::ip(), 'login_ok', Clock::nowSql()]);
        self::$loaded = false;
    }

    public static function logout(): void
    {
        if (!empty($_SESSION['uid'])) {
            Db::i()->exec('UPDATE user_sessions SET revoked_at=? WHERE session_hash=?', [Clock::nowSql(), hash('sha256', session_id())]);
            Db::i()->exec('INSERT INTO auth_events (user_id,ip,event,created_at) VALUES (?,?,?,?)', [$_SESSION['uid'], Http::ip(), 'logout', Clock::nowSql()]);
        }
        $_SESSION = [];
        session_destroy();
        self::$loaded = false;
        self::$user = null;
    }

    public static function changePassword(int $uid, string $new): void
    {
        $db = Db::i();
        $db->exec('UPDATE users SET password_hash=? WHERE id=?', [password_hash($new, PASSWORD_DEFAULT), $uid]);
        // sign out every other session
        $db->exec('UPDATE user_sessions SET revoked_at=? WHERE user_id=? AND revoked_at IS NULL AND session_hash<>?',
            [Clock::nowSql(), $uid, hash('sha256', session_id())]);
        $db->exec('INSERT INTO auth_events (user_id,ip,event,created_at) VALUES (?,?,?,?)', [$uid, Http::ip(), 'password_changed', Clock::nowSql()]);
    }
}
