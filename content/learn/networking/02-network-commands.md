---
slug: network-commands
title: Essential network commands: ipconfig, ping, tracert, nslookup
after: troubleshooting
---
# Essential network commands

When the network misbehaves, these commands tell you exactly what's wrong. They're built into Windows, macOS and Linux: open **Command Prompt** (Windows: press Win, type `cmd`) or **Terminal**.

## 1. See your own settings: ipconfig / ip

**Windows**

```
ipconfig
ipconfig /all
```

**Linux / macOS**

```
ip addr        (Linux)
ifconfig       (macOS / older Linux)
```

Look for:

| Field | Example | Meaning |
|---|---|---|
| IPv4 Address | 192.168.1.23 | Your device's address |
| Subnet Mask | 255.255.255.0 | Your network size (/24) |
| Default Gateway | 192.168.1.1 | Your router |
| DNS Servers | 8.8.8.8 | Who turns names into IPs |
| Physical Address | 3C-52-82-1A-4F-9E | Your MAC address |

> If your IPv4 address starts with **169.254**, your device did **not** get an address from DHCP. Check the cable, Wi-Fi or router.

Useful fixes on Windows:

```
ipconfig /release
ipconfig /renew       (ask DHCP for a new address)
ipconfig /flushdns    (clear old DNS answers)
```

## 2. Can I reach it? ping

```
ping 192.168.1.1
ping google.com
ping -n 10 8.8.8.8      (Windows: 10 pings)
ping -c 10 8.8.8.8      (Linux/macOS)
```

Sample reply:

```
Reply from 8.8.8.8: bytes=32 time=38ms TTL=117
```

- **time**: the round trip in milliseconds. Under 50 ms is great; over 200 ms feels slow.
- **Request timed out**: no reply (the device is off, unreachable, or blocks ping).
- Some **lost packets** means an unstable connection (weak Wi-Fi, bad cable).

### The classic troubleshooting ladder

1. `ping 127.0.0.1` : is my network card/software OK?
2. `ping <my IP>` : is my address set up?
3. `ping <gateway>` : can I reach the router? (If not: cable/Wi-Fi/LAN problem.)
4. `ping 8.8.8.8` : can I reach the internet by IP? (If not: router/ISP problem.)
5. `ping google.com` : does DNS work? (If 4 works but 5 fails: **DNS problem**.)

## 3. Where does it break? tracert / traceroute

```
tracert google.com       (Windows)
traceroute google.com    (Linux/macOS)
```

It lists every router ("hop") on the way. If the list stops at hop 2, the problem is near you or your ISP; if it goes far and then stops, it's further away.

## 4. Is DNS working? nslookup / dig

```
nslookup marzleytechsolutions.co.ke
nslookup marzleytechsolutions.co.ke 8.8.8.8     (ask Google's DNS instead)
dig marzleytechsolutions.co.ke                   (Linux/macOS, more detail)
```

Use it after changing domain records to see if they've updated.

## 5. Who is talking? netstat / ss

```
netstat -an           (Windows/macOS: all connections and listening ports)
netstat -ano          (Windows: with process IDs)
ss -tulpn             (Linux: listening ports and programs)
```

Great for "is my web server actually listening on port 80?"

## 6. Others worth knowing

| Command | Use |
|---|---|
| `arp -a` | Devices your computer has talked to on the LAN (IP ↔ MAC) |
| `hostname` | Your computer's name |
| `getmac` | MAC addresses (Windows) |
| `pathping google.com` | ping + tracert combined (Windows) |
| `curl -I https://example.com` | Check a website's response headers |
| `Test-NetConnection example.com -Port 443` | PowerShell: is a port open? |

## Practice scenario

A user says "the internet is not working". You run:

- `ipconfig` shows `169.254.10.4` → no DHCP. Check the cable/Wi-Fi and router.
- Address is fine, `ping 192.168.1.1` works, `ping 8.8.8.8` fails → the router or ISP line is down. Restart the router, check the ISP.
- `ping 8.8.8.8` works, `ping google.com` fails → DNS. Set DNS to 8.8.8.8 / 1.1.1.1 or run `ipconfig /flushdns`.

## Why network commands matter

"The internet is down" can mean many different problems: a loose cable, Wi-Fi with no internet, an expired data bundle, a DNS failure, a router fault, a blocked website or a problem at the ISP. Network commands let you find **where** the problem is in minutes instead of guessing, and give you facts to report to the ISP or your manager. Help desk staff, ICT officers, network engineers and developers use them every day.

## A systematic troubleshooting approach (bottom-up)

| Step | Check | Command / action |
|---|---|---|
| 1. Physical | Cable plugged in? Wi-Fi connected? Lights on the router? | Look; reconnect |
| 2. IP address | Did the device get a valid address? | `ipconfig` / `ip a` |
| 3. Local network | Can you reach the router (gateway)? | `ping 192.168.1.1` (your gateway) |
| 4. Internet | Can you reach an outside IP? | `ping 8.8.8.8` |
| 5. DNS | Do names resolve? | `nslookup google.com` |
| 6. Application | Does the website or app itself work? | Try another site, browser or device |

Stop at the first step that fails: that's where the problem is.

## Reading ipconfig /all

```
Windows IP Configuration
   IPv4 Address. . . . . . . . . . . : 192.168.1.23
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.1
   Lease Obtained. . . . . . . . . . : ...
   Physical Address. . . . . . . . . : 3C-52-82-1A-9F-04
```

