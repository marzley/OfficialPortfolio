---
slug: network-security
title: "Network security basics: threats, defence in depth, segmentation, firewalls, hardening devices and monitoring"
after: KEEP
---
# Network security basics: threats, defence in depth, segmentation, firewalls, hardening devices and monitoring

Every network connected to the internet is probed by attackers within minutes: bots scan for open ports, try default passwords on routers and cameras, and look for unpatched systems. Kenyan businesses, schools, SACCOs, hospitals and county offices have suffered ransomware, data theft, defaced websites and fraud. Network security isn't only for specialists: every technician who installs a router, switch or Wi-Fi should know the basics, because most breaches exploit simple mistakes.

:::note What you will learn
- The CIA triad and why security matters (including Kenya's Data Protection Act)
- Common network threats and attacks
- Defence in depth: layers of protection
- Segmentation with VLANs and firewalls
- Firewall policies and rules
- Hardening routers, switches, access points and IoT/CCTV
- Securing remote access
- Monitoring, logging and backups
- A security checklist for a small office
:::

## The CIA triad

| Goal | Meaning | Example threat |
|---|---|---|
| **Confidentiality** | Only authorised people see data | Someone sniffing unencrypted Wi-Fi traffic |
| **Integrity** | Data isn't changed without permission | An attacker altering payment details |
| **Availability** | Systems work when needed | A DDoS taking down a website; ransomware |

In Kenya, the **Data Protection Act (2019)** requires organisations handling personal data to protect it and report breaches to the Office of the Data Protection Commissioner (ODPC). Poor security can mean fines as well as lost trust.

## Common threats

| Threat | What happens |
|---|---|
| **Malware and ransomware** | Malicious software encrypts files and demands payment, often spreading across the network |
| **Phishing** | Fake emails/messages trick users into giving passwords or running malware: the most common entry point |
| **Default and weak passwords** | Attackers log in to routers, cameras and admin panels with "admin/admin" |
| **Unpatched devices** | Known vulnerabilities in old firmware are exploited automatically |
| **Exposed services** | RDP (3389), databases, camera interfaces open to the internet |
| **Man-in-the-middle** | Traffic intercepted on public Wi-Fi or by ARP spoofing |
| **Rogue devices** | Unauthorised routers, APs or laptops plugged into the network |
| **DoS / DDoS** | Floods of traffic overwhelm a server or link |
| **Insider threats** | Staff misuse access, intentionally or by mistake |
| **Brute force** | Automated guessing of passwords on SSH, email, VPN |

## Defence in depth

No single control is enough. Use **layers**, so if one fails, others still protect you:

```
Policies & training → Perimeter firewall → Segmentation (VLANs) → Device hardening
→ Strong authentication (MFA) → Endpoint protection & patching → Encryption → Monitoring → Backups
```

## Segmentation

Put different kinds of devices in different VLANs/subnets and **control traffic between them** with a firewall or ACLs:

| Segment | Allowed to reach |
|---|---|
| Staff | Internet, servers, printers |
| Servers | Only what they need (e.g. database from app server) |
| CCTV/IoT | NVR only; no internet except for updates if needed |
| Guests | Internet only, client isolation on |
| Management (switch/AP admin) | Only IT admin PCs |

If ransomware infects a guest phone or a camera is hacked, segmentation stops it spreading to staff PCs and servers.

## Firewalls

A **firewall** allows or blocks traffic based on rules: source/destination IP, port, protocol, and (in next-generation firewalls) application and user.

Principles:
- **Default deny** for incoming traffic: block everything, then allow only what's needed.
- **Least privilege**: allow the minimum (e.g. SSH only from the IT office IP).
- Rules are read **top to bottom**; the first match wins, so put specific rules first.
- Review rules regularly and remove ones nobody needs.

Example rule set for a small office with a web server:

| # | Source | Destination | Port | Action |
|---|---|---|---|---|
| 1 | Any | Web server | TCP 80, 443 | Allow |
| 2 | IT office IP | Web server | TCP 22 | Allow |
| 3 | Guest VLAN | Internal networks | Any | Deny |
| 4 | Staff VLAN | Internet | Any | Allow |
| 5 | Any | Any | Any | Deny (and log) |

The firewalls and VPN lesson covers types of firewalls and configuration in depth.

## Hardening network devices

| Action | Why |
|---|---|
| Change **default usernames and passwords** | Bots try defaults constantly |
| **Update firmware** regularly | Fixes known vulnerabilities |
| Disable **remote management from the internet** (or restrict by IP/VPN) | Admin pages are a common target |
| Use **SSH and HTTPS** for management, disable Telnet and HTTP | Encrypts admin credentials |
| Disable **unused services and ports** (UPnP, WPS, unused switch ports) | Smaller attack surface |
| Use a **management VLAN** | Admin interfaces not reachable from user networks |
| **Backup configurations** | Fast recovery after failure or attack |
| Set accurate **time (NTP)** and **logging** | Logs are useless without correct timestamps |

### Switch security features

- **Port security**: limit MAC addresses per port.
- **DHCP snooping**: only trusted ports may send DHCP offers (stops rogue DHCP).
- **Dynamic ARP Inspection**: stops ARP spoofing.
- **BPDU Guard**: shuts ports where an unexpected switch is connected.
- **802.1X**: devices must authenticate before the port allows traffic.
- Shut down unused ports and place them in an unused VLAN.

### CCTV and IoT

Cameras and recorders are notoriously insecure: change default passwords, update firmware, put them in their own VLAN, and **don't port-forward** the NVR to the internet; use the vendor's secure app/cloud service or a VPN for remote viewing.

## Securing remote access

- Never expose **RDP (3389)** or **SSH with passwords** directly to the internet.
- Use a **VPN** with **multi-factor authentication (MFA)**, or zero-trust remote access services.
- For servers: SSH keys only, Fail2ban, non-root logins (see the Linux SSH lesson).

## Wi-Fi security recap

WPA3 or WPA2-AES, strong passphrase, WPS off, separate guest network with isolation, 802.1X for organisations (see the Wi-Fi lesson).

## Monitoring and logging

You can't protect what you can't see:
- Keep logs from firewalls, routers, servers and VPNs, ideally sent to a central log server (syslog/SIEM).
- Monitor devices and bandwidth with tools like **SNMP**-based monitoring (Zabbix, LibreNMS, PRTG) to spot unusual traffic.
- **IDS/IPS** (intrusion detection/prevention, e.g. Suricata or features in next-gen firewalls) detect known attack patterns.
- Review logs for repeated failed logins, new devices, traffic at odd hours.

## Backups: the last line of defence

Follow the **3-2-1 rule**: **3** copies of data, on **2** different types of storage, **1** off-site (or offline). Ransomware often deletes or encrypts backups on the same network, so keep at least one copy offline or immutable, and **test restores**.

## Users: the human layer

Most attacks start with a person clicking a link. Train staff to:
- Recognise phishing (urgent requests, odd sender addresses, unexpected attachments, fake M-Pesa/bank messages).
- Use strong unique passwords and a password manager; enable MFA.
- Report suspicious emails and lost devices immediately.

## Small office security checklist

1. Router/firewall: default password changed, firmware updated, remote admin off, default deny inbound.
2. Wi-Fi: WPA2/WPA3, strong passphrase, WPS off, guest network isolated.
3. VLANs for staff, guests, CCTV/IoT, servers.
4. No RDP/camera/database ports forwarded to the internet; VPN with MFA for remote access.
5. All PCs patched with antivirus/EDR; admin rights limited.
6. Backups 3-2-1, tested.
7. Logs kept; someone reviews alerts.
8. Staff phishing awareness training; incident contact list.
9. Asset list: know every device on the network.

:::think A clinic's receptionist PC got ransomware from an email attachment. Within an hour, the shared patient-records server was also encrypted. Which controls could have prevented or limited this?
Email filtering and phishing training (prevention); endpoint protection and patching; least-privilege accounts (the receptionist shouldn't have write access to everything); segmentation and firewall rules limiting PC-to-server access; offline/immutable backups for fast recovery; monitoring to detect mass file changes early. Under the Data Protection Act, the clinic may also need to report the breach.
:::

## Summary

- Security protects confidentiality, integrity and availability; Kenya's Data Protection Act adds legal duties.
- Common threats: phishing, ransomware, default passwords, unpatched and exposed devices, rogue devices, DDoS.
- Use defence in depth: firewalls (default deny, least privilege), segmentation, hardening, MFA, encryption, monitoring, backups.
- Harden devices: change defaults, update, disable unused services, SSH/HTTPS management, switch security features.
- Secure remote access with VPN + MFA; keep 3-2-1 backups; train users.

```quiz
Q: What should a firewall's default policy for incoming traffic be?
A: deny | deny all | block
Q: Which type of VPN joins two office networks together?
A: site-to-site | site to site
Q: Which switch feature stops fake DHCP servers?
A: DHCP snooping
Q: Which Windows remote desktop port should never be open directly to the internet?
A: 3389
Q: What does DDoS stand for? (four words)
A: distributed denial of service
Q: In the 3-2-1 backup rule, how many copies should be off-site?
A: 1 | one
Q: What does the A in the CIA triad stand for?
A: Availability
```

**Learn more:** [Cloudflare: What is a firewall?](https://www.cloudflare.com/learning/security/what-is-a-firewall/) · [Cisco NetAcad: Network Security](https://www.netacad.com/)
