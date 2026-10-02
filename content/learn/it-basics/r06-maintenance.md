---
slug: maintenance
title: "Keeping a computer healthy: updates, antivirus, cleaning, backups and fixing common problems"
after: KEEP
---
# Keeping a computer healthy: updates, antivirus, cleaning, backups and fixing common problems

A computer that's looked after stays fast, safe and reliable for years. One that's neglected gets slow, catches viruses, overheats and eventually loses your files. This unit teaches the routine care every computer user should do, and a step-by-step method for fixing the most common problems yourself before paying a technician. (The **Computer hardware & maintenance** subject goes deeper into repairs and upgrades.)

:::note What you will learn
- A simple maintenance routine (daily, weekly, monthly)
- Windows Update and why it matters
- Antivirus with Windows Security and safe habits
- Freeing disk space and controlling startup programs
- Physical care: dust, heat, power and batteries
- Backups
- A troubleshooting method and fixes for common problems
- When to call a technician
:::

## The maintenance routine

| How often | Task |
|---|---|
| **Daily** | Shut down or restart properly; keep the laptop on a hard surface; save work often |
| **Weekly** | Install updates; restart at least once; back up important files; empty Downloads of things you don't need |
| **Monthly** | Run a full antivirus scan; check free disk space; uninstall unused programs; clean the keyboard and screen |
| **Every 6–12 months** | Clean dust from vents/fans (or have a technician do it); check battery health; review backups by restoring a test file |

## Windows Update

Updates fix **security holes** that criminals use, fix bugs and add features.

1. **Settings** (`Windows+I`) → **Windows Update** → **Check for updates**.
2. Install, then **restart** when asked (many updates only finish after a restart).
3. Set **active hours** so restarts don't happen while you work.
4. Use a metered connection setting if you're on limited mobile data, and update on Wi-Fi.

Also keep **browsers**, **Office** and other apps updated. Old, unsupported systems (like Windows 7) no longer get security updates and are risky to use online.

:::warning Never turn off the computer during an update
Cutting power while "Working on updates... don't turn off your computer" is shown can damage Windows. Plug laptops into power for updates; desktops benefit from a UPS where power cuts are common.
:::

## Protecting against viruses and malware

**Malware** (malicious software) includes viruses, worms, spyware, ransomware (locks files and demands payment) and adware.

### Windows Security (free, built in)

Windows 10 and 11 include **Microsoft Defender** antivirus. Check it: Start → **Windows Security** → **Virus & threat protection**:
- Real-time protection: **On**.
- Run a **Quick scan** weekly and a **Full scan** monthly.
- **Ransomware protection** (Controlled folder access) adds extra protection for important folders.

One good antivirus is enough; running two can cause conflicts and slowdowns. Avoid "free antivirus" pop-ups that appear while browsing: they're often the malware.

### Safe habits (more important than any antivirus)

