---
slug: windows-setup
title: "Installing Windows and software: bootable USB, clean install, drivers, activation and setup checklist"
after: KEEP
---
# Installing Windows and software: bootable USB, clean install, drivers, activation and setup checklist

Installing (or reinstalling) Windows is one of the most useful skills for anyone who maintains computers: it fixes badly infected or very slow systems, sets up new SSDs, and prepares computers for school labs and offices. Technicians charge for it, and doing it correctly (with backups, the right drivers and genuine licences) separates professionals from amateurs. This unit walks through the whole process step by step.

:::warning Back up first
A clean install **erases** the drive you install to. Back up documents, photos, browser bookmarks/passwords, email data and licence keys before starting. Confirm the backup opens on another device.
:::

:::note What you will learn
- When to reinstall vs repair
- Windows editions, versions and system requirements (Windows 11 TPM/Secure Boot)
- Creating a bootable USB with the official Media Creation Tool
- BIOS/UEFI boot settings and the boot menu
- Clean installation step by step (partitions, local vs Microsoft account)
- Drivers: what they are and how to install the right ones
- Activation and genuine licensing
- Post-install setup checklist and essential software
- Restoring data and user settings
:::

## Reinstall or repair?

Try simpler fixes first:

| Option | What it does | When |
|---|---|---|
| **Troubleshooters / malware scan / updates** | Fix specific problems | First steps |
| **System Restore** | Rolls system files and settings back to an earlier point (keeps personal files) | After a bad update or driver |
| **Reset this PC → Keep my files** | Reinstalls Windows, keeps personal files (removes apps) | Persistent problems, slowness |
| **Reset this PC → Remove everything** | Fresh Windows from within Windows | Selling/donating, severe problems |
| **Clean install from USB** | Erases the drive and installs fresh | New SSD, heavily infected systems, upgrades, when Reset fails |

## Editions and requirements

| Edition | For |
|---|---|
| **Windows 11 Home** | Personal use |
| **Windows 11 Pro** | Business features (BitLocker, Remote Desktop host, domain join, policies) |
| **Education/Enterprise** | Institutions (volume licensing) |

**Windows 11 minimum requirements** include a compatible 64-bit CPU (roughly Intel 8th gen / AMD Ryzen 2000 series or newer), **4 GB RAM**, **64 GB storage**, **UEFI with Secure Boot**, and **TPM 2.0**. Use Microsoft's **PC Health Check** app to test. Practically, aim for 8 GB RAM and an SSD.

Windows 10 support ended in **October 2025** (except for paid extended security updates), so new installations should use Windows 11 where hardware supports it. Older unsupported hardware might be better with a lightweight Linux distribution for basic use (see the Linux subject).

## Step 1: Create a bootable USB (official method)

You need a USB flash drive of **8 GB or more** (it will be erased) and a working Windows PC with internet.

1. On a working PC, download the **Media Creation Tool** from Microsoft's official Windows download page (microsoft.com/software-download).
2. Run it, accept the licence, choose **Create installation media (USB flash drive)**.
3. Choose language, edition and 64-bit.
4. Select the USB drive; the tool downloads Windows (several GB) and makes the USB bootable.

Alternative: download the ISO file and use **Rufus** (rufus.ie) to write it to USB. Never download Windows from unofficial sites: modified images can contain malware.

## Step 2: Boot from the USB

1. Plug the USB into the target computer.
2. Restart and press the **boot menu key** repeatedly at startup: commonly `F12` (Dell, Lenovo), `F9` (HP), `Esc` (some HP/Asus), `F11` (MSI), `F8`... (check the brand). Or enter **BIOS/UEFI setup** (`F2`, `Del`, `F10`) and set the USB first in **boot order**.
3. Choose the USB drive (often listed as "UEFI: [USB name]").
4. If it won't boot: check **Secure Boot**/UEFI settings (Windows 11 media boots in UEFI mode), try another USB port, or remake the USB.

## Step 3: Install Windows (clean install)

1. **Language, time and keyboard** → Next → **Install now**.
2. **Product key:** enter it, or choose "I don't have a product key" (if the PC previously had activated Windows of the same edition, it often activates automatically with a **digital licence** once online).
3. Choose the **edition** matching your licence (Home or Pro).
4. Accept terms → choose **Custom: Install Windows only (advanced)** for a clean install.
5. **Partitions:** select the drive. For a clean install on the system drive, delete the old Windows partitions on that drive (**this erases data**), leaving **Unallocated space**, then select it and click Next; Windows creates the needed partitions automatically. **Be careful not to delete data partitions/drives you want to keep** (check sizes and labels).
6. Windows copies files and restarts several times (remove the USB when it restarts to setup, or set the SSD first in boot order).
7. **Out-of-box setup (OOBE):** region, keyboard, network, then sign in with a **Microsoft account** (default for Windows 11 Home) or set up as required by the organisation; create a PIN; choose privacy settings (turn off unnecessary tracking/ads options).

:::tip Name the PC and user sensibly
Use a clear device name (e.g. `LAB-PC-07`, `KAMAU-LAPTOP`) and a user account in the owner's name. In labs and offices, use consistent naming so computers are easy to manage.
:::

## Step 4: Drivers

:::define Driver
Software that lets Windows communicate with a hardware device (graphics, Wi-Fi, audio, touchpad, chipset, printer). Without the right driver, the device may not work or may work poorly.
:::

