---
slug: archives-disks-network
title: "Archives, disks and network tools: tar, zip, df, du, mount, curl, wget, ip and ss"
after: services-cron-logs
---
# Archives, disks and network tools: tar, zip, df, du, mount, curl, wget, ip and ss

Three everyday admin jobs fill this unit: **packing files** (backups, uploads, downloads come as `.tar.gz` or `.zip`), **managing disk space** (a full disk is one of the most common reasons websites and databases suddenly stop working), and **checking the network** (is the server online, which ports are listening, can it reach an API?). These commands are used by developers, sysadmins, network engineers and support staff daily.

:::note What you will learn
- Creating and extracting tar, gzip and zip archives
- Checking disk space and finding what's using it
- Disks, partitions and mounting a USB or extra disk
- Downloading and testing web requests with curl and wget
- Network information: ip, ping, ss, dig, traceroute
- A "disk full" and a "site unreachable" troubleshooting routine
:::

## Archives and compression

An **archive** bundles many files into one; **compression** makes it smaller. On Linux the classic is `tar` (tape archive) plus `gzip`.

```bash
tar -czf site-backup.tar.gz /var/www/site     # create (c), gzip (z), file name (f)
tar -tzf site-backup.tar.gz                   # list contents (t)
tar -xzf site-backup.tar.gz                   # extract (x) here
tar -xzf site-backup.tar.gz -C /tmp/restore   # extract into a folder
tar -cJf logs.tar.xz /var/log/nginx           # xz: smaller, slower
```

Remember the letters: **c**reate, e**x**tract, lis**t**, **z** gzip, **J** xz, **v** verbose, **f** file.

| Extension | Tool | Notes |
|---|---|---|
| `.tar.gz` / `.tgz` | `tar -z` | Most common on Linux |
| `.tar.xz` | `tar -J` | Better compression |
| `.zip` | `zip` / `unzip` | Best for sharing with Windows users |
| `.gz` (single file) | `gzip` / `gunzip` | Compresses one file, e.g. logs |

```bash
sudo apt install zip unzip
zip -r photos.zip photos/
unzip photos.zip -d extracted/
unzip -l photos.zip              # list contents
gzip big.log                     # becomes big.log.gz
zcat big.log.gz | less           # read without extracting
```

:::tip Test your backups
A backup you've never restored is a hope, not a backup. Regularly extract an archive into `/tmp` and check the files open.
:::

## Disk space

```bash
df -h                    # free space per file system (human-readable)
df -i                    # inodes: running out of these also stops new files
du -sh /var/www          # size of one folder
du -h --max-depth=1 /var | sort -h      # what's big inside /var
sudo du -xh / --max-depth=2 2>/dev/null | sort -h | tail -20   # biggest folders on the system disk
```

Interactive and friendlier: `sudo apt install ncdu`, then `sudo ncdu /`.

Common space eaters on servers:

| Culprit | Where | Fix |
|---|---|---|
| Logs | `/var/log`, app log files | Rotate with logrotate; `sudo journalctl --vacuum-size=200M` |
| Old backups | Backup folders | Keep a set number of days; move off-server |
| Package cache | `/var/cache/apt` | `sudo apt clean` and `sudo apt autoremove` |
| Uploads | Website upload folders | Optimise images, set limits |
| Old kernels | `/boot` | `sudo apt autoremove` |
| Docker | `/var/lib/docker` | `docker system prune` (careful) |

## Disks, partitions and mounting

```bash
lsblk                     # disks and partitions as a tree (sda, sdb, nvme0n1...)
sudo fdisk -l             # detailed partition info
mount | column -t         # what's mounted where
```

Mount a USB drive or extra disk:

```bash
sudo mkdir -p /mnt/usb
sudo mount /dev/sdb1 /mnt/usb
ls /mnt/usb
sudo umount /mnt/usb      # always unmount before removing
```

To mount a disk automatically at boot, add it to `/etc/fstab` (using its UUID from `sudo blkid`). A mistake in fstab can stop a server from booting, so test with `sudo mount -a` before rebooting.

Formatting erases data: `sudo mkfs.ext4 /dev/sdb1` (double-check the device name with `lsblk` first!).

## curl and wget: talking to the web

