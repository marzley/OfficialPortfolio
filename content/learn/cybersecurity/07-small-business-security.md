---
slug: small-business-security
title: "Securing a small business: a practical 30-day security plan for shops, schools, clinics, SACCOs and offices"
after: security-tools
---
# Securing a small business: a practical 30-day security plan for shops, schools, clinics, SACCOs and offices

Small businesses and institutions are frequent targets precisely because they usually have no security staff, old devices, shared passwords and no backups. A single phishing email, ransomware infection or fake supplier invoice can stop operations for days or drain the bank account. The good news: a handful of affordable measures blocks most attacks. This unit gives a practical, prioritised plan that an IT person, a freelancer or a tech-savvy staff member can implement in 30 days, and that you can offer as a paid service to clients.

:::note What you will learn
- The biggest risks for small organisations
- An asset inventory: knowing what you have
- Accounts, passwords and MFA for the whole team
- Devices: updates, antivirus, encryption, admin rights
- Email and payment fraud protection
- Network and Wi-Fi security
- Backups and recovery
- Staff awareness and simple policies
- Data protection compliance basics
- An incident plan on one page
- Turning this into a service you can sell
:::

## The biggest risks

| Risk | Typical cause | Impact |
|---|---|---|
| **Phishing and account takeover** | Staff enter passwords on fake pages; no MFA | Email used for fraud, data stolen |
| **Payment fraud (business email compromise)** | Fake "new bank details" invoices, fake CEO requests | Direct money loss |
| **Ransomware** | Malicious attachments, exposed RDP, pirated software | Operations stop, data lost |
| **Lost or stolen devices** | Unencrypted laptops and phones | Data breach |
| **Insider mistakes** | Shared passwords, wrong recipients, careless USB use | Data leaks |
| **Website compromise** | Outdated WordPress plugins | Defacement, malware hosting, lost SEO |
| **Mobile money fraud** | SIM swap, social engineering of till/paybill operators | Money loss |

## Week 1: Know what you have and lock down accounts

### Asset inventory

Make a simple spreadsheet:

| Asset | Owner | Details | Sensitive data? |
|---|---|---|---|
| Reception laptop | Mary | Windows 11, Defender, BitLocker? | Customer records |
| Office router | IT | Model, admin login changed?, firmware date | — |
| Email accounts | All staff | Google Workspace / Microsoft 365 / cPanel mail | Yes |
| M-Pesa till/paybill | Manager | Who has access, SIM holder | Money |
| Website + hosting | Developer | WordPress, plugins, hosting login | Customer forms |
| Accounting software | Accountant | QuickBooks/Excel files, backups | Financial |
| Cloud apps | Various | Drive, WhatsApp Business, POS system | Varies |

You can't protect what you don't know about.

### Accounts and MFA

1. **One account per person**: no shared logins like `office@` used by five people for everything.
2. **Password manager** for the team (Bitwarden has team plans; free individual vaults are a start).
3. **MFA on email first**, then banking, accounting, cloud storage, website admin, domain registrar and social media.
4. **Remove accounts** of people who have left, the same day they leave.
5. **Admin accounts** separate from daily accounts, with MFA, used only when needed.

## Week 2: Devices and email

### Devices

| Action | How |
|---|---|
| Automatic updates | Windows Update, macOS, phones, browsers, Office |
| Antivirus/EDR | Microsoft Defender (built in) turned on and updated; business EDR if budget allows |
| Disk encryption | BitLocker (Windows Pro) / device encryption, FileVault (Mac), phone encryption (default) |
| Standard user accounts | Staff don't have admin rights for daily work |
| Screen locks | Auto-lock after 5 minutes; strong PIN/password |
| Legal software only | No cracked software; use free alternatives where budget is tight |
| Retire unsupported systems | Devices that no longer receive security updates should be replaced or isolated |

### Email and payment fraud

- Turn on the email provider's **anti-phishing** and **external sender warnings**.
- Set up **SPF, DKIM and DMARC** for your domain so criminals can't easily spoof it.
- **Payment rule**: any change in a supplier's bank or M-Pesa details must be confirmed by **phone call to a number already on file**, never by replying to the email. Large payments need **two people** to approve.
- Mobile money: limit who can access the till/paybill, protect the SIM with a PIN, and reconcile transactions daily.

## Week 3: Network, Wi-Fi and website

- Router/firewall: change the default admin password, update firmware, disable remote administration and WPS, disable UPnP if not needed.
- Wi-Fi: **WPA2/WPA3** with a strong passphrase; a separate **guest network** for customers/visitors, isolated from staff devices and POS systems.
- Put CCTV and IoT devices on their own network; change default camera passwords; don't port-forward cameras or RDP to the internet.
- Remote access: VPN with MFA, not open RDP.
- Website: update WordPress core, themes and plugins; remove unused ones; 2FA for admins; daily off-site backups; HTTPS; a web application firewall (see the web security lesson).

