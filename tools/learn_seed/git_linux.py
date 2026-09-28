from common import track, lesson

g = track("git", "Git & GitHub", "none", "Save every version of your code, work in teams, and publish your portfolio on GitHub.")

lesson(g, "what-is-git", "What is Git and why use it?", """
# What is Git?

**Git** is a **version control system**: it records every change to your project so you can go back in time, see who changed what, and work with others without overwriting each other's work. **GitHub** is a website that stores Git projects (**repositories**) online, and it's where employers look at your code.

## Why every developer uses it

- **Undo anything**: broke your website? Go back to yesterday's working version.
- **Branches**: try a new feature without risking the working version.
- **Teamwork**: many people work on the same code and Git merges their changes.
- **Backup**: your code is safe on GitHub even if your laptop is stolen.
- **Portfolio**: a GitHub profile with real projects helps you get hired.

## Key words

| Word | Meaning |
|---|---|
| **Repository (repo)** | A project folder tracked by Git |
| **Commit** | A saved snapshot with a message ("Add contact form") |
| **Branch** | A separate line of work (main, feature/login) |
| **Merge** | Combine a branch into another |
| **Clone** | Copy a repo from GitHub to your computer |
| **Push / Pull** | Send your commits to GitHub / get others' commits |
| **Pull request (PR)** | Ask to merge your branch on GitHub, with review |

## Install and set up

1. Download Git from [git-scm.com](https://git-scm.com/) (Windows: keep the defaults; macOS: `xcode-select --install`; Ubuntu: `sudo apt install git`).
2. Tell Git who you are (once per computer):

```
git config --global user.name "Wanjiku Kamau"
git config --global user.email "wanjiku@example.com"
git config --global init.defaultBranch main
```

3. Create a free account at [github.com](https://github.com/).

```quiz
Q: What is a saved snapshot of your project in Git called?
A: commit | a commit
Q: What website stores Git repositories online (the most popular one)?
A: GitHub
Q: What is a separate line of work in Git called?
A: branch | a branch
Q: What command copies a repository from GitHub to your computer?
A: git clone | clone
```
""")

lesson(g, "first-repo", "Your first repository", """
# Your first repository

## The three areas

1. **Working directory**: your files as you edit them.
2. **Staging area**: changes you've chosen for the next commit (`git add`).
3. **Repository**: saved commits (`git commit`).

## Step by step

```
mkdir my-site
cd my-site
git init                      # start tracking this folder
echo "<h1>Hello</h1>" > index.html
git status                    # see what changed
git add index.html            # stage the file   (git add . = everything)
git commit -m "Add home page" # save a snapshot
git log --oneline             # history
```

## Everyday commands

| Command | What it does |
|---|---|
| `git status` | What's changed, what's staged |
| `git add file` / `git add .` | Stage one file / all changes |
| `git commit -m "message"` | Save staged changes |
| `git log --oneline` | Short history |
| `git diff` | Show unstaged changes line by line |
| `git restore file` | Throw away unsaved changes to a file |
| `git restore --staged file` | Unstage a file |
| `git revert <commit>` | Safely undo a commit with a new commit |

## Good commit messages

Short, in the imperative, saying *what and why*: "Fix M-Pesa callback URL", "Add pricing page". Not "changes" or "stuff".

## .gitignore

A file listing things Git must **not** track: passwords, config with secrets, `node_modules/`, `vendor/`, `.env`, uploads, big files.

```
.env
config.php
node_modules/
*.log
```

> Never commit passwords or API keys. If you do, change them immediately. Deleting the file later doesn't remove it from history.

```quiz
Q: Which command starts tracking a folder with Git?
A: git init
Q: Which command stages all changes?
A: git add . | git add -A | git add --all
Q: Which command shows what has changed and what is staged?
A: git status
Q: What file tells Git which files to ignore?
A: .gitignore | gitignore
Q: Should you commit your M-Pesa API passwords to GitHub? (yes/no)
A: no
```
""")

