---
slug: subnet-masks
title: "Subnet masks: what they do, the AND operation, mask/prefix tables, network and broadcast addresses, wildcard masks"
after: KEEP
---
# Subnet masks: what they do, the AND operation, mask/prefix tables, network and broadcast addresses, wildcard masks

An IP address on its own doesn't say where the network part ends and the host part begins. The **subnet mask** does. It's a 32-bit pattern of **1s (network)** followed by **0s (host)**. Your computer uses the mask every time it sends data, to answer one question: *"Is the destination on my local network, or must I send it to the router?"* Get the mask wrong and devices can't talk to each other or the internet, even with correct IP addresses.

:::note What you will learn
- What a subnet mask is and why every device needs one
- Masks in binary and dotted decimal
- Finding the network address with the AND operation
- The full mask ↔ prefix table and how to rebuild it from memory
- Network and broadcast addresses, and why two addresses aren't usable
- How a device decides "local or remote"
- Wildcard masks for ACLs and OSPF
- Common mask mistakes and their symptoms
:::

## Masks in binary

The 1s are always **contiguous** (together) on the left:

```
IP address:  192.168.10.77   = 11000000.10101000.00001010.01001101
Mask:        255.255.255.0   = 11111111.11111111.11111111.00000000
                               |------- network --------||- host -|
```

Valid mask octet values are only: **0, 128, 192, 224, 240, 248, 252, 254, 255**. So `255.255.255.200` or `255.255.0.255` are **invalid** masks.

The **prefix** (CIDR notation) is simply the number of 1s: 255.255.255.0 has 24 ones → **/24**.

## The AND operation: finding the network address

The **network address** = IP address **AND** mask, bit by bit:

| A | B | A AND B |
|---|---|---|
| 1 | 1 | 1 |
| 1 | 0 | 0 |
| 0 | 1 | 0 |
| 0 | 0 | 0 |

Where the mask has 255, the IP octet passes through unchanged. Where the mask has 0, the result is 0. Only the "interesting" octet (where the mask is between 0 and 255) needs work.

Example: `192.168.10.77` with mask `255.255.255.224`:

```
77  = 01001101
224 = 11100000
AND = 01000000 = 64      → network 192.168.10.64
```

```try-python
def network(ip, mask):
    return ".".join(str(int(a) & int(b)) for a, b in zip(ip.split("."), mask.split(".")))

print(network("192.168.10.77", "255.255.255.0"))
print(network("192.168.10.77", "255.255.255.224"))
print(network("10.20.30.40", "255.255.252.0"))
```

## Mask ↔ prefix table (last octet)

| Mask | Prefix | Host bits | Total addresses | Usable hosts |
|---|---|---|---|---|
| 255.255.255.0 | /24 | 8 | 256 | 254 |
| 255.255.255.128 | /25 | 7 | 128 | 126 |
| 255.255.255.192 | /26 | 6 | 64 | 62 |
| 255.255.255.224 | /27 | 5 | 32 | 30 |
| 255.255.255.240 | /28 | 4 | 16 | 14 |
| 255.255.255.248 | /29 | 3 | 8 | 6 |
| 255.255.255.252 | /30 | 2 | 4 | 2 |
| 255.255.255.254 | /31 | 1 | 2 | 2 (point-to-point links only) |
| 255.255.255.255 | /32 | 0 | 1 | 1 (a single host) |

The same pattern repeats in the third octet:

| Mask | Prefix | Addresses | Mask | Prefix | Addresses |
|---|---|---|---|---|---|
| 255.255.128.0 | /17 | 32,768 | 255.255.248.0 | /21 | 2,048 |
| 255.255.192.0 | /18 | 16,384 | 255.255.252.0 | /22 | 1,024 |
| 255.255.224.0 | /19 | 8,192 | 255.255.254.0 | /23 | 512 |
| 255.255.240.0 | /20 | 4,096 | 255.255.255.0 | /24 | 256 |

And the second octet: /9 = 255.128.0.0 ... /16 = 255.255.0.0.

### Rebuild the table from memory

1. Write the mask values: 128, 192, 224, 240, 248, 252, 254, 255.
2. In the 4th octet, these are /25 to /32; in the 3rd octet, /17 to /24; in the 2nd, /9 to /16.
3. Host bits = 32 − prefix; addresses = 2^host bits; usable = addresses − 2.

