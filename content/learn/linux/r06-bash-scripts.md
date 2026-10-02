---
slug: bash-scripts
title: "Bash scripting: variables, input, conditions, loops, functions, error handling and real automation scripts"
after: KEEP
---
# Bash scripting: variables, input, conditions, loops, functions, error handling and real automation scripts

A **Bash script** is a text file full of commands that runs from top to bottom, like a recipe. Anything you type in the terminal can go in a script, and then it can run again and again: nightly backups, deploying a website, creating user accounts for a whole class, checking disk space and emailing an alert, renaming hundreds of photos. Scripting is what turns a Linux user into a Linux administrator.

:::note What you will learn
- Creating and running a script (shebang, chmod +x)
- Variables, quoting and command substitution
- Reading input and script arguments
- Exit codes, `&&` and `||`
- if/elif/else and test conditions for files, numbers and text
- for, while and until loops
- case statements and simple menus
- Functions
- Safer scripts: `set -euo pipefail`, quoting and shellcheck
- Real scripts: backup, disk alert, bulk rename, log report
- Scheduling scripts with cron
:::

## Your first script

```bash
nano hello.sh
```

```bash
#!/bin/bash
# hello.sh: my first script
echo "Hello, $USER!"
echo "Today is $(date +%A), $(date +%d-%m-%Y)"
echo "You are in: $(pwd)"
```

```bash
chmod +x hello.sh      # make it executable
./hello.sh             # run it (./ means "in this folder")
bash hello.sh          # or run it with bash directly
```

The first line `#!/bin/bash` is the **shebang**: it tells the system which interpreter runs the file. Lines starting with `#` are comments.

## Variables

```bash
NAME="Wanjiku"           # no spaces around =
COUNT=5
echo "Hello $NAME, you have $COUNT messages"
echo "File: ${NAME}_report.txt"     # braces separate the name from text after it
```

- **Double quotes** expand variables: `"Hi $NAME"` → Hi Wanjiku.
- **Single quotes** don't: `'Hi $NAME'` → Hi $NAME.
- **Command substitution** stores a command's output: `TODAY=$(date +%F)`.
- **Arithmetic**: `TOTAL=$((PRICE * QTY))`.

```bash
PRICE=250
QTY=4
echo "Total: KSh $((PRICE * QTY))"
FILES=$(ls | wc -l)
echo "There are $FILES items here"
```

Environment variables (`$HOME`, `$USER`, `$PATH`) are available in every script. Export your own for child processes: `export API_URL="https://..."`.

## Input and arguments

```bash
read -p "Enter your name: " NAME
read -sp "Password: " PASS; echo     # -s hides typing
echo "Welcome, $NAME"
```

Arguments passed on the command line (`./greet.sh Amina Mombasa`):

| Variable | Meaning |
|---|---|
| `$0` | Script name |
| `$1`, `$2`... | First, second argument |
| `$#` | Number of arguments |
| `$@` | All arguments (use `"$@"` in quotes) |
| `$?` | Exit code of the last command |
| `$$` | The script's PID |

```bash
#!/bin/bash
if [ $# -lt 2 ]; then
  echo "Usage: $0 NAME TOWN"
  exit 1
fi
echo "Hello $1 from $2"
```

## Exit codes

Every command returns an **exit code**: **0 means success**, anything else means failure.

```bash
ls /etc > /dev/null; echo $?        # 0
ls /nope 2> /dev/null; echo $?      # 2 (error)

mkdir backup && echo "created"      # && runs only on success
ping -c1 google.com > /dev/null || echo "No internet!"   # || runs only on failure
```

Scripts should end with `exit 0` on success and a non-zero code on errors, so other tools (cron, CI) know what happened.

## Conditions

```bash
if [ condition ]; then
  ...
elif [ other ]; then
  ...
else
  ...
fi
```

| Test | True if |
|---|---|
| `-f file` | file exists and is a regular file |
| `-d dir` | directory exists |
| `-e path` | anything exists |
| `-r / -w / -x file` | readable / writable / executable |
| `-z "$s"` | string is empty |
| `"$a" = "$b"` / `!=` | strings equal / different |
| `$a -eq $b` | numbers equal (`-ne`, `-lt`, `-le`, `-gt`, `-ge`) |

```bash
#!/bin/bash
FILE="/etc/nginx/nginx.conf"
if [ -f "$FILE" ]; then
  echo "Nginx config found"
else
  echo "Nginx not installed"
fi

USAGE=$(df / --output=pcent | tail -1 | tr -dc '0-9')
if [ "$USAGE" -ge 90 ]; then
  echo "CRITICAL: disk ${USAGE}% full"
elif [ "$USAGE" -ge 75 ]; then
  echo "Warning: disk ${USAGE}% full"
else
  echo "Disk OK (${USAGE}%)"
fi
```

Bash also has `[[ ... ]]`, which is more forgiving (supports `&&`, `||` and patterns): `if [[ $NAME == W* && -d "$HOME" ]]; then ...`.

## Loops

```bash
# for over a list
for TOWN in Nairobi Mombasa Kisumu Nakuru; do
  echo "Branch: $TOWN"
done

# for over files
for f in *.jpg; do
  echo "Processing $f"
done

# numeric range
for i in {1..5}; do
  echo "Attempt $i"
done

# C-style
for ((i = 1; i <= 3; i++)); do
  echo "Round $i"
done

# while: read a file line by line
while IFS= read -r line; do
  echo "User: $line"
done < users.txt

# until: keep trying until success
until ping -c1 8.8.8.8 > /dev/null; do
  echo "Waiting for network..."
  sleep 5
done
```

