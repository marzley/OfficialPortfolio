---
slug: files-windows
title: "Files, folders and Windows skills: organise, find, copy, zip and back up your work"
after: KEEP
---
# Files, folders and Windows skills: organise, find, copy, zip and back up your work

"Where did I save that document?" "My flash disk is full of shortcuts!" "I deleted it by mistake!" Managing files is one of the most practical computer skills for students, office workers, cyber café attendants and freelancers. This unit teaches Windows file management step by step: folders, file names and extensions, copying and moving, searching, zipping, the Recycle Bin, flash drives and backups, plus essential Windows settings.

:::note What you will learn
- Files, folders, paths and drives
- File Explorer: navigating, views, sorting
- Naming files well and understanding extensions
- Creating, renaming, copying, moving and deleting (with shortcuts)
- Searching for files
- Zipping and unzipping
- Flash drives safely (and the "shortcut virus")
- Backups: OneDrive/Google Drive and external drives
- Useful Windows settings and keyboard shortcuts
:::

## Files, folders and drives

| Term | Meaning | Example |
|---|---|---|
| **File** | One saved item: a document, photo, song, program | `CV-Wanjiku.docx` |
| **Folder** | A container for files and other folders | `Documents\Job Applications` |
| **Drive** | A storage device or partition, given a letter | `C:` (main), `D:` (second drive), `E:` (flash disk) |
| **Path** | The full address of a file | `C:\Users\Wanjiku\Documents\CV-Wanjiku.docx` |

Folders inside folders create a **tree**, like a filing cabinet with drawers (drives), hanging files (folders) and papers (files).

## File Explorer

Open it with **Windows key + E** or the yellow folder icon on the taskbar.

| Area | What it shows |
|---|---|
| Navigation pane (left) | Quick access, This PC, OneDrive, drives |
| Address bar (top) | The current path (click it to see/copy the full path) |
| Main area | Files and folders in the current location |
| Search box (top right) | Search the current folder and its subfolders |
| View options | Large icons, list, **details** (shows date, type, size) |

**Details view** is the most useful for work: click column headers to **sort** by name, date modified, type or size (great for finding the latest version or the biggest files).

## File extensions: what type is this file?

The **extension** is the part after the last dot. It tells Windows which program opens the file.

| Extension | Type | Opens with |
|---|---|---|
| `.docx` | Word document | Word, Google Docs, LibreOffice |
| `.xlsx` | Excel spreadsheet | Excel, Google Sheets |
| `.pptx` | PowerPoint presentation | PowerPoint, Google Slides |
| `.pdf` | PDF document | Browser, Adobe Reader |
| `.jpg`, `.png`, `.webp` | Images | Photos app, browser |
| `.mp4`, `.mp3` | Video, audio | Media player |
| `.zip` | Compressed folder | File Explorer |
| `.exe`, `.msi` | Programs/installers | Windows (be careful!) |
| `.txt` | Plain text | Notepad |

### Show extensions (do this now)

File Explorer → **View** → **Show** → tick **File name extensions** (Windows 11), or View tab → tick "File name extensions" (Windows 10).

:::warning Why showing extensions protects you
Scammers send files like `Invoice.pdf.exe`. With extensions hidden, it looks like `Invoice.pdf`, but it's actually a **program** that can install malware. Showing extensions lets you spot the real type.
:::

## Naming files well

Good names save hours later:

| Bad | Good |
|---|---|
| `Document1.docx` | `CV-Wanjiku-Kamau-2026.docx` |
| `final final 2.docx` | `Proposal-ABC-School-v3.docx` |
| `IMG_20260214_103522.jpg` | `shop-front-thika.jpg` |
| `New folder (3)` | `2026-Term-2-Assignments` |

Tips:
- Describe the content; add dates as **YYYY-MM-DD** (they sort correctly): `2026-10-02-minutes.docx`.
- Use versions (`v1`, `v2`) instead of "final".
- Avoid special characters: `\ / : * ? " < > |` aren't allowed in Windows names.
- For websites and sharing online, use lowercase and hyphens instead of spaces.

## Organising folders

A simple structure:

```
Documents
├── School (or Work)
│   ├── 2026 Term 1
│   └── 2026 Term 2
├── Personal
│   ├── ID and certificates (scans)
│   └── Receipts
├── Business
│   ├── Clients
│   └── Invoices
└── Projects
```

Rule: **one place for each thing**, and don't leave everything on the Desktop (a cluttered Desktop also slows some PCs and isn't always backed up).

## Everyday file actions

| Action | How | Shortcut |
|---|---|---|
| New folder | Right-click → New → Folder | `Ctrl+Shift+N` |
| Rename | Select → `F2` (or right-click → Rename) | `F2` |
| Copy | Select → Copy | `Ctrl+C` |
| Cut (to move) | Select → Cut | `Ctrl+X` |
| Paste | Go to destination → Paste | `Ctrl+V` |
| Undo | Undo the last action | `Ctrl+Z` |
| Select all | | `Ctrl+A` |
| Select several | Hold `Ctrl` and click each | |
| Select a range | Click first, hold `Shift`, click last | |
| Delete (to Recycle Bin) | Select → `Delete` | `Delete` |
| Delete permanently | | `Shift+Delete` (careful!) |
| Properties (size, location) | Right-click → Properties | `Alt+Enter` |

**Copy vs move:** copying leaves the original and makes a duplicate; moving (cut + paste) relocates it. Dragging a file to another folder on the **same drive** moves it; to a **different drive** (e.g. a flash disk) it copies.

### The Recycle Bin

