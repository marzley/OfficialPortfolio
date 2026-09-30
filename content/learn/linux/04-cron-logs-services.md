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
```
