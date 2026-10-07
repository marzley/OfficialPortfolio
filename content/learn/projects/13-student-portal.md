---
slug: student-portal
title: "Project 12: Student portal (secure login, unit registration, results, fee statement)"
after: school-management-system
---
# Project 12: Student portal

Every Kenyan university and college student knows the student portal: log in with your registration number, register for units, check your fee balance, see exam results, print an exam card. In this project you build one, focusing on what makes portals hard: **secure authentication, account recovery, rules that depend on data (fee clearance, prerequisites, deadlines), and a fast, clear dashboard** that survives thousands of students logging in on results day.

It pairs naturally with the [school management system](./?track=projects&lesson=school-management-system) (the staff side); this project is the **student side** for a college or university.

**You'll practise:** authentication done properly (hashing, rate limiting, password reset tokens, sessions), authorisation, business rules, PDF documents, performance and caching.

**Lessons you need:** [sessions and login](./?track=php&lesson=sessions-login), [auth: passwords and tokens](./?track=apis-backend&lesson=auth-passwords-tokens), [passwords and 2FA](./?track=cybersecurity&lesson=passwords-2fa), [indexes and transactions](./?track=sql&lesson=indexes-transactions), [the blog project](./?track=projects&lesson=blog-cms).

## Step 1: Features

| Feature | Rule |
|---|---|
| Log in with registration number + password | Lock out after repeated failures; generic error messages |
| First login / forgot password | One-time reset link or code sent to the student's registered email or phone |
| Dashboard | Name, programme, year/semester, fee balance, registration status, announcements |
| Unit registration | Only during the registration window; only units offered for their programme and semester; prerequisites passed; maximum credit load; fee threshold met |
| Results | Only published results; per semester; GPA or weighted average |
| Fee statement | Invoices and payments with running balance; download PDF |
| Exam card | Only if registered for units and fees cleared to the required level |
| Profile | Update phone, email and photo; change password |

## Step 2: Database (core tables)

```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY, reg_no VARCHAR(30) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE, phone VARCHAR(15), programme_id INT NOT NULL, year_of_study TINYINT NOT NULL,
  password_hash VARCHAR(255) NULL, failed_logins INT NOT NULL DEFAULT 0, locked_until DATETIME NULL
);
CREATE TABLE units (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(15) NOT NULL UNIQUE, title VARCHAR(150) NOT NULL, credits TINYINT NOT NULL);
CREATE TABLE unit_offerings (id INT AUTO_INCREMENT PRIMARY KEY, unit_id INT NOT NULL, programme_id INT NOT NULL, semester_id INT NOT NULL, year_of_study TINYINT NOT NULL);
CREATE TABLE prerequisites (unit_id INT NOT NULL, requires_unit_id INT NOT NULL, PRIMARY KEY (unit_id, requires_unit_id));
CREATE TABLE registrations (student_id INT NOT NULL, offering_id INT NOT NULL, registered_at DATETIME NOT NULL, PRIMARY KEY (student_id, offering_id));
CREATE TABLE results (student_id INT NOT NULL, unit_id INT NOT NULL, semester_id INT NOT NULL, score TINYINT NOT NULL, grade CHAR(2) NOT NULL, published TINYINT NOT NULL DEFAULT 0, PRIMARY KEY (student_id, unit_id, semester_id));
CREATE TABLE semesters (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40) NOT NULL, reg_opens DATETIME NOT NULL, reg_closes DATETIME NOT NULL, fee_threshold_pct TINYINT NOT NULL DEFAULT 50);
CREATE TABLE fee_entries (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, semester_id INT NULL, kind ENUM('invoice','payment') NOT NULL, amount INT NOT NULL, reference VARCHAR(40) NULL UNIQUE, created_at DATETIME NOT NULL);
CREATE TABLE password_resets (student_id INT NOT NULL, token_hash CHAR(64) NOT NULL UNIQUE, expires_at DATETIME NOT NULL, used TINYINT NOT NULL DEFAULT 0);
```

