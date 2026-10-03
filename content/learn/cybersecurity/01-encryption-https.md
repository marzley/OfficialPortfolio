---
slug: encryption-https
title: Encryption, hashing and HTTPS explained
after: passwords-2fa
---
# Encryption, hashing and HTTPS explained

Every time you log in, pay with M-Pesa online or send a WhatsApp message, **cryptography** protects you. You don't need advanced maths to understand what it does and to use it correctly.

## Three different tools

| Tool | Reversible? | Used for | Example |
|---|---|---|---|
| **Encryption** | Yes, with the key | Keeping data secret | HTTPS, WhatsApp messages, encrypted phones |
| **Hashing** | No (one-way) | Storing passwords, checking files haven't changed | `password_hash`, SHA-256 |
| **Encoding** | Yes, no key needed | Making data safe to transmit, **not** secret | Base64, URL encoding |

> Encoding is **not** security. Base64 "hides" nothing: anyone can decode it.

## Symmetric encryption: one shared key

The same key locks and unlocks. Fast, used for bulk data (files, disks, the main part of HTTPS).

- Algorithm today: **AES** (e.g. AES-256).
- Problem: how do two strangers share the key safely over the internet?

## Asymmetric encryption: a key pair

Each person has a **public key** (share with everyone) and a **private key** (never share).

- Anything locked with your **public** key can only be opened with your **private** key.
- Anything **signed** with your private key can be verified by anyone with your public key: that's a **digital signature**.
- Algorithms: RSA, elliptic-curve (ECDSA, Ed25519).

Your SSH key from the Git lesson is exactly this: you give GitHub the `.pub` file and keep the private one.

## Hashing: fingerprints of data

A hash function turns any data into a fixed-length fingerprint. Change one letter and the hash changes completely:

```try-python
import hashlib
print(hashlib.sha256(b"Karibu Kenya").hexdigest())
print(hashlib.sha256(b"Karibu kenya").hexdigest())   # one letter changed
```

Uses:

- **Checking downloads**: compare the file's SHA-256 with the one on the official site.
- **Storing passwords**: store the hash, never the password. At login, hash what the user typed and compare.

### Passwords need slow, salted hashes

Plain SHA-256 is too fast: attackers can try billions of guesses per second. Password hashing functions are deliberately **slow** and add a random **salt** so identical passwords get different hashes:

```try-php
<?php
$hash = password_hash("MyS3cure!Pass", PASSWORD_DEFAULT);   // bcrypt/argon2 with a random salt
echo $hash, "\n";
var_dump(password_verify("MyS3cure!Pass", $hash));  // true
var_dump(password_verify("wrongpass", $hash));      // false
```

In Python use `bcrypt` or `argon2`; in Node `bcrypt`. **Never** invent your own scheme, and never store passwords with MD5 or plain SHA.

## How HTTPS works (simplified)

When you open `https://marzleytechsolutions.co.ke`:

1. Your browser connects and the server sends its **certificate**: its public key plus proof, signed by a **Certificate Authority** (CA) like Let's Encrypt, that it really owns that domain.
2. The browser checks the signature using CA keys built into your phone or computer.
3. They use asymmetric crypto to agree on a fresh **symmetric session key**.
4. Everything after that is encrypted with fast AES using that session key.

Result: people on the same Wi-Fi, or your ISP, can see **which site** you visit but not the pages, passwords or payment details.

### What the padlock does and doesn't mean

- ✅ The connection is encrypted and you're talking to the real owner of that domain name.
- ❌ It does **not** mean the site is honest. Scam sites get free certificates too. Check the domain spelling carefully (`safaricom.co.ke` vs `safaricom-bonus.xyz`).

## Encryption at rest

- Turn on device encryption: **BitLocker** (Windows Pro), **FileVault** (Mac); Android and iPhone encrypt automatically when you set a screen lock.
- Encrypt backups and USB drives with sensitive data.
- A stolen encrypted laptop is a lost laptop; an unencrypted one is a data breach.

## Common mistakes developers make

- Storing passwords in plain text or with MD5.
- Putting API keys and secrets in front-end JavaScript or public GitHub repos.
- Using `http://` for login or payment pages.
- Turning off certificate checks (`CURLOPT_SSL_VERIFYPEER => false`) "to make it work".
- Writing their own encryption algorithm.

## Where encryption protects you every day

Encryption is working whenever you see the padlock in your browser, send a WhatsApp message (end-to-end encrypted), use M-Pesa or a banking app, unlock an encrypted phone, or connect to a VPN. Developers use hashing to store passwords safely and digital signatures to verify software updates and payment callbacks. Understanding these tools helps you build secure systems and spot dangerous practices like storing passwords in plain text.

## Hashing in practice

```try-python
import hashlib

for text in ["password123", "password124", "Password123"]:
    digest = hashlib.sha256(text.encode()).hexdigest()
    print(f"{text:<12} {digest[:32]}...")

# Integrity check: has a downloaded file changed?
data = b"Invoice #1024 total KSh 15,000"
original = hashlib.sha256(data).hexdigest()
tampered = hashlib.sha256(b"Invoice #1024 total KSh 95,000").hexdigest()
print("Unchanged?", original == hashlib.sha256(data).hexdigest())
print("Tampered matches?", original == tampered)
```

A tiny change produces a completely different hash (the **avalanche effect**). Software download pages often publish SHA-256 checksums so you can confirm the file wasn't modified.

## Why plain hashes aren't enough for passwords

