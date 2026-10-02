---
slug: security-tools
title: "Essential security tools: Wireshark, Nmap, Burp Suite, password managers, SIEMs and how professionals use them"
after: incident-response
---
# Essential security tools: Wireshark, Nmap, Burp Suite, password managers, SIEMs and how professionals use them

Security professionals rely on a toolkit to see what's happening on networks and systems, find weaknesses before attackers do, and detect attacks in progress. This unit introduces the essential tools every beginner should know, what each is for, how it's used in real jobs, and simple safe exercises you can do in your own lab.

:::warning Use tools only where you're allowed
Scanning or intercepting traffic on networks and systems you don't own, without written permission, can be a crime under Kenya's Computer Misuse and Cybercrimes Act and breaks most institutions' rules. Use your own devices, your home lab, or legal practice platforms.
:::

:::note What you will learn
- Wireshark: capturing and reading network traffic
- Nmap: discovering hosts, open ports and services
- Burp Suite and OWASP ZAP: testing web applications
- Kali Linux and other distributions for security work
- Password and secrets tools, hashing utilities
- Defensive tools: antivirus/EDR, SIEMs like Wazuh, log analysis
- Online tools: VirusTotal, Have I Been Pwned, header and SSL scanners
- Building a safe practice lab
:::

## Wireshark: see the packets

**Wireshark** captures network traffic and shows every packet, decoded layer by layer (Ethernet, IP, TCP/UDP, HTTP, DNS...). Network engineers use it to troubleshoot; security analysts use it to investigate suspicious traffic and malware behaviour.

Getting started (on your own computer):
1. Install Wireshark (Windows, macOS, Linux).
2. Choose your Wi-Fi or Ethernet interface and click **Start**.
3. Browse a website, then **Stop**.
4. Use **display filters**:

| Filter | Shows |
|---|---|
| `dns` | DNS lookups (which names your PC resolved) |
| `http` | Unencrypted web traffic |
| `tls` | Encrypted HTTPS traffic (contents unreadable, but you see server names in the handshake) |
| `ip.addr == 192.168.1.10` | Traffic to or from one device |
| `tcp.port == 443` | HTTPS traffic |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | New TCP connection attempts (useful to spot scans) |

Try this: visit an `http://` test site and you'll see form data in clear text, then an `https://` site where content is encrypted. It's the clearest demonstration of why HTTPS matters.

## Nmap: what's on the network?

**Nmap** discovers devices and the services they run. Administrators use it to inventory networks and verify firewall rules; attackers use it for reconnaissance, which is why defenders should know what it reveals.

Safe exercises on your **own** network or lab:

```bash
nmap -sn 192.168.1.0/24          # host discovery: which devices are up?
nmap 192.168.1.1                 # top 1,000 TCP ports on your router
nmap -sV -p 22,80,443 192.168.1.50   # service versions on chosen ports
nmap -p- 10.0.2.15               # all 65,535 ports on a lab VM
nmap -O 10.0.2.15                # guess the operating system (needs admin rights)
```

Reading results:

| State | Meaning |
|---|---|
| **open** | A service is listening: make sure it should be |
| **closed** | Reachable, nothing listening |
| **filtered** | A firewall is dropping probes |

A typical finding: your home router has its admin page or a remote-management port open to the internet. Fix: disable remote administration.

## Burp Suite and OWASP ZAP: testing web apps

These sit between your browser and a website as a **proxy**, letting you see and modify every request: change parameters, test for injection and access control flaws, and scan for common vulnerabilities.

| Tool | Notes |
|---|---|
| **Burp Suite Community** | Free edition; the industry standard for web testing (Pro is paid) |
| **OWASP ZAP** | Free and open source, with an automated scanner |

Practise with **PortSwigger Web Security Academy** labs (free, legal) and **OWASP Juice Shop** running on your own computer. A classic first lab: intercept a request like `GET /account?id=17`, change it to `18`, and see whether the app checks authorisation (the IDOR flaw from the web security lesson).

## Security-focused Linux distributions

| Distribution | Use |
|---|---|
| **Kali Linux** | Hundreds of pre-installed testing tools; run it in a VM, not as your daily OS |
| **Parrot Security** | Similar, also has a privacy edition |
| **Security Onion** | Free platform for network monitoring and intrusion detection |
| **REMnux** | Malware analysis toolkit |

## Passwords, hashes and secrets

