---
slug: viewing-editing-files
title: Viewing, searching and editing text files (cat, less, grep, nano)
after: navigating-files
---
# Viewing, searching and editing text files

On Linux servers almost everything is a text file: website code, configuration, logs. You'll spend a lot of time reading and editing them from the terminal.

## Viewing files

```bash
cat notes.txt            # print the whole file
less /var/log/syslog     # scroll through a big file (q to quit)
head -n 20 access.log    # first 20 lines
tail -n 50 error.log     # last 50 lines
tail -f error.log        # follow: new lines appear live (Ctrl+C to stop)
wc -l users.csv          # count lines
```

Inside `less`: **Space** next page, **b** back, **/word** search, **n** next match, **q** quit.

> `tail -f` on a web server's error log while you reload the page is one of the fastest ways to find a bug.

## Searching inside files: grep

```bash
grep "error" app.log                 # lines containing "error"
grep -i "mpesa" app.log              # ignore case
grep -n "TODO" *.php                 # show line numbers
grep -r "DB_PASSWORD" /var/www       # search a whole folder
grep -v "DEBUG" app.log              # lines NOT containing DEBUG
grep -c "404" access.log             # count matching lines
grep -E "0[17][0-9]{8}" contacts.txt # regular expression: Kenyan phone numbers
```

## Finding files: find

```bash
find . -name "*.php"                      # all PHP files below here
find /var/www -name "config*"             # by name pattern
find . -type d -name "uploads"            # only folders
find . -size +50M                         # files bigger than 50 MB
find /tmp -mtime +7 -delete               # delete files older than 7 days (careful!)
```

## Editing with nano (beginner friendly)

```bash
nano /etc/hosts
```

The shortcuts are shown at the bottom (`^` means Ctrl):

| Keys | Action |
|---|---|
| Ctrl+O, Enter | Save |
| Ctrl+X | Exit |
| Ctrl+W | Search |
| Ctrl+K / Ctrl+U | Cut line / paste |
| Alt+U | Undo |

## vim: the editor on every server

`vim` is powerful and always installed, but it has **modes**, which confuses beginners. Just enough to survive:

1. `vim file.txt` opens it in **normal** mode.
2. Press `i` to **insert** (type text).
3. Press `Esc` to go back to normal mode.
4. Type `:wq` and Enter to **save and quit**, or `:q!` to **quit without saving**.

## Comparing and sorting text

```bash
diff old.conf new.conf        # show differences
sort names.txt                # alphabetical
sort -n amounts.txt           # numerical
uniq                          # remove repeated neighbouring lines (use after sort)
cut -d, -f2 sales.csv         # 2nd column of a CSV
```

## Practice on your own computer

- **Windows**: install **WSL** (Windows Subsystem for Linux) from the Microsoft Store and choose Ubuntu, or use Git Bash.
- **Android**: the Termux app.
- **Online**: any free cloud shell, or a cheap VPS.

## Why text file skills matter on Linux

On Linux, almost everything is configured with text files: web server settings (nginx, Apache), PHP settings, cron jobs, environment variables, logs that record errors and visits, and application code. System administrators, DevOps engineers, back-end developers and cybersecurity analysts read logs and edit config files daily, often over SSH on a server with no graphical interface. Being fast with these commands is what makes you effective on servers and VPS hosting.

## Reading large files efficiently

```bash
less /var/log/syslog          # scroll with arrows, / to search, n for next match, q to quit
head -n 20 access.log         # first 20 lines
tail -n 50 error.log          # last 50 lines
tail -f /var/log/nginx/error.log      # watch new lines live (Ctrl+C to stop)
wc -l access.log              # count lines (e.g. number of requests)
du -h access.log              # file size
```

Never open a 2 GB log in a normal editor; use `less`, `tail` and `grep`.

## grep in depth

```bash
grep "404" access.log                     # lines containing 404
grep -i "error" app.log                   # ignore case
grep -n "DB_HOST" .env                    # show line numbers
grep -c "POST /checkout" access.log       # count matching lines
grep -v "bot" access.log                  # lines NOT containing "bot"
grep -r "mpesa_callback" /var/www/app     # search all files in a folder
grep -rl "TODO" src/                      # only list file names
grep -A 3 -B 2 "Fatal error" php.log      # 3 lines after and 2 before each match (context)
grep -E "404|500" access.log              # extended regex: 404 OR 500
grep -o "[0-9]\{1,3\}\(\.[0-9]\{1,3\}\)\{3\}" access.log | head   # extract IP addresses
```

`-A`/`-B` context is very useful for errors, which often span several lines.

## find in depth

