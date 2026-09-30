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
```
