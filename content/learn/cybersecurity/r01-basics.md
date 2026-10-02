---
slug: basics
title: "Cybersecurity basics: the CIA triad, threats, vulnerabilities, risk, attackers and the core defences"
after: KEEP
---
# Cybersecurity basics: the CIA triad, threats, vulnerabilities, risk, attackers and the core defences

**Cybersecurity** is protecting computers, phones, networks, accounts and data from attack, damage and unauthorised access. It affects everyone: an individual losing M-Pesa savings to a SIM-swap scam, a school whose records are encrypted by ransomware, a business whose website is defaced, a hospital whose patient data leaks, a county whose services go offline. Kenya's rapid digital growth (mobile money, eCitizen, online banking, e-commerce) makes it a big target, and the national cybersecurity agencies regularly report many millions of cyber threat events each quarter.

This first unit builds the vocabulary and thinking you'll use throughout the subject.

:::note What you will learn
- Why cybersecurity matters to individuals, businesses and Kenya
- The CIA triad (and AAA)
- Assets, threats, vulnerabilities, exploits and risk
- Who attacks and why
- Common attack types at a glance
- Defence in depth and the core controls
- The human factor
- Kenyan laws and bodies: Computer Misuse and Cybercrimes Act, Data Protection Act, KE-CIRT/CC
- Your personal security baseline
:::

## Why it matters

| Who | What's at stake |
|---|---|
| **Individuals** | Money (M-Pesa, bank), social media accounts, photos, identity, reputation |
| **Small businesses** | Customer data, payments, websites, the business's survival after ransomware |
| **Large organisations** | Millions of customer records, operations, regulatory fines, trust |
| **Government and critical services** | Citizens' data, power, water, health, elections |

## The CIA triad

Every security decision protects one or more of three goals:

| Goal | Meaning | Example attack | Example control |
|---|---|---|---|
| **Confidentiality** | Only authorised people can see data | Data breach, eavesdropping on Wi-Fi | Encryption, passwords, access permissions |
| **Integrity** | Data isn't altered without authorisation | Changing bank details on an invoice, defacing a website | Hashes, digital signatures, change logs, backups |
| **Availability** | Systems and data are there when needed | Ransomware, DDoS attacks, hardware failure | Backups, redundancy, DDoS protection, patching |

