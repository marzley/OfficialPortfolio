---
slug: cybersecurity-roadmap
title: "Cybersecurity roadmap: networking, Linux, security skills, labs and certifications"
after: data-analyst-roadmap
---
# Cybersecurity roadmap: networking, Linux, security skills, labs and certifications

Cybersecurity professionals protect organisations from attacks: phishing, ransomware, stolen passwords, fraud, data leaks and SIM-swap scams. Kenyan banks, SACCOs, telcos, fintechs, insurers, government agencies, hospitals and universities all need security people, and so do the companies that serve them.

Security is **not an entry-level skill on its own**. You protect systems you understand. That is why this roadmap starts with IT basics, networking and Linux before any "hacking".

:::warning Legal and ethical rules (read first)
- Only test systems you **own** or have **written permission** to test. Scanning or attacking anyone else's system, even "just to see", is a crime under Kenya's **Computer Misuse and Cybercrimes Act (2018)** and similar laws elsewhere.
- Practise on legal labs: TryHackMe, Hack The Box, PicoCTF, OverTheWire, and virtual machines on your own computer.
- Ethical hackers protect people. Never use these skills to access accounts, phones or M-Pesa wallets that aren't yours.
:::

## The main job families

| Path | What they do | Typical entry route |
|---|---|---|
| **SOC analyst (defensive / "blue team")** | Watch alerts, investigate suspicious activity, respond to incidents | The most common first security job |
| **Penetration tester (offensive / "red team")** | Legally attack systems to find weaknesses before criminals do | Usually after 1–3 years of IT, networking or SOC experience |
| **GRC (governance, risk, compliance)** | Policies, audits, risk assessments, data protection compliance | Good for people from audit, law or business backgrounds |
| **Security engineer** | Build and configure firewalls, identity systems and secure cloud setups | After networking or system administration experience |
| **Digital forensics and fraud** | Investigate incidents and fraud, preserve evidence | Banks, telcos, audit firms, law enforcement |

## Stage 1: IT foundations (4–6 weeks)

You must be comfortable with computers before you can secure them.
- [Computer parts](./?track=it-basics&lesson=computer-parts), [operating systems](./?track=it-basics&lesson=operating-systems), [installing software](./?track=it-basics&lesson=installing-software)
- [Windows setup](./?track=computer-maintenance&lesson=windows-setup), [troubleshooting](./?track=computer-maintenance&lesson=troubleshooting), [malware clean-up](./?track=computer-maintenance&lesson=malware-cleanup)

**Checkpoint:** you can install Windows or Linux in a virtual machine (VirtualBox is free) and explain what RAM, CPU, storage and the operating system each do.

## Stage 2: Networking (6–8 weeks): the most important foundation

Most attacks travel over networks. You must know how traffic flows.
- [What a network is](./?track=networking&lesson=what-is-a-network), [the OSI and TCP/IP models](./?track=networking&lesson=osi-tcpip)
- [IPv4 addresses](./?track=networking&lesson=ipv4-addresses), [subnet masks](./?track=networking&lesson=subnet-masks), [CIDR](./?track=networking&lesson=cidr), [subnetting step by step](./?track=networking&lesson=subnetting-step-by-step)
- [TCP, UDP and ports](./?track=networking&lesson=tcp-udp-ports), [DNS and DHCP](./?track=networking&lesson=dns-dhcp), [NAT and routing](./?track=networking&lesson=nat-routing)
- [Switching and VLANs](./?track=networking&lesson=switching-vlans), [Wi-Fi](./?track=networking&lesson=wifi)
- [Network commands](./?track=networking&lesson=network-commands), [troubleshooting](./?track=networking&lesson=troubleshooting)
- [Network security](./?track=networking&lesson=network-security), [firewalls and VPNs](./?track=networking&lesson=firewalls-vpns)
- Lab: [your first Packet Tracer lab](./?track=networking&lesson=packet-tracer-first-lab)

**Checkpoint:** you can subnet a /24 into four networks, name the ports for HTTP, HTTPS, SSH, DNS and RDP, and explain what happens when you type a website address into a browser.

## Stage 3: Linux and the command line (4–6 weeks)

Most servers and almost all security tools run on Linux.
- [Why Linux](./?track=linux&lesson=why-linux), [navigating files](./?track=linux&lesson=navigating-files), [viewing and editing files](./?track=linux&lesson=viewing-editing-files)
- [Pipes and redirection](./?track=linux&lesson=pipes-redirection), [permissions](./?track=linux&lesson=permissions), [users, groups and sudo](./?track=linux&lesson=users-groups-sudo)
- [Processes and packages](./?track=linux&lesson=processes-packages), [services, cron and logs](./?track=linux&lesson=services-cron-logs)
- [SSH and servers](./?track=linux&lesson=ssh-servers), [bash scripts](./?track=linux&lesson=bash-scripts)
- [Project: web server](./?track=linux&lesson=project-web-server)

**Checkpoint:** you can SSH into a server, read `/var/log/auth.log` and use `grep` to find failed logins.

## Stage 4: Security fundamentals (4–6 weeks)

