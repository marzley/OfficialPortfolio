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
```