Fast hashes like SHA-256 are designed for speed, so attackers can test billions of guesses per second, and identical passwords give identical hashes. Password storage needs **slow, salted** algorithms:

```try-python
import hashlib, os, hmac

def hash_password(password, salt=None, rounds=200_000):
    salt = salt or os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, rounds)
    return salt.hex() + "$" + digest.hex()

def verify(password, stored):
    salt_hex, digest_hex = stored.split("$")
    check = hash_password(password, bytes.fromhex(salt_hex)).split("$")[1]
    return hmac.compare_digest(check, digest_hex)      # constant-time comparison

stored = hash_password("Nairobi2026!")
print("Stored:", stored[:40], "...")
print("Correct password:", verify("Nairobi2026!", stored))
print("Wrong password:", verify("nairobi2026!", stored))
print("Same password, different salt:", hash_password("Nairobi2026!")[:20], "vs", stored[:20])
```

In real applications use the language's built-in password functions: PHP `password_hash()`/`password_verify()`, Python's `bcrypt` or `argon2` libraries, Node's `bcrypt`. Never invent your own encryption.

## HMAC: proving a message wasn't faked

Payment providers and webhooks often sign messages with a shared secret so you can verify they're genuine:

```try-python
import hmac, hashlib

secret = b"shared-webhook-secret"          # stored on the server, never in public code
body = b'{"order": 1024, "status": "paid", "amount": 1500}'
signature = hmac.new(secret, body, hashlib.sha256).hexdigest()
print("Signature sent with the webhook:", signature[:24], "...")

# Receiver recomputes and compares
received_body = b'{"order": 1024, "status": "paid", "amount": 1500}'
expected = hmac.new(secret, received_body, hashlib.sha256).hexdigest()
print("Genuine:", hmac.compare_digest(expected, signature))

forged = b'{"order": 1024, "status": "paid", "amount": 15}'
print("Forged accepted?", hmac.compare_digest(hmac.new(secret, forged, hashlib.sha256).hexdigest(), signature))
```

Always verify signatures (or confirm with the provider's API) before marking an order as paid; never trust a callback just because it arrived.

## Generating secure random values

```try-python
import secrets, string
print("Session token:", secrets.token_urlsafe(32))
print("6-digit OTP:", "".join(secrets.choice(string.digits) for _ in range(6)))
alphabet = string.ascii_letters + string.digits + "!@#$%"
print("Strong password:", "".join(secrets.choice(alphabet) for _ in range(16)))
```

Use `secrets` (not `random`) for tokens, OTPs and passwords.

## TLS certificates explained

- A certificate binds a domain name to a public key, signed by a **Certificate Authority (CA)** that browsers trust.
- **Let's Encrypt** issues free certificates; most cPanel hosts offer free AutoSSL.
- Certificates expire (often after 90 days for Let's Encrypt), so automatic renewal must work.
- Click the padlock → certificate details to see who issued it and when it expires.

Common HTTPS problems:

| Problem | Cause | Fix |
|---|---|---|
| "Your connection is not private" | Expired, wrong-domain or self-signed certificate | Renew/issue the correct certificate |
| Mixed content warnings | Page loads images/scripts over `http://` | Change links to `https://` |
| Site works on HTTP and HTTPS | No redirect | Redirect all HTTP to HTTPS and enable HSTS |

## End-to-end encryption

With end-to-end encryption (WhatsApp, Signal), only the sender and recipient devices hold the keys; the service provider can't read message content. But:

- Backups to the cloud may not be end-to-end encrypted unless you enable that option.
- Anyone with access to your unlocked phone can read messages.
- Metadata (who you talk to and when) may still be visible to the provider.

## Encryption at rest for everyone

| Device | How |
|---|---|
| Android | Encrypted by default on modern phones with a screen lock |
| iPhone | Encrypted when a passcode is set |
| Windows | BitLocker (Pro editions) or Device Encryption; save the recovery key safely |
| macOS | FileVault |
| USB drives | BitLocker To Go, VeraCrypt |
| Databases/backups | Encrypt sensitive backups; restrict access to keys |

## Practice

1. Hash three slightly different strings with SHA-256 and compare the results.
2. Use the PBKDF2 example to store and verify a password; try a wrong one.
3. Verify an HMAC signature, then change one character of the message and verify again.
4. Check the certificate of three websites you use: issuer and expiry date.
5. Turn on device encryption on a laptop and store the recovery key securely.

:::think A website stores passwords with plain SHA-256 (no salt). Its database leaks. Why are users at risk even though the passwords are "hashed"?
Fast unsalted hashes can be attacked with precomputed tables and billions of guesses per second, and identical passwords share identical hashes, so common passwords are cracked quickly. Users who reused those passwords elsewhere are also at risk. Passwords should be stored with slow, salted algorithms like bcrypt or Argon2.
:::

```quiz
Q: Is hashing reversible? (yes or no)
A: no
Q: Which key in a key pair must never be shared: public or private?
A: private
Q: Which PHP function hashes a password safely?
A: password_hash | password_hash()
Q: What is the random value added to a password before hashing called?
A: salt | a salt
Q: Does the HTTPS padlock prove a website is honest? (yes or no)
A: no
Q: What is a tiny input change causing a completely different hash called? (two words)
A: avalanche effect
Q: Which technique uses a shared secret to prove a webhook message is genuine? (abbreviation)
A: HMAC
Q: Which Python module should generate OTPs and tokens instead of random?
A: secrets
Q: Which free certificate authority is widely used for HTTPS? (two words)
A: Let's Encrypt | Lets Encrypt | LetsEncrypt
```
