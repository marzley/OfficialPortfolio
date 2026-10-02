---
slug: sessions-login
title: "Sessions and a secure login system: cookies, sessions, password hashing, registration, roles and protection against attacks"
after: KEEP
---
# Sessions and a secure login system: cookies, sessions, password hashing, registration, roles and protection against attacks

HTTP is **stateless**: each page request is independent, and the server doesn't automatically remember who you are. Yet websites keep you logged in, remember your cart and show your name on every page. They do it with **cookies** and **sessions**. This unit explains both, then builds a complete, secure login system: registration, password hashing, login, logout, protected pages, roles (admin vs user), and defences against the attacks that target logins.

Login systems are in almost every project: client portals, school systems, admin dashboards, SACCO member areas. Getting them right matters: a weak login exposes everyone's data.

:::note What you will learn
- Cookies vs sessions, and how sessions work
- Starting sessions and storing data
- Secure session settings
- Password hashing with password_hash and password_verify
- A users table design
- Registration with validation
- Login, session fixation protection and logout
- Protecting pages and admin-only areas (roles)
- Brute-force protection, password resets and "remember me"
- Two-factor authentication and other upgrades
:::

## Cookies

A **cookie** is a small piece of data the server asks the browser to store and send back with every request to that site.

```php
setcookie('theme', 'dark', [
    'expires' => time() + 60 * 60 * 24 * 30,   // 30 days
    'path' => '/',
    'secure' => true,      // only over HTTPS
    'httponly' => true,    // JavaScript can't read it
    'samesite' => 'Lax',   // not sent on most cross-site requests (CSRF protection)
]);
echo $_COOKIE['theme'] ?? 'light';
```

Cookies are stored on the user's device and **can be edited by the user**, so never store anything trusted in them (like "is_admin=1").

## Sessions

A **session** stores data **on the server**. The browser only holds a random **session ID** in a cookie (named `PHPSESSID` by default).

1. `session_start()` creates or resumes a session and sends the ID cookie.
2. You read and write `$_SESSION` like an array.
3. On the next request, the browser sends the ID; PHP loads that user's `$_SESSION`.

```php
<?php
session_start();
$_SESSION['cart'][101] = ($_SESSION['cart'][101] ?? 0) + 1;   // add product 101 to cart
echo 'Items in cart: ' . array_sum($_SESSION['cart']);
```

Call `session_start()` **before any output** (even a blank line before `<?php` breaks it with "headers already sent").

### Secure session settings

```php
<?php
session_set_cookie_params([
    'lifetime' => 0,          // until the browser closes
    'path' => '/',
    'secure' => true,         // HTTPS only (your site must use HTTPS)
    'httponly' => true,
    'samesite' => 'Lax',
]);
ini_set('session.use_strict_mode', '1');
session_start();
```

## Password hashing

**Never store passwords as plain text**, and never with fast hashes like MD5 or SHA-1. If your database leaks, attackers can crack those instantly. PHP's `password_hash()` uses slow, salted algorithms (bcrypt by default, Argon2 available) designed for passwords:

```try-php
<?php
$password = "Correct-Horse-Battery-42";
$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Stored hash: $hash\n";
echo "Length: " . strlen($hash) . "\n";

var_dump(password_verify("Correct-Horse-Battery-42", $hash));   // true
var_dump(password_verify("wrong-password", $hash));             // false

// Each hash is different (random salt), even for the same password:
echo password_hash($password, PASSWORD_DEFAULT) === $hash ? "same\n" : "different\n";
```

Store the hash in a `VARCHAR(255)` column. Use `password_needs_rehash()` at login to upgrade old hashes when PHP's defaults improve.

## The users table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  failed_logins INT NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Registration

```php
<?php
session_start();
require __DIR__ . '/db.php';

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // (check the CSRF token here – see the forms lesson)
    $name = trim($_POST['name'] ?? '');
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';

    if ($name === '') $errors[] = 'Name is required.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Enter a valid email.';
    if (strlen($password) < 10) $errors[] = 'Password must be at least 10 characters.';

    if (!$errors) {
        $stmt = db()->prepare('SELECT 1 FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors[] = 'An account with that email already exists.';
        }
    }
    if (!$errors) {
        $stmt = db()->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
        $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
        header('Location: login.php?registered=1');
        exit;
    }
}
```

Password rules: favour **length** (10–12+ characters; passphrases are great) over complicated symbol rules, and consider rejecting very common passwords ("password123", "12345678").

## Login

