---
slug: troubleshooting
title: "Fixing common computer problems: a technician's step-by-step troubleshooting guide"
after: KEEP
---
# Fixing common computer problems: a technician's step-by-step troubleshooting guide

Computer problems are inevitable: a PC won't start, Wi-Fi disconnects, the laptop overheats, the screen stays black, programs crash, printers refuse to print. Professional technicians don't guess randomly; they follow a **method**, isolate the cause, fix it and document it. This unit teaches the standard troubleshooting methodology and detailed fixes for the most common hardware and software problems you'll meet in homes, offices, schools and cyber cafés.

:::note What you will learn
- The six-step troubleshooting methodology
- Gathering information and asking good questions
- Power and boot problems (no power, no display, beeps, boot loops)
- Performance problems (slow, freezing, high disk/CPU)
- Blue screens and crashes
- Network and Wi-Fi problems
- Display, audio, keyboard/touchpad and USB problems
- Laptop battery and charging problems
- Using Windows recovery tools
- Documenting and communicating with customers
:::

## The troubleshooting methodology

Used across the IT industry (including CompTIA A+ training):

1. **Identify the problem:** ask questions, reproduce it, note error messages, check recent changes, **back up data** if at risk.
2. **Establish a theory of probable cause:** start with the simple and obvious (power, cables, settings) before complex causes.
3. **Test the theory:** if confirmed, plan the fix; if not, form a new theory or escalate.
4. **Plan and implement the solution:** one change at a time; consider impact (data, downtime).
5. **Verify full functionality** and add preventive measures (updates, cleaning, user advice).
6. **Document** findings, actions and outcomes.

### Questions to ask the user

- What exactly happens? Any error message (photo/screenshot)?
- When did it start? Does it happen all the time or sometimes?
- What changed recently (new software, updates, drops, spills, power outage, moved location)?
- Has anything been tried already?
- Is there important data on the machine? When was the last backup?

## Power and boot problems

### Nothing happens (no lights, no fans)

| Check | Details |
|---|---|
| Power source | Socket works? Try another socket; check extension boards and UPS |
| Cables | Power cable firmly in; desktop PSU switch on (I/O) |
| Laptop | Charger light on? Try another compatible charger; remove battery (if removable) and try on AC only |
| Power button | Front panel connection (desktop) |
| PSU | Test with a PSU tester or known-good PSU (desktop) |
| Static drain | Unplug, hold power 15–30 seconds, try again |

### Powers on (fans/lights) but no display

1. Check the **monitor**: power, input source, brightness, cable (HDMI/VGA/DisplayPort); try another cable/monitor.
2. Desktop with a graphics card: plug the monitor into the **card**, not the motherboard port.
3. Laptop: connect an external monitor; if that works, the screen/cable/backlight may be faulty. Shine a torch on a dim screen: faint image = backlight problem.
4. **Reseat RAM** (remove and firmly reinsert), try one stick at a time.
5. Listen for **beep codes** or watch **diagnostic LEDs**; check the manufacturer's code list.
6. Reset BIOS (remove CMOS battery for a minute, or use the jumper).

### Boots but Windows won't start (boot loops, "Automatic Repair", no boot device)

- **"No bootable device":** check BIOS sees the drive and boot order; the drive may have failed.
- **Automatic Repair loop:** use **Advanced options** in the Windows Recovery Environment (WinRE): Startup Repair, System Restore, Uninstall Updates, Safe Mode.
- **Safe Mode** (via WinRE → Startup Settings) loads minimal drivers to remove a bad driver/program.
- Command Prompt in WinRE: `sfc /scannow` (with the offline options) and `chkdsk` for advanced repairs.
- As a last resort: Reset this PC or reinstall (after backing up data, possibly by removing the drive and connecting it to another PC).

## Performance problems

