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
```