```bash
wget https://example.com/file.zip              # download a file
wget -c https://example.com/big.iso            # continue an interrupted download
curl https://example.com                       # print a page
curl -o page.html https://example.com          # save to a file
curl -I https://example.com                    # headers only: status code, server, redirects
curl -L http://example.com                     # follow redirects
curl -s https://api.github.com/repos/torvalds/linux | head -20    # call an API
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Amina"}' https://httpbin.org/post               # send JSON
curl -w "%{http_code} %{time_total}s\n" -o /dev/null -s https://example.com   # status and timing
```

`curl -I` is a quick way to check if a site is up and whether HTTPS redirects work:

```
HTTP/2 200
server: nginx
content-type: text/html
```

## Network information

```bash
ip a                      # IP addresses of each interface (ip addr)
ip r                      # routing table, including the default gateway
ping -c 4 8.8.8.8         # can we reach the internet by IP?
ping -c 4 google.com      # does DNS work too?
dig example.com +short    # DNS lookup (sudo apt install dnsutils)
traceroute example.com    # path packets take (sudo apt install traceroute)
ss -tulpn                 # listening ports and which program owns them (sudo for all names)
hostname -I               # this machine's IP addresses
cat /etc/resolv.conf      # DNS servers in use
```

Reading `ss -tulpn`:

```
tcp  LISTEN 0 511  0.0.0.0:80    0.0.0.0:*  users:(("nginx",pid=812))
tcp  LISTEN 0 151  127.0.0.1:3306 0.0.0.0:* users:(("mysqld",pid=640))
```

Nginx listens on port 80 on all addresses (`0.0.0.0`): reachable from outside. MySQL listens only on `127.0.0.1` (localhost): good, it isn't exposed to the internet.

The networking subject explains IP addresses, DNS and ports in depth.

## Troubleshooting routines

### "The website stopped working, and errors say no space left on device"

1. `df -h`: which file system is at 100%?
2. `sudo du -xh / --max-depth=2 | sort -h | tail`: find the biggest folders.
3. Clean safely: rotate/compress logs, delete old backups, `apt clean`.
4. Restart affected services (`sudo systemctl restart mysql nginx php8.3-fpm`, adjusting names to your versions).
5. Prevent it: logrotate, backup retention, a disk-usage alert script (see bash scripting).

### "The site is unreachable"

1. From your computer: `ping` the domain and `curl -I https://domain`.
2. DNS: `dig domain +short`: does it return the server's IP?
3. On the server: `systemctl status nginx`: is the web server running?
4. `ss -tulpn | grep -E ':80|:443'`: is it listening?
5. Firewall: `sudo ufw status`: are 80/443 allowed?
6. Logs: `sudo tail -50 /var/log/nginx/error.log`.

:::think `df -h` shows / at 100%. `du` shows /var/log is 18 GB, mostly one file: /var/log/app/debug.log. What do you do immediately, and what do you change so it doesn't happen again?
Immediately: compress or truncate the log (`sudo truncate -s 0 /var/log/app/debug.log` if you don't need it, or archive it elsewhere first), then restart affected services. Long term: turn off debug logging in production and configure logrotate for that log (daily/size-based rotation, compression, keep N files).
:::

## Summary

- `tar -czf` creates and `tar -xzf` extracts `.tar.gz`; `zip`/`unzip` for Windows users; test restores.
- `df -h` shows free space; `du -sh` and `ncdu` find big folders; logs and backups are common culprits.
- `lsblk`, `mount`, `umount` and `/etc/fstab` manage disks; formatting erases data.
- `curl` and `wget` download and test web requests (`curl -I` for status/headers).
- `ip a`, `ip r`, `ping`, `dig`, `traceroute` and `ss -tulpn` check network setup and listening ports.

```quiz
Q: Which tar letter means extract?
A: x
Q: Which command shows free disk space in human-readable form? (two words)
A: df -h
Q: Which curl option shows only the response headers?
A: -I | --head
Q: Which command lists listening ports and their programs? (two words)
A: ss -tulpn | ss -tlnp | netstat -tulpn
Q: Which command lists disks and partitions as a tree?
A: lsblk
Q: What address means a service only listens locally? (IPv4)
A: 127.0.0.1 | localhost
```
