---
slug: linux-servers-devops
title: "Linux servers for DevOps: SSH keys, users, services, logs, updates and firewalls"
after: cloud-computing-basics
---
# Linux servers for DevOps: SSH keys, users, services, logs, updates and firewalls

Most of the internet runs on Linux, and nearly every cloud server you create will be Linux (often Ubuntu). This lesson covers the server tasks a DevOps engineer does every week. If commands like `cd`, `ls` and `sudo` are new to you, start with the [Linux subject](./?track=linux&lesson=why-linux).

## 1. Connect securely with SSH keys

Passwords can be guessed; **SSH keys** are far safer.

```bash
# On your computer: create a key pair (press Enter to accept defaults; add a passphrase)
ssh-keygen -t ed25519 -C "you@example.com"

# Copy the public key to the server
ssh-copy-id ubuntu@203.0.113.10

# Connect
ssh ubuntu@203.0.113.10
```

The **private key** (`~/.ssh/id_ed25519`) never leaves your computer. The **public key** goes on servers. Cloud providers usually ask for your public key when you create a server.

**Harden SSH** in `/etc/ssh/sshd_config`:
```text
PermitRootLogin no
PasswordAuthentication no
```
Then `sudo systemctl restart ssh` (keep your current session open until you've tested a new login).

## 2. Users and sudo

```bash
sudo adduser deploy                 # create a user for deployments
sudo usermod -aG sudo deploy        # give admin rights (only if needed)
sudo -u deploy whoami               # run a command as that user
```

Give each person their own account; never share one login. Run apps as non-root users.

## 3. Updates

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install unattended-upgrades    # automatic security updates on Ubuntu
```

Unpatched servers are one of the most common ways attackers get in.

## 4. Services with systemd

Most server software runs as a **service** managed by systemd:

```bash
sudo systemctl status nginx      # is it running?
sudo systemctl restart nginx     # restart after config changes
sudo systemctl enable nginx      # start automatically at boot
```

Run your own app as a service so it restarts after crashes and reboots:

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Node app
After=network.target

[Service]
User=deploy
WorkingDirectory=/home/deploy/myapp
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
```

## 5. Logs: where problems are explained

```bash
journalctl -u myapp -f                 # follow your app's logs
journalctl -u nginx --since "1 hour ago"
sudo tail -f /var/log/nginx/error.log
```

When something breaks, **read the logs first**.

## 6. Disk, memory and processes

```bash
df -h          # disk space (full disks crash apps and databases)
free -h        # memory
top            # live processes (or htop)
du -sh /var/log/*    # what's using space
```

## 7. Firewall with UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Open only the ports you need. In the cloud, also configure the provider's firewall (security groups), covered in the next lesson.

## 8. Scheduled jobs with cron

```bash
crontab -e
# Back up the database every night at 2:30am
30 2 * * * /home/deploy/scripts/backup.sh >> /home/deploy/backup.log 2>&1
```

## A server setup checklist

1. Create the server with your SSH public key.
2. Update packages; enable automatic security updates.
3. Create a non-root user; disable root and password logins.
4. Enable the firewall (SSH, HTTP, HTTPS only).
5. Install your stack (e.g. Nginx, PHP or Node, a database).
6. Run the app as a systemd service.
7. Set up HTTPS, backups and monitoring.

:::think Your app stopped responding at 3am. You SSH in. What do you check, in what order?
Check the service status (systemctl status), read recent logs (journalctl / app and Nginx error logs), check disk space (df -h) and memory (free -h), then restart the service if needed and confirm it's responding. Afterwards, find the root cause and add monitoring or alerts so it doesn't happen silently again.
:::

## Summary

- Use SSH keys; disable root and password logins.
- Separate user accounts; run apps as non-root users.
- Keep servers updated; run apps as systemd services; read logs with journalctl.
- Watch disk and memory; use UFW; schedule jobs with cron.

```quiz
Q: Which key never leaves your computer: public or private? (one word)
A: private
Q: Which command shows your app's logs managed by systemd? (one word)
A: journalctl
Q: Which command shows free disk space in a human-readable way? (write it like df -h)
A: df -h | df
```