```php
<?php
session_start();
require __DIR__ . '/db.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';

    $stmt = db()->prepare('SELECT id, name, password_hash, role, failed_logins, locked_until FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && $user['locked_until'] && strtotime($user['locked_until']) > time()) {
        $error = 'Too many attempts. Try again in a few minutes.';
    } elseif ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);                 // stop session fixation
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['role'] = $user['role'];
        db()->prepare('UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = ?')->execute([$user['id']]);
        header('Location: dashboard.php');
        exit;
    } else {
        if ($user) {
            $fails = $user['failed_logins'] + 1;
            $lock = $fails >= 5 ? date('Y-m-d H:i:s', time() + 15 * 60) : null;
            db()->prepare('UPDATE users SET failed_logins = ?, locked_until = ? WHERE id = ?')
                ->execute([$fails >= 5 ? 0 : $fails, $lock, $user['id']]);
        }
        $error = 'Wrong email or password.';         // same message whether the email exists or not
    }
}
```

Key points:
- `password_verify` compares safely.
- `session_regenerate_id(true)` gives a fresh session ID at login, preventing **session fixation** (an attacker planting a known session ID).
- The error message doesn't reveal whether the email exists (stops **account enumeration**).
- Failed attempts lead to a temporary lock (**brute-force protection**). Rate limiting by IP address adds another layer.

## Protecting pages

```php
<?php
// auth.php – include at the top of every protected page
session_start();
if (empty($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

function require_admin(): void {
    if (($_SESSION['role'] ?? '') !== 'admin') {
        http_response_code(403);
        exit('Admins only.');
    }
}
```

```php
<?php
require __DIR__ . '/auth.php';
require_admin();                 // on admin pages
?>
<h1>Welcome, <?= htmlspecialchars($_SESSION['name']) ?></h1>
```

Always call `exit` after a redirect header; otherwise the rest of the page still runs and may leak data.

**Authorisation** matters as much as login: when a logged-in user opens `invoice.php?id=57`, check that invoice 57 belongs to **them** (`WHERE id = ? AND user_id = ?`). Forgetting this (called IDOR) lets users view others' data by changing the number.

## Logout

```php
<?php
session_start();
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', $p['secure'], $p['httponly']);
}
session_destroy();
header('Location: login.php');
exit;
```

Use a POST form (with a CSRF token) for logout buttons so other sites can't log your users out.

## Session timeout

```php
$timeout = 30 * 60; // 30 minutes of inactivity
if (isset($_SESSION['last_seen']) && time() - $_SESSION['last_seen'] > $timeout) {
    session_unset();
    session_destroy();
    header('Location: login.php?expired=1');
    exit;
}
$_SESSION['last_seen'] = time();
```

## Password reset (the safe way)

1. User enters their email; always show "If that account exists, we've sent a link" (no enumeration).
2. Generate a random token: `bin2hex(random_bytes(32))`; store only its **hash** with an expiry (e.g. 30–60 minutes).
3. Email a link containing the token.
4. When used: check the hash and expiry, let the user set a new password, delete the token, and end other sessions.

## "Remember me"

Don't store the user ID or password in a cookie. Store a long random token in an HttpOnly, Secure cookie and its **hash** in a `remember_tokens` table with an expiry; rotate it on use and delete it on logout.

## Going further

- **Two-factor authentication (2FA)**: a one-time code from an authenticator app (TOTP) or SMS/email codes for sensitive accounts.
- **Sign in with Google** (OAuth/OpenID Connect) using a well-maintained library; never put client secrets in front-end code.
- **Frameworks** like Laravel provide tested authentication (Breeze, Fortify) so you don't write it from scratch in big projects.

:::think A site stores `user_id=7` in a normal cookie and uses it to decide who is logged in. What's the problem, and what should it do?
Users can edit cookies: changing it to `user_id=1` would log them in as someone else (maybe the admin). Store only a random session ID in the cookie (PHP sessions) and keep `user_id` in `$_SESSION` on the server, set after verifying the password.
:::

## Summary

- HTTP is stateless; cookies live on the browser (editable), sessions live on the server with a random ID cookie.
- Start sessions before output; use Secure, HttpOnly, SameSite cookies and strict mode.
- Hash passwords with password_hash and check with password_verify; never store plain or MD5 passwords.
- On login: regenerate the session ID, use generic error messages, limit failed attempts; on logout destroy the session.
- Protect pages with an auth include, check roles and ownership (avoid IDOR); implement safe resets, remember-me tokens and 2FA.

```quiz
Q: Which PHP function hashes a password securely?
A: password_hash | password_hash()
Q: Which function checks a password against its hash?
A: password_verify | password_verify()
Q: Which function should you call right after a successful login to prevent session fixation?
A: session_regenerate_id | session_regenerate_id(true)
Q: Where is session data stored: on the server or in the browser?
A: server | on the server
Q: Which cookie flag stops JavaScript from reading a cookie?
A: HttpOnly | httponly
Q: Is MD5 acceptable for storing passwords? (yes/no)
A: no
```

**Learn more:** [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) · [PHP manual: password_hash](https://www.php.net/manual/en/function.password-hash.php)
