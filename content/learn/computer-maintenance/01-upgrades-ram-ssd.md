---
slug: upgrades-ram-ssd
title: Speeding up an old computer: SSD and RAM upgrades
after: hardware-parts
---
# Speeding up an old computer: SSD and RAM upgrades

A slow laptop is often not "dead". The two upgrades that make the biggest difference are replacing a hard disk (HDD) with a **solid-state drive (SSD)** and adding **RAM**. For a few thousand shillings a 5-year-old laptop can feel new, and upgrade work is a good income stream for technicians.

## Diagnose first

Open **Task Manager** (Ctrl + Shift + Esc) → **Performance**:

| What you see | Likely bottleneck | Upgrade |
|---|---|---|
| **Disk** at 100% for long periods, slow start-up | Old hard disk (HDD) | **SSD** |
| **Memory** above ~85% with a few apps open | Not enough RAM | **More RAM** |
| CPU at 100% on simple tasks | Very old processor, or malware | Check for malware first; the CPU usually can't be upgraded on laptops |

Also check what's installed: Task Manager → Performance → Disk shows **HDD** or **SSD**; Memory shows total RAM, **slots used** and speed (e.g. DDR4-2666).

## SSD: the biggest speed boost

| Type | Looks like | Notes |
|---|---|---|
| **2.5" SATA SSD** | Same size as a laptop hard disk | Fits most laptops from ~2010–2018 that have a 2.5" HDD |
| **M.2 SATA** | A small stick | Check whether your M.2 slot supports SATA |
| **M.2 NVMe** | A small stick | Fastest; needs an NVMe-compatible M.2 slot |

Find the right one: search your laptop's exact **model number** (on the sticker underneath, or in Settings → System → About) plus "SSD upgrade", or use Crucial's system scanner.

### Moving to the SSD

Two options:

