---
slug: incident-response
title: What to do when you've been hacked (incident response)
after: data-protection-kenya
---
# What to do when you've been hacked

Hacked email, a WhatsApp takeover, a defaced website, a stolen phone: panic makes things worse. Security teams follow a simple plan called **incident response**. You can use the same steps for yourself, your family or a small business.

## The six phases

| Phase | Question | Example actions |
|---|---|---|
| 1. **Prepare** | Are we ready before anything happens? | Backups, 2FA, contact list, who does what |
| 2. **Identify** | What happened and how bad is it? | Which accounts, devices, data? When did it start? |
| 3. **Contain** | How do we stop it spreading? | Disconnect, change passwords, lock accounts |
| 4. **Eradicate** | How do we remove the cause? | Remove malware, close the hole, patch |
| 5. **Recover** | How do we get back to normal safely? | Restore backups, monitor closely |
| 6. **Learn** | How do we stop it happening again? | Write down lessons, fix processes |

## Personal playbooks

### My email or social media is hacked

1. Try to **reset the password** immediately (use "Forgot password"). Use a new, unique password.
2. Turn on **2FA**.
3. Check **recovery email/phone**, and remove any the attacker added.
4. Look at **active sessions** ("Where you're logged in") and log out all others.
5. Check email **forwarding rules and filters**: attackers add rules to secretly copy your mail.
6. Warn your contacts not to trust recent messages or money requests.
7. If you reused that password elsewhere, change it there too.

### WhatsApp taken over

1. Reinstall WhatsApp and register your number again: the SMS code logs the attacker out.
2. Turn on **two-step verification** with a PIN.
3. Tell contacts through another channel.

### Phone stolen

1. Call your mobile provider to **block the SIM** and get a replacement (keeps your number and M-Pesa).
2. Call your bank to block app access.
3. Use **Find My Device** (Android) or **Find My** (iPhone) to lock or erase it.
4. Change passwords for email and important apps from another device.
5. Report to the police for the case number (needed for insurance).

### Money lost to fraud

Report **immediately** to your bank or Safaricom, and to the police/DCI. Speed matters: funds can sometimes be frozen before they're withdrawn.

## Business/website playbook

1. **Don't panic-delete**: take screenshots and note times. Logs are evidence.
2. **Contain**: take the site offline or into maintenance mode if needed; disconnect infected machines.
3. **Change credentials**: hosting, cPanel, database, FTP, admin accounts, API keys (M-Pesa, payment gateways).
4. **Find the entry point**: outdated plugin? Weak admin password? Leaked key in a public repo?
5. **Clean**: restore from a known-clean backup, update everything, remove unknown admin users and files.
6. **Check for data exposure**: if personal data was accessed, you may have to notify the ODPC and affected people.
7. **Monitor** logs closely for the following weeks.
8. **Write a short report**: what happened, impact, what you changed.

## Signs you might be compromised

- Password reset emails you didn't request
- Logins from unknown places or devices
- Friends receiving strange messages from you
- New programs, browser extensions, or pop-ups you didn't install
- Very slow computer, fans running at full speed when idle
- Website redirecting to other sites, or Google warning "This site may be hacked"

## Prepare now (it takes one hour)

- Turn on 2FA for email, banking, social media and hosting.
- Use a password manager and unique passwords.
- Set up automatic backups (see the Backups lesson).
- Write down: bank fraud line, provider customer care, your IT support contact.
- Save account recovery codes somewhere safe and offline.

## Why every person and organisation needs a plan

Incidents will happen: a phone is stolen, an email account is hacked, a website is defaced, a laptop gets malware, an employee sends customer data to the wrong person. What separates a small problem from a disaster is how quickly and calmly people respond. A simple written plan, practised in advance, means you don't waste the first critical hours deciding who to call or what to do.

## The incident response phases in practice

| Phase | Key questions | Example actions |
|---|---|---|
| **Preparation** | Who's responsible? What tools and contacts do we need? | Contact list, backups, logging, MFA, training |
| **Identification** | Is this really an incident? How serious? | Check alerts, logs, user reports; classify severity |
| **Containment** | How do we stop it spreading? | Isolate devices, disable accounts, block IPs, take the site offline |
| **Eradication** | What caused it, and is it fully removed? | Remove malware, close the vulnerability, reset credentials |
| **Recovery** | How do we return to normal safely? | Restore from clean backups, monitor closely |
| **Lessons learned** | What do we improve? | Meeting within a week; update the plan and controls |

## Severity levels

| Level | Example | Response |
|---|---|---|
| Low | A single phishing email reported, not clicked | Block sender, warn staff |
| Medium | One laptop infected with malware; one email account compromised | Isolate, clean, reset passwords, check for spread |
| High | Website hacked; customer data possibly exposed | Activate the full plan, involve management, legal and possibly the ODPC |
| Critical | Ransomware across the network; payment systems down | All hands, external specialists, communications plan, authorities |

## Example playbook: compromised email account

