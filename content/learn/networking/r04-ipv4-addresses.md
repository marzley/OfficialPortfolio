---
slug: ipv4-addresses
title: "IPv4 addresses: structure, network and host parts, classes, private and public ranges, special addresses"
after: KEEP
---
# IPv4 addresses: structure, network and host parts, classes, private and public ranges, special addresses

Every device that talks on an IP network needs an **IP address**, just as every house needs a postal address for letters to reach it. When you send a WhatsApp message, stream a video or pay with M-Pesa, the data is packed into **packets** stamped with a source IP address and a destination IP address, and routers across the internet read those addresses to deliver them.

**IPv4** (Internet Protocol version 4) is the addressing system most networks still use daily. This unit explains how an IPv4 address is built, how to read it, which ranges are private or public, and the special addresses every technician must recognise on sight.

:::note What you will learn
- The structure of an IPv4 address (32 bits, 4 octets, dotted decimal)
- Network part vs host part
- How many IPv4 addresses exist, and why they ran out
- The old class system (A, B, C, D, E) and default masks
- Private (RFC 1918) vs public addresses, and NAT
- Special addresses: loopback, APIPA, broadcast, 0.0.0.0, CGNAT, documentation ranges
- Unicast, broadcast and multicast
- Static vs dynamic addressing
- Finding your own IP address on any device
:::

## Structure

An IPv4 address is **32 bits**, written as four **octets** (8 bits each) in decimal, separated by dots: **dotted-decimal notation**.

```
192     .168     .1       .25
11000000.10101000.00000001.00011001
```

Each octet ranges from **0 to 255** (8 bits). So `192.168.1.256` or `10.300.1.1` are **invalid** addresses.

Total possible IPv4 addresses: 2³² = **4,294,967,296** (about 4.3 billion). That seemed huge in the 1980s, but with billions of phones, computers and IoT devices, the free pool ran out: the global registry (IANA) handed out its last blocks in 2011, and the African registry **AFRINIC** has been rationing its remaining space since. That's why we use private addresses with NAT, and why **IPv6** exists.

## Network part and host part

Every IPv4 address has two parts:

| Part | Meaning | Postal analogy |
|---|---|---|
| **Network part** | Which network the device is on | The street name |
| **Host part** | Which device on that network | The house number |

Devices with the **same network part** are on the same local network and talk directly (through a switch). To reach a device with a **different** network part, traffic must go through a **router** (the default gateway).

The **subnet mask** or **prefix** tells you where the split is:

| Address | Prefix | Network part | Host part |
|---|---|---|---|
| 192.168.1.25 | /24 | 192.168.1 | .25 |
| 10.5.20.7 | /16 | 10.5 | .20.7 |
| 172.16.40.3 | /8 | 172 | .16.40.3 |

The next lessons teach masks and prefixes in full.

## Address classes (the old system)

Before 1993, addresses were divided into fixed **classes**. Modern networks use CIDR instead, but classes still appear in exams, default settings and conversations ("a class C network").

| Class | First octet | First bits | Default mask | Prefix | Hosts per network |
|---|---|---|---|---|---|
| **A** | 1–126 | 0 | 255.0.0.0 | /8 | 16,777,214 |
| **B** | 128–191 | 10 | 255.255.0.0 | /16 | 65,534 |
| **C** | 192–223 | 110 | 255.255.255.0 | /24 | 254 |
| **D** | 224–239 | 1110 | — | — | Multicast groups |
| **E** | 240–255 | 1111 | — | — | Reserved / experimental |

127.x.x.x is technically in the class A range but reserved for **loopback**.

The class system wasted addresses: an organisation needing 300 hosts got a class B (65,534 addresses), wasting over 65,000. CIDR (1993) fixed this by allowing any prefix length.

```try-python
def ip_class(ip):
    first = int(ip.split(".")[0])
    if first == 127: return "Loopback"
    if 1 <= first <= 126: return "A"
    if 128 <= first <= 191: return "B"
    if 192 <= first <= 223: return "C"
    if 224 <= first <= 239: return "D (multicast)"
    if 240 <= first <= 255: return "E (reserved)"
    return "Invalid/special"

for ip in ["10.0.0.1", "172.20.5.9", "192.168.1.25", "224.0.0.5", "127.0.0.1", "41.90.64.10"]:
    print(ip, "-> class", ip_class(ip))
```

## Private vs public addresses

**Public addresses** are unique on the whole internet and are assigned by registries (AFRINIC for Africa) to ISPs and organisations. **Private addresses** (defined in RFC 1918) can be reused inside any home or office, because routers on the internet **don't route** them.

| Range | CIDR block | Addresses | Typical use |
|---|---|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | 16.7 million | Large companies, ISPs, cloud networks |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | 1 million | Medium networks, Docker |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | 65,536 | Homes and small offices |

Your home router gives your devices private addresses like `192.168.100.x` and uses **NAT** (Network Address Translation) to share the single **public** address your ISP gave it. Every packet leaving your home appears to come from that public address. The NAT lesson explains how.

