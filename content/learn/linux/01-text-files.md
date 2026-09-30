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
```
