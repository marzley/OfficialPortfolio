---
slug: pipes-redirection
title: Pipes and redirection: combining commands
after: viewing-editing-files
---
# Pipes and redirection: combining commands

The real power of the Linux command line is joining small commands together. Each does one job well; **pipes** connect them into a tool that answers real questions in one line.

## Redirection: send output to a file

```bash
ls -l > files.txt          # write output to a file (replaces it)
date >> log.txt            # append to the end of a file
sort < names.txt           # read input from a file
command 2> errors.txt      # save only error messages
command > all.txt 2>&1     # save output and errors together
command > /dev/null 2>&1   # throw everything away (silence)
```

| Symbol | Meaning |
|---|---|
| `>` | Output to a file (overwrite) |
| `>>` | Output to a file (append) |
| `<` | Input from a file |
| `2>` | Errors to a file |
| `2>&1` | Errors go wherever output goes |

> Careful: `>` erases the file first. `sort data.txt > data.txt` leaves you with an **empty** file.

## Pipes: output of one command → input of the next

```bash
ls -l | less                      # page through a long listing
cat access.log | grep "404" | wc -l     # how many 404 errors?
ps aux | grep php                 # is PHP running?
history | grep ssh                # commands I've run with ssh
```

## Real questions answered with pipes

**Which pages are visited most?** (web server access log)

```bash
cut -d' ' -f7 access.log | sort | uniq -c | sort -rn | head -10
```

Read it step by step:

1. `cut -d' ' -f7` takes the 7th space-separated field (the page path),
2. `sort` groups identical paths together,
3. `uniq -c` counts each group,
4. `sort -rn` sorts by count, highest first,
5. `head -10` keeps the top 10.

**Which IP addresses hit the login page most?** (spotting a password attack)

```bash
grep "POST /login" access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head
```

**Total M-Pesa amounts in a CSV** (amount in column 3):

```bash
cut -d, -f3 payments.csv | tail -n +2 | paste -sd+ | bc
```

**Biggest folders using disk space:**

```bash
du -sh /var/www/* | sort -h | tail -5
```

## tee: save and show at the same time

```bash
./backup.sh | tee backup.log      # see the output AND keep a copy
```

## xargs: turn lines into arguments

```bash
find . -name "*.log" | xargs rm           # delete all .log files found
cat servers.txt | xargs -I{} ping -c 1 {} # ping each server listed
```

## awk and sed in one minute

```bash
awk -F, '{ total += $3 } END { print total }' payments.csv   # sum column 3
awk '$9 == 500' access.log                                    # lines where field 9 is 500
sed 's/http:/https:/g' links.txt                              # replace text in the output
sed -i 's/DEBUG=true/DEBUG=false/' .env                       # edit a file in place
```

## Chaining commands

```bash
mkdir site && cd site          # run the second only if the first succeeds
make build || echo "Build failed"   # run the second only if the first fails
cd /tmp; ls                    # run both regardless
```

## Why pipes are Linux's superpower

Linux follows a simple philosophy: small programs that each do one job well, connected together. Pipes and redirection let you combine `grep`, `sort`, `uniq`, `cut`, `awk` and others to answer questions in one line that might otherwise need a script or spreadsheet: "which IP addresses hit the login page most?", "how many orders came in today?", "which folder is filling the disk?" System administrators, DevOps engineers and security analysts use these combinations constantly.

## Standard streams

| Stream | Number | Default | Redirect with |
|---|---|---|---|
| Standard input (stdin) | 0 | Keyboard | `<` |
| Standard output (stdout) | 1 | Screen | `>` or `>>` |
| Standard error (stderr) | 2 | Screen | `2>` or `2>>` |

```bash
ls /etc /nothing > out.txt 2> errors.txt     # normal output and errors to separate files
ls /etc /nothing > all.txt 2>&1              # both to the same file
command > /dev/null 2>&1                     # discard all output (common in cron jobs)
sort < names.txt                             # read input from a file
```

`/dev/null` is a special "black hole" file that discards anything written to it.

## Here documents: multi-line input

```bash
cat > notes.txt <<'EOF2'
Server: web01
Backups: daily at 2am
EOF2
```

Used in scripts to write config files or send multi-line input to commands.

## Answering real questions about a web server

Assume a typical access log where field 1 is the visitor's IP, field 7 is the requested page and field 9 is the status code:

```bash
# Top 10 visitor IP addresses
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head

# Most requested pages
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head

# Count of each status code (200, 404, 500...)
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# Pages that return 404 (broken links to fix)
awk '$9 == 404 {print $7}' access.log | sort | uniq -c | sort -rn | head

# Requests to the login page by IP (possible brute-force attempts)
grep "POST /wp-login.php" access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head
```

Log formats vary; check a sample line with `head -n 3 access.log` and adjust the field numbers.

## awk: a mini programming language for columns

```bash
awk -F, '{print $2}' sales.csv                       # 2nd column of a CSV (-F sets the separator)
awk -F, 'NR > 1 {sum += $4} END {print sum}' sales.csv        # total of column 4, skipping the header
awk -F, 'NR > 1 {t[$2] += $4} END {for (k in t) print k, t[k]}' sales.csv   # totals per town
awk -F, '$4 > 5000' sales.csv                        # rows where column 4 is over 5000
awk '{print NR": "$0}' file.txt                      # number each line
```

`NR` is the line number, `$0` the whole line, `$1`, `$2`... the columns, and `END` runs after all lines.

## sed: find and replace in streams and files

```bash
sed 's/http:/https:/g' page.html                      # print with replacements (file unchanged)
sed -i.bak 's/old-domain.co.ke/new-domain.co.ke/g' config.php   # edit in place, keep a .bak backup
sed -n '10,20p' big.log                               # print only lines 10 to 20
sed '/^#/d' config.conf                               # remove comment lines
sed '/^$/d' file.txt                                  # remove empty lines
```

Always test without `-i` first, or use `-i.bak` to keep a backup.

## xargs and command substitution

```bash
find . -name "*.tmp" | xargs rm                       # delete all found files
find . -name "*.php" | xargs grep -l "mysql_query"    # PHP files using an old function
grep -rl "old-domain" . | xargs sed -i 's/old-domain/new-domain/g'   # replace across many files

echo "Today is $(date +%A)"                           # $( ) inserts a command's output
backup="db-$(date +%Y-%m-%d).sql"                     # file name with today's date
echo "Files in folder: $(ls | wc -l)"
```

For file names with spaces, use `find ... -print0 | xargs -0 ...`.

## Chaining and conditions

| Operator | Meaning | Example |
|---|---|---|
| `;` | Run one after the other regardless | `cd /tmp; ls` |
| `&&` | Run the next only if the previous succeeded | `npm run build && rsync -a dist/ server:/var/www/` |
| `||` | Run the next only if the previous failed | `ping -c1 google.com || echo "No internet"` |
| `&` | Run in the background | `long-task &` |

```bash
sudo nginx -t && sudo systemctl reload nginx          # reload only if the config is valid
mkdir -p backups && cp site.sql backups/
```

`&&` is a safety habit: never restart a service with a broken config.

## Disk space detective work

```bash
df -h                                                 # free space per disk
du -sh /var/* 2>/dev/null | sort -h | tail            # biggest folders in /var
du -ah /var/log | sort -rh | head -n 10               # biggest files and folders in logs
```

When a server runs out of disk space, websites and databases fail; these commands find what's using it (often logs, old backups or caches).

## Practice

1. Create a CSV of sales (date, town, product, amount) and use awk to total sales per town.
2. Use `sort | uniq -c | sort -rn` to find the most common word in a text file.
3. Redirect a command's errors to a file and its normal output to another.
4. Use `sed -i.bak` to change a domain name in a config file, then compare with the backup using `diff`.
5. Find the five largest folders in your home directory.

:::think Why is `sudo nginx -t && sudo systemctl reload nginx` safer than running the two commands separately with `;`?
With `&&`, the reload only happens if the configuration test passes. With `;`, the reload would run even after a failed test, and restarting with a broken configuration could take the website down.
:::

```quiz
Q: Which symbol appends output to a file instead of replacing it?
A: >>
Q: What is the name of the symbol that sends one command's output into the next command?
A: pipe | a pipe
Q: Which command counts identical neighbouring lines? (with -c)
A: uniq | uniq -c
Q: Which command shows output on screen and also saves it to a file?
A: tee
Q: With &&, does the second command run if the first fails? (yes or no)
A: no
Q: Which special file discards anything written to it?
A: /dev/null
Q: Which redirection sends errors (stderr) to the same place as normal output?
A: 2>&1
Q: In awk, which variable holds the current line number?
A: NR
Q: Which sed option edits a file in place?
A: -i
```