Related: **AAA** = **Authentication** (proving who you are), **Authorisation** (what you're allowed to do), **Accounting** (logging what you did). And **non-repudiation**: proof someone did something (e.g. a digitally signed transaction) so they can't deny it.

## Key terms

| Term | Meaning | Example |
|---|---|---|
| **Asset** | Something valuable to protect | Customer database, laptop, M-Pesa account, reputation |
| **Threat** | Something that could cause harm | A criminal, malware, a fire, a careless employee |
| **Vulnerability** | A weakness | Unpatched software, weak password, open port, untrained staff |
| **Exploit** | A method/tool that uses a vulnerability | Code that abuses a known bug in an old router |
| **Risk** | Likelihood × impact of a threat exploiting a vulnerability | High: an unpatched public website holding ID numbers |
| **Control** | A measure that reduces risk | Patching, MFA, backups, training |
| **Attack surface** | All the points an attacker could try | Every open port, login page, staff email, USB port |
| **Zero-day** | A vulnerability with no fix available yet | Rare, valuable to attackers |

### Managing risk

Organisations can **mitigate** (reduce with controls), **transfer** (insurance, outsourcing), **avoid** (stop the risky activity) or **accept** (live with small risks) each risk. Fix the biggest risks first.

```try-python
# A simple risk register: likelihood and impact from 1 (low) to 5 (high)
risks = [
    ("Staff fall for phishing", 5, 4),
    ("Ransomware encrypts file server", 3, 5),
    ("Website defaced via old plugin", 3, 3),
    ("Laptop stolen (unencrypted)", 2, 4),
    ("Server room flood", 1, 5),
]
for name, likelihood, impact in sorted(risks, key=lambda r: -(r[1] * r[2])):
    score = likelihood * impact
    level = "HIGH" if score >= 15 else "MEDIUM" if score >= 8 else "LOW"
    print(f"{score:2}  {level:6} {name}")
```

## Who attacks and why

| Attacker | Motivation | Typical attacks |
|---|---|---|
| **Cybercriminals** | Money | Phishing, ransomware, M-Pesa and bank fraud, card theft, selling data |
| **Scammers** | Money | Fake jobs, investment fraud, social engineering (see the scams lessons) |
| **Hacktivists** | Political or social causes | Website defacement, DDoS, data leaks |
| **Insiders** | Revenge, money, or accident | Data theft, sabotage, accidental leaks |
| **Nation-state groups** | Espionage, disruption | Advanced, persistent attacks on governments and critical infrastructure |
| **Script kiddies** | Fun, reputation | Using ready-made tools against easy targets |

Most attacks on individuals and small businesses are **opportunistic**: automated tools scan for easy targets (default passwords, unpatched sites, people who click). You don't need to be "important" to be attacked; you need to be **not easy**.

## Common attack types at a glance

| Attack | What it is | Lesson |
|---|---|---|
| Phishing and social engineering | Tricking people into giving information or access | Phishing lessons |
| Malware and ransomware | Malicious software; ransomware encrypts files for payment | Malware, backups |
| Password attacks | Guessing, credential stuffing with leaked passwords | Passwords and 2FA |
| SIM swap | Taking over your phone number to steal M-Pesa/bank access | Social engineering |
| Web attacks | SQL injection, XSS, broken access control | Web security |
| DoS/DDoS | Overwhelming a service with traffic | Networking security |
| Man-in-the-middle | Intercepting traffic, e.g. on fake Wi-Fi | Encryption and HTTPS |

## Defence in depth

No single control stops everything. Layer them:

| Layer | Controls |
|---|---|
| **People** | Awareness training, clear policies, reporting culture |
| **Identity** | Strong unique passwords, password managers, MFA, least privilege |
| **Devices** | Updates, antivirus/EDR, encryption, screen locks, app store installs only |
| **Network** | Firewalls, segmentation, secure Wi-Fi, VPN |
| **Applications** | Secure coding, patching plugins, WAF |
| **Data** | Encryption, access control, backups (3-2-1) |
| **Monitoring and response** | Logs, alerts, an incident response plan |

Security controls are also grouped as **preventive** (stop attacks: MFA, firewalls), **detective** (spot them: logs, alerts, antivirus), and **corrective** (recover: backups, incident response).

## The human factor

Most successful attacks involve a human mistake: clicking a phishing link, reusing a password, sharing an OTP, installing a fake app. Technology helps, but **awareness** and a culture where people report mistakes quickly (without fear) are among the most effective defences.

## Kenyan laws and bodies

| Law/body | What it does |
|---|---|
| **Computer Misuse and Cybercrimes Act, 2018** | Makes unauthorised access, interception, computer fraud, cyber harassment and related acts crimes |
| **Data Protection Act, 2019** | Rules for handling personal data; enforced by the **Office of the Data Protection Commissioner (ODPC)**; breaches must be reported |
| **National KE-CIRT/CC** (under the Communications Authority of Kenya) | National cyber incident response team: advisories, incident coordination |
| **DCI** (Directorate of Criminal Investigations) | Investigates cybercrime reports |

Because unauthorised access is a crime, **ethical hackers always need written permission** before testing any system they don't own.

## Your personal security baseline

1. Use a **password manager** and unique passwords; turn on **2FA** for email, M-Pesa-linked accounts, banking and social media.
2. **Update** your phone, computer, browser and apps promptly.
3. Install apps only from official stores; avoid "modded" APKs.
4. Never share **PINs, passwords or OTP codes**, with anyone.
5. **Back up** important files (cloud + an offline copy).
6. Be suspicious of urgency, unexpected links and "too good to be true" offers.
7. Lock devices with a PIN/biometric; enable find-my-device and remote wipe.

:::think A small pharmacy keeps customer records on one laptop with no password, never updates it, and has no backup. Using the terms threat, vulnerability and risk, describe its situation and two priority fixes.
Vulnerabilities: no login password, unpatched software, no backups. Threats: theft, malware/ransomware, hardware failure. Risk: high, because likely events would cause serious impact (losing or leaking patient data, plus Data Protection Act obligations). Priority fixes: regular backups (3-2-1) and securing the device (strong login, updates, disk encryption, antivirus).
:::

## Summary

- Cybersecurity protects people, businesses and government from digital harm; everyone is a potential target.
- The CIA triad: confidentiality, integrity, availability; AAA: authentication, authorisation, accounting.
- Risk = likelihood × impact of a threat exploiting a vulnerability; mitigate, transfer, avoid or accept.
- Attackers range from criminals and scammers to insiders and nation-states; most attacks are opportunistic.
- Defence in depth layers people, identity, devices, network, applications, data and monitoring; Kenyan law criminalises unauthorised access and requires data protection.

```quiz
Q: What do the letters CIA stand for in security? (three words)
A: confidentiality integrity availability | confidentiality, integrity, availability
Q: A weakness such as unpatched software is called a …?
A: vulnerability
Q: Tricking someone into revealing information is called …?
A: phishing | social engineering
Q: Risk is roughly likelihood multiplied by what?
A: impact
Q: Which Kenyan office enforces the Data Protection Act? (abbreviation)
A: ODPC | office of the data protection commissioner
Q: A vulnerability with no fix available yet is called a what? (hyphenated)
A: zero-day | zero day
```
