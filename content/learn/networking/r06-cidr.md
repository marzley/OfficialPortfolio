---
slug: cidr
title: "CIDR notation and calculations: prefixes, formulas, block sizes, worked examples in every octet"
after: KEEP
---
# CIDR notation and calculations: prefixes, formulas, block sizes, worked examples in every octet

**CIDR (Classless Inter-Domain Routing)** replaced the rigid class system in 1993. Instead of writing a long mask, we write the **number of network bits** after a slash: `192.168.1.0/24` means the first 24 bits are the network. CIDR lets networks be *any* size: a /22 for an office of 1,000 devices, a /30 for a link between two routers, a /29 for a client's block of public IPs. This flexibility saved the internet from running out of IPv4 addresses much sooner, and it's how ISPs, cloud providers (AWS, Azure, Google Cloud VPCs) and network engineers describe every network today.

:::note What you will learn
- Reading and writing CIDR notation
- The five formulas you need
- Finding the interesting octet and the block size
- Worked examples in the 4th, 3rd and 2nd octets
- Calculating network, broadcast, first/last host and host count
- How many smaller subnets fit in a bigger block
- CIDR in real life: ISPs, cloud VPCs, firewall rules
- A built-in calculator to check your work
:::

## Reading CIDR

| CIDR | Means | Mask |
|---|---|---|
| 10.0.0.0/8 | First 8 bits are network | 255.0.0.0 |
| 172.16.0.0/12 | First 12 bits | 255.240.0.0 |
| 192.168.1.0/24 | First 24 bits | 255.255.255.0 |
| 41.90.64.8/29 | First 29 bits | 255.255.255.248 |
| 0.0.0.0/0 | No network bits: matches **every** address | 0.0.0.0 (the default route) |

## The formulas you need

With prefix **/n**:

| Quantity | Formula |
|---|---|
| Host bits | 32 − n |
| Total addresses | 2^(32 − n) |
| Usable hosts | 2^(32 − n) − 2 (except /31 and /32) |
| Subnets when splitting a /a into /b pieces | 2^(b − a) |
| Block size (in the interesting octet) | 256 − mask value in that octet |

## Finding the interesting octet