## Week 4: Backups, people, policies and incident plan

### Backups (3-2-1)

- **3** copies of important data, on **2** different types of storage, **1** off-site or offline.
- Example: files on the office PC + automatic cloud backup (e.g. OneDrive/Google Drive with version history, or a backup service) + a weekly external drive kept off-site or disconnected.
- **Test a restore** monthly: pick a file and actually recover it.
- Back up accounting data, customer records, website files and database.

### Staff awareness (30 minutes a month)

Cover: spotting phishing and fake M-Pesa messages, never sharing PINs/OTPs, verifying payment changes, reporting mistakes immediately without fear, safe USB and Wi-Fi habits, locking screens. Short, regular, practical sessions beat a single long lecture.

### Simple policies (one page each)

- Acceptable use: what company devices and accounts can be used for.
- Passwords and MFA.
- Payments and verification.
- Joiners/leavers: account creation and removal checklist.
- Data handling: who can access customer data, how long it's kept, how it's disposed of.

### Data protection basics (Kenya)

Under the **Data Protection Act, 2019**, organisations processing personal data must handle it lawfully, collect only what they need, keep it secure, respect people's rights (access, correction, deletion), and report breaches to the **ODPC** within the required time. Some organisations must **register** with the ODPC as data controllers/processors depending on their size and sector. Check the ODPC's current guidance or seek legal advice for your situation.

### One-page incident plan

```
WHO TO CALL
- IT/security contact: [name, phone]
- Bank fraud line: [number]   - Mobile money provider: [number]
- Website/hosting developer: [name, phone]
- Management decision-maker: [name, phone]

FIRST STEPS
1. Disconnect affected devices from the network (don't switch off unless instructed).
2. Change passwords for affected accounts from a clean device; check MFA.
3. Call the bank/provider immediately for any payment fraud.
4. Write down what happened, when, and what you've done.
5. Restore from clean backups once the cause is fixed.
6. Report: police/DCI for crimes; ODPC if personal data was breached.
7. Afterwards: what can we change so it doesn't happen again?
```

## Track progress

```try-python
checklist = {
    "MFA on all email accounts": True,
    "Password manager in use": True,
    "Devices auto-updating": True,
    "Disk encryption on laptops": False,
    "Guest Wi-Fi separated": True,
    "SPF/DKIM/DMARC set": False,
    "Payment verification rule": True,
    "3-2-1 backups with tested restore": False,
    "Staff awareness session this month": True,
    "Incident plan printed and shared": False,
}
done = sum(checklist.values())
print(f"Security score: {done}/{len(checklist)} ({done * 100 // len(checklist)}%)")
print("Still to do:")
for item, ok in checklist.items():
    if not ok:
        print(" -", item)
```

## Offering this as a service

Freelancers and small IT firms can package this plan:

| Package | Includes | Example pricing approach |
|---|---|---|
| **Security health check** | Inventory, risk review, written report with priorities | One-off fee based on size (e.g. number of staff/devices) |
| **Setup** | MFA rollout, backups, Wi-Fi separation, device hardening, email authentication | Project fee |
| **Monthly care** | Updates monitoring, backup checks, monthly awareness session, quarterly review | Monthly retainer |

Be honest about what you're qualified to do; refer legal questions about data protection compliance to qualified advisers, and get written authorisation before any testing.

:::think A busy pharmacy owner says, "We're too small to be hacked." Give three realistic attacks they face and three affordable measures that would stop most of them.
Realistic attacks: a staff member phished so the business email is used for fraud; a fake supplier invoice with changed bank details; ransomware from a malicious attachment or pirated software locking the stock and sales system; SIM swap on the till number. Affordable measures: MFA on email and accounts, a payment verification rule (call a known number for bank-detail changes), and 3-2-1 backups with tested restores, plus updates and staff awareness.
:::

## Summary

- Small organisations face phishing, payment fraud, ransomware, lost devices, insider mistakes, website compromise and mobile money fraud.
- Week 1: inventory assets; individual accounts, password manager, MFA, remove leavers.
- Week 2: update, protect and encrypt devices; email security and strict payment verification.
- Week 3: secure router and Wi-Fi, separate guests and IoT, VPN for remote access, maintain the website.
- Week 4: 3-2-1 backups with tested restores, monthly awareness, one-page policies, Data Protection Act basics, and a one-page incident plan.

```quiz
Q: Which account type should get MFA first?
A: email | email accounts
Q: How should a change in a supplier's bank details be verified?
A: phone call | call them | call a known number | by phone
Q: In 3-2-1 backups, how many copies should exist?
A: 3 | three
Q: Which three DNS records protect a domain from email spoofing? (list)
A: SPF, DKIM, DMARC | spf dkim dmarc | SPF DKIM DMARC
Q: Should customers use the same Wi-Fi network as the POS system? (yes/no)
A: no
```
