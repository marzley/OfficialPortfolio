---
slug: processes-packages
title: "Processes and installing software: ps, top, kill, jobs, apt, snap and keeping a system updated"
after: KEEP
---
# Processes and installing software: ps, top, kill, jobs, apt, snap and keeping a system updated

Every running program on Linux is a **process**: your web server, the database, your SSH session, even the `ls` command while it runs. Administrators constantly check what's running, what's using the CPU and memory, and stop programs that misbehave. They also install, update and remove software using **package managers**, which download trusted software and handle dependencies automatically.

:::note What you will learn
- What processes, PIDs and parent processes are
- Listing processes with ps, top and htop
- Reading CPU, memory and load average
- Stopping processes: kill, killall, pkill and signals
- Foreground and background jobs, nohup
- Package managers: apt (Ubuntu/Debian), dnf (Fedora/RHEL), snap
- Installing, updating, removing and searching for software
- Repositories, PPAs and installing .deb files safely
- Keeping a server patched
:::

## Processes and PIDs

Each process has a **PID** (process ID), an owner, and a **parent** process (PPID) that started it. The first process at boot is PID 1 (`systemd` on modern distros), the ancestor of everything else.

```bash
ps                 # processes in this terminal
ps aux             # all processes on the system
ps aux | grep nginx    # find a specific program
pgrep -a python    # PIDs and command lines matching "python"
pstree             # processes as a tree
```

`ps aux` columns:

| Column | Meaning |
|---|---|
| USER | Owner |
| PID | Process ID |
| %CPU / %MEM | Share of CPU and memory |
| VSZ / RSS | Virtual / actual memory used |
| STAT | State: R running, S sleeping, Z zombie, T stopped |
| COMMAND | The program and its arguments |

## Live monitoring: top and htop

```bash
top          # q to quit, P sort by CPU, M sort by memory, k to kill
sudo apt install htop
htop         # colourful, scrollable, easier (F9 kill, F6 sort)
```

The top lines show:
- **Load average** (e.g. `0.45, 0.60, 0.70`): average number of processes wanting CPU over 1, 5 and 15 minutes. Compare with the number of CPU cores (`nproc`): consistently above it means the system is overloaded.
- **Memory and swap**: if swap usage keeps growing, the server needs more RAM or a process is leaking memory.

Other quick checks:

```bash
free -h       # memory
uptime        # how long running + load average
nproc         # number of CPU cores
```

## Stopping processes: signals

`kill` sends a **signal** to a process:

