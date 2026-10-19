---
slug: cloud-mobile-security
title: "Cloud and mobile security: shared responsibility, cloud misconfigurations, IAM policies and securing mobile apps"
after: ethical-penetration-testing
---
# Cloud and mobile security: shared responsibility, cloud misconfigurations, IAM policies and securing mobile apps

Most organisations now run on cloud services and reach customers through phones. Both bring new risks, and most cloud breaches come from **misconfiguration**, not clever hacking. For the cloud setup side, see [Cloud security in the DevOps subject](./?track=devops-cloud&lesson=cloud-security).

## The shared responsibility model

| Who secures it | IaaS (virtual machines) | PaaS (managed app platforms) | SaaS (Microsoft 365, Google Workspace) |
|---|---|---|---|
| Physical data centres, hardware | Provider | Provider | Provider |
| Operating system patching | **You** | Provider | Provider |
| Application code | **You** | **You** | Provider |
| Data, user accounts, access settings | **You** | **You** | **You** |

Whatever the service, **you** always own your data, your users and who has access.

## Top cloud risks and fixes

| Risk | Fix |
|---|---|
| Public storage buckets exposing files | Block public access by default; review sharing settings |
| Over-permissive IAM roles (`"*"` everywhere) | Least privilege; review unused permissions |
| No MFA on the root/owner account | Enforce MFA, lock root credentials away, use separate admin accounts |
| Leaked access keys in code or GitHub | Secrets managers, short-lived credentials, secret scanning, rotate keys |
| Logging turned off | Enable CloudTrail / Azure activity logs / Google Cloud audit logs, send them to a SIEM |
| Open security groups (SSH or databases to 0.0.0.0/0) | Restrict by IP, use private networks and bastions or managed access |
| Unencrypted data | Turn on encryption at rest (usually a setting) and TLS in transit |

**Cloud Security Posture Management (CSPM)** tools (AWS Security Hub, Microsoft Defender for Cloud, Google Security Command Center, or open-source Prowler) continuously check accounts against best-practice benchmarks such as the **CIS Benchmarks**.

## Lab: spot risky IAM policy statements (run it)

Cloud permissions are written as JSON policies. Wildcards (`*`) are a common red flag.

```try-python
import json

policy = json.loads("""
{
  "Statement": [
    {"Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::school-reports/*"},
    {"Effect": "Allow", "Action": "*", "Resource": "*"},
    {"Effect": "Allow", "Action": "iam:*", "Resource": "*"},
    {"Effect": "Allow", "Action": ["ec2:StartInstances", "ec2:StopInstances"], "Resource": "arn:aws:ec2:*:*:instance/web-01"}
  ]
}
""")

for i, st in enumerate(policy["Statement"], 1):
    actions = st["Action"] if isinstance(st["Action"], list) else [st["Action"]]
    problems = []
    if "*" in actions:
        problems.append("allows ALL actions")
    elif any(a.endswith(":*") for a in actions):
        problems.append("allows every action in a service")
    if st["Resource"] == "*":
        problems.append("applies to ALL resources")
    print(f"Statement {i}:", "; ".join(problems) if problems else "looks scoped")
```

Statements 2 and 3 are dangerous: full admin, and full control of identities (anyone with `iam:*` can make themselves an admin). Statements 1 and 4 are limited to specific actions and resources.

## Containers and Kubernetes, briefly

- Use minimal, trusted base images; scan images (Trivy, Grype).
- Don't run containers as root; don't bake secrets into images.
- Kubernetes: RBAC, network policies, keep the API server private, and keep clusters updated.

## Mobile security

Phones hold banking, M-Pesa, email and work data, which makes them high-value targets.

**For users and organisations:**
- Install apps only from official stores; be very wary of APK files shared on WhatsApp or websites (a common way fake "loan" and "update" apps spread malware).
- Review app permissions: a torch app doesn't need your contacts or SMS.
- Keep the OS updated; replace phones that no longer get security updates.
- Use screen locks, biometrics, and remote wipe ("Find My Device" / "Find My").
- Organisations: **mobile device management (MDM)** to enforce PINs, encryption and work profiles.

**For developers:** the **OWASP Mobile Application Security Verification Standard (MASVS)** and **Mobile Top 10** list key requirements:
- Store sensitive data in the platform's secure storage (Android Keystore, iOS Keychain), not plain files or logs.
- Use HTTPS everywhere; consider certificate pinning for high-risk apps.
- Never put API secrets inside the app: anything in an app can be extracted. Keep secrets on the server.
- Enforce authorisation on the server; the app's checks can be bypassed.
- Protect against tampering on high-value apps (root/jailbreak detection, integrity checks) as an extra layer, not the only defence.

:::kenya
Fake loan apps that harvest contacts and send shaming messages have been a real problem in Kenya. The Data Protection Act and ODPC enforcement apply to apps collecting Kenyans' data, and digital lenders must be licensed by the Central Bank of Kenya. As a developer, collect only the permissions and data you truly need.
:::

:::think A startup's developer committed an AWS access key to a public GitHub repository, then deleted it in the next commit. Are they safe?
No. The key is still in the repository history, and bots scan GitHub for keys within minutes. They should immediately deactivate and rotate the key, review CloudTrail for any use of it (new instances, users, data access), remove it from history if possible, and switch to a secrets manager or short-lived credentials with secret scanning turned on.
:::

## Summary

- Shared responsibility: the provider secures the cloud; you secure your data, identities and configuration.
- Misconfigurations (public storage, wildcard permissions, leaked keys, no logging) cause most cloud breaches; CSPM tools help.
- Mobile users: official stores, minimal permissions, updates, MDM.
- Mobile developers: follow OWASP MASVS, use secure storage, keep secrets on the server.

```quiz
Q: In the cloud, who is always responsible for your data and access settings? (one word)
A: you | customer | the customer
Q: Which character in an IAM policy is a common red flag? (symbol name or symbol)
A: * | asterisk | wildcard
Q: Which OWASP standard covers mobile app security? (acronym)
A: masvs
```
