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
```
