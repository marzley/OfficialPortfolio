---
slug: ipv6
title: "IPv6 addressing: why it exists, notation and shortening, address types, prefixes, SLAAC and dual stack"
after: KEEP
---
# IPv6 addressing: why it exists, notation and shortening, address types, prefixes, SLAAC and dual stack

IPv4 has about 4.3 billion addresses, and they've run out. **IPv6** (Internet Protocol version 6) fixes this with **128-bit** addresses: about 340 undecillion (3.4 × 10³⁸) of them, enough to give every device on Earth trillions of addresses. Major mobile networks, Google, Facebook, Netflix and cloud providers already run IPv6, and in many countries a large share of users reach Google over IPv6. Kenyan mobile and fibre operators have been rolling it out too. Network engineers must be comfortable reading, writing and planning IPv6.

:::note What you will learn
- Why IPv6 was created and what else it improves
- Writing IPv6 addresses in hexadecimal
- The two shortening rules (and the mistakes to avoid)
- Prefixes: /64 LANs, /48 and /56 sites
- Address types: global unicast, link-local, unique local, loopback, multicast, anycast
- How devices get addresses: SLAAC, DHCPv6, static
- Neighbour Discovery (replacing ARP) and no broadcasts
- Dual stack, tunnelling and translation
- Commands to see and test IPv6
:::

## Why IPv6?

| Problem with IPv4 | IPv6 answer |
|---|---|
| Only ~4.3 billion addresses; exhausted | 2¹²⁸ addresses |
| NAT needed everywhere, breaking end-to-end connections | Enough addresses for every device to have a global one |
| Broadcasts disturb every device | No broadcasts; uses multicast instead |
| Manual or DHCP-only configuration | Devices can configure themselves (SLAAC) |
| Complex header with options | Simpler fixed header, faster to process |

IPv4 and IPv6 aren't directly compatible, so the world runs both side by side (**dual stack**) during a long transition.

## Writing IPv6 addresses

128 bits are written as **8 groups of 4 hexadecimal digits** (16 bits each), separated by colons:

```
2001:0db8:0000:0000:0000:ff00:0042:8329
```

(The `2001:db8::/32` range is reserved for documentation and examples.)

## The two shortening rules

**Rule 1: drop leading zeros in each group.**

```
2001:0db8:0000:0000:0000:ff00:0042:8329
2001:db8:0:0:0:ff00:42:8329
```

**Rule 2: replace ONE run of consecutive all-zero groups with `::`.**

```
2001:db8:0:0:0:ff00:42:8329
2001:db8::ff00:42:8329
```

Important details:
- `::` can appear **only once** in an address; otherwise you couldn't tell how many zeros each one hides.
- Only **leading** zeros are dropped: `0db8` → `db8`, but `db80` stays `db80`.
- If there are two equal runs of zeros, shorten the first (the standard, RFC 5952, says shorten the longest, or the first if tied), and use lowercase letters.

| Full | Shortened |
|---|---|
| 2001:0db8:0000:0000:0000:0000:0000:0001 | 2001:db8::1 |
| fe80:0000:0000:0000:021a:2bff:fe3c:4d5e | fe80::21a:2bff:fe3c:4d5e |
| 0000:0000:0000:0000:0000:0000:0000:0001 | ::1 |
| 0000:0000:0000:0000:0000:0000:0000:0000 | :: |
| 2001:0db8:0000:0001:0000:0000:0000:0005 | 2001:db8:0:1::5 |

To **expand** an address, count the groups present and fill `::` with enough `0000` groups to make 8.

```try-python
import ipaddress
for a in ["2001:0db8:0000:0000:0000:ff00:0042:8329", "2001:db8:0:1::5", "fe80::21a:2bff:fe3c:4d5e", "::1"]:
    ip = ipaddress.ip_address(a)
    print(f"{a:42} short: {ip.compressed:28} full: {ip.exploded}")
```

## Prefixes

IPv6 uses CIDR prefixes like IPv4. An address is usually split in half:

```
2001:db8:abcd:0012 : 0000:0000:0000:0001
|-- network prefix (64) --||-- interface ID (64) --|
```

| Prefix | Typical use |
|---|---|
| **/64** | A single LAN/subnet (standard; required for SLAAC) |
| **/56** | A home or small business from an ISP (256 /64 subnets) |
| **/48** | An organisation or site (65,536 /64 subnets) |
| /127 | Point-to-point router links (sometimes) |
| /128 | A single host (like IPv4 /32) |

Subnetting IPv6 is usually easier than IPv4: you just change the 4th group. From `2001:db8:abcd::/48`, subnets are `2001:db8:abcd:0001::/64`, `2001:db8:abcd:0002::/64`, ... up to `ffff`. You never need to calculate "usable hosts": a /64 has 2⁶⁴ addresses (18 quintillion).

## Address types

