---
slug: careers
title: "Cybersecurity careers and practice: roles, skills, certifications, legal practice labs and a roadmap"
after: KEEP
---
# Cybersecurity careers and practice: roles, skills, certifications, legal practice labs and a roadmap

Cybersecurity is one of the fastest-growing areas of IT worldwide, with a widely reported global shortage of skilled people. In Kenya, banks, telcos, fintechs, SACCOs, insurance companies, government agencies, hospitals and consultancies all need security staff, especially as the Data Protection Act and growing attacks raise the stakes. Many roles can also be done remotely for international employers. This unit maps the career paths, the skills to build, the certifications that matter, how to practise legally, and a step-by-step roadmap from beginner to first job.

:::note What you will learn
- The main cybersecurity job families and what they do daily
- Who hires in Kenya and internationally
- Foundational skills you need before specialising
- Certifications and a sensible order
- Legal, hands-on practice: labs, CTFs and home labs
- Building a portfolio that proves your skills
- Ethics and the law
- A 12-month roadmap and tips for landing your first role
:::

## Job families

| Area | Roles | What they do |
|---|---|---|
| **Security operations (defence)** | SOC analyst (tier 1–3), incident responder, threat hunter | Monitor alerts (SIEM), investigate suspicious activity, respond to incidents |
| **Offensive security** | Penetration tester, red teamer, bug bounty hunter | Legally attack systems to find weaknesses before criminals do |
| **Security engineering** | Security engineer, cloud security engineer, network security engineer | Build and run firewalls, identity systems, cloud security, endpoint protection |
| **Application security** | AppSec engineer, secure code reviewer | Help developers build secure software; test web and mobile apps |
| **Governance, risk and compliance (GRC)** | GRC analyst, auditor, data protection officer, risk analyst | Policies, risk assessments, audits, compliance with laws (Data Protection Act, CBK guidelines), ISO 27001 |
| **Digital forensics** | Forensic analyst, fraud investigator | Collect and analyse evidence after incidents or fraud |
| **Specialist** | Malware analyst, threat intelligence analyst, security architect | Deep technical or strategic roles |

The most common **entry points** are SOC analyst tier 1, IT support/network roles that grow into security, junior GRC/compliance roles, and junior penetration tester (more competitive).

## Who hires

- **Kenya**: banks and microfinance, telcos and ISPs, fintechs and payment providers, insurance, SACCOs, government agencies (and the national KE-CIRT/CC), Big Four and local consultancies, managed security service providers (MSSPs), universities, NGOs and multinationals with regional offices in Nairobi.
- **Remote/international**: MSSPs and SOCs operating 24/7 across time zones, bug bounty platforms, consultancies.
- **Freelance**: security assessments for SMEs, WordPress security, awareness training, data protection compliance support (with the right qualifications).

## Foundations first

Security is built on IT fundamentals. Before specialising, get comfortable with:

| Area | Why | Where in this hub |
|---|---|---|
| **Networking** | Most attacks and defences involve networks | Networking subject |
| **Operating systems** | Windows and Linux internals, permissions, logs | IT basics, Linux subject |
| **Command line and scripting** | Automate tasks, analyse logs, write tools | Linux (Bash), Python |
| **Web technologies** | HTTP, HTML/JS, databases, APIs | Web, PHP, SQL subjects |
| **Cloud basics** | Most organisations use cloud services | Hosting, AI tools, cloud courses |
| **Security concepts** | CIA, risk, attacks, defences | This subject |

Soft skills matter too: clear writing (reports and incident notes), explaining risks to non-technical managers, curiosity, persistence, attention to detail, and integrity.

## Certifications

| Stage | Certificates | Notes |
|---|---|---|
| Beginner | **Google Cybersecurity Certificate**, ISC2 **Certified in Cybersecurity (CC)**, Cisco **Introduction to Cybersecurity** (NetAcad) | Low cost or free options; good first proof of interest |
| Core | **CompTIA Security+** | Widely recognised baseline for security roles |
| Networking base | CompTIA Network+ / Cisco CCNA | Strongly helps for SOC and network security |
| Defensive | CompTIA CySA+, Cisco CyberOps Associate, Blue Team Level 1 (BTL1), vendor SIEM certs (e.g. Microsoft SC-200, Splunk) | SOC and incident response |
| Offensive | eJPT, CompTIA PenTest+, then OSCP (advanced, very respected) | Penetration testing |
| Cloud | AWS/Azure/Google security certifications | Cloud security |
| GRC and audit | ISO 27001 Lead Implementer/Auditor, CISA, CISM (experience required), data protection certifications | Compliance, audit, management |
| Senior | CISSP (requires years of experience) | Management and architecture |

Check current prices and exam objectives on each provider's website; many are priced in US dollars, and some offer student discounts or vouchers through programmes and universities.

## Practise legally

:::warning Permission first, always
Accessing or testing any system without the owner's permission is illegal under Kenya's Computer Misuse and Cybercrimes Act, 2018, even "just to look". Practise only on platforms built for it, your own lab, or with written authorisation.
:::

