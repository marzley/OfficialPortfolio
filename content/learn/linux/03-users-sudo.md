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

## Why users and permissions matter

Linux was designed for many users sharing one computer, and servers still work that way: the web server, the database, developers and backup scripts each run as different users with only the access they need. Correct users, groups and permissions stop a hacked website from reading other sites' files, prevent junior staff from accidentally deleting system files, and keep secrets like database passwords private. Misconfigured permissions (like `chmod 777`) are one of the most common causes of hacked WordPress and PHP sites.

## Reading permissions

```
-rw-r--r-- 1 amina webdev 2048 Sep 28 10:00 index.php
│└┬┘└┬┘└┬┘   owner group
│ │  │  └── others: r-- (read only)
│ │  └───── group:  r-- (read only)
│ └──────── owner:  rw- (read, write)
└────────── type: - file, d directory, l link
```

| Letter | On a file | On a directory |
|---|---|---|
| `r` (4) | Read contents | List files |
| `w` (2) | Change contents | Create/delete files inside |
| `x` (1) | Run as a program | Enter the directory (`cd`) |

## chmod with numbers and letters

```bash
chmod 644 index.php        # rw-r--r--  normal files: owner edits, others read
chmod 755 deploy.sh        # rwxr-xr-x  scripts and directories
chmod 600 .env             # rw-------  secrets: only the owner
chmod 700 ~/.ssh           # rwx------  private SSH folder
chmod u+x script.sh        # add execute for the owner
chmod g+w shared.txt       # add write for the group
chmod o-r secret.txt       # remove read for others
chmod -R 755 /var/www/site # recursive (careful!)
```

Common safe settings for websites: directories **755**, files **644**, config files with passwords **600** or **640**. Avoid **777** (everyone can write), which lets any compromised process change your files.

## Setting web permissions correctly

```bash
sudo chown -R deploy:www-data /var/www/shop          # owner: deploy user; group: web server
sudo find /var/www/shop -type d -exec chmod 755 {} \;
sudo find /var/www/shop -type f -exec chmod 644 {} \;
sudo chmod -R 775 /var/www/shop/storage /var/www/shop/uploads   # only folders the app must write to
sudo chmod 640 /var/www/shop/.env                    # readable by the owner and web server group only
```

This gives the web server write access only where needed (uploads, cache), not to the code itself.

## sudo best practices

```bash
sudo -l                        # what am I allowed to run with sudo?
sudo -i                        # root shell (use sparingly; exit when done)
sudo visudo                    # safely edit sudo rules (checks syntax before saving)
sudo journalctl _COMM=sudo     # who used sudo, and when (on systemd systems)
```

- Don't log in as root directly over SSH; use a normal user with sudo.
- Give sudo only to people who need it, and remove it when they leave.
- `visudo` prevents syntax errors that could lock everyone out of sudo.

## Creating a deployment user (a real server task)

```bash
sudo adduser deploy                       # create the user (asks for a password)
sudo usermod -aG sudo deploy              # allow sudo (Ubuntu); use "wheel" on some other distributions
sudo usermod -aG www-data deploy          # share the web server group
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/   # allow your SSH key
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh && sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Then test `ssh deploy@server` in a new terminal **before** closing your current session.

## Locking down SSH

In `/etc/ssh/sshd_config` (back it up first):

```
PermitRootLogin no
PasswordAuthentication no        # keys only (make sure your key login works first!)
```

```bash
sudo sshd -t && sudo systemctl reload ssh     # test config, then reload (service may be named sshd)
```

Combined with a firewall (`ufw allow OpenSSH`) and Fail2ban, this blocks most automated attacks.

## Special permissions (good to recognise)

| Permission | Shown as | Meaning |
|---|---|---|
| setuid | `rws` in owner | Program runs with the file owner's rights (e.g. `passwd`) |
| setgid on a directory | `rws` in group | New files inherit the directory's group: great for shared team folders |
| sticky bit | `rwt` in others | Only the file's owner can delete it (used on `/tmp`) |

```bash
sudo chmod g+s /srv/shared      # new files in the shared folder belong to its group
```

## Managing and auditing users

```bash
id amina                         # user ID and groups
groups amina
sudo passwd -l olduser           # lock a password
sudo usermod -L olduser          # lock the account
sudo deluser --remove-home olduser   # delete user and home folder (Debian/Ubuntu)
last                             # recent logins
lastlog                          # last login per user
w                                # who is logged in now and what they're doing
sudo cat /var/log/auth.log | tail    # login attempts (Ubuntu/Debian)
```

When a staff member leaves, lock or remove their account, remove their SSH keys, and rotate any shared passwords they knew.

## umask: default permissions

`umask` controls the permissions new files get. A common default of `022` gives new files 644 and new directories 755. Setting `umask 027` makes new files unreadable by "others", useful on shared servers.

## Practice

1. Create a file, then set it to 600, 644 and 755 in turn, checking with `ls -l`.
2. Create a user `trainee`, add them to a group `webdev`, and check with `id trainee`.
3. Create a shared folder owned by group `webdev` with setgid, and test that new files get the group.
4. Set correct permissions on a practice website folder (755 directories, 644 files).
5. Read `/var/log/auth.log` (or `journalctl -u ssh`) and identify failed login attempts.

:::think A tutorial says "if uploads don't work, just run chmod -R 777 /var/www". Why is this dangerous, and what's better?
777 lets every user and process write to every file, so if any part of the site is compromised, attackers can modify code, plant malware or deface the site. Instead, give the web server group write access only to the specific upload or cache folders (e.g. 775 with the correct group), keep code files 644 and directories 755, and keep secrets 600/640.
:::

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
Q: What numeric permission should a .env file with passwords usually have?
A: 600 | 640
Q: Which command safely edits sudo rules with a syntax check?
A: visudo | sudo visudo
Q: Which SSH setting stops direct root logins? (two words)
A: PermitRootLogin no | PermitRootLogin
Q: Which special permission on a directory makes new files inherit its group?
A: setgid | g+s
```
