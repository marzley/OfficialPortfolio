---
slug: permissions
title: "File permissions: reading rwx, chmod (symbolic and numeric), chown, umask and special permissions"
after: KEEP
---
# File permissions: reading rwx, chmod (symbolic and numeric), chown, umask and special permissions

Linux is a **multi-user** system: a server may run a web server, a database and several people's accounts at the same time. **Permissions** decide who can read, change or run each file. Wrong permissions are one of the most common causes of "403 Forbidden" website errors, "Permission denied" messages, and serious security holes (like a configuration file with database passwords readable by everyone).

:::note What you will learn
- Owners, groups and others
- Read, write and execute for files vs directories
- Reading permission strings like `-rwxr-xr--`
- chmod with symbols (u+x) and numbers (755, 644, 600)
- chown and chgrp to change ownership
- Safe permissions for websites and SSH keys
- umask: default permissions
- Special bits: setuid, setgid, sticky bit
- Troubleshooting "Permission denied"
:::

## Three kinds of users

Every file has:
- an **owner** (user, `u`): usually whoever created it
- a **group** (`g`): a set of users who share access
- **others** (`o`): everyone else

## Three permissions

| Permission | On a file | On a directory |
|---|---|---|
| **r** (read) | View contents | List the names inside (`ls`) |
| **w** (write) | Change contents | Create, delete and rename files inside |
| **x** (execute) | Run it as a program/script | Enter it (`cd`) and access files inside |

Note: deleting a file depends on **write permission on the folder**, not on the file itself.

## Reading permission strings

```bash
ls -l
```

```
-rwxr-xr-- 1 wanjiku developers 512 Sep 7 10:15 deploy.sh
```

```
-   rwx   r-x   r--
│    │     │     └── others: read only
│    │     └──────── group: read + execute
│    └────────────── owner: read + write + execute
└─────────────────── type (- file, d directory, l link)
```

So: wanjiku can do everything; members of `developers` can read and run it; everyone else can only read it.

## chmod with symbols

```bash
chmod u+x deploy.sh        # give the owner execute
chmod g+w notes.txt        # give the group write
chmod o-r secret.txt       # remove read from others
chmod a+r public.html      # a = all (u, g and o)
chmod u=rw,go=r page.html  # set exactly
chmod -R g+w shared/       # recursive
```

`+` adds, `-` removes, `=` sets exactly.

## chmod with numbers (octal)

Each permission has a value: **r = 4, w = 2, x = 1**. Add them for each of owner, group, others:

| Number | Permissions |
|---|---|
| 7 | rwx (4+2+1) |
| 6 | rw- (4+2) |
| 5 | r-x (4+1) |
| 4 | r-- |
| 0 | --- |

```bash
chmod 755 deploy.sh     # rwxr-xr-x: owner all, others read and run
chmod 644 index.html    # rw-r--r--: owner edits, everyone reads
chmod 600 ~/.ssh/id_ed25519   # rw-------: private key, owner only
chmod 700 ~/private     # rwx------: private folder
```

Common values:

| Value | Typical use |
|---|---|
| **644** | Normal files, web pages, images |
| **755** | Directories, scripts and programs |
| **600** | Private keys, files with passwords (`.env`, config with DB passwords) |
| **700** | Private directories (`~/.ssh`) |
| **777** | Everyone can do everything: **avoid**; it's a security risk |

You can calculate permissions in Python to check your understanding:

```try-python
def octal(perm):
    vals = {"r": 4, "w": 2, "x": 1, "-": 0}
    return "".join(str(sum(vals[c] for c in perm[i:i+3])) for i in (0, 3, 6))

for p in ["rwxr-xr-x", "rw-r--r--", "rw-------", "rwxrwxrwx"]:
    print(p, "=", octal(p))
```

## chown and chgrp: changing ownership

Usually needs `sudo`:

```bash
sudo chown wanjiku report.txt              # change owner
sudo chown wanjiku:developers report.txt   # owner and group
sudo chgrp developers report.txt           # group only
sudo chown -R www-data:www-data /var/www/site   # recursive
```

## Safe permissions for a website

On Ubuntu with Apache or Nginx, the web server runs as the user **www-data**. A typical safe setup:

```bash
sudo chown -R deploy:www-data /var/www/site        # you own it, web server's group
sudo find /var/www/site -type d -exec chmod 755 {} \;   # folders
sudo find /var/www/site -type f -exec chmod 644 {} \;   # files
sudo chmod 640 /var/www/site/config.php            # secrets: owner rw, group read, others nothing
sudo chmod -R 775 /var/www/site/uploads            # only where the app must write
```

:::warning Never "fix" errors with chmod 777
`chmod -R 777` makes files writable by every user and process on the server. If the site is hacked, attackers can change any file. Find out which user needs access and grant only that.
:::

## SSH key permissions

SSH refuses to use keys that others can read:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/id_ed25519.pub
```

## umask: default permissions

New files and folders get default permissions based on the **umask**:

```bash
umask        # often 0022 (or 0002)
```

With umask 022, new files get 644 and new folders get 755 (the umask "removes" write for group and others). Set a stricter default for your session with `umask 077` (files 600, folders 700).

## Special permissions

| Bit | Example | Effect |
|---|---|---|
| **setuid** (`s` in owner x) | `/usr/bin/passwd` (`-rwsr-xr-x`) | Program runs with the **owner's** privileges (lets users change their own password) |
| **setgid** on a directory | `chmod g+s shared/` | New files inherit the folder's group: great for team folders |
| **sticky bit** (`t`) | `/tmp` (`drwxrwxrwt`) | Everyone can create files, but only owners can delete their own |

Attackers look for unusual setuid programs, so security audits check them: `find / -perm -4000 -type f 2>/dev/null`.

## Troubleshooting "Permission denied"

1. Who am I? `whoami` and `id` (shows your groups).
2. Who owns it and what are the permissions? `ls -l file` and `ls -ld folder`.
3. Check **every folder in the path** needs `x` for you: `namei -l /var/www/site/index.html` shows them all.
4. Running a script? It needs `x` (`chmod +x script.sh`) or run it with `bash script.sh`.
5. Fix with the least access needed (add to a group, chown, or chmod a specific file), not 777.

:::think A website shows "403 Forbidden" for images in /var/www/site/images. `ls -l` shows the images as `-rw-------  deploy deploy`. What's wrong and how do you fix it?
Only the owner (deploy) can read the images; the web server (www-data) is "others" and has no read permission. Fix: `chmod 644` the image files (and make sure folders are 755), or set the group to www-data with group read.
:::

## Summary

- Every file has an owner, a group and others, each with read, write and execute.
- On directories, r lists, w creates/deletes inside, x lets you enter.
- chmod uses symbols (`u+x`, `go-w`) or numbers (r=4, w=2, x=1): 644 files, 755 folders/scripts, 600 secrets.
- chown/chgrp change ownership; web servers on Ubuntu run as www-data.
- Avoid 777; understand umask and special bits; troubleshoot with whoami, id, ls -l and namei -l.

```quiz
Q: What number represents rwx?
A: 7
Q: What chmod number gives rw-r--r--?
A: 644
Q: What permission number should a private SSH key have?
A: 600
Q: Which user does the web server run as on Ubuntu?
A: www-data
Q: Which command changes a file's owner?
A: chown
Q: On a directory, which permission lets you cd into it? (one letter)
A: x | execute
```
