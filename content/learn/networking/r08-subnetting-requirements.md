---
slug: subnetting-requirements
title: "Subnetting to meet requirements: designing IP plans for offices, schools and branches"
after: KEEP
---
# Subnetting to meet requirements: designing IP plans for offices, schools and branches

In real jobs nobody hands you an address and asks for its broadcast. You start with a **requirement**: "We have 192.168.50.0/24. We need 6 departments with up to 25 computers each." Or: "Our company got 10.10.0.0/16; each of our branches needs up to 500 devices." You must choose the right prefix, list the subnets, assign them, and document the plan so the whole team can follow it. This unit teaches that design process with several realistic Kenyan scenarios.

:::note What you will learn
- The two design questions: how many subnets, how many hosts
- Borrowing bits for subnets and keeping bits for hosts
- Designing subnets-first and hosts-first
- Building a full subnet table
- Planning for growth and leaving spare space
- Writing an IP addressing plan (gateways, DHCP ranges, static devices)
- A full worked case study: a school with labs, staff, CCTV and Wi-Fi
:::

## The two design questions

1. **How many subnets do I need?** Borrow **s** host bits so that **2^s ≥ subnets needed**.
2. **How many hosts per subnet?** Keep **h** host bits so that **2^h − 2 ≥ hosts needed**.

Both must fit in the original block: **original prefix + s + h ≤ 32**.

| Subnets needed | Bits to borrow (s) | Gives |
|---|---|---|
| 2 | 1 | 2 |
| 3–4 | 2 | 4 |
| 5–8 | 3 | 8 |
| 9–16 | 4 | 16 |
| 17–32 | 5 | 32 |

| Hosts needed | Host bits (h) | Prefix in last octet | Usable |
|---|---|---|---|
| up to 2 | 2 | /30 | 2 |
| up to 6 | 3 | /29 | 6 |
| up to 14 | 4 | /28 | 14 |
| up to 30 | 5 | /27 | 30 |
| up to 62 | 6 | /26 | 62 |
| up to 126 | 7 | /25 | 126 |
| up to 254 | 8 | /24 | 254 |
| up to 510 | 9 | /23 | 510 |
| up to 1,022 | 10 | /22 | 1,022 |

## Example 1 (subnets first): 6 departments, 25 hosts each, from 192.168.50.0/24

- Subnets: 2³ = 8 ≥ 6 → borrow **3 bits** → /24 + 3 = **/27**.
- Check hosts: a /27 has 2⁵ − 2 = **30** ≥ 25 ✓.
- Mask 255.255.255.224, block size **32**.

| Subnet | Network | First host | Last host | Broadcast |
|---|---|---|---|---|
| 1 | 192.168.50.0/27 | .1 | .30 | .31 |
| 2 | 192.168.50.32/27 | .33 | .62 | .63 |
| 3 | 192.168.50.64/27 | .65 | .94 | .95 |
| 4 | 192.168.50.96/27 | .97 | .126 | .127 |
| 5 | 192.168.50.128/27 | .129 | .158 | .159 |
| 6 | 192.168.50.160/27 | .161 | .190 | .191 |
| spare | .192/27 and .224/27 | | | |

## Example 2 (hosts first): branches with 500 devices from 10.10.0.0/16

- Hosts: 2⁹ − 2 = 510 ≥ 500 → keep 9 host bits → **/23** (32 − 9).
- Number of /23s in a /16 = 2^(23 − 16) = **128** branches possible.
- /23 ends in the 3rd octet with mask 254 → block size **2** in the 3rd octet.

| Branch | Network | Range | Broadcast |
|---|---|---|---|
| Nairobi | 10.10.0.0/23 | 10.10.0.1 – 10.10.1.254 | 10.10.1.255 |
| Mombasa | 10.10.2.0/23 | 10.10.2.1 – 10.10.3.254 | 10.10.3.255 |
| Kisumu | 10.10.4.0/23 | 10.10.4.1 – 10.10.5.254 | 10.10.5.255 |
| Nakuru | 10.10.6.0/23 | 10.10.6.1 – 10.10.7.254 | 10.10.7.255 |

```try-python
import ipaddress
block = ipaddress.ip_network("10.10.0.0/16")
branches = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"]
for name, net in zip(branches, block.subnets(new_prefix=23)):
    print(f"{name:8} {str(net):15} hosts {net[1]} - {net[-2]}  broadcast {net.broadcast_address}")
```

## Example 3: both constraints

"From 172.20.0.0/16 we need 40 subnets, each with at least 1,000 hosts. Is it possible?"
- 40 subnets → borrow 6 bits (2⁶ = 64) → /22.
- A /22 has 2¹⁰ − 2 = 1,022 hosts ≥ 1,000 ✓. **Yes**: 64 subnets of /22.

