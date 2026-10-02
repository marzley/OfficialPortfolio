---
slug: why-linux
title: "Why Linux and the terminal: what Linux is, who uses it, distributions and how to start practising"
after: KEEP
---
# Why Linux and the terminal: what Linux is, who uses it, distributions and how to start practising

Most websites you visit, including M-Pesa's back-end systems, bank servers, cloud platforms and the hosting behind Kenyan e-commerce sites, run on **Linux**. Android phones run on the Linux kernel. Supercomputers, routers, smart TVs and many IoT devices use it. If you want to work as a developer, system administrator, network engineer, cybersecurity analyst, cloud or DevOps engineer, you'll use Linux, and mostly through the **terminal** (the command line).

This unit explains what Linux is, why the terminal matters, which version to choose, and how to start practising today, even on a Windows laptop.

:::note What you will learn
- What an operating system and a kernel are
- What Linux is and its history in brief
- Who uses Linux and where
- Distributions: Ubuntu, Debian, Fedora, Kali and others
- Why professionals use the terminal instead of clicking
- The shell, prompt and anatomy of a command
- Ways to practise: WSL, virtual machines, cloud servers, live USB
- Getting help: man, --help, tldr
:::

## Operating systems and kernels

An **operating system (OS)** manages the computer's hardware and runs programs: Windows, macOS, Android, iOS, Linux. At its core is the **kernel**, which talks to the CPU, memory, disks and devices. On top of the kernel sit tools, a shell, and optionally a graphical desktop.

**Linux** strictly means the kernel, created in 1991 by **Linus Torvalds**, then a Finnish student. Combined with GNU tools and other software, it becomes a full operating system. It's **open source**: free to use, study, modify and share.

## Who uses Linux, and where?

| Where | Examples |
|---|---|
| **Web servers and hosting** | The large majority of web servers run Linux (Apache, Nginx, PHP, MySQL) |
| **Cloud** | AWS, Google Cloud, Azure virtual machines mostly run Linux |
| **Mobile** | Android is built on the Linux kernel |
| **Networking** | Many routers, firewalls and switches run Linux-based systems |
| **Cybersecurity** | Kali Linux and Parrot for penetration testing; security tools run on Linux |
| **Data science and AI** | Training servers and GPU machines run Linux |
| **Embedded and IoT** | Raspberry Pi, smart TVs, car systems, point-of-sale devices |
| **Supercomputers** | Essentially all of the world's top supercomputers |
| **Desktops** | Developers, schools and users who want a free, secure system |

Job titles that require Linux: system administrator, DevOps engineer, cloud engineer, site reliability engineer, network engineer, security analyst, back-end developer, data engineer.

## Distributions (distros)

A **distribution** packages the Linux kernel with tools, a package manager and often a desktop.

| Distro | Best for | Package manager |
|---|---|---|
| **Ubuntu** | Beginners, servers, cloud (very popular) | `apt` |
| **Debian** | Stable servers (Ubuntu is based on it) | `apt` |
| **Linux Mint** | Windows-like desktop for beginners | `apt` |
| **Fedora** | Up-to-date desktop and developer workstation | `dnf` |
| **Red Hat Enterprise Linux (RHEL), Rocky, AlmaLinux** | Enterprise servers, banks, telcos | `dnf` |
| **Kali Linux** | Security testing (not for daily use) | `apt` |
| **Alpine** | Tiny containers (Docker images) | `apk` |

Learn on **Ubuntu**: it's beginner-friendly, widely used on servers, and most online tutorials use it. Skills transfer to every distro.

## Why use the terminal?

| Terminal | Graphical interface |
|---|---|
| Works on servers with no screen (most servers have no desktop) | Needs a desktop environment |
| Fast for repetitive tasks: rename 1,000 files in one line | Click one by one |
| Scriptable and automatable (backups, deployments) | Hard to automate |
| Works over slow connections via SSH | Remote desktops need good bandwidth |
| Precise and repeatable; easy to document and share | "Click here, then there..." |