| Clue | Meaning |
|---|---|
| Address starts with `169.254.` | DHCP failed: the device gave itself an address. Check cable/Wi-Fi and router DHCP |
| No default gateway | Can't reach other networks |
| Gateway in a different subnet | Misconfigured static IP |
| Unexpected DNS server | Could be misconfiguration or malware changing settings |

## Fixing common address problems

```
ipconfig /release        # give up the current DHCP address
ipconfig /renew          # ask for a new one
ipconfig /flushdns       # clear cached DNS answers (fixes some "site not found" issues)
netsh winsock reset      # reset network stack (admin; restart afterwards)
```

Linux: `sudo dhclient -r && sudo dhclient` or restart NetworkManager; flush DNS cache with `resolvectl flush-caches` on systemd-resolved systems.

## Understanding ping results

```
Reply from 8.8.8.8: bytes=32 time=24ms TTL=117
Request timed out.
Destination host unreachable.
```

| Result | Likely meaning |
|---|---|
| Replies with low time (under ~50 ms locally) | Connection OK |
| High or very variable times | Congestion, weak Wi-Fi, overloaded link |
| Some "Request timed out" | Packet loss: unstable connection |
| All time out | No route, device off, or ICMP blocked by a firewall |
| "Destination host unreachable" from your own IP | Your device has no route (no gateway or link down) |

Some servers block ping on purpose, so a failed ping isn't always proof the server is down. Try opening the service (e.g. the website) too.

```
ping -n 20 8.8.8.8       # Windows: 20 pings to measure packet loss
ping -c 20 8.8.8.8       # Linux/macOS
ping -t 8.8.8.8          # Windows: continuous (Ctrl+C to stop), useful while testing cables
```

## traceroute: finding where delay starts

```
tracert google.com       # Windows
traceroute google.com    # Linux/macOS
mtr google.com           # Linux: live traceroute + ping statistics combined
```

Each line is a router ("hop"). If delays jump at hop 2 or 3 (your ISP's network), the problem is likely with the ISP; at hop 1, it's your local router or Wi-Fi. Asterisks (`* * *`) on a hop often just mean that router doesn't reply to traceroute.

## DNS tools in depth

```
nslookup marzleytechsolutions.co.ke            # ask your default DNS server
nslookup example.co.ke 8.8.8.8                 # ask Google DNS directly (compare answers)
nslookup -type=mx example.co.ke                # mail servers for a domain
dig example.co.ke +short                       # Linux/macOS: concise answer
dig example.co.ke MX
dig example.co.ke TXT                          # SPF/verification records
```

| Record | Purpose |
|---|---|
| A / AAAA | Domain → IPv4 / IPv6 address |
| CNAME | Alias to another name |
| MX | Mail servers |
| TXT | Verification, SPF, DKIM, DMARC for email |
| NS | Which name servers are authoritative |

When a new website "doesn't work" after changing hosting, comparing DNS answers from different servers shows whether the change has propagated.

## Ports and connections

```
netstat -ano | findstr :443          # Windows: who uses port 443 (PID in the last column)
ss -tulpn                            # Linux: listening ports and the programs using them
Test-NetConnection example.co.ke -Port 443    # PowerShell: is a port reachable?
curl -I https://example.co.ke        # fetch only headers: status code, server, redirects
```

`curl -I` quickly shows if a site returns `200 OK`, a redirect (`301`) or an error (`500`).

## Speed and Wi-Fi checks

- Run a speed test (e.g. speedtest.net or fast.com) on cable and on Wi-Fi to compare.
- `netsh wlan show interfaces` (Windows) shows Wi-Fi signal %, channel and link speed.
- Test at different times: evening slowdowns often mean ISP congestion.

## Writing a useful fault report for an ISP

> Since 9:00 am, all devices on our network lose internet. Router lights normal. `ping 192.168.1.1` OK (2 ms). `ping 8.8.8.8`: 40% packet loss, times 300–900 ms. `tracert` shows delays starting at hop 2 (your gateway 41.x.x.x). Speed test: 2 Mbps on a 40 Mbps plan. Account number: ...

Clear facts get faster, more useful support.

## Practice

1. Run `ipconfig /all` (or `ip a`) and identify your IP, gateway, DNS and MAC address.
2. Ping your gateway, 8.8.8.8 and google.com 20 times each and compare times and packet loss.
3. Run a traceroute to a Kenyan website and to an international one; compare hop counts and times.
4. Look up the MX and TXT records of a domain you know.
5. Use `curl -I` on three websites and note their status codes and redirects.

:::think A user can open websites by IP address but not by name, and other users on the same network are fine. What would you check?
This points to a DNS problem on that one device: check its DNS settings in `ipconfig /all` (a wrong static DNS server, VPN or malware changes), flush the DNS cache (`ipconfig /flushdns`), test with `nslookup google.com 8.8.8.8`, and check the hosts file for unexpected entries.
:::

```quiz
Q: Which Windows command shows your IP address, gateway and DNS?
A: ipconfig | ipconfig /all
Q: Your address starts with 169.254. What service failed to give you an address?
A: DHCP
Q: ping 8.8.8.8 works but ping google.com fails. What is the problem?
A: DNS
Q: Which command lists every router on the way to a website on Windows?
A: tracert
Q: Which command asks DNS for a domain's IP address?
A: nslookup | dig
Q: Which Windows command clears the local DNS cache?
A: ipconfig /flushdns
Q: Which DNS record type lists a domain's mail servers?
A: MX
Q: Which Linux command shows listening ports and the programs using them? (two letters plus options allowed)
A: ss | ss -tulpn | netstat
Q: What is the first device you should ping to test the local network? (two words)
A: default gateway | gateway | router
```