The whole [Cybersecurity subject](./?track=cybersecurity&lesson=basics):
- [Basics: the CIA triad, threats and risk](./?track=cybersecurity&lesson=basics)
- [Passwords and 2FA](./?track=cybersecurity&lesson=passwords-2fa), [encryption and HTTPS](./?track=cybersecurity&lesson=encryption-https)
- [Phishing and scams](./?track=cybersecurity&lesson=phishing-scams), [social engineering and SIM swap](./?track=cybersecurity&lesson=social-engineering-sim-swap)
- [Malware and devices](./?track=cybersecurity&lesson=malware-devices), [backups and ransomware](./?track=cybersecurity&lesson=backups-ransomware)
- [Data protection in Kenya](./?track=cybersecurity&lesson=data-protection-kenya), [incident response](./?track=cybersecurity&lesson=incident-response)
- [Security tools](./?track=cybersecurity&lesson=security-tools), [small business security](./?track=cybersecurity&lesson=small-business-security)

## Stage 5: Scripting (3–4 weeks)

Security people automate: parsing logs, checking lists of IPs, calling APIs.
- Python: [introduction](./?track=python&lesson=introduction) → [files and errors](./?track=python&lesson=files-errors) → [automation and web requests](./?track=python&lesson=automation-web-requests)
- [Python for networking](./?track=networking&lesson=python-networking)
- Bash: [bash scripts](./?track=linux&lesson=bash-scripts)

**Checkpoint:** a Python script that reads a log file and lists the top 10 IP addresses with failed logins.

## Stage 6: Web security (3–4 weeks)

Websites are the most attacked surface. Understand how they're built (do at least HTML, a little JavaScript and PHP/SQL from the web developer roadmap), then:
- [Web security](./?track=cybersecurity&lesson=web-security): SQL injection, XSS, CSRF, broken authentication
- [Forms and security in PHP](./?track=php&lesson=forms-security): how developers prevent them
- The **OWASP Top 10** (free at owasp.org): the industry list of the most critical web risks
- Practise legally on deliberately vulnerable apps such as OWASP Juice Shop or DVWA, running on your own machine

## Stage 7: Hands-on labs (ongoing, start in stage 3)

| Platform | Cost | Good for |
|---|---|---|
| **TryHackMe** | Many free rooms; paid plan optional | Guided beginner paths (pre-security, SOC level 1) |
| **Hack The Box** (Academy and labs) | Free tier + paid | Deeper practice, both offensive and defensive |
| **PicoCTF** | Free | Beginner capture-the-flag challenges |
| **OverTheWire (Bandit)** | Free | Linux command line skills through games |
| **Blue Team Labs Online / LetsDefend** | Free tiers | SOC-style investigation |
| **Your own home lab** | Free (VirtualBox) | Kali Linux + a vulnerable VM + a Windows VM |

Write a short **write-up** for each lab you finish (what you found, how, how to fix it). Don't publish write-ups for active competition challenges.

## Stage 8: Certifications

Certifications matter more in security than in web development, because many employers and government tenders ask for them. Start with **one** entry-level certificate:

| Certification | Level | Notes |
|---|---|---|
| **ISC2 Certified in Cybersecurity (CC)** | Entry | ISC2 has run free training and exam offers for this; check the current terms on isc2.org |
| **Google Cybersecurity Certificate** | Entry | Online (Coursera); financial aid is available |
| **CompTIA Security+** | Entry-to-mid | Widely recognised by employers; the exam is paid |
| **Cisco CCNA** | Networking | Excellent foundation; Cisco Networking Academy courses are offered at many Kenyan universities and colleges |
| **CompTIA CySA+ / Blue Team Level 1** | SOC | After some experience |
| **eJPT, then OSCP** | Penetration testing | OSCP is advanced and respected |

Prices change; check the official sites and beware of "exam dump" sellers (cheating gets certificates revoked).

## Stage 9: Portfolio and first job

Your security portfolio:
1. A **home lab** write-up with a network diagram.
2. 5–10 **lab write-ups** (TryHackMe rooms, PicoCTF challenges).
3. A **Python security tool**, e.g. a log analyser or a password-strength checker, on GitHub.
4. A **security audit of your own website project**: what you tested, what you fixed.
5. A **security awareness guide** for a small business (see [small business security](./?track=cybersecurity&lesson=small-business-security)): shows you can communicate.

Entry routes: IT support or helpdesk → SOC analyst; network technician → security engineer; graduate trainee programmes at banks and telcos; attachments in ICT departments. See [cybersecurity careers](./?track=cybersecurity&lesson=careers) and [networking careers and certifications](./?track=networking&lesson=careers-certs). Many people enter security after a year or two in the [IT support roadmap](./?track=career-roadmaps&lesson=it-support-networking-roadmap); that's a normal, sensible path.

## Summary

- Foundations first: IT basics → networking → Linux → security fundamentals → scripting → web security.
- Practise only on legal labs and your own systems.
- One entry certificate (ISC2 CC, Google, Security+ or CCNA) plus a lab portfolio.
- SOC analyst is the most common first security job; IT support is a common stepping stone.

```quiz
Q: Which Kenyan law makes unauthorised access to computer systems a crime? Name it without the year.
A: Computer Misuse and Cybercrimes Act | the Computer Misuse and Cybercrimes Act
Q: What does SOC stand for? (three words)
A: Security Operations Centre | Security Operations Center
Q: Which list from OWASP covers the most critical web risks? (OWASP Top __)
A: 10 | ten
Q: What port does SSH use by default?
A: 22
Q: In the CIA triad, what does the C stand for?
A: confidentiality
```
