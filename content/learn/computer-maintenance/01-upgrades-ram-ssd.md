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
```
