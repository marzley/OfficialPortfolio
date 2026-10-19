---
slug: threat-landscape-attack-lifecycle
title: "How attacks happen: threat actors, the attack lifecycle and MITRE ATT&CK"
after: advanced-cyber-start-here
---
# How attacks happen: threat actors, the attack lifecycle and MITRE ATT&CK

Defenders who understand how attackers think can stop attacks earlier. This lesson explains **who** attacks, **why**, and **how** attacks unfold step by step.

## Threat actors

| Actor | Motive | Typical targets |
|---|---|---|
| **Cybercriminals** | Money | Businesses, banks, mobile money users (ransomware, fraud, data theft) |
| **Fraud gangs / social engineers** | Money | Individuals: SIM swap, fake M-Pesa messages, impersonation |
| **Hacktivists** | Politics or causes | Government and corporate websites (defacement, DDoS, leaks) |
| **Nation-state groups** | Espionage, disruption | Governments, critical infrastructure, telecoms |
| **Insiders** | Money, revenge, mistakes | Their own organisation |
| **Script kiddies** | Curiosity, fame | Easy, poorly protected targets |

## Common attacks seen in Kenya and the region

- **Business email compromise (BEC):** criminals take over or fake an email account and redirect supplier payments.
- **Ransomware:** files encrypted and data stolen; payment demanded.
- **SIM swap and mobile money fraud:** taking over a phone number to reset accounts.
- **Phishing and smishing:** fake bank, KRA, eCitizen or delivery messages.
- **Website attacks:** outdated WordPress plugins, weak admin passwords.
- **Insider fraud:** staff abusing access to systems.

## The attack lifecycle (cyber kill chain)

Lockheed Martin's **Cyber Kill Chain** describes attack stages:

| Stage | Attacker does | Defender opportunity |
|---|---|---|
| 1. Reconnaissance | Researches the target (staff names, emails, systems) | Limit public information; monitor for scanning |
| 2. Weaponisation | Prepares a malicious file or link | Threat intelligence |
| 3. Delivery | Sends phishing email, malicious link, exploit | Email filtering, user training |
| 4. Exploitation | Gets code to run or tricks a user | Patching, secure configuration |
| 5. Installation | Installs malware or a backdoor | Endpoint protection, application control |
| 6. Command and control | Remote control of the victim system | Network monitoring, DNS filtering |
| 7. Actions on objectives | Steals data, encrypts files, moves money | Data loss prevention, backups, detection |

**Key idea:** break any link and the attack fails. The earlier you detect, the cheaper the incident.

## MITRE ATT&CK: a map of real attacker behaviour

**MITRE ATT&CK** (attack.mitre.org) is a free knowledge base of tactics and techniques seen in real attacks:

- **Tactics:** the attacker's goal at each step (e.g. Initial Access, Persistence, Privilege Escalation, Credential Access, Lateral Movement, Exfiltration, Impact).
- **Techniques:** how they achieve it (e.g. *Phishing*, *Valid Accounts*, *Brute Force*, *Data Encrypted for Impact*), each with an ID such as T1566 (Phishing).

Defenders use ATT&CK to:
- Check which techniques they can **detect** and which they can't (coverage gaps)
- Write **detection rules** for specific techniques
- Describe incidents in a common language
- Plan **security tests** that mimic real attackers

## Map an incident to ATT&CK (run it)

```try-python
incident = [
    ("Staff member clicked a fake 'invoice' email link", "Initial Access", "Phishing (T1566)"),
    ("Attacker logged in with the stolen password", "Initial Access / Persistence", "Valid Accounts (T1078)"),
    ("Created an email rule hiding replies from the bank", "Defense Evasion", "Email hiding rules (T1564.008)"),
    ("Sent the finance team new 'bank details' for a supplier", "Impact", "Financial theft (T1657)"),
]

print("Business email compromise, step by step:\n")
for i, (event, tactic, technique) in enumerate(incident, 1):
    print(f"{i}. {event}")
    print(f"   Tactic: {tactic} | Technique: {technique}")

print("\nControls that would have broken the chain:")
for c in ["Phishing training and email filtering", "MFA on email accounts", "Alerts for new mailbox rules", "Phone call-back to verify any change of bank details"]:
    print(" -", c)
```

## Defence in depth

No single control stops everything. Layer them: training, email filtering, MFA, patching, endpoint protection, network segmentation, monitoring, backups and an incident response plan. If one layer fails, the next can still stop or detect the attack.

:::think A SACCO's finance officer receives an email from a "regular supplier" with new bank account details for payment. What should the SACCO's process be?
Never change payment details based on email alone. Call the supplier on a phone number already on file (not one in the email), confirm the change, require approval by a second person, and watch for urgency and pressure. This simple control stops most business email compromise fraud.
:::

## Summary

- Threat actors include criminals, fraud gangs, hacktivists, nation-states, insiders and script kiddies.
- The kill chain shows attack stages; breaking any stage stops the attack.
- MITRE ATT&CK maps real tactics and techniques; defenders use it for detection and testing.
- Use defence in depth: layered controls.

```quiz
Q: What is the first stage of the cyber kill chain? (one word)
A: reconnaissance | recon
Q: Which free knowledge base maps attacker tactics and techniques? (two words: MITRE ___)
A: att&ck | attack | mitre attack | mitre att&ck
Q: Should you change a supplier's bank details based only on an email? (yes or no)
A: no
```
