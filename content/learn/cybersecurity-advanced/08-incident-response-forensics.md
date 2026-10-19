---
slug: incident-response-forensics
title: "Incident response and digital forensics: the IR lifecycle, playbooks, evidence, timelines and reporting in Kenya"
after: siem-soc-monitoring
---
# Incident response and digital forensics: the IR lifecycle, playbooks, evidence, timelines and reporting in Kenya

When an attack gets through, a calm, practised response limits the damage. This lesson builds on the [incident response basics](./?track=cybersecurity&lesson=incident-response) with the methods professionals use.

## The incident response lifecycle

NIST's incident handling guide (SP 800-61) describes the classic cycle:

| Phase | Key actions |
|---|---|
| **1. Preparation** | IR plan, team and contacts, playbooks, logging, backups, practice exercises |
| **2. Detection and analysis** | Confirm the incident, scope it, rate severity, start notes |
| **3. Containment, eradication and recovery** | Stop the spread, remove the cause, restore safely |
| **4. Post-incident activity** | Lessons learned, fix root causes, update the plan |

:::note
NIST published Revision 3 of SP 800-61 in 2025, which maps incident response onto the NIST Cybersecurity Framework 2.0 functions (Govern, Identify, Protect, Detect, Respond, Recover). The four phases above remain the most widely taught model.
:::

## Containment choices

| Short-term | Long-term |
|---|---|
| Isolate the device from the network (EDR "isolate" or unplug the network cable) | Rebuild affected systems from clean images |
| Disable compromised accounts, revoke sessions and tokens | Reset passwords and keys broadly |
| Block malicious IPs and domains | Patch the exploited weakness |

:::warning Don't destroy evidence
Avoid switching off a suspected compromised computer or reinstalling it straight away: memory contents (running malware, network connections, encryption keys) are lost at power-off. Isolate it from the network first, then collect evidence or call specialists. If ransomware is actively encrypting shared drives, stopping the damage comes first.
:::

## Playbooks

A playbook is a step-by-step checklist for a common incident. Example: **business email compromise**.

1. Reset the password, revoke all sessions, re-register MFA.
2. Check and remove inbox forwarding and delete rules.
3. Review sign-in logs for the attacker's IPs; search for other affected accounts.
4. Find emails sent by the attacker; warn recipients (especially about payment changes).
5. Contact the bank immediately if money was sent.
6. Assess whether personal data was exposed (legal notification duties below).
7. Record everything; hold a lessons-learned meeting.

Write playbooks for ransomware, lost or stolen laptop, malware on a PC, website defacement and data leaks too.

## Digital forensics basics

Forensics answers **what happened, when, how and who**, in a way that can stand up in court or a disciplinary hearing.

- **Order of volatility:** collect the most short-lived evidence first: memory, running processes and network connections, then disk, then logs and backups.
- **Forensic images:** make a bit-by-bit copy and analyse the copy, never the original. Hardware **write blockers** stop accidental changes.
- **Hash everything:** record a SHA-256 hash when you collect evidence; matching hashes later prove it wasn't altered.
- **Chain of custody:** a record of who handled the evidence, when, and why, from collection to court.
- Common tools: FTK Imager (imaging), Autopsy (disk analysis), Volatility (memory analysis), Velociraptor and KAPE (fast collection from many machines).

## Lab: prove evidence wasn't changed (run it)

```try-python
import hashlib

evidence = b"Exported mailbox rules: forward all mail to payments.update@example.net"
collected_hash = hashlib.sha256(evidence).hexdigest()
print("Hash at collection:", collected_hash[:32], "...")

# Weeks later, before presenting it:
same_file = b"Exported mailbox rules: forward all mail to payments.update@example.net"
edited_file = b"Exported mailbox rules: forward all mail to payment.update@example.net"

for label, data in [("Unchanged copy", same_file), ("Edited copy", edited_file)]:
    match = hashlib.sha256(data).hexdigest() == collected_hash
    print(f"{label:15} hash matches: {match}")
```

Removing a single letter changes the hash completely, so any tampering is obvious.

## Lab: build an incident timeline (run it)

Investigators merge events from many logs into one timeline.

```try-python
events = [
    ("2026-10-14 09:12", "Email gateway", "Phishing email delivered to j.mutua"),
    ("2026-10-14 09:20", "Identity logs", "j.mutua signs in from a new country"),
    ("2026-10-14 09:15", "Proxy logs", "j.mutua opens a fake login page"),
    ("2026-10-14 09:24", "Mailbox audit", "Forwarding rule created on j.mutua"),
    ("2026-10-15 11:02", "Finance", "Supplier payment sent to new bank account"),
]
for when, source, what in sorted(events):
    print(when, "|", source.ljust(13), "|", what)
```

Sorted by time, the story is clear: phishing email, fake login page, stolen login, forwarding rule, fraudulent payment. That tells you which controls failed (email filtering, MFA, payment verification).

## Reporting incidents in Kenya

- **Personal data breaches:** under the **Data Protection Act, 2019**, a data controller must notify the **Office of the Data Protection Commissioner (ODPC)** within **72 hours** of becoming aware of a breach that risks people's rights, and tell affected people when there is a real risk of harm. A data processor must tell the controller within 48 hours. See [Data protection in Kenya](./?track=cybersecurity&lesson=data-protection-kenya).
- **Cyber incidents:** the **National KE-CIRT/CC** (Kenya's national computer incident response team, run by the Communications Authority of Kenya) receives incident reports and shares advisories.
- **Crimes:** report fraud and cybercrime to the police (the DCI has a cybercrime unit). The Computer Misuse and Cybercrimes Act also created the National Computer and Cybercrimes Coordination Committee (NC4).
- **Regulated sectors** (banks, SACCOs, insurers, telcos) have extra reporting rules from their regulators.
- Contact your bank immediately in any payment fraud: speed improves the chance of stopping funds.

## Post-incident review

Hold a blameless lessons-learned meeting within about two weeks:
- What happened and when (the timeline)?
- What went well? What was slow or missing?
- Root cause and contributing factors.
- Actions with owners and deadlines (e.g. enforce MFA, add a detection rule, verify bank-detail changes by phone).

:::think A school's office PC shows a ransom note and files on the shared drive are being renamed. The bursar wants to switch everything off and reinstall Windows tonight. What's the better order of actions?
First disconnect the PC (and other affected machines) from the network to stop the spread, without wiping anything. Alert the IR lead or IT support, record what's on screen (photo), preserve evidence where possible, and identify the scope. Check backups are safe and offline. Then eradicate (rebuild from clean images), restore from verified backups, reset passwords, consider ODPC notification if learner or staff personal data was affected, and hold a lessons-learned review.
:::

## Summary

- IR lifecycle: preparation, detection and analysis, containment/eradication/recovery, post-incident activity.
- Playbooks make responses fast and consistent.
- Forensics: order of volatility, forensic images, hashing and chain of custody.
- In Kenya: notify the ODPC within 72 hours for qualifying personal data breaches; KE-CIRT/CC handles national cyber incident reports.

```quiz
Q: Within how many hours must a qualifying breach be reported to Kenya's ODPC? (number)
A: 72
Q: The record of who handled evidence and when is the chain of ___ (one word)
A: custody
Q: Which evidence should be collected first: memory or disk? (one word)
A: memory | ram
```