1. **Clean install** (recommended if the system is messy): back up files, fit the SSD, install Windows from a USB made with Microsoft's **Media Creation Tool**, then install drivers and restore files.
2. **Clone** the old disk to the SSD with a USB-to-SATA adapter and cloning software (e.g. Macrium Reflect, or the SSD maker's tool), then swap the drives.

After installing, check the SSD's health with its maker's tool or CrystalDiskInfo.

## RAM upgrades

- Find the **type** (DDR3, DDR4, DDR5; laptops use **SO-DIMM** sticks), speed and maximum supported RAM for your model.
- Check free slots. Some laptops have RAM **soldered** on the board with one free slot, or none.
- Match the speed and type; for best performance use **two identical sticks** (dual channel).
- 8 GB is the practical minimum for Windows 11 today; 16 GB for programming, design and many browser tabs.

## Safety and good practice

1. **Back up** the customer's data before any work.
2. Shut down fully, unplug the charger and, if possible, disconnect the battery.
3. Touch a metal part first (or use an **anti-static wrist strap**) to discharge static electricity.
4. Use the right screwdriver; keep screws organised (a magnetic mat or labelled cups).
5. Handle RAM and SSDs by the edges; never force connectors.
6. Test before closing the case completely.

## Other cheap speed-ups (no hardware)

- Uninstall unused programs and disable unnecessary **start-up apps** (Task Manager → Startup).
- Run a malware scan (Microsoft Defender full scan).
- Keep at least 15–20% of the disk free.
- Install updates and drivers.
- Clean dust from fans and vents: overheating slows the CPU.

## Pricing upgrade jobs

Quote **parts + labour** separately, test the machine in front of the customer, return the old disk (with their data) or offer to wipe it, and give a short warranty on your labour.

## Why upgrades are a valuable service

Many people and offices in Kenya use older laptops and desktops that feel painfully slow. Often the computer doesn't need replacing: an SSD and more RAM can make it feel new for a fraction of the price of a new machine. Computer technicians, cyber café owners and ICT support staff earn steady income from upgrades, and doing them correctly (with data backed up and parts compatible) builds trust and referrals.

## Checking compatibility before buying parts

| Part | What to check | How |
|---|---|---|
| Storage | 2.5-inch SATA bay? M.2 slot? M.2 type (SATA or NVMe) and length (2280 is common) | Laptop model specifications, service manual, or open the case |
| RAM | DDR3, DDR4 or DDR5; SO-DIMM (laptop) or DIMM (desktop); maximum supported capacity; number of slots; soldered RAM | Model specs, tools like CPU-Z, or Task Manager → Performance → Memory (slots used) |
| Speed | RAM speed (MHz) supported by the motherboard | Specs; mismatched speeds run at the slowest speed |
| Power/cables (desktops) | SATA power and data cables available | Inspect inside |

Search "[exact model number] specifications" or the manufacturer's support site. Ordering the wrong part wastes money and time.

## Cloning vs fresh install

| Option | How | Best when |
|---|---|---|
| **Clone** the old drive to the SSD | Use cloning software and a USB-to-SATA adapter/enclosure | The current Windows is healthy and the customer wants everything as before |
| **Fresh install** of Windows on the SSD | Create a USB installer with the Media Creation Tool, install, then restore data | The old system is slow, infected or messy |

A fresh install often gives the best performance but requires reinstalling programs, so confirm the customer has licences and installers (and back up browser bookmarks, passwords and email data).

## Step-by-step SSD upgrade (laptop, fresh install)

1. **Back up** the customer's data (documents, desktop, pictures, browser data) and verify the backup opens.
2. Note the Windows edition and confirm it's activated (digital licence usually reactivates automatically on the same hardware).
3. Create a Windows installation USB (8 GB or larger) on another computer.
4. Power off, unplug the charger, and **disconnect the battery** if accessible; ground yourself (touch metal or use an anti-static strap).
5. Remove the old drive and install the SSD (keep screws organised).
6. Boot from the USB (boot menu key varies: F12, F9, Esc), install Windows on the SSD.
7. Install drivers (Windows Update, then the manufacturer's site for chipset, graphics, Wi-Fi if needed).
8. Restore data; install the customer's programs; run updates.
9. Put the old hard drive in an external enclosure so the customer has an extra backup drive (or wipe it securely if they don't want it).

## After the upgrade: checks

- Task Manager → Performance: SSD shows as the system disk; RAM shows the new total.
- Boot time and app launch times compared with before (customers love seeing the difference).
- Battery charging, Wi-Fi, sound, webcam, keyboard backlight and function keys work.
- Windows is activated and updated.
- Customer's important files open correctly.

## Benchmarks you can show

| Measurement | Before (HDD, 4 GB) | After (SSD, 8 GB) |
|---|---|---|
| Boot to desktop | ~2 minutes | ~20 seconds |
| Open a browser | 15–30 seconds | 2–3 seconds |
| Disk at 100% in Task Manager | Often | Rarely |

(Your measurements will vary; record real numbers for each job.)

## When an upgrade isn't worth it

- Very old CPUs that can't run current Windows versions well or don't get security updates.
- Damaged motherboards, failing screens or batteries where total repair cost approaches a newer used laptop.
- Machines where RAM is soldered and storage is very limited.

Be honest: advising a customer not to spend money builds long-term trust.

## Documentation and warranty

Give the customer a simple job card:

```text
Customer: ____   Device: HP ProBook 450 G3, S/N ____
Work done: Installed 512 GB SSD, upgraded RAM 4 GB → 8 GB, fresh Windows 11 install, drivers updated
Data: Documents/Desktop/Pictures restored; old HDD returned in USB enclosure
Parts warranty: as per supplier (keep receipt)   Labour warranty: 30 days
Technician: ____   Date: ____   Customer signature: ____
```

## Practice

1. Find the exact RAM type, maximum capacity and storage interface for two laptop models.
2. Use Task Manager to identify the bottleneck on a slow computer.
3. Create a Windows installation USB with the official tool.
4. Practise cloning a small drive to another using a USB adapter (on a practice machine).
5. Write a job card and a before/after performance report for an upgrade.

:::think A customer's laptop is slow, and Task Manager shows Disk at 100% while CPU and memory are moderate. What upgrade would you recommend first, and why?
An SSD. Constant 100% disk usage means the slow mechanical hard drive is the bottleneck: the CPU and RAM wait for data. An SSD reads and writes many times faster, so boot and app loading times drop dramatically, usually giving the biggest improvement for the money.
:::

```quiz
Q: Which upgrade usually gives the biggest speed boost to an old laptop with a hard disk?
A: SSD | an SSD | solid state drive
Q: What type of RAM stick do most laptops use? (hyphenated or not)
A: SO-DIMM | SODIMM
Q: Which Windows tool shows whether Disk or Memory is the bottleneck? (two words)
A: Task Manager
Q: What should you always do before opening a customer's computer? (two words)
A: back up | backup | back up data
Q: What protects components from static electricity? (three words)
A: anti-static wrist strap | wrist strap | antistatic wrist strap
Q: What do you call copying an entire old drive to a new SSD?
A: cloning | clone
Q: Which free tool shows RAM type and slots in detail? (hyphenated name)
A: CPU-Z | CPUZ
Q: What should you always verify before upgrading storage? (two words)
A: backup | data backup | the backup
```
