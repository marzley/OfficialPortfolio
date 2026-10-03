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

## Why installing software safely matters

Many virus and ransomware infections start with one careless download: a "free" cracked copy of Office, a fake update pop-up, a modified APK sent on WhatsApp, or a "driver booster" from an advert. Cracked and pirated software often contains malware that steals passwords, M-Pesa and banking details, or encrypts files for ransom. ICT technicians spend much of their time cleaning up after unsafe installs. Learning to install, update and remove software correctly keeps devices fast and secure.

## Recognising fake download buttons and sites

| Warning sign | Example |
|---|---|
| Several big "DOWNLOAD" buttons on one page | Adverts disguised as download links |
| Web address doesn't match the company | `vlc-free-download-full.xyz` instead of `videolan.org` |
| The file name or type is wrong | Expecting a PDF but getting `document.pdf.exe` |
| Pop-ups saying "Your PC is infected! Download now" | Scareware |
| "Cracked", "keygen", "patch", "full version free" | Pirated software, often with malware |
| Requests to disable antivirus before installing | A major red flag |

Search for the official site, or better, use a trusted store (Microsoft Store, winget, Google Play, Apple App Store).

## Checking an installer before running it

1. Right-click the file → **Properties** → check the size and type.
2. On the **Digital Signatures** tab, check that the publisher matches the company (e.g. "Google LLC").
3. When Windows shows the User Account Control prompt, read the "Verified publisher". "Unknown publisher" deserves caution.
4. Upload suspicious files to **VirusTotal** (virustotal.com), which scans with many antivirus engines (don't upload confidential documents).
5. If in doubt, don't run it.

## Reading the installer carefully

Some free installers bundle extra software: browser toolbars, "PC optimisers", changes to your homepage or search engine. Choose **Custom/Advanced install** and untick extras. Read each screen instead of clicking "Next" repeatedly.

## Package managers: install and update in one command

Windows **winget** installs and updates trusted software from the command line:

```
winget search vlc
winget install VideoLAN.VLC
winget install Google.Chrome Mozilla.Firefox 7zip.7zip
winget upgrade --all              update everything that has updates
winget list                       list installed programs
```

Technicians use this to set up many computers quickly. Linux has `apt` (Ubuntu/Debian), and macOS users often use Homebrew.

## Android: safe app habits

- Install from **Google Play** and check the developer name, number of downloads, recent reviews and requested permissions.
- Keep **Google Play Protect** turned on (Play Store → profile → Play Protect).
- Avoid APK files from WhatsApp, Telegram or unknown websites, especially "modified" versions of WhatsApp, Netflix or banking apps.
- Be suspicious of loan apps and "earn money" apps that ask for contacts, SMS or call logs.
- Review app permissions in Settings → Apps → Permissions, and remove apps you no longer use.

## Licences: understanding what you're allowed to do

| Licence type | Meaning | Example |
|---|---|---|
| Proprietary (paid) | Buy a licence or subscription | Microsoft 365, Adobe Photoshop |
| Freeware | Free to use, not open source | Zoom (basic), Google Chrome |
| Free trial | Full features for a limited time | Antivirus trials |
| Open source | Free to use, study, change and share | LibreOffice, GIMP, VLC, Firefox, Linux |
| Education licences | Free or cheap for students and teachers | Microsoft 365 Education, GitHub Student Developer Pack, Autodesk education (check eligibility) |

Using pirated software for a business is illegal and risky; free, legal alternatives exist for most needs.

## Updating safely

- Update operating system, browser and apps regularly; enable automatic updates where possible.
- Update only from inside the app or from the official source, never from a pop-up on a website.
- Restart after updates when asked.
- For important computers (e.g. a business's accounting PC), back up before major updates.

## Uninstalling properly

- Windows: Settings → Apps → Installed apps → choose the app → Uninstall.
- Remove programs you don't recognise or no longer use; check "Startup apps" too.
- Some antivirus programs need their vendor's special removal tool.
- On Android, long-press the app → Uninstall, or Settings → Apps.

## Drivers: getting the right ones

Drivers let the operating system talk to hardware (printer, Wi-Fi card, graphics card, scanner).

1. Windows Update installs most drivers automatically (Settings → Windows Update → Advanced options → Optional updates).
2. For printers and graphics cards, download from the manufacturer's official support page (HP, Canon, Epson, Intel, NVIDIA, AMD), searching your exact model number.
3. Avoid "driver updater" programs advertised online; many are scareware.
4. Check Device Manager (right-click Start → Device Manager) for yellow warning icons that indicate missing drivers.

## Setting up a new computer: a checklist

1. Run Windows Update until there are no more updates.
2. Create a standard user account for daily work; keep an admin account separate.
3. Install a browser, office suite, PDF reader, media player, and compression tool from official sources or winget.
4. Turn on Microsoft Defender (built in) and check that it's active.
5. Set up backups (OneDrive or an external drive).
6. Remove pre-installed trial software you don't need (bloatware).
7. Note the product keys and licences in a safe place.

## Practice

1. Find the official download page for VLC, LibreOffice and GIMP; check the web address of each.
2. Use winget to search for and install one program, then list installed apps.
3. Check the digital signature of an installer in your Downloads folder.
4. Review the permissions of five apps on your phone and remove any you don't need.
5. Open Device Manager and check for missing drivers.

:::think A friend sends you a "free full version" of a paid design program on a flash drive, saying "just turn off your antivirus while installing". What are the risks?
The antivirus would likely detect malware hidden in the crack, which is why you're told to disable it. The modified installer can steal passwords and M-Pesa/banking details, install ransomware or make the computer part of a botnet. It's also illegal to use pirated software. Use the official free trial, an education licence, or a free alternative like GIMP, Inkscape or Canva.
:::

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
Q: Which free website scans a suspicious file with many antivirus engines?
A: VirusTotal | virustotal.com
Q: Which winget command updates all programs that have updates?
A: winget upgrade --all | upgrade --all
Q: Which Google feature scans Android apps for harmful behaviour? (two words)
A: Play Protect | Google Play Protect
Q: In Windows, which tool shows hardware with missing drivers? (two words)
A: Device Manager
```
