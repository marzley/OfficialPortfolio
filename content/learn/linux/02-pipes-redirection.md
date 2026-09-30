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
```
