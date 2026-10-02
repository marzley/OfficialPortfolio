---
slug: vlsm
title: "VLSM: different subnet sizes in one network, step by step with full worked designs"
after: KEEP
---
# VLSM: different subnet sizes in one network, step by step with full worked designs

Giving every subnet the same size wastes addresses: a router-to-router link with 2 devices doesn't need 30 addresses, and a 10-person office doesn't need 254. **VLSM (Variable Length Subnet Masking)** lets you use **different prefixes** for different subnets inside one block, so each gets just what it needs. With public IPv4 addresses scarce and expensive, and private ranges needing careful planning in big organisations and clouds, VLSM is an everyday skill and a guaranteed exam topic.

:::note What you will learn
- Why fixed-size subnetting wastes addresses
- The VLSM method: sort, size, allocate
- Choosing the right prefix for a host count
- Full worked design for an office
- A WAN design with branches and point-to-point links
- Checking for overlaps and boundary errors
- VLSM and routing protocols
:::

## Fixed-size vs VLSM

Requirements: Sales 100 hosts, Admin 50, IT 20, Guests 10, two router links of 2.

- **Fixed size**: the largest need (100) requires a /25. Six /25 subnets = 768 addresses = **three /24s**, most of it wasted.
- **VLSM**: everything fits into **one /24**, with space to spare.

## The method

1. **List** every requirement and **sort from largest to smallest**.
2. For each, pick the **smallest block that fits**: hosts + 2 ≤ block size (block sizes are powers of 2).
3. **Allocate** them one after another, starting at the beginning of the block. Each new subnet starts right after the previous broadcast.
4. **Record** network, prefix, mask, usable range and broadcast.
5. **Verify**: no overlaps, every subnet starts on a multiple of its own block size.

Going largest first guarantees every subnet lands on a correct boundary.

### Choosing the prefix

| Hosts needed | Block | Prefix | Mask |
|---|---|---|---|
| 1–2 | 4 | /30 | 255.255.255.252 |
| 3–6 | 8 | /29 | 255.255.255.248 |
| 7–14 | 16 | /28 | 255.255.255.240 |
| 15–30 | 32 | /27 | 255.255.255.224 |
| 31–62 | 64 | /26 | 255.255.255.192 |
| 63–126 | 128 | /25 | 255.255.255.128 |
| 127–254 | 256 | /24 | 255.255.255.0 |
| 255–510 | 512 | /23 | 255.255.254.0 |

Note the edges: **62 hosts fit a /26, but 63 need a /25**; **30 fit a /27, 31 need a /26**.

## Example 1: one office block

You have **192.168.10.0/24** and need:

| Need | Hosts | Block that fits | Prefix | Subnet | Usable range | Broadcast |
|---|---|---|---|---|---|---|
| Sales | 100 | 128 | /25 | 192.168.10.0/25 | .1 – .126 | .127 |
| Admin | 50 | 64 | /26 | 192.168.10.128/26 | .129 – .190 | .191 |
| IT | 20 | 32 | /27 | 192.168.10.192/27 | .193 – .222 | .223 |
| Guests | 10 | 16 | /28 | 192.168.10.224/28 | .225 – .238 | .239 |
| Link 1 | 2 | 4 | /30 | 192.168.10.240/30 | .241 – .242 | .243 |
| Link 2 | 2 | 4 | /30 | 192.168.10.244/30 | .245 – .246 | .247 |
| Free | | | | 192.168.10.248/29 | | |

Everything fits in one /24 with a /29 spare.

```try-python
import ipaddress, math

def vlsm(block, needs):
    free = int(ipaddress.ip_network(block).network_address)
    for name, hosts in sorted(needs, key=lambda n: -n[1]):
        size = 2 ** math.ceil(math.log2(hosts + 2))
        prefix = 32 - int(math.log2(size))
        net = ipaddress.ip_network(f"{ipaddress.ip_address(free)}/{prefix}")
        print(f"{name:7} {hosts:4} hosts -> {str(net):18} usable {net[1]} - {net[-2]}  bcast {net.broadcast_address}")
        free += size

vlsm("192.168.10.0/24", [("Guests", 10), ("Sales", 100), ("Link1", 2), ("IT", 20), ("Admin", 50), ("Link2", 2)])
```

