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
```