| Symptom | Diagnose | Fix |
|---|---|---|
| Slow overall | Task Manager → Processes/Performance: CPU, Memory, **Disk at 100%**? | Close/uninstall heavy apps, disable startup apps, malware scan, free space, **upgrade to SSD/RAM** |
| Disk 100% constantly on HDD | Old hard drive struggling | SSD upgrade; check drive health (CrystalDiskInfo) |
| Memory high | Too many tabs/apps, low RAM | Close tabs; add RAM |
| CPU high | A process using lots of CPU (possibly malware) | Identify it; update/uninstall; scan |
| Slow only online | Internet speed/Wi-Fi | Test speed (fast.com); move closer to router; check data plan |
| Gets slower over time | Startup clutter, full drive, outdated system | Maintenance routine (updates, cleanup) |
| Overheating slowdowns | Dust, dried thermal paste | Clean, re-paste, ensure ventilation |

Useful tools: **Task Manager**, **Resource Monitor** (`resmon`), **Storage Sense**, **Windows Security**, **Event Viewer** (logs of errors).

## Blue screens (BSOD) and crashes

1. **Note the stop code** (e.g. `MEMORY_MANAGEMENT`, `CRITICAL_PROCESS_DIED`, `IRQL_NOT_LESS_OR_EQUAL`) and any file named (often a driver `.sys`).
2. **Recent change?** Undo it: uninstall the new driver/program, roll back the driver (Device Manager → Properties → Driver → Roll Back), uninstall a recent update, or use System Restore.
3. **Update drivers** (graphics, chipset, storage) and Windows.
4. **Test RAM:** Windows Memory Diagnostic (`mdsched`), or MemTest86 for thorough tests.
5. **Check the drive:** `chkdsk`, CrystalDiskInfo (SMART health).
6. **System file check:** run Command Prompt as admin: `sfc /scannow`, then `DISM /Online /Cleanup-Image /RestoreHealth`.
7. **Overheating or hardware:** check temperatures, PSU.

## Network and Wi-Fi problems

Work from the device outwards:

