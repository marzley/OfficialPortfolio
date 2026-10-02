---
slug: troubleshooting
title: "Network troubleshooting: a proven method, the essential commands and 12 real fault scenarios"
after: KEEP
---
# Network troubleshooting: a proven method, the essential commands and 12 real fault scenarios

"The internet is not working" is the most common sentence an IT person hears. Good troubleshooters don't guess or randomly restart things: they follow a **method**, gather facts with a few key **commands**, narrow down the layer where the fault lives, fix it, and document it. This skill is what employers test in interviews and what makes you valuable at a helpdesk, an ISP NOC or as a freelance technician.

:::note What you will learn
- A structured troubleshooting method (CompTIA's 7 steps)
- Asking the right questions first
- Bottom-up, top-down and divide-and-conquer approaches
- The core commands: ipconfig/ip, ping, tracert/traceroute, nslookup/dig, arp, netstat/ss, pathping/mtr
- Reading command output to locate the fault
- 12 real scenarios with step-by-step solutions
- Documentation and escalation
:::

## The 7-step method

1. **Identify the problem**: gather information, question users, find symptoms, ask what changed, reproduce it.
2. **Establish a theory of probable cause**: start with the obvious; consider multiple causes.
3. **Test the theory**: if confirmed, plan the fix; if not, form a new theory or escalate.
4. **Plan the fix**, considering impact (don't reboot the core switch at 10 a.m. on payday).
5. **Implement the solution** or escalate.
6. **Verify full functionality**, and add preventive measures.
7. **Document** findings, actions and outcome.

## Questions to ask first

- **Who** is affected? One user, one department, everyone?
- **What** exactly fails? All websites, one system, email only, printing?
- **When** did it start? Is it constant or intermittent?
- **What changed?** New device, software update, cable moved, power outage, new router, ISP work?
- **Where?** Wired or Wi-Fi? Which floor/branch?

"Everyone on the second floor since this morning" points to a switch or VLAN; "only my laptop" points to the device.

## Approaches

| Approach | When |
|---|---|
| **Bottom-up** (layer 1 → 7) | Unclear problems; start with cables and lights |
| **Top-down** (layer 7 → 1) | Application-specific issues ("only the accounting system fails") |
| **Divide and conquer** (start with `ping`) | Fast: if ping works, layers 1–3 are fine; look up. If not, look down |
| **Follow the path** | Trace from the client through switch, router, firewall to the server |
| **Swap components** | Try a known-good cable, port, laptop |

## The essential commands

### ipconfig / ip: what are my settings?

```bash
ipconfig /all            # Windows: IP, mask, gateway, DNS, DHCP server, MAC, lease
ip a ; ip r              # Linux: addresses and routes
```

Look for: a valid IP in the right subnet, a gateway, DNS servers. **169.254.x.x** = DHCP failed. **Media disconnected** = layer 1.

### ping: can I reach it?

```bash
ping 127.0.0.1           # my own TCP/IP stack works
ping 192.168.1.1         # my gateway (LAN works)
ping 8.8.8.8             # the internet by IP (routing/ISP works)
ping google.com          # name resolution works
ping -t 192.168.1.1      # Windows: continuous (Ctrl+C to stop); Linux pings continuously by default
```

Results: **Reply** (good; check the time in ms), **Request timed out** (no reply: down, blocked by firewall, or no route back), **Destination host unreachable** (a router or your PC has no path), **Could not find host** (DNS).

Note: many servers and firewalls block ping, so "no reply" doesn't always mean "down".

### tracert / traceroute: where does it stop?

```bash
tracert google.com        # Windows
traceroute google.com     # Linux/macOS
pathping google.com       # Windows: path + loss per hop
mtr google.com            # Linux: live traceroute with loss statistics
```

Each line is a router (hop). Asterisks `* * *` at one hop may just be a router that doesn't reply; asterisks from some hop onward to the end show where traffic stops. Sudden big jumps in time show slow links (e.g. an international hop).

### nslookup / dig: does DNS work?

```bash
nslookup google.com
nslookup google.com 1.1.1.1     # compare with another resolver
dig google.com +short
```

### arp, netstat/ss, and others

```bash
arp -a                       # IP-to-MAC table: is the gateway's MAC present?
netstat -ano                 # Windows connections and PIDs
ss -tulpn                    # Linux listening ports
Test-NetConnection server -Port 443    # Windows: is a TCP port reachable?
nc -zv server 443            # Linux/macOS port test
ipconfig /release ; ipconfig /renew    # get a new DHCP lease
ipconfig /flushdns           # clear DNS cache
netsh winsock reset          # Windows: reset network stack (then reboot)
```

### A quick diagnostic sequence

```
1. ipconfig /all       → valid IP? gateway? DNS?
2. ping gateway        → LAN OK?
3. ping 8.8.8.8        → internet routing OK?
4. nslookup google.com → DNS OK?
5. tracert 8.8.8.8     → where does it stop?
```

```try-python
# Interpret the quick diagnostic results like a technician
def diagnose(has_ip, ip_is_apipa, gw_ping, internet_ping, dns_ok):
    if not has_ip: return "Layer 1/2: cable, Wi-Fi or adapter problem"
    if ip_is_apipa: return "DHCP failed: check cable/VLAN/DHCP server"
    if not gw_ping: return "Can't reach gateway: local network, wrong subnet or switch/VLAN issue"
    if not internet_ping: return "Gateway OK but no internet: router WAN, NAT, default route or ISP"
    if not dns_ok: return "Internet by IP works: DNS problem"
    return "Network OK: check the application, browser, proxy or the remote server"

print(diagnose(True, True, False, False, False))
print(diagnose(True, False, True, False, False))
print(diagnose(True, False, True, True, False))
print(diagnose(True, False, True, True, True))
```

## 12 real scenarios

| # | Symptom | Investigation | Cause and fix |
|---|---|---|---|
| 1 | One PC: "No internet", network icon shows a cross | `ipconfig`: media disconnected | Cable unplugged/damaged or bad port; reseat/replace, try another port |
| 2 | PC has 169.254.x.x | Cable OK, other PCs fine | Port in the wrong VLAN, or DHCP relay missing; fix switch port VLAN |
| 3 | Whole office has 169.254 addresses | All devices | DHCP server/router down, or scope exhausted; restart service, enlarge pool, shorten leases |
| 4 | Pings 8.8.8.8 OK but websites fail | `nslookup` fails | DNS server wrong/down; set working DNS, flush cache |
| 5 | Can reach LAN printer, not the internet | `ipconfig`: no gateway | Static IP without gateway, or wrong gateway; correct it |
| 6 | Internet very slow for everyone at 10 a.m. | Router stats show line full | Large downloads/updates/backups or a virus; QoS, schedule updates, find the top talker |
| 7 | Users get addresses like 192.168.0.x instead of 10.1.x.x | `ipconfig /all` shows unknown DHCP server | Rogue DHCP (someone plugged in a home router); remove it, enable DHCP snooping |
| 8 | "IP address conflict" popups | Two devices same IP | Static device inside DHCP pool; use reservations/exclusions |
| 9 | Network freezes after someone "tidied cables" | Switch lights flashing wildly | Loop (cable connecting two ports) on switches without STP; remove loop, enable STP/BPDU guard |
| 10 | Website down for outside users only | Works internally by IP | Firewall/port forward, public DNS record, or certificate issue; check from outside with curl |
| 11 | Wi-Fi drops in one classroom | Signal −80 dBm | Poor coverage; add/relocate AP, adjust channels |
| 12 | Branch can't reach HQ server, internet fine | `tracert` stops at branch router | VPN tunnel down or missing route; check VPN status and routes on both ends |

## Documentation and escalation

Record every incident: date, users affected, symptoms, tests run (with results), root cause, fix, time to resolve. A ticketing system or even a shared spreadsheet works. Good documentation:
- Speeds up the next similar fault
- Reveals patterns (the same switch failing monthly)
- Protects you (proof of what was done)

**Escalate** when the fault is outside your access or skill (ISP line, core equipment, security incident), with your test results attached: "Branch line down since 9:05; router WAN shows no carrier; power and cables checked; ISP ticket needed".

:::think Users report that the school's student portal (an internal web server at 10.20.50.10) is down, but internet browsing works. What would you check, in order?
1) Ping 10.20.50.10 from a user PC and from the same VLAN as the server (is the server up, is routing/firewall between VLANs OK?). 2) If ping works, test the port (`Test-NetConnection 10.20.50.10 -Port 443`). 3) On the server, check the web service status and logs, disk space and recent changes. 4) If accessed by name, check the DNS record (`nslookup portal.school.local`). Fix, verify with users, document.
:::

## Summary

- Follow a method: identify, theorise, test, plan, implement, verify, document.
- Ask who/what/when/what changed/where before touching anything.
- Use bottom-up, top-down or divide-and-conquer (start with ping).
- Core commands: ipconfig/ip, ping, tracert/traceroute, nslookup/dig, arp, netstat/ss, Test-NetConnection.
- Recognise common faults: APIPA, missing gateway, DNS failure, rogue DHCP, IP conflicts, loops, saturation; document and escalate with evidence.

```quiz
Q: Which Windows command shows your IP address, gateway and DNS servers in full?
A: ipconfig /all
Q: Ping to 8.8.8.8 works but ping to google.com fails. What is the likely problem?
A: DNS | dns problem
Q: Which command shows the route (hops) to a destination on Windows?
A: tracert | tracert google.com
Q: Which Windows command clears the DNS cache?
A: ipconfig /flushdns
Q: Which address do you ping to test the network software on your own computer?
A: 127.0.0.1 | localhost
Q: Which Linux command shows listening ports and the programs using them?
A: ss -tulpn | ss | netstat -tulpn
Q: What is the final step of the troubleshooting method?
A: document | documentation | document findings
```
