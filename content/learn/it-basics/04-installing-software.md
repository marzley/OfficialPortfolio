---
slug: installing-software
title: Installing, updating and removing software safely
after: storage-data-units
---
# Installing, updating and removing software safely

Installing programs is simple, but installing the **wrong** file is one of the most common ways computers get viruses. Here's how to do it safely on Windows, Mac and phones.

## The golden rule: get software from the official source

| Safe sources | Risky sources |
|---|---|
| The developer's official website (e.g. zoom.us, python.org, code.visualstudio.com) | Random download sites full of "Download" buttons |
| **Microsoft Store**, **Mac App Store** | "Free Office 2024 full crack" |
| **Google Play Store**, **Apple App Store** | APK files sent on WhatsApp or Telegram |
| Your organisation's IT department | USB drives from strangers |

**Cracked** or **pirated** software ("free full version", "keygen", "activator") very often contains malware that steals passwords, M-Pesa details or encrypts your files. Many excellent free alternatives exist (below).

## Installing on Windows

1. Download the installer (`.exe` or `.msi`) from the official site.
2. Right-click → **Properties**: check the file name and size look right. Windows may show the publisher when you run it: it should be the real company.
3. Run it. If **User Account Control** asks "Do you want to allow this app to make changes?", only say yes for software you trust.
4. Read each screen: **untick** extra offers (toolbars, "recommended" apps, changing your browser's homepage).
5. Choose where to install (the default is usually fine).

**winget** installs apps from the command line (Windows 10/11):

```
winget search vscode
winget install Microsoft.VisualStudioCode
winget upgrade --all
```

## Installing on macOS

Download a `.dmg`, open it, and drag the app into **Applications**. If macOS says the developer can't be verified, be careful: only open it if you're sure of the source.

## Installing on Android

- Use the **Play Store**. Check the developer name, number of downloads and reviews.
- Look at the **permissions**: why would a torch app need your contacts and SMS?
- Avoid installing APKs from unknown sources. If you must (e.g. a company's own app from its official website), turn "Install unknown apps" back off afterwards.

## Updating

Updates fix security holes and bugs. Turn on automatic updates where possible.

- **Windows**: Settings → Windows Update (also updates Defender and some drivers).
- **Apps**: many update themselves; otherwise use the Store or the app's "Check for updates".
- **Phones**: Settings → System update, and Play Store → Manage apps & device → Update all.
- **Browsers** update automatically: restart them now and then so updates apply.

## Uninstalling

- **Windows**: Settings → Apps → Installed apps → ⋯ → Uninstall.
- **Mac**: drag the app from Applications to the Bin.
- **Android**: long-press the app → Uninstall.

Remove software you don't use: fewer programs means faster start-up and fewer security risks.

## Free, legal alternatives to expensive software

| Paid | Free alternative |
|---|---|
| Microsoft Office | **LibreOffice**, **Google Docs/Sheets/Slides**, Office on the web (free with a Microsoft account) |
| Photoshop | **GIMP**, **Photopea** (in the browser), **Canva** |
| Illustrator | **Inkscape** |
| Premiere Pro | **DaVinci Resolve**, **Shotcut**, CapCut |
| Paid antivirus | **Microsoft Defender** (built into Windows) |
| WinZip/WinRAR | **7-Zip** |
| Paid code editors | **VS Code** |

## Drivers

**Drivers** let Windows talk to hardware (printer, Wi-Fi card, graphics). Get them from Windows Update or the manufacturer's website (HP, Dell, Lenovo...), never from "driver updater" tools that advertise online.

```quiz
Q: Where should you download software from? (two words)
A: official website | official source | the official website
Q: What does it mean when free "full version" software has been modified to skip payment?
A: cracked | pirated
Q: Which Windows command-line tool installs apps like winget install?
A: winget
Q: Name a free alternative to Microsoft Office.
A: LibreOffice | Google Docs | Office on the web | OnlyOffice | WPS
Q: What must you check on an Android app before installing: reviews, developer, and what else?
A: permissions | downloads
```