Fees as a **ledger** (invoices and payments as rows) give you a full statement and a correct balance: `SUM(invoices) − SUM(payments)`.

## Step 3: Authentication done properly

### Login with lockout

```php
$stmt = $pdo->prepare('SELECT * FROM students WHERE reg_no = ?');
$stmt->execute([strtoupper(trim($_POST['reg_no'] ?? ''))]);
$s = $stmt->fetch();
if ($s && $s['locked_until'] && strtotime($s['locked_until']) > time()) {
    exit('Too many attempts. Try again in 15 minutes or reset your password.');
}
if ($s && $s['password_hash'] && password_verify($_POST['password'] ?? '', $s['password_hash'])) {
    $pdo->prepare('UPDATE students SET failed_logins = 0, locked_until = NULL WHERE id = ?')->execute([$s['id']]);
    if (password_needs_rehash($s['password_hash'], PASSWORD_DEFAULT)) { /* re-hash and save */ }
    session_regenerate_id(true);
    $_SESSION['student_id'] = $s['id'];
    header('Location: dashboard.php'); exit;
}
if ($s) {
    $pdo->prepare('UPDATE students SET failed_logins = failed_logins + 1,
                   locked_until = IF(failed_logins + 1 >= 5, NOW() + INTERVAL 15 MINUTE, NULL) WHERE id = ?')->execute([$s['id']]);
}
$error = 'Wrong registration number or password.';
```

### Password reset tokens

The secure pattern, used by most big websites:
1. Student enters their registration number. **Always** show the same message ("If that account exists, we've sent a reset link to its registered email"), so attackers can't discover which numbers exist.
2. Generate a random token, email/SMS it, and store only its **hash** with a short expiry (30 minutes).
3. When the link is opened, hash the token from the URL, find an unused, unexpired match, let them set a new password, mark the token used, and end other sessions.

Here's the token logic. Run it to see why we store a hash: even someone who steals the database can't use the tokens.

```try-php
<?php
function make_reset_token(): array {
    $token = bin2hex(random_bytes(32));             // goes in the email link, never stored
    return [$token, hash('sha256', $token)];        // only the hash is saved in the database
}

[$token, $hash] = make_reset_token();
echo "Link:   https://portal.example.ac.ke/reset.php?token=" . substr($token, 0, 16) . "...\n";
echo "Stored: " . substr($hash, 0, 16) . "...\n";

// Later, when the student clicks the link:
$fromUrl = $token;
echo hash_equals($hash, hash('sha256', $fromUrl)) ? "Token matches: allow a new password\n" : "Invalid token\n";
echo hash_equals($hash, hash('sha256', 'guessed-token')) ? "matches\n" : "A guessed token fails\n";

// Password rules: length beats complexity. Check against common passwords too.
function password_ok(string $p): bool {
    $common = ['password', '12345678', 'qwerty123', 'kenya2026', 'password1'];
    return strlen($p) >= 10 && !in_array(strtolower($p), $common, true);
}
var_dump(password_ok('kenya2026'), password_ok('Mt Kenya sunrise 4 me'));
```

Optional but excellent: **two-factor authentication** for students (an authenticator app code) and mandatory 2FA for staff accounts.

## Step 4: Unit registration rules

All rules checked on the server, in one place, when the student clicks "Register":

