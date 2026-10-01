---
slug: baas-and-deploying
title: Firebase, Supabase and deploying your backend securely
after: mpesa-daraja-api
---
# Firebase, Supabase and deploying your backend securely

You don't always need to write your own server. **Backend-as-a-Service (BaaS)** platforms give you login, a database, file storage and more, ready to use. And when you do write your own backend, it must be deployed securely so it stays online and safe.

## Backend-as-a-Service options

| Platform | Database | Strengths | Watch out |
|---|---|---|---|
| **Firebase** (Google) | Firestore (NoSQL documents), Realtime Database | Excellent Flutter/Android support, real-time sync, offline cache, push notifications, Crashlytics | Pricing by reads/writes; NoSQL data modelling; vendor lock-in |
| **Supabase** | PostgreSQL (SQL) | Real SQL with joins, auto-generated APIs, row-level security, open source | Newer ecosystem; learn Postgres security policies |
| **Appwrite** | Document database | Open source, self-hostable | Smaller community |
| **Your own API** (PHP/Node + MySQL/PostgreSQL) | Any | Full control, predictable hosting costs, easy M-Pesa callbacks | You maintain security and uptime |

**A common, practical mix in Kenya:** Firebase Authentication and Cloud Messaging (push notifications) + your own PHP or Node API with MySQL for business data and M-Pesa.

## Security rules are your backend logic

With Firebase and Supabase the app talks **directly** to the database, so **security rules decide everything**. Without them, anyone can read or delete your data.

Firestore rules (only the shop owner can read or write their shop's products):

```
match /shops/{shopId}/products/{productId} {
  allow read, write: if request.auth != null
    && get(/databases/$(database)/documents/shops/$(shopId)).data.owner == request.auth.uid;
}
```

Supabase row-level security (PostgreSQL):

```sql
alter table products enable row level security;

create policy "owners manage their products"
on products for all
using (shop_id in (select id from shops where owner = auth.uid()))
with check (shop_id in (select id from shops where owner = auth.uid()));
```

Payments still need a server you control (Firebase **Cloud Functions** or Supabase **Edge Functions**, or your own API), because secrets like the M-Pesa passkey can't live in the app.

## Deploying your own backend

### Option 1: cPanel shared hosting (PHP)

Cheap and common in Kenya. Good for PHP APIs with moderate traffic.

1. Upload code to a folder; only the public entry point (e.g. `public_html/api/index.php`) is inside `public_html`.
2. Put `config.php` (database password, Daraja keys) **outside** `public_html`.
3. Create the MySQL database and user in cPanel; give the user only the permissions it needs.
4. Turn on **AutoSSL** for HTTPS and force HTTPS in `.htaccess`.
5. Set up **cron jobs** for scheduled work (settling pending M-Pesa payments, sending reminders, backups).
6. Choose the PHP version in **MultiPHP Manager** (use a supported version).

### Option 2: platforms (Node, Python, PHP containers)

**Render**, **Railway**, **Fly.io**: connect your GitHub repo, set environment variables in the dashboard, and they build and run your app with HTTPS. Managed PostgreSQL is usually available alongside. Easy to start; check pricing as traffic grows.

### Option 3: a VPS (more control)

A virtual server (DigitalOcean, Hetzner, AWS Lightsail, local providers) where you install Nginx, Node/PHP and the database yourself. More work (updates, firewall, backups) but full control.

## Environment variables and secrets

| Do | Don't |
|---|---|
| Keep secrets in environment variables or a private config file | Commit `.env` or `config.php` with real values to GitHub |
| Use different keys for sandbox and production | Reuse your production database password anywhere else |
| Rotate keys if they leak | Paste secrets into chat apps or tickets |

If a secret is ever committed to a public repository, consider it **leaked**: change it immediately, even after deleting the commit.

## The production checklist

- [ ] **HTTPS** only, with HTTP redirected
- [ ] **Backups**: daily database dumps copied **off the server**, and a tested restore
- [ ] **Monitoring**: an uptime check (e.g. a `/health` endpoint pinged every few minutes) and alerts by email or SMS
- [ ] **Logs** for errors and payments, without passwords or full card/ID numbers
- [ ] **Rate limiting** on login, OTP and payment endpoints
- [ ] **CORS** allows only your own front-ends
- [ ] **Security headers** (HSTS, X-Content-Type-Options, a Content-Security-Policy for web pages)
- [ ] **Updates**: PHP/Node versions and libraries kept current
- [ ] **Least privilege**: the database user can't drop tables; admin panels behind strong logins
- [ ] **Data protection**: privacy policy, only necessary personal data, deletion on request (Kenya Data Protection Act)

## Health check endpoint

```try-javascript
// What a /health endpoint typically reports (monitoring tools call it every few minutes)
function health({ dbOk, lastBackupHoursAgo, pendingPayments }) {
  const problems = [];
  if (!dbOk) problems.push("database unreachable");
  if (lastBackupHoursAgo > 26) problems.push(`last backup ${lastBackupHoursAgo} hours ago`);
  if (pendingPayments > 20) problems.push(`${pendingPayments} payments still pending`);
  return { status: problems.length ? 503 : 200, body: { ok: problems.length === 0, problems } };
}

console.log(health({ dbOk: true, lastBackupHoursAgo: 3, pendingPayments: 2 }));
console.log(health({ dbOk: true, lastBackupHoursAgo: 40, pendingPayments: 35 }));
```

## Where to go next

- Build the **Duka Connect** API from this subject with PHP or Node, and connect the **Flutter**, **Kotlin** or **React Native** app you built.
- Add M-Pesa in the sandbox, then go live.
- Write a README with setup steps and an API reference: it's your portfolio piece.

Need a production backend built and hosted? Marzley Tech Solutions builds and maintains APIs, M-Pesa integrations and systems: [contact us](../contact).

```quiz
Q: What does BaaS stand for?
A: Backend as a Service | backend-as-a-service
Q: Which BaaS uses PostgreSQL with row-level security?
A: Supabase
Q: With Firebase, what decides who can read and write data?
A: security rules | rules | Security Rules
Q: Config files with secrets must be placed outside which cPanel folder?
A: public_html
Q: Which cPanel feature runs scheduled jobs?
A: cron | cron jobs | Cron Jobs
Q: A secret committed to a public repo should be considered what? (one word)
A: leaked | compromised
```
