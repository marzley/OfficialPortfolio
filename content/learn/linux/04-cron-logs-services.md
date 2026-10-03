---
slug: services-cron-logs
title: Services, scheduled jobs (cron) and logs
after: processes-packages
---
# Services, scheduled jobs (cron) and logs

A server runs programs in the background (web server, database), runs jobs on a schedule (backups, reminders), and writes logs of everything. These three skills are what a junior sysadmin uses daily.

## Services with systemctl

Most Linux systems use **systemd** to manage services.

```bash
sudo systemctl status nginx       # running? recent log lines
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx      # stop + start
sudo systemctl reload nginx       # re-read config without dropping connections
sudo systemctl enable nginx       # start automatically at boot
sudo systemctl disable nginx
systemctl list-units --type=service --state=running
```

> After editing a config file, **test it before restarting**: `sudo nginx -t` or `sudo apachectl configtest`. A broken config + restart = website down.

## Scheduled jobs with cron

**cron** runs commands at set times. Edit your list with:

```bash
crontab -e          # your jobs
sudo crontab -e     # root's jobs
crontab -l          # list them
```

Each line has **five time fields** then the command:

```
┌──────── minute (0-59)
│ ┌────── hour (0-23)
│ │ ┌──── day of month (1-31)
│ │ │ ┌── month (1-12)
│ │ │ │ ┌ day of week (0-6, Sunday = 0)
│ │ │ │ │
* * * * *  command
```

| Schedule | Meaning |
|---|---|
| `0 2 * * *` | Every day at 2:00 am |
| `*/15 * * * *` | Every 15 minutes |
| `0 8 * * 1-5` | 8:00 am Monday to Friday |
| `30 18 1 * *` | 6:30 pm on the 1st of every month |
| `@reboot` | Once when the server starts |

Real examples:

```
# Back up the database every night at 2am
0 2 * * * /usr/bin/mysqldump -u backup shopdb | gzip > /backups/shop-$(date +\%F).sql.gz

# Send payment reminders every morning at 8
0 8 * * * /usr/bin/php /var/www/portal/cron.php reminders >> /var/log/reminders.log 2>&1

# Delete backups older than 30 days, every Sunday at 3am
0 3 * * 0 find /backups -name "*.gz" -mtime +30 -delete
```

Tips:

- Use **full paths** (`/usr/bin/php`, not `php`): cron has a very small PATH.
- In crontab, `%` must be written `\%`.
- Send output to a log file so you can see if the job worked.
- On cPanel hosting, use **Cron Jobs** in the dashboard: same five fields.

## Logs: where to look when something breaks

| Log | Holds |
|---|---|
| `/var/log/syslog` (Ubuntu) or `/var/log/messages` | General system messages |
| `/var/log/auth.log` | Logins, sudo, SSH attempts |
| `/var/log/nginx/access.log`, `error.log` | Web requests and web errors |
| `/var/log/apache2/error.log` | Apache errors (incl. PHP errors) |
| `/var/log/mysql/error.log` | Database problems |

```bash
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx --since "1 hour ago"     # systemd's log for one service
sudo journalctl -p err -b                         # errors since boot
sudo grep "Failed password" /var/log/auth.log | wc -l   # how many failed SSH logins?
```

Logs grow forever unless rotated. **logrotate** (installed by default) compresses and deletes old logs automatically.

## Checking resources

```bash
df -h              # disk space per drive
du -sh /var/www/*  # size of each site
free -h            # memory
uptime             # load average
htop               # live processes (install with sudo apt install htop)
```

A full disk is one of the most common reasons sites and databases suddenly fail.

## Why services, cron and logs matter

Servers must keep running without anyone watching: web servers and databases restart after crashes or reboots, backups run every night, payment reminders go out every morning, and old files are cleaned up automatically. When something breaks at 3 am, logs are how you find out what happened. These are core skills for anyone hosting websites on a VPS, working in DevOps or supporting business systems.

## systemd services in depth

```bash
systemctl status nginx              # running? recent log lines
sudo systemctl start|stop|restart nginx
sudo systemctl reload nginx         # reload config without dropping connections
sudo systemctl enable --now mysql   # start now AND at every boot
systemctl is-active nginx           # prints active/inactive (useful in scripts)
systemctl list-units --type=service --state=running
systemctl --failed                  # services that failed
```

| Command | Effect |
|---|---|
| `restart` | Stop and start (brief downtime) |
| `reload` | Re-read config without stopping (if supported) |
| `enable` | Start automatically at boot |
| `disable` | Don't start at boot |
| `mask` | Prevent a service from starting at all |

## Creating your own service (for a Node or Python app)

```ini
# /etc/systemd/system/shop-api.service
[Unit]
Description=Shop API (Node.js)
After=network.target

[Service]
User=deploy
WorkingDirectory=/var/www/shop-api
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
EnvironmentFile=/var/www/shop-api/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload         # load the new unit file
sudo systemctl enable --now shop-api
journalctl -u shop-api -f            # follow its logs
```

`Restart=always` brings the app back automatically if it crashes. Keep secrets in the EnvironmentFile with restricted permissions (600), not in the unit file.

## Cron syntax deep dive

```
┌──── minute (0–59)
│ ┌──── hour (0–23)
│ │ ┌──── day of month (1–31)
│ │ │ ┌──── month (1–12)
│ │ │ │ ┌──── day of week (0–7, 0 and 7 = Sunday)
│ │ │ │ │
* * * * *  command
```

