---
slug: navigating-files
title: "Navigating and managing files: the Linux file system, paths, ls, cd, mkdir, cp, mv, rm, find and wildcards"
after: KEEP
---
# Navigating and managing files: the Linux file system, paths, ls, cd, mkdir, cp, mv, rm, find and wildcards

Everything on a Linux system lives in one big tree of folders (called **directories**), starting at `/`. Before you can manage a web server, edit configs or write scripts, you need to move around this tree confidently and create, copy, move and delete files without a mouse. This unit covers the file system layout and every essential file command, with the mistakes to avoid.

:::note What you will learn
- The Linux directory tree and what each main folder is for
- Absolute vs relative paths, `~`, `.` and `..`
- Listing files with `ls` and reading the output
- Moving around with `cd`
- Creating files and folders
- Copying, moving, renaming and deleting
- Wildcards (globbing) for many files at once
- Finding files with `find` and `locate`
- Hidden files, file types and links
:::

## The directory tree

```
/
├── bin, usr/bin   programs (ls, cp, python3...)
├── etc            system configuration files (nginx, ssh, users)
├── home           users' personal folders (/home/wanjiku)
├── root           the root user's home
├── var            changing data: logs (/var/log), websites (/var/www), databases
├── tmp            temporary files (cleared on reboot)
├── opt            optional/third-party software
├── dev            devices (disks, terminals)
├── proc, sys      live kernel and process information
├── mnt, media     mounted drives and USB sticks
└── boot           the kernel and boot loader
```

Unlike Windows, there are no drive letters (C:, D:). Extra disks and USB drives are **mounted** into the tree, e.g. `/media/wanjiku/USB`.

## Paths

| Path type | Example | Meaning |
|---|---|---|
| **Absolute** | `/home/wanjiku/projects/site` | Starts from `/`; works from anywhere |
| **Relative** | `projects/site` | Starts from where you are now |
| `~` | `~/projects` | Your home folder (`/home/wanjiku`) |
| `.` | `./script.sh` | The current folder |
| `..` | `../images` | The parent folder (one level up) |

## Listing: ls

```bash
ls                 # names in the current folder
ls -l              # long format: permissions, owner, size, date
ls -a              # include hidden files (names starting with .)
ls -lh             # human-readable sizes (K, M, G)
ls -lt             # newest first
ls -R              # include sub-folders
ls /var/log        # list another folder
```

Reading `ls -l`:

```
-rw-r--r-- 1 wanjiku wanjiku 2048 Sep  7 10:15 index.html
drwxr-xr-x 2 wanjiku wanjiku 4096 Sep  7 10:16 images
```

| Part | Meaning |
|---|---|
| `-` / `d` / `l` | Regular file / directory / symbolic link |
| `rw-r--r--` | Permissions (owner, group, others): next lessons |
| `wanjiku wanjiku` | Owner and group |
| `2048` | Size in bytes |
| `Sep 7 10:15` | Last modified |

## Moving around: cd

```bash
cd /var/log        # absolute path
cd projects        # relative path
cd ..              # up one level
cd ../..           # up two levels
cd ~  (or just cd) # home
cd -               # back to the previous folder
```

Use **Tab** to complete folder names. Names with spaces need quotes or a backslash: `cd "My Documents"` or `cd My\ Documents`. Better yet, avoid spaces in names; use `my-documents`.

## Creating files and folders

```bash
mkdir website                       # one folder
mkdir -p website/css website/js     # -p creates parents and doesn't complain if they exist
touch website/index.html            # create an empty file (or update its timestamp)
echo "Hello" > notes.txt            # create a file with content
```

## Copying: cp

```bash
cp index.html index-backup.html         # copy a file
cp index.html website/                  # copy into a folder
cp -r website website-backup            # copy a folder (-r = recursive)
cp -i a.txt b.txt                       # ask before overwriting
cp -v *.jpg images/                     # verbose: show each file copied
```

## Moving and renaming: mv