:::warning Watch the 172 range
Only **172.16 to 172.31** is private. 172.15.x.x and 172.32.x.x and above are public. This is a favourite exam trick.
:::

```try-python
import ipaddress
for ip in ["192.168.100.5", "10.20.30.40", "172.20.5.9", "172.40.5.9", "41.90.64.10", "8.8.8.8"]:
    a = ipaddress.ip_address(ip)
    print(f"{ip:15} private={a.is_private}")
```

## Special addresses to recognise

| Address | Meaning | When you see it |
|---|---|---|
| **127.0.0.1** (127.0.0.0/8) | Loopback: "this computer" | Testing local services, e.g. `http://127.0.0.1:8000` |
| **169.254.x.x** | APIPA / link-local: self-assigned | The device **couldn't reach a DHCP server**; a classic fault sign |
| **0.0.0.0** | "This network / any address" | Default route `0.0.0.0/0`; a server listening on all interfaces |
| **255.255.255.255** | Limited broadcast to everyone on the local network | DHCP discovery |
| **100.64.0.0/10** | Carrier-grade NAT (CGNAT) | Mobile and some fixed ISPs share one public IP among many customers |
| **192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24** | Documentation examples | Tutorials and books (like this one) |
| **224.0.0.0/4** | Multicast | IPTV, routing protocols (OSPF uses 224.0.0.5 and 224.0.0.6) |

If your router's WAN address is in 100.64–100.127, your ISP uses CGNAT, which is why hosting a server or CCTV remote access at home may not work without help from the ISP.

## Unicast, broadcast, multicast

| Type | Who receives | Example |
|---|---|---|
| **Unicast** | One specific device | Loading a web page |
| **Broadcast** | All devices on the local network | DHCP discover, ARP request |
| **Multicast** | Devices that joined a group | IPTV channels, OSPF updates |
| **Anycast** | The nearest of several servers sharing an address | Public DNS like 8.8.8.8 and 1.1.1.1 |

Routers **don't forward broadcasts** between networks, which keeps broadcast "noise" contained. That's one reason large networks are split into subnets and VLANs.

## Static vs dynamic addresses

| | Static | Dynamic (DHCP) |
|---|---|---|
| How | Typed in manually | Assigned automatically by a DHCP server |
| Use for | Servers, printers, routers, CCTV recorders, access points | Laptops, phones, guest devices |
| Risk | Typos and duplicate addresses | Address may change (use reservations for fixed ones) |

A device needs four settings to work on a network: **IP address, subnet mask, default gateway, and DNS server(s)**. DHCP hands out all four.

## Find your IP address

| Device | How |
|---|---|
| Windows | `ipconfig` (or `ipconfig /all` for gateway, DNS, MAC) |
| Linux | `ip a` and `ip r` |
| macOS | `ifconfig` or System Settings → Network |
| Android | Settings → Wi-Fi → tap the network → Advanced/IP address |
| iPhone | Settings → Wi-Fi → (i) next to the network |
| Your public IP | Search "what is my IP" or visit a site like ifconfig.me |

Your private IP (e.g. 192.168.100.23) and your public IP (e.g. 41.90.x.x) are different: one is inside your home, the other is what the internet sees.

:::think A school lab PC shows IP 169.254.88.12, mask 255.255.0.0, and no default gateway. Other PCs work fine. What does this tell you, and what would you check?
The PC failed to get an address from DHCP, so it self-assigned an APIPA address. Check the cable and switch port (layer 1), that the port is in the right VLAN, then run `ipconfig /release` and `ipconfig /renew`. If others work, the DHCP server is probably fine; the problem is between this PC and the network.
:::

## Summary

- IPv4 addresses are 32 bits written as four 0–255 octets; about 4.3 billion exist and they've run out.
- Each address has a network part and a host part; the mask/prefix sets the split.
- Classes A (1–126), B (128–191), C (192–223), D multicast, E reserved; CIDR replaced them.
- Private ranges: 10/8, 172.16/12, 192.168/16; NAT shares a public address.
- Recognise 127.0.0.1 loopback, 169.254 APIPA (DHCP failure), 0.0.0.0, 255.255.255.255, 100.64/10 CGNAT.
- Devices need IP, mask, gateway and DNS: set statically or by DHCP.

```quiz
Q: How many bits long is an IPv4 address?
A: 32 | 32 bits
Q: Which class is the address 172.20.5.9 (A, B or C)?
A: B | class b
Q: Is 172.20.5.9 private or public?
A: private
Q: Is 172.40.5.9 private or public?
A: public
H: The private 172 range is only 172.16 to 172.31.
Q: A laptop shows the address 169.254.33.10. What service did it fail to reach?
A: DHCP | dhcp server
Q: What is the default prefix of a Class C network?
A: /24 | 24
Q: What address means "this computer" (loopback)?
A: 127.0.0.1
Q: Is 10.300.1.1 a valid IPv4 address? (yes/no)
A: no
```

**Learn more:** [RFC 1918: private address space](https://datatracker.ietf.org/doc/html/rfc1918) · [Cloudflare: What is my IP address?](https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/)