| Schedule | Meaning |
|---|---|
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour on the hour |
| `30 6 * * 1-5` | 6:30 am, Monday to Friday |
| `0 2 * * *` | 2:00 am daily |
| `0 0 1 * *` | Midnight on the 1st of each month |
| `0 9 * * 1` | 9:00 am every Monday |
| `@reboot` | Once when the server starts |

Check schedules with an online "crontab guru" style tool before relying on them.

## Writing reliable cron jobs

```bash
# crontab -e
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=""

# Nightly database backup at 2:15, logging output and errors
15 2 * * * /home/deploy/scripts/backup.sh >> /home/deploy/logs/backup.log 2>&1

# Laravel scheduler (runs every minute and decides what to do)
* * * * * cd /var/www/shop && php artisan schedule:run >> /dev/null 2>&1
```

Common reasons cron jobs "don't work":

| Problem | Fix |
|---|---|
| Command works in the terminal but not in cron | Cron has a minimal PATH: use full paths (`/usr/bin/php`) |
| Script not executable | `chmod +x script.sh` and a `#!/bin/bash` first line |
| `%` in the command | Escape as `\%` (cron treats % as a newline) |
| No idea if it ran | Redirect output to a log file; check `grep CRON /var/log/syslog` |
| Server time zone surprises | Check `timedatectl`; set the right zone (Africa/Nairobi) or account for UTC |

## systemd timers (a modern alternative to cron)

```bash
systemctl list-timers               # see scheduled timers (e.g. certbot renewals, apt updates)
```

Timers log to the journal automatically and can catch up on missed runs (`Persistent=true`), which is handy if the server was off at the scheduled time.

## Logs: journalctl and /var/log

```bash
journalctl -u nginx --since "1 hour ago"
journalctl -u mysql -p err            # only errors
journalctl -b                         # since the last boot
journalctl -f                         # follow everything live
journalctl --disk-usage               # how much space logs use
sudo journalctl --vacuum-time=14d     # delete journal entries older than 14 days
```

| Log | Contains |
|---|---|
| `/var/log/syslog` (Debian/Ubuntu) | General system messages, cron runs |
| `/var/log/auth.log` | Logins, sudo usage, SSH attempts |
| `/var/log/nginx/access.log`, `error.log` | Website requests and errors |
| `/var/log/mysql/error.log` | Database errors |
| `/var/log/apt/history.log` | Package installs and updates |

## Log rotation

`logrotate` stops logs filling the disk by compressing and deleting old files. Configs live in `/etc/logrotate.d/`:

```
/home/deploy/logs/*.log {
    weekly
    rotate 8
    compress
    missingok
    notifempty
}
```

## Monitoring resources

```bash
uptime                 # load average over 1, 5 and 15 minutes
free -h                # memory and swap
df -h                  # disk space
htop                   # interactive process viewer (install with apt)
top -o %MEM            # sort processes by memory
iostat / vmstat        # disk and system activity (sysstat package)
```

Set up alerts (e.g. a free uptime monitor that pings your site, or monitoring tools like Netdata) so you know about problems before customers do.

## A simple health-check script

```bash
#!/bin/bash
# /home/deploy/scripts/health.sh: restart nginx if it's down and record it
if ! systemctl is-active --quiet nginx; then
  echo "$(date) nginx down, restarting" >> /home/deploy/logs/health.log
  sudo systemctl restart nginx
fi
usage=$(df / --output=pcent | tail -1 | tr -dc '0-9')
if [ "$usage" -gt 90 ]; then
  echo "$(date) disk at ${usage}%" >> /home/deploy/logs/health.log
fi
```

Run it every 5 minutes from cron. (The deploy user needs permission to restart nginx via sudo rules.)

## Practice

1. Check the status of three services and list any failed ones.
2. Write a cron job that appends the date to a file every 5 minutes; confirm it runs.
3. Create a systemd service for a simple Python HTTP server (`python3 -m http.server 8080`) and enable it.
4. Use `journalctl` to show only errors from the last boot.
5. Write a logrotate rule for your own log folder.

:::think A backup script works when you run it manually, but the cron job produces no backups. How would you troubleshoot?
Check that cron actually ran it (`grep CRON /var/log/syslog`), redirect the job's output and errors to a log file to see messages, use absolute paths for commands and files (cron's PATH is minimal), make sure the script is executable with a correct shebang, check environment variables the script relies on, escape any % characters, and confirm the schedule and server time zone are what you expect.
:::

```quiz
Q: Which command restarts a service like nginx?
A: sudo systemctl restart nginx | systemctl restart nginx | systemctl restart
Q: Which command makes a service start automatically at boot?
A: systemctl enable | sudo systemctl enable nginx | enable
Q: What cron schedule means every day at 2:00 am?
A: 0 2 * * *
Q: Which command edits your cron jobs?
A: crontab -e
Q: Which command shows free disk space in human-readable sizes?
A: df -h
Q: Which systemctl command reloads unit files after creating a new service?
A: daemon-reload | systemctl daemon-reload
Q: What cron schedule runs a job every 5 minutes?
A: */5 * * * *
Q: Which journalctl option follows new log lines live?
A: -f
Q: Which tool compresses and deletes old log files automatically?
A: logrotate
```