"From 192.168.1.0/24, we need 10 subnets of 20 hosts." 10 subnets → borrow 4 bits → /28 → only 14 hosts ✗. 20 hosts → /27 → only 8 subnets ✗. **Impossible** with equal sizes: you need a bigger block, or VLSM if sizes differ (next lesson).

## Plan for growth

- Size subnets for **expected** growth (a 25-person team today may be 40 next year): pick /26 rather than /27 if in doubt.
- Leave **spare subnets** between groups so departments can expand without renumbering.
- Use **readable boundaries** where possible: a /24 per floor or department makes addresses easy to recognise (10.1.**10**.x = finance, 10.1.**20**.x = sales).
- Save small prefixes (/30, /31) for router-to-router links and /32 for loopbacks.

Renumbering a live network later is slow, risky and disruptive, so time spent planning pays off.

## An IP addressing plan

A good plan documents more than networks. For each subnet:

| Item | Convention (example) |
|---|---|
| Gateway | First usable address (.1) |
| Network devices (switches, APs) | .2 – .20 static |
| Servers and printers | .21 – .49 static or DHCP reservations |
| DHCP pool | .50 – .250 |
| VLAN ID | Matches the third octet where possible (VLAN 10 = 10.1.10.0/24) |

Keep the plan in a shared spreadsheet or an IPAM tool (such as phpIPAM or NetBox), and update it with every change.

## Case study: a secondary school

**St. Mary's Secondary School** has been given **10.20.0.0/16** for its campus. Requirements:

| Group | Devices now | Expected in 3 years |
|---|---|---|
| Computer Lab 1 | 45 | 60 |
| Computer Lab 2 | 45 | 60 |
| Staff (admin, bursar, teachers) | 80 | 120 |
| Student Wi-Fi | 300 | 500 |
| CCTV cameras and NVR | 24 | 40 |
| Printers and servers | 10 | 20 |
| Guest Wi-Fi | 50 | 100 |

Design (using readable /24s where they fit, larger blocks where needed):

| Group | VLAN | Network | Gateway | DHCP |
|---|---|---|---|---|
| Lab 1 | 10 | 10.20.10.0/24 | 10.20.10.1 | .50 – .250 |
| Lab 2 | 11 | 10.20.11.0/24 | 10.20.11.1 | .50 – .250 |
| Staff | 20 | 10.20.20.0/24 | 10.20.20.1 | .50 – .250 |
| Student Wi-Fi | 30 | 10.20.32.0/22 (1,022 hosts) | 10.20.32.1 | 10.20.32.50 – 10.20.35.250 |
| CCTV | 40 | 10.20.40.0/24 | 10.20.40.1 | Static only |
| Servers/printers | 50 | 10.20.50.0/24 | 10.20.50.1 | Reservations |
| Guest Wi-Fi | 60 | 10.20.60.0/24 | 10.20.60.1 | .10 – .250 |
| Router links | — | 10.20.255.0/24 split into /30s | — | — |

Notes:
- Student Wi-Fi needs ~500 → a /23 would give 510 (tight), so a /22 allows for growth. A /22 must start on a multiple of 4 in the third octet, hence 10.20.**32**.0.
- CCTV and guests are separate so the firewall can stop guests reaching cameras or staff systems.
- Lots of the /16 remains free for future buildings.

:::think Why can't the student Wi-Fi /22 start at 10.20.30.0?
A /22 has a block size of 4 in the third octet, so valid networks are 10.20.28.0, 10.20.32.0, 10.20.36.0... 30 isn't a multiple of 4. 10.20.30.0/22 would actually mean network 10.20.28.0, overlapping with other ranges.
:::

## Summary

- Ask: how many subnets (borrow s bits, 2^s ≥ need) and how many hosts (keep h bits, 2^h − 2 ≥ need).
- Check that prefix + s + h ≤ 32; if not, you need a bigger block or VLSM.
- List subnets by stepping the block size; record gateway, static ranges, DHCP pools and VLANs.
- Plan for growth with spare space and readable boundaries; document in a spreadsheet or IPAM.
- Larger blocks must start on their boundary (multiples of the block size).

```quiz
Q: You need 12 subnets. How many bits must you borrow?
A: 4
H: 2^3 = 8 is too few.
Q: From a /24, you need subnets of at least 50 hosts each. Which prefix do you use?
A: /26 | 26
Q: How many /26 subnets fit in a /24?
A: 4
Q: You need 1,000 hosts in one subnet. What is the largest prefix (smallest network) that fits?
A: /22 | 22
Q: What is the network address of the 5th /27 subnet of 192.168.50.0/24?
A: 192.168.50.128
Q: What is the broadcast address of the 3rd /23 subnet of 10.10.0.0/16?
A: 10.10.5.255
H: The /23s are 10.10.0.0, 10.10.2.0, 10.10.4.0 …
Q: Can you get 10 equal subnets of 20 hosts each from one /24? (yes/no)
A: no
```