lesson(g, "branches", "Branches and merging", """
# Branches and merging

A **branch** lets you work on something new while `main` stays working.

```
git switch -c feature/contact-form   # create and move to a new branch
# ... edit files, add, commit ...
git switch main                      # back to main
git merge feature/contact-form       # bring the work in
git branch -d feature/contact-form   # delete the finished branch
```

`git branch` lists branches; the current one has a `*`.

## Merge conflicts

If two branches change the **same lines**, Git can't decide and marks the file:

```
<<<<<<< HEAD
<h1>Welcome to our shop</h1>
=======
<h1>Karibu to our shop</h1>
>>>>>>> feature/kiswahili
```

Fix it: edit the file to the version you want, delete the markers, then `git add` and `git commit`. VS Code shows buttons: "Accept current", "Accept incoming", "Accept both".

## A simple team workflow

1. `main` always works and is what's live.
2. Each feature or fix gets its own branch.
3. Push the branch, open a **pull request**, get it reviewed.
4. Merge into `main`, then deploy.

```quiz
Q: Which command creates a new branch and switches to it (modern Git)?
A: git switch -c | git switch -c name | git checkout -b
Q: Which branch should always be working and live?
A: main | master
Q: What happens when two branches change the same lines differently?
A: conflict | merge conflict | a merge conflict
```
""")

lesson(g, "github", "GitHub: push, pull, clone", """
# Working with GitHub

## Put your project on GitHub

1. On GitHub click **New repository**, name it (e.g. `my-site`), don't add a README if your project already exists.
2. Connect and push:

```
git remote add origin https://github.com/yourname/my-site.git
git push -u origin main
```

GitHub will ask you to log in: use the **GitHub CLI** (`gh auth login`), **Git Credential Manager** (comes with Git for Windows), or an **SSH key**. Passwords alone don't work for Git anymore.

## Daily sync

```
git pull          # get the latest from GitHub before you start
# work, add, commit
git push          # send your commits
```

## Clone someone's project

```
git clone https://github.com/user/project.git
```

## Contributing to other projects

1. **Fork** the repo (your own copy on GitHub).
2. Clone your fork, create a branch, commit your change.
3. Push and open a **pull request** to the original project.

This is how open-source works, and contributing is a great way to learn and get noticed.

## Your GitHub profile = your CV

- Pin your best 4–6 projects.
- Each repo needs a **README.md**: what it is, screenshot, how to run it, live link.
- Commit regularly; employers like to see steady activity.

```quiz
Q: Which command sends your commits to GitHub?
A: git push | push
Q: Which command gets the latest changes from GitHub?
A: git pull | pull
Q: What do you create on GitHub to make your own copy of someone else's repo?
A: fork | a fork
Q: What file explains a project on its GitHub page?
A: README.md | readme | readme.md
```
""")

lesson(g, "github-pages", "Publish a website free with GitHub Pages", """
# GitHub Pages: free hosting for static sites

GitHub Pages hosts **HTML, CSS and JavaScript** sites for free. Perfect for your portfolio or a practice project (no PHP or databases).

## Steps

1. Create a repo named **`yourusername.github.io`** (replace with your username).
2. Add an `index.html` (and your CSS, images).
3. Commit and push.
4. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main / root → Save**.
5. After a minute your site is live at `https://yourusername.github.io`.

For any other repo, Pages gives `https://yourusername.github.io/reponame/`.

## Custom domain

Buy a domain (e.g. `yourname.co.ke`), add it under Settings → Pages → Custom domain, and at your domain's DNS add the records GitHub shows (A records or a CNAME to `yourusername.github.io`). Tick **Enforce HTTPS**.

## Portfolio checklist

- A home page with your name, photo, what you do.
- 3–6 projects with screenshots, what you built, live link and GitHub link.
- Contact: email, WhatsApp, LinkedIn.
- Mobile-friendly and fast.

```quiz
Q: What must your repo be called for your main GitHub Pages site? (for user "wanjiku")
A: wanjiku.github.io
Q: Can GitHub Pages run PHP? (yes/no)
A: no
Q: In which GitHub menu do you turn on Pages?
A: Settings | settings > pages | settings pages
```

**Learn more:** [GitHub Skills (free interactive courses)](https://skills.github.com/) · [Pro Git book (free)](https://git-scm.com/book/en/v2)
""")

