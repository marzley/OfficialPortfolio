---
slug: operating-systems
title: Operating systems: Windows, macOS, Linux, Android and iOS
after: keyboard-typing-shortcuts
---
# Operating systems

The **operating system (OS)** is the most important software on any computer or phone. It starts when you switch on, and every other app runs on top of it.

## What an OS does

| Job | Example |
|---|---|
| **Manages hardware** | Talks to the CPU, memory, disk, screen, printer (through **drivers**) |
| **Runs programs** | Starts, switches between and closes apps; shares memory fairly |
| **Manages files** | Folders, saving, copying, deleting, permissions |
| **User interface** | Desktop, icons, windows, touch screen, or a command line |
| **Security** | User accounts, passwords, updates, antivirus, permissions |
| **Networking** | Wi-Fi, Ethernet, internet connections |

## The main operating systems

| OS | Made by | Runs on | Notes |
|---|---|---|---|
| **Windows 11 / 10** | Microsoft | Most PCs and laptops | Most common in offices and cyber cafés |
| **macOS** | Apple | Mac computers only | Popular with designers |
| **Linux** (Ubuntu, Fedora, Mint...) | Open source community | PCs, most web servers, supercomputers | Free; powers most of the internet |
| **ChromeOS** | Google | Chromebooks | Mostly browser-based |
| **Android** | Google (open source base) | Most phones in Kenya | Many brands: Samsung, Tecno, Infinix... |
| **iOS / iPadOS** | Apple | iPhones, iPads | |

## Interfaces: GUI vs CLI

- **GUI** (graphical user interface): windows, icons, menus and a pointer (or touch). Easy to learn.
- **CLI** (command-line interface): you type commands. Faster for experts and used on servers. See the Linux tutorial.

## Open source vs proprietary

| | Proprietary | Open source |
|---|---|---|
| Source code | Secret | Anyone can read and improve it |
| Cost | Usually paid licence | Usually free |
| Examples | Windows, macOS | Linux, Android's core |

## Keeping your OS healthy

1. **Install updates**: they fix security holes attackers use. On Windows: Settings → Windows Update.
2. Use a **genuine** copy. Cracked versions often contain malware and don't get updates.
3. Keep at least **15–20% of the disk free**.
4. Uninstall programs you don't use (Settings → Apps).
5. Restart occasionally, especially after updates.
6. Keep antivirus on (Microsoft Defender is built in and good).

## Checking your system information

- **Windows**: Settings → System → About (processor, RAM, Windows version), or press **Win + Pause**.
- **macOS**: Apple menu → About This Mac.
- **Android**: Settings → About phone.

Knowing your RAM, storage and OS version helps when installing software or asking for support.

## 32-bit vs 64-bit

Modern computers use **64-bit** operating systems, which can use more than 4 GB of RAM. When downloading software, pick the 64-bit (x64) version unless your computer is very old. Newer laptops with ARM processors (e.g. Snapdragon) need ARM-compatible apps.

## Choosing an OS for a job

| Need | Good choice |
|---|---|
| Office work, most software, games | Windows |
| Design, video editing (with budget) | macOS |
| Web servers, programming, old slow PCs | Linux |
| Cheap, simple browsing and school work | ChromeOS |

## Why understanding operating systems helps you

The operating system (OS) is the software you interact with most. Knowing how it works helps you keep devices fast and secure, solve common problems (frozen programs, full storage, missing drivers), choose the right device for a job, and move between Windows, Android, macOS and Linux with confidence. ICT support technicians, system administrators, developers and cyber café attendants work with operating systems every day.

## The OS as a manager

| Job | What the OS manages | Example you can see |
|---|---|---|
| **Process management** | Which programs run and share the CPU | Task Manager list of apps and processes |
| **Memory management** | Who gets how much RAM | Memory usage % in Task Manager |
| **File management** | Folders, files, permissions | File Explorer, Files app |
| **Device management** | Printers, cameras, USB drives (through drivers) | Device Manager |
| **Security** | User accounts, passwords, permissions, updates | Login screen, "allow this app?" prompts |
| **User interface** | Desktop, menus, touch gestures | Start menu, home screen |
| **Networking** | Wi-Fi, mobile data, Bluetooth | Network icon in the taskbar |

## Task Manager: your troubleshooting friend

Open it with **Ctrl + Shift + Esc**:

| Tab | Use |
|---|---|
| Processes | See which app uses the most CPU, memory, disk; end a frozen app with "End task" |
| Performance | CPU, memory, disk and network graphs; how much RAM is installed |
| Startup apps | Disable programs that slow down boot time |
| App history / Users | Usage by app and user |

If the computer is slow, sort Processes by Memory or Disk. A browser with 40 tabs, an antivirus scan or Windows Update downloading are common causes.

## File systems and file management

| File system | Used by | Notes |
|---|---|---|
| NTFS | Windows drives | Supports permissions and large files |
| FAT32 | Older flash drives | Can't store single files over 4 GB |
| exFAT | Modern flash drives, SD cards | Works on Windows and Mac; large files |
| APFS | macOS | Apple's modern system |
| ext4 | Linux | Common Linux default |

