---
slug: cryptography-in-depth
title: "Cryptography in depth: hashing, salting, symmetric and public-key encryption, TLS and certificates"
after: threat-landscape-attack-lifecycle
---
# Cryptography in depth: hashing, salting, symmetric and public-key encryption, TLS and certificates

Cryptography protects passwords, payments, messages and websites. You won't invent your own algorithms (never do that), but you must understand how the standard ones work and how to use them correctly. The basics are in [Encryption, hashing and HTTPS](./?track=cybersecurity&lesson=encryption-https).

## Hashing: one-way fingerprints

A **hash function** turns any data into a fixed-length fingerprint. The same input always gives the same hash; a tiny change gives a completely different hash; you can't reverse it.

```try-python
import hashlib

for text in ["Marzley", "marzley", "Marzley."]:
    print(f"{text:<9} -> {hashlib.sha256(text.encode()).hexdigest()[:32]}...")
```

Uses: checking file integrity (downloads), digital signatures, password storage (with extra care), blockchains.

**Broken or weak hashes:** MD5 and SHA-1 should not be used for security. Use SHA-256 or better for integrity.

## Passwords need special hashing

Plain SHA-256 is **too fast** for passwords: attackers can try billions of guesses per second. Passwords need:
1. A **salt:** random data added to each password so identical passwords get different hashes and precomputed "rainbow tables" fail.
2. A **slow** algorithm: bcrypt, scrypt, Argon2 or PBKDF2 with many iterations.

```try-python
import hashlib, os, hmac

def hash_password(password, salt=None, iterations=200_000):
    salt = salt or os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations)
    return salt, digest

def verify(password, salt, stored):
    _, digest = hash_password(password, salt)
    return hmac.compare_digest(digest, stored)   # constant-time comparison

salt1, h1 = hash_password("Kenol2026!")
salt2, h2 = hash_password("Kenol2026!")
print("Same password, different salts -> different hashes:", h1 != h2)
print("Correct password accepted:", verify("Kenol2026!", salt1, h1))
print("Wrong password rejected:  ", not verify("kenol2026!", salt1, h1))
```

In PHP use `password_hash()` and `password_verify()`; in Node use bcrypt or Argon2 libraries. Never store passwords in plain text or with reversible encryption.

## Symmetric encryption: one shared key

The same key encrypts and decrypts. Fast; used for files, disks and data in transit.
- **AES** (Advanced Encryption Standard) is the standard, e.g. AES-256-GCM.
- **Modes matter:** use authenticated modes like GCM, which also detect tampering.
- **The problem:** how do two parties share the key safely? Public-key cryptography solves that.

## Public-key (asymmetric) cryptography

Each person has a **key pair**:
- A **public key** anyone can have
- A **private key** kept secret

| Goal | How |
|---|---|
| **Confidentiality** | Encrypt with the recipient's public key; only their private key decrypts |
| **Digital signature** | Sign with your private key; anyone can verify with your public key |
| **Key exchange** | Two parties agree a shared secret over an insecure network (Diffie-Hellman / ECDHE) |

Common algorithms: RSA, elliptic-curve cryptography (ECDSA, Ed25519). Your SSH keys are key pairs.

## Message authentication (HMAC): detect tampering

Payment providers (including mobile money and card APIs) often **sign** callbacks so you can confirm a message is genuine.

```try-python
import hmac, hashlib, json

secret = b"shared-webhook-secret"          # stored on the server only
body = json.dumps({"receipt": "SJK4H2L9XA", "amount": 500}).encode()

signature = hmac.new(secret, body, hashlib.sha256).hexdigest()
print("Signature sent with the webhook:", signature[:24], "...")

tampered = json.dumps({"receipt": "SJK4H2L9XA", "amount": 50000}).encode()
ok = hmac.compare_digest(signature, hmac.new(secret, body, hashlib.sha256).hexdigest())
bad = hmac.compare_digest(signature, hmac.new(secret, tampered, hashlib.sha256).hexdigest())
print("Original message verifies:", ok)
print("Tampered amount verifies: ", bad)
```

Always verify webhook signatures (and confirm payments with the provider's API) before giving goods or access.

## TLS: how HTTPS works

1. Your browser connects and the server presents its **certificate**.
2. The browser checks the certificate is valid, for the right domain and signed by a trusted **certificate authority (CA)**.
3. They perform a **key exchange** (ECDHE) to agree session keys.
4. All data is then encrypted with fast symmetric encryption (AES or ChaCha20).

**Good TLS settings:** TLS 1.2 and 1.3 only, strong cipher suites, HSTS, and automatic certificate renewal (Let's Encrypt).

## PKI and certificates

**Public Key Infrastructure** is the system of CAs, certificates and trust. A certificate binds a public key to a domain or organisation. Watch for: expired certificates, certificates for the wrong domain, and self-signed certificates on public sites.

## Rules for using cryptography

1. **Never invent your own crypto** or "encryption" algorithms.
2. Use well-known libraries and current recommendations.
3. Protect keys: key management (vaults, HSMs, cloud KMS) matters as much as algorithms.
4. Use authenticated encryption; use slow, salted hashes for passwords.
5. Plan for change: algorithms weaken over time (including future quantum threats to today's public-key algorithms).

:::think A developer stores customer passwords encrypted with AES "because encryption is secure". What's wrong, and what should they do?
Encrypted passwords can be decrypted by anyone who gets the key (including a hacker who steals the server). Passwords should be hashed with a slow, salted algorithm (bcrypt, Argon2, scrypt or PBKDF2), using functions like PHP's password_hash, so even the site owner can't recover them.
:::

## Summary

- Hashes are one-way fingerprints; avoid MD5 and SHA-1; use SHA-256+ for integrity.
- Passwords need salted, slow hashing (bcrypt, Argon2, scrypt, PBKDF2) and constant-time checks.
- Symmetric (AES) is fast; public-key enables key exchange and signatures; HMAC detects tampering.
- TLS combines certificates, key exchange and symmetric encryption; never roll your own crypto.

```quiz
Q: What random value is added to each password before hashing? (one word)
A: salt
Q: Which key do you use to create a digital signature: public or private? (one word)
A: private
Q: Which standard symmetric encryption algorithm is widely used? (abbreviation)
A: aes
```
