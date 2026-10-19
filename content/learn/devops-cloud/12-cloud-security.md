---
slug: cloud-security
title: "Cloud and DevOps security: IAM, MFA, secrets, encryption and secure pipelines"
after: monitoring-reliability
---
# Cloud and DevOps security: IAM, MFA, secrets, encryption and secure pipelines

Most cloud breaches aren't clever hacks: they're leaked keys, public storage, missing MFA and over-powerful accounts. A few disciplined habits prevent most of them. (For general security, see the [Cybersecurity subject](./?track=cybersecurity&lesson=basics).)

## 1. Protect the root account

- The **root/owner account** can do anything, including deleting everything and running up huge bills.
- Turn on **MFA** (an authenticator app or security key) immediately.
- Don't use root for daily work; create named admin users or use single sign-on.
- Store recovery details safely.

## 2. Identity and access management (IAM)

- **Least privilege:** give each person, app and pipeline only the permissions they need.
- Use **roles and groups**, not permissions on individual users.
- Prefer **short-lived credentials** (roles, single sign-on, OIDC for CI/CD) over long-lived access keys.
- **Review access regularly** and remove people who leave immediately.

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject"],
    "Resource": "arn:aws:s3:::marzley-shop-backups-2026/*"
  }]
}
```

This example AWS policy lets a backup job **only upload** files to one bucket: nothing else.

## 3. Secrets management

| Don't | Do |
|---|---|
| Put passwords and API keys in code or Git | Use a secrets manager (AWS Secrets Manager, Azure Key Vault, Google Secret Manager, Vault) |
| Share keys on WhatsApp or email | Share access through roles and the secrets manager |
| Keep the same key for years | Rotate keys regularly and immediately if leaked |
| Print secrets in logs | Mask them in CI/CD logs |

Turn on **secret scanning** in GitHub. If a key leaks: revoke it first, then investigate.

## 4. Network security

- Private subnets for databases and internal services (lesson 4).
- Security groups that allow only required ports from required sources.
- No SSH open to the world; use bastion hosts or the provider's session manager.
- A **WAF** (web application firewall) and DDoS protection for public sites, where it's justified.

## 5. Encryption

- **In transit:** HTTPS/TLS everywhere, including between services where possible.
- **At rest:** turn on encryption for disks, databases, object storage and backups (often one setting, with provider-managed keys).

## 6. Storage buckets

- **Block public access** by default (account-wide settings exist).
- Share specific files with time-limited signed URLs instead of making buckets public.

## 7. Secure pipelines (DevSecOps)

Add security checks to CI/CD:
- **Dependency scanning** for known vulnerabilities
- **Container image scanning**
- **Static analysis** of code
- **IaC scanning** (catch public buckets and open ports before they're created)
- **Signed and pinned** third-party actions and base images

## 8. Logging and detection

- Turn on **audit logs** (AWS CloudTrail, Azure Activity Log, Google Cloud Audit Logs).
- Alert on risky events: root logins, new admin users, disabled logging, unusual regions or spending spikes.
- Use the provider's security recommendations dashboard.

## 9. Compliance

Know the rules for the data you handle: Kenya's Data Protection Act, sector rules (banking, health, government), and standards like ISO 27001 or PCI DSS for card payments.

:::warning A leaked key costs money fast
Attackers scan public GitHub repositories for cloud keys and use them within minutes, often to run cryptocurrency miners on your account. If you ever push a key, revoke it immediately; deleting the commit isn't enough.
:::

:::think A developer's laptop with saved cloud access keys is stolen. What should the team do?
Immediately revoke and rotate all keys and sessions from that laptop, check audit logs for unusual activity since the theft, review billing for spikes, and reset passwords with MFA. Long term: use short-lived credentials and single sign-on with MFA, and encrypt laptops.
:::

## Summary

- MFA on everything, especially the root account; don't use root daily.
- Least-privilege IAM with roles and short-lived credentials.
- Secrets in a secrets manager, never in code; rotate and scan.
- Private networks, encryption in transit and at rest, no public buckets, security checks in CI/CD and audit logs with alerts.

```quiz
Q: What does MFA stand for? (three words)
A: multi-factor authentication | multi factor authentication | multifactor authentication
Q: Giving only the permissions needed is the principle of least ___ (one word)
A: privilege
Q: If a key leaks on GitHub, is deleting the commit enough? (yes or no)
A: no
```