| Type | Prefix | Purpose | Like IPv4 |
|---|---|---|---|
| **Global unicast** | `2000::/3` (starts with 2 or 3) | Public, routable on the internet | Public IPs |
| **Link-local** | `fe80::/10` | Only valid on the local link; every IPv6 interface has one; used by routers and neighbour discovery | 169.254.x.x (but always present and normal) |
| **Unique local** | `fc00::/7` (in practice `fd00::/8`) | Private internal addressing | 10/8, 172.16/12, 192.168/16 |
| **Loopback** | `::1/128` | This device | 127.0.0.1 |
| **Unspecified** | `::/128` | No address yet | 0.0.0.0 |
| **Multicast** | `ff00::/8` | One to many | 224.0.0.0/4 |
| **Anycast** | (from unicast space) | Nearest of several servers | Anycast DNS |

Useful multicast groups: `ff02::1` (all nodes on the link), `ff02::2` (all routers on the link).

**There's no broadcast in IPv6.** Tasks that used broadcasts (like ARP) now use targeted multicast, so devices aren't disturbed by traffic that isn't for them.

## How devices get IPv6 addresses

| Method | How it works |
|---|---|
| **SLAAC** (Stateless Address Autoconfiguration) | The router sends **Router Advertisements (RAs)** with the /64 prefix; the device builds its own interface ID |
| **DHCPv6** | A server assigns addresses (stateful) or just extra info like DNS (stateless) |
| **Static** | Configured manually: routers, servers |

With SLAAC, the interface ID used to be built from the MAC address (**EUI-64**: insert `fffe` in the middle and flip one bit). Modern operating systems use **random, temporary interface IDs** for privacy, so websites can't track a device by its address.

A device typically has several IPv6 addresses at once: a link-local (`fe80::...`), one or more global addresses, and temporary privacy addresses. That's normal.

## Neighbour Discovery Protocol (NDP)

NDP (part of ICMPv6) replaces ARP and more:
- **Neighbour Solicitation/Advertisement**: find a neighbour's MAC address (like ARP).
- **Router Solicitation/Advertisement**: find routers and prefixes (for SLAAC).
- **Duplicate Address Detection**: check nobody else uses an address before taking it.

Because NDP uses ICMPv6, **blocking all ICMPv6 on a firewall breaks IPv6**. Filter it carefully instead.

## Transition: dual stack, tunnels and translation

| Method | Idea |
|---|---|
| **Dual stack** | Devices and networks run IPv4 and IPv6 at the same time (most common) |
| **Tunnelling** | Carry IPv6 inside IPv4 (or the reverse) across networks that don't support it |
| **Translation (NAT64/DNS64)** | IPv6-only devices reach IPv4-only servers through a translator; used by some mobile networks |

When both work, devices prefer IPv6 (the "Happy Eyeballs" method races both and uses the faster).

## Seeing and testing IPv6

```bash
ipconfig                 # Windows: look for "IPv6 Address" and "Link-local IPv6 Address"
ip -6 addr               # Linux
ping -6 google.com       # Windows/Linux: test IPv6 connectivity
ping ::1                 # loopback test
tracert -6 google.com    # Windows path over IPv6 (Linux: traceroute -6)
nslookup -type=AAAA google.com   # IPv6 address records
```

Many "test my IPv6" websites show whether your connection supports it.

## Writing an IPv6 plan

Example: an ISP gives a school `2001:db8:5a00::/48`.
- Lab 1: `2001:db8:5a00:10::/64`
- Lab 2: `2001:db8:5a00:11::/64`
- Staff: `2001:db8:5a00:20::/64`
- CCTV: `2001:db8:5a00:40::/64`
- Wi-Fi: `2001:db8:5a00:30::/64`

Matching the subnet number to the IPv4 VLAN/third octet makes dual-stack networks easy to read.

:::think Shorten 2001:0db8:0000:0000:0001:0000:0000:0001 correctly.
Drop leading zeros: 2001:db8:0:0:1:0:0:1. There are two runs of two zero groups; use `::` only once, on the first: 2001:db8::1:0:0:1. (2001:db8::1::1 is invalid.)
:::

## Summary

- IPv6 uses 128-bit addresses written as 8 groups of hex; it removes the need for NAT and broadcasts.
- Shorten by dropping leading zeros and replacing one run of zero groups with `::` (only once).
- LANs use /64; sites get /48 or /56; subnet by changing the 4th group.
- Types: global unicast (2000::/3), link-local (fe80::/10), unique local (fd00::/8), loopback ::1, multicast ff00::/8.
- Addresses come from SLAAC, DHCPv6 or static configuration; NDP replaces ARP; networks run dual stack.

```quiz
Q: How many bits long is an IPv6 address?
A: 128 | 128 bits
Q: Shorten 2001:0db8:0000:0000:0000:0000:0000:0001
A: 2001:db8::1
Q: What is the IPv6 loopback address?
A: ::1
Q: Which prefix do link-local addresses start with?
A: fe80 | fe80::/10 | fe80::
Q: What is the standard prefix length for an IPv6 LAN?
A: /64 | 64
Q: How many /64 networks are in a /56?
A: 256
Q: Can :: be used twice in one address? (yes/no)
A: no
Q: Does IPv6 use broadcast addresses? (yes/no)
A: no
```

**Learn more:** [Google IPv6 statistics](https://www.google.com/intl/en/ipv6/statistics.html) · [Cloudflare: What is IPv6?](https://www.cloudflare.com/learning/network-layer/what-is-ipv6/)