`break` exits a loop; `continue` skips to the next round.

## case: menus and choices

```bash
read -p "Choose: [s]tart, [t]op, [r]estart: " CHOICE
case "$CHOICE" in
  s|start)   sudo systemctl start nginx ;;
  t|stop)    sudo systemctl stop nginx ;;
  r|restart) sudo systemctl restart nginx ;;
  *)         echo "Unknown option" ;;
esac
```

## Functions

```bash
log() {
  echo "$(date '+%F %T') $*" >> /var/log/myscript.log
}

backup_folder() {
  local SRC="$1"            # local keeps the variable inside the function
  local DEST="$2"
  tar -czf "$DEST/$(basename "$SRC")-$(date +%F).tar.gz" "$SRC" && log "Backed up $SRC"
}

backup_folder /var/www/site /home/deploy/backups
```

## Writing safer scripts

```bash
#!/bin/bash
set -euo pipefail
```

| Option | Effect |
|---|---|
| `-e` | Stop on the first failing command |
| `-u` | Error on undefined variables (catches typos like `$DESTT`) |
| `-o pipefail` | A pipeline fails if any command in it fails |

Other habits:
- **Quote variables**: `rm -r "$DIR"`, not `rm -r $DIR`. An empty or space-containing variable without quotes can delete the wrong things.
- Check required variables: `: "${BACKUP_DIR:?BACKUP_DIR not set}"`.
- Run **shellcheck** (`sudo apt install shellcheck`, then `shellcheck script.sh`); it finds common bugs.
- Never store passwords in scripts; read them from a protected file or environment variable.

## Real script 1: website and database backup

```bash
#!/bin/bash
set -euo pipefail
DATE=$(date +%F)
SITE=/var/www/site
DEST=/home/deploy/backups
mkdir -p "$DEST"

tar -czf "$DEST/site-$DATE.tar.gz" -C "$(dirname "$SITE")" "$(basename "$SITE")"
# credentials come from ~/.my.cnf (chmod 600), not from this script
mysqldump --single-transaction shopdb | gzip > "$DEST/db-$DATE.sql.gz"

find "$DEST" -type f -mtime +14 -delete      # keep 14 days
echo "Backup done: $DATE"
```

Copy backups off the server too (rsync to another machine or cloud storage): a backup on the same disk dies with the disk.

## Real script 2: bulk rename photos

```bash
#!/bin/bash
# rename IMG_1234.jpg -> wedding-001.jpg, wedding-002.jpg ...
n=1
for f in IMG_*.jpg; do
  new=$(printf "wedding-%03d.jpg" "$n")
  mv -i -- "$f" "$new"
  n=$((n + 1))
done
```

## Real script 3: create accounts for a class

```bash
#!/bin/bash
set -euo pipefail
# students.txt has one username per line
while IFS= read -r user; do
  [ -z "$user" ] && continue
  if id "$user" &>/dev/null; then
    echo "$user exists, skipping"
  else
    sudo useradd -m -s /bin/bash "$user"
    echo "$user:ChangeMe-$RANDOM" | sudo chpasswd
    sudo chage -d 0 "$user"          # force a password change at first login
    echo "Created $user"
  fi
done < students.txt
```

## Real script 4: top visitors from a web log

```bash
#!/bin/bash
LOG=${1:-/var/log/nginx/access.log}
echo "Top 10 IP addresses:"
awk '{print $1}' "$LOG" | sort | uniq -c | sort -rn | head -10
echo "Top 10 pages:"
awk '{print $7}' "$LOG" | sort | uniq -c | sort -rn | head -10
```

## Scheduling with cron

```bash
crontab -e
```

```
# min hour day month weekday  command
30 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
*/15 * * * * /home/deploy/disk-check.sh
```

The first runs the backup at 02:30 every day; the second checks disk space every 15 minutes. Use full paths in cron jobs, because cron runs with a minimal environment. The services/cron lesson covers cron in depth.

:::think Your script has `rm -rf $BUILD_DIR/*` and someone runs it where BUILD_DIR isn't set. What happens, and how do you prevent it?
The command becomes `rm -rf /*`, which tries to delete the whole system. Prevent it with `set -u` (error on unset variables), quoting, and a guard: `rm -rf "${BUILD_DIR:?not set}"/*`, which stops the script if the variable is empty.
:::

## Summary

- Scripts start with `#!/bin/bash`, need `chmod +x`, and run with `./script.sh`.
- Variables (`NAME=value`), quotes, `$(command)` and `$((math))` are the basics; `$1`, `$#`, `"$@"` read arguments.
- Exit code 0 = success; `&&`/`||` chain on success/failure.
- `if [ ... ]`, `case`, `for`, `while`, `until` and functions structure logic.
- Write safe scripts: `set -euo pipefail`, quote variables, use shellcheck, keep secrets out; schedule with cron.

```quiz
Q: What is the first line #!/bin/bash called?
A: shebang | the shebang
Q: Which exit code means success?
A: 0 | zero
Q: Which variable holds the number of arguments?
A: $#
Q: Which test checks that a directory exists?
A: -d
Q: Which keyword keeps a variable inside a function?
A: local
Q: Which tool checks shell scripts for common bugs?
A: shellcheck
```