lesson(g, "undo-and-rescue", "Undo mistakes safely", """
# Undo mistakes safely

| Situation | Command |
|---|---|
| Throw away changes to a file you haven't staged | `git restore file.html` |
| Unstage a file (keep the changes) | `git restore --staged file.html` |
| Fix the last commit message (not yet pushed) | `git commit --amend -m "Better message"` |
| Add a forgotten file to the last commit (not pushed) | `git add file` then `git commit --amend --no-edit` |
| Undo a commit that's already pushed | `git revert <commit-id>` (makes a new "undo" commit) |
| Go back to see an old version | `git switch --detach <commit-id>` then `git switch main` to return |
| Save unfinished work temporarily | `git stash` … later `git stash pop` |
| Find a lost commit | `git reflog` |

## Golden rules

- **Never rewrite history that others have pulled** (`--amend`, `rebase`, `reset --hard`, `push --force` on shared branches). Use `revert` instead.
- Commit small and often, so undoing is easy.
- Before risky changes, create a branch.

```quiz
Q: Which command safely undoes a commit that is already pushed?
A: git revert | revert
Q: Which command temporarily saves unfinished work?
A: git stash | stash
Q: Which command can find "lost" commits?
A: git reflog | reflog
```
""")

x = track("linux", "Linux command line", "none", "The terminal skills every developer, server admin and network engineer needs: files, permissions, processes, packages, SSH and scripts.")

lesson(x, "why-linux", "Why Linux and the terminal", """
# Why learn Linux?

Most **web servers**, cloud machines, routers, Android phones and supercomputers run **Linux**. When you host a website, manage a VPS, or work in networking or cybersecurity, you'll use the **terminal** (command line).

## Getting a Linux terminal

- **Windows**: install **WSL** (Windows Subsystem for Linux): open PowerShell as admin and run `wsl --install`, then open "Ubuntu".
- **macOS**: the Terminal app is very similar (it's Unix).
- **A real Linux PC**: install **Ubuntu** or **Linux Mint** on an old laptop; they make old machines fast again.
- **A cloud server (VPS)**: from a few dollars a month; you connect with SSH.
- **Online**: browser-based Linux playgrounds for practice.

## Anatomy of a command

```
ls -la /var/www
│   │   └── argument (what to act on)
│   └── options/flags (how)
└── command
```

The **prompt** looks like `kelvin@server:~$`: user @ computer : current folder, and `$` for a normal user (`#` for root).

## First commands

```
whoami        # your username
pwd           # print working directory (where am I?)
ls            # list files
date          # date and time
clear         # clear the screen
man ls        # the manual for ls (q to quit)
```

Tips: **Tab** completes names, **↑** repeats previous commands, **Ctrl+C** stops a running command.

```quiz
Q: Which command shows the folder you're currently in?
A: pwd
Q: Which key auto-completes file and folder names?
A: Tab
Q: Which keys stop a running command?
A: Ctrl+C | ctrl c | ctrl-c
Q: On Windows, what feature gives you a Linux terminal? (initials)
A: WSL
```
""")