1. **Is it one device or all devices?** If all devices fail, the problem is the router/internet line; if one, the device.
2. **Basic checks:** Wi-Fi switched on, airplane mode off, correct network, password, data balance.
3. **Restart** the device and the router (unplug 30 seconds).
4. **Forget and reconnect** the network.
5. **Windows tools:** Settings → Network & internet → **Network troubleshooter**; **Network reset** (reinstalls adapters; you'll need Wi-Fi passwords again).
6. **Command Prompt checks:**

```
ipconfig                 shows your IP address, gateway (router) and DNS
ipconfig /release        releases the current IP address
ipconfig /renew          requests a new one from the router
ipconfig /flushdns       clears cached DNS lookups
ping 192.168.1.1         tests the connection to the router (use your gateway address)
ping 8.8.8.8             tests internet connectivity by IP
ping google.com          tests DNS (name lookups) too
```

| Result | Meaning |
|---|---|
| IP starts with `169.254.x.x` | Device didn't get an address from the router (DHCP problem): restart router, check cable/Wi-Fi |
| Can ping router but not `8.8.8.8` | Problem between router and internet: ISP/line/data |
| Can ping `8.8.8.8` but not `google.com` | DNS problem: flush DNS, try another DNS (e.g. 1.1.1.1 or 8.8.8.8) |

7. **Driver:** update/reinstall the Wi-Fi adapter driver; check it's enabled in Device Manager.
8. **Signal:** move closer, reduce obstacles; consider a better router position or a mesh/extender.

(The Networking subject explains IP addresses, DHCP and DNS fully.)

## Display, audio and input problems

| Problem | Try |
|---|---|
| Screen flickering | Update graphics driver; check refresh rate; check cable; on laptops, possible screen cable issue |
| Wrong resolution/blurry | Settings → Display → recommended resolution and scale |
| External monitor/projector not detected | `Windows+P` to choose Duplicate/Extend; check cable/adapter; Display settings → Detect |
| No sound | Volume/mute; correct output device (sound icon); Sound settings → troubleshooter; driver; check headphones/jack |
| Microphone not working | Privacy & security → Microphone permissions; correct input device; app settings |
| Keyboard keys typing wrong characters | Keyboard layout/language (`Windows+Space` switches layouts) |
| Touchpad not working | Function key toggle (e.g. `Fn+F6`), touchpad settings, driver |
| USB device not recognised | Try another port/cable; Device Manager; update drivers; for flash disks, check Disk Management |

## Laptop battery and charging

| Symptom | Likely cause / action |
|---|---|
| Plugged in, not charging | Adapter fault (test another), damaged cable/port, battery worn, BIOS/battery settings (some limit charging to 80%) |
| Battery drains fast | Old battery (check health: `powercfg /batteryreport` creates a report showing design vs full charge capacity), high brightness, background apps |
| Laptop dies when unplugged | Battery dead: replace with a genuine/quality battery |
| Swollen battery | **Stop using immediately**; replace safely (fire risk) |

## Windows recovery and repair tools

| Tool | Use |
|---|---|
| **Safe Mode** | Troubleshoot with minimal drivers |
| **System Restore** | Undo recent system changes |
| **Startup Repair** | Fix boot problems |
| **Uninstall updates** | Remove a problematic update |
| **sfc /scannow** | Repair system files |
| **DISM** | Repair the Windows image |
| **chkdsk /f** | Check and fix file system errors |
| **Reset this PC** | Reinstall Windows (keep or remove files) |
| **Event Viewer** | Find error logs |
| **Reliability Monitor** | Timeline of crashes and changes (search "reliability history") |

Create a **recovery drive** (search "Create a recovery drive") on a USB in advance.

:::think A customer's laptop shows "Disk 100%" in Task Manager most of the time and takes 10 minutes to start. It has an old hard disk. What's your likely diagnosis and recommendation?
The slow mechanical hard disk is the bottleneck (possibly also failing). Check its health with CrystalDiskInfo; if it's healthy but slow, recommend an **SSD upgrade** (clone the drive or clean install); if it shows errors, back up immediately and replace it. Also clean up startup apps and scan for malware.
:::

## Documenting and communicating

- Keep a simple **job card/log:** customer, device, problem, tests, solution, parts used, time, cost.
- **Explain clearly** to the customer what was wrong and what you did, without jargon.
- **Get approval** before costly repairs or anything risking data.
- **Protect customer data:** don't browse their files; delete any copies you made.
- **Give prevention tips:** updates, backups, cleaning, a UPS.

## Practice tasks

1. Use Task Manager and Resource Monitor to identify what uses most resources on your PC.
2. Run `ipconfig`, then ping your router, `8.8.8.8` and `google.com`, and interpret the results.
3. Generate a battery report (`powercfg /batteryreport`) on a laptop and compare design vs full charge capacity.
4. Create a restore point and a recovery drive.
5. Write a job card for a real or imagined repair using the six-step method.

## Summary

- Follow the methodology: identify (and back up), theorise, test, implement, verify and prevent, document.
- Power issues: check sockets, cables, chargers, PSU, RAM seating, beep codes, BIOS reset.
- Boot issues: boot order, WinRE tools (Startup Repair, System Restore, Safe Mode), sfc/chkdsk.
- Performance: Task Manager diagnosis, cleanup, malware scans, SSD/RAM upgrades, cooling.
- BSODs: stop codes, undo recent changes, drivers, RAM and disk tests, sfc/DISM.
- Network: device vs all devices, restart, ipconfig/ping tests, DNS, drivers, signal.
- Display, audio, input and battery problems have quick checks; swollen batteries must be replaced.
- Communicate clearly and protect customer data.

```quiz
Q: What is the first step of the troubleshooting methodology? (three words: identify the ...)
A: identify the problem | identify
Q: Which command shows a computer's IP address and gateway?
A: ipconfig
Q: An IP address starting with 169.254 usually means what problem? (one word)
A: DHCP
Q: Which command repairs Windows system files? Write it fully.
A: sfc /scannow
Q: Which shortcut switches between duplicate and extend for projectors? Write like Windows+P.
A: Windows+P | Win+P
Q: Which command creates a laptop battery health report? Write it fully.
A: powercfg /batteryreport
Q: Which Windows mode loads minimal drivers for troubleshooting? (two words)
A: Safe Mode
```
