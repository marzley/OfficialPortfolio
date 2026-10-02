---
slug: first-repo
title: "Your first repository: init, status, add, commit, log and diff step by step"
after: KEEP
---
# Your first repository: init, status, add, commit, log and diff step by step

In this unit you'll create a real Git repository on your own computer and practise the core loop you'll repeat thousands of times in your career: **edit → status → add → commit**. You'll also learn to read the history and see exactly what changed. Follow along in a terminal: **Git Bash** on Windows, **Terminal** on macOS or Linux.

:::note What you will learn
- Creating a project folder and turning it into a repository (`git init`)
- Checking what's happening with `git status`
- Staging with `git add` (single files, everything, parts of files)
- Committing with good messages
- Reading history with `git log`
- Seeing changes with `git diff`
- Renaming and removing tracked files
- What's inside the `.git` folder
:::

## Step 1: Create a project folder

```bash
cd ~                    # go to your home folder
mkdir my-website        # make a folder
cd my-website           # enter it
```

On Windows, Git Bash understands these Linux-style commands. You can also create the folder in File Explorer, then right-click → "Open Git Bash here".

## Step 2: Initialise the repository

```bash
git init
```

Output: `Initialized empty Git repository in /home/you/my-website/.git/`

Git created a hidden `.git` folder that stores all history. **Never delete or edit it by hand**: deleting `.git` deletes the whole history (your files stay, but they're no longer tracked).

## Step 3: Create a file and check status

Create `index.html` in your editor (VS Code: `code .` opens the folder) with:

```html
<!DOCTYPE html>
<html>
  <head><title>My website</title></head>
  <body><h1>Hello, I'm Wanjiku</h1></body>
</html>
```

Then:

```bash
git status
```

```
On branch main
No commits yet
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html
```

**Untracked** means Git sees the file but isn't recording it yet. Run `git status` constantly: it always tells you what state you're in and suggests next commands.

## Step 4: Stage the file

```bash
git add index.html
git status
```

```
Changes to be committed:
        new file:   index.html
```

Ways to stage:

| Command | Stages |
|---|---|
| `git add index.html` | One file |
| `git add css/` | A folder |
| `git add .` | Everything changed in the current folder and below |
| `git add -p` | Pick individual chunks of changes interactively |

To unstage (keep the change, just remove it from the next commit): `git restore --staged index.html`.

## Step 5: Commit

```bash
git commit -m "Add home page with heading"
```

```
[main (root-commit) 3f2a1bc] Add home page with heading
 1 file changed, 5 insertions(+)
 create mode 100644 index.html
```

`3f2a1bc` is the short **hash**, the commit's unique ID.

### Writing good commit messages

- Use the imperative mood, like a command: "Add contact form", "Fix broken menu link", "Update prices".
- Keep the first line under about 50–72 characters.
- Say **what and why**, not "changes" or "stuff".
- For bigger commits, run `git commit` without `-m` to open an editor and write a summary line, a blank line, then details.

| Bad | Good |
|---|---|
| `update` | `Update services page with 2026 prices` |
| `fix` | `Fix mobile menu not closing on tap` |
| `asdf` | `Add M-Pesa payment instructions to checkout` |

## Step 6: Make more changes

Edit `index.html` to add a paragraph, and create `style.css`. Then:

```bash
git status
```

```
Changes not staged for commit:
        modified:   index.html
Untracked files:
        style.css
```

### See exactly what changed

```bash
git diff                # changes not yet staged
git diff --staged       # changes staged for the next commit
```

Lines starting with `-` were removed; `+` were added. Then:

```bash
git add index.html style.css
git commit -m "Add intro paragraph and basic styles"
```

## Step 7: Read the history

```bash
git log
```

```
commit 9c8d7e6... (HEAD -> main)
Author: Wanjiku Kamau <wanjiku@example.com>
Date:   Mon Sep 7 10:15:02 2026 +0300

    Add intro paragraph and basic styles

commit 3f2a1bc...
    Add home page with heading
```

Useful variations:

```bash
git log --oneline                 # one line per commit
git log --oneline --graph --all   # a drawing of branches
git log -p index.html             # full changes to one file
git log --author="Wanjiku"        # commits by one person
git show 3f2a1bc                  # details of one commit
```

Press `q` to leave the log viewer.

## The cycle

```
edit files → git status → git diff → git add → git commit → (repeat)
```

Commit **small and often**: each commit should be one logical change. Small commits are easier to understand, review and undo.

## Renaming and deleting tracked files

```bash
git mv style.css styles.css      # rename and stage the rename
git rm old-page.html             # delete and stage the deletion
git commit -m "Rename stylesheet and remove old page"
```

If you rename or delete in your file explorer instead, `git add -A` stages those changes too.

## What's inside .git?

```bash
ls .git
```

You'll see `HEAD` (which branch you're on), `config` (repo settings), `objects/` (compressed snapshots), `refs/` (branch pointers). You don't need to touch these, but knowing they exist explains how Git works: branches are just tiny files pointing to commits.

## Practice task

1. Create a folder `recipes`, run `git init`.
2. Add `ugali.md` with ingredients; commit "Add ugali recipe".
3. Add `chapati.md`; commit "Add chapati recipe".
4. Edit `ugali.md` to add steps; view `git diff`; commit "Add ugali cooking steps".
5. Run `git log --oneline`: you should see 3 commits.

:::think You edited three files: fixed a bug in `login.js`, changed colours in `style.css`, and fixed a typo in `README.md`. How should you commit them?
Ideally as separate commits, each one logical change: `git add login.js` → "Fix login failing with spaces in email", then `git add style.css` → "Update brand colours", then `git add README.md` → "Fix typo in README". Small, focused commits are easier to review and revert.
:::

## Summary

- `git init` turns a folder into a repository (history lives in `.git`).
- `git status` shows untracked, modified and staged files; use it constantly.
- `git add` stages changes; `git commit -m "message"` saves a snapshot.
- `git diff` shows unstaged changes; `git diff --staged` shows staged ones.
- `git log --oneline` and `git show` explore history; commit small, often, with clear imperative messages.

```quiz
Q: Which command turns a folder into a Git repository? (two words)
A: git init
Q: Which command shows which files are modified, staged or untracked? (two words)
A: git status
Q: Which command shows commits one per line? (three words, including git)
A: git log --oneline
Q: Which command shows changes that are staged for the next commit? (three words)
A: git diff --staged | git diff --cached
Q: What is the name of the hidden folder where Git stores history?
A: .git | git
Q: Is "Fix mobile menu not closing on tap" a better commit message than "fix"? (yes/no)
A: yes
```