1. **Connect to the internet** (Wi-Fi or Ethernet; if Wi-Fi doesn't work, use Ethernet, USB tethering from a phone, or install the Wi-Fi driver from a USB).
2. Run **Windows Update** (Settings → Windows Update → Check for updates; also **Advanced options → Optional updates** for drivers).
3. Open **Device Manager** (right-click Start → Device Manager): devices with yellow warning icons need drivers.
4. Download missing drivers from the **manufacturer's support site** using the exact model or serial number (Dell, HP, Lenovo, etc.; many have support assistant apps), or from component makers (Intel, AMD, NVIDIA, Realtek).
5. Restart after installing chipset and graphics drivers.

Avoid "driver updater" utilities from unknown websites: many bundle adware.

## Step 5: Activation and licensing

- Check: Settings → System → **Activation**.
- **Digital licence:** linked to the hardware (and your Microsoft account), activates automatically after reinstalling the same edition.
- **Product key:** entered during or after setup.
- Organisations use **volume licences**.

Use **genuine** Windows. Activators and cracked copies from the internet often contain malware, can stop working, and are illegal (they violate copyright). If a computer has no licence, buy a genuine one from Microsoft or authorised resellers, or consider free alternatives (Linux) where suitable.

## Step 6: Post-install checklist

| Task | Notes |
|---|---|
| Windows Update until no more updates | Restart as needed |
| All drivers installed | Device Manager has no warnings |
| Windows Security on | Real-time protection; run a quick scan |
| Browser | Edge/Chrome/Firefox; sign in to restore bookmarks/passwords if wanted |
| Office suite | Microsoft 365 (licence), or LibreOffice (free) |
| PDF reader | Built-in browser viewer or Adobe Reader |
| Compression | Built-in ZIP; 7-Zip for other formats |
| Media player | VLC |
| Communication | Zoom/Teams/WhatsApp Desktop as needed |
| Backups | OneDrive/Google Drive sync; File History to an external drive |
| Power settings | Sleep times; battery mode |
| Restore point | Create one after setup (System Protection → Create) |
| Remove bloatware | Uninstall trial software that came with the PC |
| User data restored | Copy documents back from the backup |

Install software from **official websites or the Microsoft Store**; watch installers for bundled offers (untick extra toolbars/apps).

### Installing software safely

1. Download from the official site or Microsoft Store (or `winget` for advanced users: `winget install VideoLAN.VLC`).
2. Check the publisher in the installer's security prompt.
3. Choose **Custom** install when offered to untick unwanted extras.
4. Keep software updated; uninstall what you don't use.

## Mass setups (labs and offices)

For many identical computers, technicians use imaging and management tools (e.g. creating a configured image and deploying it, or Windows Autopilot/Intune in organisations). For a small school lab, a consistent checklist and the same software list on every PC already saves lots of time.

:::think After a clean install, a laptop's Wi-Fi doesn't work and there's no Ethernet port. How can you get it online to download drivers?
Use **USB tethering** from an Android phone (Settings → Hotspot & tethering → USB tethering), which Windows usually recognises without extra drivers, or download the Wi-Fi driver on another computer from the manufacturer's site and copy it via USB. Then run Windows Update for remaining drivers.
:::

## Common installation problems

| Problem | Fix |
|---|---|
| USB not detected as boot device | Recreate with Media Creation Tool/Rufus; check UEFI/Secure Boot; try another port |
| "This PC can't run Windows 11" | Check TPM/Secure Boot in BIOS (often called PTT/fTPM), CPU compatibility |
| No drives found during setup | Storage controller driver (Intel RST/VMD) may be needed: load it from the manufacturer's site via USB, or adjust BIOS storage mode as per manufacturer guidance |
| Activation fails | Correct edition? Digital licence linked? Use the Activation troubleshooter or the correct product key |
| Missing drivers | Manufacturer support site by exact model |

## Practice tasks

1. Run PC Health Check on your computer and note whether it meets Windows 11 requirements.
2. Find your computer's boot menu key and BIOS key (check the manufacturer's site).
3. Create a bootable Windows USB with the Media Creation Tool (on a spare flash disk).
4. Open Device Manager and check for devices needing drivers.
5. Write your own post-install checklist for a school or office computer.

## Summary

- Try repairs first (System Restore, Reset); clean install for new drives, severe infections or when resets fail; always back up first.
- Check edition and requirements (Windows 11: TPM 2.0, Secure Boot, supported CPU); Windows 10 support ended October 2025.
- Create a bootable USB with the official Media Creation Tool (or the ISO + Rufus); boot via the boot menu key.
- Custom install, careful partition selection, then out-of-box setup.
- Install drivers via Windows Update and manufacturer sites; check Device Manager.
- Use genuine licences (digital licence or key); avoid cracks.
- Follow a post-install checklist: updates, security, essential software, backups, restore point.

```quiz
Q: Which official Microsoft tool creates a bootable Windows USB? (three words)
A: Media Creation Tool
Q: What is the minimum USB size for Windows installation media? Write in GB.
A: 8 | 8GB | 8 GB
Q: Which install option performs a clean install? (one word, the setup choice)
A: Custom
Q: What security chip version does Windows 11 require? Write like TPM 2.0.
A: TPM 2.0 | 2.0
Q: Which Windows tool shows devices missing drivers? (two words)
A: Device Manager
Q: When did Windows 10 free support end? Write month and year.
A: October 2025 | Oct 2025
Q: What should you always do before a clean install? (two words)
A: back up | backup
```
