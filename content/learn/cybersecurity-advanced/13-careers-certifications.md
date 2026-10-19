---
slug: cyber-careers-certifications
title: "Cybersecurity careers: certifications, a home-lab portfolio, CTFs, CVs, interviews and avoiding course scams"
after: governance-risk-compliance
---
# Cybersecurity careers: certifications, a home-lab portfolio, CTFs, CVs, interviews and avoiding course scams

You've covered the core of professional defence. This final lesson turns that knowledge into a job: which certifications are worth it, how to prove skills without experience, and how to apply. For general tech career planning, see the [cybersecurity careers lesson in the basics subject](./?track=cybersecurity&lesson=careers).

## Certifications by stage

| Stage | Certification | Notes |
|---|---|---|
| **Starting out** | ISC2 Certified in Cybersecurity (CC) | Entry-level; ISC2 has offered free training and exam vouchers through its "One Million Certified in Cybersecurity" programme (check current terms) |
| | Google Cybersecurity Professional Certificate | Online (Coursera), practical, beginner-friendly; financial aid available |
| | Microsoft SC-900 | Fundamentals of Microsoft security, identity and compliance |
| | **CompTIA Security+** | The most widely requested entry-level security certification in job adverts |
| **Analyst / defender** | CompTIA CySA+, Microsoft SC-200, Blue Team Level 1 (BTL1) | SOC and detection skills |
| **Pentesting** | eJPT (INE), CompTIA PenTest+, **OSCP** (OffSec), CEH (EC-Council) | OSCP's hands-on exam is highly respected; eJPT is a good first practical step |
| **Cloud** | AWS Certified Security – Specialty, Microsoft AZ-500, Google Professional Cloud Security Engineer | Usually after a cloud associate certification |
| **Senior / management** | **CISSP** (ISC2), CISM and CISA (ISACA) | CISSP requires about five years of relevant experience (or you become an "Associate of ISC2" until you have it) |

:::tip Don't collect certificates for their own sake
One respected cert plus a strong portfolio beats five unknown ones. Check job adverts in your target market (BrighterMonday, LinkedIn, Fuzu, MyJobMag, and international remote boards) to see what employers actually ask for. Exam prices change, so check the official vendor website and buy vouchers only from the vendor or authorised partners.
:::

## Build proof: your portfolio

Employers hire people who can show their work:
- **Home-lab write-ups:** your Wazuh/Elastic SOC lab, a segmented home network, hardening a Linux server, setting up MFA and backups.
- **Lab and CTF write-ups:** TryHackMe, Hack The Box, PortSwigger labs and picoCTF challenges (only publish write-ups for retired machines or where the platform allows it).
- **Detection rules or scripts** on GitHub: a log parser, a brute-force detector, a risk register tool (like the labs in this subject).
- **Policies and assessments:** a sample security policy or risk assessment for a fictional SME.
- **Blog posts** explaining concepts simply; teaching shows understanding.
- Never include a real client's data or findings without permission.

## Getting experience

- **IT support, helpdesk, sysadmin or networking roles:** the classic route into security.
- **Internships and graduate programmes:** banks, telcos, audit firms and security companies in Nairobi run them; government initiatives such as Ajira Digital and various ICT Authority programmes also offer digital skills opportunities.
- **Volunteering:** help a school, church, chama or small business set up MFA, backups and safe Wi-Fi (with the owner's agreement), and document what you did.
- **Communities:** local security meetups, university cyber clubs, CTF teams and online communities.
- **Freelancing:** security awareness training, website hardening, Microsoft 365/Google Workspace security setups for SMEs. See the [Freelancing subject](./?track=freelancing&lesson=freelancing-roadmap).

## Your CV and interviews

- Lead with **skills and projects**, then certifications, then experience and education.
- Quantify: "Built a home SOC with Wazuh monitoring 3 VMs; wrote 5 detection rules mapped to MITRE ATT&CK."
- Common interview questions:
  - Explain the CIA triad.
  - What happens when you type a URL into a browser? (DNS, TCP, TLS, HTTP)
  - Difference between hashing and encryption?
  - How would you investigate a suspicious login alert?
  - What's the OWASP Top 10? Give an example and its fix.
  - Walk me through a project in your portfolio.
- It's fine to say "I don't know, but here's how I'd find out."

:::warning Avoid scams
- Be wary of "guaranteed job" or "become a hacker in 30 days" courses demanding large upfront fees.
- No legitimate employer asks you to pay for a job, a laptop or "certificate processing."
- Fake "hacker for hire" adverts (recovering accounts, changing grades, spying on partners) are crimes or scams. Never take part.
- Verify certifications on the vendor's official website.
:::

## A 12-month plan (part-time)

| Months | Focus |
|---|---|
| 1–3 | Networking, Linux, Python basics; Cybersecurity basics subject; start TryHackMe |
| 4–6 | This subject; build a home lab; ISC2 CC or Google certificate |
| 7–9 | Security+; SOC lab with write-ups; PortSwigger labs |
| 10–12 | Specialise (SOC, cloud, AppSec, GRC or pentesting); polish portfolio; apply widely |

:::career
Keep a "brag document": every lab, write-up, certificate and problem you solved, with dates and links. It makes CVs, LinkedIn posts and interview answers easy.
:::

:::think You have Security+ and a few TryHackMe rooms, but every SOC job asks for "2 years' experience." What could you do in the next three months?
Build and document a home SOC lab with detections; publish three or four clear write-ups; contribute a small script or detection rule on GitHub; volunteer security help for a local SME or school and document it; apply for helpdesk, IT support and junior SOC/NOC roles and internships anyway (requirements are often flexible); and network at local meetups and online communities.
:::

## Summary

- Start with ISC2 CC, the Google certificate or Security+; specialise later (CySA+, OSCP, cloud security, CISSP).
- A portfolio of labs, write-ups, scripts and detections proves skills without experience.
- IT support, internships, volunteering and freelancing build experience.
- Avoid course and "hacker for hire" scams; verify certifications officially.

```quiz
Q: Which CompTIA certification is the most widely requested entry-level security cert? (one word, ends with a plus sign)
A: security+ | security plus | comptia security+
Q: Which highly respected pentesting cert from OffSec has a hands-on exam? (acronym)
A: oscp
Q: Roughly how many years of experience does CISSP require? (number)
A: 5 | five
```
