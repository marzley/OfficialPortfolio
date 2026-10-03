---
slug: data-offline-security
title: Data, offline use, logins and security in apps
after: mobile-ui-ux
---
# Data, offline use, logins and security in apps

Behind every screen is data: where it lives, how it travels, how it survives a lost connection, and who is allowed to see it. Getting this right is what separates a toy app from one a SACCO or hospital can trust.

## Where app data lives

| Place | What goes there | Examples |
|---|---|---|
| **On the phone: key-value storage** | Small settings | Theme, language, last-used phone number |
| **On the phone: secure storage** (Android Keystore / iOS Keychain) | Secrets | Login tokens, PINs |
| **On the phone: local database** (SQLite, Room, Drift) | Structured data, offline copies | Products, sales recorded offline, cached orders |
| **On the server: database** (MySQL, PostgreSQL, Firestore) | The source of truth shared by all users | Accounts, all shops' sales, payments |
| **Cloud file storage** | Large files | Photos, PDFs, receipts |

## How data travels: APIs and JSON

The app sends **HTTPS requests** to the backend's **API** and gets **JSON** back:

```json
{
  "id": 1042,
  "customer": "Wanjiku",
  "total": 1240,
  "status": "paid",
  "items": [{ "name": "Unga 2kg", "qty": 2, "price": 180 }]
}
```

Learn to build these APIs in **APIs & backends**, and to call them in **Flutter**, **Kotlin** or **React Native**.

## Offline-first: apps that keep working

Many users lose signal in buildings, on the road or upcountry. An **offline-first** app:

1. **Reads from the local database first**: screens appear instantly, with or without internet.
2. **Fetches updates** from the server when online and saves them locally.
3. **Saves changes locally** (with a "not yet synced" flag) when offline, and **syncs** when the connection returns.
4. Handles **conflicts**: if two people edited the same record, the newest change wins, or the user chooses.
5. Tells the user what's happening: "Offline: 3 sales will sync when you're back online."

## Logins and accounts

| Method | Notes |
|---|---|
| Phone number + SMS code (OTP) | Most familiar in Kenya; SMS costs money per message |
| Email + password | Needs password reset; hash passwords on the server (never store them as text) |
| Google sign-in | One tap on Android; no password to manage |
| PIN or fingerprint | For quick re-entry after the first login (local only) |

After login, the server issues a **token** (a long random string or a signed JWT). The app sends it with every request (`Authorization: Bearer …`) and stores it in **secure storage**. Tokens should expire; refresh them or ask the user to sign in again.

## Security rules every app developer must follow

