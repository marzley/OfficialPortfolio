---
slug: backups-ransomware
title: Backups and ransomware: the 3-2-1 rule
after: malware-devices
---
# Backups and ransomware: the 3-2-1 rule

Hard disks fail, laptops get stolen, phones fall in water, websites get hacked and **ransomware** encrypts files and demands payment. The one defence that works against all of them is a good **backup**.

## What ransomware does

1. It gets in, usually through a phishing attachment, a cracked "free" program, an exposed Remote Desktop, or an unpatched server.
2. It quietly spreads to other computers and shared folders.
3. It **encrypts** your files (documents, photos, databases) and often deletes backups it can reach.
4. It shows a note demanding payment in cryptocurrency for the key.
5. Modern gangs also **steal** the data first and threaten to publish it.

Paying is risky: you may not get a working key, you fund crime, and you become a known payer. With good backups, you simply wipe and restore.

## The 3-2-1 backup rule

- **3** copies of your data (the original + 2 backups),
- on **2** different kinds of storage (e.g. laptop + external drive, or server + cloud),
- with **1** copy **off-site** or offline (in the cloud, or a drive kept at home, disconnected).

> Ransomware encrypts every drive it can see. A backup drive that's always plugged in is **not** a safe backup. Keep at least one copy offline or with version history.

## What to back up

| Who | What |
|---|---|
| You | Documents, photos, WhatsApp chats (Settings → Chats → Chat backup), contacts, passwords (in a password manager) |
| A small business | Accounting files, customer lists, invoices, email, the website files **and** database |
| A school | Student records, exam results, fee records |
| A website | Files + database, daily, kept for at least 30 days |

## Tools

