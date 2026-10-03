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

## Why every developer needs Git

Git records every version of your code, lets you undo mistakes, work on new features without breaking what works, and collaborate with other developers without emailing zip files. Almost every software company, startup and open-source project uses Git, usually with GitHub, GitLab or Bitbucket. Employers expect you to know it, and your GitHub profile often acts as a portfolio when applying for developer jobs and internships.

## Your first repository from start to finish

```bash
mkdir duka-website && cd duka-website
git init                              # create a new repository (adds a hidden .git folder)
echo "# Duka website" > README.md
git status                            # README.md is "untracked"
git add README.md                     # stage it
git commit -m "Add README"            # save a snapshot
git log --oneline                     # see the history
```

Then connect it to GitHub:

```bash
# create an empty repository on github.com first (no README), then:
git remote add origin git@github.com:yourname/duka-website.git
git branch -M main
git push -u origin main               # -u remembers the link for future pushes
```

After this, `git push` and `git pull` are enough.

## Cloning an existing project

```bash
git clone https://github.com/someone/project.git
cd project
git log --oneline -5                  # last five commits
```

`git clone` downloads the whole history, not just the latest files, so you can work offline.

## Setting up SSH keys step by step

SSH keys let you push without typing a password or token each time.

```bash
ssh-keygen -t ed25519 -C "you@example.com"     # press Enter to accept the default location; add a passphrase
cat ~/.ssh/id_ed25519.pub                       # copy this PUBLIC key
# GitHub → Settings → SSH and GPG keys → New SSH key → paste
ssh -T git@github.com                           # test: "Hi yourname! You've successfully authenticated"
```

Never share the private key (`id_ed25519` without `.pub`). If a laptop is lost or stolen, delete its key from GitHub settings.

## HTTPS with tokens

If you use HTTPS, GitHub requires a **personal access token** (not your account password) for pushing. Git Credential Manager (included with Git for Windows) handles sign-in through the browser and stores credentials securely.

## Useful configuration

```bash
git config --global init.defaultBranch main
git config --global core.editor "code --wait"      # use VS Code for commit messages
git config --global pull.rebase false              # merge when pulling (simple default)
git config --global core.autocrlf true             # Windows: handle line endings
git config --global alias.st status                # shortcut: git st
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --list --show-origin                    # see all settings and where they come from
```

Aliases save typing: `git lg` shows a branch graph.

## Understanding status output

| Status | Meaning | Next step |
|---|---|---|
| Untracked | New file Git doesn't know about | `git add file` |
| Modified (not staged) | Changed since the last commit | `git add file` or `git restore file` to discard |
| Staged | Will be in the next commit | `git commit` or `git restore --staged file` to unstage |
| Clean | Nothing to commit | Keep working |

```bash
git diff                  # changes not yet staged
git diff --staged         # changes staged for the next commit
git restore index.html    # throw away unstaged changes in a file (careful!)
git restore --staged index.html   # unstage but keep changes
```

## Undoing common mistakes

| Mistake | Fix |
|---|---|
| Typo in the last commit message (not pushed) | `git commit --amend -m "New message"` |
| Forgot a file in the last commit (not pushed) | `git add file` then `git commit --amend --no-edit` |
| Want to undo a pushed commit safely | `git revert <commit>` (creates a new commit that reverses it) |
| Want to go back and look at an old version | `git switch --detach <commit>` then `git switch main` to return |
| Deleted a file by accident (not committed) | `git restore file` |

Avoid rewriting history (amend, reset, rebase) on commits already pushed and shared with others.

## Git on Windows, macOS and Linux: notes

- **Windows**: Git for Windows includes Git Bash, a terminal with Linux-style commands. VS Code's terminal can use it.
- **macOS**: run `git --version`; if missing, macOS offers to install the Command Line Tools.
- **Linux**: `sudo apt install git` (Ubuntu/Debian).
- Phones: you can browse repositories in the GitHub mobile app; serious work needs a computer.

## GitHub profile tips for job seekers

- A clear profile photo, name, location (e.g. Nairobi, Kenya) and short bio.
- **Pin** your 4 to 6 best repositories.
- Every project has a README with a description, screenshots, how to run it and a live demo link.
- A profile README (a repository named the same as your username) introduces you.
- Regular, meaningful commits matter more than a green contribution graph full of trivial changes.

## Practice

1. Create a repository, make three commits, and view them with `git log --oneline`.
2. Set up SSH keys and push the repository to GitHub.
3. Create aliases for `status` and a graph log.
4. Make a change, stage it, unstage it with `git restore --staged`, then discard it.
5. Amend the last commit to add a forgotten file.

:::think You committed a change, pushed it, and your teammate already pulled it. Now you realise it broke the login page. Should you use `git reset` or `git revert`, and why?
Use `git revert <commit>`. It adds a new commit that undoes the change, keeping history intact for everyone. `git reset` rewrites history; after pushing, it forces teammates to deal with conflicting histories and can lose work.
:::

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
Q: Which command creates a new Git repository in the current folder?
A: git init
Q: Which command safely undoes a pushed commit by creating a new commit?
A: git revert
Q: Which command fixes the message of the last commit that hasn't been pushed? (two words after git)
A: commit --amend | git commit --amend
Q: Which command downloads a repository and its history from GitHub?
A: git clone
```
