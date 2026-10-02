---
slug: forms-security
title: "Forms and security: GET and POST, validation, XSS, CSRF, sending email and safe form handling"
after: KEEP
---
# Forms and security: GET and POST, validation, XSS, CSRF, sending email and safe form handling

Forms are how websites collect information: contact messages, sign-ups, orders, bookings, payments, job applications. Handling a form means **receiving** the data, **validating** it, **doing something** with it (save, email, pay), and **responding**. It's also where most website attacks begin, because form data comes from strangers on the internet and can contain anything. This unit teaches the full process, with the security habits every PHP developer must follow.

:::note What you will learn
- How HTML forms send data: GET vs POST
- Reading form data with `$_GET`, `$_POST` and `$_SERVER`
- Validation and sanitisation (required fields, emails, phones, numbers)
- Showing errors and keeping the user's input
- Cross-site scripting (XSS) and output escaping
- CSRF tokens
- The Post/Redirect/Get pattern
- Sending email safely
- Spam protection: honeypots, rate limits, CAPTCHA
- A complete secure contact form
:::

## How forms send data

```html
<form action="contact.php" method="post">
  <label>Name <input type="text" name="name" required></label>
  <label>Email <input type="email" name="email" required></label>
  <label>Message <textarea name="message" required></textarea></label>
  <button type="submit">Send</button>
</form>
```

- `action`: the PHP file that receives the data.
- `method`: `get` or `post`.
- Each input's `name` becomes the key in PHP: `$_POST["email"]`.

| | GET | POST |
|---|---|---|
| Where data goes | In the URL: `search.php?q=laptop&page=2` | In the request body |
| Visible/bookmarkable | Yes | No |
| Size | Limited | Large (files too) |
| Use for | Searches, filters, pagination | Anything that changes data: logins, orders, sign-ups, payments |

**Never** use GET for passwords or actions that change data.

## Reading the data

```php
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $message = trim($_POST["message"] ?? "");
    // validate, then act...
}

$query = trim($_GET["q"] ?? "");       // from search.php?q=...
$page = max(1, (int)($_GET["page"] ?? 1));
```

`?? ""` avoids warnings when a field is missing; `trim()` removes accidental spaces.

## Validation: never trust user input

Browser checks (`required`, `type="email"`) help honest users, but anyone can bypass them. **Always validate on the server.**

```try-php
<?php
function validateBooking(array $in): array {
    $errors = [];
    $name = trim($in["name"] ?? "");
    if ($name === "" || mb_strlen($name) > 100) {
        $errors["name"] = "Please enter your name (up to 100 characters).";
    }
    $email = trim($in["email"] ?? "");
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors["email"] = "Please enter a valid email address.";
    }
    $phone = preg_replace('/\D/', '', $in["phone"] ?? "");
    if (!preg_match('/^(0[17]\d{8}|254[17]\d{8})$/', $phone)) {
        $errors["phone"] = "Enter a Kenyan number like 0712345678.";
    }
    $guests = filter_var($in["guests"] ?? "", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 20]]);
    if ($guests === false) {
        $errors["guests"] = "Guests must be a number from 1 to 20.";
    }
    $date = $in["date"] ?? "";
    $d = DateTime::createFromFormat("Y-m-d", $date);
    if (!$d || $d->format("Y-m-d") !== $date) {
        $errors["date"] = "Choose a valid date.";
    }
    return $errors;
}

$good = ["name" => "Amina Hassan", "email" => "amina@example.com", "phone" => "0712 345 678", "guests" => "4", "date" => "2026-12-24"];
$bad  = ["name" => "", "email" => "amina@", "phone" => "12345", "guests" => "50", "date" => "2026-02-30"];
print_r(validateBooking($good));
print_r(validateBooking($bad));
```

Validation checklist:
- **Required** fields present.
- **Type/format**: email, phone, number, date (`filter_var`, `preg_match`, `DateTime`).
- **Length and range** limits.
- **Allowed values** for dropdowns: check against a list (`in_array($in["plan"], ["basic", "standard", "premium"], true)`).
- **Business rules**: date not in the past, quantity not above stock.

## Showing errors and keeping input

```php
<label>Email
  <input type="email" name="email" value="<?= htmlspecialchars($email ?? '') ?>">
</label>
<?php if (isset($errors["email"])): ?>
  <p class="error"><?= htmlspecialchars($errors["email"]) ?></p>
<?php endif; ?>
```

Refill fields so users don't retype everything, and show each error next to its field.

## XSS: Cross-Site Scripting

If you print user input directly, an attacker can submit `<script>...</script>` and it runs in other visitors' browsers (stealing sessions, defacing pages, redirecting to scam sites).

```try-php
<?php
$comment = '<script>alert("hacked")</script> Great shop!';
echo "UNSAFE: " . $comment . "\n";
echo "SAFE:   " . htmlspecialchars($comment, ENT_QUOTES, 'UTF-8') . "\n";
```

