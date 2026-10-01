---
slug: auth-passwords-tokens
title: "Logins: hashed passwords, sessions, tokens, JWT and OTP codes"
after: node-express-api
---
# Logins: hashed passwords, sessions, tokens, JWT and OTP codes

Authentication (**who are you?**) and authorisation (**what may you do?**) protect every app's data. Getting them wrong exposes customers' information and money, so learn the safe patterns.

## Rule 1: never store passwords, store hashes

A **hash** is a one-way scramble: you can check a password against it, but you can't turn it back into the password. Use slow, salted algorithms built for passwords: **bcrypt** or **Argon2**. PHP has them built in:

```try-php
<?php
$password = 'Mombasa2026!';

$hash = password_hash($password, PASSWORD_DEFAULT);   // bcrypt today; a random salt is included
echo "Stored in the database: ", $hash, "\n";
echo "Length: ", strlen($hash), " characters\n";

var_dump(password_verify('Mombasa2026!', $hash));     // true: correct password
var_dump(password_verify('mombasa2026!', $hash));     // false: wrong password

// The same password gives a different hash each time (different salt):
var_dump(password_hash($password, PASSWORD_DEFAULT) === $hash);
```

| Never | Always |
|---|---|
| Store passwords as plain text | `password_hash()` / bcrypt / Argon2 |
| Use MD5 or SHA-1 for passwords | Slow password-hashing algorithms |
| Email passwords to users | Password reset links that expire |
| Say "wrong password" vs "no such user" | "Wrong email or password" (don't reveal which accounts exist) |

## Sessions vs tokens

| | Sessions (cookies) | Tokens (Bearer / JWT) |
|---|---|---|
| How | Server stores the login; browser sends a session cookie | Server gives the app a token; the app sends `Authorization: Bearer <token>` |
| Best for | Websites on the same domain | Mobile apps and APIs used by several clients |
| Logout | Delete the session on the server | Delete the token on the server (opaque tokens) or wait for expiry (JWT) |
| Protect against | CSRF (use SameSite cookies and CSRF tokens) | Token theft (HTTPS, secure storage, short expiry) |

## Opaque tokens (simple and safe)

Create a long random token, store its **hash** in the database with the user ID and expiry, and give the token to the app:

```try-php
<?php
$token = bin2hex(random_bytes(32));           // 64 random hex characters: give this to the app once
$stored = hash('sha256', $token);             // store only the hash (a database leak doesn't leak tokens)
$expires = date('Y-m-d H:i:s', time() + 30 * 86400);

echo "Token for the app: $token\n";
echo "Stored hash: $stored\n";
echo "Expires: $expires\n";

// On each request: hash the token the app sent and look it up
$sent = $token;
var_dump(hash_equals($stored, hash('sha256', $sent)));   // constant-time comparison
```

## JWT (JSON Web Tokens)

A JWT is three base64url parts: **header.payload.signature**. The payload is **readable by anyone** (it's only encoded, not encrypted); the **signature** proves the server issued it and nobody changed it.

```try-javascript
// Decode (not verify!) a JWT's payload, to see what's inside
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
            "eyJzdWIiOiI3Iiwicm9sZSI6Im93bmVyIiwic2hvcCI6MTIsImV4cCI6MTc5MTAwMDAwMH0." +
            "signature-goes-here";

function decodePart(part) {
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

const [header, payload] = jwt.split(".");
console.log("Header:", decodePart(header));
console.log("Payload:", decodePart(payload));
console.log("Expires:", new Date(decodePart(payload).exp * 1000).toISOString());
```

JWT rules:

- **Verify the signature on the server** with a well-tested library; never trust a token you only decoded.
- Never put secrets or sensitive personal data in the payload.
- Keep access tokens **short-lived** (minutes to hours) and use **refresh tokens** to get new ones.
- Opaque tokens are often simpler for small apps because you can revoke them instantly.

## Phone number login with OTP codes

Very common in Kenya:

1. User enters a phone number.
2. Server creates a **6-digit random code**, stores its **hash** and an **expiry** (5 to 10 minutes), and sends it by SMS (through an SMS provider such as Africa's Talking or your telco's bulk SMS).
3. User types the code; server checks the hash, expiry and number of attempts.
4. Server issues a session or token.

```try-php
<?php
$phone = '254712345678';
$code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);   // cryptographically secure
$record = ['phone' => $phone, 'code_hash' => hash('sha256', "$phone:$code"), 'expires' => time() + 600, 'attempts' => 0];

echo "SMS to $phone: Your Duka code is $code (valid 10 minutes)\n";

function check(array &$r, string $entered): string {
    if (time() > $r['expires']) return 'Code expired';
    if ($r['attempts'] >= 5) return 'Too many tries';
    $r['attempts']++;
    return hash_equals($r['code_hash'], hash('sha256', $r['phone'] . ':' . $entered)) ? 'Signed in' : 'Wrong code';
}

echo check($record, '000000' === $code ? '111111' : '000000'), "\n";
echo check($record, $code), "\n";
```

Protect OTP endpoints with **rate limits** per phone and per IP: SMS costs money, and attackers can abuse them.

## Authorisation: checking permissions on every request

```try-javascript
const user = { id: 7, shopId: 12, role: "attendant" };
const sale = { id: 5001, shopId: 12, total: 1240 };
const otherShopSale = { id: 5002, shopId: 99, total: 800 };

function can(user, action, resource) {
  if (resource.shopId !== user.shopId) return false;        // never another shop's data
  if (action === "read") return true;
  if (action === "refund") return user.role === "owner";    // only owners refund
  return false;
}

console.log("read own sale:", can(user, "read", sale));
console.log("refund own sale:", can(user, "refund", sale));
console.log("read other shop's sale:", can(user, "read", otherShopSale));
```

The most common real-world API bug is **broken object-level authorisation**: the API returns `/sales/5002` to anyone who asks, without checking it belongs to their shop. Always check ownership.

## Checklist

- [ ] Passwords hashed with bcrypt/Argon2
- [ ] Tokens long and random, stored hashed, with expiry
- [ ] HTTPS everywhere; tokens in secure storage on phones
- [ ] Rate limits on login, OTP and password reset
- [ ] Ownership checked for every record
- [ ] Generic login errors; audit log of sign-ins

```quiz
Q: Which PHP function hashes a password safely?
A: password_hash | password_hash()
Q: Which PHP function checks a password against its hash?
A: password_verify | password_verify()
Q: Should MD5 be used for passwords? (yes or no)
A: no
Q: How many parts does a JWT have?
A: 3 | three
Q: Is a JWT payload encrypted or just encoded?
A: encoded | just encoded
Q: Which PHP function generates a cryptographically secure random number for OTP codes?
A: random_int | random_int()
```