| Signal | Number | Meaning |
|---|---|---|
| SIGTERM | 15 | "Please stop" (default): the program can clean up |
| SIGKILL | 9 | Force stop immediately (can't be ignored; no clean-up) |
| SIGHUP | 1 | Hang up; many servers reload their configuration on it |
| SIGINT | 2 | Interrupt (what Ctrl+C sends) |

```bash
kill 4321            # polite stop (SIGTERM)
kill -9 4321         # force (use only if SIGTERM doesn't work)
pkill -f "python app.py"   # by matching the command line
killall firefox      # all processes with that name
```

Always try plain `kill` first; `-9` can leave temporary files or corrupt data.

## Foreground and background jobs

```bash
python3 long_task.py        # runs in the foreground; the terminal waits
# press Ctrl+Z to pause it
bg                          # continue it in the background
jobs                        # list background jobs
fg %1                       # bring job 1 back to the foreground
python3 long_task.py &      # start directly in the background
```

Background jobs stop when you log out. To keep something running after you disconnect from a server:

```bash
nohup python3 long_task.py > task.log 2>&1 &
```

Better options for long-running work: `tmux` or `screen` (terminal sessions you can detach from and reattach later), or a proper **systemd service** (see the services lesson).

## Process priority

```bash
nice -n 10 ./backup.sh      # start with lower priority (higher nice = nicer to others)
sudo renice -n 5 -p 4321    # change priority of a running process
```

## Package managers

A **package manager** installs software from trusted **repositories**, verifies it, and installs any **dependencies** (other packages it needs).

| Distro family | Tool | Package format |
|---|---|---|
| Ubuntu, Debian, Mint, Kali | `apt` | `.deb` |
| Fedora, RHEL, Rocky, AlmaLinux | `dnf` | `.rpm` |
| Arch | `pacman` | |
| Alpine | `apk` | |
| Cross-distro | `snap`, `flatpak` | sandboxed apps |

## Using apt (Ubuntu/Debian)

```bash
sudo apt update                 # refresh the list of available packages (do this first)
sudo apt upgrade                # install updates for everything
sudo apt install nginx          # install
sudo apt install git curl unzip # several at once
sudo apt remove nginx           # remove (keeps config files)
sudo apt purge nginx            # remove including config
sudo apt autoremove             # remove dependencies no longer needed
apt search image editor         # search
apt show nginx                  # details: version, size, description
apt list --installed | grep php # what's installed
```

`apt update` only refreshes the catalogue; `apt upgrade` actually updates software. A common beginner mistake is to run `install` without `update` on a fresh server and get "package not found".

## dnf (Fedora/RHEL) in brief

```bash
sudo dnf check-update
sudo dnf upgrade
sudo dnf install nginx
sudo dnf remove nginx
dnf search nginx
```

## Snap and flatpak

```bash
sudo snap install code --classic   # VS Code
snap list
sudo snap refresh
```

Snaps bundle their dependencies and update automatically; they're convenient for desktop apps.

## Other ways to install software (and the risks)

| Method | Example | Caution |
|---|---|---|
| A `.deb` file | `sudo apt install ./package.deb` | Only from the official vendor site |
| Vendor repository | Adding Docker's or Node's official repo | Follow the vendor's official instructions |
| PPA (Ubuntu) | `sudo add-apt-repository ppa:...` | Third-party; trust matters |
| Language package managers | `pip`, `npm`, `composer` | Use virtual environments/project folders |
| Piping a downloaded script into bash | Install scripts | Read the script first; you're running it as you (or root) |

## Keeping servers patched

Unpatched software is one of the main ways servers get hacked.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   # enable automatic security updates
cat /var/run/reboot-required 2>/dev/null                    # does a kernel update need a reboot?
```

Plan reboots for quiet hours (e.g. late night in Kenya for local-audience sites), and test major upgrades on a staging server first.

:::think A server feels very slow. `uptime` shows a load average of 7.8 on a 2-core machine, and `top` shows a `php` process at 190% CPU. What steps would you take?
Note its PID and investigate (which site/script, recent changes, logs). If it's stuck or runaway, stop it with `kill PID`, then `kill -9` only if needed. Fix the cause (a bad script, a loop, a bot attack, missing cache) and consider limits or more CPU. Load 7.8 on 2 cores means heavy overload.
:::

## Summary

- Every running program is a process with a PID and parent; PID 1 is systemd.
- `ps aux`, `pgrep`, `top`/`htop`, `free -h` and `uptime` show what's running and resource use; compare load with `nproc`.
- `kill` sends signals: TERM (15) to stop politely, KILL (9) to force.
- Ctrl+Z, `bg`, `fg`, `&` and `nohup`/`tmux` manage jobs.
- `apt update` then `apt install/upgrade/remove`; dnf on Fedora/RHEL; snap for apps; keep servers patched with unattended-upgrades.

```quiz
Q: What is a running program's unique number called? (abbreviation)
A: PID | process ID
Q: Which signal number forcefully kills a process?
A: 9 | SIGKILL
Q: Which apt command refreshes the list of available packages? (three words)
A: sudo apt update | apt update
Q: Which command lists all processes on the system? (two words)
A: ps aux | ps -ef
Q: Which key combination pauses a foreground process?
A: Ctrl+Z | ctrl z
Q: Which package manager does Fedora use?
A: dnf
```