- **Password managers** (Bitwarden, KeePassXC) protect your own credentials.
- **Hashing utilities**: `sha256sum file` (Linux) or `Get-FileHash file` (PowerShell) verify downloads match the publisher's published checksum.
- **Hashcat / John the Ripper**: password-cracking tools used by testers (with permission) to show how weak password hashes fall; in training they demonstrate why long passphrases and bcrypt matter.
- **Secret scanners** (e.g. gitleaks, GitHub secret scanning) find API keys accidentally committed to code.

```try-python
import hashlib

data = b"Marzley learning hub installer v1.0"
print("SHA-256:", hashlib.sha256(data).hexdigest())

tampered = b"Marzley learning hub installer v1.0 (modified)"
print("Tampered:", hashlib.sha256(tampered).hexdigest())
print("Any change gives a completely different hash, so checksums reveal tampering.")
```

## Defensive tools

| Tool type | Examples | Purpose |
|---|---|---|
| **Antivirus / EDR** | Microsoft Defender, CrowdStrike, SentinelOne, Sophos | Detect and block malware on endpoints; EDR records behaviour for investigations |
| **SIEM** | **Wazuh** (free), Splunk, Elastic Security, Microsoft Sentinel | Collect logs from many systems, correlate events, raise alerts |
| **IDS/IPS** | Suricata, Snort, Zeek | Detect (and block) malicious network traffic |
| **Vulnerability scanners** | OpenVAS/Greenbone (free), Nessus, Qualys | Find missing patches and misconfigurations across systems |
| **Firewall/WAF** | pfSense, OPNsense, Cloudflare WAF, ModSecurity | Filter network and web traffic |

SOC analysts spend much of their day in a SIEM: reviewing alerts like "50 failed logins followed by a success from a new country", deciding whether it's real, and escalating.

## Log analysis basics

Logs tell the story of an attack. On Linux, simple commands go far:

```bash
sudo grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head
```

This lists the IP addresses with the most failed SSH logins (typical brute-force bots). On Windows, **Event Viewer** → Security log: event ID **4625** is a failed logon, **4624** a successful one.

## Useful online tools

| Tool | Use |
|---|---|
| **VirusTotal** | Scan a suspicious file or URL with many antivirus engines (don't upload confidential documents: uploads may be shared with researchers) |
| **Have I Been Pwned** | Check whether an email appears in known breaches |
| **urlscan.io** | See what a suspicious link loads without visiting it yourself |
| **securityheaders.com, Mozilla Observatory** | Check your website's security headers |
| **SSL Labs (Qualys)** | Test HTTPS/TLS configuration |
| **Shodan** | Search engine for internet-connected devices (shows why exposed cameras and routers are risky) |

## Build a safe practice lab

1. Install **VirtualBox** on a computer with 8–16 GB RAM.
2. Create a **host-only or internal network** so lab traffic stays isolated.
3. Add VMs: Kali Linux, a vulnerable target (Metasploitable 2, a VulnHub image or OWASP Juice Shop), and an Ubuntu server with **Wazuh** to watch the attacks from the defender's side.
4. Practise: scan the target with Nmap, inspect traffic in Wireshark, attack Juice Shop with Burp, then find the evidence in Wazuh alerts and logs.
5. Write up what you did: attacker view and defender view. That's a strong portfolio piece.

:::think You run Nmap against your own small office server and find ports 22 (SSH), 80, 443, 3306 (MySQL) and 3389 (RDP) open to the internet. Which findings worry you and what would you do?
80 and 443 are expected for a website. SSH should be key-only and ideally restricted to known IPs or VPN. MySQL (3306) and RDP (3389) should not be exposed to the internet: close them in the firewall, keep MySQL listening on localhost, and use a VPN for remote desktop access. Re-scan to confirm.
:::

## Summary

- Wireshark shows packets (filters like dns, http, tls, ip.addr) and proves why HTTPS matters.
- Nmap discovers hosts, open/closed/filtered ports and services; use it to verify your own exposure.
- Burp Suite and OWASP ZAP test web apps as intercepting proxies; practise on PortSwigger labs and Juice Shop.
- Defenders use EDR, SIEMs (Wazuh, Splunk), IDS (Suricata), vulnerability scanners and log analysis.
- Use tools only with permission, inside an isolated lab, and document both attacker and defender views.

```quiz
Q: Which tool captures and decodes network packets?
A: Wireshark
Q: Which tool discovers hosts and open ports?
A: Nmap
Q: Which free open-source SIEM is good for a home lab?
A: Wazuh
Q: Which Windows event ID records a failed logon?
A: 4625
Q: Which Linux distribution comes with hundreds of testing tools?
A: Kali | Kali Linux
Q: In Nmap, what state means a firewall is dropping probes?
A: filtered
```
