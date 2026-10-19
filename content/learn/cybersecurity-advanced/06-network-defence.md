---
slug: network-defence-zero-trust
title: "Network defence: firewalls, segmentation, IDS/IPS, VPNs, zero trust and detecting brute-force attacks"
after: web-application-security
---
# Network defence: firewalls, segmentation, IDS/IPS, VPNs, zero trust and detecting brute-force attacks

Networks connect everything, which is why attackers try to move through them once inside. Good network defence makes the first step hard and every following step noisy.

## Defence in depth

No single control is enough. Layer them:

| Layer | Examples |
|---|---|
| Perimeter | Firewall, email filtering, web filtering |
| Network | Segmentation, VLANs, IDS/IPS |
| Endpoint | EDR/antivirus, patching, disk encryption |
| Identity | MFA, least privilege |
| Application | Secure code, WAF |
| Data | Encryption, backups, access controls |
| People | Training, phishing awareness |

## Firewalls

- **Packet filtering / stateful firewalls** allow or block traffic by IP address, port and protocol, and track connections.
- **Next-generation firewalls (NGFW)** also understand applications, users and threats.
- **Web application firewalls (WAF)** sit in front of websites and block common web attacks.
- **Default deny:** block everything, then allow only what's needed. Review rules regularly and remove old ones.

Example host firewall on Ubuntu (on a server you manage):

```text
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp        # SSH (better: only from your office IP)
sudo ufw allow 443/tcp       # HTTPS
sudo ufw enable
```

## Segmentation

Split the network so a compromised device can't reach everything:
- Separate **guest Wi-Fi**, staff devices, servers, CCTV/IoT and payment systems (VLANs).
- Put public servers in a **DMZ**.
- Restrict admin access to management networks or jump hosts.
- In a cyber café, school or small office: guests should never be on the same network as the office PCs or the M-Pesa till computer.

## IDS and IPS

- **IDS (intrusion detection system):** watches traffic and alerts on suspicious patterns.
- **IPS (intrusion prevention system):** can also block it.
- Open-source examples: **Suricata**, **Snort**, **Zeek** (network monitoring and logs).
- Detection uses **signatures** (known bad patterns) and **anomalies** (unusual behaviour).

## Secure remote access

- **VPNs** (WireGuard, OpenVPN, or a vendor VPN) with MFA, kept patched; VPN appliances are a common attack target.
- Never expose **RDP (port 3389)** or databases directly to the internet.
- SSH: keys instead of passwords, disable root login, use fail2ban or similar, restrict by IP.

## Zero trust

"Never trust, always verify." Being inside the office network no longer means being trusted.

| Old model | Zero trust |
|---|---|
| Trust everything inside the firewall | Verify every request, wherever it comes from |
| VPN gives broad network access | Access per application, per user |
| Check once at login | Continuously check user, device health and context |

Key ingredients: strong identity with MFA, device health checks, least privilege, micro-segmentation, and logging everything. NIST SP 800-207 describes zero trust architecture.

## Lab: detect a brute-force attack in logs (run it)

Servers log failed logins. A burst of failures from one address is a classic brute-force signal.

```try-python
from collections import Counter

log = """Oct 19 10:01:02 srv sshd: Failed password for root from 203.0.113.45
Oct 19 10:01:04 srv sshd: Failed password for admin from 203.0.113.45
Oct 19 10:01:06 srv sshd: Failed password for root from 203.0.113.45
Oct 19 10:01:09 srv sshd: Accepted publickey for wanjiku from 198.51.100.7
Oct 19 10:01:11 srv sshd: Failed password for test from 203.0.113.45
Oct 19 10:01:13 srv sshd: Failed password for oracle from 203.0.113.45
Oct 19 10:01:15 srv sshd: Failed password for root from 203.0.113.45
Oct 19 10:02:30 srv sshd: Failed password for kamau from 198.51.100.20"""

failures = Counter()
for line in log.splitlines():
    if "Failed password" in line:
        ip = line.split(" from ")[-1]
        failures[ip] += 1

THRESHOLD = 5
for ip, count in failures.most_common():
    status = "ALERT: possible brute force" if count >= THRESHOLD else "ok"
    print(f"{ip:15} {count} failures  {status}")
```

The output flags `203.0.113.45` (6 failures, trying common usernames like root, admin and oracle) and treats `198.51.100.20` (1 failure, probably a typo) as normal. Tools like fail2ban do exactly this and block the address automatically.

:::note
The addresses 203.0.113.x and 198.51.100.x are reserved for documentation, so examples never point at real systems.
:::

:::kenya
Many Kenyan SMEs expose their router admin page, CCTV recorder or RDP to the internet with default passwords. Quick wins for any client: change defaults, update router firmware, disable remote admin, separate guest Wi-Fi, and close unused ports.
:::

:::think An office has one Wi-Fi network shared by staff laptops, visitors' phones, CCTV cameras and the accounts PC. Name three improvements.
Separate networks (VLANs or SSIDs) for guests, staff, CCTV/IoT and the accounts PC; firewall rules so guests and cameras can't reach staff or accounts systems; change default passwords and update firmware on the router and cameras. Adding MFA on accounts and monitoring logs would also help.
:::

## Summary

- Defence in depth layers controls from the perimeter to the data.
- Default-deny firewalls, segmentation, IDS/IPS and secure remote access limit attackers.
- Zero trust verifies every request: identity, device and context.
- Log analysis spots attacks such as brute-force logins.

```quiz
Q: Splitting a network into separate zones is called ___ (one word)
A: segmentation | network segmentation
Q: Which security model says "never trust, always verify"? (two words)
A: zero trust | zero-trust
Q: Which port should never be exposed to the internet for remote desktop? (number)
A: 3389
```