| Platform/tool | What you get |
|---|---|
| **TryHackMe** | Guided beginner-friendly rooms and learning paths (many free) |
| **Hack The Box** (Academy and labs) | Challenging machines and structured modules |
| **PortSwigger Web Security Academy** | Free, excellent web security labs |
| **OverTheWire** (Bandit) | Linux and command-line wargames, free |
| **picoCTF** | Free capture-the-flag challenges for beginners |
| **OWASP Juice Shop / DVWA** | Deliberately vulnerable web apps to run locally |
| **Blue team labs** (e.g. LetsDefend, CyberDefenders, Blue Team Labs Online) | SOC alert triage and forensics practice |
| **CTF competitions** | Local university and community CTFs, online events |

### A home lab

- A laptop with 16 GB RAM (8 GB is workable) running **VirtualBox** or VMware.
- VMs: **Kali Linux** (attacker tools), a Windows VM, an Ubuntu server, deliberately vulnerable machines (Metasploitable, VulnHub images).
- A free SIEM to practise defence: e.g. **Wazuh** or the free tier of Splunk/Elastic, collecting logs from your VMs.
- Keep the lab on an isolated virtual network.

## Build a portfolio

- **Write-ups** of retired lab machines and CTF challenges (follow platform rules about not publishing active challenges).
- A **home lab project**: "Detecting brute-force attacks with Wazuh", with screenshots, rules and lessons learned.
- **Scripts/tools** on GitHub: a log parser, a phishing URL checker, a password strength tool.
- **Responsible disclosure**: report bugs through official bug bounty programmes (HackerOne, Bugcrowd, company programmes) and follow their rules.
- **Teach**: blog posts, awareness talks at your school, church or chama about M-Pesa fraud and phishing.
- Join communities: local security meetups, OWASP chapters (OWASP has had a Nairobi chapter), university cyber clubs, online Discord communities.

## Ethics

Security professionals are trusted with sensitive access. Core principles: get permission, stay in scope, protect data you see, report findings responsibly, never use skills for personal gain at others' expense, and follow the law and your employer's policies. A criminal record ends security careers.

## A 12-month roadmap

| Months | Focus | Outcomes |
|---|---|---|
| 1–2 | IT and networking foundations, Linux basics | This hub's Networking and Linux subjects; OverTheWire Bandit |
| 3–4 | Security fundamentals; beginner cert | This subject; Google Cybersecurity or ISC2 CC; TryHackMe beginner path |
| 5–6 | Security+ study; Python and Bash scripting | Security+ exam; small scripts on GitHub |
| 7–8 | Choose a direction: blue team (SOC) or web/app security or GRC | SOC labs with a SIEM, or PortSwigger labs, or ISO 27001/data protection basics |
| 9–10 | Projects and portfolio | Home lab project write-up; CTF participation |
| 11–12 | Job search | Applications for SOC tier 1, junior security/IT roles, internships, graduate programmes |

Meanwhile, an IT support or network job builds valuable experience; many security professionals started there.

## Landing the first role

- Tailor your CV: list labs, projects, certifications and specific tools (Wireshark, Nmap, Burp Suite, Wazuh/Splunk, Linux, Python).
- Prepare for interviews: explain the CIA triad, the OSI model, common ports, how phishing/ransomware work, how you'd investigate a suspicious login, and a lab you're proud of.
- Apply for graduate trainee programmes at banks, telcos and consultancies, and SOC roles at MSSPs.
- Network: attend meetups and conferences, connect with professionals on LinkedIn, ask for informational chats.
- Keep learning: the field changes constantly; follow advisories and security news.

:::think Amina is a computer science student who wants to be a penetration tester. She has been running scanning tools against her university's student portal "to practise". What's wrong, and what should she do instead?
Testing the portal without written permission is illegal under the Computer Misuse and Cybercrimes Act and against university rules, even with good intentions. She should stop, practise on legal platforms (TryHackMe, Hack The Box, PortSwigger labs, Juice Shop in her own lab), and if she believes the portal has a vulnerability, report it responsibly to the university's IT department or through any official disclosure channel.
:::

## Summary

- Job families: security operations, offensive security, engineering, application security, GRC, forensics and specialist roles; SOC tier 1 and IT roles are common entry points.
- Employers in Kenya include banks, telcos, fintechs, SACCOs, government, consultancies and MSSPs; remote roles exist too.
- Build foundations (networking, OS, scripting, web, cloud) before specialising.
- Certifications: beginner (Google, ISC2 CC) → Security+ → specialisation (CySA+, eJPT/OSCP, cloud, ISO 27001) → senior (CISSP).
- Practise only legally (TryHackMe, Hack The Box, PortSwigger, CTFs, home labs), build a portfolio, follow ethics, and follow a roadmap.

```quiz
Q: Which Kenyan act makes unauthorised computer access a crime? (year)
A: 2018 | computer misuse and cybercrimes act 2018
Q: What must you have before testing someone's system?
A: permission | written permission
Q: Name a hands-on practice platform starting with "Try".
A: TryHackMe
Q: What does SOC stand for? (three words)
A: security operations centre | security operations center
Q: Which CompTIA certificate is the common security baseline?
A: Security+ | security plus
Q: Which free PortSwigger platform teaches web security with labs? (three words)
A: Web Security Academy | portswigger web security academy
```

**Learn more:** [TryHackMe](https://tryhackme.com/) · [Google Cybersecurity Certificate](https://www.coursera.org/professional-certificates/google-cybersecurity) · [Professor Messer Security+ (free)](https://www.professormesser.com/)
