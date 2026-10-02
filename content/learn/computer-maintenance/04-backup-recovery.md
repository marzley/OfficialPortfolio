---
slug: backup-data-recovery
title: "Backups and data recovery: protecting files, recovering deleted data and handling failing drives"
after: troubleshooting
---
# Backups and data recovery: protecting files, recovering deleted data and handling failing drives

Hardware can be replaced; lost data often can't. A thesis, a business's accounts, years of family photos, a client's website files: losing them can be devastating. This unit teaches professional backup strategies for individuals and small businesses, how to recover accidentally deleted files, what to do when a drive starts failing, and how to protect against ransomware.

:::note What you will learn
- Why data is lost (and the most common causes)
- The 3-2-1 backup rule and choosing backup methods
- Windows File History, OneDrive/Google Drive, system images
- Phone backups (Android and iPhone)
- Backup plans for small businesses
- Recovering deleted files (Recycle Bin, version history, recovery tools)
- Failing drives: warning signs and what to do (and not do)
- Ransomware protection
- Securely wiping data before disposal
:::

## Why data is lost

| Cause | Examples |
|---|---|
| **Hardware failure** | Hard drives wear out; SSDs can fail suddenly; laptops get dropped |
| **Human error** | Accidental deletion, overwriting files, formatting the wrong drive |
| **Theft and loss** | Stolen laptops and phones, lost flash disks |
| **Malware** | Ransomware encrypts files and demands payment; viruses corrupt data |
| **Power problems** | Outages and surges during writes corrupt files and drives |
| **Disasters** | Fire, floods, liquid spills |
| **Account problems** | Losing access to cloud accounts (forgotten passwords, hacked accounts) |

## The 3-2-1 rule

