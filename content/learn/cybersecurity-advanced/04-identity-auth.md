---
slug: identity-authentication
title: "Identity and authentication: MFA, passkeys, OAuth and OpenID Connect, sessions and access control"
after: cryptography-in-depth
---
# Identity and authentication: MFA, passkeys, OAuth and OpenID Connect, sessions and access control

Most breaches involve **stolen or weak credentials**. "Identity is the new perimeter": protecting who can log in, and what they can do, is one of the highest-value security jobs.

## Authentication vs authorisation

- **Authentication (AuthN):** proving who you are (password, fingerprint, security key).
- **Authorisation (AuthZ):** what you're allowed to do (view, edit, approve payments).

## Authentication factors

| Factor | Examples |
|---|---|
| Something you **know** | Password, PIN |
| Something you **have** | Phone app code, security key, smart card |
| Something you **are** | Fingerprint, face |

**MFA** combines two or more factors. Not all MFA is equal:

| Method | Strength | Notes |
|---|---|---|
| SMS codes | Weakest MFA | Vulnerable to SIM swap and interception, but better than nothing |
| Authenticator app (TOTP) | Good | Codes from Google/Microsoft Authenticator and similar |
| Push notifications | Good, with number matching | Plain "Approve?" pushes invite "MFA fatigue" attacks |
| **Passkeys / security keys (FIDO2, WebAuthn)** | Strongest | Phishing-resistant: they only work on the real website |

## How authenticator codes work (run it)

Time-based one-time passwords (TOTP) combine a shared secret with the current time:

```try-python
import hmac, hashlib, struct, time, base64

def totp(secret_b32, for_time=None, digits=6, step=30):
    key = base64.b32decode(secret_b32)
    counter = int((for_time or time.time()) // step)
    mac = hmac.new(key, struct.pack(">Q", counter), hashlib.sha1).digest()
    offset = mac[-1] & 0x0F
    code = (struct.unpack(">I", mac[offset:offset + 4])[0] & 0x7FFFFFFF) % 10 ** digits
    return str(code).zfill(digits)

secret = "JBSWY3DPEHPK3PXP"   # a well-known demo secret, never use it for real accounts
print("Code now:            ", totp(secret))
print("Code 30 seconds later:", totp(secret, time.time() + 30))
```

The phone and server share the secret once (via the QR code) and then generate matching codes independently every 30 seconds.

## Passkeys: the future of login

Passkeys use public-key cryptography: your device keeps a private key, the website stores only the public key. Nothing reusable is sent, and a fake website can't use it. Encourage passkeys where supported (Google, Microsoft, Apple and many banks support them).

## OAuth 2.0 and OpenID Connect (OIDC)

- **OAuth 2.0:** lets an app access something on your behalf without your password (e.g. "Allow this app to read your Google Calendar").
- **OpenID Connect:** built on OAuth, adds login ("Sign in with Google"), returning an **ID token** about the user.

**Developer must-dos:** use well-tested libraries, validate tokens (signature, issuer, audience, expiry), use the Authorization Code flow with PKCE for apps, and keep client secrets on the server only.

## Sessions and cookies

After login, websites track you with a **session**:
- Generate long, random session IDs; regenerate them after login.
- Cookies: `Secure` (HTTPS only), `HttpOnly` (not readable by JavaScript), `SameSite=Lax` or `Strict` (helps stop CSRF).
- Expire idle sessions; offer "sign out everywhere".
- Protect against brute force: rate limits, account lockouts or delays, CAPTCHAs after failures.

## Authorisation models

| Model | Idea | Example |
|---|---|---|
| **RBAC** (role-based) | Permissions attached to roles | Cashier, manager, admin |
| **ABAC** (attribute-based) | Rules using attributes | "Teachers can see marks for their own classes" |
| **Least privilege** | Only what's needed | Interns can't approve payments |
| **Separation of duties** | No single person completes risky actions alone | One person creates a payment, another approves |

**Check authorisation on the server for every request.** Hiding a button is not security; broken access control is the top risk in the OWASP Top 10.

## Identity management in organisations

- **Single sign-on (SSO)** with an identity provider (Microsoft Entra ID, Google Workspace, Okta).
- **Joiner–mover–leaver process:** give access on day one, change it when roles change, remove it the day someone leaves.
- **Privileged access management:** extra protection and logging for admin accounts.
- **Regular access reviews.**

:::think A school portal lets teachers edit marks. A student discovers that changing the URL from /marks/edit?class=4A to /marks/edit?class=4B lets them open another class's marks page. What kind of flaw is this and how is it fixed?
Broken access control (an insecure direct object reference). The server must check on every request that the logged-in user is allowed to view or edit that specific class's marks, using the user's role and assignments, not trusting the URL or hidden form values.
:::

## Summary

- Authentication proves identity; authorisation decides access.
- Prefer phishing-resistant MFA (passkeys, security keys); SMS is the weakest MFA.
- Use OAuth/OIDC libraries correctly; secure session cookies and rate-limit logins.
- Enforce least privilege, separation of duties and server-side authorisation checks; manage joiners, movers and leavers.

```quiz
Q: Proving who you are is authentication; deciding what you can do is ___ (one word)
A: authorisation | authorization
Q: Which MFA type is phishing-resistant? (one word)
A: passkeys | passkey | security keys | fido2 | webauthn
Q: Which cookie flag stops JavaScript from reading the cookie? (one word)
A: httponly
```