1. **Never put secrets in the app.** M-Pesa consumer secrets, payment keys, database passwords and AI API keys must live on the **server**. Anyone can unpack an APK and read its contents.
2. **HTTPS only.** Android blocks plain HTTP by default in release builds; don't disable that.
3. **The server decides who can do what.** Never trust the app: check permissions on the server for every request (a shop attendant must not see another shop's data, even if they change an ID in the request).
4. **Validate all input on the server**: lengths, types, ranges. Use parameterised SQL queries to prevent SQL injection.
5. **Store passwords hashed** (bcrypt or Argon2), never plain or reversibly encrypted.
6. **Ask only for permissions you need**, at the moment you need them.
7. **Keep dependencies updated** and remove unused libraries.
8. **Log and monitor**: failed logins, errors, unusual activity.
9. **Back up** the server database daily, off-site, and test restoring it.

The **OWASP Mobile Top 10** lists the most common mobile security risks; read it before publishing an app that handles money or personal data. Learn more in the **Cybersecurity** subject.

## Personal data and the law

Kenya's **Data Protection Act (2019)** applies to apps that collect personal data (names, phone numbers, IDs, locations, health information):

- Collect only what you need, for a clear purpose, and tell users in a **privacy policy** (Google Play requires one).
- Get consent where needed, and let users ask for their data to be corrected or deleted.
- Protect data with access controls and encryption.
- Organisations processing personal data may need to register with the **Office of the Data Protection Commissioner (ODPC)**.

## Why data and security can't be an afterthought

Apps handle personal and financial information: phone numbers, ID numbers, locations, health details, payment histories. A single security mistake (a leaked API key, an unprotected endpoint, passwords stored in plain text) can expose thousands of users, destroy trust and lead to legal consequences under Kenya's Data Protection Act. Building security in from the start is far cheaper than fixing a breach later.

## The app–server–database architecture

```text
Mobile app  ──HTTPS──▶  Your API server  ──▶  Database
 (untrusted)            (trusted: rules,          (only the server
                         secrets, validation)       can reach it)
                              │
                              ├──▶ M-Pesa / payment provider
                              ├──▶ SMS / email services
                              └──▶ File storage
```

Treat the app as **untrusted**: anyone can decompile it, change it or call your API directly with tools like Postman. Every rule that matters (prices, permissions, balances, payment status) must be enforced on the server.

## Authentication done right

| Practice | Why |
|---|---|
| Phone + OTP or email + strong password | Familiar and secure options |
| Hash passwords with bcrypt/Argon2 on the server | Leaked databases don't reveal passwords |
| Short-lived access tokens + refresh tokens | Limits damage if a token leaks |
| Store tokens in secure storage (Android Keystore-backed EncryptedSharedPreferences, iOS Keychain, Expo SecureStore) | Other apps can't read them |
| Rate-limit login and OTP endpoints | Stops brute-force and SMS cost attacks |
| Log out everywhere / revoke sessions | For lost phones |
| Optional biometrics for re-entry | Convenient and secure for sensitive apps |

## Authorisation: checking every request

Authentication answers "who are you?"; authorisation answers "are you allowed to do this?"

```text
GET /api/students/1057/balance
  Server checks:
  1. Is the token valid?            → otherwise 401
  2. Is this user a parent of student 1057 (or an admin)?  → otherwise 403
  3. Then return the data
```

A common, serious bug is **broken object-level authorisation**: the API checks that the user is logged in, but not whether they own the record, so changing the ID in the URL reveals other people's data.

## Validating input on the server

- Validate every field: type, length, format (phone, email), range (amounts > 0).
- Use parameterised queries / ORM methods to prevent SQL injection.
- Recalculate totals on the server from product prices in the database; never trust a price sent by the app.
- Limit file uploads by type and size; store them safely.

## Protecting data in transit and at rest

- **HTTPS everywhere** (TLS), including APIs; never send tokens or personal data over plain HTTP.
- Consider **certificate pinning** for high-risk apps (banking, payments) to resist interception, with a plan for certificate rotation.
- Encrypt sensitive fields in the database where appropriate (ID numbers, health data) and encrypt backups.
- Minimise data stored on the phone; clear it on logout.

## Secrets management

| Secret | Where it belongs |
|---|---|
| Payment API keys (Daraja consumer secret, passkey) | Server environment variables / secret manager |
| Database credentials | Server only |
| SMS gateway credentials | Server only |
| Signing keystore and passwords | Secure offline storage + password manager (not in Git) |
| Public client keys (e.g. maps key) | In the app, but restricted to your app's package and signing certificate |

Scan repositories for leaked secrets (GitHub secret scanning) and rotate any key that was ever committed.

## Privacy by design for apps

- Ask only for permissions you need, when you need them, with an explanation.
- Avoid collecting contacts, SMS or call logs unless essential (and allowed by store policies).
- Provide a privacy policy, in-app account deletion and a way to download or correct data.
- Disclose third-party SDKs (analytics, ads) in the Play Console data safety form.
- Keep logs free of personal data and secrets.

## Common mobile security risks (OWASP Mobile Top 10 themes)

| Risk | Example | Defence |
|---|---|---|
| Improper credential usage | API keys hard-coded in the app | Keep secrets on the server |
| Insecure authentication/authorisation | API trusts user IDs from the app | Server-side checks on every request |
| Insecure communication | HTTP instead of HTTPS | TLS everywhere |
| Insecure data storage | Tokens in plain SharedPreferences | Encrypted/secure storage |
| Inadequate privacy controls | Collecting unnecessary personal data | Data minimisation |
| Insufficient input/output validation | SQL injection via API | Validate and parameterise |
| Security misconfiguration | Debug mode in release, open admin panels | Release checklists |
| Supply chain risks | Outdated or malicious libraries | Update and audit dependencies |

## A security checklist before launch

1. No secrets in the app bundle or Git history.
2. All endpoints require authentication where needed and check ownership.
3. Rate limits on login, OTP and payment endpoints.
4. Release build: debugging disabled, logs stripped, R8/obfuscation on.
5. Dependencies updated; known vulnerabilities checked.
6. Backups encrypted and restore tested.
7. Privacy policy, data safety form and account deletion in place.
8. An incident response plan (who to contact, how to revoke keys).

## Practice

1. Draw the architecture for a delivery app showing which secrets live where.
2. Write the authorisation rule for "a rider can see only orders assigned to them".
3. Test your own API: change an ID in a request and confirm you get 403, not someone else's data.
4. Move any hard-coded keys from an app project into server environment variables.
5. Write a privacy policy outline for your app.

:::think An app sends `{ "product_id": 5, "price": 10, "qty": 2 }` to the server, and the server charges `price × qty`. What's the vulnerability and the fix?
An attacker can change the price in the request (e.g. to 1 shilling) and the server will charge it. The server must ignore client-sent prices, look up the real price for product 5 from its own database, calculate the total itself, and only then start the payment.
:::

```quiz
Q: Where should an app store a login token?
A: secure storage | in secure storage | Keystore | Keychain
Q: Where must M-Pesa and payment secret keys live?
A: on the server | server | the server
Q: An app that reads from local data first and syncs later is called ...-first?
A: offline | offline-first
Q: How should passwords be stored on the server?
A: hashed | hashed with bcrypt | bcrypt | as hashes
Q: Which list describes the most common mobile security risks?
A: OWASP Mobile Top 10 | OWASP
Q: Which Kenyan law covers personal data collected by apps?
A: Data Protection Act | the Data Protection Act
Q: What is it called when an API checks login but not whether the user owns the requested record? (three words, broken ... authorisation)
A: broken object-level authorization | broken object level authorisation | BOLA | IDOR
Q: Which status code means "logged in but not allowed"?
A: 403
Q: Should the server trust a price sent by the app? (yes or no)
A: no
```