lesson(x, "navigating-files", "Navigating and managing files", """
# Files and folders

## Moving around

| Command | Meaning |
|---|---|
| `cd /var/www` | Go to an absolute path (starts with `/`) |
| `cd projects` | Go into a folder inside the current one |
| `cd ..` | Up one level |
| `cd ~` or `cd` | Your home folder |
| `cd -` | Back to the previous folder |
| `ls -la` | List all files (including hidden `.files`) with details |

## Creating, copying, moving, deleting

```
mkdir -p site/css site/js      # make folders (-p: parents too)
touch index.html               # create an empty file
cp index.html about.html       # copy
cp -r site site-backup         # copy a folder (-r recursive)
mv about.html pages/           # move
mv old.txt new.txt             # rename
rm file.txt                    # delete a file (no recycle bin!)
rm -r old-folder               # delete a folder
```

> `rm -rf` deletes without asking. Double-check the path. There is no undo.

## Looking inside files

```
cat notes.txt          # print a whole file
less big.log           # scroll a big file (q to quit)
head -n 20 file        # first 20 lines
tail -n 50 error.log   # last 50 lines
tail -f access.log     # watch a log live
nano index.html        # simple editor (Ctrl+O save, Ctrl+X exit)
```

## Finding things

```
find /var/www -name "*.php"        # find files by name
grep -r "DB_PASSWORD" /var/www     # search inside files
grep -i "error" error.log | tail   # combine with a pipe
du -sh *                           # size of each item here
df -h                              # free disk space
```

The **pipe** `|` sends one command's output into the next. `>` writes output to a file (overwrite), `>>` appends.

```quiz
Q: Which command goes up one folder?
A: cd ..
Q: Which command creates a folder?
A: mkdir
Q: Which command shows the last lines of a file?
A: tail
Q: Which command searches for text inside files?
A: grep
Q: What is the symbol that sends one command's output into another command called?
A: pipe | the pipe | a pipe
Q: Which command shows free disk space in human-readable form?
A: df -h
```
""")

lesson(x, "permissions", "Users and permissions (chmod, chown)", """
# Permissions

Every file has an **owner**, a **group**, and permissions for three kinds of people: **owner (u)**, **group (g)**, **others (o)**. Each can have **read (r)**, **write (w)** and **execute (x)**.

`ls -l` shows them:

```
-rwxr-xr-- 1 kelvin www-data 1204 Sep 28 10:00 deploy.sh
│└┬┘└┬┘└┬┘   owner  group
│ │  │  └── others: r--  (read only)
│ │  └───── group:  r-x  (read, execute)
│ └──────── owner:  rwx  (everything)
└── - file, d directory, l link
```

## Numbers (octal)

r = **4**, w = **2**, x = **1**; add them for each group:

| Number | Permissions | Common use |
|---|---|---|
| **755** | rwx r-x r-x | Folders and scripts on web servers |
| **644** | rw- r-- r-- | Normal web files (HTML, PHP, images) |
| **600** | rw- --- --- | Private files: config with passwords, SSH keys |
| **700** | rwx --- --- | Private folders |
| **777** | rwx rwx rwx | **Never on a server**: anyone can change the file |

```
chmod 644 index.php
chmod 755 uploads/
chmod -R 755 public_html/     # -R: everything inside
chmod u+x deploy.sh           # add execute for the owner
chown kelvin:www-data file    # change owner and group
```

## Try the calculator

Tick boxes or type a number:

```tool-chmod
```

## sudo and root

**root** is the all-powerful admin user. Normal users run admin commands with **sudo**: `sudo apt update`. Use it only when needed.

```quiz
Q: What number means rw-r--r--?
A: 644
Q: What number means rwxr-xr-x?
A: 755
Q: What number should a private config file with passwords have (owner read/write only)?
A: 600
Q: Which permission number should never be used on a web server?
A: 777
Q: Which command changes a file's owner?
A: chown
Q: What is the value of "write" in permission numbers?
A: 2
```
""")

lesson(x, "processes-packages", "Processes, services and installing software", """
# Processes, services and packages

## Installing software (Ubuntu/Debian)

```
sudo apt update                 # refresh the list of available packages
sudo apt upgrade                # install updates
sudo apt install nginx php mysql-server
sudo apt remove package-name
```

Other systems: Fedora/RHEL use `dnf`, Alpine uses `apk`, Arch uses `pacman`.

## Processes

```
ps aux | grep php      # find running processes
top                    # live view (q to quit); htop is nicer if installed
kill 1234              # stop process with ID 1234
kill -9 1234           # force stop
free -h                # memory use
uptime                 # how long running + load
```

## Services (systemd)

Web servers, databases and SSH run as **services**:

```
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl enable nginx     # start automatically on boot
journalctl -u nginx --since "1 hour ago"   # logs
```

## Scheduled jobs (cron)

`crontab -e` opens your scheduled tasks. Format: minute hour day month weekday command.

```
0 2 * * *  /home/kelvin/backup.sh          # every day at 02:00
*/5 * * * * php /var/www/portal/cron.php   # every 5 minutes
```

```quiz
Q: Which command refreshes the list of packages on Ubuntu?
A: sudo apt update | apt update
Q: Which command restarts the nginx service?
A: sudo systemctl restart nginx | systemctl restart nginx
Q: In a crontab line, what does "0 2 * * *" mean? (time)
A: 2am | 02:00 | 2:00 | every day at 2am | daily at 02:00
Q: Which command shows memory use in human-readable form?
A: free -h
```
""")

