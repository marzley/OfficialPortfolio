---
slug: users-groups-sudo
title: Users, groups and sudo
after: permissions
---
# Users, groups and sudo

Linux is a multi-user system: every file and process belongs to a **user**, and users belong to **groups**. Getting this right is what keeps a server secure: the web server shouldn't be able to read your private files, and a hacked website shouldn't be able to take over the whole machine.

## Who am I?

```bash
whoami            # your username
id                # your user id, group id and groups
groups            # the groups you're in
who               # who is logged in now
```

## The root user and sudo

**root** is the all-powerful administrator (user id 0). Working as root all the time is dangerous: one typo can delete the system. Instead, normal users run single commands as root with **sudo**:

```bash
sudo apt update
sudo systemctl restart nginx
sudo nano /etc/hosts
sudo -i            # a root shell (use sparingly, exit when done)
```

`sudo` asks for **your** password and logs every command, so admins can see who did what.

## Managing users

```bash
sudo adduser brian                 # create a user (asks for a password and details)
sudo passwd brian                  # set or change a password
sudo usermod -aG sudo brian        # let brian use sudo (Ubuntu/Debian; "wheel" on Red Hat)
sudo deluser brian                 # remove a user
sudo deluser --remove-home brian   # ...and their home folder
```

> In `usermod -aG`, the `-a` (append) matters. Without it, the user is **removed from all other groups**.

## Groups: sharing access

Groups let several users share files without making them public.

```bash
sudo groupadd webdev
sudo usermod -aG webdev amina
sudo usermod -aG webdev brian
sudo chown -R :webdev /var/www/shop       # the folder's group becomes webdev
sudo chmod -R 775 /var/www/shop           # group members can read and write
```

(Log out and back in for new group membership to take effect.)

## Ownership: chown

```bash
ls -l index.php
# -rw-r--r-- 1 amina webdev 2048 Sep 28 10:00 index.php
#               owner group

sudo chown brian index.php           # change owner
sudo chown brian:webdev index.php    # owner and group
sudo chown -R www-data:www-data /var/www/uploads   # the web server's user owns uploads
```

On Ubuntu the web server (Apache/Nginx with PHP) runs as the user **www-data**. It needs to **write** only to folders like `uploads/`, and just **read** everything else.

## Important files

| File | Holds |
|---|---|
| `/etc/passwd` | List of users (no passwords, despite the name) |
| `/etc/shadow` | Encrypted passwords (root only) |
| `/etc/group` | Groups and their members |
| `/etc/sudoers` | Who may use sudo (edit only with `sudo visudo`) |
| `/home/<user>` | Each user's personal folder |

## Security habits for servers

1. Create a normal user with sudo; **don't log in as root**.
2. Use **SSH keys** and disable password login and root login in `/etc/ssh/sshd_config`:
   ```
   PermitRootLogin no
   PasswordAuthentication no
   ```
3. Give each app its own user with only the access it needs (**least privilege**).
4. Remove accounts for people who leave.
5. Check `sudo last` and `/var/log/auth.log` for strange logins.

```quiz
Q: Which command runs a single command as the administrator?
A: sudo
Q: What is the Linux administrator account called?
A: root
Q: Which command adds a user to a group without removing other groups? (write the options)
A: usermod -aG | sudo usermod -aG | -aG
Q: Which user does the web server run as on Ubuntu?
A: www-data
Q: Which command changes a file's owner?
A: chown
```