Keep **3** copies of important data (the original + 2 backups), on **2** different types of storage (e.g. laptop + external drive/cloud), with **1** copy **offsite** (cloud or another location). Modern advice often adds: keep one copy **offline or immutable** (can't be changed by ransomware) and **test restores** regularly.

## Backup methods

| Method | Pros | Cons |
|---|---|---|
| **Cloud sync** (OneDrive, Google Drive, iCloud, Dropbox) | Automatic, offsite, access anywhere, version history | Needs internet/data; limited free space; deleting synced files can delete everywhere (check recycle bins) |
| **External hard drive/SSD** | Large capacity, fast, one-time cost | Must remember to connect; can be lost/stolen/damaged with the PC if stored together |
| **Flash disks** | Cheap, portable | Easy to lose; less reliable for long-term storage |
| **NAS** (network storage) | Central backups for offices | Cost and setup |
| **System image** | Restores the whole system (Windows, apps, files) | Large; less flexible |

Best practice for most people: **cloud sync for documents** + **regular external drive backup** for large files (photos, videos) and a second copy.

## Windows backup tools

### OneDrive folder backup

Settings → **Accounts → Windows backup** (or OneDrive settings → Sync and backup → Manage back up): back up Desktop, Documents and Pictures to OneDrive. Free storage is limited (5 GB free; more with Microsoft 365).

### File History (to an external drive)

Control Panel → **File History** (or search "File History"):
1. Connect an external drive.
2. Turn on File History; choose the drive.
3. It saves versions of files in your libraries/user folders regularly (e.g. every hour while connected).
4. Restore: File History → **Restore personal files** → browse versions → restore.

### System image / full backups

Windows still includes the legacy "Backup and Restore (Windows 7)" tool for system images; many technicians use dedicated imaging software for full-disk backups before major repairs. A system image restores everything onto a replacement drive.

### Google Drive for desktop

Syncs chosen folders with Google Drive (15 GB free shared with Gmail/Photos).

## Phone backups

- **Android:** Settings → Google → **Backup** (contacts, settings, app data, SMS on supported phones); **Google Photos** for photos/videos (check storage); **WhatsApp:** Settings → Chats → **Chat backup** to Google Drive (set daily, include videos if needed).
- **iPhone:** Settings → [your name] → **iCloud Backup**; or back up to a computer.
- **Contacts:** make sure they're saved to your Google/iCloud account, not just the SIM or phone.

## Backup plan for a small business

1. **Identify critical data:** accounts/books, invoices, customer records, contracts, website files and databases, staff records.
2. **Automate:** cloud backup for documents; scheduled backups for accounting software and databases.
3. **Website backups:** hosting backups (cPanel backups, JetBackup), plus your own copies off the server.
4. **Offline copy:** weekly/monthly backup on an external drive kept in a different place (and encrypted).
5. **Test restores** quarterly: open restored files to confirm they work.
6. **Document** who does backups and how to restore.
7. **Protect accounts** with strong passwords and 2FA.

## Recovering deleted files

Try in this order:

1. **Recycle Bin** (desktop): right-click → Restore.
2. **Undo** (`Ctrl+Z`) immediately after deleting in File Explorer.
3. **Cloud recycle bins:** OneDrive (Recycle bin, files kept for a period), Google Drive (Trash, 30 days).
4. **Version history:** OneDrive/Google Drive/Office files ("Version History") and Windows **Previous Versions** (right-click folder → Properties → Previous Versions, if File History/restore points exist).
5. **File recovery software:** if a file was permanently deleted from an HDD, **stop using the drive immediately** (new data can overwrite the deleted file), then use recovery tools such as **Windows File Recovery** (Microsoft's command-line tool), **Recuva** or **PhotoRec**, ideally running from another drive. Install recovery software on a **different drive**, and recover files to a **different drive**.

Note: on **SSDs**, a feature called TRIM usually erases deleted data quickly, so recovery after permanent deletion is often impossible. Backups are the real protection.

## Failing drives: warning signs and actions

Warning signs:
- Clicking, grinding or beeping noises (HDD)
- Very slow file access, freezing when opening files
- Files becoming corrupted or disappearing
- Frequent "disk error" messages, blue screens, failure to boot
- SMART warnings (check with **CrystalDiskInfo**: "Caution" or "Bad" health)

What to do:
1. **Back up immediately**, most important files first (the drive may die at any moment).
2. **Minimise use**: don't run heavy scans or defragmentation on a failing HDD.
3. **Clone** the drive to a new one if possible (technicians use cloning tools that handle bad sectors).
4. **Replace** the drive.
5. If the drive has died and the data is critical with no backup, consult a **professional data recovery service**; don't open the drive yourself (opening a hard drive outside a cleanroom causes further damage).

## Ransomware protection

**Ransomware** encrypts your files and demands payment (often in cryptocurrency). Paying doesn't guarantee recovery and funds criminals.

Protection:
- **Backups**, including one **offline** copy (disconnect the external drive after backing up) and cloud version history.
- Windows Security → Virus & threat protection → **Ransomware protection → Controlled folder access**.
- Keep Windows and software updated; avoid pirated software and suspicious attachments/macros.
- Use standard user accounts; limit who has admin rights in offices.

If infected: disconnect from the network, don't pay quickly, seek professional help, restore from clean backups after removing the infection.

## Securely wiping data before disposal

Before selling, donating or recycling devices:
- **Windows:** Settings → System → Recovery → **Reset this PC → Remove everything** → choose **Clean the drive** (overwrites data, takes longer).
- **Phones:** back up, sign out of Google/Apple accounts (to remove Factory Reset Protection), then **factory reset**; encrypted modern phones make data unrecoverable after reset.
- **Old drives:** use secure erase tools or physically destroy drives that held sensitive data (especially business/customer data, to comply with data protection obligations).

:::think A user deleted an important folder from their laptop's SSD, emptied the Recycle Bin, and has no backup. They ask you to recover it. What do you tell them?
Check OneDrive/Google Drive recycle bins, email attachments and other devices for copies first. On an SSD, permanently deleted data is often wiped quickly by TRIM, so recovery tools may not help, though you can try without writing new data to the drive. Then set up automatic backups (cloud sync + File History) so it never happens again.
:::

## Practice tasks

1. Set up OneDrive or Google Drive sync for your Documents and Desktop folders.
2. Turn on File History to an external drive, then restore an older version of a file.
3. Check WhatsApp and phone backups are active.
4. Run CrystalDiskInfo and note your drive's health status.
5. Write a one-page backup plan for a small business (what, where, how often, who, how to restore).

## Summary

- Data is lost through hardware failure, human error, theft, malware, power problems and disasters.
- Follow 3-2-1 (plus an offline copy) and test restores.
- Use cloud sync (OneDrive/Google Drive), File History to external drives, and system images; back up phones and WhatsApp.
- Recover deleted files via Recycle Bin, cloud trash, version history, Previous Versions and recovery tools (stop using the drive; SSD recovery is often impossible).
- Failing drive: back up immediately, minimise use, clone/replace, use professionals for critical data.
- Protect against ransomware with offline backups, Controlled folder access and updates.
- Wipe devices securely before disposal.

```quiz
Q: In the 3-2-1 rule, how many copies should be offsite?
A: 1 | one
Q: Which Windows feature saves versions of files to an external drive? (two words)
A: File History
Q: What should you do immediately if a drive shows signs of failure? (two words)
A: back up | backup
Q: Why is recovering permanently deleted files on SSDs often impossible? (one word, the feature)
A: TRIM
Q: Which free tool shows a drive's SMART health?
A: CrystalDiskInfo
Q: Should you pay ransomware criminals as the first step? (yes or no)
A: no
Q: Which Reset this PC option overwrites data before disposal? (three words: Clean the ...)
A: Clean the drive | clean the drive
```