## Example 2: a company WAN

A company has **172.16.0.0/22** (1,024 addresses) for its head office and branches:

| Site | Hosts |
|---|---|
| Nairobi HQ | 300 |
| Mombasa | 120 |
| Kisumu | 60 |
| Eldoret | 25 |
| 3 WAN links (HQ to each branch) | 2 each |

Sorted and allocated:

| Site | Hosts | Block | Subnet | Usable range | Broadcast |
|---|---|---|---|---|---|
| Nairobi HQ | 300 | 512 | 172.16.0.0/23 | 172.16.0.1 – 172.16.1.254 | 172.16.1.255 |
| Mombasa | 120 | 128 | 172.16.2.0/25 | 172.16.2.1 – .126 | 172.16.2.127 |
| Kisumu | 60 | 64 | 172.16.2.128/26 | .129 – .190 | 172.16.2.191 |
| Eldoret | 25 | 32 | 172.16.2.192/27 | .193 – .222 | 172.16.2.223 |
| WAN 1 | 2 | 4 | 172.16.2.224/30 | .225 – .226 | .227 |
| WAN 2 | 2 | 4 | 172.16.2.228/30 | .229 – .230 | .231 |
| WAN 3 | 2 | 4 | 172.16.2.232/30 | .233 – .234 | .235 |
| Free | | | 172.16.2.236 onwards and all of 172.16.3.0/24 | | |

Modern designs often use **/31** for point-to-point links (2 addresses, both usable), saving even more.

## Checking your design

- **Boundaries**: a /26 must start at a multiple of 64 (.0, .64, .128, .192); a /23 must start at an even third octet.
- **No overlaps**: each subnet's network address must be greater than the previous broadcast.
- **Use the calculator** below to verify each line.

```tool-cidr
```

## Common mistakes

- **Not sorting largest first**: putting a /30 first at .0 forces the next /25 to start at .128, wasting .4–.127.
- **Forgetting the 2 reserved addresses**: 62 hosts → /26, but 63 → /25.
- **Overlapping subnets**: e.g. allocating 192.168.10.192/26 after 192.168.10.128/25 (the /25 already covers .128–.255).
- **Not leaving room**: allocate in order, but keep free space at the end for growth.

## VLSM and routing

VLSM requires **classless routing protocols** that send the prefix length with each route: OSPF, EIGRP, IS-IS, BGP and RIPv2. Old RIPv1 didn't send masks and couldn't support VLSM. Static routes always include the mask, so they're fine.

:::think You must add a new site with 70 hosts to Example 1 (192.168.10.0/24). Is there room?
No. 70 hosts need a /25 (128 addresses), but only a /29 (8 addresses) is free. You'd need another block, or to redesign (e.g. if Sales could move to a different block).
:::

## Summary

- VLSM uses different prefixes inside one block so each subnet gets just enough addresses.
- Method: sort largest first, pick the smallest block with hosts + 2 ≤ size, allocate consecutively, record and verify.
- Watch the edges: 62 → /26 but 63 → /25.
- Every subnet must start on a multiple of its block size, with no overlaps.
- VLSM needs classless routing (OSPF, EIGRP, BGP, RIPv2, static routes).

```quiz
Q: A subnet needs 60 hosts. Which prefix is the smallest that fits?
A: /26 | 26
Q: A subnet needs 64 hosts. Which prefix?
A: /25 | 25
H: A /26 has only 62 usable addresses.
Q: For a point-to-point router link (2 hosts, not using /31), which prefix?
A: /30 | 30
Q: In the table, what is the network address of the Guests subnet?
A: 192.168.10.224
Q: In VLSM, do you allocate largest or smallest subnets first?
A: largest | largest first | biggest
Q: Which old routing protocol could NOT support VLSM?
A: RIPv1 | RIP version 1 | rip v1
```