Deleted files go to the **Recycle Bin** (desktop icon) until you empty it. To recover: open the Recycle Bin → right-click the file → **Restore**. Files deleted from flash drives or with Shift+Delete usually **skip** the Recycle Bin.

## Finding files

1. **Search box** in File Explorer: type part of the name; it searches the current folder and subfolders.
2. **Start menu search:** press the Windows key and type.
3. **Sort by Date modified** to find what you worked on recently.
4. **Quick access / Recent files** in File Explorer's Home.
5. In Office apps: **File → Open → Recent**.

Search tips: `*.pdf` finds all PDFs; `kind:document`; `datemodified:this week`.

## Zipping and unzipping

A **ZIP** file packs many files into one compressed file: easier to email, upload or share, and sometimes smaller.

- **Create:** select the files/folder → right-click → **Compress to ZIP file** (Windows 11) or **Send to → Compressed (zipped) folder** (Windows 10).
- **Extract:** right-click the `.zip` → **Extract All** → choose a location.

Always **extract** before editing files; editing directly inside a zip often fails to save.

## Flash drives and memory cards

1. Plug in; it appears in File Explorer under **This PC** with a letter (e.g. `E:`).
2. Copy files to and from it like any folder.
3. **Eject safely** before removing: click the USB icon in the taskbar's hidden icons (^) → Eject, or right-click the drive → Eject. Pulling it out while copying can corrupt files.

### The "shortcut virus"

A common infection, spread through shared flash disks in schools and cyber cafés, hides your folders and replaces them with **shortcuts** that run malware when clicked.

- **Don't click** the shortcuts.
- Scan the flash disk with **Windows Security** (right-click → Scan with Microsoft Defender) or another trusted antivirus.
- Your files are usually still there but **hidden**: in File Explorer, show hidden items (View → Show → Hidden items) to see them; antivirus tools and some command-line steps can restore normal attributes. If unsure, ask a technician (see the malware cleanup lesson).
- Prevent it: keep Windows and antivirus updated, scan flash disks before opening, and don't open unknown `.exe` or shortcut files.

## Backups: protect your work

Hard drives fail, laptops get stolen, phones fall in water. If a file exists in only one place, it's not safe.

The **3-2-1 rule:** keep **3** copies of important data, on **2** different types of storage, with **1** copy offsite (e.g. the cloud).

| Backup option | How |
|---|---|
| **OneDrive** (built into Windows) | Sign in with a Microsoft account; turn on folder backup for Desktop, Documents, Pictures (free storage is limited) |
| **Google Drive** | Install Google Drive for desktop, or upload important folders; 15 GB free shared with Gmail |
| **External hard drive / flash disk** | Copy important folders weekly (or use Windows **File History**) |
| **Email important documents to yourself** | Quick extra copy for CVs and certificates |

:::think A student keeps their entire final-year project only on a flash disk. What could go wrong, and what would be a better plan?
The flash disk could be lost, stolen, infected with a virus or corrupted, and the whole project would be gone. Better: work in a synced cloud folder (OneDrive/Google Drive), keep a copy on the laptop, and back up to the flash disk or an external drive regularly (3-2-1 rule).
:::

## Useful Windows skills

| Task | How |
|---|---|
| Switch between open windows | `Alt+Tab` |
| Show desktop | `Windows+D` |
| Snap windows side by side | `Windows+Left/Right arrow` |
| Lock your PC (when stepping away) | `Windows+L` |
| Screenshot (snip a part) | `Windows+Shift+S` |
| Open Settings | `Windows+I` |
| Task Manager (close frozen apps) | `Ctrl+Shift+Esc` |
| Clipboard history | `Windows+V` (turn it on first) |
| Emoji panel | `Windows+.` |

### Settings worth knowing

- **Windows Update:** Settings → Windows Update. Keep it updated for security.
- **Display:** brightness, scale (make text bigger), night light.
- **Storage:** Settings → System → Storage → Storage Sense to clean temporary files.
- **Default apps:** choose which app opens PDFs, photos, etc.
- **Accounts:** set a password or PIN; use Windows Hello if your laptop supports it.

## Practice tasks

1. Turn on file name extensions and hidden items in File Explorer.
2. Create a folder structure for your school or work with at least 3 levels.
3. Rename 5 badly named files using the naming tips (with YYYY-MM-DD dates).
4. Zip a folder, email or upload it, then extract it elsewhere.
5. Set up a backup: OneDrive folder backup, Google Drive, or a weekly external drive copy.

## Summary

- Files live in folders on drives; a path is a file's full address.
- Use File Explorer's Details view and sorting; show file extensions to spot fake files.
- Name files descriptively with YYYY-MM-DD dates and versions.
- Master copy/cut/paste/rename/delete shortcuts; restore mistakes from the Recycle Bin.
- Search with the search box and Start menu; zip files for sharing and extract before editing.
- Eject flash drives safely, beware the shortcut virus, and follow the 3-2-1 backup rule.

```quiz
Q: Which keyboard shortcut opens File Explorer? Write like Windows+E.
A: Windows+E | Win+E | windows + e
Q: Which key renames a selected file?
A: F2
Q: What is the extension of a Word document?
A: .docx | docx
Q: Which shortcut deletes a file permanently, skipping the Recycle Bin?
A: Shift+Delete | shift delete
Q: Which date format sorts correctly in file names? Write the pattern.
A: YYYY-MM-DD | yyyy-mm-dd
Q: In the 3-2-1 backup rule, how many copies should you keep?
A: 3 | three
Q: Which shortcut locks your PC when you step away? Write like Windows+L.
A: Windows+L | Win+L
Q: Which shortcut takes a screenshot of part of the screen? Write like Windows+Shift+S.
A: Windows+Shift+S | Win+Shift+S
```