## Network and broadcast addresses

In every normal subnet:
- The **network address** has all host bits = **0**. It names the subnet (used in routing tables). Devices can't use it.
- The **broadcast address** has all host bits = **1**. Sending to it reaches every device in the subnet. Devices can't use it either.
- Everything between is **usable** for hosts.

For `192.168.10.77/27`: block size 32 → subnets at .0, .32, **.64**, .96... So network **192.168.10.64**, broadcast **192.168.10.95** (next subnet .96 minus 1), usable **.65 – .94** (30 hosts).

Exceptions: **/31** (RFC 3021) uses both addresses for point-to-point router links, and **/32** identifies one single host (e.g. a loopback interface on a router).

## Local or remote? How a device decides

Before sending, a device ANDs **its own IP** and **the destination IP** with **its own mask**:
- Same result → destination is **local**: deliver directly (using ARP to find the MAC address).
- Different result → destination is **remote**: send to the **default gateway** (router).

Example: PC `192.168.1.20/24` sends to `192.168.1.50` → both give `192.168.1.0` → local. Sending to `8.8.8.8` → `8.8.8.0` ≠ `192.168.1.0` → remote, go to the gateway.

```try-python
import ipaddress
pc = ipaddress.ip_interface("192.168.1.20/24")
for dest in ["192.168.1.50", "192.168.2.50", "8.8.8.8"]:
    local = ipaddress.ip_address(dest) in pc.network
    print(dest, "-> local, send directly" if local else "-> remote, send to gateway")
```

## Wildcard masks

Cisco ACLs and OSPF use a **wildcard mask**: the subnet mask inverted. Calculate it as **255.255.255.255 − mask**:

| Subnet mask | Wildcard |
|---|---|
| 255.255.255.0 | 0.0.0.255 |
| 255.255.255.224 | 0.0.0.31 |
| 255.255.255.252 | 0.0.0.3 |
| 255.255.240.0 | 0.0.15.255 |

In a wildcard, **0 means "must match"** and **1 means "don't care"**. So `access-list 10 permit 192.168.10.0 0.0.0.255` matches every address 192.168.10.0–255.

## Common mask mistakes

| Mistake | Symptom |
|---|---|
| PC has /24 but the network is /25 | Can reach some local devices but not others; traffic to the other half goes to the router unnecessarily or fails |
| Gateway outside the PC's subnet (e.g. PC 192.168.1.20/26, gateway 192.168.1.129) | No internet: the gateway is "remote" so the PC can't reach it |
| Typing 255.255.255.200 | Invalid mask, rejected or behaves unpredictably |
| Two devices with the same IP | "IP address conflict" warnings, intermittent connection |

:::think A PC is 192.168.5.70 with mask 255.255.255.192 and gateway 192.168.5.1. It can't reach the internet, but it can reach 192.168.5.100. Why?
With /26, the PC's subnet is 192.168.5.64–127 (block size 64). The gateway 192.168.5.1 is in a different subnet (.0–.63), so the PC can't reach it directly. Fix the mask (probably /24) or use a gateway inside .65–.126.
:::

## Summary

- A subnet mask is 32 bits of contiguous 1s (network) then 0s (host); the prefix counts the 1s.
- Valid octet values: 0, 128, 192, 224, 240, 248, 252, 254, 255.
- Network address = IP AND mask; broadcast = all host bits 1; usable hosts = total − 2 (except /31, /32).
- Devices compare network addresses to decide whether to deliver locally or send to the gateway.
- Wildcard = 255.255.255.255 − mask (0 = match, 1 = don't care).

```quiz
Q: What prefix length is the mask 255.255.255.192?
A: /26 | 26
Q: What mask matches /28?
A: 255.255.255.240
Q: How many usable hosts does a /29 give?
A: 6
Q: What is the network address of 192.168.10.77 with mask 255.255.255.224?
A: 192.168.10.64
Q: What is the wildcard mask for 255.255.255.248?
A: 0.0.0.7
Q: What mask matches /20?
A: 255.255.240.0
Q: Is 255.255.255.200 a valid subnet mask? (yes/no)
A: no
```

**Learn more:** [Practical Networking: subnetting mastery](https://www.practicalnetworking.net/series/subnetting/subnetting/)