lesson(x, "ssh-servers", "SSH and managing a server", """
# SSH: working on remote servers

**SSH** (Secure Shell) gives you an encrypted terminal on another computer, usually a web server or VPS.

```
ssh kelvin@203.0.113.10          # connect (port 22)
ssh -p 2222 kelvin@server.co.ke  # different port
exit                             # leave
```

## Use SSH keys, not passwords

```
ssh-keygen -t ed25519 -C "kelvin@laptop"   # make a key pair (once)
ssh-copy-id kelvin@203.0.113.10             # put your public key on the server
```

The **private key** (`~/.ssh/id_ed25519`) stays secret on your computer; the **public key** (`.pub`) goes on servers.

## Copying files

```
scp site.zip kelvin@203.0.113.10:/var/www/          # upload
scp kelvin@203.0.113.10:/var/log/nginx/error.log .  # download
rsync -avz ./site/ kelvin@203.0.113.10:/var/www/site/   # sync a folder efficiently
```

## Secure a new server (checklist)

1. `sudo apt update && sudo apt upgrade`
2. Create a normal user with sudo; log in with keys.
3. Disable root login and password login in `/etc/ssh/sshd_config` (`PermitRootLogin no`, `PasswordAuthentication no`), then `sudo systemctl restart ssh`.
4. Firewall: `sudo ufw allow OpenSSH`, `sudo ufw allow 'Nginx Full'`, `sudo ufw enable`.
5. Install **fail2ban** to block password guessers.
6. Turn on automatic security updates (`unattended-upgrades`).

```quiz
Q: Which port does SSH use by default?
A: 22
Q: Which command creates an SSH key pair?
A: ssh-keygen
Q: Which key stays secret on your computer: public or private?
A: private
Q: Which tool blocks IPs that keep guessing passwords?
A: fail2ban
```
""")

lesson(x, "bash-scripts", "Bash scripting basics", """
# Bash scripts

A **script** is a file of commands you can run again and again: backups, deployments, reports.

```
#!/bin/bash
# backup.sh: back up a website and its database
DATE=$(date +%F)
SITE=/var/www/site
DEST=/home/kelvin/backups

mkdir -p "$DEST"
tar -czf "$DEST/site-$DATE.tar.gz" "$SITE"
mysqldump -u backup -p"$DB_PASS" shopdb > "$DEST/db-$DATE.sql"

# keep only the last 14 days
find "$DEST" -type f -mtime +14 -delete
echo "Backup done: $DATE"
```

Run it:

```
chmod +x backup.sh
./backup.sh
```

## Building blocks

```
NAME="Kenya"                 # variable (no spaces around =)
echo "Hello $NAME"

if [ -f /etc/nginx/nginx.conf ]; then
  echo "nginx is installed"
else
  echo "nginx missing"
fi

for f in *.jpg; do
  echo "Found $f"
done

read -p "Your name: " USER_NAME     # ask for input
```

- `$1`, `$2`: arguments given to the script.
- `$?`: exit code of the last command (0 = success).
- `&&` runs the next command only if the first succeeded; `||` only if it failed.

```quiz
Q: What must the first line of a bash script be?
A: #!/bin/bash | #!/usr/bin/env bash
Q: Which command makes a script executable?
A: chmod +x | chmod +x backup.sh | chmod 755
Q: What exit code means success?
A: 0 | zero
Q: Which variable holds the first argument to a script?
A: $1
```

**Learn more:** [Linux Journey (free, beginner friendly)](https://linuxjourney.com/) · [The Linux Command Line (free book)](https://linuxcommand.org/tlcl.php) · [OverTheWire Bandit (practice game)](https://overthewire.org/wargames/bandit/)
""")