```bash
find /var/www -name "*.php"                      # by name
find . -iname "*invoice*"                        # case-insensitive
find /var/log -name "*.log" -size +100M          # large logs
find /backups -name "*.sql.gz" -mtime +30        # older than 30 days
find . -type d -name node_modules                # directories only
find /var/www -type f -perm -o+w                 # files writable by everyone (security risk)
find /backups -name "*.gz" -mtime +30 -delete    # delete old backups (test without -delete first!)
```

Always run `find` without `-delete` first to see what would be removed.

## Editing with nano: more shortcuts

| Keys | Action |
|---|---|
| Ctrl + O, Enter | Save |
| Ctrl + X | Exit |
| Ctrl + W | Search |
| Ctrl + \ | Search and replace |
| Ctrl + K / Ctrl + U | Cut line / paste |
| Alt + U | Undo |
| Ctrl + _ | Go to line number |
| Alt + N | Toggle line numbers |

## vim survival guide

vim has **modes**: Normal (commands), Insert (typing) and Command-line (`:`).

| Keys | Action |
|---|---|
| `i` | Insert mode (start typing) |
| `Esc` | Back to Normal mode |
| `:w` / `:q` / `:wq` / `:q!` | Save / quit / save and quit / quit without saving |
| `/word` then `n` | Search forward, next match |
| `dd` / `yy` / `p` | Delete line / copy line / paste |
| `u` / `Ctrl + r` | Undo / redo |
| `gg` / `G` | Top / bottom of file |
| `:%s/old/new/g` | Replace all |
| `:set number` | Show line numbers |

If you're ever "stuck in vim", press `Esc`, then type `:q!` and Enter.

## Safe editing habits for config files

1. **Back up first**: `sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak`
2. Edit with `sudo nano` (config files are owned by root).
3. **Test the config** before restarting: `sudo nginx -t`, `apachectl configtest`, `php -l file.php`.
4. Reload the service: `sudo systemctl reload nginx`.
5. If something breaks, restore the backup.

## Comparing, sorting and counting

```bash
diff old.conf new.conf                # differences between files
diff -u old.conf new.conf             # unified format (like Git)
sort names.txt                        # alphabetical
sort -n numbers.txt                   # numeric
sort -t, -k3 -n sales.csv             # sort CSV by 3rd column numerically
sort names.txt | uniq                 # remove duplicate neighbours
sort names.txt | uniq -c | sort -rn   # count occurrences, most common first
cut -d, -f1,3 sales.csv               # columns 1 and 3 of a CSV
```

## A real task: investigating a website error

```bash
# 1. Is the error log growing?
tail -n 30 /var/log/nginx/error.log
# 2. Which PHP errors happened today?
grep "$(date +%d-%b-%Y)" /var/log/php*-fpm.log | tail
# 3. Which pages return 500 errors most?
grep '" 500 ' /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head
# 4. Find the code mentioned in the error
grep -rn "function processPayment" /var/www/app
```

(Log file names and formats vary between servers and configurations.)

## Practice

1. Create a text file with 20 names (some repeated) and count each name with `sort | uniq -c`.
2. Use `grep -n` and `grep -c` on a log file (try `/var/log/syslog` or any `.log` file).
3. Find all `.jpg` files larger than 1 MB in your home folder.
4. Edit a file in nano, then in vim, saving and quitting both ways.
5. Make a backup copy of a config file and compare the two with `diff -u` after a change.

:::think A website shows "502 Bad Gateway". Which files and commands would you check first on an nginx + PHP-FPM server?
Check the nginx error log (`tail -n 50 /var/log/nginx/error.log`) for messages about connecting to PHP-FPM, check whether PHP-FPM is running (`systemctl status php*-fpm`), and look at the PHP-FPM log for crashes. A 502 usually means nginx couldn't get a valid response from the backend (PHP-FPM stopped, wrong socket path, or timeouts).
:::

```quiz
Q: Which command shows the last lines of a file and keeps showing new ones?
A: tail -f
Q: Which command searches for text inside files?
A: grep
Q: Which grep option ignores upper and lower case?
A: -i
Q: In nano, which keys exit the editor?
A: Ctrl+X | ctrl x | ^X
Q: In vim, what do you type to save and quit?
A: :wq | wq
Q: Which grep option shows lines that do NOT match?
A: -v
Q: Which grep options show context lines after and before a match? (letters)
A: -A and -B | -A -B | A and B
Q: Which find option selects files older than a number of days?
A: -mtime | mtime
Q: Which command tests nginx configuration before reloading?
A: nginx -t | sudo nginx -t
```