1. **Secure the account**: change the password from a clean device; sign out all sessions; enable MFA.
2. **Check settings attackers change**: forwarding rules, inbox rules that hide or delete messages, connected apps, recovery email/phone, signatures.
3. **Review activity**: sign-in history, sent items, deleted items.
4. **Warn contacts** if scam emails were sent from the account.
5. **Check linked accounts**: password resets for other services may have been triggered via the email.
6. **Look for the cause**: phishing? reused password? Fix it.
7. **Record everything** in the incident log.

## Example playbook: website defaced or injected with malware

1. Put up a maintenance page or take the site offline if it's harming visitors.
2. Take a copy of current files, database and logs for investigation before changing anything.
3. Check access logs for suspicious requests and admin logins; list recently modified files (`find /var/www -mtime -3`).
4. Change all passwords: hosting/cPanel, FTP/SFTP, database, CMS admins; revoke unknown admin users and API keys.
5. Restore from a clean backup or reinstall core, themes and plugins from official sources.
6. Update everything; remove unused plugins; fix the vulnerability that was used.
7. Request a review from Google Search Console if the site was flagged as dangerous.
8. Monitor closely for re-infection (backdoors are common).

## Example playbook: lost or stolen phone

1. Call your mobile network to block the SIM (prevents SIM-based fraud and M-Pesa use).
2. Contact your bank if banking apps were installed.
3. Use Find My Device / Find My to lock or erase the phone.
4. Change passwords for email and important accounts; sign out of the device from Google/Apple/WhatsApp.
5. Report to the police with the IMEI number; get a police abstract if needed for insurance or SIM replacement.
6. Restore your data from backups onto a new device.

## Keeping an incident log

| Time | Who | What was observed / done |
|---|---|---|
| 09:12 | Reception | Reported pop-up "files encrypted" on PC-04 |
| 09:15 | IT (Brian) | Unplugged PC-04 network cable; photographed ransom note |
| 09:25 | IT | Checked file server: no encrypted files found; disconnected backup drive |
| 09:40 | Director | Informed; approved contacting external support |

Accurate times and actions help investigations, insurance claims, legal obligations and the lessons-learned review.

## Communication during an incident

- Decide who speaks to staff, customers, the media and regulators. Don't let rumours spread on WhatsApp.
- Be honest and timely; don't speculate about causes before you know.
- Use an alternative communication channel if email may be compromised (phone calls, a separate messaging group).
- If personal data is affected, follow your breach notification process and obligations under the Data Protection Act.

## Tabletop exercises

A tabletop exercise is a meeting where the team talks through a scenario:

> "Monday 8 am: the accountant reports that the supplier says it never received last week's KSh 1.2 million payment, and the bank details on the invoice were different from usual."

Walk through: who's informed, what's checked, who calls the bank, what evidence is kept, how other staff are warned. Exercises reveal gaps (missing phone numbers, unclear responsibilities) before a real incident.

## Useful contacts to prepare in advance

- Internal: IT support, management, legal/compliance, communications.
- External: your hosting provider, ISP, bank fraud line, mobile money provider, cyber insurance (if any), a trusted security consultant.
- National: the National KE-CIRT/CC (Kenya's national computer incident response team), the police (DCI cybercrime unit), and the ODPC for data breaches.

Keep the list printed as well as digital, in case systems are down.

## Practice

1. Write a one-page incident response plan for a small business with a contact list.
2. Create playbooks for "hacked social media account" and "malware on a laptop".
3. Run a 30-minute tabletop exercise with friends or classmates using the supplier-payment scenario.
4. Check your email account for forwarding rules and connected apps.
5. Practise logging actions with times during a simulated incident.

:::think After a website hack, the developer restores yesterday's backup and goes home. Two days later the site is hacked again. What was missed?
The cause wasn't found and fixed: the vulnerability (an outdated plugin, weak password, or leaked credentials) was still there, and yesterday's backup may already have contained a backdoor. They should have investigated logs, identified the entry point, changed all credentials, updated or removed vulnerable components, restored from a backup known to be clean, and monitored for re-infection.
:::

```quiz
Q: What is the phase called where you stop an attack from spreading?
A: contain | containment
Q: When your email is hacked, which hidden settings might an attacker add to copy your mail? (two words)
A: forwarding rules | forwarding | filters | rules
Q: How do you log an attacker out of WhatsApp? (one word)
A: reinstall | re-register | reregister
Q: Should you delete evidence like logs right away after a website hack? (yes or no)
A: no
Q: What is the final phase of incident response, where you improve for next time?
A: learn | lessons learned | lessons learnt
Q: What is a discussion-based practice session that walks through an incident scenario called? (two words)
A: tabletop exercise | tabletop
Q: Which Linux command finds files modified in the last 3 days? (find ... -mtime ...)
A: find -mtime -3 | -mtime -3 | find /var/www -mtime -3
Q: Should a ransom note and logs be preserved as evidence? (yes or no)
A: yes
```
