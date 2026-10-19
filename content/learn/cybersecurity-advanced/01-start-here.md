---
slug: advanced-cyber-start-here
title: "Start here: the advanced path, security careers, and the law and ethics you must follow"
after: START
---
# Start here: the advanced path, security careers, and the law and ethics you must follow

This subject takes you from security basics to the skills used by professional defenders: security analysts, incident responders, penetration testers and security engineers. If terms like the CIA triad, phishing and two-factor authentication are new, complete the [Cybersecurity basics subject](./?track=cybersecurity&lesson=basics) first.

## What you'll learn

| Area | Lessons |
|---|---|
| Understanding attackers | The attack lifecycle, MITRE ATT&CK, the threat landscape |
| Building strong defences | Cryptography, identity, secure web code, network defence, cloud and mobile |
| Detecting and responding | Security monitoring (SIEM, SOC), incident response, forensics |
| Finding weaknesses | Vulnerability management, ethical penetration testing |
| Managing security | Governance, risk and compliance |
| Your career | Certifications, labs and portfolio |

## Security career paths

| Role | What they do | Good first step |
|---|---|---|
| **SOC analyst** | Watches alerts, investigates suspicious activity | Often the main entry-level role |
| **Incident responder / DFIR** | Handles breaches, digital forensics | After SOC experience |
| **Penetration tester / ethical hacker** | Tests systems (with permission) to find weaknesses | Strong networking, web and Linux skills |
| **Security engineer** | Builds and runs security tools and controls | Sysadmin or developer background |
| **Application security (AppSec)** | Helps developers write secure code | Developer background |
| **Cloud security engineer** | Secures cloud accounts and workloads | Cloud/DevOps background |
| **GRC analyst** | Policies, risk assessments, audits, compliance | Business, audit or IT background |

## The law: read this carefully

Kenya's **Computer Misuse and Cybercrimes Act (2018)** makes it a crime to access a computer system without authorisation, intercept data, interfere with systems or data, and more. Penalties include fines and imprisonment. Other countries have similar laws.

**This means:**
- Only test systems **you own** or have **written permission** to test, with a clear scope.
- "I was just checking if it's secure" is **not** a legal defence.
- Scanning or attacking your school's, employer's, ISP's or a business's systems without permission can lead to arrest, expulsion or dismissal.
- Practise in **legal labs** (lesson 10 lists them) and your own home lab.

:::warning Ethics first
Security skills are powerful. Professionals protect people's data, respect privacy, report vulnerabilities responsibly, and never use their skills to harm, steal, stalk or spy. Everything in this subject is for defence and authorised testing only.
:::

## Set up a safe home lab

- A computer with 8 GB RAM or more (16 GB is better), or use cloud labs.
- **VirtualBox** or **VMware Workstation Player** (free for personal use) to run virtual machines.
- A **Linux** VM (Ubuntu, Kali Linux or Parrot for security tools).
- A deliberately vulnerable practice VM or app (such as OWASP Juice Shop or DVWA) on an **isolated** virtual network.
- Never expose practice targets to the internet.

No powerful computer? Browser-based labs (lesson 10) need only a browser and internet.

## Your roadmap (about 9–12 months part-time)

1. **Foundations:** networking, Linux, Windows basics, a scripting language (Python), security basics.
2. **Defence:** cryptography, identity, secure configuration, network defence.
3. **Detection and response:** logs, SIEM, incident response (the SOC analyst path).
4. **Offensive understanding (legal):** vulnerability management, web security, pentest methodology in labs.
5. **Specialise:** cloud, AppSec, forensics, GRC or pentesting.
6. **Prove it:** a certification, lab write-ups, a home-lab portfolio.

:::think A classmate says they found an open admin page on a local company's website and plans to "test it a bit" to impress them in a job interview. What do you advise?
Don't. Accessing or testing it without permission is illegal under the Computer Misuse and Cybercrimes Act, whatever the intention. If they believe there's a real vulnerability, they should report it responsibly through the company's security contact or vulnerability disclosure channel without exploiting it, and practise skills in legal labs instead.
:::

## Summary

- This subject builds professional defensive skills: understand, defend, detect, respond and manage.
- Paths include SOC analyst, incident responder, pentester, security engineer, AppSec, cloud security and GRC.
- Kenya's Computer Misuse and Cybercrimes Act (2018) makes unauthorised access a crime: test only with permission.
- Practise in a safe, isolated home lab and legal online labs.

```quiz
Q: Which Kenyan law covers unauthorised access to computer systems? (four words: Computer Misuse and ___ Act)
A: cybercrimes | computer misuse and cybercrimes act
Q: What do you need before testing someone else's system? (two words: written ___)
A: permission | written permission | authorisation | authorization
Q: Which role is often the main entry-level security job? (two words: ___ analyst)
A: soc | soc analyst
```