- **Google Drive / OneDrive / iCloud**: automatic sync with **version history** (you can restore an older version of a file after it's encrypted or overwritten).
- **Windows File History** or **macOS Time Machine** to an external drive.
- **cPanel Backup** / JetBackup for websites; `mysqldump` + cron on servers (see Linux lessons).
- For servers: off-site copies to cloud storage (Backblaze B2, AWS S3, etc.).

## Sync is not the same as backup

If a synced folder is encrypted by ransomware, the encrypted files sync to the cloud too. You're only safe if the service keeps **previous versions** or you have a separate backup with history.

## Test your restore

A backup you've never restored is only a hope. Every few months:

1. Pick a random file or a copy of your database.
2. Restore it somewhere else.
3. Check it opens and is complete.
4. Write down how long it took.

## Reducing the chance of ransomware

- Keep Windows, browsers, Office and plugins **updated**.
- Don't install cracked software ("free Office", "free Photoshop"): it's a top source of malware.
- Keep antivirus (Microsoft Defender is good) switched on.
- Don't expose Remote Desktop to the internet.
- Staff don't need admin rights for daily work.
- Turn on **Controlled folder access** in Windows Security for extra protection.

## If it happens

1. **Disconnect** the affected computer from the network (unplug the cable, turn off Wi-Fi) immediately.
2. Don't turn it off if you can avoid it (evidence), but isolate it.
3. Check other machines and backups.
4. Report it to your IT support and, for businesses, the authorities.
5. Wipe and reinstall, then **restore from clean backups**.
6. Change passwords, find how it got in and fix that.

## Who ransomware targets

Ransomware has hit hospitals, county governments, schools, law firms, manufacturers and small shops worldwide, including in Kenya and the wider region. Attackers often don't care who you are: automated tools look for any weak point, such as exposed Remote Desktop, unpatched servers, phishing emails or reused passwords. A business without working backups may lose years of records, face downtime for weeks, and still not get its files back even after paying.

## How a typical ransomware attack unfolds

| Stage | What happens | What could stop it |
|---|---|---|
| 1. Initial access | Phishing email, stolen password, exposed RDP or VPN, unpatched software | MFA, patching, closing exposed services, email filtering |
| 2. Foothold | Malware runs; attacker gains control | Endpoint protection, standard user accounts, application allow-listing |
| 3. Spread | Attacker moves to other computers and servers, steals admin passwords | Network segmentation, unique admin passwords, monitoring |
| 4. Data theft | Files copied out to threaten publication ("double extortion") | Data minimisation, encryption, outbound monitoring |
| 5. Destroy backups | Attacker deletes or encrypts reachable backups | Offline/immutable backups, separate backup credentials |
| 6. Encryption | Files locked; ransom note appears | Restore from clean backups |

Attackers may spend days or weeks inside before encrypting, which is why monitoring and early detection matter.

## Designing backups that survive ransomware

| Principle | How |
|---|---|
| Offline / air-gapped copy | External drive disconnected after each backup, rotated between two drives |
| Immutable copy | Cloud backup with object lock or retention so it can't be deleted for a set period |
| Versioning | Keep multiple days/weeks of versions, not only the latest |
| Separate credentials | Backup system logins different from normal admin logins, with MFA |
| Encryption | Backups encrypted, especially if they contain personal data |
| Documented restore | Written steps; tested regularly |

Many organisations use the **3-2-1-1-0** extension: 3 copies, 2 media, 1 off-site, 1 offline or immutable, 0 errors after restore testing.

## Backup schedules

| Data | Frequency | Retention example |
|---|---|---|
| Accounting / POS database | Daily (or more often) | 30 daily, 12 monthly |
| Shared documents | Daily with versioning | 30 to 90 days of versions |
| Website files and database | Daily | 14 to 30 days |
| Staff laptops | Continuous sync + weekly full backup | 30 days |
| Server system images | Weekly or after major changes | Last 4 |

Ask: "How much data can we afford to lose?" (Recovery Point Objective) and "How quickly must we be running again?" (Recovery Time Objective). The answers decide frequency and method.

## Backing up a website

- **cPanel**: Backup Wizard for full or partial backups (home directory, databases, email); many hosts also run their own backups, but keep your own copies.
- **WordPress**: plugins such as UpdraftPlus can send backups to Google Drive or other storage (store credentials securely).
- **VPS**: scripts with `mysqldump` and `rsync` or `restic`, scheduled with cron, sending encrypted backups off the server.

```bash
# Example nightly backup script (simplified)
DATE=$(date +%F)
mysqldump --single-transaction shopdb | gzip > /backups/shopdb-$DATE.sql.gz
tar -czf /backups/site-$DATE.tar.gz /var/www/shop
# then copy /backups to off-site storage and delete local copies older than 14 days
find /backups -name "*.gz" -mtime +14 -delete
```

Keep database credentials in a protected config file (e.g. `~/.my.cnf` with permissions 600), not in the script.

## Reducing the attack surface

- Patch operating systems, browsers, Office, VPNs, firewalls and websites (WordPress core, plugins, themes) promptly.
- Turn on MFA for email, remote access, cloud services and admin accounts.
- Close or restrict Remote Desktop and other admin services exposed to the internet.
- Give staff standard (non-admin) accounts; separate admin accounts for IT tasks.
- Use reputable endpoint protection (Microsoft Defender is built into Windows) and keep it updated.
- Filter email attachments and block macros from internet-downloaded Office files.
- Segment networks so one infected PC can't reach every server.

## Responding to ransomware: first hour checklist

1. **Isolate**: disconnect affected devices from the network (unplug cable, turn off Wi-Fi). Don't power off servers if forensic investigation may be needed, unless advised.
2. **Alert**: inform management and IT/security support; start an incident log with times and actions.
3. **Protect backups**: disconnect backup drives and check backup systems weren't touched.
4. **Identify scope**: which systems are affected? Is data being copied out?
5. **Preserve evidence**: ransom notes, logs, suspicious emails.
6. **Report**: notify relevant authorities; if personal data may be affected, consider obligations under Kenya's Data Protection Act (including notifying the ODPC where required) and get legal advice.
7. **Recover**: rebuild clean systems, restore from known-good backups, change all passwords, and fix the entry point before reconnecting.

Paying a ransom doesn't guarantee recovery, may fund further crime, and can carry legal risks; organisations should seek professional and legal advice.

## Practice

1. List your own important data and decide a backup method and frequency for each.
2. Set up versioned cloud backup for your documents and test restoring a deleted file.
3. Write a nightly backup script for a sample website and database in a test VM.
4. Draft a one-page ransomware response checklist for a small office.
5. Calculate how much data a business would lose with weekly vs daily backups if attacked on a Friday.

:::think A school backs up its records every night to an external drive that stays permanently connected to the server. Ransomware encrypts the server. Why might the backups also be lost, and what would you change?
Ransomware encrypts or deletes any drive it can reach, including permanently connected backup drives and mapped network shares. Use at least one offline copy (rotate drives and disconnect them) or an immutable cloud backup with versioning and separate credentials, and test restores regularly.
:::

```quiz
Q: In the 3-2-1 rule, how many copies of your data should you keep?
A: 3 | three
Q: In the 3-2-1 rule, how many copies should be off-site?
A: 1 | one
Q: Is a backup drive that is always connected safe from ransomware? (yes or no)
A: no
Q: What is the first thing to do when a computer gets ransomware?
A: disconnect it | disconnect | disconnect from the network | isolate it
Q: What cloud feature lets you restore a file from before it was encrypted? (two words)
A: version history | versioning | versions
Q: What is attackers stealing data and also encrypting it called? (two words)
A: double extortion
Q: What does RPO stand for? (three words)
A: Recovery Point Objective
Q: What is the first step when a computer shows a ransom note?
A: isolate | disconnect | disconnect it from the network | isolate it
Q: What kind of backup copy can't be deleted or changed for a set period?
A: immutable
```
