---
slug: ssh-servers
title: "SSH and managing a server: connecting, keys, copying files, config, hardening and firewalls"
after: KEEP
---
# SSH and managing a server: connecting, keys, copying files, config, hardening and firewalls

**SSH (Secure Shell)** lets you control a remote computer securely over the internet, as if you were typing on its keyboard. It's how developers deploy websites, how administrators manage cloud servers, and how network engineers reach Linux devices. Everything you type is encrypted, so passwords and data can't be read by anyone in between, even on public Wi-Fi.

This unit takes you from your first connection to a properly secured server.

:::note What you will learn
- How SSH works (client, server, port 22, encryption)
- Connecting with a password and with keys
- Generating keys and copying them to a server
- The SSH config file for shortcuts
- Copying files: scp, rsync and SFTP
- Running remote commands and tunnels
- Hardening a new server: users, sudo, disable root and password logins
- Firewalls with UFW and protecting SSH with Fail2ban
- A first-day checklist for a new VPS
:::

## How SSH works

- The **SSH server** (`sshd`) runs on the remote machine, listening on **port 22** by default.
- The **SSH client** (`ssh`) runs on your computer: built into Linux, macOS and Windows 10/11 (PowerShell or Windows Terminal). PuTTY and MobaXterm are graphical alternatives on Windows.
- When you first connect, the server shows its **host key fingerprint**. Accepting it stores it in `~/.ssh/known_hosts`; if it changes later, SSH warns you (possible impersonation, or the server was rebuilt).

## Connecting

```bash
ssh username@server-ip
ssh deploy@203.0.113.10
ssh -p 2222 deploy@203.0.113.10     # a non-standard port
exit                                 # disconnect (or Ctrl+D)
```

Cloud providers give you an IP address and either a password or a key at creation.

## SSH keys: better than passwords

A **key pair** has a **private key** (stays on your computer, secret) and a **public key** (copied to servers). Keys are far stronger than passwords and can't be guessed by bots.

```bash
ssh-keygen -t ed25519 -C "wanjiku laptop"
# saves ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public)
# set a passphrase to protect the private key if the laptop is stolen
```

Copy the public key to the server:

```bash
ssh-copy-id deploy@203.0.113.10
```

This appends your public key to `~/.ssh/authorized_keys` on the server. Without `ssh-copy-id` (e.g. on Windows), paste the contents of `id_ed25519.pub` into that file manually and set permissions (`chmod 700 ~/.ssh`, `chmod 600 ~/.ssh/authorized_keys`).

Use `ssh-agent` so you type the passphrase once per session: `eval "$(ssh-agent -s)"` then `ssh-add`.

## The SSH config file

Create `~/.ssh/config` on your computer:

```
Host shop
    HostName 203.0.113.10
    User deploy
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host school-portal
    HostName portal.example.co.ke
    User admin
```

Now just type `ssh shop`. The aliases work with scp, rsync and Git too.

## Copying files

```bash
scp index.html shop:/var/www/site/                 # upload a file
scp shop:/var/log/nginx/error.log .                # download
scp -r website/ shop:/var/www/                     # a folder

rsync -avz website/ shop:/var/www/site/            # sync only changes (fast, resumable)
rsync -avz --delete website/ shop:/var/www/site/   # also delete files removed locally (careful)
rsync -avzn website/ shop:/var/www/site/           # -n: dry run, show what would happen
```

`rsync` is the professional choice for deployments and backups. **SFTP** (in FileZilla or WinSCP) gives a drag-and-drop view over the same SSH connection.

## Remote commands and tunnels

```bash
ssh shop "df -h && uptime"                     # run a command and return
ssh -L 8080:localhost:3306 shop                # local port 8080 -> server's MySQL (3306) securely
```

Tunnels let you reach services (like a database admin tool) that aren't exposed to the internet.

## Hardening a new server

Bots try to log in to every public server within minutes of it going online. Do this on day one:

### 1. Update and create a normal user

```bash
ssh root@203.0.113.10
apt update && apt upgrade -y
adduser deploy
usermod -aG sudo deploy          # allow admin commands with sudo
```

### 2. Add your key for the new user

From your computer: `ssh-copy-id deploy@203.0.113.10`, then test `ssh deploy@203.0.113.10` **in a new terminal** before going further.

### 3. Disable root login and passwords

Edit the SSH server configuration:

```bash
sudo nano /etc/ssh/sshd_config
```

Set:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Check and apply:

```bash
sudo sshd -t                     # test the config for errors
sudo systemctl restart ssh       # the service is "ssh" on Ubuntu ("sshd" on some distros)
```

:::warning Don't lock yourself out
Keep your current session open while you test logging in from a **second** terminal. If key login fails, fix it from the open session. Many cloud providers also offer a web console for emergencies.
:::

### 4. Firewall with UFW

```bash
sudo ufw allow OpenSSH           # allow SSH BEFORE enabling!
sudo ufw allow 80/tcp            # HTTP
sudo ufw allow 443/tcp           # HTTPS
sudo ufw enable
sudo ufw status verbose
```

Only open the ports you need. Databases (3306 MySQL, 5432 PostgreSQL) should normally **not** be open to the internet.

### 5. Fail2ban

```bash
sudo apt install fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

Fail2ban watches logs and temporarily bans IP addresses with repeated failed logins.

### 6. Automatic security updates

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## Checking who's logged in and login attempts

```bash
who                          # who's logged in now
last                         # recent logins
sudo journalctl -u ssh --since today      # SSH service logs
sudo grep "Failed password" /var/log/auth.log | tail
```

## First-day VPS checklist

1. Update packages.
2. Create a sudo user; add your SSH key.
3. Disable root login and password authentication.
4. Enable UFW (SSH, 80, 443 only).
5. Install Fail2ban and unattended-upgrades.
6. Set the timezone: `sudo timedatectl set-timezone Africa/Nairobi`.
7. Set up backups (provider snapshots + off-server copies).
8. Install your stack (Nginx/Apache, PHP, database) and configure HTTPS (the hosting subject covers this).

:::think You disabled password login, restarted SSH, closed your only session, and now `ssh deploy@server` says "Permission denied (publickey)". What probably went wrong, and how do you recover?
Your public key wasn't correctly in `/home/deploy/.ssh/authorized_keys` (or the permissions on `.ssh` were wrong). Recover through the cloud provider's web/recovery console, fix the key file and permissions (700/600, owned by deploy), then test from a second terminal before closing the console.
:::

## Summary

- SSH gives encrypted remote access on port 22; the client is built into Linux, macOS and Windows.
- Use key pairs: `ssh-keygen -t ed25519`, `ssh-copy-id`; keep the private key secret with a passphrase.
- `~/.ssh/config` creates shortcuts; scp, rsync and SFTP copy files; tunnels reach private services.
- Harden servers: sudo user, keys only, `PermitRootLogin no`, `PasswordAuthentication no`, UFW, Fail2ban, automatic updates.
- Test new SSH settings from a second session before closing the first.

```quiz
Q: What is the default SSH port number?
A: 22
Q: Which command creates an SSH key pair?
A: ssh-keygen
Q: Which command copies your public key to a server?
A: ssh-copy-id
Q: Which file on the server lists public keys allowed to log in?
A: authorized_keys | ~/.ssh/authorized_keys
Q: Which sshd_config setting stops root from logging in? (three words)
A: PermitRootLogin no
Q: Which tool bans IP addresses after repeated failed logins?
A: Fail2ban | fail2ban
```