Good file habits:

- Organise folders by purpose: `Documents/Clients/2026/Kamau Hardware/`.
- Use clear file names with dates: `2026-03-15 Invoice Kamau Hardware.pdf` (year-month-day sorts correctly).
- Know file extensions: `.docx` (Word), `.xlsx` (Excel), `.pdf`, `.jpg`, `.mp4`, `.zip`, `.exe` (program). Turn on "File name extensions" in File Explorer's View menu so you can spot fake files like `invoice.pdf.exe`.

## User accounts and permissions

- **Administrator** accounts can install software and change system settings.
- **Standard** accounts can't, which limits damage from mistakes and malware.

Best practice in offices and cyber cafés: use standard accounts for daily work and keep the admin password separate. Every person should have their own account with a password or PIN.

## Updates: why they matter

Updates fix security holes that attackers actively use, fix bugs and add features. Many ransomware outbreaks have spread through computers that missed security updates for months. Turn on automatic updates, restart when asked, and keep apps (browsers, Office, Zoom) updated too. Devices that no longer get security updates (for example, very old Android versions or Windows versions past end of support) should not be used for banking or sensitive work.

## Mobile operating systems in detail

| Feature | Android | iOS (iPhone) |
|---|---|---|
| Made by | Google (open source base), customised by Samsung, Tecno, Infinix, Xiaomi and others | Apple only |
| App store | Google Play (sideloading possible) | App Store only (in most countries) |
| Updates | Depend on the phone maker; budget phones may get fewer years | Usually many years of updates |
| Price range | Very cheap to very expensive | Mostly expensive |
| Customisation | High | Lower |

In Kenya most phones run Android. When buying, check how many years of security updates the maker promises.

## The command line (CLI) basics

The CLI lets you control the computer by typing commands. It's essential for IT support, servers and programming.

```
Windows (Command Prompt / PowerShell)     Meaning
ipconfig                                   show IP address and network details
ping google.com                            test internet connection
dir   (PowerShell: ls)                     list files
cd Documents                               change folder
systeminfo                                 detailed system information
sfc /scannow   (as admin)                  check and repair Windows system files
```

```
Linux / macOS terminal                     Meaning
ls                                         list files
cd Documents                               change folder
pwd                                        show the current folder
ip a   (macOS: ifconfig)                   network details
sudo apt update && sudo apt upgrade        update software (Ubuntu/Debian)
```

## Virtual machines

A **virtual machine** (VM) runs an operating system inside another, for example Ubuntu Linux inside Windows, using free software like VirtualBox. Students use VMs to learn Linux and cybersecurity safely without changing their main system. Windows also offers **WSL** (Windows Subsystem for Linux) to run Linux tools directly.

## Common problems and first fixes

| Problem | First things to try |
|---|---|
| Program frozen | Wait a moment, then Task Manager → End task |
| Computer very slow | Restart; check Task Manager; disable startup apps; free disk space; scan for malware |
| No sound | Check volume/mute, output device, cables; update the audio driver |
| Printer not working | Check power and cable/Wi-Fi, set as default, clear the print queue, reinstall the driver |
| Wi-Fi connected but no internet | Restart the router, check data bundle/credit, `ping` a website |
| Blue screen errors | Note the error code, update drivers and Windows, check for failing RAM or disk |

"Have you tried restarting it?" is a joke because it works so often: a restart clears memory and stuck processes.

## Practice

1. Open Task Manager, find the app using the most memory, and list your startup apps.
2. Check your OS name, version and whether it's 64-bit (Settings → System → About).
3. Turn on file name extensions and look at the extensions in your Downloads folder.
4. Run `ipconfig` and `ping google.com` and explain the results.
5. Install VirtualBox and create an Ubuntu virtual machine (if your computer has at least 8 GB RAM).

:::think Why do offices give staff standard accounts instead of administrator accounts, even though it's less convenient?
Malware and mistakes run with the permissions of the logged-in user. On a standard account, a malicious download or accidental click can't easily install software or change system settings, which limits damage. Admin rights are used only when needed, by IT staff.
:::

```quiz
Q: What software controls the hardware and runs every other program? (two words)
A: operating system | OS | an operating system
Q: Which operating system runs most web servers?
A: Linux
Q: Which operating system is on most phones in Kenya?
A: Android
Q: What is a text-based interface where you type commands called? (three letters)
A: CLI
Q: What small programs let the OS talk to hardware like printers?
A: drivers | driver
Q: Which shortcut opens Task Manager directly?
A: Ctrl + Shift + Esc | ctrl+shift+esc
Q: Which file system on old flash drives can't store a single file larger than 4 GB?
A: FAT32
Q: Which Windows command shows your IP address?
A: ipconfig
Q: What software lets you run one operating system inside another? (two words)
A: virtual machine | VirtualBox | VM
```