The **interesting octet** is where the prefix ends (where the mask isn't 255 or 0):

| Prefix | Interesting octet | Mask bits in that octet |
|---|---|---|
| /1 – /8 | 1st | n |
| /9 – /16 | 2nd | n − 8 |
| /17 – /24 | 3rd | n − 16 |
| /25 – /32 | 4th | n − 24 |

Mask bits in the octet → mask value: 1→128, 2→192, 3→224, 4→240, 5→248, 6→252, 7→254, 8→255.

## The method (any prefix)

1. Find the interesting octet and its mask value.
2. Block size = 256 − mask value.
3. List multiples of the block size: 0, B, 2B, 3B...
4. The **network** is the multiple at or just below the address's value in that octet; octets to the right become **0**.
5. The **broadcast** is the next multiple minus 1; octets to the right become **255**.
6. First host = network + 1; last host = broadcast − 1.

## Worked example 1 (4th octet): 172.16.5.200/26

1. /26 → 4th octet, 2 bits → mask value **192**.
2. Block size = 256 − 192 = **64**.
3. Multiples: 0, 64, 128, **192**, (256).
4. 200 is in the block starting at 192 → network **172.16.5.192**.
5. Broadcast = 256 − 1 = 255 → **172.16.5.255**.
6. Hosts **172.16.5.193 – 172.16.5.254**; usable = 2⁶ − 2 = **62**.

## Worked example 2 (3rd octet): 10.20.30.40/22

1. /22 → 3rd octet, 6 bits → mask value **252** (mask 255.255.252.0).
2. Block size = 256 − 252 = **4**.
3. Multiples in the 3rd octet: 0, 4, 8, ... 24, **28**, 32.
4. 30 is in the block starting at 28 → network **10.20.28.0** (4th octet becomes 0).
5. Next block is 32, so broadcast = **10.20.31.255** (4th octet becomes 255).
6. Hosts **10.20.28.1 – 10.20.31.254**; usable = 2¹⁰ − 2 = **1,022**.

## Worked example 3 (2nd octet): 172.29.4.1/14

1. /14 → 2nd octet, 6 bits → mask value 252 (mask 255.252.0.0).
2. Block size = **4**. Multiples: ... 24, **28**, 32.
3. 29 is in the block starting at 28 → network **172.28.0.0**.
4. Broadcast **172.31.255.255**; usable = 2¹⁸ − 2 = **262,142**.

## Worked example 4 (small block): 41.90.64.13/29

1. /29 → 4th octet, 5 bits → mask 248, block size **8**.
2. Multiples: 0, **8**, 16. 13 is in the block starting at 8.
3. Network **41.90.64.8**, broadcast **41.90.64.15**, hosts **.9 – .14** (6 usable).

This is a typical small block of public IPs an ISP might assign to a business: 6 usable addresses, one of which is usually the ISP's gateway.

```try-python
import ipaddress
for cidr in ["172.16.5.200/26", "10.20.30.40/22", "172.29.4.1/14", "41.90.64.13/29"]:
    net = ipaddress.ip_interface(cidr).network
    hosts = net.num_addresses - 2
    print(f"{cidr:18} network {net.network_address}  broadcast {net.broadcast_address}  "
          f"first {net.network_address + 1}  last {net.broadcast_address - 1}  usable {hosts}")
```

## How many subnets fit?

Splitting a /a into /b subnets gives 2^(b − a) pieces:

| From | Into | Subnets | Each has |
|---|---|---|---|
| /24 | /25 | 2 | 126 hosts |
| /24 | /26 | 4 | 62 hosts |
| /24 | /27 | 8 | 30 hosts |
| /24 | /30 | 64 | 2 hosts |
| /16 | /24 | 256 | 254 hosts |
| /22 | /24 | 4 | 254 hosts |

## Quick table: prefix → size

| Prefix | Addresses | Prefix | Addresses |
|---|---|---|---|
| /8 | 16,777,216 | /20 | 4,096 |
| /12 | 1,048,576 | /21 | 2,048 |
| /16 | 65,536 | /22 | 1,024 |
| /17 | 32,768 | /23 | 512 |
| /18 | 16,384 | /24 | 256 |
| /19 | 8,192 | /30 | 4 |

Shortcut: each step of 1 in the prefix halves (or doubles) the size. /24 = 256, so /23 = 512, /22 = 1,024, /25 = 128.

## CIDR in real life

| Where | Example |
|---|---|
| **ISPs** | A business fibre plan with a /29 of public IPs |
| **Cloud** | An AWS/Azure virtual network of 10.0.0.0/16, split into /24 subnets for web, app and database tiers |
| **Firewall rules** | "Allow SSH only from 41.90.64.0/24" |
| **Routing tables** | Routes like 10.10.0.0/16 via 192.168.1.2; the default route 0.0.0.0/0 |
| **Home routers** | LAN 192.168.100.0/24 |

## Try the calculator

Type any address with a prefix (or with a mask, e.g. `10.0.0.5 255.255.252.0`). Check your hand calculations against it.

```tool-cidr
```

## Practice

Work these out by hand, then check with the calculator:
1. 192.168.50.99/27 → network, broadcast, usable range
2. 10.1.77.200/20 → network and broadcast
3. How many /28 subnets fit in a /24?
4. How many usable hosts in a /19?

:::think Answers to the practice questions?
1) Block 32: network 192.168.50.96, broadcast 192.168.50.127, hosts .97–.126. 2) /20 → 3rd octet, block 16: 77 is in 64–79, so network 10.1.64.0, broadcast 10.1.79.255. 3) 2^(28−24) = 16. 4) 2^13 − 2 = 8,190.
:::

## Summary

- CIDR writes the number of network bits after a slash; any prefix /0 to /32 is allowed.
- Host bits = 32 − n; addresses = 2^(32−n); usable = addresses − 2.
- Find the interesting octet, block size = 256 − mask value, then the multiples give network and broadcast.
- Splitting /a into /b gives 2^(b−a) subnets.
- CIDR is used by ISPs, clouds, firewalls and routing tables everywhere.

```quiz
Q: How many total addresses are in a /23?
A: 512
Q: How many usable hosts are in a /21?
A: 2046 | 2,046
Q: What is the network address of 10.20.30.40/22?
A: 10.20.28.0
Q: What is the broadcast address of 172.16.5.200/26?
A: 172.16.5.255
Q: How many /27 subnets fit in one /24?
A: 8
H: 2 to the power of (27 − 24)
Q: What is the subnet mask for /22?
A: 255.255.252.0
Q: What is the last usable host of 192.168.100.130/25?
A: 192.168.100.254
```

**Learn more:** [Cloudflare: What is CIDR?](https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/) · [subnettingpractice.com](https://subnettingpractice.com/)