```php
function can_register(PDO $pdo, array $student, array $semester, array $offeringIds): array {
    $errors = [];
    $now = time();
    if ($now < strtotime($semester['reg_opens']) || $now > strtotime($semester['reg_closes'])) $errors[] = 'Registration is closed.';
    // fee threshold: paid at least X% of this semester's invoice
    $f = $pdo->prepare("SELECT SUM(CASE WHEN kind = 'invoice' AND semester_id = ? THEN amount ELSE 0 END) AS inv_this,
                               SUM(CASE WHEN kind = 'invoice' AND NOT (semester_id <=> ?) THEN amount ELSE 0 END) AS inv_other,
                               SUM(CASE WHEN kind = 'payment' THEN amount ELSE 0 END) AS paid
                        FROM fee_entries WHERE student_id = ?");
    $f->execute([$semester['id'], $semester['id'], $student['id']]);
    $fees = $f->fetch();
    $paidForThis = $fees['paid'] - $fees['inv_other'];          // payments clear older invoices first
    $needed = $fees['inv_this'] * $semester['fee_threshold_pct'] / 100;
    if ($fees['inv_this'] > 0 && $paidForThis < $needed) {
        $errors[] = 'Pay at least ' . $semester['fee_threshold_pct'] . '% of this semester\'s fees to register (KSh '
                  . number_format($needed - $paidForThis) . ' more).';
    }
    // ... offered for this programme/semester/year, prerequisites passed (score >= 40), total credits <= maximum
    return $errors;
}
```

Then insert all registrations in a **transaction**. Show the student exactly which rule failed and what to do about it ("Pay KSh 12,500 more", "You need to pass COM 1101 first").

## Step 5: Results and GPA

Only show `published = 1` results. Calculate a weighted average or GPA with credits as weights:

> weighted average = Σ(score × credits) ÷ Σ(credits)

Results day brings a traffic spike: thousands of students log in within minutes. Prepare:
- Indexes on every column used in WHERE and JOIN (`results(student_id, semester_id)`).
- Cache each student's results summary after publication (results don't change often).
- Keep the dashboard light: no huge images, few queries per page.
- Load-test before results day (tools like `ab` or k6) on a copy of the server.

## Step 6: Documents: fee statement and exam card

Generate PDFs on the server (Dompdf or TCPDF with Composer) so they can't be edited in the browser:
- **Fee statement**: ledger rows with running balance (`SUM(...) OVER (ORDER BY created_at)` window function).
- **Exam card**: student photo, registered units, a unique serial number and a **QR code** linking to a verification page (`verify.php?serial=...`) so invigilators can confirm it's genuine.

## Step 7: Paying fees (optional)

Add "Pay with M-Pesa": STK push with the registration number as the account reference, recorded as a `payment` row on confirmation ([M-Pesa project](./?track=projects&lesson=mpesa-payment-system)). Many institutions use bank paybills; a real integration would reconcile bank and M-Pesa records daily.

## Step 8: Security checklist

- Registration numbers are not secret: the password and lockout protect accounts
- Generic error messages for login and password reset
- Reset tokens random, hashed, single-use, expiring
- Every page loads data by `$_SESSION['student_id']`, never by an ID from the URL
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax`; sessions expire after inactivity
- CSRF tokens on all forms; HTTPS everywhere
- Audit log of logins, password changes and registrations

## Step 9: Tests

- 5 wrong passwords → locked for 15 minutes; correct password during the lock → still refused
- Reset link used twice or after 30 minutes → refused
- Registration outside the window, without fees, without prerequisites, or above the credit limit → clear error each
- Change `?student=` style parameters in any URL → no access to other students' data
- Unpublished results never appear

## Stretch goals

- Hostel booking with room capacity (overlap logic from the [booking project](./?track=projects&lesson=booking-system)).
- Lecturer evaluation forms (anonymous, one per unit).
- Push notifications or SMS when results are published.
- A mobile app version using an API ([REST API project](./?track=projects&lesson=rest-api)).

## Summary

- Authentication: hashing, lockout, generic errors, hashed one-time reset tokens, regenerated sessions.
- Business rules (window, fees, prerequisites, credits) checked on the server, with clear messages.
- Fees as a ledger; documents as server-generated PDFs with verification codes.
- Prepare for results-day traffic with indexes and caching.

```quiz
Q: When a reset token is created, what is stored in the database: the token or its hash?
A: hash | its hash | the hash
Q: After how many failed logins does this portal lock the account?
A: 5 | five
Q: Which PHP function prevents session fixation after login?
A: session_regenerate_id | session_regenerate_id()
Q: Fees stored as invoice and payment rows form a what? (one word)
A: ledger
```
