---
slug: install-configure
title: Installing and setting up Git (Windows, Mac, Linux)
after: what-is-git
---
# Installing and setting up Git

Before your first commit, install Git and tell it who you are. This takes five minutes and you only do it once per computer.

## Install

| System | How |
|---|---|
| **Windows** | Download from **git-scm.com**, run the installer. The defaults are fine; choose VS Code as the default editor if you use it. You also get **Git Bash**, a Linux-style terminal. |
| **macOS** | Open Terminal and run `git --version`. If it isn't installed, macOS offers to install the developer tools. Or `brew install git`. |
| **Ubuntu / Debian** | `sudo apt update && sudo apt install git` |
| **Android** | The **Termux** app: `pkg install git` (yes, you can learn Git on a phone) |

Check it worked:

```bash
git --version
```

## Tell Git who you are

Every commit records an author name and email. Use the **same email as your GitHub account** so your commits link to your profile.

```bash
git config --global user.name "Amina Hassan"
git config --global user.email "amina@example.com"
```

## Recommended settings

```bash
git config --global init.defaultBranch main      # new repos start on "main"
git config --global core.editor "code --wait"    # use VS Code for commit messages
git config --global pull.rebase false            # pull merges (simplest for beginners)
git config --global core.autocrlf true           # Windows only: handle line endings
git config --global color.ui auto
```

See everything you've set:

```bash
git config --list --show-origin
```

## Connecting to GitHub: HTTPS or SSH

**Option 1: HTTPS (easiest).** When you first `git push`, a browser window asks you to sign in to GitHub (Git Credential Manager on Windows/macOS). On Linux, create a **personal access token** on GitHub (Settings → Developer settings) and use it instead of a password.

**Option 2: SSH keys (no passwords, great for servers).**

```bash
ssh-keygen -t ed25519 -C "amina@example.com"     # press Enter to accept defaults
cat ~/.ssh/id_ed25519.pub                         # copy this public key
```

On GitHub: **Settings → SSH and GPG keys → New SSH key**, paste it. Then test:

```bash
ssh -T git@github.com
```

Use SSH addresses like `git@github.com:amina/portfolio.git` when cloning.

> Never share your **private** key (`id_ed25519` without `.pub`). The `.pub` file is the one you give out.

## The three places your files live

| Area | What's there | Commands |
|---|---|---|
| **Working directory** | Files as you edit them | edit, save |
| **Staging area** | Changes chosen for the next commit | `git add` |
| **Repository** | Saved snapshots (commits) | `git commit` |

```bash
git status           # what's changed, what's staged
git add index.html   # stage one file
git add .            # stage everything in this folder
git commit -m "Add contact section"
git log --oneline    # history, one line per commit
```

## Git in VS Code

VS Code has Git built in: the **Source Control** icon on the left shows changed files, a `+` to stage, a message box and a ✓ to commit, and a button to push. It runs the same commands for you. Learn the commands first, then use whichever is faster.

```quiz
Q: Which command shows your installed Git version?
A: git --version
Q: Which setting stores your name for commits? (write the config key)
A: user.name
Q: Which file do you upload to GitHub: id_ed25519 or id_ed25519.pub?
A: id_ed25519.pub | .pub | the .pub file
Q: Which command stages every changed file in the current folder?
A: git add . | git add -A | git add --all
Q: Which command shows history, one line per commit?
A: git log --oneline
```
