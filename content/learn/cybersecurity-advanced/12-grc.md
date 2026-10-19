---
slug: governance-risk-compliance
title: "Governance, risk and compliance (GRC): risk registers, policies, ISO 27001, NIST CSF 2.0 and Kenyan law"
after: cloud-mobile-security
---
# Governance, risk and compliance (GRC): risk registers, policies, ISO 27001, NIST CSF 2.0 and Kenyan law

Security isn't only technical. Organisations must decide which risks matter most, set rules, prove they follow laws and standards, and spend a limited budget wisely. That's **GRC**, a good path for people from business, audit, law or IT backgrounds.

## The three parts

| Part | Question it answers | Examples |
|---|---|---|
| **Governance** | Who decides and who is accountable? | Board oversight, security strategy, roles, policies |
| **Risk management** | What could go wrong, and what do we do about it? | Risk assessments, risk register, treatment plans |
| **Compliance** | Are we meeting laws, contracts and standards? | Data protection law, ISO 27001 audits, PCI DSS |

## Risk basics

**Risk = likelihood × impact.** A **threat** (e.g. ransomware gang) exploits a **vulnerability** (unpatched server) affecting an **asset** (customer database).

**Treatment options:**

| Option | Meaning | Example |
|---|---|---|
| **Mitigate** | Reduce it with controls | MFA, backups, training |
| **Transfer** | Share it with someone else | Cyber insurance, outsourcing to a provider (you stay accountable) |
| **Avoid** | Stop the risky activity | Don't store card numbers at all |
| **Accept** | Live with it, formally, with management sign-off | Low-impact risk where fixes cost more than the loss |

## Lab: a simple risk register (run it)

```try-python
risks = [
    ("Ransomware encrypts file server",        4, 5, "Offline backups, EDR, patching"),
    ("Phishing leads to email account takeover", 5, 4, "MFA, awareness training"),
    ("Laptop stolen from a matatu",            3, 3, "Disk encryption, remote wipe"),
    ("Website defaced via old plugin",         3, 2, "Auto-updates, WAF"),
    ("Power outage stops the till",            4, 2, "UPS, offline M-Pesa fallback"),
]

def level(score):
    return "HIGH" if score >= 15 else "MEDIUM" if score >= 8 else "LOW"

print(f"{'Risk':42} L  I  Score Level")
for name, likelihood, impact, controls in sorted(risks, key=lambda r: r[1] * r[2], reverse=True):
    s = likelihood * impact
    print(f"{name:42} {likelihood}  {impact}  {s:>4}  {level(s)}")
```

Likelihood and impact are rated 1–5. Phishing (5 × 4 = 20) and ransomware (4 × 5 = 20) are HIGH and get attention and budget first. A real register also lists the **risk owner**, planned controls, deadlines and the **residual risk** after controls.

## Frameworks and standards

| Framework | What it is |
|---|---|
| **ISO/IEC 27001:2022** | International standard for an Information Security Management System (ISMS); organisations can be **certified** by an accredited auditor. Its Annex A lists 93 controls |
| **NIST Cybersecurity Framework 2.0** (2024) | Free, flexible framework with six functions: **Govern, Identify, Protect, Detect, Respond, Recover** |
| **CIS Critical Security Controls v8** | 18 prioritised, practical controls; Implementation Group 1 is a good baseline for small organisations |
| **PCI DSS v4.0** | Required for organisations that store, process or transmit payment card data |
| **SOC 2** | Audit report on a service provider's controls, often asked for by international clients |

:::tip Start small
A small business doesn't need ISO certification to be secure. A one-page policy, MFA everywhere, updates, backups, and the CIS Controls IG1 cover most real-world risk.
:::

## Kenyan legal and regulatory landscape

| Law / body | Key points |
|---|---|
| **Data Protection Act, 2019** | Lawful processing, consent, data subject rights, security safeguards, breach notification; registration with the **ODPC** for many controllers and processors; fines and enforcement |
| **Computer Misuse and Cybercrimes Act, 2018** | Offences such as unauthorised access, interception, cyber harassment and computer fraud |
| **Kenya Information and Communications Act** | Telecoms and ICT regulation; the Communications Authority hosts the National KE-CIRT/CC |
| **Sector regulators** | Central Bank of Kenya (banks, payment providers, digital lenders), SASRA (SACCOs), IRA (insurers), CMA (capital markets) each set cybersecurity or risk expectations for their sectors |

International clients may also need compliance with laws like the EU's GDPR when handling EU residents' data.

## Essential policies

- **Information security policy** (the top-level commitment)
- **Acceptable use** (what staff may do with devices, email, internet)
- **Access control and passwords/MFA**
- **Data classification and handling** (public, internal, confidential)
- **Backup, business continuity and disaster recovery**: define **RTO** (how fast a system must be back) and **RPO** (how much data loss is acceptable, e.g. at most one day)
- **Incident response**
- **Third-party / vendor security** (suppliers with access to your systems or data)
- **Bring your own device (BYOD)**

Good policies are short, readable, approved by management, communicated, and reviewed yearly.

## Audits and evidence

Auditors want **evidence**, not promises: screenshots of MFA settings, access review records, training completion lists, backup restore test results, incident logs. Collecting evidence continuously makes audits far less painful.

## Security awareness

People are both the biggest risk and the best detectors. Effective programmes: short regular training, realistic phishing simulations (with consent from management and no shaming), an easy "report phishing" button, and praising people who report.

:::think A SACCO's manager says, "We bought cyber insurance, so we don't need MFA or backups." How do you respond?
Insurance transfers some financial loss but doesn't prevent incidents, downtime, data loss or regulatory penalties, and the SACCO remains accountable to members and the regulator. Many insurers also require controls such as MFA and backups before paying claims. Insurance should complement controls, not replace them.
:::

## Summary

- GRC = governance (accountability), risk management (likelihood × impact, treat risks) and compliance (laws and standards).
- Risk treatments: mitigate, transfer, avoid, accept.
- Key frameworks: ISO/IEC 27001, NIST CSF 2.0, CIS Controls, PCI DSS.
- In Kenya: Data Protection Act 2019 and ODPC, Computer Misuse and Cybercrimes Act 2018, plus sector regulators.

```quiz
Q: Risk equals likelihood times ___ (one word)
A: impact
Q: Buying cyber insurance is which risk treatment? (one word)
A: transfer | transferring | transference
Q: Which NIST CSF 2.0 function was added for oversight and strategy? (one word)
A: govern
```