```bash
mv old-name.html new-name.html          # rename
mv report.pdf ~/Documents/              # move
mv *.png images/                        # move many files
mv -i a.txt folder/                     # ask before overwriting
```

There's no separate rename command for single files: renaming is moving to a new name.

## Deleting: rm and rmdir

```bash
rm file.txt              # delete a file
rm -i *.log              # ask for each file
rmdir empty-folder       # delete an empty folder
rm -r old-site           # delete a folder and everything inside
```

:::warning There is no Recycle Bin in the terminal
`rm` deletes permanently. Be especially careful with `rm -rf` (recursive, force): a typo like `rm -rf / tmp/x` (note the space) would try to delete the entire system. Run `ls` with the same pattern first to see what will be deleted, and never run `rm -rf` with `sudo` unless you're certain.
:::

## Wildcards (globbing)

| Pattern | Matches |
|---|---|
| `*` | Any characters: `*.jpg` = all JPG files |
| `?` | Exactly one character: `file?.txt` = file1.txt, fileA.txt |
| `[abc]` | One of these: `[0-9]*.csv` starts with a digit |
| `{a,b}` | Each alternative (brace expansion): `mkdir {css,js,img}` |

```bash
ls *.html
cp report-2026-0?.pdf archive/
mkdir -p project/{src,docs,tests}
rm -i *.tmp
```

## Finding files

```bash
find ~ -name "*.pdf"                       # by name under home
find /var/www -type f -name "*.php"        # files only
find . -type d -name "node_modules"        # folders
find /var/log -mtime -1                    # modified in the last day
find . -size +100M                         # larger than 100 MB
find . -name "*.tmp" -delete               # find and delete (check without -delete first!)
```

`locate` is faster (it searches a database updated daily): `sudo apt install plocate`, then `locate nginx.conf`.

## Hidden files, types and links

- Files starting with `.` are hidden: `.bashrc` (shell settings), `.ssh/` (keys), `.git/`, `.env`.
- `file photo.jpg` tells you what a file really is, regardless of its extension.
- A **symbolic link** is a shortcut: `ln -s /var/www/site/current ~/site` creates `~/site` pointing to the real folder.

## Disk usage quick checks

```bash
du -sh website/          # size of a folder
du -sh * | sort -h       # sizes of everything here, smallest to largest
df -h                    # free space on each disk
```

## Practice task

1. In your home folder, create `practice/{docs,images,backup}` in one command.
2. Create `docs/notes.txt` and `docs/todo.txt`.
3. Copy all `.txt` files to `backup/`.
4. Rename `docs/todo.txt` to `docs/tasks.txt`.
5. Use `find` to list every `.txt` file under `practice`.
6. Delete the `backup` folder (check with `ls` first).

:::think You're in /home/wanjiku/projects/site/css. Write two different commands to go to /home/wanjiku/projects/site/images.
Relative: `cd ../images`. Absolute: `cd /home/wanjiku/projects/site/images` (or `cd ~/projects/site/images`).
:::

## Summary

- Linux has one directory tree from `/`: `/etc` configs, `/home` users, `/var/log` logs, `/var/www` websites.
- Absolute paths start with `/`; relative paths start from the current folder; `~`, `.`, `..` are shortcuts.
- `ls -lah`, `cd`, `mkdir -p`, `touch`, `cp -r`, `mv`, `rm -r` manage files; `rm` is permanent.
- Wildcards (`*`, `?`, `[ ]`, `{ }`) act on many files; preview with `ls` first.
- `find` searches by name, type, size and age; `du` and `df` check space.

```quiz
Q: Which folder holds most system configuration files?
A: /etc | etc
Q: Which symbol means the parent folder?
A: .. 
Q: Which option makes cp copy a whole folder?
A: -r | -R | -a
Q: Which mkdir option creates parent folders as needed?
A: -p
Q: Which wildcard matches exactly one character?
A: ?
Q: Does rm move files to a Recycle Bin? (yes/no)
A: no
```
