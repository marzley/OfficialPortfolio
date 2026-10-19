---
slug: siem-soc-monitoring
title: "Security monitoring: logs, SIEM, the SOC, alert triage and writing detection rules"
after: network-defence-zero-trust
---
# Security monitoring: logs, SIEM, the SOC, alert triage and writing detection rules

Prevention eventually fails. Monitoring is how organisations notice an attack early, while it can still be stopped. This is the daily work of a **SOC analyst**, the most common entry-level security job.

## What to log

| Source | Useful events |
|---|---|
| Identity (Entra ID, Google Workspace, Active Directory) | Logins, failures, MFA changes, new admins |
| Endpoints (Windows, Linux, EDR) | New processes, PowerShell, new services, antivirus alerts |
| Network (firewall, DNS, proxy, VPN) | Connections, blocked traffic, unusual domains |
| Cloud (AWS CloudTrail, Azure activity logs) | New users, keys, public storage, configuration changes |
| Applications | Logins, errors, admin actions, payments |

Good logs record **who, what, when, where (IP/device) and result**, with accurate time (sync clocks with NTP). Keep logs long enough to investigate (often 90 days to a year or more) and protect them from tampering.

## SIEM

A **SIEM** (Security Information and Event Management) collects logs from everywhere, normalises them, correlates them and raises alerts.

- Commercial: Microsoft Sentinel, Splunk, Google Security Operations, IBM QRadar.
- Free/open-source: **Wazuh** (great for home labs), Elastic Security, Security Onion.
- **SOAR** tools automate responses (e.g. disable an account, block an IP) once an alert is confirmed.
- **EDR/XDR** tools watch endpoints in detail and can isolate infected devices.

## The SOC

A **Security Operations Centre** monitors and responds, often 24/7.

| Tier | Role |
|---|---|
| Tier 1 | Triage alerts: real or false positive? Escalate when needed |
| Tier 2 | Deeper investigation and response |
| Tier 3 | Threat hunting, advanced analysis, detection engineering |

## Alert triage

For each alert ask:
1. **What happened?** Read the raw events, not just the alert title.
2. **Is it expected?** Check with the user or asset owner, change tickets, known admin activity.
3. **What's the scope?** Other users, devices or IPs involved?
4. **How bad?** Critical asset? Data accessed?
5. **Decide:** close as false positive (and tune the rule), or escalate to incident response.
6. **Document** what you checked and why you decided.

| Term | Meaning |
|---|---|
| True positive | Real malicious activity correctly alerted |
| False positive | Alert, but harmless (too many cause "alert fatigue") |
| False negative | Attack missed, no alert (the most dangerous) |

## Lab: detect "impossible travel" logins (run it)

A detection rule: the same user logging in from two countries too far apart to travel between in the time available.

```try-python
from datetime import datetime

logins = [
    ("akinyi", "2026-10-19 08:05", "Kenya"),
    ("akinyi", "2026-10-19 08:40", "Netherlands"),
    ("mwangi", "2026-10-19 09:00", "Kenya"),
    ("mwangi", "2026-10-19 17:30", "Uganda"),
    ("akinyi", "2026-10-19 12:00", "Kenya"),
]
MIN_HOURS_BETWEEN_COUNTRIES = 4   # simplified rule

last = {}
for user, when, country in sorted(logins, key=lambda r: r[1]):
    t = datetime.strptime(when, "%Y-%m-%d %H:%M")
    if user in last:
        prev_t, prev_country = last[user]
        hours = (t - prev_t).total_seconds() / 3600
        if country != prev_country and hours < MIN_HOURS_BETWEEN_COUNTRIES:
            print(f"ALERT {user}: {prev_country} -> {country} in {hours:.1f} h")
    last[user] = (t, country)
print("Check complete")
```

It alerts on akinyi (Kenya to the Netherlands in 0.6 hours) and again when akinyi appears back in Kenya at 12:00, 3.3 hours after the Netherlands login. Mwangi's Uganda login 8.5 hours later is plausible travel, so no alert. In real life an analyst would check whether the Netherlands login came from a VPN before deciding.

## Detection rules

Rules are written in the SIEM's language, for example **KQL** (Microsoft Sentinel), **SPL** (Splunk) or the vendor-neutral **Sigma** format. A Sigma-style rule describing the brute-force idea:

```text
title: Many failed logins from one source
logsource:
  product: linux
  service: sshd
detection:
  selection:
    message|contains: 'Failed password'
  condition: selection | count() by source_ip > 5
level: medium
```

Good detections are mapped to MITRE ATT&CK techniques, tested, tuned to reduce false positives, and documented with triage steps.

## Threat hunting

Instead of waiting for alerts, hunters form a hypothesis ("attackers may be using stolen VPN accounts at night") and search the logs to prove or disprove it. Findings become new detection rules.

:::career
Build a home SOC lab: install Wazuh (or Elastic) in a VM, send logs from a Windows and a Linux VM, generate harmless test events (failed logins, new users) and write up how you detected them. That write-up is a strong portfolio piece for SOC analyst applications.
:::

:::think At 3 a.m. the SIEM alerts that the finance manager's account logged in from a new country and created an inbox rule forwarding all emails to an outside address. Is this likely a false positive? What should happen?
Very likely a true positive: a new-country login plus a forwarding rule is a classic business email compromise pattern. Escalate as an incident: disable or reset the account and revoke sessions, remove the rule, check MFA settings, review what was accessed or sent, and warn finance to verify any payment requests by phone.
:::

## Summary

- Log identity, endpoint, network, cloud and application events with accurate timestamps.
- A SIEM collects and correlates logs; SOAR automates responses; EDR watches endpoints.
- SOC analysts triage alerts, documenting each decision; tune rules to cut false positives.
- Detection rules (KQL, SPL, Sigma) and threat hunting find attacks early.

```quiz
Q: Which tool collects and correlates logs to raise alerts? (acronym)
A: siem
Q: An alert on harmless activity is a false ___ (one word)
A: positive
Q: Name a free SIEM-style tool good for home labs (one word)
A: wazuh | elastic | security onion
```