## The shell and the prompt

The **terminal** is the window; the **shell** is the program that reads your commands. The most common shell is **Bash** (Ubuntu's default); macOS uses **zsh**, which is very similar.

```
wanjiku@laptop:~/projects$
```

| Part | Meaning |
|---|---|
| `wanjiku` | Your username |
| `laptop` | The computer's hostname |
| `~/projects` | Current folder (`~` is your home folder) |
| `$` | Normal user (`#` means you're root, the administrator) |

## Anatomy of a command

```bash
ls -l -a /etc
```

| Part | Meaning |
|---|---|
| `ls` | The command (list files) |
| `-l -a` (or `-la`) | Options/flags that change behaviour |
| `/etc` | Argument: what to act on |

Linux is **case-sensitive**: `Documents` and `documents` are different, and `LS` isn't a command.

Your first commands:

```bash
whoami          # your username
hostname        # computer name
pwd             # print working directory (where am I?)
date            # current date and time
uname -a        # kernel information
cat /etc/os-release   # which distro and version
clear           # clear the screen (or Ctrl+L)
history         # commands you've typed
```

Keyboard time-savers:
- **Tab**: auto-complete commands and file names (press twice to see options).
- **↑ / ↓**: previous/next commands.
- **Ctrl+C**: stop the running command.
- **Ctrl+R**: search your command history.

## Ways to practise

| Option | How | Notes |
|---|---|---|
| **WSL (Windows Subsystem for Linux)** | In PowerShell as admin: `wsl --install`, restart, set a username | Real Ubuntu inside Windows; best for most Windows users |
| **Virtual machine** | VirtualBox (free) + Ubuntu ISO | Full desktop; needs 4–8 GB RAM to be comfortable |
| **Live USB** | Flash Ubuntu to a USB with Rufus/balenaEtcher, boot from it | Try without installing |
| **Dual boot** | Install Linux alongside Windows | Back up first |
| **Cloud server** | A small VPS from a cloud provider; many offer free trials or credits | Real server experience over SSH |
| **Raspberry Pi** | A low-cost computer running Raspberry Pi OS | Great for IoT projects |
| **macOS Terminal** | Most commands work the same | macOS is Unix-based |

## Getting help

```bash
man ls          # the full manual (q to quit, / to search)
ls --help       # a quick summary of options
```

The community `tldr` tool (install with `sudo apt install tldr`) shows short practical examples. Online, the Ubuntu documentation, Ask Ubuntu and Stack Exchange are excellent.

:::warning Careful with copy-paste
Never paste commands you don't understand, especially with `sudo`, `rm -rf` or `curl ... | bash`. Read each command first; the terminal does exactly what you say, without "are you sure?".
:::

:::think A company's website runs on a server in a data centre with no monitor or keyboard. How do the administrators manage it, and why is the terminal essential?
They connect remotely with SSH and use the terminal. Servers usually have no graphical desktop (to save resources and reduce attack surface), so all management (installing software, editing configs, checking logs, restarting services) happens through commands and scripts.
:::

## Summary

- Linux is an open-source kernel (Linus Torvalds, 1991) that powers servers, cloud, Android, networking, security and supercomputers.
- Distributions package it: Ubuntu (learn here), Debian, Fedora, RHEL/Rocky, Kali, Alpine.
- The terminal is essential: servers have no desktop, and commands are fast, precise and scriptable.
- Commands are `command -options arguments`; Linux is case-sensitive; Tab and ↑ save time.
- Practise with WSL, a VM, a live USB or a cloud server; get help with `man` and `--help`.

```quiz
Q: Who created the Linux kernel? (full name)
A: Linus Torvalds
Q: Which distribution is recommended for beginners in this lesson?
A: Ubuntu
Q: Which command shows your current folder?
A: pwd
Q: What does the # at the end of a prompt mean?
A: root | you are root | administrator | root user
Q: Which key auto-completes commands and file names?
A: Tab
Q: Which command installs Linux inside Windows from PowerShell? (two words)
A: wsl --install
```
