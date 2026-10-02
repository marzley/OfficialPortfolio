---
slug: what-is-git
title: "What is Git and why use it? Version control explained from zero, with real-world examples"
after: KEEP
---
# What is Git and why use it? Version control explained from zero, with real-world examples

Have you ever saved files like `CV_final.docx`, `CV_final2.docx`, `CV_final_REALLY_final.docx`? That's version control done by hand, and it gets messy fast. Now imagine 50 developers editing the same website at the same time. **Git** solves this. It's a **version control system**: it records every change to a project, who made it, when and why, so you can go back in time, compare versions and work in teams without overwriting each other's work.

Git is used by almost every software team in the world, from Safaricom and banks to startups, freelancers and open-source projects like Linux and Python itself. Knowing Git is expected in practically every developer job.

:::note What you will learn
- The problem version control solves
- What Git is, and how it's different from GitHub
- Who uses Git and where
- How Git thinks: snapshots, commits, the three areas
- Key vocabulary every developer uses
- Installing Git and setting your identity
- Git's place in a developer's daily workflow
:::

## The problem: life without version control

| Problem | What happens |
|---|---|
| "Which version is the latest?" | Files named final, final2, final-new... |
| "It worked yesterday!" | No way to see what changed or go back |
| "Who changed this?" | No record of who did what or why |
| Teamwork | Emailing ZIP files; one person's changes overwrite another's |
| Lost laptop | Code lost forever if there's no backup |
| Experiments | Afraid to try new ideas in case you break the working version |

## What Git does

- **History**: every saved snapshot (a **commit**) is kept forever with a message, author and date.
- **Undo**: return any file, or the whole project, to any earlier commit.
- **Branches**: work on a new feature in a separate line without touching the stable version.
- **Merging**: combine work from different people or branches automatically.
- **Distributed**: every developer has the full history on their own computer, so you can work offline and there's no single point of failure.

Git was created in 2005 by **Linus Torvalds**, the creator of Linux, to manage the Linux kernel's thousands of contributors.

## Git vs GitHub

| Git | GitHub (and GitLab, Bitbucket) |
|---|---|
| A program on your computer | A website that hosts Git repositories online |
| Tracks versions locally | Backup, sharing, collaboration |
| Works offline | Adds pull requests, issues, code review, Actions (automation), Pages (free websites) |
| Free and open source | Free plans plus paid features |

You can use Git without GitHub, but GitHub (or GitLab/Bitbucket) is where teams collaborate and where employers look at your work.

## Who uses Git, and for what?

| Who | Uses |
|---|---|
| Web and app developers | Every line of code, every feature, every bug fix |
| Data scientists and analysts | Notebooks, scripts, SQL queries |
| DevOps and system admins | Server configuration, infrastructure-as-code, scripts |
| Technical writers | Documentation sites written in Markdown |
| Designers | Design tokens, website themes |
| Students | Assignments, portfolio projects, group projects |
| Open-source communities | Thousands of volunteers on one project |

Even this learning hub's lessons are stored in Git.

## How Git thinks

### Snapshots, not differences

Each commit is a snapshot of your whole project at that moment (Git stores it efficiently by reusing unchanged files). The history is a chain of snapshots:

```
A ---- B ---- C ---- D   (main)
"Start" "Add header" "Add contact form" "Fix typo"
```

### The three areas

```
Working directory  --git add-->  Staging area  --git commit-->  Repository (history)
(your files)                     (what goes into                (saved snapshots)
                                  the next commit)
```

1. **Working directory**: the files you edit.
2. **Staging area (index)**: you choose which changes go into the next snapshot.
3. **Repository**: the `.git` folder holding all commits.

The staging area lets you commit related changes together ("Fix login bug") even if you also edited other files that belong in a different commit.

## Key vocabulary

| Word | Meaning |
|---|---|
| **Repository (repo)** | A project folder tracked by Git |
| **Commit** | A saved snapshot with a message, e.g. "Add contact form" |
| **Hash** | The unique ID of a commit, e.g. `a1b2c3d` |
| **Branch** | An independent line of work (`main`, `feature/login`) |
| **HEAD** | Where you are now: usually the latest commit of your current branch |
| **Merge** | Combine one branch into another |
| **Conflict** | Two changes to the same lines that Git can't combine automatically |
| **Remote** | A copy of the repo elsewhere, usually on GitHub (named `origin`) |
| **Clone** | Download a full copy of a remote repo |
| **Push / Pull** | Send your commits to the remote / get others' commits |
| **Fork** | Your own copy of someone else's GitHub repo |
| **Pull request (PR)** | A request to merge your branch, with discussion and review |

## Install Git and set your identity

1. **Windows**: download from git-scm.com and keep the default options (this also installs Git Bash).
   **macOS**: run `xcode-select --install` or install via Homebrew.
   **Ubuntu/Debian Linux**: `sudo apt install git`.
2. Check it works:

```bash
git --version
```

3. Tell Git who you are (once per computer). This name and email appear on every commit:

```bash
git config --global user.name "Wanjiku Kamau"
git config --global user.email "wanjiku@example.com"
git config --global init.defaultBranch main
git config --list
```

4. Create a free account at github.com using the same email. The next lesson covers installation options in more depth.

## A developer's day with Git

```bash
git pull                      # get teammates' latest work
git switch -c feature/mpesa   # start a new branch for today's task
# ... edit files ...
git status                    # what changed?
git add .                     # stage changes
git commit -m "Add M-Pesa STK push button"
git push -u origin feature/mpesa
# open a pull request on GitHub, a teammate reviews, then it's merged
```

You'll learn every one of these commands in this subject.

:::think Two classmates are building a group project website. Without Git they email files back and forth. List three problems Git and GitHub would solve for them.
1) Overwriting each other's work: Git merges changes and flags conflicts. 2) No history: every commit shows who changed what, and they can roll back. 3) Backup and sharing: GitHub keeps the code online, and each can push/pull; they could also use branches and pull requests to review work before it goes live.
:::

## Summary

- Git is a distributed version control system that records snapshots (commits) of a project.
- GitHub hosts Git repositories online and adds collaboration features.
- Git is used by developers, data people, DevOps, writers and students everywhere.
- Changes move from the working directory → staging area (`git add`) → repository (`git commit`).
- Set your name and email once with `git config --global`.

```quiz
Q: What is a saved snapshot of your project in Git called?
A: commit | a commit
Q: Is GitHub the same thing as Git? (yes/no)
A: no
Q: Who created Git? (full name)
A: Linus Torvalds
Q: Which command moves changes into the staging area? (two words)
A: git add
Q: What is the usual name for the remote on GitHub?
A: origin
Q: What do you call your own copy of someone else's GitHub repository?
A: fork | a fork
```