**Rule: escape every piece of user data when you output it into HTML**, with `htmlspecialchars()`. A short helper keeps code tidy:

```php
function e(?string $s): string { return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }
// <p>Hello, <?= e($name) ?></p>
```

Other contexts need other escaping: `json_encode()` for JavaScript, `urlencode()` for URL parts, prepared statements for SQL (next lesson).

## CSRF: Cross-Site Request Forgery

A malicious site could trick a logged-in user's browser into submitting a form to your site (e.g. "change email" or "transfer"). Defend with a secret **token** in each form, stored in the session:

```php
<?php
session_start();
if (empty($_SESSION["csrf"])) {
    $_SESSION["csrf"] = bin2hex(random_bytes(32));
}
// In the form:
// <input type="hidden" name="csrf" value="<?= $_SESSION['csrf'] ?>">

// When processing:
if (!hash_equals($_SESSION["csrf"], $_POST["csrf"] ?? "")) {
    http_response_code(403);
    exit("Invalid form submission.");
}
```

Also set session cookies with `SameSite=Lax` (or `Strict`), covered in the sessions lesson.

## Post/Redirect/Get

After processing a POST successfully, **redirect**. Otherwise, refreshing the page resubmits the form (duplicate orders and emails):

```php
<?php
// after saving successfully:
header("Location: thank-you.php");
exit;
```

## Sending email

PHP's `mail()` works on many hosts but often lands in spam. Professionals use **SMTP** through a library like **PHPMailer** or **Symfony Mailer**, with the domain's SPF, DKIM and DMARC records set up:

```php
<?php
use PHPMailer\PHPMailer\PHPMailer;
require 'vendor/autoload.php';

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'mail.example.co.ke';
$mail->SMTPAuth = true;
$mail->Username = 'noreply@example.co.ke';
$mail->Password = getenv('SMTP_PASS');          // never hard-code passwords
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->Port = 465;
$mail->setFrom('noreply@example.co.ke', 'Example Website');
$mail->addAddress('info@example.co.ke');
$mail->addReplyTo($email, $name);              // validated email from the form
$mail->Subject = 'New contact message';
$mail->Body = "From: $name <$email>\n\n$message";
$mail->send();
```

Security: never put user input into email **headers** without validation (header injection); use the library's methods, which handle this.

## Spam protection

| Method | How |
|---|---|
| **Honeypot field** | A hidden field humans don't fill; bots do. Reject if it has a value |
| **Time check** | Reject forms submitted within 2–3 seconds of loading |
| **Rate limiting** | Limit submissions per IP/session per hour |
| **CAPTCHA** | reCAPTCHA, hCaptcha or Cloudflare Turnstile for heavy spam |
| **Content checks** | Reject messages with many links |

## A complete secure contact form (summary of the flow)

1. `session_start()`, generate a CSRF token.
2. On POST: check the CSRF token and honeypot.
3. Trim and validate every field; collect errors.
4. If errors: redisplay the form with escaped values and messages.
5. If valid: save to the database (prepared statement) and/or send email via SMTP.
6. Redirect to a thank-you page (Post/Redirect/Get).
7. Output everything with `htmlspecialchars()`.

:::think A developer's search page shows "You searched for: " followed by $_GET['q'] directly. Someone shares a link like search.php?q=<script>...</script>. What can happen and how do you fix it?
Reflected XSS: the script runs in the browser of anyone who opens the link, possibly stealing their session or redirecting them to a scam page. Fix by escaping: `echo "You searched for: " . htmlspecialchars($q, ENT_QUOTES, 'UTF-8');`.
:::

## Summary

- Forms send data by GET (in the URL; for searches) or POST (in the body; for changes); read with `$_GET`/`$_POST` and `??`.
- Validate everything on the server: required, format (filter_var, preg_match), length, range, allowed values, business rules.
- Escape all output with `htmlspecialchars()` to prevent XSS; use CSRF tokens; redirect after POST.
- Send email through SMTP with PHPMailer, credentials from environment/config, and correct DNS records.
- Fight spam with honeypots, time checks, rate limits and CAPTCHA.

```quiz
Q: Which method should a login form use, GET or POST?
A: POST
Q: Which function makes text safe to print inside HTML?
A: htmlspecialchars
Q: Which filter_var filter checks an email address? (constant)
A: FILTER_VALIDATE_EMAIL
Q: What attack does a hidden random token in each form prevent? (abbreviation)
A: CSRF | cross-site request forgery
Q: What pattern redirects after a successful POST to avoid duplicate submissions? (three words, with slashes)
A: Post/Redirect/Get | post redirect get | PRG
Q: Is browser-side validation (required, type=email) enough on its own? (yes/no)
A: no
```

**Learn more:** [OWASP Cheat Sheet: XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) · [PHP manual: filter_var](https://www.php.net/manual/en/function.filter-var.php)
