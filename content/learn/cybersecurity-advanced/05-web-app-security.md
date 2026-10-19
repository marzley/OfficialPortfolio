---
slug: web-application-security
title: "Secure web development: the OWASP Top 10, injection, XSS, secure coding and testing your own apps"
after: identity-authentication
---
# Secure web development: the OWASP Top 10, injection, XSS, secure coding and testing your own apps

Websites and apps are the front door of almost every organisation. This lesson goes deeper than the [web security basics](./?track=cybersecurity&lesson=web-security): how the most common flaws happen in code, and how developers prevent them.

## The OWASP Top 10

**OWASP** (Open Worldwide Application Security Project) is a free, community-run foundation. Its **Top 10** lists the most critical web application risks. The 2021 edition:

| # | Risk | In plain words |
|---|---|---|
| A01 | Broken access control | Users can see or do things they shouldn't |
| A02 | Cryptographic failures | Sensitive data not encrypted, weak algorithms |
| A03 | Injection | Untrusted input treated as code (SQL, commands, XSS) |
| A04 | Insecure design | Security not planned from the start |
| A05 | Security misconfiguration | Default passwords, debug mode on, open storage |
| A06 | Vulnerable and outdated components | Old libraries and plugins with known flaws |
| A07 | Identification and authentication failures | Weak login, session problems |
| A08 | Software and data integrity failures | Untrusted updates, insecure pipelines |
| A09 | Security logging and monitoring failures | Attacks happen and nobody notices |
| A10 | Server-side request forgery (SSRF) | Server tricked into fetching internal URLs |

:::note
OWASP updates the list every few years. Check owasp.org for the latest edition; the core lessons (validate input, check access, patch components) stay the same.
:::

## SQL injection: see why parameters matter (run it)

This lab uses a tiny **local** database in your browser. It shows how gluing user input into SQL changes the query's meaning, and how parameterised queries stop it.

```try-python
import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE staff (username TEXT, salary INTEGER)")
db.executemany("INSERT INTO staff VALUES (?, ?)",
               [("wanjiku", 85000), ("otieno", 92000), ("akinyi", 78000)])

user_input = "nobody' OR '1'='1"

# UNSAFE: input glued into the SQL text
unsafe_sql = "SELECT username, salary FROM staff WHERE username = '" + user_input + "'"
print("Unsafe query:", unsafe_sql)
print("Rows returned:", len(db.execute(unsafe_sql).fetchall()))

# SAFE: a parameterised query treats the input only as data
safe_rows = db.execute("SELECT username, salary FROM staff WHERE username = ?",
                       (user_input,)).fetchall()
print("Rows returned with parameters:", len(safe_rows))
```

The unsafe version returns all 3 rows because `OR '1'='1'` is always true. The parameterised version returns 0 rows: the database looks for a user literally named `nobody' OR '1'='1`.

**Prevention:** parameterised queries or prepared statements (PDO in PHP, `?` placeholders in Python), ORMs used correctly, least-privilege database accounts, and input validation.

## Cross-site scripting (XSS)

XSS happens when a site shows user input as HTML, so an attacker's script runs in other users' browsers (stealing sessions, changing pages).

```try-python
import html

comment = '<script>alert("hacked")</script>Nice article!'
print("Raw (dangerous if put into HTML):", comment)
print("Escaped (safe to display):       ", html.escape(comment))
```

**Prevention:**
- **Output encoding/escaping** for the context (HTML, attributes, JavaScript, URLs). Modern frameworks (React, Vue, Laravel Blade, Django templates) escape by default; avoid bypasses such as `innerHTML` or `dangerouslySetInnerHTML` with user data.
- A **Content Security Policy (CSP)** header to limit which scripts can run.
- `HttpOnly` cookies so scripts can't read session cookies.

## Other common flaws

| Flaw | Prevention |
|---|---|
| **CSRF** (forcing a logged-in user's browser to submit actions) | CSRF tokens, `SameSite` cookies |
| **Command injection** | Never pass user input to shell commands; use safe library functions |
| **Insecure file uploads** | Check type and size, rename files, store outside the web root, never execute uploads |
| **SSRF** | Allow-list destinations, block internal addresses |
| **Insecure direct object references** | Check ownership on every request |
| **Secrets in code** | Environment variables or a secrets manager; scan repositories |

## Secure development lifecycle

1. **Plan:** threat modelling ("what could go wrong?" STRIDE is a popular method: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege).
2. **Code:** secure coding guidelines, code review, frameworks with safe defaults.
3. **Test:** SAST (static analysis of code), DAST (scanning the running app), dependency scanning (Dependabot, npm audit, pip-audit).
4. **Deploy:** security headers, HTTPS, no debug mode, secrets management.
5. **Operate:** logging, monitoring, patching, a vulnerability disclosure contact (`security.txt`).

## Security headers checklist

| Header | Purpose |
|---|---|
| `Strict-Transport-Security` | Always use HTTPS |
| `Content-Security-Policy` | Limit scripts and resources |
| `X-Content-Type-Options: nosniff` | Stop MIME sniffing |
| `X-Frame-Options` or CSP `frame-ancestors` | Stop clickjacking |
| `Referrer-Policy` | Limit leaked URLs |

:::warning Test only your own apps
Use OWASP Juice Shop, DVWA or your own projects running locally. Tools like OWASP ZAP and Burp Suite are legal to use on systems you own or are authorised to test, and illegal to point at other people's sites without permission.
:::

:::think A developer says "we validate input in JavaScript before the form submits, so the server doesn't need to check it." What's wrong?
Client-side checks can be bypassed easily (by editing requests or calling the API directly). They help usability, but the server must validate input, use parameterised queries, encode output and check authorisation on every request.
:::

## Summary

- The OWASP Top 10 lists the most critical web risks; broken access control tops the 2021 list.
- Parameterised queries stop SQL injection; output encoding and CSP stop XSS.
- Build security into every stage: threat modelling, secure code, SAST/DAST, dependency scanning, secure deployment.
- Test only your own or authorised apps.

```quiz
Q: What stops SQL injection? (one word: ___ queries)
A: parameterised | parameterized | parameterised queries | prepared statements | prepared
Q: Which attack runs an attacker's script in other users' browsers? (acronym)
A: xss | cross-site scripting
Q: Which header limits which scripts a page may run? (acronym)
A: csp | content-security-policy | content security policy
```