- Install software only from official sources (Microsoft Store, the developer's site).
- Don't use cracked/pirated software: it's a major source of malware in Kenya and elsewhere.
- Scan flash disks before opening files; beware the shortcut virus.
- Don't open unexpected email attachments; never "enable macros" in documents from strangers.
- Use a standard (non-administrator) account for daily use where possible.
- Keep backups (ransomware protection).

## Freeing space and speeding up

### Check disk space

File Explorer → **This PC**: the bar under `C:` shows free space. Windows gets slow and updates fail when the main drive is nearly full (keep at least 10–15% free).

### Clean up

1. **Storage Sense:** Settings → System → **Storage** → turn on Storage Sense; use **Temporary files** to delete update leftovers and temp files.
2. **Uninstall** programs you don't use: Settings → Apps → Installed apps.
3. Move large videos and photos to an external drive or cloud.
4. Empty the **Recycle Bin** and clear **Downloads**.

### Startup programs

Many programs start with Windows and slow it down. **Task Manager** (`Ctrl+Shift+Esc`) → **Startup apps** → disable unnecessary ones (e.g. updaters, chat apps you rarely use). Don't disable things you don't recognise without checking (search the name first); antivirus and drivers should stay enabled.

### When the PC is still slow

- Check **Task Manager → Processes** for programs using lots of CPU, memory or disk.
- Too many browser tabs eat RAM: close what you don't need.
- Hardware limits: 4 GB RAM and an HDD are slow with modern Windows; an **SSD** upgrade and more RAM help hugely (see the upgrades lesson).

## Physical care

| Area | What to do |
|---|---|
| **Dust and heat** | Keep vents clear; use laptops on hard surfaces; clean vents with compressed air; a laptop that's hot and loud constantly likely needs internal cleaning |
| **Power** | Use a surge protector; a **UPS** for desktops protects against outages and fluctuations; unplug during lightning storms |
| **Battery** | Avoid running it to 0% often; heat damages batteries; many laptops have a battery-care setting to limit charging to ~80% |
| **Screen** | Clean with a soft microfibre cloth; no harsh chemicals; don't press hard |
| **Keyboard** | Keep food and drinks away; clean with a soft brush |
| **Transport** | Shut down or sleep before putting in a bag; use a padded bag |

### Liquid spills

1. **Switch off immediately** and unplug; remove the battery if removable.
2. Turn the laptop upside down (in a tent shape) to drain.
3. Don't switch it on to "test"; take it to a technician soon. Sugary drinks cause corrosion even after drying.

## Backups

Hardware fails, laptops get stolen, ransomware locks files. Follow the **3-2-1 rule** (3 copies, 2 types of storage, 1 offsite). Use OneDrive/Google Drive for important folders and an external drive for large files. Test that you can actually restore a file.

## A troubleshooting method

When something goes wrong, work through it calmly:

1. **Identify the problem precisely.** What exactly happens? When did it start? What changed (new software, an update, a drop, a spill)?
2. **Check the obvious.** Is it plugged in, switched on, cables firm, Wi-Fi on, volume up, airplane mode off?
3. **Restart.** It fixes a surprising number of problems.
4. **Search the exact error message** (on another device if needed).
5. **Try one fix at a time**, and note what you changed.
6. **Undo recent changes** (uninstall a new program, roll back a driver, System Restore).
7. **Escalate** to a technician if hardware is damaged or data is at risk.

## Common problems and fixes

| Problem | Try this |
|---|---|
| **Computer very slow** | Restart; close tabs/programs; check Task Manager; free disk space; disable startup apps; scan for malware; consider SSD/RAM upgrade |
| **No internet** | Check Wi-Fi is on and connected; airplane mode off; restart router and PC; "forget" and reconnect the network; run Settings → Network → **Network troubleshooter**; check your data bundle |
| **No sound** | Volume and mute; correct output device (click the speaker icon); headphones plugged properly; restart; update audio driver |
| **Program frozen** | Wait briefly; `Ctrl+Shift+Esc` → select it → **End task** |
| **Printer not printing** | Power and cables/Wi-Fi; paper and ink; correct printer selected; clear the print queue; restart printer and PC (see the printers lesson) |
| **Laptop not charging** | Check the socket and charger light; try another socket; check the cable for damage; battery may be worn out |
| **Overheating / fan loud** | Hard surface; clean vents; check for high CPU use; have the inside cleaned |
| **Blue screen (BSOD)** | Note the stop code; restart; undo recent driver/software changes; run updates; if repeated, see a technician |
| **Forgot Windows password** | Microsoft account: reset online at account.microsoft.com; local account: use security questions/reset disk or a technician |
| **Pop-ups and strange ads** | Remove unknown programs and browser extensions; scan with Windows Security; reset the browser |
| **Flash disk files turned into shortcuts** | Don't click; scan with antivirus; show hidden files; see the malware lesson |

:::think A user says, "My computer is slow." What questions would you ask before trying anything?
When did it start? Is it slow all the time or only with certain programs or when online? Did anything change (new software, an update, a virus warning)? How much free disk space and RAM does it have? Does it overheat or make loud fan noise? These answers point to the cause: storage full, too many startup programs, malware, overheating or old hardware.
:::

## When to call a technician

- Physical damage: drops, liquid spills, broken screens, burning smells, swollen batteries (stop using a swollen battery: it's a fire risk).
- The computer won't power on at all, or makes clicking noises (possible failing hard disk: back up immediately if you can).
- Repeated blue screens after updates and basic fixes.
- Important data you can't afford to lose and a drive that's failing (stop using it; data recovery specialists can help).
Choose reputable technicians; back up and remove sensitive data before handing over a computer where possible.

## Practice tasks

1. Check Windows Update and install all pending updates.
2. Open Windows Security, confirm real-time protection is on and run a quick scan.
3. Check your C: drive space and free at least 2 GB using Storage Sense and uninstalling unused apps.
4. Open Task Manager → Startup apps and disable two unnecessary programs.
5. Set up a backup of your Documents folder and restore one file to test it.

## Summary

- Follow a routine: daily good habits, weekly updates and backups, monthly scans and cleanup, yearly dust cleaning.
- Keep Windows and apps updated; never cut power during updates.
- Windows Security (Defender) is good built-in protection; safe habits matter most (official software, no cracks, careful with flash disks and attachments).
- Free space with Storage Sense and uninstalling; control startup apps; upgrade to SSD/RAM for old machines.
- Protect hardware from dust, heat, power surges and spills.
- Troubleshoot systematically: identify, check the obvious, restart, search errors, one fix at a time, undo changes, escalate.

```quiz
Q: What is the name of the free antivirus built into Windows? (Microsoft ...)
A: Defender | Microsoft Defender | Windows Defender
Q: Which shortcut opens Task Manager? Write like Ctrl+Shift+Esc.
A: Ctrl+Shift+Esc | ctrl shift esc
Q: What should you do first when a laptop gets a liquid spill? (two words: switch it ...)
A: switch off | switch it off | turn off
Q: What is malware that locks your files and demands payment called?
A: ransomware
Q: Which Windows feature deletes temporary files automatically? (two words)
A: Storage Sense
Q: What simple step fixes many computer problems? (one word)
A: restart | reboot
Q: Is it safe to keep using a laptop with a swollen battery? (yes or no)
A: no
```
